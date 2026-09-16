import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateQuote, customLandingQuote, landingPageBundle, money } from './packageQuote.js'

const selected = (tier = 1, pages = 1) => ({ tier, pages, addons: [], opts: {} })

test('every page bundle adds its price once to every tier and remains one service', () => {
  for (const [tier, base] of [[0, 100], [1, 500], [2, 1500]]) {
    for (const [pages, price] of [[1, 0], [10, 250], [25, 500], [75, 1000], [125, 1500], [300, 3000]]) {
      const quote = calculateQuote({ landing: selected(tier, pages) })
      assert.equal(quote.one, base + price)
      assert.equal(quote.oneAfter, base + price)
      assert.equal(quote.count, 1)
      assert.equal(quote.pct, 0)
      assert.equal(quote.monthly, 0)
      assert.ok(quote.rows[0].label.endsWith(`${pages} page${pages === 1 ? '' : 's'}`))
      assert.equal(quote.rows[0].amount, `$${(base + price).toLocaleString('en-US')}`)
    }
  }
})

test('mixed quotes discount the base and page bundle together', () => {
  const state = { landing: selected(1, 25), tradeshow: selected(1) }
  const original = structuredClone(state)
  const quote = calculateQuote(state)
  assert.equal(quote.one, 5500)
  assert.equal(quote.monthly, 199)
  assert.equal(quote.count, 2)
  assert.equal(quote.pct, 5)
  assert.equal(quote.bundleAmount, 275)
  assert.equal(quote.oneAfter, 5225)
  assert.equal(quote.firstMonthsFree, 199)
  assert.deepEqual(state, original)
})

test('missing or unsupported choices use the included single page', () => {
  for (const pages of ['', undefined, NaN, Infinity, -5, 0, 3, 25.5, 999]) {
    assert.deepEqual(landingPageBundle(pages), { pages: 1, price: 0 })
  }
  assert.deepEqual(landingPageBundle('25'), { pages: 25, price: 500 })
  assert.equal(calculateQuote({ landing: { tier: 1, addons: [], opts: {} } }).one, 500)
})

test('recurring add-ons remain independent of landing page bundles', () => {
  const quote = calculateQuote({ landing: selected(0, 10), web: { ...selected(0), addons: [0, 3] } })
  assert.equal(quote.one, 2300)
  assert.equal(quote.oneAfter, 2185)
  assert.equal(quote.monthly, 99)
  assert.equal(quote.rows.filter((row) => row.sub).length, 2)
  assert.deepEqual(calculateQuote({}), { one: 0, monthly: 0, count: 0, pct: 0, bundleAmount: 0, oneAfter: 0, firstMonthsFree: 0, rows: [] })
})

test('email plans add one setup fee and keep recurring charges separate', () => {
  for (const [tier, price, label] of [[0, 250, 'Monthly'], [1, 450, 'Twice weekly']]) {
    const email = calculateQuote({ email: selected(tier) })
    assert.equal(email.one, 500)
    assert.equal(email.oneAfter, 500)
    assert.equal(email.monthly, price)
    assert.equal(email.firstMonthsFree, price)
    assert.equal(email.rows[0].label, `Email Marketing — ${label}`)
    assert.equal(email.rows[0].amount, `$500 + $${price}/mo`)
    const combined = calculateQuote({ landing: selected(1, 25), email: selected(tier) })
    assert.equal(combined.count, 2)
    assert.equal(combined.one, 1500)
    assert.equal(combined.bundleAmount, 75)
    assert.equal(combined.oneAfter, 1425)
    assert.equal(combined.monthly, price)
  }
})

const custom = { name: 'Installer directory', setup: '750', perPageEnabled: true, perPage: '100', pages: '10', details: 'Clickable installer map. Company pages stay on the main website.' }

test('custom pages replace standard bundles and keep setup, page charges, and email separate', () => {
  const state = { landing: { ...selected(3, 300), custom }, email: selected(0) }
  const before = structuredClone(state)
  const quote = calculateQuote(state)
  assert.equal(quote.one, 2250)
  assert.equal(quote.oneAfter, 2137.5)
  assert.equal(quote.monthly, 250)
  assert.equal(quote.count, 2)
  assert.equal(quote.rows[0].amount, '$750')
  assert.equal(quote.rows[0].label, 'Landing Pages — Custom: Installer directory')
  assert.equal(quote.rows[0].description, custom.details)
  assert.equal(quote.rows[1].amount, '$1,000')
  assert.equal(quote.rows[2].description, '1 email per month + analytics')
  assert.equal(money(quote.oneAfter), '$2,137.50')
  assert.deepEqual(state, before)
})

test('unconfirmed page counts quote fixed fees and a rate without inventing a quantity', () => {
  const quote = calculateQuote({ landing: { ...selected(3, 300), custom: { ...custom, pages: '', pagesTbc: true } }, email: selected(0) })
  assert.equal(quote.one, 1250)
  assert.equal(quote.bundleAmount, 62.5)
  assert.equal(quote.oneAfter, 1187.5)
  assert.equal(quote.pendingPageRate, 100)
  assert.equal(quote.pendingPageRateAfter, 95)
  assert.equal(quote.monthly, 250)
  assert.equal(quote.firstMonthsFree, 250)
  assert.equal(quote.rows[1].amount, '$100 per page')
  assert.match(quote.rows[1].label, /to be confirmed/)
  assert.equal(quote.errors, undefined)
})

test('invalid custom prices, counts, or missing scope cannot produce an exportable quote', () => {
  for (const fields of [{ setup: '' }, { setup: ' ' }, { setup: null }, { perPage: '-1' }, { setup: 'Infinity' }, { setup: 1000001 }, { perPage: '1.5' }, { setup: 0, perPage: 0 }, { pages: '' }, { pages: 0 }, { pages: 1.5 }, { pages: 10000 }, { details: ' ' }]) {
    const quote = calculateQuote({ landing: { ...selected(3), custom: { ...custom, ...fields } } })
    assert.ok(quote.errors?.length, JSON.stringify(fields))
  }
  const partial = calculateQuote({ landing: { ...selected(3), custom: { ...custom, details: '' } } })
  assert.ok(partial.errors?.length)
  assert.equal(partial.one, 1750)
  assert.equal(partial.rows[1].amount, '$1,000')
  assert.equal(customLandingQuote({ ...custom, setup: 0 }).errors.length, 0)
  assert.equal(customLandingQuote({ ...custom, perPage: 0 }).errors.length, 0)
  assert.ok(customLandingQuote().errors.length)
})

test('a unique build can use a single project price without per-page fields', () => {
  const build = { name: 'Product launch experience', setup: '2400', details: 'Interactive product demo, custom design, and enquiry form.' }
  const quote = calculateQuote({ landing: { ...selected(3, 300), custom: build } })
  assert.equal(quote.one, 2400)
  assert.equal(quote.rows.length, 1)
  assert.equal(quote.rows[0].label, 'Landing Pages — Custom: Product launch experience')
  assert.equal(quote.rows[0].description, build.details)
  assert.equal(quote.pendingPageRate, undefined)
  assert.equal(quote.errors, undefined)
  const switchedOff = calculateQuote({ landing: { ...selected(3), custom: { ...build, perPageEnabled: false, perPage: 999, pages: '', pagesTbc: true } } })
  assert.deepEqual(switchedOff, quote)
})

test('several tiers of one service quote separately, count as one service, and carry notes', () => {
  const quote = calculateQuote({ landing: { tiers: [0, 2], pagesByTier: { 2: 10 }, notes: { 0: 'Promo page', 2: 'Main campaign' }, addons: [], opts: {} }, web: { tiers: [0], addons: [0], addonNotes: { 0: 'Hosting note' }, opts: {} } })
  assert.equal(quote.count, 2)
  const landing = quote.rows.filter((row) => row.label.startsWith('Landing Pages'))
  assert.equal(landing[0].label, 'Landing Pages — Launch · 1 page')
  assert.equal(landing[0].description, 'Promo page')
  assert.equal(landing[1].label, 'Landing Pages — Scale · 10 pages')
  assert.equal(landing[1].description, 'Main campaign')
  assert.equal(quote.rows.find((row) => row.sub).description, 'Hosting note')
  assert.equal(calculateQuote({ landing: { tiers: [0, 2], pagesByTier: { 2: 10 }, addons: [], opts: {} } }).one, 100 + 1500 + 250)
})

test('custom landing pages can include a monthly charge alongside standard tiers', () => {
  const quote = calculateQuote({ landing: { tiers: [1, 3], addons: [], opts: {}, notes: { 3: 'Care plan explained' }, custom: { setup: '2000', monthly: '99', details: 'Custom build.' } } })
  assert.equal(quote.one, 500 + 2000)
  assert.equal(quote.monthly, 99)
  assert.equal(quote.firstMonthsFree, 99)
  assert.equal(quote.rows[1].amount, '$2,000 + $99/mo')
  assert.equal(quote.rows[1].description, 'Custom build.\n\nCare plan explained')
  assert.equal(calculateQuote({ landing: { tier: 3, custom: { setup: 0, monthly: 150, details: 'Monthly only.' } } }).rows[0].amount, '$150/mo')
  for (const monthly of ['-1', '1.5', 'abc']) assert.ok(customLandingQuote({ setup: 100, monthly, details: 'x' }).errors.length)
})
