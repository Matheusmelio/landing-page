const KEY = 'motstart_creator_courses_v1'

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
}

function readAll(): CreatorCourseDraft[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const p = JSON.parse(raw) as CreatorCourseDraft[]
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

function writeAll(list: CreatorCourseDraft[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function listCreatorCourses(): CreatorCourseDraft[] {
  return readAll()
}

export function listCreatorCoursesByEmail(email: string): CreatorCourseDraft[] {
  const e = email.trim().toLowerCase()
  return readAll().filter((c) => c.authorEmail.toLowerCase() === e)
}

export function addCreatorCourse(course: Omit<CreatorCourseDraft, 'id' | 'createdAt'>): CreatorCourseDraft {
  const list = readAll()
  const id = `cc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const row: CreatorCourseDraft = {
    ...course,
    id,
    createdAt: new Date().toISOString(),
  }
  list.unshift(row)
  writeAll(list)
  return row
}

export function getCreatorCourseById(id: string): CreatorCourseDraft | undefined {
  return readAll().find((c) => c.id === id)
}
