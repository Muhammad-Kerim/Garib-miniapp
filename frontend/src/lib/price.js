// Акция «минус 28% до Нового года».
//
// Товар участвует, если у него есть oldPrice выше текущей цены — считать
// процент в данных не надо, он выводится из пары цен.
//
// Акция гаснет сама в новогоднюю ночь: иначе на витрине останется висеть
// просроченное обещание «до Нового года». После этого карточка показывает
// просто текущую цену, без зачёркнутой и без плашки.

export const SALE_ENDS = new Date('2027-01-01T00:00:00+03:00')
export const SALE_LABEL = 'до Нового года'

export function saleActive(now = new Date()) {
  return now < SALE_ENDS
}

export function discount(product, now = new Date()) {
  if (!product?.oldPrice || !product.price) return null
  if (product.oldPrice <= product.price) return null
  if (!saleActive(now)) return null

  return {
    oldPrice: product.oldPrice,
    // Округляем вниз: обещать скидку больше настоящей нельзя.
    percent: Math.floor((1 - product.price / product.oldPrice) * 100),
  }
}
