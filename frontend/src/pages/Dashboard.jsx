import { useEffect, useState } from 'react'

function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }

    fetch('http://localhost:8080/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('token')
          window.location.href = '/'
        }
        return res.json()
      })
      .then(data => setUser(data))
      .catch(() => window.location.href = '/')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard