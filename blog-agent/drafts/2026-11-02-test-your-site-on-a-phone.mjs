// Draft. Not yet published. Scheduled for 2026-11-02.
// Sources fetched 2026-10-08:
//  - W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/ (2.5.8 Target Size Minimum, 24x24 CSS px, AA; 2.5.5 Target Size Enhanced, 44x44 CSS px, AAA; 1.4.4 Resize Text to 200%; 3.3.2 Labels or Instructions)
//  - web.dev, Accessible tap targets: https://web.dev/articles/accessible-tap-targets (around 48 device-independent pixels, about 8px spacing)
//  - MDN, input type=tel: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/tel (mobile browsers show a phone keypad)
//  - MDN, autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
//  - MDN, viewport meta element: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element (disabling zoom harms low-vision users)
//  - MDN, the a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a (tel: links autodial on cellular devices)
//  - Chrome DevTools, Device Mode: https://developer.chrome.com/docs/devtools/device-mode ("first-order approximation", network throttling presets)
//  - Google Search Central, mobile-first indexing: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
//  - web.dev, LCP: https://web.dev/articles/lcp (2.5 seconds or less is good)
// Apple's own tap-size guidance could not be fetched, so it is not cited.
export default {
  slug: 'test-your-site-on-a-phone',
  title: 'You Can Find Most Mobile Problems With Your Site in Ten Minutes',
  date: '2026-11-02',
  excerpt: 'Most owners only ever view their site on a laptop. Here is a ten-minute walk through it on a real phone, and what to check at each step.',
  image: '/images/blog/test-your-site-on-a-phone.webp',
  content: [
    `<div class="lf-article">`,
    `<p class="lf-standfirst"><strong>You do not need a tool or a developer to find out whether your website works on a phone. You need ten minutes, your own handset and the willingness to use the site the way a stranger would.</strong></p>`,
    `<p>Most websites get approved on a large monitor, in a quiet office, on a fast connection. Then a customer opens the same site in a car park, one-handed, with a patchy signal, and gets a completely different experience.</p>`,
    `<p>Google also looks at the phone version first. Its documentation says that with mobile-first indexing it uses the mobile version of a site's content, crawled with the smartphone agent, for indexing and ranking. So the phone is not a side issue. It is the version that counts most.</p>`,
    `<h2>Before you start</h2>`,
    `<p>Use a real phone, not your laptop with a narrow window. Chrome's own documentation describes its device emulation as a "first-order approximation" and says there are aspects of mobile devices it can never simulate. It is useful for a quick look, but your thumb is the better instrument.</p>`,
    `<p>Turn off Wi-Fi so you are on mobile data, and set a ten-minute timer. Open the site as if you had never seen it.</p>`,
    `<ul class="lf-stats">`,
    `<li><strong>24</strong>CSS pixels: WCAG 2.2 minimum target size (level AA)</li>`,
    `<li><strong>44</strong>CSS pixels: WCAG 2.2 enhanced target size (level AAA)</li>`,
    `<li><strong>48</strong>device pixels: size web.dev suggests for tap targets</li>`,
    `</ul>`,
    `<h2>Minutes 1 to 3: first impressions on mobile data</h2>`,
    `<p>Load the homepage. How long before you can read the headline and use a button? You are not timing it to the decimal. You are asking whether you would have waited. Google's published guide to Largest Contentful Paint says 2.5 seconds or less counts as good, which gives you a reference point for what "quick" means.</p>`,
    `<p>Then look for movement. Does the text jump when images arrive? Does a banner push the button down just as you go to tap it? Those jolts are the sort of thing visitors remember.</p>`,
    `<h2>Minutes 4 to 5: can you read and tap?</h2>`,
    `<p>Hold the phone at normal reading distance. Can you read body text without pinching? Pinch to zoom anyway: it should work. MDN warns that blocking zoom with <code>user-scalable=no</code> stops people with low vision reading the page, and WCAG expects text to resize up to 200 percent.</p>`,
    `<p>Now tap. Menu items, phone numbers, buttons and links should be big enough for a thumb and far enough apart not to be hit by accident. WCAG 2.2 sets 24 by 24 CSS pixels as the minimum (with exceptions for things like links inside a sentence) and 44 by 44 as the enhanced level. web.dev suggests roughly 48 device pixels with about 8 pixels between targets. Count how many times you mis-tap.</p>`,
    `<h2>Minutes 6 to 7: the call button</h2>`,
    `<p>If phone calls matter to your business, tap your number. On a cellular phone, a proper <code>tel:</code> link starts the call (MDN documents this). If you see plain text you have to copy, or nothing happens, you have found a problem worth fixing the same day.</p>`,
    `<h2>Minutes 8 to 9: fill in your own form</h2>`,
    `<p>Submit the contact form with real details. This is where mobile sites quietly lose people.</p>`,
    `<ol>`,
    `<li>Does the phone field bring up a number keypad? MDN notes that <code>type="tel"</code> makes mobile browsers show a keyboard made for phone numbers.</li>`,
    `<li>Does your phone offer to fill in your name and address? The <code>autocomplete</code> attribute is what lets it, and it also supports WCAG's requirement to identify input purpose.</li>`,
    `<li>Are the labels still visible once you start typing? WCAG 3.3.2 asks for labels or instructions whenever input is required, and a placeholder that disappears is not much of one.</li>`,
    `<li>After you press send, does a clear confirmation appear, and does the enquiry actually reach you?</li>`,
    `</ol>`,
    `<blockquote class="lf-callout"><p><strong>Test the whole journey, not the page</strong></p>`,
    `<p>A form that looks perfect but sends to an old email address is worse than no form, because the visitor believes they have been heard. Check that the message arrived, and how long it took.</p></blockquote>`,
    `<h2>Minute 10: write it down</h2>`,
    `<p>List everything that annoyed you, in the order you met it. Mark each one: fix this week, ask the developer, or ignore. Resist fixing as you go. A list shows you which problem comes first.</p>`,
    `<h2>What to do next</h2>`,
    `<p>Repeat the test on a second phone, ideally an older one or one with a different make from yours, and ask someone older or younger than you to try the same job. Where they hesitate is where your visitors will too.</p>`,
    `<h2>What not to expect</h2>`,
    `<p>Ten minutes will not find everything. It will not tell you how the site behaves across dozens of device models, or give you a score. It finds the faults a visitor meets first, which are usually the ones that matter most.</p>`,
    `<p>It will also not tell you whether the site is slow for everyone. For that you need measured data from Google rather than one phone on one afternoon.</p>`,
    `<div class="lf-cta"><h2>Found more problems than you expected?</h2>`,
    `<p>We can test the site on real devices and tell you which fixes matter first.</p>`,
    `<p><a href="/free-website-audit/">Request the free website audit</a>, or see how we build for phones first in <a href="/web-development/">web design and development</a>.</p>`,
    `<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. `,
    `<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>`,
    `<aside class="lf-related"><h2>Related reading</h2><ul>`,
    `<li><a href="/nobody-waits-for-a-slow-website/">Nobody Waits for a Slow Website, and Google Stopped Waiting Too</a></li>`,
    `<li><a href="/your-contact-form-is-losing-enquiries/">Your Contact Form Is Probably Losing Enquiries You Never Hear About</a></li>`,
    `<li><a href="/do-you-need-a-mobile-app/">You Probably Don&#8217;t Need an App, Unless You Need One of These Four</a></li>`,
    `</ul></aside>`,
    `</div>`,
  ].join(''),
}
