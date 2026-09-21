import { useRef } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, OfferingList, SectionHeading, SupportCallout, Testimonials } from '../components/shared.jsx'
import { clientLogos, contact, offerings, projects } from '../data/site.js'
import { byOrganization, homeSeo, pageGraph, webPage } from '../data/seo.js'

// A real sequence, so it keeps its numbers. Each step restates what the studio
// already publishes about its process; nothing here is a new promise.
const howWeWork = [
  {
    title: 'We talk about the business first',
    copy: 'Tell us what you sell, who buys it and what the site has to do. We ask questions until we understand how an enquiry turns into work for you, then plan around that.',
  },
  {
    title: 'We design and build it',
    copy: 'You see previews while it comes together, so you can change direction before anything goes live rather than after.',
  },
  {
    title: 'We launch and stay on',
    copy: 'Nothing goes live until you sign it off. After launch we handle updates, fixes and SEO, so the site keeps up as the business changes.',
  },
]

// Client logos scroll in one continuous row, faded at both edges. The list is
// drawn four times so the loop stays seamless on wide screens; the copies are
// hidden from screen readers and keyboard focus. Pointing at the row slows it so a logo is easy to click.
function LogoMarquee({ logos }) {
  const track = useRef(null)
  const setSpeed = (rate) => track.current?.getAnimations().forEach((animation) => {
    animation.playbackRate = rate
  })
  const item = (logo, round) => {
    const copy = round > 0
    return (
      <li className={`client-logo ${logo.className || ''}`} key={`${logo.src}-${round}`} aria-hidden={copy || undefined}>
        <a href={logo.href} target="_blank" rel="noreferrer noopener" tabIndex={copy ? -1 : undefined}>
          <img src={logo.src} width={logo.width} height={logo.height} alt={copy ? '' : `${logo.alt.replace(/ company logo$/, '')} website`} loading="lazy" />
        </a>
      </li>
    )
  }
  return (
    <div className="logo-marquee" onMouseEnter={() => setSpeed(0.25)} onMouseLeave={() => setSpeed(1)} onFocus={() => setSpeed(0)} onBlur={() => setSpeed(1)}>
      <ul className="client-logos" ref={track}>
        {[0, 1, 2, 3].flatMap((round) => logos.map((logo) => item(logo, round)))}
      </ul>
    </div>
  )
}

export default function Home() {
  // The organization and website nodes come with every page's graph.
  const schema = pageGraph(webPage({ path: '/', name: homeSeo.title, description: homeSeo.description, about: byOrganization }))

  return (
    <Layout className="home-page" seo={{ ...homeSeo, canonical: '/', schema }}>
      <section className="hero-section">
        <div className="page-frame hero-grid">
          <div className="hero-copy">
            <h1>Web design, SEO and AI tools for Sarasota businesses</h1>
            <p>
              Wavefront Studio is four people in Sarasota, Florida. We build websites, local SEO, AI chatbots and quote calculators for
              businesses across Sarasota, Manatee and Tampa Bay, and we work remotely with clients further away. We judge a site by the
              enquiries it brings in.
            </p>
            <div className="hero-actions">
              <a className="kinetic-button group" href="/contact/">
                <span>Start a project</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <a className="text-link" href="/free-audit/">
                Or get a free site audit <ArrowIcon />
              </a>
            </div>
          </div>
          <figure className="hero-work">
            <img
              className="hero-work-desktop"
              src="/images/work/resinrock-site.webp"
              srcSet="/images/work/resinrock-site-760.webp 760w, /images/work/resinrock-site.webp 1440w"
              sizes="(max-width: 900px) 100vw, 640px"
              alt="The ResinRock homepage in a desktop browser"
              width="1440"
              height="900"
              loading="eager"
              fetchPriority="high"
            />
            <img
              className="hero-work-phone"
              src="/images/work/resinrock-site-mobile.webp"
              alt="The same ResinRock page on a phone"
              width="600"
              height="1298"
              loading="lazy"
            />
            <figcaption>resinrock.com, one of the 12+ connected sites we built for ResinRock.</figcaption>
          </figure>
        </div>
      </section>

      <section className="clients-strip" aria-labelledby="clients-heading">
        <div className="page-frame clients-inner">
          <h2 id="clients-heading">Businesses we build for</h2>
          <LogoMarquee logos={clientLogos} />
        </div>
      </section>

      <section className="projects-chapter chapter" id="work">
        <div className="page-frame">
          <SectionHeading title="Recent work" copy="Three recent projects. Each one links to the live site.">
            <a className="text-link" href="/portfolio/">
              All projects <ArrowIcon />
            </a>
          </SectionHeading>
          <div className="work-grid">
            {projects.map((project, index) => (
              <article className={`work-card ${index === 0 ? 'is-featured' : ''}`} key={project.title}>
                <a href={project.href} target="_blank" rel="noreferrer noopener">
                  <span className="work-media">
                    <img src={project.image} alt={project.alt} loading="lazy" style={project.focus ? { '--focus': project.focus } : undefined} />
                  </span>
                  <span className="work-body">
                    <h3>{project.title}</h3>
                    <p>{project.home}</p>
                    <span className="work-meta">
                      {project.client} · {project.date}
                    </span>
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="offerings-chapter chapter" id="services">
        <div className="page-frame">
          <SectionHeading
            title="What we build"
            copy="Take one thing or several. Prices for most of it are public, so you can see the cost before you call."
          >
            <a className="text-link" href="/package-builder/">
              See prices in the package builder <ArrowIcon />
            </a>
          </SectionHeading>
          <OfferingList items={offerings} />
        </div>
      </section>

      <section className="steps-chapter chapter">
        <div className="page-frame">
          <SectionHeading title="How a project runs" />
          <ol className="process-timeline">
            {howWeWork.map((step, index) => (
              <li key={step.title}>
                <span className="process-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="studio-chapter chapter">
        <div className="page-frame studio-grid">
          <div>
            <h2>Who you will work with</h2>
            <div className="prose">
              <p>
                There are four of us, working from Independence Court in Sarasota. The person on your first call is one of the people who
                builds your project, and the same people look after it once it is live.
              </p>
              <p>
                We build for businesses that need their website to produce enquiries: installers, contractors, suppliers and local service
                firms. Some are a short drive from the studio. Others we work with remotely.
              </p>
            </div>
            <div className="about-actions">
              <a className="kinetic-button group" href="/about/">
                <span>About the studio</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <SupportCallout />
            </div>
          </div>
          <dl className="studio-facts">
            <div>
              <dt>Studio</dt>
              <dd>
                <a href={contact.maps} target="_blank" rel="noreferrer noopener">
                  4363 Independence Ct, Sarasota, FL 34234
                </a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={contact.emailHref}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Replies</dt>
              <dd>Within one to two working days</dd>
            </div>
            <div>
              <dt>Where we work</dt>
              <dd>
                In person across Sarasota, Manatee and Tampa Bay. <a href="/locations/">Remotely everywhere else</a>.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Testimonials />

      <CtaBand
        title="Tell us what your website needs to do"
        copy="Call, email or use the contact form. You will hear back from someone in the studio within one to two working days."
        label="Start a project"
      />
    </Layout>
  )
}
