// src/components/PropertyPost.jsx
import { MapPin } from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────── */

function splitHighlights(raw) {
  if (!raw || !raw.trim()) return [];

  // Normalise bullet/dot lookalikes → standard middle dot U+00B7
  const str = raw.replace(/[\u2022\u2024\u22C5\u2027]/g, '\u00B7').trim();

  let parts;
  if (/[\u00B7|]/.test(str)) {
    // Middle dot · or pipe | — the primary separators
    parts = str.split(/\s*[\u00B7|]\s*/);
  } else if (/\s[-\/]\s/.test(str)) {
    // " - " or " / " space-padded: safe — "sq.ft" is never split
    parts = str.split(/\s[-\/]\s/);
  } else if (/,/.test(str)) {
    parts = str.split(/\s*,\s*/);
  } else {
    parts = [str];
  }

  return parts.map((s) => s.trim()).filter(Boolean);
}

function getChips(data) {
  if (Array.isArray(data.enhancedChips) && data.enhancedChips.length > 0) {
    return data.enhancedChips;
  }
  return splitHighlights(data.highlights);
}

/** Wrap "4 BHK" portion in <em> for Luxury italic accent */
function titleParts(title) {
  if (!title) return '';
  const m = title.match(/^(\d+\s+(?:BHK|BK|BR|RHK|bed)[\w]*)/i);
  if (m) {
    return (
      <>
        <em>{m[1]}</em>
        {title.slice(m[1].length)}
      </>
    );
  }
  return title;
}

/* ─── LUXURY ────────────────────────────────────────────────
   Two-column composition:
   Left — brand / eyebrow / headline / location / price / chips / AI CTA
   Right — architectural SVG ornament panel
   ──────────────────────────────────────────────────────────── */

function LuxuryPost({ data }) {
  const chips = getChips(data);

  return (
    <div className="property-post post-luxury">
      {/* Top rule */}
      <div className="post-rule" />

      {/* Two-column body */}
      <div className="post-inner">

        {/* ── LEFT COLUMN ── */}
        <div className="post-left">

          {/* Brand */}
          <div className="brand-mark">
            <span className="brand-ns">NS REALTY</span>
            <div className="brand-sep" />
            <span className="brand-sub">Premium Properties</span>
          </div>

          {/* Eyebrow + rule */}
          <p className="eyebrow">Exclusive Property</p>
          <div className="title-rule" />

          {/* AI Marketing Headline (prominently featured when AI Enhanced) */}
          {data.aiHeadline && (
            <div className="post-ai-headline luxury">
              "{data.aiHeadline}"
            </div>
          )}

          {/* Factual Property Headline */}
          <h2 className="property-title">{titleParts(data.propertyType)}</h2>

          {/* Location */}
          <div className="location-row">
            <MapPin className="loc-icon" aria-hidden="true" />
            <span className="location-text">{data.location}</span>
          </div>

          {/* Price — strictly preserved */}
          <div className="price-block">
            <p className="price-label">Starting Price</p>
            <p className="price-value">{data.price}</p>
          </div>

          {/* Highlights */}
          <div className="highlights-row">
            {chips.map((c, i) => (
              <span key={i} className="highlight-chip">
                <span className="chip-dot" aria-hidden="true">·</span>
                {c}
              </span>
            ))}
          </div>

          {/* AI Call to Action Banner */}
          {data.aiCta && (
            <div className="post-ai-cta-bar luxury">
              <span className="cta-star" aria-hidden="true">✦</span>
              <span className="cta-text">{data.aiCta}</span>
            </div>
          )}

        </div>{/* /post-left */}

        {/* ── RIGHT COLUMN — decorative architectural panel ── */}
        <div className="post-right" aria-hidden="true">
          <svg
            className="arch-svg"
            viewBox="0 0 120 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="20" y="100" width="80" height="90" stroke="#1a1714" strokeWidth="0.8"/>
            <polyline points="10,100 60,40 110,100" stroke="#1a1714" strokeWidth="0.8"/>
            <line x1="35" y1="100" x2="35" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="55" y1="100" x2="55" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="65" y1="100" x2="65" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="85" y1="100" x2="85" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <rect x="28" y="110" width="18" height="22" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="37" y1="110" x2="37" y2="132" stroke="#1a1714" strokeWidth="0.3"/>
            <line x1="28" y1="121" x2="46" y2="121" stroke="#1a1714" strokeWidth="0.3"/>
            <rect x="74" y="110" width="18" height="22" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="83" y1="110" x2="83" y2="132" stroke="#1a1714" strokeWidth="0.3"/>
            <line x1="74" y1="121" x2="92" y2="121" stroke="#1a1714" strokeWidth="0.3"/>
            <rect x="50" y="155" width="20" height="35" stroke="#1a1714" strokeWidth="0.6"/>
            <line x1="60" y1="155" x2="60" y2="190" stroke="#1a1714" strokeWidth="0.3"/>
            <line x1="15" y1="194" x2="105" y2="194" stroke="#1a1714" strokeWidth="0.6"/>
            <line x1="10" y1="197" x2="110" y2="197" stroke="#1a1714" strokeWidth="0.4"/>
            <line x1="10" y1="100" x2="110" y2="100" stroke="#b8935a" strokeWidth="0.8"/>
            <circle cx="60" cy="24" r="8" stroke="#b8935a" strokeWidth="0.7"/>
            <circle cx="60" cy="24" r="4" stroke="#b8935a" strokeWidth="0.4"/>
          </svg>

          <div style={{
            marginTop: 'clamp(8px,2cqw,18px)',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: 'clamp(4px,0.75cqw,7.5px)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(26,23,20,0.25)',
            fontWeight: 600,
            userSelect: 'none',
          }}>
            Architecture &amp; Design
          </div>
        </div>
      </div>{/* /post-inner */}

      {/* Footer */}
      <footer className="post-footer">
        <span className="footer-brand">NS REALTY</span>
        <div className="footer-right">
          <span className="footer-cta">Schedule a Visit</span>
          <span className="footer-phone">+91 98765 43210</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── MINIMAL ───────────────────────────────────────────────
   Swiss / ITC editorial. Black type on white.
   ──────────────────────────────────────────────────────────── */

function MinimalPost({ data }) {
  const chips = getChips(data);

  return (
    <div className="property-post post-minimal">
      <div className="post-content">

        {/* Brand */}
        <div className="brand-row">
          <span className="brand-ns">NS REALTY</span>
          <span className="brand-tagline">Real Estate</span>
        </div>

        {/* Eyebrow */}
        <p className="eyebrow">Property Listing</p>

        {/* AI Marketing Headline */}
        {data.aiHeadline && (
          <div className="post-ai-headline minimal">
            "{data.aiHeadline}"
          </div>
        )}

        {/* Headline — original property name */}
        <h2 className="property-title">{data.propertyType}</h2>

        {/* Location */}
        <div className="location-row">
          <MapPin className="loc-icon" aria-hidden="true" />
          <span className="location-text">{data.location}</span>
        </div>

        {/* Highlights */}
        <div className="highlights-row">
          {chips.map((c, i) => (
            <span key={i} className="highlight-chip">
              <span className="chip-dot" aria-hidden="true">▪</span>
              {c}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="price-section">
          <p className="price-label">Price</p>
          <p className="price-value">{data.price}</p>
        </div>

        {/* AI Call to Action Banner */}
        {data.aiCta && (
          <div className="post-ai-cta-bar minimal">
            <span className="cta-star" aria-hidden="true">✦</span>
            <span className="cta-text">{data.aiCta}</span>
          </div>
        )}

      </div>

      <footer className="post-footer">
        <span className="footer-brand">NS REALTY</span>
        <div className="footer-right">
          <span className="footer-cta">Schedule a Visit</span>
          <span className="footer-phone">+91 98765 43210</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── MIDNIGHT ──────────────────────────────────────────────
   Near-black field. Ivory type. Gold as a precision accent.
   ──────────────────────────────────────────────────────────── */

function MidnightPost({ data }) {
  const chips = getChips(data);

  return (
    <div className="property-post post-midnight">
      {/* Background rings */}
      <div className="post-bg" aria-hidden="true">
        <div className="bg-ring" style={{ width: '70%', aspectRatio: '1', right: '-18%', top: '-18%' }} />
        <div className="bg-ring" style={{ width: '42%', aspectRatio: '1', right: '-8%',  top: '-8%'  }} />
        <div className="bg-ring" style={{ width: '30%', aspectRatio: '1', left: '-8%',   bottom: '12%' }} />
      </div>

      {/* Gold top rule */}
      <div className="post-rule" />

      <div className="post-content">

        {/* Brand */}
        <div className="brand-row">
          <div className="brand-left">
            <span className="brand-ns">NS REALTY</span>
            <span className="brand-pip" />
            <span className="brand-sub">Premium</span>
          </div>
          {/* Diamond ornament */}
          <svg className="brand-ornament" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 1L19 10L10 19L1 10Z" stroke="#b8935a" strokeWidth="1"/>
            <path d="M10 5L15 10L10 15L5 10Z" stroke="#b8935a" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Eyebrow + rule */}
        <p className="eyebrow">Featured Property</p>
        <div className="title-rule" />

        {/* AI Marketing Headline */}
        {data.aiHeadline && (
          <div className="post-ai-headline midnight">
            "{data.aiHeadline}"
          </div>
        )}

        {/* Headline — original property name */}
        <h2 className="property-title">{data.propertyType}</h2>

        {/* Location */}
        <div className="location-row">
          <MapPin className="loc-icon" aria-hidden="true" />
          <span className="location-text">{data.location}</span>
        </div>

        {/* Price */}
        <div className="price-block">
          <p className="price-label">Investment</p>
          <p className="price-value">{data.price}</p>
        </div>

        {/* Highlights */}
        <div className="highlights-row">
          {chips.map((c, i) => (
            <span key={i} className="highlight-chip">
              <span className="chip-dot" aria-hidden="true">·</span>
              {c}
            </span>
          ))}
        </div>

        {/* AI Call to Action Banner */}
        {data.aiCta && (
          <div className="post-ai-cta-bar midnight">
            <span className="cta-star" aria-hidden="true">✦</span>
            <span className="cta-text">{data.aiCta}</span>
          </div>
        )}

      </div>

      <footer className="post-footer">
        <span className="footer-brand">NS REALTY</span>
        <div className="footer-right">
          <span className="footer-cta">Schedule a Visit</span>
          <span className="footer-phone">+91 98765 43210</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────── */

export default function PropertyPost({ data, template }) {
  switch (template) {
    case 'minimal':  return <MinimalPost  data={data} />;
    case 'midnight': return <MidnightPost data={data} />;
    default:         return <LuxuryPost   data={data} />;
  }
}
