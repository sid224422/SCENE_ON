import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '../components/Button'
import { TextField, SelectField } from '../components/Field'
import { Logo } from '../components/Logo'
import { OTPInput } from '../components/OTPInput'
import { Progress } from '../components/Progress'
import { MagneticButton } from '../components/motion/MagneticButton'
import { SplitText } from '../components/motion/SplitText'
import { Stagger } from '../components/motion/Stagger'
import { WizardAtmosphere } from '../components/motion/WizardAtmosphere'
import { useWizardGsap } from '../hooks/useWizardGsap'
import { getCities, getColleges, LOCATION_TREE } from '../lib/locations'
import { DEMO_OTP } from '../lib/types'
import type { Pronouns, WizardStep } from '../lib/types'
import { PRONOUN_OPTIONS } from '../lib/types'
import {
  clampAgeInput,
  validateAge,
  validateCity,
  validateCollege,
  validateEmail,
  validateName,
  validateOtp,
  validatePronouns,
  validateState,
} from '../lib/validation'
import { getErrorMessage, useSignup } from '../state/SignupContext'
import { ApiError } from '../lib/api'
import { useToast } from '../components/Toast'

const PATHS: Record<WizardStep, string> = {
  1: '/signup',
  2: '/signup/verify',
  3: '/signup/about',
  4: '/signup/city',
}

type WizardFx = {
  energy: number
  echo: string
  setFx: (patch: Partial<{ energy: number; echo: string }>) => void
}

const WizardFxContext = createContext<WizardFx | null>(null)

function useWizardFx() {
  const ctx = useContext(WizardFxContext)
  if (!ctx) throw new Error('WizardFx missing')
  return ctx
}

function stepFromPath(pathname: string): WizardStep {
  if (pathname.endsWith('/verify')) return 2
  if (pathname.endsWith('/about')) return 3
  if (pathname.endsWith('/city')) return 4
  return 1
}

export function SignupPage() {
  const { state, goToStep } = useSignup()
  const location = useLocation()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const pageRef = useRef<HTMLDivElement>(null)
  const step = stepFromPath(location.pathname)
  const direction = step >= state.step ? 1 : -1
  const [fx, setFxState] = useState({ energy: 0, echo: '' })
  const setFx = useCallback((patch: Partial<{ energy: number; echo: string }>) => {
    setFxState((current) => ({ ...current, ...patch }))
  }, [])

  useWizardGsap(pageRef, step, fx.energy)

  useEffect(() => {
    if (state.step !== step) goToStep(step)
  }, [goToStep, state.step, step])

  if (!state.termsAccepted) {
    return <Navigate to="/terms" replace />
  }

  if (step >= 2 && !state.email) {
    return <Navigate to="/signup" replace />
  }

  if (step >= 3 && state.otpStatus !== 'verified') {
    return <Navigate to={state.email ? '/signup/verify' : '/signup'} replace />
  }

  function back() {
    if (step === 1) {
      navigate('/terms')
      return
    }
    navigate(PATHS[(step - 1) as WizardStep])
  }

  return (
    <WizardFxContext.Provider value={{ ...fx, setFx }}>
      <div className="wizard-page" ref={pageRef} data-step={step}>
        <WizardAtmosphere step={step} energy={fx.energy} echo={fx.echo} />
        <header className="site-header" style={{ position: 'relative', background: 'transparent' }}>
          <Logo compact />
          <button type="button" className="btn btn-ghost" onClick={back}>
            Back
          </button>
        </header>
        <div className="wizard-frame">
          <Progress step={step} energy={fx.energy} />
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              className="wizard-step"
              custom={direction}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * 56, rotateY: direction * 18, filter: 'blur(12px)' }
              }
              animate={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)' }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -48, rotateY: direction * -14, filter: 'blur(10px)' }
              }
              transition={{ duration: reduceMotion ? 0.12 : 0.48, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', transformPerspective: 1400 }}
            >
              {step === 1 && <EmailStep />}
              {step === 2 && <OtpStep />}
              {step === 3 && <ProfileStep />}
              {step === 4 && <LocationStep />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </WizardFxContext.Provider>
  )
}

function EmailStep() {
  const { state, sendOtp } = useSignup()
  const { setFx } = useWizardFx()
  const { push } = useToast()
  const navigate = useNavigate()
  const [email, setLocal] = useState(state.email)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const error = touched ? validateEmail(email) : null
  const ready = !validateEmail(email)

  useEffect(() => {
    const local = email.split('@')[0]?.trim() ?? ''
    setFx({
      energy: ready ? 1 : Math.min(0.72, email.trim().length / 24),
      echo: local,
    })
  }, [email, ready, setFx])

  async function submit() {
    setTouched(true)
    const nextError = validateEmail(email)
    if (nextError) return
    setLoading(true)
    setGlobalError(null)
    try {
      await sendOtp(email.trim())
      push('Enter any 6-digit code to continue.', 'success')
      navigate('/signup/verify')
    } catch (err) {
      const message = getErrorMessage(err, 'Something went wrong. Please try again.')
      setGlobalError(message)
      push(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="step-copy">
        <p className="hero-kicker">Step 1 of 4</p>
        <SplitText as="h1" text="What’s your email?" />
        <p>We’ll send a 6-digit code. No password. No endless form.</p>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <Stagger className="form-stack">
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@email.com"
            value={email}
            error={error}
            onBlur={() => setTouched(true)}
            onChange={(event) => setLocal(event.target.value)}
            hint="Use +fail in the address to simulate a network error."
          />
          {globalError && <div className="alert alert-error">{globalError}</div>}
        </Stagger>
      </form>
      <div className="wizard-actions">
        <MagneticButton disabled={loading}>
          <motion.div animate={{ scale: ready ? 1 : 0.985, opacity: ready ? 1 : 0.72 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
            <Button block loading={loading} onClick={() => void submit()}>
              Continue
            </Button>
          </motion.div>
        </MagneticButton>
      </div>
    </>
  )
}

function OtpStep() {
  const { state, confirmOtp, sendOtp } = useSignup()
  const { setFx } = useWizardFx()
  const { push } = useToast()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [seconds, setSeconds] = useState(45)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const completing = useRef(false)
  const ready = otp.length === 6 && !validateOtp(otp)

  useEffect(() => {
    setFx({ energy: otp.length / 6, echo: otp ? `${otp.length}/6` : '' })
  }, [otp, setFx])

  useEffect(() => {
    if (seconds <= 0) return
    const timer = window.setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearInterval(timer)
  }, [seconds])

  async function verify(code: string) {
    const fieldError = validateOtp(code)
    if (fieldError) {
      setError(fieldError)
      return
    }
    if (completing.current || loading) return
    completing.current = true
    setLoading(true)
    setError(null)
    try {
      await confirmOtp(code)
      navigate('/signup/about')
    } catch (err) {
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
      if (err instanceof ApiError && err.code === 'EXPIRED') {
        setError(err.message)
      } else {
        setError(getErrorMessage(err, 'Verification failed. Please check your OTP.'))
      }
    } finally {
      completing.current = false
      setLoading(false)
    }
  }

  async function resend() {
    if (seconds > 0 || resending) return
    setResending(true)
    setError(null)
    try {
      await sendOtp()
      setOtp('')
      setSeconds(45)
      push('Enter a new 6-digit code to continue.', 'success')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not resend the code. Please try again.'))
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <div className="step-copy">
        <p className="hero-kicker">Step 2 of 4</p>
        <SplitText as="h1" text="Enter the code" />
        <p>
          Sent to <strong style={{ color: 'var(--text)' }}>{state.email}</strong>
        </p>
      </div>
      <Stagger className={`form-stack ${shake ? 'shake' : ''}`}>
        <OTPInput
          value={otp}
          error={Boolean(error)}
          disabled={loading}
          onChange={(next) => {
            setOtp(next)
            if (error) setError(null)
          }}
          onComplete={(code) => void verify(code)}
        />
        <p className="field-error" role={error ? 'alert' : undefined}>
          {error ?? ''}
        </p>
        <div className="alert alert-info">
          Enter any 6 digits, such as <strong>{DEMO_OTP}</strong>. Use 000000 to preview an expired code.
        </div>
        <p className="hint">
          {seconds > 0 ? (
            <>Resend available in {seconds}s</>
          ) : (
            <button type="button" className="btn btn-ghost" style={{ minHeight: 36, padding: 0 }} onClick={() => void resend()} disabled={resending}>
              {resending ? 'Sending a new code…' : 'Resend code'}
            </button>
          )}
        </p>
      </Stagger>
      <div className="wizard-actions">
        <MagneticButton disabled={loading}>
          <motion.div animate={{ scale: ready ? 1 : 0.985, opacity: ready ? 1 : 0.72 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
            <Button block loading={loading} onClick={() => void verify(otp)}>
              Verify
            </Button>
          </motion.div>
        </MagneticButton>
      </div>
    </>
  )
}

function ProfileStep() {
  const { state, patchProfile, completeStep } = useSignup()
  const { setFx } = useWizardFx()
  const navigate = useNavigate()
  const [name, setName] = useState(state.profile.name)
  const [age, setAge] = useState(state.profile.age)
  const [pronouns, setPronouns] = useState(state.profile.pronouns)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = {
    name: touched.name || submitted ? validateName(name) : null,
    age: touched.age || submitted ? validateAge(age) : null,
    pronouns: touched.pronouns || submitted ? validatePronouns(pronouns) : null,
  }
  const ready = !validateName(name) && !validateAge(age) && !validatePronouns(pronouns)

  useEffect(() => {
    const bits = [!validateName(name), !validateAge(age), !validatePronouns(pronouns)].filter(Boolean).length
    setFx({ energy: bits / 3, echo: name.trim() })
  }, [name, age, pronouns, setFx])

  function continueNext() {
    setSubmitted(true)
    const next = {
      name: validateName(name),
      age: validateAge(age),
      pronouns: validatePronouns(pronouns),
    }
    if (next.name || next.age || next.pronouns) return
    patchProfile({ name: name.trim(), age, pronouns })
    completeStep(3)
    navigate('/signup/city')
  }

  return (
    <>
      <div className="step-copy">
        <p className="hero-kicker">Step 3 of 4</p>
        <SplitText as="h1" text="Tell the room who you are" />
        <p>This shows on your profile — name, age, and pronouns.</p>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          continueNext()
        }}
      >
        <Stagger className="form-stack">
          <TextField
            id="name"
            label="Name"
            autoComplete="name"
            placeholder="Your first name"
            maxLength={40}
            value={name}
            error={errors.name}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            id="age"
            label="Age"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="18+"
            value={age}
            error={errors.age}
            onBlur={() => setTouched((t) => ({ ...t, age: true }))}
            onChange={(event) => setAge(clampAgeInput(event.target.value))}
          />
          <fieldset className={`field ${errors.pronouns ? 'has-error' : ''}`}>
            <legend className="field-label" id="pronouns-label">
              Pronouns
            </legend>
            <div className="radios" role="radiogroup" aria-labelledby="pronouns-label">
              {PRONOUN_OPTIONS.map((option) => (
                <motion.label
                  className="radio"
                  key={option.value}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    borderColor: pronouns === option.value ? 'rgba(192, 132, 252, 0.95)' : 'rgba(255, 255, 255, 0.12)',
                    scale: pronouns === option.value ? 1.015 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                >
                  <input
                    type="radio"
                    name="pronouns"
                    value={option.value}
                    checked={pronouns === option.value}
                    onChange={() => {
                      setPronouns(option.value as Pronouns)
                      setTouched((t) => ({ ...t, pronouns: true }))
                    }}
                  />
                  {option.label}
                </motion.label>
              ))}
            </div>
            <p className="field-error" role={errors.pronouns ? 'alert' : undefined}>
              {errors.pronouns ?? ''}
            </p>
          </fieldset>
        </Stagger>
      </form>
      <div className="wizard-actions">
        <MagneticButton>
          <motion.div animate={{ scale: ready ? 1 : 0.985, opacity: ready ? 1 : 0.72 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
            <Button block onClick={continueNext}>
              Continue
            </Button>
          </motion.div>
        </MagneticButton>
      </div>
    </>
  )
}

function LocationStep() {
  const { state, patchProfile, finishSignup } = useSignup()
  const { setFx } = useWizardFx()
  const { push } = useToast()
  const navigate = useNavigate()
  const [localState, setLocalState] = useState(state.profile.state)
  const [city, setCity] = useState(state.profile.city)
  const [college, setCollege] = useState(state.profile.college)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const cities = useMemo(() => getCities(localState).map((item) => item.name), [localState])
  const colleges = useMemo(() => getColleges(localState, city), [localState, city])
  const ready = !validateState(localState) && !validateCity(city, localState) && !validateCollege(college, city)

  const errors = {
    state: submitted ? validateState(localState) : null,
    city: submitted ? validateCity(city, localState) : null,
    college: submitted ? validateCollege(college, city) : null,
  }

  useEffect(() => {
    const bits = [Boolean(localState), Boolean(city), Boolean(college)].filter(Boolean).length
    setFx({ energy: bits / 3, echo: city || localState })
  }, [localState, city, college, setFx])

  async function complete() {
    setSubmitted(true)
    if (validateState(localState) || validateCity(city, localState) || validateCollege(college, city)) {
      return
    }
    patchProfile({ state: localState, city, college })
    setLoading(true)
    setGlobalError(null)
    try {
      await finishSignup()
      navigate('/welcome', { replace: true })
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to complete signup. Please try again.')
      setGlobalError(message)
      push(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="step-copy">
        <p className="hero-kicker">Step 4 of 4</p>
        <SplitText as="h1" text="Where do you go out?" />
        <p>We’ll use this to surface hangouts around your city.</p>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void complete()
        }}
      >
        <Stagger className="form-stack">
          <SelectField
            id="state"
            label="State"
            value={localState}
            options={LOCATION_TREE.map((item) => item.name)}
            placeholder="Select state"
            error={errors.state}
            onChange={(event) => {
              setLocalState(event.target.value)
              setCity('')
              setCollege('')
            }}
          />
          <motion.div animate={{ opacity: localState ? 1 : 0.42, y: localState ? 0 : 8 }} transition={{ duration: 0.28 }}>
            <SelectField
              id="city"
              label="City"
              value={city}
              options={cities}
              placeholder={localState ? 'Select city' : 'Select a state first'}
              disabled={!localState}
              error={errors.city}
              onChange={(event) => {
                setCity(event.target.value)
                setCollege('')
              }}
            />
          </motion.div>
          <motion.div animate={{ opacity: city ? 1 : 0.42, y: city ? 0 : 8 }} transition={{ duration: 0.28 }}>
            <SelectField
              id="college"
              label="College"
              value={college}
              options={colleges}
              placeholder={city ? 'Select college' : 'Select a city first'}
              disabled={!city}
              error={errors.college}
              onChange={(event) => setCollege(event.target.value)}
            />
          </motion.div>
          {globalError && <div className="alert alert-error">{globalError}</div>}
        </Stagger>
      </form>
      <div className="wizard-actions">
        <MagneticButton disabled={loading}>
          <motion.div animate={{ scale: ready ? 1 : 0.985, opacity: ready ? 1 : 0.72 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
            <Button block loading={loading} onClick={() => void complete()}>
              Complete signup
            </Button>
          </motion.div>
        </MagneticButton>
      </div>
    </>
  )
}
