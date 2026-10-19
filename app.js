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

  // ----- Partner ecosystem rendering (landing tiles/logos + directory page) -----
  var CATS = window.CHAI_PARTNER_CATEGORIES || [];
  var PARTNERS = window.CHAI_PARTNERS || [];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function countIn(cat) { return PARTNERS.filter(function (p) { return p.cats.indexOf(cat) >= 0; }).length; }

  var tiles = document.getElementById('catTiles');
  if (tiles && CATS.length) {
    tiles.innerHTML = CATS.map(function (c) {
      return '<a class="cat" href="partners.html#' + c.id + '"><span class="cat__count">' + countIn(c.id) + '</span><h3>' + esc(c.name) + '</h3><p>' + esc(c.sub) + '</p></a>';
    }).join('');
    var sp = document.getElementById('statPartners'); if (sp) sp.textContent = PARTNERS.length;
  }
  var logos = document.getElementById('ecoLogos');
  if (logos && PARTNERS.length) {
    logos.innerHTML = PARTNERS.map(function (p) {
      return '<li><img src="' + esc(p.logo) + '" alt="' + esc(p.name) + ' logo" loading="lazy"></li>';
    }).join('');
  }

  var dir = document.getElementById('directory');
  if (dir && PARTNERS.length) {
    var filters = document.getElementById('filters');
    var countEl = document.getElementById('dirCount');
    function card(p) {
      var ctl = p.controls ? '<span class="pcard__ctl is-ok">' + p.controls + ' CHAI controls</span>' : '<span class="pcard__ctl">Controls forthcoming</span>';
      var tags = p.cats.map(function (id) { var c = CATS.filter(function (x) { return x.id === id; })[0]; return '<span>' + esc(c ? c.short : id) + '</span>'; }).join('');
      return '<article class="pcard"><div class="pcard__logo"><img src="' + esc(p.logo) + '" alt="' + esc(p.name) + ' logo" loading="lazy"></div><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p><div class="pcard__foot">' + ctl + '<div class="pcard__tags">' + tags + '</div></div></article>';
    }
    function render(filter) {
      var html = '';
      var shown = 0;
      CATS.forEach(function (c) {
        if (filter !== 'all' && filter !== c.id) return;
        var list = PARTNERS.filter(function (p) { return p.cats.indexOf(c.id) >= 0; });
        if (!list.length) return;
        html += '<section class="dir-section" id="' + c.id + '"><h2>' + esc(c.name) + '</h2><p class="sub">' + esc(c.sub) + '</p><div class="pgrid">' + list.map(card).join('') + '</div></section>';
        shown += list.length;
      });
      dir.innerHTML = html;
      if (countEl) countEl.textContent = filter === 'all' ? 'Showing ' + PARTNERS.length + ' partners' : 'Showing ' + shown + ' partner' + (shown === 1 ? '' : 's') + ' in this category';
      if (filters) {
        filters.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-f') === filter); });
      }
    }
    if (filters) {
      var opts = [{ id: 'all', name: 'All Partners', n: PARTNERS.length }].concat(CATS.map(function (c) { return { id: c.id, name: c.name, n: countIn(c.id) }; }));
      filters.innerHTML = opts.map(function (o) { return '<button type="button" data-f="' + o.id + '">' + esc(o.name) + '<span class="n">' + o.n + '</span></button>'; }).join('');
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var f = b.getAttribute('data-f');
        history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
        render(f);
      });
    }
    var initial = location.hash.replace('#', '');
    render(CATS.some(function (c) { return c.id === initial; }) ? initial : 'all');
  }

  var form = document.getElementById('requestForm');
  if (!form) return;

  var LABELS = {
    'ai-governance': 'AI Governance',
    risk: 'Risk Assessment',
    evaluation: 'Model Evaluation',
    intake: 'AI Intake and Procurement',
    custom: 'Custom Curriculum',
    leaders: 'Responsible AI Foundations for Leaders',
    insights: 'Insights (data, market intelligence, community)',
    'partner-find': 'Find a CHAI Partner',
    'partner-join': 'Become a CHAI Partner'
  };
  var COPY = {
    education: {
      title: 'Request Educational Services',
      lead: "Thank you for your interest in CHAI's Education as a Service. Tell us which service area and responsible AI topics are top priority for your team and we will follow up to scope a program."
    },
    insights: {
      title: 'Request Insights',
      lead: 'Thank you for your interest in CHAI Insights. Tell us which service area and responsible AI topics are top priority for your team and we will follow up with next steps.'
    },
    partners: {
      title: 'Partner Ecosystem Inquiry',
      lead: 'Thank you for your interest in the CHAI Partner Ecosystem. Tell us whether you are looking for a partner or applying to become one, and we will follow up with next steps.'
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
    var group = preset === 'insights' ? 'insights' : (preset.indexOf('partner') === 0 ? 'partners' : 'education');
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
