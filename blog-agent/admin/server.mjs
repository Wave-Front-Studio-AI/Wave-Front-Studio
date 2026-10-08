// Local admin panel for publishing blog drafts.
//
//   npm run blog:admin
//
// It runs on this machine only (127.0.0.1) and does what you would otherwise do
// by hand: publish a draft into posts.js and routes.js, check and build the site,
// commit, and push. Nothing here is reachable from the internet, and no password
// is stored anywhere: each start prints a one-time link that carries a random
// token, and every request must present it. Deploying happens only when you
// press Push, because pushing main deploys the site on Vercel.

import http from 'node:http'
import { spawn } from 'node:child_process'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve, basename } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const draftsDir = resolve(root, 'blog-agent/drafts')
const PORT = Number(process.env.BLOG_ADMIN_PORT || 4310)
const HOST = '127.0.0.1'
const token = randomBytes(24).toString('hex')

const run = (cmd, args, { timeout = 600000, keepAll = false } = {}) => new Promise((done) => {
  const child = spawn(cmd, args, { cwd: root, env: process.env })
  let out = ''
  const timer = setTimeout(() => child.kill('SIGKILL'), timeout)
  child.stdout.on('data', (d) => { out += d })
  child.stderr.on('data', (d) => { out += d })
  child.on('error', (e) => { clearTimeout(timer); done({ ok: false, out: String(e) }) })
  child.on('close', (code) => { clearTimeout(timer); done({ ok: code === 0, out: keepAll ? out : out.slice(-20000) }) })
})

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })

async function draftFile(name) {
  const safe = basename(String(name || ''))
  const all = await readdir(draftsDir)
  if (!/^[\w.-]+\.mjs$/.test(safe) || safe.startsWith('_') || !all.includes(safe)) throw new Error('Unknown draft')
  return resolve(draftsDir, safe)
}

async function gitState() {
  const [branch, status, ahead] = await Promise.all([
    run('git', ['rev-parse', '--abbrev-ref', 'HEAD']),
    run('git', ['status', '--short']),
    run('git', ['rev-list', '--count', '@{u}..HEAD']),
  ])
  return {
    branch: branch.out.trim(),
    changes: status.out.split('\n').filter(Boolean),
    ahead: ahead.ok ? Number(ahead.out.trim()) : null,
  }
}

const actions = {
  async state() {
    const inspected = await run('node', ['blog-agent/admin/inspect.mjs'], { keepAll: true })
    if (!inspected.ok) return { error: inspected.out }
    return { ...JSON.parse(inspected.out.split('\n').filter(Boolean).pop()), git: await gitState() }
  },

  // Publish one draft. If it is dated in the future, the publisher would hold
  // it, so "publishNow" moves its date to today first (a visible edit to the
  // draft file, shown in the commit).
  async publish({ file, publishNow }) {
    const path = await draftFile(file)
    let note = ''
    if (publishNow) {
      const src = await readFile(path, 'utf8')
      const next = src.replace(/(\n\s*date:\s*')\d{4}-\d{2}-\d{2}(')/, `$1${today()}$2`)
      if (next !== src) { await writeFile(path, next, 'utf8'); note = `Date set to ${today()}.\n` }
    }
    const res = await run('node', ['blog-agent/publish-post.mjs', path])
    return { ok: res.ok, out: note + res.out }
  },

  async check() {
    const lint = await run('npm', ['run', 'check'])
    if (!lint.ok) return { ok: false, out: lint.out }
    const build = await run('npm', ['run', 'build'])
    return { ok: build.ok, out: lint.out + '\n' + build.out }
  },

  async commit({ message }) {
    const msg = String(message || '').trim()
    if (!msg || msg.length > 200) throw new Error('Commit message needs 1 to 200 characters')
    const add = await run('git', ['add', 'src/data/generated/posts.js', 'src/routes.js', 'blog-agent/drafts', 'public/images/blog', 'scripts/make-post-cards.mjs'])
    if (!add.ok) return add
    return run('git', ['commit', '-m', msg])
  },

  async push() {
    const git = await gitState()
    if (git.branch !== 'main') throw new Error(`On branch ${git.branch}, not main. Push it by hand.`)
    if (git.changes.length) throw new Error('There are uncommitted changes. Commit first.')
    return run('git', ['push', 'origin', 'main'])
  },
}

const sameToken = (given) => {
  const a = Buffer.from(String(given || ''))
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}

const server = http.createServer(async (req, res) => {
  const send = (code, body, type = 'application/json') => {
    res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
    res.end(type === 'application/json' ? JSON.stringify(body) : body)
  }
  // Refuse anything not addressed to this machine by name: stops DNS rebinding.
  const hostOk = [`127.0.0.1:${PORT}`, `localhost:${PORT}`].includes(req.headers.host)
  if (!hostOk) return send(403, { error: 'Forbidden' })

  const url = new URL(req.url, `http://${req.headers.host}`)
  try {
    if (req.method === 'GET' && url.pathname === '/') {
      return send(200, await readFile(resolve(import.meta.dirname, 'index.html'), 'utf8'), 'text/html; charset=utf-8')
    }
    if (req.method === 'GET' && /^\/img\/[\w-]+\.webp$/.test(url.pathname)) {
      const img = await readFile(resolve(root, 'public/images/blog', basename(url.pathname))).catch(() => null)
      if (!img) return send(404, { error: 'No image' })
      res.writeHead(200, { 'content-type': 'image/webp', 'cache-control': 'no-store' })
      return res.end(img)
    }
    if (req.method === 'POST' && url.pathname.startsWith('/api/')) {
      if (!sameToken(req.headers['x-admin-token'])) return send(401, { error: 'Bad token. Use the link printed in the terminal.' })
      if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(415, { error: 'JSON only' })
      const name = url.pathname.slice(5)
      if (!Object.hasOwn(actions, name)) return send(404, { error: 'No such action' })
      let raw = ''
      for await (const chunk of req) { raw += chunk; if (raw.length > 10000) return send(413, { error: 'Too large' }) }
      return send(200, await actions[name](raw ? JSON.parse(raw) : {}))
    }
    send(404, { error: 'Not found' })
  } catch (e) {
    send(400, { error: e.message })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`\nBlog admin is running. Open this link (it only works while this is running):\n\n  http://localhost:${PORT}/#${token}\n\nPress Ctrl+C to stop.\n`)
})
