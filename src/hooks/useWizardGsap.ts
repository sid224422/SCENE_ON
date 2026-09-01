import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { RefObject } from 'react'

export function useWizardGsap(
  scope: RefObject<HTMLElement | null>,
  step: number,
  energy: number,
) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const orbs = root.querySelectorAll<HTMLElement>('.wizard-orb')
      const movers = Array.from(orbs).map((el, index) => ({
        x: gsap.quickTo(el, 'x', { duration: 0.85 + index * 0.18, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.85 + index * 0.18, ease: 'power3.out' }),
      }))

      gsap.to(orbs, {
        opacity: 0.62,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        stagger: 0.45,
        ease: 'sine.inOut',
      })

      const onMove = (event: PointerEvent) => {
        const box = root.getBoundingClientRect()
        const px = event.clientX - box.left - box.width / 2
        const py = event.clientY - box.top - box.height / 2
        movers.forEach((mover, index) => {
          const k = (index + 1) * 0.14
          mover.x(px * k)
          mover.y(py * k)
        })
      }

      root.addEventListener('pointermove', onMove)
      return () => root.removeEventListener('pointermove', onMove)
    },
    { scope },
  )

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.to('.wizard-energy', {
        scale: 0.62 + energy * 0.55,
        opacity: 0.18 + energy * 0.62,
        duration: 0.55,
        ease: 'power2.out',
      })

      gsap.to('.wizard-vanta', {
        opacity: 0.28 + energy * 0.42,
        duration: 0.5,
        ease: 'power2.out',
      })
    },
    { scope, dependencies: [energy] },
  )

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        '.wizard-flash',
        { opacity: 0.5 },
        { opacity: 0, duration: 0.72, ease: 'power2.out' },
      )
    },
    { scope, dependencies: [step] },
  )
}
