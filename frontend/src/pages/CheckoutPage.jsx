import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useHistoryStore } from '../store/historyStore'
import styles from './CheckoutPage.module.css'

const BOT_URL = 'https://garib-miniapp-production.up.railway.app/order'
const DELIVERY_OPTIONS = ['СДЭК', 'Почта России', 'Озон']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { addOrder } = useHistoryStore()
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const [form, setForm] = useState({ name: '', phone: '', address: '', comment: '' })
  const [delivery, setDelivery] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const canSubmit = form.name && form.phone && form.address && delivery

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    try {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
      const orderData = {
        ...form,
        delivery,
        tgUser: tgUser ? {
          id: tgUser.id,
          username: tgUser.username,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
        } : null,
        items: items.map(i => ({
          name: i.name,
          volume: i.volume,
          qty: i.qty,
          price: i.price,
        })),
        total,
      }

      await fetch(BOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      addOrder({ ...form, delivery, items: orderData.items, total })
    } catch {}

    clearCart()
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className={styles.success}>
      <div className={styles.successCircle}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle
            cx="36" cy="36" r="34"
            stroke="#22C55E" strokeWidth="3"
            strokeDasharray="213.6"
            strokeDashoffset="213.6"
            className={styles.successRing}
          />
          <path
            d="M22 36l10 10 18-18"
            stroke="#22C55E" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="40"
            strokeDashoffset="40"
            className={styles.successCheck}
          />
        </svg>
      </div>
      <h2 className={styles.successTitle}>Заказ принят!</h2>
      <p className={styles.successText}>Менеджер свяжется с вами в Telegram в течение часа для подтверждения и оплаты.</p>
      <button className="btn-primary" style={{ maxWidth: 300 }} onClick={() => navigate('/')}>
        Вернуться в каталог
      </button>
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
        <span className={styles.headerTitle}>Оформление заказа</span>
        <div style={{ width: 36 }} />
      </header>

      <form className={styles.content} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Контактные данные</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Имя *</label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Телефон *</label>
              <input
                className={styles.input}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (999) 000-00-00"
                type="tel"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Адрес / Индекс / Пункт выдачи *</label>
              <input
                className={styles.input}
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Город, улица, дом или индекс"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Комментарий</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Пожелания к заказу..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Способ доставки *</h3>
          <div className={styles.deliveryOptions}>
            {DELIVERY_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                className={`${styles.deliveryBtn} ${delivery === opt ? styles.deliveryActive : ''}`}
                onClick={() => setDelivery(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Состав заказа</h3>
          <div className={styles.orderItems}>
            {items.map(i => (
              <div key={i.id} className={styles.orderItem}>
                <span className={styles.orderItemName}>{i.name} {i.volume}мл × {i.qty}</span>
                <span className={styles.orderItemPrice}>{(i.price * i.qty).toLocaleString('ru')} ₽</span>
              </div>
            ))}
            <div className={`${styles.orderItem} ${styles.totalRow}`}>
              <span>Итого</span>
              <span className={styles.totalPrice}>{total.toLocaleString('ru')} ₽</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !canSubmit}
        >
          {loading ? 'Отправляем...' : 'Отправить заказ'}
        </button>
      </form>
    </div>
  )
}
