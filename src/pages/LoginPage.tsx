import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { EnterprisePlan, UserRole } from '../auth/AuthContext'
import { useAuth } from '../auth/AuthContext'
import { Logo } from '../components/Logo'
import { postAuthRedirect } from '../lib/authRedirect'

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const defaultRole = (params.get('tipo') === 'empresa' ? 'enterprise' : 'student') as UserRole

  const [role, setRole] = useState<UserRole>(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  /** Como a empresa entra: conta normal na plataforma ou contrato B2B MotStart */
  const [enterprisePlan, setEnterprisePlan] = useState<EnterprisePlan>('standard')

  const redirectAfterAuth = postAuthRedirect(location.state, params.get('redirect'))

  if (user) {
    return <Navigate to={redirectAfterAuth} replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const short = email.split('@')[0] || 'Usuario'
    login({
      email: email.trim() || 'user@motstart.com',
      name: short,
      role,
      companyName: role === 'enterprise' ? `${short} Ltda` : undefined,
      enterprisePlan: role === 'enterprise' ? enterprisePlan : undefined,
    })
    navigate(postAuthRedirect(location.state, params.get('redirect')), { replace: true })
  }

  return (
    <div className="page auth-page">
      <header className="auth-header">
        <Logo to="/" />
        <Link to="/cadastro" className="link-purple" state={location.state}>
          Criar conta
        </Link>
      </header>

      <main className="auth-main container">
        <div className="auth-card">
          <h1 className="auth-title">Entrar na MotStart</h1>
          <p className="auth-lead">
            Indique se você acessa como <strong>pessoa física / estudante</strong> ou como{' '}
            <strong>empresa</strong>. No acesso empresarial, escolha se a empresa tem{' '}
            <strong>contrato com a MotStart</strong> ou usa apenas a conta empresarial padrão na plataforma.
          </p>

          <div className="account-type" role="tablist" aria-label="Tipo de conta">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'student'}
              className={`account-type__btn ${role === 'student' ? 'account-type__btn--active' : ''}`}
              onClick={() => setRole('student')}
            >
              Particular / estudante
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'enterprise'}
              className={`account-type__btn ${role === 'enterprise' ? 'account-type__btn--active' : ''}`}
              onClick={() => setRole('enterprise')}
            >
              Empresa
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {role === 'enterprise' ? (
              <fieldset className="auth-enterprise-choice">
                <legend>Tipo de acesso empresarial</legend>
                <div className="auth-enterprise-choice__options">
                  <label>
                    <input
                      type="radio"
                      name="enterprise-plan"
                      checked={enterprisePlan === 'standard'}
                      onChange={() => setEnterprisePlan('standard')}
                    />
                    <span>
                      Conta empresarial na plataforma{' '}
                      <span className="auth-enterprise-choice__hint">
                        (busca de talentos, publicar vagas — sem contrato B2B específico com a MotStart)
                      </span>
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="enterprise-plan"
                      checked={enterprisePlan === 'contract'}
                      onChange={() => setEnterprisePlan('contract')}
                    />
                    <span>
                      Empresa com <strong>contrato MotStart (B2B)</strong>{' '}
                      <span className="auth-enterprise-choice__hint">
                        (regras do acordo: sem vitrine de vagas de outras empresas; colaboradores do contrato fora da
                        busca pública de talentos)
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>
            ) : null}
            <label className="auth-field">
              <span>E-mail</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
              />
            </label>
            <label className="auth-field">
              <span>Senha</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary btn-block auth-submit">
              Entrar
            </button>
          </form>

          <p className="auth-foot">
            Conta empresarial padrão acessa talentos e vagas. Contrato B2B segue o escopo do acordo.{' '}
            <Link
              to="/cadastro"
              state={{
                ...(typeof location.state === 'object' && location.state !== null ? location.state : {}),
                role,
              }}
            >
              Cadastre sua empresa
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
