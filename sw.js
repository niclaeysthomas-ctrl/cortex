// CORTEX — service worker : network-first, repli cache (100 % hors-ligne)
// Network-first : en ligne tu as toujours la dernière version, hors-ligne le cache prend le relais.
const CACHE = "cortex-v2";
const ASSETS = ["./", "./index.html", "./data.js", "./transfert.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      // On ne garde QUE les bonnes réponses : pendant une mise en ligne, GitHub Pages
      // répond 404 quelques secondes, et cette page d'erreur s'installait dans le cache.
      if (res.ok) caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(h => h || caches.match("./index.html")))
  );
});
