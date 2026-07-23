/* ============================================================
   LEARNING GARDEN — Spanish (beginner, ages 6-9)
   Greetings, numbers, colors, animals, family & body, food,
   school & days. Every word has a 🔊 button (built-in voice).
   ============================================================ */

STRANDS.push(
  { id: 'sp_basics', subject: 'spanish', name: 'Greetings & Basics', emoji: '👋', color: 'var(--coral)',
    lesson: `<p><b>Say hello like a pro! Tap 🔊 to hear each word.</b></p>
      <table class="cheat-table">
        <tr><th>Español</th><th>English</th><th></th></tr>
        <tr><td><b>Hola</b></td><td>Hello</td><td class="c"><button class="btn small sunny" data-say="Hola">🔊</button></td></tr>
        <tr><td><b>Adiós</b></td><td>Goodbye</td><td class="c"><button class="btn small sunny" data-say="Adiós">🔊</button></td></tr>
        <tr><td><b>Buenos días</b></td><td>Good morning</td><td class="c"><button class="btn small sunny" data-say="Buenos días">🔊</button></td></tr>
        <tr><td><b>Buenas noches</b></td><td>Good night</td><td class="c"><button class="btn small sunny" data-say="Buenas noches">🔊</button></td></tr>
        <tr><td><b>Gracias</b></td><td>Thank you</td><td class="c"><button class="btn small sunny" data-say="Gracias">🔊</button></td></tr>
        <tr><td><b>Por favor</b></td><td>Please</td><td class="c"><button class="btn small sunny" data-say="Por favor">🔊</button></td></tr>
        <tr><td><b>Sí / No</b></td><td>Yes / No</td><td class="c"><button class="btn small sunny" data-say="Sí. No">🔊</button></td></tr>
        <tr><td><b>Me llamo…</b></td><td>My name is…</td><td class="c"><button class="btn small sunny" data-say="Me llamo">🔊</button></td></tr>
      </table>` },
  { id: 'sp_numbers', subject: 'spanish', name: 'Numbers 1–20', emoji: '🔢', color: 'var(--sun)',
    lesson: `<p><b>Count to 20 in Spanish! Tap 🔊 to hear them.</b></p>
      <table class="cheat-table">
        <tr><td>1 uno · 2 dos · 3 tres · 4 cuatro · 5 cinco</td><td class="c"><button class="btn small sunny" data-say="uno, dos, tres, cuatro, cinco">🔊</button></td></tr>
        <tr><td>6 seis · 7 siete · 8 ocho · 9 nueve · 10 diez</td><td class="c"><button class="btn small sunny" data-say="seis, siete, ocho, nueve, diez">🔊</button></td></tr>
        <tr><td>11 once · 12 doce · 13 trece · 14 catorce · 15 quince</td><td class="c"><button class="btn small sunny" data-say="once, doce, trece, catorce, quince">🔊</button></td></tr>
        <tr><td>16 dieciséis · 17 diecisiete · 18 dieciocho · 19 diecinueve · 20 veinte</td><td class="c"><button class="btn small sunny" data-say="dieciséis, diecisiete, dieciocho, diecinueve, veinte">🔊</button></td></tr>
      </table>` },
  { id: 'sp_colors', subject: 'spanish', name: 'Colors', emoji: '🎨', color: 'var(--sky)',
    lesson: `<p><b>Los colores! Tap 🔊 to hear each one.</b></p>
      <table class="cheat-table">
        <tr><td>🔴 <b>rojo</b> = red</td><td>🔵 <b>azul</b> = blue</td><td class="c"><button class="btn small sunny" data-say="rojo. azul">🔊</button></td></tr>
        <tr><td>🟡 <b>amarillo</b> = yellow</td><td>🟢 <b>verde</b> = green</td><td class="c"><button class="btn small sunny" data-say="amarillo. verde">🔊</button></td></tr>
        <tr><td>🟠 <b>anaranjado</b> = orange</td><td>🟣 <b>morado</b> = purple</td><td class="c"><button class="btn small sunny" data-say="anaranjado. morado">🔊</button></td></tr>
        <tr><td>⚫ <b>negro</b> = black</td><td>⚪ <b>blanco</b> = white</td><td class="c"><button class="btn small sunny" data-say="negro. blanco">🔊</button></td></tr>
        <tr><td>🩷 <b>rosado</b> = pink</td><td>🟤 <b>café</b> = brown</td><td class="c"><button class="btn small sunny" data-say="rosado. café">🔊</button></td></tr>
      </table>` },
  { id: 'sp_animals', subject: 'spanish', name: 'Animals', emoji: '🐶', color: 'var(--leaf)',
    lesson: `<p><b>Los animales! Tap 🔊 to hear each one.</b></p>
      <table class="cheat-table">
        <tr><td>🐶 <b>el perro</b> = dog</td><td>🐱 <b>el gato</b> = cat</td><td class="c"><button class="btn small sunny" data-say="el perro. el gato">🔊</button></td></tr>
        <tr><td>🐦 <b>el pájaro</b> = bird</td><td>🐟 <b>el pez</b> = fish</td><td class="c"><button class="btn small sunny" data-say="el pájaro. el pez">🔊</button></td></tr>
        <tr><td>🐴 <b>el caballo</b> = horse</td><td>🐄 <b>la vaca</b> = cow</td><td class="c"><button class="btn small sunny" data-say="el caballo. la vaca">🔊</button></td></tr>
        <tr><td>🐷 <b>el cerdo</b> = pig</td><td>🐰 <b>el conejo</b> = rabbit</td><td class="c"><button class="btn small sunny" data-say="el cerdo. el conejo">🔊</button></td></tr>
        <tr><td>🦁 <b>el león</b> = lion</td><td>🐘 <b>el elefante</b> = elephant</td><td class="c"><button class="btn small sunny" data-say="el león. el elefante">🔊</button></td></tr>
      </table>` },
  { id: 'sp_family', subject: 'spanish', name: 'Family & Body', emoji: '👨‍👩‍👧', color: 'var(--berry)',
    lesson: `<p><b>La familia y el cuerpo! Tap 🔊 to hear each one.</b></p>
      <table class="cheat-table">
        <tr><td>👩 <b>la madre / mamá</b> = mom</td><td>👨 <b>el padre / papá</b> = dad</td><td class="c"><button class="btn small sunny" data-say="la madre. el padre">🔊</button></td></tr>
        <tr><td>👧 <b>la hermana</b> = sister</td><td>👦 <b>el hermano</b> = brother</td><td class="c"><button class="btn small sunny" data-say="la hermana. el hermano">🔊</button></td></tr>
        <tr><td>👵 <b>la abuela</b> = grandma</td><td>👴 <b>el abuelo</b> = grandpa</td><td class="c"><button class="btn small sunny" data-say="la abuela. el abuelo">🔊</button></td></tr>
        <tr><td>🙂 <b>la cabeza</b> = head</td><td>✋ <b>la mano</b> = hand</td><td class="c"><button class="btn small sunny" data-say="la cabeza. la mano">🔊</button></td></tr>
        <tr><td>👀 <b>los ojos</b> = eyes</td><td>🦶 <b>los pies</b> = feet</td><td class="c"><button class="btn small sunny" data-say="los ojos. los pies">🔊</button></td></tr>
      </table>` },
  { id: 'sp_food', subject: 'spanish', name: 'Food', emoji: '🍎', color: 'var(--sun)',
    lesson: `<p><b>La comida! Tap 🔊 to hear each one.</b></p>
      <table class="cheat-table">
        <tr><td>🍎 <b>la manzana</b> = apple</td><td>🍌 <b>el plátano</b> = banana</td><td class="c"><button class="btn small sunny" data-say="la manzana. el plátano">🔊</button></td></tr>
        <tr><td>🥛 <b>la leche</b> = milk</td><td>💧 <b>el agua</b> = water</td><td class="c"><button class="btn small sunny" data-say="la leche. el agua">🔊</button></td></tr>
        <tr><td>🍞 <b>el pan</b> = bread</td><td>🧀 <b>el queso</b> = cheese</td><td class="c"><button class="btn small sunny" data-say="el pan. el queso">🔊</button></td></tr>
        <tr><td>🥚 <b>el huevo</b> = egg</td><td>🍗 <b>el pollo</b> = chicken</td><td class="c"><button class="btn small sunny" data-say="el huevo. el pollo">🔊</button></td></tr>
      </table>` },
  { id: 'sp_school', subject: 'spanish', name: 'School & Days', emoji: '🎒', color: 'var(--cocoa)',
    lesson: `<p><b>La escuela y los días! Tap 🔊 to hear each one.</b></p>
      <table class="cheat-table">
        <tr><td>📖 <b>el libro</b> = book</td><td>✏️ <b>el lápiz</b> = pencil</td><td class="c"><button class="btn small sunny" data-say="el libro. el lápiz">🔊</button></td></tr>
        <tr><td>🎒 <b>la mochila</b> = backpack</td><td>🏫 <b>la escuela</b> = school</td><td class="c"><button class="btn small sunny" data-say="la mochila. la escuela">🔊</button></td></tr>
        <tr><td colspan="2"><b>Days:</b> lunes (Mon) · martes (Tue) · miércoles (Wed) · jueves (Thu) · viernes (Fri) · sábado (Sat) · domingo (Sun)</td>
        <td class="c"><button class="btn small sunny" data-say="lunes, martes, miércoles, jueves, viernes, sábado, domingo">🔊</button></td></tr>
      </table>` },
);

// ------------------------------------------------------------
// vocab banks: [spanish, english, emoji]
// ------------------------------------------------------------
const SP_GREETINGS = [
  ['Hola', 'Hello', '👋'], ['Adiós', 'Goodbye', '👋'], ['Buenos días', 'Good morning', '🌅'],
  ['Buenas noches', 'Good night', '🌙'], ['Gracias', 'Thank you', '💛'], ['Por favor', 'Please', '🙏'],
  ['Sí', 'Yes', '✅'], ['No', 'No', '❌'], ['Amigo', 'Friend', '🧑‍🤝‍🧑'], ['Feliz cumpleaños', 'Happy birthday', '🎂'],
];

const SP_NUMBERS = [
  ['uno', 1], ['dos', 2], ['tres', 3], ['cuatro', 4], ['cinco', 5],
  ['seis', 6], ['siete', 7], ['ocho', 8], ['nueve', 9], ['diez', 10],
  ['once', 11], ['doce', 12], ['trece', 13], ['catorce', 14], ['quince', 15],
  ['dieciséis', 16], ['diecisiete', 17], ['dieciocho', 18], ['diecinueve', 19], ['veinte', 20],
];

const SP_COLORS = [
  ['rojo', 'red', '#E23B2E'], ['azul', 'blue', '#2E6FE2'], ['amarillo', 'yellow', '#F5C518'],
  ['verde', 'green', '#3B9E4C'], ['anaranjado', 'orange', '#F07818'], ['morado', 'purple', '#8A4FBF'],
  ['negro', 'black', '#26221E'], ['blanco', 'white', '#FFFFFF'], ['rosado', 'pink', '#F27BAE'], ['café', 'brown', '#8A5A2E'],
];

const SP_ANIMALS = [
  ['el perro', 'dog', '🐶'], ['el gato', 'cat', '🐱'], ['el pájaro', 'bird', '🐦'], ['el pez', 'fish', '🐟'],
  ['el caballo', 'horse', '🐴'], ['la vaca', 'cow', '🐄'], ['el cerdo', 'pig', '🐷'], ['el conejo', 'rabbit', '🐰'],
  ['el león', 'lion', '🦁'], ['el elefante', 'elephant', '🐘'], ['el mono', 'monkey', '🐒'], ['la tortuga', 'turtle', '🐢'],
];

const SP_FAMILY_BODY = [
  ['la madre', 'mom', '👩'], ['el padre', 'dad', '👨'], ['la hermana', 'sister', '👧'], ['el hermano', 'brother', '👦'],
  ['la abuela', 'grandma', '👵'], ['el abuelo', 'grandpa', '👴'], ['el bebé', 'baby', '👶'],
  ['la cabeza', 'head', '🙂'], ['la mano', 'hand', '✋'], ['los ojos', 'eyes', '👀'], ['los pies', 'feet', '🦶'], ['la boca', 'mouth', '👄'],
];

const SP_FOOD = [
  ['la manzana', 'apple', '🍎'], ['el plátano', 'banana', '🍌'], ['la leche', 'milk', '🥛'], ['el agua', 'water', '💧'],
  ['el pan', 'bread', '🍞'], ['el queso', 'cheese', '🧀'], ['el huevo', 'egg', '🥚'], ['el pollo', 'chicken', '🍗'],
  ['la naranja', 'orange (fruit)', '🍊'], ['el helado', 'ice cream', '🍦'],
];

const SP_SCHOOL = [
  ['el libro', 'book', '📖'], ['el lápiz', 'pencil', '✏️'], ['la mochila', 'backpack', '🎒'],
  ['la escuela', 'school', '🏫'], ['la mesa', 'table', '🪑'], ['la silla', 'chair', '💺'],
  ['el papel', 'paper', '📄'], ['la maestra', 'teacher', '🧑‍🏫'],
];

const SP_DAYS = [
  ['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'], ['jueves', 'Thursday'],
  ['viernes', 'Friday'], ['sábado', 'Saturday'], ['domingo', 'Sunday'],
];

const spShort = (es) => es.replace(/^(el|la|los|las)\s+/i, '');

// Build a vocab question. Banks with unique emoji get the audio-first
// "Escucha y elige" picture cards (design 6a); otherwise classic MC.
function spVocabQ(bank, label) {
  const [es, en, emoji] = pick(bank);
  const uniquePics = emoji && new Set(bank.map(x => x[2])).size === bank.length;
  const toEnglish = pick([true, false]);

  if (uniquePics && toEnglish) {
    const others = shuffle(bank.filter(x => x[0] !== es)).slice(0, 3);
    const cards = shuffle([[es, en, emoji], ...others]).map(([e, , pic]) => ({ pic, label: spShort(e) }));
    return {
      type: 'picture', say: es, cards, answer: spShort(es),
      prompt: `<span class="eyebrow" style="color:var(--gold);letter-spacing:.1em">Escucha y elige · Listen and choose</span>`,
      explain: `<b>¡Muy bien!</b> ${spShort(es)[0].toUpperCase() + spShort(es).slice(1)} means <b>${en}</b>. Now say it out loud!`,
    };
  }
  if (toEnglish) {
    const wrongs = shuffle(bank.filter(x => x[1] !== en)).slice(0, 3).map(x => x[1]);
    return {
      prompt: `What does <b>${es}</b> mean? <button class="btn small sunny" data-say="${es}">🔊 Hear it</button>`,
      type: 'mc', choices: shuffle([en, ...wrongs]), answer: en,
      explain: `<b>${es}</b> = <b>${en}</b> ${emoji || ''}. Say it out loud three times — that plants it in your brain! 🌱`, say: es,
    };
  }
  const wrongs = shuffle(bank.filter(x => x[0] !== es)).slice(0, 3).map(x => x[0]);
  return {
    prompt: `How do you say <b>${en}</b> ${emoji || ''} in Spanish?`,
    type: 'mc', choices: shuffle([es, ...wrongs]), answer: es,
    explain: `<b>${en}</b> = <b>${es}</b>. Tap the 🔊 next time you see it to hear it!`, say: es,
  };
}

SKILLS.push(
  { id: 'sp_greet_q', strand: 'sp_basics', name: 'Hello & thank you', gen: () => spVocabQ(SP_GREETINGS) },
  {
    id: 'sp_num_q', strand: 'sp_numbers', name: 'Numbers 1–20',
    gen: () => {
      const [word, n] = pick(SP_NUMBERS);
      const toDigit = pick([true, false]);
      if (toDigit) {
        return {
          prompt: `What number is <b>${word}</b>? <button class="btn small sunny" data-say="${word}">🔊 Hear it</button>`,
          type: 'num', answer: n, say: word,
          explain: `<b>${word}</b> = <b>${n}</b>. Try counting up to it in Spanish: ${SP_NUMBERS.slice(0, Math.min(n, 5)).map(x => x[0]).join(', ')}…`,
        };
      }
      const wrongs = shuffle(SP_NUMBERS.filter(x => x[1] !== n)).slice(0, 3).map(x => x[0]);
      return {
        prompt: `How do you say <b>${n}</b> in Spanish?`,
        type: 'mc', choices: shuffle([word, ...wrongs]), answer: word, say: word,
        explain: `<b>${n}</b> = <b>${word}</b>.`,
      };
    },
  },
  {
    id: 'sp_color_q', strand: 'sp_colors', name: 'Colors',
    gen: () => {
      const [es, en, hex] = pick(SP_COLORS);
      const sw = `<span style="display:inline-block;width:34px;height:34px;border-radius:10px;border:3px solid var(--line);background:${hex};vertical-align:middle"></span>`;
      const toEnglish = pick([true, false]);
      if (toEnglish) {
        const wrongs = shuffle(SP_COLORS.filter(x => x[1] !== en)).slice(0, 3).map(x => x[1]);
        return {
          prompt: `What color is <b>${es}</b>? <button class="btn small sunny" data-say="${es}">🔊 Hear it</button>`,
          type: 'mc', choices: shuffle([en, ...wrongs]), answer: en, say: es,
          explain: `<b>${es}</b> = <b>${en}</b> ${sw}`,
        };
      }
      const wrongs = shuffle(SP_COLORS.filter(x => x[0] !== es)).slice(0, 3).map(x => x[0]);
      return {
        prompt: `How do you say this color in Spanish?`,
        body: `<div>${sw.replace('34px', '64px').replace('34px', '64px')}</div>`,
        type: 'mc', choices: shuffle([es, ...wrongs]), answer: es, say: es,
        explain: `This color is <b>${es}</b> (${en}).`,
      };
    },
  },
  { id: 'sp_animal_q', strand: 'sp_animals', name: 'Animals', gen: () => spVocabQ(SP_ANIMALS) },
  { id: 'sp_family_q', strand: 'sp_family', name: 'Family & body', gen: () => spVocabQ(SP_FAMILY_BODY) },
  { id: 'sp_food_q', strand: 'sp_food', name: 'Food', gen: () => spVocabQ(SP_FOOD) },
  { id: 'sp_school_q', strand: 'sp_school', name: 'School things', gen: () => spVocabQ(SP_SCHOOL) },
  {
    id: 'sp_days_q', strand: 'sp_school', name: 'Days of the week',
    gen: () => {
      const [es, en] = pick(SP_DAYS);
      const toEnglish = pick([true, false]);
      if (toEnglish) {
        const wrongs = shuffle(SP_DAYS.filter(x => x[1] !== en)).slice(0, 3).map(x => x[1]);
        return {
          prompt: `Which day is <b>${es}</b>? <button class="btn small sunny" data-say="${es}">🔊 Hear it</button>`,
          type: 'mc', choices: shuffle([en, ...wrongs]), answer: en, say: es,
          explain: `<b>${es}</b> = <b>${en}</b>. The week starts with lunes (Monday)!`,
        };
      }
      const wrongs = shuffle(SP_DAYS.filter(x => x[0] !== es)).slice(0, 3).map(x => x[0]);
      return {
        prompt: `How do you say <b>${en}</b> in Spanish?`,
        type: 'mc', choices: shuffle([es, ...wrongs]), answer: es, say: es,
        explain: `<b>${en}</b> = <b>${es}</b>.`,
      };
    },
  },
);
