export default {
  slug: 'harbor-dental',
  name: 'Harbor Dental',
  industry: 'Dental and medical',
  theme: {
    mood: 'light', bg: '#fbfefe', surface: '#eaf6f6', ink: '#12313a', muted: '#4e6a72', line: '#cfe5e6',
    accent: '#0b727b', accentInk: '#ffffff', font: 'rounded', headFont: 'rounded', radius: 28,
    nav: 'center', hero: 'center', cards: 'icons', gallery: 'grid',
  },
  business: {
    name: 'Harbor Dental', tagline: 'Gentle family dentistry', phone: '(555) 010-0178', email: 'smile@yourdentist.com',
    address: '45 Bayview Avenue, Your Town', hours: ['Mon to Thu: 8am to 5pm', 'Fri: 8am to 1pm', 'Closed weekends'], cta: 'Book a visit',
  },
  home: {
    eyebrow: 'Now welcoming new patients',
    headline: 'Dental care that feels calm from the front desk to the chair.',
    sub: 'Checkups, cleanings and treatment for the whole family, with clear prices and no surprises.',
    ctaPrimary: 'Book a visit', ctaSecondary: 'Our services',
    proof: [{ n: '4.9', l: 'average patient rating' }, { n: 'Same week', l: 'urgent appointments' }, { n: 'All ages', l: 'welcome' }],
    featureTitle: 'What to expect',
    features: [
      { title: 'No rush', text: 'Longer visits so we can explain things properly.' },
      { title: 'Plain pricing', text: 'We go over costs and insurance before treatment.' },
      { title: 'Modern tools', text: 'Digital x-rays use far less radiation than film.' },
      { title: 'Anxiety friendly', text: 'Tell us what helps and we will work around it.' },
    ],
    bandTitle: 'Due for a checkup?', bandText: 'Most new patients are seen within two weeks.',
  },
  services: {
    title: 'Our services', intro: 'General, cosmetic and emergency care under one roof.',
    items: [
      { title: 'Checkups and cleanings', text: 'Exam, cleaning and a plan you understand.' },
      { title: 'Fillings and crowns', text: 'Tooth colored materials that last.' },
      { title: 'Whitening', text: 'Professional whitening in a single visit or at home.' },
      { title: 'Children', text: 'Gentle first visits and sealants for growing teeth.' },
      { title: 'Emergency care', text: 'Broken or aching teeth seen as soon as we can.' },
      { title: 'Clear aligners', text: 'Straighter teeth without metal brackets.' },
    ],
    bandTitle: 'Questions about a treatment? Ask us.',
  },
  about: {
    title: 'Meet the practice', intro: 'A small team that remembers your name.',
    body: ['We built the practice around one idea: dental visits should not be something to dread.', 'Our team has served this community for years, and many of our patients bring their children and parents.'],
    valuesTitle: 'Our promise',
    values: [{ title: 'Listen first', text: 'Your concerns shape the plan.' }, { title: 'Explain everything', text: 'Pictures and plain words.' }, { title: 'Respect your time', text: 'We keep to the schedule.' }, { title: 'Keep it clean', text: 'Hospital grade sterilization.' }],
  },
  gallery: {
    title: 'Inside the practice', intro: 'A bright, quiet space.',
    items: [{ label: 'Reception' }, { label: 'Treatment room' }, { label: 'Waiting area' }, { label: 'Kids corner' }, { label: 'Our team' }, { label: 'Smile results' }],
  },
  contact: { title: 'Book an appointment', intro: 'Send a request and we will call to confirm a time.', formLabel: 'How can we help?', send: 'Request a visit' },
}
