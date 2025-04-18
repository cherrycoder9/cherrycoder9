// docs/service-worker.js

// 캐시 이름 (버전 업데이트 시 변경 필요)
const CACHE_NAME = "cherrycoder-cache-v10";
// 캐싱할 정적 파일 목록
const FILES_TO_CACHE = [
  "/", // 루트 경로 (보통 index.html과 동일)
  "/index.html", // 메인 HTML 파일
  "/posts.html",
  "/works.html",
  "/donate.html",
  "/contact.html",

  // 태그 조각
  "/_includes/nav.html",
  "/_includes/social-links.html",
  "/_includes/controls.html",

  // nav-img
  "/assets/nav-img/contact.svg",
  "/assets/nav-img/donate.svg",
  "/assets/nav-img/home.svg",
  "/assets/nav-img/posts.svg",
  "/assets/nav-img/works.svg",

  // sns-img
  "/assets/sns-img/bluesky.svg",
  "/assets/sns-img/github.svg",
  "/assets/sns-img/linkedin.svg",
  "/assets/sns-img/stack-overflow.svg",
  "/assets/sns-img/x-twitter.svg",
  "/assets/sns-img/youtube.svg",

  // controls-img
  "/assets/controls-img/arrow-up.svg",
  "/assets/controls-img/arrow-down.svg",
  "/assets/controls-img/settings.svg",

  // JS 코드 
  "/js/index.mjs",
  "/js/load-nav.mjs",
  "/js/load-social-links.mjs",
  "/js/load-controls.mjs",

  // CSS 파일 
  "/css/reset.css",
  "/css/fonts.css",
  "/css/index.css",
  "/css/main.css",
  "/css/nav.css",
  "/css/aside.css",

  // etc.
  "/site.webmanifest", // 웹 앱 매니페스트
  "/favicon.ico", // 파비콘
  "/android-chrome-192x192.png", // 안드로이드 홈 화면 아이콘 (192x192)
  "/android-chrome-512x512.png", // 안드로이드 홈 화면 아이콘 (512x512)
];

/**
 * 서비스 워커 설치 이벤트 핸들러
 * - 지정된 파일들을 캐시에 저장
 * ! self 키워드는 서비스 워커나 웹 워커 환경에서 
 * ! 전역 스코프(global scope), 즉 워커 자체를 가리키는 특별한 키워드
 * 서비스 워커는 웹 페이지와 분리된 별도의 스레드에서 실행되고, 
 * DOM(Document Object Model)에 직접 접근할 수 없음
 * 그래서 window 객체가 존재하지 않는 대신 워커 환경에서는 self가 그 역할을 함.
 * install, 웹사이트에 서비스 워커가 처음으로 등록될 때 발생
 * 브라우저가 해당 사이트의 서비스 워커 코드를 처음 발견하고 설치를 시작
 */
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] 설치 중...");
  // waitUntil: 이 작업이 끝날 때까지 설치 단계를 완료하지 않음
  event.waitUntil(
    // async 함수를 사용하여 비동기 작업을 처리
    (async () => {
      try {
        // 지정된 이름으로 캐시 저장소를 엽니다.
        const cache = await caches.open(CACHE_NAME);
        console.log("[ServiceWorker] 앱 셸 캐싱 중...");
        // 필수 파일들을 캐시에 추가합니다. 하나라도 실패하면 전체 실패.
        await cache.addAll(FILES_TO_CACHE);
        console.log("[ServiceWorker] 앱 셸 캐싱 완료.");
      } catch (error) {
        console.error("[ServiceWorker] 캐싱 실패:", error);
      }
    })()
  );
  // 새 서비스 워커가 설치되면 즉시 활성화되도록 강제합니다. (대기 상태 건너뛰기)
  self.skipWaiting();
});

/**
 * 서비스 워커 활성화 이벤트 핸들러
 * - 이전 버전의 캐시를 정리
 */
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] 활성화 중...");
  // waitUntil: 이 작업이 끝날 때까지 활성화 단계를 완료하지 않음
  event.waitUntil(
    (async () => {
      // 현재 캐시 저장소의 모든 키(이름)를 가져옵니다.
      const cacheNames = await caches.keys();
      // 모든 캐시 삭제 작업을 병렬로 처리합니다.
      await Promise.all(
        // 각 캐시 이름에 대해 반복
        cacheNames.map(async (cacheName) => {
          // 현재 사용 중인 캐시가 아니면 삭제합니다.
          if (cacheName !== CACHE_NAME) {
            console.log(`[ServiceWorker] 오래된 캐시 삭제: ${cacheName}`);
            await caches.delete(cacheName);
          }
        })
      );
      console.log("[ServiceWorker] 오래된 캐시 정리 완료.");
    })()
  );
  // 서비스 워커가 활성화되면 즉시 클라이언트(열린 탭 등)를 제어하도록 합니다.
  self.clients.claim();
});

/**
 * 네트워크 요청 가로채기(fetch) 이벤트 핸들러
 * - 캐시 우선 전략(Cache First)을 사용
 */
self.addEventListener("fetch", (event) => {
  // respondWith: 브라우저의 기본 fetch 핸들링을 막고, 직접 응답을 제공
  event.respondWith(
    (async () => {
      try {
        // 요청에 해당하는 캐시된 응답을 찾습니다.
        const cachedResponse = await caches.match(event.request);
        // 캐시된 응답이 있으면 그것을 반환합니다.
        if (cachedResponse) {
          // console.log("[ServiceWorker] 캐시에서 응답 제공:", event.request.url);
          return cachedResponse;
        }

        // 캐시에 없으면 네트워크로 요청을 보냅니다.
        // console.log("[ServiceWorker] 네트워크에서 응답 가져옴:", event.request.url);
        const networkResponse = await fetch(event.request);

        // 참고: 네트워크 응답을 캐시에 저장하는 로직 추가 가능
        // Cache First 전략에서는 필수는 아니지만, 필요시 아래 주석 해제 및 수정
        /*
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const cache = await caches.open(CACHE_NAME);
          // 응답을 복제하여 캐시에 저장 (응답 스트림은 한 번만 사용 가능)
          await cache.put(event.request, networkResponse.clone());
        }
        */

        return networkResponse;
      } catch (error) {
        console.error("[ServiceWorker] Fetch 에러:", error);
        // 오프라인 상태 등 네트워크 오류 시 대체 응답 제공 가능
        // return new Response("오프라인 상태입니다.", { status: 503, statusText: "Service Unavailable" });
      }
    })()
  );
});