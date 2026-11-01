/* Contact + footer: one-shot reveal, rising wordmark letters and a cursor-follow letter wave. */
(() => {
  const contact = document.querySelector('.contact');
  if (!contact || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wordmark = contact.querySelector('.footer-wordmark');

  // Split the wordmark into letters (gradient moves onto each letter).
  let letters = [];
  if (wordmark) {
    const text = wordmark.textContent.trim();
    wordmark.replaceChildren();
    letters = [...text].map((ch, i) => {
      const s = document.createElement('span'); s.className = 'wl'; s.textContent = ch; s.style.setProperty('--i', i);
      wordmark.appendChild(s); return s;
    });
    wordmark.classList.add('is-split');
  }

  // Heading words for the reveal (the h2 is rewritten on language change, so re-split then).
  const h2 = contact.querySelector('h2');
  const splitHeading = () => {
    if (!h2 || h2.querySelector('.cw')) return;
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'cw'; w.style.setProperty('--i', i++); w.textContent = part; frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(h2);
  };
  splitHeading();
  new MutationObserver(splitHeading).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  contact.querySelectorAll('.contact-actions .button').forEach((b, i) => b.style.setProperty('--i', i));
  contact.querySelectorAll('.footer-links > *').forEach((a, i) => a.style.setProperty('--i', i));

  // One-shot reveals: copy block and footer block trigger separately.
  const groups = [contact.querySelector('.contact-copy'), contact.querySelector('footer')].filter(Boolean);
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.replace('ff-wait', 'ff-in');
    io.unobserve(e.target);
  }), { threshold: 0.2 });
  groups.forEach(g => {
    if (g.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen
    g.classList.add('ff-wait'); io.observe(g);
  });

  // Letters lift toward the cursor (fine pointers only).
  if (!letters.length || !window.matchMedia('(pointer: fine)').matches) return;
  const footer = contact.querySelector('footer');
  let raf = 0, px = null;
  const update = () => {
    raf = 0;
    letters.forEach(l => {
      if (px === null) { l.style.setProperty('--lift', '0'); return; }
      const b = l.getBoundingClientRect();
      const d = Math.abs(px - (b.left + b.width / 2)) / b.width;   // distance in letter-widths
      const k = Math.max(0, 1 - d / 1.6);
      l.style.setProperty('--lift', (k * k).toFixed(3));
    });
  };
  footer.addEventListener('pointermove', e => { px = e.clientX; if (!raf) raf = requestAnimationFrame(update); });
  footer.addEventListener('pointerleave', () => { px = null; if (!raf) raf = requestAnimationFrame(update); });
})();
