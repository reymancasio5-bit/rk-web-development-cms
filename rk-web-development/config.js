// ============================================================
//  RK WEB DEVELOPMENT — CONFIG.JS
//  Loads content from _data/*.json files.
//  Falls back to hardcoded defaults if any file fails to load.
//  DO NOT edit layout or sizes here — those live in styles.css.
// ============================================================

(function () {

  // ── HARDCODED DEFAULTS (safety net — site never breaks) ───
  const DEFAULTS = {
    site: { name: "RK Web Development", logo: "logo.png" },

    background: {
      type: "image",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
    },

    nav: {
      links: [
        { label: "Home",      href: "#home" },
        { label: "Services",  href: "#services" },
        { label: "Portfolio", href: "#portfolio" },
        { label: "About",     href: "#about" },
        { label: "Contact",   href: "#contact" }
      ]
    },

    hero: {
      badge:          "Available for New Projects",
      headline:       "I Build Websites That",
      headlineAccent: "Convert & Impress",
      subtext:        "RK Web Development crafts high-performance websites and digital experiences that elevate brands and drive real business results.",
      ctaPrimary:     { label: "Book a Call",  href: "#contact"   },
      ctaSecondary:   { label: "View My Work", href: "#portfolio"  },
      stats: [
        { value: "2",   label: "Projects Delivered" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "5★",  label: "Average Rating" }
      ],
      glassPanel: {
        tag:      "✦ Start Your Project",
        title:    "Let's Build Something Remarkable",
        subtitle: "Tell us what you need — we'll make it happen.",
        features: [
          { icon: "fa fa-bolt",        title: "Fast Turnaround", desc: "Most projects in 2–4 weeks" },
          { icon: "fa fa-paint-brush", title: "Bespoke Design",  desc: "No templates — 100% custom" },
          { icon: "fa fa-mobile",      title: "Mobile-First",    desc: "Perfect on every device"     },
          { icon: "fa fa-lock",        title: "Ongoing Support", desc: "30-day post-launch care"     }
        ],
        ctaLabel: "Book a Strategy Call",
        ctaHref:  "#contact"
      }
    },

    services: [
      { icon: "fa fa-code",        title: "Website Development",   description: "Custom-built websites from scratch using modern technologies. Pixel-perfect, fast, and scalable.",                features: ["React / Next.js", "WordPress", "E-Commerce"]          },
      { icon: "fa fa-paint-brush", title: "Website Redesign",      description: "Transform your outdated site into a modern, high-converting digital asset that stands out.",                    features: ["UI/UX Overhaul", "Brand Refresh", "Performance Boost"] },
      { icon: "fa fa-rocket",      title: "Landing Page Creation", description: "Laser-focused landing pages engineered to convert visitors into leads and paying customers.",                   features: ["CRO Optimized", "A/B Test Ready", "Fast Load Times"]   },
      { icon: "fa fa-tachometer",  title: "Website Optimization",  description: "Speed, SEO, and UX audits that boost your site performance and search engine rankings.",                        features: ["SEO Optimization", "Core Web Vitals", "Security Hardening"] }
    ],

    portfolio: [
      { title: "Tajonera Events and Services – A Signature by RDT", category: "Lights and Sound System", tag: "Website", description: "Premium event management brand dedicated to transforming visions into extraordinary moments.", image: "tajonera.png", gradient: "linear-gradient(135deg,#1a1a2e,#0f3460)", link: "https://reymancasio5-bit.github.io/tajonera-events-services/" },
      { title: "FlornHub", category: "CCTV Installation", tag: "Website", description: "Professional CCTV installation service offering end-to-end security systems and expert setup.",             image: "FlornHub.png", gradient: "linear-gradient(135deg,#2d1b00,#8b4513)",  link: "https://reymancasio5-bit.github.io/FlornHub/#" }
    ],

    about: {
      headline: "Passionate About Web Excellence",
      bio:      "I craft exceptional digital experiences that elevate brands and drive real results. With a passion for clean code and compelling design, I build websites that look stunning and perform well.",
      yearsExp: "1+",
      photo:    "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=1450&auto=format&fit=crop",
      highlights: [
        { icon: "fa fa-lightbulb-o", text: "1+ Years of Experience"       },
        { icon: "fa fa-globe",       text: "Clients Across Countries"      },
        { icon: "fa fa-trophy",      text: "Stunning Designs"              },
        { icon: "fa fa-shield",      text: "100% Satisfaction Guarantee"   }
      ]
    },

    contact: {
      headline:     "Ready to Start Your Project?",
      subtext:      "Let's discuss your vision and build something extraordinary together.",
      email:        "reymancasio.5@gmail.com",
      phone:        "+639638291756",
      calendlyLink: "https://calendly.com/reymancasio-5/30min",
      ctaLabel:     "Book a Call",
      socials: [
        { platform: "LinkedIn",  href: "https://www.linkedin.com/in/reyman-casio-112ba83aa?utm_source=share_via&utm_content=profile&utm_medium=member_android", icon: "fa fa-linkedin"  },
        { platform: "Facebook",  href: "https://web.facebook.com/reyman.casio.5",                                                                               icon: "fa fa-facebook"  },
        { platform: "GitHub",    href: "https://github.com/reymancasio5-bit",                                                                                   icon: "fa fa-github"    },
        { platform: "Instagram", href: "https://www.instagram.com/kim_arkeey?igsh=MWdqdHhzZXp5MHVwaw==",                                                       icon: "fa fa-instagram" }
      ]
    }
  };

  // ── JSON LOADER ───────────────────────────────────────────
  function loadJSON(path) {
    return fetch(path + '?v=' + Date.now())
      .then(r => { if (!r.ok) throw new Error('Not found: ' + path); return r.json(); })
      .catch(() => null); // return null on any error — we fall back to defaults
  }

  // ── BOOT: fetch all data files, then fire DOMContentLoaded ─
  const files = {
    site:       '_data/site.json',
    background: '_data/background.json',
    nav:        '_data/nav.json',
    hero:       '_data/hero.json',
    services:   '_data/services.json',
    portfolio:  '_data/portfolio.json',
    about:      '_data/about.json',
    contact:    '_data/contact.json'
  };

  // Block script.js from running until config is ready.
  // We do this by storing a promise on window and resolving it here.
  window.__configReady = Promise.all(
    Object.entries(files).map(([key, path]) =>
      loadJSON(path).then(data => ({ key, data }))
    )
  ).then(results => {
    const cfg = {};

    results.forEach(({ key, data }) => {
      if (data === null) {
        // File missing or broken — use full default for that section
        cfg[key] = DEFAULTS[key];
        console.warn('[config.js] Using default for:', key);
      } else {
        // Merge with defaults so missing keys inside a file still work
        if (Array.isArray(DEFAULTS[key])) {
          cfg[key] = Array.isArray(data) ? data : DEFAULTS[key];
        } else if (typeof DEFAULTS[key] === 'object') {
          cfg[key] = Object.assign({}, DEFAULTS[key], data);
        } else {
          cfg[key] = data;
        }
      }
    });

    // ── Build SITE_CONFIG in the same shape script.js expects ─
    window.SITE_CONFIG = {
      site:       cfg.site,
      background: cfg.background,
      nav:        cfg.nav,
      hero:       cfg.hero,
      services:   cfg.services,
      portfolio:  cfg.portfolio,
      about:      cfg.about,
      contact:    cfg.contact
    };

    return window.SITE_CONFIG;
  });

})();