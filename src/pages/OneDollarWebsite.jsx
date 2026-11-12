import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { Breadcrumbs, FaqAccordion, Honeypot, SmsConsentField } from '../components/shared.jsx'
import { contact } from '../data/site.js'
import { ONE_DOLLAR } from '../data/oneDollarSite.js'
import { deliverLead } from '../formSubmission.js'
import { TEMPLATES, thumbUrl } from '../templates/list.js'

const money = (n) => `$${n.toLocaleString('en-US')}`

const STEPS = [
  ['Pick a template', 'Look through all 15 and click through the five pages of any of them. Any template works for any business.'],
  ['Send your details', 'Your business name, services, hours, photos and logo go in one form below.'],
  ['We build it', 'We put your information into the design and send you a link to look over. We reply within two working days.'],
  ['Go live', `When you say it looks right, we publish it on our hosting. Hosting starts at ${money(ONE_DOLLAR.hosting)} a month from that day.`],
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
]

const FAQ = [
  ['Will a template work for my kind of business?', 'Yes. The templates are styles, not industries. Any of the 15 works for a contractor, a clinic, a salon, a shop or an office. We swap in your services, photos, colors and words so it reads as your business.'],
  ['Why is the setup only $1?', `The setup is $1 because the money comes from hosting. Hosting is ${money(ONE_DOLLAR.hosting)} a month and runs for at least ${ONE_DOLLAR.minMonths} months, so the first year comes to ${money(ONE_DOLLAR.minTotal)}. We would rather you see the whole price up front than find it later.`],
  ['What does the 12 month minimum mean?', `Hosting runs for at least ${ONE_DOLLAR.minMonths} months from the day your site goes live. If you cancel before month ${ONE_DOLLAR.minMonths}, the remaining months of hosting are due. After that you can cancel any time by telling us in writing.`],
  ['Who owns the site?', 'You own your text, photos, logo and domain. The design and the code that runs your site stay with Wavefront Studio, which is how we can build it for $1. If you leave, we send you your text and photos.'],
  ['What happens if I stop paying for hosting?', 'We write to you first. If hosting stays unpaid after that notice, the site comes down. You still keep your domain, your text and your photos, and we send them to you on request.'],
  ['Can I change the design?', 'You pick colors, text, photos and your logo. The layout of the design stays as you saw it in the preview. If you want a different layout, our other website packages start from a custom design.'],
  ['Can I add more pages later?', `Yes. Each extra page is ${money(150)}. We can also write the text for ${money(120)} a page.`],
  ['Can I use my own domain?', 'Yes. Tell us the domain and we connect it. If you do not have one, we can help you choose and register one. The fee goes to the registrar, not to us.'],
  ['Can I get this with other services?', 'Yes. Add it to a quote in our package builder next to anything else you need. The $1 website does not count toward bundle discounts or sale deals, and the other services in the quote are priced as normal.'],
  ['How soon will I hear back?', 'We reply within two working days. When we reply we tell you when your preview will be ready.'],
]

function Intake({ chosen, onChoose }) {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

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
          ['Agreed to terms', 'agree'],
        ],
      })
      setStatus('Thanks, your details are in. We reply within two working days.')
    } catch {
      setStatus(`We could not send that. Please email ${contact.email}.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="enquiry-form one-dollar-form" onSubmit={submit}>
      <Honeypot />
      <label className="wide">
        <span>Template you picked</span>
        <select required name="template" value={chosen} onChange={(event) => onChoose(event.target.value)}>
          <option value="">Choose a template</option>
          {TEMPLATES.map((template) => (
            <option key={template.slug} value={`${template.name} (${template.style})`}>
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
      <label>
        <span>Your domain or current website (optional)</span>
        <input name="website" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="yourbusiness.com" />
      </label>
      <label>
        <span>Business address (optional)</span>
        <input name="address" type="text" autoComplete="street-address" />
      </label>
      <label className="wide">
        <span>What does your business do?</span>
        <textarea required name="about" rows="4" placeholder="A few sentences in your own words. Who you help and what makes you different." />
      </label>
      <label className="wide">
        <span>Your services</span>
        <textarea required name="services" rows="4" placeholder="One per line, with a short description if you like." />
      </label>
      <label>
        <span>Opening hours</span>
        <textarea name="hours" rows="3" placeholder="Mon to Fri: 8am to 5pm" />
      </label>
      <label>
        <span>Colors or style you like (optional)</span>
        <textarea name="colors" rows="3" placeholder="Your logo colors, or a site you like." />
      </label>
      <label className="wide">
        <span>Link to your logo and photos</span>
        <input name="assets" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="A Google Drive, Dropbox or similar link" />
      </label>
      <label className="wide">
        <span>Anything else we should know (optional)</span>
        <textarea name="notes" rows="3" />
      </label>
      <SmsConsentField />
      <label className="audit-check wide">
        <input required type="checkbox" name="agree" value="Yes" />
        <span>
          I understand the setup is {money(ONE_DOLLAR.setup)}, hosting is {money(ONE_DOLLAR.hosting)} a month with a {ONE_DOLLAR.minMonths} month minimum ({money(ONE_DOLLAR.minTotal)} for the first year), and the design and code stay with Wavefront Studio.
        </span>
      </label>
      {/* aria-disabled, not disabled: a disabled button drops keyboard focus. */}
      <button className="kinetic-button group" type="submit" aria-disabled={sending || undefined}>
        <span>{sending ? 'Sending…' : 'Send my details'}</span>
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
  const formRef = useRef(null)

  // /1-dollar-website/?template=atlas arrives with that template already picked.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('template')
    const found = TEMPLATES.find((template) => template.slug === slug)
    if (found) setChosen(`${found.name} (${found.style})`)
  }, [])

  function pick(template) {
    setChosen(`${template.name} (${template.style})`)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Layout
      className="one-dollar-page"
      seo={{
        title: '$1 Website: Pick a Design, We Build It | Wavefront Studio',
        description: `A five page website for ${money(ONE_DOLLAR.setup)} to set up. Pick one of 15 templates and send your details. Hosting is ${money(ONE_DOLLAR.hosting)} a month, 12 month minimum.`,
        canonical: '/1-dollar-website/',
      }}
    >
      <section className="offer-hero one-dollar-hero">
        <div className="page-frame">
          <Breadcrumbs trail={[['Home', '/'], ['$1 Website', '/1-dollar-website/']]} />
          <p className="eyebrow-label">The $1 Website</p>
          <h1>A real website for $1 to start.</h1>
          <p className="one-dollar-lede">
            Pick one of 15 templates. Send us your details and we build your site with your words, photos and logo. Hosting is {money(ONE_DOLLAR.hosting)} a month.
          </p>
          <dl className="one-dollar-price" aria-label="Price">
            <div>
              <dt>To set up</dt>
              <dd>{money(ONE_DOLLAR.setup)}</dd>
            </div>
            <div>
              <dt>Hosting</dt>
              <dd>
                {money(ONE_DOLLAR.hosting)}
                <small> a month</small>
              </dd>
            </div>
            <div>
              <dt>Minimum</dt>
              <dd>
                {ONE_DOLLAR.minMonths}
                <small> months</small>
              </dd>
            </div>
          </dl>
          <p className="one-dollar-total">That is {money(ONE_DOLLAR.minTotal)} for the first year, hosting included.</p>
          <div className="one-dollar-actions">
            <a className="kinetic-button group" href="#designs">
              <span>See the 15 templates</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </a>
            <a className="text-link" href="#start">
              Send my details
            </a>
          </div>
        </div>
      </section>

      <section className="one-dollar-section">
        <div className="page-frame">
          <h2>How it works</h2>
          <ol className="one-dollar-steps">
            {STEPS.map(([title, text], index) => (
              <li key={title}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="one-dollar-section" id="designs">
        <div className="page-frame">
          <h2>Pick your template</h2>
          <p className="one-dollar-intro">Every template is a full five page website, and any of them works for any business. Open a preview and click through Home, Services, About, Gallery and Contact.</p>
          <ul className="one-dollar-grid">
            {TEMPLATES.map((template) => (
              <li key={template.slug}>
                <a className="one-dollar-shot" href={`/1-dollar-website/${template.slug}/`} aria-label={`Preview the ${template.name} template`}>
                  <img src={thumbUrl(template.slug)} alt="" width="1200" height="900" loading="lazy" decoding="async" />
                </a>
                <div className="one-dollar-card-body">
                  <h3>{template.name}</h3>
                  <p>{template.style}</p>
                  <div className="one-dollar-card-actions">
                    <a href={`/1-dollar-website/${template.slug}/`}>Preview</a>
                    <button type="button" onClick={() => pick(template)}>
                      Pick this one
                    </button>
                  </div>
                </div>
              </li>
            ))}
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
          </div>
        </div>
      </section>

      <section className="one-dollar-section" id="start" ref={formRef}>
        <div className="page-frame one-dollar-formwrap">
          <h2>Send us your details</h2>
          <p className="one-dollar-intro">
            Fill this in once and we build from it. We reply within two working days, and we invoice the {money(ONE_DOLLAR.setup)} setup when we confirm your design.
          </p>
          <Intake chosen={chosen} onChoose={setChosen} />
        </div>
      </section>

      <FaqAccordion items={FAQ} heading={{ title: 'Questions about the $1 website' }} />
    </Layout>
  )
}
