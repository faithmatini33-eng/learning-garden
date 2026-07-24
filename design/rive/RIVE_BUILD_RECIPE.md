# Pip in Rive — build recipe

Keyed to the exact layer names in `pip-rig-source.svg`. Follow in order.
Everything here is doable on the **free** plan. You only need a paid seat at the
very last step (Export).

Input names match the handoff package's contract, so the starter JavaScript will
still line up.

---

## Step 0 — before you import

The free plan gives you 3 files. Name this one `pip-grade2` so it's obvious later.

---

## Step 1 — Import the art

1. In your Rive file, **File → Import** and choose
   `design/rive/pip-rig-source.svg`.
2. You should see Pip appear with a full layer tree on the left: `tail`, `body`,
   `arm_L`, `arm_R`, `belly`, `foot_L`, `foot_R`, `head`.
3. **Check nothing collapsed.** Open `head` — you should find `ear_L`, `ear_R`,
   `head_shape`, `cheeks`, `muzzle`, `brow_L`, `brow_R`, `eye_L`, `eye_R`,
   `eyelid_L`, `eyelid_R`, `blush`, `nose`, `mouth_set`.
   If the head arrived as one flat shape, the importer flattened the group —
   undo, and import again with "keep groups" enabled.
4. Set the **artboard** to 120 × 140 and name it `Pip_Grade2`. That matches the
   app's proportions exactly.

**Two things that will look odd and are supposed to:**
- `eyelid_L` / `eyelid_R` are invisible. They're the same colour as the head and
  parked just above each eye. That's the blink mechanism — you slide them down.
- The brows are very subtle. They're meant to be.

---

## Step 2 — Bones (Design mode)

Add bones in this order. Each child bone starts where its parent ends.

| Bone | Starts at | Notes |
|---|---|---|
| `root` | between the feet, ~(60, 132) | everything parents to this |
| `spine` | (60, 128) up to (60, 96) | the body's bob and squash |
| `neck` | (60, 96) up to (60, 84) | short |
| `head_bone` | (60, 84) up into the head | the nod / tilt |
| `tail_1` | (88, 106) | at the body |
| `tail_2` | end of tail_1 | |
| `tail_3` | end of tail_2 | the curl |
| `armL_1` | (36, 100) | shoulder |
| `armL_2` | (29.5, 108) | elbow — this is the exact split point in the art |
| `armR_1` | (84, 100) | shoulder |
| `armR_2` | (90.5, 108) | elbow |

Then bind:
- `head` group → `head_bone`
- `body_shape`, `belly_shape` → `spine`
- `arm_L_upper` → `armL_1`, `arm_L_lower` + `hand_L` → `armL_2` (same for R)
- `tail_body` + `tail_tip` → bind **vertices** to `tail_1/2/3` as a chain.
  Don't cut the tail into pieces — that's what the bone chain is for.
- `foot_L`, `foot_R` → `root` (Pip has no legs by design; the feet meet the body)

**Constraint worth adding:** a Translation constraint on each foot so they stay
planted when the spine squashes. Otherwise Pip's feet slide during a hop.

---

## Step 3 — The mouth states

1. Import `pip-mouth-chart.svg`. It has the four talking shapes at 4× scale, with
   the true sizes written in the comments.
2. Copy each into the `mouth_set` group, centred at **x=32, y=43.4** in head space.
3. You should end with five shapes in `mouth_set`: `mouth_closed` (already there),
   `mouth_tiny_o`, `mouth_small_o`, `mouth_wide_o`, `mouth_flat`.
4. Hide all but `mouth_closed`. You'll toggle visibility per state.

---

## Step 4 — Animations (Animate mode)

Build these timelines. Keep them short — a kid answers many questions in a row.

| Timeline | Length | What moves |
|---|---|---|
| `idle` | 4s, loop | `spine` breathes (tiny scale), ears lag behind, tail sways slowly |
| `blink` | 0.25s | `eyelid_L/R` slide down over the eyes and back up |
| `talk` | 0.4s, loop | cycle the mouth shapes; small `head_bone` movement |
| `teach` | 1.2s | lean in, one arm opens outward |
| `point` | 0.7s, hold | `armR_1/2` extend toward screen-left, hold, return |
| `think` | 0.9s, loop | `head_bone` tilts, one paw toward chin, brows raise slightly |
| `listen` | loop | very small — attentive lean, ears forward, slow blink |
| `encourage` | 0.85s | warm nod. **No frown, no slump, no head shake.** |
| `celebrate` | 0.95s | crouch, jump, arms up, bouncy landing |
| `enter_left` | 0.55s | hop in from off-screen left, settle |
| `exit_left` | 0.45s | hop out left |
| `wave` | 1.0s | one arm up, two waves |

**Motion rules:** ease everything, never linear. Ears and tail always lag the head
by 2–4 frames. Anticipate before every big move.

---

## Step 5 — The state machine

Name it exactly `Pip_Controller`. Create these inputs, exactly:

**Booleans:** `b_is_talking`, `b_is_listening`, `b_reduced_motion`
**Numbers:** `n_look_x`, `n_look_y`
**Triggers:** `t_point`, `t_think`, `t_celebrate`, `t_encourage`, `t_enter`,
`t_exit`, `t_wave`, **`t_teach`**

That last one matters — the handoff package listed a `teach` animation but never
gave it a trigger, so it could never be fired. Add it.

**Layers:** use two. Layer 1 carries body states (idle / enter / exit / point /
think / celebrate / encourage / teach). Layer 2 carries the mouth, driven by
`b_is_talking`, so Pip can talk *while* pointing. One layer can't do both.

**Reduced motion:** wire `b_reduced_motion` so that when true, every transition
becomes a short cross-fade and nothing jumps, hops, or spins.

---

## Step 6 — Export (the paid step)

1. **Publish → Export → For runtime**, download the `.riv`.
2. Name it `pip-grade2-v1.riv`.
3. It goes in `assets/rive/characters/` in the repo.

The `.riv` works forever once exported. You can subscribe for one month, export
Pip and Sage, and cancel — you'd only resubscribe to change the characters later.

---

## Things the handoff package got wrong — don't get caught by these

1. **`t_teach` was missing** (see Step 5).
2. **Offline needs one specific line of code.** Rive's runtime fetches its engine
   file from the internet by default; copying files locally is not enough. The code
   must call `RuntimeLoader.setWasmUrl()` pointing at your local copy. The package
   never mentions it — without it, characters break offline.
3. **One wrong path breaks the whole app offline.** `sw.js` caches its file list
   all-or-nothing, so a typo in a Rive path takes down the entire app for every
   kid, not just Pip. Add the new paths carefully and test with DevTools offline.
4. **Never gate the answer buttons on speech or animation finishing.** The starter
   code does, with no timeout — that's the exact lockout bug already fixed in
   lg-v14. Always fail open.
5. **The character must use the app's existing voice.** Call the app's `speak()`
   from `js/app.js`, not a fresh `SpeechSynthesisUtterance` — otherwise Pip talks
   in the wrong voice and the Grown-ups voice picker stops working.
6. **Honour `body.calm-motion`, not just the OS setting.** That per-kid toggle is
   the one parents actually use, and the package ignores it.
