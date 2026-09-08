# Blog content contract

What a post on this site has to be. Every threshold here was measured across the
posts already published, not chosen in the abstract — so a post that satisfies
this contract looks like the rest of the blog rather than like a guess at it.

`validate-post.mjs` enforces the mechanical half. The judgement half is below it
and is yours.

## Where a post lives

| | |
|---|---|
| Source of record | `blog-agent/drafts/<name>.mjs`, exporting a post object |
| Published into | `src/data/generated/posts.js` (prepended) |
| Route registered in | `src/routes.js` (`postSlugs`) |
| URL | `/<slug>/` — **site root, not `/blog/`**. `/blog/` is only the index |
| Rendered by | `src/pages/Longform.jsx`, `BlogPost` |

`publish-post.mjs` does both writes. Do not hand-edit `posts.js`: it is easy to
break the array and the publisher is idempotent, so re-running it is safe.

## Shape

```
{ slug, title, date, excerpt, content }
```

- **slug** — lowercase kebab. Becomes the URL. Never reuse or change one after
  publishing; the old URL would 404 and any link to it dies.
- **title** — a claim someone could disagree with, not a topic label. Compare
  "SEO Is the Only Channel That Keeps Working After You Stop Paying" against
  "SEO Services". Under about 80 characters.
- **date** — `YYYY-MM-DD`. Drives the visible date and `datePublished` in the
  BlogPosting schema.
- **excerpt** — 110–170 characters. Does triple duty: the `/blog/` listing, the
  paragraph under the title, and the meta description. Write it as a sentence.
- **content** — inline HTML, described below.

## Required structure

Measured across every published post, these are not negotiable:

| Element | Rule | Why |
|---|---|---|
| `<div class="lf-article">` wrapper | opens and closes the content | every `.longform` style hangs off it |
| `<p class="lf-standfirst">` | exactly one, first | the bold hook |
| `<h1>` | none | the template renders the title |
| `<h2>` | 5–10 (includes the CTA and Related headings) | observed 6–9 |
| `<blockquote class="lf-callout">` | one | observed in all of them |
| `<div class="lf-cta">` | exactly one, near the end | the in-article offer |
| `<aside class="lf-related">` | exactly one, last, **exactly three links** | every published post has three |
| Word count | 900–1,060 | observed 919–1,024 |

Optional, used in roughly half the posts: `<ul class="lf-stats">` (three
figures), `<figure><table>` (one comparison table), `<blockquote class="lf-quote">`.

## Images

Every post has one **card image** at `/images/blog/<slug>.webp`, declared in the
`image` field. It does double duty: the thumbnail on `/blog/` and the banner
below the title on the post itself. The validator refuses a post whose card is
missing, so generate it before publishing.

Cards are drawn, not photographed, by `scripts/make-post-cards.mjs`. They share a
gradient, a cyan glow and the rotated square from `.kinetic-button`, so the list
on `/blog/` reads as one family; what changes per post is a plain geometric motif
standing for the subject. Adding a post means adding one entry to `MOTIFS` in
that file, then:

```bash
npm run cards           # draws any card that does not exist yet
npm run cards -- --force   # redraws all of them, e.g. after a palette change
```

The palette is copied from `:root` in `src/styles.css` — if the brand colours
change, update it there too. Cards carry **no text**: the brand fonts ship as
woff2, which the SVG rasteriser cannot load, and the title sits next to the image
in HTML anyway. They are also decorative, so both `<img>` tags use `alt=""`
rather than repeating the headline to a screen reader.

Inline `<img>` inside the body is allowed but rare (one of eleven posts). If you
use one it must live in `public/images/`, carry real alt text, and set
`loading="lazy"` with explicit width and height.

This still differs from the AI Site blog, which requires a photographic-style
hero plus two content-bearing infographics per article. One abstract card here;
do not carry that habit across.

## Voice

Read three published posts before writing. The register is consistent:

- **Open on a moment, not a definition.** "There is a moment most business owners
  have on a Tuesday afternoon." Never "In today's digital landscape."
- **Second person, present tense, short paragraphs.** Two or three sentences.
- **Concrete over abstract.** Name the thing: the 6MB header image, the chat
  widget nobody removed, the review that stopped two years ago.
- **Admit the limits.** Every post has a "what not to expect" section, and it is
  the most credible part. Real timelines. What the service will not fix.
- **British spelling.** "optimise", "behavioural", "prioritise". The site uses it
  throughout, including the service page titled "Search Engine Optimisation".
- **No hype and no guarantees.** No "revolutionary", no "#1", no promised
  results. The validator warns on promise-shaped wording.

Close on a specific first action the reader can take alone, without buying
anything — the private-window search, the phone speed test. The offer comes
after, in the CTA block, not woven through the argument.

## Claims

- **No unsourced statistics.** If a number is in the post you must be able to
  name where it came from. The validator flags every percentage for confirmation.
  Prefer verifiable, checkable facts over impressive ones: Google's own published
  Core Web Vitals thresholds beat a vendor blog's conversion-lift claim.
- **Verify against the primary source, not the summary.** Several vendor posts
  claim Google tightened the LCP threshold to 2.0s in March 2026; Google's own
  documentation still says 2.5s. That claim is not in our blog as a result.
- **Client quotes must be real.** Only the three testimonials in
  `src/data/site.js` may be quoted, word for word, attributed to the right
  person: Tony Dyke (ResinRock, 12+ connected sites), Sharon Diaz (page five to
  page one), James Adkins (lead routing and response time). The validator refuses
  anything else. A quote attributed to Wavefront Studio itself is a pull quote
  and needs no source.
- **No invented proof.** No client counts, revenue figures, awards, team size, or
  case studies beyond what the site already publishes.

## Links

- Every internal link must resolve to a real route in `src/routes.js`. The
  validator checks this.
- The CTA points at the service page the post earns — `/free-audit/`,
  `/seo-service/`, `/web-development/`, `/lead-capture/` and so on.
- The standing offer wording is "waiving setup fees for five businesses this
  quarter on AI chatbots, web development and SEO", linking `/free-setup/`.
  If that offer changes on the site, it changes here too.
- Phone links must use a number published in `src/data/site.js`.

## Before publishing

```bash
node blog-agent/validate-post.mjs blog-agent/drafts/my-post.mjs
node blog-agent/publish-post.mjs  blog-agent/drafts/my-post.mjs
npm run check
npm run build
```

Then open the page and look at it — at desktop width and at 390px. Check the
standfirst, any table, the CTA links, and the three related links. The build
prints the prerendered page count; it should have gone up by one per post.

Publishing is a repository change. Deploying is separate and is a decision for
the site owner.
