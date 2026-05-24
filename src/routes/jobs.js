import { Router } from 'express'
import { assertSupabase, supabase } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const jobsRouter = Router()

jobsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    assertSupabase()

    const { data, error } = await supabase
      .from('published_jobs')
      .select('id, title, stack, modality, author_email, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.json({
      ok: true,
      jobs: (data ?? []).map((j) => ({
        id: j.id,
        title: j.title,
        stack: j.stack,
        modality: j.modality,
        authorEmail: j.author_email,
        createdAt: j.created_at,
      })),
    })
  }),
)

jobsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

    const { title, stack, modality, authorEmail } = req.body ?? {}

    if (!title?.trim() || !authorEmail?.includes('@')) {
      const err = new Error('title e authorEmail são obrigatórios')
      err.status = 400
      throw err
    }

    const { data, error } = await supabase
      .from('published_jobs')
      .insert({
        title: title.trim(),
        stack: stack?.trim() || '—',
        modality: modality?.trim() || 'Remoto',
        author_email: authorEmail.trim().toLowerCase(),
      })
      .select()
      .single()

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.status(201).json({
      ok: true,
      job: {
        id: data.id,
        title: data.title,
        stack: data.stack,
        modality: data.modality,
        createdAt: data.created_at,
      },
    })
  }),
)

jobsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    assertSupabase()

    const { error } = await supabase.from('published_jobs').delete().eq('id', req.params.id)

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.json({ ok: true })
  }),
)
