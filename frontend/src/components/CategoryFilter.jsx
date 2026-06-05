import styles from './CategoryFilter.module.css'

const CATS = ['все', 'мужские', 'женские', 'унисекс']

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className={styles.wrap}>
      {CATS.map(cat => (
        <button
          key={cat}
          className={`${styles.btn} ${active === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
