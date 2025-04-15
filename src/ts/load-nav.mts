// src/ts/load-nav.mts

// 공통 네비게이션 메뉴 HTML 파일 경로
const navFilePath: string = '/_includes/nav.html';

/**
 * 네비게이션 메뉴를 비동기적으로 로드하고 페이지에 삽입하는 함수
 * @returns {Promise<void>}
 */
async function loadNavigation(): Promise<void> {
  // 네비게이션 내용을 삽입할 대상 요소를 ID로 찾기
  // getElementById는 HTMLElement 또는 null을 반환할 수 있음
  const navContainer: HTMLElement | null = document.getElementById('main-nav');

  // 대상 요소가 페이지에 없으면 함수 종료 (타입 가드 역할도 함)
  if (!navContainer) {
    console.warn('네비게이션을 삽입할 요소를 찾을 수 없습니다 (#main-nav).');
    return;
  }

  try {
    // fetch API를 사용하여 지정된 경로의 nav.html 파일 내용을 가져오기
    const response: Response = await fetch(navFilePath);

    // HTTP 응답 상태가 'ok'(보통 200-299)인지 확인
    if (!response.ok) {
      // 응답 실패 시 에러 메시지 생성 및 throw
      throw new Error(`네트워크 응답 에러: ${response.status} ${response.statusText} (경로: ${navFilePath})`);
    }

    // 응답 본문을 텍스트(HTML) 형태로 파싱
    const htmlContent: string = await response.text();

    // 성공적으로 가져온 HTML 내용을 대상 요소의 내부 HTML로 설정
    // navContainer는 null이 아님이 위에서 확인되었으므로 안전하게 접근 가능
    navContainer.innerHTML = htmlContent;
    console.log('네비게이션 로드 및 삽입 성공.');

  } catch (error: unknown) { // catch 절의 에러 타입은 기본적으로 unknown
    // fetch 작업 중 또는 응답 처리 중 에러 발생 시 실행됨
    console.error('네비게이션 로딩 실패:', error);

    // 에러가 Error 인스턴스인지 확인하여 메시지 접근 (선택 사항)
    let errorMessage = '메뉴 로딩 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = `메뉴 로딩 실패: ${error.message}`;
    }

    // 사용자에게 에러 상황을 알리기 위해 대상 요소에 메시지 표시
    // navContainer는 null이 아님이 위에서 확인되었음
    // navContainer.innerHTML = `<p>${errorMessage} 경로를 확인해주세요.</p>`;
  }
}

// DOM 콘텐츠가 완전히 로드되고 파싱된 후 loadNavigation 함수 실행
// 'DOMContentLoaded' 이벤트 리스너의 콜백은 Event 타입을 받지만, 여기서는 사용하지 않음
document.addEventListener('DOMContentLoaded', loadNavigation as EventListener);
// 또는 더 명시적으로:
// document.addEventListener('DOMContentLoaded', () => {
//   loadNavigation().catch(err => console.error("loadNavigation 실행 중 에러:", err));
// });