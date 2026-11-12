// "Ask my portfolio": a little cloud pet in the corner that opens a chat answered by /api/ask
// (functions/api/ask.js). It pops up after 2 seconds and its eyes follow the cursor.
(() => {
  if (document.querySelector('.pet')) return;

  const TEXT = {
    en: {
      greet: 'Hi! I’m Habeeb’s AI. Got a question about his skills or projects? Ask me.',
      title: 'Ask about Habeeb', sub: 'From his CV and case studies',
      help: 'How can I help you?',
      // Suggested questions are answered right here, without the API: [label, question, answer, buttons].
      // Buttons: 'p:<project id>' opens a case study, 'c:<contact>' a way to reach him.
      chips: [
        ['Python for ML?', 'Has he used Python for machine learning?', 'Yes. In depower he forecasts Germany’s day-ahead electricity prices every day with LightGBM quantile models in Python, and in AnimeRec he built a hybrid recommender (EASE, ALS and sentence embeddings) on 23.2 million MyAnimeList interactions.', ['p:depower', 'p:anime-recommender']],
        ['React projects?', 'Which of his projects use React?', 'APEX F1 Analytics and the Autonomous Data Analyst are both built with React and TypeScript. He also built client web apps with React as a front-end developer at Zephyr Technologies.', ['p:apex-f1-analytics', 'p:autonomous-data-analyst']],
        ['His role at FGVT?', 'What does he do at FGVT?', 'He’s been a Research Assistant at the FGVT research group (Forschungsgruppe Verkehrstelematik) at htw saar in Saarbrücken since 2025. He analyses transportation data, cleans and structures datasets for statistics and machine learning, and builds visualizations and reports for research partners.', []],
        ['How to contact him?', 'How can I contact him?', 'Email is the quickest way to reach Habeeb. He’s also on LinkedIn and GitHub, or you can use the contact section on this page.', ['c:email', 'c:linkedin', 'c:github', 'c:contact_section']],
      ],
      contactLabels: { email: 'Email', linkedin: 'LinkedIn', github: 'GitHub', contact_section: 'Contact section' },
      view: 'View', placeholder: 'Ask something…', open: 'Ask Habeeb’s AI assistant', close: 'Close', clear: 'Clear chat', copy: 'Copy email', copied: 'Copied', send: 'Send question', dismiss: 'Dismiss',
      offTopic: 'I can only answer questions about Habeeb’s skills, projects and experience. Try “Has he used Docker?”',
      limited: 'To prevent abuse, chats are limited. Want to know more? Have a look through his projects, or get in touch with him directly.',
      seeProjects: 'See projects', contact: 'Contact him',
      error: 'Something went wrong on my side. Please try again in a moment, or email abdulhabeeb9731@gmail.com.',
    },
    de: {
      greet: 'Hi! Ich bin Habeebs KI. Fragen zu seinen Fähigkeiten oder Projekten? Frag mich.',
      title: 'Frag nach Habeeb', sub: 'Aus Lebenslauf und Fallstudien',
      help: 'Wie kann ich helfen?',
      chips: [
        ['Python für ML?', 'Hat er Python für maschinelles Lernen genutzt?', 'Ja. In depower prognostiziert er täglich die deutschen Day-Ahead-Strompreise mit LightGBM-Quantilmodellen in Python, und für AnimeRec hat er einen hybriden Recommender (EASE, ALS und Satz-Embeddings) auf 23,2 Millionen MyAnimeList-Interaktionen gebaut.', ['p:depower', 'p:anime-recommender']],
        ['React-Projekte?', 'Welche seiner Projekte nutzen React?', 'APEX F1 Analytics und der Autonomous Data Analyst sind beide mit React und TypeScript gebaut. Außerdem hat er als Frontend-Entwickler bei Zephyr Technologies Webanwendungen für Kunden mit React umgesetzt.', ['p:apex-f1-analytics', 'p:autonomous-data-analyst']],
        ['Seine Rolle bei FGVT?', 'Was macht er bei FGVT?', 'Seit 2025 ist er wissenschaftlicher Mitarbeiter in der Forschungsgruppe Verkehrstelematik (FGVT) der htw saar in Saarbrücken. Er analysiert Verkehrsdaten, bereitet Datensätze für Statistik und maschinelles Lernen auf und erstellt Visualisierungen und Berichte für Forschungspartner.', []],
        ['Wie erreiche ich ihn?', 'Wie kann ich ihn erreichen?', 'Am schnellsten erreichst du Habeeb per E-Mail. Er ist auch auf LinkedIn und GitHub, oder du nutzt den Kontaktbereich auf dieser Seite.', ['c:email', 'c:linkedin', 'c:github', 'c:contact_section']],
      ],
      contactLabels: { email: 'E-Mail', linkedin: 'LinkedIn', github: 'GitHub', contact_section: 'Kontaktbereich' },
      view: 'Zu', placeholder: 'Frag etwas…', open: 'Habeebs KI-Assistenten fragen', close: 'Schließen', clear: 'Chat leeren', copy: 'E-Mail kopieren', copied: 'Kopiert', send: 'Frage senden', dismiss: 'Ausblenden',
      offTopic: 'Ich beantworte nur Fragen zu Habeebs Fähigkeiten, Projekten und Erfahrung. Probier zum Beispiel „Hat er Docker genutzt?“',
      limited: 'Um Missbrauch zu verhindern, ist der Chat begrenzt. Mehr erfährst du in seinen Projekten, oder du schreibst ihm direkt.',
      seeProjects: 'Zu den Projekten', contact: 'Kontakt',
      error: 'Da ist etwas schiefgelaufen. Versuch es gleich noch einmal oder schreib an abdulhabeeb9731@gmail.com.',
    },
  };
  const t = () => TEXT[document.documentElement.lang === 'de' ? 'de' : 'en'];
  const PROJECT_TITLES = { depower: 'depower', 'anime-recommender': 'AnimeRec', 'apex-f1-analytics': 'APEX F1 Analytics', 'autonomous-data-analyst': 'Autonomous Data Analyst' };
  const CONTACT_LINKS = { email: 'mailto:abdulhabeeb9731@gmail.com', linkedin: 'https://www.linkedin.com/in/abdulhabeeb9731/', github: 'https://github.com/Habeeb9731', contact_section: '#contact' };
  const contactButton = id => CONTACT_LINKS[id] && { label: t().contactLabels[id], href: CONTACT_LINKS[id] };
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  // A soft 3D cloud: the puffy outline is a gooey union of circles used as a mask, and the volume comes
  // from layered gradients inside it (light from the top left, a pink glow low down, darker edges).
  const eye = (x) => `<g class="pet-eye" data-cx="${x}" data-cy="46">
      <ellipse cx="${x}" cy="47.6" rx="11.2" ry="13" fill="#3b4f9e" opacity=".28" filter="url(#petSoft)"/>
      <ellipse cx="${x}" cy="46" rx="10.4" ry="12.4" fill="url(#petWhite)"/>
      <g class="pet-pupil"><ellipse cx="${x}" cy="46.6" rx="6.2" ry="7.8" fill="url(#petIris)"/><ellipse cx="${x - 2.1}" cy="42.8" rx="2.1" ry="2.5" fill="#fff"/><circle cx="${x + 2.4}" cy="50" r=".9" fill="#fff" opacity=".55"/></g>
    </g>`;
  const cloud = `<svg class="pet-body" viewBox="0 0 100 92" aria-hidden="true">
    <defs>
      <filter id="petGoo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4.6"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 26 -11"/></filter>
      <filter id="petSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>
      <filter id="petBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4.5"/></filter>
      <mask id="petMask" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="112"><g filter="url(#petGoo)" fill="#fff"><circle cx="37" cy="27" r="19"/><circle cx="63" cy="26" r="20"/><circle cx="20" cy="50" r="17.5"/><circle cx="80" cy="49" r="17.5"/><circle cx="34" cy="72" r="18.5"/><circle cx="66" cy="72" r="18.5"/><circle cx="50" cy="50" r="33"/></g></mask>
      <linearGradient id="petBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#78c6fb"/><stop offset=".42" stop-color="#8dbaf8"/><stop offset=".7" stop-color="#b9a9f1"/><stop offset="1" stop-color="#f3a4cf"/></linearGradient>
      <radialGradient id="petBlush" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9cc9" stop-opacity=".95"/><stop offset=".6" stop-color="#f7a6d2" stop-opacity=".5"/><stop offset="1" stop-color="#f7a6d2" stop-opacity="0"/></radialGradient>
      <radialGradient id="petVolume" cx=".44" cy=".36" r=".68"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2c3f9a" stop-opacity=".48"/></radialGradient>
      <radialGradient id="petWhite" cx=".45" cy=".35" r=".7"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#dfe3f3"/></radialGradient>
      <radialGradient id="petIris" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="#2d3352"/><stop offset="1" stop-color="#05061a"/></radialGradient>
    </defs>
    <g mask="url(#petMask)">
      <rect x="-10" y="-10" width="120" height="112" fill="url(#petBase)"/>
      <ellipse cx="52" cy="80" rx="40" ry="22" fill="url(#petBlush)"/>
      <rect x="-10" y="-10" width="120" height="112" fill="url(#petVolume)"/>
      <ellipse cx="36" cy="22" rx="20" ry="10" fill="#fff" opacity=".55" filter="url(#petBlur)"/>
      <ellipse cx="70" cy="86" rx="22" ry="7" fill="#fff" opacity=".22" filter="url(#petBlur)"/>
    </g>
    ${eye(37)}${eye(63)}
  </svg>`;

  const root = document.createElement('div');
  root.className = 'pet';
  root.innerHTML = `
    <div class="pet-panel" role="dialog" aria-modal="false" aria-labelledby="petTitle" data-lenis-prevent hidden>
      <div class="pet-head">
        <div><p class="pet-title" id="petTitle"></p><p class="pet-sub"></p></div>
        <div class="pet-tools">
          <button class="pet-clear pet-x" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/></svg></button>
          <button class="pet-close pet-x" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        </div>
      </div>
      <div class="pet-stage">
        <div class="pet-log" aria-live="polite"></div>
        <div class="pet-intro"><p class="pet-help"></p><div class="pet-chips"></div></div>
        <form class="pet-form">
          <input type="text" maxlength="300" autocomplete="off" />
          <button class="pet-send" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></button>
        </form>
      </div>
    </div>
    <div class="pet-bubble" hidden><p></p><button class="pet-bubble-x" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg></button></div>
    <button class="pet-button" type="button" aria-expanded="false">${cloud}</button>`;
  document.body.append(root);

  const $ = s => root.querySelector(s);
  const panel = $('.pet-panel'), bubble = $('.pet-bubble'), petBtn = $('.pet-button');
  const log = $('.pet-log'), intro = $('.pet-intro'), chips = $('.pet-chips');
  const form = $('.pet-form'), input = form.querySelector('input'), send = $('.pet-send');

  function syncText() {
    const x = t();
    $('.pet-title').textContent = x.title;
    $('.pet-sub').textContent = x.sub;
    $('.pet-help').textContent = x.help;
    bubble.querySelector('p').textContent = x.greet;
    input.placeholder = input.disabled ? '' : x.placeholder;
    input.setAttribute('aria-label', x.placeholder);
    petBtn.setAttribute('aria-label', x.open);
    $('.pet-close').setAttribute('aria-label', x.close);
    $('.pet-clear').setAttribute('aria-label', x.clear);
    $('.pet-clear').title = x.clear;
    $('.pet-bubble-x').setAttribute('aria-label', x.dismiss);
    send.setAttribute('aria-label', x.send);
    chips.replaceChildren(...x.chips.map(([label], i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.dataset.i = i; return b; }));
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
  $('.pet-close').addEventListener('click', () => { close(); petBtn.focus({ preventScroll: true }); });
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
  // While the cursor is over the panel the page behind never scrolls. The wheel only moves the
  // conversation, and only while it has room to move in that direction.
  panel.addEventListener('wheel', e => {
    const canScroll = log.contains(e.target) && (e.deltaY < 0 ? log.scrollTop > 0 : log.scrollTop + log.clientHeight < log.scrollHeight - 1);
    if (!canScroll) e.preventDefault();
  }, { passive: false });
  const history = [];
  let busy = false;

  // Owner pass: opening the site once with ?ask_owner=<key> stores the key in this browser, and the
  // chat sends it so the server skips the limits. ?ask_owner=off removes it.
  let ownerKey = null;
  try {
    const url = new URL(location.href);
    const given = url.searchParams.get('ask_owner');
    if (given) {
      if (given === 'off') localStorage.removeItem('ask-owner'); else localStorage.setItem('ask-owner', given);
      url.searchParams.delete('ask_owner');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
    ownerKey = localStorage.getItem('ask-owner');
  } catch { /* storage blocked */ }

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

  // Copies the email address and confirms for a moment.
  function copyButton(address) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pet-copy';
    const label = () => { b.textContent = t().copy; b.insertAdjacentHTML('beforeend', ' <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6.7a2.2 2.2 0 0 0-2.2-2.2H6.7a2.2 2.2 0 0 0-2.2 2.2v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8"/></svg>'); };
    label();
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(address); }
      catch {
        const ta = Object.assign(document.createElement('textarea'), { value: address });
        document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
      }
      b.textContent = t().copied;
      b.insertAdjacentHTML('beforeend', ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4 4 9-9"/></svg>');
      b.classList.add('is-done');
      clearTimeout(b._t);
      b._t = setTimeout(() => { b.classList.remove('is-done'); label(); }, 1600);
    });
    return b;
  }

  // A row of pill buttons under a message: [{ label, href }]. Links to sections on this page close the panel.
  function buttons(after, items) {
    const row = document.createElement('div');
    row.className = 'pet-links';
    for (const item of items) {
      if (!item) continue;
      const { label, href } = item;
      const external = /^https?:/.test(href);
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      if (external) { a.target = '_blank'; a.rel = 'noopener'; }
      a.insertAdjacentHTML('beforeend', ` <span aria-hidden="true">${external || href.startsWith('mailto:') ? '↗' : '→'}</span>`);
      if (href.startsWith('#')) a.addEventListener('click', close);
      row.append(a);
      if (href.startsWith('mailto:')) row.append(copyButton(href.slice(7)));
    }
    if (row.children.length) { after.after(row); log.scrollTop = log.scrollHeight; }
  }

  // Out of questions (per visitor or for the whole site today): no counts, just where to go next.
  function showLimit() {
    const x = t();
    buttons(say('bot', x.limited, 'is-note'), [{ label: x.seeProjects, href: '#projects' }, { label: x.contact, href: '#contact' }]);
  }
  function lock() {
    if (input.disabled) return;
    input.disabled = true;
    send.disabled = true;
    input.placeholder = '';
    showLimit();
  }

  // Clear: back to the start screen. The daily limit is kept on the server, so a locked chat stays locked.
  $('.pet-clear').addEventListener('click', () => {
    if (busy) return;
    log.replaceChildren();
    history.length = 0;
    root.classList.remove('has-chat');
    if (input.disabled) showLimit();
    else if (matchMedia('(pointer: fine)').matches) input.focus({ preventScroll: true });
  });

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
        headers: { 'content-type': 'application/json', ...(ownerKey ? { 'x-ask-owner': ownerKey } : {}) },
        body: JSON.stringify({ question, history }),
      });
      const data = await res.json().catch(() => ({}));
      wait.remove();
      if (res.status === 429) return lock();
      if (!res.ok) { say('bot', t().error, 'is-note'); return; }
      if (data.on_topic) {
        const msg = say('bot', data.answer);
        const projects = Array.isArray(data.projects) ? data.projects.filter(p => p && typeof p.url === 'string' && p.url.startsWith('/projects/')) : [];
        const contacts = Array.isArray(data.contacts) ? data.contacts : [];
        buttons(msg, [...projects.map(p => ({ label: `${t().view} ${p.title}`, href: p.url })), ...contacts.map(contactButton)]);
        history.push({ role: 'user', content: question }, { role: 'assistant', content: data.answer });
        history.splice(0, Math.max(0, history.length - 8));
      } else {
        say('bot', t().offTopic, 'is-note');
      }
      if (data.remaining === 0) lock();
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
  // Suggested questions: answered instantly from the text above, free and outside the daily limit.
  chips.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || busy) return;
    const [, question, answer, links] = t().chips[b.dataset.i];
    busy = true;
    say('user', question);
    const wait = say('bot', '', 'is-wait');
    wait.innerHTML = '<i></i><i></i><i></i>';
    setTimeout(() => {
      wait.remove();
      buttons(say('bot', answer), links.map(l => l.startsWith('p:')
        ? { label: `${t().view} ${PROJECT_TITLES[l.slice(2)]}`, href: `/projects/${l.slice(2)}/` }
        : contactButton(l.slice(2))));
      history.push({ role: 'user', content: question }, { role: 'assistant', content: answer });
      history.splice(0, Math.max(0, history.length - 8));
      busy = false;
    }, 550);
  });
})();
