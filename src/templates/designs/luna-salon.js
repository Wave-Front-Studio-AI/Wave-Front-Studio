export default {
  slug: 'luna-salon',
  name: 'Luna',
  industry: 'Hair and beauty',
  theme: {
    mood: 'light', bg: '#fff9f8', surface: '#f8e9e6', ink: '#3a2630', muted: '#76585f', line: '#ecd4d0',
    accent: '#a8445f', accentInk: '#ffffff', font: 'sans', headFont: 'serif', radius: 28,
    nav: 'stack', hero: 'band', cards: 'icons', gallery: 'mosaic',
  },
  business: {
    name: 'Luna Hair Studio', tagline: 'Cuts, color and styling', phone: '(555) 010-0145', email: 'book@yoursalon.com',
    address: '32 Garden Row, Your Town', hours: ['Tue to Fri: 9am to 7pm', 'Sat: 9am to 4pm', 'Sun and Mon: closed'], cta: 'Book an appointment',
  },
  home: {
    eyebrow: 'Hair, color and styling',
    headline: 'Hair that feels like you on your very best day.',
    sub: 'A calm studio, a stylist who listens and a color plan made for your hair. Walk out feeling great.',
    ctaPrimary: 'Book an appointment', ctaSecondary: 'See services',
    proof: [{ n: '8', l: 'years in the chair' }, { n: '900+', l: 'happy regulars' }, { n: '3', l: 'stylists on the team' }],
    featureTitle: 'Why guests keep coming back',
    features: [
      { title: 'A real consult', text: 'We talk about your hair, your habits and your budget before we start.' },
      { title: 'Gentle color', text: 'Careful products and a plan to keep your hair healthy between visits.' },
      { title: 'Calm space', text: 'Quiet music, comfy chairs and a cup of tea while you relax.' },
      { title: 'Easy booking', text: 'Book online or send us a text. We confirm the same day.' },
    ],
    bandTitle: 'New guests get a free style consult.', bandText: 'Come in with a photo or an idea and we will build a plan together.',
  },
  services: {
    title: 'Services and prices', intro: 'Starting prices are on the menu. We confirm your exact quote at the consult.',
    items: [
      { title: 'Haircut and style', text: 'Cut, wash and blowout shaped to your face and your routine.' },
      { title: 'Color', text: 'All over color, root touch ups and gray coverage.' },
      { title: 'Highlights and balayage', text: 'Soft, natural brightness that grows out well.' },
      { title: 'Treatments', text: 'Deep conditioning and repair for dry or damaged hair.' },
      { title: 'Updos and events', text: 'Wedding, prom and party styling, on site or in the studio.' },
      { title: 'Kids cuts', text: 'Quick, friendly trims for little ones.' },
    ],
    bandTitle: 'Questions about a service? Send us a message.',
  },
  about: {
    title: 'A small studio with big care', intro: 'Luna started with one chair and a love of making people feel good.',
    body: ['We keep the schedule small on purpose so every guest gets time and attention. You will see the same stylist each visit and they will remember your story.', 'We use professional products and keep learning new techniques, so your hair gets the best of both.'],
    valuesTitle: 'What guests can expect',
    values: [
      { title: 'Listening', text: 'Your ideas come first, our advice comes second.' },
      { title: 'Healthy hair', text: 'Every plan keeps the long term in mind.' },
      { title: 'Clean studio', text: 'Fresh tools and a tidy space for every guest.' },
      { title: 'Honest pricing', text: 'You hear the cost before we begin.' },
    ],
  },
  gallery: {
    title: 'Recent work', intro: 'A few looks from the chair this season.',
    items: [{ label: 'Soft balayage' }, { label: 'Layered cut' }, { label: 'Copper color' }, { label: 'Bridal updo' }, { label: 'Blonde refresh' }, { label: 'Curly cut' }, { label: 'Gloss treatment' }, { label: 'Short bob' }],
  },
  contact: { title: 'Book your visit', intro: 'Tell us what you have in mind and we will reply within one working day.', formLabel: 'What would you like done?', send: 'Request a time' },
}
