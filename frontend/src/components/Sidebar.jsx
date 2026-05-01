import { useNavigate, useLocation } from 'react-router-dom'
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

function Sidebar({ user }) {
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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <div className={styles.sidebarName}>
          <span className={styles.sidebarDot} />
          NARENDRA SAGOLSEM
        </div>
        <div className={styles.sidebarRole}>Electronics Engineers</div>
      </div>

      <nav className={styles.nav}>
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className={styles.navSection}>{item.section}</div>
          ) : (
            <div
              key={i}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.label}</span>
              {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            </div>
          )
        )}
      </nav>

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