import Layout from '../components/Layout.jsx'
import { CtaBand } from '../components/shared.jsx'
import { PlaceLinks, liveLocations, liveStates, placeName } from './PlacePage.jsx'
import { locationsHub } from '../data/generated/locations.js'
import { publishDates } from '../data/schedule.js'
import { absoluteUrl, breadcrumbs, locationsHubTitle, pageGraph, webPage } from '../data/seo.js'

// Pre-cleaned HTML from the content pipeline, styled by the .longform rules.
function Prose({ html }) {
  return <div className="longform" dangerouslySetInnerHTML={{ __html: html }} />
}

/* ------------------------------------------------------------------ */
/* Locations hub                                                       */
/* ------------------------------------------------------------------ */

export function LocationsPage() {
  // National city guides are the scheduled location pages; the local and
  // remote-metro pages are already described in the hub copy above them.
  const remoteCities = liveLocations.filter((item) => item.slug in publishDates)
  const guides = [
    ...liveStates.map((item) => ({ slug: item.slug, name: item.state })),
    ...remoteCities.map((item) => ({ slug: item.slug, name: placeName(item.title) })),
  ]
  const schema = pageGraph(
    webPage({
      type: 'CollectionPage',
      path: '/locations/',
      name: locationsHub.title,
      description: locationsHub.description,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: liveLocations.length + liveStates.length,
        itemListElement: [...liveLocations, ...liveStates].map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: absoluteUrl(`/${item.slug}/`),
        })),
      },
    }),
    breadcrumbs([['Home', '/'], ['Where We Work', '/locations/']]),
  )

  return (
    <Layout
      className="locations-page"
      seo={{ title: locationsHubTitle, description: locationsHub.description, canonical: '/locations/', schema }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <h1>{locationsHub.title}</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <Prose html={locationsHub.content} />
        </div>
      </section>

      <PlaceLinks
        title="State and city guides."
        copy="Places we serve remotely from Sarasota. Each guide starts from that market’s own census numbers and what they mean for a small business website."
        items={guides}
      />

      <CtaBand
        title="Not sure how you rank in your city right now?"
        copy="We will audit your site for free and tell you what is actually holding it back, including if the answer is that you do not need a rebuild."
        label="Get a free audit"
      />
    </Layout>
  )
}
