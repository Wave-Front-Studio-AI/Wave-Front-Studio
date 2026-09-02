import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, Reveal } from '../components/shared.jsx'
import { customWorks } from '../data/customWorks.js'
import { services } from '../data/services.js'
import { siteOrigin } from '../data/site.js'

const customWorkImages = {
  'ai-chatbot': {
    src: '/images/ai-development.webp',
    alt: 'Wavefront Studio AI development and automation service',
  },
  'live-visualizer': {
    src: '/images/After-Visuilize.webp',
    alt: 'Live product visualizer showing a finished product preview',
  },
  'custom-calculators': {
    src: '/images/calc.webp',
    alt: 'Custom online calculator interface built by Wavefront Studio',
  },
}

function HubCard({ item, index, kind }) {
  const image = kind === 'service'
    ? { src: item.hero.hubImage || item.hero.image, alt: item.hero.hubAlt || item.hero.alt }
    : customWorkImages[item.slug] || {
        src: '/wave-logo.webp',
        alt: `${item.nav || item.name} by Wavefront Studio`,
      }

  return (
    <Reveal as="article" className="hub-card" delay={(index % 3) * 80}>
      <a className="hub-card-link" href={`/${item.slug}/`} aria-label={`Explore ${item.nav || item.name}`}>
        <span className="hub-card-media">
          <img src={image.src} alt={image.alt} loading="lazy" />
          <span className="hub-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </span>
        <span className="hub-card-copy">
          <span className="eyebrow">{kind === 'service' ? 'Service' : 'Custom solution'}</span>
          <h3>{item.nav || item.name}</h3>
          <p>{item.metaDescription}</p>
          <span className="hub-card-action">
            Explore {item.nav || item.name} <ArrowIcon />
          </span>
        </span>
      </a>
    </Reveal>
  )
}

function HubPage({ canonical, eyebrow, title, intro, items, kind, seoTitle, seoDescription, cta }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: title,
        description: seoDescription,
        url: `${siteOrigin}${canonical}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.nav || item.name,
            url: `${siteOrigin}/${item.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteOrigin}/` },
          { '@type': 'ListItem', position: 2, name: eyebrow, item: `${siteOrigin}${canonical}` },
        ],
      },
    ],
  }

  return (
    <Layout
      className="hub-page"
      seo={{ title: seoTitle, description: seoDescription, canonical, schema }}
    >
      <section className="hub-hero">
        <div className="hub-orbit hub-orbit-one" aria-hidden="true" />
        <div className="hub-orbit hub-orbit-two" aria-hidden="true" />
        <div className="page-frame hub-hero-inner">
          <Reveal className="hub-hero-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{intro}</p>
          </Reveal>
          <Reveal className="hub-hero-aside" delay={120}>
            <span>{String(items.length).padStart(2, '0')}</span>
            <p>{kind === 'service' ? 'ways to move your business forward' : 'purpose-built tools for more capable customer journeys'}</p>
            <a className="text-link on-dark" href="#hub-directory">
              Explore the collection <ArrowIcon />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="hub-directory chapter" id="hub-directory" tabIndex="-1">
        <div className="page-frame">
          <Reveal className="hub-directory-head">
            <span className="eyebrow">Explore the collection</span>
            <h2>Choose where you want to grow next.</h2>
            <p>Every engagement is shaped around your goals, customers, and existing technology—not a one-size-fits-all package.</p>
          </Reveal>
          <div className={`hub-grid hub-grid-${kind}`}>
            {items.map((item, index) => (
              <HubCard item={item} index={index} kind={kind} key={item.slug} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow={cta.eyebrow}
        title={cta.title}
        copy={cta.copy}
        label={cta.label}
        href="/contact/"
        secondary={['See our work', '/portfolio/']}
      />
    </Layout>
  )
}

export function ServicesHubPage() {
  return (
    <HubPage
      canonical="/services/"
      eyebrow="Our Services"
      title="Digital Services Built Around Your Business"
      intro="Explore Wavefront Studio’s complete range of web, search, design, marketing, audit, and lead-capture services—connected by one strategy and built to create measurable progress."
      items={services}
      kind="service"
      seoTitle="Digital Agency Services | Wavefront Studio"
      seoDescription="Explore Wavefront Studio services for web development, SEO, apps, social media, graphic design, digital marketing, website audits, and lead capture."
      cta={{
        eyebrow: 'Let’s find the right fit',
        title: 'Not Sure Which Service You Need?',
        copy: 'Tell us what you want to improve. We’ll help you identify the clearest next step and the right mix of services for your goals.',
        label: 'Talk to Our Team',
      }}
    />
  )
}

export function CustomWorksHubPage() {
  return (
    <HubPage
      canonical="/custom-works/"
      eyebrow="Custom Works"
      title="Custom Digital Tools Built for the Way You Sell"
      intro="Explore AI chatbots, live product visualizers, and smart web calculators built around real customer questions, sales workflows, and business logic."
      items={customWorks}
      kind="custom"
      seoTitle="Custom Digital Tools & AI Solutions | Wavefront Studio"
      seoDescription="Explore Wavefront Studio’s custom AI chatbot systems, live product visualizers, and online calculators built around your customer journey and sales process."
      cta={{
        eyebrow: 'Built around your idea',
        title: 'Need a Tool That Does Not Exist Yet?',
        copy: 'Show us the workflow, bottleneck, or customer experience you want to improve. We’ll help shape it into a practical custom solution.',
        label: 'Start a Custom Project',
      }}
    />
  )
}
