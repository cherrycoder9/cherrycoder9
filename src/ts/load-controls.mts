// src/ts/load-controls.mts

// 페이지 컨트롤(맨위로, 테마 토글 등) HTML 조각 파일 경로
console.log('load-controls.mts');
const controlsFilePath: string = '/_includes/controls.html'; // <--- 네 파일 경로로 수정 필수!

/**
 * 페이지 컨트롤 UI를 비동기적으로 로드하고 페이지에 삽입하는 함수
 * @returns {Promise<void>}
 */
async function loadPageControls(): Promise<void> {
  // 컨트롤 UI를 삽입할 대상 요소를 ID로 찾기
  // 이 ID를 가진 요소가 네 HTML 어딘가에 있어야 함. 예를 들어 body 맨 끝 같은 곳.
  const controlsContainer: HTMLElement | null = document.getElementById('page-controls-container'); // <--- 이 ID도 네 HTML 구조에 맞게!

  // 대상 요소가 없으면 경고 뿌리고 함수 종료.
  if (!controlsContainer) {
    console.warn(`페이지 컨트롤을 삽입할 요소를 찾을 수 없습니다 (#page-controls-container). HTML에 해당 ID가 있는지 확인해봐.`);
    return;
  }

  try {
    // fetch API로 컨트롤 HTML 파일 내용 가져오기
    const response: Response = await fetch(controlsFilePath);

    // 응답 실패하면 에러 던지기. 
    if (!response.ok) {
      throw new Error(`네트워크 응답 에러: ${response.status} ${response.statusText} (경로: ${controlsFilePath})`);
    }

    // 응답 본문을 텍스트(HTML)로 파싱
    const htmlContent: string = await response.text();

    // 가져온 HTML 내용을 대상 요소에 때려 박기
    controlsContainer.innerHTML = htmlContent;
    console.log('페이지 컨트롤 UI 로드 및 삽입 성공.');

    // 여기서 추가적으로 컨트롤 버튼들에 이벤트 리스너를 붙이는 코드를 넣을 수도 있음.
    // 예를 들어, 테마 토글 버튼 찾아서 클릭 이벤트 연결하는 식.

  } catch (error: unknown) {
    // 에러 나면 콘솔에 찍어주기.
    console.error('페이지 컨트롤 로딩 실패:', error);

    // 사용자한테 에러 상황 알려주는 건 선택사항. 
    let errorMessage = '페이지 컨트롤 로딩 중 오류 발생.';
    if (error instanceof Error) {
      errorMessage = `컨트롤 로딩 실패: ${error.message}. 파일 경로(${controlsFilePath})나 네트워크 상태 확인.`;
    }
    // 필요하면 에러 메시지를 컨테이너에 표시
    // controlsContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
  }
}

// DOM 다 준비되면 loadPageControls 함수 실행.
document.addEventListener('DOMContentLoaded', loadPageControls as EventListener);
// 아래처럼 써도 똑같음. 에러 처리 명시적으로 하고 싶으면
// document.addEventListener('DOMContentLoaded', () => {
//   loadPageControls().catch(err => console.error("loadPageControls 실행 중 에러:", err));
// });