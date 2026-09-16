import { LANDING_PAGE_BUNDLES, OFFER, SERVICES } from './data/generated/packages.js'

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

export function landingPageBundle(pages) {
  return LANDING_PAGE_BUNDLES.find((bundle) => bundle.pages === Number(pages)) ?? LANDING_PAGE_BUNDLES[0]
}

export const cleanNote = (value) => String(value ?? '').trim().slice(0, 1000)

// Services accept one or more tiers; older single-tier selections still work.
export function selectedTiers(service, entry = {}) {
  const raw = Array.isArray(entry.tiers) ? entry.tiers : [entry.tier ?? 1]
  return [...new Set(raw.map(Number))].filter((index) => Number.isInteger(index) && service.tiers[index]).sort((a, b) => a - b)
}

export function customLandingQuote(custom = {}) {
  const setup = Number(custom.setup)
  const blankMonthly = custom.monthly == null || String(custom.monthly).trim() === ''
  const monthly = blankMonthly ? 0 : Number(custom.monthly)
  const perPageEnabled = custom.perPageEnabled === true
  const perPage = perPageEnabled ? Number(custom.perPage) : 0
  const pages = Number(custom.pages ?? 1)
  const pagesTbc = perPageEnabled && custom.pagesTbc === true
  const name = String(custom.name ?? '').trim().slice(0, 80)
  const details = String(custom.details ?? '').trim().slice(0, 2000)
  const validPrice = (raw, value) => raw != null && String(raw).trim() !== '' && Number.isInteger(value) && value >= 0 && value <= 1000000
  const errors = []
  if (!validPrice(custom.setup, setup) || (perPageEnabled && !validPrice(custom.perPage, perPage)) || (!blankMonthly && !validPrice(custom.monthly, monthly))) errors.push('Enter the project, monthly, and any per-page prices in whole dollars. Use 0 if a charge does not apply.')
  else if (setup + perPage + monthly <= 0) errors.push('Enter a price greater than $0 for the project, pages, or monthly service.')
  if (perPageEnabled && !pagesTbc && (!Number.isInteger(pages) || pages < 1 || pages > 9999)) errors.push('Enter a whole page count from 1 to 9,999.')
  if (!details) errors.push('Add the project details to include in your quote.')
  return { setup, monthly, perPage, perPageEnabled, pages, pagesTbc, name, details, errors }
}

// All quote formats share this calculation, including page quantities and savings.
export function calculateQuote(state) {
  let one = 0
  let monthly = 0
  let count = 0
  const rows = []
  const errors = []
  let pendingPageRate

  for (const service of SERVICES) {
    const entry = state[service.id]
    if (!entry) continue
    count += 1
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
      const total = { s: tier.s + (bundle?.price ?? 0), m: tier.m }
      one += total.s
      monthly += total.m
      const pageLabel = bundle ? ` · ${bundle.pages} page${bundle.pages === 1 ? '' : 's'}` : ''
      const description = [service.id === 'email' ? tier.note : '', note].filter(Boolean).join('\n')
      rows.push({ label: `${service.name} — ${tier.n}${pageLabel}`, amount: tierPrice(total), ...(description ? { description } : {}) })
    }

    for (const addonIndex of [...(entry.addons ?? [])].sort((a, b) => a - b)) {
      const addon = service.addons[addonIndex]
      const chosen = entry.opts?.[addonIndex] ?? defaultOptionIndex(addon)
      const price = addon.p * addonQty(addon, chosen)
      if (addon.t === 'monthly') monthly += price
      else one += price
      const label = addon.opts ? `${addon.l} × ${addonQty(addon, chosen)}/mo — ${addon.opts[chosen].l}` : addon.l
      const note = cleanNote(entry.addonNotes?.[addonIndex])
      rows.push({ label, amount: `${money(price)}${addon.t === 'monthly' ? '/mo' : ''}`, sub: true, ...(note ? { description: note } : {}) })
    }
  }

  const pct = OFFER.bundleTiers.find((tier) => count >= tier.min)?.pct ?? 0
  const bundleAmount = (one * pct) / 100
  return { one, monthly, count, pct, bundleAmount, oneAfter: one - bundleAmount, firstMonthsFree: monthly * OFFER.firstMonthsFree, rows, ...(pendingPageRate !== undefined ? { pendingPageRate, pendingPageRateAfter: pendingPageRate * (1 - pct / 100) } : {}), ...(errors.length ? { errors } : {}) }
}
