import { useEffect } from 'react'

const revealSelector = [
  '.section-head',
  '.page-hero-copy',
  '.page-hero-media',
  '.service-entry-copy',
  '.service-entry-form',
  '.article-hero > *',
  '.location-hero > *',
  '.legal-hero > *',
].join(',')

const spotlightSelector = [
  '.offering-card',
  '.project-card',
  '.capability-card',
  '.icon-card',
  '.offer-card',
  '.package-card',
  '.trust-grid > article',
  '.steps-grid > li',
  '.post-card',
  '.hub-card',
].join(',')

export default function VisualEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const revealNodes = [...document.querySelectorAll(revealSelector)].filter((node) => !node.closest('.reveal'))

    let observer
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('ui-reveal', 'is-visible'))
    } else {
      revealNodes.forEach((node, index) => {
        node.classList.add('ui-reveal')
        node.style.setProperty('--ui-delay', `${Math.min(index % 3, 2) * 55}ms`)
      })

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          })
        },
        { rootMargin: '0px 0px -7% 0px', threshold: 0.08 },
      )
      revealNodes.forEach((node) => observer.observe(node))
    }

    if (!finePointer || reduceMotion) return () => observer?.disconnect()

    const onPointerMove = (event) => {
      const card = event.target.closest(spotlightSelector)
      if (!card) return
      const bounds = card.getBoundingClientRect()
      card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
      card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      observer?.disconnect()
      document.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return null
}
