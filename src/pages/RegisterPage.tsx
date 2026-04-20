import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { UserRole } from '../auth/types'
import type { EnterprisePlan } from '../lib/enterprisePlan'
import { useAuth } from '../auth/AuthContext'
import { Logo } from '../components/Logo'
import { postAuthRedirect } from '../lib/authRedirect'

export function RegisterPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const initial = (params.get('tipo') === 'empresa' ? 'enterprise' : 'student') as UserRole

  const [role, setRole] = useState<UserRole>(initial)
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
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
    const displayName = name.trim() || 'Usuário'
    login({
      email: email.trim() || 'novo@motstart.com',
      name: displayName,
      role,
      companyName: role === 'enterprise' ? (companyName.trim() || `${displayName} Tech`) : undefined,
      enterprisePlan: role === 'enterprise' ? enterprisePlan : undefined,
    })
    navigate(postAuthRedirect(location.state, params.get('redirect')), { replace: true })
  }

  return (
    <div className="page auth-page">
      <header className="auth-header">
        <Logo to="/" />
        <Link to="/login" className="link-purple">
          Já tenho conta
        </Link>
      </header>

      <main className="auth-main container">
        <div className="auth-card auth-card--wide">
          <h1 className="auth-title">Criar conta</h1>
          <p className="auth-lead">
            Estudantes compram cursos ou escolhem um plano. Empresas com contrato MotStart escolhem perfil de colaborador
            ou gestor; empresas avulsas usam a terceira opção.
          </p>

          <div className="account-type" role="tablist" aria-label="Tipo de cadastro">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'student'}
              className={`account-type__btn ${role === 'student' ? 'account-type__btn--active' : ''}`}
              onClick={() => setRole('student')}
            >
              Particular
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
              <label className="auth-field">
                <span>Razão social / Nome da empresa</span>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex.: MotStart Tecnologia Ltda"
                  required
                />
              </label>
            ) : null}
            <label className="auth-field">
              <span>{role === 'enterprise' ? 'Responsável' : 'Nome completo'}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
            </label>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
              />
            </label>
            {role === 'enterprise' ? (
              <fieldset className="auth-enterprise-choice">
                <legend>Perfil no contrato MotStart (empresa parceira)</legend>
                <div className="auth-enterprise-choice__options">
                  <label>
                    <input
                      type="radio"
                      name="reg-enterprise-plan"
                      checked={enterprisePlan === 'contract_employee'}
                      onChange={() => setEnterprisePlan('contract_employee')}
                    />
                    <span>
                      <strong>Colaborador (funcionário)</strong>{' '}
                      <span className="auth-enterprise-choice__hint">
                        (vinculado à empresa com contrato MotStart — sem acesso à vitrine de vagas e sem banco de talentos)
                      </span>
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="reg-enterprise-plan"
                      checked={enterprisePlan === 'contract_manager'}
                      onChange={() => setEnterprisePlan('contract_manager')}
                    />
                    <span>
                      <strong>Gestor</strong>{' '}
                      <span className="auth-enterprise-choice__hint">
                        (acesso à vitrine de vagas, busca de talentos e publicação de vagas)
                      </span>
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="reg-enterprise-plan"
                      checked={enterprisePlan === 'standard'}
                      onChange={() => setEnterprisePlan('standard')}
                    />
                    <span>
                      Conta empresarial na plataforma{' '}
                      <span className="auth-enterprise-choice__hint">
                        (sem contrato B2B específico — talentos e vagas como empresa avulsa)
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>
            ) : null}
            <button type="submit" className="btn btn-primary btn-block auth-submit">
              Cadastrar
            </button>
          </form>

          <p className="auth-foot">
            Conta empresarial <strong>sem</strong> contrato B2B: use a terceira opção ou abra o cadastro com{' '}
            <Link to="/cadastro?tipo=empresa&plano=avulsa">?plano=avulsa</Link>. Ao cadastrar, você concorda com os termos
            (demonstração). <Link to="/login">Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
