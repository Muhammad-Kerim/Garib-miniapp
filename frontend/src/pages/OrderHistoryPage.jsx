import { useNavigate } from 'react-router-dom'
import { useHistoryStore } from '../store/historyStore'
import styles from './OrderHistoryPage.module.css'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const orders = useHistoryStore(s => s.orders)

  return (
    <div className="page">
      <header className={styles.header}>
        <span className={styles.title}>История заказов</span>
      </header>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Заказов пока нет</h3>
          <p className={styles.emptyText}>Здесь будут отображаться ваши заказы после оформления</p>
          <button className="btn-primary" style={{ maxWidth: 260 }} onClick={() => navigate('/')}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          {orders.map(order => (
            <div key={order.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.date}>{formatDate(order.date)}</span>
                {order.delivery && (
                  <span className={styles.delivery}>🚚 {order.delivery}</span>
                )}
              </div>
              <div className={styles.items}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <span className={styles.itemName}>{item.name} {item.volume}мл × {item.qty}</span>
                    <span className={styles.itemPrice}>{(item.price * item.qty).toLocaleString('ru')} ₽</span>
                  </div>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.footerLabel}>Итого</span>
                <span className={styles.total}>{order.total.toLocaleString('ru')} ₽</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
