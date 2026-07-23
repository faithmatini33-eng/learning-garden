/* ============================================================
   MATH GARDEN — app: profiles, practice engine, weekly plan,
   progress tracking, homework helper. All data stays on this
   computer (localStorage). No accounts, no internet needed.
   ============================================================ */

// ---------------- storage ----------------
const DB_KEY = 'mathgarden.v1';

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fresh start */ }
  return { kids: [], activeKid: null, stats: {}, log: {}, plans: {} };
}
let DB = loadDB();
DB.focus = DB.focus || {};
DB.diag = DB.diag || {};
DB.custom = DB.custom || [];
DB.settings = DB.settings || {};
DB.sprint = DB.sprint || {};
const save = () => localStorage.setItem(DB_KEY, JSON.stringify(DB));

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const app = $('#app');

// rebuilt whenever the skill catalog changes (e.g. custom lessons added)
let SKILL_MAP = Object.fromEntries(SKILLS.map(s => [s.id, s]));
function rebuildSkillMap() { SKILL_MAP = Object.fromEntries(SKILLS.map(s => [s.id, s])); }

// per-kid settings with sensible defaults
function kidSettings(id = DB.activeKid) {
  const s = DB.settings[id] = DB.settings[id] || {};
  if (s.schoolGoal == null) s.schoolGoal = 3;   // skills per school day
  return s;
}

// ---------------- audio (built-in voices, free & offline) ----------------
// Two reader choices (girl/boy voice) from the voices already on this
// computer — no accounts or paid services needed.
const VOICE_NAMES = {
  female: { en: ['samantha', 'ava', 'allison', 'victoria', 'karen', 'susan', 'zoe', 'moira', 'tessa', 'female'], es: ['mónica', 'monica', 'paulina', 'angélica', 'angelica', 'isabela', 'female'] },
  male: { en: ['alex', 'daniel', 'tom', 'aaron', 'fred', 'oliver', 'nathan', 'male'], es: ['diego', 'jorge', 'juan', 'carlos', 'reed', 'male'] },
};
if ('speechSynthesis' in window) speechSynthesis.getVoices(); // warm the voice list

function pickVoice(lang) {
  const pref = DB.settings.voicePref || 'female';
  const voices = speechSynthesis.getVoices();
  const prefix = String(lang).toLowerCase().startsWith('es') ? 'es' : 'en';
  const pool = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
  if (!pool.length) return null;
  const names = VOICE_NAMES[pref][prefix];
  return pool.find(v => names.some(n => v.name.toLowerCase().includes(n))) || pool[0];
}

function speak(text, lang = 'es-ES') {
  if (!('speechSynthesis' in window)) return;
  // Safari/iPad swallow an utterance queued in the same tick as cancel() —
  // only cancel when busy, and defer the new speech a beat afterwards.
  const wasBusy = speechSynthesis.speaking || speechSynthesis.pending;
  if (wasBusy) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : lang;
  const v = pickVoice(u.lang);
  if (v) u.voice = v;
  u.rate = 0.82;
  window.__lgUtter = u; // iOS GC guard — collected utterances go silent
  if (wasBusy) setTimeout(() => speechSynthesis.speak(u), 80);
  else speechSynthesis.speak(u);
  return u;
}
// voice list loads async on some browsers — warm it so pickVoice works
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener('voiceschanged', () => speechSynthesis.getVoices());
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-say]');
  if (btn) { e.stopPropagation(); speak(btn.dataset.say, btn.dataset.lang || 'es-ES'); }
}, true);

// ---------------- date helpers ----------------
const dstr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function mondayOf(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  return x;
}
const weekKey = () => dstr(mondayOf());
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// ---------------- per-kid data ----------------
const kid = () => DB.kids.find(k => k.id === DB.activeKid) || null;
const kidStats = (id = DB.activeKid) => (DB.stats[id] = DB.stats[id] || {});
const kidLog = (id = DB.activeKid) => (DB.log[id] = DB.log[id] || {});
const skillStat = (sid) => kidStats()[sid] || { s: 0, a: 0, c: 0 };

// adaptive difficulty: 1 easier · 2 on-level · 3 stretch, from mastery score
function difficultyFor(sid) {
  const sc = skillStat(sid).s;
  return sc < 40 ? 1 : sc < 80 ? 2 : 3;
}

function plantFor(score) {
  if (score >= 100) return '🌻';
  if (score >= 75) return '🌸';
  if (score >= 50) return '🪴';
  if (score >= 25) return '🌱';
  return '🌰';
}
const PLANT_LEGEND = '🌰 new → 🌱 sprouting → 🪴 growing → 🌸 blooming → 🌻 mastered!';

// ---------------- seeded weekly plan ----------------
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const PLAN_VERSION = 9; // bump when the skill catalog or plan logic changes (9 = handwriting, 175 skills)
function getWeekPlan(kidId = DB.activeKid) {
  const wk = weekKey();
  DB.plans[kidId] = DB.plans[kidId] || {};
  const stored = DB.plans[kidId][wk];
  if (stored && stored.v === PLAN_VERSION) return stored.days;

  // Build: per school day → 2 math, 1 language, 1 science (M/W/F) or
  // Spanish (T/Th), 1 wildcard (lowest score anywhere). Lowest-mastery first.
  const rnd = mulberry32(hashStr(kidId + wk));
  const stats = kidStats(kidId);
  const bySubject = {};
  for (const sub of SUBJECTS) bySubject[sub.id] = [];
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));
  const scored = SKILLS.map(s => ({ id: s.id, subject: strandSubject[s.strand], sc: (stats[s.id] || { s: 0 }).s, r: rnd() }))
    .sort((a, b) => (a.sc - b.sc) || (a.r - b.r));
  for (const s of scored) bySubject[s.subject].push(s.id);
  const all = scored.map(s => s.id);
  const used = new Set();
  const take = (list) => {
    for (const id of list) if (!used.has(id)) { used.add(id); return id; }
    return null;
  };
  // 🎯 school-focus skills (set by a parent for this week) fill the first
  // slots each day, spread round-robin; quotas fill the rest.
  const focus = (DB.focus || {})[kidId];
  const focusIds = (focus && focus.week === wk ? focus.skills : []).filter(id => SKILL_MAP[id]);
  const focusByDay = [[], [], [], [], []];
  focusIds.forEach((id, i) => { if (focusByDay[i % 5].length < 3) focusByDay[i % 5].push(id); });
  focusIds.forEach(id => used.add(id)); // focus skills can't double-book via the pools

  const days = [0, 1, 2, 3, 4].map(d => {
    // rotate the "special" subject through the week (others appear via review picks)
    const daySubj = ['science', 'spanish', 'social', 'typing', 'science'][d];
    const tasks = focusByDay[d].slice();
    // priority order fills up to 6 slots (Today shows the parent's goal count; rest are bonus)
    const pools = [bySubject.math, bySubject.ela, bySubject[daySubj], bySubject.math, all, all];
    for (const pool of pools) {
      if (tasks.length >= 6) break;
      const id = take(pool);
      if (id) tasks.push(id);
    }
    return tasks;
  });
  DB.plans[kidId][wk] = { v: PLAN_VERSION, days };
  save();
  return days;
}
// weekend garden (only when a grown-up turns on split days): six of the
// weakest skills, fresh each day, deterministic so re-renders agree
function weekendTasks(kidId = DB.activeKid) {
  const rnd = mulberry32(hashStr(kidId + dstr()));
  const st = kidStats(kidId);
  return SKILLS
    .filter(s => s.strand !== 'handwriting')
    .map(s => ({ id: s.id, sc: (st[s.id] || { s: 0 }).s, r: rnd() }))
    .sort((a, b) => (a.sc - b.sc) || (a.r - b.r))
    .slice(0, 6).map(x => x.id);
}

const SKILL_DONE_Q = 5; // questions to count a skill as "practiced" for the day
function taskDoneToday(sid, dayStr = dstr()) {
  const day = kidLog()[dayStr];
  if (!day || !day.per[sid]) return false;
  return day.per[sid][1] >= SKILL_DONE_Q || skillStat(sid).s >= 100;
}
function questionsToday() {
  const day = kidLog()[dstr()];
  return day ? day.t : 0;
}
const isWeekendDate = (d) => ((d.getDay() + 6) % 7) > 4;
// gentle daily target: finish the day's core skills (~5 questions each)
function dailyQuestionGoal(id = DB.activeKid) {
  return Math.max(SKILL_DONE_Q, kidSettings(id).schoolGoal * SKILL_DONE_Q);
}
function streakDays(id = DB.activeKid) {
  const log = kidLog(id);
  const goal = dailyQuestionGoal(id);
  const met = (dt) => { const e = log[dstr(dt)]; return e && e.t >= goal; };
  let streak = 0;
  const d = new Date();
  if (!met(d)) d.setDate(d.getDate() - 1); // today still in progress → start at yesterday
  let guard = 0;
  while (guard++ < 400) {
    if (met(d)) { streak++; d.setDate(d.getDate() - 1); continue; }
    if (isWeekendDate(d)) { d.setDate(d.getDate() - 1); continue; } // weekends are rest days, never break a streak
    break; // a school day with no practice ends the streak
  }
  return streak;
}

// ---------------- confetti ----------------
const confettiCanvas = $('#confetti');
const ctx = confettiCanvas.getContext('2d');
let particles = [];
function sizeCanvas() { confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; }
addEventListener('resize', sizeCanvas); sizeCanvas();
function burst(n = 26, big = false) {
  const colors = ['#FF6B57', '#FFC533', '#4CAE6B', '#4A9DE0', '#E05C9A'];
  for (let i = 0; i < n; i++) {
    particles.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * (big ? 500 : 260),
      y: innerHeight * (big ? 0.25 : 0.4),
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 9 - 4,
      s: Math.random() * 8 + 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 90 + Math.random() * 40,
    });
  }
  if (!animating) { animating = true; requestAnimationFrame(tick); }
}
let animating = false;
function tick() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  particles = particles.filter(p => p.life > 0 && p.y < innerHeight + 30);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.28; p.r += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c; ctx.globalAlpha = Math.min(1, p.life / 30);
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    ctx.restore();
  }
  if (particles.length) requestAnimationFrame(tick);
  else { animating = false; ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
}

// ---------------- router ----------------
let VIEW = 'kids';
let GATE_OK = false; // grown-ups gate passes once per visit
const PARENT_VIEWS = ['grownups', 'report', 'schoolsync', 'worksheet'];

// 9f: rotating times-table gate — nothing to forget, filters 2nd graders
function openGate(view, param) {
  const a = ri(6, 9), b = ri(6, 9);
  const wrap = document.createElement('div');
  wrap.className = 'modal-back';
  wrap.innerHTML = `<div class="modal" style="text-align:center;max-width:380px;background:var(--bg-parent)">
    <span class="subj-ico" style="width:46px;height:46px;background:var(--teal-tint);color:var(--teal);margin:0 auto 10px">${icon('lock', 21)}</span>
    <h2 style="font-family:var(--font-head);font-weight:800;font-size:19px;justify-content:center">Grown-ups only</h2>
    <p class="note">What is ${a} × ${b}? (kids can't sneak past this one)</p>
    <div class="answer-row" style="margin-top:14px">
      <input class="num-input" id="gateIn" inputmode="numeric" style="width:110px;border-color:var(--teal)" autocomplete="off">
      <button class="btn sky caps-btn" id="gateGo">Enter</button>
    </div>
    <div id="gateMsg" style="min-height:20px;font-weight:700;font-size:12.5px;color:var(--terra);margin-top:6px"></div>
  </div>`;
  document.body.appendChild(wrap);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) wrap.remove(); });
  const go = () => {
    if (Number($('#gateIn', wrap).value) === a * b) {
      GATE_OK = true; wrap.remove(); show(view, param);
    } else {
      $('#gateMsg', wrap).textContent = 'Hmm, not quite — ask a grown-up!';
      $('#gateIn', wrap).value = ''; $('#gateIn', wrap).focus();
    }
  };
  $('#gateGo', wrap).onclick = go;
  $('#gateIn', wrap).addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  $('#gateIn', wrap).focus();
}

function show(view, param) {
  if (PARENT_VIEWS.includes(view) && !GATE_OK) return openGate(view, param);
  if (!PARENT_VIEWS.includes(view)) GATE_OK = false; // re-lock when leaving parent world
  VIEW = view;
  const hasKid = !!kid();
  // per-kid accessibility prefs
  const ks = hasKid ? kidSettings() : {};
  document.body.classList.toggle('easy-font', !!ks.easyFont);
  document.body.classList.toggle('calm-motion', !!ks.calmMotion);
  document.body.classList.toggle('parent-mode', PARENT_VIEWS.includes(view));
  document.documentElement.classList.toggle('parent-mode', PARENT_VIEWS.includes(view)); // html bg must match — banding fix
  $('#tabbar').style.display = hasKid && view !== 'kids' && view !== 'garden' ? 'flex' : 'none';
  // default app bar: brand left, kid chip right — screens may override with their own bar content
  setAppbar(appbarBrand() + '<span class="ab-spacer"></span>' + appbarKidChip());
  $$('#tabbar button').forEach(b => b.classList.toggle('active', b.dataset.view === view || (b.dataset.view === 'grownups' && PARENT_VIEWS.includes(view))));
  window.scrollTo(0, 0);
  TT.ctx = null; TT.last = Date.now();
  const views = {
    kids: renderKids, today: renderToday, practice: renderPractice,
    session: () => renderSession(param), plan: renderPlan,
    progress: renderProgress, helper: renderHelper, grownups: renderGrownups,
    schoolsync: () => renderSchoolSync(param), report: () => renderParentReport(param),
    worksheet: renderWorksheetMaker, garden: renderMyGarden, profile: renderProfile,
    learn: renderMyLearning, learnpath: () => renderLearnPath(param),
    settings: renderSettingsPage,
    games: renderGames,
  };
  (views[view] || renderKids)();
}
$$('#tabbar button').forEach(b => b.onclick = () => show(b.dataset.view));

// ============================================================
// KID PICKER
// ============================================================
const AVATARS = ['🦊', '🐼', '🦄', '🐸', '🦁', '🐙', '🦋', '🐢', '🐰', '🐯', '🦖', '🐬'];
function renderKids() {
  const cards = DB.kids.map(k => {
    const st = kidStats(k.id);
    const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    return `<button class="kid-card" data-kid="${k.id}">
      <span class="face">${avatarFace(k.avatar, 52)}</span>
      <span class="nm">${esc(k.name)}</span>
      <span class="sub">🌻 ${flowers} mastered</span>
    </button>`;
  }).join('');
  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--sun)">👋</span>Who's practicing today?</h2>
      <div class="kid-grid">${cards}
        <button class="kid-card" id="addKid" style="border-style:dashed">
          <span class="face">➕</span><span class="nm">Add a kid</span>
          <span class="sub">takes 5 seconds</span>
        </button>
      </div>
    </div>
    <div style="text-align:center">
      <button class="btn small ghost" id="grownBtn">🔑 Grown-ups corner</button>
    </div>
  </div>`;
  $$('[data-kid]').forEach(b => b.onclick = () => { DB.activeKid = b.dataset.kid; save(); show('today'); });
  $('#addKid').onclick = renderAddKid;
  $('#grownBtn').onclick = () => show('grownups');
}

function renderAddKid() {
  app.innerHTML = `<div class="reveal"><div class="card pop">
    <h2><span class="bubble" style="background:var(--leaf)">🌱</span>Plant a new garden</h2>
    <div class="field-row"><input class="text-input" id="kidName" maxlength="20" placeholder="First name"></div>
    <p style="font-weight:800;margin:14px 0 8px">Pick your animal friend:</p>
    <div class="avatar-pick" id="avPick">${AVATARS.map((a, i) => `<button data-a="${a}" class="${i === 0 ? 'sel' : ''}">${avatarFace(a, 34)}</button>`).join('')}</div>
    <p style="font-weight:800;margin:14px 0 8px">What grade?</p>
    <div class="avatar-pick" id="gradePick">${[1, 2, 3].map(g => `<button data-g="${g}" class="${g === 2 ? 'sel' : ''}" style="font-family:var(--font-head);font-weight:800;font-size:15px;padding:8px 16px">Grade ${g}</button>`).join('')}</div>
    <p class="note" style="margin-top:6px">Practice content is 2nd grade today — more grades are coming as your kids grow.</p>
    <div class="field-row">
      <button class="btn primary" id="saveKid">Let's grow! 🌻</button>
      <button class="btn ghost" id="cancelKid">Back</button>
    </div>
  </div></div>`;
  let av = AVATARS[0], grade = 2;
  $$('#avPick button').forEach(b => b.onclick = () => {
    $$('#avPick button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel'); av = b.dataset.a;
  });
  $$('#gradePick button').forEach(b => b.onclick = () => {
    $$('#gradePick button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel'); grade = +b.dataset.g;
  });
  $('#saveKid').onclick = () => {
    const name = $('#kidName').value.trim();
    if (!name) { $('#kidName').focus(); return; }
    const id = 'k' + Date.now();
    DB.kids.push({ id, name, avatar: av, grade });
    DB.activeKid = id; save(); burst(30); sfx('cheer'); show('today');
  };
  $('#cancelKid').onclick = () => show('kids');
  $('#kidName').focus();
}

// ============================================================
// TODAY
// ============================================================
function renderToday() {
  const k = kid();
  let goal = kidSettings().schoolGoal;
  const plan = getWeekPlan();
  const dow = (new Date().getDay() + 6) % 7; // Mon=0
  const isWeekend = dow > 4;
  const todayStr = dstr();
  const logAll = kidLog();
  const totalQEver = Object.values(logAll).reduce((s, d) => s + d.t, 0);
  const qTodayNow = logAll[todayStr] ? logAll[todayStr].t : 0;

  // 9g: evening quick mode — after 6 PM a tired kid can pick a 5-minute day
  const mood = kidSettings().mood;
  const moodActive = mood && mood.date === todayStr && mood.mins === 5;
  if (moodActive) goal = 1;
  const offerMood = !isWeekend && new Date().getHours() >= 18 && (!mood || mood.date !== todayStr) && totalQEver > 0;

  // 9f: welcome back after a gap — zero guilt
  let gapDays = 0;
  if (totalQEver > 0 && qTodayNow === 0) {
    const d = new Date(); d.setDate(d.getDate() - 1);
    while (gapDays < 30 && !(logAll[dstr(d)] && logAll[dstr(d)].t > 0)) { gapDays++; d.setDate(d.getDate() - 1); }
  }
  const showWelcomeBack = gapDays >= 3;

  const daySplit = !!kidSettings().daySplit;
  const fullDay = isWeekend ? (daySplit ? weekendTasks() : []) : (plan[dow] || []).filter(sid => SKILL_MAP[sid]);
  let coreTasks = fullDay.slice(0, goal);
  if (typeof lessonFirstFor === 'function') {
    coreTasks = coreTasks.slice().sort((a, b) => (lessonFirstFor(b) ? 1 : 0) - (lessonFirstFor(a) ? 1 : 0));
  }
  const bonusTasks = fullDay.slice(goal);
  const doneCount = coreTasks.filter(t => taskDoneToday(t)).length;
  const allDone = coreTasks.length > 0 && doneCount === coreTasks.length;
  const streak = streakDays();
  const st = kidStats();
  const lv = levelInfo();
  const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const focus = focusSet();
  const theme = kidSettings().theme || 'garden';

  const rowFor = (sid) => {
    const sk = SKILL_MAP[sid];
    const subjId = subjectOfSkill(sid);
    const u = subjUI(subjId);
    const subName = (SUBJECTS.find(s => s.id === subjId) || { name: 'Lesson' }).name;
    const mins = sk.strand === 'reading' ? 10 : 5;
    const done = taskDoneToday(sid);
    // LESSON BEFORE PRACTICE: until understanding is confirmed (or when
    // practice shows struggle), the row teaches first — practice follows
    // automatically once the lesson is done.
    const les = (!done && typeof lessonFirstFor === 'function') ? lessonFirstFor(sid) : null;
    return `<button class="plan-task ${done ? 'done' : ''}" ${les ? `data-learnles="${les.id}:${sk.strand}${les.review ? ':review' : ''}"` : `data-skill="${sid}"`}>
      <span class="chk">${icon('check', 16)}</span>
      ${subjTile(subjId)}
      <span style="flex:1;min-width:0;text-align:left">
        <span class="t-name">${focus.has(sid) ? '🎯 ' : ''}${sk.name}</span>
        <span class="eyebrow t-sub" style="color:${u.color}">${les ? (les.review ? `Let's review the lesson · then practice` : `Lesson first · then practice`) : `${subName} · ${mins} min`}</span>
      </span>
      <span class="go" style="background:${les ? 'var(--terra)' : u.tint};color:${les ? '#fff' : u.dark}">${les ? `${les.review ? 'Review' : "Let's learn"} ${icon('bulb', 13)}` : `Start ${icon('arrowright', 13)}`}</span>
    </button>`;
  };

  const hasDiag = (DB.diag[k.id] || []).length > 0;
  const firstDay = totalQEver === 0 && !hasDiag;
  const checkupCard = (hasDiag || firstDay) ? '' : `
    <div class="card">
      <h2><span class="bubble" style="background:var(--green-tint);color:var(--green)">${icon('stetho', 17)}</span>First time? Garden checkup!</h2>
      <p class="note">A 5-minute quiz that finds what ${esc(k.name)} already knows — then the whole garden plans itself around it.</p>
      <div class="answer-row" style="justify-content:flex-start;flex-wrap:wrap;margin-top:10px">
        ${activeSubjects().filter(s => s.id !== 'custom').map(s => `<button class="btn small ghost" data-diag="${s.id}">${icon(subjUI(s.id).icon, 15)} ${s.name}</button>`).join('')}
      </div>
    </div>`;

  // 9f: first-day hero — the checkup is the star, never zeroed stats
  const firstDayCard = `<div class="card" style="text-align:center;padding:34px 24px;background:#FDF8F0">
      <div style="display:flex;justify-content:center;gap:8px;align-items:flex-end;margin-bottom:10px">${plantSVG(0, 40)}${plantSVG(30, 46)}</div>
      <h2 style="justify-content:center;font-size:21px">Let's plant your first seed!</h2>
      <p class="note" style="max-width:400px;margin:4px auto 16px">A 5-minute Garden Checkup finds what you already know — then your garden plans itself.</p>
      <button class="btn primary caps-btn big" id="firstCheckup">Start the checkup</button>
    </div>`;

  // 9f: welcome-back — plants never wilt here
  const welcomeCard = `<div class="welcome-card">
      ${foxSVG(46, "cheer")}
      <h2 style="justify-content:center;font-size:20px;margin:6px 0 2px">We missed you, ${esc(k.name)}!</h2>
      <p class="note" style="max-width:380px;margin:0 auto 14px">Your garden waited for you — nothing wilted. Water it today and a brand-new streak begins.</p>
      <button class="btn primary caps-btn" id="startPlanBtn">Start today's plan</button>
    </div>`;

  // 9g: evening mood picker
  const moodCard = offerMood ? `<div class="card" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <span style="color:var(--purple)">${icon('moon', 24)}</span>
      <span style="flex:1;min-width:160px"><b style="font-family:var(--font-head)">Long day? Pick your size.</b>
      <p class="note">Either way, today still counts.</p></span>
      <button class="btn small ghost" data-mood="5">I have 5 minutes</button>
      <button class="btn small primary" data-mood="15">I have 15</button>
    </div>` : '';
  const moodNote = moodActive ? `<p class="note" style="margin:0 0 8px 4px">${icon('moon', 13)} Quick-day mode: just 1 skill tonight — it still waters the garden.</p>` : '';

  // ---- left column ----
  const planCard = (isWeekend && !daySplit)
    ? `<div class="card plan-card">
        <div class="plan-title-row">
          <span class="subj-ico" style="width:40px;height:40px;background:var(--gold-tint);color:var(--gold)">${icon('calendar', 19)}</span>
          <h2 style="margin:0">Weekend explore day!</h2>
        </div>
        <p class="note" style="margin-top:8px">No school-day plan — wander the garden, try a Daily Mix, or learn something brand new. Weekends never break your streak.</p>
        <div class="answer-row" style="justify-content:flex-start;margin-top:14px">
          <button class="btn primary" id="goMixW">${icon('rainbow', 16)} Daily Mix</button>
          <button class="btn ghost" id="freePlay">${icon('sprout', 16)} Explore practice</button>
        </div>
      </div>`
    : `<div class="card plan-card">
        <div class="plan-title-row">
          <span class="subj-ico" style="width:40px;height:40px;background:var(--gold-tint);color:var(--gold)">${icon('calendar', 19)}</span>
          <h2 style="margin:0">${isWeekend ? 'Weekend garden' : "Today's plan"}</h2>
          <span class="done-chip">${doneCount} of ${coreTasks.length} done</span>
        </div>
        ${allDone ? `<div style="background:var(--green-tint);border-radius:12px;padding:12px 14px;font-weight:700;color:#2E5C3F;margin:10px 0 2px"><span style="color:var(--gold)">${icon('star', 15)}</span> Plan complete! Anything more today is pure bonus. Amazing work!</div>` : ''}
        ${daySplit && coreTasks.length > 1 ? `
          <p class="bed-label"><span style="color:var(--gold)">${icon('sunrise', 15)}</span> Morning bed</p>
          ${coreTasks.slice(0, Math.ceil(coreTasks.length / 2)).map(rowFor).join('')}
          <p class="bed-label" style="margin-top:14px"><span style="color:var(--purple)">${icon('moon', 15)}</span> Afternoon bed</p>
          ${coreTasks.slice(Math.ceil(coreTasks.length / 2)).map(rowFor).join('')}`
        : coreTasks.map(rowFor).join('')}
        ${bonusTasks.length ? `<button class="btn small ghost" id="bonusToggle" style="margin-top:12px">＋ Feeling great? ${bonusTasks.length} bonus skill${bonusTasks.length > 1 ? 's' : ''}</button>
        <div id="bonusWrap" style="display:none;margin-top:6px">${bonusTasks.map(rowFor).join('')}</div>` : ''}
      </div>`;

  const tl = typeof todayLessonPick === 'function' ? todayLessonPick() : null;
  const lessonCard = !tl ? '' : tl.doneToday
    ? `<div class="card" style="display:flex;align-items:center;gap:12px;background:var(--green-tint);border-color:var(--green-tint)">
        <span style="flex:none;display:inline-flex">${foxSVG(38, 'cheer')}</span>
        <span style="flex:1;min-width:0;font-weight:700">Lesson learned today — beautiful! It's planted in Practice with a head start.</span>
        <button class="btn small ghost" id="tlDash">My Learning ${icon('right', 13)}</button>
      </div>`
    : `<div class="card lesson-today">
        <span style="flex:none;display:inline-flex">${foxSVG(44, 'talk')}</span>
        <span style="flex:1;min-width:0">
          <span class="eyebrow" style="color:var(--terra)">${tl.resume ? 'Keep learning' : "Today's lesson"}</span>
          <b style="display:block;font-family:var(--font-head);font-size:17px">${esc(tl.ls.name)}</b>
          <p class="note">${esc((STRANDS.find(x => x.id === tl.strandId) || {}).name || '')} path · the fox teaches, then you try</p>
        </span>
        <button class="btn primary caps-btn" id="tlGo">${tl.resume ? 'Keep going' : "Let's learn"}</button>
      </div>`;

  const arcadeCard = (allDone && !isWeekend) ? `<div class="card" style="display:flex;align-items:center;gap:14px;background:var(--gold-tint)">
      <span class="subj-ico" style="width:44px;height:44px;background:#fff;color:var(--gold)">${icon('puzzle', 20)}</span>
      <span style="flex:1;min-width:0"><b style="font-family:var(--font-head)">Plan done — the arcade is open!</b>
      <p class="note">Today's pick is waiting in the Game Corner.</p></span>
      <button class="btn primary caps-btn" id="goArcade">Play</button>
    </div>` : '';

  const owlCard = `<div class="owl-card">
      <span class="owl-tile">${owlSVG(36)}</span>
      <span style="flex:1;min-width:0"><b>Stuck on homework?</b><p>Snap a photo and the Helper Owl walks you through it, step by step.</p></span>
      <button class="btn sky caps-btn" id="goHelper">${icon('camera', 16)} Open Helper</button>
    </div>`;

  // ---- right column: garden or trophy shelf ----
  const gardenSkills = fullDay.length ? fullDay : SKILLS.slice(0, 6).map(s => s.id);
  const plantRow = gardenSkills.slice(0, 6).map((sid, i) => {
    const sc = (st[sid] || { s: 0 }).s;
    return plantSVG(sc, [78, 64, 70, 56, 48, 42][i % 6], i);
  }).join('');
  const gardenPanel = `<div class="garden-panel">
      <div class="garden-scene">
        <div class="g-head">
          <b>${esc(k.name)}'s garden</b>
          <span class="g-chip">${flowers} flower${flowers === 1 ? '' : 's'} grown</span>
        </div>
        <p class="g-desc">Finish today's plan to water the garden. Master a skill and a new flower blooms.</p>
        <span class="sun-circ"></span>
        <div class="g-ground"><span class="g-hill"></span></div>
        <div class="garden-plants">${plantRow}</div>
        <div class="water-float">
          <div class="water-row">${icon('droplet', 16)} Today's water
            <span class="water-meter"><i style="width:${coreTasks.length ? Math.round(doneCount / coreTasks.length * 100) : 0}%"></i></span>
            <b style="font-size:12.5px">${doneCount}/${coreTasks.length || goal}</b></div>
        </div>
      </div>
    </div>`;

  const badges = getBadges();
  const earned = badges.filter(b => b.got);
  const nextBadge = badges.find(b => !b.got);
  const trophyPanel = `<div class="card" style="height:100%">
      <div class="eyebrow" style="margin-bottom:10px">Trophy shelf</div>
      ${nextBadge ? `<div style="display:flex;align-items:center;gap:12px;background:var(--gold-tint);border-radius:14px;padding:12px 14px;margin-bottom:12px">
        <span style="font-size:30px">${nextBadge.bi}</span>
        <span style="flex:1"><b style="font-family:var(--font-head)">Next up: ${nextBadge.bn}</b>
        <p class="note">${nextBadge.hint || 'Keep growing to unlock it!'}</p></span></div>` : ''}
      <div class="badge-grid">${badges.map(b => `<div class="badge ${b.got ? '' : 'locked'}"><div class="bi">${b.bi}</div><div class="bn">${b.bn}</div></div>`).join('')}</div>
      <p class="note" style="margin-top:10px">${earned.length} of ${badges.length} earned</p>
    </div>`;

  setAppbar(`
    <span class="hero-avatar">${avatarFace(k.avatar, 32)}</span>
    <div class="hero-meta">
      <div class="hi">${greet}, ${esc(k.name)}</div>
      <div class="level-row">
        <span class="level-chip">Lv ${lv.level}</span>
        <span class="xp-bar"><i style="width:${Math.round(lv.into / lv.need * 100)}%"></i></span>
        <span class="xp-label">${lv.into}/${lv.need} XP</span>
      </div>
    </div>
    <span class="ab-spacer"></span>
    <span class="pill ghost-pill">Grade ${k.grade || 2} ${icon('right', 13, 'chev-down')}</span>
    <span class="pill">${flameSVG(15)} ${streak}</span>
    <span class="pill gold">${starSVG(15)} ${lv.stars}</span>
    <button class="icon-btn" id="gearBtn" aria-label="Settings">${icon('settings', 19)}</button>
    <button class="btn sky caps-btn" id="grownBtnT">Grown-ups</button>`);
  app.innerHTML = `<div class="reveal">
    <div class="today-grid">
      <div class="today-left">
        ${firstDay ? firstDayCard : `${showWelcomeBack ? welcomeCard : ''}${moodCard}${moodNote}${lessonCard}${planCard}${arcadeCard}`}
      </div>
      <div class="today-right">
        ${theme === 'stars' ? trophyPanel : gardenPanel}
        ${firstDay ? '' : `${checkupCard}${owlCard}`}
      </div>
    </div>
  </div>`;

  $$('[data-skill]').forEach(b => b.onclick = () => show('session', b.dataset.skill));
  $$('[data-diag]').forEach(b => b.onclick = () => startDiagnostic(b.dataset.diag));
  const fc = $('#firstCheckup'); if (fc) fc.onclick = startMixedDiagnostic;
  $$('[data-learnles]').forEach(b => b.onclick = () => {
    const [lid, strandId, review] = b.dataset.learnles.split(':');
    startLesson(lid, strandId, review ? { review: true } : {});
  });
  const fp = $('#freePlay'); if (fp) fp.onclick = () => show('practice');
  const bt = $('#bonusToggle'); if (bt) bt.onclick = () => {
    const w = $('#bonusWrap'); w.style.display = w.style.display === 'none' ? 'block' : 'none';
  };
  const gmw = $('#goMixW'); if (gmw) gmw.onclick = startMix;
  const gh = $('#goHelper'); if (gh) gh.onclick = () => { HELPER_TAB = 'homework'; show('helper'); };
  $('#grownBtnT').onclick = () => show('grownups');
  $('#gearBtn').onclick = openSettings;
  const gac = $('#goArcade'); if (gac) gac.onclick = () => show('games');
  const tlGo = $('#tlGo'); if (tlGo) tlGo.onclick = () => startLesson(tl.ls.id, tl.strandId, { resume: tl.resume });
  const tlD = $('#tlDash'); if (tlD) tlD.onclick = () => show('learn');
  maybeTour();
  updateAppBadge();
  const gs = $('.garden-scene'); if (gs) { gs.style.cursor = 'pointer'; gs.onclick = (e) => { if (!e.target.closest('.water-float')) show('garden'); }; }
  const spb = $('#startPlanBtn'); if (spb) spb.onclick = () => {
    const next = coreTasks.find(t => !taskDoneToday(t));
    if (next) show('session', next); else show('practice');
  };
  $$('[data-mood]').forEach(b => b.onclick = () => {
    kidSettings().mood = { date: todayStr, mins: +b.dataset.mood };
    save(); renderToday();
  });
}

// ============================================================
// 7c — MY PROFILE (opened from the name chip)
// ============================================================
const ANIMAL_NAMES = { '🦊': 'Fox', '🐼': 'Panda', '🦄': 'Unicorn', '🐸': 'Frog', '🦁': 'Lion', '🐙': 'Octopus', '🦋': 'Butterfly', '🐢': 'Turtle', '🐰': 'Bunny', '🐯': 'Tiger', '🦖': 'Dino', '🐬': 'Dolphin' };
function renderProfile() {
  const k = kid();
  const lv = levelInfo();
  const st = kidStats();
  const log = kidLog();
  const totalQ = Object.values(log).reduce((s, d) => s + d.t, 0);
  const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
  const streak = streakDays();
  const theme = kidSettings().theme || 'garden';
  const mon = mondayOf();

  const badgeColors = ['var(--terra)', 'var(--teal)', 'var(--green)', 'var(--gold)', 'var(--purple)', 'var(--blue)'];
  const badges = getBadges();
  const earned = badges.filter(b => b.got).length;
  const shelf = badges.map((b, i) => b.got
    ? `<div class="pf-badge"><span class="pf-tile" style="background:${badgeColors[i % 6]}">${b.bi}</span><small>${b.bn}</small></div>`
    : `<div class="pf-badge locked"><span class="pf-tile">${icon('lock', 18)}</span><small>${b.bn}</small></div>`).join('');

  const weekRow = [0, 1, 2, 3, 4].map(i => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const did = log[dstr(d)] && log[dstr(d)].t > 0;
    return `<span class="wk-chk ${did ? 'on' : ''}">${did ? icon('check', 13) : ''}</span>`;
  }).join('');

  const toNext = lv.need - lv.into;
  app.innerHTML = `<div class="reveal">
    <div class="today-grid" style="grid-template-columns:.85fr 1.15fr">
      <div>
        <div class="card" style="text-align:center;padding:26px 20px">
          <div class="pf-avatar"><span>${avatarFace(k.avatar, 56)}</span><button class="pf-edit" id="pfEdit" aria-label="Change animal">${icon('pencil', 14)}</button></div>
          <h2 style="justify-content:center;font-size:24px;margin:10px 0 0">${esc(k.name)}</h2>
          <p class="note">Grade ${k.grade || 2} · ${ANIMAL_NAMES[k.avatar] || 'Animal'} friend</p>
          <div style="display:flex;justify-content:space-between;font-weight:700;font-size:12.5px;margin:14px 4px 6px">
            <span style="font-family:var(--font-head)">Level ${lv.level}</span><span style="color:var(--soft)">${lv.into}/${lv.need} XP</span>
          </div>
          <span class="xp-bar" style="display:block;width:100%;height:9px"><i style="width:${Math.round(lv.into / lv.need * 100)}%"></i></span>
        </div>
        <div class="card" id="animalCard">
          <div class="eyebrow" style="margin-bottom:10px">Change my animal friend</div>
          <div class="avatar-pick">${AVATARS.map(a => `<button data-av="${a}" class="${k.avatar === a ? 'sel' : ''}">${avatarFace(a, 34)}</button>`).join('')}</div>
        </div>
        <div class="card">
          <div class="eyebrow" style="margin-bottom:10px">My theme</div>
          <div class="theme-cards">
            <button class="theme-card ${theme === 'garden' ? 'sel' : ''}" data-ptheme="garden">
              <div class="prev" style="background:linear-gradient(#CDE8F5, #B7D8A8)"></div>Garden ${theme === 'garden' ? '✓' : ''}</button>
            <button class="theme-card ${theme === 'stars' ? 'sel' : ''}" data-ptheme="stars">
              <div class="prev" style="background:var(--gold-tint);display:grid;place-items:center;color:var(--gold)">${icon('award', 26)}</div>Stars & Badges ${theme === 'stars' ? '✓' : ''}</button>
          </div>
        </div>
      </div>
      <div>
        <div class="stat-row" style="margin-bottom:16px">
          <div class="stat-tile"><div class="v" style="color:var(--gold)">${lv.stars}</div><div class="l">stars</div></div>
          <div class="stat-tile"><div class="v" style="color:var(--terra)">${flowers}</div><div class="l">flowers grown</div></div>
          <div class="stat-tile"><div class="v" style="color:var(--terra)">${streak}</div><div class="l">day streak</div></div>
          <div class="stat-tile"><div class="v">${totalQ}</div><div class="l">questions ever</div></div>
        </div>
        <div class="card">
          <div style="display:flex;align-items:center;margin-bottom:12px">
            <h2 style="margin:0">My badges</h2>
            <span class="note" style="margin-left:auto">${earned} of ${badges.length} earned</span>
          </div>
          <div class="pf-shelf">${shelf}</div>
          <div class="wk-row">${icon('flame', 15)} <b style="font-family:var(--font-head);font-size:13px">This week</b><span style="margin-left:auto;display:flex;gap:6px">${weekRow}</span></div>
        </div>
        <div class="recap-card" style="align-items:center">
          <span style="flex:none">${plantSVG(100, 30, 0)}${plantSVG(80, 26, 1)}${plantSVG(30, 22)}</span>
          <span style="flex:1"><b>${flowers} flower${flowers === 1 ? '' : 's'} and counting.</b> ${toNext} more star${toNext === 1 ? '' : 's'} to reach Level ${lv.level + 1}.</span>
          <button class="btn primary caps-btn" id="pfGarden">Visit my garden</button>
        </div>
        <div class="answer-row" style="justify-content:flex-start">
          <button class="btn small ghost" id="pfSwitch">${icon('users', 14)} Switch kid</button>
        </div>
      </div>
    </div>
  </div>`;

  const scrollToAnimals = () => $('#animalCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('#pfEdit').onclick = scrollToAnimals;
  $$('[data-av]').forEach(b => b.onclick = () => { k.avatar = b.dataset.av; save(); renderProfile(); });
  $$('[data-ptheme]').forEach(b => b.onclick = () => { kidSettings().theme = b.dataset.ptheme; save(); renderProfile(); });
  $('#pfGarden').onclick = () => show('garden');
  $('#pfSwitch').onclick = () => show('kids');
}

// ============================================================
// 9a — MY GARDEN: the world that fills up all year
// ============================================================
function renderMyGarden() {
  const k = kid();
  const st = kidStats();
  const scored = SKILLS.map(s => ({ s, sc: (st[s.id] || { s: 0 }).s, a: (st[s.id] || { a: 0 }).a }));
  const planted = scored.filter(x => x.a > 0 || x.sc > 0).sort((a, b) => b.sc - a.sc);
  const mastered = planted.filter(x => x.sc >= 100).length;
  const plots = planted.slice(0, 6);
  const plotHTML = plots.map((x, i) => `
    <button class="g-plot" data-tip="${escAttr(x.s.name)} · ${x.sc >= 100 ? 'mastered! 🌼' : 'score ' + x.sc}">
      <span class="g-plant ${x.sc >= 100 ? 'float-plant' : ''}">${plantSVG(x.sc, x.sc >= 100 ? 64 : 44 + Math.round(x.sc / 6), i)}</span>
      <span class="g-mound"></span>
    </button>`).join('');
  const lockedHTML = Array.from({ length: 6 }, () => `
    <span class="g-plot locked"><span class="g-q">?</span><span class="g-mound dashed"></span></span>`).join('');

  app.innerHTML = `<div class="mygarden">
    <div class="mg-sky">
      <div class="mg-head">
        <button class="back" id="mgBack">${icon('left', 18)}</button>
        <h2>${esc(k.name)}'s Garden</h2>
        <span class="g-chip" style="margin-left:auto">${mastered} of ${SKILLS.length} skills planted ${plantSVG(30, 16)}</span>
      </div>
      <span class="mg-cloud" style="left:12%;top:14%"></span>
      <span class="mg-cloud" style="left:44%;top:26%;width:90px"></span>
      <span class="sun-circ" style="top:24px;right:44px"></span>
    </div>
    <div class="mg-grass">
      <div class="mg-plots">${plotHTML}${lockedHTML}</div>
      <div class="mascot" style="position:absolute;left:18px;bottom:18px">
        ${foxSVG(40)}
        <span class="say">Every flower here is a skill you mastered. Tap one to remember it!</span>
      </div>
      <div class="mg-actions">
        <button class="btn caps-btn" id="mgAlbum">Garden album</button>
        <button class="btn primary caps-btn" id="mgPractice">Plant more — practice</button>
      </div>
      <div class="g-tip" id="gTip" style="display:none"></div>
    </div>
  </div>`;
  $('#mgBack').onclick = () => show('today');
  $('#mgAlbum').onclick = () => show('progress');
  $('#mgPractice').onclick = () => show('practice');
  $$('.g-plot[data-tip]').forEach(p => p.onclick = () => {
    const tip = $('#gTip');
    tip.textContent = p.dataset.tip;
    tip.style.display = 'block';
    const r = p.getBoundingClientRect(), host = $('.mg-grass').getBoundingClientRect();
    tip.style.left = Math.max(8, r.left - host.left + r.width / 2 - 90) + 'px';
    tip.style.top = (r.top - host.top - 40) + 'px';
    clearTimeout(renderMyGarden._t);
    renderMyGarden._t = setTimeout(() => { tip.style.display = 'none'; }, 2200);
  });
}

// ---------------- badges (shared: Progress page + trophy theme) ----------------
function getBadges(kidId = DB.activeKid) {
  const st = kidStats(kidId);
  const log = DB.log[kidId] || {};
  const totalQ = Object.values(log).reduce((s, d) => s + d.t, 0);
  const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
  const blooms = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 75).length;
  const strandsTried = new Set(SKILLS.filter(s => (st[s.id] || { a: 0 }).a > 0).map(s => s.strand)).size;
  const streak = streakDays();
  return [
    { bi: '🎈', bn: 'First question', got: totalQ >= 1, hint: 'Answer your very first question.' },
    { bi: '🌈', bn: '50 questions', got: totalQ >= 50, hint: `${Math.max(0, 50 - totalQ)} questions to go!` },
    { bi: '🚀', bn: '250 questions', got: totalQ >= 250, hint: `${Math.max(0, 250 - totalQ)} questions to go!` },
    { bi: '👑', bn: '1,000 questions', got: totalQ >= 1000, hint: 'A true garden champion.' },
    { bi: '🌸', bn: 'First bloom', got: blooms >= 1, hint: 'Grow any skill to 75.' },
    { bi: '🌼', bn: 'First gold daisy', got: flowers >= 1, hint: 'Master any skill (score 100).' },
    { bi: '🌟', bn: '5 gold daisies', got: flowers >= 5, hint: `${Math.max(0, 5 - flowers)} more masteries to go!` },
    { bi: '🔥', bn: '3-day streak', got: streak >= 3, hint: 'Practice 3 school days in a row.' },
    { bi: '⚡', bn: '7-day streak', got: streak >= 7, hint: 'A whole week of watering!' },
    { bi: '🗺️', bn: 'Tried every topic', got: strandsTried >= STRANDS.length, hint: 'Visit every corner of the garden.' },
  ];
}

// ---------------- settings — a real page (gear opens it) ----------------
function openSettings() { show('settings'); }
function renderSettingsPage() {
  const s = kidSettings();
  const theme = s.theme || 'garden';
  const vp = DB.settings.voicePref || 'female';
  setAppbar(`
    <button class="back" id="setBack" aria-label="Back">${icon('left', 18)}</button>
    <div class="hero-meta"><div class="hi">Settings</div>
      <p class="note" style="margin-top:0">For ${esc(kid().name)}'s garden</p></div>
    <span class="ab-spacer"></span>${appbarKidChip()}`);
  app.innerHTML = `<div class="reveal" style="max-width:660px;margin:0 auto">
    <div class="card">
      <h2><span class="bubble" style="background:var(--gold-tint);color:var(--gold)">${icon('settings', 16)}</span>Dashboard theme</h2>
      <div class="theme-cards">
        <button class="theme-card ${theme === 'garden' ? 'sel' : ''}" data-theme="garden">
          <div class="prev" style="background:linear-gradient(#CDE8F5, #B7D8A8)"></div>My garden</button>
        <button class="theme-card ${theme === 'stars' ? 'sel' : ''}" data-theme="stars">
          <div class="prev" style="background:var(--gold-tint);display:grid;place-items:center;color:var(--gold)">${icon('award', 28)}</div>Stars & badges</button>
      </div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--teal-tint);color:var(--teal)">${icon('volume', 16)}</span>Sounds & voice</h2>
      <div class="toggle-row">${icon('volume', 17)} Sounds & cheers
        <button class="tog ${soundsOn() ? 'on' : ''}" id="togSounds" aria-label="Toggle sounds"></button></div>
      <div class="toggle-row">${icon('users', 17)} Read-aloud voice
        <span style="display:inline-flex;gap:7px;margin-left:auto">
          <button class="btn small ${vp === 'female' ? 'sky' : 'ghost'}" id="setVoiceF">Girl voice</button>
          <button class="btn small ${vp === 'male' ? 'sky' : 'ghost'}" id="setVoiceM">Boy voice</button>
          <button class="btn small ghost" id="setVoiceT">${icon('volume', 13)} Test</button>
        </span></div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--green-tint);color:var(--green)">${icon('book', 16)}</span>Reading & motion</h2>
      <div class="toggle-row">${icon('book', 17)} Easy-read font
        <button class="tog ${s.easyFont ? 'on' : ''}" id="togFont" aria-label="Toggle easy-read font"></button></div>
      <div class="toggle-row">${icon('rainbow', 17)} Calm motion (fewer animations)
        <button class="tog ${s.calmMotion ? 'on' : ''}" id="togMotion" aria-label="Toggle calm motion"></button></div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--terra-tint);color:var(--terra)">${icon('calendar', 16)}</span>The day's shape</h2>
      <div class="toggle-row">${icon('sprout', 17)} Split the day — morning & afternoon beds <span class="note" style="font-weight:600">(great for summer + weekends)</span>
        <button class="tog ${s.daySplit ? 'on' : ''}" id="togSplit" aria-label="Toggle split day"></button></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:14px">
      <span class="subj-ico" style="width:44px;height:44px;background:var(--teal-tint);color:var(--teal)">${icon('lock', 20)}</span>
      <span style="flex:1;min-width:0"><b style="font-family:var(--font-head)">Grown-ups corner</b>
        <p class="note">Reports, school focus, worksheets, and family tools.</p></span>
      <button class="btn sky caps-btn" id="setGrown">Open</button>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:14px">
      <span style="flex:none;display:inline-flex">${foxSVG(40, 'talk')}</span>
      <span style="flex:1;min-width:0"><b style="font-family:var(--font-head)">Show me around again</b>
        <p class="note">Replay the welcome tour of the garden.</p></span>
      <button class="btn ghost caps-btn" id="setTour">Replay</button>
    </div>
  </div>`;
  $('#setBack').onclick = () => show('today');
  $$('.theme-card').forEach(b => b.onclick = () => {
    s.theme = b.dataset.theme; save();
    $$('.theme-card').forEach(x => x.classList.toggle('sel', x === b));
  });
  $('#togSounds').onclick = (e) => {
    s.sounds = !soundsOn(); save();
    e.currentTarget.classList.toggle('on', soundsOn());
    if (soundsOn()) sfx('correct');
  };
  $('#setVoiceF').onclick = () => { DB.settings.voicePref = 'female'; save(); renderSettingsPage(); };
  $('#setVoiceM').onclick = () => { DB.settings.voicePref = 'male'; save(); renderSettingsPage(); };
  $('#setVoiceT').onclick = () => speak(`Hi ${kid().name}! Let's grow something today.`, 'en');
  $('#togFont').onclick = (e) => {
    s.easyFont = !s.easyFont; save();
    e.currentTarget.classList.toggle('on', !!s.easyFont);
    document.body.classList.toggle('easy-font', !!s.easyFont);
  };
  $('#togMotion').onclick = (e) => {
    s.calmMotion = !s.calmMotion; save();
    e.currentTarget.classList.toggle('on', !!s.calmMotion);
    document.body.classList.toggle('calm-motion', !!s.calmMotion);
  };
  $('#togSplit').onclick = (e) => {
    s.daySplit = !s.daySplit; save();
    e.currentTarget.classList.toggle('on', !!s.daySplit);
  };
  $('#setGrown').onclick = () => show('grownups');
  $('#setTour').onclick = () => { kidSettings().toured = false; save(); show('today'); };
}

// ---------------- time in the garden (Faith 2026-07-23) ----------------
// Heartbeat: every 15s of VISIBLE app time adds to today's log; when a
// session or lesson is open, the active skill collects it too
// (day.per[skill][2] = seconds). Nothing runs while the tab is hidden.
const TT = { last: Date.now(), ctx: null };
function timeTick() {
  const now = Date.now();
  const dt = Math.min(30, (now - TT.last) / 1000);
  TT.last = now;
  if (document.visibilityState !== 'visible' || !kid() || dt <= 0) return;
  const log = kidLog();
  const day = log[dstr()] = log[dstr()] || { t: 0, c: 0, per: {} };
  day.sec = (day.sec || 0) + dt;
  if (VIEW === 'games' && typeof kidGames === 'function') kidGames().minutesToday += dt / 60;
  if (TT.ctx && SKILL_MAP[TT.ctx]) {
    day.per[TT.ctx] = day.per[TT.ctx] || [0, 0];
    day.per[TT.ctx][2] = (day.per[TT.ctx][2] || 0) + dt;
  }
  save();
}
setInterval(timeTick, 15000);
document.addEventListener('visibilitychange', () => { TT.last = Date.now(); });
function weekSeconds(kidId) {
  const log = DB.log[kidId] || {};
  const mon = mondayOf();
  let sec = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const e = log[dstr(d)]; if (e) sec += e.sec || 0;
  }
  return sec;
}
function fmtMins(sec) {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
}

// ---------------- practice-time reminders (free + offline-honest) ----------------
// While the app is OPEN we can nudge: an in-app banner always works, and a
// system notification fires where the browser allows it (desktop; installed
// PWAs on some tablets). True push-while-closed needs a server — never here.
function remindersCfg() {
  DB.settings.reminders = DB.settings.reminders || { nudge: true, streakAlert: true, recap: false };
  const r = DB.settings.reminders;
  r.time = r.time || '15:30';
  return r;
}
function reminderTick() {
  const r = remindersCfg();
  if (!r.nudge || !kid()) return;
  const today = dstr();
  if (r.lastFired === today) return;
  const now = new Date();
  const [hh, mm] = r.time.split(':').map(Number);
  if (now.getHours() < hh || (now.getHours() === hh && now.getMinutes() < mm)) return;
  const goal = kidSettings().schoolGoal || 3;
  const plan = getWeekPlan();
  const dow = (now.getDay() + 6) % 7;
  if (dow > 4) return; // weekends rest
  const core = (plan[dow] || []).filter(sid => SKILL_MAP[sid]).slice(0, goal);
  const left = core.filter(t => !taskDoneToday(t)).length;
  if (!left) return;
  r.lastFired = today; save();
  const msg = `${kid().name}'s garden is thirsty — ${left} little ${left === 1 ? 'task' : 'tasks'} to water it today!`;
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Learning Garden', { body: msg, icon: 'icons/icon-192.png', tag: 'lg-nudge' });
    }
  } catch (e) {}
  nudgeToast(msg);
}
function nudgeToast(msg) {
  if (document.getElementById('nudgeToast')) return;
  const el = document.createElement('div');
  el.id = 'nudgeToast'; el.className = 'nudge-toast';
  el.innerHTML = `${owlSVG(34)}<span style="flex:1;min-width:0">${esc(msg)}</span>
    <button class="btn small primary" id="nudgeGo">Let's go</button>
    <button class="icon-btn" id="nudgeX" aria-label="Dismiss" style="width:30px;height:30px">${icon('x', 13)}</button>`;
  document.body.appendChild(el);
  el.querySelector('#nudgeGo').onclick = () => { el.remove(); show('today'); };
  el.querySelector('#nudgeX').onclick = () => el.remove();
}
setInterval(reminderTick, 60000);

// app-icon badge = plan tasks left today (installed PWAs that support it)
function updateAppBadge() {
  if (!('setAppBadge' in navigator) || !kid()) return;
  try {
    const goal = kidSettings().schoolGoal || 3;
    const dow = (new Date().getDay() + 6) % 7;
    if (dow > 4) { navigator.clearAppBadge(); return; }
    const core = (getWeekPlan()[dow] || []).filter(sid => SKILL_MAP[sid]).slice(0, goal);
    const left = core.filter(t => !taskDoneToday(t)).length;
    if (left) navigator.setAppBadge(left); else navigator.clearAppBadge();
  } catch (e) {}
}

// ---------------- first-run tour (newbies welcome) ----------------
const TOUR_STEPS = [
  ['Welcome to your garden!', 'Every day has a little plan. Finish it and your garden gets watered — skills grow from seeds into flowers.', 'sprout'],
  ['The fox teaches you', 'Tap <b>Learn</b> to be taught something brand new, step by step. Lessons plant new skills with a head start!', 'bulb'],
  ['Practice makes flowers', 'In <b>Practice</b>, every skill grows as you answer. Wrong answers get a hint and a second try — that is how gardens grow.', 'book'],
  ['Stuck? The owl helps', 'The <b>Helper</b> owl walks you through homework, listens to you read, and never just gives away answers.', 'gradcap'],
  ['Grown-ups corner', 'Parents: reports, school focus, worksheets, and settings live behind the <b>Grown-ups</b> lock. Kids — go grab your grown-up!', 'lock'],
];
function maybeTour() {
  if (!kid() || kidSettings().toured) return;
  if (document.getElementById('tourBack')) return; // never stack two tours
  let ti = 0;
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.id = 'tourBack';
  const paint = () => {
    const [title, body, ic] = TOUR_STEPS[ti];
    back.innerHTML = `<div class="modal tour-card pop">
      <span style="display:inline-flex;margin-bottom:6px">${ti === 0 ? foxSVG(64, 'cheer') : ti === 3 ? owlSVG(60) : foxSVG(64, 'talk')}</span>
      <span class="subj-ico" style="width:34px;height:34px;background:var(--terra-tint);color:var(--terra);position:absolute;top:18px;right:18px">${icon(ic, 17)}</span>
      <h2 style="font-family:var(--font-head);font-weight:800;font-size:20px;justify-content:center">${title}</h2>
      <p style="font-weight:600;color:var(--soft);line-height:1.55;margin-top:6px">${body}</p>
      <div class="pdots" style="justify-content:center;margin:14px 0 12px">${TOUR_STEPS.map((_, j) => `<span class="pdot ${j <= ti ? 'on' : ''}"></span>`).join('')}</div>
      <div class="answer-row" style="justify-content:center">
        ${ti < TOUR_STEPS.length - 1 ? `<button class="btn ghost" id="tourSkip">Skip</button>
        <button class="btn primary caps-btn" id="tourNext">Next ${icon('arrowright', 14)}</button>`
        : `<button class="btn primary big caps-btn" id="tourNext">Let's grow!</button>`}
      </div>
    </div>`;
    const done = () => { kidSettings().toured = true; save(); back.remove(); };
    back.querySelector('#tourNext').onclick = () => { ti++; if (ti >= TOUR_STEPS.length) { sfx('cheer'); done(); } else paint(); };
    const sk = back.querySelector('#tourSkip'); if (sk) sk.onclick = done;
  };
  paint();
  document.body.appendChild(back);
}

// ============================================================
// PRACTICE (skill catalog)
// ============================================================
let PRACTICE_SUBJ = 'math';
const STAGE_OF = (s) => s >= 100 ? 'mastered!' : s >= 75 ? 'blooming' : s >= 50 ? 'growing' : s >= 25 ? 'sprouting' : 'new';
const STAGE_COLOR = (s) => s >= 100 ? 'var(--gold)' : s >= 75 ? '#F58BA4' : s >= 25 ? 'var(--green)' : 'var(--muted)';
function renderPractice() {
  const st = kidStats();
  const subs = activeSubjects();
  if (!subs.some(s => s.id === PRACTICE_SUBJ)) PRACTICE_SUBJ = 'math';
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));

  // app bar = page header (design 10a, per the full-width-bar rule)
  setAppbar(`
    <div class="hero-meta"><div class="hi">Practice</div>
      <p class="note" style="margin-top:0">Pick a garden bed and grow a skill</p></div>
    <span class="ab-spacer"></span>
    <span class="pill">${flameSVG(15)} ${streakDays()}</span>
    <span class="pill gold">${starSVG(15)} ${levelInfo().stars}</span>`);

  // 1 — subject chip row (counts inline; My Lessons dashed)
  const tabs = subs.map(sub => {
    const u = subjUI(sub.id);
    const skills = SKILLS.filter(s => strandSubject[s.strand] === sub.id);
    const done = skills.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    const active = sub.id === PRACTICE_SUBJ;
    return `<button class="subj-chip ${active ? 'active' : ''} ${sub.id === 'custom' ? 'dashed' : ''}" data-subj="${sub.id}"
      style="${active ? `background:${u.tint};border-color:${u.color};color:${u.dark}` : ''}">
      <span style="color:${u.color}">${icon(u.icon, 16)}</span> ${sub.name}
      <span class="cnt">${done}/${skills.length}</span>
    </button>`;
  }).join('');

  // 2 — "Keep growing" hero: most recently practiced unfinished skill
  const log = kidLog();
  let heroSkill = null;
  for (const day of Object.keys(log).sort().reverse()) {
    for (const sid of Object.keys(log[day].per || {})) {
      const sc = (st[sid] || { s: 0 }).s;
      if (SKILL_MAP[sid] && sc > 0 && sc < 100) { heroSkill = SKILL_MAP[sid]; break; }
    }
    if (heroSkill) break;
  }
  if (!heroSkill) heroSkill = SKILLS.map(s => ({ s, v: st[s.id] || { s: 0, a: 0 } })).filter(x => x.v.a > 0 && x.v.s < 100).sort((a, b) => b.v.s - a.v.s).map(x => x.s)[0] || null;
  const heroHTML = heroSkill ? (() => {
    const v = st[heroSkill.id] || { s: 0, c: 0 };
    const sub = SUBJECTS.find(x => x.id === strandSubject[heroSkill.strand]);
    const toBloom = Math.max(1, Math.ceil((75 - v.s) / 6));
    return `<div class="keep-hero">
      <span class="kh-plant">${plantSVG(v.s, 44)}</span>
      <span style="flex:1;min-width:0">
        <span class="eyebrow" style="color:var(--green)">Keep growing</span>
        <b class="kh-name">${esc(heroSkill.name)}</b>
        <p class="note">${sub ? esc(sub.name) : ''} · ${STAGE_OF(v.s)} · ${v.c || 0} correct so far${v.s < 75 ? ` — about ${toBloom} more to bloom` : ''}</p>
      </span>
      <button class="btn primary caps-btn" data-skill="${heroSkill.id}">Continue</button>
    </div>`;
  })() : '';

  // 3 — Extra sunshine
  const sunshine = `<div class="sunshine-card">
    <span class="subj-ico" style="width:40px;height:40px;background:var(--gold-tint);color:var(--gold)">${icon('zap', 19)}</span>
    <span style="flex:1;min-width:0"><b style="font-family:var(--font-head)">Extra sunshine</b>
      <div class="sun-chips">
        <button class="btn primary small" id="goMix">Daily Mix</button>
        ${SPRINT_DRILLS.map(d => `<button class="btn small ghost" data-sprint="${d.id}">${d.name}</button>`).join('')}
      </div></span>
  </div>`;

  // 4 — strand cards (wide strands span both columns)
  const cards = STRANDS.filter(x => x.subject === PRACTICE_SUBJ).map(strand => {
    const skills = SKILLS.filter(s => s.strand === strand.id);
    const attempted = skills.filter(s => (st[s.id] || { a: 0 }).a > 0);
    const avg = attempted.length ? Math.round(skills.reduce((sum, s) => sum + (st[s.id] || { s: 0 }).s, 0) / skills.length) : 0;
    const mastered = skills.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    const pct = skills.length ? Math.round(mastered / skills.length * 100) : 0;
    const su = subjUI(strand.subject);
    const wide = skills.length > 3;
    const rows = skills.map(s => {
      const v = st[s.id] || { s: 0, c: 0 };
      const isHero = heroSkill && s.id === heroSkill.id;
      return `<button class="skill-line ${isHero ? 'hot' : ''}" data-skill="${s.id}">
        <span class="sl-stage">${v.s < 25 && !(v.a > 0) ? '<span class="seed-dot"></span>' : plantSVG(v.s, 20)}</span>
        <span class="sl-name">${esc(s.name)}</span>
        <span class="sl-label" style="color:${STAGE_COLOR(v.s)}">${STAGE_OF(v.s)}${v.s >= 25 && v.s < 100 ? ` · ${v.c || 0}` : ''}</span>
        ${icon('right', 14, 'sl-chev')}
      </button>`;
    }).join('');
    return `<div class="strand-card ${wide ? 'wide' : ''}">
      <div class="strand-top">
        <span class="subj-ico" style="width:34px;height:34px;background:${su.tint}">${strand.emoji}</span>
        <h3>${esc(strand.name)}</h3>
        ${attempted.length ? `<span class="pill" style="font-size:11px;padding:4px 10px;color:var(--green);background:var(--green-tint);border-color:var(--green-tint)">${avg} avg</span>` : ''}
        <button class="btn small learn-pill" data-learnpath="${strand.id}">${icon('bulb', 13)} Learn</button>
      </div>
      <span class="strand-bar"><i style="width:${pct}%"></i></span>
      <div class="${wide ? 'skill-cols' : ''}">${rows}</div>
    </div>`;
  }).join('');

  const legend = `<div class="stage-legend">
    <span><span class="seed-dot"></span> new</span> ${icon('arrowright', 11)}
    <span>${plantSVG(30, 16)} sprouting</span> ${icon('arrowright', 11)}
    <span>${plantSVG(55, 16)} growing</span> ${icon('arrowright', 11)}
    <span>${plantSVG(80, 16)} blooming</span> ${icon('arrowright', 11)}
    <span>${plantSVG(100, 16)} <b style="color:var(--gold)">mastered!</b></span>
  </div>`;

  app.innerHTML = `<div class="reveal">
    <div class="subj-chip-row">${tabs}</div>
    <div class="practice-hero-row">${heroHTML}${sunshine}</div>
    <div class="strand-grid">${cards}</div>
    ${legend}
  </div>`;
  $('#goMix').onclick = startMix;
  $$('[data-sprint]').forEach(b => b.onclick = () => startSprint(b.dataset.sprint));
  $$('[data-subj]').forEach(b => b.onclick = () => { PRACTICE_SUBJ = b.dataset.subj; renderPractice(); });
  $$('[data-skill]').forEach(b => b.onclick = () => show('session', b.dataset.skill));
  $$('[data-learnpath]').forEach(b => b.onclick = () => show('learnpath', b.dataset.learnpath));
  upgradeSayButtons(app);
}

// ============================================================
// PRACTICE SESSION (the question loop)
// ============================================================
let SESSION = null;
function sessionShell(title, backView, tileHTML = '') {
  $('#tabbar').style.display = 'none'; // focused mode — no bottom nav
  setAppbar(`
    <button class="back" id="backBtn" aria-label="Done">${icon('left', 19)}</button>
    ${tileHTML}
    <div class="title" id="sessTitle">${title}</div>
    <span class="type-progress" style="max-width:240px"><i id="sessBar" style="background:var(--green)"></i></span>
    <span id="sessCount" style="font-weight:700;font-size:12.5px;color:var(--soft);white-space:nowrap"></span>
    <div class="scorebox" id="scorebox"><span class="plant" id="plantIcon"></span><span class="num" id="scoreNum"></span></div>`);
  app.innerHTML = `
    <div class="session-stage"><div class="card qcard" id="qcard"></div></div>
    <div class="mascot" id="mascot"><span class="fox">${foxSVG(42, "talk")}</span><span class="say" id="mascotSay" style="display:none"></span></div>
    <span class="g-chip water-chip" id="waterChip"></span>`;
  $('#backBtn').onclick = () => show(backView);
  window.scrollTo(0, 0);
}

// 3b: bottom-right "Today's water" drops = plan tasks done today
function updateWaterChip() {
  updateAppBadge();
  const el = $('#waterChip');
  if (!el) return;
  const goal = kidSettings().schoolGoal;
  const plan = getWeekPlan();
  const dow = (new Date().getDay() + 6) % 7;
  if (dow > 4) { el.style.display = 'none'; return; }
  const core = (plan[dow] || []).filter(sid => SKILL_MAP[sid]).slice(0, goal);
  const done = core.filter(t => taskDoneToday(t)).length;
  el.innerHTML = `Today's water&nbsp; ${core.map((_, i) =>
    `<span style="opacity:${i < done ? 1 : .3}">${dropSVG(15)}</span>`).join('')}`;
}

function mascotSay(msg) {
  const el = $('#mascotSay');
  if (!el) return;
  if (!msg) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.textContent = msg;
}

function renderSession(skillId, guided) {
  const sk = SKILL_MAP[skillId];
  if (!sk) return show('practice');
  const strand = STRANDS.find(x => x.id === sk.strand) || {};
  // Computer skills get the full keyboard experience (7a); reading gets the story reader (6b)
  if (sk.strand === 'handwriting' && typeof renderHandwritingSession === 'function') return renderHandwritingSession(sk);
  if (strand.subject === 'typing' && strand.engine !== 'standard' && typeof renderTypingSession === 'function') return renderTypingSession(sk);
  if (sk.strand === 'reading' && typeof renderStoryReader === 'function') return renderStoryReader(sk);
  // guided = arriving from a Learn lesson: 2 "Water it" warmups first (nothing recorded)
  TT.ctx = sk.id;
  SESSION = { skill: sk, streak: 0, answered: false, guidedIntro: guided ? 2 : 0, guidedRun: !!guided };
  const u = subjUI(strand.subject || 'custom');
  sessionShell(`${strand.name ? strand.name + ' · ' : ''}${sk.name}`, 'practice',
    `<span class="subj-ico" style="width:34px;height:34px;background:${u.tint};color:${u.color}">${icon(u.icon, 17)}</span>`);
  nextQuestion();
}

// shared engine for Daily Mix (mastery ON) and checkups (mastery OFF)
function startQueueSession(cfg) {
  SESSION = {
    queue: cfg.queue, qi: 0, right: 0, diag: !!cfg.diag, subject: cfg.subject,
    diagResults: {}, streak: 0, answered: false,
  };
  VIEW = 'session';
  sessionShell(cfg.title, cfg.diag ? 'today' : 'today');
  nextQuestion();
}

function updateScorebox() {
  if (SESSION.diag) {
    $('#plantIcon').innerHTML = icon('stetho', 18);
    $('#scoreNum').textContent = `${Math.min(SESSION.qi, SESSION.queue.length)}/${SESSION.queue.length}`;
    return;
  }
  // 3b: top-right shows today's water (plan tasks done)
  const goal = kidSettings().schoolGoal;
  const dow = (new Date().getDay() + 6) % 7;
  const planToday = dow > 4 ? [] : (getWeekPlan()[dow] || []).filter(sid => SKILL_MAP[sid]).slice(0, goal);
  const waterDone = planToday.filter(t => taskDoneToday(t)).length;
  $('#plantIcon').innerHTML = `<span style="color:var(--water)">${icon('droplet', 17)}</span>`;
  $('#scoreNum').textContent = waterDone;
  const sc = skillStat(SESSION.skill.id).s;
  // fox mascot cheers toward today's "done" mark for this skill
  const day = kidLog()[dstr()];
  const doneQ = day && day.per[SESSION.skill.id] ? day.per[SESSION.skill.id][1] : 0;
  const left = SKILL_DONE_Q - doneQ;
  // 3b top-bar progress: questions toward today's check for this skill
  const bar = $('#sessBar'), cnt = $('#sessCount');
  if (bar) bar.style.width = `${Math.min(100, (doneQ / SKILL_DONE_Q) * 100)}%`;
  if (cnt) cnt.textContent = `${Math.min(doneQ, SKILL_DONE_Q)} of ${SKILL_DONE_Q}`;
  updateWaterChip();
  if (sc >= 100) mascotSay('This one is a golden daisy — you own it! 🌼');
  else if (left === 1) mascotSay('One more and this one counts for today!');
  else if (left > 1 && left < SKILL_DONE_Q) mascotSay(`${left} more and this skill gets watered!`);
  else if (sc >= 75) mascotSay('So close to blooming — keep going!');
  else mascotSay('');
}

// strip HTML to speakable text (drops buttons, svgs, inputs)
function speakableText(html) {
  if (!html) return '';
  const d = document.createElement('div');
  d.innerHTML = html;
  d.querySelectorAll('button, input, svg, select').forEach(el => el.remove());
  return d.textContent.replace(/\s+/g, ' ').trim();
}

function nextQuestion() {
  clearTimeout(SESSION.autoT);
  if ('speechSynthesis' in window) speechSynthesis.cancel(); // stop any leftover reading
  let diagCheer = '';
  if (SESSION.queue) {
    if (SESSION.qi >= SESSION.queue.length) {
      return SESSION.diag ? renderDiagResults() : renderMixRecap();
    }
    if (SESSION.diag) {
      const L = SESSION.queue.length;
      if (SESSION.qi === Math.ceil(L / 3)) diagCheer = "You're doing great — keep going!";
      else if (SESSION.qi === Math.ceil(2 * L / 3)) diagCheer = 'Almost there — home stretch!';
      if (diagCheer) speak(diagCheer, 'en');
    }
    SESSION.skill = SKILL_MAP[SESSION.queue[SESSION.qi++]];
    const t = $('#sessTitle');
    if (t) t.textContent = (SESSION.diag ? 'Checkup · ' : 'Mix · ') + SESSION.skill.name;
  }
  const lvl = SESSION.diag ? 2 : SESSION.guidedIntro > 0 ? 1 : difficultyFor(SESSION.skill.id);
  const q = SESSION.skill.gen(lvl);
  SESSION.q = q; SESSION.answered = false; SESSION.retried = false;
  TT.ctx = SESSION.skill.id;
  if (SESSION.guidedRun) {
    const t = $('#sessTitle');
    if (t) t.textContent = `${SESSION.guidedIntro > 0 ? 'Together' : 'On your own'} · ${SESSION.skill.name}`;
  }
  updateScorebox();
  const card = $('#qcard');
  const levelPill = (SESSION.skill.adaptive && !SESSION.diag)
    ? `<div style="text-align:center;margin-bottom:6px;font-weight:800;font-size:13px;color:var(--ink-soft)">
        Challenge ${'●'.repeat(lvl)}${'○'.repeat(3 - lvl)} ${lvl === 1 ? 'warming up' : lvl === 2 ? 'on level' : 'stretch!'}</div>`
    : '';
  let answerUI = '';
  if (q.type === 'picture') {
    answerUI = `<div class="audio-row">
      <button class="btn big audio-pill" id="sayBig">${icon('volume', 18)} ${esc(q.say)}</button>
      <button class="btn small ghost" id="saySlow">${icon('volume', 13)} Slower</button>
    </div>
    <div class="pic-cards">${q.cards.map(c =>
      `<button class="pic-card choice" data-c="${escAttr(c.label)}">
        <span class="pic">${c.pic}</span><span class="pic-label">${esc(c.label)}</span>
      </button>`).join('')}</div>`;
  } else if (q.type === 'mc') {
    // long answers get wider cards (2-up or full-width) so text never crams
    const maxLen = Math.max(...q.choices.map(c => String(c).length));
    const cls = maxLen > 42 ? 'one-col' : maxLen > 11 ? 'two-col' : q.choices.length === 2 ? 'two' : '';
    answerUI = `<div class="choices ${cls}">${q.choices.map(c =>
      `<button class="choice" data-c="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>`;
  } else if (q.type === 'num') {
    answerUI = `<div class="answer-row">
      <input class="num-input" id="numIn" inputmode="numeric" autocomplete="off">
      ${q.suffix ? `<span style="font-family:var(--font-display);font-size:30px;align-self:center;font-weight:600">${q.suffix}</span>` : ''}
      <button class="btn primary big" id="checkBtn">Check ✓</button>
    </div>`;
  } else if (q.type === 'text') {
    answerUI = `<div class="answer-row">
      <input class="num-input" id="numIn" style="width:260px" autocomplete="off" autocapitalize="none" spellcheck="false">
      <button class="btn primary big" id="checkBtn">Check ✓</button>
    </div>`;
  }
  card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  card.innerHTML = `
    ${diagCheer ? `<div class="cheer-strip pop">${owlSVG(30)}<b>${diagCheer}</b></div>` : ''}
    ${levelPill}
    <div style="text-align:${SESSION.diag ? 'center' : 'right'};margin-bottom:4px">
      <button class="btn small sunny" id="readBtn" title="Read it out loud">${icon('volume', 14)} Read it to me</button>
    </div>
    <div class="qprompt">${q.prompt}</div>
    ${q.body ? `<div class="qbody">${q.body}</div>` : ''}
    ${q.body && q.body.includes('vertical-math') ? '<p class="note" style="text-align:center;margin-top:6px">📝 Work it out on paper first — then type your answer!</p>' : ''}
    ${answerUI}
    <div id="fb"></div>`;

  $('#readBtn').onclick = () => {
    if ('speechSynthesis' in window && speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
    let text = speakableText(q.prompt);
    const bodyText = q.body && !q.body.includes('<svg') ? speakableText(q.body) : '';
    if (bodyText) text += '. ' + bodyText;
    if (q.type === 'mc') text += '. Your choices are: ' + q.choices.map(c => speakableText(String(c))).join(', ... ');
    speak(text, 'en');
  };

  upgradeSayButtons(card);
  if (q.type === 'picture') {
    $$('.pic-card', card).forEach(b => b.onclick = () => grade(b.dataset.c, b));
    $('#sayBig').onclick = () => speak(q.say);
    $('#saySlow').onclick = () => {
      const u = new SpeechSynthesisUtterance(q.say);
      u.lang = 'es-ES'; const v = pickVoice('es-ES'); if (v) u.voice = v;
      u.rate = 0.5; speechSynthesis.cancel(); speechSynthesis.speak(u);
    };
    setTimeout(() => speak(q.say), 350); // audio-first: hear it right away
  } else if (q.type === 'mc') {
    $$('.choice', card).forEach(b => b.onclick = () => grade(b.dataset.c, b));
  } else if (q.type === 'num' || q.type === 'text') {
    const inp = $('#numIn');
    const check = () => { if (inp.value.trim() !== '') grade(inp.value); };
    $('#checkBtn').onclick = check;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    inp.focus();
  } else if (q.type === 'line') {
    $$('.nl-tick', card).forEach(t => t.addEventListener('click', () => {
      if (SESSION.answered) return;
      t.classList.add('picked');
      grade(t.dataset.val);
    }));
  }
}

function grade(given, btn) {
  if (SESSION.answered) return;
  SESSION.answered = true;
  const q = SESSION.q;
  const sk = SESSION.skill;
  let correct;
  if (q.type === 'num' || q.type === 'line') {
    correct = Number(String(given).replace(/[,\s]/g, '')) === Number(q.answer);
  } else if (q.type === 'text') {
    correct = q.exact
      ? String(given).trim() === String(q.answer).trim()
      : String(given).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  } else {
    correct = String(given) === String(q.answer);
  }

  // ---- hint ladder (Khan-style, practice only): first miss = owl hint +
  // another try; only the SECOND resolution counts. Checkups measure, so
  // they skip the ladder entirely — never scaffold during measurement.
  if (!correct && !SESSION.diag && !SESSION.retried) {
    SESSION.retried = true;
    SESSION.answered = false;
    sfx('wrong');
    if (q.type === 'mc' || q.type === 'picture') {
      if (btn) { btn.classList.add('wrong'); btn.disabled = true; }
    } else if (q.type === 'num' || q.type === 'text') {
      const inp = $('#numIn');
      if (inp) { inp.style.background = 'var(--bad-bg)'; inp.select(); }
    } else if (q.type === 'line') {
      $$('.nl-tick.picked').forEach(t => t.classList.remove('picked'));
    }
    const hint = q.hint || {
      mc: 'read the question one more time, then try a different answer.',
      picture: 'listen to the word again, then tap a different card.',
      num: 'try it on paper first, then type your new answer.',
      text: 'sound it out slowly, check your spelling, and try again.',
      line: 'count the ticks one by one, then tap again.',
    }[q.type] || 'take another look and try once more.';
    const fbEl = $('#fb');
    fbEl.innerHTML = `<div class="fb-row hint pop">
      <span class="fb-owl">${owlSVG(34)}</span>
      <span class="fb-text"><b>${pick(['Not quite —', 'Almost —', 'Good thinking, but not that one —'])}</b> ${hint}</span>
      <button class="icon-btn" id="readHint" style="width:34px;height:34px;flex:none" title="Read it out loud">${icon('volume', 15)}</button>
    </div>`;
    $('#readHint').onclick = () => speak(speakableText(hint), 'en');
    return;
  }

  if (SESSION.queue && correct) SESSION.right++;

  let cur = { s: 0 }, before = 0;
  if (SESSION.diag) {
    // checkups measure — they don't move mastery or the daily log
    const r = SESSION.diagResults[sk.strand] = SESSION.diagResults[sk.strand] || [0, 0];
    r[1]++; if (correct) r[0]++;
  } else if (SESSION.guidedIntro > 0) {
    // "Water it" warmups after a lesson — mistakes teach, nothing is recorded
    SESSION.guidedIntro--;
    if (correct) SESSION.streak++;
    sfx(correct ? 'correct' : 'wrong');
  } else {
    // ---- update mastery score ----
    const st = kidStats();
    cur = st[sk.id] || { s: 0, a: 0, c: 0 };
    before = cur.s;
    if (correct) {
      SESSION.streak++;
      let delta = cur.s < 50 ? 8 : cur.s < 80 ? 6 : 4;
      if (SESSION.streak >= 3) delta += 1;
      if (SESSION.retried) delta = Math.max(2, Math.ceil(delta / 2)); // needed a hint → smaller step up
      cur.s = Math.min(100, cur.s + delta);
      cur.c++;
    } else {
      SESSION.streak = 0;
      cur.s = Math.max(0, cur.s - Math.min(6, 2 + Math.floor(cur.s / 25)));
    }
    cur.a++;
    st[sk.id] = cur;

    // ---- daily log ----
    const log = kidLog();
    const today = dstr();
    const day = log[today] || { t: 0, c: 0, per: {} };
    day.t++; if (correct) day.c++;
    day.per[sk.id] = day.per[sk.id] || [0, 0];
    day.per[sk.id][1]++; if (correct) day.per[sk.id][0]++;
    log[today] = day;
    save();

    // ---- sounds & growth moments ----
    const stageOf = (s) => s >= 100 ? 4 : s >= 75 ? 3 : s >= 50 ? 2 : s >= 25 ? 1 : 0;
    if (correct && stageOf(cur.s) > stageOf(before)) sfx('grow');
    else if (day.per[sk.id][1] === SKILL_DONE_Q) sfx('water'); // skill just counted for today
    else sfx(correct ? 'correct' : 'wrong');
  }
  if (SESSION.diag) sfx(correct ? 'correct' : 'wrong');
  updateScorebox();

  // ---- visual feedback ----
  if (q.type === 'mc' || q.type === 'picture') {
    $$('.choice').forEach(b => {
      b.disabled = true;
      if (b.dataset.c === String(q.answer)) b.classList.add('right');
      else if (b === btn && !correct) b.classList.add('wrong');
    });
  } else if (q.type === 'num' || q.type === 'text') {
    $('#numIn').disabled = true; $('#checkBtn').disabled = true;
    $('#numIn').style.background = correct ? 'var(--ok-bg)' : 'var(--bad-bg)';
  }

  const fb = $('#fb');
  const praise = pick(['Way to go!', 'You got it!', 'Super!', 'Amazing!', 'High five!', 'Brains blooming!', 'Nailed it!']);
  const oops = pick(['Almost!', 'Good try!', 'So close!', 'Keep growing!']);
  const answerShown = q.type === 'num' || q.type === 'line'
    ? `${q.answer}${q.suffix || ''}` : q.answer;
  let guidedNote = '';
  if (SESSION.guidedRun && SESSION.guidedIntro === 0 && !SESSION.guidedDone) {
    SESSION.guidedDone = true;
    guidedNote = `<div class="fb-row hint pop" style="margin-top:8px"><span class="fb-owl">${owlSVG(30)}</span>
      <span class="fb-text"><b>Warm-ups done!</b> Now you try on your own — these next ones water your garden for real.</span></div>`;
  }
  fb.innerHTML = `${guidedNote}<div class="fb-row ${correct ? 'good' : 'bad'} pop">
      <span class="fb-tile" style="background:${correct ? 'var(--green)' : 'var(--gold)'}">${icon(correct ? 'star' : 'bulb', 17)}</span>
      <span class="fb-text"><b>${correct ? praise : oops + ` The answer is ${answerShown}.`}</b> ${q.explain || ''}</span>
      ${q.say ? `<button class="btn small ghost" id="sayWithMe" style="flex:none;white-space:nowrap">${icon('volume', 13)} Say it with me</button>` : ''}
      <button class="icon-btn" id="readFb" style="width:34px;height:34px;flex:none" title="Read it out loud">${icon('volume', 15)}</button>
      <button class="btn ${correct ? 'primary' : 'sunny'} caps-btn" id="nextBtn" style="flex:none">Next ${icon('arrowright', 14)}</button>
    </div>`;
  const swm = $('#sayWithMe');
  if (swm) swm.onclick = () => {
    const u = new SpeechSynthesisUtterance(q.say);
    u.lang = 'es-ES'; const v = pickVoice('es-ES'); if (v) u.voice = v;
    u.rate = 0.55; speechSynthesis.cancel(); speechSynthesis.speak(u);
  };
  $('#readFb').onclick = () => {
    if ('speechSynthesis' in window && speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
    const head = correct ? praise : `Almost! The answer is ${speakableText(String(answerShown))}.`;
    speak(head + ' ' + speakableText(q.explain || ''), 'en');
  };
  $('#nextBtn').onclick = nextQuestion;
  $('#nextBtn').focus();

  if (correct) {
    if (!SESSION.diag) burst(SESSION.streak >= 3 ? 34 : 18);
    if (!SESSION.diag && cur.s >= 100 && before < 100) return masteredBanner();
    // gentle auto-advance so fast kids keep momentum
    const thisQ = q;
    SESSION.autoT = setTimeout(() => { if (SESSION.q === thisQ && SESSION.answered) nextQuestion(); }, 1600);
  }
}

function masteredBanner() {
  sfx('cheer');
  burst(90, true);
  const sk = SESSION.skill;
  $('#qcard').innerHTML = `<div class="mastered-banner">
    <span class="flower">🌻</span>
    <h2>SUNFLOWER GROWN!</h2>
    <p style="font-weight:800;font-size:18px;margin:8px 0 22px">You mastered <b>${sk.name}</b>! It's blooming in your garden forever.</p>
    <div class="answer-row">
      <button class="btn primary big" id="keepBtn">Keep practicing 🌱</button>
      <button class="btn sunny big" id="gardenBtn">Back to my garden</button>
    </div>
  </div>`;
  $('#keepBtn').onclick = nextQuestion;
  $('#gardenBtn').onclick = () => show('practice');
}

// ============================================================
// WEEKLY PLAN
// ============================================================
function renderPlan() {
  const plan = getWeekPlan();
  const dow = (new Date().getDay() + 6) % 7;
  const mon = mondayOf();
  const focus = focusSet();
  const goal = kidSettings().schoolGoal;
  const days = plan.map((tasks, i) => {
    const dayDate = new Date(mon); dayDate.setDate(mon.getDate() + i);
    const ds = dstr(dayDate);
    const isToday = i === dow, isPast = i < dow, isFuture = i > dow;
    const shown = tasks.slice(0, goal);
    const done = shown.filter(t => {
      const day = kidLog()[ds];
      return (day && day.per[t] && day.per[t][1] >= SKILL_DONE_Q) || skillStat(t).s >= 100;
    }).length;
    const rows = shown.map(sid => {
      const sk = SKILL_MAP[sid];
      const subjId = subjectOfSkill(sid);
      const u = subjUI(subjId);
      const day = kidLog()[ds];
      const isDone = (day && day.per[sid] && day.per[sid][1] >= SKILL_DONE_Q) || skillStat(sid).s >= 100;
      return `<button class="plan-task ${isDone ? 'done' : ''}" data-skill="${sid}" ${isFuture ? 'disabled style="opacity:.7"' : ''}>
        <span class="chk">${icon('check', 12)}</span>
        <span style="flex:1;min-width:0;text-align:left">
          <span class="t-name" style="font-size:12px">${focus.has(sid) ? '🎯 ' : ''}${sk.name}</span>
          <span class="eyebrow" style="font-size:9px;color:${u.color}">${(SUBJECTS.find(s => s.id === subjId) || {}).name || ''}</span>
        </span>
      </button>`;
    }).join('');
    return `<div class="plan-day ${isToday ? 'today-day' : isPast ? 'past-day' : 'future-day'}">
      ${isToday ? '<span class="today-flag">TODAY</span>' : ''}
      <div class="day-head"><span class="dn">${DAY_NAMES[i]}</span>
        <span class="prog">${done}/${shown.length}</span></div>
      ${rows}
      ${isToday && done < shown.length ? `<div style="padding:8px 10px 12px"><button class="btn primary small" data-keepgoing style="width:100%">Keep going ${icon('arrowright', 13)}</button></div>` : ''}
    </div>`;
  }).join('');
  app.innerHTML = `<div class="reveal">
    <div style="margin:2px 4px 14px">
      <div class="eyebrow">This week</div>
      <h2 style="font-family:var(--font-head);font-weight:800;font-size:21px">${esc(kid().name)}'s garden plan</h2>
      <p class="note">A fresh plan sprouts every Monday — ${goal} skills a school day. A skill checks off after ${SKILL_DONE_Q} questions.</p>
    </div>
    <div class="week-grid">
      ${days}
      <div class="weekend-strip">🎈 Saturday & Sunday are <b>explore days</b> — free practice, Daily Mixes, and rest. Weekends never break a streak.</div>
    </div>
  </div>`;
  $$('[data-skill]').forEach(b => { if (!b.disabled) b.onclick = () => show('session', b.dataset.skill); });
  const kg = $('[data-keepgoing]');
  if (kg) kg.onclick = () => {
    const next = plan[dow].slice(0, goal).find(t => !taskDoneToday(t));
    if (next) show('session', next); else show('today');
  };
}

// ============================================================
// PROGRESS
// ============================================================
function renderProgress() {
  const st = kidStats();
  const log = kidLog();
  const totalQ = Object.values(log).reduce((s, d) => s + d.t, 0);
  const totalC = Object.values(log).reduce((s, d) => s + d.c, 0);
  const acc = totalQ ? Math.round((totalC / totalQ) * 100) : 0;
  const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
  const streak = streakDays();
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));

  // this week vs last week
  const mon = mondayOf();
  const weekTotals = (offsetWeeks) => {
    let t = 0, c = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() - offsetWeeks * 7 + i);
      const e = log[dstr(d)];
      if (e) { t += e.t; c += e.c; }
    }
    return { t, c };
  };
  const thisW = weekTotals(0), lastW = weekTotals(1);
  const accW = (w) => w.t ? Math.round((w.c / w.t) * 100) : 0;
  let improveMsg = 'Practice a little every day and watch this grow!';
  if (lastW.t >= 10 && thisW.t >= 10) {
    const d = accW(thisW) - accW(lastW);
    improveMsg = d > 2 ? `📈 Accuracy is UP ${d} points from last week — amazing growth!`
      : d < -2 ? `💪 Accuracy dipped ${-d} points from last week — a little extra watering will fix that!`
      : `Accuracy is steady vs last week (${accW(thisW)}%). Keep it up!`;
  }

  const cols = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const e = log[dstr(d)] || { t: 0, c: 0 };
    return { label: ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'][i], t: e.t };
  });
  const maxT = Math.max(...cols.map(c => c.t), 10);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const chart = cols.map((c, i) => `<div class="col ${i === todayIdx ? 'today-col' : ''}">
      <span class="cv">${c.t || ''}</span>
      <div class="bar-v" style="height:${(c.t / maxT) * 100}%"></div>
      <span class="cl">${c.label}</span>
    </div>`).join('');

  // collapsible garden health — one group per subject, first one open
  const groups = activeSubjects().map((sub, gi) => {
    const u = subjUI(sub.id);
    const subSkills = SKILLS.filter(s => strandSubject[s.strand] === sub.id);
    const avg = Math.round(subSkills.reduce((sum, s) => sum + (st[s.id] || { s: 0 }).s, 0) / subSkills.length);
    const mastered = subSkills.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    const rows = STRANDS.filter(x => x.subject === sub.id).map(strand => {
      const skills = SKILLS.filter(s => s.strand === strand.id);
      const sAvg = Math.round(skills.reduce((sum, s) => sum + (st[s.id] || { s: 0 }).s, 0) / skills.length);
      return `<div class="row">
        <span class="lbl">${strand.name}</span>
        <span class="track"><span class="fill" style="width:${sAvg}%;background:${u.color}"></span></span>
        <span class="val">${plantSVG(sAvg, 20)}</span>
      </div>`;
    }).join('');
    return `<details class="prog-group" ${gi === 0 ? 'open' : ''}>
      <summary>${subjTile(sub.id, 36, 18)}
        <b>${sub.name}</b>
        <span class="pg-meta">${mastered}/${subSkills.length} mastered · ${avg} avg</span>
        ${icon('right', 16, 'pg-chev')}
      </summary>
      <div class="prog-bars" style="padding:6px 2px 12px">${rows}</div>
    </details>`;
  }).join('');

  const badges = getBadges().map(b => `<div class="badge ${b.got ? '' : 'locked'}"><div class="bi">${b.bi}</div><div class="bn">${b.bn}</div></div>`).join('');

  app.innerHTML = `<div class="reveal">
    <div style="margin:2px 4px 14px">
      <div class="eyebrow">Progress</div>
      <h2 style="font-family:var(--font-head);font-weight:800;font-size:21px">${esc(kid().name)}'s growing report</h2>
    </div>
    <div class="stat-row" style="margin-bottom:16px">
      <div class="stat-tile"><div class="v">${totalQ}</div><div class="l">questions ever</div></div>
      <div class="stat-tile"><div class="v">${acc}%</div><div class="l">correct overall</div></div>
      <div class="stat-tile"><div class="v" style="color:var(--terra)">${flowers}</div><div class="l">of ${SKILLS.length} mastered</div></div>
      <div class="stat-tile"><div class="v" style="color:var(--gold)">${streak}</div><div class="l">day streak</div></div>
    </div>
    <div class="today-grid" style="align-items:start">
      <div class="card" style="margin-bottom:0">
        <h2>This week</h2>
        <div class="week-chart">${chart}</div>
        <p style="font-weight:700;text-align:center;margin-top:10px;font-size:13px">${improveMsg}</p>
        <p class="note" style="text-align:center">This week: ${thisW.t} questions, ${accW(thisW)}% right · Last week: ${lastW.t} questions, ${accW(lastW)}% right</p>
      </div>
      <div class="card" style="margin-bottom:0">
        <h2>Garden health <span class="note" style="font-weight:600;margin-left:auto">tap a subject to open</span></h2>
        ${groups}
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <h2>Sticker book</h2>
      <div class="badge-grid">${badges}</div>
    </div>
  </div>`;
}

// ============================================================
// HOMEWORK HELPER
// ============================================================
let HELPER_TAB = 'home';
function renderHelper() {
  app.innerHTML = `<div class="reveal">
    <div class="tutor-hero">
      ${owlSVG(46)}
      <span><b>Tutor Owl</b>
      <p>A real tutor doesn't hand you answers — it asks you the right questions. Wrong answers get a hint first, so you always get a second try.</p></span>
    </div>
    <div class="helper-tabs">
      <button data-t="home">${icon('gradcap', 15)} Start</button>
      <button data-t="tutor">${icon('calculator', 15)} Math</button>
      <button data-t="wizard">${icon('book', 15)} Word problems</button>
      <button data-t="words">${icon('pencil', 15)} Tricky words</button>
      <button data-t="homework">${icon('camera', 15)} My homework</button>
      <button data-t="cheats">${icon('clipboard', 15)} Cheat sheets</button>
    </div>
    <div class="card" id="helperBody"></div>
  </div>`;
  $$('.helper-tabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.t === HELPER_TAB);
    b.onclick = () => { helperStopRec(); HELPER_TAB = b.dataset.t; renderHelper(); };
  });
  ({ home: renderTutorHome, tutor: renderTutorTab, wizard: renderWizardTab, words: renderWordHelperTab, homework: renderHomeworkHelper, cheats: renderCheats })[HELPER_TAB]();
}

function renderCheats() {
  // 9d: icon rows instead of tables — tinted icon square, clue words, colored tag
  const row = (ic, color, tint, text, tag, tagColor) => `
    <div class="cheat-row">
      <span class="cheat-ico" style="background:${tint};color:${color}">${ic}</span>
      <span>${text}</span>
      <span class="cheat-tag" style="color:${tagColor || color}">${tag}</span>
    </div>`;
  const coin = (val, color, tint, text, tag) => `
    <div class="cheat-row">
      <span class="coin-badge" style="border-color:${color};color:${color};background:${tint}">${val}</span>
      <span>${text}</span>
      <span class="cheat-tag" style="color:${color}">${tag}</span>
    </div>`;
  const doubles = ['1+1=2', '2+2=4', '3+3=6', '4+4=8', '5+5=10', '6+6=12', '7+7=14', '8+8=16', '9+9=18', '10+10=20'];
  $('#helperBody').innerHTML = `
    <div class="cheat-head">
      <p class="eyebrow" style="color:var(--gold)">Cheat sheets — clue words</p>
      <button class="btn small ghost" id="cheatPrint" style="margin-left:auto">${icon('printer', 14)} print</button>
    </div>
    <div class="cheat-rows">
      ${row(icon('plus', 16), 'var(--green)', 'var(--green-tint)', `"in all" · "altogether" · "total" · "both"`, 'add')}
      ${row(icon('minus', 16), 'var(--terra)', 'var(--terra-tint)', `"left" · "fewer" · "gave away" · "take away"`, 'subtract')}
      ${row(icon('minus', 16), 'var(--terra)', 'var(--terra-tint)', `"how many more" · "difference" — compare two amounts`, 'subtract')}
      ${row(icon('equal', 16), 'var(--blue)', 'var(--blue-tint)', `"is the same as" · "equals" · "makes"`, 'equals')}
      ${row(icon('clock', 16), 'var(--gold)', 'var(--gold-tint)', `"how much later" · "elapsed" — count up on the clock`, 'time')}
      ${row(icon('grid', 16), 'var(--purple)', 'var(--purple-tint)', `"each" · "rows of" · "bags of" — equal groups`, 'add again & again')}
    </div>
    <div class="cheat-head"><p class="eyebrow" style="color:var(--gold)">Money</p></div>
    <div class="cheat-rows">
      ${coin('1¢', 'var(--terra)', 'var(--terra-tint)', `<b>Penny</b> — copper color, smallest value`, '1¢')}
      ${coin('5¢', 'var(--muted)', 'var(--divider)', `<b>Nickel</b> — the chunky one`, '5¢')}
      ${coin('10¢', 'var(--blue)', 'var(--blue-tint)', `<b>Dime</b> — tiniest coin, worth MORE than a nickel!`, '10¢')}
      ${coin('25¢', 'var(--gold)', 'var(--gold-tint)', `<b>Quarter</b> — 4 quarters = $1`, '25¢')}
    </div>
    <div class="cheat-head"><p class="eyebrow" style="color:var(--gold)">Clock</p></div>
    <div class="cheat-rows">
      ${row(icon('clock', 16), 'var(--blue)', 'var(--blue-tint)', `The <b>SHORT</b> hand tells the hour`, 'hour')}
      ${row(icon('clock', 16), 'var(--blue)', 'var(--blue-tint)', `The <b>LONG</b> hand tells minutes — skip count by 5s!`, 'minutes')}
      ${row(icon('clock', 16), 'var(--blue)', 'var(--blue-tint)', `Long hand on the <b>12</b> → o'clock`, ':00')}
      ${row(icon('clock', 16), 'var(--blue)', 'var(--blue-tint)', `Long hand on the <b>6</b> → half past`, ':30')}
    </div>
    <div class="cheat-head"><p class="eyebrow" style="color:var(--gold)">Place value — take 347</p></div>
    <div class="cheat-rows">
      ${row('<b style="font-size:15px">3</b>', 'var(--terra)', 'var(--terra-tint)', `3 hundreds`, '= 300')}
      ${row('<b style="font-size:15px">4</b>', 'var(--gold)', 'var(--gold-tint)', `4 tens`, '= 40')}
      ${row('<b style="font-size:15px">7</b>', 'var(--teal)', 'var(--teal-tint)', `7 ones`, '= 7')}
    </div>
    <div class="cheat-head"><p class="eyebrow" style="color:var(--gold)">Doubles facts — super powers!</p></div>
    <div class="fact-pills">${doubles.map(d => `<span class="fact-pill">${d}</span>`).join('')}</div>`;
  $('#cheatPrint').onclick = () => window.print();
}

// ============================================================
// GROWN-UPS CORNER
// ============================================================
function renderGrownups() {
  DB.settings.reminders = DB.settings.reminders || { nudge: true, streakAlert: true, recap: false };
  const rem = DB.settings.reminders;
  const wk = weekKey();
  const mon = mondayOf();

  // ---- per-kid stats ----
  const kidRows = DB.kids.map(k => {
    const st = kidStats(k.id);
    const log = DB.log[k.id] || {};
    let wkT = 0, wkC = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const e = log[dstr(d)]; if (e) { wkT += e.t; wkC += e.c; }
    }
    const acc = wkT ? Math.round(wkC / wkT * 100) : 0;
    const mastered = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    return `<div class="kid-stat-row">
      <span class="kid-face">${avatarFace(k.avatar, 36)}</span>
      <span class="kid-id"><b>${esc(k.name)}</b><small>Grade ${k.grade || 2}</small></span>
      <span class="kstat"><b>${streakDays(k.id)}</b><small>streak</small></span>
      <span class="kstat"><b>${wkT}</b><small>this week</small></span>
      <span class="kstat"><b style="color:var(--green)">${acc}%</b><small>correct</small></span>
      <span class="kstat"><b style="color:var(--terra)">${mastered}</b><small>mastered</small></span>
      <button class="btn sky small" data-report="${k.id}">Weekly report</button>
      <button class="btn small ghost" data-reset="${k.id}" title="Reset progress">Reset</button>
      <button class="btn small ghost" data-del="${k.id}" title="Remove kid">✕</button>
    </div>`;
  }).join('') || '<p class="note">No kids yet — add one to plant the first garden.</p>';

  // ---- "this week in 10 seconds" — glance stats + one-tap add-to-plan ----
  const glanceCards = DB.kids.map(k => {
    const st = kidStats(k.id);
    const log = DB.log[k.id] || {};
    let wkT = 0, wkC = 0, days = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const e = log[dstr(d)]; if (e && e.t > 0) { wkT += e.t; wkC += e.c; days++; }
    }
    const lessonsWk = (((DB.learn || {})[k.id] || {}).learnedLessons || []).filter(x => x.date >= dstr(mon)).length;
    const focusIds = (DB.focus[k.id] && DB.focus[k.id].week === wk) ? DB.focus[k.id].skills : [];
    const weak = SKILLS
      .map(s => ({ s, v: st[s.id] || { s: 0, a: 0 } }))
      .filter(x => x.v.a > 0 && x.v.s < 75)
      .sort((a, b) => a.v.s - b.v.s)
      .slice(0, 3);
    const weakRows = weak.map(x => `
      <div class="kid-admin-row" style="border-bottom-style:dotted">
        <span style="display:inline-flex">${plantSVG(x.v.s, 22)}</span>
        <span class="nm" style="font-size:14px">${x.s.name} <span style="color:var(--ink-soft);font-size:12.5px">· score ${x.v.s}</span></span>
        ${focusIds.includes(x.s.id)
          ? `<span class="pill" style="font-size:11.5px;flex:none">${icon('check', 12)} in this week's plan</span>`
          : `<button class="btn small sky" style="flex:none" data-addweek="${k.id}:${x.s.id}">＋ Add to the week</button>`}
      </div>`).join('') || '<p class="note">No trouble spots right now — the garden is healthy.</p>';
    return `<div class="card">
      <h2><span class="bubble" style="background:var(--sky)">${icon('calendar', 16)}</span>${esc(k.name)} — this week in 10 seconds</h2>
      <div class="stat-row">
        <div class="stat-tile"><div class="v">${fmtMins(weekSeconds(k.id))}</div><div class="l">time this week</div></div>
        <div class="stat-tile"><div class="v">${wkT}</div><div class="l">questions</div></div>
        <div class="stat-tile"><div class="v">${wkT ? Math.round(wkC / wkT * 100) + '%' : '—'}</div><div class="l">correct</div></div>
        <div class="stat-tile"><div class="v">${days}</div><div class="l">days practiced</div></div>
        <div class="stat-tile"><div class="v">${lessonsWk}</div><div class="l">lessons learned</div></div>
      </div>
      <p class="eyebrow" style="margin:12px 0 4px">Needs water — one tap adds it to ${esc(k.name)}'s plan</p>
      ${weakRows}
    </div>`;
  }).join('');

  // ---- per-kid school focus chips ----
  const focusCards = DB.kids.map(k => {
    const f = DB.focus[k.id];
    const ids = (f && f.week === wk ? f.skills : []).filter(id => SKILL_MAP[id]);
    const chips = ids.map(id => `<span class="focus-chip">${SKILL_MAP[id].name}
      <button data-unfocus="${k.id}:${id}" aria-label="Remove">✕</button></span>`).join('');
    return `<div class="card">
      <h2><span class="bubble" style="background:var(--terra-tint);color:var(--terra)">${icon('target', 17)}</span>This week's school focus · ${esc(k.name)}</h2>
      <p class="note">Pick what the class is working on — these skills jump to the front of ${esc(k.name)}'s daily plan.</p>
      <div class="focus-chip-row">
        ${chips}
        <button class="focus-add" data-sync="${k.id}">＋ Add a skill</button>
      </div>
    </div>`;
  }).join('');

  // ---- per-kid daily goal steppers ----
  const goalCards = DB.kids.map(k => {
    const g = kidSettings(k.id).schoolGoal;
    return `<div class="card">
      <h2 style="margin-bottom:4px">Daily goal · ${esc(k.name)}</h2>
      <p class="note">Core skills per school day. Everything past the goal counts as bonus.</p>
      <div class="goal-stepper">
        <button class="stepper-btn minus" data-goal="${k.id}:-1" aria-label="Fewer">−</button>
        <span class="goal-num"><b>${g}</b><small>skills / day</small></span>
        <button class="stepper-btn plus" data-goal="${k.id}:1" aria-label="More">＋</button>
      </div>
      <p style="text-align:center;color:var(--green);font-weight:700;font-size:13px">≈ ${g * 3} minutes after school</p>
    </div>`;
  }).join('');

  // ---- Sunday-style recap (from real data) ----
  const recapCards = DB.kids.map(k => {
    const log = DB.log[k.id] || {};
    let daysPracticed = 0;
    for (let i = 0; i < 5; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const e = log[dstr(d)]; if (e && e.t > 0) daysPracticed++;
    }
    if (!daysPracticed) return '';
    const st = kidStats(k.id);
    const trouble = SKILLS.map(s => ({ s, v: st[s.id] || { s: 0, a: 0 } }))
      .filter(x => x.v.a > 0 && x.v.s < 50).sort((a, b) => a.v.s - b.v.s)[0];
    return `<div class="recap-card">${icon('bulb', 16)}
      <span><b>This week:</b> ${esc(k.name)} practiced ${daysPracticed} of 5 school days${trouble
        ? `, and the trouble spot is <b>${trouble.s.name}</b> — it's already prioritized in the plan.`
        : ' — no trouble spots right now. 🌟'}</span></div>`;
  }).join('');

  setAppbar(`
    <span class="band-lock">${icon('lock', 19)}</span>
    <span><b>Grown-ups corner</b>Everything stays on this device — no accounts, no internet needed.</span>
    <span class="ab-spacer"></span>
    <button class="btn caps-btn" id="backHome">${icon('left', 14)} Back to kids</button>`);
  app.innerHTML = `<div class="reveal">
    <div class="parent-grid">
      <div>
        <div class="card">
          <div style="display:flex;align-items:center;margin-bottom:10px">
            <h2 style="margin:0">Your kids</h2>
            <button class="btn small" style="margin-left:auto;background:var(--teal-tint);border-color:var(--teal-tint);color:var(--teal)" id="addKid2">＋ Add a kid</button>
          </div>
          ${kidRows}
        </div>
        ${glanceCards}
        ${DB.kids.map(k => typeof gamesRecapHTML === 'function' ? gamesRecapHTML(k.id) : '').join('')}
        ${focusCards}
        <div class="card" style="display:flex;align-items:center;gap:14px">
          <span class="subj-ico" style="width:48px;height:48px;background:var(--gold-tint);color:var(--gold)">${icon('printer', 22)}</span>
          <span style="flex:1"><b style="font-family:var(--font-head);font-size:15px">Worksheet maker</b>
            <p class="note">Print a paper practice page from any skills — great for car rides and screen-free time.</p></span>
          <button class="btn caps-btn" style="color:var(--teal);border-color:var(--teal)" id="wsMaker">Make one</button>
        </div>
        <div class="card">
          <h2>Family tools</h2>
          <div class="field-row" style="align-items:center">
            <span style="font-weight:700;font-size:13px">Reading voice:</span>
            <button class="btn small ${(DB.settings.voicePref || 'female') === 'female' ? 'sky' : 'ghost'}" id="voiceF">Girl voice</button>
            <button class="btn small ${DB.settings.voicePref === 'male' ? 'sky' : 'ghost'}" id="voiceM">Boy voice</button>
            <button class="btn small ghost" id="voiceTest">${icon('volume', 14)} Test</button>
          </div>
        </div>
        <div class="card">
          <h2><span class="bubble" style="background:var(--purple-tint);color:var(--purple)">${icon('pin', 16)}</span>My lessons</h2>
          <p class="note">Add your own content — spelling lists, vocabulary, or quizzes. It becomes a real skill your kids practice.</p>
          ${lessonsListHTML()}
          <div class="field-row"><button class="btn small" style="background:var(--purple);border-color:var(--purple);color:#fff" id="newLesson">＋ Create a lesson</button></div>
        </div>
        <div class="card">
          <h2><span class="bubble" style="background:var(--teal-tint);color:var(--teal)">${icon('book', 16)}</span>Real-books library corner</h2>
          <p class="note">Our reading passages are <b>original stories written for this app</b>. For real books, these are free and legit:
          <a href="https://www.storylineonline.net" target="_blank" rel="noopener">Storyline Online</a> ·
          <a href="https://www.uniteforliteracy.com" target="_blank" rel="noopener">Unite for Literacy</a> ·
          the <b>Libby app</b> (free with a library card) ·
          <a href="https://www.readworks.org" target="_blank" rel="noopener">ReadWorks</a>.</p>
        </div>
      </div>
      <div>
        ${goalCards}
        <div class="card">
          <h2><span class="bubble" style="background:var(--gold-tint);color:var(--gold)">${icon('bulb', 16)}</span>New here? How it works</h2>
          <details><summary style="font-weight:700;cursor:pointer;color:var(--teal)">The 2-minute guide</summary>
            <ol style="font-weight:600;line-height:1.8;padding-left:20px;margin-top:8px;font-size:13.5px">
              <li><b>Add each kid</b> (their own garden, avatar, and progress).</li>
              <li>Have them take a 5-minute <b>Garden Checkup</b> — the app finds what they already know and plans around it.</li>
              <li>Kids just open the app daily: <b>Today</b> shows their small plan; finishing it waters the garden.</li>
              <li><b>Learn</b> = the fox teaches new topics first; <b>Practice</b> grows skills from seed to flower; the <b>Helper</b> owl coaches homework.</li>
              <li>You: paste the teacher's newsletter into <b>School focus</b>, check <b>this week in 10 seconds</b> here, print <b>worksheets</b>, and set the practice-time nudge below.</li>
              <li>On a tablet: open the app in the browser → Share → <b>Add to Home Screen</b> — it works offline forever after.</li>
            </ol>
            <p class="note">Kids get their own friendly tour on first visit — replay it any time from Settings.</p>
          </details>
        </div>
        <div class="card">
          <h2>Reminders</h2>
          <div class="toggle-row"><span><b>Daily practice nudge</b><br><small class="note">On school days, when the plan isn't done yet</small></span>
            <span style="display:inline-flex;align-items:center;gap:9px;margin-left:auto">
              <input type="time" id="remTime" value="${remindersCfg().time}" style="font-weight:700;padding:5px 8px;border:var(--outline);border-radius:10px">
              <button class="tog ${rem.nudge ? 'on' : ''}" data-tog="nudge"></button>
            </span></div>
          <div class="toggle-row"><span><b>System notifications</b><br><small class="note" id="sysNoteState">${('Notification' in window) ? (Notification.permission === 'granted' ? 'On — pops up even when the app is in another tab' : 'Off — nudges show inside the app only') : 'Not supported on this browser — in-app nudges still work'}</small></span>
            ${('Notification' in window) && Notification.permission !== 'granted' ? `<button class="btn small sky" id="askNotif">Turn on</button>` : ''}</div>
          <div class="toggle-row"><span><b>Streak alerts</b><br><small class="note">Heads-up before a streak breaks</small></span>
            <button class="tog ${rem.streakAlert ? 'on' : ''}" data-tog="streakAlert"></button></div>
          <div class="toggle-row"><span><b>Weekly recap</b><br><small class="note">Summary on this screen every Sunday</small></span>
            <button class="tog ${rem.recap ? 'on' : ''}" data-tog="recap"></button></div>
          <p class="note" style="margin-top:8px">Honest fine print: with no servers and no accounts, reminders can only fire while the app (or its tab) is open. On an installed tablet app, the icon also shows a badge with today's tasks left.</p>
        </div>
        ${typeof gamesSettingsCardHTML === 'function' ? gamesSettingsCardHTML() : ''}
        ${recapCards}
      </div>
    </div>
    <p class="note" id="verNote" style="text-align:center;margin-top:16px">Learning Garden — ${APP_BUILD.label}</p>
  </div>`;

  // quiet update check: does THIS device hold the newest delivery?
  if ('caches' in window) {
    caches.keys().then(keys => {
      const have = keys.filter(k => k.startsWith('lg-v')).sort().pop();
      const el = $('#verNote');
      if (!el || !have) return; // no service worker here (dev / file://) — just show the build
      el.textContent = have === APP_BUILD.cache
        ? `Learning Garden — ${APP_BUILD.label} — this device is up to date`
        : `Learning Garden — ${APP_BUILD.label} — a newer version is downloading; close the app and reopen to finish`;
    }).catch(() => {});
  }

  if (typeof wireGamesSettingsCard === 'function') wireGamesSettingsCard();
  $('#backHome').onclick = () => show(kid() ? 'today' : 'kids');
  const rt = $('#remTime'); if (rt) rt.onchange = () => { remindersCfg().time = rt.value || '15:30'; remindersCfg().lastFired = null; save(); };
  const an = $('#askNotif'); if (an) an.onclick = () => Notification.requestPermission().then(() => renderGrownups());
  $('#addKid2').onclick = renderAddKid;
  $('#wsMaker').onclick = () => show('worksheet');
  $('#voiceF').onclick = () => { DB.settings.voicePref = 'female'; save(); renderGrownups(); };
  $('#voiceM').onclick = () => { DB.settings.voicePref = 'male'; save(); renderGrownups(); };
  $('#voiceTest').onclick = () => speak('Hello! I will be your reading buddy in the Learning Garden.', 'en');
  $('#newLesson').onclick = () => renderCreateLesson();
  $$('[data-tog]').forEach(b => b.onclick = () => {
    rem[b.dataset.tog] = !rem[b.dataset.tog]; save();
    b.classList.toggle('on', rem[b.dataset.tog]);
  });
  $$('[data-goal]').forEach(b => b.onclick = () => {
    const [kidId, delta] = b.dataset.goal.split(':');
    const s = kidSettings(kidId);
    s.schoolGoal = Math.max(2, Math.min(6, s.schoolGoal + Number(delta)));
    save(); renderGrownups();
  });
  $$('[data-report]').forEach(b => b.onclick = () => show('report', b.dataset.report));
  $$('[data-sync]').forEach(b => b.onclick = () => show('schoolsync', b.dataset.sync));
  $$('[data-addweek]').forEach(b => b.onclick = () => {
    const [kidId, sid] = b.dataset.addweek.split(':');
    if (!DB.focus[kidId] || DB.focus[kidId].week !== wk) DB.focus[kidId] = { week: wk, skills: [] };
    if (!DB.focus[kidId].skills.includes(sid)) DB.focus[kidId].skills.push(sid);
    if (DB.plans[kidId]) delete DB.plans[kidId][wk]; // plan rebuilds with it in the first slots
    save(); sfx('water');
    renderGrownups();
  });
  $$('[data-unfocus]').forEach(b => b.onclick = () => {
    const [kidId, sid] = b.dataset.unfocus.split(':');
    const f = DB.focus[kidId];
    if (f) { f.skills = f.skills.filter(x => x !== sid); if (DB.plans[kidId]) delete DB.plans[kidId][weekKey()]; save(); }
    renderGrownups();
  });
  $$('[data-editles]').forEach(b => b.onclick = () => renderCreateLesson(b.dataset.editles));
  $$('[data-delles]').forEach(b => b.onclick = () => {
    const c = DB.custom.find(x => x.id === b.dataset.delles);
    if (confirm(`Delete the lesson "${c.name}"? This can't be undone.`)) {
      DB.custom = DB.custom.filter(x => x.id !== b.dataset.delles);
      save(); loadCustomSkills(); renderGrownups();
    }
  });
  $$('[data-reset]').forEach(b => b.onclick = () => {
    const k = DB.kids.find(x => x.id === b.dataset.reset);
    if (confirm(`Reset ALL of ${k.name}'s progress? This cannot be undone.`)) {
      delete DB.stats[k.id]; delete DB.log[k.id]; delete DB.plans[k.id];
      save(); renderGrownups();
    }
  });
  $$('[data-del]').forEach(b => b.onclick = () => {
    const k = DB.kids.find(x => x.id === b.dataset.del);
    if (confirm(`Remove ${k.name} and all their progress? This cannot be undone.`)) {
      DB.kids = DB.kids.filter(x => x.id !== k.id);
      delete DB.stats[k.id]; delete DB.log[k.id]; delete DB.plans[k.id];
      delete DB.focus[k.id]; delete DB.diag[k.id]; delete DB.sprint[k.id];
      if (DB.learn) delete DB.learn[k.id];
      if (DB.lessons) delete DB.lessons[k.id];
      if (DB.settings) delete DB.settings[k.id];
      if (DB.activeKid === k.id) DB.activeKid = null;
      save(); renderGrownups();
    }
  });
}

// custom-lesson list rows (used by Grown-ups)
function lessonsListHTML() {
  return (DB.custom || []).map(c => {
    const sub = SUBJECTS.find(s => s.id === c.subject) || { name: 'My Lessons' };
    return `<div class="kid-admin-row" style="border-bottom-style:dotted">
      <span class="nm" style="font-size:13.5px">${esc(c.name)}
        <span style="color:var(--muted);font-size:11.5px;font-weight:600"> · ${sub.name} · ${c.items.length} card${c.items.length > 1 ? 's' : ''}</span></span>
      <button class="btn small sky" data-editles="${c.id}">Edit</button>
      <button class="btn small ghost" data-delles="${c.id}">Delete</button>
    </div>`;
  }).join('');
}

// ---------------- utils ----------------
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function escAttr(s) { return esc(s); }

// ---------------- boot ----------------
loadCustomSkills(); // splice any saved custom lessons into the catalog
$('#brandLogo').innerHTML = logoSVG(30);
const brandEl = $('.brand');
brandEl.style.cursor = 'pointer';
brandEl.onclick = () => show(kid() ? 'today' : 'kids');
$$('#tabbar [data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon, 21); });
show(kid() ? 'today' : 'kids');
