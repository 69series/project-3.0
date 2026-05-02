import { useState, useEffect } from 'react'
import styles from './Login.module.css'

const API = import.meta.env.VITE_API_URL

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [view, setView] = useState('login')

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) window.location.href = '/dashboard'
}, [])

  const handleSignin = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      window.location.href = '/dashboard'
    } else {
      setMessage(data.message)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/signup/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('OTP sent! Check your email.')
      setView('otp')
    } else {
      setMessage(data.message)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/signup/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('Account created! Sign in now.')
      setView('login')
    } else {
      setMessage(data.message)
    }
  }

  const handleResendOtp = async () => {
    const res = await fetch(`${API}/signup/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    setMessage(res.ok ? 'OTP resent!' : data.message)
  }

  return (
    <div className={styles.shell}>
      <div className={styles.glow} />
      <div className={styles.card}>

        <div className={styles.brand}>
          <div className={styles.brandDot} />
          <span>ALEX ALDERSON</span>
        </div>

        {view === 'login' && <>
          <h1 className={styles.title}>Welcome back.</h1>
          <p className={styles.sub}>Enter the shadow realm.</p>
          <form className={styles.form} onSubmit={handleSignin}>
            <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button className={styles.btn} type="submit">Sign In</button>
          </form>
          <div className={styles.divider}><span>or</span></div>
          <a className={styles.googleBtn} href={`${API}/auth/google`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>
          <p className={styles.switch}>No account? <button className={styles.link} onClick={() => { setView('signup'); setMessage('') }}>Sign up</button></p>
        </>}

        {view === 'signup' && <>
          <h1 className={styles.title}>Join the shadows.</h1>
          <p className={styles.sub}>Create your account.</p>
          <form className={styles.form} onSubmit={handleSendOtp}>
            <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button className={styles.btn} type="submit">Send OTP</button>
          </form>
          <div className={styles.divider}><span>or</span></div>
          <a className={styles.googleBtn} href={`${API}/auth/google`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>
          <p className={styles.switch}>Have an account? <button className={styles.link} onClick={() => { setView('login'); setMessage('') }}>Sign in</button></p>
        </>}

        {view === 'otp' && <>
          <h1 className={styles.title}>Verify identity.</h1>
          <p className={styles.sub}>OTP sent to {email}</p>
          <form className={styles.form} onSubmit={handleVerifyOtp}>
            <input className={styles.input} type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
            <input className={styles.input} type="password" placeholder="Set password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button className={styles.btn} type="submit">Create Account</button>
          </form>
          <p className={styles.switch}><button className={styles.link} onClick={handleResendOtp}>Resend OTP</button> · <button className={styles.link} onClick={() => { setView('signup'); setMessage('') }}>Wrong email?</button></p>
        </>}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  )
}

export default Login