/* Interactive charts for case-study pages. Plain SVG/HTML, no dependencies.
   Each <figure class="cs-chart" data-chart="…"> reads its data from #cs-chart-data. */
(() => {
const DATA_EL = document.getElementById('cs-chart-data');
if (!DATA_EL) return;
const DATA = JSON.parse(DATA_EL.textContent);
const NS = 'http://www.w3.org/2000/svg';

const I18N = {
  en: { anNdcg: 'NDCG@10', anRecall: 'Recall@10', anPrecision: 'Precision@10', anModel: 'Model', anHybrid: 'Hybrid', anEase: 'EASE', anAls: 'ALS', anRecent: 'Recent popularity', anContent: 'Content only', anPopularity: 'All-time popularity', anTitles: 'Titles in history', anUsers: 'users', anAmongCold: 'Among new titles only', anFullCat: 'Full catalog', points: 'Points', gap: 'Gap to leader', round: 'Round', pts: 'pts', leader: 'Leader', lap: 'Lap', laps: 'laps',
        soft: 'Soft', medium: 'Medium', hard: 'Hard', table: 'View as table', driver: 'Driver', stint: 'Stint', compound: 'Compound',
        quality: 'Data quality score', issues: 'issues found', high: 'High', med: 'Medium', low: 'Low', severity: 'Severity', count: 'Count', types: 'Issue types',
        completeness: 'Completeness', uniqueness: 'Uniqueness', validity: 'Validity', consistency: 'Consistency', dimension: 'Dimension', score: 'Score',
        raw: 'As uploaded', clean: 'After standardising', canonical: 'Canonical label', variant: 'Case variant', segment: 'customer_segment', rows: 'rows',
        fw: 'Firmware: 40–60% band', single: 'Single 40% threshold', hour: 'Hour', moisture: 'Soil moisture', pump: 'Pump A', on: 'on', off: 'off',
        switches: 'pump starts in 48 h', band: 'Hysteresis band', threshold: 'Threshold', time: 'Time',
        temp: 'Temperature', hum: 'Humidity', soil: 'Soil A', water: 'Water level', light: 'Light',
        fan: 'Fan', growlight: 'Grow light', blocked: 'blocked', holding: 'holding', ideal: 'Target range',
        rFanHot: 'temperature above 28 °C', rFanCold: 'temperature below 18 °C', rFanHum: 'humidity above 80 %', rFanDry: 'humidity below 40 %', rFanOk: 'climate within range',
        rPumpOn: 'soil below 40 %', rPumpOff: 'soil above 60 %', rPumpHold: 'between 40 and 60 % — keeps its last state', rPumpBlocked: 'reservoir low (> 4.5 cm)',
        rLight: 'brightness follows ambient light', distance: 'distance to water',
        dpModel: 'Model (P50)', dpPrev: 'Same hour, previous day', dpWeek: 'Same hour, last week', dpModelS: 'Model', dpPrevS: 'Previous day', dpWeekS: 'Last week', dpErr: 'Error (MAE)', dpCov: 'Range coverage', dpTarget: 'Target 80%', dpInRange: 'in range', dpHours: 'hours', dpMonth: 'Month', dpInput: 'Input', dpSees: 'Can see', dpWhy: 'Why', dpCut: 'Cutoff 11:30 · auction 12:00', dpD2: 'Two days before', dpD1: 'Day before', dpD0: 'Delivery day', dpIssued: 'Issued', dpPeriod: 'Period', normal: 'Middle 90% of prices', negative: 'Negative prices', spike: 'Highest 5% of prices', dpUnit: 'EUR/MWh' },
  de: { anNdcg: 'NDCG@10', anRecall: 'Recall@10', anPrecision: 'Precision@10', anModel: 'Modell', anHybrid: 'Hybrid', anEase: 'EASE', anAls: 'ALS', anRecent: 'Aktuelle Beliebtheit', anContent: 'Nur Inhalt', anPopularity: 'Beliebtheit insgesamt', anTitles: 'Titel im Verlauf', anUsers: 'Nutzer', anAmongCold: 'Nur unter neuen Titeln', anFullCat: 'Gesamter Katalog', points: 'Punkte', gap: 'Abstand zur Spitze', round: 'Runde', pts: 'Pkt.', leader: 'Führend', lap: 'Runde', laps: 'Runden',
        soft: 'Soft', medium: 'Medium', hard: 'Hard', table: 'Als Tabelle anzeigen', driver: 'Fahrer', stint: 'Stint', compound: 'Mischung',
        quality: 'Datenqualitäts-Score', issues: 'gefundene Probleme', high: 'Hoch', med: 'Mittel', low: 'Niedrig', severity: 'Schwere', count: 'Anzahl', types: 'Problemtypen',
        completeness: 'Vollständigkeit', uniqueness: 'Eindeutigkeit', validity: 'Gültigkeit', consistency: 'Konsistenz', dimension: 'Dimension', score: 'Score',
        raw: 'Wie hochgeladen', clean: 'Nach Vereinheitlichung', canonical: 'Kanonische Bezeichnung', variant: 'Schreibvariante', segment: 'customer_segment', rows: 'Zeilen',
        fw: 'Firmware: 40–60 %-Band', single: 'Einzelner 40 %-Schwellwert', hour: 'Stunde', moisture: 'Bodenfeuchte', pump: 'Pumpe A', on: 'an', off: 'aus',
        switches: 'Pumpenstarts in 48 h', band: 'Hysterese-Band', threshold: 'Schwellwert', time: 'Zeit',
        temp: 'Temperatur', hum: 'Luftfeuchte', soil: 'Boden A', water: 'Wasserstand', light: 'Licht',
        fan: 'Lüfter', growlight: 'Pflanzenlampe', blocked: 'gesperrt', holding: 'hält', ideal: 'Zielbereich',
        rFanHot: 'Temperatur über 28 °C', rFanCold: 'Temperatur unter 18 °C', rFanHum: 'Luftfeuchte über 80 %', rFanDry: 'Luftfeuchte unter 40 %', rFanOk: 'Klima im Zielbereich',
        rPumpOn: 'Boden unter 40 %', rPumpOff: 'Boden über 60 %', rPumpHold: 'zwischen 40 und 60 % — behält den letzten Zustand', rPumpBlocked: 'Tank fast leer (> 4,5 cm)',
        rLight: 'Helligkeit folgt dem Umgebungslicht', distance: 'Abstand zum Wasser',
        dpModel: 'Modell (P50)', dpPrev: 'Gleiche Stunde, Vortag', dpWeek: 'Gleiche Stunde, Vorwoche', dpModelS: 'Modell', dpPrevS: 'Vortag', dpWeekS: 'Vorwoche', dpErr: 'Fehler (MAE)', dpCov: 'Bereichsabdeckung', dpTarget: 'Ziel 80 %', dpInRange: 'im Bereich', dpHours: 'Stunden', dpMonth: 'Monat', dpInput: 'Eingabe', dpSees: 'Darf sehen', dpWhy: 'Warum', dpCut: 'Stichzeit 11:30 · Auktion 12:00', dpD2: 'Zwei Tage davor', dpD1: 'Vortag', dpD0: 'Liefertag', dpIssued: 'Erstellt', dpPeriod: 'Zeitraum', normal: 'Mittlere 90 % der Preise', negative: 'Negative Preise', spike: 'Höchste 5 % der Preise', dpUnit: 'EUR/MWh' }
};
const lang = () => (document.documentElement.lang === 'de' ? 'de' : 'en');
const t = k => I18N[lang()][k] ?? I18N.en[k] ?? k;
const fmt = (v, d = 0) => Number(v).toLocaleString(lang() === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: d });

const css = name => getComputedStyle(document.body).getPropertyValue(name).trim();
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
};
const div = (cls, parent, text) => {
  const n = document.createElement('div');
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  if (parent) parent.appendChild(n);
  return n;
};
// Tag a mark for the one-time entrance animation (classes only do anything while the figure is animating).
const A = (node, cls, delay = 0, extra) => { node.classList.add(cls); node.style.setProperty('--d', Math.round(delay) + 'ms'); if (extra) for (const k in extra) node.style.setProperty(k, extra[k]); return node; };
const niceStep = (range, count) => {
  const raw = range / count, mag = 10 ** Math.floor(Math.log10(raw)), r = raw / mag;
  return (r > 5 ? 10 : r > 2 ? 5 : r > 1 ? 2 : 1) * mag;
};

/* ---------- shared tooltip ---------- */
function tooltip(host) {
  const tip = div('cs-tt', host);
  tip.setAttribute('role', 'status');
  return {
    show(rows, header, x, y) {
      tip.replaceChildren();
      if (header) div('cs-tt-h', tip, header);
      for (const r of rows) {
        const row = div('cs-tt-r', tip);
        if (r.color) { const k = div('cs-tt-k', row); k.style.background = r.color; if (r.box) k.classList.add('is-box'); }
        div('cs-tt-v', row, r.value);
        if (r.label) div('cs-tt-l', row, r.label);
      }
      tip.classList.add('is-on');
      const hw = host.clientWidth, tw = tip.offsetWidth, th = tip.offsetHeight;
      let left = x + 14; if (left + tw > hw - 4) left = x - tw - 14; if (left < 4) left = 4;
      let top = y - th - 12; if (top < 4) top = y + 16;
      tip.style.transform = `translate(${left}px,${top}px)`;
    },
    hide() { tip.classList.remove('is-on'); }
  };
}

/* ---------- segmented toggle + legend + table ---------- */
function toggle(host, options, current, onChange) {
  const g = div('cs-seg', host); g.setAttribute('role', 'group');
  options.forEach(([val, label]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label; b.setAttribute('aria-pressed', String(val === current));
    b.addEventListener('click', () => { if (val !== current) onChange(val); });
    g.appendChild(b);
  });
  return g;
}
function legend(host, items, opts = {}) {
  const lg = div('cs-legend', host);
  items.forEach(it => {
    const b = document.createElement(opts.toggle ? 'button' : 'span');
    b.className = 'cs-legend-item';
    if (opts.toggle) { b.type = 'button'; b.setAttribute('aria-pressed', String(!it.hidden)); b.addEventListener('click', () => opts.toggle(it.id)); }
    const sw = document.createElement('i'); sw.className = it.line ? 'is-line' : 'is-box'; sw.style.background = it.color;
    b.appendChild(sw); b.appendChild(document.createTextNode(it.label));
    lg.appendChild(b);
  });
  return lg;
}
function table(fig, head, rows) {
  let d = fig.querySelector('details.cs-chart-table');
  const open = d ? d.open : false;
  if (d) d.remove();
  d = document.createElement('details'); d.className = 'cs-chart-table'; d.open = open;
  const s = document.createElement('summary'); s.textContent = t('table'); d.appendChild(s);
  const wrap = div('cs-table-wrap', d); wrap.setAttribute('data-lenis-prevent', '');
  const tb = document.createElement('table'); wrap.appendChild(tb);
  const tr = document.createElement('tr'); head.forEach(h => { const th = document.createElement('th'); th.textContent = h; tr.appendChild(th); });
  const thead = document.createElement('thead'); thead.appendChild(tr); tb.appendChild(thead);
  const tbody = document.createElement('tbody');
  rows.forEach(r => { const row = document.createElement('tr'); r.forEach(c => { const td = document.createElement('td'); td.textContent = c; row.appendChild(td); }); tbody.appendChild(row); });
  tb.appendChild(tbody);
  fig.appendChild(d);
}

/* ================= APEX — championship points (line) ================= */
const apexState = { mode: 'points', hidden: new Set() };
function apexPoints(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  const rerender = () => apexPoints(fig, D);
  toggle(ctl, [['points', t('points')], ['gap', t('gap')]], apexState.mode, v => { apexState.mode = v; rerender(); });
  const colors = D.series.map((_, i) => css('--c' + (i + 1)));
  legend(ctl, D.series.map((s, i) => ({ id: s.id, label: s.name, color: colors[i], line: true, hidden: apexState.hidden.has(s.id) })),
    { toggle: id => { if (apexState.hidden.has(id)) apexState.hidden.delete(id); else if (apexState.hidden.size < D.series.length - 1) apexState.hidden.add(id); rerender(); } });

  const n = D.rounds.length;
  const leader = D.rounds.map((_, r) => Math.max(...D.series.map(s => s.values[r])));
  const val = (s, r) => apexState.mode === 'gap' ? s.values[r] - leader[r] : s.values[r];
  const vis = D.series.map((s, i) => ({ s, i, c: colors[i] })).filter(o => !apexState.hidden.has(o.s.id));

  const W = plot.clientWidth, narrow = W < 560;
  const H = Math.round(Math.max(260, Math.min(400, W * 0.48)));
  const m = { l: 40, r: narrow ? 64 : 120, t: 14, b: 30 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  let lo = 0, hi = 0;
  vis.forEach(o => D.rounds.forEach((_, r) => { const v = val(o.s, r); lo = Math.min(lo, v); hi = Math.max(hi, v); }));
  const step = niceStep((hi - lo) || 1, 5);
  lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi = lo + step;
  const x = r => m.l + (r / (n - 1)) * iw, y = v => m.t + (1 - (v - lo) / (hi - lo)) * ih;

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  for (let v = lo; v <= hi + 1e-9; v += step) {
    el('line', { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: v === 0 ? 'cs-ax' : 'cs-grid' }, svg);
    el('text', { x: m.l - 8, y: y(v) + 4, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = fmt(v);
  }
  const every = W < 420 ? 6 : W < 720 ? 3 : 2;
  D.rounds.forEach((rd, r) => {
    if (r % every && r !== n - 1) return;
    el('text', { x: x(r), y: H - 8, class: 'cs-tick', 'text-anchor': 'middle' }, svg).textContent = rd.code;
  });
  vis.forEach(o => {
    const d = D.rounds.map((_, r) => `${r ? 'L' : 'M'}${x(r).toFixed(1)},${y(val(o.s, r)).toFixed(1)}`).join('');
    A(el('path', { d, class: 'cs-line', stroke: o.c, pathLength: 1 }, svg), 'a-draw', o.i * 140);
  });
  // End labels with leader lines when they would collide.
  const ends = vis.map(o => ({ o, y0: y(val(o.s, n - 1)), v: val(o.s, n - 1) })).sort((a, b) => a.y0 - b.y0);
  const gapMin = 17; ends.forEach((e, i) => { e.y = i ? Math.max(e.y0, ends[i - 1].y + gapMin) : e.y0; });
  const over = ends.length ? ends[ends.length - 1].y - (m.t + ih) : 0; if (over > 0) ends.forEach(e => (e.y -= over));
  ends.forEach(e => {
    const xe = x(n - 1), lx = xe + 16;
    const ld = 1500 + ends.indexOf(e) * 90;
    if (Math.abs(e.y - e.y0) > 1) A(el('path', { d: `M${xe + 6},${e.y0}L${xe + 11},${e.y0}L${lx - 3},${e.y}`, class: 'cs-leader' }, svg), 'a-fade', ld);
    const tx = A(el('text', { x: lx, y: e.y + 4, class: 'cs-endlabel' }, svg), 'a-fade', ld);
    const a = document.createElementNS(NS, 'tspan'); a.textContent = narrow ? e.o.s.code : e.o.s.name.split(' ').pop(); tx.appendChild(a);
    const b = document.createElementNS(NS, 'tspan'); b.setAttribute('class', 'cs-endval'); b.setAttribute('dx', '6'); b.textContent = fmt(e.v); tx.appendChild(b);
    A(el('circle', { cx: xe, cy: e.y0, r: 4, fill: e.o.c, class: 'cs-dot' }, svg), 'a-pop', ld - 120);
  });
  // Crosshair
  const cross = el('line', { y1: m.t, y2: m.t + ih, class: 'cs-cross' }, svg);
  const dots = vis.map(o => el('circle', { r: 4, fill: o.c, class: 'cs-dot cs-hover-dot' }, svg));
  const tip = tooltip(plot);
  const hit = el('rect', { x: m.l, y: m.t, width: iw, height: ih, class: 'cs-hit', tabindex: 0 }, svg);
  let cur = n - 1;
  const show = r => {
    cur = r; const cx = x(r);
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); svg.classList.add('is-hover');
    vis.forEach((o, i) => { dots[i].setAttribute('cx', cx); dots[i].setAttribute('cy', y(val(o.s, r))); });
    const rows = vis.map(o => ({ v: val(o.s, r), o })).sort((a, b) => b.v - a.v)
      .map(({ v, o }) => ({ color: o.c, value: apexState.mode === 'gap' ? (v === 0 ? t('leader') : fmt(v)) : `${fmt(v)} ${t('pts')}`, label: o.s.name }));
    const ys = Math.min(...vis.map(o => y(val(o.s, r))));
    tip.show(rows, `${t('round')} ${r + 1} · ${D.rounds[r][lang()]}`, cx, ys);
  };
  const fromEvent = e => { const b = svg.getBoundingClientRect(); return Math.max(0, Math.min(n - 1, Math.round(((e.clientX - b.left) - m.l) / iw * (n - 1)))); };
  hit.addEventListener('pointermove', e => show(fromEvent(e)));
  hit.addEventListener('pointerdown', e => show(fromEvent(e)));
  const hide = () => { svg.classList.remove('is-hover'); tip.hide(); };
  hit.addEventListener('pointerleave', hide); hit.addEventListener('blur', hide);
  hit.addEventListener('focus', () => show(cur));
  hit.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { show(Math.min(n - 1, cur + 1)); e.preventDefault(); } if (e.key === 'ArrowLeft') { show(Math.max(0, cur - 1)); e.preventDefault(); } });

  table(fig, [t('round'), ...D.series.map(s => s.name)], D.rounds.map((rd, r) => [`${r + 1} · ${rd[lang()]}`, ...D.series.map(s => fmt(s.values[r]))]));
}

/* ================= APEX — tire strategy (gantt) ================= */
function apexStints(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  const cc = { SOFT: css('--tire-soft'), MEDIUM: css('--tire-medium'), HARD: css('--tire-hard') };
  const ink = { SOFT: '#fff', MEDIUM: '#0b0b0b', HARD: '#0b0b0b' };
  const nm = c => t(c.toLowerCase());
  legend(ctl, ['SOFT', 'MEDIUM', 'HARD'].map(c => ({ label: nm(c), color: cc[c] })));
  const W = plot.clientWidth, narrow = W < 520, row = 30, bh = 18;
  const m = { l: narrow ? 58 : 128, r: 12, t: 6, b: 30 };
  const H = m.t + D.drivers.length * row + m.b, iw = W - m.l - m.r;
  const x = lap => m.l + (lap / D.laps) * iw;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  for (let l = 0; l <= D.laps; l += 10) {
    el('line', { x1: x(l), x2: x(l), y1: m.t, y2: H - m.b, class: 'cs-grid' }, svg);
    if (W - m.r - x(l) > (narrow ? 62 : 70)) el('text', { x: x(l), y: H - 10, class: 'cs-tick', 'text-anchor': 'middle' }, svg).textContent = l;
  }
  el('text', { x: W - m.r, y: H - 10, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = `${D.laps} ${t('laps')}`;
  const tip = tooltip(plot);
  D.drivers.forEach((d, i) => {
    const cy = m.t + i * row + row / 2;
    const lab = el('text', { x: m.l - 10, y: cy + 4, class: 'cs-rowlabel', 'text-anchor': 'end' }, svg);
    const p = document.createElementNS(NS, 'tspan'); p.setAttribute('class', 'cs-rowpos'); p.textContent = `P${d.pos} `; lab.appendChild(p);
    lab.appendChild(document.createTextNode(narrow ? d.code : d.name));
    d.stints.forEach(([c, a, b], k) => {
      const x0 = x(a - 1) + (k ? 1 : 0), x1 = x(b) - (k < d.stints.length - 1 ? 1 : 0); // 2px surface gap at each pit stop
      const g = el('g', { class: 'cs-mark', tabindex: 0 }, svg);
      el('rect', { x: x0, y: cy - row / 2, width: x1 - x0, height: row, fill: 'transparent' }, g);
      const sd = i * 70 + (a / D.laps) * 700;
      A(el('rect', { x: x0, y: cy - bh / 2, width: Math.max(1, x1 - x0), height: bh, rx: 4, fill: cc[c], class: c === 'HARD' ? 'cs-tire-hard' : '' }, g), 'a-growx', sd);
      const label = c[0];
      if (x1 - x0 >= 22) { const tx = A(el('text', { x: x0 + 8, y: cy + 4, class: 'cs-inlabel', fill: ink[c] }, g), 'a-fade', sd + 350); tx.textContent = label; }
      const show = () => { const b2 = g.getBBox(); tip.show([{ color: cc[c], box: true, value: `${b - a + 1} ${t('laps')}`, label: `${nm(c)} · ${t('lap')} ${a}–${b}` }], `P${d.pos} · ${d.name}`, b2.x + b2.width / 2, b2.y + 6); };
      g.addEventListener('pointerenter', show); g.addEventListener('focus', show);
      g.addEventListener('pointerleave', () => tip.hide()); g.addEventListener('blur', () => tip.hide());
    });
  });
  const rows = []; D.drivers.forEach(d => d.stints.forEach(([c, a, b], k) => rows.push([`P${d.pos} ${d.name}`, k + 1, nm(c), `${a}–${b}`, b - a + 1])));
  table(fig, [t('driver'), t('stint'), t('compound'), t('lap'), t('laps')], rows);
}

/* ================= ADA — quality meters + issue severity ================= */
function adaQuality(fig, D) {
  const plot = fig.querySelector('.cs-chart-plot'); plot.replaceChildren(); fig.querySelector('.cs-chart-ctl').replaceChildren();
  const top = div('cs-quality', plot);
  const hero = div('cs-hero-fig', top);
  const num = div('cs-hero-num', hero, fmt(D.score)); div('cs-hero-cap', hero, `${t('quality')} / 100`);
  if (fig.classList.contains('cs-anim-wait') || fig.classList.contains('cs-anim-in')) countUp(fig, num, D.score);
  const meters = div('cs-meters', top);
  const tip = tooltip(plot);
  D.dims.forEach(([k, v]) => {
    const r = div('cs-meter', meters); r.tabIndex = 0;
    const head = div('cs-meter-h', r); div('', head, t(k)); div('cs-meter-v', head, fmt(v));
    const track = div('cs-meter-track', r); const fill = div('cs-meter-fill', track);
    fill.style.setProperty('--w', v + '%'); fill.dataset.level = v < 60 ? 'serious' : v < 90 ? 'warning' : 'ok';
    A(fill, 'a-scalex', 250 + meters.children.length * 110);
  });
  const sev = div('cs-sevbar-wrap', plot);
  const total = D.issues.reduce((a, s) => a + s.count, 0);
  const cap = div('cs-sev-cap', sev); const strong = document.createElement('strong'); strong.textContent = fmt(total); cap.appendChild(strong); cap.appendChild(document.createTextNode(' ' + t('issues')));
  const bar = div('cs-sevbar', sev);
  const sc = { high: css('--status-critical'), med: css('--status-serious'), low: css('--status-warning') };
  D.issues.forEach(s => {
    const b = div('cs-sevblock', bar); b.tabIndex = 0; b.style.flexGrow = s.count; b.style.background = sc[s.level];
    b.dataset.level = s.level; b.textContent = fmt(s.count);
    A(b, 'a-pop', 750 + bar.children.length * 120);
    const show = () => { const pr = plot.getBoundingClientRect(), br = b.getBoundingClientRect();
      tip.show([{ color: sc[s.level], box: true, value: `${fmt(s.count)} ${t('issues')}`, label: t(s.level) }, ...s.types.map(ty => ({ value: '', label: ty }))], `${t('severity')}: ${t(s.level)}`, br.left - pr.left + br.width / 2, br.top - pr.top); };
    b.addEventListener('pointerenter', show); b.addEventListener('focus', show);
    b.addEventListener('pointerleave', () => tip.hide()); b.addEventListener('blur', () => tip.hide());
  });
  legend(sev, D.issues.map(s => ({ label: t(s.level), color: sc[s.level] })));
  table(fig, [t('dimension'), t('score')], [[t('quality'), D.score], ...D.dims.map(([k, v]) => [t(k), v]), ...D.issues.map(s => [`${t(s.level)} — ${t('types')}`, `${s.count}: ${s.types.join(', ')}`])]);
}

/* ================= ADA — category labels before/after (columns) ================= */
const adaSegState = { mode: 'raw' };
function adaSegments(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren();
  const c1 = css('--c1'), c2 = css('--c2');
  const draw = () => {
    ctl.replaceChildren();
    toggle(ctl, [['raw', t('raw')], ['clean', t('clean')]], adaSegState.mode, v => { adaSegState.mode = v; draw(); });
    legend(ctl, [{ label: t('canonical'), color: c1 }, { label: t('variant'), color: c2 }]);
    let cols = plot.querySelector('.cs-cols');
    if (!cols) {
      cols = div('cs-cols', plot);
      D.raw.forEach(([label, v, canon]) => {
        const c = div('cs-col', cols); c.dataset.label = label; c.tabIndex = 0;
        const bar = A(div('cs-col-bar', c), 'a-growy', cols.children.length * 90); div('cs-col-val', bar);
        div('cs-col-lab', c, label);
      });
    }
    const max = Math.max(...D.raw.map(r => r[1]), ...Object.values(D.clean));
    const tip = plot._tip || (plot._tip = tooltip(plot));
    cols.querySelectorAll('.cs-col').forEach(c => {
      const [label, v, canon] = D.raw.find(r => r[0] === c.dataset.label);
      const isVariant = canon !== label;
      const shown = adaSegState.mode === 'raw' ? v : (isVariant ? 0 : D.clean[label]);
      c.classList.toggle('is-gone', shown === 0);
      const bar = c.querySelector('.cs-col-bar');
      bar.style.setProperty('--h', (shown / max * 100) + '%');
      bar.style.background = isVariant ? c2 : c1;
      bar.querySelector('.cs-col-val').textContent = shown ? fmt(shown) : '';
      c.onpointerenter = c.onfocus = () => { if (!shown) return; const pr = plot.getBoundingClientRect(), br = bar.getBoundingClientRect();
        tip.show([{ color: isVariant ? c2 : c1, box: true, value: `${fmt(shown)} ${t('rows')}`, label: isVariant ? `${t('variant')} → ${canon}` : t('canonical') }], `${t('segment')} = “${label}”`, br.left - pr.left + br.width / 2, br.top - pr.top); };
      c.onpointerleave = c.onblur = () => tip.hide();
    });
    const rows = adaSegState.mode === 'raw' ? D.raw.map(([l, v]) => [l, v]) : Object.entries(D.clean);
    table(fig, [t('segment'), t('rows')], rows);
  };
  draw();
}

/* ================= EDEN — hysteresis simulation (line + pump strip) ================= */
function edenSim(mode) {
  // Deterministic: same seed for both modes so the comparison is fair. One tick = 1 minute.
  let s = 20260117; const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let q = Math.imul(s ^ (s >>> 15), 1 | s); q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q; return ((q ^ (q >>> 14)) >>> 0) / 4294967296; };
  const N = 48 * 60; let m = 58, pump = false; const pts = [], runs = []; let starts = 0, runStart = 0;
  for (let i = 0; i < N; i++) {
    const hour = (i / 60) % 24, day = Math.max(0, Math.sin((hour - 6) / 24 * 2 * Math.PI));
    m += -(0.018 + 0.03 * day) + (pump ? 0.9 : 0);
    const meas = m + (rnd() + rnd() + rnd() - 1.5) * 1.6; // sensor noise
    const next = mode === 'fw' ? (meas < 40 ? true : meas > 60 ? false : pump) : meas < 40;
    if (next && !pump) { starts++; runStart = i; }
    if (!next && pump) runs.push([runStart, i]);
    pump = next;
    if (i % 5 === 0) pts.push([i, meas]);
  }
  if (pump) runs.push([runStart, N]);
  return { N, pts, runs, starts };
}
const edenState = { mode: 'fw' };
function edenHysteresis(fig) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  toggle(ctl, [['fw', t('fw')], ['single', t('single')]], edenState.mode, v => { edenState.mode = v; edenHysteresis(fig); });
  const sim = edenSim(edenState.mode), c1 = css('--c1'), c2 = css('--c2');
  legend(ctl, [{ label: t('moisture'), color: c1, line: true }, ...(edenState.mode === 'fw' ? [{ label: t('band'), color: css('--band-swatch') }] : []), { label: `${t('pump')} ${t('on')}`, color: c2 }]);
  const stat = div('cs-stat', plot); const sn = document.createElement('strong'); sn.textContent = fmt(sim.starts); stat.appendChild(sn);
  if (fig.classList.contains('cs-anim-wait') || fig.classList.contains('cs-anim-in')) countUp(fig, sn, sim.starts, 2550, sim.runs.map(([a]) => 150 + (a / sim.N) * 2400)); stat.appendChild(document.createTextNode(' ' + t('switches')));
  const W = plot.clientWidth, H = Math.round(Math.max(240, Math.min(340, W * 0.4)));
  const m = { l: 40, r: 14, t: 10, b: 58 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
  const lo = 30, hi = 70, x = i => m.l + (i / sim.N) * iw, y = v => m.t + (1 - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * ih;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  if (edenState.mode === 'fw') A(el('rect', { x: m.l, y: y(60), width: iw, height: y(40) - y(60), class: 'cs-band' }, svg), 'a-fade', 0);
  for (let v = lo; v <= hi; v += 10) {
    el('line', { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: 'cs-grid' }, svg);
    el('text', { x: m.l - 8, y: y(v) + 4, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = v + '%';
  }
  el('line', { x1: m.l, x2: m.l + iw, y1: y(40), y2: y(40), class: 'cs-thresh' }, svg);
  if (edenState.mode === 'fw') el('line', { x1: m.l, x2: m.l + iw, y1: y(60), y2: y(60), class: 'cs-thresh' }, svg);
  A(el('path', { d: sim.pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(''), class: 'cs-line cs-line-thin', stroke: c1, pathLength: 1 }, svg), 'a-draw', 150, { '--dur': '2.4s', '--ease': 'linear' });
  // Pump strip
  const sy = H - m.b + 14, sh = 10;
  el('rect', { x: m.l, y: sy, width: iw, height: sh, rx: 3, class: 'cs-strip-track' }, svg);
  sim.runs.forEach(([a, b]) => A(el('rect', { x: x(a), y: sy, width: Math.max(1.5, x(b) - x(a)), height: sh, rx: Math.min(3, (x(b) - x(a)) / 2), fill: c2 }, svg), 'a-pop', 150 + (a / sim.N) * 2400));
  el('text', { x: m.l - 8, y: sy + 9, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = 'A';
  for (let h = 0; h <= 48; h += 12) el('text', { x: x(h * 60), y: H - 8, class: 'cs-tick', 'text-anchor': h === 0 ? 'start' : h === 48 ? 'end' : 'middle' }, svg).textContent = `${h} h`;
  // Crosshair
  const cross = el('line', { y1: m.t, y2: sy + sh, class: 'cs-cross' }, svg);
  const dot = el('circle', { r: 4, fill: c1, class: 'cs-dot cs-hover-dot' }, svg);
  const tip = tooltip(plot);
  const hit = el('rect', { x: m.l, y: m.t, width: iw, height: sy + sh - m.t, class: 'cs-hit', tabindex: 0 }, svg);
  let cur = Math.floor(sim.pts.length / 2);
  const show = k => {
    cur = k; const [i, v] = sim.pts[k], cx = x(i);
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); dot.setAttribute('cx', cx); dot.setAttribute('cy', y(v)); svg.classList.add('is-hover');
    const on = sim.runs.some(([a, b]) => i >= a && i < b);
    const hh = Math.floor(i / 60), mm = String(i % 60).padStart(2, '0');
    tip.show([{ color: c1, value: `${fmt(v, 1)} %`, label: t('moisture') }, { color: on ? c2 : css('--line'), box: true, value: on ? t('on') : t('off'), label: t('pump') }], `${t('hour')} ${hh}:${mm}`, cx, y(v));
  };
  const fromEvent = e => { const b = svg.getBoundingClientRect(); return Math.max(0, Math.min(sim.pts.length - 1, Math.round(((e.clientX - b.left) - m.l) / iw * (sim.pts.length - 1)))); };
  hit.addEventListener('pointermove', e => show(fromEvent(e))); hit.addEventListener('pointerdown', e => show(fromEvent(e)));
  const hide = () => { svg.classList.remove('is-hover'); tip.hide(); };
  hit.addEventListener('pointerleave', hide); hit.addEventListener('blur', hide); hit.addEventListener('focus', () => show(cur));
  hit.addEventListener('keydown', e => { const st = 12; if (e.key === 'ArrowRight') { show(Math.min(sim.pts.length - 1, cur + st)); e.preventDefault(); } if (e.key === 'ArrowLeft') { show(Math.max(0, cur - st)); e.preventDefault(); } });
  table(fig, [t('time'), t('moisture'), t('pump')], sim.pts.filter((_, k) => k % 12 === 0).map(([i, v]) => [`${Math.floor(i / 60)}:${String(i % 60).padStart(2, '0')}`, `${fmt(v, 1)} %`, sim.runs.some(([a, b]) => i >= a && i < b) ? t('on') : t('off')]));
}

/* ================= EDEN — control playground (range chart with sliders) ================= */
const edenPlay = { temp: 24, hum: 84, soil: 52, water: 3.2, light: 420, pump: false };
function edenControls(fig) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  legend(ctl, [{ label: t('ideal'), color: css('--band-swatch') }]);
  const S = [
    { k: 'temp', unit: '°C', min: 10, max: 36, step: 0.5, band: [18, 28], d: 1 },
    { k: 'hum', unit: '%', min: 20, max: 100, step: 1, band: [40, 80], d: 0 },
    { k: 'soil', unit: '%', min: 0, max: 100, step: 1, band: [40, 60], d: 0 },
    { k: 'water', unit: 'cm', min: 1, max: 5.3, step: 0.1, band: [1, 4.5], d: 1, note: 'distance' },
    { k: 'light', unit: '', min: 0, max: 1400, step: 10, band: null, d: 0 }
  ];
  const wrap = div('cs-play', plot), rows = div('cs-play-rows', wrap), out = div('cs-play-out', wrap);
  const pct = (s, v) => (v - s.min) / (s.max - s.min) * 100;
  const update = () => {
    const st = edenPlay;
    const waterLow = st.water > 4.5;
    if (st.soil < 40) st.pump = true; else if (st.soil > 60) st.pump = false;
    const fanR = st.temp > 28 ? 'rFanHot' : st.temp < 18 ? 'rFanCold' : st.hum > 80 ? 'rFanHum' : st.hum < 40 ? 'rFanDry' : null;
    const pumpOn = st.pump && !waterLow;
    const pumpR = waterLow && st.pump ? 'rPumpBlocked' : st.soil < 40 ? 'rPumpOn' : st.soil > 60 ? 'rPumpOff' : 'rPumpHold';
    const led = Math.max(0, Math.min(100, Math.round(100 * (1 - st.light / 1000))));
    out.replaceChildren();
    const card = (name, state, on, reason, level) => {
      const c = A(div('cs-act', out), 'a-pop', 420 + out.children.length * 110); c.dataset.on = String(on); if (level) c.dataset.level = level;
      const h = div('cs-act-h', c); div('cs-act-dot', h); div('cs-act-name', h, name); div('cs-act-state', h, state);
      div('cs-act-r', c, reason);
    };
    card(t('fan'), fanR ? t('on') : t('off'), !!fanR, t(fanR || 'rFanOk'));
    card(t('pump'), waterLow && st.pump ? t('blocked') : pumpOn ? t('on') : t('off') + (pumpR === 'rPumpHold' ? '' : ''), pumpOn, t(pumpR), waterLow && st.pump ? 'blocked' : '');
    card(t('growlight'), `${led} %`, led > 0, t('rLight'));
  };
  S.forEach(s => {
    const r = A(div('cs-play-row', rows), 'a-fade', rows.children.length * 80);
    const head = div('cs-play-h', r); div('cs-play-name', head, t(s.k) + (s.note ? ` · ${t(s.note)}` : ''));
    const valEl = div('cs-play-v', head);
    const track = div('cs-play-track', r);
    if (s.band) { const b = div('cs-play-band', track); b.style.left = pct(s, s.band[0]) + '%'; b.style.width = (pct(s, s.band[1]) - pct(s, s.band[0])) + '%'; }
    const input = document.createElement('input'); input.type = 'range'; input.min = s.min; input.max = s.max; input.step = s.step; input.value = edenPlay[s.k];
    input.setAttribute('aria-label', t(s.k)); track.appendChild(input);
    const ticks = div('cs-play-ticks', r); div('', ticks, fmt(s.min, s.d) + ' ' + s.unit); div('', ticks, fmt(s.max, s.d) + ' ' + s.unit);
    const set = () => { edenPlay[s.k] = +input.value; valEl.textContent = `${fmt(edenPlay[s.k], s.d)} ${s.unit}`.trim(); track.style.setProperty('--p', pct(s, edenPlay[s.k]) + '%'); update(); };
    input.addEventListener('input', set); set();
  });
}

/* ================= depower — what the model may see (timeline) ================= */
function depowerCutoff(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  const tip = tooltip(plot), L = lang();
  const W = plot.clientWidth, narrow = W < 620, rowH = narrow ? 50 : 40;
  const m = { l: narrow ? 8 : 190, r: 8, t: 30, b: 28 };
  const iw = W - m.l - m.r, H = m.t + D.rows.length * rowH + m.b;
  const x = h => m.l + (h / 72) * iw;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  el('rect', { x: x(48), y: m.t, width: x(72) - x(48), height: H - m.t - m.b, class: 'cs-dp-day' }, svg);
  [0, 24, 48, 72].forEach(h => el('line', { x1: x(h), x2: x(h), y1: m.t, y2: H - m.b, class: 'cs-grid' }, svg));
  [[12, 'dpD2'], [36, 'dpD1'], [60, 'dpD0']].forEach(([h, k]) => { el('text', { x: x(h), y: H - 9, class: 'cs-tick', 'text-anchor': 'middle' }, svg).textContent = t(k); });
  D.rows.forEach((r, i) => {
    const y0 = m.t + i * rowH, bh = 14, by = narrow ? y0 + rowH - bh - 8 : y0 + (rowH - bh) / 2, c = r[L] || r.en;
    const g = el('g', { class: 'cs-dp-row' }, svg);
    el('rect', { x: 0, y: y0, width: W, height: rowH, class: 'cs-dp-hit' }, g);
    if (i) el('line', { x1: narrow ? 0 : m.l, x2: W - m.r, y1: y0, y2: y0, class: 'cs-grid' }, g);
    const lab = el('text', { x: narrow ? 8 : m.l - 14, y: narrow ? y0 + 18 : y0 + rowH / 2 + 4, class: 'cs-rowlabel', 'text-anchor': narrow ? 'start' : 'end' }, g); lab.textContent = c.name;
    A(el('rect', { x: x(r.from), y: by, width: x(r.to) - x(r.from), height: bh, rx: 4, fill: css('--c1') }, g), 'a-growx', 150 + i * 110);
    if (r.issued != null) {
      A(el('line', { x1: x(r.issued), x2: x(r.from), y1: by + bh / 2, y2: by + bh / 2, class: 'cs-leader' }, g), 'a-fade', 150 + i * 110);
      A(el('circle', { cx: x(r.issued), cy: by + bh / 2, r: 4, fill: css('--c1'), class: 'cs-dot' }, g), 'a-pop', 150 + i * 110);
      A(el('text', { x: x(r.issued) + 8, y: by + bh / 2 - 6, class: 'cs-tick' }, g), 'a-fade', 150 + i * 110).textContent = t('dpIssued');
    }
    const show = e => { const b = plot.getBoundingClientRect(); tip.show([{ value: c.sees }, { value: c.why }], c.name, e.clientX - b.left, e.clientY - b.top); };
    g.addEventListener('pointerenter', show); g.addEventListener('pointermove', show); g.addEventListener('pointerleave', () => tip.hide());
  });
  const cx = x(D.cutoff);
  A(el('line', { x1: cx, x2: cx, y1: m.t - 8, y2: H - m.b, class: 'cs-dp-cut' }, svg), 'a-fade', 900);
  const tl = A(el('text', { x: cx, y: m.t - 14, class: 'cs-dp-cutlabel', 'text-anchor': 'middle' }, svg), 'a-fade', 900); tl.textContent = t('dpCut');
  table(fig, [t('dpInput'), t('dpSees'), t('dpWhy')], D.rows.map(r => { const c = r[L] || r.en; return [c.name, c.sees, c.why]; }));
}

/* ================= depower — error by hour (line) ================= */
const dpHoursState = { hidden: new Set() };
function depowerHours(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  const META = { model: ['dpModel', 'dpModelS', '--c1'], baseline_prev_day: ['dpPrev', 'dpPrevS', '--c2'], baseline_prev_week: ['dpWeek', 'dpWeekS', '--c3'] };
  legend(ctl, D.series.map(s => ({ id: s.id, label: t(META[s.id][0]), color: css(META[s.id][2]), line: true, hidden: dpHoursState.hidden.has(s.id) })),
    { toggle: id => { if (dpHoursState.hidden.has(id)) dpHoursState.hidden.delete(id); else if (dpHoursState.hidden.size < D.series.length - 1) dpHoursState.hidden.add(id); depowerHours(fig, D); } });
  const vis = D.series.filter(s => !dpHoursState.hidden.has(s.id));
  const W = plot.clientWidth, narrow = W < 560, H = Math.round(Math.max(250, Math.min(360, W * 0.4)));
  const m = { l: 34, r: narrow ? 12 : 104, t: 22, b: 28 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
  const hi = 60, x = h => m.l + (h / 23) * iw, y = v => m.t + (1 - v / hi) * ih;
  const hh = h => String(h).padStart(2, '0') + ':00';
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  for (let v = 0; v <= hi; v += 15) {
    el('line', { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: v === 0 ? 'cs-ax' : 'cs-grid' }, svg);
    el('text', { x: m.l - 8, y: y(v) + 4, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = fmt(v);
  }
  for (let h = 0; h < 24; h += narrow ? 6 : 3) el('text', { x: x(h), y: H - 8, class: 'cs-tick', 'text-anchor': 'middle' }, svg).textContent = hh(h);
  vis.forEach(s => {
    const c = css(META[s.id][2]), i = D.series.indexOf(s);
    A(el('path', { d: s.values.map((v, h) => `${h ? 'L' : 'M'}${x(h).toFixed(1)},${y(v).toFixed(1)}`).join(''), class: 'cs-line', stroke: c, pathLength: 1 }, svg), 'a-draw', i * 140);
    if (!narrow) {
      const tx = A(el('text', { x: x(23) + 10, y: y(s.values[23]) + 4, class: 'cs-endlabel' }, svg), 'a-fade', 1500 + i * 90); tx.textContent = t(META[s.id][1]);
      A(el('circle', { cx: x(23), cy: y(s.values[23]), r: 4, fill: c, class: 'cs-dot' }, svg), 'a-pop', 1400 + i * 90);
    }
  });
  const model = D.series.find(s => s.id === 'model');
  if (!dpHoursState.hidden.has('model')) {
    const pk = model.values.indexOf(Math.max(...model.values));
    A(el('circle', { cx: x(pk), cy: y(model.values[pk]), r: 4, fill: css('--c1'), class: 'cs-dot' }, svg), 'a-pop', 1500);
    const pl = A(el('text', { x: x(pk), y: y(model.values[pk]) - 11, class: 'cs-endlabel', 'text-anchor': 'middle' }, svg), 'a-fade', 1550); pl.textContent = `${fmt(model.values[pk], 1)} · ${hh(pk)}`;
  }
  const tip = tooltip(plot);
  const cross = el('line', { y1: m.t, y2: m.t + ih, class: 'cs-cross', style: 'display:none' }, svg);
  const dots = vis.map(s => el('circle', { r: 4, fill: css(META[s.id][2]), class: 'cs-dot', style: 'display:none' }, svg));
  const hit = el('rect', { x: m.l, y: m.t, width: iw + 8, height: ih, fill: 'transparent' }, svg);
  const move = e => {
    const b = svg.getBoundingClientRect(), h = Math.max(0, Math.min(23, Math.round((e.clientX - b.left - m.l) / iw * 23)));
    svg.classList.add('is-hover'); cross.setAttribute('x1', x(h)); cross.setAttribute('x2', x(h)); cross.style.display = '';
    vis.forEach((s, i) => { dots[i].setAttribute('cx', x(h)); dots[i].setAttribute('cy', y(s.values[h])); dots[i].style.display = ''; });
    tip.show(vis.map(s => ({ color: css(META[s.id][2]), value: fmt(s.values[h], 1), label: t(META[s.id][1]) })), `${hh(h)} · ${t('dpUnit')}`, x(h), e.clientY - b.top);
  };
  hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move);
  hit.addEventListener('pointerleave', () => { tip.hide(); svg.classList.remove('is-hover'); cross.style.display = 'none'; dots.forEach(d => (d.style.display = 'none')); });
  table(fig, [t('hour'), t('dpModelS'), t('dpPrevS'), t('dpWeekS')], D.hours.map(h => [hh(h), ...D.series.map(s => fmt(s.values[h], 1))]));
}

/* ================= depower — error or coverage by month (bars) ================= */
const dpMonthState = { mode: 'err' };
function depowerMonths(fig, D) {
  if (fig.dataset.mode && !fig.dataset.modeApplied) { fig.dataset.modeApplied = '1'; dpMonthState.mode = fig.dataset.mode; }
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  toggle(ctl, [['err', t('dpErr')], ['cov', t('dpCov')]], dpMonthState.mode, v => { dpMonthState.mode = v; depowerMonths(fig, D); });
  const err = dpMonthState.mode === 'err';
  if (err) legend(ctl, [{ label: t('dpModelS'), color: css('--c1') }, { label: t('dpPrevS'), color: css('--c2') }]);
  const loc = lang() === 'de' ? 'de-DE' : 'en-US';
  const mon = (k, opt) => new Date(k + '-15T12:00:00Z').toLocaleDateString(loc, opt);
  const W = plot.clientWidth, H = Math.round(Math.max(240, Math.min(320, W * 0.56)));
  const m = { l: 32, r: 6, t: 18, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b, n = D.months.length;
  const hi = err ? 60 : 100, step = err ? 15 : 25, y = v => m.t + (1 - v / hi) * ih, band = iw / n;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  for (let v = 0; v <= hi; v += step) {
    el('line', { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: v === 0 ? 'cs-ax' : 'cs-grid' }, svg);
    el('text', { x: m.l - 8, y: y(v) + 4, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = fmt(v);
  }
  const bar = (bx, bw, v, c, d) => {
    const r = Math.min(4, bw / 2), top = y(v), base = y(0);
    A(el('path', { d: `M${bx},${base}V${top + r}Q${bx},${top} ${bx + r},${top}H${bx + bw - r}Q${bx + bw},${top} ${bx + bw},${top + r}V${base}Z`, fill: c }, svg), 'a-growy', d);
  };
  const tip = tooltip(plot);
  D.months.forEach((k, i) => {
    const gw = Math.min(band - 4, 34), x0 = m.l + i * band + (band - gw) / 2;
    if (err) { const bw = Math.max(2, (gw - 2) / 2); bar(x0, bw, D.model[i], css('--c1'), i * 45); bar(x0 + bw + 2, bw, D.prev[i], css('--c2'), i * 45 + 30); }
    else bar(x0, gw, D.coverage[i], css('--c1'), i * 45);
    if (W >= 460 || i % 2 === 0) el('text', { x: m.l + i * band + band / 2, y: H - 8, class: 'cs-tick', 'text-anchor': 'middle' }, svg).textContent = mon(k, { month: W < 460 ? 'narrow' : 'short', timeZone: 'UTC' }).replace('.', '');
    const h = el('rect', { x: m.l + i * band, y: m.t, width: band, height: ih, fill: 'transparent' }, svg);
    const show = e => { const b = svg.getBoundingClientRect(); const head = mon(k, { month: 'long', year: 'numeric', timeZone: 'UTC' });
      tip.show(err ? [{ color: css('--c1'), box: true, value: fmt(D.model[i], 1), label: t('dpModelS') }, { color: css('--c2'), box: true, value: fmt(D.prev[i], 1), label: t('dpPrevS') }] : [{ color: css('--c1'), box: true, value: `${fmt(D.coverage[i], 1)} %`, label: t('dpInRange') }], err ? `${head} · ${t('dpUnit')}` : head, e.clientX - b.left, e.clientY - b.top); };
    h.addEventListener('pointermove', show); h.addEventListener('pointerdown', show); h.addEventListener('pointerleave', () => tip.hide());
  });
  if (!err) {
    A(el('line', { x1: m.l, x2: m.l + iw, y1: y(80), y2: y(80), class: 'cs-dp-cut' }, svg), 'a-fade', 500);
    const tl = A(el('text', { x: m.l + iw, y: y(80) - 6, class: 'cs-dp-cutlabel', 'text-anchor': 'end' }, svg), 'a-fade', 500); tl.textContent = t('dpTarget');
  }
  table(fig, [t('dpMonth'), t('dpModelS'), t('dpPrevS'), t('dpCov')], D.months.map((k, i) => [mon(k, { month: 'short', year: 'numeric', timeZone: 'UTC' }), fmt(D.model[i], 1), fmt(D.prev[i], 1), `${fmt(D.coverage[i], 1)} %`]));
}

/* ================= depower — unusual prices (paired bars) ================= */
function depowerRegimes(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  legend(ctl, [{ label: t('dpModelS'), color: css('--c1') }, { label: t('dpPrevS'), color: css('--c2') }]);
  const W = plot.clientWidth, gh = 92, bh = 14, H = D.rows.length * gh + 4, m = { l: 0, r: 50 };
  const x = v => m.l + (v / 80) * (W - m.l - m.r);
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  const tip = tooltip(plot);
  D.rows.forEach((r, i) => {
    const y0 = i * gh, g = el('g', {}, svg);
    if (i) el('line', { x1: 0, x2: W, y1: y0, y2: y0, class: 'cs-grid' }, g);
    el('text', { x: 0, y: y0 + 22, class: 'cs-rowlabel' }, g).textContent = t(r.id);
    el('text', { x: W, y: y0 + 22, class: 'cs-tick', 'text-anchor': 'end' }, g).textContent = `${fmt(r.coverage, 1)} % ${t('dpInRange')}`;
    [[r.model, '--c1', 34], [r.prev, '--c2', 34 + bh + 3]].forEach(([v, c, o], k) => {
      A(el('rect', { x: x(0), y: y0 + o, width: x(v) - x(0), height: bh, rx: 4, fill: css(c) }, g), 'a-growx', 120 + i * 140 + k * 60);
      A(el('text', { x: x(v) + 7, y: y0 + o + 11, class: 'cs-tick' }, g), 'a-fade', 700 + i * 140).textContent = fmt(v, 2);
    });
    const h = el('rect', { x: 0, y: y0, width: W, height: gh, fill: 'transparent' }, g);
    const show = e => { const b = svg.getBoundingClientRect(); tip.show([{ color: css('--c1'), box: true, value: fmt(r.model, 2), label: t('dpModelS') }, { color: css('--c2'), box: true, value: fmt(r.prev, 2), label: t('dpPrevS') }, { value: `${fmt(r.coverage, 1)} %`, label: t('dpInRange') }], `${t(r.id)} · ${fmt(r.n)} ${t('dpHours')}`, e.clientX - b.left, e.clientY - b.top); };
    h.addEventListener('pointermove', show); h.addEventListener('pointerdown', show); h.addEventListener('pointerleave', () => tip.hide());
  });
  table(fig, [t('dpPeriod'), t('dpHours'), t('dpModelS'), t('dpPrevS'), t('dpInRange')], D.rows.map(r => [t(r.id), fmt(r.n), fmt(r.model, 2), fmt(r.prev, 2), `${fmt(r.coverage, 1)} %`]));
}

/* ================= AnimeRec — ranking quality ================= */
const AN_NAME = { hybrid: 'anHybrid', ease: 'anEase', als: 'anAls', recent: 'anRecent', content: 'anContent', popularity: 'anPopularity' };
// Labelled horizontal bars. The hybrid carries the accent; every other model stays neutral.
function animeBars(fig, rows, valueOf, hi) {
  const plot = fig.querySelector('.cs-chart-plot');
  plot.replaceChildren();
  const W = plot.clientWidth, rh = 46, bh = 12, H = rows.length * rh, r = 56;
  const x = v => (v / hi) * (W - r);
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  rows.forEach((row, i) => {
    const y0 = i * rh, v = valueOf(row), mine = row.id === 'hybrid';
    el('text', { x: 0, y: y0 + 16, class: 'cs-rowlabel', 'font-weight': mine ? 500 : 400 }, svg).textContent = t(AN_NAME[row.id]);
    el('rect', { x: 0, y: y0 + 24, width: W - r, height: bh, rx: 4, fill: css('--chart-grid') }, svg);
    A(el('rect', { x: 0, y: y0 + 24, width: x(v), height: bh, rx: 4, fill: mine ? css('--c1') : css('--muted') }, svg), 'a-growx', 120 + i * 90);
    A(el('text', { x: W, y: y0 + 34, class: 'cs-tick', 'text-anchor': 'end' }, svg), 'a-fade', 600 + i * 90).textContent = fmt(v, 4);
  });
}
const anModelsState = { metric: 'ndcg' };
function animeModels(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl');
  ctl.replaceChildren();
  const metrics = [['ndcg', 'anNdcg'], ['recall', 'anRecall'], ['precision', 'anPrecision']];
  toggle(ctl, metrics.map(([k, l]) => [k, t(l)]), anModelsState.metric, v => { anModelsState.metric = v; animeModels(fig, D); });
  const m = anModelsState.metric;
  animeBars(fig, [...D.rows].sort((a, b) => b[m] - a[m]), r => r[m], Math.max(...D.rows.map(r => r[m])));
  table(fig, [t('anModel'), ...metrics.map(([, l]) => t(l))], D.rows.map(r => [t(AN_NAME[r.id]), ...metrics.map(([k]) => fmt(r[k], 4))]));
}
const anColdState = { view: 'cold' };
function animeCold(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl');
  ctl.replaceChildren();
  toggle(ctl, [['cold', t('anAmongCold')], ['full', t('anFullCat')]], anColdState.view, v => { anColdState.view = v; animeCold(fig, D); });
  animeBars(fig, D.rows, r => r[anColdState.view], 0.15);
  table(fig, [t('anModel'), t('anAmongCold'), t('anFullCat')], D.rows.map(r => [t(AN_NAME[r.id]), fmt(r.cold, 4), fmt(r.full, 4)]));
}
function animeHistory(fig, D) {
  const ctl = fig.querySelector('.cs-chart-ctl'), plot = fig.querySelector('.cs-chart-plot');
  ctl.replaceChildren(); plot.replaceChildren();
  const COLOR = { hybrid: '--c1', recent: '--c2', popularity: '--c3' };
  legend(ctl, D.series.map(s => ({ label: t(AN_NAME[s.id]), color: css(COLOR[s.id]), line: true })));
  const W = plot.clientWidth, H = Math.round(Math.max(250, Math.min(320, W * 0.62)));
  const m = { l: 36, r: 14, t: 12, b: 44 }, iw = W - m.l - m.r, ih = H - m.t - m.b, hi = 0.25, last = D.buckets.length - 1;
  const x = i => m.l + (i / last) * iw, y = v => m.t + (1 - v / hi) * ih;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': fig.querySelector('h3')?.textContent || '' }, plot);
  for (let k = 0; k <= 5; k++) {
    const v = k * 0.05;
    el('line', { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: k ? 'cs-grid' : 'cs-ax' }, svg);
    el('text', { x: m.l - 8, y: y(v) + 4, class: 'cs-tick', 'text-anchor': 'end' }, svg).textContent = fmt(v, 2);
  }
  D.buckets.forEach((b, i) => el('text', { x: x(i), y: H - 24, class: 'cs-tick', 'text-anchor': i === 0 ? 'start' : i === last ? 'end' : 'middle' }, svg).textContent = b);
  el('text', { x: m.l + iw / 2, y: H - 4, class: 'cs-tick', 'text-anchor': 'middle' }, svg).textContent = t('anTitles');
  D.series.forEach((s, n) => {
    const c = css(COLOR[s.id]);
    A(el('path', { d: s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(''), class: 'cs-line', stroke: c, pathLength: 1 }, svg), 'a-draw', n * 140);
    s.values.forEach((v, i) => A(el('circle', { cx: x(i), cy: y(v), r: 3, fill: c }, svg), 'a-pop', 1100 + i * 60));
  });
  const tip = tooltip(plot);
  const cross = el('line', { y1: m.t, y2: m.t + ih, class: 'cs-cross', style: 'display:none' }, svg);
  const hit = el('rect', { x: m.l - 8, y: m.t, width: iw + 16, height: ih, fill: 'transparent' }, svg);
  const move = e => {
    const b = svg.getBoundingClientRect(), i = Math.max(0, Math.min(last, Math.round((e.clientX - b.left - m.l) / iw * last)));
    cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.style.display = '';
    tip.show(D.series.map(s => ({ color: css(COLOR[s.id]), value: fmt(s.values[i], 4), label: t(AN_NAME[s.id]) })), `${D.buckets[i]} · ${fmt(D.users[i])} ${t('anUsers')}`, x(i), e.clientY - b.top);
  };
  hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move);
  hit.addEventListener('pointerleave', () => { tip.hide(); cross.style.display = 'none'; });
  table(fig, [t('anTitles'), t('anUsers'), ...D.series.map(s => t(AN_NAME[s.id]))], D.buckets.map((b, i) => [b, fmt(D.users[i]), ...D.series.map(s => fmt(s.values[i], 4))]));
}

/* Count a number up from 0 when the figure's entrance plays (or show it final if it already played). */
function countUp(fig, node, target, dur = 1300, ticks) {
  const run = () => {
    const t0 = performance.now();
    // With ticks, the count steps up exactly as each mark appears; otherwise it eases up.
    const val = el => ticks ? ticks.filter(d => d <= el).length : Math.round(target * (1 - Math.pow(1 - Math.min(1, el / dur), 3)));
    const step = now => { const el = now - t0; node.textContent = fmt(Math.min(target, val(el))); if (el < dur) requestAnimationFrame(step); else node.textContent = fmt(target); };
    node.textContent = fmt(0); requestAnimationFrame(step);
  };
  if (fig.classList.contains('cs-anim-in')) return; // already counting/counted in this entrance
  node.textContent = fmt(0);
  fig.addEventListener('cs-animate', run, { once: true });
}

const RENDER = { 'apex-points': apexPoints, 'apex-stints': apexStints, 'ada-quality': adaQuality, 'ada-segments': adaSegments, 'eden-hysteresis': edenHysteresis, 'eden-controls': edenControls, 'depower-cutoff': depowerCutoff, 'depower-hours': depowerHours, 'depower-months': depowerMonths, 'depower-regimes': depowerRegimes, 'anime-models': animeModels, 'anime-history': animeHistory, 'anime-cold': animeCold };
const figs = [...document.querySelectorAll('.cs-chart[data-chart]')];
// One-time entrance: charts below the fold wait (marks hidden), then animate as they enter view.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const f = e.target; io.unobserve(f);
    f.classList.replace('cs-anim-wait', 'cs-anim-in');
    f.dispatchEvent(new Event('cs-animate'));
    setTimeout(() => f.classList.remove('cs-anim-in'), 3200);
  }), { threshold: 0.35 });
  figs.forEach(f => { if (f.getBoundingClientRect().top > window.innerHeight * 0.85) { f.classList.add('cs-anim-wait'); io.observe(f); } });
}
const renderAll = () => figs.forEach(f => { try { RENDER[f.dataset.chart]?.(f, DATA[f.dataset.chart]); } catch (e) { console.error(e); } });
renderAll();
let lastW = figs.map(f => f.clientWidth);
const ro = new ResizeObserver(() => { const w = figs.map(f => f.clientWidth); if (w.some((v, i) => Math.abs(v - lastW[i]) > 2)) { lastW = w; renderAll(); } });
figs.forEach(f => ro.observe(f));
new MutationObserver(renderAll).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
let wasDark = document.body.classList.contains('dark');
new MutationObserver(() => { const d = document.body.classList.contains('dark'); if (d !== wasDark) { wasDark = d; requestAnimationFrame(renderAll); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
