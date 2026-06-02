const KEY = 'motstart_creator_courses_v1'
export const CREATOR_COURSE_REVIEW_MS = 5 * 60 * 1000

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  return localStorage
}

export type CreatorCourseDraft = {
  id: string
  title: string
  category: string
  description: string
  priceLabel: string
  priceCents: number
  authorEmail: string
  authorName: string
  createdAt: string
  reviewStatus: 'em-analise' | 'aprovado'
  reviewSubmittedAt: string
  reviewReadyAt: string
}

function readAll(): CreatorCourseDraft[] {
  const ls = storage()
  if (!ls) return []
  try {
    const raw = ls.getItem(KEY)
    if (!raw) return []
    const p = JSON.parse(raw) as CreatorCourseDraft[]
    return Array.isArray(p) ? p.map(normalizeCourse) : []
  } catch {
    return []
  }
}

function normalizeCourse(course: CreatorCourseDraft): CreatorCourseDraft {
  if (course.reviewStatus && course.reviewSubmittedAt && course.reviewReadyAt) return course
  const createdAt = course.createdAt || new Date().toISOString()
  return {
    ...course,
    createdAt,
    reviewStatus: 'aprovado',
    reviewSubmittedAt: createdAt,
    reviewReadyAt: createdAt,
  }
}

function writeAll(list: CreatorCourseDraft[]) {
  const ls = storage()
  if (!ls) return
  ls.setItem(KEY, JSON.stringify(list))
}

export function listCreatorCourses(): CreatorCourseDraft[] {
  return readAll()
}

export function listCreatorCoursesByEmail(email: string): CreatorCourseDraft[] {
  const e = email.trim().toLowerCase()
  return readAll().filter((c) => c.authorEmail.toLowerCase() === e)
}

export function addCreatorCourse(
  course: Omit<CreatorCourseDraft, 'id' | 'createdAt' | 'reviewStatus' | 'reviewSubmittedAt' | 'reviewReadyAt'>,
): CreatorCourseDraft {
  const list = readAll()
  const id = `cc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const submittedAt = new Date()
  const readyAt = new Date(submittedAt.getTime() + CREATOR_COURSE_REVIEW_MS)
  const row: CreatorCourseDraft = {
    ...course,
    id,
    createdAt: submittedAt.toISOString(),
    reviewStatus: 'em-analise',
    reviewSubmittedAt: submittedAt.toISOString(),
    reviewReadyAt: readyAt.toISOString(),
  }
  list.unshift(row)
  writeAll(list)
  return row
}

export function getCreatorCourseById(id: string): CreatorCourseDraft | undefined {
  return readAll().find((c) => c.id === id)
}

export function getCreatorCourseReviewStatus(course: CreatorCourseDraft, nowMs = Date.now()): CreatorCourseDraft['reviewStatus'] {
  if (course.reviewStatus === 'aprovado') return 'aprovado'
  return nowMs >= new Date(course.reviewReadyAt).getTime() ? 'aprovado' : 'em-analise'
}

export function getCreatorCourseReviewRemainingMs(course: CreatorCourseDraft, nowMs = Date.now()): number {
  return Math.max(0, new Date(course.reviewReadyAt).getTime() - nowMs)
}
