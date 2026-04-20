import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import { SecondaryHeader } from '../components/SecondaryHeader'
import { IMAGES } from '../constants/images'

/** Mock: perfis vinculados a contrato corporativo não aparecem na busca pública */
const MOCK_TALENTS = [
  {
    id: '1',
    name: 'Ana Carolina Silva',
    role: 'Desenvolvedora Full Stack Jr | Estudante de Ciência da Computação',
    loc: 'São Paulo, SP',
    bio: 'Estudante de Ciência da Computação apaixonada por desenvolvimento web e inteligência artificial. Sempre em busca de novos conhecimentos e projetos que desafiem o aprendizado.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', '+4'],
    courses: '4',
    hours: '28h',
    rating: '4.8',
    avatar: IMAGES.avatarAna,
    hiddenFromPublicSearch: false,
  },
  {
    id: '2',
    name: 'Bruno Mendes',
    role: 'Engenheiro de Software | Contrato corporativo MotStart',
    loc: 'Campinas, SP',
    bio: 'Profissional alocado via programa corporativo — perfil não listado na busca pública conforme acordo B2B.',
    skills: ['Java', 'Spring', 'AWS'],
    courses: '6',
    hours: '120h',
    rating: '4.9',
    avatar: IMAGES.avatarAna,
    hiddenFromPublicSearch: true,
  },
]

function TalentsSearchContent() {
  const visible = MOCK_TALENTS.filter((t) => !t.hiddenFromPublicSearch)

  return (
    <>
      <section className="talents-hero">
        <div className="container talents-hero__inner">
          <h1 className="talents-hero__title">Encontre Talentos 🎯</h1>
          <p className="talents-hero__subtitle">Descubra profissionais qualificados para sua equipe</p>
          <label className="search-field search-field--hero">
            <span className="sr-only">Buscar talentos</span>
            <svg className="search-field__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input type="search" className="search-field__input" placeholder="Buscar por nome, skills, tecnologias..." />
          </label>
        </div>
      </section>

      <div className="container section-wrap">
        <p className="talents-disclaimer">
          Profissionais vinculados a <strong>contratos corporativos B2B</strong> não aparecem nesta busca pública.
        </p>
        <div className="talents-toolbar">
          <p className="talents-count">
            {visible.length} talento(s) encontrado(s)
          </p>
          <button type="button" className="btn btn-ghost btn-filters">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filtros
          </button>
        </div>

        <div className="talents-results">
          {visible.map((t) => (
            <article key={t.id} className="talent-card">
              <span className="talent-card__badge">Disponível</span>
              <div className="talent-card__top">
                <img src={t.avatar} alt="" className="talent-card__avatar" width={72} height={72} />
                <div className="talent-card__header-text">
                  <h2 className="talent-card__name">{t.name}</h2>
                  <p className="talent-card__role">{t.role}</p>
                  <p className="talent-card__loc">
                    <span aria-hidden="true">📍</span> {t.loc}
                  </p>
                </div>
              </div>
              <p className="talent-card__bio">{t.bio}</p>
              <div className="talent-skills">
                {t.skills.map((s) => (
                  <span key={s} className="skill-pill">
                    {s}
                  </span>
                ))}
              </div>
              <div className="talent-stats">
                <div>
                  <span className="talent-stats__value">{t.courses}</span>
                  <span className="talent-stats__label">Cursos</span>
                </div>
                <div>
                  <span className="talent-stats__value">{t.hours}</span>
                  <span className="talent-stats__label">Estudadas</span>
                </div>
                <div>
                  <span className="talent-stats__value">{t.rating}</span>
                  <span className="talent-stats__label">Rating</span>
                  <span className="talent-stats__stars" aria-hidden="true">
                    ★★★★★
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}

export function TalentsPage() {
  const { user, isEnterprise, canEnterpriseRecruit } = useAuth()

  if (user && isEnterprise && !canEnterpriseRecruit) {
    return (
      <div className="page">
        <MainHeader />
        <section className="talents-gate">
          <div className="container section-wrap">
            <div className="talents-gate__card">
              <h1 className="talents-gate__title">Banco de talentos indisponível para este perfil</h1>
              <p className="talents-gate__text">
                Contas de <strong>colaborador</strong> (empresa com contrato MotStart) não acessam a busca pública de
                talentos. Peça ao <strong>gestor</strong> da sua empresa o acesso ou utilize o perfil adequado ao entrar
                na plataforma.
              </p>
              <div className="talents-gate__actions">
                <Link to="/perfil" className="btn btn-primary">
                  Ir ao perfil
                </Link>
                <Link to="/login?tipo=empresa" className="btn btn-ghost">
                  Entrar com outro perfil
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!user || !isEnterprise) {
    return (
      <div className="page">
        <MainHeader />
        <section className="talents-gate">
          <div className="container section-wrap">
            <div className="talents-gate__card">
              <h1 className="talents-gate__title">Área exclusiva para empresas</h1>
              <p className="talents-gate__text">
                A busca de talentos da MotStart está disponível apenas para <strong>contas empresariais</strong>.
                Estudantes utilizam cursos, planos e a vitrine de vagas; empresas encontram profissionais e publicam
                oportunidades.
              </p>
              <div className="talents-gate__actions">
                <Link to="/cadastro?tipo=empresa" className="btn btn-primary">
                  Cadastro empresarial
                </Link>
                <Link to="/login?tipo=empresa" className="btn btn-ghost">
                  Entrar como empresa
                </Link>
                <Link to="/planos" className="link-purple">
                  Sou estudante — ver planos
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <SecondaryHeader variant="voltar-perfil" />
      <TalentsSearchContent />
    </div>
  )
}
