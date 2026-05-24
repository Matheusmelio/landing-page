'use client'

import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { ScrollToTop, usePageTitle } from '@/hooks/usePageTitle'

export function AppShell({ children }: { children: ReactNode }) {
  usePageTitle()
  return (
    <div className="app-shell">
      <ScrollToTop />
      <main className="app-shell__main">{children}</main>
      <SiteFooter />
    </div>
  )
}
