/** Rótulo amigável para a coluna de data da agenda (Hoje, Amanhã, sex., 18 abr.). */
export function formatAgendaDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate

  const target = new Date(y, m - 1, d, 12, 0, 0, 0)
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (target.getTime() === today.getTime()) return 'Hoje'
  if (target.getTime() === tomorrow.getTime()) return 'Amanhã'

  return target
    .toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(/\./g, '.')
}

export function todayIsoDate(): string {
  const n = new Date()
  const y = n.getFullYear()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
