// Checks the built $1 Website page in dist/. Run after `npm run build`.
//   node scripts/verify-one-dollar.mjs            live offer build
//   BUILD_TIME=2026-12-02T05:01:00Z npm run build && node scripts/verify-one-dollar.mjs --ended
// Prints PASS or FAIL for each check and exits 1 on any FAIL.
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { TEMPLATES } from '../src/templates/list.js'
import { ONE_DOLLAR_AD, ONE_DOLLAR_FAQ } from '../src/data/oneDollarPage.js'
import { siteOrigin } from '../src/data/site.js'

const ended = process.argv.includes('--ended')
const dist = resolve(import.meta.dirname, '../dist')
const KB = 1024
const LIVE_TITLE = '$1 Website for Small Business: 15 Designs | Wavefront Studio'
const ENDED_TITLE = 'The $1 Website offer has ended | Wavefront Studio'

let failed = 0
const check = (name, ok, detail = '') => {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}
const decode = (text) => text.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const plainText = (html) => decode(html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim())
const sizeOf = async (path) => (await stat(path)).size

const page = await readFile(resolve(dist, '1-dollar-website/index.html'), 'utf8')
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
console.log(`Checking dist/ as the ${ended ? 'ENDED' : 'LIVE'} build\n`)

// Title
const title = decode(page.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '')
check('title is exact', title === (ended ? ENDED_TITLE : LIVE_TITLE), title)

// JSON-LD
const blocks = [...page.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json))
const nodes = []
const walk = (value) => {
  if (Array.isArray(value)) return value.forEach(walk)
  if (value && typeof value === 'object') {
    if (value['@type']) nodes.push(value)
    Object.values(value).forEach(walk)
  }
}
blocks.forEach(walk)
const ofType = (type) => nodes.filter((node) => [].concat(node['@type']).includes(type))
const faqPages = ofType('FAQPage')
check('no BreadcrumbList', ofType('BreadcrumbList').length === 0)

// Visible text
const body = page.match(/<body[\s\S]*<\/body>/i)?.[0] ?? page
const visible = plainText(body)
const dashes = visible.match(/.{0,25}[–—].{0,25}/g) ?? []
check('no em or en dashes in visible text', dashes.length === 0, dashes.slice(0, 2).join(' | '))
check('no <video> element in prerendered HTML', (page.match(/<video/g) ?? []).length === 0)

if (ended) {
  check('no Offer in JSON-LD', ofType('Offer').length === 0)
  check('no VideoObject in JSON-LD', ofType('VideoObject').length === 0)
  check('no poster preload', !page.includes(`as="image" fetchpriority="high"`) || !page.includes(ONE_DOLLAR_AD.poster))
  check('ended page is not in the live sitemap video list', !sitemap.includes(ONE_DOLLAR_AD.video) )
} else {
  check('poster preload link present', new RegExp(`<link[^>]*rel="preload"[^>]*as="image"[^>]*href="${ONE_DOLLAR_AD.poster}"|<link[^>]*rel="preload"[^>]*href="${ONE_DOLLAR_AD.poster}"[^>]*as="image"`).test(page))
  check('JSON-LD has Offer', ofType('Offer').length > 0)
  check('JSON-LD has VideoObject', ofType('VideoObject').length > 0)
  check('JSON-LD has one FAQPage', faqPages.length === 1, `${faqPages.length} found`)
  const marked = faqPages[0] ? [].concat(faqPages[0].mainEntity ?? []).length : 0
  const shown = ONE_DOLLAR_FAQ.filter(([question]) => visible.includes(decode(question))).length
  check('FAQPage count equals visible FAQ items', marked > 0 && marked === shown && shown === ONE_DOLLAR_FAQ.length, `schema ${marked}, visible ${shown}, source ${ONE_DOLLAR_FAQ.length}`)
  check('sitemap has the video entry', new RegExp(`<loc>${siteOrigin}/1-dollar-website/</loc>[\\s\\S]*?${ONE_DOLLAR_AD.video}[\\s\\S]*?</url>`).test(sitemap.split('</url>').find((chunk) => chunk.includes(`<loc>${siteOrigin}/1-dollar-website/</loc>`)) + '</url>'))
  check(`poster is 30 KB or less`, (await sizeOf(resolve(dist, `.${ONE_DOLLAR_AD.poster}`))) <= 30 * KB, `${((await sizeOf(resolve(dist, `.${ONE_DOLLAR_AD.poster}`))) / KB).toFixed(1)} KB`)
}

// Template preview pages: noindex, and not in the sitemap
for (const { slug } of TEMPLATES) {
  const html = await readFile(resolve(dist, `1-dollar-website/${slug}/index.html`), 'utf8')
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? ''
  check(`${slug} preview carries noindex`, /noindex/.test(robots), robots || 'no robots tag')
  check(`${slug} preview is not in sitemap.xml`, !sitemap.includes(`<loc>${siteOrigin}/1-dollar-website/${slug}/</loc>`))
}

// Thumbnails
for (const { slug } of TEMPLATES) {
  const small = await sizeOf(resolve(dist, `images/templates/${slug}-400.webp`)).catch(() => Infinity)
  check(`${slug}-400.webp is 15 KB or less`, small <= 15 * KB, Number.isFinite(small) ? `${(small / KB).toFixed(1)} KB` : 'missing')
}

console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
