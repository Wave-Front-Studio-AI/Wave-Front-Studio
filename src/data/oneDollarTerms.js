// The $1 Website agreement. One version id goes into every lead that agrees to it, so a dispute can
// be answered with the exact wording the customer saw. Change the wording, change the id.
import { SERVICES } from './generated/packages.js'
import { ONE_DOLLAR } from './oneDollarSite.js'
import { contact } from './site.js'

export const ONE_DOLLAR_TERMS_VERSION = '2026-11-20'
export const ONE_DOLLAR_TERMS_PATH = '/1-dollar-website/terms/'

const money = (n) => `$${n.toLocaleString('en-US')}`

// Starting price of every service we sell, taken from the same data as the package builder so the
// terms can never quote a number the builder does not.
export function extrasPriceList() {
  return SERVICES.filter((service) => service.id !== ONE_DOLLAR.id).map((service) => {
    const priced = (service.tiers ?? []).filter((tier) => tier.s > 0 || tier.m > 0)
    const setup = Math.min(...priced.filter((tier) => tier.s > 0).map((tier) => tier.s))
    const monthly = Math.min(...priced.filter((tier) => tier.m > 0).map((tier) => tier.m))
    const parts = []
    if (Number.isFinite(setup)) parts.push(`${money(setup)} setup`)
    if (Number.isFinite(monthly)) parts.push(`${money(monthly)} a month`)
    return { id: service.id, name: service.name, from: parts.length ? `From ${parts.join(' + ')}` : 'Priced in a quote' }
  })
}

// Plain-English sections. Numbers come from ONE_DOLLAR so the page, the form and this text agree.
export function termsSections() {
  const { setup, hosting, regularHosting, minMonths, minTotal } = ONE_DOLLAR
  return [
    ['Who this is between', [
      'This agreement is between Wavefront Studio LLC, 4363 Independence Ct, Sarasota, FL 34234 ("we", "us") and the person or business who sends the $1 Website form ("you"). By ticking the agreement box on the form you accept every part of it.',
    ]],
    ['What you get', [
      'A website of up to 5 pages: Home, Services, About, Gallery and Contact, built on the template you picked. We put in your text, photos, logo and colors.',
      'The site works on phones, tablets and computers. It has one contact form that sends enquiries to your email. We host it, with a security certificate, and connect your own domain if you have one.',
      'The layout stays as shown in the template preview. A different layout is not part of this offer.',
    ]],
    ['What you pay', [
      `Setup is ${money(setup)}. We invoice it when we confirm your design.`,
      `Hosting is ${money(hosting)} a month. It starts the day your site goes live, which is the day you tell us the preview looks right and we publish it.`,
      `Hosting runs for a minimum of ${minMonths} months. That makes ${money(minTotal)} for the first year (${money(setup)} setup plus ${minMonths} months at ${money(hosting)}). The ${money(hosting)} is the first year price. From month ${minMonths + 1} hosting moves to our regular price of ${money(regularHosting)} a month and continues month to month until you cancel.`,
      'The $1 setup is a Black Friday offer. It applies only if your form reaches us by Tuesday, December 1, 2026 at 11:59 PM Eastern.',
    ]],
    ['What is not included, and costs extra', [
      `Extra pages are ${money(150)} each. Writing your text is ${money(120)} a page. The domain name fee is paid to the company you register the domain with.`,
      'SEO is not included. Neither are paid ads, social media, email marketing, branding, video, a chatbot, a mobile app or any other service we offer. Each one is priced separately and only starts after you accept a written quote from us. Nothing is added to your hosting or your invoice without that.',
      'The $1 Website does not count toward bundle discounts, first month free offers or sale deals. Our starting prices for everything else are listed below. They are starting prices. The final price is the one in your written quote.',
    ]],
    ['Cancelling', [
      `If you cancel before month ${minMonths}, the remaining months of hosting are due. We will tell you the amount in writing before you pay it.`,
      `After month ${minMonths} you can cancel at any time by telling us in writing, before the ${money(regularHosting)} price starts if you do not want to pay it. An email to ${contact.email} counts as writing. Hosting stops at the end of the month you cancel in.`,
    ]],
    ['If hosting is not paid', [
      'We write to you first. If hosting stays unpaid after that notice, we take the site down. You keep your domain, your text and your photos, and we send them to you on request. Unpaid months still count toward what you owe.',
    ]],
    ['Who owns what', [
      'You own your text, photos, logo and domain. You promise you have the right to use everything you send us, and you are responsible for it.',
      'The design, the template and the code that runs your site stay with Wavefront Studio LLC. That is how we can build it for $1. While you are paying for hosting you may use the site. We do not hand over the code or the design.',
    ]],
    ['Our responsibility', [
      'We will build and host the site as described here and keep it running with reasonable care. We do not promise any number of visitors, enquiries, sales or search rankings.',
      'Our total responsibility to you is limited to the amount you paid us in the 12 months before the problem. We are not responsible for lost profits or indirect losses.',
    ]],
    ['The rest', [
      'This page, the form you sent and any written quote you accept are the whole agreement. A change counts only if it is in writing from both of us. If one part is found not to apply, the rest still does. Florida law applies, and any dispute is for the courts of Sarasota County, Florida.',
      `When you tick the box, we record the date, the time and this version (${ONE_DOLLAR_TERMS_VERSION}) with your form, so we both know exactly what you agreed to.`,
    ]],
  ]
}
