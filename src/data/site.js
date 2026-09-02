// Every string in this file is taken from wavefrontstudiollc.com. Nothing here is
// invented: if the live site does not say it, it is not here.

export const siteOrigin = 'https://wavefrontstudiollc.com'

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
    ['Terms Of Use', '/terms-of-use/'],
    ['Privacy Policy', '/privacy-policy/'],
    ['Cookie Policy', '/cookie-policy/'],
    ['SMS Policy', '/sms-policy/'],
  ],
}

export const footerCopy = {
  tagline: 'Your growth, our mission. We build websites, AI tools, and digital strategies that actually deliver results.',
  readyHeading: 'Ready to Start?',
  readySub: "Have an idea or a challenge? We'd love to hear about it.",
  readyBody: "Reach out today and let's turn your vision into a powerful digital reality",
  copyright: 'Copyright © Wavefront Studio LLC. All Rights Reserved.',
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
    image: '/images/Team-1-1.webp',
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
  eyebrow: 'Testimonials',
  title: 'Member Feedback & Reviews',
  copy: 'Don’t just take our word for it – hear from the businesses we’ve helped grow, launch, and scale with our digital solutions.',
}

export const clientLogos = [
  { src: '/images/clients/resin-rock.webp', alt: 'ResinRock company logo', className: 'is-light-wordmark' },
  { src: '/images/clients/glow-surfaces.webp', alt: 'Glow Surfaces company logo', className: 'is-light-wordmark' },
  { src: '/images/clients/rr-leads.webp', alt: 'RR Leads company logo', className: 'is-light-wordmark' },
  { src: '/images/clients/titan-surfacing.webp', alt: 'Titan Surfacing company logo' },
  { src: '/images/F.webp', alt: 'Resin Rubber company logo', className: 'is-monochrome' },
]

export const projects = [
  {
    title: 'Complete Website Ecosystem for ResinRock Industries',
    client: 'Tony Dyke',
    date: '02 September 2025',
    home: 'Designed and developed 12+ interconnected websites for ResinRock – including product pages, custom calculators, a rubber division site, and landing pages – all built for performance, SEO, and seamless user experience.',
    portfolio: 'A full-scale digital ecosystem of 12+ websites – from product showcases and custom calculators to a dedicated rubber division site and high-converting landing pages – all built to work together seamlessly.',
    href: 'http://resinrock.com',
    image: '/images/digital-3d-creator-improving-industrial-prototype-component.webp',
    alt: '3D creator improving an industrial prototype component using digital design tools',
  },
  {
    title: 'Automated Lead Distribution System for ResinRock',
    client: 'Resin Leads',
    date: '22 January 2026',
    home: 'Built a fully automated lead management system that captures enquiries from multiple websites and instantly assigns them to the nearest available installer – eliminating manual follow-ups and speeding up response times.',
    portfolio: 'A custom-built automation system that collects incoming enquiries across multiple websites and intelligently routes them to the nearest available installer in real time – zero manual work, faster response, more conversions.',
    href: 'http://resinrockleads.com',
    image: '/images/architect-holding-digital-tablet-with-building-model.webp',
    alt: 'Architect holding a digital tablet displaying a building model',
  },
  {
    title: 'SEO & First-Page Google Ranking for ResinRock',
    client: 'Resin Rock',
    date: '11 October 2025',
    home: 'Executed a comprehensive SEO strategy including technical optimization, keyword targeting, and content structuring – successfully ranking ResinRock on the first page of Google for key industry search terms.',
    portfolio: 'A complete SEO overhaul covering technical fixes, keyword research, on-page optimization, and content strategy – taking ResinRock from low visibility to Google’s first page for competitive industry keywords.',
    href: 'http://resinrock.com',
    image: '/images/professional-woman-photo-retoucher-working-with-digital-assets.webp',
    alt: 'Professional photo retoucher working with digital assets on a multi-monitor setup',
  },
]

// The service cards used on the home page and the About page.
export const offerings = [
  { name: 'Website Development', href: '/web-development/', copy: 'We build fast, responsive, and SEO-optimized websites using Shopify, WordPress, custom code, and modern frameworks. Whether it’s a landing page, e-commerce store, or a multi-site ecosystem – your website will be built to convert visitors into customers.' },
  { name: 'AI Chatbot Integration', href: '/ai-chatbot/', copy: 'We build and integrate smart AI-powered chatbots that handle customer inquiries 24/7, qualify leads, and book appointments automatically. Save time, reduce costs, and never miss a potential customer – even outside business hours.' },
  { name: 'Live Visualizer', href: '/live-visualizer/', copy: 'We build custom live visualizer tools that let your customers upload their own photos – like homes or spaces – and preview your products, materials, and colors on them in real time. Perfect for boosting buyer confidence and reducing returns.' },
  { name: 'Custom Calculators', href: '/custom-calculators/', copy: 'We design and develop fully custom web calculators with built-in ordering systems – perfect for businesses that need instant quoting, material estimation, pricing tools, or any calculation-driven workflow on their website.' },
  { name: 'Digital Marketing', href: '/digital-marketing/', copy: 'From paid ads and email campaigns to content marketing and funnel optimization – we create data-driven marketing strategies that increase your reach, generate qualified leads, and maximize your return on every dollar spent.' },
  { name: 'Graphics Design', href: '/graphic-design/', copy: 'Our designers craft bold logos, brand identities, social media graphics, and print-ready materials that make your brand instantly recognizable. Great design isn’t decoration – it’s your first impression, and we make it count.' },
  { name: 'Social Media Strategy', href: '/social-media-strategy/', copy: 'We build and manage result-oriented social media campaigns across Instagram, Facebook, LinkedIn, TikTok, and more. From content calendars and engagement strategies to paid promotions – we grow your audience and turn followers into loyal customers.' },
  { name: 'Mobile App Development', href: '/mobile-app-development/', copy: 'We design and develop custom iOS and Android applications that are fast, intuitive, and scalable. Whether you need a customer-facing app, an internal business tool, or an MVP for your startup – we bring your app idea to life.' },
  { name: 'SEO Service', href: '/seo-service/', copy: 'We help your business rank higher on Google with proven SEO strategies – including technical audits, keyword research, on-page optimization, link building, and local SEO. More visibility means more traffic, more leads, and more revenue.' },
  { name: 'Free Website Audit', href: '/free-audit/', copy: 'We review your website’s mobile usability, performance, technical SEO, search visibility, and enquiry path, then prioritize the fixes worth doing first. The initial audit is free, practical, and yours to use whether or not you hire us.' },
  { name: 'Lead Capture Systems', href: '/lead-capture/', copy: 'We build connected lead capture systems that collect enquiries, ask the right qualifying questions, create structured CRM records, and route each opportunity to the right person while customer interest is still high.' },
]

export const offeringsHeading = {
  eyebrow: 'What We Offer',
  title: 'Full-Service Digital Solutions Tailored to Your Business Goals',
}
