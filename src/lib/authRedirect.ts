/** Destino seguro após login/cadastro (evita open redirect). */
export function postAuthRedirect(state: unknown, searchRedirect: string | null): string {
  const from = (state as { from?: string } | null)?.from
  if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
    return from
  }
  if (
    searchRedirect &&
    searchRedirect.startsWith('/') &&
    !searchRedirect.startsWith('//')
  ) {
    return searchRedirect
  }
  return '/perfil'
}
