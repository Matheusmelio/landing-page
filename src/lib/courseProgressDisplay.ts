import type { CourseBucket } from '../data/homeCourses'

/** Percentual exibido na barra (demo): estável por id + status. */
export function progressPercentForCourse(courseId: string, bucket: CourseBucket): number {
  if (bucket === 'concluido') return 100
  if (bucket === 'disponivel') return 0
  let h = 0
  for (let i = 0; i < courseId.length; i++) {
    h = Math.imul(h, 31) + courseId.charCodeAt(i)
  }
  return 18 + (Math.abs(h) % 67)
}
