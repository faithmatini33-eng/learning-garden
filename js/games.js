/* ============================================================
   LEARNING GARDEN — games.js · Game Corner (design turns 18–21)
   Seven games, one shell. Non-negotiables (HANDOFF §1):
   answers POWER play, never gate it · gentle wrong (nudge + soft
   tone, never red/buzzer/lost points) · no mandatory timers ·
   tickets buy cosmetics only · every question comes from the live
   skill map and writes back (source: game) · offline, per kid.
   Pip = the fox (crafted foxFullSVG, never emoji).
   ============================================================ */

// ---------------- data model (HANDOFF §4) ----------------
function kidGames(kidId = DB.activeKid) {
  DB.games = DB.games || {};
  const g = DB.games[kidId] = DB.games[kidId] || {};
  g.tickets = g.tickets || 0;
  g.minutesToday = g.minutesToday || 0;
  g.lastPlayedDate = g.lastPlayedDate || null;
  if (g.lastPlayedDate !== dstr()) { g.minutesToday = 0; g.lastPlayedDate = dstr(); g.nudgeDismissed = false; }
  g.lastFeatured = g.lastFeatured || [];
  g.perGame = g.perGame || {};
  g.ownedDecorations = g.ownedDecorations || [];
  g.museum = g.museum || [];
  g.events = g.events || [];       // {skillId, correct, ms, source, ts} — capped
  g.siteIndex = g.siteIndex || 0;  // treasure dig progression
  return g;
}
function gamesCfg() {
  DB.settings.games = DB.settings.games || { suggestPlanFirst: true, zippyTimersAllowed: false, dailyMinutes: 30, recapIncludesGames: true };
  return DB.settings.games;
}

// every game answer feeds the SAME skill map as practice (+ event log)
function recordGameAnswer(sk, correct, ms, gameId) {
  recordTypingAnswer(sk, correct); // mastery + daily log (shared pipeline)
  const g = kidGames();
  g.events.push({ skillId: sk.id, correct: !!correct, ms: ms || 0, source: 'game:' + gameId, ts: Date.now() });
  if (g.events.length > 120) g.events.splice(0, g.events.length - 120);
  save();
}

const GAME_LIST = [
  { id: 'bloom', name: 'Bloom Blast', accent: '#4E9B6B', mins: 'about 3 min', chip: 'Math · +facts', chipC: 'math', desc: 'Pop the flower with the right answer.' },
  { id: 'race', name: 'Fox Race', accent: '#D05C38', mins: '2 min', chip: 'Math facts', chipC: 'math', desc: 'Right answers zoom Pip ahead. Race a friendly bot — never the clock.' },
  { id: 'wordgarden', name: 'Word Garden', accent: '#1F8A80', mins: '4 min', chip: 'Spelling', chipC: 'ela', desc: 'Plant letter seeds to spell this week\'s words — each word blooms.' },
  { id: 'memory', name: 'Memory Match', accent: '#8E6BB0', mins: '3 min', chip: 'Any subject', chipC: 'social', desc: 'Flip pairs: 7+8 finds 15, "perro" finds the puppy.' },
  { id: 'quizshow', name: "Owl's Quiz Show", accent: '#C98A2B', mins: '5 min', chip: 'Mixed review', chipC: 'spanish', desc: 'Helper Owl hosts. Pick a category, play solo or head-to-head.', twoP: true },
  { id: 'dig', name: 'Treasure Dig', accent: '#E8A63C', mins: '4 min', chip: 'Science + math', chipC: 'science', desc: 'Answers earn shovels. Dig the grid to uncover a fossil for your collection.' },
  { id: 'puzzle', name: 'Puzzle Corner', accent: '#4A7FB5', mins: 'no rush', chip: 'Logic', chipC: 'typing', desc: 'Patterns, tangrams, sorting. No questions — just thinking.' },
];
const GAME_ART = {
  bloom: () => flowerSVG({ seed: 11, size: 34 }),
  race: () => foxSVG(32),
  wordgarden: () => icon('sprout', 28),
  memory: () => flowerSVG({ seed: 77, size: 32 }),
  quizshow: () => owlSVG(32),
  dig: () => `<span style="font-size:26px">🦴</span>`,
  puzzle: () => icon('puzzle', 28),
};

// ---------------- skill sources ----------------
function growingSkills(kidId = DB.activeKid, subject = null) {
  const st = kidStats(kidId);
  const strandSubject = Object.fromEntries(STRANDS.map(x => [x.id, x.subject]));
  return SKILLS.filter(s => {
    if (s.strand === 'handwriting' || s.strand === 'reading' || strandSubject[s.strand] === 'typing') return false;
    if (subject && strandSubject[s.strand] !== subject) return false;
    const v = st[s.id];
    return v && v.a > 0 && v.s < 100;
  }).sort((a, b) => (st[a.id].s - st[b.id].s));
}
function factSkills(kidId = DB.activeKid) {
  const st = kidStats(kidId);
  const pool = SKILLS.filter(s => ['add', 'sub', 'mult'].includes(s.strand));
  const grown = pool.filter(s => (st[s.id] || {}).a > 0 && (st[s.id] || {}).s < 100);
  return (grown.length ? grown : pool.slice(0, 5));
}
// a numeric question for fact games; falls back through gens until numeric
function factQuestion(sk) {
  for (let i = 0; i < 8; i++) {
    const q = sk.gen(difficultyFor(sk.id));
    if ((q.type === 'num' || q.type === 'line') && isFinite(Number(q.answer)) && Number(q.answer) >= 0 && Number(q.answer) <= 999) {
      return { prompt: q.prompt.replace(/<[^>]+>/g, ' ').trim(), answer: Number(q.answer), say: speakableText(q.prompt) };
    }
  }
  const a = ri(3, 9), b = ri(2, 9);
  return { prompt: `${a} + ${b}`, answer: a + b, say: `${a} plus ${b}` };
}
function factChoices(ans) {
  const opts = new Set([ans]);
  const deltas = shuffle([1, -1, 2, -2, 3]);
  for (const d of deltas) { if (opts.size >= 3) break; if (ans + d >= 0) opts.add(ans + d); }
  return shuffle([...opts]);
}

// ---------------- Today's Pick (HANDOFF §9) ----------------
function computeTodaysPick() {
  const g = kidGames();
  if (g.featuredDate === dstr() && g.featuredGameId) return;
  const day = new Date().getDay();
  let gameId, skillId = null, why = '';
  if (day === 0) { gameId = 'puzzle'; why = 'Sunday is puzzle day — no questions, just clever thinking.'; }
  else {
    const grow = growingSkills();
    const skill = grow[0] || null;
    skillId = skill ? skill.id : null;
    const subj = skill ? (STRANDS.find(x => x.id === skill.strand) || {}).subject : null;
    if (skill && ['add', 'sub', 'mult'].includes(skill.strand)) gameId = g.lastFeatured.includes('bloom') ? 'race' : 'bloom';
    else if (subj === 'ela' && skill.strand === 'spell') gameId = 'wordgarden';
    else if (subj === 'spanish') gameId = 'memory';
    else gameId = 'quizshow';
    if (g.lastFeatured[0] === gameId) {
      const alts = { bloom: 'race', race: 'bloom', wordgarden: 'memory', memory: 'wordgarden', quizshow: 'memory' };
      gameId = alts[gameId] || 'bloom';
    }
    why = skill
      ? `Today it's your <b>${esc(skill.name.toLowerCase())}</b> — the one that's growing fastest right now!`
      : 'A fresh garden — every game plants something new!';
  }
  g.featuredGameId = gameId; g.featuredSkillId = skillId; g.featuredDate = dstr(); g.featuredWhy = why;
  g.lastFeatured = [gameId].concat(g.lastFeatured).slice(0, 2);
  save();
}

// ---------------- shared shell ----------------
let GAME = null;
function gamesMinutesLeft() {
  const lim = gamesCfg().dailyMinutes;
  if (!lim) return Infinity;
  return Math.max(0, lim - kidGames().minutesToday);
}
function gameSpeakQ(text) { speak(speakableText(text), 'en'); }
function gameNudge(el) {
  if (!el) return;
  el.classList.remove('gnudge'); void el.offsetWidth; el.classList.add('gnudge');
  sfx('wrong');
}
function gamesBar(inner) {
  setAppbar(`<button class="back" id="gBack" aria-label="Back">${icon('left', 18)}</button>${inner}`);
  $('#gBack').onclick = () => { GAME = null; renderGames(); };
}
function ticketPill(n) {
  return `<span class="pill tik-pill">${icon('award', 14)} <b id="gTickets">${n}</b></span>`;
}
function payTiles(tiles) {
  return `<div class="pay-row">${tiles.map(([big, small]) => `<div class="pay-tile"><div class="v">${big}</div><div class="l">${small}</div></div>`).join('')}</div>`;
}

// win screen shared frame; then games add their own extras
function gameWin({ title, sub, tiles, extra, againLabel, onAgain }) {
  sfx('cheer'); burst(90, true);
  $('#tabbar').style.display = 'none';
  app.innerHTML = `<div class="reveal lp-center"><div class="complete-card pop" style="max-width:520px">
    <h1 style="font-size:30px;font-weight:800">${title}</h1>
    <p class="note" style="margin-top:6px">${sub}</p>
    ${payTiles(tiles)}
    ${extra || ''}
    <div style="display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap">
      <button class="btn primary big caps-btn" id="gAgain">${againLabel || 'Play again'}</button>
      <button class="btn big" id="gHub">Back to Game Corner</button>
    </div>
  </div></div>`;
  $('#gAgain').onclick = onAgain;
  $('#gHub').onclick = () => { GAME = null; renderGames(); };
  // time limit: the round always finishes — the door closes BETWEEN games
  if (gamesMinutesLeft() <= 0) {
    $('#gAgain').onclick = renderArcadeClosed;
    $('#gHub').onclick = renderArcadeClosed;
  }
}

function renderArcadeClosed() {
  const g = kidGames();
  $('#tabbar').style.display = 'none';
  setAppbar(appbarBrand());
  app.innerHTML = `<div class="reveal arcade-night">
    <div style="text-align:center;max-width:460px;margin:0 auto;padding:40px 0">
      ${foxFullSVG(110, 'stand')}
      <h1 style="font-size:28px;font-weight:800;color:#fff;margin-top:10px">The arcade is closed for today</h1>
      <p style="color:#C9C4DE;font-weight:600;margin-top:8px">You finished your round — nice! Pip is putting the games to bed. ${icon('award', 14)} ${g.ticketsToday || 0} tickets earned today.</p>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:22px">
        <button class="btn big caps-btn" id="acGarden" style="background:#FFD84D;border-color:#FFD84D;color:#2A2320">Visit my garden</button>
        <button class="btn big" id="acLearn" style="background:none;border-color:#5A5478;color:#fff">Keep learning</button>
      </div>
      <p style="color:#8B85A8;font-size:12px;font-weight:600;margin-top:18px">Rounds always finish — the door closes between games, never during one. Learning is never limited.</p>
    </div></div>`;
  $('#acGarden').onclick = () => show('garden');
  $('#acLearn').onclick = () => show('learn');
}

function awardTickets(n) {
  const g = kidGames();
  g.tickets += n;
  g.ticketsToday = (g.ticketsToday || 0) + n;
  save();
  const el = $('#gTickets'); if (el) el.textContent = g.tickets;
}

// ============================================================
// HUB (18a)
// ============================================================
function renderGames() {
  GAME = null;
  computeTodaysPick();
  const g = kidGames();
  const cfg = gamesCfg();
  const lv = levelInfo();
  $('#tabbar').style.display = 'flex';
  setAppbar(`
    <span class="subj-ico" style="width:38px;height:38px;background:var(--terra-tint);color:var(--terra)">${icon('puzzle', 19)}</span>
    <div class="hero-meta"><div class="hi">Game Corner</div></div>
    <span class="ab-spacer"></span>
    ${ticketPill(g.tickets)}
    <span class="pill gold">${starSVG(15)} ${lv.stars}</span>
    <button class="btn small caps-btn" id="gShelf" style="background:var(--terra-tint);border-color:var(--terra-tint);color:var(--terra-dark)">Prize shelf</button>
    ${appbarKidChip()}`);
  $('#gShelf').onclick = renderPrizeShelf;

  const planLeft = (() => {
    const goal = kidSettings().schoolGoal || 3;
    const plan = getWeekPlan();
    const dow = (new Date().getDay() + 6) % 7;
    const core = dow > 4 ? [] : (plan[dow] || []).filter(sid => SKILL_MAP[sid]).slice(0, goal);
    return core.filter(t => !taskDoneToday(t)).length;
  })();
  const banner = (cfg.suggestPlanFirst && planLeft > 0 && !g.nudgeDismissed) ? `
    <div class="pip-banner">
      ${foxSVG(34)}
      <span style="flex:1;min-width:0"><b>Pip says:</b> Today's plan has ${planLeft} quick thing${planLeft > 1 ? 's' : ''} left — games feel even better after!</span>
      <button class="btn caps-btn" id="pipPlan" style="background:#B8491A;border-color:#B8491A;color:#fff">Finish my plan</button>
      <button class="btn small ghost" id="pipAnyway" style="box-shadow:none;border:none;color:var(--muted)">Play anyway</button>
    </div>` : '';

  const heads = (isFinite(gamesMinutesLeft()) && gamesMinutesLeft() <= 5 && gamesMinutesLeft() > 0) ? `
    <div class="pip-banner" style="background:#EFE8F5">
      ${foxSVG(34)}
      <span style="flex:1"><b>The arcade closes soon — pick your last game!</b>
      <span class="arc-track"><i style="width:${Math.round((kidGames().minutesToday / (gamesCfg().dailyMinutes || 1)) * 100)}%"></i></span>
      <span class="note">${Math.round(kidGames().minutesToday)} of ${gamesCfg().dailyMinutes} game minutes used</span></span>
    </div>` : '';

  if (isFinite(gamesMinutesLeft()) && gamesMinutesLeft() <= 0) return renderArcadeClosed();

  const featured = GAME_LIST.find(x => x.id === g.featuredGameId) || GAME_LIST[0];
  const featSkill = g.featuredSkillId && SKILL_MAP[g.featuredSkillId];
  const gridGames = GAME_LIST.filter(x => x.id !== featured.id);
  const grid = gridGames.map(gm => `
    <button class="game-card" data-game="${gm.id}" style="border-top:3px solid ${gm.accent}">
      ${gm.twoP ? '<span class="twop-badge">2 players</span>' : ''}
      <span class="ga-art">${GAME_ART[gm.id] ? GAME_ART[gm.id]() : icon('puzzle', 26)}</span>
      <span class="ga-mins">${gm.mins}</span>
      <b>${gm.name}</b>
      <p>${gm.desc}</p>
      <span class="ga-chip" style="background:${subjUI(gm.chipC).tint};color:${subjUI(gm.chipC).dark}">${gm.chip}</span>
    </button>`).join('');

  app.innerHTML = `<div class="reveal">
    ${banner}${heads}
    <div class="games-grid-wrap">
      <div class="pick-hero">
        <p class="eyebrow" style="color:var(--green)">Today's pick · picked for ${esc(kid().name)}</p>
        <h1 style="font-family:var(--font-head);font-weight:800;font-size:30px;margin:6px 0 8px">${featured.name}</h1>
        <p style="font-weight:600;color:var(--soft);max-width:340px">${featured.desc} ${g.featuredWhy || ''}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
          <span class="pill" style="background:${subjUI(featured.chipC).tint};border-color:transparent;color:${subjUI(featured.chipC).dark}">${featured.chip}</span>
          <span class="pill">${featured.mins}</span>
          <span class="pill">${icon('award', 13)} up to 10</span>
        </div>
        <button class="btn primary big caps-btn pulse-ring" id="playPick" style="margin-top:18px">Play now</button>
        <div class="pick-flowers">${[3, 8, 5].map(sd => flowerSVG({ seed: sd, size: 40 })).join('')}</div>
      </div>
      <div class="games-grid">${grid}</div>
    </div>
  </div>`;
  const goGame = (id) => startGame(id);
  $('#playPick').onclick = () => goGame(featured.id);
  $$('[data-game]').forEach(b => b.onclick = () => goGame(b.dataset.game));
  const pp = $('#pipPlan'); if (pp) pp.onclick = () => show('today');
  const pa = $('#pipAnyway'); if (pa) pa.onclick = () => { kidGames().nudgeDismissed = true; save(); renderGames(); };
}

function startGame(id) {
  sfx('tap');
  ({ bloom: bloomStart, race: raceStart, wordgarden: wgStart, memory: memoryStart, quizshow: qsStart, dig: digStart, puzzle: puzzleStart })[id]();
}

// ============================================================
// BLOOM BLAST (18b) — establishes the game pattern
// ============================================================
function bloomStart() {
  const g = kidGames();
  const skills = factSkills();
  const featured = g.featuredSkillId && skills.find(s => s.id === g.featuredSkillId);
  GAME = { id: 'bloom', skill: featured || skills[0], zippy: false };
  gamesBar(`<div class="title">Bloom Blast</div>`);
  const chips = skills.slice(0, 4).map(s => `<button class="chipbtn bb-skill ${GAME.skill.id === s.id ? 'sel' : ''}" data-s="${s.id}">${esc(s.name)}</button>`).join('');
  app.innerHTML = `<div class="reveal lp-center"><div class="card" style="max-width:420px;margin:0 auto">
    <p class="eyebrow">1 · Start</p>
    <h1 style="font-size:26px;font-weight:800;display:flex;align-items:center;gap:8px">Bloom Blast ${flowerSVG({ seed: 11, size: 30 })}</h1>
    <p class="note" style="margin:6px 0 12px">Pop the flower with the right answer. 10 blooms wins the round.</p>
    <p class="eyebrow">What should the flowers ask?</p>
    <div style="margin:8px 0 4px">${chips}<button class="chipbtn" id="bbSurprise">Surprise me</button></div>
    ${gamesCfg().zippyTimersAllowed ? `<div class="toggle-row" style="margin-top:10px">Zippy timer <span class="note">(off = relaxed pace)</span><button class="tog" id="bbZip"></button></div>` : ''}
    <button class="btn primary big caps-btn" id="bbGo" style="width:100%;margin-top:14px">Let's bloom!</button>
  </div></div>`;
  $$('.bb-skill').forEach(b => b.onclick = () => { GAME.skill = SKILL_MAP[b.dataset.s]; $$('.bb-skill').forEach(x => x.classList.toggle('sel', x === b)); sfx('tap'); });
  $('#bbSurprise').onclick = () => { GAME.skill = pick(skills); sfx('tap'); $('#bbGo').click(); };
  const z = $('#bbZip'); if (z) z.onclick = (e) => { GAME.zippy = !GAME.zippy; e.currentTarget.classList.toggle('on', GAME.zippy); };
  $('#bbGo').onclick = () => { GAME.blooms = 0; GAME.combo = 0; GAME.best = 0; GAME.earned = 0; GAME.right = 0; GAME.missed = {}; bloomQuestion(); };
}

function bloomQuestion() {
  const q = factQuestion(GAME.skill);
  GAME.q = q; GAME.t0 = Date.now(); GAME.tries = 0;
  const choices = factChoices(q.answer);
  gamesBar(`<div class="title">Bloom Blast · ${esc(GAME.skill.name)}</div>
    <span class="ab-spacer"></span>${ticketPill(kidGames().tickets)}
    <span class="pill">Blooms <span class="bb-track"><i style="width:${GAME.blooms * 10}%"></i></span> ${GAME.blooms}/10</span>`);
  app.innerHTML = `<div class="bloom-stage">
    <div class="bloom-sky">
      <div class="gq-card pop">
        <p class="eyebrow" style="text-align:center">Which flower shows…</p>
        <p class="gq-fact">${esc(q.prompt)}</p>
      </div>
      <button class="btn small ghost" id="bbRead" style="margin:10px auto 0;display:flex">${icon('volume', 13)} Read it to me</button>
    </div>
    <div class="bloom-grass">
      <div class="bloom-row">
        ${choices.map((c, i) => `
          <button class="bloom-flower-btn" data-a="${c}">
            <span class="bf-art">${flowerSVG({ seed: 20 + GAME.blooms * 3 + i, size: 96 })}</span>
            <span class="bf-stem"></span>
            <span class="bf-pill">${c}</span>
          </button>`).join('')}
      </div>
      <div class="game-pip">${foxSVG(40)}<span class="say" id="pipSay" style="display:${GAME.combo >= 3 ? 'inline-block' : 'none'}">Three in a row — you're on fire!</span></div>
      <div class="combo-meter"><span class="eyebrow">Sunshine combo</span> ${Array.from({ length: 5 }, (_, i) => `<span class="sun ${i < GAME.combo ? 'on' : ''}">${sunSVG(18)}</span>`).join('')}</div>
    </div>
  </div>`;
  $('#bbRead').onclick = () => gameSpeakQ(q.say || q.prompt);
  gameSpeakQ(q.say || q.prompt);
  $$('.bloom-flower-btn').forEach(b => b.onclick = () => {
    if (Number(b.dataset.a) === q.answer) {
      recordGameAnswer(GAME.skill, GAME.tries === 0, Date.now() - GAME.t0, 'bloom');
      if (GAME.tries === 0) GAME.right++;
      GAME.combo = Math.min(5, GAME.combo + 1); GAME.best = Math.max(GAME.best, GAME.combo);
      GAME.blooms++;
      let t = 1; if (GAME.combo === 5) { t++; GAME.combo = 0; }
      GAME.earned += t; awardTickets(t);
      sfx('correct'); setTimeout(() => sfx('star'), 420);
      b.classList.add('popped');
      $$('.bloom-flower-btn').forEach(x => x.disabled = true);
      setTimeout(() => { if (GAME && GAME.id === 'bloom') { GAME.blooms >= 10 ? bloomWin() : bloomQuestion(); } }, 520);
    } else {
      GAME.tries++;
      GAME.missed[q.prompt] = (GAME.missed[q.prompt] || 0) + 1;
      if (GAME.tries === 1) recordGameAnswer(GAME.skill, false, Date.now() - GAME.t0, 'bloom');
      GAME.combo = 0;
      gameNudge(b);
      const el = document.querySelector('.combo-meter'); if (el) el.querySelectorAll('.sun').forEach(x => x.classList.remove('on'));
    }
  });
}

function bloomWin() {
  const tricky = Object.entries(GAME.missed).find(([, n]) => n >= 2);
  const hook = tricky ? `
    <div class="tutor-hook">${foxSVG(30)}<span>"${esc(tricky[0])}" was tricky — want to see it with blocks? <a href="#" id="hookLearn"><b>Show me</b></a></span></div>` : '';
  gameWin({
    title: `Full bloom, ${esc(kid().name)}! ${flowerSVG({ seed: 11, size: 28 })}`,
    sub: `10 blooms · your best combo was ${GAME.best} in a row.`,
    tiles: [[`${icon('award', 18)} +${GAME.earned}`, 'tickets'], [`${starSVG(18)} +${GAME.right}`, 'stars'], [`${dropSVG(18)} +1`, 'water']],
    extra: hook,
    againLabel: 'Play again',
    onAgain: () => { const s = GAME.skill; GAME = { id: 'bloom', skill: s, blooms: 0, combo: 0, best: 0, earned: 0, right: 0, missed: {} }; bloomQuestion(); },
  });
  const hl = $('#hookLearn');
  if (hl) hl.onclick = (e) => {
    e.preventDefault();
    const les = typeof lessonForSkill === 'function' && lessonForSkill(GAME.skill.id);
    const anyLesson = lessonsForStrand(GAME.skill.strand)[0];
    if (les || anyLesson) startLesson((les || anyLesson).id, GAME.skill.strand);
    else show('helper');
  };
}

// ============================================================
// FOX RACE (19a) — rivals, never clocks
// ============================================================
const RACE_RIVALS = [
  { id: 'shelly', emoji: '🐢', name: 'Shelly', tag: 'easy-going', factor: 1.65 },
  { id: 'beep', emoji: '🤖', name: 'Beep', tag: 'steady', factor: 1.28 },
  { id: 'dash', emoji: '🐇', name: 'Dash', tag: 'speedy', factor: 1.02 },
];
function kidMedianMs() {
  const ev = kidGames().events.filter(e => e.correct && e.ms > 300).slice(-20).map(e => e.ms).sort((a, b) => a - b);
  return ev.length >= 5 ? ev[Math.floor(ev.length / 2)] : 6000;
}
function raceStart() {
  const med = kidMedianMs();
  const rivals = RACE_RIVALS.filter(r => r.id !== 'dash' || med < 4000);
  GAME = { id: 'race', rival: rivals[0], skill: factSkills()[0] };
  gamesBar(`<div class="title">Fox Race</div>`);
  const skills = factSkills();
  app.innerHTML = `<div class="reveal lp-center"><div class="card" style="max-width:460px;margin:0 auto">
    <p class="eyebrow" style="color:var(--terra)">1 · Starting line</p>
    <h1 style="font-size:26px;font-weight:800">Fox Race</h1>
    <p class="note" style="margin:6px 0 12px">Right answers give Pip a boost. First to the flag after 3 laps wins the cup.</p>
    <p class="eyebrow">Pick your rival</p>
    <div style="display:flex;gap:10px;margin:8px 0 12px">
      ${rivals.map((r, i) => `<button class="rival-card ${i === 0 ? 'sel' : ''}" data-r="${r.id}"><span style="font-size:30px">${r.emoji}</span><b>${r.name}</b><small>${r.tag}</small></button>`).join('')}
    </div>
    <p class="note" style="background:var(--bg);border-radius:10px;padding:8px 11px">Rivals pace themselves to <b>your recent speed</b> — Dash only shows up once facts are getting quick. Losing rival always says "great race!"</p>
    <div style="margin:12px 0 4px">${skills.slice(0, 3).map(s => `<button class="chipbtn fr-skill ${GAME.skill.id === s.id ? 'sel' : ''}" data-s="${s.id}">${esc(s.name)}</button>`).join('')}</div>
    <button class="btn primary big caps-btn" id="frGo" style="width:100%;margin-top:10px">3 · 2 · 1 · GO!</button>
  </div></div>`;
  $$('.rival-card').forEach(b => b.onclick = () => { GAME.rival = RACE_RIVALS.find(r => r.id === b.dataset.r); $$('.rival-card').forEach(x => x.classList.toggle('sel', x === b)); sfx('tap'); });
  $$('.fr-skill').forEach(b => b.onclick = () => { GAME.skill = SKILL_MAP[b.dataset.s]; $$('.fr-skill').forEach(x => x.classList.toggle('sel', x === b)); sfx('tap'); });
  $('#frGo').onclick = () => {
    GAME.pip = 0; GAME.bot = 0; GAME.goal = 12; GAME.right = 0; GAME.speedGain = null; GAME.firstMs = {}; GAME.over = false;
    const med2 = kidMedianMs();
    GAME.botStep = GAME.goal / ((GAME.goal * (med2 * GAME.rival.factor)) / 1000); // units per second
    raceQuestion();
    GAME.timer = setInterval(() => {
      if (!GAME || GAME.id !== 'race' || GAME.over) return;
      GAME.bot = Math.min(GAME.goal, GAME.bot + GAME.botStep * 0.5);
      raceTrackPaint();
      if (GAME.bot >= GAME.goal) raceEnd(false);
    }, 500);
  };
}
function raceLap() { return Math.min(3, Math.floor((GAME.pip / GAME.goal) * 3) + 1); }
function raceTrackPaint() {
  const p = $('#pipRun'), b = $('#botRun');
  if (p) p.style.left = `${(GAME.pip / GAME.goal) * 88}%`;
  if (b) b.style.left = `${(GAME.bot / GAME.goal) * 88}%`;
  const lc = $('#lapChip'); if (lc) lc.textContent = `Lap ${raceLap()} of 3`;
}
function raceQuestion() {
  const q = factQuestion(GAME.skill);
  GAME.q = q; GAME.t0 = Date.now(); GAME.tries = 0;
  gamesBar(`<div class="title">Fox Race · ${esc(GAME.skill.name)}</div><span class="ab-spacer"></span><span class="pill" id="lapChip">Lap ${raceLap()} of 3</span>${ticketPill(kidGames().tickets)}`);
  app.innerHTML = `<div class="race-stage">
    <div class="race-sky">
      <div class="gq-card pop" style="display:flex;align-items:center;gap:18px;justify-content:center">
        <p class="gq-fact" style="font-size:44px;margin:0">${esc(q.prompt)}</p>
        <span style="display:flex;gap:8px">${factChoices(q.answer).map(c => `<button class="btn big race-a" data-a="${c}" style="font-size:22px;font-weight:800">${c}</button>`).join('')}</span>
      </div>
      <button class="btn small ghost" id="frRead" style="margin:8px auto 0;display:flex">${icon('volume', 13)} Read it to me</button>
    </div>
    <div class="race-track">
      <div class="race-lane"><span class="runner" id="pipRun">${foxSVG(38)}</span><span class="finish">🏁</span></div>
      <div class="race-lane"><span class="runner" id="botRun" style="font-size:30px">${GAME.rival.emoji}</span><span class="finish">🏁</span></div>
      <p class="race-note">Right answer = speed boost. ${GAME.rival.name} never taunts — it cheers when you win.</p>
    </div>
  </div>`;
  raceTrackPaint();
  $('#frRead').onclick = () => gameSpeakQ(q.say || q.prompt);
  gameSpeakQ(q.say || q.prompt);
  $$('.race-a').forEach(btn => btn.onclick = () => {
    if (GAME.over) return;
    if (Number(btn.dataset.a) === q.answer) {
      const ms = Date.now() - GAME.t0;
      recordGameAnswer(GAME.skill, GAME.tries === 0, ms, 'race');
      if (GAME.tries === 0) GAME.right++;
      const key = q.prompt;
      if (GAME.firstMs[key] && ms < GAME.firstMs[key] - 800) GAME.speedGain = key;
      GAME.firstMs[key] = GAME.firstMs[key] || ms;
      GAME.pip = Math.min(GAME.goal, GAME.pip + 1);
      sfx('correct');
      raceTrackPaint();
      $$('.race-a').forEach(x => x.disabled = true);
      if (GAME.pip >= GAME.goal) return raceEnd(true);
      setTimeout(() => { if (GAME && GAME.id === 'race' && !GAME.over) raceQuestion(); }, 380);
    } else {
      GAME.tries++;
      if (GAME.tries === 1) recordGameAnswer(GAME.skill, false, Date.now() - GAME.t0, 'race');
      gameNudge(btn);
    }
  });
}
function raceEnd(pipWon) {
  GAME.over = true;
  clearInterval(GAME.timer);
  const t = 7;
  awardTickets(t);
  gameWin({
    title: pipWon ? `Pip takes the cup! ${trophySVG(26)}` : 'So close! ' + GAME.rival.name + ' wins by a whisker',
    sub: pipWon ? `${GAME.rival.emoji} "Great race! Your facts got quicker every lap."` : `${GAME.rival.emoji} "Great race!" — same tickets for finishing. Effort pays either way.`,
    tiles: [[`${icon('award', 18)} +${t}`, 'tickets'], [`${starSVG(18)} +${GAME.right}`, 'stars']].concat(GAME.speedGain ? [[`${icon('zap', 18)}`, `${esc(GAME.speedGain)} is fast now!`]] : []),
    againLabel: 'Rematch',
    onAgain: () => { const r = GAME.rival, s = GAME.skill; GAME = { id: 'race', rival: r, skill: s }; $('#frGo') ? null : raceStart(); const go = $('#frGo'); if (go) go.click(); else { raceStart(); } },
  });
}

// ============================================================
// MEMORY MATCH (18e/20b)
// ============================================================
function memoryPairs() {
  // rotate pair type by available skills: fact↔answer, es↔en, word↔emoji
  const spanishBank = (typeof PIC_BANKS !== 'undefined' && PIC_BANKS.animals) ? null : null;
  const type = pick(['fact', 'es', 'fact']);
  const pairs = [];
  if (type === 'es' && SUBJECTS.find(s => s.id === 'spanish')) {
    const bank = [['perro', 'dog'], ['gato', 'cat'], ['casa', 'house'], ['sol', 'sun'], ['agua', 'water'], ['libro', 'book'], ['flor', 'flower'], ['luna', 'moon']];
    shuffle(bank).slice(0, 4).forEach(([es, en], i) => pairs.push({ k: i, a: es, b: en }));
    return { type: 'Spanish pairs', pairs, skill: SKILLS.find(s => (STRANDS.find(x => x.id === s.strand) || {}).subject === 'spanish') || factSkills()[0] };
  }
  const sk = factSkills()[0];
  const seen = new Set();
  let guard = 0;
  while (pairs.length < 4 && guard++ < 40) {
    const q = factQuestion(sk);
    if (seen.has(q.answer)) continue;
    seen.add(q.answer);
    pairs.push({ k: pairs.length, a: q.prompt, b: String(q.answer) });
  }
  return { type: sk.name, pairs, skill: sk };
}
function memoryStart() {
  const { type, pairs, skill } = memoryPairs();
  GAME = { id: 'memory', skill, found: 0, lock: false, up: [], tickets: 0 };
  const cards = shuffle(pairs.flatMap(p => [{ k: p.k, label: p.a }, { k: p.k, label: p.b }]));
  gamesBar(`<div class="title">Memory Match · ${esc(type)}</div><span class="ab-spacer"></span><span class="pill" id="mmFound">0 pairs found</span>${ticketPill(kidGames().tickets)}`);
  app.innerHTML = `<div class="reveal lp-center">
    <div class="mm-grid">
      ${cards.map((c, i) => `<button class="mm-card" data-k="${c.k}" data-i="${i}">
        <span class="mm-back">${flowerSVG({ seed: 44, size: 34 })}</span>
        <span class="mm-face">${esc(c.label)}</span>
      </button>`).join('')}
    </div>
    <div class="game-pip" style="position:static;justify-content:center;margin-top:16px">${foxSVG(36)}<span class="say">Find the pairs — take all the time you like!</span></div>
  </div>`;
  $$('.mm-card').forEach(b => b.onclick = () => {
    if (GAME.lock || b.classList.contains('up') || b.classList.contains('done')) return;
    sfx('tap');
    b.classList.add('up');
    GAME.up.push(b);
    if (GAME.up.length === 2) {
      const [x, y] = GAME.up;
      GAME.up = [];
      if (x.dataset.k === y.dataset.k) {
        x.classList.add('done'); y.classList.add('done');
        GAME.found++;
        $('#mmFound').textContent = `${GAME.found} pairs found`;
        recordGameAnswer(GAME.skill, true, 0, 'memory');
        awardTickets(1); GAME.tickets++;
        sfx('correct'); setTimeout(() => sfx('star'), 400);
        if (GAME.found === 4) setTimeout(memoryWin, 600);
      } else {
        GAME.lock = true;
        sfx('wrong');
        setTimeout(() => { x.classList.remove('up'); y.classList.remove('up'); GAME.lock = false; }, 800);
      }
    }
  });
}
function memoryWin() {
  gameWin({
    title: 'Every pair found!',
    sub: 'Your memory is growing as fast as your garden.',
    tiles: [[`${icon('award', 18)} +${GAME.tickets}`, 'tickets'], [`${starSVG(18)} +${GAME.found}`, 'stars']],
    againLabel: 'Play again',
    onAgain: memoryStart,
  });
}

// ============================================================
// WORD GARDEN (21a)
// ============================================================
function wgWords() {
  // this week's spelling: custom ela lessons first, then tricky words, then spell bank
  const out = [];
  (DB.custom || []).filter(c => c.subject === 'ela' || c.subject === 'custom').forEach(c =>
    c.items.forEach(it => { if (/^[a-z]{3,9}$/i.test(it.a)) out.push(it.a.toLowerCase()); }));
  (kidSettings().trickyWords || []).forEach(w => { if (/^[a-z]{3,9}$/.test(w)) out.push(w); });
  ['jumping', 'singing', 'reading', 'playing', 'friend', 'because', 'little', 'flower', 'garden', 'sunny'].forEach(w => out.push(w));
  return shuffle([...new Set(out)]).slice(0, 5);
}
function wgStart() {
  GAME = { id: 'wordgarden', words: wgWords(), wi: 0, bloomed: [], hints: 0, tickets: 0 };
  GAME.skill = SKILLS.find(s => s.strand === 'spell') || factSkills()[0];
  wgWord();
}
function wgWord() {
  const w = GAME.words[GAME.wi];
  GAME.slots = []; GAME.hinted = false;
  const distractors = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !w.includes(c))).slice(0, Math.max(1, 8 - w.length));
  GAME.tray = shuffle(w.split('').concat(distractors));
  gamesBar(`<div class="title">Word Garden · this week's words</div><span class="ab-spacer"></span>${ticketPill(kidGames().tickets)}
    <span class="pill">${GAME.bloomed.map(() => '🌸').join('')}${'○'.repeat(GAME.words.length - GAME.bloomed.length)} ${GAME.bloomed.length}/${GAME.words.length}</span>`);
  app.innerHTML = `<div class="wg-stage">
    <div class="wg-sky">
      <button class="wg-sentence" id="wgSay">${icon('volume', 15)} "Can you spell <i>${esc(w)}</i>?" <span class="eyebrow">tap to hear again</span></button>
      <div class="wg-slots">${w.split('').map((_, i) => `<span class="wg-slot ${i === 0 ? 'next' : ''}" data-i="${i}"></span>`).join('')}</div>
      <div class="wg-tray">${GAME.tray.map((c, i) => `<button class="wg-seed" data-c="${c}" data-i="${i}">${c}</button>`).join('')}</div>
    </div>
    <div class="wg-grass">
      <div class="wg-bloomrow">${GAME.bloomed.map((bw, i) => `<span class="wg-bloom">${flowerSVG({ seed: 60 + i * 13, size: 44 })}<span class="pill" style="font-size:11px">${esc(bw)}</span></span>`).join('')}</div>
      <div class="game-pip">${foxSVG(38)}<span class="say">${esc(wgCoachLine(w))}</span></div>
      <button class="btn small sunny" id="wgHint" style="position:absolute;right:18px;bottom:18px">${icon('bulb', 13)} Show me one letter</button>
    </div>
  </div>`;
  const sayIt = () => speak(`Can you spell ${w}? ${w.split('').join(', ')}? ${w}!`, 'en');
  $('#wgSay').onclick = () => speak(w, 'en');
  speak(`Can you spell ${w}?`, 'en');
  $('#wgHint').onclick = () => {
    const idx = GAME.slots.length;
    if (idx >= w.length) return;
    GAME.hinted = true; GAME.hints++;
    const seed = [...$$('.wg-seed')].find(b => !b.disabled && b.dataset.c === w[idx]);
    if (seed) seed.classList.add('hint-glow');
    sfx('tap');
  };
  $$('.wg-seed').forEach(b => b.onclick = () => {
    const idx = GAME.slots.length;
    if (idx >= w.length) return;
    if (b.dataset.c === w[idx]) {
      b.disabled = true; b.classList.remove('hint-glow');
      GAME.slots.push(b.dataset.c);
      const slot = document.querySelector(`.wg-slot[data-i="${idx}"]`);
      slot.textContent = b.dataset.c; slot.classList.add('filled'); slot.classList.remove('next');
      const nxt = document.querySelector(`.wg-slot[data-i="${idx + 1}"]`); if (nxt) nxt.classList.add('next');
      sfx('tap');
      if (GAME.slots.length === w.length) {
        recordGameAnswer(GAME.skill, !GAME.hinted, 0, 'wordgarden');
        if (GAME.hinted) {
          const s = kidSettings(); s.trickyWords = s.trickyWords || [];
          if (!s.trickyWords.includes(w)) { s.trickyWords.unshift(w); if (s.trickyWords.length > 12) s.trickyWords.length = 12; save(); }
        }
        sfx('grow');
        setTimeout(() => wgBloomed(w), 350);
      }
    } else gameNudge(b);
  });
}
function wgCoachLine(w) {
  const first = w[0];
  return pick([
    `Hmm — what makes the "${first}" sound at the start?`,
    `Sound it out slowly — one seed at a time.`,
    `Listen for each beat: ${syllableGuess ? '' : ''}you've got this.`,
  ]);
}
function wgBloomed(w) {
  GAME.bloomed.push(w);
  const t = 2; GAME.tickets += t; awardTickets(t);
  GAME.wi++;
  if (GAME.wi >= GAME.words.length) {
    gameWin({
      title: 'The word garden is in bloom!',
      sub: `${GAME.bloomed.length} words spelled${GAME.hints ? ` · ${GAME.hints} little hint${GAME.hints > 1 ? 's' : ''} (hinted words come back Friday)` : ' — no hints at all!'}`,
      tiles: [[`${icon('award', 18)} +${GAME.tickets}`, 'tickets'], [`${dropSVG(18)} +1`, 'water']],
      againLabel: 'New words',
      onAgain: wgStart,
    });
  } else {
    sfx('star');
    wgWord();
  }
}

// ============================================================
// OWL'S QUIZ SHOW (18d/20c/19b) — turn-based, fair-match
// ============================================================
const QS_SUBJECTS = [['math', 'Math'], ['ela', 'Reading'], ['science', 'Science'], ['spanish', 'Spanish']];
function qsStart() {
  const kids = DB.kids;
  GAME = { id: 'quizshow', solo: kids.length < 2 };
  gamesBar(`<div class="title">Owl's Quiz Show</div>`);
  app.innerHTML = `<div class="reveal lp-center"><div class="card" style="max-width:440px;margin:0 auto;text-align:center">
    ${owlSVG(64)}
    <h1 style="font-size:26px;font-weight:800;margin-top:8px">Owl's Quiz Show</h1>
    <p class="note" style="margin:6px 0 14px">Pick a category, answer for stars. Turn-based — nobody rushes you.</p>
    <p class="eyebrow">Playing today</p>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:8px">
      ${kids.length >= 2 ? `<button class="btn caps-btn" id="qs2p" style="background:#C98A2B;border-color:#C98A2B;color:#fff">2 players</button>` : ''}
      <button class="btn caps-btn ${kids.length < 2 ? 'primary' : ''}" id="qsSolo">Solo vs. Owl</button>
    </div>
  </div></div>`;
  const begin = (solo) => {
    const players = solo
      ? [{ kidId: DB.activeKid, name: kid().name, avatar: kid().avatar, score: 0, streak: 0 }, { owl: true, name: 'Helper Owl', score: 0, streak: 0 }]
      : DB.kids.slice(0, 2).map(k => ({ kidId: k.id, name: k.name, avatar: k.avatar, score: 0, streak: 0 }));
    GAME = { id: 'quizshow', solo, players, turn: 0, round: 1, used: {}, tickets: {} };
    players.forEach((p, i) => GAME.tickets[i] = 0);
    qsBoard();
  };
  const b2 = $('#qs2p'); if (b2) b2.onclick = () => begin(false);
  $('#qsSolo').onclick = () => begin(true);
}
function qsBoard() {
  const P = GAME.players[GAME.turn];
  if (P.owl) return qsOwlTurn();
  gamesBar(`<div class="title" style="display:flex;align-items:center;gap:10px">${owlSVG(30)} <span class="say" style="background:#fff;border-radius:10px;padding:6px 12px;font-weight:700">${esc(P.name)} picks next — choose a category!</span></div>
    <span class="ab-spacer"></span><span class="pill">Round ${GAME.round} of 3</span>`);
  const tiles = QS_SUBJECTS.map(([sub, label]) => {
    const u = subjUI(sub);
    return `<div class="qs-col"><p class="eyebrow" style="color:${u.color};text-align:center">${label}</p>
      ${[1, 2, 3].map(lvl => {
        const key = sub + ':' + lvl;
        const used = GAME.used[key];
        return `<button class="qs-tile ${used ? 'used' : ''}" data-q="${key}" ${used ? 'disabled' : ''}>
          ${used ? icon('check', 16) : Array.from({ length: lvl }, () => starSVG(16)).join('')}</button>`;
      }).join('')}</div>`;
  }).join('');
  const podiums = GAME.players.map((p, i) => `
    <div class="qs-podium ${i === GAME.turn ? 'active' : ''}">
      ${p.owl ? owlSVG(34) : avatarFace(p.avatar, 34)}
      <span style="flex:1"><b>${esc(p.name)}</b>${i === GAME.turn ? '<small style="color:#C98A2B;font-weight:800;display:block">YOUR TURN!</small>' : (p.owl ? '<small class="note">plays at a friendly pace</small>' : '<small class="note">2nd grade questions too</small>')}</span>
      <span class="pill gold">${starSVG(14)} ${p.score}</span>
    </div>`).join('');
  app.innerHTML = `<div class="reveal qs-wrap">
    <div class="qs-board">${tiles}</div>
    <div class="qs-rail">
      ${podiums}
      <p class="note" style="background:var(--gold-tint);border-radius:12px;padding:9px 12px">${owlSVG(16)} Each player gets questions at <b>their own level</b> — a fair match across grades. Nobody ever loses stars for a wrong answer.</p>
    </div>
  </div>`;
  speak(`${P.name} picks next — choose a category!`, 'en');
  $$('.qs-tile:not(.used)').forEach(b => b.onclick = () => qsQuestion(b.dataset.q));
}
function qsPlayerLevel(p, subject) {
  const st = kidStats(p.kidId);
  const skills = growingSkills(p.kidId, subject);
  return skills[0] || SKILLS.find(s => (STRANDS.find(x => x.id === s.strand) || {}).subject === subject) || factSkills(p.kidId)[0];
}
function qsQuestion(key) {
  const [subject, lvlS] = key.split(':');
  const lvl = +lvlS;
  const P = GAME.players[GAME.turn];
  const sk = qsPlayerLevel(P, subject);
  let q, guard = 0;
  do { q = sk.gen(Math.min(3, lvl)); } while (q.type === 'picture' && guard++ < 6);
  const silly = (typeof QUIZ_SILLY !== 'undefined') ? pick(QUIZ_SILLY) : pick(['🧦 Warm socks', '🍕 A sleepy pizza', '🎩 A fancy hat']);
  let choices = q.type === 'mc' ? q.choices.map(String).slice(0, 3) : factChoices(Number(q.answer) || 0).map(String);
  if (!choices.includes(String(q.answer))) choices[0] = String(q.answer);
  choices = shuffle([...new Set(choices)].slice(0, 3).concat([silly]));
  GAME.q = { q, sk, key, lvl, silly };
  const label = (QS_SUBJECTS.find(([s]) => s === subject) || [])[1] || subject;
  gamesBar(`<div class="title">${label} · ${'⭐'.repeat(lvl)} · ${esc(P.name)}'s turn</div><span class="ab-spacer"></span><span class="pill">${GAME.players.map(p => `${starSVG(13)}${p.score}`).join(' · ')}</span>`);
  app.innerHTML = `<div class="reveal lp-center" style="max-width:640px;margin:0 auto">
    <div class="owl-note" style="margin-bottom:14px">${owlSVG(44)}<span class="say" style="font-size:16px;font-weight:700">${q.prompt}</span></div>
    ${q.body ? `<div class="card" style="text-align:center">${q.body}</div>` : ''}
    <div class="qs-answers">${choices.map(c => `<button class="btn big qs-a" data-a="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>
    ${!GAME.solo ? `<p class="note" style="text-align:center;margin-top:12px">shh — ${esc(P.name)}'s thinking!</p>` : ''}
  </div>`;
  gameSpeakQ(q.prompt);
  let tries = 0;
  $$('.qs-a').forEach(b => b.onclick = () => {
    const right = b.dataset.a === String(q.answer);
    if (right) {
      P.score += lvl; P.streak++;
      if (P.kidId === DB.activeKid) recordGameAnswer(sk, tries === 0, 0, 'quizshow');
      GAME.tickets[GAME.turn] += 1;
      awardTickets(P.kidId === DB.activeKid ? 1 : 0);
      sfx('correct'); setTimeout(() => sfx('star'), 380);
      b.classList.add('right');
      qsExplain(q, true);
    } else {
      tries++;
      P.streak = 0;
      gameNudge(b);
      if (tries >= 2) { b.disabled = true; qsExplain(q, false); }
    }
  });
}
function qsExplain(q, right) {
  const why = q.explain || `${q.answer} it is!`;
  speak(speakableText(String(why)), 'en');
  setTimeout(() => {
    GAME.used[GAME.q.key] = true;
    GAME.turn = (GAME.turn + 1) % GAME.players.length;
    if (GAME.turn === 0) GAME.round++;
    const totalTiles = QS_SUBJECTS.length * 3;
    if (Object.keys(GAME.used).length >= Math.min(totalTiles, GAME.players.length * 3 * 2) || GAME.round > 3) qsWin();
    else qsBoard();
  }, right ? 1200 : 1600);
}
function qsOwlTurn() {
  // Owl "plays" gently: random unused tile, 55% success, celebrates the kid
  const open = [];
  QS_SUBJECTS.forEach(([sub]) => [1, 2, 3].forEach(l => { if (!GAME.used[sub + ':' + l]) open.push(sub + ':' + l); }));
  const key = pick(open);
  const lvl = +key.split(':')[1];
  const P = GAME.players[GAME.turn];
  if (Math.random() < 0.55) P.score += lvl;
  GAME.used[key] = true;
  GAME.turn = 0; GAME.round++;
  if (GAME.round > 3 || open.length <= 1) qsWin(); else qsBoard();
}
function qsWin() {
  const [a, b] = GAME.players;
  const champ = a.score >= b.score ? a : b;
  const other = champ === a ? b : a;
  const award = other.streak >= 3 ? 'Comeback award' : (other.score > 0 ? 'Best category' : 'Bravest guess');
  GAME.players.forEach((p, i) => { if (p.kidId && p.kidId !== DB.activeKid && DB.games) { kidGames(p.kidId).tickets += GAME.tickets[i]; } });
  awardTickets(champ.kidId === DB.activeKid ? 1 : 0); // champion bonus
  gameWin({
    title: 'What a show, you two!',
    sub: `${owlSVG(18)} "Every answer taught us something!"`,
    tiles: [
      [`${champ.owl ? owlSVG(22) : avatarFace(champ.avatar, 22)}`, `Tonight's champion: ${esc(champ.name)} · ${starSVG(12)} ${champ.score}`],
      [`${other.owl ? owlSVG(22) : avatarFace(other.avatar, 22)}`, `${award}: ${esc(other.name)} · ${starSVG(12)} ${other.score}`],
    ],
    againLabel: 'Rematch',
    onAgain: qsStart,
  });
}

// ============================================================
// TREASURE DIG (20a)
// ============================================================
function digSites() {
  if (typeof FOSSIL_SITES !== 'undefined') return FOSSIL_SITES;
  return [{ id: 'canyon', name: 'Sunny Canyon', fossil: { emoji: '🦕', name: 'Brontosaurus', fact: 'A Brontosaurus was longer than two school buses parked end to end!' },
    mask: [[0,1,1,0,0,0],[1,1,1,1,1,0],[0,1,0,0,1,1]] }];
}
function digStart() {
  const g = kidGames();
  const sites = digSites();
  const site = sites[g.siteIndex % sites.length];
  GAME = { id: 'dig', site, shovels: 1, dug: {}, foundTiles: 0, tickets: 0, right: 0 };
  GAME.fossilTiles = site.mask.flat().filter(Boolean).length;
  GAME.skill = growingSkills()[0] || factSkills()[0];
  digPaint();
}
function digQuestionHTML() {
  const sk = pick([GAME.skill].concat(growingSkills().slice(0, 3)));
  let q, guard = 0;
  do { q = sk.gen(difficultyFor(sk.id)); } while ((q.type === 'picture' || (q.body || '').includes('<svg')) && guard++ < 6);
  GAME.q = q; GAME.qsk = sk; GAME.t0 = Date.now(); GAME.qTries = 0;
  const choices = q.type === 'mc' ? shuffle(q.choices.map(String)).slice(0, 3).concat(String(q.answer)).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 3) : factChoices(Number(q.answer) || 0).map(String);
  if (!choices.includes(String(q.answer))) choices[ri(0, choices.length - 1)] = String(q.answer);
  return `<div class="card dig-q">
      <p class="eyebrow" style="color:#E8A63C">Earn a shovel</p>
      <p style="font-family:var(--font-head);font-weight:800;font-size:22px;margin:6px 0 10px">${q.prompt}</p>
      <div style="display:flex;flex-direction:column;gap:8px">${shuffle([...new Set(choices)]).map(c => `<button class="btn dig-a" data-a="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>
    </div>`;
}
function digPaint() {
  const site = GAME.site;
  gamesBar(`<div class="title">Treasure Dig · ${esc(site.name)}</div><span class="ab-spacer"></span><span class="pill">⛏️ <b id="digShovels">${GAME.shovels}</b> shovels</span>${ticketPill(kidGames().tickets)}`);
  const grid = site.mask.map((row, r) => row.map((v, c) => {
    const key = r + ':' + c;
    const dug = GAME.dug[key];
    return `<button class="dig-tile ${dug ? 'dug' : ''}" data-t="${key}">${dug && v ? '🦴' : ''}</button>`;
  }).join('')).join('');
  app.innerHTML = `<div class="dig-stage">
    <div class="dig-left"><div class="dig-grid">${grid}</div></div>
    <div class="dig-right">
      <div id="digQWrap">${digQuestionHTML()}</div>
      <div class="game-pip" style="position:static;margin-top:12px">${foxSVG(36)}<span class="say">${GAME.foundTiles ? `Something BIG is under there… I can see ${GAME.foundTiles} bone${GAME.foundTiles > 1 ? 's' : ''} already!` : 'Something BIG is under there… start digging!'}</span></div>
    </div>
  </div>`;
  gameSpeakQ(GAME.q.prompt);
  digWire();
}
function digWire() {
  $$('.dig-tile').forEach(b => b.onclick = () => {
    const key = b.dataset.t;
    if (GAME.dug[key]) return;
    if (GAME.shovels <= 0) { gameNudge(b); const el = $('#digQWrap'); if (el) el.classList.add('pulse-once'); return; }
    GAME.shovels--;
    GAME.dug[key] = true;
    const [r, c] = key.split(':').map(Number);
    const isFossil = !!GAME.site.mask[r][c];
    b.classList.add('dug');
    if (isFossil) { b.textContent = '🦴'; GAME.foundTiles++; sfx('grow'); } else sfx('tap');
    const sh = $('#digShovels'); if (sh) sh.textContent = GAME.shovels;
    if (GAME.foundTiles >= GAME.fossilTiles) return setTimeout(digComplete, 500);
  });
  $$('.dig-a').forEach(b => b.onclick = () => {
    if (b.dataset.a === String(GAME.q.answer)) {
      recordGameAnswer(GAME.qsk, GAME.qTries === 0, Date.now() - GAME.t0, 'dig');
      if (GAME.qTries === 0) GAME.right++;
      GAME.shovels = Math.min(3, GAME.shovels + 1);
      sfx('correct');
      const sh = $('#digShovels'); if (sh) sh.textContent = GAME.shovels;
      $('#digQWrap').innerHTML = digQuestionHTML();
      gameSpeakQ(GAME.q.prompt);
      digWire();
    } else {
      GAME.qTries++;
      if (GAME.qTries === 1) recordGameAnswer(GAME.qsk, false, Date.now() - GAME.t0, 'dig');
      gameNudge(b);
    }
  });
}
function digComplete() {
  const g = kidGames();
  const f = GAME.site.fossil;
  if (!g.museum.includes(f.name)) g.museum.push(f.name);
  g.siteIndex++;
  const t = 8; GAME.tickets += t; awardTickets(t);
  save();
  speak(f.fact, 'en');
  gameWin({
    title: `A ${esc(f.name)}! <span style="font-size:30px">${f.emoji}</span>`,
    sub: `Dug up with ${GAME.right} shovel answer${GAME.right === 1 ? '' : 's'} · joins your museum shelf.`,
    tiles: [[`${icon('award', 18)} +${t}`, 'tickets'], [`${starSVG(18)} +${GAME.right}`, 'stars'], [`${icon('landmark', 18)} +1`, 'museum']],
    extra: `<div class="tutor-hook">${owlSVG(28)}<span>"${esc(f.fact)}" — every fossil comes with one real fact.</span></div>`,
    againLabel: 'Next dig site',
    onAgain: digStart,
  });
}

// ============================================================
// PUZZLE CORNER (18e/21b) — no questions, no timer, no score
// ============================================================
function puzzleTodayType() {
  return ['sorting', 'patterns', 'tangram', 'maze', 'oddone', 'sorting', 'shadow'][new Date().getDay()] || 'patterns';
}
function puzzleStart() {
  const type = puzzleTodayType();
  const bank = (typeof PUZZLE_BANK !== 'undefined' && PUZZLE_BANK[type] && PUZZLE_BANK[type].length) ? PUZZLE_BANK[type] : null;
  const fallback = [[
    { prompt: 'What comes next?', say: 'What comes next in the pattern?', sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], options: ['🔵', '🔴', '🟡'], answer: '🔵', why: 'Red, blue, red, blue — blue comes next!' },
    { prompt: 'What comes next?', say: 'What comes next?', sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], options: ['🌙', '⭐', '☀️'], answer: '🌙', why: 'Two stars, then a moon — the moon is back!' },
    { prompt: 'What comes next?', say: 'What comes next?', sequence: ['🟢', '🟢', '🟡', '🟢', '🟢'], options: ['🟡', '🟢', '🔴'], answer: '🟡', why: 'Green green yellow — yellow again!' },
  ]];
  const rounds = bank || fallback;
  const dayIdx = Math.floor((Date.now() / 86400000)) % rounds.length;
  GAME = { id: 'puzzle', type, puzzles: rounds[dayIdx], pi: 0, done: 0 };
  puzzlePaint();
}
function puzzlePaint() {
  const p = GAME.puzzles[GAME.pi];
  gamesBar(`<div class="title">Puzzle Corner · ${GAME.type}</div><span class="ab-spacer"></span><span class="pill">no timer · no score</span><span class="pill">${GAME.pi + 1} of ${GAME.puzzles.length}</span>`);
  let body = '';
  if (p.sequence) body = `<div class="pz-seq">${p.sequence.map(x => `<span>${x}</span>`).join('')}<span class="pz-blank"></span></div>`;
  else if (p.items && !p.bins) body = `<div class="pz-seq">${p.items.map(x => `<span>${x}</span>`).join('')}</div>`;
  else if (p.target) body = `<div class="pz-seq"><span style="font-size:40px">${p.target}</span></div>`;
  else if (p.item) body = `<div class="pz-seq"><span style="font-size:52px">${p.item}</span></div>`;
  const opts = (p.options || (p.items && p.bins ? null : p.items) || []);
  if (p.grid) {
    // mini maze: tap adjacent open cells to walk Pip to the acorn
    GAME.pos = GAME.pos || p.start.slice();
    const rows = p.grid.map((row, r) => row.map((v, c) => {
      const here = GAME.pos[0] === r && GAME.pos[1] === c;
      const goal = p.goal[0] === r && p.goal[1] === c;
      return `<button class="maze-cell ${v ? 'hedge' : ''}" data-m="${r}:${c}">${here ? foxSVG(28) : goal ? '🌰' : ''}</button>`;
    }).join('')).join('');
    app.innerHTML = `<div class="reveal lp-center"><div class="card" style="max-width:480px;margin:0 auto;text-align:center">
      <h1 style="font-size:24px;font-weight:800">${esc(p.prompt || 'Help Pip find the acorn!')}</h1>
      <div class="maze-grid" style="grid-template-columns:repeat(${p.grid[0].length}, 56px)">${rows}</div>
      <p class="note" style="margin-top:10px">Tap a square next to Pip to walk.</p>
    </div></div>`;
    speak(p.say || 'Help Pip find the acorn! Tap a square next to him to walk.', 'en');
    $$('.maze-cell').forEach(b => b.onclick = () => {
      const [r, c] = b.dataset.m.split(':').map(Number);
      const [pr, pc] = GAME.pos;
      const adjacent = Math.abs(r - pr) + Math.abs(c - pc) === 1;
      if (!adjacent || p.grid[r][c]) return gameNudge(b);
      sfx('tap');
      GAME.pos = [r, c];
      if (r === p.goal[0] && c === p.goal[1]) { GAME.pos = null; puzzleSolved(p); }
      else puzzlePaint();
    });
    return;
  }
  if (p.bins) {
    // sorting: tap each item, then its bin
    GAME.sortIdx = GAME.sortIdx || 0;
    const [item] = p.items[GAME.sortIdx] || [];
    app.innerHTML = `<div class="reveal lp-center"><div class="card" style="max-width:560px;margin:0 auto;text-align:center">
      <h1 style="font-size:24px;font-weight:800">${esc(p.title || p.prompt || 'Sort them!')}</h1>
      <div class="pz-seq"><span style="font-size:52px">${item}</span></div>
      <p class="note">${GAME.sortIdx + 1} of ${p.items.length} — which basket?</p>
      <div class="qs-answers" style="grid-template-columns:1fr 1fr">${p.bins.map(bn => `<button class="btn big pz-a" data-a="${escAttr(bn)}">${esc(bn)}</button>`).join('')}</div>
    </div></div>`;
    speak(`Which basket: ${p.items[GAME.sortIdx][0]}?`, 'en');
    $$('.pz-a').forEach(b => b.onclick = () => {
      if (b.dataset.a === p.items[GAME.sortIdx][1]) {
        sfx('correct');
        GAME.sortIdx++;
        if (GAME.sortIdx >= p.items.length) { GAME.sortIdx = 0; puzzleSolved(p); } else puzzlePaint();
      } else gameNudge(b);
    });
    return;
  }
  app.innerHTML = `<div class="reveal lp-center"><div class="card" style="max-width:560px;margin:0 auto;text-align:center">
    <h1 style="font-size:24px;font-weight:800">${esc(p.prompt || 'What comes next?')}</h1>
    ${body}
    <div style="display:flex;gap:12px;justify-content:center;margin-top:14px;flex-wrap:wrap">
      ${opts.map(o => `<button class="pz-opt pz-a ${GAME.type === 'shadow' ? 'shadowed' : ''}" data-a="${escAttr(String(o))}">${o}</button>`).join('')}
    </div>
    <p class="note" style="margin-top:12px"><button class="btn small ghost" id="pzAnother">want another?</button></p>
  </div></div>`;
  speak(p.say || p.prompt || 'What comes next?', 'en');
  $('#pzAnother').onclick = () => { GAME.pi = (GAME.pi + 1) % GAME.puzzles.length; puzzlePaint(); };
  $$('.pz-a').forEach(b => b.onclick = () => {
    if (b.dataset.a === String(p.answer)) puzzleSolved(p, b);
    else gameNudge(b);
  });
}
function puzzleSolved(p, btn) {
  sfx('correct');
  if (btn) btn.classList.add('right');
  if (p.why) speak(p.why, 'en');
  GAME.done++;
  GAME.pi++;
  if (GAME.pi >= GAME.puzzles.length) {
    awardTickets(3);
    gameWin({
      title: 'Three clever puzzles!',
      sub: 'No timer, no score — just your thinking. Pip is impressed.',
      tiles: [[`${icon('award', 18)} +3`, 'tickets']],
      againLabel: 'More puzzles',
      onAgain: puzzleStart,
    });
  } else setTimeout(puzzlePaint, 800);
}

// ============================================================
// PRIZE SHELF (18f) + museum
// ============================================================
function shelfDecorations() {
  if (typeof DECORATIONS !== 'undefined') return DECORATIONS;
  return [
    { id: 'mushroom-lamp', emoji: '🍄', name: 'Mushroom lamp', price: 15 },
    { id: 'fountain', emoji: '⛲', name: 'Tiny fountain', price: 40 },
    { id: 'carousel', emoji: '🎠', name: 'Merry-go-round', price: 80 },
  ];
}
function renderPrizeShelf() {
  const g = kidGames();
  GAME = null;
  gamesBar(`<div class="title">Prize shelf</div><span class="ab-spacer"></span>${ticketPill(g.tickets)}`);
  const cards = shelfDecorations().map(d => {
    const owned = g.ownedDecorations.includes(d.id);
    const can = g.tickets >= d.price;
    return `<div class="prize-card ${!owned && !can ? 'locked' : ''}">
      <span class="pz-emoji" style="${!owned && !can ? 'filter:grayscale(1);opacity:.55' : ''}">${d.emoji}</span>
      <b>${esc(d.name)}</b>
      ${owned ? `<span class="pill" style="color:var(--green);background:var(--green-tint);border-color:var(--green-tint)">${icon('check', 12)} owned</span>`
        : `<button class="btn small ${can ? 'primary' : 'ghost'}" data-buy="${d.id}" ${can ? '' : 'disabled'}>${icon('award', 12)} ${d.price}</button>`}
    </div>`;
  }).join('');
  const museum = g.museum.length
    ? `<div class="card"><p class="eyebrow">${icon('landmark', 13)} My museum</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">${g.museum.map(m => {
        const f = digSites().map(s => s.fossil).find(x => x.name === m);
        return `<span class="pill">${f ? f.emoji : '🦴'} ${esc(m)}</span>`;
      }).join('')}</div></div>` : '';
  app.innerHTML = `<div class="reveal" style="max-width:720px;margin:0 auto">
    <p class="note" style="margin-bottom:10px">Tickets buy garden decorations — never learning, never skips.</p>
    <div class="prize-grid">${cards}</div>
    <div class="tutor-hook" style="margin-top:14px">${foxSVG(30)}<span>Everything you buy appears in <b>My Garden</b> — and stays yours forever.</span></div>
    ${museum}
  </div>`;
  $$('[data-buy]').forEach(b => b.onclick = () => {
    if (b.dataset.confirm) {
      const d = shelfDecorations().find(x => x.id === b.dataset.buy);
      g.tickets -= d.price;
      g.ownedDecorations.push(d.id);
      save(); sfx('cheer'); burst(50, true);
      renderPrizeShelf();
    } else {
      b.dataset.confirm = '1';
      b.textContent = 'Tap again to buy!';
      sfx('tap');
      setTimeout(() => { if (b.dataset) { delete b.dataset.confirm; renderPrizeShelf(); } }, 2600);
    }
  });
}


// ============================================================
// GROWN-UPS: game settings + weekly recap + pick rules (§7/§9/§11)
// ============================================================
function gamesSettingsCardHTML() {
  const c = gamesCfg();
  return `<div class="card">
    <h2><span class="bubble" style="background:var(--terra-tint);color:var(--terra)">${icon('puzzle', 16)}</span>Game settings</h2>
    <div class="toggle-row"><span style="flex:1"><b>Suggest Daily Plan first</b><p class="note">Pip nudges toward the plan — games are never locked.</p></span>
      <button class="tog ${c.suggestPlanFirst ? 'on' : ''}" data-gset="suggestPlanFirst"></button></div>
    <div class="toggle-row"><span style="flex:1"><b>Zippy timers</b><p class="note">Default off. Kids can turn one on per round if you allow it.</p></span>
      <button class="tog ${c.zippyTimersAllowed ? 'on' : ''}" data-gset="zippyTimersAllowed"></button></div>
    <div class="toggle-row"><span style="flex:1"><b>Game time per day</b><p class="note">When time's up, the round finishes gracefully — learning is never limited.</p></span>
      <select id="gsetMinutes" style="font-weight:700;padding:6px 10px;border:var(--outline);border-radius:10px">
        ${[10, 15, 20, 30, 45, 60].map(m => `<option value="${m}" ${c.dailyMinutes === m ? 'selected' : ''}>${m} min</option>`).join('')}
        <option value="" ${!c.dailyMinutes ? 'selected' : ''}>No limit</option>
      </select></div>
    <div class="toggle-row"><span style="flex:1"><b>Weekly recap includes games</b><p class="note">"The fastest facts came from Fox Race this week."</p></span>
      <button class="tog ${c.recapIncludesGames ? 'on' : ''}" data-gset="recapIncludesGames"></button></div>
    <p class="note" style="background:var(--bg);border-radius:10px;padding:8px 11px;margin-top:8px">
      <b>How Today's Pick works:</b> ① find a skill that's sprouting or growing with recent practice · ② match it to the game that trains it best · ③ never the same game two days running — Sundays are always Puzzle Corner. Skills improved through games get a small ${icon('puzzle', 11)} mark.</p>
  </div>`;
}
function wireGamesSettingsCard() {
  $$('[data-gset]').forEach(b => b.onclick = () => {
    const c = gamesCfg();
    c[b.dataset.gset] = !c[b.dataset.gset];
    save();
    b.classList.toggle('on', !!c[b.dataset.gset]);
  });
  const m = $('#gsetMinutes');
  if (m) m.onchange = () => { gamesCfg().dailyMinutes = m.value ? +m.value : null; save(); };
}
function gamesRecapHTML(kidId) {
  if (!gamesCfg().recapIncludesGames) return '';
  const g = (DB.games || {})[kidId];
  if (!g || !g.events.length) return '';
  const weekAgo = Date.now() - 7 * 86400000;
  const byGame = {};
  g.events.filter(e => e.ts > weekAgo).forEach(e => {
    const id = e.source.replace('game:', '');
    byGame[id] = byGame[id] || { n: 0, right: 0, skills: new Set() };
    byGame[id].n++; if (e.correct) byGame[id].right++;
    byGame[id].skills.add(e.skillId);
  });
  const rows = Object.entries(byGame).map(([id, v]) => {
    const gm = GAME_LIST.find(x => x.id === id) || { name: id };
    const sk = SKILL_MAP[[...v.skills][0]];
    const outcome = `${Math.round(v.right / v.n * 100)}% right on ${sk ? esc(sk.name.toLowerCase()) : 'skills'}`;
    return `<div class="kid-admin-row" style="border-bottom-style:dotted">
      <span class="nm" style="font-size:14px">${esc(gm.name)} <span style="color:var(--ink-soft);font-size:12.5px">· ${v.n} answers</span></span>
      <b style="color:var(--green);font-size:13px;flex:none">${outcome}</b></div>`;
  }).join('');
  if (!rows) return '';
  return `<div class="card"><h2><span class="bubble" style="background:var(--terra-tint);color:var(--terra)">${icon('puzzle', 16)}</span>Games that helped this week</h2>
    ${rows}<p class="note" style="margin-top:8px">Every game minute practiced a real skill.</p></div>`;
}
