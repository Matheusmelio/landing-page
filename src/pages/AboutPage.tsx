import { Link } from 'react-router-dom'
import { MainHeader } from '../components/MainHeader'
import { MOTSTART_PLAN_ECOSYSTEM } from '../data/plans'
import { SITE_CREATORS } from '../data/siteCreators'

export function AboutPage() {
  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top about-page about-page--rich">
        <header className="about-page__hero">
          <h1 className="page-title">Sobre a MotStart</h1>
          <p className="page-lead about-page__lead">
            Uma plataforma de aprendizado em tecnologia que conecta estudantes, instrutores independentes e empresas —
            com trilhas guiadas, planos de assinatura e ferramentas de carreira. Esta versão é uma{' '}
            <strong>demonstração</strong>: login, planos, checkout e publicação de cursos são simulados no seu
            navegador.
          </p>
        </header>

        <div className="about-page__grid">
          <section className="about-card" aria-labelledby="what-heading">
            <h2 id="what-heading" className="about-card__title">
              O que fazemos
            </h2>
            <ul className="about-card__list">
              <li>Cursos e trilhas em programação, dados, design e soft skills.</li>
              <li>Planos que liberam conteúdo exclusivo da plataforma MotStart e benefícios de ecossistema.</li>
              <li>Vitrine de vagas e busca de talentos para empresas parceiras.</li>
              <li>Espaço para perfis criarem e precificarem <strong>o próprio curso</strong> (fluxo demo).</li>
            </ul>
          </section>

          <section className="about-card about-card--accent" aria-labelledby="plan-heading">
            <h2 id="plan-heading" className="about-card__title">
              Planos MotStart (conteúdo exclusivo da plataforma)
            </h2>
            <p className="about-card__text">
              A assinatura refere-se às <strong>trilhas e cursos mantidos pela MotStart</strong>. Ao assinar, você integra o
              ecossistema com benefícios como:
            </p>
            <ul className="about-card__list about-card__list--check">
              {MOTSTART_PLAN_ECOSYSTEM.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="about-card__cta">
              <Link to="/planos" className="btn btn-primary">
                Comparar planos
              </Link>
            </p>
          </section>

          <section className="about-card" aria-labelledby="creator-heading">
            <h2 id="creator-heading" className="about-card__title">
              Criadores de conteúdo
            </h2>
            <p className="about-card__text">
              Instrutores podem <strong>cadastrar um curso próprio</strong>, definir categoria, descrição e preço. Isso é
              independente do plano de assinatura: o plano cobre o catálogo exclusivo MotStart; o curso autoral é outra
              frente (neste protótipo, os dados ficam apenas no seu navegador).
            </p>
            <p className="about-card__cta">
              <Link to="/publicar-curso" className="btn btn-outline-primary">
                Publicar um curso (demo)
              </Link>
            </p>
          </section>

          <section className="about-card" aria-labelledby="who-heading">
            <h2 id="who-heading" className="about-card__title">
              Para quem é
            </h2>
            <dl className="about-dl">
              <div>
                <dt>Estudantes</dt>
                <dd>Trilhas, exercícios com IA, progresso e visibilidade para recrutadores.</dd>
              </div>
              <div>
                <dt>Empresas</dt>
                <dd>Busca de talentos, vagas e assessoria para capacitação em equipe (fluxos demonstrativos).</dd>
              </div>
              <div>
                <dt>Instrutores</dt>
                <dd>Divulgação de curso autoral com preço definido por você (ambiente de testes).</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="about-page__section about-page__section--creators" aria-labelledby="team-heading">
          <h2 id="team-heading" className="about-page__subtitle">
            Criadores deste site (projeto)
          </h2>
          <ul className="about-page__creators about-page__creators--grid">
            {SITE_CREATORS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        <footer className="about-page__footer">
          <Link to="/cursos" className="link-purple">
            Ver catálogo de cursos →
          </Link>
          {' · '}
          <Link to="/termos" className="link-purple">
            Termos e privacidade
          </Link>
        </footer>
      </div>
    </div>
  )
}
