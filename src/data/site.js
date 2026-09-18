// Nothing in this file is invented. Every claim is one the studio can back up:
// the three client quotes are word for word, and project copy describes only
// work that is live at the linked address.

// www is what actually serves: the apex 308-redirects here. Every absolute URL
// the site declares about itself — canonical, og:url, JSON-LD, sitemap, robots —
// is built from this, so it has to name the host that answers with a 200.
export const siteOrigin = 'https://www.wavefrontstudiollc.com'

export const contact = {
  phone: '+1 (941) 415 2595',
  phoneHref: 'tel:+19414152595',
  phoneAlt: '(941) 415-0273',
  phoneAltHref: 'tel:+19414150273',
  supportPhone: '+1 (941) 415-2595',
  email: 'info@wavefrontstudiollc.com',
  emailHref: 'mailto:info@wavefrontstudiollc.com',
  address: 'Sarasota, FL 34234, United States',
  instagram: 'https://www.instagram.com/wavefrontstudio',
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

export const resourceLinks = [
  ['Lost Lead Calculator', '/lost-lead-calculator/'],
  ['Build Your Package', '/package-builder/'],
  ['Free Setup This Quarter', '/free-setup/'],
]

// Four top-level items. Portfolio and Contact Us sit under About, Custom Works
// under Our Services, so the bar stays short and every destination is one hover
// away. The 404 page flattens this list, so no href may appear twice.
export const primaryNav = [
  {
    label: 'About',
    href: '/about/',
    children: [
      ['Portfolio', '/portfolio/'],
      ['Contact Us', '/contact/'],
    ],
  },
  { label: 'Our Services', href: '/services/', children: [...serviceLinks, ['Custom Works', '/custom-works/']] },
  { label: 'Resources', href: null, children: resourceLinks },
  { label: 'Blog', href: '/blog/' },
]

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
  ],
}

export const footerCopy = {
  tagline: 'A four-person web, SEO and AI studio in Sarasota, Florida, building sites and tools that bring in enquiries.',
  copyright: 'Copyright © Wavefront Studio LLC. All rights reserved.',
}

export const testimonials = [
  {
    quote: 'Wavefront Studio built our entire website ecosystem from scratch - over 12 connected sites, all running smoothly. Their attention to detail and deep understanding of business was unlike any other agency we’ve worked with.',
    name: 'Tony Dyke',
    role: 'CEO',
    company: 'CEO of ResinRock',
    href: 'http://resinrock.com',
    image: '/images/Tony-Dyke.webp',
  },
  {
    quote: 'Our Google rankings completely transformed after working with Wavefront. We went from page five to page one in just a few months. The SEO strategy they built for us is still delivering results every single day.',
    name: 'Sharon Diaz',
    role: 'CEO',
    company: 'CEO',
    href: null,
    // No photo on file. The previous image was a stock portrait, which put a
    // stranger's face on a real client's words; initials stand in until Sharon
    // supplies her own.
    image: null,
  },
  {
    quote: 'They built us an automated lead system that captures enquiries from multiple websites and assigns them to the nearest available installer instantly. It saves us hours every single day and our response time has never been faster.',
    name: 'James Adkins',
    role: 'COO',
    company: 'COO',
    href: null,
    image: '/images/Screenshot-2026-04-03-at-12.11.26-AM.webp',
  },
]

export const testimonialsHeading = {
  title: 'What clients say',
  copy: 'Three clients, in their own words.',
}

// Each logo links to that client's live site (checked 2026-09-18).
export const clientLogos = [
  { src: '/images/clients/resin-rock.webp', alt: 'ResinRock company logo', href: 'https://resinrock.com/', className: 'is-light-wordmark' },
  { src: '/images/clients/glow-surfaces.webp', alt: 'Glow Surfaces company logo', href: 'https://glowsurfaces.com/', className: 'is-light-wordmark' },
  { src: '/images/clients/rr-leads.webp', alt: 'RR Leads company logo', href: 'https://resinrockleads.com/', className: 'is-light-wordmark' },
  { src: '/images/clients/titan-surfacing.webp', alt: 'Titan Surfacing company logo', href: 'https://titansurfacing.com/' },
  { src: '/images/clients/resin-rubber.webp', alt: 'Resin Rubber company logo', href: 'https://resin-rubber.com/', className: 'is-monochrome' },
]

// Images are screenshots of the live sites, not stock photography.
export const projects = [
  {
    title: 'Twelve connected websites for ResinRock',
    client: 'Tony Dyke',
    date: '2 September 2025',
    home: 'More than 12 sites for ResinRock, including product pages, material calculators, a site for the rubber division and campaign landing pages. Each one is built to load fast and rank.',
    portfolio: 'More than 12 websites that work together: product pages, material calculators, a separate site for the rubber division and landing pages for campaigns. Each one is built to load fast and to be found on Google.',
    href: 'http://resinrock.com',
    image: '/images/work/resinrock-site.webp',
    alt: 'The ResinRock homepage, with its product menu and a video of a warehouse team loading marble chips',
  },
  {
    title: 'Lead routing for the ResinRock installer network',
    client: 'Resin Leads',
    date: '22 January 2026',
    home: 'Enquiries from several websites land in one system, which sends each one to the nearest available installer straight away, so nobody sorts leads by hand.',
    portfolio: 'Enquiries arrive from several websites. The system checks where each customer is and passes the lead to the nearest available installer within moments, so no one has to sort and forward them by hand.',
    href: 'http://resinrockleads.com',
    image: '/images/work/resinrockleads-site.webp',
    alt: 'The Resin Rock Leads homepage, offering verified leads to professional installers',
  },
  {
    title: 'Getting ResinRock onto the first page of Google',
    client: 'Resin Rock',
    date: '11 October 2025',
    home: 'Technical fixes, keyword research, on-page work and content structure that took ResinRock onto the first page of Google for its main industry searches.',
    portfolio: 'Technical fixes, keyword research, on-page changes and a restructure of the content. ResinRock went from low visibility to the first page of Google for competitive industry searches.',
    href: 'https://resinrock.com/pages/resin-bound',
    image: '/images/work/resinrock-seo-page.webp',
    alt: 'The ResinRock resin bound page: a driveway photo under the headline and keyword-led copy below',
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
