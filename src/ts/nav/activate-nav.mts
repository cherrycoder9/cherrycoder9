// src/ts/nav/activate-nav.mts

/**
 * 주어진 href 문자열을 절대경로 pathname으로 변환
 * 이미 절대 경로이면 그대로 반환
 * 상대경로면 현재 페이지 origin 기준으로 절대 경로를 만든다
 *
 * @param {string} href 
 * @returns {string} 
 */
function getAbsolutePath(href: string): string {
  // 이미 절대 경로인 경우
  if (href.startsWith('/')) {
    return href;
  }

  // 상대 경로인 경우 new URL로 절대 경로 생성 
  try {
    // window.location.origin을 base로 사용해 URL 객체 생성
    const absoluteURL = new URL(href, window.location.origin);
    return absoluteURL.pathname;
  } catch (e) {
    console.warn(`Could not create absolute URL for href: "${href}. Using original href.`, e);
    return href; // 실패시 원래 값 반환 
  }
}

/**
 * 경로 문자열을 정규화 (마지막 '/'제거, '.html' 확장자 제거)
 *
 * @param {string} path - 정규화할 경로 문자열 
 * @returns {string} - 정규화된 경로 문자열 
 */
function normalizePath(path: string): string {
  // 마지막 '/' 제거 (루트 제외)
  let p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  p = p.endsWith('.html') ? p.slice(0, -5) : p; // .html 제거
  return p;
}

/** 현재 페이지 경로와 일치하는 리스트에 active 클래스 추가 */
function activateCurrentNav() {
  const navContainer = document.getElementById('main-nav');
  if (!navContainer) {
    console.warn('Navigation container #main-nav not found.');
    return; // 네비 컨테이너 없으면 실행 중지 
  }

  const navLinks = navContainer.querySelectorAll<HTMLAnchorElement>('ul>li>a');
  if (navLinks.length === 0) {
    console.warn('Navigation links not found inside #main-nav. Ensure nav is loaded before activating.');
    return; // 네비 링크 없으면 실행 중지 
  }

  const currentPathname = window.location.pathname;
  const currentNormalized = normalizePath(currentPathname); // 현재 경로 미리 정규화

  let bestMatch: { link: HTMLAnchorElement; length: number; } | null = null;

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return; // href 속성 없으면 건너뛰기

    // 1. href를 절대 경로로 변환 
    const linkPath = getAbsolutePath(linkHref);
    // 2. 변환된 경로 정규화 
    const linkNormalized = normalizePath(linkPath);

    // 매칭 로직, 현재 정규화된 경로가 링크의 정규화된 경로로 시작하는지 확인
    if (currentNormalized.startsWith(linkNormalized)) {
      // 가장 경로가 긴(구체적인) 링크를 찾기 위함
      if (!bestMatch || linkNormalized.length > bestMatch.length) {
        bestMatch = { link: link, length: linkNormalized.length };
      }
    }
  });

  // 가장 긴 경로 링크의 부모 li에 active 클래스 추가
  if (bestMatch !== null) {
    const finalMatch: { link: HTMLAnchorElement; length: number; } = bestMatch;
    const listItem = finalMatch.link.closest('li');

    if (listItem) {
      listItem.classList.add('active');
      console.log(`Active class added to: ${finalMatch.link.getAttribute('href')}`);
    } else {
      console.warn('Could not find parent <li> for the active link:', finalMatch.link);
    }
  } else {
    // 매칭되는 링크가 없을때 (루트 경로 '/' 처리)
    console.log('No specific navigation linnk matched. Checking for root path...');
    // 현재 경로가 정확히 루트일 경우 홈 링크 활성화 
    if (currentPathname === '/') {
      const homeLink = navContainer.querySelector<HTMLAnchorElement>('ul>li>a[href="/"]');
      if (homeLink) {
        const homeLi = homeLink.closest('li');
        if (homeLi) {
          homeLi.classList.add('active');
          console.log('Active class added to: / (Home)');
        }
      }
    } else {
      console.log('No matching navigation link found for the current path:', currentPathname);
    }
  }
}

// DOM이 로드된 후 네비게이션 활성화 함수 실행
document.addEventListener('DOMContentLoaded', activateCurrentNav);