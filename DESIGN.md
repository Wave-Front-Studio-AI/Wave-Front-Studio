# Design rules

How this site looks and reads, written down so every change (by a person or an
AI tool) starts from the same decisions instead of drifting back to template
defaults. The values live in `:root` in `src/styles.css`; this file says how
to use them and what not to add.

The rules came out of a September 2026 pass that removed the usual "AI slop"
tells: purple-blue glows, grid-line backgrounds, stock photos of smiling teams,
counters that spin up to invented numbers, a small caps label above every
heading, and copy full of dashes and "not just X, it's Y".

## Type

- **Headings:** Outfit, weight 600, letter-spacing `-0.02em`. It is also the
  font in the quote PDFs, so it stays.
- **Body and UI:** IBM Plex Sans, self-hosted from `public/fonts/`. Not Inter,
  not Geist, not a system stack.
- Body text is at least `1rem`. Small print never goes below `0.8125rem`.
- Headings are sentence case: "What we build", not "What We Build". Page and
  product names keep their capitals.
- No uppercase, letter-spaced labels. If a label is needed, it is sentence
  case, `0.875rem`, weight 600, `--muted`.
- No small label above a heading that repeats or pre-announces it. The heading
  does that job on its own.

## Colour

| Token | Use it for |
| --- | --- |
| `--ink` | text, dark sections, primary buttons |
| `--text` | paragraphs |
| `--muted` | secondary text and labels (passes AA on paper) |
| `--brand-deep` | links and small blue text; `--brand` fails AA for text |
| `--brand` | hover borders, bars, focus rings |
| `--cyan` | fills only (button sweep, ticks, flags) with ink text on top; never text on white |
| `--cyan-deep` | teal text and ticks on white |
| `--paper`, `--white`, `--mist` | surfaces |

- No gradients on surfaces, text, buttons or progress bars. Dark sections are
  flat `--ink`.
- No glows: no coloured `box-shadow`, no `text-shadow`, no radial halos behind
  content, no cursor spotlights.
- No decorative background patterns (grid lines, dot fields, orbit rings).

## Shape and depth

- Radius scale: `--r-sm` 8px (inputs, chips), `--r-md` 12px (cards, media),
  `--r-lg` 16px (forms, big panels). Buttons are pills. Nothing else.
- Cards on the page get a 1px border and no shadow. Shadows (`--shadow-lift`)
  are only for things that float: dropdowns, dialogs, the chat assistant.
- `backdrop-filter` only on the sticky nav.
- Don't nest cards inside cards.

## Layout

- Not every list is a grid of identical cards. Services are an index of rows
  (`.offering-list`), features are a ruled checklist (`.tick-list.is-columns`),
  points are ruled columns (`.point-list`). Reach for a card only when the
  thing is clickable or genuinely separate.
- Numbers only on real sequences (`.process-timeline`). No "01 / 02 / 03" on
  things that aren't steps.
- No stat banners, counters or skill bars. A figure appears only with a named
  source on the same page (the Lost Lead Calculator is the model).
- Line length for reading copy stays around 64 to 72 characters.

## Imagery

- Real work only: screenshots of client sites and tools the studio built
  (`public/images/work/`), frames from the studio's own videos, the calculator
  and visualiser demos.
- No stock photos of people. No AI-generated scenes. If a section has no real
  image, it runs as text (`.service-single`) rather than borrowing one.
- A testimonial photo must be the actual person. Otherwise show initials.
- Screenshots show at their own proportions with a caption saying whose they
  are. Don't crop a UI so hard it stops looking real.

## Motion

- Motion answers an action: button press (`scale(0.97)`), hover colour, the
  button's diagonal sweep, dropdowns, the FAQ opening, the mobile menu.
- No scroll-reveal fade-ups, no auto-rotating panels, no marquees, no number
  tickers, no images zooming on hover, no cards lifting on hover.
- Custom easing from `:root` (`--ease-out`, `--ease-drawer`). Keep UI
  transitions under 300ms. Respect `prefers-reduced-motion`.

## Copy

The full rules are in `blog-agent/CONTENT-CONTRACT.md` and apply to every
page, not only the blog. The short version:

- British spelling. Plain, specific, second person.
- No em dashes, and no spaced hyphens or en dashes used as dashes. Use a full
  stop, comma, colon or parentheses.
- None of: "not just X, it's Y", "whether you're X or Y", rule-of-three
  padding, "seamless", "cutting-edge", "unlock", "elevate", "growth engine",
  "world-class", "transform".
- No invented proof: no client counts, years, percentages, awards or team size
  beyond "four people in Sarasota". Client quotes are word for word.

## Checks

- `npm run blog:audit` fails a post with an em dash and flags the phrases above.
- `node scripts/site-audit.mjs` (after `npm run build`) reports em dashes in the
  visible copy of every page.
