/* ============================================================
   LEARNING GARDEN — handwriting.js · trace letters with a finger
   A guide letter (Andika, light) sits under a drawing canvas; the
   kid traces with finger/mouse. Scoring compares ink coverage of
   the glyph mask (lenient, blame-free — measurement never scolds).
   Progress records through recordTypingAnswer (typing.js), so
   mastery/log/plans all work with zero engine changes.
   ============================================================ */

STRANDS.push(
  { id: 'handwriting', subject: 'ela', name: 'Handwriting', emoji: '✍️', color: 'var(--coral)',
    lesson: `<p><b>Neat letters are drawn, not rushed!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Hold your pencil (or finger!) like a bird — snug, not squeezed.</li>
        <li><b>Tall letters</b> touch the top line: b, d, f, h, k, l, t.</li>
        <li><b>Tail letters</b> hang below: g, j, p, q, y.</li>
        <li>Start letters at the TOP and pull down — letters grow like raindrops, not up like rockets.</li>
        <li>Leave a finger space between words.</li>
      </ul>` }
);

const HW_WORDS = ['cat', 'dog', 'sun', 'mom', 'dad', 'love', 'the', 'and', 'you', 'red', 'big', 'run', 'hop', 'yes', 'fun', 'day'];
const HW_SETS = {
  hw_upper: { name: 'Trace UPPERCASE letters', pool: () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') },
  hw_lower: { name: 'Trace lowercase letters', pool: () => 'abcdefghijklmnopqrstuvwxyz'.split('') },
  hw_numbers: { name: 'Trace numbers', pool: () => '0123456789'.split('') },
  hw_words: { name: 'Trace little words', pool: () => { const k = kid(); const base = HW_WORDS.slice(); if (k && /^[A-Za-z]{2,10}$/.test(k.name)) base.unshift(k.name); return base; } },
};
for (const [id, def] of Object.entries(HW_SETS)) {
  SKILLS.push({
    id, strand: 'handwriting', name: def.name,
    gen: () => { const t = pick(def.pool()); return { type: 'trace', prompt: `Trace: ${t}`, answer: t, target: t }; },
  });
}

let HW = null;

function renderHandwritingSession(sk) {
  VIEW = 'session';
  $('#tabbar').style.display = 'none';
  TT.ctx = sk.id;
  HW = { sk, i: 0, right: 0, tries: 0, targets: shuffle(HW_SETS[sk.id].pool().slice()).slice(0, SKILL_DONE_Q) };
  const u = subjUI('ela');
  setAppbar(`
    <button class="back" id="hwQuit" aria-label="Done">${icon('left', 18)}</button>
    <span class="subj-ico" style="width:34px;height:34px;background:${u.tint};color:${u.color}">${icon('pencil', 17)}</span>
    <div class="title">Handwriting · ${esc(sk.name)}</div>
    <span class="type-progress" style="max-width:240px"><i id="hwBar" style="background:var(--coral, #E56B4E)"></i></span>
    <span id="hwCount" style="font-weight:700;font-size:12.5px;color:var(--soft);white-space:nowrap"></span>`);
  app.innerHTML = `
    <div class="hw-stage">
      <p class="eyebrow" style="text-align:center;color:${u.color}" id="hwSay"></p>
      <div class="trace-box" id="traceBox">
        <div class="trace-lines"><i class="top"></i><i class="mid"></i><i class="base"></i></div>
        <div class="trace-guide" id="traceGuide"></div>
        <canvas id="traceInk"></canvas>
      </div>
      <div class="answer-row" style="justify-content:center;margin-top:14px">
        <button class="btn ghost" id="hwClear">${icon('x', 14)} Clear</button>
        <button class="btn small ghost" id="hwHear">${icon('volume', 14)} Say it</button>
        <button class="btn primary big caps-btn" id="hwDone">I traced it!</button>
      </div>
      <div id="hwFb" style="text-align:center;margin-top:10px"></div>
    </div>
    <div class="mascot"><span class="fox">${foxSVG(42, "talk")}</span><span class="say" id="hwMascot">Start at the top and pull down — nice and slow!</span></div>`;
  $('#hwQuit').onclick = () => show('practice');
  $('#hwClear').onclick = () => hwClearInk();
  $('#hwHear').onclick = () => hwSpeak();
  $('#hwDone').onclick = () => hwScore();
  hwNext(true);
}

function hwTarget() { return HW.targets[HW.i]; }
function hwSpeak() {
  const t = hwTarget();
  const said = t.length === 1 ? (/[0-9]/.test(t) ? `the number ${t}` : `the letter ${t}`) : `the word ${t}`;
  speak(`Trace ${said}!`, 'en');
}

function hwNext(first) {
  if (HW.i >= HW.targets.length) return hwFinish();
  HW.tries = 0;
  const t = hwTarget();
  $('#hwSay').textContent = t.length === 1 ? `Trace it — nice and slow` : `Trace the whole word`;
  $('#hwCount').textContent = `${HW.i + 1} of ${HW.targets.length}`;
  $('#hwBar').style.width = `${Math.round(HW.i / HW.targets.length * 100)}%`;
  $('#hwFb').innerHTML = '';
  const guide = $('#traceGuide');
  guide.textContent = t;
  guide.style.fontSize = t.length === 1 ? '260px' : `${Math.max(64, Math.floor(720 / t.length))}px`;
  hwSizeCanvas();
  hwClearInk();
  hwSpeak();
}

function hwSizeCanvas() {
  const box = $('#traceBox');
  const cv = $('#traceInk');
  const r = box.getBoundingClientRect();
  cv.width = Math.round(r.width);
  cv.height = Math.round(r.height);
  const ctx = cv.getContext('2d');
  ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#D05C38';
  let drawing = false, px = 0, py = 0;
  cv.onpointerdown = (e) => { drawing = true; const p = hwPoint(cv, e); px = p.x; py = p.y; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = (e) => {
    if (!drawing) return;
    const p = hwPoint(cv, e);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
    px = p.x; py = p.y;
    HW.inked = true;
  };
  cv.onpointerup = () => { drawing = false; };
  cv.onpointercancel = () => { drawing = false; };
}
function hwPoint(cv, e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) };
}
function hwClearInk() {
  const cv = $('#traceInk');
  cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
  HW.inked = false;
}

// glyph mask: draw the same text into an offscreen canvas at the same spot
function hwMask() {
  const guide = $('#traceGuide');
  const box = $('#traceBox');
  const cv = $('#traceInk');
  const off = document.createElement('canvas');
  off.width = cv.width; off.height = cv.height;
  const ctx = off.getContext('2d');
  const gs = getComputedStyle(guide);
  ctx.font = `${gs.fontWeight} ${gs.fontSize} ${gs.fontFamily}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const gr = guide.getBoundingClientRect(), br = box.getBoundingClientRect();
  ctx.fillText(guide.textContent, (gr.left - br.left + gr.width / 2) * (cv.width / br.width), (gr.top - br.top + gr.height / 2) * (cv.height / br.height));
  return ctx.getImageData(0, 0, off.width, off.height).data;
}

function hwScore() {
  if (!HW.inked) { $('#hwMascot').textContent = 'Draw right on the gray letter with your finger!'; return; }
  const cv = $('#traceInk');
  const ink = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  const mask = hwMask();
  // widen the glyph mask by sampling neighbors — tracing NEAR the letter counts
  const W = cv.width, H = cv.height, R = 14;
  let inkTotal = 0, inkOnGlyph = 0, glyphTotal = 0, glyphInked = 0;
  const step = 3;
  const on = (d, x, y) => d[(y * W + x) * 4 + 3] > 40;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const g = on(mask, x, y);
      const i = on(ink, x, y);
      if (g) glyphTotal++;
      if (i) inkTotal++;
      if (g && !i) {
        // is there ink NEAR this glyph pixel?
        let near = false;
        for (let dy = -R; dy <= R && !near; dy += 7) {
          for (let dx = -R; dx <= R && !near; dx += 7) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H && on(ink, nx, ny)) near = true;
          }
        }
        if (near) glyphInked++;
      } else if (g && i) glyphInked++;
      if (i) {
        let nearG = g;
        for (let dy = -R; dy <= R && !nearG; dy += 7) {
          for (let dx = -R; dx <= R && !nearG; dx += 7) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H && on(mask, nx, ny)) nearG = true;
          }
        }
        if (nearG) inkOnGlyph++;
      }
    }
  }
  const coverage = glyphTotal ? glyphInked / glyphTotal : 0;
  const precision = inkTotal ? inkOnGlyph / inkTotal : 0;
  const pass = coverage >= 0.45 && precision >= 0.55;
  if (pass) {
    HW.right++;
    recordTypingAnswer(HW.sk, true);
    updateWaterChip();
    sfx('correct'); burst(24);
    $('#hwFb').innerHTML = `<span class="pill" style="color:var(--green);background:var(--green-tint);border-color:var(--green-tint)">${icon('check', 14)} Beautiful tracing!</span>`;
    $('#hwMascot').textContent = pick(['Gorgeous letters!', 'Your pencil listens to you!', 'Smooth and steady — love it!']);
    HW.i++;
    setTimeout(() => hwNext(), 900);
  } else if (HW.tries === 0) {
    HW.tries++;
    sfx('wrong');
    $('#hwMascot').textContent = coverage < 0.45 ? 'Trace the WHOLE letter — every part of the gray shape!' : 'Stay right on the gray letter — slow and steady!';
    $('#hwFb').innerHTML = `<span class="pill" style="color:var(--gold)">${icon('bulb', 14)} Almost — try once more!</span>`;
  } else {
    recordTypingAnswer(HW.sk, false);
    updateWaterChip();
    $('#hwMascot').textContent = 'Good practice! This letter and I will meet you again soon.';
    HW.i++;
    setTimeout(() => hwNext(), 900);
  }
}

function hwFinish() {
  sfx(HW.right >= 4 ? 'cheer' : 'water');
  if (HW.right >= 4) burst(80, true);
  const u = subjUI('ela');
  app.innerHTML = `<div class="reveal lp-center">
    <div class="complete-card pop">
      <span class="gift-big">${trophySVG(44)}</span>
      <h1 style="font-size:30px;font-weight:800;margin-top:10px">${HW.right} of ${HW.targets.length} beautiful!</h1>
      <p class="note" style="margin-top:6px">Handwriting grows with tiny bits of practice — your hand remembers.</p>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:18px">
        <button class="btn primary big caps-btn" id="hwAgain">Trace more</button>
        <button class="btn big" id="hwBack">Back to Practice</button>
      </div>
    </div>
    <div class="mascot" style="position:fixed;left:22px;bottom:22px"><span class="fox">${foxSVG(42, "cheer")}</span><span class="say">Every trace makes tomorrow's letters neater!</span></div>
  </div>`;
  $('#hwAgain').onclick = () => renderHandwritingSession(HW.sk);
  $('#hwBack').onclick = () => show('practice');
}
