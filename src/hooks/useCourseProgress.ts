'use client'

import { useEffect, useState } from 'react'
import type { CourseBucket } from '@/data/homeCourses'
import { useIsMounted } from '@/hooks/useIsMounted'
import { getCourseProgressMap, hydrateProgressFromApi } from '@/lib/userCourseProgress'

/** Progresso dos cursos por usuário com cache local + sync pela API. */
export function useCourseProgress(userEmail?: string | null) {
  const mounted = useIsMounted()
  const [progress, setProgress] = useState<Record<string, CourseBucket>>(() => getCourseProgressMap(userEmail))

  useEffect(() => {
    if (!userEmail) {
      setProgress(getCourseProgressMap(null))
      return
    }

    let cancelled = false

    void (async () => {
      await hydrateProgressFromApi(userEmail)
      if (cancelled || !mounted.current) return
      setProgress(getCourseProgressMap(userEmail))
    })()

    return () => {
      cancelled = true
    }
  }, [userEmail, mounted])

  useEffect(() => {
    const refresh = () => {
      if (!mounted.current) return
      setProgress(getCourseProgressMap(userEmail))
    }
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('motstart-progress-change', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('motstart-progress-change', refresh)
    }
  }, [mounted, userEmail])

  return progress
}
