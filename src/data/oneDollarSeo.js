// Search layer for /1-dollar-website/: title, description, JSON-LD and share
// image. The page calls oneDollarSeo({ ended }) once the build time is known;
// after the Black Friday deal closes the same page keeps its URL and a 200
// status, but stops advertising an offer that no longer exists.
import { ONE_DOLLAR } from './oneDollarSite.js'
import { ONE_DOLLAR_FAQ } from './oneDollarPage.js'
import { absoluteUrl, byOrganization, pageGraph, webPage } from './seo.js'

const PATH = '/1-dollar-website/'
const OG_IMAGE = '/images/1-dollar-website-og.png'

const LIVE_TITLE = '$1 Website for Small Business: 15 Designs | Wavefront Studio'
const LIVE_DESCRIPTION =
  'A five page business website for $1 to set up. Pick one of 15 designs and we build it from your details. Hosting $99 a month, 12 month minimum. Ends Dec 1.'
const ENDED_TITLE = 'The $1 Website offer has ended | Wavefront Studio'
const ENDED_DESCRIPTION =
  'The $1 Website Black Friday deal closed on December 1, 2026. Build a website quote in our package builder and we reply within two working days.'

const faqPage = () => ({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl(PATH)}#faq`,
  url: absoluteUrl(PATH),
  isPartOf: { '@id': `${absoluteUrl(PATH)}#webpage` },
  mainEntity: ONE_DOLLAR_FAQ.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

const service = () => ({
  '@type': 'Service',
  '@id': `${absoluteUrl(PATH)}#service`,
  name: '$1 Website',
  serviceType: 'Small business website design and hosting',
  description: LIVE_DESCRIPTION,
  url: absoluteUrl(PATH),
  provider: byOrganization,
  areaServed: 'US',
  offers: {
    '@type': 'Offer',
    url: absoluteUrl(PATH),
    price: String(ONE_DOLLAR.setup),
    priceCurrency: 'USD',
    validFrom: '2026-11-12T00:00:00-05:00',
    validThrough: '2026-12-01T23:59:59-05:00',
    availability: 'https://schema.org/InStock',
    seller: byOrganization,
    priceSpecification: [
      {
        '@type': 'UnitPriceSpecification',
        name: 'Setup',
        price: String(ONE_DOLLAR.setup),
        priceCurrency: 'USD',
      },
      {
        '@type': 'UnitPriceSpecification',
        name: `Hosting, ${ONE_DOLLAR.minMonths} month minimum`,
        price: String(ONE_DOLLAR.hosting),
        priceCurrency: 'USD',
        unitText: 'month',
      },
    ],
  },
})

export function oneDollarSeo({ ended = false } = {}) {
  const title = ended ? ENDED_TITLE : LIVE_TITLE
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
    imageAlt: '$1 website. 15 designs. Ends Dec 1. Wavefront Studio',
  }
}
