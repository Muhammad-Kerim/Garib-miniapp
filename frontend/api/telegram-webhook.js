import { sendMessage } from './_lib/telegram.js'

const WELCOME_TEXT = 'Добро пожаловать в GARIB PERFUME 🌿\n\n20 лет в мире ароматов. Более 1000 позиций — от мировых люксовых брендов до редкой арабской парфюмерии.\n\nНаш бренд SOLANO — ароматы 1:1 с Chanel, Dior, Tom Ford, Creed и другими. Стойкость 10–12 часов, высочайшее качество.\n\n💬 Менеджер: @garibperfume\n⭐️ Отзывы наших клиентов: https://t.me/+vUCx-VCTGF5mNTUy\n\nОткройте каталог и найдите свой аромат 👇'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false })
    return
  }

  if (req.headers['x-telegram-bot-api-secret-token'] !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    res.status(401).json({ ok: false })
    return
  }

  try {
    const update = req.body
    const text = update.message?.text

    if (text?.startsWith('/start')) {
      await sendMessage(update.message.chat.id, WELCOME_TEXT, {
        reply_markup: {
          inline_keyboard: [[{
            text: '🛍 Открыть каталог',
            web_app: { url: process.env.MINI_APP_URL },
          }]],
        },
      })
    }

    res.json({ ok: true })
  } catch (err) {
    // Always ack 200 to Telegram: on failures like "bot was blocked by the
    // user" there's nothing to retry, and a 500 here makes Telegram hammer
    // this same undeliverable update forever.
    console.error(err)
    res.json({ ok: true })
  }
}
