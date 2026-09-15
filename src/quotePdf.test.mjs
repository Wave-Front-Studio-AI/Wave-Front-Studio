import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createQuotePdf, loadQuoteBrandAssets } from './quotePdf.js'
import { SERVICES } from './data/generated/packages.js'
import { calculateQuote } from './packageQuote.js'

const assets = {
  logo: new Uint8Array(await readFile(new URL('../public/wp-content/uploads/2026/04/Wavefront-studio.jpg', import.meta.url))),
  regular: new Uint8Array(await readFile(new URL('../public/fonts/outfit-quote-regular.ttf', import.meta.url))),
  semibold: new Uint8Array(await readFile(new URL('../public/fonts/outfit-quote-semibold.ttf', import.meta.url))),
}
const date = new Date('2026-09-15T12:00:00Z')
const quote = {
  count: 2, one: 5000, monthly: 199, pct: 5, bundleAmount: 250, oneAfter: 4750, firstMonthsFree: 199,
  rows: [
    { label: 'Landing Pages — Grow', amount: '$500' },
    { label: 'Tradeshow Lead Capture & Card Scanner — Grow', amount: '$4,500 + $199/mo' },
  ],
}

test('a mixed one-time and monthly quote produces a branded, one-page PDF without changing its input', () => {
  const original = structuredClone(quote)
  const doc = createQuotePdf(quote, assets, date)
  const output = doc.output()
  assert.match(output, /^%PDF-/)
  assert.match(output, /\/Title \(Wavefront Studio - Package Quote\)/)
  assert.match(output, /\/Author \(Wavefront Studio LLC\)/)
  assert.match(output, /\/Subtype \/Image/)
  assert.match(output, /\/FontFile2/)
  assert.equal(doc.getNumberOfPages(), 1)
  assert.deepEqual(quote, original)
})

test('one-time-only and monthly-only selections both export', () => {
  for (const selected of [
    { count: 1, one: 100, monthly: 0, pct: 0, bundleAmount: 0, oneAfter: 100, firstMonthsFree: 0, rows: [{ label: 'Landing Pages — Launch', amount: '$100' }] },
    { count: 1, one: 0, monthly: 500, pct: 0, bundleAmount: 0, oneAfter: 0, firstMonthsFree: 500, rows: [{ label: 'Website SEO — Launch', amount: '$500/mo' }] },
  ]) {
    assert.equal(createQuotePdf(selected, assets, date).getNumberOfPages(), 1)
  }
})

test('a full-catalog quote including every add-on continues across pages', () => {
  const state = Object.fromEntries(SERVICES.map((service) => [service.id, {
    tier: service.tiers.length - 1, pages: 300, addons: service.addons.map((_, index) => index), opts: {},
  }]))
  const doc = createQuotePdf(calculateQuote(state), assets, date)
  assert.ok(doc.getNumberOfPages() > 2)
  assert.ok(doc.getNumberOfPages() < 15)
})

test('landing page bundles and email plans export together on one branded page', () => {
  const bundleQuote = calculateQuote({
    landing: { tier: 1, pages: 25, addons: [], opts: {} },
    email: { tier: 1, addons: [], opts: {} },
  })
  assert.equal(bundleQuote.rows[0].amount, '$1,000')
  assert.equal(bundleQuote.rows[1].amount, '$500 + $450/mo')
  assert.equal(bundleQuote.oneAfter, 1425)
  assert.equal(createQuotePdf(bundleQuote, assets, date).getNumberOfPages(), 1)
})

test('an empty selection cannot become a quote', () => {
  assert.throws(() => createQuotePdf({ ...quote, count: 0, rows: [] }, assets, date), /Select a service/)
})

test('branding failures can be retried and successful assets are cached', async (t) => {
  let fail = true
  const fetch = t.mock.method(globalThis, 'fetch', async (url) => {
    if (fail) return new Response('', { status: 503 })
    const bytes = url.endsWith('.jpg') ? assets.logo : url.includes('semibold') ? assets.semibold : assets.regular
    return new Response(bytes)
  })
  await assert.rejects(loadQuoteBrandAssets(), /quote branding/)
  fail = false
  const loaded = await loadQuoteBrandAssets()
  assert.deepEqual(loaded, assets)
  assert.equal(await loadQuoteBrandAssets(), loaded)
  assert.equal(fetch.mock.callCount(), 6)
})
