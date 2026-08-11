/**
 * Subtle cursor-driven "confetti pixel" background effect.
 *
 * Treats the background as a grid of small squares. As the cursor moves,
 * nearby grid cells light up briefly with a scattered set of colors, then
 * fade back to the plain background color within ~200-400ms. Pixels closer
 * to the cursor are more saturated/visible; the burst radius is small so it
 * reads as a soft brush stroke trailing the cursor, not a hard trail.
 *
 * Implemented with a single canvas + requestAnimationFrame (no per-pixel
 * DOM nodes), sits behind all content (pointer-events: none, low z-index),
 * and is disabled entirely on touch/no-hover devices.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('bg-canvas');
  if (!canvas || !canvas.getContext) return;

  // Disable on touch / no-hover devices — just leave the plain background.
  var isTouchDevice =
    window.matchMedia &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouchDevice) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var CELL = 6; // grid cell size in CSS px (within the requested 4-8px range)
  var RADIUS = 44; // px — small burst radius around the cursor
  var LIFE_MIN = 220; // ms
  var LIFE_MAX = 380; // ms
  var SPAWN_CHANCE = 0.55; // scattered, not a solid fill

  var COLORS = [
    '#e5484d', // red
    '#2b5fd9', // blue
    '#14b8a6', // teal / cyan
    '#f2994a', // orange
    '#161616', // near-black
    '#d6409f', // magenta
    '#1fb6c9', // cyan accent
  ];

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0;
  var height = 0;
  var cols = 0;
  var rows = 0;

  // Active pixels keyed by "col,row" -> { x, y, color, start, life, baseAlpha }
  var active = new Map();

  var rafId = null;
  var isPageVisible = true;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
  }

  function randomColor() {
    return COLORS[(Math.random() * COLORS.length) | 0];
  }

  function activateNear(clientX, clientY) {
    var gx = Math.floor(clientX / CELL);
    var gy = Math.floor(clientY / CELL);
    var reach = Math.ceil(RADIUS / CELL);
    var now = performance.now();

    for (var dx = -reach; dx <= reach; dx++) {
      for (var dy = -reach; dy <= reach; dy++) {
        var cx = gx + dx;
        var cy = gy + dy;
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;

        var dist = Math.sqrt(dx * dx + dy * dy) * CELL;
        if (dist > RADIUS) continue;

        var falloff = 1 - dist / RADIUS; // 1 near cursor -> 0 at edge
        if (Math.random() > falloff * SPAWN_CHANCE) continue;

        var key = cx + ',' + cy;
        active.set(key, {
          x: cx,
          y: cy,
          color: randomColor(),
          start: now,
          life: LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN),
          baseAlpha: 0.12 + falloff * 0.5,
        });
      }
    }

    scheduleFrame();
  }

  function scheduleFrame() {
    if (rafId == null && isPageVisible) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    rafId = null;

    if (active.size === 0) return; // nothing to draw, let canvas stay clear

    ctx.clearRect(0, 0, width, height);

    active.forEach(function (p, key) {
      var elapsed = now - p.start;
      if (elapsed >= p.life) {
        active.delete(key);
        return;
      }
      var t = elapsed / p.life;
      var alpha = p.baseAlpha * (1 - t);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x * CELL, p.y * CELL, CELL, CELL);
    });

    ctx.globalAlpha = 1;
    scheduleFrame();
  }

  var moveThrottle = false;
  function onMouseMove(e) {
    if (moveThrottle) return;
    moveThrottle = true;
    requestAnimationFrame(function () {
      moveThrottle = false;
    });
    activateNear(e.clientX, e.clientY);
  }

  document.addEventListener('visibilitychange', function () {
    isPageVisible = !document.hidden;
    if (isPageVisible) scheduleFrame();
  });

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  resize();
})();
