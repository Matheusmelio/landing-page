/** Destino seguro após login/cadastro (evita open redirect). */
export function postAuthRedirect(searchRedirect: string | null): string {
  if (
    searchRedirect &&
    searchRedirect.startsWith('/') &&
    !searchRedirect.startsWith('//')
  ) {
    return searchRedirect
  }
  return '/perfil'
}
