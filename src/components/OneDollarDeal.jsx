/* global __BUILD_TIME__ */
import { useEffect, useState } from 'react'
import { ONE_DOLLAR_WINDOW, oneDollarActive } from '../data/oneDollarSite.js'

// The $1 Website is a Black Friday deal: `false` while it runs, `true` once it has ended.
export function useOneDollarEnded() {
  // The first render uses the time the site was built, so a build made after
  // the deal ends prerenders the ended page. The browser then checks the real time.
  const [ended, setEnded] = useState(() => !oneDollarActive(typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : undefined))
  useEffect(() => {
    const check = () => setEnded(!oneDollarActive())
    check()
    const timer = window.setInterval(check, 30000)
    return () => window.clearInterval(timer)
  }, [])
  return ended
}

function timeLeft(now = new Date()) {
  const ms = Math.max(0, Date.parse(ONE_DOLLAR_WINDOW.endExclusive) - now.getTime())
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
  }
}

// A dark strip with the deadline and a countdown. Space is held while the
// browser works out the time left, so nothing shifts when it appears. The text
// is there from the first paint; only the clock digits wait for the browser.
export function OneDollarDeadline({ compact = false }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    const tick = () => setState({ parts: timeLeft() })
    tick()
    const timer = window.setInterval(tick, 30000)
    return () => window.clearInterval(timer)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const parts = state?.parts

  return (
    <div className={`one-dollar-deadline${compact ? ' is-compact' : ''}`}>
      <p>
        <strong>Black Friday only.</strong> <span>Ends {ONE_DOLLAR_WINDOW.endsLabel}.</span>
      </p>
      <div className="one-dollar-clock" role="timer" aria-label="Time left on the $1 setup">
        <div>
          <b>{parts ? parts.days : '--'}</b>
          <small>Days</small>
        </div>
        <div>
          <b>{parts ? pad(parts.hours) : '--'}</b>
          <small>Hrs</small>
        </div>
        <div>
          <b>{parts ? pad(parts.minutes) : '--'}</b>
          <small>Min</small>
        </div>
      </div>
    </div>
  )
}

// What the $1 pages show once the deal is over.
export function OneDollarEnded({ Heading = 'h2' }) {
  return (
    <div className="one-dollar-ended">
      <Heading>The $1 Website deal has ended.</Heading>
      <p>The $1 setup ran through Black Friday and closed on December 1. You can still get a website from us. Build a quote and we reply within two working days.</p>
      <div className="one-dollar-actions">
        <a className="kinetic-button group" href="/package-builder/?add=web">
          <span>Build a website quote</span>
        </a>
        <a className="text-link" href="/contact/">
          Talk to us
        </a>
      </div>
    </div>
  )
}
