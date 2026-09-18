import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, EnquiryForm, SectionHeading } from '../components/shared.jsx'
import { ServicePlans } from './ServicePage.jsx'
import { services } from '../data/services.js'
import { customWorks } from '../data/customWorks.js'
import { siteOrigin } from '../data/site.js'
import { breadcrumbs, byOrganization, pageGraph } from '../data/seo.js'

// The AI chatbot page ships no photography, so its entry visual lets a visitor
// step through the assistant's own capability list instead of a stock image.
// It changes only when clicked: nothing here is actually running.
function CapabilityPanel({ items }) {
  const [active, setActive] = useState(0)
  const steps = items.slice(0, 4)

  return (
    <div className="live-panel">
      <div className="live-panel-bar">
        <img src="/wave-logo.webp" alt="Wavefront Studio" />
        <span>What the assistant handles</span>
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
            <strong>{step.title}</strong>
          </button>
        ))}
      </div>
      <div className="live-panel-result" aria-live="polite">
        <p>{steps[active].copy}</p>
      </div>
    </div>
  )
}

function ProcessTimeline({ items }) {
  return (
    <ol className="process-timeline">
      {items.map((step, index) => (
        <li key={step.title}>
          <span className="process-number">{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </li>
      ))}
    </ol>
  )
}

// Titled points separated by rules, not boxed cards with an icon tile each.
function PointList({ items, columns = 3 }) {
  return (
    <div className={`point-list cols-${columns}`}>
      {items.map((item) => (
        <div key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </div>
      ))}
    </div>
  )
}

function ComparisonTable({ comparison }) {
  return (
    <section className="comparison-chapter chapter">
      <div className="page-frame">
        <SectionHeading title={comparison.title} copy={comparison.copy} />
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

function VisualizerShowcase({ showcase }) {
  const [revealed, setRevealed] = useState(60)

  return (
    <section className="showcase-chapter chapter">
      <div className="page-frame">
        <SectionHeading title={showcase.title} copy={showcase.copy} dark />
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
      </div>
    </section>
  )
}

function CalculatorDemo({ demo }) {
  return (
    <section className="showcase-chapter chapter">
      <div className="page-frame">
        <SectionHeading title={demo.title} copy={demo.copy} dark />
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
              <span className="calc-chips-label">Depth</span>
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
        <SectionHeading title="Other things we build" />
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
  const url = `${siteOrigin}${canonical}`
  // Named by what the service is (work.nav), not the page headline, which is a
  // slogan such as "Let Your Customers See It Before They Buy It".
  const schema = pageGraph(
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: work.nav,
      serviceType: work.nav,
      description: work.metaDescription,
      url,
      areaServed: 'Worldwide',
      provider: byOrganization,
    },
    breadcrumbs([['Home', '/'], ['Custom Works', '/custom-works/'], [work.nav, canonical]]),
  )

  const entryVisual = (() => {
    if (work.showcase) {
      return (
        <div className="service-media is-frame">
          <img src={work.showcase.after.image} alt={work.showcase.after.caption} loading="eager" fetchPriority="high" />
          <span className="service-media-tag">{work.showcase.after.tag}</span>
        </div>
      )
    }
    if (work.demo) {
      return (
        <div className="service-media is-frame">
          <img src={work.demo.image} alt={work.demo.panelTitle} loading="eager" fetchPriority="high" />
          <span className="service-media-tag">{work.demo.panelTitle}</span>
        </div>
      )
    }
    return <CapabilityPanel items={work.features.items} />
  })()

  return (
    <Layout className="service-page custom-work-page" seo={{ title: work.metaTitle, description: work.metaDescription, canonical, schema }}>
      <section className="service-entry chapter">
        <div className="page-frame service-entry-grid">
          <div className="service-entry-intro">
            {entryVisual}
            <div>
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
                  See our work <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
          <div>
            <EnquiryForm
              heading="Tell us what you need"
              copy="A few lines about the business and the problem is enough. We reply within one to two working days."
              subjectDefault={work.nav}
              source={work.slug}
            />
          </div>
        </div>
      </section>

      {work.steps ? (
        <section className="process-chapter chapter">
          <div className="page-frame">
            <SectionHeading title={work.steps.title} copy={work.steps.copy} />
            <ProcessTimeline items={work.steps.items} />
          </div>
        </section>
      ) : null}

      {work.showcase ? <VisualizerShowcase showcase={work.showcase} /> : null}
      {work.demo ? <CalculatorDemo demo={work.demo} /> : null}

      <section className="service-capabilities chapter">
        <div className="page-frame">
          <SectionHeading title={work.features.title} copy={work.features.copy} />
          <PointList items={work.features.items} columns={3} />
        </div>
      </section>

      {work.plans ? <ServicePlans plans={work.plans} /> : null}
      {work.comparison ? <ComparisonTable comparison={work.comparison} /> : null}

      {work.integrations ? (
        <section className="integrations-chapter chapter">
          <div className="page-frame">
            <SectionHeading title={work.integrations.title} copy={work.integrations.copy} dark />
            <div className="integration-row">
              {work.integrations.items.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {work.audience ? (
        <section className="audience-chapter chapter">
          <div className="page-frame">
            <SectionHeading title={work.audience.title} copy={work.audience.copy} />
            <PointList items={work.audience.items} columns={4} />
          </div>
        </section>
      ) : null}

      <RelatedWork current={work.slug} />

      <CtaBand
        title={work.cta.title}
        copy={work.cta.copy}
        label="Contact us"
        secondary={['See our work', '/portfolio/']}
      />
    </Layout>
  )
}
