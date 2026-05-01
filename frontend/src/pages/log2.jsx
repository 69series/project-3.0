import { useState } from 'react'
import { Chrome, Mail, Lock, KeyRound, ArrowRight } from 'lucide-react'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [view, setView] = useState('login')

  const handleSignin = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8080/signin', {
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
    const res = await fetch('http://localhost:8080/signup/send-otp', {
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
    const res = await fetch('http://localhost:8080/signup/verify-otp', {
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
    const res = await fetch('http://localhost:8080/signup/send-otp', {
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

        {view === 'login' && (
          <>
            <h1 className={styles.title}>Welcome back.</h1>
            <p className={styles.sub}>Enter the shadow realm.</p>
            <form className={styles.form} onSubmit={handleSignin}>
              <div className={styles.inputGroup}>
                <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <input className={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className={styles.btn} type="submit">
                Sign In <ArrowRight size={16} />
              </button>
            </form>
            <div className={styles.divider}><span>or</span></div>
            <a className={styles.googleBtn} href="http://localhost:8080/auth/google">
              <Chrome size={18} />
              Continue with Google
            </a>
            <p className={styles.switch}>
              No account? <button className={styles.link} onClick={() => { setView('signup'); setMessage('') }}>Sign up</button>
            </p>
          </>
        )}

        {view === 'signup' && (
          <>
            <h1 className={styles.title}>Join the shadows.</h1>
            <p className={styles.sub}>Create your account.</p>
            <form className={styles.form} onSubmit={handleSendOtp}>
              <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button className={styles.btn} type="submit">Send OTP</button>
            </form>
            <div className={styles.divider}><span>or</span></div>
            <a className={styles.googleBtn} href="http://localhost:8080/auth/google">
              <Chrome size={18} />
              Continue with Google
            </a>
            <p className={styles.switch}>
              Have an account? <button className={styles.link} onClick={() => { setView('login'); setMessage('') }}>Sign in</button>
            </p>
          </>
        )}

        {view === 'otp' && (
          <>
            <h1 className={styles.title}>Verify identity.</h1>
            <p className={styles.sub}>OTP sent to {email}</p>
            <form className={styles.form} onSubmit={handleVerifyOtp}>
              <div className={styles.inputGroup}>
                <KeyRound size={18} className={styles.fieldIcon} />
                <input className={styles.input} type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <Lock size={18} className={styles.fieldIcon} />
                <input className={styles.input} type="password" placeholder="Set password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className={styles.btn} type="submit">Create Account</button>
            </form>
            <p className={styles.switch}>
              <button className={styles.link} onClick={handleResendOtp}>Resend OTP</button> 
              {' · '} 
              <button className={styles.link} onClick={() => { setView('signup'); setMessage('') }}>Wrong email?</button>
            </p>
          </>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  )
}

export default Login
