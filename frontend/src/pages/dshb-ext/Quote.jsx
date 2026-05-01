import { useState, useEffect } from 'react'
import styles from './Quote.module.css';

export default function Quote() {
  const [quote, setQuote] = useState('')

  const quotes = [
    "Ship it. Fix it later.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "First, solve the problem. Then, write the code.",
    "Simplicity is the soul of efficiency.",
    "Make it work, make it right, make it fast.",
    "The best error message is the one that never shows up.",
    "Done is better than perfect.",
    "Talk is cheap. Show me the code. – Linus Torvalds"
  ]

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }

  useEffect(() => {
    getNewQuote() // Set initial quote on load
  }, [])

  return (
    <div className={styles.quoteContainer}>
      <p className={styles.quoteText}>
        "{quote}"
      </p>
      <button
        onClick={getNewQuote}
        className={styles.quoteBtn}
      >
        New quote ↻
      </button>
    </div>
  )
}