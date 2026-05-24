import type { CourseBucket } from '@/data/homeCourses'
import { apiFetch, isApiEnabled } from '@/lib/api/http'

export async function fetchProgressFromApi(
  email: string,
): Promise<Record<string, CourseBucket>> {
  if (!isApiEnabled()) return {}

  const res = await apiFetch<{ ok: true; progress: Record<string, CourseBucket> }>(
    `/api/progress?email=${encodeURIComponent(email)}`,
  )
  return res.progress ?? {}
}

export async function saveProgressToApi(
  email: string,
  progress: Record<string, CourseBucket>,
): Promise<void> {
  if (!isApiEnabled()) return

  await apiFetch('/api/progress', {
    method: 'PUT',
    body: JSON.stringify({ email, progress }),
  })
}

export async function updateCourseBucketOnApi(
  email: string,
  courseId: string,
  status: CourseBucket,
): Promise<void> {
  if (!isApiEnabled()) return

  await apiFetch('/api/progress', {
    method: 'PUT',
    body: JSON.stringify({ email, courseId, status }),
  })
}
