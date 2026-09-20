import test from 'node:test'
import assert from 'node:assert/strict'
import { createLead, findRecentLead, resolveBusinessName, saveLead, toBase44Record } from '../lib/base44.mjs'
import { normalizeLead } from '../lib/normalizeLead.mjs'
import { processLead } from '../lib/processLead.mjs'

test('normalizes enquiry forms and preserves labelled answers', () => {
  const lead = normalizeLead({ name: 'Ada', email: 'ada@example.com', website: 'supa.com', message: 'A new site', source: 'contact', page: '/contact/', labelled: { Subject: 'Website Development' } })
  assert.equal(lead.name, 'Ada')
  assert.equal(lead.email, 'ada@example.com')
  assert.match(lead.notes, /Website Development/)
  assert.equal(lead.website, 'https://supa.com')
  assert.equal(lead.consentUrl, 'https://wavefrontstudiollc.com/contact/')
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
      const query = JSON.parse(new URL(url).searchParams.get('q'))
      const [[field, value]] = Object.entries(query)
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
  assert.equal(put.body.phone, '941 555 0123')
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

test('ticking the text box records the permission and the exact wording shown', () => {
  const wording = 'Text me too. I agree to receive texts from Wavefront Studio LLC at this number.'
  const lead = normalizeLead({
    name: 'Ada', phone: '941 555 0123', sms_consent: 'yes', sms_consent_text: wording, page: '/contact/',
  })
  assert.equal(lead.smsConsent, true)
  assert.equal(lead.smsConsentText, wording)
  assert.equal(lead.smsConsentUrl, 'https://wavefrontstudiollc.com/contact/')
  assert.match(lead.smsConsentAt, /^\d{4}-\d{2}-\d{2}T/)
  assert.equal(toBase44Record(lead).sms_consent_text, wording)
})

test('leaving the text box unticked stores no permission and no wording', () => {
  const lead = normalizeLead({ name: 'Ada', phone: '941 555 0123', sms_consent_text: 'Text me too.' })
  assert.equal(lead.smsConsent, undefined)
  assert.equal(lead.smsConsentText, undefined)
  assert.equal('sms_consent_text' in toBase44Record(lead), false)
})

test('a repeat enquiry can add permission to text, and never takes it away', async () => {
  const rows = [{ id: 'lead-1', email: 'ada@example.com', sms_consent: false, created_date: daysAgo(2) }]
  const withConsent = fakeBase44(rows)
  await saveLead(
    normalizeLead({ email: 'ada@example.com', sms_consent: 'yes', sms_consent_text: 'Text me too.', page: '/contact/' }),
    dupeConfig,
    withConsent.fetchImpl,
  )
  const put = withConsent.calls.find((call) => call.method === 'PUT')
  assert.equal(put.body.sms_consent, true)
  assert.equal(put.body.sms_consent_text, 'Text me too.')

  const rowsGranted = [{ id: 'lead-1', email: 'ada@example.com', sms_consent: true, created_date: daysAgo(2) }]
  const without = fakeBase44(rowsGranted)
  await saveLead(normalizeLead({ email: 'ada@example.com', message: 'One more thing' }), dupeConfig, without.fetchImpl)
  const second = without.calls.find((call) => call.method === 'PUT')
  assert.equal('sms_consent' in second.body, false, 'not ticking again leaves the earlier permission alone')
})
