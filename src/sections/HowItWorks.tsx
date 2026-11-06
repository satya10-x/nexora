import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHeading } from '@/components/SectionHeading'
import { useInView } from '@/hooks/useInView'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const ProcessCanvas = lazy(() =>
  import('@/three/ProcessCanvas').then((module) => ({ default: module.ProcessCanvas })),
)

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    phase: 'INTENT',
    title: 'Describe the outcome',
    description:
      'Write a ticket in plain language. Nexora compiles it into a scoped, testable execution graph with explicit acceptance criteria.',
    meta: 'avg. compile 1.4s',
  },
  {
    phase: 'EXECUTE',
    title: 'Agents do the work',
    description:
      'Specialised agents plan, code, review and verify in parallel — inside your existing CI, permissions and guardrails.',
    meta: 'avg. run 42s',
  },
  {
    phase: 'LEARN',
    title: 'Ship, then compound',
    description:
      'Clean PRs merge, previews deploy, and every run feeds the context graph. The next delivery is faster than the last.',
    meta: 'median 19.4x velocity',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [canvasReady, setCanvasReady] = useState(false)
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const pinned = isDesktop && !reduced
  const inView = useInView(visualRef, { rootMargin: '200px' })

  useEffect(() => {
    if (inView) setCanvasReady(true)
  }, [inView])

  useEffect(() => {
    if (!pinned) return
    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2600',
        pin,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${8 + self.progress * 92}%`
          }
          const next = Math.min(2, Math.floor(self.progress * 3))
          setStep((current) => (current === next ? current : next))
        },
      })
    }, section)

    return () => ctx.revert()
  }, [pinned])

  useEffect(() => {
    if (pinned) return
    if (progressRef.current) {
      progressRef.current.style.width = `${((step + 1) / STEPS.length) * 100}%`
    }
  }, [step, pinned])

  return (
    <section
      ref={sectionRef}
      id="process"
      className={cn('relative', pinned ? 'overflow-hidden' : 'py-24 md:py-32')}
    >
      <div className="pointer-events-none absolute inset-0 cyber-grid-fine opacity-20" aria-hidden="true" />

      <div
        ref={pinRef}
        className={cn(
          'relative mx-auto w-full max-w-[1400px] px-5 md:px-8',
          pinned && 'flex h-screen flex-col justify-center',
        )}
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            index="02"
            eyebrow="Process"
            title={'From intent to production,\nwithout the handoffs.'}
            highlight={['without', 'the', 'handoffs.']}
            description="One continuous loop. No tickets to translate, no context to re-explain, no waiting on a green build."
          />
          <div
            data-reveal
            className="flex shrink-0 items-center gap-4 font-mono text-[9px] uppercase tracking-[0.24em] text-white/25"
          >
            <span>Phase 0{step + 1}</span>
            <span className="h-px w-8 bg-white/15" />
            <span>03 total</span>
          </div>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex flex-col gap-2 lg:order-1">
            {STEPS.map((item, index) => {
              const active = step === index
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setStep(index)}
                  aria-current={active ? 'step' : undefined}
                  data-cursor="hover"
                  className={cn(
                    'group relative w-full rounded-2xl border px-5 py-5 text-left transition-all duration-500 md:px-6',
                    active
                      ? 'border-white/[0.12] bg-white/[0.04]'
                      : 'border-transparent bg-transparent hover:border-white/[0.06] hover:bg-white/[0.02]',
                  )}
                >
                  <div
                    className={cn(
                      'absolute left-0 top-5 bottom-5 w-px bg-gradient-to-b from-neon-cyan via-neon-violet to-neon-magenta transition-opacity duration-500',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        'mt-0.5 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300',
                        active ? 'text-neon-cyan' : 'text-white/25',
                      )}
                    >
                      0{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className={cn(
                            'font-mono text-[8px] uppercase tracking-[0.24em] transition-colors',
                            active ? 'text-neon-violet/80' : 'text-white/25',
                          )}
                        >
                          {item.phase}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
                          {item.meta}
                        </span>
                      </div>
                      <h3
                        className={cn(
                          'mt-1 text-lg font-medium tracking-[-0.015em] transition-colors duration-300 md:text-xl',
                          active ? 'text-white' : 'text-white/45',
                        )}
                      >
                        {item.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden text-[13px] leading-relaxed text-white/45"
                          >
                            <span className="block pt-2">{item.description}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <span
                      className={cn(
                        'mt-1 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/50',
                        active && 'text-neon-cyan/70',
                      )}
                      aria-hidden="true"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </button>
              )
            })}

            <div className="mt-4 flex items-center gap-4 px-6">
              <div className="relative h-px flex-1 overflow-hidden bg-white/[0.08]">
                <div
                  ref={progressRef}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta transition-[width] duration-300"
                  style={{ width: '8%' }}
                />
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/30">
                Loop
              </span>
            </div>
          </div>

          <div
            ref={visualRef}
            className="relative order-1 h-[320px] w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-[#04060b] lg:order-2 lg:h-[460px] hud-corners"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.10),transparent_60%),radial-gradient(circle_at_30%_80%,rgba(255,43,214,0.08),transparent_55%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 cyber-grid-fine opacity-25" aria-hidden="true" />

            <div className="absolute inset-0">
              {canvasReady && (
                <Suspense fallback={null}>
                  <ProcessCanvas step={step} />
                </Suspense>
              )}
            </div>

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-neon-cyan" />
                Nexus / live object
              </span>
              <span>0{step + 1} · {STEPS[step].phase}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/45 backdrop-blur-md">
                {STEPS[step].title}
              </div>
              <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-neon-cyan/60">
                {pinned ? 'Scroll to advance' : 'Tap a phase'}
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07] [animation:spin-slow_38s_linear_infinite]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
