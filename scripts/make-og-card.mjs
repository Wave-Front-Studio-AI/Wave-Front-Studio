// Generates public/og-card.png, the 1200x630 image every page points at with
// og:image. Run it again if the logo or the brand palette changes:
//   node scripts/make-og-card.mjs
//
// The card is drawn rather than hand-designed so it stays in step with the site:
// the palette below is copied from :root in styles.css, and the rotated square
// echoes the sweep on .kinetic-button. Text is deliberately absent — the brand
// fonts ship as woff2, which the SVG rasteriser cannot load, and the logo is
// already a wordmark.
import { stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')
const WIDTH = 1200
const HEIGHT = 630

const ink = '#0d1b2a'
const ink2 = '#143a5c'
const cyan = '#36f0ee'

const LOGO_WIDTH = 660
const logo = await sharp(resolve(root, 'public/wave-logo-white.webp'))
  .resize({ width: LOGO_WIDTH })
  .png()
  .toBuffer()
const { height: logoHeight } = await sharp(logo).metadata()

// Logo and the accent rule are centred as one block.
const RULE_WIDTH = 120
const RULE_HEIGHT = 4
const GAP = 40
const blockHeight = logoHeight + GAP + RULE_HEIGHT
const logoTop = Math.round((HEIGHT - blockHeight) / 2)
const ruleTop = logoTop + logoHeight + GAP

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ink}" />
      <stop offset="1" stop-color="${ink2}" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${cyan}" stop-opacity="0.30" />
      <stop offset="1" stop-color="${cyan}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />

  <!-- Soft cyan light from the top right, as on the page heroes. -->
  <circle cx="${WIDTH - 90}" cy="10" r="440" fill="url(#glow)" />

  <!-- The rotated square parked off the bottom-left corner, the same shape that
       sweeps across .kinetic-button on hover. Kept mostly off-canvas so it reads
       as a diagonal of light rather than a shape sitting on the card. -->
  <rect x="-300" y="${HEIGHT - 80}" width="520" height="520" rx="30"
        transform="rotate(-40 -40 ${HEIGHT + 120})" fill="${cyan}" fill-opacity="0.11" />

  <rect x="${(WIDTH - RULE_WIDTH) / 2}" y="${ruleTop}"
        width="${RULE_WIDTH}" height="${RULE_HEIGHT}" rx="${RULE_HEIGHT / 2}" fill="${cyan}" />
</svg>`)

const out = resolve(root, 'public/og-card.png')
await sharp(background)
  .composite([{ input: logo, top: logoTop, left: Math.round((WIDTH - LOGO_WIDTH) / 2) }])
  .png({ compressionLevel: 9, palette: false })
  .toFile(out)

const { width, height, format } = await sharp(out).metadata()
const { size } = await stat(out)
console.log(`Wrote public/og-card.png — ${width}x${height} ${format}, ${(size / 1024).toFixed(1)} kB`)
