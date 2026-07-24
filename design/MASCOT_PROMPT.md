# Learning Garden — Mascot Design Prompt Pack

Two characters: **Pip** (fox, the teacher) and **Sage** (owl, the helper).
Everything below is written to be pasted into another AI/design engine.

The palette and shape language are lifted from the app's real code
(`js/art.js` → `ART` object, `styles.css` → `:root`), so whatever comes back
will already be on-brand instead of needing a recolor pass.

---

## 0. Read this first — pick the right engine

You are actually asking for two different deliverables, and no single tool does both well:

| What you want | Engine | Why |
|---|---|---|
| Beautiful character art, turnarounds, expression sheets | Midjourney v7, Nano Banana / Gemini Image, Ideogram 3, or DALL·E | Great at style, bad at layered/rig-ready output |
| A character that **acts out lessons** in the app | **Rive** (recommended) or Lottie/After Effects | Real runtime state machine, ~40–120 KB, works offline in a PWA, plays nicely with your existing `foxSVG(size, pose)` call sites |

**Recommended path:** use Prompts 1–3 to generate the art, then hand the approved
art + Prompt 4 to a Rive artist (or to an AI that writes Rive/Lottie). Rive is
the right call for Learning Garden specifically because it's a PWA that must stay
small and work offline — a video-based character would blow the cache budget and
break the offline promise.

---

## 1. MASTER CHARACTER DESIGN PROMPT

> Paste this whole block. It's written for a strong image model (Nano Banana,
> Gemini Image, DALL·E, Ideogram). For Midjourney, use the short version in §6.

```
You are a senior character designer for children's educational software. Design
two mascot characters for "Learning Garden," a free reading-and-math app for
7-to-8-year-olds. The target quality bar is Khan Academy Kids: characters that a
second-grader instantly loves, that read clearly at 40 pixels, and that are built
to be animated as on-screen teachers.

=== THE TWO CHARACTERS ===

CHARACTER 1 — PIP, the fox. He is THE TEACHER.
Personality: warm, bouncy, a little goofy, endlessly encouraging. The friend who
is genuinely excited that you're about to learn something. He demonstrates first,
then hands the work to the kid. He is never smug and never a know-it-all.
Role in app: leads every lesson, models the worked example, cheers the first try.
Body language: leans in, gestures with open paws, points at the work, hops when
the kid gets it right.

CHARACTER 2 — SAGE, the owl. They are THE HELPER.
Personality: calm, patient, unhurried, quietly delighted. Where Pip is energy,
Sage is steadiness. Sage shows up when a kid is stuck or reading aloud, and
never, ever just gives the answer away — Sage asks the next small question.
Role in app: homework helper, listens to the kid read, gives hint-ladder nudges.
Signature prop: a small graduation cap worn slightly tilted, the only "costume"
element in the whole cast. Big round eyes that go soft and attentive when
listening.
Body language: head tilts, one wing raised in a "let's think about it" gesture,
slow warm blink, settles onto a perch.

Design them as a matched pair — clearly the same world, clearly different jobs.
Side by side they should read as "the excited one and the calm one."

=== VISUAL SYSTEM (follow exactly) ===

STYLE: Flat vector illustration. Solid fills only. Soft, storybook-warm, modern.
Think construction-paper cutout with clean geometry — friendly, tactile, hand-made
feeling, but built from crisp vector shapes.

PROPORTIONS: Chibi. Total height = 2 to 2.25 head-heights. Oversized head, small
rounded body, short stubby limbs, no visible neck. Paws/wing-tips are simple
rounded shapes — no individual fingers.

SHAPE LANGUAGE: Everything is built from circles, soft-cornered triangles, and
rounded rectangles. No sharp points anywhere except the fox's ear tips and the
small triangular nose/beak. Silhouette must be readable as a solid black shape —
test it.

FACE: Large solid dark eyes (#2A2320) with a single small white glint dot in the
upper-right of each. Soft blush circles on the cheeks at ~45% opacity in #F58BA4.
Small triangular nose. Mouth is a simple curve; when open it is a soft rounded
shape in deep warm brown (#8C4A32), never a dark void, never showing teeth.
Always smiling or about to smile.

EXACT PALETTE — use these hex values and no others:
  Fox body:        #E8845C     Fox ears/tail/feet:  #D05C38
  Fox deep accent: #B8491A
  Owl body:        #C98A2B     Owl wings/feet:      #A06B1B
  Muzzle / chest / ear-insides / belly: #FBF0DE
  Line-free dark (eyes, nose, beak):    #2A2320
  Grad cap:        #2A2320 with #443A33 band
  Blush:           #F58BA4     Sparkles:  #F2B035 and #FFD84D
  Background:      #FBF6EF (or fully transparent)
  Support greens (garden props): #4E9B6B, #7FB86F, #C9E4D0

HARD RULES — do not violate:
- NO outlines or stroke borders around the characters. Shapes define the form.
- NO gradients, NO drop shadows, NO glossy highlights, NO 3D render, NO clay
  render, NO Pixar/DreamWorks CGI look.
- NO emoji, NO text, NO watermark, NO signature.
- NO extra costume elements. Pip wears nothing. Sage wears only the grad cap.
- NO scary, sly, smug, sad, or sarcastic expressions. These characters are safe.
- NO photorealism, NO anime, NO sticker-with-white-border look.
- Colors must be the hex values listed. Do not shift hue or add tints.

=== DELIVERABLE ===
A clean character design sheet on a #FBF6EF background:
1. Pip full-body front view, neutral friendly idle pose.
2. Sage full-body front view, neutral friendly idle pose.
3. Both characters standing together at matching scale, to prove they belong to
   the same cast.
Even, flat lighting. Generous spacing. No labels or text on the image.
```

---

## 2. TURNAROUND SHEET PROMPT

> Run this once per character, after you've approved a design from Prompt 1.
> Attach the approved image as a style reference.

```
Using the attached character exactly as designed — same proportions, same exact
hex palette, same flat vector style, no outlines, no gradients — produce a
model-sheet turnaround.

Five full-body views in a single horizontal row on a #FBF6EF background,
all at identical height and standing on the same baseline:
  1. Front       2. Three-quarter left     3. Profile left
  4. Three-quarter right                   5. Back

Neutral idle pose in every view: arms relaxed at sides, feet together, calm
friendly smile. Consistent character height across all five — this sheet will be
used as the reference for building an animation rig, so proportional drift
between views makes it unusable.

Flat even lighting. No text, no labels, no measurement lines, no shadows.
```

---

## 3. EXPRESSION + TEACHING-POSE SHEET PROMPT

> This is the one that makes the character *functional* rather than decorative.
> The poses map directly to real moments in the Learning Garden lesson engine.

```
Using the attached approved character — identical proportions, identical hex
palette, flat vector, no outlines, no gradients — produce an acting sheet.

PART A — EXPRESSION SHEET (head and shoulders, 3 x 3 grid):
  1. IDLE — soft closed-mouth smile, relaxed, content
  2. TALK — mouth open mid-word, bright and animated, eyebrows up
  3. EXCITED — big open smile, eyes wide, full delight
  4. CHEER — eyes closed in happy upward arcs, huge grin
  5. THINKING — eyes glancing up and to the side, mouth a small thoughtful line
  6. LISTENING — attentive, head slightly tilted, eyes soft and focused, small
     warm closed smile (this is the "I'm hearing you read" face)
  7. GENTLE ENCOURAGEMENT — warm reassuring smile, eyebrows slightly raised in
     kindness. IMPORTANT: this is the face shown when a child answers WRONG. It
     must read as "let's look again together" — warm and steady. It must NEVER
     read as disappointed, sad, pitying, or corrective.
  8. PROUD — chin slightly lifted, beaming, eyes crinkled with joy
  9. SURPRISED-DELIGHTED — mouth a small open O, eyes wide, eyebrows high

PART B — FULL-BODY TEACHING POSES (2 x 4 grid):
  1. IDLE STANDING — relaxed, weight settled, ready
  2. TALKING — one paw/wing open in an explaining gesture, leaning slightly
     toward the viewer, warm and engaged
  3. POINTING — arm extended, indicating something to the LEFT of frame (this
     points at the lesson content on screen)
  4. DEMONSTRATING — actively showing how: holding up a small blank card, or
     counting on raised paw/wing-tips. The prop stays generic and blank so it can
     be swapped for any lesson content
  5. THINKING — paw/wing to chin, weight on one foot, considering
  6. CELEBRATING — mid-jump, both arms thrown up, feet off the ground, joyful
  7. WAVING — one arm up in a friendly hello, full-body welcome
  8. LEANING IN — crouched slightly, close and attentive, the "I'm right here
     with you" pose

Every pose on a #FBF6EF background, flat even lighting, no shadows, no text,
no labels. Consistent character scale across the whole sheet.
```

---

## 4. RIG SPEC PROMPT (for Rive / Lottie / the animator)

> Hand this to a Rive artist or to an AI that generates Rive/Lottie. This is what
> turns pretty art into a character that teaches.

```
Build an interactive animated character rig from the attached character sheets.

TARGET: Rive (.riv) with a State Machine, embedded in a vanilla-JS progressive
web app. Hard budget: under 150 KB per character, must run offline, must hold 60 fps
on a 2019-era iPad. If Rive is unavailable, deliver Lottie JSON with the same
state names.

ART PREP — LAYER SEPARATION (name layers exactly as written):
  ear_L, ear_R, head, muzzle, brow_L, brow_R, eye_L, eye_R, pupil_L, pupil_R,
  glint_L, glint_R, blush_L, blush_R, nose, mouth, body, arm_L, arm_R,
  hand_L, hand_R, leg_L, leg_R, foot_L, foot_R, tail (fox) / wing_L, wing_R (owl),
  cap (owl only), prop_slot, fx_sparkles
Every layer keeps its own transform origin. Nothing is flattened or baked.
`prop_slot` is an empty transform parented to the character's hand — the app
drops lesson objects into it at runtime.

MOTION PRINCIPLES:
- Squash and stretch on every jump and landing. The character has weight.
- Overlapping action: ears, tail, and cap always lag the head by 2–4 frames.
- Ease everything. No linear interpolation anywhere.
- Idle is never frozen: a continuous 4-second breathing loop plus a randomized
  blink every 3–7 seconds runs underneath all other states.
- Anticipation before every big move — wind up, then go.

STATE MACHINE — implement these named states with these exact triggers:

  idle          (default, loops)      breathing + random blink
  enter         (trigger)             walks/hops in from off-screen, settles to idle
  talk          (boolean, loops)      mouth flap loop + light gesture; head and
                                      ears animate; holds until the boolean is
                                      cleared. THIS IS THE MOST-USED STATE — it
                                      runs the entire time speech audio plays.
  point_left    (trigger → holds)     arm extends toward screen content, holds,
                                      returns to idle
  demonstrate   (trigger → holds)     lifts prop_slot into view and presents it,
                                      holds for the worked example, then lowers
  think         (boolean, loops)      paw/wing to chin, slow head tilt loop
  listen        (boolean, loops)      attentive lean, ear/wing cups forward, slow
                                      warm blink. Runs while the mic is open and
                                      the child is reading aloud
  encourage     (trigger)             warm nod + small reassuring gesture. THIS IS
                                      THE WRONG-ANSWER STATE. It must read as
                                      supportive and steady. Never sad, never a
                                      head shake, never a frown, never a slump
  celebrate     (trigger)             anticipation crouch → jump → arms up →
                                      sparkles burst → bouncy landing → idle
  wave          (trigger)             friendly hello/goodbye
  exit          (trigger)             waves and hops off-screen

ADDITIONAL INPUTS:
  look_x, look_y  (number, -1 to 1)   eyes and head track a point, so the
                                      character can look at whatever the child is
                                      working on
  energy          (number, 0 to 1)    global amplitude multiplier on gestures, so
                                      the same states can play big for a lesson
                                      intro and small for a quiet hint

ACCESSIBILITY:
- All motion must be suppressible via a single `reduce_motion` boolean that
  collapses every state to a gentle cross-fade with no jumping or spinning.
- The character must never be the sole carrier of meaning — it accompanies text
  and audio, it does not replace them.
```

---

## 5. THE ACTING SCRIPT — how the states map to real lesson moments

This is the bridge between the rig and `js/lesson2.js`. Give it to whoever wires
the character in.

| Lesson moment | Character | State |
|---|---|---|
| Lesson opens | Pip | `enter` → `wave` → `talk` |
| Teaching the rule | Pip | `talk` + `point_left` at the rule card |
| Worked example | Pip | `demonstrate`, prop swapped per step |
| "Your turn — I'll help" | Pip | `encourage` → `listen` |
| Child is answering | Pip | `idle` with `look_x/look_y` on the answer area |
| Correct answer | Pip | `celebrate` |
| Wrong answer, first miss | Sage | `enter` → `encourage` → `talk` (hint 1) |
| Wrong answer, second miss | Sage | `think` → `talk` (hint 2, narrower) |
| Child reading aloud | Sage | `listen`, `energy` low |
| Skill mastered / bed blooms | Pip | `celebrate`, `energy` = 1.0 |
| Screen idle 20s+ | either | `idle`, occasional `wave` |

**Pacing rule you already shipped (lg-v14):** advance buttons stay gated as
"Pip is talking…" until speech finishes. The `talk` boolean should be driven by
the exact same signal that gates those buttons — one source of truth, so the
mouth stops moving the instant the button unlocks.

---

## 6. SHORT VERSION (Midjourney / length-limited engines)

**Pip the fox:**
```
Character design sheet, chibi fox mascot for a children's learning app, flat
vector illustration, solid fills, no outlines, no gradients, no shadows. Two
heads tall, oversized round head, tiny body, stubby limbs. Warm orange #E8845C
body, #D05C38 ears and tail, cream #FBF0DE muzzle and chest, solid dark #2A2320
eyes with single white glint, soft pink blush, wide friendly smile. Excited,
bouncy, encouraging teacher energy. Front view, three-quarter view, and profile.
Cream #FBF6EF background, flat even lighting, no text --style raw --ar 16:9
```

**Sage the owl:**
```
Character design sheet, chibi owl mascot for a children's learning app, flat
vector illustration, solid fills, no outlines, no gradients, no shadows. Two
heads tall, oversized round head, tiny body, stubby wings. Warm gold #C98A2B
body, #A06B1B wings and feet, cream #FBF0DE belly, huge solid dark #2A2320 eyes
with white glints, small terracotta beak, soft pink blush, small black
graduation cap tilted on head. Calm, patient, gently delighted tutor energy.
Front view, three-quarter view, and profile. Cream #FBF6EF background, flat even
lighting, no text --style raw --ar 16:9
```

---

## 7. What to check before you accept the art

1. **Squint test** — blur the image until it's mush. Can you still tell fox from
   owl? If not, the silhouettes aren't distinct enough.
2. **40px test** — scale to 40 pixels wide. Learning Garden renders the fox at
   `foxSVG(38)` and `foxSVG(40)` in several places. If the face turns to soup,
   the eyes are too small or the muzzle contrast is too low.
3. **Wrong-answer test** — look only at the `encourage` expression. Show it to
   someone with no context and ask what the character is feeling. If anyone says
   "disappointed" or "sad," reject it and re-run. This single expression does more
   emotional work than the rest of the set combined.
4. **Palette check** — eyedropper the output. Any hex not on the list in §1 means
   the engine drifted and it will clash with the app.
5. **Layer check** (rig only) — open the file and confirm every layer in §4 exists
   and is separately transformable. A flattened head means no lip sync.

---

## 8. Naming

- **Pip** is already live in the codebase (`js/lesson2.js` — "Pip's test", and
  the lg-v14 gating copy "Pip is talking…"). Keep it. Referred to as *he*.
- **Sage** is a proposal, not a decision. It's an herb (fits the garden) and it
  means wise (fits the tutor with the grad cap). The owl is currently unnamed in
  code — it's just "the owl" / "the Helper owl" in `js/app.js`. Pronouns are your
  call; this doc uses *they* as a placeholder.

If you rename the owl, the strings to update live in `js/app.js` around the
onboarding tiles (~line 1017) and the hint-ladder copy (~line 1406).
