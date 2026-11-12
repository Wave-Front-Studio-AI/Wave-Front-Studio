# Black Friday 2026: Mailchimp emails (drafts, nothing sent)

Four emails for the Mailchimp audience. Each is written as plain text so it loads as is. Paste the body into a Mailchimp "Plain text" style email or a simple one-column layout and make the link line a button.

Nothing here has been scheduled or sent. Tony loads and sends these in Mailchimp.

## Before loading

Fill in or confirm these. Nothing goes out with a bracket left in it.

- [CONFIRM: From name and address, for example "Tony at Wavefront Studio". The reply-to must be a monitored inbox, since the emails promise a reply within two working days.]
- [CONFIRM: Legal business name and postal address in the footer. Mailchimp fills the address from the audience settings through `*|LIST:ADDRESS|*`, so check the audience has the right one.]
- [CONFIRM: Everyone in this audience opted in to marketing email. If some contacts were imported from customers or leads without consent, leave them out.]
- Sign-off name. Drafts say "Tony". Change it if someone else sends.

Merge tags used: `*|FNAME|*` with a fallback, `*|UNSUB|*`, `*|UPDATE_PROFILE|*`, `*|LIST:ADDRESS|*`.

## Send plan

| # | Send | Audience | Job |
|---|---|---|---|
| 1 | Fri Nov 13, 7am Eastern | Whole audience | Deals are live, go build a quote |
| 2 | Fri Nov 27, 8am Eastern | Everyone except people who clicked Email 1 and built a quote (skip this filter if you cannot see it, then send to all) | Black Friday push with the calculator angle |
| 3 | Mon Nov 30, 8am Eastern | Whole audience | Last two days |
| 4 | Wed Dec 2, 9am Eastern | Segment: clicked any link in emails 1 to 3 | Follow up after the deals end |

The sale went live on the site on Nov 12 (moved up from Nov 24), so Email 1 can go as soon as you approve it. Send it in the morning so replies land in working hours.

Track clicks and replies. Open rates are unreliable now because mail apps preload images.

Every link carries UTM tags so the site and Mailchimp both show where the visit came from.

---

## Email 1: deals are live

Send: Fri Nov 13, 7am Eastern
Subject A: Contractor pricing is on now (31 characters, plain and direct)
Subject B: 20% off a contractor website through Dec 1 (the offer first)
Preview text: Websites, calculators, lead generation and logos. Build a quote and see your price.

```
*|IF:FNAME|*Hi *|FNAME|*,*|ELSE:|*Hi there,*|END:IF|*

Our Black Friday pricing for contractors is on now and runs through Tuesday, Dec 1, ending at 11:59pm Eastern.

There are three deals. Each one stands on its own.

Build Deal: 20% off setup when you add a website, landing page, quote calculator or visualizer tool. Our Website Grow package lists at $4,500 and comes to $3,600.

Leads Deal: 3 months free instead of 1 on the monthly fee for lead generation and SEO. It is how you get the call before the other guy.

Brand Deal: 20% off logo and print work. Add a social media plan and the Launch logo and favicon design is free.

Pick what you want in the quote builder and the deals apply on their own. You can download the PDF right away. It costs nothing to look.

Build my quote:
https://wavefrontstudiollc.com/package-builder/?utm_source=mailchimp&utm_medium=email&utm_campaign=bf2026&utm_content=email1

Deals stack with our bundle discount (2 services 5%, 3 services 10%, 5 services 15%), and the total never goes above 25%.

Want us to look at your current site first? The audit is free:
https://wavefrontstudiollc.com/free-website-audit/?utm_source=mailchimp&utm_medium=email&utm_campaign=bf2026&utm_content=email1

We reply within two working days.

Tony
Wavefront Studio

--
Wavefront Studio, *|LIST:ADDRESS|*
You are getting this because you signed up for updates from Wavefront Studio.
Unsubscribe: *|UNSUB|*   Update your preferences: *|UPDATE_PROFILE|*
```

---

## Email 2: Black Friday

Send: Fri Nov 27, 8am Eastern
Subject A: Would a homeowner find you tonight? (a plain question that matches the body)
Subject B: A price calculator that works at 9pm
Preview text: The contractor deals are live through Dec 1.

```
*|IF:FNAME|*Hi *|FNAME|*,*|ELSE:|*Hi there,*|END:IF|*

If a homeowner searched for your trade last night, would they have found you? And could they have gotten a price without waiting for a call back?

A calculator on your site does that part at 9pm while you are not picking up. The leads it collects land in your inbox with the numbers attached, so you call people who already know the ballpark.

The Build Deal takes 20% off setup on calculators, websites and landing pages through Dec 1. Build a quote and you will see the deal on its own line:

Build my quote:
https://wavefrontstudiollc.com/package-builder/?utm_source=mailchimp&utm_medium=email&utm_campaign=bf2026&utm_content=email2

If you would like to see what homeowners see when they land on your site today, the website audit is free:
https://wavefrontstudiollc.com/free-website-audit/?utm_source=mailchimp&utm_medium=email&utm_campaign=bf2026&utm_content=email2

Tony
Wavefront Studio

--
Wavefront Studio, *|LIST:ADDRESS|*
You are getting this because you signed up for updates from Wavefront Studio.
Unsubscribe: *|UNSUB|*   Update your preferences: *|UPDATE_PROFILE|*
```

---

## Email 3: Cyber Monday, two days left

Send: Mon Nov 30, 8am Eastern
Subject A: Contractor deals end tomorrow night (37 characters, true: ends Dec 1 at 11:59pm)
Subject B: Two days left on contractor pricing
Preview text: Ends Tuesday, Dec 1 at 11:59pm Eastern.

```
*|IF:FNAME|*Hi *|FNAME|*,*|ELSE:|*Hi there,*|END:IF|*

Today and tomorrow are the last two days. The contractor deals end Tuesday, Dec 1 at 11:59pm Eastern.

The Build Deal, the Leads Deal and the Brand Deal all apply in the quote builder. If you only want the numbers, build a quote and download the PDF. You can decide when you are ready.

Build my quote:
https://wavefrontstudiollc.com/package-builder/?utm_source=mailchimp&utm_medium=email&utm_campaign=bf2026&utm_content=email3

A question about what fits your business? Reply to this email and we will answer within two working days.

Tony
Wavefront Studio

--
Wavefront Studio, *|LIST:ADDRESS|*
You are getting this because you signed up for updates from Wavefront Studio.
Unsubscribe: *|UNSUB|*   Update your preferences: *|UPDATE_PROFILE|*
```

Note: a reply sent on Dec 1 may not get an answer before the deals end. The promise of two working days is real, so the email says only that. If Tony can answer faster that week, say so.

---

## Email 4: follow up after the deals

Send: Wed Dec 2, 9am Eastern
Audience: only people who clicked a link in emails 1 to 3 (Mailchimp segment: "Clicked any link in campaign"). Do not send to the whole audience.
Subject A: Still want that quote? (21 characters)
Subject B: Your quote is easy to rebuild
Preview text: The deals ended last night. We can still talk through the plan.

```
*|IF:FNAME|*Hi *|FNAME|*,*|ELSE:|*Hi there,*|END:IF|*

The Black Friday deals ended last night. You looked at the quote builder, so I wanted to check in.

Your quote is quick to rebuild, and we can still talk through what makes sense for your business and what can wait. Reply with what you are thinking about and we will answer within two working days.

Build a quote at regular pricing:
https://wavefrontstudiollc.com/package-builder/?utm_source=mailchimp&utm_medium=email&utm_campaign=bf2026&utm_content=email4

Tony
Wavefront Studio

--
Wavefront Studio, *|LIST:ADDRESS|*
You are getting this because you signed up for updates from Wavefront Studio.
Unsubscribe: *|UNSUB|*   Update your preferences: *|UPDATE_PROFILE|*
```

---

## Checks before sending each one

1. Subject matches the body. Sender and reply-to are real and monitored.
2. Every `*|...|*` tag renders in Mailchimp's preview. Send a test to yourself and check the fallback by sending one with the first name blank.
3. The three links open the right pages on a phone, and the builder shows the deal banner (only works between Nov 12 and Dec 1).
4. The unsubscribe link and postal address show in the footer.
5. Dates in the copy match the real window: Nov 12 to Dec 1, ending 11:59pm Eastern. The site flips to "deals ended" on its own after that.
6. Test the plain-text view in Mailchimp. Button text becomes a bare link line, which is fine.

## Rules these follow

No countdown timer, no places counter, no testimonials. The only deadline is the real one. The deal cap of 25% is stated once. SMS copy lives in `copy.md` and goes only to contacts who agreed to texts.
