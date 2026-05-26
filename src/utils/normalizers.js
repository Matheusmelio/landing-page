export function nowIso() {
  return new Date().toISOString()
}

export function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

export function normalizeName(name) {
  return typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : ''
}

export function normalizeNullableText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
