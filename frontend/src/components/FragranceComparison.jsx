import styles from './FragranceComparison.module.css'

export default function FragranceComparison({ product }) {
  const { originalBrand, originalName, name, comparison } = product

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Сравнение ароматов</h2>
      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.label}>ORIGINAL</p>
          <p className={styles.brand}>{originalBrand}</p>
          <p className={styles.perfumeName}>{originalName}</p>
          <p className={styles.desc}>{comparison.originalDesc}</p>
          <div className={styles.priceTag}>
            {comparison.originalPrice?.toLocaleString('ru')} ₽
          </div>
          <ul className={styles.features}>
            <li>✓ Стойкость {comparison.durabilityOriginal}</li>
            <li>✓ Нишевая парфюмерия</li>
            <li>✓ Сделано во Франции</li>
          </ul>
        </div>

        <div className={styles.divider} />

        <div className={`${styles.col} ${styles.colSolano}`}>
          <p className={styles.label}>SOLANO</p>
          <p className={styles.brand}>garib</p>
          <p className={styles.perfumeName}>{name}</p>
          <p className={styles.desc}>{comparison.solanoDesc}</p>
          <div className={`${styles.priceTag} ${styles.cheaper}`}>
            ДЕШЕВЛЕ<br/>В НЕСКОЛЬКО РАЗ
          </div>
          <ul className={styles.features}>
            <li>✓ Стойкость {comparison.durabilityS}</li>
            <li>✓ Премиальное качество</li>
            <li>✓ Сделано в Турции</li>
          </ul>
        </div>
      </div>

      <div className={styles.icons}>
        <div className={styles.iconItem}>
          <span>💎</span>
          <span>Премиум</span>
        </div>
        <div className={styles.iconItem}>
          <span>⏱</span>
          <span>Стойкость</span>
        </div>
        <div className={styles.iconItem}>
          <span>🎁</span>
          <span>Подарок</span>
        </div>
        <div className={styles.iconItem}>
          <span>🌍</span>
          <span>Турция</span>
        </div>
      </div>
    </div>
  )
}
