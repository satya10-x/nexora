import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    quote:
      'We deleted our flaky-test quarantine. SentinelQA heals selectors faster than we can file the bug.',
    name: 'Maya Chen',
    role: 'QA Lead',
    company: 'Hyperloom',
    initials: 'MC',
    accent: 'from-neon-cyan/30 to-neon-violet/30',
  },
  {
    quote:
      'Our acceptance criteria now become Playwright specs before standup. The coverage graph finally tells the truth.',
    name: 'Elias Ward',
    role: 'Staff Engineer',
    company: 'Orbital',
    initials: 'EW',
    accent: 'from-neon-violet/30 to-neon-magenta/30',
  },
  {
    quote:
      'The audit trail sold it internally. Every heal is logged, scoped and reversible — zero security drama in six months.',
    name: 'Priya Raman',
    role: 'CISO',
    company: 'Novaforge',
    initials: 'PR',
    accent: 'from-neon-magenta/30 to-neon-cyan/30',
  },
  {
    quote:
      'First week: 63 stories covered, zero flaky reruns. I still do not fully believe the dashboard.',
    name: 'Tomás Ferreira',
    role: 'Platform Lead',
    company: 'Quanta',
    initials: 'TF',
    accent: 'from-neon-cyan/30 to-neon-magenta/30',
  },
  {
    quote:
      'It feels like a QA team that never sleeps, never loses the ticket context and never complains about legacy UI.',
    name: 'Aiko Tanaka',
    role: 'CTO',
    company: 'Spectre',
    initials: 'AT',
    accent: 'from-neon-violet/30 to-neon-cyan/30',
  },
  {
    quote:
      'Traces and video for every run changed how we review. Approvals are a glance now, not a bottleneck.',
    name: 'Noah Berg',
    role: 'Design Engineer',
    company: 'Lumen',
    initials: 'NB',
    accent: 'from-neon-magenta/30 to-neon-violet/30',
  },
]

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const reduced = useReducedMotion()

  const isLarge = useMediaQuery('(min-width: 1024px)')
  const isMedium = useMediaQuery('(min-width: 640px)')
  const visible = isLarge ? 3 : isMedium ? 2 : 1
  const maxIndex = Math.max(0, TESTIMONIALS.length - visible)

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex)
    }
  }, [index, maxIndex])

  const scrollToIndex = useCallback((next: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-card]')
    if (!card) return
    const step = card.offsetWidth + 16
    const clamped = Math.min(TESTIMONIALS.length - 1, Math.max(0, next))
    track.scrollTo({ left: clamped * step, behavior })
    setIndex(clamped)
  }, [])

  useEffect(() => {
    if (paused || dragging || reduced) return
    const timer = window.setInterval(() => {
      const next = indexRef.current >= maxIndex ? 0 : indexRef.current + 1
      scrollToIndex(next)
    }, 4800)
    return () => window.clearInterval(timer)
  }, [paused, dragging, reduced, maxIndex, scrollToIndex])

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-card]')
    if (!card) return
    const step = card.offsetWidth + 16
    const next = Math.round(track.scrollLeft / step)
    const clamped = Math.max(0, Math.min(maxIndex, next))
    if (clamped !== indexRef.current) setIndex(clamped)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget
    drag.current = { active: true, startX: event.clientX, startScroll: track.scrollLeft }
    setDragging(true)
    track.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const dx = event.clientX - drag.current.startX
    event.currentTarget.scrollLeft = drag.current.startScroll - dx
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const track = event.currentTarget
    const card = track.querySelector<HTMLElement>('[data-card]')
    if (!card) return
    const step = card.offsetWidth + 16
    scrollToIndex(Math.round(track.scrollLeft / step))
  }

  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_40%,rgba(0,240,255,0.07),transparent_65%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="04"
            eyebrow="Field notes"
            title="QA teams that stopped firefighting."
            highlight={['stopped']}
            description="QA leads, platform engineers and security teams shipping with self-healing tests every day."
          />

          <div data-reveal className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(index <= 0 ? maxIndex : index - 1)}
              aria-label="Previous testimonials"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/50 transition-all duration-300 hover:border-neon-cyan/40 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12 7H3M6 3.5 2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(index >= maxIndex ? 0 : index + 1)}
              aria-label="Next testimonials"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/50 transition-all duration-300 hover:border-neon-cyan/40 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          data-cursor="hover"
          onScroll={handleScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            'scrollbar-none mt-12 flex snap-x gap-4 overflow-x-auto pb-2',
            dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
          )}
          style={{ scrollSnapType: dragging ? 'none' : 'x mandatory' }}
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              data-card
              className="w-[86%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
            >
              <div
                data-reveal
                className="group flex h-full min-h-[280px] flex-col rounded-3xl card-surface p-6 hud-corners transition-colors duration-500 hover:bg-white/[0.045] md:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-neon-cyan/80" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <svg key={star} width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                          d="M6 1.2 7.4 4l3.1.45-2.25 2.2.53 3.1L6 8.3 3.22 9.75l.53-3.1L1.5 4.45 4.6 4 6 1.2Z"
                          fill="currentColor"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                    NXR / 0{TESTIMONIALS.indexOf(testimonial) + 1}
                  </span>
                </div>

                <blockquote className="mt-5 flex-1 text-[14px] leading-relaxed text-white/60">
                  “{testimonial.quote}”
                </blockquote>

                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br font-mono text-[10px] text-white/80 ring-1 ring-white/10',
                      testimonial.accent,
                    )}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white/85">{testimonial.name}</p>
                    <p className="truncate font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Testimonial pages">
            {Array.from({ length: maxIndex + 1 }).map((_, dot) => (
              <button
                key={dot}
                type="button"
                role="tab"
                aria-selected={index === dot}
                aria-label={`Go to testimonial page ${dot + 1}`}
                onClick={() => scrollToIndex(dot)}
                className={cn(
                  'h-1 rounded-full transition-all duration-400',
                  index === dot ? 'w-6 bg-neon-cyan' : 'w-1.5 bg-white/20 hover:bg-white/40',
                )}
              />
            ))}
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/20">
            Drag or hover to pause
          </span>
        </div>
      </div>
    </section>
  )
}
