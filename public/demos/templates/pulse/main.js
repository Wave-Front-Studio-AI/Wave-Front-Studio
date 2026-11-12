// Pulse Co. sample template: menu, sticky header, reveals, services carousel, demo form.
document.documentElement.classList.add('js')
;(() => {
  const btn = document.querySelector('.menu-btn')
  const nav = document.getElementById('site-nav')
  if (btn && nav) {
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open))
      nav.classList.toggle('is-open', open)
    }
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus() }
    })
    matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) set(false) })
  }

  const header = document.querySelector('[data-header]')
  if (header && 'IntersectionObserver' in window) {
    const s = document.createElement('div')
    s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none'
    document.body.prepend(s)
    new IntersectionObserver(([e]) => header.classList.toggle('is-compact', !e.isIntersecting)).observe(s)
  }

  const items = document.querySelectorAll('.rv')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    items.forEach((el) => io.observe(el))
  } else items.forEach((el) => el.classList.add('is-in'))

  document.querySelectorAll('.carousel-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const track = document.getElementById(b.getAttribute('aria-controls'))
      const card = track && track.querySelector('li')
      if (!card) return
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      track.scrollBy({ left: Number(b.dataset.dir) * (card.offsetWidth + 18), behavior: reduce ? 'auto' : 'smooth' })
    })
  })

  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const note = form.querySelector('.form__note')
      if (note) note.textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.'
    })
  })
})()
