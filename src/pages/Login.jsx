import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '../components/ui/AuthLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/auth'
import { validateLoginForm } from '../utils/validation'

const Login = () => {
  const { login, isAuthenticated, role, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
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

    const errors = validateLoginForm({ email, password })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)

    try {
      const user = await login(email.trim(), password)
      navigate(getDashboardPath(user.role))
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to manage attendance and payroll"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert--error">{error}</div>}

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
            placeholder="Enter your password"
            className={fieldErrors.password ? 'input--error' : ''}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-form__note">
          <AuthLink to="/forgot-password">Forgot password?</AuthLink>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
