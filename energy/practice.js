// energy/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, D2R = Math.PI / 180;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);

// 0 · work: the page's pull, 20 N at 30°, over 3.0 m
const P = M.PULL, d0 = 3.0, W0 = P.F * d0 * Math.cos(P.th);
// 1 · the toss
const T = M.TOSS, Wup = -0.5 * T.m * T.v0 ** 2;
// 2 · the whirl, half a lap
const Wh = M.WHIRL, halfArc = Math.PI * Wh.r;
// 3 · the car over 12 m from rest
const C = M.CAR, d3 = 12, v3 = Math.sqrt(2 * C.F * d3 / C.m);
// 4 · the drop, zero on the 1.0 m tabletop; speed 1.0 m above the ground
const Dr = M.DROP, y4 = 1.0, U4 = Dr.m * G * (Dr.h - Dr.ref2), v4 = Math.sqrt(2 * G * (Dr.h - y4));
// 5 · the spring, compression when the block has slowed to 1.0 m/s
const S = M.SPRING, v5 = 1.0, x5 = Math.sqrt(S.m * (S.v0 ** 2 - v5 ** 2) / S.k);
// 6 · the changing push (Physics C)
const Pu = M.PUSH, v6 = Math.sqrt(2 * Pu.W / Pu.m), Whalf = Pu.F0 * Pu.L * 13 / 24;
// 7 · the pendulum at 20°
const Pd = M.PEND, th7 = 20 * D2R, v7 = Math.sqrt(2 * G * Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)));
const vb = Math.sqrt(2 * G * Pd.L * (1 - Math.cos(Pd.th0))), Tb = Pd.m * G + Pd.m * vb ** 2 / Pd.L;
// 8 · U(x) = 3x² − 2x³ (Physics C)
const U8 = x => 3 * x * x - 2 * x ** 3, F8 = x => -(6 * x - 6 * x * x), x8 = 2.0;
// 9 · the bond (Physics C)
const B = M.BOND, kB = 72 * B.eps / B.r0 ** 2, TB = 2 * Math.PI * Math.sqrt(B.m / kB);
// 10 · the slide, from 8.0 m/s; heat after 1.0 m from 4.0 m/s
const Sl = M.SLIDE, v10 = 8.0, d10 = v10 ** 2 / (2 * Sl.mu * G), x10 = 1.0, Q10 = Sl.mu * Sl.m * G * x10;
// 11 · a student on the stairs
const m11 = 70, h11 = 3.0, t11 = 4.2, P11 = m11 * G * h11 / t11;

export const PRACTICE = {
  0: [
    { q: `밧줄이 ${f(P.m, 1)} kg 상자를 수평 위 ${P.deg}° 방향으로 ${f(P.F, 0)} N의 힘으로 당기는 동안, 상자는 마찰 없는 바닥을 따라 ${f(d0, 1)} m 미끄러진다. 밧줄이 한 일은 얼마인가?`,
      choices: [`${f(P.F * d0 * Math.sin(P.th), 1)} J`, `${f(P.F * d0, 1)} J`, `${f(W0, 1)} J`, `${f(P.F * d0 / Math.cos(P.th), 1)} J`], answer: 2,
      why: `<p>변위 방향 성분만 일을 한다:</p><div class="eq"><i>W</i> = <i>F</i>Δ<i>x</i> cos θ = ${f(P.F, 0)} × ${f(d0, 1)} × cos ${P.deg}° = ${f(W0, 1)} J</div><p>${f(P.F * d0 * Math.sin(P.th), 1)} J는 운동에 수직인 성분인 sin θ를 쓴 값이고, ${f(P.F * d0, 1)} J는 각을 무시한 값이다.</p>` },
    { q: '같은 당기기 동안 바닥의 수직 항력이 상자에 한 일은 얼마인가?',
      choices: ['수직 항력이 <i>mg</i>보다 작으므로 음수', '변위에 수직이므로 0', '위쪽을 향하므로 양수', '밧줄이 한 일과 크기가 같고 부호가 반대'], answer: 1,
      why: '<p>수직 항력은 연직 방향이고 상자는 수평으로 움직인다: θ = 90°, cos 90° = 0이므로 <i>W</i> = 0이다. 그 크기(밧줄이 조금 들어 올리므로 <i>mg</i>보다 작다)는 상관없다.</p>' },
  ],
  1: [
    { q: `${f(T.m)} kg 공이 ${f(T.v0, 1)} m/s로 손을 떠나 곧장 위로 올라간다. 손에서 꼭대기까지 중력이 공에 한 일은 얼마인가?`,
      choices: [`${f(-Wup)} J`, `${f(0)} J`, `${f(2 * Wup)} J`, `${f(Wup)} J`], answer: 3,
      why: `<p>중력은 운동과 반대 방향(θ = 180°)이므로 그 일은 음수이며, 일–에너지 정리에 따라 운동 에너지를 모두 없앤다:</p><div class="eq"><i>W</i><sub>g</sub> = Δ<i>K</i> = 0 − ½ × ${f(T.m)} × ${f(T.v0, 1)}² = ${f(Wup)} J</div><p>${f(2 * Wup)} J는 ½을 빠뜨린 값이고, +${f(-Wup)} J는 부호가 틀렸다.</p>` },
    { q: '손을 떠나 같은 높이로 돌아올 때까지 전체 이동 동안 중력이 공에 한 총일은 어떠한가?',
      choices: ['양수', '음수', '0', '<i>mgh</i>와 같다 (<i>h</i>는 최고 높이)'], answer: 2,
      why: '<p>올라갈 때 음의 일, 내려올 때 같은 양의 양의 일을 하므로 총합은 0이다. 그래서 공은 던질 때의 속력으로 손에 돌아온다(공기 저항이 없을 때).</p>' },
  ],
  2: [
    { q: `원운동하는 공에 작용하는 줄의 장력은 ${f(Wh.T, 1)} N이고 원의 반지름은 ${f(Wh.r, 1)} m이다. 반 바퀴 동안 장력이 한 일은 얼마인가?`,
      choices: [`${f(Wh.T * halfArc, 1)} J`, `${f(Wh.T * 2 * Wh.r, 1)} J`, `${f(-Wh.T * halfArc, 1)} J`, '0 J'], answer: 3,
      why: `<p>매 순간 장력은 중심을, 속도는 원을 따라 향하므로 둘은 90°로 만나고, 작은 구간마다 <i>T</i> d<i>s</i> cos 90° = 0이다. 총일은 0 J이며 속력은 결코 변하지 않는다.</p><p>${f(Wh.T * halfArc, 1)} J는 힘과 호의 길이가 나란한 것처럼 곱한 값이다. ${f(Wh.T * 2 * Wh.r, 1)} J는 알짜 변위인 지름을 쓴 값인데, 이 역시 매 순간 힘의 방향과 나란하지 않다.</p>` },
    { q: '이제 같은 줄로 공을 두 배의 속력으로 돌린다. 장력과 공의 운동 에너지는 각각 몇 배가 되는가?',
      choices: ['장력 ×2, 운동 에너지 ×4', '장력 ×4, 운동 에너지 ×4', '장력 ×4, 운동 에너지 ×2', '장력 ×2, 운동 에너지 ×2'], answer: 1,
      why: '<p><i>T</i> = <i>mv</i>²/<i>r</i>와 <i>K</i> = ½<i>mv</i>²은 모두 <i>v</i>²에 비례하므로 둘 다 4배가 된다. 장력은 여전히 일을 하지 않는다. 늘어난 <i>K</i>는 공을 빠르게 만든 다른 무언가에서 왔다.</p>' },
  ],
  3: [
    { q: `${f(C.F / 1000, 1)} kN의 알짜힘이 정지한 ${C.m} kg 자동차를 ${d3} m 민다. 그때의 속력은 얼마인가?`,
      choices: [`${f(Math.sqrt(C.F * d3 / C.m))} m/s`, `${f(v3)} m/s`, `${f(C.F * d3 / C.m, 1)} m/s`, `${f(2 * C.F * d3 / C.m, 1)} m/s`], answer: 1,
      why: `<div class="eq"><i>W</i><sub>net</sub> = <i>F</i>Δ<i>x</i> = ${f(C.F * d3 / 1000, 1)} kJ = ½<i>mv</i>² &nbsp;⇒&nbsp; <i>v</i> = √(2 × ${f(C.F * d3, 0)} / ${C.m}) = ${f(v3)} m/s</div><p>${f(Math.sqrt(C.F * d3 / C.m))} m/s는 ½을 빠뜨린 값이고, 나머지 둘은 제곱근을 잊은 값이다.</p>` },
    { q: '같은 알짜힘이 자동차를 정지 상태에서 속력 <i>v</i>까지, 이어서 <i>v</i>에서 2<i>v</i>까지 가속한다. 두 번째 단계의 알짜일은 첫 번째 단계의 몇 배인가?',
      choices: ['1', '2', '4', '3'], answer: 3,
      why: '<p>0에서 <i>v</i>까지 Δ<i>K</i>는 ½<i>mv</i>²이다. <i>v</i>에서 2<i>v</i>까지는 ½<i>m</i>(4<i>v</i>² − <i>v</i>²) = 3 × ½<i>mv</i>²이다. 운동 에너지는 <i>v</i>²에 비례해 커지므로, 속력을 같은 만큼 늘리는 데에도 점점 더 많은 일(과 거리)이 든다.</p>' },
  ],
  4: [
    { q: `지면에서 ${f(Dr.ref2, 1)} m 높이의 탁자 윗면을 <i>U</i><sub>g</sub> = 0으로 잡는다. 지면에서 ${f(Dr.h, 1)} m 높이에 들고 있는 ${f(Dr.m)} kg 공의 <i>U</i><sub>g</sub>는 얼마인가?`,
      choices: [`${f(Dr.m * G * Dr.h)} J`, `${f(Dr.m * G * Dr.ref2)} J`, `${f(U4)} J`, `${f(Dr.m * G * (Dr.h + Dr.ref2))} J`], answer: 2,
      why: `<p>Δ<i>y</i>는 정한 기준점에서 잰다: ${f(Dr.h, 1)} − ${f(Dr.ref2, 1)} = ${f(Dr.h - Dr.ref2, 1)} m.</p><div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i> = ${f(Dr.m)} × ${f(G)} × ${f(Dr.h - Dr.ref2, 1)} = ${f(U4)} J</div><p>${f(Dr.m * G * Dr.h)} J는 지면을 기준점으로 잡을 때만 맞다.</p>` },
    { q: `공을 ${f(Dr.h, 1)} m에서 떨어뜨린다. 지면에서 ${f(y4, 1)} m 높이에 있을 때 공의 속력은 얼마인가?`,
      choices: [`${f(Math.sqrt(2 * G * y4))} m/s`, `${f(Math.sqrt(2 * G * Dr.h))} m/s`, `${f(2 * G * (Dr.h - y4), 1)} m/s`, `${f(v4)} m/s`], answer: 3,
      why: `<p>공은 ${f(Dr.h - y4, 1)} m 떨어졌고, 잃은 <i>U</i><sub>g</sub>는 이제 <i>K</i>가 되었다:</p><div class="eq"><i>mg</i>Δ<i>y</i> = ½<i>mv</i>² &nbsp;⇒&nbsp; <i>v</i> = √(2 × ${f(G)} × ${f(Dr.h - y4, 1)}) = ${f(v4)} m/s</div><p>${f(Math.sqrt(2 * G * y4))} m/s는 떨어진 거리 대신 지면에서의 높이를 쓴 값이다.</p>` },
  ],
  5: [
    { q: `${f(S.m, 1)} kg 블록이 ${f(S.v0, 1)} m/s로 ${S.k} N/m 용수철에 부딪힌다. 블록이 ${f(v5, 1)} m/s로 느려졌을 때 용수철은 얼마나 압축되어 있는가?`,
      choices: [`${f(x5, 3)} m`, `${f(S.xmax / 2, 3)} m`, `${f(S.m * (S.v0 ** 2 - v5 ** 2) / S.k, 3)} m`, `${f(Math.sqrt(S.m * (S.v0 ** 2 - v5 ** 2) / (2 * S.k)), 3)} m`], answer: 0,
      why: `<div class="eq">½<i>mv</i><sub>0</sub>² = ½<i>mv</i>² + ½<i>k</i>Δ<i>x</i>² &nbsp;⇒&nbsp; Δ<i>x</i> = √(<i>m</i>(<i>v</i><sub>0</sub>² − <i>v</i>²)/<i>k</i>) = √(${f(S.m, 1)} × ${f(S.v0 ** 2 - v5 ** 2, 1)} / ${S.k}) = ${f(x5, 3)} m</div><p>속력이 절반이라고 압축도 절반인 것은 아니다. 운동 에너지의 4분의 3이 이미 저장되었으므로 Δ<i>x</i>는 ${f(S.xmax)} m의 √¾배이다.</p>` },
    { q: '블록이 두 배 빠르게 들어온다면 용수철의 최대 압축은 어떻게 되는가?',
      choices: ['같다', '√2배', '2배', '4배'], answer: 2,
      why: '<p>½<i>kx</i><sub>max</sub>² = ½<i>mv</i><sub>0</sub>²이므로 <i>x</i><sub>max</sub> = <i>v</i><sub>0</sub>√(<i>m</i>/<i>k</i>)로 <i>v</i><sub>0</sub>에 비례한다. 에너지는 4배지만 에너지는 <i>x</i>²에 비례하므로 압축은 2배다.</p>' },
  ],
  6: [
    { q: `미는 힘 <i>F</i>(<i>x</i>) = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>), <i>F</i><sub>0</sub> = ${Pu.F0} N, <i>L</i> = ${f(Pu.L, 1)} m가 정지한 ${f(Pu.m, 1)} kg 상자에 작용한다. <i>x</i> = <i>L</i>에서 상자의 속력은 얼마인가?`,
      choices: [`${f(Math.sqrt(2 * Pu.F0 * Pu.L / Pu.m))} m/s`, `${f(Math.sqrt(Pu.W / Pu.m))} m/s`, `${f(Math.sqrt(2 * (Pu.F0 / 2) * Pu.L / Pu.m))} m/s`, `${f(v6)} m/s`], answer: 3,
      why: `<p>전개해서 적분한다:</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>F</i><sub>0</sub>(1 + <i>x</i>/<i>L</i> − 2<i>x</i>²/<i>L</i>²) d<i>x</i> = <i>F</i><sub>0</sub><i>L</i>(1 + ½ − ⅔) = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(Pu.W, 1)} J</div><div class="eq"><i>v</i> = √(2<i>W</i>/<i>m</i>) = √(2 × ${f(Pu.W, 1)} / ${f(Pu.m, 1)}) = ${f(v6)} m/s</div><p>${f(Math.sqrt(2 * Pu.F0 * Pu.L / Pu.m))} m/s는 미는 힘을 일정한 ${Pu.F0} N으로 본 값이고, ${f(Math.sqrt(2 * (Pu.F0 / 2) * Pu.L / Pu.m))} m/s는 양 끝값만 평균해 가운데의 불룩한 부분을 놓친 값이다.</p>` },
    { q: `서술형. 같은 미는 힘이 범위의 앞쪽 절반, 곧 <i>x</i> = 0에서 <i>x</i> = <i>L</i>/2까지 하는 일을 구하라. 이는 전체 ${f(Pu.W, 1)} J의 절반보다 큰가, 작은가? 그 이유는?`,
      solution: `<p>전개하면 <i>F</i> = <i>F</i><sub>0</sub>(1 + <i>x</i>/<i>L</i> − 2<i>x</i>²/<i>L</i>²). 항별로 적분한다:</p><div class="eq"><i>W</i> = <i>F</i><sub>0</sub>[<i>x</i> + <i>x</i>²/2<i>L</i> − 2<i>x</i>³/3<i>L</i>²]<sub>0</sub><sup><i>L</i>/2</sup> = <i>F</i><sub>0</sub><i>L</i>(½ + ⅛ − 1/12) = (13/24)<i>F</i><sub>0</sub><i>L</i></div><div class="eq"><i>W</i> = (13/24) × ${Pu.F0} × ${f(Pu.L, 1)} = ${f(Whalf, 1)} J</div><p>${f(Pu.W, 1)} J의 절반보다 크다. 미는 힘은 <i>x</i> = <i>L</i>/4에서 최대이므로 <i>F</i>(<i>x</i>) 아래 넓이가 앞쪽 절반에 몰려 있고, 뒤쪽 절반은 줄어드는 꼬리 부분만 얻는다.</p>` },
  ],
  7: [
    { q: `${f(Pd.L, 1)} m 줄에 매단 ${f(Pd.m, 1)} kg 추를 ${Pd.deg0}°에서 가만히 놓는다. 줄이 연직선과 20°를 이룰 때 추의 속력은 얼마인가?`,
      choices: [`${f(v7)} m/s`, `${f(Math.sqrt(2 * G * Pd.L * (1 - Math.cos(th7))))} m/s`, `${f(vb)} m/s`, `${f(vb / Math.SQRT2)} m/s`], answer: 0,
      why: `<p>두 각 사이의 높이 차만 중요하다: Δ<i>y</i> = <i>L</i>(cos 20° − cos ${Pd.deg0}°) = ${f(Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)), 3)} m.</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = √(2 × ${f(G)} × ${f(Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)), 3)}) = ${f(v7)} m/s</div><p>${f(Math.sqrt(2 * G * Pd.L * (1 - Math.cos(th7))))} m/s는 ${Pd.deg0}°에서 내려온 높이가 아니라 20°일 때 바닥에서의 높이를 쓴 값이다. 각이 절반이라고 에너지도 절반인 것은 아니다.</p>` },
    { q: '추가 가장 낮은 점을 지날 때 줄의 장력은 얼마인가?',
      choices: [`${f(Pd.m * G * Math.cos(Pd.th0))} N`, `${f(Pd.m * G)} N`, `${f(Tb)} N`, `${f(Pd.m * G - Pd.m * vb ** 2 / Pd.L)} N`], answer: 2,
      why: `<p>바닥에서 추는 <i>v</i> = ${f(vb)} m/s로 원을 따라 움직이므로 알짜힘은 위쪽, 곧 회전축을 향한다:</p><div class="eq"><i>T</i> − <i>mg</i> = <i>mv</i>²/<i>L</i> &nbsp;⇒&nbsp; <i>T</i> = ${f(Pd.m * G)} + ${f(Pd.m * vb ** 2 / Pd.L)} = ${f(Tb)} N</div><p><i>T</i> = <i>mg</i>는 추가 그곳에 정지해 있을 때만 맞다.</p>` },
  ],
  8: [
    { q: '입자가 퍼텐셜 에너지 <i>U</i>(<i>x</i>) = 3<i>x</i>² − 2<i>x</i>³ (<i>U</i>는 J, <i>x</i>는 m)를 가지고 <i>x</i> 축을 따라 움직인다. <i>x</i> = 2.0 m에서 입자에 작용하는 힘은 얼마인가?',
      choices: [`${f(-U8(x8), 1)} N`, `${f(-F8(x8), 1)} N`, `${f(U8(x8), 1)} N`, `+${f(F8(x8), 1)} N`], answer: 3,
      why: `<div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i> = −(6<i>x</i> − 6<i>x</i>²) = −(12 − 24) = +${f(F8(x8), 1)} N</div><p>그곳에서 <i>U</i>의 기울기는 음수(<i>U</i>가 +<i>x</i> 쪽으로 감소)이므로 힘은 +<i>x</i> 방향, 곧 내리막 쪽을 향한다. −${f(F8(x8), 1)} N은 마이너스 부호를 빠뜨린 값이고, ±${f(-U8(x8), 1)} N은 기울기가 아니라 <i>U</i> 자체를 쓴 값이다.</p>` },
    { q: '같은 <i>U</i>(<i>x</i>) = 3<i>x</i>² − 2<i>x</i>³에서 입자는 <i>x</i> = 0과 <i>x</i> = 1 m에서 평형을 이룰 수 있다. 각각 어떤 평형인가?',
      choices: ['둘 다 안정', '<i>x</i> = 0 불안정, <i>x</i> = 1 m 안정', '<i>x</i> = 0 안정, <i>x</i> = 1 m 불안정', '둘 다 불안정'], answer: 2,
      why: '<p><i>x</i> = 0과 1에서 d<i>U</i>/d<i>x</i> = 6<i>x</i> − 6<i>x</i>² = 0이다. 이계도함수가 결정한다: <i>U</i>″ = 6 − 12<i>x</i>는 <i>x</i> = 0에서 +6(골짜기, 안정), <i>x</i> = 1 m에서 −6(언덕, 불안정)이다.</p>' },
  ],
  9: [
    { q: `서술형. 결합 <i>U</i>(<i>r</i>) = ε[(<i>r</i><sub>0</sub>/<i>r</i>)¹² − 2(<i>r</i><sub>0</sub>/<i>r</i>)⁶], ε = ${f(B.eps / M.EV, 1)} eV, <i>r</i><sub>0</sub> = ${f(B.r0 * 1e9)} nm에 대해, <i>r</i><sub>0</sub>가 평형점임을 보이고, 용수철 상수 <i>k</i> = <i>U</i>″(<i>r</i><sub>0</sub>)와 ${f(B.m / M.AMU, 1)} u 원자의 작은 진동 주기를 구하라.`,
      solution: `<p>미분한다:</p><div class="eq"><i>U</i>′ = ε[−12<i>r</i><sub>0</sub>¹²/<i>r</i>¹³ + 12<i>r</i><sub>0</sub>⁶/<i>r</i>⁷]</div><p><i>r</i> = <i>r</i><sub>0</sub>에서 괄호 안은 −12/<i>r</i><sub>0</sub> + 12/<i>r</i><sub>0</sub> = 0이다: 힘이 없으므로 평형이다.</p><div class="eq"><i>U</i>″ = ε[156<i>r</i><sub>0</sub>¹²/<i>r</i>¹⁴ − 84<i>r</i><sub>0</sub>⁶/<i>r</i>⁸] &nbsp;⇒&nbsp; <i>U</i>″(<i>r</i><sub>0</sub>) = 72ε/<i>r</i><sub>0</sub>²</div><p>양수이므로 안정한 최솟값이다. ε = ${B.eps.toExponential(3).replace('e-', '×10<sup>−')}</sup> J, <i>r</i><sub>0</sub> = ${f(B.r0 * 1e9)}×10<sup>−9</sup> m를 대입하면:</p><div class="eq"><i>k</i> = 72 × ${f(B.eps * 1e19, 3)}×10<sup>−19</sup> / (${f(B.r0 * 1e9)}×10<sup>−9</sup>)² = ${f(kB, 0)} N/m</div><div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${f(B.m * 1e27, 3)}×10<sup>−27</sup> / ${f(kB, 0)}) = ${f(TB * 1e15, 1)} fs</div>` },
    { q: '퍼텐셜 우물 속 입자의 총에너지 <i>E</i>가 우물 가장자리보다 낮다. 어느 쪽 되돌이점에서든 성립하는 것은 무엇인가?',
      choices: ['속력이 0이고 입자에 작용하는 힘도 0이다', '속력이 최대이고 힘은 0이다', '퍼텐셜 에너지가 0이다', '속력이 0이고 힘은 우물 안쪽을 향한다'], answer: 3,
      why: '<p>되돌이점에서 <i>U</i> = <i>E</i>이므로 <i>K</i> = 0이고 입자는 멈춘다. 그러나 그곳에서 <i>U</i>는 기울어 있으므로(우물의 바닥이 아니라 벽이다) <i>F</i> = −d<i>U</i>/d<i>x</i> ≠ 0이며, 내리막 쪽, 곧 최솟값 쪽을 향한다. 그래서 입자가 방향을 바꾼다.</p>' },
  ],
  10: [
    { q: `이번에는 블록이 같은 바닥(μ<sub>k</sub> = ${f(Sl.mu)})에 ${f(Sl.v0, 1)} m/s 대신 ${f(v10, 1)} m/s로 미끄러져 들어온다. 블록은 얼마나 미끄러지는가?`,
      choices: [`${f(2 * Sl.d)} m`, `${f(d10)} m`, `${f(Sl.d)} m`, `${f(v10 ** 2 / (Sl.mu * G), 1)} m`], answer: 1,
      why: `<div class="eq">½<i>mv</i><sub>0</sub>² = μ<sub>k</sub><i>mgd</i> &nbsp;⇒&nbsp; <i>d</i> = <i>v</i><sub>0</sub>²/(2μ<sub>k</sub><i>g</i>) = ${f(v10, 1)}² / (2 × ${f(Sl.mu)} × ${f(G)}) = ${f(d10)} m</div><p>속력이 두 배면 운동 에너지가 네 배이므로 거리도 네 배다(전에는 ${f(Sl.d)} m 미끄러졌다). ${f(2 * Sl.d)} m는 <i>d</i> ∝ <i>v</i>인 것처럼 두 배로 한 값이다.</p>` },
    { q: `다시 ${f(Sl.v0, 1)} m/s(운동 에너지 ${f(Sl.E, 1)} J)로 돌아가자. 처음 ${f(x10, 1)} m를 미끄러지는 동안 마찰이 만든 열에너지는 얼마인가?`,
      choices: [`${f(Sl.E / 2)} J`, `${f(Sl.mu * G * x10)} J`, `${f(Q10)} J`, `${f(Sl.E)} J`], answer: 2,
      why: `<div class="eq"><i>E</i><sub>th</sub> = <i>f</i><i>d</i> = μ<sub>k</sub><i>mg</i> × <i>d</i> = ${f(Sl.mu)} × ${f(Sl.m, 1)} × ${f(G)} × ${f(x10, 1)} = ${f(Q10)} J</div><p>블록에는 아직 ${f(Sl.E - Q10)} J의 <i>K</i>가 남아 있다. ${f(Sl.mu * G * x10)} J는 질량을 빠뜨린 값이다.</p>` },
  ],
  11: [
    { q: `${m11} kg인 학생이 높이 ${f(h11, 1)} m의 계단을 ${f(t11, 1)} s 동안 일정한 속력으로 뛰어 올라간다. 학생이 자기 몸을 들어 올리는 데 내는 평균 일률은 얼마인가?`,
      choices: [`${f(m11 * h11 / t11, 1)} W`, `${f(P11, 0)} W`, `${f(m11 * G * h11, 0)} W`, `${f(m11 * G * h11 * t11, 0)} W`], answer: 1,
      why: `<div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>mgh</i>/<i>t</i> = ${m11} × ${f(G)} × ${f(h11, 1)} / ${f(t11, 1)} = ${f(P11, 0)} W</div><p>${f(m11 * G * h11, 0)}은 줄 단위의 일이지 일률이 아니다. ${f(m11 * h11 / t11, 1)} W는 무게 대신 질량을 쓴 값이다.</p>` },
    { q: '크레인이 상자를 일정한 속력 0.5 m/s로 높이 <i>h</i>만큼 들어 올린 뒤, 똑같은 상자를 일정한 속력 1.0 m/s로 같은 높이만큼 들어 올린다. 느린 경우와 비교해 빠른 경우에 필요한 것은?',
      choices: ['두 배의 일과 두 배의 일률', '같은 일과 같은 일률', '같은 일과 두 배의 일률', '절반의 일과 두 배의 일률'], answer: 2,
      why: '<p>일정한 속력이면 어느 경우든 케이블은 <i>mg</i>로 당기므로 일 <i>mgh</i>는 같다. 빠른 경우는 절반의 시간이 걸리므로 <i>P</i> = <i>W</i>/<i>t</i> = <i>Fv</i>는 두 배가 된다.</p>' },
  ],
};
