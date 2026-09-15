import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, Reveal, SectionHeading } from '../components/shared.jsx'
import { PlaceLinks, liveLocations, liveStates, placeName } from './PlacePage.jsx'
import { posts } from '../data/generated/posts.js'
import { locationsHub } from '../data/generated/locations.js'
import { publishDates } from '../data/schedule.js'
import {
  absoluteUrl,
  blogSeo,
  breadcrumbs,
  byOrganization,
  legalDescriptions,
  locationsHubTitle,
  pageGraph,
  postShareImage,
  webPage,
  withBrand,
} from '../data/seo.js'

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
  const newest = posts.reduce((latest, post) => (post.date > latest ? post.date : latest), '')
  const schema = pageGraph(
    {
      '@type': 'Blog',
      '@id': `${absoluteUrl('/blog/')}#blog`,
      url: absoluteUrl('/blog/'),
      name: 'Wavefront Studio Blog',
      description: blogSeo.description,
      publisher: byOrganization,
      inLanguage: 'en-US',
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: absoluteUrl(`/${post.slug}/`),
        datePublished: post.date,
      })),
    },
    breadcrumbs([['Home', '/'], ['Blog', '/blog/']]),
  )

  return (
    <Layout
      className="blog-index"
      seo={{ ...blogSeo, canonical: '/blog/', schema, modified: newest }}
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
                  {post.image ? (
                    // Decorative: the title sits beside it, so an alt text here
                    // would only repeat what a screen reader is about to read.
                    <img
                      className="post-row-image"
                      src={post.image}
                      alt=""
                      width="1200"
                      height="630"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ) : null}
                  <div className="post-row-body">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <span className="text-link">
                      Read the article <ArrowIcon />
                    </span>
                  </div>
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
  const url = absoluteUrl(canonical)
  const modified = post.updated || post.date
  const schema = pageGraph(
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: modified,
      url,
      mainEntityOfPage: url,
      author: byOrganization,
      publisher: byOrganization,
      isPartOf: { '@id': `${absoluteUrl('/blog/')}#blog` },
      inLanguage: 'en-US',
      ...(post.image ? { image: absoluteUrl(post.image) } : {}),
    },
    breadcrumbs([['Home', '/'], ['Blog', '/blog/'], [post.title, canonical]]),
  )

  return (
    <Layout
      className="blog-post"
      seo={{
        title: withBrand(post.title),
        description: post.excerpt,
        canonical,
        schema,
        ogType: 'article',
        published: post.date,
        modified,
        image: postShareImage(post),
      }}
    >
      <section className="article-hero">
        <div className="page-frame">
          <a className="text-link back-link" href="/blog/">
            <span aria-hidden="true">←</span> All articles
          </a>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          {post.image ? (
            // Below the title rather than behind it: the cards vary in contrast,
            // and text over them would be a legibility gamble on every post.
            <img
              className="article-banner"
              src={post.image}
              alt=""
              width="1200"
              height="630"
              loading="eager"
              decoding="async"
            />
          ) : null}
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
/* Locations hub                                                       */
/* ------------------------------------------------------------------ */

export function LocationsPage() {
  // National city guides are the scheduled location pages; the local and
  // remote-metro pages are already described in the hub copy above them.
  const remoteCities = liveLocations.filter((item) => item.slug in publishDates)
  const guides = [
    ...liveStates.map((item) => ({ slug: item.slug, name: item.state })),
    ...remoteCities.map((item) => ({ slug: item.slug, name: placeName(item.title) })),
  ]
  const schema = pageGraph(
    webPage({
      type: 'CollectionPage',
      path: '/locations/',
      name: locationsHub.title,
      description: locationsHub.description,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: liveLocations.length + liveStates.length,
        itemListElement: [...liveLocations, ...liveStates].map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: absoluteUrl(`/${item.slug}/`),
        })),
      },
    }),
    breadcrumbs([['Home', '/'], ['Where We Work', '/locations/']]),
  )

  return (
    <Layout
      className="locations-page"
      seo={{ title: locationsHubTitle, description: locationsHub.description, canonical: '/locations/', schema }}
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

      <PlaceLinks
        eyebrow="Further afield"
        title="State and city guides."
        copy="Places we serve remotely from Sarasota. Each guide starts from that market’s own census numbers and what they mean for a small business website."
        items={guides}
      />

      <CtaBand
        title="Not sure how you rank in your city right now?"
        copy="We will audit your site for free and tell you what is actually holding it back — including if the answer is that you do not need a rebuild."
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
      seo={{
        title: `${page.title} | Wavefront Studio LLC`,
        description: legalDescriptions[page.slug] || page.description,
        canonical: `/${page.slug}/`,
      }}
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
