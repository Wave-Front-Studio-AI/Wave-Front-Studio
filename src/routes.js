// Route metadata stays deliberately lightweight. Page content is loaded only by
// the matching route family, so the home page does not download every location
// and article merely to decide which URL is active.
const serviceSlugs = [
  'web-development', 'seo-service', 'mobile-app-development', 'social-media-strategy',
  'graphic-design', 'digital-marketing', 'free-audit', 'lead-capture',
]
const customWorkSlugs = ['ai-chatbot', 'live-visualizer', 'custom-calculators']
const locationSlugs = [
  'web-design-phoenix-az', 'web-design-jacksonville-fl', 'web-design-denver-co',
  'web-design-las-vegas-nv', 'web-design-charlotte-nc', 'web-design-sarasota-fl',
  'web-design-lakewood-ranch-fl', 'web-design-bradenton-fl', 'web-design-venice-fl',
  'web-design-north-port-fl', 'web-design-palmetto-fl', 'web-design-osprey-nokomis-fl',
  'web-design-englewood-fl', 'web-design-tampa-fl', 'web-design-st-petersburg-fl',
  'web-design-charleston-sc', 'web-design-nashville-tn', 'web-design-raleigh-nc',
]
const legalSlugs = ['terms-of-use', 'privacy-policy', 'cookie-policy', 'sms-policy']
const postSlugs = [
  'website-making-or-costing-you-money', 'do-you-need-a-mobile-app',
  'why-ai-follow-up-beats-working-harder', 'what-does-a-lead-actually-cost-you',
  'build-a-calculator-that-sells-for-you', 'seo-keeps-working-after-you-stop-paying',
  'posting-is-not-a-social-media-strategy', 'let-them-see-it-before-they-buy-it',
  'why-cheap-design-costs-more',
]

// One list of every URL the site answers on. The router and the prerenderer
// both read it, so a new page can never exist in one and not the other.
export const routes = [
  { path: '/', kind: 'home' },
  { path: '/about/', kind: 'about' },
  { path: '/portfolio/', kind: 'portfolio' },
  { path: '/contact/', kind: 'contact' },
  { path: '/faqs/', kind: 'faqs' },
  { path: '/blog/', kind: 'blog' },
  { path: '/lost-lead-calculator/', kind: 'calculator' },
  { path: '/free-setup/', kind: 'free-setup' },
  { path: '/package-builder/', kind: 'packages' },
  { path: '/locations/', kind: 'locations' },
  { path: '/services/', kind: 'services-hub' },
  { path: '/platform/', kind: 'platform' },
  { path: '/custom-works/', kind: 'custom-works-hub' },
  ...serviceSlugs.map((slug) => ({ path: `/${slug}/`, kind: 'service', slug })),
  ...customWorkSlugs.map((slug) => ({ path: `/${slug}/`, kind: 'custom-work', slug })),
  ...locationSlugs.map((slug) => ({ path: `/${slug}/`, kind: 'location', slug })),
  ...legalSlugs.map((slug) => ({ path: `/${slug}/`, kind: 'legal', slug })),
  ...postSlugs.map((slug) => ({ path: `/${slug}/`, kind: 'post', slug })),
]

export const routeByPath = Object.fromEntries(routes.map((route) => [route.path, route]))

export function matchRoute(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  return routeByPath[slug ? `/${slug}/` : '/'] || null
}
