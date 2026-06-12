import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { setPasswordRequest } from '../api/auth'
import AuthLayout, { AuthLink } from '../components/ui/AuthLayout'
import { useToast } from '../context/ToastContext'
import { validateSetPasswordForm } from '../utils/validation'

const SetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(false)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const errors = validateSetPasswordForm({ password, confirmPassword })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await setPasswordRequest(token, password)
      setSuccess(true)
      showToast('Password set successfully.')
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to set password. The link may be invalid or expired.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Set Your Password"
      subtitle="Create a secure password to activate your employee account"
      footer={
        <p>
          Already have a password? <AuthLink to="/login">Sign In</AuthLink>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert--error">{error}</div>}
        {success && (
          <div className="alert alert--success">
            Password set successfully. Redirecting to login...
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            className={fieldErrors.password ? 'input--error' : ''}
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter your password"
            className={fieldErrors.confirmPassword ? 'input--error' : ''}
          />
          {fieldErrors.confirmPassword && (
            <span className="field-error">{fieldErrors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Saving...' : 'Set Password'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default SetPassword
