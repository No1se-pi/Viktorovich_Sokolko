const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const navLinks = navigation ? [...navigation.querySelectorAll('a')] : [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canonicalLink = document.querySelector('link[rel="canonical"]');

if (canonicalLink && /^https?:$/.test(window.location.protocol)) {
  canonicalLink.href = new URL('/', window.location.origin).href;
}

function updateHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 18);
}

function setMenu(open) {
  if (!menuButton || !navigation) return;
  menuButton.classList.toggle('active', open);
  navigation.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) setMenu(false);
});

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('timeline')) {
        entry.target.classList.add('line-visible');
      }
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  document.querySelectorAll('.reveal, .timeline').forEach(element => {
    revealObserver.observe(element);
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const activeSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });

  sections.forEach(section => activeSectionObserver.observe(section));

  const parallaxImages = [...document.querySelectorAll('.image-parallax')];
  let ticking = false;

  const updateParallax = () => {
    parallaxImages.forEach(element => {
      const rect = element.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const offset = Math.max(-14, Math.min(14, progress * -18));
      element.style.setProperty('--parallax', `${offset}px`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  document.querySelector('.timeline')?.classList.add('line-visible');
}

const policyDialog = document.querySelector('#privacy-policy');
const policyLink = document.querySelector('.privacy-link');
const closeDialogButton = policyDialog?.querySelector('.dialog-close');

policyLink?.addEventListener('click', event => {
  event.preventDefault();
  if (typeof policyDialog?.showModal === 'function') policyDialog.showModal();
});

closeDialogButton?.addEventListener('click', () => policyDialog?.close());

policyDialog?.addEventListener('click', event => {
  if (event.target === policyDialog) policyDialog.close();
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
