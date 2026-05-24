import { AppShell } from '@/layouts/AppShell'

/** App usa localStorage (auth, progresso); evita prerender estático no build. */
export const dynamic = 'force-dynamic'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
