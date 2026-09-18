import Layout from '../components/Layout.jsx'

// The public home page for the Wavefront Studio platform, referenced from the
// Google OAuth consent screen. Google's verification reviewers open it logged
// out, so it must stay outside every gate: no popup, no auth, no noindex. The
// "How we use Google user data" section is the Limited Use disclosure Google
// checks for — its wording is fixed and must not be edited casually.
export default function PlatformPage() {
  return (
    <Layout
      className="platform-page"
      seo={{
        title: 'The Wavefront Studio Platform | Wavefront Studio LLC',
        description:
          'The software platform we build and run for clients: lead capture, customer pipelines, scheduling, messaging, social publishing and reporting in one place.',
        canonical: '/platform/',
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <h1>The Wavefront Studio Platform</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="longform">
            <p className="lf-standfirst">
              Wavefront Studio is the software platform we build and operate for our clients. It brings lead capture,
              customer pipelines, scheduling, messaging and social publishing into one place, and connects to the tools a
              business already uses so that work doesn’t have to be re-entered by hand.
            </p>

            <p>
              It is built and operated by <strong>Wavefront Studio LLC</strong>, a digital agency in Sarasota, Florida.
              Access is provided to our clients and their teams.
            </p>

            <p className="lf-buttons">
              <a className="lf-button-link" href="https://wavefrontstudiostaff.com" rel="noopener">
                Sign in to the platform
              </a>
            </p>

            <h2>What it does</h2>

            <h3>Capture and route leads</h3>
            <p>
              Enquiries from every website a client operates arrive in one pipeline rather than scattered across inboxes.
              Each one is assigned automatically, by territory, availability or workload, so it reaches the right person
              without a manager triaging it. For clients running multi-site operations, this is the difference between a
              same-hour response and a next-day one.
            </p>

            <h3>Manage the customer pipeline</h3>
            <p>
              Every lead, quote and job moves through a shared pipeline that the whole team can see. Notes, history and
              next actions live on the record rather than in someone’s memory.
            </p>

            <h3>Schedule and communicate</h3>
            <p>
              Appointments, reminders and follow-ups are sent by SMS and email from within the platform, so the
              conversation history stays attached to the customer record.
            </p>

            <h3>Publish to social channels</h3>
            <p>
              Content is drafted, queued and published to a business’s own connected social accounts from a single queue,
              instead of logging into each network separately.
            </p>

            <h3>Report on what’s working</h3>
            <p>
              Advertising spend, enquiry volume and pipeline conversion are reported together, so the cost of acquiring a
              customer is visible rather than estimated.
            </p>

            <h2>Two applications</h2>

            <p>The platform runs as two applications sharing the same foundation:</p>

            <ul>
              <li>
                <strong>Wavefront Studio</strong> is the platform our agency team uses to manage client work: pipelines,
                campaigns, publishing and reporting across every account we run.
              </li>
              <li>
                <strong>Resin Rock Pro</strong> is built for ResinRock Industries. It captures enquiries across their
                network of websites and assigns each one to the nearest available installer, with quoting and job tracking
                built in.
              </li>
            </ul>

            <h2>Connecting your own accounts</h2>

            <p>
              The platform works with tools you already use. Connecting an account is always your choice, always
              reversible, and always authorised on that provider’s own consent screen. We never see or store your
              password for a connected service.
            </p>

            <p>
              Available connections include Instagram, Facebook Pages, LinkedIn and TikTok for publishing; Meta Ads and
              Google Ads for campaign reporting; HubSpot and Salesforce for CRM; Google Calendar, Calendly and Microsoft
              Outlook for scheduling; Gmail and Outlook for email; Slack and Microsoft Teams for notifications; Dropbox,
              OneDrive and Google Sheets for files and data; and Asana, ClickUp and Jira for project work.
            </p>

            <p>
              You can disconnect any of them at any time from within the application, which deletes the stored access
              token and any cached data immediately.
            </p>

            <h2>How we use Google user data</h2>

            <p>If you connect a Google account, the platform uses that access only to deliver the feature you enabled:</p>

            <ul>
              <li>
                <strong>Gmail</strong> — to read or send messages strictly to carry out an action you requested, such as
                sending a quote or logging a customer reply against their record.
              </li>
              <li>
                <strong>Google Calendar</strong> — to read and create appointments in the calendars you select.
              </li>
              <li>
                <strong>Google Sheets</strong> — to read and write the spreadsheets you open or create through the
                application.
              </li>
              <li>
                <strong>Google Ads</strong> — to read campaign structure and performance metrics for the account you
                nominate, for reporting.
              </li>
            </ul>

            <p>
              Our use and transfer of information received from Google APIs adheres to the{' '}
              <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener" target="_blank">
                Google API Services User Data Policy
              </a>
              , including its Limited Use requirements. Google user data is never sold, never shared with advertisers,
              never used for advertising, and never used to train artificial intelligence or machine learning models.
            </p>

            <h2>Security and your data</h2>

            <p>
              Connections are encrypted in transit. Access tokens for connected services are encrypted at rest and are
              never exposed to your browser. You can delete your data at any time: by disconnecting a single service, by
              deleting your account, or by emailing us and we will action it within 30 days.
            </p>

            <p>
              Full detail is in our <a href="https://wavefrontstudiollc.com/privacy-policy/">Privacy Policy</a> and{' '}
              <a href="https://wavefrontstudiollc.com/terms-of-use/">Terms of Use</a>.
            </p>

            <h2>Getting access</h2>

            <p>
              The platform is provided to Wavefront Studio LLC clients as part of an engagement. To ask about access,
              contact us at <a href="mailto:info@wavefrontstudiollc.com">info@wavefrontstudiollc.com</a> or +1 (941)
              415-2595.
            </p>

            <p>Wavefront Studio LLC, 4363 Independence Ct, Sarasota, FL 34234, United States</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
