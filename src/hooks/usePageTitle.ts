import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'MotStart'

/** Rotas conhecidas → segmento; `null` = rota não mapeada (404). */
function titleForPath(pathname: string): string | null {
  const exact: Record<string, string> = {
    '/': 'Aprendizado em Tech',
    '/cursos': 'Cursos',
    '/planos': 'Planos',
    '/vagas': 'Vagas',
    '/perfil': 'Perfil',
    '/talentos': 'Talentos',
    '/sobre': 'Sobre',
    '/publicar-curso': 'Publicar curso',
    '/exercicios-ia': 'Exercícios IA',
    '/login': 'Entrar',
    '/cadastro': 'Cadastro',
    '/empresa/assessoria': 'Assessoria empresarial',
    '/empresa/vagas': 'Publicar vagas',
    '/termos': 'Termos e privacidade',
  }
  if (pathname in exact) return exact[pathname]
  if (pathname.startsWith('/checkout')) return 'Checkout'
  if (/^\/curso\/[^/]+\/comprar\/?$/.test(pathname)) return 'Comprar curso'
  if (pathname.startsWith('/curso/')) return 'Curso'
  return null
}

export function usePageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const segment = titleForPath(pathname)
    if (segment === null) {
      document.title = `Página não encontrada — ${SITE}`
      return
    }
    document.title = pathname === '/' ? `${SITE} — ${segment}` : `${segment} — ${SITE}`
  }, [pathname])
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
