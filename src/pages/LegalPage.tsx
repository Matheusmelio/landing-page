import { Link } from 'react-router-dom'
import { MainHeader } from '../components/MainHeader'

export function LegalPage() {
  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top legal-page">
        <h1 className="page-title">Termos de uso e privacidade</h1>
        <p className="page-lead legal-page__updated">Última atualização: documento ilustrativo para demonstração do produto MotStart.</p>

        <div className="legal-page__content">
          <section>
            <h2>1. Natureza do serviço</h2>
            <p>
              A plataforma MotStart (ambiente de demonstração) oferece experiência de cursos, planos de assinatura,
              áreas para estudantes e empresas, e fluxos simulados de pagamento. Não há cobrança real nem contrato
              juridicamente vinculante nesta versão.
            </p>
          </section>
          <section>
            <h2>2. Contas e perfis</h2>
            <p>
              Contas <strong>particulares</strong> e <strong>empresariais</strong> possuem regras distintas. Empresas em{' '}
              <strong>contrato B2B</strong> podem ter restrições de vitrine de vagas e visibilidade em busca de talentos,
              conforme configurado no produto.
            </p>
          </section>
          <section>
            <h2>3. Dados pessoais</h2>
            <p>
              Nesta demonstração, dados são armazenados localmente no seu navegador (por exemplo, sessão de login
              simulada). Não há envio a servidores MotStart em produção a partir deste protótipo.
            </p>
          </section>
          <section>
            <h2>4. Pagamentos</h2>
            <p>
              O checkout é apenas simulado. Não insira dados reais de cartão em ambientes de teste sem certificação
              adequada (PCI DSS) em produção.
            </p>
          </section>
        </div>

        <p className="legal-page__back">
          <Link to="/" className="link-purple">
            ← Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}
