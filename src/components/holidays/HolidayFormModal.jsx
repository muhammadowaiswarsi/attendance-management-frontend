import { useEffect, useState } from 'react'

const emptyForm = {
  name: '',
  date: '',
  description: '',
}

const HolidayFormModal = ({
  open,
  mode = 'add',
  holiday,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && holiday) {
      setForm({
        name: holiday.name || '',
        date: holiday.date || '',
        description: holiday.description || '',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [open, mode, holiday])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) {
      nextErrors.name = 'Holiday name is required'
    }
    if (!form.date) {
      nextErrors.date = 'Holiday date is required'
    }
    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }
    onSubmit(form)
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--sm" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>{mode === 'edit' ? 'Edit Holiday' : 'Add Holiday'}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Holiday Name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input--error' : ''}
              placeholder="e.g. Independence Day"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Holiday Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? 'input--error' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details about the holiday"
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting
                ? 'Saving...'
                : mode === 'edit'
                  ? 'Update Holiday'
                  : 'Add Holiday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HolidayFormModal
