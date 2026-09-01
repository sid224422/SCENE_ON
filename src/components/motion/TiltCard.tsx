import { useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 16 })
  const sry = useSpring(ry, { stiffness: 160, damping: 16 })
  const transform = useMotionTemplate`perspective(900px) rotateX(${srx}deg) rotateY(${sry}deg)`

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onPointerMove={(event) => {
        const box = ref.current?.getBoundingClientRect()
        if (!box) return
        const px = (event.clientX - box.left) / box.width
        const py = (event.clientY - box.top) / box.height
        ry.set((px - 0.5) * 14)
        rx.set((0.5 - py) * 12)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
