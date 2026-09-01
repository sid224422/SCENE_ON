import type { ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

function LenisGsapBridge() {
  useLenis(() => {
    ScrollTrigger.update()
  })
  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce) return children

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.15, smoothWheel: true }}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  )
}
