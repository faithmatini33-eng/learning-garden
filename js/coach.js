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
  const subj = SUBJECTS.find(s => s.id === SESSION.subject);
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
      choices: [`write the ${oSum % 10}, carry the 1 ten 🎒`, `write ${oSum} under the line`, 'erase and start over'],
      answer: `write the ${oSum % 10}, carry the 1 ten 🎒`,
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
      choices: ['carry 1 to the hundreds 🎒', 'throw it away', 'put it back in the ones'],
      answer: 'carry 1 to the hundreds 🎒',
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
    why: `${a} + ${b} = <b>${a + b}</b>. You built that answer yourself! 🌟`,
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
      choices: ['borrow a ten from the tens 🤝', `subtract backwards (${bo} − ${ao})`, 'skip the ones column'],
      answer: 'borrow a ten from the tens 🤝',
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
        choices: ['borrow a hundred 🤝', `subtract backwards (${bt} − ${at})`, 'give up'],
        answer: 'borrow a hundred 🤝',
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
    why: `${orig.a} − ${orig.b} = <b>${orig.a - orig.b}</b>. Check it: ${orig.a - orig.b} + ${orig.b} = ${orig.a} ✓ You did every step yourself! 🌟`,
  });
  return steps;
}

function startTutor(a, b, op) {
  TUTOR = { a, b, op, i: 0, tries: 0, hinted: false };
  TUTOR.steps = op === '+' ? tutorStepsAdd(a, b) : tutorStepsSub(a, b);
  const box = $('#tutorBox');
  box.innerHTML = `<div style="margin:10px 0 14px;text-align:center">${verticalMath(a, b, op)}</div>
    <div class="step-list" id="tutorSteps"></div>`;
  renderTutorStep();
}

function renderTutorStep() {
  const stp = TUTOR.steps[TUTOR.i];
  const list = $('#tutorSteps');
  if (!stp) return;
  const n = TUTOR.i + 1;
  let ui;
  if (stp.kind === 'mc') {
    ui = `<div class="choices" style="grid-template-columns:1fr;gap:8px;margin-top:10px">${stp.choices.map(c =>
      `<button class="choice t-choice" style="font-size:17px;padding:11px" data-c="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>`;
  } else {
    ui = `<div class="answer-row" style="margin-top:10px;justify-content:flex-start">
      <input class="num-input" id="tutorIn${n}" inputmode="numeric" style="width:120px;font-size:24px;padding:6px">
      <button class="btn primary" id="tutorCheck${n}">Check ✓</button></div>`;
  }
  list.insertAdjacentHTML('beforeend', `<div class="hw-step" id="tstep${n}"><div class="n">${n}</div>
    <div class="t" style="flex:1"><div>${stp.ask}</div><div id="tui${n}">${ui}</div><div id="thint${n}"></div></div></div>`);
  list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const wrong = () => {
    TUTOR.tries++;
    const hintBox = $(`#thint${n}`);
    if (TUTOR.tries === 1) {
      hintBox.innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--sun);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">💡 Hint: ${stp.hint} Try again!</div>`;
    } else {
      hintBox.innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--bad-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">The answer is <b>${stp.answer}</b>. ${stp.why}</div>`;
      finishStep(false);
    }
  };
  const right = () => {
    $(`#thint${n}`).innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--ok-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">🌟 Yes! ${stp.why}</div>`;
    burst(12);
    finishStep(true);
  };
  const finishStep = () => {
    $(`#tui${n}`).querySelectorAll('button,input').forEach(el => el.disabled = true);
    TUTOR.i++; TUTOR.tries = 0;
    if (TUTOR.i < TUTOR.steps.length) setTimeout(renderTutorStep, 550);
    else setTimeout(() => {
      $('#tutorSteps').insertAdjacentHTML('beforeend',
        `<div class="answer-row"><button class="btn sunny big" id="tutorAgain">Try another problem 🧮</button></div>`);
      $('#tutorAgain').onclick = () => renderTutorTab();
      burst(40, true);
    }, 600);
  };

  if (stp.kind === 'mc') {
    $$(`#tui${n} .t-choice`).forEach(btn => btn.onclick = () => {
      if (btn.dataset.c === String(stp.answer)) { btn.classList.add('right'); right(); }
      else { btn.classList.add('wrong'); btn.disabled = true; wrong(); }
    });
  } else {
    const inp = $(`#tutorIn${n}`), check = () => {
      if (inp.value.trim() === '') return;
      if (Number(inp.value.replace(/[,\s]/g, '')) === Number(stp.answer)) { inp.style.background = 'var(--ok-bg)'; right(); }
      else { inp.style.background = 'var(--bad-bg)'; inp.select(); wrong(); }
    };
    $(`#tutorCheck${n}`).onclick = check;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    inp.focus();
  }
}

function renderTutorTab() {
  $('#helperBody').innerHTML = `
    <p style="font-weight:800;font-size:17px;text-align:center">Type YOUR homework problem. I won't give the answer —<br>I'll ask you the right questions so YOU find it. 🦉</p>
    <div class="hw-setup">
      <input class="num-input" id="hwA" inputmode="numeric" placeholder="52">
      <select id="hwOp"><option value="+">+</option><option value="−">−</option></select>
      <input class="num-input" id="hwB" inputmode="numeric" placeholder="27">
      <button class="btn sky big" id="hwGo">Let's go! 🦉</button>
    </div>
    <div id="tutorBox"></div>`;
  $('#hwGo').onclick = () => {
    let a = parseInt($('#hwA').value.replace(/[,\s]/g, ''), 10);
    let b = parseInt($('#hwB').value.replace(/[,\s]/g, ''), 10);
    const op = $('#hwOp').value;
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a > 999 || b > 999) {
      $('#tutorBox').innerHTML = `<div class="hw-step"><div class="n">!</div><div class="t">Please type two numbers from 0 to 999. 🦉</div></div>`;
      return;
    }
    if (op === '−' && b > a) [a, b] = [b, a];
    startTutor(a, b, op);
  };
}

// ------------------------------------------------------------
// WORD-PROBLEM WIZARD — guided thinking, kid supplies the story
// ------------------------------------------------------------
function renderWizardTab() {
  $('#helperBody').innerHTML = `
    <p style="font-weight:800;font-size:17px;text-align:center">Read your word problem OUT LOUD twice. Then let's solve it together! 🦉</p>
    <div class="step-list" id="wizSteps" style="margin-top:14px"></div>`;
  const list = $('#wizSteps');
  list.innerHTML = `<div class="hw-step"><div class="n">1</div><div class="t" style="flex:1">
      <b>Circle the numbers.</b> What two numbers are in your problem?
      <div class="answer-row" style="justify-content:flex-start;margin-top:10px">
        <input class="num-input" id="wizA" inputmode="numeric" style="width:110px" placeholder="first">
        <input class="num-input" id="wizB" inputmode="numeric" style="width:110px" placeholder="second">
        <button class="btn primary" id="wizNext1">Next ▸</button>
      </div></div></div>`;
  $('#wizNext1').onclick = () => {
    const a = parseInt($('#wizA').value, 10), b = parseInt($('#wizB').value, 10);
    if (isNaN(a) || isNaN(b)) return;
    wizStep2(Math.max(a, b), Math.min(a, b));
  };
}

function wizStep2(a, b) {
  const list = $('#wizSteps');
  $$('#wizSteps input, #wizSteps button').forEach(el => el.disabled = true);
  const kinds = [
    ['join', '🧺 Someone GETS more, or two groups JOIN together'],
    ['lose', '💨 Someone GIVES AWAY, loses, or eats some'],
    ['compare', '⚖️ It asks "how many MORE" one person has'],
    ['groups', '🍪 There are EQUAL GROUPS of the same size'],
  ];
  list.insertAdjacentHTML('beforeend', `<div class="hw-step"><div class="n">2</div><div class="t" style="flex:1">
    <b>What is HAPPENING in the story?</b>
    <div class="choices" style="grid-template-columns:1fr;gap:8px;margin-top:10px">${kinds.map(([k, label]) =>
      `<button class="choice wiz-kind" style="font-size:16px;padding:11px;text-align:left" data-k="${k}">${label}</button>`).join('')}</div></div></div>`);
  $$('.wiz-kind').forEach(btn => btn.onclick = () => {
    $$('.wiz-kind').forEach(x => x.disabled = true);
    btn.classList.add('right');
    wizStep3(a, b, btn.dataset.k);
  });
}

function wizStep3(a, b, kind) {
  const list = $('#wizSteps');
  const opFor = { join: 'add ➕', lose: 'subtract ➖', compare: 'subtract ➖', groups: 'add the same number again and again ➕➕' };
  const whyFor = {
    join: 'Getting more or joining means the number GROWS — we add.',
    lose: 'Giving away means the number SHRINKS — we subtract.',
    compare: '"How many more" asks for the DIFFERENCE — we subtract the smaller from the bigger.',
    groups: 'Equal groups means adding the same number over and over (that\'s multiplication practice!).',
  };
  const correct = opFor[kind];
  const choices = shuffle(['add ➕', 'subtract ➖', 'add the same number again and again ➕➕']);
  list.insertAdjacentHTML('beforeend', `<div class="hw-step"><div class="n">3</div><div class="t" style="flex:1">
    <b>So what should we do with the numbers?</b>
    <div class="choices" style="grid-template-columns:1fr;gap:8px;margin-top:10px">${choices.map(c =>
      `<button class="choice wiz-op" style="font-size:16px;padding:11px" data-c="${escAttr(c)}">${c}</button>`).join('')}</div>
    <div id="wizOpHint"></div></div></div>`);
  let tries = 0;
  $$('.wiz-op').forEach(btn => btn.onclick = () => {
    if (btn.dataset.c === correct) {
      btn.classList.add('right'); $$('.wiz-op').forEach(x => x.disabled = true);
      $('#wizOpHint').innerHTML = `<div style="margin-top:8px;font-weight:700;background:var(--ok-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">🌟 Yes! ${whyFor[kind]}</div>`;
      wizStep4(a, b, kind);
    } else {
      btn.classList.add('wrong'); btn.disabled = true; tries++;
      $('#wizOpHint').innerHTML = tries === 1
        ? `<div style="margin-top:8px;font-weight:700;background:var(--sun);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">💡 Hint: ${whyFor[kind]}</div>`
        : `<div style="margin-top:8px;font-weight:700;background:var(--bad-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">It's: <b>${correct}</b>. ${whyFor[kind]}</div>`;
      if (tries >= 2) { $$('.wiz-op').forEach(x => x.disabled = true); wizStep4(a, b, kind); }
    }
  });
}

function wizStep4(a, b, kind) {
  const list = $('#wizSteps');
  const answer = kind === 'join' ? a + b : kind === 'groups' ? a * b : a - b;
  const sum = kind === 'join' ? `${a} + ${b}` : kind === 'groups' ? `${b} groups of ${a} (${Array(Math.min(b, 6)).fill(a).join(' + ')}${b > 6 ? ' + …' : ''})` : `${a} − ${b}`;
  list.insertAdjacentHTML('beforeend', `<div class="hw-step"><div class="n">4</div><div class="t" style="flex:1">
    <b>Do it!</b> <span class="mini-math">${sum} = ?</span>
    <div class="answer-row" style="justify-content:flex-start;margin-top:10px">
      <input class="num-input" id="wizAns" inputmode="numeric" style="width:130px">
      <button class="btn primary" id="wizCheck">Check ✓</button></div>
    <div id="wizAnsHint"></div></div></div>`);
  let tries = 0;
  const check = () => {
    const v = Number($('#wizAns').value.replace(/[,\s]/g, ''));
    if ($('#wizAns').value.trim() === '') return;
    if (v === answer) {
      $('#wizAns').style.background = 'var(--ok-bg)'; $('#wizAns').disabled = true; $('#wizCheck').disabled = true;
      burst(30);
      wizStep5(a, b, kind, answer);
    } else {
      tries++;
      $('#wizAns').style.background = 'var(--bad-bg)'; $('#wizAns').select();
      $('#wizAnsHint').innerHTML = tries === 1
        ? `<div style="margin-top:8px;font-weight:700;background:var(--sun);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">💡 Not yet! ${kind === 'lose' || kind === 'compare' ? 'Try counting UP from ' + b + ' to ' + a + '.' : 'Line the numbers up and start with the ones.'} Need more help? Take this to the 🧮 Math tutor tab!</div>`
        : `<div style="margin-top:8px;font-weight:700;background:var(--bad-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">The answer is <b>${answer}</b> — pop over to the 🧮 Math tutor tab and we'll build it step by step together.</div>`;
      if (tries >= 2) wizStep5(a, b, kind, answer);
    }
  };
  $('#wizCheck').onclick = check;
  $('#wizAns').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  $('#wizAns').focus();
}

function wizStep5(a, b, kind, answer) {
  const list = $('#wizSteps');
  const sense = kind === 'join' || kind === 'groups'
    ? `You ${kind === 'join' ? 'joined groups' : 'added equal groups'}, so the answer (${answer}) should be BIGGER than ${a}. Is it? ✓`
    : `Someone ${kind === 'lose' ? 'gave things away' : 'was compared'}, so the answer (${answer}) should be SMALLER than ${a}. Is it? ✓`;
  list.insertAdjacentHTML('beforeend', `<div class="hw-step"><div class="n">5</div><div class="t" style="flex:1">
    <b>Last step — does it make sense?</b><br>${sense}
    <div style="margin-top:8px;font-weight:700;background:var(--ok-bg);border:2.5px solid var(--line);border-radius:10px;padding:8px 10px">
    🌟 That's the whole detective method: <b>numbers → what's happening → operation → solve → check</b>. Use it on every word problem!</div>
    <div class="answer-row" style="justify-content:flex-start"><button class="btn sunny" id="wizAgain">Another problem 📖</button></div></div></div>`);
  $('#wizAgain').onclick = renderWizardTab;
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
        return rec.plays ? `<span style="display:inline-block;border:2.5px solid var(--line);border-radius:99px;padding:4px 12px;font-weight:800;font-size:13.5px;margin:3px">${d.emoji} ${d.name}: 🏆 ${rec.best} in 60s</span>` : '';
      }).filter(Boolean).join('') || '<p class="note">No Lightning Rounds played yet.</p>'
    : '';

  app.innerHTML = `<div class="reveal" id="reportPage">
    <div class="card tilt-l">
      <h2><span class="bubble" style="background:var(--sky)">📊</span>${k.avatar} ${esc(k.name)}'s report
        <button class="btn small ghost no-print" id="printReport" style="margin-left:auto">🖨️ Print</button></h2>
      <p class="note print-only" style="display:none">Learning Garden report · printed ${dstr()}</p>
      <div class="stat-row">
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
