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
function speak(text, lang = 'es-ES') {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : lang;
  u.rate = 0.82;
  speechSynthesis.speak(u);
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
const PLAN_VERSION = 5; // bump when the skill catalog or plan logic changes
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
    // rotate the "special" subject: Mon science, Tue spanish, Wed social,
    // Thu science, Fri spanish (social also shows up via review picks)
    const daySubj = ['science', 'spanish', 'social', 'science', 'spanish'][d];
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
function streakDays() {
  const log = kidLog();
  const goal = dailyQuestionGoal();
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
function show(view, param) {
  VIEW = view;
  const hasKid = !!kid();
  $('#tabbar').style.display = hasKid && view !== 'kids' ? 'flex' : 'none';
  $('#kidChip').style.display = hasKid ? 'flex' : 'none';
  if (hasKid) $('#kidChip').innerHTML = `<span class="face">${kid().avatar}</span> ${kid().name}`;
  $$('#tabbar button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  window.scrollTo(0, 0);
  const views = {
    kids: renderKids, today: renderToday, practice: renderPractice,
    session: () => renderSession(param), plan: renderPlan,
    progress: renderProgress, helper: renderHelper, grownups: renderGrownups,
    schoolsync: () => renderSchoolSync(param), report: () => renderParentReport(param),
  };
  (views[view] || renderKids)();
}
$$('#tabbar button').forEach(b => b.onclick = () => show(b.dataset.view));
$('#kidChip').onclick = () => show('kids');

// ============================================================
// KID PICKER
// ============================================================
const AVATARS = ['🦊', '🐼', '🦄', '🐸', '🦁', '🐙', '🦋', '🐢', '🐰', '🐯', '🦖', '🐬'];
function renderKids() {
  const cards = DB.kids.map(k => {
    const st = kidStats(k.id);
    const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    return `<button class="kid-card" data-kid="${k.id}">
      <span class="face">${k.avatar}</span>
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
    <div class="avatar-pick" id="avPick">${AVATARS.map((a, i) => `<button data-a="${a}" class="${i === 0 ? 'sel' : ''}">${a}</button>`).join('')}</div>
    <div class="field-row">
      <button class="btn primary" id="saveKid">Let's grow! 🌻</button>
      <button class="btn ghost" id="cancelKid">Back</button>
    </div>
  </div></div>`;
  let av = AVATARS[0];
  $$('#avPick button').forEach(b => b.onclick = () => {
    $$('#avPick button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel'); av = b.dataset.a;
  });
  $('#saveKid').onclick = () => {
    const name = $('#kidName').value.trim();
    if (!name) { $('#kidName').focus(); return; }
    const id = 'k' + Date.now();
    DB.kids.push({ id, name, avatar: av });
    DB.activeKid = id; save(); burst(30); show('today');
  };
  $('#cancelKid').onclick = () => show('kids');
  $('#kidName').focus();
}

// ============================================================
// TODAY
// ============================================================
function renderToday() {
  const k = kid();
  const goal = kidSettings().schoolGoal;
  const plan = getWeekPlan();
  const dow = (new Date().getDay() + 6) % 7; // Mon=0
  const isWeekend = dow > 4;
  const fullDay = isWeekend ? [] : (plan[dow] || []).filter(sid => SKILL_MAP[sid]);
  const coreTasks = fullDay.slice(0, goal);       // today's light assignment
  const bonusTasks = fullDay.slice(goal);         // optional extra
  const doneCount = coreTasks.filter(t => taskDoneToday(t)).length;
  const qToday = questionsToday();
  const qGoal = dailyQuestionGoal();
  const streak = streakDays();
  const st = kidStats();
  const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const focus = focusSet();
  const rowFor = (sid) => {
    const sk = SKILL_MAP[sid];
    const strand = STRANDS.find(s => s.id === sk.strand);
    const done = taskDoneToday(sid);
    return `<button class="plan-task ${done ? 'done' : ''}" data-skill="${sid}">
      <span class="chk">${done ? '✔' : ''}</span>
      <span>${focus.has(sid) ? '🎯 ' : ''}${strand.emoji} ${sk.name}</span>
      <span class="go">${done ? '🌟' : 'Go ▸'}</span>
    </button>`;
  };
  const taskRows = coreTasks.map(rowFor).join('');
  const bonusRows = bonusTasks.map(rowFor).join('');
  const hasDiag = (DB.diag[k.id] || []).length > 0;
  const checkupCard = hasDiag ? '' : `
    <div class="card"><span class="sticker">5 min</span>
      <h2><span class="bubble" style="background:var(--leaf)">🩺</span>First time? Garden checkup!</h2>
      <p style="font-weight:700">A quick quiz that finds what ${esc(k.name)} already knows — then the whole garden plans itself around it.</p>
      <div class="answer-row" style="justify-content:flex-start;flex-wrap:wrap">
        ${activeSubjects().filter(s => s.id !== 'custom').map(s => `<button class="btn ghost" data-diag="${s.id}">${s.emoji} ${s.name}</button>`).join('')}
      </div>
    </div>`;

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <div class="today-hero">
        <span class="big-emoji">${k.avatar}</span>
        <div class="msg">
          <div class="hi">${greet}, ${esc(k.name)}!</div>
          <div class="sub">${isWeekend
            ? 'It\'s the weekend — practice is all yours today. 🎈'
            : qToday >= qGoal
              ? 'Your garden is watered for today! 💧 Anything more is bonus.'
              : `A quick ${goal}-skill day — about 10 minutes. You've got this! 💪`}</div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-tile"><div class="v">🔥 ${streak}</div><div class="l">day streak</div></div>
        <div class="stat-tile"><div class="v">✏️ ${qToday}</div><div class="l">today</div></div>
        <div class="stat-tile"><div class="v">🌻 ${flowers}</div><div class="l">mastered</div></div>
      </div>
    </div>

    ${isWeekend
      ? `<div class="card tilt-r"><h2><span class="bubble" style="background:var(--sky)">🎈</span>Weekend explore day!</h2>
         <p style="font-weight:700">No school-day plan — the weekend is for exploring whatever you like. Try a Daily Mix, learn something new, or wander the garden.</p>
         <div class="answer-row" style="justify-content:flex-start;flex-wrap:wrap">
           <button class="btn coral big" id="goMixW">🌈 Daily Mix</button>
           <button class="btn sunny big" id="freePlay">🌱 Explore practice</button>
         </div></div>`
      : `<div class="card tilt-r"><span class="sticker">${doneCount}/${coreTasks.length} done</span>
         <h2><span class="bubble" style="background:var(--sun)">🗓️</span>${DAY_NAMES[dow]}'s plan</h2>
         <p class="note" style="margin:-4px 0 6px">Just ${coreTasks.length} skills after school — short and sweet. 🌤️</p>
         ${taskRows}
         ${bonusTasks.length ? `<button class="btn small ghost" id="bonusToggle" style="margin-top:10px">➕ Feeling great? ${bonusTasks.length} bonus skills</button>
         <div id="bonusWrap" style="display:none;margin-top:8px">${bonusRows}</div>` : ''}
         </div>`}

    ${checkupCard}

    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--berry)">🌈</span>Daily Mix</h2>
      <p style="font-weight:700">10 quick questions from every subject — the Mix always picks the skills that need the most sunshine.</p>
      <div class="answer-row" style="justify-content:flex-start"><button class="btn coral big" id="goMix">Start the Mix 🌈</button></div>
    </div>

    ${sprintCardHTML()}

    <div class="card">
      <h2><span class="bubble" style="background:var(--sky)">🦉</span>Homework tonight?</h2>
      <p style="font-weight:700">The Tutor Owl doesn't give answers — it asks you the right questions, one step at a time, until YOU find them.</p>
      <div class="answer-row" style="justify-content:flex-start"><button class="btn sky" id="goHelper">Open the Tutor 🦉</button></div>
    </div>
  </div>`;
  $$('[data-skill]').forEach(b => b.onclick = () => show('session', b.dataset.skill));
  $$('[data-diag]').forEach(b => b.onclick = () => startDiagnostic(b.dataset.diag));
  $$('[data-sprint]').forEach(b => b.onclick = () => startSprint(b.dataset.sprint));
  const fp = $('#freePlay'); if (fp) fp.onclick = () => show('practice');
  const bt = $('#bonusToggle'); if (bt) bt.onclick = () => {
    const w = $('#bonusWrap'); w.style.display = w.style.display === 'none' ? 'block' : 'none';
  };
  const gmw = $('#goMixW'); if (gmw) gmw.onclick = startMix;
  $('#goMix').onclick = startMix;
  $('#goHelper').onclick = () => show('helper');
}

// ============================================================
// PRACTICE (skill catalog)
// ============================================================
let PRACTICE_SUBJ = 'math';
function renderPractice() {
  const st = kidStats();
  const subs = activeSubjects();
  if (!subs.some(s => s.id === PRACTICE_SUBJ)) PRACTICE_SUBJ = 'math';
  const tabs = subs.map(sub => {
    const skills = SKILLS.filter(s => (STRANDS.find(x => x.id === s.strand) || {}).subject === sub.id);
    const done = skills.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    return `<button class="subj-tab ${sub.id === PRACTICE_SUBJ ? 'active' : ''}" data-subj="${sub.id}" style="--subj:${sub.color}">
      <span class="se">${sub.emoji}</span><span>${sub.name}</span><span class="sd">${done}/${skills.length} 🌻</span>
    </button>`;
  }).join('');

  const html = STRANDS.filter(x => x.subject === PRACTICE_SUBJ).map(strand => {
    const skills = SKILLS.filter(s => s.strand === strand.id);
    const avg = Math.round(skills.reduce((sum, s) => sum + (st[s.id] || { s: 0 }).s, 0) / skills.length);
    const rows = skills.map(s => {
      const sc = (st[s.id] || { s: 0 }).s;
      return `<button class="skill-row" data-skill="${s.id}">
        <span class="plant">${plantFor(sc)}</span>
        <span class="info"><span class="nm">${s.name}</span>
          <span class="bar"><i style="width:${sc}%"></i></span></span>
        <span class="sc">${sc}</span>
      </button>`;
    }).join('');
    const lessonBtn = strand.lesson
      ? `<button class="btn small sky" data-lesson="${strand.id}">📖 Learn</button>` : '';
    const lessonCard = strand.lesson
      ? `<div class="card lesson-card" id="lesson-${strand.id}" style="display:none">${strand.lesson}</div>` : '';
    return `<div class="strand-head">
        <span class="bubble" style="background:${strand.color}">${strand.emoji}</span>
        <h3>${strand.name}</h3>${lessonBtn}<span class="meter">${avg} avg</span>
      </div>
      ${lessonCard}
      <div class="skill-list">${rows}</div>`;
  }).join('');

  app.innerHTML = `<div class="reveal">
    <div class="subj-tabs">${tabs}</div>
    <div class="card tilt-l" style="padding:14px 20px"><p style="font-weight:800;text-align:center">${PLANT_LEGEND}</p></div>
    ${html}</div>`;
  $$('[data-subj]').forEach(b => b.onclick = () => { PRACTICE_SUBJ = b.dataset.subj; renderPractice(); });
  $$('[data-skill]').forEach(b => b.onclick = () => show('session', b.dataset.skill));
  $$('[data-lesson]').forEach(b => b.onclick = () => {
    const el = $('#lesson-' + b.dataset.lesson);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  });
}

// ============================================================
// PRACTICE SESSION (the question loop)
// ============================================================
let SESSION = null;
function sessionShell(title, backView) {
  app.innerHTML = `
    <div class="practice-top">
      <button class="btn small ghost back" id="backBtn">← Done</button>
      <div class="title" id="sessTitle">${title}</div>
      <div class="scorebox"><span class="plant" id="plantIcon"></span><span class="num" id="scoreNum"></span></div>
    </div>
    <div class="card qcard pop" id="qcard"></div>`;
  $('#backBtn').onclick = () => show(backView);
  window.scrollTo(0, 0);
}

function renderSession(skillId) {
  const sk = SKILL_MAP[skillId];
  if (!sk) return show('practice');
  SESSION = { skill: sk, streak: 0, answered: false };
  sessionShell(sk.name, 'practice');
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
    $('#plantIcon').textContent = '🩺';
    $('#scoreNum').textContent = `${Math.min(SESSION.qi, SESSION.queue.length)}/${SESSION.queue.length}`;
    return;
  }
  const sc = skillStat(SESSION.skill.id).s;
  $('#plantIcon').textContent = plantFor(sc);
  $('#scoreNum').textContent = sc;
}

function nextQuestion() {
  clearTimeout(SESSION.autoT);
  if (SESSION.queue) {
    if (SESSION.qi >= SESSION.queue.length) {
      return SESSION.diag ? renderDiagResults() : renderMixRecap();
    }
    SESSION.skill = SKILL_MAP[SESSION.queue[SESSION.qi++]];
    const t = $('#sessTitle');
    if (t) t.textContent = (SESSION.diag ? '🩺 ' : '🌈 ') + SESSION.skill.name;
  }
  const lvl = SESSION.diag ? 2 : difficultyFor(SESSION.skill.id);
  const q = SESSION.skill.gen(lvl);
  SESSION.q = q; SESSION.answered = false;
  updateScorebox();
  const card = $('#qcard');
  const levelPill = (SESSION.skill.adaptive && !SESSION.diag)
    ? `<div style="text-align:center;margin-bottom:6px;font-weight:800;font-size:13px;color:var(--ink-soft)">
        Challenge ${'●'.repeat(lvl)}${'○'.repeat(3 - lvl)} ${lvl === 1 ? 'warming up' : lvl === 2 ? 'on level' : 'stretch!'}</div>`
    : '';
  let answerUI = '';
  if (q.type === 'mc') {
    const two = q.choices.length === 2;
    answerUI = `<div class="choices ${two ? 'two' : ''}">${q.choices.map(c =>
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
    ${levelPill}
    <div class="qprompt">${q.prompt}</div>
    ${q.body ? `<div class="qbody">${q.body}</div>` : ''}
    ${answerUI}
    <div id="fb"></div>`;

  if (q.type === 'mc') {
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
    correct = String(given).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  } else {
    correct = String(given) === String(q.answer);
  }

  if (SESSION.queue && correct) SESSION.right++;

  let cur = { s: 0 }, before = 0;
  if (SESSION.diag) {
    // checkups measure — they don't move mastery or the daily log
    const r = SESSION.diagResults[sk.strand] = SESSION.diagResults[sk.strand] || [0, 0];
    r[1]++; if (correct) r[0]++;
  } else {
    // ---- update mastery score ----
    const st = kidStats();
    cur = st[sk.id] || { s: 0, a: 0, c: 0 };
    before = cur.s;
    if (correct) {
      SESSION.streak++;
      let delta = cur.s < 50 ? 8 : cur.s < 80 ? 6 : 4;
      if (SESSION.streak >= 3) delta += 1;
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
  }
  updateScorebox();

  // ---- visual feedback ----
  if (q.type === 'mc') {
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
  const praise = pick(['Way to go!', 'You got it!', 'Super!', 'Amazing!', 'High five! 🖐️', 'Brains blooming! 🌸', 'Nailed it!']);
  const oops = pick(['Almost!', 'Good try!', 'So close!', 'Keep growing!']);
  const answerShown = q.type === 'num' || q.type === 'line'
    ? `${q.answer}${q.suffix || ''}` : q.answer;
  fb.innerHTML = `<div class="feedback ${correct ? 'good' : 'bad'} pop">
      <div class="headline">${correct ? '🌟 ' + praise : '🌧️ ' + oops + ` The answer is <u>${answerShown}</u>.`}</div>
      <div class="why">${q.explain || ''}</div>
    </div>
    <div class="answer-row"><button class="btn ${correct ? 'primary' : 'sunny'} big" id="nextBtn">Next ▸</button></div>`;
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
  const days = plan.map((tasks, i) => {
    const dayDate = new Date(mon); dayDate.setDate(mon.getDate() + i);
    const ds = dstr(dayDate);
    const isToday = i === dow;
    const isPast = i < dow;
    const done = tasks.filter(t => {
      const day = kidLog()[ds];
      return (day && day.per[t] && day.per[t][1] >= SKILL_DONE_Q) || skillStat(t).s >= 100;
    }).length;
    const focus = focusSet();
    const rows = tasks.map(sid => {
      const sk = SKILL_MAP[sid];
      const strand = STRANDS.find(s => s.id === sk.strand);
      const day = kidLog()[ds];
      const isDone = (day && day.per[sid] && day.per[sid][1] >= SKILL_DONE_Q) || skillStat(sid).s >= 100;
      return `<button class="plan-task ${isDone ? 'done' : ''}" data-skill="${sid}">
        <span class="chk">${isDone ? '✔' : ''}</span>
        <span>${focus.has(sid) ? '🎯 ' : ''}${strand.emoji} ${sk.name}</span>
        <span class="go">${isDone ? '🌟' : (isToday ? 'Go ▸' : '')}</span>
      </button>`;
    }).join('');
    return `<div class="plan-day ${isToday ? 'today-day' : ''}">
      <div class="day-head"><span class="dn">${DAY_NAMES[i]}</span>${isToday ? '<span style="font-size:13px">← today</span>' : ''}
        <span class="prog">${done}/${tasks.length} ${done === tasks.length ? '🌟' : ''}</span></div>
      ${rows}
    </div>`;
  }).join('');
  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l" style="padding:16px 20px">
      <h2><span class="bubble" style="background:var(--sun)">🗓️</span>This week's garden plan</h2>
      <p class="note">A fresh plan sprouts every Monday. It mixes new seeds with skills that need more sunshine. A skill checks off after 8 questions that day.</p>
    </div>
    ${days}
  </div>`;
  $$('[data-skill]').forEach(b => b.onclick = () => show('session', b.dataset.skill));
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

  // strand mastery bars, grouped by subject
  const bars = activeSubjects().map(sub => {
    const strandRows = STRANDS.filter(x => x.subject === sub.id).map(strand => {
      const skills = SKILLS.filter(s => s.strand === strand.id);
      const avg = Math.round(skills.reduce((sum, s) => sum + (st[s.id] || { s: 0 }).s, 0) / skills.length);
      return `<div class="row">
        <span class="lbl">${strand.emoji} ${strand.name}</span>
        <span class="track"><span class="fill" style="width:${avg}%"></span></span>
        <span class="val">${avg}</span>
      </div>`;
    }).join('');
    return `<div style="font-family:var(--font-display);font-weight:600;font-size:18px;margin:16px 0 8px">${sub.emoji} ${sub.name}</div>${strandRows}`;
  }).join('');

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
  let improveMsg = 'Practice a little every day and watch this grow! 🌱';
  if (lastW.t >= 10 && thisW.t >= 10) {
    const d = accW(thisW) - accW(lastW);
    improveMsg = d > 2 ? `📈 Accuracy is UP ${d} points from last week — amazing growth!`
      : d < -2 ? `💪 Accuracy dipped ${-d} points from last week — a little extra watering will fix that!`
      : `➡️ Accuracy is steady vs last week (${accW(thisW)}%). Keep it up!`;
  }

  // daily columns for this week
  const cols = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const e = log[dstr(d)] || { t: 0, c: 0 };
    return { label: ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'][i], t: e.t, c: e.c };
  });
  const maxT = Math.max(...cols.map(c => c.t), 10);
  const chart = cols.map(c => `<div class="col">
      <span class="cv">${c.t || ''}</span>
      <div class="bar-v" style="height:${(c.t / maxT) * 100}%"></div>
      <span class="cl">${c.label}</span>
    </div>`).join('');

  // badges
  const strandsTried = new Set(SKILLS.filter(s => (st[s.id] || { a: 0 }).a > 0).map(s => s.strand)).size;
  const blooms = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 75).length;
  const badges = [
    ['🎈', 'First question', totalQ >= 1],
    ['🌈', '50 questions', totalQ >= 50],
    ['🚀', '250 questions', totalQ >= 250],
    ['👑', '1,000 questions', totalQ >= 1000],
    ['🌸', 'First bloom', blooms >= 1],
    ['🌻', 'First sunflower', flowers >= 1],
    ['🌟', '5 sunflowers', flowers >= 5],
    ['🔥', '3-day streak', streak >= 3],
    ['⚡', '7-day streak', streak >= 7],
    ['🗺️', 'Tried every topic', strandsTried >= STRANDS.length],
  ].map(([bi, bn, got]) => `<div class="badge ${got ? '' : 'locked'}"><div class="bi">${bi}</div><div class="bn">${bn}</div></div>`).join('');

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--sun)">🌟</span>${esc(kid().name)}'s growing report</h2>
      <div class="stat-row">
        <div class="stat-tile"><div class="v">${totalQ}</div><div class="l">questions ever</div></div>
        <div class="stat-tile"><div class="v">${acc}%</div><div class="l">correct overall</div></div>
        <div class="stat-tile"><div class="v">🌻 ${flowers}</div><div class="l">of ${SKILLS.length} mastered</div></div>
        <div class="stat-tile"><div class="v">🔥 ${streak}</div><div class="l">day streak</div></div>
      </div>
    </div>
    <div class="card tilt-r">
      <h2><span class="bubble" style="background:var(--sky)">📊</span>This week</h2>
      <div class="week-chart">${chart}</div>
      <p style="font-weight:800;text-align:center;margin-top:10px">${improveMsg}</p>
      <p class="note" style="text-align:center">This week: ${thisW.t} questions, ${accW(thisW)}% right · Last week: ${lastW.t} questions, ${accW(lastW)}% right</p>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--leaf)">🌱</span>Garden health by topic</h2>
      <div class="prog-bars">${bars}</div>
    </div>
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--coral)">🏅</span>Sticker book</h2>
      <div class="badge-grid">${badges}</div>
    </div>
    <div style="text-align:center"><button class="btn small ghost" id="grownBtn2">🔑 Grown-ups corner</button></div>
  </div>`;
  $('#grownBtn2').onclick = () => show('grownups');
}

// ============================================================
// HOMEWORK HELPER
// ============================================================
let HELPER_TAB = 'tutor';
function renderHelper() {
  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l" style="padding:16px 20px">
      <h2><span class="bubble" style="background:var(--sky)">🦉</span>Tutor Owl</h2>
      <p class="note">A real tutor doesn't hand you answers — it asks you the right questions. Bring YOUR homework problem here and solve it together, one small step at a time. Wrong answers get a hint first, so you always get a second try.</p>
    </div>
    <div class="helper-tabs">
      <button data-t="tutor">🧮 Math tutor</button>
      <button data-t="wizard">📖 Word problems</button>
      <button data-t="homework">📄 My homework</button>
      <button data-t="cheats">🗒️ Cheat sheets</button>
    </div>
    <div class="card" id="helperBody"></div>
  </div>`;
  $$('.helper-tabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.t === HELPER_TAB);
    b.onclick = () => { HELPER_TAB = b.dataset.t; renderHelper(); };
  });
  ({ tutor: renderTutorTab, wizard: renderWizardTab, homework: renderHomeworkHelper, cheats: renderCheats })[HELPER_TAB]();
}

function renderCheats() {
  $('#helperBody').innerHTML = `
    <h2><span class="bubble" style="background:var(--coral)">🔍</span>Word-problem clue words</h2>
    <table class="cheat-table">
      <tr><th>If the story says…</th><th>Then you…</th></tr>
      <tr><td>in all · altogether · total · both · sum · joined</td><td><b>ADD ➕</b></td></tr>
      <tr><td>left · gave away · lost · ate · fewer · take away</td><td><b>SUBTRACT ➖</b></td></tr>
      <tr><td>how many more · how many fewer · difference</td><td><b>SUBTRACT ➖</b> (compare!)</td></tr>
      <tr><td>each group has · rows of · bags of</td><td><b>ADD the same number again and again</b></td></tr>
    </table>
    <h2 style="margin-top:22px"><span class="bubble" style="background:var(--sun)">🪙</span>Money</h2>
    <table class="cheat-table">
      <tr><th>Coin</th><th>Worth</th><th>Remember it</th></tr>
      <tr><td>Penny</td><td class="c">1¢</td><td>Copper color, smallest value</td></tr>
      <tr><td>Nickel</td><td class="c">5¢</td><td>The chunky one</td></tr>
      <tr><td>Dime</td><td class="c">10¢</td><td>Tiniest coin, worth MORE than a nickel!</td></tr>
      <tr><td>Quarter</td><td class="c">25¢</td><td>4 quarters = $1</td></tr>
    </table>
    <h2 style="margin-top:22px"><span class="bubble" style="background:var(--sky)">⏰</span>Clock</h2>
    <table class="cheat-table">
      <tr><th>Hand</th><th>Tells you</th></tr>
      <tr><td><b>Short</b> hand</td><td>The HOUR</td></tr>
      <tr><td><b>Long</b> hand</td><td>The MINUTES — skip count by 5s around the clock!</td></tr>
      <tr><td>Long hand on 12</td><td>o'clock (:00)</td></tr>
      <tr><td>Long hand on 6</td><td>half past (:30)</td></tr>
    </table>
    <h2 style="margin-top:22px"><span class="bubble" style="background:var(--coral)">🧱</span>Place value</h2>
    <table class="cheat-table">
      <tr><th>Number</th><th>Hundreds</th><th>Tens</th><th>Ones</th></tr>
      <tr><td class="c"><b>347</b></td><td class="c">3 (=300)</td><td class="c">4 (=40)</td><td class="c">7 (=7)</td></tr>
    </table>
    <h2 style="margin-top:22px"><span class="bubble" style="background:var(--leaf)">✋</span>Doubles facts (super powers!)</h2>
    <table class="cheat-table">
      <tr><td>1+1=2 · 2+2=4 · 3+3=6 · 4+4=8 · 5+5=10</td></tr>
      <tr><td>6+6=12 · 7+7=14 · 8+8=16 · 9+9=18 · 10+10=20</td></tr>
    </table>`;
}

// ============================================================
// GROWN-UPS CORNER
// ============================================================
function renderGrownups() {
  const rows = DB.kids.map(k => {
    const st = kidStats(k.id);
    const log = DB.log[k.id] || {};
    const totalQ = Object.values(log).reduce((s, d) => s + d.t, 0);
    const totalC = Object.values(log).reduce((s, d) => s + d.c, 0);
    const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    return `<div class="kid-admin-row">
      <span class="face">${k.avatar}</span>
      <span class="nm">${esc(k.name)} <span style="font-weight:700;color:var(--ink-soft);font-size:13.5px">· ${totalQ} questions · ${totalQ ? Math.round(totalC / totalQ * 100) : 0}% correct · ${flowers} 🌻</span></span>
      <button class="btn small sky" data-report="${k.id}">📊 Report</button>
      <button class="btn small sunny" data-sync="${k.id}">🎯 School focus</button>
      <button class="btn small ghost" data-reset="${k.id}">Reset progress</button>
      <button class="btn small ghost" data-del="${k.id}">Remove</button>
    </div>`;
  }).join('') || `<p class="note">No kids added yet — add one from the first screen.</p>`;

  const lessons = (DB.custom || []).map(c => {
    const sub = SUBJECTS.find(s => s.id === c.subject) || { emoji: '📌', name: 'My Lessons' };
    return `<div class="kid-admin-row" style="border-bottom-style:dotted">
      <span style="font-size:22px">📌</span>
      <span class="nm" style="font-size:15px">${esc(c.name)}
        <span style="color:var(--ink-soft);font-size:13px">· ${sub.emoji} ${sub.name} · ${c.items.length} card${c.items.length > 1 ? 's' : ''} · ${c.kind === 'mc' ? 'multiple choice' : 'flashcards'}</span></span>
      <button class="btn small sky" data-editles="${c.id}">Edit</button>
      <button class="btn small ghost" data-delles="${c.id}">Delete</button>
    </div>`;
  }).join('') || '<p class="note">No custom lessons yet. Create one to add your own spelling words, vocabulary, or quizzes.</p>';

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--coral)">🔑</span>Grown-ups corner</h2>
      ${rows}
      <div class="field-row"><button class="btn primary" id="addKid2">➕ Add a kid</button>
      <button class="btn ghost" id="backHome">← Back</button></div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--berry)">📌</span>My lessons</h2>
      <p class="note">Add your own content — spelling lists, vocabulary, or quizzes. It becomes a skill your kids practice, with its own garden score, and can be added to their weekly focus.</p>
      ${lessons}
      <div class="field-row"><button class="btn berry" id="newLesson" style="background:var(--berry);color:#fff">➕ Create a lesson</button></div>
    </div>
    <div class="card tilt-r">
      <h2><span class="bubble" style="background:var(--sun)">💡</span>How Learning Garden works</h2>
      <p class="note">
        • <b>Six areas</b> — Math, Language, Science, Social Studies, Spanish, and your own "My Lessons" — modeled on IXL's grade-2 skill lists.<br><br>
        • <b>⚡ Lightning Round</b> builds math-fact fluency: 60-second sprints where kids race their own personal best. Sprints count toward streaks but never lower a garden score, so time pressure stays fun.<br><br>
        • <b>🖨️ Printable report:</b> each kid's Report page has a Print button — great for sharing with their teacher.<br><br>
        • <b>Questions are made fresh every time</b>, and math questions <b>get harder as a kid improves</b> and ease back after misses, so they're always met where they are and gently stretched.<br><br>
        • <b>The garden score (0–100)</b> works like IXL's SmartScore: right answers grow it, wrong shrink it, 100 = mastered (🌻).<br><br>
        • <b>Lighter school days:</b> each kid does a short set of skills Mon–Fri (you set how many with the slider on their School focus page), with weekends left open for exploring. Bonus skills are always one tap away.<br><br>
        • <b>Diagnostics:</b> a first-time Garden Checkup finds each kid's level and plans around it; rerun it anytime to see growth.<br><br>
        • <b>Tutor, not answer key:</b> the Tutor Owl guides kids step-by-step and can show their real homework photo alongside (the photo never leaves this device).<br><br>
        • <b>Each kid has their own separate garden.</b> Everything is saved on this computer only — no accounts, no ads, no fees, works offline.
      </p>
    </div>
  </div>`;
  $('#addKid2').onclick = renderAddKid;
  $('#newLesson').onclick = () => renderCreateLesson();
  $$('[data-editles]').forEach(b => b.onclick = () => renderCreateLesson(b.dataset.editles));
  $$('[data-delles]').forEach(b => b.onclick = () => {
    const c = DB.custom.find(x => x.id === b.dataset.delles);
    if (confirm(`Delete the lesson "${c.name}"? This can't be undone.`)) {
      DB.custom = DB.custom.filter(x => x.id !== b.dataset.delles);
      save(); loadCustomSkills(); renderGrownups();
    }
  });
  $('#backHome').onclick = () => show(kid() ? 'today' : 'kids');
  $$('[data-report]').forEach(b => b.onclick = () => show('report', b.dataset.report));
  $$('[data-sync]').forEach(b => b.onclick = () => show('schoolsync', b.dataset.sync));
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
      if (DB.activeKid === k.id) DB.activeKid = null;
      save(); renderGrownups();
    }
  });
}

// ---------------- utils ----------------
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function escAttr(s) { return esc(s); }

// ---------------- boot ----------------
loadCustomSkills(); // splice any saved custom lessons into the catalog
show(kid() ? 'today' : 'kids');
