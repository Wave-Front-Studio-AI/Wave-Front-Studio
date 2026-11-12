export default {
  slug: 'northside-auto',
  name: 'Northside Auto',
  industry: 'Auto repair and detailing',
  theme: {
    mood: 'light', bg: '#ffffff', surface: '#f1f1f1', ink: '#0d0d0d', muted: '#4d4d4d', line: '#d6d6d6',
    accent: '#c8102e', accentInk: '#ffffff', font: 'sans', headFont: 'impact', radius: 0,
    nav: 'bar', hero: 'left', cards: 'icons', gallery: 'mosaic',
  },
  business: {
    name: 'Northside Auto', tagline: 'Repair, tires and detailing', phone: '(555) 010-0327', email: 'shop@yourautoshop.com',
    address: '880 Garage Row, Your Town', hours: ['Mon to Fri: 7:30am to 6pm', 'Sat: 8am to 3pm', 'Closed Sunday'], cta: 'Book a service',
  },
  home: {
    eyebrow: 'Auto repair and detailing',
    headline: 'FIXED RIGHT. PRICED FAIR. BACK ON THE ROAD.',
    sub: 'Brakes, oil, tires, check engine lights and full detailing under one roof. We call before we do any work that was not on the estimate.',
    ctaPrimary: 'Book a service', ctaSecondary: 'What we fix',
    proof: [{ n: '8,000+', l: 'vehicles serviced' }, { n: 'Same day', l: 'oil and tire work' }, { n: '12 mo', l: 'repair warranty' }],
    featureTitle: 'What you get at the shop',
    features: [
      { title: 'Free estimates', text: 'Bring it in and we tell you what it needs and what it costs.' },
      { title: 'Old parts back', text: 'Ask and we hand you the parts we replaced.' },
      { title: 'Loaner rides', text: 'Need to get to work? Ask about a ride while we fix it.' },
      { title: 'Straight answers', text: 'We tell you what is urgent and what can wait.' },
    ],
    bandTitle: 'Check engine light on? Bring it in.', bandText: 'We read the codes and give you a quote the same day.',
  },
  services: {
    title: 'Repair and detailing', intro: 'Everything your car, truck or SUV needs to run well and look sharp.',
    items: [
      { title: 'Brakes', text: 'Pads, rotors, calipers and brake fluid for a firm pedal.' },
      { title: 'Oil and filters', text: 'Quick service with the right oil for your engine.' },
      { title: 'Tires and alignment', text: 'New tires, rotation, balancing and alignment.' },
      { title: 'Engine diagnostics', text: 'Check engine lights traced to the real cause.' },
      { title: 'Suspension and steering', text: 'Shocks, struts and tie rods for a smooth, steady ride.' },
      { title: 'Interior and exterior detailing', text: 'Wash, clay, wax and a deep clean inside.' },
    ],
    bandTitle: 'Not sure what it needs? Bring it by.',
  },
  about: {
    title: 'A shop you can trust with the keys', intro: 'Family-owned, with the same mechanics on your car every visit.',
    body: ['We opened with two bays and a handshake. Most of our customers have been coming back for years, and they send their friends.', 'We explain the problem in plain words, show you what we found and let you decide.'],
    valuesTitle: 'What we stand for',
    values: [
      { title: 'No upsell', text: 'We fix what is broken and tell you what to watch.' },
      { title: 'Written quotes', text: 'The price on the paper is the price you pay.' },
      { title: 'Done when promised', text: 'We give you a pickup time and keep to it.' },
      { title: 'Backed work', text: 'Repairs come with a written warranty.' },
    ],
  },
  gallery: {
    title: 'From the bays', intro: 'A few recent jobs from the shop floor.',
    items: [{ label: 'Brake job' }, { label: 'Full detail' }, { label: 'Truck tires' }, { label: 'Engine bay' }, { label: 'Paint correction' }, { label: 'Suspension swap' }, { label: 'Interior clean' }, { label: 'Oil service' }],
  },
  contact: { title: 'Book a service', intro: 'Tell us the year, make and what is going on, and we will call you back.', formLabel: 'What does the vehicle need?', send: 'Request an appointment' },
}
