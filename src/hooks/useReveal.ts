import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Global, one-shot section reveal driven by ScrollTrigger.
 * Add `data-reveal` to any element and optionally `data-reveal-delay="0.2"`.
 */
export function useReveal(ref: RefObject<HTMLElement>, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return
    const root = ref.current
    if (!root) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0, filter: 'none' })
      return
    }

    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0)
        gsap.fromTo(
          el,
          { y: 42, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.05,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            },
          },
        )
      })
    }, root)

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350)

    return () => {
      window.clearTimeout(id)
      ctx.revert()
    }
  }, [ref, enabled])
}
