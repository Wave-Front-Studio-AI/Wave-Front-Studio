import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, Reveal, SectionHeading } from '../components/shared.jsx'
import { posts } from '../data/generated/posts.js'
import { locations, locationsHub } from '../data/generated/locations.js'
import { siteOrigin } from '../data/site.js'

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

// The article body arrives as pre-cleaned HTML from the content pipeline, so it
// is inserted directly and styled by the .longform rules.
function Prose({ html }) {
  return <div className="longform" dangerouslySetInnerHTML={{ __html: html }} />
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export function BlogIndex() {
  return (
    <Layout
      className="blog-index"
      seo={{
        title: 'Blog | Wavefront Studio LLC',
        description: 'Practical writing on websites, SEO, marketing and automation for businesses that want the work to pay for itself.',
        canonical: '/blog/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">Our Blogs</span>
          <h1>Blog</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="post-list">
            {posts.map((post, index) => (
              <Reveal as="article" key={post.slug} delay={index * 60} className="post-row">
                <a href={`/${post.slug}/`}>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="text-link">
                    Read the article <ArrowIcon />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Rather talk than read?"
        copy="Tell us what is slowing your business down and we will tell you what we would fix first."
        label="Contact Us"
      />
    </Layout>
  )
}

export function BlogPost({ post }) {
  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const canonical = `/${post.slug}/`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${siteOrigin}${canonical}`,
    author: { '@type': 'Organization', name: 'Wavefront Studio LLC' },
    publisher: { '@type': 'Organization', name: 'Wavefront Studio LLC', logo: { '@type': 'ImageObject', url: `${siteOrigin}/wave-logo.png` } },
  }

  return (
    <Layout className="blog-post" seo={{ title: `${post.title} | Wavefront Studio`, description: post.excerpt, canonical, schema }}>
      <section className="article-hero">
        <div className="page-frame">
          <a className="text-link back-link" href="/blog/">
            <span aria-hidden="true">←</span> All articles
          </a>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>

      <article className="article-body">
        <div className="page-frame">
          <Prose html={post.content} />
        </div>
      </article>

      {others.length ? (
        <section className="chapter related-chapter">
          <div className="page-frame">
            <SectionHeading eyebrow="Keep reading" title="More from the blog." />
            <div className="post-cards">
              {others.map((item) => (
                <a key={item.slug} href={`/${item.slug}/`}>
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  <strong>{item.title}</strong>
                  <span className="text-link">
                    Read <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Want this done for your business?"
        copy="Tell us your goals – we’ll handle the rest."
        label="Start Your Project"
      />
    </Layout>
  )
}

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export function LocationsPage() {
  return (
    <Layout
      className="locations-page"
      seo={{ title: `${locationsHub.title} | Wavefront Studio`, description: locationsHub.description, canonical: '/locations/' }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">Where We Work</span>
          <h1>{locationsHub.title}</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <Prose html={locationsHub.content} />
        </div>
      </section>

      <CtaBand
        title="Not sure how you rank in your city right now?"
        copy="We will audit your site for free and tell you what is actually holding it back — including if the answer is that you do not need a rebuild."
        label="Get a free audit"
      />
    </Layout>
  )
}

export function LocationPage({ location }) {
  const canonical = `/${location.slug}/`
  const others = locations.filter((item) => item.slug !== location.slug)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: location.title,
    description: location.description,
    url: `${siteOrigin}${canonical}`,
    isPartOf: { '@type': 'WebSite', name: 'Wavefront Studio', url: `${siteOrigin}/` },
  }

  return (
    <Layout
      className="location-page"
      seo={{ title: `${location.title} | Wavefront Studio`, description: location.description, canonical, schema }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <a className="text-link back-link" href="/locations/">
            <span aria-hidden="true">←</span> Where we work
          </a>
          <h1>{location.title}</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <Prose html={location.content} />
        </div>
      </section>

      <section className="chapter related-chapter">
        <div className="page-frame">
          <SectionHeading eyebrow="Other markets" title="Everywhere else we work." />
          <div className="related-links">
            {others.map((item) => (
              <a key={item.slug} href={`/${item.slug}/`}>
                {item.title.replace(/^Web Design (?:&|and) SEO (?:for|in) /, '')}
                <ArrowIcon />
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Tell us what you are trying to do."
        copy="We will tell you honestly whether we are the right fit — and what we would fix first."
        label="Get a free audit"
      />
    </Layout>
  )
}

/* ------------------------------------------------------------------ */
/* Legal                                                               */
/* ------------------------------------------------------------------ */

export function LegalPage({ page }) {
  return (
    <Layout
      className="legal-page"
      seo={{ title: `${page.title} | Wavefront Studio LLC`, description: page.description, canonical: `/${page.slug}/` }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <span className="eyebrow">Legal</span>
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
