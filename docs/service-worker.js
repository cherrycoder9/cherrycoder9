// docs/service-worker.js

const CACHE_NAME = "cherrycoder-cache-v2"; // 새버전 배포시 변경
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/js/index.mjs",
  "/css/reset.css",
  "/site.webmanifest",
  "/favicon.ico",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png"
];

// 새 캐시 생성
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // 🔥 바로 activate 되도록 강제
});

// 이전 캐시 정리
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[ServiceWorker] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim(); // 🔥 탭에 바로 적용
});

// 캐시된 파일 먼저, 없으면 네트워크
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
