# 기술 스택 가이드라인

본 문서는 프로젝트에서 사용되는 기술 스택에 대한 참고 정보를 제공합니다.

## Overview
This project uses a minimal stack for a static website hosted on GitHub Pages.

## Technologies
- **Runtime/Package Manager:** Bun
- **Languages:** HTML, CSS, TypeScript
- **Deployment:** GitHub Actions to GitHub Pages

## Rationale
The chosen stack prioritizes simplicity and performance for a static site. Bun is used for tooling and potentially simple build steps, while pure HTML, CSS, and TypeScript provide a standard and efficient frontend. GitHub Actions automates the deployment process to the easily accessible GitHub Pages.

## Versioning
Specific versions of Bun and any dependencies will be managed via `bun.lock`.
