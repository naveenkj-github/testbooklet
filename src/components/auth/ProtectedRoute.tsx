import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
}

/** Redirects unauthenticated students to the login screen. */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((state) => state.session)
  const location = useLocation()

  if (!session?.name || !session?.passcode) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
