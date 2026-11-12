// The Black Friday 2026 window, kept apart from the pricing data so the site-wide
// popup can read it without pulling the whole package catalogue into every page.
// Thu Nov 12 00:00 to Tue Dec 1 23:59:59 Eastern (EST, UTC-5).
export const HOLIDAY_WINDOW = {
  name: 'Black Friday',
  start: '2026-11-12T00:00:00-05:00',
  endExclusive: '2026-12-02T00:00:00-05:00',
  endsLabel: 'Tuesday, December 1 at 11:59 PM Eastern',
}

export function holidayDealActive(now = new Date()) {
  const time = new Date(now).getTime()
  return time >= Date.parse(HOLIDAY_WINDOW.start) && time < Date.parse(HOLIDAY_WINDOW.endExclusive)
}

// Which day of the sale it is in Eastern time: 'last' on Dec 1, 'cyber' on Nov 30, else 'open'.
export function holidayDayPhase(now = new Date()) {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now))
  if (day === '2026-12-01') return 'last'
  if (day === '2026-11-30') return 'cyber'
  return 'open'
}
