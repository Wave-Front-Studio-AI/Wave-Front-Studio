// Grid Co. sample template: menu, header state, reveals, demo form
(function () {
  document.documentElement.classList.add('js');
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var panel = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.label').textContent = open ? 'Close' : 'Menu';
    panel.classList.toggle('is-open', open);
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
    });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    window.matchMedia('(min-width: 1000px)').addEventListener('change', function () { setMenu(false); });
  }

  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:40px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(function (entries) {
    header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
  }).observe(sentinel);

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('is-in'); }); }

  var form = document.querySelector('form[data-demo]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      note.hidden = false;
      note.focus();
    });
  }
})();
