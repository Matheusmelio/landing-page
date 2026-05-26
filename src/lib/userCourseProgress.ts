import { HOME_COURSES } from '../data/homeCourses'
import type { CourseBucket } from '../data/homeCourses'
import { fetchProgressFromApi, saveProgressToApi, updateCourseBucketOnApi } from './api/progress'
import { apiFetch, isApiEnabled } from './api/http'

const KEY = 'motstart_course_progress_v1'

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  return localStorage
}

function userPlanStorageKey(email: string) {
  return `motstart_active_plan_user_v1:${email.toLowerCase().trim()}`
}

function userProgressStorageKey(email: string | null | undefined) {
  return email ? `${KEY}:${email.toLowerCase().trim()}` : KEY
}

function defaultProgress(): Record<string, CourseBucket> {
  return Object.fromEntries(HOME_COURSES.map((course) => [course.id, 'disponivel'])) as Record<string, CourseBucket>
}

function readRaw(email?: string | null): Record<string, CourseBucket> | null {
  const ls = storage()
  if (!ls) return null
  try {
    const raw = ls.getItem(userProgressStorageKey(email))
    if (!raw) return null
    return JSON.parse(raw) as Record<string, CourseBucket>
  } catch {
    return null
  }
}

function isBucket(v: unknown): v is CourseBucket {
  return v === 'em-andamento' || v === 'disponivel' || v === 'concluido'
}

function mergeProgress(existing: Record<string, CourseBucket> | null): Record<string, CourseBucket> {
  const merged = defaultProgress()
  if (existing) {
    for (const [id, v] of Object.entries(existing)) {
      if (isBucket(v)) merged[id] = v
    }
  }
  for (const c of HOME_COURSES) {
    if (merged[c.id] === undefined) merged[c.id] = 'disponivel'
  }
  return merged
}

function writeProgressMap(map: Record<string, CourseBucket>, email?: string | null) {
  const ls = storage()
  if (!ls) return
  ls.setItem(userProgressStorageKey(email), JSON.stringify(map))
  window.dispatchEvent(new Event('motstart-progress-change'))
}

function persistIfChanged(prev: Record<string, CourseBucket> | null, next: Record<string, CourseBucket>, email?: string | null) {
  const ls = storage()
  if (!ls) return
  if (!prev || JSON.stringify(prev) !== JSON.stringify(next)) {
    writeProgressMap(next, email)
  }
}

/** Carrega progresso da API para o cache local. Usuário novo começa sem cursos conectados. */
export async function hydrateProgressFromApi(email: string): Promise<void> {
  if (!email || !isApiEnabled()) return
  try {
    const remote = await fetchProgressFromApi(email)
    const hasRemote = Object.keys(remote).length > 0
    const merged = mergeProgress(hasRemote ? remote : readRaw(email))
    writeProgressMap(merged, email)
    if (hasRemote) return
    const connectedOnly = Object.fromEntries(
      Object.entries(merged).filter(([, bucket]) => bucket !== 'disponivel'),
    ) as Record<string, CourseBucket>
    if (Object.keys(connectedOnly).length > 0) await saveProgressToApi(email, connectedOnly)
  } catch (err) {
    console.warn('[motstart] hydrateProgressFromApi', err)
  }
}

export function getCourseProgressMap(email?: string | null): Record<string, CourseBucket> {
  const raw = readRaw(email)
  const merged = mergeProgress(raw)
  persistIfChanged(raw, merged, email)
  return merged
}

export function setCourseBucket(courseId: string, bucket: CourseBucket, userEmail?: string) {
  const map = { ...getCourseProgressMap(userEmail), [courseId]: bucket }
  writeProgressMap(map, userEmail)

  if (userEmail && isApiEnabled()) {
    void updateCourseBucketOnApi(userEmail, courseId, bucket).catch((err) =>
      console.warn('[motstart] setCourseBucket API', err),
    )
  }
}

async function syncActivePlanToApi(email: string, planId: string | null) {
  if (!isApiEnabled()) return
  await apiFetch('/api/profiles', {
    method: 'PUT',
    body: JSON.stringify({
      email,
      activePlanId: planId,
    }),
  })
}

export function setActivePlanIdForUser(email: string, planId: string | null) {
  const ls = storage()
  if (!ls) return
  const k = userPlanStorageKey(email)
  if (!planId) ls.removeItem(k)
  else ls.setItem(k, planId)
  window.dispatchEvent(new Event('motstart-plan-change'))

  if (isApiEnabled()) {
    void syncActivePlanToApi(email, planId).catch((err) =>
      console.warn('[motstart] syncActivePlanToApi', err),
    )
  }
}

export function getActivePlanIdForUser(email: string | null | undefined): string | null {
  if (!email) return null
  const ls = storage()
  if (!ls) return null
  return ls.getItem(userPlanStorageKey(email))
}

export function hasActivePlanForUser(email: string | null | undefined): boolean {
  return !!getActivePlanIdForUser(email)
}

export function countByBucket(progress: Record<string, CourseBucket>) {
  let emAndamento = 0
  let disponiveis = 0
  let concluidos = 0
  for (const status of Object.values(progress)) {
    if (status === 'em-andamento') emAndamento++
    else if (status === 'disponivel') disponiveis++
    else if (status === 'concluido') concluidos++
  }
  return { emAndamento, disponiveis, concluidos }
}

export function isConnectedCourse(bucket: CourseBucket | undefined): boolean {
  return bucket === 'em-andamento' || bucket === 'concluido'
}
