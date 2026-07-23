# Handoff: Learning Garden — UI Redesign

## Overview
A full visual redesign of **Learning Garden**, an offline-first learning app for 2nd graders (localStorage only, no accounts). The app already exists (vanilla JS: `app.js`, `generators.js`, `coach.js`, etc.). **This bundle defines the new LOOK — the UX/feature logic already exists in the app and should not change.** The redesign covers every screen: kid picker, Today dashboard (with selectable Garden / Stars & Badges themes), Practice browser, learning session, My Week, Progress, Tutor Owl, Grown-ups corner, weekly report, worksheet maker, Spanish lessons, story reader, typing, and the kid profile — plus a motion & sound kit.

## About the Design Files
The files here are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. Recreate these designs **inside the existing Learning Garden codebase** (vanilla JS + CSS, string-template rendering) using its established patterns. `Kids Learning App.dc.html` is a design-canvas document: each "Turn" section contains tablet-frame mockups (1194×834, iPad landscape) labeled 2a, 3a–3d, 4a–4b, 5a–5f, 6a–6c, 7a–7c, and a motion/sound spec board. Open it in a browser to view (it loads `support.js`, a preview runtime — not for production).

**`sounds.js` IS production-ready** — a dependency-free WebAudio sound kit. Drop it into the app as-is and call `GardenSounds.tap()` etc.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and copy are final. Recreate pixel-perfectly.

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| ink | `#2A2320` | all primary text |
| muted | `#8a7e74` | secondary text, inactive nav |
| soft-muted | `#6b5f55` | body copy |
| app bg | `#FBF6EF` | every kid screen background |
| parent bg | `#F6F3ED` | grown-ups screens |
| card border | `#EDE4D6` (1px) | all cards |
| row divider | `#F1EADD` (1px) | list rows |
| dashed/locked | `#D9CDBD` / `#cdbfa8` | future days, locked badges |
| terra (primary) | `#D05C38`, dark `#B8491A` | Math, primary buttons, active nav, streak flame |
| terra tint | `#FBE7DD` | active nav pill, Math tiles |
| teal | `#1F8A80`, tint `#E1F0EE` / `#E8F4F2` | Language, Helper/Tutor, ALL parent-mode chrome |
| green | `#4E9B6B`, tint `#EAF3EA` / `#E7F2E9` | Science, correct states, done counts |
| gold | `#C98A2B`, tint `#FBF0DE` | Spanish, XP/level, badges |
| purple | `#8E6BB0`, tint `#EFE8F5` | Social Studies |
| blue | `#4A7FB5`, tint `#E4EDF6` | Computer |
| sun yellow | `#F2B035` / `#FFD84D` | logo, stars, sun |
| water blue | `#4FA3D1`, tint `#BFE0F2` | water drops/meter |

### Typography
- **Nunito** (800/700) — all headings, numbers, buttons-as-names, kid speech. Google Fonts.
- **Be Vietnam Pro** (400–700) — body, labels, eyebrows.
- Eyebrows/section labels: 10.5–12px, 700, uppercase, letter-spacing .06–.12em, muted.
- Story reading text: 27px / 1.85. Session prompts: 24–26px Nunito 800. Big numbers (session): 76px.
- Minimum body: 12px; kid tap targets ≥ 44px.

### Radii & Shadows
- Device/app frame 30px · cards 16–20px · icon tiles 9–13px · buttons & chips **pill (100px)** · small count chips 7–8px · keyboard keys 10px.
- Card shadow: `0 2px 12px rgba(43,33,28,.05)` · floating card: `0 10px 40px rgba(43,33,28,.10)` · today-column highlight: `0 6px 20px rgba(208,92,56,.13)`.

### Iconography
Lucide line icons everywhere (stroke `currentColor`, stroke-width 2, 14–26px): home, sprout (Practice), calendar (My Week), award (Progress), graduation-cap (Tutor), calculator (Math), book-open (Language/Reading), flask-conical (Science), globe (Spanish), landmark (Social Studies), laptop (Computer), flame (streak), droplet (water), star, lock, camera, settings, mic, volume, lightbulb, printer.
**Emoji are reserved for characters & content only:** the kid's animal avatar (🦊🐼🦄…), Helper/Tutor Owl 🦉, and picture-answer cards. Never for UI chrome.
**Plant mastery stages** are custom SVGs (see mockups): seed (brown circle `#A97B4F`) → sprout (1 leaf) → growing (2 leaves) → blooming (pink daisy, `#F58BA4` petals, `#FFD84D` center) → mastered (gold daisy, `#F2B035` petals, `#8C5A2B` center). The sunflower logo = 6 gold petal ellipses + brown center.

## Screens (each is a frame in the canvas)
- **5a Kid picker** — centered logo, "Who's practicing today?", kid cards (avatar circle 84px, flowers grown, streak) + add-a-kid panel (name input, 12-avatar grid, grade chips 1/2/3, "Let's grow!" button). Grown-ups link pinned bottom.
- **2a Today dashboard** — header (avatar tile w/ float animation, greeting Nunito 800 25px, Level chip + XP bar 140px, Grade-2 pill, streak & stars pills, gear, teal "Grown-ups" button); left column: Today's plan card (rows: 32px check square, 38px subject icon tile, title + SUBJECT · N MIN eyebrow, tinted pill "Start →"; done = green check, strike-through, gray) + all-done celebration banner; Helper Owl teal card; right column: **theme panel** — Garden (illustrated sky/sun/hills scene, SVG plants at growth stages, water meter card) or Trophy shelf (next-badge hero w/ progress, earned colored badge tiles vs dashed locked, 7-day streak row). Theme picked in the **Settings modal** (gear): theme preview cards + reminder toggles (daily nudge 3:30 PM, streak alerts, weekly recap, sounds). Persist theme per kid.
- **3a Practice** — 6 subject cards (active = tinted bg + 2px subject-color border, mastered counts), plant-stage legend pill, strand sections (icon tile + name + "N avg") with 3-col skill cards (stage SVG, name, score).
- **3b Session** — top bar: back, skill chip, centered progress bar "3 of 5", water count. Centered 720px question card: prompt with target digit in terra, read-aloud button, 76px number display with highlighted digit, 2×2 answer grid (64px+ targets; correct = green border/tint + check bubble at corner), green explanation strip with "Next" terra pill. Fox mascot bottom-left with speech bubble; "Today's water" drops bottom-right. No bottom nav (focused mode).
- **5b Skill finished** — celebration card: stage-up illustration (sprout → growing w/ arrow), "Your plant grew!", stat chips (5/5 correct, +3 stars, 2-of-3 plan), Next-skill + Back buttons, confetti, mascot.
- **5c Daily Mix recap** — conic-gradient score ring 8/10, subject ×count chips, "these skills got sunshine" rows with score jumps (18 → 31), One-more-mix / Done.
- **5d Checkup results** — strand bars colored by verdict: Strong (green), Growing (gold), Needs sunshine (terra); terra callout: plan now starts with weakest strands; "See my plan".
- **3c My Week** — 5 day columns; past = 85% opacity, strike-through tasks + green checks + "3/3" chip; today = 2px terra border, floating TODAY pill, "Keep going" button; future = dashed border, dimmed. Weekend strip: "explore days… never break a streak."
- **3d Progress** — 4 stat tiles (Nunito 800 30px), This-week bar chart (active day terra w/ value label, past terra-tint, empty 4px track), Garden-health bars per strand with stage SVG at bar end.
- **4a Tutor Owl** — teal hero strip (owl, "asks the right questions" promise), tab chips (Start / Math active / Word problems / Tricky words / My homework / Cheat sheets), left pane: problem entry (34 + 28, teal Let's-go), pencil note, stacked problem 46px with active column highlighted; right: step trail — done (green, chosen answer pill, affirmation), current (2px teal border, input w/ Check + gold Hint), locked (dashed, dimmed), owl bubble.
- **4b Grown-ups corner** — teal header bar (lock icon, "everything stays on this device", Back-to-kids). Kid rows (avatar, grade, streak/this-week/correct/mastered stats, teal Weekly-report pill); school-focus chips (terra tint, removable ×, dashed +Add); worksheet-maker row; daily-goal stepper (− 3 +, "≈ 10 minutes"); reminder toggles (44×25 pill, green on); Sunday-recap teal info card.
- **5e Weekly report** — teal header (kid, date range, Print, Back), 5 stat tiles, Wins list (gold flower = mastered), Trouble spots (n-of-m right, green "scheduled next week — no action needed"), per-subject bars with q-count + accuracy, "Try this at dinner" teal tip.
- **5f Worksheet maker** — left: skill checkboxes by subject, question-count chips (10/20/30), terra Print button; right: live paper preview (white page, header rule, Name/Date lines, numbered problems, footer "page 1 of 2 · answer key on the last page").
- **6a Spanish lesson** — gold subject chrome; "Escucha y elige" eyebrow; big gold audio pill "el gato" + Slower chip (uses existing speechSynthesis es-ES); 4 picture-answer cards (Spanish word revealed under the correct one); "¡Muy bien!" strip + "Say it with me" mic chip (teal outline) + Next. Fox speaks Spanish.
- **6b Story reader** — teal chrome, "page 2 of 6" progress, "I'll read it myself" toggle; left 460px illustration; right 27px/1.85 text with currently-spoken word highlighted (teal tint + 3px teal underline) and tap-a-word popover (dark tooltip: audio icon + "soared = flew way up high"); controls: Reading-to-you (pause), Slower, page dots, round prev/next.
- **6c Comprehension check** — story-recap strip, feeling question, 3 big face cards (correct = green), explanation quoting the story line, Next + "Read that page again".
- **7a Typing** — prompt card 40px Nunito, letter-spaced: typed = green, next = terra-highlighted box w/ underline, rest = faded; on-screen keyboard (52px keys): home row blue-tinted w/ F/J bump bars, next key = terra tint + 2.5px border + glow ring; finger-hint legend; wpm + accuracy chips; "Words planted 3 of 8".
- **7b Computer basics** — picture-answer question ("point and click" → mouse), same session pattern in blue.
- **7c Profile** (from name chip) — avatar 110px w/ gold ring + teal edit pencil, Level/XP, change-animal grid, theme mini-picker, 4 stat tiles, badge shelf (88px tiles, earned colored vs dashed locked), week streak row, garden-nudge banner ("Master 3 more skills to reach Level 5").

## Interactions, Motion & Sound
All specs run live in the canvas' "Motion & Sound" board. Global rules: every animation ≤ 800ms, tied to a kid action; spring easing `cubic-bezier(0.34,1.56,0.64,1)` for rewards, `cubic-bezier(0.4,0,0.2,1)` for navigation; **wrong answers get a gentle nudge + soft tone — never red flashes or buzzers**. Respect `prefers-reduced-motion`. Sounds toggle lives in Settings ("Sounds & cheers").

| Event | Animation | Sound (`sounds.js`) |
|---|---|---|
| any button tap | translateY(2px) scale(.97), 80ms ease-out, spring back 150ms | `tap()` |
| correct answer / plan check | check pops scale 0→1.25→1, 250ms spring | `correct()` |
| wrong answer | card nudges ±5px, 320ms, then hint appears | `wrong()` |
| plan task done | water drop falls 400ms ease-in; meter width fills 500ms ease-out | `water()` |
| mastery stage-up | plant scales .3→1.12→1 from soil (transform-origin bottom), 800ms spring | `grow()` |
| star earned | star flies up 44px + slight rotate, fades at counter, 700ms; counter ticks | `star()` |
| plan complete / badge / mastered | confetti canvas burst (~26 pieces, gravity+rotation, ~1.5s) — big moments only | `cheer()` |
| next question/page | old fades 150ms; new slides in from right 46px + fade, 350ms | `tap()` |
| typing keystroke | key caps press; next key ring pulses | `key()` |
| mascot idle | floats ±5px, 3.5s ease-in-out loop; speech bubble pops in w/ check spring | — |
| quest-map current node (if used) | pulses scale 1→1.06 + expanding ring, 1.8s loop | — |

## State Management
Existing app state applies. New: per-kid `theme` ('garden' | 'stars') and `soundsOn` in `DB.settings[kidId]`, persisted with the existing `save()`.

## Assets
No binary assets. All icons = inline Lucide SVGs; plants/logo = inline SVGs (copy from the mockups); characters = emoji. Story illustrations are placeholders — supply real art per story page.

## Files
- `Kids Learning App.dc.html` — the full design canvas (open in a browser; reference only)
- `sounds.js` — **production-ready** WebAudio sound kit (`window.GardenSounds`)
- `image-slot.js`, `support.js` — preview-runtime helpers for the canvas; not for production
