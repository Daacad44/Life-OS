import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

export function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-text-muted">
        Loading…
      </div>
    )
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
