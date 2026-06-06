import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import styles from './CatalogPage.module.css'

const CHANNEL_URL = 'https://t.me/dukhi_parfumeria'

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

    </div>
  )
}
