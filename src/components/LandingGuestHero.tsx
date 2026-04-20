import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'

const AUTO_MS = 6500

type SlideId = 'slogan' | 'cursos' | 'professores' | 'noticias'

type HeroSlide = {
  id: SlideId
  kicker: string
  title: ReactNode
  lead: ReactNode
  cta?: { to: string; label: string; state?: { from: string } }
}

type Bubble = { strong: string; label: string }

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

export function LandingGuestHero({ catalogTotal }: { catalogTotal: number }) {
  const reducedMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [hoverPause, setHoverPause] = useState(false)
  const [docVisible, setDocVisible] = useState(() =>
    typeof document !== 'undefined' ? !document.hidden : true
  )

  const slides: HeroSlide[] = [
    {
      id: 'slogan',
      kicker: 'Sua carreira em movimento',
      title: (
        <>
          Aprimore suas <span className="home-landing-hero__accent">habilidades</span> para progredir em sua{' '}
          <span className="home-landing-hero__accent">carreira</span>
        </>
      ),
      lead: (
        <>
          Programação, desenvolvimento web, dados e design — trilhas completas, comunidade e suporte. Use{' '}
          <strong>Entrar</strong> ou <strong>Cadastrar</strong> no menu no topo da página para acessar sua conta.
        </>
      ),
    },
    {
      id: 'cursos',
      kicker: 'Sobre os cursos',
      title: (
        <>
          Trilhas do <span className="home-landing-hero__accent">zero ao portfólio</span>, com projetos que importam
        </>
      ),
      lead: (
        <>
          Aulas em vídeo, exercícios e progresso acompanhado — mais de <strong>{catalogTotal} cursos</strong> no catálogo
          para você evoluir no seu ritmo.
        </>
      ),
      cta: { to: '/login', label: 'Explorar cursos', state: { from: '/cursos' } },
    },
    {
      id: 'professores',
      kicker: 'Sobre os professores',
      title: (
        <>
          Instrutores que <span className="home-landing-hero__accent">vivem a tecnologia</span> no dia a dia
        </>
      ),
      lead:
        'Didática clara, experiência de mercado e foco em resultado — mentoria alinhada ao que as empresas buscam hoje.',
      cta: { to: '#instrutores', label: 'Ver instrutores' },
    },
    {
      id: 'noticias',
      kicker: 'Mundo tecnológico',
      title: (
        <>
          Fique por dentro de <span className="home-landing-hero__accent">IA, cloud e tendências</span> da área
        </>
      ),
      lead:
        'Acompanhe o que move o mercado de tech — de ferramentas a boas práticas — e use isso a favor da sua trajetória profissional.',
      cta: { to: '/sobre', label: 'Conheça a MotStart' },
    },
  ]

  const bubblesBySlide: Record<SlideId, Bubble[]> = {
    slogan: [
      { strong: '2K+', label: 'aulas em vídeo' },
      { strong: `${catalogTotal}+`, label: 'cursos no catálogo' },
      { strong: '250+', label: 'horas de conteúdo' },
    ],
    cursos: [
      { strong: '50+', label: 'trilhas e módulos' },
      { strong: '100%', label: 'conteúdo sob demanda' },
      { strong: '∞', label: 'revisão quando quiser' },
    ],
    professores: [
      { strong: '50+', label: 'especialistas ativos' },
      { strong: '10+', label: 'anos em média no mercado' },
      { strong: '1:1', label: 'foco em dúvidas reais' },
    ],
    noticias: [
      { strong: 'IA', label: 'tendências semanais' },
      { strong: 'Cloud', label: 'updates do setor' },
      { strong: 'Dev', label: 'boas práticas e tools' },
    ],
  }

  const len = slides.length
  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len)
    },
    [len]
  )

  useEffect(() => {
    const onVis = () => setDocVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (reducedMotion || hoverPause || !docVisible) return
    const t = window.setInterval(() => go(1), AUTO_MS)
    return () => window.clearInterval(t)
  }, [reducedMotion, hoverPause, docVisible, go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const slide = slides[index]
  const slideId = slide.id

  return (
    <div
      className="landing-guest-hero"
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
    >
      <div className="container home-landing-hero__inner">
        <div className="home-landing-hero__copy">
          <div className="home-hero-carousel">
            <p className="home-hero-carousel__kicker">{slide.kicker}</p>

            <div className="home-hero-carousel__viewport" aria-live="polite" aria-atomic="true">
              <div key={slide.id} className="home-hero-carousel__slide">
                <h1 id="landing-hero-heading" className="home-landing-hero__title">
                  {slide.title}
                </h1>
                <p className="home-landing-hero__lead">{slide.lead}</p>
                {slide.cta ? (
                  slide.cta.to.startsWith('#') ? (
                    <a href={slide.cta.to} className="home-hero-carousel__cta link-purple">
                      {slide.cta.label} →
                    </a>
                  ) : (
                    <Link
                      to={slide.cta.to}
                      state={slide.cta.state}
                      className="home-hero-carousel__cta link-purple"
                    >
                      {slide.cta.label} →
                    </Link>
                  )
                ) : null}
              </div>
            </div>

            <div className="home-hero-carousel__controls" role="group" aria-label="Navegação do destaque">
              <button
                type="button"
                className="home-hero-carousel__arrow"
                aria-label="Slide anterior"
                onClick={() => go(-1)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="home-hero-carousel__dots" role="group" aria-label="Slides do hero">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Slide ${i + 1}: ${s.kicker}`}
                    aria-current={i === index ? 'true' : undefined}
                    className={`home-hero-carousel__dot ${i === index ? 'home-hero-carousel__dot--active' : ''}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>

              <button type="button" className="home-hero-carousel__arrow" aria-label="Próximo slide" onClick={() => go(1)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <ul className="home-landing-hero__features">
            <li>
              <span className="home-landing-hero__feature-icon" aria-hidden="true">
                💬
              </span>
              Comunidade
            </li>
            <li>
              <span className="home-landing-hero__feature-icon" aria-hidden="true">
                💼
              </span>
              Carreira orientada
            </li>
            <li>
              <span className="home-landing-hero__feature-icon" aria-hidden="true">
                ✨
              </span>
              Projetos práticos
            </li>
          </ul>
        </div>

        <div className="home-landing-hero__aside" data-hero-slide={slideId} aria-hidden="true">
          <div key={slideId} className="home-landing-hero__aside-sync">
            <div className={`home-landing-bubble home-landing-bubble--1 home-landing-bubble--${slideId}`}>
              <strong>{bubblesBySlide[slideId][0].strong}</strong>
              <span>{bubblesBySlide[slideId][0].label}</span>
            </div>
            <div className={`home-landing-bubble home-landing-bubble--2 home-landing-bubble--${slideId}`}>
              <strong>{bubblesBySlide[slideId][1].strong}</strong>
              <span>{bubblesBySlide[slideId][1].label}</span>
            </div>
            <div className={`home-landing-bubble home-landing-bubble--3 home-landing-bubble--${slideId}`}>
              <strong>{bubblesBySlide[slideId][2].strong}</strong>
              <span>{bubblesBySlide[slideId][2].label}</span>
            </div>

            <div className="home-landing-hero__orb-wrap">
              <div className={`home-landing-hero__orb home-landing-hero__orb--${slideId}`} />
              {slideId === 'slogan' ? (
                <img
                  src={IMAGES.heroStudent}
                  alt=""
                  className="home-landing-hero__student"
                  width={300}
                  height={300}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className={`home-landing-hero__scene home-landing-hero__scene--${slideId}`} aria-hidden="true">
                  {slideId === 'cursos' && (
                    <>
                      <span className="home-landing-hero__scene-grid" />
                      <span className="home-landing-hero__scene-ring home-landing-hero__scene-ring--a" />
                      <span className="home-landing-hero__scene-ring home-landing-hero__scene-ring--b" />
                    </>
                  )}
                  {slideId === 'professores' && (
                    <>
                      <span className="home-landing-hero__scene-neural" />
                      <span className="home-landing-hero__scene-glow" />
                    </>
                  )}
                  {slideId === 'noticias' && (
                    <>
                      <span className="home-landing-hero__scene-binary" />
                      <span className="home-landing-hero__scene-streak home-landing-hero__scene-streak--1" />
                      <span className="home-landing-hero__scene-streak home-landing-hero__scene-streak--2" />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
