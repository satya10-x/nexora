import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function useLenis(enabled: boolean): void {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    })

    lenisInstance = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(raf)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [])

  useEffect(() => {
    if (!lenisInstance) return
    if (enabled) {
      lenisInstance.start()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    } else {
      lenisInstance.stop()
    }
  }, [enabled])
}

export function scrollToSelector(target: string): void {
  const el = document.querySelector<HTMLElement>(target)
  if (!el) return

  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: -84, duration: 1.35 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
