/* Linen Co. sample template: drawer menu, slow reveals, demo form */
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.getElementById('drawer');
  function setOpen(open, returnFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    drawer.hidden = !open;
    if (open) { var first = drawer.querySelector('a'); if (first) first.focus(); }
    else if (returnFocus) toggle.focus();
  }
  if (toggle && drawer) {
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    window.matchMedia('(min-width: 1061px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }

  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'This is a sample form. On your live site, enquiries go straight to your inbox.';
    });
  });
})();
