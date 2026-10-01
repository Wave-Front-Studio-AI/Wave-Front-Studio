import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { contact, primaryNav } from '../data/site.js'

export default function NotFound() {
  return (
    <Layout className="notfound-page" seo={{ title: 'Page not found | Wavefront Studio', description: 'That page could not be found.' }}>
      <section className="page-hero">
        <div className="page-frame">
          <h1>That page has moved on.</h1>
          <p>The link is broken or the page no longer exists. Start again from the homepage, call us, or pick a page below.</p>
          <div className="hero-actions">
            <a className="kinetic-button group" href="/">
              <span>Go to the homepage</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </a>
            <a className="text-link" href={contact.phoneHref}>
              Or call {contact.phone} <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="related-links">
            {primaryNav.flatMap((item) => [
              ...(item.href ? [[item.label, item.href]] : []),
              ...(item.children || []),
              ...(item.secondary?.links || []),
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
