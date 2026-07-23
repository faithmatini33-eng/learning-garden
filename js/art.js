/* ============================================================
   LEARNING GARDEN — art.js · procedural art library
   Every graphic in the owl's crafted style: flat shapes, warm
   design-token palette, subtle details, aria-hidden SVG strings.
   Two halves:
     1) Fixed cast + chrome — fox teacher, 12 kid avatars,
        star/flame/drop/sun/gift/trophy/heart, life-cycle art.
     2) Generative garden — seeded flowers, critters, and full
        garden scenes. Same seed in => same picture out, forever
        (tiny mulberry32 PRNG inside; Math.random is never used).
   Pure functions only — no DOM access, no emoji, no fonts.
   ============================================================ */

/* ---------------- palette (mirrors styles.css tokens) ---------------- */
const ART = {
  paper: '#FBF6EF', ink: '#2A2320', cap: '#443A33',
  terra: '#D05C38', terraDark: '#B8491A', terraSoft: '#E8845C', terraGlow: '#F0975C',
  teal: '#1F8A80', green: '#4E9B6B', greenDeep: '#3B7A52', greenSoft: '#6FB086',
  gold: '#C98A2B', goldDark: '#A06B1B', sun: '#F2B035', sunBright: '#FFD84D', honey: '#E8A63C',
  pink: '#F58BA4', purple: '#8E6BB0', lilac: '#B99BD6', blue: '#4A7FB5', blueDeep: '#38648F',
  water: '#4FA3D1', waterTint: '#BFE0F2', skySoft: '#9CC9E8',
  cream: '#FBF0DE', milk: '#FFF8EE', linen: '#EDD9BF', oat: '#EBD9B8', sand: '#C9A876', tan: '#D9B98F',
  soil: '#A97B4F', cocoa: '#8C5A2B',
  leafPale: '#C9E4D0', leafFresh: '#7FB86F',
  lockFill: '#F6EFE4', lockLine: '#D9CDBD',
};

// The fixed garden palette the seeded flowers bloom in.
const GARDEN_PALETTE = ['#F2B035', '#F58BA4', '#E8845C', '#B99BD6', '#FFF8EE', '#9CC9E8'];

/* ---------------- tiny shared helpers ---------------- */
// round to 2 decimals so path strings stay short and stable
function artN(v) { return Math.round(v * 100) / 100; }
function artWrap(size, body, viewBox = 64, cls = '') {
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;
}
// eye glint pair — the little life-dots every character shares with the owl
function artEyes(x1, x2, y, r, fill = ART.ink) {
  const g = artN(r * 0.42);
  return `<circle cx="${x1}" cy="${y}" r="${r}" fill="${fill}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${fill}"/>`
    + `<circle cx="${artN(x1 + r * 0.32)}" cy="${artN(y - r * 0.36)}" r="${g}" fill="#fff"/>`
    + `<circle cx="${artN(x2 + r * 0.32)}" cy="${artN(y - r * 0.36)}" r="${g}" fill="#fff"/>`;
}
function artBlush(x1, x2, y, r = 2.7, o = 0.45) {
  return `<circle cx="${x1}" cy="${y}" r="${r}" fill="${ART.pink}" opacity="${o}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${ART.pink}" opacity="${o}"/>`;
}
function artSmile(x, y, w, stroke = ART.ink, sw = 1.8) {
  return `<path d="M${artN(x - w)} ${y} Q${x} ${artN(y + w * 0.72)} ${artN(x + w)} ${y}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
}
// 4-point sparkle (celebrations)
function artSpark(x, y, s, fill = ART.sun) {
  return `<path d="M${x} ${artN(y - s)} L${artN(x + s * 0.3)} ${artN(y - s * 0.3)} L${artN(x + s)} ${y} L${artN(x + s * 0.3)} ${artN(y + s * 0.3)} L${x} ${artN(y + s)} L${artN(x - s * 0.3)} ${artN(y + s * 0.3)} L${artN(x - s)} ${y} L${artN(x - s * 0.3)} ${artN(y - s * 0.3)} Z" fill="${fill}"/>`;
}

/* ============================================================
   FOX — the teacher mascot (replaces the fox emoji everywhere)
   poses: 'idle' (soft smile) · 'talk' (open mouth) · 'cheer'
   (happy closed eyes + sparkles). Reads at 40px, adorable at 110.
   ============================================================ */
function foxSVG(size = 64, pose = 'idle') {
  const p = pose === 'talk' || pose === 'cheer' ? pose : 'idle';
  const ears =
    `<path d="M11.5 23.5 L14.6 3.5 L27.5 16.5 Z" fill="${ART.terra}"/>` +
    `<path d="M52.5 23.5 L49.4 3.5 L36.5 16.5 Z" fill="${ART.terra}"/>` +
    `<path d="M15 19.6 L16.3 9.2 L23.2 16.2 Z" fill="${ART.cream}"/>` +
    `<path d="M49 19.6 L47.7 9.2 L40.8 16.2 Z" fill="${ART.cream}"/>`;
  const head = `<path d="M32 8.5 C43.5 8.5 52.5 16 52.5 27.5 C52.5 41.5 44 52.5 32 52.5 C20 52.5 11.5 41.5 11.5 27.5 C11.5 16 20.5 8.5 32 8.5 Z" fill="${ART.terraSoft}"/>`;
  const fluff =
    `<path d="M13 29.5 L3.2 34.8 L13.8 39.5 Z" fill="${ART.terraSoft}"/>` +
    `<path d="M51 29.5 L60.8 34.8 L50.2 39.5 Z" fill="${ART.terraSoft}"/>`;
  const muzzle = `<path d="M19.5 39 Q20 32.5 26.5 33.5 Q30.5 34.5 32 37.5 Q33.5 34.5 37.5 33.5 Q44 32.5 44.5 39 Q44.8 49 32 50 Q19.2 49 19.5 39 Z" fill="${ART.cream}"/>`;
  const dots =
    `<circle cx="24" cy="42.6" r=".8" fill="${ART.tan}"/><circle cx="26.2" cy="44.9" r=".8" fill="${ART.tan}"/>` +
    `<circle cx="40" cy="42.6" r=".8" fill="${ART.tan}"/><circle cx="37.8" cy="44.9" r=".8" fill="${ART.tan}"/>`;
  const nose = `<path d="M32 40 L28.6 36.6 Q32 34.8 35.4 36.6 Z" fill="${ART.ink}"/>`;
  const eyes = p === 'cheer'
    ? `<path d="M19 29.5 Q22.5 25.8 26 29.5" stroke="${ART.ink}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M38 29.5 Q41.5 25.8 45 29.5" stroke="${ART.ink}" stroke-width="2.6" stroke-linecap="round"/>`
    : artEyes(22.5, 41.5, 29.5, 3.6);
  const mouth = p === 'talk'
    ? `<path d="M26.8 42.6 Q32 51 37.2 42.6 Z" fill="#8C3A1E"/><path d="M29.2 45.6 Q32 48.4 34.8 45.6 Q32 49.4 29.2 45.6 Z" fill="${ART.pink}"/>`
    : p === 'cheer'
      ? `<path d="M26.5 42.5 Q32 48.5 37.5 42.5" stroke="${ART.goldDark}" stroke-width="2" stroke-linecap="round"/>`
      : `<path d="M27.5 43.2 Q32 46.8 36.5 43.2" stroke="${ART.goldDark}" stroke-width="1.8" stroke-linecap="round"/>`;
  const sparks = p === 'cheer'
    ? artSpark(7.5, 13, 3.2) + artSpark(56.5, 12, 2.6, ART.sunBright) + artSpark(58.5, 26, 1.9)
    : '';
  return artWrap(size, ears + head + fluff + muzzle + dots + eyes +
    artBlush(17.5, 46.5, 36.5) + nose + mouth + sparks, 64, 'fox-svg fox-' + p);
}

/* ============================================================
   AVATARS — the 12 kid animals as crafted round-faced heads.
   Keyed by kind: fox panda unicorn frog lion octopus butterfly
   turtle bunny tiger dino dolphin. Unknown kind falls back to fox.
   ============================================================ */
const AVATAR_ART = {
  fox() {
    return `<path d="M13.5 25.5 L16.2 5.5 L28.5 18 Z" fill="${ART.terra}"/>` +
      `<path d="M50.5 25.5 L47.8 5.5 L35.5 18 Z" fill="${ART.terra}"/>` +
      `<path d="M16.8 21.4 L17.9 11.4 L24.5 18.2 Z" fill="${ART.cream}"/>` +
      `<path d="M47.2 21.4 L46.1 11.4 L39.5 18.2 Z" fill="${ART.cream}"/>` +
      `<circle cx="32" cy="36" r="21.5" fill="${ART.terraSoft}"/>` +
      `<path d="M21.5 42 Q22 36.5 27.5 37.4 Q30.8 38.2 32 40.6 Q33.2 38.2 36.5 37.4 Q42 36.5 42.5 42 Q42.7 50 32 50.8 Q21.3 50 21.5 42 Z" fill="${ART.cream}"/>` +
      artEyes(24, 40, 33.5, 3.4) + artBlush(15.5, 48.5, 40) +
      `<path d="M32 44.6 L29 41.6 Q32 40 35 41.6 Z" fill="${ART.ink}"/>` +
      `<path d="M28.5 47 Q32 49.8 35.5 47" stroke="${ART.goldDark}" stroke-width="1.7" stroke-linecap="round"/>`;
  },
  panda() {
    return `<circle cx="15.5" cy="15.5" r="7" fill="${ART.ink}"/><circle cx="48.5" cy="15.5" r="7" fill="${ART.ink}"/>` +
      `<circle cx="32" cy="35" r="22" fill="#FFFFFF" stroke="#EDE4D6" stroke-width="1.4"/>` +
      `<ellipse cx="23" cy="31.5" rx="5.8" ry="7.4" fill="${ART.ink}" transform="rotate(-16 23 31.5)"/>` +
      `<ellipse cx="41" cy="31.5" rx="5.8" ry="7.4" fill="${ART.ink}" transform="rotate(16 41 31.5)"/>` +
      `<circle cx="24.2" cy="30.2" r="1.7" fill="#fff"/><circle cx="42.2" cy="30.2" r="1.7" fill="#fff"/>` +
      `<path d="M32 41.8 L29.2 39.2 Q32 37.8 34.8 39.2 Z" fill="${ART.ink}"/>` +
      artSmile(32, 44.6, 3.4, ART.ink, 1.7) + artBlush(15.5, 48.5, 39, 2.6, 0.4);
  },
  unicorn() {
    return `<path d="M32 2.5 L37 17 Q32 19 27 17 Z" fill="${ART.sun}"/>` +
      `<path d="M29 9.5 L34.6 8 M28 13.4 L36 11.6" stroke="${ART.honey}" stroke-width="1.5" stroke-linecap="round"/>` +
      `<path d="M15 22 Q13 12 20.5 11 Q24.5 14.5 23.5 20.5 Z" fill="${ART.milk}"/>` +
      `<path d="M49 22 Q51 12 43.5 11 Q39.5 14.5 40.5 20.5 Z" fill="${ART.milk}"/>` +
      `<circle cx="32" cy="37" r="21" fill="${ART.milk}" stroke="${ART.linen}" stroke-width="1.2"/>` +
      `<path d="M19 19.5 Q28 11.5 41 15.5 Q34 19.5 27.5 20.6 Q22.5 21.2 19 19.5 Z" fill="${ART.lilac}"/>` +
      `<circle cx="46" cy="23.5" r="5.4" fill="${ART.pink}"/><circle cx="49.5" cy="31.5" r="4.6" fill="${ART.lilac}"/><circle cx="50.5" cy="39.5" r="3.8" fill="${ART.pink}"/>` +
      artEyes(24.5, 39.5, 35, 3.3) + artBlush(17.5, 46.5, 42) +
      `<circle cx="29" cy="45.5" r="1" fill="${ART.tan}"/><circle cx="35" cy="45.5" r="1" fill="${ART.tan}"/>` +
      artSmile(32, 48.6, 3.4, ART.cocoa, 1.6);
  },
  frog() {
    return `<circle cx="19.5" cy="19.5" r="7.5" fill="${ART.green}"/><circle cx="44.5" cy="19.5" r="7.5" fill="${ART.green}"/>` +
      `<circle cx="19.5" cy="19" r="4.6" fill="${ART.paper}"/><circle cx="44.5" cy="19" r="4.6" fill="${ART.paper}"/>` +
      `<circle cx="20" cy="19.4" r="2.3" fill="${ART.ink}"/><circle cx="45" cy="19.4" r="2.3" fill="${ART.ink}"/>` +
      `<circle cx="20.8" cy="18.5" r=".85" fill="#fff"/><circle cx="45.8" cy="18.5" r=".85" fill="#fff"/>` +
      `<ellipse cx="32" cy="37" rx="22" ry="18.5" fill="${ART.green}"/>` +
      `<path d="M17 45 Q32 52.5 47 45 Q41.5 53.8 32 54 Q22.5 53.8 17 45 Z" fill="${ART.leafPale}"/>` +
      `<circle cx="29" cy="33.5" r=".95" fill="${ART.greenDeep}"/><circle cx="35" cy="33.5" r=".95" fill="${ART.greenDeep}"/>` +
      `<path d="M22.5 39.5 Q32 46.5 41.5 39.5" stroke="${ART.ink}" stroke-width="2.1" stroke-linecap="round"/>` +
      artBlush(15.5, 48.5, 42, 2.9);
  },
  lion() {
    let mane = '';
    for (let i = 0; i < 12; i++) mane += `<ellipse cx="32" cy="14.5" rx="6.4" ry="10.2" fill="${ART.gold}" transform="rotate(${i * 30} 32 33)"/>`;
    return mane + `<circle cx="32" cy="33" r="17.5" fill="${ART.sun}"/>` +
      `<circle cx="27.6" cy="40.5" r="5.2" fill="${ART.cream}"/><circle cx="36.4" cy="40.5" r="5.2" fill="${ART.cream}"/>` +
      artEyes(25, 30, 30.5, 3.1) + artBlush(18.5, 45.5, 36.5, 2.4) +
      `<path d="M32 40.8 L29.2 38.1 Q32 36.7 34.8 38.1 Z" fill="${ART.goldDark}"/>` +
      `<path d="M28.7 43.6 Q32 46.2 35.3 43.6" stroke="${ART.goldDark}" stroke-width="1.6" stroke-linecap="round"/>`;
  },
  octopus() {
    return `<path d="M11.5 32 a20.5 20 0 0 1 41 0 l0 11 a4.1 3.6 0 0 1 -8.2 0 a4.1 3.6 0 0 1 -8.2 0 a4.1 3.6 0 0 1 -8.2 0 a4.1 3.6 0 0 1 -8.2 0 a4.1 3.6 0 0 1 -8.2 0 Z" fill="${ART.purple}"/>` +
      `<circle cx="18" cy="21" r="2" fill="${ART.lilac}"/><circle cx="45" cy="18.5" r="2.3" fill="${ART.lilac}"/><circle cx="38" cy="13.5" r="1.5" fill="${ART.lilac}"/><circle cx="24.5" cy="14.5" r="1.4" fill="${ART.lilac}"/>` +
      `<circle cx="24" cy="30.5" r="5.4" fill="${ART.paper}"/><circle cx="40" cy="30.5" r="5.4" fill="${ART.paper}"/>` +
      `<circle cx="24.6" cy="31" r="2.7" fill="${ART.ink}"/><circle cx="40.6" cy="31" r="2.7" fill="${ART.ink}"/>` +
      `<circle cx="25.5" cy="30" r="1" fill="#fff"/><circle cx="41.5" cy="30" r="1" fill="#fff"/>` +
      artSmile(32, 39.5, 3.8, ART.ink, 2) + artBlush(15.8, 48.2, 36.5, 2.7, 0.5);
  },
  butterfly() {
    return `<path d="M29.5 13.5 Q26 7.5 21.5 6.5 M34.5 13.5 Q38 7.5 42.5 6.5" stroke="${ART.cap}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<circle cx="21.5" cy="6.5" r="1.6" fill="${ART.cap}"/><circle cx="42.5" cy="6.5" r="1.6" fill="${ART.cap}"/>` +
      `<path d="M29 25 Q8 9 5.5 22.5 Q4.5 32.5 16 36.5 Q26 39 29 30.5 Z" fill="${ART.pink}"/>` +
      `<path d="M35 25 Q56 9 58.5 22.5 Q59.5 32.5 48 36.5 Q38 39 35 30.5 Z" fill="${ART.pink}"/>` +
      `<path d="M29.4 34.5 Q13 36.5 11 46.5 Q10.5 54 20 53.4 Q28.5 52.2 30 42.5 Z" fill="${ART.lilac}"/>` +
      `<path d="M34.6 34.5 Q51 36.5 53 46.5 Q53.5 54 44 53.4 Q35.5 52.2 34 42.5 Z" fill="${ART.lilac}"/>` +
      `<circle cx="14.5" cy="22" r="3" fill="${ART.milk}" opacity=".9"/><circle cx="49.5" cy="22" r="3" fill="${ART.milk}" opacity=".9"/>` +
      `<circle cx="18.5" cy="46.5" r="2.1" fill="${ART.milk}" opacity=".85"/><circle cx="45.5" cy="46.5" r="2.1" fill="${ART.milk}" opacity=".85"/>` +
      `<circle cx="21.5" cy="29.5" r="1.5" fill="${ART.sunBright}"/><circle cx="42.5" cy="29.5" r="1.5" fill="${ART.sunBright}"/>` +
      `<circle cx="32" cy="17.5" r="4.6" fill="${ART.cap}"/><rect x="29.4" y="20.5" width="5.2" height="26" rx="2.6" fill="${ART.cap}"/>` +
      `<circle cx="30.4" cy="16.6" r="1" fill="#fff"/><circle cx="33.6" cy="16.6" r="1" fill="#fff"/>` +
      `<path d="M30.6 19.4 Q32 20.6 33.4 19.4" stroke="${ART.paper}" stroke-width="1" stroke-linecap="round"/>`;
  },
  turtle() {
    return `<path d="M13 24.5 a19 17.5 0 0 1 38 0 Z" fill="${ART.gold}"/>` +
      `<path d="M27 11.5 L37 11.5 L40.5 17.5 L37 23.5 L27 23.5 L23.5 17.5 Z" fill="${ART.goldDark}" opacity=".4"/>` +
      `<path d="M27 11.5 L24 8 M37 11.5 L40 8 M40.5 17.5 L47.5 16.5 M23.5 17.5 L16.5 16.5 M37 23.5 L39.5 24.4 M27 23.5 L24.5 24.4" stroke="${ART.goldDark}" stroke-width="1.5" stroke-linecap="round"/>` +
      `<rect x="11" y="23" width="42" height="5.4" rx="2.7" fill="${ART.soil}"/>` +
      `<ellipse cx="11.5" cy="49" rx="5" ry="3" fill="${ART.greenSoft}" transform="rotate(-24 11.5 49)"/>` +
      `<ellipse cx="52.5" cy="49" rx="5" ry="3" fill="${ART.greenSoft}" transform="rotate(24 52.5 49)"/>` +
      `<circle cx="32" cy="42" r="17.5" fill="${ART.greenSoft}"/>` +
      artEyes(25.5, 38.5, 40, 3.1) + artBlush(18.5, 45.5, 46.5, 2.4) +
      `<circle cx="30" cy="46" r=".85" fill="${ART.greenDeep}"/><circle cx="34" cy="46" r=".85" fill="${ART.greenDeep}"/>` +
      artSmile(32, 49, 3.6, ART.ink, 1.8);
  },
  bunny() {
    return `<ellipse cx="22" cy="15" rx="6" ry="13.5" fill="${ART.milk}" stroke="${ART.linen}" stroke-width="1" transform="rotate(-8 22 15)"/>` +
      `<ellipse cx="42" cy="15" rx="6" ry="13.5" fill="${ART.milk}" stroke="${ART.linen}" stroke-width="1" transform="rotate(8 42 15)"/>` +
      `<ellipse cx="22.3" cy="16" rx="2.9" ry="9" fill="${ART.pink}" opacity=".75" transform="rotate(-8 22.3 16)"/>` +
      `<ellipse cx="41.7" cy="16" rx="2.9" ry="9" fill="${ART.pink}" opacity=".75" transform="rotate(8 41.7 16)"/>` +
      `<circle cx="32" cy="40" r="18.5" fill="${ART.milk}" stroke="${ART.linen}" stroke-width="1"/>` +
      artEyes(25, 39, 38, 3.2) + artBlush(18.5, 45.5, 44, 2.6) +
      `<path d="M32 44.4 L29.6 42.2 Q32 41.1 34.4 42.2 Z" fill="${ART.pink}"/>` +
      `<rect x="29.9" y="45.4" width="4.2" height="4.4" rx="1.3" fill="#FFFFFF" stroke="#EDE4D6" stroke-width=".8"/>` +
      `<path d="M32 45.6 v3.8" stroke="#EDE4D6" stroke-width=".8"/>` +
      `<circle cx="21" cy="41" r=".75" fill="${ART.tan}"/><circle cx="19.5" cy="43.5" r=".75" fill="${ART.tan}"/>` +
      `<circle cx="43" cy="41" r=".75" fill="${ART.tan}"/><circle cx="44.5" cy="43.5" r=".75" fill="${ART.tan}"/>`;
  },
  tiger() {
    return `<circle cx="16" cy="16" r="6.6" fill="${ART.terraGlow}"/><circle cx="48" cy="16" r="6.6" fill="${ART.terraGlow}"/>` +
      `<circle cx="16" cy="16" r="3.1" fill="${ART.cream}"/><circle cx="48" cy="16" r="3.1" fill="${ART.cream}"/>` +
      `<circle cx="32" cy="34" r="21" fill="${ART.terraGlow}"/>` +
      `<path d="M32 13.2 L30.2 19.5 Q32 20.4 33.8 19.5 Z M24.5 14.8 L24.8 20 Q26.4 20.3 27.5 19.3 Z M39.5 14.8 L39.2 20 Q37.6 20.3 36.5 19.3 Z" fill="${ART.ink}" opacity=".85"/>` +
      `<path d="M11.3 27.5 L19 29.3 L11.6 31.6 Z M12.6 35.5 L19.5 35.8 L13.4 39 Z M52.7 27.5 L45 29.3 L52.4 31.6 Z M51.4 35.5 L44.5 35.8 L50.6 39 Z" fill="${ART.ink}" opacity=".85"/>` +
      `<circle cx="27.2" cy="42" r="5.4" fill="${ART.cream}"/><circle cx="36.8" cy="42" r="5.4" fill="${ART.cream}"/>` +
      artEyes(24, 40, 31.5, 3.3) +
      `<path d="M32 42.4 L29.3 39.8 Q32 38.4 34.7 39.8 Z" fill="${ART.ink}"/>` +
      `<path d="M28.6 45.2 Q32 47.8 35.4 45.2" stroke="${ART.goldDark}" stroke-width="1.6" stroke-linecap="round"/>`;
  },
  dino() {
    return `<path d="M20 18.5 Q20.8 8.5 27.6 12.6 L24.6 19.8 Z" fill="${ART.teal}"/>` +
      `<path d="M28.6 12.8 Q32 3.5 35.4 12.8 Q32 15.6 28.6 12.8 Z" fill="${ART.teal}"/>` +
      `<path d="M44 18.5 Q43.2 8.5 36.4 12.6 L39.4 19.8 Z" fill="${ART.teal}"/>` +
      `<circle cx="32" cy="36" r="19.5" fill="${ART.green}"/>` +
      `<circle cx="17.5" cy="29" r="1.8" fill="${ART.greenSoft}"/><circle cx="46.5" cy="31" r="1.8" fill="${ART.greenSoft}"/><circle cx="20.5" cy="44" r="1.5" fill="${ART.greenSoft}"/><circle cx="44" cy="45" r="1.5" fill="${ART.greenSoft}"/>` +
      `<circle cx="24.5" cy="33" r="5" fill="${ART.paper}"/><circle cx="39.5" cy="33" r="5" fill="${ART.paper}"/>` +
      `<circle cx="25.1" cy="33.5" r="2.5" fill="${ART.ink}"/><circle cx="40.1" cy="33.5" r="2.5" fill="${ART.ink}"/>` +
      `<circle cx="26" cy="32.6" r=".9" fill="#fff"/><circle cx="41" cy="32.6" r=".9" fill="#fff"/>` +
      `<ellipse cx="28.5" cy="43" rx="1.3" ry="1" fill="${ART.greenDeep}"/><ellipse cx="35.5" cy="43" rx="1.3" ry="1" fill="${ART.greenDeep}"/>` +
      `<path d="M26 46.5 Q32 50.5 38 46.5" stroke="${ART.ink}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M35.2 47.6 l2.5 .4 -1.2 2.1 Z" fill="#fff"/>` + artBlush(17, 47, 40, 2.4);
  },
  dolphin() {
    return `<path d="M28 16.5 Q30 5.5 38.5 8 Q33.5 11.8 33 17.5 Z" fill="${ART.blueDeep}"/>` +
      `<circle cx="32" cy="36" r="20" fill="${ART.blue}"/>` +
      `<path d="M14.5 42 Q32 54.5 49.5 42 Q44.5 54.5 32 55 Q19.5 54.5 14.5 42 Z" fill="${ART.waterTint}"/>` +
      `<ellipse cx="10.5" cy="38" rx="4.4" ry="2.6" fill="${ART.blueDeep}" transform="rotate(-30 10.5 38)"/>` +
      `<ellipse cx="53.5" cy="38" rx="4.4" ry="2.6" fill="${ART.blueDeep}" transform="rotate(30 53.5 38)"/>` +
      artEyes(24, 40, 33, 3) + artBlush(17, 47, 39, 2.5, 0.4) +
      `<path d="M25.5 42 Q32 48 38.5 42" stroke="${ART.ink}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<circle cx="32" cy="19" r="1.1" fill="${ART.blueDeep}"/>`;
  },
};
function avatarSVG(kind, size = 64) {
  const draw = AVATAR_ART[kind] || AVATAR_ART.fox;
  return artWrap(size, draw(), 64, 'avatar-svg avatar-' + (AVATAR_ART[kind] ? kind : 'fox'));
}

/* ============================================================
   CHROME — flat replacements for star/flame/drop/sun/gift/trophy/
   heart emoji. viewBox 32, crisp from 14px up.
   ============================================================ */
function starSVG(size = 18, filled = true) {
  const pts = 'M16 3.5 L19.41 11.31 L27.89 12.14 L21.52 17.79 L23.35 26.11 L16 21.8 L8.65 26.11 L10.48 17.79 L4.11 12.14 L12.59 11.31 Z';
  const body = filled
    ? `<path d="${pts}" fill="${ART.sun}" stroke="${ART.sun}" stroke-width="3" stroke-linejoin="round"/>` +
      `<circle cx="11.6" cy="9.6" r="1.15" fill="#fff" opacity=".8"/>`
    : `<path d="${pts}" fill="${ART.lockFill}" stroke="${ART.lockLine}" stroke-width="3" stroke-linejoin="round"/>`;
  return artWrap(size, body, 32, 'star-svg');
}
function flameSVG(size = 18) {
  return artWrap(size,
    `<path d="M17.5 3 C13 8.5 6.5 13.5 6.5 20.5 a9.5 9.5 0 0 0 19 0 C25.5 15 21 9 17.5 3 Z" fill="${ART.terra}"/>` +
    `<path d="M16.5 12.5 C13.5 16 11 18.5 11 21.8 a5 5 0 0 0 10 0 C21 18.8 18.6 16 16.5 12.5 Z" fill="${ART.sun}"/>` +
    `<circle cx="16" cy="22.4" r="2.5" fill="${ART.sunBright}"/>`, 32, 'flame-svg');
}
function dropSVG(size = 18) {
  return artWrap(size,
    `<path d="M16 3.5 C11.5 10 7 14.5 7 20 a9 9 0 0 0 18 0 C25 14.5 20.5 10 16 3.5 Z" fill="${ART.water}"/>` +
    `<path d="M11.6 19.6 a4.6 4.6 0 0 0 3.1 4.4" stroke="${ART.waterTint}" stroke-width="2.4" stroke-linecap="round"/>`, 32, 'drop-svg');
}
function sunSVG(size = 18) {
  let rays = '';
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    rays += `<path d="M${artN(16 + Math.cos(a) * 10.6)} ${artN(16 + Math.sin(a) * 10.6)} L${artN(16 + Math.cos(a) * 13.9)} ${artN(16 + Math.sin(a) * 13.9)}" stroke="${ART.sun}" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  return artWrap(size, rays +
    `<circle cx="16" cy="16" r="8" fill="${ART.sun}"/><circle cx="16" cy="16" r="6.1" fill="${ART.sunBright}"/>`, 32, 'sun-svg');
}
function giftSVG(size = 18) {
  return artWrap(size,
    `<rect x="7" y="16.5" width="18" height="11" rx="2" fill="${ART.terra}"/>` +
    `<rect x="5" y="10.5" width="22" height="6" rx="2" fill="${ART.terraDark}"/>` +
    `<rect x="14.3" y="10.5" width="3.4" height="17" fill="${ART.sun}"/>` +
    `<path d="M16 10 Q10.5 3.2 7.8 6.4 Q6.2 9.4 12.8 10.2 Z" fill="${ART.sun}"/>` +
    `<path d="M16 10 Q21.5 3.2 24.2 6.4 Q25.8 9.4 19.2 10.2 Z" fill="${ART.sun}"/>` +
    `<circle cx="16" cy="9.8" r="2" fill="${ART.sunBright}"/>`, 32, 'gift-svg');
}
function trophySVG(size = 18) {
  return artWrap(size,
    `<path d="M10 9 Q4.5 9.5 6.5 14 Q7.8 16.6 10.5 16.6 M22 9 Q27.5 9.5 25.5 14 Q24.2 16.6 21.5 16.6" stroke="${ART.honey}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<rect x="8.6" y="4.6" width="14.8" height="3.2" rx="1.6" fill="${ART.sunBright}"/>` +
    `<path d="M10 7.4 h12 v6 a6 6 0 0 1 -12 0 Z" fill="${ART.sun}"/>` +
    `<path d="M12.6 9.4 q-.7 2.6 .5 4.4" stroke="${ART.sunBright}" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>` +
    `<path d="M14.7 19.2 h2.6 l1 3.9 h-4.6 Z" fill="${ART.honey}"/>` +
    `<rect x="10.5" y="23.1" width="11" height="2.5" rx="1.2" fill="${ART.gold}"/>` +
    `<rect x="8.5" y="25.6" width="15" height="2.9" rx="1.4" fill="${ART.goldDark}"/>`, 32, 'trophy-svg');
}
function heartSVG(size = 18) {
  return artWrap(size,
    `<path d="M16 27.5 C8 21 4 16.2 4 11.3 C4 7 7.2 4.5 10.6 4.5 C13 4.5 15 6 16 8.1 C17 6 19 4.5 21.4 4.5 C24.8 4.5 28 7 28 11.3 C28 16.2 24 21 16 27.5 Z" fill="${ART.terra}"/>` +
    `<circle cx="10.8" cy="10" r="2.3" fill="${ART.terraSoft}"/>` +
    `<circle cx="9.6" cy="8.6" r=".95" fill="#fff" opacity=".85"/>`, 32, 'heart-svg');
}

/* ============================================================
   SCIENCE — butterfly life-cycle art for the Learn diagrams.
   Matches the handoff: chrysalis = teardrop #C9E4D0 + #7FB86F vein.
   ============================================================ */
function eggSVG(size = 64) {
  return artWrap(size,
    `<path d="M14 51 Q32 42.5 50 51 Q32 58.5 14 51 Z" fill="${ART.greenSoft}"/>` +
    `<path d="M19 51 Q32 47.6 45 51" stroke="${ART.green}" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path d="M32 8 C41.5 8 47.5 20.5 47.5 32.5 C47.5 42.5 41 49 32 49 C23 49 16.5 42.5 16.5 32.5 C16.5 20.5 22.5 8 32 8 Z" fill="${ART.milk}" stroke="${ART.linen}" stroke-width="1.5"/>` +
    `<ellipse cx="25.5" cy="18.5" rx="2.6" ry="5" fill="#FFFFFF" opacity=".6" transform="rotate(18 25.5 18.5)"/>` +
    `<circle cx="28" cy="27" r="1.1" fill="${ART.oat}"/><circle cx="37" cy="24" r="1.1" fill="${ART.oat}"/><circle cx="30" cy="36" r="1.1" fill="${ART.oat}"/><circle cx="37.5" cy="39.5" r="1.1" fill="${ART.oat}"/>`,
    64, 'egg-svg');
}
function caterpillarSVG(size = 64) {
  let body = '';
  const seg = [[13.5, 44.5], [21.5, 41], [29.5, 39.2], [37.5, 41]];
  for (let i = 0; i < seg.length; i++) {
    body += `<circle cx="${seg[i][0]}" cy="${seg[i][1]}" r="6.3" fill="${ART.leafFresh}"/>`;
  }
  for (let i = 0; i < seg.length; i++) {
    body += `<circle cx="${seg[i][0]}" cy="${artN(seg[i][1] - 3.6)}" r="1.7" fill="${ART.leafPale}"/>` +
      `<circle cx="${seg[i][0]}" cy="${artN(seg[i][1] + 6.7)}" r="1" fill="${ART.greenDeep}"/>`;
  }
  return artWrap(size,
    `<path d="M43.5 34.5 Q42.5 30 40 28.5 M50.5 34.5 Q51.5 30 54 28.5" stroke="${ART.greenDeep}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<circle cx="40" cy="28.5" r="1.3" fill="${ART.greenDeep}"/><circle cx="54" cy="28.5" r="1.3" fill="${ART.greenDeep}"/>` +
    body +
    `<circle cx="47" cy="41.5" r="7.6" fill="${ART.leafFresh}"/>` +
    `<circle cx="47" cy="49.6" r="1" fill="${ART.greenDeep}"/>` +
    artEyes(44.4, 49.8, 40, 1.9) + artBlush(42.6, 51.6, 44, 1.6, 0.5) +
    `<path d="M45.4 44.6 Q47.1 46.2 48.8 44.6" stroke="${ART.ink}" stroke-width="1.3" stroke-linecap="round"/>`,
    64, 'caterpillar-svg');
}
function chrysalisSVG(size = 64) {
  return artWrap(size,
    `<path d="M14 8 Q32 4 50 8" stroke="${ART.soil}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M32 6.5 L32 13" stroke="${ART.soil}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M32 12 C24 16 20.5 25 21.5 35 C22.5 46 26.5 53.5 32 55 C37.5 53.5 41.5 46 42.5 35 C43.5 25 40 16 32 12 Z" fill="${ART.leafPale}"/>` +
    `<path d="M32 14.5 L32 52.5" stroke="${ART.leafFresh}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M23.2 37.5 Q32 40.5 40.8 37.5 M24.6 44 Q32 47 39.4 44" stroke="${ART.leafFresh}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` +
    `<ellipse cx="26.8" cy="22" rx="2" ry="5" fill="${ART.milk}" opacity=".6" transform="rotate(12 26.8 22)"/>`,
    64, 'chrysalis-svg');
}
function butterflySVG(size = 64) {
  return artWrap(size,
    `<path d="M28.5 12 Q25 5.5 20.5 4.5 M35.5 12 Q39 5.5 43.5 4.5" stroke="${ART.cap}" stroke-width="1.8" stroke-linecap="round"/>` +
    `<circle cx="20.5" cy="4.5" r="1.5" fill="${ART.cap}"/><circle cx="43.5" cy="4.5" r="1.5" fill="${ART.cap}"/>` +
    `<path d="M29 24 Q6 6 4 22 Q3 34 15.5 38 Q26 40.5 29 31 Z" fill="${ART.terraSoft}"/>` +
    `<path d="M35 24 Q58 6 60 22 Q61 34 48.5 38 Q38 40.5 35 31 Z" fill="${ART.terraSoft}"/>` +
    `<path d="M27 26.5 Q15 18.5 8.5 20.5 M27 30 Q17 27.5 10 30.5" stroke="${ART.goldDark}" stroke-width="1.4" stroke-linecap="round" opacity=".65"/>` +
    `<path d="M37 26.5 Q49 18.5 55.5 20.5 M37 30 Q47 27.5 54 30.5" stroke="${ART.goldDark}" stroke-width="1.4" stroke-linecap="round" opacity=".65"/>` +
    `<path d="M29.5 35 Q11 38 9.5 48 Q9.5 56 19.5 55 Q28.5 53 30 43 Z" fill="${ART.sun}"/>` +
    `<path d="M34.5 35 Q53 38 54.5 48 Q54.5 56 44.5 55 Q35.5 53 34 43 Z" fill="${ART.sun}"/>` +
    `<circle cx="9" cy="17" r="1.7" fill="${ART.milk}"/><circle cx="55" cy="17" r="1.7" fill="${ART.milk}"/>` +
    `<circle cx="14" cy="27" r="2.4" fill="${ART.sunBright}"/><circle cx="50" cy="27" r="2.4" fill="${ART.sunBright}"/>` +
    `<circle cx="16" cy="48" r="1.9" fill="${ART.milk}" opacity=".85"/><circle cx="48" cy="48" r="1.9" fill="${ART.milk}" opacity=".85"/>` +
    `<circle cx="32" cy="16" r="4.6" fill="${ART.cap}"/><rect x="29.4" y="19" width="5.2" height="27" rx="2.6" fill="${ART.cap}"/>` +
    `<circle cx="30.4" cy="15.2" r="1" fill="#fff"/><circle cx="33.6" cy="15.2" r="1" fill="#fff"/>` +
    `<path d="M30.6 17.9 Q32 19.1 33.4 17.9" stroke="${ART.paper}" stroke-width="1" stroke-linecap="round"/>`,
    64, 'butterfly-lifecycle-svg');
}

/* ============================================================
   GENERATIVE GARDEN — the "app designs by itself" half.
   Deterministic: mulberry32 seeded PRNG, never Math.random.
   ============================================================ */
function artRNG(seed) {
  let a = (Math.floor(seed) ^ 0x9E3779B9) >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const artPick = (rnd, arr) => arr[Math.floor(rnd() * arr.length) % arr.length];

// center-disc colors that always contrast with the petal color
const FLOWER_CENTERS = {
  '#F2B035': ['#8C5A2B', '#A06B1B'],
  '#F58BA4': ['#FFD84D', '#8C5A2B'],
  '#E8845C': ['#FFD84D', '#8C5A2B'],
  '#B99BD6': ['#FFD84D', '#F2B035'],
  '#FFF8EE': ['#F2B035', '#E8A63C'],
  '#9CC9E8': ['#F2B035', '#FFD84D'],
};
const FLOWER_SEED_DOTS = {
  '#8C5A2B': '#C9A876', '#A06B1B': '#C9A876', '#F2B035': '#A06B1B',
  '#FFD84D': '#C98A2B', '#E8A63C': '#8C5A2B',
};

// inner art shared by flowerSVG and gardenSceneSVG — 64-box, rooted at (32,58)
function flowerArt(seed, palette) {
  const rnd = artRNG(seed);
  const pal = Array.isArray(palette) && palette.length ? palette : GARDEN_PALETTE;
  const petals = 5 + Math.floor(rnd() * 4);                       // 5-8
  const shape = artPick(rnd, ['round', 'pointed', 'heart']);
  const col = artPick(rnd, pal);
  const centers = FLOWER_CENTERS[col] || ['#8C5A2B', '#FFD84D'];
  const centerCol = artPick(rnd, centers);
  const centerStyle = artPick(rnd, ['dot', 'ring', 'seeds']);
  const curve = artN((rnd() - 0.5) * 11);                          // stem lean
  const cy = 20.5;                                                 // bloom center
  const len = artN(12.5 + rnd() * 3.6);                            // petal length
  const w = artN((21 / petals + 2) * (0.9 + rnd() * 0.25));        // petal width
  const rot0 = artN(rnd() * (360 / petals));
  const edge = col === '#FFF8EE' ? ` stroke="${ART.linen}" stroke-width="1"` : '';

  // stem + leaves first (petals sit on top)
  let art = `<path d="M32 58 Q${artN(32 + curve * 1.6)} 41 32 ${artN(cy + 4)}" stroke="${ART.green}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
  const leaves = 1 + Math.floor(rnd() * 2);
  let side = rnd() < 0.5 ? 1 : -1;
  for (let i = 0; i < leaves; i++) {
    const t = i === 0 ? 0.3 + rnd() * 0.14 : 0.55 + rnd() * 0.16;
    const lx = artN(32 + 2 * (1 - t) * t * curve * 1.6);
    const ly = artN((1 - t) * (1 - t) * 58 + 2 * (1 - t) * t * 41 + t * t * 24.5);
    const s = artN((0.85 + rnd() * 0.4) * side);
    const lc = artPick(rnd, [ART.green, ART.greenSoft]);
    art += `<path d="M${lx} ${ly} C ${artN(lx + 4.8 * s)} ${artN(ly - 1.2)} ${artN(lx + 7.4 * s)} ${artN(ly - 3.6)} ${artN(lx + 8.2 * s)} ${artN(ly - 6.6)} C ${artN(lx + 3.8 * s)} ${artN(ly - 5.6)} ${artN(lx + 1 * s)} ${artN(ly - 3.4)} ${lx} ${ly} Z" fill="${lc}"/>`;
    side = -side;
  }
  // petals
  for (let i = 0; i < petals; i++) {
    const a = artN(rot0 + i * 360 / petals);
    let d;
    if (shape === 'round') {
      d = `<ellipse cx="32" cy="${artN(cy - 2.2 - len / 2)}" rx="${artN(w * 0.92)}" ry="${artN(len / 2)}" fill="${col}"${edge} transform="rotate(${a} 32 ${cy})"/>`;
    } else if (shape === 'pointed') {
      d = `<path d="M32 ${cy} C ${artN(32 - w)} ${artN(cy - len * 0.45)} ${artN(32 - w * 0.72)} ${artN(cy - len * 0.95)} 32 ${artN(cy - len - 2)} C ${artN(32 + w * 0.72)} ${artN(cy - len * 0.95)} ${artN(32 + w)} ${artN(cy - len * 0.45)} 32 ${cy} Z" fill="${col}"${edge} transform="rotate(${a} 32 ${cy})"/>`;
    } else {
      d = `<path d="M32 ${cy} C ${artN(32 - w * 1.2)} ${artN(cy - len * 0.32)} ${artN(32 - w * 0.98)} ${artN(cy - len * 1.12)} 32 ${artN(cy - len * 0.82)} C ${artN(32 + w * 0.98)} ${artN(cy - len * 1.12)} ${artN(32 + w * 1.2)} ${artN(cy - len * 0.32)} 32 ${cy} Z" fill="${col}"${edge} transform="rotate(${a} 32 ${cy})"/>`;
    }
    art += d;
  }
  // center disc
  const cr = artN(4.2 + rnd() * 1.4);
  art += `<circle cx="32" cy="${cy}" r="${cr}" fill="${centerCol}"/>`;
  if (centerStyle === 'ring') {
    art += `<circle cx="32" cy="${cy}" r="${artN(cr + 2.2)}" stroke="${centerCol}" stroke-width="1.5" fill="none" opacity=".5"/>`;
  } else if (centerStyle === 'seeds') {
    const dot = FLOWER_SEED_DOTS[centerCol] || '#C9A876';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 + 0.5;
      art += `<circle cx="${artN(32 + Math.cos(a) * cr * 0.52)}" cy="${artN(cy + Math.sin(a) * cr * 0.52)}" r=".9" fill="${dot}"/>`;
    }
  }
  return art;
}
function flowerSVG(opts = {}) {
  const seed = Number.isFinite(opts.seed) ? opts.seed : 1;
  const size = opts.size || 64;
  return artWrap(size, flowerArt(seed, opts.palette), 64, 'flower-svg');
}

/* ---------------- seeded garden critters ---------------- */
const CRITTER_ART = {
  ladybug(rnd) {
    const shell = artPick(rnd, [ART.terra, ART.terraSoft, ART.sun, ART.pink]);
    const pairs = [[[23, 28], [41, 28]], [[20, 40], [44, 40]], [[27, 48], [37, 48]]];
    const n = 1 + Math.floor(rnd() * 3);
    let spots = '';
    for (let i = 0; i < n; i++) {
      const r = artN(2.5 + rnd() * 0.8);
      spots += `<circle cx="${pairs[i][0][0]}" cy="${pairs[i][0][1]}" r="${r}" fill="${ART.ink}"/><circle cx="${pairs[i][1][0]}" cy="${pairs[i][1][1]}" r="${r}" fill="${ART.ink}"/>`;
    }
    if (rnd() < 0.5) spots += `<circle cx="32" cy="34" r="2.6" fill="${ART.ink}"/>`;
    return `<path d="M27.5 8.5 Q25.5 4.5 22.5 4 M36.5 8.5 Q38.5 4.5 41.5 4" stroke="${ART.ink}" stroke-width="1.5" stroke-linecap="round"/>` +
      `<circle cx="22.5" cy="4" r="1.4" fill="${ART.ink}"/><circle cx="41.5" cy="4" r="1.4" fill="${ART.ink}"/>` +
      `<circle cx="32" cy="14.5" r="7.8" fill="${ART.ink}"/>` +
      `<circle cx="29" cy="12.8" r="1.6" fill="${ART.paper}"/><circle cx="35" cy="12.8" r="1.6" fill="${ART.paper}"/>` +
      `<path d="M29.5 16.6 Q32 18.4 34.5 16.6" stroke="${ART.paper}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<ellipse cx="32" cy="37" rx="20" ry="18.5" fill="${shell}"/>` +
      `<path d="M32 19 V55" stroke="${ART.ink}" stroke-width="1.8"/>` + spots;
  },
  bee(rnd) {
    const tilt = artN(14 + rnd() * 8);
    const stripes = 2 + Math.floor(rnd() * 2);
    let bands = '';
    for (let i = 0; i < stripes; i++) {
      const x = stripes === 2 ? [25.5, 38.5][i] : [24, 32, 40][i];
      bands += `<path d="M${x} 27 Q${artN(x - 2.2)} 38 ${x} 48.6" stroke="${ART.ink}" stroke-width="4.4" stroke-linecap="round"/>`;
    }
    return `<ellipse cx="24" cy="17" rx="6.6" ry="9.6" fill="${ART.milk}" opacity=".92" stroke="${ART.skySoft}" stroke-width="1.2" transform="rotate(-${tilt} 24 17)"/>` +
      `<ellipse cx="40" cy="17" rx="6.6" ry="9.6" fill="${ART.milk}" opacity=".92" stroke="${ART.skySoft}" stroke-width="1.2" transform="rotate(${tilt} 40 17)"/>` +
      `<path d="M27.5 26.5 Q25.5 20.5 21.8 18.8 M36.5 26.5 Q38.5 20.5 42.2 18.8" stroke="${ART.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<circle cx="21.8" cy="18.8" r="1.3" fill="${ART.ink}"/><circle cx="42.2" cy="18.8" r="1.3" fill="${ART.ink}"/>` +
      `<path d="M30.4 51.5 L32 57 L33.6 51.5 Z" fill="${ART.ink}"/>` +
      `<ellipse cx="32" cy="38.5" rx="17" ry="13.5" fill="${ART.sun}"/>` + bands +
      artEyes(27, 37, 35, 2.5) + artBlush(23, 41, 40.5, 2.2, 0.5) +
      `<path d="M28.8 41.5 Q32 44.2 35.2 41.5" stroke="${ART.ink}" stroke-width="1.7" stroke-linecap="round"/>`;
  },
  snail(rnd) {
    const shells = { '#F2B035': '#C98A2B', '#F58BA4': '#D05C38', '#B99BD6': '#8E6BB0', '#9CC9E8': '#4A7FB5', '#E8845C': '#B8491A' };
    const shell = artPick(rnd, Object.keys(shells));
    const wob = artN(rnd() * 2 - 1);
    return `<path d="M17 ${artN(33.5 + wob)} Q21.5 30 24.5 34 Q26.5 37.5 26 43 L26 47.5 L44 47.5 Q52 48 52 50.6 Q52 53.6 44.5 53.6 L15.5 53.6 Q10.5 53.6 10.8 48.5 Q11.2 38.5 17 ${artN(33.5 + wob)} Z" fill="${ART.sand}"/>` +
      `<path d="M18 33 Q17 27.5 14.5 25.5 M23 33.5 Q24 28 26.5 26.5" stroke="${ART.sand}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<circle cx="14.5" cy="25" r="2.6" fill="${ART.paper}"/><circle cx="26.5" cy="26" r="2.6" fill="${ART.paper}"/>` +
      `<circle cx="14.9" cy="25.3" r="1.3" fill="${ART.ink}"/><circle cx="26.9" cy="26.3" r="1.3" fill="${ART.ink}"/>` +
      `<circle cx="15.4" cy="24.7" r=".5" fill="#fff"/><circle cx="27.4" cy="25.7" r=".5" fill="#fff"/>` +
      `<path d="M17.5 38.5 Q19.5 40.2 21.5 38.5" stroke="${ART.cocoa}" stroke-width="1.4" stroke-linecap="round"/>` +
      `<circle cx="15.8" cy="40.5" r="1.7" fill="${ART.pink}" opacity=".5"/>` +
      `<circle cx="40" cy="33.5" r="13.8" fill="${shell}"/>` +
      `<path d="M40 33.5 a4 4 0 0 1 4 4 a6.3 6.3 0 0 1 -6.3 6.3 a8.8 8.8 0 0 1 -8.8 -8.8 a11 11 0 0 1 11 -11" stroke="${shells[shell]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  },
  worm(rnd) {
    const col = artPick(rnd, [ART.terraGlow, ART.pink, ART.terraSoft]);
    const hat = rnd() < 0.55;
    const dip = artN(42 + rnd() * 4);
    return `<path d="M12 51.5 Q15 ${dip} 23 45 Q31 48.5 36.5 44 Q41 40 45.5 40.5" stroke="${col}" stroke-width="7.5" stroke-linecap="round" fill="none"/>` +
      `<path d="M19 42.6 Q21.5 45 20.2 48 M27.8 44.4 Q30 46.8 28.8 49.8 M35.4 41.4 Q37.6 43.6 36.6 46.6" stroke="${ART.terraDark}" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>` +
      `<circle cx="47.5" cy="41" r="6.2" fill="${col}"/>` +
      artEyes(45.6, 50.2, 39.6, 1.8) + `<circle cx="43.8" cy="43.4" r="1.5" fill="${ART.pink}" opacity=".55"/>` +
      `<path d="M46 44 Q48 45.6 50.2 44.2" stroke="${ART.ink}" stroke-width="1.3" stroke-linecap="round"/>` +
      (hat
        ? `<path d="M47.5 34.6 V30.5" stroke="${ART.green}" stroke-width="1.5" stroke-linecap="round"/>` +
          `<path d="M47.5 30.5 C45 30.2 43.6 28.5 43.2 26.7 C45.8 27.1 47.2 28.5 47.5 30.5 Z" fill="${ART.greenSoft}"/>` +
          `<path d="M47.5 30.5 C50 30.2 51.4 28.5 51.8 26.7 C49.2 27.1 47.8 28.5 47.5 30.5 Z" fill="${ART.green}"/>`
        : '');
  },
  bird(rnd) {
    const dark = { '#4FA3D1': '#4A7FB5', '#F2B035': '#C98A2B', '#F58BA4': '#D05C38', '#B99BD6': '#8E6BB0', '#E8845C': '#B8491A' };
    const col = artPick(rnd, Object.keys(dark));
    const d = dark[col];
    const flower = rnd() < 0.4;
    let crownArt = `<path d="M28 19.5 Q27.5 15.5 25 14 M31 19.3 Q31.5 15 34 13.5" stroke="${d}" stroke-width="1.8" stroke-linecap="round"/>`;
    if (flower) {
      crownArt = `<path d="M30 19.5 V15.5" stroke="${ART.green}" stroke-width="1.4" stroke-linecap="round"/>` +
        `<circle cx="27.6" cy="14" r="1.7" fill="${ART.milk}"/><circle cx="32.4" cy="14" r="1.7" fill="${ART.milk}"/><circle cx="30" cy="11.8" r="1.7" fill="${ART.milk}"/><circle cx="30" cy="13.9" r="1.3" fill="${ART.sun}"/>`;
    }
    return `<path d="M14.8 41.5 Q8.5 42.5 5 46 M16 44.5 Q11 46 8.5 49.5" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="M27 52.5 V58 M35 52.5 V58" stroke="${ART.goldDark}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M27 58 l3.6 .8 M35 58 l3.6 .8" stroke="${ART.goldDark}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<circle cx="30" cy="36" r="17" fill="${col}"/>` + crownArt +
      `<path d="M17.5 41.5 Q30 50 42.5 41.5 Q38.5 51 30 51.5 Q21.5 51 17.5 41.5 Z" fill="${ART.cream}"/>` +
      `<path d="M24.5 35.5 C18 35 14 39 13 44 C20 45 26 41 27 36.5 Z" fill="${d}"/>` +
      `<path d="M45.5 33 L53 36 L45.5 39.2 Q46.8 36.1 45.5 33 Z" fill="${ART.honey}"/>` +
      `<circle cx="38" cy="31" r="2.9" fill="${ART.ink}"/><circle cx="38.9" cy="30.1" r="1.05" fill="#fff"/>` +
      `<circle cx="41" cy="37" r="2.2" fill="${ART.pink}" opacity=".5"/>`;
  },
};
function critterSVG(opts = {}) {
  const seed = Number.isFinite(opts.seed) ? opts.seed : 1;
  const size = opts.size || 64;
  const rnd = artRNG(seed * 7 + 3);
  const kind = artPick(rnd, ['ladybug', 'bee', 'snail', 'worm', 'bird']);
  return artWrap(size, CRITTER_ART[kind](rnd), 64, 'critter-svg critter-' + kind);
}

/* ---------------- full garden scene (celebrations) ---------------- */
function gardenSceneSVG(opts = {}) {
  const seeds = Array.isArray(opts.seeds) && opts.seeds.length ? opts.seeds : [1, 2, 3, 4, 5];
  const w = opts.width || 640;
  const h = opts.height || 320;
  const seedSum = seeds.reduce((a, s) => a + (Number.isFinite(s) ? s : 0), 7);
  const gid = 'lgSky' + (((seedSum * 31 + w * 7 + h) >>> 0) % 100000);
  const rnd = artRNG(seedSum * 13 + 5);

  let art = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${ART.waterTint}"/><stop offset="1" stop-color="${ART.milk}"/></linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#${gid})"/>`;

  // sun with soft rays, top-right
  const sx = w - 74, sy = 62;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + 0.2;
    art += `<path d="M${artN(sx + Math.cos(a) * 27)} ${artN(sy + Math.sin(a) * 27)} L${artN(sx + Math.cos(a) * 36)} ${artN(sy + Math.sin(a) * 36)}" stroke="${ART.sun}" stroke-width="5" stroke-linecap="round"/>`;
  }
  art += `<circle cx="${sx}" cy="${sy}" r="21" fill="${ART.sun}"/><circle cx="${sx}" cy="${sy}" r="16" fill="${ART.sunBright}"/>`;

  // rolling hills — hazy back ridge, warm front bed
  art += `<path d="M0 ${artN(h * 0.68)} Q ${artN(w * 0.25)} ${artN(h * 0.52)} ${artN(w * 0.5)} ${artN(h * 0.64)} T ${w} ${artN(h * 0.58)} L ${w} ${h} L 0 ${h} Z" fill="${ART.green}" opacity=".45"/>`;
  art += `<path d="M0 ${artN(h * 0.8)} Q ${artN(w * 0.28)} ${artN(h * 0.66)} ${artN(w * 0.55)} ${artN(h * 0.76)} Q ${artN(w * 0.82)} ${artN(h * 0.85)} ${w} ${artN(h * 0.72)} L ${w} ${h} L 0 ${h} Z" fill="${ART.greenSoft}"/>`;

  // tiny meadow dots on the back ridge
  const dots = Math.max(4, Math.floor(w / 90));
  for (let i = 0; i < dots; i++) {
    const dx = artN(20 + rnd() * (w - 40));
    const dy = artN(h * (0.66 + rnd() * 0.1));
    art += `<circle cx="${dx}" cy="${dy}" r="${artN(1.6 + rnd() * 1.2)}" fill="${artPick(rnd, [ART.milk, ART.sunBright, ART.pink])}" opacity=".8"/>`;
  }

  // the seeded flower row, planted in the front bed
  const m = Math.max(34, w * 0.06);
  const span = w - 2 * m;
  for (let i = 0; i < seeds.length; i++) {
    const fx = artN(m + (i + 0.5) * span / seeds.length + (rnd() - 0.5) * 14);
    const fy = artN(h * (0.86 + rnd() * 0.06));
    const k = artN((h * (0.4 + rnd() * 0.12)) / 64);
    art += `<g transform="translate(${artN(fx - 32 * k)} ${artN(fy - 58 * k)}) scale(${k})">${flowerArt(seeds[i], opts.palette)}</g>`;
  }

  // grass blades along the very front
  const blades = Math.max(5, Math.floor(w / 70));
  for (let i = 0; i < blades; i++) {
    const bx = artN(10 + rnd() * (w - 20));
    const by = artN(h * (0.9 + rnd() * 0.07));
    const lean = artN((rnd() - 0.5) * 6);
    art += `<path d="M${bx} ${by} Q ${artN(bx + lean)} ${artN(by - 9)} ${artN(bx + lean * 1.6)} ${artN(by - 13)}" stroke="${ART.green}" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/>`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true" class="garden-scene-svg">${art}</svg>`;
}

/* ---------------- exports (browser globals + node for tests) ---------------- */
const GardenArt = {
  foxSVG, avatarSVG,
  starSVG, flameSVG, dropSVG, sunSVG, giftSVG, trophySVG, heartSVG,
  eggSVG, caterpillarSVG, chrysalisSVG, butterflySVG,
  flowerSVG, critterSVG, gardenSceneSVG, storyArtSVG,
  GARDEN_PALETTE,
};


// ---------------- story covers — every passage gets real art ----------------
// A seeded storybook scene: sky by mood, hills, sun/moon, seeded flowers,
// and a motif matched from the title (butterfly, critters, drops, eggs…).
// Unknown titles get a warm drop-cap monogram — never a blank slot.
function storyArtSVG(p, size = 300) {
  const title = String(p.title || 'Story');
  const seed = [...title].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const R = mulberry32(seed);
  const night = /night|moon|star|light(s)? went out/i.test(title);
  const skyTop = night ? '#3D4A6B' : (p.kind === 'facts' ? '#CDE8F5' : '#BFE0EF');
  const skyBot = night ? '#5E6C8F' : '#E8F3EA';
  const hill1 = night ? '#5E7D5A' : '#A9CB8F';
  const hill2 = night ? '#4C6A49' : '#8FBB78';
  const gid = 'sc' + (seed % 100000);
  const motifs = [
    [/butterfl/i, () => butterflySVG(110)],
    [/ladybug|bug/i, () => critterSVG({ seed, size: 104 })],
    [/bird|humming/i, () => critterSVG({ seed: seed + 4, size: 104 })],
    [/worm/i, () => critterSVG({ seed: seed + 3, size: 104 })],
    [/snail/i, () => critterSVG({ seed: seed + 2, size: 104 })],
    [/turtle/i, () => (typeof avatarSVG === 'function' ? avatarSVG('turtle', 104) : null)],
    [/dog|puppy/i, () => (typeof avatarSVG === 'function' ? avatarSVG('fox', 104) : null)],
    [/rain|water|puddle/i, () => dropSVG(96)],
    [/egg/i, () => eggSVG(100)],
    [/seed|plant|flower|garden|root|stem|leaf|sunflower|swap/i, () => flowerSVG({ seed, size: 116 })],
    [/sun\b|light/i, () => sunSVG(100)],
    [/drum|music|quiet/i, () => trophySVG(0) && null], // no fit — falls to monogram
  ];
  let motif = null;
  for (const [re, fn] of motifs) { if (re.test(title)) { motif = fn(); if (motif) break; } }
  const monogram = !motif ? `
    <circle cx="150" cy="128" r="52" fill="#fff" stroke="#EDE4D6" stroke-width="3"/>
    <text x="150" y="150" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="64"
      fill="${night ? '#5E6C8F' : '#D05C38'}">${title[0].toUpperCase()}</text>` : '';
  const flowers = [0, 1, 2].map(i =>
    `<g transform="translate(${34 + i * 104 + Math.floor(R() * 20)}, 236)">${flowerSVG({ seed: seed + i * 97, size: 42 })}</g>`).join('');
  const stars = night ? [0, 1, 2, 3, 4].map(() =>
    `<circle cx="${20 + Math.floor(R() * 260)}" cy="${16 + Math.floor(R() * 70)}" r="${1.5 + R() * 1.5}" fill="#F2E8C9"/>`).join('') : '';
  return `<svg class="story-art-svg" viewBox="0 0 300 300" width="${size}" height="${size}" fill="none" aria-hidden="true" role="img">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient></defs>
    <rect width="300" height="300" rx="18" fill="url(#${gid})"/>
    ${stars}
    ${night ? `<circle cx="248" cy="52" r="26" fill="#F2E8C9"/><circle cx="238" cy="46" r="22" fill="${skyTop}"/>` : `<circle cx="250" cy="52" r="28" fill="#F2B035" opacity=".9"/>`}
    <path d="M0 218 Q75 186 150 212 T300 208 V300 H0 Z" fill="${hill1}"/>
    <path d="M0 252 Q90 226 180 248 T300 244 V300 H0 Z" fill="${hill2}"/>
    ${flowers}
    ${motif ? `<g transform="translate(98, 76)">${motif}</g>` : monogram}
  </svg>`;
}

if (typeof module !== 'undefined' && module.exports) module.exports = GardenArt;
