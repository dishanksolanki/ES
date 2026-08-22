/* =========================================================
   MedExpert — Front Page Behaviour
   Only front-page interactions live here: mobile nav, scroll
   reveals, and the placeholder modal for "Start Health
   Assessment". The real assessment flow will be wired up in
   pages/assessment.html + data/medical-rules.js later — see
   the TODO near the bottom.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollReveal();
  initAssessmentPlaceholder();
  initYear();
});

/* ---------------------------------------------------------
   Mobile navigation toggle
   --------------------------------------------------------- */
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (!header || !toggle) return;

  const closeMenu = () => {
    header.classList.remove('menu-open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Close mobile menu if the viewport grows back to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

/* ---------------------------------------------------------
   Scroll-triggered reveal animation
   --------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   "Start Health Assessment" — temporary placeholder
   Replace this with a real navigation to pages/assessment.html
   once the questionnaire exists.
   --------------------------------------------------------- */
function initAssessmentPlaceholder() {
  const triggers = document.querySelectorAll('[data-start-assessment]');
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = document.querySelector('[data-close-modal]');

  if (!overlay) return;

  const openModal = (e) => {
    e.preventDefault();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  triggers.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn && closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
}

/* ---------------------------------------------------------
   Footer year
   --------------------------------------------------------- */
function initYear() {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   TODO (future modules — not implemented yet):
   - Wire data-start-assessment buttons to pages/assessment.html
   - Load data/medical-rules.js as the rule-based knowledge base
   - Build the questionnaire state machine (age, sex, symptoms,
     duration, severity, follow-ups)
   - Build the inference engine that evaluates rules against
     answers and produces a risk level + explanation
   - Build pages/result.html to render the assessment output
   --------------------------------------------------------- */
