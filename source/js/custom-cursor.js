/* ============================================================
   Cute cartoon cursor: an emoji replaces the pointer, and a
   fading emoji trail follows fast mouse movement.
   To customize: change CURSOR_EMOJI and TRAIL below.
   ============================================================ */
(function () {
  // Skip on touch / pen devices — there is no pointer to decorate.
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  // ----- Tweak these! -----
  var CURSOR_EMOJI = '🐰'; // the cursor itself
  var TRAIL = ['💗', '✨', '🍩', '🦉', '⭐', '🌸']; // fading trail emoji
  // ----- end tweak -----

  function init() {
    var cursor = document.createElement('div');
    cursor.className = 'fp-cursor';
    cursor.textContent = CURSOR_EMOJI;
    document.body.appendChild(cursor);

    var lastSpawn = 0;
    var TRAIL_GAP = 90; // ms between trail spawns

    function show() { cursor.style.opacity = '1'; }
    function hide() { cursor.style.opacity = '0'; }

    function spawnTrail(x, y) {
      var t = document.createElement('div');
      t.className = 'fp-trail';
      t.textContent = TRAIL[Math.floor(Math.random() * TRAIL.length)];
      t.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) rotate(' + (Math.random() * 40 - 20) + 'deg)';
      document.body.appendChild(t);
      setTimeout(function () {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 900);
    }

    document.addEventListener('mousemove', function (e) {
      cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      show();
      var now = Date.now();
      if (now - lastSpawn > TRAIL_GAP) {
        lastSpawn = now;
        spawnTrail(e.clientX, e.clientY);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    document.addEventListener('mousedown', function () { cursor.classList.add('is-pressed'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('is-pressed'); });

    hide(); // hidden until the pointer actually enters
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
