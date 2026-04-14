import type { CreatorCourseDraft } from './creatorCourses'

const KEY = 'motstart_creator_course_content_v1'

export type CreatorVideoRow = {
  id: string
  title: string
  videoUrl: string
  durationMin: number
}

export type CreatorExerciseRow = {
  id: string
  title: string
  body: string
}

export type CreatorActivityRow = {
  id: string
  title: string
  body: string
}

export type CreatorCourseContent = {
  courseId: string
  videos: CreatorVideoRow[]
  exercises: CreatorExerciseRow[]
  activities: CreatorActivityRow[]
  /** Preenchido automaticamente ou ajustado pelo autor */
  curriculumDigital: string
  updatedAt: string
}

function readMap(): Record<string, CreatorCourseContent> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const p = JSON.parse(raw) as Record<string, CreatorCourseContent>
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

function writeMap(m: Record<string, CreatorCourseContent>) {
  localStorage.setItem(KEY, JSON.stringify(m))
}

export function getCreatorCourseContent(courseId: string): CreatorCourseContent | null {
  const m = readMap()
  return m[courseId] ?? null
}

export function saveCreatorCourseContent(content: CreatorCourseContent) {
  const m = readMap()
  m[content.courseId] = {
    ...content,
    updatedAt: new Date().toISOString(),
  }
  writeMap(m)
}

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function emptyContent(courseId: string): CreatorCourseContent {
  return {
    courseId,
    videos: [],
    exercises: [],
    activities: [],
    curriculumDigital: '',
    updatedAt: new Date().toISOString(),
  }
}

export function ensureCreatorCourseContent(courseId: string): CreatorCourseContent {
  const existing = getCreatorCourseContent(courseId)
  if (existing) return existing
  const fresh = emptyContent(courseId)
  saveCreatorCourseContent(fresh)
  return fresh
}

/** Gera texto de currículo digital a partir dos metadados do curso e do conteúdo cadastrado (demo). */
export function buildAutoCurriculum(course: CreatorCourseDraft, c: CreatorCourseContent): string {
  const lines: string[] = [
    'Currículo digital (gerado automaticamente — demonstração MotStart)',
    '',
    `Curso: ${course.title}`,
    `Área: ${course.category}`,
    `Autor(a): ${course.authorName}`,
    `Valor divulgado: ${course.priceLabel}`,
    '',
    'Sobre o curso',
    course.description || '—',
    '',
  ]

  if (c.videos.length > 0) {
    lines.push(`Conteúdo em vídeo (${c.videos.length} módulo(s))`)
    c.videos.forEach((v, i) => {
      lines.push(`  ${i + 1}. ${v.title} — ${v.durationMin} min${v.videoUrl ? ` · ${v.videoUrl}` : ''}`)
    })
    lines.push('')
  } else {
    lines.push('Conteúdo em vídeo: a definir no editor.', '')
  }

  if (c.exercises.length > 0) {
    lines.push(`Exercícios (${c.exercises.length})`)
    c.exercises.forEach((ex, i) => {
      lines.push(`  ${i + 1}. ${ex.title}`)
    })
    lines.push('')
  }

  if (c.activities.length > 0) {
    lines.push(`Atividades (${c.activities.length})`)
    c.activities.forEach((a, i) => {
      lines.push(`  ${i + 1}. ${a.title}`)
    })
    lines.push('')
  }

  lines.push(
    'Este currículo é uma síntese automática para portfólio / certificado digital (simulação). Em produção, integraria dados reais do LMS e progresso do aluno.',
  )

  return lines.join('\n')
}

export function makeVideoRow(partial?: Partial<CreatorVideoRow>): CreatorVideoRow {
  return {
    id: newId('v'),
    title: partial?.title ?? '',
    videoUrl: partial?.videoUrl ?? '',
    durationMin: partial?.durationMin ?? 0,
  }
}

export function makeExerciseRow(partial?: Partial<CreatorExerciseRow>): CreatorExerciseRow {
  return {
    id: newId('ex'),
    title: partial?.title ?? '',
    body: partial?.body ?? '',
  }
}

export function makeActivityRow(partial?: Partial<CreatorActivityRow>): CreatorActivityRow {
  return {
    id: newId('at'),
    title: partial?.title ?? '',
    body: partial?.body ?? '',
  }
}
