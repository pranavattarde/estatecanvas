// src/components/PropertyForm.jsx
import { RotateCcw, Sparkles, CheckCircle } from 'lucide-react';
import TemplateSelector from './TemplateSelector.jsx';

export default function PropertyForm({
  formData,
  onChange,
  onReset,
  onGenerate,
  template,
  onTemplateChange,
  errors,
  generateStatus,
}) {
  const handleChange = (field) => (e) => onChange(field, e.target.value);

  return (
    <aside className="form-panel" aria-label="Property details form">
      <h1 className="form-heading">Create your listing</h1>
      <p className="form-subheading">
        Turn property details into a share-ready creative.
      </p>

      {/* Template Selector */}
      <TemplateSelector value={template} onChange={onTemplateChange} />

      <div className="divider" />

      <form
        className="fields-stack"
        onSubmit={(e) => { e.preventDefault(); onGenerate(); }}
        noValidate
      >
        <div className="field-group">
          <label className="field-label" htmlFor="f-property">
            Property &amp; Type<span aria-hidden="true">*</span>
          </label>
          <input
            id="f-property"
            type="text"
            className={`field-input${errors.propertyType ? ' error' : ''}`}
            value={formData.propertyType}
            onChange={handleChange('propertyType')}
            placeholder="e.g. 4 BHK Luxury Villa, Ansal Golf City"
            aria-required="true"
            aria-invalid={!!errors.propertyType}
            aria-describedby={errors.propertyType ? 'err-property' : undefined}
          />
          {errors.propertyType && (
            <span id="err-property" className="field-error" role="alert">
              {errors.propertyType}
            </span>
          )}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="f-location">
            Location<span aria-hidden="true">*</span>
          </label>
          <input
            id="f-location"
            type="text"
            className={`field-input${errors.location ? ' error' : ''}`}
            value={formData.location}
            onChange={handleChange('location')}
            placeholder="e.g. Sushant Golf City, Lucknow"
            aria-required="true"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'err-location' : undefined}
          />
          {errors.location && (
            <span id="err-location" className="field-error" role="alert">
              {errors.location}
            </span>
          )}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="f-price">
            Price<span aria-hidden="true">*</span>
          </label>
          <input
            id="f-price"
            type="text"
            className={`field-input${errors.price ? ' error' : ''}`}
            value={formData.price}
            onChange={handleChange('price')}
            placeholder="e.g. ₹2.5 Cr onwards"
            aria-required="true"
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? 'err-price' : undefined}
          />
          {errors.price && (
            <span id="err-price" className="field-error" role="alert">
              {errors.price}
            </span>
          )}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="f-highlights">
            Highlights<span aria-hidden="true">*</span>
          </label>
          <textarea
            id="f-highlights"
            className={`field-textarea${errors.highlights ? ' error' : ''}`}
            value={formData.highlights}
            onChange={handleChange('highlights')}
            placeholder="e.g. 3000 sq.ft · Corner plot · Ready to move"
            rows={2}
            aria-required="true"
            aria-invalid={!!errors.highlights}
            aria-describedby={errors.highlights ? 'err-highlights' : 'hint-highlights'}
          />
          {errors.highlights ? (
            <span id="err-highlights" className="field-error" role="alert">
              {errors.highlights}
            </span>
          ) : (
            <span id="hint-highlights" className="download-note" style={{ textAlign: 'left' }}>
              Separate items with · (middle dot)
            </span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onReset}
            id="btn-reset"
            aria-label="Reset form to default values"
          >
            <RotateCcw size={13} />
            Reset
          </button>
          <button
            type="submit"
            className={`btn btn-primary${generateStatus === 'success' ? ' success' : ''}`}
            id="btn-generate"
          >
            {generateStatus === 'success' ? (
              <>
                <CheckCircle size={13} />
                Post ready
              </>
            ) : (
              <>
                <Sparkles size={13} />
                Generate Post
              </>
            )}
          </button>
        </div>
      </form>
    </aside>
  );
}
