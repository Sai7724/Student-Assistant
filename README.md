# Study Assistant

Paste a topic or a page of notes and get a flashcard deck plus a quiz. Take the quiz,
then re-test just the ones you got wrong.

React + Vite on the frontend, a tiny Express server serving the API key, and Gemini
generating the content. The model returns JSON, the app validates it, and React renders
it - raw model text never shows up on screen.

## Features

- Flashcards with a 3D flip and a slide-in on card transitions
- Quiz with a re-test loop on the questions you missed (plus some confetti on a correct answer)
- Keyboard shortcuts - arrows / space on the cards, 1-4 and enter in the quiz
- Light and dark mode, no flash on load
- Loading, error and retry states for every way the request can fail
- Mobile-friendly and respects reduced-motion

## Running it

```bash
npm install
cp .env.example .env   # add your Gemini key
npm start
```

Free key: https://aistudio.google.com/apikey

`npm start` runs Vite on 5173 and the API on 8787. Vite proxies `/api/` to the API,
so the browser only talks to one origin.

```bash
npm test         # validator tests
```

## How it works
```

PromptInput → App.run() → lib/api.js → Express → Gemini
↓                    │
lib/validate.js ←────── raw model text ────────┘
↓
deck object or null → error state
↓
FlashcardDeck / Quiz
```

The model is asked for this shape:

```js
{
topic: string,
cards: [{ q: string, a: string }],
quiz: [{ question: string, options: [string, string, string, string], correctIndex: number }]
}
```

One call gives you both the cards and the quiz.

| File | What it does |
|---|---|
| `src/App.jsx` | All the app state (`idle → loading → ready / error`) and the stale-request guard |
| `src/lib/api.js` | The fetch call + 20s timeout |
| `src/lib/validate.js` | Raw text in, deck or `null` out. Pure function, tested |
| `src/lib/useKeys.js` | Page-wide keyboard shortcuts |
| `src/components/FlashcardDeck.jsx` | Card index, flip, slide-in |
| `src/components/Quiz.jsx` | Quiz rounds and the re-test loop |
| `server/index.js` | Keeps the key server-side, calls Gemini |

## Dealing with bad AI output

The server returns the model's raw text and all the validation happens in `validate.js`, so it's a single point of check. Anything unusable becomes `null` → one error path in `App`.

- Broken JSON - caught around `JSON.parse`
- Code fences - Gemini sometimes wraps the JSON in ` ```json ` even when told not to, so they get stripped
- Correct JSON, wrong shape - every card and question is checked, exactly 4 options and `correctIndex` in range
- Empty reply - treated as a failure, not an empty deck
- Too slow - `AbortSignal.timeout(20_000)`
- Server / upstream errors - error card with a retry that re-sends the same input
- Out-of-order responses - each request has an id, older ones get dropped

In dev there's a "Simulate a failure" dropdown to trigger each of these on purpose. It's stripped from production builds and the server ignores it in production.

## Some decisions

- Server returns raw text, not parsed JSON. Its only job is to hide the key.
- No Gemini JSON mode. It guarantees valid syntax but not the shape, so I'd still need a validator.
- `thinkingBudget: 0`. Took responses from ~8.5s to ~4s. Turning notes into flashcards doesn't need reasoning.
- No dotenv / zod. `process.loadEnvFile()` is built into Node, and the validator is ~30 lines.
- Submit stays enabled while loading. Disabling it would just hide the race condition instead of handling it.
- `` so a new deck is a fresh component and old quiz state can't leak in.
- Both tabs are mounted (`hidden`) so switching to the cards doesn't wipe your quiz progress.

## Known issues / todo

- Long answers risk overflowing a card (the 3D flip makes `overflow` on the faces tricky)
- Bad output goes straight to the error state - an automatic retry would fix most of them
- Nothing is saved, a reload loses your deck
- No rate limiting on the API
- Quiz options aren't shuffled
- Next: stream cards in one at a time (NDJSON), save sessions, "make these harder" follow-ups

## AI usage

I used Claude as a coding assistant for the following parts; I've reviewed and tested all of it.

- Code comments - writing and cleaning up the comments across the codebase
- Doodle design - the hand-drawn SVG icons (squiggle, bulb, sparkle, etc.) and their draw-on animation
- UI polish - the color palette and background glow, the header status pill, the loading step text and timer,
progress bars, the quiz pop/shake feedback, the confetti on correct answers, the card slide-in animation
- Quiz keyboard shortcuts - the `useKeys` hook (1-4 to answer, enter to continue)

The core of the app is my own work: the data shape, the prompt, the Express proxy, the validator
and its tests, the app state and stale-request guard, and the flashcard / quiz logic.