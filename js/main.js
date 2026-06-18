/* ═══════════════════════════════════════════════════════════════
   FRUTOS SECOS EL RINCÓN — JAVASCRIPT
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     UTILIDAD: DEBOUNCE
  ───────────────────────────────────────────── */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ─────────────────────────────────────────────
     HEADER SCROLL
  ───────────────────────────────────────────── */
  const header = document.getElementById('header');
  const scrollHandler = debounce(function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, 10);

  window.addEventListener('scroll', scrollHandler, { passive: true });

  /* ─────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  menuToggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────────────────────────────────
     THEME TOGGLE (con a11y mejorada)
  ───────────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function getSavedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // localStorage no disponible (modo privado, etc.)
    }
  }

  const savedTheme = getSavedTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(isDark) {
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
      html.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
  }

  // Inicializar tema
  const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  applyTheme(initialDark);

  themeToggle.addEventListener('click', function () {
    const isDark = html.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
    saveTheme(isDark ? 'light' : 'dark');
  });

  // Escuchar cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!getSavedTheme()) {
      applyTheme(e.matches);
    }
  });

  /* ─────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     ACTIVE NAV HIGHLIGHTING
  ───────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ─────────────────────────────────────────────
     PARALLAX Y MOVIMIENTO DEL MOUSE (HERO)
  ───────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  const floatingItems = document.querySelectorAll('.floating-item');
  const mascotWrapper = document.querySelector('.hero-mascot-wrapper');
  const scrollIndicator = document.getElementById('scrollIndicator');
  var ticking = false;

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;

    // Ocultar indicador de scroll
    if (scrollIndicator) {
      if (scrolled > 80) {
        scrollIndicator.style.opacity = '0';
      } else {
        scrollIndicator.style.opacity = String((1 - scrolled / 80) * 0.85);
      }
    }

    if (scrolled < window.innerHeight) {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (heroBg) {
            heroBg.style.transform = 'translate3d(0, ' + (scrolled * 0.28) + 'px, 0)';
          }
          if (mascotWrapper) {
            mascotWrapper.style.transform = 'translate3d(0, ' + (scrolled * 0.08) + 'px, 0)';
          }
          floatingItems.forEach(function (item) {
            var speed = parseFloat(item.getAttribute('data-speed')) || 0.1;
            var currentMouseX = parseFloat(item.getAttribute('data-mx')) || 0;
            var currentMouseY = parseFloat(item.getAttribute('data-my')) || 0;
            item.style.transform = 'translate3d(' + currentMouseX + 'px, ' + (scrolled * speed + currentMouseY) + 'px, 0)';
          });
          ticking = false;
        });
        ticking = true;
      }
    }
  }, { passive: true });

  // Parallax de ratón (solo escritorio)
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) {
    document.addEventListener('mousemove', function (e) {
      var x = (window.innerWidth / 2 - e.clientX) / 45;
      var y = (window.innerHeight / 2 - e.clientY) / 45;

      floatingItems.forEach(function (item) {
        var depth = parseFloat(item.getAttribute('data-depth')) || 1.5;
        var mx = x * depth;
        var my = y * depth;
        item.setAttribute('data-mx', mx);
        item.setAttribute('data-my', my);

        var scrolled = window.scrollY;
        var speed = parseFloat(item.getAttribute('data-speed')) || 0.1;
        item.style.transform = 'translate3d(' + mx + 'px, ' + (scrolled * speed + my) + 'px, 0)';
      });
    });
  }

  /* ─────────────────────────────────────────────
     FOOTER: AÑO DINÁMICO
  ───────────────────────────────────────────── */
  var yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ─────────────────────────────────────────────
     BÚSQUEDA DE PRODUCTOS
  ───────────────────────────────────────────── */
  var searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function () {
      var query = this.value.toLowerCase().trim();
      var allCards = document.querySelectorAll('.product-card');
      var categories = document.querySelectorAll('.products-category');
      var noResults = document.getElementById('productsNoResults');

      var visibleCount = 0;

      categories.forEach(function (cat) {
        var catCards = cat.querySelectorAll('.product-card');
        var catVisible = 0;

        catCards.forEach(function (card) {
          var name = card.getAttribute('data-name') || '';
          if (!query || name.indexOf(query) !== -1) {
            card.classList.remove('hidden');
            catVisible++;
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
        });

        // Mostrar/ocultar categoría entera
        if (catVisible === 0) {
          cat.style.display = 'none';
        } else {
          cat.style.display = '';
        }
      });

      // Mostrar/ocultar mensaje de "sin resultados"
      if (noResults) {
        if (visibleCount === 0 && query) {
          noResults.classList.add('visible');
        } else {
          noResults.classList.remove('visible');
        }
      }
    }, 200));
  }

  /* ─────────────────────────────────────────────
     FAQ ACCORDION
  ───────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.parentElement;
      var isActive = item.classList.contains('active');

      // Cerrar todas
      document.querySelectorAll('.faq-item.active').forEach(function (el) {
        el.classList.remove('active');
      });

      // Abrir la clickeada (si no estaba ya abierta)
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

})();
