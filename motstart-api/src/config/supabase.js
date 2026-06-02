import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY

export const missingSupabaseEnv = [
  !supabaseUrl ? 'SUPABASE_URL' : null,
  !supabaseKey ? 'SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY' : null,
].filter(Boolean)

export function isSupabaseConfigured() {
  return missingSupabaseEnv.length === 0
}

function makeMissingConfigError() {
  const err = new Error(`Supabase não configurado. Variáveis ausentes: ${missingSupabaseEnv.join(', ')}.`)
  err.status = 500
  err.code = 'SUPABASE_CONFIG_MISSING'
  return err
}

const configuredClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export const supabase =
  configuredClient ??
  new Proxy(
    {},
    {
      get() {
        throw makeMissingConfigError()
      },
    },
  )

export function throwSupabaseError(error, fallbackMessage = 'Erro ao acessar o banco de dados.') {
  if (!error) return

  const err = new Error(error.message || fallbackMessage)
  err.status = 500
  err.details = error
  throw err
}
