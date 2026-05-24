import { Router } from 'express'
import { assertSupabase, supabase } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { makeOrderId } from '../utils/orderId.js'

const VALID_PLANS = new Set(['basico', 'completo', 'premium'])

export const checkoutRouter = Router()

checkoutRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

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

    const email = (userEmail || payerEmail).trim().toLowerCase()
    const orderId = makeOrderId('MS')

    const { error: orderError } = await supabase.from('plan_orders').insert({
      order_id: orderId,
      plan_id: planId,
      payer_name: payerName?.trim() || 'Cliente',
      payer_email: payerEmail.trim().toLowerCase(),
      card_last4: String(cardLast4 ?? '').replace(/\D/g, '').slice(-4) || null,
      user_email: email,
    })

    if (orderError) {
      const err = new Error(orderError.message)
      err.status = 500
      err.details = orderError
      throw err
    }

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        email,
        name: payerName?.trim() || email.split('@')[0],
        active_plan_id: planId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' },
    )

    if (profileError) {
      const err = new Error(profileError.message)
      err.status = 500
      err.details = profileError
      throw err
    }

    res.status(201).json({
      ok: true,
      orderId,
      message: `Assinatura ${planId} registrada.`,
    })
  }),
)
