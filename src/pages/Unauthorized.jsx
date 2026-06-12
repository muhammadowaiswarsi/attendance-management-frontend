import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/auth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const WarningIcon = () => (
  <div className="unauthorized__icon-wrap" aria-hidden="true">
    <svg
      className="unauthorized__icon"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 8L58 54H6L32 8Z"
        fill="#F7941D"
        fillOpacity="0.15"
        stroke="#F7941D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32 24v16" stroke="#F7941D" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="32" cy="46" r="2.5" fill="#F7941D" />
    </svg>
  </div>
)

const Unauthorized = () => {
  const { role, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  const dashboardPath = role ? getDashboardPath(role) : '/login'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="unauthorized">
      <div className="unauthorized__content">
        <WarningIcon />
        <h1 className="unauthorized__title">Access Denied</h1>
        <p className="unauthorized__message">
          You don&apos;t have permission to access this page.
        </p>
        <div className="unauthorized__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate(dashboardPath, { replace: true })}
          >
            Go to Dashboard
          </button>
          <button type="button" className="btn btn--outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
