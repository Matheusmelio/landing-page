import { Router } from 'express'
import { supabase, throwSupabaseError } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { normalizeEmail, nowIso } from '../utils/normalizers.js'

const VALID_STATUS = new Set(['em-andamento', 'disponivel', 'concluido'])

export const progressRouter = Router()

progressRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const email = String(req.query.email ?? '')
      .trim()
      .toLowerCase()

    if (!email.includes('@')) {
      const err = new Error('Query email é obrigatório')
      err.status = 400
      throw err
    }

    const { data, error } = await supabase
      .from('course_progress')
      .select('course_id,status')
      .eq('email', email)
    throwSupabaseError(error)

    const progress = Object.fromEntries((data ?? []).map((row) => [row.course_id, row.status]))

    res.json({ ok: true, progress })
  }),
)

progressRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    const { email, courseId, status, progress: bulk } = req.body ?? {}
    const userEmail = normalizeEmail(email)

    if (!userEmail?.includes('@')) {
      const err = new Error('email é obrigatório')
      err.status = 400
      throw err
    }

    if (bulk && typeof bulk === 'object') {
      const entries = Object.entries(bulk)
        .filter(([, v]) => VALID_STATUS.has(v))
        .map(([courseId, s]) => ({
          email: userEmail,
          course_id: courseId,
          status: s,
          updated_at: nowIso(),
        }))

      if (entries.length === 0) {
        res.json({ ok: true, updated: 0 })
        return
      }

      const { error } = await supabase.from('course_progress').upsert(entries, {
        onConflict: 'email,course_id',
      })
      throwSupabaseError(error)

      res.json({ ok: true, updated: entries.length })
      return
    }

    if (!courseId || !VALID_STATUS.has(status)) {
      const err = new Error('courseId e status válidos são obrigatórios')
      err.status = 400
      throw err
    }

    const { error } = await supabase.from('course_progress').upsert({
      email: userEmail,
      course_id: courseId,
      status,
      updated_at: nowIso(),
    }, { onConflict: 'email,course_id' })
    throwSupabaseError(error)

    res.json({ ok: true, courseId, status })
  }),
)
