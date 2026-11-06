import { lazy, Suspense, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LineReveal } from '@/components/AnimatedText'
import { MagneticButton } from '@/components/MagneticButton'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const HeroCanvas = lazy(() =>
  import('@/three/HeroCanvas').then((module) => ({ default: module.HeroCanvas })),
)

type HeroProps = {
  ready: boolean
}

export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mobile = useMediaQuery('(max-width: 767px)')
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const cardOneY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const cardTwoY = useTransform(scrollYProgress, [0, 1], [0, -180])
  const cardThreeY = useTransform(scrollYProgress, [0, 1], [0, -70])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden pb-24 pt-28 md:pt-36"
    >
      <div className="absolute inset-0">
        {ready && (
          <Suspense fallback={null}>
            <HeroCanvas active={ready} mobile={mobile} />
          </Suspense>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_18%_30%,rgba(0,240,255,0.10),transparent_60%),radial-gradient(ellipse_50%_50%_at_80%_55%,rgba(139,92,246,0.12),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,10,0.88)_0%,rgba(5,6,10,0.62)_42%,transparent_74%)] lg:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-13rem)] w-full max-w-[1400px] flex-col justify-center px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <div
              data-reveal
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-cyan" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/60 md:text-[10px]">
                SentinelQA 0.3 — autonomous quality
              </span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-neon-cyan sm:inline">
                Live
              </span>
            </div>

            <LineReveal
              as="h1"
              play={ready}
              delay={0.35}
              lines={[
                { text: 'QUALITY THAT' },
                { text: 'HEALS ITSELF.', className: 'text-gradient' },
              ]}
              className="mt-7 font-display text-[clamp(2.6rem,7.1vw,6.7rem)] font-medium uppercase leading-[0.88] tracking-[-0.045em] text-white"
            />

            <p
              data-reveal
              className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/55 md:text-[17px]"
            >
              SentinelQA reads your acceptance criteria, writes the Playwright suite, runs it
              headlessly and repairs broken selectors before they ever reach your team.
            </p>

            <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton href="/login" size="lg" ariaLabel="Start testing with SentinelQA">
                Start testing free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
              <MagneticButton href="/login" variant="ghost" size="lg" ariaLabel="Explore the SentinelQA demo workspace">
                Explore demo workspace
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M2.5 1.5 6 4 2.5 6.5V1.5Z" fill="currentColor" />
                  </svg>
                </span>
              </MagneticButton>
            </div>

            <div
              data-reveal
              className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35"
            >
              <span>No credit card</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span>Jira + Groq native</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span className="text-white/50">Works with your CI</span>
            </div>
          </div>

          <div className="relative hidden h-[500px] lg:col-span-4 lg:block xl:col-span-5" aria-hidden="true">
            <motion.div
              style={{ y: cardOneY }}
              className="absolute right-0 top-6 w-[248px] animate-float"
            >
              <div className="hud-corners glass rounded-2xl p-4 shadow-glass">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/40">
                    Sentinel / run 8fb2
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-neon-cyan">
                    <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
                    Synthesizing
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-medium text-white">auth-login.spec.ts</p>
                <p className="mt-1 font-mono text-[9px] text-white/40">
                  3 scenarios · 0 failures · 12 assertions
                </p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta" />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[8px] text-white/35">
                  <span>SYNTHESIS</span>
                  <span>78%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: cardTwoY }}
              className="absolute right-24 top-[214px] w-[228px] animate-[float_9s_ease-in-out_1.2s_infinite]"
            >
              <div className="hud-corners hud-corners-violet glass rounded-2xl p-4 shadow-glass">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6.2 4.6 8.8 10 3.4" stroke="#00f0ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                      Self-healed
                    </p>
                    <p className="text-[12px] font-medium text-white">selector repaired</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                    <p className="text-white/30">Locator</p>
                    <p className="mt-1 text-[11px] normal-case tracking-normal text-white/75">#login-btn</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                    <p className="text-white/30">Heal time</p>
                    <p className="mt-1 text-[11px] normal-case tracking-normal text-neon-cyan">1.8s</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: cardThreeY }}
              className="absolute bottom-2 right-8 w-[238px] animate-[float_11s_ease-in-out_0.6s_infinite]"
            >
              <div className="hud-corners hud-corners-magenta glass rounded-2xl p-4 shadow-glass">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/40">
                    Self-healing rate
                  </span>
                  <span className="font-mono text-[9px] text-neon-cyan">+12 pts</span>
                </div>
                <p className="mt-2 font-logo text-2xl font-bold tracking-tight text-white">98.2%</p>
                <svg viewBox="0 0 140 34" className="mt-2 w-full" fill="none">
                  <defs>
                    <linearGradient id="hero-spark" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#00f0ff" stopOpacity="0.2" />
                      <stop offset="1" stopColor="#ff2bd6" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="0,31 16,26 30,28 46,18 62,21 78,12 94,15 110,7 126,9 140,2"
                    stroke="url(#hero-spark)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-5 top-24 hidden font-mono text-[8px] uppercase leading-relaxed tracking-[0.24em] text-white/20 md:block lg:left-8 lg:top-32">
        <p>RUN / 8FB2</p>
        <p>TESTS / 214</p>
        <p className="mt-2 text-neon-cyan/40">HEALED / 12</p>
      </div>

      <div className="pointer-events-none absolute right-5 top-24 hidden text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.24em] text-white/20 md:block lg:right-8 lg:top-32">
        <p>SQA / v0.3.0</p>
        <p>APIS / CONNECTED</p>
        <p className="mt-2 text-neon-violet/50">GRID / STABLE</p>
      </div>

      <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center">
        <div className="flex flex-col items-center gap-2 font-mono text-[8px] uppercase tracking-[0.35em] text-white/30">
          <span>Scroll to explore</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-4 animate-scan bg-gradient-to-b from-neon-cyan to-transparent" />
          </span>
        </div>
      </div>
    </section>
  )
}
