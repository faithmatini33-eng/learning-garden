/* ============================================================
   LEARNING GARDEN — lesson2.js · the Teaching Engine (design turn 22)
   Replaces the 5-step lesson flow with a real teaching arc:

     Opener (3 goals) → Concept lesson (is/isn't → quick check →
     worked examples → first try with Pip) → Warm-up (labeled review)
     → Learn cycles (teach → together → you-try, ideas 2–3)
     → Mastery check (3 in a row on fresh questions) → Celebrate.

   Non-negotiables encoded here (see design_handoff_lesson_engine):
   - ONE skill per lesson; every question draws only from the lesson's
     declared bank (validator enforces structure at load).
   - Teach before test — no idea is asked before its teach card.
   - Review is labeled ("Remember this? · from Lesson N").
   - Mastery = 3 consecutive correct FRESH questions; ~12-question soft
     cap ends warmly with "learned" (mastery resumes next session).
   - Reteach ladder: hint → Option A (re-teach, simplest example) →
     Option C (step down input type) — Option B (reveal & replant)
     inside the mastery check only.
   - Input types rotate; no two consecutive questions share one.
   - Gentle wrong everywhere: soft tone + nudge, never buzzers/red.
   - Pip reads everything aloud; every prompt has a replay button.

   Rollout: Language · Spelling path (6 lessons) is the pilot.
   Other strands keep the old flow until their maps are authored.
   ============================================================ */

/* ------------------------------------------------------------
   INPUT TYPES — easiest → hardest (Option C steps DOWN this list)
   trace_it ships in a later batch (handwriting engine hookup).
   ------------------------------------------------------------ */
const L2_KIND_ORDER = ['tap_picture', 'tap_word', 'listen_pick', 'word_tiles', 'drag_drop', 'say_it'];
const L2_KIND_LABEL = {
  tap_picture: 'tap the picture', tap_word: 'tap the word', listen_pick: 'listen & pick',
  word_tiles: 'word tiles', drag_drop: 'drag & drop', say_it: 'say it',
};

// ------------------------------------------------------------
// small shared helpers
// ------------------------------------------------------------
function l2Shuffle(a) { return shuffle(a.slice()); }
function l2Pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function l2PickFresh(arr, used, keyOf) {
  const fresh = arr.filter(x => !used.has(keyOf(x)));
  return fresh.length ? l2Pick(fresh) : l2Pick(arr);
}
/* ------------------------------------------------------------
   PIP'S LINES — small rotating banks so the same sentence never
   lands twice in a row. Every line is warm, blame-free, and short
   enough to speak in one breath (kept under ~110 characters).
   ------------------------------------------------------------ */
const L2_LINES = {
  // a graded answer came back right
  correct: [
    'Yes!', 'You got it!', 'That\'s it!', 'Nailed it!', 'Right on!',
    'Beautiful!', 'Spot on!', 'Yes — exactly!', 'You did that!', 'Lovely thinking!',
  ],
  // three fresh questions right in a row — the mastery moment
  streak: [
    'Three in a row — you really know it!',
    'Three in a row — that settles it, you know this!',
    'Three straight! Your brain grew today.',
    'Three for three — look at you go!',
    'Three in a row — beautifully done!',
    'Three in a row! You can teach this one now.',
    'That\'s three! You really have it.',
    'Three in a row — I knew you had it in you.',
  ],
  // a graded answer came back wrong — nudge, never blame
  wrong: [
    'Almost! Let\'s try that one more time.',
    'Good try — let\'s take another look together.',
    'So close! One more look and you\'ve got it.',
    'No worries at all. Let\'s figure this out together.',
    'Brains grow from tries like that one. Let\'s look again.',
    'Nearly there! Let\'s slow down and read it together.',
    'That was a brave try. Now let\'s find it together.',
    'Hmm — let\'s think this one through together.',
    'Not yet, and that\'s okay. Try it once more!',
    'Let\'s read it one more time — you can do this.',
  ],
  // moving from one part of the lesson to the next
  transition: [
    'You did it! Let\'s keep growing.',
    'Great work — on to the next one!',
    'Look at you go! Here we go.',
    'Nice! Let\'s take the next step.',
    'You\'re ready for more — let\'s go!',
    'Wonderful! Onward, gardener.',
    'That\'s the idea! Let\'s keep it up.',
    'Brilliant! Let\'s keep going.',
    'Well done — next up!',
    'You\'ve got this. Let\'s move on!',
  ],
};
// Rotate, don't randomize blindly: never hand back the line we just used.
// Safe on a one-line bank (returns it) and on an unknown bank (returns '').
const L2_LINE_LAST = {};
function l2Line(bank) {
  const arr = L2_LINES[bank];
  if (!arr || !arr.length) return '';
  if (arr.length === 1) return arr[0];
  const last = L2_LINE_LAST[bank];
  let i = Math.floor(Math.random() * arr.length);
  if (i === last) i = (i + 1) % arr.length; // one nudge is enough — never loops
  L2_LINE_LAST[bank] = i;
  return arr[i];
}

// tiny SVG daisy for the mastery meter + rail (no emoji in chrome)
function l2DaisySVG(size = 22, on = true) {
  let p = '';
  for (let i = 0; i < 6; i++) p += `<ellipse cx="16" cy="9.6" rx="3.4" ry="5.6" fill="${on ? '#F2B035' : '#E4DACC'}" transform="rotate(${i * 60} 16 14)"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 28" aria-hidden="true">${p}<circle cx="16" cy="14" r="4" fill="${on ? '#8C5A2B' : '#CFC4B4'}"/></svg>`;
}

/* ============================================================
   LESSON DEFINITIONS — Language · Spelling path (the pilot)
   Skill ids match the live Practice catalog so mastery plants
   the right seed. Question makers read ONLY this lesson's bank.
   Every maker returns:
   { key, idea, kinds:[...], prompt, say, answer, choices|parts…,
     why, hint, reteach:{line, visual} }
   ============================================================ */
const L2_DEFS = {};

// ---------- shared maker factories (each bound to a lesson bank) ----------
function l2MakerPickOne({ key, idea, kinds, prompt, say, answer, wrong, why, hint, pics }) {
  return (used) => {
    const choices = l2Shuffle([answer, ...wrong]).map(t => ({ t, pic: pics ? pics[t] : null }));
    return { key, idea, kinds, prompt, say: say || speakableText(prompt), answer, choices, why, hint };
  };
}

// ============================================================
// LESSON 1 — Which spelling is right?  (skill: spell_correct)
// ============================================================
(function () {
  const WORDS = [
    // [correct, wrong1, wrong2, clue emoji] — sight words the kids meet daily
    ['because', 'becuz', 'becaus', '🤔'], ['friend', 'frend', 'freind', '🧑‍🤝‍🧑'],
    ['said', 'sed', 'saide', '💬'], ['little', 'littel', 'litle', '🐜'],
    ['people', 'peple', 'peopel', '👥'], ['house', 'hous', 'howse', '🏠'],
    ['school', 'skool', 'schol', '🏫'], ['again', 'agen', 'agian', '🔁'],
    ['every', 'evry', 'evere', '🌟'], ['animal', 'aminal', 'animle', '🐾'],
  ];
  const easy = WORDS[3]; // little — short, kids know it cold
  const mk = (w, idea, kinds, i) => (used) => {
    const [c, w1, w2, pic] = w;
    return {
      key: `l1_${idea}_${c}_${i}`, idea, kinds,
      prompt: `Which word is spelled <b>right</b>?`, say: `Which spelling of ${c} looks right?`,
      sayFirst: c,
      answer: c, choices: l2Shuffle(idea === 3 ? [c, w2] : [c, w1, w2]).map(t => ({ t })),
      why: `<b>${c}</b> is the real spelling — snap a brain-camera photo of it!`,
      hint: `Say it slowly: ${c.split('').join('… ')}. Does every sound have its letters?`,
    };
  };
  L2_DEFS.spell_correct = {
    id: 'lang.spelling.1', n: 1, skill: 'spell_correct', strand: 'spell', subject: 'ela',
    title: 'Which spelling is right?', term: 'spotting the right spelling',
    teaser: `Some words wear disguises! Today we'll catch the real spellings.`,
    goals: ['Spot a word that is spelled right', 'Catch a missing letter', 'Catch swapped letters'],
    minutes: 15,
    warmup: null, // first lesson on the path — nothing to water yet
    bank: { words: WORDS, easy },
    idea1: {
      ruleHTML: `Pip's test: <b>say it slow</b> — does every sound have its letters?`,
      ruleSay: `Pip's test: say it slow — does every sound have its letters?`,
      teachSay: `A word is spelled right when every sound has its letters, in the right order. Some words only LOOK right — let's learn to catch them!`,
      teachHTML: `A word spelled <b>right</b> has all its letters. But watch out — some words only <i>look</i> right!`,
      isLabel: 'SPELLED RIGHT', isntLabel: 'IN DISGUISE',
      examples: [
        { html: `<b>friend</b> 🧑‍🤝‍🧑`, why: `f-r-i-e-n-d — every letter is home` },
        { html: `<b>little</b> 🐜`, why: `two t's, then -le — all there!` },
      ],
      nonExamples: [
        { html: `frend`, why: `the i went missing — say it slow!` },
        { html: `littel`, why: `the ending letters got swapped` },
      ],
      quickCheck: { prompt: `Is <b>said</b> spelled right?`, say: 'Is this spelling of said right?', answer: true, word: 'said', split: 's-a-i-d', fallback: { prompt: `Is <b>hous</b> spelled right?`, say: 'Is this spelling of house right?', answer: false, word: 'hous', split: 'hou-… where did the e go?' } },
      worked: [
        { html: `<b>because</b> 🤔`, say: `because. be… cause. Every sound has letters — it passed the test!`, sayIt: 'b-e-c-a-u-s-e… because!' },
        { html: `<b>school</b> 🏫`, say: `school. s-c-h-o-o-l. The sneaky c-h is there — it's spelled right!`, sayIt: 's-c-h-o-o-l… school!' },
      ],
      firstTry: { prompt: `Which one is really <b>people</b>?`, say: 'Which one is really people?', answer: 'people', choices: ['people', 'peple'], support: 'Say it slow: pe-o-ple' },
      tryits: [mk(WORDS[1], 1, ['tap_word', 'listen_pick'], 0)],
    },
    idea2: {
      name: 'Catch a missing letter',
      ruleHTML: `If a sound has <b>no letter</b>, the word is in disguise.`,
      ruleSay: `If a sound has no letter, the word is in disguise!`,
      teachSay: `Watch! Becuz — say it slow. Be… cause. Where are the letters for the end? Missing! The real word is because.`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-bad">becuz</span><span class="l2-vs">→ say it slow →</span><span class="l2-good">because</span></div>`,
      sayIt: 'be… cause… because!',
      together: [{
        pipSay: `Hmm — skool. Say it with me: s… chool. I hear a c-h sound but I don't see it! Which one has ALL its letters?`,
        prompt: `Which one is really <b>school</b>?`, say: 'Which one is really school?',
        answer: 'school', choices: ['skool', 'school', 'schol'],
        hint: `The real one keeps its sneaky ch.`,
        why: `<b>school</b> keeps every letter — even the quiet ch!`,
      }],
      tryits: [mk(WORDS[0], 2, ['tap_word', 'listen_pick'], 0), mk(WORDS[8], 2, ['listen_pick', 'tap_word'], 1)],
    },
    idea3: {
      name: 'Catch swapped letters',
      ruleHTML: `Sometimes all the letters came — but two <b>traded seats</b>.`,
      ruleSay: `Sometimes all the letters came, but two traded seats! Check the order.`,
      teachSay: `Freind has every letter of friend… but the i and e traded seats! Order matters. F-r-i-e-n-d.`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-bad">fre<u>in</u>d</span><span class="l2-vs">→ seats traded →</span><span class="l2-good">fri<u>en</u>d</span></div>`,
      sayIt: 'f-r-i-e-n-d… friend!',
      tryits: [mk(WORDS[7], 3, ['tap_word', 'listen_pick'], 0), mk(WORDS[4], 3, ['listen_pick', 'tap_word'], 1)],
    },
    reteachEasy: {
      line: `Tricky one! Let's look again with an easy word.`,
      html: `<div class="l2-teach-compare"><span class="l2-good">little</span><span class="l2-vs">not</span><span class="l2-bad">littel</span></div><p class="sent-note">Say it slow: li-ttle. The -le ending comes last!</p>`,
      say: `Little. Say it slow — li… ttle. The l-e ending comes last. That's the real one!`,
    },
    mastery: WORDS.map((w, i) => mk(w, ((i % 3) + 1), ['tap_word', 'listen_pick'], 'm' + i)),
  };
})();

// ============================================================
// LESSON 2 — More than one (plurals)  (skill: plurals)
// ============================================================
(function () {
  const S_WORDS = [['dog', 'dogs', '🐕'], ['cat', 'cats', '🐈'], ['tree', 'trees', '🌳'], ['star', 'stars', '⭐'], ['book', 'books', '📚']];
  const ES_WORDS = [['box', 'boxes', '📦'], ['bus', 'buses', '🚌'], ['brush', 'brushes', '🖌️'], ['bench', 'benches', '🪑'], ['fox', 'foxes', '🦊'], ['dish', 'dishes', '🍽️']];
  const IES_WORDS = [['baby', 'babies', '👶'], ['puppy', 'puppies', '🐶'], ['bunny', 'bunnies', '🐰'], ['city', 'cities', '🏙️'], ['penny', 'pennies', '🪙']];
  const mkPl = ([one, many, pic], idea, kinds, i) => (used) => {
    const wrongs = idea === 1 ? [one + 'es', one] : idea === 2 ? [one + 's', many.replace('es', 'ss')] : [one + 's', one.slice(0, -1) + 'ys'];
    return {
      key: `l2_${idea}_${one}_${i}`, idea, kinds,
      prompt: `One <b>${one}</b> ${pic} — but TWO … ?`, say: `One ${one}. But two…?`,
      answer: many, choices: l2Shuffle([many, ...wrongs.slice(0, 2)]).map(t => ({ t })),
      why: `${one} → <b>${many}</b>${idea === 1 ? ' — just add -s!' : idea === 2 ? ' — after s, x, ch, sh we add -es.' : ' — the y turns into -ies!'}`,
      hint: idea === 1 ? `Most words just want an -s.` : idea === 2 ? `Listen for the hiss at the end — s, x, ch, sh need -es.` : `Words ending in y get fancy: y → ies.`,
    };
  };
  L2_DEFS.plurals = {
    id: 'lang.spelling.2', n: 2, skill: 'plurals', strand: 'spell', subject: 'ela',
    title: 'More than one (plurals)', term: 'making words plural',
    teaser: `One dog is lonely — let's learn how words say MORE than one!`,
    goals: ['Add -s to make more than one', 'Add -es after s, x, ch and sh', 'Turn y into -ies'],
    minutes: 15,
    warmup: {
      fromN: 1, fromTitle: 'Which spelling is right?',
      gen: () => ({
        key: 'wu_l2', prompt: `Which word is spelled <b>right</b>?`, say: 'Which spelling looks right?',
        answer: 'friend', choices: l2Shuffle(['friend', 'frend', 'freind']).map(t => ({ t })),
        why: `<b>friend</b> — every letter home, in order.`, hint: `Say it slow — does every sound have its letters?`,
      }),
    },
    bank: { s: S_WORDS, es: ES_WORDS, ies: IES_WORDS, easy: S_WORDS[0] },
    idea1: {
      ruleHTML: `Pip's test: more than one? <b>Add -s</b> … unless the end hisses!`,
      ruleSay: `Pip's test: more than one? Add s — unless the end hisses!`,
      teachSay: `Plural means more than one. Most words are easy — just add an s! One dog, two dogs. But some words need more help. Let's spot the difference.`,
      teachHTML: `<b>Plural</b> = more than one. Most words just <b>add -s</b>!`,
      isLabel: 'JUST ADD -S', isntLabel: 'NEEDS MORE HELP',
      examples: [
        { html: `dog → <b>dogs</b> 🐕`, why: `dog ends soft — -s hops right on` },
        { html: `tree → <b>trees</b> 🌳`, why: `easy! trees.` },
      ],
      nonExamples: [
        { html: `box → <span class="l2-bad">boxs?</span>`, why: `boxs is too hard to say — it needs -es` },
        { html: `baby → <span class="l2-bad">babys?</span>`, why: `y-words get fancy — babies` },
      ],
      quickCheck: { prompt: `Two ${'🐈'} — is it just <b>cats</b>?`, say: 'More than one cat. Is it just cats, with an s?', answer: true, word: 'cats', split: 'cat + s', fallback: { prompt: `Two 📦 — is it just <b>boxs</b>?`, say: 'More than one box. Is it just box with an s?', answer: false, word: 'boxs', split: 'box needs -es — boxes!' } },
      worked: [
        { html: `star → <b>stars</b> ⭐`, say: `One star. Now two! Star ends soft, so… s hops on. Stars!`, sayIt: 'star… s… stars!' },
        { html: `book → <b>books</b> 📚`, say: `One book, a whole pile of… books! Just add s.`, sayIt: 'book… s… books!' },
      ],
      firstTry: { prompt: `Two 🌳 — pick the plural!`, say: 'More than one tree — which is it?', answer: 'trees', choices: ['trees', 'treees'], support: 'tree + s' },
      tryits: [mkPl(S_WORDS[4], 1, ['tap_word', 'listen_pick'], 0)],
    },
    idea2: {
      name: 'The -es helpers',
      ruleHTML: `After a hissy ending — <b>s, x, ch, sh</b> — add <b>-es</b>.`,
      ruleSay: `After a hissy ending — s, x, ch or sh — add e-s.`,
      teachSay: `Try to say boxs. Box-sss. Too squished! Hissy endings need a helper: box… es. Boxes! Easy to say now.`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-bad">boxs 😖</span><span class="l2-vs">too squished →</span><span class="l2-good">box<u>es</u> 📦</span></div>`,
      sayIt: 'box… es… boxes!',
      together: [{
        pipSay: `One brush 🖌️. Now I have two! Brush ends in s-h — that's a hissy one. So which plural is right?`,
        prompt: `Two 🖌️ — pick the plural!`, say: 'More than one brush — which is it?',
        answer: 'brushes', choices: ['brushs', 'brushes', 'brushies'],
        hint: `sh is hissy — it needs -es.`,
        why: `brush ends in sh → <b>brushes</b>!`,
      }],
      tryits: [mkPl(ES_WORDS[4], 2, ['tap_word', 'listen_pick'], 0), mkPl(ES_WORDS[1], 2, ['listen_pick', 'tap_word'], 1)],
    },
    idea3: {
      name: 'y turns into -ies',
      ruleHTML: `Word ends in <b>y</b>? The y dives away — <b>-ies</b> takes its place!`,
      ruleSay: `When a word ends in y, the y dives away and i-e-s takes its place.`,
      teachSay: `One baby. Two… babys? No! The y dives off the end, and i-e-s climbs on. Babies!`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-bad">bab<u>y</u>s</span><span class="l2-vs">y dives! →</span><span class="l2-good">bab<u>ies</u> 👶</span></div>`,
      sayIt: 'baby… babies!',
      tryits: [mkPl(IES_WORDS[1], 3, ['tap_word', 'listen_pick'], 0), mkPl(IES_WORDS[2], 3, ['listen_pick', 'tap_word'], 1)],
    },
    reteachEasy: {
      line: `Tricky one! Let's look again with an easy word.`,
      html: `<div class="l2-teach-compare"><span class="l2-good">dog 🐕</span><span class="l2-vs">+ s →</span><span class="l2-good">dogs 🐕🐕</span></div><p class="sent-note">Soft ending → just add -s. Hissy ending (s, x, ch, sh) → -es. Ends in y → -ies.</p>`,
      say: `One dog. Two dogs — just add s. But hissy endings need e-s, and y-words turn into i-e-s.`,
    },
    mastery: [
      ...S_WORDS.slice(0, 3).map((w, i) => mkPl(w, 1, ['tap_word', 'listen_pick'], 'm' + i)),
      ...ES_WORDS.slice(0, 4).map((w, i) => mkPl(w, 2, ['tap_word', 'listen_pick'], 'm' + i)),
      ...IES_WORDS.slice(0, 3).map((w, i) => mkPl(w, 3, ['tap_word', 'listen_pick'], 'm' + i)),
    ],
  };
})();

// ============================================================
// LESSON 3 — Contractions  (skill: contractions)
// ============================================================
(function () {
  const NOT_FAM = [['do not', "don't"], ['can not', "can't"], ['is not', "isn't"], ['did not', "didn't"], ['was not', "wasn't"], ['are not', "aren't"]];
  const BE_FAM = [['I am', "I'm"], ['it is', "it's"], ['she is', "she's"], ['they are', "they're"], ['you are', "you're"], ['we will', "we'll"]];
  const ALL = NOT_FAM.concat(BE_FAM);
  const mkC = ([long, short], idea, kinds, i) => (used) => {
    const wrongs = l2Shuffle(ALL.filter(c => c[1] !== short)).slice(0, 2).map(c => c[1]);
    const noApos = short.replace(/'/g, '');
    return {
      key: `l3_${idea}_${short}_${i}`, idea, kinds,
      prompt: `Squeeze it! Which contraction means <b>${long}</b>?`, say: `Which contraction means ${long}?`,
      answer: short, choices: l2Shuffle(idea === 1 ? [short, noApos] : [short, ...wrongs]).map(t => ({ t })),
      why: `<b>${long}</b> squeezes into <b>${short}</b> — the apostrophe holds the missing letters' spot.`,
      hint: `Look for the apostrophe — it marks where letters squeezed out.`,
    };
  };
  L2_DEFS.contractions = {
    id: 'lang.spelling.3', n: 3, skill: 'contractions', strand: 'spell', subject: 'ela',
    title: 'Contractions', term: 'contractions',
    teaser: `Two words squeeze into one — and a tiny mark holds their place!`,
    goals: ['Say what a contraction is', "Squeeze the 'not' words", 'Squeeze the am, is and are words'],
    minutes: 15,
    warmup: {
      fromN: 2, fromTitle: 'More than one (plurals)',
      gen: () => ({
        key: 'wu_l3', prompt: `Which word means <b>more than one dog</b> 🐕?`, say: 'Which word means more than one dog?',
        answer: 'dogs', choices: l2Shuffle(['dog', 'dogs', 'doges']).map(t => ({ t })),
        why: `dog → <b>dogs</b> — just add -s!`, hint: `Most words just want an -s.`,
      }),
    },
    bank: { notFam: NOT_FAM, beFam: BE_FAM, easy: NOT_FAM[0] },
    idea1: {
      ruleHTML: `Pip's test: squeezed words <b>always carry an apostrophe</b> (').`,
      ruleSay: `Pip's test: squeezed words always carry an apostrophe.`,
      teachSay: `A contraction is two words squeezed into one. Some letters pop out — and the apostrophe holds their spot, like a bookmark!`,
      teachHTML: `A <b>contraction</b> = two words squeezed into one. The <b>apostrophe</b> (') bookmarks the missing letters!`,
      isLabel: 'IS A CONTRACTION', isntLabel: 'NOT A CONTRACTION',
      examples: [
        { html: `do not → <b>don't</b>`, why: `the o popped out — ' holds its spot` },
        { html: `I am → <b>I'm</b>`, why: `squeezed with its bookmark in place` },
      ],
      nonExamples: [
        { html: `<span class="l2-bad">dont</span>`, why: `no apostrophe — the bookmark is missing!` },
        { html: `did not`, why: `still two words — nothing squeezed yet` },
      ],
      quickCheck: { prompt: `Is <b>can't</b> a contraction?`, say: `Is can't a contraction?`, answer: true, word: "can't", split: "can not → can't — the ' holds the spot", fallback: { prompt: `Is <b>cant</b> (no mark) a contraction?`, say: 'Is c-a-n-t, with no little mark, a contraction?', answer: false, word: 'cant', split: 'no apostrophe — no bookmark!' } },
      worked: [
        { html: `is not → <b>isn't</b>`, say: `is not. Squeeze! The o pops out, the apostrophe slides in. Isn't!`, sayIt: `is not… isn't!` },
        { html: `it is → <b>it's</b>`, say: `it is. Squeeze! The i pops out. It's!`, sayIt: `it is… it's!` },
      ],
      firstTry: { prompt: `Which one is a real contraction?`, say: 'Which one is a real contraction?', answer: "don't", choices: ["don't", 'dont'], support: `look for the ' bookmark` },
      tryits: [mkC(NOT_FAM[1], 1, ['tap_word', 'listen_pick'], 0)],
    },
    idea2: {
      name: `The "not" family`,
      ruleHTML: `<b>not</b> loses its o: do<b>n't</b>, is<b>n't</b>, ca<b>n't</b>…`,
      ruleSay: `In the not family, not loses its o. Don't, isn't, can't.`,
      teachSay: `Watch the not family. Do not — don't. Is not — isn't. Every time, the o in not pops out and the apostrophe holds its place. N-apostrophe-t!`,
      teachHTML: `<div class="l2-teach-compare"><span>do <u>not</u></span><span class="l2-vs">o pops! →</span><span class="l2-good">do<u>n't</u></span></div>`,
      sayIt: `do not… don't!`,
      together: [{
        pipSay: `Was not. I'll squeeze the first part: was… Now the not loses its o. Which one finishes it?`,
        prompt: `was not → was … ?`, say: 'Was not squeezes into…?',
        answer: "wasn't", choices: ['wasnt', "wasn't", "was'nt"],
        hint: `n-apostrophe-t, right where the o was.`,
        why: `was not → <b>wasn't</b> — the ' sits where the o popped out.`,
      }],
      tryits: [mkC(NOT_FAM[3], 2, ['tap_word', 'listen_pick'], 0), mkC(NOT_FAM[5], 2, ['listen_pick', 'tap_word'], 1)],
    },
    idea3: {
      name: 'The am / is / are family',
      ruleHTML: `I<b>'m</b> · she<b>'s</b> · they<b>'re</b> — the little verb squeezes on.`,
      ruleSay: `I'm, she's, they're — the little verb squeezes onto the name word.`,
      teachSay: `This family squeezes the helper word. I am — I'm. She is — she's. They are — they're. The apostrophe rides along every time!`,
      teachHTML: `<div class="l2-teach-compare"><span>they <u>are</u></span><span class="l2-vs">squeeze →</span><span class="l2-good">they<u>'re</u></span></div>`,
      sayIt: `they are… they're!`,
      tryits: [mkC(BE_FAM[2], 3, ['tap_word', 'listen_pick'], 0), mkC(BE_FAM[4], 3, ['listen_pick', 'tap_word'], 1)],
    },
    reteachEasy: {
      line: `Tricky one! Let's look again with the easiest squeeze.`,
      html: `<div class="l2-teach-compare"><span>do not</span><span class="l2-vs">squeeze →</span><span class="l2-good">don't</span></div><p class="sent-note">The o pops out — the apostrophe (') holds its seat.</p>`,
      say: `Do not. Squeeze! The o pops out and the apostrophe holds its seat. Don't.`,
    },
    mastery: [
      ...NOT_FAM.map((w, i) => mkC(w, 2, ['tap_word', 'listen_pick'], 'm' + i)),
      ...BE_FAM.slice(0, 4).map((w, i) => mkC(w, 3, ['tap_word', 'listen_pick'], 'm' + i)),
    ],
  };
})();

// ============================================================
// LESSON 4 — Compound words  (skill: compound)  · the flagship (22a–22l)
// ============================================================
(function () {
  const WORDS = [
    { parts: ['sun', 'flower'], whole: 'sunflower', pic: '🌻', d: 1 },
    { parts: ['rain', 'bow'], whole: 'rainbow', pic: '🌈', d: 1 },
    { parts: ['cup', 'cake'], whole: 'cupcake', pic: '🧁', d: 1 },
    { parts: ['star', 'fish'], whole: 'starfish', pic: '⭐', d: 1 },
    { parts: ['butter', 'fly'], whole: 'butterfly', pic: '🦋', d: 2 },
    { parts: ['moon', 'light'], whole: 'moonlight', pic: '🌙', d: 1 },
    { parts: ['snow', 'man'], whole: 'snowman', pic: '⛄', d: 1 },
    { parts: ['rain', 'coat'], whole: 'raincoat', pic: '🧥', d: 1 },
    { parts: ['pop', 'corn'], whole: 'popcorn', pic: '🍿', d: 1 },
    { parts: ['dog', 'house'], whole: 'doghouse', pic: '🐕', d: 1 },
    { parts: ['foot', 'ball'], whole: 'football', pic: '🏈', d: 1 },
    { parts: ['tooth', 'brush'], whole: 'toothbrush', pic: '🪥', d: 2 },
  ];
  const NOT_WORDS = [['puppy', `"py" isn't a word`], ['jumping', `"ing" is an ending, not a word`], ['table', `you can't split it into two real words`], ['happy', `"py" isn't a word on its own`]];
  const DISTRACT = ['sock', 'boat', 'bug', 'hat', 'dog', 'sun'];
  const mkBuild = (w, idea, kinds, i) => (used) => {
    const tiles = l2Shuffle([w.parts[1], ...l2Shuffle(DISTRACT.filter(d => d !== w.parts[1] && d !== w.parts[0])).slice(0, kinds.includes('drag_drop') ? 3 : 2)]);
    return {
      key: `l4_build_${w.whole}_${i}`, idea, kinds,
      prompt: `Build <b>${w.whole}</b> ${w.pic}!`, say: `Build the word ${w.whole}!`,
      answer: w.parts[1], choices: tiles.map(t => ({ t })),
      parts: w.parts, whole: w.whole, pic: w.pic,
      why: `<b>${w.parts[0]}</b> + <b>${w.parts[1]}</b> = ${w.whole} — two real words holding hands!`,
      hint: `Say it slowly: ${w.parts[0]}… ${w.parts[1]}.`,
    };
  };
  const mkFind = (w, idea, kinds, i) => (used) => {
    const wrong = l2Shuffle(DISTRACT.filter(d => !w.parts.includes(d))).slice(0, 2);
    return {
      key: `l4_find_${w.whole}_${i}`, idea, kinds,
      prompt: `Which two words hide inside <b>${w.whole}</b> ${w.pic}?`, say: `Which two words hide inside ${w.whole}?`,
      answer: `${w.parts[0]} + ${w.parts[1]}`,
      choices: l2Shuffle([`${w.parts[0]} + ${w.parts[1]}`, `${w.parts[0]} + ${wrong[0]}`, `${wrong[1]} + ${w.parts[1]}`]).map(t => ({ t })),
      why: `<b>${w.whole}</b> splits into <b>${w.parts[0]}</b> + <b>${w.parts[1]}</b> — both real words!`,
      hint: `Split it out loud: ${w.parts[0]}… ${w.parts[1]}.`,
    };
  };
  const mkIsnt = (idea, kinds, i) => (used) => {
    const yes = l2PickFresh(WORDS, used, w => `l4_not_${w.whole}_${i}`);
    const no = l2Pick(NOT_WORDS);
    return {
      key: `l4_not_${no[0]}_${yes.whole}_${i}`, idea, kinds,
      prompt: `Which word is <b>NOT</b> a compound word?`, say: 'Which word is NOT a compound word?',
      answer: no[0],
      choices: l2Shuffle([no[0], yes.whole, l2Pick(WORDS.filter(w => w.whole !== yes.whole)).whole]).map(t => ({ t })),
      why: `<b>${no[0]}</b> fails Pip's test — ${no[1]}.`,
      hint: `Use Pip's test: split each word — are BOTH parts real?`,
    };
  };
  L2_DEFS.compound = {
    id: 'lang.spelling.4', n: 4, skill: 'compound', strand: 'spell', subject: 'ela',
    title: 'Compound words', term: 'compound words',
    teaser: `Two little words hold hands and make a brand-new word. Let's learn how!`,
    goals: ['Say what a compound word is', 'Build new words from two small words', 'Find the two words hiding inside a big word'],
    minutes: 15,
    warmup: {
      fromN: 2, fromTitle: 'More than one', // per the 22f frame: review pulls from Lesson 2
      gen: () => ({
        key: 'wu_l4', prompt: `Which word means <b>more than one dog</b> 🐕?`, say: 'Which word means more than one dog?',
        answer: 'dogs', choices: l2Shuffle(['dog', 'dogs', 'doges']).map(t => ({ t })),
        why: `dog → <b>dogs</b> — just add -s!`, hint: `Most words just want an -s.`,
      }),
    },
    bank: { words: WORDS, notWords: NOT_WORDS, distract: DISTRACT, easy: WORDS[9] },
    idea1: {
      ruleHTML: `Pip's test: <b>split the word</b> — do <u>both</u> parts make sense alone?`,
      ruleSay: `Pip's test: split the word — do both parts make sense alone?`,
      teachSay: `A compound word is two real words joined together. But watch out — some long words only LOOK like compounds! Sun and flower are both real words, so sunflower passes. Puppy splits into pup and py — and py isn't a word. Not a compound!`,
      teachHTML: `A compound word is <b>two real words joined together</b>. But watch out — some long words only <i>look</i> like compounds!`,
      isLabel: 'IS A COMPOUND WORD', isntLabel: 'NOT A COMPOUND WORD',
      examples: [
        { html: `sun ☀️ + flower 🌼 = <b>sunflower</b>`, why: `both parts are real words on their own` },
        { html: `rain 🌧️ + coat 🧥 = <b>raincoat</b>`, why: `a coat for the rain — the meaning joins too!` },
      ],
      nonExamples: [
        { html: `puppy → <span class="l2-bad">pup + py?</span>`, why: `"py" isn't a word — it's just one long word` },
        { html: `jumping → <span class="l2-bad">jump + ing?</span>`, why: `"ing" is an ending, not a word` },
      ],
      quickCheck: { prompt: `Is <b>butterfly</b> 🦋 a compound word?`, say: 'Now you be the teacher! Is butterfly a compound word?', answer: true, word: 'butterfly', split: 'butter | fly', fallback: { prompt: `Is <b>moonlight</b> 🌙 a compound word?`, say: 'Fresh one — is moonlight a compound word?', answer: true, word: 'moonlight', split: 'moon | light' } },
      worked: [
        { html: `butter 🧈 + fly 🪰 = <b>butterfly</b> 🦋`, say: `Watch me use the test! Butter is a word… fly is a word… squish them together — butterfly!`, sayIt: 'butter… fly… butterfly!' },
        { html: `star ⭐ + fish 🐟 = <b>starfish</b>`, say: `Star is a word… fish is a word… starfish! It passed the test.`, sayIt: 'star… fish… starfish!' },
      ],
      firstTry: { prompt: `Build <b>moonlight</b> 🌙 with Pip`, say: `Your turn — I'll help! Say it slowly with me: moon…?`, answer: 'light', choices: ['light', 'sock'], firstPart: 'moon', support: 'Pip split it for you: moon | ?' },
      tryits: [mkIsnt(1, ['tap_word', 'listen_pick'], 0)],
    },
    idea2: {
      name: 'Build a brand-new word',
      ruleHTML: `You can <b>build a brand-new word</b> by joining two small words.`,
      ruleSay: `You can build a brand-new word by joining two small words!`,
      teachSay: `Watch! When sun and flower hold hands… they make one brand-new word. Sunflower!`,
      teachHTML: `<div class="l2-join"><span class="l2-tile gold">☀️<b>sun</b></span><span class="l2-plus">+</span><span class="l2-tile teal">🌼<b>flower</b></span><span class="l2-plus">=</span><span class="l2-tile green big">🌻<b>sunflower</b></span></div>`,
      sayIt: 'sun… flower… sunflower!',
      together: [{
        pipSay: `Hmm… I see rain 🌧️. Now I need one more little word to build rainbow 🌈. Which one finishes it?`,
        prompt: `rain + ? = <b>rainbow</b> 🌈`, say: 'Rain plus what makes rainbow?',
        answer: 'bow', choices: ['boat', 'bow', 'bug'],
        firstPart: 'rain', whole: 'rainbow', pic: '🌈',
        hint: `Say rainbow slowly… rain—?`,
        why: `rain + <b>bow</b> = rainbow!`,
      }],
      tryits: [mkBuild(WORDS[2], 2, ['drag_drop', 'word_tiles', 'tap_word'], 0), mkBuild(WORDS[6], 2, ['word_tiles', 'drag_drop', 'tap_word'], 1)],
    },
    idea3: {
      name: 'Find the hiding words',
      ruleHTML: `Big word? <b>Split it</b> — two little words are hiding inside!`,
      ruleSay: `See a big word? Split it — two little words are hiding inside!`,
      teachSay: `Popcorn! Say it slowly… pop… corn. Two little words were hiding inside all along!`,
      teachHTML: `<div class="l2-join"><span class="l2-tile green big">🍿<b>popcorn</b></span><span class="l2-plus">splits into</span><span class="l2-tile gold">💥<b>pop</b></span><span class="l2-plus">+</span><span class="l2-tile teal">🌽<b>corn</b></span></div>`,
      sayIt: 'pop… corn… popcorn!',
      tryits: [mkFind(WORDS[10], 3, ['tap_word', 'listen_pick'], 0), mkFind(WORDS[11], 3, ['listen_pick', 'tap_word'], 1)],
    },
    reteachEasy: {
      line: `Tricky one! Let's look again with an easy word.`,
      html: `<div class="l2-join"><span class="l2-tile gold">🐕<b>dog</b></span><span class="l2-plus">+</span><span class="l2-tile teal">🏠<b>house</b></span><span class="l2-plus">=</span><span class="l2-tile green big"><b>doghouse</b></span></div><p class="sent-note">Dog is a word. House is a word. Both real — it passes Pip's test!</p>`,
      say: `Dog… house… doghouse! Dog is a word, house is a word — it passes the test.`,
    },
    mastery: [
      ...WORDS.slice(0, 4).map((w, i) => mkBuild(w, 2, ['drag_drop', 'tap_word', 'word_tiles'], 'm' + i)),
      ...WORDS.slice(4, 8).map((w, i) => mkFind(w, 3, ['tap_word', 'listen_pick'], 'm' + i)),
      mkIsnt(1, ['tap_word', 'listen_pick'], 'm8'), mkIsnt(1, ['listen_pick', 'tap_word'], 'm9'),
    ],
  };
})();

// ============================================================
// LESSON 5 — Tricky plurals  (skill: ela_irreg_plural)
// ============================================================
(function () {
  const CHANGE = [['man', 'men', '🧑'], ['foot', 'feet', '🦶'], ['tooth', 'teeth', '🦷'], ['mouse', 'mice', '🐭'], ['child', 'children', '🧒'], ['goose', 'geese', '🪿']];
  const FV = [['leaf', 'leaves', '🍃'], ['wolf', 'wolves', '🐺'], ['knife', 'knives', '🔪']];
  const SAME = [['sheep', 'sheep', '🐑'], ['fish', 'fish', '🐟'], ['deer', 'deer', '🦌']];
  const mkT = ([one, many, pic], idea, kinds, i) => (used) => {
    const wrongs = idea === 3 ? [one + 's', one + 'es'] : [one + 's', idea === 1 ? one + 'es' : many + 's'];
    return {
      key: `l5_${idea}_${one}_${i}`, idea, kinds,
      prompt: `One <b>${one}</b> ${pic} — but TWO … ?`, say: `One ${one}. But two…?`,
      answer: many, choices: l2Shuffle([many, ...wrongs]).map(t => ({ t })),
      why: `${one} → <b>${many}</b>${idea === 1 ? ' — this word changes completely!' : idea === 2 ? ' — the f turns into v, then -es.' : ' — it stays exactly the same!'}`,
      hint: idea === 1 ? `No -s allowed — the whole word changes.` : idea === 2 ? `The f is shy — it turns into a v.` : `Some words don't change at all!`,
    };
  };
  L2_DEFS.ela_irreg_plural = {
    id: 'lang.spelling.5', n: 5, skill: 'ela_irreg_plural', strand: 'spell', subject: 'ela',
    title: 'Tricky plurals', term: 'tricky plurals',
    teaser: `Some words refuse the -s rule. Rule-breakers ahead — let's catch them!`,
    goals: ['Spot words that change completely', 'Turn f into v (leaf → leaves)', 'Know the words that never change'],
    minutes: 15,
    warmup: {
      fromN: 2, fromTitle: 'More than one',
      gen: () => ({
        key: 'wu_l5', prompt: `Two 📦 — pick the plural!`, say: 'More than one box — which is it?',
        answer: 'boxes', choices: l2Shuffle(['boxs', 'boxes', 'boxies']).map(t => ({ t })),
        why: `box ends with a hiss → <b>boxes</b>.`, hint: `s, x, ch, sh endings need -es.`,
      }),
    },
    bank: { change: CHANGE, fv: FV, same: SAME, easy: CHANGE[1] },
    idea1: {
      ruleHTML: `Pip's test: try adding -s — if it sounds silly, <b>the word breaks the rules</b>!`,
      ruleSay: `Pip's test: try adding s. If it sounds silly, the word breaks the rules!`,
      teachSay: `Most words add s. But some words are rule-breakers! Two mans? Silly. It's men — the whole word changes. Let's meet the rule-breakers.`,
      teachHTML: `Some words <b>break the plural rules</b> — no -s for them. The whole word changes!`,
      isLabel: 'RULE-BREAKER', isntLabel: 'RULE-FOLLOWER',
      examples: [
        { html: `man → <b>men</b> 🧑`, why: `"mans" sounds silly — the word changes!` },
        { html: `foot → <b>feet</b> 🦶`, why: `two foots? no — two feet!` },
      ],
      nonExamples: [
        { html: `dog → dogs 🐕`, why: `follows the rule — just add -s` },
        { html: `cat → cats 🐈`, why: `no tricks here` },
      ],
      quickCheck: { prompt: `Is <b>tooth → teeth</b> a rule-breaker?`, say: 'One tooth, two teeth. Is tooth a rule-breaker?', answer: true, word: 'teeth', split: 'tooth → teeth (no -s!)', fallback: { prompt: `Is <b>tree → trees</b> a rule-breaker?`, say: 'One tree, two trees. Is tree a rule-breaker?', answer: false, word: 'trees', split: 'tree + s — follows the rule' } },
      worked: [
        { html: `mouse → <b>mice</b> 🐭`, say: `One mouse. Try the test — two mouses? Silly! The word changes… mice!`, sayIt: 'mouse… mice!' },
        { html: `child → <b>children</b> 🧒`, say: `One child. Two childs? No way — children!`, sayIt: 'child… children!' },
      ],
      firstTry: { prompt: `One 🦶 foot — TWO … ?`, say: 'One foot. Two…?', answer: 'feet', choices: ['feet', 'foots'], support: 'the oo changes to ee' },
      tryits: [mkT(CHANGE[5], 1, ['tap_word', 'listen_pick'], 0)],
    },
    idea2: {
      name: 'f turns into v',
      ruleHTML: `Ends in <b>f</b>? The f turns into <b>v</b> — then add -es.`,
      ruleSay: `When a word ends in f, the f turns into a v, then add e-s.`,
      teachSay: `Leaf! One leaf falls. Then lots fall — leafs? No. The f is shy — it turns into a v. Leaves!`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-bad">lea<u>f</u>s</span><span class="l2-vs">f → v →</span><span class="l2-good">lea<u>ves</u> 🍃</span></div>`,
      sayIt: 'leaf… leaves!',
      together: [{
        pipSay: `One wolf 🐺 howls. Now the whole pack! Wolf ends in f — remember what the f does?`,
        prompt: `One wolf — a whole pack of … ?`, say: 'One wolf. A whole pack of…?',
        answer: 'wolves', choices: ['wolfs', 'wolves', 'wolfes'],
        hint: `f turns into v — then -es.`,
        why: `wolf → <b>wolves</b> — the f became a v!`,
      }],
      tryits: [mkT(FV[2], 2, ['tap_word', 'listen_pick'], 0), mkT(FV[0], 2, ['listen_pick', 'tap_word'], 1)],
    },
    idea3: {
      name: 'The never-change words',
      ruleHTML: `A few words <b>never change</b>: one sheep… two sheep!`,
      ruleSay: `A few words never change at all. One sheep, two sheep!`,
      teachSay: `The laziest plurals of all — they don't change one bit! One sheep, ten sheep. One fish, a whole tank of fish.`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-good">one sheep 🐑</span><span class="l2-vs">and</span><span class="l2-good">ten sheep 🐑🐑🐑</span></div>`,
      sayIt: 'one sheep… two sheep… same word!',
      tryits: [mkT(SAME[1], 3, ['tap_word', 'listen_pick'], 0), mkT(SAME[2], 3, ['listen_pick', 'tap_word'], 1)],
    },
    reteachEasy: {
      line: `Tricky one! Let's use the easiest rule-breaker.`,
      html: `<div class="l2-teach-compare"><span>one foot 🦶</span><span class="l2-vs">two →</span><span class="l2-good">feet 🦶🦶</span></div><p class="sent-note">Say it with the -s test: "two foots"? Silly! Rule-breakers change instead.</p>`,
      say: `One foot. Two foots? That sounds silly — so the word changes. Feet!`,
    },
    mastery: [
      ...CHANGE.map((w, i) => mkT(w, 1, ['tap_word', 'listen_pick'], 'm' + i)),
      ...FV.map((w, i) => mkT(w, 2, ['tap_word', 'listen_pick'], 'm' + i)),
      ...SAME.slice(0, 2).map((w, i) => mkT(w, 3, ['tap_word', 'listen_pick'], 'm' + i)),
    ],
  };
})();

// ============================================================
// LESSON 6 — Un-squeeze the contraction  (skill: ela_contraction_expand)
// ============================================================
(function () {
  const NOT_FAM = [["don't", 'do not'], ["can't", 'can not'], ["isn't", 'is not'], ["didn't", 'did not'], ["wasn't", 'was not'], ["aren't", 'are not']];
  const BE_FAM = [["I'm", 'I am'], ["it's", 'it is'], ["she's", 'she is'], ["they're", 'they are'], ["you're", 'you are'], ["we'll", 'we will']];
  const ALL = NOT_FAM.concat(BE_FAM);
  const mkX = ([short, long], idea, kinds, i) => (used) => {
    const wrongs = l2Shuffle(ALL.filter(c => c[1] !== long)).slice(0, 2).map(c => c[1]);
    return {
      key: `l6_${idea}_${short}_${i}`, idea, kinds,
      prompt: `Un-squeeze it! <b>${short}</b> is short for … ?`, say: `${short} is short for which two words?`,
      answer: long, choices: l2Shuffle([long, ...wrongs]).map(t => ({ t })),
      why: `<b>${short}</b> = <b>${long}</b> — the apostrophe showed where letters squeezed out.`,
      hint: `The apostrophe marks the squeeze spot — open it back up!`,
    };
  };
  L2_DEFS.ela_contraction_expand = {
    id: 'lang.spelling.6', n: 6, skill: 'ela_contraction_expand', strand: 'spell', subject: 'ela',
    title: 'Un-squeeze the contraction', term: 'un-squeezing contractions',
    teaser: `We squeezed words small — now let's stretch them back out!`,
    goals: ['Stretch a contraction back into two words', "Un-squeeze the 'not' words", 'Un-squeeze the am, is and are words'],
    minutes: 15,
    warmup: {
      fromN: 3, fromTitle: 'Contractions',
      gen: () => ({
        key: 'wu_l6', prompt: `Which contraction means <b>do not</b>?`, say: 'Which contraction means do not?',
        answer: "don't", choices: l2Shuffle(["don't", 'dont', "do'nt"]).map(t => ({ t })),
        why: `do not → <b>don't</b> — the ' sits where the o was.`, hint: `The apostrophe holds the missing o's seat.`,
      }),
    },
    bank: { notFam: NOT_FAM, beFam: BE_FAM, easy: NOT_FAM[0] },
    idea1: {
      ruleHTML: `Pip's test: read the apostrophe backwards — <b>what letters squeezed out?</b>`,
      ruleSay: `Pip's test: read the apostrophe backwards. What letters squeezed out?`,
      teachSay: `Last time we squeezed words together. Today we un-squeeze! The apostrophe is a clue — it shows exactly where letters popped out. Open it up and the two words come back.`,
      teachHTML: `<b>Un-squeezing</b> = stretching a contraction back into its <b>two words</b>. The apostrophe shows where to open it!`,
      isLabel: 'UN-SQUEEZED RIGHT', isntLabel: 'OPENED WRONG',
      examples: [
        { html: `don't → <b>do not</b>`, why: `the ' was holding the o of "not"` },
        { html: `I'm → <b>I am</b>`, why: `the ' was holding the a of "am"` },
      ],
      nonExamples: [
        { html: `don't → <span class="l2-bad">do never?</span>`, why: `never wasn't squeezed in there — only "not"` },
        { html: `it's → <span class="l2-bad">it was?</span>`, why: `the ' holds an i — "it is"` },
      ],
      quickCheck: { prompt: `Does <b>can't</b> open into <b>can not</b>?`, say: `Does can't open up into can not?`, answer: true, word: "can't", split: "can't → can + not", fallback: { prompt: `Does <b>she's</b> open into <b>she was</b>?`, say: `Does she's open up into she was?`, answer: false, word: "she's", split: "she's → she + is" } },
      worked: [
        { html: `isn't → <b>is not</b>`, say: `Isn't. I see n-apostrophe-t… that's the not family! Open it up: is… not.`, sayIt: `isn't… is not!` },
        { html: `they're → <b>they are</b>`, say: `They're. The apostrophe holds an a… they are!`, sayIt: `they're… they are!` },
      ],
      firstTry: { prompt: `Open up <b>didn't</b>!`, say: `Open up didn't — what two words?`, answer: 'did not', choices: ['did not', 'does not'], support: `n't always opens to "not"` },
      tryits: [mkX(NOT_FAM[4], 1, ['tap_word', 'listen_pick'], 0)],
    },
    idea2: {
      name: `Open the "not" family`,
      ruleHTML: `See <b>n't</b>? It always opens into <b>not</b>.`,
      ruleSay: `See n-apostrophe-t? It always opens into not.`,
      teachSay: `The not family is easy to spot — n-apostrophe-t at the end. Don't, can't, isn't. Every single one opens into… not!`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-good">ca<u>n't</u></span><span class="l2-vs">opens →</span><span>can <u>not</u></span></div>`,
      sayIt: `can't… can not!`,
      together: [{
        pipSay: `Wasn't. I'll open the first part: was… Now the n't — you know what it hides!`,
        prompt: `wasn't → was … ?`, say: `Wasn't opens into was…?`,
        answer: 'was not', choices: ['was no', 'was not', 'was never'],
        hint: `n't always hides "not".`,
        why: `wasn't → <b>was not</b>!`,
      }],
      tryits: [mkX(NOT_FAM[3], 2, ['tap_word', 'listen_pick'], 0), mkX(NOT_FAM[5], 2, ['listen_pick', 'tap_word'], 1)],
    },
    idea3: {
      name: 'Open the am / is / are family',
      ruleHTML: `<b>'m</b> = am · <b>'s</b> = is · <b>'re</b> = are`,
      ruleSay: `Apostrophe m is am. Apostrophe s is is. Apostrophe r-e is are.`,
      teachSay: `This family hides little helper words. Apostrophe-m? Am. Apostrophe-s? Is. Apostrophe-r-e? Are. You're — you are!`,
      teachHTML: `<div class="l2-teach-compare"><span class="l2-good">you<u>'re</u></span><span class="l2-vs">opens →</span><span>you <u>are</u></span></div>`,
      sayIt: `you're… you are!`,
      tryits: [mkX(BE_FAM[1], 3, ['tap_word', 'listen_pick'], 0), mkX(BE_FAM[3], 3, ['listen_pick', 'tap_word'], 1)],
    },
    reteachEasy: {
      line: `Tricky one! Let's open the easiest squeeze.`,
      html: `<div class="l2-teach-compare"><span class="l2-good">don't</span><span class="l2-vs">opens →</span><span>do not</span></div><p class="sent-note">The ' was holding the o. Put it back — do not!</p>`,
      say: `Don't. The apostrophe was holding an o. Put it back… do not!`,
    },
    mastery: [
      ...NOT_FAM.map((w, i) => mkX(w, 2, ['tap_word', 'listen_pick'], 'm' + i)),
      ...BE_FAM.slice(0, 4).map((w, i) => mkX(w, 3, ['tap_word', 'listen_pick'], 'm' + i)),
    ],
  };
})();

/* ============================================================
   VALIDATOR — build-time rules, run once at load (console only).
   Teach-before-test + bank containment are enforced by structure
   (makers close over their own lesson's bank); this checks shape.
   ============================================================ */
function l2Validate() {
  const problems = [];
  for (const [skill, d] of Object.entries(L2_DEFS)) {
    const where = (m) => problems.push(`${d.id} (${skill}): ${m}`);
    if (!d.goals || d.goals.length !== 3) where('needs exactly 3 goals');
    if (!d.idea1 || !d.idea2 || !d.idea3) where('needs ideas 1–3');
    if (d.idea1) {
      if (!(d.idea1.examples || []).length || !(d.idea1.nonExamples || []).length) where('idea 1 needs examples AND non-examples');
      if (!d.idea1.quickCheck || !d.idea1.quickCheck.fallback) where('idea 1 needs a quick check with a fallback');
      if ((d.idea1.worked || []).length < 2) where('idea 1 needs 2 worked examples');
      if (!d.idea1.firstTry || (d.idea1.firstTry.choices || []).length !== 2) where('first try needs exactly 2 choices');
    }
    if (!(d.mastery || []).length || d.mastery.length < 8) where('mastery pool needs ≥ 8 makers');
    if (d.n > 1 && !d.warmup) where('lessons after the first need a labeled warm-up');
    // sample-run every maker: required fields + speakable audio text
    const used = new Set();
    [...(d.idea1.tryits || []), ...(d.idea2.tryits || []), ...(d.idea3.tryits || []), ...(d.mastery || [])].forEach((mk, i) => {
      try {
        const q = mk(used);
        if (!q.key || !q.answer || !q.prompt || !q.say) where(`question ${i} missing key/prompt/say/answer`);
        if (!(q.kinds || []).length) where(`question ${i} declares no input types`);
        if (q.choices && !q.choices.some(c => c.t === q.answer)) where(`question ${i} answer not among its choices`);
      } catch (e) { where(`question maker ${i} threw: ${e.message}`); }
    });
  }
  if (problems.length) console.warn('[lesson2 validator]', problems);
  return problems;
}
try { l2Validate(); } catch (e) { console.warn('lesson2 validator crashed', e); }

/* ============================================================
   AUTO LESSONS — every other skill gets the SAME teaching arc,
   powered by its own question generator (`sk.gen(lvl)`).
   Authored L2_DEFS stay richer (real is/isn't teaching); autos
   teach with the strand's lesson cards + Pip-solved examples,
   then run the identical quick-check → worked → first-try →
   warm-up → cycles → 3-in-a-row mastery machine.
   ============================================================ */
const L2_AUTO_CACHE = {};

function l2AutoEligible(sk) {
  if (!sk || typeof sk.gen !== 'function') return false;
  const strand = STRANDS.find(x => x.id === sk.strand) || {};
  if (strand.id === 'handwriting') return false;           // trace engine owns these
  if (strand.subject === 'ela' && strand.id === 'reading' && sk.id.startsWith('read_')) return false; // story reader owns these
  try {
    for (const lvl of [1, 2]) {
      const q = sk.gen(lvl);
      if (!q || !['mc', 'num', 'text', 'line', 'picture'].includes(q.type)) return false;
    }
  } catch (e) { return false; }
  return true;
}

// wrap one generated question into the engine's format
function l2FromGen(sk, lvl, idea, tag) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const g = sk.gen(lvl);
    const say = speakableText(g.prompt || '');
    const base = {
      key: `ag_${sk.id}_${tag}_${String(say).slice(0, 40)}_${g.answer}`,
      idea, prompt: g.prompt, say, body: g.body || null,
      answer: String(g.answer),
      why: g.explain || `${g.answer} is right!`,
      hint: `Read it slowly one more time — you've got this!`,
      exact: !!g.exact,
    };
    if (g.type === 'picture') {
      base.kinds = ['tap_picture'];
      base.choices = g.cards.map(c => ({ t: String(c.label), pic: c.emoji || c.pic || null }));
      return base;
    }
    if (g.type === 'mc') {
      base.kinds = ['tap_word', 'listen_pick'];
      base.choices = g.choices.slice(0, 4).map(c => ({ t: String(c) }));
      if (!base.choices.some(c => c.t === base.answer)) continue; // safety: answer must be present
      // listen_pick only when the prompt speaks on its own (no reliance on body visuals)
      if (g.body) base.kinds = ['tap_word'];
      return base;
    }
    // num / line / text → typed answer
    base.kinds = ['type_in'];
    base.numeric = g.type === 'num' || g.type === 'line';
    return base;
  }
  return null;
}

// 2 tap choices for the training-wheels first try (answer + 1 near-miss)
function l2AutoTwoChoices(sk) {
  const g = sk.gen(1);
  const ans = String(g.answer);
  let wrong;
  if (g.type === 'mc' && g.choices) wrong = String(g.choices.find(c => String(c) !== ans) || '');
  if (!wrong) {
    const n = Number(String(ans).replace(/[,\s]/g, ''));
    if (!isNaN(n) && String(n) === String(ans).trim()) wrong = String(n + (n > 2 ? -1 : 1));
    else { const g2 = sk.gen(1); wrong = String(g2.answer) !== ans ? String(g2.answer) : ans.split('').reverse().join(''); }
  }
  return { g, ans, wrong: wrong === ans ? ans + '?' : wrong };
}

// teach material: strand lesson cards, topped up with Pip-solved examples
function l2AutoTeachCards(sk, strand) {
  const chunks = strand.lesson ? lessonChunks(strand.lesson).slice(0, 3) : [];
  const cards = chunks.map(c => ({
    html: `<div class="ls-chunk cur" style="font-size:15px">${c}</div>`,
    say: speakableText(c),
  }));
  while (cards.length < 3) {
    const g = sk.gen(1);
    cards.push({
      html: `<div class="l2-solved"><p class="l2-solved-q">${g.prompt}</p>${g.body ? `<div class="qbody">${g.body}</div>` : ''}
        <div class="l2-solved-a">${icon('arrowright', 14)} <b>${esc(String(g.answer))}</b></div>
        <p class="sent-note">${g.explain || ''}</p></div>`,
      say: `Watch me do one! ${speakableText(g.prompt)} … The answer is ${g.answer}. ${speakableText(g.explain || '')}`,
      solved: true,
    });
  }
  return cards;
}

function l2AutoDef(sk) {
  if (L2_AUTO_CACHE[sk.id]) return L2_AUTO_CACHE[sk.id];
  const strand = STRANDS.find(x => x.id === sk.strand) || {};
  const lessons = lessonsForStrand(strand.id || sk.strand);
  const n = Math.max(1, lessons.findIndex(l => l.skillId === sk.id) + 1);
  const prev = n > 1 ? SKILL_MAP[lessons[n - 2].skillId] : null;
  const teach = l2AutoTeachCards(sk, strand);
  const mkQ = (lvl, idea, tag) => (used) => l2FromGen(sk, lvl, idea, tag) || l2FromGen(sk, 1, idea, tag + 'f');
  const w1 = sk.gen(1), w2 = sk.gen(1);
  const solvedHTML = (g) => `<span class="l2-worked-line">${g.prompt}${g.body ? `<div class="qbody" style="margin-top:6px">${g.body}</div>` : ''}<span class="l2-solved-a">${icon('arrowright', 14)} <b>${esc(String(g.answer))}</b></span></span>`;
  const ft = l2AutoTwoChoices(sk);
  const tg = l2AutoTwoChoices(sk);
  const tgThird = l2AutoTwoChoices(sk);
  const name = sk.name;
  const def = {
    auto: true,
    id: 'auto.' + sk.id, n, skill: sk.id, strand: strand.id || sk.strand, subject: strand.subject || 'custom',
    title: name, term: name.toLowerCase(),
    teaser: `${name} — let's figure it out together!`,
    goals: [`Learn how ${name.toLowerCase()} works`, `Try it with Pip helping`, `Show it off — 3 in a row!`],
    minutes: 12,
    warmup: prev ? {
      fromN: n - 1, fromTitle: prev.name,
      gen: () => l2FromGen(prev, 1, 0, 'wu') || l2FromGen(prev, 1, 0, 'wu2'),
    } : null,
    teachCards: teach,
    idea1: {
      teachSay: teach[0].say,
      teachHTML: `<b>${esc(name)}</b> — watch first, then we try together!`,
      quickGen: () => l2FromGen(sk, 1, 1, 'qc'),
      worked: [
        { html: solvedHTML(w1), say: `Watch me do one! ${speakableText(w1.prompt)} … The answer is ${w1.answer}. ${speakableText(w1.explain || '')}`, sayIt: String(w1.answer) },
        { html: solvedHTML(w2), say: `One more! ${speakableText(w2.prompt)} … It's ${w2.answer}!`, sayIt: String(w2.answer) },
      ],
      firstTry: {
        prompt: ft.g.prompt, say: speakableText(ft.g.prompt), body: ft.g.body || null,
        answer: ft.ans, choices: l2Shuffle([ft.ans, ft.wrong]),
        support: `Pip narrowed it to two — pick the one that fits!`,
      },
      tryits: [mkQ(1, 1, 't1')],
    },
    idea2: {
      name: 'Try it together',
      teachSay: teach[1].say, teachHTML: teach[1].html, solvedTeach: !!teach[1].solved,
      ruleHTML: ``, ruleSay: ``, sayIt: ``,
      together: [{
        pipSay: `Let's do this one as a team — I'll read it, you pick!`,
        prompt: tg.g.prompt, say: speakableText(tg.g.prompt), body: tg.g.body || null,
        answer: tg.ans, choices: l2Shuffle([...new Set([tg.ans, tg.wrong, tgThird.ans !== tg.ans ? tgThird.ans : tgThird.wrong])]).slice(0, 3),
        hint: `Take your time — say it out loud first.`,
        why: tg.g.explain || `${tg.ans} is right!`,
      }],
      tryits: [mkQ(2, 2, 't2a'), mkQ(2, 2, 't2b')],
    },
    idea3: {
      name: 'On your own',
      teachSay: teach[2].say, teachHTML: teach[2].html, solvedTeach: !!teach[2].solved,
      ruleHTML: ``, ruleSay: ``, sayIt: ``,
      tryits: [mkQ(2, 3, 't3a'), mkQ(2, 3, 't3b')],
    },
    reteachEasy: {
      line: `Tricky one! Let's watch an easy one together first.`,
      auto: true, // html generated fresh at reteach time from gen(1)
    },
    mastery: Array.from({ length: 12 }, (_, i) => mkQ(2, ((i % 3) + 1), 'm' + i)),
  };
  L2_AUTO_CACHE[sk.id] = def;
  return def;
}

// authored def OR auto def for a skill (null = keep the classic flow)
function l2DefFor(skillId) {
  if (L2_DEFS[skillId]) return L2_DEFS[skillId];
  const sk = typeof SKILL_MAP !== 'undefined' ? SKILL_MAP[skillId] : null;
  if (sk && l2AutoEligible(sk)) return l2AutoDef(sk);
  return null;
}

/* ============================================================
   ENGINE — state machine + per-kid persistence
   kidLearn().l2[lessonId] = { step, stars, streak, mq, status,
     missQ:{qkey:n}, missKind:{kind:n}, avoidKind, used:[qkeys] }
   ============================================================ */
let LS2 = null;

function l2Flow(def) {
  const f = [{ t: 'opener' }, { t: 'isisnt' }, { t: 'quick' }, { t: 'worked' }, { t: 'first' }];
  if (def.warmup) f.push({ t: 'warmup' });
  def.idea1.tryits.forEach((mk, n) => f.push({ t: 'tryit', idea: 1, n }));
  f.push({ t: 'teach', idea: 2 });
  (def.idea2.together || []).forEach((tg, n) => f.push({ t: 'together', idea: 2, n }));
  def.idea2.tryits.forEach((mk, n) => f.push({ t: 'tryit', idea: 2, n }));
  f.push({ t: 'teach', idea: 3 });
  def.idea3.tryits.forEach((mk, n) => f.push({ t: 'tryit', idea: 3, n }));
  f.push({ t: 'mastery' }, { t: 'done' });
  return f;
}
function l2StepTotal(skillId) {
  const def = l2DefFor(skillId);
  return def ? l2Flow(def).length : null;
}

function l2State(lessonId) {
  const L = kidLearn();
  L.l2 = L.l2 || {};
  L.l2[lessonId] = L.l2[lessonId] || {
    step: 0, stars: 0, streak: 0, mq: 0, status: 'not_started',
    missQ: {}, missKind: {}, avoidKind: null, used: [],
  };
  return L.l2[lessonId];
}

function l2Start(ls, strandId, opts = {}) {
  const def = l2DefFor(ls.skillId);
  const st = l2State(ls.id);
  if (opts.review && st.status === 'mastered') { st.step = 0; st.streak = 0; st.mq = 0; } // review = walk it again, keep status
  if (st.status === 'not_started') st.status = 'in_progress';
  const flow = l2Flow(def);
  if (st.step >= flow.length) st.step = flow.length - 2; // safety: land on mastery
  LS2 = {
    ls, def, strandId, flow, review: !!opts.review, t0: Date.now(),
    st, lastKind: null, q: null, mastQueue: null, resumed: st.step > 0 && !opts.review,
    qStart: 0, rushStreak: 0, // Phase 1 rush detection — session-only, never persisted
  };
  VIEW = 'session';
  TT.ctx = ls.skillId;
  $('#tabbar').style.display = 'none';
  if (LS2.resumed && flow[st.step].t !== 'done') l2Resume(); else l2Paint();
}

function l2SaveStep() {
  const L = kidLearn();
  L.paths[LS2.strandId] = L.paths[LS2.strandId] || {};
  if (LS2.st.status === 'mastered' || LS2.st.status === 'learned') delete L.paths[LS2.strandId].current;
  else L.paths[LS2.strandId].current = { lessonId: LS2.ls.id, step: LS2.st.step };
  save();
}
function l2Advance(n = 1) {
  LS2.st.step += n;
  l2SaveStep();
  l2Paint();
}

/* ---------------- Phase 1 · pacing gate ----------------
   Advance buttons wait until Pip finishes talking. The button renders muted +
   disabled with "Pip is talking…" (a neutral token, never the wrong-answer
   amber/red). Pass the returned release() as the narration's onDone — foxSpeak's
   fail-open watchdog guarantees it eventually runs even with no voices. After an
   800ms settle the real label returns with a transform-only pop (skipped under
   calm-motion). Exit (X), Play/Again/Slower and replay are NEVER gated. */
function l2GateBtn(btn) {
  if (!btn) return () => {};
  const real = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('l2-talking');
  btn.innerHTML = `${icon('volume', 13)} <span>Pip is talking…</span>`;
  let released = false;
  return () => {
    if (released) return; released = true;
    setTimeout(() => {
      if (!btn.isConnected) return;
      btn.disabled = false;
      btn.classList.remove('l2-talking');
      btn.innerHTML = real;
      if (!document.body.classList.contains('calm-motion')) {
        btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
      }
    }, 800);
  };
}

/* ---------------- app bar: phase pill or grouped rail ---------------- */
function l2PhasePill(text, tint, color) {
  return `<span class="l2-phase-pill" style="background:${tint};color:${color}">${text}</span>`;
}
function l2Rail() {
  const { flow, st } = LS2;
  const cur = st.step;
  const groups = [
    ['WARM-UP', (s) => s.t === 'warmup'],
    ['LEARN', (s) => s.t === 'isisnt' || s.t === 'teach'],
    ['TOGETHER', (s) => s.t === 'first' || s.t === 'together'],
    ['YOU TRY', (s) => s.t === 'tryit'],
  ];
  const u = subjUI(LS2.def.subject);
  const gHTML = groups.map(([label, match]) => {
    const idxs = flow.map((s, i) => match(s) ? i : -1).filter(i => i >= 0);
    if (!idxs.length) return '';
    const dots = idxs.map(i => `<span class="l2-dot ${i < cur ? 'done' : i === cur ? 'cur' : ''}" style="${i < cur ? `background:${u.color};border-color:${u.color}` : ''}">${i < cur ? icon('check', 9) : ''}</span>`).join('');
    const active = idxs.some(i => i === cur);
    return `<span class="l2-rail-group ${active ? 'active' : ''}"><span class="l2-rail-dots">${dots}</span><small>${label}</small></span>`;
  }).join('');
  const mi = flow.findIndex(s => s.t === 'mastery');
  const mast = `<span class="l2-rail-group ${cur === mi ? 'active' : ''}"><span class="l2-rail-dots">${l2DaisySVG(15, cur >= mi)}</span><small>MASTERY</small></span>`;
  const prize = `<span class="l2-rail-group"><span class="l2-rail-dots">${giftSVG(14)}</span><small>PRIZE</small></span>`;
  return `<span class="l2-rail">${gHTML}${mast}${prize}</span>`;
}
function l2Bar(mid) {
  // mid: {pill:[text,tint,color]} | {rail:true} | null (minimal)
  const midHTML = mid && mid.rail ? l2Rail() : mid && mid.pill ? l2PhasePill(...mid.pill) : '';
  setAppbar(`
    <button class="back" id="l2Close" aria-label="Close">${icon('x', 17)}</button>
    <div class="title">${esc(LS2.def.title)}</div>
    <span class="ab-spacer"></span>${midHTML}<span class="ab-spacer"></span>
    <span class="pill gold">${icon('star', 14)} +${LS2.st.stars}</span>`);
  $('#l2Close').onclick = () => { lpSpeechStop(); l2SaveStep(); show('learnpath', LS2.strandId); };
}

/* ---------------- paint router ---------------- */
function l2Paint() {
  const step = LS2.flow[LS2.st.step];
  if (!step) return l2Celebrate();
  const map = {
    opener: l2Opener, isisnt: l2IsIsnt, quick: l2QuickCheck, worked: l2Worked, first: l2FirstTry,
    warmup: l2Warmup, teach: () => l2Teach(step.idea), together: () => l2Together(step.idea, step.n),
    tryit: () => l2Tryit(step.idea, step.n), mastery: l2Mastery, done: l2Celebrate,
  };
  (map[step.t] || l2Celebrate)();
}

function l2Resume() {
  l2Bar();
  const k = kid();
  app.innerHTML = `<div class="reveal lp-center">
    <span class="fox-face big pop">${foxSVG(96, 'cheer')}</span>
    <h1 class="lp-goal" style="font-size:32px;margin-top:16px">Welcome back, ${esc(k.name)}!</h1>
    <p style="font-size:19px;font-weight:600;color:var(--soft);max-width:560px">We're partway through <b>${esc(LS2.def.title)}</b>${LS2.flow[LS2.st.step].t === 'mastery' ? ' — your mastery check is waiting, right where you left it' : ''}. Ready?</p>
    <div style="display:flex;gap:12px;margin-top:24px">
      <button class="btn primary big caps-btn" id="l2Keep">Keep going</button>
      <button class="btn big" id="l2Over">Start over</button>
    </div>
  </div>`;
  wireFox(`Welcome back, ${k.name}! Let's keep going.`);
  $('#l2Keep').onclick = () => { lpSpeechStop(); LS2.resumed = false; l2Paint(); };
  $('#l2Over').onclick = () => {
    lpSpeechStop();
    const fresh = { step: 0, stars: 0, streak: 0, mq: 0, status: 'in_progress', missQ: {}, missKind: {}, avoidKind: null, used: [] };
    Object.assign(LS2.st, fresh);
    LS2.resumed = false; l2SaveStep(); l2Paint();
  };
}

/* ---------------- 22a · opener ---------------- */
function l2Opener() {
  const d = LS2.def;
  const u = subjUI(d.subject);
  l2Bar();
  app.innerHTML = `<div class="reveal lp-center">
    <div class="l2-fox-row">
      <span class="fox-face pop">${foxSVG(74, 'talk')}</span>
      <div class="fox-card" style="text-align:left">
        <p class="fox-say">${esc(d.teaser)}</p>
        <p class="eyebrow" style="color:var(--teal);margin-top:8px">${icon('volume', 12)} Pip reads everything aloud</p>
      </div>
    </div>
    <p class="eyebrow" style="color:${u.color};margin-top:16px">Lesson ${d.n} · ${esc((STRANDS.find(x => x.id === d.strand) || {}).name || d.subject)} path · one skill only</p>
    <h1 class="lp-goal">Today you'll learn <span style="color:${u.color}">${esc(d.term)}</span>!</h1>
    <div class="l2-goals card">
      <p class="eyebrow">By the end, you will be able to…</p>
      ${d.goals.map((g, i) => `<div class="l2-goal-row"><span class="l2-goal-n">${i + 1}</span><span>${esc(g)}</span></div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-top:20px">
      <button class="btn primary big caps-btn" id="l2Go">Let's go! ${icon('arrowright', 15)}</button>
      <span class="note">about ${d.minutes} minutes · master it with 3 in a row</span>
    </div>
  </div>`;
  const g = l2GateBtn($('#l2Go'));
  wireFox(`${d.teaser} Today you'll learn ${d.term}! By the end you will be able to: ${d.goals.join('. ')}.`, { onDone: g });
  $('#l2Go').onclick = () => { lpSpeechStop(); l2Advance(); };
}

/* ---------------- 22b · the lesson: is / isn't ---------------- */
function l2IsIsnt() {
  const d = LS2.def, i1 = d.idea1, u = subjUI(d.subject);
  if (d.auto) {
    // auto lessons: the strand's own teach card, Pip-narrated
    l2Bar({ pill: [`THE LESSON · WATCH FIRST`, u.tint, u.color] });
    app.innerHTML = `<div class="reveal lesson-grid">
      ${foxPanel(i1.teachHTML)}
      <div class="teach-panel">
        <p class="eyebrow" style="color:${u.color};text-align:center">Learn · idea 1 of 3</p>
        ${d.teachCards[0].html}
        <div style="text-align:center;margin-top:16px">
          <button class="btn primary big caps-btn" id="l2Go">Let me try one! ${icon('arrowright', 15)}</button>
        </div>
      </div>
    </div>`;
    upgradeSayButtons(app);
    const g = l2GateBtn($('#l2Go'));
    wireFox(i1.teachSay, { onDone: g });
    $('#l2Go').onclick = () => { lpSpeechStop(); l2Advance(); };
    return;
  }
  l2Bar({ pill: [`THE LESSON · WHAT IT IS — AND WHAT IT ISN'T`, u.tint, u.color] });
  app.innerHTML = `<div class="reveal lesson-grid">
    ${foxPanel(i1.teachHTML)}
    <div class="teach-panel">
      <div class="l2-isisnt">
        <div class="l2-col is">
          <span class="l2-col-tag is">${icon('check', 12)} ${esc(i1.isLabel)}</span>
          ${i1.examples.map(e => `<div class="l2-ex"><div class="l2-ex-main">${e.html}</div><small>${esc(e.why)}</small></div>`).join('')}
        </div>
        <div class="l2-col isnt">
          <span class="l2-col-tag isnt">${icon('x', 12)} ${esc(i1.isntLabel)}</span>
          ${i1.nonExamples.map(e => `<div class="l2-ex"><div class="l2-ex-main">${e.html}</div><small>${esc(e.why)}</small></div>`).join('')}
        </div>
      </div>
      <div class="l2-rule">${icon('search', 16)} <span>${i1.ruleHTML}</span></div>
      <div style="text-align:center;margin-top:16px">
        <button class="btn primary big caps-btn" id="l2Go">Let me try Pip's test! ${icon('arrowright', 15)}</button>
      </div>
    </div>
  </div>`;
  const g = l2GateBtn($('#l2Go'));
  wireFox(`${i1.teachSay} ${i1.ruleSay}`, { onDone: g });
  $('#l2Go').onclick = () => { lpSpeechStop(); l2Advance(); };
}

/* ---------------- 22c · quick check (ungraded) ---------------- */
function l2QuickCheck(useFallback) {
  const d = LS2.def, u = subjUI(d.subject);
  if (d.auto) return l2AutoQuick(!!useFallback);
  const qc = useFallback ? d.idea1.quickCheck.fallback : d.idea1.quickCheck;
  l2Bar({ pill: [`QUICK CHECK · DID IT CLICK? · NOT GRADED`, 'var(--gold-tint)', '#8C5A2B'] });
  app.innerHTML = `<div class="reveal">
    <div class="l2-fox-row" style="margin-bottom:14px">
      <span class="fox-face">${foxSVG(52, 'talk')}</span>
      <div class="fox-card"><p class="fox-say" style="font-size:16px">Now <b>you</b> be the teacher! Use my test.</p></div>
    </div>
    <div class="tryit-panel" style="text-align:center">
      <h2 class="tryit-q" style="justify-content:center">${qc.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>
      <div class="l2-split-chips">${qc.split.split(/\s*\|\s*/).map(p => `<span class="l2-chip">${esc(p)}</span>`).join('<span class="l2-chip-sep">|</span>')}</div>
      <div class="l2-yesno">
        <button class="l2-yn yes" data-a="true">Yes!</button>
        <button class="l2-yn no" data-a="false">No</button>
      </div>
    </div>
    <div id="l2Fb"></div>
  </div>`;
  wireFox(qc.say);
  $('#l2Read').onclick = () => foxSpeak(qc.say);
  $$('.l2-yn').forEach(b => b.onclick = () => {
    const right = (b.dataset.a === 'true') === qc.answer;
    $$('.l2-yn').forEach(x => x.disabled = true);
    if (right) {
      sfx('correct');
      b.classList.add('right-pick');
      const reinforce = qc.answer
        ? `Yes! <b>${esc(qc.word)}</b> — it passed the test! Say it with me: ${esc(qc.split)}!`
        : `Right! <b>${esc(qc.word)}</b> doesn't pass — ${esc(qc.split)}.`;
      $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span>
        <span class="fb-text">${reinforce}</span>
        <button class="btn primary caps-btn" id="l2On" style="flex:none">On we go</button></div>`;
      const g = l2GateBtn($('#l2On'));
      foxSpeak(speakableText(reinforce), { onDone: g });
      $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
    } else {
      sfx('wrong');
      b.classList.add('no');
      // Pip replays the test on this exact word, then offers a fresh one
      const replay = `Let's use the test together on this one: ${esc(qc.split)}. See it now? Let's try a fresh one!`;
      $('#l2Fb').innerHTML = `<div class="try-strip hint pop"><span>${foxSVG(30, 'talk')}</span>
        <span class="fb-text"><b>Good try!</b> ${replay}</span>
        <button class="btn primary caps-btn" id="l2Fresh" style="flex:none">Fresh one!</button></div>`;
      const g = l2GateBtn($('#l2Fresh'));
      foxSpeak(speakableText(replay), { onDone: g });
      $('#l2Fresh').onclick = () => { lpSpeechStop(); useFallback ? l2Advance() : l2QuickCheck(true); };
    }
  });
}

/* auto quick check — one ungraded gen question; wrong = Pip shows it, then a fresh one */
function l2AutoQuick(isSecond) {
  const d = LS2.def;
  l2Bar({ pill: [`QUICK CHECK · DID IT CLICK? · NOT GRADED`, 'var(--gold-tint)', '#8C5A2B'] });
  const q = d.idea1.quickGen();
  app.innerHTML = `<div class="reveal">
    <div class="l2-fox-row" style="margin-bottom:14px">
      <span class="fox-face">${foxSVG(52, 'talk')}</span>
      <div class="fox-card"><p class="fox-say" style="font-size:16px">${isSecond ? 'Fresh one — you be the teacher this time!' : 'Now <b>you</b> be the teacher! Try one — no stars, just checking.'}</p></div>
    </div>
    <div id="l2QBox"></div>
  </div>`;
  l2Question(q, {
    ungraded: true,
    onRight: (q2) => {
      $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span>
        <span class="fb-text"><b>It clicked!</b> ${q2.why}</span>
        <button class="btn primary caps-btn" id="l2On" style="flex:none">On we go</button></div>`;
      const g = l2GateBtn($('#l2On'));
      foxSpeak(speakableText(q2.why), { onDone: g });
      $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
    },
    onMiss2: (q2) => {
      $('#l2Fb').innerHTML = `<div class="try-strip hint pop"><span>${foxSVG(30, 'talk')}</span>
        <span class="fb-text"><b>Good try!</b> It was <b>${esc(q2.answer)}</b> — ${q2.why} ${isSecond ? '' : "Let's try a fresh one!"}</span>
        <button class="btn primary caps-btn" id="l2Fresh" style="flex:none">${isSecond ? 'Keep going' : 'Fresh one!'}</button></div>`;
      const g = l2GateBtn($('#l2Fresh'));
      foxSpeak(`It was ${q2.answer}. ${speakableText(q2.why)}`, { onDone: g });
      $('#l2Fresh').onclick = () => { lpSpeechStop(); isSecond ? l2Advance() : l2AutoQuick(true); };
    },
  });
}

/* ---------------- 22d · worked examples — Pip builds two out loud ---------------- */
function l2Worked() {
  const d = LS2.def, u = subjUI(d.subject);
  l2Bar({ pill: [`EXAMPLES · WATCH PIP BUILD`, 'var(--teal-tint)', 'var(--teal)'] });
  const [e1, e2] = d.idea1.worked;
  app.innerHTML = `<div class="reveal lesson-grid">
    ${foxPanel(e1.say)}
    <div class="teach-panel">
      <div class="l2-worked done" id="l2W1">
        <p class="eyebrow">Example 1</p>
        <div class="l2-worked-main">${e1.html}</div>
        <small class="l2-sayit">${icon('volume', 12)} Say it with Pip: "${esc(e1.sayIt)}"</small>
      </div>
      <div class="l2-worked next" id="l2W2" style="opacity:.45">
        <p class="eyebrow">Example 2 · watch the pieces come together</p>
        <div class="l2-worked-main">${e2.html}</div>
        <small class="l2-sayit">${icon('volume', 12)} Say it with Pip: "${esc(e2.sayIt)}"</small>
      </div>
      <div style="text-align:center;margin-top:16px">
        <button class="btn primary big caps-btn" id="l2Go" disabled>Now I want to try! ${icon('arrowright', 15)}</button>
      </div>
    </div>
  </div>`;
  // Pip narrates example 1; when he finishes (or the fail-open watchdog fires),
  // example 2 lights up and he narrates it. The advance button stays gated
  // ("Pip is talking…") until the SECOND example's narration completes.
  const release = l2GateBtn($('#l2Go'));
  let did2 = false;
  const step2 = () => {
    if (did2) return; did2 = true; // tap + onDone can both call this — narrate ex2 once
    const w2 = $('#l2W2'); if (!w2) return;
    w2.style.opacity = 1; w2.classList.add('pop');
    const say2 = $('.fox-say'); if (say2) say2.innerHTML = e2.say;
    foxSpeak(speakableText(e2.say) + ' Say it with me: ' + e2.sayIt, { onDone: release });
  };
  wireFox(speakableText(e1.say) + ' Say it with me: ' + e1.sayIt, { onDone: () => { if ($('#l2W2')) step2(); } });
  // tapping example 2 reveals it early; the gate still waits for its narration
  $('#l2Go').onclick = () => { lpSpeechStop(); l2Advance(); };
  $('#l2W2').onclick = () => { step2(); };
}

/* ---------------- 22e · first try with Pip (training wheels, ungraded) ---------------- */
function l2FirstTry() {
  const d = LS2.def, ft = d.idea1.firstTry, u = subjUI(d.subject);
  l2Bar({ pill: [`YOUR FIRST TRY · PIP HELPS · NOT GRADED`, '#FBE7DD', 'var(--terra)'] });
  const glowIdx = ft.choices.indexOf(ft.answer);
  app.innerHTML = `<div class="reveal">
    <div class="l2-fox-row" style="margin-bottom:14px">
      <span class="fox-face">${foxSVG(52, 'talk')}</span>
      <div class="fox-card"><p class="fox-say" style="font-size:16px">Your turn — I'll help! ${esc(ft.say)}</p></div>
    </div>
    <div class="tryit-panel" style="text-align:center">
      <h2 class="tryit-q" style="justify-content:center">${ft.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>
      ${ft.body ? `<div class="qbody">${ft.body}</div>` : ''}
      ${ft.firstPart ? `<div class="l2-build-row"><span class="l2-tile teal big-tile">${esc(ft.firstPart)}</span><span class="l2-plus">+</span><span class="l2-slot" id="l2Slot">pick one!</span></div>` : ''}
      <p class="sent-note">${esc(ft.support)}</p>
      <div class="l2-choice-grid two">
        ${ft.choices.map((c, i) => `<button class="l2-choice ${i === glowIdx ? 'glow' : ''}" data-c="${escAttr(c)}">${esc(c)}</button>`).join('')}
      </div>
      <p class="sent-note">${icon('bulb', 13)} Only 2 choices, and the likely answer glows — training wheels on.</p>
    </div>
    <div id="l2Fb"></div>
  </div>`;
  wireFox(ft.say);
  $('#l2Read').onclick = () => foxSpeak(ft.say);
  $$('.l2-choice').forEach(b => b.onclick = () => {
    if (b.dataset.c === ft.answer) {
      sfx('correct');
      b.classList.add('right-pick');
      $$('.l2-choice').forEach(x => x.disabled = true);
      if ($('#l2Slot')) { $('#l2Slot').textContent = ft.answer; $('#l2Slot').classList.add('filled'); }
      $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span>
        <span class="fb-text"><b>You did it — with your own hands!</b> Training wheels are coming off now.</span>
        <button class="btn primary caps-btn" id="l2On" style="flex:none">Keep going ${icon('arrowright', 14)}</button></div>`;
      const g = l2GateBtn($('#l2On'));
      foxSpeak(`${l2Line('transition')} Training wheels are coming off now.`, { onDone: g });
      $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
    } else {
      sfx('wrong');
      b.classList.add('no'); b.disabled = true;
      foxSpeak(`Hmm — try the glowing one. ${ft.support}`);
    }
  });
}

/* ---------------- 22f · warm-up — 1 labeled recall question ---------------- */
function l2Warmup() {
  const d = LS2.def, u = subjUI(d.subject);
  l2Bar({ rail: true });
  const q = d.warmup.gen();
  app.innerHTML = `<div class="reveal">
    <div class="l2-fox-row" style="margin-bottom:14px">
      <span class="fox-face">${foxSVG(52, 'talk')}</span>
      <div class="fox-card"><p class="fox-say" style="font-size:16px">New seed planted! Quick — let's water yesterday's seeds too.</p></div>
    </div>
    <div style="text-align:center;margin-bottom:10px">
      <span class="l2-review-chip">${icon('clock', 12)} Remember this? · from Lesson ${d.warmup.fromN} · ${esc(d.warmup.fromTitle)}</span>
    </div>
    <div id="l2QBox"></div>
  </div>`;
  const bridgeOn = (text) => {
    $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span><span class="fb-text">${text}</span>
      <button class="btn primary caps-btn" id="l2On" style="flex:none">Today's skill! ${icon('arrowright', 14)}</button></div>`;
    const g = l2GateBtn($('#l2On'));
    foxSpeak(speakableText(text), { onDone: g });
    $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
  };
  l2Question(q, {
    ungraded: true,
    onRight: (q2, misses) => bridgeOn(`${misses ? 'You found it!' : 'Still got it!'} ${q2.why} Now — back to today's brand-new skill!`),
    // right or wrong, Pip bridges back to today's skill (review never blocks)
    onMiss2: (q2) => bridgeOn(`It was <b>${esc(q2.answer)}</b> — ${q2.why} We'll water that seed again soon. Now — today's brand-new skill!`),
  });
}

/* ---------------- 22g · teach card (ideas 2–3) ---------------- */
function l2Teach(idea) {
  const d = LS2.def, id = idea === 2 ? d.idea2 : d.idea3, u = subjUI(d.subject);
  l2Bar({ rail: true });
  app.innerHTML = `<div class="reveal lesson-grid">
    ${foxPanel(id.teachSay)}
    <div class="teach-panel">
      <p class="eyebrow" style="color:${u.color};text-align:center">Learn · idea ${idea} of 3 — ${esc(id.name)}</p>
      ${id.teachHTML}
      ${id.ruleHTML ? `<p class="l2-rule-line">${id.ruleHTML}</p>` : ''}
      ${id.sayIt ? `<div class="l2-sayit-band">${icon('volume', 13)} Say it with Pip: "${esc(id.sayIt)}"</div>` : ''}
      <div style="text-align:center;margin-top:14px">
        <button class="btn primary big caps-btn" id="l2Go">Got it! ${icon('arrowright', 15)}</button>
      </div>
    </div>
  </div>`;
  upgradeSayButtons(app);
  const g = l2GateBtn($('#l2Go'));
  wireFox(id.sayIt ? `${id.teachSay} ${id.ruleSay} Say it with me: ${id.sayIt}` : id.teachSay, { onDone: g });
  $('#l2Go').onclick = () => { lpSpeechStop(); l2Advance(); };
}

/* ---------------- 22h · together — Pip starts, kid finishes (ungraded) ---------------- */
function l2Together(idea, n) {
  const d = LS2.def, tg = (idea === 2 ? d.idea2 : d.idea3).together[n], u = subjUI(d.subject);
  l2Bar({ pill: [`TOGETHER · PIP STARTS, YOU FINISH`, '#FBE7DD', 'var(--terra)'] });
  const glowIdx = tg.choices.indexOf(tg.answer);
  app.innerHTML = `<div class="reveal">
    <div class="l2-fox-row" style="margin-bottom:14px">
      <span class="fox-face">${foxSVG(52, 'talk')}</span>
      <div class="fox-card"><p class="fox-say" style="font-size:16px">${tg.pipSay}</p></div>
    </div>
    <div class="tryit-panel" style="text-align:center">
      ${tg.firstPart ? `<div class="l2-build-row">
          <span class="l2-tile sky big-tile">${esc(tg.firstPart)}<small class="l2-pip-tag">PIP'S PART ${icon('check', 10)}</small></span>
          <span class="l2-plus">+</span><span class="l2-slot" id="l2Slot">your turn!</span>
          ${tg.whole ? `<span class="l2-plus">=</span><span class="l2-tile ghost">${tg.pic || ''} ${esc(tg.whole)}</span>` : ''}
        </div>` : `<h2 class="tryit-q" style="justify-content:center">${tg.prompt}</h2>${tg.body ? `<div class="qbody">${tg.body}</div>` : ''}`}
      <div class="l2-choice-grid">${tg.choices.map((c, i) => `<button class="l2-choice ${i === glowIdx ? 'glow soft' : ''}" data-c="${escAttr(c)}">${esc(c)}</button>`).join('')}</div>
      <p class="sent-note">${icon('bulb', 13)} Pip's hint: ${esc(tg.hint)}</p>
    </div>
    <div id="l2Fb"></div>
  </div>`;
  wireFox(tg.pipSay);
  $$('.l2-choice').forEach(b => b.onclick = () => {
    if (b.dataset.c === tg.answer) {
      sfx('correct');
      b.classList.add('right-pick');
      $$('.l2-choice').forEach(x => x.disabled = true);
      if ($('#l2Slot')) { $('#l2Slot').textContent = tg.answer; $('#l2Slot').classList.add('filled'); }
      $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span><span class="fb-text"><b>We built it together!</b> ${tg.why}</span>
        <button class="btn primary caps-btn" id="l2On" style="flex:none">Now all by myself! ${icon('arrowright', 14)}</button></div>`;
      const g = l2GateBtn($('#l2On'));
      foxSpeak(`${l2Line('transition')} Now try one all by yourself.`, { onDone: g });
      $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
    } else {
      sfx('wrong');
      b.classList.add('no'); b.disabled = true;
      foxSpeak(tg.hint);
    }
  });
}

/* ============================================================
   QUESTION RENDERERS — shared by you-try + mastery.
   Rotation rule: never the same input type twice in a row.
   Option C: a kind missed twice across the lesson is avoided
   (stepped down) until the kid wins one; then it can return.
   ============================================================ */
function l2PickKind(q) {
  let kinds = (q.kinds || ['tap_word']).filter(k => L2_KIND_ORDER.includes(k) || k === 'type_in');
  if (!kinds.length) kinds = ['tap_word'];
  let pool = kinds.filter(k => k !== LS2.lastKind);
  if (!pool.length) pool = kinds;
  if (LS2.st.avoidKind) {
    const stepped = pool.filter(k => L2_KIND_ORDER.indexOf(k) < L2_KIND_ORDER.indexOf(LS2.st.avoidKind));
    if (stepped.length) pool = stepped;
    else if (pool.length > 1) pool = pool.filter(k => k !== LS2.st.avoidKind);
  }
  // prefer the declared order (authors put the intended kind first)
  const chosen = kinds.find(k => pool.includes(k)) || pool[0];
  LS2.lastKind = chosen;
  return chosen;
}

// render one question into #l2QBox; opts: {starred, mastery, onRight, onMiss2}
function l2Question(q, opts) {
  const kind = opts.kind || l2PickKind(q);
  q.kindUsed = kind;
  LS2.q = q;
  LS2.qStart = Date.now(); // rush-detection clock (reset when listen_pick audio unlocks)
  const listen = kind === 'listen_pick';
  const sayFull = q.sayFirst ? `${q.say} ${q.sayFirst}` : q.say;
  let inner = '';
  if (kind === 'say_it') {
    inner = `<h2 class="tryit-q" style="justify-content:center">${q.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>
      <div class="l2-say-target">${esc(q.answer)}</div>
      ${SR_CTOR ? `<button class="btn primary big" id="l2Mic">${icon('mic', 16)} I'll say it — listen!</button>
        <p class="sent-note" id="l2MicNote">Tap, then say it out loud.</p>`
        : `<p class="sent-note">Say it out loud — big and proud!</p><button class="btn primary big" id="l2Said">I said it!</button>`}`;
  } else if (kind === 'drag_drop' && q.parts) {
    inner = `<h2 class="tryit-q" style="justify-content:center">${listen ? '' : q.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>
      <div class="l2-build-row">
        <span class="l2-tile teal big-tile">${esc(q.parts[0])}</span><span class="l2-plus">+</span>
        <span class="l2-slot drop" id="l2Slot">drop here</span>
        <span class="l2-plus">=</span><span class="l2-tile ghost">${q.pic || ''} ${esc(q.whole)}</span>
      </div>
      <div class="l2-tiles" id="l2Tiles">${q.choices.map(c => `<button class="l2-word-tile" draggable="true" data-c="${escAttr(c.t)}">${esc(c.t)}</button>`).join('')}</div>
      <p class="sent-note">Drag a word into the box — or tap it!</p>`;
  } else if (kind === 'word_tiles' && q.parts) {
    inner = `<h2 class="tryit-q" style="justify-content:center">${q.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>
      <div class="l2-build-row"><span class="l2-tile teal big-tile">${esc(q.parts[0])}</span><span class="l2-plus">+</span><span class="l2-slot" id="l2Slot">___</span></div>
      <div class="l2-tiles" id="l2Tiles">${q.choices.map(c => `<button class="l2-word-tile" data-c="${escAttr(c.t)}">${esc(c.t)}</button>`).join('')}</div>`;
  } else if (kind === 'type_in') {
    inner = `<h2 class="tryit-q" style="justify-content:center">${q.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>
      ${q.body ? `<div class="qbody">${q.body}</div>` : ''}
      <div class="answer-row" style="justify-content:center;margin-top:14px">
        <input class="num-input" id="l2In" ${q.numeric ? 'inputmode="numeric"' : ''} autocomplete="off" autocapitalize="none" autocorrect="off">
        <button class="btn primary big" id="l2Check">Check</button>
      </div>`;
  } else {
    // tap_word / tap_picture / listen_pick — choice grid (2×2 max)
    const cells = q.choices.slice(0, 4).map(c => `<button class="l2-choice ${c.pic ? 'with-pic' : ''}" data-c="${escAttr(c.t)}">${c.pic ? `<span class="l2-cpic">${c.pic}</span>` : ''}${esc(c.t)}</button>`).join('');
    const bodyHTML = q.body ? `<div class="qbody">${q.body}</div>` : '';
    inner = listen
      ? `<div class="l2-listen-first"><button class="btn sky big" id="l2Read">${icon('volume', 18)} Listen…</button><p class="sent-note">Ears first — the question is hiding!</p></div><div class="l2-choice-grid">${cells}</div>`
      : `<h2 class="tryit-q" style="justify-content:center">${q.prompt} <button class="icon-btn l2-hear" id="l2Read">${icon('volume', 15)}</button></h2>${bodyHTML}<div class="l2-choice-grid">${cells}</div>`;
  }
  $('#l2QBox').innerHTML = `<div class="tryit-panel reveal l2-answers-locked" style="text-align:center">${inner}</div><div id="l2Fb"></div>`;
  upgradeSayButtons($('#l2QBox'));
  // Answer lockout (invisible — pointer-events only, no dim): choices are inert
  // for the first 700ms after render (stops random-tap rushing), and — for
  // listen_pick — until the prompt audio finishes. Fail-open: a word-count timer
  // always unlocks, so a missing/broken voice never leaves a kid unable to answer.
  const panel = $('#l2QBox .tryit-panel');
  let base700 = false;
  let audioGate = !listen; // non-listen kinds have no audio gate
  const tryUnlock = () => { if (base700 && audioGate && panel) panel.classList.remove('l2-answers-locked'); };
  setTimeout(() => { base700 = true; tryUnlock(); }, 700);
  const sayIt = () => speak(speakableText(sayFull), 'en');
  const rb = $('#l2Read'); if (rb) rb.onclick = sayIt;
  const u0 = sayIt();
  if (listen) {
    const pw = speakableText(sayFull).split(/\s+/).filter(Boolean).length;
    let opened = false, spoke = false;
    const openAudio = () => {
      if (opened) return; opened = true;
      audioGate = true;
      LS2.qStart = Date.now(); // start the rush clock when choices actually unlock
      tryUnlock();
    };
    if (u0) { u0.onstart = () => { spoke = true; }; u0.onend = openAudio; u0.onerror = openAudio; }
    setTimeout(() => { if (!spoke) openAudio(); }, 2200); // no-voices fail-open only
    setTimeout(openAudio, Math.max(3000, pw * 550 + 1200)); // backstop if onend never fires
  }

  // Rush intervention: after 3 fast graded misses in a row, Pip re-reads the
  // question and holds the choices until he's done. Gentle — no red, no penalty,
  // never blocked; fail-open so audio trouble can't lock the kid out.
  const rushSlowDown = () => {
    if (panel) panel.classList.add('l2-answers-locked');
    const fb = $('#l2Fb');
    if (fb) fb.innerHTML = `<div class="try-strip hint pop"><span>${foxSVG(30, 'talk')}</span><span class="fb-text"><b>Whoa, speedy!</b> Let's slow down and think together. Listen again…</span></div>`;
    const line = "Whoa, speedy! Let's slow down and think together. " + speakableText(sayFull);
    const rw = line.split(/\s+/).filter(Boolean).length;
    let done = false, spoke = false;
    const release = () => {
      if (done) return; done = true;
      if (panel) panel.classList.remove('l2-answers-locked');
      LS2.qStart = Date.now(); // retry clock starts when choices unlock again
    };
    const u = speak(line, 'en');
    if (u) { u.onstart = () => { spoke = true; }; u.onend = release; u.onerror = release; }
    setTimeout(() => { if (!spoke) release(); }, 2200); // no-voices fail-open only
    setTimeout(release, Math.max(3000, rw * 550 + 1200)); // backstop if onend never fires
  };

  const misses = { n: 0 };
  const right = (btn) => {
    sfx('correct');
    LS2.rushStreak = 0; // any correct answer clears the rush streak
    if (btn) btn.classList.add('right-pick');
    $$('#l2QBox button').forEach(b => b.disabled = true);
    if ($('#l2Slot') && (kind === 'drag_drop' || kind === 'word_tiles')) { $('#l2Slot').textContent = q.answer; $('#l2Slot').classList.add('filled'); }
    // a win releases the Option C step-down (climb back up)
    if (LS2.st.avoidKind) { LS2.st.avoidKind = null; LS2.st.missKind[kind] = 0; }
    opts.onRight(q, misses.n);
  };
  const wrong = (btn) => {
    misses.n++;
    sfx('wrong');
    if (btn) { btn.classList.add('no'); btn.disabled = true; }
    LS2.st.missQ[q.key] = (LS2.st.missQ[q.key] || 0) + 1;
    LS2.st.missKind[kind] = (LS2.st.missKind[kind] || 0) + 1;
    if (LS2.st.missKind[kind] >= 2 && L2_KIND_ORDER.indexOf(kind) > 0) LS2.st.avoidKind = kind;
    save();
    // Rush detection (session-only, not persisted): 3 graded wrongs in a row,
    // each answered in under 2.5s → Pip gently slows the kid down and re-reads.
    if (opts.starred || opts.mastery) {
      const fast = (Date.now() - (LS2.qStart || 0)) < 2500;
      LS2.rushStreak = fast ? (LS2.rushStreak || 0) + 1 : 0;
      if (fast && LS2.rushStreak >= 3) { LS2.rushStreak = 0; return rushSlowDown(); }
    }
    if (misses.n === 1 && !opts.mastery) {
      // miss 1: Pip's hint + retry (gentle, nothing blocked). A question with no
      // hint of its own borrows a rotating encouragement, so a kid who misses a
      // few times in one lesson never hears the same sentence twice running.
      const enc = q.hint || l2Line('wrong');
      $('#l2Fb').innerHTML = `<div class="try-strip hint pop"><span>${foxSVG(30, 'talk')}</span><span class="fb-text"><b>Let's look together.</b> ${esc(enc)}</span></div>`;
      foxSpeak(enc);
    } else {
      opts.onMiss2(q);
    }
  };

  if (kind === 'type_in') {
    const matches = (v) => q.numeric
      ? Number(String(v).replace(/[,\s]/g, '')) === Number(q.answer)
      : q.exact ? String(v).trim() === String(q.answer).trim()
        : String(v).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
    const check = () => {
      const v = $('#l2In').value;
      if (v.trim() === '') return;
      if (matches(v)) right(null);
      else { wrong(null); const inp = $('#l2In'); if (inp) { inp.select(); } }
    };
    $('#l2Check').onclick = check;
    $('#l2In').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    $('#l2In').focus();
    return;
  }
  if (kind === 'say_it') {
    const done = () => right(null);
    if (SR_CTOR) {
      $('#l2Mic').onclick = () => {
        const note = $('#l2MicNote');
        try {
          const rec = new SR_CTOR();
          rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 3;
          note.textContent = 'Listening… say it now!';
          rec.onresult = (e) => {
            const heard = [...e.results[0]].map(r => r.transcript.toLowerCase()).join(' ');
            const target = q.answer.toLowerCase().replace(/[^a-z' ]/g, '');
            if (heard.includes(target) || target.split(' ').every(w => heard.includes(w))) { note.textContent = 'I heard it!'; done(); }
            else { note.textContent = `I heard "${heard}" — one more time, nice and clear!`; sfx('wrong'); }
          };
          rec.onerror = () => { note.textContent = 'My ears glitched — you said it, I believe you!'; done(); };
          rec.start();
        } catch (e) { done(); }
      };
    } else { $('#l2Said').onclick = () => done(); }
    return;
  }
  if (kind === 'drag_drop' && q.parts) {
    const slot = $('#l2Slot');
    const place = (t, tileBtn) => { t === q.answer ? right(tileBtn) : wrong(tileBtn); };
    $$('.l2-word-tile').forEach(t => {
      t.onclick = () => place(t.dataset.c, t);
      t.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', t.dataset.c); t.classList.add('dragging'); });
      t.addEventListener('dragend', () => t.classList.remove('dragging'));
    });
    slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('over'));
    slot.addEventListener('drop', (e) => {
      e.preventDefault(); slot.classList.remove('over');
      const t = e.dataTransfer.getData('text/plain');
      const tile = $$('.l2-word-tile').find(x => x.dataset.c === t);
      place(t, tile);
    });
    return;
  }
  $$('#l2QBox .l2-choice, #l2QBox .l2-word-tile').forEach(b => b.onclick = () => {
    b.dataset.c === q.answer ? right(b) : wrong(b);
  });
}

/* ---------------- Option A · Pip re-teaches with the simplest example ---------------- */
function l2ReteachA(q, thenRetry) {
  const d = LS2.def;
  lpSpeechStop();
  let html = d.reteachEasy.html, say = d.reteachEasy.say;
  if (d.reteachEasy.auto) {
    // auto lessons: Pip solves an easy (level 1) one fresh, out loud
    const sk = SKILL_MAP[d.skill];
    const g = sk.gen(1);
    html = `<div class="l2-solved"><p class="l2-solved-q">${g.prompt}</p>${g.body ? `<div class="qbody">${g.body}</div>` : ''}
      <div class="l2-solved-a">${icon('arrowright', 14)} <b>${esc(String(g.answer))}</b></div>
      <p class="sent-note">${g.explain || ''}</p></div>`;
    say = `Watch me do an easy one. ${speakableText(g.prompt)} … The answer is ${g.answer}. ${speakableText(g.explain || '')} Now try yours again!`;
  }
  $('#l2QBox').innerHTML = `<div class="tryit-panel reveal" style="text-align:center">
    <div class="l2-fox-row" style="justify-content:center;margin-bottom:10px">
      <span class="fox-face">${foxSVG(56, 'talk')}</span>
      <div class="fox-card"><p class="fox-say" style="font-size:16px">${esc(d.reteachEasy.line)}</p></div>
    </div>
    ${html}
    <button class="btn primary big caps-btn" style="margin-top:14px" id="l2Retry">Try mine again ${icon('arrowright', 14)}</button>
  </div><div id="l2Fb"></div>`;
  upgradeSayButtons($('#l2QBox'));
  const g = l2GateBtn($('#l2Retry'));
  foxSpeak(say, { onDone: g });
  $('#l2Retry').onclick = () => { lpSpeechStop(); thenRetry(); };
}

/* ---------------- 22i · you try — starred solo questions ---------------- */
function l2Tryit(idea, n) {
  const d = LS2.def;
  const total = LS2.flow.filter(s => s.t === 'tryit').length;
  const soFar = LS2.flow.slice(0, LS2.st.step).filter(s => s.t === 'tryit').length;
  l2Bar({ pill: [`YOU TRY · ${soFar + 1} OF ${total} · NO RUSH`, 'var(--gold-tint)', '#8C5A2B'] });
  const usedSet = new Set(LS2.st.used);
  const q = (idea === 1 ? d.idea1 : idea === 2 ? d.idea2 : d.idea3).tryits[n](usedSet);
  LS2.st.used.push(q.key); save();
  app.innerHTML = `<div class="reveal"><div id="l2QBox"></div></div>`;
  l2Question(q, {
    starred: true,
    onRight: (q2, misses) => {
      LS2.st.stars++; sfx('star');
      $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span>
        <span class="fb-text"><b>${misses ? 'You found it!' : l2Line('correct')}</b> ${q2.why} <span class="pill gold" style="margin-left:6px">${icon('star', 12)} +1</span></span>
        <button class="btn primary caps-btn" id="l2On" style="flex:none">Keep going ${icon('arrowright', 14)}</button></div>`;
      const g = l2GateBtn($('#l2On'));
      foxSpeak(speakableText(q2.why), { onDone: g });
      $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
    },
    onMiss2: (q2) => l2ReteachA(q2, () => {
      // re-ask the SAME question (same content), same kind — no star cost
      l2Question(q2, {
        kind: q2.kindUsed, starred: true,
        onRight: (q3, misses) => {
          LS2.st.stars++; sfx('star');
          $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span>
            <span class="fb-text"><b>There it is!</b> ${q3.why} <span class="pill gold" style="margin-left:6px">${icon('star', 12)} +1</span></span>
            <button class="btn primary caps-btn" id="l2On" style="flex:none">Keep going ${icon('arrowright', 14)}</button></div>`;
          const g = l2GateBtn($('#l2On'));
          foxSpeak(speakableText(q3.why), { onDone: g });
          $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
        },
        onMiss2: () => {
          // still stuck: show it kindly and move on (never blocked)
          $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'talk')}</span>
            <span class="fb-text">It was <b>${esc(q2.answer)}</b> — ${q2.why} We'll see one like it again soon.</span>
            <button class="btn primary caps-btn" id="l2On" style="flex:none">Keep going ${icon('arrowright', 14)}</button></div>`;
          const g = l2GateBtn($('#l2On'));
          foxSpeak(`It was ${q2.answer}. We'll see one like it again soon.`, { onDone: g });
          $('#l2On').onclick = () => { lpSpeechStop(); l2Advance(); };
        },
      });
    }),
  });
}

/* ---------------- 22k · mastery check — 3 in a row on fresh questions ---------------- */
function l2MasteryMeter() {
  const s = LS2.st.streak;
  const flowers = [0, 1, 2].map(i => `<span class="l2-meter-f ${i < s ? 'on pop' : ''}">${i < s ? l2DaisySVG(26, true) : `<span class="l2-seed"></span>`}</span>`).join('');
  const label = s === 0 ? `fresh questions until 3 in a row!` : s === 1 ? `1 down — two more!` : s === 2 ? `2 in a row — one more!` : `3 in a row!`;
  return `<div class="l2-meter">${flowers}<span class="l2-meter-bar"></span><b>${label}</b></div>`;
}
function l2Mastery() {
  const d = LS2.def;
  l2Bar({ pill: [`SHOW WHAT YOU KNOW`, 'var(--gold-tint)', '#8C5A2B'] });
  if (!LS2.mastQueue || !LS2.mastQueue.length) LS2.mastQueue = l2Shuffle(d.mastery);
  const usedSet = new Set(LS2.st.used);
  // fresh question: skip makers whose sampled key was already used this session
  let q = null;
  for (let i = 0; i < LS2.mastQueue.length; i++) {
    const cand = LS2.mastQueue[i](usedSet);
    if (!usedSet.has(cand.key)) { q = cand; LS2.mastQueue.splice(i, 1); break; }
  }
  if (!q) q = LS2.mastQueue.length ? LS2.mastQueue.shift()(usedSet) : l2Pick(d.mastery)(usedSet);
  LS2.st.used.push(q.key);
  LS2.st.mq++; save();

  app.innerHTML = `<div class="reveal">
    ${l2MasteryMeter()}
    <div id="l2QBox"></div>
    <p class="sent-note" style="text-align:center;margin-top:10px">A miss never ends the check — Pip explains, the flowers rest, and fresh questions keep coming.</p>
  </div>`;
  l2Question(q, {
    mastery: true,
    onRight: (q2) => {
      LS2.st.streak++; LS2.st.stars++; sfx('star'); save();
      if (LS2.st.streak >= 3) {
        $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span><span class="fb-text"><b>${l2Line('streak')}</b></span></div>`;
        setTimeout(() => { if (LS2) { LS2.st.status = 'mastered'; l2Advance(); } }, 1200);
      } else {
        $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'cheer')}</span><span class="fb-text"><b>${l2Line('correct')}</b> ${q2.why}</span>
          <button class="btn primary caps-btn" id="l2On" style="flex:none">Next one ${icon('arrowright', 14)}</button></div>`;
        const g = l2GateBtn($('#l2On'));
        foxSpeak(speakableText(q2.why), { onDone: g });
        $('#l2On').onclick = () => { lpSpeechStop(); l2Mastery(); };
      }
    },
    onMiss2: (q2) => {
      // Option B — reveal & replant: explain, streak resets, fresh variant returns later
      LS2.st.streak = 0; save();
      $('#l2Fb').innerHTML = `<div class="try-strip pop"><span>${foxSVG(30, 'talk')}</span>
        <span class="fb-text">It was <b>${esc(q2.answer)}</b> — ${q2.why} <span class="l2-replant">${icon('sprout', 12)} replanted — we'll see it again soon</span></span>
        <button class="btn primary caps-btn" id="l2On" style="flex:none">Next one ${icon('arrowright', 14)}</button></div>`;
      const g = l2GateBtn($('#l2On'));
      foxSpeak(`It was ${q2.answer}. ${speakableText(q2.why)} We'll see one like it again soon.`, { onDone: g });
      // replant a fresh variant of the same maker 2 questions later
      const maker = d.mastery.find(mk => { try { return mk(new Set()).key.split('_').slice(0, 3).join('_') === q2.key.split('_').slice(0, 3).join('_'); } catch (e) { return false; } });
      if (maker) LS2.mastQueue.splice(Math.min(2, LS2.mastQueue.length), 0, maker);
      $('#l2On').onclick = () => {
        lpSpeechStop();
        if (LS2.st.mq >= 12) { LS2.st.status = 'learned'; l2Advance(); } // soft cap → warm "learned" ending
        else l2Mastery();
      };
    },
  });
}

/* ---------------- 22l · celebrate — the opener's promise, checked off ---------------- */
function l2Celebrate() {
  lpSpeechStop();
  const d = LS2.def;
  const mastered = LS2.st.status === 'mastered';
  const streakLine = mastered ? l2Line('streak') : ''; // one variant — shown AND spoken, so they agree
  if (!mastered && LS2.st.status !== 'learned') LS2.st.status = 'learned';
  const L = kidLearn();
  // record + plant (mastered starts one stage ahead)
  const existing = L.learnedLessons.find(x => x.lessonId === LS2.ls.id);
  const plantTo = mastered ? 50 : 25;
  const st = kidStats();
  const cur = st[d.skill] || { s: 0, a: 0, c: 0 };
  if (cur.s < plantTo) { cur.s = plantTo; st[d.skill] = cur; }
  if (!existing) {
    L.learnedLessons.push({ lessonId: LS2.ls.id, strand: LS2.strandId, subject: d.subject, skill: d.skill, date: dstr(), stars: LS2.st.stars, status: LS2.st.status, mins: Math.max(1, Math.round((Date.now() - LS2.t0) / 60000)) });
  } else { existing.status = LS2.st.status; existing.stars = Math.max(existing.stars || 0, LS2.st.stars); }
  delete (L.paths[LS2.strandId] || {}).current;
  if (mastered) LS2.st.step = LS2.flow.length; // review lands on celebrate
  else LS2.st.step = LS2.flow.findIndex(s => s.t === 'mastery'); // "learned": mastery resumes next session
  LS2.st.streak = 0; LS2.st.mq = 0;
  save();

  const { lessons, currentIdx } = learnPathState(LS2.strandId);
  const next = currentIdx < lessons.length ? lessons[currentIdx] : null;
  sfx('cheer'); burst(80, true);
  l2Bar();
  app.innerHTML = `<div class="reveal lp-center">
    <div class="complete-card pop">
      <div class="l2-daisy-row">${l2DaisySVG(40, mastered)}${l2DaisySVG(46, mastered)}${l2DaisySVG(40, mastered)}</div>
      <h1 style="font-size:32px;font-weight:800;margin-top:8px">You ${mastered ? '<span style="color:var(--teal)">mastered</span>' : '<span style="color:var(--green)">learned</span>'} ${esc(d.term)}!</h1>
      <div style="display:flex;gap:10px;justify-content:center;margin:12px 0">
        <span class="pill gold">${icon('star', 14)} ${LS2.st.stars} stars</span>
        ${mastered ? `<span class="pill" style="color:var(--green)">${icon('check', 14)} 3 in a row</span>` : `<span class="pill" style="color:var(--teal)">${icon('sprout', 14)} mastery check resumes next time</span>`}
      </div>
      <div class="l2-goals card" style="margin:0 auto;text-align:left">
        <p class="eyebrow">Now you can…</p>
        ${d.goals.map(g => `<div class="l2-goal-row"><span class="l2-goal-n done">${icon('check', 13)}</span><span>${esc(g)}</span></div>`).join('')}
      </div>
      <div class="plant-band" style="margin-top:14px">
        ${plantSVG(mastered ? 50 : 25, 34)}
        <span><b>Planted in Practice at ${mastered ? 'growing' : 'sprouting'}</b>
        <p class="note">${mastered ? 'A mastered lesson starts one stage ahead.' : 'Finish the mastery check next time to jump a stage!'}</p></span>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap">
        ${next ? `<button class="btn primary big caps-btn" id="l2Next">Next lesson: ${esc(next.name)}</button>` : ''}
        <button class="btn big" id="l2Path">Back to my path</button>
      </div>
    </div>
    <div class="fox-note-big"><span>${typeof foxFullSVG === 'function' ? foxFullSVG(96, 'cheer') : foxSVG(42, 'cheer')}</span><span class="say">${mastered ? esc(streakLine) : 'Look how much you learned today!'}</span></div>
  </div>`;
  // Celebration gets Pip's brighter cheer prosody (app.js loads last, so guard it).
  const cheer = (typeof VOICE_PROSODY !== 'undefined' && VOICE_PROSODY.pipCheer) ? { ...VOICE_PROSODY.pipCheer } : {};
  foxSpeak(mastered ? `You mastered ${d.term}! ${streakLine}` : `You learned ${d.term} today! Next time we'll finish the mastery check together.`, cheer);
  if (next) $('#l2Next').onclick = () => { lpSpeechStop(); startLesson(next.id, LS2.strandId); };
  $('#l2Path').onclick = () => { lpSpeechStop(); show('learnpath', LS2.strandId); };
}
