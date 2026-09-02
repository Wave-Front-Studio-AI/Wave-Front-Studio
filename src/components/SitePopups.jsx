import { useEffect, useRef, useState } from 'react'
import { ArrowIcon } from './Icons.jsx'
import { contact } from '../data/site.js'
import { deliverLead } from '../formSubmission.js'
import { useCurrentPath } from '../routeContext.js'

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
    panel.current?.querySelector('button, input, a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-scrim" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`modal-panel ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={panel}>
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

  async function submit(event) {
    event.preventDefault()
    setStatus('Sending…')
    try {
      const result = await deliverLead(event.currentTarget, {
        subject: 'Free website performance audit request',
        source: 'audit-popup',
        fields: [
          ['Name', 'name'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['Website URL', 'website'],
          ['Newsletter', 'newsletter'],
        ],
      })
      setStatus(result === 'submitted' ? 'Thanks — your audit request is in.' : 'Your email app is ready. Review it, then send.')
    } catch {
      setStatus(`We could not send that. Please email ${contact.email}.`)
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="audit-title" className="modal-audit">
      <div className="audit-head">
        <span className="eyebrow">Free audit</span>
        <h2 id="audit-title">Get Your FREE Website Performance Audit</h2>
        <p>
          Enter your website URL below and we’ll run a free performance, SEO, and functionality audit — plus tell you exactly how to fix
          what’s holding your site back.
        </p>
      </div>
      <form className="audit-popup-form" onSubmit={submit}>
        <label>
          <span>Name</span>
          <input required name="name" type="text" autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input required name="email" type="email" autoComplete="email" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          <span>Website URL</span>
          <input required name="website" type="url" placeholder="https://" />
        </label>
        <label className="audit-check">
          <input type="checkbox" name="newsletter" value="Yes" />
          <span>Yes, subscribe me to the Wavefront Studio newsletter for tips, updates, and offers.</span>
        </label>
        <button className="kinetic-button group" type="submit">
          <span>Get My Free Audit</span>
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

// Pages that must stay readable with nothing overlaying them. /platform/ is the
// public app home page Google's OAuth reviewers open logged out, so no modal may
// cover it.
const noPopupPaths = new Set(['/platform'])

export default function SitePopups() {
  const path = useCurrentPath()
  const [open, setOpen] = useState(false)
  const suppressed = noPopupPaths.has(path)

  useEffect(() => {
    if (suppressed) return undefined
    if (seen('wf-audit') || dismissed('wf-audit-dismissed')) return undefined

    const onLeave = (event) => {
      if (event.clientY > 0 || seen('wf-audit') || dismissed('wf-audit-dismissed')) return
      markSeen('wf-audit')
      setOpen(true)
    }

    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [suppressed])

  const closePermanently = () => {
    markDismissed('wf-audit-dismissed')
    setOpen(false)
  }

  return <AuditPopup open={open} onClose={closePermanently} />
}
