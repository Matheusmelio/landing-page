import { useEffect, useState } from 'react'
import { SecondaryHeader } from '../components/SecondaryHeader'

const JOBS_KEY = 'motstart_jobs_v1'

export type PublishedJob = {
  id: string
  title: string
  stack: string
  modality: string
  createdAt: string
}

function loadJobs(): PublishedJob[] {
  try {
    const raw = localStorage.getItem(JOBS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PublishedJob[]
  } catch {
    return []
  }
}

function saveJobs(jobs: PublishedJob[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
}

export function EnterpriseJobsPage() {
  const [jobs, setJobs] = useState<PublishedJob[]>(() => loadJobs())
  const [title, setTitle] = useState('')
  const [stack, setStack] = useState('')
  const [modality, setModality] = useState('Remoto')

  useEffect(() => {
    saveJobs(jobs)
  }, [jobs])

  const publish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const next: PublishedJob = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `job-${Date.now()}`,
      title: title.trim(),
      stack: stack.trim() || 'A definir',
      modality,
      createdAt: new Date().toISOString(),
    }
    setJobs((j) => [next, ...j])
    setTitle('')
    setStack('')
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
            <button type="submit" className="btn btn-primary btn-block">
              Publicar vaga
            </button>
          </form>

          <section className="job-list-section">
            <h2 className="job-list-section__title">Suas vagas ({jobs.length})</h2>
            {jobs.length === 0 ? (
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
