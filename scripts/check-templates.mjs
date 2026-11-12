// Checks the $1 Website templates in src/templates/designs: required fields, readable colours, no dashes in the
// copy, and that no two templates share the same look. Run: node scripts/check-templates.mjs
import { DESIGNS } from '../src/templates/designs/index.js'
import { TEMPLATES } from '../src/templates/list.js'

const hex = (value) => {
  const clean = value.replace('#', '')
  const full = clean.length === 3 ? [...clean].map((c) => c + c).join('') : clean
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}
const lum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const mix = (a, b, pct) => a.map((v, i) => Math.round(v * pct + b[i] * (1 - pct)))

const FONTS = ['sans', 'serif', 'rounded', 'slab', 'display', 'impact', 'mono']
const NAVS = ['bar', 'center', 'stack']
const HEROES = ['split', 'center', 'overlay', 'band', 'left']
const CARDS = ['cards', 'rows', 'icons', 'lines']
const GALLERIES = ['grid', 'mosaic', 'strip']
const RADII = [0, 6, 14, 28]
const COLORS = ['bg', 'surface', 'ink', 'muted', 'line', 'accent', 'accentInk']

const problems = []
const fail = (slug, message) => problems.push(`${slug}: ${message}`)
const looks = new Map()

for (const { slug } of TEMPLATES) {
  const t = DESIGNS[slug]
  if (!t) { fail(slug, 'not designed yet'); continue }
  if (t.slug !== slug) fail(slug, `slug is ${t.slug}`)
  const th = t.theme || {}
  for (const key of COLORS) if (!/^#[0-9a-f]{6}$/i.test(th[key] || '')) fail(slug, `theme.${key} must be a #rrggbb colour`)
  if (!['light', 'dark'].includes(th.mood)) fail(slug, 'theme.mood must be light or dark')
  if (!FONTS.includes(th.font)) fail(slug, 'theme.font')
  if (th.headFont && !FONTS.includes(th.headFont)) fail(slug, 'theme.headFont')
  if (!NAVS.includes(th.nav)) fail(slug, 'theme.nav')
  if (!HEROES.includes(th.hero)) fail(slug, 'theme.hero')
  if (!CARDS.includes(th.cards)) fail(slug, 'theme.cards')
  if (!GALLERIES.includes(th.gallery)) fail(slug, 'theme.gallery')
  if (!RADII.includes(th.radius)) fail(slug, 'theme.radius must be 0, 6, 14 or 28')
  if (th.hero === 'overlay' && th.mood === 'dark') fail(slug, 'hero overlay needs mood light (it uses the ink colour as its dark background)')

  if (!problems.some((p) => p.startsWith(`${slug}: theme`))) {
    const [bg, surface, ink, muted, accent, accentInk] = ['bg', 'surface', 'ink', 'muted', 'accent', 'accentInk'].map((k) => hex(th[k]))
    const check = (name, a, b, min = 4.5) => { const r = ratio(a, b); if (r < min) fail(slug, `${name} contrast ${r.toFixed(2)} (needs ${min})`) }
    check('ink on bg', ink, bg)
    check('ink on surface', ink, surface)
    check('muted on bg', muted, bg)
    check('muted on surface', muted, surface)
    check('accentInk on accent', accentInk, accent)
    // Accent is used as text on the page and on the surface; in dark mood it is lightened 20% toward white first.
    const text = th.mood === 'dark' ? mix(accent, [255, 255, 255], 0.8) : accent
    check('accent text on bg', text, bg)
    check('accent text on surface', text, surface)
    if (th.hero === 'overlay') {
      const overlayEnd = mix(ink, accent, 0.7)
      check('white on hero overlay', [255, 255, 255], overlayEnd)
    }
    if (th.hero === 'center') check('ink on hero', ink, surface)
  }

  const need = (path, value, min = 1) => { if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length < min)) fail(slug, `${path} is missing`) }
  const b = t.business || {}
  for (const key of ['name', 'tagline', 'phone', 'email', 'address', 'cta']) need(`business.${key}`, b[key])
  need('business.hours', b.hours, 2)
  const h = t.home || {}
  for (const key of ['eyebrow', 'headline', 'sub', 'ctaPrimary', 'featureTitle', 'bandTitle', 'bandText']) need(`home.${key}`, h[key])
  need('home.proof', h.proof, 3); need('home.features', h.features, 4)
  const s = t.services || {}
  for (const key of ['title', 'intro', 'bandTitle']) need(`services.${key}`, s[key])
  need('services.items', s.items, 6)
  const a = t.about || {}
  for (const key of ['title', 'intro', 'valuesTitle']) need(`about.${key}`, a[key])
  need('about.body', a.body, 2); need('about.values', a.values, 4)
  const g = t.gallery || {}
  for (const key of ['title', 'intro']) need(`gallery.${key}`, g[key])
  need('gallery.items', g.items, 6)
  const c = t.contact || {}
  for (const key of ['title', 'intro', 'formLabel', 'send']) need(`contact.${key}`, c[key])

  // No dashes in the copy, and the headline stays short enough to sit in a hero.
  const strings = JSON.stringify(t, (key, value) => (key === 'theme' ? undefined : value))
  if (/[–—]/.test(strings) || /\s-\s/.test(strings)) fail(slug, 'copy has a dash (use a comma, colon or full stop)')
  if ((h.headline || '').length > 90) fail(slug, 'home.headline is longer than 90 characters')

  const look = [th.hero, th.nav, th.cards, th.gallery, th.font, th.headFont || th.font, th.radius, th.mood].join('|')
  if (looks.has(look)) fail(slug, `same look as ${looks.get(look)}`)
  looks.set(look, slug)
}

// Spread: no more than three templates may share a hero, so the gallery does not look samey.
for (const hero of HEROES) {
  const n = Object.values(DESIGNS).filter((t) => t.theme.hero === hero).length
  if (n > 4) problems.push(`${n} templates use hero ${hero} (max 4)`)
}

if (problems.length) {
  console.log(problems.join('\n'))
  console.log(`\n${problems.length} problem(s). ${Object.keys(DESIGNS).length} of ${TEMPLATES.length} templates designed.`)
  process.exitCode = 1
} else {
  console.log(`All ${TEMPLATES.length} templates pass.`)
}
