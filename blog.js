/* Blog: reading progress, contents highlight and one-time card reveals. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bar = document.querySelector('.bl-progress');
  const label = bar && bar.querySelector('b');
  const article = document.querySelector('.bl-article');
  const cover = document.querySelector('.bl-post-hero');
  // The bar steps aside once "Keep reading" (or, without it, the contact section) fills half the screen.
  const footer = document.querySelector('.bl-more') || document.querySelector('#contact') || document.querySelector('footer');
  if (bar && article) {
    let raf = 0;
    const update = () => {
      raf = 0;
      // Counts from the moment the cover has scrolled away (0%) to the end of the article (100%).
      const coverBottom = cover ? cover.getBoundingClientRect().bottom : article.getBoundingClientRect().top;
      const read = -coverBottom;
      const left = article.getBoundingClientRect().bottom - innerHeight;
      const p = Math.max(0, Math.min(1, read / Math.max(1, read + left)));
      bar.style.setProperty('--p', p.toFixed(4));
      const atFooter = footer && footer.getBoundingClientRect().top < innerHeight / 2;
      bar.classList.toggle('is-started', coverBottom <= 0 && !atFooter);
      const text = Math.round(p * 100) + '%';
      if (label && label.textContent !== text) label.textContent = text;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    update();
  }

  const links = [...document.querySelectorAll('.bl-toc a')];
  if (links.length) {
    const setActive = id => links.forEach(a => a.classList.toggle('is-active', a.hash === '#' + id));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -75% 0px' });
    links.forEach(a => { const t = document.querySelector(a.hash); if (t) io.observe(t); });
  }

  // Listing: featured carousel.
  const carousel = document.querySelector('.bl-carousel');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.bl-slide')];
    const dots = [...carousel.querySelectorAll('.bl-dots button')];
    const box = carousel.querySelector('.bl-slides');
    let at = 0, timer = 0, inView = true, swiped = false, startX = null;
    const go = i => {
      at = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === at));
      dots.forEach((d, n) => n === at ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    const start = () => {
      stop();
      if (!reduce && inView && slides.length > 1 && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) timer = setInterval(() => go(at + 1), 7000);
    };
    dots.forEach((d, n) => d.addEventListener('click', () => { go(n); stop(); }));
    carousel.addEventListener('pointerenter', stop);
    carousel.addEventListener('pointerleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', () => setTimeout(start));
    box.addEventListener('pointerdown', e => { startX = e.clientX; swiped = false; });
    box.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 45) { swiped = true; go(at + (dx < 0 ? 1 : -1)); }
    });
    box.addEventListener('click', e => { if (swiped) { e.preventDefault(); swiped = false; } });
    box.addEventListener('dragstart', e => e.preventDefault());
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : stop(); }, { threshold: .4 }).observe(carousel);
    start();
  }

  // Listing: search, topic filter, sort and paging.
  const grid = document.getElementById('blGrid');
  if (grid) {
    const PAGE = 12;
    const all = [...grid.querySelectorAll('.bl-card')];
    const more = document.getElementById('blMore');
    const empty = document.getElementById('blEmpty');
    const buttons = [...document.querySelectorAll('.bl-filters button')];
    const input = document.getElementById('blSearch');
    const results = document.getElementById('blResults');
    const sort = document.getElementById('blSort');
    const words = { en: ['Search posts', 'See all %n results', 'No posts match that search.'], de: ['Beiträge suchen', 'Alle %n Ergebnisse', 'Keine Beiträge gefunden.'] };
    const say = i => words[document.documentElement.lang === 'de' ? 'de' : 'en'][i];
    const label = () => { input.placeholder = say(0); input.setAttribute('aria-label', say(0)); };
    label();
    new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    const text = new Map(all.map(c => [c, c.textContent.toLowerCase()]));
    let tag = '', shown = PAGE, query = '';
    const terms = () => query.toLowerCase().split(/\s+/).filter(Boolean);
    const found = () => { const t = terms(); return all.filter(c => t.every(w => text.get(c).includes(w))); };
    const render = () => {
      // Featured posts already sit in the carousel, so they only join the grid when filtering or searching.
      const browsing = !tag && !query;
      const match = found().filter(c => (!tag || c.dataset.tag === tag) && !(browsing && c.dataset.hero));
      all.forEach(c => { c.hidden = true; });
      match.slice(0, shown).forEach(c => { c.hidden = false; c.classList.remove('is-wait'); c.classList.add('is-in'); });
      more.hidden = match.length <= shown;
      empty.hidden = match.length > 0;
    };
    const toGrid = () => { results.hidden = true; document.getElementById('posts').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
    const showResults = () => {
      results.replaceChildren();
      if (!query) { results.hidden = true; return; }
      const hits = found();
      if (!hits.length) { const p = document.createElement('p'); p.textContent = say(2); results.append(p); }
      hits.slice(0, 6).forEach(c => {
        const a = document.createElement('a'); a.href = c.getAttribute('href');
        const small = document.createElement('small'); small.textContent = c.dataset.tag + ' · ' + c.querySelector('.bl-meta span').textContent;
        a.append(c.querySelector('h3').textContent, small); results.append(a);
      });
      if (hits.length > 6) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'bl-results-all';
        b.textContent = say(1).replace('%n', hits.length); b.addEventListener('click', toGrid); results.append(b);
      }
      results.hidden = false;
    };
    input.addEventListener('input', () => { query = input.value.trim(); shown = PAGE; render(); showResults(); });
    input.addEventListener('focus', showResults);
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { results.hidden = true; }
      if (e.key === 'Enter' && query) { e.preventDefault(); toGrid(); }
      if (e.key === 'ArrowDown') { const a = results.querySelector('a'); if (a) { e.preventDefault(); a.focus(); } }
    });
    results.addEventListener('keydown', e => {
      const items = [...results.querySelectorAll('a')]; const i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { results.hidden = true; input.focus(); }
      if (e.key === 'ArrowDown' && i > -1) { e.preventDefault(); (items[i + 1] || items[i]).focus(); }
      if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); (items[i - 1] || input).focus(); }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.bl-search')) results.hidden = true; });
    buttons.forEach(b => b.addEventListener('click', () => {
      tag = b.dataset.filter; shown = PAGE;
      buttons.forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
      render();
    }));
    sort.addEventListener('change', () => {
      all.sort((a, b) => (sort.value === 'old' ? 1 : -1) * a.dataset.date.localeCompare(b.dataset.date));
      all.forEach(c => grid.append(c)); shown = PAGE; render();
    });
    more.addEventListener('click', () => { shown += PAGE; render(); });
    render();
  }

  if (reduce) return;
  const cards = [...document.querySelectorAll('.bl-reveal')].filter(c => !c.hidden && c.getBoundingClientRect().top > innerHeight * 0.9);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.replace('is-wait', 'is-in'); io.unobserve(e.target);
  }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  cards.forEach((c, i) => { c.classList.add('is-wait'); c.style.setProperty('--d', (i % 3) * 90 + 'ms'); io.observe(c); });
})();
