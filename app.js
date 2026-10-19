// CHAI Services prototype — nav toggle + interest form behavior (no backend).
(function () {
  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var form = document.getElementById('requestForm');
  if (!form) return;

  var LABELS = {
    intake: 'AI Intake + Procurement',
    governance: 'Risk-tiered Governance',
    evaluation: 'Model Evaluation',
    education: 'Education — other / custom curriculum',
    insights: 'Insights (data, market intelligence, community)',
    general: 'General inquiry'
  };
  var COPY = {
    education: {
      title: 'Request Educational Support',
      lead: 'Thank you for your interest in CHAI Education as a Service. Tell us which teams you would like to equip and the responsible AI topics that matter most, and we will follow up to scope a program.'
    },
    insights: {
      title: 'Request Insights',
      lead: 'Thank you for your interest in CHAI Insights. Tell us about your organization and the data, market intelligence, or community access that would be most valuable, and we will follow up with next steps.'
    }
  };

  var select = document.getElementById('service');
  var chips = document.querySelectorAll('#serviceChips button');
  var params = new URLSearchParams(location.search);
  var preset = params.get('service');

  function syncChips() {
    chips.forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-service') === select.value);
    });
  }

  if (preset && LABELS[preset]) {
    select.value = preset;
    var group = preset === 'insights' ? 'insights' : 'education';
    if (COPY[group]) {
      document.getElementById('formTitle').textContent = COPY[group].title;
      document.getElementById('formLead').textContent = COPY[group].lead;
      document.title = COPY[group].title + ' | CHAI';
    }
  }
  syncChips();

  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      select.value = b.getAttribute('data-service');
      syncChips();
      clearError(select);
    });
  });
  select.addEventListener('change', function () { syncChips(); clearError(select); });

  function fieldOf(el) { return el.closest('.field'); }
  function setError(el) { fieldOf(el).classList.add('has-error'); }
  function clearError(el) { fieldOf(el).classList.remove('has-error'); }

  ['name', 'company', 'email', 'message'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { clearError(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      name: form.name.value.trim(),
      company: form.company.value.trim(),
      email: form.email.value.trim(),
      service: select.value,
      message: form.message.value.trim()
    };
    var ok = true;
    if (!data.name) { setError(form.name); ok = false; }
    if (!data.company) { setError(form.company); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError(form.email); ok = false; }
    if (!data.service) { setError(select); ok = false; }
    if (!data.message) { setError(form.message); ok = false; }
    if (!ok) {
      var first = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (first) first.focus();
      return;
    }

    // Prototype only: keep a local copy so reviewers can see submissions in this browser.
    try {
      var key = 'chai-services:requests';
      var list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push(Object.assign({ submittedAt: new Date().toISOString() }, data));
      localStorage.setItem(key, JSON.stringify(list));
    } catch (err) { /* storage unavailable — ignore */ }

    // Summary
    var summary = document.getElementById('summary');
    summary.innerHTML = '';
    [['Name', data.name], ['Company', data.company], ['Email', data.email], ['Service Area', LABELS[data.service]], ['Message', data.message]].forEach(function (pair) {
      var dt = document.createElement('dt'); dt.textContent = pair[0];
      var dd = document.createElement('dd'); dd.textContent = pair[1];
      summary.appendChild(dt); summary.appendChild(dd);
    });

    // Optional email hand-off so the request reaches CHAI even without a backend.
    var subject = 'CHAI Services interest: ' + LABELS[data.service];
    var body = 'Name: ' + data.name + '\nCompany: ' + data.company + '\nEmail: ' + data.email +
      '\nService Area: ' + LABELS[data.service] + '\n\nMessage:\n' + data.message;
    document.getElementById('emailLink').href = 'mailto:admin@chai.org?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    document.getElementById('formCard').classList.add('is-hidden');
    document.getElementById('successCard').classList.add('is-visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
