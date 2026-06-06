import styles from './FragranceComparison.module.css'

export default function FragranceComparison({ product }) {
  const { originalBrand, originalName, name, comparison } = product
  const origPrice = comparison.originalPrice?.toLocaleString('ru')

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Сравнение ароматов</h2>

      <div className={styles.grid}>
        <div className={styles.col}>
          <span className={styles.colLabel}>ОРИГИНАЛ</span>
          <p className={styles.brand}>{originalBrand}</p>
          <p className={styles.perfumeName}>{originalName}</p>
          <p className={styles.desc}>{comparison.originalDesc}</p>
          <div className={styles.meta}>
            {origPrice && <span className={styles.origPrice}>~ {origPrice} ₽</span>}
            <span className={styles.metaItem}>⏱ {comparison.durabilityOriginal}</span>
            <span className={styles.metaItem}>🇫🇷 Франция</span>
          </div>
        </div>

        <div className={styles.vs}>VS</div>

        <div className={`${styles.col} ${styles.colRight}`}>
          <span className={`${styles.colLabel} ${styles.colLabelAccent}`}>GARIB</span>
          <p className={styles.brand}>garib</p>
          <p className={styles.perfumeName}>{name}</p>
          <p className={styles.desc}>{comparison.solanoDesc}</p>
          <div className={styles.meta}>
            <span className={styles.ourPrice}>2 500 ₽</span>
            <span className={styles.metaItem}>⏱ {comparison.durabilityS}</span>
            <span className={styles.metaItem}>🇹🇷 Турция</span>
          </div>
        </div>
      </div>

      <div className={styles.tags}>
        <span className={styles.tag}>✓ Тот же аромат</span>
        <span className={styles.tag}>✓ Стойкий шлейф</span>
        <span className={styles.tag}>✓ Премиум состав</span>
        <span className={styles.tag}>✓ Доступная цена</span>
      </div>
    </div>
  )
}
