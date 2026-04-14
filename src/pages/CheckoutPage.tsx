import { useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { processCheckoutMock } from '../api/mockClient'
import { useAuth } from '../auth/AuthContext'
import { getPlanById } from '../data/plans'
import { MainHeader } from '../components/MainHeader'
import { setActivePlanId } from '../lib/userCourseProgress'

export function CheckoutPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [params] = useSearchParams()
  const planIdParam = params.get('plan')
  const plan = getPlanById(planIdParam)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cardLast4, setCardLast4] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ orderId: string } | null>(null)

  if (!plan) {
    return <Navigate to="/planos" replace />
  }

  if (!user) {
    const from = `${location.pathname}${location.search}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await processCheckoutMock({
        planId: plan.id,
        payerName: name.trim() || 'Cliente',
        payerEmail: email.trim(),
        cardLast4: cardLast4.replace(/\D/g, '').slice(-4) || '0000',
      })
      setActivePlanId(plan.id)
      setSuccess({ orderId: res.orderId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page">
        <MainHeader />
        <div className="container section-wrap section-wrap--top">
          <div className="checkout-success">
            <h1 className="page-title">Pagamento confirmado (demo)</h1>
            <p className="page-lead">
              Pedido <strong>{success.orderId}</strong>. Em produção, o gateway confirmaria a assinatura e liberaria os
              cursos automaticamente.
            </p>
            <div className="checkout-success__actions">
              <Link to="/cursos" className="btn btn-primary">
                Ir para meus cursos
              </Link>
              <Link to="/perfil" className="btn btn-ghost">
                Meu perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top">
        <div className="checkout-layout">
          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Resumo</h2>
            <p className="checkout-summary__plan">{plan.name}</p>
            <p className="checkout-summary__price">{plan.price}</p>
            <ul className="checkout-summary__list">
              {plan.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link to="/planos" className="link-purple">
              ← Outro plano
            </Link>
          </aside>

          <form className="auth-card checkout-form" onSubmit={submit}>
            <h1 className="auth-title">Finalizar assinatura</h1>
            <p className="auth-lead">
              Ambiente de demonstração: nenhum valor real é cobrado. Dados do cartão não são armazenados.
            </p>

            <label className="auth-field">
              <span>Nome completo</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
            <label className="auth-field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="auth-field">
              <span>Últimos 4 dígitos do cartão (demo)</span>
              <input
                inputMode="numeric"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="4242"
              />
            </label>

            {error ? <p className="checkout-error">{error}</p> : null}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Processando…' : 'Confirmar pagamento (demo)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
