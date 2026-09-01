import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, EnquiryForm, Reveal, SectionHeading } from '../components/shared.jsx'
import { ServicePlans } from './ServicePage.jsx'
import { services } from '../data/services.js'
import { customWorks } from '../data/customWorks.js'
import { siteOrigin } from '../data/site.js'

function EntryMotif() {
  return (
    <div className="entry-motif" aria-hidden="true">
      <svg viewBox="0 0 1600 240" preserveAspectRatio="none">
        <path className="entry-motif-track" pathLength="1" d="M0 120 C 240 220 420 20 640 120 S 1020 230 1230 110 S 1460 30 1600 150" />
        <path className="entry-motif-signal" pathLength="1" d="M0 120 C 240 220 420 20 640 120 S 1020 230 1230 110 S 1460 30 1600 150" />
      </svg>
    </div>
  )
}

// The AI chatbot page ships no photography, so its entry visual cycles the
// platform's own capability list instead of showing a stock image.
function LiveSystemPanel({ items }) {
  const [active, setActive] = useState(0)
  const steps = items.slice(0, 4)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => setActive((value) => (value + 1) % steps.length), 2800)
    return () => window.clearInterval(timer)
  }, [steps.length])

  return (
    <div className="live-panel">
      <div className="live-panel-bar">
        <img src="/wave-logo.png" alt="Wavefront Studio" />
        <span>
          <i aria-hidden="true" /> Live system
        </span>
      </div>
      <div className="live-panel-body">
        {steps.map((step, index) => (
          <button
            type="button"
            key={step.title}
            className={index === active ? 'is-active' : ''}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
          >
            <span aria-hidden="true">{step.icon}</span>
            <strong>{step.title}</strong>
          </button>
        ))}
      </div>
      <div className="live-panel-result" aria-live="polite">
        <span>Now running</span>
        <p>{steps[active].copy}</p>
      </div>
    </div>
  )
}

function ProcessTimeline({ items }) {
  return (
    <ol className="process-timeline">
      {items.map((step, index) => (
        <Reveal as="li" key={step.title} delay={index * 90}>
          <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <span className="process-icon" aria-hidden="true">
              {step.icon}
            </span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}

function IconGrid({ items, columns = 3 }) {
  return (
    <div className={`icon-grid cols-${columns}`}>
      {items.map((item, index) => (
        <Reveal as="article" key={item.title} delay={index * 55} className="icon-card">
          <span aria-hidden="true">{item.icon}</span>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </Reveal>
      ))}
    </div>
  )
}

function ComparisonTable({ comparison }) {
  return (
    <section className="comparison-chapter chapter">
      <div className="page-frame">
        <SectionHeading eyebrow={comparison.eyebrow} title={comparison.title} copy={comparison.copy} />
        <p className="comparison-hint">{comparison.swipeHint}</p>
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {comparison.columns.map((column) => (
                  <th scope="col" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            {comparison.groups.map((group) => (
              <tbody key={group.name}>
                <tr className="comparison-group">
                  <th scope="rowgroup" colSpan={comparison.columns.length + 1}>
                    {group.name}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={`${group.name}-${row[0]}`}>
                    <th scope="row">{row[0]}</th>
                    {row.slice(1).map((cell, index) => (
                      <td key={index} className={cell === '✓' ? 'is-yes' : cell === '✗' ? 'is-no' : ''}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}

function VisualizerShowcase({ showcase, stats }) {
  const [revealed, setRevealed] = useState(60)

  return (
    <section className="showcase-chapter chapter">
      <div className="page-frame">
        <SectionHeading eyebrow={showcase.eyebrow} title={showcase.title} copy={showcase.copy} dark />
        <div className="compare-stage">
          <figure>
            <img className="compare-base" src={showcase.before.image} alt={showcase.before.caption} loading="lazy" />
            <span className="compare-overlay" style={{ '--reveal': `${revealed}%` }}>
              <img src={showcase.after.image} alt={showcase.after.caption} loading="lazy" />
            </span>
            <span className="compare-divider" style={{ left: `${revealed}%` }} aria-hidden="true" />
            <span className="compare-tag is-before">{showcase.before.tag}</span>
            <span className="compare-tag is-after">{showcase.after.tag}</span>
          </figure>
          <label className="compare-control">
            <span className="sr-only">Reveal the product preview</span>
            <input
              type="range"
              min="0"
              max="100"
              value={revealed}
              onChange={(event) => setRevealed(Number(event.target.value))}
              aria-label="Reveal the product preview"
            />
          </label>
          <div className="compare-captions">
            <span>
              <strong>{showcase.before.label}</strong>
              {showcase.before.caption}
            </span>
            <span>
              <strong>{showcase.after.label}</strong>
              {showcase.after.caption}
            </span>
          </div>
        </div>
        <div className="stat-row">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CalculatorDemo({ demo }) {
  return (
    <section className="showcase-chapter chapter">
      <div className="page-frame">
        <SectionHeading eyebrow={demo.eyebrow} title={demo.title} copy={demo.copy} dark />
        <div className="calc-demo">
          <div className="calc-demo-panel">
            <header>
              <h3>{demo.panelTitle}</h3>
              <p>{demo.panelCopy}</p>
            </header>
            <div className="calc-fields">
              {demo.inputs.map((field) => (
                <div key={field.label}>
                  <span>{field.label}</span>
                  <b>{field.value}</b>
                </div>
              ))}
            </div>
            <div className="calc-chips">
              <span className="calc-chips-label">Select Depth</span>
              <div>
                {demo.depths.map((depth) => (
                  <span key={depth} className={depth === demo.depthSelected ? 'is-on' : ''}>
                    {depth}
                  </span>
                ))}
              </div>
            </div>
            <div className="calc-chips">
              <span className="calc-chips-label">Wastage</span>
              <div>
                {demo.wastages.map((item) => (
                  <span key={item} className={item === demo.wastageSelected ? 'is-on' : ''}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <span className="calc-action">{demo.calcLabel}</span>
          </div>

          <div className="calc-demo-result">
            <h3>{demo.breakdownTitle}</h3>
            <dl>
              {demo.lines.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="calc-total">
              <span>{demo.totalLabel}</span>
              <strong>{demo.total}</strong>
            </div>
            <div className="calc-actions">
              {demo.actions.map((action) => (
                <span key={action}>{action}</span>
              ))}
            </div>
            <span className="calc-cart">
              {demo.cartLabel} <ArrowIcon />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedWork({ current }) {
  const siblings = [...customWorks, ...services].filter((item) => item.slug !== current)
  return (
    <section className="related-chapter chapter">
      <div className="page-frame">
        <SectionHeading
          eyebrow="More from Wavefront"
          title="Everything else we build."
          copy="One team, one roof — pick the next piece when your business is ready for it."
        />
        <div className="related-links">
          {siblings.map((item) => (
            <a href={`/${item.slug}/`} key={item.slug}>
              {item.nav || item.name}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CustomWorkPage({ work }) {
  const canonical = `/${work.slug}/`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: work.name,
        description: work.metaDescription,
        url: `${siteOrigin}${canonical}`,
        provider: { '@type': 'Organization', name: 'Wavefront Studio LLC', url: `${siteOrigin}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Wavefront Studio', item: `${siteOrigin}/` },
          { '@type': 'ListItem', position: 2, name: work.nav, item: `${siteOrigin}${canonical}` },
        ],
      },
    ],
  }

  const entryVisual = (() => {
    if (work.showcase) {
      return (
        <div className="service-media is-frame">
          <img src={work.showcase.after.image} alt={work.showcase.after.caption} loading="eager" />
          <span className="service-media-tag">{work.showcase.after.tag}</span>
        </div>
      )
    }
    if (work.demo) {
      return (
        <div className="service-media is-frame">
          <img src={work.demo.image} alt={work.demo.panelTitle} loading="eager" />
          <span className="service-media-tag">{work.demo.panelTitle}</span>
        </div>
      )
    }
    return <LiveSystemPanel items={work.features.items} />
  })()

  return (
    <Layout className="service-page custom-work-page" seo={{ title: work.metaTitle, description: work.metaDescription, canonical, schema }}>
      <section className="service-entry chapter">
        <EntryMotif />
        <div className="page-frame service-entry-grid">
          <div className="service-entry-intro">
            <Reveal>{entryVisual}</Reveal>
            <Reveal delay={80}>
              <span className="eyebrow">{work.eyebrow}</span>
              <h1>{work.name}</h1>
              <p className="service-subhead">{work.intro}</p>
              <div className="hero-actions">
                <a className="kinetic-button group" href="/contact/">
                  <span>{work.primaryCta}</span>
                  <span className="button-island">
                    <ArrowIcon className="size-4" />
                  </span>
                </a>
                <a className="text-link" href="/portfolio/">
                  See Our Work <ArrowIcon />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <EnquiryForm
              heading="Tell us what you need."
              copy="Drop us a message and let’s discuss how we can help your business grow online."
              subjectDefault={work.nav}
              source={work.slug}
            />
          </Reveal>
        </div>
      </section>

      {work.steps ? (
        <section className="process-chapter chapter">
          <div className="page-frame">
            <SectionHeading eyebrow={work.steps.eyebrow} title={work.steps.title} copy={work.steps.copy} />
            <ProcessTimeline items={work.steps.items} />
          </div>
        </section>
      ) : null}

      {work.showcase ? <VisualizerShowcase showcase={work.showcase} stats={work.stats} /> : null}
      {work.demo ? <CalculatorDemo demo={work.demo} /> : null}

      <section className="service-capabilities chapter">
        <div className="page-frame">
          <SectionHeading eyebrow={work.features.eyebrow} title={work.features.title} copy={work.features.copy} />
          <IconGrid items={work.features.items} columns={3} />
        </div>
      </section>

      {work.plans ? <ServicePlans plans={work.plans} /> : null}
      {work.comparison ? <ComparisonTable comparison={work.comparison} /> : null}

      {work.integrations ? (
        <section className="integrations-chapter chapter">
          <div className="page-frame">
            <SectionHeading eyebrow={work.integrations.eyebrow} title={work.integrations.title} copy={work.integrations.copy} dark />
            <div className="integration-row">
              {work.integrations.items.map((item, index) => (
                <Reveal as="article" key={item.title} delay={index * 70}>
                  <span aria-hidden="true">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {work.audience ? (
        <section className="audience-chapter chapter">
          <div className="page-frame">
            <SectionHeading eyebrow={work.audience.eyebrow} title={work.audience.title} copy={work.audience.copy} />
            <IconGrid items={work.audience.items} columns={4} />
          </div>
        </section>
      ) : null}

      <RelatedWork current={work.slug} />

      <CtaBand
        eyebrow={work.cta.eyebrow}
        title={work.cta.title}
        copy={work.cta.copy}
        label="Contact Us"
        secondary={['See Our Work', '/portfolio/']}
      />
    </Layout>
  )
}
