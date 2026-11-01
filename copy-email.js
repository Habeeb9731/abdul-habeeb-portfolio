/* Contact: copy the email address to the clipboard, with a brief "Copied" confirmation. */
(() => {
  const words = { en: ['Copy email address', 'Copied', 'Copy failed'], de: ['E-Mail-Adresse kopieren', 'Kopiert', 'Kopieren fehlgeschlagen'] };
  const t = i => (words[document.documentElement.lang === 'de' ? 'de' : 'en'])[i];

  const copy = async text => {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch {}
    ta.remove(); return ok;
  };

  document.querySelectorAll('.copy-email').forEach(btn => {
    const tip = btn.querySelector('.copy-tip');
    let timer;
    const label = () => btn.setAttribute('aria-label', t(0));
    label();
    new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    btn.addEventListener('click', async () => {
      const ok = await copy(btn.dataset.copy);
      tip.textContent = t(ok ? 1 : 2);
      btn.classList.toggle('is-copied', ok);
      btn.classList.add('is-tip');
      clearTimeout(timer);
      timer = setTimeout(() => btn.classList.remove('is-copied', 'is-tip'), 1800);
    });
  });
})();
