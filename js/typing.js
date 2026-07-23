/* ============================================================
   LEARNING GARDEN — Computer class (typing) ⌨️
   Keyboard skills for little hands: home row → letters →
   words → sentences. Uses the normal practice engine
   (type-what-you-see), so mastery, plans & streaks all work.
   ============================================================ */

SUBJECTS.splice(5, 0, { id: 'typing', name: 'Computer', emoji: '💻', color: 'var(--sky)' });

STRANDS.push(
  { id: 'type_kb', subject: 'typing', name: 'Keyboard Basics', emoji: '⌨️', color: 'var(--sky)',
    lesson: `<p><b>Your fingers have home seats on the keyboard! 🪑</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>The <b>home row</b> is where your fingers rest: left hand on <b>A S D F</b>, right hand on <b>J K L</b>.</li>
        <li>Feel the little <b>bumps</b> on F and J? Those help your pointer fingers find home without looking!</li>
        <li>Sit up tall, feet flat, wrists floating like you're holding a bubble under each hand. 🫧</li>
        <li>Press the <b>space bar</b> with your thumb.</li>
        <li>Go for <b>accuracy first</b> — speed grows all by itself. Slow and right beats fast and wrong!</li>
      </ul>` },
  { id: 'type_words', subject: 'typing', name: 'Words & Sentences', emoji: '💬', color: 'var(--leaf)',
    lesson: `<p><b>Now put the letters to work!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Type <b>one letter at a time</b> — don't rush. Your fingers are learning a dance. 💃</li>
        <li>Big letters need the <b>Shift</b> key: hold Shift with one hand, tap the letter with the other.</li>
        <li>Every sentence starts with a capital and ends with a period — just like handwriting!</li>
        <li>Made a mistake? <b>Backspace</b> is your friend, not your enemy.</li>
      </ul>` },
);

const TYPE_HOME_BANK = ['ff', 'jj', 'fj', 'jf', 'dd', 'kk', 'dk', 'kd', 'ss', 'll', 'sl', 'aa', 'ask', 'dad', 'sad', 'fall', 'lad', 'flask', 'salad', 'asdf', 'jkl'];
const TYPE_ALL_BANK = ['cat', 'run', 'top', 'wig', 'hen', 'box', 'zip', 'yam', 'quit', 'jam', 'vex', 'pug', 'nod', 'web', 'mix', 'fun', 'got', 'kid', 'sun', 'hop'];
const TYPE_WORD_BANK = ['the', 'and', 'said', 'play', 'jump', 'school', 'friend', 'happy', 'water', 'green', 'little', 'because', 'garden', 'family', 'sister', 'brother', 'pencil', 'monkey', 'yellow', 'winter'];
const TYPE_SENTENCES = [
  'The cat naps in the sun.',
  'I like to read funny books.',
  'We play soccer after school.',
  'My dog can jump very high.',
  'The moon shines at night.',
  'Birds sing in the morning.',
  'I help my mom make dinner.',
  'The frog hops to the pond.',
  'We planted seeds in the garden.',
  'My best friend makes me laugh.',
  'The bus stops at our street.',
  'I brush my teeth every night.',
];

function typingQ(bank, promptText, tip) {
  const target = pick(bank);
  return {
    prompt: promptText,
    body: `<div class="type-target">${esc(target)}</div>`,
    type: 'text', answer: target, exact: true,
    explain: tip || `Nice typing practice! The goal was: <b>${esc(target)}</b>. Accuracy first — speed comes free later! ⌨️`,
  };
}

SKILLS.push(
  {
    id: 'type_home_q', strand: 'type_kb', name: 'Home row keys',
    gen: () => typingQ(TYPE_HOME_BANK, 'Fingers on the home row! Type this, then press Check:', 'Home row practice! Keep those pointer fingers on the F and J bumps. 🪑'),
  },
  {
    id: 'type_letters_q', strand: 'type_kb', name: 'All around the keyboard',
    gen: () => typingQ(TYPE_ALL_BANK, 'Type this word — one letter at a time:'),
  },
  {
    id: 'type_words_q', strand: 'type_words', name: 'Type real words',
    gen: () => typingQ(TYPE_WORD_BANK, 'Type this word, then Check:'),
  },
  {
    id: 'type_sentence_q', strand: 'type_words', name: 'Type a whole sentence',
    gen: () => {
      const s = pick(TYPE_SENTENCES);
      return {
        prompt: 'Type this whole sentence — capital letter, spaces, and the period too!',
        body: `<div class="type-target" style="font-size:24px">${esc(s)}</div>`,
        type: 'text', answer: s, exact: true, wide: true,
        explain: `The sentence was: <b>${esc(s)}</b> — check the capital at the start and the period at the end. You're really typing now! 💻`,
      };
    },
  },
);
