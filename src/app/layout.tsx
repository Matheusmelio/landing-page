import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MotStart — Aprendizado em Tech',
    template: '%s — MotStart',
  },
  description:
    'MotStart — cursos de programação, planos para estudantes, vagas e área empresarial. Plataforma de demonstração.',
  icons: {
    icon: '/images/logo-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8233ff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
