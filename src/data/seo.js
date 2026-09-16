// The search layer that sits on top of the page content: the structured data
// every page shares, and the titles and descriptions that differ from the
// on-page copy. Kept out of src/data/generated/ so the published text stays as
// it is and this file can change without touching it.
import { contact, siteOrigin } from './site.js'

export const absoluteUrl = (path = '/') => `${siteOrigin}${path}`

export const ORGANIZATION_ID = absoluteUrl('/#organization')
export const WEBSITE_ID = absoluteUrl('/#website')
export const byOrganization = { '@id': ORGANIZATION_ID }

// Carried on every page, so search engines and AI answer engines meet the same
// name, address and phone number wherever they arrive. The street address is
// the one the location pages already publish.
export const organization = {
  '@type': 'ProfessionalService',
  '@id': ORGANIZATION_ID,
  name: 'Wavefront Studio LLC',
  alternateName: 'Wavefront Studio',
  description: 'Wavefront Studio LLC is a full-service digital agency based in Sarasota, Florida and serving clients worldwide.',
  url: absoluteUrl('/'),
  logo: { '@type': 'ImageObject', url: absoluteUrl('/wave-logo.webp') },
  image: absoluteUrl('/og-card.png'),
  telephone: '+1-941-415-2595',
  email: contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4363 Independence Ct',
    addressLocality: 'Sarasota',
    addressRegion: 'FL',
    postalCode: '34234',
    addressCountry: 'US',
  },
  sameAs: [contact.instagram],
  knowsAbout: [
    'Website development',
    'Search engine optimization',
    'Mobile app development',
    'Digital marketing',
    'Social media strategy',
    'Graphic design',
    'AI chatbots',
    'Lead capture systems',
    'Product visualizers',
    'Custom web calculators',
  ],
}

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: absoluteUrl('/'),
  name: 'Wavefront Studio',
  alternateName: 'Wavefront Studio LLC',
  publisher: byOrganization,
  inLanguage: 'en-US',
}

// Every page's JSON-LD is one graph that opens with the business and the site,
// then adds whatever the page itself is about. Falsy entries are dropped so a
// page can pass optional nodes inline.
export function pageGraph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': [organization, website, ...nodes.filter(Boolean)] }
}

export function webPage({ type = 'WebPage', path, name, description, ...rest }) {
  return {
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    ...(description ? { description } : {}),
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
    ...rest,
  }
}

// trail: [['Home', '/'], ['Blog', '/blog/'], [post.title, '/some-post/']]
export function breadcrumbs(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

/* ------------------------------------------------------------------ */
/* Titles                                                              */
/* ------------------------------------------------------------------ */

const BRAND = ' | Wavefront Studio'

// Google shows roughly 60 characters of a title. Past that the brand suffix is
// the first thing cut, and Google already names the site above each result, so
// a long title goes out without it rather than ending in "| Wavefr…".
export const withBrand = (title) => (title.length + BRAND.length <= 62 ? `${title}${BRAND}` : title)

const STATE_CODES = {
  Arizona: 'AZ',
  California: 'CA',
  Colorado: 'CO',
  Florida: 'FL',
  Georgia: 'GA',
  'New York': 'NY',
  Texas: 'TX',
  Nevada: 'NV',
  'North Carolina': 'NC',
  'South Carolina': 'SC',
  Tennessee: 'TN',
}

// "Web Design & SEO for Phoenix, Mesa and Chandler, Arizona" → the cities and
// state the page is about. Every location title ends ", <State>".
export function placeFromTitle(title) {
  const place = title.replace(/^Web Design (?:&|and) SEO (?:for|in|on) /, '')
  const cut = place.lastIndexOf(', ')
  const state = place.slice(cut + 2)
  const cities = place.slice(0, cut).split(/,\s*|\s+and\s+/)
  return { cities, state, stateCode: STATE_CODES[state] }
}

// Place pages cover every service, not only web design, so the title names the
// three people search for most. The short state code is how people search
// ("web design tampa fl") and keeps most titles near the length Google shows.
export function locationSeoTitle(title) {
  const broad = title.replace(/^Web Design (?:&|and) SEO /, 'Web Design, SEO & Marketing ')
  const { state, stateCode } = placeFromTitle(title)
  return withBrand(stateCode ? broad.replace(new RegExp(`, ${state}$`), `, ${stateCode}`) : broad)
}

// The on-page heading for a place page: the full range, in plain words.
export const placeHeadline = (title) => title.replace(/^Web Design (?:&|and) SEO /, 'Websites, SEO, Marketing & AI ')

// Places within about an hour of the studio, where we can meet in person. Every
// other place page says plainly that the work happens remotely.
export const LOCAL_PLACES = new Set([
  'web-design-sarasota-fl', 'web-design-lakewood-ranch-fl', 'web-design-bradenton-fl', 'web-design-venice-fl',
  'web-design-north-port-fl', 'web-design-palmetto-fl', 'web-design-osprey-nokomis-fl', 'web-design-englewood-fl',
  'web-design-tampa-fl', 'web-design-st-petersburg-fl', 'web-design-port-charlotte-fl', 'web-design-punta-gorda-fl',
  'web-design-parrish-ellenton-fl', 'web-design-anna-maria-island-fl', 'web-design-longboat-key-fl',
])

export const homeSeo = {
  title: 'Web Design & SEO Agency in Sarasota, FL | Wavefront Studio',
  description:
    'Sarasota web design and SEO agency building fast websites, local SEO, AI chatbots and quote tools that bring in work. Get a free website audit today.',
}

export const blogSeo = {
  title: 'Web Design, SEO & Marketing Blog | Wavefront Studio',
  description: 'Practical writing on websites, SEO, marketing and automation for businesses that want the work to pay for itself.',
}

export const locationsHubTitle = 'Web Design & SEO Service Areas | Wavefront Studio'

// 1200x630 JPEG copies of the post cards, written by scripts/prerender.mjs.
// The on-site cards are webp, which LinkedIn's crawler will not display.
export const postShareImage = (post) => (post.image ? `/images/blog/og/${post.slug}.jpg` : null)

/* ------------------------------------------------------------------ */
/* Descriptions                                                        */
/* ------------------------------------------------------------------ */

// Search results show about 155 characters. These replace location
// descriptions that ran longer, using only facts each page already states.
// A slug that is not listed keeps the description from locations.js.
export const locationDescriptions = {
  'web-design-phoenix-az':
    'Websites, SEO and lead systems for businesses across the Valley, from a four-person studio in Sarasota, Florida, that works with Arizona clients remotely.',
  'web-design-jacksonville-fl':
    "Websites, SEO and lead systems for Jacksonville businesses. We're in Sarasota, about 240 miles south, and we're upfront that we work with you remotely.",
  'web-design-denver-co':
    "Wavefront Studio builds websites, SEO and lead systems for Denver-area businesses. We're a four-person studio in Sarasota, Florida, working with you remotely.",
  'web-design-charlotte-nc':
    "Websites, SEO and lead systems for businesses across the Charlotte region. We're a small studio in Sarasota, Florida, and we work with you remotely.",
  'web-design-sarasota-fl':
    'Wavefront Studio, at 4363 Independence Ct, builds websites, runs SEO and paid ads, and makes AI chatbots and quote calculators for Sarasota businesses.',
  'web-design-lakewood-ranch-fl':
    "Websites, SEO and marketing for Lakewood Ranch businesses on Main Street, at Waterside Place and in the CORE business park. We're 15 minutes away in Sarasota.",
  'web-design-bradenton-fl':
    "Websites, SEO campaigns and lead systems for businesses in Bradenton and across Manatee County. We're 20 minutes down the Tamiami Trail in Sarasota.",
  'web-design-venice-fl':
    "Websites, SEO and lead systems for businesses on Venice Island, along Jacaranda and on the US 41 Bypass. We're 25 minutes north in Sarasota.",
  'web-design-north-port-fl':
    "Websites, SEO and lead systems for North Port businesses along US 41, Sumter Boulevard and Toledo Blade. We're 40 minutes north in Sarasota.",
  'web-design-palmetto-fl':
    "Websites, SEO and lead systems for Palmetto businesses on 10th Avenue West and along US 41 and US 301. We're half an hour south in Sarasota.",
  'web-design-osprey-nokomis-fl':
    "Websites, SEO and lead systems for Osprey and Nokomis businesses along US 41, Albee Road and the Laurel Road corridor. We're 15 minutes north in Sarasota.",
  'web-design-englewood-fl':
    "Websites, SEO and lead systems for Englewood businesses on West Dearborn Street, along SR 776 and out on Manasota Key. We're 50 minutes north in Sarasota.",
  'web-design-st-petersburg-fl':
    "Websites, SEO and lead systems for St. Petersburg businesses in the EDGE District, Grand Central and Downtown. We're in Sarasota, under an hour away.",
  'web-design-raleigh-nc':
    'Websites, SEO and lead systems for businesses in Raleigh, Cary and the rest of Wake County, from a four-person studio in Sarasota, Florida, working remotely.',
}

// The scraped legal pages carried their first heading as a description
// ("1. Introduction"), which is what Google would otherwise show.
export const legalDescriptions = {
  'terms-of-use':
    'The terms that govern your use of wavefrontstudiollc.com and the services and applications Wavefront Studio LLC provides.',
  'privacy-policy':
    'How Wavefront Studio LLC collects, uses, stores and protects the personal information you share through wavefrontstudiollc.com and our services.',
  'cookie-policy':
    'What cookies are, which ones wavefrontstudiollc.com uses and why, and the choices you have about them.',
  'sms-policy':
    'How the Wavefront Studio LLC text messaging program works, what you agree to when you opt in, and how we handle your mobile number.',
}
