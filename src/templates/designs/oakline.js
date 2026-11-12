export default {
  slug: 'oakline',
  name: 'Oakline',
  industry: 'Law and accounting',
  theme: {
    mood: 'light', bg: '#fbfaf6', surface: '#edeae0', ink: '#1b2a24', muted: '#53615a', line: '#d6d2c3',
    accent: '#1f5a43', accentInk: '#ffffff', font: 'serif', headFont: 'serif', radius: 0,
    nav: 'stack', hero: 'center', cards: 'rows', gallery: 'grid',
  },
  business: {
    name: 'Oakline Legal and Tax', tagline: 'Law and accounting for families and small business', phone: '(555) 010-0167', email: 'office@youradvisor.com',
    address: '14 Court Street, Suite 200, Your Town', hours: ['Mon to Fri: 9am to 5pm', 'Evenings by appointment', 'Closed weekends'], cta: 'Schedule a consultation',
  },
  home: {
    eyebrow: 'Law and accounting',
    headline: 'Clear advice on the legal and money questions that keep you up at night.',
    sub: 'We help families and small businesses with wills, contracts, taxes and the books. Plain answers, fair fees and no jargon.',
    ctaPrimary: 'Schedule a consultation', ctaSecondary: 'Our services',
    proof: [{ n: '20 yrs', l: 'combined experience' }, { n: '600+', l: 'clients served' }, { n: '1 day', l: 'typical reply time' }],
    featureTitle: 'How we work with you',
    features: [
      { title: 'Plain language', text: 'We explain every step so you know what you are signing.' },
      { title: 'Fixed fees', text: 'Many services have a flat price quoted before we begin.' },
      { title: 'One office', text: 'Legal and tax help under one roof, so your advisers talk to each other.' },
      { title: 'Prompt replies', text: 'Calls and emails are answered within one working day.' },
    ],
    bandTitle: 'Start with a 30 minute consultation.', bandText: 'Bring your questions and any papers you have. We will tell you what comes next.',
  },
  services: {
    title: 'Our services', intro: 'Legal, tax and bookkeeping support for individuals and small businesses.',
    items: [
      { title: 'Wills and estates', text: 'Wills, trusts, powers of attorney and estate planning.' },
      { title: 'Business formation', text: 'Choosing an entity, filing papers and drafting agreements.' },
      { title: 'Contracts', text: 'Drafting and review for leases, vendors and customers.' },
      { title: 'Tax preparation', text: 'Personal and business returns, filed on time.' },
      { title: 'Bookkeeping', text: 'Monthly books, payroll support and clear reports.' },
      { title: 'Real estate closings', text: 'Help with buying, selling and refinancing a home.' },
    ],
    bandTitle: 'Not sure which service you need? Ask us.',
  },
  about: {
    title: 'Advisers you can call', intro: 'Oakline was founded to give small clients the attention large firms save for big ones.',
    body: ['Our attorney and accountant share an office and a calendar. When your question touches both law and taxes, you get one answer instead of two.', 'We keep our client list small on purpose, so you speak with the same person every time.'],
    valuesTitle: 'What guides our work',
    values: [
      { title: 'Integrity', text: 'We tell you the truth, even when it is not the easy answer.' },
      { title: 'Privacy', text: 'Your records and your story stay confidential.' },
      { title: 'Clarity', text: 'No legal jargon, no hidden costs.' },
      { title: 'Care', text: 'We treat your concerns as the priority they are.' },
    ],
  },
  gallery: {
    title: 'Our office', intro: 'A look at where we meet and the community we serve.',
    items: [{ label: 'Front office' }, { label: 'Meeting room' }, { label: 'Reading library' }, { label: 'Client seating' }, { label: 'Tax season desk' }, { label: 'Courthouse view' }],
  },
  contact: { title: 'Schedule a consultation', intro: 'Share a few details and we will reply within one working day. Please do not send private documents through this form.', formLabel: 'How can we help?', send: 'Send my request' },
}
