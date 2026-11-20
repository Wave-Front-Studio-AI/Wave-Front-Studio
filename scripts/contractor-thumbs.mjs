// Screenshots every contractor mock-up in public/demos/contractors/ for the template section cards.
// Usage: node scripts/contractor-thumbs.mjs [base-url=http://localhost:5178]
// Needs a server that serves public/ (the Vite dev server does) and Google Chrome.
import { execFileSync } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { CONTRACTOR_MOCKUPS } from '../src/templates/contractorMockups.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [base = 'http://localhost:5178'] = process.argv.slice(2)
await mkdir('public/images/contractors', { recursive: true })

for (const { slug } of CONTRACTOR_MOCKUPS) {
  const shot = join(tmpdir(), `wf-contractor-${slug}.png`)
  execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion', '--virtual-time-budget=20000', `--screenshot=${shot}`, '--window-size=1440,1080', `${base}/demos/contractors/${slug}/index.html`], { stdio: 'ignore' })
  const out = `public/images/contractors/${slug}.webp`
  await sharp(shot).resize(1200, 900, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(out)
  await rm(shot, { force: true })
  console.log(out)
}
