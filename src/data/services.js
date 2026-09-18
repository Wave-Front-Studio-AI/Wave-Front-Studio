// The core "Our Services" pages. The original six preserve the matching live-site
// copy; the audit and lead-capture offers are grounded in Wavefront's AI-site copy.

export const services = [
  {
    slug: 'web-development',
    nav: 'Web Development',
    name: 'Website Development',
    subhead: 'Fast, responsive and built to convert',
    metaTitle: 'Custom Website Development Services | Wavefront Studio',
    metaDescription: 'We design and build websites that load fast and bring in enquiries: business sites, online stores, SaaS platforms, landing pages and multi-site setups.',
    hero: {
      alt: 'Wavefront Studio video about website development',
      video: '/videos/web-development-ad.mp4',
      poster: '/videos/web-development-poster.webp',
    },
    approach: {
      title: 'What we build',
      paragraphs: [
        'We build every type of website: B2B and corporate sites, e-commerce stores, portfolios, SaaS platforms, landing pages and multi-site setups. For ResinRock we built more than 12 connected sites. Every project starts from scratch, built for speed, search visibility and conversions.',
        'Our team works with WordPress, Shopify, WooCommerce, custom HTML/CSS and modern JavaScript frameworks. The result loads fast, ranks on Google and works properly on every device. You’re involved at each stage, from strategy and wireframes through design, development and launch, so what ships is what your business actually needs.',
      ],
      image: {
        image: '/images/work/resinrock-site.webp',
        alt: 'The ResinRock homepage in a desktop browser',
        caption: 'resinrock.com, one of the 12+ connected sites we built for ResinRock.',
      },
    },
    features: [
      'Fully custom responsive design for all devices',
      'SEO-optimised structure and clean code',
      'E-commerce and online store development',
      'Multi-site and multi-page ecosystems',
      'Custom calculators and interactive tools',
      'Fast loading speed and performance optimisation',
      'CMS integration for easy content management',
      'Ongoing maintenance and technical support',
    ],
    deliver: {
      title: 'What we deliver',
      paragraphs: [
        'Every site we build has to work, with a structure suited for search, contact forms and calls-to-action placed where people actually click, and pages that load quickly on a phone. However someone arrives, from Google, social media or an ad, the site should be ready to turn them into an enquiry.',
        'We don’t disappear after launch. That covers maintenance, security updates, performance monitoring, content updates and new features as you need them. Adding a product line, expanding into a new market, or wanting a calculator or chatbot bolted on? We build those in as your site grows.',
      ],
      image: '/images/calc.webp',
      alt: 'The ResinRock material calculator, showing a price breakdown for a patio project',
      caption: 'A material calculator we built for ResinRock. It prices the job and adds everything to the cart.',
    },
    cta: {
      title: 'Your website should work as hard as you do',
      copy: 'A good website pays for itself over time. We build sites that turn visitors into enquiries.',
    },
  },

  {
    slug: 'seo-service',
    nav: 'Website SEO',
    name: 'Search Engine Optimisation',
    subhead: 'Rank higher and get found on Google',
    metaTitle: 'SEO Services – Rank Higher on Google | Wavefront Studio',
    metaDescription: 'SEO for businesses that want to be found on Google: keyword research, technical audits, on-page fixes, link building and local search.',
    hero: {
      alt: 'Wavefront Studio video about showing up on Google',
      video: '/videos/seo-google-presence-ad.mp4',
      poster: '/videos/seo-google-presence-poster.webp',
    },
    approach: {
      title: 'How we get you to page one',
      paragraphs: [
        'We build a complete SEO strategy to get your business onto the first page of Google and keep it there. That covers keyword research, competitor analysis, technical audits, on-page optimisation and link building, all aimed at organic traffic that turns into paying customers.',
        'We look at what your target audience actually searches for, find the gaps in your current rankings, and build a step-by-step plan to close them. A local business chasing Google Maps visibility and a national brand competing for high-volume keywords need different strategies, so we build each one around your specific market.',
      ],
    },
    features: [
      'Comprehensive technical SEO audits',
      'Keyword research and competitor analysis',
      'On-page optimisation and meta tag strategy',
      'Backlink building from relevant, real sites',
      'Local SEO and Google Business optimisation',
      'Page speed and Core Web Vitals improvement',
      'Monthly reporting and keyword tracking',
      'Content strategy and blog optimisation',
    ],
    deliver: {
      title: 'What we deliver',
      paragraphs: [
        'Technical SEO is where a lot of agencies cut corners. We don’t: we go through your site’s structure, fix crawl errors, improve page speed, clean up broken links and make sure Google can index every page that matters. A good-looking website is wasted if search engines can’t find it.',
        'SEO isn’t a one-off project. We provide monthly reporting, keyword tracking, content recommendations and ongoing optimisation so rankings keep moving in the right direction. We took ResinRock from low visibility to Google’s first page for competitive industry terms, working the same way: steady, monthly effort rather than a single push.',
      ],
    },
    plans: {
      title: 'SEO plans for wherever your site is right now',
      copy: 'Some sites need a technical cleanup. Others need a full rebuild with ongoing management. We have a plan for wherever yours is right now.',
      footnote: 'Not sure which plan fits? Book a free consultation. We’ll audit your site and recommend what makes sense, no commitment required.',
      items: [
        {
          name: 'SEO audit & fix',
          billing: 'One-Time',
          copy: 'For websites that already have clear pages and content but aren’t showing up on Google. We fix what’s broken so search engines can find you.',
          bestFor: 'Businesses with an existing website that has good content but poor or no Google visibility.',
          included: [
            'Full technical SEO audit of your entire site',
            'Meta titles & descriptions optimised for every page',
            'XML sitemap creation & submission',
            'Google Search Console setup & verification',
            'Broken link detection & removal',
            'Image alt tags & heading structure cleanup',
            'Robots.txt & indexing configuration',
          ],
          excluded: [
            'Website redesign or new content writing',
            'Monthly management or blog writing',
            'Backlink building or keyword research',
          ],
        },
        {
          name: 'Full SEO rebuild',
          billing: 'One-Time',
          copy: 'For websites that need a complete overhaul: new structure, new content, new URLs. We rebuild your site from the ground up with SEO built in from the start.',
          bestFor: 'Businesses with an outdated or poorly structured website that needs a fresh start to rank on Google.',
          included: [
            'Everything in SEO audit & fix',
            'Complete website redesign with SEO-first structure',
            'In-depth keyword research & competitor analysis',
            'SEO-rich content written for every page',
            'URL restructuring & old URL redirects (301s)',
            'Clean, optimised page speed & mobile responsiveness',
            'Schema markup & structured data implementation',
          ],
          excluded: [
            'Monthly management or ongoing optimisation',
            'Blog writing or backlink building',
            'Daily monitoring or issue resolution',
          ],
        },
        {
          name: 'Monthly SEO',
          billing: 'Monthly',
          popular: true,
          copy: 'For businesses that want to hold a first-page ranking on Google. We manage content, backlinks, technical health and performance every month.',
          bestFor: 'Businesses ready to invest in long-term growth and compete seriously on Google search results.',
          included: [
            'Everything in SEO audit & fix',
            'Weekly blog posts with targeted keywords',
            'Backlink building & outreach campaigns',
            'Daily site monitoring & issue resolution',
            'Google algorithm updates & adaptation',
            'New content creation & page optimisation',
            'Site structure updates as your business grows',
            'Competitor tracking & ranking reports',
            'Monthly analytics reports & strategy calls',
            'Priority support & dedicated SEO manager',
          ],
          excluded: [],
        },
      ],
    },
    cta: {
      title: 'Your customers are searching. Make sure they find you.',
      copy: 'SEO keeps paying off long after you stop actively promoting a page. Let’s get your business ranking on page one, where the clicks are.',
    },
  },

  {
    slug: 'mobile-app-development',
    nav: 'Mobile App',
    name: 'Mobile App Development',
    subhead: 'Custom apps built to scale your business',
    metaTitle: 'Custom Mobile App Development | Wavefront Studio LLC',
    metaDescription: 'iOS and Android apps for your customers or your own team, from a first version to a finished product, designed and built in Sarasota.',
    hero: {},
    approach: {
      title: 'Why businesses trust us with their apps',
      paragraphs: [
        'We design and build custom mobile apps for iOS and Android that are fast, straightforward to use, and solve a real business problem. It could be a customer-facing app, an internal operations tool, a delivery tracking system or a first version for a startup. Every app is built from scratch, matched to what you actually need, and built to grow with your business.',
        'Our process runs from initial concept and UX wireframing through design, coding, testing and app store submission. We build in React Native, Flutter or native code, depending on what the project needs: a cross-platform app to save time and budget, or a fully native build when performance matters most.',
      ],
    },
    features: [
      'Custom iOS and Android app development',
      'Cross-platform apps with React Native & Flutter',
      'UI/UX design and interactive prototyping',
      'Push notifications and real-time messaging',
      'In-app payments and subscription systems',
      'API integrations and backend development',
      'App Store and Google Play submission',
      'Ongoing maintenance, updates, and support',
    ],
    deliver: {
      title: 'What we deliver',
      paragraphs: [
        'Every app is designed around the user first: smooth navigation, fast load times, clean interfaces, workflows that make sense without a tutorial. An app people don’t enjoy using is an app people delete. Onboarding screens, push notifications, in-app payments, real-time data syncing: every feature gets tested before it reaches your customers.',
        'Launch is just the start. We handle bug fixes, performance monitoring, feature updates and OS compatibility checks to keep the app fast, secure and current. Need new functionality, a third-party API integration, or a move to a new platform? We keep working on it after launch.',
      ],
    },
    cta: {
      title: 'Your next idea deserves a well-built app',
      copy: 'We take your app from concept to launch, then keep supporting it as your business grows.',
    },
  },

  {
    slug: 'social-media-strategy',
    nav: 'Social Media',
    name: 'Social Media Strategy',
    subhead: 'Grow your audience and turn followers into customers',
    metaTitle: 'Social Media Management & Strategy | Wavefront Studio',
    metaDescription: 'Social media planning and account management on Instagram, Facebook, LinkedIn and TikTok, with content calendars, reporting and paid promotion.',
    hero: {},
    approach: {
      title: 'How we grow brands on social media',
      paragraphs: [
        'We build and manage social media strategies that grow your audience, build engagement, and turn followers into paying customers. We work across Instagram, Facebook, TikTok, LinkedIn and YouTube, tailored to wherever your audience actually spends time and what gets them to act.',
        'We start by understanding your brand, your competitors and your audience, then build a content calendar, define your brand voice, plan campaigns and create visuals and copy that fit your goals. More brand awareness, more leads, or more direct sales: whichever you’re after, every post, reel and story is built around that goal.',
      ],
    },
    features: [
      'Content calendar planning and scheduling',
      'Instagram, Facebook, TikTok, LinkedIn, and YouTube',
      'Professional graphic design and video content',
      'Hashtag research and audience targeting',
      'Paid social media advertising and promotions',
      'Community management and engagement',
      'Monthly analytics reports and performance reviews',
      'Brand voice development and messaging consistency',
    ],
    extra: {
      title: 'Managing brands. Delivering results.',
      paragraphs: [
        'Our team manages social media for a working group of clients: producing content, running campaigns and tracking engagement across platforms. Every client gets a monthly analytics report showing what’s working, what’s growing and where we’re taking their brand next.',
        'We handle content creation and scheduling, community management, paid campaigns and influencer outreach, so your brand shows up every day without it falling on you. The strategy stays consistent: plan the content, post on schedule, watch what performs, and adjust.',
      ],
      features: [
        'Monthly analytics reports with full performance breakdowns',
        'Weekly check-ins so you always know what’s live and what’s next',
      ],
    },
    deliver: {
      title: 'What we deliver',
      paragraphs: [
        'We track performance and engagement, and adjust strategy based on what’s actually working, across organic content, hashtag strategy, paid promotions and influencer collaborations. That’s how the account keeps growing month over month instead of plateauing after the first few weeks.',
        'Social media takes time most business owners don’t have, and that’s why we exist. We handle content creation, scheduling, community management, comment responses and DMs. You run your business; we keep your brand active, visible and responsive across every platform.',
      ],
    },
    cta: {
      title: 'Your audience is scrolling. Give them a reason to stop.',
      copy: 'Most customers check your social media before they check your website. We help you show up well when they do.',
    },
  },

  {
    slug: 'graphic-design',
    nav: 'Graphic Design',
    name: 'Graphic Design',
    subhead: 'Bold visuals that make your brand memorable',
    metaTitle: 'Professional Graphic Design Services | Wavefront Studio',
    metaDescription: 'Logos, brand identities, social graphics and print files, designed to look consistent everywhere your business shows up.',
    hero: {},
    approach: {
      title: 'What makes our designs different',
      paragraphs: [
        'We create visual identities that communicate who you are and why customers should choose you: logos, brand kits, social media graphics, packaging, print materials and ad creatives. The goal is a brand people recognise the moment they see it, across every platform.',
        'Our designers take time to understand your business, audience and competitors before starting. We look at what works in your market, then design visuals meant to set you apart rather than blend in. New brand or refresh of an old one, we deliver work that feels considered and specific to you.',
      ],
    },
    features: [
      'Custom logo design and full brand identity',
      'Social media graphics and reusable templates',
      'Business cards, flyers, brochures, and menus',
      'Packaging, labels, and product design',
      'Website banners, ad creatives, and email headers',
      'Brand guidelines and style documentation',
      'Print-ready and digital-ready file delivery',
      'Unlimited revisions until it’s right',
    ],
    deliver: {
      title: 'What we deliver',
      paragraphs: [
        'Consistency is what separates an amateur brand from a professional one. We don’t hand over a logo and disappear. We build a full brand system: colour palettes, typography, icons, templates and style guidelines, so a social media post, a business card, a banner and a billboard all look like they came from the same business.',
        'We design for digital and print. Social media templates your team can reuse every week? Done. Packaging that stands out on a shelf? We’ve got you. Brochures, flyers, trade show banners, vehicle wraps, email headers, pitch decks: if it needs to represent your brand, we design it and deliver print-ready files.',
      ],
    },
    cta: {
      title: 'Your brand’s first impression happens in seconds. Make it count.',
      copy: 'Good design shapes what people think of your business before you say a word. We create visuals that stick.',
    },
  },

  {
    slug: 'digital-marketing',
    nav: 'Digital Marketing',
    name: 'Digital Marketing',
    subhead: 'Ads, email and funnels planned around your numbers',
    metaTitle: 'Digital Marketing Services | Wavefront Studio LLC',
    metaDescription: 'Google Ads, paid social, email and funnels, planned from your data and adjusted as results come in, so you can see which spend brings in customers.',
    hero: {},
    approach: {
      title: 'How we drive growth for your business',
      paragraphs: [
        'We build digital marketing campaigns around targeting and ongoing optimisation: Google Ads, paid social, email marketing, funnels and retargeting. Every campaign has one goal: more qualified leads, turned into customers, at the lowest cost we can manage.',
        'We start by understanding your business, audience and competitors: where your ideal customers spend time online, what gets them to act, and how competitors are already reaching them. From there we build a marketing plan across the channels that actually matter for your market.',
      ],
    },
    features: [
      'Google Ads search, display, and shopping campaigns',
      'Facebook, Instagram, and TikTok advertising',
      'Email marketing and automated drip sequences',
      'Sales funnel design and conversion optimisation',
      'Landing page creation and A/B testing',
      'Audience targeting, retargeting, and lookalike campaigns',
      'Detailed analytics, tracking, and ROI reporting',
      'Monthly strategy reviews and ongoing optimisation',
    ],
    deliver: {
      title: 'What we deliver',
      paragraphs: [
        'We treat your budget like it’s our own: every dollar has a job. We set up tracking and attribution so you can see which campaigns are driving calls, form submissions, purchases and revenue. We run ongoing A/B tests on ad copy, creatives, audiences and landing pages, then scale what converts and cut what doesn’t. You get numbers you can actually check, not vanity metrics.',
        'Digital marketing isn’t something you set up once. It needs regular attention: monthly strategy calls, performance reports you can actually read, and clear next steps. Launching a product, entering a new market, running a seasonal offer, or just keeping a steady flow of leads coming in, we adjust the plan as your business changes.',
      ],
    },
    cta: {
      title: 'Every dollar you spend should bring back more',
      copy: 'Ad spend without a strategy is just noise. We build campaigns you can trace directly to bookings and revenue.',
    },
  },

  {
    slug: 'free-audit',
    nav: 'Free Website Audit',
    name: 'Free Website Performance Audit',
    subhead: 'See what your website is costing you',
    metaTitle: 'Free Website Performance Audit | Wavefront Studio',
    metaDescription: 'A free audit of your website’s mobile usability, technical health, search visibility and enquiry path, with a clear list of what to fix first.',
    hero: {
      alt: 'Wavefront Studio video about the free website audit',
      video: '/videos/free-audit-ad.mp4',
      poster: '/videos/free-audit-poster.webp',
    },
    primaryCta: { label: 'Get my free audit', href: '#service-form' },
    // The Meta ads send people here. Meta's report for 12–17 Sept showed the
    // ads performing normally but 1 lead from 61 visits, so this page leads
    // with the form: headline, form, then the video, which only loads when
    // someone presses play.
    landing: true,
    landingNote: 'Free, with no obligation to hire us.',
    form: {
      heading: 'Request your free website audit.',
      copy: 'Share your website address and we’ll review the issues most likely to be costing you visibility and enquiries.',
      websiteField: true,
      essentialOnly: true,
      submitLabel: 'Get my free audit',
    },
    approach: {
      title: 'What is a free website performance audit?',
      paragraphs: [
        'A free website performance audit is a practical review of how your site works on mobile, how easily search engines can read it, and how clearly visitors can turn into enquiries. We flag the biggest problems, explain them in plain English, and prioritise the fixes worth doing first.',
        'We look at the same experience your customers and search engines see: loading behaviour, mobile layout, technical signals, local visibility, calls to action, contact paths, and what happens when somebody visits outside business hours. The goal is a useful starting point, not a wall of automated warnings without context.',
      ],
    },
    featuresHeading: {
      title: 'What does the free website audit check?',
      copy: 'The review focuses on the issues that affect whether people can find your site, use it, and contact you.',
    },
    features: [
      'Mobile usability and responsive layout checks',
      'Page speed and visible performance issues',
      'Technical SEO, indexing, and page structure review',
      'Local search and Google visibility signals',
      'Calls to action, forms, and enquiry-path friction',
      'Broken links, security warnings, and dead pages',
      'Competitor and search-result context where relevant',
      'Prioritised recommendations written in plain English',
    ],
    deliver: {
      title: 'A clear list of what to fix first',
      paragraphs: [
        'You receive a focused review of what is working, what is creating friction, and which changes deserve attention first. Recommendations are ranked by likely business impact so you can separate meaningful improvements from low-priority polish.',
        'There is no obligation to hire Wavefront after the audit. You can use the findings yourself, hand them to your current team, or ask us to scope the work. If a deeper technical test or access to private analytics is needed, we will explain that clearly before recommending it.',
      ],
    },
    faqs: [
      ['Is the website audit really free?', 'Yes. The initial website performance audit is free and does not require a card or a service commitment. It is designed to show you the strongest opportunities before you decide whether to make changes yourself or ask Wavefront to help.'],
      ['What does the free audit cover?', 'It covers visible mobile usability, performance, technical SEO, search visibility, calls to action, forms, and the path from a landing page to an enquiry. Deeper analytics or private-system reviews require your permission and access.'],
      ['How do I request an audit?', 'Submit your name, email, and website URL through the form on this page. Add any specific concern in the message, such as slow pages, poor rankings, or forms that are not converting.'],
      ['Can I use the recommendations myself?', 'Yes. The recommendations are written to be useful whether you handle them internally, share them with another provider, or ask Wavefront Studio to implement them.'],
      ['What if I do not have a website yet?', 'Tell us what online presence you currently use, such as a Google Business Profile or social page. We can review the current path from search or social to contact, and explain what a dedicated website would change.'],
    ],
    faqHeading: 'Questions about the free website audit.',
    cta: {
      title: 'Find the leaks before buying more traffic',
      copy: 'Start with a clear view of what is helping, what is getting in the way, and which fixes matter most.',
    },
  },

  {
    slug: 'lead-capture',
    nav: 'Lead Capture',
    name: 'Lead Capture Systems',
    subhead: 'Capture, qualify and route enquiries while interest is high',
    metaTitle: 'Lead Capture Systems & Automation | Wavefront Studio',
    metaDescription: 'Lead capture systems that collect enquiries from your website and other channels, qualify each one, create clean CRM records and alert the right person.',
    hero: {
      alt: 'Wavefront Studio video about lead capture',
      video: '/videos/lead-capture-ad.mp4',
      poster: '/videos/lead-capture-poster.webp',
    },
    primaryCta: { label: 'Plan my lead system', href: '#service-form' },
    form: {
      heading: 'Tell us where leads go cold.',
      copy: 'We’ll map how enquiries arrive, who should receive them, and what needs to happen next.',
      websiteField: true,
      submitLabel: 'Request a Lead Review',
    },
    approach: {
      title: 'What is an automated lead capture system?',
      paragraphs: [
        'An automated lead capture system collects enquiries from your website and other approved channels, asks the right qualifying questions, creates a structured CRM record, and alerts or assigns the right person. It keeps opportunities organised and moving when staff are busy, off-site, or outside normal business hours.',
        'Wavefront builds the flow around your real sales process: service type, location, availability, urgency, budget, scheduling, and ownership rules. Each step has a clear fallback, and sensitive or complex enquiries can be handed to a person with the useful context already assembled.',
      ],
      image: {
        image: '/images/work/resinrockleads-site.webp',
        alt: 'The Resin Rock Leads homepage, offering verified leads to installers',
        caption: 'Resin Rock Leads, where enquiries from several sites are routed to the nearest installer.',
      },
    },
    featuresHeading: {
      title: 'What can a lead capture system automate?',
      copy: 'Every system is scoped to the channels, qualification rules, and handoffs your team actually uses.',
    },
    features: [
      'Website forms, landing pages, and chatbot entry points',
      'Business-specific qualification questions',
      'Immediate email, SMS, or in-app alerts',
      'CRM record creation with clean, consistent fields',
      'Routing by service, geography, availability, or owner',
      'Appointment and consultation booking paths',
      'Consent capture and submission-source tracking',
      'Fallbacks, human handoff, and delivery monitoring',
    ],
    deliver: {
      title: 'Complete opportunities reaching the right person faster',
      paragraphs: [
        'The finished system connects the customer-facing form or conversation to the tools your team uses behind the scenes. Instead of copying details between inboxes and spreadsheets, staff receive a consistent record with the contact information, request, source, consent, and next action already attached.',
        'Lead capture improves response and organisation, but it does not guarantee lead volume or sales. We measure the parts the system can control (successful submissions, routing, delivery time, completion and handoff quality), then refine the flow as real enquiries show where people hesitate or drop out.',
      ],
    },
    faqs: [
      ['What channels can feed the lead capture system?', 'A system can accept enquiries from website forms, landing pages, chatbots, email, text, social entry points, and other approved sources when those platforms support a secure integration.'],
      ['Can leads be assigned automatically?', 'Yes. Routing rules can use service type, location, availability, urgency, or a named owner. Each lead can also trigger an alert and create a task or CRM record for follow-up.'],
      ['Will it work with our current CRM?', 'Often, yes. We first review the CRM, its API or supported integrations, required fields, ownership rules, and security model. If a direct connection is not appropriate, we recommend a controlled alternative.'],
      ['Does AI replace our sales team?', 'No. AI can collect approved information, answer bounded questions, and prepare a handoff. Your team keeps control of judgement, pricing exceptions, sensitive conversations, and the final sales relationship.'],
      ['Does lead capture guarantee more leads?', 'No. The system helps prevent existing demand from being lost through slow response, incomplete information, or poor routing. Lead volume still depends on your traffic, offer, market, and marketing activity.'],
      ['How is consent recorded?', 'When a form includes an opt-in, the system can store the consent value, timestamp, source URL, and related submission details. Exact requirements depend on the communication channel and your legal obligations.'],
    ],
    faqHeading: 'Questions about lead capture automation.',
    cta: {
      title: 'Stop letting good enquiries disappear between systems',
      copy: 'Build one clear path from first contact to the person responsible for the next step.',
    },
  },
]

export const serviceBySlug = Object.fromEntries(services.map((service) => [service.slug, service]))
