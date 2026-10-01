// Where enquiries are delivered.
//
// VITE_LEAD_ENDPOINT — a JSON endpoint that accepts the whole submission.
// Local development uses Vite's /api proxy. In production, either proxy this
// same path to the lead service or set VITE_LEAD_ENDPOINT to its HTTPS URL.
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lead/'

// Matches the server (server/lib/normalizeLead.mjs): http and https only.
function normalizeWebsite(value) {
  const website = typeof value === 'string' ? value.trim() : ''
  if (!website) return ''
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(website) ? website : `https://${website}`
  try {
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:' ? candidate : ''
  } catch {
    return ''
  }
}

// Where the visitor came from: the ad's utm_ tags, or the site that linked
// here. Kept for the visit, so an enquiry sent three pages later still says
// which ad or search brought them. Same storage key and names as the ads
// landing page (public/free-website-audit/), so a visit that starts there and
// enquires here keeps its source.
const ATTRIBUTION_KEY = 'wfs_utm'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

export function rememberAttribution() {
  try {
    const store = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || '{}')
    const params = new URLSearchParams(window.location.search)
    let changed = false
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) {
        store[key] = value.slice(0, 120)
        changed = true
      }
    }
    if (!store.utm_source && document.referrer) {
      const host = new URL(document.referrer).hostname
      if (host && host !== window.location.hostname) {
        store.utm_source = `referral:${host}`
        changed = true
      }
    }
    if (changed) window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(store))
  } catch {
    /* storage blocked or an odd referrer: the enquiry just arrives without a source */
  }
}

function attribution() {
  try {
    const store = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || '{}')
    return Object.fromEntries(UTM_KEYS.filter((key) => typeof store[key] === 'string' && store[key]).map((key) => [key, store[key]]))
  } catch {
    return {}
  }
}

async function deliverToApi(payload) {
  if (!LEAD_ENDPOINT) return false
  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    const type = response.headers.get('content-type') || ''
    // A static host can answer an unknown API path with the HTML shell. Never
    // treat that as delivery and never open mail after an API submission fails.
    if (!type.includes('application/json')) throw new Error('The lead API is not available.')
    const result = await response.json()
    if (!response.ok || result.ok !== true || result.stored !== true) {
      throw new Error(result.error || 'The lead API did not confirm that the submission was stored.')
    }
    // Only once the API confirms the lead was stored, so the Meta conversion
    // counts submissions that landed rather than attempts.
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: window.location.pathname })
    }
    return true
  } catch (error) {
    throw error instanceof Error ? error : new Error('The lead API is not available.')
  }
}

export async function deliverLead(formElement, { subject, fields = [], source = 'website' } = {}) {
  const formData = new FormData(formElement)
  if (formData.has('website')) formData.set('website', normalizeWebsite(formData.get('website')))
  const submission = Object.fromEntries(formData)

  // Labelled values so the record reads the way the form did, whichever form it
  // came from.
  const labelled = {}
  for (const [label, key, fixedValue] of fields) {
    const value = fixedValue || (key ? formData.get(key) : '')
    if (value) labelled[label] = value
  }

  // The source rides along with the labelled answers, so it lands in the
  // lead's notes the same way the ads landing page sends it.
  const visit = attribution()
  Object.assign(labelled, { utm_source: 'direct', ...visit })

  const stored = await deliverToApi({
    ...submission,
    source,
    subject,
    page: typeof window === 'undefined' ? '' : window.location.pathname,
    labelled,
  })

  if (stored) {
    formElement.reset()
    // Someone who has just sent us their details should not then be asked for
    // them again by the exit popup (src/components/SitePopups.jsx).
    try {
      window.localStorage.setItem('wf-lead-sent', '1')
    } catch {
      /* storage unavailable: the popup may show once, nothing else depends on it */
    }
    return 'submitted'
  }

  throw new Error('The lead API did not store the submission.')
}
