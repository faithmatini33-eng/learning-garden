/* ============================================================
   LEARNING GARDEN — sprint.js
   ⚡ Lightning Round: 60-second math-fact fluency drills.
   Kids race their own personal best — never each other.
   Counts toward the daily log (streaks) but not mastery scores,
   so time pressure never hurts a garden score.
   ============================================================ */

const SPRINT_DRILLS = [
  { id: 'spr_add', name: 'Addition facts', emoji: '➕',
    gen: () => { const a = ri(2, 10), b = ri(2, 10); return { text: `${a} + ${b}`, ans: a + b }; } },
  { id: 'spr_sub', name: 'Subtraction facts', emoji: '➖',
    gen: () => { const a = ri(5, 18), b = ri(2, a - 2); return { text: `${a} − ${b}`, ans: a - b }; } },
  { id: 'spr_dbl', name: 'Doubles', emoji: '👯',
    gen: () => { const a = ri(2, 12); return { text: `${a} + ${a}`, ans: a + a }; } },
  { id: 'spr_mix', name: 'Mixed facts', emoji: '🌀',
    gen: () => {
      if (ri(0, 1)) { const a = ri(2, 10), b = ri(2, 10); return { text: `${a} + ${b}`, ans: a + b }; }
      const a = ri(5, 18), b = ri(2, a - 2); return { text: `${a} − ${b}`, ans: a - b };
    } },
];

const SPRINT_SECONDS = 60;
let SPRINT = null;

function sprintBest(drillId, kidId = DB.activeKid) {
  DB.sprint = DB.sprint || {};
  DB.sprint[kidId] = DB.sprint[kidId] || {};
  return DB.sprint[kidId][drillId] || { best: 0, plays: 0 };
}

function startSprint(drillId) {
  const drill = SPRINT_DRILLS.find(d => d.id === drillId);
  if (!drill) return;
  clearInterval(SPRINT && SPRINT.timer);
  const best = sprintBest(drillId).best;
  SPRINT = { drill, right: 0, total: 0, end: Date.now() + SPRINT_SECONDS * 1000, locked: false, entry: '', last: [] };
  VIEW = 'session';
  $('#tabbar').style.display = 'none';
  document.body.classList.add('no-brand');
  app.innerHTML = `
    <div class="practice-top" style="background:#fff;border:1px solid var(--border);border-radius:var(--r-card);box-shadow:var(--shadow-card);padding:10px 14px">
      <button class="back" id="sprintQuit" aria-label="Stop">${icon('x', 18)}</button>
      <span class="subj-ico" style="width:34px;height:34px;background:var(--blue-tint);color:var(--blue)">${icon('zap', 17)}</span>
      <div class="title">Sprint · ${drill.name}</div>
      <span class="pill" style="white-space:nowrap;color:var(--green)">${icon('check', 14)} <span id="sprintScore">0</span> solved</span>
      <span class="pill gold" style="white-space:nowrap">${icon('award', 14)} best ${best}</span>
    </div>
    <div class="sprint-stage">
      <div class="sprint-side">
        <div class="timer-ring" id="timerRing"><div class="timer-inner"><b id="timerText">1:00</b><small>left</small></div></div>
        <div class="dot-row" id="dotRow"></div>
        <small class="eyebrow">last 6 answers</small>
      </div>
      <div class="sprint-main">
        <div class="sprint-problem card"><span id="sprintQ"></span><span class="sprint-slot"><b id="sprintEntry"></b><i class="caret"></i></span></div>
        <div class="keypad" id="keypad">
          ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="key" data-k="${n}">${n}</button>`).join('')}
          <button class="key del" data-k="del">${icon('left', 20)}</button>
          <button class="key" data-k="0">0</button>
          <button class="key ok" data-k="ok">${icon('check', 22)}</button>
        </div>
      </div>
    </div>
    <div class="mascot"><span class="fox">🦊</span><span class="say" id="sprintSay">Ready? Answer as many as you can!</span></div>`;
  window.scrollTo(0, 0);

  $('#sprintQuit').onclick = () => {
    clearInterval(SPRINT.timer);
    document.removeEventListener('keydown', SPRINT.keyHandler);
    show('today');
  };
  $$('#keypad .key').forEach(kb => kb.onclick = () => {
    sfx('key');
    const v = kb.dataset.k;
    if (v === 'del') SPRINT.entry = SPRINT.entry.slice(0, -1);
    else if (v === 'ok') return sprintCheck();
    else if (SPRINT.entry.length < 3) SPRINT.entry += v;
    $('#sprintEntry').textContent = SPRINT.entry;
  });
  SPRINT.keyHandler = (e) => {
    if (/^[0-9]$/.test(e.key)) { if (SPRINT.entry.length < 3) { SPRINT.entry += e.key; sfx('key'); } }
    else if (e.key === 'Backspace') SPRINT.entry = SPRINT.entry.slice(0, -1);
    else if (e.key === 'Enter') return sprintCheck();
    else return;
    const el = $('#sprintEntry'); if (el) el.textContent = SPRINT.entry;
  };
  document.addEventListener('keydown', SPRINT.keyHandler);

  SPRINT.timer = setInterval(() => {
    const left = Math.max(0, SPRINT.end - Date.now());
    const ring = $('#timerRing'), txt = $('#timerText');
    if (ring) {
      const pct = (left / (SPRINT_SECONDS * 1000)) * 100;
      ring.style.background = `conic-gradient(#4A7FB5 ${pct}%, #E9E0D0 0)`;
    }
    if (txt) {
      const s = Math.ceil(left / 1000);
      txt.textContent = `0:${String(s % 60).padStart(2, '0')}`;
    }
    if (left <= 0) sprintFinish();
  }, 100);

  sprintNext();
}

function sprintNext() {
  SPRINT.q = SPRINT.drill.gen();
  SPRINT.locked = false;
  SPRINT.entry = '';
  const q = $('#sprintQ'), en = $('#sprintEntry');
  if (q) q.textContent = SPRINT.q.text + ' =';
  if (en) en.textContent = '';
  const card = $('.sprint-problem');
  if (card) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
}

function sprintCheck() {
  if (SPRINT.entry === '' || SPRINT.locked) return;
  sprintAnswer(Number(SPRINT.entry));
}

function sprintDots() {
  const row = $('#dotRow');
  if (!row) return;
  row.innerHTML = SPRINT.last.slice(-6).map(ok =>
    `<span class="dot ${ok ? 'ok' : 'miss'}"></span>`).join('') || '<span class="eyebrow">go!</span>';
}

function sprintAnswer(given) {
  if (SPRINT.locked) return;
  SPRINT.locked = true;
  const correct = given === SPRINT.q.ans;
  SPRINT.total++;
  if (correct) SPRINT.right++;
  SPRINT.last.push(correct);
  $('#sprintScore').textContent = SPRINT.right;
  sprintDots();
  sfx(correct ? 'correct' : 'wrong');
  const say = $('#sprintSay');
  const best = sprintBest(SPRINT.drill.id).best;
  if (say) {
    const toBeat = best - SPRINT.right + 1;
    say.textContent = !correct ? `${SPRINT.q.text} = ${SPRINT.q.ans} — you've got the next one!`
      : best && toBeat > 0 && toBeat <= 3 ? `${toBeat} more beats your best!`
      : best && toBeat <= 0 ? 'NEW RECORD territory — keep going! 🏆'
      : 'Nice! Keep it rolling!';
  }
  const en = $('#sprintEntry');
  if (en) en.style.color = correct ? 'var(--green)' : 'var(--terra)';
  setTimeout(() => { if (en) en.style.color = ''; sprintNext(); }, correct ? 150 : 900);
}

function sprintFinish() {
  clearInterval(SPRINT.timer);
  if (SPRINT.keyHandler) document.removeEventListener('keydown', SPRINT.keyHandler);
  const { drill, right, total } = SPRINT;
  const rec = sprintBest(drill.id);
  const isPB = right > rec.best;
  DB.sprint[DB.activeKid][drill.id] = { best: Math.max(rec.best, right), plays: rec.plays + 1 };

  // count toward the daily log (streaks) — but never toward mastery scores
  const log = kidLog();
  const day = log[dstr()] || { t: 0, c: 0, per: {} };
  day.t += total; day.c += right;
  log[dstr()] = day;
  save();

  if (isPB && right > 0) burst(80, true); else if (right > 0) burst(24);
  const acc = total ? Math.round((right / total) * 100) : 0;
  app.innerHTML = `<div class="reveal"><div class="card pop mastered-banner">
    <span class="flower">${isPB && right > 0 ? '🏆' : '⚡'}</span>
    <h2 style="justify-content:center">${isPB && right > 0 ? 'NEW PERSONAL BEST!' : 'Time!'}</h2>
    <p style="font-weight:800;font-size:20px;margin:8px 0 2px">${right} correct in ${SPRINT_SECONDS} seconds</p>
    <p class="note">${total} tried · ${acc}% right · your best: <b>${Math.max(rec.best, right)}</b></p>
    <p style="font-weight:700;margin-top:8px">${isPB && right > 0
      ? 'You beat your own record — that\'s the only race that matters! 🌟'
      : right >= rec.best - 2 && rec.best > 0
        ? `So close to your record of ${rec.best} — one more try? 👀`
        : 'Fast facts make everything else easier. Practice makes speedy!'}</p>
    <div class="answer-row">
      <button class="btn coral big" id="sprintAgain">⚡ Go again</button>
      <button class="btn primary big" id="sprintHome">To my garden</button>
    </div>
  </div></div>`;
  $('#sprintAgain').onclick = () => startSprint(drill.id);
  $('#sprintHome').onclick = () => show('today');
}

// card used on the Today page
function sprintCardHTML() {
  const rows = SPRINT_DRILLS.map(d => {
    const rec = sprintBest(d.id);
    return `<button class="btn ghost" data-sprint="${d.id}">${d.emoji} ${d.name}${rec.best ? ` · 🏆 ${rec.best}` : ''}</button>`;
  }).join('');
  return `<div class="card tilt-r">
    <h2><span class="bubble" style="background:var(--coral)">⚡</span>Lightning Round</h2>
    <p style="font-weight:700">60 seconds of math facts — race YOUR own record. Fast facts are a superpower for everything else!</p>
    <div class="answer-row" style="justify-content:flex-start;flex-wrap:wrap">${rows}</div>
  </div>`;
}
