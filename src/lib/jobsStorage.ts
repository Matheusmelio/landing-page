import { createJobOnApi, listJobsFromApi } from '@/lib/api/jobs'
import { isApiEnabled } from '@/lib/api/http'
import type { PublishedJob } from '@/types/jobs'

const JOBS_KEY = 'motstart_jobs_v1'

function readLocalJobs(): PublishedJob[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(JOBS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PublishedJob[]
  } catch {
    return []
  }
}

function writeLocalJobs(jobs: PublishedJob[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
}

export async function loadJobs(): Promise<PublishedJob[]> {
  if (isApiEnabled()) {
    try {
      const jobs = await listJobsFromApi()
      writeLocalJobs(jobs)
      return jobs
    } catch (err) {
      console.warn('[motstart] loadJobs API', err)
    }
  }
  return readLocalJobs()
}

export async function publishJob(payload: {
  title: string
  stack: string
  modality: string
  authorEmail: string
}): Promise<PublishedJob> {
  if (isApiEnabled()) {
    const job = await createJobOnApi(payload)
    const all = await loadJobs()
    writeLocalJobs(all)
    return job
  }

  const job: PublishedJob = {
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `job-${Date.now()}`,
    title: payload.title,
    stack: payload.stack,
    modality: payload.modality,
    createdAt: new Date().toISOString(),
    authorEmail: payload.authorEmail,
  }
  const next = [job, ...readLocalJobs()]
  writeLocalJobs(next)
  return job
}
