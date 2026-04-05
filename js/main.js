/* ================================================================
   CLEARWATER PLUMBING — MAIN JAVASCRIPT
   ================================================================ */

(function () {
  'use strict';

  /* ── Sticky Header ──────────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Mobile Navigation ──────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const body      = document.body;

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      mobileNav.classList.toggle('open', open);
      body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', (e) => {
      if (
        mobileNav.classList.contains('open') &&
        !header.contains(e.target) &&
        !mobileNav.contains(e.target)
      ) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
        hamburger.focus();
      }
    });
  }

  /* ── Active Nav Link ────────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    // Strip any hash/query from href for comparison
    const hrefBase = href ? href.split('#')[0].split('?')[0] : '';
    if (hrefBase === currentPage || (currentPage === '' && hrefBase === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Animations ──────────────────────────────────────── */
  const animateEls = document.querySelectorAll('.animate-on-scroll');
  if (animateEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    animateEls.forEach((el, i) => {
      el.dataset.delay = (i % 4) * 80;
      observer.observe(el);
    });
  } else {
    animateEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── Problem Finder ─────────────────────────────────────────── */
  const problemData = {
    leak: {
      icon: '🔧',
      title: 'Leak Repairs',
      description: 'Our certified plumbers will locate and fix your leak fast — preventing water damage and reducing your bill. Most residential leaks are repaired same-day.',
      service: 'services.html#leak-repairs',
      price: 'From R350'
    },
    drain: {
      icon: '🚿',
      title: 'Drain Cleaning',
      description: 'Blocked drains cause bad odours and overflow risk. We use professional-grade equipment to clear blockages completely — not just temporarily.',
      service: 'services.html#drain-cleaning',
      price: 'From R500'
    },
    water: {
      icon: '🔥',
      title: 'Geyser / Hot Water Repair',
      description: 'No hot water? We diagnose and repair all geyser types — electric, solar, and gas. Fast turnaround with genuine parts and a workmanship guarantee.',
      service: 'services.html#geyser-repair',
      price: 'From R450'
    }
  };

  const problemBtns   = document.querySelectorAll('.problem-btn');
  const problemResult = document.querySelector('.problem-result');

  if (problemBtns.length && problemResult) {
    problemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.problem;
        const data = problemData[type];
        if (!data) return;

        problemBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Reset visibility first for re-animation
        problemResult.classList.remove('visible');

        setTimeout(() => {
          problemResult.innerHTML = `
            <div class="result-icon">${data.icon}</div>
            <div class="result-content">
              <h4>${data.title}</h4>
              <p>${data.description}</p>
              <div class="result-price" style="margin-bottom:1rem;font-size:0.85rem;color:var(--gray-500);">
                <strong style="color:var(--primary);font-size:1.1rem;">${data.price}</strong> &middot; Call for exact quote
              </div>
              <div class="result-actions">
                <a href="tel:+27121234567" class="btn btn-primary btn-sm">
                  <i class="fas fa-phone"></i> Call Now
                </a>
                <a href="${data.service}" class="btn btn-blue btn-sm">
                  Learn More <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          `;
          problemResult.classList.add('visible');
        }, 50);
      });
    });
  }

  /* ── FAQ Accordion ──────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item      = btn.closest('.faq-item');
      const isOpen    = item.classList.contains('open');
      const container = item.closest('.faq-list') || document;

      container.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── FAQ Category Filter ────────────────────────────────────── */
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      document.querySelectorAll('.faq-category-block').forEach(block => {
        const show = cat === 'all' || block.dataset.category === cat;
        block.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Form Validation & Submission ──────────────────────────── */
  function validateField(field) {
    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.remove();
    field.classList.remove('invalid');

    if (field.hasAttribute('required') && !field.value.trim()) {
      field.classList.add('invalid');
      const err = document.createElement('span');
      err.className = 'field-error';
      err.textContent = 'This field is required.';
      field.parentElement.appendChild(err);
      return false;
    }

    if (field.type === 'tel' && field.value.trim()) {
      const cleaned = field.value.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{9,15}$/.test(cleaned)) {
        field.classList.add('invalid');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'Please enter a valid phone number.';
        field.parentElement.appendChild(err);
        return false;
      }
    }

    return true;
  }

  document.querySelectorAll('.contact-form, .quick-form').forEach(form => {
    // Live validation on blur
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.hasAttribute('required') || field.type === 'tel') {
          validateField(field);
        }
      });
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all required fields
      let valid = true;
      form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (!validateField(field)) valid = false;
      });
      // Also validate phone even if not required
      form.querySelectorAll('input[type="tel"]').forEach(field => {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate async send
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        btn.style.background = '#16A34A';
        btn.style.borderColor = '#16A34A';

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
          form.reset();
          // Clear any remaining error states
          form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
          form.querySelectorAll('.field-error').forEach(el => el.remove());
        }, 3000);
      }, 1200);
    });
  });

  /* ── Counter Animation (with suffix support) ────────────────── */
  function animateCounter(el, target, suffix, duration = 1800) {
    const isDecimal = target % 1 !== 0;
    const start     = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = target * ease;

      el.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.floor(current).toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => obs.observe(el));
  }

  /* ── Back to Top Button ─────────────────────────────────────── */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth Scroll for anchor links ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (header?.offsetHeight || 72) + 20;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
