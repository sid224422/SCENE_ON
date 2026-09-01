import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import {
  loadSignupSnapshot,
  saveSignupSnapshot,
  clearSignupSnapshot,
} from '../lib/storage'
import { emptyProfile, type ProfileDraft, type SignupSnapshot, type WizardStep } from '../lib/types'

type Action =
  | { type: 'ACCEPT_TERMS' }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'MARK_COMPLETE'; step: WizardStep }
  | { type: 'SET_OTP_STATUS'; status: SignupSnapshot['otpStatus'] }
  | { type: 'PATCH_PROFILE'; patch: Partial<ProfileDraft> }
  | { type: 'RESET' }

function reducer(state: SignupSnapshot, action: Action): SignupSnapshot {
  switch (action.type) {
    case 'ACCEPT_TERMS':
      return {
        ...state,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
      }
    case 'SET_EMAIL':
      return { ...state, email: action.email }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'MARK_COMPLETE':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.step)
          ? state.completedSteps
          : [...state.completedSteps, action.step],
      }
    case 'SET_OTP_STATUS':
      return { ...state, otpStatus: action.status }
    case 'PATCH_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.patch } }
    case 'RESET':
      return {
        email: '',
        termsAccepted: false,
        termsAcceptedAt: null,
        step: 1,
        completedSteps: [],
        otpStatus: 'idle',
        profile: emptyProfile(),
      }
  }
}

interface SignupContextValue {
  state: SignupSnapshot
  acceptTerms: () => void
  setEmail: (email: string) => void
  goToStep: (step: WizardStep) => void
  patchProfile: (patch: Partial<ProfileDraft>) => void
  sendOtp: (email?: string) => Promise<void>
  confirmOtp: (otp: string) => Promise<void>
  completeStep: (step: WizardStep) => void
  finishSignup: () => Promise<void>
  reset: () => void
}

const SignupContext = createContext<SignupContextValue | null>(null)

export function SignupProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadSignupSnapshot)

  useEffect(() => {
    saveSignupSnapshot(state)
  }, [state])

  const acceptTerms = useCallback(() => dispatch({ type: 'ACCEPT_TERMS' }), [])
  const setEmail = useCallback((email: string) => dispatch({ type: 'SET_EMAIL', email }), [])
  const goToStep = useCallback((step: WizardStep) => dispatch({ type: 'SET_STEP', step }), [])
  const patchProfile = useCallback(
    (patch: Partial<ProfileDraft>) => dispatch({ type: 'PATCH_PROFILE', patch }),
    [],
  )

  const completeStep = useCallback((step: WizardStep) => {
    dispatch({ type: 'MARK_COMPLETE', step })
  }, [])

  const sendOtp = useCallback(async (email = state.email) => {
    await api.requestOtp(email)
    dispatch({ type: 'SET_EMAIL', email })
    dispatch({ type: 'SET_OTP_STATUS', status: 'sent' })
    dispatch({ type: 'MARK_COMPLETE', step: 1 })
  }, [state.email])

  const confirmOtp = useCallback(
    async (otp: string) => {
      await api.verifyOtp(state.email, otp)
      dispatch({ type: 'SET_OTP_STATUS', status: 'verified' })
      dispatch({ type: 'MARK_COMPLETE', step: 2 })
    },
    [state.email],
  )

  const finishSignup = useCallback(async () => {
    await api.submitProfile()
    await api.completeSignup()
    dispatch({ type: 'MARK_COMPLETE', step: 3 })
    dispatch({ type: 'MARK_COMPLETE', step: 4 })
  }, [])

  const reset = useCallback(() => {
    clearSignupSnapshot()
    dispatch({ type: 'RESET' })
  }, [])

  const value = useMemo(
    () => ({
      state,
      acceptTerms,
      setEmail,
      goToStep,
      patchProfile,
      sendOtp,
      confirmOtp,
      completeStep,
      finishSignup,
      reset,
    }),
    [state, acceptTerms, setEmail, goToStep, patchProfile, sendOtp, confirmOtp, completeStep, finishSignup, reset],
  )

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
}

export function useSignup() {
  const ctx = useContext(SignupContext)
  if (!ctx) throw new Error('useSignup must be used within SignupProvider')
  return ctx
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}
