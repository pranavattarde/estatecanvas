// src/components/TemplateSelector.jsx

const TEMPLATES = [
  { id: 'luxury',   label: 'Luxury' },
  { id: 'minimal',  label: 'Minimal' },
  { id: 'midnight', label: 'Midnight' },
];

export default function TemplateSelector({ value, onChange }) {
  return (
    <div>
      <p className="form-section-label">Template</p>
      <div className="template-selector" role="group" aria-label="Select card template">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`template-btn${value === t.id ? ' active' : ''}`}
            onClick={() => onChange(t.id)}
            aria-pressed={value === t.id}
            id={`template-btn-${t.id}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
