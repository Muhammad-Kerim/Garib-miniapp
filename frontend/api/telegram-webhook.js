import { sendMessage, answerCallbackQuery, isSubscribed, esc } from './_lib/telegram.js'

const CHANNEL = process.env.CHANNEL_ID || '@dukhi_parfumeria'
const CHANNEL_URL = `https://t.me/${CHANNEL.replace(/^@/, '')}`

const PROMO_TEXT = '🎄 До Нового года — скидка 28% на всю линейку SOLANO\n\nЛюбой аромат — 2 500 ₽ вместо 3 500 ₽. Стойкость 10–12 часов.'

const WELCOME_TEXT = 'Добро пожаловать в GARIB PERFUME 🌿\n\n20 лет в мире ароматов. Более 1000 позиций — от мировых люксовых брендов до редкой арабской парфюмерии.\n\nНаш бренд SOLANO — ароматы 1:1 с Chanel, Dior, Tom Ford, Creed и другими. Стойкость 10–12 часов, высочайшее качество.\n\n💬 Менеджер: @garibperfume\n⭐️ Отзывы наших клиентов: https://t.me/+vUCx-VCTGF5mNTUy\n\nОткройте каталог и найдите свой аромат 👇'

const GATE_TEXT = 'Каталог открыт для подписчиков канала 🌿\n\nПодпишитесь — там новинки, поступления и закрытые предложения. После подписки нажмите «Я подписался».'

const CHECK_SUB = 'check_sub'

const SOURCE_LABELS = {
  channel: 'закреп в канале dukhi_parfumeria',
}

function catalogKeyboard() {
  return {
    inline_keyboard: [[{
      text: '🛍 Открыть каталог',
      web_app: { url: process.env.MINI_APP_URL },
    }]],
  }
}

function gateKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '📣 Подписаться на канал', url: CHANNEL_URL }],
      [{ text: '✅ Я подписался', callback_data: CHECK_SUB }],
    ],
  }
}

async function notifySource(payload, from) {
  if (!payload || !process.env.ANALYTICS_CHAT_ID) return
  const who = from?.username ? `@${esc(from.username)}` : esc(from?.first_name || 'неизвестен')
  const source = SOURCE_LABELS[payload] || esc(payload)
  await sendMessage(process.env.ANALYTICS_CHAT_ID, `📊 Переход в бота: ${source}\n👤 ${who}`)
}

async function handleStart(message) {
  const [, payload] = message.text.split(' ')

  await sendMessage(message.chat.id, PROMO_TEXT)

  if (await isSubscribed(CHANNEL, message.from.id)) {
    await sendMessage(message.chat.id, WELCOME_TEXT, { reply_markup: catalogKeyboard() })
  } else {
    await sendMessage(message.chat.id, GATE_TEXT, { reply_markup: gateKeyboard() })
  }

  await notifySource(payload, message.from).catch(err => console.error('notifySource failed', err))
}

async function handleSubscriptionCheck(query) {
  if (await isSubscribed(CHANNEL, query.from.id)) {
    await answerCallbackQuery(query.id, { text: 'Спасибо! Каталог открыт 🌿' })
    await sendMessage(query.message.chat.id, WELCOME_TEXT, { reply_markup: catalogKeyboard() })
  } else {
    await answerCallbackQuery(query.id, {
      text: 'Пока не вижу подписки. Подпишитесь на канал и нажмите ещё раз.',
      show_alert: true,
    })
  }
}

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

    if (update.message?.text?.startsWith('/start')) {
      await handleStart(update.message)
    } else if (update.callback_query?.data === CHECK_SUB) {
      await handleSubscriptionCheck(update.callback_query)
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
