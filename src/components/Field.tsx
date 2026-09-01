import { useEffect, useId, useLayoutEffect, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string | null
  hint?: string
}

export function TextField({ id, label, error, hint, className = '', ...props }: FieldProps) {
  const describedBy = [
    error ? `${id}-error` : null,
    hint ? `${id}-hint` : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`field-input ${className}`}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      )}
      <p id={`${id}-error`} className="field-error" role={error ? 'alert' : undefined}>
        {error ?? ''}
      </p>
    </div>
  )
}

interface SelectProps {
  id: string
  label: string
  value: string
  options: string[]
  placeholder?: string
  error?: string | null
  disabled?: boolean
  onChange: (event: { target: { value: string } }) => void
}

export function SelectField({
  id,
  label,
  value,
  options,
  placeholder = 'Select…',
  error,
  disabled,
  onChange,
}: SelectProps) {
  const reduce = useReducedMotion()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [open])

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    const menuHeight = 260
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setDropUp(spaceBelow < menuHeight && spaceAbove > spaceBelow)
  }, [open, options.length])

  useEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(value)))
  }, [open, options, value])

  function choose(next: string) {
    onChange({ target: { value: next } })
    setOpen(false)
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      if (event.key === 'Enter' || event.key === ' ') {
        const picked = options[active]
        if (picked) choose(picked)
      } else {
        setActive((current) => Math.min(options.length - 1, current + 1))
      }
    }
    if (event.key === 'ArrowUp' && open) {
      event.preventDefault()
      setActive((current) => Math.max(0, current - 1))
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
    if (event.key === 'Tab') setOpen(false)
  }

  const display = value || placeholder

  return (
    <div className={`field ${error ? 'has-error' : ''} ${open ? 'is-open' : ''}`} ref={rootRef}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="select-wrap">
      <button
        type="button"
        id={id}
        className={`field-select ${open ? 'is-open' : ''} ${!value ? 'is-placeholder' : ''}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={onKey}
      >
        <span>{display}</span>
        <svg className="select-caret" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M5 7.5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            className={`select-menu ${dropUp ? 'is-up' : ''}`}
            data-lenis-prevent=""
            data-lenis-prevent-wheel=""
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: dropUp ? 8 : -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            {options.length === 0 && (
              <li className="select-option is-empty">No options yet</li>
            )}
            {options.map((option, index) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  className={`select-option ${value === option ? 'is-selected' : ''} ${active === index ? 'is-active' : ''}`}
                  aria-selected={value === option}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      </div>
      <p id={`${id}-error`} className="field-error" role={error ? 'alert' : undefined}>
        {error ?? ''}
      </p>
    </div>
  )
}
