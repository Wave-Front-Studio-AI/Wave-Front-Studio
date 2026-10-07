// The guide at /website-design-cost/. Written as HTML for the .longform styles,
// like the AI search guide, but every price, page count and build time in it is
// read from the same data the Build Your Package page uses, so it cannot drift
// from what /package-builder/ shows.
//
// No market averages, ranges or third-party figures belong here. The studio
// has no fetched, dated primary source for any, and the guide says so. If one
// is ever added, cite it in the sources list with the date it was checked.
//
// Two facts come from the small print at the foot of BuildYourPackage.jsx
// (inline JSX, so they cannot be imported): one-time builds are typically
// billed 50% to start and 50% on delivery, and ad spend is billed separately by
// the ad platform. Re-check them there before changing this file.

import { DETAILS, SERVICES } from './generated/packages.js'
import { freeSetupTerms } from './faqs.js'
import { money } from '../packageQuote.js'

const service = (id) => {
  const found = SERVICES.find((item) => item.id === id)
  if (!found) throw new Error(`websiteCostGuide: no "${id}" service in packages.js`)
  return found
}
const addon = (item, label) => {
  const found = item.addons.find((entry) => entry.l === label)
  if (!found) throw new Error(`websiteCostGuide: no "${label}" add-on on ${item.id}`)
  return found
}
// One row of a details table, as [Launch, Grow, Scale].
const detail = (id, label) => {
  const row = DETAILS[id]?.find((entry) => entry[0] === label)
  if (!row) throw new Error(`websiteCostGuide: no "${label}" row in DETAILS.${id}`)
  return row.slice(1)
}

const web = service('web')
const seo = service('seo')
const [launch, grow, scale] = web.tiers
const [seoLaunch, seoGrow, seoScale] = seo.tiers

const pages = detail('web', 'Pages included')
const design = detail('web', 'Design approach')
const forms = detail('web', 'Lead / contact forms')
const shop = detail('web', 'E-commerce store')
const copy = detail('web', 'Copywriting support')
const revisions = detail('web', 'Revision rounds')
const delivery = detail('web', 'Est. delivery')
const onPage = detail('web', 'On-page SEO setup')

const extraPage = money(addon(web, 'Extra page').p)
const storeSetup = money(addon(web, 'E-commerce setup').p)
const copyPerPage = money(addon(web, 'Copywriting (per page)').p)
const carePlan = money(addon(web, 'Website care plan').p)

const extraKeywords = money(addon(seo, 'Extra 25 keywords').p)
const blogArticle = money(addon(seo, 'Blog article').p)
const seoAudit = money(addon(seo, 'One-time technical audit').p)

const seoKeywords = detail('seo', 'Keywords targeted')
const seoPages = detail('seo', 'On-page optimization')
const seoArticles = detail('seo', 'Content articles / mo')
const seoReporting = detail('seo', 'Reporting')

const lower = (text) => text.charAt(0).toLowerCase() + text.slice(1)

export const websiteCostGuide = {
  path: '/website-design-cost/',
  slug: 'website-design-cost',
  title: 'What a Small Business Website Costs in Sarasota (2026)',
  seoTitle: 'What a Small Business Website Costs in Sarasota (2026)',
  description:
    'Published website prices and build times for Sarasota and Lakewood Ranch businesses, what changes the price, what is left out, and how to compare quotes.',
  excerpt:
    'The prices and build times we publish for small business websites and SEO, what moves a quote up or down, what is left out, and the questions to ask any studio. Prices as shown on our package builder on 7 October 2026.',
  metaLabel: 'Prices as published 7 October 2026',
  published: '2026-10-07',
  modified: '2026-10-07',
  keywords: [
    'website cost', 'website design cost', 'how much does a website cost', 'website price', 'sarasota website cost',
    'lakewood ranch website cost', 'seo pricing', 'seo cost', 'website development cost', 'quote', 'package prices', 'guide',
  ],
  linkLabel: 'Read the cost guide',
  cta: {
    title: 'Ready to price your own site?',
    copy: 'Build a package and see the total, or tell us what you need and we will reply within two working days.',
    label: 'Contact the studio',
    secondary: ['Build your package', '/package-builder/'],
  },
  content: `<div class="lf-article">
<p class="lf-standfirst"><strong>A price range with no source is hard to act on. We would rather show you our own price list, say what it covers, and be plain about what we cannot tell you.</strong></p>

<p>We are a four-person studio at 4363 Independence Ct in Sarasota. This page is for owners in Sarasota, Lakewood Ranch and the surrounding area who are comparing quotes, and for anyone else who wants to see how we price. Every figure below is one we publish on our <a href="/package-builder/">package builder</a>, which calculates a total as you tick options. The page is built from the same data, so the two cannot disagree.</p>

<p>What you will not find here is a Sarasota average, a &#8220;typical range&#8221; or a market statistic. We have not found a source for one that we could cite and date, and a number we cannot source is a guess. Where the honest answer is &#8220;it depends&#8221;, we say what it depends on.</p>

<nav aria-label="On this page"><h2>On this page</h2>
<ul>
<li><a href="#tiers">Our three website tiers and their prices</a></li>
<li><a href="#included">What each tier includes</a></li>
<li><a href="#price-changes">What changes the price</a></li>
<li><a href="#one-off-monthly">One-off and monthly costs</a></li>
<li><a href="#seo">What SEO costs per month</a></li>
<li><a href="#not-included">What is not included</a></li>
<li><a href="#compare-quotes">How to compare quotes</a></li>
<li><a href="#free-setup">When setup is free</a></li>
<li><a href="#free-audit">The free audit</a></li>
<li><a href="#questions">Questions owners ask</a></li>
<li><a href="#sources">Where these figures come from</a></li>
</ul></nav>

<h2 id="tiers">Our three website tiers and their prices</h2>

<p>A business website from us is one of three tiers. The price is a one-off build fee, and the build time is the estimate we publish for that tier.</p>

<div class="lf-table-scroll"><table>
<thead><tr><th>Tier</th><th>Build price (one-off)</th><th>Pages included</th><th>Design approach</th><th>Build time</th></tr></thead>
<tbody>
<tr><td>${launch.n} (${lower(launch.note)})</td><td>${money(launch.s)}</td><td>${pages[0]}</td><td>${design[0]}</td><td>${delivery[0]}</td></tr>
<tr><td>${grow.n} (${lower(grow.note)})</td><td>${money(grow.s)}</td><td>${pages[1]}</td><td>${design[1]}</td><td>${delivery[1]}</td></tr>
<tr><td>${scale.n} (${lower(scale.note)})</td><td>${money(scale.s)}</td><td>${pages[2]}</td><td>${design[2]}</td><td>${delivery[2]}</td></tr>
</tbody></table></div>

<p>These are starting points for standard scopes, not final quotes. Your written quote confirms the scope, the price and the timeline before you commit to anything. Custom tools such as calculators, visualisers or a multi-site setup are timed separately once we know what they involve.</p>

<h2 id="included">What each tier includes</h2>

<ul>
<li><strong>${launch.n}.</strong> ${pages[0]} pages, ${lower(design[0])} design, ${forms[0]} lead or contact form, ${lower(onPage[0])} on-page SEO setup and ${revisions[0]} revision round. It does not include a blog or content management setup, an online store or copywriting support. It is the right size for a business that needs a clear, fast site that says what it does and how to get in touch.</li>
<li><strong>${grow.n}.</strong> ${pages[1]} pages with ${lower(design[1])} design, ${lower(forms[1])} lead forms, a blog and content management setup, ${lower(onPage[1])} on-page SEO setup, ${lower(copy[1])} copywriting support and ${revisions[1]} revision rounds. A store of ${lower(shop[1])} is part of this tier.</li>
<li><strong>${scale.n}.</strong> ${pages[2]} pages with ${lower(design[2])}, lead forms (${forms[2]}), a blog and content management setup, ${lower(onPage[2])} on-page SEO setup, ${lower(copy[2])} copywriting support, ${revisions[2]} revision rounds and a ${lower(shop[2])}.</li>
</ul>

<p>&#8220;Unlimited&#8221; pages at ${scale.n} describes the scope we build to, not a licence to add pages after the quote is agreed. Anything outside the agreed scope is quoted before it is built.</p>

<p>Our <a href="/web-development/">website development page</a> shows the work we build, and our <a href="/web-design-sarasota-fl/">Sarasota</a> and <a href="/web-design-lakewood-ranch-fl/">Lakewood Ranch</a> pages say where we can meet in person.</p>

<h2 id="price-changes">What changes the price</h2>

<p>Four things move a website quote more than anything else. We describe them from our own tiers, because that is the only thing we can speak for.</p>

<h3>The number of pages</h3>
<p>Each tier has a page allowance, shown in the table above. An extra page on top of that is ${extraPage}. Each page needs content, a clear purpose and a place in the navigation, so we would sooner build fewer pages that each answer one question well than a long list of thin ones.</p>

<h3>Whether you sell online</h3>
<p>A store changes the build. At ${grow.n} it includes ${lower(shop[1])}, and at ${scale.n} a full store. At ${launch.n} there is no store, and e-commerce setup is an add-on at ${storeSetup}.</p>

<h3>Who writes the words</h3>
<p>A build waits on its copy. ${launch.n} includes no copywriting support. ${grow.n} includes ${lower(copy[1])} support and ${scale.n} includes ${lower(copy[2])} support. If you want us to write the pages, copywriting is ${copyPerPage} per page as an add-on.</p>

<h3>Integrations and custom tools</h3>
<p>Forms are the simplest example: ${launch.n} has ${forms[0]} form, ${grow.n} has ${lower(forms[1])} forms and ${scale.n} has ${forms[2]}. Connecting a site to your customer records, adding an AI chatbot, a quote calculator or a product visualiser is separate work. Those have their own entries in the package builder, and they are scoped and timed on their own rather than folded into a website tier.</p>

<h2 id="one-off-monthly">One-off and monthly costs</h2>

<p><strong>One-off.</strong> The website build itself is one-off: ${money(launch.s)}, ${money(grow.s)} or ${money(scale.s)} depending on the tier, plus any add-ons above. Our package builder notes that one-time builds are typically billed 50% to start and 50% on delivery. Your written quote states the schedule that applies to you.</p>

<p><strong>Monthly.</strong> A website needs looking after: updates, security monitoring and fixes. Our website care plan is ${carePlan} per month and is optional, so you can see the running cost separately from the build. SEO, if you want it, is a separate monthly service and is covered next.</p>

<h2 id="seo">What SEO costs per month</h2>

<p>SEO is not part of a website tier beyond the on-page setup listed above. It is a monthly service with its own three tiers, also shown on our <a href="/seo-service/">SEO service page</a>.</p>

<div class="lf-table-scroll"><table>
<thead><tr><th>Tier</th><th>Per month</th><th>Keywords targeted</th><th>Pages optimised</th><th>Articles per month</th><th>Reporting</th></tr></thead>
<tbody>
<tr><td>${seoLaunch.n}</td><td>${money(seoLaunch.m)}</td><td>${seoKeywords[0]}</td><td>${seoPages[0]}</td><td>${seoArticles[0]}</td><td>${seoReporting[0]}</td></tr>
<tr><td>${seoGrow.n}</td><td>${money(seoGrow.m)}</td><td>${seoKeywords[1]}</td><td>${seoPages[1]}</td><td>${seoArticles[1]}</td><td>${seoReporting[1]}</td></tr>
<tr><td>${seoScale.n}</td><td>${money(seoScale.m)}</td><td>${seoKeywords[2]}</td><td>${seoPages[2]}</td><td>${seoArticles[2]}</td><td>${seoReporting[2]}</td></tr>
</tbody></table></div>

<p>Add-ons on the same page: ${extraKeywords} per month for each extra 25 keywords, ${blogArticle} per blog article (priced per article, with the monthly count you choose), and a one-time technical audit at ${seoAudit}. Monthly services carry a recommendation of a three-month minimum, because search work takes time to show.</p>

<p>Nobody controls where Google puts a page, so we do not promise a position or a date, and you should be wary of anyone who does. Our guide to <a href="/seo-company-that-guarantees-page-one/">SEO companies that guarantee page one</a> explains why.</p>

<h2 id="not-included">What is not included</h2>

<p>A price list is only useful if you know what sits outside it. These are the gaps we would check in any quote, ours included.</p>

<ul>
<li><strong>Features above the tier.</strong> ${launch.n} has no blog setup, no store and no copywriting support. ${grow.n} caps its store at ${lower(shop[1])}. If you need more, it is an add-on or a different tier.</li>
<li><strong>Pages beyond the allowance.</strong> Extra pages are ${extraPage} each. ${launch.n} is ${lower(pages[0])} pages and ${grow.n} is ${lower(pages[1])}.</li>
<li><strong>Custom tools and integrations.</strong> Calculators, visualisers, chatbots and multi-site setups are priced and timed on their own.</li>
<li><strong>Ad spend.</strong> If you run paid advertising, the money you spend on the ad platform is billed by that platform, separately from any fee to us.</li>
<li><strong>Domain and hosting.</strong> Our package builder does not list domain registration or hosting as line items. Ask who pays for them and whose name they are in. The next section explains why that second part matters.</li>
<li><strong>Results.</strong> No tier includes a promised ranking, a number of enquiries or a revenue figure. A website and SEO give you the conditions for those. They are not a guarantee of them.</li>
</ul>

<h2 id="compare-quotes">How to compare quotes</h2>

<p>Two quotes with the same headline price can describe very different things. Put the same questions to every studio you are considering.</p>

<ol>
<li><strong>What exactly is built?</strong> Ask for the number of pages, the design approach and the forms, in writing, in the same terms as the table above.</li>
<li><strong>Who owns the domain, and whose account is it in?</strong> If the studio registers it in its own name, you may not be able to move it later. Read <a href="/who-owns-your-website/">who owns your website</a> before you sign anything.</li>
<li><strong>Who owns the site itself?</strong> Ask whether you receive the files, the logins and the content when the project ends, and whether that depends on staying on a monthly plan.</li>
<li><strong>What happens after launch?</strong> Ask what support is included, what a monthly plan covers, and what it costs. Ours is the ${carePlan} care plan above, and it is separate from the build.</li>
<li><strong>How many revision rounds are included?</strong> Ours are ${revisions[0]}, ${revisions[1]} and ${revisions[2]} for ${launch.n}, ${grow.n} and ${scale.n}. A quote that says &#8220;unlimited revisions&#8221; deserves a follow-up about what that means in practice.</li>
<li><strong>What is the payment schedule, and what is not in the price?</strong> Know what is due to start and on delivery, and ask for the exclusions to be listed. A single number with no list of what it covers is hard to compare.</li>
</ol>

<p>The cheapest quote is not always the lowest cost. We wrote about that in <a href="/why-cheap-design-costs-more/">why cheap design costs more</a>, and the same logic applies to a site that is cheap to build and expensive to leave.</p>

<h2 id="free-setup">When setup is free</h2>

<p>This is the wording from our <a href="/free-setup/">free setup page</a>, repeated so you do not have to hunt for it:</p>

<ul>
${freeSetupTerms.slice(0, 4).map((term) => `<li>${term.replace(/&/g, '&amp;')}</li>`).join('\n')}
</ul>

<p>Read the full terms on the free setup page before you decide, because they include when the offer closes and that we may decline an enquiry. The terms above say that project fees still apply, so the free setup is not a free website. If you qualify, ask for your quote to state what is waived and what is not, so that nothing depends on anyone&#8217;s memory.</p>

<h2 id="free-audit">The free audit</h2>

<p>If you already have a site and are not sure whether it needs a rebuild or a few fixes, start with the <a href="/free-website-audit/">free website audit</a>. A real person goes through your site and sends a written report by email, within 48 hours on business days. It looks at how long your page takes to show anything on a phone, where visitors give up, and whether you appear when locals search for what you sell, and it ranks the three fixes by what is costing you most. There is no charge and no contract, and you are not obliged to work with us afterwards.</p>

<h2 id="questions">Questions owners ask</h2>

<h3>How much does a website cost in Sarasota?</h3>
<p>For our own work, the published build prices are ${money(launch.s)} for ${launch.n}, ${money(grow.s)} for ${grow.n} and ${money(scale.s)} for ${scale.n}. We do not quote a Sarasota market average, because we have no dated source we could cite for one. The way to find out what a studio charges is to ask for a written quote against a list of what is included.</p>

<h3>Is a Lakewood Ranch business website priced differently?</h3>
<p>Our package builder does not price by location. Lakewood Ranch is about 15 minutes from our studio, so we can meet in person there, and the <a href="/web-design-lakewood-ranch-fl/">Lakewood Ranch page</a> says more about how we work with businesses in the area.</p>

<h3>What do website development services cost?</h3>
<p>That depends on whether you mean a standard business website, an online store or a custom tool. A standard site is one of the three tiers above. A store adds to the build, as described in the section on what changes the price. Custom tools are quoted after we understand the scope.</p>

<h3>How long does it take?</h3>
<p>Our published estimates are ${delivery[0]} for ${launch.n}, ${delivery[1]} for ${grow.n} and ${delivery[2]} for ${scale.n}. They are estimates, and we confirm a timeline before we start. Content that arrives late is one thing that can move a build.</p>

<h2 id="sources">Where these figures come from</h2>

<p>Every price, page allowance, revision count and build time on this page is read from the data behind our <a href="/package-builder/">package builder</a>, as it stood on <strong>7 October 2026</strong>. The billing schedule and the note on ad spend come from the small print at the bottom of that page. The free setup wording comes from the <a href="/free-setup/">free setup page</a>. We have not used any third-party price figure, because we have no source we could cite with a date. If our prices change, the package builder is the page to trust.</p>

<div class="lf-cta"><h2>Want a price for your own site?</h2>
<p>Tell us what you sell, where, and roughly what you need, and we will tell you which tier fits and what would change it. <a href="/package-builder/">Build your package</a> to see a total, or <a href="/contact/">contact the studio</a> to talk it through. We reply within two working days.</p></div>

<aside class="lf-related"><h2>Related reading</h2><ul>
<li><a href="/who-owns-your-website/">If You Can&#8217;t Log In to Your Domain, You Don&#8217;t Own Your Site</a></li>
<li><a href="/why-cheap-design-costs-more/">Cheap Design Costs More: What Your Brand Says Before You Do</a></li>
<li><a href="/redesign-starts-with-your-enquiries/">Start a Website Redesign With Your Last 20 Enquiries</a></li>
</ul></aside>
</div>`,
}
