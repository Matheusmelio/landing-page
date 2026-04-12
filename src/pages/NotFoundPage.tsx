import { Link } from 'react-router-dom'
import { MainHeader } from '../components/MainHeader'

export function NotFoundPage() {
  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top not-found">
        <p className="not-found__code">404</p>
        <h1 className="page-title">Página não encontrada</h1>
        <p className="page-lead">
          O endereço pode ter sido removido ou o link está incorreto.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn-primary">
            Ir ao início
          </Link>
          <Link to="/cursos" className="btn btn-ghost">
            Ver cursos
          </Link>
        </div>
      </div>
    </div>
  )
}
