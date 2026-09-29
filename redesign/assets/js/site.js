/* sensors.AFRICA redesign prototype — shared chrome + helpers.
   All readings are illustrative sample data; production binds to the
   sensors.AFRICA API (api.sensors.africa). */
(function () {
  'use strict';

  /* ---------- US EPA PM2.5 breakpoints → health band ---------- */
  window.saBand = function (v) {
    if (v <= 12) return { name: 'Good', color: '#15803d', bg: '#f0fdf4', i: 0, max: 12, min: 0 };
    if (v <= 35.4) return { name: 'Moderate', color: '#ca8a04', bg: '#fffbeb', i: 1, max: 35.4, min: 12 };
    if (v <= 55.4) return { name: 'Unhealthy for sensitive groups', color: '#c65d2e', bg: '#faf1ec', i: 2, max: 55.4, min: 35.4 };
    if (v <= 150.4) return { name: 'Unhealthy', color: '#dc2626', bg: '#fef2f2', i: 3, max: 150.4, min: 55.4 };
    if (v <= 250.4) return { name: 'Very unhealthy', color: '#7e22ce', bg: '#faf5ff', i: 4, max: 250.4, min: 150.4 };
    return { name: 'Hazardous', color: '#881337', bg: '#fff1f2', i: 5, max: 500, min: 250.4 };
  };

  /* Needle position across the 6-segment meter: ((bandIndex + fracWithinBand) / 6) · 100% */
  window.saNeedlePct = function (v) {
    var b = saBand(v);
    var frac = Math.min(1, Math.max(0, (v - b.min) / (b.max - b.min)));
    return (((b.i + frac) / 6) * 100).toFixed(1) + '%';
  };

  /* ---------- Sample network data (illustrative) ---------- */
  window.SA_NETWORK = [
    { city: 'Nairobi', country: 'Kenya', slug: 'nairobi', value: 38.4, lat: -1.2864, lng: 36.8172 },
    { city: 'Nakuru', country: 'Kenya', value: 21.7, lat: -0.3031, lng: 36.08 },
    { city: 'Kisumu', country: 'Kenya', value: 17.3, lat: -0.0917, lng: 34.768 },
    { city: 'Kampala', country: 'Uganda', slug: 'kampala', value: 45.2, lat: 0.3476, lng: 32.5825 },
    { city: 'Dar es Salaam', country: 'Tanzania', slug: 'dar-es-salaam', value: 28.9, lat: -6.7924, lng: 39.2083 },
    { city: 'Lagos', country: 'Nigeria', slug: 'lagos', value: 68.2, lat: 6.5244, lng: 3.3792 },
    { city: 'Abuja', country: 'Nigeria', value: 44.1, lat: 9.0765, lng: 7.3986 },
    { city: 'Ilorin', country: 'Nigeria', value: 52.6, lat: 8.4966, lng: 4.5421 },
    { city: 'Maiduguri', country: 'Nigeria', value: 161.0, lat: 11.8333, lng: 13.151 },
    { city: 'Port Harcourt', country: 'Nigeria', value: 74.5, lat: 4.8156, lng: 7.0498 },
    { city: 'Kano', country: 'Nigeria', slug: 'kano', value: 138.7, lat: 12.0022, lng: 8.592 },
    { city: 'Awka', country: 'Nigeria', value: 41.9, lat: 6.212, lng: 7.074 },
    { city: 'Akure', country: 'Nigeria', value: 33.5, lat: 7.2571, lng: 5.2058 },
    { city: 'Ado-Ekiti', country: 'Nigeria', value: 29.8, lat: 7.6233, lng: 5.221 },
    { city: 'Accra', country: 'Ghana', slug: 'accra', value: 47.3, lat: 5.6037, lng: -0.187 },
    { city: 'Kumasi', country: 'Ghana', value: 35.9, lat: 6.6885, lng: -1.6244 },
    { city: 'Lusaka', country: 'Zambia', slug: 'lusaka', value: 11.2, lat: -15.3875, lng: 28.3228 }
  ];

  /* ---------- Leaflet network map (CARTO light basemap) ---------- */
  window.saInitMap = function (elId, opts) {
    var el = document.getElementById(elId);
    if (!el || typeof L === 'undefined' || el._leaflet_id) return;
    opts = opts || {};
    var map = L.map(el, { center: [2.5, 18], zoom: 4, minZoom: 3, maxZoom: 10, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);
    SA_NETWORK.forEach(function (c) {
      var b = saBand(c.value);
      L.circleMarker([c.lat, c.lng], { radius: 8, color: '#ffffff', weight: 2, fillColor: b.color, fillOpacity: 0.95 })
        .addTo(map)
        .bindPopup('<div style="font-weight:700;font-size:15px">' + c.city + ', ' + c.country + '</div>' +
          '<div style="font-variant-numeric:tabular-nums">PM2.5 <strong>' + c.value.toFixed(1) + ' µg/m³</strong></div>' +
          '<div style="color:' + b.color + ';font-size:12px;margin-top:2px">&#9679; <span style="color:#525252">' + b.name + '</span></div>' +
          (opts.samplePopupNote === false ? '' : '<div style="color:#a3a3a3;font-size:11px;margin-top:4px">Sample reading — illustrative</div>'));
    });
    return map;
  };

  /* ---------- Shared header / footer ---------- */
  var NAV = [
    { slug: 'air', href: 'air.html', label: 'Air', live: true },
    { slug: 'water', href: 'water.html', label: 'Water' },
    { slug: 'sound', href: 'sound.html', label: 'Sound' },
    { slug: 'radiation', href: 'radiation.html', label: 'Radiation' },
    { slug: 'data', href: 'data.html', label: 'Data' },
    { slug: 'stories', href: 'stories.html', label: 'Stories' },
    { slug: 'about', href: 'about.html', label: 'About' }
  ];

  function navLinks(active, mobile) {
    return NAV.map(function (n) {
      var cls = (n.slug === active ? ' class="active"' : '');
      var cur = (n.slug === active ? ' aria-current="page"' : '');
      var dot = n.live ? '<span class="nav-live-dot"></span>' : '';
      var style = n.live && !mobile ? ' style="display:inline-flex;align-items:center;gap:7px"' : (n.live ? ' style="display:flex;align-items:center;gap:7px"' : '');
      return '<a href="' + n.href + '"' + cls + cur + style + '>' + dot + n.label + '</a>';
    }).join('\n      ');
  }

  function headerHTML(active) {
    return '' +
      '<div class="cfa-wrap">' +
      '<div class="cfa-header-inner" style="padding-left:0;padding-right:0">' +
      '<a class="cfa-brand" href="index.html"><img src="assets/img/logo-white.png" alt="sensors.AFRICA"></a>' +
      '<nav class="cfa-nav" aria-label="Primary">' + navLinks(active, false) + '</nav>' +
      '<div class="cfa-header-cta"><a class="btn primary" href="get-started.html" style="text-decoration:none">Get a sensor</a></div>' +
      '<button class="cfa-burger" aria-label="Toggle navigation" aria-expanded="false">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>' +
      '</button>' +
      '</div>' +
      '<nav class="cfa-mobile-nav" aria-label="Primary mobile">' + navLinks(active, true) +
      '<a href="get-started.html" style="color:#0B2AEA;font-weight:600">Get a sensor</a></nav>' +
      '</div>';
  }

  function footerCol(title, links) {
    return '<div><h4>' + title + '</h4><div class="sa-footer-links">' + links.map(function (l) {
      return '<a href="' + l[1] + '"' + (l[1].indexOf('http') === 0 ? ' rel="noopener"' : '') + '>' + l[0] + '</a>';
    }).join('') + '</div></div>';
  }

  function footerHTML(note) {
    return '' +
      '<div class="cfa-wrap">' +
      '<div class="sa-footer-grid">' +
      '<div class="sa-footer-brand">' +
      '<a href="index.html"><img src="assets/img/logo-white.png" alt="sensors.AFRICA"></a>' +
      '<p class="sa-footer-mission">A pan-African citizen science initiative using sensors to monitor air, water and sound pollution — giving citizens actionable information about their cities.</p>' +
      '</div>' +
      footerCol('Network', [['Air quality', 'air.html'], ['Water', 'water.html'], ['Sound', 'sound.html'], ['Radiation', 'radiation.html'], ['Open data', 'data.html']]) +
      footerCol('Community', [['Stories', 'stories.html'], ['About', 'about.html'], ['Get a sensor', 'get-started.html'], ['Twitter', 'https://twitter.com/sensorsAFRICA/'], ['Instagram', 'https://www.instagram.com/sensorsAFRICA/'], ['Medium', 'https://medium.com/@sensors.AFRICA'], ['GitHub', 'https://github.com/CodeForAfrica/sensors.AFRICA']]) +
      footerCol('Partners', [['Code for Africa', 'https://codeforafrica.org/'], ['innovateAFRICA', 'https://innovateafrica.fund/'], ['Luftdaten', 'https://luftdaten.info/']]) +
      '</div>' +
      '<div class="sa-footer-bottom">' +
      '<span>Incubated by Code for Africa · seed-funded by innovateAFRICA · powered by Luftdaten</span>' +
      '<span>' + note + '</span>' +
      '</div>' +
      '</div>';
  }

  /* ---------- Floating air-quality widget (homepage) ---------- */
  var WIDGET_CITIES = [
    { city: 'Nairobi', country: 'Kenya', slug: 'nairobi', value: 38.4 },
    { city: 'Kampala', country: 'Uganda', slug: 'kampala', value: 45.2 },
    { city: 'Lagos', country: 'Nigeria', slug: 'lagos', value: 68.2 },
    { city: 'Dar es Salaam', country: 'Tanzania', slug: 'dar-es-salaam', value: 28.9 },
    { city: 'Accra', country: 'Ghana', slug: 'accra', value: 47.3 },
    { city: 'Lusaka', country: 'Zambia', slug: 'lusaka', value: 11.2 }
  ];

  window.saInitWidget = function (cycleSeconds) {
    var host = document.getElementById('aq-widget-root');
    if (!host) {
      host = document.createElement('div');
      host.id = 'aq-widget-root';
      document.body.appendChild(host);
    }
    if (host.dataset.saWidget) return; // already initialised — avoid double timers
    host.dataset.saWidget = 'on';
    var idx = 0, visible = true, reappear = null;

    function render() {
      if (!visible) { host.innerHTML = ''; return; }
      var c = WIDGET_CITIES[idx % WIDGET_CITIES.length];
      var b = saBand(c.value);
      host.innerHTML = '' +
        '<aside class="aq-widget" aria-label="Air quality widget">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
        '<span style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-tertiary)">Air quality</span>' +
        '<button class="aq-widget-close" aria-label="Dismiss air quality widget">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
        '</button></div>' +
        '<div style="font:600 20px/1.2 var(--font-display);color:#000000">' + c.city + '<span style="color:var(--text-quaternary);font-weight:500">, ' + c.country + '</span></div>' +
        '<div style="display:flex;align-items:baseline;gap:8px;margin:10px 0 10px">' +
        '<span style="font:700 40px/1 var(--font-display);letter-spacing:-0.02em;color:' + b.color + '">' + c.value.toFixed(1) + '</span>' +
        '<span style="font-size:12px;color:var(--text-tertiary)">µg/m³ PM2.5</span></div>' +
        '<span style="display:inline-flex;align-items:center;font-size:13px;font-weight:600;color:' + b.color + ';background:' + b.bg + ';border-radius:9999px;padding:5px 12px">' + b.name + '</span>' +
        '<div class="band-meter"><span class="b0"></span><span class="b1"></span><span class="b2"></span><span class="b3"></span><span class="b4"></span><span class="b5"></span>' +
        '<span class="needle" style="left:' + saNeedlePct(c.value) + '"></span></div>' +
        '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-secondary)">' +
        '<a href="air.html?city=' + c.slug + '" style="font-size:14px;font-weight:500;color:#0B2AEA;text-decoration:none">Learn more about ' + c.city + '&rsquo;s air &rarr;</a>' +
        '</div></aside>';
      var closeBtn = host.querySelector('.aq-widget-close');
      if (closeBtn) closeBtn.addEventListener('click', dismiss);
    }

    function dismiss() {
      visible = false;
      render();
      clearTimeout(reappear);
      reappear = setTimeout(function () {
        idx = (idx + 1) % WIDGET_CITIES.length;
        visible = true;
        render();
      }, 15000);
    }

    setInterval(function () {
      if (visible) { idx = (idx + 1) % WIDGET_CITIES.length; render(); }
    }, (cycleSeconds || 8) * 1000);
    render();
  };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    var header = document.getElementById('site-header');
    if (header) {
      header.className = 'cfa-header';
      header.innerHTML = headerHTML(body.getAttribute('data-page') || '');
      var burger = header.querySelector('.cfa-burger');
      if (burger) burger.addEventListener('click', function () {
        var open = header.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var footer = document.getElementById('site-footer');
    if (footer) {
      footer.className = 'sa-footer';
      footer.innerHTML = footerHTML(body.getAttribute('data-footer-note') ||
        'Redesign prototype — all readings on this page are illustrative sample data.');
    }
    /* Floating AQ widget on every page; opt out with <body data-widget="off"> */
    if (body.getAttribute('data-widget') !== 'off') saInitWidget();
  });
})();
