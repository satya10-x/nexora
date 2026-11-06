import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type TiltCardProps = {
  children: ReactNode
  className?: string
  spotColor?: string
  tilt?: number
}

export function TiltCard({
  children,
  className,
  spotColor = 'rgba(0, 240, 255, 0.13)',
  tilt = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    el.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * tilt}deg) rotateY(${(px - 0.5) * tilt}deg)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        'group relative h-full [transform-style:preserve-3d] transition-transform duration-500 ease-out will-change-transform',
        className,
      )}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${spotColor}, transparent 62%)`,
        }}
      />
    </div>
  )
}
