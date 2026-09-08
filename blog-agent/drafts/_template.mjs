// Copy this file, rename it, and write the post. Files starting with "_" are
// ignored by the validator and the publisher.
//
//   node blog-agent/validate-post.mjs blog-agent/drafts/my-post.mjs
//   node blog-agent/publish-post.mjs  blog-agent/drafts/my-post.mjs
//
// Read CONTENT-CONTRACT.md first. The short version: 900-1060 words, no <h1>,
// one lf-standfirst, one lf-callout, one lf-cta, one lf-related with exactly
// three links, and no statistic you cannot point at a source for.

export default {
  // Lowercase kebab. Becomes the URL at the site root: /your-slug/
  slug: 'your-slug-here',

  // A claim, not a label. Look at the published titles for the register.
  title: 'A Statement Your Reader Would Argue With',

  // YYYY-MM-DD.
  date: '2026-01-01',

  // 110-170 characters. Shown on /blog/, in the page hero, and as the meta
  // description, so it has to read as a sentence rather than a summary.
  excerpt: 'One or two sentences that say what the reader gets, in the same voice as the post itself.',

  // Always /images/blog/<slug>.webp. Add a motif for this slug to
  // scripts/make-post-cards.mjs, then run: npm run cards
  image: '/images/blog/your-slug-here.webp',

  // Inline HTML. No <h1> — the template renders the title. The card image above
  // is rendered separately; an inline <img> here is allowed but rare, and the
  // file must exist in public/.
  content: [
    '<div class="lf-article">',

    // The hook. Bold, one or two sentences, no preamble.
    '<p class="lf-standfirst"><strong>The sentence that makes someone keep reading.</strong></p>',

    // Open on a concrete moment, not a definition.
    '<p>A specific scene the reader recognises.</p>',

    '<h2>A heading that makes a claim</h2>',
    '<p>Short paragraphs. Second person. No hype.</p>',

    // Optional: three figures. Only numbers you can defend.
    '<ul class="lf-stats">',
    '<li><strong>3</strong>What this number means</li>',
    '<li><strong>$0</strong>What this number means</li>',
    '<li><strong>18</strong>What this number means</li>',
    '</ul>',

    // Optional: a comparison table. Wrap it in <figure>.
    '<figure><table><thead><tr><th>Thing</th><th>Other thing</th></tr></thead>',
    '<tbody><tr><td>Detail</td><td>Detail</td></tr></tbody></table></figure>',

    // Required: one aside for the point that gets skipped.
    '<blockquote class="lf-callout"><p><strong>The bit people miss</strong></p>',
    '<p>The practical warning or caveat.</p></blockquote>',

    // Optional: a client quote. It MUST be one of the three real testimonials in
    // src/data/site.js, word for word, attributed to the right person. The
    // validator refuses anything else. A quote attributed to Wavefront Studio
    // itself is treated as a pull quote and needs no source.
    // '<blockquote class="lf-quote"><p>Exact testimonial text.</p>',
    // '<p><em>&#8212; Name, Role</em></p></blockquote>',

    '<h2>What to do this week</h2>',
    '<ol><li>A step somebody could actually take.</li></ol>',

    '<h2>What not to expect</h2>',
    '<p>Be honest about timelines and limits. It is the most trusted part of the post.</p>',

    // Required: the CTA. Point at the service page this post earns.
    '<div class="lf-cta"><h2>An offer that follows from the article</h2>',
    '<p>One or two sentences.</p>',
    '<p><a href="/free-audit/">The main action</a> &#8212; what it involves.</p>',
    '<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. ',
    '<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>',

    // Required: exactly three links to other published posts.
    '<aside class="lf-related"><h2>Related reading</h2><ul>',
    '<li><a href="/website-making-or-costing-you-money/">Your Website Is Either Making You Money or Costing You Money</a></li>',
    '<li><a href="/seo-keeps-working-after-you-stop-paying/">SEO Is the Only Channel That Keeps Working After You Stop Paying</a></li>',
    '<li><a href="/why-cheap-design-costs-more/">Cheap Design Costs More: What Your Brand Signals Before You Speak</a></li>',
    '</ul></aside>',

    '</div>',
  ].join(''),
}
