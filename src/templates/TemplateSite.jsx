// Renders one $1 Website template as a small five page site: Home, Services, About, Gallery, Contact.
// A template is a plain object (see src/templates/designs/*.js). The look comes from `theme`:
//
//   theme: {
//     mood: 'light' | 'dark'                       page tone; colours below are the whole palette
//     bg, surface, ink, muted, line, accent, accentInk
//     font, headFont: 'sans' | 'serif' | 'rounded' | 'slab' | 'display' | 'impact' | 'mono'
//     radius: 0 | 6 | 14 | 28                       corner size in px
//     nav:  'bar' | 'center' | 'stack'             logo left with links right, everything centred, or logo above links
//     hero: 'split' | 'center' | 'overlay' | 'band' | 'left'
//     cards: 'cards' | 'rows' | 'icons' | 'lines'  how the services list is drawn
//     gallery: 'grid' | 'mosaic' | 'strip'
//   }
//
// There are no photos in a template. The gallery uses coloured tiles with a label, and the hero uses shapes.
// For a customer we replace the text and the tiles with their own words and photos.
import { useId } from 'react'

export const PAGES = [
  ['home', 'Home'],
  ['services', 'Services'],
  ['about', 'About'],
  ['gallery', 'Gallery'],
  ['contact', 'Contact'],
]

const FONTS = {
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  serif: 'Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif',
  rounded: 'ui-rounded, "SF Pro Rounded", "Trebuchet MS", "Nunito", system-ui, sans-serif',
  slab: 'Rockwell, "Roboto Slab", "Courier New", Georgia, serif',
  display: '"Outfit", system-ui, sans-serif',
  impact: 'Impact, "Haettenschweiler", "Arial Narrow Bold", "Arial Black", sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
}

// A tile's colour comes from the accent, rotated a little for each of the five tones so a gallery is not one flat colour.
const TONES = [0, 1, 2, 3, 4]

function themeStyle(theme) {
  return {
    '--t-bg': theme.bg,
    '--t-surface': theme.surface,
    '--t-ink': theme.ink,
    '--t-muted': theme.muted,
    '--t-line': theme.line,
    '--t-accent': theme.accent,
    '--t-accent-ink': theme.accentInk,
    '--t-radius': `${theme.radius}px`,
    '--t-font': FONTS[theme.font] || FONTS.sans,
    '--t-head': FONTS[theme.headFont || theme.font] || FONTS.sans,
  }
}

function Logo({ business }) {
  return (
    <span className="tpl-logo">
      <span className="tpl-logo-mark" aria-hidden="true">
        {business.name.trim()[0]}
      </span>
      <span>{business.name}</span>
    </span>
  )
}

function Button({ children, onClick, ghost = false }) {
  return (
    <button type="button" className={`tpl-btn${ghost ? ' ghost' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

function HeroArt({ tone }) {
  // Three plain shapes in the accent colour stand in for a photo.
  return (
    <div className={`tpl-art tone-${tone}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

function Home({ t, go }) {
  const { home, business, theme } = t
  const copy = (
    <div className="tpl-hero-copy">
      {home.eyebrow ? <p className="tpl-eyebrow">{home.eyebrow}</p> : null}
      <h2 className="tpl-h1">{home.headline}</h2>
      <p className="tpl-sub">{home.sub}</p>
      <div className="tpl-actions">
        <Button onClick={() => go('contact')}>{home.ctaPrimary}</Button>
        {home.ctaSecondary ? (
          <Button ghost onClick={() => go('services')}>
            {home.ctaSecondary}
          </Button>
        ) : null}
      </div>
    </div>
  )
  return (
    <>
      <section className={`tpl-hero hero-${theme.hero}`}>
        {copy}
        {theme.hero === 'center' || theme.hero === 'band' ? null : <HeroArt tone={1} />}
      </section>
      <section className="tpl-proof" aria-label="At a glance">
        {home.proof.map((item) => (
          <div key={item.l}>
            <b>{item.n}</b>
            <span>{item.l}</span>
          </div>
        ))}
      </section>
      <section className="tpl-block">
        <h2>{home.featureTitle}</h2>
        <ul className="tpl-features">
          {home.features.map((feature) => (
            <li key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="tpl-cta-band">
        <h2>{home.bandTitle}</h2>
        <p>{home.bandText}</p>
        <Button onClick={() => go('contact')}>{business.cta}</Button>
      </section>
    </>
  )
}

function Services({ t, go }) {
  const { services, business, theme } = t
  return (
    <>
      <header className="tpl-page-head">
        <h2 className="tpl-h1">{services.title}</h2>
        <p>{services.intro}</p>
      </header>
      <ul className={`tpl-services cards-${theme.cards}`}>
        {services.items.map((item, index) => (
          <li key={item.title}>
            <span className="tpl-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.price ? <p className="tpl-price">{item.price}</p> : null}
            </div>
          </li>
        ))}
      </ul>
      <section className="tpl-cta-band">
        <h2>{services.bandTitle}</h2>
        <Button onClick={() => go('contact')}>{business.cta}</Button>
      </section>
    </>
  )
}

function About({ t }) {
  const { about } = t
  return (
    <>
      <header className="tpl-page-head">
        <h2 className="tpl-h1">{about.title}</h2>
        <p>{about.intro}</p>
      </header>
      <section className="tpl-about">
        <div>
          {about.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <HeroArt tone={3} />
      </section>
      <section className="tpl-block">
        <h2>{about.valuesTitle}</h2>
        <ul className="tpl-features">
          {about.values.map((value) => (
            <li key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function Gallery({ t }) {
  const { gallery, theme } = t
  return (
    <>
      <header className="tpl-page-head">
        <h2 className="tpl-h1">{gallery.title}</h2>
        <p>{gallery.intro}</p>
      </header>
      <ul className={`tpl-gallery gal-${theme.gallery}`}>
        {gallery.items.map((item, index) => (
          <li key={item.label} className={`tone-${TONES[(item.tone ?? index) % TONES.length]}`}>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <p className="tpl-note">Your own photos go here.</p>
    </>
  )
}

function Contact({ t }) {
  const { contact, business } = t
  const id = useId()
  return (
    <>
      <header className="tpl-page-head">
        <h2 className="tpl-h1">{contact.title}</h2>
        <p>{contact.intro}</p>
      </header>
      <section className="tpl-contact">
        <form onSubmit={(event) => event.preventDefault()} aria-label="Sample contact form">
          <label htmlFor={`${id}-n`}>Name</label>
          <input id={`${id}-n`} type="text" autoComplete="off" placeholder="Your name" />
          <label htmlFor={`${id}-e`}>Email</label>
          <input id={`${id}-e`} type="email" autoComplete="off" placeholder="you@example.com" />
          <label htmlFor={`${id}-m`}>{contact.formLabel}</label>
          <textarea id={`${id}-m`} rows="4" />
          <button type="submit" className="tpl-btn">
            {contact.send}
          </button>
          <small>This is a sample. Your live form sends enquiries to you.</small>
        </form>
        <aside>
          <h3>{business.name}</h3>
          <p>{business.address}</p>
          <p>{business.phone}</p>
          <p>{business.email}</p>
          <h3>Hours</h3>
          {business.hours.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </aside>
      </section>
    </>
  )
}

const VIEWS = { home: Home, services: Services, about: About, gallery: Gallery, contact: Contact }

export default function TemplateSite({ template, page = 'home', onPage }) {
  const View = VIEWS[page] || Home
  const { theme, business } = template
  const go = (next) => onPage?.(next)
  return (
    <div className={`tpl mood-${theme.mood} nav-${theme.nav} radius-${theme.radius}`} style={themeStyle(theme)} data-template={template.slug}>
      <header className="tpl-nav">
        <button type="button" className="tpl-brand" onClick={() => go('home')} aria-label={`${business.name} home`}>
          <Logo business={business} />
        </button>
        <nav aria-label="Sample site pages">
          {PAGES.map(([id, label]) => (
            <button key={id} type="button" className={id === page ? 'on' : ''} aria-current={id === page ? 'page' : undefined} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="tpl-main">
        <View t={template} go={go} />
      </main>
      <footer className="tpl-foot">
        <span>{business.name}</span>
        <span>{business.phone}</span>
        <span>{business.tagline}</span>
      </footer>
    </div>
  )
}

// A small card for the gallery: the template's own colours, fonts and headline, without the rest of the site.
export function TemplateThumb({ template }) {
  const { theme, business, home } = template
  return (
    <div className={`tpl tpl-thumb mood-${theme.mood} radius-${theme.radius}`} style={themeStyle(theme)} aria-hidden="true">
      <div className="tpl-thumb-bar">
        <span className="tpl-logo-mark">{business.name.trim()[0]}</span>
        <i />
        <i />
        <i />
      </div>
      <div className="tpl-thumb-hero">
        <b>{home.headline}</b>
        <span className="tpl-btn">{business.cta}</span>
      </div>
      <div className={`tpl-art tone-1 tpl-thumb-art`}>
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
