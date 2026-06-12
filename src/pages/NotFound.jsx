import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/auth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const NotFoundIllustration = () => (
  <svg
    className="not-found__illustration"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="40" y="20" width="120" height="80" rx="8" fill="#EEF2F6" stroke="#2D5A82" strokeWidth="2" />
    <path d="M60 45h80M60 60h55M60 75h65" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
    <circle cx="145" cy="85" r="22" fill="#F7941D" fillOpacity="0.15" stroke="#F7941D" strokeWidth="2" />
    <path d="M138 85l5 5 10-10" stroke="#F7941D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="155" cy="35" r="4" fill="#2D5A82" fillOpacity="0.2" />
    <circle cx="45" cy="30" r="3" fill="#F7941D" fillOpacity="0.3" />
  </svg>
)

const NotFound = () => {
  const { role, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  const dashboardPath =
    isAuthenticated && role ? getDashboardPath(role) : '/login'

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(dashboardPath)
    }
  }

  return (
    <div className={`not-found ${isAuthenticated ? 'not-found--embedded' : ''}`}>
      <div className="not-found__content">
        <NotFoundIllustration />
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__subtitle">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="not-found__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate(dashboardPath)}
          >
            Go to Dashboard
          </button>
          <button type="button" className="btn btn--outline" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
