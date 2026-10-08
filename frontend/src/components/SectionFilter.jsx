import { useEffect, useRef } from 'react'
import styles from './SectionFilter.module.css'

const SECTIONS = [
  { id: 'solano', label: 'Solano' },
  { id: 'arabic', label: 'Арабский' },
  { id: 'via-zheron', label: 'Viajero' },
  { id: 'tom-ford', label: 'Tom Ford' },
  { id: 'jo-malone', label: 'Jo Malone' },
  { id: 'byredo', label: 'Byredo' },
  { id: 'originals', label: 'Оригиналы' },
]

export default function SectionFilter({ active, onChange }) {
  const wrapRef = useRef(null)

  // Разделов больше, чем влезает в экран: держим выбранный на виду
  useEffect(() => {
    const el = wrapRef.current?.querySelector(`[data-section="${active}"]`)
    if (!el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [active])

  return (
    <div className={styles.wrap} ref={wrapRef} role="group" aria-label="Разделы каталога">
      {SECTIONS.map(s => (
        <button
          key={s.id}
          type="button"
          data-section={s.id}
          aria-pressed={active === s.id}
          className={`${styles.btn} ${active === s.id ? styles.active : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
