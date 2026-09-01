export type WizardStep = 1 | 2 | 3 | 4

export type Pronouns =
  | 'he/him'
  | 'she/her'
  | 'they/them'
  | 'prefer-not'

export type OtpStatus = 'idle' | 'sent' | 'verifying' | 'verified' | 'invalid' | 'expired'

export interface ProfileDraft {
  name: string
  age: string
  pronouns: Pronouns | ''
  state: string
  city: string
  college: string
}

export interface SignupSnapshot {
  email: string
  termsAccepted: boolean
  termsAcceptedAt: string | null
  step: WizardStep
  completedSteps: WizardStep[]
  otpStatus: Exclude<OtpStatus, 'verifying'>
  profile: ProfileDraft
}

export const emptyProfile = (): ProfileDraft => ({
  name: '',
  age: '',
  pronouns: '',
  state: '',
  city: '',
  college: '',
})

export const DEMO_OTP = '424242'
export const EXPIRED_OTP = '000000'

export const PRONOUN_OPTIONS: { value: Pronouns; label: string }[] = [
  { value: 'he/him', label: 'He / Him' },
  { value: 'she/her', label: 'She / Her' },
  { value: 'they/them', label: 'They / Them' },
  { value: 'prefer-not', label: 'Prefer not to say' },
]
