import Layout from '../components/Layout.jsx'
import { Breadcrumbs, CtaBand } from '../components/shared.jsx'
import { Prose } from './Longform.jsx'
import { aiSearchGuide as guide } from '../data/aiSearchGuide.js'
import { absoluteUrl, aiSearchGuideSeo, breadcrumbs, byOrganization, pageGraph, webPage } from '../data/seo.js'

// The AI search pillar. It reuses the article layout and the .longform styles
// so it reads like the guides it links to, but it is a page, not a post: its
// own route kind, its own copy file, and no blog byline or card image.
export default function GuidePage() {
  const trail = [['Home', '/'], [guide.title, guide.path]]
  const schema = pageGraph(
    webPage({
      path: guide.path,
      name: guide.title,
      description: aiSearchGuideSeo.description,
      datePublished: guide.published,
      dateModified: guide.modified,
      publisher: byOrganization,
      breadcrumb: { '@id': `${absoluteUrl(guide.path)}#breadcrumb` },
    }),
    { ...breadcrumbs(trail), '@id': `${absoluteUrl(guide.path)}#breadcrumb` },
  )

  return (
    <Layout
      className="blog-post guide-page"
      seo={{
        ...aiSearchGuideSeo,
        canonical: guide.path,
        schema,
        modified: guide.modified,
      }}
    >
      <section className="article-hero">
        <div className="page-frame">
          <Breadcrumbs trail={trail} />
          <p className="article-meta">
            <span>
              Sources checked {guide.checked}
            </span>
            <span>Wavefront Studio</span>
          </p>
          <h1>{guide.title}</h1>
          <p>{guide.excerpt}</p>
        </div>
      </section>

      <article className="article-body">
        <div className="page-frame">
          <Prose html={guide.content} />
        </div>
      </article>

      <CtaBand
        title="Want this done for your business?"
        copy="Tell us what you sell and where, and we will tell you what we would fix first."
        label="Start Your Project"
      />
    </Layout>
  )
}
