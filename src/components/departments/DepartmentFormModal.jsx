import { useEffect, useState } from 'react'

const emptyForm = {
  name: '',
  description: '',
}

const DepartmentFormModal = ({
  open,
  mode = 'add',
  department,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && department) {
      setForm({
        name: department.name || '',
        description: department.description || '',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [open, mode, department])

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
      nextErrors.name = 'Department name is required'
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
          <h2>{mode === 'edit' ? 'Edit Department' : 'Add Department'}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Department Name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input--error' : ''}
              placeholder="e.g. Engineering"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the department"
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
                  ? 'Update Department'
                  : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DepartmentFormModal
