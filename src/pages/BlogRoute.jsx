import { BlogIndex, BlogPost } from './Longform.jsx'
import { postBySlug } from '../data/generated/posts.js'

export default function BlogRoute({ kind, slug }) {
  if (kind === 'blog') return <BlogIndex />
  return <BlogPost post={postBySlug[slug]} />
}
