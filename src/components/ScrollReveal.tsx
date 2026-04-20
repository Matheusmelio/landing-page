import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react'

type ScrollRevealProps<T extends ElementType> = {
  as?: T
  /** Só anima filhos com classe `scroll-reveal-stagger`; o container não faz fade. */
  staggerOnly?: boolean
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'> & { children: ReactNode }

const observerOpts: IntersectionObserverInit = {
  rootMargin: '0px 0px -11% 0px',
  threshold: [0, 0.06, 0.12],
}

function isRoughlyInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  return rect.top < vh * 0.92 && rect.bottom > vh * 0.04
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ScrollReveal<T extends ElementType = 'div'>({
  as,
  className,
  children,
  staggerOnly = false,
  ...rest
}: ScrollRevealProps<T>) {
  const Comp = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined' ? prefersReducedMotion() : false
  )

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      return
    }

    const reveal = () => setVisible(true)

    if (isRoughlyInViewport(el)) {
      queueMicrotask(reveal)
    }

    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          queueMicrotask(reveal)
          obs.unobserve(entry.target)
        }
      }
    }, observerOpts)

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cls = [
    'scroll-reveal',
    visible && 'scroll-reveal--visible',
    staggerOnly && 'scroll-reveal--stagger-only',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Comp ref={ref} className={cls} {...(rest as object)}>
      {children}
    </Comp>
  )
}
