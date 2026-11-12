export default {
  slug: 'copper-kettle',
  name: 'Copper Kettle',
  industry: 'Restaurant and cafe',
  theme: {
    mood: 'light', bg: '#fffaf3', surface: '#f6ebdc', ink: '#2b1a10', muted: '#6b5442', line: '#e6d5bf',
    accent: '#9a4a1c', accentInk: '#ffffff', font: 'sans', headFont: 'serif', radius: 14,
    nav: 'center', hero: 'overlay', cards: 'lines', gallery: 'grid',
  },
  business: {
    name: 'Copper Kettle', tagline: 'Coffee, breakfast and baked goods', phone: '(555) 010-0121', email: 'hello@yourcafe.com',
    address: '210 Oak Street, Your Town', hours: ['Mon to Fri: 6:30am to 3pm', 'Sat and Sun: 7am to 2pm', 'Closed on major holidays'], cta: 'See the menu',
  },
  home: {
    eyebrow: 'Coffee and breakfast, made fresh',
    headline: 'Good coffee, warm bread and a table with your name on it.',
    sub: 'We roast, bake and cook every morning. Stop in for a quick cup or stay for a long breakfast with friends.',
    ctaPrimary: 'See the menu', ctaSecondary: 'Find us',
    proof: [{ n: '12', l: 'pastries baked daily' }, { n: '7 days', l: 'open for breakfast' }, { n: '4.8', l: 'average guest rating' }],
    featureTitle: 'What people come back for',
    features: [
      { title: 'Fresh baked', text: 'Bread, scones and cinnamon rolls come out of the oven before we open.' },
      { title: 'Local beans', text: 'Our coffee comes from a roaster down the road and is ground to order.' },
      { title: 'Plenty of seats', text: 'Window tables, a big shared table and a quiet corner for laptops.' },
      { title: 'Catering', text: 'Coffee carts, breakfast trays and lunch boxes for your office or party.' },
    ],
    bandTitle: 'Hosting a meeting or a party?', bandText: 'Ask about catering trays and coffee service for groups of ten or more.',
  },
  services: {
    title: 'What we serve', intro: 'A short menu, done well. Ask about our daily specials.',
    items: [
      { title: 'Coffee and espresso', text: 'Drip, pour over, lattes and cold brew, with oat and whole milk.' },
      { title: 'Breakfast plates', text: 'Eggs your way, toast, potatoes and fruit, served until 11am.' },
      { title: 'Sandwiches and soup', text: 'Lunch from 11am: toasted sandwiches and a soup of the day.' },
      { title: 'Baked goods', text: 'Muffins, cookies, pies by the slice and whole cakes on order.' },
      { title: 'Catering', text: 'Trays, boxed lunches and coffee for events of any size.' },
      { title: 'Private tables', text: 'Reserve the back room for birthdays, showers and club meetings.' },
    ],
    bandTitle: 'Order ahead and skip the line.',
  },
  about: {
    title: 'A neighborhood kitchen', intro: 'We opened with one oven and a handful of recipes from our grandmothers.',
    body: ['Copper Kettle began as a weekend bake stand. People kept asking for more, so we found a corner with big windows and opened the doors.', 'Today a small team bakes, brews and serves every day. Most of our guests are regulars, and we know a lot of their orders by heart.'],
    valuesTitle: 'What we care about',
    values: [
      { title: 'Made from scratch', text: 'We bake and cook in house, every morning.' },
      { title: 'Local first', text: 'Eggs, milk and produce from farms nearby.' },
      { title: 'Friendly service', text: 'Come as you are. We will have your cup ready.' },
      { title: 'Fair prices', text: 'Good food that is easy on the wallet.' },
    ],
  },
  gallery: {
    title: 'From our kitchen', intro: 'A peek at the counter, the oven and the table.',
    items: [{ label: 'Morning latte' }, { label: 'Cinnamon rolls' }, { label: 'Breakfast plate' }, { label: 'Fresh bread' }, { label: 'Soup of the day' }, { label: 'Window seats' }, { label: 'Berry pie' }, { label: 'Cold brew' }],
  },
  contact: { title: 'Come say hello', intro: 'Ask about catering, reservations or a special order and we will reply the same day.', formLabel: 'How can we help?', send: 'Send message' },
}
