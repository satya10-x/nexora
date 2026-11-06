import { lazy, Suspense, useRef } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { SplitWords } from '@/components/AnimatedText'
import { useInView } from '@/hooks/useInView'

const CTACanvas = lazy(() =>
  import('@/three/CTACanvas').then((module) => ({ default: module.CTACanvas })),
)

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const inView = useInView(canvasRef, { rootMargin: '320px' })
  const sectionInView = useInView(sectionRef, { rootMargin: '0px 0px -15% 0px' })

  return (
    <section
      ref={sectionRef}
      id="start"
      className="relative overflow-hidden border-t border-white/[0.06] py-28 md:py-40"
    >
      <div ref={canvasRef} className="absolute inset-0">
        {inView && (
          <Suspense fallback={null}>
            <CTACanvas />
          </Suspense>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_58%_at_50%_45%,rgba(5,6,10,0.68)_0%,rgba(5,6,10,0.45)_48%,rgba(5,6,10,0.9)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06] [animation:spin-slow_50s_linear_infinite] md:h-[760px] md:w-[760px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-cyan/[0.08] md:h-[520px] md:w-[520px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 text-center md:px-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
          <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/50">
            Connect Jira in 90 seconds
          </span>
        </div>

        <SplitWords
          as="h2"
          text={'READY TO HEAL\nYOUR SUITE?'}
          highlight={['HEAL']}
          play={sectionInView}
          className="mx-auto mt-7 font-display text-[clamp(2.8rem,8.4vw,7.4rem)] font-medium uppercase leading-[0.88] tracking-[-0.045em] text-white"
        />

        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/50 md:text-[16px]">
          Connect Jira and your app target. SentinelQA writes the Playwright suite, runs it and
          repairs broken selectors — with your quality gates on.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticButton href="/login" size="lg" className="w-full sm:w-auto">
            Start testing free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
          <MagneticButton href="mailto:hello@sentinelqa.dev" variant="ghost" size="lg" className="w-full sm:w-auto">
            Book a live demo
          </MagneticButton>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">
          <span>No credit card</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>14-day pro trial</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>Cancel anytime</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />
    </section>
  )
}
