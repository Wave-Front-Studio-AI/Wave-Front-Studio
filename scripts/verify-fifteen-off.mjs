// Checks the built 15% off page in dist/. Run after `npm run build`.
//   node scripts/verify-fifteen-off.mjs            live offer build
//   BUILD_TIME=2026-12-02T05:01:00Z npm run build && node scripts/verify-fifteen-off.mjs --ended
//   BUILD_TIME=2027-01-01T05:00:00Z npm run build && node scripts/verify-fifteen-off.mjs --ended   (also checks noindex)
// Prints PASS or FAIL for each check and exits 1 on any FAIL.
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FIFTEEN_OFF_FAQ } from '../src/data/fifteenOffPage.js'
import { FIFTEEN_OFF_ENDED_TITLE, FIFTEEN_OFF_LIVE_TITLE } from '../src/data/fifteenOffSeo.js'
import { siteOrigin } from '../src/data/site.js'

const ended = process.argv.includes('--ended')
const dist = resolve(import.meta.dirname, '../dist')
const retired = Date.parse(process.env.BUILD_TIME || '') >= Date.parse('2027-01-01T05:00:00Z')

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

const page = await readFile(resolve(dist, '15-off/index.html'), 'utf8')
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
console.log(`Checking dist/ as the ${ended ? 'ENDED' : 'LIVE'} build\n`)

const title = decode(page.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '')
check('title is exact', title === (ended ? FIFTEEN_OFF_ENDED_TITLE : FIFTEEN_OFF_LIVE_TITLE), title)
if (!ended) check('live title is about 60 characters or less', title.length <= 62, `${title.length}`)

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

const body = page.match(/<body[\s\S]*<\/body>/i)?.[0] ?? page
const visible = plainText(body)
const dashes = visible.match(/.{0,25}[–—].{0,25}/g) ?? []
check('no em or en dashes in visible text', dashes.length === 0, dashes.slice(0, 2).join(' | '))
check('no <video> element in prerendered HTML', (page.match(/<video/g) ?? []).length === 0)
check('one h1', (page.match(/<h1[\s>]/g) ?? []).length === 1)

const robots = page.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? ''
const inSitemap = sitemap.includes(`<loc>${siteOrigin}/15-off/</loc>`)
if (retired) {
  check('retired build carries noindex, follow', /noindex/.test(robots) && /follow/.test(robots), robots || 'no robots tag')
  check('retired build is out of sitemap.xml', !inSitemap)
} else {
  check('page is indexable (no noindex)', !/noindex/.test(robots), robots)
  check('page is in sitemap.xml', inSitemap)
  check('canonical is /15-off/', page.includes(`<link rel="canonical" href="${siteOrigin}/15-off/"`))
}

if (ended) {
  check('no Offer in JSON-LD', ofType('Offer').length === 0)
  check('no FAQPage in JSON-LD', ofType('FAQPage').length === 0)
  check('ended message is shown', visible.includes('The 15% off offer has ended'))
} else {
  const offers = ofType('Offer')
  check('JSON-LD has Offer', offers.length > 0)
  check('Offer validThrough is 2026-12-01T23:59:59-05:00', offers.every((offer) => offer.validThrough === '2026-12-01T23:59:59-05:00'))
  check('JSON-LD has Service', ofType('Service').length > 0)
  const faqPages = ofType('FAQPage')
  check('JSON-LD has one FAQPage', faqPages.length === 1, `${faqPages.length} found`)
  const marked = faqPages[0] ? [].concat(faqPages[0].mainEntity ?? []).length : 0
  const shown = FIFTEEN_OFF_FAQ.filter(([question]) => visible.includes(decode(question))).length
  check('FAQPage count equals visible FAQ items', marked > 0 && marked === shown && shown === FIFTEEN_OFF_FAQ.length, `schema ${marked}, visible ${shown}, source ${FIFTEEN_OFF_FAQ.length}`)
  check('h1 text', /<h1[^>]*>15% off ads management and brand design\.<\/h1>/.test(page))
  check('CTA and submit button text', visible.includes('Claim my 15% off') && visible.includes('Get my 15% off quote'))
  check('no price or dollar amounts on the page', !/\$\d/.test(visible), (visible.match(/.{0,20}\$\d.{0,20}/) ?? [''])[0])
  const og = await stat(resolve(dist, 'images/15-off-og.png')).catch(() => null)
  check('og image exists and is under 120 KB', Boolean(og) && og.size <= 120 * 1024, og ? `${(og.size / 1024).toFixed(1)} KB` : 'missing')
}

console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
