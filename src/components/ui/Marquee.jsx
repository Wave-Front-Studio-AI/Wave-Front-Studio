export default function Marquee({ children, pauseOnHover = false, direction = 'left', speed = 30, className = '', label }) {
  return (
    <div className={`marquee ${className}`} role="region" aria-label={label}>
      <div
        className={`marquee-track ${pauseOnHover ? 'can-pause' : ''} ${direction === 'right' ? 'is-reverse' : ''}`}
        style={{ '--marquee-duration': `${speed}s` }}
      >
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
