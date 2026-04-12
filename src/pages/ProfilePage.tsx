import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { AuthUser } from '../auth/AuthContext'
import { useAuth } from '../auth/AuthContext'
import { SecondaryHeader } from '../components/SecondaryHeader'
import { IMAGES } from '../constants/images'
import { DASHBOARD_ACHIEVEMENTS } from '../data/dashboardAchievements'
import { DASHBOARD_AGENDA } from '../data/dashboardAgenda'
import { getTeachingMeta } from '../data/courseTeachingMeta'
import { HOME_COURSES } from '../data/homeCourses'
import { getPlanById } from '../data/plans'
import { progressPercentForCourse } from '../lib/courseProgressDisplay'
import { getActivePlanId, getCourseProgressMap } from '../lib/userCourseProgress'

type EnterpriseUser = AuthUser & { role: 'enterprise' }

type ProfileTab = 'ativos' | 'agenda' | 'conquistas'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/perfil' }} />
  }

  if (user.role === 'enterprise') {
    return <EnterpriseProfile user={user as EnterpriseUser} />
  }

  return <StudentProfile user={user} />
}

function StudentProfile({ user }: { user: { name: string; email: string } }) {
  const activePlan = getPlanById(getActivePlanId())
  const [profileTab, setProfileTab] = useState<ProfileTab>('ativos')
  const [progress, setProgress] = useState(() => getCourseProgressMap())

  useEffect(() => {
    const refresh = () => setProgress(getCourseProgressMap())
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const activeCourses = useMemo(
    () => HOME_COURSES.filter((c) => progress[c.id] === 'em-andamento'),
    [progress],
  )

  return (
    <div className="page page--profile">
      <SecondaryHeader variant="voltar" />

      <section className="profile-hero">
        <div className="container profile-hero__grid">
          <div className="profile-hero__main">
            <div className="profile-hero__lead">
              <div className="profile-avatar-wrap">
                <img src={IMAGES.avatarAna} alt="" className="profile-avatar" width={120} height={120} />
                <span className="profile-avatar__status" title="Online" />
              </div>
              {activePlan ? (
                <div
                  className="profile-plan-chip profile-plan-chip--icon-only"
                  title={activePlan.name}
                  aria-label={`Plano ativo: ${activePlan.name}`}
                >
                  <span className="profile-plan-chip__symbol" aria-hidden="true">
                    {activePlan.symbol}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="profile-hero__text">
              <h1 className="profile-hero__name">{user.name}</h1>
              <p className="profile-hero__bio">
                Estudante de Ciência da Computação apaixonada por desenvolvimento web e inteligência artificial. Sempre
                em busca de novos conhecimentos!
              </p>
            </div>
          </div>
          <div className="profile-hero__actions">
            <Link to="/planos" className="btn btn-glass">
              Ver planos
            </Link>
            <Link to="/vagas" className="btn btn-glass">
              Ver vagas
            </Link>
            <button type="button" className="btn btn-glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" />
              </svg>
              Currículo
            </button>
            <button type="button" className="btn btn-glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 20H21M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.10218 19.5 6.5L8 18L4 19L5 15L16.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Editar
            </button>
          </div>
        </div>

        <div className="container profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__icon" aria-hidden="true">
              🏆
            </span>
            <span className="profile-stat__label">Concluídos</span>
            <span className="profile-stat__value">4</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__icon" aria-hidden="true">
              📖
            </span>
            <span className="profile-stat__label">Em Progresso</span>
            <span className="profile-stat__value">5</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__icon" aria-hidden="true">
              🕐
            </span>
            <span className="profile-stat__label">Horas</span>
            <span className="profile-stat__value">287h</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__icon" aria-hidden="true">
              🔥
            </span>
            <span className="profile-stat__label">Sequência</span>
            <span className="profile-stat__value">12 dias</span>
          </div>
        </div>
      </section>

      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <section className="info-card">
            <h2 className="info-card__title">Informações Pessoais</h2>
            <ul className="info-list">
              <li>
                <span className="info-list__icon">✉️</span>
                <a href={`mailto:${user.email}`} className="info-list__link">
                  {user.email}
                </a>
              </li>
              <li>
                <span className="info-list__icon">📞</span>
                (11) 98765-4321
              </li>
              <li>
                <span className="info-list__icon">📍</span>
                São Paulo, SP
              </li>
              <li>
                <span className="info-list__icon">📅</span>
                Membro desde 14 de jan. de 2024
              </li>
            </ul>
          </section>

          <section className="info-card">
            <h2 className="info-card__title">Informações Acadêmicas</h2>
            <dl className="info-dl">
              <div>
                <dt>Universidade</dt>
                <dd className="info-dl__highlight">Universidade Federal de São Paulo</dd>
              </div>
              <div>
                <dt>Curso</dt>
                <dd>Ciência da Computação</dd>
              </div>
              <div>
                <dt>Período Atual</dt>
                <dd>5º semestre</dd>
              </div>
              <div>
                <dt>Matrícula</dt>
                <dd>2024XXXX</dd>
              </div>
            </dl>
          </section>
        </aside>

        <div className="profile-main">
          <div className="profile-tabs-wrap">
            <div className="profile-tabs" role="tablist" aria-label="Perfil do estudante">
              <button
                type="button"
                className={`profile-tab ${profileTab === 'ativos' ? 'profile-tab--active' : ''}`}
                role="tab"
                aria-selected={profileTab === 'ativos'}
                onClick={() => setProfileTab('ativos')}
              >
                Cursos ativos ({activeCourses.length})
              </button>
              <button
                type="button"
                className={`profile-tab ${profileTab === 'agenda' ? 'profile-tab--active' : ''}`}
                role="tab"
                aria-selected={profileTab === 'agenda'}
                onClick={() => setProfileTab('agenda')}
              >
                Agenda
              </button>
              <button
                type="button"
                className={`profile-tab ${profileTab === 'conquistas' ? 'profile-tab--active' : ''}`}
                role="tab"
                aria-selected={profileTab === 'conquistas'}
                onClick={() => setProfileTab('conquistas')}
              >
                Conquistas
              </button>
            </div>
          </div>

          {profileTab === 'ativos' ? (
            activeCourses.length === 0 ? (
              <p className="profile-tab-empty" role="status">
                Nenhum curso em andamento. Explore o{' '}
                <Link to="/cursos" className="link-purple">
                  catálogo
                </Link>{' '}
                para começar.
              </p>
            ) : (
              <ul className="profile-course-list">
                {activeCourses.map((c) => {
                  const pct = progressPercentForCourse(c.id, 'em-andamento')
                  const teaching = getTeachingMeta(c.id)
                  return (
                    <li key={c.id}>
                      <Link to={`/curso/${c.id}`} className="profile-course-card">
                        <div className="profile-course-card__thumb">
                          <img src={c.image} alt="" width={100} height={100} />
                        </div>
                        <div className="profile-course-card__content">
                          <div className="profile-course-card__head">
                            <h3 className="profile-course-card__title">{c.title}</h3>
                            <span className="profile-course-card__pct">{pct}%</span>
                          </div>
                          <span className="pill-tag">{c.category}</span>
                          <p className="profile-course-card__meta">
                            {teaching.hours}h · {teaching.modules} módulos · {teaching.instructor}
                          </p>
                          <div
                            className="progress-bar progress-bar--dark"
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )
          ) : null}

          {profileTab === 'agenda' ? (
            <ul className="agenda-list">
              {DASHBOARD_AGENDA.map((ev) => (
                <li key={ev.id} className="agenda-item">
                  <div className="agenda-item__date">
                    <span className="agenda-item__date-label">{ev.dateLabel}</span>
                    <span className="agenda-item__time">{ev.timeRange}</span>
                  </div>
                  <div className="agenda-item__main">
                    <p className="agenda-item__title">{ev.title}</p>
                    <span className={`agenda-item__type agenda-item__type--${ev.type}`}>
                      {ev.type === 'live' ? 'Ao vivo' : ev.type === 'mentoria' ? 'Mentoria' : 'Prazo'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {profileTab === 'conquistas' ? (
            <ul className="achievements-grid">
              {DASHBOARD_ACHIEVEMENTS.map((a) => (
                <li
                  key={a.id}
                  className={`achievement-card ${a.unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
                >
                  <span className="achievement-card__icon" aria-hidden="true">
                    {a.icon}
                  </span>
                  <p className="achievement-card__title">{a.title}</p>
                  <p className="achievement-card__desc">{a.description}</p>
                  {a.unlocked ? (
                    <span className="achievement-card__badge">Desbloqueada</span>
                  ) : (
                    <span className="achievement-card__badge achievement-card__badge--locked">Em breve</span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function EnterpriseProfile({ user }: { user: EnterpriseUser }) {
  const company = user.companyName || 'Sua empresa'
  const isContract = user.enterprisePlan === 'contract'

  return (
    <div className="page page--profile">
      <SecondaryHeader variant="voltar" />

      <section className="profile-hero">
        <div className="container profile-hero__grid">
          <div className="profile-hero__main">
            <div className="enterprise-avatar" aria-hidden="true">
              {company.slice(0, 2).toUpperCase()}
            </div>
            <div className="profile-hero__text">
              <p className="profile-hero__badge">{isContract ? 'Contrato B2B MotStart' : 'Conta empresarial'}</p>
              <h1 className="profile-hero__name">{company}</h1>
              <p className="profile-hero__bio">
                Responsável: {user.name} · {user.email}.{' '}
                {isContract ? (
                  <>
                    Conta em contrato corporativo: <strong>sem acesso à vitrine de vagas de outras empresas</strong>.
                    Colaboradores vinculados ao programa não são exibidos na busca pública de talentos. Use a assistência
                    para capacitação e escopo do acordo.
                  </>
                ) : (
                  <>
                    Acesse busca de talentos, publique vagas para candidatos da plataforma e solicite contratos para
                    capacitação da equipe.
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="profile-hero__actions">
            <Link to="/talentos" className="btn btn-glass">
              Buscar talentos
            </Link>
            <Link to="/empresa/vagas" className="btn btn-glass">
              Publicar vagas
            </Link>
            <Link to="/empresa/assessoria" className="btn btn-glass">
              Contrato / equipe
            </Link>
          </div>
        </div>

        <div className="container profile-stats profile-stats--enterprise">
          <div className="profile-stat">
            <span className="profile-stat__label">Vagas ativas</span>
            <span className="profile-stat__value">—</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__label">Talentos salvos</span>
            <span className="profile-stat__value">—</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__label">Contrato</span>
            <span className="profile-stat__value">{isContract ? 'Ativo (B2B)' : 'Sob análise'}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__label">Suporte</span>
            <span className="profile-stat__value">assistência</span>
          </div>
        </div>
      </section>

      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <section className="info-card">
            <h2 className="info-card__title">Empresa</h2>
            <ul className="info-list">
              <li>
                <span className="info-list__icon">🏢</span>
                {company}
              </li>
              <li>
                <span className="info-list__icon">✉️</span>
                <a href={`mailto:${user.email}`} className="info-list__link">
                  {user.email}
                </a>
              </li>
            </ul>
          </section>
          <section className="info-card">
            <h2 className="info-card__title">Estudantes & vagas</h2>
            <p className="info-card__para">
              {isContract ? (
                <>
                  No contrato B2B, a vitrine pública de vagas de terceiros fica desativada. Divulgação de oportunidades
                  segue as regras do seu acordo com a MotStart.
                </>
              ) : (
                <>
                  Publicações podem aparecer em <Link to="/vagas">Vagas</Link> para perfis estudantes buscarem
                  oportunidade além de estudar.
                </>
              )}
            </p>
          </section>
        </aside>

        <div className="profile-main">
          <section className="info-card">
            <h2 className="info-card__title">Próximos passos</h2>
            <ul className="enterprise-checklist">
              <li>
                <Link to="/talentos">Explorar talentos</Link> na base MotStart.
              </li>
              <li>
                <Link to="/empresa/vagas">Cadastrar uma vaga</Link> com stack e modalidade.
              </li>
              <li>
                <Link to="/empresa/assessoria">Falar com a assistência</Link> para contrato de capacitação em equipe.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
