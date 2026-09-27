import { useEffect, useState } from 'react'

// not real progress - the api doesn't stream, these just rotate every 3s
const STEPS = [
  'Reading your notes',
  'Picking out the key ideas',
  'Writing flashcards',
  'Drafting quiz questions',
  'Shuffling the deck',
]

export default function LoadingState() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const step = STEPS[Math.min(Math.floor(seconds / 3), STEPS.length - 1)]
  const widths = ['70%', '92%', '45%']

  return (
    <section className="paper" aria-busy="true" aria-live="polite">
      <div className="meta">
        <p className="label thinking">
          {step}
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>
        <span className="counter" aria-hidden="true">
          {seconds}s
        </span>
      </div>
      {widths.map((width) => (
        <div key={width} className="skeleton" style={{ width }} />
      ))}
    </section>
  )
}
