import { Link } from 'react-router-dom'
import { PLANS } from '../data/plans'
import { MainHeader } from '../components/MainHeader'

export function PlansPage() {
  return (
    <div className="page">
      <MainHeader />

      <div className="container section-wrap section-wrap--top">
        <header className="plans-hero">
          <h1 className="page-title">Planos para o seu perfil</h1>
          <p className="page-lead plans-hero__lead">
            Cada plano tem um <strong>símbolo exclusivo</strong>: após a assinatura (demo), ele aparece no seu{' '}
            <Link to="/perfil" className="link-purple">
              perfil
            </Link>{' '}
            como selo da sua assinatura MotStart. Os planos cobrem <strong>trilhas exclusivas da plataforma</strong>; é
            diferente de publicar um curso autoral — veja{' '}
            <Link to="/sobre" className="link-purple">
              Sobre
            </Link>
            .
          </p>
        </header>

        <div className="plans-grid">
          {PLANS.map((p) => (
            <article key={p.id} className={`plan-card ${p.highlight ? 'plan-card--highlight' : ''}`}>
              {p.highlight ? <span className="plan-card__badge">Recomendado</span> : null}
              <div className="plan-card__symbol-wrap" aria-hidden="true">
                <span className="plan-card__symbol">{p.symbol}</span>
              </div>
              <h2 className="plan-card__name">{p.name}</h2>
              <p className="plan-card__price">{p.price}</p>
              <p className="plan-card__desc">{p.desc}</p>
              <ul className="plan-card__list">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link to={`/checkout?plan=${p.id}`} className="btn btn-primary btn-block">
                Assinar este plano
              </Link>
            </article>
          ))}
        </div>

        <section className="plans-enterprise-cta">
          <h2 className="plans-enterprise-cta__title">Empresa?</h2>
          <p className="plans-enterprise-cta__text">
            Para profissionalizar sua equipe com contrato sob medida, fale com nossa assistência — analisamos necessidade,
            trilhas e formalizamos o acordo.
          </p>
          <Link to="/empresa/assessoria" className="btn btn-ghost">
            Contratos e assessoria para equipes →
          </Link>
        </section>
      </div>
    </div>
  )
}
