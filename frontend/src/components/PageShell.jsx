import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import styles from './PageShell.module.css'

const API = import.meta.env.VITE_API_URL

function PageShell({ children }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  if (!user) return <div className={styles.loading}></div>

  return (
    <div className={styles.shell}>
      {/* Mobile header bar */}
      <div className={styles.mobileHeader}>
        <button className={styles.hamburger} onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <span className={styles.mobileName}>NARENDRA SAGOLSEM</span>
        <span className={styles.mobileDot} />
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <motion.main
        className={styles.main}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {typeof children === 'function' ? children(user) : children}
      </motion.main>
    </div>
  )
}

export default PageShell