// The 15 $1 Website templates. The slug is the URL (/1-dollar-website/<slug>/) and the value the quote builder
// and the intake form carry. The full design of each lives in src/templates/designs/.
export const TEMPLATES = [
  { slug: 'ridgeline', name: 'Ridgeline', industry: 'Roofing and exteriors' },
  { slug: 'harbor-dental', name: 'Harbor Dental', industry: 'Dental and medical' },
  { slug: 'copper-kettle', name: 'Copper Kettle', industry: 'Restaurant and cafe' },
  { slug: 'iron-yard', name: 'Iron Yard', industry: 'Gym and fitness' },
  { slug: 'luna-salon', name: 'Luna', industry: 'Hair and beauty' },
  { slug: 'bluebird', name: 'Bluebird', industry: 'Plumbing and HVAC' },
  { slug: 'oakline', name: 'Oakline', industry: 'Law and accounting' },
  { slug: 'greenleaf', name: 'Greenleaf', industry: 'Landscaping and lawn care' },
  { slug: 'brightpath', name: 'Brightpath', industry: 'Cleaning services' },
  { slug: 'summit-realty', name: 'Summit', industry: 'Real estate' },
  { slug: 'paws-and-co', name: 'Paws & Co', industry: 'Pet care and grooming' },
  { slug: 'stonework', name: 'Stonework', industry: 'Concrete and masonry' },
  { slug: 'spark', name: 'Spark', industry: 'Electricians' },
  { slug: 'northside-auto', name: 'Northside Auto', industry: 'Auto repair and detailing' },
  { slug: 'willow-studio', name: 'Willow Studio', industry: 'Photography and creative' },
]

export const templateBySlug = Object.fromEntries(TEMPLATES.map((template) => [template.slug, template]))
