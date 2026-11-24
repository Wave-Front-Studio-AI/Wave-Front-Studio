// Runs the three build steps with one shared BUILD_DATE, so the client bundle,
// the server bundle and the prerender agree on which scheduled pages are live
// (src/data/schedule.js), even if a build runs across midnight.
import { spawnSync } from 'node:child_process'

process.env.BUILD_DATE ||= new Date().toISOString().slice(0, 10)
// A full timestamp as well: the $1 Website deal ends at 05:00Z on Dec 2, so a
// date alone cannot say which side of the cutoff a build is on.
process.env.BUILD_TIME ||= new Date().toISOString()

const steps = [
  'vite build',
  'vite build --ssr src/entry-server.jsx --outDir dist-ssr',
  'node scripts/prerender.mjs',
  'node scripts/write-packages-json.mjs',
]

for (const step of steps) {
  const { status } = spawnSync(step, { stdio: 'inherit', shell: true, env: process.env })
  if (status !== 0) process.exit(status ?? 1)
}
