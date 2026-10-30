// induction/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const MU0 = M.MU0;

// ---- page 0: average emf of a coil in a growing field; when a polynomial flux has zero emf ----
const P0 = { N: 200, A: 0.0050, B1: 0.10, B2: 0.50, dt: 0.20 };
P0.emf = P0.N * P0.A * (P0.B2 - P0.B1) / P0.dt;
P0.nums = [P0.A * (P0.B2 - P0.B1) / P0.dt, P0.emf, P0.N * P0.A * P0.B2 / P0.dt, P0.N * P0.A * (P0.B2 - P0.B1) * P0.dt];   // forgot N · right · used B₂ not ΔB · ×Δt
const P0b = { a: 4.0, b: 6.0 };                      // Φ = a t³ − b t (mWb)
P0b.t = Math.sqrt(P0b.b / (3 * P0b.a));
P0b.nums = [Math.sqrt(P0b.b / P0b.a), P0b.b / (3 * P0b.a), Math.sqrt(3 * P0b.a / P0b.b), P0b.t];   // where Φ = 0 · forgot the root · upside down · right

// ---- page 1: charge through the loop as the N pole comes in (page's magnet and loop) ----
const L1 = (() => { const c = M.CASES[0], a = M.lenzCase(c, 0), b = M.lenzCase(c, M.LENZ.run), dPhi = b.Phi - a.Phi;
  return { dPhi, Q: dPhi / M.LENZ.R, nums: [dPhi / M.LENZ.R / 2, dPhi / (M.LENZ.R * M.LENZ.run), dPhi * M.LENZ.run / M.LENZ.R, dPhi / M.LENZ.R].map(x => x * 1e3) }; })();
// ---- page 2: the iron core, I₁ = c t² ----
const P2 = { c: 2.0, t: 0.50 };
P2.dI = 2 * P2.c * P2.t;
P2.nums = [M.CORE.M * P2.c * P2.t ** 2, M.CORE.M * P2.dI, M.CORE.L1 * P2.dI, M.CORE.M * P2.c * P2.t].map(x => x * 1e3);   // M·I · right · L₁ · lost the 2
// ---- page 3: the page's loop leaving the wire, at r = 2 cm ----
const P3 = (() => { const { I, a, b, r0: r, v } = M.WIRE, k = MU0 * I / (2 * Math.PI);
  return { emf: k * a * b * v / (r * (r + a)), nums: [k / r * b * v, k * (1 / r + 1 / (r + a)) * b * v, k * (1 / r - 1 / (r + a)) * a * v, k * (1 / r - 1 / (r + a)) * b * v].map(x => x * 1e6) }; })();
// ---- page 4: a rod turning about one end ----
const P4 = { l: 0.50, w: 20, B: 0.40 };
P4.emf = 0.5 * P4.B * P4.w * P4.l ** 2;
P4.nums = [P4.B * P4.w * P4.l ** 2, P4.emf, P4.B * P4.w * P4.l, P4.emf / 2];   // tip speed for the whole rod · right · dropped an ℓ · ¼
// ---- page 5: pulling the page's loop into the field at constant speed ----
const P5 = (() => { const { B, h, w, v, R } = M.CROSS, F = B * B * h * h * v / R;
  return { F, nums: [B * B * h * w * v / R, 2 * F, F, B * h * h * v / R].map(x => x * 1e3) }; })();   // used w · both sides · right · one B only
// ---- page 6: how far the page's bar coasts ----
const P6 = (() => { const { v0, tau } = M.RAIL; return { d: v0 * tau, nums: [v0 * tau / 2, v0 * tau * (1 - 1 / Math.E), v0 * tau] }; })();
// ---- page 7: a solenoid's inductance; the page's solenoid driven sinusoidally ----
const P7 = { N: 500, l: 0.25, r: 0.010 };
P7.L = MU0 * P7.N ** 2 * Math.PI * P7.r ** 2 / P7.l;
P7.nums = [P7.L, MU0 * P7.N ** 2 * Math.PI * (2 * P7.r) ** 2 / P7.l, MU0 * P7.N * Math.PI * P7.r ** 2 / P7.l, MU0 * P7.N ** 2 * P7.r ** 2 / P7.l].map(x => x * 1e3);   // right · diameter · N not N² · forgot π
const P7b = { I0: 2.0, w: 50 };
P7b.emf = M.SOL.L * P7b.I0 * P7b.w;
P7b.nums = [M.SOL.L * P7b.I0, M.SOL.L * P7b.I0 / P7b.w, P7b.emf, M.SOL.L * P7b.I0 * P7b.w ** 2].map(x => x * 1e3);
// ---- page 8: the page's RL circuit reaching 2.0 A ----
const P8 = { I: 2.0 };
P8.t = -M.RL.tau * Math.log(1 - P8.I / M.RL.Imax);
P8.nums = [M.RL.tau, P8.t, M.RL.tau * Math.log(M.RL.Imax / P8.I), M.RL.tau * P8.I / M.RL.Imax];   // assumed τ · right · ln upside down · linear
// ---- page 9: the page's LC circuit, first maximum of the current ----
const P9 = { t: M.LC.T / 4, I: M.LC.Imax };

export const PRACTICE = {
  0: [
    { q: `넓이 ${p(P0.A * 1e4, 0)} cm²인 ${P0.N}회 코일이 자신에 수직인 균일한 자기장 속에 평평하게 놓여 있다. 자기장이 ${p(P0.dt, 2)} s 동안 ${p(P0.B1, 2)} T에서 ${p(P0.B2, 2)} T까지 일정하게 커진다. 유도 기전력의 크기는 얼마인가?`,
      choices: P0.nums.map(x => `${p(x, 3)} V`), answer: 1, nums: P0.nums,
      why: `<p>한 바퀴마다 Φ = <i>BA</i>이고, ${P0.N}바퀴가 모두 더해진다.</p><div class="eq">|ε| = <i>NA</i> Δ<i>B</i>/Δ<i>t</i> = ${P0.N} × ${P0.A} m² × ${p(P0.B2 - P0.B1, 2)} T / ${P0.dt} s = ${p(P0.emf, 3)} V</div><p><i>B</i>의 <b>변화</b>만 중요하다. ${P0.B2} T만 쓰면 ${p(P0.nums[2], 3)} V가 나오고, <i>N</i>을 빼면 한 바퀴의 값 ${p(P0.nums[0], 3)} V가 나온다.</p>` },
    { q: `고리를 지나는 선속이 Φ<sub><i>B</i></sub>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i><sup>3</sup> − ${p(P0b.b, 1)}<i>t</i> (mWb, <i>t</i>의 단위는 s)이다. <i>t</i> > 0에서 유도 기전력이 0이 되는 때는 언제인가?`,
      choices: P0b.nums.map(x => `${p(x, 2)} s`), answer: 3, nums: P0b.nums,
      why: `<p>기전력은 Φ 자체가 아니라 Φ의 <b>기울기</b>에 음의 부호를 붙인 것이다.</p><div class="eq">ε = −<i>d</i>Φ/<i>dt</i> = −(${p(3 * P0b.a, 0)}<i>t</i><sup>2</sup> − ${p(P0b.b, 0)}) = 0 &nbsp;→&nbsp; <i>t</i> = √(${p(P0b.b, 0)}/${p(3 * P0b.a, 0)}) = ${p(P0b.t, 2)} s</div><p>${p(P0b.nums[0], 2)} s에서는 선속이 0이지만 여전히 변하고 있으므로 기전력은 0이 아니다.</p>` },
  ],
  1: [
    { q: '막대자석의 N극을 고리의 축을 따라 고리에서 곧장 멀어지게 당긴다. 자석 쪽에서 볼 때 고리의 유도 전류는 어떠한가?',
      choices: ['시계 반대 방향이고, 고리가 자석을 밀어낸다', '시계 방향이고, 고리가 자석을 밀어낸다', '시계 반대 방향이고, 고리가 자석을 끌어당긴다', '시계 방향이고, 고리가 자석을 끌어당긴다'], answer: 3,
      why: '<p>N극의 자기장은 보는 사람에게서 멀어지는 방향으로 고리를 지나며, 줄어들고 있다. 유도 자기장은 줄어든 만큼을 메우려고 같은 방향, 곧 보는 사람에게서 멀어지는 방향을 향한다. 오른손 법칙에 따르면 이는 자석 쪽에서 볼 때 <b>시계 방향</b> 전류다. 자기력선이 고리의 가까운 면으로 들어가므로 그 면은 S극이 되어 N극을 끌어당긴다. 고리는 운동을 거스른다.</p>' },
    { q: `이 페이지의 고리(<i>R</i> = ${p(M.LENZ.R * 1e3, 0)} mΩ)에서 N극이 ${p(M.LENZ.run, 1)} s에 걸쳐 다가오는 동안 선속이 ${p(M.lenzCase(M.CASES[0], 0).Phi * 1e6, 2)} µWb에서 ${p(M.lenzCase(M.CASES[0], M.LENZ.run).Phi * 1e6, 2)} µWb로 커진다. 고리를 따라 흐른 전체 전하량은 얼마인가?`,
      choices: L1.nums.map(x => `${p(x, 2)} mC`), answer: 3, nums: L1.nums,
      why: `<p>전류를 적분하면 시간이 사라진다.</p><div class="eq"><i>Q</i> = ∫<i>I dt</i> = ∫(ε/<i>R</i>) <i>dt</i> = (1/<i>R</i>)∫|<i>d</i>Φ| = ΔΦ/<i>R</i> = ${p(L1.dPhi * 1e6, 2)} µWb / ${M.LENZ.R} Ω = ${p(L1.Q * 1e3, 2)} mC</div><p>자석이 얼마나 빨리 움직이든 상관없다. ${p(L1.nums[1], 2)}는 mA 단위의 평균 전류이지 전하량이 아니다.</p>` },
  ],
  2: [
    { q: '두 코일이 철심을 공유한다. <b>2차</b> 코일의 감은 수를 두 배로 하면 상호 인덕턴스 <i>M</i>은 어떻게 되는가?',
      choices: ['두 배가 된다', '변하지 않는다', '네 배가 된다', '절반이 된다'], answer: 0,
      why: '<p><i>M</i> = <i>N</i><sub>2</sub>Φ<sub>2</sub>/<i>I</i><sub>1</sub>이다. 1차 코일의 전류와 감은 수가 정하는 한 바퀴당 선속은 변하지 않고, 2차 코일의 감은 수가 두 배면 선속 쇄교도 두 배다. <i>M</i> = μ<sub>r</sub>μ<sub>0</sub><i>N</i><sub>1</sub><i>N</i><sub>2</sub><i>A</i>/ℓ은 각 <i>N</i>에 대해 선형이다. <i>N</i><sup>2</sup>에 비례하는 것은 자체 인덕턴스다.</p>' },
    { q: `이 페이지의 철심(<i>M</i> = ${p(M.CORE.M * 1e3, 1)} mH, <i>L</i><sub>1</sub> = ${p(M.CORE.L1 * 1e3, 1)} mH)에서 1차 코일에 <i>I</i><sub>1</sub> = ${p(P2.c, 1)}<i>t</i><sup>2</sup> (A, <i>t</i>의 단위는 s)가 흐른다. <i>t</i> = ${p(P2.t, 2)} s에서 2차 기전력의 크기는 얼마인가?`,
      choices: P2.nums.map(x => `${p(x, 1)} mV`), answer: 1, nums: P2.nums,
      why: `<div class="eq">ε<sub>2</sub> = −<i>M dI</i><sub>1</sub>/<i>dt</i> = −<i>M</i>(${p(2 * P2.c, 1)}<i>t</i>) = −${p(M.CORE.M * 1e3, 1)} mH × ${p(P2.dI, 2)} A/s = −${p(P2.nums[1], 1)} mV</div><p><i>I</i><sub>1</sub> 자체(${p(P2.nums[0], 1)} mV)가 아니라 변화율이 필요하다. 또 2차 코일이 보는 것은 1차 코일의 자체 인덕턴스 <i>L</i><sub>1</sub>이 아니라 <i>M</i>이다.</p>` },
  ],
  3: [
    { q: '직사각형 고리의 변 <i>b</i>가 전류 <i>I</i>가 흐르는 긴 도선에 나란하다. 가까운 변은 거리 <i>r</i>에, 먼 변은 <i>r</i> + <i>a</i>에 있다. 고리를 지나는 선속은 무엇인가?',
      choices: ['(μ<sub>0</sub><i>Ib</i>/2π<i>r</i>)<i>a</i>', '(μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', '(μ<sub>0</sub><i>Ia</i>/2π) ln((<i>r</i> + <i>b</i>)/<i>r</i>)', '(μ<sub>0</sub><i>Ib</i>/2π)(1/<i>r</i> − 1/(<i>r</i> + <i>a</i>))'], answer: 1,
      why: '<p><i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>s</i>는 거리 <i>s</i>에 따라 변하므로, 고리를 도선에 나란한 띠 <i>b ds</i>로 자른다.</p><div class="eq">Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i> = (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)</div><p>A는 <i>B</i>를 가까운 변의 값으로 균일하다고 본 것이다. D는 적분이 아니라 도함수의 꼴이다.</p>' },
    { q: `이 페이지의 고리(도선 방향 <i>b</i> = ${p(M.WIRE.b * 100, 0)} cm, 가로 방향 <i>a</i> = ${p(M.WIRE.a * 100, 0)} cm)가 ${M.WIRE.I} A 도선에서 ${p(M.WIRE.v * 100, 0)} cm/s로 곧장 멀어진다. 가까운 변이 도선에서 ${p(M.WIRE.r0 * 100, 0)} cm일 때 |ε|는 얼마인가?`,
      choices: P3.nums.map(x => `${p(x, 3)} µV`), answer: 3, nums: P3.nums,
      why: `<p>도선에 나란한 두 변만 자기력선을 가른다. 각각 운동 기전력 <i>Bbv</i>를 가지며, 고리를 한 바퀴 돌면 서로 반대다.</p><div class="eq">ε = (<i>B</i><sub>near</sub> − <i>B</i><sub>far</sub>)<i>bv</i> = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>) = ${p(P3.emf * 1e6, 3)} µV</div><p>로그 식의 −<i>d</i>Φ/<i>dt</i>와 같다. 가까운 변만 쓰면 ${p(P3.nums[0], 3)} µV, 두 변을 더하면 ${p(P3.nums[1], 3)} µV가 나온다.</p>` },
  ],
  4: [
    { q: '연직으로 세운 금속 막대가 회로 없이, 종이 안쪽을 향하는 균일한 자기장 속을 오른쪽으로 움직인다. 잠시 후에는 어떻게 되는가?',
      choices: ['위쪽 끝의 전위가 더 높고, 전류는 흐르지 않는다', '아래쪽 끝의 전위가 더 높고, 전류가 흐른다', '아래쪽 끝의 전위가 더 높고, 전류는 흐르지 않는다', '위쪽 끝의 전위가 더 높고, 전류가 막대를 따라 아래로 흐른다'], answer: 0,
      why: '<p><i>F</i> = <i>qv</i>×<i>B</i>: 오른쪽 × 종이 안쪽 = 위쪽이므로 양전하가 위에 모인다. 그 전기장이 <i>qE</i> = <i>qvB</i>가 될 때까지 도로 밀고, 그다음에는 막대를 따라 아무것도 움직이지 않는다. 닫힌 경로가 없으므로 기전력 <i>BLv</i>는 있지만 정상 전류는 없다.</p>' },
    { q: `${p(P4.l * 100, 0)} cm 금속 막대가 균일한 ${p(P4.B, 2)} T 자기장에 수직인 평면에서 한쪽 끝을 축으로 ${P4.w} rad/s로 돈다. 양 끝 사이의 기전력은 얼마인가?`,
      choices: P4.nums.map(x => `${p(x, 2)} V`), answer: 1, nums: P4.nums,
      why: `<p>각 조각 <i>dr</i>는 <i>v</i> = ω<i>r</i>로 움직이므로 그 기전력은 <i>B</i>ω<i>r dr</i>이다. 막대를 따라 더하면</p><div class="eq">ε = ∫<sub>0</sub><sup>ℓ</sup> <i>B</i>ω<i>r dr</i> = ½<i>B</i>ωℓ<sup>2</sup> = ½ × ${P4.B} × ${P4.w} × ${P4.l}<sup>2</sup> = ${p(P4.emf, 2)} V</div><p>막대 전체에 끝의 속력 ωℓ을 쓰면 ${p(P4.nums[0], 2)} V로 두 배가 된다. 평균 속력은 끝 속력의 절반이다.</p>` },
  ],
  5: [
    { q: `고리(높이 <i>h</i> = ${p(M.CROSS.h * 100, 0)} cm, 폭 ${p(M.CROSS.w * 100, 0)} cm, <i>R</i> = ${M.CROSS.R} Ω)를 ${M.CROSS.B} T 자기장 속으로 일정한 ${M.CROSS.v} m/s로 끌어당긴다. 앞쪽 변은 안에, 뒤쪽 변은 밖에 있는 동안 필요한 당기는 힘은 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 1)} mN`), answer: 2, nums: P5.nums,
      why: `<div class="eq"><i>I</i> = <i>Bhv</i>/<i>R</i>, &nbsp;<i>F</i> = <i>IhB</i> = <i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>v</i>/<i>R</i> = ${p(P5.F * 1e3, 1)} mN</div><p>자기장 속에서 전류가 흐르는 것은 앞쪽 변뿐이고(위아래 변의 힘은 상쇄), 자기력선을 가르는 것은 높이 <i>h</i>뿐이다. 검산: <i>Fv</i> = ${p(P5.F * M.CROSS.v * 1e3, 1)} mW = ε<sup>2</sup>/<i>R</i>.</p>` },
    { q: '질량 <i>m</i>, 저항 <i>R</i>, 높이 <i>h</i>인 고리가 균일한 자기장 <i>B</i> 속으로 속력 <i>v</i><sub>0</sub>로 <b>자유롭게</b>(당기는 힘 없이) 미끄러져 들어간다. 뒤쪽 변이 아직 밖에 있는 동안, 앞쪽 변이 자기장 안으로 들어간 거리 <i>x</i>의 함수로 속력을 구하라.',
      solution: `<p>앞쪽 변만 자기장 안에 있으므로 전류는 <i>Bhv</i>/<i>R</i>이고, 자기장이 이 전류를 <i>IhB</i>로 도로 민다.</p><div class="eq"><i>m dv</i>/<i>dt</i> = −<i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>v</i>/<i>R</i></div><p><i>dv</i>/<i>dt</i> = <i>v dv</i>/<i>dx</i>로 쓰고 <i>v</i>를 약분하면</p><div class="eq"><i>m dv</i>/<i>dx</i> = −<i>B</i><sup>2</sup><i>h</i><sup>2</sup>/<i>R</i> &nbsp;→&nbsp; <i>v</i>(<i>x</i>) = <i>v</i><sub>0</sub> − <i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>x</i>/<i>mR</i></div><p>속력은 <b>거리에 대해 선형으로</b>(시간에 대해서는 지수적으로) 줄어든다. <i>x</i>가 고리의 폭에 이르기 전에 <i>v</i>가 0이 된다면 고리는 일부만 들어간 채 멈춘다.</p>` },
  ],
  6: [
    { q: `이 페이지의 막대(τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup> = ${p(M.RAIL.tau, 2)} s)를 ${p(M.RAIL.v0, 2)} m/s로 놓아주고 아무것도 밀지 않는다. 멈출 때까지 얼마나 가는가?`,
      choices: [`${p(P6.nums[0], 2)} m`, `${p(P6.nums[1], 2)} m`, '결코 멈추지 않으므로 거리가 한없이 커진다', `${p(P6.nums[2], 2)} m`], answer: 3, nums: [P6.nums[0], P6.nums[1], NaN, P6.nums[2]],
      why: `<p>속력은 지수적으로 줄지만 그 적분은 유한하다.</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup>∞</sup> <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup> <i>dt</i> = <i>v</i><sub>0</sub>τ = ${p(P6.d, 2)} m</div><p>${p(P6.nums[1], 2)} m는 <i>t</i> = τ까지 간 거리일 뿐이다. ${p(P6.nums[0], 2)} m는 감속도가 일정하다고 가정한 것이다.</p>` },
    { q: '레일을 잇는 저항을 저항값이 두 배인 것으로 바꾸고 막대를 같은 속력으로 출발시킨다. 막대가 멈출 때까지 발생하는 전체 열은 어떻게 되는가?',
      choices: ['두 배가 된다', '절반이 된다', '변하지 않는다', '네 배가 된다'], answer: 2,
      why: '<p><i>R</i>가 얼마든 막대의 운동 에너지 ½<i>mv</i><sub>0</sub><sup>2</sup>는 전부 열이 된다. <i>R</i>가 크면 전류가 작고 제동이 약해서 τ가 두 배가 되고 막대가 두 배 멀리 미끄러지지만, 전체 열은 같다.</p>' },
  ],
  7: [
    { q: `솔레노이드가 ${p(P7.l * 100, 0)} cm에 ${P7.N}회 감겨 있고 반지름은 ${p(P7.r * 100, 1)} cm이다. 인덕턴스는 대략 얼마인가?`,
      choices: P7.nums.map(x => x < 0.01 ? `${p(x * 1e3, 2)} µH` : `${p(x, 3)} mH`), answer: 0, nums: P7.nums,
      why: `<p>각 바퀴를 <i>B</i> = μ<sub>0</sub><i>nI</i>가 지나므로 <i>N</i>Φ = <i>N</i>(μ<sub>0</sub><i>NI</i>/ℓ)π<i>r</i><sup>2</sup>이고</p><div class="eq"><i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup>π<i>r</i><sup>2</sup>/ℓ = ${p(P7.L * 1e3, 3)} mH</div><p><i>r</i>에 지름을 쓰면 4배가 된다. <i>N</i><sup>2</sup> 대신 <i>N</i>을 쓰면, 감은 수가 많을수록 자기장도 더 만들고 선속도 더 붙잡는다는 점을 잊은 것이다.</p>` },
    { q: `이 페이지의 솔레노이드(<i>L</i> = ${p(M.SOL.L * 1e3, 2)} mH)에 <i>I</i>(<i>t</i>) = (${p(P7b.I0, 1)} A) sin(${P7b.w}<i>t</i>)가 흐른다. 역기전력 크기의 최댓값은 얼마인가?`,
      choices: P7b.nums.map(x => x < 1 ? `${p(x, 3)} mV` : x < 10 ? `${p(x, 2)} mV` : x < 1000 ? `${p(x, 1)} mV` : `${p(x / 1e3, 1)} V`), answer: 2, nums: P7b.nums,
      why: `<div class="eq">ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i> = −<i>LI</i><sub>0</sub>ω cos ω<i>t</i>, &nbsp;최댓값 <i>LI</i><sub>0</sub>ω = ${p(M.SOL.L * 1e3, 2)} mH × ${P7b.I0} A × ${P7b.w} s<sup>−1</sup> = ${p(P7b.emf * 1e3, 1)} mV</div><p>최댓값은 <i>I</i> = 0이어서 가장 빨리 변할 때 나온다. <i>LI</i><sub>0</sub> = ${p(P7b.nums[0], 2)} mV는 mWb 단위의 선속 쇄교이지 기전력이 아니다.</p>` },
  ],
  8: [
    { q: `이 페이지의 회로(ε = ${M.RL.E} V, <i>R</i> = ${M.RL.R} Ω, <i>L</i> = ${M.RL.L} H)에서 <i>I</i> = 0으로 시작할 때, 전류가 ${p(P8.I, 1)} A에 이르기까지 얼마나 걸리는가?`,
      choices: P8.nums.map(x => `${p(x, 3)} s`), answer: 1, nums: P8.nums,
      why: `<p><i>I</i> = 0에서 <i>L dI</i>/<i>dt</i> = ε − <i>IR</i>를 풀면 <i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), τ = <i>L</i>/<i>R</i> = ${p(M.RL.tau, 2)} s.</p><div class="eq"><i>t</i> = −τ ln(1 − <i>IR</i>/ε) = −${p(M.RL.tau, 2)} ln(1 − ${p(P8.I, 1)}/${p(M.RL.Imax, 1)}) = ${p(P8.t, 3)} s</div><p>${p(P8.I, 1)} A는 ${p(M.RL.Imax, 0)} A의 ${p(P8.I / M.RL.Imax * 100, 0)} %로, τ에서 도달하는 63 %보다 크므로 τ보다 오래 걸린다.</p>` },
    { q: '전지가 있는 RL 회로를 오랫동안 켜 두었다가 갑자기 전지를 고리에서 뺀다(고리는 저항을 통해 닫힌 채로 있다). 그 직후에는 어떻게 되는가?',
      choices: ['전류는 ε/<i>R</i>이고 줄어들며, 인덕터가 원천 역할을 한다', '전류가 0이다', '전류는 ε/<i>R</i>이고 일정하다', '전류의 방향이 뒤집힌다'], answer: 0,
      why: '<p>인덕터는 전류가 갑자기 바뀌는 것을 허용하지 않으므로 <i>I</i>는 같은 방향으로 ε/<i>R</i>에서 시작한다. 전지가 없으므로 <i>L dI</i>/<i>dt</i> = −<i>IR</i>이다. 이제 인덕터의 기전력이 <i>R</i>를 통해 전류를 흐르게 하고, 전류는 <i>e</i><sup>−<i>t</i>/τ</sup>로 감쇠하며 ½<i>LI</i><sup>2</sup>를 열로 바꾼다.</p>' },
  ],
  9: [
    { q: `이 페이지의 축전기(${p(M.LC.C * 1e6, 0)} µF, ${p(M.LC.Q * 1e6, 0)} µC)를 <i>t</i> = 0에 ${p(M.LC.L * 1e3, 0)} mH 코일에 연결한다. 전류가 처음으로 최대가 되는 때와 그 값은?`,
      choices: [`<i>t</i> = ${p(M.LC.T / 2 * 1e3, 2)} ms, ${p(P9.I * 1e3, 0)} mA`, `<i>t</i> = ${p(P9.t * 1e3, 2)} ms, ${p(M.LC.f * M.LC.Q * 1e3, 1)} mA`, `<i>t</i> = ${p(P9.t * 1e3, 2)} ms, ${p(P9.I * 1e3, 0)} mA`, `<i>t</i> = 0, ${p(P9.I * 1e3, 0)} mA`], answer: 2,
      nums: [M.LC.T / 2 * 1e3, P9.t * 1e3, P9.t * 1e3, 0], nums2: [P9.I * 1e3, M.LC.f * M.LC.Q * 1e3, P9.I * 1e3, P9.I * 1e3],
      why: `<p>ω = 1/√(<i>LC</i>) = ${p(M.LC.w, 0)} rad/s, <i>T</i> = 2π/ω = ${p(M.LC.T * 1e3, 2)} ms. <i>q</i> = <i>Q</i> cos ω<i>t</i>이면 <i>I</i> = −ω<i>Q</i> sin ω<i>t</i>는 ω<i>t</i> = π/2, 곧 4분의 1 주기가 지나 극판이 비었을 때 처음으로 최대가 된다.</p><div class="eq"><i>t</i> = <i>T</i>/4 = ${p(P9.t * 1e3, 2)} ms, &nbsp;|<i>I</i>| = ω<i>Q</i> = ${p(P9.I * 1e3, 0)} mA</div><p><i>t</i> = 0에서는 전류가 0이다. 코일이 전류가 갑자기 바뀌는 것을 허용하지 않기 때문이다. ${p(M.LC.f * M.LC.Q * 1e3, 1)} mA는 ω 대신 <i>f</i>를 쓴 것이다.</p>` },
    { q: '저항이 없는 LC 회로에서 <i>U</i> = <i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup>가 일정함을 보이고, 에너지를 이용해 축전기의 전하가 <i>Q</i>/2일 때의 전류를 구하라(최대 전하는 <i>Q</i>).',
      solution: `<p><i>I</i> = <i>dq</i>/<i>dt</i>로 두고 미분하면</p><div class="eq"><i>dU</i>/<i>dt</i> = (<i>q</i>/<i>C</i>)<i>I</i> + <i>LI dI</i>/<i>dt</i> = <i>I</i>(<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i>)</div><p>괄호 안은 고리 법칙으로, 매 순간 0이다. 따라서 언제나 <i>U</i> = <i>Q</i><sup>2</sup>/2<i>C</i>이다. <i>q</i> = <i>Q</i>/2에서</p><div class="eq">½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> − <i>Q</i><sup>2</sup>/8<i>C</i> = 3<i>Q</i><sup>2</sup>/8<i>C</i> &nbsp;→&nbsp; |<i>I</i>| = (√3/2) <i>Q</i>/√(<i>LC</i>) = (√3/2)ω<i>Q</i></div><p>이 페이지의 회로에서는 ${p(Math.sqrt(3) / 2 * M.LC.Imax * 1e3, 1)} mA이다. 전하가 절반만 빠져나갔을 때 에너지의 4분의 3이 코일에 있다.</p>` },
  ],
};
