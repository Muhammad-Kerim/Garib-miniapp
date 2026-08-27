import styles from './SectionFilter.module.css'

const SECTIONS = [
  { id: 'solano', label: 'Solano' },
  { id: 'arabic', label: 'Арабский' },
  { id: 'via-zheron', label: 'Viajero' },
]

export default function SectionFilter({ active, onChange }) {
  return (
    <div className={styles.wrap}>
      {SECTIONS.map(s => (
        <button
          key={s.id}
          className={`${styles.btn} ${active === s.id ? styles.active : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
