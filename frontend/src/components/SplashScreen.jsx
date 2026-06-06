import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

export default function SplashScreen({ onDone }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 1600)
    const t2 = setTimeout(() => onDone(), 2050)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`${styles.screen} ${hiding ? styles.hide : ''}`}>
      <div className={styles.inner}>
        <img src="/logo.png" alt="garib" className={styles.logo} />
        <p className={styles.tagline}>Премиальные ароматы</p>
      </div>
    </div>
  )
}
