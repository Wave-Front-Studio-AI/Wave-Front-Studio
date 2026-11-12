// Slate Co. sample template: menu, sticky header, reveals, demo form
(function () {
  document.documentElement.classList.add('js');
  var head = document.querySelector('[data-head]');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');

  function closeMenu(focusBtn) {
    head.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (focusBtn) btn.focus();
  }
  if (btn && head) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { closeMenu(false); return; }
      head.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      var first = nav && nav.querySelector('a');
      if (first) first.focus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (m) { if (m.matches) closeMenu(false); });
  }

  // Header border once the page moves (sentinel, no scroll listener)
  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none';
  document.body.prepend(sentinel);
  if ('IntersectionObserver' in window && head) {
    new IntersectionObserver(function (entries) {
      head.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Demo form: never submits
  var form = document.querySelector('[data-demo-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      note.classList.add('show');
      note.focus();
    });
  }
})();
