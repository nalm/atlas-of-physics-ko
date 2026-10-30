# 한국어 번역 지침 (Atlas of Physics 한국어판)

## 원칙
- 대상 독자: 고등학교 물리·대학 일반물리 학습자. 한국 교과서·대학 일반물리 표준 용어 사용.
- 문체: 본문은 평서문 '~다'체 (예: "운동학은 운동을 기술한다."). 짧고 명료하게. 원문의 간결한 톤 유지.
- UI 문구(버튼·힌트)는 간결한 명사형/명령형 (예: "닫기", "드래그해 회전").
- 연습문제 질문은 '~는가?' / '~은 얼마인가?' 형태, 선택지는 원문 형식 유지.
- 수식, 변수(<i>v</i> 등), 단위(m/s, N, J), 숫자, ${...} 템플릿 표현식, HTML 태그·속성·class 명은 절대 바꾸지 않는다. 번역하는 것은 사람에게 보이는 텍스트뿐.
- 코드 식별자, 객체 키(kicker, title, sub, body, q, choices, answer, why, solution 등), data-* 속성, CSS 클래스, 파일 경로, 파트 키('ball' 등)는 번역 금지.
- aria-label, title 속성의 문장은 번역한다.
- 'AP Physics 1', 'AP Physics C' 같은 시험명은 그대로 두되 "AP 물리 1", "AP 물리 C"로 표기 가능 (통일: "AP 물리 1", "AP 물리 C: 역학", "AP 물리 C: 전자기학").
- 'Chapter 1' → '1장', 'Fig.' → '그림', 'Page' → '페이지', 'Ch. 10' → '10장', 'No. 01' → 'No. 01' 유지.
- 'Physics C' 태그가 kicker에 있으면 'Physics C' → '물리 C'.
- 따옴표: 원문 ’ “ ” 는 한국어 문장에서 ‘ ’ “ ” 그대로 사용 가능. JS 문자열 구분자(' ` ")와 충돌하지 않게 주의 — 작은따옴표로 감싼 문자열 안에 ' 를 넣지 말 것.
- 사람 이름(Newton, Gauss, Ampère, Faraday, Lenz, Kirchhoff, Bernoulli, Coulomb, Hooke…)은 한글 표기: 뉴턴, 가우스, 앙페르, 패러데이, 렌츠, 키르히호프, 베르누이, 쿨롱, 훅, 케플러, 아르키메데스, 파스칼, 옴, 줄, 비오-사바르, 로런츠.

## 용어집 (통일)
kinematics 운동학 / position 위치 / displacement 변위 / distance 이동 거리 / velocity 속도 / speed 속력 / acceleration 가속도 / free fall 자유 낙하 / projectile 포물체(투사체 운동: 포물선 운동) / vector 벡터 / scalar 스칼라 / component 성분 / slope 기울기 / area under the curve 그래프 아래 넓이 / tangent 접선 / reference frame 기준틀 / relative velocity 상대 속도
force 힘 / net force 알짜힘 / normal force 수직 항력 / friction 마찰력 / static/kinetic friction 정지/운동 마찰력 / tension 장력 / weight 무게 / mass 질량 / inertia 관성 / free-body diagram 자유 물체 도형 / drag 항력 / terminal velocity 종단 속도 / equilibrium 평형
circular motion 원운동 / centripetal 구심 / period 주기 / frequency 진동수 / angular velocity 각속도 / gravitation 중력 / orbit 궤도 / escape speed 탈출 속력
work 일 / energy 에너지 / kinetic energy 운동 에너지 / potential energy 퍼텐셜 에너지 / power 일률 / conservation 보존 / spring constant 용수철 상수
momentum 운동량 / impulse 충격량 / collision 충돌 / elastic/inelastic 탄성/비탄성 / center of mass 질량 중심
simple harmonic motion 단순 조화 운동 / amplitude 진폭 / pendulum 진자 / oscillation 진동
rotation 회전 / torque 돌림힘(토크) — '돌림힘' 사용 / moment of inertia 관성 모멘트 / angular momentum 각운동량 / rolling 굴림
fluid 유체 / pressure 압력 / density 밀도 / buoyancy 부력 / continuity 연속 방정식 / Bernoulli 베르누이
charge 전하 / electric field 전기장 / superposition 중첩 / flux 선속(전기 선속, 자기 선속) / Gauss’s law 가우스 법칙 / potential 전위 / potential difference 전위차 / equipotential 등전위 / capacitor 축전기 / capacitance 전기 용량 / dielectric 유전체 / current 전류 / resistance 저항 / resistivity 비저항 / circuit 회로 / series/parallel 직렬/병렬 / emf 기전력 / magnetic field 자기장 / magnetic force 자기력 / induction 전자기 유도 / inductance 인덕턴스 / inductor 인덕터 / Lenz’s law 렌츠 법칙
breakdown / "break it down" 분해 / "Compare" 비교 / "Practice" 연습 문제 / "Answer" 정답 / "Solution" 풀이 / "Show solution" 풀이 보기
