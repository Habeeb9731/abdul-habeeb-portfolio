/* Subtle scroll reveals for the principles, experience and projects sections.
   Each group animates once when it enters view; groups already on screen are left alone. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // [group selector, [[item selector (relative to group, '' = group itself), start ms, step ms, variant]]]
  const plan = [
    ['.principles', [['.label', 0, 0], ['h2', 90, 0], ['.principles-lists h3', 240, 120], ['.principles-lists li', 340, 60, 'x']]],
    ['.cases .section-head', [['.label', 0, 0], ['h2', 90, 0]]],
    ['.case-list article', [['.case-logo', 0, 0, 'scale'], [':scope > div:last-child', 110, 0]]],
    ['.showcase-head', [['.label', 0, 0], ['h2', 90, 0], ['.showcase-controls', 220, 0]]]
  ];

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.replace('sr-wait', 'sr-in');
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  plan.forEach(([groupSel, items]) => $$(groupSel).forEach(group => {
    if (group.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already visible
    items.forEach(([sel, start, step, variant]) => {
      (sel ? $$(sel, group) : [group]).forEach((el, i) => {
        el.classList.add('sr');
        if (variant) el.classList.add('sr-' + variant);
        el.style.setProperty('--d', start + i * step + 'ms');
      });
    });
    group.classList.add('sr-wait');
    io.observe(group);
  }));
})();
