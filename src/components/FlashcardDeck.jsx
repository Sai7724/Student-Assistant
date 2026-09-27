import { useState } from 'react'
import { Bulb, QuestionMark } from './Doodles.jsx'

// renders browsable flashcards 
export default function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [dir, setDir] = useState(1) // 1 = next, -1 = previous; picks the deal-in side

  const card = cards[index]
  const atStart = index === 0
  const atEnd = index === cards.length - 1

  // handles moving between cards 
  function go(step) {
    setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + step)))
    setFlipped(false)
    setDir(step)
  }

  // keyboard events on flashcard 
  function handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      go(1)
    } else if (e.key === 'ArrowLeft') {
      go(-1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((f) => !f)
    }
  }

  return (
    <div className="deck">
      <div className="meta">
        <span className="label">Flashcards</span>
        <span className="counter" key={index}>
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(index + 1) / cards.length})` }} />
      </div>

      {/* decorative cards visuals */}
      <div className="stack">
        <div
          className={`flip ${flipped ? 'is-flipped' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Flashcard ${index + 1} of ${cards.length}. Press Enter to flip.`}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={handleKeyDown}
        >
          {/* Keyed wrapper remounts per card to replay the deal-in animation.
              It sits inside .flip so the focused element is never replaced. */}
          <div className={`deal ${dir < 0 ? 'from-left' : ''}`} key={index}>

            {/*flashcard front and back faces*/}
            <div className="flip-inner">
              <div className="face" key={`q${index}`}>
                <span className="face-label">
                  <QuestionMark />
                  Question
                </span>
                <p className="face-text">{card.q}</p>
                <QuestionMark className="face-doodle" />
              </div>

              <div className="face back" key={`a${index}`}>
                <span className="face-label">
                  <Bulb />
                  Answer
                </span>
                <p className="face-text">{card.a}</p>
                <Bulb className="face-doodle" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="deck-nav">
        <button className="ghost" onClick={() => go(-1)} disabled={atStart}>
          Previous
        </button>
        <span className="hint">Click to flip &middot; arrows to move</span>
        <button className="ghost" onClick={() => go(1)} disabled={atEnd}>
          Next
        </button>
      </div>
    </div>
  )
}
