import { Router } from 'express'
import { assertSupabase, supabase } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const VALID_ROLES = new Set(['student', 'enterprise'])

export const profilesRouter = Router()

profilesRouter.get(
  '/:email',
  asyncHandler(async (req, res) => {
    assertSupabase()
    const email = req.params.email.trim().toLowerCase()

    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle()

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    if (!data) {
      res.status(404).json({ ok: false, error: 'Perfil não encontrado' })
      return
    }

    res.json({ ok: true, profile: mapProfile(data) })
  }),
)

profilesRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

    const { email, name, role, companyName, enterprisePlan, activePlanId } = req.body ?? {}

    if (!email?.includes('@')) {
      const err = new Error('E-mail inválido')
      err.status = 400
      throw err
    }
    if (role && !VALID_ROLES.has(role)) {
      const err = new Error('role inválido')
      err.status = 400
      throw err
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle()

    const row = {
      email: normalizedEmail,
      name: name?.trim() ?? existing?.name ?? normalizedEmail.split('@')[0],
      role: role ?? existing?.role ?? 'student',
      company_name: companyName !== undefined ? (companyName ?? null) : (existing?.company_name ?? null),
      enterprise_plan:
        enterprisePlan !== undefined ? (enterprisePlan ?? null) : (existing?.enterprise_plan ?? null),
      active_plan_id:
        activePlanId !== undefined ? (activePlanId ?? null) : (existing?.active_plan_id ?? null),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('profiles').upsert(row, { onConflict: 'email' }).select().single()

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.json({ ok: true, profile: mapProfile(data) })
  }),
)

function mapProfile(row) {
  return {
    email: row.email,
    name: row.name,
    role: row.role,
    companyName: row.company_name,
    enterprisePlan: row.enterprise_plan,
    activePlanId: row.active_plan_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
