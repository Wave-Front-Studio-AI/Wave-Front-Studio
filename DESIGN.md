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
| `--brand-deep` | links and small blue text on white |
| `--brand` | sky blue `#3578c1`: hover borders, bars, focus rings, and the header button's hover fill with white text (4.56:1, AA) |
| `--cyan` | the accent, logo teal `#2bb3c8`: fills (button sweep, ticks, flags) with ink text on top; never text on white, and never text, lines or icons on navy or photos (see Teal on navy) |
| `--cyan-deep` | teal text and ticks on white |
| `--paper`, `--white`, `--mist` | surfaces |

- No gradients on surfaces, text, buttons or progress bars. Dark sections are
  flat `--ink`.
- No glows: no coloured `box-shadow`, no `text-shadow`, no radial halos behind
  content, no cursor spotlights.
- No decorative background patterns (grid lines, dot fields, orbit rings).

- **Teal on navy:** the accent teal (`--cyan`) is never used for text, lines or icons on navy or on photos. It passes contrast there, but it reads dim. Dark sections use white, and the teal appears as a fill with navy on it (ticks on white cards, button hover sweeps, the funnel).
- **Text on dark backgrounds:** at least 85% white and at least 14px, footer and menu small print included. The one exception is the 72% "not included" lines in a dark plan card.

## Shape and depth

- Radius scale: `--r-sm` 8px (inputs, chips), `--r-md` 12px (cards, media),
  `--r-lg` 16px (forms, big panels). Buttons are pills. Nothing else.
- Cards on the page get a 1px border and no shadow. Shadows (`--shadow-lift`)
  are only for things that float: dropdowns, dialogs, the chat assistant.
- No `backdrop-filter`.
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

- Motion answers an action or marks an arrival: button press
  (`scale(0.97)`), the button's diagonal sweep, dropdowns, the FAQ opening,
  the mobile menu, hover states on things that are links.
- Allowed, and already built: one short entrance for the first screen on page
  load; whole sections rising in once as they scroll into view
  (`useSectionReveal` in `Layout.jsx`, never card by card); the process steps'
  rules drawing across in order; linked cards lifting 3px with the screenshot
  easing forward 2%; client logos going from grey to colour on hover.
- Not allowed: per-card staggered fade-ups, auto-rotating panels, marquees,
  number tickers, cursor spotlights, anything that loops forever.
- Custom easing from `:root` (`--ease-out`, `--ease-drawer`). Keep UI
  transitions under 300ms. Respect `prefers-reduced-motion`.

## Navigation

The header takes its layout from realtimemarketing.com and its menus from the studio's sister site, wavefrontstudio.ai (October 2026).

- **Layout:**
  - A white bar with the logo and four navy items (Services, Resources, Who we are, Contact); the package builder is the first card under Resources. The items turn `--brand-deep` on hover.
  - A plain navy "Speak to the studio" pill with white text. On hover it fades to sky blue (`--brand`) and the text stays white. It has no diagonal sweep and no circling light.
  - The bar scrolls away with the page; it is not sticky.
  - Below 1100px the items move into the menu.
  - Below 760px the header is just the logo, and a Contact / Call us / Menu bar stays fixed to the bottom of the screen on every page.
- **Menus:**
  - Services opens a wide white panel: the core services with a line each, the custom work, and an ink panel through to the full list.
  - Resources and Who we are open as three cards each.
  - The phone and tablet menu is one flat list in large type.
- **Data:** `primaryNav`, `mobileNav` and `navCta` in `src/data/site.js`.
- **Uppercase labels:** the small uppercase labels inside the dropdown panels match the sister site. They are the one place uppercase labels are allowed.

## Home page

In October 2026 the studio chose a louder home page, modelled on the layout
and motion of realtimemarketing.com. It is the one page allowed to break some
of the rules above, and only in these ways:

- An uppercase display line in the hero, inside the single H1, followed by
  the sentence-case keyword line.
- Counters, but only for figures with a named source next to them (12+
  sites for one client, page five to page one, four people). The server
  renders the final number.
- Blocks sliding in from their side (`data-enter` in `Home.jsx`), a light
  circling the main buttons (`.button-shine`), one pulse on the process
  button, a play ring on the video, and the routing diagram's looping dots
  (paused while off screen).
- Stock photography (October 2026, at the studio's request): a full-width
  hero photo under a flat ink overlay, a photo behind each service tile, and
  one in the closing banner.
  - The tile photos are shown in greyscale with navy multiplied over them, so
    the white text on them always reads.
  - The accent teal stays off the photos (tiles, video).
  - All are from Unsplash under the Unsplash License, with IDs recorded in
    `Home.jsx`.
  - They are never presented as client work or as the studio's own team, and
    they are not used on other pages.
- A 3D funnel (`FunnelStory.jsx` and `src/three/funnelScene.js`), modelled on the granule pour at resin-rubber.com.
  - **Behaviour:** on desktop the section pins for four scroll steps. Scrolling drives a camera move, one shot per step: high and wide, swung round and lower, a low side angle, then down by the spout. The funnel itself never turns.
  - **Bills:** cartoon dollar bills, deliberately unlike real currency, flutter in at the top, fall through every tier and settle in a pile under the spout. None leave the funnel.
  - **Highlight:** the tier for the current step turns solid, glows, gets a thicker rim and grows slightly. The others fade to pale outlines.
  - **Numbers:** the drop-out shares are illustrative, so the page never shows numbers for them.
  - **Loading:** three.js loads only when the section is near the screen, and frames run only while it is visible.
  - **Fallback:** phones, reduced motion and browsers without WebGL get the flat drawing and the four steps as a list, which is also what the prerendered page contains.
- A review slider moved only by the visitor.
- The page names no client in its own copy, so it doesn't read as an advert
  for one business. Google reviews are shown as written.

Everything else still applies: no invented numbers, no
gradients or glows on surfaces, and every effect stops under
`prefers-reduced-motion`. Nothing on the first screen is hidden while it waits
for JavaScript. Don't copy these effects to other pages without a new decision.

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
