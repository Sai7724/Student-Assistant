import { Cross } from './Doodles.jsx'

// same card for every kind of failure, retry re-sends the last request
export default function ErrorState({ message, onRetry }) {
  return (
    <section className="paper error rise" role="alert">
      <Cross className="error-mark" />
      <div>
        <h2>That didn&apos;t work</h2>
        <p className="sub">{message}</p>
        <button className="primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    </section>
  )
}
