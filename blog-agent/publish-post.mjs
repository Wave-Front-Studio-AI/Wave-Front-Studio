// Publish a validated draft into the site.
//
//   node blog-agent/publish-post.mjs blog-agent/drafts/my-post.mjs
//   node blog-agent/publish-post.mjs --all          # every draft in drafts/
//   node blog-agent/publish-post.mjs --all --dry-run
//
// Two files change, and only these two:
//   src/data/generated/posts.js  – the post object, prepended (newest first,
//                                  because BlogIndex renders the array in order)
//   src/routes.js                – the slug, so the router and the prerenderer
//                                  both know the URL exists
//
// The draft is validated first and refused if it fails. The write is textual so
// the existing entries keep their formatting and the diff stays readable, and it
// is idempotent: a slug already present is skipped rather than duplicated.

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { validate } from './validate-post.mjs'
import { posts } from '../src/data/generated/posts.js'
import { routes } from '../src/routes.js'

const root = resolve(import.meta.dirname, '..')
const POSTS_FILE = resolve(root, 'src/data/generated/posts.js')
const ROUTES_FILE = resolve(root, 'src/routes.js')
const draftsDir = resolve(import.meta.dirname, 'drafts')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const all = args.includes('--all')
const files = args.filter((a) => !a.startsWith('--'))

/* ------------------------------------------------------------- load drafts */
let list = files
if (all || !list.length) {
  list = (await readdir(draftsDir).catch(() => []))
    .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
    .map((f) => resolve(draftsDir, f))
}
if (!list.length) {
  console.log('Nothing to publish. Put a draft in blog-agent/drafts/ (see _template.mjs).')
  process.exit(0)
}

const drafts = []
for (const f of list) {
  const mod = await import(pathToFileURL(resolve(f)).href)
  drafts.push({ post: mod.default ?? mod.post, source: basename(f) })
}

/* ---------------------------------------------------------------- validate */
const publishedSlugs = new Set(posts.map((p) => p.slug))
const routePaths = new Set(routes.map((r) => r.path))

const ready = []
let blocked = 0
for (const { post, source } of drafts) {
  if (publishedSlugs.has(post?.slug)) {
    console.log(`skip   ${post.slug} — already published`)
    continue
  }
  const { errors, warnings } = await validate(post, { existingSlugs: publishedSlugs, routePaths, source })
  if (errors.length) {
    blocked += 1
    console.log(`\nREFUSED  ${post?.slug ?? source}`)
    for (const e of errors) console.log(`   error:  ${e}`)
    continue
  }
  for (const w of warnings) console.log(`   review: ${post.slug}: ${w}`)
  ready.push(post)
}

if (blocked) {
  console.log(`\n${blocked} draft(s) failed validation. Nothing was written.`)
  process.exit(1)
}
if (!ready.length) {
  console.log('\nNothing new to publish.')
  process.exit(0)
}

/* ------------------------------------------------------------------- write */
// These files are CRLF in this repo. Preserve whatever each one already uses,
// so publishing never shows up as a whole-file line-ending change in the diff.
const eolOf = (src) => (src.includes('\r\n') ? '\r\n' : '\n')

// Match the two-space object style already in posts.js.
const asObjectLiteral = (post, eol) => {
  const keys = ['slug', 'title', 'date', 'excerpt', 'image', 'content']
  return [
    '  {',
    ...keys.map((key, i) =>
      `    ${JSON.stringify(key)}: ${JSON.stringify(post[key])}${i < keys.length - 1 ? ',' : ''}`),
    '  }',
  ].join(eol)
}

let postsSrc = await readFile(POSTS_FILE, 'utf8')
const postsEol = eolOf(postsSrc)
const opener = postsSrc.match(/export const posts = \[\r?\n/)
if (!opener) throw new Error('posts.js: could not find the posts array opener')
const block = ready.map((p) => asObjectLiteral(p, postsEol)).join(`,${postsEol}`) + `,${postsEol}`
postsSrc = postsSrc.slice(0, opener.index + opener[0].length)
  + block
  + postsSrc.slice(opener.index + opener[0].length)

let routesSrc = await readFile(ROUTES_FILE, 'utf8')
const routesEol = eolOf(routesSrc)
const slugBlock = routesSrc.match(/const postSlugs = \[([\s\S]*?)\]/)
if (!slugBlock) throw new Error('routes.js: could not find postSlugs')
const additions = ready
  .filter((p) => !slugBlock[1].includes(`'${p.slug}'`))
  .map((p) => `${routesEol}  '${p.slug}',`)
  .join('')
routesSrc = routesSrc.slice(0, slugBlock.index + 'const postSlugs = ['.length)
  + slugBlock[1].replace(/\s*$/, '') + additions + routesEol
  + routesSrc.slice(slugBlock.index + slugBlock[0].length - 1)

if (dryRun) {
  console.log(`\nDry run. Would publish ${ready.length}:`)
  for (const p of ready) console.log(`   ${p.date}  /${p.slug}/  ${p.title}`)
  process.exit(0)
}

await writeFile(POSTS_FILE, postsSrc, 'utf8')
await writeFile(ROUTES_FILE, routesSrc, 'utf8')

console.log(`\nPublished ${ready.length}:`)
for (const p of ready) console.log(`   ${p.date}  /${p.slug}/  ${p.title}`)
console.log('\nNext: npm run check && npm run build, then review the page before deploying.')
