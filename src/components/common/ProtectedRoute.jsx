import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingState from './LoadingState'

function ProtectedRoute({ children }) {
  const { token, user, initialized } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!initialized) {
    return <LoadingState label="Preparing your workspace…" minH="100vh" />
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
