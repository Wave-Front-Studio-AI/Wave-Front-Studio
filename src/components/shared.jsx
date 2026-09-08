import { useEffect, useId, useRef, useState } from 'react'
import { ArrowIcon, ChevronIcon } from './Icons.jsx'
import { contact, testimonials, testimonialsHeading } from '../data/site.js'
import { deliverLead } from '../formSubmission.js'

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

// One shared observer-driven reveal instead of a motion library, so the whole
// site animates in consistently and costs nothing on first paint.
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Headings                                                            */
/* ------------------------------------------------------------------ */

export function SectionHeading({ eyebrow, title, copy, as: Heading = 'h2', dark = false, align = 'split', children }) {
  return (
    <div className={`section-head ${dark ? 'is-dark' : ''} is-${align}`}>
      <div>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <Heading>{title}</Heading>
      </div>
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
/* Counters                                                            */
/* ------------------------------------------------------------------ */

export function Counter({ to, suffix = '', prefix = '', decimals = 0 }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return undefined
    }
    let frame
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const duration = 2000
        const step = (now) => {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - (1 - progress) ** 3
          setValue(to * eased)
          if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to])

  return (
    <span ref={ref} className="counter">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

function Stars() {
  return (
    <span className="stars" aria-label="5 out of 5">
      {[0, 1, 2, 3, 4].map((index) => (
        <svg key={index} viewBox="0 0 20 20" aria-hidden="true">
          <path d="m10 1.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8Z" fill="currentColor" />
        </svg>
      ))}
    </span>
  )
}

export function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="testimonials chapter" id="testimonials">
      <div className="page-frame">
        <SectionHeading eyebrow={testimonialsHeading.eyebrow} title={testimonialsHeading.title} copy={testimonialsHeading.copy} />
        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <Reveal
              as="article"
              key={item.name}
              delay={index * 90}
              className={`testimonial-card ${active === index ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(index)}
              onFocusCapture={() => setActive(index)}
            >
              <Stars />
              <blockquote>{item.quote}</blockquote>
              <footer>
                <img src={item.image} alt="" width="96" height="96" loading="lazy" />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CTA band                                                            */
/* ------------------------------------------------------------------ */

export function CtaBand({ eyebrow, title, copy, label = 'Get a Free Consultation', href = '/contact/', secondary }) {
  return (
    <section className="cta-band">
      <div className="page-frame">
        <img className="cta-mark" src="/wave-logo-white.webp" alt="" width="1591" height="498" loading="lazy" />
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
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

export function FaqAccordion({ items, heading, deskLabel = 'Wavefront Studio', deskSub = 'Answers from the team' }) {
  const [open, setOpen] = useState(0)
  const baseId = useId()

  return (
    <section className="faq-chapter chapter" id="faqs">
      <div className="page-frame faq-grid">
        <div className="faq-heading">
          <span className="eyebrow">{heading?.eyebrow || 'Common questions'}</span>
          <h2>{heading?.title || 'Got Questions? We’ve Got Answers.'}</h2>
          {heading?.copy ? <p>{heading.copy}</p> : null}
        </div>
        <div className="faq-chat-shell">
          <div className="faq-chat-header">
            <span className="faq-status-dot" aria-hidden="true" />
            <div>
              <strong>{deskLabel}</strong>
              <span>{deskSub}</span>
            </div>
          </div>
          <div className="faq-list">
            {items.map(([question, answer], index) => {
              const panelId = `${baseId}-faq-${index}`
              const isOpen = open === index
              return (
                <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
                  <h3>
                    <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={panelId}>
                      <span>{question}</span>
                      <ChevronIcon open={isOpen} className="size-5" />
                    </button>
                  </h3>
                  <div className="faq-answer" id={panelId} aria-hidden={!isOpen}>
                    <div className="faq-answer-inner">
                      <span className="faq-agent-mark">
                        <img src="/wave-logo.webp" alt="" loading="lazy" />
                      </span>
                      <div className="faq-answer-bubble">
                        <span>Wavefront</span>
                        <p>{answer}</p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
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
        <span className="eyebrow">Message received</span>
        <h3>Thank you{confirmationName ? `, ${confirmationName}` : ''}.</h3>
        <p>Your message has been sent successfully. The Wavefront Studio team will review it and follow up using the contact details you provided.</p>
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
        <span>Company</span>
        <input required name="company" type="text" autoComplete="organization" placeholder="Your company" />
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
      <label>
        <span>Subject</span>
        <input name="subject" type="text" defaultValue={subjectDefault} placeholder="What is this about?" />
      </label>
      <label className="enquiry-wide">
        <span>Message</span>
        <textarea required name="message" rows="4" placeholder="Tell us what you are trying to achieve." />
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
        <small>Customer Support</small>
        <strong>{contact.supportPhone}</strong>
      </span>
    </a>
  )
}
