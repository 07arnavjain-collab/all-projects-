/* ============================
   JAVASCRIPT FOR PORTFOLIO
   Arnav Jain — Portfolio
============================ */

// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ===========================
// TYPEWRITER EFFECT
// ===========================
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Aspiring AI Generalist',
  'Problem Solver',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterPaused = false;

function typeWriter() {
  if (typewriterPaused) return;
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(typeWriter, speed);
}

// Start typewriter after hero animation
setTimeout(typeWriter, 1200);

// ===========================
// PARTICLE BACKGROUND
// ===========================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null };
let animFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.8 + 0.3;
    this.baseOpacity = Math.random() * 0.5 + 0.1;
    this.opacity = this.baseOpacity;
    this.color = Math.random() > 0.6 ? '#00d4ff' : '#7b61ff';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Mouse repulsion
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 2.5;
        this.y += (dy / dist) * force * 2.5;
        this.opacity = Math.min(1, this.baseOpacity + force * 0.6);
      } else {
        this.opacity += (this.baseOpacity - this.opacity) * 0.05;
      }
    }

    // Wrap around edges
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 110;
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();

  animFrameId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

// Stop particles when hero not visible (performance)
const heroSection = document.getElementById('hero');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!animFrameId) animateParticles();
    } else {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  });
}, { threshold: 0 });
heroObserver.observe(heroSection);

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve — keep visible permanently
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => {
  revealObserver.observe(el);
});

// Make hero elements visible immediately
document.querySelectorAll('.hero-content .reveal-up').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 100);
});

// ===========================
// CONTACT FORM
// ===========================
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const successEl = document.getElementById('form-success');
  const form = document.getElementById('contact-form');

  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  if (!name || !email || !message) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-text">Sending...</span>';

  // Replace this URL with your Formspree endpoint (e.g. https://formspree.io/f/mlekoqjk)
  const formEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';

  fetch(formEndpoint, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  })
  .then(response => {
    if (response.ok) {
      successEl.innerHTML = '✅ Message sent! I\'ll get back to you soon.';
      successEl.style.color = '#00ff80';
      successEl.classList.add('visible');
      form.reset();
    } else {
      successEl.innerHTML = '❌ Please replace YOUR_FORM_ID in script.js with your Formspree ID.';
      successEl.style.color = '#ff4d4d';
      successEl.classList.add('visible');
    }
  })
  .catch(error => {
    successEl.innerHTML = '❌ Something went wrong.';
    successEl.style.color = '#ff4d4d';
    successEl.classList.add('visible');
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon">→</span>';
    setTimeout(() => { successEl.classList.remove('visible'); }, 7000);
  });
}

// ===========================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// GLOWING CURSOR TRAIL (subtle)
// ===========================
let trail = [];
const MAX_TRAIL = 8;

document.addEventListener('mousemove', (e) => {
  trail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
  if (trail.length > MAX_TRAIL) trail.shift();
});

// ===========================
// INTERACTIVE 3D TILT EFFECT
// ===========================
const tiltCards = document.querySelectorAll('.stat-card, .project-card, .beyond-card, .skill-category');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.transition = 'none';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});

