// "Ask my portfolio": a little cloud pet in the corner that opens a chat answered by /api/ask
// (functions/api/ask.js). It pops up after 2 seconds and its eyes follow the cursor.
(() => {
  if (document.querySelector('.pet')) return;

  const TEXT = {
    en: {
      greet: 'Hi! I’m Habeeb’s AI. Got a question about his skills or projects? Ask me.',
      title: 'Ask about Habeeb', sub: 'From his CV and case studies',
      help: 'How can I help you?',
      // [short label, the question it sends]
      chips: [['Python for ML?', 'Has he used Python for machine learning?'], ['React projects?', 'Which of his projects use React?'], ['His role at FGVT?', 'What does he do at FGVT?'], ['How to contact him?', 'How can I contact him?']],
      placeholder: 'Ask something…', open: 'Ask Habeeb’s AI assistant', close: 'Close', send: 'Send question', dismiss: 'Dismiss',
      offTopic: 'I can only answer questions about Habeeb’s skills, projects and experience. Try “Has he used Docker?”',
      visitorLimit: 'That’s the 5 questions for today. For anything else, email Habeeb at abdulhabeeb9731@gmail.com.',
      dailyLimit: 'I’ve answered a lot of questions today. Please come back tomorrow, or email Habeeb at abdulhabeeb9731@gmail.com.',
      error: 'Something went wrong on my side. Please try again in a moment, or email abdulhabeeb9731@gmail.com.',
      left: n => n === 1 ? '1 question left today' : `${n} questions left today`,
    },
    de: {
      greet: 'Hi! Ich bin Habeebs KI. Fragen zu seinen Fähigkeiten oder Projekten? Frag mich.',
      title: 'Frag nach Habeeb', sub: 'Aus Lebenslauf und Fallstudien',
      help: 'Wie kann ich helfen?',
      chips: [['Python für ML?', 'Hat er Python für maschinelles Lernen genutzt?'], ['React-Projekte?', 'Welche seiner Projekte nutzen React?'], ['Seine Rolle bei FGVT?', 'Was macht er bei FGVT?'], ['Wie erreiche ich ihn?', 'Wie kann ich ihn erreichen?']],
      placeholder: 'Frag etwas…', open: 'Habeebs KI-Assistenten fragen', close: 'Schließen', send: 'Frage senden', dismiss: 'Ausblenden',
      offTopic: 'Ich beantworte nur Fragen zu Habeebs Fähigkeiten, Projekten und Erfahrung. Probier zum Beispiel „Hat er Docker genutzt?“',
      visitorLimit: 'Das waren die 5 Fragen für heute. Für alles Weitere schreib Habeeb an abdulhabeeb9731@gmail.com.',
      dailyLimit: 'Heute wurden schon viele Fragen gestellt. Komm morgen wieder oder schreib Habeeb an abdulhabeeb9731@gmail.com.',
      error: 'Da ist etwas schiefgelaufen. Versuch es gleich noch einmal oder schreib an abdulhabeeb9731@gmail.com.',
      left: n => n === 1 ? 'Heute noch 1 Frage' : `Heute noch ${n} Fragen`,
    },
  };
  const t = () => TEXT[document.documentElement.lang === 'de' ? 'de' : 'en'];
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  const eye = (x) => `<g class="pet-eye" data-cx="${x}" data-cy="47"><ellipse cx="${x}" cy="47" rx="10.5" ry="12.5" fill="#fff"/><g class="pet-pupil"><ellipse cx="${x}" cy="47" rx="6.4" ry="8" fill="#141629"/><circle cx="${x - 2.2}" cy="43.6" r="2.3" fill="#fff"/></g></g>`;
  const cloud = `<svg class="pet-body" viewBox="0 0 100 92" aria-hidden="true">
    <defs>
      <linearGradient id="petFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#73c3f8"/><stop offset=".5" stop-color="#9fb6f6"/><stop offset=".85" stop-color="#f3a2cd"/></linearGradient>
      <radialGradient id="petShine" cx=".32" cy=".22" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="petGoo"><feGaussianBlur in="SourceGraphic" stdDeviation="3.2"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9"/></filter>
    </defs>
    <g filter="url(#petGoo)"><g class="pet-shape"><circle cx="35" cy="26" r="17"/><circle cx="64" cy="25" r="18"/><circle cx="18" cy="49" r="16"/><circle cx="82" cy="48" r="16"/><circle cx="33" cy="72" r="17"/><circle cx="67" cy="72" r="17"/><circle cx="50" cy="50" r="31"/></g></g>
    <ellipse cx="38" cy="30" rx="26" ry="18" fill="url(#petShine)"/>
    ${eye(37)}${eye(63)}
  </svg>`;

  const root = document.createElement('div');
  root.className = 'pet';
  root.innerHTML = `
    <div class="pet-panel" role="dialog" aria-modal="false" aria-labelledby="petTitle" hidden>
      <div class="pet-head">
        <div><p class="pet-title" id="petTitle"></p><p class="pet-sub"></p></div>
        <button class="pet-x" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="pet-stage">
        <div class="pet-log" aria-live="polite"></div>
        <div class="pet-intro"><p class="pet-help"></p><div class="pet-chips"></div></div>
        <form class="pet-form">
          <input type="text" maxlength="300" autocomplete="off" />
          <button class="pet-send" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></button>
        </form>
        <p class="pet-meta"></p>
      </div>
    </div>
    <div class="pet-bubble" hidden><p></p><button class="pet-bubble-x" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg></button></div>
    <button class="pet-button" type="button" aria-expanded="false">${cloud}</button>`;
  document.body.append(root);

  const $ = s => root.querySelector(s);
  const panel = $('.pet-panel'), bubble = $('.pet-bubble'), petBtn = $('.pet-button');
  const log = $('.pet-log'), intro = $('.pet-intro'), chips = $('.pet-chips');
  const form = $('.pet-form'), input = form.querySelector('input'), send = $('.pet-send'), meta = $('.pet-meta');

  function syncText() {
    const x = t();
    $('.pet-title').textContent = x.title;
    $('.pet-sub').textContent = x.sub;
    $('.pet-help').textContent = x.help;
    bubble.querySelector('p').textContent = x.greet;
    input.placeholder = x.placeholder;
    input.setAttribute('aria-label', x.placeholder);
    petBtn.setAttribute('aria-label', x.open);
    $('.pet-x').setAttribute('aria-label', x.close);
    $('.pet-bubble-x').setAttribute('aria-label', x.dismiss);
    send.setAttribute('aria-label', x.send);
    chips.replaceChildren(...x.chips.map(([label, q]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.dataset.q = q; return b; }));
    if (meta.dataset.count > 0) meta.textContent = x.left(+meta.dataset.count);
  }
  syncText();
  new MutationObserver(syncText).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // --- Pop up after 2 seconds, greet once per visit ---
  setTimeout(() => {
    root.classList.add('is-in');
    if (!store.get('pet-greeted')) setTimeout(() => { if (panel.hidden) { bubble.hidden = false; requestAnimationFrame(() => bubble.classList.add('is-in')); } }, 500);
  }, 2000);

  const hideBubble = () => { bubble.classList.remove('is-in'); store.set('pet-greeted', '1'); setTimeout(() => { bubble.hidden = true; }, 250); };

  function open() {
    hideBubble();
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    root.classList.add('is-open');
    petBtn.setAttribute('aria-expanded', 'true');
    // On phones, wait for a tap on the field so the keyboard doesn't cover the panel straight away.
    if (!input.disabled && matchMedia('(pointer: fine)').matches) input.focus({ preventScroll: true });
  }
  function close() {
    panel.classList.remove('is-open');
    root.classList.remove('is-open');
    petBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 260);
  }
  petBtn.addEventListener('click', () => (panel.hidden ? open() : close()));
  bubble.addEventListener('click', e => { if (e.target.closest('.pet-bubble-x')) hideBubble(); else open(); });
  $('.pet-x').addEventListener('click', () => { close(); petBtn.focus({ preventScroll: true }); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { close(); petBtn.focus({ preventScroll: true }); } });

  // --- Eyes follow the cursor; on touch screens they glance around now and then ---
  const eyes = [...root.querySelectorAll('.pet-eye')].map(g => ({ g, pupil: g.querySelector('.pet-pupil') }));
  const svg = root.querySelector('.pet-body');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target = null, frame = 0;
  function look() {
    frame = 0;
    if (!target) return;
    const box = svg.getBoundingClientRect();
    const scale = box.width / 100;
    for (const { g, pupil } of eyes) {
      const ex = box.left + g.dataset.cx * scale, ey = box.top + g.dataset.cy * scale;
      const dx = target.x - ex, dy = target.y - ey, d = Math.hypot(dx, dy) || 1;
      const r = Math.min(4.2, d / 30);
      pupil.setAttribute('transform', `translate(${(dx / d * r).toFixed(2)} ${(dy / d * r * 1.1).toFixed(2)})`);
    }
  }
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { target = { x: e.clientX, y: e.clientY }; if (!frame) frame = requestAnimationFrame(look); } }, { passive: true });
  if (!matchMedia('(pointer: fine)').matches && !reduced) {
    setInterval(() => {
      if (document.hidden) return;
      const box = svg.getBoundingClientRect();
      target = { x: box.left + (Math.random() - .5) * 400, y: box.top + (Math.random() - .6) * 300 };
      look();
    }, 2600);
  }
  if (!reduced) {
    (function blink() {
      setTimeout(() => { root.classList.add('is-blinking'); setTimeout(() => { root.classList.remove('is-blinking'); blink(); }, 140); }, 2500 + Math.random() * 3500);
    })();
  }

  // --- Chat ---
  const history = [];
  let busy = false;

  // Plain text with links and email addresses made clickable; never parsed as HTML.
  function fill(el, text) {
    const re = /(https?:\/\/[^\s)]+[^\s).,;:!?'"’”])|([\w.+-]+@[\w-]+\.[\w.]+\w)/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      el.append(text.slice(last, m.index));
      const a = document.createElement('a');
      if (m[1]) {
        a.href = m[1];
        if (!/^https:\/\/abdulhabeeb\.com(\/|$)/.test(m[1])) { a.target = '_blank'; a.rel = 'noopener'; }
        a.textContent = m[1].replace(/^https?:\/\//, '').replace(/\/$/, '');
      } else {
        a.href = 'mailto:' + m[2];
        a.textContent = m[2];
      }
      el.append(a);
      last = m.index + m[0].length;
    }
    el.append(text.slice(last));
  }

  function say(role, text, extra = '') {
    const el = document.createElement('p');
    el.className = `pet-msg is-${role}${extra ? ' ' + extra : ''}`;
    if (text) fill(el, text);
    log.append(el);
    root.classList.add('has-chat');
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function lock(reason) {
    input.disabled = true;
    send.disabled = true;
    meta.textContent = '';
    meta.dataset.count = '0';
    if (reason) say('bot', reason, 'is-note');
  }

  async function ask(question) {
    question = question.trim().slice(0, 300);
    if (!question || busy || input.disabled) return;
    busy = true;
    send.disabled = true;
    say('user', question);
    input.value = '';
    const wait = say('bot', '', 'is-wait');
    wait.innerHTML = '<i></i><i></i><i></i>';
    root.classList.add('is-thinking');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });
      const data = await res.json().catch(() => ({}));
      wait.remove();
      if (res.status === 429) return lock(data.error === 'daily_limit' ? t().dailyLimit : t().visitorLimit);
      if (!res.ok) { say('bot', t().error, 'is-note'); return; }
      if (data.on_topic) {
        say('bot', data.answer);
        history.push({ role: 'user', content: question }, { role: 'assistant', content: data.answer });
        history.splice(0, Math.max(0, history.length - 8));
      } else {
        say('bot', t().offTopic, 'is-note');
      }
      if (typeof data.remaining === 'number') {
        if (data.remaining <= 0) return lock(t().visitorLimit);
        meta.dataset.count = data.remaining;
        meta.textContent = t().left(data.remaining);
      }
    } catch {
      wait.remove();
      say('bot', t().error, 'is-note');
    } finally {
      busy = false;
      root.classList.remove('is-thinking');
      if (!input.disabled) { send.disabled = false; input.focus({ preventScroll: true }); }
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  chips.addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.dataset.q || b.textContent); });
})();
