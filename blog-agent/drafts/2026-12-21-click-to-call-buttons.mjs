// Draft. Not yet published. Scheduled for 2026-12-21.
//
// Sources fetched (checked 2026-10-08):
// - MDN, the <a> element, telephone links:
//   https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a
//   Used for: tel: links, international format with + and country code, behaviour
//   varies by device (cellular devices autodial; other systems may open a calling
//   program, save the number or send it to another device). RFC 3966 is the
//   technical reference. MDN has no dedicated accessibility note for tel: links.
// - W3C, Understanding SC 2.5.8 Target Size (Minimum), WCAG 2.2 Level AA:
//   https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
//   Used for: pointer targets at least 24 by 24 CSS pixels, with exceptions; the
//   enhanced 2.5.5 is a stricter option. The post recommends a larger button as
//   advice, not as a quoted requirement.
// - Google Business Profile Help, phone number guidance:
//   https://support.google.com/business/answer/3038177
//   Used for: provide a number that connects to the business location, under the
//   business's direct control. Nothing is said about tracking numbers, because the
//   page fetched did not address them.
// Advice on sticky bars, hours and click tracking is reasoning, not a sourced claim.
export default {
  slug: 'click-to-call-buttons',
  title: 'Put Your Phone Number Where a Thumb Can Reach It',
  date: '2026-12-21',
  excerpt: 'On a phone, a number you must copy and paste is a number nobody dials. How tel: links work, where to put the button, what hours to show and how to count taps.',
  image: '/images/blog/click-to-call-buttons.webp',
  content: [
    '<div class="lf-article">',
    '<p class="lf-standfirst"><strong>Most people who want to phone a business from their phone want to do it in one tap. If the number is a picture, or a line of text that will not dial, you are asking them to remember seven digits and switch apps.</strong></p>',
    '<p>Picture a driver with a flat tyre, searching for a tyre repair business from the roadside. She finds a site, sees your number in the footer and presses it. Nothing happens, because it is plain text. She holds her finger on it, tries to copy it, loses her place and goes back to the results.</p>',
    '<p>The fix takes minutes. It is one of the cheapest improvements a small-business site can have.</p>',
    '<h2>How a tap-to-call link works</h2>',
    '<p>A phone link is an ordinary link whose address begins with <code>tel:</code> instead of <code>https:</code>. MDN&#8217;s examples put the number as the link&#8217;s visible text, with the address written as <code>tel:</code> followed by the digits. Use the international format with a plus sign and the country code, so the link works wherever the visitor is calling from.</p>',
    '<p>What happens next depends on the device. MDN notes that cellular devices autodial the number, while other systems may open a calling program, save the number to contacts or send it to another device. On a laptop with no phone app, a tap may do nothing at all, which is why the number should also appear as readable text.</p>',
    '<h2>Three places to put it</h2>',
    '<figure><table><thead><tr><th>Place</th><th>What it does</th><th>Watch out for</th></tr></thead>',
    '<tbody>',
    '<tr><td>Top of the page</td><td>Gives the urgent visitor a call button without scrolling</td><td>Do not cover the menu or the logo on a small screen</td></tr>',
    '<tr><td>A bar fixed to the bottom of the screen</td><td>Stays within reach of a thumb while they read</td><td>Keep it slim, and check it is not hidden behind a cookie banner or a chat widget</td></tr>',
    '<tr><td>End of each service page</td><td>Catches people who read first and decide later</td><td>Add the hours beside it</td></tr>',
    '</tbody></table></figure>',
    '<p>You do not need all three. For a business where people call in a hurry, a fixed bar on phones is usually the strongest. For one where people research first, the page ends matter more.</p>',
    '<p>If your site has a chat widget in the same corner, give each its own space. Two floating buttons stacked on top of each other on a small screen leave the visitor unsure which one to press, and sometimes neither is reachable.</p>',
    '<h2>Make it big enough to hit</h2>',
    '<p>WCAG 2.2 sets a minimum for pointer targets: at least 24 by 24 CSS pixels at Level AA, with some exceptions, and a stricter enhanced criterion above it. A phone button is often tapped in a hurry, with a thumb, on a moving bus. Aim well above the minimum, with clear space around it so neighbouring links are not hit by mistake.</p>',
    '<p>Label the button with an action, such as &#8220;Call us now&#8221;, and keep the number visible beside or inside it so the visitor sees who they will reach before they tap.</p>',
    '<blockquote class="lf-callout"><p><strong>Do not invite a call you cannot take</strong></p>',
    '<p>A call button implies someone will answer. If you are open from eight until five on weekdays, say so beside it, and say what happens outside those hours: a text, a form or a time you will ring back. A prominent number that rings out at six in the evening teaches visitors not to try.</p></blockquote>',
    '<h2>Which number to show</h2>',
    '<p>Show a number that reaches a real person, and keep it identical everywhere you list the business. Google&#8217;s Business Profile guidance asks for a number that connects to your business location and is under your direct control, which is a sensible rule for the website too. If you use a separate number for tracking, check how that interacts with your listings before you change anything public.</p>',
    '<h2>Counting calls honestly</h2>',
    '<p>You can record each tap on a phone link as an event in your analytics. That tells you how many people pressed the button and from which page. It does not tell you whether the call connected, how long it lasted or whether it became work.</p>',
    '<p>Treat taps as a signal, and the answered-call log as the truth. A simple habit helps: ask each new caller how they found you, and write the answer in the same place as the rest of your enquiries.</p>',
    '<h2>What to do this week</h2>',
    '<ol>',
    '<li>On your phone, open your site and tap your number. Does it dial?</li>',
    '<li>Check the number is written with a country code in the link.</li>',
    '<li>Add a call button to the top of your phone layout, or a slim fixed bar.</li>',
    '<li>Put your hours and your after-hours plan beside it.</li>',
    '<li>Ask for a tap event in your analytics, and compare it with your call log after a month.</li>',
    '</ol>',
    '<h2>What not to expect</h2>',
    '<p>A call button will not create demand. It removes a bit of friction from people who already want to talk to you. Some visitors will still prefer to write, so keep the form as well, and do not expect every tap to become a conversation.</p>',
    '<div class="lf-cta"><h2>Want your site to work for the person in a hurry?</h2>',
    '<p>We build sites with phone-first layouts, tap-to-call buttons, clear hours and call tracking that reports honestly.</p>',
    '<p><a href="/web-development/">See our web development service</a>: built for how people actually use a phone.</p>',
    '<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. ',
    '<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>',
    '<aside class="lf-related"><h2>Related reading</h2><ul>',
    '<li><a href="/nobody-waits-for-a-slow-website/">Nobody Waits for a Slow Website, and Google Stopped Waiting Too</a></li>',
    '<li><a href="/google-business-profile-does-more-than-your-website/">Your Google Business Profile Is Doing More Work Than Your Website</a></li>',
    '<li><a href="/website-making-or-costing-you-money/">Your Website Is Either Making You Money or Costing You Money</a></li>',
    '</ul></aside>',
    '</div>',
  ].join(''),
}
