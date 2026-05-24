'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'

type Props = Omit<ComponentProps<typeof Link>, 'href' | 'className'> & {
  href: string
  end?: boolean
  className?: string | ((opts: { isActive: boolean }) => string)
  children: ReactNode
}

export function NavLink({ href, end, className, children, ...rest }: Props) {
  const pathname = usePathname()
  const isActive =
    end === true
      ? pathname === href
      : pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
  const resolved = typeof className === 'function' ? className({ isActive }) : className
  return (
    <Link href={href} className={resolved} {...rest}>
      {children}
    </Link>
  )
}
