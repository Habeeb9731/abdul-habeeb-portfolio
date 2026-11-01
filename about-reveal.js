/* Profile section: one-shot choreographed reveal + a gentle card tilt on desktop. */
(() => {
  const section = document.querySelector('.about');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Split the name into masked words; keep "(25)" as its own pop-in.
  const h2 = section.querySelector('.about-intro h2');
  if (h2) {
    [...h2.childNodes].forEach(n => {
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const mask = document.createElement('span'); mask.className = 'rv-mask';
        const word = document.createElement('span'); word.className = 'rv-word'; word.textContent = part;
        mask.appendChild(word); frag.appendChild(mask);
      });
      n.replaceWith(frag);
    });
    h2.querySelectorAll('.rv-word').forEach((w, i) => w.style.setProperty('--i', i));
  }
  const stagger = (sel, start = 0) => section.querySelectorAll(sel).forEach((el, i) => el.style.setProperty('--i', i + start));
  stagger('.social-links a');
  stagger('.tool-icons .tool');
  stagger('.feature-card');

  // Only arm the animation if the section is still below the fold, so a reload mid-page doesn't hide it.
  const r = section.getBoundingClientRect();
  if (r.top < window.innerHeight * 0.75) return;
  section.classList.add('rv-armed');
  // Intro and card grid trigger separately, so on stacked (mobile) layouts each plays when seen.
  const groups = [section.querySelector('.about-intro'), section.querySelector('.feature-grid')].filter(Boolean);
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.replace('rv-wait', 'rv-in');
    const g = e.target; setTimeout(() => g.classList.add('rv-done'), 2800); // release GPU layers
    io.unobserve(e.target);
  }), { threshold: 0.18 });
  groups.forEach(g => { g.classList.add('rv-wait'); io.observe(g); });

  // Gentle 3D tilt that follows the cursor (fine pointers only).
  if (!window.matchMedia('(pointer: fine)').matches) return;
  section.querySelectorAll('.feature-card').forEach(card => {
    let raf = 0;
    card.addEventListener('pointermove', e => {
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
        card.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
    });
  });
})();
