// Draft. Not yet published. Scheduled for 2026-11-30.
//
// Sources fetched (checked 2026-10-08):
// - MDN, <input type="file"> (accept, multiple, capture):
//   https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
//   Used for: accept="image/*" is a hint, not validation, so check on the server;
//   on mobile, image accept typically offers camera or photo library depending on
//   device and browser; the multiple attribute allows several files.
// - MDN, autocomplete attribute (street-address, postal-code tokens):
//   https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
// Trade examples and the per-trade questions are general reasoning, not sourced claims;
// they are labelled as examples to adapt. No prices, ranges or figures are given.
export default {
  slug: 'quote-request-questions',
  title: 'A Quote Form Should Ask What You Would Ask on the Phone, and Nothing Else',
  date: '2026-11-30',
  excerpt: 'The right questions on a quote request save you a site visit and spare the customer a chase. Photos, address, timing and budget, trade by trade, without the clutter.',
  image: '/images/blog/quote-request-questions.webp',
  content: [
    '<div class="lf-article">',
    '<p class="lf-standfirst"><strong>If your quote form is a copy of what you ask on the first phone call, it will save time. If it is a copy of everything you would like to know, it will cost you enquiries.</strong></p>',
    '<p>Think back to the last time you answered the phone to a stranger wanting a quote. You asked where the job was. You asked roughly how big it was. You asked when they wanted it done, and perhaps whether they could send a photo. Four or five questions, in the order that mattered.</p>',
    '<p>That list is your form. Write it down before you build anything, then ask which of those answers you cannot give a sensible next step without.</p>',
    '<h2>The five questions worth asking</h2>',
    '<h3>Where is the job?</h3>',
    '<p>An address, or at least a postcode or ZIP code, tells you at once whether the job is inside your area. If you do not travel beyond a set distance, ask for the location first and show a polite message early rather than after ten more fields. Browsers can fill an address in from the standard <code>street-address</code> and <code>postal-code</code> autocomplete values, which saves typing on a phone.</p>',
    '<h3>What is it, in their words?</h3>',
    '<p>A single open box beats a menu of options that does not quite fit. Add one line of help text with an example, such as &#8220;Tell us what needs doing and anything we should know about access&#8221;.</p>',
    '<h3>Can they show you?</h3>',
    '<p>A photograph often answers what three paragraphs of description cannot. On a form, that is a file upload that accepts images. MDN notes that on phones an image upload typically offers the camera or the photo library, depending on the device and browser, and that the <code>accept</code> setting is only a hint, so your server must check what actually arrives. Allow several photos, and make clear that uploading is optional.</p>',
    '<h3>When do they need it?</h3>',
    '<p>Offer a few choices, such as as soon as possible, within the next month, or just planning. Few people can name a date, and the options tell you how to prioritise your reply.</p>',
    '<h3>What are they hoping to spend?</h3>',
    '<p>This is the one to make optional. Some customers find it a fair question and others read it as a trap. If you ask, explain why: &#8220;This helps us suggest the right approach. Leave it blank if you are not sure.&#8221; Never make it compulsory, and do not treat a blank as a lack of seriousness.</p>',
    '<h2>Adapting the list by trade</h2>',
    '<p>These are examples to adapt. Your own phone questions are the better guide.</p>',
    '<figure><table><thead><tr><th>Type of work</th><th>The question that saves a visit</th><th>The photo to ask for</th></tr></thead>',
    '<tbody>',
    '<tr><td>Roofing and exterior</td><td>Single storey or more? Any leaks now?</td><td>The roof from the ground, and any damage</td></tr>',
    '<tr><td>Landscaping</td><td>Approximate area and what is there now?</td><td>The plot from two corners</td></tr>',
    '<tr><td>Cleaning</td><td>Number of rooms, pets, how often?</td><td>Usually none</td></tr>',
    '<tr><td>Kitchens and bathrooms</td><td>Same layout or a change?</td><td>The room, with the walls in view</td></tr>',
    '<tr><td>Professional services</td><td>What outcome do you want, and by when?</td><td>A document, if relevant</td></tr>',
    '</tbody></table></figure>',
    '<blockquote class="lf-callout"><p><strong>Tell them what happens next</strong></p>',
    '<p>The last line of the form matters as much as the first. Say who will read it, by when they can expect a reply, and what the reply will contain: a quote, a question or an invitation to a visit. People send photographs and addresses more willingly when they know where they are going.</p></blockquote>',
    '<h2>Splitting a long form into steps</h2>',
    '<p>If you truly need more than five or six answers, a two-step form can feel lighter than one long page. Put the easy contact details on the first step, so you have a way to reply even if they stop, and the job detail on the second. Check that your system keeps the first step if the visitor never finishes.</p>',
    '<h2>What to do this week</h2>',
    '<ol>',
    '<li>Write down the questions you ask on a first call, in the order you ask them.</li>',
    '<li>Cross out any whose answer would not change your next step.</li>',
    '<li>Make the budget and photo questions optional, and add a line of help text to each.</li>',
    '<li>Send yourself a quote request from a phone, with a photograph, and see exactly what arrives.</li>',
    '<li>Write the confirmation message and reply time before you publish the form.</li>',
    '</ol>',
    '<h2>What not to expect</h2>',
    '<p>A better form will not turn every enquiry into a job, and some requests will still arrive with no detail at all. It will not replace a site visit for work that truly needs one. What it does is let you decide faster which enquiries to follow up and arrive at the first call already knowing the basics.</p>',
    '<p>If your customers often ask &#8220;how much roughly?&#8221;, a calculator that gives a bounded estimate can sit in front of the form. That is a separate build, and an honest one only if the numbers behind it are yours.</p>',
    '<div class="lf-cta"><h2>Want a quote form that does the first call for you?</h2>',
    '<p>We build lead capture around the questions you actually ask, with photo upload, clear confirmation and every request stored where you can find it.</p>',
    '<p><a href="/lead-capture/">See how lead capture works</a>: forms that gather the right detail.</p>',
    '<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. ',
    '<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>',
    '<aside class="lf-related"><h2>Related reading</h2><ul>',
    '<li><a href="/build-a-calculator-that-sells-for-you/">Stop Answering &#8220;How Much Roughly?&#8221; and Build a Calculator That Sells For You</a></li>',
    '<li><a href="/let-them-see-it-before-they-buy-it/">Let Them See It Before They Buy It</a></li>',
    '<li><a href="/redesign-starts-with-your-enquiries/">A Website Redesign Should Start With Your Last 20 Enquiries, Not Your Logo</a></li>',
    '</ul></aside>',
    '</div>',
  ].join(''),
}
