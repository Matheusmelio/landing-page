import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase não configurado. Defina SUPABASE_URL e uma chave da API no .env.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export function throwSupabaseError(error, fallbackMessage = 'Erro ao acessar o banco de dados.') {
  if (!error) return

  const err = new Error(error.message || fallbackMessage)
  err.status = 500
  err.details = error
  throw err
}
