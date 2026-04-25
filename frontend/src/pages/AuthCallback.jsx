import { useEffect } from 'react'

function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      localStorage.setItem('token', token)
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/?error=google_failed'
    }
  }, [])

  return <p>Logging you in...</p>
}

export default AuthCallback