import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import { IMAGES } from '../constants/images'
import type { CourseBucket, HomeCourseItem } from '../data/homeCourses'
import { HOME_COURSES } from '../data/homeCourses'
import { progressPercentForCourse } from '../lib/courseProgressDisplay'
import { getCourseProgressMap, hasActivePlan } from '../lib/userCourseProgress'

function statusLabel(b: CourseBucket): string {
  if (b === 'em-andamento') return 'Em Andamento'
  if (b === 'disponivel') return 'Disponível'
  return 'Concluído'
}

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function courseHref(c: HomeCourseItem, isLoggedIn: boolean, bucket: CourseBucket, hasPlan: boolean): string {
  if (!isLoggedIn) return `/curso/${c.id}/comprar`
  const planCovers = hasPlan && c.isPlatformCourse
  if (bucket === 'disponivel' && !planCovers) return `/curso/${c.id}/comprar`
  return `/curso/${c.id}`
}

/** Curso ainda não adquirido e precisa pagar avulso (sem plano que cubra). */
function needsAvulsoPurchase(c: HomeCourseItem, bucket: CourseBucket, hasPlan: boolean): boolean {
  return bucket === 'disponivel' && !(hasPlan && c.isPlatformCourse)
}

export function CoursesPage() {
  const { user } = useAuth()
  const isLoggedIn = Boolean(user)
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState(() => getCourseProgressMap())
  const hasPlan = hasActivePlan()

  useEffect(() => {
    const refresh = () => setProgress(getCourseProgressMap())
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return HOME_COURSES
    return HOME_COURSES.filter((c) => {
      const hay = normalize(`${c.title} ${c.category}`)
      return hay.includes(q)
    })
  }, [query])

  const purchasableFiltered = useMemo(() => {
    if (!isLoggedIn) return []
    return filtered.filter((c) => {
      const bucket = progress[c.id] ?? 'disponivel'
      return needsAvulsoPurchase(c, bucket, hasPlan)
    })
  }, [filtered, progress, hasPlan, isLoggedIn])

  const spotlightIds = useMemo(() => new Set(purchasableFiltered.slice(0, 6).map((c) => c.id)), [purchasableFiltered])

  const catalogGrid = useMemo(() => {
    const q = query.trim()
    if (!isLoggedIn || q) return filtered
    return filtered.filter((c) => !spotlightIds.has(c.id))
  }, [filtered, isLoggedIn, query, spotlightIds])

  const showBuySpotlight = isLoggedIn && purchasableFiltered.length > 0 && !query.trim()

  return (
    <div className="page">
      <MainHeader />

      <div className="container section-wrap section-wrap--top courses-page">
        <header className="courses-page__header">
          <h1 className="page-title">Cursos</h1>
          <p className="page-lead">
            {isLoggedIn ? (
              <>
                Busque no catálogo: continue seus cursos em andamento e{' '}
                <strong>compre novos títulos avulsos</strong> quando estiverem disponíveis para compra.
              </>
            ) : (
              <>
                Busque no catálogo, compare valores e veja o que já faz parte do seu plano — ou compre cursos avulsos.
              </>
            )}
          </p>
        </header>

        <label className="search-field courses-page__search">
          <span className="sr-only">Buscar cursos</span>
          <svg className="search-field__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            className="search-field__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome do curso, área (ex.: Python, design)…"
            autoComplete="off"
          />
        </label>

        <p className="courses-page__hint">
          {hasPlan ? (
            <>
              Seu plano ativo cobre o acesso indicado abaixo. Para ampliar, visite{' '}
              <Link to="/planos" className="link-purple">
                Planos
              </Link>
              .
            </>
          ) : (
            <>
              Preços avulsos por curso; ou{' '}
              <Link to="/planos" className="link-purple">
                assine um plano
              </Link>{' '}
              para economizar.
            </>
          )}
        </p>

        {showBuySpotlight ? (
          <section className="courses-page__spotlight" aria-labelledby="courses-buy-heading">
            <div className="courses-page__spotlight-head">
              <h2 id="courses-buy-heading" className="courses-page__spotlight-title">
                Cursos para comprar
              </h2>
              <p className="courses-page__spotlight-lead">
                Seleção com preço avulso — clique no card para revisar e finalizar a compra.
              </p>
            </div>
            <div className="home-course-grid courses-page__spotlight-grid">
              {purchasableFiltered.slice(0, 6).map((c) => {
                const bucket = progress[c.id] ?? 'disponivel'
                const showPlatformSeal = hasPlan && c.isPlatformCourse
                const to = courseHref(c, isLoggedIn, bucket, hasPlan)
                const buy = needsAvulsoPurchase(c, bucket, hasPlan)
                return (
                  <Link
                    key={c.id}
                    to={to}
                    className={`home-course-card ${buy ? 'home-course-card--buy' : ''}`}
                  >
                    <div className="home-course-card__image-wrap">
                      <img src={c.image} alt="" className="home-course-card__image" />
                      <span className="badge badge--category">{c.category}</span>
                      <span className="badge badge--status">{statusLabel(bucket)}</span>
                      {buy ? <span className="badge badge--comprar">Comprar</span> : null}
                      {showPlatformSeal ? (
                        <div className="home-course-card__platform-mark" title="Curso oficial MotStart">
                          <img src={IMAGES.logoIcon} alt="" />
                        </div>
                      ) : null}
                    </div>
                    <div className="home-course-card__body">
                      <h2 className="home-course-card__heading">{c.title}</h2>
                      <p className="home-course-card__meta home-course-card__meta--body">
                        <span>★ {c.rating}</span>
                        <span>{c.students.toLocaleString('pt-BR')} alunos</span>
                      </p>
                      <p className="home-course-card__price">{c.priceLabel}</p>
                      <p className="home-course-card__buy-cta">Ver detalhes e pagar</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : null}

        {showBuySpotlight ? (
          <h2 className="courses-page__catalog-title">Todo o catálogo</h2>
        ) : null}

        <div className="home-course-grid">
          {catalogGrid.length === 0 ? (
            <p className="home-empty" role="status">
              {filtered.length === 0 && query.trim()
                ? `Nenhum curso encontrado para “${query.trim()}”. Tente outro termo.`
                : showBuySpotlight && filtered.length > 0
                  ? 'Todos os cursos desta lista já aparecem na seção “Cursos para comprar” acima.'
                  : 'Nenhum curso para exibir nesta lista.'}
            </p>
          ) : (
            catalogGrid.map((c) => {
              const bucket = progress[c.id] ?? 'disponivel'
              const pct = progressPercentForCourse(c.id, bucket)
              const showPlatformSeal = hasPlan && c.isPlatformCourse
              const to = courseHref(c, isLoggedIn, bucket, hasPlan)
              const buy = isLoggedIn && needsAvulsoPurchase(c, bucket, hasPlan)
              return (
                <Link
                  key={c.id}
                  to={to}
                  className={`home-course-card ${buy ? 'home-course-card--buy' : ''}`}
                >
                  <div className="home-course-card__image-wrap">
                    <img src={c.image} alt="" className="home-course-card__image" />
                    <span className="badge badge--category">{c.category}</span>
                    <span className="badge badge--status">{statusLabel(bucket)}</span>
                    {buy ? <span className="badge badge--comprar">Comprar</span> : null}
                    {showPlatformSeal ? (
                      <div className="home-course-card__platform-mark" title="Curso oficial MotStart">
                        <img src={IMAGES.logoIcon} alt="" />
                      </div>
                    ) : null}
                  </div>
                  <div className="home-course-card__body">
                    <h2 className="home-course-card__heading">{c.title}</h2>
                    <p className="home-course-card__meta home-course-card__meta--body">
                      <span>★ {c.rating}</span>
                      <span>{c.students.toLocaleString('pt-BR')} alunos</span>
                    </p>
                    {!isLoggedIn ? (
                      <p className="home-course-card__price">{c.priceLabel}</p>
                    ) : buy ? (
                      <>
                        <p className="home-course-card__price">{c.priceLabel}</p>
                        <p className="home-course-card__buy-cta">Clique para comprar</p>
                      </>
                    ) : (
                      <div className="home-course-card__progress-block">
                        <div className="home-course-card__progress-row">
                          <span>{bucket === 'concluido' ? 'Concluído' : 'Progresso'}</span>
                          <span>{pct}%</span>
                        </div>
                        <div
                          className="progress-bar progress-bar--course-card"
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
