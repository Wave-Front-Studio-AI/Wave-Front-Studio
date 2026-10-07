import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { Honeypot, SmsConsentField } from '../components/shared.jsx'
import { CATEGORIES, DETAILS, LANDING_PAGE_BUNDLES, OFFER, PAIRS, SERVICES } from '../data/generated/packages.js'
import { contact } from '../data/site.js'
import { deliverLead } from '../formSubmission.js'
import { MAX_TIER_QTY, addonQty, calculateQuote, creditAmount, customQuoteItem, defaultOptionIndex, landingPageBundle, landingPagesPrice, money, selectedTiers, serviceUnits, tierPrice, tierQty } from '../packageQuote.js'

const serviceById = Object.fromEntries(SERVICES.map((service) => [service.id, service]))

// Staff open the page with ?staff=1 to add a client name, a credit and their own prices.
// This only keeps those tools out of a visitor's way; it is not access control.
const isStaffUrl = () => new URLSearchParams(window.location.search).get('staff') === '1'

// Visitors can't price the Custom landing tier themselves, so it shows this instead of a price.
const CUSTOM_PRICE_LABEL = 'Priced on a call'
// The row label calculateQuote gives the Custom landing tier.
const CUSTOM_LANDING_ROW = 'Landing Pages — Custom'

const tierLabel = (tier, staff) => (tier.custom && !staff ? CUSTOM_PRICE_LABEL : tierPrice(tier))

// A visitor's quote leaves out everything only staff can set: credits, custom items and custom landing prices.
// The project name and details stay, so the studio still sees what the visitor described.
function visitorQuote(state) {
  const safe = { ...state }
  delete safe.credit
  delete safe.customItems
  if (safe.landing?.custom) safe.landing = { ...safe.landing, custom: { name: safe.landing.custom.name, details: safe.landing.custom.details } }
  const quote = calculateQuote(safe)
  let customPriced = false
  const rows = quote.rows.map((row) => {
    if (!row.label.startsWith(CUSTOM_LANDING_ROW)) return row
    customPriced = true
    return { ...row, amount: CUSTOM_PRICE_LABEL }
  })
  return { ...quote, rows, customPriced }
}

// The lead API accepts up to 32 KB, so an unusually long quote is shortened rather than refused.
const MAX_MESSAGE = 12000

function fromLabel(service) {
  const minSetup = Math.min(...service.tiers.filter((tier) => !tier.custom).map((tier) => tier.s))
  const monthlies = service.tiers.filter((tier) => tier.m > 0).map((tier) => tier.m)
  const minMonthly = monthlies.length ? Math.min(...monthlies) : 0
  if (service.billing === 'monthly') return `${money(minMonthly)}/mo`
  if (service.billing === 'hybrid') return `${money(minSetup)} + ${money(minMonthly)}/mo`
  return money(minSetup)
}

function DetailsModal({ service, staff, onClose, onSelect }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  // Focus moves into the dialog and back to the "i" button when it closes.
  // Run once: onClose is a new function on every render of the builder.
  useEffect(() => {
    const opener = document.activeElement
    panelRef.current?.querySelector('.modal-close')?.focus()
    return () => opener?.focus?.()
  }, [])

  // Keeps Tab inside the dialog while it is open.
  function trapFocus(event) {
    if (event.key !== 'Tab') return
    const focusable = [...panelRef.current.querySelectorAll('button, [tabindex="0"]')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const rows = DETAILS[service.id] || []

  return (
    <div className="modal-scrim" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-panel modal-package" role="dialog" aria-modal="true" aria-labelledby="pkg-modal-title" ref={panelRef} onKeyDown={trapFocus}>
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
              <strong>{tierLabel(tier, staff)}{service.id === 'landing' && !tier.custom ? ' base' : ''}</strong>
            </div>
          ))}
        </div>
        {rows.length ? (
          // Focusable so the table can be scrolled sideways from the keyboard;
          // it holds no links or buttons of its own to tab to.
          <div className="comparison-scroll" tabIndex={0} role="region" aria-label={`What’s included in each ${service.name} tier`}>
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
                    {row.slice(1).map((cell, index) => {
                      const yes = cell === '✓'
                      const no = cell === '—' || cell === '-'
                      return (
                        <td key={index} className={yes ? 'is-yes' : no ? 'is-no' : ''}>
                          {/* Read aloud, a tick or a dash says little or nothing, so the meaning is spelled out. */}
                          {yes || no ? (
                            <>
                              <span aria-hidden="true">{cell}</span>
                              <span className="sr-only">{yes ? 'Included' : 'Not included'}</span>
                            </>
                          ) : cell}
                        </td>
                      )
                    })}
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

// Minus and plus stay focusable at the limits (aria-disabled, not disabled) so keyboard focus isn't dropped mid-press.
// The field accepts typing; it tidies itself to a whole number when it loses focus.
function QtyStepper({ id, name, value, onChange }) {
  const qty = tierQty(value)
  const step = (by) => {
    const next = qty + by
    if (next >= 1 && next <= MAX_TIER_QTY) onChange(next)
  }
  return (
    <div className="package-stepper">
      <button type="button" onClick={() => step(-1)} aria-disabled={qty <= 1} aria-label={`One fewer ${name}`}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <input id={id} type="number" min="1" max={MAX_TIER_QTY} step="1" inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} onBlur={() => onChange(qty)} />
      <button type="button" onClick={() => step(1)} aria-disabled={qty >= MAX_TIER_QTY} aria-label={`One more ${name}`}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

// The quote panel is sticky and taller than the screen, so the form opens as a dialog rather than below the fold.
function CustomItemModal({ item, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({
    title: item?.title ?? '',
    description: item?.description ?? '',
    qty: item ? String(item.qty) : '1',
    cost: item ? (Number.isInteger(item.cost) ? String(item.cost) : item.cost.toFixed(2)) : '',
  }))
  const [showErrors, setShowErrors] = useState(false)
  const panelRef = useRef(null)
  const checked = customQuoteItem(draft)
  const errors = showErrors ? checked.errors : {}

  useEffect(() => {
    const opener = document.activeElement
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    panelRef.current?.querySelector('#custom-item-title')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
      opener?.focus?.()
    }
  }, [onClose])

  // Keeps Tab inside the dialog while it is open.
  function trapFocus(event) {
    if (event.key !== 'Tab') return
    const focusable = [...panelRef.current.querySelectorAll('button, input, textarea')].filter((element) => !element.disabled)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function submit(event) {
    event.preventDefault()
    const invalid = ['title', 'qty', 'cost'].find((name) => checked.errors[name])
    if (invalid) {
      setShowErrors(true)
      panelRef.current.querySelector(`#custom-item-${invalid}`)?.focus()
      return
    }
    onSave({ title: checked.title, description: checked.description, qty: checked.qty, cost: checked.cost })
  }

  const field = (name) => ({
    id: `custom-item-${name}`,
    name,
    value: draft[name],
    onChange: (event) => setDraft((current) => ({ ...current, [name]: event.target.value })),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `custom-item-${name}-error` : undefined,
  })
  const fieldError = (name) => (errors[name] ? <p className="package-field-error" id={`custom-item-${name}-error`}>{errors[name]}</p> : null)
  const pricedUp = !checked.errors.qty && !checked.errors.cost

  return (
    <div className="modal-scrim" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="custom-item-heading" ref={panelRef} onKeyDown={trapFocus}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="pkg-modal-head">
          <h3 id="custom-item-heading">{item ? 'Edit custom item' : 'Add a custom item'}</h3>
          <p>A line of your own on this quote, charged once at the price you enter. Bundle discounts don’t apply to it.</p>
        </div>
        <form className="custom-item-form" onSubmit={submit} noValidate>
          <div className="custom-item-field">
            <label className="package-client" htmlFor="custom-item-title">Title
              <input {...field('title')} type="text" maxLength="120" autoComplete="off" placeholder="e.g. Logo refresh" />
            </label>
            {fieldError('title')}
          </div>
          <label className="package-client" htmlFor="custom-item-description">Description <span>(optional)</span>
            <textarea {...field('description')} rows="4" maxLength="1000" placeholder="What’s included, so the client knows what they’re paying for." />
          </label>
          <div className="custom-item-numbers">
            <div className="custom-item-field">
              <label className="package-client" htmlFor="custom-item-qty">Quantity
                <input {...field('qty')} type="number" min="1" max="9999" step="1" inputMode="numeric" />
              </label>
              {fieldError('qty')}
            </div>
            <div className="custom-item-field">
              <label className="package-client" htmlFor="custom-item-cost">Cost per item ($)
                <input {...field('cost')} type="number" min="0" max="1000000" step="0.01" inputMode="decimal" placeholder="e.g. 250" />
              </label>
              {fieldError('cost')}
            </div>
          </div>
          <p className="custom-item-total" aria-live="polite">
            <span>Line total{pricedUp && checked.qty > 1 ? <small> ({checked.qty} × {money(checked.cost)})</small> : null}</span>
            <b>{money(checked.total)}</b>
          </p>
          <div className="pkg-modal-actions">
            <button className="kinetic-button group" type="submit">
              <span>{item ? 'Save changes' : 'Add to quote'}</span>
            </button>
            <button className="text-link" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BuildYourPackage() {
  // state[id] = { tiers: [], pagesByTier: { [tierIndex]: pages }, qtyByTier: { [tierIndex]: qty }, notes: { [tierIndex]: text },
  //   addons: [], addonNotes: { [addonIndex]: text }, opts: { [addonIndex]: optionIndex } }
  const [state, setState] = useState({})
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [pdfStatus, setPdfStatus] = useState('idle')
  // The last PDF made, { url, filename }, offered as a link in case the browser blocked the automatic download.
  const [pdfFile, setPdfFile] = useState(null)
  const [clientName, setClientName] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [staff, setStaff] = useState(false)
  // Sending the quote to the studio: sendPhase is 'idle', 'sending' or 'sent'.
  const [sendOpen, setSendOpen] = useState(false)
  const [sendPhase, setSendPhase] = useState('idle')
  const [sendStatus, setSendStatus] = useState('')
  const [sentName, setSentName] = useState('')
  const sendNameRef = useRef(null)
  const sentHeadingRef = useRef(null)
  // Set by "Send another quote", so focus returns to the form it brings back.
  const refocusSendRef = useRef(false)
  // null when closed, { id: null } for a new custom item, { id } to edit one.
  const [customEditor, setCustomEditor] = useState(null)
  const customIdRef = useRef(0)
  const customButtonRef = useRef(null)
  const customItems = state.customItems ?? []
  const closeCustomEditor = useCallback(() => setCustomEditor(null), [])

  function saveCustomItem(values) {
    const editingId = customEditor?.id
    if (editingId) {
      setState((current) => ({ ...current, customItems: (current.customItems ?? []).map((item) => (item.id === editingId ? { ...item, ...values } : item)) }))
    } else {
      customIdRef.current += 1
      const id = `custom-${customIdRef.current}`
      setState((current) => ({ ...current, customItems: [...(current.customItems ?? []), { id, ...values }] }))
    }
    setToast(editingId ? 'Custom item updated' : 'Custom item added')
    setCustomEditor(null)
  }

  function removeCustomItem(id) {
    setState((current) => ({ ...current, customItems: (current.customItems ?? []).filter((item) => item.id !== id) }))
    setToast('Custom item removed')
    customButtonRef.current?.focus()
  }

  async function downloadPdf() {
    if (!hasItems || quote.errors?.length || pdfStatus === 'loading') return
    setPdfStatus('loading')
    try {
      const { renderQuotePdf } = await import('../quotePdf.js')
      const { blob, filename } = await renderQuotePdf({ ...quote, clientName: staff ? clientName.trim() : '', notes: quoteNotes.trim() })
      const file = { url: URL.createObjectURL(blob), filename }
      const link = Object.assign(document.createElement('a'), { href: file.url, download: filename, rel: 'noopener' })
      document.body.append(link)
      link.click()
      link.remove()
      setPdfFile(file)
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

  // Read after hydration, so the prerendered HTML and the first render in the browser match.
  useEffect(() => {
    setStaff(isStaffUrl())
  }, [])

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

  const quote = useMemo(() => (staff ? calculateQuote(state) : visitorQuote(state)), [state, staff])
  // Services drive the bundle meter; a quote can also be custom items alone.
  const hasItems = quote.rows.length > 0
  const pendingPages = quote.pendingPageRate !== undefined
  const pendingNote = pendingPages ? `Plus ${money(quote.pendingPageRateAfter)} per page${quote.pct ? ` after the ${quote.pct}% bundle discount` : ''}. Page count and final total to be confirmed.` : ''
  const customNote = quote.customPriced ? 'Your custom landing page is priced on a quick call, so it isn’t in these totals yet.' : ''

  // Nothing left to send, so the form closes.
  useEffect(() => {
    if (!hasItems) setSendOpen(false)
  }, [hasItems])

  useEffect(() => {
    if (sendOpen) sendNameRef.current?.focus()
  }, [sendOpen])

  // The thank-you replaces the form, so focus moves with it rather than dropping to the page.
  useEffect(() => {
    if (sendPhase === 'sent') sentHeadingRef.current?.focus()
    else if (refocusSendRef.current) {
      refocusSendRef.current = false
      sendNameRef.current?.focus()
    }
  }, [sendPhase])

  // Loads the PDF code and branding as soon as there's a quote, so the download starts straight after the click
  // while the browser still counts it as the visitor's own. A failed load is retried on the click.
  useEffect(() => {
    if (!hasItems) return
    import('../quotePdf.js').then((module) => module.loadQuoteBrandAssets()).catch(() => {})
  }, [hasItems])

  // A PDF link goes out of date as soon as the quote changes.
  useEffect(() => setPdfFile(null), [state, clientName, quoteNotes])

  // Old files are released a few minutes after they're replaced, so a download still sitting in a Save As dialog can finish.
  useEffect(() => {
    if (!pdfFile) return undefined
    return () => window.setTimeout(() => URL.revokeObjectURL(pdfFile.url), 300000)
  }, [pdfFile])

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

  // The quote as plain text: the message the form sends, and the body of the email link.
  function quoteText() {
    const lines = quote.rows.map((row) => `${row.sub ? '  + ' : ''}${row.label} — ${row.amount}${row.description ? `\n${row.description}` : ''}`)
    let text = `${staff && clientName.trim() ? `Prepared for: ${clientName.trim()}\n\n` : ''}${lines.join('\n')}\n\n---\n${pendingPages ? 'Fixed one-time fees' : 'One-time total'}: ${money(quote.oneAfter)}`
    if (quote.pct > 0) text += ` (after ${quote.pct}% bundle discount, saving ${money(quote.bundleAmount)})`
    if (quote.credit > 0) text += `\nCredit applied${quote.creditLabel ? ` — ${quote.creditLabel}` : ''}: -${money(quote.credit)}`
    text += `\nMonthly: ${money(quote.monthly)}/mo`
    if (pendingNote) text += `\n${pendingNote}`
    if (customNote) text += `\n${customNote}`
    if (quote.firstMonthsFree > 0) text += `\nFirst month free on monthly plans: ${money(quote.firstMonthsFree)} saved`
    if (quoteNotes.trim()) text += `\n\nNotes:\n${quoteNotes.trim()}`
    return text
  }

  function toggleSend() {
    if (!hasItems) {
      setToast(staff ? 'Select a service or add a custom item first' : 'Select a service first')
      return
    }
    setSendOpen((open) => !open)
  }

  async function sendQuote(event) {
    event.preventDefault()
    // A second click while the first is in flight would store the lead twice.
    if (sendPhase === 'sending' || !hasItems || quote.errors?.length) return
    const form = event.currentTarget
    const submittedName = new FormData(form).get('name')
    setSendPhase('sending')
    setSendStatus('Sending your quote…')
    try {
      await deliverLead(form, {
        subject: 'Package builder quote',
        source: 'package-builder',
        fields: [
          ['Name', 'name'],
          ['Phone', 'phone'],
          ['Email', 'email'],
          [pendingPages ? 'Fixed one-time fees' : 'One-time total', null, money(quote.oneAfter)],
          ['Monthly', null, `${money(quote.monthly)}/mo`],
        ],
      })
      setSentName(typeof submittedName === 'string' ? submittedName.trim() : '')
      setSendStatus('')
      setSendPhase('sent')
    } catch {
      setSendPhase('idle')
      setSendStatus(`We could not send the form. Please email ${contact.email} or call ${contact.phone}.`)
    }
  }

  const summary = hasItems ? quoteText() : ''
  const message = summary.length > MAX_MESSAGE ? `${summary.slice(0, MAX_MESSAGE)}\n[Quote shortened to fit the form.]` : summary
  const mailtoHref = `mailto:${OFFER.contactEmail}?subject=${encodeURIComponent('My Wavefront Package Quote')}&body=${encodeURIComponent(
    `Hi Wavefront Studio,\n\nI would like to lock in this package:\n\n${summary}\n\nPlease hold this price for me. My details:\nName:\nPhone:\nWebsite:`,
  )}`

  return (
    <Layout
      className="package-page"
      seo={{
        title: 'Build Your Package: Web, SEO & AI Pricing | Wavefront Studio',
        description:
          'Pick the website, marketing and AI services you need, choose a tier for each and watch your total update. Save the quote as a PDF or send it to the studio.',
        canonical: '/package-builder/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <h1>Build your Wavefront package</h1>
          <p>
            Tick the services you want and pick a tier, and your total updates instantly. Tap the ⓘ icon on any service to see exactly what
            each tier includes. The more you bundle, the more you save.
          </p>
        </div>
      </section>

      {hasItems ? (
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
                    ? 'Select 2+ services to get automatic bundle savings.'
                    : nextTier
                      ? `Add ${nextTier.min - quote.count} more service${nextTier.min - quote.count > 1 ? 's' : ''} to get ${nextTier.pct}% off your setup.`
                      : `Max bundle discount reached: ${quote.pct}% off all setup fees!`}
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
                  const units = on ? serviceUnits(service, entry) : 1
                  return (
                    <article className={`package-card ${on ? 'is-on' : ''}`} key={id}>
                      {/* The whole row toggles the service; the checkbox button stays the keyboard control. */}                      <div className="package-card-head" onClick={(event) => !event.target.closest('button') && toggleService(id)}>
                        <button className="package-check" type="button" onClick={() => toggleService(id)} aria-pressed={on}>
                          <span aria-hidden="true">✓</span>
                          {/* A fixed name, with aria-pressed giving the state: a name that also
                              flipped would read "Remove ..., pressed". */}
                          <span className="sr-only">{`Add ${service.name}`}</span>
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
                          {service.tiers.length > 1 ? <p className="package-tier-hint">Pick one or more tiers. Each one is added to your quote.</p> : null}
                          <div className="package-tiers" style={{ '--tier-count': service.tiers.length }}>
                            {service.tiers.map((tier, index) => (
                              <button
                                key={tier.n}
                                type="button"
                                className={tiers.includes(index) ? 'is-selected' : ''}
                                onClick={() => toggleTier(id, index)}
                                aria-pressed={tiers.includes(index)}
                              >
                                <strong>{tier.n}</strong>
                                <b>{tierLabel(tier, staff)}{id === 'landing' && !tier.custom ? ' base' : ''}</b>
                                <small>{tier.note}</small>
                              </button>
                            ))}
                          </div>

                          {id === 'landing' && customSelected ? (
                            <fieldset className="package-custom">
                              <legend>{staff ? 'Custom landing page quote' : 'Your custom landing page'}</legend>
                              <p>{staff ? 'Set the price and scope for your unique build. Add per-page pricing if your project needs it.' : 'Tell us what the page needs to do. We’ll price it with you on a quick call.'}</p>
                              <div className="package-custom-prices">
                                <label htmlFor="custom-project-name">Project name (optional)
                                  <input id="custom-project-name" type="text" maxLength="80" placeholder="e.g. Product launch experience" value={entry.custom?.name ?? ''} onChange={(event) => setCustomField('name', event.target.value)} />
                                </label>
                                {/* Prices are set by staff only; a visitor's custom page is priced on a call. */}
                                {staff ? <>
                                <label htmlFor="custom-project-price">One-time project price ($)
                                  <input id="custom-project-price" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="Enter project price" value={entry.custom?.setup ?? ''} onChange={(event) => setCustomField('setup', event.target.value)} />
                                </label>
                                <label htmlFor="custom-monthly-price">Monthly price ($/mo, optional)
                                  <input id="custom-monthly-price" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="e.g. 99" value={entry.custom?.monthly ?? ''} onChange={(event) => setCustomField('monthly', event.target.value)} />
                                </label>
                                </> : null}
                              </div>
                              {staff ? <>
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
                              </> : null}
                              <label htmlFor="custom-project-details">Project details for the quote
                                <textarea id="custom-project-details" rows="5" maxLength="2000" placeholder="Describe the features, design, integrations, and deliverables included in this build." value={entry.custom?.details ?? ''} onChange={(event) => setCustomField('details', event.target.value)} />
                              </label>
                              {staff ? <p>Custom pricing replaces the Launch, Grow, and Scale tiers. All prices in USD. Leave the monthly price blank if there is no ongoing charge, and use $0 for the project price if you charge only per page or monthly.</p> : null}
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

                          {id !== 'landing' ? (
                            <div className="package-qty">
                              <span className="pkg-label">Quantity</span>
                              {tiers.map((index) => {
                                const tier = service.tiers[index]
                                const raw = entry.qtyByTier?.[index] ?? 1
                                const qty = tierQty(raw)
                                const fieldId = `qty-${id}-${index}`
                                return (
                                  <div className="package-qty-row" key={tier.n}>
                                    <label htmlFor={fieldId}>
                                      <strong>{tier.n}<span className="sr-only"> quantity</span></strong>
                                      <small>{tierPrice(tier)} each</small>
                                    </label>
                                    <QtyStepper id={fieldId} name={tier.n} value={raw} onChange={(value) => setEntryMap(id, 'qtyByTier', index, value)} />
                                    <b aria-live="polite">{tierPrice({ s: tier.s * qty, m: tier.m * qty })}</b>
                                  </div>
                                )
                              })}
                            </div>
                          ) : null}

                          <div className="package-notes">
                            <span className="pkg-label">Notes shown on the quote (optional)</span>
                            {tiers.map((index) => {
                              const tier = service.tiers[index]
                              const fieldId = `note-${id}-${index}`
                              return (
                                <label htmlFor={fieldId} key={tier.n}>
                                  {tiers.length > 1 || service.tiers.length > 1 ? `${tier.n}${tier.custom ? ' (extra notes)' : ''}` : service.name}
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
                                  const perMonth = addon.t === 'monthly' ? '/mo' : ''
                                  return (
                                    <div className="package-addon" key={addon.l}>
                                      <button
                                        type="button"
                                        className={selected ? 'is-on' : ''}
                                        onClick={() => toggleAddon(id, addonIndex)}
                                        aria-pressed={selected}
                                      >
                                        <i aria-hidden="true">✓</i>
                                        <span>
                                          {addon.l}
                                          {units > 1 ? <small>{units} × {money(addonPrice(id, addonIndex))}{perMonth}</small> : null}
                                        </span>
                                        <b>
                                          {money(addonPrice(id, addonIndex) * units)}
                                          {perMonth}
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
                                              {option.l} — {option.q} article{option.q > 1 ? 's' : ''} · {money(addon.p * option.q)}/mo{units > 1 ? ' each' : ''}
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
            <h2>Your quote</h2>
            {staff ? (
              <label className="package-client" htmlFor="quote-client">Prepared for <span>(optional)</span>
                <input id="quote-client" type="text" maxLength="100" placeholder="Client or company name" value={clientName} onChange={(event) => setClientName(event.target.value)} />
              </label>
            ) : null}
            <label className="package-client" htmlFor="quote-notes">Quote notes <span>(optional, shown on the PDF)</span>
              <textarea id="quote-notes" rows="3" maxLength="4000" placeholder="Timeline, payment terms, next steps, or anything else to explain." value={quoteNotes} onChange={(event) => setQuoteNotes(event.target.value)} />
            </label>
            {staff ? (
              <label className="package-client" htmlFor="quote-credit">Credit ($) <span>(optional, comes off the one-time total)</span>
                <input id="quote-credit" type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="e.g. 500 already paid" value={state.credit?.amount ?? ''} onChange={(event) => setCreditField('amount', event.target.value)} />
              </label>
            ) : null}
            {staff && creditAmount(state.credit) > 0 ? (
              <label className="package-client" htmlFor="quote-credit-label">What the credit is for <span>(optional)</span>
                <input id="quote-credit-label" type="text" maxLength="80" placeholder="e.g. Phase 1 deposit" value={state.credit?.label ?? ''} onChange={(event) => setCreditField('label', event.target.value)} />
              </label>
            ) : null}
            {!hasItems ? (
              <p className="package-empty">No services selected yet. Pick some on the left{staff ? ', or add a custom quote' : ''}.</p>
            ) : (
              <>
                <div className="package-lines">
                  {quote.rows.map((row, index) => {
                    const item = row.customId ? customItems.find((entry) => entry.id === row.customId) : null
                    return (
                      <div key={`${row.label}-${index}`} className={row.sub ? 'is-sub' : ''}>
                        <span>
                          {row.sub ? `+ ${row.label}` : row.label}
                          {row.description ? <small className="package-scope">{row.description}</small> : null}
                          {item ? (
                            <span className="package-line-actions">
                              <button type="button" onClick={() => setCustomEditor({ id: item.id })} aria-label={`Edit ${item.title}`}>Edit</button>
                              <button type="button" onClick={() => removeCustomItem(item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
                            </span>
                          ) : null}
                        </span>
                        <b>{row.amount}</b>
                      </div>
                    )
                  })}
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
                  {customNote ? <p className="package-pending-note">{customNote}</p> : null}
                </div>
              </>
            )}

            <button
              className="kinetic-button group package-pdf-button"
              type="button"
              onClick={downloadPdf}
              disabled={!hasItems || Boolean(quote.errors?.length)}
              // While it loads the button only reports itself unavailable: a
              // disabled button drops the keyboard focus that just pressed it.
              aria-disabled={pdfStatus === 'loading' || undefined}
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
            {pdfFile ? (
              <p className="package-pdf-fallback">
                Didn’t download? <a href={pdfFile.url} download={pdfFile.filename} target="_blank" rel="noopener">Open your PDF</a>
              </p>
            ) : null}
            {pdfStatus === 'error' ? (
              <p className="package-pdf-error" id="quote-pdf-error" role="alert">
                We couldn’t create your PDF. Please try again.
              </p>
            ) : null}

            <button
              className="kinetic-button light group package-send-button"
              type="button"
              onClick={toggleSend}
              disabled={Boolean(quote.errors?.length)}
              aria-expanded={sendOpen}
              aria-controls="quote-send"
              aria-describedby={quote.errors?.length ? 'custom-quote-errors' : undefined}
            >
              <span>Send this quote to the studio</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </button>

            {/* Sends the quote through the same lead pipeline as the site's other forms, so it reaches the CRM
                whether or not the visitor has a mail app. */}
            <div className="package-send" id="quote-send" hidden={!sendOpen}>
              {sendPhase === 'sent' ? (
                <div className="package-send-done">
                  <span className="confirmation-mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="m6.5 12.5 3.4 3.4 7.6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 ref={sentHeadingRef} tabIndex={-1}>Thank you{sentName ? `, ${sentName}` : ''}.</h3>
                  <p>Your quote reached the studio. We will reply using the details you gave us, usually within two working days.</p>
                  <button
                    className="text-link confirmation-reset"
                    type="button"
                    onClick={() => {
                      refocusSendRef.current = true
                      setSendPhase('idle')
                      setSentName('')
                    }}
                  >
                    Send another quote <ArrowIcon />
                  </button>
                </div>
              ) : (
                <form className="package-send-form" onSubmit={sendQuote}>
                  <Honeypot />
                  <p className="package-send-intro">Add your details and this quote goes straight to the studio. We’ll reply to confirm the price and next steps.</p>
                  <label className="package-client" htmlFor="quote-send-name">Name
                    <input ref={sendNameRef} id="quote-send-name" required name="name" type="text" autoComplete="name" placeholder="Your name" />
                  </label>
                  <label className="package-client" htmlFor="quote-send-email">Email
                    <input id="quote-send-email" required name="email" type="email" autoComplete="email" placeholder="you@company.com" />
                  </label>
                  <label className="package-client" htmlFor="quote-send-phone">Phone
                    <input
                      id="quote-send-phone"
                      required
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      pattern="(?:[^\d]*\d){7,}[^\d]*"
                      title="Enter a phone number with at least 7 digits."
                      placeholder="(941) 555-0123"
                    />
                  </label>
                  <input name="subject" type="hidden" value="Package builder quote" />
                  <input name="message" type="hidden" value={message} />
                  <SmsConsentField />
                  {/* aria-disabled, not disabled: a disabled button drops keyboard focus. */}
                  <button className="kinetic-button group" type="submit" aria-disabled={sendPhase === 'sending' || undefined}>
                    <span>{sendPhase === 'sending' ? 'Sending…' : 'Send my quote'}</span>
                    <span className="button-island">
                      <ArrowIcon className="size-4" />
                    </span>
                  </button>
                  <p className="form-status" role="status" aria-live="polite">
                    {sendStatus}
                  </p>
                  <p className="package-send-alt">
                    Prefer your own email? <a href={mailtoHref}>Email the quote yourself</a>
                  </p>
                </form>
              )}
            </div>

            {staff ? (
              <button ref={customButtonRef} className="kinetic-button light group package-custom-button" type="button" onClick={() => setCustomEditor({ id: null })} aria-haspopup="dialog">
                <span>Custom quote</span>
                <span className="button-island">
                  <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            ) : null}

            <p className="package-note">
              Estimates for standard scopes. Final quote confirmed on a quick call. Ad spend for paid campaigns billed separately.
            </p>

            <div className="package-savings">
              <h3 className="package-panel-title">Your savings on this quote</h3>
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
                <span>Total savings</span>
                <b>{money(quote.bundleAmount + quote.firstMonthsFree)}</b>
              </div>
            </div>

            <div className="package-always">
              <h3 className="package-panel-title">Always-on offers</h3>
              <span>2 services: 5% off setup</span>
              <span>3–4 services: 10% off setup</span>
              <span>5+ services: 15% off setup</span>
              <span>Price-lock guarantee: life of contract</span>
            </div>

            {suggestion ? (
              <div className="package-upsell">
                <p>
                  Pair it with <b>{suggestion.name}</b> to{' '}
                  {nextTier ? `get ${nextTier.pct}% off your whole setup` : `keep your ${quote.pct}% bundle discount`}
                  {/* The free first month is only on monthly charges, so it is only promised for a service that has one. */}
                  {suggestion.billing === 'onetime' ? '' : ', plus your first month free'}.
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
            Digital-marketing ad spend is billed separately by the ad platform.
          </p>
          <p>
            Want to know what the website tiers include and what changes a quote? Read <a href="/website-design-cost/">what a small business website costs</a>.
          </p>
        </div>
      </section>

      {modal ? (
        <DetailsModal
          service={modal}
          staff={staff}
          onClose={() => setModal(null)}
          onSelect={(tier) => {
            if (!state[modal.id]) setState((current) => ({ ...current, [modal.id]: { tiers: [tier], addons: [], opts: {} } }))
            else toggleTier(modal.id, tier, { keep: true })
            setToast(`${modal.name}: ${modal.tiers[tier].n} selected`)
            setModal(null)
          }}
        />
      ) : null}

      {customEditor ? (
        <CustomItemModal
          key={customEditor.id ?? 'new'}
          item={customEditor.id ? customItems.find((item) => item.id === customEditor.id) : null}
          onSave={saveCustomItem}
          onClose={closeCustomEditor}
        />
      ) : null}

      <div className={`package-toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </Layout>
  )
}
