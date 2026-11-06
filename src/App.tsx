import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomCursor } from '@/components/CustomCursor'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Navbar } from '@/components/Navbar'
import { Preloader } from '@/components/Preloader'
import { CinematicIntro } from '@/intro/CinematicIntro'
import { Hero } from '@/sections/Hero'
import { LogoMarquee } from '@/sections/LogoMarquee'
import { Features } from '@/sections/Features'
import { HowItWorks } from '@/sections/HowItWorks'
import { LiveDemo } from '@/sections/LiveDemo'
import { Stats } from '@/sections/Stats'
import { Testimonials } from '@/sections/Testimonials'
import { Pricing } from '@/sections/Pricing'
import { FAQ } from '@/sections/FAQ'
import { FinalCTA } from '@/sections/FinalCTA'
import { Footer } from '@/sections/Footer'
import { useLenis } from '@/hooks/useLenis'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

type Phase = 'preloader' | 'intro' | 'site'

export default function App() {
  const [phase, setPhase] = useState<Phase>('preloader')
  const siteRef = useRef<HTMLDivElement>(null)
  const ready = phase === 'site'

  useLenis(ready)
  useReveal(siteRef, ready)

  useEffect(() => {
    const site = siteRef.current
    if (site) site.toggleAttribute('inert', !ready)

    if (ready) {
      document.body.style.overflow = ''
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 160)
      return () => window.clearTimeout(id)
    }

    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
  }, [ready])

  const handleReplay = useCallback(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    setPhase('intro')
  }, [])

  return (
    <div className="relative min-h-screen bg-ink">
      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-white px-4 py-2 font-mono text-xs text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <CustomCursor />
      <ScrollProgress visible={ready} />
      <Navbar />

      <div
        ref={siteRef}
        aria-hidden={!ready}
        className={ready ? 'relative' : 'pointer-events-none relative select-none'}
      >
        <main id="main">
          <Hero ready={ready} />
          <LogoMarquee />
          <Features />
          <HowItWorks />
          <LiveDemo />
          <Stats />
          <Testimonials />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer onReplay={handleReplay} />
      </div>

      <div className="noise-overlay" aria-hidden="true" />

      {phase === 'preloader' && <Preloader onComplete={() => setPhase('intro')} />}
      {phase === 'intro' && <CinematicIntro onComplete={() => setPhase('site')} />}
    </div>
  )
}
