'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth/AuthContext'
import { MainHeader } from '../components/MainHeader'
import { loadJobs } from '@/lib/jobsStorage'
import type { PublishedJob } from '@/types/jobs'

export function JobsBrowsePage() {
  const { isContractEnterprise } = useAuth()
  const [jobs, setJobs] = useState<PublishedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const list = await loadJobs()
        if (!cancelled) setJobs(list)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
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
              Perfis de <strong>colaborador</strong> (contrato MotStart) e contas em{' '}
              <strong>contrato corporativo legado</strong> não acessam a vitrine pública de vagas de outras empresas.
              Gestores com contrato MotStart utilizam o acesso completo conforme o perfil escolhido no login.
            </p>
            <p className="page-lead contract-block__text">
              Para oportunidades internas da sua organização, use a área de publicação autorizada no perfil ou fale com a
              assistência.
            </p>
            <div className="contract-block__actions">
              <Link href="/perfil" className="btn btn-primary">
                Ir ao perfil
              </Link>
              <Link href="/empresa/assessoria" className="btn btn-ghost">
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

        {loading ? (
          <p className="page-lead">Carregando vagas…</p>
        ) : jobs.length === 0 ? (
          <p className="page-lead">
            Ainda não há vagas publicadas.{' '}
            <Link href="/cadastro?tipo=empresa" className="link-purple">
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
