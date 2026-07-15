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
