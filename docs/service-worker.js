// docs/service-worker.js

const CACHE_NAME = "cherrycoder-cache-v3"; // 새버전 배포시 변경
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

// install 이벤트 – 캐시 저장
// Service Worker가 최초 등록되거나, 변경사항이 있어 새로 설치될 때 실행
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    // CACHE_NAME으로 캐시를 열고, 지정된 파일들을 전부 저장
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Caching app shell");
        // addAll()은 한 번에 여러 파일을 캐싱함. 하나라도 실패하면 전체가 실패
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((error) => {
        console.error("[ServiceWorker] Failed to cache:", error);
      })
  );
  // 기본적으로 설치 후 대기 상태(waiting)에 머무르는데, 이걸 생략하고 바로 활성 상태로 전환
  self.skipWaiting();
});

// activate 이벤트 – 이전 캐시 정리
// 기존에 등록돼 있던 오래된 캐시를 전부 정리하고, 새 캐시만 유지
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    // caches.keys()로 등록된 모든 캐시 이름을 가져와서, 현재 캐시와 이름이 다르면 삭제
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
  // 새 Service Worker가 바로 기존 클라이언트 탭들에 적용되도록 함
  self.clients.claim();
});

// 캐시된 파일 먼저, 없으면 네트워크
// 사용자가 페이지에서 네트워크 요청을 할 때마다 Service Worker가 그걸 가로챔
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // 캐시 우선 전략(Cache First)
    // 먼저 캐시에 해당 리소스가 있으면 그걸 반환
    // 없으면 네트워크로부터 받아옴
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
