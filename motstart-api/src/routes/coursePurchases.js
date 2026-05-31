import { Router } from 'express'
import { supabase, throwSupabaseError } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { makeOrderId } from '../utils/orderId.js'
import { normalizeEmail, nowIso } from '../utils/normalizers.js'

export const coursePurchasesRouter = Router()

coursePurchasesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { courseId, payerName, payerEmail, cardLast4 } = req.body ?? {}

    if (!courseId?.trim()) {
      const err = new Error('courseId é obrigatório')
      err.status = 400
      throw err
    }
    if (!payerEmail?.includes('@')) {
      const err = new Error('E-mail inválido')
      err.status = 400
      throw err
    }

    const email = normalizeEmail(payerEmail)
    const orderId = makeOrderId('MSC')

    const { error: purchaseError } = await supabase.from('course_purchases').insert({
      order_id: orderId,
      course_id: courseId.trim(),
      payer_name: payerName?.trim() || 'Cliente',
      payer_email: email,
      card_last4: String(cardLast4 ?? '').replace(/\D/g, '').slice(-4) || null,
      created_at: nowIso(),
    })
    throwSupabaseError(purchaseError)

    const { error: progressError } = await supabase.from('course_progress').upsert({
      email,
      course_id: courseId.trim(),
      status: 'em-andamento',
      updated_at: nowIso(),
    }, { onConflict: 'email,course_id' })
    throwSupabaseError(progressError)

    res.status(201).json({
      ok: true,
      orderId,
      message: `Compra do curso ${courseId} registrada.`,
    })
  }),
)
