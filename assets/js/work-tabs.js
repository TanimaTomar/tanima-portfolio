/**
 * Work page category tabs. Learning Design and Product Design expand
 * a row of project pills in place and swap the quote below; Illustration
 * and Photography are plain links (no sub-projects to pick from), so
 * they just navigate -- no JS needed for those two.
 */
(function () {
  'use strict';

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
        { label: 'Philips', href: null },
        { label: 'Samsung', href: null },
        { label: 'Aurigo', href: null },
        { label: 'Itilite', href: null },
      ],
    },
  };

  var tabs = document.querySelectorAll('.work-tab[data-category]');
  var pillsWrap = document.getElementById('work-pills');
  var quoteText = document.getElementById('work-quote-text');
  var quoteNote = document.getElementById('work-quote-note');

  if (!tabs.length || !pillsWrap || !quoteText) return;

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

  function selectCategory(category) {
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
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      selectCategory(tab.dataset.category);
    });
  });
})();
