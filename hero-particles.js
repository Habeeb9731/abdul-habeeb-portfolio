/* Hero particle field: soft drifting particles that part around the cursor and
   link into faint constellations nearby. Desktop + fine pointer only. */
(() => {
  const hero = document.querySelector('.hero');
  const mq = window.matchMedia('(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1, parts = [], raf = 0, visible = true, last = 0;
  const mouse = { x: -9999, y: -9999, active: false, k: 0 };
  const R = 150;          // cursor influence radius
  const LINK = 92;        // max distance for constellation lines

  function resize() {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(130, (W * H * 0.72) / 9000));
    while (parts.length < target) parts.push(spawn(true));
    parts.length = target;
  }
  function spawn(anywhere) {
    const hBand = H * 0.72; // particles live in the dark upper part of the sky
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * hBand : hBand + 4,
      ox: 0, oy: 0, vx: 0, vy: 0,                    // cursor offset + its velocity (spring)
      dx: (Math.random() - 0.5) * 0.06,              // slow drift
      dy: -0.03 - Math.random() * 0.07,
      r: 0.5 + Math.random() * 1.3,
      a: 0.25 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,               // twinkle phase
      glow: 0
    };
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(2.5, (now - last) / 16.67 || 1); last = now;
    mouse.k += ((mouse.active ? 1 : 0) - mouse.k) * 0.08 * dt;
    ctx.clearRect(0, 0, W, H);
    const fadeStart = H * 0.38, fadeEnd = H * 0.74;
    const near = [];

    for (const p of parts) {
      p.x += p.dx * dt; p.y += p.dy * dt; p.tw += 0.02 * dt;
      if (p.y < -6) Object.assign(p, spawn(false));
      if (p.x < -6) p.x = W + 6; else if (p.x > W + 6) p.x = -6;

      // Cursor: push particles gently outward, spring back when it leaves.
      const px = p.x + p.ox, py = p.y + p.oy;
      const ddx = px - mouse.x, ddy = py - mouse.y, d = Math.hypot(ddx, ddy);
      let g = 0;
      if (mouse.k > 0.01 && d < R) {
        const f = (1 - d / R) ** 2 * mouse.k;
        p.vx += (ddx / (d || 1)) * f * 0.9 * dt;
        p.vy += (ddy / (d || 1)) * f * 0.9 * dt;
        g = (1 - d / R) * mouse.k;
      }
      p.vx += -p.ox * 0.012 * dt; p.vy += -p.oy * 0.012 * dt;   // spring home
      p.vx *= 0.9; p.vy *= 0.9;
      p.ox += p.vx * dt; p.oy += p.vy * dt;
      p.glow += (g - p.glow) * 0.12 * dt;

      const x = p.x + p.ox, y = p.y + p.oy;
      const fade = y < fadeStart ? 1 : y > fadeEnd ? 0 : 1 - (y - fadeStart) / (fadeEnd - fadeStart);
      if (fade <= 0) continue;
      const tw = 0.75 + 0.25 * Math.sin(p.tw);
      const alpha = Math.min(1, (p.a * tw + p.glow * 0.6) * fade);
      const rad = p.r * (1 + p.glow * 0.9);
      if (p.glow > 0.05) {
        ctx.fillStyle = `rgba(143,176,255,${0.18 * p.glow * fade})`;
        ctx.beginPath(); ctx.arc(x, y, rad * 4, 0, Math.PI * 2); ctx.fill();
        near.push({ x, y, g: p.glow * fade });
      }
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }

    // Faint constellation lines between glowing particles near the cursor.
    ctx.lineWidth = 0.6;
    for (let i = 0; i < near.length; i++) for (let j = i + 1; j < near.length; j++) {
      const a = near[i], b = near[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > LINK) continue;
      ctx.strokeStyle = `rgba(201,220,255,${(1 - d / LINK) * Math.min(a.g, b.g) * 0.8})`;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
  }

  const start = () => { if (!raf && visible && !document.hidden && mq.matches) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  function setup() {
    if (mq.matches) { canvas.hidden = false; resize(); start(); }
    else { stop(); canvas.hidden = true; }
  }

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  hero.addEventListener('pointerleave', () => { mouse.active = false; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  new ResizeObserver(() => { if (mq.matches) resize(); }).observe(hero);
  mq.addEventListener('change', setup);
  setup();
})();
