import test from 'node:test'
import assert from 'node:assert/strict'
import { GOOGLE_LISTING_URL, fetchReviews, loadReviewsConfig, resetPlaceIdCache } from '../lib/googleReviews.mjs'
import handler from '../../api/reviews.js'

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const place = {
  id: 'ChIJwavefront',
  displayName: { text: 'Wavefront Studio LLC' },
  rating: 5,
  userRatingCount: 7,
  googleMapsUri: 'https://maps.google.com/?cid=13638168247481718251',
  reviews: [
    {
      rating: 5,
      relativePublishTimeDescription: '2 months ago',
      text: { text: '  Fast, clear and they answered every call.  ' },
      authorAttribution: { displayName: 'Maria P', uri: 'https://www.google.com/maps/contrib/1', photoUri: 'https://lh3.googleusercontent.com/a' },
      googleMapsUri: 'https://www.google.com/maps/reviews/1',
    },
    { rating: 5, relativePublishTimeDescription: 'a year ago', authorAttribution: { displayName: 'Stars Only' } },
  ],
}

// A fake Places API that records what it was asked.
function fakeGoogle({ places = [{ id: 'ChIJwavefront', displayName: { text: 'Wavefront Studio LLC' } }] } = {}) {
  const calls = []
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, method: options.method || 'GET', headers: options.headers, body: options.body ? JSON.parse(options.body) : undefined })
    if (url.endsWith('/places:searchText')) return json({ places })
    return json(place)
  }
  return { calls, fetchImpl }
}

test('finds the service-area listing by name, then returns its rating and reviews', async () => {
  resetPlaceIdCache()
  const { calls, fetchImpl } = fakeGoogle()
  const result = await fetchReviews({ apiKey: 'key', placeId: '', timeoutMs: 1000 }, fetchImpl)

  assert.equal(calls[0].body.includePureServiceAreaBusinesses, true)
  assert.equal(calls[0].headers['X-Goog-Api-Key'], 'key')
  assert.match(calls[1].url, /\/places\/ChIJwavefront\?languageCode=en$/)
  assert.match(calls[1].headers['X-Goog-FieldMask'], /reviews/)

  assert.equal(result.rating, 5)
  assert.equal(result.count, 7)
  assert.equal(result.writeReviewUrl, 'https://search.google.com/local/writereview?placeid=ChIJwavefront')
  assert.equal(result.reviews.length, 1, 'a star-only review with no text is left out')
  assert.deepEqual(result.reviews[0], {
    author: 'Maria P',
    authorUrl: 'https://www.google.com/maps/contrib/1',
    photo: 'https://lh3.googleusercontent.com/a',
    rating: 5,
    text: 'Fast, clear and they answered every call.',
    when: '2 months ago',
    url: 'https://www.google.com/maps/reviews/1',
  })
})

test('a configured place id skips the name search', async () => {
  resetPlaceIdCache()
  const { calls, fetchImpl } = fakeGoogle()
  await fetchReviews({ apiKey: 'key', placeId: 'ChIJset', timeoutMs: 1000 }, fetchImpl)
  assert.equal(calls.length, 1)
  assert.match(calls[0].url, /\/places\/ChIJset\?/)
})

test('a search that does not find Wavefront fails rather than showing another business', async () => {
  resetPlaceIdCache()
  const { fetchImpl } = fakeGoogle({ places: [{ id: 'other', displayName: { text: 'Some Other Agency' } }] })
  await assert.rejects(fetchReviews({ apiKey: 'key', placeId: '', timeoutMs: 1000 }, fetchImpl), /not found/)
})

test('without an API key the endpoint says so and still offers the listing link', async () => {
  const saved = process.env.GOOGLE_PLACES_API_KEY
  delete process.env.GOOGLE_PLACES_API_KEY
  const response = {
    headers: {},
    setHeader(name, value) { this.headers[name.toLowerCase()] = value },
    status(code) { this.statusCode = code; return this },
    json(payload) { this.body = payload; return this },
  }
  await handler({ method: 'GET', headers: {} }, response)
  if (saved !== undefined) process.env.GOOGLE_PLACES_API_KEY = saved

  assert.equal(loadReviewsConfig({}).apiKey, '')
  assert.equal(response.statusCode, 503)
  assert.deepEqual(response.body, { ok: false, mapsUrl: GOOGLE_LISTING_URL })
  assert.equal(response.headers['cache-control'], 'no-store')
})
