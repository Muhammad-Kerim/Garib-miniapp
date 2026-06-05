import styles from './NotesPyramid.module.css'

export default function NotesPyramid({ notes }) {
  if (!notes) return null
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Ноты аромата</h2>
      <div className={styles.pyramid}>
        <div className={styles.tier}>
          <div className={styles.tierLabel}>
            <span className={styles.dot} style={{ background: '#D4A853' }} />
            <span>Верхние ноты</span>
          </div>
          <div className={styles.tags}>
            {notes.top.map(n => <span key={n} className={styles.tag}>{n}</span>)}
          </div>
        </div>
        <div className={styles.tier}>
          <div className={styles.tierLabel}>
            <span className={styles.dot} style={{ background: '#8B6B8B' }} />
            <span>Сердечные ноты</span>
          </div>
          <div className={styles.tags}>
            {notes.heart.map(n => <span key={n} className={styles.tag}>{n}</span>)}
          </div>
        </div>
        <div className={styles.tier}>
          <div className={styles.tierLabel}>
            <span className={styles.dot} style={{ background: '#5C4033' }} />
            <span>Базовые ноты</span>
          </div>
          <div className={styles.tags}>
            {notes.base.map(n => <span key={n} className={styles.tag}>{n}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
