import { LANDING_PAGE_BUNDLES, OFFER } from './data/generated/packages.js'
import { BUILDER_SERVICES as SERVICES } from './data/oneDollarSite.js'
import { HOLIDAY_WINDOW, holidayDealActive } from './holidayWindow.js'

export { holidayDealActive }

// Black Friday 2026. The window is Thu Nov 12 00:00 to Tue Dec 1 23:59:59 Eastern (EST, UTC-5), so it ends
// at the start of Dec 2. Outside the window every deal is off and the quote is exactly the normal quote.
export const HOLIDAY_DEAL = {
  ...HOLIDAY_WINDOW,
  // 20% off setup, and setup discounts together (bundle plus deal) never pass maxCombinedPct.
  build: { pct: 20, maxCombinedPct: 25, services: ['web', 'landing', 'calc', 'viz', 'custom'] },
  brand: { pct: 20, maxCombinedPct: 25, services: ['design', 'logo', 'logoanim', 'brochure', 'cards'] },
  // Months free on the monthly fee, instead of OFFER.firstMonthsFree.
  leads: { monthsFree: 3, services: ['lead', 'seo'] },
  // A Launch Logo & Favicon Design comes free with any quote that has a social service and no logo of its own.
  freeLogo: { whenService: 'social', skipIfService: 'logo', tier: 0 },
}

const cents = (n) => Math.round(n * 100) / 100

export const money = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })

export const defaultOptionIndex = (addon) => {
  if (!addon.opts) return 0
  const index = addon.opts.findIndex((option) => option.def)
  return index < 0 ? 0 : index
}

export const addonQty = (addon, optionIndex) => (addon.opts ? addon.opts[optionIndex].q : 1)

export function tierPrice(tier) {
  if (tier.custom) return 'Enter pricing'
  if (tier.s > 0 && tier.m > 0) return `${money(tier.s)} + ${money(tier.m)}/mo`
  return tier.s > 0 ? money(tier.s) : `${money(tier.m)}/mo`
}

// How many of a tier are on the quote, e.g. two Launch websites. Anything that isn't a whole number counts as one.
export const MAX_TIER_QTY = 99

export function tierQty(value) {
  const qty = Number(value)
  return Number.isInteger(qty) && qty >= 1 ? Math.min(qty, MAX_TIER_QTY) : 1
}

// The price of one, bracketed when it has a setup and a monthly part so "2 × ($1,500 + $99/mo)" reads correctly.
export const eachPrice = (tier) => (tier.s > 0 && tier.m > 0 ? `(${tierPrice(tier)})` : tierPrice(tier))

export function landingPageBundle(pages) {
  return LANDING_PAGE_BUNDLES.find((bundle) => bundle.pages === Number(pages)) ?? LANDING_PAGE_BUNDLES[0]
}

export const cleanNote = (value) => String(value ?? '').trim().slice(0, 1000)

// Services accept one or more tiers; older single-tier selections still work.
// A custom tier replaces every other tier of its service.
export function selectedTiers(service, entry = {}) {
  const raw = Array.isArray(entry.tiers) ? entry.tiers : [entry.tier ?? 1]
  const tiers = [...new Set(raw.map(Number))].filter((index) => Number.isInteger(index) && service.tiers[index]).sort((a, b) => a - b)
  const custom = tiers.find((index) => service.tiers[index].custom)
  return custom === undefined ? tiers : [custom]
}

// How many of a service are being bought across its selected tiers. Add-ons are charged once for each,
// so two Launch sites and one Grow site with a care plan pay for three care plans.
export function serviceUnits(service, entry = {}) {
  const units = selectedTiers(service, entry).reduce((sum, index) => sum + (service.id === 'landing' ? 1 : tierQty(entry.qtyByTier?.[index])), 0)
  return Math.max(units, 1)
}

// Landing page tiers are priced per page: tier price × total pages.
export const landingPagesPrice = (tier, pages) => tier.s * landingPageBundle(pages).pages

export function customLandingQuote(custom = {}) {
  const blank = (raw) => raw == null || String(raw).trim() === ''
  // Blank price fields count as $0 so a quote can be exported once any price is entered.
  const setup = blank(custom.setup) ? 0 : Number(custom.setup)
  const blankMonthly = blank(custom.monthly)
  const monthly = blankMonthly ? 0 : Number(custom.monthly)
  const perPageEnabled = custom.perPageEnabled === true
  const perPage = perPageEnabled && !blank(custom.perPage) ? Number(custom.perPage) : 0
  const pages = blank(custom.pages) ? 1 : Number(custom.pages)
  const pagesTbc = perPageEnabled && custom.pagesTbc === true
  const name = String(custom.name ?? '').trim().slice(0, 80)
  const details = String(custom.details ?? '').trim().slice(0, 2000)
  const validPrice = (value) => Number.isInteger(value) && value >= 0 && value <= 1000000
  const errors = []
  // Only values that are actually wrong block the PDF; empty fields never do.
  if (!validPrice(setup) || !validPrice(perPage) || !validPrice(monthly)) errors.push('Enter the project, monthly, and any per-page prices in whole dollars.')
  if (perPageEnabled && !pagesTbc && !blank(custom.pages) && (!Number.isInteger(pages) || pages < 1 || pages > 9999)) errors.push('Enter a whole page count from 1 to 9,999.')
  return { setup, monthly, perPage, perPageEnabled, pages, pagesTbc, name, details, errors }
}

// A custom line item: the owner's own title, description, quantity and cost per item.
// Errors are keyed by field so the form can show each one next to its input.
export function customQuoteItem(item = {}) {
  const blank = (raw) => raw == null || String(raw).trim() === ''
  const title = String(item.title ?? '').trim().slice(0, 120)
  const description = String(item.description ?? '').trim().slice(0, 1000)
  const qty = blank(item.qty) ? NaN : Number(item.qty)
  const cost = blank(item.cost) ? NaN : Number(item.cost)
  const errors = {}
  if (!title) errors.title = 'Add a title for this item.'
  if (blank(item.qty)) errors.qty = 'Enter a quantity.'
  else if (!Number.isInteger(qty) || qty < 1 || qty > 9999) errors.qty = 'Enter a whole quantity from 1 to 9,999.'
  if (blank(item.cost)) errors.cost = 'Enter a cost per item.'
  else if (!(cost >= 0 && cost <= 1000000) || Math.abs(Math.round(cost * 100) - cost * 100) > 1e-6) errors.cost = 'Enter a cost from $0 to $1,000,000, with up to two decimal places.'
  const total = errors.qty || errors.cost ? 0 : Math.round(qty * cost * 100) / 100
  return { title, description, qty, cost, total, errors }
}

// Credits are whole dollars; anything else counts as no credit.
export function creditAmount(credit) {
  const amount = Number(credit?.amount)
  return Number.isInteger(amount) && amount > 0 ? Math.min(amount, 1000000) : 0
}

// All quote formats share this calculation, including page quantities and savings.
export function calculateQuote(state, now = new Date()) {
  const holiday = holidayDealActive(now)
  let one = 0
  let monthly = 0
  let count = 0
  let buildOne = 0
  let brandOne = 0
  let leadsMonthly = 0
  // The $1 Website is a flat price: no bundle count, no discounts, no free first month.
  let flatOne = 0
  let flatMonthly = 0
  const rows = []
  const errors = []
  let pendingPageRate

  for (const service of SERVICES) {
    const entry = state[service.id]
    if (!entry) continue
    if (!service.flat) count += 1
    for (const tierIndex of selectedTiers(service, entry)) {
      const tier = service.tiers[tierIndex]
      const note = cleanNote(entry.notes?.[tierIndex])
      if (service.id === 'landing' && tier.custom) {
        const custom = customLandingQuote(entry.custom)
        errors.push(...custom.errors)
        // Totals update while typing; blank or invalid numbers count as $0 until fixed, and errors still block export.
        const safe = (value) => (Number.isFinite(value) && value >= 0 ? value : 0)
        const setup = safe(custom.setup)
        const perPage = safe(custom.perPage)
        const pages = safe(custom.pages)
        const customMonthly = safe(custom.monthly)
        one += setup + (custom.perPageEnabled && !custom.pagesTbc ? perPage * pages : 0)
        monthly += customMonthly
        const amount = customMonthly > 0 ? tierPrice({ s: setup, m: customMonthly }) : money(setup)
        rows.push({ label: `Landing Pages — Custom${custom.name ? `: ${custom.name}` : ' build'}`, amount, description: [custom.details, note].filter(Boolean).join('\n\n') })
        if (custom.pagesTbc) {
          pendingPageRate = perPage
          rows.push({ label: 'Pages — quantity to be confirmed', amount: `${money(perPage)} per page`, sub: true })
        } else if (custom.perPageEnabled) {
          rows.push({ label: `${pages} page${pages === 1 ? '' : 's'} × ${money(perPage)} per page`, amount: money(perPage * pages), sub: true })
        }
        continue
      }
      const bundle = service.id === 'landing' ? landingPageBundle(entry.pagesByTier?.[tierIndex] ?? entry.pages) : null
      // Landing pages already count pages, so a quantity only applies to the other services.
      const qty = bundle ? 1 : tierQty(entry.qtyByTier?.[tierIndex])
      const total = { s: (bundle ? landingPagesPrice(tier, bundle.pages) : tier.s) * qty, m: tier.m * qty }
      one += total.s
      monthly += total.m
      if (service.flat) {
        flatOne += total.s
        flatMonthly += total.m
      }
      if (HOLIDAY_DEAL.build.services.includes(service.id)) buildOne += total.s
      if (HOLIDAY_DEAL.brand.services.includes(service.id)) brandOne += total.s
      if (HOLIDAY_DEAL.leads.services.includes(service.id)) leadsMonthly += total.m
      const pageLabel = bundle ? ` · ${bundle.pages} page${bundle.pages === 1 ? '' : 's'}` : ''
      const qtyLabel = qty > 1 ? ` · ${qty} × ${eachPrice(tier)}` : ''
      const description = [service.id === 'email' || service.flat ? tier.note : '', note].filter(Boolean).join('\n')
      rows.push({ label: `${service.name} — ${tier.n}${pageLabel}${qtyLabel}`, amount: tierPrice(total), ...(description ? { description } : {}) })
    }

    const units = serviceUnits(service, entry)
    for (const addonIndex of [...(entry.addons ?? [])].sort((a, b) => a - b)) {
      const addon = service.addons[addonIndex]
      const chosen = entry.opts?.[addonIndex] ?? defaultOptionIndex(addon)
      const each = addon.p * addonQty(addon, chosen)
      const price = each * units
      if (addon.t === 'monthly') {
        monthly += price
        if (HOLIDAY_DEAL.leads.services.includes(service.id)) leadsMonthly += price
      } else one += price
      if (service.flat) {
        if (addon.t === 'monthly') flatMonthly += price
        else flatOne += price
      }
      const base = addon.opts ? `${addon.l} × ${addonQty(addon, chosen)}/mo — ${addon.opts[chosen].l}` : addon.l
      const label = units > 1 ? `${base} · ${units} × ${money(each)}${addon.t === 'monthly' ? '/mo' : ''}` : base
      const note = cleanNote(entry.addonNotes?.[addonIndex])
      rows.push({ label, amount: `${money(price)}${addon.t === 'monthly' ? '/mo' : ''}`, sub: true, ...(note ? { description: note } : {}) })
    }
  }

  // The free logo is a $0 line with its value noted. It is not a service for the bundle count.
  let freeLogo
  if (holiday && state[HOLIDAY_DEAL.freeLogo.whenService] && !state[HOLIDAY_DEAL.freeLogo.skipIfService]) {
    const logo = SERVICES.find((service) => service.id === HOLIDAY_DEAL.freeLogo.skipIfService)
    const tier = logo?.tiers[HOLIDAY_DEAL.freeLogo.tier]
    if (tier) {
      freeLogo = { label: `${logo.name} — ${tier.n}`, value: tier.s }
      rows.push({ label: freeLogo.label, amount: '$0', description: `Free with the ${HOLIDAY_DEAL.name} Brand Deal. A ${money(tier.s)} value.` })
    }
  }

  // Custom items are quoted at exactly the price entered: they don't count towards the bundle or get its discount.
  const serviceOne = one - flatOne
  let customCount = 0
  for (const raw of Array.isArray(state.customItems) ? state.customItems : []) {
    const item = customQuoteItem(raw)
    if (Object.keys(item.errors).length) continue
    customCount += 1
    one = Math.round((one + item.total) * 100) / 100
    rows.push({
      label: item.qty > 1 ? `${item.title} · ${item.qty} × ${money(item.cost)}` : item.title,
      amount: money(item.total),
      ...(item.description ? { description: item.description } : {}),
      ...(raw.id !== undefined ? { customId: raw.id } : {}),
    })
  }

  const pct = OFFER.bundleTiers.find((tier) => count >= tier.min)?.pct ?? 0
  const bundleAmount = (serviceOne * pct) / 100
  // A credit — a deposit or earlier phase already paid — comes off the discounted one-time total.
  const discounted = one - bundleAmount
  const credit = Math.min(creditAmount(state.credit), discounted)
  const creditLabel = String(state.credit?.label ?? '').trim().slice(0, 80)
  // Each deal is its own line. A bundle discount counts toward the cap, so the deal only adds what is left under it.
  // kind 'off' comes off the one-time total; kind 'free' is value given and is not taken off any total.
  const deals = []
  if (holiday) {
    const extraPct = (deal) => Math.max(0, Math.min(deal.pct, deal.maxCombinedPct - pct))
    const buildAmount = cents((buildOne * extraPct(HOLIDAY_DEAL.build)) / 100)
    const brandAmount = cents((brandOne * extraPct(HOLIDAY_DEAL.brand)) / 100)
    const leadsAmount = cents(leadsMonthly * Math.max(0, HOLIDAY_DEAL.leads.monthsFree - OFFER.firstMonthsFree))
    if (buildAmount > 0) deals.push({ id: 'build', kind: 'off', label: `${HOLIDAY_DEAL.name} Build Deal`, amount: buildAmount })
    if (brandAmount > 0) deals.push({ id: 'brand', kind: 'off', label: `${HOLIDAY_DEAL.name} Brand Deal`, amount: brandAmount })
    if (leadsAmount > 0) deals.push({ id: 'leads', kind: 'free', label: `${HOLIDAY_DEAL.name} Leads Deal: ${HOLIDAY_DEAL.leads.monthsFree} months free on Lead and SEO plans`, amount: leadsAmount })
    if (freeLogo) deals.push({ id: 'logo', kind: 'free', label: `${HOLIDAY_DEAL.name} Brand Deal: free ${freeLogo.label}`, amount: freeLogo.value })
  }
  const dealOff = cents(deals.filter((deal) => deal.kind === 'off').reduce((sum, deal) => sum + deal.amount, 0))
  const dealSavings = cents(deals.reduce((sum, deal) => sum + deal.amount, 0))
  const afterDeals = discounted - dealOff
  const creditApplied = dealOff > 0 ? Math.min(creditAmount(state.credit), afterDeals) : credit
  const holidayFields = holiday ? { deals, dealOff, dealSavings, holiday: { name: HOLIDAY_DEAL.name, endsLabel: HOLIDAY_DEAL.endsLabel } } : {}
  return { ...holidayFields, one, monthly, count, pct, bundleAmount, credit: creditApplied, creditLabel, oneAfter: afterDeals - creditApplied, firstMonthsFree: (monthly - flatMonthly) * OFFER.firstMonthsFree, rows, ...(customCount ? { customCount } : {}), ...(pendingPageRate !== undefined ? { pendingPageRate, pendingPageRateAfter: pendingPageRate * (1 - pct / 100) } : {}), ...(errors.length ? { errors } : {}) }
}
