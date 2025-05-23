# 🛠️ 개발 가이드라인

본 문서는 프로젝트의 **일관성·코드 품질** 향상을 위한 참고 가이드라인입니다.

---

## 1. 코드 스타일 가이드라인

| 항목 | 기본 도구 | 비고 |
|------|----------|------|
| **JS/TS (Node/Bun)** | **Biome** (필수) | `biome.json`에 설정 |
| **JS/TS (Deno)**     | `deno fmt/lint` (내장) | 필요 시 biome 사용 가능 |
| **Python**           | `ruff` | 포매팅 및 린팅 |

- **들여쓰기**  
  - Python: 공백 4칸 (언어적 강제)
  - 그 외 언어: 공백 2칸
- **네이밍**  
  - 변수·함수: `camelCase` (JS/TS), `snake_case` (Py)  
  - 클래스·인터페이스: `PascalCase`  
  - 상수: `UPPER_SNAKE_CASE`  
  - 파일: `kebab-case.ts/tsx`, `snake_case.py` (React 컴포넌트는 `PascalCase.tsx` 허용)
- **기타**  
  - 최대 라인 길이 88자  
  - 함수 25줄 이내 유지 (함수 시작 '{'부터 끝 '}'까지의 줄 수 포함, 길어지면 리팩터링)

---

## 2. Git 워크플로 가이드라인

### 브랜치 전략 — GitHub Flow (권장)

| 브랜치 | 용도 |
|--------|------|
| `main` | 항상 배포 가능한 상태 유지 (직접 푸시 지양) |
| `feat/<이슈>-설명` | 새 기능 개발 |
| `fix/<이슈>-설명`  | 버그 수정 |
| `refactor/설명`    | 코드 구조 개선 |
| `docs/설명`        | 문서 작업 |

### 커밋 메시지 — **Gitmoji** 컨벤션 (권장)

```text
<emoji> <제목 50자 이내>

<본문 (선택)>

Closes <이슈번호>
```

Ex) `✨ feat: add JWT refresh flow`

### Pull Request (PR)

- PR 템플릿 사용을 권장하며, 1명 이상의 리뷰어 승인 및 CI 통과를 고려합니다.
- `.handbook/quality.md`에 정의된 커버리지·SLO 목표 만족을 고려합니다.

---

## 3. 테스트 가이드라인

- 코드 옆 또는 `tests/` 디렉터리.
- 테스트 프레임워크는 프로젝트 스택에 따라 [Vitest](https://vitest.dev/), [Bun Test](https://bun.sh/docs/test/writing), [Deno Test](https://deno.land/manual@v1.37/basics/testing) 등 성능 좋은 옵션 사용. 구체적인 선택은 `.handbook/stack.md` 준수.
- 목표 커버리지: `.handbook/quality.md`.

---

## 4. 문서화 가이드라인

- `README.md`: 개요·설치·실행.
- `.handbook/`: 설계·가이드·ADR 등.
- API: `OpenAPI` (`.handbook/api-contract.yaml`).

---

## 5. 기타 고려사항

- 의존성 변경 시 ↳ `pnpm-lock.yaml` / `bun.lockb` / `uv.lock` 커밋.  
- 보안·비밀키 처리는 `.handbook/secrets.md` 가이드라인을 참고합니다.
- 에러는 명시적으로 처리하고, 민감 정보 로깅은 지양합니다.
- **비동기 코딩**: I/O 작업 등 블로킹이 발생할 수 있는 작업 시 비동기 처리를 고려하여 애플리케이션 성능 및 응답성 향상을 도모합니다. 무분별한 비동기 사용은 코드 복잡성을 증가시킬 수 있으므로 필요에 따라 적절히 활용합니다 (참고: 네트워크 요청, 파일 시스템 접근 등 대기 시간이 긴 작업 시 `async/await`, Promise 등 비동기 패턴 사용).
- **멀티스레드 코딩**: CPU 집약적 작업(복잡한 계산, 데이터 처리 등)으로 메인 스레드가 블로킹될 경우 멀티스레딩을 고려할 수 있습니다 (참고: 스레드 생성 및 관리 비용, 스레드 간 동기화 문제 등을 고려).

- **유효성 검증**: 데이터 유효성 검증에는 **Zod** 라이브러리 사용을 권장합니다. 스키마 정의를 통해 데이터 구조를 명확히 하고 런타임 유효성 검사를 수행합니다.

- **함수 매개변수 개수 고려**
  - 성능 및 유지보수성을 위해 함수 매개변수를 **4개 이하**로 유지하는 것을 권장합니다.
  - 매개변수가 4개를 초과할 경우 관련 매개변수들을 구조체(struct)나 객체로 묶어 하나의 매개변수로 전달하는 것을 고려합니다.
  - Windows x64 ABI 레지스터 전달 한도(4개)를 고려하여 플랫폼 독립적인 성능 최적화를 고려할 수 있습니다 (리눅스/macOS 6개, ARM64 8개 가능하나 최소 공통분모 준수).
  - 자주 호출되는 함수나 반복문 내 함수 호출 시 이 가이드라인을 더 엄격하게 적용하는 것을 고려합니다 (캐시 효율 향상).

---

## 6. 자료형 및 메서드 선택 고려사항

코드 성능 및 효율성을 위한 데이터 접근 패턴(읽기/쓰기 비율) 및 실행 환경(싱글/멀티스레드)에 따른 적절한 자료형과 메서드 선택.

*   **읽기 중심 작업:** 메모리 지역성 좋은 배열/연속 메모리 구조, 불변(Immutable) 객체 활용 우선 고려 (캐시 효율 극대화 및 빠른 읽기 성능 확보).
*   **쓰기 중심 작업:** 삽입/삭제 빈번 또는 랜덤 쓰기 많은 경우, 링 버퍼, 로그 구조 배열, 연결 리스트 등 쓰기 비용 낮은 자료구조 고려.
*   **읽기/쓰기 모두 많은 경우:** 특정 시점에 쓰기용 자료형 내용을 읽기용 자료형으로 복사하여 실 사용자는 읽기용 자료형에 접근하도록 하는 전략 고려 (Copy-on-Write 패턴 등).
*   **싱글스레드 환경:** 락/원자 연산 오버헤드 없는 단순 자료구조 및 알고리즘 사용 (성능 최적화).
*   **멀티스레드 환경:** 스레드 간 경합 최소화를 위한 Concurrent 자료구조 (ConcurrentHashMap 등), 락 프리(lock-free) 기법, RCU(Read-Copy-Update) 등 동시성 제어 패턴 적극 활용.

**핵심:** 코드 읽기:쓰기 비율 및 스레드 환경 정확한 분석 및 적절한 자료형/메서드 선택 (효율적 코드 작성 시작).

---

## 7. LLM 협업 가이드라인

- **우선** `.handbook/` 문서 검색 후 코딩.  
- 정보 부족·모순 시 `Clarify needed:` 한 줄 질문.  
- 출력: **코드 우선, 설명 ≤3줄**.  
- 금지: `any`, `console.log`, 미승인 라이브러리.
