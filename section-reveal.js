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
    ['.showcase-head', [['.label', 0, 0], ['h2', 90, 0], ['.showcase-controls', 220, 0]]],
    ['.testimonials-head', [['.label', 0, 0], ['h2', 90, 0], ['.testimonials-controls', 220, 0]]],
    ['.testimonial-track', [['.testimonial-card', 120, 110, 'scale']]],
    ['.timeline .section-head', [['.label', 0, 0], ['h2', 90, 0]]],
    ['.timeline-list article', [[':scope > span', 0, 0], [':scope > div', 80, 0], [':scope > p', 170, 0]]],
    // Case-study pages
    ['.cs-meta', [[':scope > div', 0, 70]]],
    ['.cs-page :is(.cs-panel, .cs-plain)', [[':scope > .label', 0, 0], [':scope > h2', 90, 0], [':scope > .cs-lede', 180, 0], [':scope > .cs-quote', 150, 0]]],
    ['.cs-split', [[':scope > article', 0, 140]]],
    ['.cs-cards', [['.cs-card', 0, 100]]],
    ['.cs-page .cs-shot:not(.cs-phone-stage .cs-shot)', [['', 0, 0, 'scale']]],
    ['.cs-phone-stage', [['', 0, 0, 'scale']]],
    ['.cs-phone-copy', [['.label', 0, 0], ['h3', 80, 0], [':scope > p', 160, 0], ['li', 240, 60, 'x']]],
    ['.cs-list', [['li', 0, 60]]],
    ['.cs-stack', [['span', 0, 25, 'scale']]],
    ['.cs-chart', [['.cs-chart-head', 0, 0], ['.cs-chart-ctl', 120, 0], ['.cs-chart-src', 300, 0]]],
    ['.cs-next', [['', 0, 0, 'stage']]]
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
