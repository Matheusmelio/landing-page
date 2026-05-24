import { Router } from 'express'
import { assertSupabase, supabase } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const VALID_STATUS = new Set(['em-andamento', 'disponivel', 'concluido'])

export const progressRouter = Router()

progressRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()
    const email = String(req.query.email ?? '')
      .trim()
      .toLowerCase()

    if (!email.includes('@')) {
      const err = new Error('Query email é obrigatório')
      err.status = 400
      throw err
    }

    const { data, error } = await supabase.from('course_progress').select('course_id, status').eq('user_email', email)

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    const progress = {}
    for (const row of data ?? []) {
      progress[row.course_id] = row.status
    }

    res.json({ ok: true, progress })
  }),
)

progressRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

    const { email, courseId, status, progress: bulk } = req.body ?? {}
    const userEmail = email?.trim().toLowerCase()

    if (!userEmail?.includes('@')) {
      const err = new Error('email é obrigatório')
      err.status = 400
      throw err
    }

    if (bulk && typeof bulk === 'object') {
      const rows = Object.entries(bulk)
        .filter(([, v]) => VALID_STATUS.has(v))
        .map(([course_id, s]) => ({
          user_email: userEmail,
          course_id,
          status: s,
          updated_at: new Date().toISOString(),
        }))

      if (rows.length === 0) {
        res.json({ ok: true, updated: 0 })
        return
      }

      const { error } = await supabase.from('course_progress').upsert(rows, {
        onConflict: 'user_email,course_id',
      })

      if (error) {
        const err = new Error(error.message)
        err.status = 500
        throw err
      }

      res.json({ ok: true, updated: rows.length })
      return
    }

    if (!courseId || !VALID_STATUS.has(status)) {
      const err = new Error('courseId e status válidos são obrigatórios')
      err.status = 400
      throw err
    }

    const { error } = await supabase.from('course_progress').upsert(
      {
        user_email: userEmail,
        course_id: courseId,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_email,course_id' },
    )

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.json({ ok: true, courseId, status })
  }),
)
