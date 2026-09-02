import { loadConfig } from '../server/lib/config.mjs'
import { processLead } from '../server/lib/processLead.mjs'
import { normalizeLead } from '../server/lib/normalizeLead.mjs'

const MAX_BODY_BYTES = 32 * 1024
const recent = new Map()

function originAllowed(request, config) {
  const origin = request.headers.origin
  if (!origin) return true
  if (config.allowedOrigins.includes(origin)) return true
  try {
    return new URL(origin).host === request.headers.host
  } catch {
    return false
  }
}

function applyHeaders(request, response, config) {
  response.setHeader('cache-control', 'no-store')
  const origin = request.headers.origin
  const allowed = originAllowed(request, config)
  if (origin && allowed) {
    response.setHeader('access-control-allow-origin', origin)
    response.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS')
    response.setHeader('access-control-allow-headers', 'content-type')
    response.setHeader('vary', 'Origin')
  }
  return allowed
}

function limited(request) {
  const ip = String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const now = Date.now()
  if (recent.size > 1000) {
    const cutoff = now - 10 * 60 * 1000
    for (const [key, times] of recent) {
      const active = times.filter((time) => time > cutoff)
      if (active.length) recent.set(key, active)
      else recent.delete(key)
    }
  }
  const hits = (recent.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000)
  hits.push(now)
  recent.set(ip, hits)
  return hits.length > 5
}

function rateLimitCandidate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || body._gotcha || body.website_url) return false
  const lead = normalizeLead(body)
  return Boolean(lead.email || lead.phone)
}

function parseBody(body) {
  const parsed = typeof body === 'string' ? JSON.parse(body) : body
  if (Buffer.byteLength(JSON.stringify(parsed || {}), 'utf8') > MAX_BODY_BYTES) {
    const error = new Error('too_large')
    error.code = 'too_large'
    throw error
  }
  return parsed
}

export default async function handler(request, response) {
  const config = loadConfig()
  const allowed = applyHeaders(request, response, config)

  if (!allowed) return response.status(403).json({ ok: false, error: 'Origin not allowed.' })
  if (request.method === 'OPTIONS') return response.status(204).end()
  if (request.method === 'GET') {
    return response.status(200).json({ ok: Boolean(config.base44AppId && config.base44Key), entity: config.base44Entity })
  }
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Method not allowed.' })

  let body
  try {
    body = parseBody(request.body)
  } catch (error) {
    return response.status(error.code === 'too_large' ? 413 : 400).json({ ok: false, error: 'Invalid request.' })
  }

  if (rateLimitCandidate(body) && limited(request)) {
    return response.status(429).json({ ok: false, error: 'Too many requests. Try again shortly.' })
  }

  const result = await processLead(body, config)
  return response.status(result.status).json(result.payload)
}
