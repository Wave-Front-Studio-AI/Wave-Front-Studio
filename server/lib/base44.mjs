export const LEAD_FIELD_MAP = {
  company: 'business_name',
  name: 'contact_name',
  email: 'email',
  phone: 'phone',
  industry: 'industry',
  location: 'location',
  website: 'website',
  notes: 'notes',
  smsConsent: 'sms_consent',
  smsConsentAt: 'sms_consent_at',
  smsConsentUrl: 'sms_consent_url',
  consentUrl: 'consent_url',
  consentCapturedAt: 'consent_captured_at',
}

export function resolveBusinessName(lead) {
  if (lead.company) return lead.company
  if (lead.website) return lead.website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  if (lead.name) return `${lead.name} (no company given)`
  return 'Website enquiry'
}

export function toBase44Record(lead, map = LEAD_FIELD_MAP) {
  const record = {}
  for (const [internal, external] of Object.entries(map || LEAD_FIELD_MAP)) {
    const value = lead[internal]
    if (value !== undefined && value !== null && value !== '') record[external] = value
  }
  return record
}

export class Base44Error extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'Base44Error'
    this.status = status
  }
}

export async function createLead(lead, config, fetchImpl = fetch) {
  if (!config.base44AppId || !config.base44Key) throw new Base44Error('Base44 is not configured.', 503)

  const record = toBase44Record({ ...lead, company: resolveBusinessName(lead) }, config.base44FieldMap)
  record[config.base44StageField] = config.base44Stage
  record[config.base44StatusField] = config.base44Status
  if (config.base44LeadSource) record.lead_source = config.base44LeadSource
  if (config.base44Owner) record.assigned_to = config.base44Owner
  if (config.base44OwnerEmail) record.assigned_to_email = config.base44OwnerEmail

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.base44TimeoutMs)
  let response
  try {
    response = await fetchImpl(`${config.base44ApiUrl}/apps/${config.base44AppId}/entities/${config.base44Entity}`, {
      method: 'POST',
      headers: { api_key: config.base44Key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(record),
      signal: controller.signal,
    })
  } catch (error) {
    throw new Base44Error(error.name === 'AbortError' ? 'Base44 timed out.' : `Base44 request failed: ${error.message}`, 502)
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    const body = await response.text()
    let detail = ''
    try {
      const parsed = JSON.parse(body)
      detail = parsed.message || parsed.error || parsed.detail || ''
    } catch {
      detail = body
    }
    const safeDetail = String(detail).replace(/[\r\n]+/g, ' ').slice(0, 240)
    throw new Base44Error(`Base44 rejected the lead (${response.status})${safeDetail ? `: ${safeDetail}` : '.'}`, response.status)
  }
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('json')) throw new Base44Error('Base44 returned a non-JSON response. Check BASE44_API_URL.', 502)
  return response.json()
}
