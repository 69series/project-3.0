import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, User, FolderGit2, BookOpen, FlaskConical, Mail, CakeSliceIcon } from 'lucide-react'
import styles from './Sidebar.module.css'

const NAV = [
  { section: 'Main' },
  { icon: <LayoutDashboard size={15} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <User size={15} />, label: 'Portfolio', path: '/portfolio' },
  { section: 'Work' },
  { icon: <FolderGit2 size={15} />, label: 'Projects', path: '/projects', badge: 'lolicon' },
  { icon: <BookOpen size={15} />, label: 'Works & Publications', path: '/publications' },
  { icon: <FlaskConical size={15} />, label: 'Lab Notes', path: '/labnotes' },
  { section: 'Connect' },
  { icon: <Mail size={15} />, label: 'Contact', path: '/contact' },
  { icon: <CakeSliceIcon size={15} />, label: 'Cake', path: '/pice' },
]

const navStagger = {
  open: { transition: { staggerChildren: 0.06 } },
  closed: {}
}

const navItemVariant = {
  open: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  closed: { opacity: 0, x: -12 }
}

function Sidebar({ user, isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const initials = user?.displayName
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarLogo}>
        <div className={styles.sidebarName}>
          <span className={styles.sidebarDot} />
          NARENDRA SAGOLSEM
        </div>
        <div className={styles.sidebarRole}>Electronics Engineers</div>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <motion.nav
        className={styles.nav}
        initial="closed"
        animate="open"
        variants={navStagger}
      >
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className={styles.navSection}>{item.section}</div>
          ) : (
            <motion.div
              key={i}
              variants={navItemVariant}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => handleNav(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.label}</span>
              {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            </motion.div>
          )
        )}
      </motion.nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.avatarName}>{user?.displayName}</div>
            <div className={styles.avatarRole}>Visitor</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ⇥ Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar