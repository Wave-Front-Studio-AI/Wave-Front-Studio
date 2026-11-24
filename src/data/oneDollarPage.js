// Shared by the $1 Website page (copy, FAQ) and its SEO build (JSON-LD, sitemap).
// Imports only the offer numbers, so scripts/prerender.mjs can read it too.
import { ONE_DOLLAR } from './oneDollarSite.js'

const money = (n) => `$${n.toLocaleString('en-US')}`

export const ONE_DOLLAR_FAQ = [
  ['Why is the setup only $1?', `The setup is $1 because the money comes from hosting. Hosting is ${money(ONE_DOLLAR.hosting)} a month and runs for at least ${ONE_DOLLAR.minMonths} months, so the first year comes to ${money(ONE_DOLLAR.minTotal)}. From month 13 hosting moves to our regular price of ${money(ONE_DOLLAR.regularHosting)} a month. We would rather you see the whole price up front than find it later.`],
  ['What does the 12 month minimum mean?', `Hosting runs for at least ${ONE_DOLLAR.minMonths} months from the day your site goes live. If you cancel before month ${ONE_DOLLAR.minMonths}, the remaining months of hosting are due. After that hosting is ${money(ONE_DOLLAR.regularHosting)} a month, our regular price, and you can cancel any time by telling us in writing.`],
  ['How much does a $1 website really cost?', `$1 to set up, then ${money(ONE_DOLLAR.hosting)} a month for hosting with a ${ONE_DOLLAR.minMonths} month minimum. That is ${money(ONE_DOLLAR.minTotal)} for the first year. From month 13 hosting is ${money(ONE_DOLLAR.regularHosting)} a month. Extra pages are ${money(150)} each and copywriting is ${money(120)} a page.`],
  ['Do I pay anything on this page?', 'No. There is no card checkout here. We reply within two working days, send an invoice for the $1 setup and confirm a go-live date.'],
  ['Will a template work for my kind of business?', 'Yes. The templates are design styles, and any of the 15 works for a contractor, a clinic, a salon, a shop or an office. We swap in your services, photos, colors and words so it reads as your business.'],
  ['How long does the $1 setup last?', 'It is a Black Friday deal. Send your details by Tuesday, December 1 at 11:59 PM Eastern and you get the $1 setup. After that the deal ends.'],
  ['Who owns the site?', 'You own your text, photos, logo and domain. The design and the code that runs your site stay with Wavefront Studio, which is how we can build it for $1. If you leave, we send you your text and photos.'],
  ['What happens if I stop paying for hosting?', 'We write to you first. If hosting stays unpaid after that notice, the site comes down. You still keep your domain, your text and your photos, and we send them to you on request.'],
  ['Can I change the design?', 'You pick colors, text, photos and your logo. The layout of the design stays as you saw it in the preview. If you want a different layout, our other website packages start from a custom design.'],
  ['Can I add more pages later?', `Yes. Each extra page is ${money(150)}. We can also write the text for ${money(120)} a page.`],
  ['Can I use my own domain?', 'Yes. Tell us the domain and we connect it. If you do not have one, we can help you choose and register one. The fee goes to the registrar.'],
  ['Can I get this with other services?', 'Yes. Add it to a quote in our package builder next to anything else you need. The $1 website does not count toward bundle discounts or sale deals, and the other services in the quote are priced as normal.'],
  ['How soon will I hear back?', 'We reply within two working days. When we reply we tell you when your preview will be ready.'],
]
