const text = (value) => (typeof value === 'string' ? value.trim() : value == null ? '' : String(value))

const website = (value) => {
  const normalized = text(value)
  if (!normalized || /^[a-z][a-z\d+.-]*:\/\//i.test(normalized)) return normalized
  return `https://${normalized}`
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
  const consentValue = pick('sms_consent', 'smsConsent')
  const smsConsent = truthy(consentValue)
  // Marketing permission is a separate box, kept separate all the way through:
  // the Campaign Registry requires marketing consent to stand on its own.
  const smsMarketingConsent = truthy(pick('sms_marketing_consent', 'smsMarketingConsent'))
  const pageUrl = page ? `https://wavefrontstudiollc.com${page}` : undefined

  return {
    name: pick('name', 'full_name'),
    // Lower-cased so the same person is the same lead however they typed it.
    email: (pick('email', 'work_email') || (contactIsEmail ? contact : '')).toLowerCase(),
    phone: pick('phone', 'mobile', 'telephone') || (contactIsEmail ? '' : contact),
    company: pick('company', 'business', 'business_name'),
    industry: pick('industry', 'trade', 'sector'),
    location: pick('city', 'location', 'service_area'),
    website: website(pick('website')),
    notes,
    source,
    smsConsent,
    smsConsentAt: smsConsent ? submittedAt : undefined,
    smsConsentUrl: smsConsent ? pageUrl : undefined,
    // The exact wording the person ticked, kept as the proof of what they
    // agreed to. Only stored when they did agree.
    smsConsentText: smsConsent ? pick('sms_consent_text', 'smsConsentText') : undefined,
    smsMarketingConsent,
    smsMarketingConsentAt: smsMarketingConsent ? submittedAt : undefined,
    smsMarketingConsentUrl: smsMarketingConsent ? pageUrl : undefined,
    smsMarketingConsentText: smsMarketingConsent ? pick('sms_marketing_consent_text', 'smsMarketingConsentText') : undefined,
    consentUrl: pageUrl,
    consentCapturedAt: submittedAt,
  }
}
