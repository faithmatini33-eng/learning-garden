/* ============================================================
   LEARNING GARDEN — custom.js
   Parent-authored lessons (flashcards + multiple choice) that
   become real, tracked skills. Also the "attach & guide"
   homework photo helper.
   Shares globals (DB, SKILLS, STRANDS, SKILL_MAP, save, …).
   ============================================================ */

// ------------------------------------------------------------
// Build runtime skills from DB.custom and splice into the catalog
// ------------------------------------------------------------
function buildCustomSkill(entry) {
  const strandId = 'custom_' + entry.subject; // group by chosen subject
  return {
    id: 'cust_' + entry.id, strand: strandId, name: entry.name, custom: true,
    gen: () => {
      const items = entry.items;
      const it = items[ri(0, items.length - 1)];
      if (entry.kind === 'mc') {
        const wrongs = (it.wrongs || []).filter(Boolean);
        return {
          prompt: it.q,
          type: 'mc', choices: shuffle([it.a, ...wrongs]).slice(0, 4).includes(it.a)
            ? shuffle([it.a, ...wrongs].filter((v, i, arr) => arr.indexOf(v) === i)).slice(0, 4)
            : [it.a, ...wrongs],
          answer: it.a,
          explain: it.why ? it.why : `The answer is <b>${it.a}</b>.`,
        };
      }
      // flashcards: if we have ≥4 distinct answers, make it multiple choice
      const answers = [...new Set(items.map(x => x.a))];
      if (answers.length >= 4) {
        const wrongs = shuffle(answers.filter(a => a !== it.a)).slice(0, 3);
        return {
          prompt: it.q,
          type: 'mc', choices: shuffle([it.a, ...wrongs]), answer: it.a,
          explain: `<b>${it.q}</b> → <b>${it.a}</b>`,
        };
      }
      // otherwise type the answer
      return {
        prompt: it.q, type: 'text', answer: it.a,
        explain: `<b>${it.q}</b> → <b>${it.a}</b>`,
      };
    },
  };
}

function loadCustomSkills() {
  // drop any previously-built custom skills + strands
  for (let i = SKILLS.length - 1; i >= 0; i--) if (SKILLS[i].custom) SKILLS.splice(i, 1);
  for (let i = STRANDS.length - 1; i >= 0; i--) if (STRANDS[i].custom) STRANDS.splice(i, 1);

  const list = DB.custom || [];
  const strandsSeen = {};
  list.forEach(entry => {
    const sid = 'custom_' + entry.subject;
    if (!strandsSeen[sid]) {
      const base = SUBJECTS.find(s => s.id === entry.subject) || SUBJECTS.find(s => s.id === 'custom');
      STRANDS.push({
        id: sid, subject: entry.subject, custom: true,
        name: entry.subject === 'custom' ? 'My Lessons' : base.name + ' — mine',
        emoji: '📌', color: 'var(--berry)',
      });
      strandsSeen[sid] = true;
    }
    SKILLS.push(buildCustomSkill(entry));
  });
  rebuildSkillMap();
}

// ------------------------------------------------------------
// Create / edit a lesson
// ------------------------------------------------------------
let LESSON_DRAFT = null;

function renderCreateLesson(editId) {
  const editing = editId ? (DB.custom || []).find(c => c.id === editId) : null;
  LESSON_DRAFT = editing
    ? JSON.parse(JSON.stringify(editing))
    : { id: 't' + Date.now(), name: '', subject: 'custom', kind: 'flash', items: [{ q: '', a: '', wrongs: [] }] };
  LESSON_DRAFT.items.forEach(it => { it.wrongs = (it.wrongs || []).filter(Boolean); });
  CREATOR_ACTIVE = 0;
  renderCreatorShell();
}

let CREATOR_ACTIVE = 0;

function renderCreatorShell() {
  // teal parent band lives in the app bar (rule #8)
  setAppbar(`
    <span class="subj-ico" style="width:38px;height:38px;background:rgba(255,255,255,.16);color:#fff">${icon('pencil', 18)}</span>
    <span><b>My Lessons — make one</b>Teach exactly what the class is learning — spelling lists, facts, anything.</span>
    <span class="ab-spacer"></span>
    <button class="btn caps-btn" id="saveLesson" style="background:#fff;border-color:#fff;color:var(--teal)">Save lesson</button>
    <button class="btn caps-btn" id="cancelLesson" style="background:rgba(255,255,255,.15);border-color:transparent;color:#fff">${icon('left', 14)} Back</button>`);
  app.innerHTML = `<div class="reveal creator-grid">
    <div>
      <div class="card">
        <p class="eyebrow">Lesson name</p>
        <input class="text-input" id="lesName" maxlength="40" placeholder="e.g. Week 14 spelling list" value="${escAttr(LESSON_DRAFT.name)}" style="width:100%;margin-top:6px">
        <p class="eyebrow" style="margin-top:16px">Shows under</p>
        <div class="subj-chip-row" id="lesSubjRow" style="margin:8px 0 0"></div>
      </div>
      <div class="card">
        <p class="eyebrow">Questions (<span id="qCount">${LESSON_DRAFT.items.length}</span>)</p>
        <div id="qList" style="margin-top:10px"></div>
        <button class="btn small" id="addItem" style="background:var(--teal-tint);border-color:var(--teal-tint);color:var(--teal)">${icon('plus', 14)} Add a question</button>
      </div>
    </div>
    <div>
      <div class="card">
        <p class="eyebrow">How ${esc(DB.kids[0] ? DB.kids[0].name : 'your kid')} will see it</p>
        <div id="lesPreview"></div>
      </div>
      <div class="tip-box">${icon('bulb', 15)}
        <span>Tips: 5–10 questions is plenty. Wrong answers you type become the multiple-choice choices — with none, kids type the answer. Questions read themselves aloud to early readers automatically.</span>
      </div>
    </div>
  </div>`;
  creatorSubjRow();
  creatorQuestions();
  creatorPreview();
  $('#lesName').oninput = e => { LESSON_DRAFT.name = e.target.value; creatorPreview(); };
  $('#addItem').onclick = () => {
    LESSON_DRAFT.items.push({ q: '', a: '', wrongs: [] });
    CREATOR_ACTIVE = LESSON_DRAFT.items.length - 1;
    creatorQuestions(); creatorPreview();
    $('#qCount').textContent = LESSON_DRAFT.items.length;
    const inputs = $$('#qList .q-text'); const last = inputs[inputs.length - 1]; if (last) last.focus();
  };
  $('#cancelLesson').onclick = () => show('grownups');
  $('#saveLesson').onclick = saveCreatorLesson;
}

function creatorSubjRow() {
  const subs = [{ id: 'custom', name: 'My Lessons' }].concat(SUBJECTS.filter(s => s.id !== 'custom'));
  $('#lesSubjRow').innerHTML = subs.map(sub => {
    const u = subjUI(sub.id);
    const active = LESSON_DRAFT.subject === sub.id;
    return `<button class="subj-chip ${active ? 'active' : ''} ${sub.id === 'custom' ? 'dashed' : ''}" data-lsubj="${sub.id}"
      style="${active ? `background:${u.tint};border-color:${u.color};color:${u.dark}` : ''}">${esc(sub.name)}</button>`;
  }).join('');
  $$('[data-lsubj]').forEach(b => b.onclick = () => { LESSON_DRAFT.subject = b.dataset.lsubj; creatorSubjRow(); creatorPreview(); });
}

function creatorQuestions() {
  const rows = LESSON_DRAFT.items.map((it, i) => {
    const wrongChips = (it.wrongs || []).map((w, wi) =>
      `<span class="wrong-chip">wrong: <input class="chip-in les-w" data-i="${i}" data-w="${wi}" value="${escAttr(w)}" size="${Math.max(4, w.length || 6)}">
        <button class="chip-x" data-delw="${i}:${wi}" aria-label="Remove wrong answer">${icon('x', 10)}</button></span>`).join('');
    return `<div class="q-card ${i === CREATOR_ACTIVE ? 'active' : ''}" data-qcard="${i}">
      <div style="display:flex;align-items:center;gap:10px">
        <span class="q-num">${i + 1}</span>
        <input class="q-text les-q" data-i="${i}" placeholder="Type the question — e.g. Spell the word for a person you play with" value="${escAttr(it.q)}">
        ${LESSON_DRAFT.items.length > 1 ? `<button class="icon-btn" data-del-item="${i}" aria-label="Remove question" style="width:30px;height:30px;flex:none">${icon('x', 13)}</button>` : ''}
      </div>
      <div class="chip-line">
        <span class="ans-chip">${icon('check', 12)} answer: <input class="chip-in les-a" data-i="${i}" value="${escAttr(it.a)}" size="${Math.max(4, it.a.length || 6)}" placeholder="type it"></span>
        ${wrongChips}
        <button class="add-wrong" data-addw="${i}">＋ wrong answer</button>
      </div>
    </div>`;
  }).join('');
  $('#qList').innerHTML = rows;
  $$('#qList .q-card').forEach(card => card.addEventListener('focusin', () => {
    CREATOR_ACTIVE = +card.dataset.qcard;
    $$('#qList .q-card').forEach(c => c.classList.toggle('active', c === card));
    creatorPreview();
  }));
  $$('.les-q').forEach(el => el.oninput = () => { LESSON_DRAFT.items[+el.dataset.i].q = el.value; creatorPreview(); });
  $$('.les-a').forEach(el => el.oninput = () => { const it = LESSON_DRAFT.items[+el.dataset.i]; it.a = el.value; el.size = Math.max(4, el.value.length || 6); creatorPreview(); });
  $$('.les-w').forEach(el => el.oninput = () => { const it = LESSON_DRAFT.items[+el.dataset.i]; it.wrongs[+el.dataset.w] = el.value; el.size = Math.max(4, el.value.length || 6); creatorPreview(); });
  $$('[data-addw]').forEach(b => b.onclick = () => {
    const it = LESSON_DRAFT.items[+b.dataset.addw];
    it.wrongs = it.wrongs || [];
    if (it.wrongs.length >= 3) return;
    it.wrongs.push('');
    creatorQuestions(); creatorPreview();
    const ins = $$(`.les-w[data-i="${b.dataset.addw}"]`); const last = ins[ins.length - 1]; if (last) last.focus();
  });
  $$('[data-delw]').forEach(b => b.onclick = () => {
    const [i, wi] = b.dataset.delw.split(':').map(Number);
    LESSON_DRAFT.items[i].wrongs.splice(wi, 1);
    creatorQuestions(); creatorPreview();
  });
  $$('[data-del-item]').forEach(b => b.onclick = () => {
    LESSON_DRAFT.items.splice(+b.dataset.delItem, 1);
    CREATOR_ACTIVE = Math.min(CREATOR_ACTIVE, LESSON_DRAFT.items.length - 1);
    creatorQuestions(); creatorPreview();
    $('#qCount').textContent = LESSON_DRAFT.items.length;
  });
}

function creatorPreview() {
  const d = LESSON_DRAFT;
  const it = d.items[CREATOR_ACTIVE] || d.items[0] || { q: '', a: '', wrongs: [] };
  const subName = d.subject === 'custom' ? 'My Lessons' : (SUBJECTS.find(s => s.id === d.subject) || {}).name || '';
  const choices = it.a ? shuffle([it.a].concat((it.wrongs || []).filter(Boolean))) : [];
  const qPrev = it.q ? `
    <div class="prev-q">
      <p style="font-weight:800;font-size:15px">${esc(it.q)}</p>
      ${choices.length > 1
        ? `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:8px">${choices.map(c => `<span class="btn small ghost" style="pointer-events:none">${esc(c)}</span>`).join('')}</div>`
        : `<div style="display:flex;gap:7px;margin-top:8px"><span class="num-input" style="width:130px;display:inline-block;color:var(--muted);font-size:14px;padding:8px 12px">they type it…</span></div>`}
    </div>` : '<p class="note" style="margin-top:8px">Type a question on the left and watch it appear here.</p>';
  $('#lesPreview').innerHTML = `
    <div class="prev-row">
      <span class="seed-dot" style="width:11px;height:11px"></span>
      <b style="flex:1;min-width:0">${esc(d.name || 'Your lesson')}</b>
      <span class="pill" style="font-size:10.5px;background:var(--purple-tint);border-color:var(--purple-tint);color:var(--purple)">${esc(subName).toUpperCase()}</span>
    </div>
    <p class="note" style="margin:6px 0 10px">Appears in Practice${d.subject !== 'custom' ? ` under ${esc(subName)}` : ''} and can be picked as this week's school focus.</p>
    ${qPrev}`;
}

function saveCreatorLesson() {
  const d = LESSON_DRAFT;
  d.name = d.name.trim();
  d.items = d.items
    .map(it => ({ q: it.q.trim(), a: it.a.trim(), wrongs: (it.wrongs || []).map(w => w.trim()).filter(Boolean), why: it.why }))
    .filter(it => it.q && it.a);
  if (!d.name) { alert('Please give your lesson a name.'); return; }
  if (d.items.length < 1) { alert('Add at least one question with an answer.'); return; }
  d.kind = d.items.some(it => it.wrongs.length) ? 'mc' : 'flash';
  DB.custom = DB.custom || [];
  const idx = DB.custom.findIndex(c => c.id === d.id);
  if (idx >= 0) DB.custom[idx] = d; else DB.custom.push(d);
  save();
  loadCustomSkills();
  sfx('water');
  show('grownups');
}

// ------------------------------------------------------------
// HOMEWORK PHOTO — attach & guide (on-device, not stored)
// ------------------------------------------------------------
let HOMEWORK_URL = null;

function renderHomeworkHelper() {
  const body = $('#helperBody');
  body.innerHTML = `
    <p style="font-weight:800;font-size:17px;text-align:center">Snap or attach a photo of the homework sheet, then work it together with the Tutor.</p>
    <div class="answer-row" style="flex-wrap:wrap">
      <label class="btn sky big" style="cursor:pointer">
        ${icon('camera', 16)} Choose / take a photo
        <input type="file" id="hwPhoto" accept="image/*" capture="environment" style="display:none">
      </label>
      ${HOMEWORK_URL ? '<button class="btn ghost" id="hwClear">Remove photo</button>' : ''}
    </div>
    <div id="hwView">${HOMEWORK_URL
      ? `<img src="${HOMEWORK_URL}" alt="homework" style="max-width:100%;border:var(--outline);border-radius:16px;margin-top:14px;box-shadow:var(--shadow)">`
      : `<p class="note" style="text-align:center;margin-top:14px">The photo stays on this device — it is never uploaded anywhere.</p>`}</div>
    <div class="card" style="margin-top:16px;background:#FFFDF4">
      <h2 style="font-size:19px"><span class="bubble" style="background:var(--sky)">${icon('gradcap', 17)}</span>Work a problem with the Tutor</h2>
      <p class="note">Look at the sheet, then type a math problem from it — I'll walk you through it step by step (I won't just give the answer).</p>
      <div class="hw-setup">
        <input class="num-input" id="hwA" inputmode="numeric" placeholder="52">
        <select id="hwOp"><option value="+">+</option><option value="−">−</option></select>
        <input class="num-input" id="hwB" inputmode="numeric" placeholder="27">
        <button class="btn sky big" id="hwGo">Let's go!</button>
      </div>
      <div id="tutorBox"></div>
    </div>`;

  $('#hwPhoto').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (HOMEWORK_URL) URL.revokeObjectURL(HOMEWORK_URL);
    HOMEWORK_URL = URL.createObjectURL(file);
    renderHomeworkHelper();
  };
  const clr = $('#hwClear');
  if (clr) clr.onclick = () => { if (HOMEWORK_URL) URL.revokeObjectURL(HOMEWORK_URL); HOMEWORK_URL = null; renderHomeworkHelper(); };

  $('#hwGo').onclick = () => {
    let a = parseInt($('#hwA').value.replace(/[,\s]/g, ''), 10);
    let b = parseInt($('#hwB').value.replace(/[,\s]/g, ''), 10);
    const op = $('#hwOp').value;
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a > 999 || b > 999) {
      $('#tutorBox').innerHTML = `<div class="hw-step"><div class="n">!</div><div class="t">Please type two numbers from 0 to 999.</div></div>`;
      return;
    }
    if (op === '−' && b > a) [a, b] = [b, a];
    startTutor(a, b, op);
  };
}
