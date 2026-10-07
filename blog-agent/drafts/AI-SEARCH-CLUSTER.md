# AI search visibility: topic cluster

Status: three spoke drafts written and passing `npm run blog:check`. Nothing published. `posts.js` and `routes.js` untouched.

## Spokes (drafts)

| Draft file | Slug | Planned date | Words |
|---|---|---|---|
| `2026-w46-check-ai-names-your-business.mjs` | `check-whether-chatgpt-or-google-ai-names-your-business` | 2026-10-08 | 1,044 |
| `2026-w47-ai-bots-robots-txt.mjs` | `which-ai-bots-to-allow-in-robots-txt` | 2026-10-15 | 1,052 |
| `2026-w48-do-you-need-llms-txt.mjs` | `do-you-need-an-llms-txt-file` | 2026-10-22 | 1,022 |

Dates are placeholders; set them at publish time. Card images and `MOTIFS` entries were added (`scripts/make-post-cards.mjs`, `public/images/blog/*.webp`) because the validator requires the card.

Cross-links to add AFTER publishing (the validator cannot resolve unpublished slugs, so the drafts mention each other in plain text only):
- Draft A, "Your robots.txt file is the usual place to look": link to the robots.txt spoke.
- Draft C, "the prompt test in our guide to checking whether ChatGPT or Google AI names your business": link to spoke A.
- Draft B could link to the llms.txt spoke in "What robots.txt cannot do".
- Each spoke should link up to the pillar once it exists.

## Pillar

Working title: **AI Search for Local Businesses: What We Know, What We Do Not, and What to Fix First**

Suggested slug: `/ai-search-visibility/` (a page, not a post).

Why not a blog post: the contract caps posts at 900-1,060 words, one table, one callout, three related links, and renders them through `Longform.jsx` `BlogPost`. A pillar needs roughly 2,500-3,500 words, a contents list, several tables, and links out to all spokes. That needs a non-blog template: a new `kind` in `src/routes.js` (like `service`), a page component, its own SEO entry in `src/data/seo.js`, and inclusion in the sitemap and `llms.txt` (both generated in `scripts/prerender.mjs` from route kinds). This is a code change and is the owner's call; `blog-agent/validate-post.mjs` will not check it.

### Outline

1. **Standfirst and moment.** A customer asks a chatbot for a business like yours and gets three names. Are you one of them?
2. **How AI answers about local businesses are put together (plain version).** Two sources: what a model already knows, and what a search tool fetches live. State plainly that outsiders cannot see how names are chosen.
3. **What is and is not known.** A sourced table: claim, source, date checked. Only primary sources (Google Search Central, OpenAI, Anthropic, Perplexity docs). Mark each row confirmed, unconfirmed or unknown.
4. **Step 1, check where you stand.** Short version of spoke A with link. Include the downloadable recording sheet (see data below).
5. **Step 2, let the right bots in.** Short version of spoke B with link. Include this site's own robots.txt as the worked example.
6. **Step 3, make the business easy to describe.** Services page, service area, consistent name/address/phone, Google Business Profile, reviews on Google (live only, per contract). Link `/google-business-profile-does-more-than-your-website/` and `/seo-service/`.
7. **Step 4, optional extras.** llms.txt (link spoke C), structured data. Say low effort, unproven.
8. **What we will not promise.** No guaranteed mentions, no ranking position, timelines unknown.
9. **Repeat the test.** Quarterly cadence and what changed.
10. **FAQ** (5-6 questions, each answerable from sourced facts). Add FAQ schema only if the answers match the visible text exactly.
11. **CTA.** `/seo-service/`, `/free-website-audit/`, the standing setup-fee offer, "we reply within two working days".

House rules still apply: British spelling, no em dashes, no unsourced statistics, no client quotes, ResinRock only as "our sister company" if mentioned at all.

## What the owner must supply

Nothing below is in the repository, and none of it should be invented.

1. **Decision: pillar as a page.** Approve a new route kind and template, or fold the pillar into one long post and relax the word cap.
2. **The studio's own prompt-test results.** Run spoke A's test on Wavefront Studio itself: the questions used, engines, dates, runs and the cited/mentioned/recommended counts. Without real counts, the pillar can show the method only, not a worked example. Record "no result" honestly if that is the outcome.
3. **Confirm the llms.txt statement.** Spoke C says "We have no evidence that it has brought us a single mention in an AI answer." That is true only if the owner has actually checked. Confirm or delete the sentence. (The site does generate `llms.txt` in `scripts/prerender.mjs`; that part is verifiable.)
4. **Confirm the robots.txt statement.** Spoke B describes this site's robots.txt (training bots blocked, search bots allowed, decision of 2026-10-01, revisit yearly). It matches `scripts/prerender.mjs` today; confirm it is still the owner's position at publish time.
5. **Re-verify bot names and behaviour at publish time.** Names and behaviour in spoke B (OAI-SearchBot, GPTBot, Claude-SearchBot, ClaudeBot, PerplexityBot, Googlebot, Google-Extended, plus ChatGPT-User and Claude-User) are written from the vendors' documentation as we know it and were not re-fetched while drafting. Open each vendor's current crawler page and Google's AI features guidance, and note the check date. Change any wording that no longer matches.
6. **Any real client outcome.** Only if the owner has a client result and permission to publish it. Otherwise the pillar carries no case study (contract: no invented proof).
7. **Local examples for the questions.** A few real, non-embarrassing example prompts for Sarasota-area trades or services the studio is happy to name, if they want local flavour.
8. **A pillar byline and date.** Posts use "Daniel, Wavefront Studio"; confirm the byline for a page.
9. **Publishing order.** A first, then B, then C, adding the cross-links above on the way. Deploy is a separate owner decision.

## Publishing checklist (per spoke)

```bash
node blog-agent/validate-post.mjs blog-agent/drafts/<file>.mjs
node blog-agent/publish-post.mjs  blog-agent/drafts/<file>.mjs
npm run check && npm run build
```
Then check at desktop width and 390px.
