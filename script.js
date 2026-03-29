// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 800);
});

// ===== HERO PARTICLES =====
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = Math.random() * 8 + 6 + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    container.appendChild(p);
  }
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  navbar.classList.toggle('scrolled', current > 60);
  lastScroll = current;
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== STAT COUNTER =====
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ===== MENU — REALISTIC PAGE TURN =====
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.menu-panel');
const tabList = Array.from(tabs);
let currentTabIndex = 0;
let isFlipping = false;

// Add edge zones to each panel for page turning
function setupPageEdges() {
  document.querySelectorAll('.page-edge').forEach(el => el.remove());

  const activePanel = document.querySelector('.menu-panel.active');
  if (!activePanel) return;

  // Right edge — go forward
  if (currentTabIndex < tabList.length - 1) {
    const rightEdge = document.createElement('div');
    rightEdge.className = 'page-edge page-edge-right';
    rightEdge.innerHTML = '<div class="edge-hint"></div>';
    rightEdge.addEventListener('click', () => flipToTab(currentTabIndex + 1));
    activePanel.appendChild(rightEdge);
  }

  // Left edge — go back
  if (currentTabIndex > 0) {
    const leftEdge = document.createElement('div');
    leftEdge.className = 'page-edge page-edge-left';
    leftEdge.innerHTML = '<div class="edge-hint"></div>';
    leftEdge.addEventListener('click', () => flipToTab(currentTabIndex - 1));
    activePanel.appendChild(leftEdge);
  }
}

function flipToTab(newIndex) {
  if (isFlipping || newIndex === currentTabIndex) return;
  if (newIndex < 0 || newIndex >= tabList.length) return;
  isFlipping = true;

  const goingForward = newIndex > currentTabIndex;
  const oldPanel = document.getElementById(tabList[currentTabIndex].dataset.tab);
  const newPanel = document.getElementById(tabList[newIndex].dataset.tab);

  // Remove edge zones
  document.querySelectorAll('.page-edge').forEach(el => el.remove());

  // Animate old page out
  oldPanel.classList.add(goingForward ? 'page-turn-forward' : 'page-turn-backward');

  // After animation (700ms) — swap panels
  setTimeout(() => {
    oldPanel.classList.remove('active', 'page-turn-forward', 'page-turn-backward');

    newPanel.classList.add('active', 'page-settle');
    tabs.forEach(t => t.classList.remove('active'));
    tabList[newIndex].classList.add('active');
    currentTabIndex = newIndex;

    // Re-trigger reveals
    newPanel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      revealObserver.observe(el);
    });

    setTimeout(() => {
      newPanel.classList.remove('page-settle');
      setupPageEdges();
      isFlipping = false;
    }, 350);
  }, 700);
}

// Tab clicks
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => flipToTab(i));
});

// Initial setup
setTimeout(setupPageEdges, 100);

// ===== AUTO-NUDGE — teasing page turn if idle =====
let nudgeTimer = null;
let hasInteracted = false;

function startNudge() {
  clearTimeout(nudgeTimer);
  nudgeTimer = setTimeout(() => {
    const rightEdge = document.querySelector('.page-edge-right');
    if (!rightEdge || isFlipping) return;

    const panel = document.querySelector('.menu-panel.active');
    if (!panel) return;

    // Add nudge class for the teasing animation
    panel.classList.add('page-nudge');
    setTimeout(() => {
      panel.classList.remove('page-nudge');
      // Keep nudging until user interacts
      if (!hasInteracted) startNudge();
    }, 1500);
  }, 4000);
}

// Start nudging when menu section is visible
const menuNudgeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasInteracted) {
      startNudge();
    } else {
      clearTimeout(nudgeTimer);
    }
  });
}, { threshold: 0.3 });

menuNudgeObserver.observe(document.querySelector('.menu'));

// Stop nudging on any interaction with the menu
document.querySelector('.menu').addEventListener('click', () => {
  hasInteracted = true;
  clearTimeout(nudgeTimer);
}, { once: true });

// ===== RESERVATION FORM =====
const resForm = document.getElementById('resForm');
resForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simple validation visual feedback
  const inputs = resForm.querySelectorAll('input[required], select[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value) {
      input.style.borderColor = '#f5576c';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (valid) {
    resForm.innerHTML = `
      <div class="form-success">
        <h3>Reservation Requested</h3>
        <p>Thank you! We'll confirm your reservation shortly via email.</p>
      </div>
    `;
  }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
