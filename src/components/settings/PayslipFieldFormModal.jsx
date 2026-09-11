import { useEffect, useState } from 'react'

const emptyForm = {
  name: '',
  category: 'earning',
  fieldType: 'amount',
}

const PayslipFieldFormModal = ({
  open,
  mode = 'add',
  field,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && field) {
      setForm({
        name: field.name || '',
        category: field.category || 'earning',
        fieldType: field.fieldType || 'amount',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [open, mode, field])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) {
      nextErrors.name = 'Field name is required'
    }
    if (!form.category) {
      nextErrors.category = 'Category is required'
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSubmit(form)
  }

  if (!open) return null

  const lockCategory = mode === 'edit' && field?.isSystem

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--sm" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>{mode === 'edit' ? 'Edit Payslip Field' : 'Add Payslip Field'}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Field Name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input--error' : ''}
              placeholder="e.g. Tax, Bonus, Allowance"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={lockCategory}
              className={errors.category ? 'input--error' : ''}
            >
              <option value="earning">Earning (adds to net salary)</option>
              <option value="deduction">Deduction (subtracts from net salary)</option>
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fieldType">Type</label>
            <select id="fieldType" name="fieldType" value={form.fieldType} disabled>
              <option value="amount">Amount</option>
            </select>
          </div>

          {mode === 'edit' && field?.fieldKey && (
            <p className="settings-hint">Field key: {field.fieldKey}</p>
          )}

          <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting
                ? 'Saving...'
                : mode === 'edit'
                  ? 'Update Field'
                  : 'Add Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PayslipFieldFormModal
