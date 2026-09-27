import { useRef, useState } from 'react'
import { useKeys } from '../lib/useKeys.js'
import { Cross, Sparkle } from './Doodles.jsx'

// re-test is just a new round made of the wrong ones, no separate mode
export default function Quiz({ questions }) {
  const [round, setRound] = useState(questions)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])

  const question = round[i]
  const done = i >= round.length

  // derived instead of stored so it can't get out of sync
  const answered = i + (picked !== null ? 1 : 0)
  const correct = answered - wrong.length

  // only the first pick counts
  function pick(option) {
    if (picked !== null) return

    setPicked(option)
    if (option !== question.correctIndex) {
      setWrong((w) => [...w, question])
    }
  }

  function next() {
    setPicked(null)
    setI(i + 1)
  }

  function start(nextRound) {
    setRound(nextRound)
    setWrong([])
    setI(0)
    setPicked(null)
  }

  // 1-4 to answer, enter or -> for next, enter on the score screen to re-test
  const quiz = useRef(null)
  useKeys(quiz, (key) => {
    if (done) {
      if (key !== 'Enter') return false
      start(wrong.length ? wrong : questions)
    } else if (picked === null && /^[1-4]$/.test(key)) {
      pick(Number(key) - 1)
    } else if (picked !== null && (key === 'Enter' || key === 'ArrowRight')) {
      next()
    } else return false
    return true
  })

  if (done) {
    return (
      <div className="quiz rise" ref={quiz}>
        <div className="scoreboard">
          <p className="score">
            {correct}/{round.length}
          </p>
          {wrong.length === 0 && <Sparkle className="score-sparkle" />}
        </div>

        <p className="sub">
          {wrong.length === 0
            ? 'Clean round. Nothing left to re-test.'
            : `${wrong.length} to go back over.`}
        </p>

        <div className="deck-nav">
          {wrong.length > 0 && (
            <button className="primary" onClick={() => start(wrong)}>
              Re-test {wrong.length} wrong
            </button>
          )}
          <button className="ghost" onClick={() => start(questions)}>
            Start over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz" ref={quiz}>
      <div className="meta">
        <span className="label">
          Question {i + 1} of {round.length}
        </span>
        <span className="counter" key={correct}>
          {correct} correct
        </span>
      </div>

      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${answered / round.length})` }} />
      </div>

      <p className="question">{question.question}</p>

      <ul className="options" key={i}>
        {question.options.map((option, n) => {
          const isCorrect = n === question.correctIndex
          const isPickedWrong = n === picked && !isCorrect

          return (
            <li key={n}>
              <button
                className={`option ${optionClass(n, picked, question.correctIndex)}`}
                disabled={picked !== null}
                onClick={() => pick(n)}
              >
                <kbd>{n + 1}</kbd>
                {option}
              </button>

              {isPickedWrong && <Cross className="option-mark cross" />}
              {picked === n && isCorrect && <Confetti />}
            </li>
          )
        })}
      </ul>

      {picked !== null && (
        <div className="deck-nav">
          <span className={`verdict ${picked === question.correctIndex ? 'is-ok' : 'is-bad'}`}>
            {picked === question.correctIndex && <Sparkle className="verdict-sparkle" />}
            {picked === question.correctIndex
              ? 'Correct.'
              : `Answer: ${question.options[question.correctIndex]}`}
          </span>
          <button className="primary" onClick={next}>
            {i === round.length - 1 ? 'See score' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  )
}

// spread comes from the index, not Math.random, so it doesn't jump around on re-render
function Confetti() {
  return (
    <span className="confetti" aria-hidden="true">
      {Array.from({ length: 22 }, (_, n) => (
        <i
          key={n}
          style={{
            '--x': `${6 + ((n * 37) % 88)}%`,
            '--a': `${((n * 47) % 140) - 70}deg`,
            '--d': `${55 + ((n * 23) % 55)}px`,
            '--c': `var(--${['accent', 'accent-2', 'highlight', 'ok'][n % 4]})`,
            animationDelay: `${(n % 5) * 25}ms`,
          }}
        />
      ))}
    </span>
  )
}

function optionClass(n, picked, correctIndex) {
  if (picked === null) return ''
  if (n === correctIndex) return 'is-correct'
  if (n === picked) return 'is-wrong'
  return ''
}
