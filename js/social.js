/* ============================================================
   LEARNING GARDEN — Social Studies (2nd grade)
   Maps, community, government, money & work, American symbols,
   long ago & today. Modeled on IXL grade-2 social studies.
   ============================================================ */

SUBJECTS.splice(4, 0, { id: 'social', name: 'Social Studies', emoji: '🏛️', color: 'var(--cocoa)' });

STRANDS.push(
  { id: 'soc_maps', subject: 'social', name: 'Maps & Our World', emoji: '🗺️', color: 'var(--sky)',
    lesson: `<p><b>Maps are pictures of places, drawn from above — like a bird sees them! 🦅</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>The <b>compass rose</b> shows directions: <b>N</b>orth (up), <b>S</b>outh (down), <b>E</b>ast (right), <b>W</b>est (left). Remember "<b>N</b>ever <b>E</b>at <b>S</b>oggy <b>W</b>affles" going clockwise!</li>
        <li>The <b>map key</b> (or legend) explains the little symbols — a 🌲 might mean a forest, a ★ might mean a capital city.</li>
        <li>Earth has <b>7 continents</b> (we live in North America) and <b>5 oceans</b> (the Pacific is the biggest).</li>
        <li>A <b>globe</b> is a round model of the whole Earth. 🌍</li>
      </ul>` },
  { id: 'soc_community', subject: 'social', name: 'Community & Citizens', emoji: '🏘️', color: 'var(--leaf)',
    lesson: `<p><b>A community is the place where people live, work, and help each other.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Community helpers</b> keep us safe, healthy, and learning: firefighters 🚒, nurses 🩺, teachers 🏫, mail carriers 📬, librarians 📚.</li>
        <li><b>Rules</b> keep things fair at home and school. <b>Laws</b> are rules for the whole community — everyone must follow them, even grown-ups!</li>
        <li>A <b>good citizen</b> helps others, tells the truth, takes turns, and takes care of shared places like parks.</li>
      </ul>` },
  { id: 'soc_gov', subject: 'social', name: 'Leaders & Voting', emoji: '🏛️', color: 'var(--coral)',
    lesson: `<p><b>Communities pick leaders to make decisions and keep things running.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>The <b>mayor</b> leads a city or town. The <b>governor</b> leads a state. The <b>president</b> leads the whole country. 🇺🇸</li>
        <li>We choose leaders by <b>voting</b> — everyone gets one vote, and the choice with the most votes wins. That's democracy!</li>
        <li>Leaders work in special buildings: the president lives and works in the <b>White House</b>.</li>
      </ul>` },
  { id: 'soc_econ', subject: 'social', name: 'Money & Work', emoji: '💼', color: 'var(--sun)',
    lesson: `<p><b>People work to earn money, then choose how to use it.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li><b>Goods</b> are things you can touch and buy: apples 🍎, shoes 👟, toys 🧸. <b>Services</b> are jobs people do FOR you: a haircut ✂️, a checkup 🩺, teaching 🏫.</li>
        <li><b>Needs</b> are things you must have to live: food, water, shelter, clothes. <b>Wants</b> are fun extras: candy, video games, a scooter.</li>
        <li>You can <b>spend</b> money now or <b>save</b> it in a piggy bank 🐷 for something bigger later.</li>
      </ul>` },
  { id: 'soc_symbols', subject: 'social', name: 'Symbols & Holidays', emoji: '🇺🇸', color: 'var(--berry)',
    lesson: `<p><b>Symbols and holidays tell the story of our country.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>The <b>flag</b> 🇺🇸 has 50 stars (one for each state) and 13 stripes (for the first 13 colonies).</li>
        <li>The <b>bald eagle</b> 🦅 is our national bird. The <b>Statue of Liberty</b> 🗽 welcomes people to America. The <b>Liberty Bell</b> 🔔 rang for freedom.</li>
        <li><b>Independence Day</b> (July 4) is America's birthday 🎆. <b>Thanksgiving</b> is for being grateful 🦃. <b>Martin Luther King Jr. Day</b> honors a hero of fairness. <b>Presidents' Day</b> honors our leaders. <b>Memorial Day</b> and <b>Veterans Day</b> honor people who served our country.</li>
      </ul>` },
  { id: 'soc_time', subject: 'social', name: 'Long Ago & Today', emoji: '🕰️', color: 'var(--cocoa)',
    lesson: `<p><b>Life long ago was very different — history is the story of how it changed.</b></p>
      <ul style="font-weight:700;line-height:1.9;padding-left:22px">
        <li>Long ago: candles 🕯️, horses and wagons 🐴, letters ✉️, washboards. Today: lightbulbs 💡, cars 🚗, video calls 📱, washing machines.</li>
        <li>A <b>timeline</b> shows events in order, from longest ago to today.</li>
        <li>Famous Americans changed history: <b>George Washington</b> (first president), <b>Abraham Lincoln</b> (helped end slavery), <b>Martin Luther King Jr.</b> (led the fight for equal rights), <b>Rosa Parks</b> (stood up by sitting down), the <b>Wright brothers</b> (first airplane), <b>Amelia Earhart</b> (flying pioneer), <b>Neil Armstrong</b> (first person on the Moon).</li>
      </ul>` },
);

// ------------------------------------------------------------
// banks
// ------------------------------------------------------------
const SOC_COMPASS = [
  ['Which direction is at the TOP of a compass rose?', 'north', ['south', 'east', 'west'], 'North is always at the top of the compass rose — N for up!'],
  ['Which direction is the OPPOSITE of north?', 'south', ['east', 'west', 'up'], 'North and south are opposites, just like east and west.'],
  ['Which direction is the OPPOSITE of east?', 'west', ['north', 'south', 'down'], 'East and west are opposites — the sun rises in the east and sets in the west.'],
  ['The sun RISES in the...', 'east', ['west', 'north', 'south'], 'The sun rises in the east every morning and sets in the west.'],
  ['The sun SETS in the...', 'west', ['east', 'north', 'south'], 'Sunset happens in the west — remember: rises East, sets West.'],
  ['What do the letters N, S, E, W stand for on a map?', 'north, south, east, west', ['never, stop, eat, walk', 'new, small, easy, wide', 'nice, safe, extra, warm'], 'They\'re the four main directions on the compass rose.'],
  ['A map of your bedroom shows it from...', 'above, like a bird sees it', ['the side, like a photo', 'underneath the floor', 'inside the closet'], 'Maps always show places from above — a bird\'s-eye view! 🦅'],
];

const SOC_MAPKEY = [
  ['What does a map KEY (legend) do?', 'explains what the map symbols mean', ['unlocks a treasure chest', 'shows how heavy the map is', 'tells the time'], 'The key is the map\'s dictionary — it tells you what every symbol stands for.'],
  ['On a map key, a ★ usually means...', 'a capital city', ['a swimming pool', 'a shooting star', 'a playground'], 'A star on a map usually marks a capital city.'],
  ['On a map, blue areas usually show...', 'water', ['forests', 'mountains', 'cities'], 'Blue means water — lakes, rivers, and oceans.'],
  ['On a map, green areas often show...', 'forests or parks', ['deserts', 'oceans', 'ice'], 'Green usually means growing things — forests, parks, and grasslands.'],
  ['A tiny 🌲 symbol on a map probably means...', 'a forest', ['a birthday party', 'a school', 'a hospital'], 'Symbols look like what they stand for — a tree means forest!'],
  ['What is a globe?', 'a round model of the Earth', ['a flat drawing of a town', 'a kind of balloon', 'a light in the ceiling'], 'A globe is Earth-shaped — round like the real planet. 🌍'],
];

const SOC_WORLD = [
  ['How many continents does Earth have?', '7', ['5', '3', '10'], 'Seven continents: North America, South America, Europe, Asia, Africa, Australia, and Antarctica.'],
  ['Which continent do we live on?', 'North America', ['Africa', 'Asia', 'Antarctica'], 'The United States is on the continent of North America.'],
  ['Which is the BIGGEST ocean?', 'the Pacific Ocean', ['the Atlantic Ocean', 'the Arctic Ocean', 'the Indian Ocean'], 'The Pacific is the biggest and deepest ocean on Earth.'],
  ['Which continent is famous for being frozen and icy?', 'Antarctica', ['Australia', 'Europe', 'South America'], 'Antarctica, at the bottom of the world, is covered in ice — penguins love it! 🐧'],
  ['Which of these is a CONTINENT?', 'Africa', ['the Pacific Ocean', 'Texas', 'Mexico City'], 'Africa is one of the seven continents. Texas is a state and Mexico City is a city.'],
  ['Which of these is an OCEAN?', 'the Atlantic', ['Asia', 'Canada', 'the Sahara'], 'The Atlantic is the ocean between the Americas and Europe/Africa.'],
  ['A continent is...', 'a giant piece of land', ['a small island', 'a kind of boat', 'a deep lake'], 'Continents are Earth\'s biggest chunks of land.'],
];

const SOC_HELPERS = [
  ['Who puts out fires and rescues people?', 'a firefighter 🚒', ['a librarian', 'a baker', 'a barber'], 'Firefighters race to emergencies to keep the community safe.'],
  ['Who helps sick people feel better at the doctor\'s office?', 'a nurse 🩺', ['a mail carrier', 'a bus driver', 'a chef'], 'Nurses and doctors take care of our health.'],
  ['Who brings letters and packages to your house?', 'a mail carrier 📬', ['a dentist', 'a farmer', 'a pilot'], 'Mail carriers deliver mail in every kind of weather!'],
  ['Who helps you find great books at the library?', 'a librarian 📚', ['a plumber', 'a vet', 'a coach'], 'Librarians know where every book lives.'],
  ['Who keeps people safe and helps in emergencies on the street?', 'a police officer 🚓', ['a painter', 'a singer', 'a waiter'], 'Police officers protect the community and help people in trouble.'],
  ['Who takes care of sick ANIMALS?', 'a veterinarian 🐶', ['a florist', 'a teacher', 'a judge'], 'A veterinarian (vet) is an animal doctor.'],
  ['Who grows the food that ends up in the grocery store?', 'a farmer 🚜', ['a lifeguard', 'a dentist', 'a mechanic'], 'Farmers grow crops and raise animals that feed the community.'],
  ['Who helps kids learn at school every day?', 'a teacher 🏫', ['a pilot', 'a fisherman', 'an actor'], 'Teachers are community helpers too!'],
];

const SOC_RULES = [
  ['Why do we have rules at school?', 'to keep everyone safe and treat people fairly', ['to make school boring', 'to fill up time', 'because rules are secret'], 'Rules protect people and make things fair for everyone.'],
  ['What is a LAW?', 'a rule for the whole community that everyone must follow', ['a rule only for kids', 'a kind of sandwich', 'a game you play outside'], 'Laws are community rules — even grown-ups must follow them.'],
  ['Who must follow the laws?', 'everyone, even grown-ups and leaders', ['only kids', 'only new people', 'nobody'], 'Laws apply to every single person — that\'s what makes them fair.'],
  ['Wearing a seatbelt in the car is...', 'a law that keeps you safe', ['just for long trips', 'only for grown-ups', 'a silly old custom'], 'Seatbelt laws exist because seatbelts save lives.'],
  ['What usually happens when someone breaks a rule at school?', 'there is a fair consequence, like losing a privilege', ['nothing at all', 'the rule disappears', 'school closes'], 'Consequences help everyone remember that rules matter.'],
  ['A stop sign 🛑 is a law that tells drivers to...', 'stop and look before going', ['honk loudly', 'drive faster', 'turn around'], 'Stopping at stop signs keeps walkers and drivers safe.'],
];

const SOC_CITIZEN = [
  ['You see trash on the playground. A good citizen would...', 'pick it up and throw it away', ['kick it around', 'ignore it', 'add more trash'], 'Good citizens take care of shared places.'],
  ['Your classmate drops their crayons. A good citizen would...', 'help pick them up', ['laugh', 'walk away', 'hide one'], 'Helping others is what good citizens do best.'],
  ['Everyone wants a turn on the swing. A good citizen would...', 'take turns and share', ['push to the front', 'stay on all recess', 'take the swing home'], 'Taking turns is fairness in action.'],
  ['You broke your mom\'s vase by accident. A good citizen would...', 'tell the truth about what happened', ['blame the cat', 'hide the pieces', 'say nothing'], 'Honesty — even when it\'s hard — is a citizen superpower.'],
  ['During the class vote, your choice LOSES. A good citizen would...', 'accept the result and join in anyway', ['demand a redo until you win', 'quit the class', 'yell'], 'In a democracy we accept fair votes, win or lose.'],
  ['A new student doesn\'t know anyone. A good citizen would...', 'invite them to play', ['ignore them', 'point and whisper', 'take their seat'], 'Welcoming others makes the whole community stronger.'],
];

const SOC_LEADERS = [
  ['Who is the leader of the whole COUNTRY?', 'the president', ['the mayor', 'the principal', 'the coach'], 'The president leads the entire United States.'],
  ['Who is the leader of a CITY or TOWN?', 'the mayor', ['the president', 'the king', 'the sheriff of the state'], 'Mayors lead cities and towns.'],
  ['Who is the leader of a STATE?', 'the governor', ['the mayor', 'the librarian', 'the general'], 'Each of the 50 states elects a governor.'],
  ['How do we CHOOSE our leaders?', 'by voting', ['by racing', 'by drawing straws', 'the tallest person wins'], 'In a democracy, people vote — and every vote counts the same.'],
  ['In a fair vote, who wins?', 'the choice with the most votes', ['whoever shouts loudest', 'whoever votes twice', 'the teacher\'s favorite'], 'Most votes wins — that\'s how voting works.'],
  ['Where does the president live and work?', 'the White House', ['the Statue of Liberty', 'a castle', 'the mall'], 'The White House is in Washington, D.C.'],
  ['Why do communities need leaders?', 'to make decisions and help solve problems', ['to give everyone homework', 'to win trophies', 'to plan birthday parties'], 'Leaders organize the community and make big decisions.'],
];

const SOC_GOODS = [
  ['an apple you buy at the store 🍎', 'good', 'You can hold an apple — it\'s a GOOD.'],
  ['a haircut ✂️', 'service', 'A haircut is work someone does FOR you — a SERVICE.'],
  ['a new pair of shoes 👟', 'good', 'Shoes are a thing you can touch and take home — a GOOD.'],
  ['a checkup at the dentist 🦷', 'service', 'The dentist does work for you — that\'s a SERVICE.'],
  ['a teddy bear 🧸', 'good', 'A teddy bear is a thing — a GOOD.'],
  ['a bus ride to the museum 🚌', 'service', 'The driver is doing work for you — a SERVICE.'],
  ['a slice of pizza 🍕', 'good', 'You can hold (and eat!) pizza — a GOOD.'],
  ['swim lessons at the pool 🏊', 'service', 'Teaching is work done for you — a SERVICE.'],
  ['a library book you BUY at a book fair 📖', 'good', 'The book is a thing you keep — a GOOD.'],
  ['someone mowing your lawn 🌱', 'service', 'Mowing is work done for you — a SERVICE.'],
];

const SOC_NEEDS = [
  ['water to drink 💧', 'need', 'You can\'t live without water — a NEED.'],
  ['a warm coat in winter 🧥', 'need', 'Clothes that keep you safe from cold are a NEED.'],
  ['a video game 🎮', 'want', 'Fun? Yes. Needed to live? No — a WANT.'],
  ['healthy food 🥦', 'need', 'Everyone needs food to live — a NEED.'],
  ['a house or apartment to live in 🏠', 'need', 'Shelter keeps you safe — a NEED.'],
  ['a candy bar 🍫', 'want', 'Tasty, but you don\'t need it to live — a WANT.'],
  ['a brand-new scooter 🛴', 'want', 'A scooter is a fun extra — a WANT.'],
  ['medicine when you are sick 💊', 'need', 'Medicine keeps you healthy — a NEED.'],
  ['a giant stuffed unicorn 🦄', 'want', 'Adorable — but still a WANT.'],
  ['a toothbrush 🪥', 'need', 'Keeping your body healthy is a NEED.'],
];

const SOC_MONEY = [
  ['Why do people go to work?', 'to earn money for the things their family needs', ['to avoid the rain', 'to win prizes', 'because they lost a bet'], 'People work to earn money for needs (and some wants!).'],
  ['You want a $10 toy but only have $4. What could you do?', 'save your money until you have enough', ['take the toy anyway', 'cry until it\'s free', 'give up on money'], 'Saving a little at a time is how people afford bigger things. 🐷'],
  ['What does it mean to SAVE money?', 'keep it to use later instead of spending now', ['throw it away', 'spend it fast', 'hide it and forget it'], 'Saving means waiting now so you can afford more later.'],
  ['Sam earns $2 for chores each week. After 3 weeks he has...', '$6', ['$2', '$5', '$23'], 'Saving $2 + $2 + $2 = $6 — saving adds up!'],
  ['A person who makes bread to sell is called a...', 'baker', ['buyer', 'banker', 'teacher'], 'Bakers PRODUCE (make) goods; shoppers are the buyers.'],
  ['When you trade money for a toy at a store, that\'s called...', 'buying (spending)', ['saving', 'borrowing', 'voting'], 'Trading money for goods is buying — also called spending.'],
];

const SOC_SYMBOLS_BANK = [
  ['How many stars are on the American flag, and why?', '50 — one for each state', ['13 — one for each colony', '100 — one per year', '7 — one per continent'], 'Fifty stars for fifty states! The 13 STRIPES honor the first 13 colonies.'],
  ['What do the 13 STRIPES on the flag stand for?', 'the first 13 colonies', ['the 13 oceans', '13 presidents', '13 kinds of eagles'], 'The stripes remember the 13 original colonies that became the first states.'],
  ['What is the national BIRD of the United States?', 'the bald eagle 🦅', ['the turkey', 'the robin', 'the penguin'], 'The bald eagle stands for strength and freedom.'],
  ['Which statue welcomes people arriving to America by sea?', 'the Statue of Liberty 🗽', ['the Liberty Bell', 'Mount Rushmore', 'the Eiffel Tower'], 'Lady Liberty stands in New York Harbor holding her torch high.'],
  ['What is the Liberty Bell famous for?', 'ringing for freedom (it even has a crack!)', ['being the loudest bell ever', 'being made of gold', 'telling the time'], 'The Liberty Bell is a symbol of independence — crack and all.'],
  ['Mount Rushmore shows the faces of four...', 'presidents', ['inventors', 'astronauts', 'athletes'], 'Four presidents are carved into the mountain: Washington, Jefferson, Roosevelt, and Lincoln.'],
  ['The bird some people joke ALMOST became a US symbol is the...', 'turkey 🦃', ['flamingo', 'ostrich', 'parrot'], 'Ben Franklin praised the turkey — but the bald eagle won the honor.'],
];

const SOC_HOLIDAYS = [
  ['Which holiday is America\'s birthday, with fireworks on July 4? 🎆', 'Independence Day', ['Thanksgiving', 'Valentine\'s Day', 'Halloween'], 'On July 4, 1776, America declared independence — we celebrate with fireworks!'],
  ['Which fall holiday is about sharing a meal and being thankful? 🦃', 'Thanksgiving', ['Independence Day', 'Presidents\' Day', 'New Year\'s Day'], 'Thanksgiving is for gratitude, family, and (usually) turkey.'],
  ['Martin Luther King Jr. Day honors a hero who...', 'worked peacefully for fairness and equal rights', ['flew to the Moon', 'invented the car', 'was the first president'], 'Dr. King dreamed of fairness for all people and led peaceful marches.'],
  ['Presidents\' Day honors...', 'the leaders of our country', ['famous singers', 'the first astronauts', 'inventors of candy'], 'It began to honor George Washington\'s birthday and now honors the presidency.'],
  ['Memorial Day and Veterans Day both honor...', 'people who served in the military', ['famous painters', 'schoolteachers', 'baseball players'], 'These holidays thank the brave people who protected our country.'],
  ['On which holiday do Americans watch fireworks and have parades in the summer?', 'Independence Day (July 4)', ['Thanksgiving', 'Groundhog Day', 'April Fools\' Day'], 'Fireworks light up the sky every Fourth of July! 🎆'],
];

const SOC_PASTPRESENT = [
  ['a candle for light 🕯️', 'long ago', 'a lightbulb 💡', 'Before electricity, people lit their homes with candles and lanterns.'],
  ['a horse and wagon for travel 🐴', 'long ago', 'a car 🚗', 'Before cars, people rode horses and wagons — trips took days!'],
  ['writing letters and waiting weeks ✉️', 'long ago', 'a video call 📱', 'Before phones, news traveled only as fast as the mail.'],
  ['washing clothes by hand on a washboard 🪣', 'long ago', 'a washing machine 🧺', 'Laundry once took a whole day of scrubbing!'],
  ['a one-room schoolhouse with all ages together 🏚️', 'long ago', 'schools with many classrooms 🏫', 'Long ago, kids of every age learned in ONE room with ONE teacher.'],
  ['an icebox with a real block of ice 🧊', 'long ago', 'a refrigerator ❄️', 'Before fridges, an ice delivery kept food cold!'],
  ['a quill pen dipped in ink 🪶', 'long ago', 'pencils and computers 💻', 'People once wrote with feathers dipped in ink pots.'],
];

const SOC_FAMOUS = [
  ['Who was the FIRST president of the United States?', 'George Washington', ['Abraham Lincoln', 'Neil Armstrong', 'Benjamin Franklin'], 'George Washington led the country first — he\'s on the $1 bill!'],
  ['Which president helped END slavery?', 'Abraham Lincoln', ['George Washington', 'Thomas Edison', 'Teddy Roosevelt'], 'Lincoln led the country during the Civil War and helped end slavery.'],
  ['Who gave the famous "I Have a Dream" speech?', 'Martin Luther King Jr.', ['Rosa Parks', 'Neil Armstrong', 'Ben Franklin'], 'Dr. King dreamed that all people would be treated fairly and equally.'],
  ['Who bravely refused to give up her bus seat, standing up for fairness?', 'Rosa Parks', ['Amelia Earhart', 'Betsy Ross', 'Sacagawea'], 'Rosa Parks\' quiet courage helped spark the civil rights movement.'],
  ['Which brothers flew the FIRST airplane?', 'the Wright brothers', ['the Mario brothers', 'the Grimm brothers', 'the Jonas brothers'], 'Orville and Wilbur Wright flew at Kitty Hawk in 1903 — 12 seconds that changed the world!'],
  ['Who was the famous woman pilot who crossed the Atlantic Ocean?', 'Amelia Earhart', ['Rosa Parks', 'Harriet Tubman', 'Ruby Bridges'], 'Amelia Earhart was the first woman to fly solo across the Atlantic.'],
  ['Who was the first person to walk on the MOON?', 'Neil Armstrong', ['George Washington', 'the Wright brothers', 'Abraham Lincoln'], '"One small step for man..." — Neil Armstrong, 1969. 🌕'],
  ['Who bravely led enslaved people to freedom on the Underground Railroad?', 'Harriet Tubman', ['Amelia Earhart', 'Betsy Ross', 'Eleanor Roosevelt'], 'Harriet Tubman made many dangerous trips to lead people to freedom.'],
  ['Who was the six-year-old who bravely helped desegregate schools?', 'Ruby Bridges', ['Rosa Parks', 'Sacagawea', 'Amelia Earhart'], 'Ruby Bridges walked into her school with courage bigger than she was.'],
];

// helper: bank of [question, answer, wrongs, why]
function bankQ(bank) {
  const [q, a, d, why] = pick(bank);
  return { prompt: q, type: 'mc', choices: shuffle([a, ...d]), answer: a, explain: why };
}

SKILLS.push(
  { id: 'soc_compass', strand: 'soc_maps', name: 'Compass directions', gen: () => bankQ(SOC_COMPASS) },
  { id: 'soc_mapread', strand: 'soc_maps', name: 'Map keys & symbols', gen: () => bankQ(SOC_MAPKEY) },
  { id: 'soc_world', strand: 'soc_maps', name: 'Continents & oceans', gen: () => bankQ(SOC_WORLD) },
  { id: 'soc_helpers', strand: 'soc_community', name: 'Community helpers', gen: () => bankQ(SOC_HELPERS) },
  { id: 'soc_rules', strand: 'soc_community', name: 'Rules & laws', gen: () => bankQ(SOC_RULES) },
  { id: 'soc_citizen', strand: 'soc_community', name: 'Being a good citizen', gen: () => bankQ(SOC_CITIZEN) },
  { id: 'soc_leaders', strand: 'soc_gov', name: 'Leaders & voting', gen: () => bankQ(SOC_LEADERS) },
  {
    id: 'soc_goods', strand: 'soc_econ', name: 'Goods or services?',
    gen: () => {
      const [item, ans, why] = pick(SOC_GOODS);
      return {
        prompt: `Is <b>${item}</b> a good or a service?`,
        type: 'mc', choices: ['good', 'service'], answer: ans, explain: why,
      };
    },
  },
  {
    id: 'soc_needs', strand: 'soc_econ', name: 'Needs or wants?',
    gen: () => {
      const [item, ans, why] = pick(SOC_NEEDS);
      return {
        prompt: `Is <b>${item}</b> a need or a want?`,
        type: 'mc', choices: ['need', 'want'], answer: ans, explain: why,
      };
    },
  },
  { id: 'soc_money', strand: 'soc_econ', name: 'Earning, saving, spending', gen: () => bankQ(SOC_MONEY) },
  { id: 'soc_symbols_q', strand: 'soc_symbols', name: 'American symbols', gen: () => bankQ(SOC_SYMBOLS_BANK) },
  { id: 'soc_holidays', strand: 'soc_symbols', name: 'Holidays we celebrate', gen: () => bankQ(SOC_HOLIDAYS) },
  {
    id: 'soc_pastpresent', strand: 'soc_time', name: 'Long ago or today?',
    gen: () => {
      const [thing, , modern, why] = pick(SOC_PASTPRESENT);
      if (ri(0, 1)) {
        return {
          prompt: `<b>${thing}</b> — is that from LONG AGO or TODAY?`,
          type: 'mc', choices: ['long ago', 'today'], answer: 'long ago', explain: why,
        };
      }
      const wrongs = shuffle(SOC_PASTPRESENT.filter(p => p[2] !== modern)).slice(0, 3).map(p => p[2]);
      return {
        prompt: `Long ago people used <b>${thing}</b>. What do we use TODAY instead?`,
        type: 'mc', choices: shuffle([modern, ...wrongs]), answer: modern, explain: why,
      };
    },
  },
  { id: 'soc_famous', strand: 'soc_time', name: 'Famous Americans', gen: () => bankQ(SOC_FAMOUS) },
);
