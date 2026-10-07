import Layout from '../components/Layout.jsx'
import { Breadcrumbs, CtaBand } from '../components/shared.jsx'
import { Prose } from './Longform.jsx'
import { guides } from '../data/guides.js'
import { absoluteUrl, breadcrumbs, byOrganization, pageGraph, webPage } from '../data/seo.js'

// The guide pages (src/data/guides.js): the AI search pillar and the website
// cost guide. They reuse the article layout and the .longform styles
// so they read like the posts they link to, but they are pages, not posts: their
// own route kind, their own copy files, and no blog byline or card image.
export default function GuidePage({ slug }) {
  const { guide, seo: guideSeo } = guides[slug]
  const trail = [['Home', '/'], [guide.title, guide.path]]
  const schema = pageGraph(
    webPage({
      path: guide.path,
      name: guide.title,
      description: guideSeo.description,
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
        ...guideSeo,
        canonical: guide.path,
        schema,
        modified: guide.modified,
      }}
    >
      <section className="article-hero">
        <div className="page-frame">
          <Breadcrumbs trail={trail} />
          <p className="article-meta">
            <span>{guide.metaLabel}</span>
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
        title={guide.cta.title}
        copy={guide.cta.copy}
        label={guide.cta.label}
        secondary={guide.cta.secondary}
      />
    </Layout>
  )
}
