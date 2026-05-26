import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { Router } from 'express'
import { supabase, throwSupabaseError } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { normalizeEmail, normalizeName, normalizeNullableText, nowIso } from '../utils/normalizers.js'

const VALID_ROLES = new Set(['student', 'enterprise'])
const DUPLICATE_MESSAGE =
  'Já existe cadastro com esse nome, e-mail ou senha. Altere as informações e tente novamente.'

export const profilesRouter = Router()

profilesRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, name, password, role, companyName, enterprisePlan } = req.body ?? {}
    const normalizedEmail = normalizeEmail(email)
    const normalizedName = normalizeName(name)

    validateProfileInput({ email: normalizedEmail, name: normalizedName, password, role })

    const passwordFingerprint = fingerprintPassword(password)
    await assertUniqueRegistration({ email: normalizedEmail, name: normalizedName, passwordFingerprint })

    const row = {
      email: normalizedEmail,
      name: normalizedName,
      role,
      company_name: role === 'enterprise' ? normalizeNullableText(companyName) : null,
      enterprise_plan: role === 'enterprise' ? (enterprisePlan ?? null) : null,
      password_hash: hashPassword(password),
      password_fingerprint: passwordFingerprint,
      created_at: nowIso(),
      updated_at: nowIso(),
    }

    const { data, error } = await supabase.from('profiles').insert(row).select().single()
    if (isUniqueViolation(error)) throwDuplicateRegistration()
    throwSupabaseError(error)

    res.status(201).json({ ok: true, profile: mapProfile(data) })
  }),
)

profilesRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {}
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || typeof password !== 'string') {
      const err = new Error('Informe e-mail e senha para entrar.')
      err.status = 400
      throw err
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle()
    throwSupabaseError(error)

    if (!data?.password_hash || !verifyPassword(password, data.password_hash)) {
      const err = new Error('E-mail ou senha inválidos.')
      err.status = 401
      throw err
    }

    res.json({ ok: true, profile: mapProfile(data) })
  }),
)

profilesRouter.get(
  '/:email',
  asyncHandler(async (req, res) => {
    const email = req.params.email.trim().toLowerCase()

    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle()
    throwSupabaseError(error)

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

    const { data: existing, error: existingError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle()
    throwSupabaseError(existingError)

    const row = {
      email: normalizedEmail,
      name: name?.trim() ?? existing?.name ?? normalizedEmail.split('@')[0],
      role: role ?? existing?.role ?? 'student',
      company_name: companyName !== undefined ? (companyName ?? null) : (existing?.company_name ?? null),
      enterprise_plan:
        enterprisePlan !== undefined ? (enterprisePlan ?? null) : (existing?.enterprise_plan ?? null),
      active_plan_id:
        activePlanId !== undefined ? (activePlanId ?? null) : (existing?.active_plan_id ?? null),
      password_hash: existing?.password_hash,
      password_fingerprint: existing?.password_fingerprint,
      created_at: existing?.created_at ?? nowIso(),
      updated_at: nowIso(),
    }

    const { data, error } = await supabase.from('profiles').upsert(row, { onConflict: 'email' }).select().single()
    throwSupabaseError(error)

    res.json({ ok: true, profile: mapProfile(data) })
  }),
)

function validateProfileInput({ email, name, password, role }) {
  if (!email?.includes('@')) {
    const err = new Error('E-mail inválido.')
    err.status = 400
    throw err
  }
  if (!name) {
    const err = new Error('Informe o nome para cadastrar.')
    err.status = 400
    throw err
  }
  if (typeof password !== 'string' || password.length < 8) {
    const err = new Error('A senha precisa ter pelo menos 8 caracteres.')
    err.status = 400
    throw err
  }
  if (!VALID_ROLES.has(role)) {
    const err = new Error('Tipo de cadastro inválido.')
    err.status = 400
    throw err
  }
}

async function assertUniqueRegistration({ email, name, passwordFingerprint }) {
  const { data, error } = await supabase
    .from('profiles')
    .select('email,name,password_fingerprint')
    .or(`email.eq.${email},password_fingerprint.eq.${passwordFingerprint}`)
  throwSupabaseError(error)

  const duplicate =
    data?.some(
      (profile) =>
        profile.email === email ||
        normalizeName(profile.name).toLowerCase() === name.toLowerCase() ||
        profile.password_fingerprint === passwordFingerprint,
    ) ?? false

  if (duplicate) {
    throwDuplicateRegistration()
  }
}

function throwDuplicateRegistration() {
  const err = new Error(DUPLICATE_MESSAGE)
  err.status = 409
  throw err
}

function isUniqueViolation(error) {
  return error?.code === '23505'
}

function passwordSecret() {
  return process.env.PASSWORD_PEPPER || 'motstart-dev-secret'
}

function fingerprintPassword(password) {
  return createHmac('sha256', passwordSecret()).update(password).digest('hex')
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

function verifyPassword(password, stored) {
  const [, salt, storedHash] = stored.split(':')
  if (!salt || !storedHash) return false
  const candidate = scryptSync(password, salt, 64)
  const expected = Buffer.from(storedHash, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

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
