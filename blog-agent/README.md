# blog-agent

Tooling for writing and publishing posts on this site. Two small Node scripts and
a contract; no dependencies beyond what the site already has.

This exists because posts live as inline HTML inside `src/data/generated/posts.js`
and their routes live in `src/routes.js`. Adding one by hand means editing two
files consistently and remembering a set of house conventions that were previously
written down nowhere. That is the part this automates.

## Writing a post

```bash
cp blog-agent/drafts/_template.mjs blog-agent/drafts/2026-w38-my-topic.mjs
# write it, then:
node blog-agent/validate-post.mjs blog-agent/drafts/2026-w38-my-topic.mjs
```

Read `CONTENT-CONTRACT.md` first. It has the voice, the required structure, and
the thresholds — all measured from the posts already published, so a passing
draft looks like the rest of the blog.

## Publishing

```bash
node blog-agent/publish-post.mjs blog-agent/drafts/2026-w38-my-topic.mjs
npm run check
npm run build
```

The publisher validates first and refuses to write if anything fails. It changes
exactly two files — `src/data/generated/posts.js` and `src/routes.js` — and is
idempotent, so a slug already published is skipped rather than duplicated. Add
`--dry-run` to see what it would do.

Posts are prepended, because `BlogIndex` renders the array in order with no sort,
so newest belongs first.

## Checking what is already live

```bash
node blog-agent/validate-post.mjs --live
```

Runs the same rules against the published posts. Useful after changing a rule:
if the contract no longer describes the blog, one of the two is wrong. It
currently passes on all of them, with two warnings on
`let-them-see-it-before-they-buy-it`, which carries two percentages that predate
this tooling and have no source recorded.

## Files

| File | What it is |
|---|---|
| `CONTENT-CONTRACT.md` | The house rules and the evidence behind each threshold |
| `validate-post.mjs` | Gate a draft; also audits published posts with `--live` |
| `publish-post.mjs` | Write a validated draft into the site |
| `drafts/_template.mjs` | Annotated starting point |
| `drafts/*.mjs` | Source of record for published posts |

Files beginning with `_` are ignored by both scripts.

## Errors and warnings

Errors block. They are the things a script can be certain about: a slug that
collides, a word count outside the house range, an internal link that resolves to
nothing, an invented client quote, unbalanced HTML.

Warnings never block. They mark what a script cannot judge: a percentage that
needs a source, vague attribution like "studies show", promise-shaped wording, a
missing callout. Read them; most of the time they are pointing at something real.

## Not covered here

This publishes into the repository. It does not deploy, and it does not decide
what to write about. Topic selection, research, and fact-checking are upstream of
it — the contract's Claims section sets the standard those have to meet.

The AI Site (`AIWebsite.git`) has a separate, much heavier blog agent with its own
research protocol, markdown pipeline, and image requirements. The two blogs are
not interchangeable: different length, different byline, different structure, no
images here. Do not copy a post from one to the other.
