/* ============================================================
   LEARNING GARDEN — content2.js (Year-2 expansion pack)
   Fills the gaps for a FULL 2nd-grade year:
   • Math: number words, true comparisons, mental jumps, doubles,
     adding 4 numbers, pattern rules, rows & columns, line plots,
     length estimation, two units, length/money/time stories,
     equal shares, partitioned rectangles, solid-shape attributes
     (CCSS 2.NBT.3, 2.NBT.6, 2.NBT.8, 2.OA.4, 2.MD.2/3/5/8/9, 2.G.1/2/3)
   • ELA: irregular plurals, collective nouns, reflexive pronouns,
     adverbs, -er/-est, irregular past tense, shades of meaning,
     2nd-letter ABC order, dictionary guide words, un-squeezing
     contractions (CCSS L.2.1a-e, L.2.2c, L.2.4e, L.2.5b)
   • Science: Seasons & Sky, Sound & Light, Simple Machines strands
     + seed dispersal/pollination + food-chain order (NGSS 2-LS2-2)
   • Social: neighborhood map directions, farm-to-you economics,
     time detectives, deeper American symbols
   Pure data file: only pushes into STRANDS/SKILLS from generators.js.
   Load AFTER the other subject files, BEFORE coach.js/app.js.
   ============================================================ */

// ------------------------------------------------------------
// SCHOOL-FOCUS KEYWORDS for the new skills.
// Same shape as SKILL_KEYWORDS in coach.js — the app merges this
// in (Object.assign(SKILL_KEYWORDS, CONTENT2_KEYWORDS)) at wiring time.
// ------------------------------------------------------------
const CONTENT2_KEYWORDS = {
  // math
  pv_words: ['number words', 'number names', 'word form', 'read and write numbers'],
  pv_compare_true: ['comparing numbers', 'compare numbers', 'greater than', 'less than', 'number sentences'],
  mental_jumps: ['mental math', 'adding tens', 'subtracting tens', 'mentally add', 'mentally subtract'],
  add_doubles: ['doubles', 'near doubles', 'doubles plus one', 'addition strategies'],
  add_multi: ['four two-digit numbers', 'add four numbers', 'adding several numbers', 'three addends'],
  pattern_rule: ['number pattern', 'pattern rule', 'growing patterns', 'skip count'],
  mult_rows: ['arrays', 'rows and columns', 'repeated addition', 'multiplication'],
  data_lineplot: ['line plot', 'line plots', 'measurement data'],
  meas_estimate: ['estimate length', 'estimating length', 'estimation', 'about how long'],
  meas_two_units: ['different units', 'measuring with different units', 'inches and centimeters', 'compare units'],
  meas_word: ['length word problems', 'measurement word problems', 'word problems'],
  money_word: ['money word problems', 'money', 'dollars and cents', 'counting coins'],
  time_word: ['elapsed time', 'time word problems', 'telling time'],
  geo_equal: ['equal shares', 'fair shares', 'halves', 'thirds', 'fourths', 'partition'],
  geo_partition: ['partition rectangles', 'rows and columns', 'square units', 'equal squares'],
  geo_faces: ['3d shapes', 'solid shapes', 'faces edges vertices', 'attributes of shapes'],
  // ela
  ela_irreg_plural: ['irregular plurals', 'irregular plural nouns', 'plural nouns'],
  ela_collective: ['collective nouns', 'group words'],
  ela_reflexive: ['reflexive pronouns', 'pronouns', 'myself'],
  ela_adverb: ['adverb', 'adverbs', 'adjectives and adverbs'],
  ela_er_est: ['comparative', 'superlative', 'er and est', 'adjectives that compare'],
  ela_past_tense: ['past tense', 'irregular verbs', 'verb tense', 'verbs'],
  ela_shades: ['shades of meaning', 'word choice', 'vivid words', 'strong verbs'],
  ela_abc2: ['abc order', 'alphabetical order', 'second letter'],
  ela_dictionary: ['dictionary skills', 'guide words', 'dictionary'],
  ela_contraction_expand: ['contraction', 'contractions', 'apostrophe'],
  // science
  sci_season_id: ['seasons', 'four seasons', 'weather and seasons'],
  sci_season_next: ['seasons', 'season cycle', 'weather and seasons'],
  sci_sky: ['day and night', 'sun and moon', 'sky patterns', 'earth and space'],
  sci_sound: ['sound', 'vibrations', 'light and sound', 'pitch and volume'],
  sci_light: ['light', 'shadows', 'light and sound', 'reflection'],
  sci_machine_id: ['simple machines', 'lever', 'pulley', 'inclined plane', 'ramp'],
  sci_machine_pick: ['simple machines', 'engineering', 'pushes and pulls'],
  sci_seed_travel: ['seed dispersal', 'pollination', 'seeds', 'plants and animals'],
  sci_chain_order: ['food chain', 'food chains', 'food web'],
  // social studies
  soc_grid_map: ['map skills', 'cardinal directions', 'compass', 'reading maps', 'neighborhood map'],
  soc_producers: ['producers and consumers', 'goods and services', 'farm to table', 'economics', 'where food comes from'],
  soc_timeline: ['timeline', 'past and present', 'long ago and today', 'primary sources', 'history'],
  soc_symbols_deep: ['american symbols', 'national symbols', 'patriotic symbols', 'washington dc', 'statue of liberty'],
};

// ------------------------------------------------------------
// local helpers & widgets (c2-prefixed to avoid collisions)
// ------------------------------------------------------------
function c2BankQ(bank) {
  const [q, a, d, why] = pick(bank);
  return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
}

const C2_W_ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const C2_W_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function c2NumberWord(n) {
  if (n < 20) return C2_W_ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10), o = n % 10;
    return C2_W_TENS[t] + (o ? '-' + C2_W_ONES[o] : '');
  }
  const h = Math.floor(n / 100), rest = n % 100;
  return C2_W_ONES[h] + ' hundred' + (rest ? ' ' + c2NumberWord(rest) : '');
}

// line plot: X marks stacked over a number line (2.MD.9)
function c2LinePlotSVG(min, max, counts, title) {
  const W = 560, H = 214, pad = 46, y = 150;
  const x = (v) => pad + ((v - min) / (max - min)) * (W - pad * 2);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="560" role="img">`;
  s += `<line x1="${pad - 14}" y1="${y}" x2="${W - pad + 14}" y2="${y}" stroke="#33302B" stroke-width="4" stroke-linecap="round"/>`;
  for (let v = min; v <= max; v++) {
    s += `<line x1="${x(v)}" y1="${y - 9}" x2="${x(v)}" y2="${y + 9}" stroke="#33302B" stroke-width="3"/>`;
    s += `<text x="${x(v)}" y="${y + 31}" text-anchor="middle" font-size="17" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${v}</text>`;
    const n = counts[v] || 0;
    for (let i = 0; i < n; i++) {
      s += `<text x="${x(v)}" y="${y - 14 - i * 26}" text-anchor="middle" font-size="21" font-weight="800" font-family="Nunito, sans-serif" fill="#D05C38">X</text>`;
    }
  }
  s += `<text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-size="14.5" font-weight="800" font-family="Nunito, sans-serif" fill="#6E675C">${title}</text>`;
  return s + `</svg>`;
}

// rectangle partitioned into same-size squares (2.G.2)
function c2GridRectSVG(r, c) {
  const cell = 46, W = c * cell + 8, H = r * cell + 8;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${Math.min(W, 320)}" role="img">`;
  for (let i = 0; i < r; i++)
    for (let j = 0; j < c; j++)
      s += `<rect x="${4 + j * cell}" y="${4 + i * cell}" width="${cell}" height="${cell}" fill="#BBE3F7" stroke="#33302B" stroke-width="3"/>`;
  return s + `</svg>`;
}

// a rectangle cut into parts by fractional widths (for equal/unequal shares)
function c2PartsRectSVG(cuts) {
  const W = 260, H = 110;
  let s = `<svg viewBox="0 0 ${W + 8} ${H + 8}" width="250" role="img">`;
  let xx = 4;
  cuts.forEach((f) => {
    const w = f * W;
    s += `<rect x="${xx}" y="4" width="${w}" height="${H}" fill="#FFFDF4" stroke="#33302B" stroke-width="4"/>`;
    xx += w;
  });
  return s + `</svg>`;
}
const C2_UNEQUAL_CUTS = {
  2: [[0.3, 0.7], [0.65, 0.35]],
  3: [[0.2, 0.5, 0.3], [0.45, 0.2, 0.35]],
  4: [[0.1, 0.3, 0.2, 0.4], [0.35, 0.15, 0.3, 0.2]],
};

// tiny neighborhood map (3×3 grid) with a compass rose
function c2MapSVG(cells) {
  const cell = 96, pad = 8, W = cell * 3 + pad * 2 + 120, H = cell * 3 + pad * 2;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${Math.min(W, 460)}" role="img">`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x = pad + c * cell, y = pad + r * cell;
    s += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="10" fill="#FFFDF4" stroke="#33302B" stroke-width="3"/>`;
    const p = cells[r + ',' + c];
    if (p) {
      s += `<text x="${x + cell / 2}" y="${y + cell / 2 + 4}" text-anchor="middle" font-size="34">${p[0]}</text>`;
      s += `<text x="${x + cell / 2}" y="${y + cell - 10}" text-anchor="middle" font-size="12.5" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${p[1]}</text>`;
    }
  }
  const cx = cell * 3 + pad * 2 + 56, cy = 78;
  s += `<circle cx="${cx}" cy="${cy}" r="32" fill="#FFFDF4" stroke="#33302B" stroke-width="3"/>`;
  s += `<path d="M ${cx} ${cy - 24} L ${cx + 8} ${cy} L ${cx} ${cy + 24} L ${cx - 8} ${cy} Z" fill="#D05C38" stroke="#33302B" stroke-width="2"/>`;
  s += `<text x="${cx}" y="${cy - 40}" text-anchor="middle" font-size="17" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">N</text>`;
  s += `<text x="${cx}" y="${cy + 52}" text-anchor="middle" font-size="17" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">S</text>`;
  s += `<text x="${cx + 42}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">E</text>`;
  s += `<text x="${cx - 42}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">W</text>`;
  return s + `</svg>`;
}

// ------------------------------------------------------------
// NEW SCIENCE STRANDS (with Learn-card lessons)
// ------------------------------------------------------------
STRANDS.push(
  { id: 'sci_seasons', subject: 'science', name: 'Seasons & Sky', emoji: '🍂', color: 'var(--berry)',
    lesson: `<p><b>The seasons go around in a circle, the same order every year!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>❄️ <b>Winter</b>: coldest days, dark comes early, maybe snow.</li>
        <li>🌷 <b>Spring</b>: flowers bloom, baby animals are born, rain showers.</li>
        <li>☀️ <b>Summer</b>: hottest days and the LONGEST days of sunshine.</li>
        <li>🍂 <b>Fall</b>: leaves turn colors and drop, air gets crisp, squirrels hide acorns.</li>
      </ul>
      <p style="font-weight:700">The sky has patterns too! Earth is always <b>spinning</b> — that's why we get <b>day and night</b> every single day. The sun rises in the <b>east</b> and sets in the <b>west</b>. The moon doesn't make its own light — it <b>reflects</b> sunlight like a mirror. 🌙</p>` },
  { id: 'sci_energy', subject: 'science', name: 'Sound & Light', emoji: '🔦', color: 'var(--coral)',
    lesson: `<p><b>Sound starts with a wiggle!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Every sound is made by something <b>vibrating</b> — wiggling back and forth super fast. Pluck a rubber band and watch it blur!</li>
        <li><b>Loud or soft</b> = how BIG the wiggle is. Hit a drum hard → loud. Tap it → soft.</li>
        <li><b>High or low</b> is called pitch. Tiny things squeak high 🐭, big things rumble low 🥁.</li>
      </ul>
      <p><b>Light lets us see!</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Some things make their OWN light: the sun ☀️, lamps, even fireflies!</li>
        <li>A <b>shadow</b> happens when something blocks the light.</li>
        <li>Mirrors and shiny things <b>reflect</b> light — they bounce it back. The moon shines with bounced sunlight!</li>
      </ul>` },
  { id: 'sci_machines', subject: 'science', name: 'Simple Machines', emoji: '⚙️', color: 'var(--sun)',
    lesson: `<p><b>Simple machines are helpers that make pushing, pulling, and lifting easier.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Ramp</b> (inclined plane): a slanted surface for sliding things up or down — like a slide! 🛝</li>
        <li><b>Lever</b>: a bar that tips on a point — a seesaw, or a spoon prying open a paint can.</li>
        <li><b>Wheel & axle</b>: wheels turning on a rod — wagons, bikes, even doorknobs! 🚲</li>
        <li><b>Pulley</b>: a rope over a wheel for lifting — it raises the flag up the flagpole. 🚩</li>
        <li><b>Wedge</b>: two slanted sides that split or hold things — an axe, or a doorstop.</li>
        <li><b>Screw</b>: a ramp wrapped around a pole — it twists things tight, like a jar lid!</li>
      </ul>
      <p style="font-weight:700">Look around — your house is FULL of simple machines doing quiet work all day. 🔎</p>` },
);

// ------------------------------------------------------------
// MATH BANKS
// ------------------------------------------------------------
const C2_ESTIMATE_BANK = [
  ['a new crayon 🖍️', '3 inches', ['3 feet', '3 miles']],
  ['a door 🚪', '7 feet', ['7 inches', '70 feet']],
  ['a ladybug 🐞', '1 centimeter', ['1 meter', '1 foot']],
  ['your bed 🛏️', '6 feet', ['6 inches', '60 feet']],
  ['a pencil ✏️', '7 inches', ['7 feet', '70 inches']],
  ['a paperclip 📎', '3 centimeters', ['3 meters', '30 centimeters']],
  ['a 2nd grader 🧒', '4 feet', ['4 inches', '40 feet']],
  ['a car 🚗', '15 feet', ['15 inches', '1 inch']],
  ['a juice box 🧃', '4 inches', ['40 inches', '4 feet']],
  ['a basketball hoop 🏀', '10 feet', ['10 inches', '100 feet']],
  ['your math book 📗', '30 centimeters', ['30 meters', '3 centimeters']],
  ['a bathtub 🛁', '5 feet', ['5 inches', '50 feet']],
  ['your thumb 👍', '2 inches', ['2 feet', '20 inches']],
  ['a banana 🍌', '7 inches', ['70 inches', '7 feet']],
  ['a soccer field ⚽', '100 meters', ['100 centimeters', '1 meter']],
];

const C2_TWO_UNIT_FACTS = [
  ['A pencil measures 7 inches or 18 centimeters. Why is the centimeter number BIGGER?',
    'centimeters are smaller, so you need more of them',
    ['the pencil grew while measuring', 'inches are smaller than centimeters', 'the ruler made a mistake'],
    'Smaller unit → MORE of them fit. Centimeters are smaller than inches, so the count is bigger.'],
  ['A table is 3 feet or 36 inches long. Why is the inch number BIGGER?',
    'inches are smaller, so you need more of them',
    ['feet are smaller than inches', 'the table stretched', 'someone counted wrong'],
    'It takes 12 little inches to make 1 foot — smaller units always give a bigger count.'],
  ['Nora measures her jump rope in meters, then in centimeters. Which count is bigger?',
    'the centimeter count', ['the meter count', 'both counts are the same', 'neither has a count'],
    'Centimeters are much smaller than meters, so she counts many more of them.'],
  ['To get the BIGGEST number when measuring your shoe, which unit would you use?',
    'centimeters', ['feet', 'meters', 'yards'],
    'The smallest unit gives the biggest count — tiny centimeters stack up fast!'],
  ['Two kids measure the SAME rug. Ava counts 60 and Ben counts 5. Who used the SMALLER unit?',
    'Ava — more units means smaller units', ['Ben — fewer units means smaller units', 'neither, the rug changed size', 'both used the same unit'],
    'Same rug, more units counted = each unit must be smaller. Ava used the smaller unit.'],
  ['Measuring the hallway, which unit gives the SMALLEST number?',
    'meters', ['centimeters', 'inches', 'thumb-widths'],
    'The biggest unit takes the fewest steps to cover the hallway — that\'s meters.'],
];

const C2_SOLID_COUNTS = [
  ['How many FLAT faces does a cube have? 🎲', 6, 'A cube has <b>6</b> flat square faces — count them on a dice: top, bottom, and 4 sides!'],
  ['How many corners (vertices) does a cube have? 🎲', 8, 'A cube has <b>8</b> corners — 4 on top and 4 on the bottom.'],
  ['How many FLAT faces does a cylinder have? 🥫', 2, 'Just the <b>2</b> circle ends — the side is curved, so it doesn\'t count as flat.'],
  ['How many FLAT faces does a cone have? 🍦', 1, 'Only <b>1</b> — the circle on the bottom. The rest is curved.'],
  ['How many FLAT faces does a sphere have? ⚽', 0, 'A sphere is round ALL over — <b>zero</b> flat faces!'],
  ['How many faces does a rectangular prism have? 📦', 6, 'Like a cereal box: top, bottom, front, back, and 2 sides = <b>6</b> faces.'],
  ['How many corners (vertices) does a square pyramid have?', 5, '4 corners around the square bottom + 1 point at the tip = <b>5</b>.'],
];

const C2_SOLID_FACTS = [
  ['Which solid can ROLL in any direction?', 'a sphere ⚽', ['a cube', 'a rectangular prism', 'a square pyramid'], 'A sphere is round everywhere, so it rolls any way you push it.'],
  ['Which solid is BEST for stacking into a tall tower?', 'a cube 🧊', ['a sphere', 'a cone', 'an egg shape'], 'Flat faces stack! Cubes sit steady on top of each other.'],
  ['Which solid has a point at the very top?', 'a cone 🍦', ['a sphere', 'a cylinder', 'a cube'], 'A cone narrows to one point — like the tip of a party hat.'],
  ['What shape are the faces of a cube?', 'squares', ['circles', 'triangles', 'stars'], 'All 6 faces of a cube are matching squares.'],
  ['What shape are the two flat ends of a cylinder?', 'circles', ['squares', 'triangles', 'rectangles'], 'A cylinder is like a can — circle on top, circle on the bottom.'],
  ['Which solid has NO flat faces at all?', 'a sphere ⚽', ['a cube', 'a cylinder', 'a cone'], 'Spheres are curved everywhere — not one flat spot.'],
  ['A cereal box is a rectangular prism. What shape are its faces?', 'rectangles', ['circles', 'triangles', 'hearts'], 'Every face of the box is a rectangle — some long, some short.'],
];

// ------------------------------------------------------------
// ELA BANKS
// ------------------------------------------------------------
const C2_IRREG_PLURALS = [
  ['man', 'men', ['mans', 'manes'], 'changes completely'],
  ['woman', 'women', ['womans', 'womens'], 'changes completely'],
  ['child', 'children', ['childs', 'childes'], 'changes completely'],
  ['foot', 'feet', ['foots', 'feets'], 'changes completely'],
  ['tooth', 'teeth', ['tooths', 'teeths'], 'changes completely'],
  ['mouse', 'mice', ['mouses', 'mices'], 'changes completely'],
  ['goose', 'geese', ['gooses', 'geeses'], 'changes completely'],
  ['person', 'people', ['peoples', 'persones'], 'changes completely'],
  ['leaf', 'leaves', ['leafs', 'leafes'], 'changes f to v and adds -es'],
  ['wolf', 'wolves', ['wolfs', 'wolvs'], 'changes f to v and adds -es'],
  ['knife', 'knives', ['knifes', 'knive'], 'changes f to v and adds -es'],
  ['sheep', 'sheep', ['sheeps', 'sheepes'], 'stays exactly the same'],
  ['fish', 'fish', ['fishs', 'fishies'], 'stays exactly the same'],
  ['deer', 'deer', ['deers', 'deeres'], 'stays exactly the same'],
];

const C2_COLLECTIVE = [
  ['flock', 'birds', ['herd', 'school', 'bunch']],
  ['herd', 'cows', ['flock', 'school', 'litter']],
  ['pack', 'wolves', ['flock', 'bunch', 'deck']],
  ['school', 'fish', ['herd', 'pack', 'pride']],
  ['swarm', 'bees', ['herd', 'pride', 'deck']],
  ['litter', 'puppies', ['flock', 'school', 'deck']],
  ['pride', 'lions', ['swarm', 'school', 'bunch']],
  ['pod', 'dolphins', ['pride', 'litter', 'bunch']],
  ['colony', 'ants', ['herd', 'pride', 'deck']],
  ['team', 'players', ['flock', 'herd', 'swarm']],
  ['class', 'students', ['herd', 'swarm', 'pod']],
  ['crowd', 'people', ['litter', 'pod', 'swarm']],
  ['bunch', 'grapes', ['herd', 'flock', 'pod']],
  ['deck', 'cards', ['flock', 'herd', 'litter']],
];

const C2_REFLEXIVE = [
  ['I drew this picture all by ___.', 'myself', ['himself', 'themselves', 'yourselves']],
  ['You can pour the juice ___.', 'yourself', ['myself', 'herself', 'themselves']],
  ['Leo built the fort ___.', 'himself', ['herself', 'myself', 'themselves']],
  ['Mia taught ___ to whistle.', 'herself', ['himself', 'ourselves', 'yourselves']],
  ['The kitten licked ___ clean.', 'itself', ['ourselves', 'yourselves', 'themselves']],
  ['We made lunch all by ___.', 'ourselves', ['myself', 'themselves', 'itself']],
  ['The twins dressed ___ for school.', 'themselves', ['ourselves', 'himself', 'itself']],
  ['I looked at ___ in the mirror.', 'myself', ['itself', 'yourselves', 'themselves']],
  ['Sam, you should be proud of ___!', 'yourself', ['myself', 'himself', 'ourselves']],
  ['Zoe found ___ a cozy reading spot.', 'herself', ['themselves', 'yourselves', 'itself']],
  ['Max poured ___ a glass of milk.', 'himself', ['themselves', 'ourselves', 'yourselves']],
  ['The robot turned ___ off.', 'itself', ['himself', 'ourselves', 'yourselves']],
  ['We cheered for ___ after the show.', 'ourselves', ['myself', 'yourself', 'itself']],
  ['The puppies tired ___ out playing.', 'themselves', ['itself', 'ourselves', 'myself']],
];

const C2_ADVERB_FIND = [
  ['The snail moved slowly across the path.', 'slowly', ['snail', 'moved', 'path']],
  ['Deja quickly packed her backpack.', 'quickly', ['packed', 'backpack', 'Deja']],
  ['The owl hooted softly in the night.', 'softly', ['owl', 'hooted', 'night']],
  ['Dad carefully carried the birthday cake.', 'carefully', ['Dad', 'carried', 'cake']],
  ['The kids played outside until dinner.', 'outside', ['kids', 'played', 'dinner']],
  ['We will visit the library tomorrow.', 'tomorrow', ['library', 'visit', 'We']],
  ['The frog hopped away from the heron.', 'away', ['frog', 'hopped', 'heron']],
  ['Grandma always waves from the porch.', 'always', ['Grandma', 'waves', 'porch']],
  ['The choir sang loudly at the concert.', 'loudly', ['choir', 'sang', 'concert']],
  ['Please tiptoe quietly past the baby.', 'quietly', ['tiptoe', 'baby', 'past']],
];

const C2_ADV_OR_ADJ = [
  ['The turtle walks ___.', 'slowly', 'slow', 'It tells HOW the turtle walks — that\'s an adverb job, so use <b>slowly</b>.'],
  ['That is a ___ puppy.', 'quick', 'quickly', 'It describes the puppy (a noun) — that\'s an adjective job, so use <b>quick</b>.'],
  ['The puppy runs ___.', 'quickly', 'quick', 'It tells HOW the puppy runs — verbs get adverbs, so use <b>quickly</b>.'],
  ['The sun is ___ today.', 'bright', 'brightly', 'It describes the sun — adjective job, so use <b>bright</b>.'],
  ['The stars shine ___.', 'brightly', 'bright', 'It tells HOW the stars shine — adverb job, so use <b>brightly</b>.'],
  ['Please close the door ___.', 'quietly', 'quiet', 'It tells HOW to close the door — adverb job, so use <b>quietly</b>.'],
  ['The library is a ___ place.', 'quiet', 'quietly', 'It describes the place — adjective job, so use <b>quiet</b>.'],
  ['The chef sings ___ while he cooks.', 'happily', 'happy', 'It tells HOW he sings — adverb job, so use <b>happily</b>.'],
  ['The baby has a ___ smile.', 'happy', 'happily', 'It describes the smile — adjective job, so use <b>happy</b>.'],
  ['The leaves fell ___ to the ground.', 'gently', 'gentle', 'It tells HOW the leaves fell — adverb job, so use <b>gently</b>.'],
];

const C2_ER_EST = [
  ['A giraffe is ___ than a pony.', 'taller', ['tallest', 'tall'], 'The word <b>than</b> compares TWO things — use <b>-er</b>.'],
  ['Of ALL the zoo animals, the giraffe is the ___.', 'tallest', ['taller', 'tall'], '"Of all" means the very top of the whole group — use <b>-est</b>.'],
  ['This puzzle is ___ than that one.', 'harder', ['hardest', 'hard'], '<b>Than</b> = comparing two — use <b>-er</b>.'],
  ['Winter is the ___ season of the whole year.', 'coldest', ['colder', 'cold'], 'Comparing ALL four seasons — the champion gets <b>-est</b>.'],
  ['A mouse is ___ than a cat.', 'smaller', ['smallest', 'small'], 'Two animals + "than" — use <b>-er</b>.'],
  ['That was the ___ joke I have ever heard!', 'funniest', ['funnier', 'funny'], '"Ever" means out of ALL jokes — use <b>-est</b>.'],
  ['My backpack is ___ than yours.', 'heavier', ['heaviest', 'heavy'], 'Two backpacks + "than" — use <b>-er</b>.'],
  ['The cheetah is the ___ runner of all land animals.', 'fastest', ['faster', 'fast'], '"Of all" — the cheetah wins the whole group, so <b>-est</b>.'],
  ['Today is ___ than yesterday.', 'warmer', ['warmest', 'warm'], 'Comparing two days — use <b>-er</b>.'],
  ['This is the ___ pillow in the whole house.', 'softest', ['softer', 'soft'], '"In the whole house" = the top of the group — use <b>-est</b>.'],
  ['A whale is ___ than a dolphin.', 'bigger', ['biggest', 'big'], 'Two animals + "than" — use <b>-er</b>.'],
  ['Mount Everest is the ___ mountain on Earth.', 'highest', ['higher', 'high'], 'Out of ALL mountains — use <b>-est</b>.'],
];

const C2_PAST_TENSE = [
  ['Yesterday we ___ (sit) in the front row.', 'sat', ['sitted', 'sits']],
  ['Last night I ___ (run) all the way home.', 'ran', ['runned', 'runs']],
  ['We ___ (go) to the beach last summer.', 'went', ['goed', 'goes']],
  ['The birds ___ (eat) every crumb yesterday.', 'ate', ['eated', 'eats']],
  ['I ___ (see) a shooting star last night!', 'saw', ['seen', 'sees']],
  ['Grandpa ___ (come) to visit last week.', 'came', ['comed', 'comes']],
  ['Ruby ___ (take) her turn first yesterday.', 'took', ['taked', 'takes']],
  ['Dad ___ (give) me a high-five after the game.', 'gave', ['gived', 'gives']],
  ['We ___ (make) cookies on Saturday.', 'made', ['maked', 'makes']],
  ['She ___ (tell) us a funny story last night.', 'told', ['telled', 'tells']],
  ['The squirrel ___ (hide) its acorn yesterday.', 'hid', ['hided', 'hides']],
  ['We ___ (swim) at the pool last weekend.', 'swam', ['swimmed', 'swims']],
  ['Eli ___ (ride) his bike to the park yesterday.', 'rode', ['rided', 'rides']],
  ['She ___ (write) a letter to her pen pal last week.', 'wrote', ['writed', 'writes']],
  ['We ___ (sing) our favorite song this morning.', 'sang', ['singed', 'sings']],
];

const C2_SHADES = [
  ['toss', 'throw', 'hurl'],
  ['warm', 'hot', 'sizzling'],
  ['cool', 'cold', 'freezing'],
  ['like', 'love', 'adore'],
  ['whisper', 'talk', 'shout'],
  ['walk', 'jog', 'sprint'],
  ['big', 'huge', 'gigantic'],
  ['small', 'tiny', 'teeny-weeny'],
  ['glad', 'happy', 'overjoyed'],
  ['nibble', 'munch', 'gobble'],
  ['drizzle', 'rain', 'pour'],
  ['glance', 'look', 'stare'],
  ['tap', 'knock', 'pound'],
  ['good', 'great', 'amazing'],
];

const C2_ABC2_POOLS = [
  ['band', 'best', 'bike', 'boat', 'bug'],
  ['cape', 'cent', 'city', 'coat', 'cub'],
  ['dad', 'den', 'dig', 'dog', 'duck'],
  ['map', 'men', 'milk', 'mop', 'mud'],
  ['pan', 'pet', 'pig', 'pot', 'pup'],
  ['sand', 'seed', 'sing', 'sock', 'sun'],
  ['tail', 'ten', 'tiger', 'top', 'tub'],
  ['rain', 'red', 'ring', 'rock', 'rug'],
];

// kept in a list, then sorted in code so ABC order is always exact
const C2_DICT_WORDS = ['acorn', 'ant', 'apple', 'bear', 'bell', 'bike', 'boat', 'bug', 'cake', 'cat',
  'coat', 'cup', 'dog', 'door', 'duck', 'egg', 'farm', 'fish', 'fox', 'frog',
  'game', 'goat', 'hat', 'horse', 'ice', 'jam', 'kite', 'lamp', 'leaf', 'lion',
  'map', 'moon', 'mouse', 'nest', 'nut', 'owl', 'pig', 'pond', 'queen', 'rain',
  'ring', 'rock', 'seed', 'sock', 'sun', 'tent', 'tree', 'van', 'wave', 'yarn', 'zebra', 'zoo'].slice().sort();

const C2_CONTRACTION_X = [
  ["won't", 'will not', ['would not', 'want not', 'was not']],
  ["can't", 'cannot', ['could not', 'will not', 'do not']],
  ["don't", 'do not', ['does not', 'did not', 'down not']],
  ["didn't", 'did not', ['do not', 'does not', 'had not']],
  ["isn't", 'is not', ['was not', 'are not', 'has not']],
  ["aren't", 'are not', ['is not', 'am not', 'were not']],
  ["wasn't", 'was not', ['were not', 'is not', 'will not']],
  ["weren't", 'were not', ['was not', 'are not', 'will not']],
  ["I'm", 'I am', ['I will', 'I have', 'I can']],
  ["you're", 'you are', ['you will', 'you have', 'you were']],
  ["they're", 'they are', ['they were', 'there are', 'they will']],
  ["we've", 'we have', ['we are', 'we will', 'we had']],
  ["she'll", 'she will', ['she is', 'she was', 'she has']],
  ["let's", 'let us', ['let is', 'let it', 'let this']],
  ["it's", 'it is', ['it was', 'it will', 'its is']],
  ["he's", 'he is', ['he was', 'he will', 'his is']],
];

// ------------------------------------------------------------
// SCIENCE BANKS
// ------------------------------------------------------------
const C2_SEASON_CLUES = [
  ['Leaves turn red and orange and float down from the trees.', 'fall'],
  ['Squirrels are busy hiding acorns, and the air turns crisp.', 'fall'],
  ['Pumpkins are ripe and kids head back to school.', 'fall'],
  ['Snow might fall, and ponds can freeze into ice.', 'winter'],
  ['It gets dark early, and you need your warmest coat.', 'winter'],
  ['Some animals, like bears, sleep through this cold season.', 'winter'],
  ['Flowers bloom and trees grow brand-new green leaves.', 'spring'],
  ['Baby birds hatch and baby bunnies hop around.', 'spring'],
  ['Gentle rain showers help the gardens grow.', 'spring'],
  ['It is the hottest season, perfect for swimming.', 'summer'],
  ['The days are the longest — the sun stays out late.', 'summer'],
  ['Ice cream melts fast and sprinklers keep you cool.', 'summer'],
];

const C2_SEASON_DRESS = [
  ['Which would you wear on a SNOWY winter day?', 'a warm coat and mittens', ['a swimsuit', 'flip-flops', 'a sun hat'], 'Winter is the coldest season — bundle up to keep your body heat in!'],
  ['Which would you pick for a HOT summer day?', 'shorts and a sun hat', ['a puffy snow coat', 'wool mittens', 'a thick scarf'], 'Summer is the hottest season — light clothes and shade keep you cool.'],
  ['Which is best for a RAINY spring day?', 'a raincoat and rain boots', ['a swimsuit', 'a winter parka', 'sandals and sunglasses'], 'Spring showers call for waterproof gear — then go find a puddle!'],
  ['What do many trees do in the FALL?', 'drop their leaves', ['grow watermelons', 'turn into pine trees', 'grow taller overnight'], 'Many trees let go of their leaves in fall and rest for winter.'],
  ['When do baby animals like chicks and bunnies usually arrive?', 'in the spring', ['in the winter', 'never', 'only at night'], 'Spring brings warmth and food — perfect timing for babies to be born.'],
  ['Which season has the LONGEST days of sunshine?', 'summer', ['winter', 'fall', 'none — all days are equal'], 'In summer the sun rises early and sets late — the longest days of the year.'],
  ['Which season has the SHORTEST days?', 'winter', ['summer', 'spring', 'they are all the same'], 'In winter the sun sets early — short days, long cozy nights.'],
  ['What happens to a pond on a freezing winter day?', 'the top can freeze into ice', ['it turns into juice', 'it gets warmer', 'it disappears forever'], 'When it is cold enough, the water on top freezes solid.'],
];

const C2_SKY_BANK = [
  ['Why do we have day and night?', 'Earth is always spinning', ['the sun turns off at night', 'clouds cover the sun', 'the moon pushes the sun away'], 'Earth spins like a top. When our side faces the sun it is day; when it spins away, night!'],
  ['How long does Earth take to spin around one time?', 'about one whole day', ['one minute', 'one year', 'one hour'], 'One full spin = one day and one night. That\'s why every day has both!'],
  ['What lights up the daytime sky?', 'the sun', ['the moon', 'streetlights', 'fireflies'], 'The sun gives Earth its daylight — and its warmth, too.'],
  ['What IS the sun?', 'a star — the closest one to Earth', ['a planet', 'a giant moon', 'a big lightbulb'], 'The sun is a star, just like the tiny night-sky stars — it only looks huge because it\'s the closest.'],
  ['When can you see the stars?', 'at night, when the sky is dark', ['only in summer', 'at lunchtime', 'never'], 'Stars shine all the time, but the bright daytime sky hides them until dark.'],
  ['The sun rises in the ___', 'east', ['west', 'north', 'south'], 'Every morning the sun comes up in the east and travels across the sky.'],
  ['The sun sets in the ___', 'west', ['east', 'north', 'south'], 'Every evening the sun goes down in the west. Rises east, sets west — every single day!'],
  ['Where does the moon\'s light really come from?', 'it reflects light from the sun', ['it makes its own fire', 'city lights', 'flashlights'], 'The moon is like a giant mirror bouncing sunlight down to us.'],
  ['What do we call the moon\'s changing shapes?', 'phases', ['faces', 'shadows', 'slices'], 'From thin sliver to full circle — the moon\'s shapes are called phases.'],
  ['Can you ever see the moon in the DAYTIME?', 'yes — sometimes!', ['no, never', 'only on your birthday', 'only in winter'], 'Look up on some mornings — the pale moon is up there in the blue sky!'],
  ['Which is CLOSEST to Earth?', 'the moon', ['the sun', 'the stars', 'another planet'], 'The moon is our nearest neighbor in space — that\'s why it looks so big.'],
  ['What pattern does the sun follow every day?', 'it rises, crosses the sky, and sets', ['it zigzags all around', 'it stays in one spot', 'it changes color to green'], 'Sunrise, across the sky, sunset — the same pattern every day, like clockwork.'],
];

const C2_SOUND_BANK = [
  ['What makes EVERY sound?', 'something vibrating — wiggling back and forth', ['something sleeping', 'something melting', 'something glowing'], 'All sounds start with a vibration. No wiggle, no sound!'],
  ['You pluck a guitar string. What is it doing while it makes sound?', 'vibrating super fast', ['freezing', 'growing longer', 'standing still'], 'The string wiggles back and forth so fast it looks blurry — that wiggle IS the sound.'],
  ['If you hit a drum HARDER, the sound gets...', 'louder', ['quieter', 'slower', 'invisible'], 'A bigger hit makes a bigger vibration — and a bigger vibration is LOUDER.'],
  ['If you tap a drum very gently, the sound is...', 'soft and quiet', ['super loud', 'higher than a whistle', 'silent forever'], 'A tiny tap makes a tiny vibration — a soft, quiet sound.'],
  ['A mouse squeak is a ___ sound.', 'high-pitched', ['low-pitched', 'heavy', 'square'], 'Small things vibrate fast, making HIGH sounds — squeak squeak!'],
  ['A big tuba or a lion\'s roar is a ___ sound.', 'low-pitched', ['high-pitched', 'tiny', 'pointy'], 'Big things vibrate slowly, making LOW, rumbly sounds.'],
  ['Which makes a LOWER sound: a giant drum or a tiny bell?', 'the giant drum', ['the tiny bell', 'they sound the same', 'neither makes sound'], 'Big = slow vibrations = low. Tiny = fast vibrations = high. The drum rumbles low.'],
  ['Sound travels through the air to your...', 'ears', ['elbows', 'shoes', 'hair'], 'Vibrations ride through the air into your ears — that\'s hearing!'],
  ['To make a rubber-band guitar LOUDER, you should...', 'pluck the band harder', ['whisper to it', 'put it in the fridge', 'close your eyes'], 'A harder pluck = a bigger vibration = a louder twang!'],
  ['Hum a song and touch your throat. What do you feel?', 'a buzzing vibration', ['nothing at all', 'cold water', 'your heartbeat only'], 'Your voice comes from vibrating vocal cords — you can feel the wiggle!'],
  ['Which is the SOFT, quiet sound?', 'a whisper', ['a fire truck siren', 'a thunder clap', 'a marching band'], 'A whisper uses a tiny vibration — that\'s why it\'s so quiet.'],
  ['Can sound travel through water?', 'yes — whales sing to each other underwater!', ['no, water blocks all sound', 'only on Tuesdays', 'only in bathtubs'], 'Sound travels through water even better than air — whale songs go for miles!'],
];

const C2_LIGHT_BANK = [
  ['Which of these makes its OWN light?', 'the sun', ['a mirror', 'the moon', 'a window'], 'The sun makes its own light. Mirrors, windows, and the moon only pass along or bounce light.'],
  ['Which ANIMAL makes its own light?', 'a firefly', ['a cat', 'a frog', 'an owl'], 'Fireflies blink with their own built-in light — living lanterns!'],
  ['What is a shadow?', 'a dark spot where light is blocked', ['a piece of night that fell off', 'spilled paint', 'a hole in the ground'], 'When something blocks light, it leaves a dark shape behind it — a shadow.'],
  ['What TWO things do you need to make a shadow?', 'light and something blocking it', ['water and sand', 'wind and rain', 'two flashlights only'], 'Light + a blocker = a shadow. No light, no shadow!'],
  ['What does a mirror do to light?', 'bounces it back (reflects it)', ['drinks it up', 'turns it into sound', 'makes it disappear forever'], 'Mirrors reflect light — that\'s how you see yourself in one.'],
  ['What is darkness?', 'no light', ['heavy air', 'black fog from space', 'sleeping sunshine'], 'Darkness isn\'t a thing — it\'s just what\'s left when there is no light.'],
  ['You hold a book in front of a flashlight. What appears on the wall?', 'the shadow of the book', ['a rainbow', 'a picture of the sun', 'nothing at all'], 'The book blocks the light, so a book-shaped shadow lands on the wall.'],
  ['Which lets light shine THROUGH it?', 'a clear window', ['a brick wall', 'a wooden door', 'a metal pan'], 'Clear things like glass let light pass right through — that\'s why windows work!'],
  ['Why is your shadow extra LONG in the early morning?', 'the sun is low in the sky', ['you grow taller in the morning', 'shadows are sleepy', 'the ground stretches'], 'A low sun stretches shadows long. At noon, with the sun high, they shrink!'],
  ['Why does the moon seem to glow?', 'it reflects the sun\'s light', ['it is full of lamps', 'it is on fire', 'it eats starlight'], 'Moonlight is really sunlight bouncing off the moon like a mirror.'],
  ['Your room is pitch dark. What helps you see?', 'turning on a lamp', ['opening your eyes wider', 'listening harder', 'waiting for the walls to glow'], 'Eyes need light to see — add light, and the room appears!'],
  ['A shiny spoon shows your face because it...', 'reflects light like a little mirror', ['remembers your face', 'takes photos', 'is magic'], 'Smooth, shiny things bounce light back — instant funny-face mirror!'],
];

const C2_MACHINE_ID = [
  ['A playground slide is which simple machine? 🛝', 'a ramp (inclined plane)', ['a pulley', 'a lever', 'a screw'], 'A slide is a slanted surface — an inclined plane for zooming down!'],
  ['A seesaw is which simple machine?', 'a lever', ['a screw', 'a pulley', 'a wedge'], 'A seesaw is a bar that tips on a middle point — a classic lever.'],
  ['The rope and wheel that raise a flag up a flagpole are a...', 'pulley', ['wedge', 'ramp', 'screw'], 'Pull DOWN on the rope, and the pulley lifts the flag UP!'],
  ['A wagon rolls using which simple machine?', 'wheels and axles', ['wedges', 'screws', 'pulleys'], 'Wheels spinning on rods (axles) make heavy loads easy to roll.'],
  ['A doorknob is secretly which simple machine?', 'a wheel and axle', ['a wedge', 'a pulley', 'an inclined plane'], 'Surprise! The knob is a wheel that turns a rod (axle) to open the latch.'],
  ['An axe that splits firewood is a...', 'wedge', ['pulley', 'lever', 'screw'], 'An axe has two slanted sides that push wood apart — that\'s a wedge.'],
  ['A doorstop that holds the door open is a...', 'wedge', ['pulley', 'wheel and axle', 'lever'], 'It slides under and jams tight — wedges hold things in place.'],
  ['The twisty lid on a jar works like a...', 'screw', ['lever', 'pulley', 'wheel and axle'], 'The lid\'s spiral threads are a ramp wrapped in a circle — a screw!'],
  ['The metal ramp into a moving truck is an...', 'inclined plane', ['axle', 'lever', 'pulley'], 'A slanted surface for sliding heavy boxes up — an inclined plane (ramp).'],
  ['A bottle opener that pries off a cap is a...', 'lever', ['screw', 'wedge', 'pulley'], 'It rests on a point and lifts with a push — lever power!'],
  ['The cord that pulls window blinds up and down uses a...', 'pulley', ['wedge', 'screw', 'ramp'], 'A little wheel up top redirects your pull — that\'s a pulley.'],
  ['Bicycle wheels are which simple machine? 🚲', 'wheels and axles', ['levers', 'wedges', 'screws'], 'Wheels spinning on axles turn your pedal-power into rolling speed.'],
  ['A lightbulb twists into its socket like a...', 'screw', ['wedge', 'lever', 'pulley'], 'Look at the bulb\'s bottom — spiral threads, just like a screw!'],
  ['The slanted wheelchair ramp into the library is an...', 'inclined plane', ['pulley', 'lever', 'wheel and axle'], 'A gentle slope instead of stairs — inclined planes make climbing easier.'],
];

const C2_MACHINE_PICK = [
  ['You need to lift the flag to the TOP of the tall pole. Which machine helps?', 'a pulley', ['a wedge', 'a doorstop', 'a screw'], 'A pulley lets you pull down-low to lift something up-high.'],
  ['You need to get a heavy box UP into a truck. Which helps most?', 'a ramp', ['a doorknob', 'a jar lid', 'a bell'], 'Sliding up a ramp is much easier than lifting straight up!'],
  ['The paint can lid is stuck tight. What should you use?', 'a lever (like a sturdy spoon handle)', ['a pillow', 'a straw', 'a sponge'], 'Pry with a lever — a small push becomes a strong lift.'],
  ['You must move heavy books across the room. Which helps?', 'a wagon with wheels', ['a doorstop', 'a flagpole', 'a whistle'], 'Rolling on wheels beats carrying — let the axles do the work!'],
  ['You want the door to STAY open on a windy day. Use a...', 'wedge (doorstop)', ['pulley', 'balloon', 'feather'], 'Slide a wedge under the door — it jams in place and holds tight.'],
  ['You need to split a big log for the campfire. Use a...', 'wedge (like an axe)', ['pulley', 'wheel', 'rope'], 'A wedge\'s slanted sides push the wood apart as it sinks in.'],
  ['You need to pull a bucket of water UP from a deep well. Use a...', 'pulley', ['doorstop', 'wedge', 'ramp'], 'A rope over a pulley wheel lifts the bucket smoothly up.'],
  ['A wheelchair needs to get up to the library door. Build a...', 'ramp', ['ladder', 'trampoline', 'rope swing'], 'A ramp is a gentle slope — smooth rolling instead of stairs.'],
  ['You want the jar lid to close super tight. Which machine idea keeps it snug?', 'the screw threads on the lid', ['a pulley on the lid', 'wheels on the jar', 'a seesaw'], 'Twisting the lid uses screw threads to squeeze it tighter and tighter.'],
  ['Your teacher needs the window blinds UP. What does the cord use?', 'a pulley', ['a wedge', 'a ramp', 'a wheelbarrow'], 'The cord runs over a tiny pulley wheel that lifts the blinds.'],
  ['You need to cut an apple into slices. The knife blade works like a...', 'wedge', ['pulley', 'wheel and axle', 'flagpole'], 'A blade is a thin wedge — it pushes the apple apart as it slides through.'],
  ['You need to move a heavy suitcase through the airport. Best plan?', 'roll it on its wheels', ['drag it with no wheels', 'push it up a wall', 'balance it on your head'], 'Wheels and axles turn a heavy drag into an easy roll!'],
];

const C2_SEED_BANK = [
  ['A dandelion seed has a fluffy white parachute. How does it travel?', 'the wind carries it', ['it digs underground', 'it swims', 'it rides a bike'], 'Whoosh! Wind lifts the fluffy parachute and plants dandelions far away.'],
  ['Maple seeds spin like tiny helicopters. What carries them?', 'the wind', ['trains', 'rivers only', 'moles'], 'Their wing shape catches the wind and twirls them to new ground.'],
  ['A prickly burr sticks to a dog\'s fur. How does the seed travel?', 'it hitches a ride on an animal', ['it melts into the fur', 'it flies with wings', 'it rolls uphill'], 'Velcro-style hooks grab fur, and the seed hops off somewhere new!'],
  ['A coconut falls into the ocean. How does it reach a new island?', 'it floats away on the water', ['a whale mails it', 'it sinks and walks', 'the wind blows it underwater'], 'Coconuts float! Waves carry them to new beaches where they sprout.'],
  ['A bird eats a berry and flies away. How does the seed travel?', 'it comes out in the bird\'s droppings far away', ['the bird plants it with a shovel', 'it stays in the bird forever', 'it turns into a feather'], 'The seed rides inside the bird, then gets dropped — with fertilizer included!'],
  ['A squirrel buries acorns and forgets some. What happens?', 'the forgotten acorns can grow into oak trees', ['the acorns turn into rocks', 'nothing ever happens', 'the acorns melt'], 'Forgetful squirrels are accidental tree planters!'],
  ['Why are many flowers bright and sweet-smelling?', 'to invite bees and butterflies to visit', ['to scare away rabbits', 'to look nice for photos', 'to catch rain'], 'Bright colors and sweet nectar say "Welcome, pollinators!"'],
  ['What does a bee carry from flower to flower?', 'pollen', ['honey jars', 'seeds in a backpack', 'water drops'], 'Pollen dust sticks to the bee\'s fuzzy body and rubs off at the next flower.'],
  ['Moving pollen flower-to-flower helps plants...', 'make seeds and fruit', ['grow legs', 'change color', 'stay awake'], 'Pollination is how flowers make the seeds for next year\'s plants!'],
  ['Which animals are famous POLLINATORS?', 'bees, butterflies, and hummingbirds', ['sharks, whales, and seals', 'wolves, bears, and foxes', 'worms, moles, and ants only'], 'Flower visitors with a taste for nectar do the pollen-moving work.'],
  ['Some seed pods POP open when ripe. What happens to the seeds?', 'the plant flings them away like popcorn', ['they crawl back inside', 'they turn into leaves', 'they whistle'], 'Pop! The pod bursts and shoots seeds away from the parent plant.'],
  ['A water lily\'s seeds drop into the pond. How do they travel?', 'they float on the water to new spots', ['they bounce like balls', 'frogs juggle them', 'they fly south'], 'Floating seeds drift across the pond and sprout along the edges.'],
];

const C2_CHAINS = [
  ['grass', 'rabbit', 'fox'],
  ['leaves', 'caterpillar', 'bird'],
  ['seaweed', 'little fish', 'shark'],
  ['grass', 'zebra', 'lion'],
  ['acorns', 'squirrel', 'hawk'],
  ['seeds', 'mouse', 'owl'],
  ['grass', 'grasshopper', 'frog'],
  ['plants', 'deer', 'wolf'],
];

// ------------------------------------------------------------
// SOCIAL STUDIES BANKS
// ------------------------------------------------------------
const C2_MAP_PLACES = [
  ['🏫', 'School'], ['🌳', 'Park'], ['📚', 'Library'], ['🏪', 'Store'],
  ['🏠', 'Home'], ['🚒', 'Fire Station'], ['🦆', 'Pond'],
];

const C2_FARM_BANK = [
  ['Who GROWS the wheat that becomes your bread?', 'a farmer', ['a teacher', 'a dentist', 'a pilot'], 'Bread starts in a farmer\'s wheat field long before it reaches your table.'],
  ['Where does milk begin its journey to the store?', 'at a dairy farm, from cows', ['at the milk factory tree', 'in the store\'s back room', 'from the ocean'], 'Cows on dairy farms give the milk that trucks carry to the store.'],
  ['Who mixes and bakes dough into bread to SELL?', 'a baker', ['a mail carrier', 'a lifeguard', 'a vet'], 'Bakers turn the farmer\'s flour into warm loaves — that\'s their job!'],
  ['What happens FIRST on an apple\'s trip to you?', 'a farmer picks it from the tree', ['the store puts it on a shelf', 'a truck delivers it', 'you crunch into it'], 'First picked, then trucked, then sold, then eaten. Yum!'],
  ['What happens LAST on milk\'s journey?', 'you buy it at the store and drink it', ['the cow gives milk', 'the truck drives it to town', 'the farm bottles it'], 'Farm → truck → store → YOU. You are the last stop!'],
  ['A person who MAKES or GROWS things to sell is called a...', 'producer', ['consumer', 'referee', 'tourist'], 'Producers make the goods — farmers, bakers, builders, and more.'],
  ['A person who BUYS and uses things is called a...', 'consumer', ['producer', 'inventor', 'conductor'], 'When you buy an apple and eat it, YOU are the consumer.'],
  ['Your wool sweater started its journey on a...', 'sheep', ['tree', 'rock', 'fish'], 'Sheep grow wool coats — shearing gives us yarn for warm sweaters!'],
  ['How do apples travel from far-away farms to your store?', 'trucks carry them', ['they roll down the highway by themselves', 'birds deliver them', 'they grow inside the store'], 'Trucks (and sometimes trains) move food from farms to stores every day.'],
  ['Who helps you check out and buy goods at the store?', 'a shopkeeper or cashier', ['a firefighter', 'an astronaut', 'a lifeguard'], 'Store workers sell the goods that producers made.'],
  ['Peanut butter starts as ___ growing on a farm.', 'peanuts', ['pencils', 'purple rocks', 'noodles'], 'Farmers grow peanuts; factories grind them into peanut butter.'],
  ['French fries start out as ___ in a farmer\'s field.', 'potatoes', ['french flags', 'ice cubes', 'crayons'], 'Potatoes are dug from the dirt, then washed, cut, and cooked. Fries!'],
];

const C2_TIME_ORDER = [
  ['a candle 🕯️', 'a lightbulb 💡'],
  ['a horse-drawn wagon 🐴', 'a car 🚗'],
  ['a handwritten letter ✉️', 'a video call 📱'],
  ['an icebox with real ice 🧊', 'a refrigerator ❄️'],
  ['a quill pen dipped in ink 🪶', 'a computer 💻'],
  ['a one-room schoolhouse 🏚️', 'a big school with many classrooms 🏫'],
  ['a washboard for scrubbing clothes 🪣', 'a washing machine 🧺'],
  ['riding a horse for a long trip 🐴', 'flying in an airplane ✈️'],
];

const C2_HISTORY_CLUES = [
  ['Which is a CLUE from the past?', 'your great-grandma\'s old diary', ['tomorrow\'s weather report', 'a brand-new toy', 'next year\'s calendar'], 'Old diaries, photos, and letters are clues that tell us how people lived long ago.'],
  ['What is a museum?', 'a place that keeps and shows things from long ago', ['a store for new video games', 'a kind of restaurant', 'a school for fish'], 'Museums protect old treasures so everyone can learn from them.'],
  ['Who can TELL you true stories about long ago?', 'grandparents who lived back then', ['a baby brother', 'a goldfish', 'a robot from the future'], 'People who lived in the past are walking, talking history books!'],
  ['What does a TIMELINE show?', 'events in order, from longest ago to today', ['how tall you are', 'the price of toys', 'tomorrow\'s lunch menu'], 'A timeline lines events up in order, like beads on a string.'],
  ['An old black-and-white photo of your town can show you...', 'how the town looked long ago', ['how the town will look next year', 'nothing at all', 'the town\'s favorite song'], 'Old photos freeze a moment from the past so we can peek back in time.'],
  ['Why do we study the past?', 'to learn how life changed and remember important people', ['to win prizes', 'because old things smell interesting', 'to make the past longer'], 'History helps us understand our world — and the people who built it.'],
];

const C2_SYMBOLS2 = [
  ['What is the capital city of the whole United States?', 'Washington, D.C.', ['New York City', 'Texas', 'Hollywood'], 'Washington, D.C. is where the president lives and Congress meets.'],
  ['What is our national anthem — the country\'s special song?', 'The Star-Spangled Banner', ['Twinkle, Twinkle, Little Star', 'Happy Birthday', 'Jingle Bells'], 'Francis Scott Key wrote it after watching a battle — now we sing it at big games!'],
  ['When we say the Pledge of Allegiance, we face the...', 'American flag', ['window', 'lunchroom', 'clock'], 'The Pledge is a promise of loyalty, spoken while facing the flag.'],
  ['Who is Uncle Sam?', 'a cartoon symbol of the United States', ['the first president\'s brother', 'a real mail carrier', 'a famous chef'], 'The tall-hatted "Uncle Sam" stands for the U.S. government in posters and cartoons.'],
  ['The Statue of Liberty was a birthday GIFT to America from which country?', 'France', ['Canada', 'Mexico', 'Australia'], 'France gave Lady Liberty in 1886 as a symbol of friendship and freedom.'],
  ['What does the Statue of Liberty hold high in her right hand?', 'a glowing torch', ['an ice cream cone', 'a baseball bat', 'an umbrella'], 'Her torch lights the way to freedom for people arriving by sea.'],
  ['In which city does the Liberty Bell live?', 'Philadelphia', ['Los Angeles', 'Chicago', 'Miami'], 'The Liberty Bell rang in Philadelphia, where independence was declared.'],
  ['Which is a nickname for the American flag?', 'the Stars and Stripes', ['the Dots and Squiggles', 'the Moon and Sun', 'the Red Rocket'], 'People also call it "Old Glory" — stars for states, stripes for the first colonies.'],
  ['Our national motto "In God We Trust" is printed on...', 'our coins and dollar bills', ['cereal boxes', 'street signs', 'sneakers'], 'Check a penny or a dollar — the motto is right there!'],
  ['What is the national FLOWER of the United States?', 'the rose', ['the dandelion', 'the cactus flower', 'the daisy'], 'The rose became the national flower in 1986.'],
  ['What happened on July 4, 1776?', 'America declared its independence', ['the first moon landing', 'the first baseball game', 'television was invented'], 'The Declaration of Independence made July 4 America\'s birthday!'],
  ['On the Great Seal, the bald eagle holds an olive branch. What does it stand for?', 'peace', ['snack time', 'rain', 'speed'], 'The olive branch means America hopes for peace; the arrows mean it can defend itself.'],
  ['Who is famous in legend for sewing an early American flag?', 'Betsy Ross', ['Amelia Earhart', 'Rosa Parks', 'Ruby Bridges'], 'The story says Betsy Ross stitched an early stars-and-stripes flag in Philadelphia.'],
];

// ------------------------------------------------------------
// SKILLS
// ------------------------------------------------------------
SKILLS.push(

  // ================= MATH =================

  // ----- PLACE VALUE deepeners -----
  {
    id: 'pv_words', strand: 'place', name: 'Number words', adaptive: true,
    gen: (lvl = 2) => {
      const n = lvl === 1 ? ri(11, 99) : lvl === 3 ? ri(101, 999) : ri(21, 399);
      if (ri(0, 1)) {
        return {
          prompt: `Write this number with digits:`,
          body: `<div class="bignum" style="font-size:34px">${c2NumberWord(n)}</div>`,
          type: 'num', answer: n,
          explain: `"${c2NumberWord(n)}" is written <b>${n}</b>. Listen for the hundreds, then the tens, then the ones.`,
        };
      }
      const { choices, answer } = mcSet(c2NumberWord(n), () => {
        const d = pick([n + 1, n - 1, n + 10, n - 10, n + 100, n - 100, Number(String(n).split('').reverse().join(''))]);
        return d >= 0 && d <= 999 && d !== n ? c2NumberWord(d) : null;
      });
      return {
        prompt: `How do you say <b>${n}</b> in words?`,
        type: 'mc', choices, answer, wide: true,
        explain: `${n} = <b>${c2NumberWord(n)}</b>. Say the hundreds first, then the tens and ones.`,
      };
    },
  },
  {
    id: 'pv_compare_true', strand: 'place', name: 'True number sentences', adaptive: true,
    gen: (lvl = 2) => {
      let a, b;
      if (lvl === 1) { a = ri(10, 99); b = ri(10, 99); }
      else if (lvl === 3) { a = ri(102, 987); b = Number(shuffle(String(a).split('')).join('')); }
      else { a = ri(100, 999); b = ri(100, 999); }
      while (b === a) b = a + pick([-1, 1, -10, 10]);
      if (b < 0 || b > 999) b = a - 1;
      const t = a > b;
      const answer = t ? `${a} > ${b}` : `${a} < ${b}`;
      const wrongs = [t ? `${a} < ${b}` : `${a} > ${b}`, `${a} = ${b}`, t ? `${b} > ${a}` : `${b} < ${a}`];
      return {
        prompt: `Which number sentence is TRUE?`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer,
        explain: `Compare hundreds first, then tens, then ones: ${Math.max(a, b)} is the bigger number. So <b>${answer}</b> is true — the open mouth always eats the bigger number!`,
      };
    },
  },
  {
    id: 'mental_jumps', strand: 'place', name: 'Mental math jumps', adaptive: true,
    gen: (lvl = 2) => {
      const plus = pick([true, false]);
      if (lvl === 1) {
        const jt = ri(1, 2);
        const t = plus ? ri(1, 9 - jt) : ri(jt + 1, 9);
        const o = ri(0, 9);
        const a = t * 10 + o, jump = jt * 10;
        const answer = plus ? a + jump : a - jump;
        return {
          prompt: `Solve it in your head — no pencil needed!`,
          body: `<div class="bignum">${a} ${plus ? '+' : '−'} ${jump} = ___</div>`,
          type: 'num', answer,
          explain: `Only the tens change! ${t} tens ${plus ? '+' : '−'} ${jt} ten${jt > 1 ? 's' : ''} = ${plus ? t + jt : t - jt} tens, and the ${o} ones stay put. Answer: <b>${answer}</b>.`,
        };
      }
      const kind = pick(['tens', 'tens', 'hundreds']);
      const jump = kind === 'tens' ? ri(1, lvl === 3 ? 5 : 3) * 10 : ri(1, lvl === 3 ? 4 : 2) * 100;
      const a = kind === 'tens'
        ? (plus ? ri(11, 899 - jump) : ri(jump + 11, 899))
        : (plus ? ri(105, 999 - jump) : ri(jump + 105, 999));
      const answer = plus ? a + jump : a - jump;
      const jumpWords = jump < 100 ? `${jump / 10} tens` : `${jump / 100} hundred${jump > 100 ? 's' : ''}`;
      return {
        prompt: `Solve it in your head — no pencil needed!`,
        body: `<div class="bignum">${a} ${plus ? '+' : '−'} ${jump} = ___</div>`,
        type: 'num', answer,
        explain: `Jump by ${jumpWords}: ${a} ${plus ? '+' : '−'} ${jump} = <b>${answer}</b>. Big jumps, tiny brain-work!`,
      };
    },
  },

  // ----- ADDITION deepeners -----
  {
    id: 'add_doubles', strand: 'add', name: 'Doubles & near doubles', adaptive: true,
    gen: (lvl = 2) => {
      const n = ri(2, lvl === 1 ? 9 : 12);
      const near = lvl !== 1 && ri(0, 1) === 1;
      const b = near ? n + 1 : n;
      return {
        prompt: near ? `Use the double you know to solve its neighbor!` : `Doubles time — you've got this!`,
        body: `<div class="bignum">${n} + ${b} = ___</div>`,
        type: 'num', answer: n + b,
        explain: near
          ? `Near double! First ${n} + ${n} = ${2 * n}, then one more makes <b>${n + b}</b>.`
          : `Double ${n}: ${n} + ${n} = <b>${2 * n}</b>. Knowing doubles makes math zoom!`,
      };
    },
  },
  {
    id: 'add_multi', strand: 'add', name: 'Add four 2-digit numbers', adaptive: true,
    gen: (lvl = 2) => {
      const cap = lvl === 1 ? 15 : lvl === 3 ? 30 : 22;
      const nums = [ri(10, cap), ri(10, cap), ri(10, cap), ri(10, cap)];
      const answer = nums.reduce((s, v) => s + v, 0);
      return {
        prompt: `Add all four! Tip: hunt for two ones-digits that make a friendly ten.`,
        body: `<div class="bignum">${nums.join(' + ')} = ___</div>`,
        type: 'num', answer,
        explain: `Add two at a time: ${nums[0]} + ${nums[1]} = ${nums[0] + nums[1]}, plus ${nums[2]} = ${nums[0] + nums[1] + nums[2]}, plus ${nums[3]} = <b>${answer}</b>.`,
      };
    },
  },

  // ----- COUNTING deepener -----
  {
    id: 'pattern_rule', strand: 'count', name: 'Find the pattern rule', adaptive: true,
    gen: (lvl = 2) => {
      const steps = lvl === 1 ? [2, 5, 10] : lvl === 3 ? [3, 4, 5, 10, 25] : [2, 3, 4, 5, 10];
      const step = pick(steps);
      const down = lvl === 1 ? false : pick([true, false, false]);
      const start = down ? ri(step * 4, step * 4 + 60) : ri(1, 40);
      const seq = [0, 1, 2, 3].map(i => down ? start - i * step : start + i * step);
      const answer = `${down ? 'Subtract' : 'Add'} ${step}`;
      const other = pick(steps.filter(s => s !== step));
      const wrongs = [`${down ? 'Add' : 'Subtract'} ${step}`, `${down ? 'Subtract' : 'Add'} ${other}`, `${down ? 'Add' : 'Subtract'} ${other}`];
      return {
        prompt: `What is the RULE of this pattern?`,
        body: `<div class="bignum">${seq.join(', ')}, …</div>`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer,
        explain: `From ${seq[0]} to ${seq[1]} is ${down ? 'down' : 'up'} ${step} — and every hop matches. The rule is <b>${answer}</b>.`,
      };
    },
  },

  // ----- GETTING READY TO MULTIPLY deepener -----
  {
    id: 'mult_rows', strand: 'mult', name: 'Rows, columns & totals', adaptive: true,
    gen: (lvl = 2) => {
      const r = ri(2, lvl === 1 ? 3 : 5), c = ri(2, lvl === 1 ? 4 : 5);
      const kind = lvl === 1 ? pick(['rows', 'cols']) : pick(['rows', 'cols', 'total', 'total']);
      if (kind === 'total') {
        return {
          prompt: `Skip count the rows! How many dots in ALL?`,
          body: arraySVG(r, c), wide: true,
          type: 'num', answer: r * c,
          explain: `${r} rows of ${c}: skip count ${Array.from({ length: r }, (_, i) => (i + 1) * c).join(', ')} — <b>${r * c}</b> dots.`,
        };
      }
      const rows = kind === 'rows';
      return {
        prompt: rows ? `How many ROWS does this array have? (Rows go side to side.)` : `How many dots are in EACH row?`,
        body: arraySVG(r, c), wide: true,
        type: 'num', answer: rows ? r : c,
        explain: rows ? `Count the lines of dots going across: <b>${r}</b> rows.` : `Count the dots in one line going across: <b>${c}</b> in each row.`,
      };
    },
  },

  // ----- GRAPHS & DATA: line plots (2.MD.9) -----
  {
    id: 'data_lineplot', strand: 'data', name: 'Read a line plot', adaptive: true,
    gen: (lvl = 2) => {
      const [thing, one, emoji] = pick([['leaves', 'leaf', '🍂'], ['pencils', 'pencil', '✏️'], ['ribbons', 'ribbon', '🎀'], ['worms', 'worm', '🪱']]);
      const unit = pick(['inches', 'centimeters']);
      const min = ri(1, 3), max = min + (lvl === 1 ? 3 : 4);
      const counts = {};
      let total = 0;
      for (let v = min; v <= max; v++) { counts[v] = ri(0, lvl === 1 ? 3 : 4); total += counts[v]; }
      for (let v = min; v <= max && total < 4; v++) { if (counts[v] < 3) { counts[v] += 2; total += 2; } }
      const plot = c2LinePlotSVG(min, max, counts, `Lengths of our ${thing} (${unit})`);
      const kind = lvl === 1 ? 'at' : pick(['at', 'at', 'total', 'most']);
      if (kind === 'most') {
        let bestV = min;
        for (let v = min; v <= max; v++) if (counts[v] > counts[bestV]) bestV = v;
        const tie = Object.keys(counts).filter(v => counts[v] === counts[bestV]).length > 1;
        if (!tie) {
          const vals = [];
          for (let v = min; v <= max; v++) vals.push(String(v));
          return {
            prompt: `The class measured ${thing} ${emoji} and made a line plot. Which length has the MOST X marks?`,
            body: plot, wide: true,
            type: 'mc', choices: vals, answer: String(bestV),
            explain: `The tallest stack of X marks sits over <b>${bestV}</b> — ${counts[bestV]} ${thing} were that long.`,
          };
        }
      }
      if (kind === 'total') {
        return {
          prompt: `The class measured ${thing} ${emoji} and made a line plot. How many ${thing} did they measure IN ALL?`,
          body: plot, wide: true,
          type: 'num', answer: total,
          explain: `Every X is one ${one}. Count all the X marks: <b>${total}</b>.`,
        };
      }
      const have = [];
      for (let v = min; v <= max; v++) if (counts[v] > 0) have.push(v);
      const v = pick(have);
      return {
        prompt: `The class measured ${thing} ${emoji} and made a line plot. How many ${thing} are exactly <b>${v} ${unit}</b> long?`,
        body: plot, wide: true,
        type: 'num', answer: counts[v],
        explain: `Each X above a number is one ${one}. Count the X marks over ${v}: <b>${counts[v]}</b>.`,
      };
    },
  },

  // ----- MEASUREMENT deepeners -----
  {
    id: 'meas_estimate', strand: 'meas', name: 'Estimate the length',
    gen: () => {
      const [item, a, d] = pick(C2_ESTIMATE_BANK);
      return {
        prompt: `ESTIMATE! About how long (or tall) is <b>${item}</b>?`,
        type: 'mc', choices: shuffle([a, ...d]), answer: a,
        explain: `A smart guess for ${item} is about <b>${a}</b>. Picture it next to a ruler — does the size make sense?`,
      };
    },
  },
  {
    id: 'meas_two_units', strand: 'meas', name: 'Two units, one object',
    gen: () => {
      if (ri(0, 1)) {
        const [q, a, d, why] = pick(C2_TWO_UNIT_FACTS);
        return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
      }
      const obj = pick(['a table', 'your desk', 'a jump rope', 'the classroom door', 'a garden bench', 'a skateboard']);
      const [small, big] = pick([['centimeters', 'inches'], ['inches', 'feet'], ['centimeters', 'meters']]);
      const name = pick(NAMES);
      const answer = `more ${small} than ${big}`;
      return {
        prompt: `${name} measures <b>${obj}</b> twice — once in ${big}, once in ${small}. Which count comes out BIGGER?`,
        type: 'mc', choices: shuffle([answer, `more ${big} than ${small}`, `exactly the same number`]), answer,
        explain: `${small[0].toUpperCase() + small.slice(1)} are smaller than ${big}, so it takes MORE of them to cover ${obj}. Smaller unit → bigger count!`,
      };
    },
  },
  {
    id: 'meas_word', strand: 'meas', name: 'Length story problems', adaptive: true,
    gen: (lvl = 2) => {
      const unit = pick(['inches', 'centimeters', 'feet', 'meters']);
      const name = pick(NAMES);
      const hi = lvl === 1 ? 20 : lvl === 3 ? 90 : 50;
      const kind = pick(['cut', 'join', 'grow']);
      if (kind === 'join') {
        const a = ri(lvl === 1 ? 4 : 10, hi), b = ri(lvl === 1 ? 3 : 8, hi);
        return {
          prompt: `${name} tapes a <b>${a} ${unit}</b> paper chain to a <b>${b} ${unit}</b> chain. How long is the whole chain now?`,
          type: 'num', answer: a + b, suffix: ` ${unit}`,
          explain: `Joining means we ADD: ${a} + ${b} = <b>${a + b} ${unit}</b>.`,
        };
      }
      if (kind === 'grow') {
        const start = ri(lvl === 1 ? 4 : 10, hi), grew = ri(2, lvl === 1 ? 10 : 25);
        return {
          prompt: `${name}'s bean plant was <b>${start} ${unit}</b> tall. It grew <b>${grew} ${unit}</b> more! How tall is it now?`,
          type: 'num', answer: start + grew, suffix: ` ${unit}`,
          explain: `Growing means we ADD: ${start} + ${grew} = <b>${start + grew} ${unit}</b>.`,
        };
      }
      const a = ri(lvl === 1 ? 6 : 12, hi), b = ri(3, a - 2);
      return {
        prompt: `${name}'s ribbon is <b>${a} ${unit}</b> long. ${name} snips off <b>${b} ${unit}</b> to wrap a gift. How much ribbon is left?`,
        type: 'num', answer: a - b, suffix: ` ${unit}`,
        explain: `Snipping off means we SUBTRACT: ${a} − ${b} = <b>${a - b} ${unit}</b>.`,
      };
    },
  },

  // ----- MONEY: story problems (2.MD.8) -----
  {
    id: 'money_word', strand: 'money', name: 'Money story problems', adaptive: true,
    gen: (lvl = 2) => {
      const name = pick(NAMES);
      const kind = lvl === 1 ? pick(['pocket', 'pocket', 'need']) : pick(['pocket', 'need', 'spend']);
      if (kind === 'pocket') {
        let q = ri(0, 2), d = ri(0, 3), n = ri(0, 2), p = ri(0, 4);
        if (q + d + n + p < 2) { q = 1; d = 1; }
        const total = q * 25 + d * 10 + n * 5 + p;
        const parts = [];
        if (q) parts.push(`${q} quarter${q > 1 ? 's' : ''}`);
        if (d) parts.push(`${d} dime${d > 1 ? 's' : ''}`);
        if (n) parts.push(`${n} nickel${n > 1 ? 's' : ''}`);
        if (p) parts.push(`${p} penn${p > 1 ? 'ies' : 'y'}`);
        const listText = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
        const steps = [];
        if (q) steps.push(`quarters ${q * 25}¢`);
        if (d) steps.push(`dimes ${d * 10}¢`);
        if (n) steps.push(`nickels ${n * 5}¢`);
        if (p) steps.push(`pennies ${p}¢`);
        return {
          prompt: `${name}'s piggy bank holds <b>${listText}</b>. How many cents is that in all?`,
          type: 'num', answer: total, suffix: '¢',
          explain: `Count the big coins first: ${steps.join(' + ')} = <b>${total}¢</b>.`,
        };
      }
      if (kind === 'need') {
        const cost = ri(40, 95), gap = ri(5, 25);
        const have = cost - gap;
        return {
          prompt: `A sticker pack costs <b>${cost}¢</b>. ${name} has <b>${have}¢</b>. How many MORE cents does ${name} need?`,
          type: 'num', answer: gap, suffix: '¢',
          explain: `Count up from ${have} to ${cost}: that's <b>${gap}¢</b> more. (${cost} − ${have} = ${gap})`,
        };
      }
      const have = ri(50, 99), cost = ri(10, have - 5);
      return {
        prompt: `${name} has <b>${have}¢</b> and buys a bouncy ball for <b>${cost}¢</b>. How much money is left?`,
        type: 'num', answer: have - cost, suffix: '¢',
        explain: `Spending means we SUBTRACT: ${have} − ${cost} = <b>${have - cost}¢</b> left.`,
      };
    },
  },

  // ----- TIME: story problems -----
  {
    id: 'time_word', strand: 'time', name: 'Time story problems', adaptive: true,
    gen: (lvl = 2) => {
      const fmt = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
      const act = pick(['Art class', 'Soccer practice', 'The movie', 'Swim lesson', 'The birthday party', 'Story time']);
      const h = ri(1, 10), m = lvl === 1 ? 0 : pick([0, 30]);
      const durOpts = lvl === 1 ? [[1, 0], [2, 0]] : lvl === 3 ? [[0, 30], [1, 0], [1, 30], [2, 0]] : [[0, 30], [1, 0], [2, 0]];
      const [dh, dm] = pick(durOpts);
      let eh = h + dh, em = m + dm;
      if (em >= 60) { em -= 60; eh += 1; }
      if (eh > 12) eh -= 12;
      const correct = fmt(eh, em);
      const durText = dh === 0 ? `${dm} minutes` : dm === 0 ? `${dh} hour${dh > 1 ? 's' : ''}` : `${dh} hour${dh > 1 ? 's' : ''} and ${dm} minutes`;
      const { choices, answer } = mcSet(correct, () => {
        let wh = eh + pick([-1, 0, 1]);
        if (wh < 1) wh += 12;
        if (wh > 12) wh -= 12;
        const w = fmt(wh, pick([0, 30]));
        return w === correct ? null : w;
      });
      return {
        prompt: `${act} starts at <b>${fmt(h, m)}</b> and lasts <b>${durText}</b>. What time does it end?`,
        type: 'mc', choices, answer,
        explain: `Start at ${fmt(h, m)} and count on ${durText}: you land on <b>${correct}</b>.`,
      };
    },
  },

  // ----- SHAPES & FRACTIONS deepeners (2.G.2, 2.G.3, 2.G.1) -----
  {
    id: 'geo_equal', strand: 'geo', name: 'Equal shares',
    gen: () => {
      const n = pick([2, 3, 4]);
      const names = { 2: 'halves', 3: 'thirds', 4: 'fourths' };
      if (ri(0, 1)) {
        const equal = pick([true, false]);
        const body = equal
          ? (ri(0, 1) ? fractionSVG(n, 0, 'circle') : c2PartsRectSVG(Array(n).fill(1 / n)))
          : c2PartsRectSVG(pick(C2_UNEQUAL_CUTS[n]));
        const yes = 'yes — equal shares', no = 'no — the parts are different sizes';
        return {
          prompt: `This shape is cut into ${n} parts. Are they EQUAL shares?`,
          body, type: 'mc', choices: [yes, no], answer: equal ? yes : no,
          explain: equal
            ? `Every part is exactly the same size — <b>equal shares</b>! ${n} equal shares are called ${names[n]}.`
            : `Some parts are bigger than others, so they are <b>not equal shares</b>. Fair shares must match exactly!`,
        };
      }
      return {
        prompt: `This shape is cut into <b>${n} equal shares</b>. What is each share called?`,
        body: fractionSVG(n, 0, pick(['circle', 'rect'])),
        type: 'mc', choices: ['halves', 'thirds', 'fourths'], answer: names[n],
        explain: `${n} equal shares = <b>${names[n]}</b>. Remember: 2 → halves, 3 → thirds, 4 → fourths.`,
      };
    },
  },
  {
    id: 'geo_partition', strand: 'geo', name: 'Squares in a rectangle', adaptive: true,
    gen: (lvl = 2) => {
      const r = ri(2, lvl === 1 ? 3 : 5), c = ri(2, lvl === 1 ? 4 : 5);
      if (ri(0, 3) === 0) {
        return {
          prompt: `This rectangle is cut into same-size squares. How many ROWS of squares are there?`,
          body: c2GridRectSVG(r, c), wide: true,
          type: 'num', answer: r,
          explain: `Count the rows going across: <b>${r}</b> rows, each with ${c} squares.`,
        };
      }
      return {
        prompt: `This rectangle is cut into same-size squares. How many squares COVER it in all?`,
        body: c2GridRectSVG(r, c), wide: true,
        type: 'num', answer: r * c,
        explain: `Count row by row: ${r} rows of ${c} squares — ${Array.from({ length: r }, (_, i) => (i + 1) * c).join(', ')} — <b>${r * c}</b> squares.`,
      };
    },
  },
  {
    id: 'geo_faces', strand: 'geo', name: 'Faces & corners of solids',
    gen: () => {
      if (ri(0, 1)) {
        const [q, a, why] = pick(C2_SOLID_COUNTS);
        return { prompt: q, type: 'num', answer: a, explain: why };
      }
      const [q, a, d, why] = pick(C2_SOLID_FACTS);
      return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
    },
  },

  // ================= ELA =================

  {
    id: 'ela_irreg_plural', strand: 'spell', name: 'Tricky plurals',
    gen: () => {
      const [one, many, wrongs, rule] = pick(C2_IRREG_PLURALS);
      return {
        prompt: `One <b>${one}</b>, but two ... ?`,
        type: 'mc', choices: shuffle([many, ...wrongs]), answer: many,
        explain: `${one} → <b>${many}</b>. This word ${rule} — no plain -s allowed!`,
      };
    },
  },
  {
    id: 'ela_contraction_expand', strand: 'spell', name: 'Un-squeeze the contraction',
    gen: () => {
      const [short, long, wrongs] = pick(C2_CONTRACTION_X);
      return {
        prompt: `Un-squeeze it! <b>${short}</b> is short for which two words?`,
        type: 'mc', choices: shuffle([long, ...wrongs]), answer: long,
        explain: `<b>${short}</b> = <b>${long}</b>. The apostrophe (') holds the spot where letters squeezed out.`,
      };
    },
  },
  {
    id: 'ela_collective', strand: 'grammar', name: 'Group words (collective nouns)',
    gen: () => {
      const [group, things, wrongs] = pick(C2_COLLECTIVE);
      if (ri(0, 1)) {
        return {
          prompt: `Fill in the group word: a <b>___</b> of ${things}`,
          type: 'mc', choices: shuffle([group, ...wrongs]), answer: group,
          explain: `A group of ${things} is called a <b>${group}</b>. Group words like this are called collective nouns!`,
        };
      }
      const otherThings = shuffle(C2_COLLECTIVE.filter(c => c[0] !== group).map(c => c[1])).slice(0, 3);
      return {
        prompt: `A <b>${group}</b> is a group of ... ?`,
        type: 'mc', choices: shuffle([things, ...otherThings]), answer: things,
        explain: `A <b>${group}</b> is a group of <b>${things}</b> — one word for the whole gang!`,
      };
    },
  },
  {
    id: 'ela_reflexive', strand: 'grammar', name: 'The -self words',
    gen: () => {
      const [sent, answer, wrongs] = pick(C2_REFLEXIVE);
      return {
        prompt: `Pick the word that fits:`,
        body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent}"</div>`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer, wide: true,
        explain: `The -self word must MATCH who did it: <b>${answer}</b>. (I → myself, you → yourself, he → himself, she → herself, it → itself, we → ourselves, they → themselves.)`,
      };
    },
  },
  {
    id: 'ela_adverb', strand: 'grammar', name: 'Adverbs (how, when, where)',
    gen: () => {
      if (ri(0, 1)) {
        const [sent, answer, wrongs] = pick(C2_ADVERB_FIND);
        return {
          prompt: `Find the ADVERB — the word that tells how, when, or where:`,
          body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent}"</div>`,
          type: 'mc', choices: shuffle([answer, ...wrongs]), answer, wide: true,
          explain: `<b>${answer}</b> tells HOW, WHEN, or WHERE it happened — that's the adverb's job. Many adverbs end in -ly!`,
        };
      }
      const [sent, answer, wrong, why] = pick(C2_ADV_OR_ADJ);
      return {
        prompt: `Adjective or adverb? Pick the word that fits:`,
        body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent.replace('___', '<span style="color:var(--coral)">___</span>')}"</div>`,
        type: 'mc', choices: shuffle([answer, wrong]), answer, wide: true,
        explain: why,
      };
    },
  },
  {
    id: 'ela_er_est', strand: 'grammar', name: 'Compare with -er and -est',
    gen: () => {
      const [sent, answer, wrongs, why] = pick(C2_ER_EST);
      return {
        prompt: `Pick the word that fits:`,
        body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent.replace('___', '<span style="color:var(--coral)">___</span>')}"</div>`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer, wide: true,
        explain: `${why} The answer is <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'ela_past_tense', strand: 'grammar', name: 'Yesterday words (past tense)',
    gen: () => {
      const [sent, answer, wrongs] = pick(C2_PAST_TENSE);
      return {
        prompt: `These verbs are shape-shifters! Pick the past-tense word:`,
        body: `<div style="font-family:var(--font-display);font-size:25px;font-weight:600">"${sent.replace('___', '<span style="color:var(--coral)">___</span>')}"</div>`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer, wide: true,
        explain: `This verb doesn't take -ed — it changes its whole shape: <b>${answer}</b>. Tricky verbs like this just have to be remembered!`,
      };
    },
  },
  {
    id: 'ela_shades', strand: 'vocab', name: 'Shades of meaning',
    gen: () => {
      const set = pick(C2_SHADES);
      const strongest = ri(0, 1) === 1;
      const answer = strongest ? set[2] : set[0];
      return {
        prompt: `<b>${set.join(' · ')}</b><br>These words are cousins! Which one is the <b>${strongest ? 'STRONGEST' : 'gentlest (weakest)'}</b>?`,
        type: 'mc', choices: shuffle(set.slice()), answer,
        explain: `They grow in power: ${set[0]} → ${set[1]} → ${set[2]}. The ${strongest ? 'strongest' : 'gentlest'} is <b>${answer}</b>. Great writers pick just the right shade!`,
      };
    },
  },
  {
    id: 'ela_abc2', strand: 'vocab', name: 'ABC order: second letter',
    gen: () => {
      const pool = pick(C2_ABC2_POOLS);
      const words = shuffle(pool).slice(0, 4);
      const sorted = words.slice().sort();
      const wantFirst = ri(0, 1) === 1;
      const answer = wantFirst ? sorted[0] : sorted[sorted.length - 1];
      return {
        prompt: `These words ALL start with "${words[0][0]}"! Which comes <b>${wantFirst ? 'FIRST' : 'LAST'}</b> in ABC order?`,
        type: 'mc', choices: words, answer,
        explain: `First letters tie, so peek at the SECOND letter of each word. In order: ${sorted.join(' → ')}. ${wantFirst ? 'First' : 'Last'}: <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'ela_dictionary', strand: 'vocab', name: 'Dictionary guide words',
    gen: () => {
      const L = C2_DICT_WORDS;
      const i = ri(1, L.length - 8);
      const k = i + ri(2, 5);
      const j = ri(i + 1, k - 1);
      const inside = L[j], gA = L[i], gB = L[k];
      const outside = shuffle(L.filter((w, idx) => idx < i || idx > k)).slice(0, 3);
      return {
        prompt: `Dictionary detective! The guide words on the page are <b>${gA}</b> and <b>${gB}</b>. Which word lives on that page?`,
        type: 'mc', choices: shuffle([inside, ...outside]), answer: inside,
        explain: `Guide words show the FIRST and LAST word on a dictionary page. In ABC order, <b>${inside}</b> comes between ${gA} and ${gB}, so it's on this page!`,
      };
    },
  },

  // ================= SCIENCE =================

  {
    id: 'sci_season_id', strand: 'sci_seasons', name: 'Which season is it?',
    gen: () => {
      const [clue, season] = pick(C2_SEASON_CLUES);
      return {
        prompt: `${clue}<br>Which season is it?`,
        type: 'mc', choices: ['winter', 'spring', 'summer', 'fall'], answer: season,
        explain: `Those are <b>${season}</b> clues! Each season has its own look, weather, and busy animals.`,
      };
    },
  },
  {
    id: 'sci_season_next', strand: 'sci_seasons', name: 'The season cycle',
    gen: () => {
      if (ri(0, 2) === 0) {
        const [q, a, d, why] = pick(C2_SEASON_DRESS);
        return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
      }
      const seasons = ['winter', 'spring', 'summer', 'fall'];
      const i = ri(0, 3);
      const after = ri(0, 1) === 1;
      const answer = after ? seasons[(i + 1) % 4] : seasons[(i + 3) % 4];
      return {
        prompt: `The seasons go around like a wheel. Which season comes right <b>${after ? 'AFTER' : 'BEFORE'}</b> ${seasons[i]}?`,
        type: 'mc', choices: seasons.slice(), answer,
        explain: `The cycle never changes: winter → spring → summer → fall → and back to winter! ${after ? 'After' : 'Before'} ${seasons[i]} comes <b>${answer}</b>.`,
      };
    },
  },
  { id: 'sci_sky', strand: 'sci_seasons', name: 'Sun, moon & stars', gen: () => c2BankQ(C2_SKY_BANK) },
  { id: 'sci_sound', strand: 'sci_energy', name: 'Sound starts with a wiggle', gen: () => c2BankQ(C2_SOUND_BANK) },
  { id: 'sci_light', strand: 'sci_energy', name: 'Light & shadows', gen: () => c2BankQ(C2_LIGHT_BANK) },
  { id: 'sci_machine_id', strand: 'sci_machines', name: 'Name that machine', gen: () => c2BankQ(C2_MACHINE_ID) },
  { id: 'sci_machine_pick', strand: 'sci_machines', name: 'Pick the right machine', gen: () => c2BankQ(C2_MACHINE_PICK) },
  { id: 'sci_seed_travel', strand: 'life', name: 'How seeds travel', gen: () => c2BankQ(C2_SEED_BANK) },
  {
    id: 'sci_chain_order', strand: 'habitats', name: 'Food chains in order',
    gen: () => {
      const chain = pick(C2_CHAINS);
      const [plant, mid, top] = chain;
      const kind = pick(['first', 'eats', 'food']);
      const arrow = `${plant} → ${mid} → ${top}`;
      if (kind === 'first') {
        return {
          prompt: `Here is a food chain: <b>${arrow}</b><br>Which one is the PRODUCER — the living thing that makes its own food from sunlight?`,
          type: 'mc', choices: shuffle(chain.slice()), answer: plant,
          explain: `Food chains always start with a plant. <b>${plant[0].toUpperCase() + plant.slice(1)}</b> makes food from sunlight — the producer!`,
        };
      }
      if (kind === 'eats') {
        const outsider = pick(C2_CHAINS.filter(c => c !== chain).map(c => c[2]).filter(t => !chain.includes(t)));
        return {
          prompt: `In this food chain — <b>${arrow}</b> — who EATS the ${mid}?`,
          type: 'mc', choices: shuffle([top, plant, outsider]), answer: top,
          explain: `Follow the arrow after ${mid}: the <b>${top}</b> eats it. The arrow means "gets eaten by"!`,
        };
      }
      const outsider = pick(C2_CHAINS.filter(c => c !== chain).map(c => c[0]).filter(t => !chain.includes(t)));
      return {
        prompt: `In this food chain — <b>${arrow}</b> — what does the ${mid} eat?`,
        type: 'mc', choices: shuffle([plant, top, outsider]), answer: plant,
        explain: `Look at the arrow before ${mid}: it eats <b>${plant}</b>. Energy flows plant → plant-eater → hunter.`,
      };
    },
  },

  // ================= SOCIAL STUDIES =================

  {
    id: 'soc_grid_map', strand: 'soc_maps', name: 'Neighborhood map walk',
    gen: () => {
      const places = shuffle(C2_MAP_PLACES).slice(0, 5);
      const A = { r: ri(0, 2), c: ri(0, 2) };
      const sameRow = ri(0, 1) === 1;
      const B = sameRow
        ? { r: A.r, c: pick([0, 1, 2].filter(c => c !== A.c)) }
        : { r: pick([0, 1, 2].filter(r => r !== A.r)), c: A.c };
      const free = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r !== A.r && c !== A.c) free.push({ r, c });
      const others = shuffle(free).slice(0, 3);
      const cells = {};
      cells[A.r + ',' + A.c] = places[0];
      cells[B.r + ',' + B.c] = places[1];
      others.forEach((p, i) => { cells[p.r + ',' + p.c] = places[2 + i]; });
      const dir = sameRow ? (B.c > A.c ? 'east' : 'west') : (B.r > A.r ? 'south' : 'north');
      const screenWord = { north: 'up', south: 'down', east: 'right', west: 'left' }[dir];
      const map = c2MapSVG(cells);
      if (ri(0, 1)) {
        return {
          prompt: `Start at the <b>${places[0][1]}</b> ${places[0][0]}. Which direction do you go to reach the <b>${places[1][1]}</b> ${places[1][0]}?`,
          body: map, wide: true,
          type: 'mc', choices: ['north', 'south', 'east', 'west'], answer: dir,
          explain: `Check the compass rose: N is up. The ${places[1][1]} is ${screenWord} of the ${places[0][1]} on the map — that's <b>${dir}</b>!`,
        };
      }
      return {
        prompt: `Look at the map. Which place is <b>${dir.toUpperCase()}</b> of the ${places[0][1]} ${places[0][0]}?`,
        body: map, wide: true,
        type: 'mc', choices: shuffle(places.slice(1).map(p => p[1])), answer: places[1][1],
        explain: `On a map, ${dir} means ${screenWord}. Slide ${screenWord} from the ${places[0][1]} and you land on the <b>${places[1][1]}</b>!`,
      };
    },
  },
  { id: 'soc_producers', strand: 'soc_econ', name: 'From the farm to you', gen: () => c2BankQ(C2_FARM_BANK) },
  {
    id: 'soc_timeline', strand: 'soc_time', name: 'Time detectives',
    gen: () => {
      if (ri(0, 1)) {
        const [q, a, d, why] = pick(C2_HISTORY_CLUES);
        return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
      }
      const [older, newer] = pick(C2_TIME_ORDER);
      const wantOlder = ri(0, 1) === 1;
      const answer = wantOlder ? older : newer;
      return {
        prompt: `Which came <b>${wantOlder ? 'FIRST, long ago' : 'LATER in history'}</b>?`,
        type: 'mc', choices: shuffle([older, newer, 'they appeared at the same time']), answer,
        explain: `People used ${older} long before ${newer} was invented. ${wantOlder ? 'First' : 'Later'} came <b>${answer}</b>!`,
      };
    },
  },
  { id: 'soc_symbols_deep', strand: 'soc_symbols', name: 'Symbols superstar', gen: () => c2BankQ(C2_SYMBOLS2) },
);
