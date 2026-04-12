/** Módulos / aulas de demonstração para a tela do curso. */

export type CourseModuleOutline = {
  id: string
  title: string
  lessons: { id: string; title: string; durationMin: number }[]
}

const TITLES = [
  'Introdução e objetivos',
  'Configuração do ambiente',
  'Conceitos fundamentais',
  'Projeto prático I',
  'Projeto prático II',
  'Boas práticas e próximos passos',
]

export function getCourseOutline(courseId: string): CourseModuleOutline[] {
  const h = courseId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const moduleCount = 4 + (h % 3)
  const out: CourseModuleOutline[] = []
  for (let m = 0; m < moduleCount; m++) {
    const lessonCount = 2 + ((h + m) % 3)
    const lessons = Array.from({ length: lessonCount }, (_, i) => ({
      id: `${courseId}-m${m + 1}-l${i + 1}`,
      title: `Aula ${i + 1}: ${TITLES[(m + i) % TITLES.length]}`,
      durationMin: 8 + ((h + m + i) % 25),
    }))
    out.push({
      id: `${courseId}-mod-${m + 1}`,
      title: `Módulo ${m + 1}: ${TITLES[m % TITLES.length]}`,
      lessons,
    })
  }
  return out
}
