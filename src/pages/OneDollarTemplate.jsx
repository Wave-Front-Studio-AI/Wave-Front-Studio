import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import { Breadcrumbs } from '../components/shared.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import TemplateSite from '../templates/TemplateSite.jsx'
import { DESIGNS } from '../templates/designs/index.js'
import { TEMPLATES } from '../templates/list.js'
import NotFound from './NotFound.jsx'

export default function OneDollarTemplate({ slug }) {
  const [page, setPage] = useState('home')
  const design = DESIGNS[slug]
  const index = TEMPLATES.findIndex((template) => template.slug === slug)
  if (!design || index < 0) return <NotFound />
  const previous = TEMPLATES[(index + TEMPLATES.length - 1) % TEMPLATES.length]
  const next = TEMPLATES[(index + 1) % TEMPLATES.length]
  const own = TEMPLATES[index]

  return (
    <Layout
      className="one-dollar-preview"
      seo={{
        title: `${own.name} Website Design | Wavefront Studio`,
        description: `Preview the ${own.name} design for ${own.industry.toLowerCase()}. A five page site for $1 to set up, then $99 a month for hosting, 12 month minimum.`,
        canonical: `/1-dollar-website/${slug}/`,
      }}
    >
      <section className="one-dollar-bar">
        <div className="page-frame">
          <Breadcrumbs trail={[['Home', '/'], ['$1 Website', '/1-dollar-website/'], [own.name, `/1-dollar-website/${slug}/`]]} />
          <div className="one-dollar-bar-row">
            <div>
              <h1>
                {own.name}: {own.industry}
              </h1>
              <p>Click through the five pages. Every name, number and photo is a placeholder that we replace with yours.</p>
            </div>
            <div className="one-dollar-bar-actions">
              <a className="kinetic-button group" href={`/1-dollar-website/?template=${slug}#start`}>
                <span>Use this design</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <a className="text-link" href={`/package-builder/?template=${slug}`}>
                Add to a quote
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="one-dollar-stage">
        <div className="page-frame">
          <div className="one-dollar-frame">
            <TemplateSite template={design} page={page} onPage={setPage} />
          </div>
          <nav className="one-dollar-pager" aria-label="More designs">
            <a href={`/1-dollar-website/${previous.slug}/`}>Previous: {previous.name}</a>
            <a href="/1-dollar-website/#designs">All 15 designs</a>
            <a href={`/1-dollar-website/${next.slug}/`}>Next: {next.name}</a>
          </nav>
        </div>
      </section>
    </Layout>
  )
}
