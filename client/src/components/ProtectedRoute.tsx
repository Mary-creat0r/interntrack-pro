import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
    children: React.ReactNode
}

// Wrapper component that restricts access to authenticated users only
// Checks localStorage for a valid JWT token via the useAuth hook
// Redirects unauthenticated users to /login instead of showing the page
function ProtectedRoute({ children }: Props) {
    const { isAuthenticated } = useAuth()

    // replace prop prevents the protected route appearing in browser history
    // so the back button doesn't return to a page the user can't access
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute