import Layout from '../components/Layout.jsx'
import { Breadcrumbs } from '../components/shared.jsx'
import { ONE_DOLLAR_TERMS_PATH, ONE_DOLLAR_TERMS_VERSION, extrasPriceList, termsSections } from '../data/oneDollarTerms.js'

// Stays live after the Black Friday deal ends: anyone who signed up still needs to read what they agreed to.
export default function OneDollarTerms() {
  const sections = termsSections()
  const prices = extrasPriceList()
  return (
    <Layout
      className="legal-page"
      seo={{
        title: '$1 Website Agreement | Wavefront Studio LLC',
        description: 'The terms of the $1 Website: $1 setup, $99 a month hosting, a 12 month minimum, and what costs extra.',
        canonical: ONE_DOLLAR_TERMS_PATH,
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <Breadcrumbs trail={[['Home', '/'], ['$1 Website', '/1-dollar-website/'], ['Agreement', ONE_DOLLAR_TERMS_PATH]]} />
          <h1>$1 Website Agreement</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="longform">
            <p>Version {ONE_DOLLAR_TERMS_VERSION}. Plain English, and it is the whole deal. Read it before you send the form.</p>
            {sections.map(([heading, paragraphs], index) => (
              <div key={heading}>
                <h2>{index + 1}. {heading}</h2>
                {paragraphs.map((text) => <p key={text}>{text}</p>)}
                {heading.startsWith('What is not included') ? (
                  <table className="one-dollar-prices">
                    <thead>
                      <tr><th scope="col">Service</th><th scope="col">Starting price</th></tr>
                    </thead>
                    <tbody>
                      {prices.map((row) => (
                        <tr key={row.id}><th scope="row">{row.name}</th><td>{row.from}</td></tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
            ))}
            <p><a href="/1-dollar-website/#start">Back to the $1 Website form</a></p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
