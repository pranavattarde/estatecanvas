// src/components/AiEnhancer.jsx
// "AI Property Copy Enhancer" — Task 2 feature.
// Calls POST /api/enhance with the four form values.
// Displays results in an "AI Marketing Kit" panel.
// Allows copying the caption and applying AI copy to the post.

import { useState, useCallback } from 'react';
import { Sparkles, Copy, CheckCheck, AlertCircle } from 'lucide-react';

/* ── constants ─────────────────────────────────────────────── */

const STATUS = {
  IDLE:     'idle',
  LOADING:  'loading',
  SUCCESS:  'success',
  ERROR:    'error',
};

/* ── helpers ───────────────────────────────────────────────── */

function validate(formData) {
  const errs = {};
  if (!formData.propertyType?.trim()) errs.propertyType = true;
  if (!formData.location?.trim())     errs.location     = true;
  if (!formData.price?.trim())        errs.price        = true;
  if (!formData.highlights?.trim())   errs.highlights   = true;
  return errs;
}

/* ── sub-components ────────────────────────────────────────── */

function AiResultPanel({ aiData, isApplied, onApply, onClear }) {
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied'

  const handleCopyCaption = useCallback(async () => {
    const text = [aiData.caption, aiData.hashtags.join(' ')].join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopyState('copied');
    setTimeout(() => setCopyState('idle'), 2000);
  }, [aiData]);

  return (
    <div className="ai-result-panel" aria-label="AI Marketing Kit results">
      <div className="ai-result-header">
        <span className="ai-result-title">AI Marketing Kit</span>
        <button
          type="button"
          className="ai-clear-btn"
          onClick={onClear}
          aria-label="Clear AI results"
        >
          Clear
        </button>
      </div>

      {/* Marketing Headline */}
      <div className="ai-result-section">
        <p className="ai-result-label">Marketing Headline</p>
        <p className="ai-result-headline">"{aiData.headline}"</p>
      </div>

      {/* Smart Highlights */}
      <div className="ai-result-section">
        <p className="ai-result-label">Smart Highlights</p>
        <ul className="ai-highlights-list">
          {aiData.enhancedHighlights.map((h, i) => (
            <li key={i} className="ai-highlight-item">
              <span className="ai-bullet" aria-hidden="true">·</span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="ai-result-section">
        <p className="ai-result-label">Call to Action</p>
        <p className="ai-result-cta">{aiData.cta}</p>
      </div>

      {/* Caption */}
      <div className="ai-result-section">
        <p className="ai-result-label">Social Caption</p>
        <p className="ai-result-caption">{aiData.caption}</p>
      </div>

      {/* Hashtags */}
      <div className="ai-result-section">
        <p className="ai-result-label">Hashtags</p>
        <p className="ai-hashtags">{aiData.hashtags.join(' ')}</p>
      </div>

      {/* Actions */}
      <div className="ai-result-actions">
        <button
          type="button"
          className="btn btn-ghost ai-copy-btn"
          onClick={handleCopyCaption}
          aria-label={copyState === 'copied' ? 'Caption copied to clipboard' : 'Copy caption and hashtags'}
          aria-live="polite"
        >
          {copyState === 'copied' ? (
            <>
              <CheckCheck size={13} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy Caption
            </>
          )}
        </button>

        <button
          type="button"
          className={`btn btn-apply-ai${isApplied ? ' applied' : ''}`}
          onClick={onApply}
          id="btn-apply-ai"
          aria-label={isApplied ? 'AI copy is currently active on post' : 'Apply AI copy to post'}
        >
          {isApplied ? '✓ AI Copy Active' : 'Apply AI Copy'}
        </button>
      </div>
    </div>
  );
}

/* ── main export ───────────────────────────────────────────── */

export default function AiEnhancer({
  formData,
  aiData,
  aiStatus,
  aiError,
  isApplied,
  onEnhance,
  onApply,
  onClear,
}) {
  const fieldErrors = validate(formData);
  const hasAllFields = Object.keys(fieldErrors).length === 0;

  const isLoading = aiStatus === STATUS.LOADING;

  return (
    <div className="ai-enhancer-section" aria-label="AI Property Copy Enhancer">
      {/* Section divider */}
      <div className="ai-section-divider">
        <span className="ai-section-label">AI Enhancement</span>
      </div>

      {/* Trigger row */}
      <div className="ai-trigger-row">
        <div className="ai-trigger-meta">
          <span className="ai-badge" aria-label="AI powered feature">AI</span>
          <p className="ai-trigger-desc">
            Turn raw property details into polished marketing copy.
          </p>
        </div>

        <button
          type="button"
          className={`btn btn-enhance${isLoading ? ' loading' : ''}`}
          onClick={onEnhance}
          disabled={isLoading}
          id="btn-enhance-ai"
          aria-label={isLoading ? 'Enhancing property copy with AI' : 'Enhance with AI'}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                width="13" height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: 'spin 0.9s linear infinite', flexShrink: 0 }}
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Enhancing…
            </>
          ) : (
            <>
              <Sparkles size={13} />
              Enhance with AI
            </>
          )}
        </button>
      </div>

      {/* Field hint when fields are missing */}
      {!hasAllFields && !isLoading && (
        <p className="ai-field-hint" role="status">
          Fill in all four fields above to enable AI enhancement.
        </p>
      )}

      {/* Error state */}
      {aiStatus === STATUS.ERROR && aiError && (
        <div className="ai-error-msg" role="alert">
          <AlertCircle size={13} aria-hidden="true" />
          {aiError}
        </div>
      )}

      {/* Results panel */}
      {aiStatus === STATUS.SUCCESS && aiData && (
        <AiResultPanel
          aiData={aiData}
          isApplied={isApplied}
          onApply={onApply}
          onClear={onClear}
        />
      )}
    </div>
  );
}
