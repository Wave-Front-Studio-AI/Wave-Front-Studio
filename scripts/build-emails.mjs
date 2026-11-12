// Builds the Mailchimp emails in docs/emails/ from one email-safe layout (tables, inline styles,
// 600px, web-safe fonts, PNG/JPG images hosted on the site). Run: node scripts/build-emails.mjs
//
// Every link carries utm tags. The website keeps them for the visit and sends them with any form,
// and the lead service writes them to the lead's UTM Source, Medium, Campaign, Content and Term
// fields in the WF app, so each lead shows which email (and which template) brought it.
import { mkdir, writeFile } from 'node:fs/promises'

const SITE = 'https://www.wavefrontstudiollc.com'
const IMG = `${SITE}/images/email`
const C = { ink: '#0d1b2a', text: '#2c3e4e', muted: '#56697a', brand: '#2f6aa8', cyan: '#2bb3c8', paper: '#eef3f7', card: '#ffffff', line: '#dbe4ec', mist: '#e7f1f7' }
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

const link = (path, campaign, content, term) => {
  const url = new URL(path, SITE)
  const hash = url.hash
  url.hash = ''
  url.searchParams.set('utm_source', 'mailchimp')
  url.searchParams.set('utm_medium', 'email')
  url.searchParams.set('utm_campaign', campaign)
  url.searchParams.set('utm_content', content)
  if (term) url.searchParams.set('utm_term', term)
  return `${url.toString()}${hash}`
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const p = (html, { size = 16, color = C.text, top = 0, bottom = 16, align = 'left', weight = 400 } = {}) =>
  `<p style="margin:${top}px 0 ${bottom}px;font-family:${FONT};font-size:${size}px;line-height:1.6;color:${color};text-align:${align};font-weight:${weight}">${html}</p>`

const h = (html, { size = 30, top = 0, bottom = 14, align = 'left', color = C.ink } = {}) =>
  `<h1 style="margin:${top}px 0 ${bottom}px;font-family:${FONT};font-size:${size}px;line-height:1.18;color:${color};font-weight:800;letter-spacing:-0.3px;text-align:${align}">${html}</h1>`

const h2 = (html, { top = 0, bottom = 12, align = 'left' } = {}) =>
  `<h2 style="margin:${top}px 0 ${bottom}px;font-family:${FONT};font-size:22px;line-height:1.25;color:${C.ink};font-weight:800;text-align:${align}">${html}</h2>`

// A button that survives Outlook: a table cell with a background colour around a padded link.
const button = (label, href, { bg = C.ink, color = '#ffffff', align = 'left' } = {}) => `
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="${align}">
<table role="presentation" border="0" cellspacing="0" cellpadding="0"><tr>
<td bgcolor="${bg}" style="border-radius:999px;background:${bg}">
<a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 28px;font-family:${FONT};font-size:16px;font-weight:700;line-height:1;color:${color};text-decoration:none;border-radius:999px">${label}&nbsp;&rarr;</a>
</td></tr></table>
</td></tr></table>`

const row = (inner, { pad = '0 40px', bg } = {}) =>
  `<tr><td style="padding:${pad};${bg ? `background:${bg};` : ''}">${inner}</td></tr>`

const spacer = (n) => `<tr><td style="height:${n}px;line-height:${n}px;font-size:0">&nbsp;</td></tr>`

// Plain greeting: the audience has junk first names ("Hey"), so FNAME reads badly.
const greeting = 'Hi there,'

function layout({ title, preheader, body, campaign, content }) {
  const home = link('/', campaign, `${content}-logo`)
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<style>
  body { margin:0; padding:0; background:${C.paper}; }
  a { color:${C.brand}; }
  @media (max-width: 620px) {
    .wrap { width:100% !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
    .stack, .stack td { display:block !important; width:100% !important; }
    .stack td + td { padding-top:22px !important; }
    .stack-gap { height:14px !important; }
    .h1 { font-size:27px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.paper}">${esc(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:${C.paper}">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" class="wrap" width="600" border="0" cellspacing="0" cellpadding="0" style="width:600px;max-width:600px;background:${C.card};border-radius:14px;overflow:hidden">
<tr><td class="px" style="padding:28px 40px 8px"><a href="${esc(home)}" target="_blank"><img src="${IMG}/wavefront-logo.png" width="154" height="48" alt="Wavefront Studio" style="display:block;border:0;width:154px;height:auto"></a></td></tr>
${body}
${spacer(8)}
<tr><td class="px" style="padding:24px 40px 30px;background:${C.mist}">
${p(`Wavefront Studio, *|LIST:ADDRESS|*`, { size: 12, color: C.muted, bottom: 6 })}
${p(`You are getting this because you signed up for updates from Wavefront Studio.`, { size: 12, color: C.muted, bottom: 6 })}
${p(`<a href="*|UNSUB|*" style="color:${C.muted}">Unsubscribe</a> &nbsp;&middot;&nbsp; <a href="*|UPDATE_PROFILE|*" style="color:${C.muted}">Update your preferences</a>`, { size: 12, color: C.muted, bottom: 0 })}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`
}

const signoff = p(`Tony<br>Wavefront Studio`, { top: 8, bottom: 30 })

/* ------------------------------------------------------------------ */
/* $1 Website launch                                                   */
/* ------------------------------------------------------------------ */

function dollarEmail() {
  const campaign = 'dollar-website'
  const content = 'launch-email'
  const L = (path, part, term) => link(path, campaign, `${content}-${part}`, term)
  const picks = [
    ['pulse', 'Pulse', 'Energetic'],
    ['slate', 'Slate', 'Industrial'],
    ['grid', 'Grid', 'Swiss editorial'],
    ['harbor', 'Harbor', 'Calm and coastal'],
  ]
  const card = ([slug, name, style]) => `<td width="50%" valign="top" style="padding:0 6px">
<a href="${esc(L(`/1-dollar-website/${slug}/`, 'template', slug))}" target="_blank" style="text-decoration:none">
<img src="${IMG}/template-${slug}.jpg" width="252" height="189" alt="${name} template preview" style="display:block;width:100%;max-width:252px;height:auto;border:1px solid ${C.line};border-radius:10px">
<span style="display:block;margin-top:10px;font-family:${FONT};font-size:16px;font-weight:800;color:${C.ink}">${name}</span>
<span style="display:block;margin-top:2px;font-family:${FONT};font-size:14px;color:${C.muted}">${style}</span>
</a></td>`
  const grid = (a, b) => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="stack"><tr>${card(a)}${card(b)}</tr></table>`
  const step = (n, title, text) => `<tr><td width="40" valign="top" style="padding:0 14px 16px 0"><span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:16px;background:${C.ink};color:#ffffff;font-family:${FONT};font-size:14px;font-weight:700;text-align:center">${n}</span></td>
<td valign="top" style="padding:0 0 16px">${p(`<strong style="color:${C.ink}">${title}</strong><br>${text}`, { bottom: 0, size: 15 })}</td></tr>`

  const body = [
    row(`${p(greeting, { top: 12 })}
<h1 class="h1" style="margin:0 0 14px;font-family:${FONT};font-size:34px;line-height:1.15;color:${C.ink};font-weight:800;letter-spacing:-0.4px">A real website for $1 to start.</h1>
${p('Most business owners put off a new website because of the bill up front. So we took the bill away. Pick one of our 15 designs, send us your details, and we build your site with your own words, photos and logo.', { bottom: 22 })}
${button('See the 15 templates', L('/1-dollar-website/#designs', 'hero'))}`, { pad: '8px 40px 0' }),
    spacer(34),
    row(`${h2('Your custom website')}
${p('Every template is a full five page site with real photos, built to work for any kind of business. Here are four of them.', { bottom: 20 })}`, { pad: '0 40px' }),
    row(`${grid(picks[0], picks[1])}<div class="stack-gap" style="height:22px;line-height:22px;font-size:0">&nbsp;</div>${grid(picks[2], picks[3])}`, { pad: '0 34px' }),
    row(`${p(`<a href="${esc(L('/1-dollar-website/#designs', 'all-templates'))}" style="color:${C.brand};font-weight:700">See all 15 templates</a>`, { top: 22, bottom: 0 })}`, { pad: '0 40px' }),
    spacer(30),
    row(`${h2('How it works', { top: 26 })}
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
${step(1, 'Pick a template', 'Click through all five pages of any design before you choose.')}
${step(2, 'Send your details', 'Business name, services, hours, photos and logo, in one short form.')}
${step(3, 'We build it', 'You get a link to look it over. We reply within two working days.')}
${step(4, 'Go live', 'When it looks right, we publish it. Hosting starts that day.')}
</table>`, { pad: '0 40px 10px', bg: C.mist }),
    spacer(30),
    row(`${h2('Every site comes with')}
${p(`&#10003;&nbsp; Home, Services, About, Gallery and Contact pages<br>
&#10003;&nbsp; Works on phones, tablets and computers<br>
&#10003;&nbsp; A contact form that sends enquiries to your email<br>
&#10003;&nbsp; Hosting and a security certificate<br>
&#10003;&nbsp; Your own domain connected, if you have one`, { bottom: 24 })}
${button('Pick my template', L('/1-dollar-website/#designs', 'footer-button'), { bg: C.brand })}
${p('Want more than a template? Our <a href="' + esc(L('/package-builder/', 'package-builder')) + '" style="color:' + C.brand + '">package builder</a> prices a custom site in a couple of minutes.', { size: 14, color: C.muted, top: 22, bottom: 0 })}
${signoff}`, { pad: '0 40px' }),
  ].join('\n')

  return {
    file: '0-dollar-website-launch.html',
    title: 'A real website for $1',
    subjects: ['A real website for $1', 'Your new website, $1 to start'],
    preheader: 'Pick one of 15 designs and we build it with your details. Hosting is $99 a month.',
    html: layout({ title: 'A real website for $1', preheader: 'Pick one of 15 designs and we build it with your details. Hosting is $99 a month.', body, campaign, content }),
  }
}

/* ------------------------------------------------------------------ */
/* Black Friday                                                        */
/* ------------------------------------------------------------------ */

const BF = 'black-friday-2026'

function dealCards(L) {
  const deal = (name, text, addPath, part, color) => `<tr><td style="padding:0 0 12px">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid ${C.line};border-radius:12px;background:#ffffff"><tr>
<td style="padding:16px 18px">
<span style="display:block;font-family:${FONT};font-size:17px;font-weight:800;color:${C.ink}"><span style="color:${color}">&#9679;</span>&nbsp; ${name}</span>
<span style="display:block;margin-top:4px;font-family:${FONT};font-size:15px;line-height:1.55;color:${C.text}">${text}</span>
<a href="${esc(L(addPath, part))}" target="_blank" style="display:inline-block;margin-top:8px;font-family:${FONT};font-size:14px;font-weight:700;color:${C.brand}">Add it to my quote&nbsp;&rarr;</a>
</td></tr></table></td></tr>`
  return `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
${deal('Build Deal', '20% off setup when you add a website, landing page, quote calculator or visualizer tool. Website Grow lists at $4,500 and comes to $3,600.', '/package-builder/?add=web', 'build-deal', C.brand)}
${deal('Leads Deal', '3 months free instead of 1 on the monthly fee for lead generation and SEO.', '/package-builder/?add=lead', 'leads-deal', C.cyan)}
${deal('Brand Deal', '20% off logo and print work. Add a social media plan and the Launch logo and favicon design is free.', '/package-builder/?add=social', 'brand-deal', C.ink)}
</table>`
}

const ends = 'The deals end Tuesday, December 1 at 11:59pm Eastern.'

function bf1() {
  const content = 'bf-1-deals-live'
  const L = (path, part) => link(path, BF, `${content}-${part}`)
  const body = [
    row(`${p(greeting, { top: 12 })}
<h1 class="h1" style="margin:0 0 14px;font-family:${FONT};font-size:32px;line-height:1.15;color:${C.ink};font-weight:800">Black Friday pricing is on now.</h1>
${p(`Three deals for local businesses, running through December 1. ${ends}`)}
${p('Pick what you need in the quote builder and the deals apply on their own. You can download the PDF right away, and it costs nothing to look.', { bottom: 22 })}
${button('Build my quote', L('/package-builder/', 'hero'))}`, { pad: '8px 40px 0' }),
    spacer(28),
    row(dealCards(L), { pad: '0 40px' }),
    row(`${p('Deals stack with our bundle discount (2 services 5%, 3 services 10%, 5 services 15%), and the total never goes above 25%.', { size: 13, color: C.muted, top: 6 })}
${p(`Want us to look at your current site first? The <a href="${esc(L('/free-website-audit/', 'audit'))}" style="color:${C.brand};font-weight:700">website audit is free</a>.`, { top: 10 })}
${p('We reply within two working days.')}
${signoff}`, { pad: '0 40px' }),
  ].join('\n')
  const pre = 'Three deals for local businesses, through December 1.'
  return { file: '1-black-friday-deals-live.html', title: 'Black Friday pricing is on now', subjects: ['Black Friday pricing is on now', '20% off a new website through Dec 1'], preheader: pre, html: layout({ title: 'Black Friday pricing is on now', preheader: pre, body, campaign: BF, content }) }
}

function bf2() {
  const content = 'bf-2-black-friday'
  const L = (path, part) => link(path, BF, `${content}-${part}`)
  const body = [
    row(`${p(greeting, { top: 12 })}
<h1 class="h1" style="margin:0 0 14px;font-family:${FONT};font-size:32px;line-height:1.15;color:${C.ink};font-weight:800">Would a customer find you tonight?</h1>
${p('If someone searched for what you do last night, would they have found you? And could they get a price without waiting for a call back?')}
${p('A quote calculator on your site does that part at 9pm while you are off the clock. The enquiries it collects land in your inbox with the numbers attached, so you call people who already know the ballpark.')}
${p('The Build Deal takes 20% off setup on calculators, websites and landing pages through December 1.', { bottom: 22 })}
${button('Build my quote', L('/package-builder/?add=calc', 'hero'))}`, { pad: '8px 40px 0' }),
    spacer(28),
    row(dealCards(L), { pad: '0 40px' }),
    row(`${p(`Curious what customers see on your site today? The <a href="${esc(L('/free-website-audit/', 'audit'))}" style="color:${C.brand};font-weight:700">website audit is free</a>.`, { top: 8 })}
${p(ends, { size: 14, color: C.muted })}
${signoff}`, { pad: '0 40px' }),
  ].join('\n')
  const pre = 'The deals are live through December 1.'
  return { file: '2-black-friday.html', title: 'Would a customer find you tonight?', subjects: ['Would a customer find you tonight?', 'A price calculator that works at 9pm'], preheader: pre, html: layout({ title: 'Would a customer find you tonight?', preheader: pre, body, campaign: BF, content }) }
}

function bf3() {
  const content = 'bf-3-last-days'
  const L = (path, part) => link(path, BF, `${content}-${part}`)
  const body = [
    row(`${p(greeting, { top: 12 })}
<h1 class="h1" style="margin:0 0 14px;font-family:${FONT};font-size:32px;line-height:1.15;color:${C.ink};font-weight:800">The deals end tomorrow night.</h1>
${p('Today and tomorrow are the last two days. The Black Friday deals end Tuesday, December 1 at 11:59pm Eastern, and prices go back to normal after that.')}
${p('If you only want the numbers, build a quote and download the PDF. You can decide when you are ready.', { bottom: 22 })}
${button('Build my quote', L('/package-builder/', 'hero'))}`, { pad: '8px 40px 0' }),
    spacer(28),
    row(dealCards(L), { pad: '0 40px' }),
    row(`${p('A question about what fits your business? Reply to this email and we will answer within two working days.', { top: 8 })}
${signoff}`, { pad: '0 40px' }),
  ].join('\n')
  const pre = 'Ends Tuesday, December 1 at 11:59pm Eastern.'
  return { file: '3-black-friday-last-days.html', title: 'The deals end tomorrow night', subjects: ['The deals end tomorrow night', 'Two days left on Black Friday pricing'], preheader: pre, html: layout({ title: 'The deals end tomorrow night', preheader: pre, body, campaign: BF, content }) }
}

function bf4() {
  const content = 'bf-4-follow-up'
  const L = (path, part) => link(path, BF, `${content}-${part}`)
  const body = [
    row(`${p(greeting, { top: 12 })}
<h1 class="h1" style="margin:0 0 14px;font-family:${FONT};font-size:30px;line-height:1.15;color:${C.ink};font-weight:800">Still want that quote?</h1>
${p('The Black Friday deals ended last night. You looked at the quote builder, so I wanted to check in.')}
${p('Your quote is quick to rebuild, and we can still talk through what makes sense now and what can wait. Reply with what you are thinking about and we will answer within two working days.', { bottom: 22 })}
${button('Build a quote', L('/package-builder/', 'hero'))}
${signoff}`, { pad: '8px 40px 0' }),
  ].join('\n')
  const pre = 'The deals ended last night. We can still talk through the plan.'
  return { file: '4-black-friday-follow-up.html', title: 'Still want that quote?', subjects: ['Still want that quote?', 'Your quote is easy to rebuild'], preheader: pre, html: layout({ title: 'Still want that quote?', preheader: pre, body, campaign: BF, content }) }
}

const emails = [dollarEmail(), bf1(), bf2(), bf3(), bf4()]
await mkdir('docs/emails', { recursive: true })
for (const email of emails) {
  await writeFile(`docs/emails/${email.file}`, email.html)
  console.log(`docs/emails/${email.file}  | ${email.subjects[0]} | ${email.preheader}`)
}
await writeFile('docs/emails/emails.json', `${JSON.stringify(emails.map(({ file, subjects, preheader }) => ({ file, subjects, preheader })), null, 2)}\n`)
