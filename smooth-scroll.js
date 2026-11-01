/* Smooth, weighted page scrolling (Lenis). Touch keeps native scrolling;
   skipped entirely for reduced-motion users. */
(() => {
  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  window.lenis = lenis;
  const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // Same-page anchor links glide too, honouring each target's scroll-margin-top.
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const ease = t => 1 - Math.pow(1 - t, 4);
    // Lazy images above the target can load mid-glide and push it down; re-aim until it settles.
    let tries = 0;
    const go = duration => lenis.scrollTo(target, { offset: -margin, duration, easing: ease, force: true, onComplete: () => {
      const off = target.getBoundingClientRect().top - margin;
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1;
      if (Math.abs(off) > 2 && !atBottom && tries++ < 4) { lenis.resize(); go(0.45); }
    } });
    lenis.resize();
    go(1.2);
    history.pushState(null, '', id);
  });
})();
