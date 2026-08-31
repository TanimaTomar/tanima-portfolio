/**
 * Philips project sub-tabs (Tabular Trend / Icon Design / Electrode
 * Placement Guide). All three live on this one page as panels; the
 * tabs, the "up next" list, and the Next button all just show/hide
 * the right panel -- no navigation involved.
 */
(function () {
  'use strict';

  var projects = [
    { key: 'tabular-trend', label: 'Tabular Trend' },
    { key: 'icon-design', label: 'Icon Design' },
    { key: 'electrode-guide', label: 'Electrode Placement Guide' },
  ];

  var tabs = document.querySelectorAll('.project-tab[data-project]');
  var panels = document.querySelectorAll('.pd-panel');
  var upNext = document.getElementById('pd-upnext');
  var nextLink = document.getElementById('pd-next-link');
  var nextLabel = document.getElementById('pd-next-label');

  if (!tabs.length || !panels.length) return;

  function indexOf(key) {
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].key === key) return i;
    }
    return 0;
  }

  function renderUpNext(activeKey) {
    if (!upNext) return;
    upNext.innerHTML = '';
    projects
      .filter(function (p) { return p.key !== activeKey; })
      .forEach(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = p.label;
        btn.addEventListener('click', function () { selectProject(p.key); });
        upNext.appendChild(btn);
      });
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

    renderUpNext(key);

    var nextIndex = (indexOf(key) + 1) % projects.length;
    if (nextLabel) nextLabel.textContent = projects[nextIndex].label;
    if (nextLink) nextLink.dataset.target = projects[nextIndex].key;

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
