import type { AgendaItem, AgendaItemType } from '@/data/dashboardAgenda'
import { DASHBOARD_AGENDA } from '@/data/dashboardAgenda'

const KEY_PREFIX = 'motstart_agenda_user_v1:'
const VALID_TYPES = new Set<AgendaItemType>(['live', 'prazo', 'mentoria'])

function storageKey(email: string) {
  return `${KEY_PREFIX}${email.toLowerCase().trim()}`
}

function isValidItem(item: unknown): item is AgendaItem {
  if (!item || typeof item !== 'object') return false
  const o = item as AgendaItem
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.dateLabel === 'string' &&
    typeof o.timeRange === 'string' &&
    VALID_TYPES.has(o.type)
  )
}

function readUserItems(email: string): AgendaItem[] {
  if (typeof window === 'undefined' || !email.includes('@')) return []
  try {
    const raw = localStorage.getItem(storageKey(email))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidItem)
  } catch {
    return []
  }
}

function writeUserItems(email: string, items: AgendaItem[]) {
  if (typeof window === 'undefined' || !email.includes('@')) return
  localStorage.setItem(storageKey(email), JSON.stringify(items))
}

function sortKey(item: AgendaItem): number {
  if (item.eventDate) {
    const [y, m, d] = item.eventDate.split('-').map(Number)
    if (y && m && d) {
      const t = new Date(y, m - 1, d, 12, 0, 0, 0).getTime()
      if (!Number.isNaN(t)) return t
    }
  }
  return Number.MAX_SAFE_INTEGER
}

/** Itens padrão + eventos criados pelo usuário, ordenados por data. */
export function loadAgendaItems(email: string): AgendaItem[] {
  if (!email?.includes('@')) {
    return DASHBOARD_AGENDA.filter((d) => !d.userAdded)
  }
  const userItems = readUserItems(email)
  const defaults = DASHBOARD_AGENDA.filter((d) => !d.userAdded)
  return [...defaults, ...userItems].sort((a, b) => sortKey(a) - sortKey(b))
}

export function addAgendaItem(email: string, item: Omit<AgendaItem, 'id' | 'userAdded'>): AgendaItem {
  if (!email?.includes('@')) {
    throw new Error('E-mail inválido para salvar na agenda')
  }
  const next: AgendaItem = {
    ...item,
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `ag-${Date.now()}`,
    userAdded: true,
  }
  const userItems = [...readUserItems(email), next]
  writeUserItems(email, userItems)
  return next
}

export function removeAgendaItem(email: string, id: string): void {
  if (!email?.includes('@')) return
  const userItems = readUserItems(email).filter((i) => i.id !== id)
  writeUserItems(email, userItems)
}
