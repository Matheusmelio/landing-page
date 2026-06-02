'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { ClientRedirect } from '@/components/ClientRedirect'
import { loginHref } from '@/lib/authUrls'
import { MainHeader } from '../components/MainHeader'
import { MOTSTART_PLAN_ECOSYSTEM } from '../data/plans'
import {
  CREATOR_COURSE_REVIEW_MS,
  addCreatorCourse,
  getCreatorCourseReviewRemainingMs,
  getCreatorCourseReviewStatus,
  listCreatorCoursesByEmail,
} from '../lib/creatorCourses'

function parsePriceToCents(raw: string): number | null {
  const s = raw.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(s)
  if (Number.isNaN(n) || n < 0) return null
  return Math.round(n * 100)
}

function formatCentsLabel(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

function formatReviewCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function CreatorPublishPage() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [coursesRevision, bumpCoursesRevision] = useState(0)

  const myCourses = useMemo(() => {
    if (!user?.email) return []
    void coursesRevision
    return listCreatorCoursesByEmail(user.email)
  }, [user?.email, coursesRevision])

  const hasCoursesInReview = useMemo(
    () => myCourses.some((course) => getCreatorCourseReviewStatus(course, nowMs) === 'em-analise'),
    [myCourses, nowMs],
  )

  useEffect(() => {
    if (!hasCoursesInReview) return
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [hasCoursesInReview])

  if (!user) {
    return <ClientRedirect href={loginHref('/publicar-curso')} />
  }

  if (user.role === 'enterprise') {
    return (
      <div className="page">
        <MainHeader />
        <div className="container section-wrap section-wrap--top">
          <p className="page-lead">Área disponível para perfil de estudante. Empresas usam talentos e vagas.</p>
          <Link href="/talentos" className="link-purple">
            Ir para Talentos →
          </Link>
        </div>
      </div>
    )
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const t = title.trim()
    const cat = category.trim()
    const desc = description.trim()
    if (t.length < 3) {
      setError('Informe um título mais descritivo.')
      return
    }
    if (cat.length < 2) {
      setError('Informe uma categoria ou área (ex.: Front-end).')
      return
    }
    const cents = parsePriceToCents(priceInput.trim() || '0')
    if (cents === null || cents <= 0) {
      setError('Informe um preço válido em reais (ex.: 149,90).')
      return
    }
    addCreatorCourse({
      title: t,
      category: cat,
      description: desc || '—',
      priceLabel: formatCentsLabel(cents),
      priceCents: cents,
      authorEmail: user.email,
      authorName: user.name,
    })
    setDone(true)
    setTitle('')
    setCategory('')
    setDescription('')
    setPriceInput('')
    bumpCoursesRevision((x) => x + 1)
    window.setTimeout(() => setDone(false), 4000)
  }

  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top creator-publish">
        <header className="creator-publish__header">
          <h1 className="page-title">Publicar um curso</h1>
          <p className="page-lead creator-publish__lead">
            Ambiente de demonstração: cadastre o título, a área, uma descrição e o <strong>preço que você deseja cobrar</strong>{' '}
            pelo seu curso. Isso é independente da <strong>assinatura MotStart</strong> (planos com trilhas exclusivas da
            plataforma).
          </p>
        </header>

        <aside className="creator-publish__callout" aria-labelledby="eco-heading">
          <h2 id="eco-heading" className="creator-publish__callout-title">
            O que é o plano MotStart
          </h2>
          <p className="creator-publish__callout-text">
            Os planos da plataforma dão acesso a <strong>cursos e trilhas exclusivos da MotStart</strong>, além de:
          </p>
          <ul className="creator-publish__callout-list">
            {MOTSTART_PLAN_ECOSYSTEM.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="creator-publish__callout-foot">
            Já esta página é para <strong>você divulgar o seu próprio curso</strong> com preço definido por você (simulação
            local — sem pagamento real).
          </p>
        </aside>

        <form className="creator-publish__form auth-card" onSubmit={submit}>
          <h2 className="creator-publish__form-title">Dados do curso</h2>
          <label className="auth-field">
            <span>Título</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex.: React na prática" />
          </label>
          <label className="auth-field">
            <span>Categoria / área</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="Ex.: Front-end" />
          </label>
          <label className="auth-field">
            <span>Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Público-alvo, carga horária pretendida, pré-requisitos…"
            />
          </label>
          <label className="auth-field">
            <span>Preço (BRL)</span>
            <input
              inputMode="decimal"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              required
              placeholder="Ex.: 197,00"
            />
          </label>
          {error ? <p className="checkout-error">{error}</p> : null}
          {done ? (
            <p className="creator-publish__success" role="status">
              Curso enviado para análise de segurança. O temporizador aparece na lista abaixo.
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary btn-block">
            Enviar curso para análise
          </button>
        </form>

        <section className="creator-publish__list" aria-labelledby="my-courses-heading">
          <h2 id="my-courses-heading" className="creator-publish__list-title">
            Meus cursos publicados (demo)
          </h2>
          {myCourses.length === 0 ? (
            <p className="creator-publish__empty">Nenhum curso seu ainda — preencha o formulário acima.</p>
          ) : (
            <ul className="creator-publish__cards">
              {myCourses.map((c) => {
                const reviewStatus = getCreatorCourseReviewStatus(c, nowMs)
                const remainingMs = getCreatorCourseReviewRemainingMs(c, nowMs)
                const reviewPct =
                  reviewStatus === 'aprovado'
                    ? 100
                    : Math.max(0, Math.min(100, Math.round(((CREATOR_COURSE_REVIEW_MS - remainingMs) / CREATOR_COURSE_REVIEW_MS) * 100)))
                return (
                  <li key={c.id} className="creator-publish__card">
                    <div className="creator-publish__card-top">
                      <h3 className="creator-publish__card-title">{c.title}</h3>
                      <span className="creator-publish__card-price">{c.priceLabel}</span>
                    </div>
                    <p className="creator-publish__card-meta">
                      <span
                        className={`creator-publish__badge ${
                          reviewStatus === 'em-analise' ? 'creator-publish__badge--review' : ''
                        }`}
                      >
                        {reviewStatus === 'em-analise' ? 'Em análise' : 'Publicado'}
                      </span>{' '}
                      · {c.category}
                    </p>
                    <p className="creator-publish__card-desc">{c.description}</p>
                    <div className="creator-publish__review">
                      <div className="creator-publish__review-row">
                        <span>
                          {reviewStatus === 'em-analise'
                            ? 'Análise automática de segurança da publicação'
                            : 'Análise concluída'}
                        </span>
                        <strong>
                          {reviewStatus === 'em-analise' ? formatReviewCountdown(remainingMs) : 'Liberado'}
                        </strong>
                      </div>
                      <div
                        className="progress-bar progress-bar--course-card"
                        role="progressbar"
                        aria-valuenow={reviewPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar__fill" style={{ width: `${reviewPct}%` }} />
                      </div>
                    </div>
                    <div className="creator-publish__card-actions">
                      {reviewStatus === 'aprovado' ? (
                        <Link href={`/publicar-curso/${c.id}/editar`} className="btn btn-primary">
                          Editar conteúdo
                        </Link>
                      ) : (
                        <button type="button" className="btn btn-ghost" disabled>
                          Aguardando análise
                        </button>
                      )}
                      <span className="creator-publish__card-hint">
                        {reviewStatus === 'em-analise'
                          ? 'O sistema registra título, categoria, descrição e preço antes de liberar a publicação.'
                          : 'Vídeos, exercícios, atividades e currículo digital'}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <p className="creator-publish__footer">
          <Link href="/planos" className="link-purple">
            Ver planos MotStart
          </Link>
          {' · '}
          <Link href="/cursos" className="link-purple">
            Catálogo da plataforma
          </Link>
        </p>
      </div>
    </div>
  )
}
