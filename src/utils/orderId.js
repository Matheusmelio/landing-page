export function makeOrderId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`
}
