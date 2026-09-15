import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, EnquiryForm, FaqAccordion, Reveal, SectionHeading, Testimonials } from '../components/shared.jsx'
import { EntryMotif, ServiceHeroMedia } from './ServicePage.jsx'
import { locations } from '../data/generated/locations.js'
import { services } from '../data/services.js'
import { statePages } from '../data/states.js'
import { isLive, publishDates } from '../data/schedule.js'
import { offerings } from '../data/site.js'
import {
  LOCAL_PLACES,
  absoluteUrl,
  breadcrumbs,
  byOrganization,
  locationDescriptions,
  locationSeoTitle,
  pageGraph,
  placeFromTitle,
  placeHeadline,
  webPage,
} from '../data/seo.js'

// Scheduled pages sit in the data before their date (src/data/schedule.js).
// Everything that lists or links places works from the live set only, so no
// page ever points at one that is not published yet.
export const liveLocations = locations.filter((item) => isLive(item.slug))
export const liveStates = statePages.filter((item) => isLive(item.slug))
export const placeName = (title) => title.replace(/^Web Design (?:&|and) SEO (?:for|in|on) /, '')

// Every place page opens on the studio's web design video, the same one the
// Web Development page plays.
const placeHero = services.find((service) => service.slug === 'web-development').hero

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', middot: '·', hellip: '…' }
const plainText = (html) => html
  .replace(/<[^>]+>/g, '')
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&([a-z]+);/g, (match, name) => ENTITIES[name] ?? match)
  .replace(/\s+/g, ' ')
  .trim()

// Each guide is written as one article with its own call-to-action boxes,
// question list and contact details. The service-page layout supplies those,
// so they are lifted out here: the opening paragraph becomes the hero line and
// the questions become the FAQ section. The guide's own "What we build"
// section stays, since it says how the services fit that market, but it is
// renamed so it does not repeat the services grid's heading.
function splitGuide(html, place) {
  let body = html
    .replace(/^\s*<p>[\s\S]*?<\/p>/, '')
    .replace(/<div class="lf-cta">[\s\S]*?<\/div><\/div><\/div>/g, '')
    .replace(/<h2>Talk to us<\/h2>[\s\S]*$/, '')
    .replace('<h2>What we build</h2>', `<h2>How it applies in ${place}</h2>`)
  const block = body.match(/<h2>Common questions<\/h2>([\s\S]*?)(?=<h2|$)/)
  const faqs = block
    ? [...block[1].matchAll(/<p><strong>([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g)].map(([, question, answer]) => [plainText(question), plainText(answer)])
    : []
  if (block) body = body.replace(block[0], '')
  return { body: body.trim(), faqs }
}

function Prose({ html }) {
  return <div className="longform" dangerouslySetInnerHTML={{ __html: html }} />
}

// A titled row of links to other place pages. Renders nothing when empty, so a
// section never appears before there is something to put in it.
export function PlaceLinks({ eyebrow, title, copy, items }) {
  if (!items.length) return null
  return (
    <section className="chapter related-chapter">
      <div className="page-frame">
        <SectionHeading eyebrow={eyebrow} title={title} copy={copy} />
        <div className="related-links">
          {items.map((item) => (
            <a key={item.slug} href={`/${item.slug}/`}>
              {item.name}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Every service and custom tool, so a place page sells the whole studio and
// not only websites.
function OfferingGrid({ place }) {
  return (
    <section className="offerings-chapter chapter" id="what-we-build">
      <div className="page-frame">
        <SectionHeading
          eyebrow="What we build"
          title={`Everything we build for ${place} businesses.`}
          copy="A website is one piece of it. Pick what your business needs now and add the rest when you are ready."
        />
        <div className="offering-grid">
          {offerings.map((item, index) => (
            <Reveal as="article" key={item.href} delay={index * 55} className="offering-card">
              <b>{String(index + 1).padStart(2, '0')}</b>
              <h3>{item.name}</h3>
              <p>{item.copy}</p>
              <a href={item.href} aria-label={`Learn more about ${item.name}`}>
                Learn More <ArrowIcon />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const offerCatalog = {
  '@type': 'OfferCatalog',
  name: 'Wavefront Studio services',
  itemListElement: offerings.map((item) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: item.name, url: absoluteUrl(item.href) },
  })),
}

// The service-page layout, filled from a place guide.
function PlaceLayout({ slug, title, heading, eyebrow, mediaTag, place, description, content, areaServed, children }) {
  const canonical = `/${slug}/`
  const url = absoluteUrl(canonical)
  const { body, faqs } = splitGuide(content, place)
  const schema = pageGraph(
    webPage({ path: canonical, name: heading, description }),
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: heading,
      serviceType: 'Web design, SEO, digital marketing and AI tools',
      description,
      url,
      provider: byOrganization,
      areaServed,
      hasOfferCatalog: offerCatalog,
    },
    breadcrumbs([['Home', '/'], ['Where We Work', '/locations/'], [heading, canonical]]),
    faqs.length
      ? {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          url,
          mainEntity: faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
        }
      : null,
  )

  return (
    <Layout
      className="service-page place-page"
      seo={{ title: locationSeoTitle(title), description, canonical, schema, modified: publishDates[slug] }}
    >
      <section className="service-entry chapter">
        <EntryMotif />
        <div className="page-frame service-entry-grid">
          <div className="service-entry-intro">
            <Reveal className="service-media">
              <ServiceHeroMedia hero={placeHero} />
              <span className="service-media-tag">{mediaTag}</span>
            </Reveal>
            <Reveal delay={80}>
              <span className="eyebrow">{eyebrow}</span>
              <h1>{heading}</h1>
              <p className="service-subhead">{description}</p>
              <div className="hero-actions">
                <a className="kinetic-button group" href="#service-form">
                  <span>Get a Free Consultation</span>
                  <span className="button-island">
                    <ArrowIcon className="size-4" />
                  </span>
                </a>
                <a className="text-link" href="#what-we-build">
                  See what we build <ArrowIcon />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={140} id="service-form">
            <EnquiryForm
              heading={`Tell us about your ${place} business.`}
              copy="Tell us what you're trying to do and we'll tell you honestly what we'd fix first."
              subjectDefault={`${place} project`}
              source={slug}
            />
          </Reveal>
        </div>
      </section>

      <OfferingGrid place={place} />

      <section className="chapter">
        <div className="page-frame">
          <Prose html={body} />
        </div>
      </section>

      {faqs.length ? (
        <FaqAccordion
          items={faqs}
          heading={{
            eyebrow: 'Common questions',
            title: `Straight answers for ${place} businesses.`,
            copy: 'The things worth settling before you get in touch.',
          }}
          deskSub="Answers from the team"
        />
      ) : null}

      <Testimonials />

      {children}

      <CtaBand
        title="Want a second opinion on your current site?"
        copy="We'll audit it for free and tell you what's holding it back, even if the answer is that you don't need a rebuild."
        label="Get a free audit"
        href="/free-audit/"
      />
    </Layout>
  )
}

export function LocationPage({ location }) {
  const { cities, state } = placeFromTitle(location.title)
  const name = placeName(location.title)
  const place = name.slice(0, name.lastIndexOf(', '))
  const local = LOCAL_PLACES.has(location.slug)
  // Same-state pages first, then the rest, so the links a visitor sees are the
  // ones most likely to be useful. The hub holds the full list.
  const others = locations
    .filter((item) => item.slug !== location.slug && isLive(item.slug))
    .sort((a, b) => Number(b.title.endsWith(`, ${state}`)) - Number(a.title.endsWith(`, ${state}`)))
    .slice(0, 11)
    .map((item) => ({ slug: item.slug, name: placeName(item.title) }))

  return (
    <PlaceLayout
      slug={location.slug}
      title={location.title}
      heading={placeHeadline(location.title)}
      eyebrow={local ? 'Near our Sarasota studio' : 'Working remotely from Sarasota'}
      mediaTag={local ? 'Within our driving range' : `Serving ${place} remotely`}
      place={place}
      description={locationDescriptions[location.slug] || location.description}
      content={location.content}
      // Anna Maria Island is three cities, not one, so it is described as a place.
      areaServed={cities.map((city) => ({
        '@type': /\bIsland\b/.test(city) ? 'Place' : 'City',
        name: city,
        containedInPlace: { '@type': 'State', name: state },
      }))}
    >
      <PlaceLinks
        eyebrow="Other markets"
        title="Everywhere else we work."
        items={[...others, { slug: 'locations', name: 'See every location' }]}
      />
    </PlaceLayout>
  )
}

export function StatePage({ page }) {
  const home = page.state === 'Florida'
  const cities = liveLocations.filter((item) => item.title.endsWith(`, ${page.state}`))
  const otherStates = liveStates.filter((item) => item.slug !== page.slug)

  return (
    <PlaceLayout
      slug={page.slug}
      title={page.title}
      heading={placeHeadline(page.title)}
      eyebrow={home ? 'Based in Sarasota, Florida' : 'Working remotely from Sarasota'}
      mediaTag={home ? 'Florida is home' : `Serving ${page.state} remotely`}
      place={page.state}
      description={page.description}
      content={page.content}
      areaServed={{ '@type': 'State', name: page.state }}
    >
      <PlaceLinks
        eyebrow={`Around ${page.state}`}
        title="City guides in this state."
        items={cities.map((item) => ({ slug: item.slug, name: placeName(item.title) }))}
      />
      <PlaceLinks
        eyebrow="Other states"
        title="More state guides."
        items={otherStates.map((item) => ({ slug: item.slug, name: item.state }))}
      />
    </PlaceLayout>
  )
}
