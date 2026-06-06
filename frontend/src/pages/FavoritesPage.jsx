import { useNavigate } from 'react-router-dom'
import { useFavoritesStore } from '../store/favoritesStore'
import ProductCard from '../components/ProductCard'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const favorites = useFavoritesStore(s => s.favorites)

  return (
    <div className="page">
      <header className={styles.header}>
        <span className={styles.title}>Избранное</span>
        {favorites.length > 0 && (
          <span className={styles.count}>{favorites.length}</span>
        )}
      </header>

      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Пока здесь ничего нет</h3>
          <p className={styles.emptyText}>Нажмите ❤️ на карточке товара, чтобы добавить в избранное</p>
          <button className="btn-primary" style={{ maxWidth: 260 }} onClick={() => navigate('/')}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.grid}>
            {favorites.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
