import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { FaqAccordion, Honeypot, SmsConsentField } from '../components/shared.jsx'
import { contact } from '../data/site.js'
import { ONE_DOLLAR } from '../data/oneDollarSite.js'
import { ONE_DOLLAR_FAQ } from '../data/oneDollarPage.js'
import { oneDollarSeo } from '../data/oneDollarSeo.js'
import { ONE_DOLLAR_TERMS_PATH, ONE_DOLLAR_TERMS_VERSION } from '../data/oneDollarTerms.js'
import { deliverLead } from '../formSubmission.js'
import { OneDollarDeadline, OneDollarEnded, useOneDollarEnded } from '../components/OneDollarDeal.jsx'
import { TEMPLATES, thumbSrcSet, thumbUrl } from '../templates/list.js'
import { track } from '../oneDollarTrack.js'

const money = (n) => `$${n.toLocaleString('en-US')}`
const label = (template) => `${template.name} (${template.style})`
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const STEPS = [
  'Pick one of the 15 designs below.',
  'Send your details in the form.',
  'We reply within two working days and build your site from your details.',
  'You approve the preview and we put it live. Hosting starts that day.',
]

const INCLUDED = [
  'Up to 5 pages: Home, Services, About, Gallery and Contact',
  'Your words, photos, logo and colors in the design you picked',
  'Works on phones, tablets and computers',
  'A contact form that sends enquiries to your email',
  'Secure hosting with a security certificate',
  'Your own domain connected, if you have one',
]

const NOT_INCLUDED = [
  'A different layout. The design stays as you see it in the preview.',
  `Writing your text. We can add it for ${money(120)} a page.`,
  `More than 5 pages. Extra pages are ${money(150)} each.`,
  'The domain name fee, which is paid to the company you register it with.',
  'SEO, ads, social media, branding and every other service. Each one is priced separately and starts only after you accept a written quote.',
]

const FIRST_YEAR = `${money(ONE_DOLLAR.setup)} to set up. Hosting is ${money(ONE_DOLLAR.hosting)} a month for at least ${ONE_DOLLAR.minMonths} months, so ${money(ONE_DOLLAR.minTotal)} the first year, then ${money(ONE_DOLLAR.regularHosting)} a month.`

// Moves the person up to the hero form and into the first required box still empty.
function goToForm(formEl) {
  if (!formEl) return
  formEl.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const fields = formEl.querySelectorAll('form [required]')
  for (const field of fields) {
    if (field.name === 'template' || field.type === 'checkbox') continue
    if (!field.value) {
      field.focus({ preventScroll: true })
      return
    }
  }
}

function Intake({ chosen, onChoose, onDone }) {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const formEl = useRef(null)
  const started = useRef(false)
  const thanks = useRef(null)
  const picked = TEMPLATES.find((template) => label(template) === chosen)

  // The browser's own checks stay in charge. We only count which boxes failed.
  useEffect(() => {
    const form = formEl.current
    if (!form) return undefined
    const onInvalid = (event) => track('od_field_error', { field: event.target.name || 'unknown' })
    form.addEventListener('invalid', onInvalid, true)
    return () => form.removeEventListener('invalid', onInvalid, true)
  }, [done])

  useEffect(() => {
    if (done) thanks.current?.focus()
  }, [done])

  function begin() {
    if (started.current) return
    started.current = true
    track('od_form_start')
  }

  async function submit(event) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setStatus('Sending…')
    try {
      await deliverLead(event.currentTarget, {
        subject: '$1 Website intake',
        source: 'one-dollar-website',
        fields: [
          ['Template', 'template'],
          ['Name', 'name'],
          ['Business', 'company'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['Current site or domain', 'website'],
          ['Address', 'address'],
          ['Hours', 'hours'],
          ['What the business does', 'about'],
          ['Services', 'services'],
          ['Colors or style', 'colors'],
          ['Link to logo and photos', 'assets'],
          ['Anything else', 'notes'],
          ['Agreed to the $1 Website Agreement', 'agree'],
          ['Agreement version', null, ONE_DOLLAR_TERMS_VERSION],
          ['Agreed at (UTC)', null, new Date().toISOString()],
        ],
      })
      track('od_form_submit_success', { template: chosen })
      setDone(true)
      onDone?.()
    } catch {
      track('od_form_submit_fail')
      setStatus(`We could not send that. Please email ${contact.email}.`)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="one-dollar-thanks">
        <h3 ref={thanks} tabIndex={-1}>Thanks, your details are in.</h3>
        <p>We reply within two working days with an invoice for the $1 setup and a go-live date. Keep an eye on your email and check the spam folder if nothing arrives.</p>
        {picked ? <a className="text-link" href={`/1-dollar-website/${picked.slug}/`}>Look at the {picked.name} preview again</a> : null}
      </div>
    )
  }

  return (
    <form ref={formEl} className="enquiry-form one-dollar-form" onSubmit={submit} onInput={begin}>
      <Honeypot />
      <label className="wide">
        <span>Template you picked</span>
        <select required name="template" value={chosen} onChange={(event) => onChoose(event.target.value)}>
          <option value="">Choose a template</option>
          {TEMPLATES.map((template) => (
            <option key={template.slug} value={label(template)}>
              {template.name}: {template.style}
            </option>
          ))}
        </select>
      </label>
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
        <span>What does your business do?</span>
        <textarea required name="about" rows="4" placeholder="A few sentences in your own words. Who you help and what makes you different." />
      </label>
      <details className="wide one-dollar-more">
        <summary>Add more detail (optional)</summary>
        <div className="one-dollar-more-grid">
          <label className="wide">
            <span>Your services</span>
            <textarea name="services" rows="4" placeholder="One per line, with a short description if you like." />
          </label>
          <label>
            <span>Opening hours</span>
            <textarea name="hours" rows="3" placeholder="Mon to Fri: 8am to 5pm" />
          </label>
          <label>
            <span>Colors or style you like</span>
            <textarea name="colors" rows="3" placeholder="Your logo colors, or a site you like." />
          </label>
          <label>
            <span>Your domain or current website</span>
            <input name="website" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="yourbusiness.com" />
          </label>
          <label>
            <span>Business address</span>
            <input name="address" type="text" autoComplete="street-address" />
          </label>
          <label className="wide">
            <span>Link to your logo and photos</span>
            <input name="assets" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="A Google Drive, Dropbox or similar link" />
          </label>
          <label className="wide">
            <span>Anything else we should know</span>
            <textarea name="notes" rows="3" />
          </label>
        </div>
      </details>
      <SmsConsentField />
      <p className="wide one-dollar-disclosure">
        You pay {money(ONE_DOLLAR.setup)} to set up. Hosting is {money(ONE_DOLLAR.hosting)} a month for at least {ONE_DOLLAR.minMonths} months, which is {money(ONE_DOLLAR.minTotal)} for the first year. If you cancel before month {ONE_DOLLAR.minMonths}, the remaining months are due. From month {ONE_DOLLAR.minMonths + 1} hosting is {money(ONE_DOLLAR.regularHosting)} a month.
      </p>
      <label className="audit-check wide">
        <input required type="checkbox" name="agree" value="Yes" />
        <span>
          I have read and agree to the <a href={ONE_DOLLAR_TERMS_PATH} target="_blank" rel="noopener">$1 Website Agreement</a>. Setup is {money(ONE_DOLLAR.setup)}. Hosting is {money(ONE_DOLLAR.hosting)} a month with a {ONE_DOLLAR.minMonths} month minimum ({money(ONE_DOLLAR.minTotal)} for the first year), then {money(ONE_DOLLAR.regularHosting)} a month from month {ONE_DOLLAR.minMonths + 1}. The design and code stay with Wavefront Studio. SEO and every other service cost extra and start only after I accept a written quote.
        </span>
      </label>
      <p className="wide one-dollar-send-note">We reply within two working days, invoice the {money(ONE_DOLLAR.setup)} and give you a go-live date. Nothing to pay on this page.</p>
      {/* aria-disabled, not disabled: a disabled button drops keyboard focus. */}
      <button className="kinetic-button group" type="submit" aria-disabled={sending || undefined}>
        <span>{sending ? 'Sending…' : 'Lock in my $1 website'}</span>
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

export default function OneDollarWebsite() {
  const [chosen, setChosen] = useState('')
  const [formInView, setFormInView] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)
  const ended = useOneDollarEnded()

  // /1-dollar-website/?template=atlas arrives with that template already picked.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('template')
    const found = TEMPLATES.find((template) => template.slug === slug)
    if (found) setChosen(label(found))
  }, [])

  // The phone bar steps aside while the form is on screen or the menu or chat is open.
  useEffect(() => {
    const form = formRef.current
    if (!form || ended) return undefined
    const watcher = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.05 })
    watcher.observe(form)
    const readBody = () => setOverlay(document.body.classList.contains('menu-open') || document.body.classList.contains('chat-open'))
    readBody()
    const classes = new MutationObserver(readBody)
    classes.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => {
      watcher.disconnect()
      classes.disconnect()
    }
  }, [ended])

  const showSticky = !ended && !formInView && !overlay && !sent
  useEffect(() => {
    document.body.classList.toggle('od-sticky', showSticky)
    return () => document.body.classList.remove('od-sticky')
  }, [showSticky])

  function pick(template) {
    setChosen(label(template))
    track('od_pick_design', { template: template.slug })
    goToForm(formRef.current)
  }

  function stickyClick(event) {
    track('od_sticky_cta_click', { picked: Boolean(chosen) })
    if (chosen) {
      event.preventDefault()
      goToForm(formRef.current)
    }
  }

  return (
    <Layout className="one-dollar-page" seo={oneDollarSeo({ ended: Boolean(ended) })}>
      {ended ? (
        <section className="offer-hero one-dollar-hero">
          <div className="page-frame">
            <OneDollarEnded Heading="h1" />
          </div>
        </section>
      ) : (
      <>
      <section className="offer-hero one-dollar-hero">
        <div className="page-frame one-dollar-hero-grid">
          <div className="one-dollar-copy">
            <h1>A real website for $1.</h1>
            <p className="one-dollar-lede">
              Pick one of 15 designs. We build it from your details. Then {money(ONE_DOLLAR.hosting)} a month hosting, {ONE_DOLLAR.minMonths} month minimum. Black Friday only.
            </p>
            <div className="one-dollar-actions">
              <a className="kinetic-button group" href="#designs">
                <span>Pick my design</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
            </div>
            <p className="one-dollar-total">
              {FIRST_YEAR} <a href={ONE_DOLLAR_TERMS_PATH}>Read the $1 Website Agreement</a>
            </p>
          </div>
          <div className="one-dollar-formcard" id="start" ref={formRef}>
            <h2>Send us your details</h2>
            {chosen && !sent ? (
              <p className="one-dollar-picked" role="status">
                You picked {TEMPLATES.find((template) => label(template) === chosen)?.name}. Next: send your details.
              </p>
            ) : null}
            <Intake chosen={chosen} onChoose={setChosen} onDone={() => setSent(true)} />
          </div>
          <div className="one-dollar-deadline-slot">
            <OneDollarDeadline />
          </div>
        </div>
      </section>

      <section className="one-dollar-steps-wrap">
        <div className="page-frame">
          <ol className="one-dollar-steps" aria-label="How it works">
            {STEPS.map((text, index) => (
              <li key={text}>
                <span aria-hidden="true">{index + 1}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="one-dollar-section" id="designs">
        <div className="page-frame">
          <h2>Pick your design</h2>
          <p className="one-dollar-intro">Every design is a full five page website, and any of them works for any business. Open a preview and click through Home, Services, About, Gallery and Contact.</p>
          <ul className="one-dollar-grid">
            {TEMPLATES.map((template) => {
              const isPicked = chosen === label(template)
              return (
                <li key={template.slug} className={isPicked ? 'is-picked' : undefined}>
                  <a className="one-dollar-shot" href={`/1-dollar-website/${template.slug}/`} onClick={() => track('od_preview_open', { template: template.slug })}>
                    <img
                      src={thumbUrl(template.slug)}
                      srcSet={thumbSrcSet(template.slug)}
                      sizes="(max-width: 760px) calc(50vw - 24px), 360px"
                      alt={`${template.name} website template, ${template.style.toLowerCase()}`}
                      width="1200"
                      height="900"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <div className="one-dollar-card-body">
                    <h3>
                      <a href={`/1-dollar-website/${template.slug}/`} onClick={() => track('od_preview_open', { template: template.slug })}>
                        {template.name}
                      </a>
                    </h3>
                    <p>{template.style}</p>
                  </div>
                  <button className="one-dollar-pick" type="button" aria-pressed={isPicked} onClick={() => pick(template)}>
                    Pick {template.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="one-dollar-section">
        <div className="page-frame one-dollar-split">
          <div>
            <h2>What you get</h2>
            <ul className="tick-list">
              {INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>What costs extra</h2>
            <ul className="tick-list is-muted">
              {NOT_INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="one-dollar-terms-link">
              <a href={ONE_DOLLAR_TERMS_PATH}>Read the full agreement and starting prices</a> or <a href="/package-builder/">price anything else in the package builder</a>.
            </p>
          </div>
        </div>
      </section>

      <FaqAccordion items={ONE_DOLLAR_FAQ} heading={{ title: 'Questions about the $1 website' }} />

      <a className={`od-sticky-bar${showSticky ? ' is-shown' : ''}`} href={chosen ? '#start' : '#designs'} onClick={stickyClick} tabIndex={showSticky ? undefined : -1} aria-hidden={showSticky ? undefined : true}>
        {chosen ? 'Send my details' : 'Pick my design'}
        <ArrowIcon className="size-4" />
      </a>
      </>
      )}
    </Layout>
  )
}
