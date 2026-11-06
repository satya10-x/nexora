import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from '@/components/SectionHeading'
import { MagneticButton } from '@/components/MagneticButton'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Token = { text: string; className: string }

const SCRIPT: Token[][] = [
  [
    { text: '$', className: 'text-neon-cyan' },
    { text: ' nexora run ', className: 'text-white/85' },
    { text: '--intent', className: 'text-neon-violet' },
    { text: ' "harden auth + add SSO"', className: 'text-neon-cyan/90' },
  ],
  [
    { text: '> ', className: 'text-white/25' },
    { text: 'compiling intent', className: 'text-white/45' },
    { text: ' → ', className: 'text-neon-violet' },
    { text: 'execution_graph[14]', className: 'text-white/80' },
  ],
  [
    { text: '> ', className: 'text-white/25' },
    { text: 'agent.plan', className: 'text-neon-violet' },
    { text: '(auth, sso, tests)', className: 'text-white/50' },
  ],
  [
    { text: '> ', className: 'text-white/25' },
    { text: 'agent.code', className: 'text-neon-violet' },
    { text:('branch: feature/auth-sso'), className: 'text-white/50' },
  ],
  [
    { text: '> ', className: 'text-white/25' },
    { text: 'agent.test', className: 'text-neon-violet' },
    { text: ' · 214 passed · 0 failed', className: 'text-white/50' },
  ],
]

const OUTPUT = [
  'graph compiled — 14 steps',
  'branch feature/auth-sso created',
  '38 files changed · 214 tests passed',
  'PR #4821 opened → 2 reviewers',
  'preview deployed in 42.6s',
]

const BULLETS = [
  {
    title: 'Describe the outcome',
    copy: 'Plain English in. A scoped execution graph out.',
  },
  {
    title: 'Agents execute in parallel',
    copy: 'Plan, code, review and test — all inside your guardrails.',
  },
  {
    title: 'Merge with confidence',
    copy: 'Every action is reversible, audited and human-approvable.',
  },
]

export function LiveDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, rootMargin: '0px 0px -12% 0px' })
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(0)
  const [outputVisible, setOutputVisible] = useState(false)
  const [runId, setRunId] = useState(0)

  const totalChars = SCRIPT.reduce(
    (sum, line) => sum + line.reduce((lineSum, token) => lineSum + token.text.length, 0),
    0,
  )

  useEffect(() => {
    if (!inView) return

    if (reduced) {
      setVisible(totalChars)
      setOutputVisible(true)
      return
    }

    setVisible(0)
    setOutputVisible(false)

    let current = 0
    const interval = window.setInterval(() => {
      current += 2
      if (current >= totalChars) {
        current = totalChars
        window.clearInterval(interval)
      }
      setVisible(current)
    }, 16)

    return () => window.clearInterval(interval)
  }, [inView, reduced, totalChars, runId])

  useEffect(() => {
    if (visible >= totalChars && totalChars > 0) {
      const timer = window.setTimeout(() => setOutputVisible(true), 260)
      return () => window.clearTimeout(timer)
    }
  }, [visible, totalChars])

  let consumed = 0
  let cursorLine = SCRIPT.length - 1
  let cursorFound = false

  const renderedLines = SCRIPT.map((line, lineIndex) => {
    const lineLength = line.reduce((sum, token) => sum + token.text.length, 0)
    const lineStart = consumed
    const lineEnd = consumed + lineLength
    if (!cursorFound && visible <= lineEnd) {
      cursorLine = lineIndex
      cursorFound = true
    }
    consumed = lineEnd

    let remaining = visible - lineStart
    const children = line.map((token, tokenIndex) => {
      if (remaining <= 0) return null
      const slice = token.text.slice(0, remaining)
      remaining -= token.text.length
      return (
        <span key={`${lineIndex}-${tokenIndex}`} className={token.className}>
          {slice}
        </span>
      )
    })

    const showCursor = lineIndex === cursorLine || (visible >= totalChars && lineIndex === SCRIPT.length - 1)

    return (
      <div key={lineIndex} className="flex min-h-[1.6em] gap-3 whitespace-pre-wrap break-words">
        <span className="w-4 shrink-0 select-none text-right text-[9px] text-white/15">
          {String(lineIndex + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0">
          {children}
          {showCursor && (
            <span className="ml-0.5 inline-block h-[1.05em] w-[6px] translate-y-[2px] animate-blink bg-neon-cyan/80 align-middle" />
          )}
        </span>
      </div>
    )
  })

  return (
    <section ref={sectionRef} id="demo" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_40%,rgba(0,240,255,0.08),transparent_65%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              index="03"
              eyebrow="Live runtime"
              title={'Watch a feature\nship itself.'}
              highlight={['ship', 'itself.']}
              description="This is a real run — no mockups. One sentence in, a reviewed pull request and a live preview out."
            />

            <div className="mt-9 space-y-5">
              {BULLETS.map((bullet, index) => (
                <div key={bullet.title} data-reveal className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] font-mono text-[9px] text-neon-cyan/70">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-white/85">{bullet.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/40">{bullet.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton href="#start" size="md">
                Open the playground
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
              <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
                <span>42s median run</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>0 handoffs</span>
              </div>
            </div>
          </div>

          <div data-reveal className="relative lg:col-span-7">
            <div className="pointer-events-none absolute -inset-6 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.10),transparent_65%)] blur-2xl" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#04060b]/95 shadow-glass hud-corners hud-corners-violet">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
                  <span className="h-1 w-1 rounded-full bg-neon-cyan" />
                  nexora://agent-runtime
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVisible(0)
                    setOutputVisible(false)
                    setRunId((id) => id + 1)
                  }}
                  className="rounded-md border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:border-neon-cyan/40 hover:text-white"
                  aria-label="Replay terminal demo"
                >
                  Replay
                </button>
              </div>

              <div className="relative min-h-[310px] px-4 py-5 md:min-h-[360px] md:px-6">
                <div className="pointer-events-none absolute inset-0 cyber-grid-fine opacity-15" aria-hidden="true" />
                <div className="relative space-y-1 font-mono text-[10.5px] leading-relaxed md:text-[12px]">
                  {renderedLines}
                </div>

                <AnimatePresence>
                  {outputVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="relative mt-5 space-y-1.5 border-t border-white/[0.06] pt-4 font-mono text-[10.5px] md:text-[11.5px]"
                      aria-live="polite"
                    >
                      {OUTPUT.map((line, index) => (
                        <div key={line} className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              'mt-[3px] flex h-3 w-3 shrink-0 items-center justify-center rounded-full border',
                              index === OUTPUT.length - 1
                                ? 'border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta'
                                : 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan',
                            )}
                          >
                            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                              <path d="M1.5 4.2 3.1 5.8 6.5 2.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className={index === OUTPUT.length - 1 ? 'text-neon-magenta/80' : 'text-white/45'}>
                            {line}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                        <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
                        awaiting next intent
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.015] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                <span>runtime 2.0.4 / edge</span>
                <span>tokens 18.4k</span>
                <span className="text-neon-cyan/60">secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
