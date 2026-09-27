import { useState } from 'react'

const EXAMPLES = ['Explain AGI', 'React hooks', 'Explain Rag']

// submit isn't disabled while loading on purpose - App ignores stale responses
export default function PromptInput({ onSubmit, busy }) {
  const [text, setText] = useState('')
  const [simulate, setSimulate] = useState('')

  const empty = text.trim() === ''
  const words = empty ? 0 : text.trim().split(/\s+/).length

  function submit(e) {
    e.preventDefault()
    if (!empty) onSubmit(text.trim(), simulate)
  }

  // ctrl/cmd + enter, plain enter is a newline
  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(e)
  }

  return (
    <form className="paper" onSubmit={submit}>
      <label className="label" htmlFor="topic">
        Topic or notes
      </label>

      <textarea
        id="topic"
        rows={5}
        value={text}
        autoFocus
        onKeyDown={handleKeyDown}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your notes, or just name a topic..."
      />

      <div className="chips">
        <span className="hint">Try:</span>
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="chip" onClick={() => setText(example)}>
            {example}
          </button>
        ))}
      </div>

      {import.meta.env.DEV && (
        <label className="sim">
          Simulate a failure:
          <select value={simulate} onChange={(e) => setSimulate(e.target.value)}>
            <option value="">none - call the real model</option>
            <option value="bad-json">malformed JSON</option>
            <option value="wrong-shape">valid JSON, wrong shape</option>
            <option value="empty">empty response</option>
            <option value="slow">slow (hits the 20s timeout)</option>
            <option value="error">server error</option>
          </select>
        </label>
      )}

      <div className="actions">
        <span className="hint">
          {words > 0 && `${words} word${words === 1 ? '' : 's'} · `}Ctrl + Enter
        </span>
        <button className={`primary ${busy ? 'is-busy' : ''}`} type="submit" disabled={empty}>
          {busy ? 'Generate again' : 'Generate deck'}
        </button>
      </div>
    </form>
  )
}
