import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateQuote, landingPageBundle } from './packageQuote.js'

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

test('email plans charge monthly and combine with landing page bundles', () => {
  for (const [tier, price, label] of [[0, 250, 'Monthly'], [1, 450, 'Twice weekly']]) {
    const email = calculateQuote({ email: selected(tier) })
    assert.equal(email.one, 0)
    assert.equal(email.monthly, price)
    assert.equal(email.firstMonthsFree, price)
    assert.equal(email.rows[0].label, `Email Marketing — ${label}`)
    assert.equal(email.rows[0].amount, `$${price}/mo`)
    const combined = calculateQuote({ landing: selected(1, 25), email: selected(tier) })
    assert.equal(combined.count, 2)
    assert.equal(combined.oneAfter, 950)
    assert.equal(combined.monthly, price)
  }
})
