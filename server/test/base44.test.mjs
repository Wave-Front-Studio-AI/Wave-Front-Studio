import test from 'node:test'
import assert from 'node:assert/strict'
import { createLead, findRecentLead, resolveBusinessName, saveLead, toBase44Record } from '../lib/base44.mjs'
import { normalizeLead } from '../lib/normalizeLead.mjs'
import { processLead } from '../lib/processLead.mjs'
import { SMS_CONSENT_VERSIONS } from '../../src/data/smsConsent.js'

test('normalizes enquiry forms and preserves labelled answers', () => {
  const lead = normalizeLead({ name: 'Ada', email: 'ada@example.com', website: 'supa.com', message: 'A new site', source: 'contact', page: '/contact/', labelled: { Subject: 'Website Development' } })
  assert.equal(lead.name, 'Ada')
  assert.equal(lead.email, 'ada@example.com')
  assert.match(lead.notes, /Website Development/)
  assert.equal(lead.website, 'https://supa.com')
  assert.equal(lead.consentUrl, 'https://wavefrontstudiollc.com/contact/')
})

test('keeps only http and https websites', () => {
  assert.equal(normalizeLead({ website: 'https://example.com' }).website, 'https://example.com')
  assert.equal(normalizeLead({ website: 'example.com/page' }).website, 'https://example.com/page')
  assert.equal(normalizeLead({ website: 'javascript://%0aalert(1)' }).website, '')
  assert.equal(normalizeLead({ website: 'data:text/html,hi' }).website, '')
})

test('maps only declared Base44 fields and supplies a business name', () => {
  const lead = { name: 'Ada', email: 'ada@example.com', ignored: 'no' }
  assert.equal(resolveBusinessName(lead), 'Ada (no company given)')
  assert.deepEqual(toBase44Record(lead), { contact_name: 'Ada', email: 'ada@example.com' })
})

test('creates a website lead with Base44 API-key auth and pipeline defaults', async () => {
  let request
  const fetchImpl = async (url, options) => {
    request = { url, options }
    return new Response(JSON.stringify({ id: 'lead-123' }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    })
  }
  const config = {
    base44ApiUrl: 'https://divergent-nexus-growth-hub.base44.app/api',
    base44AppId: 'app-123',
    base44Key: 'secret-key',
    base44Entity: 'ProspectLead',
    base44StageField: 'pipeline_stage',
    base44Stage: 'new',
    base44StatusField: 'status',
    base44Status: 'found',
    base44LeadSource: 'website',
    base44Owner: 'Daniel Michaelis',
    base44OwnerEmail: 'daniel@wavefrontstudiostaff.com',
    base44TimeoutMs: 1000,
  }

  const result = await createLead({ name: 'Ada', email: 'ada@example.com' }, config, fetchImpl)
  const record = JSON.parse(request.options.body)

  assert.equal(result.id, 'lead-123')
  assert.equal(request.url, 'https://divergent-nexus-growth-hub.base44.app/api/apps/app-123/entities/ProspectLead')
  assert.equal(request.options.headers.api_key, 'secret-key')
  assert.equal(record.lead_source, 'website')
  assert.equal(record.pipeline_stage, 'new')
  assert.equal(record.status, 'found')
  assert.equal(record.assigned_to, 'Daniel Michaelis')
  assert.equal(record.assigned_to_email, 'daniel@wavefrontstudiostaff.com')
})

test('processes valid submissions through the shared deployment handler', async () => {
  let received
  const result = await processLead(
    { name: 'Ada', email: 'ada@example.com', source: 'chat-agent', page: '/about/' },
    {},
    async (lead) => {
      received = lead
      return { id: 'lead-456' }
    },
  )

  assert.equal(result.status, 201)
  assert.deepEqual(result.payload, { ok: true, stored: true, id: 'lead-456' })
  assert.equal(received.email, 'ada@example.com')
  assert.match(received.notes, /chat-agent form/)
})

/* ------------------------------------------------------------------ */
/* Duplicate protection                                                */
/* ------------------------------------------------------------------ */

const dupeConfig = {
  base44ApiUrl: 'https://growth-hub.example/api',
  base44AppId: 'app-123',
  base44Key: 'secret-key',
  base44Entity: 'ProspectLead',
  base44StageField: 'pipeline_stage',
  base44Stage: 'new',
  base44StatusField: 'status',
  base44Status: 'found',
  base44TimeoutMs: 1000,
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

// A fake Base44 that answers filter queries from `rows` and records writes.
function fakeBase44(rows, { failLookups = false } = {}) {
  const calls = []
  const fetchImpl = async (url, options = {}) => {
    const method = options.method || 'GET'
    calls.push({ url, method, body: options.body ? JSON.parse(options.body) : undefined })
    if (method === 'GET') {
      if (failLookups) throw new Error('network down')
      const q = new URL(url).searchParams.get('q')
      // No filter: the newest leads first, as Base44 sorts by -created_date.
      if (!q) return json([...rows].sort((a, b) => Date.parse(b.created_date) - Date.parse(a.created_date)))
      const [[field, value]] = Object.entries(JSON.parse(q))
      return json(rows.filter((row) => row[field] === value))
    }
    if (method === 'PUT') return json({ id: url.split('/').pop(), ...JSON.parse(options.body) })
    return json({ id: 'new-lead' }, 201)
  }
  return { calls, fetchImpl }
}

test('email is lower-cased so one person is one lead', () => {
  assert.equal(normalizeLead({ email: ' Ada@Example.COM ' }).email, 'ada@example.com')
})

test('finds a recent lead by email, falling back to phone', async () => {
  const rows = [
    { id: 'by-email', email: 'ada@example.com', created_date: daysAgo(3) },
    { id: 'by-phone', phone: '(941) 555-0123', created_date: daysAgo(1) },
  ]
  const { fetchImpl } = fakeBase44(rows)
  assert.equal((await findRecentLead({ email: 'ada@example.com' }, dupeConfig, fetchImpl)).id, 'by-email')
  assert.equal((await findRecentLead({ email: 'new@example.com', phone: '(941) 555-0123' }, dupeConfig, fetchImpl)).id, 'by-phone')
})

test('a duplicate saved in mixed case, or with the phone written differently, is still found', async () => {
  const rows = [
    { id: 'mixed-case', email: 'Ada@Example.com', created_date: daysAgo(20) },
    { id: 'dotted-phone', phone: '941.555.0199', created_date: daysAgo(5) },
    { id: 'too-old', email: 'Bo@Example.com', created_date: daysAgo(45) },
  ]
  const { fetchImpl } = fakeBase44(rows)
  assert.equal((await findRecentLead({ email: 'ada@example.com' }, dupeConfig, fetchImpl)).id, 'mixed-case')
  assert.equal((await findRecentLead({ phone: '+1 (941) 555-0199' }, dupeConfig, fetchImpl)).id, 'dotted-phone')
  assert.equal(await findRecentLead({ email: 'bo@example.com' }, dupeConfig, fetchImpl), null)
  assert.equal(await findRecentLead({ phone: '555' }, dupeConfig, fetchImpl), null)
})

test('a lead older than the duplicate window is not a duplicate', async () => {
  const { fetchImpl } = fakeBase44([{ id: 'old', email: 'ada@example.com', created_date: daysAgo(45) }])
  assert.equal(await findRecentLead({ email: 'ada@example.com' }, dupeConfig, fetchImpl), null)
})

test('a repeat enquiry is merged: blanks filled, nothing overwritten, message appended', async () => {
  const existing = {
    id: 'lead-1',
    email: 'ada@example.com',
    contact_name: 'Ada',
    business_name: 'Ada Surfaces',
    notes: 'First enquiry.',
    pipeline_stage: 'contacted',
    created_date: daysAgo(2),
  }
  const { calls, fetchImpl } = fakeBase44([existing])
  const lead = normalizeLead({ name: 'Ada L', email: 'ada@example.com', phone: '941 555 0123', company: 'Other Co', message: 'Also need SEO.', source: 'audit-popup', page: '/' })

  const result = await saveLead(lead, dupeConfig, fetchImpl)
  const put = calls.find((call) => call.method === 'PUT')

  assert.equal(result.merged, true)
  assert.equal(result.id, 'lead-1')
  assert.equal(calls.some((call) => call.method === 'POST'), false)
  assert.ok(put.url.endsWith('/entities/ProspectLead/lead-1'))
  // A repeat enquiry never writes contact details; the new phone is noted for a person to check.
  assert.equal('phone' in put.body, false)
  assert.match(put.body.notes, /Phone given: 941 555 0123/)
  assert.equal('contact_name' in put.body, false)
  assert.equal('business_name' in put.body, false)
  assert.equal('pipeline_stage' in put.body, false)
  assert.match(put.body.notes, /^First enquiry\.\n\nRepeat enquiry \(\d{4}-\d{2}-\d{2}\):\nAlso need SEO\./)
})

test('an unfiltered answer is never mistaken for a duplicate', async () => {
  // Simulates Base44 ignoring the filter and returning the newest lead of anyone.
  const fetchImpl = async () => json([{ id: 'someone-else', email: 'zoe@example.com', created_date: daysAgo(0) }])
  assert.equal(await findRecentLead({ email: 'ada@example.com' }, dupeConfig, fetchImpl), null)
})

test('a new person still gets a new lead', async () => {
  const { calls, fetchImpl } = fakeBase44([])
  const result = await saveLead({ name: 'Bo', email: 'bo@example.com' }, dupeConfig, fetchImpl)
  assert.equal(result.merged, false)
  assert.equal(result.id, 'new-lead')
  assert.equal(calls.filter((call) => call.method === 'POST').length, 1)
})

test('a failed duplicate check never loses the lead', async () => {
  const { calls, fetchImpl } = fakeBase44([], { failLookups: true })
  const result = await saveLead({ name: 'Bo', email: 'bo@example.com' }, dupeConfig, fetchImpl)
  assert.equal(result.id, 'new-lead')
  assert.equal(calls.filter((call) => call.method === 'POST').length, 1)
})

test('a merged enquiry is reported as stored', async () => {
  const result = await processLead({ email: 'ada@example.com' }, {}, async () => ({ id: 'lead-1', merged: true }))
  assert.equal(result.status, 200)
  assert.deepEqual(result.payload, { ok: true, stored: true, id: 'lead-1', merged: true })
})

test('rejects contactless submissions and quietly accepts honeypots', async () => {
  const contactless = await processLead({ name: 'Ada' }, {})
  const honeypot = await processLead({ email: 'bot@example.com', _gotcha: 'filled' }, {})

  assert.equal(contactless.status, 400)
  assert.deepEqual(honeypot, { status: 202, payload: { ok: true, stored: false } })
})

const SERVICE = 'service-2026-09'
const MARKETING = 'marketing-2026-09'

test('ticking the text box records the permission and the wording the site showed', () => {
  const lead = normalizeLead({
    name: 'Ada', phone: '941 555 0123', sms_consent: 'yes', sms_consent_version: SERVICE, page: '/contact/',
  })
  assert.equal(lead.smsConsent, true)
  assert.equal(lead.smsConsentText, SMS_CONSENT_VERSIONS[SERVICE])
  assert.equal(lead.smsConsentUrl, 'https://wavefrontstudiollc.com/contact/')
  assert.match(lead.smsConsentAt, /^\d{4}-\d{2}-\d{2}T/)
  assert.equal(toBase44Record(lead).sms_consent_text, SMS_CONSENT_VERSIONS[SERVICE])
})

test('the recorded wording comes from the server, never from the request', () => {
  // A page built before version ids sent the words themselves: accepted only
  // when they are exactly a wording the site has shown.
  const legacy = normalizeLead({ phone: '941 555 0123', sms_consent: 'yes', sms_consent_text: SMS_CONSENT_VERSIONS[SERVICE] })
  assert.equal(legacy.smsConsent, true)
  assert.equal(legacy.smsConsentText, SMS_CONSENT_VERSIONS[SERVICE])

  // Made-up wording, or an unknown version, is not recorded as permission.
  const forged = normalizeLead({ phone: '941 555 0123', sms_consent: 'yes', sms_consent_text: 'I agree to anything.', message: 'Hi' })
  assert.equal(forged.smsConsent, undefined)
  assert.equal(forged.smsConsentText, undefined)
  assert.match(forged.notes, /no permission to text was recorded/)
  const unknown = normalizeLead({ phone: '941 555 0123', sms_consent: 'yes', sms_consent_version: 'service-1999' })
  assert.equal(unknown.smsConsent, undefined)
})

test('the marketing box is recorded on its own, separate from service texts', () => {
  const both = normalizeLead({
    name: 'Ada', phone: '941 555 0123', page: '/contact/',
    sms_consent: 'yes', sms_consent_version: SERVICE,
    sms_marketing_consent: 'yes', sms_marketing_consent_version: MARKETING,
  })
  assert.equal(both.smsConsent, true)
  assert.equal(both.smsMarketingConsent, true)
  const record = toBase44Record(both)
  assert.equal(record.sms_consent_text, SMS_CONSENT_VERSIONS[SERVICE])
  assert.equal(record.sms_marketing_consent_text, SMS_CONSENT_VERSIONS[MARKETING])
  assert.equal(record.sms_marketing_consent, true)

  // Service texts without marketing: the marketing fields stay empty, which is
  // what keeps the two consents separate for the Campaign Registry.
  const serviceOnly = normalizeLead({
    name: 'Ada', phone: '941 555 0123', page: '/contact/',
    sms_consent: 'yes', sms_consent_version: SERVICE,
  })
  assert.equal(serviceOnly.smsMarketingConsent, undefined)
  assert.equal('sms_marketing_consent' in toBase44Record(serviceOnly), false)
})

test('leaving the text box unticked stores no permission and no wording', () => {
  const lead = normalizeLead({ name: 'Ada', phone: '941 555 0123', sms_consent_version: SERVICE })
  assert.equal(lead.smsConsent, undefined)
  assert.equal(lead.smsConsentText, undefined)
  assert.equal('sms_consent_text' in toBase44Record(lead), false)
})

test('a repeat enquiry can add permission to text, and never takes it away', async () => {
  // "No" is the CRM's default for anyone who never ticked the box, so it does
  // not stand in the way of a new tick.
  const rows = [{ id: 'lead-1', email: 'ada@example.com', sms_consent: false, created_date: daysAgo(2) }]
  const withConsent = fakeBase44(rows)
  await saveLead(
    normalizeLead({ email: 'ada@example.com', sms_consent: 'yes', sms_consent_version: SERVICE, page: '/contact/' }),
    dupeConfig,
    withConsent.fetchImpl,
  )
  const put = withConsent.calls.find((call) => call.method === 'PUT')
  assert.equal(put.body.sms_consent, true)
  assert.equal(put.body.sms_consent_text, SMS_CONSENT_VERSIONS[SERVICE])

  const rowsGranted = [{ id: 'lead-1', email: 'ada@example.com', sms_consent: true, created_date: daysAgo(2) }]
  const without = fakeBase44(rowsGranted)
  await saveLead(normalizeLead({ email: 'ada@example.com', message: 'One more thing' }), dupeConfig, without.fetchImpl)
  const second = without.calls.find((call) => call.method === 'PUT')
  assert.equal('sms_consent' in second.body, false, 'not ticking again leaves the earlier permission alone')
})

test('a web form never switches texting back on after a STOP', async () => {
  const tick = (extra = {}) =>
    normalizeLead({ name: 'Ada', phone: '941 555 0123', sms_consent: 'yes', sms_consent_version: SERVICE, page: '/contact/', ...extra })

  // Same lead, matched by email, marked do not contact by the CRM's STOP handling.
  const merged = fakeBase44([{ id: 'lead-1', email: 'ada@example.com', do_not_call: true, created_date: daysAgo(2) }])
  await saveLead(normalizeLead({ email: 'ada@example.com', sms_consent: 'yes', sms_consent_version: SERVICE, page: '/' }), dupeConfig, merged.fetchImpl)
  const put = merged.calls.find((call) => call.method === 'PUT')
  assert.equal('sms_consent' in put.body, false)
  assert.match(put.body.notes, /opted out of texts before/)

  // A new lead for a number marked do not contact on an older record, written
  // another way, outside the duplicate window.
  const fresh = fakeBase44([{ id: 'old-lead', phone: '(941) 555-0123', do_not_call: true, created_date: daysAgo(400) }])
  await saveLead(tick(), dupeConfig, fresh.fetchImpl)
  const post = fresh.calls.find((call) => call.method === 'POST')
  assert.equal('sms_consent' in post.body, false)
  assert.equal('sms_consent_text' in post.body, false)
  assert.match(post.body.notes, /text START/)

  // The lead was deleted, but the number is still on the CRM's suppression list.
  const suppressed = fakeBase44([{ type: 'phone', value: '9415550123', reason: 'sms_stop' }])
  await saveLead(tick(), dupeConfig, suppressed.fetchImpl)
  assert.equal('sms_consent' in suppressed.calls.find((call) => call.method === 'POST').body, false)

  // Someone else's opt-out does not touch this number.
  const other = fakeBase44([{ id: 'other', phone: '941 555 9999', do_not_call: true, created_date: daysAgo(10) }])
  await saveLead(tick(), dupeConfig, other.fetchImpl)
  assert.equal(other.calls.find((call) => call.method === 'POST').body.sms_consent, true)
})

test('an unreadable suppression list falls back to the lead records', async () => {
  const rows = [{ id: 'old-lead', phone: '941.555.0123', do_not_call: true, created_date: daysAgo(90) }]
  const { calls, fetchImpl } = fakeBase44(rows)
  const guarded = async (url, options = {}) =>
    url.includes('/entities/SuppressionList') ? json({ message: 'Forbidden' }, 403) : fetchImpl(url, options)
  await saveLead(
    normalizeLead({ name: 'Ada', phone: '941 555 0123', sms_consent: 'yes', sms_consent_version: SERVICE, page: '/' }),
    dupeConfig,
    guarded,
  )
  const post = calls.find((call) => call.method === 'POST')
  assert.equal('sms_consent' in post.body, false)
  assert.match(post.body.notes, /opted out of texts before/)
})

test('if the STOP check fails, permission is held back rather than assumed', async () => {
  const { calls, fetchImpl } = fakeBase44([], { failLookups: true })
  await saveLead(
    normalizeLead({ name: 'Ada', phone: '941 555 0123', sms_consent: 'yes', sms_consent_version: SERVICE, page: '/' }),
    dupeConfig,
    fetchImpl,
  )
  const post = calls.find((call) => call.method === 'POST')
  assert.equal('sms_consent' in post.body, false)
  assert.match(post.body.notes, /check for an earlier STOP on this number failed/)
})

test('a merge that fails still stores the enquiry as a new lead', async () => {
  const existing = { id: 'lead-1', email: 'ada@example.com', created_date: daysAgo(2) }
  const { calls, fetchImpl } = fakeBase44([existing])
  const failingPut = async (url, options = {}) => {
    if ((options.method || 'GET') === 'PUT') throw new Error('record was deleted')
    return fetchImpl(url, options)
  }
  const lead = normalizeLead({ name: 'Ada', email: 'ada@example.com', message: 'Second enquiry.', page: '/' })
  const result = await saveLead(lead, dupeConfig, failingPut)
  assert.equal(result.merged, false)
  assert.equal(result.id, 'new-lead')
  assert.equal(calls.some((call) => call.method === 'POST'), true)
})

test('a rejected lead logs the reason without the person\'s email or phone', async () => {
  const fetchImpl = async () => json({ message: 'Invalid record: email "ada@example.com" or phone (941) 555-0123 not accepted' }, 422)
  await assert.rejects(createLead(normalizeLead({ name: 'Ada', email: 'ada@example.com' }), dupeConfig, fetchImpl), (error) => {
    assert.doesNotMatch(error.message, /ada@example\.com|555-0123/)
    assert.match(error.message, /\[email\].*\[number\]/)
    return true
  })
})
