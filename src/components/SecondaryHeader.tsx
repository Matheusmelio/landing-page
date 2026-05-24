'use client'

import Link from 'next/link'
import { Logo } from './Logo'

type Variant = 'voltar' | 'voltar-perfil'

type Props = {
  variant: Variant
}

export function SecondaryHeader({ variant }: Props) {
  const back =
    variant === 'voltar' ? (
      <Link href="/" className="btn btn-ghost btn-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="btn-back__text">Voltar</span>
      </Link>
    ) : (
      <Link href="/perfil" className="btn btn-ghost btn-back">
        <span className="btn-back__text">Voltar ao Perfil</span>
      </Link>
    )

  return (
    <header className="secondary-header">
      <div className="secondary-header__inner">
        <Logo href="/" />
        {back}
      </div>
    </header>
  )
}
