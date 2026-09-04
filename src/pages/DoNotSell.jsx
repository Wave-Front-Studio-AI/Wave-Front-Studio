import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'

// The CPRA opt-out mechanism, linked from the footer of every page.
//
// This page only reads and writes the choice. The suppression itself happens in
// the gate script at the top of index.html, which runs before gtag and the Meta
// Pixel — by the time React has mounted, an unsuppressed pixel would already
// have set its cookie and sent a PageView. So every change here reloads the
// page: that is what actually applies it.
function readChoice() {
  const api = typeof window === 'undefined' ? null : window.wfPrivacy
  if (!api) return null
  return { optedOut: api.optedOut, gpc: api.gpc, stored: api.stored }
}

export default function DoNotSell() {
  // Null through the server render and the first client render alike, so
  // hydration matches. The real state arrives in the effect.
  const [choice, setChoice] = useState(null)
  const [storageBlocked, setStorageBlocked] = useState(false)

  useEffect(() => {
    setChoice(readChoice())
  }, [])

  function apply(optOut) {
    const api = window.wfPrivacy
    if (!api.choose(optOut)) {
      setStorageBlocked(true)
      return
    }
    if (optOut) api.forgetPixelCookie()
    // A reload is the point: it re-runs the gate with the new answer.
    window.location.reload()
  }

  return (
    <Layout
      className="do-not-sell-page"
      seo={{
        title: 'Do Not Sell or Share My Personal Information | Wavefront Studio LLC',
        description:
          'Opt out of the sale or sharing of your personal information for cross-context behavioral advertising on wavefrontstudiollc.com. We honor the Global Privacy Control signal.',
        canonical: '/do-not-sell/',
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <span className="eyebrow">Your privacy choices</span>
          <h1>Do Not Sell or Share My Personal Information</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="longform">
            <p className="lf-standfirst">
              This website runs the Meta Pixel, which reports the pages you view and your clicks on our phone and email
              links to Meta so that we can measure our advertising. California law treats that as “sharing” personal
              information for cross-context behavioral advertising. You can turn it off here.
            </p>

            <div className="lf-cta">
              <p>{statusHeading(choice)}</p>
              <p>{statusDetail(choice)}</p>
              {storageBlocked ? (
                <p>
                  Your browser refused to save the choice — this usually means storage is blocked or you are in private
                  browsing. Blocking cookies for this site has the same effect, or email us and we will confirm in
                  writing.
                </p>
              ) : null}
              <p className="lf-buttons">
                {choice === null ? (
                  <span>Loading your current setting…</span>
                ) : choice.optedOut ? (
                  <button type="button" className="lf-button-link" onClick={() => apply(false)}>
                    Allow sharing again
                  </button>
                ) : (
                  <button type="button" className="lf-button-link" onClick={() => apply(true)}>
                    Opt out on this browser
                  </button>
                )}
              </p>
            </div>

            <h2>What opting out does</h2>
            <p>
              The Meta Pixel is not loaded at all. Its script is never fetched, no <code>_fbp</code> cookie is written,
              and no page view, phone click or email click is reported to Meta. If a <code>_fbp</code> cookie was already
              in your browser, opting out deletes it.
            </p>
            <p>
              Google Analytics keeps running, because measuring our own website for our own use is not a sale or a share.
              What changes is that we instruct Google to deny advertising storage, advertising user data and ad
              personalization for you, so your visit cannot feed advertising.
            </p>

            <h2>Global Privacy Control</h2>
            <p>
              We honor the{' '}
              <a href="https://globalprivacycontrol.org/" rel="noopener" target="_blank">
                Global Privacy Control
              </a>{' '}
              signal. If your browser or an extension sends it, you are opted out automatically and you do not need to do
              anything on this page. Some browsers send it by default; others offer it as a setting.
            </p>
            <p>
              If you send the signal but deliberately choose “Allow sharing again” above, we treat that as you overriding
              your browser default for this site specifically, and the button will let you change back at any time.
            </p>

            <h2>What this does not cover</h2>
            <p>
              The choice is stored in this browser, on this device. It does not travel to your phone, to another browser,
              or to a private window. Clearing your site data clears it too, which puts you back to your browser's own
              signal.
            </p>
            <p>
              This page controls advertising and analytics tracking. It does not delete information you have already sent
              us through a contact form or by text message — for that, see section 7 of our{' '}
              <a href="/privacy-policy/">Privacy Policy</a>, or email us and we will action it within 30 days.
            </p>

            <h2>Other ways to opt out</h2>
            <p>
              You can also block cookies for this site in your browser, adjust your{' '}
              <a href="https://www.facebook.com/adpreferences/ad_settings" rel="noopener" target="_blank">
                Facebook ad preferences
              </a>
              , install the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener" target="_blank">
                Google Analytics opt-out browser add-on
              </a>
              , or email us at <a href="mailto:info@wavefrontstudiollc.com">info@wavefrontstudiollc.com</a> and we will
              handle it for you. We do not require an account or any verification to accept an opt-out.
            </p>

            <p>
              Our <a href="/cookie-policy/">Cookie Policy</a> lists every cookie this site sets, and our{' '}
              <a href="/privacy-policy/">Privacy Policy</a> explains what we collect and why.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function statusHeading(choice) {
  if (choice === null) return 'Checking this browser…'
  return choice.optedOut ? 'You are opted out on this browser.' : 'You are not opted out on this browser.'
}

function statusDetail(choice) {
  if (choice === null) return 'This page reads a setting stored in your browser, so the answer appears once it loads.'
  if (choice.optedOut && choice.stored !== '1') {
    return 'Your browser is sending a Global Privacy Control signal, and we are honoring it. You do not need to do anything else.'
  }
  if (choice.optedOut) return 'You chose this here. The Meta Pixel does not load for you on this site.'
  if (choice.gpc) {
    return 'Your browser sends a Global Privacy Control signal, but you have chosen to allow sharing on this site, so that choice is being used instead.'
  }
  return 'The Meta Pixel loads and reports your visits to Meta. Use the button to stop that.'
}
