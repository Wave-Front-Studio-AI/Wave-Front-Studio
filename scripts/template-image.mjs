// Downloads (or reads) a photo and saves it as a compressed WebP for a $1 Website template.
// Usage: node scripts/template-image.mjs <https-url-or-local-path> <out.webp> [width=1600] [quality=76]
// Only use photos you may use commercially (Unsplash or Pexels licence, or images we generated).
import { mkdir, readFile, stat } from 'node:fs/promises'
import { dirname } from 'node:path'
import sharp from 'sharp'

const [source, out, width = '1600', quality = '76'] = process.argv.slice(2)
if (!source || !out) {
  console.error('Usage: node scripts/template-image.mjs <url-or-path> <out.webp> [width] [quality]')
  process.exit(1)
}
let input
if (/^https:\/\//.test(source)) {
  const response = await fetch(source)
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${source}`)
  input = Buffer.from(await response.arrayBuffer())
} else {
  input = await readFile(source)
}
await mkdir(dirname(out), { recursive: true })
const info = await sharp(input).rotate().resize({ width: Number(width), withoutEnlargement: true }).webp({ quality: Number(quality) }).toFile(out)
const { size } = await stat(out)
console.log(`${out}: ${info.width}x${info.height}, ${Math.round(size / 1024)} KB`)
