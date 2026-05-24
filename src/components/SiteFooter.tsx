'use client'

import { loginHref } from '@/lib/authUrls'
import Link from 'next/link'
import { useAuth } from '../auth/AuthContext'

export function SiteFooter() {
  const { user, isEnterprise } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <strong className="site-footer__name">MotStart</strong>
          <p className="site-footer__tagline">Cursos, planos e carreira em tecnologia.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Rodapé">
          <div className="site-footer__col">
            <span className="site-footer__heading">Aprender</span>
            {user ? (
              <Link href="/cursos">Cursos</Link>
            ) : (
              <Link href={loginHref('/cursos')}>
                Cursos
              </Link>
            )}
            {!isEnterprise ? <Link href="/planos">Planos</Link> : null}
            <Link href="/sobre">Sobre</Link>
            <Link href="/publicar-curso">Publicar curso</Link>
            <Link href="/exercicios-ia">Exercícios IA</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__heading">Conta</span>
            <Link href="/login">Entrar</Link>
            <Link href="/cadastro">Cadastrar</Link>
            <Link href="/perfil">Perfil</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__heading">Empresas</span>
            <Link href="/cadastro?tipo=empresa">Conta empresarial</Link>
            <Link href="/empresa/assessoria">Assessoria</Link>
            <Link href="/vagas">Vagas</Link>
          </div>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p className="site-footer__copy">© {year} MotStart. Demonstração — conteúdo ilustrativo.</p>
          <Link href="/termos" className="site-footer__legal">
            Termos e privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
