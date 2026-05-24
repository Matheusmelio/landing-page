/** URL de login com redirect seguro (query `redirect`). */
export function loginHref(redirect?: string, opts?: { needEnterprise?: boolean; tipo?: 'empresa' }): string {
  const p = new URLSearchParams()
  if (redirect) p.set('redirect', redirect)
  if (opts?.needEnterprise) p.set('needEnterprise', '1')
  if (opts?.tipo === 'empresa') p.set('tipo', 'empresa')
  const q = p.toString()
  return q ? `/login?${q}` : '/login'
}

/** URL de cadastro com redirect e tipo de conta. */
export function registerHref(redirect?: string, opts?: { tipo?: 'empresa' }): string {
  const p = new URLSearchParams()
  if (redirect) p.set('redirect', redirect)
  if (opts?.tipo === 'empresa') p.set('tipo', 'empresa')
  const q = p.toString()
  return q ? `/cadastro?${q}` : '/cadastro'
}
