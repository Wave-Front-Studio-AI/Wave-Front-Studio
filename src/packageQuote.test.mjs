import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateQuote, normalizePageCount } from './packageQuote.js'

const selected = (tier = 1, quantity = 1) => ({ tier, quantity, addons: [], opts: {} })

test('landing pages multiply each tier price and remain one service for discounts', () => {
  for (const [tier, price] of [[0, 100], [1, 500], [2, 1500]]) {
    const quote = calculateQuote({ landing: selected(tier, 3) })
    assert.equal(quote.one, price * 3)
    assert.equal(quote.oneAfter, price * 3)
    assert.equal(quote.count, 1)
    assert.equal(quote.pct, 0)
    assert.equal(quote.monthly, 0)
    assert.match(quote.rows[0].label, /3 pages$/)
    assert.equal(quote.rows[0].amount, `$${(price * 3).toLocaleString('en-US')}`)
  }
})

test('quantity is preserved in mixed quotes and all savings use the expanded price', () => {
  const state = { landing: selected(1, 4), tradeshow: selected(1) }
  const original = structuredClone(state)
  const quote = calculateQuote(state)
  assert.equal(quote.one, 6500)
  assert.equal(quote.monthly, 199)
  assert.equal(quote.count, 2)
  assert.equal(quote.pct, 5)
  assert.equal(quote.bundleAmount, 325)
  assert.equal(quote.oneAfter, 6175)
  assert.equal(quote.firstMonthsFree, 199)
  assert.deepEqual(state, original)
})

test('invalid counts stay within the supported whole-page range', () => {
  for (const value of ['', undefined, NaN, Infinity, -5, 0]) assert.equal(normalizePageCount(value), 1)
  assert.equal(normalizePageCount(3.9), 3)
  assert.equal(normalizePageCount('12'), 12)
  assert.equal(normalizePageCount(1000), 999)
  assert.match(calculateQuote({ landing: selected(0, '') }).rows[0].label, /1 page$/)
})

test('recurring add-ons and frequency choices remain separate from page quantities', () => {
  const quote = calculateQuote({ landing: selected(0, 2), web: { ...selected(0), addons: [0, 3] } })
  assert.equal(quote.one, 2150)
  assert.equal(quote.oneAfter, 2042.5)
  assert.equal(quote.monthly, 99)
  assert.equal(quote.rows.filter((row) => row.sub).length, 2)
  assert.deepEqual(calculateQuote({}), { one: 0, monthly: 0, count: 0, pct: 0, bundleAmount: 0, oneAfter: 0, firstMonthsFree: 0, rows: [] })
})
