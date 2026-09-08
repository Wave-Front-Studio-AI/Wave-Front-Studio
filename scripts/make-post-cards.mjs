// Generates one 1200x630 card per blog post into public/images/blog/<slug>.webp.
// Used both as the thumbnail on /blog/ and as the banner at the top of the post.
//   node scripts/make-post-cards.mjs            # only missing cards
//   node scripts/make-post-cards.mjs --force    # redraw everything
//
// Drawn rather than photographed, for the same reasons as make-og-card.mjs: the
// palette below is copied from :root in styles.css so the set stays in step with
// the site, and text is deliberately absent because the brand fonts ship as
// woff2, which the SVG rasteriser cannot load. The title sits in HTML next to
// the image anyway, so a card carrying words would only repeat it.
//
// Every card shares a background, a cyan glow and the rotated square that sweeps
// across .kinetic-button, so the row on /blog/ reads as one family. What changes
// is the motif: a plain geometric figure standing for the subject. Adding a post
// means adding one entry to MOTIFS below.

import { mkdir, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { posts } from '../src/data/generated/posts.js'

const root = resolve(import.meta.dirname, '..')
const outDir = resolve(root, 'public/images/blog')
const force = process.argv.includes('--force')

// Authored in a 1200x630 coordinate space, rasterised larger. The banner on a
// post page renders about 1220 CSS px wide, so a 1200px source is already under
// 1x there and visibly soft on a retina screen. Everything below stays in the
// authoring space; only the output resolution changes.
const WIDTH = 1200
const HEIGHT = 630
const RENDER_SCALE = 2

// Copied from :root in src/styles.css.
const ink = '#0d1b2a'
const ink2 = '#143a5c'
const brand = '#4284cb'
const cyan = '#36f0ee'

// Motifs are drawn inside a 400x400 box centred on the canvas; the helpers keep
// each one to plain shapes so they stay legible at thumbnail size.
const C = 200 // centre of the motif box
const MOTIF_SCALE = 1.3

const stroke = (d, { w = 10, color = cyan, opacity = 1, cap = 'round' } = {}) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`
const circle = (cx, cy, r, { color = cyan, opacity = 1, fill = true, w = 8 } = {}) =>
  fill
    ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="${opacity}"/>`
    : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${w}"/>`
const rect = (x, y, w, h, { r = 10, color = cyan, opacity = 1, fill = true, sw = 8 } = {}) =>
  fill
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}" fill-opacity="${opacity}"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${sw}"/>`

const MOTIFS = {
  // A map pin over concentric rings: the local search radius.
  'google-business-profile-does-more-than-your-website': () => [
    circle(C, C + 40, 150, { fill: false, opacity: 0.18, w: 6, color: brand }),
    circle(C, C + 40, 100, { fill: false, opacity: 0.3, w: 6, color: brand }),
    stroke(`M ${C} ${C - 130} a 78 78 0 0 1 78 78 c 0 58 -78 148 -78 148 s -78 -90 -78 -148 a 78 78 0 0 1 78 -78 z`, { w: 12 }),
    circle(C, C - 50, 30, { color: ink, opacity: 1 }),
  ],

  // Motion lines resolving into a single fast mark.
  'nobody-waits-for-a-slow-website': () => [
    stroke(`M 20 ${C - 90} H 250`, { w: 12, opacity: 0.2, color: brand }),
    stroke(`M 60 ${C - 30} H 300`, { w: 12, opacity: 0.35, color: brand }),
    stroke(`M 30 ${C + 30} H 340`, { w: 14, opacity: 0.65 }),
    stroke(`M 90 ${C + 90} H 260`, { w: 12, opacity: 0.3, color: brand }),
    stroke(`M 300 ${C - 70} l 70 100 l -70 100`, { w: 16 }),
  ],

  // Two arrows either side of a divider: the site is doing one or the other,
  // never nothing. Falling side dimmed, rising side lit.
  'website-making-or-costing-you-money': () => [
    stroke(`M ${C} 30 V 370`, { w: 4, opacity: 0.22, color: brand }),
    // Falling
    stroke(`M 40 ${C - 90} L 150 ${C + 80}`, { w: 14, opacity: 0.45, color: brand }),
    stroke(`M 150 ${C + 80} H 100 M 150 ${C + 80} V ${C + 30}`, { w: 14, opacity: 0.45, color: brand }),
    // Rising
    stroke(`M 250 ${C + 80} L 360 ${C - 90}`, { w: 16, opacity: 1 }),
    stroke(`M 360 ${C - 90} H 310 M 360 ${C - 90} V ${C - 40}`, { w: 16, opacity: 1 }),
  ],

  // A phone outline with a single decisive tick inside it.
  'do-you-need-a-mobile-app': () => [
    rect(C - 90, C - 160, 180, 320, { r: 28, fill: false, sw: 12, opacity: 0.9 }),
    rect(C - 30, C - 148, 60, 10, { r: 5, color: brand, opacity: 0.8 }),
    stroke(`M ${C - 45} ${C + 10} l 35 40 l 65 -85`, { w: 16 }),
  ],

  // A clock face where the swept arc is the reply window.
  'why-ai-follow-up-beats-working-harder': () => [
    circle(C, C, 140, { fill: false, w: 12, opacity: 0.25, color: brand }),
    stroke(`M ${C} ${C - 140} A 140 140 0 0 1 ${C + 140} ${C}`, { w: 16 }),
    stroke(`M ${C} ${C} V ${C - 90}`, { w: 12, opacity: 0.9 }),
    stroke(`M ${C} ${C} L ${C + 70} ${C + 40}`, { w: 12, opacity: 0.6, color: brand }),
    circle(C, C, 14),
  ],

  // A funnel: many enquiries in, a countable number out.
  'what-does-a-lead-actually-cost-you': () => [
    stroke(`M 40 ${C - 130} H 360 L 230 ${C + 10} V ${C + 140} L 170 ${C + 175} V ${C + 10} Z`, { w: 12 }),
    circle(120, C - 80, 12, { color: brand, opacity: 0.7 }),
    circle(200, C - 60, 12, { color: brand, opacity: 0.5 }),
    circle(275, C - 85, 12, { color: brand, opacity: 0.7 }),
  ],

  // A keypad grid with one key lit: the calculator that answers "how much?".
  'build-a-calculator-that-sells-for-you': () => {
    const out = [rect(C - 110, C - 150, 220, 300, { r: 24, fill: false, sw: 12, opacity: 0.85 })]
    out.push(rect(C - 80, C - 120, 160, 50, { r: 10, color: brand, opacity: 0.4 }))
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        const lit = r === 2 && c === 2
        out.push(rect(C - 80 + c * 58, C - 50 + r * 58, 44, 44, {
          r: 10, opacity: lit ? 1 : 0.3, color: lit ? cyan : brand,
        }))
      }
    }
    return out
  },

  // A compounding curve that keeps climbing past the last payment.
  'seo-keeps-working-after-you-stop-paying': () => [
    stroke(`M 40 ${C + 150} H 360`, { w: 8, opacity: 0.25, color: brand }),
    stroke(`M 40 ${C + 150} C 150 ${C + 140} 230 ${C + 60} 360 ${C - 150}`, { w: 16 }),
    circle(230, C + 20, 16, { color: brand }),
    stroke(`M 230 ${C + 20} V ${C + 150}`, { w: 6, opacity: 0.45, color: brand }),
  ],

  // Scattered marks on the left, an ordered sequence on the right.
  'posting-is-not-a-social-media-strategy': () => [
    circle(70, C - 110, 14, { color: brand, opacity: 0.55 }),
    circle(130, C - 40, 14, { color: brand, opacity: 0.4 }),
    circle(60, C + 40, 14, { color: brand, opacity: 0.5 }),
    circle(140, C + 130, 14, { color: brand, opacity: 0.35 }),
    stroke(`M 240 ${C - 110} H 360`, { w: 14, opacity: 0.9 }),
    stroke(`M 240 ${C - 30} H 360`, { w: 14, opacity: 0.75 }),
    stroke(`M 240 ${C + 50} H 360`, { w: 14, opacity: 0.6 }),
    stroke(`M 240 ${C + 130} H 360`, { w: 14, opacity: 0.45 }),
  ],

  // A frame split down the middle: the same thing, imagined then seen.
  'let-them-see-it-before-they-buy-it': () => [
    rect(C - 150, C - 110, 300, 220, { r: 20, fill: false, sw: 12, opacity: 0.85 }),
    `<path d="M ${C - 150} ${C - 110} h 150 v 220 h -150 z" fill="${brand}" fill-opacity="0.16"/>`,
    stroke(`M ${C} ${C - 130} V ${C + 130}`, { w: 10, opacity: 0.9 }),
    circle(C - 75, C, 26, { color: brand, opacity: 0.45 }),
    circle(C + 75, C, 26, { color: cyan, opacity: 0.95 }),
  ],

  // Layers that do not line up, then one that does.
  'why-cheap-design-costs-more': () => [
    rect(C - 130, C - 120, 200, 60, { r: 12, color: brand, opacity: 0.3 }),
    rect(C - 95, C - 40, 200, 60, { r: 12, color: brand, opacity: 0.45 }),
    rect(C - 150, C + 40, 200, 60, { r: 12, color: brand, opacity: 0.35 }),
    rect(C - 110, C + 120, 240, 60, { r: 12, opacity: 1 }),
  ],
}

// Shared scaffolding: gradient, glow, and the off-canvas rotated square.
const card = (motif) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH * RENDER_SCALE}" height="${HEIGHT * RENDER_SCALE}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ink}"/>
      <stop offset="1" stop-color="${ink2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${cyan}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${cyan}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="${WIDTH - 90}" cy="10" r="440" fill="url(#glow)"/>
  <rect x="-300" y="${HEIGHT - 80}" width="520" height="520" rx="30"
        transform="rotate(-40 -40 ${HEIGHT + 120})" fill="${cyan}" fill-opacity="0.11"/>

  <!-- Motifs are authored in a 400x400 box, then scaled up: at the 300px card
       width used on /blog/ the unscaled figure reads as too small to identify. -->
  <g transform="translate(${WIDTH / 2} ${HEIGHT / 2}) scale(${MOTIF_SCALE}) translate(-200 -200)">
    ${motif.join('\n    ')}
  </g>
</svg>`)

await mkdir(outDir, { recursive: true })

let written = 0
let skipped = 0
const missing = []

for (const post of posts) {
  const motif = MOTIFS[post.slug]
  if (!motif) { missing.push(post.slug); continue }

  const out = resolve(outDir, `${post.slug}.webp`)
  if (!force) {
    try { await access(out); skipped += 1; continue } catch { /* not there yet */ }
  }

  await sharp(card(motif()))
    .webp({ quality: 90, effort: 6 })
    .toFile(out)
  written += 1
  console.log(`  ${post.slug}.webp`)
}

console.log(`\n${written} written, ${skipped} already present, ${posts.length} posts total`)
if (missing.length) {
  console.log(`\nNo motif defined for ${missing.length} post(s). Add one to MOTIFS in this file:`)
  for (const slug of missing) console.log(`  ${slug}`)
  process.exit(1)
}
