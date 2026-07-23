/* ============================================================
   LEARNING GARDEN — reader.js · Story Reader (design 6b/6c)
   Read-along pages with the spoken word highlighted, tap-a-word
   audio + kid definitions, read-to-me / read-myself modes, then
   the story's comprehension questions. Reading skills route here.
   ============================================================ */

const READER_GLOSSARY = {
  soared: 'flew way up high', hatchlings: 'baby turtles fresh out of their eggs',
  colony: 'a big bug family that lives together', reflects: 'bounces light back like a mirror',
  phases: "the Moon's changing shapes", nectar: 'sweet flower juice that bees love',
  pollen: 'flower dust that helps make seeds', gratitude: 'feeling thankful',
  waddled: 'walked with a wobble', chrysalis: 'the cozy case a caterpillar changes inside',
  erosion: 'land slowly wearing away, bit by bit', mosquitoes: 'tiny biting bugs',
  desegregate: 'let all kids go to school together', huddle: 'squeeze together to stay warm',
  evaporates: 'turns into invisible mist in the air', appeared: 'showed up',
};

let READER = null;

function renderStoryReader(sk) {
  const kind = sk.id === 'read_facts' ? 'facts' : 'story';
  const p = pick(PASSAGES.filter(x => x.kind === kind));
  const sentences = p.text.match(/[^.!?]+[.!?]+"?/g) || [p.text];
  const pages = [];
  for (let i = 0; i < sentences.length; i += 2) pages.push(sentences.slice(i, i + 2).join(' ').trim());
  readerStop();
  READER = { sk, p, pages, pi: 0, mode: 'read', slow: false, qi: 0, right: 0 };

  VIEW = 'session';
  $('#tabbar').style.display = 'none';
  document.body.classList.add('no-brand');
  const u = subjUI('ela');
  app.innerHTML = `
    <div class="practice-top" style="background:#fff;border:1px solid var(--border);border-radius:var(--r-card);box-shadow:var(--shadow-card);padding:10px 14px">
      <button class="back" id="rdQuit" aria-label="Done">${icon('left', 18)}</button>
      <span class="subj-ico" style="width:34px;height:34px;background:${u.tint};color:${u.color}">${icon('book', 17)}</span>
      <div class="title">Reading · ${esc(p.title)}</div>
      <span class="type-progress" style="max-width:260px"><i id="rdBar" style="background:var(--teal)"></i></span>
      <span id="rdPage" style="font-weight:700;font-size:12.5px;color:var(--soft);white-space:nowrap"></span>
      <button class="btn small ghost" id="rdMode" style="white-space:nowrap"></button>
    </div>
    <div class="reader-grid">
      <div class="rd-art">${icon('camera', 26)}<p>Story art for "${esc(p.title)}" —<br>real illustrations coming soon</p></div>
      <div class="rd-panel">
        <div class="rd-text" id="rdText"></div>
        <div class="rd-controls">
          <button class="btn sky caps-btn" id="rdPlay"></button>
          <button class="btn small ghost" id="rdSlow">Slower</button>
          <span class="note" style="flex:1;min-width:120px">Tap any word to hear it and see what it means.</span>
          <button class="back" id="rdPrev" aria-label="Back a page">${icon('left', 17)}</button>
          <span class="pdots" id="rdDots"></span>
          <button class="back" id="rdNext" style="background:var(--terra);color:#fff;border-color:var(--terra)" aria-label="Next page">${icon('right', 17)}</button>
        </div>
      </div>
      <div class="g-tip" id="rdTip" style="display:none"></div>
    </div>`;
  window.scrollTo(0, 0);

  $('#rdQuit').onclick = () => { readerStop(); show('practice'); };
  $('#rdPlay').onclick = () => { READER.mode === 'read' && READER.playing ? readerStop(true) : readerPlay(); };
  $('#rdSlow').onclick = (e) => { READER.slow = !READER.slow; e.target.classList.toggle('sky', READER.slow); if (READER.playing) readerPlay(); };
  $('#rdMode').onclick = () => {
    READER.mode = READER.mode === 'read' ? 'self' : 'read';
    if (READER.mode === 'self') readerStop(true); else readerPlay();
    readerChrome();
  };
  $('#rdPrev').onclick = () => readerGo(-1);
  $('#rdNext').onclick = () => readerGo(1);
  readerPage();
}

function readerChrome() {
  const play = $('#rdPlay'), mode = $('#rdMode');
  if (!play) return;
  play.textContent = '';
  play.innerHTML = READER.playing ? '⏸ Reading to you…' : '▶ Read to me';
  play.style.display = READER.mode === 'self' ? 'none' : 'inline-flex';
  mode.innerHTML = READER.mode === 'read' ? `${icon('book', 13)} I'll read it myself` : `${icon('volume', 13)} Read it to me`;
}

function readerPage() {
  const text = READER.pages[READER.pi];
  const words = text.split(/\s+/);
  $('#rdText').innerHTML = words.map((w, i) => `<span class="rd-word" data-i="${i}">${esc(w)}</span>`).join(' ');
  $('#rdPage').textContent = `page ${READER.pi + 1} of ${READER.pages.length}`;
  $('#rdBar').style.width = `${((READER.pi + 1) / READER.pages.length) * 100}%`;
  $('#rdDots').innerHTML = READER.pages.map((_, i) =>
    `<span class="pdot ${i === READER.pi ? 'on' : ''}"></span>`).join('');
  $$('.rd-word').forEach(el => el.onclick = () => readerWord(el));
  readerChrome();
  if (READER.mode === 'read') setTimeout(() => { if (READER && READER.pi < READER.pages.length) readerPlay(); }, 300);
}

function readerPlay() {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const text = READER.pages[READER.pi];
  const words = text.split(/\s+/);
  // char offset of each word so onboundary can highlight it
  const offsets = []; let pos = 0;
  words.forEach(w => { offsets.push(pos); pos += w.length + 1; });
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; const v = pickVoice('en-US'); if (v) u.voice = v;
  u.rate = READER.slow ? 0.6 : 0.85;
  u.onboundary = (e) => {
    if (e.name !== 'word' && e.charIndex === undefined) return;
    let wi = offsets.findIndex((o, i) => e.charIndex >= o && (i === offsets.length - 1 || e.charIndex < offsets[i + 1]));
    $$('.rd-word').forEach(el => el.classList.toggle('spoken', +el.dataset.i === wi));
  };
  u.onend = () => {
    if (!READER) return;
    READER.playing = false;
    $$('.rd-word').forEach(el => el.classList.remove('spoken'));
    readerChrome();
  };
  READER.playing = true;
  readerChrome();
  speechSynthesis.speak(u);
}

function readerStop(keepReader) {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (READER && keepReader) { READER.playing = false; readerChrome(); }
  else if (!keepReader) READER = null;
}

function readerWord(el) {
  const raw = el.textContent.replace(/[^a-zA-Z']/g, '').toLowerCase();
  if (!raw) return;
  speechSynthesis.cancel(); READER.playing = false; readerChrome();
  speak(raw, 'en');
  const def = READER_GLOSSARY[raw];
  const tip = $('#rdTip');
  tip.innerHTML = `${icon('volume', 13)} <b>${esc(raw)}</b>${def ? ` &nbsp;=&nbsp; ${esc(def)}` : ''}`;
  tip.style.display = 'block';
  const host = $('.reader-grid').getBoundingClientRect();
  const r = el.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(host.width - 240, r.left - host.left)) + 'px';
  tip.style.top = (r.top - host.top - 42) + 'px';
  clearTimeout(readerWord._t);
  readerWord._t = setTimeout(() => { tip.style.display = 'none'; }, 2600);
}

function readerGo(dir) {
  speechSynthesis.cancel();
  const next = READER.pi + dir;
  if (next < 0) return;
  if (next >= READER.pages.length) return readerQuiz();
  READER.pi = next;
  readerPage();
}

// ---- 6c: comprehension check after the story ----
function readerQuiz() {
  readerStop(true);
  const q = READER.p.qs[READER.qi];
  if (!q) return readerFinish();
  const choices = shuffle([q.a, ...q.d]);
  app.querySelector('.reader-grid').outerHTML = `<div class="session-stage"><div class="card qcard" id="rdQuiz">
    <p class="eyebrow" style="margin-bottom:8px">Story question ${READER.qi + 1} of ${READER.p.qs.length} · "${esc(READER.p.title)}"</p>
    <div class="qprompt">${esc(q.q)}</div>
    <div class="choices ${Math.max(...choices.map(c => c.length)) > 11 ? 'two-col' : ''}">${choices.map(c =>
      `<button class="choice" data-c="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>
    <div id="rdFb"></div>
  </div></div>`;
  $$('#rdQuiz .choice').forEach(b => b.onclick = () => {
    const correct = b.dataset.c === q.a;
    $$('#rdQuiz .choice').forEach(x => {
      x.disabled = true;
      if (x.dataset.c === q.a) x.classList.add('right');
      else if (x === b && !correct) x.classList.add('wrong');
    });
    if (correct) READER.right++;
    recordTypingAnswer(READER.sk, correct); // generic mastery+log recorder
    sfx(correct ? 'correct' : 'wrong');
    $('#rdFb').innerHTML = `<div class="fb-row ${correct ? 'good' : 'bad'} pop">
      <span class="fb-tile" style="background:${correct ? 'var(--green)' : 'var(--gold)'}">${icon(correct ? 'star' : 'bulb', 16)}</span>
      <span class="fb-text"><b>${correct ? 'Yes!' : 'Good try — it was “' + esc(q.a) + '.”'}</b> ${q.why}</span>
      <button class="btn ${correct ? 'primary' : 'sunny'} caps-btn" id="rdNextQ" style="flex:none">Next ${icon('arrowright', 13)}</button></div>`;
    $('#rdNextQ').onclick = () => { READER.qi++; readerQuiz(); };
  });
}

function readerFinish() {
  const { right } = READER, total = READER.p.qs.length;
  const score = skillStat(READER.sk.id).s;
  sfx('cheer'); burst(50, true);
  app.innerHTML = `<div class="reveal"><div class="card mastered-banner" style="max-width:560px;margin:40px auto">
    <span style="display:inline-block">${plantSVG(score, 72)}</span>
    <h2 style="justify-content:center">Story finished! 📖</h2>
    <p style="font-weight:700;font-size:16px;margin:6px 0 2px">"${esc(READER.p.title)}" — ${right} of ${total} questions right</p>
    <p class="note">Reading a little every day grows the biggest gardens of all.</p>
    <div class="answer-row">
      <button class="btn primary big" id="rdAnother">Another story</button>
      <button class="btn ghost big" id="rdDone">Back to practice</button>
    </div>
  </div></div>`;
  const sk = READER.sk;
  READER = null;
  $('#rdAnother').onclick = () => renderStoryReader(sk);
  $('#rdDone').onclick = () => show('practice');
}
