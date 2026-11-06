import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from '@/components/SectionHeading'
import { cn } from '@/lib/utils'

const ITEMS = [
  {
    question: 'How is Nexora different from a coding copilot?',
    answer:
      'A copilot helps you type. Nexora owns the delivery loop: it compiles intent into a plan, coordinates specialised agents, writes and tests code, opens the PR, deploys a preview, and records what it learned. You supervise outcomes, not keystrokes.',
  },
  {
    question: 'Can agents touch production?',
    answer:
      'Only within the guardrails you define. Every action runs with scoped, short-lived credentials. Destructive operations, schema changes and production deploys can require explicit human approval. Every run is fully auditable and reversible.',
  },
  {
    question: 'What does the first week look like?',
    answer:
      'Day one: connect GitHub, Linear and your docs. Day two: Nexora indexes context and opens its first low-risk PRs. Day three to seven: you tune guardrails and approval policies while the agent mesh takes on larger scoped tickets. Most teams see meaningful output within 72 hours.',
  },
  {
    question: 'Which languages and stacks are supported?',
    answer:
      'TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin and Swift are first-class. Nexora works with any repo, container or CI provider. It respects your existing linting, test and review conventions instead of inventing new ones.',
  },
  {
    question: 'What happens when usage spikes?',
    answer:
      'Nothing breaks and nothing surprises you. Pro plans include a generous monthly pool; when you exceed it, additional runs are billed transparently at $0.02 each. Scale plans include fair-use unlimited runs with a soft concurrency cap you control.',
  },
  {
    question: 'Is my code used to train models?',
    answer:
      'No. Your code, context and prompts are never used to train shared models. Data is encrypted in transit and at rest, isolated per workspace, and deletable on demand. Enterprise customers can run the entire agent runtime inside their own VPC.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_45%_at_15%_50%,rgba(255,43,214,0.06),transparent_65%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              index="06"
              eyebrow="Answers"
              title={'Questions,\nanswered.'}
              highlight={['answered.']}
              description="The honest version, including the parts about guardrails and governance."
            />

            <div data-reveal className="mt-9 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
                <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
                Humans online
              </div>
              <p className="mt-3 text-sm text-white/65">Still have questions?</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/35">
                Talk to a solutions engineer — not a chatbot.
              </p>
              <a
                href="mailto:hello@nexora.ai"
                className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-neon-cyan/80 transition-colors hover:text-neon-cyan"
              >
                hello@nexora.ai
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {ITEMS.map((item, index) => {
                const isOpen = open === index
                return (
                  <div key={item.question} data-reveal data-reveal-delay={index * 0.04}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-trigger-${index}`}
                      data-cursor="hover"
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <div className="flex items-start gap-4 md:gap-6">
                        <span
                          className={cn(
                            'mt-1 font-mono text-[9px] tracking-[0.18em] transition-colors duration-300',
                            isOpen ? 'text-neon-cyan' : 'text-white/20',
                          )}
                        >
                          0{index + 1}
                        </span>
                        <span
                          className={cn(
                            'text-[15px] font-medium leading-snug tracking-[-0.01em] transition-colors duration-300 md:text-lg',
                            isOpen ? 'text-white' : 'text-white/60 group-hover:text-white/85',
                          )}
                        >
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={cn(
                          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                          isOpen
                            ? 'rotate-45 border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan'
                            : 'border-white/10 text-white/35 group-hover:border-white/25 group-hover:text-white/70',
                        )}
                        aria-hidden="true"
                      >
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pl-8 pr-10 text-[14px] leading-relaxed text-white/45 md:pl-10">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
