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
    intake: 'AI Intake and Procurement',
    governance: 'Risk-tiered Governance',
    evaluation: 'Model Evaluation',
    'ai-governance': 'AI Governance (webinar series or executive workshop)',
    leaders: 'Responsible AI Foundations for Leaders',
    custom: 'Custom Curriculum',
    insights: 'Insights (data, market intelligence, community)'
  };
  var COPY = {
    education: {
      title: 'Request Educational Services',
      lead: "Thank you for your interest in CHAI's Education as a Service. Tell us which service area and responsible AI topics are top priority for your team and we will follow up to scope a program."
    },
    insights: {
      title: 'Request Insights',
      lead: 'Thank you for your interest in CHAI Insights. Tell us which service area and responsible AI topics are top priority for your team and we will follow up with next steps.'
    }
  };

  // Personal / free-mail domains are rejected; an organizational address is required.
  var PERSONAL_DOMAINS = [
    'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com', 'hotmail.com', 'outlook.com',
    'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com', 'protonmail.com', 'proton.me', 'pm.me',
    'mail.com', 'email.com', 'zoho.com', 'zohomail.com', 'gmx.com', 'gmx.net', 'yandex.com', 'yandex.ru',
    'fastmail.com', 'hey.com', 'tutanota.com', 'tuta.io', 'comcast.net', 'verizon.net', 'att.net',
    'sbcglobal.net', 'bellsouth.net', 'cox.net', 'charter.net', 'earthlink.net', 'mailinator.com', 'guerrillamail.com'
  ];
  function emailProblem(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    var domain = email.split('@')[1].toLowerCase();
    var isPersonal = PERSONAL_DOMAINS.some(function (d) { return domain === d || domain.endsWith('.' + d); });
    if (isPersonal) return 'Please use your organizational email address. Personal email domains (for example gmail.com or yahoo.com) are not accepted.';
    return null;
  }

  var select = document.getElementById('service');
  var params = new URLSearchParams(location.search);
  var preset = params.get('service');

  if (preset) {
    var group = preset === 'insights' ? 'insights' : 'education';
    if (COPY[group]) {
      document.getElementById('formTitle').textContent = COPY[group].title;
      document.getElementById('formLead').textContent = COPY[group].lead;
      document.title = COPY[group].title + ' | CHAI';
    }
    if (LABELS[preset]) select.value = preset;
  }

  function fieldOf(el) { return el.closest('.field'); }
  function setError(el, msg) {
    fieldOf(el).classList.add('has-error');
    if (msg) fieldOf(el).querySelector('.field__error').textContent = msg;
  }
  function clearError(el) { fieldOf(el).classList.remove('has-error'); }

  ['name', 'jobTitle', 'company', 'email', 'message'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { clearError(el); });
  });
  select.addEventListener('change', function () { clearError(select); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      name: form.name.value.trim(),
      jobTitle: form.jobTitle.value.trim(),
      company: form.company.value.trim(),
      email: form.email.value.trim(),
      service: select.value,
      message: form.message.value.trim()
    };
    var ok = true;
    if (!data.name) { setError(form.name); ok = false; }
    if (!data.jobTitle) { setError(form.jobTitle); ok = false; }
    if (!data.company) { setError(form.company); ok = false; }
    var emailMsg = emailProblem(data.email);
    if (emailMsg) { setError(form.email, emailMsg); ok = false; }
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
    [['Name', data.name], ['Job Title', data.jobTitle], ['Company', data.company], ['Email', data.email], ['Service Area', LABELS[data.service]], ['Message', data.message]].forEach(function (pair) {
      var dt = document.createElement('dt'); dt.textContent = pair[0];
      var dd = document.createElement('dd'); dd.textContent = pair[1];
      summary.appendChild(dt); summary.appendChild(dd);
    });

    // Optional email hand-off so the request reaches CHAI even without a backend.
    var subject = 'CHAI Services interest: ' + LABELS[data.service];
    var body = 'Name: ' + data.name + '\nJob Title: ' + data.jobTitle + '\nCompany: ' + data.company + '\nEmail: ' + data.email +
      '\nService Area: ' + LABELS[data.service] + '\n\nMessage:\n' + data.message;
    document.getElementById('emailLink').href = 'mailto:admin@chai.org?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    document.getElementById('formCard').classList.add('is-hidden');
    document.getElementById('successCard').classList.add('is-visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
