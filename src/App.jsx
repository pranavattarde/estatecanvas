// src/App.jsx
import { useState, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

import Header      from './components/Header.jsx';
import PropertyForm from './components/PropertyForm.jsx';
import PropertyPost from './components/PropertyPost.jsx';
import AiEnhancer  from './components/AiEnhancer.jsx';

/* ── constants ─────────────────────────────────────────────── */

const DEFAULT_FORM = {
  propertyType: '4 BHK Luxury Villa, Ansal Golf City',
  location:     'Sushant Golf City, Lucknow',
  price:        '₹2.5 Cr onwards',
  highlights:   '3000 sq.ft · Corner plot · Ready to move',
};

function validate(formData) {
  const errs = {};
  if (!formData.propertyType.trim()) errs.propertyType = 'Property & Type is required.';
  if (!formData.location.trim())     errs.location     = 'Location is required.';
  if (!formData.price.trim())        errs.price        = 'Price is required.';
  if (!formData.highlights.trim())   errs.highlights   = 'Highlights are required.';
  return errs;
}

/* ── Toast ─────────────────────────────────────────────────── */

function Toast({ messages }) {
  return (
    <div className="toast-area" aria-live="polite" aria-atomic="true">
      {messages.map((m) => (
        <div key={m.id} className={`toast${m.type === 'success' ? ' success' : ''}`}>
          {m.text}
        </div>
      ))}
    </div>
  );
}

/* ── App ────────────────────────────────────────────────────── */

export default function App() {
  /* Task 1 state — unchanged */
  const [formData, setFormData]        = useState({ ...DEFAULT_FORM });
  const [template, setTemplate]        = useState('luxury');
  const [transitionKey, setTransKey]   = useState(0);
  const [errors, setErrors]            = useState({});
  const [generateStatus, setGenStatus] = useState('idle');
  const [downloading, setDownloading]  = useState(false);
  const [toasts, setToasts]            = useState([]);

  /* Task 2 — AI state */
  const [aiStatus, setAiStatus]   = useState('idle');   // 'idle'|'loading'|'success'|'error'
  const [aiData,   setAiData]     = useState(null);     // { headline, enhancedHighlights, cta, caption, hashtags }
  const [aiError,  setAiError]    = useState('');
  const [aiMode,   setAiMode]     = useState('original'); // 'original' | 'ai'

  const postRef = useRef(null);

  /* ── helpers ──────────────────────────────────────────────── */

  const addToast = useCallback((text, type = 'default') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2700);
  }, []);

  /* ── Task 1 handlers ─────────────────────────────────────── */

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FORM });
    setTemplate('luxury');
    setTransKey((k) => k + 1);
    setErrors({});
    setGenStatus('idle');
    // Reset AI state too
    setAiStatus('idle');
    setAiData(null);
    setAiError('');
    setAiMode('original');
  };

  const handleGenerate = () => {
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setGenStatus('success');
    addToast('✓ Post ready — looking great!', 'success');
    setTimeout(() => setGenStatus('idle'), 2500);
  };

  const handleTemplateChange = (t) => {
    if (t === template) return;
    setTemplate(t);
    setTransKey((k) => k + 1);
  };

  /* ── Task 2 handlers ─────────────────────────────────────── */

  const handleEnhance = useCallback(async () => {
    // Client-side guard — all four fields must have values
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setAiStatus('loading');
    setAiError('');

    try {
      const isDemoMock = typeof window !== 'undefined' && (
        window.location.search.includes('mock=1') ||
        window.location.search.includes('demo=1') ||
        window.location.search.includes('ai=mock')
      );

      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType: formData.propertyType.trim(),
          location:     formData.location.trim(),
          price:        formData.price.trim(),
          highlights:   formData.highlights.trim(),
          ...(isDemoMock ? { mock: true } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error || 'AI enhancement is temporarily unavailable.';
        setAiStatus('error');
        setAiError(msg);
        return;
      }

      setAiData(data);
      setAiStatus('success');
      setAiMode('original'); // Start in original mode so user sees both
      addToast('✓ AI copy generated!', 'success');
    } catch {
      setAiStatus('error');
      setAiError('AI enhancement is temporarily unavailable. Your original post is still ready to use.');
    }
  }, [formData, addToast]);

  const handleAiApply = () => {
    setAiMode('ai');
    setTransKey((k) => k + 1); // trigger post transition
    addToast('AI copy applied to preview.', 'success');
  };

  const handleAiClear = () => {
    setAiData(null);
    setAiStatus('idle');
    setAiError('');
    setAiMode('original');
  };

  const handleModeSwitch = (mode) => {
    if (mode === aiMode) return;
    setAiMode(mode);
    setTransKey((k) => k + 1);
  };

  /* ── Compute what the post actually renders ─────────────────
     Original mode: raw formData (Task 1 — always works)
     AI mode: same formData but with aiHeadline + aiHighlights + aiCta
     Location and price are NEVER replaced by AI values.
  ───────────────────────────────────────────────────────────── */
  const postData = (() => {
    if (aiMode === 'ai' && aiData) {
      return {
        ...formData,
        // Replace the headline shown in the post with the AI marketing headline
        aiHeadline: aiData.headline,
        // Replace highlight chips with AI-enhanced highlights
        highlights: aiData.enhancedHighlights.join(' · '),
        // AI CTA shown in footer instead of default
        aiCta: aiData.cta,
      };
    }
    return formData;
  })();

  /* ── Download PNG ──────────────────────────────────────────── */

  const handleDownload = useCallback(async () => {
    if (!postRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(postRef.current, {
        pixelRatio: 3,
        quality: 1,
        cacheBust: true,
        style: { borderRadius: '0' },
      });
      const link = document.createElement('a');
      link.download = 'estatecanvas-property-post.png';
      link.href = dataUrl;
      link.click();
      addToast('PNG downloaded successfully.', 'success');
    } catch (err) {
      console.error('Export error:', err);
      addToast('Export failed — please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  }, [downloading, addToast]);

  /* ── Render ─────────────────────────────────────────────────── */

  const showModeSwitch = aiStatus === 'success' && aiData;

  return (
    <div className="app-wrapper">
      <Header />

      <main className="workspace">
        {/* LEFT — Form + AI enhancer */}
        <div className="form-column">
          <PropertyForm
            formData={formData}
            onChange={handleChange}
            onReset={handleReset}
            onGenerate={handleGenerate}
            template={template}
            onTemplateChange={handleTemplateChange}
            errors={errors}
            generateStatus={generateStatus}
          />

          <AiEnhancer
            formData={formData}
            aiData={aiData}
            aiStatus={aiStatus}
            aiError={aiError}
            isApplied={aiMode === 'ai'}
            onEnhance={handleEnhance}
            onApply={handleAiApply}
            onClear={handleAiClear}
          />
        </div>

        {/* RIGHT — Preview */}
        <div className="preview-panel">
          <div className="preview-header">
            <span className="preview-label">Live Preview</span>
            <div className="preview-header-right">
              {/* Original / AI mode switcher — only shown when AI results exist */}
              {showModeSwitch && (
                <div className="mode-switcher" role="group" aria-label="Switch between original and AI-enhanced preview">
                  <button
                    type="button"
                    className={`mode-btn${aiMode === 'original' ? ' active' : ''}`}
                    onClick={() => handleModeSwitch('original')}
                    aria-pressed={aiMode === 'original'}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    className={`mode-btn${aiMode === 'ai' ? ' active' : ''}`}
                    onClick={() => handleModeSwitch('ai')}
                    aria-pressed={aiMode === 'ai'}
                  >
                    AI Enhanced
                  </button>
                </div>
              )}
              <span className="preview-size-info">1080 × 1080</span>
            </div>
          </div>

          <div className="preview-wrapper">
            <div className="post-scale-container">
              <div
                ref={postRef}
                className="property-post-outer"
                style={{ containerType: 'size' }}
              >
                <div key={transitionKey} className="post-enter">
                  <PropertyPost data={postData} template={template} />
                </div>
              </div>
            </div>
          </div>

          {/* Download */}
          <div className="download-area">
            <button
              type="button"
              className="btn btn-download"
              onClick={handleDownload}
              disabled={downloading}
              id="btn-download-png"
              aria-label="Download property post as PNG image"
            >
              {downloading ? (
                <>
                  <svg
                    width="14" height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Preparing…
                </>
              ) : (
                <>
                  <Download size={14} />
                  Download PNG
                </>
              )}
            </button>
            <p className="download-note">
              {showModeSwitch
                ? `Exports ${aiMode === 'ai' ? 'AI-enhanced' : 'original'} post · 3240 × 3240 px`
                : 'Exports at 3× resolution — 3240 × 3240 px.'}
            </p>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <strong>EstateCanvas</strong> — Property Post Maker &nbsp;·&nbsp; Built with ❤️ by Pranav Attarde
      </footer>

      <Toast messages={toasts} />
    </div>
  );
}
