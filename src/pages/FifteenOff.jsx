import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { FaqAccordion, Honeypot, SmsConsentField } from '../components/shared.jsx'
import { contact } from '../data/site.js'
import { FIFTEEN_OFF_CHOICES, FIFTEEN_OFF_ENDS, FIFTEEN_OFF_FAQ, FIFTEEN_OFF_SERVICES, FIFTEEN_OFF_STEPS } from '../data/fifteenOffPage.js'
import { fifteenOffSeo } from '../data/fifteenOffSeo.js'
import { deliverLead } from '../formSubmission.js'
import { OneDollarDeadline, useOneDollarEnded } from '../components/OneDollarDeal.jsx'
import { track } from '../oneDollarTrack.js'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Moves the person to the form and into the first required box still empty.
function goToForm(formEl) {
  if (!formEl) return
  formEl.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const radios = formEl.querySelectorAll('form input[type="radio"]')
  if (radios.length && ![...radios].some((radio) => radio.checked)) {
    radios[0].focus({ preventScroll: true })
    return
  }
  for (const field of formEl.querySelectorAll('form [required]')) {
    if (field.type === 'radio' || field.type === 'checkbox') continue
    if (!field.value) {
      field.focus({ preventScroll: true })
      return
    }
  }
}

function Request({ onDone }) {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const formEl = useRef(null)
  const started = useRef(false)
  const thanks = useRef(null)

  // The browser's own checks stay in charge. We only count which boxes failed.
  useEffect(() => {
    const form = formEl.current
    if (!form) return undefined
    const onInvalid = (event) => track('fo_field_error', { field: event.target.name || 'unknown' })
    form.addEventListener('invalid', onInvalid, true)
    return () => form.removeEventListener('invalid', onInvalid, true)
  }, [done])

  useEffect(() => {
    if (done) thanks.current?.focus()
  }, [done])

  function begin() {
    if (started.current) return
    started.current = true
    track('fo_form_start')
  }

  async function submit(event) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setStatus('Sending…')
    const need = new FormData(event.currentTarget).get('need')
    try {
      await deliverLead(event.currentTarget, {
        subject: '15% off ads management and brand design request',
        source: 'fifteen-off',
        fields: [
          ['Needs', 'need'],
          ['Name', 'name'],
          ['Business', 'company'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['What they want help with', 'about'],
          ['Website', 'website'],
          ['Current ad platforms', 'platforms'],
          ['Budget notes', 'budget'],
          ['Offer', null, '15% off first 3 months, Black Friday'],
        ],
      })
      track('fo_form_submit_success', { need })
      setDone(true)
      onDone?.()
    } catch {
      track('fo_form_submit_fail')
      setStatus(`We could not send that. Please email ${contact.email}.`)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="fifteen-off-thanks">
        <h3 ref={thanks} tabIndex={-1}>Thanks, your request is in.</h3>
        <p>We reply within two working days with a quote at 15% off. Keep an eye on your email and check the spam folder if nothing arrives.</p>
      </div>
    )
  }

  return (
    <form ref={formEl} className="enquiry-form fifteen-off-form" onSubmit={submit} onInput={begin}>
      <Honeypot />
      <fieldset className="wide fifteen-off-choices">
        <legend>What do you need?</legend>
        {FIFTEEN_OFF_CHOICES.map((choice, index) => (
          <label key={choice.value} className="fifteen-off-choice">
            <input type="radio" name="need" value={choice.value} required={index === 0} onChange={() => track('fo_pick_service', { need: choice.value })} />
            <span>
              <b>{choice.value}</b>
              <small>{choice.note}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <label>
        <span>Your name</span>
        <input required name="name" type="text" autoComplete="name" />
      </label>
      <label>
        <span>Business name</span>
        <input required name="company" type="text" autoComplete="organization" />
      </label>
      <label>
        <span>Email</span>
        <input required name="email" type="email" autoComplete="email" />
      </label>
      <label>
        <span>Phone</span>
        <input required name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="(?:[^\d]*\d){7,}[^\d]*" title="Enter a phone number with at least 7 digits." />
      </label>
      <label className="wide">
        <span>What do you want help with?</span>
        <textarea required name="about" rows="4" placeholder="A few sentences in your own words." />
      </label>
      <details className="wide fifteen-off-more">
        <summary>Add more detail (optional)</summary>
        <div className="fifteen-off-more-grid">
          <label className="wide">
            <span>Your website</span>
            <input name="website" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="yourbusiness.com" />
          </label>
          <label className="wide">
            <span>Ad platforms you use now</span>
            <input name="platforms" type="text" placeholder="Google Ads, Facebook, none yet" />
          </label>
          <label className="wide">
            <span>Budget notes</span>
            <textarea name="budget" rows="3" />
          </label>
        </div>
      </details>
      <SmsConsentField />
      <p className="wide fifteen-off-send-note">We reply within two working days with a quote at 15% off. Nothing to pay on this page.</p>
      {/* aria-disabled, not disabled: a disabled button drops keyboard focus. */}
      <button className="kinetic-button group" type="submit" aria-disabled={sending || undefined}>
        <span>{sending ? 'Sending…' : 'Get my 15% off quote'}</span>
        <span className="button-island">
          <ArrowIcon className="size-4" />
        </span>
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  )
}

function Ended() {
  return (
    <div className="fifteen-off-ended">
      <h1>The 15% off offer has ended.</h1>
      <p>The offer ran through Black Friday and closed on December 1. You can still ask us about paid ads management or brand design. Send a request and we reply within two working days.</p>
      <div className="fifteen-off-actions">
        <a className="kinetic-button group" href="/contact/">
          <span>Talk to us</span>
        </a>
        <a className="text-link" href="/services/">
          See all services
        </a>
      </div>
    </div>
  )
}

export default function FifteenOff() {
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)
  const ended = useOneDollarEnded()

  return (
    <Layout className="fifteen-off-page" seo={fifteenOffSeo({ ended: Boolean(ended) })}>
      {ended ? (
        <section className="offer-hero fifteen-off-hero">
          <div className="page-frame">
            <Ended />
          </div>
        </section>
      ) : (
        <>
          <section className="offer-hero fifteen-off-hero">
            <div className="page-frame fifteen-off-hero-grid">
              <div className="fifteen-off-copy">
                <h1>15% off ads management and brand design.</h1>
                <p className="fifteen-off-lede">
                  Paid ads management and brand design at 15% off for your first 3 months. Tell us what you need and we send a quote. Black Friday only.
                </p>
                <div className="fifteen-off-actions">
                  <a
                    className="kinetic-button group"
                    href="#start"
                    onClick={(event) => {
                      track('fo_cta_click')
                      if (!sent) {
                        event.preventDefault()
                        goToForm(formRef.current)
                      }
                    }}
                  >
                    <span>Claim my 15% off</span>
                    <span className="button-island">
                      <ArrowIcon className="size-4" />
                    </span>
                  </a>
                </div>
                <p className="fifteen-off-total">15% off paid ads management and brand design for your first 3 months. Ends {FIFTEEN_OFF_ENDS}.</p>
              </div>
              <div className="fifteen-off-formcard" id="start" ref={formRef}>
                <h2>Tell us what you need</h2>
                <Request onDone={() => setSent(true)} />
              </div>
              <div className="fifteen-off-deadline-slot">
                <OneDollarDeadline label="Time left on the 15% off offer" />
              </div>
              <div className="fifteen-off-how">
                <h2>How it works</h2>
                <ol className="fifteen-off-steps">
                  {FIFTEEN_OFF_STEPS.map((text, index) => (
                    <li key={text}>
                      <span aria-hidden="true">{index + 1}</span>
                      <p>{text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="fifteen-off-section">
            <div className="page-frame fifteen-off-split">
              {FIFTEEN_OFF_SERVICES.map((item) => (
                <div key={item.id}>
                  <h2>{item.title}</h2>
                  <p className="fifteen-off-intro">{item.summary}</p>
                  <ul className="tick-list">
                    {item.covers.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="fifteen-off-more-link">
                    <a href={item.href}>{item.linkLabel}</a>
                  </p>
                </div>
              ))}
            </div>
          </section>

          <FaqAccordion items={FIFTEEN_OFF_FAQ} heading={{ title: 'Questions about the 15% off offer' }} />
        </>
      )}
    </Layout>
  )
}
