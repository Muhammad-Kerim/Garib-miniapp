import styles from './TypeFilter.module.css'

const TYPES = [
  { id: 'все', label: 'Все' },
  { id: 'diffuser', label: 'Диффузоры' },
  { id: 'set5', label: 'Набор 5 шт' },
  { id: 'set2', label: 'Набор 2 шт' },
]

export default function TypeFilter({ active, onChange }) {
  return (
    <div className={styles.wrap}>
      {TYPES.map(t => (
        <button
          key={t.id}
          className={`${styles.btn} ${active === t.id ? styles.active : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
