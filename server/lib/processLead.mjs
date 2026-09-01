import { createLead } from './base44.mjs'
import { normalizeLead } from './normalizeLead.mjs'

export async function processLead(body, config, createLeadImpl = createLead) {
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
    const created = await createLeadImpl(lead, config)
    return { status: 201, payload: { ok: true, stored: true, id: created?.id || null } }
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'base44_lead_failed', message: error.message }))
    return {
      status: error.status === 503 ? 503 : 502,
      payload: { ok: false, error: 'The lead could not be stored.' },
    }
  }
}
