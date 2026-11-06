import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

type SplitWordsProps = {
  text: string
  className?: string
  as?: Tag
  highlight?: string[]
  play?: boolean
  delay?: number
  stagger?: number
}

/**
 * Manual SplitText: each word gets its own mask + transform layer.
 * No GSAP Club plugins required.
 */
export function SplitWords({
  text,
  className,
  as = 'p',
  highlight = [],
  play = true,
  delay = 0,
  stagger = 0.035,
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const Tag = as

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const inners = root.querySelectorAll<HTMLElement>('.word-inner')

    if (reduced) {
      gsap.set(inners, { yPercent: 0, opacity: 1, rotateX: 0 })
      return
    }

    if (!play) {
      gsap.set(inners, { yPercent: 112, opacity: 0, rotateX: -35 })
      return
    }

    const tween = gsap.fromTo(
      inners,
      { yPercent: 112, opacity: 0, rotateX: -35 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.05,
        ease: 'power4.out',
        stagger,
        delay,
      },
    )

    return () => {
      tween.kill()
    }
  }, [play, delay, stagger, reduced, text])

  const highlightSet = new Set(highlight.map((word) => word.toLowerCase()))
  const lines = text.split('\n')

  return (
    <Tag ref={ref as never} className={cn(className)} aria-label={text}>
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="block" aria-hidden="true">
          {line.split(' ').map((word, wordIndex) => {
            const clean = word.replace(/[^\w'-]/g, '').toLowerCase()
            const isHighlighted = highlightSet.has(clean)
            return (
              <span
                key={`${word}-${wordIndex}`}
                className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]"
              >
                <span
                  className={cn(
                    'word-inner inline-block will-change-transform',
                    isHighlighted && 'text-gradient-soft',
                  )}
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word}
                  {wordIndex < line.split(' ').length - 1 ? '\u00A0' : ''}
                </span>
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

type LineItem = {
  text: string
  className?: string
}

type LineRevealProps = {
  lines: LineItem[]
  className?: string
  lineClassName?: string
  play?: boolean
  delay?: number
  stagger?: number
  as?: Tag
}

/** Cinematic line-by-line mask reveal for oversized display type. */
export function LineReveal({
  lines,
  className,
  lineClassName,
  play = true,
  delay = 0,
  stagger = 0.12,
  as = 'h1',
}: LineRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const Tag = as

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const inners = root.querySelectorAll<HTMLElement>('.split-inner')

    if (reduced) {
      gsap.set(inners, { yPercent: 0, opacity: 1, rotateX: 0 })
      return
    }

    if (!play) {
      gsap.set(inners, { yPercent: 118, opacity: 0, rotateX: 24 })
      return
    }

    const tween = gsap.fromTo(
      inners,
      { yPercent: 118, opacity: 0, rotateX: 24 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.25,
        ease: 'power4.out',
        stagger,
        delay,
      },
    )

    return () => {
      tween.kill()
    }
  }, [play, delay, stagger, reduced, lines])

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {lines.map((line, index) => (
        <span key={`${line.text}-${index}`} className={cn('split-line', lineClassName)}>
          <span className={cn('split-inner', line.className)}>{line.text}</span>
        </span>
      ))}
    </Tag>
  )
}
