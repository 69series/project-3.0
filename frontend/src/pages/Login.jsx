import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [view, setView] = useState('login') // 'login' | 'signup' | 'otp'

  // ── Signin ──────────────────────────────────────────────
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

  // ── Send OTP ─────────────────────────────────────────────
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

  // ── Verify OTP + Create Account ───────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8080/signup/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('Account created! Please sign in.')
      setView('login')
    } else {
      setMessage(data.message)
    }
  }

  // ── Resend OTP ────────────────────────────────────────────
  const handleResendOtp = async () => {
    const res = await fetch('http://localhost:8080/signup/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    setMessage(res.ok ? 'OTP resent! Check your email.' : data.message)
  }

  // ── Views ─────────────────────────────────────────────────
  if (view === 'login') return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Sign In</button>
      </form>
      <a href="http://localhost:8080/auth/google">Login with Google</a>
      <p>No account? <button onClick={() => { setView('signup'); setMessage('') }}>Sign Up</button></p>
      {message && <p>{message}</p>}
    </div>
  )

  if (view === 'signup') return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSendOtp}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Send OTP</button>
      </form>
      <a href="http://localhost:8080/auth/google">Sign Up with Google</a>
      <p>Already have an account? <button onClick={() => { setView('login'); setMessage('') }}>Sign In</button></p>
      {message && <p>{message}</p>}
    </div>
  )

  if (view === 'otp') return (
    <div>
      <h1>Verify OTP</h1>
      <p>OTP sent to {email}</p>
      <form onSubmit={handleVerifyOtp}>
        <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
        <input type="password" placeholder="Set Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Create Account</button>
      </form>
      <button onClick={handleResendOtp}>Resend OTP</button>
      <p>Wrong email? <button onClick={() => { setView('signup'); setMessage('') }}>Go back</button></p>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Login