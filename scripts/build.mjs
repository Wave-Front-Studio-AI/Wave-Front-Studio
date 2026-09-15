// Runs the three build steps with one shared BUILD_DATE, so the client bundle,
// the server bundle and the prerender agree on which scheduled pages are live
// (src/data/schedule.js), even if a build runs across midnight.
import { spawnSync } from 'node:child_process'

process.env.BUILD_DATE ||= new Date().toISOString().slice(0, 10)

const steps = [
  'vite build',
  'vite build --ssr src/entry-server.jsx --outDir dist-ssr',
  'node scripts/prerender.mjs',
]

for (const step of steps) {
  const { status } = spawnSync(step, { stdio: 'inherit', shell: true, env: process.env })
  if (status !== 0) process.exit(status ?? 1)
}
