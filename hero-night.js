/* Night sky for the hero, dark mode only: a field of twinkling stars and the odd shooting star.
   Runs only while dark mode is on and the hero is on screen. With reduced motion the stars stay still
   and no shooting stars fall. */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-night';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1, stars = [], meteors = [], raf = 0, last = 0, nextMeteor = 0;
  let onScreen = true;
  const isDark = () => document.body.classList.contains('dark');

  function resize() {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Stars thin out towards the glowing horizon, like the real sky near a lit-up skyline.
    const count = Math.round(Math.min(320, (W * H) / 4200));
    stars = Array.from({ length: count }, () => {
      const y = Math.pow(Math.random(), 1.6) * H * 0.78;
      const big = Math.random() < 0.06;
      return {
        x: Math.random() * W, y,
        r: big ? 1.1 + Math.random() * 0.9 : 0.35 + Math.random() * 0.75,
        a: big ? 0.75 + Math.random() * 0.25 : 0.25 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 1.8,
        hue: Math.random() < 0.18 ? '200,220,255' : Math.random() < 0.08 ? '255,236,210' : '255,255,255',
        big,
      };
    });
  }

  function meteor() {
    // Mostly falling down-left like the reference sky, sometimes down-right.
    const dir = Math.random() < 0.7 ? -1 : 1;
    const angle = (18 + Math.random() * 22) * Math.PI / 180;
    const speed = 13 + Math.random() * 7;
    return {
      x: dir < 0 ? W * (0.35 + Math.random() * 0.65) : W * Math.random() * 0.65,
      y: H * (0.04 + Math.random() * 0.22),
      vx: Math.cos(angle) * speed * dir,
      vy: Math.sin(angle) * speed,
      len: 150 + Math.random() * 170,
      life: 0, max: 26 + Math.random() * 16,
    };
  }

  function draw(now) {
    const dt = last ? Math.min(3, (now - last) / 16.67) : 1;
    last = now;
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;

    for (const s of stars) {
      const a = still ? s.a : s.a * (0.55 + 0.45 * Math.sin(t * s.sp + s.tw));
      ctx.fillStyle = `rgba(${s.hue},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.big && a > 0.6) {
        // A soft sparkle on the brightest stars.
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        g.addColorStop(0, `rgba(${s.hue},${(a * 0.35).toFixed(3)})`);
        g.addColorStop(1, `rgba(${s.hue},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(s.x - s.r * 6, s.y - s.r * 6, s.r * 12, s.r * 12);
      }
    }

    if (still) return;
    if (now > nextMeteor) {
      meteors.push(meteor());
      if (Math.random() < 0.15) meteors.push(meteor());
      nextMeteor = now + 2600 + Math.random() * 4200;
    }
    meteors = meteors.filter(m => m.life < m.max);
    for (const m of meteors) {
      m.life += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      // Fades in quickly, burns, then fades out.
      const p = m.life / m.max;
      const alpha = p < 0.12 ? p / 0.12 : 1 - Math.pow((p - 0.12) / 0.88, 1.6);
      const k = m.len / Math.hypot(m.vx, m.vy);
      const tx = m.x - m.vx * k, ty = m.y - m.vy * k;
      const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${alpha.toFixed(3)})`);
      g.addColorStop(0.3, `rgba(200,222,255,${(0.6 * alpha).toFixed(3)})`);
      g.addColorStop(1, 'rgba(120,160,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      const head = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 9);
      head.addColorStop(0, `rgba(255,255,255,${(0.9 * alpha).toFixed(3)})`);
      head.addColorStop(1, 'rgba(200,220,255,0)');
      ctx.fillStyle = head;
      ctx.fillRect(m.x - 9, m.y - 9, 18, 18);
    }
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    draw(now);
  }

  function update() {
    const run = isDark() && onScreen && !document.hidden;
    if (run && !raf) {
      resize();
      last = 0;
      nextMeteor = performance.now() + 1200;
      if (still) draw(performance.now());
      else raf = requestAnimationFrame(loop);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      meteors = [];
    }
    if (!isDark()) ctx.clearRect(0, 0, W, H);
  }

  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update(); }).observe(hero);
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', update);
  addEventListener('resize', () => { if (raf || (still && isDark())) { resize(); if (still) draw(performance.now()); } }, { passive: true });
  update();
})();
