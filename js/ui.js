/* ============================================================
   LEARNING GARDEN — ui.js · design-system kit
   Lucide line icons, plant-stage SVGs, sunflower logo, subject
   colors, XP/levels, and the sound/motion glue.
   (Visual layer only — no learning logic lives here.)
   ============================================================ */

// app build stamp — bump together with sw.js CACHE_V on every deploy
const APP_BUILD = { cache: 'lg-v13', label: 'update 13 · July 23, 2026' };

// ---------------- Lucide icons (24×24, stroke currentColor) ----------------
const ICON_PATHS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-3.7.3-4.4 1.5-4.9 2z"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  gradcap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  pin: '<line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  arrowright: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  rainbow: '<path d="M22 17a10 10 0 0 0-20 0"/><path d="M6 17a6 6 0 0 1 12 0"/><path d="M10 17a2 2 0 0 1 4 0"/>',
  stetho: '<path d="M11 2v2M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  equal: '<line x1="5" x2="19" y1="9" y2="9"/><line x1="5" x2="19" y1="15" y2="15"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  puzzle: '<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  swap: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sunrise: '<path d="M12 2v4"/><path d="m5.2 7.2 2.9 2.9"/><path d="M2 15h4"/><path d="M18 15h4"/><path d="m15.9 10.1 2.9-2.9"/><path d="M22 19H2"/><path d="M8 15a4 4 0 0 1 8 0"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
};
function icon(name, size = 18, cls = '') {
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.star}</svg>`;
}

// ---------------- app bar — ONE full-width top bar, every screen ----------------
// Faith's rule (2026-07-23): the strip aligns across the whole page, flush to
// the top, identical frame everywhere. Screens feed content into it; nothing
// renders its own floating header band.
function appbarBrand() {
  return `<div class="brand"><div class="logo">${logoSVG(30)}</div><h1>Learning Garden<small>grow a little every day</small></h1></div>`;
}
function appbarKidChip() {
  const k = typeof kid === 'function' ? kid() : null;
  return k ? `<button class="kid-chip" id="kidChip"><span class="face">${avatarFace(k.avatar, 26)}</span> ${esc(k.name)}</button>` : '';
}
function setAppbar(html) {
  const el = document.getElementById('appbarInner');
  if (!el) return;
  el.innerHTML = html;
  const kc = document.getElementById('kidChip');
  if (kc) kc.onclick = () => show(kid() ? 'profile' : 'kids'); // name chip opens the profile (7c)
}

// ---------------- crafted avatars (art.js) — emoji stays the stored key ----------------
const EMOJI_KIND = { '🦊': 'fox', '🐼': 'panda', '🦄': 'unicorn', '🐸': 'frog', '🦁': 'lion', '🐙': 'octopus', '🦋': 'butterfly', '🐢': 'turtle', '🐰': 'bunny', '🐯': 'tiger', '🦖': 'dino', '🐬': 'dolphin' };
function avatarFace(emoji, size = 32) {
  return typeof avatarSVG === 'function' ? avatarSVG(EMOJI_KIND[emoji] || 'fox', size) : `<span style="font-size:${Math.round(size * .8)}px">${emoji}</span>`;
}

// ---------------- Tutor Owl mascot (replaces the 🦉 emoji) ----------------
// Flat, warm, design-token palette; the grad cap says "tutor".
function owlSVG(size = 64, cls = '') {
  return `<svg class="owl-svg ${cls}" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M16 16 L20 7.5 L24.5 15" fill="#A06B1B"/>
    <path d="M48 16 L44 7.5 L39.5 15" fill="#A06B1B"/>
    <ellipse cx="32" cy="38" rx="20" ry="22" fill="#C98A2B"/>
    <path d="M13.5 32 Q10.5 50 20.5 57 Q14.5 47 16.8 33 Z" fill="#A06B1B"/>
    <path d="M50.5 32 Q53.5 50 43.5 57 Q49.5 47 47.2 33 Z" fill="#A06B1B"/>
    <ellipse cx="32" cy="46.5" rx="12.5" ry="10.5" fill="#FBF0DE"/>
    <path d="M25 43.5 q3.5 3 7 0 M32 43.5 q3.5 3 7 0 M28.5 49 q3.5 3 7 0" stroke="#EBD9B8" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="24" cy="30" r="10" fill="#FBF6EF"/>
    <circle cx="40" cy="30" r="10" fill="#FBF6EF"/>
    <circle cx="24.5" cy="30.5" r="4.5" fill="#2A2320"/>
    <circle cx="39.5" cy="30.5" r="4.5" fill="#2A2320"/>
    <circle cx="26" cy="29" r="1.5" fill="#fff"/>
    <circle cx="41" cy="29" r="1.5" fill="#fff"/>
    <path d="M32 38.5 L28.4 33.8 Q32 31.8 35.6 33.8 Z" fill="#D05C38"/>
    <ellipse cx="26.5" cy="59.2" rx="3.2" ry="1.8" fill="#A06B1B"/>
    <ellipse cx="37.5" cy="59.2" rx="3.2" ry="1.8" fill="#A06B1B"/>
    <path d="M24.5 13.2 q7.5 3.8 15 0 l0 5.2 q-7.5 3.8 -15 0 Z" fill="#443A33"/>
    <path d="M32 3.5 L50.5 10.3 L32 17.2 L13.5 10.3 Z" fill="#2A2320"/>
    <path d="M50.5 10.5 v7.5" stroke="#C98A2B" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50.5" cy="20" r="2.2" fill="#C98A2B"/>
  </svg>`;
}

// ---------------- subject visual identity ----------------
const SUBJECT_UI = {
  math:    { icon: 'calculator', color: '#D05C38', dark: '#B8491A', tint: '#FBE7DD' },
  ela:     { icon: 'book',       color: '#1F8A80', dark: '#166B63', tint: '#E1F0EE' },
  science: { icon: 'flask',      color: '#4E9B6B', dark: '#3B7A52', tint: '#EAF3EA' },
  spanish: { icon: 'globe',      color: '#C98A2B', dark: '#A06B1B', tint: '#FBF0DE' },
  social:  { icon: 'landmark',   color: '#8E6BB0', dark: '#71518F', tint: '#EFE8F5' },
  typing:  { icon: 'laptop',     color: '#4A7FB5', dark: '#38648F', tint: '#E4EDF6' },
  custom:  { icon: 'pin',        color: '#B8491A', dark: '#9A3B12', tint: '#FBE7DD' },
};
const subjUI = (id) => SUBJECT_UI[id] || SUBJECT_UI.custom;
function subjectOfSkill(sid) {
  const sk = SKILL_MAP[sid];
  const strand = sk && STRANDS.find(s => s.id === sk.strand);
  return strand ? strand.subject : 'custom';
}
function subjTile(subjectId, size = 38, iconSize = 19) {
  const u = subjUI(subjectId);
  return `<span class="subj-ico" style="width:${size}px;height:${size}px;background:${u.tint};color:${u.color}">${icon(u.icon, iconSize)}</span>`;
}

// ---------------- plant-stage SVGs (custom, per design) ----------------
// variant only affects flowering stages, so the garden scene gets a mix of
// pink daisies, orange daisies, and yellow tulips like the mockup.
function plantSVG(score, size = 26, variant = 0) {
  const stage = score >= 100 ? 4 : score >= 75 ? 3 : score >= 50 ? 2 : score >= 25 ? 1 : 0;
  const stem = '<path d="M16 28 L16 17" stroke="#4E9B6B" stroke-width="2.4" stroke-linecap="round"/>';
  const leaf1 = '<path d="M16 22 C12 21 10.5 18.5 10 16 C13.5 16.5 15.5 18.5 16 22 Z" fill="#4E9B6B"/>';
  const leaf2 = '<path d="M16 19.5 C20 18.5 21.5 16 22 13.5 C18.5 14 16.5 16 16 19.5 Z" fill="#6FB086"/>';
  const daisy = (petal, center) => {
    let p = '';
    for (let i = 0; i < 6; i++) {
      p += `<ellipse cx="16" cy="9.4" rx="3.1" ry="5.2" fill="${petal}" transform="rotate(${i * 60} 16 12)"/>`;
    }
    return p + `<circle cx="16" cy="12" r="3.6" fill="${center}"/>`;
  };
  const tulip = (petal) =>
    `<path d="M10.5 7 C10.5 5 12 4 13 6 L16 10 L19 6 C20 4 21.5 5 21.5 7 L21.5 11 C21.5 14.5 19 16.5 16 16.5 C13 16.5 10.5 14.5 10.5 11 Z" fill="${petal}"/>
     <path d="M14.5 6.5 L16 10 L17.5 6.5 C17 4.5 15 4.5 14.5 6.5 Z" fill="${petal}" opacity=".75"/>`;
  const bloomFor = (mastered) => {
    const v = ((variant % 3) + 3) % 3;
    if (mastered) return v === 2 ? tulip('#F2B035') : daisy(v === 1 ? '#E8833A' : '#F2B035', '#8C5A2B');
    return v === 2 ? tulip('#FFD84D') : daisy(v === 1 ? '#F0975C' : '#F58BA4', '#FFD84D');
  };
  const art = [
    // 0 seed (little mound)
    '<ellipse cx="16" cy="25.5" rx="5.5" ry="3.4" fill="#C9A876"/><circle cx="16" cy="23.6" r="2.6" fill="#A97B4F"/>',
    // 1 sprout
    stem + leaf1,
    // 2 growing
    stem + leaf1 + leaf2,
    // 3 blooming
    stem + leaf1 + leaf2 + bloomFor(false),
    // 4 mastered
    stem + leaf1 + leaf2 + bloomFor(true),
  ][stage];
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">${art}</svg>`;
}

// The mark: an open book with a flower growing out of its pages —
// learning that grows. Unique to us; every petal is ours.
function logoSVG(size = 40) {
  let petals = '';
  for (let i = 0; i < 7; i++) {
    petals += `<ellipse cx="32" cy="14.2" rx="5.6" ry="9.4" fill="${i % 2 ? '#F2B035' : '#E8A63C'}" transform="rotate(${i * (360 / 7)} 32 22)"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    ${petals}
    <circle cx="32" cy="22" r="7.6" fill="#8C5A2B"/>
    <circle cx="29.6" cy="19.8" r="2" fill="#A97B4F"/>
    <path d="M32 29.5 V44" stroke="#4E9B6B" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M32 38 Q25.5 36.5 23.5 31.5 Q30 31.5 32 38 Z" fill="#4E9B6B"/>
    <path d="M32 41 Q38.5 39.5 40.5 34.5 Q34 34.5 32 41 Z" fill="#7FB86F"/>
    <path d="M10 44 Q21 39.5 32 44 Q43 39.5 54 44 L54 56.5 Q43 52 32 56.5 Q21 52 10 56.5 Z" fill="#FBF0DE" stroke="#D05C38" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M32 44 V56.5" stroke="#D05C38" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M15 46.5 Q23 43.8 28 45.8 M15 50 Q23 47.3 28 49.3 M36 45.8 Q41 43.8 49 46.5 M36 49.3 Q41 47.3 49 50" stroke="#E8C9A8" stroke-width="1.7" stroke-linecap="round"/>
  </svg>`;
}

// ---------------- stars & levels ----------------
// Stars = every correct answer ever (already in the daily log).
function starsFor(kidId = DB.activeKid) {
  const log = DB.log[kidId] || {};
  return Object.values(log).reduce((s, d) => s + d.c, 0);
}
// Levels get gently longer: to reach level n+1 you need 25·n more stars.
function levelInfo(kidId = DB.activeKid) {
  const stars = starsFor(kidId);
  let level = 1, need = 25, base = 0;
  while (stars >= base + need && level < 99) { base += need; level++; need = 25 * level; }
  return { level, stars, into: stars - base, need };
}

// ---------------- sound glue ----------------
function soundsOn() {
  const s = DB.settings[DB.activeKid];
  return !s || s.sounds !== false; // on by default
}
function sfx(name) {
  try { if (soundsOn() && window.GardenSounds && GardenSounds[name]) GardenSounds[name](); } catch (e) { /* audio blocked */ }
}
// swap any emoji-speaker say-buttons (from content strings) to the Lucide icon
function upgradeSayButtons(root = document) {
  root.querySelectorAll('[data-say]').forEach(b => {
    if (b.querySelector('svg')) return;
    const label = b.textContent.replace(/🔊|🔤/g, '').trim();
    b.innerHTML = icon('volume', 14) + (label ? ' ' + label : '');
  });
}

// every button tap: press motion only — no sound on plain clicks.
// (Sounds are saved for moments that MEAN something: correct, water, grow, cheer.)
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  b.classList.remove('pressed-anim'); void b.offsetWidth; b.classList.add('pressed-anim');
}, true);
