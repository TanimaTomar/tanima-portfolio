/**
 * Masonry-style packing for the illustration gallery.
 *
 * A uniform CSS grid can't match hand-tuned bottom edges since each
 * piece of art has a different natural height. Masonry places each
 * item (in DOM/reading order) into whichever column is currently
 * shortest, so the columns pack tightly around the actual image
 * heights instead of leaving hardcoded gaps.
 *
 * imagesLoaded waits for every image to actually finish loading
 * before the first layout runs (and relayouts as each one completes),
 * since Masonry needs real image heights to place things correctly.
 */
(function () {
  'use strict';

  if (typeof imagesLoaded === 'undefined' || typeof Masonry === 'undefined') return;

  var grid = document.querySelector('.illustration-grid');
  if (!grid) return;

  var masonry = new Masonry(grid, {
    itemSelector: '.illustration-item',
    columnWidth: '.illustration-sizer',
    percentPosition: true,
    gutter: 24,
  });

  imagesLoaded(grid).on('progress', function () {
    masonry.layout();
  });

  // Re-pack on resize (e.g. crossing the mobile breakpoint, where the
  // sizer collapses to a single 100%-wide column) -- debounced so it
  // doesn't run on every pixel while dragging the window.
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      masonry.layout();
    }, 150);
  });
})();
