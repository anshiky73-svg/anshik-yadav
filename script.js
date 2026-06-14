/* =============================================
   ANSHIK YADAV — Portfolio JS
   - Navbar scroll state
   - Mobile menu toggle
   - Scroll-triggered animations
   - Smooth active link highlighting
============================================= */

(function () {
  'use strict';

  /* ---- DOM refs ---- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const sections  = document.querySelectorAll('section[id]');

  /* =============================================
     1. NAVBAR — scroll shadow
  ============================================= */
  function handleNavbarScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* =============================================
     2. MOBILE MENU
  ============================================= */
  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  /* =============================================
     3. INTERSECTION OBSERVER — fade-in + timeline
  ============================================= */
  const fadeEls     = document.querySelectorAll('[data-fade]');
  const timelineEls = document.querySelectorAll('.timeline-item[data-animate]');
  const statCards   = document.querySelectorAll('.stat-card');
  const skillGroups = document.querySelectorAll('.skill-group');
  const projectCards = document.querySelectorAll('.project-card');

  // Add data-fade to cards so they animate in
  statCards.forEach(function (el) { el.setAttribute('data-fade', ''); });
  skillGroups.forEach(function (el, i) {
    el.setAttribute('data-fade', '');
    el.style.transitionDelay = (i * 60) + 'ms';
  });
  projectCards.forEach(function (el) { el.setAttribute('data-fade', ''); });

  // Generic fade observer
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-fade]').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // Timeline observer (staggered)
  const timelineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, i * 120);
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  timelineEls.forEach(function (el) {
    timelineObserver.observe(el);
  });

  /* =============================================
     4. ACTIVE NAV LINK on scroll
  ============================================= */
  function setActiveLink() {
    let currentId = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* =============================================
     5. HERO NAME — subtle mouse parallax
  ============================================= */
  const heroName = document.querySelector('.hero-name');
  const heroBg   = document.querySelector('.hero-bg-grid');

  if (heroName && heroBg) {
    document.addEventListener('mousemove', function (e) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;   // -1 to 1
      const dy = (e.clientY - cy) / cy;

      heroName.style.transform = 'translate(' + (dx * 4) + 'px, ' + (dy * 2) + 'px)';
      heroBg.style.transform   = 'translate(' + (dx * -8) + 'px, ' + (dy * -4) + 'px)';
    });
  }

  /* =============================================
     6. ANIMATED COUNTER for stat cards
  ============================================= */
  function animateCounter(el, target, duration) {
    const isText = isNaN(parseInt(target));
    if (isText) return;

    const start     = 0;
    const end       = parseInt(target);
    const startTime = performance.now();
    const suffix    = target.replace(String(end), '');

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(start + (end - start) * eased);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const numEl   = entry.target.querySelector('.stat-num');
          const origVal = numEl ? numEl.textContent : null;

          if (numEl && origVal) {
            animateCounter(numEl, origVal, 1200);
          }
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* =============================================
     7. BACK TO TOP smooth
  ============================================= */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     8. CURSOR GLOW on project cards
  ============================================= */
  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      card.style.background =
        'radial-gradient(300px circle at ' + x + 'px ' + y + 'px, rgba(124,110,230,0.06), var(--surface) 60%)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

})();