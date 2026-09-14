# Wavefront Studio — website

A rebuild of [wavefrontstudiollc.com](https://wavefrontstudiollc.com/) in React + Vite.
The content is 1:1 with the live WordPress site; the design and front end are new.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/ (54 prerendered pages + sitemap)
npm run preview    # serve the built output
npm run check      # eslint
```

## How it is organised

| Path | What it holds |
| --- | --- |
| `src/routes.js` | Every URL the site answers on. The router and the prerenderer both read it. |
| `src/data/site.js` | Nav, footer, contact details, testimonials, projects, and service cards. |
| `src/data/services.js` | The eight **Our Services** pages. |
| `src/data/customWorks.js` | The three **Custom Works** pages. |
| `src/data/generated/` | Content pulled from the live site: 18 location pages, 4 legal pages, 9 blog posts, and the Build Your Package pricing data. |
| `src/data/faqs.js` | The published Q&A pairs, shared by `/faqs/`, `/free-setup/`, and the assistant. |
| `src/pages/` | One component per page type. |
| `src/components/` | Nav, footer, layout, the site assistant, and the shared section primitives. |
| `src/chatKnowledge.js` | The assistant's search index, built from the same data the pages render. |
| `src/chatLocale.js` / `src/chatLanguage.js` | Assistant copy in six languages, plus language detection. |
| `scripts/prerender.mjs` | Renders every route to static HTML after `vite build`, and writes `sitemap.xml` / `robots.txt`. |

## The site assistant

A floating assistant (`src/components/ChatAgent.jsx`) answers questions from an
index built out of `src/data/` — services, custom works, plans, the Build Your
Package prices, the FAQs, the 18 area pages, the blog, and the policies. It
cannot state anything the site does not publish. The index is a lazy chunk, so a
visitor only downloads it when they open the panel, and the widget renders in the
browser only, keeping it out of the prerendered HTML.

Its second tab is a request form that posts through the same `deliverLead` path
as every other form on the site, with a size-limited chat transcript attached.
Answers stay in the browser: allowing a remote model to write free-form replies
would break the guarantee that every claim comes from published site content and
would disclose the visitor's conversation to another service.

## Forms

Enquiries are delivered by `src/formSubmission.js` to `VITE_LEAD_ENDPOINT` (or
`/api/lead` by default), which creates a `ProspectLead` in Base44. Only a JSON
success reply counts as delivery. Forms do not send email and never open a
visitor's email client.

Local development proxies `/api/lead` to the server-side lead service. Vercel
deploys `api/lead.js` as the same-origin production endpoint. Other hosts must
proxy the same path to the lead service or set `VITE_LEAD_ENDPOINT` to its
public HTTPS URL.

### Base44 lead storage

Copy the required values from `server/.env.example` into the root `.env`, then
provide the two values that must come from the Base44 builder/account:

```text
BASE44_APP_ID=your-non-secret-app-id
BASE44_API_KEY=your-server-only-api-key
```

The key owner must be permitted to create `ProspectLead` records by Base44's
row-level security. A dedicated `sales_rep` user is the least-privilege option.
Never expose the key through a `VITE_` variable or browser code.

Run the API locally with `npm run leads`; run its contract tests with
`npm run leads:test`.

## Deploying

`dist/` is a plain static folder — every route is a real `index.html`, so it works
on Netlify, Vercel, Cloudflare Pages, S3, or any web host. Point unknown paths at
`dist/404.html` if your host supports a custom 404.

For Vercel, import the GitHub repository and leave the project root at the
repository root. `vercel.json` runs the production build and publishes `dist/`.
Add `BASE44_APP_ID` and `BASE44_API_KEY` as encrypted Production environment
variables before testing forms; add any optional values from
`server/.env.example` when their defaults are not appropriate.

## Legacy email signature image

Existing email signatures load `/wp-content/uploads/2026/04/Wavefront-studio.jpg`.
Keep `public/wp-content/uploads/2026/04/Wavefront-studio.jpg` at that exact path
and filename. It is a JPEG copy of `public/wave-logo.webp` on a white background;
Vite copies it unchanged into `dist/`, so email clients can load it directly.

## Editing content

Text lives in the `src/data` files, not in the components. The two exceptions are
`src/data/generated/` (regenerated from the live site) and the page-specific copy
inside `src/pages/Home.jsx`, `CompanyPages.jsx`, `FreeSetup.jsx`, and
`LostLeadCalculator.jsx`, which is inline because those pages are one-offs.
