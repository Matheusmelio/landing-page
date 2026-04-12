import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import { HOME_COURSES } from '../data/homeCourses'
import { getTeachingMeta } from '../data/courseTeachingMeta'
import { getCourseOutline } from '../lib/courseModulesOutline'
import { progressPercentForCourse } from '../lib/courseProgressDisplay'
import { getCourseProgressMap, hasActivePlan } from '../lib/userCourseProgress'

export function CoursePlayerPage() {
  const { courseId = '' } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const [progressMap, setProgressMap] = useState(() => getCourseProgressMap())

  const course = useMemo(() => HOME_COURSES.find((c) => c.id === courseId), [courseId])
  const meta = getTeachingMeta(courseId)
  const outline = useMemo(() => getCourseOutline(courseId), [courseId])
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  useEffect(() => {
    const first = outline[0]?.lessons[0]?.id
    if (first) setActiveLessonId(first)
  }, [outline])

  useEffect(() => {
    const refresh = () => setProgressMap(getCourseProgressMap())
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    if (!course) return
    document.title = `${course.title} — MotStart`
    return () => {
      document.title = 'MotStart — Aprendizado em Tech'
    }
  }, [course])

  if (!course) {
    return <Navigate to="/cursos" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const bucket = progressMap[course.id] ?? 'disponivel'
  const planCoversCourse = hasActivePlan() && course.isPlatformCourse
  if (bucket === 'disponivel' && !planCoversCourse) {
    return <Navigate to={`/curso/${course.id}/comprar`} replace />
  }

  const pct = progressPercentForCourse(course.id, bucket)
  const activeLesson =
    outline.flatMap((m) => m.lessons).find((l) => l.id === activeLessonId) ?? outline[0]?.lessons[0]

  return (
    <div className="page page--course-player">
      <MainHeader />

      <div className="course-player-bar">
        <div className="container course-player-bar__inner">
          <Link to="/" className="course-player-bar__back">
            ← Painel
          </Link>
          <span className="course-player-bar__crumb" aria-hidden="true">
            /
          </span>
          <span className="course-player-bar__title">{course.title}</span>
        </div>
      </div>

      <div className="container course-player-layout">
        <aside className="course-player-sidebar" aria-label="Conteúdo do curso">
          <p className="course-player-sidebar__kicker">Seu progresso</p>
          <div className="course-player-sidebar__pct">{pct}%</div>
          <div className="progress-bar course-player-sidebar__bar" role="progressbar" aria-valuenow={pct}>
            <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="course-player-sidebar__meta">
            {meta.hours}h · {meta.modules} módulos · {meta.instructor}
          </p>
          <nav className="course-player-toc">
            {outline.map((mod) => (
              <div key={mod.id} className="course-player-toc__module">
                <p className="course-player-toc__module-title">{mod.title}</p>
                <ul className="course-player-toc__lessons">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={`course-player-toc__lesson ${activeLessonId === lesson.id ? 'course-player-toc__lesson--active' : ''}`}
                        onClick={() => setActiveLessonId(lesson.id)}
                      >
                        <span className="course-player-toc__lesson-title">{lesson.title}</span>
                        <span className="course-player-toc__lesson-dur">{lesson.durationMin} min</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="course-player-main">
          <div className="course-player-video">
            <div className="course-player-video__placeholder" role="img" aria-label="Área do player de vídeo (demonstração)">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M8 5v14l11-7L8 5z"
                  fill="currentColor"
                  opacity="0.85"
                />
              </svg>
              <span>Player de vídeo (demo)</span>
            </div>
          </div>
          <h1 className="course-player-lesson-title">{activeLesson?.title ?? 'Selecione uma aula'}</h1>
          <p className="course-player-lesson-desc">
            Conteúdo ilustrativo da MotStart. Em produção, esta área exibiria o vídeo, materiais para download e
            exercícios com IA vinculados à aula.
          </p>
          <div className="course-player-actions">
            <button type="button" className="btn btn-primary">
              Marcar aula como concluída
            </button>
            <Link to="/exercicios-ia" className="btn btn-outline-primary">
              Praticar com IA
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
