/* ============================================================
   LUCA SHOCK PISANI — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cur  = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  });
  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a, button, .g-item, .social-card, .platform-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cur?.classList.add('grow'); ring?.classList.add('grow'); });
    el.addEventListener('mouseleave', () => { cur?.classList.remove('grow'); ring?.classList.remove('grow'); });
  });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER ── */
  const ham     = document.querySelector('.hamburger');
  const mobileN = document.querySelector('.mobile-nav');
  ham?.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mobileN.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileN?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileN.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SCROLL REVEAL ── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  /* ── ACTIVE NAV ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        document.querySelector(`.nav-links a[href="#${e.target.id}"]`)?.classList.add('active');
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => secObs.observe(s));

  /* ── HERO PHOTO PARALLAX ── */
  const heroPhoto = document.querySelector('.hero-photo');
  window.addEventListener('scroll', () => {
    if (!heroPhoto) return;
    const y = window.scrollY * 0.3;
    heroPhoto.style.transform = `translateY(${y}px)`;
  }, { passive: true });

  /* ── COOKIE BANNER ── */
  const banner  = document.getElementById('cookie-banner');
  const btnOk   = document.getElementById('cookie-accept');
  const btnNo   = document.getElementById('cookie-reject');

  function dismissBanner() {
    if (banner) {
      banner.style.transition = 'opacity .35s ease, transform .35s ease';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
      setTimeout(() => { banner.style.display = 'none'; }, 360);
    }
  }

  // Show only if user hasn't responded yet
  if (!localStorage.getItem('cookieConsent')) {
    if (banner) {
      banner.style.display = 'flex';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
      // Slight delay so it appears after page load
      setTimeout(() => {
        banner.style.transition = 'opacity .45s ease, transform .45s ease';
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
      }, 1200);
    }
  } else {
    if (banner) banner.style.display = 'none';
  }

  btnOk?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    dismissBanner();
  });
  btnNo?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    dismissBanner();
  });


  const track   = document.getElementById('gallery-track');
  const slides  = track ? Array.from(track.querySelectorAll('.gallery-slide')) : [];
  const dots    = Array.from(document.querySelectorAll('.slider-dot'));
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let current   = 0;

  function goTo(i) {
    current = i;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === slides.length - 1;
  }

  btnPrev?.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  btnNext?.addEventListener('click', () => { if (current < slides.length - 1) goTo(current + 1); });
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.slide)));

  // Touch/swipe support
  let touchStartX = 0;
  track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && current < slides.length - 1) goTo(current + 1);
      if (dx > 0 && current > 0) goTo(current - 1);
    }
  });

  goTo(0); // init

  /* ── GALLERY LIGHTBOX ── */
  const items   = Array.from(document.querySelectorAll('.g-item[data-caption]'));
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbCap   = document.getElementById('lb-cap');
  const lbCount = document.getElementById('lb-count');
  let ci = 0;

  function openLB(i) {
    ci = i;
    const item = items[i];
    const img  = item.querySelector('img');
    if (!img) return;
    lbImg.src  = img.src;
    lbImg.alt  = img.alt;
    lbCap.textContent   = item.dataset.caption || '';
    lbCount.textContent = `${i + 1} / ${items.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lb?.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navLB(d) { openLB((ci + d + items.length) % items.length); }

  items.forEach((el, i) => {
    el.addEventListener('click', () => openLB(i));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') openLB(i); });
  });
  document.querySelector('.lb-close')?.addEventListener('click', closeLB);
  document.querySelector('.lb-prev')?.addEventListener('click', () => navLB(-1));
  document.querySelector('.lb-next')?.addEventListener('click', () => navLB(1));
  lb?.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLB();
    if (e.key === 'ArrowLeft')  navLB(-1);
    if (e.key === 'ArrowRight') navLB(1);
  });

  /* ── BOOKING FORM ── */
  const form    = document.getElementById('booking-form');
  const success = document.getElementById('form-success');

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    // Validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(f => {
      const ok = f.value.trim() !== '';
      f.style.borderColor = ok ? '' : 'rgba(255,80,80,0.5)';
      f.style.boxShadow   = ok ? '' : '0 0 8px rgba(255,80,80,0.08)';
      if (!ok) valid = false;
    });
    if (!valid) return;

    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // If Formspree ID is set, submit via fetch
    const action = form.getAttribute('action');
    if (action && !action.includes('YOUR_FORM_ID')) {
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          form.style.display = 'none';
          success.style.display = 'flex';
        } else {
          btn.textContent = 'Error — try again';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      }
    } else {
      // Demo mode (no Formspree yet)
      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'flex';
      }, 900);
    }
  });

});
