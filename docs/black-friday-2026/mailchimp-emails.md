# Mailchimp emails, November and December 2026 (drafts, nothing sent)

Five designed HTML emails for the **Wavefront Studio LLC** audience. The finished files are in `docs/emails/`, built by `node scripts/build-emails.mjs` from one email-safe layout (600px, tables, inline styles, web-safe fonts, PNG and JPG images hosted on the site under `/images/email/`). To change a word, edit the script and rebuild.

Nothing has been scheduled or sent. Tony reviews and sends each one in Mailchimp.

## Send plan

| # | File | Send | Audience | Subject (option B) |
|---|---|---|---|---|
| 0 | `0-dollar-website-launch.html` | Tue Nov 17, 9am Eastern | Whole audience | Black Friday: a PROFESSIONAL website for $1 (Your $1 website ends December 1) |
| 1 | `1-black-friday-deals-live.html` | Thu Nov 19, 8am Eastern | Whole audience | Black Friday pricing is on now (20% off a new website through Dec 1) |
| 2 | `2-black-friday.html` | Fri Nov 27, 8am Eastern | Whole audience | Would a customer find you tonight? (A price calculator that works at 9pm) |
| 3 | `3-black-friday-last-days.html` | Mon Nov 30, 8am Eastern | Whole audience | The deals end tomorrow night (Two days left on Black Friday pricing) |
| 4 | `4-black-friday-follow-up.html` | Wed Dec 2, 9am Eastern | Only people who clicked a link in emails 1 to 3 | Still want that quote? (Your quote is easy to rebuild) |

The $1 Website email goes first and on its own, so its leads are easy to tell apart from the sale's. Preview text for each is in `docs/emails/emails.json`.

## How leads are tagged in the WF app

Every link in every email carries tags, for example:
`utm_source=mailchimp&utm_medium=email&utm_campaign=dollar-website&utm_content=launch-email-template&utm_term=atlas`

- **utm_campaign**: `dollar-website` or `black-friday-2026`.
- **utm_content**: which email and which link, for example `bf-2-black-friday-build-deal` or `launch-email-hero`.
- **utm_term**: on the $1 email's template pictures, which template they clicked.

The website keeps those tags for the whole visit. When the person sends any form (the $1 intake form, a quote from the package builder, the free audit, contact), the lead arrives in the WF app with **UTM Source, UTM Medium, UTM Campaign, UTM Content and UTM Term** filled in, plus **First touch** and **Last touch**. Filter leads by UTM Campaign to see what each email brought in.

**Lead source** in the WF app is a fixed list, so it cannot hold a free label like "Email: $1 Website". It is set automatically when a list value fits: a Meta ad click (`fbclid` or `utm_source=facebook` with a paid medium) becomes **meta_ad**, a visit from Google search becomes **seo_organic**, social posts become **social**, other sites become **referral**. Email and untagged visits stay **website**, and the UTM fields say which email it was.

**Tagging ads the same way:** put these on the ad's link, for example a Meta ad for the $1 site:
`/1-dollar-website/?utm_source=facebook&utm_medium=paid_social&utm_campaign=dollar-website&utm_content=<ad name>`
Meta also adds `fbclid` to every ad click on its own, which the site now records.

## Before sending each one

1. The site must be deployed with the email images (`/images/email/`) live, or the pictures show as broken.
2. Send a test to yourself from Mailchimp and check it on your phone. Check the "Hi there" fallback with a contact that has no first name.
3. Confirm the From name, reply-to inbox, and that the footer shows the address and unsubscribe link.
4. For email 4, set the audience to the "clicked any link in emails 1 to 3" segment.
