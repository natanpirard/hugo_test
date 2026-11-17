// Calendar page: builds the month view from the list of events on the page,
// and hides events that are already over.
(function () {
  var root = document.querySelector('.calendar');
  if (!root) return;

  var locale = root.dataset.locale || document.documentElement.lang;
  var monthView = root.querySelector('.calendar-month');
  var grid = root.querySelector('.calendar-grid');
  var title = root.querySelector('.calendar-title');
  var selected = root.querySelector('.calendar-selected');
  var selectedTitle = root.querySelector('.calendar-selected-title');
  var selectedEmpty = root.querySelector('.calendar-selected-empty');
  var selectedList = selected.querySelector('.calendar-list');
  var upcoming = root.querySelector('.calendar-upcoming');
  var items = Array.prototype.slice.call(upcoming.querySelectorAll('.calendar-item'));

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  var today = iso(new Date());

  // Events per day
  var byDate = {};
  items.forEach(function (li) {
    (byDate[li.dataset.date] = byDate[li.dataset.date] || []).push(li);
  });

  // Upcoming list: hide what is over, and show only the first activity
  // until the visitor presses "show all".
  var future = items.filter(function (li) { return li.dataset.date >= today; });
  var moreButton = upcoming.querySelector('.calendar-more');
  var expanded = false;

  function updateUpcoming() {
    items.forEach(function (li) { li.hidden = true; });
    future.forEach(function (li, i) { li.hidden = !expanded && i > 0; });
    moreButton.hidden = future.length < 2;
    moreButton.setAttribute('aria-expanded', expanded);
    moreButton.textContent = expanded
      ? moreButton.dataset.less
      : moreButton.dataset.more.replace('{count}', future.length);
  }

  moreButton.addEventListener('click', function () {
    expanded = !expanded;
    updateUpcoming();
  });

  updateUpcoming();
  upcoming.querySelector('.calendar-empty').hidden = future.length > 0;

  // Month view
  var monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  var dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  var view = new Date();
  view.setDate(1);
  var selectedDate = null;

  function render() {
    title.textContent = monthFormat.format(view);
    grid.innerHTML = '';

    // Weekday names, Monday first (5 Jan 2026 is a Monday)
    for (var w = 0; w < 7; w++) {
      var head = document.createElement('div');
      head.className = 'calendar-weekday';
      head.setAttribute('role', 'columnheader');
      head.textContent = weekdayFormat.format(new Date(2026, 0, 5 + w));
      grid.appendChild(head);
    }

    var year = view.getFullYear();
    var month = view.getMonth();
    var offset = (view.getDay() + 6) % 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var cells = Math.ceil((offset + daysInMonth) / 7) * 7;

    for (var i = 0; i < cells; i++) {
      var date = new Date(year, month, 1 - offset + i);
      var key = iso(date);
      var events = byDate[key] || [];
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'calendar-day';
      cell.dataset.date = key;
      cell.setAttribute('aria-label', dayFormat.format(date) + (events.length ? ' (' + events.length + ')' : ''));
      if (date.getMonth() !== month) cell.classList.add('is-other-month');
      if (key === today) cell.classList.add('is-today');
      if (key < today) cell.classList.add('is-past');
      if (key === selectedDate) cell.classList.add('is-selected');
      if (events.length) cell.classList.add('has-events');

      var num = document.createElement('span');
      num.className = 'calendar-day-number';
      num.textContent = date.getDate();
      cell.appendChild(num);

      events.forEach(function (li) {
        var chip = document.createElement('span');
        chip.className = 'calendar-chip is-' + li.dataset.type;
        var label = document.createElement('span');
        label.className = 'calendar-chip-label';
        label.textContent = (li.dataset.start ? li.dataset.start + ' ' : '') + li.dataset.title;
        chip.appendChild(label);
        cell.appendChild(chip);
      });

      cell.addEventListener('click', select);
      grid.appendChild(cell);
    }
  }

  function select(event) {
    var key = event.currentTarget.dataset.date;
    selectedDate = key;
    var date = parse(key);
    if (date.getMonth() !== view.getMonth()) {
      view = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    render();

    selectedTitle.textContent = dayFormat.format(date);
    selectedList.innerHTML = '';
    var events = byDate[key] || [];
    events.forEach(function (li) {
      var copy = li.cloneNode(true);
      copy.hidden = false;
      selectedList.appendChild(copy);
    });
    selectedEmpty.hidden = events.length > 0;
    selected.hidden = false;
  }

  root.querySelectorAll('.calendar-nav').forEach(function (button) {
    button.addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + Number(button.dataset.step), 1);
      render();
    });
  });

  root.querySelector('.calendar-today-button').addEventListener('click', function () {
    view = new Date();
    view.setDate(1);
    render();
  });

  render();
  monthView.hidden = false;
})();
