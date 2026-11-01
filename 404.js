/* 404: the monster leans toward the cursor, the digits drift the other way, and a click makes it hop. */
(() => {
  const char = document.querySelector('.nf-char');
  if (!char || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const monster = char.querySelector('.nf-monster');
  const digits = [...document.querySelectorAll('.nf-digits span')];

  // Wrap the image so the lean doesn't fight its own keyframe animations.
  const lean = document.createElement('div');
  lean.className = 'nf-lean';
  monster.before(lean); lean.append(monster);

  const hop = () => { char.classList.remove('is-hop'); void char.offsetWidth; char.classList.add('is-hop'); };
  char.addEventListener('click', hop);
  char.addEventListener('animationend', e => { if (e.animationName === 'nfHop') char.classList.remove('is-hop'); });

  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let raf = 0, x = 0, y = 0;
  addEventListener('pointermove', e => { x = e.clientX / innerWidth - .5; y = e.clientY / innerHeight - .5; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
  document.addEventListener('pointerleave', () => { x = y = 0; if (!raf) raf = requestAnimationFrame(apply); });
  function apply() {
    raf = 0;
    lean.style.setProperty('--lean', (x * 6).toFixed(2) + 'deg');
    lean.style.setProperty('--shift', (x * 10).toFixed(1) + 'px');
    digits.forEach((d, i) => { d.style.translate = `${(-x * (10 + i * 6)).toFixed(1)}px ${(-y * 8).toFixed(1)}px`; d.style.transition = 'translate .6s cubic-bezier(.22,1,.36,1)'; });
  }
})();
