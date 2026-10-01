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

const entityUrl = (config, entity = config.base44Entity) => `${config.base44ApiUrl}/apps/${config.base44AppId}/entities/${entity}`

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
    // The detail ends up in the logs, and a validation error can echo what was
    // sent. Emails and phone numbers are masked; the shape of the problem stays.
    const safeDetail = String(detail)
      .replace(/[\r\n]+/g, ' ')
      .replace(/[^\s"'<>,;:()]+@[^\s"'<>,;:()]+/g, '[email]')
      .replace(/\+?\d[\d\s().-]{5,}\d/g, '[number]')
      .slice(0, 240)
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
// How many of the newest leads the loose duplicate check reads. A month of
// enquiries for a small studio fits comfortably.
const RECENT_SCAN = 100

// Phone numbers compared by their last ten digits, so "(941) 555-0123",
// "941.555.0123" and "+1 941 555 0123" are the same number. Fewer than seven
// digits is not a number worth matching on.
const phoneDigits = (value) => String(value ?? '').replace(/\D/g, '').slice(-10)
export const samePhone = (a, b) => {
  const left = phoneDigits(a)
  return left.length >= 7 && left === phoneDigits(b)
}

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

  // The filter is an exact match, so it misses a record whose email was saved
  // in mixed case (before 2026-09-18, or entered outside the website) or whose
  // phone was written another way. One look through the latest leads, compared
  // loosely, catches those. Email first, as above.
  if (!lead.email && !lead.phone) return null
  const url = `${entityUrl(config)}?${new URLSearchParams({ sort: '-created_date', limit: String(RECENT_SCAN) })}`
  const rows = await base44Request(url, {}, config, fetchImpl)
  const recent = (Array.isArray(rows) ? rows : []).filter((row) => Date.parse(row.created_date) >= cutoff)
  return (
    (lead.email && recent.find((row) => same(row[map.email], lead.email))) ||
    (lead.phone && recent.find((row) => samePhone(row[map.phone], lead.phone))) ||
    null
  )
}

// Adds the new enquiry to an existing lead: blank fields are filled in, nothing
// already on the record is overwritten, and the new message is appended to the
// notes so whoever is working the lead sees it. Email and phone are never
// written from a repeat enquiry: anyone who knows one of a lead's details could
// otherwise add their own and divert the follow-up. A new one goes into the
// notes instead, for a person to check before using it.
export async function mergeIntoLead(existing, lead, config, fetchImpl = fetch) {
  const map = config.base44FieldMap || LEAD_FIELD_MAP
  const incoming = toBase44Record({ ...lead, company: lead.company || existing[map.company] || resolveBusinessName(lead) }, map)
  const update = {}
  // Text permission is decided only by the rules below, never by filling a
  // blank field, or a record with no consent value yet would skip them.
  const consentFields = new Set(
    ['smsConsent', 'smsConsentAt', 'smsConsentUrl', 'smsConsentText', 'smsMarketingConsent', 'smsMarketingConsentAt', 'smsMarketingConsentUrl', 'smsMarketingConsentText'].map((key) => map[key]),
  )
  for (const [field, value] of Object.entries(incoming)) {
    if (field === map.notes || field === map.email || field === map.phone || consentFields.has(field)) continue
    if (existing[field] === undefined || existing[field] === null || existing[field] === '') update[field] = value
  }
  // Ticking the text box adds permission. Leaving it unticked never takes away
  // permission given earlier: only replying STOP does that. A record marked do
  // not contact (the CRM sets that on STOP, and staff can set it) is never
  // switched back on from a web form, since anyone can type a number into one;
  // it gets a note instead. "No" in the consent field itself is only the CRM's
  // default for someone who never ticked the box, so it is not read as a STOP.
  const refused = []
  for (const [flag, keys, label] of [
    ['smsMarketingConsent', ['smsMarketingConsent', 'smsMarketingConsentAt', 'smsMarketingConsentUrl', 'smsMarketingConsentText'], 'marketing texts'],
    ['smsConsent', ['smsConsent', 'smsConsentAt', 'smsConsentUrl', 'smsConsentText'], 'texts about their enquiry'],
  ]) {
    if (lead[flag] !== true) continue
    if (existing[DO_NOT_CONTACT] === true) {
      refused.push(label)
      continue
    }
    for (const key of keys) {
      const field = map[key]
      const value = lead[key]
      if (field && value !== undefined && value !== null && value !== '') update[field] = value
    }
  }
  const unverified = []
  if (lead.email && String(existing[map.email] ?? '').trim().toLowerCase() !== lead.email.toLowerCase()) unverified.push(`Email given: ${lead.email}`)
  if (lead.phone && String(existing[map.phone] ?? '').trim() !== lead.phone) unverified.push(`Phone given: ${lead.phone}`)
  if (lead.notes || unverified.length || refused.length) {
    const stamp = new Date().toISOString().slice(0, 10)
    const check = unverified.length ? `\nNew contact details, not added to the record (check they are this person's before using): ${unverified.join('; ')}` : ''
    const stop = refused.length ? `\n${optOutNote(refused)}` : ''
    update[map.notes] = [existing[map.notes], `Repeat enquiry (${stamp}):\n${lead.notes || ''}${check}${stop}`].filter(Boolean).join('\n\n')
  }
  return base44Request(`${entityUrl(config)}/${existing.id}`, { method: 'PUT', body: update }, config, fetchImpl)
}

const optOutNote = (kinds) =>
  `Ticked the box for ${kinds.join(' and ')}, but this number has opted out of texts before (replied STOP, or is marked do not contact). Permission was not switched back on, because anyone can type a number into a form. Only text them again once they text START to the studio's number.`

// The CRM's own records of a STOP (Base44 app, base44/shared/smsOptOut.ts):
// the lead is marked do_not_call, and the number's last ten digits go on the
// SuppressionList, which outlives the lead if it is later deleted.
const DO_NOT_CONTACT = 'do_not_call'

async function numberHasOptedOut(phone, config, fetchImpl) {
  const map = config.base44FieldMap || LEAD_FIELD_MAP
  const digits = phoneDigits(phone)
  if (digits.length < 7) return false
  try {
    const query = { type: 'phone', value: digits }
    const url = `${entityUrl(config, 'SuppressionList')}?${new URLSearchParams({ q: JSON.stringify(query), limit: '1' })}`
    const rows = await base44Request(url, {}, config, fetchImpl)
    if ((Array.isArray(rows) ? rows : []).some((row) => row.type === 'phone' && samePhone(row.value, digits))) return true
  } catch (error) {
    // The list is admin-only in the CRM. Without access, the lead records
    // below still carry the STOP; anything else is a real failure.
    if (![401, 403, 404].includes(error.status)) throw error
  }
  const url = `${entityUrl(config)}?${new URLSearchParams({ q: JSON.stringify({ [DO_NOT_CONTACT]: true }), limit: '500' })}`
  const rows = await base44Request(url, {}, config, fetchImpl)
  return (Array.isArray(rows) ? rows : []).some((row) => row[DO_NOT_CONTACT] === true && samePhone(row[map.phone], phone))
}

// A ticked text box for a number that has opted out, however long ago, does
// not become permission. If the check fails, the permission is held back too,
// and the notes say so.
export async function withholdOptedOutConsent(lead, config, fetchImpl = fetch) {
  const boxes = [
    ['smsConsent', ['smsConsentAt', 'smsConsentUrl', 'smsConsentText'], 'texts about their enquiry'],
    ['smsMarketingConsent', ['smsMarketingConsentAt', 'smsMarketingConsentUrl', 'smsMarketingConsentText'], 'marketing texts'],
  ].filter(([flag]) => lead[flag] === true)
  if (!lead.phone || !boxes.length) return lead

  let optedOut = false
  let unchecked = false
  try {
    optedOut = await numberHasOptedOut(lead.phone, config, fetchImpl)
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'base44_optout_check_failed', message: error.message }))
    unchecked = true
  }
  if (!optedOut && !unchecked) return lead

  const held = { ...lead }
  for (const [flag, details] of boxes) {
    held[flag] = undefined
    for (const key of details) held[key] = undefined
  }
  const kinds = boxes.map(([, , label]) => label)
  const note = unchecked
    ? `Ticked the box for ${kinds.join(' and ')}, but the check for an earlier STOP on this number failed, so no permission to text was recorded. Confirm with them before texting.`
    : optOutNote(kinds)
  held.notes = [lead.notes, note].filter(Boolean).join('\n')
  return held
}

// Creates the lead, or merges it into a recent duplicate. A failed duplicate
// lookup never costs a lead: it falls through to creating a new record.
export async function saveLead(lead, config, fetchImpl = fetch) {
  if (!config.base44AppId || !config.base44Key) throw new Base44Error('Base44 is not configured.', 503)

  lead = await withholdOptedOutConsent(lead, config, fetchImpl)
  let existing = null
  try {
    existing = await findRecentLead(lead, config, fetchImpl)
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'base44_duplicate_check_failed', message: error.message }))
  }
  if (!existing) return { ...(await createLead(lead, config, fetchImpl)), merged: false }

  // A merge can fail too (the record was deleted in between, or the update is
  // rejected). The enquiry is then stored as a new lead rather than lost.
  try {
    const updated = await mergeIntoLead(existing, lead, config, fetchImpl)
    return { ...updated, id: updated?.id || existing.id, merged: true }
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'base44_merge_failed', message: error.message }))
    return { ...(await createLead(lead, config, fetchImpl)), merged: false }
  }
}
