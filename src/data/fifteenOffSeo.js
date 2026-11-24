// Search layer for /15-off/: title, description, JSON-LD and share image.
// The page calls fifteenOffSeo({ ended }) once the build time is known; after
// the Black Friday window closes the same page keeps its URL and a 200 status
// but stops advertising an offer that no longer exists (same as oneDollarSeo.js).
import { FIFTEEN_OFF_FAQ, FIFTEEN_OFF_PATH as PATH } from './fifteenOffPage.js'
import { absoluteUrl, byOrganization, pageGraph, webPage } from './seo.js'

const OG_IMAGE = '/images/15-off-og.png'

export const FIFTEEN_OFF_LIVE_TITLE = '15% Off Paid Ads and Brand Design | Wavefront Studio'
export const FIFTEEN_OFF_ENDED_TITLE = 'The 15% off offer has ended | Wavefront Studio'
const LIVE_DESCRIPTION =
  'Black Friday: 15% off paid ads management and brand design for your first 3 months. Send a short request, get a quote in two working days. Ends Dec 1.'
const ENDED_DESCRIPTION =
  'The 15% off paid ads and brand design offer closed on December 1, 2026. Send us a request and we reply within two working days.'

const faqPage = () => ({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl(PATH)}#faq`,
  url: absoluteUrl(PATH),
  isPartOf: { '@id': `${absoluteUrl(PATH)}#webpage` },
  mainEntity: FIFTEEN_OFF_FAQ.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

const service = () => ({
  '@type': 'Service',
  '@id': `${absoluteUrl(PATH)}#service`,
  name: 'Paid ads management and brand design',
  serviceType: 'Paid advertising management and brand design',
  description: LIVE_DESCRIPTION,
  url: absoluteUrl(PATH),
  provider: byOrganization,
  areaServed: 'US',
  offers: {
    '@type': 'Offer',
    name: '15% off your first 3 months',
    description: '15% off paid ads management and brand design for your first 3 months. Black Friday only.',
    url: absoluteUrl(PATH),
    validFrom: '2026-11-12T00:00:00-05:00',
    validThrough: '2026-12-01T23:59:59-05:00',
    availability: 'https://schema.org/InStock',
    seller: byOrganization,
  },
})

export function fifteenOffSeo({ ended = false } = {}) {
  const title = ended ? FIFTEEN_OFF_ENDED_TITLE : FIFTEEN_OFF_LIVE_TITLE
  const description = ended ? ENDED_DESCRIPTION : LIVE_DESCRIPTION
  const page = webPage({
    path: PATH,
    name: title,
    description,
    dateModified: '2026-11-24',
    ...(ended ? {} : { primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(OG_IMAGE), width: 1200, height: 630 } }),
  })

  if (ended) {
    return { title, description, canonical: PATH, modified: '2026-11-24', schema: pageGraph(page) }
  }

  return {
    title,
    description,
    canonical: PATH,
    modified: '2026-11-24',
    schema: pageGraph(page, service(), faqPage()),
    image: OG_IMAGE,
    imageType: 'image/png',
    imageAlt: '15% off ads management and brand design. Ends Dec 1. Wavefront Studio',
  }
}
