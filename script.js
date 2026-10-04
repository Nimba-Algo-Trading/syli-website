const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Ouvrir le menu');
  mainNav?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
  mainNav?.classList.toggle('is-open', !isOpen);
});
mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) closeMenu();
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.projects-heading, .project-row, .closing-copy, .closing-link').forEach((element) => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty('--mx', (x * 12) + 'px');
    heroVisual.style.setProperty('--my', (y * 12) + 'px');
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--mx', '0px');
    heroVisual.style.setProperty('--my', '0px');
  });

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rx', (-y * 1.4) + 'deg');
      card.style.setProperty('--ry', (x * 1.4) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
