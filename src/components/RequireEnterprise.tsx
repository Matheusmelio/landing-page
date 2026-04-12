import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { ReactNode } from 'react'

/** Só renderiza filhos para conta empresarial autenticada. */
export function RequireEnterprise({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const loc = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname, needEnterprise: true }} />
  }
  if (user.role !== 'enterprise') {
    return <Navigate to="/perfil" replace />
  }
  return children
}
