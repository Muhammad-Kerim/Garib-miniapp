import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import styles from './CartPage.module.css'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQty, removeItem } = useCartStore()
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  if (items.length === 0) return (
    <div className="page">
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.headerTitle}>Корзина</span>
        <div style={{ width: 36 }} />
      </header>
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛍</span>
        <p>Корзина пуста</p>
        <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/')}>
          Перейти в каталог
        </button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.headerTitle}>Корзина</span>
        <div style={{ width: 36 }} />
      </header>

      <div className={styles.content}>
        <div className={styles.list}>
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImg}
                onError={e => { e.target.src = '/placeholder.jpg' }}
              />
              <div className={styles.itemInfo}>
                <p className={styles.itemBrand}>{item.originalBrand}</p>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>{(item.price * item.qty).toLocaleString('ru')} ₽</p>
              </div>
              <div className={styles.qtyBlock}>
                <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span className={styles.qty}>{item.qty}</span>
                <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Итого ({items.reduce((s, i) => s + i.qty, 0)} шт.)</span>
            <span className={styles.summaryTotal}>{total.toLocaleString('ru')} ₽</span>
          </div>
          <button className="btn-primary" onClick={() => navigate('/checkout')}>
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  )
}
