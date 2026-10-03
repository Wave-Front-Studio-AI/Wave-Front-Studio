// The Lost Lead Analysis at /lost-leads/: the website's front end for the
// calculator in the studio's Growth Hub app.
//
// The app holds the real thing (base44/functions/lost-lead-calculator in the
// Growth Hub): it scores the answers, files the visitor as a lead (matching one
// it already holds), emails the report, issues the 10% show offer when the
// visit came from a trade show QR code, notifies the account manager and starts
// the follow-up. Its own page sits behind the staff login, so the QR codes
// point here instead, and this page sends the same request the app's page
// sends. The function is public and CORS-open on purpose.
//
// The questions mirror the app's src/pages/LostLeadCalculator.jsx. If the app
// adds or renames a question, change STEPS to match.

export const LOST_LEAD_ENDPOINT =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_LOST_LEAD_ENDPOINT) ||
  'https://wavefrontstudiostaff.com/functions/lost-lead-calculator'

const YES_NO = [
  ['', 'Choose one'],
  ['true', 'Yes'],
  ['false', 'No'],
]

export const STEPS = [
  {
    key: 'business',
    title: 'About your business',
    fields: [
      { name: 'business_name', label: 'Business name', required: true, autoComplete: 'organization', placeholder: 'Acme Pools', wide: true },
      { name: 'contact_name', label: 'Your name', required: true, autoComplete: 'name', placeholder: 'Sam Smith' },
      { name: 'industry', label: 'Industry', placeholder: 'Home services' },
      { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', placeholder: 'you@business.com' },
      { name: 'phone', label: 'Mobile phone', type: 'tel', required: true, autoComplete: 'tel', placeholder: '(941) 555-0123' },
      { name: 'location', label: 'Where you work', placeholder: 'Sarasota, FL', wide: true },
      { name: 'monthly_revenue', label: 'Average monthly revenue', type: 'money', required: true, placeholder: '40000' },
      { name: 'average_customer_value', label: 'Average value of a customer', type: 'money', required: true, placeholder: '2500' },
    ],
  },
  {
    key: 'marketing',
    title: 'Your marketing',
    fields: [
      { name: 'monthly_marketing_spend', label: 'Monthly marketing spend', type: 'money', required: true, placeholder: '2000', wide: true },
      { name: 'runs_google_ads', label: 'Do you run Google Ads?', options: YES_NO },
      { name: 'runs_meta_ads', label: 'Do you run Facebook or Instagram ads?', options: YES_NO },
      {
        name: 'social_activity',
        label: 'How often do you post on social media?',
        options: [
          ['', 'Choose one'],
          ['none', 'Not at all'],
          ['occasional', 'Now and then'],
          ['active', 'Regularly, every week'],
        ],
      },
      { name: 'website_traffic', label: 'Website visitors a month', type: 'number', placeholder: '1500', hint: 'Roughly, if you know it.' },
    ],
  },
  {
    key: 'leads',
    title: 'Your leads and sales',
    fields: [
      { name: 'leads_per_month', label: 'New enquiries a month', type: 'number', required: true, placeholder: '40' },
      { name: 'close_rate', label: 'Share of enquiries you win (%)', type: 'number', required: true, placeholder: '20', max: 100 },
      { name: 'missed_calls_per_month', label: 'Missed calls a month', type: 'number', placeholder: '15' },
      { name: 'google_reviews', label: 'Google reviews', type: 'number', placeholder: '8' },
      { name: 'uses_crm', label: 'Do you use a CRM?', options: YES_NO },
      { name: 'does_email_sms_followup', label: 'Do you follow up leads by email or text?', options: YES_NO },
    ],
  },
  {
    key: 'growth',
    title: 'Your target',
    fields: [
      {
        name: 'desired_monthly_revenue',
        label: 'Monthly revenue you are aiming for',
        type: 'money',
        placeholder: '80000',
        hint: 'Leave it blank if you would rather not say.',
        wide: true,
      },
    ],
  },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clip = (value) => String(value || '').trim().slice(0, 120)

/** The rep, the show and any UTM tags on the link the visitor arrived by. */
export function readContext(search) {
  const params = new URLSearchParams(search || '')
  const utm = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    if (params.get(key)) utm[key] = clip(params.get(key))
  }
  return { rep: clip(params.get('rep')), event: clip(params.get('event') || params.get('show')), utm }
}

/** What stops a step going on, in words for the visitor, or '' when it can. */
export function stepError(stepKey, form) {
  const step = STEPS.find((s) => s.key === stepKey)
  if (!step) return ''
  const missing = step.fields.some((f) => f.required && String(form[f.name] ?? '').trim() === '')
  if (missing) return 'Please fill in the required answers.'
  if (stepKey === 'business') {
    if (!EMAIL_RE.test(String(form.email).trim())) return 'Please enter a valid email address.'
    if (String(form.phone).replace(/\D/g, '').length < 10) return 'Please enter a mobile phone number with the area code.'
  }
  return ''
}

/** One call to the app's calculator. Resolves with its reply, or throws its own words. */
export async function callCalculator(body, fetchImpl = fetch) {
  let response
  try {
    response = await fetchImpl(LOST_LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('We could not reach our server. Please check your connection and try again.')
  }
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }
  if (!response.ok || !data || data.ok === false) {
    throw new Error((data && data.error) || 'Something went wrong working out your analysis. Please try again.')
  }
  return data
}
