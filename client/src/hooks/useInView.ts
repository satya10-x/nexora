import { useEffect, useState, type RefObject } from 'react'

export function useInView<T extends Element>(
  ref: RefObject<T>,
  options: { rootMargin?: string; threshold?: number; once?: boolean } = {},
): boolean {
  const { rootMargin = '240px', threshold = 0, once = false } = options
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold, once])

  return inView
}
