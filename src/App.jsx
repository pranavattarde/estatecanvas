// src/App.jsx
import { useState, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

import Header from './components/Header.jsx';
import PropertyForm from './components/PropertyForm.jsx';
import PropertyPost from './components/PropertyPost.jsx';

/* ---------- constants ------------------------------------- */

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

/* ---------- Toast component ------------------------------- */

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

/* ========================================================== */

export default function App() {
  const [formData, setFormData]         = useState({ ...DEFAULT_FORM });
  const [template, setTemplate]         = useState('luxury');
  const [errors, setErrors]             = useState({});
  const [generateStatus, setGenStatus]  = useState('idle'); // 'idle' | 'success'
  const [downloading, setDownloading]   = useState(false);
  const [toasts, setToasts]             = useState([]);

  const postRef = useRef(null);

  /* ---- helpers ------------------------------------------ */

  const addToast = useCallback((text, type = 'default') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2700);
  }, []);

  /* ---- form handlers ------------------------------------ */

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FORM });
    setErrors({});
    setGenStatus('idle');
  };

  const handleGenerate = () => {
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setGenStatus('success');
    addToast('✓ Post ready — looking great!', 'success');
    setTimeout(() => setGenStatus('idle'), 2500);
  };

  /* ---- template switcher -------------------------------- */

  const handleTemplateChange = (t) => {
    setTemplate(t);
  };

  /* ---- download PNG ------------------------------------- */

  const handleDownload = useCallback(async () => {
    if (!postRef.current || downloading) return;

    setDownloading(true);
    try {
      // Capture at 3× pixel ratio — yields a crisp ~3240×3240 px image
      const dataUrl = await toPng(postRef.current, {
        pixelRatio: 3,
        quality: 1,
        cacheBust: true,
        style: {
          borderRadius: '0',
        },
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

  /* ---- render ------------------------------------------- */

  return (
    <div className="app-wrapper">
      <Header />

      <main className="workspace">
        {/* LEFT — Form panel */}
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

        {/* RIGHT — Preview panel */}
        <div className="preview-panel">
          <div className="preview-header">
            <span className="preview-label">Live Preview</span>
            <span className="preview-size-info">1080 × 1080</span>
          </div>

          <div className="preview-wrapper">
            <div className="post-scale-container">
              {/* ref captures the post element for PNG export */}
              <div
                ref={postRef}
                className="property-post-outer"
                style={{ containerType: 'size' }}
              >
                <PropertyPost data={formData} template={template} />
              </div>
            </div>
          </div>

          {/* Download button */}
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
              Exports at 2× resolution for crisp social media use.
            </p>
          </div>
        </div>
      </main>

      {/* Site footer */}
      <footer className="site-footer">
        <strong>EstateCanvas</strong> — Property Post Maker &nbsp;·&nbsp; Built with ❤️ by Pranav Attarde
      </footer>

      <Toast messages={toasts} />
    </div>
  );
}
