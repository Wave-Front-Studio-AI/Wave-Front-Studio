// Ember Co. sample site: menu, header state, reveals, work strip, demo form.
(function () {
  var doc = document.documentElement
  doc.classList.add('js')

  // Mobile menu
  var btn = document.querySelector('.menu-btn')
  var nav = document.getElementById('site-nav')
  function setMenu(open) {
    if (!btn || !nav) return
    btn.setAttribute('aria-expanded', String(open))
    nav.classList.toggle('is-open', open)
    document.body.classList.toggle('menu-open', open)
    btn.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu'
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true') })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus() }
    })
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false) })
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false) })
  }

  // Header becomes solid once the page moves past the top
  var head = document.querySelector('[data-head]')
  if (head && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none'
    document.body.prepend(sentinel)
    new IntersectionObserver(function (entries) {
      head.classList.toggle('is-stuck', !entries[0].isIntersecting)
    }).observe(sentinel)
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.rv')
  if ('IntersectionObserver' in window) {
    var list = Array.prototype.slice.call(items)
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting && en.boundingClientRect.top > 0) return
        // reveal this item and anything above it, so jumping down the page never leaves gaps
        var idx = list.indexOf(en.target)
        for (var i = 0; i <= idx; i++) { if (!list[i].classList.contains('is-in')) { list[i].classList.add('is-in'); io.unobserve(list[i]) } }
      })
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 })
    items.forEach(function (el) { io.observe(el) })
  } else {
    items.forEach(function (el) { el.classList.add('is-in') })
  }

  // Work strip buttons
  document.querySelectorAll('.strip-sec').forEach(function (sec) {
    var track = sec.querySelector('[data-strip-track]')
    if (!track) return
    sec.querySelectorAll('[data-strip]').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = track.querySelector('.strip-card')
        var step = card ? card.getBoundingClientRect().width + 16 : 320
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        track.scrollBy({ left: b.getAttribute('data-strip') === 'next' ? step : -step, behavior: reduce ? 'auto' : 'smooth' })
      })
    })
  })

  // Demo form
  document.querySelectorAll('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var status = form.querySelector('[data-form-status]')
      if (status) status.textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.'
    })
  })
})()
