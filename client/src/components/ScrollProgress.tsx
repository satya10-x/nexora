import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type ScrollProgressProps = {
  visible: boolean
}

export function ScrollProgress({ visible }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-x-0 top-0 z-[95] h-[2px] transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta shadow-[0_0_18px_rgba(0,240,255,0.7)]"
      />
    </div>
  )
}
