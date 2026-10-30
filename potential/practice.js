// potential/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const s = x => (x < 0 ? '−' : x > 0 ? '+' : '') + Math.abs(x);   // signed, with a real minus
const K = M.K, nC = M.nC;

// ---- page 0: the page's pair brought from 40 cm to 10 cm ----
const { q1, q2, r0, r1 } = M.PAIR;
const P0 = { W: K * q1 * q2 * (1 / r1 - 1 / r0) };
P0.nums = [K * q1 * q2 / r1, P0.W, K * q1 * q2 / r1 ** 2 * (r0 - r1), K * q1 * q2 / (r0 - r1)].map(x => x * 1e6);   // from ∞ · right · F(r₁)Δr · 1/Δr
// ---- page 1: the page's square; charging a sphere ----
const P1 = { U: M.SQ.U, a: M.SQ.a, q: M.SQ.q };
P1.nums = [4 * K * P1.q ** 2 / P1.a, 2 * P1.U, P1.U, (4 + 2 * Math.SQRT2) * K * P1.q ** 2 / P1.a].map(x => x * 1e6);   // sides only · every pair twice · right · diagonal a/√2
const P1b = { Q: 2 * nC, R: 0.15 };
P1b.U = K * P1b.Q ** 2 / (2 * P1b.R);
P1b.nums = [2 * P1b.U, P1b.U / 2, P1b.U, P1b.U / P1b.R].map(x => x * 1e6);   // Q × final V · ¼ · right · extra 1/R
// ---- page 2: the page's A → C; E = 3x² ----
const P2 = { W: -M.UNI.q * (M.Vuni(M.UNI.C) - M.Vuni(M.UNI.A)) };
P2.L = Math.hypot(M.UNI.C[0] - M.UNI.A[0], M.UNI.C[2] - M.UNI.A[2]);
P2.nums = [-P2.W, 0, M.UNI.q * M.UNI.E * P2.L, P2.W].map(x => x * 1e9);   // sign · "path ⟂ somewhere" · full length · right
const P2b = { c: 3, x: 2 };
P2b.dV = -P2b.c * P2b.x ** 3 / 3;
P2b.nums = [-P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x, P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x / 2];   // sign · E(x)·x · right · mean of end fields
// ---- page 3: the page's hill where V = 90 V; V = 3x²y − y³ ----
const P3 = { V: 90 };
P3.r = K * M.HILL.Q / P3.V;
P3.E = P3.V / P3.r;
P3.nums = [P3.V, P3.E, P3.E / 2, 2 * P3.E];
const P3b = { x: 1, y: 2 };
P3b.Ex = -6 * P3b.x * P3b.y; P3b.Ey = -(3 * P3b.x ** 2 - 3 * P3b.y ** 2);
P3b.E = Math.hypot(P3b.Ex, P3b.Ey);
P3b.nums = [Math.abs(P3b.Ex) + Math.abs(P3b.Ey), Math.abs(P3b.Ex), P3b.E, Math.abs(P3b.Ey)];
// ---- page 4: the page's dipole at P ----
const P4 = { V: M.VdipAxis(M.DIP.axisX) };
P4.nums = [-P4.V, 0, P4.V, -2 * M.DIP.a * K * M.DIP.q / M.DIP.axisX ** 2];   // sign · bisector habit · right · far-field
// ---- page 5: the page's rod at a = 10 cm ----
const { L: rL, Q: rQ, lam: rlam } = M.ROD;
const P5 = { a: 0.10 };
P5.V = M.VrodAxis(P5.a);
P5.nums = [K * rQ / P5.a, K * rQ / (P5.a + rL / 2), K * rlam * Math.log10((P5.a + rL) / P5.a), P5.V];   // all at the end · all at the middle · log₁₀ · right
P5.E = K * rQ / (P5.a * (P5.a + rL));
P5.nums2 = [P5.E, P5.V / P5.a, K * rQ / P5.a ** 2, K * rlam / P5.a];   // right · V/a · point at the end · kλ/a
// ---- page 6: the page's ring at z = 20 cm; the half-ring's field at its centre ----
const P6 = { z: 0.20 };
P6.V = M.Vring(P6.z);
P6.nums = [K * M.RING.Q / P6.z, P6.V, K * M.RING.Q * P6.z / (M.RING.R ** 2 + P6.z ** 2) ** 1.5, K * M.RING.Q / M.RING.R];   // point · right · that's E · centre
const P6b = { E: 2 * K * M.ARC.Q / (Math.PI * M.ARC.R ** 2) };
P6b.nums = [K * M.ARC.Q / M.ARC.R ** 2, P6b.E / 2, P6b.E, 0];   // as a point · lost 2 · right · ring symmetry
// ---- page 7: the page's insulating sphere at R/2; two connected spheres ----
const P7 = { r: M.SPH.R / 2 };
P7.V = M.Vins(P7.r);
P7.nums = [K * M.SPH.Q / P7.r, P7.V, M.Vcond(P7.r), M.Vins(0)];   // point · right · conductor · centre
const P7b = { nums: [1 / 3, 3, 1, 1 / 9] };
// ---- page 8: the page's proton; an electron falling toward +1 nC ----
const P8 = { v: M.ACC.vp };
P8.nums = [Math.sqrt(M.E_CH * M.ACC.dV / M.M_P), M.speed(M.E_CH, M.ACC.Vhi, M.M_P), P8.v, M.speed(M.E_CH, M.ACC.dV, M.M_E)].map(v => v / 1e3);   // lost 2 · used 7 V · right · electron
const P8b = { Q: 1 * nC, ra: 0.10, rb: 0.05 };
P8b.dV = K * P8b.Q * (1 / P8b.rb - 1 / P8b.ra);
P8b.v = M.speed(M.E_CH, P8b.dV, M.M_E);
P8b.nums = [M.speed(M.E_CH, K * P8b.Q / P8b.rb, M.M_E), P8b.v, P8b.v / Math.SQRT2, M.speed(M.E_CH, P8b.dV, M.M_P)].map(v => v / 1e6);   // V at the end only · right · lost 2 · proton mass

const frac = x => ({ [1 / 3]: '1/3', 3: '3', 1: '1', [1 / 9]: '1/9' })[x];

export const PRACTICE = {
  0: [
    { q: `본문의 +${q2 / nC} nC 전하를 고정된 +${q1 / nC} nC 전하로부터 ${p(r0 * 100, 0)} cm 거리에서 ${p(r1 * 100, 0)} cm 거리까지 데려오려면(처음과 끝 모두 정지 상태) 얼마의 일을 해야 하는가?`,
      choices: P0.nums.map(x => `${p(x, 3)} μJ`), answer: 1, nums: P0.nums,
      why: `<p>가까워질수록 커지는 <i>F</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>²를 거슬러 밀어야 하므로 적분한다.</p><div class="eq"><i>W</i> = −∫<sub><i>r</i><sub>0</sub></sub><sup><i>r</i><sub>1</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>0</sub>) = Δ<i>U</i> = ${p(P0.W * 1e6, 3)} μJ</div><p><i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i><sub>1</sub>(${p(P0.nums[0], 3)} μJ)은 ${p(r0 * 100, 0)} cm가 아니라 무한히 먼 곳에서 데려올 때의 일이다.</p>` },
    { q: '두 입자가 퍼텐셜 에너지 <i>U</i>(<i>r</i>) = <i>A</i>/<i>r</i>² − <i>B</i>/<i>r</i> (<i>A</i>, <i>B</i> &gt; 0)로 상호작용한다. 둘 사이의 힘이 0이 되는 거리는 얼마인가?',
      choices: ['<i>A</i>/<i>B</i>', '√(<i>A</i>/<i>B</i>)', '<i>B</i>/2<i>A</i>', '2<i>A</i>/<i>B</i>'], answer: 3,
      why: '<p><i>F</i> = −d<i>U</i>/d<i>r</i>이므로 기울기를 0으로 놓는다.</p><div class="eq">d<i>U</i>/d<i>r</i> = −2<i>A</i>/<i>r</i>³ + <i>B</i>/<i>r</i>² = 0 &nbsp;→&nbsp; <i>r</i> = 2<i>A</i>/<i>B</i></div><p><i>A</i>/<i>B</i>는 기울기가 아니라 <i>U</i> = 0이 되는 곳이다. 2<i>A</i>/<i>B</i>에서 <i>U</i>가 최소이므로 이 거리는 안정하다.</p>' },
  ],
  1: [
    { q: `본문의 +${P1.q / nC} nC 전하 네 개가 한 변이 ${p(P1.a * 100, 0)} cm인 정사각형의 꼭짓점에 놓여 있다. 이 집단의 전기 퍼텐셜 에너지는 얼마인가?`,
      choices: P1.nums.map(x => `${p(x, 3)} μJ`), answer: 2, nums: P1.nums,
      why: `<p>쌍은 여섯 개다. 네 변은 <i>a</i>, 두 대각선은 √2<i>a</i>.</p><div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = (4 + √2)<i>kq</i>²/<i>a</i> = ${p(P1.U * 1e6, 3)} μJ</div><p>각 전하의 <i>qV</i>를 모두 더하면 모든 쌍을 두 번 세게 된다(${p(P1.nums[1], 3)} μJ). 대각선은 <i>a</i>/√2가 아니라 √2<i>a</i>이다.</p>` },
    { q: `반지름 ${p(P1b.R * 100, 0)} cm인 금속 구에 아주 작은 전하 d<i>q</i>를 무한히 먼 곳에서 하나씩 데려와 ${p(P1b.Q / nC, 1)} nC로 대전시킨다. 필요한 전체 일은 얼마인가?`,
      choices: P1b.nums.map(x => `${p(x, 3)} μJ`), answer: 2, nums: P1b.nums,
      why: `<p>구가 <i>q</i>를 가지고 있을 때 전위는 <i>kq</i>/<i>R</i>이고, d<i>q</i>를 데려오는 데 (<i>kq</i>/<i>R</i>) d<i>q</i>가 든다.</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>Q</i></sup> (<i>kq</i>/<i>R</i>) d<i>q</i> = <i>kQ</i>²/2<i>R</i> = ${p(P1b.U * 1e6, 3)} μJ</div><p><i>Q</i> × 나중 전위(${p(P1b.nums[0], 3)} μJ)는 모든 d<i>q</i>에 최대 비용을 매긴 것이다. 처음 들어온 전하들은 척력을 거의 받지 않았다.</p>` },
  ],
  2: [
    { q: `본문에서 +${M.UNI.q / nC} nC 전하가 균일한 ${M.UNI.E} N/C 전기장 속에서 A에서 C로 이동하며, <i>V</i><sub>C</sub> − <i>V</i><sub>A</sub> = −10 V이다. 전기장이 이 전하에 한 일은 얼마인가?`,
      choices: P2.nums.map(x => `${s(+p(x, 1))} nJ`), answer: 3, nums: P2.nums,
      why: `<div class="eq"><i>W</i><sub>field</sub> = −Δ<i>U</i> = −<i>q</i>Δ<i>V</i> = −(${M.UNI.q / nC} nC)(−10 V) = +${p(P2.W * 1e9, 1)} nJ</div><p>경로는 상관없다. ${p(P2.L * 100, 1)} cm의 직선 경로(${p(P2.nums[2], 1)} nJ)가 아니라 <b>E</b> 방향의 ${p(M.UNI.C[0] * 100, 0)} cm만 의미가 있다. + 전하가 <b>E</b> 방향으로 움직이면 <i>U</i>를 잃으므로 전기장은 양의 일을 한다.</p>` },
    { q: `전기장이 +<i>x</i> 방향을 향하고 <i>E</i> = ${P2b.c}<i>x</i>² (N/C, <i>x</i>의 단위는 m)이다. <i>V</i>(${P2b.x} m) − <i>V</i>(0)은 얼마인가?`,
      choices: P2b.nums.map(x => `${s(x)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq">Δ<i>V</i> = −∫<sub>0</sub><sup>${P2b.x}</sup> ${P2b.c}<i>x</i>² d<i>x</i> = −<i>x</i>³ |<sub>0</sub><sup>${P2b.x}</sup> = ${s(P2b.dV)} V</div><p><b>E</b> 방향으로 움직이면 <i>V</i>가 낮아지므로 답은 음수다. <i>E</i>(${P2b.x}) × ${P2b.x} m = ${-P2b.nums[1]} V는 가장 큰 전기장이 구간 전체에서 유지된다고 본 것이다.</p>` },
  ],
  3: [
    { q: `본문의 언덕(+${M.HILL.Q / nC} nC)에서 <i>V</i> = ${P3.V} V인 점의 전기장 크기는 얼마인가?`,
      choices: P3.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P3.nums,
      why: `<p>먼저 거리: <i>r</i> = <i>kQ</i>/<i>V</i> = ${p(K * M.HILL.Q, 2)}/${P3.V} = ${p(P3.r * 100, 2)} cm. 다음은 기울기:</p><div class="eq"><i>E</i> = −d<i>V</i>/d<i>r</i> = <i>kQ</i>/<i>r</i>² = <i>V</i>/<i>r</i> = ${p(P3.E, 0)} N/C</div><p><i>V</i>와 <i>E</i>는 단위도 크기도 다르다. ${P3.V} V는 언덕의 높이이고, ${p(P3.E, 0)} N/C는 그 가파른 정도다.</p>` },
    { q: '어떤 영역에서 <i>V</i>(<i>x</i>, <i>y</i>) = 3<i>x</i>²<i>y</i> − <i>y</i>³ (볼트, 미터)이다. (1 m, 2 m)에서 <b>E</b>의 크기는 얼마인가?',
      choices: P3b.nums.map(x => `${p(x, 1)} N/C`), answer: 2, nums: P3b.nums,
      why: `<p><b>E</b> = −∇<i>V</i>를 성분별로 구한다.</p><div class="eq"><i>E<sub>x</sub></i> = −∂<i>V</i>/∂<i>x</i> = −6<i>xy</i> = ${s(P3b.Ex)} N/C, &nbsp;<i>E<sub>y</sub></i> = −(3<i>x</i>² − 3<i>y</i>²) = ${s(P3b.Ey)} N/C</div><div class="eq">|<b>E</b>| = √(${P3b.Ex ** 2} + ${P3b.Ey ** 2}) = ${p(P3b.E, 1)} N/C</div><p>성분은 수가 아니라 벡터로 더해야 한다(${p(P3b.nums[0], 1)}).</p>` },
  ],
  4: [
    { q: `본문의 쌍극자(<i>x</i> = −${p(M.DIP.a * 100, 0)} cm에 +${M.DIP.q / nC} nC, +${p(M.DIP.a * 100, 0)} cm에 −${M.DIP.q / nC} nC)에서 축 위 <i>x</i> = ${p(M.DIP.axisX * 100, 0)} cm인 점 P의 전위는 얼마인가?`,
      choices: P4.nums.map(x => `${x === 0 ? '0' : s(+p(x, 1))} V`), answer: 2, nums: P4.nums,
      why: `<p>두 <i>kq</i>/<i>r</i>를 부호와 함께 더한다.</p><div class="eq"><i>V</i> = <i>kq</i>/${p((M.DIP.axisX + M.DIP.a), 2)} − <i>kq</i>/${p((M.DIP.axisX - M.DIP.a), 2)} = ${p(K * M.DIP.q / (M.DIP.axisX + M.DIP.a), 1)} − ${p(K * M.DIP.q / (M.DIP.axisX - M.DIP.a), 1)} = ${s(+p(P4.V, 1))} V</div><p>P는 − 전하에 더 가까우므로 <i>V</i> &lt; 0이다. <i>V</i> = 0은 여기가 아니라 이등분선 위에서 성립한다. 먼 거리 근사식 −2<i>akq</i>/<i>x</i>²(${p(P4.nums[3], 1)} V)은 <i>x</i> ≫ <i>a</i>일 때만 쓸 수 있다.</p>` },
    { q: '그 쌍극자의 축 위, −<i>q</i> 전하 쪽으로 멀리 떨어진 곳에서 <i>V</i> ≈ −2<i>akq</i>/<i>x</i>²이다. 그곳의 전기장은 무엇인가?',
      choices: ['4<i>akq</i>/<i>x</i>³, 쌍극자에서 멀어지는 방향', '2<i>akq</i>/<i>x</i>³, 쌍극자를 향하는 방향', '4<i>akq</i>/<i>x</i>³, 쌍극자를 향하는 방향', '2<i>akq</i>/<i>x</i>², 쌍극자에서 멀어지는 방향'], answer: 2,
      why: '<div class="eq"><i>E<sub>x</sub></i> = −d<i>V</i>/d<i>x</i> = −d/d<i>x</i>(−2<i>akq x</i><sup>−2</sup>) = −4<i>akq</i>/<i>x</i>³</div><p>음수이므로 −<i>x</i> 방향, 즉 쌍극자 쪽을 향한다. 앞뒤가 맞는다. 더 가까운 −<i>q</i>가 양의 시험 전하를 끌어당기는 힘이 더 먼 +<i>q</i>가 밀어내는 힘보다 크다. <b>E</b>는 높은 <i>V</i>에서 낮은 쪽으로 향하며, 안쪽으로 갈수록 <i>V</i>가 더 낮다(더 큰 음수).</p>' },
  ],
  5: [
    { q: `본문의 막대(${p(rL * 100, 0)} cm에 걸친 +${rQ / nC} nC)가 있다. 한쪽 끝에서 ${p(P5.a * 100, 0)} cm 바깥의 축 위 전위는 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 1)} V`), answer: 3, nums: P5.nums,
      why: `<div class="eq"><i>V</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i> = <i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>) = ${p(K * rlam, 1)} × ln ${p((P5.a + rL) / P5.a, 0)} = ${p(P5.V, 1)} V</div><p>1/<i>x</i>의 적분은 자연로그다. log₁₀을 쓰면 ${p(P5.nums[2], 1)} V가 나온다. 모든 전하를 가운데에 모으는 방법(${p(P5.nums[1], 1)} V)은 멀리서만 통한다.</p>` },
    { q: `그 축 위의 <i>V</i>(<i>a</i>)로부터 구한, 끝에서 ${p(P5.a * 100, 0)} cm 바깥의 전기장은 얼마인가?`,
      choices: P5.nums2.map(x => `${p(x, 0)} N/C`), answer: 0, nums: P5.nums2,
      why: `<div class="eq"><i>E</i> = −d<i>V</i>/d<i>a</i> = −<i>k</i>λ[1/(<i>a</i> + <i>L</i>) − 1/<i>a</i>] = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(P5.E, 0)} N/C</div><p>방향은 막대에서 멀어지는 쪽이다. <i>V</i>/<i>a</i>(${p(P5.nums2[1], 0)} N/C)는 <i>V</i> ∝ 1/<i>a</i>일 때만 맞다. 미분을 해야 한다.</p>` },
  ],
  6: [
    { q: `본문의 고리(+${M.RING.Q / nC} nC, <i>R</i> = ${p(M.RING.R * 100, 0)} cm)가 있다. 중심에서 축을 따라 ${p(P6.z * 100, 0)} cm 떨어진 곳의 전위는 얼마인가?`,
      choices: P6.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P6.nums,
      why: `<p>모든 d<i>q</i>가 √(<i>R</i>² + <i>z</i>²) = ${p(Math.hypot(M.RING.R, P6.z) * 100, 0)} cm 떨어져 있고 <i>V</i>는 스칼라이므로 성분이 필요 없다.</p><div class="eq"><i>V</i> = <i>kQ</i>/√(<i>R</i>² + <i>z</i>²) = ${p(K * M.RING.Q, 2)}/${p(Math.hypot(M.RING.R, P6.z), 2)} = ${p(P6.V, 1)} V</div><p>${p(P6.nums[2], 1)}은 N/C 단위의 전기장 <i>kQz</i>/(<i>R</i>² + <i>z</i>²)<sup>3/2</sup>이다. cos 인자는 <i>V</i>가 아니라 <b>E</b>에 붙는다.</p>` },
    { q: `본문의 반원 고리(+${M.ARC.Q / nC} nC, <i>R</i> = ${p(M.ARC.R * 100, 0)} cm)는 중심에서 <i>V</i> = <i>kQ</i>/<i>R</i>이다. 그곳의 <b>전기장</b> 크기는 얼마인가?`,
      choices: P6b.nums.map(x => `${x ? p(x, 0) : '0'} N/C`), answer: 2, nums: P6b.nums,
      why: `<p>λ = <i>Q</i>/π<i>R</i>이면 각 d<i>q</i> = λ<i>R</i> dθ가 <i>k</i>λ dθ/<i>R</i>를 만든다. θ를 대칭선에서 재면 옆 방향 성분은 상쇄되고 나머지는 더해진다.</p><div class="eq"><i>E</i> = ∫<sub>−π/2</sub><sup>π/2</sup> (<i>k</i>λ/<i>R</i>) cos θ dθ = 2<i>k</i>λ/<i>R</i> = 2<i>kQ</i>/π<i>R</i>² = ${p(P6b.E, 0)} N/C</div><p><i>V</i>와 달리 <b>E</b>는 그냥 <i>kQ</i>/<i>R</i>²(${p(P6b.nums[0], 0)} N/C)가 아니다. 조각들이 서로 다른 방향을 가리키기 때문이다. 전기장이 0인 것은 완전한 고리일 때뿐이다.</p>` },
  ],
  7: [
    { q: `본문의 부도체 구(+${M.SPH.Q / nC} nC가 고르게 퍼짐, <i>R</i> = ${p(M.SPH.R * 100, 0)} cm)가 있다. 중심에서 ${p(P7.r * 100, 0)} cm 떨어진 곳의 전위는 얼마인가?`,
      choices: P7.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P7.nums,
      why: `<p>무한히 먼 곳에서 걸어 들어온다. 바깥의 −∫<i>E</i> d<i>r</i>가 <i>kQ</i>/<i>R</i>를 주고, 안쪽에서는 <i>E</i> = <i>kQr</i>/<i>R</i>³이 더 보탠다.</p><div class="eq"><i>V</i>(<i>r</i>) = <i>kQ</i>/<i>R</i> + ∫<sub><i>r</i></sub><sup><i>R</i></sup> <i>kQr</i>′/<i>R</i>³ d<i>r</i>′ = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²) = ${p(P7.V, 1)} V</div><p><i>kQ</i>/<i>r</i>(${p(P7.nums[0], 1)} V)는 모든 전하가 <i>r</i> 안에 있는 것처럼 취급한 것이다. ${p(P7.nums[2], 1)} V는 안쪽에서 <i>E</i> = 0인 금속 구의 값이다.</p>` },
    { q: '반지름이 <i>R</i><sub>1</sub> = 3<i>R</i><sub>2</sub>인 두 금속 구가 멀리 떨어져 있고 가는 도선으로 연결된 뒤 대전된다. 표면 전하 밀도의 비 σ<sub>1</sub>/σ<sub>2</sub>는 얼마인가?',
      choices: P7b.nums.map(frac), answer: 0, nums: P7b.nums,
      why: '<p>연결되면 둘은 전위가 하나인 하나의 도체다. <i>kQ</i><sub>1</sub>/<i>R</i><sub>1</sub> = <i>kQ</i><sub>2</sub>/<i>R</i><sub>2</sub>이므로 <i>Q</i><sub>1</sub>/<i>Q</i><sub>2</sub> = <i>R</i><sub>1</sub>/<i>R</i><sub>2</sub> = 3이다. 따라서</p><div class="eq">σ<sub>1</sub>/σ<sub>2</sub> = (<i>Q</i><sub>1</sub>/<i>R</i><sub>1</sub>²)/(<i>Q</i><sub>2</sub>/<i>R</i><sub>2</sub>²) = 3 × (1/3)² = 1/3</div><p>큰 구가 전하를 더 많이 가지지만 더 얇게 퍼뜨린다. 전하는 도체가 급하게 휜 곳에 몰린다.</p>' },
  ],
  8: [
    { q: `본문의 양성자가 ${M.ACC.Vhi} V 판에서 정지 상태로 출발해 ${M.ACC.Vlo} V 판까지 건너간다. 도착할 때의 속력은 얼마인가?`,
      choices: P8.nums.map(x => `${p(x, 1)} km/s`), answer: 2, nums: P8.nums,
      why: `<div class="eq"><i>e</i>Δ<i>V</i> = ½<i>mv</i>² &nbsp;→&nbsp; <i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>p</sub>) = √(2 × ${M.E_CH.toExponential(2).replace('e-', ' × 10<sup>−')}</sup> × ${M.ACC.dV}/${M.M_P.toExponential(2).replace('e-', ' × 10<sup>−')}</sup>) = ${p(P8.v / 1e3, 1)} km/s</div><p>출발 판의 ${M.ACC.Vhi} V가 아니라 <b>차이</b>인 ${M.ACC.dV} V만 의미가 있다. ${p(P8.nums[3], 0)} km/s는 같은 6 eV를 얻은 전자의 속력이다.</p>` },
    { q: `전자가 고정된 +${P8b.Q / nC} nC 전하로부터 ${p(P8b.ra * 100, 0)} cm 떨어진 곳에서 정지 상태로 출발해 끌려 들어간다. ${p(P8b.rb * 100, 0)} cm 거리에 왔을 때의 속력은 얼마인가?`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> m/s`), answer: 1, nums: P8b.nums,
      why: `<p>떨어지면서 힘이 커지므로, 적분 ∫<i>F</i> d<i>r</i>를 이미 담고 있는 에너지를 쓴다.</p><div class="eq">Δ<i>V</i> = <i>kQ</i>(1/<i>r</i><sub>b</sub> − 1/<i>r</i><sub>a</sub>) = ${p(P8b.dV, 1)} V, &nbsp;<i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>e</sub>) = ${p(P8b.v / 1e6, 2)} × 10<sup>6</sup> m/s</div><p>${p(P8b.rb * 100, 0)} cm에서의 <i>V</i>만 쓰면(${p(K * P8b.Q / P8b.rb, 0)} V) 출발점이 0이 아니라 ${p(K * P8b.Q / P8b.ra, 0)} V였다는 사실을 잊은 것이다.</p>` },
  ],
};
