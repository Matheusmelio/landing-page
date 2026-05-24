'use client'

import { useEffect, useState } from 'react'
import type { CourseBucket } from '@/data/homeCourses'
import { useIsMounted } from '@/hooks/useIsMounted'
import { getCourseProgressMap, hydrateProgressFromApi } from '@/lib/userCourseProgress'

/** Progresso dos cursos com cache local + sync Supabase quando a API está ativa. */
export function useCourseProgress(userEmail?: string | null) {
  const mounted = useIsMounted()
  const [progress, setProgress] = useState<Record<string, CourseBucket>>(() => getCourseProgressMap())

  useEffect(() => {
    if (!userEmail) return

    let cancelled = false

    void (async () => {
      await hydrateProgressFromApi(userEmail)
      if (cancelled || !mounted.current) return
      setProgress(getCourseProgressMap())
    })()

    return () => {
      cancelled = true
    }
  }, [userEmail, mounted])

  useEffect(() => {
    const refresh = () => {
      if (!mounted.current) return
      setProgress(getCourseProgressMap())
    }
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('motstart-progress-change', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('motstart-progress-change', refresh)
    }
  }, [mounted])

  return progress
}
