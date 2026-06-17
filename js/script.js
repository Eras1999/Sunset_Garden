/* ============================================================
   Sunset Garden Elder Residencies — Global Script
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    /* ── Sticky Navbar ──────────────────────────────────────── */
    const nav = document.getElementById('mainNav');
    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 60) {
          nav.classList.remove('transparent');
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
          nav.classList.add('transparent');
        }
      };
      onScroll(); // run on load
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  
    /* ── Active nav link ────────────────────────────────────── */
    const rawPage    = window.location.pathname.split('/').pop();
    const currentPage = (rawPage === '' || rawPage === '/') ? 'index.html' : rawPage;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || '';
      if (href && href === currentPage) link.classList.add('active');
    });
  
    /* ── Hero Slider ────────────────────────────────────────── */
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
      const slides = heroSlider.querySelectorAll('.hero-slide');
      const dots   = heroSlider.querySelectorAll('.hero-dot');
      let current  = 0;
      let timer;
      let touchStartX = 0;
  
      const goTo = (n) => {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
      };
  
      const next = () => goTo(current + 1);
      const prev = () => goTo(current - 1);
  
      const startTimer = () => {
        clearInterval(timer);
        timer = setInterval(next, 5000);
      };
  
      // Init
      slides[0]?.classList.add('active');
      dots[0]?.classList.add('active');
      startTimer();
      setTimeout(() => heroSlider.classList.add('animated'), 200);
  
      // Controls
      heroSlider.querySelector('.hero-arrow.next')?.addEventListener('click', () => { next(); startTimer(); });
      heroSlider.querySelector('.hero-arrow.prev')?.addEventListener('click', () => { prev(); startTimer(); });
      dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startTimer(); }));
  
      // Pause on hover
      heroSlider.addEventListener('mouseenter', () => clearInterval(timer));
      heroSlider.addEventListener('mouseleave', startTimer);
  
      // Swipe
      heroSlider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      heroSlider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startTimer(); }
      }, { passive: true });
    }
  
    /* ── Testimonial Slider ─────────────────────────────────── */
    const tSlider = document.getElementById('testimonialSlider');
    if (tSlider) {
      const track = tSlider.querySelector('.testimonial-track');
      const cards = track?.querySelectorAll('.testimonial-card') || [];
      let tCurrent = 0;
      let tTimer;
  
      const tGoTo = (n) => {
        tCurrent = (n + cards.length) % cards.length;
        if (track) track.style.transform = `translateX(-${tCurrent * 100}%)`;
        tSlider.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === tCurrent));
      };
  
      const tNext = () => tGoTo(tCurrent + 1);
  
      tTimer = setInterval(tNext, 5000);
      tSlider.addEventListener('mouseenter', () => clearInterval(tTimer));
      tSlider.addEventListener('mouseleave', () => { tTimer = setInterval(tNext, 5000); });
      tSlider.querySelectorAll('.t-dot').forEach((d, i) => d.addEventListener('click', () => tGoTo(i)));
      tSlider.querySelector('.t-prev')?.addEventListener('click', () => tGoTo(tCurrent - 1));
      tSlider.querySelector('.t-next')?.addEventListener('click', () => tGoTo(tCurrent + 1));
    }
  
    /* ── FAQ Accordion ──────────────────────────────────────── */
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  
    /* ── Lightbox ───────────────────────────────────────────── */
    const lightbox   = document.getElementById('lightbox');
    const lbImg      = document.getElementById('lbImg');
    const lbItems    = [];
  
    if (lightbox) {
      // Collect all lightbox images and attach click/touch to the whole .gallery-item wrapper
      document.querySelectorAll('[data-lightbox]').forEach((el) => {
        lbItems.push(el.dataset.lightbox);
      });
  
      document.querySelectorAll('.gallery-item, .masonry-item').forEach((item, i) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => openLb(i));
      });
  
      let lbCurrent = 0;
      let lbTouchStartX = 0;
  
      const openLb = (n) => {
        lbCurrent = (n + lbItems.length) % lbItems.length;
        lbImg.src = lbItems[lbCurrent];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      };
  
      const closeLb = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
      };
  
      lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLb);
      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  
      lightbox.querySelector('.lightbox-arrow.next')?.addEventListener('click', () => openLb(lbCurrent + 1));
      lightbox.querySelector('.lightbox-arrow.prev')?.addEventListener('click', () => openLb(lbCurrent - 1));
  
      // Swipe to navigate on mobile
      lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
      lightbox.addEventListener('touchend', e => {
        const diff = lbTouchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? openLb(lbCurrent + 1) : openLb(lbCurrent - 1);
      }, { passive: true });
  
      document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLb();
        if (e.key === 'ArrowRight')  openLb(lbCurrent + 1);
        if (e.key === 'ArrowLeft')   openLb(lbCurrent - 1);
      });
    }
  
    /* ── AOS-style scroll animations ───────────────────────── */
    const aosEls = document.querySelectorAll('[data-aos]');
    if (aosEls.length) {
      const delays = { '0': 0, '100': 100, '200': 200, '300': 300, '400': 400, '500': 500, '600': 600 };
  
      aosEls.forEach(el => {
        const delay = el.dataset.aosDelay || '0';
        const dur   = el.dataset.aosDuration || '700';
        el.style.transitionDuration = dur + 'ms';
        el.style.transitionDelay    = (parseInt(delay) || 0) + 'ms';
      });
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
  
      aosEls.forEach(el => observer.observe(el));
    }
  
    /* ── Counter Animation ──────────────────────────────────── */
    const counters = document.querySelectorAll('.counter-num[data-count]');
    if (counters.length) {
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const end = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let start = 0;
          const dur = 1800;
          const step = Math.ceil(end / (dur / 16));
          const tick = setInterval(() => {
            start += step;
            if (start >= end) { start = end; clearInterval(tick); }
            el.textContent = start.toLocaleString() + suffix;
          }, 16);
          counterObs.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(c => counterObs.observe(c));
    }
  
    /* ── Contact Form ───────────────────────────────────────── */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#4caf50';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
          }, 3000);
        }, 1200);
      });
    }
  
  });