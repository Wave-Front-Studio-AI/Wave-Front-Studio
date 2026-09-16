/* global __BUILD_DATE__ */
// Pages that go live on a date instead of on merge. Each slug in ROLLOUT gets
// the next weekday after the one before it, starting on ROLLOUT_START, and
// only exists on the site (route, sitemap, hub listing, assistant) once a
// build runs on or after that date. The weekday rebuild in
// .github/workflows/scheduled-publish.yml is what makes them appear.
//
// To move the whole rollout, change ROLLOUT_START (use a Monday). To change
// the order or hold a page back, move or remove its slug.

export const ROLLOUT_START = '2026-09-28'

// Paused 2026-09-16: hold the national pages until the Tampa Bay pages rank,
// so a batch of remote-city pages does not read as doorway pages. While true,
// no slug in ROLLOUT goes live, whatever its date. Set to false to resume.
export const ROLLOUT_PAUSED = true

export const ROLLOUT = [
  'web-design-florida',
  'web-design-miami-fl',
  'web-design-orlando-fl',
  'web-design-texas',
  'web-design-houston-tx',
  'web-design-dallas-tx',
  'web-design-austin-tx',
  'web-design-san-antonio-tx',
  'web-design-california',
  'web-design-los-angeles-ca',
  'web-design-san-diego-ca',
  'web-design-new-york',
  'web-design-new-york-ny',
  'web-design-georgia',
  'web-design-atlanta-ga',
  'web-design-north-carolina',
  'web-design-arizona',
  'web-design-tennessee',
  'web-design-colorado',
  'web-design-south-carolina',
]

// One date for the whole build. Vite bakes __BUILD_DATE__ into both bundles
// and scripts/build.mjs sets BUILD_DATE for the prerender, so every step of a
// build agrees on which pages are live.
export const BUILD_DATE =
  typeof __BUILD_DATE__ === 'string'
    ? __BUILD_DATE__
    : globalThis.process?.env?.BUILD_DATE || new Date().toISOString().slice(0, 10)

function addWeekdays(iso, count) {
  const date = new Date(`${iso}T12:00:00Z`)
  let added = 0
  while (added < count) {
    date.setUTCDate(date.getUTCDate() + 1)
    const day = date.getUTCDay()
    if (day !== 0 && day !== 6) added += 1
  }
  return date.toISOString().slice(0, 10)
}

export const publishDates = Object.fromEntries(ROLLOUT.map((slug, index) => [slug, addWeekdays(ROLLOUT_START, index)]))

export const isLive = (slug) => !(slug in publishDates) || (!ROLLOUT_PAUSED && publishDates[slug] <= BUILD_DATE)
