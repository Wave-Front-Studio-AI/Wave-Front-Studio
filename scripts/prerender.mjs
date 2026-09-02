import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { routes } from '../src/routes.js'
import { siteOrigin } from '../src/data/site.js'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const ssrEntry = pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href

const { render } = await import(ssrEntry)
const template = await readFile(resolve(dist, 'index.html'), 'utf8')

const escape = (value) =>
  String(value ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch])

// public/ ships wave-logo.webp; the .png this used to name has never existed,
// so every share card resolved a 404 image.
const ogImage = `${siteOrigin}/wave-logo.webp`

function buildHead({ title, description, canonical, schema }) {
  const url = `${siteOrigin}${canonical || '/'}`
  const parts = [
    '<meta property="og:site_name" content="Wavefront Studio" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:image" content="${ogImage}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
  ]
  if (schema) {
    parts.push(`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`)
  }
  return parts.join('')
}

let written = 0

for (const route of routes) {
  const { html, seo } = await render(route.path)
  const title = seo.title || 'Wavefront Studio LLC'
  const description = seo.description || ''
  const canonical = seo.canonical || route.path

  const page = template
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${escape(description)}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/s, `<link rel="canonical" href="${siteOrigin}${canonical}" />`)
    .replace('</head>', `${buildHead({ title, description, canonical, schema: seo.schema })}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  const target = route.path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${route.path}index.html`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, page)
  written += 1
}

// A 404 fallback that still ships the app shell, so a static host can serve it
// for unknown paths and the client router renders the not-found page.
const { html: notFoundHtml, seo: notFoundSeo } = await render('/__not-found__')
await writeFile(
  resolve(dist, '404.html'),
  template
    .replace(/<title>.*?<\/title>/s, `<title>${escape(notFoundSeo.title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${escape(notFoundSeo.description)}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/s, '')
    .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>')
    .replace('<div id="root"></div>', `<div id="root">${notFoundHtml}</div>`),
)

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url><loc>${siteOrigin}${route.path}</loc><lastmod>${today}</lastmod><priority>${route.path === '/' ? '1.0' : '0.7'}</priority></url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(resolve(dist, 'sitemap.xml'), sitemap)

await writeFile(
  resolve(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
)

await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })

console.log(`Prerendered ${written} pages + 404 + sitemap.xml`)
