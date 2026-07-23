/* ============================================================
   LEARNING GARDEN — paper.js
   Worksheet maker: colorful, garden-branded printable pages —
   practice sheets with show-your-work boxes + a grown-ups answer
   key, and ruled handwriting tracing sheets. Every print is
   freshly generated.
   ============================================================ */

function stripButtons(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  d.querySelectorAll('button, input, select').forEach(el => el.remove());
  return d.innerHTML;
}

function renderWorksheetMaker() {
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));
  const catalog = activeSubjects().map(sub => {
    const rows = SKILLS.filter(s => strandSubject[s.strand] === sub.id && s.strand !== 'handwriting').map(s =>
      `<label style="display:flex;gap:8px;align-items:center;font-weight:700;font-size:14.5px;padding:5px 2px">
        <input type="checkbox" class="ws-chk" value="${s.id}" style="width:19px;height:19px;accent-color:var(--green)">
        ${STRANDS.find(x => x.id === s.strand).emoji} ${s.name}
      </label>`).join('');
    if (!rows) return '';
    const u = subjUI(sub.id);
    return `<details ${sub.id === 'math' ? 'open' : ''} style="margin-top:10px">
      <summary style="font-family:var(--font-head);font-weight:800;font-size:16px;cursor:pointer;color:${u.dark}">
        ${sub.name}</summary>${rows}</details>`;
  }).join('');

  app.innerHTML = `<div class="reveal">
    <div class="card">
      <h2><span class="bubble" style="background:var(--gold-tint);color:var(--gold)">${icon('printer', 17)}</span>Worksheet maker</h2>
      <p class="note">Pick skills, choose how many problems, and print a fresh worksheet — with <b>show-your-work boxes</b> and a separate answer-key page for you. Every worksheet is different, so print as many as you like!</p>
      <div class="field-row" style="align-items:center">
        <label style="font-weight:800">Problems:
          <select id="wsCount" style="font-weight:700;padding:6px 10px;border:var(--outline);border-radius:10px;margin-left:6px">
            <option value="8">8</option><option value="12" selected>12</option><option value="16">16</option><option value="20">20</option>
          </select>
        </label>
        <button class="btn small sunny" id="wsPreset">${icon('zap', 14)} Quick pick: this week's plan</button>
      </div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--green-tint);color:var(--green)">${icon('check', 16)}</span>Which skills?</h2>
      ${catalog}
      <div class="field-row">
        <button class="btn primary" id="wsMake">${icon('printer', 15)} Make my worksheet</button>
        <button class="btn ghost" id="wsBack">${icon('left', 14)} Back</button>
      </div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--terra-tint);color:var(--terra)">${icon('pencil', 16)}</span>Handwriting sheet</h2>
      <p class="note">Ruled tracing rows — light letters to trace, then empty lines to try alone.</p>
      <div class="field-row" style="align-items:center;flex-wrap:wrap">
        <label style="font-weight:800">Practice:
          <select id="hwpSet" style="font-weight:700;padding:6px 10px;border:var(--outline);border-radius:10px;margin-left:6px">
            <option value="upper">UPPERCASE A–Z</option>
            <option value="lower">lowercase a–z</option>
            <option value="numbers">Numbers 0–9</option>
            <option value="name">My name + little words</option>
          </select>
        </label>
        <button class="btn sky" id="hwpMake">${icon('pencil', 15)} Make a handwriting sheet</button>
      </div>
    </div>
  </div>`;

  $('#wsPreset').onclick = () => {
    const plan = getWeekPlan();
    const ids = new Set(plan.flat());
    $$('.ws-chk').forEach(cb => { cb.checked = ids.has(cb.value); });
    $$('.ws-chk').forEach(cb => { if (cb.checked) cb.closest('details').open = true; });
  };
  $('#wsMake').onclick = () => {
    const picked = $$('.ws-chk').filter(cb => cb.checked).map(cb => cb.value);
    if (!picked.length) { alert('Tick at least one skill first!'); return; }
    renderWorksheet(picked, +$('#wsCount').value);
  };
  $('#hwpMake').onclick = () => renderHandwritingSheet($('#hwpSet').value);
  $('#wsBack').onclick = () => show('grownups');
}

// shared print-page chrome: colorful garden header + flower footer
function wsPageHead(title, subtitle) {
  return `<div class="wsp-head">
      <span class="wsp-logo">${logoSVG(34)}</span>
      <span style="flex:1;min-width:0">
        <b class="wsp-title">${title}</b>
        <span class="wsp-sub">${subtitle}</span>
      </span>
      <span class="wsp-lines"><span>Name: ______________________</span><span>Date: ____________</span></span>
    </div>`;
}
function wsPageFoot(seedKey) {
  const seedOf = (str) => [...String(seedKey || 'garden')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return `<div class="wsp-foot">
      ${[0, 1, 2, 3, 4].map(i => flowerSVG({ seed: seedOf(seedKey) + i * 53, size: 30 })).join('')}
      <span>grow a little every day</span>
      ${[5, 6, 7, 8, 9].map(i => flowerSVG({ seed: seedOf(seedKey) + i * 53, size: 30 })).join('')}
    </div>`;
}

function wsInstructionFor(sample) {
  if (sample.body && sample.body.includes('vertical-math')) return 'Solve each problem — show your work in the box!';
  if (sample.type === 'mc') return 'Circle the correct answer.';
  if (sample.body && sample.body.includes('<svg')) return 'Look at each picture, then write your answer on the line.';
  return 'Write your answer on the line.';
}

function renderWorksheet(skillIds, count) {
  const strandSubject = Object.fromEntries(STRANDS.map(x => [x.id, x.subject]));
  // education.com pattern: one PART per skill, each with its own
  // instruction band and a grid of visual problem cells
  const perSkill = Math.max(2, Math.ceil(count / skillIds.length));
  const partsData = skillIds.map(sid => {
    const sk = SKILL_MAP[sid];
    const qs = [];
    let guard = 0;
    while (qs.length < perSkill && guard++ < perSkill * 8) {
      const q = sk.gen(2);
      if (q.type === 'trace') continue;
      qs.push(q);
    }
    return { sk, qs, subj: strandSubject[sk.strand] || 'custom' };
  }).filter(pt => pt.qs.length);

  const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];
  let qNum = 0;
  const keyRows = [];
  const partsHTML = partsData.map((pt, pi) => {
    const u = subjUI(pt.subj);
    const instr = wsInstructionFor(pt.qs[0]);
    const cells = pt.qs.map(q => {
      qNum++;
      const isMath = q.body && q.body.includes('vertical-math');
      const u2 = subjUI(pt.subj);
      keyRows.push({ n: qNum, q, color: u2.color, skill: pt.sk.name });
      const choices = q.type === 'mc'
        ? `<div class="wsq-choices">${q.choices.map((c, j) =>
            `<span class="wsq-choice"><i class="cl" style="border-color:${u2.color}">${LETTERS[j]}</i>${esc(String(c))}</span>`).join('')}</div>`
        : '';
      const blank = q.type !== 'mc'
        ? `<div class="wsq-blank">${q.suffix ? `<span>${q.suffix}</span>` : ''}</div>` : '';
      return `<div class="wsq-cell ${isMath ? 'wide' : ''}">
        <span class="wsq-num" style="background:${u2.tint};color:${u2.dark}">${qNum}</span>
        <div class="wsq-body">
          <div class="wsq-prompt">${stripButtons(q.prompt)}</div>
          ${q.body ? `<div class="wsq-visual">${stripButtons(q.body)}</div>` : ''}
          ${choices}${blank}
        </div>
        ${isMath ? '<div class="ws-work"><span>show your work</span></div>' : ''}
      </div>`;
    }).join('');
    return `<div class="ws-part">
      <div class="ws-part-band" style="background:${u.tint};border-left:6px solid ${u.color}">
        <b style="color:${u.dark}">Part ${pi + 1}: ${esc(pt.sk.name)}</b>
        <span>${instr}</span>
      </div>
      <div class="wsq-grid">${cells}</div>
    </div>`;
  }).join('');

  const key = keyRows.map(r => {
    const ans = r.q.type === 'mc'
      ? `${LETTERS[r.q.choices.findIndex(c => String(c) === String(r.q.answer))]}) ${esc(String(r.q.answer))}`
      : `${esc(String(r.q.answer))}${r.q.suffix || ''}`;
    return `<div style="font-weight:700;padding:4px 0;break-inside:avoid"><span style="color:${r.color};font-weight:800">${r.n}.</span> ${ans} <span style="color:var(--ink-faint);font-size:12.5px">(${r.skill})</span></div>`;
  }).join('');

  app.innerHTML = `<div class="ws-page">
    <div class="answer-row no-print" style="margin-bottom:14px">
      <button class="btn primary big" id="wsPrint">${icon('printer', 16)} Print</button>
      <button class="btn sunny" id="wsAnother">New problems, same skills</button>
      <button class="btn ghost" id="wsBack2">${icon('left', 14)} Back</button>
    </div>
    <div class="card wsp-card">
      ${wsPageHead('Learning Garden worksheet', 'The thinking is the important part — take your time!')}
      ${partsHTML}
      ${wsPageFoot(skillIds.join(''))}
    </div>
    <div class="card answer-key wsp-card">
      ${wsPageHead('Answer key', 'For grown-ups — every reprint makes brand-new problems.')}
      <div class="wsp-keycols">${key}</div>
    </div>
  </div>`;
  $('#wsPrint').onclick = () => window.print();
  $('#wsAnother').onclick = () => renderWorksheet(skillIds, count);
  $('#wsBack2').onclick = renderWorksheetMaker;
  window.scrollTo(0, 0);
}

// ruled tracing sheet: trace rows + empty try-it rows
function renderHandwritingSheet(set) {
  const k = kid();
  const rows = set === 'upper' ? 'A B C D E F G H I J K L M'.split(' ').map(c => c.repeat(1))
    : set === 'lower' ? 'a b c d e f g h i j k l m'.split(' ')
    : set === 'numbers' ? '0 1 2 3 4 5 6 7 8 9'.split(' ')
    : [(k && /^[A-Za-z]{2,10}$/.test(k.name) ? k.name : 'love'), 'cat', 'dog', 'sun', 'the', 'and'];
  const more = set === 'upper' ? 'N O P Q R S T U V W X Y Z'.split(' ')
    : set === 'lower' ? 'n o p q r s t u v w x y z'.split(' ') : [];
  const line = (t, empty) => `<div class="hwp-row">
      <i class="mid"></i>
      <span class="hwp-text${empty ? ' ghost' : ''}">${empty ? '' : esc((t + ' ').repeat(t.length > 1 ? 3 : 8).trim())}</span>
    </div>`;
  const body = rows.map(t => line(t) + (set === 'name' ? line(t, true) : '')).join('')
    + (more.length ? `<div class="hwp-pagebreak"></div>` + more.map(t => line(t)).join('') : '')
    + (set !== 'name' ? line('', true) + line('', true) : '');
  app.innerHTML = `<div class="ws-page">
    <div class="answer-row no-print" style="margin-bottom:14px">
      <button class="btn primary big" id="hwpPrint">${icon('printer', 16)} Print</button>
      <button class="btn ghost" id="hwpBack">${icon('left', 14)} Back</button>
    </div>
    <div class="card wsp-card">
      ${wsPageHead('Handwriting practice', 'Trace the light letters slowly — then try the empty line all by yourself!')}
      ${body}
      ${wsPageFoot('handwriting' + set)}
    </div>
  </div>`;
  $('#hwpPrint').onclick = () => window.print();
  $('#hwpBack').onclick = renderWorksheetMaker;
  window.scrollTo(0, 0);
}
