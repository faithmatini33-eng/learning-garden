# Handoff: Learning Garden — Additional Screens (v2)

## Overview
Second design drop for **Learning Garden**. The original handoff (dashboard, practice, session, week, progress, tutor, grown-ups, etc.) is already implemented — **this bundle contains only the NEW screens**: My Garden world, Sprint mode, the three remaining question types, Tutor Owl's other tabs, the My Lessons creator, gates/edge states, and delight + accessibility extras.

## About the Design Files
`Kids Learning App - Additions.dc.html` (see Files) is a design reference in HTML — recreate these designs inside the existing Learning Garden codebase using its established patterns; do not ship the HTML. **Every screen also has a pixel-exact PNG in `screenshots/` — match those exactly. When the HTML reference and your implementation disagree, the screenshot is the source of truth.**

## Fidelity
**High-fidelity.** Same design system as the first handoff (tokens repeated below for convenience). Match the screenshots 1:1.

## Design Tokens (unchanged from v1)
Fonts: **Nunito 800/700** (headings, numbers) + **Be Vietnam Pro 400–700** (body/UI). App bg `#FBF6EF`; parent bg `#F6F3ED`; ink `#2A2320`; muted `#8a7e74`; card border `#EDE4D6` 1px, radius 16–20px, shadow `0 2px 12px rgba(43,33,28,.05)`; buttons/chips pill (100px). Subject colors: Math terra `#D05C38`/`#B8491A`, Language teal `#1F8A80`, Science green `#4E9B6B`, Spanish gold `#C98A2B`, Social purple `#8E6BB0`, Computer blue `#4A7FB5`; water `#4FA3D1`; sun `#F2B035`/`#FFD84D`. Lucide icons, stroke 2, currentColor. Sounds/animations per the v1 motion & sound kit (`sounds.js`).

## New Screens

### 9a — My Garden (screenshots/9a-my-garden.png)
Full-screen destination from Profile ("Visit my garden") and the dashboard garden panel. Layered scene: sky gradient `#BFE0EF → #DDEFE0`, grass band `#A8CF8E → #8FBB75` from 42% down; sun (56px `#FFD84D` circle + radial glow) top-right; 3 white ellipse clouds. Header overlays scene: back button (white 38px rounded), "Maya's Garden" Nunito 800 26px, right chip "7 of 122 skills planted". Plot grid: 6 columns × 2 rows on the grass; each plot = brown ellipse mound `#8a6844` at 55% opacity (78×18). Mastered skills = gold daisy SVGs (64px, gentle float animation); in-progress = pink bloom / tulip / sprout SVGs at smaller sizes; empty = small seed circle; locked = dashed mound + "?" at 40% ink. Tapping a plant shows a dark tooltip: "Doubles facts · mastered Jan 8". Fox mascot bottom-left with speech bubble; bottom-right buttons: white "Garden album" + terra "Plant more — practice".

### 9b — Sprint (screenshots/9b-sprint.png)
60-second fact drill, focused mode (no bottom nav). Top bar: close ✕, blue laptop... (zap icon tile `#E4EDF6`/`#4A7FB5`), "Sprint · Addition facts", right chips "✓ 12 solved" and "award best 15" (both white-space:nowrap). Center, side by side: (1) timer ring — 120px conic-gradient `#4A7FB5` on `#E9E0D0`, inner white circle with "0:42 / LEFT"; below it 6 dots showing the last answers (green `#4E9B6B`, misses terra) + caption. (2) problem card: "7 + 8 =" Nunito 800 84px (nowrap) + 130px answer slot with blue bottom border and caret; keypad grid 3×108px keys, 66px tall, radius 14 (1–9, delete `#F6EFE4`, 0, blue confirm `#4A7FB5` with white check). Key press = `key()` sound + dip. Fox bubble: "Three more beats your best!". Ends with the 5b-style celebration.

### 9c — Question types (screenshots/9c-question-types.png)
Three question-card layouts used inside the standard session chrome (3b):
- **line** — "Tap where 35 lives!": SVG number line 0–50, major ticks every 10 with Nunito 800 labels, minor ticks every 5; whole line tappable in 48px zones; the chosen spot = terra dot (13px, white center); correct pops green and the frog hops to it.
- **num** — "What is 46 − 19?": answer box 2px blue border + caret + blue "Check" pill; a single-row on-screen keypad (46px keys) always visible.
- **compare** — "Which sign makes this true?": two 40px number cards, dashed gold "?" tile between; three sign buttons 76×56 (< = >), correct = green border/tint. After a miss show "the alligator eats the bigger number".

### 9d — Tutor Owl, other tabs (screenshots/9d-tutor-tabs.png)
Same Tutor chrome as v1 (teal hero + tab chips). New tab contents:
- **Word-problem wizard** — vertical step trail like the math tutor: step 1 done (green strip "Read your problem out loud — twice!"), step 2 active (2px teal border, "What is the story asking you to find?" with choice chips: how many in all / are left / more), step 3 locked dashed ("Circle the numbers you'll use"), owl bubble nudging on clue words.
- **Tricky words** — big word card: "be·cause" Nunito 800 44px with a purple `#8E6BB0` syllable dot; buttons: purple "hear it" (speechSynthesis), outlined "say it with me", neutral "I know it now ✓". Below: "My tricky words" chips (purple tint) + dashed "+ add a word".
- **Cheat sheets** — clue-words list rows: colored operator tile (+ green, − terra, = blue, clock gold), quoted clue words, right-aligned verdict; "print" link uses worksheet print path.

### 9e — My Lessons creator (screenshots/9e-my-lessons-creator.png)
Parent screen (teal header bar, Save lesson / Back). Left card: lesson name input, "shows under" chips (My Lessons active purple / Language / Math); question rows — numbered purple tile, prompt, "✓ answer · wrong: …" line, edit pencil; the active row has a 2px teal border, inline text caret, and chips "✓ answer: thought" + dashed "+ wrong answer"; "+ Add a question" teal chip. Right: "How Maya will see it" preview (the exact Practice skill-card with seed icon + MY LESSONS badge) and a tips card (5–10 questions; typed wrong answers become distractors; questions auto read aloud).

### 9f — Gates & edge states (screenshots/9f-gates-and-states.png)
- **Grown-ups gate** — modal on `#F6F3ED`: lock tile, "Grown-ups only", a rotating times-table question ("What is 6 × 7?"), two 64×52 digit boxes + teal Enter. No PIN to forget.
- **First-day empty dashboard** — replaces stats/plan until the first checkup: seed + sprout illustration, "Let's plant your first seed!", copy about the 5-minute Garden Checkup, terra "Start the checkup". Never show zeroed stats.
- **Welcome back (streak reset)** — sky-to-grass gradient card: fox, "We missed you, Maya!", "Your garden waited for you — nothing wilted. Water it today and a brand-new streak begins.", terra "Start today's plan". Never say "you lost your streak".

### 9g — Delight & accessibility (screenshots/9g-delight-access.png)
Six features, each demoed in the board:
1. **Avatar rewards** — one cosmetic accessory unlocked per level (hat/scarf/glasses layered on the animal emoji), chosen on Profile.
2. **Weekly treasure chest** — all 5 school-day plans done → chest opens Saturday with a garden decoration placed in My Garden.
3. **Printable certificates** — mastering a whole strand prints "Maya mastered Place Value!" (gold-bordered, worksheet print path).
4. **Session mood picker** — after 6 PM, Today offers "I have 5 minutes / I have 15"; 5-min shrinks the plan to 1 skill, streak still counts.
5. **Read-aloud everywhere** — the speaker button appears on every prompt in every subject (speechSynthesis).
6. **Accessibility toggles** (in Settings) — dyslexia-friendly font (Andika/OpenDyslexic), calm-motion mode honoring `prefers-reduced-motion`, and correct/wrong always conveyed with shape + color, never color alone.

## State Management (new)
Per kid in `DB.settings[kidId]`: `accessories` (array of unlocked ids + `equipped`), `moodMinutes` (5|15, resets daily), `easyFont` (bool), `calmMotion` (bool), `trickyWords` (array). `DB.garden[kidId]`: decorations placed (from chests). Sprint already persists in `DB.sprint`.

## Files
- `Kids Learning App - Additions.dc.html` — HTML reference of just the new screens (open in a browser; loads `support.js`)
- `screenshots/` — **pixel-exact reference PNGs, the source of truth** (9a–9g)
- `sounds.js`, `image-slot.js`, `support.js` — same helpers as v1 (sounds.js is production-ready)
