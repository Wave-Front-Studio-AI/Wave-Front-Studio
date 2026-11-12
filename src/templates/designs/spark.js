export default {
  slug: 'spark',
  name: 'Spark',
  industry: 'Electricians',
  theme: {
    mood: 'dark', bg: '#111418', surface: '#1b2027', ink: '#f4f5f7', muted: '#a9b1bc', line: '#2d3540',
    accent: '#ffc107', accentInk: '#14161a', font: 'sans', headFont: 'display', radius: 14,
    nav: 'bar', hero: 'band', cards: 'rows', gallery: 'grid',
  },
  business: {
    name: 'Spark Electric', tagline: 'Residential and light commercial electricians', phone: '(555) 010-0311', email: 'service@yourelectrician.com',
    address: '210 Industrial Way, Your Town', hours: ['Mon to Fri: 7am to 6pm', 'Sat: 8am to 2pm', 'Emergency calls: 24 hours'], cta: 'Book an electrician',
  },
  home: {
    eyebrow: 'Electrical repair and installation',
    headline: 'Lights on, panels safe, and the job done right the first time.',
    sub: 'We fix flickering lights, dead outlets and tripping breakers, and we wire new builds and remodels. You get a firm price before we start.',
    ctaPrimary: 'Book an electrician', ctaSecondary: 'See our services',
    proof: [{ n: '3,000+', l: 'service calls' }, { n: 'Same day', l: 'repairs when possible' }, { n: '24/7', l: 'emergency line' }],
    featureTitle: 'Why people call Spark',
    features: [
      { title: 'Upfront pricing', text: 'We quote the job before we open a panel, and the number holds.' },
      { title: 'Neat work', text: 'Straight runs, labeled breakers and a clean floor when we leave.' },
      { title: 'Show up on time', text: 'You get a call when we are on the way, with a short arrival window.' },
      { title: 'Safety first', text: 'We test every circuit we touch before we call the job done.' },
    ],
    bandTitle: 'Breaker keeps tripping? Call us.', bandText: 'Most repair calls are booked for the same or next day.',
  },
  services: {
    title: 'Electrical services', intro: 'Repairs, upgrades and new wiring for homes and small shops.',
    items: [
      { title: 'Troubleshooting and repair', text: 'Dead outlets, flickering lights and tripping breakers found and fixed.' },
      { title: 'Panel upgrades', text: 'Replace an old or full panel with one sized for your home.' },
      { title: 'Lighting installs', text: 'Recessed, track, under cabinet and outdoor lighting.' },
      { title: 'EV charger installs', text: 'A dedicated circuit and a wall charger set up in your garage.' },
      { title: 'Remodel and new wiring', text: 'Rough in and finish work for additions, basements and new builds.' },
      { title: 'Generators and surge protection', text: 'Backup power and whole home surge protection.' },
    ],
    bandTitle: 'Need a hand deciding? Ask us.',
  },
  about: {
    title: 'Local electricians who pick up the phone', intro: 'A small crew that treats your house like their own.',
    body: ['We started as one electrician with a van and a notebook. Today we are a small team, and most of our work comes from neighbors who tell their neighbors.', 'Every job gets a walkthrough before we start and a test of every circuit before we leave.'],
    valuesTitle: 'How we work',
    values: [
      { title: 'Honest advice', text: 'If it does not need replacing, we say so.' },
      { title: 'Clear estimates', text: 'Parts, labor and timing on one page.' },
      { title: 'Respect for your home', text: 'Floor covers, shoe covers and a tidy truck.' },
      { title: 'Follow up', text: 'We call a few days later to make sure everything works.' },
    ],
  },
  gallery: {
    title: 'Recent jobs', intro: 'A few of the projects our crew finished this season.',
    items: [{ label: 'Panel upgrade' }, { label: 'Kitchen lighting' }, { label: 'EV charger' }, { label: 'Garage subpanel' }, { label: 'Outdoor lights' }, { label: 'Whole home rewire' }],
  },
  contact: { title: 'Book an electrician', intro: 'Tell us what is going on and we will call you back the same day.', formLabel: 'What do you need help with?', send: 'Send my request' },
}
