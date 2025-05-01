# 🔐 암호화 가이드라인

> **목표**  
> 암호화 관련 결정을 내릴 때 **참고하여 일관성 있고 안전한 접근 방식**을 따르도록 돕는다.  
> *(주요 내용은 OWASP 2025, libsodium, NIST 진행 문서를 참고)*

---

## 0. 핵심 고려사항

1. **Simple ≠ Weak** 검증된 알고리즘 **하나**에 집중하는 것을 고려.  
2. **메모리-하드 KDF > 빠른 해시 덧칠** GPU/ASIC 비용을 폭증시키는 방식을 고려.  
3. **운용 난이도 ≤ 보안 이득** 관리 복잡성이 보안 이득보다 크다면 다른 방식을 고려.  
4. **Salt = 공개 랜덤, Pepper = 서버 비밀** 유출 대비 이중 잠금을 고려.  
5. **Nonce·키 재사용 금지** AEAD 사용 시 Nonce/키 재사용 금지를 엄격히 준수.

---

## 1. 패스워드 해싱 / 키 스트레칭

| 항목 | 권장 값 |
|------|---------|
| **KDF** | `Argon2id` (libsodium `crypto_pwhash`) |
| **파라미터** | 최소 `t=2, m=19 MiB, p=1` (OWASP) → 서버 여유 땐 `t=3, m≈1 GiB` 권장  ([Password Storage - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)) |
| **Salt** | 사용자마다 16 B+ 랜덤, 해시와 함께 DB 저장 |
| **Pepper** | 32 B 비밀, 환경변수·HSM·Secrets Mgr 보관 |
| **기술** | `hash = Argon2id(password || salt || pepper)`<br>또는 `hash = Argon2id(password || salt)` → `HMAC-SHA256(hash, pepper)` |
| **비교** | 반드시 constant-time 함수(lib­sodium `crypto_verify_*`) |

*차선책*: `scrypt(N=2^17, r=8, p=1)`—레거시 호환만.

---

## 2. 데이터 암호화 (AEAD)

### 2-A 패스워드 기반
```text
key  = Argon2id(password || salt || pepper)   # 256-bit
nonce= 24B random                             # XChaCha20
ciphertext, tag = XChaCha20-Poly1305(key, nonce, plaintext)
output = nonce || salt || ciphertext || tag
```

### 2-B 마스터 키 보유
```text
enc_key  = HKDF(master_key, info="enc")
auth_key = HKDF(master_key, info="auth")      # 필요 시
```

| 상황 | 1순위 | 하드웨어 AES NI 有 시 |
|------|-------|-----------------------|
| 모든 플랫폼 | **XChaCha20-Poly1305** (24 B nonce)  ([XChaCha20-Poly1305 construction | libsodium](https://doc.libsodium.org/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction?utm_source=chatgpt.com)) | **AES-GCM-SIV** (12 B nonce, 재사용 내성)  ([[PDF] Overview of the NIST Block Cipher Modes Project](https://csrc.nist.gov/csrc/media/Presentations/2024/overview-of-the-nist-bcm-project/images-media/sess-1-turan-acm-workshop-2024.pdf?utm_source=chatgpt.com), [[PDF] Comments on NIST Requirements for an Accordion Cipher Mode](https://csrc.nist.gov/csrc/media/Events/2024/accordion-cipher-mode-workshop-2024/documents/papers/comments-on-NIST-reqs-accordion-cipher.pdf?utm_source=chatgpt.com)) |

> **금지** : AES-GCM(표준)에서 nonce 충돌, ChaCha·AES 이중 암호화, 자체 롤링.

---

## 3. 키 분기 / 도메인 분리

- 이미 강력한 `root_key` 있다면 **Argon2id 생략**.  
- `HKDF(root_key, salt, info)`로 서비스별 · 용도별 키 파생.  
- `info`(라벨) 값은 `"enc"`, `"auth"`, `"sig"` 등 고유 문자열.

---

## 4. 구현 체크리스트

- [ ] Salt 16 B + 랜덤, 사용자마다 고유  
- [ ] Pepper 비밀키 주기적 교체 (rotate & rehash)  
- [ ] 로그인 해시 계산 시간 0.3–0.5 s 목표 부하 테스트  
- [ ] Nonce 24 B (XChaCha) / 12 B (SIV) → **절대 재사용 금지**  
- [ ] 모든 키·비밀은 사용 직후 `memzero()`  
- [ ] 코드 리뷰 시 “겹겹이 KDF / 이중 AEAD” 발견되면 즉시 리팩토링

---

## 5. 흔한 함정 → 바로 DROP

| ❌ 안티패턴 | 이유 |
|-------------|------|
| `Argon2id` + `scrypt` 중첩 | 비용↑ = 서버 DOS 리스크↑, 실익 0 |
| `AES-GCM` + `ChaCha20` 더블 암호화 | 검증 안 됨, 성능 반토막 |
| `PBKDF2` 신규 시스템 도입 | GPU 저항↓, 미래 대비 실패 |
| Pepper를 DB에 함께 저장 | 의미 없음 (같이 털림) |

---

## 6. 요약 슬로건

> **“검증된 한 층 + 제대로 된 운영 = 끝.”**  
> 남는 시간은 버그 잡고 서비스 개선에 쓰자.
