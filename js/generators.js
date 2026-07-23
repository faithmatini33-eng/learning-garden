/* ============================================================
   MATH GARDEN — skill definitions & question generators
   Every question is generated fresh, so practice never runs out.
   Aligned with 2nd-grade standards (CCSS Grade 2).
   ============================================================ */

// ---------- tiny random helpers ----------
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[ri(0, arr.length - 1)];
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build a unique multiple-choice set from a correct value + distractor maker.
function mcSet(correct, makeDistractor, n = 4) {
  const set = new Set([String(correct)]);
  let guard = 0;
  while (set.size < n && guard < 200) {
    const d = makeDistractor();
    if (d !== null && d !== undefined) set.add(String(d));
    guard++;
  }
  return { choices: shuffle([...set]), answer: String(correct) };
}

// Adaptive difficulty: gen(lvl) receives 1 (easier) · 2 (on-level) · 3 (stretch).
// clamp keeps a range valid even when a level squeezes lo past hi.
const rlvl = (lo, hi) => ri(Math.min(lo, hi), Math.max(lo, hi));

const NAMES = ['Mia', 'Leo', 'Zoe', 'Sam', 'Ava', 'Max', 'Lily', 'Noah', 'Ruby', 'Eli', 'Nora', 'Jack'];
const THINGS = [
  ['stickers', '⭐'], ['marbles', '🔵'], ['crayons', '🖍️'], ['apples', '🍎'],
  ['seashells', '🐚'], ['blocks', '🧱'], ['flowers', '🌸'], ['cookies', '🍪'],
  ['leaves', '🍂'], ['rocks', '🪨'], ['pencils', '✏️'], ['berries', '🫐'],
];

// ============================================================
// SVG WIDGETS
// ============================================================

function numberLineSVG(min, max, step, opts = {}) {
  const W = 640, H = opts.clickable ? 120 : 110, pad = 34, y = 62;
  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);
  const x = (v) => pad + ((v - min) / (max - min)) * (W - pad * 2);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img">`;
  s += `<line x1="${pad - 14}" y1="${y}" x2="${W - pad + 14}" y2="${y}" stroke="#33302B" stroke-width="4" stroke-linecap="round"/>`;
  // arrows
  s += `<path d="M ${pad - 22} ${y} l 10 -7 v 14 z" fill="#33302B"/>`;
  s += `<path d="M ${W - pad + 22} ${y} l -10 -7 v 14 z" fill="#33302B"/>`;
  const labelEvery = opts.labelEvery || 1;
  ticks.forEach((v, i) => {
    const tx = x(v);
    const labeled = i % labelEvery === 0 || v === max;
    s += `<line x1="${tx}" y1="${y - (labeled ? 12 : 8)}" x2="${tx}" y2="${y + (labeled ? 12 : 8)}" stroke="#33302B" stroke-width="${labeled ? 3.5 : 2.5}"/>`;
    const showLabel = labeled && (!opts.hideLabels || !opts.hideLabels.includes(v));
    if (showLabel) {
      s += `<text x="${tx}" y="${y + 34}" text-anchor="middle" font-size="17" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${v}</text>`;
    }
    if (opts.clickable) {
      s += `<g class="nl-tick" data-val="${v}"><circle cx="${tx}" cy="${y}" r="14"/></g>`;
    }
  });
  if (opts.point !== undefined) {
    s += `<circle cx="${x(opts.point)}" cy="${y}" r="10" fill="#FF6B57" stroke="#33302B" stroke-width="3"/>`;
    s += `<text x="${x(opts.point)}" y="${y - 22}" text-anchor="middle" font-size="22">🐸</text>`;
  }
  if (opts.hops) {
    // draw hop arcs from opts.hops.start, opts.hops.count hops of opts.hops.size
    const { start, count, size } = opts.hops;
    for (let i = 0; i < count; i++) {
      const x1 = x(start + i * size), x2 = x(start + (i + 1) * size);
      s += `<path d="M ${x1} ${y - 6} Q ${(x1 + x2) / 2} ${y - 44} ${x2} ${y - 6}" fill="none" stroke="#4A9DE0" stroke-width="3.5" stroke-linecap="round"/>`;
      s += `<path d="M ${x2} ${y - 6} l -7 -8 M ${x2} ${y - 6} l -10 1" stroke="#4A9DE0" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
    }
    s += `<circle cx="${x(start)}" cy="${y}" r="9" fill="#4CAE6B" stroke="#33302B" stroke-width="3"/>`;
  }
  return s + `</svg>`;
}

function clockSVG(h, m) {
  const W = 230, cx = 115, cy = 115, r = 100;
  let s = `<svg viewBox="0 0 ${W} ${W}" width="220" role="img">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFDF4" stroke="#33302B" stroke-width="6"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    const tx = cx + Math.cos(a) * (r - 22), ty = cy + Math.sin(a) * (r - 22) + 7;
    s += `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="20" font-weight="700" font-family="Fredoka, sans-serif" fill="#33302B">${i}</text>`;
  }
  for (let i = 0; i < 60; i += 5) {
    const a = (i * 6 - 90) * Math.PI / 180;
    s += `<line x1="${cx + Math.cos(a) * (r - 8)}" y1="${cy + Math.sin(a) * (r - 8)}" x2="${cx + Math.cos(a) * (r - 3)}" y2="${cy + Math.sin(a) * (r - 3)}" stroke="#33302B" stroke-width="3"/>`;
  }
  const ma = (m * 6 - 90) * Math.PI / 180;
  const ha = (((h % 12) + m / 60) * 30 - 90) * Math.PI / 180;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ma) * (r - 26)}" y2="${cy + Math.sin(ma) * (r - 26)}" stroke="#4A9DE0" stroke-width="6" stroke-linecap="round"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ha) * (r - 52)}" y2="${cy + Math.sin(ha) * (r - 52)}" stroke="#FF6B57" stroke-width="8" stroke-linecap="round"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="8" fill="#33302B"/>`;
  return s + `</svg>`;
}

const COIN_STYLE = {
  25: { label: '25¢', color: '#C9CFD8', size: 33, name: 'quarter' },
  10: { label: '10¢', color: '#D8DEE7', size: 24, name: 'dime' },
  5:  { label: '5¢',  color: '#C2C9D3', size: 29, name: 'nickel' },
  1:  { label: '1¢',  color: '#D8A05E', size: 26, name: 'penny' },
};

function coinsSVG(coins) {
  // coins: array of values e.g. [25,25,10,1]
  const perRow = 6, gap = 74, rowH = 84;
  const rows = Math.ceil(coins.length / perRow);
  const W = Math.min(coins.length, perRow) * gap + 20;
  const H = rows * rowH + 6;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img">`;
  coins.forEach((v, i) => {
    const st = COIN_STYLE[v];
    const cx = 10 + (i % perRow) * gap + gap / 2;
    const cy = 8 + Math.floor(i / perRow) * rowH + rowH / 2 - 8;
    s += `<circle cx="${cx}" cy="${cy}" r="${st.size}" fill="${st.color}" stroke="#33302B" stroke-width="3.5"/>`;
    s += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="16" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${st.label}</text>`;
  });
  return s + `</svg>`;
}

function barGraphSVG(items) {
  // items: [{label, emoji, value}], single hue per dataviz rules
  const W = 460, H = 240, padL = 46, padB = 44, padT = 14;
  const maxV = Math.max(...items.map(i => i.value), 4);
  const top = Math.ceil(maxV / 2) * 2;
  const bw = 58, gap = (W - padL - 20 - items.length * bw) / (items.length + 1);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="460" role="img">`;
  for (let v = 0; v <= top; v += 2) {
    const y = padT + (1 - v / top) * (H - padT - padB);
    s += `<line x1="${padL}" y1="${y}" x2="${W - 14}" y2="${y}" stroke="rgba(51,48,43,.18)" stroke-width="2"/>`;
    s += `<text x="${padL - 9}" y="${y + 5}" text-anchor="end" font-size="14" font-weight="800" font-family="Nunito, sans-serif" fill="#6E675C">${v}</text>`;
  }
  items.forEach((it, i) => {
    const x = padL + gap + i * (bw + gap);
    const h = (it.value / top) * (H - padT - padB);
    const y = H - padB - h;
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="7" fill="#4A9DE0" stroke="#33302B" stroke-width="3"/>`;
    s += `<text x="${x + bw / 2}" y="${H - padB + 24}" text-anchor="middle" font-size="20">${it.emoji}</text>`;
    s += `<text x="${x + bw / 2}" y="${H - padB + 41}" text-anchor="middle" font-size="12.5" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${it.label}</text>`;
  });
  s += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#33302B" stroke-width="3.5"/>`;
  s += `<line x1="${padL}" y1="${H - padB}" x2="${W - 14}" y2="${H - padB}" stroke="#33302B" stroke-width="3.5"/>`;
  return s + `</svg>`;
}

function tallySVG(n) {
  const groups = Math.floor(n / 5), rest = n % 5;
  const gW = 64, W = Math.max((groups + (rest ? 1 : 0)) * gW + 20, 90), H = 74;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img">`;
  let x = 14;
  const stroke = `stroke="#33302B" stroke-width="4.5" stroke-linecap="round"`;
  for (let g = 0; g < groups; g++) {
    for (let i = 0; i < 4; i++) s += `<line x1="${x + i * 11}" y1="14" x2="${x + i * 11}" y2="58" ${stroke}/>`;
    s += `<line x1="${x - 6}" y1="50" x2="${x + 39}" y2="20" ${stroke}/>`;
    x += gW;
  }
  for (let i = 0; i < rest; i++) s += `<line x1="${x + i * 11}" y1="14" x2="${x + i * 11}" y2="58" ${stroke}/>`;
  return s + `</svg>`;
}

function fractionSVG(parts, shaded, kind) {
  const stroke = 'stroke="#33302B" stroke-width="4"';
  if (kind === 'circle') {
    const cx = 90, cy = 90, r = 74;
    let s = `<svg viewBox="0 0 180 180" width="170" role="img">`;
    for (let i = 0; i < parts; i++) {
      const a0 = (i / parts) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const large = 1 / parts > 0.5 ? 1 : 0;
      const fill = i < shaded ? '#FFC533' : '#FFFDF4';
      if (parts === 1) {
        s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${stroke}/>`;
      } else {
        s += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z" fill="${fill}" ${stroke}/>`;
      }
    }
    return s + `</svg>`;
  }
  // rectangle strips
  const W = 260, H = 110, pw = W / parts;
  let s = `<svg viewBox="0 0 ${W + 8} ${H + 8}" width="250" role="img">`;
  for (let i = 0; i < parts; i++) {
    const fill = i < shaded ? '#FFC533' : '#FFFDF4';
    s += `<rect x="${4 + i * pw}" y="4" width="${pw}" height="${H}" fill="${fill}" ${stroke}/>`;
  }
  return s + `</svg>`;
}

function arraySVG(rows, cols) {
  const cell = 44, W = cols * cell + 16, H = rows * cell + 16;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${Math.min(W, 420)}" role="img">`;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      s += `<circle cx="${8 + c * cell + cell / 2}" cy="${8 + r * cell + cell / 2}" r="14" fill="#FF6B57" stroke="#33302B" stroke-width="3"/>`;
  return s + `</svg>`;
}

function shapeSVG(name) {
  const stroke = 'fill="#BBE3F7" stroke="#33302B" stroke-width="5" stroke-linejoin="round"';
  const shapes = {
    triangle: `<polygon points="90,15 165,150 15,150" ${stroke}/>`,
    square: `<rect x="25" y="25" width="130" height="130" ${stroke}/>`,
    rectangle: `<rect x="10" y="45" width="160" height="95" ${stroke}/>`,
    pentagon: `<polygon points="90,12 168,70 138,158 42,158 12,70" ${stroke}/>`,
    hexagon: `<polygon points="50,20 130,20 170,90 130,160 50,160 10,90" ${stroke}/>`,
    circle: `<circle cx="90" cy="90" r="75" ${stroke}/>`,
    trapezoid: `<polygon points="50,40 130,40 168,145 12,145" ${stroke}/>`,
    rhombus: `<polygon points="90,15 160,90 90,165 20,90" ${stroke}/>`,
  };
  return `<svg viewBox="0 0 180 180" width="165" role="img">${shapes[name]}</svg>`;
}

function rulerSVG(length, unit) {
  const max = 10, W = 560, pad = 30, unitW = (W - pad * 2) / max;
  const objY = 26, rulY = 66;
  let s = `<svg viewBox="0 0 ${W} 150" width="560" role="img">`;
  // object: a pencil-like bar from 0 to length
  const x0 = pad, x1 = pad + length * unitW;
  s += `<rect x="${x0}" y="${objY}" width="${x1 - x0 - 16}" height="22" rx="6" fill="#FFC533" stroke="#33302B" stroke-width="3.5"/>`;
  s += `<polygon points="${x1 - 16},${objY} ${x1},${objY + 11} ${x1 - 16},${objY + 22}" fill="#D8A05E" stroke="#33302B" stroke-width="3.5" stroke-linejoin="round"/>`;
  // ruler
  s += `<rect x="${pad - 12}" y="${rulY}" width="${W - pad * 2 + 24}" height="58" rx="8" fill="#FFFDF4" stroke="#33302B" stroke-width="4"/>`;
  for (let u = 0; u <= max; u++) {
    const x = pad + u * unitW;
    s += `<line x1="${x}" y1="${rulY}" x2="${x}" y2="${rulY + 22}" stroke="#33302B" stroke-width="3"/>`;
    s += `<text x="${x}" y="${rulY + 44}" text-anchor="middle" font-size="15" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${u}</text>`;
  }
  s += `<text x="${W - pad + 4}" y="${rulY + 44}" font-size="13" font-weight="800" font-family="Nunito, sans-serif" fill="#6E675C">${unit}</text>`;
  return s + `</svg>`;
}

function verticalMath(a, b, op) {
  const w = Math.max(String(a).length, String(b).length);
  return `<div class="vertical-math"><div>${String(a).padStart(w, ' ').replace(/ /g, '&numsp;')}</div><div><span class="op">${op}</span>${String(b).padStart(w, ' ').replace(/ /g, '&numsp;')}</div></div>`;
}

// ============================================================
// SUBJECTS & STRANDS
// ============================================================

const SUBJECTS = [
  { id: 'math', name: 'Math', emoji: '🧮', color: 'var(--sky)' },
  { id: 'ela', name: 'Language', emoji: '📚', color: 'var(--coral)' },
  { id: 'science', name: 'Science', emoji: '🔬', color: 'var(--leaf)' },
  { id: 'spanish', name: 'Spanish', emoji: '🌎', color: 'var(--sun)' },
  { id: 'custom', name: 'My Lessons', emoji: '📌', color: 'var(--berry)' },
];

// subjects that actually have at least one skill right now (custom starts empty)
const activeSubjects = () => {
  const has = {};
  STRANDS.forEach(st => { if (SKILLS.some(s => s.strand === st.id)) has[st.subject] = true; });
  return SUBJECTS.filter(s => has[s.id]);
};

const STRANDS = [
  { id: 'count', name: 'Counting & Patterns', emoji: '🔢', color: 'var(--sun)' },
  { id: 'line',  name: 'Number Lines',        emoji: '🐸', color: 'var(--leaf)' },
  { id: 'place', name: 'Place Value',         emoji: '🧱', color: 'var(--coral)' },
  { id: 'add',   name: 'Addition',            emoji: '➕', color: 'var(--sky)' },
  { id: 'sub',   name: 'Subtraction',         emoji: '➖', color: 'var(--berry)' },
  { id: 'word',  name: 'Word Problems',       emoji: '📖', color: 'var(--cocoa)' },
  { id: 'money', name: 'Money',               emoji: '🪙', color: 'var(--sun)' },
  { id: 'time',  name: 'Time',                emoji: '⏰', color: 'var(--sky)' },
  { id: 'meas',  name: 'Measurement',         emoji: '📐', color: 'var(--leaf)' },
  { id: 'geo',   name: 'Shapes & Fractions',  emoji: '🔷', color: 'var(--coral)' },
  { id: 'data',  name: 'Graphs & Data',       emoji: '📊', color: 'var(--berry)' },
  { id: 'mult',  name: 'Getting Ready to ×',  emoji: '✖️', color: 'var(--cocoa)' },
];
STRANDS.forEach(s => { s.subject = 'math'; });

// ============================================================
// SKILLS — each gen() returns:
// { prompt, body?, type: 'mc'|'num'|'line'|'compare', choices?, answer, explain, wide? }
// ============================================================

const SKILLS = [

  // ---------------- COUNTING & PATTERNS ----------------
  { id: 'skip2', strand: 'count', name: 'Skip count by 2s', gen: () => skipCount(2) },
  { id: 'skip5', strand: 'count', name: 'Skip count by 5s', gen: () => skipCount(5) },
  { id: 'skip10', strand: 'count', name: 'Skip count by 10s', gen: () => skipCount(10) },
  { id: 'skip100', strand: 'count', name: 'Skip count by 100s', gen: () => skipCount(100) },
  {
    id: 'evenodd', strand: 'count', name: 'Even or odd?',
    gen: () => {
      const n = ri(2, 99);
      const even = n % 2 === 0;
      return {
        prompt: `Is this number even or odd?`,
        body: `<div class="bignum">${n}</div>`,
        type: 'mc', choices: ['even', 'odd'], answer: even ? 'even' : 'odd',
        explain: `Look at the last digit: <b>${n % 10}</b>. Numbers ending in 0, 2, 4, 6, or 8 are <b>even</b> — they can be split into two equal teams. ${n} is <b>${even ? 'even' : 'odd'}</b>.`,
      };
    },
  },
  {
    id: 'pattern', strand: 'count', name: 'What comes next?',
    gen: () => {
      const step = pick([2, 3, 4, 5, 10]);
      const dir = pick([1, 1, 1, -1]);
      const start = dir === 1 ? ri(1, 40) : ri(60, 99);
      const seq = [0, 1, 2, 3].map(i => start + i * step * dir);
      const answer = start + 4 * step * dir;
      return {
        prompt: `What number comes next?`,
        body: `<div class="bignum">${seq.join(', ')}, ___</div>`,
        type: 'num', answer,
        explain: `The pattern ${dir === 1 ? 'adds' : 'subtracts'} <b>${step}</b> each time. ${seq[3]} ${dir === 1 ? '+' : '−'} ${step} = <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'countback', strand: 'count', name: 'Counting backward',
    gen: () => {
      const start = ri(15, 110);
      const seq = [start, start - 1, start - 2];
      return {
        prompt: `Count backward. What comes next?`,
        body: `<div class="bignum">${seq.join(', ')}, ___</div>`,
        type: 'num', answer: start - 3,
        explain: `Counting backward means going down by 1. After ${start - 2} comes <b>${start - 3}</b>.`,
      };
    },
  },

  // ---------------- NUMBER LINES ----------------
  {
    id: 'line_find', strand: 'line', name: 'Find the number (tap it!)',
    gen: () => {
      const ranges = [[0, 20, 1, 5], [0, 50, 5, 2], [0, 100, 10, 1], [0, 100, 5, 4]];
      const [min, max, step, labelEvery] = pick(ranges);
      const count = (max - min) / step;
      const answer = min + ri(1, count - 1) * step;
      return {
        prompt: `Tap the number line where <b>${answer}</b> lives!`,
        body: numberLineSVG(min, max, step, { clickable: true, labelEvery }),
        type: 'line', answer, wide: true,
        explain: `Start at ${min} and hop by ${step}s until you reach <b>${answer}</b>. The labels are stepping stones!`,
      };
    },
  },
  {
    id: 'line_point', strand: 'line', name: 'What number is the frog on?',
    gen: () => {
      const ranges = [[0, 20, 1, 5], [0, 50, 5, 2], [0, 100, 10, 1]];
      const [min, max, step, labelEvery] = pick(ranges);
      const count = (max - min) / step;
      const val = min + ri(1, count - 1) * step;
      const { choices, answer } = mcSet(val, () => {
        const d = val + pick([-2, -1, 1, 2]) * step;
        return d >= min && d <= max ? d : null;
      });
      return {
        prompt: `What number is the frog sitting on?`,
        body: numberLineSVG(min, max, step, { point: val, labelEvery, hideLabels: [val] }),
        type: 'mc', choices, answer, wide: true,
        explain: `Count the hops from a labeled number. Each little tick is worth ${step}. The frog is on <b>${val}</b>.`,
      };
    },
  },
  {
    id: 'line_hop', strand: 'line', name: 'Frog-hop addition',
    gen: () => {
      const size = pick([2, 5, 10]);
      const count = ri(2, 4);
      const start = size === 10 ? ri(0, 5) * 10 : ri(0, 6) * size;
      const max = Math.max(50, start + size * count + size);
      const lineMax = size === 10 ? 100 : (size === 5 ? 50 : 30);
      const st = Math.min(start, lineMax - size * count);
      const answer = st + size * count;
      return {
        prompt: `The frog starts at <b>${st}</b> and makes <b>${count} hops</b> of <b>${size}</b>. Where does it land?`,
        body: numberLineSVG(0, lineMax, size, { hops: { start: st, count, size }, labelEvery: size === 2 ? 5 : 1 }),
        type: 'num', answer, wide: true,
        explain: `${count} hops of ${size} is ${Array(count).fill(size).join(' + ')} = ${size * count}. So ${st} + ${size * count} = <b>${answer}</b>.`,
      };
    },
  },

  // ---------------- PLACE VALUE ----------------
  {
    id: 'pv_digit', strand: 'place', name: 'What is the digit worth?',
    gen: () => {
      const n = ri(100, 999);
      const s = String(n);
      const nonZero = [0, 1, 2].filter(i => +s[i] !== 0);
      const pos = pick(nonZero);
      const digit = +s[pos];
      const value = digit * [100, 10, 1][pos];
      const placeName = ['hundreds', 'tens', 'ones'][pos];
      const { choices, answer } = mcSet(value, () => digit * pick([100, 10, 1]));
      return {
        prompt: `In the number <b>${n}</b>, what is the <b>${digit}</b> worth?`,
        type: 'mc', choices, answer,
        explain: `The ${digit} is in the <b>${placeName}</b> place, so it is worth ${digit} × ${[100, 10, 1][pos]} = <b>${value}</b>.`,
      };
    },
  },
  {
    id: 'pv_tens', strand: 'place', name: 'Tens and ones',
    gen: () => {
      const t = ri(1, 9), o = ri(0, 9);
      return {
        prompt: `What number is <b>${t} tens</b> and <b>${o} ones</b>?`,
        type: 'num', answer: t * 10 + o,
        explain: `${t} tens = ${t * 10}, plus ${o} ones = <b>${t * 10 + o}</b>.`,
      };
    },
  },
  {
    id: 'pv_hundreds', strand: 'place', name: 'Hundreds, tens & ones',
    gen: () => {
      const h = ri(1, 9), t = ri(0, 9), o = ri(0, 9);
      return {
        prompt: `What number is <b>${h} hundreds</b>, <b>${t} tens</b>, and <b>${o} ones</b>?`,
        type: 'num', answer: h * 100 + t * 10 + o,
        explain: `${h} hundreds = ${h * 100}, ${t} tens = ${t * 10}, ${o} ones = ${o}. Together: <b>${h * 100 + t * 10 + o}</b>.`,
      };
    },
  },
  {
    id: 'pv_expanded', strand: 'place', name: 'Expanded form',
    gen: () => {
      const h = ri(1, 9), t = ri(1, 9), o = ri(1, 9);
      const n = h * 100 + t * 10 + o;
      const correct = `${h * 100} + ${t * 10} + ${o}`;
      const wrongs = [
        `${h} + ${t} + ${o}`,
        `${h * 100} + ${t} + ${o}`,
        `${h * 10} + ${t * 10} + ${o}`,
      ];
      return {
        prompt: `Which one shows <b>${n}</b> in expanded form?`,
        type: 'mc', choices: shuffle([correct, ...wrongs]), answer: correct,
        explain: `Break ${n} into its places: ${h} hundreds + ${t} tens + ${o} ones = <b>${correct}</b>.`,
      };
    },
  },
  {
    id: 'pv_standard', strand: 'place', name: 'Put the number together',
    gen: () => {
      const h = ri(1, 9), t = ri(0, 9), o = ri(0, 9);
      const n = h * 100 + t * 10 + o;
      const parts = [h * 100, t * 10, o].filter(x => x > 0);
      return {
        prompt: `What number is this?`,
        body: `<div class="bignum">${parts.join(' + ')}</div>`,
        type: 'num', answer: n,
        explain: `Add the pieces: ${parts.join(' + ')} = <b>${n}</b>.`,
      };
    },
  },
  {
    id: 'pv_compare', strand: 'place', name: 'Compare numbers (&lt;, &gt;, =)',
    gen: () => {
      let a = ri(10, 999), b;
      const same = ri(1, 5) === 1;
      if (same) b = a;
      else {
        b = a;
        while (b === a) b = ri(1, 4) === 1 ? a + pick([-10, 10, -100, 100, -1, 1]) : ri(10, 999);
        if (b < 0) b = a + 10;
      }
      const answer = a < b ? '<' : a > b ? '>' : '=';
      const words = { '<': 'less than', '>': 'greater than', '=': 'equal to' };
      return {
        prompt: `Which sign makes this true?`,
        body: `<div class="bignum">${a} &nbsp;<span style="color:var(--coral)">?</span>&nbsp; ${b}</div>`,
        type: 'mc', choices: ['<', '>', '='], answer,
        explain: `Compare hundreds first, then tens, then ones. ${a} is <b>${words[answer]}</b> ${b}, so the sign is <b>${answer}</b>. Hint: the open mouth always eats the bigger number!`,
      };
    },
  },
  {
    id: 'pv_order', strand: 'place', name: 'Biggest and smallest',
    gen: () => {
      const set = new Set();
      while (set.size < 3) set.add(ri(10, 999));
      const nums = [...set];
      const wantBig = pick([true, false]);
      const answer = String(wantBig ? Math.max(...nums) : Math.min(...nums));
      return {
        prompt: `Which number is the <b>${wantBig ? 'BIGGEST' : 'SMALLEST'}</b>?`,
        type: 'mc', choices: shuffle(nums.map(String)), answer,
        explain: `Line them up and compare the hundreds place first. The ${wantBig ? 'biggest' : 'smallest'} is <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'pv_ten_more', strand: 'place', name: '10 more, 10 less',
    gen: () => {
      const n = ri(20, 890);
      const more = pick([true, false]);
      return {
        prompt: `What is <b>10 ${more ? 'more' : 'less'}</b> than <b>${n}</b>?`,
        type: 'num', answer: more ? n + 10 : n - 10,
        explain: `Only the tens digit changes! ${n} ${more ? '+' : '−'} 10 = <b>${more ? n + 10 : n - 10}</b>.`,
      };
    },
  },
  {
    id: 'pv_hundred_more', strand: 'place', name: '100 more, 100 less',
    gen: () => {
      const n = ri(120, 880);
      const more = pick([true, false]);
      return {
        prompt: `What is <b>100 ${more ? 'more' : 'less'}</b> than <b>${n}</b>?`,
        type: 'num', answer: more ? n + 100 : n - 100,
        explain: `Only the hundreds digit changes! ${n} ${more ? '+' : '−'} 100 = <b>${more ? n + 100 : n - 100}</b>.`,
      };
    },
  },

  // ---------------- ADDITION ----------------
  {
    id: 'add_facts', strand: 'add', name: 'Addition facts to 20', adaptive: true,
    gen: (lvl = 2) => {
      const cap = lvl === 1 ? 10 : 20;
      const a = rlvl(lvl === 3 ? 6 : 2, lvl === 1 ? 6 : 13);
      const b = rlvl(lvl === 3 ? 5 : 2, Math.min(9, cap - a));
      return {
        prompt: `Solve it!`,
        body: `<div class="bignum">${a} + ${b} = ___</div>`,
        type: 'num', answer: a + b,
        explain: `Start at ${Math.max(a, b)} and count up ${Math.min(a, b)}: you land on <b>${a + b}</b>.`,
      };
    },
  },
  {
    id: 'add_tens', strand: 'add', name: 'Add tens',
    gen: () => {
      const a = ri(1, 6) * 10, b = ri(1, Math.min(9 - a / 10, 5) + 1) * 10;
      return {
        prompt: `Solve it!`,
        body: `<div class="bignum">${a} + ${b} = ___</div>`,
        type: 'num', answer: a + b,
        explain: `Think in tens: ${a / 10} tens + ${b / 10} tens = ${(a + b) / 10} tens = <b>${a + b}</b>.`,
      };
    },
  },
  {
    id: 'add_2d', strand: 'add', name: 'Add 2-digit (no carrying)', adaptive: true,
    gen: (lvl = 2) => {
      const ao = ri(0, 8), bo = ri(0, 9 - ao);
      const at = rlvl(1, lvl === 1 ? 4 : lvl === 3 ? 8 : 7), bt = rlvl(1, 9 - at);
      const a = at * 10 + ao, b = bt * 10 + bo;
      return {
        prompt: `Add the ones, then the tens.`,
        body: verticalMath(a, b, '+'),
        type: 'num', answer: a + b,
        explain: `Ones: ${ao} + ${bo} = ${ao + bo}. Tens: ${at} + ${bt} = ${at + bt}. Answer: <b>${a + b}</b>.`,
      };
    },
  },
  {
    id: 'add_2d_re', strand: 'add', name: 'Add 2-digit (carrying)', adaptive: true,
    gen: (lvl = 2) => {
      const ao = ri(4, 9), bo = ri(10 - ao, 9);
      const at = rlvl(lvl === 3 ? 3 : 1, lvl === 1 ? 3 : 6), bt = rlvl(1, 8 - at);
      const a = at * 10 + ao, b = bt * 10 + bo;
      return {
        prompt: `Careful — the ones make a new ten!`,
        body: verticalMath(a, b, '+'),
        type: 'num', answer: a + b,
        explain: `Ones: ${ao} + ${bo} = ${ao + bo}. Write the ${(ao + bo) % 10}, carry the 1 ten. Tens: 1 + ${at} + ${bt} = ${1 + at + bt}. Answer: <b>${a + b}</b>.`,
      };
    },
  },
  {
    id: 'add_3', strand: 'add', name: 'Add three numbers',
    gen: () => {
      const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
      return {
        prompt: `Add all three!`,
        body: `<div class="bignum">${a} + ${b} + ${c} = ___</div>`,
        type: 'num', answer: a + b + c,
        explain: `Add two first, then the third: ${a} + ${b} = ${a + b}, then ${a + b} + ${c} = <b>${a + b + c}</b>. Tip: look for pairs that make 10!`,
      };
    },
  },
  {
    id: 'add_3d', strand: 'add', name: 'Add 3-digit numbers', adaptive: true,
    gen: (lvl = 2) => {
      const a = rlvl(lvl === 3 ? 300 : 110, lvl === 1 ? 300 : lvl === 3 ? 700 : 480);
      const b = rlvl(110, Math.min(lvl === 1 ? 300 : 999, 999 - a));
      return {
        prompt: `Add the ones, tens, then hundreds.`,
        body: verticalMath(a, b, '+'),
        type: 'num', answer: a + b,
        explain: `Work right to left, carrying when a column makes 10 or more. ${a} + ${b} = <b>${a + b}</b>.`,
      };
    },
  },
  {
    id: 'add_missing', strand: 'add', name: 'Missing number (addition)',
    gen: () => {
      const a = ri(3, 40), miss = ri(3, 30);
      const c = a + miss;
      return {
        prompt: `What number is hiding?`,
        body: `<div class="bignum">${a} + ___ = ${c}</div>`,
        type: 'num', answer: miss,
        explain: `Think backwards: ${c} − ${a} = <b>${miss}</b>. Check: ${a} + ${miss} = ${c}. ✓`,
      };
    },
  },

  // ---------------- SUBTRACTION ----------------
  {
    id: 'sub_facts', strand: 'sub', name: 'Subtraction facts to 20', adaptive: true,
    gen: (lvl = 2) => {
      const a = rlvl(lvl === 3 ? 14 : lvl === 1 ? 5 : 8, lvl === 1 ? 12 : 20);
      const b = ri(2, a - 2);
      return {
        prompt: `Solve it!`,
        body: `<div class="bignum">${a} − ${b} = ___</div>`,
        type: 'num', answer: a - b,
        explain: `Count back ${b} from ${a}, or think: ${b} + <b>${a - b}</b> = ${a}.`,
      };
    },
  },
  {
    id: 'sub_tens', strand: 'sub', name: 'Subtract tens',
    gen: () => {
      const a = ri(4, 9) * 10, b = ri(1, a / 10 - 1) * 10;
      return {
        prompt: `Solve it!`,
        body: `<div class="bignum">${a} − ${b} = ___</div>`,
        type: 'num', answer: a - b,
        explain: `Think in tens: ${a / 10} tens − ${b / 10} tens = ${(a - b) / 10} tens = <b>${a - b}</b>.`,
      };
    },
  },
  {
    id: 'sub_2d', strand: 'sub', name: 'Subtract 2-digit (no borrowing)', adaptive: true,
    gen: (lvl = 2) => {
      const bo = ri(0, 8), ao = ri(bo, 9);
      const bt = rlvl(1, lvl === 1 ? 3 : 7), at = rlvl(bt + 1, lvl === 1 ? Math.min(bt + 4, 9) : 9);
      const a = at * 10 + ao, b = bt * 10 + bo;
      return {
        prompt: `Subtract the ones, then the tens.`,
        body: verticalMath(a, b, '−'),
        type: 'num', answer: a - b,
        explain: `Ones: ${ao} − ${bo} = ${ao - bo}. Tens: ${at} − ${bt} = ${at - bt}. Answer: <b>${a - b}</b>.`,
      };
    },
  },
  {
    id: 'sub_2d_re', strand: 'sub', name: 'Subtract 2-digit (borrowing)', adaptive: true,
    gen: (lvl = 2) => {
      const ao = ri(0, 5), bo = ri(ao + 1, 9);
      const at = rlvl(lvl === 3 ? 5 : 3, lvl === 1 ? 5 : 9), bt = ri(1, at - 2);
      const a = at * 10 + ao, b = bt * 10 + bo;
      return {
        prompt: `Careful — you'll need to borrow a ten!`,
        body: verticalMath(a, b, '−'),
        type: 'num', answer: a - b,
        explain: `${ao} is smaller than ${bo}, so borrow: the ${at} tens become ${at - 1}, and the ones become ${ao + 10}. Then ${ao + 10} − ${bo} = ${ao + 10 - bo} and ${at - 1} − ${bt} = ${at - 1 - bt}. Answer: <b>${a - b}</b>.`,
      };
    },
  },
  {
    id: 'sub_3d', strand: 'sub', name: 'Subtract 3-digit numbers', adaptive: true,
    gen: (lvl = 2) => {
      const b = rlvl(110, lvl === 1 ? 300 : lvl === 3 ? 600 : 500);
      const a = Math.min(999, b + rlvl(lvl === 1 ? 50 : lvl === 3 ? 200 : 100, lvl === 1 ? 200 : 480));
      return {
        prompt: `Work right to left. Borrow if you need to!`,
        body: verticalMath(a, b, '−'),
        type: 'num', answer: a - b,
        explain: `Subtract ones, then tens, then hundreds — borrowing when the top digit is smaller. ${a} − ${b} = <b>${a - b}</b>.`,
      };
    },
  },
  {
    id: 'sub_missing', strand: 'sub', name: 'Missing number (subtraction)',
    gen: () => {
      const miss = ri(3, 40), c = ri(3, 40);
      const a = miss + c;
      return {
        prompt: `What number is hiding?`,
        body: `<div class="bignum">${a} − ___ = ${c}</div>`,
        type: 'num', answer: miss,
        explain: `${a} take away something leaves ${c}. So the something is ${a} − ${c} = <b>${miss}</b>.`,
      };
    },
  },
  {
    id: 'fact_family', strand: 'sub', name: 'Fact families',
    gen: () => {
      const a = ri(2, 9), b = ri(2, 9);
      const c = a + b;
      const correct = pick([`${c} − ${a} = ${b}`, `${c} − ${b} = ${a}`, `${b} + ${a} = ${c}`]);
      const wrongMakers = [
        () => `${c} − ${a} = ${b + pick([1, 2, -1])}`,
        () => `${a} − ${b} = ${c}`,
        () => `${c} + ${a} = ${b}`,
        () => `${c - 1} − ${a} = ${b}`,
      ];
      const { choices, answer } = mcSet(correct, () => pick(wrongMakers)());
      return {
        prompt: `<b>${a} + ${b} = ${c}</b><br>Which fact is in the same family?`,
        type: 'mc', choices, answer,
        explain: `A fact family uses the SAME three numbers: ${a}, ${b}, and ${c}. So <b>${answer}</b> belongs!`,
      };
    },
  },

  // ---------------- WORD PROBLEMS ----------------
  {
    id: 'word_add', strand: 'word', name: 'Addition stories', adaptive: true,
    gen: (lvl = 2) => {
      const name = pick(NAMES), [thing, emoji] = pick(THINGS);
      const a = rlvl(lvl === 1 ? 8 : lvl === 3 ? 30 : 12, lvl === 1 ? 25 : lvl === 3 ? 90 : 60);
      const b = rlvl(lvl === 1 ? 3 : lvl === 3 ? 15 : 5, lvl === 1 ? 15 : lvl === 3 ? 60 : 35);
      return {
        prompt: `${name} has <b>${a} ${thing}</b> ${emoji}. A friend gives ${name} <b>${b} more</b>. How many ${thing} does ${name} have now?`,
        type: 'num', answer: a + b,
        explain: `"More" means we ADD: ${a} + ${b} = <b>${a + b}</b> ${thing}.`,
      };
    },
  },
  {
    id: 'word_sub', strand: 'word', name: 'Subtraction stories', adaptive: true,
    gen: (lvl = 2) => {
      const name = pick(NAMES), [thing, emoji] = pick(THINGS);
      const a = rlvl(lvl === 1 ? 15 : lvl === 3 ? 50 : 25, lvl === 1 ? 40 : lvl === 3 ? 120 : 90);
      const b = rlvl(lvl === 1 ? 3 : lvl === 3 ? 10 : 6, a - (lvl === 1 ? 8 : 10));
      const verb = pick(['gives away', 'loses', 'uses up']);
      return {
        prompt: `${name} has <b>${a} ${thing}</b> ${emoji} and ${verb} <b>${b}</b>. How many are left?`,
        type: 'num', answer: a - b,
        explain: `"${verb.split(' ')[0][0].toUpperCase() + verb.slice(1)}" and "left" mean we SUBTRACT: ${a} − ${b} = <b>${a - b}</b> ${thing}.`,
      };
    },
  },
  {
    id: 'word_comp', strand: 'word', name: 'How many more?',
    gen: () => {
      const n1 = pick(NAMES);
      let n2 = pick(NAMES); while (n2 === n1) n2 = pick(NAMES);
      const [thing, emoji] = pick(THINGS);
      const small = ri(8, 40), diff = ri(3, 25);
      const big = small + diff;
      return {
        prompt: `${n1} has <b>${big} ${thing}</b> ${emoji}. ${n2} has <b>${small}</b>. How many MORE does ${n1} have than ${n2}?`,
        type: 'num', answer: diff,
        explain: `"How many more" means find the difference: ${big} − ${small} = <b>${diff}</b>.`,
      };
    },
  },
  {
    id: 'word_two', strand: 'word', name: 'Two-step stories',
    gen: () => {
      const name = pick(NAMES), [thing, emoji] = pick(THINGS);
      const a = ri(20, 50), b = ri(5, 20), c = ri(5, 20);
      const add2 = pick([true, false]);
      const mid = a + b;
      const answer = add2 ? mid + c : mid - c;
      return {
        prompt: `${name} has <b>${a} ${thing}</b> ${emoji}, then gets <b>${b} more</b>. Then ${name} ${add2 ? `finds <b>${c}</b> extra` : `gives <b>${c}</b> away`}. How many now?`,
        type: 'num', answer,
        explain: `Two steps! First: ${a} + ${b} = ${mid}. Then: ${mid} ${add2 ? '+' : '−'} ${c} = <b>${answer}</b>.`,
      };
    },
  },

  // ---------------- MONEY ----------------
  {
    id: 'money_count', strand: 'money', name: 'Count the coins',
    gen: () => {
      const combo = [];
      const nq = ri(0, 3), nd = ri(0, 3), nn = ri(0, 2), np = ri(0, 4);
      for (let i = 0; i < nq; i++) combo.push(25);
      for (let i = 0; i < nd; i++) combo.push(10);
      for (let i = 0; i < nn; i++) combo.push(5);
      for (let i = 0; i < np; i++) combo.push(1);
      if (combo.length < 2) combo.push(25, 10);
      const total = combo.reduce((s, v) => s + v, 0);
      const fmt = (c) => c >= 100 ? `$${Math.floor(c / 100)}.${String(c % 100).padStart(2, '0')}` : `${c}¢`;
      const { choices, answer } = mcSet(fmt(total), () => fmt(Math.max(1, total + pick([-10, -5, -1, 1, 5, 10, 25]))));
      return {
        prompt: `How much money is this?`,
        body: coinsSVG(combo), wide: true,
        type: 'mc', choices, answer,
        explain: `Count the big coins first: quarters (25¢), then dimes (10¢), nickels (5¢), pennies (1¢). Total: <b>${fmt(total)}</b>.`,
      };
    },
  },
  {
    id: 'money_make', strand: 'money', name: 'Make the amount',
    gen: () => {
      const combos = [
        [30, '25¢ + 5¢', ['10¢ + 10¢', '25¢ + 10¢', '5¢ + 5¢ + 5¢']],
        [35, '25¢ + 10¢', ['25¢ + 5¢', '10¢ + 10¢ + 10¢', '25¢ + 25¢']],
        [50, '25¢ + 25¢', ['25¢ + 10¢ + 10¢', '10¢ + 10¢ + 10¢', '25¢ + 10¢ + 5¢ + 5¢ + 1¢']],
        [40, '25¢ + 10¢ + 5¢', ['25¢ + 10¢', '10¢ + 10¢ + 10¢', '25¢ + 5¢ + 5¢ + 1¢']],
        [26, '25¢ + 1¢', ['10¢ + 10¢ + 5¢', '25¢ + 5¢', '10¢ + 10¢ + 1¢']],
        [75, '25¢ + 25¢ + 25¢', ['25¢ + 25¢ + 10¢', '25¢ + 10¢ + 10¢', '25¢ + 25¢ + 5¢']],
        [16, '10¢ + 5¢ + 1¢', ['10¢ + 5¢', '5¢ + 5¢ + 5¢', '10¢ + 1¢ + 1¢']],
        [55, '25¢ + 25¢ + 5¢', ['25¢ + 25¢ + 1¢', '25¢ + 10¢ + 10¢', '25¢ + 25¢ + 10¢']],
      ];
      const [amt, correct, wrongs] = pick(combos);
      return {
        prompt: `Which coins make exactly <b>${amt}¢</b>?`,
        type: 'mc', choices: shuffle([correct, ...wrongs]), answer: correct,
        explain: `Add each group up and look for ${amt}¢: <b>${correct}</b> = ${amt}¢. ✓`,
      };
    },
  },
  {
    id: 'money_change', strand: 'money', name: 'Change from $1',
    gen: () => {
      const price = pick([25, 30, 40, 45, 50, 60, 65, 70, 75, 80, 85, 90]);
      const change = 100 - price;
      return {
        prompt: `A toy costs <b>${price}¢</b>. You pay with <b>$1</b> (100¢). How much change do you get back?`,
        type: 'num', answer: change, suffix: '¢',
        explain: `Count up from ${price} to 100: that's <b>${change}¢</b> in change. (100 − ${price} = ${change})`,
      };
    },
  },

  // ---------------- TIME ----------------
  {
    id: 'time_hour', strand: 'time', name: 'Time to the hour & half hour',
    gen: () => {
      const h = ri(1, 12), m = pick([0, 30]);
      const fmt = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
      const correct = fmt(h, m);
      const { choices, answer } = mcSet(correct, () => {
        const wh = ((h + pick([0, 1, -1, 6]) + 11) % 12) + 1;
        const wm = pick([0, 30]);
        const w = fmt(wh, wm);
        return w === correct ? null : w;
      });
      return {
        prompt: `What time does the clock show?`,
        body: clockSVG(h, m),
        type: 'mc', choices, answer,
        explain: m === 0
          ? `The long blue hand points to 12 — that means o'clock. The short red hand points to ${h}. It's <b>${correct}</b>.`
          : `The long blue hand points to 6 — that means half past. The short red hand is between ${h} and ${h % 12 + 1}, so it's <b>${correct}</b>.`,
      };
    },
  },
  {
    id: 'time_5', strand: 'time', name: 'Time to 5 minutes',
    gen: () => {
      const h = ri(1, 12), m = ri(1, 11) * 5;
      const fmt = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
      const correct = fmt(h, m);
      const { choices, answer } = mcSet(correct, () => {
        const wm = ri(0, 11) * 5;
        const wh = ((h + pick([0, 0, 1, -1]) + 11) % 12) + 1;
        const w = fmt(wh, wm);
        return w === correct ? null : w;
      });
      return {
        prompt: `What time does the clock show?`,
        body: clockSVG(h, m),
        type: 'mc', choices, answer,
        explain: `Skip count by 5s around the clock for the long blue hand: it points to ${m / 5}, so ${m} minutes. The short red hand says the hour is ${h}. It's <b>${correct}</b>.`,
      };
    },
  },
  {
    id: 'time_ampm', strand: 'time', name: 'AM or PM?',
    gen: () => {
      const events = [
        ['eating breakfast', 'AM'], ['the sun rising', 'AM'], ['going to school in the morning', 'AM'],
        ['eating dinner', 'PM'], ['watching the sunset', 'PM'], ['brushing teeth before bed', 'PM'],
        ['eating lunch at noon-time', 'PM'], ['waking up for the day', 'AM'], ['getting tucked in at night', 'PM'],
        ['the moon shining at night', 'PM'],
      ];
      const [ev, answer] = pick(events);
      return {
        prompt: `Is <b>${ev}</b> usually AM or PM?`,
        type: 'mc', choices: ['AM', 'PM'], answer,
        explain: `AM = midnight to lunchtime (morning). PM = lunchtime to midnight (afternoon & night). ${ev[0].toUpperCase() + ev.slice(1)} happens in the <b>${answer === 'AM' ? 'morning — AM' : 'afternoon or night — PM'}</b>.`,
      };
    },
  },
  {
    id: 'time_elapsed', strand: 'time', name: 'How much later?',
    gen: () => {
      const h1 = ri(1, 8), dur = ri(1, 3);
      const h2 = h1 + dur;
      return {
        prompt: `Soccer practice starts at <b>${h1}:00</b> and ends at <b>${h2}:00</b>. How many hours is that?`,
        type: 'num', answer: dur,
        explain: `Count the hours from ${h1}:00 to ${h2}:00: <b>${dur}</b> hour${dur > 1 ? 's' : ''}. (${h2} − ${h1} = ${dur})`,
      };
    },
  },

  // ---------------- MEASUREMENT ----------------
  {
    id: 'meas_unit', strand: 'meas', name: 'Pick the best unit',
    gen: () => {
      const items = [
        ['an ant 🐜', 'centimeters', ['meters', 'kilometers']],
        ['a pencil ✏️', 'inches', ['feet', 'miles']],
        ['a door 🚪', 'feet', ['inches', 'miles']],
        ['a swimming pool 🏊', 'meters', ['centimeters', 'kilometers']],
        ['the road to another city 🛣️', 'miles', ['inches', 'feet']],
        ['a paperclip 📎', 'centimeters', ['meters', 'kilometers']],
        ['a school bus 🚌', 'feet', ['inches', 'miles']],
        ['your finger ☝️', 'inches', ['feet', 'yards']],
      ];
      const [item, answer, wrongs] = pick(items);
      return {
        prompt: `What is the BEST unit to measure <b>${item}</b>?`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer,
        explain: `Pick a unit close to the size of the thing. Small things → small units, huge distances → big units. Best choice: <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'meas_ruler', strand: 'meas', name: 'Measure with a ruler',
    gen: () => {
      const len = ri(2, 9);
      const unit = pick(['inches', 'centimeters']);
      return {
        prompt: `How long is the pencil?`,
        body: rulerSVG(len, unit), wide: true,
        type: 'num', answer: len, suffix: ` ${unit}`,
        explain: `Line up the start at 0 and read the number at the tip: <b>${len} ${unit}</b>.`,
      };
    },
  },
  {
    id: 'meas_compare', strand: 'meas', name: 'How much longer?',
    gen: () => {
      const a = ri(4, 12), diff = ri(2, 8);
      const b = a + diff;
      const [t1, t2] = pick([['ribbon 🎀', 'string 🧵'], ['snake 🐍', 'worm 🪱'], ['train 🚂', 'bus 🚌']]);
      return {
        prompt: `A ${t2} is <b>${a} inches</b> long. A ${t1} is <b>${b} inches</b> long. How much longer is the ${t1}?`,
        type: 'num', answer: diff,
        explain: `Find the difference: ${b} − ${a} = <b>${diff} inches</b> longer.`,
      };
    },
  },

  // ---------------- SHAPES & FRACTIONS ----------------
  {
    id: 'geo_name', strand: 'geo', name: 'Name that shape',
    gen: () => {
      const all = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'circle', 'trapezoid', 'rhombus'];
      const answer = pick(all);
      const { choices } = mcSet(answer, () => pick(all));
      return {
        prompt: `What shape is this?`,
        body: shapeSVG(answer),
        type: 'mc', choices, answer,
        explain: {
          triangle: '3 sides, 3 corners — a <b>triangle</b>!',
          square: '4 equal sides, 4 square corners — a <b>square</b>!',
          rectangle: '4 sides with opposite sides equal — a <b>rectangle</b>!',
          pentagon: '5 sides, 5 corners — a <b>pentagon</b>!',
          hexagon: '6 sides, 6 corners — a <b>hexagon</b> (like a honeycomb)!',
          circle: 'Perfectly round with no corners — a <b>circle</b>!',
          trapezoid: '4 sides with only one pair of parallel sides — a <b>trapezoid</b>!',
          rhombus: '4 equal sides, tilted like a diamond — a <b>rhombus</b>!',
        }[answer],
      };
    },
  },
  {
    id: 'geo_sides', strand: 'geo', name: 'Sides and corners',
    gen: () => {
      const shapes = [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6], ['trapezoid', 4], ['rhombus', 4]];
      const [name, n] = pick(shapes);
      const what = pick(['sides', 'corners (vertices)']);
      return {
        prompt: `How many <b>${what}</b> does this shape have?`,
        body: shapeSVG(name),
        type: 'num', answer: n,
        explain: `A ${name} has <b>${n} sides</b> and <b>${n} corners</b> — the number always matches!`,
      };
    },
  },
  {
    id: 'geo_frac', strand: 'geo', name: 'Halves, thirds & fourths',
    gen: () => {
      const opts = [[2, 1, 'one half'], [3, 1, 'one third'], [4, 1, 'one fourth'], [3, 2, 'two thirds'], [4, 3, 'three fourths'], [2, 2, 'two halves (one whole)'], [4, 2, 'two fourths']];
      const [parts, shaded, answer] = pick(opts);
      const kind = pick(['circle', 'rect']);
      const names = ['one half', 'one third', 'one fourth', 'two thirds', 'three fourths', 'two halves (one whole)', 'two fourths'];
      const { choices } = mcSet(answer, () => pick(names));
      return {
        prompt: `What fraction of the shape is yellow?`,
        body: fractionSVG(parts, shaded, kind),
        type: 'mc', choices, answer,
        explain: `The shape is cut into <b>${parts}</b> equal parts and <b>${shaded}</b> ${shaded === 1 ? 'is' : 'are'} yellow. That's <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'geo_3d', strand: 'geo', name: 'Solid shapes',
    gen: () => {
      const solids = [
        ['a basketball 🏀', 'sphere'], ['a can of soup 🥫', 'cylinder'], ['a birthday hat 🎉', 'cone'],
        ['a dice 🎲', 'cube'], ['an ice-cream cone 🍦', 'cone'], ['a cereal box 🥣', 'rectangular prism'],
        ['the moon 🌕', 'sphere'], ['a drum 🥁', 'cylinder'], ['a gift box 🎁', 'cube'],
      ];
      const [item, answer] = pick(solids);
      const all = ['sphere', 'cylinder', 'cone', 'cube', 'rectangular prism'];
      const { choices } = mcSet(answer, () => pick(all));
      return {
        prompt: `What solid shape is <b>${item}</b>?`,
        type: 'mc', choices, answer,
        explain: `${item[0].toUpperCase() + item.slice(1)} is shaped like a <b>${answer}</b>.`,
      };
    },
  },

  // ---------------- GRAPHS & DATA ----------------
  {
    id: 'data_bar', strand: 'data', name: 'Read a bar graph',
    gen: () => {
      const cats = shuffle([['Dogs', '🐶'], ['Cats', '🐱'], ['Fish', '🐠'], ['Birds', '🐦'], ['Bunnies', '🐰']]).slice(0, 4);
      const items = cats.map(([label, emoji]) => ({ label, emoji, value: ri(1, 10) }));
      const kind = pick(['read', 'most', 'least']);
      const graph = barGraphSVG(items);
      if (kind === 'read') {
        const it = pick(items);
        return {
          prompt: `Our class made a graph of favorite pets. How many kids picked <b>${it.label}</b> ${it.emoji}?`,
          body: graph, wide: true, type: 'num', answer: it.value,
          explain: `Find the ${it.label} bar and slide your finger left to the numbers: <b>${it.value}</b>.`,
        };
      }
      const best = items.reduce((m, i) => (kind === 'most' ? i.value > m.value : i.value < m.value) ? i : m, items[0]);
      const tie = items.filter(i => i.value === best.value).length > 1;
      if (tie) { // avoid ties for most/least questions
        const it = pick(items);
        return {
          prompt: `Our class made a graph of favorite pets. How many kids picked <b>${it.label}</b> ${it.emoji}?`,
          body: graph, wide: true, type: 'num', answer: it.value,
          explain: `Find the ${it.label} bar and slide your finger left to the numbers: <b>${it.value}</b>.`,
        };
      }
      return {
        prompt: `Which pet got the <b>${kind.toUpperCase()}</b> votes?`,
        body: graph, wide: true, type: 'mc',
        choices: shuffle(items.map(i => i.label)), answer: best.label,
        explain: `The ${kind === 'most' ? 'tallest' : 'shortest'} bar wins: <b>${best.label}</b> with ${best.value} votes.`,
      };
    },
  },
  {
    id: 'data_picto', strand: 'data', name: 'Read a picture graph',
    gen: () => {
      const rows = shuffle([['Monday', '🌞'], ['Tuesday', '🌞'], ['Wednesday', '🌞']]).slice(0, 3);
      const each = pick([1, 2]);
      const data = rows.map(([d]) => ({ d, n: ri(2, 6) }));
      const it = pick(data);
      const table = `<table class="cheat-table" style="max-width:420px;margin:0 auto"><tr><th>Day</th><th>Books read 📚</th></tr>${
        data.map(r => `<tr><td>${r.d}</td><td>${'📚'.repeat(r.n)}</td></tr>`).join('')
      }</table><p style="font-weight:800;margin-top:8px">Each 📚 = ${each} book${each > 1 ? 's' : ''}</p>`;
      return {
        prompt: `How many books did the class read on <b>${it.d}</b>?`,
        body: table, wide: true, type: 'num', answer: it.n * each,
        explain: `Count the 📚 on ${it.d}: there are ${it.n}. Each one stands for ${each}. ${it.n} × ${each} = <b>${it.n * each}</b> books.`,
      };
    },
  },
  {
    id: 'data_tally', strand: 'data', name: 'Count the tally marks',
    gen: () => {
      const n = ri(6, 23);
      return {
        prompt: `How many tally marks?`,
        body: tallySVG(n), wide: true, type: 'num', answer: n,
        explain: `Each bundle with a line across = 5. Skip count by 5s, then add the extras: <b>${n}</b>.`,
      };
    },
  },

  // ---------------- GETTING READY TO MULTIPLY ----------------
  {
    id: 'mult_array', strand: 'mult', name: 'Arrays & repeated addition',
    gen: () => {
      const r = ri(2, 4);
      let c = ri(2, 6); while (c === r) c = ri(2, 6);
      const correct = `${Array(r).fill(c).join(' + ')} = ${r * c}`;
      const wrongs = [
        `${Array(c).fill(r).join(' + ')} = ${r * c + r}`,
        `${Array(r).fill(c + 1).join(' + ')} = ${r * (c + 1)}`,
        `${c} + ${r} = ${c + r}`,
      ].filter(w => w !== correct);
      return {
        prompt: `Which addition sentence matches the rows of this array?`,
        body: arraySVG(r, c), wide: true,
        type: 'mc', choices: shuffle([correct, ...[...new Set(wrongs)]]), answer: correct,
        explain: `There are <b>${r} rows</b> with <b>${c} dots</b> in each row: ${correct}. ✓`,
      };
    },
  },
  {
    id: 'mult_groups', strand: 'mult', name: 'Equal groups',
    gen: () => {
      const g = ri(2, 5), each = ri(2, 6);
      const [thing, emoji] = pick(THINGS);
      const groups = Array(g).fill(`<span style="font-size:30px;letter-spacing:2px">${emoji.repeat(each)}</span>`).map(s => `<span style="border:3px solid var(--line);border-radius:14px;padding:6px 10px;display:inline-block;margin:4px;background:#FFFDF4">${s}</span>`).join('');
      return {
        prompt: `There are <b>${g} bags</b> with <b>${each} ${thing}</b> in each bag. How many ${thing} in all?`,
        body: `<div>${groups}</div>`, wide: true,
        type: 'num', answer: g * each,
        explain: `Add the equal groups: ${Array(g).fill(each).join(' + ')} = <b>${g * each}</b>.`,
      };
    },
  },
];

// shared generator for skip counting
function skipCount(step) {
  const maxStart = step === 100 ? 500 : step === 10 ? 50 : step === 5 ? 40 : 20;
  let start = ri(0, Math.floor(maxStart / step)) * step;
  if (step === 2 && ri(0, 1)) start += 1; // odd skip-2 chains too
  const seq = [0, 1, 2, 3].map(i => start + i * step);
  const blankIdx = ri(2, 4); // blank is position 2..4 (0-indexed into 5 numbers)
  const full = [...seq, start + 4 * step];
  const answer = full[blankIdx];
  const shown = full.map((v, i) => i === blankIdx ? '___' : v);
  return {
    prompt: `Skip count by ${step}s. What goes in the blank?`,
    body: `<div class="bignum">${shown.join(', ')}</div>`,
    type: 'num', answer,
    explain: `Each number goes up by <b>${step}</b>. ${full[blankIdx - 1]} + ${step} = <b>${answer}</b>.`,
  };
}
