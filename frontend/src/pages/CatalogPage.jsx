import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import CartIcon from '../components/CartIcon'
import styles from './CatalogPage.module.css'

const CHANNEL_URL = 'https://t.me/garib_parfume'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('все')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(p => {
      const matchCat = category === 'все' || p.category === category
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.originalBrand.toLowerCase().includes(q) ||
        p.originalName.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, category])

  return (
    <div className="page">
      <header className={styles.header}>
        <img src="/logo.png" alt="garib" className={styles.logo} />
        <CartIcon />
      </header>

      <div className={styles.content}>
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter active={category} onChange={setCategory} />

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>Ничего не найдено</p>
            <button onClick={() => { setSearch(''); setCategory('все') }}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <a href={CHANNEL_URL} className={styles.channelBtn} target="_blank" rel="noreferrer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.94z"/>
        </svg>
        Наш Telegram канал
      </a>
    </div>
  )
}
