// Writes dist/packages.json: the Build Your Package prices as plain data, so other
// tools (the Wavefront Command Center price watch) can compare against the live site
// without reading the source code. Runs as part of `npm run build`, after vite build.
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LANDING_PAGE_BUNDLES, OFFER, SERVICES } from '../src/data/generated/packages.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'dist/packages.json')

const data = {
  generated_at: new Date().toISOString(),
  source: 'src/data/generated/packages.js',
  offer: OFFER,
  landing_page_bundles: LANDING_PAGE_BUNDLES,
  services: SERVICES.map((service) => ({
    id: service.id,
    name: service.name,
    billing: service.billing,
    tiers: (service.tiers || []).map((tier) => ({ n: tier.n, s: tier.s, m: tier.m, ...(tier.custom ? { custom: true } : {}) })),
    addons: (service.addons || []).map((addon) => ({
      l: addon.l,
      p: addon.p,
      t: addon.t,
      ...(addon.opts ? { opts: addon.opts.map((option) => ({ l: option.l, q: option.q })) } : {}),
    })),
  })),
}

await mkdir(dirname(out), { recursive: true })
await writeFile(out, `${JSON.stringify(data, null, 2)}\n`)
console.log(`Wrote dist/packages.json (${data.services.length} services)`)
