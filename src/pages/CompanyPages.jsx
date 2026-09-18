import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, EnquiryForm, FaqAccordion, OfferingList, SectionHeading, SupportCallout, Testimonials } from '../components/shared.jsx'
import { contact, offerings, projects, siteOrigin } from '../data/site.js'
import { siteFaqs as faqItems } from '../data/faqs.js'
import { breadcrumbs, pageGraph } from '../data/seo.js'

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutPage() {
  return (
    <Layout
      className="about-page"
      seo={{
        title: 'About Wavefront Studio, a Web and SEO Studio in Sarasota',
        description:
          'Wavefront Studio is a four-person web, SEO and AI studio in Sarasota, Florida, building websites and tools for local and remote clients.',
        canonical: '/about/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <h1>A four-person web studio in Sarasota</h1>
          <p>We build websites, SEO, AI chatbots and custom tools for businesses that need their site to bring in work.</p>
        </div>
      </section>

      <section className="about-chapter chapter">
        <div className="page-frame studio-grid">
          <div>
            <h2>What we have built</h2>
            <div className="prose">
              <p>
                For ResinRock, a resin-bound surfacing company, we built more than 12 connected websites, the material calculators on
                them, and the system that sends each enquiry to the nearest available installer. We also took their main site onto the
                first page of Google for its core industry searches.
              </p>
              <p>
                We are small, so the person you talk to is one of the people doing the work. We also look after sites once they are
                live: updates, fixes, SEO and new features as the business changes.
              </p>
            </div>
            <div className="about-actions">
              <a className="kinetic-button group" href="/portfolio/">
                <span>See the work</span>
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
              <dt>Team</dt>
              <dd>Four people</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={contact.emailHref}>{contact.email}</a>
              </dd>
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

      <section className="offerings-chapter chapter">
        <div className="page-frame">
          <SectionHeading title="What we build" />
          <OfferingList items={offerings} />
        </div>
      </section>

      <CtaBand
        title="Want to talk about a project?"
        copy="Call the studio or send a message. You will speak to someone who would work on it."
        label="Get in touch"
      />
    </Layout>
  )
}

/* ------------------------------------------------------------------ */
/* Portfolio                                                           */
/* ------------------------------------------------------------------ */

export function PortfolioPage() {
  return (
    <Layout
      className="portfolio-page"
      seo={{
        title: 'Our Work & Portfolio | Wavefront Studio LLC',
        description: 'Websites, lead routing and SEO work Wavefront Studio has built for clients, with links to the live sites.',
        canonical: '/portfolio/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <h1>Work we have built for clients</h1>
          <p>Every project below is live. Follow the link to see it working.</p>
        </div>
      </section>

      <section className="projects-chapter chapter">
        <div className="page-frame">
          <div className="project-list">
            {projects.map((project) => (
              <article key={project.title} className="project-row">
                <div className="project-row-media">
                  <img src={project.image} alt={project.alt} loading="lazy" style={project.focus ? { '--focus': project.focus } : undefined} />
                </div>
                <div className="project-row-body">
                  <h2>{project.title}</h2>
                  <p>{project.portfolio}</p>
                  <dl>
                    <div>
                      <dt>Client</dt>
                      <dd>{project.client}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>{project.date}</dd>
                    </div>
                  </dl>
                  <a className="text-link" href={project.href} target="_blank" rel="noreferrer noopener">
                    Visit the site <ArrowIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CtaBand
        title="Have a project like these?"
        copy="Tell us about it and we will say how we would approach it."
        label="Start a project"
      />
    </Layout>
  )
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export function ContactPage() {
  return (
    <Layout
      className="contact-page"
      seo={{
        title: 'Contact Wavefront Studio | Free Consultation',
        description: 'Call, email or message Wavefront Studio in Sarasota, Florida. We reply within one to two working days.',
        canonical: '/contact/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <h1>Contact the studio</h1>
          <p>Tell us what you are working on. We reply within one to two working days.</p>
        </div>
      </section>

      <section className="contact-chapter chapter">
        <div className="page-frame contact-grid">
          <div className="contact-details">
            <SectionHeading title="Studio details" align="stack" />
            <p className="contact-lede">Skip the form if you prefer. Any of these reaches the same four people.</p>
            <ul className="contact-list">
              <li>
                <span>Address</span>
                <a href={contact.maps} target="_blank" rel="noreferrer noopener">
                  {contact.address}
                </a>
              </li>
              <li>
                <span>Email</span>
                <a href={contact.emailHref}>{contact.email}</a>
              </li>
              <li>
                <span>Phone</span>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </li>
              <li>
                <span>Instagram</span>
                <a href={contact.instagram} target="_blank" rel="noreferrer noopener">
                  @wavefrontstudio
                </a>
              </li>
            </ul>
          </div>

          <div className="contact-form-shell">
            <EnquiryForm heading="Send a message" copy="A few lines about the business and what you need is enough to start." source="contact" />
          </div>
        </div>
      </section>

      <CtaBand
        title="Prefer to talk it through?"
        copy="Call the studio and speak to the team that would actually do the work."
        label="Call Wavefront"
        href={contact.phoneHref}
      />
    </Layout>
  )
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export function FaqsPage() {
  const schema = pageGraph(
    {
      '@type': 'FAQPage',
      '@id': `${siteOrigin}/faqs/#faq`,
      url: `${siteOrigin}/faqs/`,
      mainEntity: faqItems.map(([name, text]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text },
      })),
    },
    breadcrumbs([['Home', '/'], ['FAQs', '/faqs/']]),
  )

  return (
    <Layout
      className="faqs-page"
      seo={{
        title: 'Frequently Asked Questions | Wavefront Studio LLC',
        description: 'Answers to the questions clients usually ask Wavefront Studio before a project starts.',
        canonical: '/faqs/',
        schema,
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <h1>Frequently asked questions</h1>
          <p>What clients usually ask before a project starts.</p>
        </div>
      </section>

      <FaqAccordion
        items={faqItems}
        heading={{
          title: 'Common questions',
          copy: `If yours is not here, call ${contact.phone} or send us a message.`,
        }}
      />

      <CtaBand
        title="Still have a question?"
        copy="Tell us what you are trying to do and we will tell you honestly whether we are the right fit."
        label="Contact us"
      />
    </Layout>
  )
}

export { siteOrigin }
