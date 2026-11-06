import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { AudioToggle } from '@/components/AudioToggle'
import { GlitchText } from '@/components/GlitchText'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { audioEngine } from '@/lib/audioEngine'
import { introState, resetIntroState } from './introState'

const IntroCanvas = lazy(() =>
  import('@/three/IntroCanvas').then((module) => ({ default: module.IntroCanvas })),
)

type CinematicIntroProps = {
  onComplete: () => void
}

const BOOT_LINES = [
  { text: 'INITIALIZING SENTINELQA CORE...', start: 0, end: 16, ok: false },
  { text: 'CONNECTING JIRA WORKSPACE', start: 16, end: 33, ok: true },
  { text: 'LOADING PLAYWRIGHT RUNTIME', start: 33, end: 50, ok: true },
  { text: 'MOUNTING SELF-HEALING ENGINE', start: 50, end: 67, ok: true },
  { text: 'SYNCING ACCEPTANCE CRITERIA', start: 67, end: 84, ok: true },
  { text: 'QA CORE ONLINE', start: 84, end: 100, ok: false },
]

const ACT_LINES = [
  { text: 'THE FUTURE OF QA', className: 'text-white' },
  {
    text: 'IS NOT MANUAL.',
    className: 'text-outline',
  },
  {
    text: "IT'S SELF-HEALING.",
    className: 'text-gradient',
  },
]

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bootRef = useRef<HTMLDivElement>(null)
  const percentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const topBarRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const actTextRef = useRef<HTMLDivElement>(null)
  const coreLabelRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([])
  const bootLineRefs = useRef<Array<HTMLSpanElement | null>>([])
  const bootOkRefs = useRef<Array<HTMLSpanElement | null>>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const finishedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const [glitching, setGlitching] = useState(false)

  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    timelineRef.current?.kill()
    timelineRef.current = null
    setGlitching(false)
    onCompleteRef.current()
  }, [])

  const skip = useCallback(() => {
    if (finishedRef.current) return
    timelineRef.current?.kill()
    timelineRef.current = null
    setGlitching(false)
    resetIntroState()
    audioEngine.playWhoosh(0.6)
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: finish,
    })
  }, [finish])

  useEffect(() => {
    if (!reduced) return
    const timer = window.setTimeout(() => finish(), 2600)
    return () => window.clearTimeout(timer)
  }, [reduced, finish])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [skip])

  useEffect(() => {
    if (reduced) return

    const root = rootRef.current
    const boot = bootRef.current
    const percent = percentRef.current
    const progress = progressRef.current
    const topBar = topBarRef.current
    const bottomBar = bottomBarRef.current
    const actText = actTextRef.current
    const coreLabel = coreLabelRef.current
    const logo = logoRef.current
    const flash = flashRef.current
    if (!root || !boot || !percent || !progress || !topBar || !bottomBar || !actText || !coreLabel || !logo || !flash) {
      return
    }

    resetIntroState()
    finishedRef.current = false
    setGlitching(false)

    const renderBoot = (value: number) => {
      percent.textContent = `${String(Math.round(value)).padStart(3, '0')}%`
      progress.style.transform = `scaleX(${value / 100})`

      BOOT_LINES.forEach((line, index) => {
        const textEl = bootLineRefs.current[index]
        if (!textEl) return
        const local = Math.min(1, Math.max(0, (value - line.start) / (line.end - line.start)))
        textEl.textContent = line.text.slice(0, Math.floor(local * line.text.length))
        const okEl = bootOkRefs.current[index]
        if (okEl) okEl.style.opacity = local >= 1 ? '1' : '0'
      })
    }

    const setStatus = (text: string) => {
      if (!statusRef.current) return
      statusRef.current.textContent = text
      gsap.fromTo(
        statusRef.current,
        { color: '#00f0ff', opacity: 1 },
        { color: 'rgba(255,255,255,0.45)', duration: 1.4, ease: 'power2.out' },
      )
    }

    const ctx = gsap.context(() => {
      renderBoot(0)
      gsap.set(lineRefs.current.filter(Boolean), { yPercent: 118, opacity: 0 })
      gsap.set(coreLabel, { opacity: 0, y: 12 })
      gsap.set(logo, { opacity: 0, scale: 1.18, filter: 'blur(18px)' })

      const bootCounter = { value: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onComplete: finish,
      })
      timelineRef.current = tl

      // ── ACT I — BOOT ────────────────────────────────────────────────
      tl.call(
        () => {
          introState.act = 1
          audioEngine.playBoot()
        },
        undefined,
        0,
      )
      tl.to(introState, { starOpacity: 0.48, duration: 2.0, ease: 'power2.out' }, 0.4)
      tl.to(
        bootCounter,
        {
          value: 100,
          duration: 5.0,
          ease: 'power1.inOut',
          onUpdate: () => renderBoot(bootCounter.value),
        },
        0,
      )
      tl.to(boot, { opacity: 0, y: 28, duration: 0.8, ease: 'power2.in' }, 4.6)

      // ── ACT II — DATA TUNNEL ────────────────────────────────────────
      tl.call(
        () => {
          introState.act = 2
          setStatus('ACT II // TRANSIT')
          audioEngine.playWhoosh(2.4)
        },
        undefined,
        5.15,
      )
      tl.to(introState, { speed: 2.6, duration: 6.6, ease: 'power2.in' }, 5.15)
      tl.to(introState, { warp: 1, duration: 6.6, ease: 'power2.in' }, 5.15)
      tl.to(introState, { starOpacity: 1, tunnelOpacity: 1, duration: 2.8, ease: 'power2.out' }, 5.15)
      tl.to(introState, { speed: 0.55, warp: 0.22, duration: 2.2, ease: 'power2.inOut' }, 11.4)
      tl.call(() => setStatus('ACT III // TRANSMISSION'), undefined, 11.6)

      // ── ACT III — CINEMATIC TEXT ────────────────────────────────────
      tl.to([topBar, bottomBar], { height: '12vh', duration: 1.2, ease: 'power3.inOut' }, 11.8)
      tl.call(() => audioEngine.playPulse(660), undefined, 12.15)

      const revealLine = (index: number, start: number, exit: number) => {
        const el = lineRefs.current[index]
        if (!el) return
        tl.to(
          el,
          { yPercent: 0, opacity: 1, duration: 0.95, ease: 'power3.out' },
          start,
        )
        tl.to(
          el,
          { yPercent: -112, opacity: 0, duration: 0.7, ease: 'power2.in' },
          exit,
        )
        tl.call(() => audioEngine.playPulse(520 + index * 140), undefined, start)
      }

      revealLine(0, 12.2, 15.1)
      revealLine(1, 15.35, 18.2)
      revealLine(2, 18.45, 21.0)
      tl.to(actText, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 21.0)

      // ── ACT IV — CORE IGNITION ──────────────────────────────────────
      tl.call(
        () => {
          introState.act = 4
          setStatus('ACT IV // CORE')
          audioEngine.playPulse(440)
        },
        undefined,
        21.3,
      )
      tl.to(
        introState,
        { core: 1, energy: 0.95, duration: 4.6, ease: 'power3.out' },
        21.3,
      )
      tl.fromTo(
        coreLabel,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        22.1,
      )
      tl.to(coreLabel, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 25.5)
      tl.to(introState, { shake: 0.9, duration: 1.7, ease: 'power2.in' }, 23.8)
      tl.to(introState, { shake: 0, duration: 0.35 }, 25.65)

      // flash frame + glitch spike
      tl.to(introState, { flash: 1, duration: 0.13, ease: 'power4.in' }, 26.05)
      tl.to(flash, { opacity: 1, duration: 0.11, ease: 'power4.in' }, 26.05)
      tl.call(
        () => {
          setGlitching(true)
          audioEngine.playImpact()
        },
        undefined,
        26.1,
      )
      tl.to(introState, { flash: 0, duration: 1.1, ease: 'power2.out' }, 26.28)
      tl.to(flash, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 26.3)
      tl.call(() => setGlitching(false), undefined, 26.95)

      // ── ACT V — EXPLOSION & LOGO ────────────────────────────────────
      tl.call(
        () => {
          introState.act = 5
          setStatus('ACT V // IGNITION')
          audioEngine.playWhoosh(2.6)
        },
        undefined,
        27.0,
      )
      tl.to(introState, { shock: 1, duration: 2.5, ease: 'power2.out' }, 27.0)
      tl.to(introState, { pull: 1, duration: 3.2, ease: 'power2.inOut' }, 27.0)
      tl.to(introState, { speed: 0.32, warp: 0.05, duration: 2.6, ease: 'power2.out' }, 27.1)
      tl.to(introState, { starOpacity: 0.6, duration: 2.6, ease: 'power2.out' }, 27.1)
      tl.to([topBar, bottomBar], { height: '0vh', duration: 1.9, ease: 'power3.inOut' }, 27.1)

      tl.to(
        logo,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.35,
          ease: 'power3.out',
        },
        27.35,
      )
      tl.to(logo, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 31.15)
      tl.to(root, { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 31.1)
    }, root)

    return () => {
      ctx.revert()
      timelineRef.current = null
      resetIntroState()
    }
  }, [reduced, finish])

  if (reduced) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center">
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.14),transparent_60%)]" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/70">
          SentinelQA // Cinematic intro
        </p>
        <div className="mt-6 font-logo text-[clamp(1.8rem,8vw,6rem)] font-black tracking-[0.08em]">
          <GlitchText text="SENTINELQA" className="text-gradient" />
        </div>
        <p className="mt-5 max-w-sm text-sm text-white/50">
          Motion is reduced on this device. The full experience is still available below.
        </p>
        <button
          type="button"
          onClick={finish}
          className="mt-8 rounded-full border border-neon-cyan/40 bg-white/[0.04] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white transition-colors hover:border-neon-cyan hover:bg-neon-cyan/10"
        >
          Enter SentinelQA
        </button>
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#030409]"
      aria-label="SentinelQA cinematic introduction"
    >
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <IntroCanvas mobile={mobile} glitching={glitching} />
        </Suspense>
      </div>

      {/* film grain + scanlines + vignette */}
      <div className="grain" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-20 blur-[0.1px]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_3px)] opacity-60 mix-blend-overlay"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.72)_100%)]"
        aria-hidden="true"
      />

      {/* letterbox */}
      <div
        ref={topBarRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0 bg-black"
        aria-hidden="true"
      />
      <div
        ref={bottomBarRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-0 bg-black"
        aria-hidden="true"
      />

      {/* HUD top */}
      <div className="absolute inset-x-0 top-0 z-[60] flex items-start justify-between p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
          </span>
          <span className="font-logo text-[11px] font-bold tracking-[0.3em] text-white">
            SENTINELQA
          </span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 md:inline">
            Cinematic sequence / 001
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AudioToggle />
          <button
            type="button"
            onClick={skip}
            data-cursor="hover"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-md transition-colors duration-300 hover:border-white/30 hover:text-white"
          >
            Skip intro
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* HUD bottom status */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[60] flex items-end justify-between px-5 font-mono text-[9px] uppercase tracking-[0.3em] text-white/35 md:px-8">
        <span ref={statusRef} className="text-white/45">
          ACT I // BOOT
        </span>
        <span className="hidden md:inline">REEL_001 // 00:32 // 24FPS</span>
      </div>

      {/* ACT I — boot terminal */}
      <div
        ref={bootRef}
        className="pointer-events-none absolute bottom-20 left-5 right-5 z-40 md:left-10 md:right-auto md:w-[440px]"
      >
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-white/35">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
            SentinelQA core boot
          </span>
          <span className="text-white/25">SYS.01</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-6">
          <div className="space-y-1.5 font-mono text-[10px] leading-relaxed text-white/55 md:text-[11px]">
            {BOOT_LINES.map((line, index) => (
              <div key={line.text} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-neon-cyan/70">&gt;</span>
                <span
                  ref={(el) => {
                    bootLineRefs.current[index] = el
                  }}
                />
                {line.ok && (
                  <span
                    ref={(el) => {
                      bootOkRefs.current[index] = el
                    }}
                    className="ml-1 text-[8px] tracking-[0.2em] text-neon-cyan/70 opacity-0 transition-opacity duration-300"
                  >
                    [OK]
                  </span>
                )}
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-white/60">
              <span className="text-neon-cyan/70">&gt;</span>
              <span className="inline-block h-3 w-[7px] animate-blink bg-neon-cyan/80" />
            </div>
          </div>

          <div
            ref={percentRef}
            className="shrink-0 font-logo text-3xl font-bold tracking-tight text-white/85 md:text-4xl"
          >
            000%
          </div>
        </div>

        <div className="mt-4 h-px w-full overflow-hidden bg-white/10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* ACT III — cinematic text */}
      <div
        ref={actTextRef}
        className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-4 font-mono text-[8px] uppercase tracking-[0.45em] text-neon-cyan/70 md:mb-8 md:text-[10px]">
          Transmission_003 // Autonomy protocol
        </div>
        <div className="relative h-[clamp(9rem,26vw,19rem)] w-full max-w-6xl">
          {ACT_LINES.map((line, index) => (
            <div
              key={line.text}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="split-line">
                <span
                  ref={(el) => {
                    lineRefs.current[index] = el
                  }}
                  className={`split-inner font-display text-[clamp(2.4rem,8vw,7.4rem)] font-medium uppercase leading-[0.92] tracking-[-0.045em] ${line.className}`}
                  style={{ opacity: 0 }}
                >
                  {line.text}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ACT IV — core label */}
      <div
        ref={coreLabelRef}
        className="pointer-events-none absolute inset-x-0 top-[15%] z-40 flex flex-col items-center gap-3 text-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/55 md:text-[10px]">
          <span className="text-neon-cyan">CORE</span> SYNCHRONIZED
        </span>
        <span className="h-px w-24 bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent" />
        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/30 md:text-[9px]">
          Energy 100% // Lattice stable
        </span>
      </div>

      {/* ACT V — logo */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.16),transparent_58%)]" aria-hidden="true" />
        <div className="relative font-logo text-[clamp(1.8rem,9vw,7.5rem)] font-black leading-none tracking-[0.08em]">
          <GlitchText text="SENTINELQA" className="text-gradient" />
        </div>
        <div className="mt-4 flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.42em] text-white/45 md:text-[10px]">
          <span className="h-px w-8 bg-neon-cyan/50" />
          Autonomous QA engine
          <span className="h-px w-8 bg-neon-magenta/50" />
        </div>
      </div>

      {/* impact flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-[55] bg-white opacity-0"
        aria-hidden="true"
      />
    </div>
  )
}
