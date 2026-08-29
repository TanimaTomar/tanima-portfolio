/**
 * Same masonry-packing approach as illustration-masonry.js, applied
 * to the 2-column photo grid instead of the 3-column illustration
 * gallery. See that file for the full rationale.
 */
(function () {
  'use strict';

  if (typeof imagesLoaded === 'undefined' || typeof Masonry === 'undefined') return;

  var grid = document.querySelector('.photo-grid');
  if (!grid) return;

  var masonry = new Masonry(grid, {
    itemSelector: '.photo-item',
    columnWidth: '.photo-sizer',
    percentPosition: true,
    gutter: 24,
  });

  imagesLoaded(grid).on('progress', function () {
    masonry.layout();
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      masonry.layout();
    }, 150);
  });
})();
