// Safety net for the lead form: if the CRM cannot take a lead, the studio gets it
// by email instead of the visitor being sent away. Uses whichever email service
// the site is already set up with (EMAIL_PROVIDER). Returns true only when the
// provider accepted the message.
const text = (value) => (value == null ? '' : String(value).trim())

export function leadEmailBody(lead) {
  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Business', lead.company],
    ['Website', lead.website],
    ['Source', lead.source],
  ].filter(([, value]) => text(value))
  const lines = rows.map(([label, value]) => `${label}: ${text(value)}`)
  return [
    'This enquiry came in through the website, but the CRM could not save it, so it is here by email. Add it to the CRM by hand.',
    '',
    ...lines,
    '',
    text(lead.notes),
    lead.smsConsent ? '\nTexts about the enquiry: the visitor ticked the box.' : '',
    lead.smsMarketingConsent ? 'Marketing texts: the visitor ticked the box.' : '',
  ].filter((line, index, all) => line || (index > 0 && all[index - 1])).join('\n')
}

async function send(url, options, fetchImpl) {
  const response = await fetchImpl(url, options)
  return response.ok
}

export async function emailLead(lead, config, fetchImpl = fetch) {
  const to = text(config.emailTo)
  const from = text(config.emailFrom)
  if (!to || !from) return false
  const subject = `Website enquiry (CRM unavailable): ${text(lead.name) || text(lead.email) || text(lead.phone) || 'new lead'}`
  const body = leadEmailBody(lead)
  const replyTo = text(lead.email)
  try {
    if (config.emailProvider === 'resend' && config.resendKey) {
      return await send('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${config.resendKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from, to: [to], ...(config.emailBcc ? { bcc: [config.emailBcc] } : {}), ...(replyTo ? { reply_to: replyTo } : {}), subject, text: body }),
      }, fetchImpl)
    }
    if (config.emailProvider === 'postmark' && config.postmarkToken) {
      return await send('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: { 'x-postmark-server-token': config.postmarkToken, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ From: from, To: to, ...(config.emailBcc ? { Bcc: config.emailBcc } : {}), ...(replyTo ? { ReplyTo: replyTo } : {}), Subject: subject, TextBody: body, MessageStream: 'outbound' }),
      }, fetchImpl)
    }
    if (config.emailProvider === 'sendgrid' && config.sendgridKey) {
      return await send('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { authorization: `Bearer ${config.sendgridKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }], ...(config.emailBcc ? { bcc: [{ email: config.emailBcc }] } : {}) }],
          from: { email: from },
          ...(replyTo ? { reply_to: { email: replyTo } } : {}),
          subject,
          content: [{ type: 'text/plain', value: body }],
        }),
      }, fetchImpl)
    }
  } catch {
    return false
  }
  return false
}
