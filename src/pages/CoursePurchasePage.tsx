import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { processCoursePurchaseMock } from '../api/mockClient'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import { HOME_COURSES } from '../data/homeCourses'
import { getTeachingMeta } from '../data/courseTeachingMeta'
import { getCourseProgressMap, hasActivePlanForUser, setCourseBucket } from '../lib/userCourseProgress'

export function CoursePurchasePage() {
  const { courseId = '' } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const fromPath = `${location.pathname}${location.search}`

  const [progress, setProgress] = useState(() => getCourseProgressMap())
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [cardLast4, setCardLast4] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ orderId: string } | null>(null)

  const course = useMemo(() => HOME_COURSES.find((c) => c.id === courseId), [courseId])
  const meta = getTeachingMeta(courseId)
  const hasPlan = Boolean(user && hasActivePlanForUser(user.email))

  useEffect(() => {
    const refresh = () => setProgress(getCourseProgressMap())
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    if (!course) return
    document.title = `Comprar: ${course.title} — MotStart`
    return () => {
      document.title = 'MotStart — Aprendizado em Tech'
    }
  }, [course])

  if (!user) {
    return <Navigate to="/login" replace state={{ from: fromPath }} />
  }

  if (!course) {
    return <Navigate to="/cursos" replace />
  }

  const bucket = progress[course.id] ?? 'disponivel'

  if (bucket === 'em-andamento' || bucket === 'concluido') {
    return <Navigate to={`/curso/${course.id}`} replace />
  }

  if (hasPlan && course.isPlatformCourse) {
    return <Navigate to={`/curso/${course.id}`} replace />
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await processCoursePurchaseMock({
        courseId: course.id,
        payerName: name.trim() || 'Cliente',
        payerEmail: email.trim(),
        cardLast4: cardLast4.replace(/\D/g, '').slice(-4) || '0000',
      })
      setCourseBucket(course.id, 'em-andamento')
      setProgress(getCourseProgressMap())
      setSuccess({ orderId: res.orderId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page">
        <MainHeader />
        <div className="container section-wrap section-wrap--top">
          <div className="checkout-success">
            <h1 className="page-title">Compra confirmada (demo)</h1>
            <p className="page-lead">
              Pedido <strong>{success.orderId}</strong>. O curso foi liberado na sua conta — comece quando quiser.
            </p>
            <div className="checkout-success__actions">
              <Link to={`/curso/${course.id}`} className="btn btn-primary">
                Ir para o curso
              </Link>
              <Link to="/cursos" className="btn btn-ghost">
                Voltar ao catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top">
        <p className="course-purchase-back">
          <Link to="/cursos" className="link-purple">
            ← Catálogo de cursos
          </Link>
        </p>
        <div className="checkout-layout">
          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Curso</h2>
            <p className="checkout-summary__plan">{course.title}</p>
            <p className="checkout-summary__price">{course.priceLabel}</p>
            <ul className="checkout-summary__list">
              <li>
                {meta.hours}h · {meta.modules} módulos
              </li>
              <li>Instrutor: {meta.instructor}</li>
              <li>★ {course.rating} · {course.students.toLocaleString('pt-BR')} alunos</li>
            </ul>
            <p className="checkout-summary__note">
              Ambiente de demonstração: nenhum valor real é cobrado. É necessário estar logado para concluir a compra.
            </p>
          </aside>

          <form className="auth-card checkout-form" onSubmit={submit}>
            <h1 className="auth-title">Finalizar compra</h1>
            <p className="auth-lead">
              Preencha os dados para simular o pagamento. Após a confirmação, o curso aparece como em andamento no seu
              painel.
            </p>

            <label className="auth-field">
              <span>Nome completo</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
            <label className="auth-field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="auth-field">
              <span>Últimos 4 dígitos do cartão (demo)</span>
              <input
                inputMode="numeric"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="4242"
              />
            </label>

            {error ? <p className="checkout-error">{error}</p> : null}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Processando…' : `Pagar ${course.priceLabel} (demo)`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
