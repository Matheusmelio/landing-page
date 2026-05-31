import { Router } from 'express'
import { supabase, throwSupabaseError } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { makeId, normalizeEmail, nowIso } from '../utils/normalizers.js'

export const jobsRouter = Router()

jobsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    throwSupabaseError(error)

    res.json({
      ok: true,
      jobs: (data ?? []).map(mapJob),
    })
  }),
)

jobsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, stack, modality, authorEmail } = req.body ?? {}

    if (!title?.trim() || !authorEmail?.includes('@')) {
      const err = new Error('title e authorEmail são obrigatórios')
      err.status = 400
      throw err
    }

    const job = {
      id: makeId('JOB'),
      title: title.trim(),
      stack: stack?.trim() || '—',
      modality: modality?.trim() || 'Remoto',
      author_email: normalizeEmail(authorEmail),
      created_at: nowIso(),
    }

    const { data, error } = await supabase.from('jobs').insert(job).select().single()
    throwSupabaseError(error)

    res.status(201).json({
      ok: true,
      job: mapJob(data),
    })
  }),
)

jobsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { error } = await supabase.from('jobs').delete().eq('id', req.params.id)
    throwSupabaseError(error)

    res.json({ ok: true })
  }),
)

function mapJob(row) {
  return {
    id: row.id,
    title: row.title,
    stack: row.stack,
    modality: row.modality,
    authorEmail: row.author_email,
    createdAt: row.created_at,
  }
}
