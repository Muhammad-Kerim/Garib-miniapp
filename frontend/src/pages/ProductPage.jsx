import { useParams, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import { useCartStore } from '../store/cartStore'
import FragranceComparison from '../components/FragranceComparison'
import NotesPyramid from '../components/NotesPyramid'
import CartIcon from '../components/CartIcon'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === Number(id))
  const { items, addItem } = useCartStore()

  if (!product) return (
    <div className={styles.notFound}>
      <p>Товар не найден</p>
      <button onClick={() => navigate('/')}>Вернуться в каталог</button>
    </div>
  )

  const inCart = items.some(i => i.id === product.id)

  return (
    <div className="page">
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.headerTitle}>{product.name}</span>
        <CartIcon />
      </header>

      <div className={styles.imgWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.img}
          onError={e => { e.target.src = '/placeholder.jpg' }}
        />
        <span className={styles.catBadge}>{product.category}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <p className={styles.originalBrand}>{product.originalBrand} · {product.originalName}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.catalogNo}>№{product.catalogNumber} · {product.volume} мл</p>
        </div>

        <FragranceComparison product={product} />

        <NotesPyramid notes={product.notes} />

        <div className={styles.descBlock}>
          <p className={styles.desc}>{product.description}</p>
        </div>

        <div className={styles.buyBlock}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{product.price.toLocaleString('ru')} ₽</span>
            <span className={styles.volume}>{product.volume} мл</span>
          </div>
          <button
            className={`btn-primary ${inCart ? styles.addedBtn : ''}`}
            onClick={() => { addItem(product); navigate('/cart') }}
          >
            {inCart ? '✓ В корзине — перейти' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  )
}
