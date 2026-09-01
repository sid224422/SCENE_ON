import type { WizardStep } from '../lib/types'

const LABELS = ['Email', 'Verify', 'About you', 'Your city']

export function Progress({ step, energy = 0 }: { step: WizardStep; energy?: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={4}
      aria-valuenow={step}
      aria-label="Signup progress"
    >
      {LABELS.map((label, index) => {
        const n = (index + 1) as WizardStep
        const status = n < step ? 'is-done' : n === step ? 'is-current' : ''
        const fill = n < step ? 100 : n === step ? Math.max(8, Math.round(energy * 100)) : 0
        return (
          <div key={label} className={`progress-seg ${status}`} title={label}>
            <span style={{ width: `${fill}%` }} />
          </div>
        )
      })}
    </div>
  )
}
