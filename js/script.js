/**
 * EcoAcción 7093 - JavaScript Core Engine
 * Author: Senior Frontend Developer
 * Features: Responsive Navigation, Scroll Highlight, Stats Counters, Reveal Observers, and Custom Video Modal Player.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initScrollHighlight();
  initStatsCounter();
  initSmoothScroll();
  initVideoLinks();
});

/**
 * Video URL mapping
 * Edit the values below to point each `data-video-id` to the desired URL.
 * Keep IDs numeric and match the `data-video-id` attributes in `index.html`.
 */
const VIDEO_URLS = {
  // Example: 1: 'https://youtu.be/xxxxx'
  1: 'https://drive.google.com/file/d/1gQTx-dvOXv8wn--x8Dfmhr9IG4mcgrYa/view?usp=sharing',
  2: 'https://drive.google.com/file/d/1VwtxNFxAK6TtFo0zvt_RPjC_fDFAM19-/view?usp=sharing', // <-- reemplaza con la URL del video 2
};

/**
 * Finds gallery buttons and overlay play areas, and wires the correct URLs
 * Uses the `data-video-id` attribute found on the card's `.play-video-btn` element.
 */
function initVideoLinks() {
  const gallery = document.getElementById('galeria-videos');
  if (!gallery) return;

  // Update the "Ver video participante" buttons inside the gallery
  const videoAnchors = gallery.querySelectorAll('a[aria-label^="Ver video de"], a');
  videoAnchors.forEach(anchor => {
    // narrow to those that look like the participant buttons
    if (!/Ver video participante|Ver video de/i.test(anchor.textContent || '') && !anchor.hasAttribute('aria-label')) return;

    const card = anchor.closest('.bg-neutral-cloud');
    if (!card) return;
    const playArea = card.querySelector('.play-video-btn[data-video-id]');
    if (!playArea) return;

    const id = playArea.dataset.videoId;
    const url = VIDEO_URLS[id] || '';

    if (url && url.trim() !== '') {
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    } else {
      // leave as placeholder and prevent accidental navigation
      anchor.href = '#';
      anchor.addEventListener('click', (e) => {
        if (!VIDEO_URLS[id] || VIDEO_URLS[id].trim() === '') {
          e.preventDefault();
          console.warn(`No hay URL configurada para data-video-id=${id}. Actualiza VIDEO_URLS en js/script.js`);
        }
      });
    }
  });

  // Wire the overlay/play areas so clicking them opens the mapped URL as well
  const playAreas = gallery.querySelectorAll('.play-video-btn[data-video-id]');
  playAreas.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const id = el.dataset.videoId;
      const url = VIDEO_URLS[id] || '';
      if (url && url.trim() !== '') {
        window.open(url, '_blank', 'noopener');
      } else {
        console.warn(`Intentó abrir video id=${id} pero no hay URL configurada en VIDEO_URLS`);
      }
    });
  });
}

/**
 * 1. Hamburger Menu Panel Toggle (Mobile/Tablet drawer system)
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = (open) => {
    if (open) {
      mobileMenu.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    } else {
      mobileMenu.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    }
  };

  menuBtn.addEventListener('click', () => toggleMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

  const closeIconBtn = document.getElementById('close-menu-btn-icon');
  if (closeIconBtn) closeIconBtn.addEventListener('click', () => toggleMenu(false));

  // Close drawer when clicking any link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/**
 * 2. Scroll Reveal Animations (Using high-performance IntersectionObserver)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * 3. Menu Item Active State on Scroll (Intersection Observer for Sections)
 */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('text-primary', 'font-semibold');
          link.classList.add('text-gray-600');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-primary', 'font-semibold');
            link.classList.remove('text-gray-600');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.3, // Highlight when section takes at least 30% of view
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(section => {
    activeObserver.observe(section);
  });
}

/**
 * 4. Stats Counters Animation
 */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-bar');
  const counters = document.querySelectorAll('.stat-number');
  
  if (!statsSection || counters.length === 0) return;

  let started = false;

  const startCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 80; // duration is proportional
      
      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.floor(count).toLocaleString() + suffix;
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target.toLocaleString() + suffix;
        }
      };
      
      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        startCounters();
        started = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

/**
 * 6. Smooth Scroll navigation anchor links
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const offset = 80; // Space for the sticky navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
