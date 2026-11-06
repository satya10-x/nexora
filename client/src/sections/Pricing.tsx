import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from '@/components/SectionHeading'
import { MagneticButton } from '@/components/MagneticButton'
import { cn } from '@/lib/utils'

type Plan = {
  name: string
  tagline: string
  monthly: number
  yearly: number
  cta: string
  popular?: boolean
  features: string[]
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    tagline: 'For solo builders and side projects.',
    monthly: 0,
    yearly: 0,
    cta: 'Start free',
    features: [
      '1 project',
      '100 test runs / month',
      'Jira + Playwright sync',
      'Generated test specs',
      '7-day run history',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For product teams shipping every day.',
    monthly: 49,
    yearly: 39,
    cta: 'Start 14-day trial',
    popular: true,
    features: [
      '10 projects',
      '5,000 runs / month',
      'Groq test synthesis',
      'Self-healing locators',
      'Trace + video artifacts',
      '90-day run history',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    tagline: 'For platform orgs with real constraints.',
    monthly: 199,
    yearly: 159,
    cta: 'Talk to sales',
    features: [
      'Unlimited projects',
      '100k runs / month',
      'SSO / SCIM + RBAC',
      'Self-hosted runner',
      'Custom quality gates',
      '99.99% uptime SLA',
      'Dedicated QA engineer',
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_10%,rgba(139,92,246,0.1),transparent_65%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            index="05"
            eyebrow="Access"
            title="Pricing that scales with coverage."
            highlight={['coverage.']}
            description="No seat tax. No surprise overages. Start free, upgrade when self-healing is carrying real regressions."
            align="center"
          />

          <div data-reveal className="mt-9 flex items-center gap-4">
            <div className="relative flex rounded-full border border-white/10 bg-white/[0.025] p-1 backdrop-blur-md">
              {[
                { label: 'Monthly', value: false },
                { label: 'Yearly', value: true },
              ].map((option) => {
                const selected = annual === option.value
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setAnnual(option.value)}
                    aria-pressed={selected}
                    className={cn(
                      'relative rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300',
                      selected ? 'text-ink' : 'text-white/45 hover:text-white/75',
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="billing-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{option.label}</span>
                  </button>
                )
              })}
            </div>
            <span className="rounded-full border border-neon-cyan/25 bg-neon-cyan/[0.06] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-neon-cyan/80">
              Save 20%
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan, planIndex) => {
            const price = annual ? plan.yearly : plan.monthly
            return (
              <div
                key={plan.name}
                data-reveal
                data-reveal-delay={planIndex * 0.07}
                className={cn(
                  'relative',
                  plan.popular
                    ? 'animated-border rounded-3xl p-px shadow-[0_0_70px_-24px_rgba(139,92,246,0.65)] lg:-my-3'
                    : '',
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/20 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta px-3 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-ink">
                    Most popular
                  </div>
                )}

                <div
                  className={cn(
                    'relative flex h-full flex-col overflow-hidden p-6 md:p-7',
                    plan.popular
                      ? 'rounded-[23px] bg-[#070910] lg:py-10'
                      : 'rounded-3xl card-surface hud-corners',
                  )}
                >
                  {plan.popular && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.12),transparent_70%)]" aria-hidden="true" />
                  )}

                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
                        {plan.name}
                      </p>
                      <p className="mt-2 text-[13px] text-white/45">{plan.tagline}</p>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                      0{planIndex + 1}
                    </span>
                  </div>

                  <div className="relative mt-7 flex items-end gap-1.5">
                    <span className="mb-2 font-mono text-sm text-white/40">$</span>
                    <span className="relative flex h-[52px] items-end overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={`${plan.name}-${price}`}
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -30, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="font-logo text-5xl font-bold leading-none tracking-[-0.04em] text-white"
                        >
                          {price}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                      /mo
                    </span>
                  </div>
                  <p className="mt-2 h-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                    {price === 0
                      ? 'free forever'
                      : annual
                        ? `billed annually · $${price * 12}/yr`
                        : 'billed monthly'}
                  </p>

                  <div className="my-6 h-px w-full bg-white/[0.07]" />

                  <ul className="relative flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[13px] text-white/55">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neon-cyan/25 bg-neon-cyan/[0.06] text-neon-cyan">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                            <path d="M1.5 4.2 3.1 5.8 6.5 2.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    href={plan.name === 'Scale' ? 'mailto:hello@sentinelqa.dev' : '/login'}
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="md"
                    className="mt-8 w-full"
                    ariaLabel={`${plan.cta} — ${plan.name} plan`}
                  >
                    {plan.cta}
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </MagneticButton>
                </div>
              </div>
            )
          })}
        </div>

        <div data-reveal className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-md md:flex-row md:px-8">
          <div>
            <p className="text-sm font-medium text-white/80">
              Need on-prem, custom runners, or 500+ seats?
            </p>
            <p className="mt-1 text-[13px] text-white/40">
              Our QA platform team will design the deployment with you.
            </p>
          </div>
          <MagneticButton href="mailto:hello@sentinelqa.dev" variant="ghost" size="md">
            Book a strategy call
          </MagneticButton>
        </div>

        <p className="mt-6 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-white/20">
          All plans include SOC 2 Type II, encryption at rest, and zero training on your tests.
        </p>
      </div>
    </section>
  )
}
