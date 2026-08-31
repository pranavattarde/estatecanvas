// src/components/PropertyPost.jsx
import { MapPin } from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────── */

function splitHighlights(str) {
  return str
    .split(/[·•|\/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Wrap "4 BHK" portion in <em> for Luxury italic accent */
function titleParts(title) {
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
   Left — brand / eyebrow / headline / location / price / chips
   Right — architectural SVG ornament panel
   ──────────────────────────────────────────────────────────── */

function LuxuryPost({ data }) {
  const chips = splitHighlights(data.highlights);

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

          {/* Headline */}
          <h2 className="property-title">{titleParts(data.propertyType)}</h2>

          {/* Location */}
          <div className="location-row">
            <MapPin className="loc-icon" aria-hidden="true"
              style={{ width: 'clamp(8px,1.5cqw,15px)', height: 'clamp(8px,1.5cqw,15px)', flexShrink: 0 }} />
            <span className="location-text">{data.location}</span>
          </div>

          {/* Price */}
          <div className="price-block">
            <p className="price-label">Starting Price</p>
            <p className="price-value">{data.price}</p>
          </div>

          {/* Highlights */}
          <div className="highlights-row">
            {chips.map((c, i) => (
              <span key={i} className="highlight-chip">{c}</span>
            ))}
          </div>

        </div>{/* /post-left */}

        {/* ── RIGHT COLUMN — decorative architectural panel ── */}
        <div className="post-right" aria-hidden="true">
          {/* Architectural elevation SVG — floor plan / façade lines */}
          <svg
            className="arch-svg"
            viewBox="0 0 120 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base structure */}
            <rect x="20" y="100" width="80" height="90" stroke="#1a1714" strokeWidth="0.8"/>
            {/* Roof / pediment */}
            <polyline points="10,100 60,40 110,100" stroke="#1a1714" strokeWidth="0.8"/>
            {/* Pillar lines */}
            <line x1="35" y1="100" x2="35" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="55" y1="100" x2="55" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="65" y1="100" x2="65" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="85" y1="100" x2="85" y2="190" stroke="#1a1714" strokeWidth="0.5"/>
            {/* Window grids */}
            <rect x="28" y="110" width="18" height="22" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="37" y1="110" x2="37" y2="132" stroke="#1a1714" strokeWidth="0.3"/>
            <line x1="28" y1="121" x2="46" y2="121" stroke="#1a1714" strokeWidth="0.3"/>
            <rect x="74" y="110" width="18" height="22" stroke="#1a1714" strokeWidth="0.5"/>
            <line x1="83" y1="110" x2="83" y2="132" stroke="#1a1714" strokeWidth="0.3"/>
            <line x1="74" y1="121" x2="92" y2="121" stroke="#1a1714" strokeWidth="0.3"/>
            {/* Door */}
            <rect x="50" y="155" width="20" height="35" stroke="#1a1714" strokeWidth="0.6"/>
            <line x1="60" y1="155" x2="60" y2="190" stroke="#1a1714" strokeWidth="0.3"/>
            {/* Steps */}
            <line x1="15" y1="194" x2="105" y2="194" stroke="#1a1714" strokeWidth="0.6"/>
            <line x1="10" y1="197" x2="110" y2="197" stroke="#1a1714" strokeWidth="0.4"/>
            {/* Gold accent — pediment cap */}
            <line x1="10" y1="100" x2="110" y2="100" stroke="#b8935a" strokeWidth="0.8"/>
            {/* Top ornament circle */}
            <circle cx="60" cy="24" r="8" stroke="#b8935a" strokeWidth="0.7"/>
            <circle cx="60" cy="24" r="4" stroke="#b8935a" strokeWidth="0.4"/>
          </svg>

          {/* Faint vertical text label */}
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
   Price anchored at bottom before footer.
   ──────────────────────────────────────────────────────────── */

function MinimalPost({ data }) {
  const chips = splitHighlights(data.highlights);

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

        {/* Headline */}
        <h2 className="property-title">{data.propertyType}</h2>

        {/* Location */}
        <div className="location-row">
          <MapPin aria-hidden="true"
            style={{ color: '#555', flexShrink: 0, marginTop: '0.1em',
                     width: 'clamp(8px,1.4cqw,14px)', height: 'clamp(8px,1.4cqw,14px)' }} />
          <span className="location-text">{data.location}</span>
        </div>

        {/* Highlights */}
        <div className="highlights-row">
          {chips.map((c, i) => (
            <span key={i} className="highlight-chip">{c}</span>
          ))}
        </div>

        {/* Price pinned to bottom */}
        <div className="price-section">
          <p className="price-label">Price</p>
          <p className="price-value">{data.price}</p>
        </div>

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
   Cormorant for the headline — rich editorial serif.
   ──────────────────────────────────────────────────────────── */

function MidnightPost({ data }) {
  const chips = splitHighlights(data.highlights);

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

        {/* Headline */}
        <h2 className="property-title">{data.propertyType}</h2>

        {/* Location */}
        <div className="location-row">
          <MapPin className="loc-icon" aria-hidden="true"
            style={{ width: 'clamp(8px,1.5cqw,15px)', height: 'clamp(8px,1.5cqw,15px)', flexShrink: 0 }} />
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
            <span key={i} className="highlight-chip">{c}</span>
          ))}
        </div>

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
