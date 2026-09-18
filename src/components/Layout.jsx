import { useEffect } from 'react'
import ChatAgent from './ChatAgent.jsx'
import Navigation from './Navigation.jsx'
import SiteFooter from './SiteFooter.jsx'
import SitePopups from './SitePopups.jsx'
import { siteOrigin } from '../data/site.js'
import { pageGraph, webPage } from '../data/seo.js'
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

    // The prerendered page already carries this script under the same id, so it
    // is updated in place. Appending a second copy would hand search engines
    // two identical blocks, which Search Console reports as duplicate FAQPage.
    let script = document.getElementById('route-jsonld')
    if (schema) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'route-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      const text = JSON.stringify(schema).replace(/</g, '\\u003c')
      if (script.textContent !== text) script.textContent = text
    } else {
      script?.remove()
    }
  }, [title, description, canonical, schema])
}

// Whole sections rise in once as they reach the viewport. Only blocks that
// start below the fold are hidden, so nothing on the first screen flashes in,
// and nothing is hidden at all without JavaScript or with reduced motion.
const REVEAL_SELECTOR = [
  '.section-head',
  '.work-grid',
  '.offering-groups',
  '.process-timeline',
  '.studio-grid',
  '.testimonial-grid',
  '.hub-list',
  '.point-list',
  '.tick-list.is-columns',
  '.plan-grid',
  '.project-row',
  '.service-approach-media',
  '.service-deliver-media',
  '.faq-list',
].join(',')

function useSectionReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined
    const pending = [...document.querySelectorAll(REVEAL_SELECTOR)].filter((node) => node.getBoundingClientRect().top > window.innerHeight)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    for (const node of pending) {
      node.classList.add('will-reveal')
      observer.observe(node)
    }
    return () => observer.disconnect()
  }, [])
}

export default function Layout({ children, className = '', seo = {} }) {
  // A page without structured data of its own still describes itself as a page
  // of this site, so every URL carries the business entity.
  const page = seo.schema !== undefined || !seo.canonical
    ? seo
    : { ...seo, schema: pageGraph(webPage({ path: seo.canonical, name: seo.title, description: seo.description })) }

  // Server render only: hand the values to the prerenderer, which writes them
  // into the static <head>. In the browser useSeo does the same job via effects.
  if (typeof window === 'undefined') ssrSeo.current = page
  useSeo(page)
  useSectionReveal()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main className={`site-main ${className}`} id="main">
        {children}
      </main>
      <SiteFooter />
      <SitePopups />
      <ChatAgent />
    </>
  )
}
