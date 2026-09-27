import express from 'express'

// node can read .env on its own now, no dotenv. missing file is fine 
try {
  process.loadEnvFile()
} catch {}

const KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-3.8-flash'
const GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const app = express()
app.use(express.json())

// only job is keeping the key off the client. sends back the raw text, the browser validates it.
// exported so api/generate.js can reuse it as the vercel function
export async function handleGenerate(req, res) {
  const topic = String(req.body?.topic ?? '').trim()

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' })
  }

  if (!KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is missing. Copy .env.example to .env and add your key.',
    })
  }

  const fake = SIMULATED[req.body?.simulate]
  if (fake && process.env.NODE_ENV !== 'production') {
    return fake(res)
  }

  try {
    res.json({ raw: await askGemini(topic) })
  } catch (err) {
    console.error('[generate]', err.message)
    res.status(502).json({ error: 'The AI service did not respond.' })
  }
}

app.post('/api/generate', handleGenerate)

// dev only - fake each failure so the error states can be tested without waiting for gemini to break
const SIMULATED = {
  'bad-json': (res) => res.json({ raw: '{ "topic": "Broken", "cards": [ { "q": "where does this end' }),
  'wrong-shape': (res) =>
    res.json({ raw: JSON.stringify({ topic: 'Wrong', cards: 'not an array', quiz: [] }) }),
  empty: (res) => res.json({ raw: '' }),
  slow: async (res) => {
    await new Promise((done) => setTimeout(done, 30_000))
    res.json({ raw: '' })
  },
  error: (res) => res.status(500).json({ error: 'Simulated server failure.' }),
}

// vercel runs api/generate.js as a function instead, nothing should listen there
if (!process.env.VERCEL) {
  app.listen(8787, () => console.log('api  ready on http://localhost:8787'))
}

// thinkingBudget: 0 turns off reasoning, cut response time from ~8.5s to ~4s
async function askGemini(topic) {
  const response = await fetch(`${GEMINI}?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(topic) }] }],
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini ${response.status}: ${await response.text()}`)
  }

  const body = await response.json()
  // newer models sometimes split one reply across several parts, so join them all
  return (body.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('')
}

// keep this shape in sync with validate.js
function buildPrompt(topic) {
  return `You turn study material into a flashcard deck.

Return ONLY valid JSON matching this exact shape. No markdown, no code fences, no prose:
{
  "topic": string,
  "cards": [{ "q": string, "a": string }],
  "quiz": [{ "question": string, "options": [string, string, string, string], "correctIndex": number }]
}

Rules:
- 6 to 10 cards, 4 to 6 quiz questions.
- Exactly 4 options per quiz question, and correctIndex is 0-based.
- Keep answers to one or two sentences.
- "topic" is a short title for the material.

Study material:
${topic}`
}
