// Draft. Not yet published. Scheduled for 2026-10-29.
//
// Sources fetched (checked 2026-10-08):
// - Moffatt v. Air Canada, 2024 BCCRT 149 (Civil Resolution Tribunal of British
//   Columbia, 14 Feb 2024), full decision text read from the CanLII-indexed PDF
//   https://s3.amazonaws.com/IGG/AI+Part+1+-+Materials/Moffatt+v.+Air+Canada.pdf
//   Used for: chatbot gave wrong bereavement-fare advice; the airline argued the
//   chatbot was separate; the tribunal said the chatbot is part of the website
//   and the company is responsible for all of its information; Air Canada had
//   not taken reasonable care to ensure the chatbot was accurate.
//   Cross-read: https://www.grllp.com/blog/Can-statements-by-client-facing-AI-Chatbots-bind-their-owners-Moffatt-v.-Air-Canada-625
// Everything else is reasoning about how to configure a chatbot, not a factual claim.
// The post states the case is a Canadian small-claims decision and not a US ruling.
export default {
  slug: 'what-a-chatbot-should-never-say',
  title: 'Your Chatbot Is Speaking for You: Five Things It Should Never Say',
  date: '2026-10-29',
  excerpt: 'A website chatbot is your business talking. Prices, promises, availability and anything it cannot see should be off its menu, with a person ready to step in.',
  image: '/images/blog/what-a-chatbot-should-never-say.webp',
  content: [
    '<div class="lf-article">',
    '<p class="lf-standfirst"><strong>When a visitor reads a sentence in your chat window, they do not think &#8220;the software said that&#8221;. They think you did. Decide in advance what that voice is never allowed to say.</strong></p>',
    '<p>Imagine a small kitchen fitter whose site has a friendly chat assistant. A visitor types, &#8220;Can you do my kitchen for under a certain figure by the end of the month?&#8221; The assistant, wanting to be helpful, says yes. Nobody at the business has seen the room, checked the diary or priced the units.</p>',
    '<p>The visitor now holds a screenshot of a promise. Whether anyone could enforce it is a legal question, but the argument that follows will be unpleasant either way.</p>',
    '<h2>One decision worth knowing about</h2>',
    '<p>In February 2024 a Canadian tribunal decided a small claim against Air Canada. A customer had asked the airline&#8217;s website chatbot about bereavement fares, and the chatbot said he could apply after travelling. The airline&#8217;s real policy said otherwise. Air Canada argued, in effect, that the chatbot was a separate entity responsible for its own statements.</p>',
    '<p>The tribunal did not accept that. It said a chatbot is part of the website and that the airline was responsible for all the information on it, whether it sat on a static page or came from the chatbot. It also found the airline had not taken reasonable care to make sure the chatbot was accurate.</p>',
    '<p>This was one small-claims decision in British Columbia. It is not a ruling that binds anyone in the United States, and it is not legal advice. But it shows how a judge looked at the question, and it is a fair prompt to ask what your own chatbot is allowed to tell people.</p>',
    '<h2>The five things to take off the menu</h2>',
    '<figure><table><thead><tr><th>It should never</th><th>Because</th><th>Instead</th></tr></thead>',
    '<tbody>',
    '<tr><td>State a price or quote nobody approved</td><td>It cannot see the job</td><td>Give the pricing method, or hand over to a person</td></tr>',
    '<tr><td>Promise an outcome</td><td>Legal, medical and financial results depend on facts it does not have</td><td>Explain the process and book a conversation</td></tr>',
    '<tr><td>Confirm a date or stock it cannot check</td><td>An invented slot becomes a double booking</td><td>Offer your real booking link or ask for preferences</td></tr>',
    '<tr><td>Describe your policies from memory</td><td>It may blend yours with everyone else&#8217;s</td><td>Answer only from text you wrote and approved</td></tr>',
    '<tr><td>Pretend it is a person</td><td>It breaks trust the moment it errs</td><td>Say it is an automated assistant</td></tr>',
    '</tbody></table></figure>',
    '<h3>Prices you have not authorised</h3>',
    '<p>A chatbot can say how you price: by the hour, by the room, by a site visit. It should not invent a number, round one it has half-read, or confirm a figure the customer suggests. If you want it to give estimates, give it an approved method and a limit, such as a calculator you built for the purpose.</p>',
    '<h3>Promises in regulated or risky areas</h3>',
    '<p>If your work touches health, law, money or safety, the assistant should explain what you do and route the question to a qualified person. &#8220;That should be fine&#8221; is a sentence it must never produce about someone else&#8217;s situation.</p>',
    '<h3>Availability it cannot see</h3>',
    '<p>Unless the bot reads your live diary, it is guessing. A guess that sounds confident is the most expensive kind, because the customer arranges their week around it.</p>',
    '<blockquote class="lf-callout"><p><strong>&#8220;I don&#8217;t know&#8221; is a feature</strong></p>',
    '<p>The best-behaved assistant is the one that is comfortable saying it cannot answer, and offers a route to someone who can. If yours has never said it, test harder: it is probably improvising somewhere.</p></blockquote>',
    '<h2>Make the handover easy</h2>',
    '<p>Refusing is only half the design. The other half is a clear way out: a phone number with your hours, an option to leave a message, and a promise of when someone will reply. A visitor who hits a wall at 5.30pm and finds only a closed contact form will leave.</p>',
    '<p>Set trigger phrases that hand the conversation to a person straight away: complaint, refund, legal, emergency, &#8220;speak to someone&#8221;. Make sure the transcript travels with the handover, so the customer does not have to repeat themselves.</p>',
    '<h2>What to do this week</h2>',
    '<ol>',
    '<li>Open your chat window and try to make it quote a price, promise a result and book a slot that does not exist.</li>',
    '<li>Ask it about a policy, such as refunds or opening hours, and compare the answer with what you actually do.</li>',
    '<li>Read a week of real transcripts, if you keep them, and mark every answer you would not have given.</li>',
    '<li>Write the list of topics that must go to a person, and check each one actually does.</li>',
    '<li>Confirm that someone is notified of a handover and who it is.</li>',
    '</ol>',
    '<h2>What not to expect</h2>',
    '<p>No set of rules makes a chatbot incapable of error. Restricting it to your approved material reduces the room for improvisation, and testing finds the gaps, but you will still review conversations from time to time. A chatbot is a part of your front desk, not a replacement for the person who runs it.</p>',
    '<div class="lf-cta"><h2>Want a chatbot with boundaries?</h2>',
    '<p>We build AI chatbots that answer from your own approved material, hand over to your team when they should and keep a record of what was said.</p>',
    '<p><a href="/ai-chatbot/">See how our AI chatbots work</a>: what they answer, and what they pass on.</p>',
    '<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. ',
    '<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>',
    '<aside class="lf-related"><h2>Related reading</h2><ul>',
    '<li><a href="/a-chatbot-that-guesses-is-worse-than-none/">A Chatbot That Guesses Is Worse Than No Chatbot at All</a></li>',
    '<li><a href="/build-a-calculator-that-sells-for-you/">Stop Answering &#8220;How Much Roughly?&#8221; and Build a Calculator That Sells For You</a></li>',
    '<li><a href="/why-ai-follow-up-beats-working-harder/">The Enquiries You Lose at 9pm, and Why Speed Beats Working Harder</a></li>',
    '</ul></aside>',
    '</div>',
  ].join(''),
}
