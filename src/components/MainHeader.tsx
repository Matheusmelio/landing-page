import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Logo } from './Logo'

export function MainHeader() {
  const [open, setOpen] = useState(false)
  const { user, logout, isEnterprise, isStudent, isContractEnterprise, canEnterpriseRecruit } = useAuth()
  const showPublicJobsNav = !isContractEnterprise

  const close = () => setOpen(false)

  return (
    <header className="main-header">
      <div className="main-header__inner">
        <Logo to="/" />

        <button
          type="button"
          className="main-header__burger"
          aria-expanded={open}
          aria-controls="main-nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <nav className="main-header__nav main-header__nav--desktop" aria-label="Principal">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            Início
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Sobre
          </NavLink>
          <NavLink
            to="/exercicios-ia"
            className={({ isActive }) => `nav-link nav-link--sparkle${isActive ? ' active' : ''}`}
          >
            <span>Exercícios IA</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          {user ? (
            <NavLink to="/cursos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Cursos
            </NavLink>
          ) : (
            <Link to="/login" state={{ from: '/cursos' }} className="nav-link">
              Cursos
            </Link>
          )}
          {isStudent ? (
            <NavLink
              to="/publicar-curso"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Publicar curso
            </NavLink>
          ) : null}
          {!isEnterprise ? (
            <NavLink to="/planos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Planos
            </NavLink>
          ) : null}
          {showPublicJobsNav ? (
            <NavLink to="/vagas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Vagas
            </NavLink>
          ) : null}
          {isEnterprise && canEnterpriseRecruit ? (
            <NavLink to="/talentos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Talentos
            </NavLink>
          ) : null}
          {isEnterprise && canEnterpriseRecruit ? (
            <NavLink to="/empresa/vagas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Publicar vaga
            </NavLink>
          ) : null}
        </nav>

        <div className="main-header__actions main-header__actions--desktop">
          {user ? (
            <>
              <span className="main-header__user" title={user.email}>
                {user.role === 'enterprise' ? user.companyName || user.name : user.name}
              </span>
              <Link to="/perfil" className="btn btn-ghost">
                Perfil
              </Link>
              <button type="button" className="btn btn-ghost" onClick={() => logout()}>
                Sair
              </button>
            </>
          ) : (
            <div className="main-header__auth-group">
              <Link to="/login" className="btn btn-outline-primary">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-primary">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div id="main-nav-drawer" className="main-header__drawer">
          <nav className="main-header__drawer-nav" aria-label="Principal mobile">
            <NavLink to="/" className="drawer-link" end onClick={close}>
              Início
            </NavLink>
            <NavLink to="/sobre" className="drawer-link" onClick={close}>
              Sobre
            </NavLink>
            <Link to="/exercicios-ia" className="drawer-link drawer-link--sparkle" onClick={close}>
              Exercícios IA
            </Link>
            {user ? (
              <NavLink to="/cursos" className="drawer-link" onClick={close}>
                Cursos
              </NavLink>
            ) : (
              <Link to="/login" state={{ from: '/cursos' }} className="drawer-link" onClick={close}>
                Cursos
              </Link>
            )}
            {isStudent ? (
              <NavLink to="/publicar-curso" className="drawer-link" onClick={close}>
                Publicar curso
              </NavLink>
            ) : null}
            {!isEnterprise ? (
              <NavLink to="/planos" className="drawer-link" onClick={close}>
                Planos
              </NavLink>
            ) : null}
            {showPublicJobsNav ? (
              <NavLink to="/vagas" className="drawer-link" onClick={close}>
                Vagas
              </NavLink>
            ) : null}
            {isEnterprise && canEnterpriseRecruit ? (
              <NavLink to="/talentos" className="drawer-link" onClick={close}>
                Talentos
              </NavLink>
            ) : null}
            {isEnterprise && canEnterpriseRecruit ? (
              <NavLink to="/empresa/vagas" className="drawer-link" onClick={close}>
                Publicar vaga
              </NavLink>
            ) : null}
            <Link to="/empresa/assessoria" className="drawer-link" onClick={close}>
              Assessoria empresas
            </Link>
            {user ? (
              <>
                <NavLink to="/perfil" className="drawer-link drawer-link--cta" onClick={close}>
                  Meu perfil
                </NavLink>
                <button type="button" className="drawer-link" onClick={() => { logout(); close(); }}>
                  Sair
                </button>
              </>
            ) : (
              <div className="main-header__drawer-auth">
                <Link to="/login" className="drawer-link drawer-link--cta" onClick={close}>
                  Entrar
                </Link>
                <Link to="/cadastro" className="drawer-link drawer-link--outline" onClick={close}>
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <div className="main-header__backdrop" data-visible={open} onClick={close} aria-hidden="true" />
    </header>
  )
}
