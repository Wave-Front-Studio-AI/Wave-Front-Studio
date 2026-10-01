// The SMS permission wording, shared by the forms (src/components/shared.jsx)
// and the lead API (server/lib/normalizeLead.mjs). Carriers check this wording
// against what the SMS Policy page promises, so every form shows exactly these
// words.
//
// A form sends only the version id; the server looks the words up here, so the
// record holds the wording the site really showed rather than whatever text a
// browser sent. To change the wording, add a new version and point CURRENT at
// it. Never edit or delete an old one: records that cite it still need it.

export const SMS_CONSENT_VERSIONS = {
  'service-2026-09':
    'Text me about my enquiry. I agree to receive texts from Wavefront Studio LLC at this number about my enquiry, quote and project, including appointment reminders, some sent automatically. Not a condition of buying anything. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. See our SMS Policy (/sms-policy/) and Privacy Policy (/privacy-policy/).',
  // Marketing permission is its own box. The Campaign Registry rejects a
  // campaign whose opt-in bundles marketing consent with any other consent, so
  // someone can agree to hear about their own project without agreeing to offers.
  'marketing-2026-09':
    'Send me offers too. I agree to receive marketing texts from Wavefront Studio LLC at this number, such as promotions, webinar invitations and company news, some sent automatically. Not a condition of buying anything. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help.',
}

export const SMS_CONSENT_CURRENT = 'service-2026-09'
export const SMS_MARKETING_CONSENT_CURRENT = 'marketing-2026-09'

// The wording for a version id. Pages built before ids existed sent the words
// themselves, so an exact match on a known wording is accepted too. Anything
// else is not a wording this site showed, and returns null.
export function consentWording(version, text) {
  if (version && Object.hasOwn(SMS_CONSENT_VERSIONS, version)) return SMS_CONSENT_VERSIONS[version]
  if (text && Object.values(SMS_CONSENT_VERSIONS).includes(text)) return text
  return null
}
