import { cn } from '@/lib/utils'

type GlitchTextProps = {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <span
      className={cn('glitch', className)}
      data-text={text}
      aria-label={text}
      role="text"
    >
      <span aria-hidden="true" className="relative z-[1]">
        {text}
      </span>
    </span>
  )
}
