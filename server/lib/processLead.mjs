import { saveLead } from './base44.mjs'
import { normalizeLead } from './normalizeLead.mjs'

// saveLead merges a repeat enquiry into the existing record rather than
// creating a duplicate; either way the lead is stored.
export async function processLead(body, config, saveLeadImpl = saveLead) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { status: 400, payload: { ok: false, error: 'Invalid request.' } }
  }

  if (body._gotcha || body.website_url) {
    return { status: 202, payload: { ok: true, stored: false } }
  }

  const lead = normalizeLead(body)
  if (!lead.email && !lead.phone) {
    return { status: 400, payload: { ok: false, error: 'An email address or phone number is required.' } }
  }

  try {
    const saved = await saveLeadImpl(lead, config)
    const payload = { ok: true, stored: true, id: saved?.id || null }
    if (saved?.merged) payload.merged = true
    return { status: saved?.merged ? 200 : 201, payload }
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'base44_lead_failed', message: error.message }))
    return {
      status: error.status === 503 ? 503 : 502,
      payload: { ok: false, error: 'The lead could not be stored.' },
    }
  }
}
