// Run with: npm test
// No framework on purpose - node's own assert is enough for one pure function.
import assert from 'node:assert/strict'
import { parseResult } from './validate.js'

const card = { q: 'Q', a: 'A' }
const question = { question: 'Q?', options: ['a', 'b', 'c', 'd'], correctIndex: 2 }
const deck = { topic: 'T', cards: [card], quiz: [question] }
const json = (value) => JSON.stringify(value)

// --- good input ---
assert.deepEqual(parseResult(json(deck)), deck, 'a clean deck passes')
assert.deepEqual(parseResult('```json\n' + json(deck) + '\n```'), deck, 'code fences are stripped')
assert.deepEqual(parseResult(json({ ...deck, topic: undefined })).cards, [card], 'missing topic is tolerated')

// --- stuff the model actually sends back sometimes ---
const bad = {
  'empty string': '',
  'whitespace only': '   ',
  'not a string': null,
  'malformed JSON': '{ "cards": [',
  'prose instead of JSON': 'Sure! Here are your flashcards:',
  'valid JSON, wrong type': json([1, 2, 3]),
  'missing cards': json({ quiz: [question] }),
  'empty cards': json({ cards: [], quiz: [question] }),
  'card missing answer': json({ cards: [{ q: 'Q' }], quiz: [question] }),
  'card with blank answer': json({ cards: [{ q: 'Q', a: '  ' }], quiz: [question] }),
  'quiz with 3 options': json({ cards: [card], quiz: [{ ...question, options: ['a', 'b', 'c'] }] }),
  'correctIndex out of range': json({ cards: [card], quiz: [{ ...question, correctIndex: 9 }] }),
  'correctIndex as a string': json({ cards: [card], quiz: [{ ...question, correctIndex: '2' }] }),
}

for (const [name, input] of Object.entries(bad)) {
  assert.equal(parseResult(input), null, `should reject: ${name}`)
}

console.log(`ok - ${3 + Object.keys(bad).length} checks passed`)
