import { lazy, Suspense, useRef } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { TiltCard } from '@/components/TiltCard'
import { useInView } from '@/hooks/useInView'

const MiniOrbCanvas = lazy(() =>
  import('@/three/MiniOrbCanvas').then((module) => ({ default: module.MiniOrbCanvas })),
)

function FeatureScene() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, rootMargin: '300px' })

  return (
    <div ref={ref} className="absolute inset-0">
      {inView && (
        <Suspense fallback={null}>
          <MiniOrbCanvas />
        </Suspense>
      )}
    </div>
  )
}

function CardShell({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <TiltCard className={className}>
      <div
        data-reveal
        data-reveal-delay={delay}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl card-surface p-6 md:p-7 hud-corners"
      >
        {children}
      </div>
    </TiltCard>
  )
}

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(139,92,246,0.09),transparent_65%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="01"
            eyebrow="Capabilities"
            title={'Everything QA needs\nto heal itself.'}
            highlight={['heal', 'itself.']}
            description="Not another flaky test suite. A full quality layer that parses intent, writes Playwright specs, runs them and repairs breakage."
          />
          <div data-reveal className="hidden shrink-0 text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.26em] text-white/25 lg:block">
            <p>06 modules</p>
            <p>01 pipeline</p>
            <p className="mt-2 text-neon-cyan/50">Always on</p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardShell className="md:col-span-2 lg:row-span-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(0,240,255,0.12),transparent_48%)]" aria-hidden="true" />
            <div className="relative z-10 flex items-start justify-between">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/45">
                01 / Synthesis
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-neon-cyan/80">
                <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
                Pipeline live
              </span>
            </div>

            <div className="relative mt-8 min-h-[240px] flex-1">
              <FeatureScene />
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_75%_65%_at_30%_45%,rgba(5,7,13,0.92)_0%,rgba(5,7,13,0.58)_50%,transparent_76%)] md:hidden"
                aria-hidden="true"
              />
              <div className="relative z-10 max-w-[280px]">
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-white md:text-3xl">
                  Acceptance criteria become tests.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  Point SentinelQA at a Jira story. It parses Given / When / Then criteria and
                  synthesizes a complete Playwright suite with Groq-assisted generation.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-2">
              {['PARSE', 'SYNTHESIZE', 'EXECUTE', 'HEAL', 'REPORT'].map((tag, index) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/45"
                >
                  <span className="mr-1.5 text-neon-cyan/60">0{index + 1}</span>
                  {tag}
                </span>
              ))}
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
              <span>214 specs generated / traceable</span>
              <span className="text-neon-cyan/60">coverage 94%</span>
            </div>
          </CardShell>

          <CardShell delay={0.05}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                02 / Jira parser
              </span>
              <span className="text-neon-cyan/60">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 13 13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-white">
              Story-aware parser
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/45">
              Stories, epics and acceptance criteria normalized into structured scenarios.
            </p>

            <div className="relative mt-5 flex-1">
              <div className="space-y-1.5 rounded-xl border border-white/[0.06] bg-[#05070d] p-3 font-mono text-[9px]">
                <p className="text-white/35">
                  <span className="text-neon-magenta/70">criteria</span> = parse(&quot;ADM-312&quot;)
                </p>
                <p className="text-white/35">
                  <span className="text-neon-violet/80">scenarios</span> = compile(criteria)
                </p>
                <p className="flex items-center gap-1.5 text-neon-cyan/80">
                  <span className="h-1 w-1 rounded-full bg-neon-cyan" />
                  deterministic · traceable
                </p>
              </div>
              <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
            </div>
          </CardShell>

          <CardShell delay={0.1}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                03 / Quality gates
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neon-violet/30 bg-neon-violet/10 text-neon-violet">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="2.5" y="5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
                  <path d="M4 5V3.8a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-white">
              CI guardrails
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/45">
              Quality gates that block regressions without blocking shipping.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {['GATE', 'TRACE', 'RETRY', 'QUARANTINE'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.08] bg-white/[0.025] px-2 py-1 font-mono text-[8px] tracking-[0.16em] text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" />
              Zero flaky merges / 30d
            </div>
          </CardShell>

          <CardShell delay={0.15}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                04 / Healing
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-neon-cyan/70">
                Auto
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-white">
              Self-healing locators
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/45">
              When the DOM drifts, selectors are repaired and the scenario is re-run automatically.
            </p>
            <div className="mt-5 space-y-1.5 rounded-xl border border-white/[0.06] bg-[#05070d] p-3 font-mono text-[9px]">
              <p className="flex items-center gap-2 text-white/40">
                <span className="text-neon-magenta">ERR</span> #login-btn not found
              </p>
              <p className="flex items-center gap-2 text-white/40">
                <span className="text-neon-violet">FIX</span> [data-testid=&quot;sign-in&quot;]
              </p>
              <p className="flex items-center gap-2 text-neon-cyan">
                <span className="h-1 w-1 rounded-full bg-neon-cyan" />
                repaired in 1.8s
              </p>
            </div>
          </CardShell>

          <CardShell delay={0.2}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                05 / Context
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
                ∞
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-white">
              Living test memory
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/45">
              Every failure, repair and trace becomes context for the next run.
            </p>
            <div className="relative mt-4 flex flex-1 items-center justify-center">
              <div className="relative h-24 w-24">
                <span className="absolute inset-0 animate-spin-slow rounded-full border border-neon-cyan/20" />
                <span className="absolute inset-4 rounded-full border border-neon-violet/25" />
                <span className="absolute inset-8 rounded-full border border-neon-magenta/30" />
                <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-ink-800 font-mono text-[8px] tracking-[0.1em] text-white/60">
                  QA
                </span>
                <span className="absolute -right-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
                <span className="absolute bottom-3 left-2 h-1 w-1 rounded-full bg-neon-magenta" />
              </div>
            </div>
          </CardShell>

          <CardShell className="md:col-span-2 lg:col-span-3" delay={0.25}>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-sm">
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                  06 / Integrations
                </span>
                <h3 className="mt-3 text-lg font-medium tracking-[-0.015em] text-white">
                  Plays well with your stack.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                  Native sync with the tools your QA workflow already lives in. No rip and replace.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:max-w-xl md:justify-end">
                {['Playwright', 'Jira', 'GitHub', 'GitLab', 'Slack', 'Vercel', 'Sentry', 'Datadog', 'Linear', 'Notion'].map(
                  (tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45 transition-colors duration-300 hover:border-neon-cyan/30 hover:text-white/75"
                    >
                      {tool}
                    </span>
                  ),
                )}
              </div>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  )
}
