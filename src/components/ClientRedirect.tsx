'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/** Redirecionamento no cliente (substitui `<Navigate replace />` do React Router). */
export function ClientRedirect({ href }: { href: string }) {
  const router = useRouter()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    router.replace(href)
  }, [href, router])

  return null
}
