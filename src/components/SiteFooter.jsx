import { ArrowIcon } from './Icons.jsx'
import { contact, footerCopy, footerNav } from '../data/site.js'

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-frame footer-ready">
        <div>
          <span className="eyebrow">{footerCopy.readyHeading}</span>
          <h2>{footerCopy.readySub}</h2>
          <p>{footerCopy.readyBody}</p>
        </div>
        <a className="kinetic-button light group" href="/contact/">
          <span>Contact Us</span>
          <span className="button-island">
            <ArrowIcon className="size-4" />
          </span>
        </a>
      </div>

      <div className="page-frame footer-directory">
        <div className="footer-intro">
          <a className="footer-brand" href="/" aria-label="Wavefront Studio home">
            <img src="/wave-logo-white.webp" alt="Wavefront Studio" width="1591" height="498" loading="lazy" />
          </a>
          <p>{footerCopy.tagline}</p>
          <div className="footer-social">
            <a href={contact.phoneAltHref} aria-label={`Call ${contact.phoneAlt}`}>
              <PhoneIcon />
            </a>
            <a href={contact.instagram} target="_blank" rel="noreferrer noopener" aria-label="Wavefront Studio on Instagram">
              <InstagramIcon />
            </a>
            <a href={contact.emailHref} aria-label={`Email ${contact.email}`}>
              <MailIcon />
            </a>
            <a href={contact.maps} target="_blank" rel="noreferrer noopener" aria-label="Wavefront Studio on Google Maps">
              <PinIcon />
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <div>
            <strong>Popular Services</strong>
            {footerNav.popularServices.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <strong>Quick Links</strong>
            {footerNav.quickLinks.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="footer-address">
            <strong>Address</strong>
            <span>{contact.address}</span>
            <a href={contact.emailHref}>{contact.email}</a>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </div>
        </nav>
      </div>

      <div className="page-frame footer-bottom">
        <span>{footerCopy.copyright}</span>
        <nav aria-label="Legal">
          {footerNav.legal.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
