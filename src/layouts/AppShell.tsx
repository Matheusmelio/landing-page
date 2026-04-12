import { Outlet } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'
import { ScrollToTop, usePageTitle } from '../hooks/usePageTitle'

export function AppShell() {
  usePageTitle()
  return (
    <div className="app-shell">
      <ScrollToTop />
      <main className="app-shell__main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
