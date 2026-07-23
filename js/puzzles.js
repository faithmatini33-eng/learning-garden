/* ============================================================
   LEARNING GARDEN — puzzles.js (Game Corner content pack)
   Pure data for:
   • PUZZLE_BANK  — Puzzle Corner (§6.7): 7 daily types × 6 rounds
                    × 3 puzzles (easy → tricky). No questions, no
                    timer, no score — pure logic play.
   • FOSSIL_SITES — Treasure Dig (§6.6): 10 dig sites, each with a
                    hand-authored 6-wide × 3-tall fossil mask and
                    one TRUE, kid-friendly read-aloud fact.
   • DECORATIONS  — Prize Shelf (§7): 12 cosmetic garden items,
                    prices 15–80 tickets.
   • QUIZ_SILLY   — Owl's Quiz Show (§6.5): 40 harmless-funny
                    wrong-answer options (exactly one per question).
   Pure data file: no DB access, no DOM at load time.
   Load with the other content files, BEFORE app.js.
   ============================================================ */

// ------------------------------------------------------------
// PUZZLE_BANK — daily type rotation:
// Mon patterns · Tue tangram · Wed maze · Thu oddone ·
// Fri sorting · Sat shadow · Sun build
// Each type = array of ROUNDS; a round = [easy, medium, tricky].
// Shapes per type:
//  patterns: { prompt, say, sequence[], options[3], answer, why }
//  tangram:  { prompt, say, target, options[3], answer, why }
//  maze:     { prompt, say, grid 5×5 (1 = hedge), start[r,c],
//              goal[r,c], why }  — kid taps adjacent open cells
//              to walk Pip to the acorn; BFS-verified solvable,
//              shortest path 6–12 steps.
//  oddone:   { prompt, say, items[4], answer, why }
//  sorting:  { prompt, say, title, bins[2], items[[emoji,bin]…], why }
//  shadow:   { prompt, say, item, options[3], answer, why }
//            — options rendered grayscale via CSS filter.
//  build:    { prompt, say, target [rows top→bottom], options[3],
//              answer, why }
// ------------------------------------------------------------
const PUZZLE_BANK = {

  // ---------------- Monday: PATTERNS ----------------
  patterns: [
    [ // round 1
      { prompt: "What comes next?", say: "Look at the pattern. What comes next?",
        sequence: ["🔴","🔵","🔴","🔵","🔴"], options: ["🔵","🔴","🟡"], answer: "🔵",
        why: "Red, blue, red, blue — so blue takes the next turn!" },
      { prompt: "What comes next?", say: "Two daisies, then a tulip. What comes next?",
        sequence: ["🌼","🌼","🌷","🌼","🌼"], options: ["🌷","🌼","🌻"], answer: "🌷",
        why: "The pattern goes daisy, daisy, tulip — time for the tulip again!" },
      { prompt: "The stars are growing! What comes next?", say: "The stars are growing. What comes next?",
        sequence: ["⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐"], options: ["⭐⭐⭐⭐⭐","⭐⭐⭐","⭐"], answer: "⭐⭐⭐⭐⭐",
        why: "Each group grows by one star — five stars come next!" }
    ],
    [ // round 2
      { prompt: "What comes next?", say: "Cat, dog, cat, dog. What comes next?",
        sequence: ["🐱","🐶","🐱","🐶","🐱"], options: ["🐶","🐱","🐭"], answer: "🐶",
        why: "The cat and dog take turns — it's the dog's turn!" },
      { prompt: "What comes next?", say: "Apple, banana, banana. What comes next?",
        sequence: ["🍎","🍌","🍌","🍎","🍌","🍌"], options: ["🍎","🍌","🍇"], answer: "🍎",
        why: "One apple, then two bananas — the apple starts it again!" },
      { prompt: "Three friends take turns. What comes next?", say: "Triangle, square, circle. What comes next?",
        sequence: ["🔺","🟦","🟢","🔺","🟦","🟢","🔺","🟦"], options: ["🟢","🔺","🟦"], answer: "🟢",
        why: "Triangle, square, circle repeat — the circle is up next!" }
    ],
    [ // round 3
      { prompt: "What comes next?", say: "Sun, moon, sun, moon. What comes next?",
        sequence: ["☀️","🌙","☀️","🌙","☀️"], options: ["🌙","☀️","⭐"], answer: "🌙",
        why: "Day, then night — the moon comes after the sun!" },
      { prompt: "What comes next?", say: "Car, car, bus. What comes next?",
        sequence: ["🚗","🚗","🚌","🚗","🚗","🚌"], options: ["🚗","🚌","✈️"], answer: "🚗",
        why: "Two cars, then a bus — the cars start again!" },
      { prompt: "The squares are growing! What comes next?", say: "The green squares are growing. What comes next?",
        sequence: ["🟩","🟩🟩","🟩🟩🟩"], options: ["🟩🟩🟩🟩","🟩🟩","🟩"], answer: "🟩🟩🟩🟩",
        why: "Each step adds one more square — four squares come next!" }
    ],
    [ // round 4
      { prompt: "What comes next?", say: "Frog, duck, frog, duck. What comes next?",
        sequence: ["🐸","🦆","🐸","🦆","🐸"], options: ["🦆","🐸","🐟"], answer: "🦆",
        why: "Frog and duck take turns — quack, it's the duck!" },
      { prompt: "What comes next?", say: "Two cupcakes, two donuts. What comes next?",
        sequence: ["🧁","🧁","🍩","🍩","🧁","🧁","🍩"], options: ["🍩","🧁","🍪"], answer: "🍩",
        why: "Two cupcakes, then two donuts — one more donut finishes the pair!" },
      { prompt: "Three bugs take turns. What comes next?", say: "Bee, ladybug, butterfly. What comes next?",
        sequence: ["🐝","🐞","🦋","🐝","🐞","🦋","🐝"], options: ["🐞","🦋","🐝"], answer: "🐞",
        why: "Bee, ladybug, butterfly repeat — the ladybug flies in next!" }
    ],
    [ // round 5
      { prompt: "What comes next?", say: "Red, yellow, red, yellow. What comes next?",
        sequence: ["🟥","🟨","🟥","🟨","🟥"], options: ["🟨","🟥","🟦"], answer: "🟨",
        why: "Red and yellow take turns — yellow is next!" },
      { prompt: "What comes next?", say: "Two trees, then a blossom. What comes next?",
        sequence: ["🌲","🌲","🌸","🌲","🌲","🌸"], options: ["🌲","🌸","🍄"], answer: "🌲",
        why: "Tree, tree, blossom — the trees start the pattern again!" },
      { prompt: "The dots are growing! What comes next?", say: "The blue dots are growing. What comes next?",
        sequence: ["🔵","🔵🔵","🔵🔵🔵","🔵🔵🔵🔵"], options: ["🔵🔵🔵🔵🔵","🔵🔵🔵","🔵🔵"], answer: "🔵🔵🔵🔵🔵",
        why: "One more dot each time — five dots come next!" }
    ],
    [ // round 6
      { prompt: "What comes next?", say: "Strawberry, blueberry. What comes next?",
        sequence: ["🍓","🫐","🍓","🫐","🍓"], options: ["🫐","🍓","🍒"], answer: "🫐",
        why: "Strawberry, blueberry, back and forth — blueberry's turn!" },
      { prompt: "What comes next?", say: "Two turtles, then a bunny. What comes next?",
        sequence: ["🐢","🐢","🐰","🐢","🐢","🐰","🐢","🐢"], options: ["🐰","🐢","🐿️"], answer: "🐰",
        why: "Two slow turtles, then a quick bunny — hop, here it comes!" },
      { prompt: "Three sky friends take turns. What comes next?", say: "Sun, moon, star. What comes next?",
        sequence: ["🌞","🌛","⭐","🌞","🌛","⭐","🌞","🌛"], options: ["⭐","🌞","🌛"], answer: "⭐",
        why: "Sun, moon, star repeat — the star twinkles in next!" }
    ]
  ],

  // ---------------- Tuesday: TANGRAM ----------------
  tangram: [
    [ // round 1
      { prompt: "Which pieces make this shape?", say: "Which pieces make a big square?",
        target: "⬜ a big square", options: ["🔺 + 🔺 two triangles", "🔺 + ⚪ a triangle and a circle", "⚪ + ⚪ two circles"],
        answer: "🔺 + 🔺 two triangles",
        why: "Two triangles snap together along their long sides to make a square!" },
      { prompt: "Which pieces make this shape?", say: "Which pieces make a long rectangle?",
        target: "▭ a long rectangle", options: ["⬜ + ⬜ two squares", "🔺 + ⚪ a triangle and a circle", "⚪ + ▭ a circle and a rectangle"],
        answer: "⬜ + ⬜ two squares",
        why: "Two squares side by side stretch into one long rectangle!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a little house?",
        target: "🏠 a little house", options: ["⬜ + 🔺 a square with a triangle on top", "⚪ + 🔺 a circle with a triangle on top", "⬜ + ⬜ two squares stacked"],
        answer: "⬜ + 🔺 a square with a triangle on top",
        why: "The square is the house and the triangle is its pointy roof!" }
    ],
    [ // round 2
      { prompt: "Which pieces make this shape?", say: "Which pieces make a big triangle?",
        target: "🔺 a big triangle", options: ["🔺 + 🔺 two small triangles", "⬜ + ⬜ two squares", "⚪ + 🔺 a circle and a triangle"],
        answer: "🔺 + 🔺 two small triangles",
        why: "Two small triangles lean together to make one big triangle!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build an ice cream cone?",
        target: "🍦 an ice cream cone", options: ["⚪ + 🔻 a circle on an upside-down triangle", "⬜ + 🔺 a square on a triangle", "⚪ + ⚪ two circles"],
        answer: "⚪ + 🔻 a circle on an upside-down triangle",
        why: "The circle is the scoop and the upside-down triangle is the cone!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a tall tree?",
        target: "🌲 a tall tree", options: ["🔺 + 🔺 + ▭ two triangles on a little rectangle", "⚪ + ⚪ + ▭ two circles on a rectangle", "⬜ + ⬜ + 🔺 two squares and a triangle"],
        answer: "🔺 + 🔺 + ▭ two triangles on a little rectangle",
        why: "Stacked triangles make the leafy top, and the rectangle is the trunk!" }
    ],
    [ // round 3
      { prompt: "Which pieces make this shape?", say: "Which pieces make a diamond?",
        target: "🔶 a diamond", options: ["🔺 + 🔻 a triangle up and a triangle down", "⬜ + 🔺 a square and a triangle", "⚪ + 🔻 a circle and a triangle"],
        answer: "🔺 + 🔻 a triangle up and a triangle down",
        why: "One triangle points up, one points down — together they sparkle into a diamond!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a sailboat?",
        target: "⛵ a sailboat", options: ["🔺 + ▭ a triangle sail on a rectangle boat", "⚪ + ▭ a circle on a rectangle", "🔺 + 🔺 two triangles side by side"],
        answer: "🔺 + ▭ a triangle sail on a rectangle boat",
        why: "The triangle catches the wind and the rectangle floats on the water!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a rocket ship?",
        target: "🚀 a rocket ship", options: ["🔺 + ▭ + 🔻🔻 a nose, a body, and two fins", "⚪ + ⚪ + ▭ two circles and a body", "⬜ + ⬜ + ⬜ three squares stacked"],
        answer: "🔺 + ▭ + 🔻🔻 a nose, a body, and two fins",
        why: "Pointy nose on top, long body, two fins at the bottom — blast off!" }
    ],
    [ // round 4
      { prompt: "Which pieces make this shape?", say: "Which pieces make a big circle?",
        target: "⚪ a big circle", options: ["◗ + ◖ two half circles", "🔺 + 🔺 two triangles", "⬜ + ◖ a square and a half circle"],
        answer: "◗ + ◖ two half circles",
        why: "Two half circles hug together to make one whole circle!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a butterfly?",
        target: "🦋 a butterfly", options: ["🔺 + ▭ + 🔺 two triangle wings on a skinny body", "⚪ + ⚪ two circles", "⬜ + 🔺 a square and a triangle"],
        answer: "🔺 + ▭ + 🔺 two triangle wings on a skinny body",
        why: "Two triangle wings open wide from the skinny rectangle body!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a fish?",
        target: "🐟 a fish", options: ["🔺 + 🔻 a big triangle body and a small triangle tail", "⚪ + ⚪ + ⚪ three circles", "▭ + ▭ two rectangles"],
        answer: "🔺 + 🔻 a big triangle body and a small triangle tail",
        why: "A big triangle swims ahead and the little triangle wiggles as the tail!" }
    ],
    [ // round 5
      { prompt: "Which pieces make this shape?", say: "Which pieces make an arrow?",
        target: "➡️ an arrow", options: ["▭ + 🔺 a rectangle with a triangle point", "⚪ + 🔺 a circle with a triangle", "⬜ + ⬜ two squares"],
        answer: "▭ + 🔺 a rectangle with a triangle point",
        why: "The rectangle is the arrow's stick and the triangle shows the way!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a kite?",
        target: "🪁 a kite", options: ["🔶 + ➰ a diamond with a wiggly tail", "⚪ + ➰ a circle with a tail", "⬜ + 🔺 a square and a triangle"],
        answer: "🔶 + ➰ a diamond with a wiggly tail",
        why: "The diamond soars up high and the wiggly tail dances behind it!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a snowman?",
        target: "⛄ a snowman", options: ["⚪ + ⚪ + ⚪ three circles stacked big to small", "⬜ + ⬜ + ⬜ three squares stacked", "⚪ + 🔺 + ⚪ a circle, a triangle, and a circle"],
        answer: "⚪ + ⚪ + ⚪ three circles stacked big to small",
        why: "Big snowball, middle snowball, little head — a perfect snowman stack!" }
    ],
    [ // round 6
      { prompt: "Which pieces make this shape?", say: "Which pieces make a heart?",
        target: "❤️ a heart", options: ["◗◖ + 🔻 two little half circles on a triangle point", "⚪ + ⚪ two circles side by side", "🔺 + 🔺 two triangles"],
        answer: "◗◖ + 🔻 two little half circles on a triangle point",
        why: "Two round bumps on top, one point below — that makes a heart!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a wagon?",
        target: "🛒 a wagon", options: ["▭ + ⚪⚪ a rectangle with two circle wheels", "🔺 + ⚪ a triangle with one wheel", "⬜ + 🔺🔺 a square with two triangles"],
        answer: "▭ + ⚪⚪ a rectangle with two circle wheels",
        why: "The rectangle carries the load and the circle wheels roll it along!" },
      { prompt: "Which pieces build this picture?", say: "Which pieces build a crown?",
        target: "👑 a crown", options: ["▭ + 🔺🔺🔺 a band with three triangle points", "▭ + ⚪⚪⚪ a band with three circles", "🔺 + ▭ + 🔺 a triangle, a band, and a triangle"],
        answer: "▭ + 🔺🔺🔺 a band with three triangle points",
        why: "A royal band with three pointy triangles on top — fit for a garden king!" }
    ]
  ],

  // ---------------- Wednesday: MAZE ----------------
  // grid: 5×5 rows of 0 (path) / 1 (hedge). start/goal = [row, col].
  // Every maze BFS-verified: solvable, shortest path 6–12 steps.
  maze: [
    [ // round 1
      { prompt: "Help Pip reach the acorn!", say: "Tap the path squares to walk Pip to the acorn!",
        grid: [[0,0,0,1,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]],
        start: [1,0], goal: [4,3],
        why: "You found the way around the hedges — Pip has his acorn!" },
      { prompt: "Help Pip reach the acorn!", say: "The hedges make a wall. Find the way through!",
        grid: [[0,0,0,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0]],
        start: [0,2], goal: [4,2],
        why: "You slipped past the hedge wall at the side — clever!" },
      { prompt: "Help Pip reach the acorn!", say: "This one zigzags! Walk Pip all the way to the acorn.",
        grid: [[0,0,0,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,1,1,1,0],[0,0,0,0,0]],
        start: [0,0], goal: [4,0],
        why: "Back and forth like a snake — you zigzagged Pip right to it!" }
    ],
    [ // round 2
      { prompt: "Help Pip reach the acorn!", say: "Tap the squares to walk Pip to the acorn!",
        grid: [[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,1,0,0,0]],
        start: [0,0], goal: [3,4],
        why: "Straight and steady — Pip is munching his acorn already!" },
      { prompt: "Help Pip reach the acorn!", say: "A long hedge is in the way. Find the opening!",
        grid: [[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0]],
        start: [0,0], goal: [4,2],
        why: "You spotted the one opening in the hedge — sharp eyes!" },
      { prompt: "Help Pip reach the acorn!", say: "A tricky double hedge! Take your time.",
        grid: [[0,0,0,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,1,1,1,0],[0,0,0,0,0]],
        start: [0,2], goal: [4,2],
        why: "Two hedge walls and you beat them both — amazing!" }
    ],
    [ // round 3
      { prompt: "Help Pip reach the acorn!", say: "Walk Pip through the garden to his acorn!",
        grid: [[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,1,0],[0,0,0,0,0]],
        start: [4,4], goal: [1,1],
        why: "You wound around both hedges — Pip says thank you!" },
      { prompt: "Help Pip reach the acorn!", say: "A hedge fence runs down the middle. Find a gap!",
        grid: [[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]],
        start: [2,0], goal: [2,4],
        why: "Over the top or under the bottom — you found the gap!" },
      { prompt: "Help Pip reach the acorn!", say: "This maze curls like a snail shell. Go slow and steady!",
        grid: [[0,1,0,0,0],[0,1,0,1,0],[0,1,0,1,0],[0,1,0,1,0],[0,0,0,1,0]],
        start: [0,0], goal: [0,2],
        why: "Down, across, and back up — you curled through like a champion!" }
    ],
    [ // round 4
      { prompt: "Help Pip reach the acorn!", say: "Tap the squares to bring Pip to his acorn!",
        grid: [[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,1],[0,0,0,0,0]],
        start: [1,1], goal: [4,4],
        why: "You dodged both hedges — Pip is doing a happy dance!" },
      { prompt: "Help Pip reach the acorn!", say: "The hedge has two openings. Pick your path!",
        grid: [[0,0,0,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0]],
        start: [0,3], goal: [4,1],
        why: "Either side works — and you picked a great one!" },
      { prompt: "Help Pip reach the acorn!", say: "Only one gap in this long hedge. Can you find it?",
        grid: [[0,0,0,0,0],[0,0,0,0,0],[0,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0]],
        start: [0,4], goal: [4,4],
        why: "All the way over to the little gap and back — what a journey!" }
    ],
    [ // round 5
      { prompt: "Help Pip reach the acorn!", say: "Walk Pip up the garden path to the acorn!",
        grid: [[0,0,0,0,0],[0,1,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0]],
        start: [4,0], goal: [0,2],
        why: "Up and over — Pip found his acorn thanks to you!" },
      { prompt: "Help Pip reach the acorn!", say: "A tall hedge fence! The gap is hiding somewhere.",
        grid: [[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]],
        start: [1,0], goal: [1,4],
        why: "You went all the way down to sneak past the fence — smart!" },
      { prompt: "Help Pip reach the acorn!", say: "The trickiest snail maze yet! You can do it.",
        grid: [[0,1,0,0,0],[0,1,0,1,0],[0,1,0,1,0],[0,1,0,1,0],[0,0,0,1,0]],
        start: [0,0], goal: [0,4],
        why: "What a twisty trip — you never gave up and Pip loves you for it!" }
    ],
    [ // round 6
      { prompt: "Help Pip reach the acorn!", say: "Tap the path to walk Pip to the acorn!",
        grid: [[0,0,0,0,0],[0,1,0,0,0],[0,0,0,1,0],[0,1,0,0,0],[0,0,0,0,0]],
        start: [0,0], goal: [4,4],
        why: "Corner to corner, dodging every hedge — hooray!" },
      { prompt: "Help Pip reach the acorn!", say: "Start at the bottom this time. Find the opening!",
        grid: [[0,0,0,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0]],
        start: [4,0], goal: [0,2],
        why: "You climbed past the hedge wall — Pip made it home!" },
      { prompt: "Help Pip reach the acorn!", say: "One deep dip in this maze. Down and back up!",
        grid: [[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]],
        start: [0,1], goal: [0,3],
        why: "Down into the dip and back up the other side — brave climbing!" }
    ]
  ],

  // ---------------- Thursday: ODD ONE OUT ----------------
  oddone: [
    [ // round 1
      { prompt: "Which one doesn't belong?", say: "One of these doesn't belong. Which one?",
        items: ["🍎","🍌","🍇","🚗"], answer: "🚗",
        why: "Apples, bananas, and grapes are yummy fruits — a car is not a snack!" },
      { prompt: "Which one doesn't belong?", say: "Three of these are friends. Which one is different?",
        items: ["🐦","🦋","🐝","🐟"], answer: "🐟",
        why: "Birds, butterflies, and bees fly in the sky — fish swim instead!" },
      { prompt: "Which one doesn't belong?", say: "Think hard! Which one is different?",
        items: ["🧊","⛄","🍦","🔥"], answer: "🔥",
        why: "Ice, snowmen, and ice cream are all cold — fire is hot, hot, hot!" }
    ],
    [ // round 2
      { prompt: "Which one doesn't belong?", say: "One of these doesn't belong. Which one?",
        items: ["🐶","🐱","🐰","🌳"], answer: "🌳",
        why: "Dogs, cats, and bunnies are animals — a tree is a plant!" },
      { prompt: "Which one doesn't belong?", say: "Three of these go together. Which one is different?",
        items: ["🚗","🚌","🚲","🏠"], answer: "🏠",
        why: "Cars, buses, and bikes take you places — a house stays put!" },
      { prompt: "Which one doesn't belong?", say: "Look closely! Which one is different?",
        items: ["🥕","🥦","🌽","🍪"], answer: "🍪",
        why: "Carrots, broccoli, and corn grow in gardens — cookies come from the oven!" }
    ],
    [ // round 3
      { prompt: "Which one doesn't belong?", say: "One of these doesn't belong. Which one?",
        items: ["⚽","🏀","🎾","🍕"], answer: "🍕",
        why: "You can bounce and kick balls — pizza is for eating, not bouncing!" },
      { prompt: "Which one doesn't belong?", say: "Three of these live in the same place. Which one is different?",
        items: ["🐠","🐙","🦀","🐮"], answer: "🐮",
        why: "Fish, octopuses, and crabs live in the ocean — cows live on land!" },
      { prompt: "Which one doesn't belong?", say: "This one is tricky! Which is different?",
        items: ["🌙","⭐","🦉","🌞"], answer: "🌞",
        why: "The moon, stars, and owls come out at night — the sun is a daytime friend!" }
    ],
    [ // round 4
      { prompt: "Which one doesn't belong?", say: "One of these doesn't belong. Which one?",
        items: ["👟","🧦","🥾","🧤"], answer: "🧤",
        why: "Shoes, socks, and boots go on your feet — mittens keep your hands warm!" },
      { prompt: "Which one doesn't belong?", say: "Three of these go together. Which one is different?",
        items: ["🍓","🍒","🍅","🫐"], answer: "🫐",
        why: "Strawberries, cherries, and tomatoes are red — blueberries are blue!" },
      { prompt: "Which one doesn't belong?", say: "Think about what each one does. Which is different?",
        items: ["✏️","🖍️","🖌️","✂️"], answer: "✂️",
        why: "Pencils, crayons, and brushes make marks — scissors snip and cut!" }
    ],
    [ // round 5
      { prompt: "Which one doesn't belong?", say: "One of these doesn't belong. Which one?",
        items: ["🐘","🦒","🦁","🐌"], answer: "🐌",
        why: "Elephants, giraffes, and lions are big animals — a snail is teeny tiny!" },
      { prompt: "Which one doesn't belong?", say: "Three of these go together. Which one is different?",
        items: ["🥛","🧀","🍦","🍞"], answer: "🍞",
        why: "Milk, cheese, and ice cream come from milk — bread comes from wheat!" },
      { prompt: "Which one doesn't belong?", say: "Look at how each one moves. Which is different?",
        items: ["🐸","🦘","🐰","🐢"], answer: "🐢",
        why: "Frogs, kangaroos, and bunnies hop — turtles take slow little steps!" }
    ],
    [ // round 6
      { prompt: "Which one doesn't belong?", say: "One of these doesn't belong. Which one?",
        items: ["🌹","🌻","🌷","🪨"], answer: "🪨",
        why: "Roses, sunflowers, and tulips grow and bloom — rocks just sit still!" },
      { prompt: "Which one doesn't belong?", say: "Three of these go together. Which one is different?",
        items: ["🥁","🎸","🎺","📚"], answer: "📚",
        why: "Drums, guitars, and trumpets make music — books are for reading!" },
      { prompt: "Which one doesn't belong?", say: "Think about the seasons! Which is different?",
        items: ["⛄","🧣","🧤","🩴"], answer: "🩴",
        why: "Snowmen, scarves, and mittens are for winter — flip-flops are for summer!" }
    ]
  ],

  // ---------------- Friday: SORTING ----------------
  sorting: [
    [ // round 1
      { prompt: "Sort them into the right bins!", say: "Which of these are living, and which are not?",
        title: "Living or not living?", bins: ["Living","Not living"],
        items: [["🐢","Living"],["🪨","Not living"],["🌻","Living"],["🚗","Not living"],["🐦","Living"],["⚽","Not living"]],
        why: "Living things grow and change — rocks, cars, and balls never do!" },
      { prompt: "Sort them into the right bins!", say: "Which animals live on land, and which live in water?",
        title: "Land or water?", bins: ["Land","Water"],
        items: [["🐮","Land"],["🐠","Water"],["🐰","Land"],["🐙","Water"],["🦒","Land"],["🦀","Water"]],
        why: "Some animals need dry ground, and some need splashy water to call home!" },
      { prompt: "Sort them into the right bins!", say: "Which of these are fruits, and which are vegetables?",
        title: "Fruit or vegetable?", bins: ["Fruit","Vegetable"],
        items: [["🍎","Fruit"],["🥕","Vegetable"],["🍌","Fruit"],["🥦","Vegetable"],["🍇","Fruit"],["🥬","Vegetable"]],
        why: "Fruits grow from flowers and hold seeds — veggies are roots, stems, and leaves!" }
    ],
    [ // round 2
      { prompt: "Sort them into the right bins!", say: "Which of these are hot, and which are cold?",
        title: "Hot or cold?", bins: ["Hot","Cold"],
        items: [["☀️","Hot"],["🧊","Cold"],["🍲","Hot"],["⛄","Cold"],["🔥","Hot"],["🍦","Cold"]],
        why: "Hot things warm you up, and cold things cool you down — brrr and ahh!" },
      { prompt: "Sort them into the right bins!", say: "Which of these fly, and which stay on the ground?",
        title: "Flies or stays on the ground?", bins: ["Flies","Stays on the ground"],
        items: [["🦅","Flies"],["🐘","Stays on the ground"],["🦋","Flies"],["🐢","Stays on the ground"],["🐝","Flies"],["🐄","Stays on the ground"]],
        why: "Wings take some friends up into the sky — the rest keep their feet on the ground!" },
      { prompt: "Sort them into the right bins!", say: "Which do you see in the day, and which at night?",
        title: "Day sky or night sky?", bins: ["Day sky","Night sky"],
        items: [["🌞","Day sky"],["🌙","Night sky"],["🌈","Day sky"],["⭐","Night sky"],["☁️","Day sky"],["🦉","Night sky"]],
        why: "The sky changes its outfit — sunny and bright by day, starry and quiet by night!" }
    ],
    [ // round 3
      { prompt: "Sort them into the right bins!", say: "Which of these are big, and which are small?",
        title: "Big or small?", bins: ["Big","Small"],
        items: [["🐘","Big"],["🐜","Small"],["🏔️","Big"],["🐞","Small"],["🐋","Big"],["🌱","Small"]],
        why: "Some things tower over us and some fit on a fingertip — the world has both!" },
      { prompt: "Sort them into the right bins!", say: "Which of these make sound, and which are quiet?",
        title: "Loud or quiet?", bins: ["Loud","Quiet"],
        items: [["🥁","Loud"],["🪶","Quiet"],["🚒","Loud"],["🐛","Quiet"],["🎺","Loud"],["📖","Quiet"]],
        why: "Drums boom and sirens wail — feathers and books barely whisper!" },
      { prompt: "Sort them into the right bins!", say: "Which of these float, and which sink?",
        title: "Float or sink?", bins: ["Float","Sink"],
        items: [["🦆","Float"],["🪨","Sink"],["🛟","Float"],["🔑","Sink"],["🍂","Float"],["🥄","Sink"]],
        why: "Light, airy things ride on top of the water — heavy things dive to the bottom!" }
    ],
    [ // round 4
      { prompt: "Sort them into the right bins!", say: "Which of these are healthy snacks, and which are treats?",
        title: "Everyday snack or sometimes treat?", bins: ["Everyday snack","Sometimes treat"],
        items: [["🍎","Everyday snack"],["🍭","Sometimes treat"],["🥕","Everyday snack"],["🍩","Sometimes treat"],["🍌","Everyday snack"],["🧁","Sometimes treat"]],
        why: "Everyday snacks help you grow strong — treats are extra-special sometimes fun!" },
      { prompt: "Sort them into the right bins!", say: "Which animals are babies, and which are grown-ups?",
        title: "Baby or grown-up?", bins: ["Baby","Grown-up"],
        items: [["🐣","Baby"],["🐓","Grown-up"],["🐛","Baby"],["🦋","Grown-up"],["🐸","Grown-up"],["🥚","Baby"]],
        why: "Chicks become chickens and caterpillars become butterflies — everything grows!" },
      { prompt: "Sort them into the right bins!", say: "Which of these are made by people, and which come from nature?",
        title: "Made by people or from nature?", bins: ["Made by people","From nature"],
        items: [["🚲","Made by people"],["🌊","From nature"],["🏠","Made by people"],["🌵","From nature"],["✈️","Made by people"],["🌋","From nature"]],
        why: "People build bikes and houses — oceans and cactuses grew all on their own!" }
    ],
    [ // round 5
      { prompt: "Sort them into the right bins!", say: "Which of these are for winter, and which are for summer?",
        title: "Winter or summer?", bins: ["Winter","Summer"],
        items: [["🧣","Winter"],["🩳","Summer"],["⛄","Winter"],["🏖️","Summer"],["🧤","Winter"],["🍉","Summer"]],
        why: "Cozy warm things for snowy days, cool breezy things for sunshine!" },
      { prompt: "Sort them into the right bins!", say: "Which animals are awake in the day, and which at night?",
        title: "Daytime or nighttime animal?", bins: ["Daytime","Nighttime"],
        items: [["🐝","Daytime"],["🦉","Nighttime"],["🦋","Daytime"],["🦇","Nighttime"],["🐓","Daytime"],["🦝","Nighttime"]],
        why: "Some animals love sunshine, and some do their best exploring in the dark!" },
      { prompt: "Sort them into the right bins!", say: "Which of these use wheels, and which use wings?",
        title: "Wheels or wings?", bins: ["Wheels","Wings"],
        items: [["🚗","Wheels"],["🦅","Wings"],["🚲","Wheels"],["✈️","Wings"],["🛴","Wheels"],["🐦","Wings"]],
        why: "Wheels roll along the ground, wings lift you into the sky!" }
    ],
    [ // round 6
      { prompt: "Sort them into the right bins!", say: "Which of these are soft, and which are hard?",
        title: "Soft or hard?", bins: ["Soft","Hard"],
        items: [["🧸","Soft"],["🪨","Hard"],["☁️","Soft"],["🔨","Hard"],["🐑","Soft"],["🐚","Hard"]],
        why: "Soft things squish and cuddle — hard things stay strong and sturdy!" },
      { prompt: "Sort them into the right bins!", say: "Which of these grow on trees, and which grow underground?",
        title: "On a tree or underground?", bins: ["On a tree","Underground"],
        items: [["🍎","On a tree"],["🥕","Underground"],["🍒","On a tree"],["🥔","Underground"],["🍑","On a tree"],["🧅","Underground"]],
        why: "Some food dangles from branches, and some hides down in the dirt!" },
      { prompt: "Sort them into the right bins!", say: "Which of these need electricity, and which do not?",
        title: "Needs a plug or no plug?", bins: ["Needs a plug","No plug"],
        items: [["📺","Needs a plug"],["📚","No plug"],["🧺","No plug"],["💡","Needs a plug"],["🖍️","No plug"],["🔌","Needs a plug"]],
        why: "Some helpers need electric power — and some just need you!" }
    ]
  ],

  // ---------------- Saturday: SHADOW MATCH ----------------
  shadow: [
    [ // round 1
      { prompt: "Which shadow matches?", say: "Look at the butterfly. Which shadow is hers?",
        item: "🦋", options: ["🦋","🐦","🌸"], answer: "🦋",
        why: "Only the butterfly shadow has those two wide fluttery wings!" },
      { prompt: "Which shadow matches?", say: "Look at the bunny. Which shadow is his?",
        item: "🐰", options: ["🐿️","🐰","🐱"], answer: "🐰",
        why: "Those two long tall ears could only belong to the bunny!" },
      { prompt: "Which shadow matches?", say: "Look at the teapot. Which shadow matches?",
        item: "🫖", options: ["☕","🏺","🫖"], answer: "🫖",
        why: "The round belly, the spout, AND the little handle — that's the teapot!" }
    ],
    [ // round 2
      { prompt: "Which shadow matches?", say: "Look at the fish. Which shadow is hers?",
        item: "🐟", options: ["🐟","🐬","🦈"], answer: "🐟",
        why: "The small round body and fan tail match the little fish just right!" },
      { prompt: "Which shadow matches?", say: "Look at the tree. Which shadow is its match?",
        item: "🌳", options: ["🌵","🌳","🍄"], answer: "🌳",
        why: "The big fluffy round top on a trunk is the tree's shadow!" },
      { prompt: "Which shadow matches?", say: "Look at the rocket. Which shadow matches?",
        item: "🚀", options: ["✈️","🛸","🚀"], answer: "🚀",
        why: "Pointy nose up top and little fins below — that's the rocket for sure!" }
    ],
    [ // round 3
      { prompt: "Which shadow matches?", say: "Look at the duck. Which shadow is hers?",
        item: "🦆", options: ["🦆","🐔","🦢"], answer: "🦆",
        why: "The short neck and round flat bill belong to the duck!" },
      { prompt: "Which shadow matches?", say: "Look at the umbrella. Which shadow matches?",
        item: "☂️", options: ["🍄","☂️","🎈"], answer: "☂️",
        why: "A wide curvy top with a hook handle — only the umbrella has that!" },
      { prompt: "Which shadow matches?", say: "Look at the crab. Which shadow is his?",
        item: "🦀", options: ["🕷️","🐢","🦀"], answer: "🦀",
        why: "Those two big pinchy claws give the crab's shadow away!" }
    ],
    [ // round 4
      { prompt: "Which shadow matches?", say: "Look at the cat. Which shadow is hers?",
        item: "🐱", options: ["🐱","🐶","🦊"], answer: "🐱",
        why: "Pointy ears and round cheeks — that's the kitty's shadow!" },
      { prompt: "Which shadow matches?", say: "Look at the sailboat. Which shadow matches?",
        item: "⛵", options: ["🚤","⛵","🛶"], answer: "⛵",
        why: "The tall triangle sail is the sailboat's special shape!" },
      { prompt: "Which shadow matches?", say: "Look at the snail. Which shadow is his?",
        item: "🐌", options: ["🐚","🐢","🐌"], answer: "🐌",
        why: "A swirly shell on a slidey body — only the snail matches!" }
    ],
    [ // round 5
      { prompt: "Which shadow matches?", say: "Look at the elephant. Which shadow is hers?",
        item: "🐘", options: ["🐘","🦏","🦛"], answer: "🐘",
        why: "Big flappy ears and a long trunk — the elephant, of course!" },
      { prompt: "Which shadow matches?", say: "Look at the cupcake. Which shadow matches?",
        item: "🧁", options: ["🍦","🧁","🍰"], answer: "🧁",
        why: "The wrinkly cup on the bottom and swirl on top match the cupcake!" },
      { prompt: "Which shadow matches?", say: "Look at the dragonfly. Which shadow is hers?",
        item: "🪰", options: ["🐝","🦋","🪰"], answer: "🪰",
        why: "Skinny body, see-through wings — that's our little flyer!" }
    ],
    [ // round 6
      { prompt: "Which shadow matches?", say: "Look at the owl. Which shadow is his?",
        item: "🦉", options: ["🦉","🐧","🐦"], answer: "🦉",
        why: "The round head with two little ear tufts belongs to the wise owl!" },
      { prompt: "Which shadow matches?", say: "Look at the bicycle. Which shadow matches?",
        item: "🚲", options: ["🛵","🚲","🛴"], answer: "🚲",
        why: "Two big wheels and pedals — the bicycle's shadow rolls right in!" },
      { prompt: "Which shadow matches?", say: "Look at the hedgehog. Which shadow is hers?",
        item: "🦔", options: ["🐿️","🐭","🦔"], answer: "🦔",
        why: "That spiky little back could only be the hedgehog!" }
    ]
  ],

  // ---------------- Sunday: BUILD IT ----------------
  // target = block rows from TOP to BOTTOM.
  build: [
    [ // round 1
      { prompt: "Which blocks copy the tower?", say: "Look at the tower. Which blocks copy it?",
        target: [["🟥","🟥"],["🟦"]],
        options: ["🟥🟥 two red blocks on top of 🟦 one blue block","🟦 one blue block on top of 🟥🟥 two red blocks","🟥 one red block on top of 🟦🟦 two blue blocks"],
        answer: "🟥🟥 two red blocks on top of 🟦 one blue block",
        why: "Two red up top, one blue below — a perfect copy!" },
      { prompt: "Which blocks copy the tower?", say: "This tower has three floors. Which blocks copy it?",
        target: [["🟨"],["🟩","🟩"],["🟦","🟦","🟦"]],
        options: ["🟨 one yellow, then 🟩🟩 two green, then 🟦🟦🟦 three blue","🟦🟦🟦 three blue, then 🟩🟩 two green, then 🟨 one yellow","🟨🟨 two yellow, then 🟩 one green, then 🟦🟦 two blue"],
        answer: "🟨 one yellow, then 🟩🟩 two green, then 🟦🟦🟦 three blue",
        why: "It stacks like stairs — one, two, three from top to bottom!" },
      { prompt: "Which blocks copy the tower?", say: "Look very closely at the colors. Which blocks copy it?",
        target: [["🟪"],["🟧","🟪"],["🟪","🟧"]],
        options: ["🟪 purple on top, 🟧🟪 orange-purple in the middle, 🟪🟧 purple-orange on the bottom","🟪 purple on top, 🟪🟧 purple-orange in the middle, 🟧🟪 orange-purple on the bottom","🟧 orange on top, 🟪🟪 two purple in the middle, 🟪🟧 purple-orange on the bottom"],
        answer: "🟪 purple on top, 🟧🟪 orange-purple in the middle, 🟪🟧 purple-orange on the bottom",
        why: "The orange and purple swap places on each floor — you caught it!" }
    ],
    [ // round 2
      { prompt: "Which blocks copy the tower?", say: "Look at the tower. Which blocks copy it?",
        target: [["🟩"],["🟨","🟨"]],
        options: ["🟩 one green block on top of 🟨🟨 two yellow blocks","🟨 one yellow block on top of 🟩🟩 two green blocks","🟩🟩 two green blocks on top of 🟨 one yellow block"],
        answer: "🟩 one green block on top of 🟨🟨 two yellow blocks",
        why: "One green sits right on two yellows — matched!" },
      { prompt: "Which blocks copy the tower?", say: "This tower is wider at the top! Which blocks copy it?",
        target: [["🟦","🟦","🟦"],["🟥","🟥"],["🟨"]],
        options: ["🟦🟦🟦 three blue, then 🟥🟥 two red, then 🟨 one yellow","🟨 one yellow, then 🟥🟥 two red, then 🟦🟦🟦 three blue","🟦🟦 two blue, then 🟥🟥🟥 three red, then 🟨 one yellow"],
        answer: "🟦🟦🟦 three blue, then 🟥🟥 two red, then 🟨 one yellow",
        why: "It's upside-down stairs — wide on top, narrow below. Tricky and you got it!" },
      { prompt: "Which blocks copy the tower?", say: "Four floors this time! Which blocks copy it?",
        target: [["🟥"],["🟥"],["🟩","🟩"],["🟩","🟩"]],
        options: ["🟥 red, 🟥 red, then 🟩🟩 green, 🟩🟩 green","🟥🟥 two red, then 🟩🟩 green, 🟩🟩 green","🟩 green, 🟥 red, 🟥🟥 two red, 🟩🟩 green"],
        answer: "🟥 red, 🟥 red, then 🟩🟩 green, 🟩🟩 green",
        why: "A tall red chimney standing on a strong green base — exactly right!" }
    ],
    [ // round 3
      { prompt: "Which blocks copy the tower?", say: "Look at the tower. Which blocks copy it?",
        target: [["🟧"],["🟧"],["🟧"]],
        options: ["🟧 🟧 🟧 three orange blocks in one tall stack","🟧🟧🟧 three orange blocks in one flat row","🟧🟧 two orange blocks side by side"],
        answer: "🟧 🟧 🟧 three orange blocks in one tall stack",
        why: "Straight up like a tower of pancakes — three oranges tall!" },
      { prompt: "Which blocks copy the tower?", say: "Look at where each color sits. Which blocks copy it?",
        target: [["🟦","🟨"],["🟨","🟦"]],
        options: ["🟦🟨 blue-yellow on top, 🟨🟦 yellow-blue on the bottom","🟨🟦 yellow-blue on top, 🟦🟨 blue-yellow on the bottom","🟦🟦 two blue on top, 🟨🟨 two yellow on the bottom"],
        answer: "🟦🟨 blue-yellow on top, 🟨🟦 yellow-blue on the bottom",
        why: "The colors trade places like a checkerboard — sharp eyes!" },
      { prompt: "Which blocks copy the tower?", say: "The big one! Look floor by floor. Which blocks copy it?",
        target: [["🟪","🟪"],["🟨"],["🟪","🟪","🟪"]],
        options: ["🟪🟪 two purple, then 🟨 one yellow, then 🟪🟪🟪 three purple","🟪🟪🟪 three purple, then 🟨 one yellow, then 🟪🟪 two purple","🟪🟪 two purple, then 🟨🟨 two yellow, then 🟪🟪 two purple"],
        answer: "🟪🟪 two purple, then 🟨 one yellow, then 🟪🟪🟪 three purple",
        why: "One little yellow squeezed in the middle — you spotted every floor!" }
    ],
    [ // round 4
      { prompt: "Which blocks copy the tower?", say: "Look at the tower. Which blocks copy it?",
        target: [["🟨","🟨"],["🟥","🟥"]],
        options: ["🟨🟨 two yellow blocks on top of 🟥🟥 two red blocks","🟥🟥 two red blocks on top of 🟨🟨 two yellow blocks","🟨 one yellow block on top of 🟥 one red block"],
        answer: "🟨🟨 two yellow blocks on top of 🟥🟥 two red blocks",
        why: "Yellow floor over red floor — a perfect little building!" },
      { prompt: "Which blocks copy the tower?", say: "Count carefully! Which blocks copy it?",
        target: [["🟩"],["🟩","🟩","🟩"],["🟩"]],
        options: ["🟩 one green, then 🟩🟩🟩 three green, then 🟩 one green","🟩🟩🟩 three green, then 🟩 one green, then 🟩🟩🟩 three green","🟩🟩 two green, then 🟩 one green, then 🟩🟩 two green"],
        answer: "🟩 one green, then 🟩🟩🟩 three green, then 🟩 one green",
        why: "Skinny, wide, skinny — like a little green airplane!" },
      { prompt: "Which blocks copy the tower?", say: "Every floor is different! Which blocks copy it?",
        target: [["🟦"],["🟨","🟥"],["🟥","🟨","🟦"]],
        options: ["🟦 blue, then 🟨🟥 yellow-red, then 🟥🟨🟦 red-yellow-blue","🟦 blue, then 🟥🟨 red-yellow, then 🟦🟨🟥 blue-yellow-red","🟥 red, then 🟨🟦 yellow-blue, then 🟥🟨🟦 red-yellow-blue"],
        answer: "🟦 blue, then 🟨🟥 yellow-red, then 🟥🟨🟦 red-yellow-blue",
        why: "Three floors, every color in its exact spot — master builder!" }
    ],
    [ // round 5
      { prompt: "Which blocks copy the tower?", say: "Look at the tower. Which blocks copy it?",
        target: [["🟦","🟦"],["🟦","🟦"]],
        options: ["🟦🟦 two blue on top of 🟦🟦 two blue — a blue square","🟦🟦🟦🟦 four blue blocks in one flat row","🟦 🟦 🟦 🟦 four blue blocks in one tall stack"],
        answer: "🟦🟦 two blue on top of 🟦🟦 two blue — a blue square",
        why: "Two and two make a strong blue square — just like the picture!" },
      { prompt: "Which blocks copy the tower?", say: "Which blocks copy this bridge?",
        target: [["🟥","🟥","🟥"],["🟨","🟨"]],
        options: ["🟥🟥🟥 three red on top of 🟨🟨 two yellow","🟨🟨 two yellow on top of 🟥🟥🟥 three red","🟥🟥 two red on top of 🟨🟨🟨 three yellow"],
        answer: "🟥🟥🟥 three red on top of 🟨🟨 two yellow",
        why: "The long red top rests on two yellow legs — a beautiful bridge!" },
      { prompt: "Which blocks copy the tower?", say: "Four floors — take your time! Which blocks copy it?",
        target: [["🟨"],["🟦","🟦"],["🟨"],["🟦","🟦"]],
        options: ["🟨 yellow, 🟦🟦 two blue, 🟨 yellow, 🟦🟦 two blue","🟦🟦 two blue, 🟨 yellow, 🟦🟦 two blue, 🟨 yellow","🟨 yellow, 🟦 blue, 🟨 yellow, 🟦 blue"],
        answer: "🟨 yellow, 🟦🟦 two blue, 🟨 yellow, 🟦🟦 two blue",
        why: "Yellow, blue-blue, yellow, blue-blue — a pattern tower and you nailed it!" }
    ],
    [ // round 6
      { prompt: "Which blocks copy the tower?", say: "Look at the tower. Which blocks copy it?",
        target: [["🟪"],["🟪","🟪"]],
        options: ["🟪 one purple block on top of 🟪🟪 two purple blocks","🟪🟪 two purple blocks on top of 🟪 one purple block","🟪🟪🟪 three purple blocks in one flat row"],
        answer: "🟪 one purple block on top of 🟪🟪 two purple blocks",
        why: "One little purple sitting on two — a cozy purple hill!" },
      { prompt: "Which blocks copy the tower?", say: "Look at both sides! Which blocks copy it?",
        target: [["🟥","🟩"],["🟥","🟩"],["🟥","🟩"]],
        options: ["🟥🟩 red-green on every floor, three floors tall","🟩🟥 green-red on every floor, three floors tall","🟥🟥 two red, then 🟩🟩 two green, then 🟥🟩 red-green"],
        answer: "🟥🟩 red-green on every floor, three floors tall",
        why: "Red always on the left, green always on the right — three floors of it!" },
      { prompt: "Which blocks copy the tower?", say: "The grand castle! Which blocks copy it?",
        target: [["🟨","🟨"],["🟦"],["🟨","🟨"],["🟦","🟦","🟦"]],
        options: ["🟨🟨 two yellow, 🟦 one blue, 🟨🟨 two yellow, 🟦🟦🟦 three blue","🟦🟦🟦 three blue, 🟨🟨 two yellow, 🟦 one blue, 🟨🟨 two yellow","🟨🟨 two yellow, 🟦🟦 two blue, 🟨 one yellow, 🟦🟦🟦 three blue"],
        answer: "🟨🟨 two yellow, 🟦 one blue, 🟨🟨 two yellow, 🟦🟦🟦 three blue",
        why: "Four floors, colors just right — you built the grand castle!" }
    ]
  ]
};

// ------------------------------------------------------------
// FOSSIL_SITES — Treasure Dig (§6.6).
// mask = 3 rows × 6 cols of 0/1 matching the 6-wide × 3-tall dig
// grid; 1 = a fossil tile (8–12 per site, connected blob).
// Every fact is TRUE and read aloud by Owl on fossil-complete.
// ------------------------------------------------------------
const FOSSIL_SITES = [
  { id: "site_sunny_canyon", name: "Sunny Canyon",
    fossil: { emoji: "🦕", name: "Brontosaurus",
      fact: "A Brontosaurus was longer than two school buses parked end to end!" },
    mask: [
      [1,1,0,0,0,0],
      [0,1,1,1,1,1],
      [0,0,1,1,0,1]
    ] },
  { id: "site_thunder_mesa", name: "Thunder Mesa",
    fossil: { emoji: "🦕", name: "Triceratops",
      fact: "A Triceratops had three horns and a head almost as long as a whole bed!" },
    mask: [
      [0,1,1,1,1,0],
      [0,1,1,1,1,0],
      [0,0,1,1,0,0]
    ] },
  { id: "site_pebble_gulch", name: "Pebble Gulch",
    fossil: { emoji: "🦕", name: "Stegosaurus",
      fact: "A Stegosaurus was as big as a car, but its brain was only the size of a walnut!" },
    mask: [
      [0,0,1,1,0,0],
      [0,1,1,1,1,0],
      [1,1,0,0,1,1]
    ] },
  { id: "site_roarrock_ridge", name: "Roar-Rock Ridge",
    fossil: { emoji: "🦖", name: "T. rex Tooth",
      fact: "One T. rex tooth could grow as big as a banana!" },
    mask: [
      [0,1,1,1,1,0],
      [0,0,1,1,0,0],
      [0,0,1,1,0,0]
    ] },
  { id: "site_seashell_flats", name: "Seashell Flats",
    fossil: { emoji: "🐚", name: "Ammonite",
      fact: "An ammonite was a sea animal with a swirly shell — a cousin of the octopus!" },
    mask: [
      [1,1,1,1,0,0],
      [1,0,0,1,0,0],
      [1,1,1,1,1,0]
    ] },
  { id: "site_fern_hollow", name: "Fern Hollow",
    fossil: { emoji: "🌿", name: "Fern Leaf",
      fact: "Ferns grew on Earth long before the very first dinosaurs hatched!" },
    mask: [
      [0,0,1,0,0,0],
      [0,1,1,1,0,0],
      [1,1,1,1,1,0]
    ] },
  { id: "site_splash_basin", name: "Splash Basin",
    fossil: { emoji: "🐟", name: "Ancient Fish",
      fact: "Fish were swimming in the oceans millions of years before dinosaurs walked on land!" },
    mask: [
      [0,1,1,1,0,1],
      [1,1,1,1,1,1],
      [0,0,0,0,0,0]
    ] },
  { id: "site_stomp_valley", name: "Stomp Valley",
    fossil: { emoji: "🐾", name: "Dinosaur Footprint",
      fact: "Some dinosaur footprints are so big that a kid could sit inside one!" },
    mask: [
      [0,1,0,1,0,1],
      [0,1,1,1,1,1],
      [0,0,1,1,1,0]
    ] },
  { id: "site_shimmer_marsh", name: "Shimmer Marsh",
    fossil: { emoji: "🪰", name: "Giant Dragonfly",
      fact: "Long, long ago, some dragonflies grew wings as wide as a hawk's!" },
    mask: [
      [1,1,0,1,1,0],
      [0,1,1,1,0,0],
      [0,0,1,0,0,0]
    ] },
  { id: "site_frosty_bluff", name: "Frosty Bluff",
    fossil: { emoji: "🦴", name: "Mammoth Tusk",
      fact: "A woolly mammoth's tusk could grow longer than a grown-up is tall!" },
    mask: [
      [0,0,0,0,1,1],
      [0,1,1,1,1,0],
      [1,1,0,0,0,0]
    ] }
];

// ------------------------------------------------------------
// DECORATIONS — Prize Shelf (§7). Cosmetic only; prices 15–80 🎟️.
// ------------------------------------------------------------
const DECORATIONS = [
  { id: "dec_mushroom_lamp", emoji: "🍄", name: "Mushroom Lamp",  price: 15 },
  { id: "dec_birdhouse",     emoji: "🏠", name: "Birdhouse",      price: 20 },
  { id: "dec_wind_chime",    emoji: "🎐", name: "Wind Chime",     price: 25 },
  { id: "dec_garden_gnome",  emoji: "🧙", name: "Garden Gnome",   price: 30 },
  { id: "dec_cozy_bench",    emoji: "🪑", name: "Cozy Bench",     price: 35 },
  { id: "dec_bird_bath",     emoji: "🛁", name: "Bird Bath",      price: 40 },
  { id: "dec_lantern",       emoji: "🏮", name: "Glow Lantern",   price: 45 },
  { id: "dec_sundial",       emoji: "🕰️", name: "Sundial",        price: 50 },
  { id: "dec_flamingo",      emoji: "🦩", name: "Pink Flamingo",  price: 55 },
  { id: "dec_tire_swing",    emoji: "🛞", name: "Tire Swing",     price: 60 },
  { id: "dec_fountain",      emoji: "⛲", name: "Stone Fountain", price: 70 },
  { id: "dec_koi_pond",      emoji: "🐠", name: "Koi Pond",       price: 80 }
];

// ------------------------------------------------------------
// QUIZ_SILLY — Owl's Quiz Show (§6.5): the ONE silly wrong-answer
// option per question. Harmless-funny, never gross or scary.
// ------------------------------------------------------------
const QUIZ_SILLY = [
  "🧦 Warm socks",
  "🍕 A sleepy pizza",
  "🐢 A turtle in a top hat",
  "🧀 The moon's cheese collection",
  "🦄 A unicorn's lost sneaker",
  "🥞 A tower of pancakes",
  "🎩 A very fancy hat",
  "🐌 A snail on a skateboard",
  "🍌 A banana wearing sunglasses",
  "🛁 A bubble bath for frogs",
  "🧸 A teddy bear's birthday cake",
  "🌮 A dancing taco",
  "🐧 A penguin's beach towel",
  "🎈 Seventeen red balloons",
  "🧦 A sock full of giggles",
  "🍩 A donut rolling downhill",
  "🐮 A cow who moos the alphabet",
  "🪁 A kite stuck in spaghetti",
  "🦆 A duck who says 'meow'",
  "🍦 Invisible ice cream",
  "🎺 A trumpet full of confetti",
  "🐰 A bunny's tiny umbrella",
  "🧁 A cupcake doing jumping jacks",
  "🚂 A train made of jelly beans",
  "🐙 An octopus juggling mittens",
  "🌈 A rainbow's lunchbox",
  "🥕 A carrot playing hide-and-seek",
  "🛸 A very polite flying saucer",
  "🐝 A bee who forgot how to buzz",
  "🍿 Popcorn that pops backwards",
  "🎪 A flea circus on vacation",
  "🧜 A mermaid's rubber boots",
  "🦖 A dinosaur's pet goldfish",
  "🍉 A watermelon wearing a bow tie",
  "🐈 A cat napping on a cloud",
  "🎨 A paintbrush that only paints polka dots",
  "🥨 A pretzel doing yoga",
  "🪀 A yo-yo with hiccups",
  "🐔 A chicken's alarm clock",
  "🫧 A jar of extra-shiny bubbles"
];

// ------------------------------------------------------------
// Node export guard for the test harness (browser just uses the
// globals, exactly like content2.js).
// ------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PUZZLE_BANK, FOSSIL_SITES, DECORATIONS, QUIZ_SILLY };
}
