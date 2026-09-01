import { loadConfig } from '../server/lib/config.mjs'
import { processLead } from '../server/lib/processLead.mjs'

const MAX_BODY_BYTES = 32 * 1024
const recent = new Map()

function applyHeaders(request, response, config) {
  response.setHeader('cache-control', 'no-store')
  const origin = request.headers.origin
  if (!origin || !config.allowedOrigins.includes(origin)) return
  response.setHeader('access-control-allow-origin', origin)
  response.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS')
  response.setHeader('access-control-allow-headers', 'content-type')
  response.setHeader('vary', 'Origin')
}

function limited(request) {
  const ip = String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000)
  hits.push(now)
  recent.set(ip, hits)
  return hits.length > 5
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
  applyHeaders(request, response, config)

  if (request.method === 'OPTIONS') return response.status(204).end()
  if (request.method === 'GET') {
    return response.status(200).json({ ok: Boolean(config.base44AppId && config.base44Key), entity: config.base44Entity })
  }
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  if (limited(request)) return response.status(429).json({ ok: false, error: 'Too many requests. Try again shortly.' })

  let body
  try {
    body = parseBody(request.body)
  } catch (error) {
    return response.status(error.code === 'too_large' ? 413 : 400).json({ ok: false, error: 'Invalid request.' })
  }

  const result = await processLead(body, config)
  return response.status(result.status).json(result.payload)
}
