import { useEffect } from 'react'
import ChatAgent from './ChatAgent.jsx'
import Navigation from './Navigation.jsx'
import SiteFooter from './SiteFooter.jsx'
import SitePopups from './SitePopups.jsx'
import VisualEffects from './VisualEffects.jsx'
import { siteOrigin } from '../data/site.js'
import { ssrSeo } from '../routeContext.js'

function upsertMeta(selector, create) {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = create()
    document.head.appendChild(node)
  }
  return node
}

// Keeps the document head in step with the client-side route. The build step
// writes the same values statically so crawlers see them without running JS.
export function useSeo({ title, description, canonical, schema }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      const meta = upsertMeta('meta[name="description"]', () => {
        const el = document.createElement('meta')
        el.setAttribute('name', 'description')
        return el
      })
      meta.setAttribute('content', description)
    }

    if (canonical) {
      const link = upsertMeta('link[rel="canonical"]', () => {
        const el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        return el
      })
      link.setAttribute('href', `${siteOrigin}${canonical}`)
    }

    document.querySelector('#route-jsonld')?.remove()
    if (schema) {
      const script = document.createElement('script')
      script.id = 'route-jsonld'
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
      return () => script.remove()
    }
    return undefined
  }, [title, description, canonical, schema])
}

export default function Layout({ children, className = '', seo }) {
  // Server render only: hand the values to the prerenderer, which writes them
  // into the static <head>. In the browser useSeo does the same job via effects.
  if (typeof window === 'undefined') ssrSeo.current = seo || {}
  useSeo(seo || {})
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main className={`site-main ${className}`} id="main">
        {children}
      </main>
      <VisualEffects />
      <SiteFooter />
      <SitePopups />
      <ChatAgent />
    </>
  )
}
