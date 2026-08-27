/**
 * HUGGIE FEST 2026 - Interactive Script
 * Neon Party Experience & Utility Integrations
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initNeonCanvas();
  initAudioPlayer();
  initCalendarGenerator();
  initScrollReveal();
  initSmoothScroll();
});

/* ==========================================================================
   1. COUNTDOWN TIMER (Target: 29 de Agosto 2026, 20:00:00 GMT-6)
   ========================================================================== */
function initCountdown() {
  // 29 de Agosto de 2026, 20:00:00 (Hora Monterrey / GMT-6)
  const eventDate = new Date('2026-08-29T20:00:00-06:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minEl = document.getElementById('cd-minutes');
  const secEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minEl || !secEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minEl.textContent = '00';
      secEl.textContent = '00';
      const title = document.querySelector('.countdown-title');
      if (title) title.textContent = '🎉 ¡LA FIESTA YA COMENZÓ! 🎉';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minEl.textContent = String(minutes).padStart(2, '0');
    secEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. NEON CANVAS (Floating Particles & Neon Confetti)
   ========================================================================== */
function initNeonCanvas() {
  const canvas = document.getElementById('party-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = [
    '#ff007f', // Neon Pink
    '#ffe600', // Neon Yellow
    '#00f0ff', // Neon Cyan
    '#39ff14', // Neon Green
    '#b5179e', // Neon Purple
    '#ffffff'  // Neon White
  ];

  const particleCount = window.innerWidth < 768 ? 35 : 65;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 5 + 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 4;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.isConfetti = Math.random() > 0.5;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;

      if (this.isConfetti) {
        // Confetti rectangle
        ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
      } else {
        // Circular glowing particle
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
}

/* ==========================================================================
   3. AUDIO PLAYER (Reproducción limpia de assets/music/huggie-fest.mp3)
   ========================================================================== */
function initAudioPlayer() {
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');
  const audio = document.getElementById('bg-audio');

  if (!musicBtn || !audio) return;

  let isPlaying = false;

  function playAudio() {
    if (isPlaying) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlayingState(true);
        })
        .catch((err) => {
          console.log('Reproducción esperando interacción del usuario:', err);
        });
    }
  }

  function pauseAudio() {
    audio.pause();
    setPlayingState(false);
  }

  function toggleMusic(e) {
    if (e) e.preventDefault();
    if (!isPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🔇';
      musicText.textContent = 'SILENCIAR';
    } else {
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicText.textContent = 'ACTIVAR MÚSICA';
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  audio.addEventListener('play', () => setPlayingState(true));
  audio.addEventListener('pause', () => setPlayingState(false));
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play().catch(() => setPlayingState(false));
  });

  // Intento de reproducción al cargar
  setTimeout(() => {
    playAudio();
  }, 500);

  // Desbloqueo en móvil al primer toque
  const unlockOnFirstTouch = () => {
    if (!isPlaying) {
      playAudio();
    }
    window.removeEventListener('touchstart', unlockOnFirstTouch);
    window.removeEventListener('click', unlockOnFirstTouch);
  };

  window.addEventListener('touchstart', unlockOnFirstTouch, { passive: true, once: true });
  window.addEventListener('click', unlockOnFirstTouch, { passive: true, once: true });
}

/* ==========================================================================
   4. CALENDAR GENERATOR (.ICS & Google Calendar)
   ========================================================================== */
function initCalendarGenerator() {
  const calBtn = document.getElementById('add-to-calendar-btn');
  if (!calBtn) return;

  calBtn.addEventListener('click', () => {
    const eventDetails = {
      title: 'Huggie Fest 2026 🎉',
      description: '¡Estás oficialmente invitad@ al Huggie Fest 2026! Comida, Pozole Trasnochador, Duritos Patty Star, Baile y Mucha Diversión. ¡No olvides traer tu bebida favorita!',
      location: 'Mar Adriático 8532, Col. Loma Linda, Monterrey, Nuevo León',
      startDate: '20260830T020000Z', // 2026-08-29 20:00:00 GMT-6 = 2026-08-30 02:00:00 UTC
      endDate: '20260830T120000Z'    // 2026-08-30 06:00:00 GMT-6 = 2026-08-30 12:00:00 UTC
    };

    // Google Calendar Direct Link
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

    // Build Universal .ICS Content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Huggie Fest//NONSGML v1.0//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      `DTSTART:${eventDetails.startDate}`,
      `DTEND:${eventDetails.endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create Download Blob for .ics
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'Huggie-Fest-2026.ics');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    // Also offer direct Google Calendar in a tab
    setTimeout(() => {
      const openGoogle = confirm('¿Deseas también abrirlo directamente en Google Calendar?');
      if (openGoogle) {
        window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
      }
    }, 400);
  });
}

/* ==========================================================================
   5. SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
  if (!elementsToReveal.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elementsToReveal.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    elementsToReveal.forEach((el) => el.classList.add('is-revealed'));
  }
}

/* ==========================================================================
   6. SMOOTH SCROLL FOR BUTTONS
   ========================================================================== */
function initSmoothScroll() {
  const btn = document.getElementById('btn-ver-invitacion');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('mensaje');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
