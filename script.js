// ── Nav: shadow on scroll ───────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mobile menu toggle ──────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ── About page video ────────────────────────────────────────────────────
const video     = document.getElementById('landscapeVideo');
const playHint  = document.getElementById('playHint');
const videoWrap = document.getElementById('videoWrap');

if (video && playHint && videoWrap) {
  let playedOnce = false;

  const hideHint = () => playHint.classList.add('hidden');
  const showHint = () => playHint.classList.remove('hidden');

  // 'playing' fires reliably whenever video actually starts rendering frames
  video.addEventListener('playing', () => {
    hideHint();
  });

  // After first full play: rewind and switch to hover mode
  video.addEventListener('ended', () => {
    playedOnce = true;
    video.currentTime = 0;
    showHint();
  });

  // Pause also shows the hint (e.g. if user navigates away mid-play)
  video.addEventListener('pause', () => {
    if (playedOnce) showHint();
  });

  // Hover: replay once first play is done
  videoWrap.addEventListener('mouseenter', () => {
    if (playedOnce) video.play().catch(() => {});
  });
  videoWrap.addEventListener('mouseleave', () => {
    if (playedOnce) {
      video.pause();
      video.currentTime = 0;
    }
  });

  // Click: toggle (also handles touch and blocked-autoplay fallback)
  videoWrap.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  // Attempt autoplay on load. Browsers block audio autoplay before interaction —
  // if it fails the hint stays visible so the visitor knows to click.
  function attemptAutoplay() {
    video.play().catch(() => {
      showHint();
      // On next interaction anywhere on the page, retry
      const retry = () => video.play().catch(() => {});
      document.addEventListener('click',   retry, { once: true });
      document.addEventListener('keydown', retry, { once: true });
    });
  }

  if (document.readyState === 'complete') {
    attemptAutoplay();
  } else {
    window.addEventListener('load', attemptAutoplay, { once: true });
  }
}

// ── Scroll fade-in ──────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
