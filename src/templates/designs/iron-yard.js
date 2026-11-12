export default {
  slug: 'iron-yard',
  name: 'Iron Yard',
  industry: 'Gym and fitness',
  theme: {
    mood: 'dark', bg: '#0f1012', surface: '#1a1c1f', ink: '#f4f4f2', muted: '#a8abb0', line: '#2e3136',
    accent: '#e0252f', accentInk: '#ffffff', font: 'sans', headFont: 'impact', radius: 0,
    nav: 'bar', hero: 'left', cards: 'rows', gallery: 'strip',
  },
  business: {
    name: 'Iron Yard', tagline: 'Strength and conditioning gym', phone: '(555) 010-0133', email: 'train@yourgym.com',
    address: '88 Industrial Way, Your Town', hours: ['Mon to Fri: 5am to 10pm', 'Sat: 7am to 6pm', 'Sun: 8am to 4pm'], cta: 'Book a free session',
  },
  home: {
    eyebrow: 'Strength and conditioning',
    headline: 'Get stronger. Show up. We will take care of the rest.',
    sub: 'Real equipment, real coaches and a crowd that pushes you. Come in for a free session and see how it feels.',
    ctaPrimary: 'Book a free session', ctaSecondary: 'See classes',
    proof: [{ n: '400+', l: 'active members' }, { n: '30', l: 'classes each week' }, { n: '6am', l: 'first class starts' }],
    featureTitle: 'Built for people who train',
    features: [
      { title: 'Full free weights', text: 'Racks, platforms, dumbbells to 150 lb and plenty of plates.' },
      { title: 'Coached classes', text: 'Small groups, clear programming and a coach watching your form.' },
      { title: 'Personal training', text: 'One on one plans for strength, weight loss or getting back after injury.' },
      { title: 'Open late', text: 'Doors open early and close late, so you can train around your day.' },
    ],
    bandTitle: 'Your first session is free.', bandText: 'Bring a pair of sneakers and a water bottle. We handle the rest.',
  },
  services: {
    title: 'Training options', intro: 'Pick a class, train on your own or work with a coach.',
    items: [
      { title: 'Strength classes', text: 'Squat, press, pull and deadlift in a coached group of ten or fewer.' },
      { title: 'Conditioning', text: 'Fast, hard sessions that build engine and burn calories.' },
      { title: 'Personal training', text: 'A plan built around your goals, with a coach by your side.' },
      { title: 'Open gym', text: 'Full access to the floor, racks and cardio at your own pace.' },
      { title: 'Beginner program', text: 'Six weeks to learn the basic lifts and build a habit.' },
      { title: 'Nutrition coaching', text: 'Simple meal guidance that fits your schedule and budget.' },
    ],
    bandTitle: 'Not sure where to start? Book a free walkthrough.',
  },
  about: {
    title: 'A gym for people who work', intro: 'We built Iron Yard in an old warehouse with one rule: leave it better than you found it.',
    body: ['Our coaches have trained everyone from first timers to weekend athletes. We keep the room clean, the music reasonable and the equipment in good shape.', 'There are no mirrors full of selfies here. People come in, work hard and cheer each other on.'],
    valuesTitle: 'How we train',
    values: [
      { title: 'Show up', text: 'Consistency beats a perfect plan every time.' },
      { title: 'Good form first', text: 'We teach the movement before we add weight.' },
      { title: 'All levels', text: 'Every workout can be scaled to where you are today.' },
      { title: 'Community', text: 'You will know the faces around you by week two.' },
    ],
  },
  gallery: {
    title: 'Inside the yard', intro: 'The floor, the classes and the people.',
    items: [{ label: 'Lifting platforms' }, { label: 'Morning class' }, { label: 'Kettlebell rack' }, { label: 'Sled push' }, { label: 'Open gym' }, { label: 'Coach session' }, { label: 'Pull up rigs' }, { label: 'Team photo' }],
  },
  contact: { title: 'Book your free session', intro: 'Tell us your goals and we will set up a time that works this week.', formLabel: 'What are you training for?', send: 'Send my request' },
}
