/* ============================================================
   LEARNING GARDEN — paper.js
   🖨️ Worksheet maker: turn any skills into a printable page
   with show-your-work boxes + a separate answer key page.
   Because math should happen on paper too!
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
    const rows = SKILLS.filter(s => strandSubject[s.strand] === sub.id).map(s =>
      `<label style="display:flex;gap:8px;align-items:center;font-weight:700;font-size:14.5px;padding:5px 2px">
        <input type="checkbox" class="ws-chk" value="${s.id}" style="width:19px;height:19px;accent-color:var(--leaf)">
        ${STRANDS.find(x => x.id === s.strand).emoji} ${s.name}
      </label>`).join('');
    return `<details ${sub.id === 'math' ? 'open' : ''} style="margin-top:10px"><summary style="font-family:var(--font-display);font-weight:600;font-size:17px;cursor:pointer">${sub.emoji} ${sub.name}</summary>${rows}</details>`;
  }).join('');

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--sun)">🖨️</span>Worksheet maker</h2>
      <p class="note">Pick skills, choose how many problems, and print a fresh worksheet — with <b>show-your-work boxes</b> and a separate answer-key page for you. Every worksheet is different, so print as many as you like!</p>
      <div class="field-row" style="align-items:center">
        <label style="font-weight:800">Problems:
          <select id="wsCount" style="font-weight:700;padding:6px 10px;border:var(--outline);border-radius:10px;margin-left:6px">
            <option value="8">8</option><option value="12" selected>12</option><option value="16">16</option><option value="20">20</option>
          </select>
        </label>
        <button class="btn small sunny" id="wsPreset">⚡ Quick pick: this week's plan</button>
      </div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--leaf)">✅</span>Which skills?</h2>
      ${catalog}
      <div class="field-row">
        <button class="btn primary" id="wsMake">Make my worksheet 🖨️</button>
        <button class="btn ghost" id="wsBack">← Back</button>
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
  $('#wsBack').onclick = () => show('grownups');
}

function renderWorksheet(skillIds, count) {
  const qs = [];
  let guard = 0;
  while (qs.length < count && guard++ < count * 6) {
    const sk = SKILL_MAP[skillIds[qs.length % skillIds.length]];
    const q = sk.gen(2);
    q._skill = sk.name;
    qs.push(q);
  }

  const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];
  const items = qs.map((q, i) => {
    const isMath = q.body && q.body.includes('vertical-math');
    const choices = q.type === 'mc'
      ? `<div style="font-weight:700;margin-top:6px">${q.choices.map((c, j) => `<span style="margin-right:18px;white-space:nowrap">${LETTERS[j]})&nbsp;${esc(String(c))}</span>`).join('')}</div>`
      : '';
    const blank = q.type !== 'mc'
      ? `<div style="font-weight:800;margin-top:8px">Answer: ______________${q.suffix ? ' ' + q.suffix : ''}</div>` : '';
    return `<div class="ws-q">
      <div class="wsn">${i + 1}.</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700">${stripButtons(q.prompt)}</div>
        ${q.body ? `<div style="margin-top:6px">${stripButtons(q.body)}</div>` : ''}
        ${choices}${blank}
      </div>
      <div class="ws-work"></div>
    </div>`;
  }).join('');

  const key = qs.map((q, i) => {
    const ans = q.type === 'mc'
      ? `${LETTERS[q.choices.findIndex(c => String(c) === String(q.answer))]}) ${esc(String(q.answer))}`
      : `${esc(String(q.answer))}${q.suffix || ''}`;
    return `<div style="font-weight:700;padding:4px 0">${i + 1}. ${ans} <span style="color:var(--ink-faint);font-size:12.5px">(${q._skill})</span></div>`;
  }).join('');

  app.innerHTML = `<div>
    <div class="answer-row no-print" style="margin-bottom:14px">
      <button class="btn primary big" id="wsPrint">🖨️ Print</button>
      <button class="btn sunny" id="wsAnother">🔄 New problems, same skills</button>
      <button class="btn ghost" id="wsBack2">← Back</button>
    </div>
    <div class="card">
      <div class="ws-head">
        <span>Name: ____________________</span>
        <span>Date: ____________</span>
      </div>
      <div style="font-family:var(--font-display);font-weight:600;font-size:19px;margin-bottom:4px">🌻 Learning Garden worksheet</div>
      <p class="note" style="margin-bottom:6px">Show your work in the box — the thinking is the important part!</p>
      ${items}
    </div>
    <div class="card answer-key">
      <h2><span class="bubble" style="background:var(--coral)">🔑</span>Answer key (for grown-ups!)</h2>
      ${key}
    </div>
  </div>`;
  $('#wsPrint').onclick = () => window.print();
  $('#wsAnother').onclick = () => renderWorksheet(skillIds, count);
  $('#wsBack2').onclick = renderWorksheetMaker;
  window.scrollTo(0, 0);
}
