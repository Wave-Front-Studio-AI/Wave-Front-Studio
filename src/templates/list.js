// The 15 $1 Website templates. Each is a design style any business can use. The slug is the preview URL
// (/1-dollar-website/<slug>/) and the folder of the live demo site (public/demos/templates/<slug>/).
export const TEMPLATES = [
  { slug: 'atlas', name: 'Atlas', style: 'Bold and corporate' },
  { slug: 'linen', name: 'Linen', style: 'Soft and elegant' },
  { slug: 'volt', name: 'Volt', style: 'Dark and modern' },
  { slug: 'meadow', name: 'Meadow', style: 'Fresh and friendly' },
  { slug: 'grid', name: 'Grid', style: 'Swiss editorial' },
  { slug: 'harbor', name: 'Harbor', style: 'Calm and coastal' },
  { slug: 'ember', name: 'Ember', style: 'Warm and cinematic' },
  { slug: 'frame', name: 'Frame', style: 'Minimal gallery' },
  { slug: 'heritage', name: 'Heritage', style: 'Classic and trusted' },
  { slug: 'pop', name: 'Pop', style: 'Bright and playful' },
  { slug: 'slate', name: 'Slate', style: 'Industrial' },
  { slug: 'bloom', name: 'Bloom', style: 'Luxury boutique' },
  { slug: 'pulse', name: 'Pulse', style: 'Energetic' },
  { slug: 'horizon', name: 'Horizon', style: 'Photo led' },
  { slug: 'nordic', name: 'Nordic', style: 'Scandinavian minimal' },
]

export const templateBySlug = Object.fromEntries(TEMPLATES.map((template) => [template.slug, template]))

// Where each template's live demo and its gallery screenshot live.
export const demoUrl = (slug) => `/demos/templates/${slug}/`
export const thumbUrl = (slug) => `/images/templates/${slug}.webp`
