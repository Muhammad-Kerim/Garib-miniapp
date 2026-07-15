import { sendMessage, esc } from './_lib/telegram.js'

function orderId() {
  const d = new Date()
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${date}-${rand}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false })
    return
  }

  try {
    const { name, phone, address, comment, items, total, tgUser, delivery } = req.body
    const MINI_APP_URL = process.env.MINI_APP_URL

    const itemsText = items
      .map(i => {
        const link = i.id
          ? `<a href="${MINI_APP_URL}/product/${i.id}">${esc(i.name)}</a>`
          : esc(i.name)
        return `• ${link} ${i.volume}мл — ${i.qty} шт. × ${i.price.toLocaleString('ru')} ₽ = ${(i.qty * i.price).toLocaleString('ru')} ₽`
      })
      .join('\n')
    const tgLink = tgUser
      ? tgUser.username
        ? `@${esc(tgUser.username)}`
        : `<a href="tg://user?id=${tgUser.id}">${esc(tgUser.firstName)}</a>`
      : 'неизвестен'

    const message = `🛍 Новый заказ #${orderId()}

👤 Имя: ${esc(name)}
📞 Телефон: ${esc(phone)}
${delivery ? `🚚 Доставка: ${esc(delivery)}\n` : ''}📍 Адрес: ${esc(address)}${comment ? `\n💬 Комментарий: ${esc(comment)}` : ''}
✈️ Telegram: ${tgLink}

📦 Состав заказа:
${itemsText}

💰 Итого: ${total.toLocaleString('ru')} ₽`

    await sendMessage(process.env.MANAGER_CHAT_ID, message)
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}
