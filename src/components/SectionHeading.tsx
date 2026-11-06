import { cn } from '@/lib/utils'
import { SplitWords } from './AnimatedText'

type SectionHeadingProps = {
  index: string
  eyebrow: string
  title: string
  highlight?: string[]
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div
        data-reveal
        className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45"
      >
        <span className="text-neon-cyan">{index}</span>
        <span className="h-px w-8 bg-gradient-to-r from-neon-cyan/70 to-transparent" />
        <span>{eyebrow}</span>
      </div>

      <SplitWords
        as="h2"
        text={title}
        highlight={highlight}
        className={cn(
          'mt-6 max-w-4xl text-balance text-[clamp(2.2rem,5.4vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white',
          align === 'center' && 'mx-auto',
        )}
      />

      {description && (
        <p
          data-reveal
          className={cn(
            'mt-6 max-w-xl text-[15px] leading-relaxed text-white/50',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
