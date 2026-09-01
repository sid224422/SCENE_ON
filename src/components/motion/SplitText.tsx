import { motion, useReducedMotion } from 'motion/react'

const EXPO = [0.87, 0, 0.13, 1] as const

export function SplitText({
  text,
  delay = 0,
  as: Tag = 'span',
  className = '',
}: {
  text: string
  delay?: number
  as?: 'span' | 'h1' | 'h2'
  className?: string
}) {
  const reduce = useReducedMotion()
  const chars = Array.from(text)

  return (
    <Tag className={`split-line ${className}`.trim()} aria-label={text}>
      {chars.map((char, index) => (
        <span className="split-char" key={`${text}-${index}`} aria-hidden="true">
          <motion.span
            initial={reduce ? false : { y: '115%', rotateX: -80 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{ delay: delay + index * 0.038, duration: 0.72, ease: EXPO }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
