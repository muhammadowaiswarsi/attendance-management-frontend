import { useState } from 'react'
import { validateEmail } from '../../utils/validation'

const ForgotPasswordForm = ({ onSubmit, submitting }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!validateEmail(email)) {
      setError('Enter a valid email address')
      return
    }

    await onSubmit(email.trim(), () => {
      setSubmitted(true)
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {submitted ? (
        <div className="alert alert--success">
          If an account exists for this email, a reset link has been sent.
        </div>
      ) : (
        <>
          {error && <div className="alert alert--error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your account email"
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </>
      )}
    </form>
  )
}

export default ForgotPasswordForm
