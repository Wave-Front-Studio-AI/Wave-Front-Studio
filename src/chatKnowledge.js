// Knowledge index for the site assistant.
//
// Every entry is built from the same data the pages render, so the assistant
// can never describe a service, page, price, or article that Wavefront Studio
// does not publish on this site.

import { clientLogos, contact, customWorkLinks, projects, serviceLinks, testimonials } from './data/site.js'
import { services } from './data/services.js'
import { customWorks } from './data/customWorks.js'
import { locations as allLocations, locationsHub } from './data/generated/locations.js'
import { isLive } from './data/schedule.js'
import { legalPages } from './data/generated/legal.js'
import { posts } from './data/generated/posts.js'
import { LANDING_PAGE_BUNDLES, OFFER, SERVICES as PACKAGE_SERVICES, DETAILS as PACKAGE_DETAILS } from './data/generated/packages.js'
import { freeSetupFaqs, siteFaqs } from './data/faqs.js'
import { CHIPS, strings } from './chatLocale.js'
import { FOREIGN_STOP_WORDS, detectLanguage, translateQuery } from './chatLanguage.js'

// Scheduled location pages sit in the data before their publish date; the
// assistant only knows the ones that are live in this build.
const locations = allLocations.filter((location) => isLive(location.slug))

const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'could',
  'did', 'do', 'does', 'for', 'from', 'get', 'guy', 'had', 'has', 'have', 'help', 'how', 'i', 'if',
  'in', 'into', 'is', 'it', 'its', 'just', 'like', 'me', 'more', 'much', 'my', 'need', 'of', 'on',
  'or', 'our', 'out', 'please', 'so', 'some', 'tell', 'that', 'the', 'their', 'them', 'then',
  'there', 'these', 'they', 'this', 'to', 'up', 'us', 'want', 'was', 'we', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
  'com', 'www', 'http', 'https',
])

export function tokenize(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .map((token) => (token.length > 4 && token.endsWith('s') && !token.endsWith('ss') ? token.slice(0, -1) : token))
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token) && !FOREIGN_STOP_WORDS.has(token))
}

// Long-form pages are stored as HTML. Only their text belongs in the index.
function plainText(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&(?:quot|#34);/g, '"')
    .replace(/&(?:apos|#39);/g, '’')
    .replace(/\s+/g, ' ')
    .trim()
}

function clip(text, limit) {
  const value = String(text ?? '').trim()
  if (value.length <= limit) return value
  const slice = value.slice(0, limit + 1)
  const wordBreak = slice.lastIndexOf(' ')
  const end = wordBreak >= Math.floor(limit * 0.75) ? wordBreak : limit
  return `${value.slice(0, end).trimEnd()}…`
}

const KEYWORD_WEIGHT = 4

function makeEntry({ id, title, url, kind, body, plain, linkLabel, keywords = [], keywordWeight = KEYWORD_WEIGHT }) {
  const weights = new Map()
  const add = (text, weight) => {
    for (const token of new Set(tokenize(text))) {
      weights.set(token, Math.max(weights.get(token) ?? 0, weight))
    }
  }
  add(body, 1)
  add(keywords.join(' '), keywordWeight)
  add(title, 6)
  return { id, title, url, kind, body, linkLabel, plain: plain ?? body, weights, haystack: `${title} ${keywords.join(' ')} ${body}`.toLowerCase() }
}

const contactLine = `Call ${contact.phone}, email ${contact.email}, or use the contact form. Wavefront Studio LLC is in ${contact.address}.`

const serviceNames = serviceLinks.map(([label]) => label).join(', ')
const customWorkNames = customWorkLinks.map(([label]) => label).join(', ')
const faqAnswer = (question) => siteFaqs.find(([publishedQuestion]) => publishedQuestion === question)?.[1] ?? ''
const timelineAnswer = faqAnswer('How long does it take to build a website?')
const getStartedAnswer = faqAnswer('How do I get started?')

/* ------------------------------------------------------------------ */
/* Company and site-wide pages                                         */
/* ------------------------------------------------------------------ */

const companyEntries = [
  {
    id: 'company-overview', title: 'What Wavefront Studio does', url: '/', kind: 'company',
    keywords: ['wavefront', 'agency', 'overview', 'what do you do', 'what do you build', 'company', 'services', 'digital agency', 'full service'],
    body: 'From custom web development and AI-powered chatbots to SEO strategies and stunning UI/UX design – Wavefront Studio is a full-service digital agency that turns bold ideas into high-performing digital products. The published services are ' + serviceNames + '. The custom works are ' + customWorkNames + '.',
    plain: 'Wavefront Studio is a full-service digital agency in Sarasota, Florida. We build websites, mobile apps and custom web tools, run SEO, digital marketing and social media, design brands, and build AI chatbots, live visualizers and custom calculators.',
  },
  {
    id: 'company-about', title: 'About Wavefront Studio', url: '/about/', kind: 'company',
    keywords: ['about', 'who are you', 'story', 'team', 'experience', 'years', 'sarasota', 'resinrock', 'agency'],
    body: 'Wavefront Studio is a full-service digital agency built for businesses that want more than just a website – they want results. We combine creative design, smart development, and data-driven strategy to help brands launch, grow, and dominate their market online. From building 12+ interconnected websites for ResinRock Industries to developing automated lead distribution systems and ranking clients on Google’s first page – our work speaks for itself.',
  },
  {
    id: 'company-why', title: 'Why businesses choose Wavefront', url: '/', kind: 'company',
    keywords: ['why you', 'why choose', 'trust', 'different', 'better', 'support', 'expertise'],
    body: 'Professional team: skilled developers, designers, SEO experts, and AI specialists - all under one roof working together on your project. Expertise in digital innovation: we use cutting-edge tools like AI chatbots, live visualizers, and automated systems that most agencies haven’t adopted yet. Exceptional support: we don’t disappear after launch. Our team stays with you for ongoing support, updates, and optimization - one call away.',
  },
  {
    id: 'company-process', title: 'How working with us works', url: '/', kind: 'company',
    keywords: ['process', 'how it works', 'steps', 'what happens', 'get started', 'onboarding', 'stages'],
    body: 'Three steps. Share your vision: tell us about your business and what you want to achieve, and we map out a strategy that fits your goals. We design and develop: our designers, developers, and strategists bring your vision to life, with regular updates and previews at every stage. Launch and grow: we launch your project, then provide ongoing support, optimization, and strategy so your business keeps growing after launch.',
  },
  {
    id: 'company-portfolio', title: 'Our work and portfolio', url: '/portfolio/', kind: 'company',
    keywords: ['portfolio', 'work', 'examples', 'case study', 'case studies', 'projects', 'proof', 'results', 'clients', 'resinrock'],
    body: `Every project we deliver is built to perform – not just to impress. Published projects: ${projects.map((project) => `${project.title} (${project.client})`).join('; ')}. Client logos shown on the site: ${clientLogos.map((logo) => logo.alt.replace(/ company logo$/, '')).join(', ')}.`,
  },
  {
    id: 'company-testimonials', title: 'What clients say', url: '/', kind: 'company',
    keywords: ['testimonial', 'testimonials', 'reviews', 'feedback', 'references', 'happy clients'],
    body: testimonials.map((item) => `${item.name}, ${item.company}: ${item.quote}`).join(' '),
  },
  {
    id: 'company-contact', title: 'Contact Wavefront Studio', url: '/contact/', kind: 'company',
    keywords: ['contact', 'phone', 'call', 'email', 'address', 'location', 'reach', 'talk to someone', 'human', 'enquiry', 'instagram'],
    body: `${contactLine} We are also on Instagram at instagram.com/wavefrontstudio.`,
  },
  {
    id: 'company-faqs', title: 'Frequently asked questions', url: '/faqs/', kind: 'company',
    keywords: ['faq', 'faqs', 'questions', 'common questions', 'before getting started'],
    body: `Everything You Need to Know Before Getting Started. Published questions: ${siteFaqs.map(([question]) => question).join(' ')}`,
  },
  {
    id: 'company-blog', title: 'The Wavefront blog', url: '/blog/', kind: 'company',
    keywords: ['blog', 'articles', 'insights', 'guides', 'reading', 'posts'],
    body: `Practical writing on websites, SEO, marketing and automation for businesses that want the work to pay for itself. Published articles: ${posts.map((post) => post.title).join('; ')}.`,
  },
  {
    id: 'company-locations', title: locationsHub?.title || 'Where we work', url: '/locations/', kind: 'company',
    keywords: ['locations', 'areas', 'where do you work', 'coverage', 'near me', 'local', 'florida', 'city', 'cities', 'remote', 'outside the us'],
    body: `${locationsHub?.description || ''} Pages are published for ${locations.length} areas: ${locations.map((location) => location.title.replace(/^Web Design & SEO (?:in|for|on) /, '')).join('; ')}. We are based in Sarasota, Florida and work with clients worldwide - all communication, project management, and delivery happens digitally.`.trim(),
  },
  {
    id: 'company-free-setup', title: 'Free setup this quarter', url: '/free-setup/', kind: 'company',
    keywords: ['free setup', 'offer', 'deal', 'discount', 'waived', 'places', 'quarter', 'limited'],
    body: 'Free setup on AI Chatbot & Automation, Web Development and Website SEO. Five places per quarter, because setup is the part that takes our team’s time rather than software’s. The waived amount is the one-off setup and onboarding fee; monthly subscription and project fees still apply and are quoted separately in writing. Five places per calendar quarter in total across all three services combined - not five per service.',
    linkLabel: 'See the free setup offer',
  },
  {
    id: 'company-lost-lead-calculator', title: 'Lost Lead Calculator', url: '/lost-lead-calculator/', kind: 'company',
    keywords: ['lost lead calculator', 'free tool', 'missed calls', 'slow replies', 'follow up', 'leaking revenue', 'how much am i losing', 'lost leads'],
    body: 'A free 60-second tool. Missed calls. Slow replies. Enquiries nobody followed up. Put your own numbers in and see what it adds up to over twelve months.',
    linkLabel: 'Open the Lost Lead Calculator',
  },
  {
    id: 'company-build-your-package', title: 'Build Your Package', url: '/package-builder/', kind: 'company',
    keywords: ['build your package', 'package', 'bundle', 'configurator', 'quote', 'estimate', 'pricing', 'price', 'cost', 'how much', 'budget', 'tiers'],
    body: `Tick the services you want and pick a tier — your total updates instantly. Tap the info icon on any service to see exactly what each tier includes. The more you bundle, the more you save: ${OFFER.bundleTiers.map((tier) => `${tier.min}+ services saves ${tier.pct}%`).join(', ')}. Monthly services include the first month free. ${PACKAGE_SERVICES.length} services are priced on the page across websites and development, marketing and growth, AI and automation, branding and design, print and collateral, and video and podcast.`,
    linkLabel: 'Build your package and see the price',
  },
].map(makeEntry)

const hubEntries = [
  makeEntry({
    id: 'company-services-hub', title: 'All services', url: '/services/', kind: 'company',
    keywords: ['all services', 'services directory', 'service list'],
    body: `Published services: ${serviceNames}.`,
    linkLabel: 'See all services',
  }),
  makeEntry({
    id: 'company-custom-works-hub', title: 'All custom works', url: '/custom-works/', kind: 'company',
    keywords: ['all custom works', 'custom tools', 'custom solutions', 'what custom tools do you build'],
    body: `Published custom works: ${customWorkNames}.`,
    linkLabel: 'See all custom works',
  }),
]

/* ------------------------------------------------------------------ */
/* Services and custom works                                           */
/* ------------------------------------------------------------------ */

// The words a visitor uses for a service, keyed to the page that answers them.
const SERVICE_ALIASES = {
  'web-development': 'website web design build a website new website redesign rebuild wordpress shopify woocommerce ecommerce online store landing page cms responsive multi-site',
  'seo-service': 'seo search engine optimisation optimization google ranking rankings first page keywords backlinks local seo google business profile organic traffic found on google',
  'mobile-app-development': 'app apps mobile app ios android iphone application mvp startup app build',
  'social-media-strategy': 'social media instagram facebook linkedin tiktok posts content calendar followers engagement community management',
  'graphic-design': 'graphic design logo branding brand identity visual identity print flyers social graphics packaging creative',
  'digital-marketing': 'marketing paid ads google ads meta ads ppc email marketing funnel campaigns roi lead generation advertising',
  'free-audit': 'free audit website audit review check my site performance report speed slow website slow on mobile mobile usability what is wrong with my website',
  'lead-capture': 'lead capture leads enquiries forms crm routing qualifying follow up missed enquiries lead system',
}

const CUSTOM_WORK_ALIASES = {
  'ai-chatbot': 'chatbot ai bot live chat unified inbox automation crm pipeline review automation whatsapp sms answers questions 24/7 book appointments qualify leads',
  'live-visualizer': 'visualizer visualiser preview see it before they buy upload photo room colour color material flooring paint samples',
  'custom-calculators': 'calculator calculators quoting instant quote estimate pricing tool material estimator ordering system pdf quote',
}

function serviceBody(service) {
  const parts = [
    service.subhead,
    ...(service.approach?.paragraphs ?? []),
    `What is included: ${(service.features ?? []).join('; ')}.`,
    ...(service.deliver?.paragraphs ?? []),
    ...(service.extra?.paragraphs ?? []),
  ]
  return parts.filter(Boolean).join(' ')
}

const serviceEntries = services.map((service) => makeEntry({
  id: `service-${service.slug}`,
  title: service.name,
  url: `/${service.slug}/`,
  kind: 'service',
  keywords: [service.name, service.nav, service.subhead, SERVICE_ALIASES[service.slug] ?? ''],
  body: serviceBody(service),
  plain: `${service.subhead}. ${service.approach?.paragraphs?.[0] ?? service.metaDescription}`,
  linkLabel: `See ${service.nav}`,
}))

function customWorkBody(work) {
  const parts = [
    work.intro,
    (work.features?.items ?? []).map((item) => `${item.title}: ${item.copy}`).join(' '),
    (work.steps?.items ?? work.steps ?? []).map((item) => (typeof item === 'string' ? item : `${item.title ?? ''} ${item.copy ?? ''}`)).join(' '),
    (work.audience?.items ?? []).map((item) => (typeof item === 'string' ? item : `${item.title ?? ''} ${item.copy ?? ''}`)).join(' '),
    (work.integrations?.items ?? []).map((item) => `${item.title}: ${item.copy}`).join(' '),
    (work.stats ?? []).map((stat) => `${stat.value} ${stat.label}`).join('. '),
  ]
  return parts.filter(Boolean).join(' ')
}

const customWorkEntries = customWorks.map((work) => makeEntry({
  id: `custom-${work.slug}`,
  title: work.nav,
  url: `/${work.slug}/`,
  kind: 'custom',
  keywords: [work.nav, work.name, work.eyebrow, CUSTOM_WORK_ALIASES[work.slug] ?? ''],
  body: `${work.name}. ${customWorkBody(work)}`,
  plain: `${work.name} ${work.intro}`,
  linkLabel: `See the ${work.nav}`,
}))

// Plans published on a service or custom-work page.
const planEntries = [...services, ...customWorks]
  .filter((item) => item.plans?.items?.length)
  .flatMap((item) => item.plans.items.map((plan) => makeEntry({
    id: `plan-${item.slug}-${plan.name}`,
    title: `${plan.name} — ${item.nav} plan`,
    url: `/${item.slug}/#plans`,
    kind: 'plan',
    keywords: [plan.name, item.nav, item.name, 'plan', 'plans', 'package', 'tier', 'pricing'],
    body: [
      plan.copy,
      plan.bestFor ? `Best for ${plan.bestFor}.` : '',
      plan.billing ? `Billing: ${plan.billing}.` : '',
      (plan.included ?? []).length ? `Included: ${plan.included.join('; ')}.` : '',
      (plan.excluded ?? []).length ? `Not included: ${plan.excluded.join('; ')}.` : '',
    ].filter(Boolean).join(' '),
    linkLabel: `See the ${item.nav} plans`,
  })))

/* ------------------------------------------------------------------ */
/* Build Your Package pricing                                          */
/* ------------------------------------------------------------------ */

function priceOf(tier, billing) {
  if (tier.custom) return 'custom quote for any unique build: enter a project name, one-time price, and scope; optionally add a per-page price and page count (or mark the count to be confirmed)'
  if (billing === 'monthly') return `$${tier.m.toLocaleString('en-US')}/month`
  if (billing === 'hybrid') {
    const setup = tier.s ? `$${tier.s.toLocaleString('en-US')} setup` : ''
    const monthly = tier.m ? `$${tier.m.toLocaleString('en-US')}/month` : ''
    return [setup, monthly].filter(Boolean).join(' + ')
  }
  return `$${tier.s.toLocaleString('en-US')} one-time`
}

const packageEntries = PACKAGE_SERVICES.map((service) => {
  const tiers = service.tiers.map((tier) => `${tier.n} ${priceOf(tier, service.billing)} (${tier.note})`).join(', ')
  const addons = (service.addons ?? []).map((addon) => `${addon.l} $${addon.p.toLocaleString('en-US')} ${addon.t === 'monthly' ? 'per month' : 'one-time'}`).join('; ')
  const delivery = (PACKAGE_DETAILS[service.id] ?? []).find((row) => /delivery|timeline/i.test(row[0]))
  const pageBundles = service.id === 'landing'
    ? ` Launch, Grow, and Scale include one page in the base price. Page bundles apply to those three tiers and are added once to that base price: ${LANDING_PAGE_BUNDLES.filter((bundle) => bundle.price > 0).map((bundle) => `${bundle.pages} pages total +$${bundle.price.toLocaleString('en-US')}`).join('; ')}. Grow with 25 pages is $1,000 before bundle discounts. Custom supports unique builds with an entered project price and scope. Per-page pricing is optional and adds to the project price when enabled; standard tier and bundle prices do not apply.`
    : ''
  return makeEntry({
    id: `package-${service.id}`,
    title: `${service.name} — pricing`,
      url: '/package-builder/',
    kind: 'pricing',
    keywords: [service.name, 'price', 'pricing', 'cost', 'how much', 'rate', 'quote', 'budget', 'tier', 'package'],
    body: `${service.blurb} Tiers: ${tiers}.${pageBundles}${addons ? ` Add-ons: ${addons}.` : ''}${delivery ? ` ${delivery[0]}: ${delivery.slice(1).join(' / ')}.` : ''} Prices update live on the Build Your Package page, where bundling ${OFFER.bundleTiers.map((tier) => `${tier.min}+ services saves ${tier.pct}%`).join(', ')}.`,
    linkLabel: 'See it in Build Your Package',
  })
})

/* ------------------------------------------------------------------ */
/* Locations, articles, policies, questions                            */
/* ------------------------------------------------------------------ */

const locationEntries = locations.map((location) => {
  const place = location.title.replace(/^Web Design & SEO (?:in|for|on) /, '')
  return makeEntry({
    id: `location-${location.slug}`,
    title: location.title,
    url: `/${location.slug}/`,
    kind: 'location',
    // Place names only. Generic words like "area" belong to the locations hub,
    // not to every individual page competing for the same question.
    keywords: [place, place.split(/,| and /).map((part) => part.trim()).join(' '), 'web design', 'seo'],
    body: `${location.description} ${clip(plainText(location.content), 1400)}`,
    plain: location.description,
    linkLabel: `Read about ${place}`,
  })
})

// The words that name one of the published areas. Used to tell "do you cover
// Nashville" (answer with the page) from "do you cover my area" (answer with
// the hub), which otherwise look identical to the index.
const PLACE_TOKENS = new Set(
  locations.flatMap((location) => tokenize(location.title.replace(/^Web Design & SEO (?:in|for|on) /, ''))),
)

const postEntries = posts.map((post) => makeEntry({
  id: `post-${post.slug}`,
  title: post.title,
  url: `/${post.slug}/`,
  kind: 'article',
  keywords: ['blog', 'article', post.title],
  body: `${post.excerpt} ${clip(plainText(post.content), 900)}`,
  plain: post.excerpt,
  linkLabel: 'Read the article',
}))

const legalEntries = legalPages.map((page) => makeEntry({
  id: `legal-${page.slug}`,
  title: page.title,
  url: `/${page.slug}/`,
  kind: 'legal',
  keywords: [page.title, ({
    'terms-of-use': 'terms conditions acceptable use website rules',
    'privacy-policy': 'privacy personal data personal information collect use share gdpr',
    'cookie-policy': 'cookies browser tracking analytics consent',
    'sms-policy': 'sms text messages mobile phone opt in opt out',
  })[page.slug] ?? 'legal policy'],
  body: `${page.description ?? ''} ${clip(plainText(page.content), 900)}`.trim(),
  linkLabel: `Read the ${page.title}`,
}))

const faqEntries = [
  ...siteFaqs.map((item, index) => ({ id: `faq-${index}`, url: '/faqs/', item })),
  ...freeSetupFaqs.map((item, index) => ({ id: `free-setup-faq-${index}`, url: '/free-setup/', item })),
  ...services
    .filter((service) => service.faqs?.length)
    .flatMap((service) => service.faqs.map((item, index) => ({ id: `${service.slug}-faq-${index}`, url: `/${service.slug}/`, item }))),
].map(({ id, url, item: [question, answer] }) => makeEntry({
  id, title: question, url, kind: 'faq', keywords: [question], body: answer,
}))

export const knowledgeEntries = [
  ...companyEntries,
  ...hubEntries,
  ...serviceEntries,
  ...customWorkEntries,
  ...planEntries,
  ...packageEntries,
  ...faqEntries,
  ...locationEntries,
  ...postEntries,
  ...legalEntries,
]

// Very short questions should be the easiest ones to answer. These direct
// routes keep common one- and two-word topics from being diluted by the many
// pages that mention the same word (for example, SEO on every location page).
const DIRECT_TOPIC_IDS = new Map([
  ['website', 'service-web-development'],
  ['websites', 'service-web-development'],
  ['site', 'service-web-development'],
  ['web site', 'service-web-development'],
  ['web page', 'service-web-development'],
  ['webpage', 'service-web-development'],
  ['homepage', 'service-web-development'],
  ['web design', 'service-web-development'],
  ['website design', 'service-web-development'],
  ['web development', 'service-web-development'],
  ['new website', 'service-web-development'],
  ['seo', 'service-seo-service'],
  ['google', 'service-seo-service'],
  ['google search', 'service-seo-service'],
  ['google ranking', 'service-seo-service'],
  ['rank', 'service-seo-service'],
  ['ranking', 'service-seo-service'],
  ['website seo', 'service-seo-service'],
  ['search engine optimization', 'service-seo-service'],
  ['search engine optimisation', 'service-seo-service'],
  ['app', 'service-mobile-app-development'],
  ['apps', 'service-mobile-app-development'],
  ['mobile app', 'service-mobile-app-development'],
  ['mobile apps', 'service-mobile-app-development'],
  ['social media', 'service-social-media-strategy'],
  ['graphic design', 'service-graphic-design'],
  ['logo', 'service-graphic-design'],
  ['branding', 'service-graphic-design'],
  ['marketing', 'service-digital-marketing'],
  ['digital marketing', 'service-digital-marketing'],
  ['ads', 'service-digital-marketing'],
  ['advertising', 'service-digital-marketing'],
  ['audit', 'service-free-audit'],
  ['free audit', 'service-free-audit'],
  ['website audit', 'service-free-audit'],
  ['leads', 'service-lead-capture'],
  ['lead capture', 'service-lead-capture'],
  ['chatbot', 'custom-ai-chatbot'],
  ['chat bot', 'custom-ai-chatbot'],
  ['ai chatbot', 'custom-ai-chatbot'],
  ['visualizer', 'custom-live-visualizer'],
  ['visualiser', 'custom-live-visualizer'],
  ['live visualizer', 'custom-live-visualizer'],
  ['live visualiser', 'custom-live-visualizer'],
  ['calculator', 'custom-custom-calculators'],
  ['calculators', 'custom-custom-calculators'],
  ['custom calculator', 'custom-custom-calculators'],
  ['phone', 'company-contact'],
  ['phone number', 'company-contact'],
  ['telephone', 'company-contact'],
  ['email', 'company-contact'],
  ['email address', 'company-contact'],
  ['contact', 'company-contact'],
])

const COMMON_TERM_CORRECTIONS = new Map([
  ['s e o', 'seo'],
  ['seoo', 'seo'],
  ['webiste', 'website'],
  ['webstie', 'website'],
  ['websitee', 'website'],
  ['websight', 'website'],
  ['chatboat', 'chatbot'],
  ['chat bot', 'chatbot'],
  ['calcualtor', 'calculator'],
  ['contat', 'contact'],
])

function simpleTopic(value) {
  const normalized = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:what is|what does|what are|tell me about|do you do|can you help with|i need|we need|help with)\s+/, '')
    .replace(/\s+(?:mean|means)$/, '')
  return COMMON_TERM_CORRECTIONS.get(normalized) ?? normalized
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

const documentFrequency = new Map()
for (const entry of knowledgeEntries) {
  for (const token of entry.weights.keys()) {
    documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1)
  }
}

// A word that appears on three pages says far more about intent than one that
// appears on two hundred, so rarity scales every weight.
function inverseFrequency(token) {
  return Math.log(1 + knowledgeEntries.length / (1 + (documentFrequency.get(token) ?? 0)))
}

// Vocabulary bucketed by its first four characters. A stem match requires at
// least that much overlap, so the bucket holds every possible candidate.
const prefixBuckets = new Map()
for (const token of documentFrequency.keys()) {
  if (token.length < 4) continue
  const key = token.slice(0, 4)
  const bucket = prefixBuckets.get(key)
  if (bucket) bucket.push(token)
  else prefixBuckets.set(key, [token])
}

function sharedPrefix(a, b) {
  const limit = Math.min(a.length, b.length)
  let index = 0
  while (index < limit && a[index] === b[index]) index += 1
  return index
}

const expansionCache = new Map()

// Visitors type "calculators" for calculator and "designer" for design.
// Matching on a shared stem, at a discount so an exact hit always wins, keeps
// those questions answerable without hand-listing every word form.
function expandToken(token) {
  const cached = expansionCache.get(token)
  if (cached) return cached

  const expansions = [[token, 1]]

  if (token.length >= 4) {
    for (const candidate of prefixBuckets.get(token.slice(0, 4)) ?? []) {
      if (candidate === token) continue
      const shared = sharedPrefix(token, candidate)
      if (shared < 4) continue
      const tail = token.length - shared
      const candidateTail = candidate.length - shared
      if (tail > 4 || candidateTail > 4) continue
      if (shared < 6 && (tail > 3 || candidateTail > 3)) continue
      expansions.push([candidate, 0.6])
    }
  }

  expansionCache.set(token, expansions)
  return expansions
}

export function searchKnowledge(query, limit = 4, language) {
  const translated = translateQuery(query, language)
  const directId = DIRECT_TOPIC_IDS.get(simpleTopic(translated))
  if (directId) {
    const entry = knowledgeEntries.find((candidate) => candidate.id === directId)
    if (entry) return [{ ...entry, score: 100 }]
  }
  const tokens = new Set(tokenize(translated))
  if (!tokens.size) return []
  const phrase = translated.trim().toLowerCase()
  const scored = []

  const allExpansions = [...tokens].map(expandToken)
  const expansions = allExpansions.filter((expansion) => expansion.some(([token]) => documentFrequency.has(token)))
  if (!expansions.length) return []
  if (expansions.length / allExpansions.length <= 0.5) return []

  const placeContext = /\b(web(?:site)?|seo|design|agency|business|company|service|services|serve|serving|cover|coverage|work|working|operate|local|area|region)\b/i.test(translated)
  const ordinaryPlaceContext = /\b(mesa\s+(?:style|architecture)|cary\s+(?:this|that)|venice\s+(?:mask|film|art)|palmetto\s+(?:tree|plant|species))\b/i.test(translated)

  for (const entry of knowledgeEntries) {
    if (entry.kind === 'location' && (!placeContext || ordinaryPlaceContext)) continue
    let score = 0
    let matched = 0
    for (const expansion of expansions) {
      let best = 0
      for (const [token, penalty] of expansion) {
        const weight = entry.weights.get(token)
        if (!weight) continue
        const capped = penalty === 1 ? weight : Math.min(weight, KEYWORD_WEIGHT)
        best = Math.max(best, capped * inverseFrequency(token) * penalty)
      }
      if (!best) continue
      score += best
      matched += 1
    }
    if (!matched) continue
    score *= 0.35 + (0.65 * matched) / allExpansions.length
    if (phrase.length > 6 && entry.haystack.includes(phrase)) score += 12
    scored.push({ entry, score })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length)
    .slice(0, limit)
    .filter((result) => result.score >= 12)
    .map((result) => ({ ...result.entry, score: result.score }))
}

/* ------------------------------------------------------------------ */
/* Intents                                                             */
/* ------------------------------------------------------------------ */

const CONTACT_LINKS = [
  { label: `Call ${contact.phone}`, href: contact.phoneHref },
  { label: `Email ${contact.email}`, href: contact.emailHref },
  { label: 'Contact page', href: '/contact/' },
]

export const openingChips = CHIPS.en

function has(text, ...words) {
  return words.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(text))
}

function isDirectPricingQuestion(text) {
  const value = String(text ?? '').trim().toLowerCase().replace(/[?.!]+$/, '')
  if (/^(price|prices|pricing|cost|costs|fee|fees|rates|quote|budget|how much)$/.test(value)) return true
  const topic = '(?:website|web site|seo|app|mobile app|chatbot|marketing|digital marketing|social media|graphic design|audit|lead capture|calculator|visualizer|visualiser|service|services)'
  return new RegExp(`^(?:how much (?:does|do|is|are|would|will) )?(?:a |an |the |your )?${topic}(?: (?:cost|costs|price|prices|pricing|fee|fees|rates))?$`, 'i').test(value)
    || /^how much (?:is|are|does|do|would|will) (?:it|this|that)$/.test(value)
}

const cheapestTiers = PACKAGE_SERVICES.slice(0, 3)
  .map((service) => `${service.name} from ${priceOf(service.tiers[0], service.billing)}`)
  .join(', ')

const INTENTS = [
  {
    id: 'help',
    test: (text) => /^(help|help me|start|menu|options)\??$/i.test(text.trim()),
    reply: () => ({
      text: 'What do you need help with? Type one word, such as website, SEO, app, prices, or contact. You can also tap a button below.',
      chips: openingChips,
    }),
  },
  {
    id: 'seo-explainer',
    test: (text) => /^(seo|google|google search|google ranking|rank|ranking)$/i.test(simpleTopic(text)),
    reply: () => ({
      text: 'SEO stands for search engine optimization. It helps your website appear higher in Google when people search for services like yours. Wavefront can help with keywords, technical fixes, page improvements, local SEO, and Google Business Profile work.',
      links: [{ label: 'Learn about website SEO', href: '/seo-service/' }],
      chips: ['How much is SEO?', 'How long does SEO take?', 'Talk to a person'],
    }),
  },
  {
    id: 'growth-help',
    test: (text) => /^(?:(?:i|we)\s+)?(?:need|want)\s+more\s+(?:customers|leads|sales|business)\.?$/i.test(text.trim()),
    reply: () => ({
      text: 'We can help. Would you like to get found on Google, run ads, improve social media, or improve your website? Choose one below.',
      links: [
        { label: 'SEO and Google', href: '/seo-service/' },
        { label: 'Digital marketing and ads', href: '/digital-marketing/' },
        { label: 'Website development', href: '/web-development/' },
      ],
      chips: ['SEO and Google', 'Paid ads', 'Social media', 'New website'],
    }),
  },
  {
    id: 'greeting',
    test: (text) => /^(hi|hey|hello|yo|good (morning|afternoon|evening)|howdy)\b/i.test(text.trim()),
    reply: () => ({
      text: 'Hi, I am the Wavefront Studio assistant. I know every service, custom tool, price, area page and article published on this site. Ask me anything, or I can pass you to the team.',
      chips: openingChips,
    }),
  },
  {
    id: 'thanks',
    test: (text) => /^(thanks|thank you|ta|cheers|perfect|great|awesome|nice)\b/i.test(text.trim()),
    reply: () => ({
      text: 'Glad that helped. If you want a real answer on your own project, a free consultation is the usual next step — or open the request form and I will pass your details on.',
      chips: ['Request help', 'How much does it cost?'],
    }),
  },
  {
    id: 'human',
    test: (text) => has(text, 'human', 'person', 'someone', 'representative', 'salesperson', 'proposal')
      || /\b(talk|speak|chat)\s+(to|with)\b/i.test(text),
    reply: () => ({
      text: '',
      links: CONTACT_LINKS,
      chips: ['Request help'],
      action: 'form',
      spoken: 'handoff',
    }),
  },
  {
    id: 'pricing',
    test: (text) => has(text, 'price', 'prices', 'pricing', 'cost', 'costs', 'budget', 'afford', 'expensive', 'cheap', 'fee', 'fees', 'rates', 'quote')
      || /how much/i.test(text),
    reply: () => ({
      text: `Choose the services you want on the Build Your Package page and it will show the total price. Starting points include ${cheapestTiers}. Monthly services include the first month free.`,
      links: [
      { label: 'Build your package and see the price', href: '/package-builder/' },
        { label: 'Free setup this quarter', href: '/free-setup/' },
      ],
      chips: ['What do you build?', 'How long does it take?', 'Talk to a person'],
    }),
  },
  {
    id: 'contact',
    test: (text) => has(text, 'contact', 'address', 'located', 'location', 'office')
      || /^(phone|phone number|telephone|email|email address|contact us)\??$/i.test(text.trim())
      || /\b(instagram|social)\s+(profile|account|handle|link)\b/i.test(text)
      || /\bhow (can|do) (i|we) (reach|contact|call|email)\b/i.test(text)
      || /\b(your|wavefront'?s) (email|phone|telephone|number)\b/i.test(text),
    reply: (text) => {
      const emailFirst = /^email\b/i.test(text.trim())
      const links = emailFirst ? [CONTACT_LINKS[1], CONTACT_LINKS[0], CONTACT_LINKS[2]] : CONTACT_LINKS
      return { text: contactLine, links, chips: ['Request help'] }
    },
  },
  {
    // "who are you" is nothing but stop words, so the index cannot answer it.
    id: 'who-we-are',
    test: (text) => /\bwho (are|r) (you|u|wavefront)\b/i.test(text)
      || /\b(about (you|yourselves|wavefront)|tell me about (you|wavefront))\b/i.test(text)
      || /^(who are you|about)\??$/i.test(text.trim()),
    reply: () => ({
      text: 'Wavefront Studio LLC is a full-service digital agency in Sarasota, Florida, built for businesses that want more than just a website – they want results. We combine creative design, smart development, and data-driven strategy to help brands launch, grow, and dominate their market online — from 12+ interconnected websites for ResinRock Industries to automated lead distribution systems and first-page Google rankings.',
      links: [
        { label: 'About Wavefront Studio', href: '/about/' },
        { label: 'Our work and portfolio', href: '/portfolio/' },
      ],
      chips: ['What do you build?', 'How much does it cost?', 'Talk to a person'],
    }),
  },
  {
    id: 'services-list',
    test: (text) => /\b(what|which)\b.*\b(services|do you offer|do you build|can you build|can you do|offerings)\b/i.test(text)
      || /^(service|services|your services|what do you do|what can you do|options)\??$/i.test(text.trim()),
    reply: () => ({
      text: `${serviceLinks.length} service pages and ${customWorkLinks.length} custom tools. Services: ${serviceNames}. Custom works: ${customWorkNames}. Tell me which one you are thinking about, or what you are trying to fix, and I will point at the page.`,
      links: [
        { label: 'See all services', href: '/services/' },
        { label: 'See all custom tools', href: '/custom-works/' },
      { label: 'Build your package and see the price', href: '/package-builder/' },
      ],
      chips: ['I need a new website', 'I want to rank on Google', 'Tell me about the AI chatbot', 'Talk to a person'],
    }),
  },
  {
    id: 'locations',
    test: (text) => /\b(area|areas|region|regions|near me|locally|coverage)\b/i.test(text)
      || /\b(do|will) you (work|serve|cover|operate)\b/i.test(text)
      || /\bwhere are you (based|located)\b/i.test(text),
    reply: () => ({
      text: `We are based in Sarasota, Florida and work with clients worldwide — all communication, project management, and delivery happens digitally, so your location is never a barrier. There are also ${locations.length} area pages covering the markets we know best. Tell me your city and I will find the page if there is one.`,
      links: [{ label: 'Where we work', href: '/locations/' }],
      chips: ['Sarasota', 'Tampa', 'Talk to a person'],
    }),
  },
  {
    id: 'timeline',
    test: (text) => /\bhow long\b/i.test(text)
      || /^(time|timing|turnaround)\??$/i.test(text.trim())
      || /\b(timeline|turnaround|lead time|how quickly|how fast|when will it be (ready|done)|delivery time)\b/i.test(text),
    reply: () => ({
      text: timelineAnswer,
      links: [
        { label: 'Every question we get asked', href: '/faqs/' },
      { label: 'Per-tier delivery estimates', href: '/package-builder/' },
      ],
      chips: ['How much does it cost?', 'Talk to a person'],
    }),
  },
  {
    id: 'get-started',
    test: (text) => /\b(get|getting|how do i|how can i)\s+started\b/i.test(text)
      || /\b(first step|consultation|free consultation|book a call|next step)\b/i.test(text),
    reply: () => ({
      text: `${getStartedAnswer} If you would rather start with something concrete, the free website audit costs nothing.`,
      links: [
        { label: 'Contact page', href: '/contact/' },
        { label: 'Free website audit', href: '/free-audit/' },
      ],
      chips: ['How much does it cost?', 'How long does it take?', 'Talk to a person'],
    }),
  },
]

function formatResults(results) {
  const [best, ...rest] = results
  const spoken = clip(best.plain, 300)
  const links = [{ label: best.linkLabel ?? `Read more: ${best.title}`, href: best.url }]
  const seen = new Set([best.url])
  for (const result of rest) {
    const bestPath = best.url.split('#')[0]
    const resultPath = result.url.split('#')[0]
    const related = best.kind === 'company'
      ? result.kind === 'company'
      : !['location', 'article', 'legal', 'pricing'].includes(best.kind) && bestPath === resultPath
    if (!related || result.score < best.score * 0.65) continue
    if (seen.has(result.url) || links.length >= 3) continue
    seen.add(result.url)
    links.push({ label: result.title, href: result.url })
  }

  return {
    text: best.kind === 'company' || best.kind === 'faq' ? spoken : `${best.title}: ${spoken}`,
    links,
    chips: ['How much does it cost?', 'How long does it take?', 'Talk to a person'],
  }
}

const FALLBACK = {
  text: '',
  links: [
      { label: 'Build your package and see the price', href: '/package-builder/' },
    { label: 'Every question we get asked', href: '/faqs/' },
    ...CONTACT_LINKS.slice(0, 2),
  ],
  chips: openingChips,
  action: 'offer-form',
  spoken: 'notFound',
}

function localize(answer, language) {
  const copy = strings(language)
  const simpleText = (value) => String(value ?? '').replace(/\s*[—–]\s*/g, ' - ').replace(/\s+/g, ' ').trim()
  // Hand-written intent links can repeat a destination; a visitor should never
  // see the same page offered twice.
  const seen = new Set()
  const links = (answer.links ?? [])
    .filter((link) => !seen.has(link.href) && seen.add(link.href))
    .map((link) => ({ ...link, label: simpleText(link.label) }))
  const chips = (copy.leadIn ? CHIPS[language] ?? answer.chips : answer.chips)?.map(simpleText)
  // Lines the assistant speaks in its own voice are written in each language;
  // wrapping "sorry, I could not find that" in "here is what Wavefront
  // publishes" would be nonsense.
  if (answer.spoken) {
    const suffix = language === 'en' && answer.spoken === 'handoff' ? ` ${contactLine}` : ''
    const text = simpleText(`${copy[answer.spoken]}${suffix}`)
    return { ...answer, links, text, chips, language }
  }
  if (!copy.leadIn) return { ...answer, links, text: simpleText(answer.text), chips, language }
  // Follow-up prompts are written by us, so they can be shown translated even
  // though the pages they lead to are English.
  return { ...answer, links, text: simpleText(`${copy.leadIn} ${answer.text}`), chips, language }
}

// Answers a visitor question from published site content only.
export function answerQuestion(query, previousLanguage = 'en') {
  const detected = detectLanguage(query)
  // A one-word English follow-up should not flip a Spanish conversation back.
  const language = detected === 'en' ? previousLanguage : detected
  const text = String(query ?? '').trim()
  if (!text) return localize(FALLBACK, language)

  const results = searchKnowledge(text, 4, language)
  const englishText = translateQuery(text, language)
  const intent = INTENTS.find((candidate) => candidate.test(englishText))

  // The general services FAQ is useful for “what do you offer?”, but it must
  // not turn an unsupported named service into a confident yes.
  if (results[0]?.id === 'faq-0' && results[0].score < 18 && /\b(offer|provide|sell|resell)\b/i.test(englishText)) {
    return localize(FALLBACK, language)
  }

  // "Do you cover Nashville?" is one rare word carried by common ones, so the
  // page for that place can tie with anything else mentioning "cover". When the
  // visitor has clearly asked an area question, the area page goes first.
  const ordinaryPlaceContext = /\b(mesa\s+(?:style|architecture)|cary\s+(?:this|that)|venice\s+(?:mask|film|art)|palmetto\s+(?:tree|plant|species))\b/i.test(englishText)
  if (intent?.id === 'locations' && ordinaryPlaceContext) return localize(FALLBACK, language)
  if (intent?.id === 'locations' && !ordinaryPlaceContext && tokenize(englishText).some((token) => PLACE_TOKENS.has(token))) {
    const at = results.findIndex((result) => result.kind === 'location')
    if (at > 0) results.unshift(...results.splice(at, 1))
    if (at >= 0) return localize(formatResults(results), language)
  }

  // A strong content match beats a loosely-triggered intent, but the handoff,
  // greeting, pricing and contact intents always win because they are what the
  // visitor actually asked for.
  const generalLocationQuestion = intent?.id === 'locations' && !ordinaryPlaceContext && !/\b(free|setup|offer)\b/i.test(englishText)
  const directPricing = intent?.id === 'pricing' && isDirectPricingQuestion(englishText)
  const intentWins = intent && (results.length === 0 || results[0].score < 12 || generalLocationQuestion || directPricing || ['help', 'seo-explainer', 'growth-help', 'human', 'greeting', 'thanks', 'contact'].includes(intent.id))
  if (intentWins) return localize(intent.reply(englishText), language)
  if (results.length) return localize(formatResults(results), language)
  return localize(FALLBACK, language)
}
