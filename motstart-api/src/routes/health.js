import { Router } from 'express'
import { isSupabaseConfigured, missingSupabaseEnv, supabase } from '../config/supabase.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  if (!isSupabaseConfigured()) {
    res.status(500).json({
      ok: false,
      service: 'motstart-api',
      storage: 'supabase',
      database: 'not_configured',
      missingEnv: missingSupabaseEnv,
      timestamp: new Date().toISOString(),
    })
    return
  }

  const { error } = await supabase.from('profiles').select('email', { count: 'exact', head: true })

  res.json({
    ok: !error,
    service: 'motstart-api',
    storage: 'supabase',
    database: error ? 'error' : 'connected',
    timestamp: new Date().toISOString(),
  })
})

healthRouter.get('/storage', async (_req, res) => {
  if (!isSupabaseConfigured()) {
    res.status(500).json({
      ok: false,
      storage: 'supabase',
      database: 'not_configured',
      missingEnv: missingSupabaseEnv,
    })
    return
  }

  const { error } = await supabase.from('profiles').select('email', { count: 'exact', head: true })
  res.json({ ok: !error, storage: 'supabase', database: error ? 'error' : 'connected' })
})
