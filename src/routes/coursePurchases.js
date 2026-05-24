import { Router } from 'express'
import { assertSupabase, supabase } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { makeOrderId } from '../utils/orderId.js'

export const coursePurchasesRouter = Router()

coursePurchasesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

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

    const email = payerEmail.trim().toLowerCase()
    const orderId = makeOrderId('MSC')

    const { error: purchaseError } = await supabase.from('course_purchases').insert({
      order_id: orderId,
      course_id: courseId.trim(),
      payer_name: payerName?.trim() || 'Cliente',
      payer_email: email,
      card_last4: String(cardLast4 ?? '').replace(/\D/g, '').slice(-4) || null,
    })

    if (purchaseError) {
      const err = new Error(purchaseError.message)
      err.status = 500
      err.details = purchaseError
      throw err
    }

    const { error: progressError } = await supabase.from('course_progress').upsert(
      {
        user_email: email,
        course_id: courseId.trim(),
        status: 'em-andamento',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_email,course_id' },
    )

    if (progressError) {
      const err = new Error(progressError.message)
      err.status = 500
      err.details = progressError
      throw err
    }

    res.status(201).json({
      ok: true,
      orderId,
      message: `Compra do curso ${courseId} registrada.`,
    })
  }),
)
