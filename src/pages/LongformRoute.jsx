import { BlogIndex, BlogPost, LegalPage, LocationPage, LocationsPage } from './Longform.jsx'
import { locationBySlug } from '../data/generated/locations.js'
import { legalBySlug } from '../data/generated/legal.js'
import { postBySlug } from '../data/generated/posts.js'

export default function LongformRoute({ kind, slug }) {
  if (kind === 'blog') return <BlogIndex />
  if (kind === 'locations') return <LocationsPage />
  if (kind === 'location') return <LocationPage location={locationBySlug[slug]} />
  if (kind === 'legal') return <LegalPage page={legalBySlug[slug]} />
  return <BlogPost post={postBySlug[slug]} />
}
