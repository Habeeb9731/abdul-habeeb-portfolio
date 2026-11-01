/* 404: the monster leans toward the cursor, the digits drift the other way (only while hovering them), and a click makes it hop. */
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
  // React only while the pointer is over the 404 and the monster, then ease back to rest.
  const stage = document.querySelector('.nf-stage');
  let raf = 0, x = 0, y = 0;
  const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    x = (e.clientX - r.left) / r.width - .5; y = (e.clientY - r.top) / r.height - .5;
    queue();
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { x = y = 0; queue(); });
  function apply() {
    raf = 0;
    lean.style.setProperty('--lean', (x * 8).toFixed(2) + 'deg');
    lean.style.setProperty('--shift', (x * 12).toFixed(1) + 'px');
    digits.forEach((d, i) => { d.style.translate = `${(-x * (12 + i * 7)).toFixed(1)}px ${(-y * 10).toFixed(1)}px`; d.style.transition = 'translate .6s cubic-bezier(.22,1,.36,1)'; });
  }
})();
