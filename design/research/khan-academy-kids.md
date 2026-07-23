# Khan Academy Kids — research & gap analysis for Learning Garden
_Researched 2026-07-23 (web sources cross-checked; single-sourced items marked). Purpose: find what the best free kids' learning app does that Learning Garden doesn't, and turn it into an adapt-don't-copy proposal for Faith to approve. Nothing here is auto-built._

## What Khan Kids does (findings)

### Design & art direction
- Built by the Duck Duck Moose team (acquired by Khan Academy 2016; IDEO-design roots; "Sesame Street sensibility" — original characters, animation, and music made in-house for young kids).
- Visual style: bright, rounded, hand-illustrated animal characters; high production quality noted by nearly every reviewer (Common Sense Media, Tech & Learning, edu.com).
- **Audio-first**: every activity pairs spoken narration with visual cues, so reading is never a barrier; instructions are "spoken clearly and slowly."
- Navigation: one big start button (the Learning Path), a Library to browse by topic, and the character cast along the bottom. First-time kids navigate it with no help.
- Caveat from reviewers: the animation sometimes adds distraction ("extraneous cognitive load") — even fans admit it.

### The characters (the key insight)
Cast of five, each from a different continent: **Kodi** (Kodiak bear — the main guide/narrator), **Reya** (red panda — storytime/writing), **Peck** (hummingbird — numbers), **Sandy** (dingo — puzzles/logic), **Ollo** (elephant — phonics).

What makes them work pedagogically (vs decorative):
- **One consistent narrator** (Kodi) speaks instructions, reacts to answers, hints on misses, celebrates on wins. No "game over" screens — wrong answers get gentle encouragement to retry (single-sourced phrasing; mechanism corroborated: hints and scaffolds instead of bare "wrong," which "prevents students from practicing errors").
- **Subject specialists**: each character owns a domain, so a subject feels like visiting a friend.
- **Rewards flow TO the characters**: kids collect toys/hats/bugs *for* the characters and decorate their rooms — the emotional bond powers the reward loop.
- **Characters are content**: the 2nd-grade books star the cast working through friendship/feelings — SEL delivered through story.

### Learning flow
- Concept introduced with a short narrated/animated teaching moment → **immediately applied** in embedded interactive checks. Instruction and practice interleave; they're never separated.
- Feedback is hint-first, then scaffolded down; struggle produces *varied* practice (different formats), not the same drill repeated.
- Mastery-based path: skips what's known, backfills what isn't. Parents can set per-subject levels manually.
- The path cycles subjects AND content types (activity → book → song → creative task) so sessions don't feel like drilling.

### Engagement
- Prize-per-activity (intermittent, tied to completion + accuracy) → character rooms as the trophy shelf.
- Always-available **Create** corner (drawing/coloring) — a no-stakes pressure valve.
- Offline: "Kodi's Suitcase" curated shelf. Printable packs, weekly planner, summer camp weeks.
- No ads, no purchases, no streak-shaming, no timers on the path.

### Parent/teacher
- Free in-app reports (assignments + cumulative per-subject progress) with **assign-from-report**; 2025 Parent Dashboard adds minutes/skills/lessons at a glance (single-sourced: Khan blog). Reviewers still call home tracking "minimal" — it's Khan Kids' weak spot.

### 2nd-grade content
- Hundreds of 2nd-grade math lessons; ELA through 2nd grade; character books; NatGeo non-fiction. BUT reviewers agree the app is strongest ages 2–6 and **thinnest at exactly 2nd grade** — kids age out into big Khan Academy. Learning Garden's 122-skill, 6-subject catalog is already *broader at this age* (Khan Kids has no Spanish, typing, social studies, or parent-authored lessons).

## Honest gaps — what Khan Kids does that Learning Garden doesn't
1. **Teaches before it asks** — narrated demonstration → guided checks → independent practice. Our 📖 Learn cards are static text the kid reads alone. (Faith's #1 ask.)
2. **A persistent narrator-coach** — our owl lives mostly in the Tutor; practice sessions are silent right/wrong.
3. **Hint-first wrong answers everywhere** — we have the machinery (Socratic tutor) but only in the math tutor, not the main engine.
4. **One-tap "just start"** with interleaved content types — our kid still navigates menus; a Mix is all questions.
5. **Rewards that flow to a world/characters** — our XP/plants display progress; the earn-and-place loop (9g) isn't built.
6. **Characters as content** (SEL stories) — our reader has no owl-cast stories, no SEL strand.
7. **Subject-specialist cast** — one owl carries everything.
8. **Free-play pressure valve** — Learning Garden is 100% work.
9. **10-second parent view + assign-from-report** — we have a printable report + school sync, not a live loop.
10. **Auto-spoken instructions** — ours require tapping the say button each time.

Where Learning Garden is already ahead: 2nd-grade breadth (6 subjects), Spanish, typing, sprints, diagnostics, worksheets, parent-authored lessons, listening-ears speech recognition (Khan Kids has nothing like the owl hearing the kid read), fully offline by construction, zero data collection (Khan Kids scored 71/100 on data transparency at The Learning Standard).

## Recommendations (prioritized; adapt, never copy; effort S/M/L)
1. **"Owl teaches first" lesson flow** (L) — replace static Learn cards with 3 beats: **Watch** (owl demonstrates with our existing SVG widgets — number line, coins, clock — narrated via free speechSynthesis, transform-only highlights) → **Together** (2–3 can't-fail guided questions, hint-then-walkthrough) → **On your own** (the existing 5-question mastery set). Garden framing: *Plant it → Water it → Watch it grow*.
2. **Hint ladder in the main session engine** (M) — first miss = owl hint, second = walkthrough, THEN it counts. Touches all 122 skills at once. Checkups/sprints unchanged (measurement never punishes).
3. **Owl as session narrator** (S–M) — per-kid "Owl reads to me" toggle: auto-speak questions, rotating spoken encouragements, warm retry lines. Owl gets talking/cheering/thinking poses.
4. **One big Start button** (M) — kid home defaults to a single "Start today's garden" run that interleaves types: practice → story page → sprint round → tricky word → practice. The water meter fills as it advances. Menus stay for free choice.
5. **Build 9g as the reward loop** (M) — placeable critters/flowers/decorations earned per completed plan task (+ accuracy), weekly treasure chest, placed in My Garden. Never purchasable, never lost.
6. **Grown-ups dashboard: 10-second view + "Add to her week"** (M) — minutes, questions, per-subject bars, weak-skill list with one-tap plan injection (school-sync already does the injection half). Out-does Khan Kids' weakest area.
7. **Two owl companions with subject roles** (M–L) — original garden creatures (e.g. a ladybug for math facts, a bookworm for reading), one trait each, colors from SUBJECT_UI, corners of My Garden. Original art only.
8. **Owl-cast SEL stories** (M, mostly writing) — 3–5 reader stories where the cast handles frustration/mistakes/patience. Doubles as comprehension practice.
9. **No-stakes Create corner** (S–M) — arrange earned garden items freely; no grading, no XP. Scope-tight: piggybacks on rec 5.
10. **Auto-read + slow-read polish** (S) — auto-speak toggle + "say it slowly" (rate ≈ 0.8).

**If only three: 1, 2, 6** — teaching flow, hint ladder, parent dashboard. Then 4 and 5.

## What NOT to adopt
- **Video/licensed songs** — dead end for offline+free; narrated SVG animation gives the same "watch first" for ~0 bytes.
- **Accounts/cloud/rostering/paid dashboards** — violates free-forever/no-servers; our zero-collection model is a feature.
- **Their characters** — Kodi & co. are Khan's IP. Adapt the *pattern*; invent garden creatures.
- **Pre-reader-first design** — our kids are readers; keep denser layouts, add voice as support not a floor.
- **Endless invisible path** — keep interleaving *inside* a visibly finite daily plan; kids should see the finish line.
- **Per-tap prize grinding** — rewards stay gated on completed tasks + accuracy, one reveal per task, never lost.
- **Notification nags** — reminders stay visual; "your garden waited for you" stays the voice.
