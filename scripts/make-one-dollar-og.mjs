// Generates public/images/1-dollar-website-og.png, the 1200x630 share card for
// /1-dollar-website/. Run it again if the offer wording changes:
//   node scripts/make-one-dollar-og.mjs
//
// The brand font ships as woff2, which the SVG rasteriser used by
// make-og-card.mjs cannot load, so this draws an HTML snippet in headless
// Chrome (set CHROME_PATH to use a different binary) and squeezes the
// screenshot into a PNG under 120 kB with sharp.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')
const out = resolve(root, 'public/images/1-dollar-website-og.png')
const font = pathToFileURL(resolve(root, 'public/fonts/outfit-latin-variable.woff2')).href

const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium']
  .find((path) => path && existsSync(path))
if (!chrome) throw new Error('No Chrome found. Set CHROME_PATH.')

// Palette copied from :root in styles.css. Flat, no gradient (DESIGN.md).
// White text on ink; the accent teal is a fill only.
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url("${font}");font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0d1b2a;color:#fff;font-family:Outfit,sans-serif;position:relative;overflow:hidden}
.sq{position:absolute;left:-300px;top:550px;width:520px;height:520px;border-radius:30px;background:#143a5c;transform:rotate(-40deg);transform-origin:260px 260px}
.t{position:absolute;left:84px;top:96px;font-weight:700;font-size:112px;line-height:1.08;letter-spacing:-0.02em}
.rule{position:absolute;left:84px;top:468px;width:120px;height:6px;border-radius:3px;background:#2bb3c8}
.b{position:absolute;left:84px;top:508px;font-weight:600;font-size:34px}
</style><div class="sq"></div><div class="t">$1 website.<br>15 designs.<br>Ends Dec 1.</div><div class="rule"></div><div class="b">Wavefront Studio</div>`

const dir = await mkdtemp(join(tmpdir(), 'od-og-'))
try {
  const page = join(dir, 'card.html')
  const shot = join(dir, 'card.png')
  await writeFile(page, html)
  const { status } = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${shot}`, pathToFileURL(page).href], { stdio: 'ignore' })
  if (status !== 0 || !existsSync(shot)) throw new Error('Chrome did not write a screenshot')
  await sharp(shot).resize(1200, 630).png({ palette: true, colors: 32, compressionLevel: 9, effort: 10 }).toFile(out)
} finally {
  await rm(dir, { recursive: true, force: true })
}
const { size } = await stat(out)
const { width, height } = await sharp(out).metadata()
console.log(`Wrote public/images/1-dollar-website-og.png: ${width}x${height}, ${(size / 1024).toFixed(1)} kB`)
if (size > 120 * 1024) throw new Error('Card is over 120 kB')
