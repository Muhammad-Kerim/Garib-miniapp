import styles from './SearchBar.module.css'

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input
        className={styles.input}
        type="text"
        placeholder="Поиск по названию или бренду..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className={styles.clear} onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  )
}
