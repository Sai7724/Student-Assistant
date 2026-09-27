const TIMEOUT_MS = 20_000

// returns the raw model text, parsing/validation is in validate.js
export async function generate(topic, simulate) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, simulate }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`)
  }

  return body?.raw ?? ''
}
