// Generated from the Build Your Package configurator on wavefrontstudiollc.com.
const LANDING_PAGE_PRICES = { Launch: 100, Grow: 500, Scale: 1500 }

// Each bundle sets the total page count; its cost is added to the chosen tier.
export const LANDING_PAGE_BUNDLES = [
  { pages: 1, price: 0 },
  { pages: 10, price: 250 },
  { pages: 25, price: 500 },
  { pages: 75, price: 1000 },
  { pages: 125, price: 1500 },
  { pages: 300, price: 3000 },
]

export const OFFER = {
  "countdownHours": 72,
  "firstMonthsFree": 1,
  "bundleTiers": [
    {
      "min": 5,
      "pct": 15
    },
    {
      "min": 3,
      "pct": 10
    },
    {
      "min": 2,
      "pct": 5
    }
  ],
  "contactEmail": "info@wavefrontstudiollc.com"
}

export const SERVICES = [
  {
    "id": "web",
    "name": "Website Development",
    "blurb": "Fast, responsive, SEO-ready sites built to convert.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 1800,
        "m": 0,
        "note": "Starter site"
      },
      {
        "n": "Grow",
        "s": 4500,
        "m": 0,
        "note": "Semi-custom"
      },
      {
        "n": "Scale",
        "s": 9500,
        "m": 0,
        "note": "Custom / e-com"
      }
    ],
    "addons": [
      {
        "l": "Extra page",
        "p": 150,
        "t": "onetime"
      },
      {
        "l": "E-commerce setup",
        "p": 750,
        "t": "onetime"
      },
      {
        "l": "Copywriting (per page)",
        "p": 120,
        "t": "onetime"
      },
      {
        "l": "Website care plan",
        "p": 99,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "landing",
    "name": "Landing Pages",
    "blurb": "Choose a tier and page bundle, or enter your own scope and pricing with Custom. Grow and Scale include high-intent SEO. Scale adds custom design and conversion tracking.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": LANDING_PAGE_PRICES.Launch,
        "m": 0,
        "note": "Landing page build"
      },
      {
        "n": "Grow",
        "s": LANDING_PAGE_PRICES.Grow,
        "m": 0,
        "note": "High-intent SEO + conversion copy"
      },
      {
        "n": "Scale",
        "s": LANDING_PAGE_PRICES.Scale,
        "m": 0,
        "note": "SEO + custom design + conversion tracking"
      },
      {
        "n": "Custom",
        "custom": true,
        "s": 0,
        "m": 0,
        "note": "Unique builds with your own scope & pricing"
      }
    ],
    "addons": []
  },
  {
    "id": "seo",
    "name": "Website SEO",
    "blurb": "Rank higher on Google — technical, content & local SEO.",
    "billing": "monthly",
    "tiers": [
      {
        "n": "Launch",
        "s": 0,
        "m": 500,
        "note": "Local & foundational"
      },
      {
        "n": "Grow",
        "s": 0,
        "m": 850,
        "note": "Growth SEO"
      },
      {
        "n": "Scale",
        "s": 0,
        "m": 1400,
        "note": "Aggressive"
      }
    ],
    "addons": [
      {
        "l": "Extra 25 keywords",
        "p": 150,
        "t": "monthly"
      },
      {
        "l": "Blog article",
        "p": 75,
        "t": "monthly",
        "opts": [
          {
            "l": "Daily (Mon–Fri)",
            "q": 20
          },
          {
            "l": "3 per week",
            "q": 12
          },
          {
            "l": "Every other day",
            "q": 10
          },
          {
            "l": "2 per week",
            "q": 8
          },
          {
            "l": "Weekly",
            "q": 4
          },
          {
            "l": "Bi-weekly",
            "q": 2
          },
          {
            "l": "Monthly",
            "q": 1,
            "def": 1
          }
        ]
      },
      {
        "l": "One-time technical audit",
        "p": 500,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "app",
    "name": "Mobile App Development",
    "blurb": "Custom iOS & Android apps, from MVP to full build.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 8000,
        "m": 0,
        "note": "MVP, 1 platform"
      },
      {
        "n": "Grow",
        "s": 18000,
        "m": 0,
        "note": "iOS + Android"
      },
      {
        "n": "Scale",
        "s": 35000,
        "m": 0,
        "note": "Full custom"
      }
    ],
    "addons": [
      {
        "l": "Payment integration",
        "p": 1200,
        "t": "onetime"
      },
      {
        "l": "UX/UI design sprint",
        "p": 1500,
        "t": "onetime"
      },
      {
        "l": "Maintenance retainer",
        "p": 500,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "social",
    "name": "Social Media Management",
    "blurb": "Content, reels & community across your platforms.",
    "billing": "monthly",
    "tiers": [
      {
        "n": "Launch",
        "s": 0,
        "m": 650,
        "note": "Consistent presence"
      },
      {
        "n": "Grow",
        "s": 0,
        "m": 1200,
        "note": "Content + community"
      },
      {
        "n": "Scale",
        "s": 0,
        "m": 2200,
        "note": "Full-service"
      }
    ],
    "addons": [
      {
        "l": "Extra platform",
        "p": 250,
        "t": "monthly"
      },
      {
        "l": "Photo / video day",
        "p": 500,
        "t": "onetime"
      },
      {
        "l": "Paid ad management",
        "p": 300,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "design",
    "name": "Graphic Design & Branding",
    "blurb": "Logos, brand identity & print-ready collateral.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 600,
        "m": 0,
        "note": "Logo & basics"
      },
      {
        "n": "Grow",
        "s": 1800,
        "m": 0,
        "note": "Brand identity"
      },
      {
        "n": "Scale",
        "s": 4500,
        "m": 0,
        "note": "Full brand system"
      }
    ],
    "addons": [
      {
        "l": "Packaging / label design",
        "p": 400,
        "t": "onetime"
      },
      {
        "l": "Extra revision round",
        "p": 120,
        "t": "onetime"
      },
      {
        "l": "Design retainer (10 hrs)",
        "p": 600,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "mkt",
    "name": "Digital Marketing & Paid Ads",
    "blurb": "Paid ads, funnels & email that generate leads.",
    "billing": "monthly",
    "tiers": [
      {
        "n": "Launch",
        "s": 0,
        "m": 750,
        "note": "One channel"
      },
      {
        "n": "Grow",
        "s": 0,
        "m": 1500,
        "note": "Multi-channel"
      },
      {
        "n": "Scale",
        "s": 0,
        "m": 3000,
        "note": "Full funnel"
      }
    ],
    "addons": [
      {
        "l": "Additional ad channel",
        "p": 400,
        "t": "monthly"
      },
      {
        "l": "Landing page build (Launch)",
        "p": LANDING_PAGE_PRICES.Launch,
        "t": "onetime"
      },
      {
        "l": "Email automation setup",
        "p": 500,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "email",
    "name": "Email Marketing",
    "blurb": "Email campaigns with analytics, sent monthly or twice a week. Both plans have a $500 one-time setup fee.",
    "billing": "hybrid",
    "tiers": [
      {
        "n": "Monthly",
        "s": 500,
        "m": 250,
        "note": "1 email per month + analytics"
      },
      {
        "n": "Twice weekly",
        "s": 500,
        "m": 450,
        "note": "2 emails per week + analytics"
      }
    ],
    "addons": []
  },
  {
    "id": "bot",
    "name": "AI Chatbot Integration",
    "blurb": "24/7 chatbot that answers, qualifies & books.",
    "billing": "hybrid",
    "tiers": [
      {
        "n": "Launch",
        "s": 1500,
        "m": 99,
        "note": "FAQ bot"
      },
      {
        "n": "Grow",
        "s": 3500,
        "m": 199,
        "note": "AI-powered"
      },
      {
        "n": "Scale",
        "s": 7500,
        "m": 399,
        "note": "Custom AI"
      }
    ],
    "addons": [
      {
        "l": "Extra channel",
        "p": 500,
        "t": "onetime"
      },
      {
        "l": "Appointment booking module",
        "p": 400,
        "t": "onetime"
      },
      {
        "l": "Priority support",
        "p": 150,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "viz",
    "name": "Live Visualizer Tool",
    "blurb": "Let customers preview your products on their space.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 2500,
        "m": 0,
        "note": "Single-product"
      },
      {
        "n": "Grow",
        "s": 6000,
        "m": 0,
        "note": "Multi-product"
      },
      {
        "n": "Scale",
        "s": 12000,
        "m": 0,
        "note": "Advanced"
      }
    ],
    "addons": [
      {
        "l": "Ordering system integration",
        "p": 1200,
        "t": "onetime"
      },
      {
        "l": "Extra 25 materials",
        "p": 500,
        "t": "onetime"
      },
      {
        "l": "Hosting & maintenance",
        "p": 99,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "calc",
    "name": "Custom Calculators",
    "blurb": "Instant quoting & ordering tools for your site.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 1200,
        "m": 0,
        "note": "Single calc"
      },
      {
        "n": "Grow",
        "s": 3000,
        "m": 0,
        "note": "Quote generator"
      },
      {
        "n": "Scale",
        "s": 6500,
        "m": 0,
        "note": "Ordering system"
      }
    ],
    "addons": [
      {
        "l": "Payment integration",
        "p": 1200,
        "t": "onetime"
      },
      {
        "l": "Additional calculator",
        "p": 800,
        "t": "onetime"
      },
      {
        "l": "Hosting & maintenance",
        "p": 79,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "agent",
    "name": "AI Agents & Automation",
    "blurb": "Autonomous agents that run multi-step workflows 24/7.",
    "billing": "hybrid",
    "tiers": [
      {
        "n": "Launch",
        "s": 2500,
        "m": 299,
        "note": "Single-task"
      },
      {
        "n": "Grow",
        "s": 6000,
        "m": 650,
        "note": "Multi-workflow"
      },
      {
        "n": "Scale",
        "s": 15000,
        "m": 1500,
        "note": "Autonomous suite"
      }
    ],
    "addons": [
      {
        "l": "Extra workflow / automation",
        "p": 800,
        "t": "onetime"
      },
      {
        "l": "Additional integration",
        "p": 600,
        "t": "onetime"
      },
      {
        "l": "Priority support",
        "p": 200,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "lead",
    "name": "Custom Lead Generation System",
    "blurb": "Automated lead capture, routing & follow-up.",
    "billing": "hybrid",
    "tiers": [
      {
        "n": "Launch",
        "s": 2500,
        "m": 150,
        "note": "Single-source capture"
      },
      {
        "n": "Grow",
        "s": 6000,
        "m": 350,
        "note": "Auto-distribution"
      },
      {
        "n": "Scale",
        "s": 14000,
        "m": 750,
        "note": "Full lead engine"
      }
    ],
    "addons": [
      {
        "l": "Extra lead source / site",
        "p": 400,
        "t": "onetime"
      },
      {
        "l": "SMS notifications",
        "p": 300,
        "t": "onetime"
      },
      {
        "l": "CRM integration",
        "p": 600,
        "t": "onetime"
      },
      {
        "l": "Auto follow-up sequences",
        "p": 500,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "custom",
    "name": "Custom Development (Any Requirement)",
    "blurb": "Have a unique need? We build bespoke tools, apps, automations & integrations tailored to your business. Final scope & quote confirmed on a discovery call.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 2500,
        "m": 0,
        "note": "Single feature / tool"
      },
      {
        "n": "Grow",
        "s": 8000,
        "m": 0,
        "note": "Custom app / system"
      },
      {
        "n": "Scale",
        "s": 20000,
        "m": 0,
        "note": "Enterprise / bespoke"
      }
    ],
    "addons": [
      {
        "l": "Maintenance retainer",
        "p": 400,
        "t": "monthly"
      },
      {
        "l": "Additional integration",
        "p": 600,
        "t": "onetime"
      },
      {
        "l": "Extra feature module",
        "p": 800,
        "t": "onetime"
      },
      {
        "l": "Discovery & spec sprint",
        "p": 750,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "logoanim",
    "name": "3D & Animated Logos",
    "blurb": "Motion logo reveals and 3D animated stingers for intros, outros and social — bring your brand to life.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 350,
        "m": 0,
        "note": "2D logo reveal"
      },
      {
        "n": "Grow",
        "s": 900,
        "m": 0,
        "note": "Animated + social"
      },
      {
        "n": "Scale",
        "s": 2500,
        "m": 0,
        "note": "Full 3D + source"
      }
    ],
    "addons": [
      {
        "l": "Extra revision",
        "p": 75,
        "t": "onetime"
      },
      {
        "l": "Extra aspect ratio / version",
        "p": 150,
        "t": "onetime"
      },
      {
        "l": "Custom sound design",
        "p": 150,
        "t": "onetime"
      },
      {
        "l": "Source files (AE / C4D)",
        "p": 250,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "logo",
    "name": "Logo & Favicon Design",
    "blurb": "A focused logo + favicon package to launch or refresh your mark — clean, versatile and ready for web and print.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 250,
        "m": 0,
        "note": "Logo + favicon"
      },
      {
        "n": "Grow",
        "s": 600,
        "m": 0,
        "note": "Logo set + kit"
      },
      {
        "n": "Scale",
        "s": 1200,
        "m": 0,
        "note": "Full suite + guide"
      }
    ],
    "addons": [
      {
        "l": "Extra concept",
        "p": 80,
        "t": "onetime"
      },
      {
        "l": "Vector / source files",
        "p": 120,
        "t": "onetime"
      },
      {
        "l": "Social avatar pack",
        "p": 90,
        "t": "onetime"
      },
      {
        "l": "Business card design",
        "p": 150,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "video",
    "name": "On-Site Videography",
    "blurb": "Professional filming at your location — product, promo, event or brand footage, shot and delivered ready to edit.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 650,
        "m": 0,
        "note": "Half-day shoot"
      },
      {
        "n": "Grow",
        "s": 1400,
        "m": 0,
        "note": "Full-day shoot"
      },
      {
        "n": "Scale",
        "s": 3500,
        "m": 0,
        "note": "Full-day + crew"
      }
    ],
    "addons": [
      {
        "l": "Extra hour",
        "p": 150,
        "t": "onetime"
      },
      {
        "l": "Second camera / operator",
        "p": 500,
        "t": "onetime"
      },
      {
        "l": "Drone / aerial footage",
        "p": 400,
        "t": "onetime"
      },
      {
        "l": "Additional shoot day",
        "p": 1200,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "videoedit",
    "name": "Promo Video Editing",
    "blurb": "Turn raw footage into scroll-stopping promotional videos — cuts, motion graphics, music and social cutdowns.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 300,
        "m": 0,
        "note": "1 promo, up to 60s"
      },
      {
        "n": "Grow",
        "s": 750,
        "m": 0,
        "note": "Up to 3 min + cutdowns"
      },
      {
        "n": "Scale",
        "s": 1800,
        "m": 0,
        "note": "Hero video + suite"
      }
    ],
    "addons": [
      {
        "l": "Extra 30 seconds",
        "p": 100,
        "t": "onetime"
      },
      {
        "l": "Motion graphics pack",
        "p": 250,
        "t": "onetime"
      },
      {
        "l": "3 social cutdowns",
        "p": 150,
        "t": "onetime"
      },
      {
        "l": "Monthly editing retainer",
        "p": 600,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "podcast",
    "name": "Podcast Editing",
    "blurb": "Full podcast post-production — audio cleanup, video edits, show notes and audiograms so you just hit record.",
    "billing": "monthly",
    "tiers": [
      {
        "n": "Launch",
        "s": 0,
        "m": 250,
        "note": "Up to 2 eps / mo"
      },
      {
        "n": "Grow",
        "s": 0,
        "m": 550,
        "note": "Up to 4 eps / mo"
      },
      {
        "n": "Scale",
        "s": 0,
        "m": 1100,
        "note": "Up to 8 eps / mo"
      }
    ],
    "addons": [
      {
        "l": "Additional episode",
        "p": 120,
        "t": "onetime"
      },
      {
        "l": "Full video edit / episode",
        "p": 100,
        "t": "onetime"
      },
      {
        "l": "Audiogram pack (5)",
        "p": 75,
        "t": "onetime"
      },
      {
        "l": "Publishing & distribution",
        "p": 150,
        "t": "monthly"
      }
    ]
  },
  {
    "id": "brochure",
    "name": "Brochure & Leaflet Design",
    "blurb": "Print-ready flyers, leaflets and multi-page brochures that make your business look the part on paper.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 250,
        "m": 0,
        "note": "Flyer / leaflet"
      },
      {
        "n": "Grow",
        "s": 550,
        "m": 0,
        "note": "Folded brochure"
      },
      {
        "n": "Scale",
        "s": 1200,
        "m": 0,
        "note": "Multi-page booklet"
      }
    ],
    "addons": [
      {
        "l": "Extra page",
        "p": 90,
        "t": "onetime"
      },
      {
        "l": "Copywriting",
        "p": 120,
        "t": "onetime"
      },
      {
        "l": "Matching digital PDF",
        "p": 100,
        "t": "onetime"
      },
      {
        "l": "Print-ready packaging",
        "p": 60,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "cards",
    "name": "Business Card Design",
    "blurb": "Memorable business cards — clean, double-sided or premium with special finishes and QR codes. Print coordination available.",
    "billing": "onetime",
    "tiers": [
      {
        "n": "Launch",
        "s": 120,
        "m": 0,
        "note": "1-sided design"
      },
      {
        "n": "Grow",
        "s": 250,
        "m": 0,
        "note": "Double-sided"
      },
      {
        "n": "Scale",
        "s": 500,
        "m": 0,
        "note": "Premium + finishes"
      }
    ],
    "addons": [
      {
        "l": "Double-sided",
        "p": 60,
        "t": "onetime"
      },
      {
        "l": "QR code integration",
        "p": 40,
        "t": "onetime"
      },
      {
        "l": "Digital vCard",
        "p": 80,
        "t": "onetime"
      },
      {
        "l": "Print run (250 cards)",
        "p": 90,
        "t": "onetime"
      }
    ]
  },
  {
    "id": "tradeshow",
    "name": "Tradeshow Lead Capture & Card Scanner",
    "blurb": "A custom-built app that scans business cards (OCR) and captures qualified leads at tradeshows, then syncs them straight to your CRM with auto follow-up.",
    "billing": "hybrid",
    "tiers": [
      {
        "n": "Launch",
        "s": 2000,
        "m": 99,
        "note": "Card scanner + export"
      },
      {
        "n": "Grow",
        "s": 4500,
        "m": 199,
        "note": "Scan + capture + CRM"
      },
      {
        "n": "Scale",
        "s": 9000,
        "m": 399,
        "note": "Full lead engine"
      }
    ],
    "addons": [
      {
        "l": "QR / badge scanning",
        "p": 500,
        "t": "onetime"
      },
      {
        "l": "Offline mode",
        "p": 600,
        "t": "onetime"
      },
      {
        "l": "CRM integration",
        "p": 600,
        "t": "onetime"
      },
      {
        "l": "Auto follow-up sequences",
        "p": 500,
        "t": "onetime"
      }
    ]
  }
]

export const PAIRS = {
  "web": "seo",
  "landing": "mkt",
  "seo": "mkt",
  "app": "bot",
  "social": "video",
  "design": "logo",
  "mkt": "lead",
  "email": "landing",
  "bot": "agent",
  "viz": "web",
  "calc": "web",
  "agent": "lead",
  "lead": "tradeshow",
  "custom": "web",
  "logo": "logoanim",
  "logoanim": "video",
  "video": "videoedit",
  "videoedit": "social",
  "podcast": "social",
  "tradeshow": "lead",
  "cards": "brochure",
  "brochure": "design"
}

export const DETAILS = {
  "email": [
    ["One-time setup fee", "$500", "$500"],
    ["Email campaigns", "1 per month", "2 per week"],
    ["Analytics included", "✓", "✓"]
  ],
  "web": [
    [
      "Pages included",
      "Up to 5",
      "Up to 12",
      "Unlimited"
    ],
    [
      "Design approach",
      "Template-based",
      "Semi-custom",
      "Fully custom UI/UX"
    ],
    [
      "Mobile responsive",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Lead / contact forms",
      "1",
      "Advanced",
      "Custom + CRM"
    ],
    [
      "Blog / CMS setup",
      "—",
      "✓",
      "✓"
    ],
    [
      "E-commerce store",
      "—",
      "Up to 20 products",
      "Full store"
    ],
    [
      "On-page SEO setup",
      "Basic",
      "Standard",
      "Advanced"
    ],
    [
      "Copywriting support",
      "—",
      "Light",
      "Full"
    ],
    [
      "Revision rounds",
      "1",
      "2",
      "3"
    ],
    [
      "Est. delivery",
      "1–2 weeks",
      "3–5 weeks",
      "6–8 weeks"
    ]
  ],
  "landing": [
    [
      "Pages included in base price",
      "1",
      "1",
      "1",
      "Set in quote"
    ],
    [
      "Landing page build",
      "✓",
      "✓",
      "✓",
      "As scoped"
    ],
    [
      "High-intent keyword & phrase targeting",
      "—",
      "✓",
      "✓",
      "As scoped"
    ],
    [
      "SEO content focused on enquiries",
      "—",
      "✓",
      "✓",
      "As scoped"
    ],
    [
      "Custom page design",
      "—",
      "—",
      "✓",
      "As scoped"
    ],
    [
      "Conversion tracking",
      "—",
      "—",
      "✓",
      "As scoped"
    ],
    ["Custom scope & pricing", "—", "—", "—", "Set in quote"]
  ],
  "seo": [
    [
      "Keywords targeted",
      "Up to 30",
      "Up to 75",
      "Up to 150"
    ],
    [
      "Technical audit & fixes",
      "✓",
      "✓",
      "✓"
    ],
    [
      "On-page optimization",
      "20 pages",
      "50 pages",
      "100 pages"
    ],
    [
      "Google Business Profile",
      "✓",
      "✓",
      "Multi-location"
    ],
    [
      "Content articles / mo",
      "2",
      "4",
      "10"
    ],
    [
      "Link building / off-page",
      "Light",
      "Standard",
      "Aggressive"
    ],
    [
      "Local citations",
      "15",
      "30",
      "60"
    ],
    [
      "Reporting",
      "Monthly",
      "Bi-weekly",
      "Bi-weekly + calls"
    ],
    [
      "Dedicated strategist",
      "—",
      "—",
      "✓"
    ]
  ],
  "app": [
    [
      "Platforms",
      "iOS or Android",
      "iOS + Android",
      "iOS + Android + Web"
    ],
    [
      "Screens included",
      "Up to 5",
      "Up to 12",
      "Unlimited"
    ],
    [
      "Custom UI/UX design",
      "Basic",
      "Standard",
      "Premium"
    ],
    [
      "User accounts & login",
      "—",
      "✓",
      "✓"
    ],
    [
      "API / integrations",
      "—",
      "Standard",
      "Advanced"
    ],
    [
      "Push notifications",
      "—",
      "✓",
      "✓"
    ],
    [
      "Admin panel / dashboard",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "App store submission",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Post-launch support",
      "30 days",
      "60 days",
      "90 days"
    ]
  ],
  "social": [
    [
      "Platforms managed",
      "2",
      "3",
      "4+"
    ],
    [
      "Posts per month",
      "12",
      "20",
      "Daily (26+)"
    ],
    [
      "Custom reels / video",
      "—",
      "4 / mo",
      "8 / mo"
    ],
    [
      "Captions + hashtag research",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Content calendar",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Stories & engagement",
      "Basic",
      "Active",
      "Full community mgmt"
    ],
    [
      "Paid boost / ad setup",
      "—",
      "—",
      "✓"
    ],
    [
      "Monthly report",
      "—",
      "✓",
      "✓ + strategy call"
    ]
  ],
  "design": [
    [
      "Logo concepts",
      "3",
      "Logo suite",
      "Full logo system"
    ],
    [
      "Color palette & fonts",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Brand guidelines",
      "—",
      "✓",
      "Complete book"
    ],
    [
      "Business card / stationery",
      "Business card",
      "Card + letterhead",
      "Full stationery set"
    ],
    [
      "Social media templates",
      "—",
      "5",
      "15"
    ],
    [
      "Print / packaging collateral",
      "—",
      "—",
      "✓"
    ],
    [
      "Brand strategy session",
      "—",
      "—",
      "✓"
    ],
    [
      "Revision rounds",
      "1",
      "2",
      "3"
    ]
  ],
  "mkt": [
    [
      "Ad channels managed",
      "1 (Google or Meta)",
      "2 channels",
      "Multi-channel"
    ],
    [
      "Ad spend managed up to",
      "$2,500 / mo",
      "$10,000 / mo",
      "$25,000 / mo"
    ],
    [
      "Campaign setup & targeting",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Landing page optimization",
      "—",
      "✓",
      "✓"
    ],
    [
      "Email campaign / nurture",
      "—",
      "1 / mo",
      "Automation"
    ],
    [
      "A/B testing & retargeting",
      "—",
      "A/B testing",
      "+ Retargeting"
    ],
    [
      "Reporting",
      "Monthly",
      "Bi-weekly",
      "Weekly + strategist"
    ]
  ],
  "bot": [
    [
      "Chatbot type",
      "Rule-based / FAQ",
      "AI / NLP-powered",
      "Advanced custom AI"
    ],
    [
      "Channels",
      "Website",
      "Website + 1 channel",
      "Multi-channel"
    ],
    [
      "Trained topics / intents",
      "Up to 20",
      "Up to 50",
      "Unlimited"
    ],
    [
      "Lead capture",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Appointment booking",
      "—",
      "✓",
      "✓"
    ],
    [
      "CRM / email integration",
      "—",
      "✓",
      "Custom integrations"
    ],
    [
      "Human handoff",
      "—",
      "—",
      "✓"
    ],
    [
      "Analytics dashboard",
      "—",
      "Basic",
      "Advanced"
    ],
    [
      "Monthly care plan",
      "$99 / mo",
      "$199 / mo",
      "$399 / mo"
    ]
  ],
  "viz": [
    [
      "Products / materials",
      "1 product, 10 colors",
      "Up to 50 items",
      "Unlimited"
    ],
    [
      "Customer photo upload",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Color / texture swatches",
      "Basic",
      "✓",
      "Real-time render"
    ],
    [
      "Save & share results",
      "—",
      "✓",
      "✓"
    ],
    [
      "Lead capture",
      "—",
      "✓",
      "✓"
    ],
    [
      "Self-serve admin library",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "Ordering / quote integration",
      "—",
      "—",
      "✓"
    ],
    [
      "Website embed",
      "1 site",
      "1 site",
      "Multi-site"
    ]
  ],
  "calc": [
    [
      "Input variables",
      "Up to 10",
      "Up to 30",
      "Unlimited"
    ],
    [
      "Instant estimate",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Multi-step / logic flow",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "Quote + email capture",
      "—",
      "✓",
      "✓"
    ],
    [
      "PDF quote export",
      "—",
      "✓",
      "✓"
    ],
    [
      "Admin pricing panel",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "Ordering & checkout / payment",
      "—",
      "—",
      "✓"
    ],
    [
      "CRM / lead routing",
      "—",
      "—",
      "✓"
    ]
  ],
  "agent": [
    [
      "Agent scope",
      "Single task",
      "Multi-workflow",
      "Custom agent suite"
    ],
    [
      "Workflows automated",
      "1",
      "Up to 3",
      "Unlimited"
    ],
    [
      "System integrations",
      "1",
      "CRM + calendar + email",
      "Deep (CRM / ERP / helpdesk)"
    ],
    [
      "Channels",
      "Website / chat",
      "+ Email & SMS",
      "Omnichannel"
    ],
    [
      "Knowledge base (RAG) training",
      "Basic",
      "Standard",
      "Advanced"
    ],
    [
      "Autonomous actions",
      "Basic",
      "✓",
      "Advanced"
    ],
    [
      "Human-in-the-loop handoff",
      "—",
      "✓",
      "✓"
    ],
    [
      "Analytics & reporting",
      "—",
      "Monthly",
      "Real-time dashboard"
    ],
    [
      "Optimization & tuning",
      "—",
      "Monthly",
      "Continuous"
    ],
    [
      "Support",
      "Email",
      "Priority",
      "Dedicated"
    ],
    [
      "Monthly retainer",
      "$299 / mo",
      "$650 / mo",
      "$1,500 / mo"
    ]
  ],
  "lead": [
    [
      "Lead capture sources",
      "1 site / form",
      "Multiple sites",
      "Unlimited / multi-brand"
    ],
    [
      "Lead routing",
      "Single inbox",
      "Auto-distribution (round-robin)",
      "Geo / nearest-rep assignment"
    ],
    [
      "Notifications",
      "Email",
      "Email + SMS",
      "Email + SMS + app"
    ],
    [
      "CRM integration",
      "—",
      "✓",
      "Deep / custom"
    ],
    [
      "Auto follow-up sequences",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "Duplicate / spam filtering",
      "Basic",
      "✓",
      "Advanced"
    ],
    [
      "Reporting dashboard",
      "Basic",
      "Standard",
      "Real-time analytics"
    ],
    [
      "Response-time / SLA tracking",
      "—",
      "—",
      "✓"
    ],
    [
      "Monthly management",
      "$150 / mo",
      "$350 / mo",
      "$750 / mo"
    ]
  ],
  "custom": [
    [
      "Project scope",
      "Single feature / tool",
      "Multi-feature app",
      "Enterprise platform"
    ],
    [
      "Discovery & scoping",
      "✓",
      "✓",
      "Dedicated"
    ],
    [
      "Custom database / backend",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "Third-party integrations",
      "1",
      "Multiple",
      "Complex / unlimited"
    ],
    [
      "Admin panel / dashboard",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "User roles & permissions",
      "—",
      "Basic",
      "Advanced"
    ],
    [
      "API development",
      "—",
      "✓",
      "✓"
    ],
    [
      "Ongoing support",
      "30 days",
      "60 days",
      "SLA / retainer"
    ],
    [
      "Timeline",
      "2–4 weeks",
      "6–10 weeks",
      "Scoped per project"
    ]
  ],
  "logoanim": [
    [
      "Animation style",
      "2D reveal",
      "2D + light 3D",
      "Full 3D"
    ],
    [
      "Duration",
      "Up to 8s",
      "5–15s",
      "Multiple lengths"
    ],
    [
      "Versions",
      "1",
      "+ Loop + lower-thirds",
      "Multiple lengths / aspects"
    ],
    [
      "Custom sound design",
      "—",
      "✓",
      "Full"
    ],
    [
      "Transparent / alpha export",
      "—",
      "✓",
      "✓"
    ],
    [
      "Source files (AE / C4D)",
      "—",
      "—",
      "✓"
    ],
    [
      "Brand motion guidelines",
      "—",
      "—",
      "✓"
    ],
    [
      "Revisions",
      "1–2",
      "2–3",
      "Unlimited (in scope)"
    ]
  ],
  "logo": [
    [
      "Logo concepts",
      "2",
      "3",
      "Full suite"
    ],
    [
      "Favicon",
      "✓",
      "✓",
      "Full favicon set"
    ],
    [
      "File formats",
      "PNG / JPG",
      "+ Vector (SVG / AI)",
      "All formats"
    ],
    [
      "Color & font sheet",
      "—",
      "✓",
      "✓"
    ],
    [
      "Social avatar / kit",
      "—",
      "✓",
      "Full kit"
    ],
    [
      "Mini brand guide",
      "—",
      "—",
      "✓"
    ],
    [
      "Revisions",
      "1",
      "2",
      "3"
    ]
  ],
  "video": [
    [
      "Shoot length",
      "Half-day (4 hrs)",
      "Full-day (8 hrs)",
      "Full-day + crew"
    ],
    [
      "Cameras",
      "Single",
      "Single (pro)",
      "Multi-camera"
    ],
    [
      "Lighting & audio",
      "Basic",
      "✓",
      "Pro kit"
    ],
    [
      "Locations",
      "1",
      "Multiple",
      "Multiple + directed"
    ],
    [
      "Drone / aerial",
      "—",
      "Optional",
      "✓"
    ],
    [
      "Raw footage delivery",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Editing included",
      "—",
      "—",
      "— (add editing)"
    ]
  ],
  "videoedit": [
    [
      "Final video length",
      "Up to 60s",
      "Up to 3 min",
      "Up to 5 min"
    ],
    [
      "Editing (cuts / music / captions)",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Motion graphics",
      "—",
      "✓",
      "Advanced"
    ],
    [
      "Color & sound mixing",
      "Basic",
      "✓",
      "Pro"
    ],
    [
      "Social cutdowns",
      "—",
      "3",
      "Multiple"
    ],
    [
      "Voiceover / subtitles",
      "—",
      "Subtitles",
      "VO + subtitles"
    ],
    [
      "Revisions",
      "1",
      "2",
      "3"
    ]
  ],
  "podcast": [
    [
      "Episodes / month",
      "Up to 2",
      "Up to 4",
      "Up to 8"
    ],
    [
      "Audio cleanup & editing",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Video editing",
      "—",
      "✓",
      "✓"
    ],
    [
      "Intro / outro",
      "—",
      "✓",
      "✓"
    ],
    [
      "Show notes",
      "Basic",
      "✓",
      "Detailed"
    ],
    [
      "Audiograms / clips",
      "—",
      "3 / ep",
      "5 / ep"
    ],
    [
      "Chapters & timestamps",
      "—",
      "—",
      "✓"
    ],
    [
      "Publishing & distribution",
      "—",
      "—",
      "✓"
    ]
  ],
  "brochure": [
    [
      "Format",
      "Flyer / leaflet",
      "Bi/Tri-fold brochure",
      "Multi-page booklet"
    ],
    [
      "Sides / pages",
      "1–2 sides",
      "2 sides (folded)",
      "Up to 8 pages"
    ],
    [
      "Print-ready files",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Copywriting support",
      "—",
      "Light",
      "Full"
    ],
    [
      "Custom layout / infographics",
      "Basic",
      "✓",
      "Advanced"
    ],
    [
      "Revisions",
      "1",
      "2",
      "3"
    ]
  ],
  "cards": [
    [
      "Design sides",
      "1-sided",
      "Double-sided",
      "Double-sided premium"
    ],
    [
      "Concepts",
      "1",
      "1",
      "2"
    ],
    [
      "Print-ready files",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Special finishes / QR",
      "—",
      "✓",
      "Spot UV / foil / QR"
    ],
    [
      "Digital vCard option",
      "—",
      "—",
      "✓"
    ],
    [
      "Print coordination",
      "—",
      "—",
      "✓"
    ],
    [
      "Revisions",
      "1",
      "2",
      "3"
    ]
  ],
  "tradeshow": [
    [
      "Business-card OCR scanning",
      "✓",
      "✓",
      "✓"
    ],
    [
      "Custom lead-capture form",
      "—",
      "✓",
      "✓"
    ],
    [
      "QR / badge scanning",
      "—",
      "Optional",
      "✓"
    ],
    [
      "Notes, tags & qualification",
      "Basic",
      "✓",
      "Advanced"
    ],
    [
      "CRM sync / export",
      "CSV export",
      "CRM sync",
      "Deep CRM + automation"
    ],
    [
      "Auto follow-up",
      "—",
      "Email trigger",
      "Sequences"
    ],
    [
      "Offline mode",
      "—",
      "—",
      "✓"
    ],
    [
      "Team / multi-user access",
      "1 user",
      "Small team",
      "Full team"
    ],
    [
      "Dashboard & analytics",
      "—",
      "Basic",
      "Real-time"
    ],
    [
      "Monthly management",
      "$99 / mo",
      "$199 / mo",
      "$399 / mo"
    ]
  ]
}

export const CATEGORIES = [
  {
    "label": "Websites & Development",
    "ids": [
      "web",
      "landing",
      "app",
      "calc",
      "viz",
      "custom"
    ]
  },
  {
    "label": "Marketing & Growth",
    "ids": [
      "seo",
      "social",
      "mkt",
      "email",
      "lead",
      "tradeshow"
    ]
  },
  {
    "label": "AI & Automation",
    "ids": [
      "bot",
      "agent"
    ]
  },
  {
    "label": "Branding & Design",
    "ids": [
      "logo",
      "design",
      "logoanim"
    ]
  },
  {
    "label": "Print & Collateral",
    "ids": [
      "cards",
      "brochure"
    ]
  },
  {
    "label": "Video & Podcast",
    "ids": [
      "video",
      "videoedit",
      "podcast"
    ]
  }
]
