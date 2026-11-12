export default {
  slug: 'greenleaf',
  name: 'Greenleaf',
  industry: 'Landscaping and lawn care',
  theme: {
    mood: 'light', bg: '#f6f8f0', surface: '#e6edd9', ink: '#1f2d1b', muted: '#4a5d44', line: '#cdd9bb',
    accent: '#2f6b2a', accentInk: '#ffffff', font: 'sans', headFont: 'serif', radius: 14,
    nav: 'bar', hero: 'overlay', cards: 'rows', gallery: 'strip',
  },
  business: {
    name: 'Greenleaf Lawn and Landscape', tagline: 'Lawns and yards done right', phone: '(555) 010-0201', email: 'hello@yourlawncare.com',
    address: '210 Garden Road, Your Town', hours: ['Mon to Fri: 7am to 5pm', 'Sat: 8am to 1pm', 'Closed Sundays'], cta: 'Get a free yard quote',
  },
  home: {
    eyebrow: 'Lawn care, planting and yard cleanup',
    headline: 'A yard you are proud to pull into, all season long.',
    sub: 'We mow, trim, plant and clean up so your yard looks good without you giving up your weekends.',
    ctaPrimary: 'Get a free yard quote', ctaSecondary: 'See our services',
    proof: [{ n: '400+', l: 'yards looked after' }, { n: '10 yrs', l: 'in business' }, { n: 'Same week', l: 'quotes' }],
    featureTitle: 'Why neighbors hire us',
    features: [
      { title: 'Same crew each visit', text: 'You get to know the people in your yard, and they know your yard.' },
      { title: 'Fair, flat pricing', text: 'You get the price up front. No surprise add ons on the bill.' },
      { title: 'We clean up', text: 'Clippings blown off, edges sharp, gate latched when we leave.' },
      { title: 'Easy scheduling', text: 'Weekly, every other week or one time. Skip a week by text.' },
    ],
    bandTitle: 'Ready for a better looking yard?', bandText: 'Send us your address and we will quote it within two working days.',
  },
  services: {
    title: 'Lawn and landscape services', intro: 'Regular care and bigger one time projects.',
    items: [
      { title: 'Lawn mowing', text: 'Weekly or every other week, with trimming and edging every visit.' },
      { title: 'Fertilizing and weed control', text: 'A simple seasonal plan for thicker grass.' },
      { title: 'Mulch and planting', text: 'Fresh beds, shrubs, flowers and small trees.' },
      { title: 'Spring and fall cleanup', text: 'Leaves, branches and winter debris hauled away.' },
      { title: 'Hedge and shrub trimming', text: 'Shaped by hand so plants stay healthy.' },
      { title: 'Sod and seeding', text: 'Bare spots fixed and new lawns started right.' },
    ],
    bandTitle: 'Have a project in mind? Tell us about it.',
  },
  about: {
    title: 'Local people who love yards', intro: 'A small, family-owned crew serving homes in Your Town.',
    body: ['We started with one mower and a few neighbors. Today we look after yards all over town, and most of our new customers come from a friend telling a friend.', 'We keep our crews small so we can do careful work. If something does not look right, call us and we will come back and fix it.'],
    valuesTitle: 'What you can count on',
    values: [
      { title: 'Show up', text: 'We come on the day we said, or we call first.' },
      { title: 'Do it right', text: 'Clean lines, tidy beds and healthy plants.' },
      { title: 'Be honest', text: 'If your lawn does not need a service, we will say so.' },
      { title: 'Respect your yard', text: 'Gates closed, pets safe, flower beds protected.' },
    ],
  },
  gallery: {
    title: 'Our recent yards', intro: 'A few places we have worked on lately.',
    items: [{ label: 'Front lawn' }, { label: 'Fresh mulch beds' }, { label: 'Flower border' }, { label: 'Back patio garden' }, { label: 'New sod' }, { label: 'Hedge trim' }, { label: 'Fall cleanup' }, { label: 'Stone edging' }],
  },
  contact: { title: 'Ask for a free quote', intro: 'Tell us about your yard and we will reply within two working days.', formLabel: 'What would you like done in your yard?', send: 'Send my request' },
}
