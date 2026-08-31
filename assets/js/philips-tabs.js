/**
 * Philips project sub-tabs (Tabular Trend / Histogram / Icon Design /
 * Guide Illustrations). All four live on this one page as panels;
 * the tabs and the Next button both just show/hide the right panel --
 * no navigation involved. The Next button always reads "Next" (never
 * the upcoming project's name) and just cycles to whichever panel
 * comes after the current one.
 */
(function () {
  'use strict';

  var projectKeys = ['tabular-trend', 'histogram', 'icon-design', 'guide-illustrations'];

  var tabs = document.querySelectorAll('.project-tab[data-project]');
  var panels = document.querySelectorAll('.pd-panel');
  var nextLink = document.getElementById('pd-next-link');

  if (!tabs.length || !panels.length) return;

  function indexOf(key) {
    var i = projectKeys.indexOf(key);
    return i === -1 ? 0 : i;
  }

  function selectProject(key, opts) {
    tabs.forEach(function (t) {
      var active = t.dataset.project === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.id !== 'panel-' + key;
    });

    var nextIndex = (indexOf(key) + 1) % projectKeys.length;
    if (nextLink) nextLink.dataset.target = projectKeys[nextIndex];

    if (!opts || opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      selectProject(tab.dataset.project);
    });
  });

  if (nextLink) {
    nextLink.addEventListener('click', function () {
      selectProject(nextLink.dataset.target);
    });
  }

  selectProject('tabular-trend', { scroll: false });
})();
