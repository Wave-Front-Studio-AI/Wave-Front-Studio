// Screenshots the home page of every $1 Website template for the gallery cards.
// Usage: node scripts/template-thumbs.mjs [base-url=http://localhost:5178] [slug ...]
// Needs a server that serves public/ (the Vite dev server does) and Google Chrome.
import { execFileSync } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { TEMPLATES } from '../src/templates/list.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [base = 'http://localhost:5178', ...only] = process.argv.slice(2)
const slugs = only.length ? only : TEMPLATES.map((template) => template.slug)
await mkdir('public/images/templates', { recursive: true })

for (const slug of slugs) {
  const shot = join(tmpdir(), `wf-thumb-${slug}.png`)
  execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion', '--virtual-time-budget=6000', `--screenshot=${shot}`, '--window-size=1440,1080', `${base}/demos/templates/${slug}/index.html`], { stdio: 'ignore' })
  const out = `public/images/templates/${slug}.webp`
  await sharp(shot).resize(1200, 900, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(out)
  await rm(shot, { force: true })
  console.log(out)
}
