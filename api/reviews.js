import { GOOGLE_LISTING_URL, fetchReviews, loadReviewsConfig } from '../server/lib/googleReviews.mjs'

// GET /api/reviews/ : the studio's Google rating and reviews, fetched live from
// the Places API. Held at the edge for a few hours so Google is asked a
// handful of times a day, not once per visitor; nothing is stored anywhere.
export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('cache-control', 'no-store')
    return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  }

  try {
    const data = await fetchReviews(loadReviewsConfig())
    response.setHeader('cache-control', 'public, s-maxage=21600, stale-while-revalidate=3600')
    return response.status(200).json(data)
  } catch (error) {
    console.error(JSON.stringify({ at: new Date().toISOString(), event: 'google_reviews_failed', message: error.message }))
    response.setHeader('cache-control', 'no-store')
    return response.status(error.status === 503 ? 503 : 502).json({ ok: false, mapsUrl: GOOGLE_LISTING_URL })
  }
}
