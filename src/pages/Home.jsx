import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { CtaBand, Counter, Reveal, SectionHeading, SupportCallout, Testimonials } from '../components/shared.jsx'
import Marquee from '../components/ui/Marquee.jsx'
import NumberTicker from '../components/ui/NumberTicker.jsx'
import { clientLogos, offerings, offeringsHeading, projects, siteOrigin } from '../data/site.js'

const stats = [
  { label: 'Happy Clients', to: 800, suffix: '+' },
  { label: 'Projects Done', to: 1.3, suffix: 'k+', decimals: 1 },
  { label: 'Years Experience', to: 12, suffix: '+' },
  { label: 'Expert Team', to: 10, suffix: '+' },
]

const skills = [
  ['Web Designer', 98],
  ['Digital Marketing', 95],
  ['Mobile Apps', 93],
  ['Branding', 96],
]

const howItWorks = [
  {
    title: 'Share Your Vision',
    copy: 'Tell us about your business and what you want to achieve. We’ll listen, ask the right questions, and map out a strategy that fits your goals – whether it’s more traffic, more sales, or a complete digital transformation.',
    cta: ['Let’s Talk', '/contact/'],
  },
  {
    title: 'We Design & Develop',
    copy: 'Our team of designers, developers, and strategists bring your vision to life. You stay involved with regular updates and previews at every stage – so the final product is exactly what you imagined, or even better.',
    cta: ['Learn More', '/web-development/'],
  },
  {
    title: 'Launch & Grow',
    copy: 'Once everything is polished and approved, we launch your project to the world. But we don’t stop there – we provide ongoing support, optimization, and strategy to make sure your business keeps growing long after launch.',
    cta: ['Start Your Project', '/contact/'],
  },
]

const trustPoints = [
  ['Professional Team', 'Skilled developers, designers, SEO experts, and AI specialists - all under one roof working together on your project.'],
  ['Expertise in Digital Innovation', 'We use cutting-edge tools like AI chatbots, live visualizers, and automated systems that most agencies haven’t adopted yet.'],
  ['Exceptional support', 'We don’t disappear after launch. Our team stays with you for ongoing support, updates, and optimization - one call away.'],
]

function SkillBar({ label, value, index }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setWidth(value)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return (
    <div className="skill-bar" ref={ref} style={{ '--delay': `${index * 120}ms` }}>
      <div className="skill-bar-label">
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <div className="skill-bar-track">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export default function Home() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Wavefront Studio LLC',
        url: `${siteOrigin}/`,
        logo: `${siteOrigin}/wave-logo.png`,
        telephone: '+1 941-415-2595',
        email: 'info@wavefrontstudiollc.com',
        address: { '@type': 'PostalAddress', addressLocality: 'Sarasota', addressRegion: 'FL', postalCode: '34234', addressCountry: 'US' },
        sameAs: ['https://www.instagram.com/wavefrontstudio'],
      },
      { '@type': 'WebSite', name: 'Wavefront Studio', url: `${siteOrigin}/` },
    ],
  }

  return (
    <Layout
      className="home-page"
      seo={{
        title: 'Full-Service Digital Agency | Wavefront Studio LLC',
        description:
          'From custom web development and AI-powered chatbots to SEO strategies and stunning UI/UX design – Wavefront Studio is a full-service digital agency that turns bold ideas into high-performing digital products.',
        canonical: '/',
        schema,
      }}
    >
      <section className="hero-section">
        <div className="page-frame hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Welcome to Wavefront studio</span>
            <h1>Where Innovation Meets Digital Excellence</h1>
            <p>
              From custom web development and AI-powered chatbots to SEO strategies and stunning UI/UX design – Wavefront Studio is a
              full-service digital agency that turns bold ideas into high-performing digital products. Let’s build something
              extraordinary together.
            </p>
            <div className="hero-actions">
              <a className="kinetic-button group" href="/contact/">
                <span>Get Started</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <a className="text-link" href="/about/">
                Learn More About Us <ArrowIcon />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-frame">
              <img src="/images/creative-work-on-digital-gadgets-in-the-studio-1.jpg" alt="Wavefront Studio team collaborating on digital gadgets in the studio" />
            </div>
            <div className="hero-badge">
              <span>Years</span>
              <strong>
                <Counter to={12} suffix="+" />
              </strong>
            </div>
            <div className="hero-visual-tiles" aria-hidden="true">
              <img src="/images/architect-holding-digital-tablet-with-building-model.jpg" alt="" />
              <img src="/images/digital-3d-creator-improving-industrial-prototype-component.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="clients-strip">
        <div className="page-frame">
          <h2>Trusted by Businesses Worldwide - From Startups to Established Brands</h2>
          <Marquee className="client-marquee" pauseOnHover speed={28} label="Wavefront Studio clients">
            {clientLogos.map((logo) => (
              <div className={`client-logo ${logo.className || ''}`} key={logo.src}>
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="about-chapter chapter" id="about">
        <div className="page-frame service-split">
          <Reveal className="about-media">
            <img src="/images/happy-creative-marketing-team-working-on-new-business-project-in-the-office-.jpg" alt="Happy creative marketing team collaborating on a new business project in the office" loading="lazy" />
          </Reveal>
          <div>
            <SectionHeading eyebrow="About Us" title="Creating Digital Solutions That Stand the Test of Time" align="stack" />
            <div className="prose">
              <p>
                Wavefront Studio was founded with one mission – to help businesses thrive in the digital world. We’re a team of
                developers, designers, SEO strategists, and AI specialists who believe every brand deserves a powerful online presence.
                Whether you’re launching your first website or scaling with AI-powered automation, we bring the expertise to make it
                happen.
              </p>
              <p>
                With a proven track record across industries – from e-commerce and SaaS to manufacturing and local services – we combine
                creative design with data-driven strategy. Our work with brands like Resin Rock showcases our ability to build complete
                digital ecosystems, including custom calculators, multi-site architectures, and conversion-optimized landing pages.
              </p>
            </div>
            <div className="about-actions">
              <a className="kinetic-button group" href="/portfolio/">
                <span>Discover More</span>
                <span className="button-island">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
              <SupportCallout />
            </div>
          </div>
        </div>
      </section>

      <section className="performance-chapter chapter">
        <div className="page-frame">
          <SectionHeading
            eyebrow="Performance"
            title="Where Stunning Design Meets Measurable Performance"
            copy="Every pixel, every line of code, every strategy we craft is built with one goal – your success. From high-converting websites and mobile apps to AI chatbot integrations and SEO campaigns, we deliver digital products that look stunning and perform even better. Our clients don’t just get a website – they get a growth engine."
            dark
          >
            <a className="kinetic-button light group" href="/portfolio/">
              <span>Discover More</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </a>
          </SectionHeading>
          <div className="stat-row is-quad">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 90}>
                <strong>
                  <NumberTicker value={stat.to} suffix={stat.suffix} decimals={stat.decimals || 0} blur />
                </strong>
                <span>{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="offerings-chapter chapter" id="services">
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

      <section className="skills-chapter chapter">
        <div className="page-frame service-split">
          <div>
            <SectionHeading eyebrow="Why Choose Us" title="We provide creative solutions for your creative ideas" align="stack" />
            <div className="prose">
              <p>
                Our team doesn’t just specialize in one thing – we bring senior-level expertise across design, development, marketing,
                and AI. That means your project stays under one roof, with one team that understands the full picture from day one.
              </p>
            </div>
            <div className="skill-list">
              {skills.map(([label, value], index) => (
                <SkillBar key={label} label={label} value={value} index={index} />
              ))}
            </div>
          </div>
          <Reveal className="about-media">
            <img
              src="/images/creative-digital-development-agency-brainstorming-about-mobile-app-interface-wireframe-design-on.jpg"
              alt="Digital development agency team brainstorming mobile app interface wireframe design"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="projects-chapter chapter" id="work">
        <div className="page-frame">
          <SectionHeading
            eyebrow="Featured Project"
            title="Where your successes become ours"
            copy="Here’s a look at some of our most recent work – from building complete website ecosystems and automated lead systems to ranking brands on the first page of Google. Every project is built to perform, not just to impress."
          />
          <div className="project-grid">
            {projects.map((project, index) => (
              <Reveal as="article" key={project.title} delay={index * 90} className="project-card">
                <a href={project.href} target="_blank" rel="noreferrer noopener">
                  <div className="project-media">
                    <img src={project.image} alt={project.alt} loading="lazy" />
                  </div>
                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p>{project.home}</p>
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
                    <span className="project-link">
                      View project <ArrowIcon />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="steps-chapter chapter">
        <div className="page-frame">
          <SectionHeading eyebrow="How It Works" title="From Idea to Launch - We Handle Everything" />
          <ol className="steps-grid">
            {howItWorks.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 100}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <a href={step.cta[1]}>
                  {step.cta[0]} <ArrowIcon />
                </a>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="partnership-chapter chapter">
        <div className="page-frame service-split is-reverse">
          <Reveal className="about-media">
            <img src="/images/business-people-using-a-digital-tablet.jpg" alt="Business people using a digital tablet" loading="lazy" />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Partnership" title="A digital agency that’s with you every step of the way" align="stack" />
            <div className="prose">
              <p>
                At Wavefront Studio, we believe great work comes from real relationships. We take the time to understand your business,
                stay involved at every stage, and continue supporting you long after launch. When you win, we win.
              </p>
            </div>
            <a className="kinetic-button group" href="/portfolio/">
              <span>Discover More</span>
              <span className="button-island">
                <ArrowIcon className="size-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="trust-chapter chapter">
        <div className="page-frame">
          <SectionHeading
            eyebrow="Why choose us"
            title="Why Growing Brands Trust Wavefront Studio"
            copy="We’re not just another agency that takes your brief and disappears. We work closely with every client, treat your project like our own, and don’t stop until the results speak for themselves."
          />
          <div className="trust-grid">
            {trustPoints.map(([title, copy], index) => (
              <Reveal as="article" key={title} delay={index * 90}>
                <b>{String(index + 1).padStart(2, '0')}</b>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CtaBand
        title="Let’s Build Something That Actually Grows Your Business"
        copy="We’re one conversation away from building something great together. Tell us your goals – we’ll handle the rest."
        label="Start Your Project"
      />
    </Layout>
  )
}
