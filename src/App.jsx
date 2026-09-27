import { useRef, useState } from 'react'
import PromptInput from './components/PromptInput.jsx'
import LoadingState from './components/LoadingState.jsx'
import ErrorState from './components/ErrorState.jsx'
import FlashcardDeck from './components/FlashcardDeck.jsx'
import Quiz from './components/Quiz.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { LoopArrow, NotebookMark, Squiggle } from './components/Doodles.jsx'
import { generate } from './lib/api.js'
import { parseResult } from './lib/validate.js'

const STATUS_TEXT = {
  idle: 'Ready when you are',
  loading: 'Thinking',
  ready: 'Deck ready',
  error: 'Hit a snag',
}

// one status string (idle / loading / ready / error) instead of a pile of isLoading/hasError flags
export default function App() {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [last, setLast] = useState({ topic: '', simulate: '' })
  const [runId, setRunId] = useState(0)
  const requestId = useRef(0)

  // every request gets an id - if an older one comes back late, it gets dropped
  async function run(topic, simulate) {
    const id = ++requestId.current
    setLast({ topic, simulate })
    setStatus('loading')

    try {
      const deck = parseResult(await generate(topic, simulate))
      if (id !== requestId.current) return
      if (!deck) throw new Error("The AI's reply wasn't in the format we expected.")

      setData({ ...deck, topic: deck.topic || topic })
      setRunId((n) => n + 1)
      setStatus('ready')
    } catch (err) {
      if (id !== requestId.current) return
      setError(messageFor(err))
      setStatus('error')
    }
  }

  return (
    <div className="shell">
      <header className="masthead">
        <NotebookMark className="mark" />

        <div>
          <h1 className="wordmark">Study Assistant</h1>
          <Squiggle className="wordmark-rule" />
          <p className="tagline">
            Paste a topic or a page of notes. Get cards to flip, a quiz to take,
            and a second pass over whatever you got wrong.
          </p>
        </div>

        <span className={`status status-${status}`} aria-hidden="true">
          <i />
          {STATUS_TEXT[status]}
        </span>

        <ThemeToggle />
      </header>

      <div className="workspace">
        <div className="rail">
          <PromptInput onSubmit={run} busy={status === 'loading'} />
        </div>

        <div>
          {status === 'idle' && <HowItWorks />}
          {status === 'loading' && <LoadingState />}
          {status === 'error' && (
            <ErrorState message={error} onRetry={() => run(last.topic, last.simulate)} />
          )}
          {status === 'ready' && <Result key={runId} data={data} />}
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = ['Give it a topic', 'Flip through the cards', 'Take the quiz, re-test the misses']

  return (
    <section className="paper rise">
      <ol className="steps">
        {steps.map((step, i) => (
          <li key={step}>
            <span className="step-no">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <LoopArrow className="steps-arrow" />
    </section>
  )
}

// both tabs stay mounted (just hidden) so switching doesn't reset the quiz
function Result({ data }) {
  const [tab, setTab] = useState('cards')

  return (
    <section className="paper rise">
      <div className="result-head">
        <h2 className="deck-title">{data.topic}</h2>
        <div className="tabs">
          <Tab id="cards" active={tab} onPick={setTab}>
            Cards ({data.cards.length})
          </Tab>
          <Tab id="quiz" active={tab} onPick={setTab}>
            Quiz ({data.quiz.length})
          </Tab>
        </div>
      </div>

      <div hidden={tab !== 'cards'}>
        <FlashcardDeck cards={data.cards} />
      </div>
      <div hidden={tab !== 'quiz'}>
        <Quiz questions={data.quiz} />
      </div>
    </section>
  )
}

function Tab({ id, active, onPick, children }) {
  return (
    <button
      className={`tab ${active === id ? 'is-active' : ''}`}
      aria-pressed={active === id}
      onClick={() => onPick(id)}
    >
      {children}
    </button>
  )
}

// fetch errors -> something a person can read
function messageFor(err) {
  if (err.name === 'TimeoutError') {
    return 'That took too long to come back. The model may be busy - try again.'
  }
  if (err.name === 'TypeError') {
    return "Couldn't reach the server. Is it running?"
  }
  return err.message
}
