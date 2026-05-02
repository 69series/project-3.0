import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import styles from './Dashboard.module.css'
import Quote from './dshb-ext/Quote'

const STATS = [
  { num: '12', label: 'Projects', accent: true },
  { num: '6',  label: 'Publications', accent: true },
  { num: '8',  label: 'Achievements' },
  { num: '3',  label: 'Ongoing' },
]

const ACTIVITY = [
  { text: 'Published — Smart irrigation system using LoRa', tag: 'Publication', color: '#7c3aed' },
  { text: 'Added — PCB design files for motor controller v2', tag: 'Project', color: '#6366f1' },
  { text: 'Updated — Portfolio with internship details', tag: 'Portfolio', color: '#a78bfa' },
]

// ── Animation variants ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

// ─────────────────────────────────────────────────────────

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
      <motion.div
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />

        <motion.div className={styles.heroTag} variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
          Mission Control
        </motion.div>

        <motion.h1 className={styles.heroTitle} variants={fadeUp} transition={{ duration: 0.45, ease: 'easeOut' }}>
          Welcome back, <span>{user?.displayName?.split(' ')[0]}.</span>
        </motion.h1>

        <motion.p className={styles.heroSub} variants={fadeUp} transition={{ duration: 0.45, ease: 'easeOut' }}>
          Everything you need — projects, publications, lab notes and more. All from the shadows.
        </motion.p>

        <motion.div className={styles.chips} variants={stagger}>
          {['Embedded Systems', 'IoT', 'Signal Processing', 'PCB Design', 'RF Design'].map(c => (
            <motion.span key={c} className={styles.chip} variants={staggerItem}>
              {c}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.sectionTitle}>Overview</div>

        <motion.div
          className={styles.statsGrid}
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {STATS.map(s => (
            <motion.div key={s.label} className={styles.statCard} variants={staggerItem}>
              <div className={`${styles.statNum} ${s.accent ? styles.accent : ''}`}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.sectionTitle}>Recent Activity</div>

        <motion.div
          className={styles.activityList}
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {ACTIVITY.map((a, i) => (
            <motion.div key={i} className={styles.activityItem} variants={staggerItem}>
              <div className={styles.activityDot} style={{ background: a.color }} />
              <span className={styles.activityText}>{a.text}</span>
              <span className={styles.activityTag}>{a.tag}</span>
            </motion.div>
          ))}
        </motion.div>
        <Quote />
      </div>
    </>
  )
}

export default Dashboard