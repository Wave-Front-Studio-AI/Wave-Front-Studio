// Events for the $1 Website page. They go to Meta and Google when those
// scripts are on the page, and quietly do nothing when they are not.
// The `Lead` event itself stays in formSubmission.js.
export function track(name, params = {}) {
  if (typeof window === 'undefined') return
  try {
    window.fbq?.('trackCustom', name, params)
    window.gtag?.('event', name, params)
  } catch {
    // Tracking must never break the page.
  }
}
