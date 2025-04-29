# 개발 가이드라인

이 문서는 프로젝트의 일관성과 코드 품질 유지를 위한 개발 규칙을 정의합니다.

## 1. 코드 스타일

프로젝트의 코드 스타일은 [Biome](https://biomejs.dev/)를 사용을 권장하며 필수는 아닙니다.

- **포매팅 및 린팅**: Biome 설정을 따릅니다. (`biome.json` 또는 `pyproject.toml` 내 설정 참고)
- **들여쓰기**: 탭 대신 공백 2칸을 사용합니다.
- **네이밍 컨벤션**: 프로젝트 언어의 표준 스타일 가이드(예: PEP 8 for Python, Google Style Guide for TypeScript)를 따르는 것을 원칙으로 합니다. 일반적인 권장 사항은 다음과 같으며, 구체적인 내용은 각 언어별 린터 설정을 참고합니다.
    - 변수, 함수: `camelCase` (JS/TS), `snake_case` (Python)
    - 클래스, 타입, 인터페이스: `PascalCase`
    - 상수: `UPPER_SNAKE_CASE`
    - 파일명: `kebab-case` (JS/TS), `snake_case.py` (Python). 단, 프레임워크 규칙(예: React 컴포넌트 `PascalCase.tsx`)이나 명확성을 위한 예외는 허용합니다.
- **주석**: 필요한 경우 명확하고 간결하게 작성합니다. JSDoc/Docstring 형식을 권장합니다.
- **최대 라인 길이**: 100자 (코드 한 줄의 최대 글자 수)
- **함수 길이**: 함수는 단일 책임 원칙(Single Responsibility Principle)을 따르고, 가독성을 위해 일반적으로 20줄을 넘지 않도록 노력합니다. 함수가 이보다 길어지면 리팩토링을 고려합니다.
- **최신 문법 및 스타일**: 프로젝트에서 사용하는 언어의 최신 안정화된 문법과 스타일을 적극적으로 활용합니다. (예: C++23, ES2023 등) 

## 2. 버전 관리 (Git)

### 브랜치 전략

[GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)를 기본으로 사용합니다.

- `main`: 항상 배포 가능한 상태를 유지합니다. 직접 푸시 금지.
- `feature/이슈번호-간단설명`: 기능 개발 브랜치 (예: `feature/123-add-login-button`)
- `fix/이슈번호-간단설명`: 버그 수정 브랜치 (예: `fix/456-user-auth-error`)
- `refactor/간단설명`: 리팩토링 브랜치
- `docs/간단설명`: 문서 수정 브랜치

### 커밋 메시지

[Gitmoji](https://gitmoji.dev/) 스타일을 따르는 것을 권장합니다.

```
<이모지> <제목>

<본문 (선택 사항)>

<꼬리말 (선택 사항)>
```

- **이모지**: 커밋 내용에 가장 적합한 이모지를 [Gitmoji 사이트](https://gitmoji.dev/)에서 선택합니다. (예: ✨ 새로운 기능, 🐛 버그 수정, 🚀 배포, 📝 문서 작성)
- **제목**: 50자 이내로 명료하게 작성. 현재형 동사 사용.
- **본문**: 변경 이유와 상세 내용 작성.
- **꼬리말**: 관련 이슈 번호 (예: `Closes #123`, `Fixes #456`) 등

### Pull Request (PR)

- PR 템플릿을 사용하여 작성합니다.
- 변경 사항 요약, 테스트 방법, 관련 이슈 등을 명확히 기재합니다.
- 최소 1명 이상의 코드 리뷰 승인이 필요합니다.
- CI 빌드 및 테스트 통과 필수.
- `.handbook/quality.md`에 정의된 테스트 커버리지 및 SLO 목표 충족 필수.

## 3. 테스트

- 테스트 코드는 기능 코드와 함께 또는 별도의 `tests` 디렉토리에 위치시킵니다.
- 단위 테스트, 통합 테스트를 적극적으로 작성합니다.
- 테스트 프레임워크는 프로젝트 스택에 따라 [Jest](https://jestjs.io/), [Vitest](https://vitest.dev/), [Bun Test](https://bun.sh/docs/test/writing), [Deno Test](https://deno.land/manual@v1.37/basics/testing) (JS/TS) 등을 사용합니다. 구체적인 선택은 `.handbook/stack.md`를 따릅니다.
- 테스트 커버리지 목표는 `.handbook/quality.md`를 참고합니다.

## 4. 문서화

- README.md: 프로젝트 개요, 설치, 실행 방법을 포함합니다.
- .handbook/: 상세 설계, 아키텍처, 가이드라인 등을 포함합니다.
- 코드 내 주석: 복잡한 로직이나 중요한 결정 사항에 대해 간결하게 작성합니다.
- API 문서: OpenAPI Specification (YAML) 등 표준화된 형식을 사용합니다. (`.handbook/api-contract.yaml` 참고)

## 5. 기타

- **의존성 관리**: `package.json` / `pyproject.toml` 업데이트 후 `pnpm-lock.yaml` (pnpm 사용 시), `bun.lock` (Bun 사용 시), `poetry.lock` (Poetry 사용 시) 또는 `uv` 관련 파일을 커밋합니다. `npm`이나 `pip` 대신 `pnpm`, `Bun`, `uv` 등 현대적인 패키지 매니저 사용을 권장합니다. 아키텍처에 영향을 미치는 중요한 의존성 변경 시에는 `.clinerules`에 따라 ADR 작성을 고려합니다.
- **에러 처리**: 예상 가능한 오류는 명시적으로 처리하고, 사용자에게 의미 있는 피드백을 제공합니다. 민감 정보가 로그에 노출되지 않도록 주의합니다.
- **보안**: OWASP Top 10 등 일반적인 웹 취약점을 인지하고 방어적으로 코드를 작성합니다. 보안 관련 사항은 `.handbook/secrets.md` 및 `.handbook/quality.md`를 참고합니다.
