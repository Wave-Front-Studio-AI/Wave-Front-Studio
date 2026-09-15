import { LANDING_PAGE_BUNDLES, OFFER, SERVICES } from './data/generated/packages.js'

export const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`

export const defaultOptionIndex = (addon) => {
  if (!addon.opts) return 0
  const index = addon.opts.findIndex((option) => option.def)
  return index < 0 ? 0 : index
}

export const addonQty = (addon, optionIndex) => (addon.opts ? addon.opts[optionIndex].q : 1)

export function tierPrice(tier) {
  if (tier.s > 0 && tier.m > 0) return `${money(tier.s)} + ${money(tier.m)}/mo`
  return tier.s > 0 ? money(tier.s) : `${money(tier.m)}/mo`
}

export function landingPageBundle(pages) {
  return LANDING_PAGE_BUNDLES.find((bundle) => bundle.pages === Number(pages)) ?? LANDING_PAGE_BUNDLES[0]
}

// All quote formats share this calculation, including page quantities and savings.
export function calculateQuote(state) {
  let one = 0
  let monthly = 0
  let count = 0
  const rows = []

  for (const service of SERVICES) {
    const entry = state[service.id]
    if (!entry) continue
    count += 1
    const tier = service.tiers[entry.tier]
    const bundle = service.id === 'landing' ? landingPageBundle(entry.pages) : null
    const total = { s: tier.s + (bundle?.price ?? 0), m: tier.m }
    one += total.s
    monthly += total.m
    const pageLabel = bundle ? ` · ${bundle.pages} page${bundle.pages === 1 ? '' : 's'}` : ''
    rows.push({ label: `${service.name} — ${tier.n}${pageLabel}`, amount: tierPrice(total) })

    for (const addonIndex of [...entry.addons].sort((a, b) => a - b)) {
      const addon = service.addons[addonIndex]
      const chosen = entry.opts?.[addonIndex] ?? defaultOptionIndex(addon)
      const price = addon.p * addonQty(addon, chosen)
      if (addon.t === 'monthly') monthly += price
      else one += price
      const label = addon.opts ? `${addon.l} × ${addonQty(addon, chosen)}/mo — ${addon.opts[chosen].l}` : addon.l
      rows.push({ label, amount: `${money(price)}${addon.t === 'monthly' ? '/mo' : ''}`, sub: true })
    }
  }

  const pct = OFFER.bundleTiers.find((tier) => count >= tier.min)?.pct ?? 0
  const bundleAmount = (one * pct) / 100
  return { one, monthly, count, pct, bundleAmount, oneAfter: one - bundleAmount, firstMonthsFree: monthly * OFFER.firstMonthsFree, rows }
}
