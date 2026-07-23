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
  SPRINT = { drill, right: 0, total: 0, end: Date.now() + SPRINT_SECONDS * 1000, locked: false };
  VIEW = 'session';
  app.innerHTML = `
    <div class="practice-top">
      <button class="btn small ghost back" id="sprintQuit">← Stop</button>
      <div class="title">⚡ ${drill.name}</div>
      <div class="scorebox"><span class="plant">⚡</span><span class="num" id="sprintScore">0</span></div>
    </div>
    <div class="card qcard" style="padding-top:18px">
      <div class="sprint-timer"><i id="sprintBar"></i></div>
      <div class="qprompt" style="margin-top:14px">Answer as many as you can — go!</div>
      <div class="bignum" id="sprintQ" style="margin:10px 0"></div>
      <div class="answer-row">
        <input class="num-input" id="sprintIn" inputmode="numeric" autocomplete="off">
        <button class="btn primary big" id="sprintCheck">✓</button>
        <button class="btn ghost" id="sprintPass">Pass ▸</button>
      </div>
      <div id="sprintFlash" style="min-height:34px;margin-top:10px;font-weight:800;font-size:18px"></div>
    </div>`;
  window.scrollTo(0, 0);

  $('#sprintQuit').onclick = () => { clearInterval(SPRINT.timer); show('today'); };
  $('#sprintCheck').onclick = sprintCheck;
  $('#sprintPass').onclick = () => sprintAnswer(null);
  $('#sprintIn').addEventListener('keydown', e => { if (e.key === 'Enter') sprintCheck(); });

  SPRINT.timer = setInterval(() => {
    const left = SPRINT.end - Date.now();
    const bar = $('#sprintBar');
    if (bar) bar.style.width = Math.max(0, (left / (SPRINT_SECONDS * 1000)) * 100) + '%';
    if (left <= 0) sprintFinish();
  }, 100);

  sprintNext();
}

function sprintNext() {
  SPRINT.q = SPRINT.drill.gen();
  SPRINT.locked = false;
  $('#sprintQ').textContent = SPRINT.q.text + ' = ?';
  const inp = $('#sprintIn');
  inp.value = ''; inp.style.background = '#FFFDF4'; inp.focus();
}

function sprintCheck() {
  const v = $('#sprintIn').value.trim();
  if (v === '' || SPRINT.locked) return;
  sprintAnswer(Number(v.replace(/[,\s]/g, '')));
}

function sprintAnswer(given) {
  if (SPRINT.locked) return;
  SPRINT.locked = true;
  const correct = given === SPRINT.q.ans;
  SPRINT.total++;
  if (correct) SPRINT.right++;
  $('#sprintScore').textContent = SPRINT.right;
  const flash = $('#sprintFlash');
  flash.innerHTML = correct
    ? `<span style="color:var(--leaf-deep)">✓ Yes!</span>`
    : `<span style="color:var(--coral-deep)">${SPRINT.q.text} = ${SPRINT.q.ans}</span>`;
  $('#sprintIn').style.background = correct ? 'var(--ok-bg)' : 'var(--bad-bg)';
  // brief pause on a miss so the correct fact sinks in; instant on a hit
  setTimeout(sprintNext, correct ? 120 : 900);
}

function sprintFinish() {
  clearInterval(SPRINT.timer);
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
