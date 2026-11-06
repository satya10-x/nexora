import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type CounterProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.8,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const write = (current: number) => {
      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`
    }

    write(0)

    if (reduced) {
      write(value)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000))
          const eased = 1 - Math.pow(1 - t, 4)
          write(value * eased)
          if (t < 1) raf = window.requestAnimationFrame(tick)
        }
        raf = window.requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(raf)
    }
  }, [value, decimals, prefix, suffix, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  )
}
