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
  }), { threshold: 0, rootMargin: '0px 0px -8% 0px' }); // fire as soon as a group's top edge is in view, regardless of its height

  // Challenge & solution: call-and-response. Each challenge is answered by its solution.
  const tag = (el, delay, variant) => { if (!el) return; el.classList.add('sr'); if (variant) el.classList.add('sr-' + variant); el.style.setProperty('--d', Math.round(delay) + 'ms'); };
  const arm = g => { g.classList.add('sr-wait'); io.observe(g); };
  $$('.cs-split').forEach(split => {
    if (split.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    const ch = split.querySelector('article:not(.is-solution)'), so = split.querySelector('article.is-solution');
    if (!ch || !so) return;
    const chLi = $$('li', ch), soLi = $$('li', so);
    if (window.matchMedia('(max-width: 900px)').matches) {
      // Stacked: each card reveals on its own when it scrolls into view.
      tag(ch, 0, 'left'); tag(ch.querySelector('.label'), 120); tag(ch.querySelector('h3'), 200);
      chLi.forEach((li, i) => tag(li, 340 + i * 130, 'x'));
      tag(so, 0, 'flood'); tag(so.querySelector('.label'), 420); tag(so.querySelector('h3'), 490);
      soLi.forEach((li, i) => tag(li, 620 + i * 140, 'xr'));
      arm(ch); arm(so);
    } else {
      tag(ch, 0, 'left'); tag(ch.querySelector('.label'), 120); tag(ch.querySelector('h3'), 200);
      tag(so, 260, 'flood'); tag(so.querySelector('.label'), 680); tag(so.querySelector('h3'), 750);
      chLi.forEach((li, i) => tag(li, 900 + i * 480, 'x'));
      soLi.forEach((li, i) => tag(li, 1140 + i * 480, 'xr'));
      arm(split);
    }
  });

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
