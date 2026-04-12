export type AgendaItem = {
  id: string
  title: string
  dateLabel: string
  timeRange: string
  type: 'live' | 'prazo' | 'mentoria'
}

/** Eventos de demonstração na aba Agenda do painel. */
export const DASHBOARD_AGENDA: AgendaItem[] = [
  {
    id: 'a1',
    title: 'Live: revisão de projeto Full Stack',
    dateLabel: 'Hoje',
    timeRange: '19:00 – 20:30',
    type: 'live',
  },
  {
    id: 'a2',
    title: 'Entrega do desafio — Python para Data Science',
    dateLabel: 'Amanhã',
    timeRange: 'até 23:59',
    type: 'prazo',
  },
  {
    id: 'a3',
    title: 'Mentoria em grupo — carreira em UX',
    dateLabel: 'Sex., 18 abr.',
    timeRange: '15:00 – 16:00',
    type: 'mentoria',
  },
  {
    id: 'a4',
    title: 'Workshop: testes automatizados (QA)',
    dateLabel: 'Seg., 21 abr.',
    timeRange: '10:00 – 12:00',
    type: 'live',
  },
]
