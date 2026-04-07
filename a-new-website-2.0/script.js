(function () {
  'use strict';

  // ──────────────────────────────────────────
  // Preloader - Book Network
  // ──────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  const books = document.querySelectorAll('.book');
  const lineCanvas = document.getElementById('preloader-lines');
  var lineCtx = lineCanvas ? lineCanvas.getContext('2d') : null;

  document.body.style.overflow = 'hidden';

  function sizeLineCanvas() {
    if (!lineCanvas) return;
    var dpr = window.devicePixelRatio || 1;
    lineCanvas.width = window.innerWidth * dpr;
    lineCanvas.height = window.innerHeight * dpr;
    lineCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getBookCenter(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function drawNetwork(progress) {
    if (!lineCtx) return;
    lineCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var centers = [];
    books.forEach(function (b) { centers.push(getBookCenter(b)); });

    var pairs = [[0, 1], [1, 7], [7, 2], [2, 6], [6, 4], [4, 3], [3, 5], [5, 0]];
    pairs.forEach(function (pair, i) {
      var seg = 1 / pairs.length;
      var start = i * seg;
      var p = Math.max(0, Math.min(1, (progress - start) / seg));
      if (p <= 0) return;

      var a = centers[pair[0]];
      var b = centers[pair[1]];
      var ex = a.x + (b.x - a.x) * p;
      var ey = a.y + (b.y - a.y) * p;

      lineCtx.beginPath();
      lineCtx.moveTo(a.x, a.y);
      lineCtx.lineTo(ex, ey);
      lineCtx.strokeStyle = 'rgba(255,0,0,0.45)';
      lineCtx.lineWidth = 1.5;
      lineCtx.stroke();
    });

    centers.forEach(function (c, i) {
      if (i === 0 || progress > (i - 1) / pairs.length) {
        lineCtx.beginPath();
        lineCtx.arc(c.x, c.y, 3, 0, Math.PI * 2);
        lineCtx.fillStyle = 'rgba(255,0,0,0.65)';
        lineCtx.fill();
      }
    });
  }

  window.addEventListener('load', function () {
    sizeLineCanvas();

    var delays = [];
    var cumulative = 200;
    var gap = 550;
    var decay = 0.72;
    for (var i = 0; i < books.length; i++) {
      delays.push(cumulative);
      cumulative += Math.round(gap);
      gap *= decay;
    }
    var allVisibleAt = cumulative;

    books.forEach(function (book, i) {
      setTimeout(function () { book.classList.add('visible'); }, delays[i]);
    });

    setTimeout(function () {
      var lineStart = performance.now();
      var lineDuration = 1100;

      function animateLines(now) {
        var p = Math.min(1, (now - lineStart) / lineDuration);
        drawNetwork(p);
        if (p < 1) requestAnimationFrame(animateLines);
      }
      requestAnimationFrame(animateLines);
    }, allVisibleAt + 150);

    setTimeout(function () {
      books.forEach(function (b) { b.classList.add('fade-out'); });
      var fadeLine = performance.now();
      var fadeDur = 600;

      function fadeLines(now) {
        var p = 1 - Math.min(1, (now - fadeLine) / fadeDur);
        lineCtx.globalAlpha = p;
        drawNetwork(1);
        lineCtx.globalAlpha = 1;
        if (p > 0) requestAnimationFrame(fadeLines);
      }
      requestAnimationFrame(fadeLines);
    }, allVisibleAt + 1600);

    setTimeout(function () {
      preloader.classList.add('done');
      document.body.style.overflow = '';
      revealHero();
      setTimeout(function () { preloader.style.display = 'none'; }, 1000);
    }, allVisibleAt + 2300);
  });

  // ──────────────────────────────────────────
  // Hero reveal after preloader
  // ──────────────────────────────────────────
  function revealHero() {
    const heroEls = document.querySelectorAll('.hero .reveal-up');
    heroEls.forEach((el) => {
      const delay = (parseInt(el.dataset.delay) || 0) * 120;
      setTimeout(() => el.classList.add('revealed'), delay + 200);
    });
  }

  // ──────────────────────────────────────────
  // Custom Cursor
  // ──────────────────────────────────────────
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveEls = 'a, button, .project-card, .skill-item, .tag, .magnetic';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveEls)) {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveEls)) {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      }
    });
  }

  // ──────────────────────────────────────────
  // Scroll Progress Bar
  // ──────────────────────────────────────────
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ──────────────────────────────────────────
  // Navigation scroll effect + active link
  // ──────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ──────────────────────────────────────────
  // Scroll Event (throttled)
  // ──────────────────────────────────────────
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ──────────────────────────────────────────
  // Scroll Reveal (IntersectionObserver)
  // ──────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = (parseInt(entry.target.dataset.delay) || 0) * 120;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ──────────────────────────────────────────
  // Number Counter Animation
  // ──────────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(2);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(2) : target;
      }
    }

    requestAnimationFrame(update);
  }

  // ──────────────────────────────────────────
  // Smooth scroll for nav links
  // ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ──────────────────────────────────────────
  // Magnetic effect on interactive elements
  // ──────────────────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const magneticEls = document.querySelectorAll('.magnetic');

    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 400);
      });
    });
  }

  // ──────────────────────────────────────────
  // Hero mouse parallax
  // ──────────────────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const heroContent = document.querySelector('.hero-content');
    const hero = document.querySelector('.hero');

    if (hero && heroContent) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroContent.style.transform =
          'translate(' + (x * 20) + 'px, ' + (y * 10) + 'px)';
      });

      hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
      });
    }
  }

  // ──────────────────────────────────────────
  // Stagger skill items on reveal
  // ──────────────────────────────────────────
  const skillGroups = document.querySelectorAll('.skill-group');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.skill-item');
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 50);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  skillGroups.forEach((g) => skillObserver.observe(g));

  // ──────────────────────────────────────────
  // Ticker pause on hover (backup for CSS)
  // ──────────────────────────────────────────
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.querySelector('.ticker-track').style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.querySelector('.ticker-track').style.animationPlayState = 'running';
    });
  }

  // ──────────────────────────────────────────
  // Dynamic time in hero overline
  // ──────────────────────────────────────────
  const timeEl = document.getElementById('hero-time');
  if (timeEl) {
    function updateTime() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = h + ':' + m + ':' + s;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  // ──────────────────────────────────────────
  // Globe Visualization
  // ──────────────────────────────────────────
  (function initGlobe() {
    var cvs = document.getElementById('globe-canvas');
    if (!cvs) return;

    var ctx = cvs.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W, H, R;
    var RAD = Math.PI / 180;
    var cLat = 20 * RAD;
    var cLon = 115 * RAD;

    var cities = [
      { lat: 43 * RAD, lon: -89 * RAD, label: 'US' },
      { lat: 37.5 * RAD, lon: 127 * RAD, label: 'KR' },
      { lat: 1.3 * RAD, lon: 103.8 * RAD, label: 'SG' }
    ];

    var arcPairs = [[0, 1], [1, 2], [0, 2]];
    var arcs = arcPairs.map(function (pair) {
      return greatCircle(
        cities[pair[0]].lat, cities[pair[0]].lon,
        cities[pair[1]].lat, cities[pair[1]].lon, 80
      );
    });

    function greatCircle(lat1, lon1, lat2, lon2, n) {
      var pts = [];
      var cosD = Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      var d = Math.acos(Math.max(-1, Math.min(1, cosD)));
      if (d < 0.001) return [{ lat: lat1, lon: lon1 }];
      for (var i = 0; i <= n; i++) {
        var f = i / n;
        var A = Math.sin((1 - f) * d) / Math.sin(d);
        var B = Math.sin(f * d) / Math.sin(d);
        var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        var z = A * Math.sin(lat1) + B * Math.sin(lat2);
        pts.push({
          lat: Math.atan2(z, Math.sqrt(x * x + y * y)),
          lon: Math.atan2(y, x)
        });
      }
      return pts;
    }

    function proj(lat, lon) {
      var x = R * Math.cos(lat) * Math.sin(lon - cLon);
      var y = -R * (Math.cos(cLat) * Math.sin(lat) -
                     Math.sin(cLat) * Math.cos(lat) * Math.cos(lon - cLon));
      var vis = Math.sin(lat) * Math.sin(cLat) +
                Math.cos(lat) * Math.cos(cLat) * Math.cos(lon - cLon) > 0;
      return { x: W / 2 + x, y: H / 2 + y, vis: vis };
    }

    function resize() {
      var rect = cvs.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.4;
    }

    resize();
    window.addEventListener('resize', resize);

    function drawGrid() {
      ctx.lineWidth = 0.5;
      var lat, lon, i, p, started, steps = 120;

      for (lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        started = false;
        for (i = 0; i <= steps; i++) {
          p = proj(lat * RAD, (i / steps) * 2 * Math.PI);
          if (p.vis) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else { started = false; }
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.stroke();
      }

      for (lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        started = false;
        for (i = 0; i <= steps; i++) {
          p = proj((i / steps) * Math.PI - Math.PI / 2, lon * RAD);
          if (p.vis) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else { started = false; }
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.stroke();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2;

      var atmo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.12);
      atmo.addColorStop(0, 'rgba(255,255,255,0.03)');
      atmo.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      drawGrid();

      var now = Date.now();

      arcs.forEach(function (pts, ai) {
        ctx.beginPath();
        var started = false;
        pts.forEach(function (pt) {
          var p = proj(pt.lat, pt.lon);
          if (p.vis) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else { started = false; }
        });
        ctx.strokeStyle = 'rgba(255,0,0,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        var period = 3500;
        var t = ((now + ai * 1166) % period) / period;
        var idx = Math.floor(t * (pts.length - 1));
        var tp = pts[idx];
        var pp = proj(tp.lat, tp.lon);
        if (pp.vis) {
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,0,0,0.8)';
          ctx.fill();
        }
      });

      var pulse = 0.5 + 0.5 * Math.sin(now * 0.003);

      cities.forEach(function (city) {
        var p = proj(city.lat, city.lon);
        if (!p.vis) return;

        var glowR = 10 + pulse * 4;
        var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0, 'rgba(255,0,0,0.3)');
        glow.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        var dotR = 3 + pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();

        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(city.label, p.x + 10, p.y);
      });

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cLon += 0.002;
      }
      requestAnimationFrame(draw);
    }

    draw();
  })();

})();
