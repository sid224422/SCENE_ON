import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useLandingGsap(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      if (!motionOk) return

      gsap.to('.hero-stage', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cinematic-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-copy', {
        y: 72,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cinematic-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.from('.event-heading', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#nights', start: 'top 82%' },
      })

      gsap.from('.event-card', {
        y: 40,
        opacity: 0,
        rotate: 8,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.event-rail', start: 'top 85%' },
      })

      gsap.fromTo(
        '.story-copy',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#story',
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.6,
          },
        },
      )

      gsap.fromTo(
        '.story-frame',
        { x: 72, opacity: 0, clipPath: 'inset(0 72% 0 0 round 24px)' },
        {
          x: 0,
          opacity: 1,
          clipPath: 'inset(0 0% 0 0 round 24px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '#story',
            start: 'top 78%',
            end: 'top 42%',
            scrub: 0.8,
          },
        },
      )

      gsap.fromTo(
        '.bento-tile',
        { y: 48, opacity: 0, filter: 'blur(14px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#rooms', start: 'top 75%' },
        },
      )

      gsap.from('.theme-scene h2, .theme-scene .section-lead, .chip-marquee', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.theme-scene', start: 'top 80%' },
      })

      gsap.fromTo(
        '.cta-plain',
        { clipPath: 'inset(0 100% 0 0 round 28px)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0 round 28px)',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.cta-plain', start: 'top 85%' },
        },
      )

      ScrollTrigger.refresh()
    },
    { scope },
  )
}
