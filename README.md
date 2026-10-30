# 물리 아틀라스 (Atlas of Physics 한국어판)

AP 물리 1 · AP 물리 C(역학, 전자기학) 범위를 다루는 3D 인터랙티브 물리 교과서의 한국어 번역판입니다. 각 장은 하나의 단순한 운동을 교과서 그림처럼 3D로 보여 주고, 스크롤하면 페이지가 넘어가며 카메라가 움직입니다. 그림 속 대상에 마우스를 올리면 강조되고, 클릭하면 벡터를 성분으로, 그래프를 기울기와 넓이로 분해해 보여 줍니다.

## 원본 출처

- **원작:** [Atlas of Physics](https://github.com/nathanliow/atlas-of-physics) — Nathan Liow
- **원작 라이선스:** MIT License (Copyright (c) 2026 Nathan Liow). 원문 [LICENSE](LICENSE)를 그대로 유지합니다.
- **번역 기준:** 원 저장소 `main` 브랜치 커밋 `ac4c5d9` (2026년 10월 30일 기준)
- 이 저장소는 원작을 한국어로 옮긴 2차 저작물이며, 원작자가 검토하거나 승인한 번역이 아닙니다.

## 번역 범위

- 표지, 15개 장 본문, 3D 그림 라벨과 실시간 수치 표시, 장별 연습 문제와 풀이
- 장 사이의 ‘비교’ 링크, AP 공식 모음(`equations/`)
- 물리 모델과 계산 코드는 바꾸지 않았습니다. 모든 장의 `checks.mjs`가 원본과 같이 통과합니다.
- 용어는 국내 고교·대학 일반물리 표준 용어를 따랐습니다. 용어집은 [TRANSLATION_GUIDE.md](TRANSLATION_GUIDE.md)에 있습니다.

## 구성

| 장 | 디렉터리 | 장 | 디렉터리 |
|---|---|---|---|
| 1 운동학 | `kinematics/` | 9 정전기학 | `electrostatics/` |
| 2 뉴턴의 운동 법칙 | `newton/` | 10 가우스 법칙 | `gauss/` |
| 3 원운동과 중력 | `circular/` | 11 전위 | `potential/` |
| 4 일과 에너지 | `energy/` | 12 축전기 | `capacitors/` |
| 5 운동량 | `momentum/` | 13 회로 | `circuits/` |
| 6 진동 | `oscillations/` | 14 자기장 | `magnetism/` |
| 7 회전 | `rotation/` | 15 전자기 유도 | `induction/` |
| 8 유체 | `fluids/` | | |

각 장은 `model.js`(물리 모델), `checks.mjs`(모델 검증), `world.js`(3D 그림), `pages.js`(본문), `practice.js`(연습 문제), `main.js`로 이루어집니다. 공통 엔진은 `engine/`에 있습니다.

## 실행

```
python3 -m http.server 8137
```

브라우저에서 http://127.0.0.1:8137/ 을 엽니다. three.js는 jsDelivr에서 불러옵니다.

- 키보드: ← → 페이지 넘기기, Esc 분해한 부분 되돌리기
- 링크: `newton/#4` 는 2.4 페이지를 엽니다.
- 검증: `npm run check` (모든 장의 모델 검증과 공식 모음 링크 검사)
- 공식 모음 재생성: `node equations/build.mjs`

AP®는 College Board의 상표이며, College Board는 이 사이트를 보증하지 않습니다.
