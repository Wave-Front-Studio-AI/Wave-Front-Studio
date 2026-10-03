import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { contact } from '../data/site.js'
import { STEPS, callCalculator, readContext, stepError } from '../lostLeadAnalysis.js'

// /lost-leads/: the four-step Lost Lead Analysis that the trade show QR codes
// open (?rep=…&event=…). The scoring, the emailed report, the show offer and
// the follow-up all happen in the studio's app; see src/lostLeadAnalysis.js.
// Kept out of search (routes.js noindex) because /lost-lead-calculator/ is the
// page for that.

const money = (n) => `$${Math.round(Number(n) || 0).toLocaleString('en-US')}`

const SEVERITY = { critical: 'Critical', needs_improvement: 'Needs improvement', opportunity: 'Opportunity' }

// Recorded word for word by the app's calculator when the box is ticked.
const SMS_REPORT_TEXT = 'Yes, send me my Lost Lead Analysis and follow-up by text.'
const SMS_MARKETING_TEXT =
  'Yes, I agree to receive recurring marketing text messages from Wavefront Studio LLC at the mobile number above. Consent is not a condition of any purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time, HELP for help.'
const EMAIL_NOTICE = "We'll email your report and a short weekly tip for four weeks. Unsubscribe from any email at any time."

function Field({ field, value, onChange }) {
  const common = {
    name: field.name,
    value: value ?? '',
    onChange: (event) => onChange(field.name, event.target.value),
    required: field.required || undefined,
  }
  let control
  if (field.options) {
    control = (
      <select {...common}>
        {field.options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    )
  } else if (field.type === 'money') {
    control = (
      <span className="calc-money">
        <i aria-hidden="true">$</i>
        <input {...common} type="number" min="0" inputMode="numeric" placeholder={field.placeholder} />
      </span>
    )
  } else if (field.type === 'number') {
    control = <input {...common} type="number" min="0" max={field.max} inputMode="numeric" placeholder={field.placeholder} />
  } else {
    control = (
      <input
        {...common}
        type={field.type || 'text'}
        inputMode={field.type === 'tel' ? 'tel' : undefined}
        autoComplete={field.autoComplete}
        autoCapitalize={field.type === 'email' ? 'none' : undefined}
        placeholder={field.placeholder}
      />
    )
  }
  return (
    <label className={`calc-field${field.wide ? ' lla-wide' : ''}`}>
      <span className="calc-field-label">
        <span>
          {field.label}
          {field.required ? null : <small> optional</small>}
        </span>
      </span>
      {control}
      {field.hint ? <small className="form-note">{field.hint}</small> : null}
    </label>
  )
}

function Results({ result, email, headingRef }) {
  const problems = result.problems || []
  const offer = result.offer_eligible && result.offer_code
  return (
    <div className="lla-results">
      <h2 ref={headingRef} tabIndex={-1}>
        Your Lost Lead Analysis is ready
      </h2>
      <dl className="lla-figures">
        <div>
          <dt>Your revenue now</dt>
          <dd>
            {money(result.current_revenue)} <small>a month</small>
          </dd>
        </div>
        <div>
          <dt>What you could be earning</dt>
          <dd>
            {money(result.potential_revenue)} <small>a month</small>
          </dd>
        </div>
        <div className="is-gap">
          <dt>What you are missing</dt>
          <dd>
            {money(result.lost_revenue)} <small>a month</small>
          </dd>
        </div>
      </dl>

      {problems.length ? (
        <>
          <h3>
            {problems.length === 1 ? 'One thing' : `${problems.length} things`} that could be costing you leads
          </h3>
          <ul className="lla-problems">
            {problems.map((problem) => (
              <li key={problem.key || problem.title}>
                <p className="lla-problem-title">
                  <strong>{problem.title}</strong>
                  {SEVERITY[problem.severity] ? <span>{SEVERITY[problem.severity]}</span> : null}
                </p>
                <p>{problem.description}</p>
                <p className="lla-fix">What fixes it: {problem.recommended_text}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {offer ? (
        <div className="lla-offer">
          <h3>Your show offer</h3>
          <p>10% off the services we recommend for you, for 30 days. Quote this code when you book your call.</p>
          <p className="lla-code">{result.offer_code}</p>
        </div>
      ) : null}

      <div className="lla-actions">
        <a className="kinetic-button group" href="/contact/">
          <span>Book a free growth call</span>
          <span className="button-island">
            <ArrowIcon className="size-4" />
          </span>
        </a>
        <a className="text-link" href={contact.phoneHref}>
          Or call {contact.phone}
        </a>
      </div>
      <p className="form-note">
        {result.report_sent
          ? `We've emailed a copy of your report${offer ? ' and your code' : ''} to ${email}.`
          : "We couldn't email your report just now. Your answers are saved and we'll be in touch."}
      </p>
    </div>
  )
}

export default function LostLeadAnalysis() {
  const [ctx, setCtx] = useState({ rep: '', event: '', utm: {} })
  const [assessmentId, setAssessmentId] = useState('')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({})
  const [smsReport, setSmsReport] = useState(false)
  const [smsMarketing, setSmsMarketing] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const cardRef = useRef(null)
  const headingRef = useRef(null)
  const moved = useRef(false)

  // Which rep and show the QR code was for, and the "Calculator started" row
  // the app counts as a scan. Automated browsers aren't counted.
  useEffect(() => {
    const found = readContext(window.location.search)
    setCtx(found)
    if (navigator.webdriver) return
    callCalculator({ action: 'start', event: found.event, rep: found.rep, utm: found.utm })
      .then((data) => {
        if (data.assessment_id) setAssessmentId(data.assessment_id)
      })
      .catch(() => {})
  }, [])

  // A new step or the results: move focus to the heading, and bring the card
  // back into view if the visitor had scrolled past its top.
  useEffect(() => {
    if (!moved.current) {
      moved.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    const card = cardRef.current
    if (card && card.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
  }, [step, result])

  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const current = STEPS[step]
  const last = step === STEPS.length - 1

  const onSubmit = async (event) => {
    event.preventDefault()
    if (sending) return
    const problem = stepError(current.key, form)
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    if (!last) {
      setStep(step + 1)
      return
    }
    setSending(true)
    try {
      const data = await callCalculator({
        action: 'complete',
        answers: { ...form, sms_consent: smsReport, sms_marketing_consent: smsMarketing },
        event: ctx.event,
        rep: ctx.rep,
        utm: ctx.utm,
        assessment_id: assessmentId,
      })
      setResult(data)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <Layout
      className="lla-page"
      seo={{
        title: 'Lost Lead Analysis | Wavefront Studio',
        description: 'Answer a few questions about your business and see what you could be earning each month, what is getting in the way, and what would fix it.',
        canonical: '/lost-leads/',
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <h1>How much revenue is your business losing?</h1>
          <p>
            Answer a few questions about your business. We'll work out what you could be earning each month, what's getting in the
            way, and what would fix it. It takes about a minute.
          </p>
          {ctx.event ? (
            <p className="lla-show">
              Visiting us at <strong>{ctx.event}</strong>? Finish the analysis and you get a 10% show offer on the services we
              recommend.
            </p>
          ) : null}
        </div>
      </section>

      <section className="chapter lla-chapter">
        <div className="page-frame">
          <div className="lla-card" ref={cardRef}>
            {result ? (
              <Results result={result} email={String(form.email || '').trim()} headingRef={headingRef} />
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="lla-progress-row">
                  <span>
                    Step {step + 1} of {STEPS.length}
                  </span>
                </div>
                <div className="lla-progress" aria-hidden="true">
                  <i style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
                </div>
                <h2 ref={headingRef} tabIndex={-1}>
                  {current.title}
                </h2>
                <div className="lla-grid" key={current.key}>
                  {current.fields.map((field) => (
                    <Field key={field.name} field={field} value={form[field.name]} onChange={set} />
                  ))}
                </div>

                {last ? (
                  <div className="sms-consent lla-consent">
                    <label className="sms-consent-label">
                      <input type="checkbox" checked={smsReport} onChange={(event) => setSmsReport(event.target.checked)} />
                      <span>
                        <b>Text me my analysis.</b> {SMS_REPORT_TEXT} From Wavefront Studio LLC at the number above. Message frequency
                        varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. See our{' '}
                        <a href="/sms-policy/">SMS Policy</a> and <a href="/privacy-policy/">Privacy Policy</a>.
                      </span>
                    </label>
                    <label className="sms-consent-label">
                      <input type="checkbox" checked={smsMarketing} onChange={(event) => setSmsMarketing(event.target.checked)} />
                      <span>
                        <b>Send me offers too.</b> {SMS_MARKETING_TEXT}
                      </span>
                    </label>
                    <p className="form-note">
                      {EMAIL_NOTICE} Texts are optional, and you don't need them to see your results.
                    </p>
                  </div>
                ) : null}

                <p className="form-status" role="status" aria-live="polite">
                  {sending ? 'Working out your analysis…' : error}
                </p>

                <div className="lla-actions">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="lla-back"
                      onClick={() => {
                        setError('')
                        setStep(step - 1)
                      }}
                    >
                      Back
                    </button>
                  ) : null}
                  {/* aria-disabled, not disabled: a disabled button drops keyboard focus. */}
                  <button className="kinetic-button group" type="submit" aria-disabled={sending || undefined}>
                    <span>{last ? 'See my results' : 'Continue'}</span>
                    <span className="button-island">
                      <ArrowIcon className="size-4" />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
