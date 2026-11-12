// Heritage Co. sample site: menu, header state, reveals, demo form.
(function () {
  document.documentElement.classList.add('js')

  var btn = document.querySelector('.menu-btn')
  var nav = document.getElementById('site-nav')
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open))
    btn.textContent = open ? 'Close' : 'Menu'
    nav.classList.toggle('is-open', open)
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true') })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus() }
    })
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false) })
  }

  var head = document.querySelector('[data-head]')
  if (head && 'IntersectionObserver' in window) {
    var s = document.createElement('div')
    s.setAttribute('aria-hidden', 'true')
    s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none'
    document.body.prepend(s)
    new IntersectionObserver(function (en) { head.classList.toggle('is-stuck', !en[0].isIntersecting) }).observe(s)
  }

  var list = Array.prototype.slice.call(document.querySelectorAll('.rv'))
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting && en.boundingClientRect.top > 0) return
        var idx = list.indexOf(en.target)
        for (var i = 0; i <= idx; i++) { if (!list[i].classList.contains('is-in')) { list[i].classList.add('is-in'); io.unobserve(list[i]) } }
      })
    }, { rootMargin: '0px 0px -40px 0px' })
    list.forEach(function (el) { io.observe(el) })
  } else { list.forEach(function (el) { el.classList.add('is-in') }) }

  document.querySelectorAll('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var st = form.querySelector('[data-form-status]')
      if (st) st.textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.'
    })
  })
})()
