import { useLocation } from 'react-router-dom'
import PageShell from '../components/PageShell'
import styles from './Dashboard.module.css'

const STATS = [
  { num: '12', label: 'Projects', accent: true },
  { num: '4',  label: 'Publications' },
  { num: '8',  label: 'Achievements' },
  { num: '3',  label: 'Ongoing' },
]

const ACTIVITY = [
  { text: 'Published — Smart irrigation system using LoRa', tag: 'Publication', color: '#7c3aed' },
  { text: 'Added — PCB design files for motor controller v2', tag: 'Project', color: '#6366f1' },
  { text: 'Updated — Portfolio with internship details', tag: 'Portfolio', color: '#a78bfa' },
]

function Dashboard() {
  return (
    <PageShell>
      {(user) => <DashboardContent user={user} />}
    </PageShell>
  )
}

function DashboardContent({ user }) {
  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />
        <div className={styles.heroTag}>Mission Control</div>
        <h1 className={styles.heroTitle}>
          Welcome back, <span>{user?.displayName?.split(' ')[0]}.</span>
        </h1>
        <p className={styles.heroSub}>
          Everything you need — projects, publications, lab notes and more.
          All from the shadows.
        </p>
        <div className={styles.chips}>
          {['Embedded Systems', 'IoT', 'Signal Processing', 'PCB Design'].map(c => (
            <span key={c} className={styles.chip}>{c}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.sectionTitle}>Overview</div>
        <div className={styles.statsGrid}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={`${styles.statNum} ${s.accent ? styles.accent : ''}`}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle}>Recent Activity</div>
        <div className={styles.activityList}>
          {ACTIVITY.map((a, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityDot} style={{ background: a.color }} />
              <span className={styles.activityText}>{a.text}</span>
              <span className={styles.activityTag}>{a.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard