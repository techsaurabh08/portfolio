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
const formSuccess  = document.getElementById('form-success');
const yearEl       = document.getElementById('year');
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

/* =============================================
   1. DYNAMIC YEAR IN FOOTER
   ============================================= */
yearEl.textContent = new Date().getFullYear();

/* =============================================
   2. NAVBAR — SCROLL EFFECT & ACTIVE LINK
   ============================================= */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Sticky navbar style
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Back to top visibility
  backToTop.classList.toggle('visible', scrollY > 400);

  // Active nav link based on scroll position
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    const id            = section.getAttribute('id');
    const link          = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollY >= sectionTop && scrollY < sectionBottom);
    }
  });
});

/* =============================================
   3. HAMBURGER MENU
   ============================================= */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
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
  'Frontend Developer',
  'Creative Coder',
  'Problem Solver',
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
  '.skill-card',
  '.project-card',
  '.contact-info',
  '.contact-form',
  '.stat'
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
   9. PROJECT FILTER
   ============================================= */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show     = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Small delay for smooth transition
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

/* =============================================
   10. CONTACT FORM VALIDATION
   ============================================= */
function validateField(id, errorId, condition, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);

  if (condition(field.value)) {
    field.classList.add('error');
    error.textContent = message;
    return false;
  } else {
    field.classList.remove('error');
    error.textContent = '';
    return true;
  }
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validations = [
    validateField('name',    'name-error',    v => v.trim().length < 2,         'Name must be at least 2 characters.'),
    validateField('email',   'email-error',   v => !isEmailValid.test(v.trim()), 'Please enter a valid email address.'),
    validateField('subject', 'subject-error', v => v.trim().length < 3,         'Subject must be at least 3 characters.'),
    validateField('message', 'message-error', v => v.trim().length < 10,        'Message must be at least 10 characters.')
  ];

  const allValid = validations.every(Boolean);

  if (allValid) {
    // Simulate form submission (replace with your backend/EmailJS logic)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      contactForm.reset();
      formSuccess.style.display = 'block';
      submitBtn.innerHTML       = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled        = false;

      setTimeout(() => { formSuccess.style.display = 'none'; }, 4000);
    }, 1500);
  }
});

// Real-time validation feedback
['name', 'email', 'subject', 'message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        field.classList.remove('error');
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

/* =============================================
   12. SMOOTH ACTIVE LINK HIGHLIGHT ON CLICK
   ============================================= */
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
