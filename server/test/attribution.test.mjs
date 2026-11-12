import assert from 'node:assert/strict'
import test from 'node:test'
import { attributionFrom, leadSourceFor } from '../lib/attribution.mjs'
import { createLead, mergeIntoLead, toBase44Record } from '../lib/base44.mjs'
import { normalizeLead } from '../lib/normalizeLead.mjs'

test('lead source picks only values the CRM list accepts', () => {
  assert.equal(leadSourceFor({ source: 'facebook', medium: 'paid_social' }), 'meta_ad')
  assert.equal(leadSourceFor({ source: 'instagram', medium: 'cpc' }), 'meta_ad')
  assert.equal(leadSourceFor({ fbclid: 'IwAR123' }), 'meta_ad')
  assert.equal(leadSourceFor({ source: 'facebook', medium: 'social' }), 'social')
  assert.equal(leadSourceFor({ source: 'referral:www.google.com' }), 'seo_organic')
  assert.equal(leadSourceFor({ source: 'referral:l.facebook.com' }), 'social')
  assert.equal(leadSourceFor({ source: 'referral:somedirectory.org' }), 'referral')
  assert.equal(leadSourceFor({ source: 'mailchimp', medium: 'email' }), undefined)
  assert.equal(leadSourceFor({}), undefined)
})

test('an email click fills the UTM and touch fields and keeps the default lead source', () => {
  const lead = normalizeLead({
    name: 'Ada', email: 'ada@example.com', source: 'one-dollar-website', page: '/1-dollar-website/',
    labelled: { utm_source: 'mailchimp', utm_medium: 'email', utm_campaign: 'dollar-website', utm_content: 'launch-email', utm_term: 'atlas' },
  })
  assert.equal(lead.utmSource, 'mailchimp')
  assert.equal(lead.utmCampaign, 'dollar-website')
  assert.equal(lead.utmContent, 'launch-email')
  assert.equal(lead.utmTerm, 'atlas')
  assert.equal(lead.leadSource, undefined)
  const touch = JSON.parse(lead.firstTouch)
  assert.equal(touch.campaign, 'dollar-website')
  assert.equal(touch.page, '/1-dollar-website/')
  assert.equal(lead.lastTouch, lead.firstTouch)
})

test('no tags means no UTM fields, and "direct" is not stored as a source', () => {
  const lead = normalizeLead({ name: 'Ada', email: 'ada@example.com', labelled: { utm_source: 'direct' } })
  for (const key of ['utmSource', 'utmMedium', 'utmCampaign', 'firstTouch', 'lastTouch', 'leadSource']) assert.equal(lead[key], undefined, key)
  assert.deepEqual(attributionFrom({}), { firstTouch: undefined, lastTouch: undefined, leadSource: undefined })
})

test('a Meta ad lead is saved with lead_source meta_ad and its UTM fields', async () => {
  let sent
  const fetchImpl = async (url, init) => {
    sent = JSON.parse(init.body)
    return new Response(JSON.stringify({ id: 'x1' }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const lead = normalizeLead({ name: 'Ada', email: 'ada@example.com', labelled: { utm_source: 'facebook', utm_medium: 'paid_social', utm_campaign: 'black-friday-2026', utm_content: 'carousel-a', fbclid: 'IwAR9' } })
  const config = { base44AppId: 'app', base44Key: 'key', base44ApiUrl: 'https://base44.example', base44Entity: 'ProspectLead', base44StageField: 'pipeline_stage', base44Stage: 'new', base44StatusField: 'status', base44Status: 'found', base44LeadSource: 'website' }
  await createLead(lead, config, fetchImpl)
  assert.equal(sent.lead_source, 'meta_ad')
  assert.equal(sent.utm_campaign, 'black-friday-2026')
  assert.equal(sent.utm_content, 'carousel-a')
  assert.equal(sent.fbclid, 'IwAR9')
  assert.ok(sent.first_touch && sent.last_touch)
})

test('an untagged lead still gets the default lead source', async () => {
  let sent
  const fetchImpl = async (url, init) => {
    sent = JSON.parse(init.body)
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const config = { base44AppId: 'app', base44Key: 'key', base44ApiUrl: 'https://base44.example', base44Entity: 'ProspectLead', base44StageField: 'pipeline_stage', base44Stage: 'new', base44StatusField: 'status', base44Status: 'found', base44LeadSource: 'website' }
  await createLead(normalizeLead({ name: 'Ada', email: 'ada@example.com' }), config, fetchImpl)
  assert.equal(sent.lead_source, 'website')
  assert.equal(sent.utm_source, undefined)
})

test('a repeat enquiry updates the last touch but never the first touch', async () => {
  let sent
  const fetchImpl = async (url, init) => {
    sent = JSON.parse(init.body)
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const config = { base44AppId: 'app', base44Key: 'key', base44ApiUrl: 'https://base44.example', base44Entity: 'ProspectLead' }
  const existing = { id: 'e1', email: 'ada@example.com', first_touch: '{"campaign":"old"}', last_touch: '{"campaign":"old"}', utm_campaign: 'old', notes: '' }
  const lead = normalizeLead({ name: 'Ada', email: 'ada@example.com', labelled: { utm_source: 'mailchimp', utm_medium: 'email', utm_campaign: 'black-friday-2026' } })
  await mergeIntoLead(existing, lead, config, fetchImpl)
  assert.equal(sent.first_touch, undefined)
  assert.equal(sent.utm_campaign, undefined)
  assert.equal(JSON.parse(sent.last_touch).campaign, 'black-friday-2026')
  assert.ok(toBase44Record(lead).last_touch)
})
