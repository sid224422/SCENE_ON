import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import * as THREE from 'three'
import WAVES from 'vanta/dist/vanta.waves.min'
import type { WizardStep } from '../../lib/types'

const SHOTS: Record<WizardStep, string> = {
  1: '/media/night-2.jpg',
  2: '/media/night-6.jpg',
  3: '/media/crowd.jpg',
  4: '/media/night-4.jpg',
}

const WAVE_COLOR: Record<WizardStep, number> = {
  1: 0x5b21b6,
  2: 0xbe185d,
  3: 0x6d28d9,
  4: 0x0369a1,
}

interface Props {
  step: WizardStep
  energy: number
  echo: string
}

export function WizardAtmosphere({ step, energy, echo }: Props) {
  const reduce = useReducedMotion()
  const filled = Math.round(energy * 6)

  return (
    <>
      <div className="wizard-night" aria-hidden="true">
        <AnimatePresence>
          <motion.div
            key={SHOTS[step]}
            className="wizard-shot"
            initial={reduce ? { opacity: 0.35 } : { opacity: 0 }}
            animate={{ opacity: 0.42 + energy * 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={SHOTS[step]} alt="" />
          </motion.div>
        </AnimatePresence>
      </div>
      <WizardWaves color={WAVE_COLOR[step]} energy={energy} />
      <div className="wizard-orb" aria-hidden="true" />
      <div className="wizard-orb alt" aria-hidden="true" />
      <div className="wizard-energy" aria-hidden="true" />
      <div className="wizard-flash" aria-hidden="true" />
      {!reduce && step === 2 && (
        <div className="wizard-constellation" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <motion.i
              key={index}
              className={index < filled ? 'is-lit' : undefined}
              animate={{
                scale: index < filled ? 1.35 : 1,
                opacity: index < filled ? 1 : 0.28,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              style={{
                left: `${50 + Math.cos((index / 6) * Math.PI * 2 - Math.PI / 2) * 38}%`,
                top: `${46 + Math.sin((index / 6) * Math.PI * 2 - Math.PI / 2) * 28}%`,
              }}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {echo && !reduce && (
          <motion.p
            key={echo}
            className="wizard-echo"
            initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
            animate={{ opacity: 0.14 + energy * 0.12, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            {echo}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}

function WizardWaves({ color, energy }: { color: number; energy: number }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<ReturnType<typeof WAVES> | undefined>(undefined)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 640) return

    try {
      effectRef.current = WAVES({
        el,
        THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color,
        shininess: 34,
        waveHeight: 12,
        waveSpeed: 0.55,
        zoom: 0.82,
      })
    } catch {
      return
    }

    return () => {
      effectRef.current?.destroy()
      effectRef.current = undefined
    }
    // Color/energy updates go through setOptions below — init once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      effectRef.current?.setOptions?.({
        color,
        waveHeight: 10 + energy * 20,
        waveSpeed: 0.4 + energy * 0.85,
      })
    } catch {
      /* Vanta build without setOptions */
    }
  }, [color, energy])

  return <div ref={hostRef} className="wizard-vanta" aria-hidden="true" />
}
