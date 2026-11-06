import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MarqueeProps = {
  children: ReactNode
  className?: string
  reverse?: boolean
}

export function Marquee({ children, className, reverse = false }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group relative flex w-full overflow-hidden mask-fade-x',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max shrink-0 items-center group-hover:[animation-play-state:paused]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
      >
        <div className="flex shrink-0 items-center gap-14 pr-14">{children}</div>
        <div className="flex shrink-0 items-center gap-14 pr-14" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
