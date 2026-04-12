import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import type { PublishedJob } from './EnterpriseJobsPage'

const JOBS_KEY = 'motstart_jobs_v1'

export function JobsBrowsePage() {
  const { isContractEnterprise } = useAuth()
  const [jobs, setJobs] = useState<PublishedJob[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOBS_KEY)
      setJobs(raw ? (JSON.parse(raw) as PublishedJob[]) : [])
    } catch {
      setJobs([])
    }
  }, [])

  if (isContractEnterprise) {
    return (
      <div className="page">
        <MainHeader />
        <div className="container section-wrap section-wrap--top">
          <div className="contract-block">
            <h1 className="page-title">Vitrine de vagas indisponível</h1>
            <p className="page-lead contract-block__text">
              Contas empresariais em <strong>contrato B2B MotStart</strong> não acessam a vitrine pública de vagas de
              outras empresas. O acordo prevê escopo próprio de capacitação e regras de visibilidade distintas.
            </p>
            <p className="contract-block__text">
              Para oportunidades internas da sua organização, use a área de publicação autorizada no perfil ou fale com a
              assistência.
            </p>
            <div className="contract-block__actions">
              <Link to="/perfil" className="btn btn-primary">
                Ir ao perfil
              </Link>
              <Link to="/empresa/assessoria" className="btn btn-ghost">
                Assistência MotStart
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
        <h1 className="page-title">Vagas na MotStart</h1>
        <p className="page-lead">
          Empresas parceiras publicam oportunidades aqui. Você pode estudar na plataforma e candidatar-se às vagas
          alinhadas ao seu perfil.
        </p>

        {jobs.length === 0 ? (
          <p className="page-lead">
            Ainda não há vagas publicadas.{' '}
            <Link to="/cadastro?tipo=empresa" className="link-purple">
              Conta empresarial
            </Link>{' '}
            pode anunciar posições.
          </p>
        ) : (
          <ul className="job-list job-list--public">
            {jobs.map((j) => (
              <li key={j.id} className="job-list__item">
                <h2>{j.title}</h2>
                <p>
                  {j.stack} · {j.modality}
                </p>
                <time dateTime={j.createdAt}>{new Date(j.createdAt).toLocaleDateString('pt-BR')}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
