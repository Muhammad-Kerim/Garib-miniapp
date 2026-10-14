const TELEGRAM_API = 'https://api.telegram.org'

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function sendMessage(chatId, text, extra = {}) {
  const res = await fetch(`${TELEGRAM_API}/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`Telegram sendMessage failed: ${data.description}`)
  return data
}

export async function answerCallbackQuery(id, extra = {}) {
  const res = await fetch(`${TELEGRAM_API}/bot${process.env.BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: id, ...extra }),
  })
  return res.json()
}

// Статусы подписчика канала. Телеграм отдаёт 'left' и 'kicked' для тех,
// кто не подписан или заблокирован.
const SUBSCRIBED = new Set(['creator', 'administrator', 'member', 'restricted'])

// Подписан ли человек на канал.
//
// Если Телеграм не ответил — чаще всего потому, что бота забыли сделать
// админом канала, — ПУСКАЕМ. Магазин не должен терять покупателей из-за
// сбоя проверки; пока бот не админ, проверка просто не работает.
export async function isSubscribed(channelId, userId) {
  try {
    const url = `${TELEGRAM_API}/bot${process.env.BOT_TOKEN}/getChatMember`
      + `?chat_id=${encodeURIComponent(channelId)}&user_id=${userId}`
    const data = await (await fetch(url)).json()
    if (!data.ok) {
      console.error('getChatMember failed:', data.description)
      return true
    }
    return SUBSCRIBED.has(data.result?.status)
  } catch (err) {
    console.error('getChatMember threw', err)
    return true
  }
}
