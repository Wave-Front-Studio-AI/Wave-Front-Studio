// Full-page review screenshot of one template page, scaled down to view. Dev server must be running.
// Usage: node scripts/template-shot.mjs <slug> [page] [width] [height] <out.jpg>
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [slug, page = '', w = '1440', h = '3600', out] = process.argv.slice(2)
const url = `http://localhost:5178/demos/templates/${slug}/${page ? page + '/' : ''}index.html`
const png = `/tmp/rv-${slug}-${page || 'home'}-${w}.png`
execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion', '--virtual-time-budget=6000', `--screenshot=${png}`, `--window-size=${w},${h}`, url], { stdio: 'ignore' })
await sharp(png).resize({ width: Number(w) > 800 ? 760 : Number(w) }).jpeg({ quality: 70 }).toFile(out)
console.log(out)
