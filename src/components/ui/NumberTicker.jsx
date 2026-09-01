import { useEffect, useMemo, useRef, useState } from 'react'

const digits = Array.from({ length: 10 }, (_, value) => value)

function Digit({ value, delay }) {
  return (
    <span className="number-ticker-window" aria-hidden="true">
      <span className="number-ticker-column" style={{ '--digit': value, '--digit-delay': `${delay}ms` }}>
        {digits.map((digit) => (
          <span key={digit}>{digit}</span>
        ))}
      </span>
    </span>
  )
}

export default function NumberTicker({ value, decimals = 0, prefix = '', suffix = '', stagger = 40, blur = false, className = '' }) {
  const ref = useRef(null)
  const [armed, setArmed] = useState(false)
  const text = useMemo(() => Number(value).toFixed(decimals), [value, decimals])
  const readableText = `${prefix}${text}${suffix}`

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setArmed(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setArmed(true)
        observer.disconnect()
      },
      { threshold: 0.6 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  let digitIndex = 0
  return (
    <span ref={ref} className={`number-ticker ${armed ? 'is-armed' : ''} ${blur ? 'has-blur' : ''} ${className}`}>
      <span className="sr-only">{readableText}</span>
      <span className="number-ticker-visible" aria-hidden="true">
        {prefix ? <span>{prefix}</span> : null}
        {[...text].map((character, index) => {
          if (!/\d/.test(character)) return <span key={`${character}-${index}`}>{character}</span>
          const delay = digitIndex * stagger
          digitIndex += 1
          return <Digit key={`digit-${index}`} value={Number(character)} delay={delay} />
        })}
        {suffix ? <span>{suffix}</span> : null}
      </span>
    </span>
  )
}
