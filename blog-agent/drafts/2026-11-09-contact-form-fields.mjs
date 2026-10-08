// Draft. Not yet published. Scheduled for 2026-11-09.
//
// Sources fetched (checked 2026-10-08):
// - W3C, Understanding SC 1.3.5 Identify Input Purpose (WCAG 2.1 Level AA):
//   https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html
//   Used for: AA criterion; input purpose programmatically determinable;
//   autocomplete values name, email, tel; benefits people with cognitive and memory disabilities.
// - MDN, HTML autocomplete attribute:
//   https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
//   Used for: token list (name, given-name, email, tel, street-address, postal-code),
//   advice not to switch autocomplete off broadly, invented tokens break autofill.
// - W3C, Understanding SC 3.3.2 Labels or Instructions (Level A):
//   https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
//   Used for: visible labels or instructions are required for inputs.
// Spam-protection advice (honeypot, server-side checks) is reasoning, not a sourced claim.
// Note: MDN says 1.3.5 is "required for WCAG 2.2"; the W3C page confirms it is an AA
// criterion from WCAG 2.1. The post says "WCAG 2.1 and later" and cites W3C only.
export default {
  slug: 'contact-form-fields',
  title: 'Three Fields Beat Eleven: How Many Questions a Contact Form Should Ask',
  date: '2026-11-09',
  excerpt: 'Ask only what you need to send a first reply. A field-by-field guide to what to keep, what to cut, how to fight spam and how to let browsers fill the form in.',
  image: '/images/blog/contact-form-fields.webp',
  content: [
    '<div class="lf-article">',
    '<p class="lf-standfirst"><strong>Every field on a contact form is a question you are asking a stranger to answer before they have spoken to you. Keep only the ones you cannot reply without.</strong></p>',
    '<p>Open your contact form on your phone and count the fields. Then ask of each one: if this box were missing, could I still write back? Many forms were built by adding a field every time someone in the business said &#8220;it would help to know&#8221;. Over a few years it grows into a questionnaire.</p>',
    '<p>You will not find the people it put off, because they leave quietly. What you can do is audit the form like an editor, cutting anything that does not earn its place.</p>',
    '<h2>The field-by-field audit</h2>',
    '<figure><table><thead><tr><th>Field</th><th>Verdict</th><th>Why</th></tr></thead>',
    '<tbody>',
    '<tr><td>Name</td><td>Keep, as one box</td><td>You need something to address the reply to. One &#8220;full name&#8221; box is quicker than two.</td></tr>',
    '<tr><td>Email</td><td>Keep</td><td>The reliable way to answer, and the reply is a written record.</td></tr>',
    '<tr><td>Phone</td><td>Optional</td><td>Useful for urgent trades, a barrier for people who dislike calls.</td></tr>',
    '<tr><td>Message</td><td>Keep</td><td>Lets them say what they want in their own words.</td></tr>',
    '<tr><td>Company, job title, budget, how you heard of us</td><td>Cut or move</td><td>Ask in the conversation, where it can be explained.</td></tr>',
    '<tr><td>Consent tick-box</td><td>Only if you need it</td><td>Include the wording your situation requires, and no more.</td></tr>',
    '</tbody></table></figure>',
    '<p>Where you keep a field, say plainly whether it is required. If only three of five boxes are compulsory, mark the two that are not, rather than starring the rest and leaving people to guess. When something is wrong, name the box and say what to fix, in words like &#8220;Please add an email address so we can reply&#8221;, instead of a red outline with no explanation.</p>',
    '<p>The test for any question you are tempted to add is whether the answer changes your first reply. If it only changes the quote you give later, it can wait for the conversation, where you can explain why you are asking.</p>',
    '<h2>Phone or email: let them choose</h2>',
    '<p>The awkward case is the form that makes both compulsory. Some people will not hand over a phone number to someone they have not spoken to, and some do not check email during the day. A kinder pattern is one field marked &#8220;the best way to reach you&#8221;, which accepts either, plus an optional second one.</p>',
    '<p>If you do collect a number, say what you will use it for, such as &#8220;only to reply to this enquiry&#8221;. A sentence under the field costs nothing and answers the question people are silently asking.</p>',
    '<h2>Let the browser do the typing</h2>',
    '<p>Phones can fill in a name, email address and phone number in a tap, but only if the form tells them what each box is for. That is done with the <code>autocomplete</code> attribute, and the values are standard: <code>name</code>, <code>email</code>, <code>tel</code>, and for addresses <code>street-address</code> and <code>postal-code</code>.</p>',
    '<p>This is also an accessibility requirement. WCAG 1.3.5, Identify Input Purpose, is a Level AA criterion from WCAG 2.1 onward: the purpose of fields that collect information about the user must be programmatically determinable, which is what those values provide. The W3C notes it helps people with cognitive, language and memory disabilities by reducing manual entry.</p>',
    '<p>Two cautions from MDN apply. Do not switch autocomplete off across the form, since many people rely on it. And do not invent your own values, because the browser will not recognise them and the benefit is lost.</p>',
    '<blockquote class="lf-callout"><p><strong>Labels belong outside the box</strong></p>',
    '<p>WCAG 3.3.2 requires labels or instructions wherever input is needed. A visible label above each field survives typing, whereas placeholder text vanishes the moment someone starts. Use placeholders for examples, not as the label.</p></blockquote>',
    '<h2>Stopping spam without stopping people</h2>',
    '<p>Unprotected forms attract automated junk, and the temptation is to bolt on a puzzle for every visitor. That adds a step for every real person to fix a problem that only bots cause. Quieter measures usually go first: a hidden field that people never see but scripts fill in, a check on the server for obvious patterns, and a limit on how fast one source can submit.</p>',
    '<p>Whatever you choose, test that a real message still gets through, and look at what the filter catches now and then. A filter that is too keen is a leak you will never see, as our earlier post on forms losing enquiries explains.</p>',
    '<h2>What to do this week</h2>',
    '<ol>',
    '<li>Count your fields and mark each as needed, nice to have or never used.</li>',
    '<li>Cut everything in the second and third groups, or move the question to your first reply.</li>',
    '<li>Check that name, email and phone use the standard <code>autocomplete</code> values.</li>',
    '<li>Move any label that lives inside a box to above it.</li>',
    '<li>Send yourself a test from a phone and from a laptop.</li>',
    '</ol>',
    '<h2>What not to expect</h2>',
    '<p>A shorter form will not change how many people reach it, and it will not fix a slow reply. It also gives you less to qualify a lead on, so you will sometimes write back with questions. For most small businesses that trade is worth making, since a question asked in a reply is cheaper than a visitor lost at field seven.</p>',
    '<div class="lf-cta"><h2>Want a form that gets out of the way?</h2>',
    '<p>We design lead-capture forms that ask for the minimum, work on a phone and send every enquiry somewhere you can find it.</p>',
    '<p><a href="/lead-capture/">See how lead capture works</a>: forms, alerts and records.</p>',
    '<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. ',
    '<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>',
    '<aside class="lf-related"><h2>Related reading</h2><ul>',
    '<li><a href="/your-contact-form-is-losing-enquiries/">Your Contact Form Is Probably Losing Enquiries You Never Hear About</a></li>',
    '<li><a href="/redesign-starts-with-your-enquiries/">A Website Redesign Should Start With Your Last 20 Enquiries, Not Your Logo</a></li>',
    '<li><a href="/website-making-or-costing-you-money/">Your Website Is Either Making You Money or Costing You Money</a></li>',
    '</ul></aside>',
    '</div>',
  ].join(''),
}
