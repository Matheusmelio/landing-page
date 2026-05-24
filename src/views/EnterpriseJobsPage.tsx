'use client'

import { useEffect, useState } from 'react'
import { ClientRedirect } from '@/components/ClientRedirect'
import { useAuth } from '../auth/AuthContext'
import { SecondaryHeader } from '../components/SecondaryHeader'
import { loadJobs, publishJob } from '@/lib/jobsStorage'
import type { PublishedJob } from '@/types/jobs'

export function EnterpriseJobsPage() {
  const { user, canEnterpriseRecruit } = useAuth()
  const [jobs, setJobs] = useState<PublishedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [stack, setStack] = useState('')
  const [modality, setModality] = useState('Remoto')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      try {
        const all = await loadJobs()
        if (cancelled) return
        const email = user?.email?.toLowerCase()
        setJobs(email ? all.filter((j) => j.authorEmail?.toLowerCase() === email) : all)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar vagas')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.email])

  if (!canEnterpriseRecruit) {
    return <ClientRedirect href="/perfil" />
  }

  const publish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !user?.email) return
    setError(null)
    try {
      const job = await publishJob({
        title: title.trim(),
        stack: stack.trim() || 'A definir',
        modality,
        authorEmail: user.email,
      })
      setJobs((j) => [job, ...j])
      setTitle('')
      setStack('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível publicar')
    }
  }

  return (
    <div className="page">
      <SecondaryHeader variant="voltar-perfil" />

      <div className="container section-wrap section-wrap--top">
        <header className="enterprise-head">
          <h1 className="page-title">Publicar vagas</h1>
          <p className="page-lead">
            Candidatos com perfil de estudante na MotStart podem encontrar sua vaga aqui além de estudar na plataforma.
          </p>
        </header>

        <div className="enterprise-grid">
          <form className="auth-card job-form" onSubmit={publish}>
            <h2 className="job-form__title">Nova vaga</h2>
            <label className="auth-field">
              <span>Cargo</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Dev Full Stack Jr" required />
            </label>
            <label className="auth-field">
              <span>Stack / requisitos principais</span>
              <input value={stack} onChange={(e) => setStack(e.target.value)} placeholder="React, Node, SQL" />
            </label>
            <label className="auth-field">
              <span>Modalidade</span>
              <select value={modality} onChange={(e) => setModality(e.target.value)}>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </label>
            {error ? <p className="checkout-error">{error}</p> : null}
            <button type="submit" className="btn btn-primary btn-block">
              Publicar vaga
            </button>
          </form>

          <section className="job-list-section">
            <h2 className="job-list-section__title">Suas vagas ({jobs.length})</h2>
            {loading ? (
              <p className="page-lead">Carregando…</p>
            ) : jobs.length === 0 ? (
              <p className="page-lead">Nenhuma vaga ainda. Preencha o formulário ao lado.</p>
            ) : (
              <ul className="job-list">
                {jobs.map((j) => (
                  <li key={j.id} className="job-list__item">
                    <h3>{j.title}</h3>
                    <p>
                      {j.stack} · {j.modality}
                    </p>
                    <time dateTime={j.createdAt}>
                      {new Date(j.createdAt).toLocaleDateString('pt-BR')}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
