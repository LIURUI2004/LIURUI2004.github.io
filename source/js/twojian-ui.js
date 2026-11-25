/* twojian 风格首页交互：时钟 + 滚动入场 */
(function () {
  'use strict';

  /* ---------- LCD 时钟 ---------- */
  var clockEl = document.querySelector('[data-tj-clock]');
  var dateEl = document.querySelector('[data-tj-date]');
  var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    var now = new Date();
    if (clockEl) clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
    if (dateEl) {
      dateEl.textContent = now.getFullYear() + ' / ' + pad(now.getMonth() + 1) + ' / ' + pad(now.getDate()) + '  ' + weekdays[now.getDay()];
    }
  }

  if (clockEl || dateEl) {
    tick();
    setInterval(tick, 1000 * 20);
  }

  /* ---------- 滚动入场 ---------- */
  var targets = document.querySelectorAll('.tj-card, .tj-timeline-row');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  Array.prototype.forEach.call(targets, function (el, index) {
    el.classList.add('tj-reveal');
    el.style.transitionDelay = Math.min(index * 45, 320) + 'ms';
    observer.observe(el);
  });
})();
