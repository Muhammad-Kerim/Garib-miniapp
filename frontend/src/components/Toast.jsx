import { useToastStore } from '../store/toastStore'
import styles from './Toast.module.css'

export default function Toast() {
  const { message, visible } = useToastStore()
  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`}>
      <span className={styles.icon}>✓</span>
      {message}
    </div>
  )
}
