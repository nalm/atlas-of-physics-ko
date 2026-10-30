// oscillations/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, TAU = 2 * Math.PI;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);

// 1 · Hooke: the block at x = −0.20 m and at +0.25 m
const x1 = -0.20, x1b = 0.25;
// 2 · speed at x = 0.30 m
const x2 = 0.30, v2 = M.W * Math.sqrt(M.A ** 2 - x2 ** 2);
// 3 · energy at x = A/2
const K3 = 0.5 * M.K * (M.A ** 2 - (M.A / 2) ** 2);
// 4 · a 0.50 kg block on the same spring; the 1.0 kg block's spring force at the bottom
const m4 = 0.50, d4 = m4 * G / M.K, Fbot = M.K * (M.D + M.HANG.A);
// 5 · the 1.5 m pendulum on the Moon; its fastest speed
const gMoon = 1.62, Tmoon = TAU * Math.sqrt(M.PEND.L / gMoon), vmax5 = M.vmaxPendulum(M.PEND.L, M.PEND.th0);
// 6 · doubling the period; a pendulum for 3.0 s
const k6 = M.K / 4, T6 = 3.0, L6 = G * (T6 / TAU) ** 2, TL = M.periodPendulum(M.DOUBLE.L);
// 8 · the pushed start (Physics C)
const St = M.STARTS[1], t8 = (Math.PI / 2 - St.phi) / M.W;
// 9 · the rod and the hoop (Physics C)
const R = M.ROD, H = M.HOOP;
// 10 · the torsion pendulum (Physics C)
const Ts = M.TORS, wT = TAU / Ts.T;
// 11 · the car with 300 kg aboard; the swing
const C = M.CAR, m11 = C.m + 300, T11 = M.periodSpring(m11, C.k), Sw = M.SWING;

export const PRACTICE = {
  0: [
    { q: `블록이 진폭 <i>A</i> = ${f(M.A)} m로 진동한다. 한 주기 동안 블록이 이동하는 거리는 얼마인가?`,
      choices: ['0 m', `${f(M.A)} m`, `${f(2 * M.A)} m`, `${f(4 * M.A)} m`], answer: 3,
      why: `<p>+<i>A</i>에서 −<i>A</i>까지가 2<i>A</i>이고, 되돌아오는 데 또 2<i>A</i>이므로 4<i>A</i> = ${f(4 * M.A)} m이다. 한 주기 동안의 <i>변위</i>는 출발한 곳에서 끝나므로 0이다.</p>` },
    { q: `주기가 ${f(M.T0, 3)} s이다. 진동수는 얼마인가?`,
      choices: [`${f(M.T0)} Hz`, `${f(M.F0, 3)} Hz`, `${f(M.W)} Hz`, `${f(1 / M.W, 3)} Hz`], answer: 1,
      why: `<div class="eq"><i>f</i> = 1/<i>T</i> = 1/${f(M.T0, 3)} = ${f(M.F0, 3)} Hz</div><p>${f(M.W)}는 rad/s 단위의 ω = 2π<i>f</i>, 곧 각진동수이며 1초당 왕복 횟수가 아니다.</p>` },
  ],
  1: [
    { q: `평형 위치의 오른쪽을 +로 잡는다. 블록(<i>k</i> = ${M.K} N/m)이 <i>x</i> = ${f(x1)} m에 있다. 블록에 작용하는 용수철 힘은 얼마인가?`,
      choices: [`${sg(-M.K * x1)} N`, `${sg(M.K * x1)} N`, `${sg(-M.K / x1, 1)} N`, `${sg(-0.5 * M.K * x1)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i> = −${M.K} × (${f(x1)}) = ${sg(-M.K * x1)} N</div><p>왼쪽으로 압축된 용수철은 평형 쪽인 오른쪽으로 민다. ${sg(M.K * x1)} N은 음의 부호를 빠뜨린 값이다.</p>` },
    { q: `<i>x</i> = ${sg(x1b)} m에서 ${f(M.M1, 1)} kg 블록의 가속도는 얼마인가?`,
      choices: [`${sg(M.K * x1b / M.M1)} m/s²`, `${sg(-M.W * x1b)} m/s²`, `${sg(-M.AMAX)} m/s²`, `${sg(-M.K * x1b / M.M1)} m/s²`], answer: 3,
      why: `<div class="eq"><i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i> = −(${M.K}/${f(M.M1, 1)}) × ${f(x1b)} = ${sg(-M.K * x1b / M.M1)} m/s²</div><p>가속도는 일정하지 않다. ${sg(-M.AMAX)} m/s²는 <i>x</i> = +<i>A</i>에서만의 값이다. −ω<i>x</i>는 ω를 제곱하는 것을 잊은 값이다.</p>` },
  ],
  2: [
    { q: '블록이 <i>x</i> = +<i>A</i>에 있는 순간,',
      choices: ['<i>v</i> = 0이고 <i>a</i> = 0', '<i>v</i>가 최대이고 <i>a</i> = 0', '<i>v</i> = 0이고 <i>a</i>가 최대, −<i>x</i> 방향', '<i>v</i> = 0이고 <i>a</i>가 최대, +<i>x</i> 방향'], answer: 2,
      why: '<p>그 순간 <i>x</i>–<i>t</i> 그래프는 꼭대기에 있어 기울기가 0이므로 <i>v</i> = 0이다. 그리고 <i>a</i> = −ω²<i>x</i>는 크기가 최대이며 평형 쪽인 −<i>x</i> 방향을 향한다.</p>' },
    { q: `<i>A</i> = ${f(M.A)} m, ω = ${f(M.W, 1)} rad/s일 때, <i>x</i> = ${f(x2)} m에서 블록의 속력은 얼마인가?`,
      choices: [`${f(M.VMAX)} m/s`, `${f(M.W * x2)} m/s`, `${f(v2)} m/s`, `${f(M.W * (M.A - x2))} m/s`], answer: 2,
      why: `<p>에너지에서 ½<i>mv</i>² = ½<i>k</i>(<i>A</i>² − <i>x</i>²)이므로</p><div class="eq"><i>v</i> = ω√(<i>A</i>² − <i>x</i>²) = ${f(M.W, 1)} × √(${f(M.A ** 2)} − ${f(x2 ** 2)}) = ${f(v2)} m/s</div><p>${f(M.VMAX)} m/s는 <i>x</i> = 0에서만의 속력이다.</p>` },
  ],
  3: [
    { q: `전체 에너지가 ½<i>kA</i>² = ${f(M.E)} J이다. <i>x</i> = <i>A</i>/2에서 블록의 운동 에너지는 얼마인가?`,
      choices: [`${f(M.E / 2)} J`, `${f(K3)} J`, `${f(M.E - K3)} J`, `${f(M.E)} J`], answer: 1,
      why: `<div class="eq"><i>U</i> = ½<i>k</i>(<i>A</i>/2)² = ¼ × ½<i>kA</i>² = ${f(M.E - K3)} J &nbsp;⇒&nbsp; <i>K</i> = ${f(M.E)} − ${f(M.E - K3)} = ${f(K3)} J</div><p>절반만큼 나갔다고 에너지가 절반인 것은 아니다. <i>U</i>는 <i>x</i>²에 비례해 커진다. ${f(M.E - K3)} J은 용수철의 몫이다.</p>` },
    { q: '진폭을 두 배로 하면, 전체 에너지와 최대 속력은',
      choices: ['에너지 ×2, 최대 속력 ×2', '에너지 ×4, 최대 속력 ×2', '에너지 ×4, 최대 속력 ×4', '에너지 ×2, 최대 속력 ×√2'], answer: 1,
      why: '<p><i>E</i> = ½<i>kA</i>²는 4배가 된다. <i>v</i><sub>max</sub> = ω<i>A</i>이고 ω = √(<i>k</i>/<i>m</i>)는 변하지 않으므로 최대 속력은 2배가 된다(운동 에너지 4배 ⇒ 속력 2배).</p>' },
  ],
  4: [
    { q: `같은 ${M.K} N/m 용수철에 ${f(m4)} kg 블록을 매단다. 새 평형 위치까지 용수철은 얼마나 늘어나는가?`,
      choices: [`${f(m4 / M.K, 4)} m`, `${f(M.D, 3)} m`, `${f(M.K / (m4 * G), 2)} m`, `${f(d4, 3)} m`], answer: 3,
      why: `<div class="eq"><i>kd</i> = <i>mg</i> &nbsp;⇒&nbsp; <i>d</i> = ${f(m4)} × ${f(G)} / ${M.K} = ${f(d4, 3)} m</div><p>질량이 절반이면 처짐도 절반이다(${f(M.D, 3)} m는 ${f(M.M1, 1)} kg일 때였다). ${f(m4 / M.K, 4)} m는 <i>g</i>를 빠뜨려 무게 대신 질량을 쓴 값이고, ${f(M.K / (m4 * G), 2)} m는 공식을 거꾸로 쓴 값이다.</p>` },
    { q: `${f(M.M1, 1)} kg 블록이 평형 위치(처짐 ${f(M.D, 3)} m)를 중심으로 ${f(M.HANG.A)} m 진폭으로 위아래로 진동한다. 가장 낮은 점에서 용수철이 블록에 작용하는 힘은 얼마인가?`,
      choices: [`${f(M.WEIGHT)} N`, `${f(Fbot)} N`, `${f(M.K * M.HANG.A)} N`, `${f(M.K * (M.D - M.HANG.A))} N`], answer: 1,
      why: `<p>가장 낮은 점에서 용수철은 <i>d</i> + <i>A</i> = ${f(M.D + M.HANG.A, 4)} m 늘어나 있다.</p><div class="eq"><i>F</i><sub>s</sub> = <i>k</i>(<i>d</i> + <i>A</i>) = ${M.K} × ${f(M.D + M.HANG.A, 4)} = ${f(Fbot)} N</div><p>무게보다 ${f(M.K * M.HANG.A)} N 크므로, 알짜힘 ${f(M.K * M.HANG.A)} N이 위쪽, 곧 평형 쪽으로 작용한다. ${f(M.K * (M.D - M.HANG.A))} N은 가장 높은 점에서의 힘이다.</p>` },
  ],
  5: [
    { q: `${f(M.PEND.L, 1)} m 진자(지구에서 주기 ${f(M.P_T)} s)를 <i>g</i> = ${f(gMoon)} m/s²인 달로 가져간다. 달에서의 주기는 얼마인가?`,
      choices: [`${f(Tmoon)} s`, `${f(M.P_T)} s`, `${f(M.P_T * G / gMoon, 1)} s`, `${f(M.P_T * Math.sqrt(gMoon / G), 3)} s`], answer: 0,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(M.PEND.L, 1)}/${f(gMoon)}) = ${f(Tmoon)} s</div><p>중력이 약하면 느리게 흔들리지만, 그 배율은 √(${f(G)}/${f(gMoon)}) = ${f(Math.sqrt(G / gMoon))}일 뿐이다. 비 ${f(G)}/${f(gMoon)} = ${f(G / gMoon)}를 그대로 곱하면 ${f(M.P_T * G / gMoon, 1)} s가 된다.</p>` },
    { q: `같은 진자를 ${(M.PEND.th0 / M.DEG).toFixed(0)}°에서 가만히 놓는다. 가장 낮은 점에서 추의 속력은 얼마인가?`,
      choices: [`${f(Math.sqrt(2 * G * M.PEND.L * Math.sin(M.PEND.th0)))} m/s`, `${f(Math.sqrt(2 * G * M.PEND.L))} m/s`, `${f(Math.sqrt(G * M.PEND.L * (1 - Math.cos(M.PEND.th0))), 3)} m/s`, `${f(vmax5, 3)} m/s`], answer: 3,
      why: `<p>추가 내려오는 높이는 Δ<i>y</i> = <i>L</i>(1 − cos θ<sub>0</sub>) = ${f(M.PEND.L * (1 - Math.cos(M.PEND.th0)) * 100, 2)} cm이다.</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = ${f(vmax5, 3)} m/s</div><p>√(2<i>gL</i>)이 되려면 줄 길이 전체만큼 내려와야 한다. sin θ<sub>0</sub>은 높이가 아니라 수평 거리를 준다.</p>` },
  ],
  6: [
    { q: `${M.K} N/m 용수철에 달린 ${f(M.DOUBLE.m, 1)} kg 블록의 주기는 ${f(M.periodSpring(M.DOUBLE.m, M.K))} s이다. 주기를 두 배로 만드는 용수철 상수는 얼마인가?`,
      choices: [`${f(M.K / 2, 1)} N/m`, `${f(2 * M.K, 1)} N/m`, `${f(k6, 1)} N/m`, `${f(4 * M.K, 1)} N/m`], answer: 2,
      why: `<p><i>T</i> ∝ 1/√<i>k</i>이다. 2<i>T</i>가 되려면 √(<i>k</i><sub>new</sub>)가 √<i>k</i>의 절반이어야 하므로 <i>k</i><sub>new</sub> = <i>k</i>/4 = ${f(k6, 1)} N/m이다. <i>k</i>를 절반으로 하면 주기는 √2배가 될 뿐이고, 더 뻣뻣한 용수철은 주기를 짧게 한다.</p>` },
    { q: `${f(M.DOUBLE.L)} m 진자의 주기는 ${f(TL)} s이다. 주기가 ${f(T6, 1)} s가 되려면 길이가 얼마여야 하는가?`,
      choices: [`${f(M.DOUBLE.L * T6 / TL)} m`, `${f(G * T6 / TAU)} m`, `${f(G * T6 ** 2 / 4, 1)} m`, `${f(L6)} m`], answer: 3,
      why: `<div class="eq"><i>L</i> = <i>g</i>(<i>T</i>/2π)² = ${f(G)} × (${f(T6, 1)}/2π)² = ${f(L6)} m</div><p>비례로 풀어도 된다. <i>L</i> ∝ <i>T</i>²이므로 ${f(M.DOUBLE.L)} × (${f(T6, 1)}/${f(TL)})² = ${f(L6)} m이다. <i>L</i>에 시간의 비를 그대로 곱하면 ${f(M.DOUBLE.L * T6 / TL)} m가 된다.</p>` },
  ],
  7: [
    { q: '수평 용수철에 달린 블록을 두 배 멀리 당겼다가 놓는다. 이전과 비교하면 주기와 최대 속력은',
      choices: ['주기는 같고, 최대 속력은 두 배', '주기는 두 배, 최대 속력은 같음', '둘 다 같음', '주기 ×√2, 최대 속력은 두 배'], answer: 0,
      why: '<p><i>T</i> = 2π√(<i>m</i>/<i>k</i>)에는 <i>A</i>가 없다. 거리도 두 배, 힘도 두 배, 가속도도 두 배이므로 같은 시간에 두 배의 거리를 간다. 따라서 <i>v</i><sub>max</sub> = ω<i>A</i>는 두 배가 된다.</p>' },
    { q: '단진자 시계의 주기를 바꾸는 것은 어느 것인가?',
      choices: ['네 배 무거운 추', '8° 대신 4°로 흔들기', '달로 옮기기', '정지 상태 대신 밀어서 출발시키기'], answer: 2,
      why: '<p><i>T</i> = 2π√(<i>L</i>/<i>g</i>)는 <i>L</i>과 <i>g</i>에만 달려 있다. 질량은 약분되고(<i>ma</i> = −<i>mg</i> sin θ), 작은 진폭은 모두 같은 주기를 주며, 밀어 주면 진폭만 바뀐다.</p>' },
  ],
  8: [
    { q: `${M.K} N/m 용수철에 달린 ${f(M.M1, 1)} kg 블록이 <i>x</i><sub>0</sub> = ${f(St.x0)} m에서 <i>v</i><sub>0</sub> = ${f(St.v0, 1)} m/s로 출발한다. 진폭은 얼마인가?`,
      choices: [`${f(St.A, 3)} m`, `${f(St.x0, 3)} m`, `${f(St.x0 + Math.abs(St.v0) / M.W, 3)} m`, `${f(Math.hypot(St.x0, St.v0), 3)} m`], answer: 0,
      why: `<p>ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s. 에너지에서 ½<i>kA</i>² = ½<i>kx</i><sub>0</sub>² + ½<i>mv</i><sub>0</sub>²이므로</p><div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) = √(${f(St.x0)}² + ${f(Math.abs(St.v0) / M.W)}²) = ${f(St.A, 3)} m</div><p>밀어 준 만큼 에너지가 더해지므로 <i>A</i> &gt; <i>x</i><sub>0</sub>이다. 두 부분은 그대로가 아니라 제곱으로 더해진다. √(<i>x</i><sub>0</sub>² + <i>v</i><sub>0</sub>²)는 m와 m/s를 섞은 값이다.</p>` },
    { q: `서술형. <i>x</i> = <i>A</i> cos(ω<i>t</i> + φ)가 <i>m</i> d²<i>x</i>/d<i>t</i>² = −<i>kx</i>의 해임을 보여라. 위의 밀어서 출발한 블록에 대해 φ와, 처음으로 <i>x</i> = 0을 지나는 시각을 구하라.`,
      solution: `<p>두 번 미분한다. d<i>x</i>/d<i>t</i> = −<i>A</i>ω sin(ω<i>t</i> + φ), d²<i>x</i>/d<i>t</i>² = −<i>A</i>ω² cos(ω<i>t</i> + φ) = −ω²<i>x</i>. ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s이면 모든 <i>t</i>에서 이 값은 −(<i>k</i>/<i>m</i>)<i>x</i>와 같다.</p><p><i>t</i> = 0에서 <i>A</i> cos φ = ${f(St.x0)} m, −<i>A</i>ω sin φ = ${f(St.v0, 1)} m/s이므로, cos φ &gt; 0인 조건에서 tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub> = ${f(-St.v0 / (M.W * St.x0), 3)}이다.</p><div class="eq">φ = ${f(St.phi / M.DEG, 1)}° = ${f(St.phi, 3)} rad, &nbsp; <i>A</i> = ${f(St.A, 3)} m</div><p>처음으로 <i>x</i> = 0에 이르는 것은 ω<i>t</i> + φ = π/2일 때다.</p><div class="eq"><i>t</i> = (π/2 − φ)/ω = (${f(Math.PI / 2, 3)} − ${f(St.phi, 3)})/${f(M.W, 1)} = ${f(t8, 3)} s</div><p>4분의 1 주기(${f(M.T0 / 4, 3)} s)보다 이른데, 더 가까운 곳에서 이미 평형 쪽으로 움직이며 출발하기 때문이다.</p>` },
  ],
  9: [
    { q: `길이 ${f(R.L, 1)} m인 균일한 막대가 한쪽 끝을 축으로 흔들린다. 작게 흔들릴 때 주기는 얼마인가?`,
      choices: [`${f(M.periodPendulum(R.L))} s`, `${f(M.periodPendulum(R.L / 2))} s`, `${f(R.T)} s`, `${f(M.periodPhysical(R.m, R.d, R.Icm))} s`], answer: 2,
      why: `<p>끝에 대한 <i>I</i> = <i>I</i><sub>cm</sub> + <i>m</i>(<i>L</i>/2)² = <i>mL</i>²/12 + <i>mL</i>²/4 = <i>mL</i>²/3이고, <i>d</i> = <i>L</i>/2이다.</p><div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>) = 2π√(2<i>L</i>/3<i>g</i>) = ${f(R.T)} s</div><p>${f(M.periodPendulum(R.L / 2))} s는 막대를 질량 중심에 있는 추로 본 값이고, ${f(M.periodPhysical(R.m, R.d, R.Icm))} s는 회전축에 대한 <i>I</i> 대신 <i>I</i><sub>cm</sub>을 쓴 값이다.</p>` },
    { q: `서술형. 반지름 <i>R</i> = ${f(H.R)} m인 얇은 고리가 테두리로 못에 걸려 있다. 못에 대한 관성 모멘트를 구하고, 고리 평면 안에서 작게 흔들릴 때의 운동 방정식을 쓰고, 주기를 구하라.`,
      solution: `<p>중심에 대해 고리의 모든 부분은 거리 <i>R</i>에 있다. <i>I</i><sub>cm</sub> = ∫<i>R</i>² d<i>m</i> = <i>mR</i>². 못은 중심에서 <i>d</i> = <i>R</i>만큼 떨어져 있으므로 평행축 정리에 따라 <i>I</i> = <i>mR</i>² + <i>mR</i>² = 2<i>mR</i>²이다.</p><p>중력은 중심에 작용한다. τ = −<i>mgR</i> sin θ ≈ −<i>mgR</i>θ. τ = <i>I</i>α를 쓰면</p><div class="eq">d²θ/d<i>t</i>² = −(<i>mgR</i>/2<i>mR</i>²)θ = −(<i>g</i>/2<i>R</i>)θ</div><p>질량과 무관하게 ω = √(<i>g</i>/2<i>R</i>)인 SHM이다.</p><div class="eq"><i>T</i> = 2π√(2<i>R</i>/<i>g</i>) = 2π√(${f(2 * H.R)}/${f(G)}) = ${f(H.T)} s</div><p>길이가 고리의 지름(${f(2 * H.R)} m)과 같은 단진자와 같다.</p>` },
  ],
  10: [
    { q: `철사에 매단 ${f(Ts.M, 1)} kg 원판의 주기가 ${f(Ts.T)} s이다. 이를 질량은 같고 반지름이 두 배인 원판으로 바꾼다. 새 주기는 얼마인가?`,
      choices: [`${f(Ts.T)} s`, `${f(Ts.T * Math.SQRT2)} s`, `${f(2 * Ts.T)} s`, `${f(4 * Ts.T, 1)} s`], answer: 2,
      why: `<p>반지름이 두 배면 <i>I</i> = ½<i>MR</i>²는 4배가 되고, <i>T</i> = 2π√(<i>I</i>/κ)는 √4 = 2배가 되어 ${f(2 * Ts.T)} s이다. 철사가 같으므로 κ도 같다.</p>` },
    { q: `서술형. 원판(<i>I</i> = ${f(Ts.I, 3)} kg·m², κ = ${Ts.kappa} N·m/rad)을 ${(Ts.th0 / M.DEG).toFixed(0)}° 비틀었다가 가만히 놓는다. θ(<i>t</i>)를 쓰고, 최대 돌림힘과 최대 각속력을 구하라.`,
      solution: `<p><i>I</i> d²θ/d<i>t</i>² = −κθ이므로 θ = θ<sub>0</sub> cos(ω<i>t</i>)이다. 여기서 ω = √(κ/<i>I</i>) = √(${Ts.kappa}/${f(Ts.I, 3)}) = ${f(wT, 3)} rad/s, θ<sub>0</sub> = ${(Ts.th0 / M.DEG).toFixed(0)}° = ${f(Ts.th0, 3)} rad이다(정지 상태에서 놓았으므로 φ = 0). 작은 각 근사는 필요 없다. τ = −κθ는 얼마나 비틀든 성립한다.</p><div class="eq">|τ|<sub>max</sub> = κθ<sub>0</sub> = ${Ts.kappa} × ${f(Ts.th0, 3)} = ${f(Ts.kappa * Ts.th0, 3)} N·m &nbsp;(양 끝에서)</div><div class="eq">|dθ/d<i>t</i>|<sub>max</sub> = θ<sub>0</sub>ω = ${f(Ts.th0, 3)} × ${f(wT, 3)} = ${f(Ts.th0 * wT, 2)} rad/s &nbsp;(θ = 0을 지날 때)</div><p>θ는 반드시 라디안 단위여야 한다. 돌림힘 법칙과 ω 모두 이를 전제로 한다.</p>` },
  ],
  11: [
    { q: `${C.m} kg 자동차가 용수철 위에서 주기 ${f(C.T, 3)} s로 출렁인다(충격 흡수 장치는 끔). 모두 합쳐 300 kg인 승객이 탄다. 새 주기는 얼마인가?`,
      choices: [`${f(C.T, 3)} s`, `${f(C.T * m11 / C.m, 3)} s`, `${f(C.T * Math.sqrt(C.m / m11), 3)} s`, `${f(T11, 3)} s`], answer: 3,
      why: `<div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${m11}/${C.k}) = ${f(T11, 3)} s</div><p>차가 무거워지면 느리게 출렁이지만, 그 배율은 질량의 비 자체가 아니라 √(${m11}/${C.m}) = ${f(Math.sqrt(m11 / C.m), 3)}이다.</p>` },
    { q: `${f(Sw.L, 1)} m 그네에 탄 아이를 한 번 흔들릴 때마다(한 주기에 한 번) 밀어 주려면, 밀어 주는 간격은 얼마여야 하는가?`,
      choices: [`${f(Sw.T / 2)} s`, `${f(Sw.T)} s`, `${f(TAU * Math.sqrt(G / Sw.L), 1)} s`, `${f(Math.sqrt(Sw.L / G), 3)} s`], answer: 1,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(Sw.L, 1)}/${f(G)}) = ${f(Sw.T)} s</div><p>아이는 한 주기에 한 번 손으로 돌아온다. 그 절반인 ${f(Sw.T / 2)} s에는 아이가 반대쪽 끝에 있다. 아이의 질량과 (작은) 진폭은 상관없다.</p>` },
  ],
};
