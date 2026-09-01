import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { useSignup } from '../state/SignupContext'

const EASE = [0.22, 1, 0.36, 1] as const

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: 'By creating a SceneOn profile, you agree to these terms. If you do not agree, do not continue. We may update this page from time to time; using the product after a change means you accept the update.',
  },
  {
    title: 'Eligibility',
    body: 'You must be at least 18 years old to use SceneOn. By continuing, you confirm that you meet this requirement. The product is designed for adults discovering real-world social events.',
  },
  {
    title: 'User conduct',
    body: 'Use SceneOn respectfully and lawfully. Harassment, hate speech, impersonation, spam, or anything that makes people feel unsafe is not allowed. Accounts that break this standard can be paused or removed.',
  },
  {
    title: 'Events & meetups',
    body: 'SceneOn helps people discover gatherings. Hosts and guests are responsible for their own safety, venue rules, and local laws. We do not guarantee that any event will take place as described.',
  },
  {
    title: 'Your profile',
    body: 'You agree that the name, age, pronouns, and location you share are accurate enough for other people to understand who they are meeting. Do not impersonate someone else.',
  },
  {
    title: 'Limitation of liability',
    body: 'This web experience is a frontend demonstration. No real account is created on SceneOn servers. Do not submit sensitive credentials or payment information here.',
  },
]

const SHORT = ['Be 18 or older', 'Be kind in rooms', 'Show up as yourself', 'Demo — no live account']

export function TermsPage() {
  const { acceptTerms, state } = useSignup()
  const [agreed, setAgreed] = useState(state.termsAccepted)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  function continueSignup() {
    if (!agreed) {
      setError('Please accept the terms to continue.')
      return
    }
    acceptTerms()
    navigate('/signup')
  }

  return (
    <div className="legal-shell">
      <header className="site-header glass-nav is-pinned">
        <Logo />
        <Link to="/" className="btn btn-ghost">
          Back
        </Link>
      </header>

      <article className="legal-page">
        <header className="legal-intro">
          <p className="hero-kicker">Before you join</p>
          <svg className="draw-line" viewBox="0 0 160 10" aria-hidden="true">
            <motion.path
              d="M2 7 C 40 1, 120 1, 158 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.87, 0, 0.13, 1] }}
            />
          </svg>
          <SplitText as="h1" text="House rules." />
          <p className="legal-lead">
            Terms & Conditions — the quiet stuff that keeps the night safe.
          </p>
          <p className="legal-meta">Last updated August 22, 2026 · Inspired by SceneOn</p>
        </header>

        <ol className="legal-list">
          {SECTIONS.map((section, index) => (
            <motion.li
              key={section.title}
              className="legal-card"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduce ? 0.12 : 0.45, delay: reduce ? 0 : index * 0.05, ease: EASE }}
            >
              <span className="legal-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <section className="legal-short">
          <p className="hero-kicker">In short</p>
          <ul>
            {SHORT.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <div className="consent-bar">
        <div className="consent-card">
          <div className="check-row">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked)
                if (event.target.checked) setError(null)
              }}
            />
            <label htmlFor="agree">
              I am 18 or older and I agree to the SceneOn Terms & Conditions.
            </label>
          </div>
          {error && (
            <p className="field-error" role="alert" style={{ marginBottom: '0.7rem' }}>
              {error}
            </p>
          )}
          <MagneticButton disabled={!agreed}>
            <Button block onClick={continueSignup} disabled={!agreed}>
              Continue to signup
            </Button>
          </MagneticButton>
        </div>
      </div>
    </div>
  )
}
