import { Link } from 'react-router-dom'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="logo" aria-label="SceneOn home">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="8" y1="4" x2="58" y2="60">
            <stop stopColor="#1a1040" />
            <stop offset="0.42" stopColor="#7a2cff" />
            <stop offset="0.72" stopColor="#e11d74" />
            <stop offset="1" stopColor="#ff7a18" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logoGrad)" />
        <text
          x="18"
          y="46"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="38"
          fontWeight="700"
          fill="#fff"
        >
          S
        </text>
        <circle cx="46" cy="18" r="4.5" fill="#fff" />
      </svg>
      {!compact && <span className="logo-word">SceneOn</span>}
    </Link>
  )
}
