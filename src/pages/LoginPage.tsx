import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { UserRole } from '../auth/types'
import type { EnterprisePlan } from '../lib/enterprisePlan'
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
  const [enterprisePlan, setEnterprisePlan] = useState<EnterprisePlan>(() =>
    params.get('plano') === 'avulsa' ? 'standard' : 'contract_employee'
  )

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
            Indique se você acessa como <strong>pessoa física / estudante</strong> ou como <strong>empresa</strong>. No
            acesso empresarial com <strong>contrato MotStart</strong>, escolha se você é <strong>colaborador</strong>{' '}
            (sem vagas/talentos) ou <strong>gestor</strong> (acesso completo), ou use conta empresarial avulsa.
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
                <legend>Perfil no contrato MotStart (empresa parceira)</legend>
                <div className="auth-enterprise-choice__options">
                  <label>
                    <input
                      type="radio"
                      name="enterprise-plan"
                      checked={enterprisePlan === 'contract_employee'}
                      onChange={() => setEnterprisePlan('contract_employee')}
                    />
                    <span>
                      <strong>Colaborador (funcionário)</strong>{' '}
                      <span className="auth-enterprise-choice__hint">
                        (sem vitrine de vagas e sem banco de talentos)
                      </span>
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="enterprise-plan"
                      checked={enterprisePlan === 'contract_manager'}
                      onChange={() => setEnterprisePlan('contract_manager')}
                    />
                    <span>
                      <strong>Gestor</strong>{' '}
                      <span className="auth-enterprise-choice__hint">
                        (vagas, talentos e publicação de vagas)
                      </span>
                    </span>
                  </label>
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
                        (sem contrato B2B — talentos e vagas como empresa avulsa)
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
            Colaborador não acessa vagas/talentos; gestor e conta avulsa sim.{' '}
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
