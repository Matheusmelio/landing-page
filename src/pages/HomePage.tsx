import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import { LandingGuestHero } from '../components/LandingGuestHero'
import { ScrollReveal } from '../components/ScrollReveal'
import { IMAGES } from '../constants/images'
import type { CourseBucket } from '../data/homeCourses'
import { HOME_COURSES } from '../data/homeCourses'
import { progressPercentForCourse } from '../lib/courseProgressDisplay'
import { getContractTeamProgressDemo } from '../lib/enterpriseTeamProgress'
import { countByBucket, getCourseProgressMap, hasActivePlanForUser } from '../lib/userCourseProgress'

type TabId = 'em-andamento' | 'disponiveis' | 'concluidos'

function bucketForTab(tab: TabId): CourseBucket {
  if (tab === 'em-andamento') return 'em-andamento'
  if (tab === 'disponiveis') return 'disponivel'
  return 'concluido'
}

function statusLabel(b: CourseBucket): string {
  if (b === 'em-andamento') return 'Em Andamento'
  if (b === 'disponivel') return 'Disponível'
  return 'Concluído'
}

const GUEST_POPULAR = HOME_COURSES.slice(0, 9)

const LANDING_TUTORS = [
  { name: 'Maria Silva', role: 'Front-end & acessibilidade', bio: 'Ex-big tech, foco em carreira júnior e mentoria em React.', initials: 'MS' },
  { name: 'João Santos', role: 'Data & ML', bio: 'Cientista de dados; trilhas práticas com projetos reais.', initials: 'JS' },
  { name: 'Ana Costa', role: 'UX Research', bio: 'Pesquisa com usuários e handoff para squads ágeis.', initials: 'AC' },
  { name: 'Ricardo Mendes', role: 'DevOps & cloud', bio: 'Automação, observabilidade e cultura de plataforma.', initials: 'RM' },
]

export function HomePage() {
  const { user, isB2BEnterprise } = useAuth()
  const isLoggedIn = !!user
  const [activeTab, setActiveTab] = useState<TabId>('em-andamento')
  const [progress, setProgress] = useState(() => getCourseProgressMap())

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

  const counts = useMemo(() => countByBucket(progress), [progress])

  const visibleCourses = useMemo(() => {
    const bucket = bucketForTab(activeTab)
    return HOME_COURSES.filter((c) => progress[c.id] === bucket)
  }, [progress, activeTab])

  const catalogTotal = HOME_COURSES.length
  const completionPct =
    catalogTotal > 0 ? Math.round((counts.concluidos / catalogTotal) * 100) : 0

  const contractTeamMembers = useMemo(() => {
    if (!user || user.role !== 'enterprise' || !isB2BEnterprise) return null
    return getContractTeamProgressDemo(user.companyName || user.email)
  }, [user, isB2BEnterprise])

  return (
    <div className="page">
      <MainHeader />

      {!isLoggedIn ? (
        <>
          <ScrollReveal as="section" className="home-landing-hero" aria-labelledby="landing-hero-heading">
            <LandingGuestHero catalogTotal={catalogTotal} />
          </ScrollReveal>

          <ScrollReveal as="section" className="home-landing-partners" aria-label="Parceiros">
            <div className="container home-landing-partners__inner">
              <span className="home-landing-partners__label">Confiança de quem aprende com a gente</span>
              <div className="home-landing-partners__logos">
                <span>TechEdu</span>
                <span>DevBrasil</span>
                <span>CloudCamp</span>
                <span>UXLab</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            as="section"
            staggerOnly
            className="home-landing-services"
            id="servicos"
            aria-labelledby="services-heading"
          >
            <div className="container">
              <div className="home-landing-section-head scroll-reveal-fade-block">
                <p className="home-landing-kicker">Nossos serviços</p>
                <h2 id="services-heading" className="home-landing-section-title">
                  Um ambiente de aprendizado envolvente e profissional
                </h2>
              </div>
              <div className="home-landing-services__grid scroll-reveal-stagger">
                <article className="home-landing-service home-landing-service--featured">
                  <div className="home-landing-service__icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 6h16v10H4V6zm2 2v6h12V8H6zm2 12h8v2H8v-2z"
                        fill="currentColor"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <h3 className="home-landing-service__title">Trilhas guiadas</h3>
                  <p className="home-landing-service__desc">Do zero ao portfólio, com projetos e feedback estruturado.</p>
                  <Link to="/login" state={{ from: '/cursos' }} className="home-landing-service__link">
                    Explorar cursos →
                  </Link>
                </article>
                <article className="home-landing-service">
                  <div className="home-landing-service__icon home-landing-service__icon--blue" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="home-landing-service__title">Planos flexíveis</h3>
                  <p className="home-landing-service__desc">Assinatura ou cursos avulsos — você escolhe como investir.</p>
                  <Link to="/planos" className="home-landing-service__link">
                    Ver planos →
                  </Link>
                </article>
                <article className="home-landing-service">
                  <div className="home-landing-service__icon home-landing-service__icon--pink" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 19h16v2H4v-2zm3-4h10l1-8H6l1 8zm-1-10h12l-1-3H7l-1 3z"
                        fill="currentColor"
                        opacity="0.85"
                      />
                    </svg>
                  </div>
                  <h3 className="home-landing-service__title">Carreira & vagas</h3>
                  <p className="home-landing-service__desc">Conectamos estudantes a oportunidades reais no mercado.</p>
                  <Link to="/vagas" className="home-landing-service__link">
                    Ver vagas →
                  </Link>
                </article>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal as="section" staggerOnly className="home-landing-popular" aria-labelledby="popular-heading">
            <div className="container">
              <div className="home-landing-section-head scroll-reveal-fade-block">
                <p className="home-landing-kicker">Explore programas</p>
                <h2 id="popular-heading" className="home-landing-section-title">
                  Nossas aulas mais populares
                </h2>
                <p className="home-landing-popular__intro">
                  Uma seleção do catálogo — valores avulsos ou inclusos no seu plano após assinar.
                </p>
              </div>
              <div className="home-course-grid home-landing-popular__grid scroll-reveal-stagger">
                {GUEST_POPULAR.map((c) => {
                  const showPlatformSeal = hasPlan && c.isPlatformCourse
                  return (
                    <Link
                      key={c.id}
                      to={`/curso/${c.id}/comprar`}
                      className="home-course-card home-course-card--guest"
                    >
                      <div className="home-course-card__image-wrap">
                        <img src={c.image} alt="" className="home-course-card__image" />
                        <span className="badge badge--category">{c.category}</span>
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
                      </div>
                    </Link>
                  )
                })}
              </div>
              <p className="home-landing-popular__more">
                <Link to="/login" state={{ from: '/cursos' }} className="btn btn-primary">
                  Explorar todos os programas
                </Link>
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            as="section"
            staggerOnly
            className="home-landing-tutors"
            id="instrutores"
            aria-labelledby="tutors-heading"
          >
            <div className="container">
              <div className="home-landing-section-head scroll-reveal-fade-block">
                <p className="home-landing-kicker">Instrutores</p>
                <h2 id="tutors-heading" className="home-landing-section-title">
                  Quem ensina na MotStart
                </h2>
                <p className="home-landing-tutors__intro">
                  Profissionais atuantes em produto, dados e engenharia — didática clara e foco em resultado.
                </p>
              </div>
              <div className="home-landing-tutors__grid scroll-reveal-stagger">
                {LANDING_TUTORS.map((t) => (
                  <article key={t.name} className="home-landing-tutor">
                    <div className="home-landing-tutor__avatar" aria-hidden="true">
                      {t.initials}
                    </div>
                    <h3 className="home-landing-tutor__name">{t.name}</h3>
                    <p className="home-landing-tutor__role">{t.role}</p>
                    <p className="home-landing-tutor__bio">{t.bio}</p>
                  </article>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal as="section" className="home-landing-quote" aria-labelledby="quote-heading">
            <div className="container home-landing-quote__inner">
              <h2 id="quote-heading" className="sr-only">
                Depoimento
              </h2>
              <blockquote className="home-landing-quote__text">
                “A plataforma organizou minha transição de carreira: trilhas objetivas e projetos que eu mostrei na
                entrevista.”
              </blockquote>
              <div className="home-landing-quote__author">
                <span className="home-landing-quote__name">Juliana Prado</span>
                <span className="home-landing-quote__meta">Aluna, trilha Web Full Stack</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal as="section" className="home-landing-about-cta" aria-labelledby="about-cta-heading">
            <div className="container home-landing-about-cta__inner">
              <h2 id="about-cta-heading" className="home-landing-about-cta__title">
                Conheça a MotStart
              </h2>
              <p className="home-landing-about-cta__text">
                Missão, equipe de desenvolvimento e como a plataforma funciona — tudo na página dedicada.
              </p>
              <Link to="/sobre" className="btn btn-primary">
                Ir para Sobre
              </Link>
            </div>
          </ScrollReveal>
        </>
      ) : (
        <>
          <section className="hero hero--dashboard">
            <div className="hero__decor hero__decor--code" aria-hidden="true">
              {'</>'}
            </div>
            <div className="hero__decor hero__decor--laptop" aria-hidden="true">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path
                  opacity="0.15"
                  d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V15H4V6Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path opacity="0.15" d="M2 18H22V20H2V18Z" fill="white" />
              </svg>
            </div>

            <div className="container hero__content">
              <p className="hero-dashboard__eyebrow">Seu painel</p>
              <h1 className="hero__title">Olá{user?.name ? `, ${user.name.split(' ')[0]}` : ''} — continue de onde parou</h1>
              <p className="hero__subtitle">
                Acompanhe cursos em andamento, disponíveis para você e concluídos. Agenda e conquistas ficam no seu{' '}
                <Link to="/perfil" className="hero-dashboard__link">
                  Perfil
                </Link>
                . Compre cursos ou planos em{' '}
                <Link to="/cursos" className="hero-dashboard__link">
                  Cursos
                </Link>
                .
              </p>

              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat__value">{catalogTotal}</span>
                  <span className="hero-stat__label">Cursos no catálogo</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat__value">{counts.emAndamento}</span>
                  <span className="hero-stat__label">Em andamento</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat__value">{completionPct}%</span>
                  <span className="hero-stat__label">Concluídos (seu progresso)</span>
                </div>
              </div>

              <label className="search-field search-field--hero">
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
                  placeholder="Buscar nos seus cursos…"
                />
              </label>
            </div>
          </section>

          <div className="container section-wrap">
            {contractTeamMembers ? (
              <section
                className="enterprise-contract-team"
                aria-labelledby="enterprise-contract-team-heading"
              >
                <div className="enterprise-contract-team__head">
                  <h2 id="enterprise-contract-team-heading" className="enterprise-contract-team__title">
                    Progresso da equipe no contrato
                  </h2>
                  <p className="enterprise-contract-team__lead">
                    Visão consolidada do avanço dos colaboradores vinculados ao contrato MotStart com{' '}
                    <strong>{user?.companyName || user?.name}</strong>.
                  </p>
                </div>
                <ul className="enterprise-contract-team__list">
                  {contractTeamMembers.map((m) => (
                    <li key={m.id} className="enterprise-contract-team__row">
                      <div className="enterprise-contract-team__person">
                        <span className="enterprise-contract-team__name">{m.name}</span>
                        <span className="enterprise-contract-team__role">{m.role}</span>
                      </div>
                      <div className="enterprise-contract-team__track">
                        <div className="enterprise-contract-team__progress-row">
                          <span>Progresso médio</span>
                          <span>{m.progressPct}%</span>
                        </div>
                        <div
                          className="progress-bar progress-bar--course-card enterprise-contract-team__bar"
                          role="progressbar"
                          aria-valuenow={m.progressPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div className="progress-bar__fill" style={{ width: `${m.progressPct}%` }} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {!hasPlan && user?.role !== 'enterprise' ? (
              <p className="home-pricing-hint">
                Preços avulsos abaixo de cada curso.{' '}
                <Link to="/planos" className="link-purple">
                  Assine um plano
                </Link>{' '}
                para acesso incluído na mensalidade.
              </p>
            ) : null}

            <div className="filter-tabs-wrap">
              <div className="filter-tabs" role="tablist" aria-label="Filtrar cursos">
                <button
                  type="button"
                  className={`filter-tab ${activeTab === 'em-andamento' ? 'filter-tab--active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'em-andamento'}
                  onClick={() => setActiveTab('em-andamento')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Em Andamento
                  <span
                    className={`filter-tab__badge ${activeTab === 'em-andamento' ? '' : 'filter-tab__badge--muted'}`}
                  >
                    {counts.emAndamento}
                  </span>
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeTab === 'disponiveis' ? 'filter-tab--active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'disponiveis'}
                  onClick={() => setActiveTab('disponiveis')}
                >
                  Disponíveis
                  <span className={`filter-tab__badge ${activeTab === 'disponiveis' ? '' : 'filter-tab__badge--muted'}`}>
                    {counts.disponiveis}
                  </span>
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeTab === 'concluidos' ? 'filter-tab--active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'concluidos'}
                  onClick={() => setActiveTab('concluidos')}
                >
                  Concluídos
                  <span className={`filter-tab__badge ${activeTab === 'concluidos' ? '' : 'filter-tab__badge--muted'}`}>
                    {counts.concluidos}
                  </span>
                </button>
              </div>
            </div>

            <div className="home-course-grid">
              {visibleCourses.length === 0 ? (
                <p className="home-empty" role="status">
                  Nenhum curso nesta categoria.
                </p>
              ) : (
                visibleCourses.map((c) => {
                  const bucket = progress[c.id] ?? 'disponivel'
                  const pct = progressPercentForCourse(c.id, bucket)
                  const showPlatformSeal = hasPlan && c.isPlatformCourse
                  return (
                    <Link key={c.id} to={`/curso/${c.id}`} className="home-course-card">
                      <div className="home-course-card__image-wrap">
                        <img src={c.image} alt="" className="home-course-card__image" />
                        <span className="badge badge--category">{c.category}</span>
                        <span className="badge badge--status">{statusLabel(bucket)}</span>
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
                        <div className="home-course-card__progress-block">
                          <div className="home-course-card__progress-row">
                            <span>Progresso</span>
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
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            <p className="home-dashboard-about-link">
              <Link to="/sobre" className="link-purple">
                Sobre a MotStart e criadores do site →
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
