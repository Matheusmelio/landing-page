import { Router } from 'express'
import { supabase, throwSupabaseError } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { makeOrderId } from '../utils/orderId.js'
import { normalizeEmail, nowIso } from '../utils/normalizers.js'

const VALID_PLANS = new Set(['basico', 'completo', 'premium'])

export const checkoutRouter = Router()

checkoutRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { planId, payerName, payerEmail, cardLast4, userEmail } = req.body ?? {}

    if (!VALID_PLANS.has(planId)) {
      const err = new Error('planId inválido')
      err.status = 400
      throw err
    }
    if (!payerEmail?.includes('@')) {
      const err = new Error('E-mail inválido')
      err.status = 400
      throw err
    }

    const email = normalizeEmail(userEmail || payerEmail)
    const orderId = makeOrderId('MS')

    const { error: orderError } = await supabase.from('plan_orders').insert({
      order_id: orderId,
      plan_id: planId,
      payer_name: payerName?.trim() || 'Cliente',
      payer_email: normalizeEmail(payerEmail),
      card_last4: String(cardLast4 ?? '').replace(/\D/g, '').slice(-4) || null,
      user_email: email,
      created_at: nowIso(),
    })
    throwSupabaseError(orderError)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle()
    throwSupabaseError(profileError)

    if (profile) {
      const { error } = await supabase
        .from('profiles')
        .update({ active_plan_id: planId, updated_at: nowIso() })
        .eq('email', email)
      throwSupabaseError(error)
    } else {
      const { error } = await supabase.from('profiles').insert({
        email,
        name: payerName?.trim() || email.split('@')[0],
        role: 'student',
        company_name: null,
        enterprise_plan: null,
        active_plan_id: planId,
        created_at: nowIso(),
        updated_at: nowIso(),
      })
      throwSupabaseError(error)
    }

    res.status(201).json({
      ok: true,
      orderId,
      message: `Assinatura ${planId} registrada.`,
    })
  }),
)
