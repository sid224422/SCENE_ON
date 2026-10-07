import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Logo } from '../components/Logo'
import { PulseGrid } from '../components/motion/PulseGrid'
import { SplitText } from '../components/motion/SplitText'
import { TiltCard } from '../components/motion/TiltCard'
import { VantaNet } from '../components/motion/VantaNet'
import { useLandingGsap } from '../hooks/useLandingGsap'
import { BENTO, EVENTS, HERO_SHOT } from '../lib/media'

const hoverSpring = { type: 'spring' as const, stiffness: 320, damping: 18 }

const THEMES = [
  '☕ Tea Party',
  '🍽️ Dinner Event',
  '🎸 Music Jam',
  '📚 Book Club',
  '🥞 Brunch Outing',
  '🤝 Networking',
  '🎬 Movie Squad',
  '🏋️ Workout',
  '🎮 Game Night',
  '🎤 Karaoke',
]

const STATS = [
  ['18+', 'Adults only'],
  ['Live', 'Events near you'],
  ['No swipe', 'Just real hangouts'],
] as const

export function LandingPage() {
  const landingRef = useRef<HTMLDivElement>(null)
  useLandingGsap(landingRef)

  return (
    <div className="landing" ref={landingRef}>
      <ScrollChrome />
      <LandingHeader />

      <Hero />
      <EventRail />
      <AboutZoom />
      <BentoNights />
      <ThemeMarquee />
      <CtaBand />

      <footer className="site-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} SceneOn.</span>
          <nav className="footer-links" aria-label="Legal">
            <Link to="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function LandingHeader() {
  const lenis = useLenis()
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const update = () => setPinned(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useLenis((instance) => {
    setPinned(instance.scroll > 12)
  })

  function goTo(id: string) {
    lenis?.scrollTo(`#${id}`, { offset: -72 })
  }

  return (
    <header className={`site-header glass-nav ${pinned ? 'is-pinned' : ''}`}>
      <Logo />
      <nav className="desk-nav" aria-label="Primary">
        <a
          href="#nights"
          onClick={(event) => {
            event.preventDefault()
            goTo('nights')
          }}
        >
          Nights
        </a>
        <a
          href="#story"
          onClick={(event) => {
            event.preventDefault()
            goTo('story')
          }}
        >
          Story
        </a>
        <a
          href="#rooms"
          onClick={(event) => {
            event.preventDefault()
            goTo('rooms')
          }}
        >
          Rooms
        </a>
      </nav>
      <Link to="/terms" className="btn btn-primary btn-nav">
        Join the night
      </Link>
    </header>
  )
}

function ScrollChrome() {
  const reduce = useReducedMotion()
  const lenis = useLenis()
  const [active, setActive] = useState('nights')

  useEffect(() => {
    const ids = ['nights', 'story', 'rooms']
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { threshold: [0.25, 0.5], rootMargin: '-20% 0px -40% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  if (reduce) return null

  const chapters = [
    { id: 'nights', label: 'Nights' },
    { id: 'story', label: 'Story' },
    { id: 'rooms', label: 'Rooms' },
  ]

  return (
    <nav className="chapter-nav" aria-label="On this page">
      {chapters.map((chapter) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          className={active === chapter.id ? 'is-active' : undefined}
          onClick={(event) => {
            event.preventDefault()
            lenis?.scrollTo(`#${chapter.id}`, { offset: -72 })
          }}
        >
          <span />
          {chapter.label}
        </a>
      ))}
    </nav>
  )
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

function Hero() {
  const words = ['Strangers.', 'Hangouts.', 'Memories.']
  const reduce = useReducedMotion()

  return (
    <section className="cinematic-hero">
      <div className="hero-stage" aria-hidden="true">
        <img src={HERO_SHOT} alt="" />
      </div>
      <VantaNet />
      <div className="hero-sweep" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-kicker">Welcome SceneOn</p>
        <svg className="draw-line" viewBox="0 0 160 10" aria-hidden="true">
          <motion.path
            d="M2 7 C 40 1, 120 1, 158 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.87, 0, 0.13, 1] }}
          />
        </svg>
        <h1>
          {words.map((word, index) => (
            <SplitText key={word} text={word} delay={0.18 + index * 0.22} className="hero-word" />
          ))}
        </h1>
        <motion.p
          className="hero-lead"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
        >
          Discover the nightlife, brunches, and hangouts of your city. Break free from endless
          scrolling — the room is already moving.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.18, duration: 0.65, ease: [0.87, 0, 0.13, 1] }}
        >
          <Link to="/terms" className="btn btn-primary">
            Create your profile
          </Link>
          <a href="#nights" className="btn btn-outline">
            See what’s on
          </a>
        </motion.div>
        <div className="stats">
          {STATS.map(([value, label], index) => (
            <motion.div
              className="stat"
              key={label}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.28 + index * 0.08, duration: 0.55, ease: [0.87, 0, 0.13, 1] }}
            >
              <b>{value}</b>
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EventRail() {
  const row = [...EVENTS, ...EVENTS]

  return (
    <section className="event-stage" id="nights">
      <Reveal className="section event-heading">
        <p className="hero-kicker">Tonight, nearby</p>
        <h2>We are already partying.</h2>
      </Reveal>
      <div className="event-rail" aria-label="Featured nights">
        <div className="event-track">
          {row.map((event, index) => (
            <motion.article
              className="event-card"
              key={`${event.title}-${index}`}
              whileHover={{ y: -12, rotate: 0, transition: hoverSpring }}
            >
              <img src={event.image} alt="" />
              <div className="event-card-copy">
                <h3>{event.title}</h3>
                <p>
                  {event.time} · {event.place}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutZoom() {
  return (
    <section className="story-split" id="story">
      <div className="story-copy">
        <p className="hero-kicker">Welcome SceneOn</p>
        <h2>Discover the nightlife, brunches, and hangouts of your city.</h2>
        <p>Strangers today. Friends tomorrow.</p>
      </div>
      <div className="story-frame">
        <img src="/media/night-3.jpg" alt="Friends in the crowd at night" />
      </div>
    </section>
  )
}

function BentoNights() {
  return (
    <section className="section" id="rooms">
      <Reveal>
        <p className="hero-kicker">The rooms</p>
        <h2>Turn any night into a party</h2>
        <p className="section-lead">
          SceneOn is built for people who want the room, not the feed.
        </p>
      </Reveal>
      <div className="bento">
        {BENTO.map((tile) => (
          <div key={tile.title} className={`bento-tile is-${tile.span}`}>
            <TiltCard className="bento-tile-inner">
              {'video' in tile && tile.video ? (
                <video autoPlay muted loop playsInline>
                  <source src={tile.video} type="video/mp4" />
                </video>
              ) : (
                <PulseGrid />
              )}
              <div className="bento-copy">
                <h3>{tile.title}</h3>
                <p>{tile.copy}</p>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  )
}

function ThemeMarquee() {
  const row = [...THEMES, ...THEMES]
  return (
    <section className="section theme-scene">
      <h2>Every excuse to go out</h2>
      <p className="section-lead">From quiet dinners to music jams — pick a theme and find your people.</p>
      <div className="chip-marquee">
        <div className="chip-track">
          {row.map((theme, index) => (
            <span className="chip" key={`${theme}-${index}`}>
              {theme}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBand() {
  return (
    <section className="cta-band cta-plain">
      <p className="hero-kicker">We are already partying</p>
      <SplitText text="Your city is already waiting." as="h2" delay={0.05} />
      <p>Four quick steps. Then you’re in the room.</p>
      <div>
        <Link to="/terms" className="btn btn-primary">
          Get started
        </Link>
      </div>
    </section>
  )
}
