import { useEffect, useRef, useState } from 'react'
import { ArrowIcon, ChevronIcon } from './Icons.jsx'
import { contact, primaryNav } from '../data/site.js'
import { useCurrentPath } from '../routeContext.js'

function isActive(href, path) {
  if (!href) return false
  const clean = href.replace(/\/+$/, '') || '/'
  return clean === path
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const panel = useRef(null)
  const toggle = useRef(null)
  const closeTimer = useRef(null)
  const path = useCurrentPath()

  const cancelClose = () => window.clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setMenu(null), 240)
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (event.key !== 'Escape') return
      if (menu) setMenu(null)
      if (open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu, open])

  return (
    <header aria-label="Primary">
      <div className="nav-utility">
        <div className="page-frame">
          <a href={contact.phoneHref}>{contact.phone}</a>
          <span aria-hidden="true">·</span>
          <a href={contact.emailHref}>{contact.email}</a>
        </div>
      </div>

      <div className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand-lockup" href="/" aria-label="Wavefront Studio home">
          <img src="/wave-logo.webp" alt="Wavefront Studio" width="1591" height="498" />
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
            const childActive = item.children.some(([, href]) => isActive(href, path))
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
                  className={isActive(item.href, path) || childActive ? 'is-current' : ''}
                  onFocus={() => setMenu(item.label)}
                  onClick={(event) => {
                    if (!item.href) event.preventDefault()
                  }}
                >
                  {item.label} <ChevronIcon />
                </a>
                {isOpen ? (
                  <div className="nav-dropdown" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                    <span className="nav-dropdown-label">{item.label}</span>
                    {item.children.map(([label, href]) => (
                      <a key={href} href={href} className={isActive(href, path) ? 'is-current' : ''}>
                        <strong>{label}</strong>
                        <ArrowIcon />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <a className="nav-cta group" href="/contact/">
          <span>Get started</span>
          <span className="button-island">
            <ArrowIcon className="size-4" />
          </span>
        </a>

        <button
          ref={toggle}
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} ref={panel} inert={open ? undefined : true}>
        <nav aria-label="Mobile menu">
          {primaryNav.map((item, index) => {
            const style = { '--delay': `${70 + index * 40}ms` }
            if (!item.children) {
              return (
                <a key={item.label} href={item.href} style={style} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              )
            }
            const isExpanded = expanded === item.label
            return (
              <div className={`mobile-group ${isExpanded ? 'is-open' : ''}`} key={item.label} style={style}>
                <button type="button" aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? null : item.label)}>
                  {item.label} <ChevronIcon open={isExpanded} />
                </button>
                <div className="mobile-sub" aria-hidden={!isExpanded} inert={isExpanded ? undefined : true}>
                  <div className="mobile-sub-inner">
                    {item.href ? (
                      <a className="mobile-sub-all" href={item.href} onClick={() => setOpen(false)}>
                        Explore {item.label} <ArrowIcon />
                      </a>
                    ) : null}
                    {item.children.map(([label, href]) => (
                      <a key={href} href={href} onClick={() => setOpen(false)}>
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>
        <p>
          {contact.address}
          <br />
          <a href={contact.phoneHref}>{contact.phone}</a>
          <br />
          <a href={contact.emailHref}>{contact.email}</a>
        </p>
      </div>
    </header>
  )
}
