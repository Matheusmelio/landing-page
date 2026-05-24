'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/auth/AuthContext'
import { ClientRedirect } from '@/components/ClientRedirect'
import { loginHref } from '@/lib/authUrls'

/** Só renderiza filhos para conta empresarial autenticada. */
export function RequireEnterprise({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) {
    return <ClientRedirect href={loginHref(pathname, { needEnterprise: true })} />
  }
  if (user.role !== 'enterprise') {
    return <ClientRedirect href="/perfil" />
  }
  return children
}
