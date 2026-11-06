import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MagneticButton } from './MagneticButton'
import { getLenis, scrollToSelector } from '@/hooks/useLenis'
import { cn } from '@/lib/utils'

const LINKS = [
  { label: 'Capabilities', target: '#features' },
  { label: 'Pipeline', target: '#process' },
  { label: 'Runtime', target: '#demo' },
  { label: 'Pricing', target: '#pricing' },
  { label: 'FAQ', target: '#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open])

  const go = (target: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToSelector(target), open ? 140 : 0)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[90] transition-all duration-500',
          scrolled
            ? 'border-b border-white/[0.07] bg-ink/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-8">
          <button
            type="button"
            onClick={() => go('#hero')}
            className="group flex items-center gap-3"
            aria-label="SentinelQA home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rotate-45 rounded-[7px] border border-neon-cyan/30 bg-neon-cyan/[0.05] transition-colors duration-300 group-hover:border-neon-cyan/60" />
              <svg
                className="relative h-3.5 w-3.5 text-neon-cyan"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 2.5 20 6v6.2c0 4.9-3.2 8.2-8 9.8-4.8-1.6-8-4.9-8-9.8V6l8-3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m8.4 12.1 2.4 2.4 4.8-4.9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-logo text-[11px] font-bold tracking-[0.26em] text-white md:text-[12px]">
                SENTINELQA
              </span>
              <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.3em] text-white/35">
                by Nexora
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => go(link.target)}
                className="group relative py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-neon-cyan to-neon-violet transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MagneticButton
              href="/login"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              strength={0.2}
            >
              Sign in
            </MagneticButton>
            <MagneticButton
              href="/signup"
              size="sm"
              className="hidden md:inline-flex"
              strength={0.2}
            >
              Get started
            </MagneticButton>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              data-cursor="hover"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-white/25 hover:text-white lg:hidden"
            >
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span
                  className={cn(
                    'h-px w-full bg-current transition-transform duration-300',
                    open && 'translate-y-[5.5px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'h-px w-full bg-current transition-opacity duration-300',
                    open && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'h-px w-full bg-current transition-transform duration-300',
                    open && '-translate-y-[5.5px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[89] flex flex-col bg-[#04050a]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,240,255,0.10),transparent_55%)]" aria-hidden="true" />

            <div className="relative flex flex-1 flex-col justify-center px-6 pt-24">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
                Navigation
              </p>
              <nav className="mt-6 flex flex-col" aria-label="Mobile">
                {LINKS.map((link, index) => (
                  <motion.button
                    key={link.label}
                    type="button"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => go(link.target)}
                    className="group flex items-center justify-between border-b border-white/[0.07] py-4 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[9px] tracking-[0.18em] text-neon-cyan/50">
                        0{index + 1}
                      </span>
                      <span className="text-2xl font-medium tracking-[-0.02em] text-white/80 transition-colors group-hover:text-white">
                        {link.label}
                      </span>
                    </span>
                    <span className="text-white/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/70">
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </motion.button>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 flex flex-col gap-3"
              >
                <MagneticButton href="/signup" size="lg" className="w-full" onClick={() => setOpen(false)}>
                  Get started
                </MagneticButton>
                <MagneticButton
                  href="#demo"
                  variant="ghost"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  See it in action
                </MagneticButton>
              </motion.div>
            </div>

            <div className="relative flex items-center justify-between border-t border-white/[0.07] px-6 py-5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
              <span>SentinelQA / v0.3</span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#28c840]" />
                Systems nominal
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
