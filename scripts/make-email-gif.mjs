// Builds the animated GIF for the $1 Website launch email: all 15 templates, one at a time, in a browser
// window with the name, style, the "$1 until Dec 1" tag and a progress bar. Loops forever.
// Usage: node scripts/make-email-gif.mjs [scale=1.25] [lossy=80] [dither=none] [colors=128]
// Needs Google Chrome, ffmpeg and gifsicle (brew install ffmpeg gifsicle). Reads the gallery screenshots in
// public/images/templates/ (refresh them first with scripts/template-thumbs.mjs if a template changed).
//
// Kept small on purpose: each template is drawn once, and the change to the next one is a quick wipe
// from the right made of strips cut from that one picture. Each wipe frame stores only its new strip,
// so a change costs about one picture. Measured on 2026-11-20: a sliding change (every pixel moves in
// every frame) came out at 2.6 to 7.8 MB; this wipe at 1.25x and 128 colours is about 930 KB. 64 colours
// bands skies and skin, and gifsicle's lossy setting saved under 6%, so it stays light.
import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { templateBySlug } from '../src/templates/list.js'

const run = promisify(execFile)
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = 'public/images/email/templates-all.gif'
const [scaleArg = '1.25', lossy = '80', dither = 'none', colors = '128'] = process.argv.slice(2)
const scale = Number(scaleArg)

// Dark and light alternate so every change is easy to see. Pulse leads because Outlook on Windows shows
// only the first frame.
const ORDER = ['pulse', 'linen', 'slate', 'meadow', 'atlas', 'bloom', 'volt', 'harbor', 'ember', 'grid', 'pop', 'heritage', 'horizon', 'frame', 'nordic']
const HOLD = 130 // hundredths of a second each template stays still
const WIPE = [0.42, 0.74, 0.93, 1] // how much of the next template is showing, frame by frame (ease out)
const WIPE_DELAY = 5 // hundredths of a second per wipe frame

const W = 520 // CSS width; the email shows the GIF at this width
const BAR = 28 // browser bar height, including its bottom border
const SCREEN_H = 389 // 4:3 like the screenshots
const H = 500
const C = { ink: '#0d1b2a', muted: '#56697a', brand: '#2f6aa8', line: '#dbe4ec', paper: '#eef3f7' }

const font = (await readFile('public/fonts/ibm-plex-sans-latin-variable.woff2')).toString('base64')
const shot = (slug) => pathToFileURL(resolve(`public/images/templates/${slug}.webp`)).href

function page(index) {
  const { name, style } = templateBySlug[ORDER[index]]
  const segments = ORDER.map((_, i) => `<i${i <= index ? ' class="on"' : ''}></i>`).join('')
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Plex;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 700}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;background:#fff;overflow:hidden;font-family:Plex,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.win{border:1px solid ${C.line};border-radius:12px;overflow:hidden}
.bar{height:${BAR}px;background:${C.paper};display:flex;align-items:center;padding:0 12px;gap:6px;border-bottom:1px solid ${C.line}}
.dot{width:9px;height:9px;border-radius:50%;background:#c9d4de}
.url{margin:0 auto;transform:translateX(-24px);width:210px;height:18px;border-radius:9px;background:#fff;color:${C.muted};font-size:11px;line-height:18px;text-align:center;letter-spacing:.2px}
.screen{display:block;width:${W - 2}px;height:${SCREEN_H}px;object-fit:cover;object-position:top}
.row{display:flex;align-items:center;justify-content:space-between;margin-top:14px}
.name{font-size:19px;font-weight:700;color:${C.ink};letter-spacing:-.2px}
.style{font-size:16px;font-weight:400;color:${C.muted}}
.tag{background:${C.ink};color:#fff;font-size:14px;font-weight:700;padding:7px 14px;border-radius:999px}
.prog{display:flex;align-items:center;gap:12px;margin-top:13px}
.segs{display:flex;gap:4px;flex:1}
.segs i{flex:1;height:5px;border-radius:3px;background:${C.line}}
.segs i.on{background:${C.brand}}
.count{font-size:13px;font-weight:600;color:${C.muted};white-space:nowrap}
</style></head><body>
<div class="win"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">yourbusiness.com</span></div>
<img class="screen" src="${shot(ORDER[index])}"></div>
<div class="row"><span><span class="name">${name}</span> <span class="style">&middot; ${style}</span></span><span class="tag">$1 until Dec 1</span></div>
<div class="prog"><span class="segs">${segments}</span><span class="count">${index + 1} of ${ORDER.length}</span></div>
</body></html>`
}

const dir = await mkdtemp(join(tmpdir(), 'wf-email-gif-'))
const still = (i) => join(dir, `t${i}.gif`)

// 1. One picture per template, each with its own palette so the photos stay clean.
let next = 0
async function worker(id) {
  const profile = join(dir, `chrome-${id}`)
  while (next < ORDER.length) {
    const i = next++
    const html = join(dir, `t${i}.html`)
    const png = join(dir, `t${i}.png`)
    await writeFile(html, page(i))
    await run(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, `--force-device-scale-factor=${scale}`, `--window-size=${W},${H}`, '--virtual-time-budget=3000', `--screenshot=${png}`, pathToFileURL(html).href])
    await run('ffmpeg', ['-loglevel', 'error', '-y', '-i', png, '-vf', `split[a][b];[a]palettegen=max_colors=${colors}:reserve_transparent=1:stats_mode=single[p];[b][p]paletteuse=dither=${dither}`, still(i)])
  }
}
await Promise.all(Array.from({ length: 6 }, (_, id) => worker(id)))

// 2. Wipe strips cut from the next template's picture, covering the browser window from the right.
const px = Math.round(W * scale)
const windowBottom = Math.ceil((1 + BAR + SCREEN_H + 1) * scale)
const edge = (shown) => (shown >= 1 ? 0 : Math.round(px * (1 - shown)))
const strips = await Promise.all(ORDER.map(async (_, i) => {
  const to = (i + 1) % ORDER.length
  return Promise.all(WIPE.map(async (shown, k) => {
    const left = edge(shown)
    const right = edge(k ? WIPE[k - 1] : 0)
    const out = join(dir, `w${i}-${k}.gif`)
    await run('gifsicle', ['--no-warnings', '--crop', `${left},0+${right - left}x${windowBottom}`, still(to), '-o', out])
    return { out, left }
  }))
}))

// 3. Template, its wipe into the next one, next template (the labels change as the wipe lands), and so on.
const args = ['--no-warnings', '--loopcount=forever', '-O3', `--lossy=${lossy}`, '-o', OUT]
ORDER.forEach((_, i) => {
  args.push(`-d${HOLD}`, '--position', '0,0', still(i))
  // Cropping moves a strip to the top left corner, so put it back where it was cut from.
  strips[i].forEach(({ out, left }) => args.push(`-d${WIPE_DELAY}`, '--position', `${left},0`, out))
})
await run('gifsicle', args)
if (process.env.KEEP_FRAMES) console.log(`frames kept in ${dir}`)
else await rm(dir, { recursive: true, force: true })

const { size } = await stat(OUT)
const seconds = (ORDER.length * (HOLD + WIPE.length * WIPE_DELAY)) / 100
console.log(`${OUT}: ${ORDER.length * (1 + WIPE.length)} frames, ${seconds.toFixed(1)} s a loop, ${Math.round(size / 1024)} KB`)
