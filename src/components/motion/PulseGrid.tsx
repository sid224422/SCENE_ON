import { motion, useReducedMotion } from 'motion/react'

const COLS = 9
const ROWS = 14

export function PulseGrid() {
  const reduce = useReducedMotion()
  const cx = (COLS - 1) / 2
  const cy = (ROWS - 1) / 2

  return (
    <div className="pulse-grid" aria-hidden="true">
      {Array.from({ length: COLS * ROWS }, (_, index) => {
        const x = index % COLS
        const y = Math.floor(index / COLS)
        const dist = Math.hypot(x - cx, y - cy)
        return (
          <motion.span
            key={index}
            className="pulse-dot"
            animate={reduce ? undefined : { scale: [0.45, 1.25, 0.45], opacity: [0.18, 0.95, 0.18] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: dist * 0.09,
              ease: [0.45, 0, 0.55, 1],
            }}
          />
        )
      })}
    </div>
  )
}
