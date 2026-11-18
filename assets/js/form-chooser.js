// Sign-up page: shows one registration form at a time, chosen with the
// buttons at the top. Choices whose "until" date has passed are removed.
// A link like /inschrijven/#schaaknamiddag opens that form directly.
document.querySelectorAll('.form-chooser').forEach(function (root) {
  var tablist = root.querySelector('.form-tabs');
  if (!tablist) return;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var now = new Date();
  var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());

  function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }

  // Remove choices that are over
  Array.prototype.forEach.call(root.querySelectorAll('.form-tab'), function (tab) {
    if (tab.dataset.until && tab.dataset.until < today) {
      panelOf(tab).remove();
      tab.remove();
    }
  });

  var tabs = Array.prototype.slice.call(root.querySelectorAll('.form-tab'));
  if (tabs.length < 2) {
    // Only one form left: no need for a choice
    tablist.remove();
    root.querySelectorAll('.form-panel-title').forEach(function (h) { h.remove(); });
    return;
  }

  function show(id) {
    tabs.forEach(function (tab) {
      var on = tab.getAttribute('aria-controls') === id;
      tab.setAttribute('aria-selected', on);
      tab.tabIndex = on ? 0 : -1;
      panelOf(tab).hidden = !on;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      var id = tab.getAttribute('aria-controls');
      show(id);
      history.replaceState(null, '', '#' + id);
    });
    // Left/right arrow keys move between the choices
    tab.addEventListener('keydown', function (event) {
      var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      var next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  var fromLink = location.hash.slice(1);
  var start = tabs.filter(function (t) { return t.getAttribute('aria-controls') === fromLink; })[0] || tabs[0];
  show(start.getAttribute('aria-controls'));

  root.classList.add('is-enhanced');
  tablist.hidden = false;
  if (fromLink && start.getAttribute('aria-controls') === fromLink) {
    root.scrollIntoView();
  }
});
