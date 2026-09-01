export function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronIcon({ open = false, className = '' }) {
  return (
    <svg className={`${className} ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WaveGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M7 37c8-23 24-28 41-17-12-1-19 4-20 13 10-4 19-1 25 7-20 14-39 13-46-3Z" fill="#18BED6" />
      <path d="M28 33c1-9 8-14 20-13-8 3-11 8-10 14 1 6 6 9 13 7-9 7-20 5-23-8Z" fill="currentColor" />
    </svg>
  )
}

export function ChatIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12.5c0 3.6-3.4 6.5-7.6 6.5-.9 0-1.8-.1-2.6-.4L5 20.5l1.2-3.2C4.8 16.1 4 14.4 4 12.5 4 8.9 7.4 6 11.6 6S20 8.9 20 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 11.5h6M9 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function SendIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.5 3.5 3 10.2l7 2.8 2.8 7 7.7-16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 13 20.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.4 4H5.6C4.7 4 4 4.8 4 5.7 4 13.6 10.4 20 18.3 20c.9 0 1.7-.7 1.7-1.6v-2.8l-3.6-1.2-1.6 2A13.6 13.6 0 0 1 8.6 9.2l2-1.6L9.4 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MailIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7.5 8 5.5 8-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
