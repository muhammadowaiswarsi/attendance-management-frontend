import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../api/profile'
import ResetPasswordForm from '../components/profile/ResetPasswordForm'
import AuthLayout, { AuthLink } from '../components/ui/AuthLayout'
import { useToast } from '../context/ToastContext'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async (password) => {
    setSubmitting(true)
    try {
      await resetPassword(token, password)
      showToast('Password reset successfully.')
      navigate('/login', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Choose a new password for your account"
      footer={
        <p>
          Back to <AuthLink to="/login">Sign In</AuthLink>
        </p>
      }
    >
      <ResetPasswordForm onSubmit={handleSubmit} submitting={submitting} />
    </AuthLayout>
  )
}

export default ResetPassword
