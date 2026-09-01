import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import WAVES from 'vanta/dist/vanta.waves.min'

export function VantaNet() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 768) return

    let effect: ReturnType<typeof WAVES> | undefined
    try {
      effect = WAVES({
        el,
        THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x5b21b6,
        shininess: 35,
        waveHeight: 16,
        waveSpeed: 0.7,
        zoom: 0.85,
      })
    } catch {
      return
    }

    return () => {
      effect?.destroy()
    }
  }, [])

  return <div ref={hostRef} className="hero-vanta" aria-hidden="true" />
}
