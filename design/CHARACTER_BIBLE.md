# Learning Garden — Character Bible

The cast, their jobs, and where each one lives in the app. This is the plan the
art production works from. Art direction: **soft illustrated look** (the OpenAI
poster style — warm, rounded, gentle depth), decided 2026-07-23.

Grounded in the real code: subjects come from `SUBJECTS` in `js/generators.js`,
strands from `STRANDS`, poses from `foxSVG`/`owlSVG` (`js/art.js`).

---

## The two leads (build these first, everything else waits)

### PIP — the fox · THE TEACHER
- **Job:** leads every lesson, models the worked example, then hands it to the kid.
- **Already in code** as `foxSVG(size, pose)` and `foxFullSVG` — the app calls him
  at 30–46px inline and 110–148px full-body. Named throughout `js/lesson2.js`
  ("Pip's test") and the lg-v14 gate ("Pip is talking…"). Referred to as *he*.
- **Personality:** warm, bouncy, a little goofy, endlessly encouraging. Never smug.
- **Voice:** the lesson narration — the one who says "Your turn — I'll help!"

### SAGE — the owl · THE HELPER
- **Job:** the homework helper. Shows up when a kid is stuck or reading aloud.
  Never gives the answer — asks the next small question. Wears a tilted grad cap.
- **In code** as `owlSVG(size)` — the "Helper owl" in `js/app.js` (hint ladder,
  onboarding). Name "Sage" is new; the code still says "the owl."
- **Personality:** calm, patient, unhurried, quietly delighted. The steadiness to
  Pip's energy.
- **Voice:** hints and read-aloud coaching.

---

## The subject characters (each owns a corner of the garden)

Your app has real subjects. A character per subject gives a kid a "who's teaching
me today." Mapping the poster cast to `SUBJECTS`:

| Character | Animal | Owns | Real subject in code |
|---|---|---|---|
| **Tally** | squirrel | The Math Explorer | `math` — "Math" 🧮 |
| **Wren** | bluebird | The Reading Coach | `ela` — "Language" 📚 |
| **Nib** | mole | The Sound Detective | phonics — a *part of* `ela` |
| **Pebble** | frog | The Pattern Jumper | patterns — a *part of* `math` (the `count` strand) |

Note: the app **already** uses a frog 🐸 for the Number Lines strand and has a
caterpillar→butterfly life cycle in `art.js` — so Pebble the frog and Sprout the
caterpillar already have roots in the existing art. Good omen.

---

## The moment characters (they show up for a feeling, not a subject)

| Character | Animal | Shows up when… |
|---|---|---|
| **Moss** | turtle | The Try-Again Friend — a wrong answer, a retry. Slow and kind. |
| **Luma** | bee | The Celebration Guide — a skill blooms, a streak, a win. |
| **Sprout** | caterpillar | The Progress Buddy — the garden-growth / "look how far you've come" moments. Grows into a butterfly as a kid progresses (art.js already has the stages). |

---

## The honest gaps (decisions for Faith, not blockers)

1. **No character for Science, Spanish, or Social Studies** — these are real
   subjects in your app (`science`, `spanish`, plus `social`/`typing` on the daily
   rotation). The poster only covers Math and Reading. Options:
   - add three more subject characters later (a good candidate each: a science
     "why" character, a Spanish "world traveler," a social-studies "explorer"), or
   - let Pip teach those subjects for now and only give Math/Reading their own faces.
2. **Nib and Pebble are sub-skills, not whole subjects.** They own phonics and
   patterns, which live *inside* Language and Math. That's fine — they can appear
   at the lesson level rather than the subject-menu level. Just flagging so the
   hierarchy stays clear.
3. **Nine characters is real upkeep** for a solo builder — each needs a voice,
   poses, and consistency everywhere it appears. **Recommendation: ship Pip + Sage
   fully first**, then add one subject character at a time as you polish each
   subject. The cast grows *with* the app instead of all at once.

---

## Poses each character needs (from the real code + the animation plan)

The app already renders three poses — `idle`, `talk`, `cheer`. For the illustrated
versions, each character needs at minimum:

- **idle** — calm, friendly, resting
- **talk** — mid-explanation, one hand gesturing (Pip especially)
- **cheer** — celebrating, arms up
- **point** — indicating on-screen content (teacher/coach characters)
- **think** — considering (Sage especially, for hints)

Plus the one that matters most for trust:

- **encourage** — the wrong-answer face. Warm and steady, "let's look again
  together." Must NEVER read as disappointed or pitying. (Moss the turtle carries
  this moment in the cast, but Pip needs it too.)

---

## Production notes

- **Assets, not posters.** Each character needs to be its own image on a
  **transparent background**, one per pose. The current poster has all 9 fused
  into one picture with baked-in text — not directly usable.
- **Consistency trick:** feed the approved poster back into the image tool as a
  *reference image* and generate each character individually from it. Generating
  from scratch each time will drift; referencing the sheet holds the look.
- **No baked-in text or emoji** in the character art — the app supplies all text
  (and Faith's rule is no emoji in UI). The poster's "4+3=7", music notes, and
  "123" are illustration-only, not to be reproduced in the assets.
- **The style shift is now a project of its own:** the existing flat `art.js`
  garden art (flowers, avatars, stars) will gradually move toward this softer look
  so the app stays coherent. Gradual — nothing is blocked meanwhile.
