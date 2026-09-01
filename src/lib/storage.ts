import { emptyProfile, type SignupSnapshot, type WizardStep } from './types'

const KEY = 'sceneon.signup.v1'

const defaultSnapshot = (): SignupSnapshot => ({
  email: '',
  termsAccepted: false,
  termsAcceptedAt: null,
  step: 1,
  completedSteps: [],
  otpStatus: 'idle',
  profile: emptyProfile(),
})

function isStep(value: unknown): value is WizardStep {
  return value === 1 || value === 2 || value === 3 || value === 4
}

export function loadSignupSnapshot(): SignupSnapshot {
  const fallback = defaultSnapshot()
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<SignupSnapshot>
    return {
      ...fallback,
      ...parsed,
      step: isStep(parsed.step) ? parsed.step : 1,
      completedSteps: Array.isArray(parsed.completedSteps)
        ? parsed.completedSteps.filter(isStep)
        : [],
      profile: { ...emptyProfile(), ...parsed.profile },
      otpStatus:
        parsed.otpStatus === 'verified' ? 'verified' : 'idle',
    }
  } catch {
    return fallback
  }
}

export function saveSignupSnapshot(snapshot: SignupSnapshot) {
  const safe: SignupSnapshot = {
    ...snapshot,
    otpStatus: snapshot.otpStatus === 'verified' ? 'verified' : 'idle',
  }
  sessionStorage.setItem(KEY, JSON.stringify(safe))
}

export function clearSignupSnapshot() {
  sessionStorage.removeItem(KEY)
}
