require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')

const BOT_TOKEN = process.env.BOT_TOKEN
const MANAGER_CHAT_ID = process.env.MANAGER_CHAT_ID
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://your-app.vercel.app'
const PORT = process.env.PORT || 3001

const bot = new TelegramBot(BOT_TOKEN, { polling: true })
const app = express()
app.use(cors())
app.use(express.json())

let orderCounter = 1

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Добро пожаловать в Garib Parfume! 🌿\n\nЗдесь вы можете выбрать тот аромат, который вам будет по душе.\n\nОткройте наш каталог, мы с радостью оформим ваши заказы:', {
    reply_markup: {
      inline_keyboard: [[{
        text: '🛍 Открыть каталог',
        web_app: { url: MINI_APP_URL }
      }]]
    }
  })
})

app.post('/order', async (req, res) => {
  try {
    const { name, phone, address, comment, items, total } = req.body

    const itemsText = items
      .map(i => {
        const link = i.id
          ? `<a href="${MINI_APP_URL}/product/${i.id}">${esc(i.name)}</a>`
          : esc(i.name)
        return `• ${link} ${i.volume}мл — ${i.qty} шт. × ${i.price.toLocaleString('ru')} ₽ = ${(i.qty * i.price).toLocaleString('ru')} ₽`
      })
      .join('\n')

    const { tgUser, delivery } = req.body
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    const tgLink = tgUser
      ? tgUser.username
        ? `@${esc(tgUser.username)}`
        : `<a href="tg://user?id=${tgUser.id}">${esc(tgUser.firstName)}</a>`
      : 'неизвестен'

    const message = `🛍 Новый заказ #${orderCounter++}

👤 Имя: ${esc(name)}
📞 Телефон: ${esc(phone)}
${delivery ? `🚚 Доставка: ${esc(delivery)}\n` : ''}📍 Адрес: ${esc(address)}${comment ? `\n💬 Комментарий: ${esc(comment)}` : ''}
✈️ Telegram: ${tgLink}

📦 Состав заказа:
${itemsText}

💰 Итого: ${total.toLocaleString('ru')} ₽`

    await bot.sendMessage(MANAGER_CHAT_ID, message, { parse_mode: 'HTML' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Bot server running on port ${PORT}`))
