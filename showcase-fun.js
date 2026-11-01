/* Projects carousel extras: dealt-in entrance, word-by-word quotes, cursor parallax,
   side-card name peeks and autoplay progress dots. Hooks into the existing carousel
   by watching data-position, so the carousel logic itself stays untouched. */
(() => {
  const stage = document.querySelector('.showcase-stage');
  if (!stage) return;
  const cards = [...stage.querySelectorAll('.showcase-card')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const AUTOPLAY_MS = 6500;

  /* ---- side-card name peek ---- */
  cards.forEach(card => {
    const peek = document.createElement('span');
    peek.className = 'showcase-peek'; peek.setAttribute('aria-hidden', 'true');
    const name = document.createElement('b'); name.textContent = card.getAttribute('aria-label') || '';
    peek.append(name, document.createTextNode(' →'));
    const glare = document.createElement('span'); glare.className = 'showcase-glare'; glare.setAttribute('aria-hidden', 'true');
    card.append(peek, glare);
  });

  /* ---- word-by-word quote on activation ---- */
  const splitQuote = q => {
    if (!q || q.querySelector('.qw')) return;
    const words = q.textContent.split(/(\s+)/);
    q.replaceChildren();
    let i = 0;
    words.forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { q.appendChild(document.createTextNode(part)); return; }
      const w = document.createElement('span'); w.className = 'qw'; w.style.setProperty('--i', i++); w.textContent = part;
      q.appendChild(w);
    });
  };
  const enter = card => {
    if (reduce) return;
    splitQuote(card.querySelector('.showcase-quote'));
    card.querySelectorAll('.showcase-links a').forEach((a, i) => a.style.setProperty('--i', i));
    card.classList.remove('is-entering'); void card.offsetWidth; card.classList.add('is-entering');
  };
  new MutationObserver(muts => muts.forEach(m => {
    if (m.target.dataset.position === 'active' && m.oldValue !== 'active') { stage.classList.remove('is-dealt'); enter(m.target); syncDots(); }
  })).observe(stage, { subtree: true, attributes: true, attributeFilter: ['data-position'], attributeOldValue: true });
  // Language switch rewrites the quote text: re-split and replay on the active card.
  new MutationObserver(() => { const a = stage.querySelector('[data-position="active"]'); if (a) enter(a); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---- cursor parallax + glare on the active card ---- */
  if (fine && !reduce) {
    cards.forEach(card => {
      let raf = 0;
      card.addEventListener('pointermove', e => {
        if (card.dataset.position !== 'active') return;
        const b = card.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--px', (-x * 18).toFixed(1) + 'px');
          card.style.setProperty('--py', (-y * 12).toFixed(1) + 'px');
          card.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
          card.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
          card.classList.add('is-tracking');
        });
      });
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        card.style.setProperty('--px', '0px'); card.style.setProperty('--py', '0px');
        card.classList.remove('is-tracking');
      });
    });
  }

  /* ---- progress dots (mirror the existing 6.5 s autoplay) ---- */
  const dots = document.createElement('div');
  dots.className = 'showcase-dots'; dots.setAttribute('role', 'tablist'); dots.setAttribute('aria-label', 'Choose a project');
  cards.forEach((card, i) => {
    const d = document.createElement('button');
    d.type = 'button'; d.className = 'showcase-dot'; d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', card.getAttribute('aria-label') || `Project ${i + 1}`);
    d.appendChild(document.createElement('i'));
    d.addEventListener('click', () => {
      if (typeof setActiveProject === 'function') { setActiveProject(i); if (typeof restartProjectTimer === 'function') restartProjectTimer(); }
    });
    dots.appendChild(d);
  });
  stage.after(dots);
  let inView = false, hovering = false;
  function syncDots() {
    const active = cards.findIndex(c => c.dataset.position === 'active');
    [...dots.children].forEach((d, i) => {
      d.classList.toggle('is-active', i === active);
      d.setAttribute('aria-selected', String(i === active));
      d.classList.remove('is-running');
    });
    const running = inView && !hovering && !reduce;
    const cur = dots.children[active];
    if (cur && running) { void cur.offsetWidth; cur.classList.add('is-running'); }
  }
  dots.style.setProperty('--autoplay', AUTOPLAY_MS + 'ms');
  stage.addEventListener('pointerenter', () => { hovering = true; syncDots(); });
  stage.addEventListener('pointerleave', () => { hovering = false; syncDots(); });
  stage.addEventListener('focusin', () => { hovering = true; syncDots(); });
  stage.addEventListener('focusout', () => { hovering = false; syncDots(); });

  /* ---- dealt-in entrance (once) + autoplay visibility ---- */
  const startHidden = !reduce && stage.getBoundingClientRect().top > window.innerHeight * 0.9;
  if (startHidden) stage.classList.add('deal-wait');
  if (startHidden) {
    const dealIO = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      stage.classList.replace('deal-wait', 'is-dealt');
      // Entrance is one-shot: drop the class once it has played so later card changes use the normal transition.
      setTimeout(() => stage.classList.remove('is-dealt'), 1700);
      const a = stage.querySelector('[data-position="active"]'); if (a) enter(a);
      dealIO.disconnect();
    }, { threshold: 0.25 });
    dealIO.observe(stage);
  }
  // Same 50% threshold the carousel uses for autoplay.
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; syncDots(); }, { threshold: 0.5 }).observe(stage);
  syncDots();
})();
