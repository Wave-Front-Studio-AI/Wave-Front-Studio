export default {
  slug: 'summit-realty',
  name: 'Summit',
  industry: 'Real estate',
  theme: {
    mood: 'light', bg: '#fbfaf7', surface: '#efeae0', ink: '#14213a', muted: '#555f70', line: '#d9d2c3',
    accent: '#1e3a6e', accentInk: '#ffffff', font: 'serif', headFont: 'serif', radius: 0,
    nav: 'center', hero: 'left', cards: 'lines', gallery: 'mosaic',
  },
  business: {
    name: 'Summit Realty', tagline: 'Buying and selling homes in Your Town', phone: '(555) 010-0223', email: 'homes@yourrealtor.com',
    address: '300 Market Street, Suite 2, Your Town', hours: ['Mon to Fri: 9am to 6pm', 'Sat and Sun: by appointment'], cta: 'Talk to an agent',
  },
  home: {
    eyebrow: 'Local real estate agents',
    headline: 'Find the right home, or sell yours for what it is worth.',
    sub: 'We know every street in town. Call us before you list or before you start looking, and we will walk you through each step.',
    ctaPrimary: 'Talk to an agent', ctaSecondary: 'How we help',
    proof: [{ n: '150+', l: 'homes sold' }, { n: '21 days', l: 'average time to offer' }, { n: '1 agent', l: 'from start to keys' }],
    featureTitle: 'Why people choose Summit',
    features: [
      { title: 'One agent, start to finish', text: 'You deal with the same person, not a call center.' },
      { title: 'Honest pricing advice', text: 'We show you the sold homes nearby and explain our number.' },
      { title: 'Always reachable', text: 'We answer calls and texts, evenings and weekends too.' },
      { title: 'Clear next steps', text: 'A written timeline so you always know what happens next.' },
    ],
    bandTitle: 'Curious what your home is worth?', bandText: 'Ask for a free home value. No pressure and no obligation.',
  },
  services: {
    title: 'How we can help', intro: 'Whether you are buying, selling or renting.',
    items: [
      { title: 'Buying a home', text: 'Search, tours, offers and closing help in one place.' },
      { title: 'Selling a home', text: 'Pricing, photos, listing and open houses.' },
      { title: 'First time buyers', text: 'We explain every step and every form in plain words.' },
      { title: 'Home value reviews', text: 'A free look at what your home would sell for today.' },
      { title: 'Investment properties', text: 'Help finding and renting out a second property.' },
      { title: 'Relocation', text: 'Moving to or from Your Town? We make the move simpler.' },
    ],
    bandTitle: 'Not sure where to start? Call us for a chat.',
  },
  about: {
    title: 'Your neighbors in real estate', intro: 'A small local team that lives and works here.',
    body: ['We chose real estate because buying or selling a home is one of the biggest things people do. We think it deserves patience and straight answers.', 'We are here for the questions too: schools, commutes, taxes, noise. If we do not know the answer, we will find it.'],
    valuesTitle: 'What we stand for',
    values: [
      { title: 'Listen', text: 'Your goals set the plan, not ours.' },
      { title: 'Tell the truth', text: 'Even when it is not what you hoped to hear.' },
      { title: 'Stay in touch', text: 'Regular updates without you having to ask.' },
      { title: 'Follow through', text: 'We keep our word, and we keep working after closing.' },
    ],
  },
  gallery: {
    title: 'Recent homes', intro: 'A few places we have helped people buy and sell.',
    items: [{ label: 'Craftsman on Elm' }, { label: 'Lakeside cottage' }, { label: 'Downtown loft' }, { label: 'Family colonial' }, { label: 'Ranch with a view' }, { label: 'Corner townhome' }, { label: 'New build' }, { label: 'Cozy bungalow' }],
  },
  contact: { title: 'Talk to an agent', intro: 'Tell us what you are looking for and an agent will call you back.', formLabel: 'Are you buying, selling or just curious?', send: 'Request a call' },
}
