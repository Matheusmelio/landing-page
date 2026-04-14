import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import {
  buildAutoCurriculum,
  ensureCreatorCourseContent,
  makeActivityRow,
  makeExerciseRow,
  makeVideoRow,
  saveCreatorCourseContent,
  type CreatorActivityRow,
  type CreatorCourseContent,
  type CreatorExerciseRow,
  type CreatorVideoRow,
} from '../lib/creatorCourseContent'
import { getCreatorCourseById } from '../lib/creatorCourses'

export function CreatorCourseEditorPage() {
  const { courseId = '' } = useParams()
  const { user } = useAuth()
  const course = useMemo(() => getCreatorCourseById(courseId), [courseId])

  const [content, setContent] = useState<CreatorCourseContent | null>(null)
  const [savedHint, setSavedHint] = useState(false)

  useEffect(() => {
    if (!course || !user) return
    if (course.authorEmail.toLowerCase() !== user.email.toLowerCase()) return
    setContent(ensureCreatorCourseContent(courseId))
  }, [course, courseId, user])

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `/publicar-curso/${courseId}/editar` }} />
  }

  if (user.role === 'enterprise') {
    return <Navigate to="/publicar-curso" replace />
  }

  if (!course) {
    return <Navigate to="/publicar-curso" replace />
  }

  if (course.authorEmail.toLowerCase() !== user.email.toLowerCase()) {
    return <Navigate to="/publicar-curso" replace />
  }

  if (!content) {
    return (
      <div className="page">
        <MainHeader />
        <div className="container section-wrap">
          <p className="page-lead">Carregando…</p>
        </div>
      </div>
    )
  }

  const persist = (next: CreatorCourseContent) => {
    setContent(next)
    saveCreatorCourseContent(next)
    setSavedHint(true)
    window.setTimeout(() => setSavedHint(false), 2500)
  }

  const updateVideo = (id: string, patch: Partial<CreatorVideoRow>) => {
    persist({
      ...content,
      videos: content.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    })
  }

  const removeVideo = (id: string) => {
    persist({ ...content, videos: content.videos.filter((v) => v.id !== id) })
  }

  const addVideo = () => {
    persist({ ...content, videos: [...content.videos, makeVideoRow()] })
  }

  const updateExercise = (id: string, patch: Partial<CreatorExerciseRow>) => {
    persist({
      ...content,
      exercises: content.exercises.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })
  }

  const removeExercise = (id: string) => {
    persist({ ...content, exercises: content.exercises.filter((x) => x.id !== id) })
  }

  const addExercise = () => {
    persist({ ...content, exercises: [...content.exercises, makeExerciseRow()] })
  }

  const updateActivity = (id: string, patch: Partial<CreatorActivityRow>) => {
    persist({
      ...content,
      activities: content.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })
  }

  const removeActivity = (id: string) => {
    persist({ ...content, activities: content.activities.filter((a) => a.id !== id) })
  }

  const addActivity = () => {
    persist({ ...content, activities: [...content.activities, makeActivityRow()] })
  }

  const runAutoCurriculum = () => {
    const text = buildAutoCurriculum(course, content)
    persist({ ...content, curriculumDigital: text })
  }

  const setCurriculumManual = (curriculumDigital: string) => {
    persist({ ...content, curriculumDigital })
  }

  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top creator-editor">
        <p className="creator-editor__back">
          <Link to="/publicar-curso" className="link-purple">
            ← Voltar a meus cursos
          </Link>
        </p>

        <header className="creator-editor__head">
          <h1 className="page-title">Editar conteúdo do curso</h1>
          <p className="page-lead">
            <strong>{course.title}</strong> · {course.category}. Cadastre vídeos por módulo, exercícios, atividades e gere o
            currículo digital automático (demonstração local).
          </p>
        </header>

        {savedHint ? (
          <p className="creator-editor__saved" role="status">
            Alterações guardadas neste navegador.
          </p>
        ) : null}

        <section className="creator-editor__section" aria-labelledby="vid-heading">
          <h2 id="vid-heading" className="creator-editor__section-title">
            Vídeos do curso
          </h2>
          <p className="creator-editor__hint">Adicione cada aula ou módulo com título, link do vídeo (URL) e duração em minutos.</p>
          <ul className="creator-editor__rows">
            {content.videos.map((v) => (
              <li key={v.id} className="creator-editor__row">
                <label className="auth-field">
                  <span>Título do módulo / aula</span>
                  <input value={v.title} onChange={(e) => updateVideo(v.id, { title: e.target.value })} placeholder="Ex.: Aula 1 — Fundamentos" />
                </label>
                <label className="auth-field">
                  <span>URL do vídeo</span>
                  <input
                    value={v.videoUrl}
                    onChange={(e) => updateVideo(v.id, { videoUrl: e.target.value })}
                    placeholder="https://…"
                    type="url"
                  />
                </label>
                <label className="auth-field creator-editor__field--narrow">
                  <span>Duração (min)</span>
                  <input
                    inputMode="numeric"
                    value={v.durationMin || ''}
                    onChange={(e) => updateVideo(v.id, { durationMin: Math.max(0, Number.parseInt(e.target.value, 10) || 0) })}
                  />
                </label>
                <button type="button" className="btn btn-ghost creator-editor__remove" onClick={() => removeVideo(v.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-outline-primary" onClick={addVideo}>
            + Adicionar vídeo
          </button>
        </section>

        <section className="creator-editor__section" aria-labelledby="ex-heading">
          <h2 id="ex-heading" className="creator-editor__section-title">
            Exercícios
          </h2>
          <p className="creator-editor__hint">Exercícios práticos para o aluno aplicar o conteúdo.</p>
          {content.exercises.map((ex) => (
            <div key={ex.id} className="creator-editor__block">
              <label className="auth-field">
                <span>Título</span>
                <input value={ex.title} onChange={(e) => updateExercise(ex.id, { title: e.target.value })} />
              </label>
              <label className="auth-field">
                <span>Enunciado / detalhes</span>
                <textarea rows={3} value={ex.body} onChange={(e) => updateExercise(ex.id, { body: e.target.value })} />
              </label>
              <button type="button" className="btn btn-ghost creator-editor__remove" onClick={() => removeExercise(ex.id)}>
                Remover exercício
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={addExercise}>
            + Adicionar exercício
          </button>
        </section>

        <section className="creator-editor__section" aria-labelledby="act-heading">
          <h2 id="act-heading" className="creator-editor__section-title">
            Atividades
          </h2>
          <p className="creator-editor__hint">Projetos, entregas ou tarefas avaliativas.</p>
          {content.activities.map((a) => (
            <div key={a.id} className="creator-editor__block">
              <label className="auth-field">
                <span>Título</span>
                <input value={a.title} onChange={(e) => updateActivity(a.id, { title: e.target.value })} />
              </label>
              <label className="auth-field">
                <span>Descrição</span>
                <textarea rows={3} value={a.body} onChange={(e) => updateActivity(a.id, { body: e.target.value })} />
              </label>
              <button type="button" className="btn btn-ghost creator-editor__remove" onClick={() => removeActivity(a.id)}>
                Remover atividade
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={addActivity}>
            + Adicionar atividade
          </button>
        </section>

        <section className="creator-editor__section" aria-labelledby="cur-heading">
          <h2 id="cur-heading" className="creator-editor__section-title">
            Currículo digital automático
          </h2>
          <p className="creator-editor__hint">
            Gere um texto único com base no curso e no que você cadastrou acima. Pode editar o texto depois.
          </p>
          <div className="creator-editor__cur-actions">
            <button type="button" className="btn btn-primary" onClick={runAutoCurriculum}>
              Gerar / atualizar currículo automático
            </button>
          </div>
          <label className="auth-field">
            <span>Currículo digital (texto)</span>
            <textarea
              className="creator-editor__curriculum"
              rows={14}
              value={content.curriculumDigital}
              onChange={(e) => setCurriculumManual(e.target.value)}
              placeholder="Clique em “Gerar / atualizar currículo automático” ou escreva manualmente."
            />
          </label>
        </section>
      </div>
    </div>
  )
}
