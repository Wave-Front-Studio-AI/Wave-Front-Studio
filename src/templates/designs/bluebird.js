export default {
  slug: 'bluebird',
  name: 'Bluebird',
  industry: 'Plumbing and HVAC',
  theme: {
    mood: 'light', bg: '#ffffff', surface: '#e9f2fb', ink: '#10233a', muted: '#4a5f78', line: '#cfdeee',
    accent: '#1560b8', accentInk: '#ffffff', font: 'sans', headFont: 'display', radius: 14,
    nav: 'center', hero: 'split', cards: 'cards', gallery: 'strip',
  },
  business: {
    name: 'Bluebird Plumbing and Air', tagline: 'Plumbing, heating and cooling', phone: '(555) 010-0156', email: 'service@yourplumber.com',
    address: '500 Service Road, Your Town', hours: ['Mon to Fri: 7am to 6pm', 'Sat: 8am to 2pm', 'Emergency calls: 24 hours'], cta: 'Call for service',
  },
  home: {
    eyebrow: 'Plumbing, heating and cooling',
    headline: 'Fast fixes for leaks, clogs and broken heat or air.',
    sub: 'A friendly tech arrives on time, tells you the price first and fixes it right. Same day service for most calls.',
    ctaPrimary: 'Call for service', ctaSecondary: 'See services',
    proof: [{ n: 'Same day', l: 'service on most calls' }, { n: '24/7', l: 'emergency line' }, { n: '15 yrs', l: 'serving the area' }],
    featureTitle: 'What you get when you call',
    features: [
      { title: 'Upfront pricing', text: 'You hear the full price and say yes before we pick up a wrench.' },
      { title: 'On time techs', text: 'We call ahead with an arrival window and we keep to it.' },
      { title: 'Clean work', text: 'Shoe covers, drop cloths and a tidy space when we leave.' },
      { title: 'Work guaranteed', text: 'If something is not right, we come back and make it right.' },
    ],
    bandTitle: 'Water where it should not be? Call now.', bandText: 'Our emergency line is answered by a real person day or night.',
  },
  services: {
    title: 'What we fix and install', intro: 'Plumbing, heating and cooling for homes and small businesses.',
    items: [
      { title: 'Leaks and repairs', text: 'Pipes, faucets, toilets and fixtures fixed fast.' },
      { title: 'Drain cleaning', text: 'Slow sinks, clogged lines and sewer backups cleared.' },
      { title: 'Water heaters', text: 'Tank and tankless repair, replacement and flushing.' },
      { title: 'Furnace and heating', text: 'Repair, tune ups and new system installation.' },
      { title: 'Air conditioning', text: 'Cooling repair, maintenance and replacement.' },
      { title: 'Maintenance plans', text: 'Yearly checkups that catch small problems early.' },
    ],
    bandTitle: 'Need a quote for a bigger job? We will come take a look.',
  },
  about: {
    title: 'Your local service crew', intro: 'Bluebird is a family owned shop that treats every home like our own.',
    body: ['We started with one van and a phone number. Today we run a small fleet, and most of our calls come from neighbors who have used us before.', 'Our techs are trained, background checked and paid to do the job right, not to sell you extras you do not need.'],
    valuesTitle: 'Our promises',
    values: [
      { title: 'Honest advice', text: 'We tell you what needs fixing now and what can wait.' },
      { title: 'Respect for your home', text: 'Boots off, covers on and a clean finish.' },
      { title: 'Clear prices', text: 'No surprise fees on the final bill.' },
      { title: 'Always reachable', text: 'Call, text or email and we answer.' },
    ],
  },
  gallery: {
    title: 'Recent jobs', intro: 'A few of the repairs and installs we finished lately.',
    items: [{ label: 'Water heater swap' }, { label: 'Kitchen faucet' }, { label: 'New furnace' }, { label: 'Drain repair' }, { label: 'Bathroom remodel' }, { label: 'AC install' }, { label: 'Pipe repair' }, { label: 'Tankless heater' }],
  },
  contact: { title: 'Request service', intro: 'Tell us what is going on and we will call back within the hour during business hours.', formLabel: 'What needs fixing?', send: 'Request a call back' },
}
