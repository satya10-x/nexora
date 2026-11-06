export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  )
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}
