// Прогон вебхука без Телеграма: подменяем fetch и смотрим, что бот отправил.
// Запуск: node api/telegram-webhook.test.mjs

process.env.BOT_TOKEN = 'test-token'
process.env.TELEGRAM_WEBHOOK_SECRET = 'secret'
process.env.MINI_APP_URL = 'https://example.test'
process.env.CHANNEL_ID = '@dukhi_parfumeria'
delete process.env.ANALYTICS_CHAT_ID

const { default: handler } = await import('./telegram-webhook.js')

let failed = 0
const check = (name, ok, detail = '') => {
  if (!ok) failed++
  console.log(ok ? '✓' : '✗', name, ok ? '' : `— ${detail}`)
}

// Подменяем fetch: запоминаем вызовы, отвечаем так, как велит сценарий.
function stubFetch({ status }) {
  const calls = []
  const prefix = `/bot${process.env.BOT_TOKEN}/`
  globalThis.fetch = async (url, opts) => {
    const method = String(url).split(prefix)[1]?.split('?')[0]
    const body = opts?.body ? JSON.parse(opts.body) : null
    calls.push({ method, body })
    if (method === 'getChatMember') {
      return { json: async () => (status === 'error'
        ? { ok: false, description: 'bot is not an administrator' }
        : { ok: true, result: { status } }) }
    }
    return { json: async () => ({ ok: true, result: {} }) }
  }
  return calls
}

const res = () => {
  const r = { code: 200, body: null }
  r.status = (c) => { r.code = c; return r }
  r.json = (b) => { r.body = b; return r }
  return r
}

const post = (body) => ({
  method: 'POST',
  headers: { 'x-telegram-bot-api-secret-token': 'secret' },
  body,
})

const START = { message: { text: '/start', chat: { id: 7 }, from: { id: 42, first_name: 'Иван' } } }
const TAP_CHECK = { callback_query: { id: 'cb1', data: 'check_sub', from: { id: 42 }, message: { chat: { id: 7 } } } }

const sent = (calls) => calls.filter(c => c.method === 'sendMessage').map(c => c.body)
const hasCatalogButton = (msg) =>
  JSON.stringify(msg.reply_markup ?? {}).includes('web_app')

// ——— не подписан ———
{
  const calls = stubFetch({ status: 'left' })
  await handler(post(START), res())
  const msgs = sent(calls)
  check('не подписан: два сообщения', msgs.length === 2, `их ${msgs.length}`)
  check('не подписан: первое — про скидку', msgs[0]?.text.includes('28%'), msgs[0]?.text)
  check('не подписан: каталог не выдан', !msgs.some(hasCatalogButton))
  check('не подписан: есть кнопка «Я подписался»',
    JSON.stringify(msgs[1]?.reply_markup).includes('check_sub'))
}

// ——— подписан ———
{
  const calls = stubFetch({ status: 'member' })
  await handler(post(START), res())
  const msgs = sent(calls)
  check('подписан: первое — про скидку', msgs[0]?.text.includes('28%'))
  check('подписан: каталог выдан', msgs.some(hasCatalogButton))
  check('подписан: заглушки нет', !msgs.some(m => m.text.includes('Я подписался')))
}

// ——— нажал «Я подписался», но не подписался ———
{
  const calls = stubFetch({ status: 'left' })
  await handler(post(TAP_CHECK), res())
  const alert = calls.find(c => c.method === 'answerCallbackQuery')
  check('кнопка без подписки: всплывашка', alert?.body.show_alert === true)
  check('кнопка без подписки: каталог не выдан', !sent(calls).some(hasCatalogButton))
}

// ——— нажал «Я подписался» после подписки ———
{
  const calls = stubFetch({ status: 'member' })
  await handler(post(TAP_CHECK), res())
  check('кнопка с подпиской: каталог выдан', sent(calls).some(hasCatalogButton))
  check('кнопка с подпиской: всплывашка без тревоги',
    calls.find(c => c.method === 'answerCallbackQuery')?.body.show_alert !== true)
}

// ——— бот не админ канала: пускаем, а не запираем магазин ———
{
  const calls = stubFetch({ status: 'error' })
  await handler(post(START), res())
  check('бот не админ: каталог всё равно выдан', sent(calls).some(hasCatalogButton))
}

// ——— чужой запрос без секрета ———
{
  stubFetch({ status: 'member' })
  const r = res()
  await handler({ method: 'POST', headers: {}, body: START }, r)
  check('без секрета: 401', r.code === 401, `код ${r.code}`)
}

console.log(failed ? `\nПРОВАЛЕНО: ${failed}` : '\nвсё сошлось')
process.exit(failed ? 1 : 0)
