/* ============================================================
   LEARNING GARDEN — Computer class (typing) ⌨️
   Keyboard skills for little hands: home row → letters →
   words → sentences. Uses the normal practice engine
   (type-what-you-see), so mastery, plans & streaks all work.
   ============================================================ */

SUBJECTS.splice(5, 0, { id: 'typing', name: 'Computer', emoji: '💻', color: 'var(--sky)' });

STRANDS.push(
  { id: 'type_kb', subject: 'typing', name: 'Keyboard Basics', emoji: '⌨️', color: 'var(--sky)',
    lesson: `<p><b>Your fingers have home seats on the keyboard! 🪑</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>The <b>home row</b> is where your fingers rest: left hand on <b>A S D F</b>, right hand on <b>J K L</b>.</li>
        <li>Feel the little <b>bumps</b> on F and J? Those help your pointer fingers find home without looking!</li>
        <li>Sit up tall, feet flat, wrists floating like you're holding a bubble under each hand. 🫧</li>
        <li>Press the <b>space bar</b> with your thumb.</li>
        <li>Go for <b>accuracy first</b> — speed grows all by itself. Slow and right beats fast and wrong!</li>
      </ul>` },
  { id: 'type_words', subject: 'typing', name: 'Words & Sentences', emoji: '💬', color: 'var(--leaf)',
    lesson: `<p><b>Now put the letters to work!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Type <b>one letter at a time</b> — don't rush. Your fingers are learning a dance. 💃</li>
        <li>Big letters need the <b>Shift</b> key: hold Shift with one hand, tap the letter with the other.</li>
        <li>Every sentence starts with a capital and ends with a period — just like handwriting!</li>
        <li>Made a mistake? <b>Backspace</b> is your friend, not your enemy.</li>
      </ul>` },
);

const TYPE_HOME_BANK = ['ff', 'jj', 'fj', 'jf', 'dd', 'kk', 'dk', 'kd', 'ss', 'll', 'sl', 'aa', 'ask', 'dad', 'sad', 'fall', 'lad', 'flask', 'salad', 'asdf', 'jkl'];
const TYPE_ALL_BANK = ['cat', 'run', 'top', 'wig', 'hen', 'box', 'zip', 'yam', 'quit', 'jam', 'vex', 'pug', 'nod', 'web', 'mix', 'fun', 'got', 'kid', 'sun', 'hop'];
const TYPE_WORD_BANK = ['the', 'and', 'said', 'play', 'jump', 'school', 'friend', 'happy', 'water', 'green', 'little', 'because', 'garden', 'family', 'sister', 'brother', 'pencil', 'monkey', 'yellow', 'winter'];
const TYPE_SENTENCES = [
  'The cat naps in the sun.',
  'I like to read funny books.',
  'We play soccer after school.',
  'My dog can jump very high.',
  'The moon shines at night.',
  'Birds sing in the morning.',
  'I help my mom make dinner.',
  'The frog hops to the pond.',
  'We planted seeds in the garden.',
  'My best friend makes me laugh.',
  'The bus stops at our street.',
  'I brush my teeth every night.',
];

function typingQ(bank, promptText, tip) {
  const target = pick(bank);
  return {
    prompt: promptText,
    body: `<div class="type-target">${esc(target)}</div>`,
    type: 'text', answer: target, exact: true,
    explain: tip || `Nice typing practice! The goal was: <b>${esc(target)}</b>. Accuracy first — speed comes free later! ⌨️`,
  };
}

SKILLS.push(
  {
    id: 'type_home_q', strand: 'type_kb', name: 'Home row keys',
    gen: () => typingQ(TYPE_HOME_BANK, 'Fingers on the home row! Type this, then press Check:', 'Home row practice! Keep those pointer fingers on the F and J bumps. 🪑'),
  },
  {
    id: 'type_letters_q', strand: 'type_kb', name: 'All around the keyboard',
    gen: () => typingQ(TYPE_ALL_BANK, 'Type this word — one letter at a time:'),
  },
  {
    id: 'type_words_q', strand: 'type_words', name: 'Type real words',
    gen: () => typingQ(TYPE_WORD_BANK, 'Type this word, then Check:'),
  },
  {
    id: 'type_sentence_q', strand: 'type_words', name: 'Type a whole sentence',
    gen: () => {
      const s = pick(TYPE_SENTENCES);
      return {
        prompt: 'Type this whole sentence — capital letter, spaces, and the period too!',
        body: `<div class="type-target" style="font-size:24px">${esc(s)}</div>`,
        type: 'text', answer: s, exact: true, wide: true,
        explain: `The sentence was: <b>${esc(s)}</b> — check the capital at the start and the period at the end. You're really typing now! 💻`,
      };
    },
  },
);

// ============================================================
// 7a — the typing session: on-screen keyboard, finger hints,
// per-letter coloring, kid-sized wpm & accuracy.
// ============================================================
const FINGER_FOR = {
  q: 'left pinky', a: 'left pinky', z: 'left pinky',
  w: 'left ring', s: 'left ring', x: 'left ring',
  e: 'left middle', d: 'left middle', c: 'left middle',
  r: 'left pointer', f: 'left pointer', v: 'left pointer', t: 'left pointer', g: 'left pointer', b: 'left pointer',
  y: 'right pointer', h: 'right pointer', n: 'right pointer', u: 'right pointer', j: 'right pointer', m: 'right pointer',
  i: 'right middle', k: 'right middle',
  o: 'right ring', l: 'right ring',
  p: 'right pinky', ';': 'right pinky', '.': 'right ring', ' ': 'a thumb',
};
const KB_ROWS = ['qwertyuiop', 'asdfghjkl;', 'zxcvbnm.'];
const HOME_KEYS = 'asdfjkl;';

let TYPING = null;

function renderTypingSession(sk) {
  // 5 fresh targets = one "day's worth" of this skill
  const targets = [];
  let guard = 0;
  while (targets.length < SKILL_DONE_Q && guard++ < 40) {
    const t = sk.gen().answer;
    if (!targets.includes(t) || guard > 25) targets.push(t);
  }
  if (TYPING && TYPING.keyHandler) document.removeEventListener('keydown', TYPING.keyHandler);
  TYPING = { sk, targets, ti: 0, pos: 0, errors: 0, wordErrors: 0, keys: 0, good: 0, start: Date.now() };
  VIEW = 'session';
  $('#tabbar').style.display = 'none';
  document.body.classList.add('no-brand');

  app.innerHTML = `
    <div class="practice-top" style="background:#fff;border:1px solid var(--border);border-radius:var(--r-card);box-shadow:var(--shadow-card);padding:10px 14px">
      <button class="back" id="typeQuit" aria-label="Done">${icon('left', 18)}</button>
      <span class="subj-ico" style="width:34px;height:34px;background:var(--blue-tint);color:var(--blue)">${icon('laptop', 17)}</span>
      <div class="title">Computer · ${sk.name}</div>
      <span class="type-progress"><i id="typeBar"></i></span>
      <span style="font-weight:700;font-size:12.5px;color:var(--soft);white-space:nowrap"><span id="typeCount">1</span> of ${SKILL_DONE_Q}</span>
      <span class="pill" style="white-space:nowrap">${icon('zap', 14)} <span id="wpmChip">0</span> wpm</span>
      <span class="pill" style="white-space:nowrap;color:var(--green)">${icon('check', 14)} <span id="accChip">100</span>%</span>
    </div>
    <div class="type-stage">
      <div class="card type-line" id="typeLine"></div>
      <div class="card kb-card">
        <div id="kbRows"></div>
        <div class="kb-space-row"><button class="kb-key kb-space" data-key=" "></button></div>
        <div class="kb-legend">
          <span><i class="lg-sq home"></i> home row — fingers rest here</span>
          <span><i class="lg-sq next"></i> <span id="fingerHint">press this one next</span></span>
        </div>
      </div>
    </div>
    <div class="mascot"><span class="fox">🦊</span><span class="say">Eyes on the screen, not your hands!</span></div>
    <span class="g-chip" style="position:fixed;right:22px;bottom:22px;z-index:30">Words planted <b style="color:var(--blue)">&nbsp;<span id="plantedChip">0</span> of ${SKILL_DONE_Q}</b></span>`;

  $('#typeQuit').onclick = () => typingExit('practice');
  buildKeyboard();
  paintTarget();

  TYPING.keyHandler = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') return typingExit('practice');
    if (e.key.length === 1) { e.preventDefault(); typingPress(e.key); }
  };
  document.addEventListener('keydown', TYPING.keyHandler);
  window.scrollTo(0, 0);
}

function typingExit(view) {
  if (TYPING && TYPING.keyHandler) document.removeEventListener('keydown', TYPING.keyHandler);
  TYPING = null;
  show(view);
}

function buildKeyboard() {
  $('#kbRows').innerHTML = KB_ROWS.map((row, i) => `
    <div class="kb-row" style="padding-left:${i * 18}px">${[...row].map(ch =>
      `<button class="kb-key ${HOME_KEYS.includes(ch) ? 'home' : ''} ${ch === 'f' || ch === 'j' ? 'bump' : ''}" data-key="${ch}">${ch === ';' ? ';' : ch.toUpperCase()}</button>`
    ).join('')}</div>`).join('');
  $$('.kb-key').forEach(k => k.onclick = () => typingPress(k.dataset.key));
}

function paintTarget() {
  const target = TYPING.targets[TYPING.ti];
  $('#typeLine').innerHTML = [...target].map((ch, i) => {
    const cls = i < TYPING.pos ? 'done' : i === TYPING.pos ? 'cur' : 'todo';
    return `<span class="tl-ch ${cls}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`;
  }).join('');
  // highlight next key + finger hint
  const next = (target[TYPING.pos] || '').toLowerCase();
  $$('.kb-key').forEach(k => k.classList.toggle('next', k.dataset.key === next));
  const f = FINGER_FOR[next];
  $('#fingerHint').textContent = f ? `press this one next (${f})` : 'press this one next';
  $('#typeCount').textContent = TYPING.ti + 1;
  $('#typeBar').style.width = `${(TYPING.ti / SKILL_DONE_Q) * 100}%`;
  $('#plantedChip').textContent = TYPING.ti;
}

function typingStats() {
  const mins = Math.max((Date.now() - TYPING.start) / 60000, 0.05);
  $('#wpmChip').textContent = Math.max(0, Math.round((TYPING.good / 5) / mins));
  $('#accChip').textContent = TYPING.keys ? Math.round((TYPING.good / TYPING.keys) * 100) : 100;
}

function typingPress(key) {
  if (!TYPING) return;
  const target = TYPING.targets[TYPING.ti];
  const expected = target[TYPING.pos];
  if (expected === undefined) return;
  TYPING.keys++;
  const match = key === expected || key.toLowerCase() === expected.toLowerCase();
  if (match) {
    TYPING.good++; TYPING.pos++;
    sfx('key');
    if (TYPING.pos >= target.length) return typingWordDone();
  } else {
    TYPING.errors++; TYPING.wordErrors++;
    sfx('wrong');
    const cur = $('.tl-ch.cur');
    if (cur) { cur.classList.remove('shake'); void cur.offsetWidth; cur.classList.add('shake'); }
  }
  typingStats();
  paintTarget();
}

function typingWordDone() {
  const clean = TYPING.wordErrors <= 1;
  recordTypingAnswer(TYPING.sk, clean);
  TYPING.wordErrors = 0;
  TYPING.ti++; TYPING.pos = 0;
  typingStats();
  if (TYPING.ti >= SKILL_DONE_Q) return typingFinish();
  sfx('correct');
  paintTarget();
}

function recordTypingAnswer(sk, correct) {
  const st = kidStats();
  const cur = st[sk.id] || { s: 0, a: 0, c: 0 };
  const before = cur.s;
  if (correct) { cur.s = Math.min(100, cur.s + (cur.s < 50 ? 8 : cur.s < 80 ? 6 : 4)); cur.c++; }
  else cur.s = Math.max(0, cur.s - Math.min(6, 2 + Math.floor(cur.s / 25)));
  cur.a++; st[sk.id] = cur;
  const log = kidLog(); const day = log[dstr()] || { t: 0, c: 0, per: {} };
  day.t++; if (correct) day.c++;
  day.per[sk.id] = day.per[sk.id] || [0, 0];
  day.per[sk.id][1]++; if (correct) day.per[sk.id][0]++;
  log[dstr()] = day; save();
  const stageOf = (s) => s >= 100 ? 4 : s >= 75 ? 3 : s >= 50 ? 2 : s >= 25 ? 1 : 0;
  if (correct && stageOf(cur.s) > stageOf(before)) sfx('grow');
}

function typingFinish() {
  document.removeEventListener('keydown', TYPING.keyHandler);
  const mins = Math.max((Date.now() - TYPING.start) / 60000, 0.05);
  const wpm = Math.max(0, Math.round((TYPING.good / 5) / mins));
  const acc = TYPING.keys ? Math.round((TYPING.good / TYPING.keys) * 100) : 100;
  const sk = TYPING.sk;
  const score = skillStat(sk.id).s;
  sfx('cheer'); burst(60, true);
  app.innerHTML = `<div class="reveal"><div class="card mastered-banner" style="max-width:560px;margin:40px auto">
    <span style="display:inline-block">${plantSVG(score, 76)}</span>
    <h2 style="justify-content:center">Words planted! 🌱</h2>
    <div class="stat-row" style="max-width:380px;margin:14px auto 6px">
      <div class="stat-tile"><div class="v" style="color:var(--blue)">${wpm}</div><div class="l">wpm</div></div>
      <div class="stat-tile"><div class="v" style="color:var(--green)">${acc}%</div><div class="l">accuracy</div></div>
      <div class="stat-tile"><div class="v">${score}</div><div class="l">garden score</div></div>
    </div>
    <p class="note">Accuracy first — speed grows all by itself. Great hands!</p>
    <div class="answer-row">
      <button class="btn primary big" id="typeAgain">Type more ⌨️</button>
      <button class="btn ghost big" id="typeBack">Back to practice</button>
    </div>
  </div></div>`;
  const again = TYPING.sk;
  TYPING = null;
  $('#typeAgain').onclick = () => renderTypingSession(again);
  $('#typeBack').onclick = () => show('practice');
}
