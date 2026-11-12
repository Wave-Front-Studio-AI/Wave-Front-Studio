export default {
  slug: 'ridgeline',
  name: 'Ridgeline',
  industry: 'Roofing and exteriors',
  theme: {
    mood: 'light', bg: '#ffffff', surface: '#f3f1ee', ink: '#1d232a', muted: '#58616b', line: '#dcd7d0',
    accent: '#c2410c', accentInk: '#ffffff', font: 'sans', headFont: 'slab', radius: 6,
    nav: 'bar', hero: 'split', cards: 'cards', gallery: 'mosaic',
  },
  business: {
    name: 'Ridgeline Roofing', tagline: 'Licensed and insured roofers', phone: '(555) 010-0142', email: 'hello@yourroofer.com',
    address: '123 Main Street, Your Town', hours: ['Mon to Fri: 7am to 5pm', 'Sat: 8am to noon', 'Storm calls: any time'], cta: 'Get a free roof quote',
  },
  home: {
    eyebrow: 'Roof repair and replacement',
    headline: 'A roof that keeps the water out for the next 30 years.',
    sub: 'We repair leaks, replace worn roofs and handle the insurance paperwork. One crew from first look to final cleanup.',
    ctaPrimary: 'Get a free roof quote', ctaSecondary: 'See our services',
    proof: [{ n: '1,200+', l: 'roofs finished' }, { n: '25 yrs', l: 'in business' }, { n: '5 yr', l: 'workmanship warranty' }],
    featureTitle: 'Why homeowners call us first',
    features: [
      { title: 'Straight quotes', text: 'You get a written price before any work starts, and it does not creep.' },
      { title: 'Clean job sites', text: 'Magnet sweep every evening. Your yard looks the way we found it.' },
      { title: 'Storm response', text: 'Tarps on within hours when a tree or a storm gets there first.' },
      { title: 'Insurance help', text: 'We photograph the damage and talk to your adjuster with you.' },
    ],
    bandTitle: 'Leak in the ceiling? Call today.', bandText: 'We can usually be out to look within two working days.',
  },
  services: {
    title: 'Roofing services', intro: 'Repairs, full replacements and the details around them.',
    items: [
      { title: 'Roof repair', text: 'Leaks, lifted shingles, flashing and vents fixed at the source.' },
      { title: 'Full replacement', text: 'Tear off, deck check, new underlayment and shingles or metal.' },
      { title: 'Metal roofing', text: 'Standing seam and ribbed panels built for decades.' },
      { title: 'Gutters and downspouts', text: 'Seamless gutters cut to your roofline.' },
      { title: 'Storm damage', text: 'Emergency tarping, inspection reports and claim support.' },
      { title: 'Inspections', text: 'A written report with photos before you buy or sell.' },
    ],
    bandTitle: 'Not sure what you need? We will take a look.',
  },
  about: {
    title: 'A local crew you can call back', intro: 'Family owned, with the same crew leads on your roof every time.',
    body: ['We started with one truck and a ladder. Most of our work still comes from neighbors and past customers, which is how we like it.', 'Every roof gets a pre-job walkthrough and a post-job inspection by the person who signs the warranty.'],
    valuesTitle: 'How we work',
    values: [
      { title: 'On time', text: 'We show up when we said, or we call first.' },
      { title: 'In writing', text: 'Scope, price and schedule on one page.' },
      { title: 'Insured', text: 'Full liability and workers compensation.' },
      { title: 'Backed', text: 'A written warranty on materials and labor.' },
    ],
  },
  gallery: {
    title: 'Recent roofs', intro: 'A few of the homes we finished this season.',
    items: [{ label: 'Architectural shingle' }, { label: 'Standing seam' }, { label: 'Storm repair' }, { label: 'Tile reroof' }, { label: 'New gutters' }, { label: 'Full replacement' }, { label: 'Skylight flashing' }, { label: 'Ridge vent' }],
  },
  contact: { title: 'Get your free quote', intro: 'Tell us about the roof and we will reply within two working days.', formLabel: 'What is going on with the roof?', send: 'Send my request' },
}
