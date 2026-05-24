'use client'

import Link from 'next/link'
import { IMAGES } from '@/constants/images'

type Props = {
  href?: string
  className?: string
}

export function Logo({ href = '/', className = '' }: Props) {
  const inner = (
    <>
      <img
        src={IMAGES.logoIcon}
        alt=""
        className="logo-mark-img"
        width={40}
        height={40}
        decoding="async"
      />
      <span className="logo-text">MotStart</span>
    </>
  )
  return href ? (
    <Link href={href} className={`logo ${className}`}>
      {inner}
    </Link>
  ) : (
    <span className={`logo ${className}`}>{inner}</span>
  )
}
