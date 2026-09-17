import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CATEGORIES, DETAILS, LANDING_PAGE_BUNDLES, OFFER, PAIRS, SERVICES } from '../data/generated/packages.js'
import { contact } from '../data/site.js'
import { addonQty, calculateQuote, creditAmount, defaultOptionIndex, landingPageBundle, landingPagesPrice, money, selectedTiers, tierPrice } from '../packageQuote.js'

const serviceById = Object.fromEntries(SERVICES.map((service) => [service.id, service]))

function fromLabel(service) {
  const minSetup = Math.min(...service.tiers.filter((tier) => !tier.custom).map((tier) => tier.s))
  const monthlies = service.tiers.filter((tier) => tier.m > 0).map((tier) => tier.m)
  const minMonthly = monthlies.length ? Math.min(...monthlies) : 0
  if (service.billing === 'monthly') return `${money(minMonthly)}/mo`
  if (service.billing === 'hybrid') return `${money(minSetup)} + ${money(minMonthly)}/mo`
  return money(minSetup)
}

function DetailsModal({ service, onClose, onSelect }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  const rows = DETAILS[service.id] || []

  return (
    <div className="modal-scrim" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-panel modal-package" role="dialog" aria-modal="true" aria-labelledby="pkg-modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="pkg-modal-head">
          <h3 id="pkg-modal-title">{service.name}</h3>
          <p>{service.blurb}</p>
        </div>
        <div className="pkg-modal-prices" style={{ '--tier-count': service.tiers.length }}>
          {service.tiers.map((tier) => (
            <div key={tier.n}>
              <span>{tier.n}</span>
              <strong>{tierPrice(tier)}{service.id === 'landing' && !tier.custom ? ' base' : ''}</strong>
            </div>
          ))}
        </div>
        {rows.length ? (
          <div className="comparison-scroll">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">What’s included</th>
                  {service.tiers.map((tier) => (
                    <th scope="col" key={tier.n}>
                      {tier.n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    {row.slice(1).map((cell, index) => (
                      <td key={index} className={cell === '✓' ? 'is-yes' : cell === '—' || cell === '-' ? 'is-no' : ''}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {service.id === 'landing' ? (
          <div className="pkg-modal-addons">
            <span className="pkg-label">Page counts for Launch, Grow &amp; Scale</span>
            <p>Each tier is priced per page: the tier price × the number of pages.</p>
            {LANDING_PAGE_BUNDLES.filter((bundle) => bundle.pages > 1).map((bundle) => (
              <span key={bundle.pages}>{bundle.pages} pages — <b>tier price × {bundle.pages}</b></span>
            ))}
          </div>
        ) : null}
        {service.addons.length ? (
          <div className="pkg-modal-addons">
            <span className="pkg-label">Optional add-ons</span>
            {service.addons.map((addon) => (
              <span key={addon.l}>
                {addon.l} — <b>{money(addon.p)}{addon.t === 'monthly' ? '/mo' : ''}</b>
                {addon.opts ? ' each, by frequency' : ''}
              </span>
            ))}
          </div>
        ) : null}
        <div className="pkg-modal-actions">
          {service.tiers.map((tier, index) => (
            <button key={tier.n} type="button" className="kinetic-button group" onClick={() => onSelect(index)}>
              <span>Add {tier.n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BuildYourPackage() {
  // state[id] = { tiers: [], pagesByTier: { [tierIndex]: pages }, notes: { [tierIndex]: text },
  //   addons: [], addonNotes: { [addonIndex]: text }, opts: { [addonIndex]: optionIndex } }
  const [state, setState] = useState({})
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [pdfStatus, setPdfStatus] = useState('idle')
  const [clientName, setClientName] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')

  async function downloadPdf() {
    if (!quote.count || quote.errors?.length || pdfStatus === 'loading') return
    setPdfStatus('loading')
    try {
      const { downloadQuotePdf } = await import('../quotePdf.js')
      await downloadQuotePdf({ ...quote, clientName: clientName.trim(), notes: quoteNotes.trim() })
      setPdfStatus('idle')
      setToast('Your quote PDF is ready')
    } catch {
      setPdfStatus('error')
    }
  }

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 1900)
    return () => window.clearTimeout(timer)
  }, [toast])

  const optionIndex = (id, addonIndex) => {
    const addon = serviceById[id].addons[addonIndex]
    const chosen = state[id]?.opts?.[addonIndex]
    return chosen === undefined ? defaultOptionIndex(addon) : chosen
  }

  const addonPrice = (id, addonIndex) => {
    const addon = serviceById[id].addons[addonIndex]
    return addon.p * addonQty(addon, optionIndex(id, addonIndex))
  }

  function toggleService(id) {
    setState((current) => {
      const next = { ...current }
      if (next[id]) delete next[id]
      else next[id] = { tiers: [1], addons: [], opts: {} }
      return next
    })
  }

  // Adds the tier, or removes it when already selected. A service always keeps at least one tier.
  function toggleTier(id, tier, { keep = false } = {}) {
    const entry = state[id]
    const tiers = entry ? selectedTiers(serviceById[id], entry) : []
    if (tiers.includes(tier) && !keep && tiers.length === 1) {
      setToast('Keep at least one tier, or untick the service')
      return
    }
    // Custom replaces the standard tiers, and picking a standard tier replaces Custom.
    const isCustom = (index) => serviceById[id].tiers[index].custom === true
    const nextTiers = tiers.includes(tier)
      ? (keep ? tiers : tiers.filter((value) => value !== tier))
      : isCustom(tier) ? [tier] : [...tiers.filter((value) => !isCustom(value)), tier].sort((a, b) => a - b)
    setState((current) => ({ ...current, [id]: { ...(current[id] || { addons: [], opts: {} }), tiers: nextTiers } }))
  }

  function setEntryMap(id, field, key, value) {
    setState((current) => {
      const entry = current[id] || { tiers: [1], addons: [], opts: {} }
      return { ...current, [id]: { ...entry, [field]: { ...entry[field], [key]: value } } }
    })
  }

  function setPageBundle(tier, value) {
    setEntryMap('landing', 'pagesByTier', tier, landingPageBundle(value).pages)
  }

  function setCreditField(field, value) {
    setState((current) => ({ ...current, credit: { ...current.credit, [field]: value } }))
  }

  function setCustomField(field, value) {
    setState((current) => ({ ...current, landing: { ...current.landing, custom: { ...current.landing.custom, [field]: value } } }))
  }

  function toggleAddon(id, addonIndex) {
    setState((current) => {
      const entry = current[id] || { tiers: [1], addons: [], opts: {} }
      const addons = entry.addons.includes(addonIndex)
        ? entry.addons.filter((value) => value !== addonIndex)
        : [...entry.addons, addonIndex]
      return { ...current, [id]: { ...entry, addons } }
    })
  }

  function setAddonOption(id, addonIndex, value) {
    setState((current) => {
      const entry = current[id] || { tiers: [1], addons: [], opts: {} }
      const addons = entry.addons.includes(addonIndex) ? entry.addons : [...entry.addons, addonIndex]
      return { ...current, [id]: { ...entry, addons, opts: { ...entry.opts, [addonIndex]: value } } }
    })
  }

  const quote = useMemo(() => calculateQuote(state), [state])
  const pendingPages = quote.pendingPageRate !== undefined
  const pendingNote = pendingPages ? `Plus ${money(quote.pendingPageRateAfter)} per page${quote.pct ? ` after the ${quote.pct}% bundle discount` : ''}. Page count and final total to be confirmed.` : ''

  const nextTier = [...OFFER.bundleTiers].sort((a, b) => a.min - b.min).find((tier) => quote.count < tier.min)
  const maxMin = Math.max(...OFFER.bundleTiers.map((tier) => tier.min))

  const suggestion = useMemo(() => {
    if (!quote.count) return null
    for (const id of Object.keys(state)) {
      const candidate = PAIRS[id]
      if (candidate && !state[candidate]) return serviceById[candidate]
    }
    const fallback = SERVICES.find((service) => !state[service.id])
    return fallback || null
  }, [state, quote.count])

  function emailQuote() {
    if (quote.errors?.length) return
    if (!quote.count) {
      setToast('Select a service first')
      return
    }
    const lines = quote.rows.map((row) => `${row.sub ? '  + ' : ''}${row.label} — ${row.amount}${row.description ? `\n${row.description}` : ''}`)
    let body = `Hi Wavefront Studio,\n\nI would like to lock in this package:${clientName.trim() ? `\nPrepared for: ${clientName.trim()}` : ''}\n\n${lines.join('\n')}\n\n---\n${pendingPages ? 'Fixed one-time fees' : 'One-time total'}: ${money(
      quote.oneAfter,
    )}`
    if (quote.pct > 0) body += ` (after ${quote.pct}% bundle discount, saving ${money(quote.bundleAmount)})`
    if (quote.credit > 0) body += `\nCredit applied${quote.creditLabel ? ` — ${quote.creditLabel}` : ''}: -${money(quote.credit)}`
    body += `\nMonthly: ${money(quote.monthly)}/mo`
    if (pendingNote) body += `\n${pendingNote}`
    if (quote.firstMonthsFree > 0) body += `\nLimited-time: first month free (${money(quote.firstMonthsFree)} saved)`
    if (quoteNotes.trim()) body += `\n\nNotes:\n${quoteNotes.trim()}`
    body += '\n\nPlease hold this price for me. My details:\nName:\nPhone:\nWebsite:'
    window.location.href = `mailto:${OFFER.contactEmail}?subject=${encodeURIComponent('My Wavefront Package Quote')}&body=${encodeURIComponent(body)}`
  }

  return (
    <Layout
      className="package-page"
      seo={{
        title: 'Build Your Package | Wavefront Studio',
        description:
          'Tick the services you want and pick a tier — your total updates instantly. The more you bundle, the more you save.',
        canonical: '/package-builder/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">Build Your Package</span>
          <h1>Build Your Wavefront Package</h1>
          <p>
            Tick the services you want and pick a tier — your total updates instantly. Tap the ⓘ icon on any service to see exactly what
            each tier includes. The more you bundle, the more you save.
          </p>
        </div>
      </section>

      {quote.count > 0 ? (
        <div className="package-mini">
          <div className="page-frame">
            <span>
              {pendingPages ? 'Fixed fees' : 'One-time'} <b>{money(quote.oneAfter)}</b>{pendingPages ? ' + pages' : ''}
            </span>
            <span>
              Monthly <b>{money(quote.monthly)}</b>
              <small>/mo</small>
            </span>
            <a href="#quote">See my offer ↓</a>
          </div>
        </div>
      ) : null}

      <section className="chapter package-chapter">
        <div className="page-frame package-layout">
          <div className="package-services">
            <div className="bundle-meter">
              <div className="bundle-meter-head">
                <span>
                  {quote.count === 0
                    ? 'Select 2+ services to unlock automatic bundle savings.'
                    : nextTier
                      ? `Add ${nextTier.min - quote.count} more service${nextTier.min - quote.count > 1 ? 's' : ''} to unlock ${nextTier.pct}% off your setup.`
                      : `🎉 Max bundle discount unlocked — ${quote.pct}% off all setup fees!`}
                </span>
                <b>{quote.pct}% off</b>
              </div>
              <div className="bundle-track">
                <span style={{ width: `${Math.min(100, (quote.count / maxMin) * 100)}%` }} />
              </div>
            </div>

            {CATEGORIES.map((category) => (
              <section className="package-category" key={category.label}>
                <header>
                  <h2>{category.label}</h2>
                  <span>
                    {category.ids.length} service{category.ids.length === 1 ? '' : 's'}
                  </span>
                </header>
                {category.intro ? <p className="package-category-intro">{category.intro}</p> : null}
                {category.ids.map((id) => {
                  const service = serviceById[id]
                  if (!service) return null
                  const entry = state[id]
                  const on = Boolean(entry)
                  const tiers = on ? selectedTiers(service, entry) : []
                  const customSelected = tiers.some((index) => service.tiers[index].custom)
                  return (
                    <article className={`package-card ${on ? 'is-on' : ''}`} key={id}>
                      {/* The whole row toggles the service; the checkbox button stays the keyboard control. */}                      <div className="package-card-head" onClick={(event) => !event.target.closest('button') && toggleService(id)}>
                        <button className="package-check" type="button" onClick={() => toggleService(id)} aria-pressed={on}>
                          <span aria-hidden="true">✓</span>
                          <span className="sr-only">{on ? `Remove ${service.name}` : `Add ${service.name}`}</span>
                        </button>
                        <div className="package-card-text">
                          <h3>{service.name}</h3>
                          <p>{service.blurb}</p>
                        </div>
                        <button
                          className="package-info"
                          type="button"
                          onClick={() => setModal(service)}
                          aria-label={`See what's included in ${service.name}`}
                        >
                          i
                        </button>
                        <div className="package-from">
                          <small>From</small>
                          <b>{fromLabel(service)}</b>
                        </div>
                      </div>

                      {on ? (
                        <div className="package-card-body">
                          {service.tiers.length > 1 ? <p className="package-tier-hint">Pick one or more tiers — each one is added to your quote.</p> : null}
                          <div className="package-tiers" style={{ '--tier-count': service.tiers.length }}>
                            {service.tiers.map((tier, index) => (
                              <button
                                key={tier.n}
                                type="button"
                                className={tiers.includes(index) ? 'is-selected' : ''}
                                onClick={() => toggleTier(id, index)}
                                aria-pressed={tiers.includes(index)}
                              >
                                {index === 1 ? <span className="package-pop">POPULAR</span> : null}
                                <strong>{tier.n}</strong>
                                <b>{tierPrice(tier)}{id === 'landing' && !tier.custom ? ' base' : ''}</b>
                                <small>{tier.note}</small>
                              </button>
                            ))}
                          </div>

                          {id === 'landing' && customSelected ? (
                            <fieldset className="package-custom">
                              <legend>Custom landing page quote</legend>
                              <p>Set the price and scope for your unique build. Add per-page pricing if your project needs it.</p>
                              <div className="package-custom-prices">
                                <label htmlFor="custom-project-name">Project name (optional)
                                  <input id="custom-project-name" type="text" maxLength="80" placeholder="e.g. Product launch experience" value={entry.custom?.name ?? ''} onChange={(event) => setCustomField('name', event.target.value)} />
                                </label>
                                <label htmlFor="custom-project-price">One-time project price ($)
                                  <input id="custom-project-price" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="Enter project price" value={entry.custom?.setup ?? ''} onChange={(event) => setCustomField('setup', event.target.value)} />
                                </label>
                                <label htmlFor="custom-monthly-price">Monthly price ($/mo, optional)
                                  <input id="custom-monthly-price" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="e.g. 99" value={entry.custom?.monthly ?? ''} onChange={(event) => setCustomField('monthly', event.target.value)} />
                                </label>
                              </div>
                              <label className="package-custom-tbc" htmlFor="custom-per-page-enabled">
                                <input id="custom-per-page-enabled" type="checkbox" checked={entry.custom?.perPageEnabled === true} onChange={(event) => setCustomField('perPageEnabled', event.target.checked)} />
                                Add per-page pricing
                              </label>
                              {entry.custom?.perPageEnabled ? <>
                              <div className="package-custom-prices">
                                <label htmlFor="custom-page-price">Additional price per page ($)
                                  <input id="custom-page-price" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="e.g. 100" value={entry.custom?.perPage ?? ''} onChange={(event) => setCustomField('perPage', event.target.value)} />
                                </label>
                                <label htmlFor="custom-page-count">Number of pages
                                  <input id="custom-page-count" type="number" min="1" max="9999" step="1" inputMode="numeric" disabled={entry.custom?.pagesTbc === true} value={entry.custom?.pages ?? 1} onChange={(event) => setCustomField('pages', event.target.value)} />
                                </label>
                              </div>
                              <label className="package-custom-tbc" htmlFor="custom-pages-tbc">
                                <input id="custom-pages-tbc" type="checkbox" checked={entry.custom?.pagesTbc === true} onChange={(event) => setCustomField('pagesTbc', event.target.checked)} />
                                Page count to be confirmed
                              </label>
                              </> : null}
                              <label htmlFor="custom-project-details">Project details for the quote
                                <textarea id="custom-project-details" rows="5" maxLength="2000" placeholder="Describe the features, design, integrations, and deliverables included in this build." value={entry.custom?.details ?? ''} onChange={(event) => setCustomField('details', event.target.value)} />
                              </label>
                              <p>Custom pricing replaces the Launch, Grow, and Scale tiers. All prices in USD. Leave the monthly price blank if there is no ongoing charge, and use $0 for the project price if you charge only per page or monthly.</p>
                            </fieldset>
                          ) : null}

                          {id === 'landing' ? tiers.filter((index) => !service.tiers[index].custom).map((index) => {
                            const tier = service.tiers[index]
                            const pageBundle = landingPageBundle(entry.pagesByTier?.[index] ?? entry.pages)
                            return (
                              <div className="package-page-bundle" key={tier.n}>
                                <div>
                                  <label htmlFor={`landing-page-bundle-${index}`}>How many {tier.n} landing pages?</label>
                                  <p id={`landing-bundle-help-${index}`}>Priced per page at the {tier.n} rate of {money(tier.s)}.</p>
                                </div>
                                <select id={`landing-page-bundle-${index}`} value={pageBundle.pages} aria-describedby={`landing-bundle-help-${index} landing-page-cost-${index}`} onChange={(event) => setPageBundle(index, event.target.value)}>
                                  {LANDING_PAGE_BUNDLES.map((bundle) => (
                                    <option key={bundle.pages} value={bundle.pages}>
                                      {`${bundle.pages} page${bundle.pages === 1 ? '' : 's'} — ${money(landingPagesPrice(tier, bundle.pages))}`}
                                    </option>
                                  ))}
                                </select>
                                <p id={`landing-page-cost-${index}`} className="package-bundle-total" aria-live="polite">
                                  {tier.n} {money(tier.s)} × {pageBundle.pages} page{pageBundle.pages === 1 ? '' : 's'}
                                  {' = '}<b>{money(landingPagesPrice(tier, pageBundle.pages))}</b>
                                </p>
                              </div>
                            )
                          }) : null}

                          <div className="package-notes">
                            <span className="pkg-label">Notes shown on the quote (optional)</span>
                            {tiers.map((index) => {
                              const tier = service.tiers[index]
                              const fieldId = `note-${id}-${index}`
                              return (
                                <label htmlFor={fieldId} key={tier.n}>
                                  {tiers.length > 1 || service.tiers.length > 1 ? `${tier.n}${tier.custom ? ' — extra notes' : ''}` : service.name}
                                  <textarea id={fieldId} rows="2" maxLength="1000" placeholder="Explain what's included, timing, or anything the client should know." value={entry.notes?.[index] ?? ''} onChange={(event) => setEntryMap(id, 'notes', index, event.target.value)} />
                                </label>
                              )
                            })}
                          </div>

                          {service.addons.length ? (
                            <div className="package-addons">
                              <span className="pkg-label">Optional add-ons</span>
                              <div>
                                {service.addons.map((addon, addonIndex) => {
                                  const selected = entry.addons.includes(addonIndex)
                                  return (
                                    <div className="package-addon" key={addon.l}>
                                      <button
                                        type="button"
                                        className={selected ? 'is-on' : ''}
                                        onClick={() => toggleAddon(id, addonIndex)}
                                        aria-pressed={selected}
                                      >
                                        <i aria-hidden="true">✓</i>
                                        <span>{addon.l}</span>
                                        <b>
                                          {money(addonPrice(id, addonIndex))}
                                          {addon.t === 'monthly' ? '/mo' : ''}
                                        </b>
                                      </button>
                                      {addon.opts ? (
                                        <select
                                          value={optionIndex(id, addonIndex)}
                                          onChange={(event) => setAddonOption(id, addonIndex, Number(event.target.value))}
                                          aria-label={`${addon.l} frequency`}
                                        >
                                          {addon.opts.map((option, index) => (
                                            <option key={option.l} value={index}>
                                              {option.l} — {option.q} article{option.q > 1 ? 's' : ''} · {money(addon.p * option.q)}/mo
                                            </option>
                                          ))}
                                        </select>
                                      ) : null}
                                      {selected ? (
                                        <textarea
                                          className="package-addon-note"
                                          rows="2"
                                          maxLength="1000"
                                          placeholder="Note for this add-on (optional)"
                                          aria-label={`${addon.l} note`}
                                          value={entry.addonNotes?.[addonIndex] ?? ''}
                                          onChange={(event) => setEntryMap(id, 'addonNotes', addonIndex, event.target.value)}
                                        />
                                      ) : null}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </section>
            ))}
          </div>

          <aside className="package-quote" id="quote">
            <h2>Your Quote</h2>
            <label className="package-client" htmlFor="quote-client">Prepared for <span>(optional)</span>
              <input id="quote-client" type="text" maxLength="100" placeholder="Client or company name" value={clientName} onChange={(event) => setClientName(event.target.value)} />
            </label>
            <label className="package-client" htmlFor="quote-notes">Quote notes <span>(optional, shown on the PDF)</span>
              <textarea id="quote-notes" rows="3" maxLength="4000" placeholder="Timeline, payment terms, next steps, or anything else to explain." value={quoteNotes} onChange={(event) => setQuoteNotes(event.target.value)} />
            </label>
            <label className="package-client" htmlFor="quote-credit">Credit ($) <span>(optional, comes off the one-time total)</span>
              <input id="quote-credit" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="e.g. 500 already paid" value={state.credit?.amount ?? ''} onChange={(event) => setCreditField('amount', event.target.value)} />
            </label>
            {creditAmount(state.credit) > 0 ? (
              <label className="package-client" htmlFor="quote-credit-label">What the credit is for <span>(optional)</span>
                <input id="quote-credit-label" type="text" maxLength="80" placeholder="e.g. Phase 1 deposit" value={state.credit?.label ?? ''} onChange={(event) => setCreditField('label', event.target.value)} />
              </label>
            ) : null}
            {quote.count === 0 ? (
              <p className="package-empty">No services selected yet. Pick some on the left.</p>
            ) : (
              <>
                <div className="package-lines">
                  {quote.rows.map((row, index) => (
                    <div key={`${row.label}-${index}`} className={row.sub ? 'is-sub' : ''}>
                      <span>{row.sub ? `+ ${row.label}` : row.label}{row.description ? <small className="package-scope">{row.description}</small> : null}</span>
                      <b>{row.amount}</b>
                    </div>
                  ))}
                </div>
                {quote.errors?.length ? <div className="package-pdf-error" id="custom-quote-errors" aria-live="polite">{quote.errors.map((error) => <p key={error}>{error}</p>)}</div> : null}
                <div className="package-totals">
                  <div>
                    <span>{pendingPages ? 'Fixed fees subtotal' : 'One-time subtotal'}</span>
                    <b>{money(quote.one)}</b>
                  </div>
                  {quote.pct > 0 ? (
                    <div className="is-discount">
                      <span>Bundle discount ({quote.pct}%)</span>
                      <b>-{money(quote.bundleAmount)}</b>
                    </div>
                  ) : null}
                  {quote.credit > 0 ? (
                    <div className="is-discount">
                      <span>{quote.creditLabel ? `Credit — ${quote.creditLabel}` : 'Credit applied'}</span>
                      <b>-{money(quote.credit)}</b>
                    </div>
                  ) : null}
                  <div className="is-total">
                    <span>{pendingPages ? 'Fixed one-time fees' : 'One-time total'}</span>
                    <b>{money(quote.oneAfter)}</b>
                  </div>
                  <div className="is-total">
                    <span>Ongoing</span>
                    <b>
                      {money(quote.monthly)}
                      <small>/mo</small>
                    </b>
                  </div>
                  {pendingPages ? <p className="package-pending-note">{pendingNote}</p> : null}
                </div>
              </>
            )}

            <button
              className="kinetic-button group package-pdf-button"
              type="button"
              onClick={downloadPdf}
              disabled={!quote.count || Boolean(quote.errors?.length) || pdfStatus === 'loading'}
              aria-busy={pdfStatus === 'loading'}
              aria-describedby={quote.errors?.length ? 'custom-quote-errors' : pdfStatus === 'error' ? 'quote-pdf-error' : undefined}
            >
              <span>{pdfStatus === 'loading' ? 'Preparing PDF...' : 'Download PDF'}</span>
              <span className="button-island">
                <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 3v9m-4-4 4 4 4-4M4 13v4h12v-4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {pdfStatus === 'error' ? (
              <p className="package-pdf-error" id="quote-pdf-error" role="alert">
                We couldn’t create your PDF. Please try again.
              </p>
            ) : null}

            <button className="kinetic-button light group package-email-button" type="button" onClick={emailQuote} disabled={Boolean(quote.errors?.length)} aria-describedby={quote.errors?.length ? 'custom-quote-errors' : undefined}>
              <span>Email me this quote</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </button>

            <p className="package-note">
              Estimates for standard scopes. Final quote confirmed on a quick call. Ad spend for paid campaigns billed separately.
            </p>

            <div className="package-savings">
              <span className="eyebrow">Your savings if you start now</span>
              <div>
                <span>Bundle discount</span>
                <b>{money(quote.bundleAmount)}</b>
              </div>
              {quote.firstMonthsFree > 0 ? (
                <div>
                  <span>First month free (monthly plans)</span>
                  <b>{money(quote.firstMonthsFree)}</b>
                </div>
              ) : null}
              <div className="is-total">
                <span>Total limited-time savings</span>
                <b>{money(quote.bundleAmount + quote.firstMonthsFree)}</b>
              </div>
            </div>

            <div className="package-always">
              <span className="eyebrow">Always-on offers</span>
              <span>2 services — 5% off setup</span>
              <span>3–4 services — 10% off setup</span>
              <span>5+ services — 15% off setup</span>
              <span>Price-lock guarantee — Life of contract</span>
            </div>

            {suggestion ? (
              <div className="package-upsell">
                <p>
                  💡 Pair it with <b>{suggestion.name}</b> to{' '}
                  {nextTier ? `unlock ${nextTier.pct}% off your whole setup` : `keep your ${quote.pct}% bundle discount`} — plus your
                  first month free.
                </p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    toggleService(suggestion.id)
                    setToast(`${suggestion.name} added`)
                  }}
                >
                  Add it &amp; save <ArrowIcon />
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="chapter package-smallprint">
        <div className="page-frame">
          <p>Wavefront Studio LLC • Sarasota, Florida • {contact.supportPhone} • wavefrontstudiollc.com</p>
          <p>
            Pricing reflects 2026 Florida market rates for standard scopes and is a starting point; final quotes are customized. One-time
            builds are typically billed 50% to start and 50% on delivery. Monthly services have a 3-month minimum recommendation.
            Limited-time savings apply to new agreements started before the countdown expires. Digital-marketing ad spend is billed
            separately by the ad platform.
          </p>
        </div>
      </section>

      {modal ? (
        <DetailsModal
          service={modal}
          onClose={() => setModal(null)}
          onSelect={(tier) => {
            if (!state[modal.id]) setState((current) => ({ ...current, [modal.id]: { tiers: [tier], addons: [], opts: {} } }))
            else toggleTier(modal.id, tier, { keep: true })
            setToast(`${modal.name} — ${modal.tiers[tier].n} selected`)
            setModal(null)
          }}
        />
      ) : null}

      <div className={`package-toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </Layout>
  )
}
