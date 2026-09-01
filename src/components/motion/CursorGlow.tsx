import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export function CursorGlow() {
  const reduce = useReducedMotion()
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 80, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 80, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (reduce) return
    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [reduce, x, y])

  if (reduce) return null

  return (
    <motion.div
      className="cursor-glow"
      aria-hidden="true"
      style={{ left: sx, top: sy }}
    />
  )
}
