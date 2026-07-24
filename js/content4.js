/* ============================================================
   LEARNING GARDEN — content4.js
   The 66 lessons the standards research found missing: phonics
   (vowel teams, r-controlled, diphthongs, syllables, -ed, sight
   words), reading comprehension + fluency, more grammar/vocab,
   math reasoning & graph-building, NGSS science practices +
   engineering, social studies civics/economics/geography/history
   + inquiry, Spanish FLES topics, and digital citizenship.

   Pure data pushed into the shared STRANDS / SKILLS arrays, same
   shape as ela.js / content2.js / content3.js. Loads AFTER
   content3.js, BEFORE sprint.js / coach.js / app.js.
   Every gen() returns {prompt,type,choices,answer,explain}; each
   was machine-validated (answer always in choices, no ambiguous
   distractors, no longest-answer tell) before shipping.
   ============================================================ */

/* ============================================================
   LEARNING GARDEN — ELA slice A
   Phonics (sight words, vowel teams, diphthongs, bossy R,
   syllables, -ed sounds), Grammar (possessives, sentence
   expanding, letter commas), Vocabulary (context clues,
   root words, multiple-meaning words).
   Uses EXISTING strands: phonics, grammar, vocab.
   ============================================================ */

// ---------- shared helpers ----------
const C4EA_take = function (arr, n, exclude) {
  const skip = exclude || [];
  const pool = shuffle(arr.slice());
  const out = [];
  for (let i = 0; i < pool.length && out.length < n; i++) {
    if (skip.indexOf(pool[i]) === -1 && out.indexOf(pool[i]) === -1) out.push(pool[i]);
  }
  return out;
};

// Drop a word back into a sentence, capitalizing it if it starts the sentence.
const C4EA_ins = function (sent, ph, word, open, close) {
  const w = sent.indexOf(ph) === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  return sent.replace(ph, (open || '') + w + (close || ''));
};

const C4EA_sentBox = function (html) {
  return '<div style="font-family:var(--font-display);font-size:25px;font-weight:600;line-height:1.5">' + html + '</div>';
};

// Shared 3-level engine for letter-team spelling skills.
// entry = [word, team, emoji, blank, clue, easyWrongTeams, hardWrongTeams]
const C4EA_teamQ = function (e, lvl, teams, label) {
  const word = e[0], team = e[1], emo = e[2], blank = e[3], clue = e[4];
  const easy = e[5], hard = e[6] || e[5];
  const tag = emo ? ' ' + emo : '';
  if (lvl === 1) {
    const pool = teams.filter(function (t) { return t !== team && word.indexOf(t) === -1; });
    return {
      prompt: 'Which ' + label + ' do you see in <b>' + word + '</b>?' + tag,
      type: 'mc',
      choices: shuffle([team].concat(C4EA_take(pool, 3))),
      answer: team,
      explain: '<b>' + word + '</b> is built with the ' + label + ' <b>' + team + '</b> — ' + clue + '.',
    };
  }
  if (lvl === 3) {
    const answer = word;
    const wrong = hard.map(function (t) { return blank.replace('__', t); });
    return {
      prompt: 'Only ONE of these is a real word. Which one means "' + clue + '"?' + tag,
      type: 'mc',
      choices: shuffle([answer].concat(wrong)),
      answer: answer,
      explain: 'It is spelled <b>' + word + '</b>. This word uses the ' + label + ' <b>' + team + '</b> — the others just look close.',
    };
  }
  return {
    prompt: 'Which ' + label + ' finishes the word?',
    body: C4EA_sentBox(blank + tag + '<div style="font-size:17px;font-weight:700;margin-top:6px">' + clue + '</div>'),
    type: 'mc',
    choices: shuffle([team].concat(easy)),
    answer: team,
    explain: '<b>' + team + '</b> fits, so the word is <b>' + word + '</b>' + tag + '.',
  };
};

// ------------------------------------------------------------
// 1. SIGHT WORDS
// entry = [word, sentence(with ___), misspellings, wrong words, easy?]
// ------------------------------------------------------------
const C4EA_SIGHT = [
  ['said', 'Mom ___ it was time for bed.', ['sed', 'sayd', 'siad'], ['because', 'through', 'only'], 1],
  ['because', 'I wore boots ___ it was raining.', ['becuz', 'becaus', 'becouse'], ['said', 'friend', 'water'], 1],
  ['they', 'The cats are hungry, so ___ meow.', ['thay', 'thae', 'thei'], ['was', 'once', 'which'], 1],
  ['were', 'The kittens ___ sleeping in a basket.', ['wer', 'wure', 'werr'], ['does', 'again', 'people'], 1],
  ['could', 'She ___ ride her bike all by herself.', ['cood', 'culd', 'coud'], ['friend', 'water', 'once'], 1],
  ['been', 'I have ___ to the zoo two times.', ['ben', 'bein', 'beene'], ['laugh', 'which', 'own'], 1],
  ['does', '___ your dog like to swim?', ['duz', 'doez', 'dus'], ['been', 'people', 'right'], 1],
  ['again', 'That song was so good — play it ___!', ['agen', 'agan', 'agian'], ['friend', 'water', 'which'], 1],
  ['friend', 'My best ___ sits next to me at lunch.', ['freind', 'frend', 'frennd'], ['laugh', 'again', 'could'], 1],
  ['people', 'Ten ___ waited in line for the bus.', ['peple', 'peopel', 'pepole'], ['laugh', 'once', 'through'], 1],
  ['laugh', 'The funny joke made me ___ out loud.', ['laf', 'lagh', 'laff'], ['water', 'only', 'been'], 1],
  ['water', 'Please pour me a glass of ___.', ['watter', 'wader', 'wotter'], ['laugh', 'could', 'again'], 1],
  ['once', 'We go to the library ___ a week.', ['wunce', 'onse', 'onct'], ['does', 'been', 'said'], 0],
  ['only', 'There is ___ one cookie left.', ['onlee', 'ony', 'onle'], ['were', 'again', 'does'], 0],
  ['own', 'I finally have my ___ room.', ['oan', 'owne', 'onw'], ['been', 'once', 'which'], 0],
  ['right', 'Turn ___ at the big oak tree.', ['righ', 'rigt', 'ryte'], ['been', 'does', 'people'], 0],
  ['thought', 'I ___ the movie was funny.', ['thot', 'thougt', 'thawt'], ['friend', 'water', 'only'], 0],
  ['through', 'The train went ___ the dark tunnel.', ['throuh', 'thruogh', 'thorugh'], ['laugh', 'people', 'once'], 0],
  ['where', '___ did you put my shoes?', ['wher', 'whare', 'whear'], ['been', 'only', 'own'], 0],
  ['which', '___ shirt do you want to wear?', ['wich', 'whitch', 'whish'], ['laugh', 'been', 'water'], 0],
];

// ------------------------------------------------------------
// 2. VOWEL TEAMS
// ------------------------------------------------------------
const C4EA_VT_TEAMS = ['ai', 'ay', 'ea', 'ee', 'oa', 'ow', 'igh'];
const C4EA_VOWEL_TEAMS = [
  ['rain', 'ai', '🌧️', 'r__n', 'water that falls from the clouds', ['ee', 'oo', 'igh'], ['ay', 'ee', 'ow']],
  ['tail', 'ai', '', 't__l', 'the wagging part on a dog', ['ee', 'oa', 'oy'], ['ay', 'ee', 'oa']],
  ['sail', 'ai', '⛵', 's__l', 'the big cloth that catches wind on a boat', ['ee', 'oo', 'ew'], ['ay', 'ee', 'oa']],
  ['play', 'ay', '🤸', 'pl__', 'what kids do at recess', ['ai', 'ee', 'oa'], ['ai', 'ey', 'ee']],
  ['day', 'ay', '☀️', 'd__', 'the time when the sun is up', ['ee', 'oa', 'igh'], ['ai', 'ey', 'ee']],
  ['seat', 'ea', '🪑', 's__t', 'a place to sit down', ['ai', 'oa', 'ow'], ['ee', 'ai', 'oa']],
  ['leaf', 'ea', '🍃', 'l__f', 'the green part of a plant', ['ai', 'oo', 'ow'], ['ee', 'ai', 'ow']],
  ['tree', 'ee', '🌳', 'tr__', 'it has bark and branches', ['ai', 'oa', 'oo'], ['ea', 'ai', 'oa']],
  ['green', 'ee', '💚', 'gr__n', 'the color of grass', ['oo', 'ew', 'oy'], ['ea', 'ew', 'oo']],
  ['seed', 'ee', '', 's__d', 'a tiny thing that grows into a plant', ['oa', 'ow', 'oo'], ['ea', 'oa', 'ow']],
  ['coat', 'oa', '🧥', 'c__t', 'you wear it when it is cold', ['ai', 'oi', 'ow'], ['ow', 'ea', 'ai']],
  ['soap', 'oa', '🧼', 's__p', 'you wash your hands with it', ['ai', 'oi', 'igh'], ['ow', 'ai', 'oi']],
  ['road', 'oa', '🛣️', 'r__d', 'cars drive on it', ['oi', 'ew', 'igh'], ['ow', 'oi', 'ay']],
  ['snow', 'ow', '❄️', 'sn__', 'cold white flakes in winter', ['ai', 'ee', 'oi'], ['oa', 'ew', 'ou']],
  ['grow', 'ow', '🌱', 'gr__', 'to get bigger', ['ai', 'ee', 'oi'], ['oa', 'ou', 'oy']],
  ['light', 'igh', '💡', 'l__t', 'it helps you see in the dark', ['ai', 'ee', 'oa'], ['ie', 'ai', 'ey']],
  ['night', 'igh', '🌙', 'n__t', 'the time when it is dark outside', ['ai', 'ee', 'oa'], ['ie', 'ai', 'ey']],
];

// ------------------------------------------------------------
// 3. DIPHTHONGS / SLIDING SOUNDS
// ------------------------------------------------------------
const C4EA_DP_TEAMS = ['oo', 'ou', 'ow', 'oi', 'oy', 'ew'];
const C4EA_DIPHTHONGS = [
  ['moon', 'oo', '🌕', 'm__n', 'it glows in the night sky', ['ou', 'oi', 'ew'], ['ew', 'ou', 'oy']],
  ['spoon', 'oo', '🥄', 'sp__n', 'you eat soup with it', ['ou', 'oi', 'ew'], ['ew', 'ou', 'oi']],
  ['book', 'oo', '📕', 'b__k', 'you read it', ['oi', 'oy', 'ew'], ['ew', 'ou', 'oy']],
  ['foot', 'oo', '🦶', 'f__t', 'it goes inside your shoe', ['ou', 'oi', 'ew'], ['ew', 'oi', 'ow']],
  ['broom', 'oo', '🧹', 'br__m', 'you sweep the floor with it', ['ou', 'oi', 'ew'], ['ew', 'ou', 'oy']],
  ['cloud', 'ou', '☁️', 'cl__d', 'it floats in the sky', ['oi', 'oy', 'ew'], ['ow', 'oi', 'ew']],
  ['mouse', 'ou', '🐭', 'm__se', 'a tiny animal with a long thin tail', ['oi', 'oy', 'ew'], ['ow', 'oy', 'ew']],
  ['round', 'ou', '', 'r__nd', 'shaped like a circle', ['oi', 'oy', 'ew'], ['ow', 'oi', 'ew']],
  ['cow', 'ow', '🐄', 'c__', 'a farm animal that says moo', ['oi', 'ew', 'ou'], ['ou', 'oi', 'ew']],
  ['town', 'ow', '🏘️', 't__n', 'a place with houses and shops', ['oi', 'oy', 'ew'], ['ou', 'oi', 'ew']],
  ['brown', 'ow', '🟤', 'br__n', 'the color of dirt and tree bark', ['oi', 'oy', 'ew'], ['ou', 'oi', 'ew']],
  ['owl', 'ow', '🦉', '__l', 'a bird that hoots at night', ['oy', 'ew', 'oo'], ['ou', 'oy', 'ew']],
  ['coin', 'oi', '🪙', 'c__n', 'money made out of metal', ['ew', 'oy', 'ou'], ['oy', 'ou', 'ew']],
  ['soil', 'oi', '', 's__l', 'the dirt that plants grow in', ['ew', 'oy', 'ow'], ['oy', 'ow', 'ew']],
  ['point', 'oi', '👉', 'p__nt', 'to aim your finger at something', ['ew', 'oy', 'oo'], ['oy', 'oo', 'ew']],
  ['boy', 'oy', '👦', 'b__', 'the opposite of a girl', ['oi', 'ew', 'ou'], ['oi', 'ou', 'ew']],
  ['toy', 'oy', '🧸', 't__', 'something you play with', ['oi', 'ew', 'ou'], ['oi', 'ou', 'ew']],
  ['joy', 'oy', '', 'j__', 'a big happy feeling', ['oi', 'ou', 'oo'], ['oi', 'ou', 'oo']],
  ['new', 'ew', '🆕', 'n__', 'the opposite of old', ['oi', 'oy', 'ou'], ['oo', 'oi', 'ou']],
  ['stew', 'ew', '🍲', 'st__', 'a thick soup with meat and veggies', ['oi', 'oy', 'ou'], ['oo', 'oi', 'ou']],
  ['grew', 'ew', '', 'gr__', 'got bigger', ['oi', 'oy', 'ou'], ['oo', 'oi', 'ou']],
];

// ------------------------------------------------------------
// 4. BOSSY R
// ------------------------------------------------------------
const C4EA_RC_TEAMS = ['ar', 'er', 'ir', 'or', 'ur'];
const C4EA_RCONTROL = [
  ['car', 'ar', '🚗', 'c__', 'you drive it down the road', ['er', 'ir', 'or']],
  ['star', 'ar', '⭐', 'st__', 'it twinkles up in the night sky', ['er', 'or', 'ur']],
  ['arm', 'ar', '💪', '__m', 'your hand is at the end of it', ['er', 'ir', 'ur']],
  ['garden', 'ar', '🌷', 'g__den', 'a spot where you grow flowers', ['er', 'ir', 'ur']],
  ['her', 'er', '', 'h__', 'the word you use for a girl instead of him', ['ir', 'ur', 'ar']],
  ['fern', 'er', '🌿', 'f__n', 'a leafy plant with no flowers', ['ir', 'ur', 'ar']],
  ['herd', 'er', '', 'h__d', 'a big group of cows', ['ir', 'ur', 'or']],
  ['teacher', 'er', '👩‍🏫', 'teach__', 'the grown-up who helps your class learn', ['ar', 'ir', 'ur']],
  ['bird', 'ir', '🐦', 'b__d', 'an animal with feathers and wings', ['er', 'ur', 'or']],
  ['girl', 'ir', '👧', 'g__l', 'the opposite of a boy', ['er', 'ar', 'ur']],
  ['first', 'ir', '🥇', 'f__st', 'the one at the very front of a line', ['er', 'ar', 'ur']],
  ['circle', 'ir', '⭕', 'c__cle', 'a shape that is perfectly round', ['er', 'ar', 'ur']],
  ['corn', 'or', '🌽', 'c__n', 'a yellow veggie that grows on a cob', ['ar', 'er', 'ur']],
  ['horse', 'or', '🐴', 'h__se', 'a big animal you can ride', ['ar', 'ir', 'ur']],
  ['fork', 'or', '🍴', 'f__k', 'you poke your food with it', ['ar', 'er', 'ur']],
  ['storm', 'or', '⛈️', 'st__m', 'wind, rain, and thunder together', ['ar', 'er', 'ir']],
  ['turtle', 'ur', '🐢', 't__tle', 'a slow animal with a hard shell', ['ar', 'er', 'ir']],
  ['purple', 'ur', '💜', 'p__ple', 'the color of grape juice', ['ar', 'er', 'ir']],
  ['nurse', 'ur', '', 'n__se', 'the helper who takes care of sick people', ['ar', 'er', 'ir']],
  ['hurt', 'ur', '', 'h__t', 'what a scraped knee feels like', ['er', 'ir', 'or']],
];

// ------------------------------------------------------------
// 5. TWO-SYLLABLE WORDS
// ------------------------------------------------------------
const C4EA_SYL_COUNT = [
  ['dog', 1], ['jump', 1], ['smile', 1], ['bread', 1], ['clock', 1], ['string', 1],
  ['rabbit', 2], ['table', 2], ['tiger', 2], ['napkin', 2], ['basket', 2], ['pencil', 2],
  ['robot', 2], ['magnet', 2], ['sunset', 2], ['garden', 2],
  ['banana', 3], ['computer', 3], ['butterfly', 3], ['elephant', 3], ['umbrella', 3], ['tomato', 3],
];
// [word, split index]
const C4EA_SPLITS = [
  ['rabbit', 3], ['napkin', 3], ['basket', 3], ['pencil', 3], ['magnet', 3], ['sunset', 3],
  ['button', 3], ['kitten', 3], ['mitten', 3], ['cactus', 3], ['picnic', 3], ['muffin', 3],
  ['winter', 3], ['carpet', 3], ['helmet', 3], ['zipper', 3], ['tennis', 3], ['monster', 3],
  ['insect', 2], ['pumpkin', 4], ['sandwich', 4], ['blanket', 4],
];

// ------------------------------------------------------------
// 6. THE THREE SOUNDS OF -ED
// group: 't' = quick /t/, 'd' = soft /d/, 'x' = extra beat
// ------------------------------------------------------------
const C4EA_ED = [
  ['jumped', 'jump', 't'], ['hopped', 'hop', 't'], ['walked', 'walk', 't'], ['wished', 'wish', 't'],
  ['kicked', 'kick', 't'], ['mixed', 'mix', 't'], ['washed', 'wash', 't'], ['helped', 'help', 't'],
  ['played', 'play', 'd'], ['smiled', 'smile', 'd'], ['called', 'call', 'd'], ['cleaned', 'clean', 'd'],
  ['rained', 'rain', 'd'], ['loved', 'love', 'd'], ['opened', 'open', 'd'], ['filled', 'fill', 'd'],
  ['landed', 'land', 'x'], ['wanted', 'want', 'x'], ['planted', 'plant', 'x'], ['needed', 'need', 'x'],
  ['painted', 'paint', 'x'], ['waited', 'wait', 'x'], ['shouted', 'shout', 'x'], ['added', 'add', 'x'],
];
const C4EA_ED_LABEL = {
  t: 'a quick <b>/t/</b> sound',
  d: 'a soft <b>/d/</b> sound',
  x: 'a whole extra beat, like <b>-ed</b>',
};
const C4EA_ED_WHY = {
  t: 'After a sharp, whispery sound (like p, k, sh, or x), the -ed snaps into a <b>/t/</b>.',
  d: 'After a soft, buzzy sound (like l, n, or a vowel), the -ed hums as a <b>/d/</b>.',
  x: 'When a word already ends in <b>t</b> or <b>d</b>, the -ed needs a whole extra beat so you can hear it.',
};
const C4EA_edGroup = function (g) {
  return C4EA_ED.filter(function (e) { return e[2] === g; });
};

// ------------------------------------------------------------
// 7. POSSESSIVES
// ------------------------------------------------------------
const C4EA_PNAMES = ['Sam', 'Maya', 'Ben', 'Ana', 'Jack', 'Rosa', 'Kim', 'Leo', 'Nina', 'Omar', 'Ruby', 'Theo'];
const C4EA_PTHINGS = [
  ['bike', '🚲'], ['hat', '👒'], ['book', '📚'], ['ball', '⚽'], ['cup', '🥤'], ['kite', '🪁'],
  ['lunch', '🍱'], ['chair', '🪑'], ['pencil', '✏️'], ['coat', '🧥'], ['puppy', '🐶'], ['snack', '🍎'],
];
// [singular, plural, thing, emoji]
const C4EA_OWNERS = [
  ['dog', 'dogs', 'bone', '🦴'], ['cat', 'cats', 'toy', '🧶'], ['bird', 'birds', 'nest', '🪺'],
  ['girl', 'girls', 'hat', '👒'], ['boy', 'boys', 'kite', '🪁'], ['baby', 'babies', 'blanket', '🧸'],
  ['farmer', 'farmers', 'tractor', '🚜'], ['teacher', 'teachers', 'desk', '🪑'],
  ['duck', 'ducks', 'pond', '🦆'], ['kid', 'kids', 'backpack', '🎒'],
  ['horse', 'horses', 'barn', '🐴'], ['bee', 'bees', 'hive', '🍯'],
];

// ------------------------------------------------------------
// 8. GROW A SENTENCE
// ------------------------------------------------------------
const C4EA_COMPLETE = [
  'The puppy chewed my shoe.', 'My sister plays soccer.', 'We picked apples at the farm.',
  'A frog jumped into the pond.', 'Dad made pancakes.', 'The bell rang loudly.',
  'Two owls live in that tree.', 'I lost my blue mitten.', 'Our class grew a bean plant.',
  'The storm woke me up.', 'Ravi drew a dragon.', 'My boots are muddy.',
];
const C4EA_FRAG_EASY = [
  'The tall red barn.', 'Ran down the hill.', 'In the back of the bus.', 'My best friend and I.',
  'Under a pile of leaves.', 'The three little kittens.', 'Jumped over the puddle.', 'With a big smile.',
];
const C4EA_FRAG_HARD = [
  'Because it started to rain.', 'When the bell rang.', 'After we ate dinner.',
  'If you want to come along.', 'While the baby slept.', 'Since Monday morning.',
];
// [base, WHERE, WHEN, HOW, WHAT KIND]
const C4EA_EXPAND = [
  ['The dog ran.', 'The dog ran to the fence.', 'The dog ran this morning.', 'The dog ran slowly.', 'The spotted dog ran.'],
  ['A bird sang.', 'A bird sang in the tall tree.', 'A bird sang at sunrise.', 'A bird sang softly.', 'A tiny bird sang.'],
  ['We ate lunch.', 'We ate lunch on the porch.', 'We ate lunch after the game.', 'We ate lunch quickly.', 'We ate a warm lunch.'],
  ['The bus stopped.', 'The bus stopped at the corner.', 'The bus stopped before dark.', 'The bus stopped suddenly.', 'The yellow bus stopped.'],
  ['Maya read a book.', 'Maya read a book under the tree.', 'Maya read a book before bed.', 'Maya read a book out loud.', 'Maya read a funny book.'],
  ['The rain fell.', 'The rain fell on the roof.', 'The rain fell all night.', 'The rain fell softly.', 'The cold rain fell.'],
  ['My cat sleeps.', 'My cat sleeps on my pillow.', 'My cat sleeps every afternoon.', 'My cat sleeps curled in a ball.', 'My orange cat sleeps.'],
  ['The team won.', 'The team won at the big field.', 'The team won on Saturday.', 'The team won easily.', 'The soccer team won.'],
  ['Leo painted a sign.', 'Leo painted a sign in the garage.', 'Leo painted a sign after school.', 'Leo painted a sign carefully.', 'Leo painted a giant sign.'],
  ['The frogs jumped.', 'The frogs jumped into the pond.', 'The frogs jumped at night.', 'The frogs jumped high.', 'The green frogs jumped.'],
  ['Grandpa laughed.', 'Grandpa laughed in the kitchen.', 'Grandpa laughed during dinner.', 'Grandpa laughed loudly.', 'Silly Grandpa laughed.'],
  ['We built a fort.', 'We built a fort behind the couch.', 'We built a fort on Sunday.', 'We built a fort together.', 'We built a huge fort.'],
];
const C4EA_EXP_ASK = [
  [1, 'WHERE it happened'],
  [2, 'WHEN it happened'],
  [3, 'HOW it happened'],
  [4, 'WHAT KIND it was'],
];

// ------------------------------------------------------------
// 9. COMMAS IN A LETTER
// ------------------------------------------------------------
const C4EA_LTR_NAMES = ['Sam', 'Grandma', 'Aunt Rosa', 'Mr. Lee', 'Nina', 'Uncle Ben',
  'Coach Kim', 'Grandpa', 'Ms. Diaz', 'Jamal', 'Auntie Mae', 'Papa'];
const C4EA_CLOSINGS = ['Your friend', 'Your best friend', 'Your student', 'Your neighbor',
  'Truly yours', 'Your grandson', 'Your granddaughter', 'Your pal',
  'Your cousin', 'Your teammate', 'Your reader', 'Your helper'];
const C4EA_DATES = [
  ['June', '5', '2026'], ['May', '12', '2026'], ['March', '3', '2025'], ['April', '21', '2026'],
  ['July', '9', '2026'], ['October', '30', '2025'], ['January', '8', '2026'], ['August', '17', '2026'],
  ['February', '14', '2026'], ['September', '2', '2025'], ['November', '11', '2026'], ['December', '25', '2025'],
];

// ------------------------------------------------------------
// 10. CONTEXT CLUES
// [sentence with ***, word, meaning, wrong meanings, easy?]
// ------------------------------------------------------------
const C4EA_CLUES = [
  ['The soup was so *** that Ben had to blow on it before every bite.', 'scalding', 'very hot', ['very cold', 'very sweet', 'very salty'], 1],
  ['Nia was *** after the long hike. She yawned and could barely keep her eyes open.', 'weary', 'very tired', ['full of energy', 'very silly', 'very angry'], 1],
  ['The old letter was ***, so Grandma held it gently and warned us it could tear.', 'fragile', 'easy to break', ['heavy and thick', 'brand new', 'very sticky'], 0],
  ['Our dog is *** — he hides behind the couch whenever anyone knocks.', 'timid', 'shy and easily scared', ['loud and bossy', 'friendly to everyone', 'very fast'], 1],
  ['Marco *** his sandwich in three big bites and asked for another one.', 'devoured', 'ate it up fast', ['shared it', 'dropped it', 'made it slowly'], 1],
  ['The *** desert stretched farther than we could see in every direction.', 'vast', 'very big', ['very small', 'very crowded', 'very wet'], 1],
  ['Please do not *** in your seat — try to sit still while the show starts.', 'fidget', 'wiggle around', ['sit perfectly still', 'fall asleep', 'clap your hands'], 0],
  ['The path was so *** that we had to walk one behind the other.', 'narrow', 'thin, not wide', ['very wide', 'very muddy', 'very long'], 1],
  ['Grandpa says those stories are ***; they happened long before cars were invented.', 'ancient', 'very old', ['made up', 'very short', 'very funny'], 0],
  ['The puppy was *** after playing in the sprinkler, so we wrapped him in a towel.', 'drenched', 'soaking wet', ['completely dry', 'very hungry', 'very quiet'], 1],
  ['Ms. Ruiz spoke in a *** voice and told us the safety rule one more time.', 'stern', 'serious and firm', ['joking and silly', 'soft and sleepy', 'squeaky and high'], 0],
  ['We could hear the *** sound of music far away at the end of the street.', 'faint', 'soft and hard to hear', ['very loud', 'very close', 'very fast'], 1],
  ['The lake was *** near the shore; the water only came up to my ankles.', 'shallow', 'not deep', ['very deep', 'very warm', 'very rocky'], 0],
  ['Tomas felt *** before the spelling test. His hands shook and his stomach flipped.', 'anxious', 'worried and nervous', ['calm and relaxed', 'proud and sure', 'bored and sleepy'], 0],
  ['The bread was *** — it had sat out all week and turned hard and dry.', 'stale', 'old, not fresh', ['warm and soft', 'sweet and gooey', 'freshly baked'], 0],
];
// words that could be argued into each other's sentences
const C4EA_CLUE_NO = {
  stale: ['ancient'],
  ancient: ['stale', 'fragile'],
  fragile: ['ancient'],
  timid: ['anxious'],
  anxious: ['timid'],
  weary: ['drenched'],
  stern: ['faint'],
  faint: ['stern'],
  shallow: ['narrow'],
  narrow: ['shallow'],
};

// ------------------------------------------------------------
// 11. ROOT WORDS
// [word, root, wrong roots, meaning, wrong meanings, easy?]
// ------------------------------------------------------------
const C4EA_ROOTS = [
  ['unhappy', 'happy', ['un', 'unhap', 'happ'], 'not happy', ['very happy', 'happy again', 'the happiest'], 1],
  ['unkind', 'kind', ['un', 'unkin', 'kin'], 'not kind', ['extra kind', 'kind again', 'kind of'], 1],
  ['unlock', 'lock', ['un', 'unloc', 'loc'], 'to open something that was locked', ['to lock it tighter', 'to lock it again', 'a kind of key'], 0],
  ['replay', 'play', ['re', 'repla', 'pla'], 'to play it again', ['to stop playing', 'to play for the first time', 'a person who plays'], 1],
  ['rebuild', 'build', ['re', 'rebuil', 'buil'], 'to build it again', ['to knock it down', 'to build it very fast', 'someone who builds'], 0],
  ['retell', 'tell', ['re', 'retel', 'tel'], 'to tell it again', ['to keep it a secret', 'to tell it faster', 'to hear a new story'], 0],
  ['jumping', 'jump', ['ing', 'jumpin', 'jum'], 'it is happening right now', ['it already happened', 'it happens tomorrow', 'it never happens'], 1],
  ['teaching', 'teach', ['ing', 'teachin', 'tea'], 'it is happening right now', ['it already happened', 'it happens tomorrow', 'it never happens'], 1],
  ['teacher', 'teach', ['er', 'teache', 'tead'], 'a person who teaches', ['a place to teach', 'teaching it again', 'not teaching at all'], 1],
  ['painter', 'paint', ['er', 'painte', 'pait'], 'a person who paints', ['a brush for painting', 'paint that is dry', 'to paint it again'], 0],
  ['helpful', 'help', ['ful', 'helpfu', 'hel'], 'full of help', ['without any help', 'to help again', 'not helping'], 1],
  ['careless', 'care', ['less', 'careles', 'cares'], 'without care', ['full of care', 'caring again', 'a person who cares'], 0],
  ['fearless', 'fear', ['less', 'fearles', 'fea'], 'without fear', ['full of fear', 'afraid again', 'a very scary thing'], 0],
  ['darkness', 'dark', ['ness', 'darknes', 'dar'], 'how dark it is', ['a little bit of light', 'dark again', 'not dark at all'], 0],
  ['quickly', 'quick', ['ly', 'quickl', 'qui'], 'in a quick way', ['in a slow way', 'quick again', 'the quickest one'], 1],
];

// ------------------------------------------------------------
// 12. WORDS WITH TWO MEANINGS
// [word, emojiA, sentA, meaningA, wrongA[2], emojiB, sentB, meaningB, wrongB[2]]
// ------------------------------------------------------------
const C4EA_MULTI = [
  ['bat', '⚾', 'Sam swung the *** and hit the ball over the fence.', 'a stick for hitting a ball',
    ['a leather catching glove', 'a soft cap'],
    '🦇', 'A *** flew out of the dark cave at night.', 'a flying animal',
    ['a night bird with feathers', 'a small ball']],
  ['bark', '🌳', 'The rough *** on the oak tree scratched my hand.', 'the outside of a tree',
    ['a green leaf', 'a tree root'],
    '🐕', 'Our puppy began to *** at the mail carrier.', 'the sound a dog makes',
    ['to wag a tail', 'to run in circles']],
  ['right', '➡️', 'Turn *** at the stop sign, then go one more block.', 'the opposite of left',
    ['straight ahead', 'backwards'],
    '✅', 'Every answer on my spelling paper was ***.', 'correct, not wrong',
    ['very neat', 'finished early']],
  ['park', '🌳', 'We played tag at the *** until the sun went down.', 'a place with grass and swings',
    ['a school gym', 'a playroom inside'],
    '🚗', 'Dad will *** the car right next to the door.', 'to leave a car in a spot',
    ['to drive very fast', 'to wash something']],
  ['ring', '💍', 'Mom wears a gold *** on her finger.', 'jewelry you wear on a finger',
    ['a shiny necklace', 'a hair clip'],
    '🔔', 'I heard the doorbell *** twice.', 'to make a bell sound',
    ['to knock on a door', 'to open a door']],
  ['wave', '🌊', 'A big *** splashed over my feet at the beach.', 'water that rolls up on the shore',
    ['a pile of sand', 'a beach towel'],
    '👋', 'I *** to Grandma when the bus pulls away.', 'to move your hand to say hello',
    ['to shout out loud', 'to run after someone']],
  ['trunk', '🐘', 'The elephant lifted a peanut with its ***.', 'the long nose of an elephant',
    ['a big floppy ear', 'a curly tail'],
    '🚗', 'We packed the suitcases in the *** of the car.', 'the storage space in a car',
    ['the front seat', 'the steering wheel']],
  ['light', '💡', 'Please turn on the *** so we can see the game.', 'brightness that helps you see',
    ['a small window', 'a warm blanket'],
    '🪶', 'The bag was so *** that I carried it with one finger.', 'not heavy',
    ['very full', 'very wide']],
  ['fall', '🍂', 'The leaves turn orange and red in the ***.', 'the season after summer',
    ['a rainy day', 'a school break'],
    '🧗', 'Hold the rail so you do not *** down the steps.', 'to drop down by accident',
    ['to run quickly', 'to climb up']],
  ['watch', '⌚', 'I got a new *** for my birthday and wore it to school.', 'a little clock you wear',
    ['a shiny bracelet', 'a phone case'],
    '👀', 'We *** the birds at the feeder every morning.', 'to look at something',
    ['to feed animals', 'to count out loud']],
  ['duck', '🦆', 'A *** swam across the pond with six babies.', 'a bird that swims and quacks',
    ['a small boat', 'a green frog'],
    '⬇️', '*** so the flying ball does not hit you!', 'to bend down fast',
    ['to jump up high', 'to yell for help']],
  ['kind', '💛', 'Ben is *** to every new student in our class.', 'friendly and caring',
    ['very fast', 'a little bossy'],
    '🐕', 'What *** of dog is that fluffy one?', 'a type or sort of something',
    ['the size of something', 'the name of a pet']],
];

// ============================================================
// SKILLS
// ============================================================
SKILLS.push(
  {
    id: 'ela_sight_words', strand: 'phonics', name: 'Sight words at a glance',
    gen: (lvl = 2) => {
      const pool = lvl === 1 ? C4EA_SIGHT.filter(function (e) { return e[4] === 1; }) : C4EA_SIGHT;
      const e = pick(pool);
      const word = e[0];
      if (lvl === 3) {
        return {
          prompt: 'Only one spelling is right. Which word fits the sentence?',
          body: C4EA_sentBox('"' + e[1].replace('___', '<span style="color:var(--coral)">_____</span>') + '"'),
          type: 'mc',
          choices: shuffle([word].concat(e[2])),
          answer: word,
          explain: '<b>' + word + '</b> is the real spelling. Sight words like this one break the sound rules, so we learn them by sight: "' + C4EA_ins(e[1], '___', word) + '"',
        };
      }
      return {
        prompt: 'Which word finishes the sentence?',
        body: C4EA_sentBox('"' + e[1].replace('___', '<span style="color:var(--coral)">_____</span>') + '"'),
        type: 'mc',
        choices: shuffle([word].concat(e[3])),
        answer: word,
        explain: 'It says: "' + C4EA_ins(e[1], '___', word, '<b>', '</b>') + '" Read <b>' + word + '</b> in one glance — no sounding out needed!',
      };
    },
  },
  {
    id: 'ela_vowel_teams', strand: 'phonics', name: 'Vowel teams (ai, ea, oa)',
    gen: (lvl = 2) => C4EA_teamQ(pick(C4EA_VOWEL_TEAMS), lvl, C4EA_VT_TEAMS, 'vowel team'),
  },
  {
    id: 'ela_diphthongs', strand: 'phonics', name: 'Sliding sounds (oo, ou, oi, oy)',
    gen: (lvl = 2) => C4EA_teamQ(pick(C4EA_DIPHTHONGS), lvl, C4EA_DP_TEAMS, 'sliding-sound team'),
  },
  {
    id: 'ela_r_controlled', strand: 'phonics', name: 'Bossy R (ar, er, ir, or, ur)',
    gen: (lvl = 2) => C4EA_teamQ(pick(C4EA_RCONTROL), lvl, C4EA_RC_TEAMS, 'bossy R team'),
  },
  {
    id: 'ela_two_syllable', strand: 'phonics', name: 'Chunk it: two-syllable words',
    gen: (lvl = 2) => {
      if (lvl === 3) {
        const e = pick(C4EA_SPLITS);
        const word = e[0], idx = e[1];
        const answer = word.slice(0, idx) + '-' + word.slice(idx);
        const order = [idx - 1, idx + 1, 1, word.length - 1, idx - 2, idx + 2];
        const wrong = [];
        for (let i = 0; i < order.length && wrong.length < 3; i++) {
          const k = order[i];
          if (k > 0 && k < word.length && k !== idx) {
            const s = word.slice(0, k) + '-' + word.slice(k);
            if (wrong.indexOf(s) === -1) wrong.push(s);
          }
        }
        return {
          prompt: 'Where do the two beats split apart?',
          body: C4EA_sentBox(word),
          type: 'mc',
          choices: shuffle([answer].concat(wrong)),
          answer: answer,
          explain: '<b>' + answer + '</b>. Every chunk needs its own vowel sound, so the break goes between the consonants in the middle — say <b>' + word.slice(0, e[1]) + '</b>, then <b>' + word.slice(e[1]) + '</b>.',
        };
      }
      const pool = lvl === 1
        ? C4EA_SYL_COUNT.filter(function (e) { return e[1] <= 2; })
        : C4EA_SYL_COUNT;
      const e = pick(pool);
      const n = e[1];
      return {
        prompt: 'Clap it out! How many beats (syllables) does this word have? <button class="btn small sunny" data-say="' + e[0] + '" data-lang="en">🔊</button>',
        body: C4EA_sentBox(e[0]),
        type: 'mc',
        choices: ['1', '2', '3', '4'],
        answer: String(n),
        explain: '<b>' + e[0] + '</b> has <b>' + n + '</b> beat' + (n > 1 ? 's' : '') + '. Rest your hand under your chin — it drops once for every beat!',
      };
    },
  },
  {
    id: 'ela_ed_sounds', strand: 'phonics', name: 'The three sounds of -ed',
    gen: (lvl = 2) => {
      if (lvl === 1) {
        const e = pick(C4EA_edGroup('x'));
        const wrong = C4EA_take(C4EA_edGroup('t').concat(C4EA_edGroup('d')), 3).map(function (w) { return w[0]; });
        return {
          prompt: 'In which word does <b>-ed</b> add a whole EXTRA beat?',
          type: 'mc',
          choices: shuffle([e[0]].concat(wrong)),
          answer: e[0],
          explain: 'Say it slowly: <b>' + e[1] + '-ed</b>. ' + C4EA_ED_WHY.x,
        };
      }
      if (lvl === 2) {
        const target = pick(['t', 'd']);
        const other = target === 't' ? 'd' : 't';
        const e = pick(C4EA_edGroup(target));
        const wrong = C4EA_take(C4EA_edGroup(other), 2).map(function (w) { return w[0]; })
          .concat(C4EA_take(C4EA_edGroup('x'), 1).map(function (w) { return w[0]; }));
        return {
          prompt: 'In which word does <b>-ed</b> make ' + C4EA_ED_LABEL[target] + '?',
          type: 'mc',
          choices: shuffle([e[0]].concat(wrong)),
          answer: e[0],
          explain: '<b>' + e[0] + '</b> ends with ' + C4EA_ED_LABEL[target] + '. ' + C4EA_ED_WHY[target],
        };
      }
      const groups = shuffle(['t', 'd', 'x']);
      const same = groups[0], odd = groups[1];
      const three = C4EA_take(C4EA_edGroup(same), 3).map(function (w) { return w[0]; });
      const oddWord = pick(C4EA_edGroup(odd))[0];
      return {
        prompt: 'Three of these end with the SAME -ed sound. Which one is different?',
        type: 'mc',
        choices: shuffle([oddWord].concat(three)),
        answer: oddWord,
        explain: 'The other three all end with ' + C4EA_ED_LABEL[same] + ', but <b>' + oddWord + '</b> ends with ' + C4EA_ED_LABEL[odd] + '. ' + C4EA_ED_WHY[odd],
      };
    },
  },
  {
    id: 'ela_possessive', strand: 'grammar', name: 'Whose is it? (apostrophe s)',
    gen: (lvl = 2) => {
      if (lvl === 1) {
        const name = pick(C4EA_PNAMES);
        const t = pick(C4EA_PTHINGS);
        const answer = name + "'s " + t[0];
        return {
          prompt: 'The ' + t[0] + ' ' + t[1] + ' belongs to ' + name + '. Which way is right?',
          type: 'mc',
          choices: shuffle([answer, name + 's ' + t[0], name + "s' " + t[0], name + ' ' + t[0]]),
          answer: answer,
          explain: 'Add <b>' + "'s" + '</b> to show owning: <b>' + answer + '</b>. The little apostrophe means "this belongs to ' + name + '."',
        };
      }
      const o = pick(C4EA_OWNERS);
      const sing = o[0], plur = o[1], thing = o[2], emo = o[3];
      if (lvl === 2) {
        const answer = 'The ' + sing + "'s " + thing + ' is right here.';
        return {
          prompt: 'ONE ' + sing + ' owns the ' + thing + ' ' + emo + '. Which sentence is written correctly?',
          type: 'mc',
          choices: shuffle([
            answer,
            'The ' + sing + 's ' + thing + ' is right here.',
            'The ' + sing + "s' " + thing + ' is right here.',
            'The ' + sing + ' ' + thing + "'s is right here.",
          ]),
          answer: answer,
          explain: 'One owner gets <b>' + "'s" + '</b> right after the naming word: <b>the ' + sing + "'s " + thing + '</b>.',
        };
      }
      if (ri(1, 2) === 1) {
        const answer = sing + "'s";
        return {
          prompt: 'Which word goes in the blank? (The ' + thing + ' ' + emo + ' belongs to just ONE ' + sing + '.)',
          body: C4EA_sentBox('"The <span style="color:var(--coral)">_____</span> ' + thing + ' was missing."'),
          type: 'mc',
          choices: shuffle([answer, plur, plur + "'", sing]),
          answer: answer,
          explain: 'Owning needs the apostrophe: <b>the ' + sing + "'s " + thing + '</b>. Plain <b>' + plur + '</b> would just mean more than one ' + sing + '.',
        };
      }
      return {
        prompt: 'Which word goes in the blank? (There is MORE THAN ONE ' + sing + ' — nobody owns anything here.)',
        body: C4EA_sentBox('"Three <span style="color:var(--coral)">_____</span> ran toward the ' + thing + '."'),
        type: 'mc',
        choices: shuffle([plur, sing + "'s", plur + "'", sing]),
        answer: plur,
        explain: 'More than one just needs <b>' + plur + '</b> — no apostrophe. Apostrophes are for owning, not for counting.',
      };
    },
  },
  {
    id: 'ela_expand_sentence', strand: 'grammar', name: 'Grow a sentence',
    gen: (lvl = 2) => {
      if (lvl === 3) {
        const e = pick(C4EA_EXPAND);
        const ask = pick(C4EA_EXP_ASK);
        const answer = e[ask[0]];
        return {
          prompt: 'Start with: <b>' + e[0] + '</b><br>Which sentence adds a detail that tells <b>' + ask[1] + '</b>?',
          type: 'mc',
          choices: shuffle([e[1], e[2], e[3], e[4]]),
          answer: answer,
          explain: '<b>' + answer + '</b> tells ' + ask[1] + '. Growing a sentence means adding a detail that answers where, when, how, or what kind.',
        };
      }
      const answer = pick(C4EA_COMPLETE);
      const wrong = lvl === 1
        ? C4EA_take(C4EA_FRAG_EASY, 3)
        : C4EA_take(C4EA_FRAG_HARD, 2).concat(C4EA_take(C4EA_FRAG_EASY, 1));
      return {
        prompt: 'Which one is a COMPLETE sentence?',
        type: 'mc',
        choices: shuffle([answer].concat(wrong)),
        answer: answer,
        explain: '<b>' + answer + '</b> tells us who or what AND what they do — that makes a whole thought. The others leave you hanging.',
      };
    },
  },
  {
    id: 'ela_letter_commas', strand: 'grammar', name: 'Commas in a letter',
    gen: (lvl = 2) => {
      if (lvl === 1) {
        const n = pick(C4EA_LTR_NAMES);
        const answer = 'Dear ' + n + ',';
        return {
          prompt: 'You are starting a letter. Which greeting is written correctly?',
          type: 'mc',
          choices: shuffle([answer, 'Dear ' + n, 'Dear, ' + n, 'Dear ' + n + '.']),
          answer: answer,
          explain: 'A greeting ends with a comma, right after the name: <b>' + answer + '</b>',
        };
      }
      if (lvl === 2) {
        if (ri(1, 2) === 1) {
          const c = pick(C4EA_CLOSINGS);
          const parts = c.split(' ');
          const answer = c + ',';
          return {
            prompt: 'You are finishing a letter. Which closing is written correctly?',
            type: 'mc',
            choices: shuffle([answer, c, c + '.', parts[0] + ', ' + parts.slice(1).join(' ')]),
            answer: answer,
            explain: 'The closing takes a comma at the END, right before you sign your name: <b>' + answer + '</b>',
          };
        }
        const d = pick(C4EA_DATES);
        const answer = d[0] + ' ' + d[1] + ', ' + d[2];
        return {
          prompt: 'Letters need a date. Which date is written correctly?',
          type: 'mc',
          choices: shuffle([answer, d[0] + ' ' + d[1] + ' ' + d[2], d[0] + ', ' + d[1] + ' ' + d[2], d[0] + ', ' + d[1] + ', ' + d[2]]),
          answer: answer,
          explain: 'One comma only, and it goes between the day and the year: <b>' + answer + '</b>',
        };
      }
      const n = pick(C4EA_LTR_NAMES);
      const c = pick(C4EA_CLOSINGS);
      const cp = c.split(' ');
      const answer = 'Dear ' + n + ',  /  ' + c + ',';
      return {
        prompt: 'Check BOTH commas. Which letter is punctuated correctly?',
        type: 'mc',
        choices: shuffle([
          answer,
          'Dear, ' + n + '  /  ' + c + ',',
          'Dear ' + n + ',  /  ' + cp[0] + ', ' + cp.slice(1).join(' '),
          'Dear ' + n + '  /  ' + c,
        ]),
        answer: answer,
        explain: 'A letter needs a comma in <b>both</b> spots — after the greeting name and after the closing: <b>' + answer + '</b>',
      };
    },
  },
  {
    id: 'ela_context_clues', strand: 'vocab', name: 'Clues in the sentence',
    gen: (lvl = 2) => {
      const pool = lvl === 1 ? C4EA_CLUES.filter(function (e) { return e[4] === 1; }) : C4EA_CLUES;
      const e = pick(pool);
      const word = e[1];
      if (lvl === 3) {
        const banned = (C4EA_CLUE_NO[word] || []).concat([word]);
        const others = C4EA_take(C4EA_CLUES.map(function (x) { return x[1]; }), 3, banned);
        return {
          prompt: 'Which word belongs in the blank? Use the clues in the sentence!',
          body: C4EA_sentBox('"' + e[0].replace('***', '<span style="color:var(--coral)">_____</span>') + '"'),
          type: 'mc',
          choices: shuffle([word].concat(others)),
          answer: word,
          explain: '<b>' + word + '</b> means <b>' + e[2] + '</b>, and the rest of the sentence proves it.',
        };
      }
      return {
        prompt: 'What does <b>' + word + '</b> mean here? The other words are your clues.',
        body: C4EA_sentBox('"' + e[0].replace('***', '<b style="color:var(--coral)">' + word + '</b>') + '"'),
        type: 'mc',
        choices: shuffle([e[2]].concat(e[3])),
        answer: e[2],
        explain: '<b>' + word + '</b> means <b>' + e[2] + '</b>. You did not need a dictionary — the sentence around the word told you.',
      };
    },
  },
  {
    id: 'ela_root_words', strand: 'vocab', name: 'Find the root word',
    gen: (lvl = 2) => {
      const pool = lvl === 1 ? C4EA_ROOTS.filter(function (e) { return e[5] === 1; }) : C4EA_ROOTS;
      const e = pick(pool);
      if (lvl === 3) {
        return {
          prompt: 'The root of <b>' + e[0] + '</b> is <b>' + e[1] + '</b>. So what does <b>' + e[0] + '</b> mean?',
          type: 'mc',
          choices: shuffle([e[3]].concat(e[4])),
          answer: e[3],
          explain: '<b>' + e[0] + '</b> means <b>' + e[3] + '</b>. The extra word part glued onto <b>' + e[1] + '</b> is what changes the meaning.',
        };
      }
      return {
        prompt: 'What is the root word hiding inside <b>' + e[0] + '</b>?',
        type: 'mc',
        choices: shuffle([e[1]].concat(e[2])),
        answer: e[1],
        explain: 'Cover up the extra word part and <b>' + e[1] + '</b> is left standing on its own. A root word is a real word all by itself.',
      };
    },
  },
  {
    id: 'ela_multi_meaning', strand: 'vocab', name: 'Words with two meanings',
    gen: (lvl = 2) => {
      const e = pick(C4EA_MULTI);
      const word = e[0];
      const first = ri(1, 2) === 1;
      const emo = first ? e[1] : e[5];
      const sent = first ? e[2] : e[6];
      const mean = first ? e[3] : e[7];
      const otherSent = first ? e[6] : e[2];
      const otherMean = first ? e[7] : e[3];
      const wrong = first ? e[4] : e[8];
      if (lvl === 3) {
        const pool = [];
        const spare = C4EA_take(C4EA_MULTI.filter(function (x) { return x[0] !== word; }), 2);
        for (let i = 0; i < spare.length; i++) {
          const s = ri(1, 2) === 1 ? spare[i][2] : spare[i][6];
          pool.push(C4EA_ins(s, '***', spare[i][0]));
        }
        const answer = C4EA_ins(sent, '***', word);
        return {
          prompt: 'In which sentence does <b>' + word + '</b> mean <b>' + mean + '</b>?',
          type: 'mc',
          choices: shuffle([answer, C4EA_ins(otherSent, '***', word)].concat(pool)),
          answer: answer,
          explain: 'Here <b>' + word + '</b> means <b>' + mean + '</b>. The same word can also mean <b>' + otherMean + '</b> — the rest of the sentence tells you which one.',
        };
      }
      return {
        prompt: 'What does <b>' + word + '</b> mean in THIS sentence?' + (lvl === 1 ? ' ' + emo : ''),
        body: C4EA_sentBox('"' + C4EA_ins(sent, '***', word, '<b style="color:var(--coral)">', '</b>') + '"'),
        type: 'mc',
        choices: shuffle([mean, otherMean].concat(wrong)),
        answer: mean,
        explain: '<b>' + word + '</b> has more than one meaning. Here it means <b>' + mean + '</b>. In a different sentence it can mean <b>' + otherMean + '</b>!',
      };
    },
  },
);

/* ===== slice ela_b — Reading Comprehension + Reading Smoothly ===== */
STRANDS.push(
  { id: 'comprehension', subject: 'ela', name: 'Reading Comprehension', emoji: '🔎', color: 'var(--blue)',
  lesson: `<p><b>Reading is more than saying the words — it is thinking about them!</b></p>
  <ul style="font-weight:700;line-height:1.9;padding-left:22px">
  <li>Ask <b>who</b> the story is about and <b>how they feel</b>.</li>
  <li>Every story has a <b>beginning</b>, a <b>middle</b>, and an <b>end</b>.</li>
  <li>The word <b>I</b> tells you a character is telling the story.</li>
  <li>In a fact book, ask: <b>what is this mostly about?</b></li>
  <li>Headings, captions, and the glossary help you find things fast.</li>
  <li>Authors write to <b>give facts</b>, <b>tell a fun story</b>, <b>show how</b>, or <b>talk you into</b> something.</li>
  </ul>` },
  { id: 'fluency', subject: 'ela', name: 'Reading Smoothly', emoji: '🎯', color: 'var(--coral)',
  lesson: `<p><b>Smooth reading sounds like talking, not like a robot.</b></p>
  <ul style="font-weight:700;line-height:1.9;padding-left:22px">
  <li>Read words in <b>chunks</b> that belong together.</li>
  <li>A <b>comma</b> means a tiny rest. A <b>period</b> means a full stop.</li>
  <li>A <b>question mark</b> lifts your voice at the end.</li>
  <li>If a sentence sounds strange, <b>go back and look again</b>.</li>
  <li>Reading a page a second time makes it smoother every time.</li>
  </ul>` },
);
/* ---------- shared helpers ---------- */
const C4EB_body = function (txt) {
  return '<div style="font-size:19px;line-height:1.75;text-align:left;max-width:520px;margin:0 auto;font-weight:600">' + txt + '</div>';
};
const C4EB_PRON = ['i', 'me', 'my', 'we', 'us', 'our', 'mine', 'ours', 'myself', 'ourselves'];
/* pull short-ish real words out of a sentence to use as safe distractors */
const C4EB_otherWords = function (sent, skip, n, maxLen) {
  const raw = sent.replace(/[^A-Za-z' ]/g, ' ').split(' ');
  const cap = maxLen || 6;
  let out = [];
  for (let i = 0; i < raw.length; i++) {
  const w = raw[i];
  if (!w) continue;
  if (w.length < 3 || w.length > cap) continue;
  if (w === skip) continue;
  if (C4EB_PRON.indexOf(w.toLowerCase()) !== -1) continue;
  if (out.indexOf(w) !== -1) continue;
  out.push(w);
  }
  out = shuffle(out);
  return out.slice(0, n);
};
/* 1. ela_char_response — How did they feel? */
const C4EB_CHAR = [
  { t: 'Maya practiced jumping rope every single day for two weeks. At the school show she jumped fifty times without one miss. Her whole class clapped.',
  f: 'proud', w: ['sleepy', 'hungry', 'bored'], h: ['confused', 'jealous', 'scared'],
  x: 'Doing something well after lots of hard practice makes a person feel proud.',
  q: 'Why did Maya feel that way?', a: 'She practiced hard and did well onstage.',
  d: ['She got to leave school early that day.', 'Her class walked out before she started jumping.', 'She had never seen a jump rope before.'] },
  { t: 'Tomorrow is Ana\'s first day at a brand new school. She does not know one single kid there yet. At bedtime her stomach felt fluttery and she could not fall asleep.',
  f: 'nervous', w: ['proud', 'cheerful', 'angry'], h: ['jealous', 'grateful', 'amused'],
  x: 'A fluttery stomach before something new and unknown is a nervous feeling.',
  q: 'Why did Ana feel that way?', a: 'She was starting a school where she knew nobody.',
  d: ['She had gone to that school since she was little.', 'She ate too much dinner right before bed.', 'Her best friend was already in her new class.'] },
  { t: 'Marcus stacked blocks all morning to build a tower taller than his knee. His baby sister crawled past and knocked the whole thing over.',
  f: 'frustrated', w: ['sleepy', 'embarrassed', 'curious'], h: ['proud', 'relieved', 'amused'],
  x: 'When your hard work falls apart in one second, that heavy annoyed feeling is frustration.',
  q: 'Why did Marcus feel that way?', a: 'A whole morning of work fell in one second.',
  d: ['He did not like playing with blocks at all.', 'His sister asked him to build a taller tower for her.', 'He was not allowed to touch the blocks.'] },
  { t: 'Dad said the trip was a secret. When the car turned into the zoo parking lot, Lila\'s eyes went wide and she bounced in her seat.',
  f: 'excited', w: ['bored', 'angry', 'disappointed'], h: ['worried', 'embarrassed', 'disappointed'],
  x: 'Wide eyes and bouncing are what a body does when it is excited.',
  q: 'Why did Lila bounce in her seat?', a: 'The secret trip turned out to be the zoo.',
  d: ['She had gone to the zoo every single day that week.', 'She wanted to go home and nap.', 'Dad told her the trip was called off.'] },
  { t: 'It rained for three days straight. Every kid on Rosa\'s street stayed inside. Rosa sat by the window with nobody to play with.',
  f: 'lonely', w: ['proud', 'surprised', 'silly'], h: ['excited', 'embarrassed', 'curious'],
  x: 'Wanting friends who are not there is the lonely feeling.',
  q: 'Why did Rosa feel that way?', a: 'The rain kept her friends indoors.',
  d: ['Her friends were outside playing without her.', 'Too many people were crowded inside her house.', 'She did not like looking out of windows.'] },
  { t: 'Theo\'s shoelace came loose and he tripped right in front of the whole lunch line. His face got hot and he stared at the floor.',
  f: 'embarrassed', w: ['proud', 'excited', 'comfortable'], h: ['grateful', 'curious', 'bored'],
  x: 'A hot face after everybody sees you goof up is the embarrassed feeling.',
  q: 'Why did Theo stare at the floor?', a: 'He tripped where the whole lunch line could see.',
  d: ['He dropped his lunch money on the tile.', 'He was hunting for a pencil that rolled away.', 'He was reading a book he set down on the ground.'] },
  { t: 'Kai called and called, but his dog Pepper did not come. Then he heard one small bark. Pepper was asleep under the porch, safe.',
  f: 'relieved', w: ['angry', 'impatient', 'jealous'], h: ['embarrassed', 'disappointed', 'curious'],
  x: 'Relieved is the light feeling you get when a big worry turns out fine.',
  q: 'Why did Kai stop worrying?', a: 'He heard a bark and found Pepper safe under the porch.',
  d: ['He decided to go to the shelter and get another dog.', 'His mom said Pepper was at the vet.', 'Pepper was in his arms the whole time.'] },
  { t: 'Grandma sat at her sewing machine every night for a week. When Jada tried on the finished costume, she squeezed Grandma in a long hug.',
  f: 'grateful', w: ['annoyed', 'frightened', 'bored'], h: ['jealous', 'nervous', 'confused'],
  x: 'Grateful means you notice somebody did something kind for you and it matters.',
  q: 'Why did Jada hug her grandma?', a: 'Grandma spent a whole week sewing the costume.',
  d: ['Grandma bought the costume at a store.', 'The costume was too small to wear.', 'Jada wanted her own turn at the sewing machine.'] },
  { t: 'Ivan spotted a small blue egg in the grass under the maple tree. He wondered what kind of bird it came from and ran inside for his bird book.',
  f: 'curious', w: ['angry', 'sleepy', 'embarrassed'], h: ['frustrated', 'lonely', 'grateful'],
  x: 'Wondering about something and going to find out is being curious.',
  q: 'Why did Ivan run to get his bird book?', a: 'He wanted to find out which bird laid the egg.',
  d: ['He wanted to keep the egg warm with the book.', 'He needed something to sit on in the grass.', 'His teacher told him to put the book away.'] },
  { t: 'Nina practiced her poem ten times at home. On stage she forgot two lines, but she took a slow breath and kept going all the way to the end.',
  f: 'brave', w: ['careless', 'bored', 'silly'], h: ['selfish', 'angry', 'confused'],
  x: 'Doing the hard thing even when it goes wrong is what brave looks like.',
  q: 'What did Nina do when she forgot her lines?', a: 'She took a breath and kept going to the end.',
  d: ['She walked off the stage crying.', 'She started her poem over again from the very top.', 'She asked her teacher to read it for her.'] },
  { t: 'Owen was sure he had come in last in the race. Then the teacher read the times out loud. Owen had come in second.',
  f: 'surprised', w: ['bored', 'disappointed', 'lonely'], h: ['frustrated', 'embarrassed', 'nervous'],
  x: 'Surprised is what you feel when the real answer is not what you expected.',
  q: 'Why was Owen surprised?', a: 'He thought he was last, but he came in second.',
  d: ['He did not know there was a race that day.', 'The teacher forgot to read his time out loud to the class.', 'He came in last, just like he thought.'] },
  { t: 'Priya fed the class fish every morning all year. On Monday the fish floated still at the top of the tank and did not move.',
  f: 'sad', w: ['proud', 'excited', 'silly'], h: ['jealous', 'amused', 'grateful'],
  x: 'Losing something you took care of every day gives you a heavy, sad feeling.',
  q: 'Why did Priya feel that way?', a: 'The fish she cared for every day had died.',
  d: ['She forgot to feed the fish all week.', 'Someone gave the fish away without telling her.', 'The fish swam faster than it usually did.'] },
];
SKILLS.push(
  { id: 'ela_char_response', strand: 'comprehension', name: 'How did they feel?',
  gen: (lvl = 2) => {
  const e = pick(C4EB_CHAR);
  const roll = ri(1, 10);
  const askWhy = (lvl === 3 && roll <= 6) || (lvl === 2 && roll <= 4);
  if (askWhy) {
  const ans = e.a;
  return {
  prompt: e.q, body: C4EB_body(e.t), type: 'mc',
  choices: shuffle([ans, e.d[0], e.d[1], e.d[2]]), answer: ans,
  explain: 'Look back at the story. It tells us: ' + ans,
  };
  }
  const ans = e.f;
  const wrongs = (lvl === 1) ? e.w : e.h;
  return {
  prompt: 'How did the character feel?', body: C4EB_body(e.t), type: 'mc',
  choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans,
  explain: e.x,
  };
  } },
);
/* 2. ela_story_structure — Beginning, middle, end */
const C4EB_STORY = [
  { b: 'Nadia zipped her coat and walked to the snowy park.',
  m: 'While she was swinging, one mitten slipped off into the deep snow.',
  e: 'She dug with her boot, found the mitten, and warmed her hand.',
  x: 'Marco planted three bean seeds in a paper cup.' },
  { b: 'The Ruiz family brought home a puppy named Bean.',
  m: 'Bean chewed a hole right through the couch pillow.',
  e: 'They gave Bean a chew toy, and the pillows stayed safe.',
  x: 'The library closes early on Sundays.' },
  { b: 'Ms. Cole told the class the science fair was on Friday.',
  m: 'Ari\'s volcano would not bubble, no matter what he tried.',
  e: 'He added more vinegar, and foam poured over the top.',
  x: 'Two geese landed on the pond by the school.' },
  { b: 'Tess and Sam decided to sell lemonade on their corner.',
  m: 'By noon nobody had stopped, and the ice was melting.',
  e: 'They made a huge sign, and a whole soccer team lined up.',
  x: 'Grandpa fixed the squeaky gate with an old screwdriver.' },
  { b: 'The class hamster, Nibbles, lived in a cage by the window.',
  m: 'One morning the cage door hung open and Nibbles was gone.',
  e: 'They found him asleep in the tissue box and latched the door.',
  x: 'It snowed six inches up in the mountains last night.' },
  { b: 'Dad rolled a shiny used bike out of the garage for Jo.',
  m: 'Jo wobbled and tipped over on the driveway two times.',
  e: 'By Sunday she rode all the way around the block by herself.',
  x: 'The cafeteria served orange slices for snack.' },
  { b: 'Ravi carried his brand new kite down to the empty beach.',
  m: 'The string tangled around a beach umbrella and knotted up.',
  e: 'A woman helped him untangle it, and the kite flew high.',
  x: 'Ants marched in a line under the picnic table.' },
  { b: 'Ms. Park said the class library book was due on Thursday.',
  m: 'Hana looked in her desk and her bag, but the book was gone.',
  e: 'She found it under her bed and returned it right on time.',
  x: 'A red truck delivered boxes to the corner store.' },
  { b: 'Ella and her nana planted carrot seeds in a sunny row.',
  m: 'Rabbits nibbled the little green tops down to the dirt.',
  e: 'They built a low fence, and the carrots grew back thick.',
  x: 'The clock in the hallway ticks very loudly.' },
  { b: 'On Monday, Dev got a list of ten new spelling words.',
  m: 'He kept mixing up the words their and there.',
  e: 'He drew a picture clue for each one and spelled both right.',
  x: 'The swimming pool opens at ten in the morning.' },
  { b: 'Omar noticed the birds had nothing to eat in the cold.',
  m: 'His feeder kept blowing off the branch in the wind.',
  e: 'He tied it on with wire, and six sparrows came to eat.',
  x: 'The fire drill happened right after lunch.' },
  { b: 'Zoe wiggled her loose tooth all through breakfast.',
  m: 'At recess the tooth fell out and rolled into the grass.',
  e: 'Her friends searched with her until it turned up by the fence.',
  x: 'A yellow butterfly landed on the fence post.' },
];
const C4EB_STORY_Q = [
  { q: 'What does the BEGINNING of a story usually do?',
  a: 'It tells who is in the story and where they are.',
  d: ['It tells how the problem got fixed.', 'It shows the biggest bump in the story.', 'It lists the hardest words in ABC order.'], hard: false },
  { q: 'What usually happens in the MIDDLE of a story?',
  a: 'A problem shows up and gets bigger.',
  d: ['You meet the characters for the very first time.', 'You find out how everything turned out.', 'The author writes their own name.'], hard: false },
  { q: 'What does the END of a story do?',
  a: 'It tells how the problem worked out.',
  d: ['It gives the very first fact about the place.', 'It shows the problem just starting up.', 'It tells you the price of the book.'], hard: false },
  { q: 'Which part of a story comes right after the beginning?',
  a: 'the middle', d: ['the end', 'the back cover', 'the title'], hard: false },
  { q: 'Which words sound like the very START of a story?',
  a: 'Once there was a girl who loved frogs.',
  d: ['Finally, the lights came back on.', 'After that, they never worried again.', 'And so the long day ended.'], hard: true },
  { q: 'Which words sound like the very END of a story?',
  a: 'At last, everything was fine again.',
  d: ['One sunny morning, Mia woke up early.', 'Suddenly, the old box began to shake.', 'There once lived a very small mouse.'], hard: true },
  { q: 'A story ends with: "They never lost the key again." What did that ending do?',
  a: 'It told how the problem turned out.',
  d: ['It told where the story took place.', 'It made the problem worse than before.', 'It introduced a brand new character.'], hard: true },
  { q: 'Why does a story need a middle?',
  a: 'That is where the problem grows and the characters try things.',
  d: ['That is where the pictures go.', 'That is where the author signs the book.', 'That is where the words get bigger.'], hard: true },
];
SKILLS.push(
  { id: 'ela_story_structure', strand: 'comprehension', name: 'Beginning, middle, end',
  gen: (lvl = 2) => {
  const s = pick(C4EB_STORY);
  const roll = ri(1, 10);
  if (lvl === 3 && roll <= 5) {
  /* hardest: the middle is missing — which sentence belongs there? */
  const others = shuffle(C4EB_STORY.filter(function (o) { return o.b !== s.b; })).slice(0, 3);
  const ans = s.m;
  return {
  prompt: 'The MIDDLE is missing. Which sentence belongs in the middle?',
  body: C4EB_body('<b>Beginning:</b> ' + s.b + '<br><br><b>Middle:</b> ?<br><br><b>End:</b> ' + s.e),
  type: 'mc',
  choices: shuffle([ans, others[0].m, others[1].m, others[2].m]), answer: ans,
  explain: 'The middle has to match the same people and the same problem the end fixes.',
  };
  }
  const wantConcept = (lvl === 1 && roll <= 2) || (lvl === 2 && roll <= 3) || (lvl === 3);
  if (wantConcept) {
  const pool = C4EB_STORY_Q.filter(function (c) { return lvl === 1 ? !c.hard : (lvl === 3 ? c.hard : true); });
  const c = pick(pool.length ? pool : C4EB_STORY_Q);
  const ans = c.a;
  return {
  prompt: c.q, type: 'mc',
  choices: shuffle([ans, c.d[0], c.d[1], c.d[2]]), answer: ans,
  explain: 'Beginning = who and where. Middle = the problem. End = how it worked out.',
  };
  }
  const part = (lvl === 1) ? 'beginning' : pick(['beginning', 'middle', 'end']);
  const ans = part === 'beginning' ? s.b : (part === 'middle' ? s.m : s.e);
  const label = part === 'beginning' ? 'BEGINNING' : (part === 'middle' ? 'MIDDLE' : 'END');
  const why = part === 'beginning' ? 'The beginning tells you who is in the story and where they are.'
  : (part === 'middle' ? 'The middle is where the problem shows up.'
  : 'The end tells how the problem worked out.');
  return {
  prompt: 'Which sentence tells the ' + label + ' of this story?',
  body: C4EB_body(s.b + '<br>' + s.m + '<br>' + s.e),
  type: 'mc',
  choices: shuffle([ans, s.b === ans ? s.m : s.b, s.e === ans ? s.m : s.e, s.x]), answer: ans,
  explain: why,
  };
  } },
);
/* 3. ela_pov — Who is telling it? */
const C4EB_POV_IN = 'A character in the story, telling about herself';
const C4EB_POV_NAR = 'A narrator outside the story, telling about others';
const C4EB_POV_R1 = 'The kid who is reading this book at home right now';
const C4EB_POV_R2 = 'A character from a completely different book series';
const C4EB_POV_I = [
  { s: 'I hid my sister\'s hat under the bed, and then I felt bad.', k: 'I' },
  { s: 'We packed our lunches before the sun even came up.', k: 'We' },
  { s: 'My knees were shaking when I stepped onto the stage.', k: 'My' },
  { s: 'I could not stop laughing at my own silly joke.', k: 'I' },
  { s: 'We looked everywhere for the missing red kickball.', k: 'We' },
  { s: 'I told Grandpa about the frog I caught in the creek.', k: 'I' },
  { s: 'My brother and I built a fort out of couch pillows.', k: 'My' },
  { s: 'I whispered so the sleeping baby would stay asleep.', k: 'I' },
  { s: 'We cheered when the team finally scored a goal.', k: 'We' },
  { s: 'I wrote my name on every page of the new notebook.', k: 'I' },
  { s: 'My dog followed me all the way to the bus stop.', k: 'My' },
  { s: 'I was picked last for kickball, and I did not mind.', k: 'I' },
];
const C4EB_POV_OUT = [
  'Rosa hid her sister\'s hat under the bed and then felt bad.',
  'The twins packed their lunches before the sun came up.',
  'Dev\'s knees shook when he stepped onto the stage.',
  'Mr. Cruz laughed and laughed at his own silly joke.',
  'The whole team looked everywhere for the missing kickball.',
  'Nia told her grandpa about the frog she caught in the creek.',
  'The two boys built a fort out of couch pillows.',
  'Ana whispered so the sleeping baby would stay asleep.',
  'They cheered when the team finally scored a goal.',
  'Sam wrote his name on every page of the new notebook.',
  'The brown dog followed Ben all the way to the bus stop.',
  'Kim was picked last for kickball, but she did not mind.',
];
const C4EB_POV_SAID = [
  { d: '"I found the key!" shouted Pilar.<br>"Where was it?" asked Nico.', q: 'Who found the key?', a: 'Pilar', w: ['Nico', 'Ruby', 'Mr. Diaz'] },
  { d: '"My tooth came out!" said Zoe.<br>"Put it in this cup," said Dad.', q: 'Who told Zoe to use a cup?', a: 'Dad', w: ['Zoe', 'Mom', 'the school nurse'] },
  { d: '"Can I borrow a pencil?" whispered Leo.<br>"Take the blue one," Mia whispered back.', q: 'Who needed a pencil?', a: 'Leo', w: ['Mia', 'Ana', 'the teacher'] },
  { d: '"The bus is here!" called Grandma.<br>"Wait, my shoe!" yelled Kofi.', q: 'Who is missing a shoe?', a: 'Kofi', w: ['Grandma', 'Rosa', 'the bus driver'] },
  { d: '"I made the soup too salty," said Uncle Ray.<br>"I like it anyway," said Bea.', q: 'Who made the soup?', a: 'Uncle Ray', w: ['Bea', 'Aunt Jo', 'the school cook'] },
  { d: '"Watch me flip!" said Nadia.<br>"Be careful," warned her brother.', q: 'Who said to be careful?', a: 'Nadia\'s brother', w: ['Nadia', 'Nadia\'s teacher', 'the lifeguard'] },
  { d: '"I forgot my homework," Sam said quietly.<br>"Turn it in tomorrow," said Ms. Wren.', q: 'Who forgot the homework?', a: 'Sam', w: ['Ms. Wren', 'Dev', 'the principal'] },
  { d: '"This box is so heavy," groaned Tia.<br>"I will grab the other end," said Marco.', q: 'Who offered to help?', a: 'Marco', w: ['Tia', 'Luis', 'the mail carrier'] },
];
SKILLS.push(
  { id: 'ela_pov', strand: 'comprehension', name: 'Who is telling it?',
  gen: (lvl = 2) => {
  const roll = ri(1, 10);
  if (lvl === 1) {
  if (roll <= 5) {
  const e = pick(C4EB_POV_I);
  const ans = e.k;
  const others = C4EB_otherWords(e.s, e.k, 3, 6);
  return {
  prompt: 'Which word shows that a character is telling this story?',
  body: C4EB_body(e.s), type: 'mc',
  choices: shuffle([ans, others[0], others[1], others[2]]), answer: ans,
  explain: 'Words like I, we, and my mean the person in the story is the one telling it.',
  };
  }
  const q = pick(C4EB_POV_SAID);
  const ans = q.a;
  return {
  prompt: q.q, body: C4EB_body(q.d), type: 'mc',
  choices: shuffle([ans, q.w[0], q.w[1], q.w[2]]), answer: ans,
  explain: 'The words after the quotation marks tell you who was talking.',
  };
  }
  if (lvl === 2) {
  if (roll <= 4) {
  const useI = ri(0, 1) === 0;
  const line = useI ? pick(C4EB_POV_I).s : pick(C4EB_POV_OUT);
  const ans = useI ? C4EB_POV_IN : C4EB_POV_NAR;
  return {
  prompt: 'Who is telling this?', body: C4EB_body(line), type: 'mc',
  choices: shuffle([C4EB_POV_IN, C4EB_POV_NAR, C4EB_POV_R1, C4EB_POV_R2]), answer: ans,
  explain: useI ? 'The word I means a character is telling her own story.'
  : 'Words like she, he, and they mean a narrator outside the story is telling it.',
  };
  }
  if (roll <= 7) {
  const ans = pick(C4EB_POV_I).s;
  const outs = shuffle(C4EB_POV_OUT).slice(0, 3);
  return {
  prompt: 'Which sentence is told BY a character in the story?', type: 'mc',
  choices: shuffle([ans, outs[0], outs[1], outs[2]]), answer: ans,
  explain: 'Only one sentence uses I or my, so only that one is told by the character.',
  };
  }
  const q = pick(C4EB_POV_SAID);
  const ans = q.a;
  return {
  prompt: q.q, body: C4EB_body(q.d), type: 'mc',
  choices: shuffle([ans, q.w[0], q.w[1], q.w[2]]), answer: ans,
  explain: 'Match the words inside the quotation marks to the name right beside them.',
  };
  }
  /* level 3 */
  if (roll <= 4) {
  const ans = pick(C4EB_POV_OUT);
  const ins = shuffle(C4EB_POV_I).slice(0, 3);
  return {
  prompt: 'Which sentence is told by a NARRATOR outside the story?', type: 'mc',
  choices: shuffle([ans, ins[0].s, ins[1].s, ins[2].s]), answer: ans,
  explain: 'A narrator outside the story uses names and words like she, he, and they — never I.',
  };
  }
  if (roll <= 7) {
  const useI = ri(0, 1) === 0;
  const line = useI ? pick(C4EB_POV_I).s : pick(C4EB_POV_OUT);
  const ans = useI ? C4EB_POV_IN : C4EB_POV_NAR;
  return {
  prompt: 'Who is telling this?', body: C4EB_body(line), type: 'mc',
  choices: shuffle([C4EB_POV_IN, C4EB_POV_NAR, C4EB_POV_R1, C4EB_POV_R2]), answer: ans,
  explain: useI ? 'I and my are clues that the teller is inside the story.'
  : 'No I or my anywhere, so the teller is outside the story looking in.',
  };
  }
  const ans3 = 'A character in the story is telling it.';
  return {
  prompt: 'A book starts with: "I have never liked thunder." What does that tell you?',
  type: 'mc',
  choices: shuffle([ans3, 'The book has no characters in it at all.',
  'A narrator outside the story is telling it.', 'The book is about how thunder is made.']),
  answer: ans3,
  explain: 'The word I means the teller is one of the people inside the story.',
  };
  } },
);
/* 4. ela_main_topic — What is it mostly about? */
const C4EB_TOPIC = [
  { p: 'Honeybees do many different jobs inside their hive. Some bees clean out the wax rooms. Some feed the hungry babies. Others fly far away to bring back sweet nectar.',
  t: 'The jobs honeybees do inside a hive',
  d: ['Some bees fly far away to bring back sweet nectar.', 'Some bees feed the babies.', 'Some bees clean out the wax rooms.'],
  b: 'Every bug in the whole world' },
  { p: 'A camel\'s body helps it live in a hot, dry desert. Its hump stores fat for days without food. Long eyelashes keep blowing sand out of its eyes. Wide feet keep it from sinking in soft sand.',
  t: 'How a camel\'s body helps it live in the desert',
  d: ['Long eyelashes keep blowing sand out of a camel\'s eyes.', 'A camel\'s hump stores fat.', 'A camel has wide feet.'],
  b: 'All the animals on Earth' },
  { p: 'Firefighters get ready long before a fire ever starts. They check every hose each morning. They fold their heavy coats so they can grab them fast. They practice climbing ladders again and again.',
  t: 'How firefighters get ready before a fire',
  d: ['Firefighters check the hoses.', 'Firefighters practice climbing ladders over and over.', 'Firefighters fold their coats.'],
  b: 'Every job people can have' },
  { p: 'Baby sea turtles have a big job the day they hatch. They dig up out of the warm sand. Then they hurry across the open beach to the water. Waves carry them out toward the deep sea.',
  t: 'What baby sea turtles do the day they hatch',
  d: ['Waves carry the baby turtles out toward the deep sea.', 'Baby turtles hurry across the beach.', 'Baby turtles dig out of the sand.'],
  b: 'Everything that lives in the ocean' },
  { p: 'Rain travels in a circle called the water cycle. The sun warms lakes and oceans until water rises as vapor. High in the sky, that vapor cools into tiny drops that make clouds. When the drops get heavy, they fall as rain.',
  t: 'How water moves in the water cycle',
  d: ['The sun warms lakes and oceans until water rises up.', 'Vapor cools into tiny drops.', 'Heavy drops fall as rain.'],
  b: 'All the weather there is' },
  { p: 'Owls are built for hunting at night. Their huge eyes soak up the tiniest bit of light. Soft feathers make their wings almost silent. Their ears can hear a mouse moving under the leaves.',
  t: 'How owls are built for hunting at night',
  d: ['Owls have huge eyes.', 'Owls can hear a mouse moving under the leaves.', 'Owl wings are almost silent.'],
  b: 'Every bird that can fly' },
  { p: 'Making bread takes time and a few simple things. A baker mixes flour, water, salt, and yeast. The dough has to rest until it puffs up. Then a hot oven turns it brown and crusty.',
  t: 'How bread gets made',
  d: ['Bread dough has yeast in it.', 'The dough rests until it puffs.', 'A hot oven browns the crust.'],
  b: 'All the food in a grocery store' },
  { p: 'Many trees get ready for winter all through the fall. Their green leaves turn yellow, orange, or red. Then the leaves let go and drop to the ground. The bare tree rests until spring comes.',
  t: 'How trees get ready for winter',
  d: ['Green leaves turn yellow, orange, or red in the fall.', 'Leaves drop to the ground.', 'Bare trees rest until spring.'],
  b: 'Every plant that grows' },
  { p: 'Ants work together to feed their whole colony. One ant that finds food leaves a scent trail behind it. Other ants follow that trail with their feelers. Together they carry crumbs much bigger than themselves.',
  t: 'How ants work together to get food',
  d: ['An ant leaves a scent trail.', 'Ants carry crumbs much bigger than they are.', 'Ants follow trails with their feelers.'],
  b: 'Everything that happens outside' },
  { p: 'Riding a bike is safer when you follow a few rules. Wear a helmet that fits snugly on your head. Ride the same way the cars are going. Put out your hand to show where you will turn.',
  t: 'Rules that keep bike riders safe',
  d: ['Put out your hand to show where you will turn.', 'Ride the way cars are going.', 'A helmet should fit snugly.'],
  b: 'Everything with wheels' },
  { p: 'Emperor penguins stay warm in the coldest place on Earth. They grow two thick layers of feathers. A layer of fat sits under their skin. They also huddle in a big group and take turns in the warm middle.',
  t: 'How emperor penguins stay warm',
  d: ['Penguins grow two thick layers of feathers.', 'Penguins have fat under the skin.', 'Penguins huddle in a group.'],
  b: 'All the cold places on Earth' },
  { p: 'Bridges help people cross things that are hard to walk over. Some bridges cross wide rivers. Some cross busy roads full of cars. A few stretch across deep valleys between mountains.',
  t: 'What bridges help people cross',
  d: ['Some bridges stretch across deep mountain valleys.', 'Some bridges cross busy roads.', 'Some bridges cross wide rivers.'],
  b: 'Everything people build' },
];
SKILLS.push(
  { id: 'ela_main_topic', strand: 'comprehension', name: 'What is it mostly about?',
  gen: (lvl = 2) => {
  const e = pick(C4EB_TOPIC);
  const others = shuffle(C4EB_TOPIC.filter(function (o) { return o.t !== e.t; }));
  const ans = e.t;
  if (lvl === 1) {
  return {
  prompt: 'What is this paragraph MOSTLY about?', body: C4EB_body(e.p), type: 'mc',
  choices: shuffle([ans, e.d[0], others[0].t, others[1].t]), answer: ans,
  explain: 'The main topic covers the whole paragraph, not just one sentence in it.',
  };
  }
  if (lvl === 2) {
  return {
  prompt: 'What is this paragraph MOSTLY about?', body: C4EB_body(e.p), type: 'mc',
  choices: shuffle([ans, e.d[0], e.d[1], others[0].t]), answer: ans,
  explain: 'Two of those are true, but they are only small pieces. The topic covers every sentence.',
  };
  }
  if (ri(0, 1) === 0) {
  return {
  prompt: 'Which title tells about the WHOLE paragraph and nothing extra?',
  body: C4EB_body(e.p), type: 'mc',
  choices: shuffle([ans, e.d[0], e.d[1], e.b]), answer: ans,
  explain: 'One choice is way too big and two are way too small. The best title fits just right.',
  };
  }
  return {
  prompt: 'What is this paragraph MOSTLY about?', body: C4EB_body(e.p), type: 'mc',
  choices: shuffle([ans, e.d[0], e.d[1], e.d[2]]), answer: ans,
  explain: 'Every wrong choice is a true detail, but each one covers only one sentence.',
  };
  } },
);
/* 5. ela_text_features — Parts of a fact book */
const C4EB_FEAT = [
  { q: 'You want to know what page the chapter called "Sharks" starts on.', a: 'the table of contents',
  w: ['the caption', 'the glossary', 'a bold word'], hard: false,
  x: 'The table of contents lists every chapter and the page it begins on.' },
  { q: 'You see the word "predator" printed in dark bold letters. Where do you find out what it means?', a: 'the glossary',
  w: ['the table of contents', 'the photo', 'the page number'], hard: false,
  x: 'A glossary is a little dictionary in the back for the special words in that book.' },
  { q: 'A photo of a nest has a line of small print right under it. What is that line called?', a: 'a caption',
  w: ['a heading', 'a glossary', 'a title page'], hard: false,
  x: 'A caption is the small print that tells you about the picture next to it.' },
  { q: 'What does a heading at the top of a section tell you?', a: 'what that part is about',
  w: ['how many pages the book has', 'who printed the book', 'what every word means'], hard: false,
  x: 'A heading is like a tiny title for one part of the page.' },
  { q: 'You want to see what a walrus really looks like. Which part helps the most?', a: 'the photo and its caption',
  w: ['the index', 'the glossary', 'the page number'], hard: false,
  x: 'Photos show you the thing, and the caption explains what you are seeing.' },
  { q: 'A section starts with the big words "What Bats Eat." What is that called?', a: 'a heading',
  w: ['a caption', 'an index', 'a glossary'], hard: false,
  x: 'Big words at the start of a section are a heading.' },
  { q: 'What does a glossary give you?', a: 'the meanings of hard words',
  w: ['the page number where each chapter starts', 'a photograph of the author', 'the name of the printing shop'], hard: false,
  x: 'A glossary lists the tricky words with their meanings, in ABC order.' },
  { q: 'A heading says "Animals of the Rain Forest." What will that part be about?', a: 'animals that live in the rain forest',
  w: ['how to plant a garden', 'the author\'s own family', 'how paper gets made from trees at a mill'], hard: false,
  x: 'A heading tells you ahead of time what you are about to read.' },
  { q: 'In a long book, you want the one page that talks about shark teeth.', a: 'the index',
  w: ['the title page', 'the caption', 'the heading'], hard: true,
  x: 'The index lists small topics in ABC order with the exact pages that mention them.' },
  { q: 'Where do you usually find the glossary in a fact book?', a: 'near the back, with words in ABC order',
  w: ['on the very first page, before the title', 'in the middle of every single chapter', 'printed under each photograph'], hard: true,
  x: 'Glossaries live near the back so you can flip there whenever a word stumps you.' },
  { q: 'Why do fact books print some words in bold?', a: 'to show the word is important',
  w: ['to show the word is spelled wrong', 'to tell you to read the whole page over again', 'to make the page look longer'], hard: true,
  x: 'Bold is a signal: this word matters, and you can look it up in the glossary.' },
  { q: 'A book about frogs has 90 pages. You need only the pages about frog eggs. What is fastest?', a: 'the index',
  w: ['the caption on page 4', 'the glossary', 'the heading on page 1'], hard: true,
  x: 'The index sends you straight to the exact pages about one small topic.' },
  { q: 'How is a caption different from a heading?', a: 'A caption tells about the picture beside it.',
  w: ['A caption names the whole entire book.', 'A caption lists all the chapters in order.', 'A caption shows the words in ABC order.'], hard: true,
  x: 'Headings go with a section of text. Captions go with a picture.' },
  { q: 'You want to see all the chapters in the book at one glance.', a: 'the table of contents',
  w: ['the glossary', 'a caption', 'a bold word'], hard: true,
  x: 'The table of contents shows the whole book in order on one page.' },
];
SKILLS.push(
  { id: 'ela_text_features', strand: 'comprehension', name: 'Parts of a fact book',
  gen: (lvl = 2) => {
  const pool = lvl === 1 ? C4EB_FEAT.filter(function (f) { return !f.hard; })
  : (lvl === 3 && ri(1, 10) <= 7 ? C4EB_FEAT.filter(function (f) { return f.hard; }) : C4EB_FEAT);
  const e = pick(pool.length ? pool : C4EB_FEAT);
  const ans = e.a;
  const stem = e.q.indexOf('?') === -1 ? e.q + ' Which part of the book helps?' : e.q;
  return {
  prompt: stem, type: 'mc',
  choices: shuffle([ans, e.w[0], e.w[1], e.w[2]]), answer: ans,
  explain: e.x,
  };
  } },
);
/* 6. ela_authors_purpose — Why did they write it? */
const C4EB_P_FACT = 'to teach you facts about real things';
const C4EB_P_FUN = 'to make you smile with a made-up story';
const C4EB_P_SELL = 'to get you to agree and do something';
const C4EB_P_HOW = 'to show you how to make or do something';
const C4EB_PURP = [
  { t: 'Sea otters wrap themselves in seaweed so they do not float away while they sleep.', p: C4EB_P_FACT },
  { t: 'A giraffe\'s tongue is longer than your arm and is dark purple-blue.', p: C4EB_P_FACT },
  { t: 'Thunder is the sound air makes when lightning heats it very fast.', p: C4EB_P_FACT },
  { t: 'Baby elephants stay close to their mothers for years and drink her milk.', p: C4EB_P_FACT },
  { t: 'Buster the beagle put on roller skates and rolled down the hill barking.', p: C4EB_P_FUN },
  { t: 'The talking sandwich hopped off the plate and asked Nia where his pickle went.', p: C4EB_P_FUN },
  { t: 'Grandpa Fox hunted for his glasses all day. They were on his head.', p: C4EB_P_FUN },
  { t: 'The moon got hiccups, and every star bounced right out of the sky.', p: C4EB_P_FUN },
  { t: 'You should vote for pizza on Fridays. It is quick, and more kids will eat lunch.', p: C4EB_P_SELL },
  { t: 'Our school needs a bigger garden. Kids who grow food learn more and can share it.', p: C4EB_P_SELL },
  { t: 'Everyone should walk to school on Wednesdays. It saves gas and you get to talk with friends.', p: C4EB_P_SELL },
  { t: 'You should read this book. The pictures are the best, and you will not put it down.', p: C4EB_P_SELL },
  { t: 'First, fold the paper in half. Next, press the crease flat. Then fold both corners down.', p: C4EB_P_HOW },
  { t: 'Pour the milk into the bowl. Stir until the lumps are gone. Bake for twenty minutes.', p: C4EB_P_HOW },
  { t: 'Tape the two sticks in a cross. Tie string around the middle. Last, glue on the paper.', p: C4EB_P_HOW },
  { t: 'Dig a small hole. Drop in one seed. Cover it with dirt and water it.', p: C4EB_P_HOW },
];
const C4EB_PURP_SUP = [
  { pt: 'Our class should recycle paper.', a: 'Recycling saves trees from being cut down.',
  w: ['Paper comes in many colors.', 'My cousin has a blue backpack.', 'The recycling bin sits next to the classroom door.'] },
  { pt: 'Kids should get more time at recess.', a: 'Running around helps kids focus better in class.',
  w: ['Recess happens right after lunch.', 'The playground has a tall slide and a climbing wall.', 'Some kids bring lunch from home.'] },
  { pt: 'Everyone should wear a helmet when biking.', a: 'A helmet protects your head if you fall.',
  w: ['Helmets come in many colors.', 'Bikes have two wheels, a chain, and handlebars.', 'My bike is painted bright red.'] },
  { pt: 'Our school should plant more trees.', a: 'Trees make shade, so the playground stays cooler.',
  w: ['Trees are covered in rough bark.', 'Some leaves are green in summer.', 'The school building was built a very long time ago.'] },
  { pt: 'You should read a book before bed.', a: 'Reading helps your mind get calm and sleepy.',
  w: ['Books sit in long rows on the library shelf.', 'My lamp has a yellow shade.', 'Some books are very heavy.'] },
  { pt: 'Kids should help wash the dishes.', a: 'Sharing the work means the family finishes faster.',
  w: ['The dirty dishes are stacked up high in the kitchen sink.', 'Soap makes lots of bubbles.', 'Our plates are white and round.'] },
];
SKILLS.push(
  { id: 'ela_authors_purpose', strand: 'comprehension', name: 'Why did they write it?',
  gen: (lvl = 2) => {
  const roll = ri(1, 10);
  const allP = [C4EB_P_FACT, C4EB_P_FUN, C4EB_P_SELL, C4EB_P_HOW];
  if (lvl === 3 && roll <= 5) {
  /* reverse: pick the writing that matches a purpose */
  const target = pick(allP);
  const ans = pick(C4EB_PURP.filter(function (e) { return e.p === target; })).t;
  const wrongs = shuffle(C4EB_PURP.filter(function (e) { return e.p !== target; }));
  const seen = [];
  const picks = [];
  for (let i = 0; i < wrongs.length && picks.length < 3; i++) {
  if (seen.indexOf(wrongs[i].p) === -1) { seen.push(wrongs[i].p); picks.push(wrongs[i].t); }
  }
  return {
  prompt: 'Which sentence did an author write ' + target + '?', type: 'mc',
  choices: shuffle([ans, picks[0], picks[1], picks[2]]), answer: ans,
  explain: 'Match the job to the writing: facts teach, silly stories entertain, steps show how, and "you should" tries to talk you into it.',
  };
  }
  if ((lvl === 3 && roll > 5) || (lvl === 2 && roll <= 4)) {
  const s = pick(C4EB_PURP_SUP);
  const ans = s.a;
  return {
  prompt: 'Someone says: "' + s.pt + '" Which sentence gives a REASON that helps that idea?',
  type: 'mc',
  choices: shuffle([ans, s.w[0], s.w[1], s.w[2]]), answer: ans,
  explain: 'A reason tells WHY the idea is good. The other sentences are just facts that do not help the idea.',
  };
  }
  const e = pick(C4EB_PURP);
  const ans = e.p;
  return {
  prompt: 'Why did the author write this?', body: C4EB_body(e.t), type: 'mc',
  choices: shuffle(allP.slice()), answer: ans,
  explain: ans === C4EB_P_FACT ? 'It gives real facts, so the author wrote it to inform you.'
  : (ans === C4EB_P_FUN ? 'It could not really happen — the author wrote it for fun.'
  : (ans === C4EB_P_HOW ? 'Words like first, next, and then are steps that show you how.'
  : 'Words like "you should" mean the author is trying to talk you into it.')),
  };
  } },
);
/* 7. ela_fluency_phrase — Read it in smooth chunks */
const C4EB_CHUNK = [
  { lv: 1, a: 'My cat / sleeps on / the warm rug.',
  w: ['My / cat sleeps on the / warm rug.', 'My cat sleeps / on the / warm / rug.', 'My cat sleeps on / the / warm rug.'] },
  { lv: 1, a: 'We ran / to the big yellow bus.',
  w: ['We / ran to the / big yellow / bus.', 'We ran to the / big / yellow bus.', 'We ran to / the big / yellow / bus.'] },
  { lv: 1, a: 'The baby bird / hopped out / of the nest.',
  w: ['The / baby bird hopped / out of the / nest.', 'The baby / bird hopped out of / the nest.', 'The baby bird hopped / out / of / the nest.'] },
  { lv: 1, a: 'Dad made pancakes / for our breakfast.',
  w: ['Dad / made / pancakes for our breakfast.', 'Dad made / pancakes for / our / breakfast.', 'Dad made pancakes for / our / breakfast.'] },
  { lv: 2, a: 'The tall trees / swayed / in the cold wind.',
  w: ['The tall / trees swayed in / the cold / wind.', 'The / tall trees swayed / in the / cold wind.', 'The tall trees swayed in the / cold / wind.'] },
  { lv: 2, a: 'My little brother / found / a shiny penny.',
  w: ['My little / brother found a / shiny penny.', 'My / little brother found / a shiny / penny.', 'My little brother found a / shiny / penny.'] },
  { lv: 2, a: 'The soccer team / cheered / for their goalie.',
  w: ['The soccer / team cheered for / their goalie.', 'The / soccer team / cheered for their / goalie.', 'The soccer team cheered for their / goalie.'] },
  { lv: 2, a: 'A row of ducks / waddled / across the road.',
  w: ['A row / of ducks waddled across / the road.', 'A / row of / ducks waddled across the road.', 'A row of / ducks / waddled across / the / road.'] },
  { lv: 3, a: 'After the rain stopped, / we splashed / in the puddles.',
  w: ['After the / rain stopped, we / splashed in the puddles.', 'After / the rain / stopped, we splashed in / the puddles.', 'After the rain / stopped, / we splashed in the / puddles.'] },
  { lv: 3, a: 'When the bell rang, / the class / lined up quietly.',
  w: ['When the / bell rang, the class lined / up quietly.', 'When the bell / rang, / the class lined up / quietly.', 'When / the bell rang, the / class lined up quietly.'] },
  { lv: 3, a: 'Grandma packed / apples, cheese, and bread / for the trip.',
  w: ['Grandma / packed apples, cheese, / and bread for the trip.', 'Grandma packed apples, / cheese, and / bread for / the trip.', 'Grandma packed apples, cheese, and / bread / for the trip.'] },
  { lv: 3, a: 'Before we left the house, / Mom checked / the windows.',
  w: ['Before we / left the house, Mom / checked the windows.', 'Before / we left / the house, Mom checked the / windows.', 'Before we left / the house, Mom checked the / windows.'] },
];
const C4EB_PAUSE = [
  { s: 'After lunch, we walked to the library.', a: 'right after "lunch," where the comma is',
  w: ['right after the word "we"', 'right after the word "to"', 'in the middle of the word "library"'] },
  { s: 'Yes, I would like more soup.', a: 'right after "Yes," where the comma is',
  w: ['right after the word "would"', 'right after the word "more"', 'in the middle of the word "soup"'] },
  { s: 'The wind blew hard. The door slammed shut.', a: 'a full stop after "hard."',
  w: ['a full stop after the word "The"', 'a full stop after the word "door"', 'no stop at all until the very last word'] },
  { s: 'We bought bread, milk, and eggs.', a: 'a tiny rest after "bread," and after "milk,"',
  w: ['a long stop after the word "We"', 'a stop inside the word "eggs"', 'a rest after every single word'] },
  { s: 'Wait! Do you hear that?', a: 'a full stop after "Wait!"',
  w: ['a stop after the word "you"', 'a stop inside the word "hear"', 'no stop anywhere in these two sentences'] },
  { s: 'On Saturday, Grandpa taught me to fish.', a: 'right after "Saturday," where the comma is',
  w: ['right after the word "me"', 'right after the word "to"', 'in the middle of the word "Grandpa"'] },
  { s: 'The cat stretched. Then she curled up.', a: 'a full stop after "stretched."',
  w: ['a stop after the word "The"', 'a stop after the word "she"', 'a stop inside the word "curled"'] },
  { s: 'If it rains, we will stay inside.', a: 'right after "rains," where the comma is',
  w: ['right after the word "we"', 'right after the word "will"', 'in the middle of the word "inside"'] },
];
const C4EB_MARK = [
  { q: 'What does a period tell your voice to do?', a: 'Stop and take a breath.',
  w: ['Keep going with no rest at all.', 'Read the next word much louder.', 'Go back and read the sentence again.'],
  x: 'A period is a full stop. Your voice drops and rests.' },
  { q: 'What does a question mark tell your voice to do?', a: 'Go up at the end, like asking.',
  w: ['Whisper the whole sentence.', 'Read it very slowly and sadly.', 'Read the sentence two times.'],
  x: 'A question mark lifts your voice at the end, the way you sound when you ask something.' },
  { q: 'What does an exclamation point tell your voice to do?', a: 'Read it with strong feeling.',
  w: ['Read it in a flat, sleepy voice.', 'Stop right in the middle.', 'Skip it and read on.'],
  x: 'An exclamation point means big feeling — excited, surprised, or loud.' },
  { q: 'What does a comma tell your voice to do?', a: 'Take a tiny rest, then keep going.',
  w: ['Stop for a long time and breathe.', 'Start the whole sentence over.', 'Read the next part louder.'],
  x: 'A comma is a small pause, much shorter than a period.' },
  { q: 'Which reader sounds smooth?', a: 'Kim reads groups of words together, like talking.',
  w: ['Ben reads one... word... at... a... time.', 'Rosa reads so fast the words smash together.', 'Ty reads every word in a loud, flat shout.'],
  x: 'Smooth reading sounds like talking: words move in groups, at a comfy speed.' },
  { q: 'Why do good readers read in chunks instead of word by word?', a: 'The words make more sense together.',
  w: ['It uses up more time.', 'It makes the book look shorter.', 'It helps you skip hard words.'],
  x: 'Groups of words carry the meaning, so chunking helps you understand what you read.' },
  { q: 'You read a page too fast and missed the meaning. What helps most?', a: 'Read it again a little slower.',
  w: ['Read it even faster next time.', 'Skip that page and move on.', 'Read only the last sentence.'],
  x: 'Rereading at a comfy speed is how readers get both smooth and clear.' },
  { q: 'Which sentence should you read with your voice going UP at the end?', a: 'Are you coming with us?',
  w: ['We went home after the game.', 'The soup is hot.', 'Please close the door.'],
  x: 'Only the question ends with a question mark, so only that one lifts at the end.' },
];
SKILLS.push(
  { id: 'ela_fluency_phrase', strand: 'fluency', name: 'Read it in smooth chunks',
  gen: (lvl = 2) => {
  const roll = ri(1, 10);
  if ((lvl === 1 && roll <= 5) || (lvl === 2 && roll <= 3) || (lvl === 3 && roll <= 2)) {
  const m = pick(C4EB_MARK);
  const ans = m.a;
  return {
  prompt: m.q, type: 'mc',
  choices: shuffle([ans, m.w[0], m.w[1], m.w[2]]), answer: ans,
  explain: m.x,
  };
  }
  if ((lvl === 2 && roll <= 6) || (lvl === 3 && roll <= 5)) {
  const p = pick(C4EB_PAUSE);
  const ans = p.a;
  return {
  prompt: 'Where should your voice rest when you read this out loud?',
  body: C4EB_body(p.s), type: 'mc',
  choices: shuffle([ans, p.w[0], p.w[1], p.w[2]]), answer: ans,
  explain: 'Rest where the punctuation tells you to — never inside a word.',
  };
  }
  const pool = C4EB_CHUNK.filter(function (c) { return c.lv === lvl; });
  const c = pick(pool.length ? pool : C4EB_CHUNK);
  const ans = c.a;
  return {
  prompt: 'Which one shows the smooth chunks a good reader would use? (The / marks show the chunks.)',
  type: 'mc',
  choices: shuffle([ans, c.w[0], c.w[1], c.w[2]]), answer: ans,
  explain: 'Keep words that belong together in one chunk. Never leave a word like "the" all alone.',
  };
  } },
);
/* 8. ela_self_correct — Does that make sense? */
const C4EB_FIX = [
  { s: 'The dog wagged its ___ when we came home.', bad: 'tall', good: 'tail', w: ['tale', 'toll', 'tan'] },
  { s: 'Mom poured milk into my ___ of cereal.', bad: 'bow', good: 'bowl', w: ['blow', 'boat', 'below'] },
  { s: 'I read a ___ about a brave knight.', bad: 'brook', good: 'book', w: ['broke', 'brick', 'boot'] },
  { s: 'The bird built a ___ high in the tree.', bad: 'net', good: 'nest', w: ['neat', 'next', 'note'] },
  { s: 'Please ___ the door quietly behind you.', bad: 'clothes', good: 'close', w: ['cloth', 'clock', 'cloud'] },
  { s: 'She ___ her bike to school every morning.', bad: 'rids', good: 'rides', w: ['reads', 'roads', 'raids'] },
  { s: 'The soup was much too ___ to eat.', bad: 'hat', good: 'hot', w: ['hut', 'hop', 'hit'] },
  { s: 'He stuck a stamp on the ___ for Grandma.', bad: 'latter', good: 'letter', w: ['ladder', 'litter', 'later'] },
  { s: 'The kitten drank all of the ___ in the dish.', bad: 'mile', good: 'milk', w: ['mild', 'mail', 'mill'] },
  { s: 'We sat on a wooden ___ at the park.', bad: 'bunch', good: 'bench', w: ['bunk', 'brunch', 'beach'] },
  { s: 'Turn on the ___ so that we can see.', bad: 'night', good: 'light', w: ['tight', 'sight', 'fight'] },
  { s: 'I brush my ___ before I go to bed.', bad: 'teach', good: 'teeth', w: ['tea', 'beach', 'each'] },
  { s: 'The farmer fed the ___ some fresh hay.', bad: 'hoses', good: 'horses', w: ['houses', 'hopes', 'hoods'] },
  { s: 'She wrote her name with a red ___.', bad: 'pin', good: 'pen', w: ['pan', 'pond', 'pine'] },
];
const C4EB_FIX_Q = [
  { q: 'You read: "The frog hoped into the pond." It sounded strange. What should a good reader do?',
  a: 'Go back and look at that word again.',
  w: ['Skip the whole page.', 'Read it faster so the strange part goes by.', 'Close the book and stop.'],
  x: 'When something sounds off, that is your brain saying: check that word again.' },
  { q: 'Why is it smart to stop when a sentence sounds funny?',
  a: 'A funny sound is a clue that you misread a word.',
  w: ['It means the author made a mistake in the book.', 'It means the book is too easy.', 'It means you should read it louder.'],
  x: 'Good readers listen to themselves and fix words that do not fit.' },
  { q: 'A reader says "horse" but the word is "house." What is the best fix?',
  a: 'Look at the letters again and try the word once more.',
  w: ['Guess a different word that starts with the letter h.', 'Read the next page instead.', 'Ask to read a shorter book.'],
  x: 'Checking the letters, not just the first sound, is how you catch a misread word.' },
  { q: 'When you fix your own mistake while reading, that is called...',
  a: 'self-correcting', w: ['skipping', 'guessing', 'whispering'],
  x: 'Self-correcting means you caught it yourself. Strong readers do it all the time.' },
];
SKILLS.push(
  { id: 'ela_self_correct', strand: 'fluency', name: 'Does that make sense?',
  gen: (lvl = 2) => {
  const roll = ri(1, 10);
  if ((lvl === 2 && roll <= 2) || (lvl === 3 && roll <= 3)) {
  const c = pick(C4EB_FIX_Q);
  const ans = c.a;
  return {
  prompt: c.q, type: 'mc',
  choices: shuffle([ans, c.w[0], c.w[1], c.w[2]]), answer: ans,
  explain: c.x,
  };
  }
  const e = pick(C4EB_FIX.filter(function (f) { return f.bad !== f.good; }));
  const shown = e.s.replace('___', '<b>' + e.bad + '</b>');
  if (lvl === 1 || (lvl === 2 && roll <= 6)) {
  const ans = e.bad;
  const others = C4EB_otherWords(e.s.replace('___', ' '), e.bad, 3, 8);
  return {
  prompt: 'One word does NOT make sense. Which word is it?',
  body: C4EB_body(shown), type: 'mc',
  choices: shuffle([ans, others[0], others[1], others[2]]), answer: ans,
  explain: 'Every other word fits the picture in your head. Only "' + e.bad + '" does not.',
  };
  }
  const ans = e.good;
  return {
  prompt: 'The bold word was misread. Which word should it be?',
  body: C4EB_body(shown), type: 'mc',
  choices: shuffle([ans, e.w[0], e.w[1], e.w[2]]), answer: ans,
  explain: '"' + e.good + '" is the only choice that fits the letters AND makes sense.',
  };
  } },
);

/* ===================================================================
   LEARNING GARDEN — math slice (every name prefixed C4M2_)
   Five new skills on EXISTING strands: place · data · meas · geo · mult
   No new strands. Pure data + generators.
   =================================================================== */

// Four DISTINCT numeric choices as strings. The answer string is built
// once and handed back, so answer === one choice, always.
function C4M2_numChoices(ansNum, poolNums, suffix) {
  const s = suffix || '';
  const nums = [ansNum];
  const bag = shuffle(poolNums || []);
  for (let i = 0; i < bag.length && nums.length < 4; i++) {
    if (bag[i] >= 0 && nums.indexOf(bag[i]) === -1) nums.push(bag[i]);
  }
  let d = 1;
  while (nums.length < 4 && d < 80) {
    if (nums.length < 4 && nums.indexOf(ansNum + d) === -1) nums.push(ansNum + d);
    if (nums.length < 4 && ansNum - d >= 0 && nums.indexOf(ansNum - d) === -1) nums.push(ansNum - d);
    d++;
  }
  const strs = nums.map(n => n + s);
  const ansStr = strs[0];
  return { answer: ansStr, choices: shuffle(strs) };
}

function C4M2_onesStr(n) { return n === 1 ? '1 one' : n + ' ones'; }
function C4M2_tensStr(n) { return n === 1 ? '1 ten' : n + ' tens'; }

// three other entries from a bank
function C4M2_others(arr, keepOut, n) {
  return shuffle(arr.filter(keepOut)).slice(0, n || 3);
}

function C4M2_bankQ(entry) {
  return { prompt: entry[1], type: 'mc', choices: shuffle([entry[2]].concat(entry[3])), answer: entry[2], explain: entry[4] };
}

/* 1) math_explain_strategy — place — "Why does that work?"
   The child reads a worked strategy written out plainly, then picks the
   REASON it works. Every distractor is a made-up rule, never a true fact. */

// [levelTag, prompt, answer, [3 distractors], explain]
const C4M2_STRATEGY_BANK = [
  [1, 'Ivy adds <b>9 + 6</b> by making a ten. She thinks: 9 + 1 = 10, then 10 + 5 = 15. Why did she pull the 1 out first?',
    '9 needs just 1 more to reach 10.',
    ['1 is the easiest number to write.', 'Every make-a-ten problem starts with a 1.', 'She wanted the answer to end in 1.'],
    'Ten is a friendly place to jump from. The 6 still gave everything it had: 1 + 5 = 6.'],
  [1, 'Jonah adds <b>40 + 30</b> and says, "That is just 4 tens plus 3 tens." Why does that work?',
    '4 tens and 3 tens make 7 tens, and 7 tens is 70.',
    ['Zeros add together to make a bigger zero.', 'You may drop the zeros and leave them off.', 'Tens vanish whenever both numbers are even.'],
    'Count the tens: 40, 50, 60, 70. Seven tens is 70.'],
  [1, 'To add <b>25 + 10</b>, Rosa jumps one ten forward: 25 becomes 35. Why does only the tens digit change?',
    'Adding 10 adds one ten and no extra ones.',
    ['The 5 is too small to move.', 'A ones digit can never change.', 'A zero means nothing was really added.'],
    '25 is 2 tens and 5 ones. One more ten makes 3 tens and the same 5 ones, which is 35.'],
  [1, 'Sam breaks <b>36</b> into 30 and 6 before he adds. Why is he allowed to do that?',
    '36 is 30 and 6 put together.',
    ['Any number can be cut in half and back.', 'Numbers get smaller when you split them.', '30 and 6 are nicer numbers than 36.'],
    'Splitting a number into its tens and its ones does not change how much it is.'],
  [1, 'Nina adds <b>7 + 8</b> and says, "I know 7 + 7 = 14, so 7 + 8 = 15." Why is her answer one more?',
    '8 is one more than 7, so the total grows by one.',
    ['Doubles are always one less than the real answer.', 'She borrowed the 1 from the number 15.', 'Two odd numbers always give one extra.'],
    'Start from a double you already know, then nudge it. That is a fast and safe move.'],
  [1, 'Theo solves <b>15 − 9</b> by thinking, "9 + 6 = 15, so 15 − 9 = 6." Why may he use addition?',
    'Subtracting asks what you add to 9 to reach 15.',
    ['Adding and subtracting always give the same answer.', 'You may swap the signs when a problem feels hard.', 'The 6 was hiding inside the 9.'],
    'Every subtraction has a matching addition. Thinking "how far up?" is often the easier road.'],
  [1, 'Ana adds <b>23 + 4</b> and leaves the 2 tens alone. Why do the tens stay the same?',
    'Only ones were added, and 3 + 4 = 7 still fits in the ones place.',
    ['Tens only change on subtraction days.', 'The 2 is stuck because it is written first.', 'One-digit numbers are not strong enough to reach the tens.'],
    '23 + 4 = 27. There were not enough ones to build a brand-new ten, so 2 tens stayed 2 tens.'],
  [1, 'Ellie adds <b>8 + 4</b> by making a ten: 8 + 2 = 10, then 10 + 2 = 12. Why did she split the 4 into 2 and 2?',
    '8 needs 2 more to make ten, and 2 is left over.',
    ['A 4 can only be broken into 2 and 2.', 'Ten is made of two 2s.', 'She liked the number 2 best that day.'],
    'She spent part of the 4 finishing the ten, then added the rest. 2 + 2 = 4, so nothing went missing.'],
  [2, 'For <b>52 − 7</b>, Kai has 5 tens and 2 ones. Two ones are not enough, so he opens one ten into 10 ones: now 4 tens and 12 ones. Then 12 − 7 = 5, so the answer is 45. Why is 4 tens and 12 ones still 52?',
    'The ten he opened turned into those 10 extra ones.',
    ['He added 10 to make the problem easier.', '12 ones are worth the same as 12 tens.', 'Tens and ones may be swapped whenever you like.'],
    '40 + 12 = 52. Nothing was added or lost. The ten just changed clothes so there were enough ones to subtract.'],
  [2, 'Mo adds <b>48 + 9</b> by thinking 48 + 10 = 58, then 58 − 1 = 57. Why does he take 1 back?',
    'He added 10 when he only needed to add 9.',
    ['You always subtract 1 at the end of adding.', 'The 1 came out of the 48.', 'Nine is one more than ten, so he fixes it.'],
    'Jumping a friendly 10 is easy, then you hand back the extra 1. 48 + 9 = 57.'],
  [3, 'For <b>300 − 8</b>, Val opens one of the 3 hundreds into 10 tens, then opens one of those tens into 10 ones. Now she has 2 hundreds, 9 tens, and 10 ones. Then 10 − 8 = 2, so the answer is 292. Why does opening twice not change 300?',
    '200 + 90 + 10 is still 300.',
    ['Zeros are worth nothing, so they may be moved around.', 'Opening makes the number smaller on purpose.', 'Hundreds turn into ones one at a time.'],
    'Trading never changes the amount. It only changes what the amount is made of.'],
  [3, 'Lena adds <b>27 + 35</b> like this: 20 + 30 = 50, then 7 + 5 = 12, then 50 + 12 = 62. Why does she add 50 and 12 at the end?',
    'The tens total and the ones total are both parts of the answer.',
    ['12 is the real answer and 50 is a bonus.', 'The 1 inside the 12 gets thrown away.', 'Every number must be added twice to check it.'],
    'She broke both numbers apart, so she has to put every piece back together: 50 + 12 = 62.'],
];

function C4M2_stratMakeTen(lvl) {
  const a = lvl === 1 ? ri(7, 9) : ri(6, 9);
  const need = 10 - a;
  // keep b at 4 or more so no distractor can accidentally be true
  const rest = Math.max(4 - need, lvl === 1 ? ri(2, 4) : lvl === 2 ? ri(2, 7) : ri(3, 9));
  const b = need + rest, sum = a + b;
  const ans = a + ' needs ' + need + ' more to land right on 10.';
  return {
    prompt: `Leo adds <b>${a} + ${b}</b> by making a ten. He thinks: ${a} + ${need} = 10, then 10 + ${rest} = ${sum}. Why did he pull ${need} out of the ${b}?`,
    type: 'mc',
    choices: shuffle([ans,
      `The number ${b} can only be broken into ${need} and ${rest}.`,
      `Ten is made of ${need} and nothing else.`,
      `He picked ${need} because it is the smallest number he knows.`]),
    answer: ans,
    explain: `${a} + ${need} = 10 is an easy jump, and the rest of the ${b} follows right behind: ${need} + ${rest} = ${b}. So ${a} + ${b} = ${sum}.`,
  };
}

function C4M2_stratBreak(lvl) {
  const t1 = (lvl === 1 ? ri(2, 4) : ri(3, 7)) * 10;
  const t2 = (lvl === 1 ? ri(1, 3) : ri(2, 5)) * 10;
  const o1 = ri(1, 4), o2 = ri(1, 9 - o1);
  const n1 = t1 + o1, n2 = t2 + o2, tSum = t1 + t2, oSum = o1 + o2, sum = n1 + n2;
  const ans = `${t1} and ${o1} together are exactly ${n1}.`;
  return {
    prompt: `Nora adds <b>${n1} + ${n2}</b> by breaking each number into tens and ones: ${t1} + ${t2} = ${tSum}, then ${o1} + ${o2} = ${oSum}, then ${tSum} + ${oSum} = ${sum}. Why is it fair to break ${n1} into ${t1} and ${o1}?`,
    type: 'mc',
    choices: shuffle([ans,
      'Breaking a number makes it smaller and easier to carry.',
      `Every number splits into ${t1} and ${o1}.`,
      `${n1} stops counting once it is split.`]),
    answer: ans,
    explain: `Splitting shows what a number is made of. ${t1} + ${o1} = ${n1}, so no amount is lost — the pieces just get added in a friendlier order.`,
  };
}

function C4M2_stratOpenTen(lvl) {
  if (lvl < 3) {
    const tens = ri(3, 9), whole = tens * 10, sub = ri(2, 9), ansNum = whole - sub;
    const ans = 'The ten he opened became those 10 ones.';
    return {
      prompt: `Sam solves <b>${whole} − ${sub}</b>. There are no ones to take from, so he opens one of the ${tens} tens into 10 ones: now ${tens - 1} tens and 10 ones. Then 10 − ${sub} = ${10 - sub}, so the answer is ${ansNum}. Why is ${tens - 1} tens and 10 ones still ${whole}?`,
      type: 'mc',
      choices: shuffle([ans,
        'He slipped in 10 extra ones to help himself.',
        '10 ones are worth more than 1 ten.',
        'Tens disappear whenever you subtract.']),
      answer: ans,
      explain: `${(tens - 1) * 10} + 10 = ${whole}. Trading a ten for 10 ones changes the shape of the number, never the amount.`,
    };
  }
  const tens = ri(3, 8), ones = ri(1, 4), whole = tens * 10 + ones;
  const sub = ri(ones + 1, 9), ansNum = whole - sub;
  const ans = `${tens - 1} tens and ${ones + 10} ones is the same as ${whole}.`;
  return {
    prompt: `Sam solves <b>${whole} − ${sub}</b>. He has ${C4M2_tensStr(tens)} and ${C4M2_onesStr(ones)}, but ${C4M2_onesStr(ones)} is not enough to take ${sub} away. So he opens one ten: now ${tens - 1} tens and ${ones + 10} ones. Then ${ones + 10} − ${sub} = ${ones + 10 - sub}, so the answer is ${ansNum}. Why is that still fair?`,
    type: 'mc',
    choices: shuffle([ans,
      'Opening a ten quietly adds 10 to the number.',
      'He may change a problem when it feels too hard.',
      'The ones place is allowed to hold any number he wants.']),
    answer: ans,
    explain: `${(tens - 1) * 10} + ${ones + 10} = ${whole}. The ten did not vanish — it turned into 10 ones so there were enough to subtract.`,
  };
}

function C4M2_stratCompensate() {
  const base = ri(3, 7) * 10 + ri(2, 8);
  const add = pick([8, 9]), over = 10 - add, sum = base + add;
  const ans = `He added 10 when he only needed to add ${add}.`;
  return {
    prompt: `Mo adds <b>${base} + ${add}</b> by thinking ${base} + 10 = ${base + 10}, then ${base + 10} − ${over} = ${sum}. Why does he take ${over} back?`,
    type: 'mc',
    choices: shuffle([ans,
      `You always take ${over} back after you add.`,
      `The ${over} was hiding inside ${base}.`,
      `Ten is ${over} less than ${add}.`]),
    answer: ans,
    explain: `10 is ${over} more than ${add}, so the total was ${over} too big. Handing it back lands exactly on ${sum}.`,
  };
}

function C4M2_stratCountTens(lvl) {
  const n = ri(2, 7) * 10 + ri(1, 9);
  const k = lvl === 1 ? 10 : lvl === 2 ? pick([10, 20]) : pick([20, 30, 40]);
  const chain = [];
  for (let s = 0; s <= k / 10; s++) chain.push(n + s * 10);
  const ans = k === 10 ? 'Adding 10 adds one more ten and no extra ones.'
    : 'Adding ' + k + ' adds ' + (k / 10) + ' more tens and no extra ones.';
  return {
    prompt: `Rosa adds <b>${n} + ${k}</b> by counting on by tens: ${chain.join(' → ')}. Why does only the tens digit change?`,
    type: 'mc',
    choices: shuffle([ans,
      'The ones digit is too small to change.',
      'A zero on the end means nothing is really added.',
      'Ones digits never change when you add.']),
    answer: ans,
    explain: `${n} has ${C4M2_tensStr(Math.floor(n / 10))} and ${C4M2_onesStr(n % 10)}. ${n} + ${k} = ${n + k} — same ones, more tens.`,
  };
}

SKILLS.push({
  id: 'math_explain_strategy', strand: 'place', name: 'Why does that work?',
  gen: (lvl = 2) => {
    const L = lvl === 1 ? 1 : lvl === 3 ? 3 : 2;
    const bank = C4M2_STRATEGY_BANK.filter(e => L === 1 ? e[0] === 1 : L === 2 ? e[0] <= 2 : e[0] >= 2);
    const modes = L === 1
      ? [C4M2_stratMakeTen, C4M2_stratBreak, C4M2_stratCountTens]
      : L === 2
        ? [C4M2_stratMakeTen, C4M2_stratBreak, C4M2_stratCountTens, C4M2_stratOpenTen]
        : [C4M2_stratOpenTen, C4M2_stratCompensate, C4M2_stratBreak, C4M2_stratCountTens, C4M2_stratMakeTen];
    if (bank.length && ri(1, 10) <= 4) return C4M2_bankQ(pick(bank));
    return pick(modes)(L);
  },
});

/* 2) data_draw_graph — data — "Build the graph"
   SINGLE-UNIT scale only: 1 square = 1 vote, 1 picture = 1 vote.
   Every set has FOUR categories with FOUR different counts, so "tallest"
   and "shortest" always have exactly one right answer. */

// { lv, title, one (singular unit), unit (plural), items: [emoji, name, count] }
const C4M2_DATA_SETS = [
  { lv: 1, title: 'Favorite fruit in Room 12', one: 'vote', unit: 'votes', items: [['🍎', 'apples', 6], ['🍌', 'bananas', 4], ['🍇', 'grapes', 2], ['🍓', 'strawberries', 3]] },
  { lv: 1, title: 'Pets at home', one: 'child', unit: 'children', items: [['🐕', 'dogs', 5], ['🐈', 'cats', 6], ['🐟', 'fish', 2], ['🐰', 'rabbits', 1]] },
  { lv: 1, title: 'How we get to school', one: 'child', unit: 'children', items: [['🚌', 'bus', 6], ['🚗', 'car', 3], ['🚲', 'bike', 2], ['🚶', 'walking', 4]] },
  { lv: 1, title: 'Bugs we found on the fence', one: 'bug', unit: 'bugs', items: [['🐞', 'ladybugs', 4], ['🦋', 'butterflies', 2], ['🐜', 'ants', 6], ['🐝', 'bees', 1]] },
  { lv: 1, title: 'Weather days this month', one: 'day', unit: 'days', items: [['☀️', 'sunny', 4], ['🌧️', 'rainy', 3], ['☁️', 'cloudy', 5], ['❄️', 'snowy', 1]] },
  { lv: 1, title: 'Snack picks', one: 'vote', unit: 'votes', items: [['🍪', 'cookies', 5], ['🍎', 'apples', 2], ['🥕', 'carrots', 3], ['🧀', 'cheese', 6]] },
  { lv: 1, title: 'Recess picks', one: 'vote', unit: 'votes', items: [['⚽', 'soccer', 6], ['🏀', 'basketball', 4], ['🪁', 'kites', 1], ['🛝', 'the slide', 5]] },
  { lv: 1, title: 'Flowers in the garden bed', one: 'flower', unit: 'flowers', items: [['🌻', 'sunflowers', 3], ['🌷', 'tulips', 5], ['🌹', 'roses', 2], ['🌼', 'daisies', 6]] },
  { lv: 2, title: 'Favorite color vote', one: 'vote', unit: 'votes', items: [['🟥', 'red', 7], ['🟦', 'blue', 5], ['🟩', 'green', 3], ['🟨', 'yellow', 2]] },
  { lv: 2, title: 'Books our class read', one: 'book', unit: 'books', items: [['🦖', 'dinosaur books', 8], ['🚀', 'space books', 5], ['🐴', 'horse books', 4], ['🍳', 'cooking books', 2]] },
  { lv: 2, title: 'Lunch choices today', one: 'child', unit: 'children', items: [['🍕', 'pizza', 8], ['🌮', 'tacos', 3], ['🥪', 'sandwiches', 6], ['🍜', 'noodles', 4]] },
  { lv: 2, title: 'After-school clubs', one: 'child', unit: 'children', items: [['⚽', 'soccer club', 6], ['🎵', 'music club', 8], ['🎨', 'art club', 3], ['🌱', 'garden club', 5]] },
  { lv: 3, title: 'Seeds that sprouted', one: 'seed', unit: 'seeds', items: [['🌻', 'sunflower', 9], ['🥕', 'carrot', 6], ['🌽', 'corn', 10], ['🫘', 'bean', 4]] },
  { lv: 3, title: 'Books read each day', one: 'book', unit: 'books', items: [['📕', 'Monday', 7], ['📗', 'Tuesday', 10], ['📘', 'Wednesday', 5], ['📙', 'Thursday', 9]] },
  { lv: 3, title: 'Vote for the class pet', one: 'vote', unit: 'votes', items: [['🐢', 'turtle', 9], ['🐹', 'hamster', 10], ['🐟', 'fish', 6], ['🐰', 'rabbit', 4]] },
  { lv: 3, title: 'Fruit picked at the farm', one: 'basket', unit: 'baskets', items: [['🍎', 'apples', 10], ['🍐', 'pears', 7], ['🍑', 'peaches', 5], ['🫐', 'blueberries', 9]] },
];

// "1 vote" / "4 votes" — never "1 votes"
function C4M2_amt(n, set) { return n + ' ' + (n === 1 ? set.one : set.unit); }
function C4M2_sqStrTall(n) { return n === 1 ? '1 square' : n + ' squares'; }

function C4M2_tableBody(set) {
  const rows = set.items.map(it =>
    `<div style="font-size:20px;font-weight:800;line-height:1.8">${it[0]} ${it[1]} — ${C4M2_amt(it[2], set)}</div>`).join('');
  return `<div style="text-align:left;display:inline-block"><div style="font-weight:900;font-size:18px;margin-bottom:6px">${set.title}</div>${rows}</div>`;
}

function C4M2_picBody(set) {
  const rows = set.items.map(it => {
    let pics = '';
    for (let i = 0; i < it[2]; i++) pics += it[0];
    return `<div style="font-size:18px;font-weight:800;line-height:1.9"><span style="display:inline-block;min-width:9ch">${it[1]}</span> ${pics}</div>`;
  }).join('');
  return `<div style="text-align:left;display:inline-block;overflow-x:auto"><div style="font-weight:900;font-size:18px;margin-bottom:6px">${set.title} (each picture = 1 ${set.one})</div>${rows}</div>`;
}

function C4M2_listString(items) {
  return items.map(it => `${it[1]} ${it[2]}`).join(', ');
}

SKILLS.push({
  id: 'data_draw_graph', strand: 'data', name: 'Build the graph',
  gen: (lvl = 2) => {
    const L = lvl === 1 ? 1 : lvl === 3 ? 3 : 2;
    const pool = C4M2_DATA_SETS.filter(s => L === 1 ? s.lv === 1 : L === 2 ? s.lv <= 2 : s.lv >= 2);
    const set = pick(pool.length ? pool : C4M2_DATA_SETS);
    const items = set.items;
    const counts = items.map(it => it[2]);
    const sorted = items.slice().sort((a, b) => b[2] - a[2]);
    const top = sorted[0], low = sorted[sorted.length - 1];
    const modes = L === 1 ? ['bar', 'tallest', 'shortest', 'pics']
      : L === 2 ? ['bar', 'tallest', 'shortest', 'pics', 'match', 'fix']
        : ['match', 'diff', 'fix', 'both', 'bar'];
    const mode = pick(modes);

    if (mode === 'bar') {
      const it = pick(items);
      const nc = C4M2_numChoices(it[2], counts.filter(c => c !== it[2]), '');
      return {
        prompt: `In a bar graph where <b>1 square = 1 ${set.one}</b>, how many squares tall should the <b>${it[1]}</b> bar be?`,
        body: C4M2_tableBody(set), type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `${it[1]} got ${C4M2_amt(it[2], set)}, and each square stands for just 1, so the bar is ${C4M2_sqStrTall(it[2])} tall.`,
      };
    }
    if (mode === 'tallest' || mode === 'shortest') {
      const want = mode === 'tallest' ? top : low;
      const ans = `${want[0]} ${want[1]}`;
      return {
        prompt: `Which bar will be the <b>${mode === 'tallest' ? 'tallest' : 'shortest'}</b> on the graph?`,
        body: C4M2_tableBody(set), type: 'mc',
        choices: shuffle(items.map(it => `${it[0]} ${it[1]}`)), answer: ans,
        explain: `${want[1]} has ${C4M2_amt(want[2], set)} — the ${mode === 'tallest' ? 'most' : 'fewest'} of the four — so that bar is the ${mode === 'tallest' ? 'tallest' : 'shortest'}.`,
      };
    }
    if (mode === 'pics') {
      const it = pick(items);
      const nc = C4M2_numChoices(it[2], counts.filter(c => c !== it[2]), '');
      return {
        prompt: `You are drawing a picture graph. Each ${it[0]} stands for <b>1 ${set.one}</b>. How many ${it[0]} pictures should you draw in the <b>${it[1]}</b> row?`,
        body: C4M2_tableBody(set), type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `One picture for each one: ${C4M2_amt(it[2], set)} means ${it[2] === 1 ? '1 picture' : it[2] + ' pictures'}. No counting by twos here!`,
      };
    }
    if (mode === 'match') {
      const ans = C4M2_listString(items);
      // swap two COUNTS (not two rows) so the wrong graph is truly wrong
      const swap = items.map((it, i) => i === 0 ? [it[0], it[1], items[1][2]] : i === 1 ? [it[0], it[1], items[0][2]] : it);
      const bump = items.map((it, i) => i === 2 ? [it[0], it[1], it[2] + 2] : it);
      const drop = items.map((it, i) => i === 0 ? [it[0], it[1], it[2] - 1] : it);
      return {
        prompt: 'Which graph was built correctly from this data?',
        body: C4M2_picBody(set), type: 'mc',
        choices: shuffle([ans, C4M2_listString(swap), C4M2_listString(bump), C4M2_listString(drop)]),
        answer: ans,
        explain: `Count each row one picture at a time. The bars must match exactly: ${ans}.`,
      };
    }
    if (mode === 'fix') {
      const it = pick(items);
      const over = ri(2, 3);
      const nc = C4M2_numChoices(it[2], [it[2] + over, it[2] + 1, it[2] - 1], '');
      return {
        prompt: `Ken drew the <b>${it[1]}</b> bar ${over} squares too tall. He drew ${it[2] + over} squares. How tall should it really be?`,
        body: C4M2_tableBody(set), type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `The ${it[1]} row shows ${C4M2_amt(it[2], set)}, so the bar needs ${C4M2_sqStrTall(it[2])}. ${it[2] + over} − ${over} = ${it[2]}.`,
      };
    }
    if (mode === 'diff') {
      const a = top, b = low, d = a[2] - b[2];
      const nc = C4M2_numChoices(d, [a[2], b[2], a[2] + b[2]], '');
      return {
        prompt: `How many squares <b>taller</b> is the ${a[1]} bar than the ${b[1]} bar?`,
        body: C4M2_tableBody(set), type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `${a[2]} − ${b[2]} = ${d}. Comparing bars is just subtracting the two heights.`,
      };
    }
    const a = sorted[0], b = sorted[1], s = a[2] + b[2];
    const nc = C4M2_numChoices(s, [a[2], b[2], s - 1], '');
    return {
      prompt: `If you put the ${a[1]} bar and the ${b[1]} bar together into <b>one</b> bar, how many squares tall would it be?`,
      body: C4M2_tableBody(set), type: 'mc', choices: nc.choices, answer: nc.answer,
      explain: `${a[2]} + ${b[2]} = ${s}. Joining two bars means adding their heights.`,
    };
  },
});

/* 3) meas_generate_data — meas — "Measure and record"
   Every length below is a real, checkable size for that object. */

// [emoji (may be empty), name, length in cm]
const C4M2_OBJECTS = [
  ['📎', 'paper clip', 3],
  ['', 'eraser', 5],
  ['', 'sticky note', 7],
  ['🍃', 'leaf', 8],
  ['🖍️', 'crayon', 9],
  ['', 'glue stick', 10],
  ['', 'craft stick', 11],
  ['', 'marker', 12],
  ['✂️', 'pair of scissors', 13],
  ['🪶', 'feather', 14],
  ['', 'postcard', 15],
  ['🥄', 'spoon', 17],
  ['🪥', 'toothbrush', 18],
  ['✏️', 'pencil', 19],
  ['👟', 'sneaker', 20],
  ['', 'drinking straw', 21],
  ['', 'pencil box', 22],
  ['', 'water bottle', 24],
  ['📓', 'notebook', 26],
  ['📏', 'ruler', 30],
  ['🎒', 'backpack', 40],
];

function C4M2_rulerBody(start, end, emoji) {
  const top = [], bar = [];
  for (let i = 0; i <= end + 1; i++) {
    top.push(`<span style="display:inline-block;width:24px;text-align:center">${i}</span>`);
    bar.push(`<span style="display:inline-block;width:24px;text-align:center">${(i >= start && i <= end) ? '━' : '&nbsp;'}</span>`);
  }
  return `<div style="overflow-x:auto;white-space:nowrap;text-align:left">
    <div style="font-size:34px;text-align:center">${emoji}</div>
    <div style="font-family:monospace;font-size:16px;font-weight:800">${bar.join('')}</div>
    <div style="font-family:monospace;font-size:13px;font-weight:800;opacity:.75">${top.join('')}</div>
    <div style="font-size:13px;font-weight:800;opacity:.75;text-align:center">centimeters</div>
  </div>`;
}

SKILLS.push({
  id: 'meas_generate_data', strand: 'meas', name: 'Measure and record',
  gen: (lvl = 2) => {
    const L = lvl === 1 ? 1 : lvl === 3 ? 3 : 2;
    const short = C4M2_OBJECTS.filter(o => o[2] <= 20);
    const rulerOK = C4M2_OBJECTS.filter(o => o[2] <= 26);
    const modes = L === 1 ? ['read', 'which', 'record']
      : L === 2 ? ['read', 'offset', 'which', 'record', 'longest']
        : ['offset', 'compare', 'units', 'order', 'which'];
    const mode = pick(modes);

    if (mode === 'read') {
      const o = pick(L === 1 ? short : rulerOK);
      const ans = o[2] + ' cm';
      return {
        prompt: `Mia lines the ${o[1]} up on a centimeter ruler. The left end sits on 0 and the right end sits on ${o[2]}. What should she write down?`,
        body: C4M2_rulerBody(0, o[2], o[0]), type: 'mc',
        choices: shuffle([ans, o[2] + ' in', (o[2] + 1) + ' cm', Math.max(1, o[2] - 2) + ' cm']),
        answer: ans,
        explain: `Start at 0 and read the mark at the far end: ${o[2]}. The ruler counts centimeters, so she records ${o[2]} cm.`,
      };
    }

    if (mode === 'offset') {
      const o = pick(rulerOK.filter(x => x[2] >= 7));
      const start = L === 3 ? ri(2, 5) : ri(1, 3);
      const end = start + o[2];
      const ans = o[2] + ' cm';
      return {
        prompt: `Oops — the ${o[1]} did not start at 0. Its left end is on the ${start} mark and its right end is on the ${end} mark. How long is it?`,
        body: C4M2_rulerBody(start, end, o[0]), type: 'mc',
        choices: shuffle([ans, end + ' cm', start + ' cm', (end + start) + ' cm']),
        answer: ans,
        explain: `Count the marks it actually covers: ${end} − ${start} = ${o[2]}. The last mark alone is not the length.`,
      };
    }

    if (mode === 'which') {
      const gap = L === 3 ? 5 : L === 2 ? 6 : 8;
      const o = pick(C4M2_OBJECTS);
      const far = C4M2_OBJECTS.filter(x => Math.abs(x[2] - o[2]) >= gap);
      if (far.length >= 3) {
        const others = shuffle(far).slice(0, 3).map(x => x[1]);
        return {
          prompt: `Which one of these is <b>about ${o[2]} cm</b> long?`,
          type: 'mc', choices: shuffle([o[1]].concat(others)), answer: o[1],
          explain: `A ${o[1]} measures about ${o[2]} cm. Picturing a real object helps you check if a number makes sense.`,
        };
      }
    }

    if (mode === 'record' || mode === 'longest') {
      const four = shuffle(C4M2_OBJECTS.filter(x => x[2] <= 30)).slice(0, 4);
      const rows = four.map(x => `<div style="font-size:19px;font-weight:800;line-height:1.8">${x[0]} ${x[1]} — ${x[2]} cm</div>`).join('');
      const body = `<div style="text-align:left;display:inline-block"><div style="font-weight:900;margin-bottom:6px">Ana's measuring notes</div>${rows}</div>`;
      if (mode === 'longest') {
        const srt = four.slice().sort((a, b) => b[2] - a[2]);
        const isLong = ri(0, 1) === 0;
        const want = isLong ? srt[0] : srt[3];
        return {
          prompt: `Ana's chart has a row for the <b>${isLong ? 'longest' : 'shortest'}</b> thing she measured. Which name belongs there?`,
          body: body, type: 'mc',
          choices: shuffle(four.map(x => x[1])), answer: want[1],
          explain: `${want[1]} is ${want[2]} cm — the ${isLong ? 'biggest' : 'smallest'} number in her notes.`,
        };
      }
      const o = pick(four);
      const nc = C4M2_numChoices(o[2], four.filter(x => x[1] !== o[1]).map(x => x[2]), ' cm');
      return {
        prompt: `Ana is copying her notes onto a clean chart. Which length belongs on the <b>${o[1]}</b> line?`,
        body: body, type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `Her notes say the ${o[1]} measured ${o[2]} cm. Recording means copying the number you really measured.`,
      };
    }

    if (mode === 'compare') {
      const two = shuffle(C4M2_OBJECTS).slice(0, 2).sort((a, b) => b[2] - a[2]);
      const d = two[0][2] - two[1][2];
      const nc = C4M2_numChoices(d, [two[0][2], two[1][2], two[0][2] + two[1][2]], ' cm');
      return {
        prompt: `The ${two[0][1]} measured ${two[0][2]} cm and the ${two[1][1]} measured ${two[1][2]} cm. How much <b>longer</b> is the ${two[0][1]}?`,
        type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `${two[0][2]} − ${two[1][2]} = ${d} cm. Comparing two lengths is a subtraction job.`,
      };
    }

    if (mode === 'order') {
      const three = shuffle(C4M2_OBJECTS).slice(0, 3);
      const up = three.slice().sort((a, b) => a[2] - b[2]);
      const ans = up.map(x => x[1]).join(' → ');
      const down = up.slice().reverse().map(x => x[1]).join(' → ');
      const mix1 = [up[1], up[0], up[2]].map(x => x[1]).join(' → ');
      const mix2 = [up[0], up[2], up[1]].map(x => x[1]).join(' → ');
      return {
        prompt: 'Ana lists her measurements from <b>shortest to longest</b>. Which list is right?',
        body: `<div style="text-align:left;display:inline-block">${three.map(x => `<div style="font-size:19px;font-weight:800;line-height:1.8">${x[0]} ${x[1]} — ${x[2]} cm</div>`).join('')}</div>`,
        type: 'mc', choices: shuffle([ans, down, mix1, mix2]), answer: ans,
        explain: `Smallest number first: ${up.map(x => x[2]).join(' cm, ')} cm.`,
      };
    }

    const o = pick(short);
    const ans = 'the centimeter number';
    return {
      prompt: `Ana measures the same ${o[1]} twice — once in centimeters, once in inches. Which number will be <b>bigger</b>?`,
      type: 'mc',
      choices: shuffle([ans, 'the inch number', 'both numbers will be the same', 'neither — you may only measure once']),
      answer: ans,
      explain: 'A centimeter is a small step, so it takes MORE of them to cover the object. An inch is a bigger step, so you need fewer.',
    };
  },
});

/* 4) geo_draw_attributes — geo — "Draw it from clues"
   Every count string is built ONCE by a helper, then reused as both the
   answer and a pool member, so pluralization can never drift. */

function C4M2_sideStr(n) { return n === 1 ? '1 side' : n + ' sides'; }
function C4M2_cornerStr(n) { return n === 1 ? '1 corner' : n + ' corners'; }
function C4M2_faceStr(n) { return n === 1 ? '1 flat face' : n + ' flat faces'; }
function C4M2_sqStr(n) { return n === 0 ? 'no square corners' : (n === 1 ? '1 square corner' : n + ' square corners'); }

// [name, sides, corners, squareCorners, clue, why]
const C4M2_FLAT = [
  ['triangle', 3, 3, 0, 'I am flat. I have 3 straight sides and 3 corners.', 'A triangle always has 3 sides and 3 corners, no matter how stretched it looks.'],
  ['square', 4, 4, 4, 'I am flat. I have 4 straight sides that are ALL the same length, and all 4 of my corners are square corners.', 'A square needs both things: 4 equal sides AND 4 square corners.'],
  ['rectangle', 4, 4, 4, 'I am flat. I have 4 straight sides and 4 square corners, with two long sides and two short sides.', 'A rectangle has 4 square corners, but its long sides and short sides are different lengths.'],
  ['rhombus', 4, 4, 0, 'I am flat. My 4 straight sides are all the same length, but none of my corners are square corners.', 'A rhombus leans over like a kite diamond — equal sides, tilted corners.'],
  ['pentagon', 5, 5, 0, 'I am flat. I have 5 straight sides and 5 corners.', 'Penta means five, so a pentagon has 5 sides and 5 corners.'],
  ['hexagon', 6, 6, 0, 'I am flat. I have 6 straight sides and 6 corners, like one cell in a honeycomb.', 'Hexa means six. Bees build hexagons!'],
  ['octagon', 8, 8, 0, 'I am flat. I have 8 straight sides and 8 corners, like a stop sign.', 'Octa means eight, the same eight as an octopus.'],
  ['circle', 0, 0, 0, 'I am flat and round. I have no straight sides and no corners at all.', 'A circle is one smooth curve — nowhere for a corner to hide.'],
];

// [name, flat faces, corners, rolls, clue, why]
const C4M2_SOLIDS = [
  ['cube', 6, 8, false, 'I am a solid. I have 6 flat faces, and every single face is a square.', 'A cube is a box where all 6 faces are matching squares, like a number cube.'],
  ['rectangular prism', 6, 8, false, 'I am a solid shaped like a cereal box. My 6 flat faces are rectangles and they are not all the same size.', 'A rectangular prism is box-shaped, but its faces are rectangles instead of matching squares.'],
  ['sphere', 0, 0, true, 'I am a solid that rolls in every direction, and I have no flat faces at all.', 'A sphere is round the whole way around, like a ball.'],
  ['cylinder', 2, 0, true, 'I am a solid like a soup can. I roll on my side, and my 2 flat faces are circles.', 'A cylinder has a circle on the top and a circle on the bottom.'],
  ['cone', 1, 1, true, 'I am a solid with 1 flat face shaped like a circle and 1 sharp point on top.', 'A cone has one circle face and one point, like a party hat.'],
  ['square pyramid', 5, 5, false, 'I am a solid with 5 flat faces — a square on the bottom and 4 triangles that meet at a point.', 'Count the pyramid faces: 1 square plus 4 triangles makes 5.'],
];

// [base shape, extra sides, target shape]
const C4M2_SIDE_STEPS = [
  ['triangle', 2, 'pentagon'], ['triangle', 3, 'hexagon'], ['triangle', 5, 'octagon'],
  ['square', 2, 'hexagon'], ['square', 4, 'octagon'], ['square', 1, 'pentagon'],
  ['pentagon', 1, 'hexagon'], ['pentagon', 3, 'octagon'], ['hexagon', 2, 'octagon'],
];

// [question, answer, [3 distractors], explain]  — distractors hand-picked so
// nothing else can satisfy the clue.
const C4M2_GEO_RIDDLES = [
  ['Which flat shape has 4 sides that are all the same length but <b>no</b> square corners?', 'rhombus', ['square', 'rectangle', 'triangle'], 'A square has equal sides too, but its corners ARE square corners — so the answer is the rhombus.'],
  ['Which flat shape has 4 square corners <b>and</b> 4 sides that are all the same length?', 'square', ['rectangle', 'rhombus', 'hexagon'], 'A rectangle has the square corners but not equal sides. A rhombus has equal sides but not square corners.'],
  ['Which flat shape has more sides than a pentagon but fewer sides than an octagon?', 'hexagon', ['square', 'triangle', 'circle'], 'Pentagon 5, hexagon 6, octagon 8. Only 6 fits in between.'],
  ['Which flat shape can never have a square corner, because it has no corners at all?', 'circle', ['triangle', 'square', 'octagon'], 'A circle is one smooth curve, so it has zero corners of any kind.'],
  ['Which solid has 6 flat faces that are all squares?', 'cube', ['sphere', 'cone', 'cylinder'], 'A cube is the box whose faces all match — 6 equal squares.'],
  ['Which solid rolls and has exactly 1 flat face?', 'cone', ['sphere', 'cube', 'rectangular prism'], 'A cone rolls around its point and rests on one circle face.'],
  ['Which solid has no flat faces and no corners?', 'sphere', ['cube', 'cone', 'square pyramid'], 'A sphere is round everywhere — nothing flat, nothing pointy.'],
  ['Which solid rolls on its side and has 2 flat faces shaped like circles?', 'cylinder', ['sphere', 'cone', 'cube'], 'A cylinder is can-shaped: a circle on top, a circle on the bottom.'],
];

SKILLS.push({
  id: 'geo_draw_attributes', strand: 'geo', name: 'Draw it from clues',
  gen: (lvl = 2) => {
    const L = lvl === 1 ? 1 : lvl === 3 ? 3 : 2;
    const modes = L === 1 ? ['flatClue', 'flatSides', 'flatCorners', 'flatSquare', 'solidClue']
      : L === 2 ? ['flatClue', 'flatSides', 'flatCorners', 'flatSquare', 'solidClue', 'solidFaces']
        : ['riddle', 'sideStep', 'solidFaceCount', 'flatSquare', 'solidClue', 'flatClue'];
    const mode = pick(modes);

    if (mode === 'flatClue') {
      const s = pick(L === 1 ? C4M2_FLAT.filter(f => f[1] !== 4 || f[0] === 'square') : C4M2_FLAT);
      const others = C4M2_others(C4M2_FLAT, f => f[0] !== s[0], 3).map(f => f[0]);
      return {
        prompt: `Read the clue, then draw it in your head: "${s[4]}" What shape am I?`,
        type: 'mc', choices: shuffle([s[0]].concat(others)), answer: s[0], explain: s[5],
      };
    }

    if (mode === 'flatSides') {
      const s = pick(C4M2_FLAT);
      const ans = C4M2_sideStr(s[1]);
      const pool = [];
      for (let i = 0; i < C4M2_FLAT.length; i++) {
        const v = C4M2_sideStr(C4M2_FLAT[i][1]);
        if (v !== ans && pool.indexOf(v) === -1) pool.push(v);
      }
      return {
        prompt: `How many <b>straight sides</b> does a ${s[0]} have?`,
        type: 'mc', choices: shuffle([ans].concat(shuffle(pool).slice(0, 3))), answer: ans, explain: s[5],
      };
    }

    if (mode === 'flatCorners') {
      const s = pick(C4M2_FLAT);
      const ans = C4M2_cornerStr(s[2]);
      const pool = [];
      for (let i = 0; i < C4M2_FLAT.length; i++) {
        const v = C4M2_cornerStr(C4M2_FLAT[i][2]);
        if (v !== ans && pool.indexOf(v) === -1) pool.push(v);
      }
      return {
        prompt: `How many <b>corners</b> does a ${s[0]} have?`,
        type: 'mc', choices: shuffle([ans].concat(shuffle(pool).slice(0, 3))), answer: ans,
        explain: `${s[5]} A flat shape has the same number of corners as sides.`,
      };
    }

    if (mode === 'flatSquare') {
      const s = pick(C4M2_FLAT);
      const ans = C4M2_sqStr(s[3]);
      const pool = [];
      const opts = [0, 1, 2, 3, 4, 6];
      for (let i = 0; i < opts.length; i++) {
        const v = C4M2_sqStr(opts[i]);
        if (v !== ans && pool.indexOf(v) === -1) pool.push(v);
      }
      return {
        prompt: `How many <b>square corners</b> (corners like the corner of a book) does a ${s[0]} have?`,
        type: 'mc', choices: shuffle([ans].concat(shuffle(pool).slice(0, 3))), answer: ans, explain: s[5],
      };
    }

    if (mode === 'solidClue') {
      const easy = ['cube', 'sphere', 'cylinder', 'cone'];
      const s = pick(L === 1 ? C4M2_SOLIDS.filter(f => easy.indexOf(f[0]) > -1) : C4M2_SOLIDS);
      const others = C4M2_others(C4M2_SOLIDS, f => f[0] !== s[0], 3).map(f => f[0]);
      return {
        prompt: `Read the clue and picture the solid: "${s[4]}" What solid am I?`,
        type: 'mc', choices: shuffle([s[0]].concat(others)), answer: s[0], explain: s[5],
      };
    }

    if (mode === 'solidFaces') {
      const s = pick(C4M2_SOLIDS);
      const ans = C4M2_faceStr(s[1]);
      const pool = [];
      const opts = [0, 1, 2, 4, 5, 6];
      for (let i = 0; i < opts.length; i++) {
        const v = C4M2_faceStr(opts[i]);
        if (v !== ans && pool.indexOf(v) === -1) pool.push(v);
      }
      return {
        prompt: `How many <b>flat faces</b> does a ${s[0]} have?`,
        type: 'mc', choices: shuffle([ans].concat(shuffle(pool).slice(0, 3))), answer: ans, explain: s[5],
      };
    }

    if (mode === 'solidFaceCount') {
      // only counts owned by exactly ONE solid (0, 1, 2, 5) — never 6
      const s = pick(C4M2_SOLIDS.filter(f => f[1] !== 6));
      const label = C4M2_faceStr(s[1]);
      const others = C4M2_others(C4M2_SOLIDS, f => f[0] !== s[0] && f[1] !== s[1], 3).map(f => f[0]);
      return {
        prompt: `Kai wants to draw a solid with exactly <b>${label}</b>. Which solid should he draw?`,
        type: 'mc', choices: shuffle([s[0]].concat(others)), answer: s[0], explain: s[5],
      };
    }

    if (mode === 'sideStep') {
      const step = pick(C4M2_SIDE_STEPS);
      const target = C4M2_FLAT.filter(f => f[0] === step[2])[0];
      const base = C4M2_FLAT.filter(f => f[0] === step[0])[0];
      const others = C4M2_others(C4M2_FLAT, f => f[0] !== target[0] && f[1] !== target[1], 3).map(f => f[0]);
      return {
        prompt: `Ben drew a flat shape with <b>${step[1]} more ${step[1] === 1 ? 'side' : 'sides'}</b> than a ${step[0]}. What did he draw?`,
        type: 'mc', choices: shuffle([target[0]].concat(others)), answer: target[0],
        explain: `A ${base[0]} has ${C4M2_sideStr(base[1])}. ${base[1]} + ${step[1]} = ${target[1]}, and ${C4M2_sideStr(target[1])} makes ${target[0] === 'octagon' ? 'an' : 'a'} ${target[0]}.`,
      };
    }

    const r = pick(C4M2_GEO_RIDDLES);
    return { prompt: r[0], type: 'mc', choices: shuffle([r[1]].concat(r[2])), answer: r[1], explain: r[3] };
  },
});

/* 5) mult_even_addends — mult — "Even = two equal teams"
   Every prompt names the total AND says the groups must be the same size,
   and no distractor shows two equal groups that also hit that total. */

const C4M2_THINGS = [
  ['🍪', 'cookies'], ['🖍️', 'crayons'], ['🧦', 'socks'], ['🎈', 'balloons'],
  ['🍎', 'apples'], ['📚', 'books'], ['🐟', 'fish'], ['🌻', 'sunflowers'],
  ['🧩', 'puzzle pieces'], ['✏️', 'pencils'], ['🥕', 'carrots'], ['🖌️', 'paintbrushes'],
  ['🐞', 'ladybugs'], ['⚽', 'soccer balls'], ['🪁', 'kites'], ['🍓', 'strawberries'],
];
const C4M2_KIDS = ['Maya', 'Theo', 'Ivy', 'Jonah', 'Rosa', 'Kai', 'Ellie', 'Sam', 'Nina', 'Leo', 'Ana', 'Mo'];

function C4M2_unequalPairs(n, h, count) {
  const starts = [];
  for (let a = 1; a < h; a++) starts.push(a);
  return shuffle(starts).slice(0, count).map(a => a + ' + ' + (n - a));
}

SKILLS.push({
  id: 'mult_even_addends', strand: 'mult', name: 'Even = two equal teams',
  gen: (lvl = 2) => {
    const L = lvl === 1 ? 1 : lvl === 3 ? 3 : 2;
    const thing = pick(C4M2_THINGS), kid = pick(C4M2_KIDS);
    const emoji = thing[0], noun = thing[1];
    const modes = L === 1 ? ['split', 'blank', 'split']
      : L === 2 ? ['split', 'blank', 'double', 'odd']
        : ['odd', 'double', 'share', 'whichEven', 'oddOneOut'];
    const mode = pick(modes);

    if (mode === 'split') {
      const n = L === 1 ? pick([8, 10, 12]) : pick([8, 10, 12, 14, 16, 18, 20]);
      const h = n / 2;
      const ans = h + ' + ' + h;
      return {
        prompt: `${kid} has <b>${n}</b> ${noun} ${emoji}. Which sum makes <b>${n}</b> using <b>two groups exactly the same size</b>?`,
        type: 'mc', choices: shuffle([ans].concat(C4M2_unequalPairs(n, h, 3))), answer: ans,
        explain: `${h} + ${h} = ${n}, and both groups hold ${h}. The other sums also make ${n}, but one group would be bigger than the other.`,
      };
    }

    if (mode === 'blank') {
      const n = L === 1 ? pick([6, 8, 10, 12]) : pick([12, 14, 16, 18, 20, 24]);
      const h = n / 2;
      const nc = C4M2_numChoices(h, [n, h + 1, h - 1, h + 2], '');
      return {
        prompt: `Fill the blanks with the <b>same number twice</b>: ${n} = ___ + ___ . What number goes in both blanks?`,
        type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `${h} + ${h} = ${n}. A number that can be written as a double like this is an <b>even</b> number.`,
      };
    }

    if (mode === 'double') {
      const n = L === 2 ? pick([10, 12, 14, 16, 18]) : pick([16, 18, 20, 22, 24, 26]);
      const h = n / 2;
      const ans = h + ' + ' + h;
      return {
        prompt: `Which of these is a <b>double</b> (both numbers the same) that adds up to exactly <b>${n}</b>?`,
        type: 'mc',
        choices: shuffle([ans, (h + 1) + ' + ' + (h + 1), (h - 1) + ' + ' + (h + 2), (h + 3) + ' + ' + (h - 1)]),
        answer: ans,
        explain: `${h} + ${h} = ${n}. ${h + 1} + ${h + 1} is a double, but it lands on ${n + 2}, not ${n}.`,
      };
    }

    if (mode === 'odd') {
      const n = L === 2 ? pick([7, 9, 11, 13]) : pick([15, 17, 19, 21, 23, 25]);
      const lo = (n - 1) / 2, hi = (n + 1) / 2;
      const ans = 'It cannot work — 1 is left over.';
      return {
        prompt: `${kid} has <b>${n}</b> ${noun} ${emoji} and wants two groups exactly the same size. What happens?`,
        type: 'mc',
        choices: shuffle([ans,
          `It works: ${lo} + ${lo}.`,
          `It works: ${lo} + ${hi}.`,
          `It works: ${n} + 0.`]),
        answer: ans,
        explain: `${lo} + ${lo} = ${n - 1}, which is one short, and ${lo} + ${hi} = ${n} but those two groups are different sizes. ${n} is an <b>odd</b> number, so somebody is always left over.`,
      };
    }

    if (mode === 'share') {
      const n = pick([14, 16, 18, 20, 22, 24, 26, 28]);
      const h = n / 2;
      const nc = C4M2_numChoices(h, [n, h + 1, h - 1, h + 2], '');
      return {
        prompt: `${kid} shares <b>${n}</b> ${noun} ${emoji} evenly between 2 friends, with none left over. How many does each friend get?`,
        type: 'mc', choices: nc.choices, answer: nc.answer,
        explain: `${h} + ${h} = ${n}, so each friend gets ${h}. Sharing between 2 is the same as splitting into two equal groups.`,
      };
    }

    if (mode === 'whichEven') {
      const ev = pick([12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
      const odds = [];
      while (odds.length < 3) {
        const o = ri(9, 31);
        if (o % 2 === 1 && odds.indexOf(o) === -1) odds.push(o);
      }
      const ans = String(ev);
      return {
        prompt: 'Which number can be split into <b>two equal groups</b> with nothing left over?',
        type: 'mc', choices: shuffle([ans].concat(odds.map(String))), answer: ans,
        explain: `${ev} = ${ev / 2} + ${ev / 2}, so it is even. The other three are odd, and odd numbers always leave one behind.`,
      };
    }

    const evens = shuffle([4, 6, 8, 10, 12, 14, 16, 18]).slice(0, 3);
    const eqs = evens.map(e => (e / 2) + ' + ' + (e / 2));
    const x = ri(2, 9);
    let y = ri(2, 9);
    while (y === x) y = ri(2, 9);
    const ans = x + ' + ' + y;
    return {
      prompt: 'Three of these sums make <b>two equal groups</b>. Which one does <b>NOT</b>?',
      type: 'mc', choices: shuffle([ans].concat(eqs)), answer: ans,
      explain: `${x} and ${y} are different sizes, so those two groups do not match. The other three use the same number twice.`,
    };
  },
});

/* ============================================================
   LEARNING GARDEN — Science slice A
   Observable properties, take-apart/rebuild, plant needs,
   pollen movers. Strands used: matter, life (both exist).
   ============================================================ */

// ------------------------------------------------------------
// shared helper — picks an entry whose LAST element is its min level
// lvl 1 -> only level-1 entries, lvl 2 -> level 1-2, lvl 3 -> level 2-3
// ------------------------------------------------------------
const C4SA_bandPick = function (bank, lvl) {
  var ok;
  if (lvl <= 1) ok = bank.filter(function (e) { return e[e.length - 1] <= 1; });
  else if (lvl === 2) ok = bank.filter(function (e) { return e[e.length - 1] <= 2; });
  else ok = bank.filter(function (e) { return e[e.length - 1] >= 2; });
  return pick(ok.length ? ok : bank);
};

// ============================================================
// 1. sci_classify_props — sort by what you observe
// ============================================================

// [thing, property, [3 wrong properties], why, minLvl]
const C4SA_PROP_ONE = [
  ['a brick 🧱', 'hard', ['soft', 'bendy', 'see-through'], 'Press a brick and nothing squishes. Hard!', 1],
  ['a marshmallow', 'soft', ['hard', 'stiff', 'see-through'], 'A marshmallow squishes when you press it. Soft!', 1],
  ['a window 🪟', 'see-through', ['soft', 'bendy', 'rough'], 'Light goes right through, so you can see the yard.', 1],
  ['a rubber band', 'bendy', ['stiff', 'see-through', 'hard'], 'You can stretch and bend it without breaking it.', 1],
  ['sandpaper', 'rough', ['smooth', 'squishy', 'see-through'], 'Sandpaper feels bumpy and scratchy on your fingers.', 1],
  ['a glass marble', 'smooth', ['rough', 'soft', 'bendy'], 'Your finger slides across it with no bumps at all.', 1],
  ['a wooden ruler', 'stiff', ['bendy', 'squishy', 'see-through'], 'A ruler stays straight when you press on it.', 1],
  ['a cotton ball', 'soft', ['hard', 'stiff', 'rough'], 'It squishes with the tiniest little press.', 1],
  ['a metal key 🔑', 'hard', ['soft', 'squishy', 'see-through'], 'A key does not squish or bend, so we call it hard.', 1],
  ['a clear plastic cup', 'see-through', ['rough', 'soft', 'made of wood'], 'You can see the juice inside right through the cup.', 1],
  ['a shoelace', 'bendy', ['stiff', 'hard', 'see-through'], 'A shoelace bends easily and ties into knots.', 1],
  ['tree bark 🌳', 'rough', ['smooth', 'soft', 'see-through'], 'Bark feels bumpy and scratchy when you touch it.', 1],
];

// [things, shared property, [3 wrong], why, minLvl]
const C4SA_PROP_GROUP = [
  ['a sponge, a pillow, and a marshmallow', 'soft', ['hard', 'see-through', 'made of metal'], 'You can squish every one of them with your fingers.', 1],
  ['a brick, a rock, and a metal spoon', 'hard', ['soft', 'bendy', 'see-through'], 'Not one of them squishes or bends when you press it.', 1],
  ['a rubber band, a shoelace, and a piece of yarn', 'bendy', ['stiff', 'see-through', 'heavy'], 'Each one can bend and twist without snapping.', 1],
  ['a ruler, a wooden board, and a popsicle stick', 'stiff', ['bendy', 'squishy', 'see-through'], 'They all stay straight when you push on them.', 2],
  ['sandpaper, tree bark, and a brick', 'rough', ['smooth', 'squishy', 'see-through'], 'Your fingers feel bumps on all three.', 1],
  ['an ice cube, a glass window, and clear plastic wrap', 'see-through', ['rough', 'soft', 'bendy'], 'You can see right through every one of them.', 1],
  ['a glass marble, a mirror, and an ice cube', 'smooth', ['rough', 'bendy', 'soft'], 'Your finger slides across each one with no bumps.', 2],
  ['a cork, a beach ball, and a dry leaf', 'floats', ['sinks', 'made of metal', 'see-through'], 'Each one stays up on top of the water.', 2],
  ['a rock, a metal key, and a coin', 'sinks', ['floats', 'soft', 'see-through'], 'Each one drops straight to the bottom of the tub.', 1],
  ['a cotton ball, a feather, and a fluffy sock', 'soft', ['hard', 'stiff', 'see-through'], 'All three squish easily, so the shared property is soft.', 1],
  ['a paper clip, a pipe cleaner, and a drinking straw', 'bendy', ['stiff', 'made of glass', 'soft'], 'You can bend each one into a new shape with your hands.', 2],
  ['a clear water bottle, a fish tank, and a pair of glasses', 'see-through', ['rough', 'squishy', 'made of wood'], 'Light passes through all three so you see what is behind.', 2],
  ['a wool scarf, a teddy bear, and a couch cushion', 'soft', ['hard', 'see-through', 'made of glass'], 'Every one of them is squishy when you press it.', 1],
  ['a concrete sidewalk, a gravel path, and a pinecone', 'rough', ['smooth', 'see-through', 'bendy'], 'All three feel bumpy and scratchy to your fingers.', 2],
  ['a wet bar of soap, a sheet of ice, and a polished floor', 'smooth', ['rough', 'bendy', 'made of paper'], 'Your hand slides across each one with no bumps to catch on.', 2],
  ['a steel nail, a glass marble, and a metal spoon', 'sinks', ['floats', 'bendy', 'see-through'], 'Drop each one in water and it heads straight for the bottom.', 2],
  ['a plastic bottle cap, a wooden stick, and a foam cup', 'floats', ['sinks', 'made of metal', 'see-through'], 'Each one bobs on top of the water instead of sinking.', 2],
  ['a paper towel, a sheet of foil, and a cotton T-shirt', 'bendy', ['stiff', 'see-through', 'made of glass'], 'You can fold or bend each one without breaking it.', 2],
];

// [what you want to know, the right test, [3 wrong tests], why, minLvl]
const C4SA_PROP_TEST = [
  ['if a block will float or sink', 'put it in a tub of water and watch', ['hold it up to a bright light and look through it', 'try to bend it back and forth with both hands', 'rub it gently on your cheek'], 'Floating is about water, so the water test answers it.', 2],
  ['if a scarf is soft or hard', 'squeeze it', ['drop it into a bucket of water and wait', 'hold it up to a lamp and look through it', 'measure how long it is with a ruler'], 'Soft or hard is about squishing, so give it a squeeze.', 2],
  ['if a sheet of plastic is see-through', 'try to see a friend behind it', ['squeeze it', 'weigh it on a kitchen scale to the gram', 'put it in the freezer'], 'See-through means light gets through, so look through it.', 2],
  ['if a stick is bendy or stiff', 'gently try to bend it', ['smell it', 'drop it in a cup of water and watch', 'count how many sides it has'], 'Bendy or stiff is about bending, so a gentle bend test tells you.', 2],
  ['if a rock is rough or smooth', 'slide your finger across it', ['listen to it very carefully', 'hold it up to a light', 'set it on a kitchen scale'], 'Rough and smooth are about touch, so your fingers are the tool.', 2],
  ['if a toy boat can hold a penny', 'set it in water and add a penny', ['bend the boat', 'look through the boat toward a bright lamp', 'rub the boat'], 'To find out, you really have to try it in the water.', 2],
  ['which of two socks soaks up more water', 'pour the same spoonful of water on each sock', ['pull hard on each sock', 'look closely at the colors and patterns of each sock', 'smell each sock'], 'Both socks get the SAME water, so the test is fair.', 3],
  ['if a paper towel is strong when it is wet', 'wet it, then gently pull it', ['fold it in half and count the folds', 'hold it up to a light and look through', 'weigh it while it is still dry'], 'The question is about WET, so you must test it wet.', 3],
  ['if a bag will keep the rain out', 'pour a little water on it and look inside', ['shake it hard and count how many seconds it takes', 'measure it', 'smell it'], 'Waterproof is about water, so use water to find out.', 3],
  ['which of two balls bounces higher', 'drop both from the same height and watch', ['throw one of them hard and drop the other one', 'squeeze both of the balls', 'roll them across a soft rug'], 'Dropping from the SAME height keeps the test fair.', 3],
  ['if a marble is heavier than a cork', 'put one on each side of a balance scale', ['look at which one has the prettier color on it', 'try to bend them', 'listen to them'], 'A balance scale compares how heavy two things are.', 3],
  ['if a metal spoon is smooth', 'run your fingertip along it', ['drop it from a chair and listen', 'hold it near a magnet and watch', 'put it in a dark drawer overnight'], 'Smoothness is something you feel with touch.', 3],
  ['if a rock is heavier than a sponge', 'put one on each side of a balance', ['look at which one is darker', 'smell both of them closely', 'count all of the little bumps on each one'], 'A balance tips down on the heavier side, so it answers the question.', 3],
  ['if two ribbons are the same length', 'lay them side by side, ends lined up', ['hold one up to a light', 'squeeze both of the ribbons as hard as you can', 'drop them both into water'], 'Lining up the ends is how you compare length fairly.', 3],
  ['if a jacket keeps the wind out', 'hold it up and blow air at it', ['weigh the jacket on a kitchen scale', 'count all of its buttons and zippers', 'measure how wide the sleeves are'], 'Test wind with wind, then feel how much air gets through.', 3],
  ['which of two towels dries a wet table faster', 'wipe the same size spill with each', ['look at which towel is prettier', 'ask which towel cost more money', 'hang both towels out in the sun for an hour'], 'Same size spill for both towels means the race is fair.', 3],
];

// ============================================================
// 2. sci_build_apart — take apart, build new
// ============================================================

// [kid, pieces, thing A, thing B, [3 impossible things], minLvl]
const C4SA_BUILD = [
  ['Maya', 'wooden blocks', 'a tall tower', 'a bridge for her toy cars', ['a bowl of soup', 'a real puppy', 'a glass window'], 1],
  ['Ben', 'craft sticks and glue', 'a little raft', 'a picture frame', ['a cup of water', 'a lightning bolt', 'a live goldfish'], 1],
  ['Ivy', 'snap-together bricks', 'a rocket ship', 'a small house', ['a rain cloud', 'a bowl of cereal', 'a real bird'], 1],
  ['Leo', 'cardboard tubes and tape', 'a marble ramp', 'a long spyglass', ['a puddle', 'a real oak tree', 'a slice of pizza'], 1],
  ['Ana', 'paper clips', 'a long chain', 'a letter S shape', ['a wool sweater', 'a real flower', 'a bowl of milk'], 1],
  ['Sam', 'play dough', 'a snake shape', 'a little bowl shape', ['a metal key', 'a real fish', 'a beam of sunlight'], 1],
  ['Nora', 'pipe cleaners', 'a pair of pretend glasses', 'a flower shape', ['a stone wall', 'a real butterfly', 'a cup of juice'], 1],
  ['Eli', 'paper squares', 'a paper hat', 'a paper boat', ['a metal spoon', 'a live turtle', 'a puddle of water'], 1],
  ['Jo', 'plastic cups', 'a pyramid', 'a tall wall', ['a rain shower', 'a real horse', 'a loaf of bread'], 1],
  ['Rey', 'magnetic tiles', 'a cube box', 'a flat road', ['a bowl of soup', 'a real kitten', 'a snowstorm'], 1],
  ['Kai', 'toy train tracks', 'a big circle track', 'a figure-eight track', ['a sandwich', 'a live pony', 'a rainbow'], 1],
  ['Mia', 'dominoes', 'a long winding line', 'a little tower', ['a glass of water', 'a real ladybug', 'a cloud'], 1],
];

// [prompt, answer, [3 wrong], why, minLvl]
const C4SA_REBUILD_Q = [
  ['Tia takes her block castle apart. What happens to the blocks?', 'They are all still there.', ['They disappear into the air.', 'They melt together into one solid lump forever.', 'They turn into a different material, like glass.'], 'Taking something apart does not destroy the pieces. The same blocks can build something new!', 2],
  ['Ben wants to build a boat, but all his craft sticks are in a tower. What should he do FIRST?', 'Take the tower apart.', ['Throw the sticks away and ask for a brand-new box.', 'Paint the whole tower blue so it looks like water.', 'Add even more sticks until the tower tips over.'], 'The pieces he needs are already in the tower. He just has to take it apart.', 2],
  ['Ivy has 20 bricks. She builds a house, takes it apart, and builds a car. How many bricks does she have now?', '20 bricks', ['0 bricks, because they all got used up', 'about 10 bricks, because half got used up', 'more than 20, because building makes more'], 'Rebuilding never adds or removes pieces. She still has every one of her 20 bricks.', 2],
  ['Which set of pieces could be rebuilt into something brand new?', 'a pile of snap-together bricks', ['a puddle of spilled milk on the floor', 'a burned-up piece of newspaper', 'a cup of hot cocoa'], 'Bricks come apart and go back together. The others cannot be rebuilt.', 2],
  ['Sam rolls his play dough snake into a ball. What is true?', 'It is the same dough in a new shape.', ['It is a brand-new kind of dough now.', 'There is less dough than there was before.', 'The dough will never stick together again.'], 'The same material can be shaped many ways. Nothing was added or taken away.', 2],
  ['A class builds a tower with 30 blocks, then a bridge with those same blocks. What did they need?', 'Nothing new.', ['A whole box of brand-new blocks.', 'Glue to hold every single block down tight.', 'A grown-up to go buy 30 more blocks.'], 'One set of pieces can be arranged into many different things.', 3],
  ['Which one shows taking something apart and building something new?', 'A block wall becomes a block ramp.', ['A cookie is eaten up at snack time.', 'A candle burns down to a puddle of wax.', 'A page is torn into bits and thrown away.'], 'Only the blocks come apart into pieces you can use again.', 3],
  ['Nora bends a pipe cleaner into a circle, then into a square. What changed?', 'Only the shape.', ['The pipe cleaner became a new material.', 'The pipe cleaner grew much longer than before.', 'Half of the pipe cleaner disappeared.'], 'It is the very same pipe cleaner. You only changed its shape.', 2],
  ['Eli folded a paper boat. How can he get a paper hat from that SAME paper?', 'Unfold the boat and fold the hat.', ['Cut the boat into tiny bits of confetti first.', 'Wait for the boat to grow into a hat by itself.', 'Soak the boat in a big bowl of water.'], 'Unfolding takes it apart, so the same paper can be folded a new way.', 3],
  ['Why can one set of blocks make so many different things?', 'The pieces fit together in new ways.', ['Blocks grow bigger every time you build.', 'Blocks change color to match whatever you planned.', 'Each block can only be used one single time.'], 'A small set of pieces has a huge number of possible arrangements!', 3],
  ['Rey takes apart a tile cube and builds a flat road. What happened to the number of tiles?', 'It stayed the same.', ['It doubled, because the road is very long.', 'It dropped all the way down to zero.', 'It went up by one for every new row of road.'], 'Rearranging pieces never changes how many pieces you have.', 3],
  ['Which of these can be taken apart and then built again?', 'a tower of plastic cups', ['a scrambled egg', 'a melted crayon puddle', 'a popped balloon'], 'Cups stack and unstack. The others cannot go back to how they were.', 2],
];

// ============================================================
// 3. sci_plants_need — sunlight and water
// ============================================================

// [prompt, answer, [3 wrong], why, minLvl]
const C4SA_PLANT_NEED = [
  ['A bean plant sits in a sunny window, but nobody waters it for two weeks. What will happen?', 'It will droop and dry out.', ['It will grow twice as fast as before.', 'It will turn into a whole different kind of plant.', 'Nothing at all will change.'], 'Plants need water. Without it they wilt and dry up.', 1],
  ['A healthy plant is put in a dark closet and watered every day. What will happen?', 'It will get pale and weak.', ['It will bloom more flowers than ever before.', 'It will grow into a tall tree in one week.', 'It will stay exactly the same forever.'], 'Leaves need sunlight to make food. In the dark, a plant runs out of food.', 1],
  ['Which TWO things does a plant need most to grow?', 'sunlight and water', ['candy and juice', 'music and toys', 'crayons and paper'], 'Leaves use sunlight and water to make the plant its own food.', 1],
  ['Which part of a plant takes in water from the soil?', 'the roots', ['the flower', 'the leaves', 'the seeds'], 'Roots reach down into the soil and drink for the whole plant.', 1],
  ['Which part of a plant uses sunlight to make food?', 'the leaves', ['the roots', 'the seeds', 'the stem'], 'Flat green leaves catch sunlight like little solar panels.', 1],
  ['A potted plant is watered every day, but the pot is inside a closed cardboard box. What is it missing?', 'sunlight', ['water', 'soil', 'seeds'], 'It has water but no light, and leaves need light to make food.', 1],
  ['No rain has fallen for a month and the garden is wilting. What would help the plants MOST?', 'watering them', ['painting the pots green', 'talking to them kindly', 'counting all of their leaves'], 'Wilting after a long dry spell is a sign the plants need water.', 1],
  ['Where is the BEST place to grow a tomato plant?', 'a sunny spot you can water', ['a dark corner of the basement', 'inside a closed refrigerator', 'a shelf in a closet with no window'], 'Tomatoes need sunlight AND water, so a sunny, easy-to-water spot wins.', 1],
  ['Ana keeps her plant in the sunshine and waters it just right. What will happen?', 'It will grow green and strong.', ['It will shrink a little smaller each day.', 'It will turn brown and crispy by Friday.', 'It will stop growing right away.'], 'With sunlight and water, a plant has what it needs to grow.', 1],
  ['A plant is watered so much that the soil is a soupy puddle every single day. What can happen?', 'The roots can rot.', ['The plant will grow flowers overnight.', 'The plant will turn into a water lily by morning.', 'The plant will not need any sunlight anymore.'], 'Plants need water, but too much drowns the roots. Just right is best.', 2],
  ['Which of these does a plant NOT need in order to grow?', 'a bedtime story', ['water', 'sunlight', 'air'], 'Plants need water, light, and air. Stories are lovely, but not on the list.', 2],
  ['Why do farmers plant crops in open fields instead of under a roof?', 'so sunlight and rain reach them', ['so the plants stay cold', 'so the plants can hear the wind', 'so the plants stay perfectly dry'], 'An open field lets sunlight and rain get to every plant.', 2],
];

// [prompt, answer, [3 wrong], why, minLvl]  — always names Plant A / Plant B
const C4SA_FAIR_TEST = [
  ['Plant A sits in a sunny window. Plant B sits in a dark closet. Both get the same water. What is this test about?', 'whether plants need sunlight', ['whether plants need water', 'whether plants enjoy music', 'whether plants need bigger pots'], 'The only thing that is different is the light, so light is what the test is about.', 2],
  ['Plant A gets water every day. Plant B gets no water. Both sit in the same sunny window. What is this test about?', 'whether plants need water', ['whether plants need sunlight', 'whether plants need a warm room', 'whether plants grow better in blue pots'], 'Only the water is different, so this test is about water.', 2],
  ['Kim wants to test if plants need sunlight. Plant A goes in the window. Where should Plant B go?', 'in a dark closet, with the same water', ['in a second sunny window, with the same water', 'in the window, but with no water at all', 'outside in the rain with no pot'], 'To test light, change ONLY the light. Everything else stays the same.', 2],
  ['Plant A got sun and water. Plant B got sun but no water, and Plant B wilted. What did Kim learn?', 'Plants need water to stay healthy.', ['Plants need sunlight to stay healthy.', 'Plants grow best in a completely dark room.', 'Plants do not really need anything at all.'], 'Water was the only difference, so water explains what happened.', 2],
  ['Plant A is in a sunny window in a big pot. Plant B is in a dark closet in a tiny pot. Why is this NOT a fair sunlight test?', 'Two things are different.', ['The plants are not the same color.', 'A closet is much too quiet for a plant.', 'Plants should never be tested inside of a house.'], 'In a fair test, only ONE thing changes. Here the light AND the pot size changed.', 3],
  ['Plant A and Plant B are the same kind of plant in the same soil. Plant A gets 8 hours of sun, Plant B gets 1 hour. Which will most likely grow taller and greener?', 'Plant A', ['Plant B', 'They will grow exactly the same.', 'Neither one of them will grow at all.'], 'More sunlight means more food for the plant, so Plant A has the advantage.', 2],
  ['Plant A gets half a cup of water each day. Plant B gets none. Both are in the same sunny spot. Which will most likely wilt first?', 'Plant B', ['Plant A', 'Both will wilt on the very same day.', 'Neither plant will ever wilt at all.'], 'Plant B has no water, so it dries out first.', 2],
  ['To keep a plant test fair, what should be the same for Plant A and Plant B?', 'everything but the one thing you test', ['every single thing, with no differences anywhere', 'nothing at all, since every plant is different anyway', 'only the color of the two pots'], 'Change one thing, keep the rest the same. That is a fair test.', 3],
  ['Plant A gets a cup of plain water. Plant B gets the same cup of plain water. Both sit in the same window. What will most likely happen?', 'They will grow about the same.', ['Plant A will grow much taller than Plant B.', 'Plant B will dry up and die in one day.', 'Plant A will make flowers and Plant B will not.'], 'Nothing is different between them, so we expect the same result.', 3],
  ['Plant A is in the window, Plant B is in the closet, and Ana forgot to water Plant B. Why can she NOT say sunlight caused the difference?', 'Plant B was missing water too.', ['Closets are always colder than windows.', 'Plants can never be tested indoors at all.', 'She needed to use three plants instead of two.'], 'Two things were different, so we cannot tell which one caused the change.', 3],
  ['Plant A was in the dark a week and its leaves are pale yellow. Plant B stayed in the sun and stayed green. What should Ana do for Plant A now?', 'Move it back into the sunlight.', ['Put it in a room that is even darker than the closet.', 'Cover all of its leaves with paper.', 'Stop giving it any water at all.'], 'Pale leaves mean the plant needs light. Sunlight lets it make food again.', 3],
  ['In a fair test about water, Plant A and Plant B must both get the SAME amount of what?', 'sunlight', ['water', 'wilting', 'nothing'], 'When you test water, you keep the sunlight the same for both plants.', 2],
  ['Plant A and Plant B both sit in the sun. Plant A is watered on Monday only. Plant B is watered every day. After two weeks, which one most likely looks healthier?', 'Plant B', ['Plant A', 'They will look exactly the same.', 'Neither plant will still be alive.'], 'Plant B got steady water all two weeks, so it stayed green and strong.', 3],
  ['Ana wants to know if MORE sunlight helps. Plant A gets 2 hours of sun and Plant B gets 8 hours. What must stay the SAME for both?', 'the water they get', ['the hours of sunlight', 'the day she starts the test', 'nothing has to stay the same'], 'When you test sunlight, keep the water the same so light is the only difference.', 3],
  ['Plant A grew tall in the window. Plant B stayed short in the closet. Both got the same water. What is the BEST thing to say?', 'Sunlight helped Plant A grow.', ['Closets make plants grow faster.', 'Water was the only difference here.', 'Plant B must be a different kind of plant.'], 'Light was the one difference, so light is the best explanation.', 3],
  ['Leo tests how much water plants need. He gives Plant A one cup and Plant B three cups, but he also puts Plant B in a dark closet. What is wrong?', 'He changed two things.', ['He used two plants instead of one.', 'He should give both plants the same water.', 'Plants do not need any water at all.'], 'The light AND the water changed, so we cannot tell which one caused the difference.', 3],
];

// ============================================================
// 4. sci_pollination — pollen movers
// A pollinator = an ANIMAL that carries pollen flower to flower.
// Wind moves pollen too, but wind is not an animal. Wind never
// appears as a choice in a "which is a pollinator" question.
// ============================================================

const C4SA_POLLINATORS = [
  ['a bee 🐝', 'Bees visit flowers for nectar and get dusty with pollen.'],
  ['a butterfly 🦋', 'Butterflies sip nectar and carry pollen on their legs.'],
  ['a hummingbird', 'A hummingbird pushes its beak in for nectar and gets pollen on its head.'],
  ['a moth', 'Moths visit flowers at night and carry pollen on their fuzzy bodies.'],
  ['a nectar bat 🦇', 'Some bats drink nectar at night and move pollen between flowers.'],
  ['a flower beetle 🪲', 'Beetles crawl right through flowers and pick up pollen.'],
];

const C4SA_NOT_POLLINATORS = [
  'a goldfish 🐠', 'an earthworm 🪱', 'a shark 🦈', 'a mole', 'a penguin 🐧', 'a whale 🐋', 'a jellyfish 🪼', 'a rattlesnake 🐍',
];

// [prompt, answer, [3 wrong], why, minLvl]
const C4SA_POLLEN_Q = [
  ['What is pollen?', 'a tiny powder that flowers make', ['a sweet juice that bees like to drink', 'the roots under a flower', 'the water inside a stem'], 'Pollen is a fine dust. It has to move flower to flower so seeds can form.', 1],
  ['Why does a bee visit a flower? 🐝', 'to drink sweet nectar', ['to take a nap in the soft petals', 'to hide from the afternoon rain', 'to nibble on the flower roots'], 'The bee comes for nectar. Pollen sticks to its fuzzy body and rides to the next flower.', 1],
  ['A bee lands on one flower, then flies to another. What travels with it?', 'pollen', ['seeds', 'roots', 'soil'], 'Pollen sticks to the bee’s fuzzy body and rubs off on the next flower.', 1],
  ['What can a flower make AFTER pollen reaches it?', 'seeds', ['leaves', 'roots', 'bark'], 'Pollen lets a flower make seeds, and seeds grow into brand-new plants.', 1],
  ['Why do many flowers have bright colors and sweet smells?', 'to invite animals to visit', ['to scare the rain away', 'to make the soil richer', 'to keep their leaves warm'], 'Bright petals and sweet smells are like a sign that says "come here!" to pollinators.', 1],
  ['Moving pollen from one flower to another is called what?', 'pollination', ['evaporation', 'erosion', 'hibernation'], 'Pollination is the pollen trip that lets flowers make seeds.', 1],
  ['A hummingbird pushes its beak deep into a flower for nectar. What happens to its head?', 'It gets dusted with pollen.', ['It turns a bright red color.', 'It fills all the way up with seeds.', 'It gets covered in dark soil.'], 'Pollen brushes onto the bird and rides along to the very next flower.', 1],
  ['What is the BEST way for a kid to help pollinators?', 'plant flowers they like', ['catch them in a jar', 'chase them out of the garden', 'cover the flowers with plastic wrap'], 'More flowers means more food. Watch pollinators, and let them work.', 1],
  ['If no pollinators visited an apple tree’s flowers, what would most likely happen?', 'fewer apples would grow', ['the tree would grow much taller', 'the leaves would turn blue', 'the roots would stop drinking water'], 'No pollen moved means fewer seeds, and apples grow around seeds.', 2],
  ['Which garden would most likely have the MOST pollinators visiting?', 'a garden full of blooming flowers', ['a parking lot with no plants at all', 'a bare patch of dry dirt', 'a room with plastic flowers'], 'Real flowers offer nectar and pollen, which is exactly what pollinators come for.', 2],
  ['Bats that visit flowers at night are pollinators. Why? 🦇', 'They carry pollen flower to flower.', ['They eat the seeds inside the flowers.', 'They dig up the roots.', 'They water the plants.'], 'A pollinator is an animal that moves pollen from flower to flower, day or night.', 2],
  ['Which of these moves pollen but is NOT an animal?', 'the wind', ['a bee', 'a hummingbird', 'a butterfly'], 'Grass and corn let the wind carry their pollen. Bees, hummingbirds, and butterflies are animals that carry pollen too.', 3],
  ['A farmer keeps beehives right next to her strawberry field. Why?', 'so the bees pollinate the flowers', ['so the bees will eat the weeds', 'so the bees will water the plants', 'so the bees will block the sun'], 'More bees means more pollinated flowers, and that means more strawberries.', 3],
  ['Corn plants let the wind carry their pollen. What does that show?', 'Pollen can move without an animal.', ['Corn plants do not need pollen at all.', 'The wind carries pollen for every single plant.', 'Corn can make seeds with no pollen at all.'], 'Most garden flowers use animal pollinators. Some plants, like corn and grass, use the wind.', 3],
  ['A bee is fuzzy all over. How does that help flowers? 🐝', 'Pollen sticks to the fuzz.', ['Fuzz keeps the flower warm at night.', 'Fuzz makes the bee fly much faster.', 'Fuzz helps the bee dig up the soil.'], 'Fuzzy bodies catch pollen grains, which rub off on the very next flower.', 2],
  ['Which flower is a butterfly most likely to visit? 🦋', 'a bright open flower with nectar', ['a flower made out of colored paper', 'a closed-up flower bud', 'a wilted brown flower'], 'Pollinators go where the nectar is, and open blooms make it easy to reach.', 2],
  ['A moth visits a flower at night and a bee visits that same flower in the morning. What do they BOTH do for it?', 'move its pollen', ['water its roots', 'give it sunlight', 'pull off its petals'], 'Both are pollinators, and pollinators move pollen so a flower can make seeds.', 2],
  ['A pumpkin plant makes flowers, but no pollinator ever visits them. What will the plant most likely NOT make?', 'pumpkins', ['leaves', 'roots', 'a stem'], 'With no pollen moved, the flowers cannot make seeds — and pumpkins grow around seeds.', 3],
  ['Why do gardeners plant many different kinds of flowers instead of just one?', 'to feed many kinds of pollinators', ['to keep the soil dry', 'to make the wind blow harder', 'to keep bees away from the vegetables'], 'Different pollinators like different flowers, so a mix feeds more of them.', 3],
  ['Some flowers open only at night. Which pollinator is most likely to visit them?', 'a moth', ['a butterfly', 'a honeybee', 'a hummingbird'], 'Moths fly at night. Butterflies, honeybees, and hummingbirds visit flowers in the daytime.', 3],
  ['A cornfield has no bees nearby, but it still grows plenty of corn. How?', 'The wind carries its pollen.', ['Corn does not use pollen at all.', 'The farmer paints pollen on each plant.', 'Corn seeds come out of the roots.'], 'Corn is a wind-pollinated plant, so it does not need animals to move its pollen.', 3],
  ['Two apple trees bloom, but a long rainstorm keeps the bees inside all week. What is most likely?', 'Fewer apples will grow.', ['More apples will grow than usual.', 'The trees will stop making leaves.', 'The apples will grow on the roots instead.'], 'Fewer bee visits means less pollen moved, and that means fewer apples.', 3],
  ['Which sentence about pollinators is TRUE?', 'They move pollen while they eat.', ['They plant seeds in the soil with their feet.', 'They carry whole flowers from place to place.', 'They water the flowers with their wings.'], 'Pollinators come for nectar, and pollen hitches a ride on their bodies to the next flower.', 3],
];

// ============================================================
// SKILLS
// ============================================================
SKILLS.push(
  {
    id: 'sci_classify_props', strand: 'matter', name: 'Sort by what you observe',
    gen: (lvl = 2) => {
      let mode;
      if (lvl <= 1) mode = ri(1, 10) <= 8 ? 'one' : 'group';
      else if (lvl === 2) mode = pick(['group', 'group', 'test']);
      else mode = pick(['group', 'test', 'test']);

      if (mode === 'one') {
        const e = C4SA_bandPick(C4SA_PROP_ONE, lvl);
        const a = e[1];
        return {
          prompt: `Which word tells about <b>${e[0]}</b>?`,
          type: 'mc', choices: shuffle([a].concat(e[2])), answer: a, explain: e[3],
        };
      }
      if (mode === 'group') {
        const e = C4SA_bandPick(C4SA_PROP_GROUP, lvl);
        const a = e[1];
        return {
          prompt: `Look at these: <b>${e[0]}</b>. Which property do they ALL share?`,
          type: 'mc', choices: shuffle([a].concat(e[2])), answer: a, explain: e[3],
        };
      }
      const e = C4SA_bandPick(C4SA_PROP_TEST, lvl);
      const a = e[1];
      return {
        prompt: `You want to find out <b>${e[0]}</b>. Which test tells you?`,
        type: 'mc', choices: shuffle([a].concat(e[2])), answer: a, explain: e[3],
      };
    },
  },

  {
    id: 'sci_build_apart', strand: 'matter', name: 'Take apart, build new',
    gen: (lvl = 2) => {
      let mode;
      if (lvl <= 1) mode = 'build';
      else if (lvl === 2) mode = pick(['build', 'why', 'why']);
      else mode = pick(['why', 'why', 'count']);

      if (mode === 'build') {
        const e = pick(C4SA_BUILD);
        const flip = ri(1, 2) === 1;
        const made = flip ? e[2] : e[3];
        const a = flip ? e[3] : e[2];
        return {
          prompt: `${e[0]} used <b>${e[1]}</b> to build <b>${made}</b>. Now ${e[0]} takes it all apart. What can be built next with those SAME pieces?`,
          type: 'mc', choices: shuffle([a].concat(e[4])), answer: a,
          explain: `The pieces did not disappear. The same <b>${e[1]}</b> can be put together a new way to make <b>${a}</b>.`,
        };
      }
      if (mode === 'why') {
        const e = C4SA_bandPick(C4SA_REBUILD_Q, lvl);
        const a = e[1];
        return { prompt: e[0], type: 'mc', choices: shuffle([a].concat(e[2])), answer: a, explain: e[3] };
      }
      const kid = pick(['Maya', 'Ben', 'Ivy', 'Leo', 'Ana', 'Kai']);
      const n = ri(12, 30);
      const a = n + ' blocks';
      return {
        prompt: `${kid} has <b>${n} blocks</b>. ${kid} builds a tower using every block, takes the tower apart, then builds a bridge using every block. How many blocks are in the bridge?`,
        type: 'mc',
        choices: shuffle([a, (n * 2) + ' blocks', '0 blocks', (n - 4) + ' blocks']),
        answer: a,
        explain: `Taking apart and rebuilding never adds or removes pieces, so all <b>${n}</b> blocks are in the bridge.`,
      };
    },
  },

  {
    id: 'sci_plants_need', strand: 'life', name: 'What plants need',
    gen: (lvl = 2) => {
      let e;
      if (lvl <= 1) e = C4SA_bandPick(C4SA_PLANT_NEED, 1);
      else if (lvl === 2) e = ri(1, 10) <= 6 ? C4SA_bandPick(C4SA_FAIR_TEST, 2) : C4SA_bandPick(C4SA_PLANT_NEED, 3);
      else e = C4SA_bandPick(C4SA_FAIR_TEST, 3);
      const a = e[1];
      return { prompt: e[0], type: 'mc', choices: shuffle([a].concat(e[2])), answer: a, explain: e[3] };
    },
  },

  {
    id: 'sci_pollination', strand: 'life', name: 'Pollen movers',
    gen: (lvl = 2) => {
      let mode;
      if (lvl <= 1) mode = ri(1, 10) <= 6 ? 'who' : 'why';
      else if (lvl === 2) mode = pick(['who', 'why', 'why']);
      else mode = pick(['why', 'why', 'notwho']);

      if (mode === 'who') {
        const p = pick(C4SA_POLLINATORS);
        const a = p[0];
        const others = shuffle(C4SA_NOT_POLLINATORS.slice()).slice(0, 3);
        return {
          prompt: 'A <b>pollinator</b> is an animal that carries pollen from flower to flower. Which one of these is a pollinator?',
          type: 'mc', choices: shuffle([a].concat(others)), answer: a, explain: p[1],
        };
      }
      if (mode === 'notwho') {
        const a = pick(C4SA_NOT_POLLINATORS);
        const three = shuffle(C4SA_POLLINATORS.slice()).slice(0, 3).map(function (p) { return p[0]; });
        return {
          prompt: 'Three of these animals visit flowers and carry pollen. Which one does <b>NOT</b> carry pollen?',
          type: 'mc', choices: shuffle([a].concat(three)), answer: a,
          explain: `${a.charAt(0).toUpperCase()}${a.slice(1)} never visits flowers, so it cannot move pollen. The other three do.`,
        };
      }
      const e = C4SA_bandPick(C4SA_POLLEN_Q, lvl);
      const a = e[1];
      return { prompt: e[0], type: 'mc', choices: shuffle([a].concat(e[2])), answer: a, explain: e[3] };
    },
  },
);

// ============================================================
// science_b — Earth's water, erosion, and Think Like an Engineer
// ============================================================

STRANDS.push(
  { id: 'sci_design', subject: 'science', name: 'Think Like an Engineer', emoji: '🛠️', color: 'var(--teal)',
    lesson: `<p><b>Engineers are problem solvers.</b> They notice something that is not working, then build something to fix it.</p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Name the problem first.</b> A problem tells what is going <b>wrong</b> — "the milk tips over." A solution tells what to <b>do</b> — "add a cup holder."</li>
        <li><b>Make more than one design.</b> Two ideas are better than one, because you can compare them.</li>
        <li><b>Test them the same way.</b> Change only <b>one</b> thing. That is a <b>fair test</b>.</li>
        <li><b>Measure!</b> Count the pennies. Time the seconds. Numbers tell you which design really worked better.</li>
        <li><b>Improve it.</b> A design that loses the test is not a failure — it tells you what to fix next.</li>
      </ul>
      <p style="font-weight:700">Engineers test again and again. Every try teaches something new.</p>` },
);

// ------------------------------------------------------------
// 1. sci_water_earth — Where water is found
// ------------------------------------------------------------

// [clue, answer, [3 distractors], why]
const C4SB_WATER_DEF = [
  ['a huge body of salty water that covers most of Earth', 'the ocean',
    ['a pond', 'a puddle', 'a well'],
    'Oceans are salty, and together they cover about three quarters of our planet.'],
  ['fresh water that flows downhill in one long path', 'a river',
    ['the ocean', 'a glacier', 'a puddle'],
    'A river keeps moving. It flows downhill until it reaches a lake or the sea.'],
  ['a big body of still fresh water with land all around it', 'a lake',
    ['the ocean', 'a river', 'a waterfall'],
    'A lake sits in a low spot in the land. The water stays in one place instead of flowing away.'],
  ['a small, shallow body of still water where frogs lay eggs', 'a pond',
    ['the ocean', 'a glacier', 'a river'],
    'A pond is small and calm, so sunlight reaches the bottom and plants and frogs love it.'],
  ['a narrow flow of water, much smaller than a river', 'a stream',
    ['the ocean', 'a lake', 'a glacier'],
    'Streams are skinny little flows. Many streams join together to make one river.'],
  ['a thick sheet of ice that creeps slowly down a mountain', 'a glacier',
    ['a river', 'a pond', 'a rain cloud'],
    'A glacier is water in its solid form. It moves so slowly you cannot see it happen.'],
  ['a giant chunk of floating ice that broke off a glacier', 'an iceberg',
    ['a lake', 'a stream', 'a puddle'],
    'Icebergs float because ice is lighter than the water around it. Most of an iceberg hides underwater.'],
  ['a river of water dropping straight down over a cliff', 'a waterfall',
    ['a lake', 'a pond', 'a glacier'],
    'Water tumbles over the edge and falls. That is why waterfalls are so loud and splashy.'],
  ['rainwater collected in a dip in the sidewalk that dries up by noon', 'a puddle',
    ['a lake', 'the ocean', 'a glacier'],
    'A puddle is a tiny bit of water sitting on top of hard ground. The sun soon turns it into invisible vapor.'],
  ['water stored deep down in the spaces between rocks and soil', 'groundwater',
    ['the ocean', 'a waterfall', 'an iceberg'],
    'Rain soaks into the ground and waits there. People drill wells to pull it back up.'],
  ['a deep hole people dig to reach water under the ground', 'a well',
    ['a river', 'a pond', 'a wave'],
    'A well reaches down to groundwater. A bucket or a pump brings the water up.'],
  ['salty water that curves into the land like a big bite', 'a bay',
    ['a lake', 'a glacier', 'a stream'],
    'A bay is part of the ocean, so its water is salty too.'],
  ['tiny drops of water floating high up in the sky', 'a cloud',
    ['a pond', 'a well', 'a stream'],
    'Clouds are made of billions of water droplets. When they get heavy, the water falls as rain or snow.'],
  ['frozen water hard enough to stand on', 'ice',
    ['steam', 'fog', 'mist'],
    'Ice is water in its solid form. Water is the same stuff whether it is solid, liquid, or vapor.'],
  ['a small stream of fresh water bubbling up out of the ground', 'a spring',
    ['the ocean', 'a puddle', 'an iceberg'],
    'A spring is groundwater finding its own way back to the surface. Many streams begin at a spring.'],
];

// Level 1 uses the everyday water places only (no groundwater, bay, spring, iceberg).
const C4SB_WATER_DEF_EASY = [];
for (let i = 0; i < C4SB_WATER_DEF.length; i++) {
  const nm = C4SB_WATER_DEF[i][1];
  if (nm !== 'groundwater' && nm !== 'a bay' && nm !== 'a spring' && nm !== 'an iceberg') {
    C4SB_WATER_DEF_EASY.push(C4SB_WATER_DEF[i]);
  }
}

// [name shown, 'salty' or 'fresh', why]
const C4SB_SALT_EASY = [
  ['the ocean', 'salty', 'Ocean water carries salt. That is why it stings if you get it in your eyes.'],
  ['a river', 'fresh', 'Rivers carry rainwater and melted snow, so the water is fresh.'],
  ['a pond', 'fresh', 'Ponds are filled by rain and streams, so pond water is fresh.'],
  ['a rain cloud', 'fresh', 'Rain is always fresh water, even when it falls right into the sea.'],
  ['a mountain stream', 'fresh', 'Streams start high up from rain and melting snow, so they are fresh.'],
  ['a lake', 'fresh', 'Most lakes hold fresh water, which is why we can drink from many of them.'],
  ['a puddle', 'fresh', 'A puddle is just rain sitting on the ground, so it is fresh.'],
  ['a drinking well', 'fresh', 'Wells reach groundwater, and that water is fresh enough to drink.'],
];
const C4SB_SALT_HARD = [
  ['a bay', 'salty', 'A bay is a piece of the ocean tucked into the land, so it is salty.'],
  ['a sea', 'salty', 'A sea is a part of the ocean, so its water is salty.'],
  ['an iceberg', 'fresh', 'Surprise! Icebergs break off glaciers made of packed snow, so they are frozen fresh water.'],
  ['a glacier', 'fresh', 'Glaciers are made of squeezed snow, and snow is fresh water.'],
  ['ocean spray on your face at the beach', 'salty', 'That spray is ocean water, so you can taste the salt on your lips.'],
  ['water dripping off a melting icicle', 'fresh', 'An icicle is frozen rain, and rain is fresh water.'],
];

// [question, answer, [3 distractors], why]
const C4SB_WATER_SIZE = [
  ['Which one holds the MOST water?', 'the ocean',
    ['a lake', 'a river', 'a rain puddle'],
    'Almost all of Earth’s water is in the oceans — about 97 drops out of every 100.'],
  ['Which of these holds the MOST water?', 'a lake',
    ['a pond', 'a puddle', 'a raindrop'],
    'A lake is much bigger and deeper than a pond, and a pond beats a puddle.'],
  ['Which one holds the LEAST water?', 'a raindrop',
    ['a puddle', 'a pond', 'a mountain stream'],
    'A raindrop is the tiniest of all. It takes millions of them to make one puddle.'],
  ['Which of these is the BIGGEST?', 'a river',
    ['a stream', 'a puddle', 'a raindrop'],
    'Streams are small flows. When many streams join, they build one big river.'],
  ['Which one is SOLID water, not liquid?', 'a glacier',
    ['a river', 'a pond', 'a bubbling stream'],
    'A glacier is water frozen into a giant sheet of ice, so it is solid.'],
  ['Which one is made of SALT water?', 'the ocean',
    ['a lake', 'a stream', 'a raindrop'],
    'Only the ocean and its bays and seas are salty. The rest are fresh water.'],
  ['Which one holds the LEAST water?', 'a puddle',
    ['a pond', 'a lake', 'the ocean'],
    'A puddle is the smallest here, and it dries up in a day.'],
  ['Which of these water places is DEEPEST?', 'the ocean',
    ['a sidewalk puddle', 'a stream', 'a pond'],
    'Parts of the ocean are miles deep — deeper than the tallest mountain is tall.'],
  ['Which one moves the FASTEST?', 'a waterfall',
    ['a pond', 'a lake', 'a mountain glacier'],
    'A waterfall drops straight down, so it is the fastest. A glacier moves too, but far too slowly to see.'],
  ['Most of Earth’s FRESH water is frozen. Where is it?', 'in glaciers',
    ['in backyard ponds', 'in puddles', 'in kitchen sinks'],
    'Huge glaciers and ice caps near the poles hold most of the fresh water on our planet.'],
  ['Which one stays in ONE place instead of flowing along?', 'a lake',
    ['a river', 'a stream', 'a waterfall'],
    'Lakes sit still in a low spot. Rivers, streams, and waterfalls are always on the move.'],
  ['Which one would you find high up on a cold mountain top?', 'a glacier',
    ['the ocean', 'a bay', 'a coral reef'],
    'It stays freezing up there, so snow packs down into a glacier instead of melting.'],
];

SKILLS.push(
  {
    id: 'sci_water_earth', strand: 'earth', name: 'Where water is found',
    gen: (lvl = 2) => {
      const roll = ri(1, 10);
      let mode = 'def';
      if (lvl === 2) { mode = roll <= 6 ? 'def' : 'salt'; }
      if (lvl === 3) { mode = roll <= 6 ? 'size' : 'salt'; }

      if (mode === 'salt') {
        const row = lvl === 3 ? pick(C4SB_SALT_HARD) : pick(C4SB_SALT_EASY);
        return {
          prompt: `Is the water in <b>${row[0]}</b> salty or fresh? 💧`,
          type: 'mc', choices: ['salty', 'fresh'], answer: row[1], explain: row[2],
        };
      }
      if (mode === 'size') {
        const row = pick(C4SB_WATER_SIZE);
        const key = row[1];
        return {
          prompt: row[0], type: 'mc',
          choices: shuffle([key].concat(row[2])), answer: key, explain: row[3],
        };
      }
      const d = lvl === 1 ? pick(C4SB_WATER_DEF_EASY) : pick(C4SB_WATER_DEF);
      const key = d[1];
      return {
        prompt: `What do we call <b>${d[0]}</b>?`,
        type: 'mc', choices: shuffle([key].concat(d[2])), answer: key, explain: d[3],
      };
    },
  },
);

// ------------------------------------------------------------
// 2. sci_erosion — Slow the wearing away
// ------------------------------------------------------------

const C4SB_MOVERS = ['wind', 'moving water', 'ice'];
const C4SB_HOLDERS = ['plant roots', 'a stone wall', 'a layer of mulch', 'thick grass'];

// [scene, which mover]
const C4SB_EROSION_CAUSE = [
  ['A rushing river carries mud and pebbles far downstream.', 'moving water'],
  ['Rain runs down a bare hill and cuts little ditches into the dirt.', 'moving water'],
  ['Waves pound a seaside cliff until a chunk of it tumbles in.', 'moving water'],
  ['A stream bends around a curve and nibbles away its outside bank each year.', 'moving water'],
  ['Melting snow rushes downhill in spring and drags soil into the creek.', 'moving water'],
  ['A bare field has no plants. On a gusty day the loose dirt rises in a brown cloud.', 'wind'],
  ['Blowing sand scrapes a desert rock for years until it is smooth and thin near the bottom.', 'wind'],
  ['A dust storm sweeps dry topsoil off a farm and drops it miles away.', 'wind'],
  ['Loose sand keeps piling into new hills on the beach on breezy days.', 'wind'],
  ['A glacier grinds down a mountain and carves out a deep, wide valley.', 'ice'],
  ['Water freezes inside a crack in a rock, pushes the crack wider, and a piece snaps off.', 'ice'],
  ['Packed snow on a mountain top creeps downhill and shoves boulders along with it.', 'ice'],
];

// [question, answer, [3 distractors], why]
const C4SB_EROSION_DEF = [
  ['What is <b>erosion</b>?', 'Wind, water, or ice carrying bits of land away.',
    ['Rain making plants grow taller.', 'The ground shaking in an earthquake.', 'Land getting bigger each year.'],
    'Erosion means pieces of land get picked up and moved somewhere else.'],
  ['Most erosion happens…', 'slowly, over many years',
    ['in one loud second', 'only at night', 'only inside caves'],
    'Grain by grain, wind and water move land so slowly you usually cannot watch it happen.'],
  ['Which one does NOT cause erosion?', 'thick grass',
    ['blowing wind', 'running water', 'sliding ice'],
    'Grass does the opposite — its roots hold soil in place.'],
  ['A hill has no plants at all on it. What happens when a big storm comes?', 'Rain washes soil off the hill.',
    ['The hill grows taller.', 'The soil turns into stone.', 'Nothing at all changes.'],
    'With no roots gripping it, bare soil rides away with the running water.'],
];

// [situation, best fix, [3 distractors], why]
const C4SB_EROSION_FIX = [
  ['Rain keeps washing soil off a bare hill behind the school.',
    'Plant grass so the roots hold the soil.',
    ['Rake the hill until the dirt is loose and smooth.', 'Take away the bushes at the bottom.', 'Water the hill with a hose each morning.'],
    'Roots reach down and grip the dirt like thousands of tiny fingers.'],
  ['Waves keep pulling sand off the beach in front of the dunes.',
    'Plant beach grass on the dunes.',
    ['Sweep the loose sand toward the water.', 'Drive trucks over the top of the dune.', 'Dig a wide hole in the middle of the dune.'],
    'Beach grass roots knit the sand together so waves and wind cannot carry it off.'],
  ['Wind blows the topsoil off a flat, open farm field.',
    'Plant a long row of trees to block the wind.',
    ['Cut down the trees already near the field.', 'Plow the field and leave it bare.', 'Blow the loose dirt around with a leaf blower.'],
    'A line of trees is a windbreak. It slows the wind down before it ever reaches the soil.'],
  ['The bank of a stream is crumbling into the water.',
    'Lay heavy rocks along the bank.',
    ['Pull out the plants growing on the bank.', 'Walk up and down the bank every day.', 'Pour buckets of water down the bank.'],
    'Big rocks take the hit from the moving water, so the soft dirt behind them stays put.'],
  ['Dirt washes down a steep garden slope in every storm.',
    'Build a low stone wall across the slope.',
    ['Make the slope even steeper than it is now.', 'Sweep all the mulch off the slope.', 'Leave the dirt bare and freshly loosened.'],
    'A wall across the slope catches running water and the soil it is carrying.'],
  ['Rain splashes soil right out of the flower bed.',
    'Spread mulch over the bare dirt.',
    ['Point the roof downspout at the flower bed.', 'Pull out all of the flowers.', 'Turn the soil over so it is loose and fluffy.'],
    'Mulch softens the punch of every falling raindrop before it hits the soil.'],
  ['A hiking trail down a hill is turning into a muddy ditch.',
    'Add wooden steps across the trail to slow the water down.',
    ['Dig the trail deeper.', 'Widen the bare trail.', 'Let more people run straight down it.'],
    'Steps break the slope into short pieces, so water never picks up much speed.'],
  ['Waves are eating away the edge of the lake shore.',
    'Set big rocks along the shore.',
    ['Pull the reeds out of the shallow water.', 'Shovel the shore sand into the lake.', 'Smooth the shore into a bare ramp.'],
    'The rocks soak up the punch of each wave so the soil behind them is safe.'],
  ['The playground hill loses dirt in every rainstorm.',
    'Cover it with rolls of grass sod.',
    ['Sweep it clean after each rain.', 'Pile loose dry sand on top of it.', 'Wear a bare path straight down the middle.'],
    'Sod is grass plus roots, so it protects the hill the very day you lay it down.'],
  ['A field beside a river loses soil whenever the river floods.',
    'Grow a strip of tall plants between the field and the river.',
    ['Mow the plants by the river down to nothing.', 'Take away the fallen logs and rocks.', 'Scrape the river bank flat and smooth.'],
    'A strip of tall plants acts like a comb — it slows the flood water and catches the soil.'],
  ['Sand blows off a desert road on every windy day.',
    'Build a fence to catch the blowing sand.',
    ['Sweep the sand into a tall, loose pile.', 'Make the bare road even wider.', 'Drive faster along the road.'],
    'Sand piles up against the fence instead of flying across the road.'],
  ['Workers just cleared every bush and tree off a hillside.',
    'Plant new ground cover right away.',
    ['Wait a year and see what happens.', 'Scrape off the leftover leaves.', 'Cut deep grooves into the mud with a shovel.'],
    'Bare soil starts washing away in the very first storm, so new plants cannot wait.'],
];

// [question, answer, [3 distractors], why]
const C4SB_EROSION_WHY = [
  ['Grass was planted on a bare hill. Why does that slow erosion?',
    'Roots grip the soil and hold it down.',
    ['Grass makes the rain fall somewhere else instead.', 'Grass turns loose soil into hard rock.', 'Grass pushes the whole hill uphill.'],
    'Roots spread out under the ground and hold the soil together.'],
  ['Why do big rocks along a stream bank slow erosion?',
    'They take the hit from the moving water.',
    ['They soak up the entire stream.', 'They make the water flow much faster.', 'They stop the rain from ever falling on that spot.'],
    'The rocks are too heavy to wash away, so the soft dirt behind them is protected.'],
  ['Why does mulch slow erosion in a garden?',
    'It softens the splash of raindrops.',
    ['It makes the soil slippery so water slides off.', 'It glues the plants down to the ground.', 'It keeps the sun from coming up.'],
    'Bare raindrops knock soil grains loose. Mulch takes the hit instead.'],
  ['Why does a row of trees help a windy farm field?',
    'The trees slow the wind down.',
    ['The trees drink the wind up through their roots.', 'The trees make soil heavier than wind.', 'The trees turn the wind into rain.'],
    'Slower wind cannot lift soil, so the topsoil stays on the field.'],
  ['Why does a steep hill lose more soil than a flat field in the same storm?',
    'Water runs faster downhill, so it carries more dirt.',
    ['Steep hills always get much more rain than flat fields do.', 'Flat fields have no soil in them.', 'Steep hills are made of lighter dirt.'],
    'The faster water moves, the bigger the pieces it can pick up and carry.'],
  ['Why does bare dirt wash away faster than dirt covered with plants?',
    'Nothing holds it, so raindrops knock grains loose.',
    ['Bare dirt is always frozen solid.', 'Bare dirt cannot get wet at all.', 'Bare dirt is much heavier than dirt with plants in it.'],
    'Plants and roots are the seat belt for soil. Without them, soil rides away.'],
  ['Why do farmers plow their rows ACROSS a hill instead of straight up and down?',
    'The rows act like little walls.',
    ['It makes the tractor drive faster.', 'It keeps the sunlight off the brand-new seeds.', 'It makes the hill flatter every year.'],
    'Rows that run up and down would be tiny water slides carrying soil away.'],
  ['Why does a sand fence keep a beach dune in place?',
    'Blowing sand piles up against it.',
    ['The fence makes the wind stop blowing altogether.', 'The fence turns loose sand into rock.', 'The fence heats the sand so it sticks.'],
    'The fence slows the wind, and slow wind drops the sand it was carrying.'],
];

SKILLS.push(
  {
    id: 'sci_erosion', strand: 'earth', name: 'Slow the wearing away',
    gen: (lvl = 2) => {
      const roll = ri(1, 10);
      let mode = 'cause';
      if (lvl === 1) { mode = roll <= 7 ? 'cause' : 'def'; }
      if (lvl === 2) { mode = roll <= 6 ? 'fix' : 'cause'; }
      if (lvl === 3) { mode = roll <= 6 ? 'why' : 'fix'; }

      if (mode === 'def') {
        const d = pick(C4SB_EROSION_DEF);
        const key = d[1];
        return { prompt: d[0], type: 'mc', choices: shuffle([key].concat(d[2])), answer: key, explain: d[3] };
      }
      if (mode === 'fix') {
        const f = pick(C4SB_EROSION_FIX);
        const key = f[1];
        return {
          prompt: `${f[0]}<br>Which idea would <b>slow the erosion</b> best?`,
          type: 'mc', choices: shuffle([key].concat(f[2])), answer: key, explain: f[3],
        };
      }
      if (mode === 'why') {
        const w = pick(C4SB_EROSION_WHY);
        const key = w[1];
        return { prompt: w[0], type: 'mc', choices: shuffle([key].concat(w[2])), answer: key, explain: w[3] };
      }
      const c = pick(C4SB_EROSION_CAUSE);
      const key = c[1];
      const others = [];
      for (let i = 0; i < C4SB_MOVERS.length; i++) {
        if (C4SB_MOVERS[i] !== key) { others.push(C4SB_MOVERS[i]); }
      }
      others.push(pick(C4SB_HOLDERS));
      return {
        prompt: `${c[0]}<br>What is <b>moving the land</b> here?`,
        type: 'mc', choices: shuffle([key].concat(others)), answer: key,
        explain: `This is <b>${key}</b> doing the work. Plants, walls, and rocks do the opposite — they hold land in place.`,
      };
    },
  },
);

// ------------------------------------------------------------
// 3. sci_define_problem — Name the problem
// ------------------------------------------------------------
// NOTE: the correct answer lives in the named field `problem`.
// It is NEVER picked out of the `wrong` array.

const C4SB_PROBLEM_BANK = [
  { s: 'Every time Mia carries her lunch tray, her milk tips over.',
    problem: 'The milk tips over when the tray moves.',
    wrong: ['Mia should tape the milk carton to her tray.', 'Mia drinks milk with her lunch every single day.', 'Build a lunch tray with a round cup holder in it.'] },
  { s: 'The class garden dries out over the weekend and the plants droop by Monday.',
    problem: 'The plants get no water for two whole days.',
    wrong: ['Make a bottle that drips water out slowly.', 'The garden sits beside the playground fence.', 'Ask the school janitor to water them Saturday.'] },
  { s: "Ben's bedroom door slams shut whenever his window is open.",
    problem: 'Wind from the window pushes the door closed.',
    wrong: ['Slide a heavy doorstop under the door.', "Ben's room is at the top of the stairs.", 'Shut the window before bedtime every night.'] },
  { s: "The dog's water bowl slides across the kitchen while he drinks.",
    problem: 'The bowl slips on the smooth floor.',
    wrong: ['Glue a ring of rubber under the bowl.', 'The dog is a brown puppy named Scout.', 'Feed the dog out on the back porch instead.'] },
  { s: 'Rain drips off the roof right onto the front steps, and the steps turn slippery.',
    problem: 'Water lands on the steps and makes them slick.',
    wrong: ['Add a gutter above the front door.', 'The front door of the house is painted red.', 'Lay a rough mat over the steps.'] },
  { s: 'Kids in Room 12 keep losing their pencils under the desks.',
    problem: 'Pencils roll right off the flat desktop.',
    wrong: ['Make a desk with a little groove along the top.', 'Everyone in the class uses yellow pencils.', 'Hand each kid two pencils instead of one.'] },
  { s: 'The classroom door is heavy, and the smallest kids cannot pull it open.',
    problem: 'The door is too heavy for small hands.',
    wrong: ['Put a lighter handle down at kid height.', 'The classroom door is painted a soft blue.', 'Ask a grown-up to open it every time.'] },
  { s: "Sam's backpack straps dig into his shoulders when he carries his books.",
    problem: 'The thin straps press hard on his shoulders.',
    wrong: ['Sew soft padding onto both straps.', 'Sam walks eight blocks to school.', 'Take fewer books home each afternoon.'] },
  { s: 'The bird feeder swings in the wind, and all the seed spills onto the grass.',
    problem: 'Seed falls out when the feeder swings.',
    wrong: ['Hang the feeder from two ropes instead of one.', 'The birds in the yard like sunflower seeds.', 'Only fill the feeder up halfway.'] },
  { s: 'The paper towels in the art room sit in a sink puddle and go soggy.',
    problem: 'The towels sit in water on the counter.',
    wrong: ['Move the towels to a shelf above the sink.', 'The art room has four sinks in a row.', 'Buy much thicker paper towels.'] },
  { s: 'When Lily rides her scooter at dusk, drivers do not notice her.',
    problem: 'Lily is hard to see in dim light.',
    wrong: ['Clip a blinking light onto the scooter.', "Lily's scooter is silver with black wheels.", 'Ride the scooter only in the morning.'] },
  { s: 'The lid pops off the compost bin, and raccoons get into it at night.',
    problem: 'The lid does not stay shut.',
    wrong: ['Add a metal latch to the lid.', 'The compost bin is made of green plastic.', 'Move the bin into the garage.'] },
  { s: 'Snow piles in front of the school door and freezes into a sheet of ice.',
    problem: 'The doorway gets icy and slippery.',
    wrong: ['Spread a bucket of sand over the ice.', 'The school building has a flat gray roof.', 'Shovel the doorway every single morning.'] },
  { s: 'Papers fly off the classroom windowsill whenever the fan is switched on.',
    problem: 'Moving air blows the papers off.',
    wrong: ['Set a smooth rock on top of the paper stack.', 'The classroom fan is white with three speeds.', 'Turn the fan off during quiet work time.'] },
];

// [sentence, 'It names the problem.' or 'It gives a solution.']
const C4SB_PS_LINES = [
  ['The wheel keeps falling off the cart.', 'It names the problem.'],
  ['Add a bolt so the wheel cannot slide off.', 'It gives a solution.'],
  ['The soup gets cold before lunchtime.', 'It names the problem.'],
  ['Wrap the jar in a thick wool sock.', 'It gives a solution.'],
  ['Rain gets into the mail slot.', 'It names the problem.'],
  ['Build a little roof over the mail slot.', 'It gives a solution.'],
  ['The book tower falls over every time.', 'It names the problem.'],
  ['Put the biggest books on the bottom.', 'It gives a solution.'],
  ['The chalk snaps whenever we press hard.', 'It names the problem.'],
  ['Slide a paper tube around the chalk.', 'It gives a solution.'],
  ['Our shoes get soaked crossing the wet grass.', 'It names the problem.'],
  ['Lay flat stepping stones across the grass.', 'It gives a solution.'],
  ['The seeds wash out of the tray when we water it.', 'It names the problem.'],
  ['Water the tray with a gentle spray bottle.', 'It gives a solution.'],
];

SKILLS.push(
  {
    id: 'sci_define_problem', strand: 'sci_design', name: 'Name the problem',
    gen: (lvl = 2) => {
      if (lvl === 3 && ri(1, 10) <= 4) {
        const line = pick(C4SB_PS_LINES);
        return {
          prompt: `Engineers write problems and solutions.<br><b>"${line[0]}"</b><br>What is this sentence doing?`,
          type: 'mc',
          choices: ['It names the problem.', 'It gives a solution.'],
          answer: line[1],
          explain: 'A <b>problem</b> tells what is going wrong. A <b>solution</b> tells what to do about it.',
        };
      }
      const e = pick(C4SB_PROBLEM_BANK);
      const key = e.problem;
      const hint = lvl === 1
        ? '<br><b>Remember: a problem tells what is going WRONG. A solution tells what to DO.</b>'
        : '';
      return {
        prompt: `${e.s}${hint}<br>Which sentence <b>names the problem</b>? 🛠️`,
        type: 'mc',
        choices: shuffle([key].concat(e.wrong)),
        answer: key,
        explain: `<b>${key}</b> tells what is going wrong. The other sentences either say what to do about it or just add a fact.`,
      };
    },
  },
);

// ------------------------------------------------------------
// 4. sci_compare_designs — Which design worked better?
// ------------------------------------------------------------

const C4SB_TEST_BANK = [
  { goal: 'The teams wanted a paper boat that could hold the MOST pennies before it sank.',
    line: function (n, v) { return n + ' held ' + v + ' pennies before it sank.'; },
    names: ['Boat A', 'Boat B', 'Boat C'], better: 'more', lo: 4, hi: 24,
    moreTxt: 'held more pennies', lessTxt: 'held fewer pennies',
    why: 'A wide, flat bottom spreads the weight out, so the boat carries more before water spills in.' },
  { goal: 'The teams wanted a block tower that could stand as TALL as possible without tipping.',
    line: function (n, v) { return n + ' stood ' + v + ' centimeters tall before it tipped over.'; },
    names: ['Tower A', 'Tower B', 'Tower C'], better: 'more', lo: 12, hi: 60,
    moreTxt: 'stood taller', lessTxt: 'stood shorter',
    why: 'A wide base keeps a tower steady, so it can climb higher before it tips.' },
  { goal: 'The teams wanted a chute that made water run down as SLOWLY as possible.',
    line: function (n, v) { return n + ' took ' + v + ' seconds for the water to reach the bottom.'; },
    names: ['Chute A', 'Chute B', 'Chute C'], better: 'more', lo: 3, hi: 18,
    moreTxt: 'took more seconds', lessTxt: 'took fewer seconds',
    why: 'Bumps and gentle slopes slow water down. Slow water carries away less soil.' },
  { goal: 'The teams wanted a ramp that sent the toy car down as FAST as possible.',
    line: function (n, v) { return n + ' sent the car down in ' + v + ' seconds.'; },
    names: ['Ramp A', 'Ramp B', 'Ramp C'], better: 'less', lo: 2, hi: 15,
    moreTxt: 'took more seconds', lessTxt: 'took fewer seconds',
    why: 'Fewer seconds means faster. A smooth, steep ramp lets the wheels roll freely.' },
  { goal: 'The teams wanted a cup lid that let the LEAST water spill out.',
    line: function (n, v) { return n + ' spilled ' + v + ' milliliters of water when it was shaken.'; },
    names: ['Lid A', 'Lid B', 'Lid C'], better: 'less', lo: 2, hi: 40,
    moreTxt: 'spilled more water', lessTxt: 'spilled less water',
    why: 'A lid that seals all the way around keeps the water where it belongs.' },
  { goal: 'The teams wanted a paper bridge that could hold the MOST marbles.',
    line: function (n, v) { return n + ' held ' + v + ' marbles before it sagged to the table.'; },
    names: ['Bridge A', 'Bridge B', 'Bridge C'], better: 'more', lo: 3, hi: 30,
    moreTxt: 'held more marbles', lessTxt: 'held fewer marbles',
    why: 'Folding paper into ridges makes it much stiffer than a flat sheet.' },
  { goal: 'The teams wanted a parachute that fell as SLOWLY as it could.',
    line: function (n, v) { return n + ' took ' + v + ' seconds to reach the floor.'; },
    names: ['Parachute A', 'Parachute B', 'Parachute C'], better: 'more', lo: 2, hi: 14,
    moreTxt: 'took more seconds', lessTxt: 'took fewer seconds',
    why: 'A wider canopy catches more air, and trapped air pushes back on the fall.' },
  { goal: 'The teams wanted a seed cup that grew the TALLEST sprouts in one week.',
    line: function (n, v) { return n + ' grew sprouts ' + v + ' centimeters tall in one week.'; },
    names: ['Cup A', 'Cup B', 'Cup C'], better: 'more', lo: 2, hi: 18,
    moreTxt: 'grew taller sprouts', lessTxt: 'grew shorter sprouts',
    why: 'Light, water, and room for roots all help sprouts shoot up.' },
  { goal: 'The teams wanted a sun shade that kept the water as COOL as possible.',
    line: function (n, v) { return n + ' kept its water at ' + v + ' degrees after an hour in the sun.'; },
    names: ['Shade A', 'Shade B', 'Shade C'], better: 'less', lo: 55, hi: 95,
    moreTxt: 'stayed warmer', lessTxt: 'stayed cooler',
    why: 'A shade that blocks more sunlight keeps the heat from reaching the water.' },
  { goal: 'The teams wanted a wind wall that kept the MOST sand in the tray.',
    line: function (n, v) { return n + ' kept ' + v + ' grams of sand in the tray after the fan blew.'; },
    names: ['Wall A', 'Wall B', 'Wall C'], better: 'more', lo: 20, hi: 90,
    moreTxt: 'kept more sand', lessTxt: 'kept less sand',
    why: 'A taller, closer wall blocks more wind, so less sand ever lifts off.' },
  { goal: 'The teams wanted a lunch bag that kept an ice cube frozen the LONGEST.',
    line: function (n, v) { return n + ' still had ice after ' + v + ' minutes.'; },
    names: ['Bag A', 'Bag B', 'Bag C'], better: 'more', lo: 10, hi: 90,
    moreTxt: 'kept its ice longer', lessTxt: 'kept its ice for less time',
    why: 'Thick, shiny layers slow the room’s heat down on its way to the ice.' },
  { goal: 'The teams wanted a paper airplane that flew the FARTHEST.',
    line: function (n, v) { return n + ' flew ' + v + ' feet down the hallway.'; },
    names: ['Plane A', 'Plane B', 'Plane C'], better: 'more', lo: 5, hi: 40,
    moreTxt: 'flew farther', lessTxt: 'flew a shorter way',
    why: 'Sharp, even folds let a plane slice through the air instead of wobbling.' },
  { goal: 'The teams wanted a hill cover that lost the LEAST soil in the rain test.',
    line: function (n, v) { return n + ' lost ' + v + ' grams of soil when we poured water on it.'; },
    names: ['Hill A', 'Hill B', 'Hill C'], better: 'less', lo: 2, hi: 45,
    moreTxt: 'lost more soil', lessTxt: 'lost less soil',
    why: 'Roots and mulch hold soil down, so the running water cannot carry it away.' },
  { goal: 'The teams wanted a shoe sole that stayed put on the steepest ramp.',
    line: function (n, v) { return n + ' stayed put until the ramp was ' + v + ' blocks high.'; },
    names: ['Sole A', 'Sole B', 'Sole C'], better: 'more', lo: 2, hi: 16,
    moreTxt: 'gripped the ramp longer', lessTxt: 'slid off sooner',
    why: 'A bumpy, rubbery sole grabs the ramp instead of sliding across it.' },
];

// [question, answer, [3 distractors], why]
const C4SB_DESIGN_WHY = [
  ['Cup A had a snap-on lid. Cup B had no lid. Both were shaken the same way, and Cup A spilled less. Why?',
    'The lid stopped the sloshing water.',
    ['Cup A was made of heavier plastic.', 'Cup B was filled with air, not water.', 'Shaking a cup makes water disappear.'],
    'The lid was the only difference between the two cups, so the lid is what made the difference.'],
  ['Tower A had a wide base. Tower B had a narrow base. Tower A stood taller before tipping. Why?',
    'A wide base is harder to tip over.',
    ['Narrow towers are made of stronger blocks.', 'Tall towers are always lighter.', 'Tower B had more blocks in it.'],
    'A wide base spreads the weight, so the tower can lean a little without falling.'],
  ['Parachute A was big. Parachute B was small. Both were dropped from the same spot, and A landed last. Why?',
    'A big parachute catches more air.',
    ['A bigger parachute weighs less than air.', 'Small parachutes are heavier than big ones.', 'The small one was dropped from higher up.'],
    'Trapped air pushes up on the canopy, and more canopy means more push.'],
  ['Team A loaded pennies into their boat. Team B loaded marbles into theirs. Why is that test unfair?',
    'They did not use the same weights, so the boats were not really compared.',
    ['Pennies always sink every boat.', 'Marbles are too round to count.', 'Boats can only be tested in salt water.'],
    'A fair test changes only ONE thing. Here the boats AND the weights were different.'],
  ['Hill A was covered in grass. Hill B was bare dirt. The same amount of water was poured on each, and Hill A lost less soil. Why?',
    'Roots hold the soil in place.',
    ['Grass makes water bounce back up into the air.', 'Bare dirt weighs more than grassy dirt.', 'Hill A was made of larger stones.'],
    'The grass was the only difference, and roots are what grip soil.'],
  ['Bag A had foil inside. Bag B had only paper. Each got one ice cube the same size, and Bag A kept its ice longer. Why?',
    'The foil kept outside heat away.',
    ['Paper bags are always warmer than the room.', 'Foil makes ice colder than freezing.', 'Bag B was left open the whole time.'],
    'Shiny foil bounces heat away, so it takes the room longer to melt the cube.'],
  ['Ramp A was smooth wood. Ramp B was rough carpet. Both were propped at the same height, and the car rolled faster on Ramp A. Why?',
    'The smooth ramp rubs less on the wheels.',
    ['Carpet makes toy cars heavier.', 'Rough ramps are always steeper.', 'Ramp A was tilted much higher.'],
    'Rubbing is called friction. Less friction lets the wheels spin freely.'],
  ['A team tested their bridge one time and it held 10 marbles. Why should they test it again?',
    'One test could be luck. Testing again shows if it repeats.',
    ['Testing again makes the bridge stronger.', 'A first test never counts at all.', 'Bridges must be tested exactly ten times.'],
    'Engineers repeat a test so they know the result was real, not a one-time fluke.'],
];

function C4SB_vals(lo, hi, n, gap) {
  const out = [];
  let guard = 0;
  while (out.length < n && guard < 500) {
    guard++;
    const v = ri(lo, hi);
    let ok = true;
    for (let i = 0; i < out.length; i++) {
      if (Math.abs(out[i] - v) < gap) { ok = false; }
    }
    if (ok) { out.push(v); }
  }
  while (out.length < n) { out.push(lo + out.length * gap); }
  return out;
}

// Level 1 only uses tests where the BIGGER number wins — easier to read.
const C4SB_TEST_MORE = [];
for (let i = 0; i < C4SB_TEST_BANK.length; i++) {
  if (C4SB_TEST_BANK[i].better === 'more') { C4SB_TEST_MORE.push(C4SB_TEST_BANK[i]); }
}

const C4SB_NONE = [
  'Neither one won — both tests came out the same.',
  'We cannot tell, because nothing was measured.',
];

SKILLS.push(
  {
    id: 'sci_compare_designs', strand: 'sci_design', name: 'Which design worked better?',
    gen: (lvl = 2) => {
      if (lvl === 3 && ri(1, 10) <= 4) {
        const w = pick(C4SB_DESIGN_WHY);
        const key = w[1];
        return { prompt: w[0], type: 'mc', choices: shuffle([key].concat(w[2])), answer: key, explain: w[3] };
      }

      const e = lvl === 1 ? pick(C4SB_TEST_MORE) : pick(C4SB_TEST_BANK);
      const many = lvl === 3;
      const count = many ? 3 : 2;
      const gap = lvl === 1 ? Math.max(4, Math.round((e.hi - e.lo) / 4)) : 2;
      const vals = C4SB_vals(e.lo, e.hi, count, gap);
      const names = e.names.slice(0, count);
      const order = shuffle([0, 1, 2].slice(0, count));

      // pair each name with a value
      const rows = [];
      for (let i = 0; i < count; i++) { rows.push([names[i], vals[order[i]]]); }

      let bestI = 0;
      let worstI = 0;
      for (let i = 1; i < rows.length; i++) {
        if (e.better === 'more') {
          if (rows[i][1] > rows[bestI][1]) { bestI = i; }
          if (rows[i][1] < rows[worstI][1]) { worstI = i; }
        } else {
          if (rows[i][1] < rows[bestI][1]) { bestI = i; }
          if (rows[i][1] > rows[worstI][1]) { worstI = i; }
        }
      }

      let lines = '';
      for (let i = 0; i < rows.length; i++) { lines += e.line(rows[i][0], rows[i][1]) + '<br>'; }

      const winTxt = e.better === 'more' ? e.moreTxt : e.lessTxt;
      const loseTxt = e.better === 'more' ? e.lessTxt : e.moreTxt;
      const W = rows[bestI][0];
      const L = rows[worstI][0];
      const vW = rows[bestI][1];
      const vL = rows[worstI][1];

      if (many) {
        const askWorst = ri(1, 10) <= 4;
        const mid = [];
        for (let i = 0; i < rows.length; i++) {
          if (i !== bestI && i !== worstI) { mid.push(rows[i][0]); }
        }
        const midName = mid.length ? mid[0] : rows[0][0];
        if (askWorst) {
          const key = `${L}, because it ${loseTxt} than the other two.`;
          const choices = [
            key,
            `${midName}, because it ${loseTxt} than the other two.`,
            `${W}, because it ${loseTxt} than the other two.`,
            'All three did exactly the same.',
          ];
          return {
            prompt: `<b>${e.goal}</b><br>${lines}Which design worked <b>worst</b>?`,
            type: 'mc', choices: shuffle(choices), answer: key,
            explain: `${L} ${loseTxt} (${vL} compared with ${vW} for ${W}). ${e.why}`,
          };
        }
        const key = `${W}, because it ${winTxt} than the other two.`;
        const choices = [
          key,
          `${midName}, because it ${winTxt} than the other two.`,
          `${L}, because it ${winTxt} than the other two.`,
          'All three did exactly the same.',
        ];
        return {
          prompt: `<b>${e.goal}</b><br>${lines}Which design worked <b>best</b>?`,
          type: 'mc', choices: shuffle(choices), answer: key,
          explain: `${W} ${winTxt} (${vW} compared with ${vL} for ${L}). ${e.why}`,
        };
      }

      const key = `${W}, because it ${winTxt}.`;
      const cmp = e.better === 'more' ? 'more' : 'less';
      const choices = [
        key,
        `${L}, because it ${winTxt}.`,
        `${L}, because ${vL} is ${cmp} than ${vW}.`,
        pick(C4SB_NONE),
      ];
      return {
        prompt: `<b>${e.goal}</b><br>${lines}Which design worked <b>better</b>? 📏`,
        type: 'mc', choices: shuffle(choices), answer: key,
        explain: `${W} ${winTxt} — ${vW} compared with ${vL}. ${e.why}`,
      };
    },
  },
);

/* ============================================================
   LEARNING GARDEN — Social Studies slice A
   Globe vs map, nested places, landforms, human-environment,
   community types, rights & responsibilities, cultures.
   Uses EXISTING strands soc_maps and soc_community.
   ============================================================ */

// helpers ----------------------------------------------------
// bank entry shape: { q, a, d:[w1,w2,w3], why, lv:1|2|3 }
const C4CA_pool = (bank, lvl) => {
  const L = (lvl === 1 || lvl === 3) ? lvl : 2;
  let pool;
  if (L === 1) pool = bank.filter((e) => e.lv === 1);
  else if (L === 2) pool = bank.filter((e) => e.lv <= 2);
  else {
    pool = bank.filter((e) => e.lv === 3);
    if (pool.length < 4) pool = bank.filter((e) => e.lv >= 2);
  }
  return pool.length ? pool : bank;
};

const C4CA_ask = (bank, lvl) => {
  const e = pick(C4CA_pool(bank, lvl));
  const ans = e.a;
  return {
    prompt: e.q, type: 'mc',
    choices: shuffle([ans].concat(e.d)),
    answer: ans, explain: e.why,
  };
};

const C4CA_cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ------------------------------------------------------------
// 1. Globe or map?
// ------------------------------------------------------------
const C4CA_GLOBE = [
  { lv: 1, q: 'Which one is <b>round</b>, shaped just like Earth?', a: 'a globe', d: ['a paper map', 'a map on a wall', 'a folded road map'], why: 'A globe is round because Earth is round. A map is flat.' },
  { lv: 1, q: 'Which one is <b>flat</b> and can be folded and put in a backpack?', a: 'a map', d: ['a globe', 'a basketball', 'a snow globe'], why: 'Maps are flat, so they fold up small and travel easily.' },
  { lv: 1, q: 'A globe is a small model of what?', a: 'the whole Earth', d: ['one city', 'the Moon', 'a park near your house'], why: 'A globe copies all of Earth — every ocean and continent — in a small round shape.' },
  { lv: 1, q: 'Do maps and globes show real places or made-up places?', a: 'real places', d: ['places from storybooks only', 'places nobody has ever visited', 'made-up places'], why: 'Both tools show real land and real water that you could truly visit.' },
  { lv: 1, q: 'What shape is a map?', a: 'flat', d: ['round like a ball', 'shaped like a cube', 'shaped like a cone'], why: 'Maps are flat pictures of places, drawn from above.' },
  { lv: 1, q: 'Which one can you <b>spin</b> around to see every side of Earth?', a: 'a globe', d: ['a paper map', 'a book page', 'a wall poster'], why: 'A globe turns on a stand, so you can spin it and see all of Earth.' },
  { lv: 1, q: 'Which one shows the true round shape of Earth best?', a: 'a globe', d: ['a flat map', 'a list of country names', 'a photo of your street'], why: 'Because a globe is round like Earth, it shows Earth\'s real shape.' },
  { lv: 1, q: 'Maps and globes both help people do what?', a: 'find places', d: ['tell time', 'cook dinner', 'measure how tall you are'], why: 'Both are tools for finding where places are in the world.' },
  { lv: 1, q: 'Which one would fit inside a coat pocket?', a: 'a folded map', d: ['a globe', 'a globe on a tall stand', 'a beach ball globe'], why: 'Flat maps fold. Globes are round and bumpy, so they do not fold.' },
  { lv: 2, q: 'Your family is hiking and wants to follow the trails. Which helps most?', a: 'a trail map', d: ['a globe', 'a picture of the whole Earth', 'a list of the 7 continents'], why: 'A close-up map shows small things like trails. A globe shows the whole planet.' },
  { lv: 2, q: 'Why do classrooms hang flat world maps on the wall?', a: 'maps are flat, so they fit on a wall', d: ['maps are the only tool that shows real places on Earth', 'globes cannot show any oceans', 'maps show more than a globe does'], why: 'Flat maps hang or fold anywhere. Globes need a stand and take up space.' },
  { lv: 2, q: 'A flat world map has to stretch some parts of Earth. Which parts get stretched most?', a: 'the top and bottom', d: ['the middle', 'the oceans only', 'nothing gets stretched'], why: 'Flattening a round Earth stretches the very top and bottom areas.' },
  { lv: 2, q: 'Which tool shows the whole Earth without stretching any part?', a: 'a globe', d: ['a flat world map', 'a map of your state', 'a map of your school'], why: 'A globe is round like Earth, so nothing has to be stretched.' },
  { lv: 3, q: 'Ms. Lee wants to show how far apart two continents really are. Which tool is best?', a: 'a globe', d: ['a map of one country', 'a street map of the town', 'a map of the school playground'], why: 'A globe keeps real distances, so far-apart places look truly far apart.' },
  { lv: 3, q: 'You need to walk to the library 3 blocks away. Which is most useful?', a: 'a neighborhood map', d: ['a globe', 'a world map', 'a map of the whole country'], why: 'For close-up trips you need a close-up map. A globe cannot show your streets.' },
  { lv: 3, q: 'Which can a map <b>and</b> a globe both show you?', a: 'where the oceans are', d: ['what the weather will be tomorrow', 'how old a building is', 'what time your school starts'], why: 'Both tools show land and water — but neither one knows the weather or the time.' },
  { lv: 3, q: 'A globe and a map are different in shape. What is the SAME about them?', a: 'both show real places', d: ['both are round like a ball', 'both fold up and fit in a pocket', 'both spin around on a stand'], why: 'Shape is different, job is the same: showing where real places are.' },
  { lv: 3, q: 'A pilot plans a flight right over the North Pole. Which tool shows that path most truly?', a: 'a globe', d: ['a flat world map', 'a map of one city', 'a subway map'], why: 'At the top of a globe, the curve of Earth is real, not stretched.' },
  { lv: 3, q: 'Which is a good reason to pick a flat map instead of a globe?', a: 'you can fold it and carry it', d: ['it shows the real round shape of Earth', 'it never stretches any of the land', 'it can spin all the way around'], why: 'Maps win on packing. Globes win on showing Earth\'s true shape.' },
];

// ------------------------------------------------------------
// 2. Biggest to smallest (nested places)
// ------------------------------------------------------------
const C4CA_LADDER = [
  'your bedroom', 'your home', 'your street', 'your neighborhood',
  'your town or city', 'your state', 'your country', 'your continent',
  'the planet Earth',
];
const C4CA_LADDER_HINT = '<br><span style="font-size:.85em">bedroom &rarr; home &rarr; street &rarr; neighborhood &rarr; town or city &rarr; state &rarr; country &rarr; continent &rarr; planet Earth</span>';

// ------------------------------------------------------------
// 3. Landforms and water
// ------------------------------------------------------------
const C4CA_LAND = [
  { lv: 1, q: 'Which landform is the tallest, with rocky peaks and sometimes snow on top?', a: 'a mountain', d: ['a valley', 'a flat open plain', 'a river'], why: 'Mountains are the tallest landforms. Some are so tall the tops stay snowy.' },
  { lv: 1, q: 'What do we call a wide area of land that is flat, with almost no hills?', a: 'a plain', d: ['a mountain', 'a valley', 'an island'], why: 'A plain is flat, open land. Lots of food is grown on plains.' },
  { lv: 1, q: 'What is the low land between two mountains called?', a: 'a valley', d: ['a peak', 'a plain', 'a desert'], why: 'A valley is the low, dipped-down land between higher land.' },
  { lv: 1, q: 'What is land with water all the way around it?', a: 'an island', d: ['a peninsula', 'a valley', 'a mountain'], why: 'An island is surrounded by water on every single side.' },
  { lv: 1, q: 'Which one is water that flows and moves, often all the way to the sea?', a: 'a river', d: ['a lake', 'a hill', 'an island'], why: 'A river keeps moving. A lake mostly stays in one place.' },
  { lv: 1, q: 'Which is a body of water with land all around it?', a: 'a lake', d: ['a river', 'an ocean', 'a mountain'], why: 'A lake sits in a low spot with land circling it.' },
  { lv: 1, q: 'Which is the biggest body of salty water?', a: 'an ocean', d: ['a pond', 'a puddle', 'a small stream'], why: 'Oceans are huge and salty. They cover most of Earth.' },
  { lv: 1, q: 'What is a very dry place that gets almost no rain?', a: 'a desert', d: ['a forest', 'a swamp', 'a lake'], why: 'A desert is dry. Plants there, like cactus, save water inside them.' },
  { lv: 1, q: 'What do we call land covered with many, many trees?', a: 'a forest', d: ['a desert', 'a plain', 'a beach'], why: 'A forest is full of trees, and many animals make homes there.' },
  { lv: 1, q: 'A hill is like a small ___.', a: 'mountain', d: ['lake', 'ocean', 'deep valley'], why: 'Hills and mountains both rise up, but a hill is much shorter.' },
  { lv: 2, q: 'Land with water on three sides, joined to more land on one side, is called...', a: 'a peninsula', d: ['an island', 'a valley', 'a lake'], why: 'A peninsula sticks out into the water but still holds on to the land.' },
  { lv: 2, q: 'Which one is taller — a hill or a mountain?', a: 'a mountain', d: ['a hill', 'they are exactly the same', 'a valley'], why: 'Mountains rise much higher than hills. Hills are gentle and rounded.' },
  { lv: 2, q: 'Rivers usually keep flowing until they reach what?', a: 'an ocean or a lake', d: ['the very top of a tall snowy mountain', 'the middle of a dry desert cave', 'a cloud in the sky'], why: 'Water flows downhill, so rivers end in a lower place like a lake or the ocean.' },
  { lv: 2, q: 'Farmers grow lots of crops on which landform, because it is flat with good soil?', a: 'a plain', d: ['a rocky cliff', 'a mountain peak', 'a sand dune'], why: 'Flat land is easy to plow, and plains often have rich soil.' },
  { lv: 3, q: 'A boat sails all the way around a piece of land without ever touching shore. That land must be...', a: 'an island', d: ['a peninsula', 'a valley', 'a plain'], why: 'Only an island has water on every side, so a boat can circle it.' },
  { lv: 3, q: 'Cactus plants, sand, and hardly any rain all year. What place is this?', a: 'a desert', d: ['a rainy forest', 'a snowy mountain top', 'a deep lake'], why: 'Deserts are dry, and cactus plants store water to live there.' },
  { lv: 3, q: 'Which list goes from the LOWEST land up to the HIGHEST?', a: 'valley, hill, mountain', d: ['mountain, hill, valley', 'hill, mountain, valley', 'mountain, valley, hill'], why: 'A valley is low, a hill is higher, and a mountain is highest of all.' },
  { lv: 3, q: 'Sam swims in water that tastes salty and has big rolling waves. Where is Sam?', a: 'the ocean', d: ['a river', 'a swimming pool', 'a pond'], why: 'Ocean water is salty and its waves roll in to the shore.' },
  { lv: 3, q: 'Which pair are BOTH bodies of water?', a: 'a lake and a river', d: ['a hill and a mountain', 'a plain and a valley', 'an island and a desert'], why: 'Lakes and rivers hold water. Hills, plains, valleys, and deserts are land.' },
  { lv: 3, q: 'An island and a peninsula both touch water. What makes an island different?', a: 'water surrounds it on every side', d: ['a peninsula is always covered in deep snow', 'an island is always the bigger one', 'a peninsula never has any water near it'], why: 'A peninsula still connects to land on one side. An island does not.' },
];

// ------------------------------------------------------------
// 4. People and places fit together
// ------------------------------------------------------------
const C4CA_HUMENV = [
  { lv: 1, q: 'Nina lives where it snows all winter. What does she wear to play outside?', a: 'a heavy winter coat', d: ['a swimsuit', 'flip-flops', 'a sun hat and shorts'], why: 'Cold weather means warm clothes, so your body stays cozy and safe.' },
  { lv: 1, q: 'In a place that is hot and sunny all year, what do people often wear?', a: 'light, thin clothes', d: ['thick wool coats', 'snow boots', 'fur mittens and a scarf'], why: 'Thin clothes let heat escape, so people stay cooler in hot weather.' },
  { lv: 1, q: 'Why do houses in snowy places often have steep, pointy roofs?', a: 'so snow slides off', d: ['so birds can land on top', 'so the house looks taller', 'so rain stays on the roof'], why: 'Piled-up snow is very heavy. A steep roof lets it slide right off.' },
  { lv: 1, q: 'People who live right beside the ocean often have which job?', a: 'fishing', d: ['plowing snow', 'guiding sled dogs', 'picking cactus fruit'], why: 'People use what is near them. Near the ocean, that means fish.' },
  { lv: 1, q: 'Farming is easiest on which kind of land?', a: 'a flat plain', d: ['a rocky mountain top', 'the middle of a lake', 'a steep cliff'], why: 'Flat land with good soil is easy to plow, plant, and water.' },
  { lv: 1, q: 'A town gets heavy snow every winter. What does the town buy for its streets?', a: 'snowplows', d: ['sailboats', 'lawn mowers', 'beach umbrellas'], why: 'Snowplows push snow off the road so cars and buses can drive safely.' },
  { lv: 1, q: 'In a hot desert town, why do many homes have thick walls and small windows?', a: 'to keep the hot sun out', d: ['to keep snow off the roof', 'to let in more wind', 'to make the house taller'], why: 'Thick walls and tiny windows block the sun, so inside stays cooler.' },
  { lv: 1, q: 'Why do some homes near rivers stand up high on tall stilts?', a: 'so floodwater passes underneath', d: ['so the house is closer to the clouds', 'so the roof stays warm', 'so the walls do not need paint'], why: 'Rivers sometimes flood. Stilts lift the home above the rising water.' },
  { lv: 1, q: 'A town is built next to a big river. What is one reason people chose that spot?', a: 'they can get water and travel by boat', d: ['the river stops snow from ever falling', 'the river makes the sun shine brighter', 'rivers keep the wind from blowing'], why: 'Rivers give people drinking water, food, and an easy path for boats.' },
  { lv: 2, q: 'Why do people dig tunnels through mountains?', a: 'to travel through instead of over', d: ['to make the mountain taller', 'to keep the mountain warm', 'to grow food inside the rock'], why: 'Driving over a mountain takes a long time. A tunnel makes a short path.' },
  { lv: 2, q: 'In a very rainy place, what do people build on their homes?', a: 'roofs that let rain run off', d: ['no roof at all', 'walls made of dry sand', 'floors made of snow'], why: 'A sloped roof sends rainwater sliding off instead of soaking in.' },
  { lv: 2, q: 'In cold places, why do farmers plant seeds in spring instead of winter?', a: 'winter ground is frozen', d: ['seeds like the dark', 'winter has too much sunshine', 'plants grow best under snow'], why: 'Frozen ground is hard as rock, and roots cannot grow in it.' },
  { lv: 2, q: 'A family moves from a snowy state to a hot, sunny state. What changes?', a: 'they wear lighter clothes', d: ['they buy thicker winter coats', 'they need more snow boots', 'nothing about their clothes changes'], why: 'People change what they wear to match the weather where they live.' },
  { lv: 3, q: 'Workers cut a new road through a forest. This is an example of...', a: 'people changing the land', d: ['the land changing people', 'weather changing the land', 'animals changing the land'], why: 'When people build roads, dams, or bridges, they are changing the land.' },
  { lv: 3, q: 'Which one shows PEOPLE changing the land?', a: 'digging a canal', d: ['a volcano erupting', 'a river drying up in a drought', 'wind blowing sand into a hill'], why: 'A canal is dug by people. Volcanoes, droughts, and wind are nature at work.' },
  { lv: 3, q: 'Which one shows the LAND changing what people do?', a: 'people build boats because they live by a lake', d: ['people put pictures on their walls', 'people paint a fence around a school', 'people write letters to friends'], why: 'Living by water led them to boats — the place shaped the choice.' },
  { lv: 3, q: 'In a dry place, why do farms use long pipes to carry water to the fields?', a: 'there is not enough rain', d: ['the soil is too cold', 'there is far too much rain', 'the sun never shines there'], why: 'Crops need water. Where rain is rare, people bring water to the plants.' },
  { lv: 3, q: 'A family on a windy hill puts up a windmill to make power. What are they doing?', a: 'using the land to help them', d: ['stopping the wind from ever blowing again', 'changing the weather forever', 'moving the whole hill to a new spot'], why: 'People often use what nature already gives them — wind, sun, or water.' },
  { lv: 3, q: 'In a mountain town, why do roads curve back and forth instead of going straight?', a: 'they wind around steep slopes', d: ['drivers like driving in circles', 'curvy roads are cheaper to paint', 'straight roads are against the law'], why: 'A curving road climbs a little at a time, which is safer than going straight up.' },
];

// ------------------------------------------------------------
// 5. City, suburb, or country?
// ------------------------------------------------------------
const C4CA_COMMTYPE = [
  { lv: 1, q: 'Which would you most likely see in a big city?', a: 'tall skyscrapers', d: ['a barn full of cows', 'a cornfield that goes on for miles', 'a dirt road with no houses'], why: 'Cities build tall because many people share a small space. That is <b>urban</b>.' },
  { lv: 1, q: 'Which is most likely out in the country?', a: 'a big farm with a barn', d: ['a subway train', 'a busy downtown highway', 'a tall apartment tower'], why: 'The country, or <b>rural</b> area, has open land and farms.' },
  { lv: 1, q: 'Where is a suburb?', a: 'just outside a city', d: ['deep in a forest with no roads', 'right in the middle of downtown', 'far away past all the farms'], why: 'Suburbs sit near a city, so people can live quietly and still visit it.' },
  { lv: 1, q: 'Which place has the MOST people living close together?', a: 'a city', d: ['a suburb', 'the country', 'a farm'], why: 'Cities are crowded and busy — that is what <b>urban</b> means.' },
  { lv: 1, q: 'Which place has the FEWEST people and the most open land?', a: 'the country', d: ['a city', 'a suburb', 'a busy downtown'], why: 'Rural places have lots of space between homes.' },
  { lv: 1, q: 'Which word means a city area?', a: 'urban', d: ['rural', 'suburban', 'downtown farmland'], why: '<b>Urban</b> means city: busy streets, buses, and buildings close together.' },
  { lv: 1, q: 'Which word means the countryside, with farms and open space?', a: 'rural', d: ['urban', 'suburban', 'skyscraper'], why: '<b>Rural</b> means country — quiet, open, and green.' },
  { lv: 1, q: 'Which word means the neighborhoods just outside a city?', a: 'suburban', d: ['rural', 'urban', 'oceanfront'], why: '<b>Suburban</b> places are near a city but calmer, with more yards.' },
  { lv: 1, q: 'Where would you ride a subway and catch lots of buses?', a: 'in a city', d: ['on a farm', 'in the woods', 'in a tiny country town'], why: 'Cities need buses and trains because so many people travel every day.' },
  { lv: 2, q: 'Jay rides the subway to school and lives on the 9th floor of an apartment. Where does Jay live?', a: 'a city', d: ['a suburb', 'the country', 'a farm'], why: 'Subways and tall apartments are urban clues.' },
  { lv: 2, q: 'Mia lives on a quiet street of houses and rides 20 minutes into the city where her mom works. Where does Mia live?', a: 'a suburb', d: ['downtown in the city', 'a farm in the country', 'a cabin far from any city'], why: 'A suburb is close enough to a city to visit, but quieter to live in.' },
  { lv: 2, q: 'Ana sees cornfields from her window and her closest neighbor is a mile away. Where does Ana live?', a: 'the country', d: ['a city', 'a suburb', 'downtown'], why: 'Wide-open farmland and far-apart homes mean rural.' },
  { lv: 2, q: 'Which place usually has the most yards to mow and driveways to park in?', a: 'a suburb', d: ['a city downtown', 'a subway station', 'a mountain top'], why: 'Suburbs have many houses with yards, so almost everyone has a lawn.' },
  { lv: 3, q: 'Why do city buildings grow tall instead of wide?', a: 'there is little space, so they build up', d: ['tall buildings stay warmer inside', 'the land is too soft to build wide', 'cities have a rule against yards'], why: 'Lots of people need room in a small space, so cities stack floors upward.' },
  { lv: 3, q: 'Which is TRUE about cities, suburbs, AND the country?', a: 'people live and work in all of them', d: ['they all have subways', 'they all have big farms', 'they all have skyscrapers'], why: 'They look different, but every one of them is a real community.' },
  { lv: 3, q: 'A town has 200 people, one school, and lots of farmland. What kind of place is it?', a: 'rural', d: ['urban', 'suburban', 'a downtown'], why: 'Few people plus lots of farmland equals rural.' },
  { lv: 3, q: 'Why might a family pick a suburb instead of the city?', a: 'they want a yard but still be near the city', d: ['they want to live where no other houses are nearby at all', 'they never want to visit a city again', 'they want to run a very large farm'], why: 'Suburbs mix a bit of both — more space than a city, closer than the country.' },
  { lv: 3, q: 'Emma\'s town has one main street, a few shops, and farms all around it. What is it?', a: 'rural', d: ['urban', 'suburban', 'a big downtown city'], why: 'Farmland all around and just a few shops means a rural town.' },
  { lv: 3, q: 'A city, a suburb, and a rural town all need which of these?', a: 'schools and roads', d: ['subway tunnels', 'tractors for every family', 'a downtown with skyscrapers'], why: 'Every community needs ways to learn and ways to get around.' },
];

// ------------------------------------------------------------
// 6. Rights come with responsibilities
// ------------------------------------------------------------
const C4CA_RIGHTS = [
  { lv: 1, q: 'What is a <b>right</b>?', a: 'a freedom everyone shares', d: ['a chore you must finish before dinner', 'a rule that only grown-ups have to follow', 'the direction opposite of left'], why: 'Rights belong to everybody, not just to some people.' },
  { lv: 1, q: 'What is a <b>responsibility</b>?', a: 'something you take care of', d: ['a prize you win for running fast', 'a holiday in the middle of summer', 'a kind of map with symbols on it'], why: 'A responsibility is a job you are counted on to do.' },
  { lv: 1, q: 'You have the right to use the playground. What is your responsibility?', a: 'take turns and play safely', d: ['keep the swings all to yourself', 'hide the balls from other kids', 'run home when the bell rings'], why: 'A shared playground stays fun only if everyone shares and stays safe.' },
  { lv: 1, q: 'You have the right to borrow library books. Your responsibility is to...', a: 'return them on time', d: ['keep them forever', 'draw on the pages', 'read them out loud in class'], why: 'Bringing books back on time lets the next kid borrow them too.' },
  { lv: 1, q: 'Kids have the right to learn at school. Their responsibility is to...', a: 'listen and do their work', d: ['talk while the teacher is talking', 'stay home whenever they feel like it', 'wear a red shirt every day'], why: 'Learning works when everyone helps make the room calm enough to think.' },
  { lv: 1, q: 'You have the right to share your ideas. Your responsibility is to...', a: 'listen when others speak', d: ['talk the loudest of anyone', 'interrupt whoever is talking', 'keep every idea a secret'], why: 'If everyone talks and nobody listens, no idea gets heard at all.' },
  { lv: 1, q: 'People have the right to enjoy the park. Their responsibility is to...', a: 'put trash in the bin', d: ['pick all the flowers', 'leave litter on the grass', 'walk on the path'], why: 'A park stays nice for everybody when each person cleans up.' },
  { lv: 1, q: 'You have the right to be safe at school. Your responsibility is to...', a: 'follow the safety rules', d: ['run fast down the hallway', 'push to the front of the line', 'race down the stairs'], why: 'Safety rules protect you AND everyone walking beside you.' },
  { lv: 1, q: 'Everyone has the right to be treated fairly. What is your responsibility?', a: 'include others and take turns', d: ['play only with your best friend', 'leave people out of the game', 'laugh when someone makes a mistake'], why: 'Fair treatment is a two-way street — you get it and you give it.' },
  { lv: 1, q: 'You have the right to clean drinking water. Your responsibility is to...', a: 'not waste it', d: ['leave the tap running all day', 'pour it out on the sidewalk', 'drink only soda instead'], why: 'Clean water is precious. Using only what you need saves it for others.' },
  { lv: 2, q: 'Ben borrows a bike from the community center. Which responsibility goes with it?', a: 'bring it back so others can ride', d: ['keep it for a whole year', 'paint it a brand-new color', 'let the air out of the tires'], why: 'Shared things work only when each person returns them ready for the next.' },
  { lv: 2, q: 'Grown-ups have the right to vote. What responsibility comes with voting?', a: 'learn about the choices first', d: ['try to vote many times', 'tell neighbors how they must vote', 'vote only when their side is winning'], why: 'A thoughtful voter learns first, so the vote is a real choice.' },
  { lv: 2, q: 'Your class has the right to keep a class pet. Your responsibility is to...', a: 'feed it and clean its cage', d: ['play with it in the middle of a test', 'take it home to keep forever', 'open the cage and walk away'], why: 'A living animal depends on people keeping their promise to care for it.' },
  { lv: 2, q: 'People have the right to drive on public roads. What responsibility comes with it?', a: 'obey the traffic lights', d: ['drive in whatever lane they feel like, whenever they want', 'park in front of any driveway', 'honk at everyone they pass'], why: 'Traffic rules keep drivers, riders, and walkers safe on shared roads.' },
  { lv: 3, q: 'Why do rights and responsibilities go together?', a: 'if nobody takes care, nobody can enjoy the right', d: ['because rights belong only to grown-ups with jobs and money', 'because responsibilities always cost money', 'because rights change every single day'], why: 'A right stays real only when people do the caring that keeps it working.' },
  { lv: 3, q: 'You have the right to speak freely. Which is NOT a good use of that right?', a: 'saying something to hurt someone', d: ['telling the class your idea', 'writing a letter to the mayor', 'disagreeing politely with a friend'], why: 'Free speech is for sharing ideas, not for hurting people on purpose.' },
  { lv: 3, q: 'A neighbor has the right to a quiet home at night. Your responsibility is to...', a: 'keep noise down late', d: ['practice drums at midnight', 'let your dog bark all night long', 'ring their doorbell for fun'], why: 'Your right to have fun stops where their right to rest begins.' },
  { lv: 3, q: 'Everyone has the right to use the sidewalk. What responsibility comes with it?', a: 'leave room for others to pass', d: ['park your scooter in the middle and stand there talking', 'ride as fast as you possibly can', 'tell other people where they may walk'], why: 'A shared path works when each person leaves space for the next one.' },
  { lv: 3, q: 'Sara says, "I have the right to play music." Her baby brother is asleep. What should Sara do?', a: 'turn the music down', d: ['turn the music up even louder than it was before', 'play it loudly all night long', 'ask her brother to sleep somewhere else'], why: 'Rights come with thinking about the people right next to you.' },
  { lv: 3, q: 'Which pair matches BEST?', a: 'right to a clean park &rarr; pick up your trash', d: ['right to borrow library books &rarr; keep them at your house forever', 'right to learn &rarr; skip your homework', 'right to vote &rarr; run very fast'], why: 'The responsibility should protect the very same right it is paired with.' },
];

// ------------------------------------------------------------
// 7. Different families, different traditions
// ------------------------------------------------------------
const C4CA_CULTURE = [
  { lv: 1, q: 'What is a <b>tradition</b>?', a: 'a custom families pass down', d: ['a machine that tells the time', 'a rule the mayor writes down', 'a book about faraway places'], why: 'Traditions are special ways of doing things, passed from grown-ups to kids.' },
  { lv: 1, q: 'What does <b>culture</b> mean?', a: 'how a group lives and celebrates', d: ['a kind of stormy weather', 'a map that shows mountains', 'a building where leaders meet to vote on new laws'], why: 'Culture includes food, music, language, clothing, and holidays.' },
  { lv: 1, q: 'What do we call the words a family uses to talk to each other?', a: 'their language', d: ['their tradition', 'their holiday', 'their recipe'], why: 'Families around the world speak thousands of different languages.' },
  { lv: 1, q: 'Tacos, jollof rice, dumplings, and injera are all...', a: 'foods families enjoy', d: ['musical instruments', 'kinds of clothing', 'names of winter holidays'], why: 'Every culture has favorite dishes, and they are all worth tasting.' },
  { lv: 1, q: 'A drum, a guitar, and a flute are all...', a: 'musical instruments', d: ['holiday foods', 'kinds of clothing', 'languages people speak'], why: 'People everywhere make music, just with different instruments.' },
  { lv: 1, q: 'A kimono, a sari, and a dashiki are all kinds of...', a: 'clothing', d: ['music', 'food', 'dances and songs'], why: 'These are beautiful clothes that people wear in different cultures.' },
  { lv: 1, q: 'Diwali, Lunar New Year, and Eid are all...', a: 'holidays families celebrate', d: ['kinds of bread', 'names of big cities', 'instruments in a marching band'], why: 'Each one is a joyful celebration with its own foods and traditions.' },
  { lv: 1, q: 'Why do different families eat different foods?', a: 'they have different traditions', d: ['some families are never hungry', 'only one food in the world is healthy', 'food is exactly the same everywhere'], why: 'Families cook the dishes their families have loved for a long time.' },
  { lv: 1, q: 'Your friend celebrates a holiday your family does not. What is a kind thing to do?', a: 'ask about it and listen', d: ['tell them their holiday is wrong', 'say your holiday is much better', 'pretend you did not hear them'], why: 'Curious, kind questions are how friends learn about each other.' },
  { lv: 1, q: 'Stories that grandparents tell their grandchildren are part of a family\'s...', a: 'culture', d: ['weather', 'homework', 'address'], why: 'Stories carry a family\'s history and beliefs to the next kids.' },
  { lv: 2, q: 'Mei\'s family celebrates Lunar New Year with red envelopes and a dragon dance. This is part of their...', a: 'culture', d: ['grocery list', 'school schedule', 'street map'], why: 'Celebrations, foods, and dances together make up a family\'s culture.' },
  { lv: 2, q: 'Two friends eat very different dinners. Which is true?', a: 'both dinners can be delicious', d: ['one of the families is doing it wrong', 'everyone should eat the very same meal', 'only brand-new foods are good'], why: 'Different is not wrong. Different foods are one of the joys of the world.' },
  { lv: 2, q: 'Amir speaks Arabic at home and English at school. Speaking two languages is...', a: 'a helpful skill', d: ['confusing and bad for him', 'something only grown-ups can do', 'against the school rules'], why: 'Knowing more than one language lets you talk with more people.' },
  { lv: 2, q: 'Grandma teaches Lila the dance she learned as a girl. What is being passed down?', a: 'a family tradition', d: ['a school rule', 'a map key', 'a paycheck'], why: 'When one generation teaches the next, a tradition keeps living.' },
  { lv: 3, q: 'A new student joins your class from another country. What helps them feel welcome?', a: 'learn to say their name correctly', d: ['give them a nickname that is easier for you to say', 'ask them to bring a different lunch', 'wait for them to speak first'], why: 'Saying someone\'s real name right shows you respect who they are.' },
  { lv: 3, q: 'Which one shows a tradition STAYING the same?', a: 'a family makes the same soup every New Year', d: ['a family moves to a new city', 'a family buys a different car', 'a family paints their front door blue'], why: 'Repeating something year after year is what keeps a tradition alive.' },
  { lv: 3, q: 'Why is it good when a community has many cultures?', a: 'people learn new foods and ideas', d: ['because then every family stops celebrating its own holidays', 'because only one culture can be the correct one', 'so nobody ever has to share anything'], why: 'Neighbors trade recipes, songs, and stories, and everyone gains.' },
  { lv: 3, q: 'Ben\'s family and Nadia\'s family celebrate different holidays in winter. Which is TRUE?', a: 'both families are celebrating', d: ['only one family is really celebrating', 'they must choose the same holiday', 'holidays happen only in winter'], why: 'Two celebrations can be different and both be real and special.' },
  { lv: 3, q: 'Your class holds a food fair where each family brings a favorite dish. What does it celebrate?', a: 'the many cultures in the class', d: ['who can cook the fastest', 'which family is the most correct', 'the one best food in the world'], why: 'Sharing food is a warm, friendly way to share culture.' },
  { lv: 3, q: 'What is a good way to learn about a culture that is new to you?', a: 'ask polite questions and listen', d: ['guess, then tell other people your guess', 'decide right away that it is strange', 'ignore it and never mention it'], why: 'Asking the people who live it is the most respectful way to learn.' },
];

// ------------------------------------------------------------
// skills
// ------------------------------------------------------------
SKILLS.push(
  { id: 'soc_globe_map', strand: 'soc_maps', name: 'Globe or map?', gen: (lvl = 2) => C4CA_ask(C4CA_GLOBE, lvl) },

  {
    id: 'soc_nested_places', strand: 'soc_maps', name: 'Biggest to smallest',
    gen: (lvl = 2) => {
      const L = (lvl === 1 || lvl === 3) ? lvl : 2;
      const P = C4CA_LADDER;
      let mode, gap;
      if (L === 1) { mode = 'next'; gap = 1; }
      else if (L === 2) { mode = pick(['next', 'bigger', 'smaller']); gap = (mode === 'next') ? 1 : ri(1, 2); }
      else { mode = pick(['bigger', 'smaller']); gap = ri(2, 3); }

      if (mode === 'next') {
        const s = ri(0, P.length - 2);
        const ans = P[s + 1];
        const pool = [];
        for (let i = 0; i < P.length; i++) { if (i !== s && i !== s + 1) pool.push(P[i]); }
        const wrongs = shuffle(pool).slice(0, 3);
        return {
          prompt: 'Places fit inside each other, small to big. Which one comes RIGHT AFTER <b>' + P[s] + '</b>?' + (L === 1 ? C4CA_LADDER_HINT : ''),
          type: 'mc', choices: shuffle([ans].concat(wrongs)), answer: ans,
          explain: C4CA_cap(P[s]) + ' fits right inside ' + ans + '. Each place nests inside the next bigger one!',
        };
      }

      if (mode === 'bigger') {
        const s = ri(3, P.length - 1 - gap);
        const ans = P[s + gap];
        const pool = [];
        for (let i = 0; i < s; i++) pool.push(P[i]);
        const wrongs = shuffle(pool).slice(0, 3);
        return {
          prompt: 'Which one is <b>BIGGER</b> than ' + P[s] + '?',
          type: 'mc', choices: shuffle([ans].concat(wrongs)), answer: ans,
          explain: C4CA_cap(P[s]) + ' fits inside ' + ans + ', so ' + ans + ' is the bigger one.',
        };
      }

      const s2 = ri(gap, 5);
      const ans2 = P[s2 - gap];
      const pool2 = [];
      for (let i = s2 + 1; i < P.length; i++) pool2.push(P[i]);
      const wrongs2 = shuffle(pool2).slice(0, 3);
      return {
        prompt: 'Which one is <b>SMALLER</b> than ' + P[s2] + '?',
        type: 'mc', choices: shuffle([ans2].concat(wrongs2)), answer: ans2,
        explain: C4CA_cap(ans2) + ' fits inside ' + P[s2] + ', so it is the smaller one.',
      };
    },
  },

  { id: 'soc_landforms', strand: 'soc_maps', name: 'Landforms and water', gen: (lvl = 2) => C4CA_ask(C4CA_LAND, lvl) },
  { id: 'soc_human_env', strand: 'soc_maps', name: 'People and places fit together', gen: (lvl = 2) => C4CA_ask(C4CA_HUMENV, lvl) },
  { id: 'soc_community_types', strand: 'soc_community', name: 'City, suburb, or country?', gen: (lvl = 2) => C4CA_ask(C4CA_COMMTYPE, lvl) },
  { id: 'soc_rights', strand: 'soc_community', name: 'Rights come with responsibilities', gen: (lvl = 2) => C4CA_ask(C4CA_RIGHTS, lvl) },
  { id: 'soc_cultures', strand: 'soc_community', name: 'Different families, different traditions', gen: (lvl = 2) => C4CA_ask(C4CA_CULTURE, lvl) },
);

/* ============================================================
   LEARNING GARDEN — Social Studies slice B
   Voting, scarcity, barter, resources, inventions,
   Native nations, and asking + acting (soc_inquiry).
   Bank rows: [tier, prompt, answer, [distractors], explain]
   tier 1 = easy, 2 = medium, 3 = harder
   ============================================================ */

STRANDS.push(
  { id: 'soc_inquiry', subject: 'social', name: 'Ask & Find Out', emoji: '🔍', color: 'var(--sky)',
    lesson: `<p><b>Good thinkers ask questions, hunt for answers, then DO something with what they learn.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>A <b>good question</b> has an answer you can actually find. "Why do leaves change color?" can be answered. "Is red the best color?" is only an opinion.</li>
        <li>Pick the right <b>source</b>: a <b>map</b> for where, a <b>book</b> or website for facts, an old <b>photo</b> for how things looked, a <b>person</b> who was there for a real story.</li>
        <li>A <b>primary source</b> was made by someone who was there — a letter, a diary, a photo.</li>
        <li>If two sources disagree, check a <b>third</b> one before you decide.</li>
        <li>Then <b>share it</b> — a poster, a talk, a letter — and <b>take one small action</b>. A cleanup, a book drive, a thank-you note. Small actions really do change a place.</li>
      </ul>` },
);

// ------------------------------------------------------------
// shared helper
// ------------------------------------------------------------
function C4CB_pickQ(bank, lvl) {
  var L = (lvl === 1 || lvl === 3) ? lvl : 2;
  var pool = bank.filter(function (e) {
    if (L === 1) return e[0] === 1;
    if (L === 2) return e[0] <= 2;
    return e[0] >= 2;
  });
  if (!pool.length) pool = bank;
  var e = pick(pool);
  var wrongs = shuffle(e[3].slice()).slice(0, 3);
  var ans = e[2];
  return { prompt: e[1], type: 'mc', choices: shuffle([ans].concat(wrongs)), answer: ans, explain: e[4] };
}

// ------------------------------------------------------------
// 1. One person, one vote
// ------------------------------------------------------------
const C4CB_VOTE = [
  [1, 'Ms. Lee\'s class votes for a class pet. Fish get <b>12</b> votes. A hamster gets <b>7</b>. Which pet wins?', 'the fish', ['the hamster', 'whichever one the teacher likes', 'nobody wins'], '12 is more than 7, so the fish got the most votes. The most votes wins.'],
  [1, 'In a fair class vote, how many votes does each student get?', 'one vote each', ['two votes each', 'the loudest kid gets extra votes', 'only the teacher votes'], 'One person, one vote. Nobody counts more than anybody else.'],
  [1, 'What does <b>majority</b> mean?', 'more than half', ['exactly one person', 'the smallest group', 'nobody at all'], 'A majority is the bigger part — more than half of the voters.'],
  [1, 'The class votes: 9 for the park, 14 for the zoo. Where should the class go?', 'the zoo', ['the park', 'somewhere nobody voted for', 'both places at once'], '14 is more than 9, so the zoo has the majority.'],
  [1, 'Why do voters fold their paper or step behind a curtain?', 'so their choice stays private', ['so the paper stays dry', 'so everyone can copy the same answer', 'so voting takes longer'], 'A secret ballot means nobody sees your choice, so you can vote how you truly feel.'],
  [1, 'A class vote ends 10 to 10. That is called —', 'a tie', ['a law', 'a ballot', 'a winner'], 'A tie means both choices got the same number of votes.'],
  [1, 'Two best friends vote for different colors. That is —', 'fine and allowed', ['against the rules', 'cheating in a big way', 'a tie'], 'Your vote is your own choice. Friends may want different things.'],
  [1, 'What helps everyone choose well BEFORE a class vote?', 'learning about each choice', ['voting with your eyes closed', 'picking the first word you hear', 'letting one kid decide'], 'When you know the choices, you can vote for what you really want.'],
  [2, '20 kids vote. How many votes does a choice need to have a majority?', '11', ['10', '20', '5'], 'Half of 20 is 10, so 11 votes is more than half.'],
  [2, 'Ben tries to drop two papers in the ballot box. Why is that unfair?', 'he would be counted twice', ['the box would get too full', 'paper costs a lot of money', 'his writing is too neat'], 'One person gets one vote. Voting twice would give Ben more power than everyone else.'],
  [3, 'Class vote: tag 8, soccer 8, jump rope 3. What should the class do next?', 'vote again between tag and soccer', ['let the loudest group take the win', 'play jump rope', 'let one kid decide alone'], 'Tag and soccer are tied at the top, so the class breaks the tie with another vote.'],
  [3, 'Why use a <b>secret ballot</b> instead of raising hands?', 'so nobody feels pressured', ['so the votes count double', 'so counting takes all day long', 'so only friends may vote'], 'When votes are private, people pick what they truly want instead of copying others.'],
  [3, '25 people vote. Blue gets 13 and green gets 12. Did blue get a majority?', 'yes, 13 is more than half', ['no, it needed all 25 votes', 'no, blue got the fewest', 'yes, because blue is prettier'], 'Half of 25 is 12 and a half, so 13 is more than half — a majority.'],
  [3, 'The principal asks two teachers to watch the votes get counted. Why?', 'so the count is checked fairly', ['so the vote costs less money', 'so the paper gets recycled', 'so the vote takes longer'], 'When more than one person watches, no votes can be lost or added.'],
  [3, 'The class voted for pizza day, but Mia wanted taco day. A good-citizen move is to —', 'go along with the class choice', ['tell everyone the vote was fake', 'refuse to eat any lunch', 'hide all the pizza'], 'You can be disappointed and still respect the vote. Mia can ask for tacos next time.'],
  [3, 'Who is allowed to vote in a class election?', 'every student in the class', ['only students who won last time', 'only the tallest students', 'only students the teacher picks'], 'In a fair vote, every member of the group gets a turn.'],
  [3, '24 kids vote for snacks: apples 10, grapes 9, pretzels 5. Did apples get more than HALF?', 'no, half of 24 is 12', ['yes, 10 is more than half', 'yes, because apples won the vote', 'no, apples got the fewest votes'], 'A choice can win with the most votes and still not have a majority.'],
  [3, 'The teacher says, "Raise your hand for extra recess — I am watching." Why is that less fair?', 'kids may copy the teacher', ['hands get tired very fast', 'recess is always fair anyway', 'counting hands is impossible'], 'When people can see your vote, they may not choose freely. A private ballot fixes that.'],
];

// ------------------------------------------------------------
// 2. Not enough for everything (scarcity + opportunity cost)
// ------------------------------------------------------------
const C4CB_SCARCE = [
  [1, 'The class has 6 markers, but 20 kids want one. That is an example of —', 'scarcity', ['plenty for everyone', 'a service', 'a tie vote'], 'Scarcity means there is not enough of something for everyone who wants it.'],
  [1, '<b>Scarcity</b> means —', 'there is not enough for everyone', ['everything is free for everybody', 'stores are always closed on Monday', 'money is made out of paper'], 'When wants are bigger than what we have, people must choose.'],
  [1, 'Leo has $5. A book costs $5 and a kite costs $5. He can buy —', 'only one of them', ['both of them', 'neither one', 'all three of them'], 'With $5 he picks one. Choosing one means giving up the other.'],
  [1, 'Leo buys the book and gives up the kite. The kite is his —', 'opportunity cost', ['allowance', 'piggy bank', 'paycheck'], 'Opportunity cost is the thing you give up when you choose something else.'],
  [1, '<b>Opportunity cost</b> means —', 'the thing you gave up', ['the price on the tag', 'the coins in your pocket', 'a store that charges a lot'], 'When you pick one thing, the next-best thing you did not pick is your opportunity cost.'],
  [1, 'Recess is 20 minutes. Mia can play soccer OR swing. She swings. Her opportunity cost is —', 'playing soccer', ['the swing set', 'the whole playground', '20 minutes of rest'], 'Her opportunity cost is soccer — the fun she gave up to swing.'],
  [1, 'Why can nobody have everything they want?', 'there is not enough of everything', ['wanting things is against the law', 'stores hide all the good stuff', 'only grown-ups may want things'], 'Time, money, and things are limited, so everyone must choose.'],
  [1, 'There is one last cookie and two hungry kids. This shows —', 'scarcity', ['a want that is free', 'a good with no cost', 'a service'], 'One cookie cannot fill two wants, so someone must choose or share.'],
  [2, 'Dad has time to cook dinner OR mow the lawn, not both. What is scarce here?', 'time', ['food', 'grass', 'the lawn mower'], 'Time can be scarce too. Choosing to cook means giving up mowing.'],
  [2, 'The library has 1 dinosaur book and 3 kids want it. A fair plan is —', 'take turns with a list', ['let the fastest runner keep it', 'tear it into three pieces', 'hide it in a backpack'], 'Scarce things can be shared with turns so everyone gets a chance.'],
  [3, 'Ana wants skates most, then a game, then a puzzle. She buys the skates. Her opportunity cost is —', 'the game', ['the puzzle', 'the skates', 'the store'], 'Opportunity cost is the BEST thing you gave up — for Ana, the game.'],
  [3, 'A town can build a library OR a pool, not both. They build the pool. The opportunity cost is —', 'the library', ['the pool', 'the town itself', 'the workers'], 'The library is what the town gave up when it chose the pool.'],
  [3, 'Kai spends all Saturday at a party. Besides the gift, what did it cost him?', 'time he could use another way', ['nothing at all', 'only the wrapping paper', 'his whole allowance'], 'Every choice costs time as well as money. That time is part of the cost.'],
  [3, 'Which sentence shows a choice with an opportunity cost?', 'I read instead of drawing.', ['I have a red bike at home.', 'Water feels wet on my hands.', 'The store opens at nine.'], 'Choosing to read meant giving up drawing — that is the cost of the choice.'],
  [3, 'Air is all around us. Is air scarce for us to breathe right now?', 'no, there is plenty', ['yes, we must buy it', 'yes, it runs out each night', 'no, because it costs a lot'], 'Something is scarce only when there is not enough. We still work to keep air clean.'],
  [3, 'A class earns 30 minutes of free time and votes to use it all on games. Their opportunity cost is —', 'the other things they could do', ['30 extra minutes', 'the vote itself', 'nothing, free time is free'], 'Even free time is limited. Games meant giving up art, reading, or building.'],
  [3, 'Sam wants a $20 scooter but has $6. The smartest plan is to —', 'save a little each week', ['buy half of a scooter', 'take one from the store', 'wish for it much harder'], 'Saving means giving up small buys now to reach a bigger want later.'],
  [3, 'Which is the BEST meaning of scarcity?', 'wants are bigger than what we have', ['people want nothing at all', 'everything is free', 'stores run out only on Mondays'], 'Scarcity is the gap between what people want and what there is.'],
];

// ------------------------------------------------------------
// 3. Trading before money (barter)
// ------------------------------------------------------------
const C4CB_BARTER = [
  [1, 'Trading one thing for another with no money is called —', 'barter', ['banking', 'borrowing', 'voting'], 'Barter is swapping goods or work straight across, with no money at all.'],
  [1, 'Ana trades her apple for Ben\'s crackers. That is —', 'barter', ['a purchase with cash', 'a loan from a bank', 'a birthday gift'], 'They swapped goods and no money changed hands, so it is barter.'],
  [1, 'Long ago, before money, people mostly —', 'traded things they made', ['paid with dollar bills', 'used shiny plastic credit cards', 'ordered food online'], 'People swapped grain, cloth, tools, and work with each other.'],
  [1, 'Which one is money?', 'a dollar bill', ['a bag of corn', 'a wool blanket', 'a fishing net'], 'Money is what everyone in a place agrees to accept for trade.'],
  [1, 'Why is money easier than barter?', 'everyone accepts money', ['money weighs much more', 'money tastes better', 'money can never be lost'], 'You do not have to find a person who wants exactly what you have.'],
  [1, 'A baker wants shoes. The shoemaker does not want bread. With barter, that trade —', 'does not work', ['works out fine', 'makes them both rich', 'is against the law'], 'Barter needs both people to want what the other has.'],
  [1, 'With money, the baker can —', 'sell bread and buy shoes', ['trade only with other bakers', 'stop working forever', 'eat the shoes'], 'Money lets you sell to one person and buy from a different person.'],
  [1, 'Which one is a barter of SERVICES?', 'I rake, you fix my bike', ['I pay you five dollars for raking', 'I give you a dollar for gum', 'I put my coins in a bank'], 'Swapping work for work is barter — no money changes hands.'],
  [2, 'Money keeps well. Which trade good would spoil the fastest?', 'fresh fish', ['silver coins', 'a stone bowl', 'an iron pot'], 'Food rots while money keeps its value — one reason money beat barter.'],
  [2, 'Shells and beads were once used as money. That worked because —', 'people agreed to accept them', ['they could be eaten later', 'they grew back every spring', 'they were heavier than gold coins'], 'Anything can be money if a whole group agrees it is worth something.'],
  [3, 'Barter works best when —', 'both want what the other has', ['one person has coins', 'the two people live in the same town', 'nobody wants anything'], 'Both sides must want the swap, or the trade falls apart.'],
  [3, 'Which problem does money solve?', 'finding a matching trade', ['making bread rise in the oven', 'keeping new shoes clean', 'teaching people how to farm'], 'With money you can sell to anyone and buy from anyone else.'],
  [3, 'A farmer swaps corn for a hen, then the hen for a pot. Why is money faster?', 'one trade instead of many', ['corn is not real food', 'hens can carry money', 'pots can be traded for anything'], 'Money skips the chain of swaps — sell once, then buy what you need.'],
  [3, 'Kids trade snacks. Ella will only trade for grapes. Nobody has grapes. What happens?', 'no trade happens today', ['Ella must take anything offered', 'the teacher makes the trade', 'everybody gets grapes'], 'Barter stops when nobody has what the other person wants.'],
  [3, 'Which sentence about barter is FALSE?', 'Barter always uses coins.', ['Barter is trading without money.', 'Barter needs both people to agree.', 'Barter was common long ago.'], 'Barter uses goods and work. Coins are money, which is the opposite of barter.'],
  [3, 'A town starts using coins. What gets easier?', 'buying from strangers', ['growing more wheat', 'changing the weather', 'carrying water uphill'], 'Strangers may not want your goods, but they will take money.'],
  [3, 'Why is money called a "medium of exchange"?', 'it sits in the middle of a trade', ['it is a medium size', 'it is made downtown', 'it is worth exactly one thing forever'], 'You trade goods for money, then money for other goods. Money is the middle step.'],
  [3, 'Which trade still counts as barter today?', 'swapping tools with a neighbor', ['buying gum with a dollar', 'paying rent with a check', 'tapping a bank card at the store'], 'Neighbors still trade tools, favors, and skills with no money at all.'],
];

// ------------------------------------------------------------
// 4. Natural resources and caring for them
// ------------------------------------------------------------
const C4CB_RES = [
  [1, 'A <b>natural resource</b> is something —', 'we get from nature', ['made inside a toy factory', 'invented by kids at school', 'printed on paper'], 'Water, trees, soil, and air all come from nature, not from a factory.'],
  [1, 'Which one is a natural resource?', 'water', ['a plastic cup', 'a bicycle', 'a video game'], 'Water comes from nature. The other things are made by people.'],
  [1, 'Trees give us —', 'wood and paper', ['glass jars', 'metal nails', 'plastic bags'], 'Wood from trees becomes lumber, paper, and pencils.'],
  [1, 'Why does soil matter so much?', 'plants grow in it', ['it makes electricity', 'it is nice to drink', 'it is a kind of metal'], 'Healthy soil holds the water and food that plants need.'],
  [1, 'Turning off the tap while you brush your teeth is —', 'conserving water', ['wasting the water', 'cleaning the whole sink', 'boiling the water'], 'Conserving means using only what you need so there is enough left.'],
  [1, 'Which choice helps save trees?', 'using both sides of paper', ['leaving the lights on', 'running the water longer', 'buying more crayons'], 'Using less paper means fewer trees are cut down.'],
  [1, 'A <b>renewable</b> resource can —', 'grow back or be replaced', ['never be used again', 'only be bought in stores', 'be eaten for lunch'], 'Trees can be replanted and sunlight comes every day — those are renewable.'],
  [1, 'Which one grows back if we take care of it?', 'a forest', ['a lump of coal', 'a tank of gasoline', 'a metal can'], 'Trees can be replanted. Coal and gas took millions of years to form.'],
  [2, 'Wind and sunlight are renewable because —', 'they keep coming back', ['they cost a lot of money', 'people build them in factories', 'they are very old'], 'The sun rises every day and the wind keeps blowing, so we never use them up.'],
  [2, 'Why should trash stay out of rivers?', 'animals live in that water', ['rivers run faster when empty', 'trash makes water taste sweet', 'boats need muddy water'], 'People, plants, and animals all depend on clean river water.'],
  [3, 'Which action saves the MOST water at home?', 'taking shorter showers', ['drinking from a smaller cup', 'closing the bathroom door', 'turning off the TV'], 'Showers use many gallons, so a shorter shower saves the most.'],
  [3, 'Coal and oil are <b>nonrenewable</b>. That means —', 'they can run out', ['they grow every spring', 'they are free to everyone', 'they come from tall trees'], 'They formed underground over millions of years, so we cannot make more quickly.'],
  [3, 'A farmer plants cover crops so wind cannot blow the dirt away. She is protecting —', 'the soil', ['the air', 'the barn', 'the sunshine'], 'Roots hold soil in place. Losing topsoil makes it hard to grow food.'],
  [3, 'Recycling a can means —', 'using it to make something new', ['burying it in the yard', 'burning it in a fire', 'washing it and hiding it'], 'Recycled metal becomes new cans, so less new metal must be dug up.'],
  [3, 'Which pair are BOTH renewable?', 'sunlight and trees', ['oil and coal', 'plastic and gasoline', 'coal and sunlight'], 'Sunlight arrives daily and trees regrow. Oil and coal do not come back.'],
  [3, 'Smoke from cars and factories harms —', 'the air we breathe', ['the moon at night', 'a rock in the yard', 'water sealed in a bottle'], 'Dirty air makes it harder for people, animals, and plants to stay healthy.'],
  [3, 'A class starts a paper-recycling bin. How does that help forests?', 'fewer trees are needed', ['paper turns back into trees', 'the bins are made of wood', 'trees prefer tidy rooms'], 'Recycled paper replaces brand-new paper, so fewer trees get cut.'],
  [3, 'What is the BEST reason to conserve resources?', 'to leave enough for later', ['so stores can charge more', 'so trucks can drive faster', 'so nobody has to share'], 'Saving now leaves water, soil, and trees for the people and animals who come next.'],
];

// ------------------------------------------------------------
// 5. Inventions changed how we live
// ------------------------------------------------------------
const C4CB_TECH = [
  [1, 'Long ago people lit rooms with candles. Today rooms are lit by —', 'light bulbs', ['campfires indoors', 'flashlights only', 'moonlight only'], 'The light bulb gave homes bright, safe light with the flip of a switch.'],
  [1, 'Before cars, people traveled far by —', 'horse and wagon', ['airplane', 'subway train', 'electric scooter'], 'Horses pulled wagons and carriages along dirt roads.'],
  [1, 'To send a message far away long ago, people wrote —', 'a letter', ['a text message', 'an email', 'a video message'], 'Letters traveled by horse, ship, then train. It took days or weeks.'],
  [1, 'Long ago, clothes were scrubbed by hand on a —', 'washboard', ['dishwasher', 'toaster', 'keyboard'], 'People scrubbed clothes on a bumpy board, then wrung them out by hand.'],
  [1, 'Which invention made washing clothes much easier?', 'the washing machine', ['the telephone', 'the airplane', 'the camera'], 'The machine does the scrubbing and spinning, saving hours of hard work.'],
  [1, 'Which is faster for talking with Grandma far away?', 'a phone call', ['a letter in the mail', 'a note in a bottle', 'a message sent by horse'], 'A phone lets you talk right away instead of waiting days.'],
  [1, 'Cars changed life because people could —', 'travel farther and faster', ['stop eating food', 'live without any houses', 'fly over the mountains'], 'With cars, people could work, shop, and visit places far from home.'],
  [1, 'Which one shows the OLD way of doing a chore?', 'a washboard', ['a washing machine', 'a clothes dryer', 'a laundry timer app'], 'A washboard came long before machines did the scrubbing.'],
  [2, 'Refrigerators replaced iceboxes. Why was that a big change?', 'food stays fresh longer', ['kitchens became quieter', 'ice looks much prettier', 'people stopped cooking'], 'Before fridges, families bought blocks of ice and food spoiled fast.'],
  [2, 'Which invention lets a family SEE and HEAR a cousin far away?', 'a video call', ['a paper letter', 'a printed photograph', 'a plain phone call'], 'A video call carries sound and picture together.'],
  [3, 'Which of these came FIRST?', 'the horse and wagon', ['the car', 'the airplane', 'the video call'], 'People traveled by horse long before engines were invented.'],
  [3, 'Letter, telephone, video call — which is NEWEST?', 'the video call', ['the letter', 'the telephone', 'they are all the same age'], 'Letters are oldest, then telephones, and video calls came last.'],
  [3, 'Because of washing machines, families gained —', 'more free time', ['many more dirty clothes', 'far fewer clothes', 'a much longer chore list'], 'Machines do work that once took a whole day by hand.'],
  [3, 'Light bulbs changed evenings because people could —', 'read and work after dark', ['sleep many more hours', 'stop using clocks', 'see through walls'], 'Safe, bright light meant the day no longer ended at sunset.'],
  [3, 'Which tool from long ago do we STILL use today?', 'a broom', ['a washboard', 'an icebox', 'an oil lamp for the house'], 'Some simple tools still work well, so people kept using them.'],
  [3, 'How do new inventions usually change work?', 'one person can do more', ['work becomes impossible', 'people forget how to work', 'jobs never change at all'], 'Machines speed up work, so jobs and daily life change with them.'],
  [3, 'Grandpa shared a "party line" phone with neighbors. Today most people have —', 'their own phone', ['no phones at all', 'one phone for the town', 'a phone carved from wood'], 'Phones went from shared and rare to personal and everywhere.'],
  [3, 'Which sentence about inventions is TRUE?', 'New tools solve old problems.', ['Inventions only make life harder.', 'Nothing has changed in 200 years.', 'Only children can invent things.'], 'Inventions are answers to problems people had, like darkness or slow travel.'],
];

// ------------------------------------------------------------
// 6. Native nations, then and now (present tense for living cultures)
// ------------------------------------------------------------
const C4CB_NATIONS = [
  [1, 'Who lived in North America first?', 'Native nations', ['sailors from Europe', 'settlers from Spain', 'nobody at all'], 'Indigenous peoples have lived here for thousands of years, long before anyone sailed over.'],
  [1, 'Native nations today are —', 'still here', ['only in old books', 'gone from every state', 'only in movies'], 'Millions of Native people live in the United States today, in cities and on tribal lands.'],
  [1, 'The Navajo Nation is also called —', 'the Diné', ['the Pilgrims', 'the Vikings', 'the Explorers'], 'Diné is the word Navajo people use for themselves. It means "the people."'],
  [1, 'Buffalo are important to many Plains nations. They give —', 'food, tools, and warm robes', ['gold coins and silver rings', 'houses made of stone and glass', 'only pretty pictures'], 'Plains nations such as the Lakota use every part of the buffalo, and they honor it today.'],
  [1, 'Which one is a Native nation?', 'Cherokee', ['California', 'Chicago', 'Canada'], 'The Cherokee Nation is one of many Native nations in the United States.'],
  [1, 'Many Native nations have their own —', 'language and laws', ['planet in the sky', 'ocean and island', 'alphabet only'], 'Nations like the Ojibwe and Hopi have their own governments, languages, and schools.'],
  [1, 'A <b>powwow</b> is —', 'a gathering with dancing', ['a boat that carries fifty people', 'a kind of soup', 'a school test'], 'Powwows bring families together to dance, drum, sing, and visit. They happen all year.'],
  [1, 'Corn, beans, and squash planted together are called —', 'the Three Sisters', ['the Three Bears', 'the Big Dipper', 'the Three Rivers'], 'Nations such as the Haudenosaunee plant them together because they help each other grow.'],
  [2, 'Hopi and Pueblo people build homes from —', 'adobe, made of clay', ['ice cut from the sea', 'glass and shiny steel', 'paper and tape'], 'Adobe bricks keep homes cool under the hot Southwest sun.'],
  [2, 'Inuit families live in the far north. Today many travel by —', 'snowmobile', ['camel', 'canoe woven from grass', 'hot air balloon'], 'Inuit people use new tools and keep skills like hunting and sewing warm clothing.'],
  [3, 'Wampanoag people met newcomers in 1621. Today the Wampanoag —', 'live in Massachusetts', ['exist only in stories', 'moved away to another country', 'are a kind of sailing ship'], 'The Mashpee and Aquinnah Wampanoag are living communities in Massachusetts right now.'],
  [3, 'Why do many nations teach their language to children?', 'to keep it strong', ['to make school days longer', 'because English is not allowed', 'to confuse visitors'], 'Language carries stories, songs, and history, so teaching it keeps a nation strong.'],
  [3, 'A <b>treaty</b> is —', 'an agreement between nations', ['a paper that lists every school rule', 'a tall tree in a forest', 'a map that shows rivers'], 'The United States signed treaties with Native nations, and many are still law today.'],
  [3, 'Which sentence is written correctly about a living culture?', 'Lakota people speak Lakota today.', ['Lakota people only lived long ago.', 'Lakota people come from a fairy tale.', 'Lakota people all look the same.'], 'Native cultures are alive now, so we write about them in the present tense.'],
  [3, 'Sequoyah created a writing system for —', 'the Cherokee language', ['the English language', 'the Spanish language', 'a secret code for old maps'], 'His syllabary let Cherokee people read and write their own language.'],
  [3, 'Totem poles carved by nations of the Northwest Coast tell —', 'family stories', ['tomorrow\'s weather', 'math problems', 'the price of fish'], 'Carvers of nations such as the Tlingit and Haida use figures to record family history.'],
  [3, 'There are more than 500 Native nations in the United States. That shows Native cultures are —', 'many and different', ['all exactly alike', 'only one single group', 'finished and gone'], 'Each nation has its own language, land, government, and traditions.'],
  [3, 'A respectful way to talk about a Native person is to —', 'name their nation', ['guess from a movie you saw', 'use a costume word', 'say they are all the same'], 'Saying "she is Diné" or "he is Ojibwe" is more respectful and more true than one label.'],
];

// ------------------------------------------------------------
// 7. Ask a good question (soc_inquiry)
// ------------------------------------------------------------
const C4CB_ASK = [
  [1, 'Which question can you find a real answer to?', 'How tall is a giraffe?', ['Which color is the nicest?', 'What is the funniest joke?', 'Who is the coolest kid in school?'], 'Fact questions have answers you can look up. Opinion questions do not.'],
  [1, 'Where would you look to find the rivers in your town?', 'a map', ['a cookbook', 'a dictionary', 'a song book'], 'Maps show land, water, and roads.'],
  [1, 'Where would you find out what a word means?', 'a dictionary', ['a map of the state', 'a calendar', 'a lunch menu'], 'Dictionaries list words with their meanings.'],
  [1, 'You want to know how your school looked in 1950. The BEST source is —', 'an old photo', ['a new drawing', 'a weather app', 'a phone book'], 'A photo from that time shows exactly what was really there.'],
  [1, 'Who could tell you what recess was like when your grandma was 7?', 'your grandma', ['a scientist', 'the mail carrier', 'a person on TV'], 'Someone who lived it can tell you a first-hand story.'],
  [1, 'Which one is a research question?', 'Why do leaves change color?', ['Is red better than blue?', 'Do you like fall?', 'Should everyone love leaves?'], 'You can find facts about leaves. The others only ask for opinions.'],
  [1, 'Before you ask a question, it helps to —', 'think about what you know', ['close your eyes and guess the answer', 'shout the question loudly', 'wait until next year'], 'Starting from what you already know helps you ask a sharper question.'],
  [1, 'Where would you look for facts about penguins?', 'a book about birds', ['a comic about robots', 'a grocery list', 'a bus schedule'], 'Nonfiction books hold facts about real animals.'],
  [2, 'Your question is "Why is our park closed?" Who is the BEST person to ask?', 'a park worker', ['a friend at school', 'a cartoon character', 'someone in another state'], 'Ask a person who works there — they know the real reason.'],
  [2, 'Which question is too big to answer in one day?', 'How did every country begin?', ['When was our school built?', 'How many classrooms are here?', 'What do crossing guards do?'], 'Good questions are small enough that you can actually answer them.'],
  [3, 'Two books give you different answers. What should you do?', 'check a third source', ['pick the prettier book', 'stop asking questions', 'believe the longer book'], 'A third source helps you find out which answer is right.'],
  [3, 'Which source shows how a neighborhood CHANGED?', 'photos from two years', ['today\'s lunch menu', 'a math worksheet', 'a list of spelling words'], 'Comparing a then picture and a now picture shows the change.'],
  [3, 'A <b>primary source</b> is —', 'made by someone who was there', ['a book written 100 years later', 'a story someone made up', 'a summary in a school report'], 'Diaries, letters, and photos from that time are primary sources.'],
  [3, 'Turn the topic "trees" into a good question. The BEST one is —', 'Why are trees planted here?', ['Trees are nice, right?', 'Trees!', 'Do you like trees or not?'], 'A good question asks who, what, where, when, why, or how.'],
  [3, 'How many kids in your class walk to school? The BEST way to find out is to —', 'ask every classmate', ['look in an atlas', 'read a chapter book', 'check the weather report'], 'Some answers are not in books. You gather your own data.'],
  [3, 'A website has no author and no date. You should —', 'check somewhere else too', ['believe every single word', 'copy it word for word', 'tell everyone it is true'], 'Good researchers ask who wrote it and when before trusting it.'],
  [3, 'Which question could a MAP answer?', 'Which state is next to ours?', ['Was the trip fun for you?', 'Who should be class leader?', 'What is the best song ever?'], 'Maps answer where questions, not opinion questions.'],
  [3, 'After you gather your facts, the next step is to —', 'put them in order', ['throw them all away', 'hide them from friends', 'start a brand-new topic'], 'Organizing what you found helps you explain it clearly.'],
];

// ------------------------------------------------------------
// 8. Share it and do something (soc_inquiry)
// ------------------------------------------------------------
const C4CB_ACT = [
  [1, 'You learn that the park is full of litter. A small helpful action is to —', 'hold a park cleanup', ['ignore all the litter', 'drop a little more litter', 'never visit the park again'], 'Small actions by a few kids really can change a place.'],
  [1, 'Which is a good way to SHARE what you learned?', 'make a poster', ['keep it a big secret', 'erase all your notes', 'whisper it to nobody'], 'Posters, talks, and drawings help other people learn what you found.'],
  [1, 'Before you share facts, you should —', 'check that they are true', ['make them sound scary', 'change them to be funnier', 'leave out the boring parts'], 'Sharing true information is part of being a good citizen.'],
  [1, 'Your class learns the library needs books. A helpful action is to —', 'run a book drive', ['close the library', 'hide all the books', 'read a whole lot faster'], 'A book drive collects books that everyone can share.'],
  [1, 'Who should you tell about a broken sidewalk?', 'the city office', ['a bird in the tree', 'a cartoon character', 'nobody at all'], 'Leaders can fix problems once people tell them.'],
  [1, 'A helpful poster has —', 'big words and a picture', ['tiny words in one corner', 'only your name', 'no words anywhere'], 'Clear words and a picture help people understand fast.'],
  [1, 'Saving water at home is —', 'an action you can start now', ['something only grown-ups may do', 'impossible without a machine', 'a job for the mayor alone'], 'Small daily choices add up to a big difference.'],
  [1, 'Working together with classmates on a project is called —', 'teamwork', ['homework', 'recess', 'a contest'], 'Teamwork lets a group do more than one person could alone.'],
  [2, 'Your class wants a crosswalk near school. The BEST first step is to —', 'write to the city council', ['paint the street yourselves', 'stop walking to school', 'wait for somebody else'], 'Asking leaders is how citizens make safe changes happen.'],
  [2, 'Which one shows kindness AND action?', 'reading to a younger class', ['talking about reading', 'thinking about kindness', 'planning it for next year'], 'Doing the thing, not just planning it, is taking action.'],
  [3, 'After a class project, how can you show families what you learned?', 'hold a class showcase', ['put the work in the trash', 'tell only your teacher', 'keep it inside your desk'], 'Sharing with a wider group lets more people learn and help.'],
  [3, 'Your survey shows most kids want more books outside. Bring the principal —', 'the numbers you collected', ['only your own opinion', 'a total you made up', 'a story about your dog'], 'Real data makes your idea stronger and easier to believe.'],
  [3, 'Which action helps the most kids over time?', 'start a shared supply bin', ['give one pencil once', 'borrow a pencil today', 'buy yourself a new pencil'], 'A shared bin keeps helping every day, not just one time.'],
  [3, 'A classmate disagrees with your plan. A good citizen —', 'listens and asks why', ['yells even louder', 'quits the whole project', 'tells them to go away'], 'Listening to other ideas usually makes a plan better.'],
  [3, 'You want to thank a helper in your town. The BEST way is to —', 'write a thank-you letter', ['think about it quietly', 'tell it to your dog', 'plan to do it someday'], 'Telling helpers they matter is a real action that costs nothing.'],
  [3, 'Which sentence tells the RESULT of an action?', 'We collected 40 cans.', ['We might collect cans someday.', 'Cans are made out of metal.', 'Food drives sound very nice.'], 'A result tells what actually happened, with numbers when you have them.'],
  [3, 'Your first plan did not work. You should —', 'try a new plan', ['quit for good', 'blame a friend', 'pretend that it worked'], 'Trying again with a change is how citizens solve hard problems.'],
  [3, 'Why is it worth sharing what you learned?', 'others can help too', ['so nobody else finds out', 'so you can win a trophy', 'so the work is finally over'], 'Sharing turns one person\'s learning into a whole group\'s action.'],
];

// ------------------------------------------------------------
SKILLS.push(
  { id: 'soc_voting', strand: 'soc_gov', name: 'One person, one vote', gen: (lvl = 2) => C4CB_pickQ(C4CB_VOTE, lvl) },
  { id: 'soc_scarcity', strand: 'soc_econ', name: 'Not enough for everything', gen: (lvl = 2) => C4CB_pickQ(C4CB_SCARCE, lvl) },
  { id: 'soc_barter', strand: 'soc_econ', name: 'Trading before money', gen: (lvl = 2) => C4CB_pickQ(C4CB_BARTER, lvl) },
  { id: 'soc_resources', strand: 'soc_econ', name: 'Natural resources', gen: (lvl = 2) => C4CB_pickQ(C4CB_RES, lvl) },
  { id: 'soc_tech_change', strand: 'soc_time', name: 'Inventions changed life', gen: (lvl = 2) => C4CB_pickQ(C4CB_TECH, lvl) },
  { id: 'soc_indigenous', strand: 'soc_time', name: 'Native nations, then and now', gen: (lvl = 2) => C4CB_pickQ(C4CB_NATIONS, lvl) },
  { id: 'soc_inquiry_q', strand: 'soc_inquiry', name: 'Ask a good question', gen: (lvl = 2) => C4CB_pickQ(C4CB_ASK, lvl) },
  { id: 'soc_take_action', strand: 'soc_inquiry', name: 'Share it and do something', gen: (lvl = 2) => C4CB_pickQ(C4CB_ACT, lvl) },
);

/* ============================================================
   LEARNING GARDEN — Spanish slice A
   El alfabeto · Dónde se habla español · Fiestas · La edad ·
   Las formas · Los mandatos · Los meses
   ACTFL Novice recognition. Accents required everywhere.
   ============================================================ */

STRANDS.push(
  { id: 'sp_alphabet', subject: 'spanish', name: 'El alfabeto', emoji: '🔤', color: 'var(--teal)',
    lesson: `<p><b>The Spanish alphabet has almost the same letters as English — plus one extra: ñ!</b></p>
      <table class="cheat-table">
        <tr><th>Letra</th><th>Se llama (its name)</th><th></th></tr>
        <tr><td><b>b · c · d · f</b></td><td>be · ce · de · efe</td><td class="c"><button class="btn small sunny" data-say="be, ce, de, efe">🔊</button></td></tr>
        <tr><td><b>l · m · n · p</b></td><td>ele · eme · ene · pe</td><td class="c"><button class="btn small sunny" data-say="ele, eme, ene, pe">🔊</button></td></tr>
        <tr><td><b>h · j · q · z</b></td><td>hache · jota · cu · zeta</td><td class="c"><button class="btn small sunny" data-say="hache, jota, cu, zeta">🔊</button></td></tr>
        <tr><td><b>ñ</b></td><td><b>eñe</b> — says <b>ny</b>, like in canyon (niño)</td><td class="c"><button class="btn small sunny" data-say="eñe. niño">🔊</button></td></tr>
        <tr><td><b>r</b></td><td><b>erre</b></td><td class="c"><button class="btn small sunny" data-say="erre">🔊</button></td></tr>
        <tr><td><b>rr</b></td><td><b>doble erre</b> — a rolled, buzzing r (perro)</td><td class="c"><button class="btn small sunny" data-say="doble erre. perro">🔊</button></td></tr>
        <tr><td><b>ll</b></td><td>says <b>y</b>, like in yes (llama)</td><td class="c"><button class="btn small sunny" data-say="llama">🔊</button></td></tr>
        <tr><td><b>h</b></td><td>silent! It makes no sound at all (hola)</td><td class="c"><button class="btn small sunny" data-say="hola">🔊</button></td></tr>
      </table>
      <p><b>The five vowels never change their song:</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>a</b> = ah · <b>e</b> = eh · <b>i</b> = ee · <b>o</b> = oh · <b>u</b> = oo</li>
      </ul>` },

  { id: 'sp_culture', subject: 'spanish', name: 'El mundo hispano', emoji: '🌎', color: 'var(--sky)',
    lesson: `<p><b>More than 20 countries speak Spanish every day — that is about 500 million people!</b></p>
      <table class="cheat-table">
        <tr><th>Lugar</th><th>Capital</th><th>Un dato (a fact)</th></tr>
        <tr><td><b>México</b></td><td>Ciudad de México</td><td>Shares a long border with the United States.</td></tr>
        <tr><td><b>España</b></td><td>Madrid</td><td>In Europe. Spanish began here.</td></tr>
        <tr><td><b>Colombia</b></td><td>Bogotá</td><td>Named after Christopher Columbus.</td></tr>
        <tr><td><b>Argentina</b></td><td>Buenos Aires</td><td>The tango dance began here.</td></tr>
        <tr><td><b>Perú</b></td><td>Lima</td><td>Machu Picchu, an Inca stone city, sits high in its mountains.</td></tr>
        <tr><td><b>Puerto Rico</b></td><td>San Juan</td><td>A Caribbean island that is part of the United States.</td></tr>
        <tr><td><b>Cuba</b></td><td>La Habana</td><td>The largest island in the Caribbean Sea.</td></tr>
      </table>
      <p><b>Fiestas to know:</b> el Día de los Muertos · el Día de Reyes · una quinceañera · una piñata · el papel picado</p>` },

  { id: 'sp_age', subject: 'spanish', name: 'Tengo ___ años', emoji: '🎂', color: 'var(--coral)',
    lesson: `<p><b>In Spanish you do not say "I am eight." You say "I HAVE eight years"!</b></p>
      <table class="cheat-table">
        <tr><td><b>¿Cuántos años tienes?</b></td><td>How old are you?</td><td class="c"><button class="btn small sunny" data-say="¿Cuántos años tienes?">🔊</button></td></tr>
        <tr><td><b>Tengo siete años.</b></td><td>I am 7 years old.</td><td class="c"><button class="btn small sunny" data-say="Tengo siete años">🔊</button></td></tr>
        <tr><td><b>Mi hermano tiene diez años.</b></td><td>My brother is 10.</td><td class="c"><button class="btn small sunny" data-say="Mi hermano tiene diez años">🔊</button></td></tr>
        <tr><td colspan="2">6 seis · 7 siete · 8 ocho · 9 nueve · 10 diez · 11 once · 12 doce</td>
          <td class="c"><button class="btn small sunny" data-say="seis, siete, ocho, nueve, diez, once, doce">🔊</button></td></tr>
      </table>` },

  { id: 'sp_shapes', subject: 'spanish', name: 'Las formas', emoji: '🔷', color: 'var(--berry)',
    lesson: `<p><b>Las formas — shapes! Most of them sound a lot like English.</b></p>
      <table class="cheat-table">
        <tr><td><b>el círculo</b> = circle</td><td><b>el cuadrado</b> = square</td><td class="c"><button class="btn small sunny" data-say="el círculo. el cuadrado">🔊</button></td></tr>
        <tr><td><b>el triángulo</b> = triangle</td><td><b>el rectángulo</b> = rectangle</td><td class="c"><button class="btn small sunny" data-say="el triángulo. el rectángulo">🔊</button></td></tr>
        <tr><td><b>la estrella</b> = star</td><td><b>el corazón</b> = heart</td><td class="c"><button class="btn small sunny" data-say="la estrella. el corazón">🔊</button></td></tr>
        <tr><td><b>el óvalo</b> = oval</td><td><b>el rombo</b> = diamond (rhombus)</td><td class="c"><button class="btn small sunny" data-say="el óvalo. el rombo">🔊</button></td></tr>
      </table>
      <p><b>Try it:</b> <i>Dibuja un triángulo verde.</i> = Draw a green triangle.</p>` },

  { id: 'sp_commands', subject: 'spanish', name: 'Escucha y haz', emoji: '🏃', color: 'var(--leaf)',
    lesson: `<p><b>Mandatos are action words your teacher says. Listen — then do it!</b></p>
      <table class="cheat-table">
        <tr><td><b>Siéntate</b> = Sit down</td><td><b>Levántate</b> = Stand up</td><td class="c"><button class="btn small sunny" data-say="Siéntate. Levántate">🔊</button></td></tr>
        <tr><td><b>Escucha</b> = Listen</td><td><b>Mira</b> = Look</td><td class="c"><button class="btn small sunny" data-say="Escucha. Mira">🔊</button></td></tr>
        <tr><td><b>Camina</b> = Walk</td><td><b>Para</b> = Stop</td><td class="c"><button class="btn small sunny" data-say="Camina. Para">🔊</button></td></tr>
        <tr><td><b>Abre</b> = Open</td><td><b>Cierra</b> = Close</td><td class="c"><button class="btn small sunny" data-say="Abre. Cierra">🔊</button></td></tr>
        <tr><td><b>Salta</b> = Jump</td><td><b>Corre</b> = Run</td><td class="c"><button class="btn small sunny" data-say="Salta. Corre">🔊</button></td></tr>
        <tr><td><b>Ven</b> = Come here</td><td><b>Silencio</b> = Quiet, please</td><td class="c"><button class="btn small sunny" data-say="Ven. Silencio">🔊</button></td></tr>
      </table>
      <p><b>Opposites:</b> siéntate ↔ levántate · abre ↔ cierra · camina ↔ para</p>` },

  { id: 'sp_months', subject: 'spanish', name: 'Los meses', emoji: '📅', color: 'var(--sun)',
    lesson: `<p><b>Los meses del año. Big secret: in Spanish, months start with a SMALL letter.</b></p>
      <table class="cheat-table">
        <tr><td>enero (Jan) · febrero (Feb) · marzo (Mar) · abril (Apr)</td><td class="c"><button class="btn small sunny" data-say="enero, febrero, marzo, abril">🔊</button></td></tr>
        <tr><td>mayo (May) · junio (Jun) · julio (Jul) · agosto (Aug)</td><td class="c"><button class="btn small sunny" data-say="mayo, junio, julio, agosto">🔊</button></td></tr>
        <tr><td>septiembre (Sep) · octubre (Oct) · noviembre (Nov) · diciembre (Dec)</td><td class="c"><button class="btn small sunny" data-say="septiembre, octubre, noviembre, diciembre">🔊</button></td></tr>
        <tr><td><b>¿Cuándo es tu cumpleaños?</b> = When is your birthday?</td><td class="c"><button class="btn small sunny" data-say="¿Cuándo es tu cumpleaños?">🔊</button></td></tr>
      </table>` },
);

// ------------------------------------------------------------
// shared helpers
// ------------------------------------------------------------
const C4PA_lv = (l) => (l === 1 ? 1 : l === 3 ? 3 : 2);
const C4PA_three = (pool) => shuffle(pool).slice(0, 3);
const C4PA_say = (t) => `<button class="btn small sunny" data-say="${t}">🔊 Hear it</button>`;
const C4PA_cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const C4PA_mc = (o) => {
  const q = { type: 'mc', prompt: o.prompt, choices: shuffle([o.answer].concat(o.wrongs)), answer: o.answer, explain: o.explain };
  if (o.body) q.body = o.body;
  if (o.say) q.say = o.say;
  return q;
};

/* ============================================================
   1. EL ALFABETO
   ============================================================ */
// [letter, its Spanish name, level]  — only letters with ONE agreed name
const C4PA_ABC_NAMES = [
  ['b', 'be', 1], ['c', 'ce', 1], ['d', 'de', 1], ['f', 'efe', 1], ['l', 'ele', 1],
  ['m', 'eme', 1], ['n', 'ene', 1], ['p', 'pe', 1], ['s', 'ese', 1], ['t', 'te', 1],
  ['g', 'ge', 2], ['h', 'hache', 2], ['j', 'jota', 2], ['k', 'ka', 2], ['ñ', 'eñe', 2],
  ['q', 'cu', 2], ['r', 'erre', 2], ['z', 'zeta', 2], ['rr', 'doble erre', 3],
];
// [vowel, the sound it always makes]
const C4PA_ABC_VOWELS = [
  ['a', 'ah, like the a in father'], ['e', 'eh, like the e in bed'], ['i', 'ee, like the ee in see'],
  ['o', 'oh, like the o in go'], ['u', 'oo, like the oo in moon'],
];
// [letter or digraph, example word, the sound, level]
const C4PA_ABC_SOUNDS = [
  ['ñ', 'niño', 'the ny sound, like in canyon', 2],
  ['ll', 'llama', 'the y sound, like in yes', 2],
  ['h', 'hola', 'no sound at all — h is silent', 2],
  ['j', 'jugo', 'the h sound, like in hat', 2],
  ['rr', 'perro', 'a rolled, buzzing r', 3],
  ['qu', 'queso', 'the k sound, like in kite', 3],
];
const C4PA_ABC_FAKE = ['the sh sound, like in shoe', 'the kw sound, like in quick'];

SKILLS.push(
  { id: 'sp_alphabet_q', strand: 'sp_alphabet', name: 'El alfabeto',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const names = C4PA_ABC_NAMES.filter((x) => x[2] <= L);
      const sounds = C4PA_ABC_SOUNDS.filter((x) => x[3] <= L);
      const forms = L === 1 ? ['name', 'vowel'] : L === 2 ? ['name', 'vowel', 'sound', 'which'] : ['name', 'sound', 'which', 'whichsound'];
      const form = pick(forms);

      if (form === 'vowel') {
        const item = pick(C4PA_ABC_VOWELS);
        const ans = item[1];
        return C4PA_mc({
          prompt: `In Spanish the vowel <b>${item[0]}</b> always makes one sound. Which sound is it? ${C4PA_say(item[0])}`,
          answer: ans,
          wrongs: C4PA_three(C4PA_ABC_VOWELS.filter((x) => x[1] !== ans).map((x) => x[1])),
          explain: `<b>${item[0]}</b> says <b>${ans}</b>. Spanish vowels never switch — that makes reading easier than English!`,
          say: item[0],
        });
      }
      if (form === 'sound') {
        const item = pick(sounds);
        const ans = item[2];
        const pool = C4PA_ABC_SOUNDS.filter((x) => x[2] !== ans).map((x) => x[2]).concat(C4PA_ABC_FAKE);
        return C4PA_mc({
          prompt: `Listen to <b>${item[1]}</b>. What sound does <b>${item[0]}</b> make? ${C4PA_say(item[1])}`,
          answer: ans, wrongs: C4PA_three(pool),
          explain: `In <b>${item[1]}</b>, the <b>${item[0]}</b> makes <b>${ans}</b>.`,
          say: item[1],
        });
      }
      if (form === 'whichsound') {
        const item = pick(sounds);
        const ans = item[0];
        const pool = C4PA_ABC_SOUNDS.filter((x) => x[0] !== ans).map((x) => x[0]);
        return C4PA_mc({
          prompt: `Which letters make <b>${item[2]}</b> in Spanish?`,
          answer: ans, wrongs: C4PA_three(pool),
          explain: `<b>${ans}</b> makes ${item[2]} — you can hear it in <b>${item[1]}</b>.`,
          say: item[1],
        });
      }
      if (form === 'which') {
        const item = pick(names);
        const ans = item[0];
        const pool = C4PA_ABC_NAMES.filter((x) => x[0] !== ans).map((x) => x[0]);
        return C4PA_mc({
          prompt: `Your teacher says the letter <b>${item[1]}</b>. Which letter is she saying? ${C4PA_say(item[1])}`,
          answer: ans, wrongs: C4PA_three(pool),
          explain: `<b>${item[1]}</b> is the name of the letter <b>${ans}</b>.`,
          say: item[1],
        });
      }
      const item = pick(names);
      const ans = item[1];
      const pool = C4PA_ABC_NAMES.filter((x) => x[1] !== ans).map((x) => x[1]);
      return C4PA_mc({
        prompt: `What is the Spanish name of the letter <b>${item[0]}</b>?`,
        answer: ans, wrongs: C4PA_three(pool),
        explain: item[0] === 'rr'
          ? `Careful! One <b>r</b> is called <b>erre</b>. Two together, <b>rr</b>, are called <b>doble erre</b>.`
          : `The letter <b>${item[0]}</b> is called <b>${ans}</b>. Say it out loud!`,
        say: ans,
      });
    } },
);

/* ============================================================
   2. WHERE SPANISH IS SPOKEN
   ============================================================ */
// every clue points to exactly ONE place in this bank
const C4PA_PAISES = [
  { es: 'México', cap: 'Ciudad de México', clue: 'This country shares a long border with the United States, and tacos and tamales come from its kitchens.', lvl: 1 },
  { es: 'España', cap: 'Madrid', clue: 'This country sits in Europe. The Spanish language began here and then traveled across the ocean.', lvl: 1 },
  { es: 'Colombia', cap: 'Bogotá', clue: 'This South American country is named after the explorer Christopher Columbus.', lvl: 1 },
  { es: 'Argentina', cap: 'Buenos Aires', clue: 'The dance called tango began in this South American country.', lvl: 1 },
  { es: 'Perú', cap: 'Lima', clue: 'High in the mountains of this country stands Machu Picchu, a stone city the Inca built long ago.', lvl: 1 },
  { es: 'Puerto Rico', cap: 'San Juan', clue: 'This Caribbean island is part of the United States, and the people born there are U.S. citizens.', lvl: 1 },
  { es: 'Cuba', cap: 'La Habana', clue: 'This is the largest island in the Caribbean Sea, and it is a whole country by itself.', lvl: 1 },
  { es: 'Costa Rica', cap: 'San José', clue: 'This small Central American country keeps no army at all, and sloths sleep in its rainforest trees.', lvl: 1 },
  { es: 'Chile', cap: 'Santiago', clue: 'This long, skinny country runs down the western edge of South America beside the Pacific Ocean.', lvl: 2 },
  { es: 'Guatemala', cap: 'Ciudad de Guatemala', clue: 'Many Maya families live in this Central American country today, and they weave cloth in bright colors.', lvl: 2 },
  { es: 'Ecuador', cap: 'Quito', clue: 'The equator runs right through this country — that is exactly how it got its name.', lvl: 2 },
  { es: 'República Dominicana', cap: 'Santo Domingo', clue: 'This country shares one Caribbean island with its neighbor Haiti.', lvl: 2 },
];

SKILLS.push(
  { id: 'sp_culture_q', strand: 'sp_culture', name: 'Where Spanish is spoken',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const pool = C4PA_PAISES.filter((p) => p.lvl <= L);
      const forms = L === 1 ? ['clue', 'clue', 'clue', 'howmany'] : L === 2 ? ['clue', 'clue', 'capital', 'howmany'] : ['fact', 'capital', 'fromcap', 'clue'];
      const form = pick(forms);

      if (form === 'howmany') {
        const ans = 'More than 20 countries';
        return C4PA_mc({
          prompt: `About how many countries around the world use Spanish as a main language?`,
          answer: ans, wrongs: ['Only 1 country, which is Spain', 'About 5 countries, all in Europe', 'Exactly 12 countries'],
          explain: `Spanish is a main language in more than 20 countries — about 500 million people speak it!`,
        });
      }
      if (form === 'capital') {
        const p = pick(pool);
        const ans = p.cap;
        return C4PA_mc({
          prompt: `What is the capital city of <b>${p.es}</b>?`,
          answer: ans, wrongs: C4PA_three(C4PA_PAISES.filter((x) => x.cap !== ans).map((x) => x.cap)),
          explain: `The capital of <b>${p.es}</b> is <b>${ans}</b>. ${p.clue}`,
          say: ans,
        });
      }
      if (form === 'fromcap') {
        const p = pick(pool);
        const ans = p.es;
        return C4PA_mc({
          prompt: `<b>${p.cap}</b> is the capital city of which place?`,
          answer: ans, wrongs: C4PA_three(C4PA_PAISES.filter((x) => x.es !== ans).map((x) => x.es)),
          explain: `<b>${p.cap}</b> is the capital of <b>${ans}</b>.`,
          say: ans,
        });
      }
      if (form === 'fact') {
        const p = pick(pool);
        const ans = p.clue;
        return C4PA_mc({
          prompt: `Which sentence is true about <b>${p.es}</b>?`,
          answer: ans, wrongs: C4PA_three(C4PA_PAISES.filter((x) => x.clue !== ans).map((x) => x.clue)),
          explain: `Yes! ${ans} Its capital is <b>${p.cap}</b>.`,
          say: p.es,
        });
      }
      const p = pick(pool);
      const ans = p.es;
      return C4PA_mc({
        prompt: `Which place is being described?`,
        body: `<div style="font-weight:700;line-height:1.6">${p.clue}</div>`,
        answer: ans, wrongs: C4PA_three(C4PA_PAISES.filter((x) => x.es !== ans).map((x) => x.es)),
        explain: `That is <b>${ans}</b>. Its capital city is <b>${p.cap}</b>.`,
        say: ans,
      });
    } },
);

/* ============================================================
   3. FIESTAS Y CELEBRACIONES
   ============================================================ */
// when:'' means this one has no single exclusive time — never used in "when" items
const C4PA_FIESTAS = [
  { es: 'el Día de los Muertos', what: 'Families remember relatives who have died, with altars called ofrendas, orange marigolds, photos, and favorite foods.', when: 'on November 1 and 2', lvl: 1 },
  { es: 'el Día de Reyes', what: 'Children set out their shoes for the Three Kings, then wake up to gifts and a ring-shaped bread called rosca de reyes.', when: 'on January 6', lvl: 1 },
  { es: 'una quinceañera', what: 'A big celebration for a girl turning fifteen, with a special dress, a waltz with her family, and hours of dancing.', when: 'when a girl turns fifteen', lvl: 1 },
  { es: 'una piñata', what: 'A colorful paper shape packed with candy that children swing at with a stick while wearing a blindfold.', when: '', lvl: 1 },
  { es: 'el papel picado', what: 'Thin sheets of paper cut into lacy pictures and strung on lines above tables and streets.', when: '', lvl: 1 },
  { es: 'las Posadas', what: 'Nine nights of walking house to house, singing to ask for a place to stay, then sharing warm food.', when: 'on the nine nights before Christmas', lvl: 1 },
  { es: 'la Nochebuena', what: 'Christmas Eve, when families stay up late together for one huge dinner.', when: '', lvl: 1 },
  { es: 'el Cinco de Mayo', what: 'A day that remembers a battle Mexican soldiers won at Puebla, with parades, music, and dancing.', when: 'on May 5', lvl: 1 },
  { es: 'el Día de la Independencia de México', what: 'People shout "¡Viva México!" together while fireworks fill the sky, remembering the day Mexico began its fight to be free.', when: 'on September 16', lvl: 2 },
  { es: 'la Semana Santa', what: 'A week of slow parades through the streets, walking over carpets made of colored sawdust and flowers.', when: 'in the week before Easter', lvl: 2 },
  { es: 'el mariachi', what: 'A band in matching suits with violins, guitars, and trumpets that plays songs right at your table.', when: '', lvl: 2 },
  { es: 'los cascarones', what: 'Eggshells filled with confetti that friends crack gently over your head to bring you good luck.', when: '', lvl: 3 },
];

SKILLS.push(
  { id: 'sp_celebrations_q', strand: 'sp_culture', name: 'Fiestas y celebraciones',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const pool = C4PA_FIESTAS.filter((f) => f.lvl <= L);
      const dated = pool.filter((f) => f.when !== '');
      const forms = L === 1 ? ['what', 'what', 'name'] : L === 2 ? ['what', 'name', 'when'] : ['name', 'when', 'when', 'mayo'];
      const form = pick(forms);

      if (form === 'mayo') {
        const ans = 'Mexico celebrates its independence on September 16, not May 5.';
        return C4PA_mc({
          prompt: `Lots of people mix these two up. Which sentence is <b>true</b>?`,
          answer: ans,
          wrongs: [
            'El Cinco de Mayo is the day Mexico became free from Spain, so it is Mexico\'s Independence Day.',
            'Mexico has no Independence Day at all.',
            'El Cinco de Mayo and el Día de los Muertos are the same holiday.',
          ],
          explain: `El Cinco de Mayo remembers a battle won at Puebla. Mexico's Independence Day is <b>September 16</b>.`,
        });
      }
      if (form === 'when' && dated.length > 3) {
        const f = pick(dated);
        const ans = f.when;
        return C4PA_mc({
          prompt: `When does <b>${f.es}</b> happen?`,
          answer: ans, wrongs: C4PA_three(C4PA_FIESTAS.filter((x) => x.when !== '' && x.when !== ans).map((x) => x.when)),
          explain: `<b>${f.es}</b> happens ${ans}. ${f.what}`,
          say: f.es,
        });
      }
      if (form === 'name') {
        const f = pick(pool);
        const ans = f.es;
        return C4PA_mc({
          prompt: `Which celebration is this?`,
          body: `<div style="font-weight:700;line-height:1.6">${f.what}</div>`,
          answer: ans, wrongs: C4PA_three(C4PA_FIESTAS.filter((x) => x.es !== ans).map((x) => x.es)),
          explain: `That is <b>${ans}</b>.${f.when ? ` It happens ${f.when}.` : ''}`,
          say: f.es,
        });
      }
      const f = pick(pool);
      const ans = f.what;
      return C4PA_mc({
        prompt: `What is <b>${f.es}</b>? ${C4PA_say(f.es)}`,
        answer: ans, wrongs: C4PA_three(C4PA_FIESTAS.filter((x) => x.what !== ans).map((x) => x.what)),
        explain: `<b>${f.es}</b>: ${ans}`,
        say: f.es,
      });
    } },
);

/* ============================================================
   4. TENGO ___ AÑOS
   ============================================================ */
const C4PA_EDAD = [[6, 'seis'], [7, 'siete'], [8, 'ocho'], [9, 'nueve'], [10, 'diez'], [11, 'once'], [12, 'doce']];
const C4PA_GENTE = [
  ['mi hermano', 'my brother'], ['mi hermana', 'my sister'], ['mi mamá', 'my mom'],
  ['mi papá', 'my dad'], ['mi abuela', 'my grandma'], ['mi amigo', 'my friend'],
];
const C4PA_NOMBRES = ['Ana', 'Diego', 'Lucía', 'Mateo', 'Sofía', 'Javier'];

SKILLS.push(
  { id: 'sp_age_q', strand: 'sp_age', name: 'Tengo ___ años',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const nums = L === 3 ? C4PA_EDAD : C4PA_EDAD.slice(0, 5);
      const forms = L === 1 ? ['toEn', 'toEs', 'question']
        : L === 2 ? ['toEn', 'toEs', 'question', 'howold', 'ask']
          : ['toEs', 'howold', 'ask', 'otra', 'literal', 'respuesta'];
      const form = pick(forms);
      const item = pick(nums);
      const n = item[0], w = item[1];
      const others = nums.filter((x) => x[0] !== n);

      if (form === 'toEn') {
        const ans = `I am ${n} years old.`;
        return C4PA_mc({
          prompt: `What does <b>Tengo ${w} años.</b> mean? ${C4PA_say('Tengo ' + w + ' años')}`,
          answer: ans, wrongs: C4PA_three(others.map((x) => `I am ${x[0]} years old.`)),
          explain: `<b>${w}</b> means <b>${n}</b>, so <b>Tengo ${w} años</b> = I am ${n} years old.`,
          say: `Tengo ${w} años`,
        });
      }
      if (form === 'toEs') {
        const ans = `Tengo ${w} años.`;
        return C4PA_mc({
          prompt: `How do you say <b>I am ${n} years old</b> in Spanish?`,
          answer: ans, wrongs: C4PA_three(others.map((x) => `Tengo ${x[1]} años.`)),
          explain: `<b>${n}</b> is <b>${w}</b>, so you say <b>Tengo ${w} años.</b>`,
          say: `Tengo ${w} años`,
        });
      }
      if (form === 'question') {
        const ans = 'How old are you?';
        return C4PA_mc({
          prompt: `What does <b>¿Cuántos años tienes?</b> mean? ${C4PA_say('¿Cuántos años tienes?')}`,
          answer: ans, wrongs: ['What is your name?', 'Where do you live?', 'How are you today?'],
          explain: `<b>¿Cuántos años tienes?</b> = How old are you? Answer it with <b>Tengo ___ años.</b>`,
          say: '¿Cuántos años tienes?',
        });
      }
      if (form === 'howold') {
        const who = pick(C4PA_NOMBRES);
        const ans = `${n} years old`;
        return C4PA_mc({
          prompt: `${who} says: <b>Tengo ${w} años.</b> How old is ${who}? ${C4PA_say('Tengo ' + w + ' años')}`,
          answer: ans, wrongs: C4PA_three(others.map((x) => `${x[0]} years old`)),
          explain: `<b>${w}</b> is the Spanish word for <b>${n}</b>.`,
          say: `Tengo ${w} años`,
        });
      }
      if (form === 'ask') {
        const ans = '¿Cuántos años tienes?';
        return C4PA_mc({
          prompt: `You want to ask a new friend how old she is. What do you say?`,
          answer: ans, wrongs: ['¿Cómo te llamas?', '¿De dónde eres?', '¿Qué hora es?'],
          explain: `<b>¿Cuántos años tienes?</b> asks the age. (¿Cómo te llamas? asks the name.)`,
          say: ans,
        });
      }
      if (form === 'literal') {
        const ans = 'I have eight years.';
        return C4PA_mc({
          prompt: `Spanish speakers do not say "I am eight." They say <b>Tengo ocho años.</b> Word for word, what does that sentence say?`,
          answer: ans, wrongs: ['I want eight years.', 'I see eight years.', 'I count eight years.'],
          explain: `<b>Tengo</b> = I have. Spanish says you <i>have</i> your years instead of <i>being</i> them!`,
          say: 'Tengo ocho años',
        });
      }
      if (form === 'respuesta') {
        const ans = `Tengo ${w} años.`;
        return C4PA_mc({
          prompt: `Which answer fits the question <b>¿Cuántos años tienes?</b>`,
          answer: ans, wrongs: ['Me llamo Ana.', 'Tengo un perro.', 'Es de color azul.'],
          explain: `The question asks your age, so answer with <b>Tengo ___ años.</b> (Me llamo Ana = My name is Ana.)`,
          say: ans,
        });
      }
      const per = pick(C4PA_GENTE);
      const ans = C4PA_cap(`${per[0]} tiene ${w} años.`);
      const otherPer = pick(C4PA_GENTE.filter((x) => x[0] !== per[0]));
      return C4PA_mc({
        prompt: `How do you say <b>${C4PA_cap(per[1])} is ${n} years old</b> in Spanish?`,
        answer: ans,
        wrongs: [C4PA_cap(`${otherPer[0]} tiene ${w} años.`), C4PA_cap(`${per[0]} tiene ${pick(others)[1]} años.`), `Tengo ${w} años.`],
        explain: `For somebody else you use <b>tiene</b>, not tengo: <b>${ans}</b>`,
        say: ans,
      });
    } },
);

/* ============================================================
   5. LAS FORMAS
   ============================================================ */
// [spanish with article, short english, gender]
const C4PA_SHAPES = [
  ['el círculo', 'circle', 'm'], ['el cuadrado', 'square', 'm'], ['el triángulo', 'triangle', 'm'],
  ['el rectángulo', 'rectangle', 'm'], ['la estrella', 'star', 'f'], ['el corazón', 'heart', 'm'],
  ['el óvalo', 'oval', 'm'], ['el rombo', 'diamond', 'm'],
];
const C4PA_SHAPE_ART = {
  'el círculo': (c) => `<div style="width:78px;height:78px;border-radius:50%;background:${c}"></div>`,
  'el cuadrado': (c) => `<div style="width:74px;height:74px;border-radius:8px;background:${c}"></div>`,
  'el triángulo': (c) => `<div style="width:0;height:0;border-left:44px solid transparent;border-right:44px solid transparent;border-bottom:76px solid ${c}"></div>`,
  'el rectángulo': (c) => `<div style="width:112px;height:58px;border-radius:8px;background:${c}"></div>`,
  'la estrella': (c) => `<div style="font-size:86px;line-height:1;color:${c}">★</div>`,
  'el corazón': (c) => `<div style="font-size:82px;line-height:1;color:${c}">♥</div>`,
  'el óvalo': (c) => `<div style="width:112px;height:68px;border-radius:50%;background:${c}"></div>`,
  'el rombo': (c) => `<div style="width:62px;height:62px;background:${c};border-radius:6px;transform:rotate(45deg);margin:16px auto"></div>`,
};
const C4PA_SHAPE_HUES = ['var(--teal)', 'var(--sun)', 'var(--coral)', 'var(--sky)', 'var(--berry)', 'var(--leaf)'];
const C4PA_shapeBody = (es) => `<div style="display:grid;place-items:center;min-height:118px">${C4PA_SHAPE_ART[es](pick(C4PA_SHAPE_HUES))}</div>`;
// [answer, clue, shapes that could ALSO fit — never offered as distractors]
const C4PA_SHAPE_CLUES = [
  ['el triángulo', 'This shape has exactly three sides and three corners.', []],
  ['el cuadrado', 'This shape has four sides that are all the same length, and it sits flat on one of them.', ['el rombo']],
  ['el círculo', 'This shape is perfectly round the whole way around, like a wheel.', ['el óvalo']],
  ['el óvalo', 'This shape is a circle that got stretched long, so it looks like an egg.', ['el círculo']],
  ['el rectángulo', 'This shape has two long sides and two short sides.', ['el cuadrado']],
  ['el corazón', 'You draw this shape on a card for somebody you love.', []],
  ['la estrella', 'This shape has five sharp points and twinkles in the night sky.', []],
  ['el rombo', 'This shape is a square tipped up so it balances on one point.', ['el cuadrado']],
];
// [masculine, feminine, english]
const C4PA_SHAPE_COLORS = [
  ['rojo', 'roja', 'red'], ['azul', 'azul', 'blue'], ['verde', 'verde', 'green'],
  ['amarillo', 'amarilla', 'yellow'], ['morado', 'morada', 'purple'], ['negro', 'negra', 'black'],
];
const C4PA_bare = (es) => es.replace(/^(el|la)\s+/, '');

SKILLS.push(
  { id: 'sp_shapes_q', strand: 'sp_shapes', name: 'Las formas',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const forms = L === 1 ? ['pic', 'pic', 'toEs'] : L === 2 ? ['pic', 'toEs', 'toEn'] : ['clue', 'clue', 'dibuja', 'toEs'];
      const form = pick(forms);

      if (form === 'clue') {
        const c = pick(C4PA_SHAPE_CLUES);
        const ans = c[0];
        const pool = C4PA_SHAPES.filter((s) => s[0] !== ans && c[2].indexOf(s[0]) === -1).map((s) => s[0]);
        return C4PA_mc({
          prompt: `Which shape is it?`,
          body: `<div style="font-weight:700;line-height:1.6">${c[1]}</div>`,
          answer: ans, wrongs: C4PA_three(pool),
          explain: `${c[1]} That is <b>${ans}</b>.`,
          say: ans,
        });
      }
      if (form === 'dibuja') {
        const s = pick(C4PA_SHAPES);
        const col = pick(C4PA_SHAPE_COLORS);
        const es = s[2] === 'f' ? `Dibuja una ${C4PA_bare(s[0])} ${col[1]}.` : `Dibuja un ${C4PA_bare(s[0])} ${col[0]}.`;
        const ans = `Draw a ${col[2]} ${s[1]}.`;
        const otherCol = pick(C4PA_SHAPE_COLORS.filter((x) => x[2] !== col[2]));
        const otherShape = pick(C4PA_SHAPES.filter((x) => x[1] !== s[1]));
        return C4PA_mc({
          prompt: `Your teacher writes: <b>${es}</b> What does it tell you to do? ${C4PA_say(es)}`,
          answer: ans,
          wrongs: [`Draw a ${otherCol[2]} ${s[1]}.`, `Draw a ${col[2]} ${otherShape[1]}.`, `Color the ${s[1]} ${col[2]}.`],
          explain: `<b>Dibuja</b> = draw. <b>${C4PA_bare(s[0])}</b> = ${s[1]}, <b>${col[0]}</b> = ${col[2]}.`,
          say: es,
        });
      }
      if (form === 'toEn') {
        const s = pick(C4PA_SHAPES);
        const ans = s[1];
        return C4PA_mc({
          prompt: `What shape is <b>${s[0]}</b>? ${C4PA_say(s[0])}`,
          answer: ans, wrongs: C4PA_three(C4PA_SHAPES.filter((x) => x[1] !== ans).map((x) => x[1])),
          explain: `<b>${s[0]}</b> = <b>${ans}</b>${s[0] === 'el rombo' ? ' (grown-ups call it a rhombus)' : ''}.`,
          say: s[0],
        });
      }
      if (form === 'toEs') {
        const s = pick(C4PA_SHAPES);
        const ans = s[0];
        return C4PA_mc({
          prompt: `How do you say <b>${s[1]}</b> in Spanish?`,
          answer: ans, wrongs: C4PA_three(C4PA_SHAPES.filter((x) => x[0] !== ans).map((x) => x[0])),
          explain: `<b>${s[1]}</b> = <b>${ans}</b>. Tap 🔊 next time to hear it!`,
          say: ans,
        });
      }
      const s = pick(C4PA_SHAPES);
      const ans = s[0];
      return C4PA_mc({
        prompt: `¿Qué forma es? <i>(What shape is this?)</i>`,
        body: C4PA_shapeBody(ans),
        answer: ans, wrongs: C4PA_three(C4PA_SHAPES.filter((x) => x[0] !== ans).map((x) => x[0])),
        explain: `That is <b>${ans}</b> — a <b>${s[1]}</b>.`,
        say: ans,
      });
    } },
);

/* ============================================================
   6. ESCUCHA Y HAZ — mandatos
   ============================================================ */
// [spanish command, english, emoji (only when it truly shows the action), level]
const C4PA_CMD = [
  ['Siéntate', 'Sit down', '', 1], ['Levántate', 'Stand up', '', 1], ['Escucha', 'Listen', '👂', 1],
  ['Mira', 'Look', '👀', 1], ['Camina', 'Walk', '🚶', 1], ['Salta', 'Jump', '', 1],
  ['Abre', 'Open', '', 1], ['Cierra', 'Close', '', 1], ['Silencio', 'Quiet, please', '🤫', 2],
  ['Ven', 'Come here', '', 2], ['Para', 'Stop', '🛑', 2], ['Corre', 'Run', '🏃', 2],
  ['Baila', 'Dance', '💃', 3], ['Canta', 'Sing', '', 3], ['Señala', 'Point', '👉', 3],
];
const C4PA_CMD_PHRASES = [
  ['Abre el libro.', 'Open the book.'], ['Cierra la puerta.', 'Close the door.'],
  ['Mira la pizarra.', 'Look at the board.'], ['Escucha la canción.', 'Listen to the song.'],
  ['Camina a la puerta.', 'Walk to the door.'], ['Salta cinco veces.', 'Jump five times.'],
  ['Levántate, por favor.', 'Stand up, please.'], ['Siéntate en la silla.', 'Sit down on the chair.'],
  ['Ven aquí, por favor.', 'Come here, please.'], ['Señala la ventana.', 'Point to the window.'],
  ['Baila con tu amigo.', 'Dance with your friend.'], ['Canta la canción.', 'Sing the song.'],
];
const C4PA_CMD_TWO = [
  ['Levántate y salta tres veces.', 'Stand up and jump three times.'],
  ['Siéntate y escucha.', 'Sit down and listen.'],
  ['Camina despacio y para.', 'Walk slowly and stop.'],
  ['Abre el libro y mira la página.', 'Open the book and look at the page.'],
  ['Silencio, por favor. Escucha.', 'Quiet, please. Listen.'],
  ['Ven aquí y señala el mapa.', 'Come here and point to the map.'],
];
// [command, its true opposite, words that must NOT be offered]
const C4PA_CMD_OPP = [
  ['Siéntate', 'Levántate', ['Camina', 'Corre', 'Para']],
  ['Levántate', 'Siéntate', ['Camina', 'Corre', 'Para']],
  ['Abre', 'Cierra', []],
  ['Cierra', 'Abre', []],
  ['Camina', 'Para', ['Corre', 'Salta', 'Baila']],
  ['Para', 'Camina', ['Corre', 'Salta', 'Baila']],
];
const C4PA_cmdEn = (es) => {
  const hit = C4PA_CMD.filter((c) => c[0] === es)[0];
  return hit ? hit[1].toLowerCase() : es;
};

SKILLS.push(
  { id: 'sp_commands_q', strand: 'sp_commands', name: 'Escucha y haz',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const pool = C4PA_CMD.filter((c) => c[3] <= L);
      const forms = L === 1 ? ['toEn', 'toEn', 'toEs'] : L === 2 ? ['toEn', 'toEs', 'phrase'] : ['opp', 'two', 'phrase', 'toEs'];
      const form = pick(forms);

      if (form === 'opp') {
        const o = pick(C4PA_CMD_OPP);
        const ans = o[1];
        const banned = [o[0], o[1]].concat(o[2]);
        const wrongPool = C4PA_CMD.filter((c) => banned.indexOf(c[0]) === -1).map((c) => c[0]);
        return C4PA_mc({
          prompt: `Which command means the <b>opposite</b> of <b>${o[0]}</b> <i>(${C4PA_cmdEn(o[0])})</i>? ${C4PA_say(o[0])}`,
          answer: ans, wrongs: C4PA_three(wrongPool),
          explain: `<b>${o[0]}</b> (${C4PA_cmdEn(o[0])}) and <b>${ans}</b> (${C4PA_cmdEn(ans)}) are opposites.`,
          say: `${o[0]}. ${ans}`,
        });
      }
      if (form === 'two') {
        const t = pick(C4PA_CMD_TWO);
        const ans = t[1];
        return C4PA_mc({
          prompt: `Your teacher says: <b>${t[0]}</b> What are you supposed to do? ${C4PA_say(t[0])}`,
          answer: ans, wrongs: C4PA_three(C4PA_CMD_TWO.filter((x) => x[1] !== ans).map((x) => x[1])),
          explain: `<b>${t[0]}</b> = ${ans} Two commands in one — listen for both!`,
          say: t[0],
        });
      }
      if (form === 'phrase') {
        const p = pick(C4PA_CMD_PHRASES);
        const ans = p[1];
        return C4PA_mc({
          prompt: `Your teacher says: <b>${p[0]}</b> What does that mean? ${C4PA_say(p[0])}`,
          answer: ans, wrongs: C4PA_three(C4PA_CMD_PHRASES.filter((x) => x[1] !== ans).map((x) => x[1])),
          explain: `<b>${p[0]}</b> = ${ans}`,
          say: p[0],
        });
      }
      if (form === 'toEs') {
        const c = pick(pool);
        const ans = c[0];
        return C4PA_mc({
          prompt: `Your teacher wants the whole class to do this: <b>${c[1]}</b>. Which word does she say?`,
          answer: ans, wrongs: C4PA_three(C4PA_CMD.filter((x) => x[0] !== ans).map((x) => x[0])),
          explain: `<b>${c[1]}</b> = <b>${ans}</b>.${c[2] ? ' ' + c[2] : ''}`,
          say: ans,
        });
      }
      const c = pick(pool);
      const ans = c[1];
      return C4PA_mc({
        prompt: `What does <b>${c[0]}</b> mean? ${C4PA_say(c[0])}`,
        answer: ans, wrongs: C4PA_three(C4PA_CMD.filter((x) => x[1] !== ans).map((x) => x[1])),
        explain: `<b>${c[0]}</b> = <b>${ans}</b>.${c[2] ? ' ' + c[2] : ''} Now try it with your body!`,
        say: c[0],
      });
    } },
);

/* ============================================================
   7. LOS MESES
   ============================================================ */
const C4PA_MESES = [
  ['enero', 'January', 1], ['febrero', 'February', 2], ['marzo', 'March', 1], ['abril', 'April', 1],
  ['mayo', 'May', 1], ['junio', 'June', 1], ['julio', 'July', 1], ['agosto', 'August', 1],
  ['septiembre', 'September', 1], ['octubre', 'October', 1], ['noviembre', 'November', 2], ['diciembre', 'December', 2],
];

SKILLS.push(
  { id: 'sp_months_q', strand: 'sp_months', name: 'Los meses',
    gen: (lvl = 2) => {
      const L = C4PA_lv(lvl);
      const pool = C4PA_MESES.filter((m) => m[2] <= L);
      const forms = L === 1 ? ['toEn', 'toEn', 'toEs'] : L === 2 ? ['toEn', 'toEs', 'after'] : ['after', 'before', 'mayus', 'cumple', 'cuando'];
      const form = pick(forms);

      if (form === 'after' || form === 'before') {
        const i = ri(0, 11);
        const m = C4PA_MESES[i];
        const nextI = form === 'after' ? (i + 1) % 12 : (i + 11) % 12;
        const ans = C4PA_MESES[nextI][0];
        return C4PA_mc({
          prompt: form === 'after'
            ? `Which month comes right <b>after ${m[0]}</b>? ${C4PA_say(m[0])}`
            : `Which month comes right <b>before ${m[0]}</b>? ${C4PA_say(m[0])}`,
          answer: ans, wrongs: C4PA_three(C4PA_MESES.filter((x) => x[0] !== ans && x[0] !== m[0]).map((x) => x[0])),
          explain: `${m[0]} = ${m[1]}, and ${ans} = ${C4PA_MESES[nextI][1]}. ${nextI === 0 && form === 'after' ? 'After diciembre the year starts over!' : ''}`,
          say: ans,
        });
      }
      if (form === 'mayus') {
        const ans = 'Mi cumpleaños es en agosto.';
        return C4PA_mc({
          prompt: `In Spanish, months are written with a small letter. Which sentence is written <b>correctly</b>?`,
          answer: ans,
          wrongs: ['Mi cumpleaños es en Agosto.', 'Mi Cumpleaños es en Agosto.', 'mi cumpleaños es en agosto.'],
          explain: `Only the first word of a sentence gets a capital letter — <b>agosto</b> stays small. English capitalizes August, Spanish does not!`,
          say: ans,
        });
      }
      if (form === 'cuando') {
        const ans = 'When is your birthday?';
        return C4PA_mc({
          prompt: `What does <b>¿Cuándo es tu cumpleaños?</b> mean? ${C4PA_say('¿Cuándo es tu cumpleaños?')}`,
          answer: ans, wrongs: ['How old are you?', 'What is your name?', 'What day is today?'],
          explain: `<b>Cuándo</b> = when, <b>cumpleaños</b> = birthday. Answer it: <b>Mi cumpleaños es en ___.</b>`,
          say: '¿Cuándo es tu cumpleaños?',
        });
      }
      if (form === 'cumple') {
        const m = pick(C4PA_MESES);
        const ans = `Mi cumpleaños es en ${m[0]}.`;
        const other = pick(C4PA_MESES.filter((x) => x[0] !== m[0]));
        const other2 = pick(C4PA_MESES.filter((x) => x[0] !== m[0] && x[0] !== other[0]));
        return C4PA_mc({
          prompt: `Which sentence says <b>My birthday is in ${m[1]}</b>?`,
          answer: ans,
          wrongs: [`Mi cumpleaños es en ${other[0]}.`, `Mi cumpleaños es en ${other2[0]}.`, `Tu cumpleaños es en ${m[0]}.`],
          explain: `<b>Mi</b> = my, <b>tu</b> = your. ${m[1]} is <b>${m[0]}</b>.`,
          say: ans,
        });
      }
      if (form === 'toEs') {
        const m = pick(pool);
        const ans = m[0];
        return C4PA_mc({
          prompt: `How do you say <b>${m[1]}</b> in Spanish?`,
          answer: ans, wrongs: C4PA_three(C4PA_MESES.filter((x) => x[0] !== ans).map((x) => x[0])),
          explain: `<b>${m[1]}</b> = <b>${ans}</b> — with a small letter, always!`,
          say: ans,
        });
      }
      const m = pick(pool);
      const ans = m[1];
      return C4PA_mc({
        prompt: `Which month is <b>${m[0]}</b>? ${C4PA_say(m[0])}`,
        answer: ans, wrongs: C4PA_three(C4PA_MESES.filter((x) => x[1] !== ans).map((x) => x[1])),
        explain: `<b>${m[0]}</b> = <b>${ans}</b>.`,
        say: m[0],
      });
    } },
);

/* ============================================================
   LEARNING GARDEN — Spanish B
   La ropa · Me gusta · ¿Qué tiempo hace? · Las estaciones ·
   ¿Cómo estás?   Every word has a 🔊 button (built-in voice).
   ============================================================ */

STRANDS.push(
  { id: 'sp_clothing', subject: 'spanish', name: 'La ropa (Clothes)', emoji: '👕', color: 'var(--sky)',
    lesson: `<p><b>La ropa means "clothes"! Tap 🔊 to hear each word.</b></p>
      <table class="cheat-table">
        <tr><td>👕 <b>la camiseta</b> = a t-shirt</td><td>👖 <b>los pantalones</b> = pants</td><td class="c"><button class="btn small sunny" data-say="la camiseta. los pantalones">🔊</button></td></tr>
        <tr><td>👞 <b>los zapatos</b> = shoes</td><td>🧦 <b>los calcetines</b> = socks</td><td class="c"><button class="btn small sunny" data-say="los zapatos. los calcetines">🔊</button></td></tr>
        <tr><td>👗 <b>el vestido</b> = a dress</td><td><b>la falda</b> = a skirt</td><td class="c"><button class="btn small sunny" data-say="el vestido. la falda">🔊</button></td></tr>
        <tr><td>👒 <b>el sombrero</b> = a hat</td><td>🧢 <b>la gorra</b> = a cap</td><td class="c"><button class="btn small sunny" data-say="el sombrero. la gorra">🔊</button></td></tr>
        <tr><td>🧥 <b>el abrigo</b> = a coat</td><td><b>el suéter</b> = a sweater</td><td class="c"><button class="btn small sunny" data-say="el abrigo. el suéter">🔊</button></td></tr>
        <tr><td>🧣 <b>la bufanda</b> = a scarf</td><td>🧤 <b>los guantes</b> = gloves</td><td class="c"><button class="btn small sunny" data-say="la bufanda. los guantes">🔊</button></td></tr>
        <tr><td>👢 <b>las botas</b> = boots</td><td>🩳 <b>los pantalones cortos</b> = shorts</td><td class="c"><button class="btn small sunny" data-say="las botas. los pantalones cortos">🔊</button></td></tr>
      </table>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Llevo</b> means <b>I wear</b>. "Llevo una camiseta" = I wear a t-shirt.</li>
        <li>Words that end in <b>-s</b> are more than one, so they use <b>los</b> or <b>las</b>.</li>
      </ul>` },
  { id: 'sp_gustar', subject: 'spanish', name: 'Me gusta / No me gusta', emoji: '😋', color: 'var(--coral)',
    lesson: `<p><b>Tell the world what you love! Tap 🔊 to hear it.</b></p>
      <table class="cheat-table">
        <tr><td><b>Me gusta…</b> = I like…</td><td class="c"><button class="btn small sunny" data-say="Me gusta">🔊</button></td></tr>
        <tr><td><b>No me gusta…</b> = I do not like…</td><td class="c"><button class="btn small sunny" data-say="No me gusta">🔊</button></td></tr>
        <tr><td>🍕 <b>Me gusta la pizza.</b> = I like pizza.</td><td class="c"><button class="btn small sunny" data-say="Me gusta la pizza">🔊</button></td></tr>
        <tr><td>🎤 <b>Me gusta cantar.</b> = I like to sing.</td><td class="c"><button class="btn small sunny" data-say="Me gusta cantar">🔊</button></td></tr>
        <tr><td>🍲 <b>No me gusta la sopa.</b> = I do not like soup.</td><td class="c"><button class="btn small sunny" data-say="No me gusta la sopa">🔊</button></td></tr>
      </table>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Put <b>no</b> in FRONT to flip it: gusta → <b>no</b> me gusta.</li>
        <li>Action words keep their <b>-ar / -er / -ir</b> ending: cant<b>ar</b>, le<b>er</b>, escrib<b>ir</b>.</li>
      </ul>` },
  { id: 'sp_weather', subject: 'spanish', name: '¿Qué tiempo hace?', emoji: '☀️', color: 'var(--gold)',
    lesson: `<p><b>¿Qué tiempo hace? means "What is the weather like?" Tap 🔊.</b></p>
      <table class="cheat-table">
        <tr><td>☀️ <b>Hace sol.</b> = It is sunny.</td><td>☁️ <b>Está nublado.</b> = It is cloudy.</td><td class="c"><button class="btn small sunny" data-say="Hace sol. Está nublado">🔊</button></td></tr>
        <tr><td>🥶 <b>Hace frío.</b> = It is cold.</td><td>🥵 <b>Hace calor.</b> = It is hot.</td><td class="c"><button class="btn small sunny" data-say="Hace frío. Hace calor">🔊</button></td></tr>
        <tr><td>🌧️ <b>Llueve.</b> = It is raining.</td><td>🌨️ <b>Nieva.</b> = It is snowing.</td><td class="c"><button class="btn small sunny" data-say="Llueve. Nieva">🔊</button></td></tr>
        <tr><td>🌬️ <b>Hace viento.</b> = It is windy.</td><td>⛈️ <b>Hay tormenta.</b> = There is a storm.</td><td class="c"><button class="btn small sunny" data-say="Hace viento. Hay tormenta">🔊</button></td></tr>
      </table>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Hace</b> is the weather helper word — it shows up again and again.</li>
        <li>Rain and snow get their OWN word: <b>llueve</b> and <b>nieva</b>. No "hace" needed!</li>
      </ul>` },
  { id: 'sp_seasons', subject: 'spanish', name: 'Las estaciones', emoji: '🍂', color: 'var(--leaf)',
    lesson: `<p><b>Las estaciones = the seasons. Tap 🔊 to hear each one.</b></p>
      <table class="cheat-table">
        <tr><td>🌷 <b>la primavera</b> = spring</td><td>Las flores crecen. (Flowers grow.)</td><td class="c"><button class="btn small sunny" data-say="la primavera">🔊</button></td></tr>
        <tr><td>🌞 <b>el verano</b> = summer</td><td>Hace mucho calor. (It is very hot.)</td><td class="c"><button class="btn small sunny" data-say="el verano">🔊</button></td></tr>
        <tr><td>🍂 <b>el otoño</b> = fall</td><td>Las hojas se caen. (Leaves fall.)</td><td class="c"><button class="btn small sunny" data-say="el otoño">🔊</button></td></tr>
        <tr><td>❄️ <b>el invierno</b> = winter</td><td>Hace mucho frío. (It is very cold.)</td><td class="c"><button class="btn small sunny" data-say="el invierno">🔊</button></td></tr>
      </table>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>They always go in this order, then start over: primavera → verano → otoño → invierno.</li>
        <li><b>En el verano nado.</b> = In the summer I swim.</li>
      </ul>` },
  { id: 'sp_emotions', subject: 'spanish', name: '¿Cómo estás?', emoji: '😀', color: 'var(--berry)',
    lesson: `<p><b>¿Cómo estás? means "How are you?" Answer with <i>Estoy…</i></b></p>
      <table class="cheat-table">
        <tr><td>😀 <b>Estoy feliz.</b> = I am happy.</td><td>😢 <b>Estoy triste.</b> = I am sad.</td><td class="c"><button class="btn small sunny" data-say="Estoy feliz. Estoy triste">🔊</button></td></tr>
        <tr><td>😴 <b>Estoy cansado.</b> = I am tired.</td><td>😠 <b>Estoy enojado.</b> = I am angry.</td><td class="c"><button class="btn small sunny" data-say="Estoy cansado. Estoy enojado">🔊</button></td></tr>
        <tr><td>🤩 <b>Estoy emocionado.</b> = I am excited.</td><td>😨 <b>Estoy asustado.</b> = I am scared.</td><td class="c"><button class="btn small sunny" data-say="Estoy emocionado. Estoy asustado">🔊</button></td></tr>
        <tr><td>😬 <b>Estoy nervioso.</b> = I am nervous.</td><td>😲 <b>Estoy sorprendido.</b> = I am surprised.</td><td class="c"><button class="btn small sunny" data-say="Estoy nervioso. Estoy sorprendido">🔊</button></td></tr>
      </table>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Boys say cansad<b>o</b>. Girls say cansad<b>a</b>. Both are correct!</li>
        <li><b>feliz</b> and <b>triste</b> never change — everybody uses the same word.</li>
      </ul>` },
);

/* ---------- shared little helpers ---------- */
const C4PB_cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const C4PB_hear = (t) => `<button class="btn small sunny" data-say="${t}">🔊 Hear it</button>`;
const C4PB_big = (p) => `<div style="font-size:76px;line-height:1.1">${p}</div>`;
// pull n random items from list, skipping ids in bad
const C4PB_others = (list, bad, n) => shuffle(list.filter((x) => bad.indexOf(x.id) < 0)).slice(0, n);

/* ============================================================
   1 · LA ROPA
   ============================================================ */
const C4PB_ROPA = [
  { id: 'camiseta', es: 'la camiseta', en: 'a t-shirt', pic: '👕', loc: '', conf: [] },
  { id: 'pantalones', es: 'los pantalones', en: 'pants', pic: '👖', loc: 'piernas', conf: ['cortos'] },
  { id: 'zapatos', es: 'los zapatos', en: 'shoes', pic: '👞', loc: 'pies', conf: ['botas'] },
  { id: 'vestido', es: 'el vestido', en: 'a dress', pic: '👗', loc: '', conf: ['falda'] },
  { id: 'sombrero', es: 'el sombrero', en: 'a hat', pic: '👒', loc: 'cabeza', conf: ['gorra'] },
  { id: 'abrigo', es: 'el abrigo', en: 'a coat', pic: '🧥', loc: '', conf: ['sueter'] },
  { id: 'calcetines', es: 'los calcetines', en: 'socks', pic: '🧦', loc: 'pies', conf: [] },
  { id: 'gorra', es: 'la gorra', en: 'a cap', pic: '🧢', loc: 'cabeza', conf: ['sombrero'] },
  { id: 'botas', es: 'las botas', en: 'boots', pic: '👢', loc: 'pies', conf: ['zapatos'] },
  { id: 'bufanda', es: 'la bufanda', en: 'a scarf', pic: '🧣', loc: 'cuello', conf: [] },
  { id: 'guantes', es: 'los guantes', en: 'gloves', pic: '🧤', loc: 'manos', conf: [] },
  { id: 'cortos', es: 'los pantalones cortos', en: 'shorts', pic: '🩳', loc: 'piernas', conf: ['pantalones'] },
  { id: 'falda', es: 'la falda', en: 'a skirt', pic: '', loc: '', conf: ['vestido'] },
  { id: 'sueter', es: 'el suéter', en: 'a sweater', pic: '', loc: '', conf: ['abrigo'] },
  { id: 'pijama', es: 'el pijama', en: 'pajamas', pic: '', loc: '', conf: [] },
];

const C4PB_LUGARES = [
  { id: 'cabeza', txt: 'en la cabeza (on your head)' },
  { id: 'pies', txt: 'en los pies (on your feet)' },
  { id: 'manos', txt: 'en las manos (on your hands)' },
  { id: 'cuello', txt: 'en el cuello (on your neck)' },
  { id: 'piernas', txt: 'en las piernas (on your legs)' },
];

// safe distractors: never the item itself, never a look-alike (both directions)
function C4PB_ropaOthers(item, n) {
  const bad = [item.id].concat(item.conf);
  const pool = C4PB_ROPA.filter((x) => bad.indexOf(x.id) < 0 && x.conf.indexOf(item.id) < 0);
  return shuffle(pool).slice(0, n);
}

SKILLS.push({
  id: 'sp_clothing_q', strand: 'sp_clothing', name: 'La ropa',
  gen: (lvl = 2) => {
    const withPic = C4PB_ROPA.filter((x) => x.pic);

    if (lvl <= 1) {
      // picture → Spanish word
      const it = pick(withPic);
      const ans = it.es;
      const wrongs = C4PB_ropaOthers(it, 3).map((x) => x.es);
      return {
        prompt: `¿Qué es esto? <span style="font-weight:700">(What is this?)</span>`,
        body: C4PB_big(it.pic),
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `${it.pic} = <b>${it.es}</b> — that is ${it.en}. Say it out loud once and it sticks!`,
      };
    }

    if (lvl === 2) {
      const it = pick(C4PB_ROPA);
      const toEnglish = pick([true, false]);
      if (toEnglish) {
        const ans = it.en;
        const wrongs = C4PB_ropaOthers(it, 3).map((x) => x.en);
        return {
          prompt: `What does <b>${it.es}</b> mean? ${C4PB_hear(it.es)}`,
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
          explain: `<b>${it.es}</b> = <b>${it.en}</b> ${it.pic}. The little word <i>${it.es.split(' ')[0]}</i> just means "the".`,
        };
      }
      const ans = it.es;
      const wrongs = C4PB_ropaOthers(it, 3).map((x) => x.es);
      return {
        prompt: `How do you say <b>${it.en}</b> in Spanish?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `${it.en} = <b>${it.es}</b> ${it.pic}. Tap 🔊 next time to hear it again.`,
      };
    }

    // level 3
    const mode = pick(['loc', 'loc', 'sent', 'dos', 'dos']);
    if (mode === 'dos') {
      const a = pick(C4PB_ROPA);
      const rest = C4PB_ropaOthers(a, 3);
      const ans = a.en + ' and ' + rest[0].en;
      const wrongs = [
        a.en + ' and ' + rest[1].en,
        rest[2].en + ' and ' + rest[0].en,
        rest[1].en + ' and ' + rest[2].en,
      ];
      const line = 'Pablo lleva ' + a.es + ' y ' + rest[0].es + '.';
      return {
        prompt: `<b>${line}</b> ${C4PB_hear(line)}<br>What two things is Pablo wearing?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: line,
        explain: `<b>y</b> means "and". Pablo is wearing ${a.en} ${a.pic} and ${rest[0].en} ${rest[0].pic}.`,
      };
    }
    if (mode === 'loc') {
      const it = pick(C4PB_ROPA.filter((x) => x.loc));
      const spot = C4PB_LUGARES.filter((l) => l.id === it.loc)[0];
      const art = it.es.split(' ')[0];
      const pron = art === 'los' ? 'los' : art === 'las' ? 'las' : art === 'el' ? 'lo' : 'la';
      const ans = spot.txt;
      const wrongs = shuffle(C4PB_LUGARES.filter((l) => l.id !== spot.id)).slice(0, 3).map((l) => l.txt);
      return {
        prompt: `Marta lleva <b>${it.es}</b>. ¿Dónde ${pron} lleva? <span style="font-weight:700">(Where does she wear it?)</span>`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `<b>${it.es}</b> is ${it.en} ${it.pic}, so it goes <b>${spot.txt}</b>. <i>Llevar</i> means "to wear".`,
      };
    }
    const it = pick(C4PB_ROPA);
    const ans = it.en;
    const wrongs = C4PB_ropaOthers(it, 3).map((x) => x.en);
    return {
      prompt: `Read the Spanish: <b>Hoy Pablo lleva ${it.es}.</b> ${C4PB_hear('Hoy Pablo lleva ' + it.es)}<br>What is Pablo wearing?`,
      type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: 'Hoy Pablo lleva ' + it.es,
      explain: `<b>Hoy</b> = today, <b>lleva</b> = he wears. So Pablo is wearing ${it.en} ${it.pic}.`,
    };
  },
});

/* ============================================================
   2 · ME GUSTA / NO ME GUSTA
   ============================================================ */
// Two banks. Choices are ALWAYS built from one bank only, so the
// English frame ("I like pizza" vs "I like to sing") never mixes.
const C4PB_GUSTA_COSAS = [
  { id: 'pizza', es: 'la pizza', en: 'pizza', pic: '🍕' },
  { id: 'helado', es: 'el helado', en: 'ice cream', pic: '🍦' },
  { id: 'leche', es: 'la leche', en: 'milk', pic: '🥛' },
  { id: 'chocolate', es: 'el chocolate', en: 'chocolate', pic: '🍫' },
  { id: 'queso', es: 'el queso', en: 'cheese', pic: '🧀' },
  { id: 'sopa', es: 'la sopa', en: 'soup', pic: '🍲' },
  { id: 'pan', es: 'el pan', en: 'bread', pic: '🍞' },
  { id: 'musica', es: 'la música', en: 'music', pic: '🎵' },
  { id: 'futbol', es: 'el fútbol', en: 'soccer', pic: '⚽' },
  { id: 'escuela', es: 'la escuela', en: 'school', pic: '🏫' },
  { id: 'jugo', es: 'el jugo', en: 'juice', pic: '🧃' },
  { id: 'arroz', es: 'el arroz', en: 'rice', pic: '🍚' },
  { id: 'ensalada', es: 'la ensalada', en: 'salad', pic: '🥗' },
];

const C4PB_GUSTA_VERBOS = [
  { id: 'cantar', es: 'cantar', en: 'to sing', pic: '🎤' },
  { id: 'bailar', es: 'bailar', en: 'to dance', pic: '💃' },
  { id: 'leer', es: 'leer', en: 'to read', pic: '📖' },
  { id: 'correr', es: 'correr', en: 'to run', pic: '🏃' },
  { id: 'nadar', es: 'nadar', en: 'to swim', pic: '🏊' },
  { id: 'pintar', es: 'pintar', en: 'to paint', pic: '🎨' },
  { id: 'dibujar', es: 'dibujar', en: 'to draw', pic: '✏️' },
  { id: 'cocinar', es: 'cocinar', en: 'to cook', pic: '🍳' },
  { id: 'escribir', es: 'escribir', en: 'to write', pic: '✍️' },
  { id: 'comer', es: 'comer', en: 'to eat', pic: '🍽️' },
  { id: 'saltar', es: 'saltar', en: 'to jump', pic: '' },
  { id: 'jugar', es: 'jugar', en: 'to play', pic: '' },
];

SKILLS.push({
  id: 'sp_gustar_q', strand: 'sp_gustar', name: 'Me gusta / No me gusta',
  gen: (lvl = 2) => {
    const bank = pick([C4PB_GUSTA_COSAS, C4PB_GUSTA_VERBOS]);
    const it = pick(bank);
    const others = C4PB_others(bank, [it.id], 3);

    if (lvl <= 1) {
      // Spanish sentence → English meaning. Always positive at level 1.
      const ans = 'I like ' + it.en + '.';
      const wrongs = others.map((x) => 'I like ' + x.en + '.');
      return {
        prompt: `What does this mean? <b>Me gusta ${it.es}.</b> ${C4PB_hear('Me gusta ' + it.es)}`,
        body: it.pic ? C4PB_big(it.pic) : '',
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: 'Me gusta ' + it.es,
        explain: `<b>Me gusta</b> = I like. So <b>Me gusta ${it.es}</b> means "${ans}"`,
      };
    }

    if (lvl === 2) {
      const negative = pick([true, false]);
      const stem = negative ? 'No me gusta ' : 'Me gusta ';
      const enStem = negative ? 'I do not like ' : 'I like ';
      const toSpanish = pick([true, false]);
      if (toSpanish) {
        const ans = stem + it.es + '.';
        const wrongs = others.map((x) => stem + x.es + '.');
        return {
          prompt: `How do you say <b>${enStem + it.en}</b> in Spanish?`,
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
          explain: `${enStem}${it.en} = <b>${ans}</b> ${it.pic} Keep the words in that order every time.`,
        };
      }
      const ans = enStem + it.en + '.';
      const wrongs = others.map((x) => enStem + x.en + '.');
      return {
        prompt: `What does this mean? <b>${stem + it.es}.</b> ${C4PB_hear(stem + it.es)}`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: stem + it.es,
        explain: `<b>${stem.trim()}</b> = ${enStem.trim()}. ${negative ? 'The little word <b>no</b> at the front flips the whole sentence!' : 'No "no" at the front means you LIKE it.'}`,
      };
    }

    // level 3 — you must catch the meaning AND the yes/no
    const mode = pick(['polarity', 'polarity', 'fill', 'tercera']);
    if (mode === 'tercera') {
      const line = 'A Pablo le gusta ' + it.es + '.';
      const ans = 'Pablo likes ' + it.en + '.';
      const wrongs = others.map((x) => 'Pablo likes ' + x.en + '.');
      return {
        prompt: `What does this mean? <b>${line}</b> ${C4PB_hear(line)}`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: line,
        explain: `When you talk about somebody else you use <b>le gusta</b> instead of <b>me gusta</b>. So this one means "${ans}"`,
      };
    }
    if (mode === 'polarity') {
      const negative = pick([true, false]);
      const other = others[0];
      const ans = (negative ? 'I do not like ' : 'I like ') + it.en + '.';
      const wrongs = [
        (negative ? 'I like ' : 'I do not like ') + it.en + '.',
        'I like ' + other.en + '.',
        'I do not like ' + other.en + '.',
      ];
      const line = (negative ? 'No me gusta ' : 'Me gusta ') + it.es + '.';
      return {
        prompt: `Ana says: <b>${line}</b> ${C4PB_hear(line)}<br>What does Ana mean?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: line,
        explain: `Read the front of the sentence first! <b>${negative ? 'No me gusta' : 'Me gusta'}</b> = ${negative ? 'I do not like' : 'I like'}, and <b>${it.es}</b> = ${it.en}.`,
      };
    }
    const ans = it.es;
    const wrongs = others.map((x) => x.es);
    return {
      prompt: `Finish the sentence. <b>Me gusta ______.</b> <span style="font-weight:700">(I like ${it.en}.)</span>`,
      type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: 'Me gusta ' + it.es,
      explain: `${C4PB_cap(it.en)} = <b>${it.es}</b> ${it.pic}, so the sentence is <b>Me gusta ${it.es}.</b>`,
    };
  },
});

/* ============================================================
   3 · ¿QUÉ TIEMPO HACE?
   ============================================================ */
// conf = looks too much alike in a picture, so never each other's distractor
const C4PB_TIEMPO = [
  { id: 'sol', es: 'Hace sol.', en: 'It is sunny.', pic: '☀️', pico: true, conf: [] },
  { id: 'frio', es: 'Hace frío.', en: 'It is cold.', pic: '🥶', pico: true, conf: ['nieve'] },
  { id: 'calor', es: 'Hace calor.', en: 'It is hot.', pic: '🥵', pico: true, conf: ['sol'] },
  { id: 'lluvia', es: 'Llueve.', en: 'It is raining.', pic: '🌧️', pico: true, conf: ['tormenta'] },
  { id: 'nieve', es: 'Nieva.', en: 'It is snowing.', pic: '🌨️', pico: true, conf: ['frio'] },
  { id: 'viento', es: 'Hace viento.', en: 'It is windy.', pic: '🌬️', pico: true, conf: [] },
  { id: 'nublado', es: 'Está nublado.', en: 'It is cloudy.', pic: '☁️', pico: true, conf: ['niebla'] },
  { id: 'tormenta', es: 'Hay tormenta.', en: 'There is a storm.', pic: '⛈️', pico: false, conf: ['lluvia'] },
  { id: 'niebla', es: 'Hay niebla.', en: 'It is foggy.', pic: '🌫️', pico: true, conf: ['nublado'] },
];

// weather + what you need. The wrong list is written by hand so a coat
// and a scarf are never each other's distractor.
const C4PB_NECESITA = [
  { w: 'frio', good: ['el abrigo', 'la bufanda', 'los guantes'], bad: ['el traje de baño', 'las gafas de sol', 'las sandalias', 'el ventilador'] },
  { w: 'calor', good: ['el traje de baño', 'las sandalias', 'el ventilador'], bad: ['el abrigo', 'la bufanda', 'los guantes', 'las botas'] },
  { w: 'sol', good: ['las gafas de sol', 'el sombrero'], bad: ['el abrigo', 'los guantes', 'las botas', 'la bufanda'] },
  { w: 'lluvia', good: ['el paraguas', 'las botas'], bad: ['las gafas de sol', 'el traje de baño', 'el ventilador', 'las sandalias'] },
  { w: 'nieve', good: ['los guantes', 'el abrigo', 'las botas'], bad: ['el traje de baño', 'las gafas de sol', 'las sandalias', 'el ventilador'] },
];

const C4PB_COSA_EN = {
  'el abrigo': 'a coat', 'la bufanda': 'a scarf', 'los guantes': 'gloves',
  'el traje de baño': 'a swimsuit', 'las gafas de sol': 'sunglasses', 'las sandalias': 'sandals',
  'el ventilador': 'a fan', 'las botas': 'boots', 'el paraguas': 'an umbrella',
  'el sombrero': 'a sun hat',
};

const C4PB_ESCENAS_T = [
  { txt: 'Los niños abren los paraguas y hay charcos en la calle.', w: 'lluvia' },
  { txt: 'Todo es blanco y los niños hacen un muñeco de nieve.', w: 'nieve' },
  { txt: 'Marta lleva gafas de sol y el cielo está muy azul.', w: 'sol' },
  { txt: 'Las hojas vuelan y la cometa sube muy alto.', w: 'viento' },
  { txt: 'El cielo está gris, pero no cae agua.', w: 'nublado' },
  { txt: 'Todos beben agua fría y buscan la sombra de un árbol.', w: 'calor' },
  { txt: 'Los niños llevan abrigos, gorros y guantes.', w: 'frio' },
  { txt: 'Se oyen truenos muy fuertes y el cielo está negro.', w: 'tormenta' },
  { txt: 'Una nube gris toca el suelo y no vemos muy lejos.', w: 'niebla' },
];

function C4PB_tiempoOthers(item, n) {
  const bad = [item.id].concat(item.conf);
  const pool = C4PB_TIEMPO.filter((x) => bad.indexOf(x.id) < 0 && x.conf.indexOf(item.id) < 0);
  return shuffle(pool).slice(0, n);
}
const C4PB_byId = (list, id) => list.filter((x) => x.id === id)[0];

SKILLS.push({
  id: 'sp_weather_q', strand: 'sp_weather', name: '¿Qué tiempo hace?',
  gen: (lvl = 2) => {
    if (lvl <= 1) {
      const it = pick(C4PB_TIEMPO.filter((x) => x.pico));
      const ans = it.es;
      const wrongs = C4PB_tiempoOthers(it, 3).map((x) => x.es);
      return {
        prompt: `¿Qué tiempo hace? <span style="font-weight:700">(What is the weather?)</span>`,
        body: C4PB_big(it.pic),
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `${it.pic} <b>${it.es}</b> = ${it.en} Say it out loud — weather words come up every single day!`,
      };
    }

    if (lvl === 2) {
      const it = pick(C4PB_TIEMPO);
      const toEnglish = pick([true, false]);
      if (toEnglish) {
        const ans = it.en;
        const wrongs = C4PB_tiempoOthers(it, 3).map((x) => x.en);
        return {
          prompt: `What does <b>${it.es}</b> mean? ${C4PB_hear(it.es)}`,
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
          explain: `<b>${it.es}</b> = ${it.en} ${it.pic}`,
        };
      }
      const ans = it.es;
      const wrongs = C4PB_tiempoOthers(it, 3).map((x) => x.es);
      return {
        prompt: `How do you say <b>${it.en}</b> in Spanish?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `${it.en} = <b>${it.es}</b> ${it.pic} ${it.es.indexOf('Hace') === 0 ? 'Most weather words start with <b>hace</b>.' : 'This one does not use <i>hace</i> — it is its own word!'}`,
      };
    }

    // level 3
    const mode = pick(['escena', 'escena', 'necesita']);
    if (mode === 'escena') {
      const sc = pick(C4PB_ESCENAS_T);
      const it = C4PB_byId(C4PB_TIEMPO, sc.w);
      const ans = it.es;
      const wrongs = C4PB_tiempoOthers(it, 3).map((x) => x.es);
      return {
        prompt: `Read the clue, then answer: <b>¿Qué tiempo hace?</b>`,
        body: `<div style="font-weight:800;font-size:20px;line-height:1.6">${sc.txt}</div>`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: sc.txt,
        explain: `The clue points to <b>${it.es}</b> — ${it.en} ${it.pic} Detectives use clues instead of pictures!`,
      };
    }
    const row = pick(C4PB_NECESITA);
    const it = C4PB_byId(C4PB_TIEMPO, row.w);
    const ans = pick(row.good);
    const wrongs = shuffle(row.bad.slice(0)).slice(0, 3);
    return {
      prompt: `<b>${it.es}</b> ${it.pic} ¿Qué necesitas? <span style="font-weight:700">(What do you need?)</span>`,
      type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
      explain: `When ${it.en.toLowerCase().replace('.', '')}, you need <b>${ans}</b> (${C4PB_COSA_EN[ans]}). <i>Necesitas</i> means "you need".`,
    };
  },
});

/* ============================================================
   4 · LAS ESTACIONES
   ============================================================ */
const C4PB_ESTACIONES = [
  { id: 'primavera', es: 'la primavera', en: 'spring', pic: '🌷', de: 'de la primavera', next: 'verano' },
  { id: 'verano', es: 'el verano', en: 'summer', pic: '🌞', de: 'del verano', next: 'otono' },
  { id: 'otono', es: 'el otoño', en: 'fall (autumn)', pic: '🍂', de: 'del otoño', next: 'invierno' },
  { id: 'invierno', es: 'el invierno', en: 'winter', pic: '❄️', de: 'del invierno', next: 'primavera' },
];

const C4PB_EVENTOS = [
  { es: 'Las flores crecen en el jardín.', en: 'Flowers grow in the garden.', s: 'primavera', easy: true },
  { es: 'Nacen los pajaritos en el nido.', en: 'Baby birds hatch in the nest.', s: 'primavera', easy: true },
  { es: 'Vemos mariposas nuevas.', en: 'We see new butterflies.', s: 'primavera', easy: true },
  { es: 'Todo empieza a crecer otra vez.', en: 'Everything starts growing again.', s: 'primavera', easy: false },
  { es: 'Hace mucho calor y nadamos.', en: 'It is very hot and we swim.', s: 'verano', easy: true },
  { es: 'Comemos helado en la playa.', en: 'We eat ice cream at the beach.', s: 'verano', easy: true },
  { es: 'Los días son muy largos.', en: 'The days are the longest.', s: 'verano', easy: false },
  { es: 'Las hojas se caen de los árboles.', en: 'Leaves fall off the trees.', s: 'otono', easy: true },
  { es: 'Recogemos manzanas y calabazas.', en: 'We pick apples and pumpkins.', s: 'otono', easy: true },
  { es: 'Las hojas son rojas y anaranjadas.', en: 'The leaves turn red and orange.', s: 'otono', easy: false },
  { es: 'Nieva y hace mucho frío.', en: 'It snows and it is very cold.', s: 'invierno', easy: true },
  { es: 'Llevamos abrigos y guantes.', en: 'We wear coats and gloves.', s: 'invierno', easy: true },
  { es: 'Los árboles no tienen hojas.', en: 'The trees have no leaves at all.', s: 'invierno', easy: false },
  { es: 'Los días son muy cortos y oscuros.', en: 'The days are short and dark.', s: 'invierno', easy: false },
];

SKILLS.push({
  id: 'sp_seasons_q', strand: 'sp_seasons', name: 'Las estaciones',
  gen: (lvl = 2) => {
    const all = C4PB_ESTACIONES;

    if (lvl <= 1) {
      const mode = pick(['word', 'word', 'evento']);
      if (mode === 'word') {
        const it = pick(all);
        const toEnglish = pick([true, false]);
        if (toEnglish) {
          const ans = it.en;
          const wrongs = C4PB_others(all, [it.id], 3).map((x) => x.en);
          return {
            prompt: `Which season is <b>${it.es}</b>? ${C4PB_hear(it.es)}`,
            body: C4PB_big(it.pic),
            type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
            explain: `<b>${it.es}</b> = ${it.en} ${it.pic}`,
          };
        }
        const ans = it.es;
        const wrongs = C4PB_others(all, [it.id], 3).map((x) => x.es);
        return {
          prompt: `How do you say <b>${it.en}</b> in Spanish?`,
          body: C4PB_big(it.pic),
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
          explain: `${C4PB_cap(it.en)} = <b>${it.es}</b> ${it.pic}`,
        };
      }
      const ev = pick(C4PB_EVENTOS.filter((e) => e.easy));
      const it = C4PB_byId(all, ev.s);
      const ans = it.es;
      const wrongs = C4PB_others(all, [it.id], 3).map((x) => x.es);
      return {
        prompt: `<b>${ev.en}</b><br>¿Qué estación es? <span style="font-weight:700">(Which season?)</span>`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `That happens in <b>${it.es}</b> ${it.pic} — ${it.en}.`,
      };
    }

    if (lvl === 2) {
      const mode = pick(['evento', 'evento', 'quepasa']);
      if (mode === 'evento') {
        const ev = pick(C4PB_EVENTOS);
        const it = C4PB_byId(all, ev.s);
        const ans = it.es;
        const wrongs = C4PB_others(all, [it.id], 3).map((x) => x.es);
        return {
          prompt: `<b>${ev.en}</b><br>¿Qué estación es?`,
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
          explain: `That is <b>${it.es}</b> ${it.pic} (${it.en}).`,
        };
      }
      const it = pick(all);
      const mine = shuffle(C4PB_EVENTOS.filter((e) => e.s === it.id));
      const ans = mine[0].en;
      const wrongs = shuffle(C4PB_EVENTOS.filter((e) => e.s !== it.id)).slice(0, 3).map((e) => e.en);
      return {
        prompt: `¿Qué pasa en <b>${it.es}</b>? ${C4PB_hear(it.es)} <span style="font-weight:700">(What happens in ${it.en}?)</span>`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `In <b>${it.es}</b> ${it.pic}: ${ans}`,
      };
    }

    // level 3 — read the clue in Spanish, or know the order
    const mode = pick(['esclue', 'esclue', 'orden', 'orden', 'espasa', 'espasa']);
    if (mode === 'espasa') {
      const it = pick(all);
      const mine = shuffle(C4PB_EVENTOS.filter((e) => e.s === it.id));
      const ans = mine[0].es;
      const wrongs = shuffle(C4PB_EVENTOS.filter((e) => e.s !== it.id)).slice(0, 3).map((e) => e.es);
      return {
        prompt: `¿Qué pasa en <b>${it.es}</b>? ${C4PB_hear(it.es)} <span style="font-weight:700">(What happens in ${it.en}?)</span>`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
        explain: `<b>${ans}</b> means "${mine[0].en}" That happens in ${it.es} ${it.pic}.`,
      };
    }
    if (mode === 'esclue') {
      const ev = pick(C4PB_EVENTOS);
      const it = C4PB_byId(all, ev.s);
      const ans = it.es;
      const wrongs = C4PB_others(all, [it.id], 3).map((x) => x.es);
      return {
        prompt: `Read the Spanish clue: <b>${ev.es}</b> ${C4PB_hear(ev.es)}<br>¿Qué estación es?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ev.es,
        explain: `${ev.es} = "${ev.en}" That is <b>${it.es}</b> ${it.pic}.`,
      };
    }
    const it = pick(all);
    const after = pick([true, false]);
    let target;
    if (after) { target = C4PB_byId(all, it.next); }
    else { target = all.filter((x) => x.next === it.id)[0]; }
    const ans = target.es;
    const wrongs = C4PB_others(all, [target.id], 3).map((x) => x.es);
    return {
      prompt: `¿Qué estación viene <b>${after ? 'después' : 'antes'}</b> ${it.de}? <span style="font-weight:700">(Which season comes ${after ? 'after' : 'before'} ${it.en}?)</span>`,
      type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
      explain: `The order always goes primavera 🌷 → verano 🌞 → otoño 🍂 → invierno ❄️ → and around again. So <b>${ans}</b> comes ${after ? 'after' : 'before'} ${it.es}.`,
    };
  },
});

/* ============================================================
   5 · ¿CÓMO ESTÁS?
   ============================================================ */
// ex = feelings too close to this one — never used as its distractor
const C4PB_EMO = [
  { id: 'feliz', es: 'feliz', en: 'happy', pic: '😀', ex: ['emocionado', 'sorprendido', 'tranquilo', 'orgulloso'] },
  { id: 'triste', es: 'triste', en: 'sad', pic: '😢', ex: ['enfermo'] },
  { id: 'cansado', es: 'cansado', en: 'tired', pic: '😴', ex: ['aburrido', 'enfermo', 'tranquilo'] },
  { id: 'enojado', es: 'enojado', en: 'angry', pic: '😠', ex: [] },
  { id: 'emocionado', es: 'emocionado', en: 'excited', pic: '🤩', ex: ['feliz', 'sorprendido', 'nervioso'] },
  { id: 'asustado', es: 'asustado', en: 'scared', pic: '😨', ex: ['nervioso', 'sorprendido'] },
  { id: 'nervioso', es: 'nervioso', en: 'nervous', pic: '😬', ex: ['asustado', 'emocionado'] },
  { id: 'sorprendido', es: 'sorprendido', en: 'surprised', pic: '😲', ex: ['asustado', 'emocionado', 'feliz'] },
  { id: 'enfermo', es: 'enfermo', en: 'sick', pic: '🤒', ex: ['cansado', 'triste'] },
  { id: 'aburrido', es: 'aburrido', en: 'bored', pic: '😑', ex: ['cansado', 'triste'] },
  { id: 'orgulloso', es: 'orgulloso', en: 'proud', pic: '', ex: ['feliz', 'emocionado'] },
  { id: 'tranquilo', es: 'tranquilo', en: 'calm', pic: '😌', ex: ['cansado', 'feliz'] },
];

const C4PB_ESCENAS_E = [
  { es: 'Es tu cumpleaños y hay pastel de chocolate.', en: 'It is your birthday and there is chocolate cake.', e: 'feliz' },
  { es: 'Tu helado se cayó al suelo.', en: 'Your ice cream fell on the ground.', e: 'triste', mas: ['enojado'] },
  { es: 'Jugaste todo el día y ahora bostezas.', en: 'You played all day and now you are yawning.', e: 'cansado' },
  { es: 'Tu hermano rompió tu dibujo a propósito.', en: 'Your brother ripped your drawing on purpose.', e: 'enojado', mas: ['triste'] },
  { es: 'Mañana vas al parque de diversiones.', en: 'Tomorrow you are going to the amusement park.', e: 'emocionado' },
  { es: 'Hay un ruido muy fuerte en la oscuridad.', en: 'There is a loud noise in the dark.', e: 'asustado' },
  { es: 'Vas a cantar delante de toda la escuela.', en: 'You are about to sing in front of the whole school.', e: 'nervioso' },
  { es: 'Tus amigos saltan de detrás del sofá. ¡Sorpresa!', en: 'Your friends jump out from behind the couch. Surprise!', e: 'sorprendido' },
  { es: 'Tienes fiebre y te duele la cabeza.', en: 'You have a fever and your head hurts.', e: 'enfermo' },
  { es: 'Llueve, no hay nada que hacer y miras el reloj.', en: 'It is raining, there is nothing to do, and you keep watching the clock.', e: 'aburrido' },
  { es: 'Terminaste un libro muy grande tú solo.', en: 'You finished a really big book all by yourself.', e: 'orgulloso' },
  { es: 'Lees en tu cama y todo está en silencio.', en: 'You are reading in bed and everything is quiet.', e: 'tranquilo' },
];

function C4PB_emoOthers(item, extra, n) {
  const bad = [item.id].concat(item.ex).concat(extra || []);
  const pool = C4PB_EMO.filter((x) => bad.indexOf(x.id) < 0 && x.ex.indexOf(item.id) < 0);
  return shuffle(pool).slice(0, n);
}

SKILLS.push({
  id: 'sp_emotions_q', strand: 'sp_emotions', name: '¿Cómo estás?',
  gen: (lvl = 2) => {
    if (lvl <= 1) {
      const mode = pick(['cara', 'cara', 'palabra']);
      if (mode === 'cara') {
        const it = pick(C4PB_EMO.filter((x) => x.pic));
        const ans = 'Estoy ' + it.es + '.';
        const wrongs = C4PB_emoOthers(it, [], 3).map((x) => 'Estoy ' + x.es + '.');
        return {
          prompt: `¿Cómo está? <span style="font-weight:700">(How does this face feel?)</span>`,
          body: C4PB_big(it.pic),
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
          explain: `${it.pic} <b>${ans}</b> = I am ${it.en}. <b>Estoy</b> means "I am".`,
        };
      }
      const it = pick(C4PB_EMO);
      const ans = it.en;
      const wrongs = shuffle(C4PB_EMO.filter((x) => x.id !== it.id)).slice(0, 3).map((x) => x.en);
      return {
        prompt: `What does <b>${it.es}</b> mean? ${C4PB_hear(it.es)}`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: it.es,
        explain: `<b>${it.es}</b> = ${it.en} ${it.pic}`,
      };
    }

    if (lvl === 2) {
      const mode = pick(['escena', 'escena', 'aespanol']);
      if (mode === 'escena') {
        const sc = pick(C4PB_ESCENAS_E);
        const it = C4PB_byId(C4PB_EMO, sc.e);
        const ans = 'Estoy ' + it.es + '.';
        const wrongs = C4PB_emoOthers(it, sc.mas, 3).map((x) => 'Estoy ' + x.es + '.');
        return {
          prompt: `${sc.en}<br>¿Cómo estás? <span style="font-weight:700">(How do you feel?)</span>`,
          type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
          explain: `You would say <b>${ans}</b> — I am ${it.en} ${it.pic}${it.es.slice(-1) === 'o' ? '. A girl would say <b>' + it.es.slice(0, -1) + 'a</b>.' : '.'}`,
        };
      }
      const it = pick(C4PB_EMO);
      const ans = 'Estoy ' + it.es + '.';
      const wrongs = C4PB_emoOthers(it, [], 3).map((x) => 'Estoy ' + x.es + '.');
      return {
        prompt: `How do you say <b>I am ${it.en}</b> in Spanish?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: ans,
        explain: `I am ${it.en} = <b>${ans}</b> ${it.pic} Start every feeling with <b>Estoy</b>.`,
      };
    }

    // level 3 — read the scene in Spanish
    const mode = pick(['esescena', 'esescena', 'pregunta', 'amiga']);
    if (mode === 'amiga') {
      const it = pick(C4PB_EMO);
      const fem = it.es.slice(-1) === 'o' ? it.es.slice(0, -1) + 'a' : it.es;
      const line = 'Estoy ' + fem + '.';
      const ans = it.en;
      const wrongs = C4PB_emoOthers(it, [], 3).map((x) => x.en);
      return {
        prompt: `Tu amiga Sofía dice: <b>${line}</b> ${C4PB_hear(line)}<br>How does Sofía feel?`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: line,
        explain: `<b>${fem}</b> = ${it.en} ${it.pic}${fem === it.es ? '. This word stays the same for boys and girls.' : '. Sofía is a girl, so the <b>-o</b> in <i>' + it.es + '</i> changes to <b>-a</b>.'}`,
      };
    }
    if (mode === 'esescena') {
      const sc = pick(C4PB_ESCENAS_E);
      const it = C4PB_byId(C4PB_EMO, sc.e);
      const ans = 'Estoy ' + it.es + '.';
      const wrongs = C4PB_emoOthers(it, sc.mas, 3).map((x) => 'Estoy ' + x.es + '.');
      return {
        prompt: `Read the Spanish, then answer <b>¿Cómo estás?</b>`,
        body: `<div style="font-weight:800;font-size:20px;line-height:1.6">${sc.es}</div>`,
        type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: sc.es,
        explain: `"${sc.es}" means "${sc.en}" So you would say <b>${ans}</b> (I am ${it.en}) ${it.pic}`,
      };
    }
    const it = pick(C4PB_EMO);
    const ans = it.es;
    const wrongs = C4PB_emoOthers(it, [], 3).map((x) => x.es);
    return {
      prompt: `Someone asks: <b>¿Cómo estás?</b> You feel <b>${it.en}</b>.<br>Finish your answer: <b>Estoy ______.</b>`,
      type: 'mc', choices: shuffle([ans, wrongs[0], wrongs[1], wrongs[2]]), answer: ans, say: 'Estoy ' + it.es,
      explain: `${C4PB_cap(it.en)} = <b>${it.es}</b> ${it.pic} The whole answer is <b>Estoy ${it.es}.</b>`,
    };
  },
});

// ============================================================
// CHUNK 4 / TYPING SLICE 2 — Computer Basics: healthy bodies,
// safe sign-ins, kind words, upstanders, balance, and files.
// All skills attach to the EXISTING strand `comp_basics`.
// ============================================================

// Bank entry shape: [prompt, answer, [d1, d2, d3], explain, tier]
// tier 1 = easy · tier 2 = medium · tier 3 = stretch
// Level 1 -> tier 1 only · Level 2 -> tiers 1+2 · Level 3 -> tiers 2+3
function C4T2_ask(bank, lvl) {
  var L = (lvl === 1 || lvl === 3) ? lvl : 2;
  var pool;
  if (L === 1) pool = bank.filter(function (e) { return e[4] === 1; });
  else if (L === 2) pool = bank.filter(function (e) { return e[4] <= 2; });
  else pool = bank.filter(function (e) { return e[4] >= 2; });
  if (!pool.length) pool = bank;
  var it = pick(pool);
  var key = it[1];
  return {
    prompt: it[0], type: 'mc',
    choices: shuffle([key].concat(it[2])),
    answer: key,
    explain: it[3],
  };
}

// ------------------------------------------------------------
// 1. SIT TALL, TYPE HAPPY
// ------------------------------------------------------------
const C4T2_POSTURE_BANK = [
  ['Where should your feet be while you type?', 'flat on the floor', ['swinging in the air', 'tucked under you on the chair', 'up on the desk'], 'Flat feet give your whole body a steady base, like roots on a tree.', 1],
  ['How should your back be when you sit down to type?', 'tall, with the chair holding it up', ['curled over like a shrimp', 'leaning way out to one side', 'flat on the floor'], 'A tall back lets you breathe easy and keeps your shoulders from aching.', 1],
  ['Where does the screen belong?', 'about even with your eyes', ['down by your knees', 'high above your head', 'behind your chair'], 'Eye level means your neck stays straight instead of bending all day.', 1],
  ['What should your shoulders do while you type?', 'stay loose and low', ['squeeze up by your ears', 'twist far to the right', 'push hard into the chair'], 'Loose shoulders stay comfy. Squeezed-up shoulders get sore fast.', 1],
  ['Where should your wrists be while your fingers tap the keys?', 'lifted a little, not pressed on the desk', ['mashed against the desk edge', 'hanging below your knees', 'pressed flat on the desk so they hold still'], 'Floating wrists let your fingers reach every key without hurting.', 1],
  ['You are learning to type. Which matters more right now?', 'getting the letters right', ['being the loudest typer', 'beating everyone in the room', 'finishing before you even read the word'], 'Accuracy first, speed later. Correct fingers get fast all by themselves.', 1],
  ['Your eyes feel dry and tired after typing. What helps?', 'look at something far away for a moment', ['put your nose closer to the screen', 'turn the brightness up as high as it goes', 'rub them hard and keep going'], 'Looking far away lets the tiny muscles inside your eyes relax.', 1],
  ['How close should your chair be to the desk?', 'close enough that your elbows stay near your sides', ['far enough back that you have to stretch your arms out to reach the keys', 'turned away from the screen', 'tipped back like a bed'], 'Elbows near your sides means your arms rest instead of reaching.', 1],
  ['Ben types with his feet dangling and swinging. What is a simple fix?', 'put a box under his feet so they rest flat', ['sit on his knees instead', 'take his shoes off', 'move the screen lower'], 'A box works just like the floor. Feet that rest stop the wiggles.', 2],
  ['Mia looks DOWN at her laptop and her neck hurts. What should change?', 'raise the screen up toward her eyes', ['slide farther down in the chair', 'type faster to finish sooner', 'hold her chin in one hand'], 'The screen should come up to your eyes. Your neck should not go down to it.', 2],
  ['Which sounds like smart typing practice?', 'slow and correct, then speed later', ['race and never fix the mistakes', 'hold keys down so they repeat', 'poke every key with one finger as fast as you can'], 'Your fingers learn the right path first. Speed shows up on its own.', 2],
  ['After a long typing job your shoulders have crept up by your ears. Good move?', 'drop them and take a stretch break', ['squeeze them even tighter', 'keep going until every word is done', 'rest your chin on the desk'], 'Shoulders creep up when we concentrate. A stretch resets them.', 2],
  ['Why do we keep our wrists lifted instead of mashing them on the desk?', 'pressing them down can make your wrists ache', ['it makes the letters come out capital', 'the computer types faster when your wrists are up in the air', 'it saves the battery'], 'Your wrist has soft parts inside. Pressing hard on the edge squeezes them.', 3],
  ['Why does the screen belong at eye level?', 'so your neck stays straight instead of bending', ['so the colors on the screen come out brighter and easier to see', 'so the speakers get louder', 'so the words spell themselves'], 'A bent neck holds up a heavy head all day. That is what makes it sore.', 3],
  ['Ana types fast with many mistakes. Ben types slower with none. Who finishes a NEAT note sooner?', 'Ben, because fixing mistakes takes time too', ['Ana, because fast is always first', 'neither one can finish a note', 'whoever presses the keys hardest'], 'Every mistake costs you a backspace and a re-type. Careful is quick.', 3],
  ['Why take a break every so often instead of typing for hours?', 'muscles and eyes get tired holding one job too long', ['the keyboard runs out of letters', 'the computer needs a nap', 'the keyboard needs to cool down before it can make more letters'], 'Bodies are made to move. A short break sends the tired feeling away.', 3],
  ['Jae keeps his keyboard way off to his right, so he twists to reach it. Why is that a problem?', 'twisting one way all the time makes his back sore', ['the keys type backwards', 'the letters come out sideways', 'letters typed from the side of the keyboard come out in the wrong order'], 'Keep the keyboard straight in front of you so both arms work the same.', 3],
  ['Why is a chair with a back better than a stool for long typing?', 'the back holds your spine up so you stop slumping', ['a stool spins around, so your work gets finished much faster', 'stools make the keyboard beep', 'a chair back blocks the screen glare'], 'When your back gets tired it slumps. A chair back does that work for you.', 3],
  ['Why is it better to watch the SCREEN than to watch your fingers?', 'your eyes catch a mistake the second it appears', ['fingers are boring to look at', 'the keyboard does not like being watched', 'the screen stops working if nobody looks at it for a while'], 'Watching the screen also keeps your neck up instead of bent over.', 3],
  ['Your hands feel tight after a big typing job. Best thing to do?', 'shake them out and stretch your fingers', ['make tight fists and keep typing', 'press the keys harder to warm up', 'sit on your hands until they feel better'], 'Gentle stretching sends fresh blood to muscles that worked hard.', 3],
];

// ------------------------------------------------------------
// 2. SIGNING IN SAFELY
// ------------------------------------------------------------
const C4T2_LOGIN_BANK = [
  ['What is a USERNAME?', 'the name that shows who you are', ['a secret you never share', 'the brand of the computer', 'a kind of keyboard'], 'A username is like the name on your cubby. It just says which one is yours.', 1],
  ['What is a PASSWORD?', 'a secret that unlocks your account', ['a word you post for friends', 'the title of your game', 'the name of the app'], 'A password works like a house key. It opens the door, so it stays secret.', 1],
  ['Which one is supposed to stay SECRET?', 'your password', ['your username', 'your favorite color', 'the class pet name'], 'Usernames are meant to be seen. Passwords are meant to be hidden.', 1],
  ['Your best friend asks for your password. What do you say?', '"No thanks, passwords stay secret."', ['"Okay, but only you."', '"I will write it on your hand."', '"Trade me yours and we are even."'], 'Keeping a password private is not being mean. It is being safe.', 1],
  ['Which of these is the STRONGEST password?', 'BlueTiger42Jump', ['1234', 'password', 'aaaa'], 'Long and surprising beats short and common every single time.', 1],
  ['You finish your work on a shared school computer. What do you do?', 'log out', ['leave it open for the next kid', 'turn the brightness down', 'close the lid and walk away'], 'Logging out closes your door behind you so nobody wanders in.', 1],
  ['Where is a SAFE place to keep a password?', 'somewhere only your grown-up keeps it', ['taped to the front of the laptop', 'said out loud in class', 'typed into a game chat'], 'Grown-ups have safe spots for keys. Screens and chats are not safe spots.', 1],
  ['Someone you do not know asks for your sign-in. What now?', 'do not answer, and tell a trusted grown-up', ['send it so they stop asking', 'send only the first half', 'send it, but change one letter so it is still a little secret'], 'Real helpers never need your password. Grown-ups can spot a trick.', 1],
  ['Why is "cat" a weak password?', 'it is short and easy to guess', ['it is too long to type', 'the computer does not like animals', 'it is not a real word'], 'Short words get guessed quickly. Longer ones take much, much longer.', 2],
  ['A friend was watching the keys while you typed your password. What should you tell your grown-up?', 'ask them to help you change it', ['nothing, it is fine', 'ask them to punish your friend', 'that you will type slower next time'], 'Changing it is quick and easy, and then the secret is a secret again.', 2],
  ['On the library computer a box asks "Remember me?" What is the safe pick?', 'say no on a shared computer', ['say yes so it is faster next time', 'ask another kid what to pick', 'unplug the computer'], 'On a shared computer, "remember me" would leave your door unlocked.', 2],
  ['Which password would be hardest for someone to guess?', 'GreenSock9Moon', ['your first name', 'abcd', 'mypassword'], 'Names and letter patterns are the first things a guesser tries.', 2],
  ['Why log out on a computer that other people use?', 'the next person could open your account if you stay signed in', ['it makes the screen brighter', 'it charges the battery', 'staying signed in slowly uses up the room the computer has to save things'], 'Signing out is like locking up. It takes one second and saves big trouble.', 3],
  ['Why keep a password secret even from a good friend?', 'secrets spread, and then anyone could sign in as you', ['friends cannot read yet', 'the app charges extra money every time another person types the same password', 'friends always forget them anyway'], 'Your friend might tell one person, who tells another. Keep it with you.', 3],
  ['Why is a username okay to show, but a password is not?', 'a username only says who you are, a password opens the door', ['usernames are shorter', 'usernames are made of numbers', 'passwords are made of secret letters that keyboards cannot even type'], 'One is a name tag. The other is a key. Only the key stays hidden.', 3],
  ['A pop-up says "Your account is locked! Type your password here." Safest move?', 'do not type it, and show a trusted grown-up', ['type it quickly before it closes', 'type it quickly, then close the pop-up before anybody can read it', 'type your username instead'], 'Scary pop-ups are a common trick to grab passwords. Slow down and tell someone.', 3],
  ['Why should a password NOT be your name and birthday?', 'lots of people already know both of those', ['they are too hard to spell', 'numbers are not allowed in passwords', 'birthdays change every year'], 'A good password is something only you and your grown-up would ever think of.', 3],
  ['Why is using the SAME password for two accounts risky?', 'if someone learns one, they can open both', ['the computer gets confused', 'the apps stop working together', 'the two accounts start sending each other your private messages'], 'Different keys for different doors keeps one mistake from becoming two.', 3],
  ['You forgot your password. Best step?', 'ask a trusted grown-up to help reset it', ['keep guessing new words as fast as you can until one of them works', 'borrow a friend account', 'make a secret new account'], 'Resetting is normal and easy. Everyone forgets a password sometimes.', 3],
  ['Your grown-up made you a strong password you keep forgetting. Good plan?', 'practice typing it with them until it sticks', ['change it to 1111', 'write it on your backpack', 'tell the whole class so somebody can remind you when you forget'], 'Practice turns a hard password into an easy one without making it weak.', 3],
];

// ------------------------------------------------------------
// 3. KIND WORDS ONLINE
// ------------------------------------------------------------
const C4T2_KIND_BANK = [
  ['Who reads the message you type online?', 'a real person with real feelings', ['nobody at all', 'only the computer', 'a robot that throws it away'], 'There is always a person on the other end of the screen.', 1],
  ['Your friend posts a drawing. Which comment is kind?', '"I love the colors you picked!"', ['"boring"', '"my dog draws better"', '"why did you even post that"'], 'Naming something you liked tells your friend you really looked.', 1],
  ['Typing IN ALL CAPITAL LETTERS usually feels like...', 'shouting', ['whispering', 'singing', 'being extra polite'], 'Big letters look loud, so save them for cheering, not arguing.', 1],
  ['What is a good check before you press send?', 'would I say this to their face?', ['is this the fastest thing to type?', 'will this get the most likes?', 'does this use the biggest words?'], 'If you would not say it face to face, it does not belong in a message.', 1],
  ['A classmate shares good news online. Kind reply?', '"Congratulations! That is exciting."', ['"so what"', '"I did that better"', '"that is not even a big deal, my news was way better"'], 'Celebrating someone else costs you nothing and means a lot to them.', 1],
  ['You disagree with a classmate idea online. Kind way to say it?', '"I see it differently. Here is why."', ['"that is the silliest idea ever"', '"you are wrong, stop typing"', '"everyone knows you are never right about anything"'], 'You can disagree with an idea without saying anything about the person.', 1],
  ['You feel grumpy and want to fire off a message. What helps first?', 'wait, breathe, and read it again', ['send it twice so they see it', 'add lots of exclamation points', 'send it to everyone you know'], 'Grumpy words look different after one calm breath. Waiting is free.', 1],
  ['Your friend types that they are sad. Which words help?', '"That sounds hard. I am here."', ['"get over it"', '"that is not a big deal"', '"stop making a fuss about nothing"'], 'You do not have to fix it. Just letting them know you care is enough.', 1],
  ['Your friend cannot see your face when you type a joke. Why does that matter?', 'they cannot tell you are teasing, so it may sting', ['jokes are against the rules', 'the computer changes your words into different ones on the way', 'jokes take longer to type'], 'A smile does not travel through a screen. Words have to do all the work.', 2],
  ['You sent something mean and you feel bad. Good repair?', 'say sorry and mean it', ['pretend the cat typed it', 'send more mean words so it looks like a joke', 'stop talking to them forever'], 'A real apology is short, honest, and does not blame anyone else.', 2],
  ['Two friends argue online about the best game. Kind move?', '"You like yours, I like mine. Both are fun."', ['"your game is for babies"', '"prove it or be quiet"', '"I am telling everyone your game is the worst one made"'], 'Two people can like different things and both still be right.', 2],
  ['Someone spells a word wrong in their post. Kind choice?', 'let it go, the idea still counts', ['post "spelling fail" under it', 'copy it and share the mistake', 'type the word wrong back at them'], 'Nobody learns spelling from being embarrassed in front of people.', 2],
  ['Why can a typed message be harder to understand than a spoken one?', 'there is no voice or face to show what you meant', ['typing is a different language', 'screens hide half the letters', 'typed messages always arrive in a completely mixed-up order'], 'That is why we add kind words on purpose. They do the job a smile does.', 3],
  ['Does adding "just kidding" at the end fix a mean message?', 'no, the person still felt the sting', ['yes, it erases anything before it', 'yes, if you type it in capitals', 'yes, as long as you laugh too'], 'If the joke needs a label to be safe, it is worth picking a different joke.', 3],
  ['A message could be a friendly joke OR mean. Kind first step?', 'ask what they meant before you decide', ['assume the worst and reply mad', 'send the same words back', 'show it to everyone you know and let them vote on it'], 'Asking takes ten seconds and stops a lot of hurt feelings.', 3],
  ['Your online team just lost a game. What is good to type to the winners?', '"Good game!"', ['"you cheated"', '"this game is rigged"', '"rematch right now or you are scared of us"'], 'Two words make you the kind of player everyone wants on their team.', 3],
  ['Why think twice before posting a photo of someone else?', 'their feelings and their permission come first', ['photos use up too much space', 'photos take a long time to load', 'photos of other people always come out blurry when you post them'], 'Ask first. It is their face, so it is their choice.', 3],
  ['A friend disagrees with you and stays polite the whole time. Fair response?', 'listen, then answer politely too', ['get louder so you win', 'stop reading and post about them', 'agree out loud but complain to others'], 'Polite people are easy to talk to. Being one back keeps it that way.', 3],
  ['Which comment shows you actually READ your friend story?', '"The dragon ending surprised me!"', ['"nice"', '"first!"', '"ok"'], 'Naming a real part proves you cared enough to read the whole thing.', 3],
  ['Why say thank you when someone helps you online?', 'they spent their time, and thanks shows it mattered', ['it is a rule of the internet', 'it makes messages arrive faster', 'typing thank you earns you extra coins in most games and apps'], 'Helpers keep helping when they know it was worth it.', 3],
];

// ------------------------------------------------------------
// 4. WHEN SOMEONE IS UNKIND ONLINE
// ------------------------------------------------------------
const C4T2_UPSTANDER_BANK = [
  ['A player types something mean to you. Calm first move?', 'do not reply while you are angry', ['type something meaner back', 'call them names', 'get your friends to pile on'], 'Angry words make it bigger. Waiting keeps you in charge of you.', 1],
  ['What helps a grown-up help you with a mean message?', 'save it or take a picture of the screen', ['delete it right away', 'send it to the whole class', 'answer it with a joke that is even meaner than theirs'], 'Saving it means the grown-up can see exactly what happened.', 1],
  ['Who should you tell about mean messages?', 'a trusted grown-up like a parent or teacher', ['nobody at all', 'only the person who was mean', 'everybody in the group chat so they all take your side'], 'Grown-ups can do things you cannot, like talk to the school or the app.', 1],
  ['What does BLOCK do?', 'stops that person from messaging you', ['erases their computer', 'makes them say sorry', 'tells the whole school'], 'Block is like closing a door. It works right away, all by itself.', 1],
  ['What does REPORT do?', 'tells the people who run the app what happened', ['sends the police to their house', 'deletes your account', 'gives you free coins for every mean message you find'], 'Apps have real workers whose job is to stop mean behavior.', 1],
  ['A kid in your class is getting teased online. Good way to help?', 'message them: "That was not fair. I am your friend."', ['laugh so you fit in', 'share the mean post', 'say nothing at all and hope somebody else fixes it for them'], 'One kind message tells them they are not alone. That is huge.', 1],
  ['If someone is mean to you online, whose fault is it?', 'the person who chose to be mean', ['yours for being online', 'your parents', 'the computer'], 'You did not cause someone else choice. That choice was all theirs.', 1],
  ['Is telling a grown-up about mean messages the same as tattling?', 'no, it is asking for help with something that hurts', ['yes, always', 'yes, unless you cry first', 'yes, telling a grown-up anything about a friend is tattling'], 'Tattling is trying to get someone in trouble. This is getting yourself help.', 1],
  ['You are angry and your fingers want to type back. What can you do instead?', 'step away, breathe, then talk to a grown-up', ['type it and save it for later', 'hit the keyboard', 'send a mean picture instead of words'], 'Feelings pass. Sent messages do not. Let the feeling go first.', 2],
  ['A group chat starts making fun of one kid. What can an upstander do?', 'say "not cool" or leave and tell an adult', ['add one small joke so you fit in', 'screenshot it for laughs', 'stay and read it all quietly'], 'Even one voice saying "not cool" makes the pile-on stop growing.', 2],
  ['Someone made a mean joke about your drawing. Which reply keeps you calm and safe?', 'no reply, save it, show a grown-up', ['a meaner joke about their drawing', 'twenty angry messages', 'a message asking everyone to gang up on them'], 'No reply is a real choice, and it is often the strongest one.', 2],
  ['Your friend got mean messages and says "do not tell anyone." Caring thing to do?', 'say you care AND that a grown-up can help it stop', ['promise to keep it secret forever', 'post about it publicly', 'tell them to ignore it and it will probably stop on its own'], 'You can keep being a good friend and still get a grown-up involved.', 2],
  ['Why save a mean message instead of deleting it?', 'the grown-up can see exactly what was said', ['deleting breaks the app', 'saved messages slowly disappear from the app all by themselves', 'it earns points in the game'], 'Proof makes it much easier for grown-ups to fix the problem.', 3],
  ['Why is replying while angry a bad plan?', 'it grows the fight, and then you feel bad too', ['angry typing has more spelling mistakes', 'the app charges money for it', 'angry messages drain the battery much faster than kind ones'], 'You cannot un-send. Waiting five minutes protects future-you.', 3],
  ['Blocking does not fix everything. Why does it still help?', 'it stops the messages reaching you while grown-ups help', ['it deletes the mean words from the world', 'it makes the person apologize', 'it hides your account from everyone you know, forever and ever'], 'Block first for peace and quiet, then let a grown-up work on the rest.', 3],
  ['One kid is teased and everyone else stays silent. Why does one kind message matter so much?', 'it tells them they are not alone', ['it deletes the mean post', 'it makes the mean kid say sorry', 'it wins the argument'], 'Silence feels like everyone agrees. One kind voice breaks that feeling.', 3],
  ['Someone has been mean to the same kid over and over on purpose. What should happen?', 'a grown-up needs to know, because it keeps repeating', ['wait and see if it stops on its own', 'have the kid log off forever', 'get everyone in class to send mean messages right back to them'], 'Once might be a bad moment. Over and over needs grown-up help to stop.', 3],
  ['You told one grown-up and nothing has changed yet. What now?', 'tell another trusted grown-up and keep asking', ['give up and say nothing again', 'handle it yourself with mean messages', 'delete your account and hide it from everyone at your school'], 'Keep asking until someone helps. You deserve help, and it is out there.', 3],
  ['Why is laughing along with a mean post a problem?', 'it tells the mean person to keep going', ['laughing is against the app rules', 'it sends them your password', 'it makes your screen freeze'], 'Mean posts run on attention. Not feeding them helps them fizzle out.', 3],
  ['Someone asks you to send a mean message FOR them. What do you do?', 'say no, because sending it makes you part of it', ['send it, since you did not write it', 'send it but add a smiley', 'send it, then tell everyone it was their idea, not yours'], 'The person who presses send is part of the message. Choose not to be.', 3],
];

// ------------------------------------------------------------
// 5. SCREEN BREAKS AND BALANCE
// ------------------------------------------------------------
const C4T2_BALANCE_BANK = [
  ['Your eyes feel tired after a long time on the screen. What helps?', 'rest them by looking far away', ['lean your nose close to the screen', 'turn the brightness all the way up', 'squint until it feels better'], 'Eyes work hard staring at one close thing. Distance is their vacation.', 1],
  ['What is a great thing to do during a screen break?', 'stand up and move your body', ['start a game on a second screen', 'lie down and scroll', 'watch a video while you wait'], 'A break should give your eyes AND your body something different to do.', 1],
  ['Screens right before bed can make it harder to...', 'fall asleep', ['brush your teeth', 'eat breakfast', 'tie your shoes'], 'Bright screens and exciting games tell your brain it is still daytime.', 1],
  ['Which one is an offline activity?', 'riding your bike', ['watching cartoons', 'playing a tablet game', 'video chatting'], 'Offline means no screen at all. Bikes need only legs and helmets.', 1],
  ['How long should a screen break be?', 'a few real minutes of moving around', ['one quick blink', 'half a second', 'no time at all'], 'A blink is not a break. Give your body a few minutes to reset.', 1],
  ['Which afternoon sounds the most balanced?', 'a little tablet, a bike ride, and dinner with family', ['tablet the whole time', 'videos all through dinner', 'games from the second you get home until it is dark outside'], 'Balance means screens get a turn, and so does everything else.', 1],
  ['Your body feels stiff after sitting for a long game. What helps?', 'stand up and stretch', ['sit even more still', 'slouch down lower', 'pull your knees up onto the chair'], 'Muscles get stiff when they hold one shape. Stretching wakes them up.', 1],
  ['It is 30 minutes before bedtime. Best choice?', 'put the tablet away and read a book', ['one more level', 'videos in bed', 'play until you fall asleep'], 'A calm, dim activity helps your brain slide toward sleep.', 1],
  ['Your grown-up sets a timer for screen time. Why does that help?', 'stopping is fair and you can see it coming', ['timers make games easier', 'it charges the tablet faster', 'it unlocks new levels'], 'A timer does the deciding, so nobody has to argue about it.', 2],
  ['You promised to feed the dog but you are in the middle of a game. Balanced choice?', 'pause and feed the dog first', ['finish the whole game first', 'ask the dog to wait an hour', 'forget it and play on'], 'Real-life promises come first. The game will still be there after.', 2],
  ['Which plan spreads screen time better?', 'two short turns with a break between', ['three hours all at once', 'all of it right before bed', 'every minute of the whole weekend afternoon'], 'Shorter turns with breaks are easier on your eyes, body, and mood.', 2],
  ['You have been on the tablet since lunch and it is sunny out. Best next move?', 'go outside for a while', ['start one more game', 'move to the TV instead', 'close the curtains'], 'Sunlight and moving are exactly what a screen afternoon is missing.', 2],
  ['Why do screens near bedtime make sleep harder?', 'bright light and exciting games keep your brain awake', ['screens make the room cold', 'tablets are too heavy to hold', 'playing games at night uses up the dreams you were saving'], 'Your brain reads bright light as "still daytime" and stays switched on.', 3],
  ['Why is moving during a break better than switching to a different screen?', 'your eyes and body need a real rest, not more screen', ['second screens cost money', 'looking at two screens at once breaks the internet for everybody', 'moving makes games load faster'], 'Swapping screens keeps your eyes doing the same close-up job.', 3],
  ['Why does standing up during a break feel so good?', 'your muscles wake up when you move them', ['standing makes you taller forever', 'sitting is against the rules', 'the floor is warmer than the chair'], 'Movement sends fresh blood to muscles that were holding still.', 3],
  ['A friend says "screens are bad." What is a truer way to say it?', 'screens help in the right amount and hurt in too much', ['screens are bad for everybody, no matter how you use them', 'screens are always good, no matter what', 'screens only work on weekends'], 'It is not good or bad. It is how much, when, and what you do with it.', 3],
  ['You feel grumpy and headachy after a long screen day. What is your body telling you?', 'it needs a break, food, or fresh air', ['it needs a bigger screen', 'it needs a louder game', 'it needs to keep going a little longer'], 'Grumpy is real information. Listening to it makes the rest of the day better.', 3],
  ['Which ONE day shows the best balance?', 'homework, 30 minutes of games, soccer, then a book', ['games from morning until night with snacks in between', 'three movies in a row and nothing else', 'screens at breakfast, lunch, and dinner'], 'A balanced day has room for school, screens, moving, and quiet.', 3],
  ['Why keep the tablet out of your bedroom at night?', 'it cannot tempt you awake if it is not there', ['sleeping near a battery makes the tablet stop holding a charge', 'tablets make noise while charging', 'the internet stops at bedtime'], 'It is much easier to not start than to stop once you have started.', 3],
  ['You planned 20 minutes and the timer rings in the middle of a level. Balanced move?', 'save or stop, and come back next turn', ['play until the level ends, however long', 'restart the timer yourself', 'hide the timer next time'], 'Keeping your own promise makes it easier to get the next turn.', 3],
];

// ------------------------------------------------------------
// 6. SAVE IT, NAME IT, FIND IT
// ------------------------------------------------------------
const C4T2_FILES_BANK = [
  ['What does SAVE do?', 'keeps your work so you can open it later', ['prints it on paper', 'erases it', 'makes all the letters in your work bigger and easier to read'], 'Saving writes your work down inside the computer so it stays.', 1],
  ['When should you save your work?', 'before you close the program', ['after you close it', 'never', 'a week after you finish, whenever you happen to remember it'], 'Once it is closed, unsaved work is gone. Save first, close second.', 1],
  ['Which is the most helpful file name?', 'my_dinosaur_story', ['aaaa', 'Untitled 7', 'jjjjjj'], 'A good name tells you what is inside without opening it.', 1],
  ['Mia closed her drawing without saving. What most likely happened?', 'the drawing was gone when she looked for it', ['it printed by itself', 'it emailed her teacher', 'the computer saved it by itself and put it on her desktop'], 'The computer only keeps what you tell it to keep.', 1],
  ['Where does your work go when you save it?', 'into a file in the folder you picked', ['into the printer', 'into the screen glass', 'onto the internet where anybody in the world can open it'], 'Save asks WHERE for a reason. That is the spot you will look later.', 1],
  ['What is a FOLDER for?', 'holding files together in one place', ['making files bigger', 'printing files', 'making your files colorful so they look nicer on the screen'], 'Folders group your work, just like the drawers in your desk.', 1],
  ['How do you get your work back tomorrow?', 'open the saved file again', ['type the whole thing over', 'shake the mouse', 'wait for it to appear'], 'A saved file waits patiently for you until you open it.', 1],
  ['What should a good file name tell you?', 'what is inside it', ['how long you worked', 'the weather that day', 'your favorite color'], 'Names are little clues. Make them clues about the work.', 1],
  ['You wrote a report about volcanoes. Best name?', 'volcano_report', ['school', 'file1', 'zzz'], 'The name says the topic, so it is easy to spot in a long list.', 2],
  ['You saved a picture and now you cannot find it. What helps most?', 'look in the folder you chose when you saved', ['make a brand-new picture', 'restart the computer', 'ask a friend to guess where the computer might have put it'], 'The save box told you where it was going. That is where to look first.', 2],
  ['Two files: "Untitled" and "spelling_words_week3". Which is easier to find next month?', 'spelling_words_week3', ['Untitled', 'both are the same', 'neither can be found'], 'A name with real words is a map. "Untitled" is a blank sign.', 2],
  ['You are typing a long story. When should you save?', 'every few minutes while you work', ['only at the very end', 'only if the story turns out good', 'next week'], 'Saving takes one second and protects everything you have written so far.', 2],
  ['Why does a clear file name help, even if you remember today?', 'next month you will not remember, but the name will tell you', ['long names load faster', 'the computer sorts by color', 'a file with a clear name will print out in much bigger letters'], 'Write the name for future-you, who will have forgotten everything.', 3],
  ['Why save every few minutes instead of only at the end?', 'if the power blinks off you only lose a little', ['it makes the computer faster', 'it prints a backup copy', 'every time you save, the computer adds a fresh new page for you'], 'Frequent saving turns a disaster into a small shrug.', 3],
  ['Your teacher is hunting for Ava animal poem. Which name helps her fastest?', 'ava_animal_poem', ['poem', 'document', 'final FINAL new'], 'Who plus what equals a name anyone can find in seconds.', 3],
  ['Why put all your math work in ONE folder?', 'every math file stays together so any of them is easy to find', ['folders make files smaller', 'math files will not open alone', 'the computer will not let you open math files unless they sit together'], 'Sorting once saves you hunting many times later.', 3],
  ['You made a second version of your dragon poem. Smart name?', 'dragon_poem_2', ['poem', 'asdf', 'new new new'], 'Same name plus a number keeps versions together and in order.', 3],
  ['You saved your report only onto a USB stick and left it at school. Why is that a problem?', 'the file is on the stick, not on your home computer', ['USB sticks erase overnight', 'the file turns into a picture', 'home computers cannot read words that were typed at school'], 'A file lives where you saved it. If the stick is at school, so is your work.', 3],
  ['Why is "Untitled 3" a poor file name?', 'it says nothing about what is inside', ['it has a number in it', 'it is too long to type', 'computers cannot read capital letters'], 'Soon you will have Untitled 4, 5, and 6, and none of them will help.', 3],
  ['What is the best habit when work time ends?', 'save, then close', ['close, then save', 'close and hope for the best', 'pull the plug quickly'], 'Once it closes, the chance to save is gone. Save is always first.', 3],
];

// ------------------------------------------------------------
// SKILLS
// ------------------------------------------------------------
SKILLS.push(
  { id: 'comp_posture', strand: 'comp_basics', name: 'Sit tall, type happy',
    gen: (lvl = 2) => C4T2_ask(C4T2_POSTURE_BANK, lvl) },
  { id: 'comp_login', strand: 'comp_basics', name: 'Signing in safely',
    gen: (lvl = 2) => C4T2_ask(C4T2_LOGIN_BANK, lvl) },
  { id: 'comp_kindness', strand: 'comp_basics', name: 'Kind words online',
    gen: (lvl = 2) => C4T2_ask(C4T2_KIND_BANK, lvl) },
  { id: 'comp_upstander', strand: 'comp_basics', name: 'When someone is unkind online',
    gen: (lvl = 2) => C4T2_ask(C4T2_UPSTANDER_BANK, lvl) },
  { id: 'comp_balance', strand: 'comp_basics', name: 'Screen breaks and balance',
    gen: (lvl = 2) => C4T2_ask(C4T2_BALANCE_BANK, lvl) },
  { id: 'comp_files', strand: 'comp_basics', name: 'Save it, name it, find it',
    gen: (lvl = 2) => C4T2_ask(C4T2_FILES_BANK, lvl) },
);
