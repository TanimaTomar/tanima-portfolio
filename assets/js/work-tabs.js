/**
 * Work page category tabs. Learning Design and Product Design expand
 * a row of project pills in place and swap the quote below; Illustration
 * and Photography are plain links (no sub-projects to pick from), so
 * they just navigate.
 *
 * The selected category (learning/product) is remembered in
 * sessionStorage, so coming back from a case-study page (browser
 * back, or the case study's own "Work" link) lands back on the same
 * tab instead of the default screen. Illustration/Photography clear
 * that memory on the way out, since they have no tab state of their
 * own -- returning to Work after visiting either should show the
 * default screen, not whatever was selected before.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'workActiveCategory';

  var categories = {
    learning: {
      quote: "Self-initiated studies exploring what happens when I bring what I learned at the Harvard Graduate School of Education into my product design practice.",
      note: 'Not course assignments or client work—these are my attempts to put the learning into practice.',
      pills: [
        { label: 'Cubism Through Shadows', href: 'cubism.html' },
        { label: 'Foundtale', href: 'foundtale.html' },
        { label: 'Inkling Isle', href: 'inkling-isle.html' },
      ],
    },
    product: {
      quote: "The products I've designed and shipped through my professional practice.",
      note: '',
      pills: [
        { label: 'Philips', href: 'philips.html' },
        { label: 'Samsung', href: null },
        { label: 'Aurigo', href: null },
        { label: 'Itilite', href: null },
      ],
    },
  };

  var tabs = document.querySelectorAll('.work-tab[data-category]');
  var directLinks = document.querySelectorAll('.work-tab[href]');
  var pillsWrap = document.getElementById('work-pills');
  var quoteText = document.getElementById('work-quote-text');
  var quoteNote = document.getElementById('work-quote-note');

  if (!tabs.length || !pillsWrap || !quoteText) return;

  function readStored() {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStored(value) {
    try {
      if (value) {
        sessionStorage.setItem(STORAGE_KEY, value);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      /* storage unavailable (private mode, etc.) -- fine to no-op */
    }
  }

  function renderPills(pills) {
    pillsWrap.innerHTML = '';
    pills.forEach(function (item) {
      var el = document.createElement(item.href ? 'a' : 'span');
      el.className = 'work-pill' + (item.href ? '' : ' work-pill--soon');
      if (item.href) {
        el.href = item.href;
      } else {
        el.setAttribute('aria-disabled', 'true');
      }
      el.textContent = item.label;
      pillsWrap.appendChild(el);
    });
    pillsWrap.hidden = false;
  }

  function selectCategory(category, opts) {
    var data = categories[category];
    if (!data) return;

    tabs.forEach(function (t) {
      var active = t.dataset.category === category;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    quoteText.textContent = data.quote;

    if (data.note) {
      quoteNote.textContent = data.note;
      quoteNote.hidden = false;
    } else {
      quoteNote.hidden = true;
    }

    renderPills(data.pills);

    if (!opts || opts.persist !== false) {
      writeStored(category);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      selectCategory(tab.dataset.category);
    });
  });

  // Illustration/Photography have no tab state of their own -- clear
  // any remembered category so a later visit starts from default.
  directLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      writeStored(null);
    });
  });

  var restored = readStored();
  if (restored && categories[restored]) {
    selectCategory(restored, { persist: false });
  }
})();
