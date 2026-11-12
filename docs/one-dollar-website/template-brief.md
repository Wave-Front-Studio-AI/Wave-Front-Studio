# $1 Website templates: build brief

The $1 Website sells a real, good-looking five page website for $1 setup and $99 a month hosting. Customers pick one of 15 templates and we fill in their own words, photos and logo. **Any template must work for any business**, so the templates are design styles, not industries.

The bar is a premium theme from a top template marketplace (Squarespace, Framer, ThemeForest best sellers). A visitor should think "I would be proud to have this site". The first attempt failed because every template was the same skeleton with colour blocks and no photos. Do not repeat that.

## Where files go

```
public/demos/templates/<slug>/
  index.html              Home
  services/index.html     Services
  about/index.html        About
  gallery/index.html      Gallery (work, projects or photos)
  contact/index.html      Contact
  style.css               all styles for this template
  main.js                 optional, small vanilla JS only (menu, reveals)
  img/                    WebP photos
  fonts/                  self-hosted .woff2 files
  CREDITS.txt             source of every photo
```

- Link everything with root paths: `/demos/templates/<slug>/about/`, `/demos/templates/<slug>/style.css`. No relative paths.
- Every page: `<!doctype html>`, `lang="en"`, charset, viewport, `<meta name="robots" content="noindex, nofollow">`, a `<title>` like `Atlas Co. | Sample website`, a meta description, the shared header and footer, and the current page marked in the nav with `aria-current="page"`.
- No external requests at runtime: no Google Fonts links, no CDNs, no analytics, no iframes, no maps embeds. Fonts are downloaded once and self-hosted.
- No frameworks. Hand-written HTML and CSS, plus at most a small `main.js`.

## Each template is fully custom

- Its own layout system, section shapes, typography, spacing scale, button and card styles, header style, footer, and motion. No shared skeleton between templates. Two templates from the same builder must not look related.
- Real composition: varied sections (full-bleed photo bands, split image and text, overlapping cards, stat or process strips, testimonials, FAQ, logo-free trust rows, image grids, big CTA). Pick what fits the style; don't use the same section order on every template.
- The Home page needs at least seven distinct sections. Services, About, Gallery and Contact each need a proper hero and at least four sections, sharing the template's visual language.
- Motion: subtle and purposeful (fade or slide reveals, hover states, a sticky or shrinking header). Respect `prefers-reduced-motion`. No scroll-jacking.
- Mobile first and flawless at 320, 375, 414, 768, 1024 and 1440 px wide. No horizontal scroll. A working, accessible mobile menu (button with `aria-expanded`, Escape closes it).

## Copy (generic on purpose)

- Sample business name: the template name plus "Co." (for example "Atlas Co."), with a simple text or SVG wordmark. No real company names or logos.
- Write for "a local business that sells a service". It should read naturally whether the customer is a roofer, a dentist, a salon or an accountant. Services to use: Consultations, Planning and design, Installation or setup, Repairs, Maintenance plans, Custom projects (rename lightly per template if it reads better, but keep them generic).
- Plain, warm, specific-sounding sentences. **No dashes** in visible copy (no em dash, no en dash, no spaced hyphen); use commas, colons or full stops. No "not X but Y" sentences. No "seamless, elevate, unlock, leverage, cutting-edge". No headings in italics. No gradient text.
- Placeholder contact details only: phone `(555) 010-0100` style, email `hello@yourbusiness.com`, address `100 Main Street, Your Town`.
- Testimonials are allowed as clearly generic samples: first name and last initial only ("Dana R."), short and believable. No star counts, awards, review platform names, years in business or customer counts. If you show numbers, keep them as obvious placeholders such as "Same week" or "Free quotes", not invented statistics.
- The contact form is a demo: it must not submit anywhere. On submit, prevent the default and show "This is a sample form. On your live site, enquiries go straight to your inbox."

## Photos

- Use a pool of Unsplash photo ids gathered from Unsplash search pages filtered to the free licence (the first build used a scratch file of about 200 ids). Each line is `theme:id,id,...`. The image URL for an id is `https://images.unsplash.com/photo-<id>?w=2400&q=85&fm=jpg`. These are Unsplash free-licence photos (commercial use allowed, no credit required).
- Download and convert with `node scripts/template-image.mjs "<url>" public/demos/templates/<slug>/img/<name>.webp <width>` (use 2000 for full-bleed heroes, 1400 for large images, 900 for cards).
- **Look at every photo** after downloading it (open the .webp with your Read tool). Keep only sharp, well-lit, generic photos that suit the template's mood and would make sense for most service businesses: people at work, friendly staff, client meetings, handshakes, interiors, architecture, landscapes, textures. Reject anything with a readable brand, an obviously specific trade (no medical scrubs, no food close-ups, no tools that pin it to one trade unless the template is about craft generally), watermarks or awkward stock poses. Delete rejected files.
- 8 to 14 photos per template. Try not to reuse a photo another builder is likely to pick: prefer different themes from the pool for each of your templates.
- Size budget: hero up to 300 KB, other photos up to 180 KB, whole template folder under 4 MB. Use `loading="lazy"`, `decoding="async"`, and `width` and `height` on every image below the fold. Meaningful `alt` text.
- Write `CREDITS.txt` listing each file and its Unsplash photo id.

## Fonts

- Choose a distinctive, fitting pairing per template (at most two families, at most four weights in total). Get the .woff2 files from Fontsource on jsDelivr, for example `https://cdn.jsdelivr.net/npm/@fontsource/<family>@5/files/<family>-latin-<weight>-normal.woff2` (download with curl into `fonts/`), and declare them with `@font-face` and `font-display: swap`.
- Do not use Inter, Roboto, Open Sans, Montserrat or Poppins as the display font. Avoid system-ui as the only font.

## Accessibility and quality floor

- Text contrast AA (4.5:1 body, 3:1 large). Visible focus states. Landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, ordered headings, labelled form fields, buttons that are buttons, links that are links.
- No layout shift from fonts or images. No console errors.

## How to check your work

1. The dev server at `http://localhost:5178` serves `public/`, so your pages are at `http://localhost:5178/demos/templates/<slug>/`. Do not start or stop servers.
2. Take screenshots with headless Chrome and look at them with your Read tool:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --screenshot=/tmp/<slug>-home.png --window-size=1440,4200 http://localhost:5178/demos/templates/<slug>/`
   and again at `--window-size=390,6000` for phone. Check every page at both sizes. Fix what looks off, then re-check.
3. Run `npx -y @gessobuild/anti-slop check public/demos/templates/<slug> --json --marketing` and fix real findings.
4. Load the design skills before you start designing: `design-taste-frontend` (read the Design Read, the dials, the AI tells and the pre-flight) and `hallmark` (macrostructures, the six disciplines, the slop test). Use them to push each template to a distinct, premium result.

## Do not

- Do not edit anything outside your own `public/demos/templates/<slug>/` folders. Other builders are working in the same repo right now.
- Do not run git, do not start or stop servers, do not install packages into the project.
