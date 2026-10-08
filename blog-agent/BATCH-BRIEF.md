# Brief for writing a batch of scheduled posts

You are writing blog drafts for wavefrontstudiollc.com (Wavefront Studio, Sarasota FL,
25 people, serves clients worldwide). Your batch is a list in
`blog-agent/CALENDAR-BATCHES.json` (key given in your prompt). Each entry has the
publish `date`, `slug`, `topic` and an `angle`.

## Read first (all of it)
1. `blog-agent/CONTENT-CONTRACT.md`: voice, structure, thresholds. Binding.
2. `blog-agent/drafts/_template.mjs` and TWO finished drafts, for example
   `blog-agent/drafts/2026-w49-one-page-per-service.mjs` and
   `blog-agent/drafts/2026-w50-search-console-fifteen-minutes.mjs`. Match their register.
3. `blog-agent/validate-post.mjs` (the rules it enforces) and `DESIGN.md` "Copy" section.
4. `~/.claude/skills/super-blog/references/writing-rules.md` and `research-and-sourcing.md`.

## Hard rules
- **Never fabricate.** No invented statistics, studies, quotes, clients, case studies,
  prices, awards, "we tested" claims, or anecdotes presented as real. The opening
  "moment" is a hypothetical scene ("Picture a homeowner...") never a claimed real client.
- **Every factual claim a reader would act on must be checked against a primary source you
  actually fetched during this task** (Google Search Central, Google Business Profile Help,
  W3C/WCAG, web.dev, MDN, FTC, FCC, the platform's own docs). Use WebFetch/WebSearch.
  If you cannot verify a claim, cut it or rewrite it as reasoning ("in our experience"
  is NOT allowed either, since it implies evidence we have not recorded). No percentages
  unless sourced.
- Put a comment block at the top of each draft listing the sources you fetched, with URL
  and date checked (2026-10-08 or later). This is the audit trail.
- No prices or price ranges. No guarantees. No "best", "#1". No client quotes.
- Allowed studio facts only: Wavefront Studio, Sarasota FL, 25 people, worldwide, services
  (web design/development, SEO, AI chatbots, lead capture, social media, branding,
  digital marketing, graphic design, mobile apps, custom calculators), reply "within two
  working days", package-builder timings Launch 1-2 weeks, Grow 3-5, Scale 6-8. Hours Mon-Fri
  8am-5pm Eastern. Sister companies may be mentioned only as "our sister company".
- British spelling. No em dashes anywhere (use colon, comma, full stop, brackets). Avoid
  the validator's tell words. Sentence-case headings.
- Legal-adjacent topics (SMS consent, email law, accessibility, privacy): describe what the
  primary source says, add "this is not legal advice", point to the source.
- Each post must be genuinely useful to a small-business owner on its own: concrete
  steps, an honest "what not to expect". No padding to reach a word count. Different
  structure and examples from the other posts in your batch (vary the hook, the table or
  list choices, the callout). Do not reuse sentences across posts.
- Internal links may only point at ROUTES THAT ALREADY EXIST (the validator checks
  `src/routes.js`): service pages (/web-development/, /seo-service/, /lead-capture/,
  /digital-marketing/, /social-media-strategy/, /graphic-design/, /ai-chatbot/,
  /custom-calculators/, /mobile-app-development/), /ai-search-visibility/,
  /website-design-cost/, /free-website-audit/, /free-setup/, and the already-published posts.
  Do NOT link to other scheduled drafts. The "Related reading" aside needs exactly three
  published posts, chosen for real relevance, and each should differ across your batch
  where sensible. Published posts: see `src/data/generated/posts.js` slugs/titles.
- The CTA points at the service page the post earns, with the standing offer wording from
  the template.

## Deliverables per post
1. `blog-agent/drafts/<date>-<slug>.mjs` (e.g. `2026-10-12-homepage-first-screen.mjs`),
   same shape as the template: `slug` (exactly as given), `title` (a claim, under 80 chars),
   `date` (exactly as given), `excerpt` (110-170 chars), `image: '/images/blog/<slug>.webp'`,
   `content`. 900-1,060 words. First line comment: `// Draft. Not yet published. Scheduled for <date>.`
2. ONE motif file per batch: `blog-agent/drafts/_motifs/<batchkey>.mjs`:
   ```js
   export default ({ stroke, circle, rect, C, ink, ink2, brand, cyan }) => ({
     'the-slug': () => [ /* plain geometric shapes standing for the subject */ ],
   })
   ```
   Look at `MOTIFS` in `scripts/make-post-cards.mjs` for the style: 3 to 6 shapes, flat
   colours (cyan, brand, white-ish via opacity), nothing resembling text, motif within the
   400x400 box centred on C=200. Use `ink` only for strokes drawn over bright shapes.
   Make each motif visibly different from the others in the file.

## Checks (do these, do not skip)
- `node blog-agent/validate-post.mjs blog-agent/drafts/<file>` for each draft. The only
  error you may leave is "card not generated yet" (the coordinator draws the cards). Fix
  everything else, including word count and unresolved links. Read the warnings and fix
  any that point at a real problem.
- Do NOT run `npm run cards`, `publish-post.mjs`, git commands, or edit any file other than
  your own drafts and your own motif file. Other agents are writing in parallel.

## Report back (short)
List each post: date, slug, title, word count, validator result, any claim you cut and why,
anything the owner must verify. Do not paste post bodies.
