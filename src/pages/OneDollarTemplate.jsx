import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import { Breadcrumbs } from '../components/shared.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { TEMPLATES, demoUrl } from '../templates/list.js'
import NotFound from './NotFound.jsx'

const DEVICES = [
  ['desktop', 'Desktop'],
  ['tablet', 'Tablet'],
  ['phone', 'Phone'],
]

export default function OneDollarTemplate({ slug }) {
  const [device, setDevice] = useState('desktop')
  const index = TEMPLATES.findIndex((template) => template.slug === slug)
  if (index < 0) return <NotFound />
  const own = TEMPLATES[index]
  const previous = TEMPLATES[(index + TEMPLATES.length - 1) % TEMPLATES.length]
  const next = TEMPLATES[(index + 1) % TEMPLATES.length]

  return (
    <Layout
      className="one-dollar-preview"
      seo={{
        title: `${own.name} Website Template | Wavefront Studio`,
        description: `Preview the ${own.name} template, a ${own.style.toLowerCase()} five page website for any business. $1 to set up, then $99 a month hosting, 12 month minimum.`,
        canonical: `/1-dollar-website/${slug}/`,
      }}
    >
      <section className="one-dollar-bar">
        <div className="page-frame">
          <Breadcrumbs trail={[['Home', '/'], ['$1 Website', '/1-dollar-website/'], [own.name, `/1-dollar-website/${slug}/`]]} />
          <div className="one-dollar-bar-row">
            <div>
              <h1>
                {own.name}: {own.style}
              </h1>
              <p>A five page website that works for any business. Every name, photo and line of text here is a sample we replace with yours.</p>
            </div>
            <div className="one-dollar-bar-actions">
              <a className="kinetic-button group" href={`/1-dollar-website/?template=${slug}#start`}>
                <span>Use this template</span>
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
          <div className="one-dollar-toolbar">
            <div className="one-dollar-devices" role="group" aria-label="Preview size">
              {DEVICES.map(([id, label]) => (
                <button key={id} type="button" aria-pressed={device === id} onClick={() => setDevice(id)}>
                  {label}
                </button>
              ))}
            </div>
            <a className="one-dollar-open" href={demoUrl(slug)} target="_blank" rel="noopener">
              Open full screen <ArrowIcon className="size-4" />
            </a>
          </div>
          <div className={`one-dollar-frame is-${device}`}>
            <iframe src={`${demoUrl(slug)}index.html`} title={`${own.name} template preview`} />
          </div>
          <div className="one-dollar-about">
            <div>
              <h2>What comes with {own.name}</h2>
              <p>
                {own.name} is a full five page website: Home, Services, About, Gallery and Contact. It suits any business that sells a service, from trades and clinics to salons, shops and offices. Send us your details and we swap in your business name, services, photos, logo, colors and contact details, so it reads as yours from the first visit.
              </p>
            </div>
            <ul className="tick-list">
              <li>Works on phones, tablets and computers</li>
              <li>A contact form that sends enquiries to your email</li>
              <li>Hosting and a security certificate included</li>
              <li>$1 to set up, then $99 a month, 12 month minimum</li>
            </ul>
          </div>
          <nav className="one-dollar-pager" aria-label="More templates">
            <a href={`/1-dollar-website/${previous.slug}/`}>Previous: {previous.name}</a>
            <a href="/1-dollar-website/#designs">All 15 templates</a>
            <a href={`/1-dollar-website/${next.slug}/`}>Next: {next.name}</a>
          </nav>
        </div>
      </section>
    </Layout>
  )
}
