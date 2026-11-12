// The $1 Website: a template site for a $1 setup fee and $99 a month hosting, with a 12 month minimum.
// Kept apart from src/data/generated/packages.js so a regeneration of that file cannot remove it.
import { CATEGORIES, DETAILS, SERVICES } from './generated/packages.js'
import { HOLIDAY_WINDOW, holidayDealActive } from '../holidayWindow.js'

// The $1 setup is a Black Friday deal: it runs inside the sale window and ends with it.
export const ONE_DOLLAR_WINDOW = HOLIDAY_WINDOW
export const oneDollarActive = holidayDealActive

export const ONE_DOLLAR = {
  id: 'site1',
  setup: 1,
  hosting: 99,
  minMonths: 12,
  // What a customer pays over the minimum term: $1 plus 12 months of hosting.
  get minTotal() {
    return this.setup + this.hosting * this.minMonths
  },
}

export const ONE_DOLLAR_SERVICE = {
  id: ONE_DOLLAR.id,
  name: '$1 Website',
  blurb: 'Black Friday deal, ends December 1. Pick one of 15 ready-made designs. You send us your details and we build it. $1 to set up, then $99 a month for hosting, with a 12 month minimum.',
  billing: 'hybrid',
  // `flat` keeps it out of the bundle count and every discount. See calculateQuote.
  flat: true,
  tiers: [{ n: 'Template site', s: ONE_DOLLAR.setup, m: ONE_DOLLAR.hosting, note: 'Up to 5 pages, hosting included. 12 month minimum.' }],
  addons: [
    { l: 'Extra page', p: 150, t: 'onetime' },
    { l: 'Copywriting (per page)', p: 120, t: 'onetime' },
  ],
}

export const ONE_DOLLAR_DETAILS = [
  ['Pages included', 'Up to 5'],
  ['Design', 'One of 15 templates'],
  ['We fill in', 'Your text, photos and logo'],
  ['Mobile responsive', '✓'],
  ['Contact form', '1'],
  ['Hosting and SSL', '$99 a month'],
  ['Minimum term', '12 months'],
]

// The builder's list: the generated services plus the $1 Website, placed after Website Development.
// Worked out when the page loads, so after the deadline the $1 Website drops out of the builder.
const live = oneDollarActive()
export const BUILDER_SERVICES = live ? [...SERVICES, ONE_DOLLAR_SERVICE] : SERVICES
export const BUILDER_CATEGORIES = !live ? CATEGORIES : CATEGORIES.map((category) =>
  category.ids.includes('web') ? { ...category, ids: [...category.ids.slice(0, category.ids.indexOf('web') + 1), ONE_DOLLAR.id, ...category.ids.slice(category.ids.indexOf('web') + 1)] } : category,
)
export const BUILDER_DETAILS = live ? { ...DETAILS, [ONE_DOLLAR.id]: ONE_DOLLAR_DETAILS } : DETAILS
