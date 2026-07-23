/* ============================================================
   LEARNING GARDEN — content3.js (Computer & Reading expansion)
   Three blocks, all pure data pushed into the shared arrays:
   • COMPUTER BASICS — new strand `comp_basics` under the Computer
     subject: parts of a computer, click/tap/drag/scroll, helper
     keys, staying safe & kind online, real-life computer helpers.
     NORMAL question cards (mc) — the strand carries
     `engine: 'standard'` so the session router can keep these OUT
     of the typing keyboard (see integration note below).
   • MORE TYPING DRILLS — five new skills in the existing type_kb /
     type_words strands, same typingQ() data shape as typing.js:
     top row, bottom row, capitals with Shift, ending marks (. ? !),
     and a second sentence bank.
   • READING PASSAGES — ten new passages (6 story + 4 facts) pushed
     into PASSAGES with the exact ela.js schema, plus kid-friendly
     glossary words merged into READER_GLOSSARY once reader.js has
     loaded.
   Load AFTER the other subject files (right after content2.js),
   BEFORE sprint.js/coach.js/app.js.
   INTEGRATION (one line each, done by the coordinator):
   1. index.html — script tag after content2.js
   2. coach.js — Object.assign(SKILL_KEYWORDS, CONTENT3_KEYWORDS)
      guard, mirroring the CONTENT2_KEYWORDS line
   3. app.js — bump PLAN_VERSION (catalog grew by 10 skills)
   4. app.js renderSession — typing route must skip standard-engine
      strands: `strand.subject === 'typing' && strand.engine !== 'standard'`
   5. typing.js (optional) — KB_ROWS has "." but no "?" or "!";
      add them so on-screen typists can finish those targets.
   ============================================================ */

// ------------------------------------------------------------
// SCHOOL-FOCUS KEYWORDS for the new skills.
// Same shape as SKILL_KEYWORDS in coach.js — the app merges this
// in (Object.assign(SKILL_KEYWORDS, CONTENT3_KEYWORDS)) at wiring time.
// ------------------------------------------------------------
const CONTENT3_KEYWORDS = {
  // computer basics
  comp_parts: ['computer parts', 'parts of a computer', 'mouse and keyboard', 'technology', 'computer basics', 'hardware'],
  comp_actions: ['click', 'clicking', 'drag and drop', 'scrolling', 'tap and swipe', 'using a mouse', 'computer skills'],
  comp_keys: ['keyboard keys', 'space bar', 'backspace', 'enter key', 'shift key', 'keyboarding'],
  comp_safe: ['online safety', 'internet safety', 'digital citizenship', 'screen time', 'being kind online', 'cyber safety'],
  comp_tools: ['technology in real life', 'digital tools', 'search', 'maps', 'video call', 'what computers do'],
  // typing drills
  type_toprow: ['top row', 'typing', 'keyboarding', 'touch typing'],
  type_bottomrow: ['bottom row', 'typing', 'keyboarding', 'touch typing'],
  type_caps: ['shift key', 'capital letters', 'typing capitals', 'keyboarding'],
  type_punct: ['punctuation', 'ending marks', 'typing sentences', 'keyboarding'],
  type_sent2: ['typing sentences', 'typing fluency', 'keyboarding', 'touch typing'],
};

// ------------------------------------------------------------
// local helper (c3-prefixed to avoid collisions)
// ------------------------------------------------------------
function c3BankQ(bank) {
  const [q, a, d, why] = pick(bank);
  return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
}

// ------------------------------------------------------------
// COMPUTER BASICS — strand
// ------------------------------------------------------------
STRANDS.push(
  { id: 'comp_basics', subject: 'typing', name: 'Computer Basics', emoji: '🖥️', color: 'var(--blue)',
    engine: 'standard', // regular question cards — NOT the typing keyboard session
    lesson: `<p><b>A computer is a tool — and YOU are the boss of it! 🖥️</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Every part has a job: the <b>screen</b> shows pictures and words, the <b>keyboard</b> types letters, and the <b>mouse</b> (or your finger on a tablet) moves the pointer and picks things.</li>
        <li><b>Click or tap</b> means "choose this one." <b>Drag</b> means hold it and slide it somewhere new. <b>Scroll</b> slides the page up or down so you can see more.</li>
        <li>Helper keys: <b>Space</b> puts a space between words, <b>Backspace</b> erases a mistake, <b>Enter</b> starts a new line, and <b>Shift</b> makes CAPITAL letters.</li>
        <li>Computers help with real jobs — finding answers, showing maps, and video-calling people we love. 🗺️</li>
        <li>Be safe and kind: keep your name, address, and school private, ask a grown-up before buying or downloading anything, and only write comments that would make someone smile. 💛</li>
      </ul>` },
);

// ------------------------------------------------------------
// COMPUTER BASICS — banks
// ------------------------------------------------------------

// [emoji, name, what it does (fits "Which part ...?"), fun why-line]
const C3_PARTS = [
  ['🖱️', 'mouse', 'moves the pointer and clicks on things', 'The mouse slides on the desk, and the pointer copies every move on the screen.'],
  ['⌨️', 'keyboard', 'has letter keys for typing words', 'Every letter, number, and space you type comes from the keyboard.'],
  ['🖥️', 'screen', 'shows you the pictures and words', 'The screen is the window into the computer — everything you see lives there.'],
  ['📱', 'tablet', 'is a flat computer you tap with your finger', 'A tablet skips the mouse — your finger IS the pointer!'],
  ['💻', 'laptop', 'is a computer that folds up and travels with you', 'A laptop packs the screen and keyboard into one folding case.'],
  ['🖨️', 'printer', 'puts your work onto real paper', 'Tap print, and the printer turns your screen work into a page you can hold.'],
  ['📷', 'camera', 'takes pictures and shows your face on video calls', 'The little camera eye is how Grandma sees you wave on a video call.'],
  ['🔊', 'speaker', 'plays the sound so everyone can hear', 'Music, voices, and beeps all come out of the speaker.'],
  ['🎧', 'headphones', 'keeps the sound just for your ears', 'Headphones keep your song in your ears — the rest of the room stays quiet.'],
  ['🔋', 'battery', 'stores the power a tablet runs on', 'No outlet needed — the battery carries the power around inside.'],
  ['🔌', 'charger', 'fills the battery back up with power', 'When the battery gets low, the charger plugs in and fills it up again.'],
  ['🎤', 'microphone', 'listens to your voice', 'When you talk on a call or record a song, the microphone is doing the hearing.'],
];

// [question, answer, distractors ×3, why]
const C3_ACTIONS_BANK = [
  ['What does it mean to CLICK on something?', 'press the mouse button to choose it', ['shout its name at the screen', 'unplug the computer', 'turn the screen around'], 'Clicking is how you tell the computer "I choose this one!"'],
  ['On a tablet, what does a TAP do?', 'chooses the thing you touched', ['erases the whole screen', 'makes the tablet heavier', 'turns the sound off'], 'A tap is a click made with your finger — one gentle touch picks it.'],
  ['What does DOUBLE-CLICK mean?', 'click two times fast', ['click with two hands', 'hold the button all day', 'click two different screens'], 'Click-click, quick as a bunny hop — that usually OPENS something.'],
  ['You want to move a picture across the screen. What should you do?', 'drag it — hold and slide it', ['blow on the screen', 'shake the computer gently', 'close your eyes and wish'], 'Dragging is hold-and-slide: grab it, slide it, let go where it belongs.'],
  ['The rest of the story is farther DOWN the page. What do you do?', 'scroll down to see more', ['tip the screen backward', 'print the whole page', 'wait for it to move itself'], 'Scrolling slides the page like an elevator so the hidden part rises up.'],
  ['What does SWIPE mean on a tablet?', 'slide your finger across the screen', ['wipe the screen with a towel', 'tap as hard as you can', 'flip the tablet over'], 'A swipe is a smooth finger slide — it flips pages and moves between screens.'],
  ['What is the little arrow that moves when you move the mouse?', 'the pointer', ['a tiny bird', 'the battery', 'a sticker'], 'That arrow is the pointer — it points at whatever the mouse aims for.'],
  ['To make a photo look BIGGER on a tablet, you can...', 'spread two fingers apart to zoom in', ['tap the screen ten times', 'hold the tablet closer to a lamp', 'shake the tablet up and down'], 'Two fingers spreading apart stretches the picture bigger — that is zooming!'],
  ['You dragged a puzzle piece to its spot. How do you DROP it there?', 'let go of the button or lift your finger', ['press every key at once', 'turn the screen off', 'drag it back home'], 'Drag means hold-and-slide; letting go is the drop. Drag and drop!'],
  ['Press and HOLD your finger on an app and it starts to wiggle. What did you do?', 'a press-and-hold — it opens extra choices', ['broke the tablet', 'made the app dizzy forever', 'deleted the alphabet'], 'Holding a little longer is its own move — it often shows secret extra choices.'],
  ['Which move helps you get back UP to the top of a long page?', 'scroll up', ['click the screen corner hard', 'type your name', 'turn the sound up'], 'Scrolling works both ways — down to see more, up to go back to the top.'],
  ['You clicked the wrong picture by accident. What is the calm fix?', 'click the back arrow or the X to close it', ['never use a computer again', 'click the same thing ten more times', 'hide under the desk'], 'Mistakes are easy to undo — the back arrow and the X are your friends.'],
  ['Moving the mouse moves the pointer. Moving it FASTER makes the pointer...', 'move faster too', ['disappear forever', 'change into a frog', 'get bigger and bigger'], 'The pointer copies the mouse exactly — slow slide, slow pointer; quick slide, quick pointer.'],
  ['Which of these is something you can DRAG?', 'a puzzle piece into its spot', ['the sound of a beep', 'yesterday', 'the smell of cookies'], 'You can drag things you can see on the screen — like a puzzle piece to its spot.'],
];

const C3_KEYS_BANK = [
  ['Which key puts a SPACE between words?', 'the space bar', ['the letter Z', 'the Enter key', 'the Shift key'], 'The long bar at the bottom is the space bar — thumbs press it between words.'],
  ['You typed "cta" but you meant "cat." Which key erases the mistake?', 'Backspace', ['the space bar', 'the letter Q', 'Enter'], 'Backspace nibbles away one letter at a time — mistakes just disappear.'],
  ['Which key starts a NEW line when you finish one?', 'Enter', ['Backspace', 'the space bar', 'the letter A'], 'Press Enter and the blinking line hops down to start fresh.'],
  ['How do you type a CAPITAL letter like the B in Ben?', 'hold Shift while you tap the letter', ['tap the letter twice', 'press the space bar first', 'type it extra hard'], 'Shift is the capital-maker: hold it with one hand, tap the letter with the other.'],
  ['What are the little BUMPS on the F and J keys for?', 'they help your pointer fingers find home without looking', ['they are tiny volume buttons', 'they are left over from the factory', 'they make those letters louder'], 'Feel for the bumps and your hands land on the home row — no peeking needed!'],
  ['Which fingers press the SPACE bar?', 'your thumbs', ['your pinkies', 'your elbows', 'your pointer fingers'], 'Thumbs hover right over the space bar — it is their one big job.'],
  ['You typed a whole wrong word. What can Backspace do?', 'erase it one letter at a time', ['nothing — typing is forever', 'turn the word blue', 'print the word'], 'Tap-tap-tap — Backspace eats the word letter by letter until it is gone.'],
  ['Which key would you HOLD to type the capital M in Mia?', 'Shift', ['Enter', 'Backspace', 'the space bar'], 'Hold Shift, tap M, and out comes a capital. Let go and letters are small again.'],
  ['The blinking line that shows WHERE your letters will go is called the...', 'cursor', ['flashlight', 'doorbell', 'eraser'], 'The cursor blinks patiently, saying "the next letter goes right here!"'],
  ['You finished typing your name on one line. To move down and type your age, press...', 'Enter', ['Shift', 'Backspace', 'the letter E'], 'Enter hops the cursor down to a brand-new line.'],
  ['What happens if you hold a letter key down for a long time?', 'it repeats — like tttttt', ['the computer takes a nap', 'the key pops off', 'nothing at all, ever'], 'Held keys repeat themselves — so tap gently, like petting a chick.'],
  ['Typing "i am sam" — which words need Shift to be correct?', 'I and Sam need capitals', ['no words — small is fine', 'every single letter', 'only the word am'], 'The word I and names like Sam always start with capitals — Shift makes them.'],
  ['Where do your fingers REST between words?', 'on the home row', ['in your lap', 'on the screen', 'on the mouse'], 'Home row is base camp: A S D F for the left hand, J K L for the right.'],
];

const C3_SAFE_BANK = [
  ['A game asks for your home address. What should you do?', 'stop and ask a grown-up first', ['type it in quickly', 'ask a friend to type it', 'share it in the game chat'], 'Your address is private information — a trusted grown-up always helps decide first.'],
  ['Which of these should stay PRIVATE online?', 'your full name, address, and school', ['your favorite color', 'your favorite animal', 'your favorite pizza topping'], 'Favorites are fun to share! But your name, address, and school stay private.'],
  ['Who is it OK to share a password with?', 'your parent or trusted grown-up', ['your whole class', 'anyone who asks nicely', 'people in an online game'], 'Passwords are like house keys — only your trusted grown-ups get a copy.'],
  ['Something on the screen makes you feel yucky or scared. What do you do?', 'tell a grown-up right away', ['keep it a secret', 'click it to look closer', 'blame yourself'], 'You are never in trouble for telling — grown-ups want to help with yucky stuff.'],
  ['A pop-up says "Tap here to buy 1,000 coins!" What is the smart move?', 'ask a grown-up before buying anything', ['tap it fast before it disappears', 'buy just a few coins', 'tap it twice'], 'Buying is a grown-up decision — real money can hide behind game coins.'],
  ['Someone you do not know sends you a message in a game. What is the safe move?', 'show a grown-up before answering', ['tell them your school name', 'send them a photo', 'agree to whatever they ask'], 'Show first, answer later (or never) — grown-ups can spot tricks kids cannot.'],
  ['A player writes something mean to you. What is a good first step?', 'do not write mean words back — tell a grown-up', ['write something meaner', 'say mean things about their family', 'quit computers forever'], 'Mean plus mean just makes more mean. Tell a grown-up and let them help.'],
  ['Your friend posts a drawing you think looks silly. What is the KIND choice?', 'say something nice about it, or say nothing', ['write a joke about it', 'show everyone and laugh', 'copy it and say it is yours'], 'Post comments that would make someone smile — or scroll on by.'],
  ['Your eyes feel tired after a long game. What is a good idea?', 'take a break and play outside for a while', ['play one more hour', 'move your face closer to the screen', 'skip dinner to keep playing'], 'Eyes and bodies love breaks — screens are best in short, happy visits.'],
  ['Which afternoon sounds the MOST balanced?', 'some tablet time, some outside time, some family time', ['tablet time only, all afternoon', 'watching videos during dinner', 'games until midnight'], 'A balanced day mixes screens with sunshine, moving, and people you love.'],
  ['You and your brother both want the tablet. What is a fair plan?', 'take turns with a timer', ['grab it and run', 'hide it under your pillow', 'yell until someone wins'], 'A timer makes turns fair — everyone gets a whole turn with no arguing.'],
  ['Is everything you read online TRUE?', 'no — some things are mistakes or made up', ['yes, screens are always right', 'yes, if the pictures are pretty', 'yes, if lots of people saw it'], 'Anyone can post anything! When you are not sure, check with a grown-up.'],
  ['You want to download a new game. What comes FIRST?', 'ask a grown-up to help choose it', ['download five games to try', 'type in a password you found', 'download it secretly'], 'Grown-ups help pick games that are safe, kind, and right for you.'],
];

// [tool (choice text with its emoji), scenario question, why]
const C3_TOOLS = [
  ['a video call 📹', 'You want to see Grandma smile and talk with her, but she lives far away. Which helper is best?', 'A video call sends your face and voice across the miles — like visiting through the screen.'],
  ['a maps app 🗺️', 'Your family is driving to the new zoo and nobody knows the way. Which helper is best?', 'A maps app draws the route and talks the driver through every turn.'],
  ['a search with a grown-up 🔍', 'You wonder how tall a giraffe really is. Which helper finds the answer?', 'Searching is like asking the world\'s biggest library — a grown-up helps pick good answers.'],
  ['a weather app ⛅', 'You want to know if rain will spoil tomorrow\'s picnic. Which helper is best?', 'Weather apps peek at the sky ahead of time so you can plan your day.'],
  ['a calculator 🧮', 'You want to double-check 48 + 27 really fast. Which helper is best?', 'Calculators add big numbers in a blink — great for checking your own work.'],
  ['a timer ⏰', 'You must remember to water the seedlings in 20 minutes. Which helper is best?', 'Set a timer and forget the worrying — it rings right on time.'],
  ['the camera 📷', 'A ladybug landed on your tomato plant and you want to remember it forever. Which helper is best?', 'The camera freezes the moment into a photo you can keep and share.'],
  ['an email or message 💌', 'You want to send a note to your cousin in another state today. Which helper is best?', 'Messages zoom across the country in seconds — faster than any mail truck.'],
  ['a music app 🎵', 'You want to hear your favorite song while you clean your room. Which helper is best?', 'Music apps hold more songs than a mountain of CDs.'],
  ['a drawing app 🎨', 'You want to paint a rainbow but the real paint is all dried up. Which helper is best?', 'Drawing apps give you every color with zero mess to clean.'],
  ['a how-to video with a grown-up 🎬', 'You want to learn to fold a paper boat, step by step. Which helper is best?', 'How-to videos show each fold slowly — you can pause and rewind until you get it.'],
  ['a reading app 📚', 'You finished your library book and want a new story RIGHT now. Which helper is best?', 'Reading apps carry a whole bookshelf inside one little tablet.'],
  ['an alarm clock app 🌅', 'You keep sleeping past the school bus. Which helper wakes you up on time?', 'An alarm rings at the same time every morning — it never oversleeps.'],
];

// ------------------------------------------------------------
// COMPUTER BASICS — skills (standard mc cards)
// ------------------------------------------------------------
SKILLS.push(
  {
    id: 'comp_parts', strand: 'comp_basics', name: 'Parts of a computer',
    gen: (lvl) => {
      const item = pick(C3_PARTS);
      const [emoji, name, does, why] = item;
      const others = shuffle(C3_PARTS.filter(p => p[1] !== name)).slice(0, 3);
      const mode = lvl === 1 ? pick([1, 1, 2]) : lvl === 3 ? pick([2, 3, 3]) : ri(1, 3);
      if (mode === 1) {
        return {
          prompt: 'What is this computer helper called?',
          body: `<div style="font-size:76px;line-height:1.15">${emoji}</div>`,
          type: 'mc', choices: shuffle([name, ...others.map(o => o[1])]), answer: name,
          explain: `That\'s the <b>${name}</b> ${emoji} — the part that ${does}. ${why}`,
        };
      }
      if (mode === 2) {
        return {
          prompt: `Which part ${does}?`,
          type: 'mc', choices: shuffle([`${emoji} ${name}`, ...others.map(o => `${o[0]} ${o[1]}`)]), answer: `${emoji} ${name}`,
          explain: why,
        };
      }
      return {
        prompt: `Which job belongs to the <b>${name}</b>? ${emoji}`,
        type: 'mc', choices: shuffle([does, ...others.map(o => o[2])]), answer: does,
        explain: why,
      };
    },
  },
  { id: 'comp_actions', strand: 'comp_basics', name: 'Click, tap, drag & scroll', gen: () => c3BankQ(C3_ACTIONS_BANK) },
  { id: 'comp_keys', strand: 'comp_basics', name: 'Helper keys', gen: () => c3BankQ(C3_KEYS_BANK) },
  { id: 'comp_safe', strand: 'comp_basics', name: 'Safe & kind online', gen: () => c3BankQ(C3_SAFE_BANK) },
  {
    id: 'comp_tools', strand: 'comp_basics', name: 'Computer helpers in real life',
    gen: () => {
      const item = pick(C3_TOOLS);
      const [tool, scenario, why] = item;
      const others = shuffle(C3_TOOLS.filter(t => t[0] !== tool)).slice(0, 3).map(t => t[0]);
      return {
        prompt: scenario,
        type: 'mc', choices: shuffle([tool, ...others]), answer: tool,
        explain: why,
      };
    },
  },
);

// ------------------------------------------------------------
// MORE TYPING DRILLS — same typingQ() shape as typing.js.
// Targets stick to keys on the on-screen keyboard (letters, space,
// period) — plus ? and ! in the ending-marks skill (see header
// integration note 5 about adding those two keys to KB_ROWS).
// ------------------------------------------------------------
const TYPE3_TOP_BANK = ['qq', 'ww', 'ee', 'rr', 'tt', 'yy', 'uu', 'ii', 'oo', 'pp', 'we', 'up', 'it', 'to', 'you', 'two', 'out', 'top', 'tip', 'pet', 'wet', 'toy', 'pie', 'trip', 'tree', 'type', 'quit', 'power', 'write', 'pretty'];
const TYPE3_BOTTOM_BANK = ['zz', 'xx', 'cc', 'vv', 'bb', 'nn', 'mm', 'zx', 'xc', 'cv', 'vb', 'bn', 'nm', 'can', 'man', 'van', 'cab', 'nab', 'jab', 'bad', 'max', 'calm', 'clam', 'jazz', 'band', 'hand', 'sand', 'black', 'snack', 'blank'];
const TYPE3_CAPS_BANK = ['Mia', 'Leo', 'Zoe', 'Sam', 'Ava', 'Max', 'Ben', 'Kim', 'Ana', 'Eli', 'Mom', 'Dad', 'May', 'June', 'Monday', 'Friday', 'I am Ben', 'Hi Zoe', 'We love Mom'];
const TYPE3_PUNCT_BANK = ['Yes.', 'No.', 'Wow!', 'Stop!', 'Hooray!', 'Oh no!', 'We won!', 'Look up!', 'I like it.', 'It is warm.', 'Here we go!', 'What a day!', 'Who is it?', 'Can we go?', 'May I try?', 'Is it time?'];
const TYPE3_SENTENCES2 = [
  'We water the seeds after lunch.',
  'A ladybug landed on my hand.',
  'The sunflower is taller than me now.',
  'Grandpa naps in his big green chair.',
  'Can you find the little worm?',
  'Our class grew green beans this year.',
  'The rain made puddles on the path.',
  'I saw three robins by the fence.',
  'Look at that huge pumpkin!',
  'We picked mint leaves for tea.',
  'The soil feels soft and cool.',
  'My plant grew two new leaves today.',
];

SKILLS.push(
  {
    id: 'type_toprow', strand: 'type_kb', name: 'Top row trip',
    gen: () => typingQ(TYPE3_TOP_BANK, 'Reach UP from the home row! Type this, then press Check:', 'Top row practice! Fingers stretch up, then hop right back to their home seats. 🪜'),
  },
  {
    id: 'type_bottomrow', strand: 'type_kb', name: 'Bottom row dive',
    gen: () => typingQ(TYPE3_BOTTOM_BANK, 'Dive DOWN below the home row! Type this, then press Check:', 'Bottom row practice! Curl your fingers down like little divers, then float back home. 🤿'),
  },
  {
    id: 'type_caps', strand: 'type_words', name: 'Capitals with Shift',
    gen: () => typingQ(TYPE3_CAPS_BANK, 'Big letters need the Shift key! Hold Shift with one hand, tap the letter with the other:', 'Capital practice! Hold Shift with one hand and tap the letter with the other — teamwork! 🙌'),
  },
  {
    id: 'type_punct', strand: 'type_words', name: 'Ending marks (. ? !)',
    gen: () => typingQ(TYPE3_PUNCT_BANK, 'Every sentence needs its ending mark — type it all, mark included:', 'Ending-mark practice! The period, question mark, and exclamation point tell the sentence how to sound. 🎬'),
  },
  {
    id: 'type_sent2', strand: 'type_words', name: 'Sentence builder 2',
    gen: () => {
      const s = pick(TYPE3_SENTENCES2);
      return {
        prompt: 'Type this whole sentence — capital letter, spaces, and the ending mark too!',
        body: `<div class="type-target" style="font-size:24px">${esc(s)}</div>`,
        type: 'text', answer: s, exact: true, wide: true,
        explain: `The sentence was: <b>${esc(s)}</b> — check the capital at the start and the ending mark. Your fingers are getting so strong! 💻`,
      };
    },
  },
);

// ------------------------------------------------------------
// READING PASSAGES — 6 story + 4 facts, ela.js schema exactly:
// { kind, title, text, qs: [{ q, a, d:[3], why }] ×3 }
// ------------------------------------------------------------
PASSAGES.push(
  {
    kind: 'story', title: 'The Crooked Sunflower',
    text: `Nia and her abuela planted one sunflower seed for the garden fair. It grew fast, but it grew crooked, with a bend like an elbow. "The straight ones will win," Nia sighed. At the fair, a bee landed right on the crooked bend and took a little rest. The judge laughed and said it was the friendliest flower she had ever met. The crooked sunflower won the Most Cheerful ribbon.`,
    qs: [
      { q: 'What was different about Nia\'s sunflower?', a: 'it grew crooked, with a bend', d: ['it was very tiny', 'it was bright blue', 'it had no petals'], why: 'The story says it grew crooked, with a bend like an elbow.' },
      { q: 'Why did the judge call it the friendliest flower?', a: 'a bee landed on the bend to rest', d: ['it smelled like cookies', 'it was the tallest one', 'it waved in the wind'], why: 'The bee rested right on the crooked bend — the judge loved that.' },
      { q: 'What is the LESSON of this story?', a: 'being different can be wonderful', d: ['only straight flowers matter', 'never enter a fair', 'bees ruin gardens'], why: 'The "crooked" part everyone worried about is exactly what won the ribbon.' },
    ],
  },
  {
    kind: 'story', title: 'The Worm Hotel',
    text: `Theo built a worm hotel from an old wooden box. He tucked in shredded paper, damp leaves, and a scoop of fruit scraps. "Gross!" said his sister Bea, holding her nose. All month, the worms munched the scraps and turned them into dark, rich compost. Theo stirred the compost into the garden bed, and the tomatoes grew huge. Bea started saving her apple cores in a little jar.`,
    qs: [
      { q: 'What did Theo build?', a: 'a worm hotel from a wooden box', d: ['a birdhouse', 'a tomato tower', 'a paper airplane'], why: 'The first sentence says he built a worm hotel from an old wooden box.' },
      { q: 'What did the worms turn the scraps into?', a: 'dark, rich compost', d: ['shredded paper', 'little jars', 'apple juice'], why: 'The worms munched the scraps and made compost for the garden.' },
      { q: 'How did Bea change by the end?', a: 'she started saving scraps for the worms', d: ['she moved the hotel away', 'she stopped eating apples', 'she held her nose forever'], why: 'At first Bea said "Gross!" — but she ended up saving her apple cores to help.' },
    ],
  },
  {
    kind: 'story', title: 'The Quiet Drum',
    text: `Amara got a new drum, but Grandpa was napping in the next room. She wanted to practice her favorite rhythm without waking him. So she tapped the beat softly on her knees, then on a pillow, then on the rug. Tap-tap-TAP, tap-tap-TAP, quiet as rain. When she finally peeked into his room, Grandpa was awake and tapping the very same rhythm on his blanket. "I heard a little drummer," he said, "so I joined the band."`,
    qs: [
      { q: 'Why did Amara play so quietly?', a: 'Grandpa was napping in the next room', d: ['her drum was broken', 'it was past bedtime', 'the neighbors complained'], why: 'She wanted to practice without waking Grandpa from his nap.' },
      { q: 'Where did Amara tap her rhythm?', a: 'on her knees, a pillow, and the rug', d: ['on the kitchen pots', 'on the front door', 'on the window glass'], why: 'The story lists her knees, then a pillow, then the rug — all soft and quiet.' },
      { q: 'What surprise happened at the end?', a: 'Grandpa was tapping the same rhythm', d: ['the drum disappeared', 'Amara fell asleep', 'it started to rain inside'], why: 'Grandpa heard the little drummer and joined the band from his bed!' },
    ],
  },
  {
    kind: 'story', title: 'The Great Seed Swap',
    text: `On seed swap day, everyone brought seeds to trade at school. Priya brought pumpkin seeds in a tiny paper envelope. She really wanted the striped pea seeds that Marcus brought, but he wanted sunflower seeds, not pumpkin. Then Priya had an idea: she traded her pumpkin seeds to Jo for sunflower seeds, and traded those to Marcus for the peas. "That was a double swap!" laughed Marcus. In spring, all three gardens grew something new.`,
    qs: [
      { q: 'What did Priya want from Marcus?', a: 'the striped pea seeds', d: ['pumpkin seeds', 'a paper envelope', 'a garden shovel'], why: 'The story says she really wanted the striped pea seeds Marcus brought.' },
      { q: 'How did Priya solve her trading problem?', a: 'she made a double swap through Jo', d: ['she bought seeds at a store', 'she gave up on peas', 'she took the seeds secretly'], why: 'Pumpkin seeds went to Jo, sunflower seeds went to Marcus, and the peas came to Priya — a double swap!' },
      { q: 'What happened in spring?', a: 'all three gardens grew something new', d: ['the school closed', 'only one seed sprouted', 'they swapped seeds again'], why: 'The last sentence says all three gardens grew something new.' },
    ],
  },
  {
    kind: 'story', title: 'The Night the Lights Went Out',
    text: `A big windstorm blew through town, and the lights went out during dinner. Mateo could not finish his show, and the house felt very dark. But Mama lit candles, and Papa made shadow puppets on the wall — a bunny, a bird, and a wolf with wiggly ears. They ate the rest of dinner like a picnic on the living room floor. When the lights came back on, Mateo groaned, "Aw, can we turn them off again?"`,
    qs: [
      { q: 'Why did the lights go out?', a: 'a big windstorm blew through town', d: ['the family forgot to pay', 'Mateo flipped the switch', 'the sun went down'], why: 'The first sentence says a big windstorm blew through and the lights went out.' },
      { q: 'What did Papa make on the wall?', a: 'shadow puppets', d: ['paintings', 'paper snowflakes', 'a clock'], why: 'Papa made shadow puppets — a bunny, a bird, and a wolf with wiggly ears.' },
      { q: 'How did Mateo feel when the lights came back ON?', a: 'a little sad — the dark was fun', d: ['scared of the wolf', 'angry at the candles', 'too sleepy to care'], why: 'He groaned and asked to turn the lights off again — the picnic-and-puppets night was that fun.' },
    ],
  },
  {
    kind: 'story', title: 'The Turtle Crossing',
    text: `On the way to school, Rosa spotted a box turtle in the middle of the crosswalk. "He is trying to reach the pond!" she said. Rosa knew not to grab a wild animal, so she waved to Mr. Ortiz, the crossing guard. Mr. Ortiz held up his bright stop sign, and all the cars waited. The turtle plodded across, slow as a Sunday, while the whole line of kids cheered. Rosa was late to class, but her teacher said it was the best excuse she had ever heard.`,
    qs: [
      { q: 'What problem did Rosa see?', a: 'a turtle was crossing the busy street', d: ['the pond was empty', 'the school bell broke', 'Mr. Ortiz lost his sign'], why: 'A box turtle was in the middle of the crosswalk, trying to reach the pond.' },
      { q: 'Why did Rosa wave to Mr. Ortiz instead of grabbing the turtle?', a: 'she knew not to grab a wild animal', d: ['her hands were full', 'she was afraid of turtles', 'she wanted to race it'], why: 'Rosa remembered the rule about wild animals and asked a grown-up helper instead.' },
      { q: 'What did Mr. Ortiz do to help?', a: 'held up his stop sign so cars waited', d: ['carried Rosa to class', 'called the zoo', 'built a turtle bridge'], why: 'His bright stop sign made all the cars wait while the turtle plodded across.' },
    ],
  },
  {
    kind: 'facts', title: 'Ladybug Helpers',
    text: `Ladybugs are tiny beetles with bright, spotted shells. Gardeners love them because ladybugs eat aphids, the little bugs that chew on plants. One hungry ladybug can eat fifty aphids in a single day! The bright red color is actually a warning that tells birds, "I taste terrible." When winter comes, ladybugs huddle together in big sleepy piles under leaves and logs. In spring they wake up hungry and get right back to work.`,
    qs: [
      { q: 'Why do gardeners love ladybugs?', a: 'they eat the aphids that chew on plants', d: ['they water the flowers', 'they scare away birds', 'they dig little tunnels'], why: 'Ladybugs gobble up aphids — the pests that hurt garden plants.' },
      { q: 'What does a ladybug\'s bright red color tell birds?', a: 'that ladybugs taste terrible', d: ['that ladybugs are sweet', 'that spring is coming', 'that rain is near'], why: 'The bright color is a warning sign: "I taste terrible — do not eat me!"' },
      { q: 'What do ladybugs do in winter?', a: 'huddle together under leaves and logs', d: ['fly to the beach', 'eat extra aphids', 'change their spots'], why: 'They spend winter in big sleepy piles under leaves and logs, then wake in spring.' },
    ],
  },
  {
    kind: 'facts', title: 'Roots, Stems, and Leaves',
    text: `Every plant has parts with important jobs. The roots grow down into the soil and drink up water, holding the plant steady like an anchor. The stem works like a straw, carrying the water up to the rest of the plant. The leaves are the plant\'s kitchen: they use sunlight to make food. Flowers make seeds so new plants can grow next year. Roots, stem, leaves, flower — every part is a worker on the same green team.`,
    qs: [
      { q: 'What job do the ROOTS do?', a: 'drink water and hold the plant steady', d: ['make food from sunlight', 'make the seeds', 'carry water like a straw'], why: 'Roots drink up water from the soil and anchor the plant in place.' },
      { q: 'Which part works like a straw?', a: 'the stem', d: ['the flower', 'the leaf', 'the seed'], why: 'The stem carries water up from the roots to the rest of the plant — just like a straw.' },
      { q: 'Why are leaves called the plant\'s kitchen?', a: 'they use sunlight to make food', d: ['they hold the plates', 'they smell delicious', 'they stay warm inside'], why: 'Leaves catch sunlight and use it to cook up food for the whole plant.' },
    ],
  },
  {
    kind: 'facts', title: 'Where Rain Goes',
    text: `After a storm, puddles shine all over the playground. But by the next sunny day, they are gone. Where did the water go? The sun warms the puddle until the water evaporates — it turns into invisible mist and floats up into the sky. High in the cool air, the mist gathers into clouds. When a cloud gets heavy and full, the water falls back down as rain. The same water travels up and down, over and over, in a big circle called the water cycle.`,
    qs: [
      { q: 'What happens when puddle water evaporates?', a: 'it turns into invisible mist and floats up', d: ['it freezes into ice', 'it sinks into the ground forever', 'it turns into juice'], why: 'The sun warms the puddle until the water becomes invisible mist that rises into the sky.' },
      { q: 'What do clouds do when they get heavy and full?', a: 'drop the water back down as rain', d: ['float away to space', 'turn into snowmen', 'sing with thunder'], why: 'A heavy, full cloud lets the water fall — that is rain!' },
      { q: 'What is the water cycle?', a: 'water traveling up and down in a big circle', d: ['a bicycle that rides on rivers', 'a machine that makes puddles', 'a game played in the rain'], why: 'The same water goes up as mist and comes down as rain, over and over — a big circle.' },
    ],
  },
  {
    kind: 'facts', title: 'Hummingbird, the Tiny Helicopter',
    text: `A hummingbird is so small it could sit in a teaspoon. Its wings beat about fifty times every second — so fast they look like a blur. That whirring speed lets a hummingbird hover in one spot, just like a tiny helicopter. It can even fly backward, which almost no other bird can do! Hummingbirds hover at flowers and sip sweet nectar with their long, thin beaks. To keep those wings whirring, a hummingbird eats about every ten minutes all day long.`,
    qs: [
      { q: 'Why do a hummingbird\'s wings look like a blur?', a: 'they beat about fifty times every second', d: ['they are painted gray', 'they are made of mist', 'they never move at all'], why: 'Fifty beats a second is too fast for our eyes — we just see a blur.' },
      { q: 'What can a hummingbird do that almost no other bird can?', a: 'fly backward', d: ['sing underwater', 'sleep while flying', 'carry a teaspoon'], why: 'The passage says it can even fly backward — almost no other bird can.' },
      { q: 'Why does a hummingbird eat about every ten minutes?', a: 'its whirring wings use so much energy', d: ['it is always bored', 'flowers close at night', 'its beak gets cold'], why: 'Beating your wings fifty times a second takes LOTS of fuel — so it sips nectar all day.' },
    ],
  },
);

// ------------------------------------------------------------
// Kid-friendly glossary for the new passages. READER_GLOSSARY
// lives in reader.js (loads after this file), so merge once all
// scripts have run. Words not merged simply show with no
// definition — this is an enhancement, never a requirement.
// ------------------------------------------------------------
(function c3GlossaryMerge() {
  const C3_GLOSSARY = {
    crooked: 'bent, not straight',
    compost: 'old food scraps and leaves rotting into rich garden soil',
    scraps: 'little leftover bits of food',
    rhythm: 'a repeating beat, like a heartbeat for music',
    swap: 'a trade — you give one thing and get another',
    aphids: 'tiny bugs that chew on garden plants',
    plodded: 'walked slowly with heavy steps',
    hover: 'float in one spot in the air',
    anchor: 'a heavy holder that keeps things from drifting away',
    blur: 'something moving too fast to see clearly',
  };
  const go = () => { if (typeof READER_GLOSSARY !== 'undefined') Object.assign(READER_GLOSSARY, C3_GLOSSARY); };
  if (typeof document !== 'undefined' && document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
