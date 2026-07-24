/* ============================================================
   LEARNING GARDEN — character.js · illustrated character layer

   Pose-swapping characters (the illustrated PNG art), sitting beside
   the procedural SVG cast in art.js rather than replacing it.

   Every pose for a character is rendered up front and stacked; showing
   a pose flips a class. No network hit, no decode flash, no layout
   shift when the pose changes.

   Same shape as the rest of the app: plain global functions that
   return HTML strings. No framework, no build step, no async.
   ============================================================ */

const CHARACTER_ART = {
  pip: {
    dir: 'assets/characters/pip/',
    label: 'Pip the fox',
    poses: {
      idle: 'pip-idle.png',
      teach: 'pip-teach.png',
      point: 'pip-point.png',
      celebrate: 'pip-celebrate.png',
    },
  },
};

// Which motion class goes with a pose when nothing else is asked for.
const CHARACTER_REST_MOTION = {
  idle: 'is-idle',
  teach: 'is-talking',
  point: 'is-leaning',
  celebrate: 'is-hopping',
};

/* Markup for a character. `height` is CSS px; width follows the art.
   The character is decorative — the words it "says" live in real DOM
   text elsewhere, so a screen reader never depends on the picture. */
function characterHTML(name, pose = 'idle', height = 150, opts = {}) {
  const art = CHARACTER_ART[name];
  if (!art) return '';
  const start = art.poses[pose] ? pose : 'idle';
  const motion = opts.motion === undefined ? (CHARACTER_REST_MOTION[start] || '') : opts.motion;
  const id = opts.id ? ` id="${opts.id}"` : '';

  const imgs = Object.keys(art.poses).map((p) =>
    `<img src="${art.dir}${art.poses[p]}" data-pose="${p}"` +
    `${p === start ? ' class="is-on"' : ''} alt="" aria-hidden="true" draggable="false">`
  ).join('');

  return `<span${id} class="lgc ${motion}" data-character="${name}" ` +
    `style="height:${height}px" role="presentation">${imgs}</span>`;
}

/* Swap pose. Safe to call with anything — unknown poses are ignored so
   a typo can never blank the character mid-lesson. */
function setCharacterPose(el, pose) {
  if (!el) return;
  const next = el.querySelector(`img[data-pose="${pose}"]`);
  if (!next) return;
  const current = el.querySelector('img.is-on');
  if (current === next) return;
  if (current) current.classList.remove('is-on');
  next.classList.add('is-on');
}

/* Set the motion class. Pass '' to hold still. */
function setCharacterMotion(el, motion) {
  if (!el) return;
  el.classList.remove('is-idle', 'is-talking', 'is-entering', 'is-hopping', 'is-leaning');
  if (motion) el.classList.add(motion);
}

/* Play a one-shot motion, then fall back to a resting one.
   Driven by the animationend event with a timer as a backstop, so a
   dropped event can never leave the character stuck. Nothing in the
   lesson ever waits on this — it is decoration, and it fails open. */
function playCharacterMotion(el, motion, restMotion = 'is-idle', maxMs = 1400) {
  if (!el) return;
  setCharacterMotion(el, motion);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.removeEventListener('animationend', finish);
    setCharacterMotion(el, restMotion);
  };
  el.addEventListener('animationend', finish);
  setTimeout(finish, maxMs);
}

/* Pose + matching motion in one call. */
function characterAct(el, pose, opts = {}) {
  if (!el) return;
  setCharacterPose(el, pose);
  const motion = opts.motion === undefined ? (CHARACTER_REST_MOTION[pose] || '') : opts.motion;
  if (opts.once) playCharacterMotion(el, motion, opts.rest || 'is-idle', opts.maxMs);
  else setCharacterMotion(el, motion);
}
