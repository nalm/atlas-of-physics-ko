// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, rad = d => d * Math.PI / 180, RE = M.EARTH.R, GM = M.GM, m = M.SAT_M;
const B = M.BALL;

// 0 · twice the speed
const AC0 = M.ac(M.V2, B.r);
// 1 · half the string
const T1 = B.m * M.V1 ** 2 / (B.r / 2);
// 2 · a wet road
const MU2 = 0.40, V2MAX = Math.sqrt(MU2 * G * M.CAR.r);
// 3 · the cone at 60°
const TH3 = 60, R3 = M.CONE.L * Math.sin(rad(TH3)), V3 = Math.sqrt(R3 * G * Math.tan(rad(TH3))), T3 = M.CONE.m * G / Math.cos(rad(TH3));
// 4 · the loop's top at 9.0 m/s
const L = M.LOOP, V4 = 9.0, N4 = L.m * (V4 ** 2 / L.r - G);
// 5 · a wider banked curve
const R5 = 40, V5 = Math.sqrt(R5 * G * Math.tan(M.BANK.th));
// 6 · a record turntable
const RPM6 = 100 / 3, R6 = 0.15, V6 = R6 * RPM6 * 2 * Math.PI / 60;
// 7 · g one Earth radius up
const G7 = M.EARTH.g / 4;
// 8 · orbit at 3 R_E
const V8 = Math.sqrt(GM / (3 * RE));
// 9 · an ellipse from 2 R_E to 4 R_E
const RP9 = 2 * RE, RA9 = 4 * RE, VP9 = M.visViva(RP9, (RP9 + RA9) / 2), VA9 = VP9 * RP9 / RA9;
// 10 · the page's ellipse: K at apogee from energy
const KP = 0.5 * m * M.ELL.vp ** 2, UP = M.Ugrav(M.ELL.rp), UA = M.Ugrav(M.ELL.ra), KA = KP + UP - UA;
// 11 · gravity's work from 4 R_E in to 2 R_E; ΔU to 100 km
const W11 = GM * m * (1 / (2 * RE) - 1 / (4 * RE)), H11 = 100e3, DU11 = GM * m * (1 / RE - 1 / (RE + H11)), MGH11 = m * M.EARTH.g * H11;
// 12 · escape from 4 R_E; from a circular orbit at 2 R_E
const VE12 = M.vEsc(4 * RE), R12 = 2 * RE;
const GJ = x => f(x / 1e9, 2);

export const PRACTICE = {
  0: [
    { q: '공이 일정한 속력으로 원운동한다. 공의 가속도는 어느 방향을 향하는가?',
      choices: ['속도 방향, 원의 접선 방향', '원의 중심 방향', '중심에서 바깥쪽 방향', '방향 없음: 속력이 일정하면 가속도는 0이다'], answer: 1,
      why: `<p>속도는 벡터이고 그 방향이 계속 중심 쪽으로 돌아가므로, Δ<i>v</i>(그리고 <i>a</i>)는 중심을 향하며 ⟂ <i>v</i>이다. <b>속력</b>이 일정하다는 것은 <i>a</i>에 <i>v</i> 방향 성분이 없다는 뜻이지, <i>a</i>가 0이라는 뜻이 아니다.</p>` },
    { q: `공이 같은 ${f(B.r)} m 원을 ${f(M.V1, 1)} m/s 대신 ${f(M.V2, 1)} m/s로 돈다. 구심 가속도는 얼마인가?`,
      choices: [`${p3(2 * M.ac(M.V1, B.r))} m/s²`, `${p3(M.ac(M.V1, B.r))} m/s²`, `${p3(AC0)} m/s²`, `${p3(M.ac(M.V1, B.r) / 2)} m/s²`], answer: 2,
      why: `<div class="eq"><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = (${f(M.V2, 1)})² / ${f(B.r)} = ${p3(AC0)} m/s²</div><p>속력은 제곱으로 들어간다. 속력이 두 배면 ${f(M.ac(M.V1, B.r))} m/s²의 두 배가 아니라 네 배가 된다.</p>` },
  ],
  1: [
    { q: `${f(B.m)} kg 공이 여전히 ${f(M.V1, 1)} m/s로 돌지만, 줄 길이는 절반인 ${f(B.r / 2)} m이다. 장력은 얼마인가?`,
      choices: [`${p3(T1)} N`, `${p3(T1 / 4)} N`, `${p3(2 * T1)} N`, `${p3(T1 / 2)} N`], answer: 0,
      why: `<p>매끄러운 탁자 위에서 수평 방향의 힘은 장력뿐이므로, 장력이 곧 구심력 전체다:</p><div class="eq"><i>T</i> = <i>mv</i>²/<i>r</i> = ${f(B.m)} × (${f(M.V1, 1)})² / ${f(B.r / 2)} = ${p3(T1)} N</div><p>같은 속력에서 <i>r</i>를 절반으로 하면 <i>T</i>는 (${f(M.tension(M.V1))} N에서) 두 배가 된다.</p>` },
    { q: '위에서 볼 때, 공이 원운동하는 도중에 줄이 끊어진다. 끊어진 직후 공은 어떻게 움직이는가?',
      choices: ['바깥쪽으로 나선을 그리며', '원래 줄을 따라 중심에서 곧장 바깥쪽으로', '그 점에서의 접선을 따라 직선으로', '같은 원을 따라 점점 느려지며'], answer: 2,
      why: `<p>줄이 사라지면 수평 방향의 힘이 없으므로 (제1법칙) 공은 그때의 속도를 그대로 유지한다. 즉 원의 접선 방향으로 직선 운동을 한다. 공을 반지름 방향으로 튕겨 낼 바깥쪽 힘은 없다.</p>` },
  ],
  2: [
    { q: `비 오는 날 타이어의 μ<sub>s</sub>가 ${f(MU2)}로 떨어진다. 자동차가 반지름 ${M.CAR.r} m인 평평한 커브를 돌 수 있는 최대 속력은 얼마인가?`,
      choices: [`${p3(M.CAR.vmax)} m/s`, `${p3(M.CAR.vmax / 2)} m/s`, `${p3(MU2 * G * M.CAR.r)} m/s`, `${p3(V2MAX)} m/s`], answer: 3,
      why: `<p>한계 상태에서는 정지 마찰력이 낼 수 있는 최대값이 필요한 구심력과 정확히 같다: μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>.</p><div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = √(${f(MU2)} × ${f(G)} × ${M.CAR.r}) = ${p3(V2MAX)} m/s</div><p>μ<sub>s</sub>를 절반으로 하면 <i>v</i><sub>max</sub>는 2가 아니라 √2로 나누어진다.</p>` },
    { q: '자동차의 두 배 질량인 트럭이 같은 타이어로 같은 평평한 커브를 최대한 빠르게 돈다. 트럭의 최대 속력은 자동차의 최대 속력과 비교해 어떠한가?',
      choices: ['절반이다', '1/√2배이다', '같다', '√2배이다'], answer: 2,
      why: `<p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>: 질량이 양변에 있어 소거되므로 <i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>)이다. 트럭은 두 배의 마찰력이 필요하지만, 두 배의 무게 덕분에 도로도 두 배의 마찰력을 줄 수 있다.</p>` },
  ],
  3: [
    { q: `${f(M.CONE.L, 1)} m 줄에 매단 ${f(M.CONE.m)} kg 공을 더 빠르게 돌려, 줄이 연직선에서 ${TH3}° 기울었다. 공은 얼마나 빠르게 움직이는가?`,
      choices: [`${p3(Math.sqrt(M.CONE.L * G * Math.tan(rad(TH3))))} m/s`, `${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s`, `${p3(V3)} m/s`, `${p3(Math.sqrt(G * M.CONE.L))} m/s`], answer: 2,
      why: `<p>반지름은 <i>L</i>이 아니라 수평 거리 <i>r</i> = <i>L</i> sin θ = ${f(R3, 3)} m이다. <i>g</i> tan θ = <i>v</i>²/<i>r</i>에서:</p><div class="eq"><i>v</i> = √(<i>rg</i> tan θ) = √(${f(R3, 3)} × ${f(G)} × ${f(Math.tan(rad(TH3)), 3)}) = ${p3(V3)} m/s</div><p>${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s는 수평선에서 잰 각의 tan을 쓴 값이다.</p>` },
    { q: `같은 공, 줄은 연직선에서 ${TH3}° 기울어 있다. 줄의 장력은 얼마인가?`,
      choices: [`${p3(T3)} N`, `${p3(M.CONE.m * G * Math.cos(rad(TH3)))} N`, `${p3(M.CONE.m * G / Math.sin(rad(TH3)))} N`, `${p3(M.CONE.m * G)} N`], answer: 0,
      why: `<p>연직 방향으로는 가속하지 않으므로 줄의 연직 성분이 무게를 떠받친다:</p><div class="eq"><i>T</i> cos θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.CONE.m * G, 2)} / cos ${TH3}° = ${p3(T3)} N</div><p>장력의 일부만 위를 향하므로 장력은 <i>mg</i>보다 <b>커야</b> 한다. <i>mg</i> cos θ는 반대로 계산한 것이다.</p>` },
  ],
  4: [
    { q: `${L.m} kg 카트가 반지름 ${f(L.r, 1)} m 고리의 꼭대기를 뒤집힌 채 ${f(V4, 1)} m/s로 지난다. 트랙이 카트를 미는 힘은 얼마인가?`,
      choices: [`${p3(L.m * (V4 ** 2 / L.r + G) / 1000)} kN`, `${p3(N4 / 1000)} kN`, `${p3(L.m * V4 ** 2 / L.r / 1000)} kN`, `${p3(L.W / 1000)} kN`], answer: 1,
      why: `<p>꼭대기에서는 두 힘 모두 아래, 곧 중심을 향하며 합쳐서 <i>mv</i>²/<i>r</i>를 낸다:</p><div class="eq"><i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>F</i><sub>N</sub> = ${L.m}(${f(V4 ** 2 / L.r, 2)} − ${f(G)}) = ${f(N4, 0)} N = ${p3(N4 / 1000)} kN</div><p><i>mg</i>를 더하는 것은 고리 <b>바닥</b>의 식이다.</p>` },
    { q: `카트가 트랙에서 떨어지지 않고 반지름 ${f(L.r, 1)} m 고리의 꼭대기를 지날 수 있는 최소 속력은 얼마인가?`,
      choices: [`${p3(Math.sqrt(2 * G * L.r))} m/s`, `${p3(G * L.r)} m/s`, `${p3(Math.sqrt(G * L.r / 2))} m/s`, `${p3(L.vmin)} m/s`], answer: 3,
      why: `<p>느릴수록 트랙이 미는 힘이 작아진다. 한계는 <i>F</i><sub>N</sub> = 0, 곧 중력만으로 구심력을 내는 경우다:</p><div class="eq"><i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>v</i><sub>min</sub> = √(<i>gr</i>) = √(${f(G)} × ${f(L.r, 1)}) = ${p3(L.vmin)} m/s</div><p>질량은 소거된다. 이보다 느리면 중력이 카트를 원 안쪽으로 끌어당겨 카트가 트랙에서 떨어진다.</p>` },
  ],
  5: [
    { q: `반지름 ${R5} m인 커브가 같은 ${M.BANK.thetaDeg}°로 기울어져 있다. 자동차가 마찰 없이 이 커브를 돌 수 있는 속력은 얼마인가?`,
      choices: [`${p3(M.BANK.v)} m/s`, `${p3(Math.sqrt(R5 * G))} m/s`, `${p3(R5 * G * Math.tan(M.BANK.th))} m/s`, `${p3(V5)} m/s`], answer: 3,
      why: `<p>연직: <i>F</i><sub>N</sub> cos θ = <i>mg</i>. 수평: <i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i>. 나누면:</p><div class="eq">tan θ = <i>v</i>²/(<i>rg</i>) &nbsp;→ <i>v</i> = √(${R5} × ${f(G)} × tan ${M.BANK.thetaDeg}°) = ${p3(V5)} m/s</div><p>반지름이 네 배이므로 ${M.BANK.r} m 커브의 ${f(M.BANK.v)} m/s보다 두 배 빠르다.</p>` },
    { q: '빙판(마찰 없음)인 경사진 커브에서 자동차가 그 경사의 알맞은 속력보다 빠르게 달린다. 어떻게 되는가?',
      choices: ['경사면 위쪽, 곧 커브 바깥쪽으로 밀려 올라간다.', '경사면 아래쪽, 곧 안쪽으로 미끄러진다.', '수직 항력이 그만큼 커지므로 커브를 그대로 따라간다.', '방향을 틀지 못하고 경사면을 따라 곧장 내려간다.'], answer: 0,
      why: `<p>마찰이 없으면 수직 항력이 자동차를 떠받치는 일(<i>F</i><sub>N</sub> cos θ = <i>mg</i>)과 방향을 트는 일을 모두 해야 하므로, 그 수평 성분은 <i>mg</i> tan θ로 고정된다. 더 빠른 자동차는 그보다 큰 힘이 필요하므로 원을 따라가지 못하고 더 큰 반지름, 곧 경사면 위쪽으로 밀려난다.</p>` },
  ],
  6: [
    { q: `레코드판이 33⅓ rpm으로 돈다. 중심에서 ${f(R6)} m 떨어진 먼지 한 톨은 얼마나 빠르게 움직이는가?`,
      choices: [`${p3(R6 * RPM6 / 60)} m/s`, `${p3(V6)} m/s`, `${p3(R6 * RPM6)} m/s`, `${p3(2 * R6 * RPM6 * 2 * Math.PI / 60)} m/s`], answer: 1,
      why: `<p>먼저 rad/s로 바꾼다: ω = 33⅓ × 2π/60 = ${f(RPM6 * 2 * Math.PI / 60, 3)} rad/s. 그러면</p><div class="eq"><i>v</i> = <i>r</i>ω = ${f(R6)} × ${f(RPM6 * 2 * Math.PI / 60, 3)} = ${p3(V6)} m/s</div><p><i>v</i> = <i>r</i>ω는 ω가 rad/s일 때만 성립한다. ${p3(R6 * RPM6)}은 rpm을 그대로 쓴 값이고, ${p3(R6 * RPM6 / 60)}은 rev/s를 쓰고 2π를 빠뜨린 값이다.</p>` },
    { q: `회전하는 원판의 중심에서 ${f(M.DISC.r1)} m와 ${f(M.DISC.r2)} m 떨어진 곳에 블록이 놓여 있다. 바깥쪽 블록의 구심 가속도는 안쪽 블록과 비교해 어떠한가?`,
      choices: ['절반이다', '같다', '두 배이다', '네 배이다'], answer: 2,
      why: `<p>두 블록은 같은 ω를 공유하므로 <i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω²은 <i>r</i>에 비례해 커진다. (<i>v</i>²/<i>r</i>로 보면 <i>v</i>가 두 배지만 <i>r</i>도 두 배다: 4/2 = 2, 4가 아니다.)</p>` },
  ],
  7: [
    { q: '두 구가 힘 <i>F</i>로 서로 당긴다. 한 질량을 세 배로 하고 두 중심 사이의 거리를 두 배로 하면, 힘은 얼마가 되는가?',
      choices: [`${(3 / 4).toFixed(3)} <i>F</i>`, `${(3 / 2).toFixed(2)} <i>F</i>`, `${(3 / 8).toFixed(3)} <i>F</i>`, `${(3 * 4).toFixed(1)} <i>F</i>`], answer: 0,
      why: `<p><i>F</i> ∝ <i>m</i><sub>1</sub><i>m</i><sub>2</sub>/<i>r</i>²: 배율을 곱하면 3 × 1 / 2² = ¾. <i>r</i>를 제곱하는 것을 잊으면 1.5 <i>F</i>가 나온다.</p>` },
    { q: `지표면에서 지구 반지름 하나만큼 높은 곳의 중력장 세기(자유 낙하 가속도)는 얼마인가? (지표면에서 <i>g</i> = ${f(M.EARTH.g)} m/s²)`,
      choices: [`${p3(M.EARTH.g / 2)} m/s²`, `${p3(G7)} m/s²`, `${p3(M.EARTH.g / 9)} m/s²`, `${p3(M.EARTH.g)} m/s²`], answer: 1,
      why: `<p><b>지표면 위로</b> 반지름 하나만큼이면 중심에서 2<i>R</i><sub>E</sub>이고, <i>g</i> = <i>GM</i>/<i>r</i>²은 1/<i>r</i>²로 줄어든다:</p><div class="eq"><i>g</i>′ = ${f(M.EARTH.g)} / 2² = ${p3(G7)} m/s²</div><p>절반으로 하는 것은 중력을 1/<i>r</i>로 취급한 것이다.</p>` },
  ],
  8: [
    { q: '위성 B는 위성 A의 두 배 반지름으로 돈다(같은 행성 둘레의 원 궤도). B의 주기는 A의 몇 배인가?',
      choices: [`${p3(Math.SQRT2)}`, `${p3(2)}`, `${p3(4)}`, `${p3(2 ** 1.5)}`], answer: 3,
      why: `<p>케플러 제3법칙 <i>T</i>² ∝ <i>r</i>³이므로 <i>T</i> ∝ <i>r</i><sup>3/2</sup>: 2<sup>3/2</sup> = ${p3(2 ** 1.5)}. (표의 2 <i>R</i><sub>E</sub>와 4 <i>R</i><sub>E</sub>를 비교해 보자: ${f(M.orbitT(M.SAT.r1) / 3600)} h와 ${f(M.orbitT(M.SAT.r2) / 3600)} h.)</p>` },
    { q: `반지름 3 <i>R</i><sub>E</sub>인 원 궤도를 도는 위성의 속력은 얼마인가? (<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s², <i>R</i><sub>E</sub> = ${f(RE / 1e6)} × 10<sup>6</sup> m)`,
      choices: [`${p3(Math.sqrt(GM / RE) / 3 / 1000)} km/s`, `${p3(Math.sqrt(2 * GM / (3 * RE)) / 1000)} km/s`, `${p3(V8 / 1000)} km/s`, `${p3(Math.sqrt(GM / RE) / 1000)} km/s`], answer: 2,
      why: `<p>중력이 구심력이다: <i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>, 따라서</p><div class="eq"><i>v</i> = √(<i>GM</i>/<i>r</i>) = √(${f(GM / 1e14)} × 10<sup>14</sup> / ${f(3 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(V8 / 1000)} km/s</div><p><i>v</i> ∝ 1/<i>r</i>가 아니라 1/√<i>r</i>이다. √2가 붙은 값은 탈출 속력이다.</p>` },
  ],
  9: [
    { q: `어떤 위성의 궤도는 근지점 2 <i>R</i><sub>E</sub>에서 원지점 4 <i>R</i><sub>E</sub>까지 이어진다. 근지점에서 속력이 ${f(VP9 / 1000)} km/s일 때, 원지점에서의 속력은 얼마인가?`,
      choices: [`${p3(VP9 * (RP9 / RA9) ** 2 / 1000)} km/s`, `${p3(VA9 / 1000)} km/s`, `${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s`, `${p3(2 * VP9 / 1000)} km/s`], answer: 1,
      why: `<p>지구에 대한 각운동량은 보존되며(중력은 지구에 대해 돌림힘이 없다), 양 끝에서 <i>v</i> ⟂ <i>r</i>이다:</p><div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub> &nbsp;→ <i>v</i><sub>a</sub> = ${f(VP9 / 1000)} × 2/4 = ${p3(VA9 / 1000)} km/s</div><p>√(<i>GM</i>/<i>r</i>) 비례 관계(${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s)는 <b>원</b> 궤도끼리 비교할 때만 성립한다.</p>` },
    { q: '타원 궤도를 도는 위성에서 근지점과 원지점에서 같은 값을 갖는 양은 무엇인가?',
      choices: ['속력', '운동 에너지', '지구 중심에 대한 각운동량', '위성에 작용하는 중력'], answer: 2,
      why: `<p>중력은 지구 중심을 향하므로 그 점에 대해 돌림힘을 주지 않고, <i>L</i> = <i>mvr</i><sub>⊥</sub>는 일정하다. 속력과 운동 에너지는 근지점에서 가장 크며, 힘도 그곳에서 가장 크다(<i>r</i>가 작으므로).</p>` },
  ],
  10: [
    { q: `페이지의 궤도에서 ${m} kg 위성은 근지점에서 <i>K</i> = ${GJ(KP)} GJ, <i>U</i> = ${GJ(UP)} GJ이다. 원지점에서 <i>U</i> = ${GJ(UA)} GJ이다. 원지점에서 <i>K</i>는 얼마인가?`,
      choices: [`${p3(KP / 1e9)} GJ`, `${p3(KP / 3 / 1e9)} GJ`, `${p3(KA / 1e9)} GJ`, `${p3((KP - UP + UA) / 1e9)} GJ`], answer: 2,
      why: `<p>작용하는 힘은 보존력인 중력뿐이므로 <i>K</i> + <i>U</i>는 양 끝에서 같다:</p><div class="eq"><i>K</i><sub>a</sub> = <i>K</i><sub>p</sub> + <i>U</i><sub>p</sub> − <i>U</i><sub>a</sub> = ${GJ(KP)} + (${GJ(UP)}) − (${GJ(UA)}) = ${p3(KA / 1e9)} GJ</div><p>검산: 속력이 3분의 1이므로 운동 에너지는 9분의 1이다. ${p3((KP - UP + UA) / 1e9)} GJ는 음수인 <i>U</i>의 부호를 잘못 처리한 결과다.</p>` },
    { q: '위성이 근지점에서 원지점으로 올라가는 동안 위성–지구 계의 에너지는 어떻게 변하는가?',
      choices: ['K는 감소, U는 증가(덜 음수가 됨), E는 그대로', 'K 감소, U 감소, E 감소', 'K는 그대로, U 증가, E 증가', 'K와 U 모두 증가, 따라서 E 증가'], answer: 0,
      why: `<p>멀어지며 올라가는 동안 중력에는 <i>v</i>와 반대 방향 성분이 있어 음의 일을 하므로 <i>K</i>가 줄어든다. <i>U</i> = −<i>GMm</i>/<i>r</i>는 같은 양만큼 0을 향해 커진다. 외부 힘이 일을 하지 않으므로 <i>E</i> = <i>K</i> + <i>U</i>는 일정하다.</p>` },
  ],
  11: [
    { q: `${m} kg 위성이 <i>r</i> = 4 <i>R</i><sub>E</sub>에서 2 <i>R</i><sub>E</sub>로 떨어지는 동안 중력이 하는 일은 얼마인가? (<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s²)`,
      choices: [`${p3(-W11 / 1e9)} GJ`, `${p3(W11 / 1e9)} GJ`, `${p3(m * G * 2 * RE / 1e9)} GJ`, `${p3(2 * W11 / 1e9)} GJ`], answer: 1,
      why: `<p>힘이 <i>r</i>에 따라 변하므로 적분한다. 중력은 안쪽을 향하므로 <i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²:</p><div class="eq"><i>W</i> = ∫<sub>4<i>R</i></sub><sup>2<i>R</i></sup> (−<i>GMm</i>/<i>r</i>²) d<i>r</i> = <i>GMm</i>[1/<i>r</i>]<sub>4<i>R</i></sub><sup>2<i>R</i></sup> = <i>GMm</i>/4<i>R</i> = ${p3(W11 / 1e9)} GJ</div><p>양수다. 힘과 변위가 모두 안쪽을 향하기 때문이다. <i>h</i> = 2<i>R</i><sub>E</sub>로 놓은 <i>mgh</i>(${p3(m * G * 2 * RE / 1e9)} GJ)는 <i>g</i>가 끝까지 ${f(G)} m/s²로 유지된다고 가정한 것이다.</p>` },
    { q: `${m} kg 물체를 지면에서 <i>h</i> = ${f(H11 / 1000, 0)} km까지 들어 올릴 때 퍼텐셜 에너지의 정확한 변화를 구하고, 이를 <i>mgh</i>와 비교하여 상대적 차이가 약 <i>h</i>/<i>R</i><sub>E</sub>임을 보여라.`,
      solution: `<p>1. Δ<i>U</i> = −∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>F</i><sub>r</sub> d<i>r</i> = ∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>GMm</i>/<i>r</i>² d<i>r</i> = <i>GMm</i>(1/<i>R</i> − 1/(<i>R</i> + <i>h</i>)) = <i>GMmh</i> / [<i>R</i>(<i>R</i> + <i>h</i>)].</p><div class="eq">Δ<i>U</i> = ${f(DU11 / 1e9, 4)} GJ</div><p>2. <i>g</i> = <i>GM</i>/<i>R</i>² = ${f(M.EARTH.g)} m/s²를 쓰면 <i>mgh</i> = <i>GMmh</i>/<i>R</i>² = ${f(MGH11 / 1e9, 4)} GJ.</p><p>3. 비: <i>mgh</i>/Δ<i>U</i> = (<i>R</i> + <i>h</i>)/<i>R</i> = 1 + <i>h</i>/<i>R</i> = 1 + ${f(H11 / 1000, 0)}/${f(RE / 1000, 0)} = ${f(MGH11 / DU11, 4)}. 따라서 <i>mgh</i>는 ${f(100 * (MGH11 / DU11 - 1), 1)}% 크다. <i>g</i>를 끝까지 지표면 값으로 유지하기 때문이다.</p>` },
  ],
  12: [
    { q: `지구 중심에서 4 <i>R</i><sub>E</sub> 떨어진 곳에서의 탈출 속력은 얼마인가? (<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s², <i>R</i><sub>E</sub> = ${f(RE / 1e6)} × 10<sup>6</sup> m)`,
      choices: [`${p3(M.orbitV(4 * RE) / 1000)} km/s`, `${p3(VE12 / 1000)} km/s`, `${p3(M.vEsc(RE) / 4 / 1000)} km/s`, `${p3(2 * M.orbitV(4 * RE) / 1000)} km/s`], answer: 1,
      why: `<p>간신히 무한대에 도달하려면 <i>E</i> = ½<i>mv</i>² − <i>GMm</i>/<i>r</i> = 0:</p><div class="eq"><i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = √(2 × ${f(GM / 1e14)} × 10<sup>14</sup> / ${f(4 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(VE12 / 1000)} km/s</div><p>이는 그 위치의 원 궤도 속력(${p3(M.orbitV(4 * RE) / 1000)} km/s)의 2배가 아니라 √2배이며, 1/<i>r</i>이 아니라 1/√<i>r</i>에 비례한다.</p>` },
    { q: `${m} kg 위성이 <i>r</i> = 2 <i>R</i><sub>E</sub>인 원 궤도를 돈다. <i>K</i> = −<i>U</i>/2임을 보이고, 위성이 탈출하기 위해 더해야 할 최소 에너지와, 옆 방향으로 한 번 분사해 이를 해낼 때 필요한 속력 증가량을 구하라.`,
      solution: `<p>1. 원 궤도: <i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>이므로 <i>K</i> = ½<i>mv</i>² = <i>GMm</i>/2<i>r</i> = −<i>U</i>/2이고, <i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i>이다.</p><div class="eq"><i>E</i> = −${f(GM / 1e14)} × 10<sup>14</sup> × ${m} / (2 × ${f(R12 / 1e7, 3)} × 10<sup>7</sup>) = ${GJ(M.circE(R12))} GJ</div><p>2. 탈출하려면 <i>E</i> ≥ 0이어야 한다(다시 말해, 중력을 거슬러 일 ∫<sub><i>r</i></sub><sup>∞</sup> <i>GMm</i>/<i>r</i>′² d<i>r</i>′ = <i>GMm</i>/<i>r</i>를 해낼 만큼의 <i>K</i>가 있어야 한다). 따라서 최소 ${GJ(-M.circE(R12))} GJ를 더해야 한다.</p><p>3. 속력: <i>v</i><sub>c</sub> = √(<i>GM</i>/<i>r</i>) = ${f(M.orbitV(R12) / 1000)} km/s, <i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = ${f(M.vEsc(R12) / 1000)} km/s이므로, <i>v</i> 방향으로 ${f((M.vEsc(R12) - M.orbitV(R12)) / 1000)} km/s만큼 속력을 높이면 된다.</p>` },
  ],
};
