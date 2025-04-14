// src/ts/load-social-links.mts

// 소셜 링크 HTML 조각 파일 경로
const socialLinksFilePath: string = '/_includes/social-links.html';
// 소셜 링크를 삽입할 대상 요소의 ID
const placeholderId: string = 'social-links-placeholder';

/**
 * 소셜 링크 메뉴를 비동기적으로 로드하고 페이지에 삽입하는 함수
 * @returns {Promise<void>}
 */
async function loadSocialLinks(): Promise<void> {
  // 대상 요소를 ID로 찾기
  const placeholderElement: HTMLElement | null = document.getElementById(placeholderId);

  // 대상 요소가 없으면 경고 출력 후 종료
  if (!placeholderElement) {
    console.warn(`소셜 링크 삽입 대상(#${placeholderId})을 찾을 수 없습니다.`);
    return;
  }

  try {
    // HTML 조각 파일 fetch
    const response: Response = await fetch(socialLinksFilePath);

    // 응답 실패 시 에러 throw
    if (!response.ok) {
      throw new Error(`네트워크 응답 에러: ${response.status} ${response.statusText} (경로: ${socialLinksFilePath})`);
    }

    // HTML 텍스트 파싱
    const htmlContent: string = await response.text();

    // 대상 요소에 HTML 삽입
    placeholderElement.innerHTML = htmlContent;
    console.log('소셜 링크 로드 및 삽입 성공.');

  } catch (error: unknown) {
    // 개발자를 위한 상세 에러 로그
    console.error('소셜 링크 로딩 실패:', error);

    // 사용자에게는 실패 사실을 알리지 않거나, 최소한으로 표시
    // 예: placeholder를 그냥 비워둠 (메뉴 로딩 실패와 달리, 소셜 링크는 없어도 치명적이지 않음)
    placeholderElement.innerHTML = ''; // 내용을 비워서 실패 시 아무것도 표시 안 함
  }
}

// DOM 로드 완료 후 함수 실행
document.addEventListener('DOMContentLoaded', loadSocialLinks as EventListener);