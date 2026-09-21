import Layout from '../components/Layout.jsx'
import { legalDescriptions } from '../data/seo.js'

// Pre-cleaned HTML from the content pipeline, styled by the .longform rules.
function Prose({ html }) {
  return <div className="longform" dangerouslySetInnerHTML={{ __html: html }} />
}

/* ------------------------------------------------------------------ */
/* Legal                                                               */
/* ------------------------------------------------------------------ */

export function LegalPage({ page }) {
  return (
    <Layout
      className="legal-page"
      seo={{
        title: `${page.title} | Wavefront Studio LLC`,
        description: legalDescriptions[page.slug] || page.description,
        canonical: `/${page.slug}/`,
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <h1>{page.title}</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <Prose html={page.content.replace(/<h1>[\s\S]*?<\/h1>/, '')} />
        </div>
      </section>
    </Layout>
  )
}
