import { useEffect, useRef, useState } from 'react'
import { ArrowIcon } from './Icons.jsx'
import { Honeypot, SmsConsentField } from './shared.jsx'
import { contact } from '../data/site.js'
import { deliverLead } from '../formSubmission.js'
import { useCurrentPath } from '../routeContext.js'
import { HOLIDAY_WINDOW, holidayDayPhase, holidayDealActive } from '../holidayWindow.js'

// Shown once per visit unless the visitor dismisses it. Storage can throw in
// private modes, so every read and write is guarded.
function seen(key) {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function dismissed(key) {
  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function markDismissed(key) {
  try {
    window.localStorage.setItem(key, '1')
  } catch {
    /* storage unavailable — sessionStorage still prevents another prompt this visit */
  }
}

function markSeen(key) {
  try {
    window.sessionStorage.setItem(key, '1')
  } catch {
    /* storage unavailable — the popup may simply show again next navigation */
  }
}

function Modal({ open, onClose, labelledBy, className = '', children }) {
  const panel = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [open, onClose])

  // Focus moves into the dialog, and back to wherever the visitor was when it
  // closes. Keyed on `open` alone, so a re-render never moves it.
  useEffect(() => {
    if (!open) return undefined
    const opener = document.activeElement
    panel.current?.querySelector('button, input, a')?.focus()
    return () => opener?.focus?.()
  }, [open])

  // Keeps Tab inside the dialog: the page behind the scrim can't be seen.
  function trapFocus(event) {
    if (event.key !== 'Tab') return
    const focusable = [...panel.current.querySelectorAll('a[href], button, input, select, textarea')].filter((element) => !element.disabled && element.tabIndex >= 0)
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

  if (!open) return null

  return (
    <div className="modal-scrim" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`modal-panel ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={panel} onKeyDown={trapFocus}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

function AuditPopup({ open, onClose }) {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    // A second click while the first is in flight would store the lead twice.
    if (sending) return
    setSending(true)
    setStatus('Sending…')
    try {
      await deliverLead(event.currentTarget, {
        subject: 'Free website performance audit request',
        source: 'audit-popup',
        fields: [
          ['Name', 'name'],
          ['Company', 'company'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['Website URL', 'website'],
          ['Newsletter', 'newsletter'],
        ],
      })
      setStatus('Thanks, your audit request is in.')
    } catch {
      setStatus(`We could not send that. Please email ${contact.email}.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="audit-title" className="modal-audit">
      <div className="audit-head">
        <h2 id="audit-title">Get your free website performance audit</h2>
        <p>
          Enter your website URL below and we’ll run a free performance, SEO, and functionality audit, then tell you exactly how to fix
          what’s holding your site back.
        </p>
      </div>
      <form className="audit-popup-form" onSubmit={submit}>
        <Honeypot />
        <label>
          <span>Name</span>
          <input required name="name" type="text" autoComplete="name" />
        </label>
        <label>
          <span>Company (optional)</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>
        <label>
          <span>Email</span>
          <input required name="email" type="email" autoComplete="email" />
        </label>
        <label>
          <span>Phone</span>
          <input
            required
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            pattern="(?:[^\d]*\d){7,}[^\d]*"
            title="Enter a phone number with at least 7 digits."
          />
        </label>
        <label>
          <span>Website URL</span>
          {/* Plain text, not type="url": the browser would reject "mysite.com"
              without https:// and the visitor could not send the form.
              deliverLead adds the scheme. */}
          <input
            required
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck="false"
            placeholder="yourwebsite.com"
          />
        </label>
        <label className="audit-check">
          <input type="checkbox" name="newsletter" value="Yes" />
          <span>Yes, subscribe me to the Wavefront Studio newsletter for tips, updates, and offers.</span>
        </label>
        <SmsConsentField />
        {/* aria-disabled, not disabled: a disabled button drops keyboard focus. */}
        <button className="kinetic-button group" type="submit" aria-disabled={sending || undefined}>
          <span>{sending ? 'Sending…' : 'Get my free audit'}</span>
          <span className="button-island">
            <ArrowIcon className="size-4" />
          </span>
        </button>
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </Modal>
  )
}

const dealUtm = 'utm_source=site&utm_medium=popup&utm_campaign=bf2026'

// Only a real date goes in the headline: no timer and no places counter. The
// wording changes on Cyber Monday and on the last day because those are true.
function dealWords(phase) {
  if (phase === 'last') return { eyebrow: 'Last day', ends: 'These deals end tonight at 11:59 PM Eastern.' }
  if (phase === 'cyber') return { eyebrow: 'Cyber Monday', ends: 'These deals end tomorrow night, Tuesday, December 1 at 11:59 PM Eastern.' }
  return { eyebrow: 'Black Friday for contractors', ends: `These deals end ${HOLIDAY_WINDOW.endsLabel}.` }
}

// Each card adds a service that earns that deal to a fresh quote.
const dealCards = [
  { name: 'Build Deal', add: 'web', text: '20% off setup on a website, landing page, quote calculator or visualizer tool.' },
  { name: 'Leads Deal', add: 'lead', text: '20% off setup on our Lead Generation System.' },
  { name: 'Brand Deal', add: 'logo', text: '20% off logo, branding and print work.' },
  { name: '$1 Website', add: 'site1', text: 'Pick one of 15 designs and we build it for $1. Hosting is $99 a month, 12 month minimum.' },
]

function DealPopup({ open, onClose, phase }) {
  const words = dealWords(phase)
  return (
    <Modal open={open} onClose={onClose} labelledBy="deal-title" className="modal-deal">
      <div className="deal-head">
        <p className="deal-eyebrow">{words.eyebrow}</p>
        <h2 id="deal-title">Somebody is searching for your trade tonight. Get found first.</h2>
        <p>{words.ends} After that the prices go back to normal.</p>
      </div>
      <ul className="deal-list">
        {dealCards.map((card) => (
          <li key={card.name}>
            <a href={`/package-builder/?add=${card.add}&${dealUtm}&utm_content=popup-${card.add}`} onClick={onClose}>
              <strong>{card.name}</strong>
              <span>{card.text}</span>
              <em>Add to my quote</em>
            </a>
          </li>
        ))}
      </ul>
      <div className="deal-actions">
        <a className="kinetic-button group" href={`/package-builder/?${dealUtm}&utm_content=popup-quote`} onClick={onClose}>
          <span>Build my quote</span>
          <span className="button-island">
            <ArrowIcon className="size-4" />
          </span>
        </a>
        <a className="deal-link" href={`/free-website-audit/?${dealUtm}&utm_content=popup-audit`}>
          Get the free audit first
        </a>
      </div>
      <p className="deal-fine">Deals stack with our bundle discount, up to 25% off in total. We reply within two working days.</p>
    </Modal>
  )
}

function DealBanner({ onClose, phase }) {
  const words = dealWords(phase)
  return (
    <aside className="deal-banner" aria-label="Black Friday deals">
      <button className="deal-banner-close" type="button" onClick={onClose} aria-label="Dismiss deals banner">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <p className="deal-eyebrow">{words.eyebrow}</p>
      <p className="deal-banner-text">20% off websites, calculators, lead generation and branding.</p>
      <a className="deal-banner-cta" href={`/package-builder/?${dealUtm}&utm_content=banner-quote`}>
        See the deals and build a quote
      </a>
    </aside>
  )
}

// Pages that must stay readable with nothing overlaying them. /platform/ is the
// public app home page Google's OAuth reviewers open logged out, and Meta's
// reviewers check /data-deletion/, so no modal may cover either. The rest
// already ask for the visitor's details, and a second form on top of the
// first only gets in the way.
const noPopupPaths = new Set(['/platform', '/data-deletion', '/contact', '/free-website-audit', '/free-setup', '/package-builder'])
// The $1 Website pages hold an intake form and full page previews, so no popup covers them.
const noPopupPrefixes = ['/1-dollar-website']

export default function SitePopups() {
  const path = useCurrentPath()
  const [open, setOpen] = useState(false)
  const [dealOpen, setDealOpen] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)
  // Decided in the browser: the page is prerendered at build time, outside the sale.
  const [phase, setPhase] = useState(null)
  const suppressed = noPopupPaths.has(path) || noPopupPrefixes.some((prefix) => path.startsWith(prefix))

  useEffect(() => {
    setPhase(holidayDealActive() ? holidayDayPhase() : null)
  }, [])

  // During the sale the deals replace the audit exit popup, so nobody gets two.
  useEffect(() => {
    if (suppressed || phase) return undefined
    const done = () => seen('wf-audit') || dismissed('wf-audit-dismissed') || dismissed('wf-lead-sent')
    if (done()) return undefined

    const onLeave = (event) => {
      if (event.clientY > 0 || done()) return
      markSeen('wf-audit')
      setOpen(true)
    }

    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [suppressed, phase])

  // The deals popup shows once per visit after a short wait. The slide-in
  // banner follows it for the rest of the visit, until it is dismissed.
  useEffect(() => {
    if (suppressed || !phase) return undefined
    const timers = []
    if (!seen('wf-bf-popup') && !dismissed('wf-bf-popup-dismissed')) {
      timers.push(
        window.setTimeout(() => {
          markSeen('wf-bf-popup')
          setDealOpen(true)
        }, 7000),
      )
    } else if (!seen('wf-bf-banner-closed')) {
      timers.push(window.setTimeout(() => setBannerOpen(true), 2500))
    }
    return () => timers.forEach(window.clearTimeout)
  }, [suppressed, phase])

  const closePermanently = () => {
    markDismissed('wf-audit-dismissed')
    setOpen(false)
  }

  const closeDeal = () => {
    markDismissed('wf-bf-popup-dismissed')
    setDealOpen(false)
    if (!seen('wf-bf-banner-closed')) setBannerOpen(true)
  }

  const closeBanner = () => {
    markSeen('wf-bf-banner-closed')
    setBannerOpen(false)
  }

  return (
    <>
      <AuditPopup open={open} onClose={closePermanently} />
      <DealPopup open={dealOpen} onClose={closeDeal} phase={phase} />
      {bannerOpen && !dealOpen && phase ? <DealBanner onClose={closeBanner} phase={phase} /> : null}
    </>
  )
}
