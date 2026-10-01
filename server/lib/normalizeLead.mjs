import { consentWording } from '../../src/data/smsConsent.js'

const text = (value) => (typeof value === 'string' ? value.trim() : value == null ? '' : String(value))

// Only http and https addresses are kept; anything else with a scheme
// (javascript:, data:, file:) is dropped rather than stored in the CRM.
const website = (value) => {
  const normalized = text(value)
  if (!normalized) return ''
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(normalized) ? normalized : `https://${normalized}`
  try {
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:' ? candidate : ''
  } catch {
    return ''
  }
}

export function normalizeLead(body = {}) {
  const pick = (...keys) => {
    for (const key of keys) {
      const value = text(body[key])
      if (value) return value
    }
    return ''
  }

  const contact = pick('contact')
  const contactIsEmail = contact.includes('@')
  const source = pick('source') || 'website'
  const page = pick('page', 'url')
  const submittedAt = new Date().toISOString()
  const labelled = body.labelled && typeof body.labelled === 'object' ? body.labelled : {}
  const message = pick('message', 'details', 'topic', 'leak', 'priority', 'inquiry')
  const labelledLines = Object.entries(labelled).filter(([, value]) => text(value)).map(([key, value]) => `${key}: ${text(value)}`)
  const notes = [
    message,
    `Submitted from the ${source} form on ${page || 'the website'} at ${submittedAt}.`,
    ...(labelledLines.length ? ['', 'Form answers:', ...labelledLines] : []),
  ].filter(Boolean).join('\n')
  const truthy = (value) => (value ? /^(1|true|yes|on)$/i.test(value) : undefined)
  // The wording is looked up from the version the form names, never taken
  // from the request, so the record holds what the site actually showed. A
  // ticked box with a wording this site never showed is not recorded as
  // permission; the notes say so, for a person to follow up.
  const consent = (box, version, textKey) => {
    if (!truthy(pick(box))) return { given: undefined, wording: undefined, unverified: false }
    const wording = consentWording(pick(version), pick(textKey))
    return wording ? { given: true, wording, unverified: false } : { given: undefined, wording: undefined, unverified: true }
  }
  const service = consent('sms_consent', 'sms_consent_version', 'sms_consent_text')
  // Marketing permission is a separate box, kept separate all the way through:
  // the Campaign Registry requires marketing consent to stand on its own.
  const marketing = consent('sms_marketing_consent', 'sms_marketing_consent_version', 'sms_marketing_consent_text')
  const smsConsent = service.given
  const smsMarketingConsent = marketing.given
  const pageUrl = page ? `https://wavefrontstudiollc.com${page}` : undefined
  const consentNote = [service, marketing].some((box) => box.unverified)
    ? 'A text-message box was ticked, but the form did not send a wording this site shows, so no permission to text was recorded. Ask before texting.'
    : ''

  return {
    name: pick('name', 'full_name'),
    // Lower-cased so the same person is the same lead however they typed it.
    email: (pick('email', 'work_email') || (contactIsEmail ? contact : '')).toLowerCase(),
    phone: pick('phone', 'mobile', 'telephone') || (contactIsEmail ? '' : contact),
    company: pick('company', 'business', 'business_name'),
    industry: pick('industry', 'trade', 'sector'),
    location: pick('city', 'location', 'service_area'),
    website: website(pick('website')),
    notes: [notes, consentNote].filter(Boolean).join('\n'),
    source,
    smsConsent,
    smsConsentAt: smsConsent ? submittedAt : undefined,
    smsConsentUrl: smsConsent ? pageUrl : undefined,
    // The exact wording the person ticked, kept as the proof of what they
    // agreed to. Only stored when they did agree.
    smsConsentText: service.wording,
    smsMarketingConsent,
    smsMarketingConsentAt: smsMarketingConsent ? submittedAt : undefined,
    smsMarketingConsentUrl: smsMarketingConsent ? pageUrl : undefined,
    smsMarketingConsentText: marketing.wording,
    consentUrl: pageUrl,
    consentCapturedAt: submittedAt,
  }
}
