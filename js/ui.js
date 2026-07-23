/* ============================================================
   LEARNING GARDEN — ui.js · design-system kit
   Lucide line icons, plant-stage SVGs, sunflower logo, subject
   colors, XP/levels, and the sound/motion glue.
   (Visual layer only — no learning logic lives here.)
   ============================================================ */

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
};
function icon(name, size = 18, cls = '') {
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.star}</svg>`;
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

function logoSVG(size = 40) {
  let petals = '';
  for (let i = 0; i < 6; i++) petals += `<ellipse cx="16" cy="8.6" rx="4.2" ry="6.8" fill="#F2B035" transform="rotate(${i * 60} 16 16)"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">${petals}<circle cx="16" cy="16" r="5.4" fill="#8C5A2B"/></svg>`;
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
