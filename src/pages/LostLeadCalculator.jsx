import { useMemo, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, Reveal, SectionHeading } from '../components/shared.jsx'
import { contact } from '../data/site.js'

const money = (value) => `$${Math.round(value).toLocaleString('en-US')}`

const SPEED_OPTIONS = [
  ['Within 5 minutes, every time', 0],
  ['Within the hour', 0.12],
  ['Same day', 0.3],
  ['Next day or later', 0.5],
]

const RESEARCH = [
  ['23%', 'Of 2,241 companies audited never responded to a lead at all'],
  ['7×', 'More likely to qualify a lead when you reply inside an hour'],
  ['42 hrs', 'Average first response time among firms that did reply'],
  ['50%', 'Of leads never receive a second contact attempt'],
]

const FIXES = [
  ['Enquiries arriving after hours', 'An AI chatbot that answers real questions, captures details and books quote requests at 2am'],
  ['Messages scattered across five inboxes', 'One dashboard consolidating website, email, social, SMS and WhatsApp'],
  ['Nobody follows up a quiet lead', 'Automated SMS and WhatsApp sequences that check in on a schedule, without anyone remembering'],
  ['Reviews never get requested', 'Automatic Google and Facebook review requests once a job completes'],
  ['You cannot tell which channel pays', 'Real-time dashboards on leads, conversion rate and marketing ROI'],
]

function Slider({ label, hint, value, onChange, min, max }) {
  return (
    <label className="calc-field is-slider">
      <span className="calc-field-label">
        {label}
        <b>{value}%</b>
      </span>
      <input type="range" min={min} max={max} step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

export default function LostLeadCalculator() {
  const [leads, setLeads] = useState(40)
  const [value, setValue] = useState(2500)
  const [close, setClose] = useState(30)
  const [miss, setMiss] = useState(30)
  const [penalty, setPenalty] = useState(0.3)
  const [noFollowUp, setNoFollowUp] = useState(true)
  const [recFail, setRecFail] = useState(55)
  const [uplift, setUplift] = useState(20)
  const [recRate, setRecRate] = useState(40)

  // Same three-part model the live calculator uses: enquiries never reconnected
  // with, conversions lost to slow replies, and conversions a follow-up
  // sequence would have added.
  const result = useMemo(() => {
    const annual = Math.max(0, leads) * 12
    const missed = annual * (miss / 100)
    const answered = annual - missed
    const closeRate = close / 100

    const leakA = missed * (recFail / 100) * closeRate * Math.max(0, value)
    const baseDeals = answered * closeRate
    const actualDeals = baseDeals * (1 - penalty)
    const leakB = (baseDeals - actualDeals) * Math.max(0, value)
    const leakC = noFollowUp ? actualDeals * (uplift / 100) * Math.max(0, value) : 0

    const total = leakA + leakB + leakC
    const recoverable = total * (recRate / 100)
    const max = Math.max(leakA, leakB, leakC, 1)
    const lostDeals = value > 0 ? total / value : 0

    return { leakA, leakB, leakC, total, recoverable, max, lostDeals }
  }, [leads, value, close, miss, penalty, noFollowUp, recFail, uplift, recRate])

  const breakdown = [
    ['Never reached at all', result.leakA],
    ['Replied to too slowly', result.leakB],
    ['Never followed up', result.leakC],
  ]

  return (
    <Layout
      className="calculator-page"
      seo={{
        title: 'Lost Lead Calculator | Wavefront Studio',
        description:
          'Missed calls. Slow replies. Enquiries nobody followed up. Put your own numbers in and see what it adds up to over twelve months.',
        canonical: '/lost-lead-calculator/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">Free Tool · 60 Seconds</span>
          <h1>How much revenue is your business leaking every year?</h1>
          <p>
            Missed calls. Slow replies. Enquiries nobody followed up. Put your own numbers in and see what it adds up to over twelve
            months.
          </p>
        </div>
      </section>

      <section className="chapter calc-chapter">
        <div className="page-frame calc-layout">
          <div className="calc-inputs">
            <h2>Your numbers</h2>

            <label className="calc-field">
              <span className="calc-field-label">Enquiries you get per month</span>
              <input type="number" min="1" max="10000" inputMode="numeric" value={leads} onChange={(event) => setLeads(Number(event.target.value))} />
              <small>Phone calls, website forms, DMs and emails combined.</small>
            </label>

            <label className="calc-field">
              <span className="calc-field-label">Average value of a job or customer</span>
              <span className="calc-money">
                <i aria-hidden="true">$</i>
                <input type="number" min="1" max="10000000" inputMode="numeric" value={value} onChange={(event) => setValue(Number(event.target.value))} />
              </span>
              <small>What a typical closed job is worth to you.</small>
            </label>

            <Slider label="Close rate on enquiries you actually speak to" value={close} onChange={setClose} min={1} max={100} />

            <Slider
              label="Enquiries that go unanswered or unreturned"
              hint="Rung out, arrived after hours, or sat in an inbox nobody opened."
              value={miss}
              onChange={setMiss}
              min={0}
              max={90}
            />

            <label className="calc-field">
              <span className="calc-field-label">How fast do you typically reply?</span>
              <select value={penalty} onChange={(event) => setPenalty(Number(event.target.value))}>
                {SPEED_OPTIONS.map(([label, weight]) => (
                  <option key={label} value={weight}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="calc-field">
              <span className="calc-field-label">Do you follow up more than twice on a quiet lead?</span>
              <select value={noFollowUp ? '1' : '0'} onChange={(event) => setNoFollowUp(event.target.value === '1')}>
                <option value="0">Yes — systematically, every lead</option>
                <option value="1">No — once or twice, then it drops</option>
              </select>
            </label>

            <details className="calc-assumptions">
              <summary>Assumptions used (edit these)</summary>
              <p>These are conservative estimates, not guarantees. Change them and the result updates.</p>
              <Slider label="Unanswered enquiries that never reconnect" value={recFail} onChange={setRecFail} min={0} max={100} />
              <Slider label="Extra conversions a proper follow-up sequence would win" value={uplift} onChange={setUplift} min={0} max={60} />
              <Slider label="Share of the leak that is realistically recoverable" value={recRate} onChange={setRecRate} min={5} max={100} />
            </details>
          </div>

          <div className="calc-results" aria-live="polite">
            <div className="calc-headline is-risk">
              <span>Revenue at risk each year</span>
              <strong>{money(result.total)}</strong>
              <small>{money(result.total / 12)} a month, every month.</small>
            </div>

            <div className="calc-headline is-recover">
              <span>Realistically recoverable</span>
              <strong>{money(result.recoverable)}</strong>
              <small>About {money(result.recoverable / 12)} a month back in the business.</small>
            </div>

            <div className="calc-breakdown">
              <h3>Where it goes</h3>
              {breakdown.map(([label, amount]) => (
                <div key={label}>
                  <span>{label}</span>
                  <b>{money(amount)}</b>
                  <i style={{ width: `${(amount / result.max) * 100}%` }} aria-hidden="true" />
                </div>
              ))}
            </div>

            <p className="calc-deals">
              That is roughly {Math.round(result.lostDeals * 10) / 10} jobs a year going to somebody who answered first.
            </p>
          </div>
        </div>
      </section>

      <section className="chapter research-chapter">
        <div className="page-frame">
          <SectionHeading
            eyebrow="The evidence"
            title="Why the number is usually this big"
            copy="Most owners assume lost jobs are lost on price. The research says otherwise — they are mostly lost to time. Somebody else answered first, and the customer stopped looking."
            dark
          />
          <div className="stat-row is-quad">
            {RESEARCH.map(([figure, label], index) => (
              <Reveal key={figure} delay={index * 80}>
                <strong>{figure}</strong>
                <span>{label}</span>
              </Reveal>
            ))}
          </div>
          <div className="research-notes">
            <p>
              Sources: Oldroyd, McElheran &amp; Elkington, <em>The Short Life of Online Sales Leads</em>, Harvard Business Review (2011),
              audit of 2,241 US companies; Velocify (2013) on follow-up persistence.
            </p>
            <p>
              A separate audit of 114 B2B companies found the average email reply took 11 hours 54 minutes, only 31% ever called back,
              and companies using automated lead routing replied in 3h32m versus nearly 13 hours without it.
            </p>
            <p className="research-kicker">
              The uncomfortable part: none of this is a marketing problem. You already paid to generate these enquiries. This is money
              leaking out of attention you have already bought.
            </p>
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <SectionHeading eyebrow="The fix" title="What actually closes the gap" />
          <div className="fix-table">
            <div className="fix-head">
              <span>The leak</span>
              <span>What fixes it</span>
            </div>
            {FIXES.map(([leak, fix], index) => (
              <Reveal key={leak} delay={index * 60} className="fix-row">
                <span>{leak}</span>
                <span>{fix}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to plug the leak?"
        copy="We will set up the answering, follow-up and review systems for you — free to get started."
        label="See the free setup offer"
        href="/free-setup/"
        secondary={[`Prefer to talk it through? Call ${contact.phone}`, contact.phoneHref]}
      />
    </Layout>
  )
}
