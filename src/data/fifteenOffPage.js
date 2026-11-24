// Shared by the 15% off page (copy, FAQ) and its SEO build (JSON-LD, sitemap).
// What each service covers is read from src/data/services.js, so the page can
// never promise something the service pages do not.
import { services } from './services.js'
import { HOLIDAY_WINDOW } from '../holidayWindow.js'

export const FIFTEEN_OFF_PATH = '/15-off/'
export const FIFTEEN_OFF_ENDS = HOLIDAY_WINDOW.endsLabel

const service = (slug) => services.find((item) => item.slug === slug)
const pick = (slug, indexes) => indexes.map((index) => service(slug).features[index])

// Paid ads management is the ad side of Digital Marketing. Email and funnels
// are not part of this offer, so they are left out here.
export const FIFTEEN_OFF_SERVICES = [
  {
    id: 'ads',
    title: 'Paid ads management',
    href: '/digital-marketing/',
    linkLabel: 'See how Digital Marketing works',
    summary: 'Google Ads and paid social on Facebook, Instagram and TikTok, with tracking and monthly reviews.',
    covers: pick('digital-marketing', [0, 1, 5, 6, 7]),
  },
  {
    id: 'brand',
    title: 'Brand design',
    href: '/graphic-design/',
    linkLabel: 'See how Graphic Design works',
    summary: 'Custom logo design and a full brand identity, with brand guidelines and files ready to use.',
    covers: pick('graphic-design', [0, 1, 2, 5, 6]),
  },
]

export const FIFTEEN_OFF_CHOICES = [
  { value: 'Paid ads management', note: FIFTEEN_OFF_SERVICES[0].summary },
  { value: 'Brand design', note: FIFTEEN_OFF_SERVICES[1].summary },
  { value: 'Both', note: 'Ads management and brand design together, in one request.' },
]

export const FIFTEEN_OFF_STEPS = [
  'Pick what you need.',
  'Send a short request.',
  'We reply within two working days with a quote at 15% off.',
  'We start once you say yes.',
]

export const FIFTEEN_OFF_FAQ = [
  ['How does the 15% off work?', 'Tell us whether you want paid ads management, brand design or both. We reply with a quote that has 15% off your first 3 months. Nothing is charged on this page.'],
  ['How long does the offer last?', `It is a Black Friday offer. Send your request by ${FIFTEEN_OFF_ENDS} and you get 15% off your first 3 months. After that the offer ends.`],
  ['What do I get for paid ads management?', `${service('digital-marketing').features[0]}, Facebook, Instagram and TikTok advertising, retargeting, tracking with ROI reporting, and monthly strategy reviews. The full list is on our Digital Marketing page.`],
  ['What do I get for brand design?', `${service('graphic-design').features[0]}, social media graphics and templates, print materials such as business cards and flyers, brand guidelines, and print-ready and digital-ready files. The full list is on our Graphic Design page.`],
  ['Do I pay anything on this page?', 'No. There is no card checkout here. You send a short request, and we reply with your quote.'],
  ['How soon will I hear back?', 'We reply within two working days with a quote at 15% off.'],
]
