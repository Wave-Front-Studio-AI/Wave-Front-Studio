import { lazy } from 'react'

// Each kind of long page loads only its own content: a blog post does not
// download every city guide, and a city guide does not download the blog.
const BlogRoute = lazy(() => import('./BlogRoute.jsx'))
const PlaceRoute = lazy(() => import('./PlaceRoute.jsx'))
const LegalRoute = lazy(() => import('./LegalRoute.jsx'))

export default function LongformRoute({ kind, slug }) {
  if (kind === 'locations' || kind === 'location' || kind === 'state') return <PlaceRoute kind={kind} slug={slug} />
  if (kind === 'legal') return <LegalRoute slug={slug} />
  return <BlogRoute kind={kind} slug={slug} />
}
