import type { PlanId } from '../data/plans'

export type CoursePurchasePayload = {
  courseId: string
  payerName: string
  payerEmail: string
  cardLast4: string
}

/**
 * Camada de API simulada. Em produção, troque por `fetch` para o backend
 * (ex.: `import.meta.env.VITE_API_URL`).
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type CheckoutPayload = {
  planId: PlanId
  payerName: string
  payerEmail: string
  /** Últimos 4 dígitos apenas em demo — nunca envie PAN real para o front em produção sem PCI */
  cardLast4: string
}

export type CheckoutResult = {
  ok: true
  orderId: string
  message: string
}

/** Simula compra avulsa de um curso */
export async function processCoursePurchaseMock(payload: CoursePurchasePayload): Promise<CheckoutResult> {
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

/** Simula gateway de pagamento e confirmação de assinatura */
export async function processCheckoutMock(payload: CheckoutPayload): Promise<CheckoutResult> {
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
