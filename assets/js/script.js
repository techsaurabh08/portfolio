/* =============================================
   PORTFOLIO — script.js
   ============================================= */

/* ---- DOM ELEMENTS ---- */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navMenu      = document.getElementById('nav-menu');
const navLinks     = document.querySelectorAll('.nav-link');
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = document.getElementById('theme-icon');
const backToTop    = document.getElementById('back-to-top');
const typedEl      = document.getElementById('typed-text');
const contactForm  = document.getElementById('contact-form');
const formNotice   = document.getElementById('form-notice');
const fallbackLink = document.getElementById('mailto-fallback-link');
const yearEl       = document.getElementById('year');
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

/* =============================================
   1. DYNAMIC YEAR IN FOOTER
   ============================================= */
yearEl.textContent = new Date().getFullYear();

/* =============================================
   2. NAVBAR — SCROLL EFFECT & ACTIVE LINK (OPTIMIZED)
   ============================================= */
const sections = document.querySelectorAll('section[id]');
// Pre-cache nav links mapped to section IDs to eliminate repeated DOM queries on scroll
const sectionNavMap = Array.from(sections).map(section => {
  const id = section.getAttribute('id');
  return {
    section,
    id,
    link: document.querySelector(`.nav-link[href="#${id}"]`)
  };
});

let isScrollTicking = false;

function onScroll() {
  // --- Phase 1: DOM Measurement & Calculation ---
  const scrollY = window.scrollY;
  const isNavbarScrolled = scrollY > 50;
  const isBackToTopVisible = scrollY > 400;

  // Find active section using 120px offset
  let activeId = null;
  for (let i = 0; i < sectionNavMap.length; i++) {
    const { section, id } = sectionNavMap[i];
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      activeId = id;
      break;
    }
  }

  // --- Phase 2: DOM Updates (Batched mutations) ---
  navbar.classList.toggle('scrolled', isNavbarScrolled);
  backToTop.classList.toggle('visible', isBackToTopVisible);

  sectionNavMap.forEach(({ id, link }) => {
    if (link) {
      link.classList.toggle('active', id === activeId);
    }
  });

  isScrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!isScrollTicking) {
    window.requestAnimationFrame(onScroll);
    isScrollTicking = true;
  }
}, { passive: true });

/* =============================================
   3. HAMBURGER MENU (ACCESSIBLE & RELIABLE)
   ============================================= */
function openMenu() {
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  navMenu.classList.add('open');
  document.body.classList.add('menu-open');
}

function closeMenu() {
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
}

function isMenuOpen() {
  return navMenu.classList.contains('open');
}

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  if (isMenuOpen()) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close menu when any nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close menu on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen()) {
    closeMenu();
    hamburger.focus();
  }
});

// Close menu when clicking outside of navMenu and hamburger
document.addEventListener('click', (e) => {
  if (isMenuOpen() && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }
});

/* =============================================
   4. DARK / LIGHT MODE TOGGLE
   ============================================= */
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* =============================================
   5. TYPING ANIMATION
   ============================================= */
const roles = [
  'Full Stack Developer',
  'Django & PHP Developer',
  'Problem Solver'
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingSpeed = 120;

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Type characters
    typedEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Pause at end of word before deleting
      isDeleting = true;
      typingSpeed = 1800;
    } else {
      typingSpeed = 100 + Math.random() * 50; // Natural variation
    }
  } else {
    // Delete characters
    typedEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start typing after a short delay
setTimeout(typeEffect, 600);

/* =============================================
   6. SCROLL REVEAL — FADE IN ANIMATION
   ============================================= */
// Add fade-in class to animatable elements
const animatableSelectors = [
  '.section-header',
  '.about-image',
  '.about-content',
  '.education-card',
  '.skill-category',
  '.project-card',
  '.contact-info',
  '.contact-form'
];

animatableSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-in');
  });
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // Animate once
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* =============================================
   7. SKILL BAR ANIMATION
   ============================================= */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill      = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width  = targetWidth + '%';
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.5 }
);

skillFills.forEach(fill => skillObserver.observe(fill));

/* =============================================
   8. COUNTER ANIMATION (About Stats)
   ============================================= */
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  let current   = 0;
  const step    = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = current;
    }
  }, 30);
}

/* =============================================
   9. PROJECT FILTER (ROBUST CSS CLASS TOGGLE)
   ============================================= */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active visual and accessibility states
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const matches  = filter === 'all' || category === filter;

      if (matches) {
        card.classList.remove('is-filtered-out');
      } else {
        card.classList.add('is-filtered-out');
      }
    });
  });
});

/* =============================================
   10. CONTACT FORM VALIDATION & MAILTO DISPATCH
   ============================================= */
function validateField(id, errorId, condition, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);

  if (condition(field.value)) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    return false;
  } else {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    error.textContent = '';
    return true;
  }
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validations = [
    validateField('name',    'name-error',    v => v.trim().length < 2,         'Please enter your name (at least 2 characters).'),
    validateField('email',   'email-error',   v => !isEmailValid.test(v.trim()), 'Please enter a valid email address.'),
    validateField('subject', 'subject-error', v => v.trim().length < 3,         'Please enter a subject (at least 3 characters).'),
    validateField('message', 'message-error', v => v.trim().length < 10,        'Please enter a message (at least 10 characters).')
  ];

  const allValid = validations.every(Boolean);

  if (allValid) {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const recipient = 'techsaurabh0018@gmail.com';
    const emailSubject = `[Portfolio Contact] ${subject}`;
    const emailBody = `Hello Saurabh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from your portfolio website`;

    // Construct properly encoded mailto URI
    const mailtoUri = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Set fallback clickable link
    if (fallbackLink) {
      fallbackLink.setAttribute('href', mailtoUri);
    }

    // Display clear, honest instructions to the visitor
    if (formNotice) {
      formNotice.style.display = 'block';
    }

    // Attempt to open visitor's native email client
    window.location.href = mailtoUri;
  }
});

// Real-time validation feedback
['name', 'email', 'subject', 'message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        const errorEl = document.getElementById(`${id}-error`);
        if (errorEl) errorEl.textContent = '';
      }
    });
  }
});

/* =============================================
   11. BACK TO TOP BUTTON
   ============================================= */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
