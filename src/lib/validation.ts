const EMAIL_PATTERN =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export function validateEmail(raw: string): string | null {
  if (!raw.length) return 'Email is required.'
  if (!raw.trim().length) return 'Email cannot be empty.'
  if (/\s/.test(raw)) return 'Please enter a valid email address.'
  if (raw.length > 254) return 'Email is too long.'
  if (!EMAIL_PATTERN.test(raw)) return 'Please enter a valid email address.'
  return null
}

export function validateOtp(otp: string, length = 6): string | null {
  if (!otp.length) return 'Enter the 6-digit code sent to your email.'
  if (otp.length < length) return 'Enter all 6 digits to continue.'
  if (!/^\d+$/.test(otp)) return 'The code can only contain numbers.'
  return null
}

export function validateName(raw: string): string | null {
  if (!raw.length) return 'Name is required.'
  const value = raw.trim()
  if (!value.length) return 'Name cannot be empty.'
  if (value.length < 2) return 'Name must be at least 2 characters.'
  if (value.length > 40) return 'Name must be 40 characters or fewer.'
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) {
    return 'Use letters, spaces, hyphens, or apostrophes only.'
  }
  return null
}

export function validateAge(raw: string): string | null {
  if (!raw.length) return 'Age is required.'
  const value = raw.trim()
  if (!/^\d+$/.test(value)) return 'Enter your age as a whole number.'
  const age = Number(value)
  if (age < 13) return 'Enter a realistic age to continue.'
  if (age < 18) return 'Users must be 18 or older to continue.'
  if (age > 99) return 'Please enter a realistic age.'
  return null
}

export function validatePronouns(value: string): string | null {
  if (!value) return 'Select the pronouns you’d like to show.'
  return null
}

export function validateState(value: string): string | null {
  if (!value) return 'Select your state.'
  return null
}

export function validateCity(value: string, state: string): string | null {
  if (!state) return 'Select a state first.'
  if (!value) return 'Select your city.'
  return null
}

export function validateCollege(value: string, city: string): string | null {
  if (!city) return 'Select a city first.'
  if (!value) return 'Select your college or “Not a student”.'
  return null
}

export function clampAgeInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 2)
}
