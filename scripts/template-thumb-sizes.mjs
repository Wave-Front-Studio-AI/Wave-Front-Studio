// Makes the 400w and 800w gallery thumbnails next to each 1200w original (public/images/templates/<slug>.webp).
// Usage: node scripts/template-thumb-sizes.mjs [slug ...]
// Originals are never touched. Each -400 file is kept at or under 15 KB (the quality drops until it fits).
// Run it again after scripts/template-thumbs.mjs re-shoots the originals.
import { stat } from 'node:fs/promises'
import sharp from 'sharp'
import { TEMPLATES } from '../src/templates/list.js'

const DIR = 'public/images/templates'
const SIZES = [
  { width: 400, maxBytes: 15 * 1024, start: 74 },
  { width: 800, maxBytes: 45 * 1024, start: 74 },
]
const [...only] = process.argv.slice(2)
const slugs = only.length ? only : TEMPLATES.map((template) => template.slug)

for (const slug of slugs) {
  const source = `${DIR}/${slug}.webp`
  const original = (await stat(source)).size
  const parts = []
  for (const { width, maxBytes, start } of SIZES) {
    const out = `${DIR}/${slug}-${width}.webp`
    let quality = start
    let buffer
    do {
      buffer = await sharp(source).resize({ width }).webp({ quality, effort: 6 }).toBuffer()
      quality -= 4
    } while (buffer.length > maxBytes && quality > 20)
    await sharp(buffer).toFile(out)
    parts.push(`${width}w ${(buffer.length / 1024).toFixed(1)} KB`)
  }
  console.log(`${slug}: original ${(original / 1024).toFixed(1)} KB, ${parts.join(', ')}`)
}
