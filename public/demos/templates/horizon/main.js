// Horizon Co. sample template: glass header, mobile menu, gentle reveals, demo form.
document.documentElement.classList.add('js')
window.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]')
  var toggle = document.querySelector('.menu-btn')
  var nav = document.getElementById('site-nav')
  var label = toggle && toggle.querySelector('.sr')

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    nav.classList.toggle('is-open', open)
    if (label) label.textContent = open ? 'Close menu' : 'Open menu'
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true') })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus() }
    })
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(e.target)) setMenu(false)
    })
  }

  if ('IntersectionObserver' in window) {
    var marker = document.createElement('div')
    marker.setAttribute('aria-hidden', 'true')
    marker.style.cssText = 'position:absolute;top:0;height:80px;width:1px;pointer-events:none'
    document.body.prepend(marker)
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting)
    }).observe(marker)

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el) })
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in') })
  }

  document.querySelectorAll('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      form.querySelector('.form__note').textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.'
    })
  })
})
