export default {
  slug: 'paws-and-co',
  name: 'Paws & Co',
  industry: 'Pet care and grooming',
  theme: {
    mood: 'light', bg: '#fffaf4', surface: '#fde9d6', ink: '#3a2418', muted: '#6b5446', line: '#f1d4b8',
    accent: '#b5421c', accentInk: '#ffffff', font: 'rounded', headFont: 'rounded', radius: 28,
    nav: 'center', hero: 'split', cards: 'cards', gallery: 'strip',
  },
  business: {
    name: 'Paws & Co', tagline: 'Grooming, daycare and walks', phone: '(555) 010-0234', email: 'woof@yourpetcare.com',
    address: '14 Bone Lane, Your Town', hours: ['Mon to Fri: 7am to 6pm', 'Sat: 8am to 3pm', 'Closed Sundays'], cta: 'Book a groom',
  },
  home: {
    eyebrow: 'Grooming, daycare and dog walking',
    headline: 'Happy, clean pets and owners who can relax.',
    sub: 'We groom, walk and play with your pets like they are our own. Book a visit and meet the team.',
    ctaPrimary: 'Book a groom', ctaSecondary: 'Our services',
    proof: [{ n: '900+', l: 'pets groomed' }, { n: '7 days', l: 'walks available' }, { n: 'Small', l: 'play groups' }],
    featureTitle: 'Why pets love it here',
    features: [
      { title: 'Gentle handling', text: 'Calm, patient groomers who go at your pet\'s pace.' },
      { title: 'Small play groups', text: 'Dogs are matched by size and energy for safe play.' },
      { title: 'Photo updates', text: 'We send you a picture so you know they are happy.' },
      { title: 'Clean and safe', text: 'Pet safe cleaners and fresh water all day.' },
    ],
    bandTitle: 'First visit? Ask about our trial day.', bandText: 'Come meet us and let your pet check out the place.',
  },
  services: {
    title: 'Pet care services', intro: 'Everything your dog or cat needs, in one friendly spot.',
    items: [
      { title: 'Full grooming', text: 'Bath, haircut, nails and ears for any breed.' },
      { title: 'Bath and brush', text: 'A quick clean and fluff between full grooms.' },
      { title: 'Doggy daycare', text: 'Full or half days of play, naps and cuddles.' },
      { title: 'Dog walking', text: 'Midday walks so your dog is not alone all day.' },
      { title: 'Pet sitting', text: 'We visit your home to feed and cuddle your pets.' },
      { title: 'Nail trims', text: 'Walk in nail trims, no appointment needed.' },
    ],
    bandTitle: 'Have a nervous pet? Tell us and we will go slow.',
  },
  about: {
    title: 'Pet people, through and through', intro: 'A small team of animal lovers with pets of our own.',
    body: ['Paws & Co started in a spare room with one grooming table. We grew because people trusted us with their best friends.', 'Every pet gets to know us before the first groom, and we keep notes on what each pet likes and what makes them nervous.'],
    valuesTitle: 'Our promises',
    values: [
      { title: 'Safety first', text: 'Never rushed, never left alone on the table.' },
      { title: 'Be kind', text: 'No harsh words and no force, ever.' },
      { title: 'Keep you posted', text: 'Updates and pictures during the day.' },
      { title: 'Know your pet', text: 'We remember names, habits and favorite treats.' },
    ],
  },
  gallery: {
    title: 'Our happy customers', intro: 'A few of the faces we see every week.',
    items: [{ label: 'Fresh trim' }, { label: 'Playtime' }, { label: 'Bath day' }, { label: 'Nap time' }, { label: 'Park walk' }, { label: 'Puppy cut' }, { label: 'Cat cuddles' }, { label: 'Treat break' }],
  },
  contact: { title: 'Book a visit', intro: 'Tell us about your pet and we will find a time that works.', formLabel: 'What is your pet\'s name, breed and what do they need?', send: 'Request a time' },
}
