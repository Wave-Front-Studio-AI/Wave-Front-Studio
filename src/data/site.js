// Nothing in this file is invented. Every claim is one the studio can back up:
// client reviews come live from Google, word for word, and project copy
// describes only work that is live at the linked address.

// www is what actually serves: the apex 308-redirects here. Every absolute URL
// the site declares about itself — canonical, og:url, JSON-LD, sitemap, robots —
// is built from this, so it has to name the host that answers with a 200.
export const siteOrigin = 'https://www.wavefrontstudiollc.com'

// The byline on every blog post. First name only until the surname is
// confirmed for publishing.
export const blogAuthor = { name: 'Daniel', role: 'Wavefront Studio' }

export const contact = {
  phone: '+1 (941) 415 2595',
  phoneHref: 'tel:+19414152595',
  supportPhone: '+1 (941) 415-2595',
  email: 'info@wavefrontstudiollc.com',
  emailHref: 'mailto:info@wavefrontstudiollc.com',
  address: '4363 Independence Ct, Sarasota, FL 34234, United States',
  // Kept in step with openingHoursSpecification in src/data/seo.js.
  hours: 'Monday to Friday, 8am to 5pm Eastern',
  instagram: 'https://www.instagram.com/wavefrontstudio',
  facebook: 'https://www.facebook.com/p/Wavefront-Studio-61593264447650/',
  // The Google Business Profile, without the tracking parameters on the shared link.
  googleProfile: 'https://www.google.com/maps/place/Wavefront+Studio+LLC/data=!4m2!3m1!1s0x0:0xbd4481c35228d5eb',
  maps: 'https://www.google.com/maps/place/4363+Independence+Ct,+Sarasota,+FL+34234,+USA/',
}

export const serviceLinks = [
  ['Web Development', '/web-development/'],
  ['Website SEO', '/seo-service/'],
  ['Mobile App', '/mobile-app-development/'],
  ['Social Media', '/social-media-strategy/'],
  ['Graphic Design', '/graphic-design/'],
  ['Digital Marketing', '/digital-marketing/'],
  ['Free Website Audit', '/free-audit/'],
  ['Lead Capture', '/lead-capture/'],
]

export const customWorkLinks = [
  ['AI Chatbot', '/ai-chatbot/'],
  ['Live Visualizer', '/live-visualizer/'],
  ['Custom Calculators', '/custom-calculators/'],
]

// The header follows realtimemarketing.com's layout: logo, five items, and a
// "Speak to the studio" button, with a Contact / Call / Menu bar fixed to the
// bottom on phones. The menus open in the style of the studio's sister site,
// wavefrontstudio.ai: Services as a wide panel (the core services with a line
// each, the custom work beside them, a panel through to the full list),
// Resources and Who we are as cards. Each child is [label, href, one line].
// The 404 page flattens `children` and `secondary.links`, so no href may
// appear twice anywhere in this list.
export const primaryNav = [
  {
    label: 'Services',
    href: '/services/',
    layout: 'mega',
    title: 'Core services',
    children: [
      ['Website development', '/web-development/', 'Fast sites built to turn visits into enquiries.'],
      ['SEO', '/seo-service/', 'Get found on Google Search and Maps.'],
      ['Lead capture systems', '/lead-capture/', 'Every enquiry reaches the right person while they are still keen.'],
      ['Digital marketing', '/digital-marketing/', 'Ads, email and content tied to the enquiries they bring.'],
      ['Social media', '/social-media-strategy/', 'Managed accounts and content that keep you in view.'],
      ['Graphic design', '/graphic-design/', 'Logos, brand identities and print-ready files.'],
      ['Mobile apps', '/mobile-app-development/', 'iOS and Android apps for your customers or your team.'],
    ],
    secondary: {
      title: 'Custom work',
      links: [
        ['AI chatbots', '/ai-chatbot/'],
        ['Live visualiser', '/live-visualizer/'],
        ['Custom calculators', '/custom-calculators/'],
        ['All custom work', '/custom-works/'],
        ['Free website audit', '/free-audit/'],
      ],
    },
    feature: { kicker: 'Everything we build', title: 'Find the service that fits the work.', label: 'See all services' },
  },
  {
    label: 'Resources',
    href: null,
    layout: 'cards',
    children: [
      ['Build your package', '/package-builder/', 'Pick the services you need and see the cost as you go.'],
      ['Lost lead calculator', '/lost-lead-calculator/', 'Work out what slow or missed replies cost you each month.'],
      ['Free setup this quarter', '/free-setup/', 'Setup fees waived for five businesses this quarter.'],
      ['FAQs', '/faqs/', 'Straight answers on timelines, platforms and support.'],
    ],
  },
  {
    label: 'Who we are',
    href: null,
    layout: 'cards',
    children: [
      ['About us', '/about/', 'Four people in Sarasota who build sites that bring in work.'],
      ['Portfolio', '/portfolio/', 'Live sites, tools and lead systems we have built.'],
      ['Blog', '/blog/', 'Plain advice on websites, search and enquiries.'],
    ],
  },
  { label: 'Contact', href: '/contact/' },
]

// The phone menu is one flat list in large type; the last line is the audit.
export const mobileNav = [
  ['Services', '/services/'],
  ['Custom work', '/custom-works/'],
  ['Build your package', '/package-builder/'],
  ['Portfolio', '/portfolio/'],
  ['About us', '/about/'],
  ['Blog', '/blog/'],
  ['Lost lead calculator', '/lost-lead-calculator/'],
  ['Contact us', '/contact/'],
  ['Get a free site audit', '/free-audit/'],
]

// The button at the right of the header.
export const navCta = { label: 'Speak to the studio', href: '/contact/' }

export const footerNav = {
  popularServices: [
    ['All Services', '/services/'],
    ['Web Development', '/web-development/'],
    ['App Development', '/mobile-app-development/'],
    ['Digital Marketing', '/digital-marketing/'],
    ['Graphic Design', '/graphic-design/'],
    ['Search Engine Optimization', '/seo-service/'],
    ['Free Website Audit', '/free-audit/'],
    ['Lead Capture Systems', '/lead-capture/'],
  ],
  quickLinks: [
    ['All Custom Works', '/custom-works/'],
    ['AI Chatbot', '/ai-chatbot/'],
    ['Live Visualizer', '/live-visualizer/'],
    ['Custom Calculators', '/custom-calculators/'],
    ['Build Your Package', '/package-builder/'],
    ['Contact Us', '/contact/'],
    ['FAQs', '/faqs/'],
    ['Where We Work', '/locations/'],
  ],
  legal: [
    ['Terms of Use', '/terms-of-use/'],
    ['Privacy Policy', '/privacy-policy/'],
    ['Cookie Policy', '/cookie-policy/'],
    ['SMS Policy', '/sms-policy/'],
    // Meta Platform Terms 3.d.i.1 wants the deletion route "easily accessible
    // and clearly marked", which means a link of its own rather than a
    // paragraph inside the privacy policy.
    ['Delete Your Data', '/data-deletion/'],
    // The CPRA opt-out link. Its wording is set by the statute, so it is spelled
    // out in full rather than shortened to fit the row.
    ['Do Not Sell or Share My Personal Information', '/do-not-sell/'],
    // The client app's public home page, which Google's OAuth review checks.
    ['Client platform', '/platform/'],
  ],
}

export const footerCopy = {
  tagline: 'A four-person web, SEO and AI studio in Sarasota, Florida, building sites and tools that bring in enquiries.',
  copyright: 'Copyright © Wavefront Studio LLC. All rights reserved.',
}

// Client reviews are the live Google ones (/api/reviews/); there are no
// written testimonials of our own. Until they load, or if Google cannot be
// reached, the sections point to the Google listing instead.
export const testimonialsHeading = {
  title: 'What clients say on Google',
  copy: 'Read what clients say about us, word for word, on our Google listing.',
}

// Reviewers the studio has chosen not to show (the team's own reviews),
// matched by first name, on every page. Google's overall rating and review
// count are shown as Google reports them.
export const hiddenReviewers = ['Scott', 'Daniel', 'Tony', 'Carla']

export function isHiddenReviewer(name = '') {
  const first = name.trim().split(/\s+/)[0].toLowerCase()
  return hiddenReviewers.some((hidden) => hidden.toLowerCase() === first)
}


// The Google Business Profile (its permanent Maps link). The live rating and
// reviews come from /api/reviews/; this link works even when that is down.
export const googleListingUrl = 'https://www.google.com/maps?cid=13638168247481718251'

// Each logo links to that client's live site (checked 2026-09-18; Epitrite 2026-09-21).
export const clientLogos = [
  { src: '/images/clients/resin-rock.webp', width: 276, height: 80, alt: 'ResinRock company logo', href: 'https://resinrock.com/', className: 'is-light-wordmark' },
  { src: '/images/clients/glow-surfaces.webp', width: 303, height: 80, alt: 'Glow Surfaces company logo', href: 'https://glowsurfaces.com/', className: 'is-light-wordmark' },
  { src: '/images/clients/rr-leads.webp', width: 176, height: 80, alt: 'RR Leads company logo', href: 'https://resinrockleads.com/', className: 'is-light-wordmark' },
  { src: '/images/clients/titan-surfacing.webp', width: 377, height: 124, alt: 'Titan Surfacing company logo', href: 'https://titansurfacing.com/' },
  { src: '/images/clients/resin-rubber.webp', width: 372, height: 80, alt: 'Resin Rubber company logo', href: 'https://resin-rubber.com/', className: 'is-monochrome' },
  { src: '/images/clients/epitrite.webp', width: 228, height: 80, alt: 'Epitrite company logo', href: 'https://www.epitrite.com/' },
]

// Images are screenshots of the live sites, not stock photography.
export const projects = [
  {
    title: 'Twelve connected websites for a surfacing manufacturer',
    client: 'ResinRock, our sister company',
    date: '2 September 2025',
    home: 'More than 12 sites for our sister company, a surfacing manufacturer, including product pages, material calculators, a site for the rubber division and campaign landing pages. Each one is built to load fast and rank.',
    portfolio: 'More than 12 websites that work together: product pages, material calculators, a separate site for the rubber division and landing pages for campaigns. Each one is built to load fast and to be found on Google.',
    href: 'http://resinrock.com',
    image: '/images/work/resinrock-site.webp',
    alt: 'The manufacturer’s homepage, with its product menu and a video of a warehouse team loading marble chips',
  },
  {
    title: 'Lead routing for an installer network',
    client: 'ResinRock, our sister company',
    date: '22 January 2026',
    home: 'Enquiries from several websites land in one system, which sends each one to the nearest available installer straight away, so nobody sorts leads by hand.',
    portfolio: 'Enquiries arrive from several websites. The system checks where each customer is and passes the lead to the nearest available installer within moments, so no one has to sort and forward them by hand.',
    href: 'http://resinrockleads.com',
    image: '/images/work/resinrockleads-site.webp',
    alt: 'The lead network’s homepage, offering verified leads to professional installers',
  },
  {
    title: 'From low visibility to the first page of search results',
    client: 'ResinRock, our sister company',
    date: '11 October 2025',
    home: 'Technical fixes, keyword research, on-page work and content structure that took a manufacturer’s site onto the first page of Google for its main industry searches.',
    portfolio: 'Technical fixes, keyword research, on-page changes and a restructure of the content. The site went from low visibility to the first page of Google for competitive industry searches.',
    href: 'https://resinrock.com/pages/resin-bound',
    // A search results page (Brave Search, September 2026) with resinrock.com
    // on page one. Swap for a Google results screenshot when one is taken.
    image: '/images/work/resinrock-search-results.webp',
    alt: 'Brave Search results for resin bound products, with the client’s site listed on the first page between Amazon and AeroMarine',
  },
]

// The services index used on the home, About and place pages. Services are
// grouped by what they do for the customer, so a visitor can find the part of
// their problem first and the service second. The audit stands apart as the
// starting point for anyone who is not sure yet.
export const offeringGroups = [
  { id: 'found', title: 'Get found', copy: 'So the right people find you on Google and social.' },
  { id: 'enquiries', title: 'Turn visits into enquiries', copy: 'So the people who land on your site get in touch.' },
  { id: 'decide', title: 'Help customers decide', copy: 'Tools that answer “what will it look like?” and “what will it cost?”' },
  { id: 'brand', title: 'Brand and apps', copy: 'How you look everywhere, and software your customers or team use.' },
]

export const offerings = [
  { name: 'Website development', group: 'enquiries', href: '/web-development/', copy: 'Business sites, online shops and multi-site setups on WordPress, Shopify or custom code, built to load fast and turn visits into enquiries.' },
  { name: 'SEO', group: 'found', href: '/seo-service/', copy: 'Technical audits, keyword research, on-page fixes, link building and local SEO for Google Search and Maps.' },
  { name: 'AI chatbots', group: 'enquiries', href: '/ai-chatbot/', copy: 'A chat assistant on your site that answers customer questions at any hour, qualifies the lead and books the appointment.' },
  { name: 'Lead capture systems', group: 'enquiries', href: '/lead-capture/', copy: 'Forms and chat that collect the enquiry, ask the qualifying questions, create the CRM record and pass it to the right person while the customer is still keen.' },
  { name: 'Custom calculators', group: 'decide', href: '/custom-calculators/', copy: 'Quote and material calculators with ordering built in, for businesses that price by size, quantity or specification.' },
  { name: 'Live visualiser', group: 'decide', href: '/live-visualizer/', copy: 'Customers upload a photo of their driveway, wall or room and see your products on it before they order.' },
  { name: 'Digital marketing', group: 'found', href: '/digital-marketing/', copy: 'Paid ads, email campaigns, content and the landing pages they point to.' },
  { name: 'Social media', group: 'found', href: '/social-media-strategy/', copy: 'Content calendars and managed accounts on Instagram, Facebook, LinkedIn and TikTok, with paid promotion where it earns its keep.' },
  { name: 'Graphic design', group: 'brand', href: '/graphic-design/', copy: 'Logos, brand identities, social graphics and print-ready files.' },
  { name: 'Mobile apps', group: 'brand', href: '/mobile-app-development/', copy: 'iOS and Android apps, from a first version for a startup to internal tools for your own team.' },
  { name: 'Free website audit', group: 'start', href: '/free-audit/', copy: 'We check mobile usability, speed, technical SEO, search visibility and the enquiry path, then list the fixes worth doing first. The audit is yours to keep whether or not you hire us.' },
]
