import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface Props {
  value: string
  onChange: (next: string) => void
  onComplete?: (code: string) => void
  length?: number
  disabled?: boolean
  error?: boolean
  id?: string
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled,
  error,
  id = 'otp',
}: Props) {
  const cells = Array.from({ length }, (_, i) => value[i] ?? '')
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  function setAt(index: number, digit: string) {
    const next = cells.map((cell, i) => (i === index ? digit : cell))
    const code = next.join('').slice(0, length)
    onChange(code)
    if (code.length === length) onComplete?.(code)
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) {
      setAt(index, '')
      return
    }
    setAt(index, digit)
    refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      event.preventDefault()
      if (cells[index]) {
        setAt(index, '')
        return
      }
      refs.current[index - 1]?.focus()
      if (index > 0) {
        const next = cells.map((cell, i) => (i === index - 1 ? '' : cell)).join('')
        onChange(next)
      }
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      refs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    const focusIndex = Math.min(pasted.length, length - 1)
    refs.current[focusIndex]?.focus()
    if (pasted.length === length) onComplete?.(pasted)
  }

  return (
    <div className={`otp ${error ? 'has-error' : ''}`} role="group" aria-label="One-time passcode">
      {cells.map((cell, index) => (
        <motion.div
          key={index}
          className="otp-cell"
          animate={
            reduce
              ? undefined
              : cell
                ? { scale: 1, y: 0 }
                : { scale: 0.94, y: 0 }
          }
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        >
          <input
            ref={(node) => {
              refs.current[index] = node
            }}
            id={index === 0 ? id : undefined}
            className={`otp-box ${cell ? 'is-filled' : ''}`}
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            pattern="[0-9]*"
            maxLength={1}
            value={cell}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
          />
        </motion.div>
      ))}
    </div>
  )
}
