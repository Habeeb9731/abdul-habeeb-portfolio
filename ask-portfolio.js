// "Ask my portfolio" chat box. The answers come from /api/ask (functions/api/ask.js).
(() => {
  const form = document.getElementById('askForm');
  if (!form) return;
  const input = document.getElementById('askInput');
  const log = document.getElementById('askLog');
  const chips = document.getElementById('askChips');
  const meta = document.getElementById('askMeta');
  const send = form.querySelector('.ask-send');

  const TEXT = {
    en: {
      placeholder: 'Ask about skills, projects or experience',
      offTopic: 'I can only answer questions about Habeeb’s skills, projects and experience. Try “Has he used Docker?”',
      visitorLimit: 'That’s the 5 questions for today. For anything else, email Habeeb at abdulhabeeb9731@gmail.com.',
      dailyLimit: 'I’ve answered a lot of questions today. Please come back tomorrow, or email Habeeb at abdulhabeeb9731@gmail.com.',
      error: 'Something went wrong on my side. Please try again in a moment, or email abdulhabeeb9731@gmail.com.',
      left: n => n === 1 ? '1 question left today' : `${n} questions left today`,
      thinking: 'Looking through the CV and case studies…',
    },
    de: {
      placeholder: 'Frag nach Fähigkeiten, Projekten oder Erfahrung',
      offTopic: 'Ich beantworte nur Fragen zu Habeebs Fähigkeiten, Projekten und Erfahrung. Probier zum Beispiel „Hat er Docker genutzt?“',
      visitorLimit: 'Das waren die 5 Fragen für heute. Für alles Weitere schreib Habeeb an abdulhabeeb9731@gmail.com.',
      dailyLimit: 'Heute wurden schon viele Fragen gestellt. Komm morgen wieder oder schreib Habeeb an abdulhabeeb9731@gmail.com.',
      error: 'Da ist etwas schiefgelaufen. Versuch es gleich noch einmal oder schreib an abdulhabeeb9731@gmail.com.',
      left: n => n === 1 ? 'Heute noch 1 Frage' : `Heute noch ${n} Fragen`,
      thinking: 'Ich schaue in Lebenslauf und Fallstudien…',
    },
  };
  const t = () => TEXT[document.documentElement.lang === 'de' ? 'de' : 'en'];
  const syncLang = () => { input.placeholder = t().placeholder; };
  syncLang();
  new MutationObserver(syncLang).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

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
        const sameSite = /^https:\/\/abdulhabeeb\.com(\/|$)/.test(m[1]);
        if (!sameSite) { a.target = '_blank'; a.rel = 'noopener'; }
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

  function bubble(role, text, extra = '') {
    const el = document.createElement('p');
    el.className = `ask-msg is-${role}${extra ? ' ' + extra : ''}`;
    if (text) fill(el, text);
    log.append(el);
    log.hidden = false;
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function lock(reason) {
    input.disabled = true;
    send.disabled = true;
    chips.hidden = true;
    meta.textContent = '';
    if (reason) bubble('bot', reason, 'is-note');
  }

  async function ask(question) {
    question = question.trim().slice(0, 300);
    if (!question || busy) return;
    busy = true;
    send.disabled = true;
    chips.hidden = true;
    bubble('user', question);
    input.value = '';
    const wait = bubble('bot', t().thinking, 'is-wait');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });
      const data = await res.json().catch(() => ({}));
      wait.remove();
      if (res.status === 429) return lock(data.error === 'daily_limit' ? t().dailyLimit : t().visitorLimit);
      if (!res.ok) { bubble('bot', t().error, 'is-note'); return; }
      if (data.on_topic) {
        bubble('bot', data.answer);
        history.push({ role: 'user', content: question }, { role: 'assistant', content: data.answer });
        history.splice(0, Math.max(0, history.length - 8));
      } else {
        bubble('bot', t().offTopic, 'is-note');
      }
      if (typeof data.remaining === 'number') {
        if (data.remaining <= 0) return lock(t().visitorLimit);
        meta.textContent = t().left(data.remaining);
      }
    } catch {
      wait.remove();
      bubble('bot', t().error, 'is-note');
    } finally {
      busy = false;
      if (!input.disabled) { send.disabled = false; input.focus({ preventScroll: true }); }
    }
  }

  log.hidden = true;
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  chips.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) ask(b.textContent);
  });
})();
