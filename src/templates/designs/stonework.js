export default {
  slug: 'stonework',
  name: 'Stonework',
  industry: 'Concrete and masonry',
  theme: {
    mood: 'dark', bg: '#1b1d1f', surface: '#26292c', ink: '#f2f1ec', muted: '#b4b4ad', line: '#3b3f43',
    accent: '#facc15', accentInk: '#1b1d1f', font: 'sans', headFont: 'impact', radius: 0,
    nav: 'bar', hero: 'center', cards: 'icons', gallery: 'mosaic',
  },
  business: {
    name: 'Stonework Concrete and Masonry', tagline: 'Built to last', phone: '(555) 010-0245', email: 'jobs@yourconcrete.com',
    address: '500 Quarry Road, Your Town', hours: ['Mon to Fri: 6am to 4pm', 'Sat: by appointment', 'Pours start early'], cta: 'Get a concrete quote',
  },
  home: {
    eyebrow: 'Concrete, brick and stone',
    headline: 'Driveways, patios and walls poured right the first time.',
    sub: 'We pour, finish and build with concrete, brick and block. Solid prep, honest prices and work that holds up through winter.',
    ctaPrimary: 'Get a concrete quote', ctaSecondary: 'See our work',
    proof: [{ n: '500+', l: 'jobs poured' }, { n: '15 yrs', l: 'on the trowel' }, { n: 'Free', l: 'on site estimates' }],
    featureTitle: 'What sets our jobs apart',
    features: [
      { title: 'Prep that lasts', text: 'Proper base, forms and rebar before a single yard goes in.' },
      { title: 'Clear estimates', text: 'Size, mix and price written down before we start.' },
      { title: 'Clean finish', text: 'Smooth, broom or stamped, edged and cut for cracks.' },
      { title: 'On schedule', text: 'We tell you the pour day and we hit it.' },
    ],
    bandTitle: 'Planning a pour? Get the price first.', bandText: 'We come out, measure and send a written estimate.',
  },
  services: {
    title: 'Concrete and masonry services', intro: 'New work, repairs and replacements.',
    items: [
      { title: 'Driveways', text: 'New pours and tear out and replace, with a proper base.' },
      { title: 'Patios and walkways', text: 'Broom, stamped or colored finishes.' },
      { title: 'Retaining walls', text: 'Block and poured walls built to hold the slope.' },
      { title: 'Steps and porches', text: 'Poured or brick steps with solid footings.' },
      { title: 'Foundations and slabs', text: 'Garages, sheds and additions.' },
      { title: 'Repairs', text: 'Cracks, sunken slabs and crumbling brick fixed.' },
    ],
    bandTitle: 'Not sure what your slab needs? We will take a look.',
  },
  about: {
    title: 'Hard work, solid results', intro: 'A family crew that has been pouring and laying stone for years.',
    body: ['We learned the trade from the ground up and we still do the work ourselves. You will see the owner on your job, not just the paperwork.', 'Concrete is permanent, so we take our time on the parts you will not see: the base, the forms and the steel.'],
    valuesTitle: 'How we build',
    values: [
      { title: 'Do it once', text: 'Prep and finish done properly the first time.' },
      { title: 'Be on site', text: 'The owner is on your job every day.' },
      { title: 'Price it plainly', text: 'One written price with no hidden extras.' },
      { title: 'Leave it clean', text: 'Forms pulled, debris hauled and the yard raked.' },
    ],
  },
  gallery: {
    title: 'Finished work', intro: 'Some of the pours and walls we have built.',
    items: [{ label: 'Stamped patio' }, { label: 'Broom finish drive' }, { label: 'Block retaining wall' }, { label: 'Brick steps' }, { label: 'Garage slab' }, { label: 'Walkway' }, { label: 'Stone veneer' }, { label: 'Pool deck' }],
  },
  contact: { title: 'Get a concrete quote', intro: 'Tell us about the job and we will set up a time to measure.', formLabel: 'What do you want poured or built, and about how big?', send: 'Send my request' },
}
