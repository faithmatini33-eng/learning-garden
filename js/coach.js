/* ============================================================
   LEARNING GARDEN — coach.js
   School sync (match teacher's plan → weekly plan), diagnostic
   checkups, Daily Mix review, and the interactive Tutor.
   Loaded before app.js; shares its globals at call time.
   ============================================================ */

// ------------------------------------------------------------
// SCHOOL SYNC — keyword map from teacher-speak to our skills
// ------------------------------------------------------------
const SKILL_KEYWORDS = {
  // math
  skip2: ['skip count', 'counting by 2'], skip5: ['skip count', 'counting by 5', 'count by 5'],
  skip10: ['skip count', 'counting by 10', 'count by 10'], skip100: ['count by 100'],
  evenodd: ['even', 'odd'], pattern: ['number pattern', 'patterns'], countback: ['count backward', 'counting back'],
  line_find: ['number line'], line_point: ['number line'], line_hop: ['number line', 'open number line'],
  pv_digit: ['place value', 'value of digit'], pv_tens: ['place value', 'tens and ones'],
  pv_hundreds: ['place value', 'hundreds'], pv_expanded: ['expanded form'], pv_standard: ['standard form'],
  pv_compare: ['comparing numbers', 'compare numbers', 'greater than', 'less than'],
  pv_order: ['ordering numbers', 'order numbers'], pv_ten_more: ['10 more', 'ten more'], pv_hundred_more: ['100 more'],
  add_facts: ['addition facts', 'math facts', 'fact fluency', 'adding'], add_tens: ['adding tens'],
  add_2d: ['two-digit addition', '2-digit addition', 'double digit addition'],
  add_2d_re: ['regrouping', 'carrying', 'two-digit addition', '2-digit addition'],
  add_3: ['three addends', 'adding three numbers'], add_3d: ['three-digit addition', '3-digit addition'],
  add_missing: ['missing addend', 'unknown number'],
  sub_facts: ['subtraction facts', 'math facts', 'fact fluency', 'subtracting'], sub_tens: ['subtracting tens'],
  sub_2d: ['two-digit subtraction', '2-digit subtraction', 'double digit subtraction'],
  sub_2d_re: ['borrowing', 'regrouping', 'two-digit subtraction', '2-digit subtraction'],
  sub_3d: ['three-digit subtraction', '3-digit subtraction'], sub_missing: ['missing number'],
  fact_family: ['fact families', 'fact family', 'related facts'],
  word_add: ['word problems', 'story problems'], word_sub: ['word problems', 'story problems'],
  word_comp: ['word problems', 'comparison problems', 'how many more'], word_two: ['two-step problems', 'word problems'],
  money_count: ['money', 'coins', 'counting coins'], money_make: ['money', 'coins'], money_change: ['money', 'making change'],
  time_hour: ['telling time', 'clock', 'time to the hour', 'half hour'], time_5: ['telling time', 'clock', 'five minutes', 'nearest 5'],
  time_ampm: ['am and pm', 'a.m.', 'p.m.'], time_elapsed: ['elapsed time'],
  meas_unit: ['measurement', 'units', 'inches', 'centimeters'], meas_ruler: ['measurement', 'ruler', 'measuring length'],
  meas_compare: ['measurement', 'comparing lengths', 'how much longer'],
  geo_name: ['shapes', 'geometry', '2d shapes'], geo_sides: ['sides', 'vertices', 'shapes', 'geometry'],
  geo_frac: ['fractions', 'halves', 'thirds', 'fourths', 'partition'], geo_3d: ['3d shapes', 'solid shapes', 'solids'],
  data_bar: ['bar graph', 'graphs', 'graphing', 'data'], data_picto: ['picture graph', 'pictograph'], data_tally: ['tally'],
  mult_array: ['arrays', 'repeated addition', 'multiplication'], mult_groups: ['equal groups', 'multiplication'],
  // ela
  rhyme: ['rhyme', 'rhyming'], syllables: ['syllable'], vowel_sound: ['short vowel', 'long vowel', 'vowel sounds', 'vowels'],
  digraph: ['digraph', 'blends', 'letter teams', 'consonant teams'], silent_e: ['silent e', 'magic e', 'cvce'],
  spell_correct: ['spelling', 'sight words', 'high-frequency words', 'word wall'],
  plurals: ['plural'], contractions: ['contraction', 'apostrophe'], compound: ['compound word'],
  noun_id: ['noun'], verb_id: ['verb'], adj_id: ['adjective', 'describing words'],
  sentence_type: ['types of sentences', 'statement', 'kinds of sentences'],
  capitalization: ['capital', 'capitalization'], end_punct: ['punctuation', 'end marks'],
  synonyms: ['synonym'], antonyms: ['antonym', 'opposites'], homophones: ['homophone'],
  affix_meaning: ['prefix', 'suffix', 'base word', 'root word'], odd_one_out: ['categories', 'sorting words'],
  abc_order: ['abc order', 'alphabetical'],
  read_story: ['reading comprehension', 'main idea', 'story elements', 'characters', 'fiction', 'sequencing', 'cause and effect'],
  read_facts: ['reading comprehension', 'nonfiction', 'informational text', 'main idea'],
  // science
  slg: ['states of matter', 'matter', 'solid', 'liquid', 'gas'],
  state_change: ['melting', 'freezing', 'evaporation', 'condensation', 'changes of state', 'heating and cooling'],
  best_material: ['materials', 'properties of materials'],
  push_pull: ['force', 'push', 'pull', 'motion'], magnets: ['magnet'],
  animal_groups: ['animal groups', 'classification', 'mammals', 'reptiles', 'vertebrates'],
  life_cycle: ['life cycle', 'metamorphosis', 'butterfly'], plant_parts: ['plants', 'plant parts', 'roots', 'stem'],
  living: ['living and nonliving', 'living things'],
  habitat: ['habitat', 'ecosystem', 'biome'], food_chain: ['food chain', 'producer', 'consumer'],
  adaptations: ['adaptation'], weather_type: ['weather', 'precipitation', 'storms', 'severe weather'],
  thermometer: ['temperature', 'thermometer'], earth_features: ['landforms', 'bodies of water', 'earth features'],
  earth_changes: ['erosion', 'earthquake', 'volcano', 'earth changes'], rrr: ['recycle', 'recycling', 'earth day', 'conservation'],
  // social studies
  soc_compass: ['compass', 'directions', 'north south east west', 'cardinal directions'],
  soc_mapread: ['map skills', 'map key', 'map legend', 'reading maps', 'maps'],
  soc_world: ['continents', 'oceans', 'globe', 'geography'],
  soc_helpers: ['community helpers', 'community workers', 'jobs in our community'],
  soc_rules: ['rules and laws', 'laws', 'classroom rules'],
  soc_citizen: ['citizenship', 'good citizen', 'being a good citizen'],
  soc_leaders: ['government', 'president', 'mayor', 'voting', 'elections', 'leaders'],
  soc_goods: ['goods and services', 'economics'],
  soc_needs: ['needs and wants'],
  soc_money: ['saving and spending', 'earning money', 'economics'],
  soc_symbols_q: ['american symbols', 'national symbols', 'the flag', 'statue of liberty'],
  soc_holidays: ['holidays', 'thanksgiving', 'independence day', 'mlk day', 'presidents day'],
  soc_pastpresent: ['long ago and today', 'past and present', 'then and now', 'history'],
  soc_famous: ['famous americans', 'historical figures', 'black history', 'george washington', 'abraham lincoln', 'rosa parks', 'martin luther king'],
  // spanish
  sp_greet_q: ['spanish greetings', 'greetings', 'hola'], sp_num_q: ['spanish numbers', 'numbers in spanish'],
  sp_color_q: ['spanish colors', 'colors in spanish', 'colores'], sp_animal_q: ['spanish animals', 'animales'],
  sp_family_q: ['spanish family', 'familia', 'body parts in spanish'], sp_food_q: ['spanish food', 'comida'],
  sp_school_q: ['spanish school words', 'escuela'], sp_days_q: ['days of the week in spanish', 'dias de la semana'],
};

function matchSkillsFromText(text) {
  const t = ' ' + text.toLowerCase().replace(/[^a-z0-9áéíóúñ\s.-]/g, ' ') + ' ';
  const hits = [];
  for (const [sid, terms] of Object.entries(SKILL_KEYWORDS)) {
    if (!SKILL_MAP[sid]) continue;
    if (terms.some(term => t.includes(term.toLowerCase()))) hits.push(sid);
  }
  return hits;
}

function focusSet(kidId = DB.activeKid) {
  const f = (DB.focus || {})[kidId];
  return new Set(f && f.week === weekKey() ? f.skills : []);
}

function renderSchoolSync(kidId) {
  const k = DB.kids.find(x => x.id === kidId);
  const current = focusSet(kidId);
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));
  const catalog = activeSubjects().map(sub => {
    const rows = SKILLS.filter(s => strandSubject[s.strand] === sub.id).map(s =>
      `<label style="display:flex;gap:8px;align-items:center;font-weight:700;font-size:14.5px;padding:5px 2px">
        <input type="checkbox" class="focus-chk" value="${s.id}" ${current.has(s.id) ? 'checked' : ''} style="width:19px;height:19px;accent-color:var(--leaf)">
        ${STRANDS.find(x => x.id === s.strand).emoji} ${s.name}
      </label>`).join('');
    return `<details style="margin-top:10px"><summary style="font-family:var(--font-display);font-weight:600;font-size:17px;cursor:pointer">${sub.emoji} ${sub.name}</summary>${rows}</details>`;
  }).join('');

  app.innerHTML = `<div class="reveal">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--sun)">🎯</span>School focus — ${esc(k.name)}</h2>
      <p class="note">Paste the teacher's newsletter, homework note, or "this week we're learning…" list below.
      I'll find the matching skills and build ${esc(k.name)}'s weekly plan around them. You can also tick skills by hand.</p>
      <textarea id="syncText" class="text-input" style="width:100%;min-height:110px;margin-top:10px;font-weight:600" placeholder="Example: This week we are working on 2-digit subtraction with regrouping, telling time to 5 minutes, contractions, and the butterfly life cycle."></textarea>
      <div class="field-row">
        <button class="btn sky" id="matchBtn">🔍 Find matching skills</button>
      </div>
      <div id="matchResult"></div>
    </div>
    <div class="card tilt-r">
      <h2><span class="bubble" style="background:var(--sky)">🌤️</span>School-day workload</h2>
      <p class="note">How many skills should ${esc(k.name)} do on a school day? Keep it light so they aren't overwhelmed after class — weekends stay open for exploring. Extra "bonus" skills are always one tap away.</p>
      <div style="display:flex;align-items:center;gap:14px;margin-top:10px">
        <input type="range" id="goalSlider" min="2" max="6" step="1" value="${kidSettings(kidId).schoolGoal}" style="flex:1;accent-color:var(--leaf)">
        <span id="goalLabel" style="font-family:var(--font-display);font-weight:600;font-size:20px;white-space:nowrap"></span>
      </div>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--leaf)">✅</span>This week's focus skills</h2>
      <p class="note">Checked skills get 🎯 priority in the weekly plan (they fill the first slots each day). The rest of the plan still mixes in review and other subjects.</p>
      ${catalog}
      <div class="field-row">
        <button class="btn primary" id="saveFocus">Save focus & rebuild this week's plan</button>
        <button class="btn ghost" id="cancelFocus">Back</button>
      </div>
    </div>
  </div>`;

  const goalLabel = () => { $('#goalLabel').textContent = `${$('#goalSlider').value} skills (~${$('#goalSlider').value * 3}–${$('#goalSlider').value * 4} min)`; };
  goalLabel();
  $('#goalSlider').oninput = () => { kidSettings(kidId).schoolGoal = +$('#goalSlider').value; save(); goalLabel(); };

  $('#matchBtn').onclick = () => {
    const text = $('#syncText').value.trim();
    if (!text) return;
    const hits = matchSkillsFromText(text);
    hits.forEach(sid => { const cb = $(`.focus-chk[value="${sid}"]`); if (cb) cb.checked = true; });
    // open the <details> groups that got hits
    $$('.focus-chk').forEach(cb => { if (cb.checked) cb.closest('details').open = true; });
    $('#matchResult').innerHTML = hits.length
      ? `<div class="feedback good pop" style="margin-top:12px"><div class="headline">🎯 Found ${hits.length} matching skill${hits.length > 1 ? 's' : ''}!</div>
         <div class="why">${hits.map(sid => SKILL_MAP[sid].name).join(' · ')}<br>They're checked below — look them over, then save.</div></div>`
      : `<div class="feedback bad pop" style="margin-top:12px"><div class="headline">Hmm, no matches found.</div>
         <div class="why">Try simpler words (e.g. "regrouping", "telling time", "contractions") — or tick the skills by hand below.</div></div>`;
  };
  $('#saveFocus').onclick = () => {
    const picked = $$('.focus-chk').filter(cb => cb.checked).map(cb => cb.value);
    DB.focus = DB.focus || {};
    DB.focus[kidId] = { week: weekKey(), skills: picked };
    if (DB.plans[kidId]) delete DB.plans[kidId][weekKey()];
    save();
    show('grownups');
  };
  $('#cancelFocus').onclick = () => show('grownups');
}

// ------------------------------------------------------------
// DIAGNOSTIC — "Garden Checkup" per subject
// ------------------------------------------------------------
// first-day checkup: SHORT and mixed — one question per key strand
// across every subject (~14 Qs), so no kid faces a wall of 24 math
// questions. Per-subject deep checkups still exist below.
function startMixedDiagnostic() {
  const quota = { math: 5, ela: 4, science: 2, social: 2, spanish: 1 };
  const picks = [];
  for (const [subj, n] of Object.entries(quota)) {
    const strands = shuffle(STRANDS.filter(x => x.subject === subj && !x.custom && x.id !== 'handwriting' && x.id !== 'reading'));
    strands.slice(0, n).forEach(st => {
      const sk = pick(SKILLS.filter(k => k.strand === st.id));
      if (sk) picks.push(sk.id);
    });
  }
  startQueueSession({ queue: shuffle(picks), diag: true, subject: 'mixed', title: 'Garden checkup' });
}

function startDiagnostic(subjectId) {
  const strands = STRANDS.filter(s => s.subject === subjectId);
  const queue = [];
  strands.forEach(st => {
    shuffle(SKILLS.filter(k => k.strand === st.id)).slice(0, 2).forEach(k => queue.push(k.id));
  });
  startQueueSession({
    queue: shuffle(queue), diag: true, subject: subjectId,
    title: `🩺 ${SUBJECTS.find(s => s.id === subjectId).name} checkup`,
  });
}

function renderDiagResults() {
  const subj = SUBJECTS.find(s => s.id === SESSION.subject) || { id: 'mixed', name: 'Garden', emoji: '' };
  const results = SESSION.diagResults; // {strandId: [correct, total]}
  const st = kidStats();
  const rows = Object.entries(results).map(([strandId, [c, t]]) => {
    const strand = STRANDS.find(x => x.id === strandId);
    const acc = t ? c / t : 0;
    const [seed, label, icon] = acc >= 0.75 ? [55, 'Strong!', '🌸'] : acc >= 0.5 ? [35, 'Growing', '🪴'] : [15, 'Let\'s water this one', '🌱'];
    // seed starting mastery so the plan knows where to focus
    SKILLS.filter(k => k.strand === strandId).forEach(k => {
      const cur = st[k.id] || { s: 0, a: 0, c: 0 };
      if (cur.s < seed) { cur.s = seed; st[k.id] = cur; }
    });
    return `<tr><td>${strand.emoji} ${strand.name}</td><td class="c">${c}/${t}</td><td>${icon} <b>${label}</b></td></tr>`;
  }).join('');
  DB.diag = DB.diag || {};
  (DB.diag[DB.activeKid] = DB.diag[DB.activeKid] || []).push({
    date: dstr(), subject: SESSION.subject,
    results: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.slice()])),
  });
  save();
  app.innerHTML = `<div class="reveal"><div class="card pop">
    <h2><span class="bubble" style="background:var(--leaf)">🩺</span>${subj.emoji} ${subj.name} checkup results</h2>
    <table class="cheat-table"><tr><th>Topic</th><th>Score</th><th>Garden health</th></tr>${rows}</table>
    <p class="note" style="margin-top:12px">I planted these results in the garden — the weekly plan and Daily Mix will now focus on the topics that need watering. Retake a checkup any time from the Grown-ups corner to see growth!</p>
    <div class="answer-row">
      <button class="btn primary big" id="diagDone">To my garden 🌻</button>
    </div>
  </div></div>`;
  $('#diagDone').onclick = () => show('today');
}

// ------------------------------------------------------------
// DAILY MIX — 10-question smart review across all subjects
// ------------------------------------------------------------
function startMix() {
  const st = kidStats();
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));
  // weakest unmastered skills, round-robin across subjects for variety
  const bySubj = {};
  SKILLS.map(k => ({ id: k.id, subj: strandSubject[k.strand], sc: (st[k.id] || { s: 0 }).s }))
    .filter(x => x.sc < 100)
    .sort((a, b) => a.sc - b.sc)
    .forEach(x => (bySubj[x.subj] = bySubj[x.subj] || []).push(x.id));
  const queue = [];
  const subjIds = SUBJECTS.map(s => s.id).filter(s => bySubj[s] && bySubj[s].length);
  let i = 0;
  while (queue.length < 10 && subjIds.some(s => bySubj[s].length)) {
    const s = subjIds[i % subjIds.length]; i++;
    if (bySubj[s].length) queue.push(bySubj[s].shift());
  }
  if (!queue.length) return;
  startQueueSession({ queue, diag: false, title: '🌈 Daily Mix' });
}

function renderMixRecap() {
  const right = SESSION.right || 0, total = SESSION.queue.length;
  const acc = Math.round((right / total) * 100);
  const msg = acc >= 90 ? 'Your garden is THRIVING! 🌻' : acc >= 70 ? 'Great growing today! 🌸' : 'Every drop of practice counts! 💧';
  burst(40, true);
  app.innerHTML = `<div class="reveal"><div class="card pop mastered-banner">
    <span class="flower">${acc >= 90 ? '🌻' : acc >= 70 ? '🌸' : '🌱'}</span>
    <h2 style="justify-content:center">Daily Mix done!</h2>
    <p style="font-weight:800;font-size:19px;margin:8px 0 4px">${right} out of ${total} correct — ${msg}</p>
    <p class="note">The Mix always picks the skills that need the most sunshine, in every subject.</p>
    <div class="answer-row">
      <button class="btn sunny big" id="mixAgain">Another Mix! 🌈</button>
      <button class="btn primary big" id="mixHome">To my garden</button>
    </div>
  </div></div>`;
  $('#mixAgain').onclick = startMix;
  $('#mixHome').onclick = () => show('today');
}

// ------------------------------------------------------------
// TUTOR — interactive step-by-step coach (asks, hints, reveals)
// ------------------------------------------------------------
let TUTOR = null;

function tutorStepsAdd(a, b) {
  const [, at, ao] = [0, Math.floor(a / 10) % 10, a % 10];
  const [, bt, bo] = [0, Math.floor(b / 10) % 10, b % 10];
  const ah = Math.floor(a / 100), bh = Math.floor(b / 100);
  const steps = [{
    ask: 'Which side do we ALWAYS start on?', kind: 'mc',
    choices: ['the right (ones)', 'the left'], answer: 'the right (ones)',
    hint: 'Think: ones first! The smallest place value is on the right.',
    why: 'We always start with the ones so any extra ten can carry over.',
  }, {
    ask: `Add the ones: <span class="mini-math">${ao} + ${bo} = ?</span>`, kind: 'num', answer: ao + bo,
    hint: `Start at ${Math.max(ao, bo)} and count up ${Math.min(ao, bo)} on your fingers.`,
    why: `${ao} + ${bo} = ${ao + bo}.`,
  }];
  const oSum = ao + bo;
  let carryT = 0;
  if (oSum >= 10) {
    carryT = 1;
    steps.push({
      ask: `${oSum} is ten or more! What do we do?`, kind: 'mc',
      choices: [`write the ${oSum % 10}, carry the 1 ten`, `write ${oSum} under the line`, 'erase and start over'],
      answer: `write the ${oSum % 10}, carry the 1 ten`,
      hint: 'Ten ones make one ten — the ten moves to the tens column.',
      why: `${oSum} = ${oSum % 10} ones + 1 ten. The ten "carries" over to the tens column.`,
    });
  }
  const tSum = at + bt + carryT;
  if (a >= 10 || b >= 10 || carryT) {
    steps.push({
      ask: `Now the tens${carryT ? ' (don\'t forget the carried 1!)' : ''}: <span class="mini-math">${carryT ? '1 + ' : ''}${at} + ${bt} = ?</span>`,
      kind: 'num', answer: tSum,
      hint: carryT ? `The carried 1 comes first: 1 + ${at} = ${1 + at}, then + ${bt}.` : `${at} + ${bt} — count up!`,
      why: `${carryT ? '1 + ' : ''}${at} + ${bt} = ${tSum}.`,
    });
  }
  if (ah + bh > 0 || tSum >= 10) {
    const carryH = tSum >= 10 ? 1 : 0;
    if (carryH) steps.push({
      ask: `${tSum} tens is ten or more tens! Where does the extra go?`, kind: 'mc',
      choices: ['carry 1 to the hundreds', 'throw it away', 'put it back in the ones'],
      answer: 'carry 1 to the hundreds',
      hint: 'Ten tens make one hundred!',
      why: 'Ten tens = one hundred, so it carries to the hundreds column.',
    });
    if (ah + bh + carryH > 0 && (ah || bh)) steps.push({
      ask: `Hundreds: <span class="mini-math">${carryH ? '1 + ' : ''}${ah} + ${bh} = ?</span>`, kind: 'num', answer: ah + bh + carryH,
      hint: 'Add them up — this is the easy part!', why: `${carryH ? '1 + ' : ''}${ah} + ${bh} = ${ah + bh + carryH}.`,
    });
  }
  steps.push({
    ask: `Put it all together: <span class="mini-math">${a} + ${b} = ?</span>`, kind: 'num', answer: a + b,
    hint: 'Read your column answers from left to right!',
    why: `${a} + ${b} = <b>${a + b}</b>. You built that answer yourself!`,
  });
  return steps;
}

function tutorStepsSub(a, b) {
  let at = Math.floor(a / 10) % 10, ao = a % 10;
  const bt = Math.floor(b / 10) % 10, bo = b % 10;
  let ah = Math.floor(a / 100);
  const bh = Math.floor(b / 100);
  const steps = [{
    ask: 'Which side do we ALWAYS start on?', kind: 'mc',
    choices: ['the right (ones)', 'the left'], answer: 'the right (ones)',
    hint: 'Ones first — always the right side!',
    why: 'Starting at the ones lets us borrow when we need to.',
  }];
  if (ao < bo) {
    steps.push({
      ask: `Look at the ones: ${ao} is smaller than ${bo}. What do we do?`, kind: 'mc',
      choices: ['borrow a ten from the tens', `subtract backwards (${bo} − ${ao})`, 'skip the ones column'],
      answer: 'borrow a ten from the tens',
      hint: 'We can\'t take ' + bo + ' from ' + ao + ' — but the tens column can lend us a ten!',
      why: `Never subtract backwards! We borrow: the ${at} tens become ${at - 1}, and the ones become ${ao + 10}.`,
    });
    at -= 1; ao += 10;
  }
  steps.push({
    ask: `Ones: <span class="mini-math">${ao} − ${bo} = ?</span>`, kind: 'num', answer: ao - bo,
    hint: `Count back ${bo} from ${ao}, or count UP from ${bo} to ${ao}.`,
    why: `${ao} − ${bo} = ${ao - bo}.`,
  });
  if (a >= 10 || b >= 10) {
    if (at < bt) {
      steps.push({
        ask: `Tens: ${at} is smaller than ${bt}. What now?`, kind: 'mc',
        choices: ['borrow a hundred', `subtract backwards (${bt} − ${at})`, 'give up'],
        answer: 'borrow a hundred',
        hint: 'Same trick, one column over — the hundreds can lend us one!',
        why: `Borrow again: the ${ah} hundreds become ${ah - 1}, and the tens become ${at + 10}.`,
      });
      ah -= 1; at += 10;
    }
    steps.push({
      ask: `Tens: <span class="mini-math">${at} − ${bt} = ?</span>`, kind: 'num', answer: at - bt,
      hint: 'Just like the ones — count back.', why: `${at} − ${bt} = ${at - bt}.`,
    });
  }
  if (ah > 0 || bh > 0) {
    steps.push({
      ask: `Hundreds: <span class="mini-math">${ah} − ${bh} = ?</span>`, kind: 'num', answer: ah - bh,
      hint: 'Almost there!', why: `${ah} − ${bh} = ${ah - bh}.`,
    });
  }
  const orig = { a: TUTOR ? TUTOR.a : a, b: TUTOR ? TUTOR.b : b };
  steps.push({
    ask: `Put it together: <span class="mini-math">${orig.a} − ${orig.b} = ?</span>`, kind: 'num', answer: orig.a - orig.b,
    hint: 'Read your column answers left to right.',
    why: `${orig.a} − ${orig.b} = <b>${orig.a - orig.b}</b>. Check it: ${orig.a - orig.b} + ${orig.b} = ${orig.a} ✓ You did every step yourself!`,
  });
  return steps;
}

// digit-highlighted stacked problem (4a): the current column glows
function verticalMathHL(a, b, op, col) {
  const w = Math.max(String(a).length, String(b).length);
  const colIdx = { ones: 1, tens: 2, hundreds: 3 }[col] || 0;
  const rowHTML = (n) => {
    const s = String(n).padStart(w, ' ');
    return [...s].map((ch, i) => {
      const place = s.length - i; // 1=ones, 2=tens...
      const hl = colIdx && place === colIdx && ch !== ' ';
      return hl ? `<span class="vm-hl">${ch}</span>` : (ch === ' ' ? '&numsp;' : ch);
    }).join('');
  };
  return `<div class="vertical-math" style="font-size:42px">
    <div>${rowHTML(a)}</div>
    <div><span class="op">${op}</span>${rowHTML(b)}</div>
  </div><div style="font-family:var(--font-head);font-weight:800;font-size:30px;color:var(--dashed);margin-top:6px">?</div>`;
}

function startTutor(a, b, op) {
  TUTOR = { a, b, op, i: 0, tries: 0, answers: [] };
  TUTOR.steps = op === '+' ? tutorStepsAdd(a, b) : tutorStepsSub(a, b);
  tutorTrailRender();
}

// full step trail (4a): done = green, current = active card, locked = dashed
function tutorTrailRender() {
  const stack = $('#tutStack');
  const box = $('#tutorBox');
  if (!box) return;
  const cur = TUTOR.steps[TUTOR.i];
  const askTxt = cur ? cur.ask : '';
  const col = /hundred/i.test(askTxt) ? 'hundreds' : /tens/i.test(askTxt) ? 'tens' : /ones/i.test(askTxt) ? 'ones' : null;
  const stackHTML = `<div style="text-align:center;margin:14px 0 6px">${verticalMathHL(TUTOR.a, TUTOR.b, TUTOR.op, col)}</div>`;
  if (stack) stack.innerHTML = stackHTML;

  const trail = TUTOR.steps.map((stp, j) => {
    if (j < TUTOR.i) {
      return `<div class="tstep done"><span class="ts-n done">${icon('check', 13)}</span>
        <div class="ts-body"><b>${stp.ask}</b>
          ${TUTOR.answers[j] !== undefined ? `<span class="ts-pill">${esc(String(TUTOR.answers[j]))}</span>` : ''}
          <p class="note">${stp.why}</p></div></div>`;
    }
    if (j === TUTOR.i) {
      const input = stp.kind === 'mc'
        ? `<div class="choices" style="grid-template-columns:1fr;gap:8px;margin-top:10px;max-width:none">${stp.choices.map(c =>
            `<button class="choice t-choice" style="font-size:15.5px;padding:11px;text-align:left" data-c="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>`
        : `<div class="answer-row" style="justify-content:flex-start;margin-top:10px">
            <input class="num-input" id="tutIn" inputmode="numeric" style="width:110px;font-size:22px;padding:7px;border-color:var(--teal)">
            <button class="btn sky caps-btn" id="tutCheck">Check</button>
            <button class="btn small sunny" id="tutHintBtn">${icon('bulb', 13)} Hint</button>
          </div>`;
      return `<div class="tstep active"><span class="ts-n">${j + 1}</span>
        <div class="ts-body"><b>${stp.ask}</b>${input}<div id="tutHint"></div></div></div>`;
    }
    return `<div class="tstep locked"><span class="ts-n">${j + 1}</span>
      <div class="ts-body" style="color:var(--muted)">${stp.ask}</div></div>`;
  }).join('');

  box.innerHTML = `${stack ? '' : stackHTML}
    <div id="tutorSteps">${trail}</div>
    <div style="display:flex;gap:9px;align-items:center;margin-top:12px">
      ${owlSVG(32)}
      <span style="background:var(--teal-tint2);border-radius:12px;padding:8px 13px;font-weight:600;font-size:12.5px">You're doing the thinking — I just ask the questions!</span>
    </div>`;

  if (!cur) { renderTutorSolo(); return; }

  const showHint = () => {
    $('#tutHint').innerHTML = `<div class="hint-strip">${icon('bulb', 14)} ${cur.hint}</div>`;
  };
  const wrong = () => {
    TUTOR.tries++;
    sfx('wrong');
    if (TUTOR.tries === 1) showHint();
    else {
      $('#tutHint').innerHTML = `<div class="hint-strip" style="background:var(--terra-tint)">The answer is <b>${esc(String(cur.answer))}</b>. ${cur.why}</div>`;
      TUTOR.answers[TUTOR.i] = cur.answer;
      setTimeout(advance, 1100);
    }
  };
  const right = (given) => { sfx('correct'); TUTOR.answers[TUTOR.i] = given; advance(); };
  const advance = () => { TUTOR.i++; TUTOR.tries = 0; tutorTrailRender(); };

  if (cur.kind === 'mc') {
    $$('.t-choice', box).forEach(btn => btn.onclick = () => {
      if (btn.dataset.c === String(cur.answer)) { btn.classList.add('right'); setTimeout(() => right(btn.dataset.c), 350); }
      else { btn.classList.add('wrong'); btn.disabled = true; wrong(); }
    });
  } else {
    const inp = $('#tutIn', box);
    const check = () => {
      if (inp.value.trim() === '') return;
      if (Number(inp.value.replace(/[,\s]/g, '')) === Number(cur.answer)) { inp.style.background = 'var(--green-tint)'; setTimeout(() => right(inp.value.trim()), 300); }
      else { inp.style.background = 'var(--terra-tint)'; inp.select(); wrong(); }
    };
    $('#tutCheck', box).onclick = check;
    $('#tutHintBtn', box).onclick = showHint;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    inp.focus();
  }
}

function renderTutorTab() {
  $('#helperBody').innerHTML = `<div class="tutor-grid">
    <div class="tut-left">
      <p style="font-family:var(--font-head);font-weight:800;font-size:16px;text-align:center;margin-bottom:10px">Type YOUR homework problem</p>
      <div class="hw-setup" style="margin:0 0 12px">
        <input class="num-input" id="hwA" inputmode="numeric" placeholder="34" style="width:86px">
        <select id="hwOp"><option value="+">+</option><option value="−">−</option></select>
        <input class="num-input" id="hwB" inputmode="numeric" placeholder="28" style="width:86px">
        <button class="btn sky caps-btn" id="hwGo">Let's go</button>
      </div>
      <div class="pencil-note">${icon('pencil', 15)} Grab your pencil! Copy the problem onto paper and do each step there too — your paper is where the real thinking happens.</div>
      <div id="tutStack"></div>
    </div>
    <div class="tut-right" id="tutorBox">
      <div style="display:flex;gap:9px;align-items:center;margin-top:6px">
        ${owlSVG(32)}
        <span style="background:var(--teal-tint2);border-radius:12px;padding:8px 13px;font-weight:600;font-size:12.5px">Type your problem and press Let's go — then I'll ask, you answer!</span>
      </div>
    </div>
  </div>`;
  $('#hwGo').onclick = () => {
    let a = parseInt($('#hwA').value.replace(/[,\s]/g, ''), 10);
    let b = parseInt($('#hwB').value.replace(/[,\s]/g, ''), 10);
    const op = $('#hwOp').value;
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a > 999 || b > 999) {
      $('#tutorBox').innerHTML = `<div class="hw-step"><div class="n">!</div><div class="t">Please type two numbers from 0 to 999.</div></div>`;
      return;
    }
    if (op === '−' && b > a) [a, b] = [b, a];
    startTutor(a, b, op);
  };
}

// ------------------------------------------------------------
// LISTENING EARS — free built-in speech recognition, so the
// tutor can HEAR the kid read and give live feedback.
// (No accounts, no fees — same family as the read-aloud voices.
//  Where the browser doesn't support it, the buttons simply
//  don't appear and the honor-system path remains.)
// ------------------------------------------------------------
const SR_CTOR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
let HELPER_REC = null;
function helperStopRec() {
  if (HELPER_REC) { try { HELPER_REC.onend = null; HELPER_REC.stop(); } catch (e) {} HELPER_REC = null; }
}

// pull numbers out of what we heard: digits plus number words ("thirty four" → 34)
const NUM_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function extractNumbers(text) {
  const toks = text.toLowerCase().replace(/-/g, ' ').split(/[^a-z0-9]+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (/^\d{1,3}$/.test(t)) { out.push(Number(t)); continue; }
    if (hasOwn(NUM_WORDS, t)) {
      let v = NUM_WORDS[t];
      const nxt = toks[i + 1];
      if (v >= 20 && v % 10 === 0 && nxt && hasOwn(NUM_WORDS, nxt) && NUM_WORDS[nxt] >= 1 && NUM_WORDS[nxt] <= 9) { v += NUM_WORDS[nxt]; i++; }
      out.push(v);
    }
  }
  return out;
}

// ------------------------------------------------------------
// WORD-PROBLEM WIZARD — chip-trail detective method (9d)
// ------------------------------------------------------------
const WIZ_KINDS = {
  join:    { chip: 'how many in all',     op: 'add',
             clue: '"In all" is a clue — the groups come together. What happens to the number when things join up?',
             why: 'Getting more or joining means the number GROWS — we add.' },
  lose:    { chip: 'how many are left',   op: 'subtract',
             clue: '"Left" is a clue — some went away! What happens to the number when things leave?',
             why: 'Giving away means the number SHRINKS — we subtract.' },
  compare: { chip: 'how many more',       op: 'subtract',
             clue: '"How many more" compares two amounts — we\'re hunting for the difference between them.',
             why: '"How many more" asks for the DIFFERENCE — we subtract the smaller from the bigger.' },
  groups:  { chip: 'equal groups in all', op: 'repeat',
             clue: 'Equal groups — the same number over and over! How could we count them all up?',
             why: 'Equal groups means adding the same number over and over (that\'s multiplication practice!).' },
};
const WIZ_OP_LABELS = {
  add: () => `${icon('plus', 13)} add`,
  subtract: () => `${icon('minus', 13)} subtract`,
  repeat: () => `${icon('plus', 13)}${icon('plus', 13)} add the same number again & again`,
};

let WIZ = null;

function renderWizardTab() {
  helperStopRec();
  WIZ = { phase: 1, kind: null, a: null, b: null, opTries: 0, ansTries: 0, heard: [] };
  $('#helperBody').innerHTML = `
    <p class="eyebrow" style="color:var(--teal)">Word-problem wizard</p>
    <p style="font-weight:800;font-size:16px;text-align:center;margin-top:4px">Grab a story problem from your MATH homework — let's crack it like detectives.</p>
    <div class="wiz-trail" id="wizTrail"></div>
    <div class="owl-note">${owlSVG(36)}<span class="say" id="wizOwl"></span></div>`;
  wizPaint();
}

function wizAnswer() {
  const { a, b, kind } = WIZ;
  return kind === 'join' ? a + b : kind === 'groups' ? a * b : a - b;
}
function wizSum() {
  const { a, b, kind } = WIZ;
  return kind === 'join' ? `${a} + ${b}`
    : kind === 'groups' ? `${b} groups of ${a} (${Array(Math.min(b, 6)).fill(a).join(' + ')}${b > 6 ? ' + …' : ''})`
    : `${a} − ${b}`;
}

// one row of the trail: done = green pill w/ check, active = teal card, locked = dashed
function wizRow(n, state, inner) {
  return `<div class="tstep ${state}"><div class="ts-n">${state === 'done' ? icon('check', 13) : n}</div><div class="ts-body">${inner}</div></div>`;
}

function wizPaint(owlText) {
  const P = WIZ.phase;
  const K = WIZ.kind && WIZ_KINDS[WIZ.kind];
  const rows = [];

  // 1 — read it out loud (with real listening where the browser supports it)
  rows.push(P > 1
    ? wizRow(1, 'done', `<b>Read your problem out loud — twice!</b>`)
    : wizRow(1, 'active', `<b>Read your problem out loud — twice!</b>
        <div style="margin-top:8px">
          ${SR_CTOR ? `<button class="chipbtn" id="wizListen">${icon('mic', 14)} Read it to me — I'll listen</button>` : ''}
          <button class="chipbtn" id="wizRead">I read it on my own ${icon('check', 13)}</button>
        </div>
        <div id="wizHeard"></div>`));

  // 2 — what is the story asking? (+ operation follow-up)
  if (P < 2) rows.push(wizRow(2, 'locked', `<span style="color:var(--muted);font-weight:600">What is the story asking you to find?</span>`));
  else if (P === 2) {
    const kindChips = Object.entries(WIZ_KINDS).map(([k, v]) =>
      `<button class="chipbtn wiz-kind ${WIZ.kind === k ? 'sel' : ''}" data-k="${k}" ${WIZ.kind ? 'disabled' : ''}>${v.chip}</button>`).join('');
    const opChips = WIZ.kind ? `
      <p style="font-weight:800;margin-top:12px">So what should we do with the numbers?</p>
      <div>${shuffle(Object.keys(WIZ_OP_LABELS)).map(op =>
        `<button class="chipbtn wiz-op" data-op="${op}">${WIZ_OP_LABELS[op]()}</button>`).join('')}</div>` : '';
    rows.push(wizRow(2, 'active', `<b>What is the story asking you to find?</b>
      <div style="margin-top:8px">${kindChips}</div>${opChips}`));
  } else rows.push(wizRow(2, 'done', `<b>It's asking: ${K.chip} → ${WIZ_OP_LABELS[K.op]()}</b>`));

  // 3 — circle the numbers (on PAPER — the tutor can't see the sheet, so the kid types them in)
  if (P < 3) rows.push(wizRow(3, 'locked', `<span style="color:var(--muted);font-weight:600">Circle the numbers on your paper</span>`));
  else if (P === 3) rows.push(wizRow(3, 'active', `<b>Circle the numbers on your paper.</b> Pencil-circle the two numbers in your problem, then type them here so I can see them too.
      <div class="answer-row" style="justify-content:flex-start;margin-top:10px">
        <input class="num-input" id="wizA" inputmode="numeric" style="width:105px;font-size:20px" placeholder="first" ${WIZ.heard.length === 2 ? `value="${WIZ.heard[0]}"` : ''}>
        <input class="num-input" id="wizB" inputmode="numeric" style="width:105px;font-size:20px" placeholder="second" ${WIZ.heard.length === 2 ? `value="${WIZ.heard[1]}"` : ''}>
        <button class="chipbtn" id="wizNums">Next ${icon('right', 13)}</button>
      </div>`));
  else rows.push(wizRow(3, 'done', `<b>Your numbers: ${WIZ.a} and ${WIZ.b}</b>`));

  // 4 — do the math
  if (P < 4) rows.push(wizRow(4, 'locked', `<span style="color:var(--muted);font-weight:600">Do the math</span>`));
  else if (P === 4) rows.push(wizRow(4, 'active', `<b>Do the math!</b> <span class="mini-math">${wizSum()} = ?</span>
      <div class="answer-row" style="justify-content:flex-start;margin-top:10px">
        <input class="num-input" id="wizAns" inputmode="numeric" style="width:130px;font-size:20px">
        <button class="chipbtn" id="wizCheck">Check ${icon('check', 13)}</button>
      </div>`));
  else rows.push(wizRow(4, 'done', `<b><span class="mini-math">${wizSum()} = ${wizAnswer()}</span></b>`));

  // 5 — does it make sense?
  if (P < 5) rows.push(wizRow(5, 'locked', `<span style="color:var(--muted);font-weight:600">Does it make sense?</span>`));
  else {
    const ans = wizAnswer();
    const sense = WIZ.kind === 'join' || WIZ.kind === 'groups'
      ? `You ${WIZ.kind === 'join' ? 'joined groups' : 'added equal groups'}, so the answer (${ans}) should be BIGGER than ${WIZ.a}. Is it?`
      : `Someone ${WIZ.kind === 'lose' ? 'gave things away' : 'was compared'}, so the answer (${ans}) should be SMALLER than ${WIZ.a}. Is it?`;
    rows.push(P === 5
      ? wizRow(5, 'active', `<b>Last step — does it make sense?</b><br>${sense}
          <div style="margin-top:8px"><button class="chipbtn" id="wizSense">It makes sense ${icon('check', 13)}</button></div>`)
      : wizRow(5, 'done', `<b>It makes sense — case closed, detective!</b>
          <div style="margin-top:8px"><button class="btn small sunny" id="wizAgain">${icon('book', 14)} Another problem</button></div>`));
  }

  $('#wizTrail').innerHTML = rows.join('');

  const OWL_DEFAULT = {
    1: SR_CTOR
      ? 'Reading out loud wakes up your clue-finding brain. Tap "<b>Read it to me</b>" and I\'ll listen with my big owl ears!'
      : 'Reading out loud wakes up your clue-finding brain. Twice is even better!',
    2: 'Look at the question at the END of the story — what is it asking you to find?',
    3: WIZ.heard.length === 2
      ? `While you read, I heard <b>${WIZ.heard[0]}</b> and <b>${WIZ.heard[1]}</b>, so I typed them in for you — fix them if I misheard, then tap Next!`
      : 'Circle or underline the numbers on your paper — those are your ingredients.',
    4: 'Work it out on paper first — start with the ones place!',
    5: 'Detectives always double-check: does the answer make sense in the story?',
    6: 'That\'s the whole detective method: read → what\'s it asking → numbers → solve → check. Use it on every word problem!',
  };
  $('#wizOwl').innerHTML = owlText || OWL_DEFAULT[P];

  // ---- wire the active step ----
  if (P === 1) {
    $('#wizRead').onclick = () => { WIZ.phase = 2; wizPaint(); };
    if ($('#wizListen')) $('#wizListen').onclick = wizListen;
  }

  if (P === 2) {
    $$('.wiz-kind').forEach(btn => btn.onclick = () => {
      WIZ.kind = btn.dataset.k;
      wizPaint(WIZ_KINDS[WIZ.kind].clue);
    });
    $$('.wiz-op').forEach(btn => btn.onclick = () => {
      const k = WIZ_KINDS[WIZ.kind];
      if (btn.dataset.op === k.op) {
        WIZ.phase = 3;
        wizPaint(`<span style="color:var(--gold)">${icon('star', 13)}</span> Yes! ${k.why}${WIZ.heard.length === 2 ? ` I typed in the numbers I heard you read — check them, then tap Next!` : ` Now — circle the numbers on your paper.`}`);
      } else {
        WIZ.opTries++;
        btn.classList.add('no'); btn.disabled = true;
        if (WIZ.opTries >= 2) {
          WIZ.phase = 3;
          wizPaint(`It's ${k.op === 'repeat' ? 'add the same number again & again' : k.op}. ${k.why} No worries — on to the numbers!`);
        } else $('#wizOwl').innerHTML = `<span style="color:var(--gold)">${icon('bulb', 13)}</span> Hint: ${k.why}`;
      }
    });
  }

  if (P === 3) {
    $('#wizNums').onclick = () => {
      const a = parseInt($('#wizA').value, 10), b = parseInt($('#wizB').value, 10);
      if (isNaN(a) || isNaN(b)) { $('#wizOwl').innerHTML = 'Type both numbers from your problem — then tap Next!'; return; }
      if (a < 0 || b < 0 || a > 999 || b > 999) { $('#wizOwl').innerHTML = 'Let\'s keep it between 0 and 999 — check your numbers!'; return; }
      WIZ.a = Math.max(a, b); WIZ.b = Math.min(a, b);
      WIZ.phase = 4;
      wizPaint();
      $('#wizAns') && $('#wizAns').focus();
    };
  }

  if (P === 4) {
    const check = () => {
      if ($('#wizAns').value.trim() === '') return;
      const v = Number($('#wizAns').value.replace(/[,\s]/g, ''));
      if (v === wizAnswer()) {
        sfx('correct'); burst(30);
        WIZ.phase = 5;
        wizPaint('That\'s it! One last detective check…');
      } else {
        WIZ.ansTries++;
        $('#wizAns').style.background = 'var(--bad-bg)'; $('#wizAns').select();
        if (WIZ.ansTries >= 2) {
          WIZ.phase = 5;
          wizPaint(`The answer is ${wizAnswer()} — pop over to the Math tab after this and we'll build it step by step together.`);
        } else $('#wizOwl').innerHTML = `<span style="color:var(--gold)">${icon('bulb', 13)}</span> Not yet! ${WIZ.kind === 'lose' || WIZ.kind === 'compare' ? `Try counting UP from ${WIZ.b} to ${WIZ.a}.` : 'Line the numbers up and start with the ones.'}`;
      }
    };
    $('#wizCheck').onclick = check;
    $('#wizAns').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  }

  if (P === 5) $('#wizSense').onclick = () => {
    WIZ.phase = 6;
    burst(60, true);
    wizPaint();
  };

  if (P === 6) $('#wizAgain').onclick = renderWizardTab;
}

// step 1's "Read it to me" — the owl actually listens while the kid reads
function wizListen() {
  helperStopRec();
  const rec = new SR_CTOR();
  HELPER_REC = rec;
  rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true;
  let finals = '', failed = false;
  const btn = $('#wizListen');
  btn.classList.add('listening');
  btn.innerHTML = `${icon('mic', 14)} I'm done reading`;
  if ($('#wizRead')) $('#wizRead').style.display = 'none';
  $('#wizOwl').innerHTML = 'I\'m listening… read your whole problem, nice and clear.';
  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finals += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    const heard = (finals + interim).trim();
    const live = $('#wizHeard');
    if (live && heard) live.innerHTML = `<div class="heard-strip">${icon('volume', 13)} I hear: “${esc(heard.length > 110 ? '…' + heard.slice(-110) : heard)}”</div>`;
  };
  rec.onerror = (e) => {
    failed = true; HELPER_REC = null;
    wizPaint(e.error === 'not-allowed' || e.error === 'service-not-allowed'
      ? 'I need microphone permission to listen — ask a grown-up to allow it, or tap "I read it on my own".'
      : e.error === 'network'
        ? 'My listening ears need the internet on this device — tap "I read it on my own" instead.'
        : 'I couldn\'t hear that time — tap the microphone to try again, or tap "I read it on my own".');
  };
  rec.onend = () => { HELPER_REC = null; if (!failed) wizHeardDone(finals.trim()); };
  btn.onclick = () => { try { rec.stop(); } catch (e) {} };
  try { rec.start(); } catch (e) { HELPER_REC = null; wizPaint('I couldn\'t turn the microphone on — tap "I read it on my own" instead.'); }
}

function wizHeardDone(text) {
  if (!WIZ || WIZ.phase !== 1) return;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 4) {
    wizPaint(text
      ? 'I only caught a little bit — tap the microphone and read the WHOLE problem, nice and loud!'
      : 'I didn\'t hear anything — tap the microphone to try again, or tap "I read it on my own".');
    return;
  }
  WIZ.heard = extractNumbers(text).filter(n => n >= 0 && n <= 999).slice(0, 2);
  WIZ.phase = 2;
  sfx('correct');
  wizPaint(`I heard you read it — lovely reading!${WIZ.heard.length === 2 ? ` I even spotted two numbers, <b>${WIZ.heard[0]}</b> and <b>${WIZ.heard[1]}</b> — hold on to those.` : ''} Now: what is the story asking you to find?`);
}

// ------------------------------------------------------------
// PARENT REPORT — one page per kid, everything that matters
// ------------------------------------------------------------
function renderParentReport(kidId) {
  const k = DB.kids.find(x => x.id === kidId);
  if (!k) return show('grownups');
  const st = kidStats(kidId);
  const log = DB.log[kidId] || {};
  const strandSubject = Object.fromEntries(STRANDS.map(s => [s.id, s.subject]));

  // subject averages
  const subjBars = activeSubjects().map(sub => {
    const skills = SKILLS.filter(s => strandSubject[s.strand] === sub.id);
    const avg = Math.round(skills.reduce((sum, s) => sum + (st[s.id] || { s: 0 }).s, 0) / skills.length);
    const mastered = skills.filter(s => (st[s.id] || { s: 0 }).s >= 100).length;
    return `<div class="row">
      <span class="lbl">${sub.emoji} ${sub.name}</span>
      <span class="track"><span class="fill" style="width:${avg}%"></span></span>
      <span class="val">${avg}</span>
    </div>
    <p class="note" style="margin:-4px 0 8px 4px">${mastered}/${skills.length} skills mastered</p>`;
  }).join('');

  // weakest attempted-or-low skills (what to work on next)
  const weakest = SKILLS
    .map(s => ({ s, sc: (st[s.id] || { s: 0, a: 0 }).s, a: (st[s.id] || { a: 0 }).a }))
    .filter(x => x.sc < 75)
    .sort((a, b) => (b.a > 0 ? 1 : 0) - (a.a > 0 ? 1 : 0) || a.sc - b.sc)
    .slice(0, 6)
    .map(x => {
      const strand = STRANDS.find(y => y.id === x.s.strand);
      return `<div class="kid-admin-row" style="border-bottom-style:dotted">
        <span style="font-size:22px">${plantFor(x.sc)}</span>
        <span class="nm" style="font-size:15px">${strand.emoji} ${x.s.name}
          <span style="color:var(--ink-soft);font-size:13px">· score ${x.sc}${x.a ? ` · tried ${x.a}×` : ' · not tried yet'}</span></span>
      </div>`;
    }).join('') || '<p class="note">Nothing under 75 — this garden is thriving! 🌻</p>';

  // week vs week
  const mon = mondayOf();
  const weekTotals = (off) => {
    let t = 0, c = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() - off * 7 + i);
      const e = log[dstr(d)]; if (e) { t += e.t; c += e.c; }
    }
    return { t, c };
  };
  const tw = weekTotals(0), lw = weekTotals(1);
  const pct = (w) => w.t ? Math.round(w.c / w.t * 100) : 0;

  // diagnostic history
  const diags = (DB.diag[kidId] || []).slice(-6).reverse().map(d => {
    const sub = SUBJECTS.find(s => s.id === d.subject);
    const parts = Object.entries(d.results).map(([strandId, [c, t]]) => {
      const strand = STRANDS.find(x => x.id === strandId);
      return `${strand.emoji} ${c}/${t}`;
    }).join(' · ');
    return `<div class="kid-admin-row" style="border-bottom-style:dotted">
      <span class="nm" style="font-size:14.5px">${d.date} — ${sub.emoji} ${sub.name}<br>
      <span style="color:var(--ink-soft);font-size:13px">${parts}</span></span></div>`;
  }).join('') || '<p class="note">No checkups yet.</p>';

  const focus = (DB.focus[kidId] && DB.focus[kidId].week === weekKey()) ? DB.focus[kidId].skills : [];
  const focusLine = focus.length
    ? focus.map(id => SKILL_MAP[id] ? SKILL_MAP[id].name : '').filter(Boolean).join(' · ')
    : 'None set this week — tap 🎯 School focus to paste the teacher\'s plan.';

  // Lightning Round personal bests
  const sprints = (typeof SPRINT_DRILLS !== 'undefined')
    ? SPRINT_DRILLS.map(d => {
        const rec = (DB.sprint && DB.sprint[kidId] && DB.sprint[kidId][d.id]) || { best: 0, plays: 0 };
        return rec.plays ? `<span style="display:inline-block;border:2.5px solid var(--line);border-radius:99px;padding:4px 12px;font-weight:800;font-size:13.5px;margin:3px">${d.emoji} ${d.name}: ${trophySVG(14)} ${rec.best} in 60s</span>` : '';
      }).filter(Boolean).join('') || '<p class="note">No Lightning Rounds played yet.</p>'
    : '';

  app.innerHTML = `<div class="reveal" id="reportPage">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--sky)">📊</span>${avatarFace(k.avatar, 28)} ${esc(k.name)}'s report
        <button class="btn small ghost no-print" id="printReport" style="margin-left:auto">🖨️ Print</button></h2>
      <p class="note print-only" style="display:none">Learning Garden report · printed ${dstr()}</p>
      <div class="stat-row">
        <div class="stat-tile"><div class="v">${fmtMins(weekSeconds(kidId))}</div><div class="l">time this week</div></div>
        <div class="stat-tile"><div class="v">${tw.t}</div><div class="l">questions this week</div></div>
        <div class="stat-tile"><div class="v">${pct(tw)}%</div><div class="l">correct this week</div></div>
        <div class="stat-tile"><div class="v">${lw.t ? (pct(tw) - pct(lw) >= 0 ? '+' : '') + (pct(tw) - pct(lw)) + ' pts' : '—'}</div><div class="l">vs last week</div></div>
      </div>
      <p class="note" style="margin-top:10px">Last week: ${lw.t} questions, ${pct(lw)}% correct.</p>
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--leaf)">🌱</span>Subjects at a glance</h2>
      <div class="prog-bars">${subjBars}</div>
    </div>
    <div class="card tilt-r">
      <h2><span class="bubble" style="background:var(--coral)">💪</span>Work on these next</h2>
      ${weakest}
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--coral)">⚡</span>Math-fact fluency</h2>
      ${sprints}
    </div>
    <div class="card">
      <h2><span class="bubble" style="background:var(--sun)">🎯</span>School focus this week</h2>
      <p class="note">${focusLine}</p>
      <div class="field-row"><button class="btn small sunny" id="editFocus">🎯 Edit school focus</button></div>
    </div>
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--leaf)">🩺</span>Checkups</h2>
      ${diags}
      <p class="note" style="margin-top:8px">Run a new checkup (as ${esc(k.name)}):</p>
      <div class="field-row">${activeSubjects().filter(s => s.id !== 'custom').map(s => `<button class="btn small ghost" data-rundiag="${s.id}">${s.emoji} ${s.name}</button>`).join('')}</div>
    </div>
    <div class="answer-row"><button class="btn ghost" id="backGrown">← Back to Grown-ups</button></div>
  </div>`;
  $('#editFocus').onclick = () => show('schoolsync', kidId);
  $('#backGrown').onclick = () => show('grownups');
  $('#printReport').onclick = () => window.print();
  $$('[data-rundiag]').forEach(b => b.onclick = () => {
    DB.activeKid = kidId; save();
    startDiagnostic(b.dataset.rundiag);
  });
}

// ------------------------------------------------------------
// TUTOR HOME — a friendly front door (not straight into math)
// ------------------------------------------------------------
function renderTutorHome() {
  $('#helperBody').innerHTML = `
    <div style="text-align:center">
      <div class="pop" style="display:flex;justify-content:center">${owlSVG(88)}</div>
      <p style="font-family:var(--font-display);font-weight:600;font-size:24px;margin:6px 0 2px">Hi! What do you need help with?</p>
      <p class="note">Pick one — we'll figure it out together, step by step.</p>
    </div>
    <div class="tutor-menu">
      <button class="tutor-door" data-door="tutor"><span class="subj-ico" style="width:46px;height:46px;background:var(--terra-tint);color:var(--terra)">${icon('calculator', 23)}</span><b>A math problem</b><small>adding & subtracting, step by step</small></button>
      <button class="tutor-door" data-door="wizard"><span class="subj-ico" style="width:46px;height:46px;background:var(--teal-tint);color:var(--teal)">${icon('book', 23)}</span><b>A word problem</b><small>a story problem from homework</small></button>
      <button class="tutor-door" data-door="words"><span class="subj-ico" style="width:46px;height:46px;background:var(--purple-tint);color:var(--purple)">${icon('pencil', 23)}</span><b>A tricky word</b><small>reading, meaning & word attack</small></button>
      <button class="tutor-door" data-door="homework"><span class="subj-ico" style="width:46px;height:46px;background:var(--blue-tint);color:var(--blue)">${icon('camera', 23)}</span><b>My homework sheet</b><small>snap a photo & work through it</small></button>
      <button class="tutor-door" data-door="cheats"><span class="subj-ico" style="width:46px;height:46px;background:var(--gold-tint);color:var(--gold)">${icon('clipboard', 23)}</span><b>Cheat sheets</b><small>money, clocks, clue words & more</small></button>
    </div>`;
  $$('.tutor-door').forEach(b => b.onclick = () => { HELPER_TAB = b.dataset.door; renderHelper(); });
}

// ------------------------------------------------------------
// TRICKY WORDS — big syllable card + saved words (9d)
// ------------------------------------------------------------
const WH_PREFIXES = [['re', 'again (reread = read again)'], ['un', 'not / opposite of (unhappy = not happy)'], ['pre', 'before (preheat = heat before)'], ['mis', 'wrongly (misplace = put in the wrong spot)'], ['dis', 'not / opposite of (disagree = not agree)']];
const WH_SUFFIXES = [['ful', 'full of (hopeful = full of hope)'], ['less', 'without (fearless = without fear)'], ['ing', 'happening right now (jumping)'], ['ed', 'already happened (jumped)'], ['est', 'the most (tallest = most tall)'], ['er', 'more, or a person who does it (taller, teacher)'], ['ly', 'in that way (quickly = in a quick way)']];

function syllableGuess(w) {
  const m = w.toLowerCase().match(/[aeiouy]+/g);
  let n = m ? m.length : 1;
  if (/[^aeiou]e$/.test(w.toLowerCase()) && n > 1) n--; // silent e
  return Math.max(1, n);
}

// dictionary splits for high-frequency words the rule-of-thumb gets wrong
const TW_SPLITS = {
  together: 'to·geth·er', another: 'an·oth·er', other: 'oth·er', mother: 'moth·er',
  father: 'fa·ther', brother: 'broth·er', teacher: 'teach·er', weather: 'weath·er',
  every: 'ev·ery', very: 'ver·y', animal: 'an·i·mal', family: 'fam·i·ly',
  favorite: 'fa·vor·ite', different: 'dif·fer·ent', probably: 'prob·a·bly',
  minute: 'min·ute', seven: 'sev·en', eleven: 'e·lev·en', never: 'nev·er',
  ever: 'ev·er', over: 'o·ver', many: 'man·y', money: 'mon·ey', honey: 'hon·ey',
  something: 'some·thing', everything: 'ev·ery·thing', homework: 'home·work',
  birthday: 'birth·day', really: 'real·ly', finally: 'fi·nal·ly', usually: 'u·su·al·ly',
};
const TW_DIGRAPHS = ['th', 'sh', 'ch', 'ph', 'wh', 'ck', 'qu'];

// best-guess syllable chunks — a reading helper, not a dictionary
// (kid copy always hedges with "about")
function syllabify(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return [word];
  if (hasOwn(TW_SPLITS, w)) return TW_SPLITS[w].split('·');
  // peel clear endings first: read·ing, quick·ly (only if a vowel is left behind)
  for (const suf of ['ing', 'ly']) {
    if (w.endsWith(suf) && w.length - suf.length >= 3 && /[aeiouy]/.test(w.slice(0, -suf.length)))
      return [...syllabify(w.slice(0, -suf.length)), suf];
  }
  // peel a "consonant + le" ending: ta·ble, lit·tle, puz·zle (y counts as a vowel: "style" stays whole)
  if (w.length > 3 && /[^aeiouy]le$/.test(w)) return [...syllabify(w.slice(0, -3)), w.slice(-3)];
  const isV = (ch, i) => 'aeiou'.includes(ch) || (ch === 'y' && i > 0);
  const groups = [];
  for (let i = 0; i < w.length; i++) {
    if (!isV(w[i], i)) continue;
    if (groups.length && groups[groups.length - 1].end === i - 1) groups[groups.length - 1].end = i;
    else groups.push({ start: i, end: i });
  }
  // silent e at the end isn't its own beat
  if (groups.length > 1) {
    const last = groups[groups.length - 1];
    if (last.start === w.length - 1 && w.endsWith('e') && !isV(w[w.length - 2], w.length - 2)) groups.pop();
  }
  if (groups.length <= 1) return [w];
  const cuts = [];
  for (let g = 0; g < groups.length - 1; g++) {
    const a = groups[g], b = groups[g + 1];
    const between = b.start - a.end - 1;
    const pair = w.slice(a.end + 1, a.end + 3);
    if (between <= 1) cuts.push(a.end + 1);                      // pa·per, li·on
    else if (TW_DIGRAPHS.includes(pair)) cuts.push(a.end + 1);   // keep th/sh/ch… together
    else cuts.push(a.end + 2);                                   // win·ter, tomor·row
  }
  const parts = [];
  let prev = 0;
  cuts.forEach(c => { parts.push(w.slice(prev, c)); prev = c; });
  parts.push(w.slice(prev));
  return parts.filter(Boolean);
}

function kidTrickyWords() {
  const s = kidSettings();
  s.trickyWords = s.trickyWords || [];
  return s.trickyWords;
}

function renderWordHelperTab() {
  helperStopRec();
  $('#helperBody').innerHTML = `
    <p class="eyebrow" style="color:var(--purple)">Tricky words</p>
    <p style="font-weight:800;font-size:16px;text-align:center;margin-top:4px">Stuck on a word from your book or homework? Type it in!</p>
    <div class="hw-setup" style="margin-bottom:6px">
      <input class="text-input" id="whWord" style="max-width:260px;font-size:22px;font-weight:800;text-align:center" autocapitalize="none" spellcheck="false" placeholder="type the word">
      <button class="btn sky big" id="whGo">Help me!</button>
    </div>
    <div id="whOut"></div>
    <div id="twSaved"></div>`;
  const go = () => {
    const w = $('#whWord').value.trim().toLowerCase().replace(/[^a-z']/g, '').slice(0, 18);
    if (!w) return;
    wordHelp(w);
  };
  $('#whGo').onclick = go;
  $('#whWord').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  twSavedPaint();
}

// the "My tricky words" chip shelf — tap a chip to work on it again
function twSavedPaint() {
  const saved = kidTrickyWords();
  $('#twSaved').innerHTML = `
    <p class="eyebrow" style="text-align:center;margin-top:24px">My tricky words</p>
    <div class="tw-chips">
      ${saved.map(w => `<button class="tw-chip" data-tw="${escAttr(w)}">${esc(w)}</button>`).join('')}
      <button class="tw-chip add" id="twAdd">${icon('plus', 13)} add a word</button>
    </div>
    ${saved.length ? '' : `<p class="note" style="text-align:center;margin-top:8px">Words you ask about land here, so you can practice them again.</p>`}`;
  $$('#twSaved [data-tw]').forEach(b => b.onclick = () => wordHelp(b.dataset.tw));
  $('#twAdd').onclick = () => $('#whWord').focus();
}

let TW = null;

// guided word lesson: SEE it -> SOUND it -> UNDERSTAND it -> SPELL it
function wordHelp(w) {
  const chunks = syllabify(w);
  const saved = kidTrickyWords();
  if (!saved.includes(w)) { saved.unshift(w); if (saved.length > 12) saved.length = 12; save(); }
  TW = { w, chunks, step: 1, misses: 0 };
  if ($('#whWord')) $('#whWord').value = w;
  twSavedPaint();
  twPaint();
}

function twCardHTML(hidden) {
  const { w, chunks } = TW;
  const showSplit = chunks.length > 1 && /^[a-z]+$/.test(w);
  const word = hidden
    ? `<div class="tw-word" style="letter-spacing:.2em;color:var(--muted)">${w.replace(/[a-z]/gi, '_ ').trim()}</div>`
    : `<div class="tw-word">${showSplit
        ? chunks.map((c, i) => `<button class="tw-chunk" data-chunk="${i}">${esc(c)}</button>`).join('<span class="dot">·</span>')
        : `<button class="tw-chunk" data-chunk="-1">${esc(w)}</button>`}</div>`;
  return `<div class="tw-card">${word}
    <div class="tw-btns">
      <button class="tw-btn fill" id="twHear">${icon('volume', 14)} hear it</button>
      <button class="tw-btn" id="twSay">${SR_CTOR ? `${icon('mic', 13)} ` : ''}say it with me</button>
      <button class="tw-btn plain" id="twKnow">I know it now ${icon('check', 13)}</button>
    </div>
    <div id="twEcho"></div>
  </div>`;
}

function twWire() {
  const { w, chunks } = TW;
  $$('#whOut .tw-chunk').forEach(b => b.onclick = () => {
    const i = +b.dataset.chunk;
    speak(i < 0 ? w : chunks[i], 'en');
  });
  const hear = $('#twHear'); if (hear) hear.onclick = () => speak(w, 'en');
  const say = $('#twSay'); if (say) say.onclick = twSayFlow;
  const know = $('#twKnow'); if (know) know.onclick = twGraduate;
}

function twSayFlow() {
  if (!('speechSynthesis' in window)) return;
  helperStopRec();
  const { w, chunks } = TW;
  const u = new SpeechSynthesisUtterance(chunks.join(', ') + '. ' + w);
  u.lang = 'en-US';
  const v = pickVoice('en-US'); if (v) u.voice = v;
  u.rate = 0.55;
  window.__lgUtter = u;
  if (SR_CTOR) u.onend = () => twEcho(w);
  const busy = speechSynthesis.speaking || speechSynthesis.pending;
  if (busy) { speechSynthesis.cancel(); setTimeout(() => speechSynthesis.speak(u), 80); }
  else speechSynthesis.speak(u);
}

function twGraduate() {
  const { w } = TW;
  const list = kidTrickyWords();
  const i = list.indexOf(w);
  if (i >= 0) list.splice(i, 1);
  save();
  sfx('cheer'); burst(60, true);
  $('#whOut').innerHTML = `<div class="tw-card">
    <p style="font-family:var(--font-head);font-weight:800;font-size:22px"><span style="color:var(--gold)">${icon('star', 20)}</span> "${esc(w)}" isn't tricky anymore — you grew right past it!</p>
    <p class="note" style="margin-top:6px">It left your tricky-word list. Type another word any time.</p>
  </div>`;
  twSavedPaint();
  $('#whWord').value = '';
}

function twPaint(owlText) {
  const { w, chunks, step } = TW;
  const dots = [1, 2, 3, 4].map(n =>
    `<span class="beat-pill ${n < step ? 'on' : ''} ${n === step ? 'cur' : ''}">${n < step ? icon('check', 11) : n}</span>`).join('');
  const OWL = {
    1: `Here\'s your word! Tap each chunk to hear it — chunks are how readers crack big words.`,
    2: `Now clap it out: <b>${chunks.length}</b> beat${chunks.length > 1 ? 's' : ''}. Tap "say it with me" and say it back to me — I\'m listening!`,
    3: `Every word has secrets. Here\'s what I found inside this one…`,
    4: `Last step, detective: spell it from memory. You\'ve got this!`,
  };
  let body = '';
  if (step <= 2) body = twCardHTML(false);
  if (step === 3) {
    const parts = [];
    const pre = WH_PREFIXES.find(([p]) => w.startsWith(p) && w.length > p.length + 2);
    const suf = WH_SUFFIXES.find(([s]) => w.endsWith(s) && w.length > s.length + 2);
    if (pre) parts.push(`<div class="hw-step"><div class="n">${icon('puzzle', 15)}</div><div class="t"><b>Word part spotted!</b> It starts with <b>${pre[0]}-</b>, which means <b>${pre[1]}</b>. Cover it up and read the rest: <b>${esc(w.slice(pre[0].length))}</b>.</div></div>`);
    if (suf) parts.push(`<div class="hw-step"><div class="n">${icon('puzzle', 15)}</div><div class="t"><b>Word part spotted!</b> It ends with <b>-${suf[0]}</b>, which means <b>${suf[1]}</b>. The base word is <b>${esc(w.slice(0, w.length - suf[0].length))}</b>.</div></div>`);
    const comp = (typeof COMPOUND_BANK !== 'undefined') && COMPOUND_BANK.find(c => c[2] === w);
    if (comp) parts.push(`<div class="hw-step"><div class="n">${icon('link', 15)}</div><div class="t"><b>It\'s a compound word!</b> <b>${comp[0]}</b> + <b>${comp[1]}</b> = ${esc(w)} ${comp[3]}</div></div>`);
    const syn = (typeof SYNONYM_BANK !== 'undefined') && SYNONYM_BANK.find(x => x[0] === w || x[1] === w);
    if (syn) parts.push(`<div class="hw-step"><div class="n">${icon('users', 15)}</div><div class="t"><b>Word twin:</b> ${esc(w)} means about the same as <b>${esc(syn[0] === w ? syn[1] : syn[0])}</b>.</div></div>`);
    const ant = (typeof ANTONYM_BANK !== 'undefined') && ANTONYM_BANK.find(x => x[0] === w || x[1] === w);
    if (ant) parts.push(`<div class="hw-step"><div class="n">${icon('swap', 15)}</div><div class="t"><b>Opposite:</b> the opposite of ${esc(w)} is <b>${esc(ant[0] === w ? ant[1] : ant[0])}</b>.</div></div>`);
    if (!parts.length) parts.push(`<div class="hw-step"><div class="n">${icon('search', 15)}</div><div class="t"><b>Reading-detective moves:</b><br>
      1. Read the whole sentence around it — what would make sense?<br>
      2. Look at the picture if there is one.<br>
      3. Break it into chunks: <b>${chunks.map(esc).join(' · ')}</b> — sound out each one.<br>
      4. Still stuck? Ask a grown-up — good readers ask questions!</div></div>`);
    body = `${twCardHTML(false)}<div class="step-list" style="margin-top:14px">${parts.join('')}</div>`;
  }
  if (step === 4) {
    body = `${twCardHTML(true)}
      <div class="answer-row" style="margin-top:14px">
        <input class="num-input" id="twSpell" style="width:260px;font-size:22px;text-align:center" autocapitalize="none" spellcheck="false" autocomplete="off" placeholder="type it from memory">
        <button class="btn primary big" id="twSpellGo">Check</button>
      </div>
      <div id="twSpellFb" style="text-align:center;margin-top:8px"></div>`;
  }
  $('#whOut').innerHTML = `
    <div style="display:flex;justify-content:center;gap:8px;margin:4px 0 12px">${dots}</div>
    <div class="owl-note" style="margin:0 auto 14px;max-width:560px">${owlSVG(36)}<span class="say">${owlText || OWL[step]}</span></div>
    ${body}
    <div class="answer-row" style="margin-top:14px">
      ${step > 1 ? `<button class="btn ghost" id="twBack">${icon('left', 14)} Back</button>` : ''}
      ${step < 4 ? `<button class="btn primary caps-btn" id="twNext">${step === 1 ? 'Sound it out' : step === 2 ? 'What\'s inside it?' : 'Spell it!'} ${icon('arrowright', 14)}</button>` : ''}
    </div>`;
  twWire();
  const nx = $('#twNext'); if (nx) nx.onclick = () => { TW.step++; twPaint(); };
  const bk = $('#twBack'); if (bk) bk.onclick = () => { TW.step--; twPaint(); };
  if (step === 1) speak(w, 'en');
  if (step === 2) twSayFlow();
  if (step === 4) {
    const inp = $('#twSpell');
    const check = () => {
      const typed = inp.value.trim().toLowerCase();
      if (!typed) return;
      if (typed === w.toLowerCase()) {
        sfx('cheer'); burst(60, true);
        inp.disabled = true; $('#twSpellGo').disabled = true;
        inp.style.background = 'var(--ok-bg)';
        $('#twSpellFb').innerHTML = `<span class="pill" style="color:var(--green);background:var(--green-tint);border-color:var(--green-tint)">${icon('check', 14)} Perfect spelling! Tap "I know it now" when it feels easy.</span>
          <div style="margin-top:12px">${twCardHTML(false).replace('id="twHear"', 'id="twHear2"')}</div>`;
        twWire();
        const h2 = $('#twHear2'); if (h2) h2.onclick = () => speak(w, 'en');
      } else {
        TW.misses++;
        sfx('wrong');
        inp.select();
        $('#twSpellFb').innerHTML = TW.misses === 1
          ? `<span class="pill" style="color:var(--gold)">${icon('bulb', 14)} Almost! Peek: <b style="margin-left:4px">${esc(w)}</b> — now try again.</span>`
          : `<span class="pill">It\'s spelled <b style="margin:0 4px">${esc(w)}</b> — copy it once, that still counts as learning!</span>`;
      }
    };
    $('#twSpellGo').onclick = check;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    inp.focus();
  }
}

// after "say it with me", the owl listens for the kid to say the word back
function twEcho(w) {
  const out = $('#twEcho');
  if (!out || !SR_CTOR) return;
  helperStopRec();
  const rec = new SR_CTOR();
  HELPER_REC = rec;
  rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 4;
  const target = w.replace(/[^a-z]/g, '');
  out.innerHTML = `<div class="heard-strip listening">${icon('mic', 13)} Your turn — say "${esc(w)}" out loud!</div>`;
  let done = false;
  rec.onresult = (e) => {
    done = true;
    const alts = Array.from(e.results[0]).map(r => r.transcript.toLowerCase().replace(/[^a-z ]/g, ''));
    const hit = alts.some(t => t.split(' ').includes(target) || t.replace(/ /g, '') === target);
    if (hit) {
      sfx('cheer'); burst(40, true);
      out.innerHTML = `<div class="heard-strip ok">${icon('check', 13)} I heard you say "${esc(w)}" — beautiful!</div>`;
    } else {
      out.innerHTML = `<div class="heard-strip">${icon('volume', 13)} I heard "${esc(alts[0] || '…')}" — so close! Tap "say it with me" to try again.</div>`;
    }
  };
  rec.onerror = () => { done = true; out.innerHTML = ''; };
  rec.onend = () => {
    HELPER_REC = null;
    if (!done) out.innerHTML = `<div class="heard-strip">I didn't catch it — tap "say it with me" to try again.</div>`;
  };
  try { rec.start(); } catch (e) { HELPER_REC = null; out.innerHTML = ''; }
}

// ------------------------------------------------------------
// TUTOR "YOU TRY ONE" — the transfer step (I do → we do → YOU do)
// ------------------------------------------------------------
function tutorSimilarProblem() {
  const { a, b, op } = TUTOR;
  const wantCarry = op === '+' ? (a % 10 + b % 10 >= 10) : (a % 10 < b % 10);
  const digits = Math.max(String(a).length, String(b).length);
  const lo = digits <= 1 ? 2 : digits === 2 ? 11 : 110;
  const hi = digits <= 1 ? 9 : digits === 2 ? 89 : 789;
  let a2 = a, b2 = b, guard = 0;
  while (guard++ < 120) {
    a2 = ri(lo, hi);
    b2 = op === '−' ? ri(Math.max(1, lo - 1), a2 - 1) : ri(lo, hi);
    if (op === '+' && a2 + b2 > 999) continue;
    if (a2 === a && b2 === b) continue;
    const carry = op === '+' ? (a2 % 10 + b2 % 10 >= 10) : (a2 % 10 < b2 % 10);
    if (carry === wantCarry) break;
  }
  return { a2, b2 };
}

function renderTutorSolo() {
  const { a2, b2 } = tutorSimilarProblem();
  const op = TUTOR.op;
  const answer = op === '+' ? a2 + b2 : a2 - b2;
  $('#tutorSteps').insertAdjacentHTML('beforeend', `
    <div class="hw-step" style="background:var(--sun)"><div class="n">${icon('star', 15)}</div><div class="t" style="flex:1">
      <b>Now YOU try one all by yourself!</b> Copy it onto your paper, work each column with your pencil, then type your answer.
      <div style="margin:10px 0">${verticalMath(a2, b2, op)}</div>
      <div class="answer-row" style="justify-content:flex-start">
        <input class="num-input" id="soloIn" inputmode="numeric" style="width:140px">
        <button class="btn primary" id="soloCheck">Check</button>
      </div>
      <div id="soloOut"></div>
    </div></div>`);
  document.querySelector('#soloIn').focus();
  let tries = 0;
  const check = () => {
    const v = Number($('#soloIn').value.replace(/[,\s]/g, ''));
    if ($('#soloIn').value.trim() === '') return;
    if (v === answer) {
      $('#soloIn').disabled = true; $('#soloCheck').disabled = true;
      $('#soloIn').style.background = 'var(--ok-bg)';
      burst(80, true);
      $('#soloOut').innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--ok-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">
        <span style="color:var(--gold)">${icon('trophy', 15)}</span> <b>YOU did that one completely alone.</b> That's what mastering it feels like!</div>
        <div class="answer-row" style="justify-content:flex-start"><button class="btn sunny" id="soloAgain">Another problem ${icon('calculator', 14)}</button></div>`;
      $('#soloAgain').onclick = renderTutorTab;
    } else {
      tries++;
      $('#soloIn').style.background = 'var(--bad-bg)'; $('#soloIn').select();
      if (tries === 1) {
        $('#soloOut').innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--sun);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px"><span style="color:var(--gold)">${icon('bulb', 13)}</span> Check your paper: did you start with the ones? ${op === '+' ? 'Did anything carry?' : 'Did you need to borrow?'} Try once more!</div>`;
      } else {
        $('#soloOut').innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--bad-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">No problem — let's build this one together, step by step.</div>`;
        setTimeout(() => startTutor(a2, b2, op), 900);
      }
    }
  };
  $('#soloCheck').onclick = check;
  $('#soloIn').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
}

// content2.js expansion skills join the school-focus keyword map
if (typeof CONTENT2_KEYWORDS !== 'undefined') Object.assign(SKILL_KEYWORDS, CONTENT2_KEYWORDS);
if (typeof CONTENT3_KEYWORDS !== 'undefined') Object.assign(SKILL_KEYWORDS, CONTENT3_KEYWORDS);
