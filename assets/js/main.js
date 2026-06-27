/**
 * Guangzhou Meibo City - Main JavaScript
 * Premium B2B Foreign Trade Website
 */

(function () {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initActiveNav();
    initCounterAnimation();
  });

  // --- Header Scroll Effect ---
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // --- Scroll Reveal Animation ---
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    var observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12
    };

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }

  // --- Active Navigation Highlight ---
  function initActiveNav() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      // Extract filename from href
      var linkFile = href.split('/').pop();

      // Extract filename from current path
      var currentFile = currentPath.split('/').pop();

      // Handle root / index
      if (currentFile === '' || currentFile === '/') {
        currentFile = 'index.html';
      }

      if (linkFile === currentFile) {
        link.classList.add('active');
      }

      // Special: home link active on index page
      if (linkFile === 'index.html' && (currentFile === 'index.html' || currentFile === '')) {
        link.classList.add('active');
      }
    });
  }

  // --- Counter Animation for Stats ---
  function initCounterAnimation() {
    var counters = document.querySelectorAll('.stat-number:not(.no-animate)');

    if (counters.length === 0) return;

    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target)) return;

    var suffix = el.textContent.replace(/[0-9]/g, '').trim();
    var duration = 2000; // ms
    var startTime = null;
    var startValue = 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      el.textContent = current.toLocaleString() + (suffix ? ' ' + suffix : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + (suffix ? ' ' + suffix : '');
      }
    }

    requestAnimationFrame(step);
  }

  // --- Contact Form Handler ---
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.btn');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate async submission
      setTimeout(function () {
        btn.textContent = 'Message Sent';
        btn.style.backgroundColor = '#2d6a4f';
        btn.style.borderColor = '#2d6a4f';
        contactForm.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

})();
