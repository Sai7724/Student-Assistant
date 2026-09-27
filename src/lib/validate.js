// null for anything that isn't a usable deck. gemini sometimes wraps the json in ``` fences
// even when the prompt says not to, so strip those first
export function parseResult(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null

  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/, '')
    .replace(/\s*```$/, '')

  let data
  try {
    data = JSON.parse(cleaned)
  } catch {
    return null
  }

  return isDeck(data) ? data : null
}

// typeof null and typeof [] are both 'object'
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)

const isText = (v) => typeof v === 'string' && v.trim() !== ''

const isCard = (c) => isObject(c) && isText(c.q) && isText(c.a)

const isQuestion = (q) =>
  isObject(q) &&
  isText(q.question) &&
  Array.isArray(q.options) &&
  q.options.length === 4 &&
  q.options.every(isText) &&
  Number.isInteger(q.correctIndex) &&
  q.correctIndex >= 0 &&
  q.correctIndex < 4

// topic is optional, App falls back to what the user typed
const isDeck = (d) =>
  isObject(d) &&
  Array.isArray(d.cards) &&
  d.cards.length > 0 &&
  d.cards.every(isCard) &&
  Array.isArray(d.quiz) &&
  d.quiz.length > 0 &&
  d.quiz.every(isQuestion)
