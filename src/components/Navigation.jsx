import { useEffect, useRef, useState } from 'react'
import { ArrowIcon, ChevronIcon } from './Icons.jsx'
import { contact, mobileNav, navCta, primaryNav } from '../data/site.js'
import { useCurrentPath } from '../routeContext.js'

function isActive(href, path) {
  if (!href) return false
  const clean = href.replace(/\/+$/, '') || '/'
  return clean === path
}

const menuId = (label) => `${label.toLowerCase().replace(/\s+/g, '-')}-menu`

// Services: the core services with a line each, the custom work beside them,
// and a panel through to the full list.
function MegaPanel({ item, path }) {
  return (
    <>
      <div className="nav-dropdown-column">
        <span>{item.title}</span>
        {item.children.map(([label, href, note]) => (
          <a key={href} href={href} className={isActive(href, path) ? 'is-current' : ''}>
            <strong>{label}</strong>
            <small>{note}</small>
          </a>
        ))}
      </div>
      {item.secondary ? (
        <div className="nav-dropdown-column nav-dropdown-links">
          <span>{item.secondary.title}</span>
          {item.secondary.links.map(([label, href]) => (
            <a key={href} href={href} className={isActive(href, path) ? 'is-current' : ''}>
              {label}
              <ArrowIcon />
            </a>
          ))}
        </div>
      ) : null}
      {item.feature && item.href ? (
        <a className="nav-dropdown-feature" href={item.href}>
          <span className="nav-dropdown-feature-brand">
            <img src="/images/wave-mark.webp" alt="" width="208" height="208" loading="lazy" />
          </span>
          <span>{item.feature.kicker}</span>
          <strong>{item.feature.title}</strong>
          <small>
            {item.feature.label} <ArrowIcon />
          </small>
        </a>
      ) : null}
    </>
  )
}

// Resources and Who we are: one card per page, the name above a line about it.
function CardPanel({ item, path }) {
  return item.children.map(([label, href, note]) => (
    <a key={href} href={href} className={isActive(href, path) ? 'is-current' : ''}>
      <span>{label}</span>
      <strong>{note}</strong>
    </a>
  ))
}

function MenuBars({ open }) {
  return (
    <span className={`menu-bars ${open ? 'is-open' : ''}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(null)
  const opener = useRef(null)
  const closeTimer = useRef(null)
  const path = useCurrentPath()

  const cancelClose = () => window.clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setMenu(null), 240)
  }
  // The menu opens from the header button on tablets and from the bottom bar
  // on phones; focus goes back to whichever one opened it.
  const toggleMenu = (event) => {
    if (!open) opener.current = event.currentTarget
    setOpen((value) => !value)
  }
  const closeMenu = () => {
    setOpen(false)
    opener.current?.focus()
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return () => document.body.classList.remove('menu-open')
    // While the full-screen menu is up, the page behind it is out of reach for
    // keyboards and screen readers, and focus starts on the first link.
    const behind = [document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean)
    behind.forEach((node) => node.setAttribute('inert', ''))
    const frame = requestAnimationFrame(() => document.querySelector('#mobile-menu nav a')?.focus())
    return () => {
      cancelAnimationFrame(frame)
      behind.forEach((node) => node.removeAttribute('inert'))
      document.body.classList.remove('menu-open')
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  useEffect(() => {
    function onKey(event) {
      if (event.key !== 'Escape') return
      if (menu) {
        // Closing unmounts the panel; if focus was inside it, put it back on
        // the menu's own link rather than losing it to the page.
        document.activeElement?.closest?.('.nav-dropdown-item')?.querySelector(':scope > a')?.focus()
        setMenu(null)
      }
      if (open) {
        setOpen(false)
        opener.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu, open])

  return (
    <header className="site-header" aria-label="Primary">
      <div className="page-frame site-nav">
        <a className="brand-lockup" href="/" aria-label="Wavefront Studio home">
          <img src="/wave-logo.webp" alt="Wavefront Studio" width="480" height="150" />
        </a>

        <nav className="nav-links" aria-label="Main menu" onMouseLeave={scheduleClose}>
          {primaryNav.map((item) => {
            if (!item.children) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={isActive(item.href, path) ? 'is-current' : ''}
                  onMouseEnter={() => setMenu(null)}
                >
                  {item.label}
                </a>
              )
            }
            const isOpen = menu === item.label
            const links = [...item.children, ...(item.secondary?.links || [])]
            const childActive = links.some(([, href]) => isActive(href, path))
            return (
              <div
                key={item.label}
                className={`nav-dropdown-item ${isOpen ? 'is-open' : ''}`}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null)
                }}
                onMouseEnter={() => {
                  cancelClose()
                  setMenu(item.label)
                }}
              >
                <a
                  href={item.href || '#'}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={menuId(item.label)}
                  className={isActive(item.href, path) || childActive ? 'is-current' : ''}
                  onFocus={() => setMenu(item.label)}
                  onClick={(event) => {
                    if (!item.href) event.preventDefault()
                  }}
                >
                  {item.label} <ChevronIcon />
                </a>
                {isOpen ? (
                  <div
                    className={`nav-dropdown nav-dropdown-${item.layout}`}
                    id={menuId(item.label)}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    {item.layout === 'mega' ? <MegaPanel item={item} path={path} /> : <CardPanel item={item} path={path} />}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        {/* Many trade buyers would rather call; wide screens have room for the number. */}
        <a className="nav-phone" href={contact.phoneHref}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
          </svg>
          {contact.phone}
        </a>

        <a className="nav-cta group" href={navCta.href}>
          <span>{navCta.label}</span>
          <span className="button-island">
            <ArrowIcon className="size-4" />
          </span>
        </a>

        <button className="menu-toggle" type="button" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={toggleMenu}>
          <MenuBars open={false} />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} inert={open ? undefined : true}>
        <button className="mobile-menu-close" type="button" aria-label="Close menu" onClick={closeMenu}>
          <MenuBars open />
        </button>
        <nav aria-label="Mobile menu">
          {mobileNav.map(([label, href], index) => (
            <a
              key={href}
              href={href}
              className={isActive(href, path) ? 'is-current' : ''}
              style={{ '--delay': `${70 + index * 40}ms` }}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <p>
          {contact.address}
          <br />
          <a href={contact.phoneHref}>{contact.phone}</a>
          <br />
          <a href={contact.emailHref}>{contact.email}</a>
        </p>
      </div>

      {/* Phones keep the ways to get in touch, and the menu, at the bottom of the screen. */}
      <nav className="nav-dock" aria-label="Quick contact">
        <a href="/contact/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 5h16v11H9l-5 4Z" />
          </svg>
          Contact
        </a>
        <a href={contact.phoneHref}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
          </svg>
          Call us
        </a>
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={open ? closeMenu : toggleMenu}>
          <MenuBars open={open} />
          Menu
        </button>
      </nav>
    </header>
  )
}
