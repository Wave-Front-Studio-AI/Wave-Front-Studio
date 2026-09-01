import test from 'node:test'
import assert from 'node:assert/strict'
import { createLead, resolveBusinessName, toBase44Record } from '../lib/base44.mjs'
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

test('rejects contactless submissions and quietly accepts honeypots', async () => {
  const contactless = await processLead({ name: 'Ada' }, {})
  const honeypot = await processLead({ email: 'bot@example.com', _gotcha: 'filled' }, {})

  assert.equal(contactless.status, 400)
  assert.deepEqual(honeypot, { status: 202, payload: { ok: true, stored: false } })
})
