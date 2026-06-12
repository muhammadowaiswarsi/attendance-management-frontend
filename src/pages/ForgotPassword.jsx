import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/profile'
import ForgotPasswordForm from '../components/profile/ForgotPasswordForm'
import AuthLayout, { AuthLink } from '../components/ui/AuthLayout'
import { useToast } from '../context/ToastContext'

const ForgotPassword = () => {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (email, onSuccess) => {
    setSubmitting(true)
    try {
      await forgotPassword(email)
      onSuccess()
      showToast('If an account exists, a reset link has been sent.')
    } catch {
      showToast('Unable to process request. Please try again later.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we will send you a reset link"
      footer={
        <p>
          Remember your password? <AuthLink to="/login">Sign In</AuthLink>
        </p>
      }
    >
      <ForgotPasswordForm onSubmit={handleSubmit} submitting={submitting} />
      <p className="auth-form__note">
        <Link to="/login" className="auth-link">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPassword
