/* ============================================================
   LEARNING GARDEN — Science (2nd grade)
   Matter, forces & magnets, plants & animals, habitats,
   earth & weather. Modeled on IXL grade-2 science categories.
   ============================================================ */

STRANDS.push(
  { id: 'matter', subject: 'science', name: 'Matter & Materials', emoji: '🧊', color: 'var(--sky)',
    lesson: `<p><b>Everything around you is made of matter, and it comes in three states:</b></p>
      <table class="cheat-table">
        <tr><th>State</th><th>What it does</th><th>Examples</th></tr>
        <tr><td><b>Solid</b> 🧱</td><td>keeps its own shape</td><td>rock, ice, pencil, toy</td></tr>
        <tr><td><b>Liquid</b> 💧</td><td>flows and takes the shape of its container</td><td>water, milk, juice</td></tr>
        <tr><td><b>Gas</b> 💨</td><td>spreads out to fill all the space</td><td>air, steam, bubbles' insides</td></tr>
      </table>
      <p style="margin-top:10px;font-weight:700"><b>Heat changes states!</b> Heating: ice <b>melts</b> → water <b>evaporates</b> → steam. Cooling: steam <b>condenses</b> → water <b>freezes</b> → ice. ♻️</p>` },
  { id: 'forces', subject: 'science', name: 'Forces & Magnets', emoji: '🧲', color: 'var(--coral)',
    lesson: `<p><b>A force is a push or a pull.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Push</b> = moving something AWAY from you (kicking a ball ⚽).</li>
        <li><b>Pull</b> = moving something TOWARD you (a wagon 🛷).</li>
        <li>A bigger push makes things go faster and farther. Heavier things need bigger pushes!</li>
        <li><b>Magnets</b> pull things made of iron or steel — paperclips yes 📎, plastic and wood no.</li>
        <li>Magnets have two ends called <b>poles</b>. Opposite poles <b>attract</b> (snap together), matching poles <b>repel</b> (push apart)!</li>
      </ul>` },
  { id: 'life', subject: 'science', name: 'Plants & Animals', emoji: '🐛', color: 'var(--leaf)',
    lesson: `<p><b>Living things grow, eat, and make more of themselves.</b> A rock never gets hungry!</p>
      <p style="font-weight:700;margin:8px 0">Animal groups:</p>
      <table class="cheat-table">
        <tr><th>Group</th><th>Clues</th><th>Examples</th></tr>
        <tr><td><b>Mammals</b></td><td>fur or hair, drink milk as babies</td><td>dog, whale, bat</td></tr>
        <tr><td><b>Birds</b></td><td>feathers, lay eggs</td><td>eagle, penguin</td></tr>
        <tr><td><b>Fish</b></td><td>gills, live in water</td><td>goldfish, shark</td></tr>
        <tr><td><b>Reptiles</b></td><td>dry scales</td><td>snake, turtle</td></tr>
        <tr><td><b>Amphibians</b></td><td>start in water, smooth wet skin</td><td>frog, salamander</td></tr>
        <tr><td><b>Insects</b></td><td>6 legs, 3 body parts</td><td>ant, butterfly</td></tr>
      </table>
      <p style="font-weight:700;margin-top:10px">Plant parts each have a job: <b>roots</b> drink water, the <b>stem</b> carries it up, <b>leaves</b> make food from sunlight, <b>flowers</b> make seeds!</p>` },
  { id: 'habitats', subject: 'science', name: 'Habitats & Food Chains', emoji: '🏜️', color: 'var(--cocoa)',
    lesson: `<p><b>A habitat is an animal's home neighborhood</b> — it must have food, water, and shelter.</p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>🏜️ <b>Desert</b>: hot & dry — camels, lizards, cactuses</li>
        <li>🧊 <b>Arctic</b>: freezing — polar bears, penguins (South!), seals</li>
        <li>🌳 <b>Forest</b>: trees everywhere — deer, squirrels, owls</li>
        <li>🌊 <b>Ocean</b>: salt water — sharks, whales, coral</li>
        <li>🌾 <b>Grassland</b>: open and grassy — lions, zebras, giraffes</li>
        <li>🌧️ <b>Rainforest</b>: warm and wet — monkeys, parrots, tree frogs</li>
      </ul>
      <p style="font-weight:700">A <b>food chain</b> shows who eats what. It always starts with a <b>producer</b> (a plant that makes its own food from sunlight ☀️). Animals are <b>consumers</b> — they eat plants or other animals.</p>` },
  { id: 'earth', subject: 'science', name: 'Earth & Weather', emoji: '🌦️', color: 'var(--sun)',
    lesson: `<p><b>Weather is what the sky is doing today.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Precipitation</b> = water falling from clouds: rain 🌧️, snow ❄️, sleet, hail 🧊.</li>
        <li>A <b>thermometer</b> measures temperature. Higher number = hotter!</li>
        <li>Severe weather: <b>blizzard</b> = giant snowstorm, <b>tornado</b> = spinning funnel of wind, <b>hurricane</b> = huge ocean storm with wind and rain.</li>
        <li>Earth changes FAST with earthquakes 🌍 and volcanoes 🌋, and SLOWLY with erosion (wind and water carrying tiny bits of land away, grain by grain).</li>
        <li>Help the Earth: <b>Reduce</b> (use less), <b>Reuse</b> (use again), <b>Recycle</b> (turn into something new) ♻️</li>
      </ul>` },
);

// ------------------------------------------------------------
// widgets
// ------------------------------------------------------------
function thermometerSVG(temp) {
  // temp 0..100 F
  const H = 260, W = 120, tubeX = 46, tubeW = 28, top = 20, bottom = 200;
  const y = bottom - (temp / 100) * (bottom - top);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="120" role="img">`;
  s += `<rect x="${tubeX}" y="${top - 6}" width="${tubeW}" height="${bottom - top + 12}" rx="14" fill="#FFFDF4" stroke="#33302B" stroke-width="4"/>`;
  s += `<circle cx="${tubeX + tubeW / 2}" cy="${bottom + 26}" r="24" fill="#FF6B57" stroke="#33302B" stroke-width="4"/>`;
  s += `<rect x="${tubeX + 7}" y="${y}" width="${tubeW - 14}" height="${bottom + 10 - y}" rx="7" fill="#FF6B57"/>`;
  for (let t = 0; t <= 100; t += 10) {
    const ty = bottom - (t / 100) * (bottom - top);
    const major = t % 20 === 0;
    s += `<line x1="${tubeX - (major ? 12 : 7)}" y1="${ty}" x2="${tubeX}" y2="${ty}" stroke="#33302B" stroke-width="3"/>`;
    if (major) s += `<text x="${tubeX - 16}" y="${ty + 5}" text-anchor="end" font-size="13" font-weight="800" font-family="Nunito, sans-serif" fill="#33302B">${t}</text>`;
  }
  s += `<text x="${tubeX + tubeW + 8}" y="${top + 8}" font-size="13" font-weight="800" font-family="Nunito, sans-serif" fill="#6E675C">°F</text>`;
  return s + `</svg>`;
}

// ------------------------------------------------------------
// banks
// ------------------------------------------------------------
const SLG_BANK = [
  ['a rock', 'solid', '🪨'], ['an ice cube', 'solid', '🧊'], ['a wooden block', 'solid', '🧱'], ['a crayon', 'solid', '🖍️'], ['a spoon', 'solid', '🥄'],
  ['milk', 'liquid', '🥛'], ['orange juice', 'liquid', '🧃'], ['rain water', 'liquid', '🌧️'], ['honey', 'liquid', '🍯'], ['soup', 'liquid', '🍲'],
  ['the air in a balloon', 'gas', '🎈'], ['steam from a kettle', 'gas', '♨️'], ['the air you breathe', 'gas', '💨'], ['bubbles\' insides', 'gas', '🫧'],
];

const STATE_CHANGE_BANK = [
  ['An ice cube left in the sun turns to water. What happened?', 'melting', ['freezing', 'evaporating', 'condensing'], 'Heat turned the SOLID ice into LIQUID water — that\'s melting.'],
  ['Water in the freezer turns to ice. What happened?', 'freezing', ['melting', 'evaporating', 'condensing'], 'Cold turned the LIQUID water into SOLID ice — that\'s freezing.'],
  ['A puddle disappears on a hot day. What happened?', 'evaporating', ['freezing', 'melting', 'condensing'], 'Heat turned the LIQUID water into invisible GAS in the air — that\'s evaporating.'],
  ['Water drops form on the outside of a cold cup. What happened?', 'condensing', ['melting', 'freezing', 'evaporating'], 'Gas in the air cooled on the cold cup and turned back into LIQUID drops — that\'s condensing.'],
  ['A chocolate bar gets soft and gooey in a hot car. What happened?', 'melting', ['freezing', 'evaporating', 'condensing'], 'Heat turned the solid chocolate soft and liquid — melting!'],
  ['Wet clothes on a line become dry. What happened to the water?', 'evaporating', ['freezing', 'melting', 'condensing'], 'The water turned into gas and floated into the air — evaporating.'],
];

const MATERIAL_BANK = [
  ['an umbrella ☔', 'waterproof plastic', ['paper', 'cotton', 'cardboard'], 'An umbrella must keep water OUT, so it needs a waterproof material.'],
  ['a window 🪟', 'clear glass', ['wood', 'metal', 'wool'], 'A window must let light through, so it needs to be clear.'],
  ['a winter coat 🧥', 'warm wool', ['glass', 'paper', 'metal'], 'A coat must keep heat in, so soft warm wool is best.'],
  ['a frying pan 🍳', 'strong metal', ['chocolate', 'paper', 'ice'], 'A pan gets very hot, so it must be metal that won\'t burn or melt.'],
  ['a pillow 🛌', 'soft cotton', ['rock', 'glass', 'metal'], 'A pillow must be squishy and comfy — soft cotton wins.'],
  ['a bike helmet ⛑️', 'hard plastic', ['tissue', 'sponge', 'wool'], 'A helmet must protect your head, so it needs a hard shell.'],
];

const PUSH_PULL_BANK = [
  ['kicking a soccer ball ⚽', 'push'], ['opening a drawer 🗄️', 'pull'], ['pushing a swing 🛝', 'push'],
  ['dragging a wagon 🛷', 'pull'], ['pressing an elevator button 🔘', 'push'], ['tug-of-war 🪢', 'pull'],
  ['rolling a bowling ball 🎳', 'push'], ['opening the fridge 🧊', 'pull'], ['closing a door 🚪', 'push'],
  ['reeling in a fish 🎣', 'pull'],
];

const MAGNET_BANK = [
  ['a steel paperclip 📎', 'yes'], ['an iron nail 🔩', 'yes'], ['a metal fridge door 🧲', 'yes'],
  ['a plastic toy 🪀', 'no'], ['a wooden pencil ✏️', 'no'], ['a rubber ball 🏀', 'no'],
  ['a glass cup 🥛', 'no'], ['a cotton sock 🧦', 'no'], ['steel scissors ✂️', 'yes'], ['a paper book 📖', 'no'],
];

const ANIMAL_GROUPS = [
  ['dog 🐶', 'mammal', 'It has fur and drinks milk as a baby.'], ['whale 🐋', 'mammal', 'It lives in water but breathes air and feeds milk to its babies!'],
  ['bat 🦇', 'mammal', 'It flies, but it has fur and drinks milk as a baby — a flying mammal!'], ['cat 🐱', 'mammal', 'It has fur and drinks milk as a baby.'],
  ['eagle 🦅', 'bird', 'It has feathers and lays eggs.'], ['penguin 🐧', 'bird', 'It can\'t fly, but it has feathers and lays eggs — a bird!'],
  ['duck 🦆', 'bird', 'Feathers and eggs = bird.'],
  ['goldfish 🐠', 'fish', 'It breathes water through gills.'], ['shark 🦈', 'fish', 'It breathes through gills its whole life.'],
  ['snake 🐍', 'reptile', 'It has dry scales.'], ['turtle 🐢', 'reptile', 'It has dry scales and a shell.'], ['lizard 🦎', 'reptile', 'Dry scales = reptile.'],
  ['frog 🐸', 'amphibian', 'It starts as a tadpole in water and has smooth wet skin.'],
  ['ant 🐜', 'insect', 'It has 6 legs and 3 body parts.'], ['butterfly 🦋', 'insect', '6 legs and 3 body parts = insect.'], ['bee 🐝', 'insect', '6 legs and 3 body parts = insect.'],
];

const LIFE_CYCLES = [
  { name: 'butterfly 🦋', stages: ['egg', 'caterpillar', 'chrysalis', 'butterfly'] },
  { name: 'frog 🐸', stages: ['egg', 'tadpole', 'froglet', 'frog'] },
  { name: 'chicken 🐔', stages: ['egg', 'chick', 'young chicken', 'grown chicken'] },
  { name: 'sunflower 🌻', stages: ['seed', 'sprout', 'young plant', 'flowering plant'] },
  { name: 'ladybug 🐞', stages: ['egg', 'larva', 'pupa', 'ladybug'] },
];

const PLANT_PARTS = [
  ['roots', 'drink water from the soil', '🫚'], ['stem', 'carry water up like a straw', '🌱'],
  ['leaves', 'make food from sunlight', '🍃'], ['flower', 'make seeds for new plants', '🌸'],
  ['seeds', 'grow into brand-new plants', '🌰'],
];

const LIVING_BANK = [
  ['a puppy 🐶', 'living'], ['an oak tree 🌳', 'living'], ['a mushroom 🍄', 'living'], ['a sunflower 🌻', 'living'],
  ['a rock 🪨', 'nonliving'], ['a bicycle 🚲', 'nonliving'], ['a cloud ☁️', 'nonliving'], ['a robot 🤖', 'nonliving'],
  ['a fish 🐟', 'living'], ['a teddy bear 🧸', 'nonliving'], ['moss 🌿', 'living'], ['a river 🏞️', 'nonliving'],
];

const HABITAT_BANK = [
  ['camel 🐪', 'desert', 'Camels store fat in their humps to live where food and water are scarce.'],
  ['cactus 🌵', 'desert', 'A cactus stores water in its thick stem for the long dry days.'],
  ['polar bear 🐻‍❄️', 'arctic', 'Thick fur and fat keep polar bears warm in the freezing arctic.'],
  ['seal 🦭', 'arctic', 'A thick layer of blubber keeps seals warm in icy water.'],
  ['deer 🦌', 'forest', 'Deer eat leaves and hide among the forest trees.'],
  ['owl 🦉', 'forest', 'Owls nest in forest trees and hunt at night.'],
  ['shark 🦈', 'ocean', 'Sharks breathe with gills in the salty ocean.'],
  ['coral 🪸', 'ocean', 'Coral builds reefs in warm, shallow ocean water.'],
  ['lion 🦁', 'grassland', 'Lions hunt in the wide open grassland called the savanna.'],
  ['giraffe 🦒', 'grassland', 'Giraffes reach the tall trees scattered across the grassland.'],
  ['monkey 🐒', 'rainforest', 'Monkeys swing through the tall, warm, wet rainforest trees.'],
  ['tree frog 🐸', 'rainforest', 'Tree frogs love the warm, wet leaves of the rainforest.'],
];

const FOOD_CHAIN_BANK = [
  ['grass 🌾', 'producer', 'Grass is a plant — it makes its own food from sunlight, so it\'s a producer.'],
  ['an apple tree 🍎', 'producer', 'Trees are plants — they make food from sunlight.'],
  ['seaweed 🌿', 'producer', 'Seaweed is an ocean plant that makes food from sunlight.'],
  ['a rabbit 🐰', 'consumer', 'Rabbits can\'t make their own food — they EAT plants, so they\'re consumers.'],
  ['a hawk 🦅', 'consumer', 'Hawks eat other animals — consumers eat, producers make.'],
  ['a cow 🐄', 'consumer', 'Cows eat grass — any animal that eats is a consumer.'],
  ['a shark 🦈', 'consumer', 'Sharks eat fish — that makes them consumers.'],
];

const ADAPT_BANK = [
  ['Why does a giraffe have such a long neck? 🦒', 'to reach leaves high in the trees', ['to sing loudly', 'to run faster', 'to scare lions'], 'Its long neck lets it eat leaves other animals can\'t reach.'],
  ['Why does a polar bear have thick fur? 🐻‍❄️', 'to stay warm in the cold', ['to swim faster', 'to look bigger', 'to hide in grass'], 'Thick fur traps heat in the freezing arctic.'],
  ['Why does a cactus have sharp spines? 🌵', 'to keep animals from eating it', ['to catch rain', 'to make flowers', 'to stay cool'], 'Spines protect the cactus\'s juicy water supply from thirsty animals.'],
  ['Why does a duck have webbed feet? 🦆', 'to paddle through water', ['to climb trees', 'to dig holes', 'to run on sand'], 'Webbed feet work like paddles for swimming.'],
  ['Why is an arctic fox white in winter? 🦊', 'to hide in the snow', ['to stay dry', 'to look pretty', 'to stay cool'], 'White fur blends into the snow so it can sneak up on food.'],
  ['Why does a turtle have a hard shell? 🐢', 'to protect its body like armor', ['to swim faster', 'to store food', 'to fly'], 'The shell is built-in armor against hungry animals.'],
];

const WEATHER_BANK = [
  ['Water falls from clouds as fluffy white flakes when it\'s freezing.', 'snow', ['rain', 'hail', 'fog'], 'Frozen flakes = snow ❄️'],
  ['Water falls from clouds as drops on a warm day.', 'rain', ['snow', 'sleet', 'frost'], 'Liquid drops = rain 🌧️'],
  ['Balls of ice fall from a storm cloud in summer.', 'hail', ['snow', 'rain', 'fog'], 'Ice balls from storms = hail 🧊'],
  ['A giant snowstorm with strong winds you can barely see through.', 'blizzard', ['tornado', 'hurricane', 'drizzle'], 'Snow + wind + can\'t see = blizzard 🌨️'],
  ['A spinning funnel of wind that touches the ground.', 'tornado', ['blizzard', 'hurricane', 'rainbow'], 'The spinning funnel is a tornado 🌪️'],
  ['A huge storm that forms over the warm ocean with heavy rain and wind.', 'hurricane', ['tornado', 'blizzard', 'sunshine'], 'Huge ocean storms are hurricanes 🌀'],
];

const EARTH_FEATURES = [
  ['the biggest body of salt water on Earth', 'ocean', ['river', 'lake', 'pond'], 'Oceans are huge and salty 🌊'],
  ['water that flows downhill in a long line', 'river', ['ocean', 'lake', 'puddle'], 'Rivers flow — lakes sit still 🏞️'],
  ['water with land all the way around it', 'lake', ['river', 'ocean', 'stream'], 'A lake is surrounded by land on all sides.'],
  ['the tallest kind of land, often with a snowy top', 'mountain', ['valley', 'plain', 'hill'], 'Mountains are the tallest landforms 🏔️'],
  ['flat land that is great for farming', 'plain', ['mountain', 'canyon', 'island'], 'Plains are wide and flat 🌾'],
  ['land with water all the way around it', 'island', ['plain', 'valley', 'mountain'], 'An island is surrounded by water on all sides 🏝️'],
];

const EARTH_CHANGE_BANK = [
  ['An earthquake shakes and cracks the ground.', 'fast', 'Earthquakes change Earth in seconds — that\'s a FAST change.'],
  ['A volcano erupts and covers the land with lava.', 'fast', 'A volcanic eruption changes the land in hours — FAST.'],
  ['A river slowly carves a deep canyon over many years.', 'slow', 'Water wearing away rock takes thousands of years — SLOW erosion.'],
  ['Wind slowly blows sand and shapes the rocks.', 'slow', 'Wind erosion moves tiny grains at a time — a SLOW change.'],
  ['Waves slowly wash the beach sand away.', 'slow', 'Waves carry a little sand each day — SLOW erosion.'],
  ['A landslide sends rocks tumbling down a hill.', 'fast', 'A landslide happens in seconds — FAST.'],
];

const RRR_BANK = [
  ['using both sides of your paper', 'reduce', 'Using less paper in the first place = REDUCE.'],
  ['drinking from a refillable water bottle', 'reduce', 'Making less trash by not using throwaway bottles = REDUCE.'],
  ['turning an old jar into a pencil cup', 'reuse', 'Using something again in a new way = REUSE.'],
  ['giving your old clothes to a younger cousin', 'reuse', 'The clothes get used again = REUSE.'],
  ['putting a soda can in the recycling bin', 'recycle', 'The can will be melted and made into something new = RECYCLE.'],
  ['putting newspapers in the green bin', 'recycle', 'The paper becomes new paper = RECYCLE.'],
];

// ------------------------------------------------------------
// skills
// ------------------------------------------------------------
SKILLS.push(
  {
    id: 'slg', strand: 'matter', name: 'Solid, liquid, or gas?',
    gen: () => {
      const [item, state, emoji] = pick(SLG_BANK);
      return {
        prompt: `Is <b>${item}</b> ${emoji} a solid, liquid, or gas?`,
        type: 'mc', choices: ['solid', 'liquid', 'gas'], answer: state,
        explain: { solid: 'It keeps its own shape no matter where you put it — a <b>solid</b>.', liquid: 'It flows and takes the shape of its container — a <b>liquid</b>.', gas: 'It spreads out to fill all the space around it — a <b>gas</b>.' }[state],
      };
    },
  },
  {
    id: 'state_change', strand: 'matter', name: 'Melting, freezing & more',
    gen: () => {
      const [q, a, d, why] = pick(STATE_CHANGE_BANK);
      return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
    },
  },
  {
    id: 'best_material', strand: 'matter', name: 'Pick the best material',
    gen: () => {
      const [item, a, d, why] = pick(MATERIAL_BANK);
      return {
        prompt: `What is the BEST material for making <b>${item}</b>?`,
        type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why,
      };
    },
  },
  {
    id: 'push_pull', strand: 'forces', name: 'Push or pull?',
    gen: () => {
      const [act, ans] = pick(PUSH_PULL_BANK);
      return {
        prompt: `Is <b>${act}</b> a push or a pull?`,
        type: 'mc', choices: ['push', 'pull'], answer: ans,
        explain: ans === 'push' ? 'You move it AWAY from you — that\'s a <b>push</b>.' : 'You move it TOWARD you — that\'s a <b>pull</b>.',
      };
    },
  },
  {
    id: 'magnets', strand: 'forces', name: 'What will a magnet grab?',
    gen: () => {
      if (ri(0, 3) === 0) {
        const same = pick([true, false]);
        return {
          prompt: same
            ? `Two magnets face each other with MATCHING poles (N facing N). What happens?`
            : `Two magnets face each other with OPPOSITE poles (N facing S). What happens?`,
          type: 'mc', choices: ['they snap together (attract)', 'they push apart (repel)'],
          answer: same ? 'they push apart (repel)' : 'they snap together (attract)',
          explain: same ? 'Matching poles always <b>repel</b> — they push each other away!' : 'Opposite poles always <b>attract</b> — they pull together with a snap!',
        };
      }
      const [item, yes] = pick(MAGNET_BANK);
      return {
        prompt: `Will a magnet pull <b>${item}</b>?`,
        type: 'mc', choices: ['yes', 'no'], answer: yes,
        explain: yes === 'yes' ? 'It\'s made of iron or steel, so the magnet grabs it! 🧲' : 'It has no iron or steel in it, so the magnet ignores it.',
      };
    },
  },
  {
    id: 'animal_groups', strand: 'life', name: 'Animal groups',
    gen: () => {
      const [animal, group, why] = pick(ANIMAL_GROUPS);
      const others = shuffle(['mammal', 'bird', 'fish', 'reptile', 'amphibian', 'insect'].filter(g => g !== group)).slice(0, 3);
      return {
        prompt: `Which group does a <b>${animal}</b> belong to?`,
        type: 'mc', choices: shuffle([group, ...others]),
        answer: group, explain: why,
      };
    },
  },
  {
    id: 'life_cycle', strand: 'life', name: 'Life cycles',
    gen: () => {
      const cyc = pick(LIFE_CYCLES);
      const i = ri(0, 2);
      const answer = cyc.stages[i + 1];
      const wrongs = cyc.stages.filter(s => s !== answer).slice(0, 3);
      return {
        prompt: `In a ${cyc.name} life cycle, what comes right AFTER the <b>${cyc.stages[i]}</b>?`,
        body: `<div style="font-weight:800;font-size:19px">${cyc.stages.map((s, j) => j === i ? `<b style="color:var(--coral)">${s}</b>` : (j <= i ? s : '❓')).join(' → ')}</div>`,
        type: 'mc', choices: shuffle([answer, ...wrongs]), answer,
        explain: `The full cycle: ${cyc.stages.join(' → ')}. After ${cyc.stages[i]} comes <b>${answer}</b>.`,
      };
    },
  },
  {
    id: 'plant_parts', strand: 'life', name: 'Plant part jobs',
    gen: () => {
      const [part, job, emoji] = pick(PLANT_PARTS);
      const wrongs = PLANT_PARTS.filter(p => p[0] !== part).map(p => p[0]).slice(0, 3);
      return {
        prompt: `Which plant part's job is to <b>${job}</b>? ${emoji}`,
        type: 'mc', choices: shuffle([part, ...wrongs]), answer: part,
        explain: `The <b>${part}</b> ${job} — every part of the plant has its own job!`,
      };
    },
  },
  {
    id: 'living', strand: 'life', name: 'Living or nonliving?',
    gen: () => {
      const [item, ans] = pick(LIVING_BANK);
      return {
        prompt: `Is <b>${item}</b> living or nonliving?`,
        type: 'mc', choices: ['living', 'nonliving'], answer: ans,
        explain: ans === 'living' ? 'It grows, needs food and water, and makes more of itself — <b>living</b>!' : 'It doesn\'t eat, grow, or have babies — <b>nonliving</b>. (Even clouds and rivers just move — they aren\'t alive!)',
      };
    },
  },
  {
    id: 'habitat', strand: 'habitats', name: 'Who lives where?',
    gen: () => {
      const [animal, hab, why] = pick(HABITAT_BANK);
      const otherHabs = shuffle(['desert', 'arctic', 'forest', 'ocean', 'grassland', 'rainforest'].filter(h => h !== hab)).slice(0, 3);
      return {
        prompt: `Where does a <b>${animal}</b> live?`,
        type: 'mc', choices: shuffle([hab, ...otherHabs]),
        answer: hab, explain: why,
      };
    },
  },
  {
    id: 'food_chain', strand: 'habitats', name: 'Producers & consumers',
    gen: () => {
      const [thing, role, why] = pick(FOOD_CHAIN_BANK);
      return {
        prompt: `In a food chain, is <b>${thing}</b> a producer or a consumer?`,
        type: 'mc', choices: ['producer', 'consumer'], answer: role, explain: why,
      };
    },
  },
  {
    id: 'adaptations', strand: 'habitats', name: 'Amazing adaptations',
    gen: () => {
      const [q, a, d, why] = pick(ADAPT_BANK);
      return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
    },
  },
  {
    id: 'weather_type', strand: 'earth', name: 'Weather watch',
    gen: () => {
      const [q, a, d, why] = pick(WEATHER_BANK);
      return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
    },
  },
  {
    id: 'thermometer', strand: 'earth', name: 'Read the thermometer',
    gen: () => {
      const temp = ri(1, 10) * 10;
      const feel = temp >= 80 ? 'a hot day 🥵' : temp >= 60 ? 'a warm day 😊' : temp >= 40 ? 'a chilly day 🧥' : 'a freezing day 🥶';
      return {
        prompt: `What temperature does the thermometer show?`,
        body: thermometerSVG(temp),
        type: 'num', answer: temp, suffix: '°F',
        explain: `The red liquid stops at <b>${temp}°F</b> — that's ${feel}.`,
      };
    },
  },
  {
    id: 'earth_features', strand: 'earth', name: 'Land & water features',
    gen: () => {
      const [clue, a, d, why] = pick(EARTH_FEATURES);
      return {
        prompt: `What do we call <b>${clue}</b>?`,
        type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why,
      };
    },
  },
  {
    id: 'earth_changes', strand: 'earth', name: 'Fast or slow changes?',
    gen: () => {
      const [event, speed, why] = pick(EARTH_CHANGE_BANK);
      return {
        prompt: `${event}<br>Is this a FAST or SLOW change to Earth?`,
        type: 'mc', choices: ['fast', 'slow'], answer: speed, explain: why,
      };
    },
  },
  {
    id: 'rrr', strand: 'earth', name: 'Reduce, reuse, recycle',
    gen: () => {
      const [act, ans, why] = pick(RRR_BANK);
      return {
        prompt: `<b>${act}</b> — is that reduce, reuse, or recycle? ♻️`,
        type: 'mc', choices: ['reduce', 'reuse', 'recycle'], answer: ans, explain: why,
      };
    },
  },
);
