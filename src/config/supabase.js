import { createClient } from '@supabase/supabase-js'

let _client = null

function getConfig() {
  const url = process.env.SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  return { url, serviceKey }
}

/** Cliente com service role — só no servidor Express, nunca no browser. */
export function getSupabase() {
  const { url, serviceKey } = getConfig()
  if (!url || !serviceKey) return null
  if (!_client) {
    _client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _client
}

/** @deprecated use getSupabase() — mantido para rotas existentes */
export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getSupabase()
      if (!client) return undefined
      const value = client[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  },
)

export function assertSupabase() {
  const client = getSupabase()
  if (!client) {
    const err = new Error(
      'Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env',
    )
    err.status = 503
    throw err
  }
  return client
}
