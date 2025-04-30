# 🛠️ Dev Guidelines

본 문서는 프로젝트의 **일관성·코드 품질** 유지를 위한 규칙을 정의합니다.

---

## 1. 코드 스타일

| 항목 | 기본 도구 | 비고 |
|------|----------|------|
| **JS/TS (Node/Bun)** | **Biome** (필수) | `biome.json`에 설정 |
| **JS/TS (Deno)**     | `deno fmt/lint` (내장) | 필요 시 biome 사용 가능 |
| **Python**           | `ruff` | 포매팅 및 린팅 |

- **들여쓰기**  
  - JS/TS: 공백 2칸  
  - Python: 공백 4칸  
- **네이밍**  
  - 변수·함수: `camelCase` (JS/TS), `snake_case` (Py)  
  - 클래스·인터페이스: `PascalCase`  
  - 상수: `UPPER_SNAKE_CASE`  
  - 파일: `kebab-case.ts/tsx`, `snake_case.py` (React 컴포넌트는 `PascalCase.tsx` 허용)
- **기타**  
  - 최대 라인 길이 88자  
  - 함수는 25줄 이내 유지(함수 시작 '{'부터 끝 '}'까지의 줄 수 포함, 길어지면 리팩터)

---

## 2. Git 워크플로

### 브랜치 전략 — GitHub Flow

| 브랜치 | 용도 |
|--------|------|
| `main` | 항상 배포 가능한 상태(직접 푸시 금지) |
| `feat/<이슈>-설명` | 새 기능 |
| `fix/<이슈>-설명`  | 버그 수정 |
| `refactor/설명`    | 구조 개선 |
| `docs/설명`        | 문서만 |

### 커밋 메시지 — **Gitmoji** 컨벤션

```text
<emoji> <제목 50자 이내>

<본문 (선택)>

Closes <이슈번호>
```

Ex) `✨ feat: add JWT refresh flow`

### Pull Request

- PR 템플릿 사용, 1+ 리뷰어 승인, CI 그린.
- `.handbook/quality.md` 커버리지·SLO 만족.

---

## 3. 테스트

- 코드 옆 또는 `tests/` 디렉터리.
- 테스트 프레임워크는 프로젝트 스택에 따라 [Vitest](https://vitest.dev/), [Bun Test](https://bun.sh/docs/test/writing), [Deno Test](https://deno.land/manual@v1.37/basics/testing) 등 성능이 좋은 옵션을 사용합니다. 구체적인 선택은 `.handbook/stack.md`를 따릅니다.
- 목표 커버리지: `.handbook/quality.md`.

---

## 4. 문서화

- `README.md`: 개요·설치·실행.
- `.handbook/`: 설계·가이드·ADR 등.
- API: `OpenAPI` (`.handbook/api-contract.yaml`).

---

## 5. 기타 규칙

- 의존성 변경 시 ↳ `pnpm-lock.yaml` / `bun.lockb` / `uv.lock` 커밋.  
- 보안·비밀키 처리 ↳ `.handbook/secrets.md` 지침.  
- 에러는 명시적으로 처리, 민감 정보 로그 금지.

---

## 6. LLM 협업 가이드

- **우선** `.handbook/` 문서 검색 후 코딩.  
- 정보 부족·모순 시 `Clarify needed:` 한 줄 질문.  
- 단계별 사용자 **자동 확인 요구 없음** (시스템 룰).  
- 출력: **코드 우선, 설명 ≤3줄**.  
- 금지: `any`, `console.log`, 미승인 라이브러리.
