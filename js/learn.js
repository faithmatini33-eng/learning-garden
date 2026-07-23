/* ============================================================
   LEARNING GARDEN — learn.js · the Learn system (design v3, 10a–12d)
   Khan-Kids-style guided learning: ordered lesson paths per strand,
   fox-taught teaching steps + try-it checks, My Learning dashboard,
   and the four lesson moments (intro / resume / complete / path
   complete). Completing a lesson PLANTS its skill in Practice at
   sprouting (25) — a head start over normal seeds.

   Data (README v3):
   DB.learn[kid] = { paths: { strandId: { current: {lessonId, step} } },
                     learnedLessons: [{ lessonId, strand, subject, skill, date, stars }] }
   (completed list is derived from learnedLessons; lesson order is fixed
   by the strand's skill order, so we never store lessonIds.)
   ============================================================ */

function kidLearn(kidId = DB.activeKid) {
  DB.learn = DB.learn || {};
  DB.learn[kidId] = DB.learn[kidId] || { paths: {}, learnedLessons: [] };
  DB.learn[kidId].paths = DB.learn[kidId].paths || {};
  DB.learn[kidId].learnedLessons = DB.learn[kidId].learnedLessons || [];
  return DB.learn[kidId];
}

// ------------------------------------------------------------
// FLAGSHIP LESSONS — hand-authored, one per subject (10b–10g)
// keyed by the practice skill they teach & plant
// ------------------------------------------------------------
const LESSON_DEFS = {
  life_cycle: {
    name: 'Life cycles', term: 'life cycles',
    intro: { cards: [['🥚', 'how a butterfly begins'], ['🔄', 'the 4 stages, in order'], ['⭐', '2 try-its · 5 stars to earn']], minutes: 8 },
    steps: [
      { kind: 'teach', variant: 'diagram', stage: 0, say: 'Every butterfly starts as a tiny <b>egg</b> on a leaf!', term: 'egg' },
      { kind: 'teach', variant: 'diagram', stage: 1, say: 'The egg hatches into a <b>hungry caterpillar</b>. It eats and eats and grows!', term: 'hungry caterpillar' },
      { kind: 'tryit', q: 'What comes after the caterpillar?', cards: [['🥚', 'an egg'], ['CHRYSALIS', 'a chrysalis'], ['🦋', 'a butterfly']], answer: 'a chrysalis',
        explain: 'The caterpillar spins a <b>chrysalis</b> and rests inside while it changes.', reteachStage: 1 },
      { kind: 'teach', variant: 'diagram', stage: 2, say: 'Inside the <b>chrysalis</b>, the caterpillar changes its whole body. Shhh — it\'s busy!', term: 'chrysalis' },
      { kind: 'teach', variant: 'diagram', stage: 3, say: 'Out comes a beautiful <b>butterfly</b> — and it lays new eggs. The circle starts again!', term: 'butterfly' },
      { kind: 'tryit', q: 'Put your finger on where the circle STARTS. What is it?', cards: [['🦋', 'a butterfly'], ['🥚', 'an egg'], ['🐛', 'a caterpillar']], answer: 'an egg',
        explain: 'The <b>egg</b> is the very first stage — every life cycle loops back to it.', reteachStage: 0 },
    ],
  },
  add_2d_re: {
    name: 'Regrouping to add', term: 'one ten',
    intro: { cards: [['🔢', 'what ten ones make'], ['🧮', 'watch blocks snap together'], ['⭐', '2 try-its · 5 stars to earn']], minutes: 8 },
    steps: [
      { kind: 'teach', variant: 'blocks', mode: 'ones', say: 'These little squares are <b>ones</b>. Count them — when we pile up too many, they get hard to see!', term: 'ones' },
      { kind: 'teach', variant: 'blocks', mode: 'regroup', say: 'Ten ones make <b>one ten</b>! Watch them snap together.', term: 'one ten' },
      { kind: 'tryit', q: 'How many ones does it take to make a ten?', cards: [['5', 'five'], ['10', 'ten'], ['12', 'twelve']], answer: 'ten',
        explain: 'Exactly <b>ten ones</b> snap into one ten-rod — that\'s why it\'s called regrouping!', reteachStage: -1 },
      { kind: 'teach', variant: 'blocks', mode: 'result', say: 'So 17 + 5 gives us a brand-new ten — <b>2 tens and 2 ones</b>. That\'s 22!', term: '2 tens and 2 ones' },
      { kind: 'tryit', q: '9 + 4 — do we need to regroup?', cards: [['✔', 'yes, ten ones join up'], ['✖', 'no, keep them loose']], answer: 'yes, ten ones join up',
        explain: '9 + 4 = 13 — that\'s more than ten ones, so ten of them snap into a new ten!', reteachStage: -1 },
    ],
  },
  adj_id: {
    name: 'What adjectives do', term: 'describing word',
    intro: { cards: [['🐕', 'boring vs vivid sentences'], ['🟨', 'spot the describing words'], ['⭐', '2 try-its · 5 stars to earn']], minutes: 6 },
    steps: [
      { kind: 'teach', variant: 'sentence', mode: 'before', say: 'An adjective is a <b>describing word</b>. Watch what it does to the dog!', term: 'describing word' },
      { kind: 'teach', variant: 'sentence', mode: 'after', say: 'The <b>tiny</b>, <b>muddy</b> dog ran. Now you can really SEE him!', term: 'tiny' },
      { kind: 'tryit', q: 'Which word is the adjective? "The fluffy cat slept."', cards: [['🐈', 'fluffy'], ['💤', 'slept'], ['🐾', 'cat']], answer: 'fluffy',
        explain: '<b>Fluffy</b> tells us what KIND of cat — that\'s describing, so it\'s the adjective!', reteachStage: -1 },
      { kind: 'teach', variant: 'sentence', mode: 'senses', say: 'Adjectives can tell <b>size</b>, <b>color</b>, <b>feel</b>, or <b>how many</b> — three red sticky lollipops!', term: 'size' },
      { kind: 'tryit', q: 'Pick the adjective: "Maya found a shiny penny."', cards: [['✨', 'shiny'], ['🪙', 'penny'], ['🔎', 'found']], answer: 'shiny',
        explain: '<b>Shiny</b> describes the penny — adjectives paint the picture!', reteachStage: -1 },
    ],
  },
  sp_family_q: {
    name: 'La familia', term: '¡La familia!',
    intro: { cards: [['👋', 'meet the family in Spanish'], ['🔊', 'tap each person to hear them'], ['⭐', '2 try-its · 5 stars to earn']], minutes: 6 },
    steps: [
      { kind: 'teach', variant: 'vocab', say: '<b>¡La familia!</b> Tap each person to hear their name in Spanish.', term: '¡La familia!',
        words: [['👩', 'la mamá', 'mom'], ['👨', 'el papá', 'dad'], ['👧', 'la hermana', 'sister'], ['👦', 'el hermano', 'brother']] },
      { kind: 'tryit', q: '¿Dónde está la mamá? Tap her!', cards: [['👩', 'la mamá'], ['👨', 'el papá'], ['👦', 'el hermano']], answer: 'la mamá', say: 'la mamá', lang: 'es-ES',
        explain: '<b>La mamá</b> is the mom — ¡muy bien!', reteachStage: -1 },
      { kind: 'teach', variant: 'vocab', say: 'Two more! <b>El bebé</b> is the baby, and <b>la abuela</b> is the grandma.', term: 'El bebé',
        words: [['👶', 'el bebé', 'baby'], ['👵', 'la abuela', 'grandma'], ['👴', 'el abuelo', 'grandpa'], ['🐕', 'el perro', 'the dog']] },
      { kind: 'tryit', q: 'Which one means GRANDMA?', cards: [['👵', 'la abuela'], ['👶', 'el bebé'], ['👨', 'el papá']], answer: 'la abuela', say: 'la abuela', lang: 'es-ES',
        explain: '<b>La abuela</b> is grandma — she gives the best hugs!', reteachStage: -1 },
    ],
  },
  soc_needs: {
    name: 'Needs and wants', term: 'need',
    intro: { cards: [['🍎', 'what everyone must have'], ['🧸', 'what\'s just for fun'], ['⭐', '2 try-its · 5 stars to earn']], minutes: 6 },
    steps: [
      { kind: 'teach', variant: 'sort', say: 'A <b>need</b> keeps you safe and healthy. A <b>want</b> is just for fun!', term: 'need',
        items: [['💧', 'water', 'need'], ['🏠', 'a home', 'need'], ['🧸', 'a toy', 'want'], ['🍎', 'food', 'need'], ['🍦', 'ice cream', 'want']] },
      { kind: 'tryit', q: 'Which one is a NEED?', cards: [['🎮', 'a video game'], ['💧', 'clean water'], ['🍭', 'a lollipop']], answer: 'clean water',
        explain: 'Every body <b>needs</b> water to live — the rest are fun wants!', reteachStage: -1 },
      { kind: 'teach', variant: 'sort2', say: 'Tricky one: you NEED clothes… but ten superhero capes? That part is a <b>want</b>!', term: 'want' },
      { kind: 'tryit', q: 'School supplies you must have for class are…', cards: [['✏️', 'a need'], ['🪀', 'a want']], answer: 'a need',
        explain: 'Supplies for learning are a <b>need</b> — extra toys in the backpack are wants!', reteachStage: -1 },
    ],
  },
};

// ------------------------------------------------------------
// PATHS — every strand gets one: its skills in order become
// lessons (flagship where authored, auto-taught otherwise)
// ------------------------------------------------------------
function lessonsForStrand(strandId) {
  return SKILLS.filter(s => s.strand === strandId).map(sk => {
    const def = LESSON_DEFS[sk.id];
    return {
      id: 'ls_' + sk.id, skillId: sk.id, strand: strandId,
      name: def ? def.name : sk.name,
      def: def || null,
    };
  });
}
function learnPathState(strandId) {
  const L = kidLearn();
  const lessons = lessonsForStrand(strandId);
  const doneIds = new Set(L.learnedLessons.map(x => x.lessonId));
  const idx = lessons.findIndex(x => !doneIds.has(x.id));
  return { lessons, doneIds, currentIdx: idx === -1 ? lessons.length : idx };
}
function subjOfStrand(strandId) { return (STRANDS.find(x => x.id === strandId) || {}).subject || 'custom'; }

// auto-lesson step builder: strand lesson chunks + generated try-its
function autoSteps(lesson) {
  const strand = STRANDS.find(x => x.id === lesson.strand) || {};
  const sk = SKILL_MAP[lesson.skillId];
  const chunks = strand.lesson ? lessonChunks(strand.lesson) : [`<p><b>${esc(lesson.name)}</b> — let's figure it out together!</p>`];
  const steps = [];
  chunks.slice(0, 4).forEach((c, i) => {
    steps.push({ kind: 'teach', variant: 'generic', html: c, say: speakableText(c) });
    if (i % 2 === 1 || i === Math.min(chunks.length, 4) - 1) steps.push({ kind: 'tryit', generic: true });
  });
  // cap: exactly 2 try-its max for autos (README: every 2 teach steps → 1 try-it)
  let seen = 0;
  return steps.filter(s => s.kind === 'teach' || ++seen <= 2).map(s =>
    s.kind === 'tryit' && s.generic ? { ...s, gen: () => sk.gen(1) } : s);
}
function lessonChunks(html) {
  const box = document.createElement('div');
  box.innerHTML = html;
  const out = [];
  for (const el of Array.from(box.children)) {
    if (el.tagName === 'UL' || el.tagName === 'OL') {
      const style = el.getAttribute('style') || '';
      for (const li of Array.from(el.children)) out.push(`<${el.tagName.toLowerCase()} style="${style}">${li.outerHTML}</${el.tagName.toLowerCase()}>`);
    } else if (el.outerHTML.trim()) out.push(el.outerHTML);
  }
  return out.length ? out : [html];
}

// ============================================================
// 11a — THE LEARNING PATH
// ============================================================
function renderLearnPath(strandId) {
  const strand = STRANDS.find(x => x.id === strandId);
  if (!strand) return show('learn');
  const { lessons, doneIds, currentIdx } = learnPathState(strandId);
  const L = kidLearn();
  $('#tabbar').style.display = 'flex';
  setAppbar(`
    <button class="back" id="lpBack" aria-label="Back">${icon('left', 18)}</button>
    <span class="subj-ico" style="width:38px;height:38px;background:${subjUI(strand.subject).tint}">${strand.emoji}</span>
    <div class="hero-meta"><div class="hi" style="font-size:19px">${strand.name} — my path</div>
      <p class="note" style="margin-top:0">One lesson at a time. Finish one to open the next!</p></div>
    <span class="ab-spacer"></span>
    <span class="pill" style="background:var(--green-tint);border-color:var(--green-tint);color:var(--green)">${doneIds.size ? [...doneIds].filter(id => lessons.some(l => l.id === id)).length : 0} of ${lessons.length} learned</span>`);

  const dayName = (ds) => { try { return new Date(ds + 'T12:00').toLocaleDateString('en-US', { weekday: 'long' }); } catch (e) { return ds; } };
  const rows = lessons.map((ls, i) => {
    const side = i % 2 === 0 ? 'l' : 'r';
    if (doneIds.has(ls.id)) {
      const rec = L.learnedLessons.find(x => x.lessonId === ls.id);
      return `<div class="path-row ${side}"><div class="path-card done">
          <span class="p-check">${icon('check', 14)}</span>
          <span style="flex:1"><b>${i + 1} · ${esc(ls.name)}</b><small>learned ${rec ? dayName(rec.date) : ''}</small></span>
          <button class="btn small ghost review-chip" data-review="${ls.id}">Review</button>
        </div><span class="path-node done"></span></div>`;
    }
    if (i === currentIdx) {
      const cur = (L.paths[strandId] || {}).current;
      const stepInfo = cur && cur.lessonId === ls.id ? cur.step : 0;
      const total = (ls.def ? ls.def.steps.length : autoSteps(ls).length);
      const dots = Array.from({ length: total }, (_, d) =>
        `<span class="sdot ${d < stepInfo ? 'done' : d === stepInfo ? 'cur' : ''}"></span>`).join('');
      return `<div class="path-row ${side}"><div class="path-card now">
          <span class="p-fox">🦊</span>
          <span style="flex:1"><span class="eyebrow" style="color:var(--terra)">Learning now</span>
            <b class="p-name">${i + 1} · ${esc(ls.name)}</b>
            <span class="sdot-row">${dots}<small>step ${Math.min(stepInfo + 1, total)} of ${total}</small></span></span>
          <button class="btn primary caps-btn" data-start="${ls.id}">${stepInfo > 0 ? 'Continue' : 'Start'}</button>
        </div><span class="path-node now"></span></div>`;
    }
    const prevName = lessons[i - 1] ? lessons[i - 1].name : '';
    return `<div class="path-row ${side}"><div class="path-card locked">
        <span class="p-lock">${icon('lock', 15)}</span>
        <span><b>${i + 1} · ${esc(ls.name)}</b><small>${i === currentIdx + 1 && prevName ? `finish ${esc(prevName)} to open` : 'locked'}</small></span>
      </div><span class="path-node locked"></span></div>`;
  }).join('');

  app.innerHTML = `<div class="reveal path-wrap">
    <div class="path-spine"></div>
    ${rows}
    <div class="path-end"><span class="gift-node">🎁</span><b>Finish the path — this garden bed blooms!</b></div>
  </div>`;
  $('#lpBack').onclick = () => show('practice');
  $$('[data-start]').forEach(b => b.onclick = () => startLesson(b.dataset.start, strandId));
  $$('[data-review]').forEach(b => b.onclick = () => startLesson(b.dataset.review, strandId, { review: true }));
}

// ============================================================
// THE LESSON PLAYER (10b–10g + 12a/12b/12c)
// ============================================================
let LP = null;

function startLesson(lessonId, strandId, opts = {}) {
  const lessons = lessonsForStrand(strandId);
  const ls = lessons.find(x => x.id === lessonId);
  if (!ls) return show('learnpath', strandId);
  const steps = ls.def ? ls.def.steps.map(s => ({ ...s })) : autoSteps(ls);
  const L = kidLearn();
  const saved = (L.paths[strandId] || {}).current;
  const resumeStep = (!opts.review && saved && saved.lessonId === lessonId) ? saved.step : 0;
  LP = {
    ls, strandId, steps, review: !!opts.review,
    step: resumeStep, stars: Math.min(resumeStep, steps.length), tryRight: 0, tryTotal: 0,
    phase: resumeStep > 0 && !opts.review ? 'resume' : 'intro',
  };
  VIEW = 'session';
  $('#tabbar').style.display = 'none';
  lpPaint();
}

function lpSaveProgress() {
  if (LP.review) return;
  const L = kidLearn();
  L.paths[LP.strandId] = L.paths[LP.strandId] || {};
  L.paths[LP.strandId].current = { lessonId: LP.ls.id, step: LP.step };
  save();
}

function lpStones() {
  const stones = LP.steps.map((s, i) => {
    const state = i < LP.step ? 'done' : i === LP.step && LP.phase === 'step' ? 'cur' : 'future';
    if (s.kind === 'tryit') return `<span class="stone star ${state}">${icon('star', 13)}</span>`;
    return `<span class="stone ${state}">${state === 'done' ? icon('check', 13) : i + 1}</span>`;
  });
  const parts = [];
  stones.forEach((s, i) => { parts.push(s); parts.push(`<span class="stone-link ${i < LP.step ? 'done' : ''}"></span>`); });
  parts.push(`<span class="stone gift">🎁</span>`);
  return `<span class="stones">${parts.join('')}</span>`;
}

function lpBar(minimal) {
  const u = subjUI(subjOfStrand(LP.strandId));
  setAppbar(`
    <button class="back" id="lpClose" aria-label="Close">${icon('x', 17)}</button>
    <span class="subj-ico" style="width:34px;height:34px;background:${u.tint};color:${u.color}">${icon('bulb', 17)}</span>
    <div class="title">Learn · ${esc(LP.ls.name)}</div>
    ${minimal ? '' : lpStones()}
    <span class="ab-spacer"></span>
    ${minimal ? '' : `<span class="pill gold">${icon('star', 14)} +${LP.stars}</span>`}`);
  $('#lpClose').onclick = () => { lpSpeechStop(); lpSaveProgress(); show('learnpath', LP.strandId); };
}

function lpSpeechStop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }

// fox speech: auto-plays, "Playing…" ↔ "Again", optional Slower
function foxPanel(sayHTML, opts = {}) {
  return `<div class="fox-col">
    <span class="fox-face pop">🦊</span>
    <div class="fox-card">
      <p class="fox-say">${sayHTML}</p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn small sky" id="foxPlay">${icon('volume', 13)} <span id="foxPlayLbl">Playing…</span></button>
        <button class="btn small ghost" id="foxAgain">${opts.slower ? 'Slower' : 'Again'}</button>
      </div>
    </div>
  </div>`;
}
function foxSpeak(text, { lang = 'en-US', rate = 0.95 } = {}) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; const v = pickVoice(lang); if (v) u.voice = v;
  u.rate = rate;
  u.onstart = () => { const l = $('#foxPlayLbl'); if (l) l.textContent = 'Playing…'; };
  u.onend = () => { const l = $('#foxPlayLbl'); if (l) l.textContent = 'Play'; };
  speechSynthesis.speak(u);
}
function wireFox(text, opts = {}) {
  const play = $('#foxPlay');
  if (play) play.onclick = () => foxSpeak(text, opts);
  const again = $('#foxAgain');
  if (again) again.onclick = () => foxSpeak(text, { ...opts, rate: opts.slower ? 0.55 : (opts.rate || 0.95) });
  foxSpeak(text, opts);
}

function lpPaint() {
  const ph = LP.phase;
  if (ph === 'intro') return lpIntro();
  if (ph === 'resume') return lpResume();
  if (ph === 'complete') return lpComplete();
  if (ph === 'pathdone') return lpPathDone();
  lpBar();
  const step = LP.steps[LP.step];
  if (!step) { LP.phase = 'complete'; return lpPaint(); }
  if (step.kind === 'teach') lpTeach(step);
  else lpTryit(step);
}

// ---- 12a intro ----
function lpIntro() {
  lpBar(true);
  const { lessons, currentIdx } = learnPathState(LP.strandId);
  const strand = STRANDS.find(x => x.id === LP.strandId) || {};
  const n = lessons.findIndex(x => x.id === LP.ls.id) + 1;
  const def = LP.ls.def;
  const cards = def ? def.intro.cards : [[strand.emoji || '🌱', esc(strand.name || 'our garden')], ['⭐', `${LP.steps.filter(s => s.kind === 'tryit').length} try-its · ${LP.steps.length} stars to earn`], ['🌱', 'plants this skill in Practice']];
  const term = def ? def.term : LP.ls.name.toLowerCase();
  const u = subjUI(subjOfStrand(LP.strandId));
  const mins = def ? def.intro.minutes : Math.max(4, LP.steps.length * 2);
  app.innerHTML = `<div class="reveal lp-center">
    <span class="fox-face big pop">🦊</span>
    <p class="eyebrow" style="color:${u.color};margin-top:18px">Lesson ${n} · ${esc(strand.name)} path</p>
    <h1 class="lp-goal">Today you'll learn <span style="color:${u.color}">${esc(term)}</span>!</h1>
    <div class="goal-cards">${cards.map(([e, t]) => `<div class="goal-card"><span class="g-emoji">${e}</span><span>${t}</span></div>`).join('')}</div>
    <div style="display:flex;align-items:center;gap:14px;margin-top:22px">
      <button class="btn primary big caps-btn" id="lpGo">Let's go! ${icon('arrowright', 15)}</button>
      <span class="note">about ${mins} minutes</span>
    </div>
  </div>`;
  wireFox(`Today you'll learn ${term}!`);
  $('#lpGo').onclick = () => { lpSpeechStop(); LP.phase = 'step'; lpSaveProgress(); lpPaint(); };
}

// ---- 12b resume ----
function lpResume() {
  lpBar();
  const k = kid();
  const prev = LP.steps[LP.step - 1], cur = LP.steps[LP.step];
  const prevLabel = prev && prev.term ? prev.term : 'where we stopped';
  const u = subjUI(subjOfStrand(LP.strandId));
  app.innerHTML = `<div class="reveal lp-center">
    <span class="fox-face big pop">🦊</span>
    <h1 class="lp-goal" style="font-size:34px;margin-top:16px">Welcome back, ${esc(k.name)}!</h1>
    <p style="font-size:20px;font-weight:600;color:var(--soft);max-width:560px">Last time we learned about <span style="color:${u.color};font-weight:800">${esc(prevLabel)}</span>. Let's find out what happens next…</p>
    <div style="display:flex;gap:12px;margin-top:24px">
      <button class="btn primary big caps-btn" id="lpKeep">Keep going</button>
      <button class="btn big" id="lpOver">Start over</button>
    </div>
  </div>`;
  wireFox(`Welcome back, ${k.name}! Let's keep going.`);
  $('#lpKeep').onclick = () => { lpSpeechStop(); LP.phase = 'step'; lpPaint(); };
  $('#lpOver').onclick = () => { lpSpeechStop(); LP.step = 0; LP.stars = 0; LP.phase = 'step'; lpSaveProgress(); lpPaint(); };
}

// ---- teaching step (10b/10d/10e/10f/10g + generic) ----
function lpTeach(step) {
  const u = subjUI(subjOfStrand(LP.strandId));
  const sayText = speakableText(step.say || '');
  const visual = teachVisual(step, u);
  app.innerHTML = `<div class="reveal lesson-grid">
    ${foxPanel(step.say, { slower: step.variant === 'vocab' })}
    <div class="teach-panel">
      <p class="eyebrow" style="color:${u.color};text-align:center">${visual.eyebrow}</p>
      ${visual.html}
      <div style="text-align:center;margin-top:18px">
        <button class="btn primary big caps-btn" id="lpGotIt">${visual.cta || 'Got it!'} ${icon('arrowright', 15)}</button>
      </div>
    </div>
  </div>`;
  wireFox(sayText, { slower: step.variant === 'vocab' });
  visual.wire && visual.wire();
  $('#lpGotIt').onclick = () => {
    lpSpeechStop(); sfx('correct');
    LP.step++; LP.stars++;
    lpSaveProgress(); lpPaint();
  };
}

const LIFE_STAGES = [['🥚', 'egg'], ['🐛', 'caterpillar'], ['CHRYSALIS', 'chrysalis'], ['🦋', 'butterfly']];
function chrysalisSVG(size = 44) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <path d="M22 5 C29 9 33 17 33 25 C33 34 28 40 22 40 C16 40 11 34 11 25 C11 17 15 9 22 5 Z" fill="#C9E4D0" stroke="#7FB86F" stroke-width="2"/>
    <path d="M22 8 v29" stroke="#7FB86F" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}
function stagePic(s, size = 40) { return s === 'CHRYSALIS' ? chrysalisSVG(size) : `<span style="font-size:${size}px;line-height:1">${s}</span>`; }

function teachVisual(step, u) {
  // 10b — life-cycle diagram
  if (step.variant === 'diagram') {
    const cells = LIFE_STAGES.map(([pic, label], i) => {
      const cur = i === step.stage, past = i < step.stage;
      return `<div class="lc-stage ${cur ? 'cur' : past ? 'past' : 'future'}">
          ${cur ? '<span class="here-tag">WE ARE HERE</span>' : ''}
          <span class="lc-circle">${stagePic(pic, cur ? 54 : 34)}</span>
          <span class="lc-label">${label}</span>
        </div>${i < 3 ? `<span class="lc-arrow ${i < step.stage ? 'past' : ''}">${icon('arrowright', 18)}</span>` : ''}`;
    }).join('');
    return { eyebrow: "A butterfly's life cycle", html: `<div class="lc-row">${cells}</div>` };
  }
  // 10d — base-ten blocks
  if (step.variant === 'blocks') {
    const rod = (color, glow) => `<span class="bt-rod${glow ? ' glow' : ''}" style="background:${color}">${'<i></i>'.repeat(9)}</span>`;
    const one = (join) => `<span class="bt-one${join ? ' join' : ''}"></span>`;
    let html = '';
    if (step.mode === 'ones') html = `<div class="bt-scene"><div class="bt-group"><div class="bt-ones">${Array.from({ length: 7 }, () => one()).join('')}</div><span class="bt-cap">7 ones — easy to count</span></div></div>`;
    else if (step.mode === 'regroup') html = `<div class="bt-scene">
        <div class="bt-group">${rod('#D05C38')}<span class="bt-cap">1 ten</span></div>
        <div class="bt-group"><div class="bt-ones">${Array.from({ length: 7 }, () => one()).join('')}${Array.from({ length: 3 }, () => one(true)).join('')}</div><span class="bt-cap">7 ones <b style="color:#E8A63C">+ 3 joining</b></span></div>
        <span class="bt-arrow">${icon('arrowright', 22)}</span>
        <div class="bt-group"><div style="display:flex;gap:7px">${rod('#D05C38')}${rod('#4E9B6B', true)}</div><span class="bt-cap"><b>2 tens — a new ten!</b></span></div>
      </div>`;
    else html = `<div class="bt-scene">
        <div class="bt-group"><div style="display:flex;gap:7px">${rod('#D05C38')}${rod('#4E9B6B', true)}</div><span class="bt-cap">2 tens</span></div>
        <div class="bt-group"><div class="bt-ones">${Array.from({ length: 2 }, () => one()).join('')}</div><span class="bt-cap">2 ones</span></div>
        <span class="bt-arrow">${icon('equal', 20)}</span>
        <div class="bt-group"><span style="font-family:var(--font-head);font-weight:800;font-size:44px;color:var(--terra)">22</span><span class="bt-cap">seventeen plus five</span></div>
      </div>`;
    return { eyebrow: '17 + 5 — regroup the ones', html };
  }
  // 10e — before/after sentence
  if (step.variant === 'sentence') {
    if (step.mode === 'before') return { eyebrow: 'Adjectives paint a picture', html: `
      <div class="sent-plain"><span style="font-size:30px">🐕</span><span>The dog ran.</span></div>
      <div style="text-align:center;color:var(--teal);margin:8px 0">${icon('arrowright', 18, '')}</div>
      <div class="sent-plain" style="opacity:.45"><span style="font-size:30px">🐕</span><span>The ??? dog ran.</span></div>
      <p class="sent-note">Hmm — what KIND of dog? We can't see him yet…</p>` };
    if (step.mode === 'after') return { eyebrow: 'Adjectives paint a picture', html: `
      <div class="sent-plain"><span style="font-size:30px">🐕</span><span>The dog ran.</span></div>
      <div style="text-align:center;color:var(--teal);margin:8px 0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg></div>
      <div class="sent-vivid"><span style="font-size:38px">🐕</span><span>The <span class="adj-chip">tiny</span>, <span class="adj-chip">muddy</span> dog ran.</span></div>
      <p class="sent-note">The yellow words tell us <b>what kind</b> of dog — now you can really see him!</p>` };
    return { eyebrow: 'Adjectives can tell…', html: `
      <div class="sent-vivid" style="border-color:var(--border)"><span style="font-size:34px">🍭</span><span><span class="adj-chip">three</span> <span class="adj-chip">red</span> <span class="adj-chip">sticky</span> lollipops</span></div>
      <p class="sent-note"><b>How many</b> · <b>what color</b> · <b>how it feels</b> — adjectives do all of it!</p>` };
  }
  // 10f — tap-and-listen vocab
  if (step.variant === 'vocab') {
    const cards = step.words.map(([e, es, en], i) => `
      <button class="vocab-card" data-say="${escAttr(es)}" data-vi="${i}">
        <span class="v-badge">${icon('volume', 13)}</span>
        <span class="v-emoji">${e}</span><span class="v-es">${esc(es)}</span><span class="v-en">${esc(en)}</span>
      </button>`).join('');
    return {
      eyebrow: 'Toca y escucha · tap and listen', cta: 'I heard them all!',
      html: `<div class="vocab-grid">${cards}</div>`,
      wire: () => $$('.vocab-card').forEach(b => b.onclick = () => {
        if (!('speechSynthesis' in window)) return;
        $$('.vocab-card').forEach(x => x.classList.remove('playing'));
        b.classList.add('playing');
        speechSynthesis.cancel();
        const u2 = new SpeechSynthesisUtterance(b.dataset.say);
        u2.lang = 'es-ES'; const v = pickVoice('es-ES'); if (v) u2.voice = v;
        u2.rate = 0.75;
        // keep the gold ring visible at least briefly even if the voice is instant
        u2.onend = () => setTimeout(() => b.classList.remove('playing'), 600);
        speechSynthesis.speak(u2);
      }),
    };
  }
  // 10g — drag (or tap) to sort
  if (step.variant === 'sort') {
    const items = step.items;
    const html = `
      <div class="sort-cards" id="sortCards">${items.map(([e, label], i) =>
        `<button class="sort-card" data-si="${i}"><span style="font-size:22px">${e}</span> ${esc(label)}</button>`).join('')}</div>
      <div class="baskets">
        <div class="basket needs" data-b="need"><b>Needs</b><small>to live and be safe</small><div class="b-slot-row" id="bNeed"></div></div>
        <div class="basket wants" data-b="want"><b>Wants</b><small>fun to have</small><div class="b-slot-row" id="bWant"></div></div>
      </div>
      <p class="sent-note" id="sortCap">Tap a card, then tap its basket — the fox cheers each drop!</p>`;
    return {
      eyebrow: 'Sort each card into its basket', cta: 'All sorted!',
      html,
      wire: () => {
        let picked = null, sorted = 0;
        const cap = () => { $('#sortCap').textContent = `${sorted} of ${items.length} sorted — the fox cheers each drop!`; };
        $$('.sort-card').forEach(b => b.onclick = () => {
          $$('.sort-card').forEach(x => x.classList.remove('picked'));
          picked = b; b.classList.add('picked');
        });
        $$('.basket').forEach(bk => bk.onclick = () => {
          if (!picked) return;
          const i = +picked.dataset.si;
          if (items[i][2] === bk.dataset.b) {
            sfx('correct');
            $(bk.dataset.b === 'need' ? '#bNeed' : '#bWant').insertAdjacentHTML('beforeend',
              `<span class="b-item pop">${items[i][0]}</span>`);
            picked.remove(); picked = null; sorted++; cap();
          } else {
            sfx('wrong');
            picked.classList.add('no');
            $('#sortCap').textContent = `Hmm — think: can you live safely without it? Try the other basket!`;
            setTimeout(() => picked && picked.classList.remove('no'), 400);
          }
        });
      },
    };
  }
  if (step.variant === 'sort2') return { eyebrow: 'Need… or extra?', html: `
    <div class="sent-vivid" style="border-color:var(--purple);background:var(--purple-tint)"><span style="font-size:34px">🧥</span><span>ONE warm coat = a <b style="color:var(--purple)">need</b></span></div>
    <div class="sent-vivid" style="border-color:var(--gold);background:var(--gold-tint);margin-top:10px"><span style="font-size:34px">🦸</span><span>TEN superhero capes = a <b style="color:var(--gold)">want</b></span></div>` };
  // generic — auto lessons reuse the strand's own words
  return { eyebrow: 'Listen along with the fox', html: `<div class="ls-chunk cur" style="font-size:15px">${step.html}</div>` };
}

// ---- try-it step (10c) ----
function lpTryit(step) {
  const u = subjUI(subjOfStrand(LP.strandId));
  LP.tryTotal++;
  let firstMiss = false;
  const isGeneric = !!step.gen;
  const q = isGeneric ? step.gen() : null;

  const cardsHTML = isGeneric ? genericTryitHTML(q) : `
    <div class="tryit-cards">${step.cards.map(([pic, label]) =>
      `<button class="tryit-card" data-c="${escAttr(label)}">
         <span class="t-pic">${stagePic(pic, 46)}</span><span class="t-label">${esc(label)}</span>
       </button>`).join('')}</div>`;
  const qText = isGeneric ? q.prompt : step.q;

  app.innerHTML = `<div class="reveal">
    <div class="tryit-panel">
      <p class="eyebrow" style="color:var(--gold);text-align:center">Your turn · no rush</p>
      <h2 class="tryit-q">${qText} <button class="icon-btn" id="tryRead" style="width:36px;height:36px;background:var(--teal-tint);color:var(--teal)">${icon('volume', 15)}</button></h2>
      ${isGeneric && q.body ? `<div class="qbody">${q.body}</div>` : ''}
      ${cardsHTML}
    </div>
    <div id="tryFb"></div>
  </div>`;
  const sayQ = () => speak(speakableText(qText), 'en');
  $('#tryRead').onclick = sayQ;
  sayQ();
  if (step.say && 'speechSynthesis' in window) setTimeout(() => {
    const u2 = new SpeechSynthesisUtterance(step.say);
    u2.lang = 'es-ES'; const v = pickVoice('es-ES'); if (v) u2.voice = v; u2.rate = 0.7;
    speechSynthesis.speak(u2);
  }, 900);

  const resolve = (btn, correctLabel, explain) => {
    sfx('correct');
    LP.tryRight += firstMiss ? 0 : 1;
    if (btn) btn.classList.add('right-pick');
    $$('.tryit-card, .choice').forEach(b => b.disabled = true);
    $('#tryFb').innerHTML = `<div class="try-strip pop">
        <span class="fox-face" style="font-size:26px;width:auto;height:auto">🦊</span>
        <span class="fb-text"><b>${firstMiss ? 'You found it!' : 'Yes!'}</b> ${explain}</span>
        <button class="btn primary caps-btn" id="tryGo" style="flex:none">Keep going ${icon('arrowright', 14)}</button>
      </div>`;
    upgradeSayButtons($('#tryFb'));
    $('#tryGo').onclick = () => {
      lpSpeechStop(); sfx('star');
      LP.step++; LP.stars++;
      lpSaveProgress(); lpPaint();
    };
  };
  const missed = (btn) => {
    sfx('wrong');
    firstMiss = true;
    if (btn) { btn.classList.add('no'); btn.disabled = true; }
    // the fox re-teaches — never a buzzer (10c)
    const re = !isGeneric && step.reteachStage >= 0
      ? `<div class="lc-row" style="margin-top:10px;transform:scale(.82);transform-origin:center">${LIFE_STAGES.map(([pic, label], i) =>
          `<div class="lc-stage ${i === step.reteachStage ? 'cur' : 'future'}" style="margin:0 2px">${i === step.reteachStage ? '<span class="here-tag">WE WERE HERE</span>' : ''}<span class="lc-circle">${stagePic(pic, i === step.reteachStage ? 40 : 26)}</span><span class="lc-label">${label}</span></div>`).join('')}</div>`
      : '';
    $('#tryFb').innerHTML = `<div class="try-strip hint pop">
        <span class="fox-face" style="font-size:26px;width:auto;height:auto">🦊</span>
        <span class="fb-text"><b>Let's look together.</b> ${isGeneric ? 'Read it one more time — you\'ve got this!' : 'Where were we on the circle? Try again!'}</span>
      </div>${re}`;
  };

  if (isGeneric) wireGenericTryit(q, resolve, missed);
  else $$('.tryit-card').forEach(b => b.onclick = () => {
    if (b.dataset.c === step.answer) resolve(b, step.answer, step.explain);
    else missed(b);
  });
}

// generic try-it: renders any generator question type inside the lesson
function genericTryitHTML(q) {
  if (q.type === 'mc' || q.type === 'picture') {
    const opts = q.type === 'picture' ? q.cards.map(c => c.label) : q.choices;
    return `<div class="tryit-cards">${opts.map(c =>
      `<button class="tryit-card sm" data-c="${escAttr(String(c))}"><span class="t-label">${esc(String(c))}</span></button>`).join('')}</div>`;
  }
  return `<div class="answer-row" style="justify-content:center">
    <input class="num-input" id="tryIn" ${q.type === 'num' ? 'inputmode="numeric"' : ''} autocomplete="off" autocapitalize="none">
    <button class="btn primary big" id="tryCheck">Check</button></div>`;
}
function wireGenericTryit(q, resolve, missed) {
  const ok = (given) => q.type === 'num' || q.type === 'line'
    ? Number(String(given).replace(/[,\s]/g, '')) === Number(q.answer)
    : q.exact ? String(given).trim() === String(q.answer).trim()
      : String(given).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  if ($$('.tryit-card').length) {
    $$('.tryit-card').forEach(b => b.onclick = () => {
      if (String(b.dataset.c) === String(q.answer)) resolve(b, q.answer, q.explain || 'That\'s the one!');
      else missed(b);
    });
  } else {
    let tries = 0;
    const check = () => {
      const v = $('#tryIn').value;
      if (v.trim() === '') return;
      if (ok(v)) { resolve(null, q.answer, q.explain || `${q.answer} is right!`); }
      else { tries++; if (tries >= 2) { $('#tryIn').value = ''; $('#tryIn').placeholder = String(q.answer); } missed(null); $('#tryIn').select(); }
    };
    $('#tryCheck').onclick = check;
    $('#tryIn').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    $('#tryIn').focus();
  }
}

// ---- 12c lesson complete ----
function lpComplete() {
  lpSpeechStop();
  const L = kidLearn();
  const wasReview = LP.review;
  const skill = SKILL_MAP[LP.ls.skillId];
  if (!wasReview && !L.learnedLessons.some(x => x.lessonId === LP.ls.id)) {
    L.learnedLessons.push({ lessonId: LP.ls.id, strand: LP.strandId, subject: subjOfStrand(LP.strandId), skill: LP.ls.skillId, date: dstr(), stars: LP.stars });
    // THE handoff: plant the skill in Practice at sprouting — a head start
    const st = kidStats();
    const cur = st[LP.ls.skillId] || { s: 0, a: 0, c: 0 };
    if (cur.s < 25) { cur.s = 25; st[LP.ls.skillId] = cur; }
    delete (L.paths[LP.strandId] || {}).current;
    save();
  }
  const { lessons, currentIdx } = learnPathState(LP.strandId);
  if (currentIdx >= lessons.length) { LP.phase = 'pathdone'; return lpPaint(); }
  const next = lessons[currentIdx];
  sfx('cheer'); burst(80, true);
  lpBar(true);
  app.innerHTML = `<div class="reveal lp-center">
    <div class="complete-card pop">
      <span class="gift-big">🎁</span>
      <h1 style="font-size:34px;font-weight:800;margin-top:10px">You learned ${esc(LP.ls.def ? LP.ls.def.term : LP.ls.name.toLowerCase())}!</h1>
      <div style="display:flex;gap:10px;justify-content:center;margin:14px 0">
        <span class="pill gold">${icon('star', 14)} ${LP.stars} stars earned</span>
        <span class="pill" style="color:var(--green)">${icon('check', 14)} ${LP.tryRight} of ${LP.tryTotal} try-its right</span>
      </div>
      <div class="plant-band">
        ${plantSVG(25, 34)}
        <span><b>${esc(skill ? skill.name : LP.ls.name)} is planted in Practice — with a head start!</b>
        <p class="note">It starts at sprouting. Practice it this week to make it bloom.</p></span>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap">
        <button class="btn primary big caps-btn" id="lpNext">Next lesson: ${esc(next.name)}</button>
        <button class="btn big" id="lpPath">Back to my path</button>
      </div>
    </div>
    <div class="mascot" style="position:fixed;left:22px;bottom:22px"><span class="fox">🦊</span><span class="say">You're a ${esc((LP.ls.def ? LP.ls.def.term : LP.ls.name).replace(/!$/, ''))} expert now!</span></div>
  </div>`;
  $('#lpNext').onclick = () => startLesson(next.id, LP.strandId);
  $('#lpPath').onclick = () => show('learnpath', LP.strandId);
}

// ---- 12d path complete ----
function lpPathDone() {
  const strand = STRANDS.find(x => x.id === LP.strandId) || {};
  sfx('cheer'); burst(120, true);
  lpBar(true);
  const flowers = [0, 1, 2, 3, 4].map(i =>
    `<span class="bloom-flower" style="animation-delay:${i * .35}s">${plantSVG(100, 64, i)}</span>`).join('');
  app.innerHTML = `<div class="path-done-scene">
    <div class="pd-sky">
      <span class="pd-sun"></span>
      <p class="eyebrow" style="color:var(--green)">Path complete!</p>
      <h1 style="font-size:42px;font-weight:800">Your ${esc(strand.name)} bed is in bloom!</h1>
      <p style="font-weight:600;color:var(--soft)">All ${lessonsForStrand(LP.strandId).length} lessons learned. The whole bed just flowered in your garden.</p>
    </div>
    <div class="pd-grass">
      <div class="pd-flowers">${flowers}</div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:26px;flex-wrap:wrap">
        <button class="btn primary big caps-btn" id="pdCert">${icon('printer', 15)} Print my certificate</button>
        <button class="btn big" id="pdGarden" style="background:#fff">Visit my garden</button>
        <button class="btn big" id="pdNew" style="background:#fff">Pick a new path</button>
      </div>
    </div>
    <div class="mascot" style="position:fixed;left:22px;bottom:22px"><span class="fox">🦊</span><span class="say">The whole bed bloomed — because of YOU!</span></div>
    <div class="print-only cert-page">
      <h1>Certificate of Growing</h1>
      <p class="c-name">${esc(kid().name)}</p>
      <p>learned every lesson on the <b>${esc(strand.name)}</b> path</p>
      <div>${[0, 1, 2, 3, 4].map(i => plantSVG(100, 54, i)).join('')}</div>
      <p class="note">Learning Garden · ${dstr()}</p>
    </div>
  </div>`;
  $('#pdCert').onclick = () => window.print();
  $('#pdGarden').onclick = () => show('garden');
  $('#pdNew').onclick = () => show('learn');
}

// ============================================================
// 11b — MY LEARNING dashboard (the Learn tab)
// ============================================================
function renderMyLearning() {
  const L = kidLearn();
  const mon = mondayOf();
  const weekCount = L.learnedLessons.filter(x => x.date >= dstr(mon)).length;
  setAppbar(`
    <div class="hero-meta"><div class="hi">My Learning</div>
      <p class="note" style="margin-top:0">What you're learning, what you've learned, and what's coming</p></div>
    <span class="ab-spacer"></span>
    <span class="pill" style="background:var(--green-tint);border-color:var(--green-tint);color:var(--green)">${icon('bulb', 14)} ${weekCount} lesson${weekCount === 1 ? '' : 's'} learned this week</span>`);

  // learning now = any path with a saved resume point; else next lesson on the most recently touched path
  let now = null;
  for (const [strandId, p] of Object.entries(L.paths)) {
    if (p.current) { now = { strandId, ...p.current }; break; }
  }
  const stageName = (s) => s >= 100 ? 'mastered!' : s >= 75 ? 'blooming' : s >= 50 ? 'growing' : s >= 25 ? 'sprouting' : 'new';
  const stageColor = (s) => s >= 100 ? 'var(--gold)' : s >= 75 ? '#F58BA4' : s >= 25 ? 'var(--green)' : 'var(--muted)';

  let nowCard = '';
  if (now) {
    const lessons = lessonsForStrand(now.strandId);
    const ls = lessons.find(x => x.id === now.lessonId);
    const strand = STRANDS.find(x => x.id === now.strandId) || {};
    if (ls) {
      const total = ls.def ? ls.def.steps.length : autoSteps(ls).length;
      const n = lessons.findIndex(x => x.id === ls.id) + 1;
      const dots = Array.from({ length: total }, (_, d) => `<span class="sdot ${d < now.step ? 'done' : d === now.step ? 'cur' : ''}"></span>`).join('');
      nowCard = `<div class="learn-hero">
        <span class="fox-face" style="font-size:52px">🦊</span>
        <span style="flex:1;min-width:0">
          <span class="eyebrow" style="color:var(--terra)">Learning now</span>
          <b style="display:block;font-size:24px;font-family:var(--font-head)">${esc(ls.name)}</b>
          <p class="note">${esc(SUBJECTS.find(s => s.id === strand.subject)?.name || '')} · ${esc(strand.name)} path · lesson ${n} of ${lessons.length}</p>
          <span class="sdot-row">${dots}<small>step ${now.step + 1} of ${total} · about ${Math.max(1, (total - now.step) * 2)} min left</small></span>
        </span>
        <button class="btn primary big caps-btn" id="mlResume">Resume</button>
      </div>`;
    }
  }
  if (!nowCard) nowCard = `<div class="learn-hero" style="border-color:var(--border)">
      <span class="fox-face" style="font-size:52px">🦊</span>
      <span style="flex:1"><span class="eyebrow" style="color:var(--terra)">Ready to learn</span>
        <b style="display:block;font-size:22px;font-family:var(--font-head)">Pick a path and I'll teach you!</b>
        <p class="note">Every garden bed has a Learn path — lessons open one at a time.</p></span>
      <button class="btn primary big caps-btn" id="mlPick">Pick a path</button>
    </div>`;

  // coming up: next lesson on each started-or-focus path (up to 3), tagged w/ plan day when its skill is planned
  const wk = weekKey();
  const focus = (DB.focus[DB.activeKid] && DB.focus[DB.activeKid].week === wk) ? DB.focus[DB.activeKid].skills : [];
  const plan = getWeekPlan();
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const planDay = (skillId) => { const d = plan.findIndex(day => day.includes(skillId)); return d >= 0 ? DAYS[d] : null; };
  const touched = new Set(Object.keys(L.paths).concat(L.learnedLessons.map(x => x.strand)));
  focus.forEach(sid => { const sk = SKILL_MAP[sid]; if (sk) touched.add(sk.strand); });
  const coming = [];
  for (const strandId of touched) {
    const { lessons, currentIdx } = learnPathState(strandId);
    if (currentIdx >= lessons.length) continue;
    const ls = lessons[currentIdx];
    if (now && ls.id === now.lessonId) { if (lessons[currentIdx + 1]) coming.push({ ls: lessons[currentIdx + 1], strandId }); continue; }
    coming.push({ ls, strandId });
  }
  const comingRows = coming.slice(0, 3).map(({ ls, strandId }) => {
    const strand = STRANDS.find(x => x.id === strandId) || {};
    const isFocus = focus.includes(ls.skillId);
    const day = planDay(ls.skillId);
    return `<div class="kid-admin-row" style="border-bottom-style:dotted">
      <span class="subj-ico" style="width:36px;height:36px;background:${subjUI(strand.subject).tint}">${strand.emoji}</span>
      <span class="nm" style="font-size:14.5px">${esc(ls.name)}<br><span style="color:var(--ink-soft);font-size:12.5px;font-weight:600">next on the ${esc(strand.name)} path${isFocus ? ` · <span style="color:var(--terra)">${icon('target', 11)} school focus</span>` : ''}</span></span>
      ${day ? `<span class="pill ghost-pill" style="flex:none">${day}</span>` : `<button class="btn small ghost" style="flex:none" data-gopath="${strandId}">Open path</button>`}
    </div>`;
  }).join('') || '<p class="note">Start a path and your next lessons line up here.</p>';

  // already learned
  const learnedRows = L.learnedLessons.slice().reverse().slice(0, 8).map(rec => {
    const sk = SKILL_MAP[rec.skill];
    const s = sk ? (kidStats()[sk.id] || { s: 0 }).s : 0;
    const strand = STRANDS.find(x => x.id === rec.strand) || {};
    const dayLabel = rec.date === dstr() ? 'today' : new Date(rec.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'long' });
    const lessons = lessonsForStrand(rec.strand);
    const lsName = (lessons.find(x => x.id === rec.lessonId) || {}).name || rec.lessonId;
    return `<div class="kid-admin-row" style="border-bottom-style:dotted">
      <span style="display:inline-flex;width:26px;justify-content:center">${plantSVG(s, 24)}</span>
      <span class="nm" style="font-size:14.5px">${esc(lsName)}<br><span style="color:var(--ink-soft);font-size:12.5px;font-weight:600">${esc(SUBJECTS.find(x => x.id === rec.subject)?.name || rec.subject)} · ${dayLabel} · <span style="color:${stageColor(s)}">${stageName(s)}${s < 100 ? ' in Practice' : ''}</span></span></span>
      <button class="btn small ghost" style="flex:none" data-relearn="${rec.lessonId}" data-strand="${rec.strand}">Review</button>
    </div>`;
  }).join('') || '<p class="note">Lessons you finish land here — with their growing stage in Practice.</p>';

  app.innerHTML = `<div class="reveal">
    <div class="learn-grid">
      <div>
        ${nowCard}
        <div class="card">
          <h2><span class="bubble" style="background:var(--gold-tint);color:var(--gold)">${icon('calendar', 16)}</span>Coming up</h2>
          ${comingRows}
          <div class="foot-note teal">${icon('bulb', 13)} The plan follows your paths and the ${icon('target', 12)} skills a grown-up picked for school.</div>
        </div>
      </div>
      <div class="card">
        <h2><span class="bubble" style="background:var(--green-tint);color:var(--green)">${icon('check', 16)}</span>Already learned
          <span class="note" style="margin-left:auto;font-weight:700">${L.learnedLessons.length} lesson${L.learnedLessons.length === 1 ? '' : 's'}</span></h2>
        ${learnedRows}
        <div class="foot-note gold">${icon('flame', 13)} Learned lessons keep growing through Practice — that's how they reach mastered.</div>
      </div>
    </div>
  </div>`;
  const mr = $('#mlResume'); if (mr && now) mr.onclick = () => startLesson(now.lessonId, now.strandId);
  const mp = $('#mlPick'); if (mp) mp.onclick = () => show('practice');
  $$('[data-gopath]').forEach(b => b.onclick = () => show('learnpath', b.dataset.gopath));
  $$('[data-relearn]').forEach(b => b.onclick = () => startLesson(b.dataset.relearn, b.dataset.strand, { review: true }));
}
