import sharp from 'sharp'
import { readdirSync } from 'fs'
import { join } from 'path'

const dir = './public/images'
const files = readdirSync(dir).filter(f => f.match(/\.(png|jpg|jpeg)$/i))

console.log(`Сжимаю ${files.length} фото...`)

for (const file of files) {
  const input = join(dir, file)
  const output = join(dir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'))

  await sharp(input)
    .resize(600, 800, { fit: 'cover', position: 'top' })
    .webp({ quality: 82 })
    .toFile(output)

  console.log(`✓ ${file} → ${file.replace(/\.(png|jpg|jpeg)$/i, '.webp')}`)
}

console.log('\nГотово!')
