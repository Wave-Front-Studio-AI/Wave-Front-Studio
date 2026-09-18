import { useEffect, useRef } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, EnquiryForm, FaqAccordion, SectionHeading, SupportCallout, Testimonials } from '../components/shared.jsx'
import { services } from '../data/services.js'
import { customWorks } from '../data/customWorks.js'
import { siteOrigin } from '../data/site.js'
import { breadcrumbs, byOrganization, pageGraph } from '../data/seo.js'

// The studio's own promo videos. Pages without one show no hero media at all
// rather than a stock photo. With autoPlay off, only the poster loads until
// someone presses play, which keeps an ad landing page light on a phone.
export function ServiceHeroMedia({ hero, autoPlay = true }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!autoPlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    videoRef.current?.play().catch(() => {})
  }, [hero.video, autoPlay])

  return (
    <video
      ref={videoRef}
      className="service-hero-video"
      controls
      loop
      muted
      playsInline
      preload={autoPlay ? 'metadata' : 'none'}
      poster={hero.poster}
      aria-label={hero.alt}
    >
      <source src={hero.video} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
  )
}

function PlanCard({ plan }) {
  return (
    <article className={`plan-card ${plan.popular ? 'is-popular' : ''}`}>
      {plan.popular ? <span className="plan-flag">Most popular</span> : null}
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
        <span>Request pricing</span>
        <span className="button-island">
          <ArrowIcon className="size-4" />
        </span>
      </a>
    </article>
  )
}

export function ServicePlans({ plans }) {
  return (
    <section className="plans-chapter chapter" id="plans">
      <div className="page-frame">
        <SectionHeading title={plans.title} copy={plans.copy} />
        <div className={`plan-grid count-${plans.items.length}`}>
          {plans.items.map((plan) => (
            <PlanCard plan={plan} key={plan.name} />
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

export default function ServicePage({ service }) {
  const canonical = `/${service.slug}/`
  const url = `${siteOrigin}${canonical}`
  const schema = pageGraph(
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: service.name,
      serviceType: service.name,
      description: service.metaDescription,
      url,
      areaServed: 'Worldwide',
      provider: byOrganization,
    },
    breadcrumbs([['Home', '/'], ['Our Services', '/services/'], [service.name, canonical]]),
    service.faqs
      ? {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          url,
          mainEntity: service.faqs.map(([name, text]) => ({
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text },
          })),
        }
      : null,
  )

  const serviceForm = (
    <EnquiryForm
      heading={service.form?.heading || 'Tell us what you need'}
      copy={service.form?.copy || 'A few lines about the business and the problem is enough. We reply within one to two working days.'}
      subjectDefault={service.name}
      source={service.slug}
      websiteField={service.form?.websiteField}
      essentialOnly={service.form?.essentialOnly}
      submitLabel={service.form?.submitLabel}
    />
  )

  return (
    <Layout
      className={service.landing ? 'service-page is-landing-page' : 'service-page'}
      seo={{ title: service.metaTitle, description: service.metaDescription, canonical, schema }}
    >
      <section className="service-entry chapter">
        {service.landing ? (
          // Ad landing layout: the form sits right under the headline (beside
          // it on a wide screen), and the video waits below until played.
          <div className="page-frame service-entry-grid is-landing">
            <div className="service-landing-intro">
              <h1>{service.name}</h1>
              <p className="service-subhead">{service.subhead}</p>
              {service.landingNote ? <p className="service-landing-note">{service.landingNote}</p> : null}
            </div>
            <div id="service-form" className="service-landing-form">
              {serviceForm}
            </div>
            {service.hero.video ? (
              <div className="service-media service-landing-media">
                <ServiceHeroMedia hero={service.hero} autoPlay={false} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="page-frame service-entry-grid">
            <div className="service-entry-intro">
              {service.hero.video ? (
                <div className="service-media">
                  <ServiceHeroMedia hero={service.hero} />
                </div>
              ) : null}
              <div>
                <h1>{service.name}</h1>
                <p className="service-subhead">{service.subhead}</p>
                <div className="hero-actions">
                  <a className="kinetic-button group" href={service.primaryCta?.href || '/contact/'}>
                    <span>{service.primaryCta?.label || 'Get a free consultation'}</span>
                    <span className="button-island">
                      <ArrowIcon className="size-4" />
                    </span>
                  </a>
                  <a className="text-link" href="#approach">
                    See how we work <ArrowIcon />
                  </a>
                </div>
              </div>
            </div>
            <div id="service-form">{serviceForm}</div>
          </div>
        )}
      </section>

      {/* Images are optional: a section only gets one when there is a real
          screenshot of client work to show, otherwise the text runs alone. */}
      <section className="service-approach chapter" id="approach">
        <div className={`page-frame ${service.approach.image ? 'service-split' : 'service-single'}`}>
          <div>
            <SectionHeading title={service.approach.title} align="stack" />
            <div className="prose">
              {service.approach.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
          {service.approach.image ? (
            <figure className="service-approach-media">
              <img src={service.approach.image.image} alt={service.approach.image.alt} loading="lazy" />
              {service.approach.image.caption ? <figcaption>{service.approach.image.caption}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      </section>

      <section className="service-capabilities chapter">
        <div className="page-frame">
          <SectionHeading
            title={service.featuresHeading?.title || 'Included as standard'}
            copy={service.featuresHeading?.copy || 'Every project covers this list. Anything specific to your business gets scoped on the call.'}
          />
          <ul className="tick-list is-columns">
            {service.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      {service.extra ? (
        <section className="service-extra chapter">
          <div className={`page-frame ${service.extra.image ? 'service-split is-reverse' : 'service-single'}`}>
            {service.extra.image ? (
              <div className="service-approach-media">
                <img src={service.extra.image} alt={service.extra.alt} loading="lazy" />
              </div>
            ) : null}
            <div>
              <SectionHeading title={service.extra.title} align="stack" />
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
        <div className={`page-frame ${service.deliver.image ? 'service-deliver-grid' : 'service-single'}`}>
          <div className="service-deliver-copy">
            <SectionHeading title={service.deliver.title} dark align="stack" />
            <div className="prose on-dark">
              {service.deliver.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <SupportCallout />
          </div>
          {service.deliver.image ? (
            <figure className="service-deliver-media">
              <img src={service.deliver.image} alt={service.deliver.alt} loading="lazy" />
              {service.deliver.caption ? <figcaption>{service.deliver.caption}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      </section>

      {service.plans ? <ServicePlans plans={service.plans} /> : null}

      {service.faqs ? (
        <FaqAccordion
          items={service.faqs}
          heading={{
            title: service.faqHeading || `Questions about ${service.nav}`,
            copy: 'Worth settling before you decide what to do next.',
          }}
        />
      ) : null}

      <Testimonials />

      <RelatedServices current={service.slug} />

      <CtaBand title={service.cta.title} copy={service.cta.copy} />
    </Layout>
  )
}
