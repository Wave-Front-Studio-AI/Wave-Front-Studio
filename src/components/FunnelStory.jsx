import { useEffect, useRef, useState } from 'react'
import { ArrowIcon } from './Icons.jsx'

// The four stops on the path from a search to a reply, each with the service
// that does the work. Shown as a scroll story over a 3D funnel on desktop, and
// as a list beside a flat drawing everywhere else.
export const funnelSteps = [
  {
    label: 'Get found',
    title: 'Get found by the people already looking',
    copy: 'SEO, your Google Business Profile, social and ads put you in front of people searching for what you do.',
    link: ['How SEO works', '/seo-service/'],
  },
  {
    label: 'Win the visit',
    title: 'Win the visit',
    copy: 'A fast, clear website turns a click into a reason to stay, and shows people they have found the right business.',
    link: ['Website development', '/web-development/'],
  },
  {
    label: 'Get the enquiry',
    title: 'Get the enquiry',
    copy: 'Forms, an AI chatbot and quote calculators make it easy to ask, at any hour, without picking up the phone.',
    link: ['AI chatbots', '/ai-chatbot/'],
  },
  {
    label: 'Answer it first',
    title: 'Answer it first',
    copy: 'Lead routing sends every enquiry to the right person straight away, so you are the first business to reply.',
    link: ['Lead capture systems', '/lead-capture/'],
  },
]

// The flat drawing: the same four tiers, for phones, reduced motion, browsers
// without WebGL and the prerendered page. Each tier sits 18 units below the
// curved bottom of the one above, so the layers read as separate steps.
const tiers = [
  { services: 'SEO, social and ads', top: 160, bottom: 126, y: 30, fill: '#2f6aa8', cap: '#5b93cf' },
  { services: 'Website', top: 120, bottom: 92, y: 148, fill: '#24578c', cap: '#4a7fb8' },
  { services: 'Lead capture', top: 84, bottom: 62, y: 258, fill: '#143a5c', cap: '#2e5f8c' },
  { services: 'Routing', top: 52, bottom: 32, y: 361, fill: '#2bb3c8', cap: '#8fd9e5', dark: true },
]

function FlatFunnel() {
  const cx = 200
  return (
    <svg className="home-funnel" viewBox="0 0 610 440" role="img" aria-labelledby="funnel-title">
      <title id="funnel-title">Get found, win the visit, get the enquiry, answer it first</title>
      {tiers.map((tier, index) => {
        const height = tier.dark ? 64 : 72
        const bottomY = tier.y + height
        const lineStart = cx + tier.top - (tier.top - tier.bottom) / 2
        return (
          <g key={tier.services}>
            <path
              d={`M${cx - tier.top} ${tier.y} L${cx + tier.top} ${tier.y} L${cx + tier.bottom} ${bottomY} A${tier.bottom} ${Math.round(tier.bottom / 9)} 0 0 1 ${cx - tier.bottom} ${bottomY} Z`}
              fill={tier.fill}
            />
            <ellipse cx={cx} cy={tier.y} rx={tier.top} ry={Math.round(tier.top / 8.5)} fill={tier.cap} />
            <text x={cx} y={tier.y + height / 2 + 10} textAnchor="middle" className={tier.dark ? 'is-dark' : ''}>
              {tier.services}
            </text>
            <line x1={lineStart} y1={tier.y + height / 2 + 4} x2="398" y2={tier.y + height / 2 + 4} className="funnel-leader" />
            <text x="406" y={tier.y + height / 2 + 11} className="funnel-label">
              {funnelSteps[index].label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function StepCopy({ step, index }) {
  return (
    <>
      <span className="funnel-step-count">
        Step {index + 1} of {funnelSteps.length}
      </span>
      <h3>{step.title}</h3>
      <p>{step.copy}</p>
      <a className="text-link" href={step.link[1]}>
        {step.link[0]} <ArrowIcon />
      </a>
    </>
  )
}

const canUse3d = () => {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(min-width: 960px)').matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  } catch {
    return false
  }
}

// Desktop: the section pins while it scrolls through four steps (like the
// granule pour on resin-rubber.com) and three.js draws the funnel beside the
// copy. three.js is only fetched once the section is near the screen, never on
// the first screen. Everyone else, and the prerendered HTML, gets the list.
export default function FunnelStory() {
  const [mode, setMode] = useState('flat')
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    if (canUse3d()) setMode('3d')
    const wide = window.matchMedia('(min-width: 960px)')
    const onChange = () => setMode(canUse3d() ? '3d' : 'flat')
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (mode !== '3d' || !wrap.current || !canvas.current) return undefined
    let scene = null
    let cancelled = false
    let visible = false

    const progress = () => {
      const box = wrap.current.getBoundingClientRect()
      const span = box.height - window.innerHeight
      return span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 0
    }
    const onScroll = () => {
      if (!visible) return
      const value = progress()
      setActive(Math.min(funnelSteps.length - 1, Math.floor(value * funnelSteps.length)))
      scene?.setProgress(value)
    }
    const onResize = () => scene?.resize()
    // If the GPU drops the context (driver reset, too many tabs), show the
    // flat drawing instead of a blank canvas.
    const onLost = () => !cancelled && setMode('flat')

    // Fetch three.js when the section is a screen away; run frames only while
    // it is actually on screen.
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || scene) return
      near.disconnect()
      import('../three/funnelScene.js')
        .then(({ createFunnelScene }) => {
          if (cancelled) return
          scene = createFunnelScene(canvas.current)
          canvas.current.addEventListener('webglcontextlost', onLost)
          scene.setProgress(progress())
          scene.setActive(visible)
        })
        .catch(() => !cancelled && setMode('flat'))
    }, { rootMargin: '100% 0px' })
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      scene?.setActive(visible)
      onScroll()
    })
    near.observe(wrap.current)
    onScreen.observe(wrap.current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const node = canvas.current

    return () => {
      cancelled = true
      near.disconnect()
      onScreen.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      node.removeEventListener('webglcontextlost', onLost)
      scene?.dispose()
    }
  }, [mode])

  // Every step stays in the tab order. When a keyboard user tabs into a step
  // that is not on screen yet, scroll to the middle of its stretch so it is.
  const showStep = (index) => {
    if (index === active || !wrap.current) return
    const box = wrap.current.getBoundingClientRect()
    const span = box.height - window.innerHeight
    window.scrollTo({ top: window.scrollY + box.top + span * ((index + 0.5) / funnelSteps.length), behavior: 'instant' })
  }

  if (mode === '3d') {
    return (
      <div className="funnel-story is-3d" ref={wrap} style={{ '--steps': funnelSteps.length }}>
        <div className="funnel-sticky">
          <div className="funnel-copy">
            <div className="funnel-steps">
              {funnelSteps.map((step, index) => (
                <div className={`funnel-step ${index === active ? 'is-active' : ''}`} key={step.label} onFocus={() => showStep(index)}>
                  <StepCopy step={step} index={index} />
                </div>
              ))}
            </div>
            <div className="funnel-progress" aria-hidden="true">
              {funnelSteps.map((step, index) => (
                <span key={step.label} className={index <= active ? 'is-done' : ''} />
              ))}
            </div>
          </div>
          <div className="funnel-canvas">
            <canvas ref={canvas} aria-hidden="true" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="funnel-story is-flat">
      <ol className="funnel-list">
        {funnelSteps.map((step, index) => (
          <li key={step.label} data-enter="right">
            <StepCopy step={step} index={index} />
          </li>
        ))}
      </ol>
      <div className="funnel-flat" data-enter="zoom">
        <FlatFunnel />
      </div>
    </div>
  )
}
