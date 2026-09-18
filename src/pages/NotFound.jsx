import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { primaryNav } from '../data/site.js'

export default function NotFound() {
  return (
    <Layout className="notfound-page" seo={{ title: 'Page not found | Wavefront Studio', description: 'That page could not be found.' }}>
      <section className="page-hero">
        <div className="page-frame">
          <h1>That page has moved on.</h1>
          <p>The link is broken or the page no longer exists. Here is everywhere else you can go.</p>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="related-links">
            {primaryNav.flatMap((item) => [
              ...(item.href ? [[item.label, item.href]] : []),
              ...(item.children || []),
            ]).map(([label, href]) => (
              <a key={href} href={href}>
                {label}
                <ArrowIcon />
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
