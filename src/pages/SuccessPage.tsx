import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { TiltCard } from '../components/motion/TiltCard'
import { PRONOUN_OPTIONS } from '../lib/types'
import { useSignup } from '../state/SignupContext'

function guestCode(email: string) {
  let n = 2166136261
  for (const char of email) n = Math.imul(n ^ char.charCodeAt(0), 16777619)
  return String(n >>> 0).padStart(8, '0').slice(-6)
}

export function SuccessPage() {
  const { state, reset } = useSignup()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const pronouns =
    PRONOUN_OPTIONS.find((option) => option.value === state.profile.pronouns)?.label ??
    state.profile.pronouns

  if (!state.email || !state.completedSteps.includes(4)) {
    return <Navigate to={state.termsAccepted ? '/signup' : '/'} replace />
  }

  const code = guestCode(state.email)
  const cityLine = [state.profile.city, state.profile.state].filter(Boolean).join(', ')
  const sparks = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: `${(i % 2 === 0 ? 1 : -1) * (28 + (i * 19) % 160)}px`,
    y: `${-60 - (i * 17) % 180}px`,
    color: ['#c084fc', '#fb7185', '#fbbf24', '#f5d0fe', '#fff'][i % 5],
    delay: `${i * 0.04}s`,
  }))

  return (
    <div className="success-wrap">
      <div className="wizard-night success-night" aria-hidden="true">
        <img src="/media/crowd.jpg" alt="" />
      </div>
      <header className="site-header glass-nav is-pinned">
        <Logo />
      </header>

      {!reduceMotion && (
        <div className="confetti" aria-hidden="true">
          {sparks.map((spark) => (
            <i
              key={spark.id}
              style={{
                ['--x' as string]: spark.x,
                ['--y' as string]: spark.y,
                background: spark.color,
                animationDelay: spark.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="success-card">
        <p className="hero-kicker">Guest list · Access granted</p>
        <SplitText as="h1" text="You’re in." />
        <p className="success-lead">
          Profile created. The door just opened — this is your night pass.
        </p>

        <motion.div
          className="pass-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 36, rotateX: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.2 }}
          style={{ transformPerspective: 1200 }}
        >
          <TiltCard>
            <article className="night-pass">
              <div className="pass-holo">
                <span>SceneOn</span>
                <span className="pass-live">
                  <i />
                  Live
                </span>
              </div>
              <div className="pass-body">
                <p className="pass-kicker">Night pass</p>
                <p className="pass-name">{state.profile.name || 'Guest'}</p>
                <p className="pass-meta">
                  {state.profile.age || '—'} · {pronouns || '—'}
                </p>
                <dl className="profile-preview">
                  <div>
                    <dt>City</dt>
                    <dd>{cityLine || '—'}</dd>
                  </div>
                  <div>
                    <dt>College</dt>
                    <dd>{state.profile.college || '—'}</dd>
                  </div>
                  <div className="is-wide">
                    <dt>Email</dt>
                    <dd>{state.email}</dd>
                  </div>
                </dl>
              </div>
              <div className="pass-perf" aria-hidden="true" />
              <div className="pass-stub">
                <div>
                  <span>Guest</span>
                  <strong>EXT-{code}</strong>
                </div>
                <div className="pass-barcode" aria-hidden="true" />
              </div>
            </article>
          </TiltCard>
        </motion.div>

        <div className="success-actions">
          <MagneticButton>
            <Link to="/" className="btn btn-primary btn-block" onClick={() => reset()}>
              Back to home
            </Link>
          </MagneticButton>
          <Button
            variant="ghost"
            onClick={() => {
              reset()
              navigate('/')
            }}
          >
            Start over
          </Button>
        </div>
      </div>
    </div>
  )
}
