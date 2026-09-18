import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, FaqAccordion, SectionHeading } from '../components/shared.jsx'
import { contact, testimonials } from '../data/site.js'
import { freeSetupFaqs as FAQ } from '../data/faqs.js'
import { deliverLead } from '../formSubmission.js'

// The single number the live page exposes for editing.
const PLACES_TOTAL = 5
const PLACES_LEFT = 5

const COVERED = [
  {
    title: 'AI Chatbot & Business Automation',
    copy: 'Website chatbot, unified inbox across email/social/SMS/WhatsApp, automated follow-up sequences, CRM pipeline, review automation and reporting dashboards.',
    setup: 'Build, training on your services and pricing, integration with your existing channels, and go-live configuration.',
    href: '/ai-chatbot/',
  },
  {
    title: 'Web Development',
    copy: 'Custom-built, fully responsive, SEO-structured websites, including e-commerce, multi-site ecosystems and CMS integration.',
    setup: 'Discovery, architecture, design system setup and staging environment.',
    href: '/web-development/',
  },
  {
    title: 'Website SEO',
    copy: 'Technical audit and fixes, keyword and competitor research, on-page optimisation, local SEO and Google Business profile work.',
    setup: 'Full technical audit, keyword research, Search Console setup and the initial fix list.',
    href: '/seo-service/',
  },
]

const OTHER_SERVICES = [
  ['Mobile App Development', '/mobile-app-development/'],
  ['Social Media Strategy', '/social-media-strategy/'],
  ['Graphic Design', '/graphic-design/'],
  ['Digital Marketing', '/digital-marketing/'],
  ['Live Visualizer', '/live-visualizer/'],
  ['Custom Calculators', '/custom-calculators/'],
]

const TERMS = [
  'Free setup applies to AI Chatbot & Business Automation, Web Development and Website SEO only.',
  'The waived amount is the one-off setup/onboarding fee. Monthly subscription and project fees still apply and are quoted separately in writing.',
  '5 places per calendar quarter in total, across all three services combined, not 5 per service.',
  'A place is allocated when an agreement is signed, not when an enquiry is received.',
  'We may decline an enquiry where we do not believe we are the right fit. We will tell you why.',
  'The offer closes when the quarter’s places are taken or the quarter ends, whichever comes first.',
  'Wavefront Studio LLC reserves the right to amend or withdraw this offer for future quarters.',
]

const CHOICES = ['AI Chatbot & Automation', 'Web Development', 'Website SEO']

// End of the visitor's current calendar quarter. Month 12 overflows into
// January and day 0 steps back a day, so the year rollover needs no special case.
function quarterEnd(now) {
  const endMonth = Math.floor(now.getMonth() / 3) * 3 + 3
  return new Date(now.getFullYear(), endMonth, 0, 23, 59, 59, 999)
}

function Countdown() {
  const [parts, setParts] = useState(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ms = Math.max(0, quarterEnd(now) - now)
      setParts({
        days: Math.floor(ms / 86400000),
        hours: Math.floor((ms % 86400000) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
      })
    }
    tick()
    const timer = window.setInterval(tick, 30000)
    return () => window.clearInterval(timer)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="offer-countdown">
      <span className="offer-countdown-label">Offer closes in</span>
      <div>
        <b>{parts ? parts.days : '—'}</b>
        <small>Days</small>
      </div>
      <div>
        <b>{parts ? pad(parts.hours) : '—'}</b>
        <small>Hrs</small>
      </div>
      <div>
        <b>{parts ? pad(parts.minutes) : '—'}</b>
        <small>Min</small>
      </div>
      <p className="sr-only" aria-live="polite">
        {parts
          ? parts.days === 0
            ? 'Less than one day left before this quarter’s offer closes.'
            : `${parts.days} ${parts.days === 1 ? 'day' : 'days'} left before this quarter’s offer closes.`
          : ''}
      </p>
    </div>
  )
}

function ClaimForm() {
  const [status, setStatus] = useState('')

  async function submit(event) {
    event.preventDefault()
    setStatus('Sending…')
    const form = event.currentTarget
    const wanted = [...form.querySelectorAll('input[name="interest"]:checked')].map((input) => input.value).join(', ')
    try {
      const result = await deliverLead(form, {
        subject: 'Free setup place request',
        source: 'free-setup',
        fields: [
          ['Name', 'name'],
          ['Company', 'company'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['Interested in', null, wanted],
          ['Company website', 'website'],
        ],
      })
      setStatus(
        result === 'submitted'
          ? 'Thanks. We read every enquiry ourselves and will come back within one business day.'
          : 'Your email app is ready with the request. Review it, then send.',
      )
    } catch {
      setStatus(`We could not send the form. Please email ${contact.email} or call ${contact.phone}.`)
    }
  }

  return (
    <form className="claim-form" onSubmit={submit} id="claim">
      <div className="claim-heading">
        <h3>Claim one of the five places</h3>
        <p>
          Send us a line telling us which service you want and what you’re trying to fix. We read every enquiry ourselves. There is no
          queue and no sales team in between.
        </p>
        <p className="claim-hint">A few details are all we need. Tick whichever of the three you want the setup fee waived on.</p>
      </div>

      <label>
        <span>Your name (required)</span>
              <input required name="name" type="text" autoComplete="name" />
      </label>
      <label>
        <span>Company (required)</span>
        <input required name="company" type="text" autoComplete="organization" />
      </label>
      <label>
        <span>Email (required)</span>
        <input required name="email" type="email" autoComplete="email" />
      </label>
      <label>
        <span>Phone (required, quickest way for us to reach you)</span>
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

      <fieldset className="claim-choices">
        <legend>Which free setup are you interested in?</legend>
        {CHOICES.map((choice) => (
          <label key={choice}>
            <input type="checkbox" name="interest" value={choice} />
            <span>{choice}</span>
          </label>
        ))}
      </fieldset>

      <label>
        <span>Company website</span>
        <input name="website" type="url" placeholder="https://" />
      </label>

      <button className="kinetic-button group" type="submit">
        <span>Claim a place</span>
        <span className="button-island">
          <ArrowIcon className="size-4" />
        </span>
      </button>

      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
      <p className="claim-note">
        Or call <a href={contact.phoneHref}>{contact.phone}</a> or email <a href={contact.emailHref}>{contact.email}</a>. A place is
        allocated when an agreement is signed, not when an enquiry is received, so an early conversation is worth more than an early
        email. One business day. No spam, no list-selling. We hate it too.
      </p>
    </form>
  )
}

export default function FreeSetup() {
  const taken = PLACES_TOTAL - PLACES_LEFT
  const gone = PLACES_LEFT === 0

  return (
    <Layout
      className="offer-page"
      seo={{
        title: 'Free Setup This Quarter | Wavefront Studio',
        description:
          'We waive the one-off setup fee on AI chatbots, web development and SEO for five businesses a quarter. Monthly fees still apply, quoted before you commit.',
        canonical: '/free-setup/',
      }}
    >
      <section className="offer-hero">
        <div className="page-frame offer-hero-grid">
          <div>
            <h1>We’re waiving setup fees for 5 businesses this quarter. Not six.</h1>
            <p>
              Free setup on AI Chatbot &amp; Automation, Web Development and Website SEO. Five places per quarter, because setup is the
              part that takes our team’s time rather than software’s.
            </p>
            <div className="hero-actions">
              <a className="kinetic-button group" href="#claim">
                <span>Claim a place: tell us what you need</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <a className="text-link" href="#covered">
                See what’s included <ArrowIcon />
              </a>
            </div>
          </div>

          <aside className="offer-meter">
            <span className="offer-meter-label">Places left this quarter</span>
            <strong className={PLACES_LEFT <= 2 ? 'is-low' : ''}>{PLACES_LEFT}</strong>
            <p>{PLACES_LEFT} of {PLACES_TOTAL} places left this quarter</p>
            <div className="offer-track" role="img" aria-label={`${taken} of ${PLACES_TOTAL} places allocated so far`}>
              {Array.from({ length: PLACES_TOTAL }).map((_, index) => (
                <i key={index} className={index < taken ? 'is-taken' : ''} />
              ))}
            </div>
            <p className="offer-allocated">Allocated · {taken} of {PLACES_TOTAL} places allocated so far</p>
            <Countdown />
          </aside>
        </div>
      </section>

      <section className="chapter" id="covered">
        <div className="page-frame">
          <SectionHeading
            title="What the free setup covers"
            copy="Three services, and we have been deliberate about which. These are the ones where the one-off setup fee is the thing that stops businesses starting, not the monthly cost."
          />
          <div className="offer-grid">
            {COVERED.map((item) => (
              <article key={item.title} className="offer-card">
                <span className="offer-flag">Setup fee waived</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <p className="offer-setup">
                  <strong>Setup normally covers</strong> {item.setup}
                </p>
                <a className="text-link" href={item.href}>
                  Service details <ArrowIcon />
                </a>
              </article>
            ))}
          </div>

          <div className="offer-clarity">
            <strong>To be completely clear</strong>
            <p>
              The setup and onboarding fee is <em>waived</em>. Ongoing monthly subscription or project fees still apply, and we quote
              those in writing before you commit to anything. No catch, no small print that undoes the offer.
            </p>
          </div>

          <div className="offer-others">
            <h3>Our other services: available, but not part of this offer</h3>
            <p>You can still tell us you’re interested in these when you get in touch, and we’ll quote them normally.</p>
            <div className="related-links">
              {OTHER_SERVICES.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="chapter offer-proof">
        <div className="page-frame">
          <SectionHeading title="Why us specifically" dark />
          <div className="offer-quotes">
            {testimonials.map((item) => (
              <blockquote key={item.name}>
                <p>{item.quote}</p>
                <footer>
                  {item.name}, {item.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame claim-layout">
          <div>
            <SectionHeading title="Tell us what you’re interested in" align="stack" />
            <p className="prose">
              Get in touch and tell us which of the three you want. We’ll come back within one business day with whether a place is still
              open and what it would involve. No obligation, and we’ll tell you honestly if we’re not a fit.
            </p>
            {gone ? (
              <div className="offer-closed">
                <h3>This quarter’s places are gone.</h3>
                <p>
                  You can still get in touch. We’ll put you at the front of the queue for next quarter and contact you before the offer
                  goes out to anyone else.
                </p>
              </div>
            ) : null}
            <div className="offer-checklist">
              {COVERED.map((item) => (
                <span key={item.title}>
                  {item.title} <b>Free setup</b>
                </span>
              ))}
              {OTHER_SERVICES.map(([label]) => (
                <span key={label} className="is-muted">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <ClaimForm />
        </div>
      </section>

      <FaqAccordion items={FAQ} heading={{ title: 'Straight answers', copy: 'About the free setup offer' }} />

      <section className="chapter">
        <div className="page-frame">
          <SectionHeading title="Offer terms" align="stack" />
          <ul className="terms-list">
            {TERMS.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Would rather just talk it through?"
        copy="Fifteen minutes on the phone. We’ll tell you which of the three would move the needle most for your business, and whether a place is still open this quarter."
        label="Book a 15-minute call"
        href={contact.phoneHref}
        secondary={['See how it works', '/ai-chatbot/']}
      />
    </Layout>
  )
}
