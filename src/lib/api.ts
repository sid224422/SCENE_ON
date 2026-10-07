export class ApiError extends Error {
  readonly code: 'NETWORK' | 'INVALID' | 'EXPIRED' | 'CONFLICT' | 'UNKNOWN'

  constructor(code: ApiError['code'], message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const typicalLatency = () => 720 + Math.random() * 680

function resolveDelay(email: string) {
  if (email.includes('+slow')) return 3200
  return typicalLatency()
}

function shouldFail(email: string) {
  return email.includes('+fail')
}

export async function requestOtp(email: string): Promise<{ expiresInSec: number }> {
  await wait(resolveDelay(email))
  if (shouldFail(email)) {
    throw new ApiError(
      'NETWORK',
      'Unable to send a verification code. Please try again.',
    )
  }
  return { expiresInSec: 180 }
}

export async function resendOtp(email: string): Promise<{ expiresInSec: number }> {
  return requestOtp(email)
}

export async function verifyOtp(email: string, otp: string): Promise<void> {
  await wait(resolveDelay(email))
  if (shouldFail(email)) {
    throw new ApiError('NETWORK', 'Verification failed. Please try again.')
  }
  if (otp === '000000') {
    throw new ApiError(
      'EXPIRED',
      'This code has expired. Request a new one to continue.',
    )
  }
  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(
      'INVALID',
      'That code doesn’t match. Check the 6 digits and try again.',
    )
  }
}

export async function submitProfile(): Promise<void> {
  await wait(typicalLatency())
}

export async function completeSignup(): Promise<{ userId: string }> {
  await wait(900 + Math.random() * 500)
  return { userId: `ex_${crypto.randomUUID().slice(0, 8)}` }
}
