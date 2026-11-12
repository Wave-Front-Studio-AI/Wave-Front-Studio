// Nordic Co. sample template: quiet header line, full screen mobile menu, soft fades, demo form.
document.documentElement.classList.add('js')
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]')
  const button = header.querySelector('.menu-btn')
  const menu = document.getElementById('site-nav')

  const toggleMenu = (open) => {
    button.setAttribute('aria-expanded', String(open))
    button.textContent = open ? 'Close' : 'Menu'
    menu.classList.toggle('is-open', open)
    document.body.style.overflow = open ? 'hidden' : ''
  }
  button.addEventListener('click', () => toggleMenu(button.getAttribute('aria-expanded') !== 'true'))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false)
      button.focus()
    }
  })
  window.matchMedia('(min-width: 860px)').addEventListener('change', (q) => { if (q.matches) toggleMenu(false) })

  const fades = document.querySelectorAll('.fade')
  if (!('IntersectionObserver' in window)) { fades.forEach((el) => el.classList.add('is-seen')); return }

  const top = document.createElement('span')
  top.setAttribute('aria-hidden', 'true')
  top.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px'
  document.body.prepend(top)
  new IntersectionObserver(([entry]) => header.classList.toggle('is-lined', !entry.isIntersecting)).observe(top)

  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-seen')
      seen.unobserve(entry.target)
    })
  }, { threshold: 0.15 })
  fades.forEach((el) => seen.observe(el))

  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.querySelector('.form__note').textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.'
    })
  })
})
