import { Router } from 'express'
import { assertSupabase, getSupabase } from '../config/supabase.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  let database = 'not_configured'

  const sb = getSupabase()
  if (sb) {
    try {
      const { error } = await sb.from('profiles').select('id').limit(1)
      database = error ? 'error' : 'ok'
    } catch {
      database = 'error'
    }
  }

  res.json({
    ok: true,
    service: 'motstart-api',
    database,
    timestamp: new Date().toISOString(),
  })
})

healthRouter.get('/db', async (_req, res, next) => {
  try {
    const sb = assertSupabase()
    const { error } = await sb.from('profiles').select('id').limit(1)
    if (error) {
      const err = new Error(error.message)
      err.status = 503
      err.details = error
      throw err
    }
    res.json({ ok: true, database: 'ok' })
  } catch (e) {
    next(e)
  }
})
