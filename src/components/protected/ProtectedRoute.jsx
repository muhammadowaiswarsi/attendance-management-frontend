import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth()

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
