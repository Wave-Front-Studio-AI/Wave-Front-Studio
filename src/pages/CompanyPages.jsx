import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, Counter, EnquiryForm, FaqAccordion, Reveal, SectionHeading, SupportCallout, Testimonials } from '../components/shared.jsx'
import { contact, offerings, offeringsHeading, projects, siteOrigin } from '../data/site.js'
import { siteFaqs as faqItems } from '../data/faqs.js'

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutPage() {
  return (
    <Layout
      className="about-page"
      seo={{
        title: 'About Us – The Team Behind Wavefront Studio LLC',
        description:
          'Wavefront Studio is a full-service digital agency built for businesses that want more than just a website – they want results.',
        canonical: '/about/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">About Us</span>
          <h1>Helping you open windows of opportunity worldwide</h1>
        </div>
      </section>

      <section className="about-chapter chapter">
        <div className="page-frame service-split">
          <Reveal className="about-media has-badge">
            <img
              src="/images/young-web-designers-working-together-at-modern-office.webp"
              alt="young web designers working together at modern office"
              loading="lazy"
            />
            <div className="hero-badge">
              <span>Years</span>
              <strong>
                <Counter to={12} suffix="+" />
              </strong>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="About Us" title="The Digital Agency Behind Brands That Grow" align="stack" />
            <div className="prose">
              <p>
                Wavefront Studio is a full-service digital agency built for businesses that want more than just a website – they want
                results. We combine creative design, smart development, and data-driven strategy to help brands launch, grow, and
                dominate their market online.
              </p>
              <p>
                From building 12+ interconnected websites for ResinRock Industries to developing automated lead distribution systems and
                ranking clients on Google’s first page – our work speaks for itself. We don’t just follow trends – we build solutions
                that solve real business problems and deliver measurable impact.
              </p>
            </div>
            <div className="about-actions">
              <a className="kinetic-button group" href="/contact/">
                <span>Let’s Talk</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <SupportCallout />
            </div>
          </div>
        </div>
      </section>

      <section className="offerings-chapter chapter">
        <div className="page-frame">
          <SectionHeading eyebrow={offeringsHeading.eyebrow} title={offeringsHeading.title} />
          <div className="offering-grid">
            {offerings.map((item, index) => (
              <Reveal as="article" key={item.href} delay={index * 55} className="offering-card">
                <b>{String(index + 1).padStart(2, '0')}</b>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
                <a href={item.href}>
                  Learn More <ArrowIcon />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Let’s Build Something That Actually Grows Your Business"
        copy="We’re one conversation away from building something great together. Tell us your goals – we’ll handle the rest."
        label="Start Your Project"
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
        description:
          'Every project we deliver is built to perform – not just to impress. Explore our latest work across web development, AI automation, SEO, and custom digital tools.',
        canonical: '/portfolio/',
      }}
    >
      <section className="page-hero has-media">
        <div className="page-frame">
          <div className="page-hero-copy">
            <span className="eyebrow">Our Portfolio</span>
            <h1>Real Projects. Real Results. Built by Wavefront.</h1>
            <p>
              Every project we deliver is built to perform – not just to impress. Explore our latest work across web development, AI
              automation, SEO, and custom digital tools.
            </p>
            <a className="kinetic-button group" href="/contact/">
              <span>Let’s Build Yours</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </a>
          </div>
          <div className="page-hero-media">
            <img
              src="/images/young-man-talking-on-phone-at-home-office-and-take-care-of-baby.webp"
              alt="young man talking on phone at home office and take care of baby"
              loading="eager"
              fetchPriority="high"
            />
            <img
              src="/images/business-people-using-a-digital-tablet.webp"
              alt="business people using a digital tablet"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="tagline-strip">
        <div className="page-frame">
          <span>From Concept to Launch</span>
          <strong>Crafting by your imagination and our passion.</strong>
        </div>
      </section>

      <section className="projects-chapter chapter">
        <div className="page-frame">
          <SectionHeading
            eyebrow="What We’ve Built"
            title="Projects That Prove What We Can Do"
            copy="We don’t just talk about results – we show them. Browse our featured projects below to see how we’ve helped businesses grow with custom websites, smart automation, and powerful SEO strategies."
          />
          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal as="article" key={project.title} delay={index * 90} className="project-row">
                <div className="project-row-media">
                  <img src={project.image} alt={project.alt} loading="lazy" />
                </div>
                <div className="project-row-body">
                  <h3>{project.title}</h3>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CtaBand
        title="Like What You See? Let’s Build Yours Next."
        copy="Every great project starts with a simple conversation. Tell us your idea – we’ll handle the rest."
        label="Start Your Project"
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
        title: 'Contact Us – Get a Free Consultation | Wavefront Studio',
        description: 'Have a project in mind or just want to explore ideas? Reach out - we’d love to hear from you.',
        canonical: '/contact/',
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">Contact</span>
          <h1>Let’s Start a Conversation</h1>
          <p>Have a project in mind or just want to explore ideas? Reach out - we’d love to hear from you.</p>
        </div>
      </section>

      <section className="contact-chapter chapter">
        <div className="page-frame contact-grid">
          <div className="contact-details">
            <SectionHeading eyebrow="Start Your Journey" title="Get in Touch" align="stack" />
            <p className="contact-lede">Drop us a message and let’s discuss how we can help your business grow online.</p>
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
            <EnquiryForm
              heading="We’re Just One Message Away From Your Success"
              copy="Fill out the form below and we’ll respond within 24–48 business hours."
              source="contact"
            />
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
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  }

  return (
    <Layout
      className="faqs-page"
      seo={{
        title: 'Frequently Asked Questions | Wavefront Studio LLC',
        description: 'Everything You Need to Know Before Getting Started - the most common questions our clients ask before working with us.',
        canonical: '/faqs/',
        schema,
      }}
    >
      <section className="page-hero">
        <div className="page-frame">
          <span className="eyebrow">FAQs</span>
          <h1>Frequently Asked Questions</h1>
          <p>Everything You Need to Know Before Getting Started</p>
        </div>
      </section>

      <FaqAccordion
        items={faqItems}
        heading={{
          eyebrow: 'Answers',
          title: 'Got Questions? We’ve Got Answers.',
          copy: 'Here are the most common questions our clients ask before working with us. If you don’t find what you’re looking for, feel free to reach out – we’re always happy to help.',
        }}
        deskSub={`Or call ${contact.phone}`}
      />

      <CtaBand
        title="Still have a question?"
        copy="Tell us what you are trying to do and we will tell you honestly whether we are the right fit."
        label="Contact Us"
      />
    </Layout>
  )
}

export { siteOrigin }
