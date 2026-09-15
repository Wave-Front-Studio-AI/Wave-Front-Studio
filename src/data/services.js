// The core "Our Services" pages. The original six preserve the matching live-site
// copy; the audit and lead-capture offers are grounded in Wavefront's AI-site copy.

export const services = [
  {
    slug: 'web-development',
    nav: 'Web Development',
    name: 'Website Development',
    subhead: 'Fast, Responsive & Built to Convert',
    metaTitle: 'Custom Website Development Services | Wavefront Studio',
    metaDescription: 'We design and build websites that load fast and bring in enquiries: business sites, online stores, SaaS platforms, landing pages and multi-site setups.',
    hero: {
      image: '/images/creative-digital-development-agency-brainstorming-about-mobile-app-interface-wireframe-design-on.webp',
      alt: 'Digital development agency team brainstorming mobile app interface wireframe design',
      video: '/videos/web-development-ad.mp4',
      poster: '/videos/web-development-poster.webp',
    },
    approach: {
      title: 'Web Development - The Wavefront Way',
      paragraphs: [
        'We design and develop every type of website your business needs - from B2B corporate sites and e-commerce stores to personal portfolios, SaaS platforms, landing pages, and multi-site ecosystems. Whether you’re a startup launching online for the first time or an established brand like ResinRock managing 12+ interconnected websites - we build every project from scratch with performance, SEO, and conversions at the core.',
        'Our team works with WordPress, Shopify, WooCommerce, custom HTML/CSS, and modern JavaScript frameworks to deliver websites that load fast, rank higher on Google, and work flawlessly across all devices. You stay involved at every stage - from strategy and wireframes to design, development, and final launch - so the end result is exactly what your business needs to grow.',
      ],
      image: {
        image: '/images/professional-woman-photo-retoucher-working-with-digital-assets.webp',
        alt: 'Professional photo retoucher working with digital assets on a multi-monitor setup',
      },
    },
    features: [
      'Fully custom responsive design for all devices',
      'SEO-optimized structure and clean code',
      'E-commerce and online store development',
      'Multi-site and multi-page ecosystems',
      'Custom calculators and interactive tools',
      'Fast loading speed and performance optimization',
      'CMS integration for easy content management',
      'Ongoing maintenance and technical support',
    ],
    deliver: {
      title: 'What We Deliver',
      paragraphs: [
        'Every website we build is engineered for results - not just aesthetics. We structure your site architecture for maximum SEO performance, integrate lead capture forms and call-to-action elements in the right places, and optimize every page for speed and mobile responsiveness. Whether your customers find you through Google, social media, or paid ads - your website will be ready to convert them the moment they land.',
        'We don’t disappear after launch either. From ongoing maintenance, security updates, and performance monitoring to content updates and new feature additions - we stay with you as your business grows. Need to add a new product line, expand to a new market, or integrate a custom tool like a calculator or chatbot? We scale your website alongside your business - so it never falls behind.',
      ],
      image: '/images/hard-at-work-on-their-latest-designs.webp',
      alt: 'hard at work on their latest designs',
    },
    cta: {
      title: 'Your Website Should Work as Hard as You Do',
      copy: 'A great website isn’t a cost – it’s your most powerful sales tool. Let’s build one that brings real results to your business.',
    },
  },

  {
    slug: 'seo-service',
    nav: 'Website SEO',
    name: 'Search Engine Optimisation',
    subhead: 'Rank Higher, Get Found, Grow Organically',
    metaTitle: 'SEO Services – Rank Higher on Google | Wavefront Studio',
    metaDescription: 'We build SEO strategies to get you onto Google’s first page and keep you there, with keyword research, technical audits, on-page fixes and link building.',
    hero: {
      image: '/images/Banner.webp',
      alt: 'Digital interfaces used for search optimisation planning',
      video: '/videos/seo-google-presence-ad.mp4',
      poster: '/videos/seo-google-presence-poster.webp',
      hubImage: '/images/creative-digital-editor-editing-movie-footage.webp',
      hubAlt: 'Digital specialist reviewing creative content for search optimisation',
    },
    approach: {
      title: 'How We Get You to Page One',
      paragraphs: [
        'We don’t just optimize your website - we build a complete SEO strategy designed to get your business on the first page of Google and keep it there. From in-depth keyword research and competitor analysis to technical audits, on-page optimization, and high-quality link building - every action we take is focused on driving organic traffic that converts into real customers.',
        'Our SEO strategies are built on data, not guesswork. We analyze what your target audience is actually searching for, identify the gaps in your current rankings, and create a step-by-step plan to close them. Whether you’re a local business trying to dominate Google Maps or a national brand competing for high-volume keywords - we tailor every strategy to your specific market and goals.',
      ],
      image: {
        image: '/images/creative-digital-editor-editing-movie-footage.webp',
        alt: 'creative digital editor editing movie footage',
      },
    },
    features: [
      'Comprehensive technical SEO audits',
      'Keyword research and competitor analysis',
      'On-page optimization and meta tag strategy',
      'High-quality backlink building',
      'Local SEO and Google Business optimization',
      'Page speed and Core Web Vitals improvement',
      'Monthly reporting and keyword tracking',
      'Content strategy and blog optimization',
    ],
    deliver: {
      title: 'What We Deliver',
      paragraphs: [
        'Technical SEO is where most agencies cut corners - but not us. We dive deep into your site’s structure, fixing crawl errors, improving page speed, optimizing mobile performance, cleaning up broken links, and ensuring Google can index every important page properly. A beautiful website means nothing if search engines can’t find it - and we make sure they always do.',
        'SEO is not a one-time project - it’s an ongoing growth engine. We provide monthly reporting, keyword tracking, content recommendations, and continuous optimization to make sure your rankings keep climbing. Our work with brands like ResinRock - taking them from low visibility to the first page of Google for competitive industry terms - proves that a solid SEO strategy delivers long-term, compounding results.',
      ],
      image: '/images/professional-agency-workers-designing-industrial-prototype-on-creative-software.webp',
      alt: 'professional agency workers designing industrial prototype on creative software',
    },
    plans: {
      eyebrow: 'Choose Your Plan',
      title: 'SEO Plans That Actually Get You Ranked',
      copy: 'Whether your site just needs a technical cleanup or a complete rebuild with ongoing management - we have a plan built for where you are right now.',
      footnote: 'Not sure which plan is right for you? Book a free consultation and we’ll audit your site and recommend exactly what you need - no commitment.',
      items: [
        {
          name: 'SEO Audit & Fix',
          billing: 'One-Time',
          copy: 'For websites that already have clear pages and content but aren’t showing up on Google. We fix what’s broken so search engines can find you.',
          bestFor: 'Businesses with an existing website that has good content but poor or no Google visibility.',
          included: [
            'Full technical SEO audit of your entire site',
            'Meta titles & descriptions optimized for every page',
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
          name: 'Full SEO Rebuild',
          billing: 'One-Time',
          copy: 'For websites that need a complete overhaul - new structure, new content, new URLs. We rebuild your entire site from the ground up with SEO at the core.',
          bestFor: 'Businesses with an outdated or poorly structured website that needs a fresh start to rank on Google.',
          included: [
            'Everything in SEO Audit & Fix',
            'Complete website redesign with SEO-first structure',
            'In-depth keyword research & competitor analysis',
            'SEO-rich content written for every page',
            'URL restructuring & old URL redirects (301s)',
            'Clean, optimized page speed & mobile responsiveness',
            'Schema markup & structured data implementation',
          ],
          excluded: [
            'Monthly management or ongoing optimization',
            'Blog writing or backlink building',
            'Daily monitoring or issue resolution',
          ],
        },
        {
          name: 'Monthly SEO',
          billing: 'Monthly',
          popular: true,
          copy: 'For businesses that want to consistently rank on Google’s first page. We manage everything - content, backlinks, technical health, and performance - every single month.',
          bestFor: 'Businesses ready to invest in long-term growth and dominate their market on Google search results.',
          included: [
            'Everything in SEO Audit & Fix',
            'Weekly blog posts with targeted keywords',
            'Backlink building & outreach campaigns',
            'Daily site monitoring & issue resolution',
            'Google algorithm updates & adaptation',
            'New content creation & page optimization',
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
      title: 'Your Customers Are Searching - Make Sure They Find You',
      copy: 'SEO is the highest-ROI marketing channel there is. Let’s get your business ranking where it matters – on page one.',
    },
  },

  {
    slug: 'mobile-app-development',
    nav: 'Mobile App',
    name: 'Mobile App Development',
    subhead: 'Custom Apps Built to Scale Your Business',
    metaTitle: 'Custom Mobile App Development | Wavefront Studio LLC',
    metaDescription: 'We design and develop custom mobile applications for iOS and Android that are fast, intuitive, and built to solve real business problems.',
    hero: {
      image: '/images/meeting-woman-and-man-with-tablet-happy-conversation-at-creative-marketing-agency-office-coachin.webp',
      alt: 'meeting woman and man with tablet happy conversation at creative marketing agency office',
    },
    approach: {
      title: 'Why Businesses Trust Us With Their Apps',
      paragraphs: [
        'We design and develop custom mobile applications for iOS and Android that are fast, intuitive, and built to solve real business problems. Whether you need a customer-facing app, an internal operations tool, a delivery tracking system, or an MVP for your startup - we build every app from the ground up, tailored to your exact requirements and ready to scale as your business grows.',
        'Our development process covers everything from initial concept and UX wireframing to full design, coding, testing, and app store submission. We work with React Native, Flutter, and native development to choose the best approach for your project - whether that means a cross-platform app to save time and budget or a fully native experience for maximum performance.',
      ],
      image: {
        image: '/images/woman-in-a-travel-agency-booking-a-trip-looking-at-the-covid-passport.webp',
        alt: 'woman in a travel agency booking a trip looking at the covid passport',
      },
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
      title: 'What We Deliver',
      paragraphs: [
        'Every app we build is designed around the user experience first. We obsess over smooth navigation, fast load times, clean interfaces, and intuitive workflows - because an app people don’t enjoy using is an app people uninstall. From onboarding screens and push notifications to in-app payments and real-time data syncing - every feature is tested and polished before it reaches your customers.',
        'Launch is just the beginning. We provide ongoing support including bug fixes, performance monitoring, feature updates, and OS compatibility checks to make sure your app stays fast, secure, and up to date. Whether you need to add new functionality, integrate third-party APIs, or expand to a new platform - we’re your long-term development partner, not a one-time vendor.',
      ],
      image: '/images/business-portrait-women-in-office-and-tablet-planning-in-digital-marketing-agency-social-media-ma-1.webp',
      alt: 'business portrait women in office and tablet planning in digital marketing agency',
    },
    cta: {
      title: 'Your Next Big Idea Deserves a World-Class App',
      copy: 'From concept to launch and beyond – we build mobile apps that your customers will love and your business will rely on.',
    },
  },

  {
    slug: 'social-media-strategy',
    nav: 'Social Media',
    name: 'Social Media Strategy',
    subhead: 'Grow Your Audience, Build Your Brand, Drive Sales',
    metaTitle: 'Social Media Management & Strategy | Wavefront Studio',
    metaDescription: 'We build and manage complete social media strategies that grow your audience, build real engagement, and turn followers into paying customers.',
    hero: { image: '/images/Social-MEDIA-2.webp', alt: 'Social media content and campaign planning for business growth' },
    approach: {
      title: 'How We Grow Brands on Social Media',
      paragraphs: [
        'We build and manage complete social media strategies that do more than just post content - they grow your audience, build real engagement, and turn followers into paying customers. From Instagram and Facebook to TikTok, LinkedIn, and YouTube - we create platform-specific strategies tailored to where your audience actually spends their time and what makes them take action.',
        'Our process starts with understanding your brand, your competitors, and your target audience. We then develop a content calendar, define your brand voice, plan campaigns, and create scroll-stopping visuals and copy that align with your business goals. Whether you want more brand awareness, more leads, or more direct sales from social media - every post, reel, and story we create is built with that objective in mind.',
      ],
      image: { image: '/images/Team-1-1-1.webp', alt: 'Wavefront Studio social media team' },
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
      title: 'Managing Brands. Delivering Results.',
      paragraphs: [
        'Our dedicated team currently manages social media for 15+ companies - producing content, running campaigns, and driving engagement that collectively exceeds millions of monthly views across all platforms. These aren’t vanity numbers - every client receives detailed monthly analytics reports showing exactly what’s working, what’s growing, and where we’re taking their brand next.',
        'We don’t just post and pray - we currently manage social media for over 15 businesses across multiple industries, generating millions of combined monthly views with strategies built around real data and consistent execution. From content creation and scheduling to community management, paid campaigns, and influencer outreach - we handle everything so you can focus on running your business while your brand grows every single day.',
      ],
      features: [
        'Monthly analytics reports with full performance breakdowns',
        'Proven track record managing 15+ brands simultaneously',
      ],
      image: '/images/SMM-scaled.webp',
      alt: 'Social media management dashboard',
    },
    deliver: {
      title: 'What We Deliver',
      paragraphs: [
        'We don’t just post and hope for the best. Our team actively monitors performance, tracks engagement metrics, and adjusts strategy based on what’s actually working. From organic content and hashtag strategies to paid promotions and influencer collaborations - we combine creativity with data to make sure your social media presence keeps growing month after month, not just staying flat.',
        'Managing social media takes time that most business owners don’t have - and that’s exactly why we exist. We handle everything from content creation and scheduling to community management, comment responses, and DM handling. You focus on running your business while we make sure your brand stays active, visible, and engaging across every platform - consistently and professionally.',
      ],
      image: '/images/social-media-revolution.webp',
      alt: 'social media revolution',
    },
    cta: {
      title: 'Your Audience Is Scrolling - Make Them Stop for You',
      copy: 'Social media isn’t optional anymore – it’s where your customers discover, trust, and choose brands. Let’s make yours impossible to ignore.',
    },
  },

  {
    slug: 'graphic-design',
    nav: 'Graphic Design',
    name: 'Graphic Design',
    subhead: 'Bold Visuals That Make Your Brand Unforgettable',
    metaTitle: 'Professional Graphic Design Services | Wavefront Studio',
    metaDescription: 'We create visual identities that communicate who you are, what you stand for, and why customers should choose you.',
    hero: {
      image: '/images/Banner.webp',
      alt: 'Creative graphic design presentation',
      hubImage: '/images/professional-agency-workers-designing-industrial-prototype-on-creative-software.webp',
      hubAlt: 'Graphic design team developing a visual concept in creative software',
    },
    approach: {
      title: 'What Makes Our Designs Different',
      paragraphs: [
        'We create visual identities that don’t just look good - they communicate who you are, what you stand for, and why customers should choose you. From custom logos and complete brand kits to social media graphics, packaging, print materials, and ad creatives - every design we produce is crafted to make your brand instantly recognizable and impossible to forget across every platform and touchpoint.',
        'Our designers take the time to understand your business, your audience, and your competition before creating anything. We study your industry, analyze what works in your market, and then design visuals that set you apart - not blend you in. Whether you’re building a brand from zero or refreshing an outdated identity - we deliver designs that feel premium, professional, and uniquely yours.',
      ],
      image: {
        image: '/images/professional-agency-workers-designing-industrial-prototype-on-creative-software.webp',
        alt: 'professional agency workers designing industrial prototype on creative software',
      },
    },
    features: [
      'Custom logo design and full brand identity',
      'Social media graphics and reusable templates',
      'Business cards, flyers, brochures, and menus',
      'Packaging, labels, and product design',
      'Website banners, ad creatives, and email headers',
      'Brand guidelines and style documentation',
      'Print-ready and digital-ready file delivery',
      'Unlimited revisions until you’re 100% satisfied',
    ],
    deliver: {
      title: 'What We Deliver',
      paragraphs: [
        'Consistency is what separates amateur brands from professional ones. We don’t just hand you a logo and walk away - we create a complete brand system including color palettes, typography, iconography, templates, and detailed style guidelines that ensure every piece of content your business puts out looks cohesive and polished, whether it’s a social media post, a business card, a website banner, or a billboard.',
        'We design for every medium your business needs - digital and print. Need social media templates your team can reuse every week? Done. Need packaging that stands out on shelves? We’ve got you. Brochures, flyers, trade show banners, vehicle wraps, email headers, pitch decks - if it needs to look great and represent your brand, we design it, deliver print-ready files, and make sure it’s perfect down to the last pixel.',
      ],
      image: '/images/Graphic-Design1.avif',
      alt: 'Graphic design work by Wavefront Studio',
    },
    cta: {
      title: 'Your Brand’s First Impression Happens in Seconds - Make It Count',
      copy: 'Great design isn’t decoration – it’s your business speaking before you say a word. Let’s create visuals that make people remember you.',
    },
  },

  {
    slug: 'digital-marketing',
    nav: 'Digital Marketing',
    name: 'Digital Marketing',
    subhead: 'Data-Driven Strategies That Generate Real Results',
    metaTitle: 'Digital Marketing Services | Wavefront Studio LLC',
    metaDescription: 'Google Ads, paid social, email and funnels, planned from your data and adjusted as results come in, so you can see which spend brings in customers.',
    hero: { image: '/images/Digital-Marketing3.webp', alt: 'Digital marketing campaign strategy and performance analysis' },
    approach: {
      title: 'How We Drive Growth for Your Business',
      paragraphs: [
        'We don’t run ads and hope for the best - we build complete digital marketing strategies rooted in data, targeting, and continuous optimization. From Google Ads and paid social campaigns to email marketing, funnel building, and retargeting - every campaign we launch is designed with one goal in mind: bringing you more qualified leads and turning them into paying customers at the lowest possible cost.',
        'Our process begins with understanding your business, your audience, and your competition. We research where your ideal customers spend their time online, what triggers them to take action, and how your competitors are reaching them. Then we build a custom marketing plan that puts your brand in front of the right people, with the right message, at the right time - across every channel that matters.',
      ],
      image: {
        image: '/images/creative-digital-editor-editing-movie-footage.webp',
        alt: 'creative digital editor editing movie footage',
      },
    },
    features: [
      'Google Ads search, display, and shopping campaigns',
      'Facebook, Instagram, and TikTok advertising',
      'Email marketing and automated drip sequences',
      'Sales funnel design and conversion optimization',
      'Landing page creation and A/B testing',
      'Audience targeting, retargeting, and lookalike campaigns',
      'Detailed analytics, tracking, and ROI reporting',
      'Monthly strategy reviews and ongoing optimization',
    ],
    deliver: {
      title: 'What We Deliver',
      paragraphs: [
        'We treat your marketing budget like our own money - every dollar has a job. Our team sets up detailed tracking and attribution so you can see exactly which campaigns are driving calls, form submissions, purchases, and revenue. We run continuous A/B tests on ad copy, creatives, audiences, and landing pages to find what converts best - then scale the winners and cut the losers. No wasted spend, no vanity metrics - just real business growth you can measure.',
        'Digital marketing isn’t a one-time setup - it’s an ongoing engine that needs constant fuel and fine-tuning. We provide monthly strategy calls, transparent performance reports, and clear recommendations on what to do next. Whether you need to launch a new product, enter a new market, promote a seasonal offer, or simply keep a steady flow of leads coming in - we adapt your strategy as your business evolves and make sure your marketing never falls behind your ambition.',
      ],
      image: '/images/Digital-Marketing4.webp',
      alt: 'Digital marketing team at work',
    },
    cta: {
      title: 'Every Dollar You Spend Should Bring Back More',
      copy: 'without a strategy is just noise. Let’s build a system that consistently turns your ad spend into real revenue and measurable growth.',
    },
  },

  {
    slug: 'free-audit',
    nav: 'Free Website Audit',
    name: 'Free Website Performance Audit',
    subhead: 'See What Your Website Is Costing You',
    metaTitle: 'Free Website Performance Audit | Wavefront Studio',
    metaDescription: 'A free audit of your website’s mobile usability, technical health, search visibility and enquiry path, with a clear list of what to fix first.',
    hero: {
      image: '/images/screen.webp',
      alt: 'Website performance review for a free Wavefront Studio audit',
      video: '/videos/free-audit-ad.mp4',
      poster: '/videos/free-audit-poster.webp',
    },
    primaryCta: { label: 'Get My Free Audit', href: '#service-form' },
    form: {
      heading: 'Request your free website audit.',
      copy: 'Share your website address and we’ll review the issues most likely to be costing you visibility and enquiries.',
      websiteField: true,
      submitLabel: 'Get My Free Audit',
    },
    approach: {
      title: 'What Is a Free Website Performance Audit?',
      paragraphs: [
        'A free website performance audit is a practical review of how your site works on mobile, how easily search engines can understand it, and how clearly visitors can become enquiries. Wavefront identifies the most important problems, explains them in plain English, and prioritizes the fixes worth doing first.',
        'We look at the same experience your customers and search engines see: loading behavior, mobile layout, technical signals, local visibility, calls to action, contact paths, and what happens when somebody visits outside business hours. The goal is a useful starting point, not a wall of automated warnings without context.',
      ],
      image: {
        image: '/images/professional-woman-photo-retoucher-working-with-digital-assets.webp',
        alt: 'Specialist reviewing website performance across multiple screens',
      },
    },
    featuresHeading: {
      eyebrow: 'Audit coverage',
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
      'Prioritized recommendations written in plain English',
    ],
    deliver: {
      title: 'A Clear List of What to Fix First',
      paragraphs: [
        'You receive a focused review of what is working, what is creating friction, and which changes deserve attention first. Recommendations are ranked by likely business impact so you can separate meaningful improvements from low-priority polish.',
        'There is no obligation to hire Wavefront after the audit. You can use the findings yourself, hand them to your current team, or ask us to scope the work. If a deeper technical test or access to private analytics is needed, we will explain that clearly before recommending it.',
      ],
      image: '/images/creative-digital-editor-editing-movie-footage.webp',
      alt: 'Digital specialist reviewing website content and performance on screen',
    },
    faqs: [
      ['Is the website audit really free?', 'Yes. The initial website performance audit is free and does not require a card or a service commitment. It is designed to show you the strongest opportunities before you decide whether to make changes yourself or ask Wavefront to help.'],
      ['What does the free audit cover?', 'It covers visible mobile usability, performance, technical SEO, search visibility, calls to action, forms, and the path from a landing page to an enquiry. Deeper analytics or private-system reviews require your permission and access.'],
      ['How do I request an audit?', 'Submit your name, email, and website URL through the form on this page. Add any specific concern in the message, such as slow pages, poor rankings, or forms that are not converting.'],
      ['Can I use the recommendations myself?', 'Yes. The recommendations are written to be useful whether you handle them internally, share them with another provider, or ask Wavefront Studio to implement them.'],
      ['What if I do not have a website yet?', 'Tell us what online presence you currently use, such as a Google Business Profile or social page. We can review the available customer journey and explain what a dedicated website would change.'],
    ],
    faqHeading: 'Questions about the free website audit.',
    cta: {
      title: 'Find the Leaks Before Buying More Traffic',
      copy: 'Start with a clear view of what is helping, what is getting in the way, and which fixes matter most.',
    },
  },

  {
    slug: 'lead-capture',
    nav: 'Lead Capture',
    name: 'Lead Capture Systems',
    subhead: 'Capture, Qualify & Route Enquiries While Interest Is High',
    metaTitle: 'Lead Capture Systems & Automation | Wavefront Studio',
    metaDescription: 'Lead capture systems that collect enquiries from your website and other channels, qualify each one, create clean CRM records and alert the right person.',
    hero: {
      image: '/images/digital-marketing-wavefront-studios.webp',
      alt: 'Wavefront Studio digital marketing and lead capture workflow',
      video: '/videos/lead-capture-ad.mp4',
      poster: '/videos/lead-capture-poster.webp',
    },
    primaryCta: { label: 'Plan My Lead System', href: '#service-form' },
    form: {
      heading: 'Tell us where leads go cold.',
      copy: 'We’ll map how enquiries arrive, who should receive them, and what needs to happen next.',
      websiteField: true,
      submitLabel: 'Request a Lead Review',
    },
    approach: {
      title: 'What Is an Automated Lead Capture System?',
      paragraphs: [
        'An automated lead capture system collects enquiries from your website and other approved channels, asks the right qualifying questions, creates a structured CRM record, and alerts or assigns the right person. It keeps opportunities organized and moving when staff are busy, off-site, or outside normal business hours.',
        'Wavefront builds the flow around your real sales process: service type, location, availability, urgency, budget, scheduling, and ownership rules. Each step has a clear fallback, and sensitive or complex enquiries can be handed to a person with the useful context already assembled.',
      ],
      image: {
        image: '/images/architect-holding-digital-tablet-with-building-model.webp',
        alt: 'Business specialist reviewing a new enquiry on a digital tablet',
      },
    },
    featuresHeading: {
      eyebrow: 'System capabilities',
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
      title: 'Complete Opportunities Reaching the Right Person Faster',
      paragraphs: [
        'The finished system connects the customer-facing form or conversation to the tools your team uses behind the scenes. Instead of copying details between inboxes and spreadsheets, staff receive a consistent record with the contact information, request, source, consent, and next action already attached.',
        'Lead capture improves response and organization, but it does not guarantee lead volume or sales. We measure the parts the system can control—successful submissions, routing, delivery time, completion, and handoff quality—then refine the flow as real enquiries reveal where people hesitate or drop out.',
      ],
      image: '/images/business-people-using-a-digital-tablet.webp',
      alt: 'Business team reviewing organized lead information on a tablet',
    },
    faqs: [
      ['What channels can feed the lead capture system?', 'A system can accept enquiries from website forms, landing pages, chatbots, email, text, social entry points, and other approved sources when those platforms support a secure integration.'],
      ['Can leads be assigned automatically?', 'Yes. Routing rules can use service type, location, availability, urgency, or a named owner. Each lead can also trigger an alert and create a task or CRM record for follow-up.'],
      ['Will it work with our current CRM?', 'Often, yes. We first review the CRM, its API or supported integrations, required fields, ownership rules, and security model. If a direct connection is not appropriate, we recommend a controlled alternative.'],
      ['Does AI replace our sales team?', 'No. AI can collect approved information, answer bounded questions, and prepare a handoff. Your team keeps control of judgment, pricing exceptions, sensitive conversations, and the final sales relationship.'],
      ['Does lead capture guarantee more leads?', 'No. The system helps prevent existing demand from being lost through slow response, incomplete information, or poor routing. Lead volume still depends on your traffic, offer, market, and marketing activity.'],
      ['How is consent recorded?', 'When a form includes an opt-in, the system can store the consent value, timestamp, source URL, and related submission details. Exact requirements depend on the communication channel and your legal obligations.'],
    ],
    faqHeading: 'Questions about lead capture automation.',
    cta: {
      title: 'Stop Letting Good Enquiries Disappear Between Systems',
      copy: 'Build one clear path from first contact to the person responsible for the next step.',
    },
  },
]

export const serviceBySlug = Object.fromEntries(services.map((service) => [service.slug, service]))
