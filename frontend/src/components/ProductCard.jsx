import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { items, addItem } = useCartStore()
  const inCart = items.some(i => i.id === product.id)

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
      <div className={styles.imgWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.img}
          onError={e => { e.target.src = '/placeholder.jpg' }}
        />
        <span className={styles.volume}>{product.volume} мл</span>
      </div>
      <div className={styles.body}>
        <p className={styles.original}>{product.originalBrand}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>{product.price.toLocaleString('ru')} ₽</span>
          <button
            className={`${styles.addBtn} ${inCart ? styles.added : ''}`}
            onClick={handleAdd}
          >
            {inCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}
