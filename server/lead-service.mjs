#!/usr/bin/env node
import http from 'node:http'
import { loadConfig } from './lib/config.mjs'
import { processLead } from './lib/processLead.mjs'

const config = loadConfig()
const maxBody = 32 * 1024
const recent = new Map()

function cors(request) {
  const origin = request.headers.origin
  if (!origin || !config.allowedOrigins.includes(origin)) return {}
  return { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type', vary: 'Origin' }
}

function respond(response, status, payload, headers = {}) {
  const body = JSON.stringify(payload)
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers })
  response.end(body)
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBody) reject(new Error('too_large'))
      else chunks.push(chunk)
    })
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })
}

function limited(request) {
  const ip = String(request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown').split(',')[0].trim()
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000)
  hits.push(now)
  recent.set(ip, hits)
  return hits.length > 5
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
  const headers = cors(request)
  if (request.method === 'OPTIONS') return respond(response, 204, {}, headers)
  if (request.method === 'GET' && url.pathname === '/api/lead/health') {
    return respond(response, 200, { ok: Boolean(config.base44AppId && config.base44Key), entity: config.base44Entity }, headers)
  }
  if (request.method !== 'POST' || url.pathname !== '/api/lead') return respond(response, 404, { ok: false, error: 'Not found.' }, headers)
  if (limited(request)) return respond(response, 429, { ok: false, error: 'Too many requests. Try again shortly.' }, headers)

  let body
  try {
    body = JSON.parse(await readBody(request))
  } catch (error) {
    return respond(response, error.message === 'too_large' ? 413 : 400, { ok: false, error: 'Invalid request.' }, headers)
  }
  const result = await processLead(body, config)
  return respond(response, result.status, result.payload, headers)
})

server.listen(config.port, '127.0.0.1', () => {
  console.log(JSON.stringify({ event: 'lead_service_ready', port: config.port, entity: config.base44Entity }))
})
