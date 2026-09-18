// Google reviews for the studio's Business Profile, through the Places API
// (New). The API key stays on the server; the browser only ever sees the
// rating and the reviews Google returns (up to five, Google's own selection).

const PLACES_API = 'https://places.googleapis.com/v1'

// Wavefront Studio LLC is a service-area business (no public address), so the
// listing is found by name with service-area results switched on. Setting
// GOOGLE_PLACE_ID skips that lookup.
const LISTING_QUERY = 'Wavefront Studio LLC, Sarasota, FL'

// The listing's permanent Maps link (its CID), used whenever the API cannot
// answer, so the section can always send people to the real reviews.
export const GOOGLE_LISTING_URL = 'https://www.google.com/maps?cid=13638168247481718251'

export class ReviewsError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ReviewsError'
    this.status = status
  }
}

export function loadReviewsConfig(env = process.env) {
  const timeout = Number(env.GOOGLE_PLACES_TIMEOUT_MS)
  return {
    apiKey: env.GOOGLE_PLACES_API_KEY || '',
    placeId: env.GOOGLE_PLACE_ID || '',
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 8000,
  }
}

async function placesRequest(url, { method = 'GET', body, fieldMask }, config, fetchImpl) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeoutMs)
  let response
  try {
    response = await fetchImpl(url, {
      method,
      headers: {
        'X-Goog-Api-Key': config.apiKey,
        'X-Goog-FieldMask': fieldMask,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    })
  } catch (error) {
    throw new ReviewsError(error.name === 'AbortError' ? 'Google timed out.' : `Google request failed: ${error.message}`, 502)
  } finally {
    clearTimeout(timer)
  }
  if (!response.ok) {
    const detail = (await response.text()).replace(/[\r\n]+/g, ' ').slice(0, 240)
    throw new ReviewsError(`Google rejected the request (${response.status}): ${detail}`, 502)
  }
  return response.json()
}

// The search only runs once per server instance; the id does not change.
let cachedPlaceId = ''

export async function resolvePlaceId(config, fetchImpl = fetch) {
  if (config.placeId) return config.placeId
  if (cachedPlaceId) return cachedPlaceId
  const data = await placesRequest(
    `${PLACES_API}/places:searchText`,
    {
      method: 'POST',
      body: { textQuery: LISTING_QUERY, includePureServiceAreaBusinesses: true, pageSize: 5 },
      fieldMask: 'places.id,places.displayName',
    },
    config,
    fetchImpl,
  )
  const match = (data.places || []).find((place) => /wavefront/i.test(place.displayName?.text || ''))
  if (!match) throw new ReviewsError('The Wavefront Studio listing was not found on Google.', 502)
  cachedPlaceId = match.id
  return match.id
}

export function resetPlaceIdCache() {
  cachedPlaceId = ''
}

export async function fetchReviews(config, fetchImpl = fetch) {
  if (!config.apiKey) throw new ReviewsError('Google reviews are not configured.', 503)
  const id = await resolvePlaceId(config, fetchImpl)
  const place = await placesRequest(
    `${PLACES_API}/places/${encodeURIComponent(id)}?languageCode=en`,
    { fieldMask: 'id,displayName,rating,userRatingCount,googleMapsUri,reviews' },
    config,
    fetchImpl,
  )
  const placeId = place.id || id

  return {
    ok: true,
    name: place.displayName?.text || 'Wavefront Studio LLC',
    rating: typeof place.rating === 'number' ? place.rating : null,
    count: place.userRatingCount || 0,
    mapsUrl: place.googleMapsUri || GOOGLE_LISTING_URL,
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    // Shown as Google returns them: no filtering by star rating, no editing.
    reviews: (place.reviews || [])
      .map((review) => ({
        author: review.authorAttribution?.displayName || 'Google user',
        authorUrl: review.authorAttribution?.uri || null,
        photo: review.authorAttribution?.photoUri || null,
        rating: typeof review.rating === 'number' ? review.rating : null,
        text: (review.text?.text || review.originalText?.text || '').trim(),
        when: review.relativePublishTimeDescription || '',
        url: review.googleMapsUri || null,
      }))
      .filter((review) => review.text),
  }
}
