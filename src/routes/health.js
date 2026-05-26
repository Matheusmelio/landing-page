import { Router } from 'express'
import { supabase } from '../config/supabase.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
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
  const { error } = await supabase.from('profiles').select('email', { count: 'exact', head: true })
  res.json({ ok: !error, storage: 'supabase', database: error ? 'error' : 'connected' })
})
