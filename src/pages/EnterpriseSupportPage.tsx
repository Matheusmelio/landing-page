import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SecondaryHeader } from '../components/SecondaryHeader'

export function EnterpriseSupportPage() {
  const [sent, setSent] = useState(false)
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page">
      <SecondaryHeader variant="voltar-perfil" />

      <div className="container section-wrap section-wrap--top">
        <header className="enterprise-head">
          <h1 className="page-title">Assessoria e contratos</h1>
          <p className="page-lead">
            Sua empresa pode <strong>profissionalizar a equipe</strong> com trilhas MotStart sob contrato. Por ser um
            acordo personalizado (volume, trilhas, SLA), é necessário <strong>contato com a assistência</strong> para
            análise e formalização.
          </p>
        </header>

        <div className="support-layout">
          <div className="support-info auth-card">
            <h2 className="support-info__title">Como funciona</h2>
            <ol className="support-info__steps">
              <li>Você envia necessidade e tamanho do time.</li>
              <li>Nossa equipe retorna com proposta e escopo de trilhas.</li>
              <li>Após alinhamento, emitimos o contrato e liberamos o acesso.</li>
            </ol>
            <p className="support-info__note">
              Este fluxo é independente da compra avulsa de cursos ou dos planos individuais para estudantes.
            </p>
            <Link to="/planos" className="link-purple">
              Ver planos para estudantes →
            </Link>
          </div>

          <form className="auth-card support-form" onSubmit={submit}>
            <h2 className="support-form__title">Falar com a assistência</h2>
            {sent ? (
              <p className="support-form__success">
                Recebemos seu pedido. Em um ambiente real, enviaríamos para o time comercial — aqui é apenas demonstração.
              </p>
            ) : (
              <>
                <label className="auth-field">
                  <span>Empresa</span>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} required />
                </label>
                <label className="auth-field">
                  <span>E-mail corporativo</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="auth-field">
                  <span>Telefone / WhatsApp</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
                <label className="auth-field">
                  <span>Mensagem</span>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tamanho da equipe, tecnologias, prazo desejado..."
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary btn-block">
                  Solicitar análise
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
