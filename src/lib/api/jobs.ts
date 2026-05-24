import type { PublishedJob } from '@/types/jobs'
import { apiFetch, isApiEnabled } from '@/lib/api/http'

type JobsResponse = { ok: true; jobs: PublishedJob[] }
type JobResponse = { ok: true; job: PublishedJob }

export async function listJobsFromApi(): Promise<PublishedJob[]> {
  if (!isApiEnabled()) return []

  const res = await apiFetch<JobsResponse>('/api/jobs')
  return res.jobs ?? []
}

export async function createJobOnApi(payload: {
  title: string
  stack: string
  modality: string
  authorEmail: string
}): Promise<PublishedJob> {
  const res = await apiFetch<JobResponse>('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.job
}
