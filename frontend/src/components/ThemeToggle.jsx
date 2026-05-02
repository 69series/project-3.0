import { useTheme } from '../context/ThemeContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isLight = theme === 'light'

  return (
    <label className={styles.switch} title="Toggle theme">
      <input type="checkbox" checked={isLight} onChange={toggle} />
      <div className={styles.track}>
        <div className={styles.thumb}>
          {isLight ? '☀' : '☽'}
        </div>
      </div>
    </label>
  )
}