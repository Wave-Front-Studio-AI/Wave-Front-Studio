export const LEAD_FIELD_MAP = {
  company: 'business_name',
  name: 'contact_name',
  email: 'email',
  phone: 'phone',
  industry: 'industry',
  location: 'location',
  website: 'website',
  notes: 'notes',
  smsConsent: 'sms_consent',
  smsConsentAt: 'sms_consent_at',
  smsConsentUrl: 'sms_consent_url',
  smsConsentText: 'sms_consent_text',
  smsMarketingConsent: 'sms_marketing_consent',
  smsMarketingConsentAt: 'sms_marketing_consent_at',
  smsMarketingConsentUrl: 'sms_marketing_consent_url',
  smsMarketingConsentText: 'sms_marketing_consent_text',
  consentUrl: 'consent_url',
  consentCapturedAt: 'consent_captured_at',
}

export function resolveBusinessName(lead) {
  if (lead.company) return lead.company
  if (lead.website) return lead.website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  if (lead.name) return `${lead.name} (no company given)`
  return 'Website enquiry'
}

export function toBase44Record(lead, map = LEAD_FIELD_MAP) {
  const record = {}
  for (const [internal, external] of Object.entries(map || LEAD_FIELD_MAP)) {
    const value = lead[internal]
    if (value !== undefined && value !== null && value !== '') record[external] = value
  }
  return record
}

export class Base44Error extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'Base44Error'
    this.status = status
  }
}

const entityUrl = (config) => `${config.base44ApiUrl}/apps/${config.base44AppId}/entities/${config.base44Entity}`

// One request to the Base44 entities API, with the timeout and error handling
// every call here shares.
async function base44Request(url, { method = 'GET', body } = {}, config, fetchImpl) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.base44TimeoutMs)
  let response
  try {
    response = await fetchImpl(url, {
      method,
      headers: { api_key: config.base44Key, 'content-type': 'application/json', accept: 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    })
  } catch (error) {
    throw new Base44Error(error.name === 'AbortError' ? 'Base44 timed out.' : `Base44 request failed: ${error.message}`, 502)
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    const text = await response.text()
    let detail = ''
    try {
      const parsed = JSON.parse(text)
      detail = parsed.message || parsed.error || parsed.detail || ''
    } catch {
      detail = text
    }
    const safeDetail = String(detail).replace(/[\r\n]+/g, ' ').slice(0, 240)
    throw new Base44Error(`Base44 rejected the lead (${response.status})${safeDetail ? `: ${safeDetail}` : '.'}`, response.status)
  }
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('json')) throw new Base44Error('Base44 returned a non-JSON response. Check BASE44_API_URL.', 502)
  return response.json()
}

export async function createLead(lead, config, fetchImpl = fetch) {
  if (!config.base44AppId || !config.base44Key) throw new Base44Error('Base44 is not configured.', 503)

  const record = toBase44Record({ ...lead, company: resolveBusinessName(lead) }, config.base44FieldMap)
  record[config.base44StageField] = config.base44Stage
  record[config.base44StatusField] = config.base44Status
  if (config.base44LeadSource) record.lead_source = config.base44LeadSource
  if (config.base44Owner) record.assigned_to = config.base44Owner
  if (config.base44OwnerEmail) record.assigned_to_email = config.base44OwnerEmail

  return base44Request(entityUrl(config), { method: 'POST', body: record }, config, fetchImpl)
}

/* ------------------------------------------------------------------ */
/* Duplicate protection                                                */
/* ------------------------------------------------------------------ */

// Someone who sends the contact form, then the audit popup, then the chat
// form in the same month is one lead, not three. Within this window a repeat
// enquiry is added to the existing record; after it, a returning customer is
// a new opportunity and gets a new record.
export const DUPLICATE_WINDOW_DAYS = 30

// The most recent lead with the same email, or failing that the same phone
// number, created inside the duplicate window. Base44's filter is an exact
// match, so emails are checked both as typed and lower-cased (new leads are
// stored lower-cased).
export async function findRecentLead(lead, config, fetchImpl = fetch, now = Date.now()) {
  const map = config.base44FieldMap || LEAD_FIELD_MAP
  const probes = []
  if (lead.email) {
    for (const email of new Set([lead.email.toLowerCase(), lead.email])) probes.push({ [map.email]: email })
  }
  if (lead.phone) probes.push({ [map.phone]: lead.phone })

  const cutoff = now - DUPLICATE_WINDOW_DAYS * 24 * 60 * 60 * 1000
  const same = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase()
  for (const query of probes) {
    const url = `${entityUrl(config)}?${new URLSearchParams({ q: JSON.stringify(query), sort: '-created_date', limit: '1' })}`
    const rows = await base44Request(url, {}, config, fetchImpl)
    const match = Array.isArray(rows) ? rows[0] : null
    // Re-check the field ourselves: if the filter were ever ignored, the newest
    // lead of someone else must not have this enquiry merged into it.
    const [[field, value]] = Object.entries(query)
    if (match && same(match[field], value) && Date.parse(match.created_date) >= cutoff) return match
  }
  return null
}

// Adds the new enquiry to an existing lead: blank fields are filled in, nothing
// already on the record is overwritten, and the new message is appended to the
// notes so whoever is working the lead sees it.
export async function mergeIntoLead(existing, lead, config, fetchImpl = fetch) {
  const map = config.base44FieldMap || LEAD_FIELD_MAP
  const incoming = toBase44Record({ ...lead, company: lead.company || existing[map.company] || resolveBusinessName(lead) }, map)
  const update = {}
  for (const [field, value] of Object.entries(incoming)) {
    if (field === map.notes) continue
    if (existing[field] === undefined || existing[field] === null || existing[field] === '') update[field] = value
  }
  // Ticking the text box is new permission, so it lands even on a record that
  // already says no. Leaving it unticked never takes away permission given
  // earlier: only replying STOP does that.
  if (lead.smsMarketingConsent === true) {
    for (const key of ['smsMarketingConsent', 'smsMarketingConsentAt', 'smsMarketingConsentUrl', 'smsMarketingConsentText']) {
      const field = map[key]
      const value = lead[key]
      if (field && value !== undefined && value !== null && value !== '') update[field] = value
    }
  }
  if (lead.smsConsent === true) {
    for (const key of ['smsConsent', 'smsConsentAt', 'smsConsentUrl', 'smsConsentText']) {
      const field = map[key]
      const value = lead[key]
      if (field && value !== undefined && value !== null && value !== '') update[field] = value
    }
  }
  if (lead.notes) {
    const stamp = new Date().toISOString().slice(0, 10)
    update[map.notes] = [existing[map.notes], `Repeat enquiry (${stamp}):\n${lead.notes}`].filter(Boolean).join('\n\n')
  }
  return base44Request(`${entityUrl(config)}/${existing.id}`, { method: 'PUT', body: update }, config, fetchImpl)
}

// Creates the lead, or merges it into a recent duplicate. A failed duplicate
// lookup never costs a lead: it falls through to creating a new record.
export async function saveLead(lead, config, fetchImpl = fetch) {
  if (!config.base44AppId || !config.base44Key) throw new Base44Error('Base44 is not configured.', 503)

  let existing = null
  try {
    existing = await findRecentLead(lead, config, fetchImpl)
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'base44_duplicate_check_failed', message: error.message }))
  }
  if (!existing) return { ...(await createLead(lead, config, fetchImpl)), merged: false }

  const updated = await mergeIntoLead(existing, lead, config, fetchImpl)
  return { ...updated, id: updated?.id || existing.id, merged: true }
}
