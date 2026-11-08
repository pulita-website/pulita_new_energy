/* ==========================================================================
   Pulita New Energy — site interactions (vanilla JS, no dependencies)
   ========================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var CONTACT = {
    email: 'john@hitepower.com',
    waNigeria: '2348030800999',
    waChina: '8618678060186'
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Naira formatting ---------- */
  function naira(n) { return '₦' + Math.round(n).toLocaleString('en-NG'); }
  function nairaShort(n) {
    var a = Math.abs(n);
    if (a >= 1e9) return '₦' + (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return '₦' + (n / 1e6).toFixed(a >= 1e8 ? 0 : 1) + 'M';
    if (a >= 1e4) return '₦' + Math.round(n / 1e3).toLocaleString('en-NG') + 'k';
    return naira(n);
  }

  /* ---------- Header: scrolled state, mobile menu, back-to-top ---------- */
  var header = $('.site-header');
  var toTop = $('.to-top');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (toTop) toTop.classList.toggle('is-shown', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  var menuBtn = $('.menu-btn');
  var mobileNav = $('.mobile-nav');
  function setMenu(open) {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('is-open', open);
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1024) setMenu(false); });

  /* ---------- Smooth page transitions for internal links ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var href = a.getAttribute('href');
    if (!href || a.target === '_blank' || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/i.test(href) || a.hasAttribute('download')) return;
    if (!/\.html(\?|#|$)/.test(href)) return;
    var samePage = href.split('#')[0] === '' || location.pathname.split('/').pop() === href.split('#')[0].split('?')[0];
    if (samePage && href.indexOf('#') > -1) return;
    if (reduceMotion) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function () { window.location.href = href; }, 240);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('is-leaving'); });

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  var io = ('IntersectionObserver' in window && !reduceMotion) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        en.target.dispatchEvent(new CustomEvent('reveal'));
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;
  function observeReveal(els) {
    els.forEach(function (el) {
      if (el.dataset.delay) el.style.setProperty('--d', el.dataset.delay + 'ms');
      if (io) io.observe(el);
      else { el.classList.add('is-visible'); setTimeout(function () { el.dispatchEvent(new CustomEvent('reveal')); }, 0); }
    });
  }
  observeReveal($$('[data-reveal], .tl-item, .mini-bar, [data-bars]'));

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1800, start = null;
    if (reduceMotion) { el.textContent = prefix + target.toLocaleString('en-NG', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      var v = target * eased;
      el.textContent = prefix + v.toLocaleString('en-NG', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else { counters.forEach(animateCount); }

  /* ---------- Fuel comparison (brochure table, animated bars) ---------- */
  var compare = $('[data-compare]');
  if (compare) {
    var DATA = {
      kwh: { unit: '/kWh', vals: { diesel: 500, lpg: 165, cng: 114 }, note: 'Comprehensive cost per kWh (Naira), 100kW reference generator.' },
      hour: { unit: '/hr', vals: { diesel: 50000, lpg: 16560, cng: 11400 }, note: 'Fuel cost per running hour (Naira), 100kW reference generator.' }
    };
    var saving = { diesel: null, lpg: 67, cng: 77 };
    var mode = 'kwh', shown = false;
    function renderCompare() {
      var d = DATA[mode], max = d.vals.diesel;
      ['diesel', 'lpg', 'cng'].forEach(function (k) {
        var fill = $('.compare-fill.' + k, compare);
        var val = $('[data-val="' + k + '"]', compare);
        fill.style.width = shown ? (d.vals[k] / max * 100) + '%' : '0%';
        fill.textContent = k === 'diesel' ? 'Baseline' : '−' + saving[k] + '%';
        val.innerHTML = naira(d.vals[k]) + '<small style="font-size:.9rem;opacity:.7;font-weight:600">' + d.unit + '</small>';
      });
      var note = $('[data-compare-note]', compare);
      if (note) note.textContent = d.note;
    }
    $$('[data-compare-mode]', compare).forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.dataset.compareMode;
        $$('[data-compare-mode]', compare).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderCompare();
      });
    });
    renderCompare();
    compare.addEventListener('reveal', function () { shown = true; renderCompare(); });
    if (!('IntersectionObserver' in window) || reduceMotion) { shown = true; renderCompare(); }
  }

  /* ---------- Savings calculator ---------- */
  var calc = $('[data-calc]');
  if (calc) {
    // Conversion factors derived from Pulita's 100kW reference data:
    // diesel 25 L/h -> LPG consumed cost N16,560 @ N750/kg (22.08 kg/h) ; CNG 30 m3/h.
    var LPG_PER_L = 22.08 / 25;  // kg LPG per litre of diesel displaced
    var CNG_PER_L = 30 / 25;     // m3 CNG per litre of diesel displaced
    var KW_PER_LPH = 100 / 25;   // ~4 kW electrical output per L/h diesel
    var fuel = 'cng';
    var inputs = {
      lph: $('#calc-lph', calc), hours: $('#calc-hours', calc), days: $('#calc-days', calc),
      pd: $('#price-diesel', calc), pl: $('#price-lpg', calc), pc: $('#price-cng', calc)
    };
    var lastSave = null;
    function setRangeFill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); }
    function num(el, fb) { var v = parseFloat(el.value); return isFinite(v) && v > 0 ? v : fb; }
    function renderCalc() {
      var lph = num(inputs.lph, 25), h = num(inputs.hours, 12), d = num(inputs.days, 26);
      var pd = num(inputs.pd, 2000), pl = num(inputs.pl, 750), pc = num(inputs.pc, 380);
      [inputs.lph, inputs.hours, inputs.days].forEach(setRangeFill);
      $('#out-lph', calc).innerHTML = lph + '<small>L/h</small>';
      $('#out-hours', calc).innerHTML = h + '<small>hrs/day</small>';
      $('#out-days', calc).innerHTML = d + '<small>days/mo</small>';
      var kw = lph * KW_PER_LPH;
      $('#out-size', calc).textContent = '≈ ' + Math.round(kw) + ' kW (' + Math.round(kw / 0.8) + ' kVA) generator load';
      var hrs = h * d;
      var costD = lph * pd * hrs;
      var costL = lph * LPG_PER_L * pl * hrs;
      var costC = lph * CNG_PER_L * pc * hrs;
      var gas = fuel === 'lpg' ? costL : costC;
      var save = costD - gas;
      var pct = costD > 0 ? save / costD * 100 : 0;
      var big = $('#out-save', calc);
      big.textContent = nairaShort(save);
      if (lastSave !== null && Math.round(lastSave) !== Math.round(save)) { big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop'); }
      lastSave = save;
      $('#out-pct', calc).textContent = Math.round(pct) + '%';
      $('#out-year', calc).textContent = nairaShort(save * 12);
      $('#out-fuel-name', calc).textContent = fuel.toUpperCase();
      var max = Math.max(costD, costL, costC);
      [['diesel', costD], ['lpg', costL], ['cng', costC]].forEach(function (p) {
        $('.out-fill.' + p[0], calc).style.width = (p[1] / max * 100) + '%';
        $('[data-out="' + p[0] + '"]', calc).textContent = nairaShort(p[1]);
      });
      $$('.out-row', calc).forEach(function (r) { r.style.opacity = (r.dataset.fuel === 'diesel' || r.dataset.fuel === fuel) ? '1' : '.45'; });
    }
    Object.keys(inputs).forEach(function (k) { if (inputs[k]) inputs[k].addEventListener('input', renderCalc); });
    $$('[data-fuel]', calc).forEach(function (b) {
      b.addEventListener('click', function () {
        fuel = b.dataset.fuel;
        $$('[data-fuel]', calc).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderCalc();
      });
    });
    renderCalc();
  }

  /* ---------- Carousel (scroll-snap + buttons + drag) ---------- */
  $$('[data-carousel]').forEach(function (root) {
    var track = $('.carousel-track', root);
    var prev = $('[data-prev]', root), next = $('[data-next]', root);
    var bar = $('.carousel-progress i', root);
    function cardW() { var c = track.children[0]; return c ? c.getBoundingClientRect().width + 20 : 300; }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft > max - 8;
      if (bar) { var w = Math.max(track.clientWidth / track.scrollWidth * 100, 12); bar.style.width = w + '%'; bar.style.transform = 'translateX(' + (p * (100 / w * 100 - 100)) + '%)'; }
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -cardW(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: cardW(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    // mouse drag (touch uses native scrolling)
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; track.classList.add('is-dragging'); }
      track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return; down = false;
      track.classList.remove('is-dragging');
      if (moved) { var w = cardW(); track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: 'smooth' }); }
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: cardW(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -cardW(), behavior: 'smooth' }); }
    });
  });

  // Touch devices: tap a product card once to reveal specs, tap again to follow link
  $$('.product-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (window.matchMedia('(hover: hover)').matches) return;
      if (!card.classList.contains('show-specs')) {
        e.preventDefault();
        $$('.product-card.show-specs').forEach(function (c) { c.classList.remove('show-specs'); });
        card.classList.add('show-specs');
      }
    });
  });

  /* ---------- Project filters ---------- */
  function initFilters() {
    var filterRoot = $('[data-filters]');
    if (!filterRoot) return;
    var cards = $$('.project-card[data-tags]');
    $$('.pill', filterRoot).forEach(function (pill) {
      var f = pill.dataset.filter;
      var count = f === 'all' ? cards.length : cards.filter(function (c) { return c.dataset.tags.split(' ').indexOf(f) > -1; }).length;
      var cEl = $('.count', pill); if (cEl) cEl.textContent = count;
      pill.hidden = count === 0 && f !== 'all';
      pill.onclick = function () {
        $$('.pill', filterRoot).forEach(function (p) { p.setAttribute('aria-pressed', String(p === pill)); });
        cards.forEach(function (c, i) {
          var show = f === 'all' || c.dataset.tags.split(' ').indexOf(f) > -1;
          c.classList.toggle('is-hidden', !show);
          c.classList.remove('is-entering');
          if (show) { c.style.animationDelay = (i % 6) * 50 + 'ms'; void c.offsetWidth; c.classList.add('is-entering'); }
        });
        var live = $('[data-filter-status]'); if (live) live.textContent = count + ' projects shown';
      };
    });
  }
  function initProjectCards(root) {
    $$('.project-card', root).forEach(function (c) {
      c.addEventListener('click', function () { if (!window.matchMedia('(hover: hover)').matches) c.classList.toggle('show-info'); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('show-info'); } });
    });
  }
  initProjectCards(document);

  /* ---------- CMS content: News, Projects, Settings ---------- */
  // Content lives in content/*.json and is edited by the client through Pages CMS.
  // When the site is opened from disk (file://), the offline copy in content-fallback.js is used.
  function loadContent(name) {
    var fb = (window.PULITA_CONTENT || {})[name] || null;
    if (location.protocol === 'file:' || !window.fetch) return Promise.resolve(fb);
    return fetch('content/' + name + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(function () { return fb; });
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function imgPath(p) { return esc(String(p || '').replace(/^\//, '')); }
  var SECTOR_KEY = { 'healthcare': 'healthcare', 'telecom': 'telecom', 'gas station': 'station', 'commercial & industrial': 'commercial' };
  var PIN = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  var CAL = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  var ARR = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function projectCard(p, i) {
    var fuel = String(p.fuel || '').trim();
    var tags = [fuel.toLowerCase().replace(/\s+/g, '-'), SECTOR_KEY[String(p.sector || '').toLowerCase()] || 'other'].join(' ');
    var cap = esc(p.capacity || '').replace(/kVA$/i, '<small style="font-size:1.4rem">kVA</small>');
    return '<div class="project-card" tabindex="0" role="button" aria-label="' + esc(p.title) + ', ' + esc(p.capacity) + ' ' + esc(fuel) + ', ' + esc(p.location) + '" data-tags="' + esc(tags) + '" data-reveal="up" data-delay="' + ((i % 3) * 90) + '">' +
      '<img src="' + imgPath(p.image) + '" alt="' + esc(p.title) + ': ' + esc(p.capacity) + ' ' + esc(fuel) + ' installation" loading="lazy">' +
      '<div class="label"><span class="fuel-chip' + (fuel === 'LPG' ? ' lpg' : '') + '">' + esc(fuel) + '</span><p class="font-display text-2xl font-extrabold uppercase mt-2 leading-tight">' + esc(p.title) + '</p></div>' +
      '<div class="reveal-info"><span class="kva">' + cap + '</span><p class="font-display text-2xl font-extrabold uppercase leading-tight">' + esc(p.title) + '</p>' +
      '<p class="flex items-center gap-2 text-white/90 font-semibold">' + PIN + esc(p.location) + '</p>' +
      (p.summary ? '<p class="text-white/85 text-sm leading-snug">' + esc(p.summary) + '</p>' : '') + '</div></div>';
  }
  function fmtDate(d) {
    if (!d) return '';
    var dt = new Date(String(d).slice(0, 10) + 'T00:00:00');
    return isNaN(dt) ? esc(d) : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function isUpcoming(n) {
    if (!n.date || !/exhibition|event/i.test(n.type || '')) return false;
    var dt = new Date(String(n.date).slice(0, 10) + 'T23:59:59');
    return !isNaN(dt) && dt >= new Date();
  }
  function newsCard(n, i, big) {
    var href = n.link ? esc(n.link) : '';
    var tag = href ? 'a' : 'article';
    return '<' + tag + (href ? ' href="' + href + '"' : '') + ' class="news-card card card-hover' + (big ? ' news-big' : '') + '" data-reveal="up" data-delay="' + ((i % 3) * 90) + '">' +
      '<div class="news-media">' + (n.image ? '<img src="' + imgPath(n.image) + '" alt="" loading="lazy">' : '') + '<span class="news-type">' + esc(n.type || 'News') + '</span></div>' +
      '<div class="p-6 flex flex-col flex-1">' +
      '<p class="news-meta">' + (n.date ? '<span>' + CAL + fmtDate(n.date) + '</span>' : '') + (n.location ? '<span>' + PIN + esc(n.location) + '</span>' : '') + '</p>' +
      '<h3 class="font-display text-2xl font-extrabold uppercase text-blue-brand leading-tight mt-2">' + esc(n.title) + '</h3>' +
      (n.summary ? '<p class="text-slate-600 text-[15px] mt-3">' + esc(n.summary) + '</p>' : '') +
      (href ? '<span class="link-arrow mt-auto pt-4" style="font-size:.98rem">Read more ' + ARR + '</span>' : '') +
      '</div></' + tag + '>';
  }
  function eventRow(n, i) {
    var dt = new Date(String(n.date).slice(0, 10) + 'T00:00:00');
    var day = isNaN(dt) ? '' : dt.getDate();
    var mon = isNaN(dt) ? '' : dt.toLocaleDateString('en-GB', { month: 'short' });
    return '<div class="event-row" data-reveal="up" data-delay="' + (i * 80) + '"><div class="event-date"><b>' + day + '</b><span>' + esc(mon) + '</span></div>' +
      '<div class="flex-1"><p class="font-display text-xl font-extrabold uppercase text-blue-brand leading-tight">' + esc(n.title) + '</p>' +
      '<p class="news-meta mt-1">' + (n.location ? '<span>' + PIN + esc(n.location) + '</span>' : '') + '<span>' + CAL + fmtDate(n.date) + '</span></p>' +
      (n.summary ? '<p class="text-slate-600 text-[15px] mt-1">' + esc(n.summary) + '</p>' : '') + '</div>' +
      (n.link ? '<a class="btn btn-sm btn-outline" href="' + esc(n.link) + '">Details</a>' : '') + '</div>';
  }
  function sortNews(list) {
    return list.map(function (n, i) { return { n: n, i: i }; }).sort(function (a, b) {
      if (a.n.date && b.n.date) return a.n.date < b.n.date ? 1 : a.n.date > b.n.date ? -1 : a.i - b.i;
      return a.i - b.i;
    }).map(function (x) { return x.n; });
  }
  function fill(el, html) { el.innerHTML = html; observeReveal($$('[data-reveal]', el)); }

  var needProjects = $('[data-cms^="projects"]'), needNews = $('[data-cms^="news"], [data-cms="events"]');
  if (needProjects) loadContent('projects').then(function (list) {
    list = (list || []).filter(function (p) { return p && p.title; });
    $$('[data-cms="projects-grid"]').forEach(function (el) { fill(el, list.map(projectCard).join('')); initProjectCards(el); });
    $$('[data-cms="projects-featured"]').forEach(function (el) {
      var lim = parseInt(el.dataset.limit || '6', 10);
      var feat = list.filter(function (p) { return p.featured; });
      list.forEach(function (p) { if (feat.length < lim && feat.indexOf(p) === -1) feat.push(p); });
      fill(el, feat.slice(0, lim).map(projectCard).join('')); initProjectCards(el);
    });
    var stat = $('[data-cms-count="projects"]'); if (stat) { stat.dataset.count = list.length; stat.textContent = list.length; }
    initFilters();
  });
  if (needNews) loadContent('news').then(function (list) {
    list = sortNews((list || []).filter(function (n) { return n && n.title; }));
    var upcoming = list.filter(isUpcoming).sort(function (a, b) { return a.date > b.date ? 1 : -1; });
    var past = list.filter(function (n) { return !isUpcoming(n); });
    $$('[data-cms="events"]').forEach(function (el) {
      var empty = el.parentElement.querySelector('[data-cms-empty]');
      if (upcoming.length) { fill(el, upcoming.map(eventRow).join('')); if (empty) empty.hidden = true; }
      else { el.innerHTML = ''; if (empty) empty.hidden = false; }
    });
    $$('[data-cms="news-latest"]').forEach(function (el) { fill(el, past.slice(0, parseInt(el.dataset.limit || '3', 10)).map(function (n, i) { return newsCard(n, i); }).join('')); });
    $$('[data-cms="news-list"]').forEach(function (el) { fill(el, past.map(function (n, i) { return newsCard(n, i, i === 0); }).join('') || '<p class="text-slate-500">News coming soon.</p>'); });
  });

  // Gas supply partners (Solutions page): logo if uploaded, otherwise the company name.
  if ($('[data-cms="partners"]')) loadContent('partners').then(function (list) {
    list = (list || []).filter(function (p) { return p && p.name; });
    $$('[data-cms="partners"]').forEach(function (el) {
      fill(el, list.map(function (p, i) {
        var inner = p.logo ? '<img src="' + imgPath(p.logo) + '" alt="' + esc(p.name) + ' logo" loading="lazy">' : '<span>' + esc(p.name) + '</span>';
        var url = /^https?:\/\//.test(p.website || '') ? esc(p.website) : '';
        return url ? '<a class="partner" href="' + url + '" target="_blank" rel="noopener" title="' + esc(p.name) + '" data-reveal="up" data-delay="' + (i * 80) + '">' + inner + '</a>'
                   : '<div class="partner" title="' + esc(p.name) + '" data-reveal="up" data-delay="' + (i * 80) + '">' + inner + '</div>';
      }).join(''));
    });
  });

  // Social links (edited in the CMS under Settings). Empty = placeholder.
  loadContent('settings').then(function (st) {
    st = st || {};
    $$('[data-social]').forEach(function (a) {
      var url = st[a.dataset.social];
      if (url && /^https?:\/\//.test(url)) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.classList.remove('is-placeholder'); }
      else { a.classList.add('is-placeholder'); a.addEventListener('click', function (e) { e.preventDefault(); toast('Our ' + (a.dataset.social === 'twitter' ? 'X (Twitter)' : 'Facebook') + ' page is coming soon.'); }); }
    });
  });

  /* ---------- Hero photo slider ---------- */
  $$('[data-slider]').forEach(function (root) {
    var slides = $$('.slide', root), dots = $$('.slide-dot', root), cap = $('[data-slide-caption]', root), i = 0, timer;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      if (cap) cap.textContent = slides[i].dataset.caption || '';
    }
    function play() { if (reduceMotion) return; clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6000); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); play(); }); });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', play);
    go(0); play();
  });

  /* ---------- Nav dropdown ---------- */
  $$('.nav-dd').forEach(function (dd) {
    var btn = $('.dd-toggle', dd);
    btn.addEventListener('click', function (e) { e.stopPropagation(); var o = btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', String(o)); dd.classList.toggle('is-open', o); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) { btn.setAttribute('aria-expanded', 'false'); dd.classList.remove('is-open'); } });
    dd.addEventListener('keydown', function (e) { if (e.key === 'Escape') { btn.setAttribute('aria-expanded', 'false'); dd.classList.remove('is-open'); btn.focus(); } });
  });

  /* ---------- Solutions flowchart ---------- */
  $$('[data-flow]').forEach(function (root) {
    var steps = $$('[data-step-btn]', root), panels = $$('[data-step-panel]', root);
    function set(k) {
      steps.forEach(function (s) { var on = s.dataset.stepBtn === k; s.setAttribute('aria-selected', String(on)); s.classList.toggle('is-active', on); });
      panels.forEach(function (p) { p.hidden = p.dataset.stepPanel !== k; });
    }
    steps.forEach(function (s) { s.addEventListener('click', function () { set(s.dataset.stepBtn); }); });
    if (steps[0]) set(steps[0].dataset.stepBtn);
  });

  /* ---------- Product modal ---------- */
  var modal = $('#product-modal');
  var lastFocus = null;
  function openModal(id) {
    var data = window.PULITA_PRODUCTS && window.PULITA_PRODUCTS[id];
    if (!modal || !data) return;
    $('[data-m="img"]', modal).src = data.img;
    $('[data-m="img"]', modal).alt = data.title;
    $('[data-m="media"]', modal).classList.toggle('cover', !!data.cover);
    $('[data-m="tag"]', modal).textContent = data.tag;
    $('[data-m="title"]', modal).textContent = data.title;
    $('[data-m="desc"]', modal).innerHTML = data.desc;
    $('[data-m="specs"]', modal).innerHTML = data.specs.map(function (s) { return '<tr><td>' + s[0] + '</td><td>' + s[1] + '</td></tr>'; }).join('');
    $('[data-m="features"]', modal).innerHTML = data.features.map(function (f) { return '<li>' + ICON_CHECK + '<span>' + f + '</span></li>'; }).join('');
    $('[data-m="quote"]', modal).href = 'services.html?interest=' + encodeURIComponent(data.interest || data.title) + '#quote';
    $('[data-m="wa"]', modal).href = waLink(CONTACT.waNigeria, 'Hello Pulita, I would like a quote for: ' + data.title + '.');
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(function () { $('.modal-close', modal).focus(); }, 50);
  }
  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  $$('[data-product]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openModal(b.dataset.product); }); });
  if (modal) {
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab' && modal.classList.contains('is-open')) {
        var f = $$('a[href], button:not([disabled])', modal).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    if (location.hash.indexOf('#product-') === 0) openModal(location.hash.replace('#product-', ''));
  }

  /* ---------- Spec table: fuel filter + kVA finder ---------- */
  var specRoot = $('[data-spec]');
  if (specRoot) {
    var rows = $$('tbody tr', specRoot);
    var kvaInput = $('#kva-find', specRoot);
    var result = $('[data-kva-result]', specRoot);
    var gasFilter = 'all';
    function applySpec() {
      rows.forEach(function (r) { var g = r.dataset.gas; var keep = gasFilter === 'all' || (gasFilter === 'LPG' ? g.indexOf('LPG') > -1 : g === gasFilter); r.classList.toggle('is-hidden', !keep); r.classList.remove('is-match'); });
      var need = parseFloat(kvaInput && kvaInput.value);
      if (need > 0) {
        var visible = rows.filter(function (r) { return !r.classList.contains('is-hidden'); });
        var match = visible.filter(function (r) { return parseFloat(r.dataset.kva) >= need; })[0];
        if (match) {
          match.classList.add('is-match');
          var wrap = $('.table-wrap', specRoot);
          wrap.scrollTo({ top: match.offsetTop - 100, behavior: reduceMotion ? 'auto' : 'smooth' });
          result.innerHTML = 'Recommended: <b>' + match.dataset.kva + ' kVA</b> genset (prime ' + match.dataset.prime + ' kW) &mdash; ' + match.dataset.cons + ' at full load.';
        } else {
          result.innerHTML = 'Above ' + visible[visible.length - 1].dataset.kva + ' kVA we build customised or paralleled plants (up to 4,000 kVA). <a class="link-arrow" style="font-size:.95rem" href="services.html#quote">Ask our engineers</a>';
        }
      } else if (result) { result.textContent = 'Type your load to highlight the right model.'; }
    }
    if (kvaInput) kvaInput.addEventListener('input', applySpec);
    $$('[data-gas]', specRoot).forEach(function (b) {
      if (b.tagName !== 'BUTTON') return;
      b.addEventListener('click', function () {
        gasFilter = b.dataset.gas;
        $$('button[data-gas]', specRoot).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        applySpec();
      });
    });
  }

  /* ---------- Timeline progress line ---------- */
  var tl = $('.timeline');
  if (tl) {
    var line = $('.progress', tl);
    var tick = function () {
      var r = tl.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(Math.max((vh * 0.75 - r.top) / r.height, 0), 1);
      line.style.setProperty('--tl', p.toFixed(3));
    };
    window.addEventListener('scroll', tick, { passive: true }); tick();
  }

  /* ---------- Sub-nav active state (products page) ---------- */
  var subnav = $('.subnav');
  if (subnav && 'IntersectionObserver' in window) {
    var links = $$('a[href^="#"]', subnav);
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) {
            var on = l.getAttribute('href') === '#' + en.target.id;
            l.classList.toggle('is-active', on);
            if (on) l.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) sio.observe(s); });
  }

  /* ---------- WhatsApp widget ---------- */
  function waLink(num, text) { return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text); }
  var wa = $('.wa-float');
  if (wa) {
    var waBtn = $('.wa-btn', wa);
    waBtn.addEventListener('click', function () {
      var open = !wa.classList.contains('is-open');
      wa.classList.toggle('is-open', open);
      waBtn.setAttribute('aria-expanded', String(open));
      wa.classList.add('bubble-dismissed');
    });
    document.addEventListener('click', function (e) { if (!wa.contains(e.target)) { wa.classList.remove('is-open'); waBtn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var t = $('.toast'); if (!t) return;
    t.textContent = msg; t.classList.add('is-shown');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('is-shown'); }, 4200);
  }

  /* ---------- Forms: validate, then send via WhatsApp or email ---------- */
  // Static site: no server. Submissions open WhatsApp or the visitor's email app
  // with the enquiry pre-filled. See README to connect a form backend instead.
  var params = new URLSearchParams(location.search);
  $$('form[data-enquiry]').forEach(function (form) {
    var interest = $('[name="interest"]', form);
    if (interest && params.get('interest')) {
      var want = params.get('interest');
      var opt = $$('option', interest).filter(function (o) { return o.value === want || o.textContent === want; })[0];
      if (!opt) { opt = document.createElement('option'); opt.value = opt.textContent = want; interest.appendChild(opt); }
      interest.value = opt.value;
    }
    var via = 'wa';
    $$('button[data-via]', form).forEach(function (b) { b.addEventListener('click', function () { via = b.dataset.via; }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var wrap = f.closest('.field');
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) || (f.type === 'tel' && f.value.replace(/\D/g, '').length < 7);
        if (wrap) wrap.classList.toggle('has-error', bad);
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) { toast('Please complete the highlighted fields.'); return; }
      var data = new FormData(form);
      var lines = [];
      var labels = { name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', interest: 'Interest', location: 'Site location', load: 'Load / generator size', message: 'Message' };
      Object.keys(labels).forEach(function (k) { var v = data.get(k); if (v && String(v).trim()) lines.push(labels[k] + ': ' + String(v).trim()); });
      var subject = (form.dataset.enquiry || 'Website enquiry') + ' — ' + (data.get('company') || data.get('name') || 'pulitaenergy.com');
      var body = 'Hello Pulita team,\n\n' + lines.join('\n') + '\n\nSent from pulitaenergy.com';
      if (via === 'email') {
        window.location.href = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      } else {
        window.open(waLink(CONTACT.waNigeria, '*' + subject + '*\n\n' + body), '_blank', 'noopener');
      }
      form.classList.add('is-sent');
      toast('Thank you! Your enquiry is ready to send — our Lagos team typically replies within one business day.');
    });
    $$('input, select, textarea', form).forEach(function (f) { f.addEventListener('input', function () { var w = f.closest('.field'); if (w) w.classList.remove('has-error'); }); });
  });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
