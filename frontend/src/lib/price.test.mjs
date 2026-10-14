import { discount, saleActive } from './price.js'

let failed = 0
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) failed++
  console.log(ok ? '✓' : '✗', name, ok ? '' : `— получили ${JSON.stringify(got)}, ждали ${JSON.stringify(want)}`)
}

const solano = { price: 2500, oldPrice: 3500 }
const arabic = { price: 5000 }
const viajero = { price: 500, promo: '2 шт — 1000 ₽' }
const free = { price: null }

const now = new Date('2026-12-31T23:00:00+03:00')
const after = new Date('2027-01-01T00:30:00+03:00')

check('Solano: скидка 28%', discount(solano, now), { oldPrice: 3500, percent: 28 })
check('Арабский без oldPrice — скидки нет', discount(arabic, now), null)
check('Viajero без oldPrice — скидки нет', discount(viajero, now), null)
check('Цена по запросу — скидки нет', discount(free, now), null)
check('31 декабря акция идёт', saleActive(now), true)
check('1 января акция кончилась', saleActive(after), false)
check('1 января скидка не показывается', discount(solano, after), null)
check('oldPrice равна цене — не скидка', discount({ price: 2500, oldPrice: 2500 }, now), null)
check('oldPrice ниже цены — не скидка', discount({ price: 2500, oldPrice: 2000 }, now), null)
check('процент округляется вниз', discount({ price: 999, oldPrice: 1000 }, now).percent, 0)

console.log(failed ? `\nПРОВАЛЕНО: ${failed}` : '\nвсё сошлось')
process.exit(failed ? 1 : 0)
