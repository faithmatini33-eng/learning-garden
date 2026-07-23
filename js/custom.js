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
    : { id: 't' + Date.now(), name: '', subject: 'custom', kind: 'flash', items: [{ q: '', a: '', wrongs: ['', '', ''] }] };

  const subjOpts = SUBJECTS.map(s =>
    `<option value="${s.id}" ${LESSON_DRAFT.subject === s.id ? 'selected' : ''}>${s.emoji} ${s.name}</option>`).join('');

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--berry)">📌</span>${editing ? 'Edit' : 'Create'} a lesson</h2>
      <p class="note">Make your own practice — this week's spelling words, vocabulary, sight words, or any quiz. It becomes a skill your kids practice, with its own garden score.</p>
      <div class="field-row" style="flex-direction:column;align-items:stretch;gap:10px">
        <input class="text-input" id="lesName" maxlength="40" placeholder="Lesson name (e.g. Week 12 spelling words)" value="${escAttr(LESSON_DRAFT.name)}">
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <label style="font-weight:800;font-size:14px">Subject:
            <select id="lesSubj" style="font-weight:700;padding:6px 10px;border:var(--outline);border-radius:10px;margin-left:6px">${subjOpts}</select>
          </label>
          <label style="font-weight:800;font-size:14px">Type:
            <select id="lesKind" style="font-weight:700;padding:6px 10px;border:var(--outline);border-radius:10px;margin-left:6px">
              <option value="flash" ${LESSON_DRAFT.kind === 'flash' ? 'selected' : ''}>Flashcards (question → answer)</option>
              <option value="mc" ${LESSON_DRAFT.kind === 'mc' ? 'selected' : ''}>Multiple choice</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <div class="card" id="itemsCard"></div>
    <div class="answer-row" style="flex-wrap:wrap">
      <button class="btn primary" id="saveLesson">Save lesson 🌱</button>
      <button class="btn ghost" id="cancelLesson">Cancel</button>
    </div>
  </div>`;

  const renderItems = () => {
    const isMc = LESSON_DRAFT.kind === 'mc';
    const rows = LESSON_DRAFT.items.map((it, i) => `
      <div class="lesson-item" style="border:var(--outline);border-radius:14px;padding:12px;margin-bottom:10px;background:#FFFDF4">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b style="font-family:var(--font-display)">Card ${i + 1}</b>
          ${LESSON_DRAFT.items.length > 1 ? `<button class="btn small ghost" data-del-item="${i}">✕ remove</button>` : ''}
        </div>
        <input class="text-input les-q" data-i="${i}" style="width:100%;margin-bottom:6px" placeholder="Question / word / prompt" value="${escAttr(it.q)}">
        <input class="text-input les-a" data-i="${i}" style="width:100%${isMc ? ';margin-bottom:6px' : ''}" placeholder="Correct answer" value="${escAttr(it.a)}">
        ${isMc ? `<div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[0, 1, 2].map(w => `<input class="text-input les-w" data-i="${i}" data-w="${w}" style="flex:1;min-width:120px" placeholder="Wrong choice ${w + 1}" value="${escAttr((it.wrongs || [])[w] || '')}">`).join('')}
        </div>` : ''}
      </div>`).join('');
    $('#itemsCard').innerHTML = `<h2><span class="bubble" style="background:var(--sun)">✏️</span>Cards</h2>
      ${isMc ? '<p class="note">Give the correct answer plus a few wrong choices for each question.</p>'
             : '<p class="note">Type a question and its answer. With 4+ cards, kids pick from choices; with fewer, they type the answer.</p>'}
      ${rows}
      <button class="btn sunny small" id="addItem">➕ Add another card</button>`;

    // wire inputs → draft
    $$('.les-q').forEach(el => el.oninput = () => { LESSON_DRAFT.items[+el.dataset.i].q = el.value; });
    $$('.les-a').forEach(el => el.oninput = () => { LESSON_DRAFT.items[+el.dataset.i].a = el.value; });
    $$('.les-w').forEach(el => el.oninput = () => {
      const it = LESSON_DRAFT.items[+el.dataset.i];
      it.wrongs = it.wrongs || ['', '', ''];
      it.wrongs[+el.dataset.w] = el.value;
    });
    $('#addItem').onclick = () => { LESSON_DRAFT.items.push({ q: '', a: '', wrongs: ['', '', ''] }); renderItems(); };
    $$('[data-del-item]').forEach(b => b.onclick = () => { LESSON_DRAFT.items.splice(+b.dataset.delItem, 1); renderItems(); });
  };
  renderItems();

  $('#lesName').oninput = e => { LESSON_DRAFT.name = e.target.value; };
  $('#lesSubj').onchange = e => { LESSON_DRAFT.subject = e.target.value; };
  $('#lesKind').onchange = e => { LESSON_DRAFT.kind = e.target.value; renderItems(); };
  $('#cancelLesson').onclick = () => show('grownups');
  $('#saveLesson').onclick = () => {
    const d = LESSON_DRAFT;
    d.name = d.name.trim();
    d.items = d.items
      .map(it => ({ q: it.q.trim(), a: it.a.trim(), wrongs: (it.wrongs || []).map(w => w.trim()).filter(Boolean), why: it.why }))
      .filter(it => it.q && it.a);
    if (!d.name) { alert('Please give your lesson a name.'); return; }
    if (d.items.length < 1) { alert('Add at least one card with a question and answer.'); return; }
    if (d.kind === 'mc' && d.items.some(it => it.wrongs.length < 1)) {
      alert('Each multiple-choice card needs at least one wrong choice.'); return;
    }
    DB.custom = DB.custom || [];
    const idx = DB.custom.findIndex(c => c.id === d.id);
    if (idx >= 0) DB.custom[idx] = d; else DB.custom.push(d);
    save();
    loadCustomSkills();
    show('grownups');
  };
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
