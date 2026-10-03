import assert from 'node:assert/strict'
import test from 'node:test'
import { LOST_LEAD_ENDPOINT, STEPS, callCalculator, readContext, stepError } from './lostLeadAnalysis.js'

test('a trade show QR link carries the rep and the show', () => {
  const ctx = readContext('?rep=carla&event=Orlando%20Home%20Show&utm_source=qr&utm_campaign=fall')
  assert.deepEqual(ctx, { rep: 'carla', event: 'Orlando Home Show', utm: { utm_source: 'qr', utm_campaign: 'fall' } })
})

test('?show= works as well as ?event=, and an ordinary visit carries nothing', () => {
  assert.equal(readContext('?show=Tampa%20Expo').event, 'Tampa Expo')
  assert.deepEqual(readContext(''), { rep: '', event: '', utm: {} })
})

test('link values are trimmed and kept short', () => {
  const long = 'x'.repeat(500)
  const ctx = readContext(`?rep=%20%20jt%20&event=${long}`)
  assert.equal(ctx.rep, 'jt')
  assert.equal(ctx.event.length, 120)
})

test('the steps ask what the app calculator asks, in the same four groups', () => {
  assert.deepEqual(STEPS.map((s) => s.key), ['business', 'marketing', 'leads', 'growth'])
  const names = STEPS.flatMap((s) => s.fields.map((f) => f.name))
  for (const name of [
    'business_name', 'contact_name', 'industry', 'email', 'phone', 'location', 'monthly_revenue', 'average_customer_value',
    'monthly_marketing_spend', 'runs_google_ads', 'runs_meta_ads', 'social_activity', 'website_traffic',
    'leads_per_month', 'close_rate', 'missed_calls_per_month', 'google_reviews', 'uses_crm', 'does_email_sms_followup',
    'desired_monthly_revenue',
  ]) assert.ok(names.includes(name), `missing ${name}`)
})

test('each step holds back until its required answers are in', () => {
  const business = { business_name: 'Acme Pools', contact_name: 'Sam', email: 'sam@acme.com', phone: '(941) 555-0123', monthly_revenue: '40000', average_customer_value: '2500' }
  assert.equal(stepError('business', business), '')
  assert.match(stepError('business', { ...business, contact_name: '' }), /required/)
  assert.match(stepError('business', { ...business, email: 'sam@acme' }), /email/)
  assert.match(stepError('business', { ...business, phone: '555-0123' }), /phone/)
  assert.match(stepError('marketing', {}), /required/)
  assert.equal(stepError('marketing', { monthly_marketing_spend: '0' }), '', 'zero spend is an answer')
  assert.match(stepError('leads', { leads_per_month: '40' }), /required/)
  assert.equal(stepError('growth', {}), '', 'the last step has nothing required')
})

test('answers go to the app calculator as the app page sends them', async () => {
  let sent
  const fakeFetch = async (url, init) => {
    sent = { url, init }
    return new Response(JSON.stringify({ ok: true, lost_revenue: 1000 }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const data = await callCalculator({ action: 'complete', answers: { email: 'a@b.co' }, event: 'Expo', rep: 'jt', utm: {}, assessment_id: 'as1' }, fakeFetch)
  assert.equal(data.lost_revenue, 1000)
  assert.equal(sent.url, LOST_LEAD_ENDPOINT)
  assert.equal(sent.init.method, 'POST')
  assert.equal(sent.init.headers['Content-Type'], 'application/json')
  assert.deepEqual(JSON.parse(sent.init.body), { action: 'complete', answers: { email: 'a@b.co' }, event: 'Expo', rep: 'jt', utm: {}, assessment_id: 'as1' })
})

test('the calculator lives on the public functions path, never a login page or a base44 address', () => {
  assert.equal(LOST_LEAD_ENDPOINT, 'https://wavefrontstudiostaff.com/functions/lost-lead-calculator')
  assert.doesNotMatch(LOST_LEAD_ENDPOINT, /base44/)
})

test("the server's own words come back when it refuses", async () => {
  const refusing = async () => new Response(JSON.stringify({ ok: false, error: 'Please enter a valid email address.' }), { status: 400 })
  await assert.rejects(callCalculator({}, refusing), /Please enter a valid email address\./)
  const busy = async () => new Response(JSON.stringify({ ok: false, error: 'Too many requests. Please try again shortly.' }), { status: 429 })
  await assert.rejects(callCalculator({}, busy), /Too many requests/)
})

test('a dropped connection or a non-JSON reply gives a plain retry message', async () => {
  const dropped = async () => { throw new TypeError('Failed to fetch') }
  await assert.rejects(callCalculator({}, dropped), /check your connection/)
  const html = async () => new Response('<html>Bad gateway</html>', { status: 502 })
  await assert.rejects(callCalculator({}, html), /Please try again/)
})
