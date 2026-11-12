export default {
  slug: 'willow-studio',
  name: 'Willow Studio',
  industry: 'Photography and creative',
  theme: {
    mood: 'light', bg: '#faf8f5', surface: '#f0ece6', ink: '#232220', muted: '#615c55', line: '#ddd7ce',
    accent: '#6b5b45', accentInk: '#ffffff', font: 'serif', headFont: 'mono', radius: 0,
    nav: 'stack', hero: 'overlay', cards: 'lines', gallery: 'strip',
  },
  business: {
    name: 'Willow Studio', tagline: 'Portrait and event photography', phone: '(555) 010-0345', email: 'hello@yourphotographer.com',
    address: '14 Orchard Lane, Your Town', hours: ['Tue to Fri: 10am to 4pm', 'Sat: shoots by booking', 'Sun and Mon: closed'], cta: 'Check availability',
  },
  home: {
    eyebrow: 'Portraits, weddings and small events',
    headline: 'Quiet, natural photographs of the days that matter.',
    sub: 'We keep sessions relaxed and unhurried so you look like yourself. You get a full online gallery and prints you can hold.',
    ctaPrimary: 'Check availability', ctaSecondary: 'View the gallery',
    proof: [{ n: '400+', l: 'sessions shot' }, { n: '2 weeks', l: 'to your gallery' }, { n: '1 hr', l: 'relaxed sessions' }],
    featureTitle: 'How a session goes',
    features: [
      { title: 'A short chat first', text: 'We talk about the day, the light and what you want to remember.' },
      { title: 'Relaxed direction', text: 'Gentle prompts so nobody has to pose stiffly.' },
      { title: 'Soft, true color', text: 'Natural light and light editing that looks like the day felt.' },
      { title: 'Easy delivery', text: 'A private online gallery to share, download and order prints.' },
    ],
    bandTitle: 'Planning a shoot this season?', bandText: 'Weekend dates fill early, so send a note when you have a date.',
  },
  services: {
    title: 'Sessions and packages', intro: 'Simple options, priced up front.',
    items: [
      { title: 'Portrait sessions', text: 'Individuals and couples, in the studio or outdoors.' },
      { title: 'Family sessions', text: 'Relaxed time together with candid and posed frames.' },
      { title: 'Weddings and elopements', text: 'Half day and full day coverage with a second shooter on request.' },
      { title: 'Events', text: 'Parties, launches and small gatherings, shot candidly.' },
      { title: 'Headshots and branding', text: 'Clean, friendly photos for your website and profile.' },
      { title: 'Prints and albums', text: 'Archival prints and hand bound albums.' },
    ],
    bandTitle: 'Not sure which fits? Write to us.',
  },
  about: {
    title: 'Hello, we are Willow', intro: 'A small studio run by two people who love an honest photograph.',
    body: ['We started taking pictures for friends and never stopped. Today the studio is a bright room, a porch and a lot of patience.', 'We shoot the way we would want to be shot: calm, curious and never in a rush.'],
    valuesTitle: 'What we care about',
    values: [
      { title: 'Real moments', text: 'We wait for the laugh, not the pose.' },
      { title: 'Good light', text: 'We plan sessions around the best hour of the day.' },
      { title: 'Plain pricing', text: 'Packages listed in writing before you book.' },
      { title: 'Your photos, kept safe', text: 'Every gallery is backed up twice.' },
    ],
  },
  gallery: {
    title: 'Selected work', intro: 'A small look at recent sessions.',
    items: [{ label: 'Morning portrait' }, { label: 'Garden wedding' }, { label: 'Family porch' }, { label: 'Studio light' }, { label: 'Quiet elopement' }, { label: 'Newborn' }, { label: 'Golden hour' }, { label: 'Headshots' }],
  },
  contact: { title: 'Say hello', intro: 'Tell us about your day and we will reply within two working days.', formLabel: 'What would you like photographed?', send: 'Send a note' },
}
