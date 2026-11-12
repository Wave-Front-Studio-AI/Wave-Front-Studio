// Frame Co. sample site: menu, header line, reveals, gallery lightbox, demo form.
(function () {
  document.documentElement.classList.add('js')

  // Menu
  var btn = document.querySelector('.menu-btn')
  var nav = document.getElementById('site-nav')
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open))
    btn.textContent = open ? 'Close' : 'Menu'
    nav.classList.toggle('is-open', open)
    document.body.classList.toggle('menu-open', open)
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true') })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus() }
    })
    window.matchMedia('(min-width: 800px)').addEventListener('change', function (m) { if (m.matches) setMenu(false) })
  }

  // Header hairline after scrolling
  var head = document.querySelector('[data-head]')
  if (head && 'IntersectionObserver' in window) {
    var s = document.createElement('div')
    s.setAttribute('aria-hidden', 'true')
    s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:20px;pointer-events:none'
    document.body.prepend(s)
    new IntersectionObserver(function (en) { head.classList.toggle('is-stuck', !en[0].isIntersecting) }).observe(s)
  }

  // Reveal
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

  // Lightbox
  var lb = document.querySelector('[data-lightbox]')
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-lb]'))
  if (lb && thumbs.length && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('.lb-img')
    var lbCap = lb.querySelector('.lb-cap')
    var lbCount = lb.querySelector('.lb-count')
    var current = 0
    var opener = null
    function show(i) {
      current = (i + thumbs.length) % thumbs.length
      var t = thumbs[current]
      lbImg.src = t.getAttribute('data-src')
      lbImg.alt = t.getAttribute('data-alt')
      lbCap.textContent = t.getAttribute('data-cap')
      lbCount.textContent = (current + 1) + ' of ' + thumbs.length
    }
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        opener = t
        show(i)
        lb.showModal()
        document.body.classList.add('lb-open')
        lb.querySelector('[data-lb-close]').focus()
      })
    })
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(current - 1) })
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(current + 1) })
    lb.querySelector('[data-lb-close]').addEventListener('click', function () { lb.close() })
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1) }
    })
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-fig')) lb.close() })
    lb.addEventListener('close', function () {
      document.body.classList.remove('lb-open')
      if (opener) opener.focus()
    })
  }

  // Demo form
  document.querySelectorAll('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var st = form.querySelector('[data-form-status]')
      if (st) st.textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.'
    })
  })
})()
