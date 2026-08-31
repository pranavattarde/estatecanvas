// src/components/Header.jsx

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand">
          {/* Geometric NS logo mark */}
          <div className="brand-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 16L3 4L9 4L17 14L17 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">EstateCanvas</span>
            <span className="brand-caption">Property Post Maker</span>
          </div>
        </div>

        <div className="header-badge" aria-label="Built with love by Pranav Attarde">
          Built with ❤️ by Pranav Attarde
        </div>
      </div>
    </header>
  );
}
