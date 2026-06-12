import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { registerRequest } from '../api/auth'
import AuthLayout, { AuthLink } from '../components/ui/AuthLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/auth'
import { validateSignupForm } from '../utils/validation'

const Signup = () => {
  const { isAuthenticated, role, loading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardPath(role)} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const errors = validateSignupForm({ fullName, email, password })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)

    try {
      await registerRequest({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      })

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register as an employee to access the attendance portal"
      footer={
        <p>
          Already have an account? <AuthLink to="/login">Sign In</AuthLink>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className={fieldErrors.fullName ? 'input--error' : ''}
          />
          {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={fieldErrors.email ? 'input--error' : ''}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className={fieldErrors.password ? 'input--error' : ''}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="auth-note">Employee accounts only. Admin access is assigned by the system.</p>
      </form>
    </AuthLayout>
  )
}

export default Signup
