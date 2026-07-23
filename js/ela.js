/* ============================================================
   MATH GARDEN → LEARNING GARDEN — Language Arts (2nd grade)
   Phonics, spelling, grammar, vocabulary, reading.
   Modeled on IXL grade-2 ELA categories.
   ============================================================ */

STRANDS.push(
  { id: 'phonics', subject: 'ela', name: 'Phonics & Sounds', emoji: '🔤', color: 'var(--coral)',
    lesson: `<p><b>Sounds are the building blocks of reading!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Rhymes</b> end with the same sound: c<b>at</b> 🐱 / h<b>at</b> 🎩</li>
        <li><b>Syllables</b> are word beats — clap them! <i>ap-ple</i> = 2 claps 👏👏</li>
        <li><b>Short vowels</b> say their sound: <i>a</i> in c<b>a</b>t. <b>Long vowels</b> say their NAME: <i>a</i> in c<b>a</b>ke.</li>
        <li>A <b>silent e</b> at the end is magic — it makes the vowel say its name: kit → kit<b>e</b> 🪁</li>
        <li><b>Letter teams</b> make one sound: <i>sh</i> 🤫, <i>ch</i> 🚂, <i>th</i>, <i>wh</i>, <i>ph</i></li>
      </ul>` },
  { id: 'spell', subject: 'ela', name: 'Spelling', emoji: '✏️', color: 'var(--sun)',
    lesson: `<p><b>Spelling tricks that do the heavy lifting:</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>More than one?</b> Usually add <b>-s</b> (dogs). After s, x, ch, sh add <b>-es</b> (boxes). If it ends in y, change to <b>-ies</b> (baby → babies).</li>
        <li>Some words break the rules: man → <b>men</b>, child → <b>children</b>, foot → <b>feet</b>, mouse → <b>mice</b>!</li>
        <li>A <b>contraction</b> squeezes two words together — the apostrophe (') holds the spot of missing letters: do not → do<b>n't</b></li>
        <li>A <b>compound word</b> is two little words holding hands: rain + bow = rainbow 🌈</li>
      </ul>` },
  { id: 'grammar', subject: 'ela', name: 'Grammar', emoji: '🧩', color: 'var(--sky)',
    lesson: `<p><b>Every word has a job:</b></p>
      <table class="cheat-table">
        <tr><th>Job</th><th>What it is</th><th>Examples</th></tr>
        <tr><td><b>Noun</b></td><td>person, place, or thing</td><td>dog, park, teacher</td></tr>
        <tr><td><b>Verb</b></td><td>action word</td><td>run, jump, sleep</td></tr>
        <tr><td><b>Adjective</b></td><td>describing word</td><td>fluffy, red, tiny</td></tr>
      </table>
      <p style="margin-top:10px;font-weight:700">Sentences have jobs too: a <b>statement</b> tells (.) — a <b>question</b> asks (?) — an <b>exclamation</b> shouts (!) — a <b>command</b> tells you to do something (.)</p>
      <p style="font-weight:700">Sentences always start with a CAPITAL letter, and names of people, pets, and places get capitals too!</p>` },
  { id: 'vocab', subject: 'ela', name: 'Vocabulary', emoji: '💬', color: 'var(--leaf)',
    lesson: `<p><b>Word power-ups:</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Synonyms</b> = same-ish meaning (big / large). <b>Antonyms</b> = opposites (hot / cold).</li>
        <li><b>Homophones</b> sound alike but are spelled differently: <i>hear</i> with your ear 👂, <i>here</i> is a place 📍.</li>
        <li>Word parts change meaning: <b>re-</b> = again (reread), <b>un-</b> = not (unhappy), <b>-ful</b> = full of (careful), <b>-less</b> = without (fearless).</li>
        <li><b>ABC order</b>: compare the FIRST letters; if they match, look at the second letters!</li>
      </ul>` },
  { id: 'reading', subject: 'ela', name: 'Reading', emoji: '📖', color: 'var(--berry)',
    lesson: `<p><b>Be a reading detective 🔎:</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Main idea</b> = what the story is MOSTLY about (the big umbrella ☂️ — details hide under it).</li>
        <li><b>Details</b> answer who, what, where, when.</li>
        <li><b>Sequence</b> = the order things happen: first, next, then, last.</li>
        <li><b>Cause and effect</b>: the cause is WHY it happened, the effect is WHAT happened.</li>
        <li>Read the question FIRST, then hunt for the answer in the story!</li>
      </ul>` },
);

// ------------------------------------------------------------
// BANKS
// ------------------------------------------------------------

const RHYME_FAMILIES = [
  ['-at', ['cat', 'hat', 'bat', 'mat', 'rat', 'sat']],
  ['-an', ['can', 'fan', 'man', 'pan', 'van', 'plan']],
  ['-ig', ['pig', 'dig', 'wig', 'big', 'fig', 'twig']],
  ['-op', ['hop', 'top', 'mop', 'pop', 'stop', 'drop']],
  ['-ug', ['bug', 'rug', 'hug', 'mug', 'jug', 'plug']],
  ['-ake', ['cake', 'lake', 'rake', 'snake', 'bake', 'shake']],
  ['-ight', ['light', 'night', 'right', 'bright', 'kite'.replace('kite','sight'), 'flight']],
  ['-ain', ['rain', 'train', 'brain', 'chain', 'plain', 'main']],
  ['-ell', ['bell', 'shell', 'well', 'smell', 'tell', 'spell']],
  ['-ing', ['king', 'ring', 'sing', 'wing', 'spring', 'swing']],
];

const SYLLABLE_BANK = [
  ['dog', 1], ['tree', 1], ['fish', 1], ['school', 1], ['plant', 1], ['moon', 1],
  ['apple', 2], ['tiger', 2], ['pencil', 2], ['rabbit', 2], ['window', 2], ['sister', 2], ['garden', 2], ['cookie', 2],
  ['banana', 3], ['elephant', 3], ['butterfly', 3], ['dinosaur', 3], ['tomato', 3], ['grandmother', 3], ['hamburger', 3],
  ['watermelon', 4], ['alligator', 4], ['caterpillar', 4], ['helicopter', 4],
];

const VOWEL_BANK = [
  // [word, vowel letter, 'short'|'long', emoji]
  ['cat', 'a', 'short', '🐱'], ['cake', 'a', 'long', '🎂'], ['map', 'a', 'short', '🗺️'], ['rain', 'a', 'long', '🌧️'],
  ['bed', 'e', 'short', '🛏️'], ['feet', 'e', 'long', '🦶'], ['net', 'e', 'short', '🥅'], ['tree', 'e', 'long', '🌳'],
  ['pig', 'i', 'short', '🐷'], ['kite', 'i', 'long', '🪁'], ['fish', 'i', 'short', '🐟'], ['bike', 'i', 'long', '🚲'],
  ['sock', 'o', 'short', '🧦'], ['boat', 'o', 'long', '⛵'], ['frog', 'o', 'short', '🐸'], ['rose', 'o', 'long', '🌹'],
  ['sun', 'u', 'short', '☀️'], ['cube', 'u', 'long', '🧊'], ['bug', 'u', 'short', '🐛'], ['flute', 'u', 'long', '🪈'],
];

const DIGRAPH_BANK = [
  ['sh', 'ark', 'shark', '🦈'], ['sh', 'eep', 'sheep', '🐑'], ['sh', 'oe', 'shoe', '👟'],
  ['ch', 'air', 'chair', '🪑'], ['ch', 'eese', 'cheese', '🧀'], ['ch', 'erry', 'cherry', '🍒'],
  ['th', 'umb', 'thumb', '👍'], ['th', 'ree', 'three', '3️⃣'],
  ['wh', 'ale', 'whale', '🐋'], ['wh', 'eel', 'wheel', '🛞'],
  ['ph', 'one', 'phone', '📱'],
];

const SILENT_E_BANK = [
  ['kit', 'kite', 'a toy that flies in the sky', '🪁'],
  ['cap', 'cape', 'a superhero wears one', '🦸'],
  ['hop', 'hope', 'to wish for something good', '🌟'],
  ['tub', 'tube', 'a long round pipe', '🧪'],
  ['can', 'cane', 'a candy stick at holiday time', '🍬'],
  ['pin', 'pine', 'a tree with needles', '🌲'],
  ['rob', 'robe', 'you wear it after a bath', '🛁'],
  ['cub', 'cube', 'a shape like an ice block', '🧊'],
  ['plan', 'plane', 'it flies people far away', '✈️'],
  ['not', 'note', 'a little written message', '📝'],
];

const SPELL_BANK = [
  ['because', 'becuz', 'becaus'], ['friend', 'frend', 'freind'], ['said', 'sed', 'saide'],
  ['little', 'littel', 'litle'], ['people', 'peple', 'peopel'], ['before', 'befor', 'befour'],
  ['house', 'hous', 'howse'], ['every', 'evry', 'evere'], ['again', 'agen', 'agian'],
  ['always', 'allways', 'alwais'], ['animal', 'aminal', 'animle'], ['school', 'skool', 'schol'],
  ['favorite', 'favrite', 'favorit'], ['thought', 'thot', 'thaught'], ['different', 'diffrent', 'diferent'],
];

const PLURAL_BANK = [
  ['dog', 'dogs', 'Just add -s!'], ['cat', 'cats', 'Just add -s!'], ['tree', 'trees', 'Just add -s!'],
  ['box', 'boxes', 'Words ending in x add -es.'], ['bus', 'buses', 'Words ending in s add -es.'],
  ['brush', 'brushes', 'Words ending in sh add -es.'], ['bench', 'benches', 'Words ending in ch add -es.'],
  ['fox', 'foxes', 'Words ending in x add -es.'], ['dish', 'dishes', 'Words ending in sh add -es.'],
  ['baby', 'babies', 'Change the y to i and add -es.'], ['puppy', 'puppies', 'Change the y to i and add -es.'],
  ['city', 'cities', 'Change the y to i and add -es.'], ['story', 'stories', 'Change the y to i and add -es.'],
  ['man', 'men', 'Tricky word — it changes completely!'], ['child', 'children', 'Tricky word — it changes completely!'],
  ['foot', 'feet', 'Tricky word — it changes completely!'], ['tooth', 'teeth', 'Tricky word — it changes completely!'],
  ['mouse', 'mice', 'Tricky word — it changes completely!'],
];

const CONTRACTION_BANK = [
  ['do not', "don't"], ['can not', "can't"], ['is not', "isn't"], ['I am', "I'm"],
  ['we will', "we'll"], ['they are', "they're"], ['was not', "wasn't"], ['she is', "she's"],
  ['did not', "didn't"], ['you are', "you're"], ['it is', "it's"], ['are not', "aren't"],
];

const COMPOUND_BANK = [
  ['rain', 'bow', 'rainbow', '🌈'], ['sun', 'flower', 'sunflower', '🌻'], ['cup', 'cake', 'cupcake', '🧁'],
  ['foot', 'ball', 'football', '🏈'], ['butter', 'fly', 'butterfly', '🦋'], ['star', 'fish', 'starfish', '⭐🐟'],
  ['snow', 'man', 'snowman', '⛄'], ['tooth', 'brush', 'toothbrush', '🪥'], ['pan', 'cake', 'pancake', '🥞'],
  ['bed', 'room', 'bedroom', '🛏️'], ['fire', 'fly', 'firefly', '✨'], ['pop', 'corn', 'popcorn', '🍿'],
];

// tagged sentences: [sentence with words, {word: role}]
const GRAMMAR_SENTENCES = [
  ['The fluffy cat sleeps on the warm bed.', { cat: 'noun', bed: 'noun', sleeps: 'verb', fluffy: 'adj', warm: 'adj' }],
  ['A little bird sings in the tall tree.', { bird: 'noun', tree: 'noun', sings: 'verb', little: 'adj', tall: 'adj' }],
  ['My brave sister jumps over the big puddle.', { sister: 'noun', puddle: 'noun', jumps: 'verb', brave: 'adj', big: 'adj' }],
  ['The hungry puppy eats the crunchy treat.', { puppy: 'noun', treat: 'noun', eats: 'verb', hungry: 'adj', crunchy: 'adj' }],
  ['A shiny fish swims in the cold river.', { fish: 'noun', river: 'noun', swims: 'verb', shiny: 'adj', cold: 'adj' }],
  ['The happy teacher reads a funny story.', { teacher: 'noun', story: 'noun', reads: 'verb', happy: 'adj', funny: 'adj' }],
  ['A busy bee lands on the pretty flower.', { bee: 'noun', flower: 'noun', lands: 'verb', busy: 'adj', pretty: 'adj' }],
  ['The old truck rumbles down the bumpy road.', { truck: 'noun', road: 'noun', rumbles: 'verb', old: 'adj', bumpy: 'adj' }],
  ['My silly brother throws the round ball.', { brother: 'noun', ball: 'noun', throws: 'verb', silly: 'adj', round: 'adj' }],
  ['The tiny ant carries a giant crumb.', { ant: 'noun', crumb: 'noun', carries: 'verb', tiny: 'adj', giant: 'adj' }],
];

const SENTENCE_TYPES = [
  ['We went to the park after lunch.', 'statement'],
  ['My favorite color is green.', 'statement'],
  ['The library closes at five.', 'statement'],
  ['Do you like pizza?', 'question'],
  ['Where did you put your shoes?', 'question'],
  ['Can we go swimming today?', 'question'],
  ['Wow, that roller coaster was amazing!', 'exclamation'],
  ['Watch out for that bee!', 'exclamation'],
  ['I can\'t believe we won!', 'exclamation'],
  ['Please close the door.', 'command'],
  ['Wash your hands before dinner.', 'command'],
  ['Put your toys away.', 'command'],
];

const CAPITALIZATION_BANK = [
  ['My dog Rex loves to play fetch.', ['my dog Rex loves to play fetch.', 'My dog rex loves to play fetch.'], 'Sentences start with a capital, and names like <b>Rex</b> get capitals too.'],
  ['We visited Texas in July.', ['we visited Texas in July.', 'We visited texas in july.'], 'Place names like <b>Texas</b> and months like <b>July</b> get capital letters.'],
  ['On Monday, Sara starts soccer.', ['on monday, Sara starts soccer.', 'On Monday, sara starts Soccer.'], 'Days like <b>Monday</b> and names like <b>Sara</b> get capitals — but soccer does not.'],
  ['My friend Leo lives on Oak Street.', ['my friend leo lives on Oak Street.', 'My friend Leo lives on oak street.'], 'Names like <b>Leo</b> and street names like <b>Oak Street</b> get capitals.'],
  ['Thanksgiving is in November.', ['thanksgiving is in November.', 'Thanksgiving is in november.'], 'Holidays like <b>Thanksgiving</b> and months like <b>November</b> get capitals.'],
  ['Aunt Mia took us to Lake Erie.', ['aunt mia took us to Lake Erie.', 'Aunt Mia took us to lake erie.'], 'Names like <b>Aunt Mia</b> and places like <b>Lake Erie</b> get capitals.'],
];

const PUNCT_BANK = [
  ['What time is it', '?'], ['I have two brothers', '.'], ['That firework is so loud', '!'],
  ['Where is my backpack', '?'], ['The cake is in the oven', '.'], ['We won the game', '!'],
  ['Can you help me', '?'], ['My bike is blue', '.'], ['Look out below', '!'],
  ['How old is your sister', '?'], ['It rained all day', '.'], ['I love this song', '!'],
];

const SYNONYM_BANK = [
  ['big', 'large', ['tiny', 'green']], ['small', 'little', ['huge', 'loud']], ['happy', 'glad', ['sad', 'wet']],
  ['fast', 'quick', ['slow', 'tall']], ['mad', 'angry', ['calm', 'blue']], ['begin', 'start', ['finish', 'sleep']],
  ['shut', 'close', ['open', 'sing']], ['loud', 'noisy', ['quiet', 'soft']], ['smart', 'clever', ['silly', 'cold']],
  ['afraid', 'scared', ['brave', 'hungry']], ['tired', 'sleepy', ['awake', 'shiny']], ['funny', 'silly', ['serious', 'tall']],
  ['cold', 'chilly', ['hot', 'dry']], ['yell', 'shout', ['whisper', 'walk']], ['pretty', 'beautiful', ['ugly', 'fast']],
];

const ANTONYM_BANK = [
  ['hot', 'cold', ['warm', 'red']], ['up', 'down', ['high', 'over']], ['big', 'small', ['huge', 'wide']],
  ['day', 'night', ['morning', 'noon']], ['happy', 'sad', ['glad', 'joyful']], ['open', 'closed', ['wide', 'ajar']],
  ['fast', 'slow', ['quick', 'speedy']], ['hard', 'soft', ['solid', 'rocky']], ['empty', 'full', ['hollow', 'open']],
  ['light', 'dark', ['bright', 'sunny']], ['wet', 'dry', ['soggy', 'damp']], ['loud', 'quiet', ['noisy', 'booming']],
  ['first', 'last', ['early', 'beginning']], ['over', 'under', ['above', 'across']], ['push', 'pull', ['shove', 'press']],
];

const HOMOPHONE_BANK = [
  ['I can ___ the birds singing outside.', 'hear', 'here', 'You <b>hear</b> with your <b>ear</b> — the word "ear" hides inside!'],
  ['Come over ___ and sit with me.', 'here', 'hear', '<b>Here</b> is a place, like "there."'],
  ['We saw a big ship on the ___.', 'sea', 'see', 'The <b>sea</b> is the ocean. You <b>see</b> with your eyes.'],
  ['I want ___ cookies, please.', 'two', 'too', '<b>Two</b> is the number 2.'],
  ['Can I come ___?', 'too', 'two', '<b>Too</b> means "also."'],
  ['Do you ___ the answer?', 'know', 'no', '<b>Know</b> means to have it in your brain. <b>No</b> is the opposite of yes.'],
  ['I ___ my name at the top of the page.', 'write', 'right', 'You <b>write</b> with a pencil. <b>Right</b> is the opposite of wrong.'],
  ['The dog wagged its ___.', 'tail', 'tale', 'A <b>tail</b> is on an animal. A <b>tale</b> is a story.'],
  ['We ___ pancakes for breakfast.', 'ate', 'eight', 'You <b>ate</b> food. <b>Eight</b> is the number 8.'],
  ['My mom baked bread with ___.', 'flour', 'flower', '<b>Flour</b> is for baking. A <b>flower</b> grows in the garden.'],
  ['The ___ shined all afternoon.', 'sun', 'son', 'The <b>sun</b> is in the sky. A <b>son</b> is a boy child.'],
  ['Our team ___ the game!', 'won', 'one', '<b>Won</b> means victory. <b>One</b> is the number 1.'],
];

const AFFIX_BANK = [
  ['reread', 'read again', ['read before', 'not read', 'read badly'], 're- means "again"'],
  ['redo', 'do again', ['do first', 'not do', 'do wrong'], 're- means "again"'],
  ['unhappy', 'not happy', ['very happy', 'happy again', 'happy before'], 'un- means "not"'],
  ['unlock', 'the opposite of lock', ['lock again', 'lock tightly', 'lock before'], 'un- means "not / opposite of"'],
  ['preheat', 'heat before', ['heat again', 'not heat', 'heat too much'], 'pre- means "before"'],
  ['misplace', 'place in the wrong spot', ['place again', 'place before', 'place carefully'], 'mis- means "wrongly"'],
  ['careful', 'full of care', ['without care', 'care again', 'not caring'], '-ful means "full of"'],
  ['hopeful', 'full of hope', ['without hope', 'hope again', 'hope before'], '-ful means "full of"'],
  ['fearless', 'without fear', ['full of fear', 'fear again', 'a little afraid'], '-less means "without"'],
  ['homeless', 'without a home', ['full of homes', 'a big home', 'home again'], '-less means "without"'],
];

const ODD_ONE_BANK = [
  [['apple', 'banana', 'grapes', 'chair'], 'chair', 'The others are all fruits 🍎'],
  [['dog', 'cat', 'horse', 'spoon'], 'spoon', 'The others are all animals 🐴'],
  [['red', 'blue', 'green', 'seven'], 'seven', 'The others are all colors 🎨'],
  [['car', 'bus', 'train', 'sandwich'], 'sandwich', 'The others are all ways to travel 🚗'],
  [['happy', 'sad', 'angry', 'table'], 'table', 'The others are all feelings 😊'],
  [['rain', 'snow', 'wind', 'pencil'], 'pencil', 'The others are all kinds of weather 🌧️'],
  [['circle', 'square', 'triangle', 'puppy'], 'puppy', 'The others are all shapes 🔷'],
  [['shirt', 'pants', 'socks', 'banana'], 'banana', 'The others are all clothes 👕'],
  [['milk', 'juice', 'water', 'rock'], 'rock', 'The others are all drinks 🥛'],
  [['bed', 'couch', 'chair', 'cloud'], 'cloud', 'The others are all furniture 🛋️'],
];

const ABC_WORDS = ['ant', 'bear', 'cat', 'dog', 'egg', 'fish', 'goat', 'hat', 'ice', 'jam', 'kite', 'lion', 'moon', 'nest', 'owl', 'pig', 'queen', 'rain', 'sun', 'tree', 'up', 'van', 'wolf', 'yarn', 'zoo'];

const PASSAGES = [
  {
    title: 'The Lost Mitten', text: `Ben lost his red mitten at the park. He looked under the slide. He looked behind the swings. Then his dog Daisy started digging in the snow. Daisy found the mitten! Ben gave her a big hug.`,
    qs: [
      { q: 'What is this story mostly about?', a: 'Ben looking for his lost mitten', d: ['A dog learning to dig', 'How to build a snowman', 'Ben\'s favorite park'], why: 'The whole story is about the search for the mitten — that\'s the main idea.' },
      { q: 'Who found the mitten?', a: 'Daisy the dog', d: ['Ben', 'Ben\'s mom', 'A friend'], why: 'The story says Daisy started digging and found the mitten.' },
      { q: 'Where did Ben look FIRST?', a: 'under the slide', d: ['behind the swings', 'in the snow', 'in his pocket'], why: 'The story says he looked under the slide first, then behind the swings.' },
    ],
  },
  {
    title: 'Pancake Morning', text: `On Saturday, Maya helped Dad make pancakes. First, they mixed the batter. Next, Dad poured it on the hot pan. Then Maya watched for bubbles. When the bubbles popped, Dad flipped the pancake. Last, they ate breakfast together with syrup.`,
    qs: [
      { q: 'What did they do FIRST?', a: 'mixed the batter', d: ['poured the batter', 'flipped the pancake', 'ate breakfast'], why: 'The clue word "First" tells you — they mixed the batter.' },
      { q: 'How did Dad know it was time to flip?', a: 'the bubbles popped', d: ['the timer beeped', 'Maya said so', 'the pan got cold'], why: 'When the bubbles popped, Dad flipped the pancake — that\'s the cause!' },
      { q: 'What is this story mostly about?', a: 'making pancakes with Dad', d: ['buying syrup', 'a busy Saturday store', 'how bubbles form'], why: 'Every sentence is about making pancakes together.' },
    ],
  },
  {
    title: 'Busy Bats', text: `Bats are not birds. They are the only mammals that can fly. Bats sleep during the day and hunt at night. They eat many mosquitoes. One little brown bat can eat 1,000 bugs in one hour! Bats help people by eating insect pests.`,
    qs: [
      { q: 'What is this passage mostly about?', a: 'facts about bats', d: ['how birds fly', 'why mosquitoes bite', 'sleeping at night'], why: 'Every sentence teaches something about bats.' },
      { q: 'When do bats hunt?', a: 'at night', d: ['in the morning', 'at lunchtime', 'during the day'], why: 'The passage says bats sleep during the day and hunt at night.' },
      { q: 'How do bats HELP people?', a: 'they eat insect pests', d: ['they sing songs', 'they build nests', 'they scare birds'], why: 'The last sentence says bats help people by eating insect pests.' },
    ],
  },
  {
    title: 'The Seed Surprise', text: `Lily planted a tiny seed in a cup of dirt. She put the cup on a sunny windowsill and watered it every day. For a week, nothing happened. Lily almost gave up. Then one morning, a small green sprout poked out of the dirt. "It just needed time!" said Lily.`,
    qs: [
      { q: 'Why did the sprout finally grow?', a: 'it had sun, water, and time', d: ['Lily sang to it', 'the cup was red', 'it was windy'], why: 'Lily gave it sunlight and water every day — it just needed time.' },
      { q: 'How did Lily feel before the sprout appeared?', a: 'like giving up', d: ['very sleepy', 'angry at the cup', 'scared of dirt'], why: 'The story says "Lily almost gave up" — she was losing hope.' },
      { q: 'Where did Lily put the cup?', a: 'on a sunny windowsill', d: ['under her bed', 'in the fridge', 'on the porch'], why: 'The story says she put it on a sunny windowsill.' },
    ],
  },
  {
    title: 'Octopus: Ocean Genius', text: `An octopus has eight arms and three hearts. It can change color to hide from danger. When an octopus is scared, it shoots dark ink and swims away fast. Octopuses are very smart. Some can even open jars to get food inside!`,
    qs: [
      { q: 'What does an octopus do when it is scared?', a: 'shoots ink and swims away', d: ['changes into a fish', 'hides in a jar', 'calls its friends'], why: 'The passage says a scared octopus shoots dark ink and swims away.' },
      { q: 'How many hearts does an octopus have?', a: 'three', d: ['one', 'two', 'eight'], why: 'The first sentence says eight arms and THREE hearts.' },
      { q: 'Which word best describes an octopus?', a: 'smart', d: ['lazy', 'loud', 'furry'], why: 'The passage says octopuses are very smart — some open jars!' },
    ],
  },
  {
    title: 'Snow Day', text: `The snow fell all night long. In the morning, school was closed! Jake and his sister Emma put on their warmest coats. They built a snow fort with high walls. Then they drank hot cocoa with tiny marshmallows. It was the best day of winter.`,
    qs: [
      { q: 'Why was school closed?', a: 'it snowed all night', d: ['it was too hot', 'the bus broke', 'it was summer'], why: 'The snow fell all night — that\'s the cause; closed school is the effect.' },
      { q: 'What did Jake and Emma build?', a: 'a snow fort', d: ['a treehouse', 'a sandcastle', 'a birdhouse'], why: 'The story says they built a snow fort with high walls.' },
      { q: 'What happened LAST in the story?', a: 'they drank hot cocoa', d: ['snow fell all night', 'they put on coats', 'they built the fort'], why: '"Then they drank hot cocoa" comes at the end, before the closing sentence.' },
    ],
  },
  {
    title: 'The Wiggly Tooth', text: `Rosa's front tooth was wiggly for two weeks. She wiggled it at breakfast. She wiggled it at recess. At dinner, she bit into a crunchy apple. Pop! Out came the tooth. Rosa put it under her pillow that night and smiled her new smile.`,
    qs: [
      { q: 'What made the tooth come out?', a: 'biting a crunchy apple', d: ['wiggling at recess', 'sleeping on it', 'brushing too hard'], why: 'She bit into a crunchy apple, and pop — out came the tooth!' },
      { q: 'How long was the tooth wiggly?', a: 'two weeks', d: ['two days', 'one month', 'one year'], why: 'The first sentence says the tooth was wiggly for two weeks.' },
      { q: 'Where did Rosa put the tooth?', a: 'under her pillow', d: ['in a jar', 'in her backpack', 'on the table'], why: 'The story says she put it under her pillow that night.' },
    ],
  },
  {
    title: 'Recycling Heroes', text: `Room 12 wanted to help the Earth. The class put a green bin next to the trash can. Paper, cans, and bottles went into the green bin. In one month, the class filled the bin ten times. The principal gave Room 12 a Recycling Heroes award!`,
    qs: [
      { q: 'What is this story mostly about?', a: 'a class that recycles', d: ['a broken trash can', 'a new principal', 'how paper is made'], why: 'The story is about Room 12\'s recycling project from start to award.' },
      { q: 'What went into the green bin?', a: 'paper, cans, and bottles', d: ['food and juice', 'toys and books', 'leaves and sticks'], why: 'The story lists paper, cans, and bottles.' },
      { q: 'Why did Room 12 get an award?', a: 'they recycled so much', d: ['they cleaned the gym', 'they read 100 books', 'they won a race'], why: 'They filled the bin ten times in a month — great recycling!' },
    ],
  },
  {
    title: 'Firefly Night', text: `On warm summer nights, fireflies blink in the dark. The blinking is how fireflies talk to each other. Each kind of firefly has its own blinking pattern, like a secret code. Fireflies are not flies at all — they are beetles!`,
    qs: [
      { q: 'Why do fireflies blink?', a: 'to talk to each other', d: ['to stay warm', 'to scare birds', 'to find water'], why: 'The passage says blinking is how fireflies talk to each other.' },
      { q: 'What kind of animal is a firefly really?', a: 'a beetle', d: ['a fly', 'a bee', 'a moth'], why: 'The last sentence says fireflies are actually beetles!' },
      { q: 'When do you see fireflies blink?', a: 'on warm summer nights', d: ['on snowy mornings', 'at lunchtime', 'in the fall'], why: 'The first sentence says warm summer nights.' },
    ],
  },
  {
    title: 'The Little Blue Boat', text: `Sam made a boat from a milk carton. He painted it blue and named it Splash. At the pond, Sam set Splash on the water. The wind pushed the little boat across the pond. Sam ran around to the other side to catch it. Splash made it all the way!`,
    qs: [
      { q: 'What was the boat made from?', a: 'a milk carton', d: ['a shoe box', 'real wood', 'a plastic bottle'], why: 'The first sentence says Sam made it from a milk carton.' },
      { q: 'What pushed the boat across the pond?', a: 'the wind', d: ['a fish', 'Sam\'s hand', 'a paddle'], why: 'The story says the wind pushed the little boat across the pond.' },
      { q: 'What did Sam do while the boat sailed?', a: 'ran to the other side', d: ['went home', 'swam after it', 'flew a kite'], why: 'Sam ran around the pond to catch Splash on the other side.' },
    ],
  },
];

// ------------------------------------------------------------
// SKILLS
// ------------------------------------------------------------

SKILLS.push(
  // ----- PHONICS -----
  {
    id: 'rhyme', strand: 'phonics', name: 'Rhyming words',
    gen: () => {
      const [fam, words] = pick(RHYME_FAMILIES);
      const target = pick(words);
      const answer = pick(words.filter(w => w !== target));
      const others = shuffle(RHYME_FAMILIES.filter(f => f[0] !== fam)).slice(0, 3).map(f => pick(f[1]));
      return {
        prompt: `Which word rhymes with <b>${target}</b>? <button class="btn small sunny" data-say="${target}" data-lang="en">🔊</button>`,
        type: 'mc', choices: shuffle([answer, ...others]), answer,
        explain: `<b>${target}</b> and <b>${answer}</b> both end with the same <b>${fam}</b> sound — they rhyme!`,
      };
    },
  },
  {
    id: 'syllables', strand: 'phonics', name: 'Count the syllables',
    gen: () => {
      const [word, n] = pick(SYLLABLE_BANK);
      return {
        prompt: `Clap it out! How many syllables in <b>${word}</b>? <button class="btn small sunny" data-say="${word}" data-lang="en">🔊</button>`,
        type: 'mc', choices: ['1', '2', '3', '4'], answer: String(n),
        explain: `Clap once for each beat: <b>${word}</b> has <b>${n}</b> syllable${n > 1 ? 's' : ''}. Try resting your hand under your chin — it drops once per syllable!`,
      };
    },
  },
  {
    id: 'vowel_sound', strand: 'phonics', name: 'Short or long vowel?',
    gen: () => {
      const [word, vowel, kind, emoji] = pick(VOWEL_BANK);
      return {
        prompt: `Does the <b>${vowel}</b> in <b>${word}</b> ${emoji} sound SHORT or LONG? <button class="btn small sunny" data-say="${word}" data-lang="en">🔊</button>`,
        type: 'mc', choices: ['short', 'long'], answer: kind,
        explain: kind === 'long'
          ? `In <b>${word}</b>, the ${vowel} says its own NAME ("${vowel.toUpperCase()}") — that's a <b>long</b> vowel.`
          : `In <b>${word}</b>, the ${vowel} makes its quick sound, not its name — that's a <b>short</b> vowel.`,
      };
    },
  },
  {
    id: 'digraph', strand: 'phonics', name: 'Letter teams (sh, ch, th…)',
    gen: () => {
      const [team, rest, word, emoji] = pick(DIGRAPH_BANK);
      const teams = ['sh', 'ch', 'th', 'wh', 'ph'];
      return {
        prompt: `Which letter team finishes the word?`,
        body: `<div class="bignum">__${rest} &nbsp;${emoji}</div>`,
        type: 'mc', choices: teams, answer: team,
        explain: `<b>${team}</b> + ${rest} = <b>${word}</b> ${emoji}. The letters ${team} work together to make one sound.`,
      };
    },
  },
  {
    id: 'silent_e', strand: 'phonics', name: 'Magic silent e',
    gen: () => {
      const [base, word, clue, emoji] = pick(SILENT_E_BANK);
      return {
        prompt: `Add the magic <b>e</b>! Change <b>${base}</b> into ${clue} ${emoji}`,
        type: 'text', answer: word,
        explain: `${base} + magic e = <b>${word}</b>! The silent e makes the vowel say its name.`,
      };
    },
  },

  // ----- SPELLING -----
  {
    id: 'spell_correct', strand: 'spell', name: 'Which spelling is right?',
    gen: () => {
      const [correct, w1, w2] = pick(SPELL_BANK);
      return {
        prompt: `Which word is spelled correctly? <button class="btn small sunny" data-say="${correct}" data-lang="en">🔊</button>`,
        type: 'mc', choices: shuffle([correct, w1, w2]), answer: correct,
        explain: `The correct spelling is <b>${correct}</b>. Take a photo of it with your brain camera! 📸`,
      };
    },
  },
  {
    id: 'plurals', strand: 'spell', name: 'More than one (plurals)',
    gen: () => {
      const [one, many, rule] = pick(PLURAL_BANK);
      return {
        prompt: `One <b>${one}</b>, but two ... ? Type the word!`,
        type: 'text', answer: many,
        explain: `${one} → <b>${many}</b>. ${rule}`,
      };
    },
  },
  {
    id: 'contractions', strand: 'spell', name: 'Contractions',
    gen: () => {
      const [long, short] = pick(CONTRACTION_BANK);
      const wrongs = shuffle(CONTRACTION_BANK.filter(c => c[1] !== short)).slice(0, 3).map(c => c[1]);
      return {
        prompt: `Squeeze it! Which contraction means <b>${long}</b>?`,
        type: 'mc', choices: shuffle([short, ...wrongs]), answer: short,
        explain: `<b>${long}</b> squeezes into <b>${short}</b> — the apostrophe holds the place of the missing letters.`,
      };
    },
  },
  {
    id: 'compound', strand: 'spell', name: 'Compound words',
    gen: () => {
      const [a, b, word, emoji] = pick(COMPOUND_BANK);
      const wrongs = [...new Set(shuffle(COMPOUND_BANK.filter(c => c[2] !== word && c[1] !== b)).map(c => `${a} + ${c[1]}`))].slice(0, 3);
      const correct = `${a} + ${b}`;
      return {
        prompt: `Which two words build <b>${word}</b> ${emoji}?`,
        type: 'mc', choices: shuffle([correct, ...wrongs]), answer: correct,
        explain: `<b>${a}</b> + <b>${b}</b> = ${word} ${emoji} — two little words holding hands!`,
      };
    },
  },

  // ----- GRAMMAR -----
  {
    id: 'noun_id', strand: 'grammar', name: 'Find the noun',
    gen: () => grammarPick('noun', 'a noun (a person, place, or thing)'),
  },
  {
    id: 'verb_id', strand: 'grammar', name: 'Find the verb',
    gen: () => grammarPick('verb', 'a verb (an action word)'),
  },
  {
    id: 'adj_id', strand: 'grammar', name: 'Find the adjective',
    gen: () => grammarPick('adj', 'an adjective (a describing word)'),
  },
  {
    id: 'sentence_type', strand: 'grammar', name: 'What kind of sentence?',
    gen: () => {
      const [sent, kind] = pick(SENTENCE_TYPES);
      return {
        prompt: `What kind of sentence is this?`,
        body: `<div style="font-family:var(--font-display);font-size:26px;font-weight:600">"${sent}"</div>`,
        type: 'mc', choices: ['statement', 'question', 'exclamation', 'command'], answer: kind,
        explain: {
          statement: 'It calmly TELLS us something and ends with a period — a <b>statement</b>.',
          question: 'It ASKS something and ends with a question mark — a <b>question</b>.',
          exclamation: 'It shows strong feeling and ends with an exclamation point — an <b>exclamation</b>!',
          command: 'It tells someone to DO something — a <b>command</b>.',
        }[kind],
      };
    },
  },
  {
    id: 'capitalization', strand: 'grammar', name: 'Capital letters',
    gen: () => {
      const [correct, wrongs, why] = pick(CAPITALIZATION_BANK);
      return {
        prompt: `Which sentence uses capital letters correctly?`,
        type: 'mc', choices: shuffle([correct, ...wrongs]), answer: correct, wide: true,
        explain: why,
      };
    },
  },
  {
    id: 'end_punct', strand: 'grammar', name: 'Pick the end mark',
    gen: () => {
      const [sent, mark] = pick(PUNCT_BANK);
      return {
        prompt: `Which end mark does this sentence need?`,
        body: `<div style="font-family:var(--font-display);font-size:26px;font-weight:600">"${sent}__"</div>`,
        type: 'mc', choices: ['.', '?', '!'], answer: mark,
        explain: { '.': 'It tells something calmly, so it ends with a <b>period</b>.', '?': 'It asks something, so it ends with a <b>question mark</b>.', '!': 'It shows excitement, so it ends with an <b>exclamation point</b>!' }[mark],
      };
    },
  },

  // ----- VOCABULARY -----
  {
    id: 'synonyms', strand: 'vocab', name: 'Synonyms (same meaning)',
    gen: () => {
      const [word, syn, wrongs] = pick(SYNONYM_BANK);
      const opts = [...new Set([syn, ...wrongs, pick(ANTONYM_BANK)[0]].filter(w => w !== word))].slice(0, 4);
      return {
        prompt: `Which word means almost the SAME as <b>${word}</b>?`,
        type: 'mc', choices: shuffle(opts), answer: syn,
        explain: `<b>${word}</b> and <b>${syn}</b> are synonyms — word twins with the same meaning! 👯`,
      };
    },
  },
  {
    id: 'antonyms', strand: 'vocab', name: 'Antonyms (opposites)',
    gen: () => {
      const [word, ant, wrongs] = pick(ANTONYM_BANK);
      const opts = [...new Set([ant, ...wrongs, pick(SYNONYM_BANK)[0]].filter(w => w !== word))].slice(0, 4);
      return {
        prompt: `Which word means the OPPOSITE of <b>${word}</b>?`,
        type: 'mc', choices: shuffle(opts), answer: ant,
        explain: `<b>${word}</b> and <b>${ant}</b> are antonyms — total opposites, like day and night!`,
      };
    },
  },
  {
    id: 'homophones', strand: 'vocab', name: 'Homophones (hear/here)',
    gen: () => {
      const [sent, correct, wrong, why] = pick(HOMOPHONE_BANK);
      return {
        prompt: `Pick the right word:`,
        body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent.replace('___', '<span style="color:var(--coral)">___</span>')}"</div>`,
        type: 'mc', choices: shuffle([correct, wrong]), answer: correct, wide: true,
        explain: why,
      };
    },
  },
  {
    id: 'affix_meaning', strand: 'vocab', name: 'Prefixes & suffixes',
    gen: () => {
      const [word, meaning, wrongs, why] = pick(AFFIX_BANK);
      return {
        prompt: `What does <b>${word}</b> mean?`,
        type: 'mc', choices: shuffle([meaning, ...wrongs]), answer: meaning,
        explain: `<b>${word}</b> = ${meaning}, because ${why}.`,
      };
    },
  },
  {
    id: 'odd_one_out', strand: 'vocab', name: 'Which doesn\'t belong?',
    gen: () => {
      const [words, odd, why] = pick(ODD_ONE_BANK);
      return {
        prompt: `Which word does NOT belong with the others?`,
        type: 'mc', choices: shuffle(words.slice()), answer: odd,
        explain: `${why} — but <b>${odd}</b> is different, so it doesn't belong.`,
      };
    },
  },
  {
    id: 'abc_order', strand: 'vocab', name: 'ABC order',
    gen: () => {
      const words = shuffle(ABC_WORDS).slice(0, 4);
      const answer = words.slice().sort()[0];
      return {
        prompt: `Which word comes FIRST in ABC order?`,
        type: 'mc', choices: words, answer,
        explain: `Line up the first letters against the alphabet: <b>${answer}</b> starts with "${answer[0]}", which comes first. (${words.slice().sort().join(' → ')})`,
      };
    },
  },

  // ----- READING -----
  {
    id: 'read_story', strand: 'reading', name: 'Story time (fiction)',
    gen: () => readingQ(PASSAGES.filter(p => p.kind === 'story')),
  },
  {
    id: 'read_facts', strand: 'reading', name: 'Fact hunt (nonfiction)',
    gen: () => readingQ(PASSAGES.filter(p => p.kind === 'facts')),
  },
);

// tag the original passages, then grow the library
{
  const FACT_TITLES = ['Busy Bats', 'Octopus: Ocean Genius', 'Firefly Night'];
  PASSAGES.forEach(p => { p.kind = FACT_TITLES.includes(p.title) ? 'facts' : 'story'; });
}

PASSAGES.push(
  {
    kind: 'story', title: 'The Rainy Camping Trip',
    text: `Deja's family drove to the lake to go camping. Just as they set up the tent, big raindrops began to fall. "Our campfire is ruined!" said Deja. But Dad had a surprise: he pulled out a little camp stove and made s'mores INSIDE the tent door. They played cards while the rain drummed on the tent. It turned out to be Deja's favorite trip ever.`,
    qs: [
      { q: 'What problem happened on the trip?', a: 'it started to rain', d: ['the tent ripped', 'they forgot the food', 'the car broke down'], why: 'Big raindrops began to fall right after they set up the tent.' },
      { q: 'How did Dad solve the s\'mores problem?', a: 'he used a little camp stove', d: ['he drove to a store', 'he waited for the sun', 'he skipped dessert'], why: 'Dad\'s surprise camp stove saved the s\'mores!' },
      { q: 'How did Deja feel at the END of the story?', a: 'happy — it was her favorite trip', d: ['angry about the rain', 'scared of the lake', 'bored of cards'], why: 'The last sentence says it turned out to be her favorite trip ever.' },
    ],
  },
  {
    kind: 'story', title: 'The Missing Library Book',
    text: `Omar's library book was due on Friday, but he could not find it anywhere. He checked his backpack. He checked under his bed. Then his little sister walked by, pulling her wagon. Inside the wagon sat the book — with her teddy bear "reading" it! Omar laughed, thanked the bear, and returned the book just in time.`,
    qs: [
      { q: 'What was Omar looking for?', a: 'his library book', d: ['his backpack', 'his sister', 'a teddy bear'], why: 'The first sentence says his library book was due Friday and he couldn\'t find it.' },
      { q: 'Where was the book?', a: 'in his sister\'s wagon', d: ['under his bed', 'in his backpack', 'at the library'], why: 'The book was in the wagon, with the teddy bear "reading" it.' },
      { q: 'Where did Omar look FIRST?', a: 'in his backpack', d: ['under his bed', 'in the wagon', 'at school'], why: 'The story says he checked his backpack first, THEN under his bed.' },
    ],
  },
  {
    kind: 'story', title: 'The Big Race',
    text: `On field day, Kiara lined up for the big race. Halfway to the finish, her friend Tom tripped and fell. Kiara stopped running. She helped Tom up, and they crossed the finish line together — in last place. The whole crowd cheered louder for them than for the winner. "Some things matter more than winning," said her coach with a smile.`,
    qs: [
      { q: 'Why did Kiara stop running?', a: 'to help her friend who fell', d: ['she was too tired', 'she lost her shoe', 'the race was canceled'], why: 'Tom tripped and fell, so Kiara stopped to help him up.' },
      { q: 'Why did the crowd cheer the loudest for Kiara and Tom?', a: 'because being kind mattered more than winning', d: ['because they ran the fastest', 'because the winner left', 'because it started raining'], why: 'The coach explains it: some things matter more than winning.' },
      { q: 'What is the LESSON of this story?', a: 'kindness is more important than winning', d: ['always run faster', 'never race with friends', 'field day is boring'], why: 'The story teaches that helping someone beats a trophy.' },
    ],
  },
  {
    kind: 'story', title: 'The Lemonade Stand',
    text: `Ben and Maya opened a lemonade stand to earn money for a new soccer ball. The ball cost eight dollars. On the first day they earned five dollars. "We're not there yet," said Maya, "so let's save it and try again." The next day they earned four more dollars. They bought the ball and had one dollar left over — which went straight into the piggy bank.`,
    qs: [
      { q: 'Why did Ben and Maya open the lemonade stand?', a: 'to earn money for a soccer ball', d: ['to win a contest', 'because they were thirsty', 'to skip chores'], why: 'The first sentence says they wanted to earn money for a new soccer ball.' },
      { q: 'How much money did they earn IN ALL?', a: 'nine dollars', d: ['five dollars', 'four dollars', 'eight dollars'], why: 'Five dollars + four dollars = nine dollars in all.' },
      { q: 'What did they do with the extra dollar?', a: 'saved it in the piggy bank', d: ['bought candy', 'lost it', 'gave it away'], why: 'The last sentence says the leftover dollar went straight into the piggy bank.' },
    ],
  },
  {
    kind: 'story', title: 'The Tomato Mystery',
    text: `Every morning, a tomato was missing from Grandpa's garden. "A mystery!" said Lena. She hid behind the fence with her notebook and waited. Soon a fat groundhog waddled up, picked a tomato, and hurried away. Lena and Grandpa built a little fence around the plants. The tomatoes were safe — and Lena drew the groundhog a picture of his own tomato, just to be fair.`,
    qs: [
      { q: 'What was the mystery in the garden?', a: 'tomatoes kept going missing', d: ['the fence was broken', 'the flowers changed color', 'Grandpa lost his hat'], why: 'Every morning a tomato was missing — that\'s the mystery Lena solved.' },
      { q: 'Who was taking the tomatoes?', a: 'a groundhog', d: ['a bird', 'a neighbor', 'Grandpa'], why: 'Lena watched a fat groundhog waddle up and take one.' },
      { q: 'How did they SOLVE the problem?', a: 'they built a little fence around the plants', d: ['they stopped growing tomatoes', 'they yelled at the groundhog', 'they moved the garden inside'], why: 'A small fence kept the tomatoes safe.' },
    ],
  },
  {
    kind: 'facts', title: 'Honeybees at Work',
    text: `Honeybees live together in a hive with one queen. Worker bees fly from flower to flower collecting sweet nectar. Back at the hive, they turn the nectar into honey. Bees also do a "waggle dance" to tell other bees where the best flowers are. While they visit flowers, bees spread pollen — which helps plants make seeds and fruit. Without bees, we would have far less food!`,
    qs: [
      { q: 'What do worker bees collect from flowers?', a: 'nectar', d: ['honey', 'seeds', 'leaves'], why: 'Bees collect nectar and turn it into honey back at the hive.' },
      { q: 'Why do bees do the "waggle dance"?', a: 'to tell other bees where the best flowers are', d: ['to stay warm', 'to scare away birds', 'because they are happy'], why: 'The waggle dance is bee language for "flowers, this way!"' },
      { q: 'How do bees help plants?', a: 'they spread pollen so plants can make seeds', d: ['they water the plants', 'they chase away bugs', 'they dig the soil'], why: 'Spreading pollen helps plants make seeds and fruit — that\'s why bees matter so much.' },
    ],
  },
  {
    kind: 'facts', title: 'Emperor Penguins',
    text: `Emperor penguins live in Antarctica, the coldest place on Earth. They cannot fly, but they are excellent swimmers. After the mother lays an egg, the FATHER balances it on his feet under a warm flap of skin for two whole months. Hundreds of fathers huddle together in a big circle to stay warm, taking turns on the freezing outside edge. When the chick hatches, the mother returns from the sea with food.`,
    qs: [
      { q: 'Who keeps the egg warm for two months?', a: 'the father penguin', d: ['the mother penguin', 'the chick', 'the sun'], why: 'The father balances the egg on his feet under a warm flap of skin.' },
      { q: 'How do the penguin fathers stay warm?', a: 'they huddle together in a big circle', d: ['they build fires', 'they fly to warm places', 'they dig into the ice'], why: 'Hundreds huddle together and take turns on the cold outside edge — teamwork!' },
      { q: 'What CAN\'T emperor penguins do?', a: 'fly', d: ['swim', 'huddle', 'lay eggs'], why: 'Penguins are flightless — but they are amazing swimmers.' },
    ],
  },
  {
    kind: 'facts', title: 'Our Moon',
    text: `The Moon is Earth's closest neighbor in space. It has no air, no wind, and no rain. That is why an astronaut's footprint on the Moon can last for millions of years! The Moon does not make its own light — it reflects light from the Sun, like a giant mirror. The Moon seems to change shape during the month, from a thin sliver to a full circle. We call these shapes the Moon's phases.`,
    qs: [
      { q: 'Why can a footprint last millions of years on the Moon?', a: 'there is no wind or rain to wipe it away', d: ['the dust is sticky like glue', 'astronauts stomp very hard', 'robots protect it'], why: 'No air, no wind, no rain — nothing to erase the footprint!' },
      { q: 'Where does the Moon\'s light come from?', a: 'it reflects light from the Sun', d: ['it makes its own light', 'from city lights on Earth', 'from the stars'], why: 'The Moon works like a mirror, bouncing sunlight to us.' },
      { q: 'What do we call the Moon\'s changing shapes?', a: 'phases', d: ['faces', 'shadows', 'seasons'], why: 'From sliver to full circle — those shapes are the Moon\'s phases.' },
    ],
  },
  {
    kind: 'facts', title: 'How Rainbows Happen',
    text: `A rainbow appears when sunlight shines through raindrops. Each tiny drop bends the light and splits it into colors, like a tiny piece of glass. The colors always come in the same order: red, orange, yellow, green, blue, and purple. To see a rainbow, the sun must be BEHIND you and the rain in front of you. That is why rainbows often appear right after a storm, when the sun comes back out.`,
    qs: [
      { q: 'What two things make a rainbow?', a: 'sunlight and raindrops', d: ['wind and clouds', 'snow and ice', 'thunder and lightning'], why: 'Sunlight shining through raindrops splits into colors — that\'s the rainbow.' },
      { q: 'What do the raindrops do to the light?', a: 'bend it and split it into colors', d: ['freeze it', 'make it louder', 'turn it off'], why: 'Each drop works like a tiny piece of glass, bending and splitting the light.' },
      { q: 'Where must the SUN be for you to see a rainbow?', a: 'behind you', d: ['in front of you', 'straight overhead', 'below the ground'], why: 'Sun behind you, rain in front — that\'s the rainbow recipe.' },
    ],
  },
  {
    kind: 'facts', title: 'Sea Turtle Journey',
    text: `A mother sea turtle crawls onto the beach at night and buries her eggs in the warm sand. Weeks later, the tiny hatchlings dig out and race to the ocean, following the light of the moon on the water. Baby sea turtles swim for years across the ocean. When a female grows up, something amazing happens: she swims all the way back to the very same beach where she hatched, to lay her own eggs.`,
    qs: [
      { q: 'Where does the mother turtle bury her eggs?', a: 'in the warm beach sand', d: ['under the sea', 'in a nest of sticks', 'in a cave'], why: 'She crawls onto the beach at night and buries them in the sand.' },
      { q: 'What do hatchlings follow to find the ocean?', a: 'the moonlight on the water', d: ['their mother\'s voice', 'other animals', 'a warm wind'], why: 'The moon\'s light shining on the water shows them the way.' },
      { q: 'What amazing thing does a grown-up female do?', a: 'returns to the beach where she hatched', d: ['learns to fly', 'sleeps all winter', 'changes color'], why: 'She swims back to her very own hatching beach to lay her eggs — an incredible journey!' },
    ],
  },
  {
    kind: 'facts', title: 'Amazing Ants',
    text: `Ants are small, but they are super strong — an ant can lift things many times heavier than its own body. Ants live in big underground families called colonies, with one queen who lays all the eggs. Worker ants have different jobs: some find food, some care for the babies, and some guard the nest. Ants leave an invisible smell trail so other ants can follow them straight to food.`,
    qs: [
      { q: 'What makes ants "super strong"?', a: 'they can lift things much heavier than their bodies', d: ['they have big muscles like people', 'they use tiny machines', 'they only lift feathers'], why: 'An ant can carry loads many times its own weight!' },
      { q: 'What is an ant family called?', a: 'a colony', d: ['a herd', 'a flock', 'a class'], why: 'Ants live in colonies — big underground families with a queen.' },
      { q: 'How do ants show each other the way to food?', a: 'they leave an invisible smell trail', d: ['they shout directions', 'they draw maps', 'they blink their eyes'], why: 'Other ants follow the smell trail straight to the food. Teamwork!' },
    ],
  },
);

function grammarPick(role, roleDesc) {
  const [sent, tags] = pick(GRAMMAR_SENTENCES);
  const entries = Object.entries(tags);
  const correctWords = entries.filter(([, r]) => r === role).map(([w]) => w);
  const answer = pick(correctWords);
  const distract = shuffle(entries.filter(([, r]) => r !== role).map(([w]) => w)).slice(0, 3);
  return {
    prompt: `Find <b>${roleDesc}</b>:`,
    body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent}"</div>`,
    type: 'mc', choices: shuffle([answer, ...distract]), answer, wide: true,
    explain: {
      noun: `<b>${answer}</b> is a thing you could point to — that makes it a noun.`,
      verb: `<b>${answer}</b> is what someone or something DOES — that makes it a verb.`,
      adj: `<b>${answer}</b> describes what something is like — that makes it an adjective.`,
    }[role],
  };
}

function readingQ(passages) {
  const p = pick(passages);
  const q = pick(p.qs);
  return {
    prompt: q.q,
    body: `<div style="text-align:left;max-width:560px;margin:0 auto;border:3px solid var(--line);border-radius:14px;background:#FFFDF4;padding:16px 18px">
      <div style="font-family:var(--font-display);font-weight:600;font-size:19px;margin-bottom:6px">📖 ${p.title}</div>
      <div style="font-weight:600;font-size:16.5px;line-height:1.65">${p.text}</div></div>`,
    type: 'mc', choices: shuffle([q.a, ...q.d]), answer: q.a, wide: true,
    explain: q.why,
  };
}
