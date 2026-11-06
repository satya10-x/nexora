import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const finePointer = useMediaQuery('(pointer: fine)')
  const reduced = useReducedMotion()
  const enabled = finePointer && !reduced

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let currentScale = 1
    let targetScale = 1
    let hasMoved = false
    let raf = 0

    const setOpacity = (value: string) => {
      dot.style.opacity = value
      ring.style.opacity = value
    }

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      if (!hasMoved) {
        hasMoved = true
        setOpacity('1')
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const hot = target?.closest(
        'a, button, [role="button"], [data-cursor="hover"], input, textarea, select',
      )
      targetScale = hot ? 2.1 : 1
      ring.style.backgroundColor = hot ? 'rgba(255,255,255,0.10)' : 'transparent'
      ring.style.borderColor = hot ? 'rgba(0,240,255,0.9)' : 'rgba(255,255,255,0.7)'
    }

    const onDown = () => {
      targetScale = 0.72
    }

    const onUp = () => {
      targetScale = 1
    }

    const onLeave = () => setOpacity('0')
    const onEnter = () => setOpacity('1')

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      currentScale += (targetScale - currentScale) * 0.14
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${currentScale})`
      raf = window.requestAnimationFrame(loop)
    }

    setOpacity('0')
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = window.requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-white/70 transition-[background-color,border-color] duration-200"
        style={{ opacity: 0 }}
      />
    </div>
  )
}
