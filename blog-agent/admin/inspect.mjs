// Prints the state of every draft as JSON. The admin server runs this in a
// fresh process per request, so it always reads the files as they are now.
import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { validate } from '../validate-post.mjs'
import { posts } from '../../src/data/generated/posts.js'
import { routes, staticPages } from '../../src/routes.js'

const draftsDir = resolve(import.meta.dirname, '../drafts')
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
const published = new Set(posts.map((p) => p.slug))
const routePaths = new Set([...routes.map((r) => r.path), ...staticPages])

const words = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#?\w+;/g, ' ').split(/\s+/).filter(Boolean).length

const files = (await readdir(draftsDir)).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort().reverse()
const drafts = []
for (const file of files) {
  const mod = await import(pathToFileURL(resolve(draftsDir, file)).href)
  const post = mod.default ?? mod.post
  const isPublished = published.has(post.slug)
  const { errors, warnings } = await validate(post, {
    existingSlugs: new Set([...published].filter((s) => s !== post.slug)),
    routePaths,
    source: file,
    alreadyPublished: isPublished,
  })
  let status = 'ready'
  if (isPublished) status = 'published'
  else if (errors.length) status = 'failing'
  else if (post.date > today) status = 'scheduled'
  drafts.push({
    file, status, errors, warnings,
    slug: post.slug, title: post.title, date: post.date, excerpt: post.excerpt,
    image: post.image, words: words(post.content), content: post.content,
  })
}
console.log(JSON.stringify({ today, drafts }))
