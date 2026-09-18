import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { routes } from '../src/routes.js'
import { freeSetupFaqs, siteFaqs } from '../src/data/faqs.js'
import { siteOrigin } from '../src/data/site.js'
import { posts } from '../src/data/generated/posts.js'

const dist = resolve(import.meta.dirname, '../dist')
const routePaths = new Set(routes.map(({ path }) => path))
const failures = []
// Length checks are advice, not rules: Google truncates rather than penalises.
const warnings = []
const titles = new Map()
const graphs = {}

const plainText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#\d]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const decode = (text) => text.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const JSONLD = /<script type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/g
const ORGANIZATION_ID = `${siteOrigin}/#organization`

for (const route of routes) {
  const file = route.path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${route.path}index.html`)
  const html = await readFile(file, 'utf8')
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? ''
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '')
  const description = decode(html.match(/<meta name="description" content="([^"]*)"\s*\/>/i)?.[1]?.trim() ?? '')
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"\s*\/>/i)?.[1]?.trim() ?? ''
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length
  const body = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? ''

  if (!title) failures.push(`${route.path}: missing title`)
  else if (titles.has(title)) failures.push(`${route.path}: duplicate title also used by ${titles.get(title)}`)
  else titles.set(title, route.path)
  if (!description) failures.push(`${route.path}: missing description`)
  if (canonical !== `${siteOrigin}${route.path}`) failures.push(`${route.path}: canonical is ${canonical || 'missing'}`)
  if (h1Count !== 1) failures.push(`${route.path}: expected one h1, found ${h1Count}`)
  if (plainText(body).length < 300) failures.push(`${route.path}: body is only ${plainText(body).length} characters`)
  if (/class="[^"]*chat-agent/.test(html)) failures.push(`${route.path}: chat markup was prerendered`)

  // An AI-writing tell (DESIGN.md, "Copy"). Advice rather than a failure: a few
  // price separators and the Google data disclosure keep theirs on purpose.
  const dashCount = (body.match(/—|&mdash;|&#8212;/g) ?? []).length
  if (dashCount) warnings.push(`${route.path}: ${dashCount} em dash${dashCount === 1 ? '' : 'es'} in visible copy`)

  if (title.length > 70) warnings.push(`${route.path}: title is ${title.length} characters`)
  if (description.length > 160) warnings.push(`${route.path}: description is ${description.length} characters`)

  // Google stops reading <head> at the first element that does not belong
  // there. An <img> (the Meta Pixel noscript fallback is the usual culprit)
  // would hide every tag after it.
  if (/<(?:img|iframe|div|span|p)[\s>]/i.test(head)) failures.push(`${route.path}: body-only element inside <head>`)
  if (!/<meta property="og:image" content="https:\/\//.test(head)) failures.push(`${route.path}: missing og:image`)
  if (route.kind === 'post' && !/<meta property="og:type" content="article"/.test(head)) {
    failures.push(`${route.path}: post is not marked og:type article`)
  }

  const blocks = [...html.matchAll(JSONLD)]
  if (blocks.length !== 1) failures.push(`${route.path}: expected one JSON-LD block, found ${blocks.length}`)
  else {
    const [, attributes, text] = blocks[0]
    // Without the id the browser-side useSeo adds a second copy.
    if (!/\bid="route-jsonld"/.test(attributes)) failures.push(`${route.path}: JSON-LD has no id="route-jsonld"`)
    try {
      const nodes = JSON.parse(text)['@graph'] ?? []
      graphs[route.path] = nodes
      if (!nodes.some((node) => node['@id'] === ORGANIZATION_ID)) failures.push(`${route.path}: JSON-LD graph has no organization`)
    } catch {
      failures.push(`${route.path}: JSON-LD does not parse`)
    }
  }

  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1]
    if (href.startsWith('//')) continue
    const target = href.split(/[?#]/)[0] || route.path
    if (/\.[a-z\d]{2,5}$/i.test(target)) continue
    const normalized = target.endsWith('/') ? target : `${target}/`
    if (!routePaths.has(normalized)) failures.push(`${route.path}: dead internal link ${href}`)
  }
}

const notFound = await readFile(resolve(dist, '404.html'), 'utf8')
if (/class="[^"]*chat-agent/.test(notFound)) failures.push('404.html: chat markup was prerendered')
if ((notFound.match(/<h1(?:\s|>)/gi) ?? []).length !== 1) failures.push('404.html: expected one h1')
if (!/<meta name="robots" content="noindex/.test(notFound)) failures.push('404.html: not marked noindex')

const faqHtml = await readFile(resolve(dist, 'faqs/index.html'), 'utf8')
const faqSchema = (graphs['/faqs/'] ?? []).find((node) => node['@type'] === 'FAQPage')
const expectedFaq = siteFaqs.map(([question, answer]) => ({
  '@type': 'Question',
  name: question,
  acceptedAnswer: { '@type': 'Answer', text: answer },
}))
if (!faqSchema || JSON.stringify(faqSchema.mainEntity) !== JSON.stringify(expectedFaq)) {
  failures.push('/faqs/: FAQPage JSON-LD differs from src/data/faqs.js')
}

const assertPublishedOrder = (path, html, items) => {
  let cursor = 0
  for (const [question, answer] of items) {
    const questionAt = html.indexOf(question, cursor)
    const answerAt = html.indexOf(answer, questionAt)
    if (questionAt < cursor || answerAt < questionAt) {
      failures.push(`${path}: FAQ text is missing or out of order at “${question}”`)
      return
    }
    cursor = answerAt + answer.length
  }
}
assertPublishedOrder('/faqs/', faqHtml, siteFaqs)
const freeSetupHtml = await readFile(resolve(dist, 'free-setup/index.html'), 'utf8')
assertPublishedOrder('/free-setup/', freeSetupHtml, freeSetupFaqs)

// The generated files crawlers and feed readers ask for.
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
for (const { path } of routes) {
  if (!sitemap.includes(`<loc>${siteOrigin}${path}</loc>`)) failures.push(`sitemap.xml: missing ${path}`)
}
const rss = await readFile(resolve(dist, 'rss.xml'), 'utf8')
for (const post of posts) {
  if (!rss.includes(`<link>${siteOrigin}/${post.slug}/</link>`)) failures.push(`rss.xml: missing ${post.slug}`)
}
const llms = await readFile(resolve(dist, 'llms.txt'), 'utf8')
if (/https?:\/\/wavefrontstudiollc\.com/.test(llms)) failures.push('llms.txt: links to the bare domain, which only redirects')
for (const { path, kind } of routes) {
  if (['service', 'custom-work', 'location', 'state', 'post'].includes(kind) && !llms.includes(`(${siteOrigin}${path})`)) {
    failures.push(`llms.txt: missing ${path}`)
  }
}

console.log(JSON.stringify({ routes: routes.length, uniqueTitles: titles.size, failures, warnings }, null, 2))
if (failures.length) process.exitCode = 1
