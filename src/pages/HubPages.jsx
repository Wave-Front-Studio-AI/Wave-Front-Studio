import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand } from '../components/shared.jsx'
import { customWorks } from '../data/customWorks.js'
import { services } from '../data/services.js'
import { siteOrigin } from '../data/site.js'
import { breadcrumbs, pageGraph, webPage } from '../data/seo.js'

// Only real media: a frame from the studio's own video, or a screenshot of a
// tool it built. Anything without one is listed as text.
const customWorkImages = {
  'live-visualizer': {
    src: '/images/After-Visuilize.webp',
    alt: 'A live visualiser preview showing a resin-bound path laid through a garden',
  },
  'custom-calculators': {
    src: '/images/calc.webp',
    alt: 'The ResinRock material calculator, showing a price breakdown for a patio project',
  },
}

function hubImage(item, kind) {
  if (kind === 'custom') return customWorkImages[item.slug] || null
  return item.hero.poster ? { src: item.hero.poster, alt: '' } : null
}

function HubRow({ item, kind }) {
  const image = hubImage(item, kind)
  return (
    <li className={`hub-row ${image ? 'has-media' : ''}`}>
      <a href={`/${item.slug}/`}>
        <span className="hub-row-copy">
          <h2>
            {item.nav || item.name} <ArrowIcon />
          </h2>
          <p>{item.metaDescription}</p>
        </span>
        {image ? (
          <span className="hub-row-media">
            <img src={image.src} alt={image.alt} loading="lazy" />
          </span>
        ) : null}
      </a>
    </li>
  )
}

function HubPage({ canonical, crumb, title, intro, items, kind, seoTitle, seoDescription, cta }) {
  const schema = pageGraph(
    webPage({
      type: 'CollectionPage',
      path: canonical,
      name: title,
      description: seoDescription,
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
    }),
    breadcrumbs([['Home', '/'], [crumb, canonical]]),
  )

  return (
    <Layout className="hub-page" seo={{ title: seoTitle, description: seoDescription, canonical, schema }}>
      <section className="hub-hero">
        <div className="page-frame hub-hero-copy">
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>

      <section className="hub-directory chapter">
        <div className="page-frame">
          <ul className="hub-list">
            {items.map((item) => (
              <HubRow item={item} kind={kind} key={item.slug} />
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={cta.title} copy={cta.copy} label={cta.label} href="/contact/" secondary={['See our work', '/portfolio/']} />
    </Layout>
  )
}

export function ServicesHubPage() {
  return (
    <HubPage
      canonical="/services/"
      crumb="Our Services"
      title="Web, search, design and marketing services"
      intro="Everything the studio offers, from websites and SEO to design, marketing, audits and lead capture. Start with one and add the others when you need them."
      items={services}
      kind="service"
      seoTitle="Digital Agency Services | Wavefront Studio"
      seoDescription="Explore Wavefront Studio services for web development, SEO, apps, social media, graphic design, digital marketing, website audits, and lead capture."
      cta={{
        title: 'Not sure which service you need?',
        copy: 'Tell us what you want to improve and we will suggest where to start.',
        label: 'Talk to the studio',
      }}
    />
  )
}

export function CustomWorksHubPage() {
  return (
    <HubPage
      canonical="/custom-works/"
      crumb="Custom Works"
      title="Custom tools for the way you sell"
      intro="AI chatbots, live product visualisers and quote calculators, each built around your own products, prices and customer questions."
      items={customWorks}
      kind="custom"
      seoTitle="Custom Digital Tools & AI Solutions | Wavefront Studio"
      seoDescription="Explore Wavefront Studio’s custom AI chatbot systems, live product visualizers, and online calculators built around your customer journey and sales process."
      cta={{
        title: 'Need a tool that does not exist yet?',
        copy: 'Show us the part of your sales process that eats the most time and we will tell you how we would build a tool for it.',
        label: 'Start a custom project',
      }}
    />
  )
}
