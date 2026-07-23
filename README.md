# Learning Garden 🌻

A **free, offline, no-accounts** learning app for elementary kids (currently 2nd grade), built by Faith for her children. IXL-style practice across **Math, Language, Science, Social Studies, Spanish, Computer/typing**, plus parent-made lessons — 122+ skills, all questions procedurally generated or bank-driven. No servers, no fees, ever: everything lives in `localStorage` on this device.

## Run it
Double-click `index.html`. That's it. (Progress saves per browser — have kids always use the same one.)

For development, serve over HTTP (some tools render `file://` without JS):
```bash
python3 -m http.server 8642
```
Note (macOS): the system Python can't read `~/Desktop` (TCC). Serve from a copy outside Desktop, or `cd` somewhere readable first.

## Architecture (load order matters)
| File | What it owns |
|---|---|
| `js/sounds.js` | WebAudio sound kit (`GardenSounds.*`) — from the design handoff, production-ready |
| `js/generators.js` | helpers (`ri/pick/shuffle/mcSet`), SVG widgets (number line, clock, coins, graphs…), `SUBJECTS`, `STRANDS`, 56 math skills. `gen(lvl)` = adaptive difficulty (1 easy / 2 on-level / 3 stretch) |
| `js/ela.js` `js/science.js` `js/spanish.js` `js/social.js` `js/typing.js` | push subject strands + skills into the shared arrays; strand `lesson` HTML = the 📖 Learn cards |
| `js/sprint.js` | ⚡ 60-second fact drills (timer ring + keypad); personal bests in `DB.sprint` |
| `js/coach.js` | school-focus sync (`SKILL_KEYWORDS`), diagnostics ("Garden Checkup"), Daily Mix, Socratic math tutor + solo transfer step, word-problem wizard w/ **listening ears** (free `SpeechRecognition` — the owl hears the kid read & prefills their numbers), Tricky Words (syllable card + say-it-back listening + saved chips), parent report |
| `js/custom.js` | parent-authored lessons (`DB.custom` → real skills) + homework photo helper |
| `js/paper.js` | printable worksheet maker (show-your-work boxes + answer key) |
| `js/ui.js` | design-system kit: Lucide `icon()`, `plantSVG()` stages, `logoSVG()`, `SUBJECT_UI` colors, XP `levelInfo()`, `sfx()` sound gate, `upgradeSayButtons()` |
| `js/app.js` | **loads last**: `SKILL_MAP`, router `show()`, all screen renderers, session engine (`SESSION`, `nextQuestion`, `grade`), weekly plan builder, settings/profile/My Garden |

**Key rules encoded in the app:**
- Skills are data — adding a grade = adding skill files; the engine never changes.
- `PLAN_VERSION` (app.js): bump it whenever the skill catalog or plan logic changes → plans regenerate.
- `SKILL_DONE_Q = 5`: questions for a skill to "check off" for the day; water meter = plan tasks done.
- Mastery 0–100 per skill (🌰→🌻); wrong answers in checkups/sprints never lower it.
- Entrance animations must be **transform-only** (never opacity) — stalled webview animations once blanked whole pages.
- Sounds only on meaningful moments (correct/wrong/water/grow/cheer + sprint keys) — never on plain clicks.
- **No emoji in UI** — all graphics are inline Lucide SVGs (`icon()`) or crafted mascots in `ui.js` (`owlSVG()`, `plantSVG()`, `logoSVG()`). (Kid avatars & picture-answer content are the only exception, pending Faith's call.)

## Design
Target: **tablet landscape 1194×834**. The full design system and every screen mockup live in `design/` (v1) and `design/additions/` (v2) — **the PNG screenshots are the source of truth** over any text spec. Tokens: warm paper `#FBF6EF`, terra primary `#D05C38`, per-subject colors, Nunito + Be Vietnam Pro.
