(function () {
  'use strict';

  const WHATSAPP_NUMBER = '9779843155358';

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile navigation ---
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.querySelectorAll('a').forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Cursor glow (desktop only) ---
  const cursorGlow = document.querySelector('.cursor-glow');

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // --- Contact form → WhatsApp ---
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    const fields = [name, email, subject, message];
    let valid = true;

    fields.forEach((field) => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    const whatsappMessage = [
      '*New Contact from Website*',
      '',
      `*Name:* ${name.value.trim()}`,
      `*Email:* ${email.value.trim()}`,
      `*Subject:* ${subject.value.trim()}`,
      '',
      `*Message:*`,
      message.value.trim(),
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');

    contactForm.reset();
  });

  // Clear error state on input
  contactForm.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
})();
