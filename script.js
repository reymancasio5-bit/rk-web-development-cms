// ============================================================
//  RK WEB DEVELOPMENT — SCRIPT.JS
//  Waits for config.js to finish loading all JSON data files
//  before initialising any section. Layout/sizes are CSS-only.
// ============================================================

(window.__configReady || Promise.resolve(window.SITE_CONFIG))
  .then(function () { init(); })
  .catch(function () { init(); }); // always init, even if something fails

function init() {

  if (typeof SITE_CONFIG === 'undefined') {
    console.error('SITE_CONFIG not found. Ensure config.js loads before script.js.');
    return;
  }

  // ── BACKGROUND ────────────────────────────────────────────
  const bgContainer = document.getElementById('bg-media');
  const bg   = SITE_CONFIG.background || {};
  const type = bg.type || 'image';
  const src  = bg.src  || '';

  if (type === 'video') {
    const video = document.createElement('video');
    video.src = src; video.autoplay = true; video.muted = true;
    video.loop = true; video.playsInline = true;
    bgContainer.appendChild(video);
  } else if (src) {
    const img = document.createElement('img');
    img.src = src; img.alt = 'Background';
    bgContainer.appendChild(img);
  }

  // ── NAV ───────────────────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const navList   = document.getElementById('nav-links-list');
  const mobileNav = document.getElementById('mobile-nav');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  (SITE_CONFIG.nav.links || []).forEach((link, i) => {
    const links = SITE_CONFIG.nav.links;

    // Desktop
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = link.href; a.textContent = link.label;
    if (i === links.length - 1) a.classList.add('nav-cta');
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
    li.appendChild(a); navList.appendChild(li);

    // Mobile
    const ma = document.createElement('a');
    ma.href = link.href; ma.textContent = link.label;
    ma.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
    mobileNav.appendChild(ma);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  const closeBtn = document.getElementById('mobile-nav-close');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });

  // ── HERO ──────────────────────────────────────────────────
  const h = SITE_CONFIG.hero;

  document.getElementById('hero-badge').textContent           = h.badge          || '';
  document.getElementById('hero-headline').textContent        = h.headline        || '';
  document.getElementById('hero-headline-accent').textContent = h.headlineAccent  || '';
  document.getElementById('hero-sub').textContent             = h.subtext         || '';

  const pb = document.getElementById('hero-cta-primary');
  pb.textContent = (h.ctaPrimary  || {}).label || ''; pb.href = (h.ctaPrimary  || {}).href || '#';

  const sb = document.getElementById('hero-cta-secondary');
  sb.textContent = (h.ctaSecondary || {}).label || ''; sb.href = (h.ctaSecondary || {}).href || '#';

  const statsEl = document.getElementById('hero-stats');
  (h.stats || []).forEach(s => {
    const div = document.createElement('div');
    div.className = 'stat-item';
    div.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
    statsEl.appendChild(div);
  });

  // Glass panel (populated from JSON so CMS can edit it)
  const gp = h.glassPanel || {};
  const panelTag = document.querySelector('.panel-tag');
  const panelTitle = document.querySelector('.panel-title');
  const panelSub = document.querySelector('.panel-subtitle');
  const panelCta = document.querySelector('.panel-cta');

  if (panelTag   && gp.tag)      panelTag.textContent   = gp.tag;
  if (panelTitle && gp.title)    panelTitle.innerHTML   = gp.title.replace('Remarkable', '<br>Remarkable');
  if (panelSub   && gp.subtitle) panelSub.textContent   = gp.subtitle;
  if (panelCta   && gp.ctaLabel) { panelCta.textContent = gp.ctaLabel + ' '; panelCta.href = gp.ctaHref || '#contact'; const i = document.createElement('i'); i.className = 'fa fa-arrow-right'; panelCta.appendChild(i); }

  // Glass panel features — clear existing and re-render from JSON
  const existingFeatures = document.querySelectorAll('.panel-feature');
  existingFeatures.forEach(f => f.remove());

  const featuresInsertBefore = panelCta;
  (gp.features || []).forEach(feat => {
    const div = document.createElement('div');
    div.className = 'panel-feature';
    div.innerHTML = `
      <span class="panel-feature-icon"><i class="${feat.icon}"></i></span>
      <div class="panel-feature-text">
        <strong>${feat.title}</strong>
        <span>${feat.desc}</span>
      </div>`;
    featuresInsertBefore.parentNode.insertBefore(div, featuresInsertBefore);
  });

  // ── SERVICES ──────────────────────────────────────────────
  const servicesGrid = document.getElementById('services-grid');
  (SITE_CONFIG.services || []).forEach((svc, i) => {
    const card = document.createElement('div');
    card.className = 'service-card glass fade-in';
    card.style.animationDelay = (i * 0.1) + 's';
    const feats = (svc.features || []).map(f => `<span class="service-tag">${f}</span>`).join('');
    card.innerHTML = `
      <div class="service-icon-wrap"><i class="${svc.icon}"></i></div>
      <h3 class="service-title">${svc.title}</h3>
      <p class="service-desc">${svc.description}</p>
      <div class="service-features">${feats}</div>`;
    servicesGrid.appendChild(card);
  });

  // ── PORTFOLIO ─────────────────────────────────────────────
  const portfolioGrid = document.getElementById('portfolio-grid');
  (SITE_CONFIG.portfolio || []).forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    // Always use background-image so aspect-ratio is preserved by CSS
    const bgStyle = proj.image
      ? `background:url('${proj.image}') center/cover no-repeat`
      : `background:${proj.gradient || '#111'}`;
    card.innerHTML = `
      <div class="project-bg" style="${bgStyle}"></div>
      <div class="project-overlay">
        <span class="project-tag">${proj.tag || ''}</span>
        <div class="project-category">${proj.category}</div>
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <a href="${proj.link}" class="project-link" target="_blank" rel="noopener">View Project <i class="fa fa-arrow-right"></i></a>
      </div>`;
    portfolioGrid.appendChild(card);
  });

  // ── ABOUT ─────────────────────────────────────────────────
  const ab = SITE_CONFIG.about;
  document.getElementById('about-headline').textContent = ab.headline || '';
  document.getElementById('about-desc').textContent     = ab.bio      || '';

  // About photo — swap src without touching CSS sizing
  if (ab.photo) {
    const aboutImg = document.querySelector('.about-img-wrap img');
    if (aboutImg) aboutImg.src = ab.photo;
  }

  // Years badge
  const yr = document.getElementById('about-years');
  if (yr) yr.textContent = ab.yearsExp || '1+';

  const highlightsEl = document.getElementById('about-highlights');
  (ab.highlights || []).forEach(hl => {
    const div = document.createElement('div');
    div.className = 'highlight-item';
    div.innerHTML = `<i class="${hl.icon} hi-icon"></i><span>${hl.text}</span>`;
    highlightsEl.appendChild(div);
  });

  // ── CONTACT ───────────────────────────────────────────────
  const c = SITE_CONFIG.contact;
  document.getElementById('contact-headline').textContent    = c.headline || '';
  document.getElementById('contact-subheadline').textContent = c.subtext  || '';

  const emailEl = document.getElementById('contact-email');
  emailEl.textContent = c.email; emailEl.href = `mailto:${c.email}`;

  const phoneEl = document.getElementById('contact-phone');
  phoneEl.textContent = c.phone; phoneEl.href = `tel:${(c.phone || '').replace(/\D/g, '')}`;

  const bookingBtn = document.getElementById('booking-cta');
  bookingBtn.innerHTML = `<i class="fa fa-calendar"></i>&nbsp; ${c.ctaLabel || 'Book a Call'}`;
  bookingBtn.href = c.calendlyLink || '#';

  // Socials
  ['socials', 'footer-socials'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    (c.socials || []).forEach(s => {
      const a = document.createElement('a');
      a.className = 'social-btn'; a.href = s.href;
      a.title = s.platform; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = `<i class="${s.icon}"></i>`;
      el.appendChild(a);
    });
  });

  // ── FORM — Web3Forms ──────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = contactForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;

      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Sending...';
      btn.disabled  = true;

      const formData = new FormData(contactForm);
      const data     = Object.fromEntries(formData);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body:    JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
          btn.innerHTML = '<i class="fa fa-check"></i>&nbsp; Message Sent!';
          btn.style.background = '#2d8a4e';
          contactForm.reset();
          setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
        } else {
          btn.innerHTML = '<i class="fa fa-times"></i>&nbsp; Failed. Try Again.';
          btn.style.background = '#8a2d2d';
          setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3000);
        }
      } catch {
        btn.innerHTML = '<i class="fa fa-times"></i>&nbsp; Error. Try Again.';
        btn.style.background = '#8a2d2d';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3000);
      }
    });
  }

  // ── INTERSECTION OBSERVER (fade-in) ───────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 50);

  // ── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}