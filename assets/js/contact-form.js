// Sends the contact form in the background and shows the result on the page.
// Without JavaScript, the form still works (Web3Forms shows its own page).
document.querySelectorAll('.contact-form').forEach(function (form) {
  var status = form.querySelector('.contact-form-status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.className = 'contact-form-status';
    status.textContent = form.dataset.sending;
    button.disabled = true;

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result.success) throw new Error(result.message);
        form.reset();
        status.classList.add('is-success');
        status.textContent = form.dataset.success;
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = form.dataset.error;
      })
      .finally(function () { button.disabled = false; });
  });
});
