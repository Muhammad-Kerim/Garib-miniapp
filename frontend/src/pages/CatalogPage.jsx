import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import SectionFilter from '../components/SectionFilter'
import TypeFilter from '../components/TypeFilter'
import styles from './CatalogPage.module.css'

const CHANNEL_URL = 'https://t.me/dukhi_parfumeria'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('все')
  const [section, setSection] = useState('solano')
  const [type, setType] = useState('все')
  const navigate = useNavigate()

  const handleSectionChange = (s) => {
    setSection(s)
    setType('все')
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(p => {
      const matchSection = (p.section ?? 'solano') === section
      const matchCat = section === 'via-zheron' || category === 'все' || p.category === category
      const matchType = section !== 'via-zheron' || type === 'все' || p.type === type
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.originalBrand || '').toLowerCase().includes(q) ||
        (p.originalName || '').toLowerCase().includes(q) ||
        (p.subBrand || '').toLowerCase().includes(q)
      return matchSection && matchCat && matchType && matchSearch
    })
  }, [search, category, type, section])

  const comingSoon = section === 'via-zheron' && type !== 'все' &&
    !products.some(p => p.section === 'via-zheron' && p.type === type)

  return (
    <div className="page">
      <header className={styles.header}>
        <img src="/logo.png" alt="garib" className={styles.logo} />
      </header>

      <div className={styles.content}>
        <SearchBar value={search} onChange={setSearch} />
        <SectionFilter active={section} onChange={handleSectionChange} />
        {section === 'via-zheron'
          ? <TypeFilter active={type} onChange={setType} />
          : <CategoryFilter active={category} onChange={setCategory} />}

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            {comingSoon ? (
              <p>Скоро добавим — следите за обновлениями</p>
            ) : (
              <>
                <p>Ничего не найдено</p>
                <button onClick={() => { setSearch(''); setCategory('все'); setType('все') }}>
                  Сбросить фильтры
                </button>
              </>
            )}
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
