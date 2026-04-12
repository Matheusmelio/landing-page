/** Metadados pedagógicos (demo) — horas, módulos, instrutor por curso do catálogo. */

export type CourseTeachingMeta = {
  hours: number
  modules: number
  instructor: string
}

const MAP: Record<string, CourseTeachingMeta> = {
  c1: { hours: 40, modules: 12, instructor: 'Carlos Mendes' },
  c2: { hours: 36, modules: 10, instructor: 'Juliana Prado' },
  c3: { hours: 28, modules: 8, instructor: 'Rafael Souza' },
  c4: { hours: 32, modules: 10, instructor: 'Patricia Lima' },
  c5: { hours: 24, modules: 8, instructor: 'Marcos Vieira' },
  c6: { hours: 44, modules: 14, instructor: 'Renata Alves' },
  c7: { hours: 30, modules: 9, instructor: 'Otávio Nunes' },
  c8: { hours: 20, modules: 6, instructor: 'Luiza Freitas' },
  c9: { hours: 38, modules: 11, instructor: 'Felipe Costa' },
  c10: { hours: 26, modules: 7, instructor: 'Camila Rocha' },
  c11: { hours: 22, modules: 7, instructor: 'Daniel Souza' },
  c12: { hours: 34, modules: 10, instructor: 'Amanda Reis' },
  c13: { hours: 28, modules: 9, instructor: 'Ricardo Melo' },
  c14: { hours: 18, modules: 5, instructor: 'Beatriz Dias' },
  c15: { hours: 32, modules: 9, instructor: 'Gustavo Pires' },
  c16: { hours: 30, modules: 8, instructor: 'Larissa Monteiro' },
  c17: { hours: 16, modules: 4, instructor: 'Paula Martins' },
  c18: { hours: 24, modules: 6, instructor: 'Eduardo Ramos' },
}

export function getTeachingMeta(courseId: string): CourseTeachingMeta {
  return MAP[courseId] ?? { hours: 32, modules: 8, instructor: 'Equipe MotStart' }
}
