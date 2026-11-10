// 離線快取：先給快取，背景更新
const CACHE = "viet-v1";
const FILES = ["./", "index.html", "style.css?v=1", "viet.js?v=1", "data.json?v=1", "manifest.json", "icon.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((r) => { if (r.ok) caches.open(CACHE).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
