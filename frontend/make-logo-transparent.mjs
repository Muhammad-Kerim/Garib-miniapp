import sharp from 'sharp'

const { data, info } = await sharp('./public/logo.png')
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true })

for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2]
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  if (luminance > 160) {
    data[i + 3] = 0
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile('./public/logo-new.png')

import { renameSync } from 'fs'
renameSync('./public/logo-new.png', './public/logo.png')

console.log('Готово — фон удалён!')
