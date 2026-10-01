import { GOOGLE_LISTING_URL, fetchReviews, loadReviewsConfig } from '../server/lib/googleReviews.mjs'

// GET /api/reviews/ : the studio's Google rating and reviews, fetched live from
// the Places API. Held at the edge for a few hours so Google is asked a
// handful of times a day, not once per visitor; nothing is stored anywhere.
// Each Places call is billed, so the answer is also kept in this instance for
// six hours: a burst of requests, or cold starts sharing a warm instance, costs
// one call rather than one per request.
const HOLD_MS = 6 * 60 * 60 * 1000
let held = null
// After a failed call, Google is left alone for a while. If the key has hit
// its daily quota or Google is down, every visitor retrying would only add
// more billed calls; the last good answer is served meanwhile, if there is one.
const RETRY_AFTER_MS = 10 * 60 * 1000
let failedAt = 0

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('cache-control', 'no-store')
    return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  }

  // The edge cache keys on the full URL. Without this, /api/reviews/?anything
  // would skip the cache and bill a fresh Places call every time.
  if ((request.url || '').includes('?')) {
    response.setHeader('location', '/api/reviews/')
    response.setHeader('cache-control', 'public, max-age=86400')
    return response.status(308).end()
  }

  const fresh = held && Date.now() - held.at <= HOLD_MS
  const resting = Date.now() - failedAt < RETRY_AFTER_MS
  if (!fresh && !resting) {
    try {
      held = { at: Date.now(), data: await fetchReviews(loadReviewsConfig()) }
    } catch (error) {
      console.error(JSON.stringify({ at: new Date().toISOString(), event: 'google_reviews_failed', message: error.message }))
      // 503 is "no API key here": nothing reached Google, so nothing to wait out.
      const notConfigured = error.status === 503
      if (!notConfigured) failedAt = Date.now()
      if (!held) {
        // A Google failure is cached briefly at the edge too, so a burst of
        // visitors during an outage reaches neither this function nor Google.
        response.setHeader('cache-control', notConfigured ? 'no-store' : 'public, s-maxage=300')
        return response.status(notConfigured ? 503 : 502).json({ ok: false, mapsUrl: GOOGLE_LISTING_URL })
      }
    }
  }
  if (!held) {
    response.setHeader('cache-control', 'public, s-maxage=300')
    return response.status(502).json({ ok: false, mapsUrl: GOOGLE_LISTING_URL })
  }
  response.setHeader('cache-control', 'public, s-maxage=21600, stale-while-revalidate=3600')
  return response.status(200).json(held.data)
}
