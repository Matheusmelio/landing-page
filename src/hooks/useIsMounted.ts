'use client'

import { useEffect, useRef } from 'react'

/** Evita setState após desmontar (ex.: sair do perfil durante sync com API). */
export function useIsMounted() {
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return mounted
}
