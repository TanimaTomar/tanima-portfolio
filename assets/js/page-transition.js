/**
 * Small crossfade between pages on this static site.
 *
 * Entering a page is handled purely by a CSS keyframe animation on
 * body (see page-fade-in in style.css) -- no JS involved, so there's
 * no flash-of-content risk if this script fails to load.
 *
 * Leaving a page: intercept clicks on internal links, briefly fade
 * the current page to transparent, then navigate. External links,
 * new-tab links, downloads, and same-page anchors are left alone.
 */
(function () {
  'use strict';

  var FADE_MS = 220;

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a');
    if (!link) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;

    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return;
    }

    if (url.origin !== window.location.origin) return; // external site
    if (url.pathname === window.location.pathname && url.hash) return; // same-page anchor

    e.preventDefault();

    // Drive the fade-out via inline styles (highest specificity) so it
    // can't be fought by the entry keyframe animation's held state.
    // Two steps are needed: first detach from the animation and pin
    // opacity at its current value with no transition (a no-op visually),
    // force a reflow, then set the transition + target value on the
    // next frame so the browser actually animates it.
    var body = document.body;
    body.style.animation = 'none';
    body.style.transition = 'none';
    body.style.opacity = '1';
    void body.offsetHeight; // force reflow
    body.style.transition = 'opacity ' + FADE_MS + 'ms ease';
    requestAnimationFrame(function () {
      body.style.opacity = '0';
    });

    window.setTimeout(function () {
      window.location.href = url.href;
    }, FADE_MS);
  });
})();
