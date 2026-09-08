// Gate a blog draft against the house contract before it reaches the site.
//
// The thresholds below are not invented: they were measured across the posts
// already published on this site, so a passing draft is one that looks like the
// rest of the blog. See CONTENT-CONTRACT.md for the reasoning.
//
//   node blog-agent/validate-post.mjs                 # every draft in drafts/
//   node blog-agent/validate-post.mjs <file.mjs>      # one draft
//   node blog-agent/validate-post.mjs --live          # audit the published posts
//
// Exits non-zero if any draft has an error. Warnings never block; they mark the
// places a human has to confirm something a script cannot.

import { readdir, access } from 'node:fs/promises'
import { resolve, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { posts as livePosts } from '../src/data/generated/posts.js'
import { routes } from '../src/routes.js'
import { testimonials, contact } from '../src/data/site.js'

const root = resolve(import.meta.dirname, '..')
const draftsDir = resolve(import.meta.dirname, 'drafts')

/* --------------------------------------------------------------- measured */
// Ranges observed across the published posts, widened just enough that a good
// piece is not rejected for being forty words long or short.
const LIMITS = {
  words: [900, 1060],       // observed 923-1029
  excerpt: [110, 170],      // observed 114-158
  h2: [5, 10],              // observed 6-9, includes the CTA and Related headings
  relatedLinks: 3,          // every published post links exactly three
}

const ENTITIES = {
  '&#8217;': "'", '&#8216;': "'", '&#8220;': '"', '&#8221;': '"',
  '&#8212;': '—', '&#8211;': '–', '&rarr;': '→', '&amp;': '&',
  '&nbsp;': ' ', '&quot;': '"', '&lt;': '<', '&gt;': '>',
}

const decode = (s) => s.replace(/&#?\w+;/g, (m) => ENTITIES[m] ?? ' ')
const stripTags = (s) => s.replace(/<[^>]+>/g, ' ')

// Fold typography so a quote still matches its source when one copy uses curly
// apostrophes and the other uses straight ones, or an em dash where the data
// file has a hyphen. Without this, byte-identical prose compares as different.
const foldTypography = (s) => s
  .replace(/[‘’ʼ]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[‒-―−]/g, '-')
  .replace(/…/g, '...')

const normalise = (s) =>
  foldTypography(decode(stripTags(s))).replace(/\s+/g, ' ').trim().toLowerCase()
const countWords = (html) =>
  decode(stripTags(html)).split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length
const count = (html, re) => (html.match(re) ?? []).length

/* ------------------------------------------------------------------ rules */
export async function validate(post, { existingSlugs, routePaths, source, alreadyPublished = false }) {
  const errors = []
  const warnings = []
  const err = (m) => errors.push(m)
  const warn = (m) => warnings.push(m)

  for (const field of ['slug', 'title', 'date', 'excerpt', 'content']) {
    if (typeof post?.[field] !== 'string' || !post[field].trim()) err(`missing or empty field: ${field}`)
  }
  if (errors.length) return { errors, warnings }

  const { slug, title, date, excerpt, content } = post

  // --- identity
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(`slug is not lowercase-kebab: ${slug}`)
  if (!alreadyPublished) {
    if (existingSlugs.has(slug)) err(`slug already published: ${slug}`)
    if (routePaths.has(`/${slug}/`)) err(`slug collides with an existing route: /${slug}/`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) err(`date is not YYYY-MM-DD: ${date}`)
  if (Number.isNaN(Date.parse(`${date}T00:00:00`))) err(`date is not a real date: ${date}`)

  // --- length
  const words = countWords(content)
  const [wMin, wMax] = LIMITS.words
  if (words < wMin || words > wMax) err(`word count ${words} outside the house range ${wMin}-${wMax}`)
  const [eMin, eMax] = LIMITS.excerpt
  if (excerpt.length < eMin || excerpt.length > eMax) err(`excerpt ${excerpt.length} chars, house range is ${eMin}-${eMax}`)
  if (title.length > 95) warn(`title is ${title.length} chars; published titles stay under about 80`)

  // --- required shape
  if (!content.startsWith('<div class="lf-article">')) err('content must open with <div class="lf-article">')
  if (!content.endsWith('</div>')) err('content must close the lf-article wrapper')
  if (count(content, /class="lf-standfirst"/g) !== 1) err('exactly one lf-standfirst paragraph is required')
  if (count(content, /class="lf-cta"/g) !== 1) err('exactly one lf-cta block is required')
  if (count(content, /class="lf-related"/g) !== 1) err('exactly one lf-related aside is required')
  if (count(content, /<h1/g) > 0) err('no <h1>: the page template renders the title')

  const h2 = count(content, /<h2>/g)
  const [hMin, hMax] = LIMITS.h2
  if (h2 < hMin || h2 > hMax) err(`${h2} <h2> headings, house range is ${hMin}-${hMax}`)

  const related = content.match(/<aside class="lf-related">[\s\S]*?<\/aside>/)?.[0] ?? ''
  const relatedLinks = count(related, /href=/g)
  if (relatedLinks !== LIMITS.relatedLinks) err(`lf-related has ${relatedLinks} links, every published post has ${LIMITS.relatedLinks}`)

  // --- structural balance
  for (const [tag, open, close] of [['div', /<div\b/g, /<\/div>/g], ['aside', /<aside\b/g, /<\/aside>/g],
    ['figure', /<figure\b/g, /<\/figure>/g], ['table', /<table\b/g, /<\/table>/g],
    ['ul', /<ul\b/g, /<\/ul>/g], ['ol', /<ol\b/g, /<\/ol>/g], ['blockquote', /<blockquote\b/g, /<\/blockquote>/g]]) {
    const o = count(content, open); const c = count(content, close)
    if (o !== c) err(`unbalanced <${tag}>: ${o} open, ${c} close`)
  }

  // --- links
  const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
  for (const href of new Set(hrefs)) {
    if (href.startsWith('tel:')) {
      // Accept any number the site actually publishes, not just the primary one.
      const published = new Set(
        [contact?.phone, contact?.phoneAlt, contact?.supportPhone]
          .filter(Boolean)
          .map((p) => p.replace(/\D/g, '')),
      )
      const digits = href.replace(/\D/g, '')
      if (published.size && !published.has(digits)) {
        err(`phone link ${href} is not a number published in src/data/site.js`)
      }
      continue
    }
    if (/^https?:/.test(href)) { warn(`external link, confirm it is live: ${href}`); continue }
    if (href.startsWith('#')) continue
    if (!routePaths.has(href) && href !== `/${slug}/`) err(`internal link does not resolve to a route: ${href}`)
  }

  // --- quotes attributed to a person must be real testimonials
  // lf-quote is also used for the studio's own pull quotes, which need no source.
  for (const block of content.match(/<blockquote class="lf-quote">[\s\S]*?<\/blockquote>/g) ?? []) {
    const text = normalise(block)
    const attribution = normalise([...block.matchAll(/<em>([\s\S]*?)<\/em>/g)].at(-1)?.[1] ?? '')
      .replace(/^[-–—]\s*/, '')
    const selfAttributed = attribution === '' || /^wavefront studio( llc)?$/.test(attribution)
    if (selfAttributed) continue

    const match = testimonials.find((t) => text.includes(normalise(t.quote)))
    if (!match) {
      err(`lf-quote attributed to "${attribution}" matches no testimonial in src/data/site.js — client quotes may not be paraphrased or invented`)
    } else if (!attribution.includes(match.name.toLowerCase())) {
      err(`lf-quote text is ${match.name}'s but it is attributed to "${attribution}"`)
    }
  }

  // --- images are optional, but must exist and be described
  for (const img of content.match(/<img[^>]*>/g) ?? []) {
    const src = img.match(/src="([^"]+)"/)?.[1]
    if (!src) { err('an <img> has no src'); continue }
    if (!/alt="[^"]+"/.test(img)) err(`image has no alt text: ${src}`)
    if (!/loading="lazy"/.test(img)) warn(`image is not lazy-loaded: ${src}`)
    if (src.startsWith('/')) {
      try { await access(resolve(root, 'public', src.slice(1))) }
      catch { err(`image file not found in public/: ${src}`) }
    }
  }

  // --- things a script cannot verify, but a human must
  const plain = decode(stripTags(content))
  for (const m of plain.matchAll(/\b\d+(\.\d+)?\s?%/g)) warn(`confirm the source for "${m[0].trim()}" — no unsourced statistics`)
  for (const m of plain.matchAll(/\b(?:studies|research|a study|survey|report)\s+(?:show|shows|found|finds|says)\b/gi)) warn(`vague sourcing: "${m[0]}" — name the source or cut it`)
  for (const m of plain.matchAll(/\b(guarantee[ds]?|guaranteed results|#1|number one|the best in|always works|never fails|risk-free)\b/gi)) warn(`promise-shaped wording: "${m[0]}" — the site does not make guarantees`)
  if (count(content, /class="lf-callout"/g) === 0) warn('no lf-callout; every published post has one')

  return { errors, warnings, stats: { words, h2, excerpt: excerpt.length, source } }
}

/* ------------------------------------------------------------------- main */
// Only run the CLI when invoked directly, so publish-post.mjs can reuse validate().
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main()
}

async function main() {
const args = process.argv.slice(2)
const live = args.includes('--live')
const files = args.filter((a) => !a.startsWith('--'))

const routePaths = new Set(routes.map((r) => r.path))
const publishedSlugs = new Set(livePosts.map((p) => p.slug))

let targets = []
if (live) {
  targets = livePosts.map((p) => ({ post: p, source: `live:${p.slug}` }))
} else {
  const list = files.length
    ? files
    : (await readdir(draftsDir).catch(() => []))
      .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
      .map((f) => resolve(draftsDir, f))
  for (const f of list) {
    const mod = await import(pathToFileURL(resolve(f)).href)
    targets.push({ post: mod.default ?? mod.post, source: basename(f) })
  }
}

if (!targets.length) {
  console.log('No drafts found in blog-agent/drafts/. Copy _template.mjs to start one.')
  process.exit(0)
}

let failed = 0
for (const { post, source } of targets) {
  // A draft kept as a record of an already-published post is not a failure; its
  // slug is legitimately taken. Re-check everything else about it.
  const shipped = live || publishedSlugs.has(post?.slug)
  const { errors, warnings, stats } = await validate(post, {
    existingSlugs: publishedSlugs, routePaths, source, alreadyPublished: shipped,
  })

  const label = post?.slug ?? source
  if (errors.length) {
    failed += 1
    console.log(`\nFAIL  ${label}  (${source})`)
    for (const e of errors) console.log(`   error:   ${e}`)
  } else {
    const state = shipped && !live ? 'LIVE ' : 'PASS '
    console.log(`\n${state} ${label}  ${stats.words} words, ${stats.h2} h2, ${stats.excerpt}-char excerpt`)
  }
  for (const w of warnings) console.log(`   review: ${w}`)
}

console.log(`\n${targets.length} checked, ${failed} failing`)
process.exit(failed ? 1 : 0)
}
