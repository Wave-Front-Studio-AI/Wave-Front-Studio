export default {
  slug: 'brightpath',
  name: 'Brightpath',
  industry: 'Cleaning services',
  theme: {
    mood: 'light', bg: '#ffffff', surface: '#e8f3fb', ink: '#10283d', muted: '#4a6278', line: '#cfe2f1',
    accent: '#0369a1', accentInk: '#ffffff', font: 'display', headFont: 'display', radius: 14,
    nav: 'stack', hero: 'band', cards: 'icons', gallery: 'grid',
  },
  business: {
    name: 'Brightpath Cleaning', tagline: 'Homes and offices, spotless', phone: '(555) 010-0212', email: 'book@yourcleaner.com',
    address: '88 Clear Street, Your Town', hours: ['Mon to Fri: 8am to 6pm', 'Sat: 9am to 2pm', 'Closed Sundays'], cta: 'Book a cleaning',
  },
  home: {
    eyebrow: 'Home and office cleaning',
    headline: 'Come home to a clean house and a free evening.',
    sub: 'Reliable cleaners, a simple checklist and supplies brought with us. Book online or give us a call.',
    ctaPrimary: 'Book a cleaning', ctaSecondary: 'What we clean',
    proof: [{ n: '600+', l: 'homes cleaned' }, { n: '98%', l: 'customers rebook' }, { n: '2 hrs', l: 'average reply time' }],
    featureTitle: 'Cleaning without the worry',
    features: [
      { title: 'Background checked', text: 'Every cleaner is screened before they enter a home.' },
      { title: 'We bring supplies', text: 'Our own products and equipment. Ask if you prefer fragrance free.' },
      { title: 'A set checklist', text: 'Every room gets the same careful steps every visit.' },
      { title: 'Not happy? We return', text: 'Tell us within 24 hours and we will re-clean the spot.' },
    ],
    bandTitle: 'Want a price? It takes two minutes.', bandText: 'Tell us your rooms and we will send a flat quote today.',
  },
  services: {
    title: 'Cleaning services', intro: 'Regular visits and one time deep cleans.',
    items: [
      { title: 'Regular house cleaning', text: 'Weekly, every other week or monthly visits.' },
      { title: 'Deep cleaning', text: 'Baseboards, inside appliances and the corners that get missed.' },
      { title: 'Move in and move out', text: 'An empty home cleaned top to bottom.' },
      { title: 'Office cleaning', text: 'After hours cleaning so your team starts fresh.' },
      { title: 'Windows', text: 'Inside and outside glass, tracks and sills.' },
      { title: 'Rental turnovers', text: 'Quick, reliable cleans between guests.' },
    ],
    bandTitle: 'Need something not on the list? Just ask.',
  },
  about: {
    title: 'A cleaning team that cares', intro: 'Locally owned, and we treat your home like our own.',
    body: ['We started Brightpath because we were tired of cleaning companies that sent someone new every week. Our customers get the same small team each time.', 'We train every cleaner on the same checklist, and we check in after the first visit to make sure you are happy.'],
    valuesTitle: 'Our standards',
    values: [
      { title: 'Trust', text: 'Screened, trained and insured cleaners.' },
      { title: 'Consistency', text: 'The same team and the same checklist.' },
      { title: 'Respect', text: 'Shoes off, doors locked, nothing moved without asking.' },
      { title: 'Care', text: 'Safe products, and kind to pets and kids.' },
    ],
  },
  gallery: {
    title: 'Fresh and spotless', intro: 'A look at the kind of work we do.',
    items: [{ label: 'Kitchen' }, { label: 'Bathroom' }, { label: 'Living room' }, { label: 'Bedroom' }, { label: 'Office space' }, { label: 'Windows' }],
  },
  contact: { title: 'Book your cleaning', intro: 'Tell us about your space and we will send a flat price.', formLabel: 'How many rooms and what kind of clean?', send: 'Get my price' },
}
