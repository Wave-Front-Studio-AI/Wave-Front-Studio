import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../../api/lead.js'

function responseMock() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
    end() {
      return this
    },
  }
}

test('Vercel lead endpoint exposes a configuration-safe health response', async () => {
  const response = responseMock()
  await handler({ method: 'GET', headers: {} }, response)

  assert.equal(response.statusCode, 200)
  assert.equal(typeof response.body.ok, 'boolean')
  assert.equal(response.body.entity, 'ProspectLead')
  assert.equal(response.headers['cache-control'], 'no-store')
})

test('Vercel lead endpoint validates requests and preserves honeypot behavior', async () => {
  const invalid = responseMock()
  await handler({ method: 'POST', headers: {}, body: { name: 'No contact' }, socket: {} }, invalid)
  assert.equal(invalid.statusCode, 400)

  const honeypot = responseMock()
  await handler({ method: 'POST', headers: {}, body: { email: 'bot@example.com', _gotcha: 'filled' }, socket: {} }, honeypot)
  assert.equal(honeypot.statusCode, 202)
  assert.deepEqual(honeypot.body, { ok: true, stored: false })
})

test('Vercel lead endpoint enforces the request-size limit', async () => {
  const response = responseMock()
  await handler({ method: 'POST', headers: {}, body: { email: 'ada@example.com', message: 'x'.repeat(33 * 1024) }, socket: {} }, response)
  assert.equal(response.statusCode, 413)
})
