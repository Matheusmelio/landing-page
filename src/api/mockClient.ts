import type { PlanId } from '../data/plans'
import { apiFetch, isApiEnabled } from '../lib/api/http'

export type CoursePurchasePayload = {
  courseId: string
  payerName: string
  payerEmail: string
  cardLast4: string
}

export type CheckoutPayload = {
  planId: PlanId
  payerName: string
  payerEmail: string
  cardLast4: string
  userEmail?: string
}

export type CheckoutResult = {
  ok: true
  orderId: string
  message: string
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function processCoursePurchaseMockLocal(payload: CoursePurchasePayload): Promise<CheckoutResult> {
  await delay(900)
  if (!payload.payerEmail?.includes('@')) {
    throw new Error('E-mail inválido')
  }
  const orderId = `MSC-${Date.now().toString(36).toUpperCase()}`
  return {
    ok: true,
    orderId,
    message: `Compra do curso ${payload.courseId} registrada (ambiente de demonstração).`,
  }
}

async function processCheckoutMockLocal(payload: CheckoutPayload): Promise<CheckoutResult> {
  await delay(900)
  if (!payload.payerEmail?.includes('@')) {
    throw new Error('E-mail inválido')
  }
  const orderId = `MS-${Date.now().toString(36).toUpperCase()}`
  return {
    ok: true,
    orderId,
    message: `Assinatura ${payload.planId} registrada (ambiente de demonstração).`,
  }
}

/** Compra avulsa de curso — usa API Express + Supabase se `NEXT_PUBLIC_API_URL` estiver definida. */
export async function processCoursePurchaseMock(payload: CoursePurchasePayload): Promise<CheckoutResult> {
  if (!isApiEnabled()) {
    return processCoursePurchaseMockLocal(payload)
  }

  return apiFetch<CheckoutResult>('/api/course-purchases', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Assinatura de plano — usa API Express + Supabase se `NEXT_PUBLIC_API_URL` estiver definida. */
export async function processCheckoutMock(payload: CheckoutPayload): Promise<CheckoutResult> {
  if (!isApiEnabled()) {
    return processCheckoutMockLocal(payload)
  }

  return apiFetch<CheckoutResult>('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
