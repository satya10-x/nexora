import {
  motion,
  useMotionValue,
  useSpring,
  type MotionStyle,
} from 'framer-motion'
import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { scrollToSelector } from '@/hooks/useLenis'

type ButtonVariant = 'primary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  strength?: number
  ariaLabel?: string
  type?: 'button' | 'submit'
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'text-[#04060b] bg-[linear-gradient(110deg,#9af9ff_0%,#00f0ff_32%,#7b5cff_68%,#ff2bd6_100%)] shadow-[0_0_38px_-10px_rgba(0,240,255,0.75)] hover:shadow-[0_0_52px_-8px_rgba(139,92,246,0.8)]',
  ghost:
    'text-white glass hover:border-neon-cyan/40 hover:bg-white/[0.07] hover:shadow-[0_0_34px_-14px_rgba(0,240,255,0.7)]',
  outline:
    'text-white border border-white/15 bg-white/[0.015] hover:border-neon-cyan/50 hover:bg-neon-cyan/[0.05] hover:shadow-[0_0_34px_-16px_rgba(0,240,255,0.8)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[11px] gap-1.5',
  md: 'px-5 py-2.5 text-[12px] gap-2',
  lg: 'px-7 py-3.5 text-[13px] gap-2.5',
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  strength = 0.28,
  ariaLabel,
  type = 'button',
}: MagneticButtonProps) {
  const rangeRef = useRef<DOMRect | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.35 })
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.35 })

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    rangeRef.current = rect
    const offsetX = (event.clientX - rect.left - rect.width / 2) * strength
    const offsetY = (event.clientY - rect.top - rect.height / 2) * strength
    mx.set(Math.max(-14, Math.min(14, offsetX)))
    my.set(Math.max(-10, Math.min(10, offsetY)))
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event)
    if (href?.startsWith('#')) {
      event.preventDefault()
      scrollToSelector(href)
    }
  }

  const style: MotionStyle = { x, y }
  const shared = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick: handleClick,
    whileTap: { scale: 0.97 },
    style,
    'data-cursor': 'hover',
    className: cn(
      'group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[0.01em] transition-colors duration-300',
      variants[variant],
      sizes[size],
      className,
    ),
  }

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.35),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </>
  )

  if (href) {
    return (
      <motion.a
        {...shared}
        href={href}
        aria-label={ariaLabel}
        className={shared.className}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button
      {...shared}
      type={type}
      aria-label={ariaLabel}
      className={shared.className}
    >
      {inner}
    </motion.button>
  )
}
