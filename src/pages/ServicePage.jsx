import { useEffect, useRef } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, EnquiryForm, FaqAccordion, Reveal, SectionHeading, SupportCallout, Testimonials } from '../components/shared.jsx'
import { services } from '../data/services.js'
import { customWorks } from '../data/customWorks.js'
import { siteOrigin } from '../data/site.js'

// Decorative wave that runs behind the entry section. Purely visual.
function EntryMotif() {
  return (
    <div className="entry-motif" aria-hidden="true">
      <svg viewBox="0 0 1600 240" preserveAspectRatio="none">
        <path className="entry-motif-track" pathLength="1" d="M0 170 C 220 40 400 250 620 130 S 1030 20 1240 150 S 1470 220 1600 90" />
        <path className="entry-motif-signal" pathLength="1" d="M0 170 C 220 40 400 250 620 130 S 1030 20 1240 150 S 1470 220 1600 90" />
      </svg>
    </div>
  )
}

function ServiceHeroMedia({ hero }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!hero.video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    videoRef.current?.play().catch(() => {})
  }, [hero.video])

  if (!hero.video) return <img src={hero.image} alt={hero.alt} loading="eager" />

  return (
    <video
      ref={videoRef}
      className="service-hero-video"
      controls
      loop
      muted
      playsInline
      preload="metadata"
      poster={hero.poster}
      aria-label={hero.alt}
    >
      <source src={hero.video} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
  )
}

function PlanCard({ plan, index }) {
  return (
    <Reveal as="article" delay={index * 90} className={`plan-card ${plan.popular ? 'is-popular' : ''}`}>
      {plan.popular ? <span className="plan-flag">Most Popular</span> : null}
      <header>
        <h3>{plan.name}</h3>
        {plan.billing ? <span className="plan-billing">{plan.billing}</span> : null}
      </header>
      <p className="plan-copy">{plan.copy}</p>
      {plan.bestFor ? (
        <p className="plan-bestfor">
          <strong>Best for:</strong> {plan.bestFor}
        </p>
      ) : null}
      <ul className="plan-list">
        {plan.included.map((item) => (
          <li key={item} className="is-yes">
            <span aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
        {plan.excluded.map((item) => (
          <li key={item} className="is-no">
            <span aria-hidden="true">✗</span>
            {item}
          </li>
        ))}
      </ul>
      <a className="kinetic-button group plan-cta" href="/contact/">
        <span>Request Pricing</span>
        <span className="button-island">
          <ArrowIcon className="size-4" />
        </span>
      </a>
    </Reveal>
  )
}

export function ServicePlans({ plans }) {
  return (
    <section className="plans-chapter chapter" id="plans">
      <div className="page-frame">
        <SectionHeading eyebrow={plans.eyebrow} title={plans.title} copy={plans.copy} />
        <div className={`plan-grid count-${plans.items.length}`}>
          {plans.items.map((plan, index) => (
            <PlanCard plan={plan} index={index} key={plan.name} />
          ))}
        </div>
        {plans.footnote ? <p className="plans-footnote">{plans.footnote}</p> : null}
      </div>
    </section>
  )
}

// Cross-links to the other real service and custom-work pages, in the same
// role the "related industries" block plays on an industry page.
function RelatedServices({ current }) {
  const siblings = [...services, ...customWorks].filter((item) => item.slug !== current)
  return (
    <section className="related-chapter chapter">
      <div className="page-frame">
        <SectionHeading eyebrow="More from Wavefront" title="Everything else we build." copy="One team, one roof — pick the next piece when your business is ready for it." />
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

export default function ServicePage({ service }) {
  const canonical = `/${service.slug}/`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.name,
        serviceType: service.name,
        description: service.metaDescription,
        url: `${siteOrigin}${canonical}`,
        areaServed: 'Worldwide',
        provider: { '@type': 'Organization', name: 'Wavefront Studio LLC', url: `${siteOrigin}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Wavefront Studio', item: `${siteOrigin}/` },
          { '@type': 'ListItem', position: 2, name: service.name, item: `${siteOrigin}${canonical}` },
        ],
      },
      ...(service.faqs
        ? [{
            '@type': 'FAQPage',
            mainEntity: service.faqs.map(([name, text]) => ({
              '@type': 'Question',
              name,
              acceptedAnswer: { '@type': 'Answer', text },
            })),
          }]
        : []),
    ],
  }

  return (
    <Layout
      className="service-page"
      seo={{ title: service.metaTitle, description: service.metaDescription, canonical, schema }}
    >
      <section className="service-entry chapter">
        <EntryMotif />
        <div className="page-frame service-entry-grid">
          <div className="service-entry-intro">
            <Reveal className="service-media">
              <ServiceHeroMedia hero={service.hero} />
              {!service.hero.video ? <span className="service-media-tag">Wavefront Studio</span> : null}
            </Reveal>
            <Reveal delay={80}>
              <span className="eyebrow">{service.nav}</span>
              <h1>{service.name}</h1>
              <p className="service-subhead">{service.subhead}</p>
              <div className="hero-actions">
                <a className="kinetic-button group" href={service.primaryCta?.href || '/contact/'}>
                  <span>{service.primaryCta?.label || 'Get a Free Consultation'}</span>
                  <span className="button-island">
                    <ArrowIcon className="size-4" />
                  </span>
                </a>
                <a className="text-link" href="#approach">
                  See how we work <ArrowIcon />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={140} id="service-form">
            <EnquiryForm
              heading={service.form?.heading || 'Tell us what you need.'}
              copy={service.form?.copy || 'Drop us a message and let’s discuss how we can help your business grow online.'}
              subjectDefault={service.name}
              source={service.slug}
              websiteField={service.form?.websiteField}
              submitLabel={service.form?.submitLabel}
            />
          </Reveal>
        </div>
      </section>

      <section className="service-approach chapter" id="approach">
        <div className="page-frame service-split">
          <div>
            <SectionHeading eyebrow="Our approach" title={service.approach.title} align="stack" />
            <div className="prose">
              {service.approach.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <Reveal className="service-approach-media">
            <img src={service.approach.image.image} alt={service.approach.image.alt} loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="service-capabilities chapter">
        <div className="page-frame">
          <SectionHeading
            eyebrow={service.featuresHeading?.eyebrow || 'Features'}
            title={service.featuresHeading?.title || 'What is included as standard.'}
            copy={service.featuresHeading?.copy || 'Every engagement covers this list. Anything specific to your business gets scoped on the call.'}
          />
          <div className="capability-grid">
            {service.features.map((feature, index) => (
              <Reveal as="article" key={feature} delay={index * 60} className="capability-card">
                <b>{String(index + 1).padStart(2, '0')}</b>
                <strong>{feature}</strong>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {service.extra ? (
        <section className="service-extra chapter">
          <div className="page-frame service-split is-reverse">
            <Reveal className="service-approach-media">
              <img src={service.extra.image} alt={service.extra.alt} loading="lazy" />
            </Reveal>
            <div>
              <SectionHeading eyebrow="Track record" title={service.extra.title} align="stack" />
              <div className="prose">
                {service.extra.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <ul className="tick-list">
                {service.extra.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="service-deliver chapter">
        <div className="page-frame service-deliver-grid">
          <div className="service-deliver-copy">
            <SectionHeading eyebrow="The outcome" title={service.deliver.title} dark align="stack" />
            <div className="prose on-dark">
              {service.deliver.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <SupportCallout />
          </div>
          <Reveal className="service-deliver-media">
            <img src={service.deliver.image} alt={service.deliver.alt} loading="lazy" />
          </Reveal>
        </div>
      </section>

      {service.plans ? <ServicePlans plans={service.plans} /> : null}

      {service.faqs ? (
        <FaqAccordion
          items={service.faqs}
          heading={{
            eyebrow: 'Common questions',
            title: service.faqHeading || `Questions about ${service.nav}.`,
            copy: 'Clear answers before you decide what to do next.',
          }}
          deskSub="Practical answers from our team"
        />
      ) : null}

      <Testimonials />

      <RelatedServices current={service.slug} />

      <CtaBand title={service.cta.title} copy={service.cta.copy} />
    </Layout>
  )
}
