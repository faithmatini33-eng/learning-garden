/* Learning Garden service worker — the app works fully offline after
   the first visit. Bump CACHE_V on every deploy so tablets pick up
   the new version on their next open. */
const CACHE_V = 'lg-v17';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'js/sounds.js',
  'js/generators.js',
  'js/ela.js',
  'js/science.js',
  'js/spanish.js',
  'js/social.js',
  'js/typing.js',
  'js/content2.js',
  'js/content3.js',
  'js/handwriting.js',
  'js/sprint.js',
  'js/coach.js',
  'js/reader.js',
  'js/custom.js',
  'js/paper.js',
  'js/curriculum.js',
  'js/learn.js',
  'js/lesson2.js',
  'js/puzzles.js',
  'js/games.js',
  'js/art.js',
  'js/ui.js',
  'js/app.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // navigations: try the network (fresh deploys), fall back to the cached shell
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE_V).then((c) => c.put('index.html', copy));
        return r;
      }).catch(() => caches.match('index.html'))
    );
    return;
  }
  // same-origin assets: cache-first (instant + offline)
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(CACHE_V).then((c) => c.put(e.request, copy));
      return r;
    })));
    return;
  }
  // cross-origin (Google Fonts): stale-while-revalidate so text renders offline
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE_V).then((c) => c.put(e.request, copy));
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
