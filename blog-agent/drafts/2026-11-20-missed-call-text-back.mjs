// Draft. Not yet published. Scheduled for 2026-11-20.
//
// Sources fetched (checked 2026-10-08):
// - 47 CFR 64.1200 (Delivery restrictions), eCFR, current text:
//   https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200
//   Used for: (a)(2) telemarketing autodialed/prerecorded calls to wireless numbers
//   need prior express written consent; (f)(9) definition of prior express written
//   consent (signed agreement; must say agreement is not a condition of purchase);
//   (f)(13) definition of telemarketing (message to encourage purchase of goods or
//   services); (a)(10) revocation by any reasonable method, including replying
//   "stop", "quit", "end", "revoke", "opt out", "cancel" or "unsubscribe", honoured
//   within a reasonable time not exceeding ten business days; (a)(12) one
//   confirmation text of the opt-out is permitted.
// - CTIA, Messaging Principles and Best Practices, May 2023 (PDF, text extracted):
//   https://api.ctia.org/wp-content/uploads/2023/05/230523-CTIA-Messaging-Principles-and-Best-Practices-FINAL.pdf
//   Used for: s5.1.2 opt-in examples (including the consumer initiating the text
//   exchange and the sender replying only with responsive information; a phone call
//   is not listed), record-keeping of consent; s5.1.3 opt-out: state how to opt out,
//   standard STOP wording, honour normal-language variants, multiple opt-out routes,
//   one final confirmation message and no further messages; s5.1.5 keep opt-in and
//   opt-out records.
// - Not obtained: the FCC consumer guide pages returned HTTP 403. No claim here
//   depends on them. The post does NOT say whether a missed-call text needs consent,
//   because the sources do not settle it; it says to ask a lawyer.
// Owner must verify: nothing factual beyond the above; the post is explicitly "not legal advice".
export default {
  slug: 'missed-call-text-back',
  title: 'Missed-Call Text-Back: How It Works and the Consent Rules to Know First',
  date: '2026-11-20',
  excerpt: 'A text that goes out when you miss a call can save an enquiry. Here is how it works, what the FCC rules and CTIA guidance say about consent and STOP, and what to ask.',
  image: '/images/blog/missed-call-text-back.webp',
  content: [
    '<div class="lf-article">',
    '<p class="lf-standfirst"><strong>A missed-call text-back sends a short message to a caller you could not answer. It is useful, and it is also an automated text, which means rules about consent and opting out apply to how you set it up.</strong></p>',
    '<p>Picture a plumber with her hands in a cupboard under a sink. Her phone rings, she cannot answer, and the caller hangs up without leaving a message. Without anything in place, the next anyone hears of that person is never.</p>',
    '<p>With a text-back, a message goes to the caller moments later: sorry we missed you, tell us what you need and we will reply. They answer from the same phone, and the job is still alive when she dries her hands. This is not legal advice. This post explains the mechanism and points you to the sources, so you can ask the right questions.</p>',
    '<h2>How it actually works</h2>',
    '<ol>',
    '<li>Your business number is connected to a phone system or texting service that can see unanswered calls.</li>',
    '<li>When a call goes unanswered (or rings out of hours), the system notes the caller&#8217;s number.</li>',
    '<li>It sends one pre-written text from your business number.</li>',
    '<li>If the caller replies, the conversation lands in an inbox your team can see, and a person takes over.</li>',
    '</ol>',
    '<p>Nothing about this is complicated. The thinking goes into the wording of the message and the handling of a reply, especially one saying STOP.</p>',
    '<h2>Why the rules matter here</h2>',
    '<p>In the United States, the Telephone Consumer Protection Act and the FCC rules written under it cover automated texts. Two parts of the rule, 47 CFR 64.1200, are worth knowing.</p>',
    '<p>First, consent. Autodialled or prerecorded telemarketing calls and messages to mobile numbers need the recipient&#8217;s <em>prior express written consent</em>. The rule defines that as a signed agreement that clearly authorises such messages, and it says the agreement cannot be a condition of buying anything. Second, the rule defines telemarketing as a message sent to encourage the purchase of goods or services.</p>',
    '<p>Put together, the purpose of your message matters. A text that only responds to someone who just called you sits differently from one that pushes an offer. Which category your text-back falls into, and whether the caller&#8217;s own call counts as consent, are questions for a lawyer who knows your situation. We are not going to guess.</p>',
    '<blockquote class="lf-callout"><p><strong>Keep the first text strictly about their call</strong></p>',
    '<p>The CTIA, the wireless industry body, lists several ways a person can show opt-in, including starting a text exchange to which you reply with responsive information only. A phone call is not on that list, so do not treat it as settled. Whatever you decide, keep the text-back to a reply and leave promotions out of it.</p></blockquote>',
    '<h2>STOP has to work</h2>',
    '<p>The rule on opting out is clearer. A person may revoke consent by any reasonable method, and the rule names replying with words such as &#8220;stop&#8221;, &#8220;quit&#8221;, &#8220;end&#8221;, &#8220;revoke&#8221;, &#8220;opt out&#8221;, &#8220;cancel&#8221; or &#8220;unsubscribe&#8221;. The sender must honour it within a reasonable time that does not exceed ten business days. The rule also allows one confirmation text acknowledging the request.</p>',
    '<p>The CTIA guidance adds practical points. Tell people in the message how to opt out and use standard STOP wording. Treat ordinary variants, such as &#8220;please opt me out&#8221;, as valid. Allow more than one route, such as a call or an email. Send one final confirmation and nothing after it. Keep records of both opt-ins and opt-outs, so a number that said stop is never texted again.</p>',
    '<h2>Questions to ask your provider and your lawyer</h2>',
    '<figure><table><thead><tr><th>Ask</th><th>Why</th></tr></thead>',
    '<tbody>',
    '<tr><td>Does STOP stop everything, automatically?</td><td>Manual opt-out handling fails on busy days</td></tr>',
    '<tr><td>Is each opt-out stored against the number?</td><td>You need records, and a list you can check</td></tr>',
    '<tr><td>What registration, if any, does the provider require before you send?</td><td>Better to learn the requirements before launch than after</td></tr>',
    '<tr><td>Does the message name the business and say how to opt out?</td><td>The caller must know who is texting</td></tr>',
    '<tr><td>Who reads replies, and when?</td><td>A reply nobody sees is worse than silence</td></tr>',
    '</tbody></table></figure>',
    '<h2>A first draft of the message</h2>',
    '<p>Keep it short and plain: your business name, an apology for missing the call, an invitation to say what they need, your opening hours, and a line such as &#8220;Reply STOP to opt out.&#8221; Leave out prices, offers and links to promotions. Choose sending hours you would be comfortable receiving a text at yourself.</p>',
    '<h2>What to do this week</h2>',
    '<ol>',
    '<li>Read 47 CFR 64.1200 and the CTIA section on opt-out yourself, using the links below.</li>',
    '<li>Ask a lawyer whether a text to a caller needs consent in your case.</li>',
    '<li>Find out how your phone provider handles STOP, and test it with your own mobile.</li>',
    '<li>Write the message and have someone else read it cold.</li>',
    '</ol>',
    '<p>Sources: the <a href="https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200" rel="noopener">eCFR text of 47 CFR 64.1200</a> and the <a href="https://api.ctia.org/wp-content/uploads/2023/05/230523-CTIA-Messaging-Principles-and-Best-Practices-FINAL.pdf" rel="noopener">CTIA Messaging Principles and Best Practices</a> (May 2023).</p>',
    '<h2>What not to expect</h2>',
    '<p>A text-back will not rescue every missed call, since some callers were never going to reply. It does not replace answering the phone, and it does not make the legal questions go away. Treat it as a way to keep a door open for a short while, with a person walking through it.</p>',
    '<div class="lf-cta"><h2>Want missed calls to become conversations?</h2>',
    '<p>We build lead capture that turns missed contacts into a tracked conversation, with the opt-out handling you need and a clear record of each one.</p>',
    '<p><a href="/lead-capture/">See how lead capture works</a>: calls, forms and follow-up in one place.</p>',
    '<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. ',
    '<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>',
    '<aside class="lf-related"><h2>Related reading</h2><ul>',
    '<li><a href="/why-ai-follow-up-beats-working-harder/">The Enquiries You Lose at 9pm, and Why Speed Beats Working Harder</a></li>',
    '<li><a href="/what-does-a-lead-actually-cost-you/">If You Can&#8217;t Say What a Lead Costs, You&#8217;re Not Marketing: You&#8217;re Gambling</a></li>',
    '<li><a href="/a-chatbot-that-guesses-is-worse-than-none/">A Chatbot That Guesses Is Worse Than No Chatbot at All</a></li>',
    '</ul></aside>',
    '</div>',
  ].join(''),
}
