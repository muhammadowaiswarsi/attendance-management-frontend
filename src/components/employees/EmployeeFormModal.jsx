import { useEffect, useState } from 'react'
import { validateEmployeeForm } from '../../utils/validation'

const emptyForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  designation: '',
  joiningDate: '',
  salary: '',
  address: '',
  departmentId: '',
}

const EmployeeFormModal = ({
  open,
  mode = 'add',
  employee,
  departments = [],
  onClose,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && employee) {
      setForm({
        fullName: employee.fullName || '',
        email: employee.email || '',
        phoneNumber: employee.phoneNumber || '',
        designation: employee.designation || '',
        joiningDate: employee.joiningDate || '',
        salary: employee.salary != null ? String(employee.salary) : '',
        address: employee.address || '',
        departmentId: String(employee.departmentId || ''),
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [open, mode, employee])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateEmployeeForm(form, { isEdit: mode === 'edit' })
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }
    onSubmit(form)
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{mode === 'edit' ? 'Edit Employee' : 'Add Employee'}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'input--error' : ''}
                placeholder="Enter full name"
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={mode === 'edit'}
                className={errors.email ? 'input--error' : ''}
                placeholder="name@company.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+92 300 0000000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Job title"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="joiningDate">Joining Date *</label>
              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                className={errors.joiningDate ? 'input--error' : ''}
              />
              {errors.joiningDate && (
                <span className="field-error">{errors.joiningDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary *</label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="1"
                step="1"
                value={form.salary}
                onChange={handleChange}
                className={errors.salary ? 'input--error' : ''}
                placeholder="50000"
              />
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="departmentId">Department *</label>
            <select
              id="departmentId"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              className={errors.departmentId ? 'input--error' : ''}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <span className="field-error">{errors.departmentId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Street, city, country"
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeFormModal
