import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import styles from './CartIcon.module.css'

export default function CartIcon() {
  const navigate = useNavigate()
  const items = useCartStore(s => s.items)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <button className={styles.btn} onClick={() => navigate('/cart')} aria-label="Корзина">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  )
}
