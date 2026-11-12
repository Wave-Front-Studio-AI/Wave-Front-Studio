// Where a lead came from, read from the tags on the link that brought the visitor to the site
// (utm_source and friends, plus Meta's fbclid and Google's gclid). The website keeps them for the
// visit and sends them with the form; here they become the CRM's own UTM, touch and Lead source fields.

const text = (value) => (typeof value === 'string' ? value.trim().slice(0, 200) : '')

const SEARCH_HOSTS = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|yandex|baidu)\./i
const SOCIAL_HOSTS = /(^|\.)(facebook|instagram|fb|linkedin|tiktok|twitter|x|threads|pinterest|youtube|reddit|nextdoor)\.(com|net|me|co)$/i
const META_SOURCES = /^(facebook|fb|instagram|ig|meta|messenger)$/i
const SOCIAL_SOURCES = /^(facebook|fb|instagram|ig|meta|linkedin|tiktok|twitter|x|threads|pinterest|youtube|reddit|nextdoor|social)$/i
const PAID_MEDIUMS = /^(cpc|ppc|paid|paidsocial|paid_social|paid-social|ad|ads|display|cpm)$/i

// The CRM's Lead source is a fixed list, so only channels that fit one of its values get set here.
// Anything else (email, direct, an unknown tag) is left to the service default ("website").
export function leadSourceFor({ source = '', medium = '', fbclid = '' } = {}) {
  const s = source.toLowerCase()
  const m = medium.toLowerCase()
  if (fbclid || (META_SOURCES.test(s) && PAID_MEDIUMS.test(m))) return 'meta_ad'
  if (s.startsWith('referral:')) {
    const host = s.slice('referral:'.length)
    if (SEARCH_HOSTS.test(host)) return 'seo_organic'
    if (SOCIAL_HOSTS.test(host)) return 'social'
    return 'referral'
  }
  if (SOCIAL_SOURCES.test(s) || m === 'social' || m === 'organic_social') return 'social'
  if ((s === 'google' || s === 'bing') && m === 'organic') return 'seo_organic'
  if (m === 'referral') return 'referral'
  return undefined
}

// Pulls the tags out of the form's labelled answers. "direct" is the site's word for no tags at all,
// so it is not stored as a source.
export function attributionFrom(labelled = {}, page = '', submittedAt = new Date().toISOString()) {
  const get = (key) => text(labelled[key])
  const source = get('utm_source') === 'direct' ? '' : get('utm_source')
  const tags = {
    utmSource: source,
    utmMedium: get('utm_medium'),
    utmCampaign: get('utm_campaign'),
    utmContent: get('utm_content'),
    utmTerm: get('utm_term'),
    fbclid: get('fbclid'),
    gclid: get('gclid'),
  }
  const any = Object.values(tags).some(Boolean)
  const touch = any
    ? JSON.stringify({
        source: tags.utmSource || undefined,
        medium: tags.utmMedium || undefined,
        campaign: tags.utmCampaign || undefined,
        content: tags.utmContent || undefined,
        term: tags.utmTerm || undefined,
        fbclid: tags.fbclid || undefined,
        gclid: tags.gclid || undefined,
        page: page || undefined,
        at: submittedAt,
      })
    : undefined
  const result = {}
  for (const [key, value] of Object.entries(tags)) if (value) result[key] = value
  return {
    ...result,
    firstTouch: touch,
    lastTouch: touch,
    leadSource: leadSourceFor({ source: tags.utmSource, medium: tags.utmMedium, fbclid: tags.fbclid }),
  }
}
