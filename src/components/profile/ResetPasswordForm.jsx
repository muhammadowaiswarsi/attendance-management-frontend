import { useState } from 'react'
import { validateSetPasswordForm } from '../../utils/validation'

const ResetPasswordForm = ({ onSubmit, submitting }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationErrors = validateSetPasswordForm({ password, confirmPassword })
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    try {
      await onSubmit(password)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to reset password. The link may be invalid or expired.')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert--error">{error}</div>}

      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          className={errors.password ? 'input--error' : ''}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          className={errors.confirmPassword ? 'input--error' : ''}
        />
        {errors.confirmPassword && (
          <span className="field-error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
        {submitting ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  )
}

export default ResetPasswordForm
