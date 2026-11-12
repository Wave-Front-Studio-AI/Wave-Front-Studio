import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateQuote as quoteAt, customLandingQuote, customQuoteItem, holidayDealActive, landingPageBundle, money, tierQty } from './packageQuote.js'

// Normal-price tests run on a day outside the sale, so they do not change when the sale is on.
const calculateQuote = (state, now = new Date('2026-06-01T12:00:00Z')) => quoteAt(state, now)

const selected = (tier = 1, pages = 1) => ({ tier, pages, addons: [], opts: {} })

test('every page count multiplies the tier price and remains one service', () => {
  for (const [tier, base] of [[0, 100], [1, 500], [2, 1500]]) {
    for (const pages of [1, 10, 25, 75, 125, 300]) {
      const price = base * pages
      const quote = calculateQuote({ landing: selected(tier, pages) })
      assert.equal(quote.one, price)
      assert.equal(quote.oneAfter, price)
      assert.equal(quote.count, 1)
      assert.equal(quote.pct, 0)
      assert.equal(quote.monthly, 0)
      assert.ok(quote.rows[0].label.endsWith(`${pages} page${pages === 1 ? '' : 's'}`))
      assert.equal(quote.rows[0].amount, `$${price.toLocaleString('en-US')}`)
    }
  }
})

test('mixed quotes discount the per-page landing price', () => {
  const state = { landing: selected(1, 25), tradeshow: selected(1) }
  const original = structuredClone(state)
  const quote = calculateQuote(state)
  assert.equal(quote.one, 17000)
  assert.equal(quote.monthly, 199)
  assert.equal(quote.count, 2)
  assert.equal(quote.pct, 5)
  assert.equal(quote.bundleAmount, 850)
  assert.equal(quote.oneAfter, 16150)
  assert.equal(quote.firstMonthsFree, 0)
  assert.deepEqual(state, original)
})

test('missing or unsupported choices use the included single page', () => {
  for (const pages of ['', undefined, NaN, Infinity, -5, 0, 3, 25.5, 999]) {
    assert.deepEqual(landingPageBundle(pages), { pages: 1 })
  }
  assert.deepEqual(landingPageBundle('25'), { pages: 25 })
  assert.equal(calculateQuote({ landing: { tier: 1, addons: [], opts: {} } }).one, 500)
})

test('recurring add-ons remain independent of landing page bundles', () => {
  const quote = calculateQuote({ landing: selected(0, 10), web: { ...selected(0), addons: [0, 3] } })
  assert.equal(quote.one, 2950)
  assert.equal(quote.oneAfter, 2802.5)
  assert.equal(quote.monthly, 99)
  assert.equal(quote.rows.filter((row) => row.sub).length, 2)
  assert.deepEqual(calculateQuote({}), { one: 0, monthly: 0, count: 0, pct: 0, bundleAmount: 0, credit: 0, creditLabel: '', oneAfter: 0, firstMonthsFree: 0, rows: [] })
})

test('email plans add one setup fee and keep recurring charges separate', () => {
  for (const [tier, price, label] of [[0, 250, 'Monthly'], [1, 450, 'Twice weekly']]) {
    const email = calculateQuote({ email: selected(tier) })
    assert.equal(email.one, 500)
    assert.equal(email.oneAfter, 500)
    assert.equal(email.monthly, price)
    assert.equal(email.firstMonthsFree, 0)
    assert.equal(email.rows[0].label, `Email Marketing — ${label}`)
    assert.equal(email.rows[0].amount, `$500 + $${price}/mo`)
    const combined = calculateQuote({ landing: selected(1, 25), email: selected(tier) })
    assert.equal(combined.count, 2)
    assert.equal(combined.one, 13000)
    assert.equal(combined.bundleAmount, 650)
    assert.equal(combined.oneAfter, 12350)
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
  assert.equal(quote.firstMonthsFree, 0)
  assert.equal(quote.rows[1].amount, '$100 per page')
  assert.match(quote.rows[1].label, /to be confirmed/)
  assert.equal(quote.errors, undefined)
})

test('invalid custom prices or counts cannot produce an exportable quote', () => {
  for (const fields of [{ perPage: '-1' }, { setup: 'Infinity' }, { setup: 1000001 }, { perPage: '1.5' }, { pages: 0 }, { pages: 1.5 }, { pages: 10000 }]) {
    const quote = calculateQuote({ landing: { ...selected(3), custom: { ...custom, ...fields } } })
    assert.ok(quote.errors?.length, JSON.stringify(fields))
  }
  // Blank prices count as $0 and project details are optional, so these still export.
  for (const fields of [{ setup: '' }, { setup: null }, { perPage: '' }, { details: ' ' }, { setup: '', perPage: '', pages: '' }]) {
    assert.equal(calculateQuote({ landing: { ...selected(3), custom: { ...custom, ...fields } } }).errors, undefined, JSON.stringify(fields))
  }
  const partial = calculateQuote({ landing: { ...selected(3), custom: { ...custom, details: '' } } })
  assert.equal(partial.one, 1750)
  assert.equal(partial.rows[1].amount, '$1,000')
  assert.equal(customLandingQuote({ ...custom, setup: 0 }).errors.length, 0)
  assert.equal(customLandingQuote({ ...custom, perPage: 0 }).errors.length, 0)
  assert.equal(customLandingQuote().errors.length, 0)
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
  assert.equal(calculateQuote({ landing: { tiers: [0, 2], pagesByTier: { 2: 10 }, addons: [], opts: {} } }).one, 100 + 1500 * 10)
})

test('custom landing pages replace standard tiers and can include a monthly charge', () => {
  const quote = calculateQuote({ landing: { tiers: [1, 3], addons: [], opts: {}, notes: { 3: 'Care plan explained' }, custom: { setup: '2000', monthly: '99', details: 'Custom build.' } } })
  assert.equal(quote.one, 2000)
  assert.equal(quote.rows.length, 1)
  assert.equal(quote.monthly, 99)
  assert.equal(quote.firstMonthsFree, 0)
  assert.equal(quote.rows[0].amount, '$2,000 + $99/mo')
  assert.equal(quote.rows[0].description, 'Custom build.\n\nCare plan explained')
  assert.equal(calculateQuote({ landing: { tier: 3, custom: { setup: 0, monthly: 150, details: 'Monthly only.' } } }).rows[0].amount, '$150/mo')
  for (const monthly of ['-1', '1.5', 'abc']) assert.ok(customLandingQuote({ setup: 100, monthly, details: 'x' }).errors.length)
})

test('a credit comes off the discounted one-time total and never goes below zero', () => {
  const base = { landing: selected(1, 10), email: selected(0) }
  const plain = calculateQuote(base)
  assert.equal(plain.oneAfter, 5225)
  assert.equal(plain.credit, 0)
  const credited = calculateQuote({ ...base, credit: { amount: '1000', label: 'Phase 1 deposit' } })
  assert.equal(credited.one, plain.one)
  assert.equal(credited.bundleAmount, plain.bundleAmount)
  assert.equal(credited.credit, 1000)
  assert.equal(credited.creditLabel, 'Phase 1 deposit')
  assert.equal(credited.oneAfter, 4225)
  assert.equal(credited.monthly, plain.monthly)
  // A credit larger than the total zeroes it out rather than going negative.
  const over = calculateQuote({ ...base, credit: { amount: 99999 } })
  assert.equal(over.credit, 5225)
  assert.equal(over.oneAfter, 0)
  for (const amount of ['', ' ', null, '-50', '1.5', 'abc', 0]) {
    assert.equal(calculateQuote({ ...base, credit: { amount } }).oneAfter, 5225, String(amount))
  }
})

test('a tier quantity multiplies its setup and monthly price but still counts as one service', () => {
  const quote = calculateQuote({ web: { tiers: [0], qtyByTier: { 0: 2 }, addons: [], opts: {} } })
  assert.equal(quote.one, 3600)
  assert.equal(quote.count, 1)
  assert.equal(quote.pct, 0)
  assert.equal(quote.rows[0].label, 'Website Development — Launch · 2 × $1,800')
  assert.equal(quote.rows[0].amount, '$3,600')

  const hybrid = calculateQuote({ bot: { tiers: [0], qtyByTier: { 0: '3' }, addons: [], opts: {} } })
  assert.equal(hybrid.one, 4500)
  assert.equal(hybrid.monthly, 297)
  assert.equal(hybrid.firstMonthsFree, 0)
  assert.equal(hybrid.rows[0].label, 'AI Chatbot Integration — Launch · 3 × ($1,500 + $99/mo)')
  assert.equal(hybrid.rows[0].amount, '$4,500 + $297/mo')

  const monthlyOnly = calculateQuote({ seo: { tiers: [1], qtyByTier: { 1: 2 }, addons: [], opts: {} } })
  assert.equal(monthlyOnly.monthly, 1700)
  assert.equal(monthlyOnly.rows[0].label, 'Website SEO — Grow · 2 × $850/mo')
})

test('each tier keeps its own quantity, and the bundle discount covers the multiplied setup', () => {
  const quote = calculateQuote({ web: { tiers: [0, 1], qtyByTier: { 0: 2 }, addons: [], opts: {} }, logo: selected(0) })
  assert.equal(quote.one, 1800 * 2 + 4500 + 250)
  assert.equal(quote.count, 2)
  assert.equal(quote.pct, 5)
  assert.equal(quote.bundleAmount, 417.5)
  assert.equal(quote.rows[1].label, 'Website Development — Grow')
})

test('add-ons are charged once for each item bought', () => {
  const quote = calculateQuote({ web: { tiers: [0], qtyByTier: { 0: 2 }, addons: [1, 3], opts: {} } })
  assert.equal(quote.one, 3600 + 750 * 2)
  assert.equal(quote.monthly, 99 * 2)
  assert.equal(quote.firstMonthsFree, 0)
  assert.equal(quote.rows[1].label, 'E-commerce setup · 2 × $750')
  assert.equal(quote.rows[1].amount, '$1,500')
  assert.equal(quote.rows[2].label, 'Website care plan · 2 × $99/mo')
  assert.equal(quote.rows[2].amount, '$198/mo')
})

test('add-ons follow the total across tiers, including frequency add-ons', () => {
  const sites = calculateQuote({ web: { tiers: [0, 1], qtyByTier: { 0: 2 }, addons: [3], opts: {} } })
  assert.equal(sites.monthly, 99 * 3)
  assert.equal(sites.rows.at(-1).label, 'Website care plan · 3 × $99/mo')

  const blogs = calculateQuote({ seo: { tiers: [1], qtyByTier: { 1: 2 }, addons: [1], opts: { 1: 4 } } })
  assert.equal(blogs.monthly, 850 * 2 + 75 * 4 * 2)
  assert.equal(blogs.rows[1].label, 'Blog article × 4/mo — Weekly · 2 × $300/mo')
  assert.equal(blogs.rows[1].amount, '$600/mo')

  // With one of everything, add-ons read and price exactly as before.
  const single = calculateQuote({ web: { tiers: [0], addons: [3], opts: {} } })
  assert.equal(single.monthly, 99)
  assert.equal(single.rows[1].label, 'Website care plan')
})

test('a missing or unusable quantity counts as one, and landing pages ignore it', () => {
  for (const raw of [undefined, null, '', ' ', 0, -2, 1.5, 'abc', NaN, Infinity]) assert.equal(tierQty(raw), 1, String(raw))
  assert.equal(tierQty('4'), 4)
  assert.equal(tierQty(500), 99)
  assert.equal(calculateQuote({ web: { tiers: [0], qtyByTier: { 0: '' }, addons: [], opts: {} } }).one, 1800)
  assert.equal(calculateQuote({ landing: { tiers: [1], pagesByTier: { 1: 10 }, qtyByTier: { 1: 5 }, addons: [], opts: {} } }).one, 5000)
})

const logo = { id: 'custom-1', title: 'Logo refresh', description: 'Two concepts and one round of changes.', qty: '2', cost: '250.50' }

test('custom items add at the exact price entered, outside the bundle count and discount', () => {
  const state = { landing: selected(1), tradeshow: selected(1), customItems: [logo] }
  const before = structuredClone(state)
  const quote = calculateQuote(state)
  assert.equal(quote.count, 2)
  assert.equal(quote.customCount, 1)
  assert.equal(quote.pct, 5)
  assert.equal(quote.one, 5501)
  assert.equal(quote.bundleAmount, 250)
  assert.equal(quote.oneAfter, 5251)
  assert.equal(quote.monthly, 199)
  const row = quote.rows.at(-1)
  assert.equal(row.label, 'Logo refresh · 2 × $250.50')
  assert.equal(row.amount, '$501')
  assert.equal(row.description, logo.description)
  assert.equal(row.customId, 'custom-1')
  assert.deepEqual(state, before)
})

test('a quote can be custom items alone, and a credit still comes off it', () => {
  const quote = calculateQuote({ customItems: [{ title: 'Website audit', qty: 1, cost: 300 }, { title: 'Printed flyers', qty: 3, cost: 0.1 }] })
  assert.equal(quote.count, 0)
  assert.equal(quote.customCount, 2)
  assert.equal(quote.pct, 0)
  assert.equal(quote.one, 300.3)
  assert.equal(quote.rows[0].label, 'Website audit')
  assert.equal(quote.rows[0].amount, '$300')
  assert.equal(quote.rows[0].customId, undefined)
  assert.equal(quote.rows[1].amount, '$0.30')
  assert.equal(calculateQuote({ customItems: [{ title: 'Website audit', qty: 1, cost: 300 }], credit: { amount: '100' } }).oneAfter, 200)
})

test('custom items need a title, a whole quantity and a cost in cents', () => {
  assert.deepEqual(Object.keys(customQuoteItem({ title: 'A', qty: 1, cost: 0 }).errors), [])
  assert.equal(customQuoteItem({ title: ' Logo ', qty: '4', cost: '19.99' }).total, 79.96)
  assert.equal(customQuoteItem({ title: ' Logo ', qty: '4', cost: '19.99' }).title, 'Logo')
  for (const [fields, key] of [
    [{ title: ' ' }, 'title'], [{ qty: '' }, 'qty'], [{ qty: 0 }, 'qty'], [{ qty: 1.5 }, 'qty'], [{ qty: 10000 }, 'qty'],
    [{ cost: '' }, 'cost'], [{ cost: '-1' }, 'cost'], [{ cost: '1.234' }, 'cost'], [{ cost: 'abc' }, 'cost'], [{ cost: 1000001 }, 'cost'], [{ cost: Infinity }, 'cost'],
  ]) {
    const item = customQuoteItem({ ...logo, ...fields })
    assert.deepEqual(Object.keys(item.errors), [key], JSON.stringify(fields))
  }
  // Anything invalid that reaches the calculation is left off rather than priced wrongly.
  assert.deepEqual(calculateQuote({ customItems: [{ ...logo, qty: 0 }] }).rows, [])
})

// Black Friday 2026 deals. The window is Nov 12 to Dec 1, Eastern.
const inside = new Date('2026-11-27T12:00:00-05:00')
const sel = (tier = 0) => ({ tier, addons: [], opts: {} })

test('black friday deals are off outside the window and the quote is unchanged', () => {
  const state = { web: sel(0), lead: sel(0), social: sel(0), design: sel(0) }
  const plain = calculateQuote(state, new Date('2026-11-11T23:59:59-05:00'))
  for (const when of ['2026-11-11T23:59:59-05:00', '2026-12-02T00:00:00-05:00', '2026-06-01T12:00:00Z']) {
    const quote = calculateQuote(state, new Date(when))
    assert.deepEqual(quote, plain)
    for (const key of ['deals', 'dealOff', 'dealSavings', 'holiday']) assert.equal(key in quote, false)
    assert.equal(quote.rows.some((row) => row.amount === '$0'), false)
  }
  assert.equal(holidayDealActive(new Date('2026-11-12T00:00:00-05:00')), true)
  assert.equal(holidayDealActive(new Date('2026-12-01T23:59:59-05:00')), true)
})

test('build deal takes 20% off setup alone and stacks with a 5% bundle up to the 25% cap', () => {
  const solo = calculateQuote({ web: sel(0) }, inside)
  assert.equal(solo.pct, 0)
  assert.deepEqual(solo.deals.map((deal) => [deal.id, deal.amount]), [['build', 360]])
  assert.equal(solo.oneAfter, 1440)

  const five = calculateQuote({ web: sel(0), calc: sel(0) }, inside) // 2 services, 5% bundle
  assert.equal(five.bundleAmount, 150)
  assert.equal(five.deals[0].amount, 600) // 20% deal plus 5% bundle is 25%
  assert.equal(five.oneAfter, 3000 - 150 - 600)
  assert.equal((3000 - five.oneAfter) / 3000, 0.25)

  const ten = calculateQuote({ web: sel(0), calc: sel(0), viz: sel(0) }, inside) // 10% bundle
  assert.equal((5500 - ten.oneAfter) / 5500, 0.25)
  const fifteen = calculateQuote({ web: sel(0), calc: sel(0), viz: sel(0), custom: sel(0), landing: sel(0) }, inside) // 15% bundle
  assert.equal(fifteen.pct, 15)
  assert.equal(Math.round(((fifteen.one - fifteen.oneAfter) / fifteen.one) * 1000) / 1000, 0.25)
})

test('build deal leaves other services on the normal bundle discount only', () => {
  const quote = calculateQuote({ web: sel(0), app: sel(0) }, inside)
  assert.equal(quote.bundleAmount, 490) // 5% of 9800
  assert.equal(quote.deals[0].amount, 360) // 20% of the website only; the app gets just the 5% bundle
  assert.equal(quote.oneAfter, 9800 - 490 - quote.deals[0].amount)
})

test('there is no free first month on monthly plans', () => {
  const quote = calculateQuote({ seo: sel(0), bot: sel(0) })
  assert.equal(quote.firstMonthsFree, 0)
})

test('leads deal takes 20% off lead generation setup only, never the monthly fee', () => {
  const quote = calculateQuote({ lead: sel(0) }, inside)
  const leads = quote.deals.find((deal) => deal.id === 'leads')
  assert.equal(leads.amount, 500) // 20% of the $2,500 setup
  assert.equal(leads.kind, 'off')
  assert.equal(quote.oneAfter, 2000)
  assert.equal(quote.monthly, 150)
  assert.equal(calculateQuote({ seo: sel(0), bot: sel(0) }, inside).deals.length, 0) // SEO has no setup fee
})

test('brand deal discounts brand services and gives no free logo', () => {
  const brand = calculateQuote({ design: sel(0), brochure: sel(0) }, inside)
  assert.equal(brand.deals.find((deal) => deal.id === 'brand').amount, 170) // 20% of 850 beyond 5% bundle capped at 25%
  const withSocial = calculateQuote({ social: sel(0) }, inside)
  assert.equal(withSocial.deals.length, 0)
  assert.equal(withSocial.rows.some((row) => row.amount === '$0'), false)
})

test('custom items and credits are not discounted by the deals', () => {
  const state = { web: sel(0), customItems: [{ title: 'Extra', qty: 1, cost: 1000 }], credit: { amount: 500 } }
  const quote = calculateQuote(state, inside)
  assert.equal(quote.deals[0].amount, 360)
  assert.equal(quote.oneAfter, 1800 + 1000 - 360 - 500)
})

// The $1 Website: $1 to set up, $99 a month hosting, and it stays out of every discount.
test('the $1 website is $1 setup and $99 a month, with no bundle count or deals', () => {
  const alone = calculateQuote({ site1: { tiers: [0], addons: [], opts: {} } })
  assert.equal(alone.one, 1)
  assert.equal(alone.monthly, 99)
  assert.equal(alone.count, 0)
  assert.equal(alone.pct, 0)
  assert.equal(alone.firstMonthsFree, 0)
  assert.equal(alone.oneAfter, 1)
  assert.equal(alone.rows[0].label, '$1 Website — Template site')
  assert.match(alone.rows[0].amount, /\$1/)
  assert.match(alone.rows[0].amount, /\$99/)
  assert.match(alone.rows[0].description, /12 month minimum/)
})

test('the $1 website does not count toward the bundle or take its discount', () => {
  const web = { tiers: [0], addons: [], opts: {} }
  const without = calculateQuote({ web })
  const withSite = calculateQuote({ web, site1: { tiers: [0], addons: [], opts: {} } })
  assert.equal(withSite.count, 1)
  assert.equal(withSite.pct, 0)
  assert.equal(withSite.oneAfter, without.oneAfter + 1)
  const two = calculateQuote({ web, calc: { tiers: [0], addons: [], opts: {} }, site1: { tiers: [0], addons: [], opts: {} } })
  assert.equal(two.count, 2)
  assert.equal(two.pct, 5)
  assert.equal(two.bundleAmount, (1800 + 1200) * 0.05)
  assert.equal(two.firstMonthsFree, 0)
})

test('the $1 website gets no Black Friday deal lines', () => {
  const quote = calculateQuote({ site1: { tiers: [0], addons: [], opts: {} } }, new Date('2026-11-27T12:00:00-05:00'))
  assert.equal(quote.deals.length, 0)
  assert.equal(quote.oneAfter, 1)
})
