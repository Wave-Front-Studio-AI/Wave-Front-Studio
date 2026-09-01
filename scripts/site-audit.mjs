import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { routes } from '../src/routes.js'
import { freeSetupFaqs, siteFaqs } from '../src/data/faqs.js'
import { siteOrigin } from '../src/data/site.js'

const dist = resolve(import.meta.dirname, '../dist')
const routePaths = new Set(routes.map(({ path }) => path))
const failures = []
const titles = new Map()

const plainText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#\d]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()

for (const route of routes) {
  const file = route.path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${route.path}index.html`)
  const html = await readFile(file, 'utf8')
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
  const description = html.match(/<meta name="description" content="([^"]*)"\s*\/>/i)?.[1]?.trim() ?? ''
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

const faqHtml = await readFile(resolve(dist, 'faqs/index.html'), 'utf8')
const schemas = [...faqHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]))
const faqSchema = schemas.find((schema) => schema['@type'] === 'FAQPage')
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

console.log(JSON.stringify({ routes: routes.length, uniqueTitles: titles.size, failures }, null, 2))
if (failures.length) process.exitCode = 1
