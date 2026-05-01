import { useState, useEffect } from 'react'
import styles from './Quote.module.css'

const quotes = [
  "Ship it. Fix it later.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "The best error message is the one that never shows up.",
  "Done is better than perfect.",
  "Talk is cheap. Show me the code. — Linus Torvalds"
]

export default function Quote() {
  const [quote, setQuote] = useState('')
  const [visible, setVisible] = useState(true)

  const getNewQuote = () => {
    setVisible(false)
    setTimeout(() => {
      let idx
      do { idx = Math.floor(Math.random() * quotes.length) }
      while (quotes[idx] === quote)
      setQuote(quotes[idx])
      setVisible(true)
    }, 150)
  }

  useEffect(() => { getNewQuote() }, [])

  return (
    <div className={styles.quoteContainer}>
      <div className={styles.topAccent} />
      <div className={styles.quoteIcon}>"</div>
      <p className={`${styles.quoteText} ${visible ? styles.visible : styles.hidden}`}>
        {quote}
      </p>
      <button onClick={getNewQuote} className={styles.quoteBtn}>
        ↻ New Quote
      </button>
    </div>
  )
}