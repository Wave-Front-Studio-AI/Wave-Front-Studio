import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import VideoTranscript from '../components/VideoTranscript.jsx'
import FunnelStory from '../components/FunnelStory.jsx'
import { FaqAccordion, Stars, initials, useGoogleReviews } from '../components/shared.jsx'
import { contact, googleListingUrl, offerings } from '../data/site.js'
import { siteFaqs } from '../data/faqs.js'
import { byOrganization, homeSeo, pageGraph, webPage } from '../data/seo.js'

// The home page borrows its layout and motion from the brief the studio chose
// in October 2026 (modelled on realtimemarketing.com): a photo hero, sourced
// counters, a funnel, photo tiles, a routing diagram and a review slider.
// DESIGN.md records it as the one page allowed the louder effects and stock
// photography. Every figure and quote on it is still one the studio can back up,
// and it names no client in its own copy (Google reviews are shown as written).

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Blocks marked data-enter slide in from their side the first time they reach
// the viewport. Only blocks that start below the fold are hidden, and only once
// the page has hydrated, so the prerendered page and the first screen never
// wait on JavaScript to be visible.
function useEntrances(root) {
  useEffect(() => {
    if (reduceMotion() || !('IntersectionObserver' in window) || !root.current) return undefined
    const pending = [...root.current.querySelectorAll('[data-enter]')].filter((node) => node.getBoundingClientRect().top > window.innerHeight)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-entered')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    for (const node of pending) {
      node.classList.add('will-enter')
      observer.observe(node)
    }
    return () => observer.disconnect()
  }, [root])
}

// Counts from `from` to `to` once it scrolls into view. The server renders the
// final figure, so crawlers, no-JS visitors and reduced-motion users read the
// real number; the count only runs for a counter that starts below the fold.
function CountUp({ to, from = 0, prefix = '', suffix = '' }) {
  const node = useRef(null)
  const [value, setValue] = useState(to)
  useEffect(() => {
    const el = node.current
    if (!el || reduceMotion() || !('IntersectionObserver' in window) || el.getBoundingClientRect().top < window.innerHeight) return undefined
    let frame = 0
    // Same trigger as the entrance, so the count resets while its block is
    // still transparent and the real figure stays in place until then (for
    // print, and for anyone reading ahead).
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      setValue(from)
      const start = performance.now()
      const step = (now) => {
        const progress = Math.min(1, (now - start) / 1400)
        setValue(Math.round(from + (to - from) * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, { rootMargin: '0px 0px -12% 0px' })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, from])
  return (
    <span className="proof-number" ref={node}>
      <span aria-hidden="true">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {to}
        {suffix}
      </span>
    </span>
  )
}

// The site's pill button with an optional light that circles its edge.
// Anything that moves on its own stops within five seconds (WCAG 2.2.2), so the
// light goes round twice when the button first comes into view, then fades.
function useShineOnce(enabled) {
  const node = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!enabled || !node.current || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      setOn(true)
    })
    observer.observe(node.current)
    return () => observer.disconnect()
  }, [enabled])
  return [node, on]
}

function ActionButton({ href, children, tone = '', shine = false, className = '' }) {
  const [node, shining] = useShineOnce(shine)
  return (
    <a ref={node} className={`kinetic-button group ${tone} ${shine ? 'has-shine' : ''} ${shining ? 'is-shining' : ''} ${className}`.trim()} href={href}>
      {shine ? (
        <span className="button-shine" aria-hidden="true">
          <span />
        </span>
      ) : null}
      <span>{children}</span>
      <span className="button-island">
        <ArrowIcon className="size-4" />
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

// Each figure names its source next to it: the twelve-site project on the
// portfolio page, the live Google rating and the four-person studio.
const proof = [
  { count: { to: 12, suffix: '+' }, what: 'connected websites, built and run as one network', source: 'See the project', sourceHref: '/portfolio/' },
  { google: true, what: 'Google rating' },
  { count: { to: 4 }, what: 'people in Sarasota, and they do the work', source: 'The whole studio' },
]

// The rating as Google reports it. Its space is held while it loads, so the
// row does not move; the prerendered page says only where the reviews are.
function GoogleProof() {
  const google = useGoogleReviews()
  const rating = google?.rating
  return (
    <>
      <span className={`proof-number ${rating ? '' : 'is-waiting'}`} aria-hidden={rating ? undefined : true}>
        {rating ? rating.toFixed(1) : '0.0'}
      </span>
      <p>
        {rating
          ? `average rating on Google${google.count ? `, from ${google.count} review${google.count === 1 ? '' : 's'}` : ''}`
          : 'what clients say about us on Google'}
      </p>
      <small>
        <a href="#testimonials">Read the reviews</a>
      </small>
    </>
  )
}

const advantages = [
  ['You talk to the people building it', 'There are four of us. No account manager relaying notes to a developer you never meet.'],
  ['Every enquiry is traced', 'Forms, calls and chat feed one place, so you can see which page produced which lead.'],
  ['Speed to lead, built in', 'Lead routing alerts the right person straight away, so enquiries do not sit waiting.'],
  ['Prices you can see first', 'Most of what we build is priced in the package builder, before you speak to anyone.'],
]

// Photos behind the service tiles, the hero and the closing banner. All are
// from Unsplash under the Unsplash License (free for commercial use, no credit
// required), downloaded October 2026. Photo IDs, for the record:
// hero yluvXzbyqAU (Vitaly Gariev), banner qFSQFSmfZkA (Mina Rad),
// web 8qEB0fTe9Vw (Mohammad Rahmani), SEO c4aT8MfEzdw (Nathana Rebouças),
// chatbot mw6Onwg4frY (freestocks), lead capture _Ud30e6Z2SI (Jay Openiano),
// calculators JhevWHCbVyw (Towfiqu barbhuiya), visualiser Sj2Z2WVhhfc (Jakub Żerdzicki),
// marketing JKUTrJ4vK00 (Luke Chesser), social 0I21xHfgw0E (Julian),
// design g-pKprPg5yw (Tran Mau Tri Tam), apps sScmok4Iq1o (Balázs Kétyi).
const tileImages = {
  '/web-development/': '/images/home/tile-web.webp',
  '/seo-service/': '/images/home/tile-seo.webp',
  '/ai-chatbot/': '/images/home/tile-chatbot.webp',
  '/lead-capture/': '/images/home/tile-leads.webp',
  '/custom-calculators/': '/images/home/tile-calculators.webp',
  '/live-visualizer/': '/images/home/tile-visualiser.webp',
  '/digital-marketing/': '/images/home/tile-marketing.webp',
  '/social-media-strategy/': '/images/home/tile-social.webp',
  '/graphic-design/': '/images/home/tile-design.webp',
  '/mobile-app-development/': '/images/home/tile-apps.webp',
}

const tileIcons = {
  '/web-development/': <path d="M3 5h18v12H3zM3 9h18M9 21h6" />,
  '/seo-service/': <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM20 20l-4.8-4.8" />,
  '/ai-chatbot/': <path d="M4 5h16v11H9l-5 4ZM8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" />,
  '/lead-capture/': <path d="M4 5h16l-6 7.5V18l-4 2v-7.5Z" />,
  '/custom-calculators/': <path d="M6 3h12v18H6zM9 7h6M9 11h1M12 11h1M15 11v5M9 15h1M12 15h1" />,
  '/live-visualizer/': <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />,
  '/digital-marketing/': <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  '/social-media-strategy/': <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM17.5 6.5h.01" />,
  '/graphic-design/': <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z" />,
  '/mobile-app-development/': <path d="M7 2h10v20H7zM11 18h2" />,
}

const routeSources = ['Web form', 'Phone call', 'Chat']
const routeTargets = ['Installer', 'Sales team', 'Your CRM']

// A real sequence, so it keeps its numbers. Each step restates what the studio
// already publishes about its process; nothing here is a new promise.
const steps = [
  ['We talk about the business first', 'Tell us what you sell, who buys it and what the site has to do. We ask until we understand how an enquiry turns into work for you.'],
  ['A plan with a price', 'A short written plan: what to build or fix, in what order, and what it costs.'],
  ['We design and build it', 'You see previews while it comes together, so you can change direction before anything goes live.'],
  ['Launch, with tracking', 'Nothing goes live until you sign it off. From day one you can see which pages and channels bring enquiries.'],
  ['We stay on', 'Updates, fixes and SEO after launch, so the site keeps up as the business changes.'],
]

const pickFaq = (question) => siteFaqs.find(([q]) => q === question)

// The towns we visit in person, linked beside the FAQ that asks about them.
const nearby = [
  ['Sarasota', '/web-design-sarasota-fl/'],
  ['Bradenton', '/web-design-bradenton-fl/'],
  ['Lakewood Ranch', '/web-design-lakewood-ranch-fl/'],
  ['Tampa', '/web-design-tampa-fl/'],
  ['St. Petersburg', '/web-design-st-petersburg-fl/'],
]
const homeFaqs = [
  [
    'Will a small studio give my business proper attention?',
    'Yes. There are four of us, working from Independence Court in Sarasota. The person on your first call is one of the people who builds your project, and the same people look after it once it is live.',
  ],
  pickFaq('What platforms do you build websites on?'),
  pickFaq('How long does it take to build a website?'),
  pickFaq('Do you provide support after project delivery?'),
  [
    'Do you only work with Sarasota businesses?',
    'No. We meet clients in person across Sarasota, Manatee and Tampa Bay, and work remotely with businesses everywhere else. Calls, previews and sign-off all happen online, so distance changes nothing about the work.',
  ],
  [
    'How do we start?',
    'Call, email or use the contact form. Someone in the studio will reply within two working days.',
  ],
].filter(Boolean)

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

// The live Google rating beside the main action. Its line is reserved in the
// layout, so nothing moves when the rating arrives; if Google cannot be
// reached the line simply stays empty.
function HeroRating() {
  const google = useGoogleReviews()
  return (
    <p className="hero-rating">
      {google?.rating ? (
        <a href="#testimonials">
          <Stars rating={google.rating} />
          <strong>{google.rating.toFixed(1)}</strong> on Google
          {google.count ? <span>, from {google.count} review{google.count === 1 ? '' : 's'}</span> : null}
        </a>
      ) : null}
    </p>
  )
}

function Hero() {
  return (
    <section className="home-hero">
      {/* Decorative: the headline carries the meaning. This is the page's
          largest paint, so it loads first and at full priority. */}
      <img
        className="home-hero-photo"
        src="/images/home/hero.webp"
        srcSet="/images/home/hero-960.webp 960w, /images/home/hero.webp 1920w"
        sizes="100vw"
        alt=""
        width="1920"
        height="1080"
        loading="eager"
        fetchPriority="high"
      />
      <div className="page-frame">
        <div className="hero-copy">
          <h1>
            <span className="hero-line">Take command of every enquiry</span>
            <span className="sr-only">: </span>
            <span className="hero-sub">Web design, SEO and AI tools for Sarasota businesses</span>
          </h1>
          <p>
            Wavefront Studio is four people in Sarasota, Florida. We build websites, local SEO, AI chatbots and quote calculators for
            businesses across Sarasota, Manatee and Tampa Bay, and judge every site by the enquiries it brings in.
          </p>
          <div className="hero-actions">
            <ActionButton href="/contact/" tone="light" shine>
              Start a project
            </ActionButton>
            <a className="text-link on-dark" href="/free-website-audit/">
              Or get a free site audit <ArrowIcon />
            </a>
          </div>
          <HeroRating />
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="home-intro chapter">
      <div className="page-frame">
        <div className="home-intro-head" data-enter="up">
          <h2>A full service web studio for businesses that sell by enquiry</h2>
          <p>
            We build the website, get it found on Google and make sure every form, call and chat reaches the person who can answer it.
            One small team handles all three, so nothing falls between suppliers, and you can see what each piece cost and what it brought in.
          </p>
          <ActionButton href="/package-builder/" shine>
            See prices in the package builder
          </ActionButton>
        </div>
        <ul className="proof-row">
          {proof.map((item, index) => (
            <li key={item.what} data-enter={['left', 'up', 'right'][index]}>
              <span className="proof-plus" aria-hidden="true">+</span>
              {item.google ? (
                <GoogleProof />
              ) : (
                <>
                  <CountUp {...item.count} />
                  <p>{item.what}</p>
                  <small>{item.sourceHref ? <a href={item.sourceHref}>{item.source}</a> : item.source}</small>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Advantage() {
  return (
    <section className="home-advantage chapter">
      <div className="page-frame">
        <div className="home-center-head" data-enter="up">
          <h2>The Wavefront advantage</h2>
          <p>Every service sits somewhere on one path: from being found, to being chosen, to the enquiry landing with the right person.</p>
        </div>
        <FunnelStory />
        <ul className="advantage-cards">
          {advantages.map(([title, copy]) => (
            <li key={title} data-enter="up">
              <span className="advantage-tick" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m6.5 12.5 3.4 3.4 7.6-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServiceTiles() {
  const tiles = offerings.filter((item) => item.group !== 'start')
  const audit = offerings.find((item) => item.group === 'start')
  const sides = ['left', 'up', 'right']
  return (
    <section className="home-services chapter" id="services">
      <div className="page-frame">
        <div className="home-center-head" data-enter="up">
          <h2>Everything your website needs to win work</h2>
          <p>From the first search to the signed job. Prices for most of it are public in the package builder.</p>
        </div>
        <ul className="service-tiles">
          {tiles.map((item, index) => (
            <li key={item.href} className={index < 2 ? 'is-wide' : ''} data-enter={sides[index % 3]}>
              <a href={item.href}>
                {tileImages[item.href] ? <img src={tileImages[item.href]} alt="" width="800" height="534" loading="lazy" decoding="async" /> : null}
                <svg className="tile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {tileIcons[item.href]}
                </svg>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
                <span className="tile-more">
                  Overview <ArrowIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
        {audit ? (
          <aside className="tiles-audit" data-enter="up">
            <div>
              <h3>Not sure where to start?</h3>
              <p>{audit.copy}</p>
            </div>
            <ActionButton href={audit.href}>Get a free site audit</ActionButton>
          </aside>
        ) : null}
      </div>
    </section>
  )
}

function RouteDiagram() {
  const svg = useRef(null)
  // The dots run for a few seconds once the diagram is on screen, then stop and
  // fade (WCAG 2.2.2: nothing moves on its own for more than five seconds).
  useEffect(() => {
    const el = svg.current
    if (!el?.pauseAnimations || !('IntersectionObserver' in window)) return undefined
    el.pauseAnimations()
    let timer = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || reduceMotion()) return
      observer.disconnect()
      el.unpauseAnimations()
      timer = window.setTimeout(() => {
        el.pauseAnimations()
        el.classList.add('is-still')
      }, 4500)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  const rows = [80, 210, 340]
  const wires = [
    ...rows.map((y) => (y === 210 ? 'M150 210 L320 210' : `M150 ${y} C260 ${y} 250 210 320 210`)),
    ...rows.map((y) => (y === 210 ? 'M320 210 L490 210' : `M320 210 C390 210 380 ${y} 490 ${y}`)),
  ]
  const timing = [['2.6s', '0s'], ['2.2s', '0.7s'], ['2.8s', '1.3s'], ['2.6s', '1s'], ['2.2s', '1.6s'], ['2.8s', '0.4s']]
  return (
    <svg className="route-diagram" viewBox="0 0 640 420" role="img" aria-labelledby="route-title" ref={svg}>
      <title id="route-title">Website forms, phone calls and chat feed one lead system, which passes each enquiry to the nearest installer, the sales team or your CRM</title>
      {wires.map((d, index) => (
        <path key={d} id={`route-wire-${index}`} className="route-wire" d={d} />
      ))}
      {[...routeSources.map((label, index) => [label, 20, rows[index]]), ...routeTargets.map((label, index) => [label, 490, rows[index]])].map(([label, x, y]) => (
        <g key={label}>
          <rect className="route-node" x={x} y={y - 26} width="130" height="52" rx="12" />
          <text x={x + 65} y={y + 7} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}
      <circle className="route-hub" cx="320" cy="210" r="56" />
      <text x="320" y="204" textAnchor="middle" className="route-hub-label">Lead</text>
      <text x="320" y="228" textAnchor="middle" className="route-hub-label">system</text>
      <g className="route-dots">
        {timing.map(([dur, begin], index) => (
          <circle r="5" key={index}>
            <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
              <mpath href={`#route-wire-${index}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
    </svg>
  )
}

function Routing() {
  const facts = [
    ['Every channel, one inbox', 'Website forms, calls and chat arrive in the same place.'],
    ['Sent to the nearest person', 'An installer network we built routes each lead to the closest available installer.'],
    ['Nothing sorted by hand', 'No one forwards emails or copies details into a spreadsheet.'],
  ]
  return (
    <section className="home-routing chapter">
      <div className="page-frame routing-grid">
        <div>
          <div data-enter="left">
            <h2>Where your enquiries go after they click</h2>
            <p className="routing-lede">Most sites stop at the contact form. Ours carry the enquiry all the way to the person who can win the job.</p>
          </div>
          <ul className="routing-facts">
            {facts.map(([title, copy]) => (
              <li key={title} data-enter="left">
                <span className="advantage-tick" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m6.5 12.5 3.4 3.4 7.6-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ul>
          <a className="text-link on-dark" href="/lead-capture/">
            How lead capture works <ArrowIcon />
          </a>
        </div>
        <div data-enter="zoom">
          <RouteDiagram />
        </div>
      </div>
    </section>
  )
}

// Google reviews, one at a time, moved only by the visitor. Until
// /api/reviews/ answers (and in the prerendered page, or for good if Google
// cannot be reached) the card points to the Google listing instead.
function Reviews() {
  const google = useGoogleReviews()
  const live = google?.reviews?.length ? google.reviews : null
  const listing = google?.mapsUrl || googleListingUrl
  const slides = (live || []).map((review, reviewIndex) => ({
    key: `${reviewIndex}-${review.author}`, text: review.text, name: review.author, nameUrl: review.authorUrl, meta: review.when, photo: review.photo, rating: review.rating, url: review.url,
  }))
  const [index, setIndex] = useState(0)
  // Announce slide changes only once the visitor has used the controls, so
  // the Google reviews arriving after load are not read out unasked.
  const [moved, setMoved] = useState(false)
  const current = slides.length ? index % slides.length : 0
  const go = (step) => {
    setMoved(true)
    setIndex((current + step + slides.length) % slides.length)
  }

  const video = useRef(null)
  const [playing, setPlaying] = useState(false)
  const play = () => {
    setPlaying(true)
    video.current?.focus()
    video.current?.play().catch(() => setPlaying(false))
  }

  return (
    <section className="home-reviews chapter" id="testimonials">
      <div className="page-frame">
        <div className="home-center-head" data-enter="up">
          <a className="google-pill" href={listing} target="_blank" rel="noreferrer noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8Z" />
              <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2.1v2.8A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7H2.1a11 11 0 0 0 0 9.9Z" />
              <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4Z" />
            </svg>
            {google?.rating ? (
              <>
                <strong>{google.rating.toFixed(1)}</strong>
                <Stars rating={google.rating} />
                <span>
                  {google.count ? `${google.count} review${google.count === 1 ? '' : 's'} on Google` : 'on Google'}
                </span>
              </>
            ) : (
              <span>Read our reviews on Google</span>
            )}
          </a>
          <h2>When the work lands, our clients say so</h2>
          <p>Picked from our Google listing and shown word for word.</p>
        </div>

        <div className="reviews-grid">
          <div className="review-card" data-enter="left">
            <span className="review-mark" aria-hidden="true">“</span>
            {live ? (
              <>
                <div className="review-slides" aria-live={moved ? 'polite' : 'off'}>
                  {slides.map((slide, slideIndex) => (
                    <figure className={`review-slide ${slideIndex === current ? 'is-current' : ''}`} key={slide.key} aria-hidden={slideIndex !== current}>
                      {slide.rating ? <Stars rating={slide.rating} /> : null}
                      <blockquote>{slide.text}</blockquote>
                      <figcaption>
                        {slide.photo ? (
                          <img src={slide.photo} alt="" width="48" height="48" loading="lazy" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="testimonial-initials" aria-hidden="true">
                            {initials(slide.name)}
                          </span>
                        )}
                        <span>
                          {slide.nameUrl ? (
                            <a href={slide.nameUrl} target="_blank" rel="noreferrer noopener" tabIndex={slideIndex === current ? undefined : -1}>
                              {slide.name}
                            </a>
                          ) : (
                            <strong>{slide.name}</strong>
                          )}
                          <span>{slide.meta}</span>
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <div className="review-controls">
                  <button type="button" onClick={() => go(-1)} aria-label="Previous review">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next review">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                  <span className="review-count">
                    {current + 1} of {slides.length}
                  </span>
                  <a className="review-source" href={slides[current].url || listing} target="_blank" rel="noreferrer noopener">
                    Read on Google
                  </a>
                </div>
              </>
            ) : (
              <div className="review-empty">
                <p>Our clients&rsquo; reviews live on Google, word for word, where anyone can check them.</p>
                <a className="text-link" href={listing} target="_blank" rel="noreferrer noopener">
                  Read our Google reviews <ArrowIcon />
                </a>
              </div>
            )}
          </div>

          <div className="review-video-col">
            <figure className={`review-video ${playing ? 'is-playing' : ''}`} data-enter="right">
              <video ref={video} controls={playing} playsInline preload="none" width="1280" height="720" aria-label="Wavefront Studio explains how we build websites">
                <source src="/videos/web-development-ad.mp4" type="video/mp4" />
                <track kind="captions" src="/videos/web-development-ad.vtt" srcLang="en" label="English" />
              </video>
              {/* A poster attribute downloads with the page even when the video
                  does not; a lazy image waits until the section is near. */}
              {playing ? null : <img className="video-poster" src="/videos/web-development-poster.webp" alt="" width="1280" height="720" loading="lazy" decoding="async" />}
              {playing ? null : (
                <button type="button" className="video-play" onClick={play} aria-label="Play the video: how Wavefront builds websites">
                  <span>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              )}
              {playing ? null : <figcaption>How we build websites</figcaption>}
            </figure>
            <VideoTranscript video="/videos/web-development-ad.mp4" />
          </div>
        </div>

        <p className="google-attribution">
          {live ? (
            <>
              A selection of reviews from{' '}
              <a href={listing} target="_blank" rel="noreferrer noopener">
                Google Maps
              </a>
              , shown word for word.{' '}
            </>
          ) : null}
          {google?.writeReviewUrl ? (
            <a href={google.writeReviewUrl} target="_blank" rel="noreferrer noopener">
              Worked with us? Leave a review
            </a>
          ) : null}
        </p>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="home-process chapter" id="process">
      <div className="page-frame">
        <div className="home-center-head is-dark" data-enter="up">
          <h2>How a project runs</h2>
          <p>A roadmap built around your business, so nobody is guessing what happens next.</p>
        </div>
        <ol className="home-steps" data-enter="none">
          {steps.map(([title, copy], index) => (
            <li key={title}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}.</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <p className="home-center-link" data-enter="zoom">
          <ActionButton href="/contact/" tone="light" shine className="pulse-once">
            Start a project
          </ActionButton>
        </p>
      </div>
    </section>
  )
}

function FinalBanner() {
  return (
    <section className="home-final">
      <div className="page-frame">
        <div className="final-banner" data-enter="up">
          <img src="/images/home/banner.webp" alt="" width="1200" height="800" loading="lazy" decoding="async" />
          <div>
            <h2>Tell us what your website needs to do</h2>
            <p>Call, email or use the contact form. You will hear back from someone in the studio within two working days.</p>
            <div className="final-actions">
              <ActionButton href="/contact/" tone="light" shine>
                Start a project
              </ActionButton>
              <a className="text-link on-dark" href={contact.phoneHref}>
                Or call {contact.phone} <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  // The organization and website nodes come with every page's graph.
  const schema = pageGraph(webPage({ path: '/', name: homeSeo.title, description: homeSeo.description, about: byOrganization }))
  const root = useRef(null)
  useEntrances(root)

  return (
    <Layout className="home-page" seo={{ ...homeSeo, canonical: '/', schema }}>
      <div ref={root}>
        <Hero />
        <Intro />
        <Advantage />
        <ServiceTiles />
        <Routing />
        <Reviews />
        <Process />
        <FaqAccordion items={homeFaqs} heading={{ title: 'Questions people ask first', copy: 'Straight answers to what comes up on the first call.' }}>
          <ActionButton href="/contact/" shine className="faq-cta">
            Start a project
          </ActionButton>
          <p className="faq-places">
            We meet clients in person in{' '}
            {nearby.map(([name, href], index) => (
              <span key={href}>
                <a href={href}>{name}</a>
                {index < nearby.length - 2 ? ', ' : index === nearby.length - 2 ? ' and ' : '. '}
              </span>
            ))}
            <a href="/locations/">See every place we work</a>.
          </p>
        </FaqAccordion>
        <FinalBanner />
      </div>
    </Layout>
  )
}
