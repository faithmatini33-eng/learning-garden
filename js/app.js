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
const save = () => localStorage.setItem(DB_KEY, JSON.stringify(DB));

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const app = $('#app');

// built AFTER every subject file has pushed its skills
const SKILL_MAP = Object.fromEntries(SKILLS.map(s => [s.id, s]));

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
const PLAN_VERSION = 2; // bump when the skill catalog changes shape
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
  const days = [0, 1, 2, 3, 4].map(d => {
    const daySubj = (d % 2 === 0) ? 'science' : 'spanish'; // M/W/F science, T/Th spanish
    const tasks = [
      take(bySubject.math), take(bySubject.math),
      take(bySubject.ela), take(bySubject[daySubj]), take(all),
    ].filter(Boolean);
    return tasks;
  });
  DB.plans[kidId][wk] = { v: PLAN_VERSION, days };
  save();
  return days;
}
function taskDoneToday(sid, dayStr = dstr()) {
  const day = kidLog()[dayStr];
  if (!day || !day.per[sid]) return false;
  return day.per[sid][1] >= 8 || skillStat(sid).s >= 100;
}
function questionsToday() {
  const day = kidLog()[dstr()];
  return day ? day.t : 0;
}
function streakDays() {
  const log = kidLog();
  let streak = 0;
  const d = new Date();
  // today counts if already >=10 questions; otherwise start checking yesterday
  if (!(log[dstr(d)] && log[dstr(d)].t >= 10)) d.setDate(d.getDate() - 1);
  while (log[dstr(d)] && log[dstr(d)].t >= 10) { streak++; d.setDate(d.getDate() - 1); }
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
  const plan = getWeekPlan();
  const dow = (new Date().getDay() + 6) % 7; // Mon=0
  const isWeekend = dow > 4;
  const todayTasks = isWeekend ? [] : plan[dow];
  const doneCount = todayTasks.filter(t => taskDoneToday(t)).length;
  const qToday = questionsToday();
  const streak = streakDays();
  const st = kidStats();
  const flowers = SKILLS.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const taskRows = todayTasks.map(sid => {
    const sk = SKILL_MAP[sid];
    const strand = STRANDS.find(s => s.id === sk.strand);
    const done = taskDoneToday(sid);
    return `<button class="plan-task ${done ? 'done' : ''}" data-skill="${sid}">
      <span class="chk">${done ? '✔' : ''}</span>
      <span>${strand.emoji} ${sk.name}</span>
      <span class="go">${done ? '🌟' : 'Go ▸'}</span>
    </button>`;
  }).join('');

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <div class="today-hero">
        <span class="big-emoji">${k.avatar}</span>
        <div class="msg">
          <div class="hi">${greet}, ${esc(k.name)}!</div>
          <div class="sub">${qToday >= 10 ? 'Your garden is watered for today! 💧' : `Answer ${Math.max(0, 10 - qToday)} more questions to water today's garden 💧`}</div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-tile"><div class="v">🔥 ${streak}</div><div class="l">day streak</div></div>
        <div class="stat-tile"><div class="v">✏️ ${qToday}</div><div class="l">today</div></div>
        <div class="stat-tile"><div class="v">🌻 ${flowers}</div><div class="l">mastered</div></div>
      </div>
    </div>

    ${isWeekend
      ? `<div class="card tilt-r"><h2><span class="bubble" style="background:var(--sky)">🎈</span>It's the weekend!</h2>
         <p style="font-weight:700">No plan today — but the garden is always open. Pick anything fun to practice!</p>
         <div class="answer-row"><button class="btn sunny big" id="freePlay">🌱 Free practice</button></div></div>`
      : `<div class="card tilt-r"><span class="sticker">${doneCount}/${todayTasks.length} done</span>
         <h2><span class="bubble" style="background:var(--sun)">🗓️</span>${DAY_NAMES[dow]}'s plan</h2>
         ${taskRows}
         </div>`}

    <div class="card">
      <h2><span class="bubble" style="background:var(--sky)">🦉</span>Homework night?</h2>
      <p style="font-weight:700">The Helper Owl walks through any problem step by step — without just giving the answer away.</p>
      <div class="answer-row" style="justify-content:flex-start"><button class="btn sky" id="goHelper">Open the Helper 🦉</button></div>
    </div>
  </div>`;
  $$('[data-skill]').forEach(b => b.onclick = () => show('session', b.dataset.skill));
  const fp = $('#freePlay'); if (fp) fp.onclick = () => show('practice');
  $('#goHelper').onclick = () => show('helper');
}

// ============================================================
// PRACTICE (skill catalog)
// ============================================================
let PRACTICE_SUBJ = 'math';
function renderPractice() {
  const st = kidStats();
  const tabs = SUBJECTS.map(sub => {
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
function renderSession(skillId) {
  const sk = SKILL_MAP[skillId];
  if (!sk) return show('practice');
  SESSION = { skill: sk, streak: 0, answered: false };
  app.innerHTML = `
    <div class="practice-top">
      <button class="btn small ghost back" id="backBtn">← Done</button>
      <div class="title">${sk.name}</div>
      <div class="scorebox"><span class="plant" id="plantIcon"></span><span class="num" id="scoreNum"></span></div>
    </div>
    <div class="card qcard pop" id="qcard"></div>`;
  $('#backBtn').onclick = () => show('practice');
  nextQuestion();
}

function updateScorebox() {
  const sc = skillStat(SESSION.skill.id).s;
  $('#plantIcon').textContent = plantFor(sc);
  $('#scoreNum').textContent = sc;
}

function nextQuestion() {
  clearTimeout(SESSION.autoT);
  const q = SESSION.skill.gen();
  SESSION.q = q; SESSION.answered = false;
  updateScorebox();
  const card = $('#qcard');
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

  // ---- update mastery score ----
  const st = kidStats();
  const cur = st[sk.id] || { s: 0, a: 0, c: 0 };
  const before = cur.s;
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
    burst(SESSION.streak >= 3 ? 34 : 18);
    if (cur.s >= 100 && before < 100) return masteredBanner();
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
      return (day && day.per[t] && day.per[t][1] >= 8) || skillStat(t).s >= 100;
    }).length;
    const rows = tasks.map(sid => {
      const sk = SKILL_MAP[sid];
      const strand = STRANDS.find(s => s.id === sk.strand);
      const day = kidLog()[ds];
      const isDone = (day && day.per[sid] && day.per[sid][1] >= 8) || skillStat(sid).s >= 100;
      return `<button class="plan-task ${isDone ? 'done' : ''}" data-skill="${sid}">
        <span class="chk">${isDone ? '✔' : ''}</span>
        <span>${strand.emoji} ${sk.name}</span>
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
  const bars = SUBJECTS.map(sub => {
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
let HELPER_TAB = 'solve';
function renderHelper() {
  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l" style="padding:16px 20px">
      <h2><span class="bubble" style="background:var(--sky)">🦉</span>Helper Owl</h2>
      <p class="note">Stuck on homework? Type in YOUR problem and the owl shows every step — like a teacher sitting next to you.</p>
    </div>
    <div class="helper-tabs">
      <button data-t="solve">➕➖ Step-by-step solver</button>
      <button data-t="word">📖 Word problem coach</button>
      <button data-t="cheats">🗒️ Cheat sheets</button>
    </div>
    <div class="card" id="helperBody"></div>
  </div>`;
  $$('.helper-tabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.t === HELPER_TAB);
    b.onclick = () => { HELPER_TAB = b.dataset.t; renderHelper(); };
  });
  ({ solve: renderSolver, word: renderWordCoach, cheats: renderCheats })[HELPER_TAB]();
}

function renderSolver() {
  $('#helperBody').innerHTML = `
    <div style="text-align:center">
      <p style="font-weight:800;font-size:17px">Type the two numbers from your homework:</p>
      <div class="hw-setup">
        <input class="num-input" id="hwA" inputmode="numeric" placeholder="47">
        <select id="hwOp"><option value="+">+</option><option value="−">−</option></select>
        <input class="num-input" id="hwB" inputmode="numeric" placeholder="38">
        <button class="btn sky big" id="hwGo">Show me! 🦉</button>
      </div>
      <div class="step-list" id="hwSteps"></div>
    </div>`;
  $('#hwGo').onclick = () => {
    let a = parseInt($('#hwA').value.replace(/[,\s]/g, ''), 10);
    let b = parseInt($('#hwB').value.replace(/[,\s]/g, ''), 10);
    const op = $('#hwOp').value;
    const out = $('#hwSteps');
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a > 999 || b > 999) {
      out.innerHTML = `<div class="hw-step"><div class="n">!</div><div class="t">Please type two numbers from 0 to 999. 🦉</div></div>`;
      return;
    }
    if (op === '−' && b > a) [a, b] = [b, a]; // keep it kid-positive
    const steps = op === '+' ? addSteps(a, b) : subSteps(a, b);
    out.innerHTML = `<div style="margin:14px 0 16px">${verticalMath(a, b, op)}</div>`;
    let i = 0;
    const showNext = () => {
      if (i < steps.length) {
        out.insertAdjacentHTML('beforeend',
          `<div class="hw-step"><div class="n">${i + 1}</div><div class="t">${steps[i]}</div></div>`);
        i++;
        if (i < steps.length) {
          out.insertAdjacentHTML('beforeend', `<div class="answer-row" id="moreRow"><button class="btn sunny" id="moreBtn">Next step ▸</button></div>`);
          $('#moreBtn').onclick = () => { $('#moreRow').remove(); showNext(); };
        }
      }
    };
    showNext();
  };
}

function digitsOf(n) { return [Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10]; }

function addSteps(a, b) {
  const steps = [];
  const [ah, at, ao] = digitsOf(a), [bh, bt, bo] = digitsOf(b);
  steps.push(`Line up the numbers so the <b>ones</b> sit on top of each other. We always start on the RIGHT side.`);
  const oSum = ao + bo;
  let carryT = 0;
  if (oSum >= 10) {
    carryT = 1;
    steps.push(`<b>Ones:</b> <span class="mini-math">${ao} + ${bo} = ${oSum}</span>. That's ten or more! Write the <b>${oSum % 10}</b> and carry <b>1 ten</b> to the tens column. 🎒`);
  } else {
    steps.push(`<b>Ones:</b> <span class="mini-math">${ao} + ${bo} = ${oSum}</span>. Write the <b>${oSum}</b>.`);
  }
  const tSum = at + bt + carryT;
  let carryH = 0;
  if (at + bt + carryT > 0 || ah + bh > 0 || a >= 10 || b >= 10) {
    const carryTxt = carryT ? ` (don't forget the carried 1!)` : '';
    if (tSum >= 10) {
      carryH = 1;
      steps.push(`<b>Tens:</b> <span class="mini-math">${carryT ? '1 + ' : ''}${at} + ${bt} = ${tSum}</span>${carryTxt}. Ten or more again! Write the <b>${tSum % 10}</b> and carry <b>1 hundred</b>. 🎒`);
    } else {
      steps.push(`<b>Tens:</b> <span class="mini-math">${carryT ? '1 + ' : ''}${at} + ${bt} = ${tSum}</span>${carryTxt}. Write the <b>${tSum}</b>.`);
    }
  }
  const hSum = ah + bh + carryH;
  if (hSum > 0) {
    steps.push(`<b>Hundreds:</b> <span class="mini-math">${carryH ? '1 + ' : ''}${ah} + ${bh} = ${hSum}</span>. Write the <b>${hSum}</b>.`);
  }
  steps.push(`🌟 All done! <span class="mini-math">${a} + ${b} = ${a + b}</span>. Check it by adding in your head: does it look about right?`);
  return steps;
}

function subSteps(a, b) {
  const steps = [];
  let [ah, at, ao] = digitsOf(a);
  const [bh, bt, bo] = digitsOf(b);
  steps.push(`Line up the numbers so the <b>ones</b> sit on top of each other. Start on the RIGHT side. The bigger number (${a}) goes on top.`);
  if (ao < bo) {
    steps.push(`<b>Ones:</b> ${ao} is smaller than ${bo}, so we <b>borrow</b>! Take 1 ten from the ${at} tens (it becomes ${at - 1}) and give it to the ones: now we have <b>${ao + 10}</b> ones. 🤝`);
    ao += 10; at -= 1;
    steps.push(`<b>Ones:</b> <span class="mini-math">${ao} − ${bo} = ${ao - bo}</span>. Write the <b>${ao - bo}</b>.`);
  } else {
    steps.push(`<b>Ones:</b> <span class="mini-math">${ao} − ${bo} = ${ao - bo}</span>. Write the <b>${ao - bo}</b>.`);
  }
  if (a >= 10 || b >= 10) {
    if (at < bt) {
      steps.push(`<b>Tens:</b> ${at} is smaller than ${bt}, so borrow again! Take 1 hundred from the ${ah} hundreds (it becomes ${ah - 1}) and now we have <b>${at + 10}</b> tens. 🤝`);
      at += 10; ah -= 1;
    }
    steps.push(`<b>Tens:</b> <span class="mini-math">${at} − ${bt} = ${at - bt}</span>. Write the <b>${at - bt}</b>.`);
  }
  if (ah > 0 || bh > 0) {
    steps.push(`<b>Hundreds:</b> <span class="mini-math">${ah} − ${bh} = ${ah - bh}</span>.${ah - bh === 0 ? ' Zero in front? We just leave it off!' : ` Write the <b>${ah - bh}</b>.`}`);
  }
  steps.push(`🌟 All done! <span class="mini-math">${a} − ${b} = ${a - b}</span>. Check it with addition: <span class="mini-math">${a - b} + ${b} = ${a}</span> ✓`);
  return steps;
}

function renderWordCoach() {
  $('#helperBody').innerHTML = `
    <p style="font-weight:800;font-size:17px;margin-bottom:12px">Read your word problem out loud, then follow the owl's 4 steps:</p>
    <div class="step-list">
      <div class="hw-step"><div class="n">1</div><div class="t"><b>Circle the numbers.</b> What numbers does the story give you?</div></div>
      <div class="hw-step"><div class="n">2</div><div class="t"><b>Underline the question.</b> What is it really asking? (How many in all? How many are left? How many more?)</div></div>
      <div class="hw-step"><div class="n">3</div><div class="t"><b>Find the clue words</b> in the chart below to pick + or −.</div></div>
      <div class="hw-step"><div class="n">4</div><div class="t"><b>Solve and check.</b> Does your answer make sense? (If someone gave cookies away, the number should get SMALLER!)</div></div>
    </div>
    <h2 style="margin-top:20px"><span class="bubble" style="background:var(--sun)">🔍</span>Clue words</h2>
    <table class="cheat-table">
      <tr><th>If the story says…</th><th>Then you…</th></tr>
      <tr><td>in all · altogether · total · both · sum · joined</td><td><b>ADD ➕</b></td></tr>
      <tr><td>left · gave away · lost · ate · fewer · take away</td><td><b>SUBTRACT ➖</b></td></tr>
      <tr><td>how many more · how many fewer · difference</td><td><b>SUBTRACT ➖</b> (compare!)</td></tr>
      <tr><td>each group has · rows of · bags of</td><td><b>ADD the same number again and again</b></td></tr>
    </table>
    <p class="note" style="margin-top:12px">Grown-up tip: have your child read the problem twice before touching the pencil. Step 2 is where most mistakes happen.</p>`;
}

function renderCheats() {
  $('#helperBody').innerHTML = `
    <h2><span class="bubble" style="background:var(--sun)">🪙</span>Money</h2>
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
      <button class="btn small ghost" data-reset="${k.id}">Reset progress</button>
      <button class="btn small ghost" data-del="${k.id}">Remove</button>
    </div>`;
  }).join('') || `<p class="note">No kids added yet — add one from the first screen.</p>`;

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--coral)">🔑</span>Grown-ups corner</h2>
      ${rows}
      <div class="field-row"><button class="btn primary" id="addKid2">➕ Add a kid</button>
      <button class="btn ghost" id="backHome">← Back</button></div>
    </div>
    <div class="card tilt-r">
      <h2><span class="bubble" style="background:var(--sun)">💡</span>How Learning Garden works</h2>
      <p class="note">
        • <b>Four subjects</b> — Math, Language, Science, and Spanish — matching what 2nd graders learn (modeled on IXL's grade-2 skill lists).<br><br>
        • <b>Questions are made fresh every time</b> by little question recipes, so practice never runs out.<br><br>
        • <b>The garden score (0–100)</b> works like IXL's SmartScore: right answers grow it, wrong answers shrink it a little, and 100 = mastered (🌻).<br><br>
        • <b>A new weekly plan grows every Monday</b> — 5 skills per school day: 2 math, 1 language, science on Mon/Wed/Fri, Spanish on Tue/Thu, plus 1 review pick.<br><br>
        • <b>Mini-lessons instead of videos:</b> tap 📖 Learn on any topic for a kid-level lesson card. Spanish words have 🔊 buttons that speak out loud using the Mac's built-in voice. For real videos, search the topic name + "for kids" on YouTube Kids — Homeschool Pop, Jack Hartmann, and Scratch Garden are great free channels.<br><br>
        • <b>Each kid has their own garden.</b> Progress, plans, streaks, and badges are tracked separately per child — switch kids by tapping the name chip up top.<br><br>
        • <b>Everything is saved on this computer only.</b> No accounts, no ads, no fees, works without internet. Aim for <b>10 questions a day</b> per kid.
      </p>
    </div>
  </div>`;
  $('#addKid2').onclick = renderAddKid;
  $('#backHome').onclick = () => show(kid() ? 'today' : 'kids');
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
      if (DB.activeKid === k.id) DB.activeKid = null;
      save(); renderGrownups();
    }
  });
}

// ---------------- utils ----------------
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function escAttr(s) { return esc(s); }

// ---------------- boot ----------------
show(kid() ? 'today' : 'kids');
