/* ============================================================
   LEARNING GARDEN — learn.js · guided lessons ("owl teaches first")
   Plant it   → the owl walks the strand's big ideas one at a time,
                reading each aloud (free speechSynthesis).
   Water it   → 2 can't-fail warmup questions through the session
                engine (SESSION.guidedIntro): hints teach, nothing
                is recorded.
   Watch it grow → the normal mastery run (recording ON).
   Watched lessons land in DB.lessons[kid][strand] = date for the
   parent dashboard. UI is intentionally plain — Faith is designing
   the Learn page; this file is the machinery underneath it.
   ============================================================ */

function kidLessons(kidId = DB.activeKid) {
  DB.lessons = DB.lessons || {}; // lazy — DB exists only after app.js boots
  DB.lessons[kidId] = DB.lessons[kidId] || {};
  return DB.lessons[kidId];
}

// split a strand's lesson HTML into one-idea chunks the owl can teach
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

let LESSON = null;

function renderGuidedLesson(strandId) {
  const strand = STRANDS.find(x => x.id === strandId);
  if (!strand || !strand.lesson) return show('practice');
  LESSON = { strand, chunks: lessonChunks(strand.lesson), i: 0 };
  $('#tabbar').style.display = 'none';
  const u = subjUI(strand.subject);
  setAppbar(`
    <button class="back" id="lsBack" aria-label="Back">${icon('left', 18)}</button>
    <span class="subj-ico" style="width:34px;height:34px;background:${u.tint};color:${u.color}">${icon('bulb', 17)}</span>
    <div class="title">Learn · ${strand.name}</div>
    <span class="beat-pill on">${icon('sprout', 13)} Plant it</span>
    <span class="beat-pill">${icon('droplet', 13)} Water it</span>
    <span class="beat-pill">${icon('star', 13)} Watch it grow</span>`);
  app.innerHTML = `<div class="reveal">
    <div class="card" style="max-width:760px;margin:0 auto">
      <div class="owl-note" style="margin:0 0 16px">${owlSVG(42)}<span class="say" id="lsOwl">Let me show you how this works — I'll read each idea to you. Ready?</span></div>
      <div id="lsChunks"></div>
      <div class="answer-row" style="justify-content:flex-end;margin-top:16px">
        <button class="btn small ghost" id="lsAgain">${icon('volume', 13)} Hear it again</button>
        <button class="btn primary caps-btn" id="lsNext">Next idea ${icon('arrowright', 14)}</button>
      </div>
    </div>
  </div>`;
  $('#lsBack').onclick = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); show('practice'); };
  $('#lsAgain').onclick = () => lsSpeak();
  $('#lsNext').onclick = lsAdvance;
  lsPaint();
}

function lsSpeak() {
  const chunk = LESSON.chunks[LESSON.i];
  if (chunk) speak(speakableText(chunk), 'en');
}

function lsPaint() {
  const seen = LESSON.chunks.slice(0, LESSON.i + 1);
  $('#lsChunks').innerHTML = seen.map((c, j) =>
    `<div class="ls-chunk ${j === LESSON.i ? 'cur pop' : ''}">${c}</div>`).join('');
  const last = LESSON.i >= LESSON.chunks.length - 1;
  $('#lsNext').innerHTML = last ? `Let's try together ${icon('droplet', 14)}` : `Next idea ${icon('arrowright', 14)}`;
  $('#lsOwl').textContent = LESSON.i === 0
    ? 'Let me show you how this works — I\'ll read each idea to you.'
    : pick(['Here\'s the next piece of the puzzle…', 'This one is important — listen close!', 'You\'re doing great — one more idea…', 'Almost there — plant this one in your brain!']);
  const el = document.querySelector('.ls-chunk.cur');
  if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  lsSpeak();
}

function lsAdvance() {
  if (LESSON.i < LESSON.chunks.length - 1) { LESSON.i++; lsPaint(); return; }
  // Plant it complete → remember it, then Water it (guided warmups)
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  kidLessons()[LESSON.strand.id] = dstr();
  save();
  sfx('water');
  const skills = SKILLS.filter(s => s.strand === LESSON.strand.id);
  const st = kidStats();
  const target = skills.find(s => (st[s.id] || { s: 0 }).s < 100) || skills[0];
  if (!target) return show('practice');
  VIEW = 'session';
  // typing & story-reader strands have their own engines — no warmup phase there
  const subj = (STRANDS.find(x => x.id === target.strand) || {}).subject;
  if (subj === 'typing' || target.strand === 'reading') return renderSession(target.id);
  renderSession(target.id, true);
}
