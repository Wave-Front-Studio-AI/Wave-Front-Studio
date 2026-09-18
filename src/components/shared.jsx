import { useId, useState } from 'react'
import { ArrowIcon, ChevronIcon } from './Icons.jsx'
import { contact, offeringGroups, testimonials, testimonialsHeading } from '../data/site.js'
import { deliverLead } from '../formSubmission.js'

/* ------------------------------------------------------------------ */
/* Headings                                                            */
/* ------------------------------------------------------------------ */

export function SectionHeading({ title, copy, as: Heading = 'h2', dark = false, align = 'split', children }) {
  return (
    <div className={`section-head ${dark ? 'is-dark' : ''} is-${align}`}>
      <Heading>{title}</Heading>
      {copy || children ? (
        <div className="section-head-aside">
          {copy ? <p>{copy}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Services index                                                      */
/* ------------------------------------------------------------------ */

// Services grouped by the job they do for the customer, with the free audit
// set apart as the starting point. Each service row is a whole-row link.
export function OfferingList({ items }) {
  const start = items.find((item) => item.group === 'start')
  return (
    <div className="offering-groups">
      {offeringGroups.map((group) => {
        const members = items.filter((item) => item.group === group.id)
        if (!members.length) return null
        return (
          <section className="offering-group" key={group.id} aria-labelledby={`offering-${group.id}`}>
            <header>
              <h3 id={`offering-${group.id}`}>{group.title}</h3>
              <p>{group.copy}</p>
            </header>
            <ul>
              {members.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>
                    <strong>{item.name}</strong>
                    <span>{item.copy}</span>
                    <ArrowIcon />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {start ? (
        <aside className="offering-start">
          <div>
            <h3>Not sure where to start?</h3>
            <p>{start.copy}</p>
          </div>
          <a className="kinetic-button light group" href={start.href}>
            <span>Get a free site audit</span>
            <span className="button-island">
              <ArrowIcon className="size-4" />
            </span>
          </a>
        </aside>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const initials = (name) => name.split(' ').map((part) => part[0]).join('')

// The first quote carries the most detail, so it gets the most room.
export function Testimonials() {
  return (
    <section className="testimonials chapter" id="testimonials">
      <div className="page-frame">
        <SectionHeading title={testimonialsHeading.title} copy={testimonialsHeading.copy} />
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <figure className="testimonial-card" key={item.name}>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                {item.image ? (
                  <img src={item.image} alt="" width="96" height="96" loading="lazy" />
                ) : (
                  <span className="testimonial-initials" aria-hidden="true">
                    {initials(item.name)}
                  </span>
                )}
                <span>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CTA band                                                            */
/* ------------------------------------------------------------------ */

export function CtaBand({ title, copy, label = 'Get a free consultation', href = '/contact/', secondary }) {
  return (
    <section className="cta-band">
      <div className="page-frame">
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
        <div className="cta-band-actions">
          <a className="kinetic-button light group" href={href}>
            <span>{label}</span>
            <span className="button-island">
              <ArrowIcon className="size-4" />
            </span>
          </a>
          {secondary ? (
            <a className="text-link on-dark" href={secondary[1]}>
              {secondary[0]} <ArrowIcon />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */

export function FaqAccordion({ items, heading }) {
  const [open, setOpen] = useState(0)
  const baseId = useId()

  return (
    <section className="faq-chapter chapter" id="faqs">
      <div className="page-frame faq-grid">
        <div className="faq-heading">
          <h2>{heading?.title || 'Common questions'}</h2>
          {heading?.copy ? <p>{heading.copy}</p> : null}
        </div>
        <div className="faq-list">
          {items.map(([question, answer], index) => {
            const panelId = `${baseId}-faq-${index}`
            const isOpen = open === index
            return (
              <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
                <h3>
                  <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={panelId}>
                    <span>{question}</span>
                    <ChevronIcon open={isOpen} className="size-5" />
                  </button>
                </h3>
                <div className="faq-answer" id={panelId} aria-hidden={!isOpen}>
                  <div className="faq-answer-inner">
                    <p>{answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Enquiry form                                                        */
/* ------------------------------------------------------------------ */

// Same five fields the live contact form collects. `subject` is prefilled from
// the page so an enquiry arrives already labelled with what it is about.
export function EnquiryForm({
  heading,
  copy,
  subjectDefault = '',
  source = 'website',
  compact = false,
  websiteField = false,
  submitLabel = 'Submit',
}) {
  const [status, setStatus] = useState('')
  const [phase, setPhase] = useState('idle')
  const [confirmationName, setConfirmationName] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (phase === 'sending') return
    const submittedName = new FormData(event.currentTarget).get('name')
    setPhase('sending')
    setStatus('Sending your message…')
    try {
      await deliverLead(event.currentTarget, {
        subject: subjectDefault ? `${subjectDefault} enquiry` : 'Website enquiry',
        source,
        fields: [
          ['Name', 'name'],
          ['Company', 'company'],
          ['Phone', 'phone'],
          ['Email', 'email'],
          ['Website', 'website'],
          ['Subject', 'subject'],
          ['Message', 'message'],
        ],
      })
      setConfirmationName(typeof submittedName === 'string' ? submittedName : '')
      setStatus('')
      setPhase('submitted')
    } catch {
      setPhase('idle')
      setStatus(`We could not send the form. Please email ${contact.email} or call ${contact.phone}.`)
    }
  }

  if (phase === 'submitted') {
    return (
      <section className={`enquiry-form form-confirmation ${compact ? 'is-compact' : ''}`} role="status" aria-live="polite">
        <span className="confirmation-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m6.5 12.5 3.4 3.4 7.6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3>Thank you{confirmationName ? `, ${confirmationName}` : ''}.</h3>
        <p>Your message reached the studio. We will reply using the details you gave us, usually within one to two working days.</p>
        <button
          className="text-link confirmation-reset"
          type="button"
          onClick={() => {
            setPhase('idle')
            setConfirmationName('')
          }}
        >
          Send another message <ArrowIcon />
        </button>
      </section>
    )
  }

  return (
    <form className={`enquiry-form ${compact ? 'is-compact' : ''}`} onSubmit={submit}>
      {heading ? (
        <div className="enquiry-heading">
          <h3>{heading}</h3>
          {copy ? <p>{copy}</p> : null}
        </div>
      ) : null}
      <label>
        <span>Name</span>
        <input required name="name" type="text" autoComplete="name" placeholder="Your name" />
      </label>
      <label>
        <span>
          Company <small>optional</small>
        </span>
        <input name="company" type="text" autoComplete="organization" placeholder="Your company" />
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
          placeholder="(941) 555-0123"
        />
      </label>
      <label>
        <span>Email</span>
        <input required name="email" type="email" autoComplete="email" placeholder="you@company.com" />
      </label>
      {websiteField ? (
        <label>
          <span>Website URL</span>
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
      ) : null}
      {/* The page already knows what the enquiry is about, so the subject rides
          along hidden rather than being one more box to fill in. */}
      <input name="subject" type="hidden" defaultValue={subjectDefault || 'Website enquiry'} />
      <label className="enquiry-wide">
        <span>
          Message <small>optional</small>
        </span>
        <textarea name="message" rows="3" placeholder="What are you trying to get done?" />
      </label>
      <button className="kinetic-button group enquiry-wide" type="submit" disabled={phase === 'sending'}>
        <span>{phase === 'sending' ? 'Sending…' : submitLabel}</span>
        <span className="button-island">
          <ArrowIcon className="size-4" />
        </span>
      </button>
      <p className="form-status enquiry-wide" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/* Support strip                                                       */
/* ------------------------------------------------------------------ */

export function SupportCallout() {
  return (
    <a className="support-callout" href={contact.phoneHref}>
      <span className="support-ring" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="support-text">
        <small>Call the studio</small>
        <strong>{contact.supportPhone}</strong>
      </span>
    </a>
  )
}
