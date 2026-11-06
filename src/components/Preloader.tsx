import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type PreloaderProps = {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const number = numberRef.current
    const bar = barRef.current
    if (!root || !number || !bar) return

    const counter = { value: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      })

      tl.to(counter, {
        value: 100,
        duration: reduced ? 0.35 : 1.55,
        ease: 'power2.inOut',
        onUpdate: () => {
          const value = Math.round(counter.value)
          number.textContent = String(value).padStart(3, '0')
          bar.style.transform = `scaleX(${value / 100})`
        },
      })
      tl.to(root, {
        opacity: 0,
        duration: reduced ? 0.15 : 0.55,
        ease: 'power2.inOut',
      })
    }, root)

    return () => ctx.revert()
  }, [onComplete, reduced])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink-950"
      aria-label="Loading Nexora"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.12),transparent_55%)]" aria-hidden="true" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-8 h-14 w-14">
          <span className="absolute inset-0 animate-spin-slow rounded-full border border-white/10 border-t-neon-cyan/80" />
          <span className="absolute inset-2 animate-spin-slow rounded-full border border-white/10 border-b-neon-violet/80 [animation-direction:reverse]" />
          <span className="absolute inset-[18px] rounded-full bg-neon-cyan shadow-[0_0_24px_4px_rgba(0,240,255,0.55)]" />
        </div>

        <div className="flex items-end gap-1 font-logo text-2xl font-bold tracking-[0.35em] text-white">
          NEXORA
          <span className="mb-1 flex gap-1">
            <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
            <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-violet [animation-delay:120ms]" />
          </span>
        </div>

        <div className="mt-5 flex w-56 items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
          <span>boot</span>
          <span className="relative h-px flex-1 overflow-hidden bg-white/10">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
          <span ref={numberRef} className="w-8 text-right text-white/70">
            000
          </span>
        </div>
      </div>

      <p className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
        Initialising autonomous layer
      </p>
    </div>
  )
}
