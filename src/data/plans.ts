export type PlanId = 'basico' | 'completo' | 'premium'

export type Plan = {
  id: PlanId
  name: string
  price: string
  priceCents: number
  desc: string
  bullets: string[]
  highlight?: boolean
  /** Símbolo exclusivo do plano (mostrado na vitrine e fixado no perfil após a compra) */
  symbol: string
}

/** Benefícios do ecossistema MotStart incluídos nos planos (trilhas exclusivas da plataforma). */
export const MOTSTART_PLAN_ECOSYSTEM = [
  'Cursos e trilhas exclusivos da plataforma MotStart',
  'Exercícios com IA para praticar o que você estuda',
  'Mentorias ao vivo em grupo (conforme o plano)',
  'Mais oportunidades na vitrine de vagas',
  'Maior visibilidade para empresas parceiras na busca de talentos',
] as const

export const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Plano Básico',
    price: 'R$ 49/mês',
    priceCents: 4900,
    desc: 'Ideal para focar em uma trilha. Inclui 1 trilha à sua escolha e suporte por e-mail.',
    bullets: ['1 trilha de cursos', 'Certificado digital', 'Acesso no app'],
    symbol: '◇',
  },
  {
    id: 'completo',
    name: 'Plano Completo',
    price: 'R$ 99/mês',
    priceCents: 9900,
    desc: 'O mais escolhido: combine desenvolvimento web, dados e soft skills no mesmo pacote.',
    bullets: ['Até 3 trilhas', 'Exercícios com IA', 'Comunidade exclusiva'],
    highlight: true,
    symbol: '✦',
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    price: 'R$ 179/mês',
    priceCents: 17900,
    desc: 'Tudo da plataforma, mentorias em grupo e preparação para entrevistas.',
    bullets: ['Todas as trilhas', 'Mentorias ao vivo', 'Prioridade no suporte'],
    symbol: '◆',
  },
]

export function getPlanById(id: string | null): Plan | undefined {
  if (!id) return undefined
  return PLANS.find((p) => p.id === id)
}
