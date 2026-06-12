import { useState } from 'react'
import { validateChangePasswordForm } from '../../utils/validation'

const emptyForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const ChangePasswordForm = ({ onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateChangePasswordForm(form)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }
    onSubmit(form, () => setForm(emptyForm))
  }

  return (
    <form className="account-password-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          className={errors.currentPassword ? 'input--error' : ''}
          placeholder="Enter current password"
        />
        {errors.currentPassword && (
          <span className="field-error">{errors.currentPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          className={errors.newPassword ? 'input--error' : ''}
          placeholder="Minimum 8 characters"
        />
        {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'input--error' : ''}
          placeholder="Re-enter new password"
        />
        {errors.confirmPassword && (
          <span className="field-error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  )
}

export default ChangePasswordForm
