import { HOME_COURSES } from '../data/homeCourses'
import type { CourseBucket } from '../data/homeCourses'

const KEY = 'motstart_course_progress_v1'

/** Plano ativo guardado por e-mail do utilizador (só após checkout demo). */
function userPlanStorageKey(email: string) {
  return `motstart_active_plan_user_v1:${email.toLowerCase().trim()}`
}

/**
 * Demonstração: 12 em andamento (4 linhas × 3 no grid), 4 disponíveis, 2 concluídos.
 */
const DEFAULT_PROGRESS: Record<string, CourseBucket> = {
  c1: 'em-andamento',
  c2: 'em-andamento',
  c3: 'em-andamento',
  c4: 'em-andamento',
  c5: 'em-andamento',
  c6: 'em-andamento',
  c7: 'em-andamento',
  c8: 'em-andamento',
  c9: 'em-andamento',
  c10: 'em-andamento',
  c11: 'em-andamento',
  c12: 'em-andamento',
  c13: 'disponivel',
  c14: 'disponivel',
  c15: 'disponivel',
  c16: 'disponivel',
  c17: 'concluido',
  c18: 'concluido',
}

function readRaw(): Record<string, CourseBucket> | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as Record<string, CourseBucket>
  } catch {
    return null
  }
}

function isBucket(v: unknown): v is CourseBucket {
  return v === 'em-andamento' || v === 'disponivel' || v === 'concluido'
}

/** Mescla progresso salvo com o catálogo atual (novos cursos entram como disponíveis). */
function mergeProgress(existing: Record<string, CourseBucket> | null): Record<string, CourseBucket> {
  const merged: Record<string, CourseBucket> = { ...DEFAULT_PROGRESS }
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

function persistIfChanged(prev: Record<string, CourseBucket> | null, next: Record<string, CourseBucket>) {
  if (!prev || JSON.stringify(prev) !== JSON.stringify(next)) {
    localStorage.setItem(KEY, JSON.stringify(next))
  }
}

export function getCourseProgressMap(): Record<string, CourseBucket> {
  const raw = readRaw()
  const merged = mergeProgress(raw)
  persistIfChanged(raw, merged)
  return merged
}

/** Atualiza o status de um curso no armazenamento local (demo). */
export function setCourseBucket(courseId: string, bucket: CourseBucket) {
  const map = { ...getCourseProgressMap(), [courseId]: bucket }
  localStorage.setItem(KEY, JSON.stringify(map))
}

/** Define o plano ativo para este e-mail (checkout demo). */
export function setActivePlanIdForUser(email: string, planId: string | null) {
  const k = userPlanStorageKey(email)
  if (!planId) localStorage.removeItem(k)
  else localStorage.setItem(k, planId)
  window.dispatchEvent(new Event('motstart-plan-change'))
}

/** Plano ativo só existe se este utilizador concluiu a compra (demo). */
export function getActivePlanIdForUser(email: string | null | undefined): string | null {
  if (!email) return null
  return localStorage.getItem(userPlanStorageKey(email))
}

export function hasActivePlanForUser(email: string | null | undefined): boolean {
  return !!getActivePlanIdForUser(email)
}

/** Conta cursos por aba (para badges) */
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
