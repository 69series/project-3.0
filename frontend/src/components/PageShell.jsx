import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import styles from './PageShell.module.css'

const API = import.meta.env.VITE_API_URL

function PageShell({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/'; return }

    fetch(`${API}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) { localStorage.removeItem('token'); window.location.href = '/'; return null }
        return res.json()
      })
      .then(data => { if (data) setUser(data) })
      .catch(() => window.location.href = '/')
  }, [])

  if (!user) return <div className={styles.loading}>INITIALIZING...</div>

  return (
    <div className={styles.shell}>
      <Sidebar user={user} />
      <main className={styles.main}>
        {typeof children === 'function' ? children(user) : children}
      </main>
    </div>
  )
}

export default PageShell