// Where enquiries are delivered.
//
// VITE_LEAD_ENDPOINT — a JSON endpoint that accepts the whole submission.
// Local development uses Vite's /api proxy. In production, either proxy this
// same path to the lead service or set VITE_LEAD_ENDPOINT to its HTTPS URL.
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lead'

function normalizeWebsite(value) {
  const website = typeof value === 'string' ? value.trim() : ''
  if (!website || /^[a-z][a-z\d+.-]*:\/\//i.test(website)) return website
  return `https://${website}`
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

  const stored = await deliverToApi({
    ...submission,
    source,
    subject,
    page: typeof window === 'undefined' ? '' : window.location.pathname,
    labelled,
  })

  if (stored) {
    formElement.reset()
    return 'submitted'
  }

  throw new Error('The lead API did not store the submission.')
}
