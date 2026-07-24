/* auto-generated concept-teach frames for the lesson engine (Phase 4).
   One entry per skill where is/isn't concept-attainment is the right teach.
   Consumed by js/lesson2.js via window.L2_FRAMES; absence is safe (typeof-guarded).

   Pure data. Loaded BEFORE js/lesson2.js. Every nonExample is a TRUE negative
   (an even-number non-example is genuinely odd; a compound-word non-example is
   genuinely NOT two real words) — a wrong non-example would mis-teach a child. */
window.L2_FRAMES = {
  'evenodd': {
    isLabel: 'EVEN',
    isntLabel: 'ODD',
    rule: 'Even numbers end in 0, 2, 4, 6, or 8 — they split into two equal teams with none left over.',
    examples: [
      { label:'8', why:'8 cookies make two equal plates of 4 with none left over, so 8 is even.', emoji:'🍪' },
      { label:'20', why:'20 ends in 0, and numbers ending in 0, 2, 4, 6, or 8 are even.', emoji:'🔟' },
      { label:'46', why:'Only the last digit matters — 6 is even, so 46 is even too.', emoji:'✌️' },
    ],
    nonExamples: [
      { label:'7', why:'7 socks can\'t make two equal teams — you\'d get 3 and 4 — so 7 is odd, not even.', emoji:'🧦' },
      { label:'35', why:'35 ends in 5, and 5 isn\'t 0, 2, 4, 6, or 8, so it\'s odd.', emoji:'5️⃣' },
    ],
  },
  'geo_equal': {
    isLabel: 'EQUAL SHARES',
    isntLabel: 'NOT EQUAL',
    rule: 'Equal shares means every part is exactly the same size — fair for everyone.',
    examples: [
      { label:'Pizza cut into 4 matching slices', why:'Every slice is the same size, so it\'s 4 equal shares — fourths.', emoji:'🍕' },
      { label:'Cracker snapped into 2 same-size halves', why:'Both halves match perfectly, so they are equal shares.', emoji:'🍫' },
      { label:'Sandwich cut into 3 equal strips', why:'All three strips are the same size — equal thirds.', emoji:'🥪' },
    ],
    nonExamples: [
      { label:'Cookie broken into a big piece and a tiny piece', why:'The two parts are different sizes, so they are NOT equal shares.', emoji:'🍪' },
      { label:'Pie with one giant slice and thin ones', why:'Same number of cuts, but the parts don\'t match — so it\'s not fair, not equal shares.', emoji:'🥧' },
    ],
  },
  'time_ampm': {
    isLabel: 'AM (MORNING)',
    isntLabel: 'PM (NIGHT)',
    rule: 'AM is the morning hours — from when you wake up until lunchtime; if it happens in the morning, it\'s AM.',
    examples: [
      { label:'Eating breakfast', why:'Breakfast happens in the morning, and morning hours are AM.', emoji:'🥣' },
      { label:'The sun rising', why:'Sunrise is early in the morning — that\'s AM.', emoji:'🌅' },
      { label:'Waking up for school', why:'You wake up in the morning, so it\'s AM.', emoji:'☀️' },
    ],
    nonExamples: [
      { label:'Eating dinner', why:'Dinner is in the evening, and evening is PM — the opposite of AM.', emoji:'🍝' },
      { label:'The moon out at bedtime', why:'Night-time is PM, so the moon at bedtime is not AM.', emoji:'🌙' },
    ],
  },
  'mult_even_addends': {
    isLabel: 'EVEN',
    isntLabel: 'ODD',
    rule: 'A number is even when you can split it into two equal teams — the same amount on each side with none left over.',
    examples: [
      { label:'10 = 5 + 5', why:'10 splits into two equal teams of 5, so 10 is even.', emoji:'✋' },
      { label:'8 → 4 and 4', why:'Both plates get exactly 4, so 8 is even.', emoji:'🍪' },
      { label:'12 = 6 + 6', why:'6 on each side with none left over means 12 is even.', emoji:'⚽' },
    ],
    nonExamples: [
      { label:'7 → 3 and 4', why:'The teams come out 3 and 4 — not equal — so 7 is odd, not even.', emoji:'🧦' },
      { label:'9 → 4 and 5', why:'You can\'t make two matching teams from 9, so 9 is odd.', emoji:'🎈' },
    ],
  },
  'pv_compare_true': {
    isLabel: 'TRUE',
    isntLabel: 'FALSE',
    rule: 'The open mouth of &gt; or &lt; always eats the BIGGER number — a sentence is true only when the sign points the right way.',
    examples: [
      { label:'83 > 80', why:'83 is bigger, and the open mouth points at 83 — true!', emoji:'🐊' },
      { label:'45 < 54', why:'45 is smaller, so the pointy tip aims at it while the mouth eats 54 — true.', emoji:'🐊' },
      { label:'26 = 26', why:'Both numbers are exactly the same, so the equal sign fits — true.', emoji:'🟰' },
    ],
    nonExamples: [
      { label:'9 > 15', why:'9 is smaller than 15, so the mouth is eating the wrong number — false.', emoji:'🐊' },
      { label:'70 < 40', why:'70 is actually bigger than 40, so \'less than\' is wrong — false.', emoji:'🐊' },
    ],
  },
  'noun_id': {
    isLabel: 'A NOUN',
    isntLabel: 'NOT A NOUN',
    rule: 'A noun names a person, place, or thing you can point to.',
    examples: [
      { label:'dog', why:'A dog is a thing you can see and point to, so it\'s a noun.', emoji:'🐶' },
      { label:'park', why:'A park is a place, and places are nouns.', emoji:'🏞️' },
      { label:'teacher', why:'A teacher is a person, and people are nouns.', emoji:'👩‍🏫' },
    ],
    nonExamples: [
      { label:'run', why:'\'Run\' is something you DO, not a thing — that makes it a verb, not a noun.', emoji:'🏃' },
      { label:'happy', why:'\'Happy\' tells how you feel; it doesn\'t name a thing, so it\'s not a noun.', emoji:'😊' },
    ],
  },
  'verb_id': {
    isLabel: 'A VERB',
    isntLabel: 'NOT A VERB',
    rule: 'A verb is an action word — something you can DO.',
    examples: [
      { label:'jump', why:'You can jump, so \'jump\' is an action word — a verb.', emoji:'🦘' },
      { label:'eat', why:'Eating is something you do, so \'eat\' is a verb.', emoji:'🍎' },
      { label:'sing', why:'Singing is an action, so \'sing\' is a verb.', emoji:'🎤' },
    ],
    nonExamples: [
      { label:'dog', why:'A dog is a thing you can point to, not an action — that\'s a noun.', emoji:'🐶' },
      { label:'blue', why:'\'Blue\' describes a color; it isn\'t something you do, so it\'s not a verb.', emoji:'🔵' },
    ],
  },
  'adj_id': {
    isLabel: 'DESCRIBING WORD',
    isntLabel: 'NOT DESCRIBING',
    rule: 'An adjective describes — it tells what something is LIKE.',
    examples: [
      { label:'tall', why:'\'Tall\' tells you what something is like, so it\'s a describing word.', emoji:'📏' },
      { label:'red', why:'\'Red\' describes a color, so it\'s an adjective.', emoji:'🔴' },
      { label:'soft', why:'\'Soft\' tells how something feels, so it\'s a describing word.', emoji:'🧸' },
    ],
    nonExamples: [
      { label:'run', why:'\'Run\' is something you do — an action word, not a describing word.', emoji:'🏃' },
      { label:'cat', why:'\'Cat\' names an animal; it doesn\'t describe one, so it\'s a noun.', emoji:'🐱' },
    ],
  },
  'capitalization': {
    isLabel: 'CAPITAL LETTER',
    isntLabel: 'LOWERCASE',
    rule: 'Capital letters go on names, days, the word I, and the first word of a sentence.',
    examples: [
      { label:'Emma', why:'Emma is a person\'s name, and names always start with a capital.', emoji:'🙋' },
      { label:'Monday', why:'Monday is a day of the week, so it gets a capital letter.', emoji:'📅' },
      { label:'I', why:'The word \'I\' is always a capital, even in the middle of a sentence.', emoji:'😀' },
    ],
    nonExamples: [
      { label:'ball', why:'\'Ball\' is a regular naming word in the middle of a sentence, so it stays lowercase.', emoji:'🏀' },
      { label:'happy', why:'\'Happy\' isn\'t a name or a sentence start, so it doesn\'t need a capital.', emoji:'😊' },
    ],
  },
  'ela_collective': {
    isLabel: 'GROUP WORD',
    isntLabel: 'NOT A GROUP',
    rule: 'A collective noun is ONE word that names a whole group.',
    examples: [
      { label:'team', why:'\'Team\' is one word that names a whole group of players.', emoji:'⚽' },
      { label:'flock', why:'\'Flock\' names a group of birds all together.', emoji:'🐦' },
      { label:'bunch', why:'\'Bunch\' is one word for a group of bananas.', emoji:'🍌' },
    ],
    nonExamples: [
      { label:'cats', why:'\'Cats\' is many cats, but that\'s just a plural — you only added -s, it\'s not a group word.', emoji:'🐱' },
      { label:'dog', why:'\'Dog\' names just one animal, so it can\'t be a group word.', emoji:'🐶' },
    ],
  },
  'ela_reflexive': {
    isLabel: '-SELF WORD',
    isntLabel: 'NOT -SELF',
    rule: 'Reflexive pronouns end in -self or -selves and point back to the same person.',
    examples: [
      { label:'myself', why:'\'Myself\' ends in -self and points back to me.', emoji:'🙋' },
      { label:'yourself', why:'\'Yourself\' turns the action back on you.', emoji:'👉' },
      { label:'themselves', why:'\'Themselves\' points back to more than one person, so it ends in -selves.', emoji:'👥' },
    ],
    nonExamples: [
      { label:'me', why:'\'Me\' has no -self ending, so it\'s not a reflexive pronoun.', emoji:'🙂' },
      { label:'my', why:'\'My\' shows something belongs to you; it\'s not a -self word.', emoji:'🎒' },
    ],
  },
  'ela_adverb': {
    isLabel: 'AN ADVERB',
    isntLabel: 'NOT AN ADVERB',
    rule: 'An adverb tells HOW something is done — many end in -ly.',
    examples: [
      { label:'quickly', why:'\'Quickly\' tells how you run, so it\'s an adverb.', emoji:'🏃' },
      { label:'quietly', why:'\'Quietly\' tells how you talk — that\'s an adverb.', emoji:'🤫' },
      { label:'slowly', why:'\'Slowly\' tells how something moves, so it\'s an adverb.', emoji:'🐢' },
    ],
    nonExamples: [
      { label:'quick', why:'\'Quick\' describes a thing (a quick bunny), so it\'s an adjective, not an adverb.', emoji:'🐇' },
      { label:'happy', why:'\'Happy\' tells what someone is like, not how they do something.', emoji:'😊' },
    ],
  },
  'vowel_sound': {
    isLabel: 'SHORT VOWEL',
    isntLabel: 'LONG VOWEL',
    rule: 'A short vowel says its quick sound; a long vowel says its own name.',
    examples: [
      { label:'cat', why:'The a in \'cat\' says its short sound, \'aaa\'.', emoji:'🐱' },
      { label:'bed', why:'The e in \'bed\' says the short sound, \'eh\'.', emoji:'🛏️' },
      { label:'pig', why:'The i in \'pig\' says the short sound, \'ih\'.', emoji:'🐷' },
    ],
    nonExamples: [
      { label:'cake', why:'The a in \'cake\' says its NAME, \'ay\' — that\'s a long vowel, not short.', emoji:'🎂' },
      { label:'feet', why:'The e\'s in \'feet\' say the name \'eee\' — that\'s a long vowel sound.', emoji:'🦶' },
    ],
  },
  'odd_one_out': {
    isLabel: 'BELONGS',
    isntLabel: 'ODD ONE OUT',
    rule: 'Find the one that\'s a DIFFERENT kind — that\'s the odd one out.',
    examples: [
      { label:'apple', why:'An apple is a fruit, so it belongs with the other fruits.', emoji:'🍎' },
      { label:'banana', why:'A banana is a fruit too, so it fits the group.', emoji:'🍌' },
      { label:'grape', why:'A grape is also a fruit, so it stays in the group.', emoji:'🍇' },
    ],
    nonExamples: [
      { label:'sock', why:'A sock is something you wear, not a fruit — so it\'s the odd one out.', emoji:'🧦' },
      { label:'car', why:'A car isn\'t a fruit, so it doesn\'t belong with apple, banana, and grape.', emoji:'🚗' },
    ],
  },
  'synonyms': {
    isLabel: 'SAME MEANING',
    isntLabel: 'NOT THE SAME',
    rule: 'Synonyms are two words that mean the SAME thing.',
    examples: [
      { label:'big / large', why:'\'Big\' and \'large\' mean the same, so they\'re synonyms.', emoji:'🐘' },
      { label:'happy / glad', why:'\'Happy\' and \'glad\' both mean feeling good — same meaning.', emoji:'😊' },
      { label:'tiny / small', why:'\'Tiny\' and \'small\' mean the same little size.', emoji:'🐜' },
    ],
    nonExamples: [
      { label:'big / small', why:'\'Big\' and \'small\' are OPPOSITES, not the same — those are antonyms.', emoji:'↔️' },
      { label:'cat / dog', why:'They\'re both animals, but they don\'t MEAN the same thing.', emoji:'🐾' },
    ],
  },
  'antonyms': {
    isLabel: 'OPPOSITES',
    isntLabel: 'NOT OPPOSITE',
    rule: 'Antonyms are two words that mean the OPPOSITE.',
    examples: [
      { label:'hot / cold', why:'\'Hot\' and \'cold\' are opposites, so they\'re antonyms.', emoji:'🌡️' },
      { label:'up / down', why:'\'Up\' and \'down\' point opposite ways.', emoji:'⬆️' },
      { label:'big / small', why:'\'Big\' and \'small\' are opposite sizes.', emoji:'🐘' },
    ],
    nonExamples: [
      { label:'big / large', why:'\'Big\' and \'large\' mean the SAME, not the opposite — those are synonyms.', emoji:'🐘' },
      { label:'cat / kitten', why:'A kitten is a baby cat — they\'re related, not opposites.', emoji:'🐱' },
    ],
  },
  'homophones': {
    isLabel: 'SOUND ALIKE',
    isntLabel: 'SOUND DIFFERENT',
    rule: 'Homophones sound EXACTLY the same but are spelled differently.',
    examples: [
      { label:'to / two', why:'\'To\' and \'two\' sound the same but are spelled differently.', emoji:'2️⃣' },
      { label:'sun / son', why:'\'Sun\' and \'son\' sound just alike but mean different things.', emoji:'☀️' },
      { label:'hear / here', why:'\'Hear\' and \'here\' sound the same when you say them.', emoji:'👂' },
    ],
    nonExamples: [
      { label:'big / large', why:'They mean the same, but they don\'t SOUND the same — not homophones.', emoji:'🐘' },
      { label:'cat / hat', why:'These rhyme, but the whole word doesn\'t sound the same — the start is different.', emoji:'🎩' },
    ],
  },
  'rhyme': {
    isLabel: 'RHYMES',
    isntLabel: 'DOESN\'T RHYME',
    rule: 'Rhyming words END with the same sound.',
    examples: [
      { label:'cat / hat', why:'\'Cat\' and \'hat\' both end in -at, so they rhyme.', emoji:'🎩' },
      { label:'star / car', why:'\'Star\' and \'car\' end with the same -ar sound.', emoji:'⭐' },
      { label:'bug / rug', why:'\'Bug\' and \'rug\' end in -ug, so they rhyme.', emoji:'🐛' },
    ],
    nonExamples: [
      { label:'sun / sit', why:'They both START with the \'s\' sound, but rhyme is about the END — these don\'t match.', emoji:'☀️' },
      { label:'cat / dog', why:'\'Cat\' and \'dog\' have different ending sounds, so they don\'t rhyme.', emoji:'🐶' },
    ],
  },
  'digraph': {
    isLabel: 'ONE SOUND',
    isntLabel: 'TWO SOUNDS',
    rule: 'A digraph is two letters that team up to make ONE sound.',
    examples: [
      { label:'sh', why:'\'sh\' in ship is two letters that make one new sound, \'shh\'.', emoji:'🤫' },
      { label:'ch', why:'\'ch\' in chip makes one sound, \'ch\'.', emoji:'🚂' },
      { label:'th', why:'\'th\' in this makes one soft sound, \'th\'.', emoji:'👍' },
    ],
    nonExamples: [
      { label:'bl', why:'In \'blue\' you still hear b AND l — two sounds — so that\'s a blend, not a digraph.', emoji:'🔵' },
      { label:'st', why:'In \'stop\' you hear s AND t both, so it\'s a blend, not one new sound.', emoji:'⭐' },
    ],
  },
  'silent_e': {
    isLabel: 'SILENT E',
    isntLabel: 'NO SILENT E',
    rule: 'A silent e at the end makes the vowel say its NAME.',
    examples: [
      { label:'cake', why:'The e is silent, and it makes the a say its name, \'ay\'.', emoji:'🎂' },
      { label:'bike', why:'The silent e makes the i say its name, \'eye\'.', emoji:'🚲' },
      { label:'home', why:'The e is silent and makes the o say its name, \'oh\'.', emoji:'🏠' },
    ],
    nonExamples: [
      { label:'cat', why:'There\'s no silent e, so the a stays short: \'aaa\'.', emoji:'🐱' },
      { label:'sun', why:'No e on the end, so the u makes its short sound, \'uh\'.', emoji:'☀️' },
    ],
  },
  'ela_past_tense': {
    isLabel: 'PAST TENSE',
    isntLabel: 'NOT PAST',
    rule: 'Past tense means it ALREADY happened — many verbs add -ed.',
    examples: [
      { label:'jumped', why:'\'Jumped\' already happened — the -ed shows it\'s finished.', emoji:'🦘' },
      { label:'played', why:'\'Played\' happened before now, so it\'s past tense.', emoji:'🎲' },
      { label:'ran', why:'\'Run\' becomes \'ran\' in the past — it already happened, even without -ed.', emoji:'🏃' },
    ],
    nonExamples: [
      { label:'jump', why:'\'Jump\' is happening now, not already finished — that\'s present, not past.', emoji:'🦘' },
      { label:'eat', why:'\'Eat\' is what you do now; it hasn\'t happened yet, so it\'s not past tense.', emoji:'🍎' },
    ],
  },
  'sp_num_q': {
    isLabel: 'UN NÚMERO',
    isntLabel: 'NOT A NUMBER',
    rule: 'Pip\'s test: could you count it on your fingers? If yes, it\'s un número.',
    examples: [
      { label:'uno', why:'One! Hold up 1 finger. It tells how many, so it\'s a number.', emoji:'1️⃣' },
      { label:'dos', why:'Two, like 2 shoes. It counts how many — a número.', emoji:'👟' },
      { label:'cinco', why:'Five — a whole hand of fingers! Another counting number.', emoji:'🖐️' },
    ],
    nonExamples: [
      { label:'rojo', why:'This means red. Red is a color you SEE, not a number you count.', emoji:'🔴' },
      { label:'perro', why:'This means dog. A dog is an animal — you can\'t count \'to perro\'.', emoji:'🐶' },
    ],
  },
  'sp_color_q': {
    isLabel: 'UN COLOR',
    isntLabel: 'NOT A COLOR',
    rule: 'Pip\'s test: could you fill in a picture with it? If yes, it\'s un color.',
    examples: [
      { label:'rojo', why:'Red, like a fire truck or a strawberry. You can color with it!', emoji:'🔴' },
      { label:'azul', why:'Blue, like the sky. It names a color you can see — un color.', emoji:'🔵' },
      { label:'verde', why:'Green, like grass. Another crayon-box color.', emoji:'🟢' },
    ],
    nonExamples: [
      { label:'uno', why:'This means one. It\'s a number you count with, not a color.', emoji:'1️⃣' },
      { label:'gato', why:'This means cat. A cat is an animal, not a color you\'d color with.', emoji:'🐱' },
    ],
  },
  'sp_days_q': {
    isLabel: 'UN DÍA',
    isntLabel: 'NOT A DAY',
    rule: 'Pip\'s test: is it one of the 7 days on a week calendar? If yes, it\'s un día.',
    examples: [
      { label:'lunes', why:'Monday — back to school after the weekend. A day of the week.', emoji:'🏫' },
      { label:'viernes', why:'Friday — the last school day before the weekend. Still un día.', emoji:'🎉' },
      { label:'sábado', why:'Saturday — a no-school play day. One of the 7 days.', emoji:'⚽' },
    ],
    nonExamples: [
      { label:'enero', why:'This means January. January is a MONTH, not a day of the week.', emoji:'🗓️' },
      { label:'verano', why:'This means summer. Summer is a season, not a day.', emoji:'☀️' },
    ],
  },
  'sp_months_q': {
    isLabel: 'UN MES',
    isntLabel: 'NOT A MONTH',
    rule: 'Pip\'s test: is it one of the 12 months on a year calendar? If yes, it\'s un mes.',
    examples: [
      { label:'enero', why:'January — the first month, when the new year starts. Un mes.', emoji:'🗓️' },
      { label:'julio', why:'July — a warm summer month. One of the 12 months.', emoji:'☀️' },
      { label:'diciembre', why:'December — the last month of the year. Un mes.', emoji:'🎄' },
    ],
    nonExamples: [
      { label:'lunes', why:'This means Monday. Monday is a DAY of the week, not a whole month.', emoji:'📅' },
      { label:'invierno', why:'This means winter. Winter is a season made of many months, not one month.', emoji:'❄️' },
    ],
  },
  'sp_seasons_q': {
    isLabel: 'UNA ESTACIÓN',
    isntLabel: 'NOT A SEASON',
    rule: 'Pip\'s test: is it one of the 4 times of year — spring, summer, fall, winter? If yes, it\'s una estación.',
    examples: [
      { label:'primavera', why:'Spring — when flowers grow and birds hatch. One of the 4 seasons.', emoji:'🌷' },
      { label:'verano', why:'Summer — hot and sunny, time to swim. Una estación.', emoji:'🌞' },
      { label:'invierno', why:'Winter — cold and snowy. One of the 4 seasons.', emoji:'❄️' },
    ],
    nonExamples: [
      { label:'enero', why:'This means January. That\'s one month INSIDE winter, not a whole season.', emoji:'🗓️' },
      { label:'hace frío', why:'This means \'it\'s cold.\' That tells today\'s weather, not the name of a season.', emoji:'🥶' },
    ],
  },
  'sp_shapes_q': {
    isLabel: 'UNA FORMA',
    isntLabel: 'NOT A SHAPE',
    rule: 'Pip\'s test: could you trace its outline in the air? If yes, it\'s una forma.',
    examples: [
      { label:'círculo', why:'A circle — round like a ball, no corners. A shape you can draw.', emoji:'⭕' },
      { label:'cuadrado', why:'A square — 4 equal sides. Una forma.', emoji:'🟦' },
      { label:'triángulo', why:'A triangle — 3 sides and 3 corners. Another shape.', emoji:'🔺' },
    ],
    nonExamples: [
      { label:'rojo', why:'This means red. Red is a color you fill a shape WITH, not a shape itself.', emoji:'🔴' },
      { label:'tres', why:'This means three. Three is a number (how many), not a shape you can draw.', emoji:'3️⃣' },
    ],
  },
  'living': {
    isLabel: 'LIVING',
    isntLabel: 'NOT LIVING',
    rule: 'If it grows, needs food and water, AND can make babies, it\'s LIVING.',
    examples: [
      { label:'a puppy', why:'It eats, grows bigger, and can have baby puppies — that\'s living!', emoji:'🐶' },
      { label:'an oak tree', why:'It started as a tiny acorn, drinks water, and grows tall — trees are living.', emoji:'🌳' },
      { label:'a mushroom', why:'It can\'t run or move, but it grows and makes more mushrooms — still living!', emoji:'🍄' },
    ],
    nonExamples: [
      { label:'a toy car', why:'It rolls fast, but it never eats, grows, or has baby cars. Moving isn\'t the same as living!', emoji:'🚗' },
      { label:'a cloud', why:'A cloud drifts and changes shape, but it doesn\'t eat or grow — just moving doesn\'t make it alive.', emoji:'☁️' },
    ],
  },
  'slg': {
    isLabel: 'A SOLID',
    isntLabel: 'NOT A SOLID',
    rule: 'A SOLID keeps its own shape — pour it or tip it, it stays the same.',
    examples: [
      { label:'a rock', why:'Put it in any bowl and it stays rock-shaped — solids keep their shape.', emoji:'🪨' },
      { label:'an ice cube', why:'It\'s a hard cube no matter which cup you drop it in — that\'s a solid.', emoji:'🧊' },
      { label:'a wooden block', why:'It never changes shape on its own, so it\'s a solid.', emoji:'🧱' },
    ],
    nonExamples: [
      { label:'milk', why:'Pour milk and it flows to fit the cup — it takes the container\'s shape, so it\'s a liquid, not a solid.', emoji:'🥛' },
      { label:'steam', why:'Steam spreads out to fill the whole room — a gas has no shape of its own, so it isn\'t a solid.', emoji:'♨️' },
    ],
  },
  'push_pull': {
    isLabel: 'PUSH',
    isntLabel: 'PULL',
    rule: 'A PUSH moves something AWAY from you. (A pull brings it TOWARD you.)',
    examples: [
      { label:'kicking a ball', why:'Your foot sends the ball away from you — that\'s a push!', emoji:'⚽' },
      { label:'closing a door', why:'You press the door away to shut it — a push.', emoji:'🚪' },
      { label:'pushing a swing', why:'You send the swing away from your hands, so it\'s a push.', emoji:'🛝' },
    ],
    nonExamples: [
      { label:'opening a drawer', why:'You bring the drawer TOWARD you — that\'s a pull, the opposite of a push.', emoji:'🗄️' },
      { label:'tug-of-war', why:'Everyone pulls the rope toward their own side — pulling, not pushing.', emoji:'🪢' },
    ],
  },
  'magnets': {
    isLabel: 'MAGNETIC',
    isntLabel: 'NOT MAGNETIC',
    rule: 'A magnet only grabs things made of IRON or STEEL — not every metal!',
    examples: [
      { label:'a steel paperclip', why:'It\'s made of steel, so the magnet snaps right onto it.', emoji:'📎' },
      { label:'an iron nail', why:'Iron is exactly what magnets grab — it sticks!', emoji:'🔩' },
      { label:'steel scissors', why:'The steel blades are magnetic, so the magnet pulls them.', emoji:'✂️' },
    ],
    nonExamples: [
      { label:'a shiny soda can', why:'It\'s metal AND shiny, but it\'s aluminum — no iron or steel — so the magnet ignores it. Not all metal is magnetic!', emoji:'🥤' },
      { label:'a plastic toy', why:'There\'s no iron or steel in it at all, so a magnet can\'t grab plastic.', emoji:'🪀' },
    ],
  },
  'animal_groups': {
    isLabel: 'A MAMMAL',
    isntLabel: 'NOT A MAMMAL',
    rule: 'A MAMMAL has fur or hair and drinks milk from its mom as a baby.',
    examples: [
      { label:'a dog', why:'Furry, and it drank milk as a puppy — a mammal!', emoji:'🐶' },
      { label:'a whale', why:'It lives in the ocean, but it breathes air and feeds its babies milk — a mammal, not a fish!', emoji:'🐋' },
      { label:'a bat', why:'It flies, but it has fur and drinks milk — a flying mammal, not a bird!', emoji:'🦇' },
    ],
    nonExamples: [
      { label:'a shark', why:'It lives in water like a whale, but it has no fur and breathes with gills — it\'s a fish, not a mammal.', emoji:'🦈' },
      { label:'an eagle', why:'It flies like a bat, but it has feathers and lays eggs — that makes it a bird, not a mammal.', emoji:'🦅' },
    ],
  },
  'food_chain': {
    isLabel: 'A PRODUCER',
    isntLabel: 'A CONSUMER',
    rule: 'A PRODUCER makes its own food from sunlight (a plant). Anything that has to EAT is a consumer.',
    examples: [
      { label:'grass', why:'Grass is a plant — it makes its own food from sunlight, so it\'s a producer.', emoji:'🌾' },
      { label:'an apple tree', why:'Trees are plants that make food from sunlight — a producer.', emoji:'🍎' },
      { label:'seaweed', why:'Even in the ocean, seaweed is a plant making food from sunlight — a producer.', emoji:'🌿' },
    ],
    nonExamples: [
      { label:'a rabbit', why:'A rabbit can\'t make its own food — it has to eat plants, so it\'s a consumer, not a producer.', emoji:'🐰' },
      { label:'a hawk', why:'A hawk eats other animals to get its food, so it\'s a consumer, not a producer.', emoji:'🦅' },
    ],
  },
  'earth_changes': {
    isLabel: 'FAST CHANGE',
    isntLabel: 'SLOW CHANGE',
    rule: 'A FAST change happens in seconds or hours — you could watch it happen. Slow changes take many years.',
    examples: [
      { label:'an earthquake', why:'The ground shakes and cracks in seconds — that\'s a fast change.', emoji:'🌍' },
      { label:'a volcano erupting', why:'Lava covers the land in just hours — fast!', emoji:'🌋' },
      { label:'a landslide', why:'Rocks tumble down the hill in a few seconds — a fast change.', emoji:'⛰️' },
    ],
    nonExamples: [
      { label:'a river carving a canyon', why:'The water wears the rock away grain by grain — it takes thousands of years, so it\'s slow, not fast.', emoji:'🏞️' },
      { label:'waves wearing away a beach', why:'The waves carry off just a little sand each day — a slow change, not a fast one.', emoji:'🌊' },
    ],
  },
  'sci_classify_props': {
    isLabel: 'A PROPERTY',
    isntLabel: 'AN OPINION',
    rule: 'A property is something you can SEE, FEEL, or TEST — not an opinion or a feeling.',
    examples: [
      { label:'rough', why:'You can feel the bumps with your fingers — that\'s something you observe.', emoji:'🪵' },
      { label:'see-through', why:'You can look and watch light pass through it — you observe it with your eyes.', emoji:'🪟' },
      { label:'it floats', why:'You can test it by dropping it in water and watching — that\'s observing.', emoji:'🛟' },
    ],
    nonExamples: [
      { label:'pretty', why:'One person says pretty, another says not — you can\'t measure it, so it\'s an opinion, not a property.', emoji:'🌈' },
      { label:'my favorite', why:'That tells about YOU, not about the object — you can\'t see or feel \'favorite,\' so it isn\'t a property.', emoji:'❤️' },
    ],
  },
  'sci_plants_need': {
    isLabel: 'A PLANT NEED',
    isntLabel: 'NOT A NEED',
    rule: 'A plant needs sunlight, water, and air to make its own food — that\'s all!',
    examples: [
      { label:'sunlight', why:'Leaves use sunlight to make food for the whole plant.', emoji:'☀️' },
      { label:'water', why:'The roots drink water up from the soil — a plant needs it to stay green.', emoji:'💧' },
      { label:'air', why:'Leaves take in air to help make the plant\'s food.', emoji:'🌬️' },
    ],
    nonExamples: [
      { label:'a bedtime story', why:'A plant can\'t hear! It makes food from sunlight, not from words — so a story isn\'t something it needs.', emoji:'📖' },
      { label:'candy', why:'Plants don\'t eat treats like we do — they make their own food from sunlight and water, so candy isn\'t on the list.', emoji:'🍬' },
    ],
  },
  'soc_needs': {
    isLabel: 'A NEED',
    isntLabel: 'A WANT',
    rule: 'Pip\'s test: could you stay alive and safe without it? If not, it\'s a need — if it\'s just nice to have, it\'s a want.',
    examples: [
      { label:'Clean water', why:'Your body can\'t live without water, so it\'s a real need.', emoji:'💧' },
      { label:'A home to live in', why:'You need shelter to stay warm, dry, and safe every night.', emoji:'🏠' },
      { label:'Healthy food', why:'You need food to grow and have energy — you can\'t skip it.', emoji:'🍎' },
    ],
    nonExamples: [
      { label:'A new video game', why:'It\'s fun, but you\'d still be safe and healthy without it — that makes it a want.', emoji:'🎮' },
      { label:'Candy', why:'A sweet treat is nice, but your body doesn\'t need candy to live — it\'s a want.', emoji:'🍬' },
    ],
  },
  'soc_goods': {
    isLabel: 'A GOOD',
    isntLabel: 'A SERVICE',
    rule: 'Pip\'s test: can you pick it up and take it home? Then it\'s a good — if someone does a job for you, that\'s a service.',
    examples: [
      { label:'An apple', why:'You can hold it and take it home — a good is a thing you can keep.', emoji:'🍎' },
      { label:'A book', why:'It\'s an object you can keep on your shelf, so it\'s a good.', emoji:'📚' },
      { label:'A toy truck', why:'You can pick it up and play with it, which makes it a good.', emoji:'🚚' },
    ],
    nonExamples: [
      { label:'A haircut', why:'You can\'t hold a haircut — it\'s a job the barber does for you, so it\'s a service.', emoji:'✂️' },
      { label:'A bus ride', why:'Nobody hands you a \'ride\' to keep; the driver does the work — that\'s a service.', emoji:'🚌' },
    ],
  },
  'soc_pastpresent': {
    isLabel: 'LONG AGO',
    isntLabel: 'TODAY',
    rule: 'Pip\'s test: could people do this before cars and electricity? If yes, it\'s from long ago — not today.',
    examples: [
      { label:'A horse and buggy', why:'Long ago there were no cars, so people rode in buggies pulled by horses.', emoji:'🐴' },
      { label:'Washing clothes by hand', why:'Before washing machines, people scrubbed clothes in a tub by hand.', emoji:'🧺' },
      { label:'Writing with a feather pen', why:'Long ago there were no pens like ours — people dipped a feather in ink.', emoji:'🪶' },
    ],
    nonExamples: [
      { label:'A cell phone', why:'Phones you carry are new — people long ago had no way to text or call like this, so it\'s from today.', emoji:'📱' },
      { label:'A car', why:'Cars run on engines invented much later, so a car is from today, not long ago.', emoji:'🚗' },
    ],
  },
  'soc_globe_map': {
    isLabel: 'A GLOBE',
    isntLabel: 'A MAP',
    rule: 'Pip\'s test: is it round like a ball showing the whole Earth? That\'s a globe — a flat one showing just a piece is a map.',
    examples: [
      { label:'A round model of Earth', why:'It\'s shaped like a ball, just like our real round planet — that\'s a globe.', emoji:'🌍' },
      { label:'A globe you spin on a stand', why:'You can turn it to see every part of the whole, round Earth.', emoji:'🌐' },
    ],
    nonExamples: [
      { label:'A flat road map you unfold', why:'It lies flat on a table and shows just one area, so it\'s a map, not a round globe.', emoji:'🗺️' },
      { label:'A map on a phone screen', why:'A screen is flat and shows only a piece of Earth, so it\'s a map, not a globe.', emoji:'📱' },
    ],
  },
  'soc_community_types': {
    isLabel: 'A CITY',
    isntLabel: 'NOT A CITY',
    rule: 'Pip\'s test: lots of people packed close with tall buildings and busy streets? That\'s a city — not the country or a suburb.',
    examples: [
      { label:'Tall apartment buildings close together', why:'In a city, many people live close together in tall buildings.', emoji:'🏙️' },
      { label:'Busy streets with buses and crowds', why:'Cities are crowded and busy, with lots to do close by.', emoji:'🚌' },
    ],
    nonExamples: [
      { label:'A quiet farm with wide open fields', why:'Few people and lots of open land make this the country, not a city.', emoji:'🚜' },
      { label:'A street of houses with big yards near the city', why:'This is a suburb — calmer, with room between homes, not a packed city.', emoji:'🏡' },
    ],
  },
  'soc_citizen': {
    isLabel: 'GOOD CITIZEN',
    isntLabel: 'NOT GOOD CITIZEN',
    rule: 'Pip\'s test: does it make your community kinder, safer, or fairer? Then it\'s being a good citizen.',
    examples: [
      { label:'Picking up litter in the park', why:'Cleaning up helps everyone enjoy a nicer park — that\'s a good citizen.', emoji:'🌳' },
      { label:'Taking turns and sharing', why:'Being fair to others helps your whole community get along.', emoji:'🤝' },
      { label:'Helping a neighbor carry groceries', why:'A good citizen looks out for the people around them.', emoji:'🛒' },
    ],
    nonExamples: [
      { label:'Throwing trash on the sidewalk', why:'Littering makes the community dirty for everyone, so it\'s not being a good citizen.', emoji:'🗑️' },
      { label:'Cutting in line ahead of others', why:'Skipping the line isn\'t fair to the people waiting, so it\'s not good citizenship.', emoji:'🚫' },
    ],
  },
  'soc_rules': {
    isLabel: 'A RULE',
    isntLabel: 'A CHOICE',
    rule: 'Pip\'s test: does EVERYONE have to follow it to stay safe and fair? Then it\'s a rule — if it\'s just what you like, it\'s a choice.',
    examples: [
      { label:'Wear a seatbelt in the car', why:'Everyone must buckle up to stay safe, so it\'s a rule.', emoji:'🚗' },
      { label:'Raise your hand to speak in class', why:'This keeps class fair so everyone gets a turn — a rule for all.', emoji:'✋' },
      { label:'Wait your turn on the slide', why:'Taking turns keeps everyone safe and fair, so it\'s a rule.', emoji:'🛝' },
    ],
    nonExamples: [
      { label:'"I like the blue crayon best"', why:'That\'s just what you like — nobody else has to do it, so it\'s a choice, not a rule.', emoji:'🖍️' },
      { label:'"I want pizza for lunch"', why:'Wanting pizza is your own choice, not something everyone must follow, so it\'s not a rule.', emoji:'🍕' },
    ],
  },
  'soc_landforms': {
    isLabel: 'A LANDFORM',
    isntLabel: 'HUMAN-MADE',
    rule: 'Pip\'s test: did nature make this shape, or did people build it? If nature made it, it\'s a landform.',
    examples: [
      { label:'A mountain', why:'The Earth pushed up this giant rocky shape all on its own — a landform.', emoji:'⛰️' },
      { label:'A valley', why:'The low land between hills was carved by nature, so it\'s a landform.', emoji:'🏞️' },
      { label:'An island', why:'Land with water all around it, made by the Earth, is still a landform.', emoji:'🏝️' },
    ],
    nonExamples: [
      { label:'A tall skyscraper', why:'People built this out of steel and glass, so it\'s a building, not a landform.', emoji:'🏢' },
      { label:'A swimming pool', why:'People dug and filled this, so it\'s human-made, not a shape the Earth made.', emoji:'🏊' },
    ],
  },
  'soc_resources': {
    isLabel: 'NATURAL RESOURCE',
    isntLabel: 'MAN-MADE',
    rule: 'Pip\'s test: did it come straight from nature, or did people make it? If it comes from nature, it\'s a natural resource.',
    examples: [
      { label:'Water', why:'Water comes from rivers and rain in nature — a natural resource we use every day.', emoji:'💧' },
      { label:'Trees', why:'Trees grow in nature and give us wood and paper, so they\'re a natural resource.', emoji:'🌲' },
      { label:'Soil', why:'The dirt that plants grow in comes right from the Earth — a natural resource.', emoji:'🟫' },
    ],
    nonExamples: [
      { label:'A crayon', why:'People make crayons in a factory, so a crayon is man-made, not a natural resource.', emoji:'🖍️' },
      { label:'A toy car', why:'This is built by people from many parts — it doesn\'t come straight from nature.', emoji:'🚗' },
    ],
  },
};
