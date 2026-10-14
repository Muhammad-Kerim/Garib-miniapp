import { useParams, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import { useCartStore } from '../store/cartStore'
import FragranceComparison from '../components/FragranceComparison'
import NotesPyramid from '../components/NotesPyramid'
import { discount, SALE_LABEL } from '../lib/price'
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
  const soldOut = product.inStock === false
  const noPrice = product.price == null
  const sale = discount(product)

  return (
    <div className="page">
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.headerTitle}>{product.name}</span>
        <div style={{ width: 28 }} />
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
          <p className={styles.originalBrand}>
            {product.originalBrand ? `${product.originalBrand} · ${product.originalName}` : product.subBrand}
          </p>
          <h1 className={styles.name}>{product.name}</h1>
          {product.catalogNumber || product.volume ? (
            <p className={styles.catalogNo}>
              {[
                product.catalogNumber && `№${product.catalogNumber}`,
                product.volume && `${product.volume} мл`,
              ].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>

        {product.comparison && <FragranceComparison product={product} />}

        <NotesPyramid notes={product.notes} />

        <div className={styles.descBlock}>
          <p className={styles.desc}>{product.description}</p>
        </div>

        <div className={styles.buyBlock}>
          {noPrice ? (
            <>
              <div className={styles.priceRow}>
                <span className={styles.priceOnRequest}>Цена по запросу</span>
                {product.volume ? <span className={styles.volume}>{product.volume} мл</span> : null}
              </div>
              <a
                className="btn-primary"
                href="https://t.me/garibperfume"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none', textAlign: 'center' }}
              >
                Узнать цену у менеджера
              </a>
            </>
          ) : (
            <>
              <div className={styles.priceRow}>
                {sale && (
                  <s className={styles.oldPrice}>
                    <span className="sr-only">Старая цена </span>
                    {sale.oldPrice.toLocaleString('ru')} ₽
                  </s>
                )}
                <span className={`${styles.price} ${sale ? styles.priceSale : ''}`}>
                  {sale && <span className="sr-only">Цена со скидкой </span>}
                  {product.price.toLocaleString('ru')} ₽
                </span>
                {product.volume ? <span className={styles.volume}>{product.volume} мл</span> : null}
              </div>
              {sale && <p className={styles.saleNote}>Скидка {sale.percent}% — {SALE_LABEL}</p>}
              {!sale && product.promo && <p className={styles.promoNote}>🔥 {product.promo}</p>}
              {soldOut ? (
                <button className={`btn-primary ${styles.soldOutBtn}`} disabled>
                  Нет в наличии — скоро вернётся
                </button>
              ) : (
                <button
                  className={`btn-primary ${inCart ? styles.addedBtn : ''}`}
                  onClick={() => { addItem(product); navigate('/cart') }}
                >
                  {inCart ? '✓ В корзине — перейти' : 'В корзину'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
