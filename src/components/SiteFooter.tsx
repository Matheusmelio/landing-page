import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function SiteFooter() {
  const { user, isEnterprise } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <strong className="site-footer__name">MotStart</strong>
          <p className="site-footer__tagline">Cursos, planos e carreira em tecnologia.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Rodapé">
          <div className="site-footer__col">
            <span className="site-footer__heading">Aprender</span>
            {user ? (
              <Link to="/cursos">Cursos</Link>
            ) : (
              <Link to="/login" state={{ from: '/cursos' }}>
                Cursos
              </Link>
            )}
            {!isEnterprise ? <Link to="/planos">Planos</Link> : null}
            <Link to="/sobre">Sobre</Link>
            <Link to="/publicar-curso">Publicar curso</Link>
            <Link to="/exercicios-ia">Exercícios IA</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__heading">Conta</span>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
            <Link to="/perfil">Perfil</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__heading">Empresas</span>
            <Link to="/cadastro?tipo=empresa">Conta empresarial</Link>
            <Link to="/empresa/assessoria">Assessoria</Link>
            <Link to="/vagas">Vagas</Link>
          </div>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p className="site-footer__copy">© {year} MotStart. Demonstração — conteúdo ilustrativo.</p>
          <Link to="/termos" className="site-footer__legal">
            Termos e privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
