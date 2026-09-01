import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export function MagneticButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.45 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.45 })

  if (reduce) return <>{children}</>

  return (
    <motion.div
      ref={ref}
      className="magnetic-wrap"
      style={{ x: sx, y: sy }}
      onPointerMove={(event) => {
        if (disabled) return
        const box = ref.current?.getBoundingClientRect()
        if (!box) return
        x.set((event.clientX - box.left - box.width / 2) * 0.28)
        y.set((event.clientY - box.top - box.height / 2) * 0.32)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
