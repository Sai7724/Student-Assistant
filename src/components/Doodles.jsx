// currentColor so the icons just follow the text color (dark mode for free)
const BASE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

// pathLength="1" on every path -> one css animation can draw any of these
export function Squiggle({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 120 12" strokeWidth="2.5" {...BASE}>
      <path pathLength="1" d="M2 7c14-6 27 3 41-1s24-7 36-2 27 6 39 1" />
    </svg>
  )
}

export function Sparkle({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 32 32" strokeWidth="2" {...BASE}>
      <path pathLength="1" d="M16 3c1.5 7.5 5.5 11.5 13 13-7.5 1.5-11.5 5.5-13 13-1.5-7.5-5.5-11.5-13-13 7.5-1.5 11.5-5.5 13-13Z" />
    </svg>
  )
}

export function LoopArrow({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 64 48" strokeWidth="2" {...BASE}>
      <path pathLength="1" d="M4 8c12-4 26 0 33 9s5 21-5 24-19-6-14-14 20-9 30-2 12 12 12 12" />
      <path pathLength="1" d="M52 37l8 1-3 7" />
    </svg>
  )
}

export function Bulb({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 32 40" strokeWidth="2" {...BASE}>
      <path pathLength="1" d="M16 3c-6.5 0-11 4.6-11 10.5 0 4 2.2 6.4 4 8.6 1.4 1.7 2 3 2 4.9h10c0-1.9.6-3.2 2-4.9 1.8-2.2 4-4.6 4-8.6C27 7.6 22.5 3 16 3Z" />
      <path pathLength="1" d="M12 31h8M13 35h6" />
    </svg>
  )
}

export function QuestionMark({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 28 40" strokeWidth="2.4" {...BASE}>
      <path pathLength="1" d="M6 12c0-6 4.5-9 9-9s8.5 3.5 8.5 8.5c0 6.5-8.5 7-8.5 13" />
      <path pathLength="1" d="M15 33.5v.5" />
    </svg>
  )
}

export function Cross({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 24 24" strokeWidth="2.4" {...BASE}>
      <path pathLength="1" d="M5 5c4.5 4.8 9 9.6 14 14" />
      <path pathLength="1" d="M19 5.5c-5 4.5-9.5 9.5-14 13.5" />
    </svg>
  )
}

export function NotebookMark({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 34 34" strokeWidth="2.2" {...BASE}>
      <path pathLength="1" d="M7 4h16c2.2 0 4 1.9 4 4.2v21.3c0 0-2-2.2-4-2.2H7Z" />
      <path pathLength="1" d="M12 12h9M12 18h7" />
    </svg>
  )
}

export function Sun({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 32 32" strokeWidth="2" {...BASE}>
      <path pathLength="1" d="M16 9.5c-3.7 0-6.6 2.8-6.6 6.4 0 3.7 3 6.6 6.7 6.5 3.6 0 6.4-3 6.3-6.6 0-3.6-2.8-6.3-6.4-6.3Z" />
      <path pathLength="1" d="M16 2.5v3.6M16 25.9v3.6M2.5 16h3.6M25.9 16h3.6M6.6 6.3l2.6 2.6M22.8 22.6l2.6 2.7M25.4 6.4l-2.6 2.6M9.2 22.7l-2.7 2.6" />
    </svg>
  )
}

export function Moon({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 32 32" strokeWidth="2" {...BASE}>
      <path pathLength="1" d="M25.5 19.8A11.2 11.2 0 0 1 12.4 5.2a11.4 11.4 0 1 0 13.1 14.6Z" />
    </svg>
  )
}
