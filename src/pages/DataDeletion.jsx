import Layout from '../components/Layout.jsx'
import { contact } from '../data/site.js'

// The Data Deletion Instructions URL for the Meta app dashboard, and the
// "easily accessible and clearly marked way to ask for their Platform Data to
// be modified or deleted" that Meta Platform Terms 3.d.i.1 requires.
//
// Meta's reviewers open this logged out, so it must stay outside every gate:
// no popup, no auth, no noindex. Section 13 of the Privacy Policy says the same
// things in the same order — if one changes, change both.
export default function DataDeletion() {
  return (
    <Layout
      className="data-deletion-page"
      seo={{
        title: 'Delete Your Data | Wavefront Studio LLC',
        description:
          'How to delete your data from the Wavefront Studio platform and Resin Rock Pro, including data from a connected Facebook, Instagram or Meta Ads account. Three routes, no account required to ask.',
        canonical: '/data-deletion/',
      }}
    >
      <section className="page-hero is-tight">
        <div className="page-frame">
          <h1>Delete your data</h1>
        </div>
      </section>

      <section className="chapter">
        <div className="page-frame">
          <div className="longform">
            <p className="lf-standfirst">
              This page explains how to delete data held by the software applications Wavefront Studio LLC operates:{' '}
              <strong>Wavefront Studio</strong> (wavefrontstudiostaff.com) and <strong>Resin Rock Pro</strong>, including
              anything obtained from a Facebook, Instagram, Meta Ads or other account you connected to them. You do not
              need an account with us, and we do not ask you to verify your identity, to make the request.
            </p>

            <h2>Three ways to delete your data</h2>

            <h3>1. Disconnect a single service</h3>
            <p>
              Open the application, go to <strong>Settings → Connected accounts</strong>, and disconnect the service you
              want removed. Its access token and everything we cached from it are deleted immediately. Your account and
              your other connections are untouched.
            </p>

            <h3>2. Delete your whole account</h3>
            <p>
              Open the application, go to <strong>Settings → Account</strong>, and choose <strong>Delete account</strong>.
              This removes your account record together with every connected service, its tokens and its cached data.
            </p>

            <h3>3. Email us</h3>
            <p>
              Send an email to <a href={contact.emailHref}>{contact.email}</a> with the subject line{' '}
              <strong>“Data deletion request”</strong>. Tell us which account or which connected service you mean, from an
              address or phone number we can match to the record. We action these within 30 days and confirm by reply.
              This route works whether or not you can still sign in.
            </p>

            <div className="lf-cta">
              <p>Prefer to talk to a person?</p>
              <p>
                Email <a href={contact.emailHref}>{contact.email}</a> or call{' '}
                <a href={contact.phoneHref}>{contact.phone}</a>. We will make the request for you and confirm in writing
                when it is done.
              </p>
            </div>

            <h2>If you connected a Facebook or Instagram account</h2>
            <p>
              Removing our application in your Meta settings (<strong>Settings &amp; privacy → Settings → Apps and
              websites</strong> on Facebook, or <strong>Settings → Website permissions → Apps and websites</strong> on
              Instagram) revokes our access immediately. From that moment we cannot read anything further from your
              account.
            </p>
            <p>
              Revoking access does not by itself erase what we already hold. To have that deleted too, use one of the
              three routes above. Emailing us is the surest one, because it reaches us even after you have revoked our
              access.
            </p>

            <h2>What gets deleted, and when</h2>
            <div className="lf-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>When it goes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Access tokens for a connected service</td>
                    <td>Immediately on disconnect, account deletion, or revocation in your Meta settings</td>
                  </tr>
                  <tr>
                    <td>Data cached from that service: profile, posts, media, metrics, records</td>
                    <td>Immediately on disconnect or account deletion; within 30 days if you email us</td>
                  </tr>
                  <tr>
                    <td>Your account record and its history</td>
                    <td>Immediately on account deletion; within 30 days if you email us</td>
                  </tr>
                  <tr>
                    <td>Encrypted backups containing the above</td>
                    <td>Purged on a rolling 30-day cycle, after which deleted data is unrecoverable</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Where the law requires us to keep a particular record for longer (a tax or billing record, for example), we
              keep only that record, for only the period required, and delete the rest. We will tell you if that applies
              to your request.
            </p>

            <h2>If you are a website visitor, not an app user</h2>
            <p>
              This page is about the applications. If you have only visited wavefrontstudiollc.com, what we hold is
              analytics and advertising cookies, not an account. Use{' '}
              <a href="/do-not-sell/">Do Not Sell or Share My Personal Information</a> to turn that tracking off and clear
              it, and see our <a href="/cookie-policy/">Cookie Policy</a> for the full list.
            </p>
            <p>
              If you have sent us an enquiry through a contact form or by text message, email us at{' '}
              <a href={contact.emailHref}>{contact.email}</a> and we will delete it. Section 7 of our{' '}
              <a href="/privacy-policy/">Privacy Policy</a> sets out your rights in full, and section 13 covers the
              applications in detail.
            </p>

            <h2>Contact</h2>
            <p>
              Wavefront Studio LLC, 4363 Independence Ct, Sarasota, FL 34234, United States.
              <br />
              <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phone}</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
