import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useFavoritesStore } from '../store/favoritesStore'
import { useToastStore } from '../store/toastStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { items, addItem } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const showToast = useToastStore(s => s.show)
  const cartItem = items.find(i => i.id === product.id)
  const inCart = !!cartItem
  const fav = isFavorite(product.id)
  const soldOut = product.inStock === false
  const noPrice = product.price == null

  const handleAdd = (e) => {
    e.stopPropagation()
    if (soldOut) {
      showToast(`${product.name} временно закончился`)
      return
    }
    addItem(product)
    showToast(`${product.name} добавлен в корзину`)
  }

  const handleFav = (e) => {
    e.stopPropagation()
    toggleFavorite(product)
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
        <button
          className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
          onClick={handleFav}
          aria-label="В избранное"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
        <span className={styles.volume}>{product.volume} мл</span>
        {soldOut && <span className={styles.soldOutBadge}>Нет в наличии</span>}
        {!soldOut && product.promo && <span className={styles.promoBadge}>{product.promo}</span>}
      </div>
      <div className={styles.body}>
        <p className={styles.original}>
          {product.originalBrand ? `${product.originalBrand} · ${product.originalName}` : product.subBrand}
        </p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.footer}>
          {noPrice ? (
            <span className={styles.priceOnRequest}>Цена по запросу</span>
          ) : (
            <>
              <span className={styles.price}>{product.price.toLocaleString('ru')} ₽</span>
              <button
                className={`${styles.addBtn} ${inCart ? styles.added : ''} ${soldOut ? styles.addBtnDisabled : ''}`}
                onClick={handleAdd}
                disabled={soldOut}
                aria-label={soldOut ? 'Нет в наличии' : 'В корзину'}
              >
                {soldOut ? '—' : inCart ? `✓ ${cartItem.qty}` : '+'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
