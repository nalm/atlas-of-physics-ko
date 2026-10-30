// capacitors/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { EPS0, K, C0, V0, Q0, U0, PLATE } = M;
const A = PLATE.A, d = PLATE.d;

// ---- page 0: the battery turned up steadily from 20 V to 100 V in 4.0 s ----
const P0 = { V1: 20, V2: 100, dt: 4.0 };
P0.I = C0 * (P0.V2 - P0.V1) / P0.dt;
P0.nums = [C0 * P0.V2 / P0.dt, P0.I, P0.I / 2, C0 * P0.V1 / P0.dt].map(x => x * 1e12);   // final V not ΔV · right · halved · starting V
// ---- page 1: isolated plates pulled from 5 cm to 8 cm; the force between them ----
const P1 = { d2: 0.08 };
P1.V = Q0 / M.cPlate(A, P1.d2);
P1.nums = [V0 * d / P1.d2, V0, V0 * (P1.d2 / d) ** 2, P1.V];        // ΔV ∝ 1/d · battery's · ∝ d² · right
P1.F = Q0 * Q0 / (2 * EPS0 * A);
P1.fnums = [Q0 * M.E0, P1.F, K * Q0 * Q0 / d ** 2, P1.F / 2].map(x => x * 1e6);   // full field σ/ε₀ · right · point charges · ¼
// ---- page 2: the page's spheres, a = 10 cm, b = 20 cm, 100 V ----
const { a: sa, b: sb } = M.SPH, r2 = 0.15;
const P2 = { E: K * M.SPH.Q / r2 ** 2 };
P2.nums = [V0 / (sb - sa), K * M.SPH.Q / sb ** 2, P2.E, K * M.SPH.Q / sa ** 2];   // as if plates · used b · right · used a
P2.dV = V0 * (1 / sa - 1 / r2) / (1 / sa - 1 / sb);
P2.vnums = [P2.dV, V0 * (r2 - sa) / (sb - sa), V0 - P2.dV, V0 * (1 / sa ** 2 - 1 / r2 ** 2) / (1 / sa ** 2 - 1 / sb ** 2)];   // right · linear · the other part · 1/r² for V
// ---- page 3: the page's coax; the tube widened to 16 cm; where the energy is ----
const { a: ca, b: cb, L: cL } = M.CYL, cb2 = 2 * cb;
const P3 = { C: 2 * Math.PI * EPS0 * cL / Math.log(cb2 / ca) };
P3.nums = [M.CYL.C / 2, M.CYL.C, P3.C, M.CYL.C / 4].map(x => x * 1e12);   // C ∝ 1/b · unchanged · right · 1/b²
P3.frac = Math.log(2) / Math.log(cb / ca);
P3.fnums = [((2 * ca) ** 2 - ca ** 2) / (cb ** 2 - ca ** 2), ca / (cb - ca), (1 / ca ** 2 - 1 / (2 * ca) ** 2) / (1 / ca ** 2 - 1 / cb ** 2), P3.frac].map(x => x * 100);   // by volume · by radius · E² not E²r · right
// ---- page 4: the second half of the charge; the gap halved on the battery ----
const P4 = { frac: 1 - 0.25 };
P4.nums = [25, 50, P4.frac * 100, 87.5];
const P4b = { d2: d / 2 };
P4b.U = 0.5 * M.cPlate(A, P4b.d2) * V0 * V0;
P4b.nums = [U0 / 2, U0, 4 * U0, P4b.U].map(x => x * 1e9);           // as if Q fixed · unchanged · ×4 · right
// ---- page 5: 2 µF and 4 µF in series on 9 V ----
const { C1, C2, V: CV } = M.CIRC, S = M.SER;
const P5 = { V1: S.Q / C1 };
P5.nums = [P5.V1, CV * C1 / (C1 + C2), CV, CV / 2];                // right · split the wrong way · all of it · halves
P5.U = S.Q * S.Q / 2 * (1 / C1 + 1 / C2);
P5.unums = [S.Q * CV, M.PAR.U, S.Q * S.Q / (2 * C1), P5.U].map(x => x * 1e6);   // forgot ½ · parallel · C₁ only · right
// ---- page 6: the κ = 3 slab, plates isolated; a graded dielectric ----
const KA = M.KAPPA;
const P6 = { V: V0 / KA };
P6.nums = [V0 * KA, P6.V, V0, V0 / KA ** 2];
const P6b = { k1: 1, k2: 3 };
P6b.C = EPS0 * A * (P6b.k2 - P6b.k1) / (d * Math.log(P6b.k2 / P6b.k1));      // the free-response answer
// ---- page 7: slab fully in, battery on; half in, battery off ----
const P7 = { dQ: (KA - 1) * Q0 };
P7.nums = [KA * Q0, Q0, Q0 * (1 - 1 / KA), P7.dQ].map(x => x * 1e12);  // total not added · Q₀ · wrong way · right
const P7b = { x: 0.5, side: PLATE.side };
P7b.F = U0 * (KA - 1) / (P7b.side * (1 + (KA - 1) * P7b.x) ** 2);
P7b.nums = [U0 * (KA - 1) / P7b.side, P7b.F, U0 * (KA - 1) / (P7b.side * (1 + (KA - 1) * P7b.x)), U0 / (P7b.side * (1 + (KA - 1) * P7b.x) ** 2)].map(x => x * 1e9);   // V held · right · C not C² · no (κ − 1)
// ---- page 8: the induced charge on one half of the sphere ----
const { R: cR, E0: cE } = M.COND, sMax = 3 * EPS0 * cE;
const P8 = { q: sMax * Math.PI * cR * cR };
P8.nums = [sMax * 2 * Math.PI * cR * cR, 0, sMax * 4 * Math.PI * cR * cR, P8.q].map(x => x * 1e9);   // σ_max × half the area · total · whole area · right

const pF = x => `${p(x, 1)} pF`;

export const PRACTICE = {
  0: [
    { q: '축전기에 연결된 전지의 전압을 Δ<i>V</i>에서 3Δ<i>V</i>로 올린다. 전기 용량 <i>C</i>와 각 판의 전하 <i>Q</i>에 대해 옳은 것은 무엇인가?',
      choices: ['<i>C</i>는 세 배가 되고, <i>Q</i>는 변하지 않는다', '<i>C</i>는 변하지 않고, <i>Q</i>는 세 배가 된다', '<i>C</i>는 변하지 않고, <i>Q</i>는 9배가 된다', '<i>C</i>는 3분의 1로 줄고, <i>Q</i>는 변하지 않는다'], answer: 1,
      why: '<p><i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i>는 판과 간격에만 달려 있으므로 변하지 않는다. 그러면 <i>Q</i> = <i>C</i>Δ<i>V</i>는 비례해서 3배가 된다. 9배가 되는 것은 <b>에너지</b> ½<i>C</i>Δ<i>V</i><sup>2</sup>이다.</p>' },
    { q: `본문의 판(<i>C</i> = ${p(C0 * 1e12, 2)} pF)에 연결된 전지의 전압을 ${p(P0.dt, 1)} s 동안 ${P0.V1} V에서 ${P0.V2} V로 일정하게 올린다. 그동안 + 판으로 흘러 들어가는 전류는 얼마인가?`,
      choices: P0.nums.map(x => `${p(x, 1)} pA`), answer: 1, nums: P0.nums,
      why: `<p><i>C</i>가 일정할 때 <i>Q</i> = <i>C</i>Δ<i>V</i>를 미분한다.</p><div class="eq"><i>I</i> = <i>dQ</i>/<i>dt</i> = <i>C</i> <i>d</i>(Δ<i>V</i>)/<i>dt</i> = ${p(C0 * 1e12, 2)} pF × ${p((P0.V2 - P0.V1) / P0.dt, 0)} V/s = ${p(P0.I * 1e12, 1)} pA</div><p>전압의 <b>변화율</b>만 의미가 있다. ${P0.V2} V / ${p(P0.dt, 1)} s(${p(P0.nums[0], 1)} pA)는 전압과 전압의 변화를 혼동한 것이다.</p>` },
  ],
  1: [
    { q: `본문의 판을 간격 ${p(d * 100, 0)} cm에서 ${V0} V로 충전한 뒤 전원을 분리한다. 판을 ${p(P1.d2 * 100, 0)} cm까지 벌리면 전위차는 얼마가 되는가?`,
      choices: P1.nums.map(x => `${p(x, 1)} V`), answer: 3, nums: P1.nums,
      why: `<p>전원을 분리하면 <i>Q</i>가 고정되므로 σ와 <i>E</i> = σ/ε<sub>0</sub> = ${p(M.E0, 0)} V/m는 그대로다. 거리만 커진다.</p><div class="eq">Δ<i>V</i> = <i>Ed</i> = ${p(M.E0, 0)} V/m × ${p(P1.d2, 2)} m = ${p(P1.V, 1)} V</div><p>같은 말로, <i>C</i>가 원래 값의 ${p(d * 100, 0)}/${p(P1.d2 * 100, 0)}로 줄고 Δ<i>V</i> = <i>Q</i>/<i>C</i>는 그 역수만큼 커진다. ${V0} V가 유지되는 것은 전지가 여전히 연결되어 있을 때뿐이다.</p>` },
    { q: `<i>Q</i>가 고정되어 있을 때 간격이 <i>x</i>인 본문의 판의 에너지는 <i>U</i>(<i>x</i>) = <i>Q</i><sup>2</sup><i>x</i>/2ε<sub>0</sub><i>A</i>이다. <i>Q</i> = ${p(Q0 * 1e12, 0)} pC, <i>A</i> = ${p(A, 2)} m²일 때 두 판 사이의 인력은 얼마인가?`,
      choices: P1.fnums.map(x => `${p(x, 3)} µN`), answer: 1, nums: P1.fnums,
      why: `<p>힘은 전하가 고정된 상태에서 에너지 기울기에 음의 부호를 붙인 것이다.</p><div class="eq"><i>F</i> = −<i>dU</i>/<i>dx</i> = −<i>Q</i><sup>2</sup>/2ε<sub>0</sub><i>A</i> = −(${p(Q0 * 1e12, 0)}×10<sup>−12</sup> C)<sup>2</sup> / (2 × ${EPS0} × ${p(A, 2)}) = −${p(P1.F * 1e6, 3)} µN</div><p>음의 부호는 간격을 좁히는 쪽으로 당긴다는 뜻이다. 각 판은 <b>다른</b> 판의 전기장 σ/2ε<sub>0</sub> 속에 있으므로 <i>F</i> = <i>Q</i>(σ/2ε<sub>0</sub>)이다. 틈 전체의 전기장 σ/ε<sub>0</sub>를 쓰면 두 배인 ${p(P1.fnums[0], 3)} µN이 된다.</p>` },
  ],
  2: [
    { q: `본문의 구형 축전기(<i>a</i> = ${sa * 100} cm, <i>b</i> = ${sb * 100} cm, Δ<i>V</i> = ${V0} V)에서 <i>r</i> = ${r2 * 100} cm인 곳의 전기장 크기는 얼마인가?`,
      choices: P2.nums.map(x => `${p(x, 0)} V/m`), answer: 2, nums: P2.nums,
      why: `<p><i>Q</i> = <i>C</i>Δ<i>V</i> = ${p(M.SPH.C * 1e12, 1)} pF × ${V0} V = ${p(M.SPH.Q * 1e9, 3)} nC이고, 가우스 법칙에 따르면 두 구 사이의 전기장은 점전하의 전기장이다.</p><div class="eq"><i>E</i> = <i>kQ</i>/<i>r</i><sup>2</sup> = ${p(K / 1e9, 2)}×10<sup>9</sup> × ${p(M.SPH.Q * 1e9, 3)}×10<sup>−9</sup> / ${r2}<sup>2</sup> = ${p(P2.E, 0)} V/m</div><p>Δ<i>V</i>/(<i>b</i> − <i>a</i>) = ${p(P2.nums[0], 0)} V/m는 균일한 전기장일 때만 맞다. 여기서는 <i>E</i>가 1/<i>r</i><sup>2</sup>로 줄어든다.</p>` },
    { q: `두 구 사이의 ${V0} V 가운데, 틈의 안쪽 절반인 <i>r</i> = ${sa * 100} cm에서 ${r2 * 100} cm까지에 걸린 전압은 얼마인가?`,
      choices: P2.vnums.map(x => `${p(x, 1)} V`), answer: 0, nums: P2.vnums,
      why: `<p>각 구간에서 <i>E</i> = <i>kQ</i>/<i>r</i><sup>2</sup>를 적분한다. 비를 취하면 <i>kQ</i>는 약분된다.</p><div class="eq">Δ<i>V</i><sub>inner</sub> / Δ<i>V</i> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> ÷ ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = (1/<i>a</i> − 1/<i>r</i>)/(1/<i>a</i> − 1/<i>b</i>) = (${p(1 / sa, 2)} − ${p(1 / r2, 2)})/(${p(1 / sa, 2)} − ${p(1 / sb, 2)}) =${p(P2.dV / V0, 3)}</div><p>따라서 ${p(P2.dV, 1)} V이다. 전기장은 공 근처에서 가장 세므로 안쪽 절반이 절반보다 많이 가져간다. ${p(P2.vnums[1], 1)} V는 균일한 전기장을 가정한 값이다.</p>` },
  ],
  3: [
    { q: `본문의 동축 원통(<i>a</i> = ${ca * 100} cm, <i>b</i> = ${cb * 100} cm, <i>L</i> = ${cL * 100} cm, <i>C</i> = ${p(M.CYL.C * 1e12, 1)} pF)의 관을 <i>b</i> = ${cb2 * 100} cm로 넓힌다. 전기 용량은 얼마가 되는가?`,
      choices: P3.nums.map(pF), answer: 2, nums: P3.nums,
      why: `<div class="eq"><i>C</i> = 2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>) = 2π × ${EPS0} × ${cL} / ln(${cb2 * 100}/${ca * 100}) = ${p(P3.C * 1e12, 1)} pF</div><p>ln 4 → ln 8은 3/2배밖에 되지 않으므로 <i>C</i>는 ${p(M.CYL.C * 1e12, 1)} pF의 절반이 아니라 2/3로 줄어든다. <i>C</i>는 로그를 통해서만 <i>b</i>에 의존한다.</p>` },
    { q: `본문의 동축 원통(<i>a</i> = ${ca * 100} cm, <i>b</i> = ${cb * 100} cm)이 대전되어 있다. 저장된 에너지 가운데 축에서 ${2 * ca * 100} cm 이내(<i>r</i> = ${ca * 100} cm에서 ${2 * ca * 100} cm 사이)에 있는 비율은 얼마인가?`,
      choices: P3.fnums.map(x => `${p(x, 1)} %`), answer: 3, nums: P3.fnums,
      why: `<p><i>E</i> = λ/2πε<sub>0</sub><i>r</i>일 때 에너지 밀도에 부피 2π<i>rL dr</i>인 얇은 껍질을 곱한다.</p><div class="eq"><i>dU</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup> · 2π<i>rL dr</i> = (λ<sup>2</sup><i>L</i>/4πε<sub>0</sub>) <i>dr</i>/<i>r</i></div><div class="eq">비율 = ln(2<i>a</i>/<i>a</i>) / ln(<i>b</i>/<i>a</i>) = ln 2 / ln 4 = ${p(P3.frac, 3)}</div><p><i>r</i>가 두 배가 될 때마다 같은 양의 에너지가 들어 있다. 부피로 따지면 ${p(P3.fnums[0], 1)} %에 불과하지만, 전기장은 막대 근처에서 훨씬 세다.</p>` },
  ],
  4: [
    { q: '작은 전하 <i>dq</i>를 하나씩 건너 옮겨 축전기를 0에서 <i>Q</i>까지 충전한다. 전체 일 가운데 전하의 <b>나중</b> 절반, 즉 <i>Q</i>/2에서 <i>Q</i>까지 옮기는 데 드는 비율은 얼마인가?',
      choices: P4.nums.map(x => `${p(x, 1)} %`), answer: 2, nums: P4.nums,
      why: '<p>각 <i>dq</i>에는 Δ<i>V</i> <i>dq</i> = (<i>q</i>/<i>C</i>) <i>dq</i>가 들므로</p><div class="eq"><i>W</i> = ∫<sub><i>Q</i>/2</sub><sup><i>Q</i></sup> (<i>q</i>/<i>C</i>) <i>dq</i> = (<i>Q</i><sup>2</sup> − <i>Q</i><sup>2</sup>/4)/2<i>C</i> = ¾ · <i>Q</i><sup>2</sup>/2<i>C</i></div><p>75 %다. 나중 전하일수록 더 큰 전압을 거슬러 옮기므로 비용이 더 든다. 50 %는 모든 전하를 똑같이 취급한 것이다.</p>' },
    { q: `본문의 판이 ${V0} V 전지에 연결된 채(<i>U</i> = ${p(U0 * 1e9, 1)} nJ) 간격을 ${p(P4b.d2 * 100, 1)} cm로 절반으로 줄인다. 저장된 에너지는 얼마가 되는가?`,
      choices: P4b.nums.map(x => `${p(x, 1)} nJ`), answer: 3, nums: P4b.nums,
      why: `<p>연결되어 있으므로 Δ<i>V</i>가 고정되고, <i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i>는 두 배가 된다.</p><div class="eq"><i>U</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup> = 2<i>U</i><sub>0</sub> = ${p(P4b.U * 1e9, 1)} nJ</div><p>에너지 밀도로 따져도 된다. <i>E</i> = Δ<i>V</i>/<i>d</i>가 두 배가 되어 ½ε<sub>0</sub><i>E</i><sup>2</sup>는 4배가 되고, 부피는 절반이 된다. ${p(P4b.nums[0], 1)} nJ는 <i>Q</i>가 고정된 경우(전원 분리)의 답이다.</p>` },
  ],
  5: [
    { q: `본문의 ${C1 * 1e6} µF와 ${C2 * 1e6} µF 축전기가 ${CV} V에 <b>직렬</b>로 연결되어 있다. ${C1 * 1e6} µF 축전기에 걸린 전압은 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 1)} V`), answer: 0, nums: P5.nums,
      why: `<p>직렬에서는 둘 다 같은 <i>Q</i> = <i>C</i><sub>eq</sub>Δ<i>V</i> = ${p(S.C * 1e6, 3)} µF × ${CV} V = ${p(S.Q * 1e6, 0)} µC를 가지므로</p><div class="eq">Δ<i>V</i><sub>1</sub> = <i>Q</i>/<i>C</i><sub>1</sub> = ${p(S.Q * 1e6, 0)} µC / ${C1 * 1e6} µF = ${p(P5.V1, 1)} V</div><p><b>작은</b> 축전기가 더 큰 몫을 가진다. ${p(P5.nums[1], 1)} V는 거꾸로 나눈 것이다.</p>` },
    { q: `빈 상태의 그 직렬 쌍을 충전할 때 한 일은 0부터 나중 전하까지 ∫ (<i>q</i>/<i>C</i><sub>1</sub> + <i>q</i>/<i>C</i><sub>2</sub>) <i>dq</i>이다. 저장된 전체 에너지는 얼마인가?`,
      choices: P5.unums.map(x => `${p(x, 0)} µJ`), answer: 3, nums: P5.unums,
      why: `<p>매 순간 둘에 같은 <i>q</i>가 있으므로 적분 안에서 전압이 더해진다.</p><div class="eq"><i>U</i> = (<i>Q</i><sup>2</sup>/2)(1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub>) = <i>Q</i><sup>2</sup>/2<i>C</i><sub>eq</sub> = (${p(S.Q * 1e6, 0)} µC)<sup>2</sup>/(2 × ${p(S.C * 1e6, 3)} µF) = ${p(P5.U * 1e6, 0)} µJ</div><p><i>Q</i>Δ<i>V</i> = ${p(P5.unums[0], 0)} µJ는 전지가 공급하는 에너지이며, 그 절반은 도선에서 열로 사라진다. ${p(P5.unums[1], 0)} µJ는 병렬 쌍의 값이다.</p>` },
  ],
  6: [
    { q: `본문의 판을 ${V0} V로 충전하고 전원을 분리한 뒤, κ = ${KA}인 유전체 판으로 틈을 채운다. 전위차는 얼마가 되는가?`,
      choices: P6.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P6.nums,
      why: `<p>고립되어 있으므로 <i>Q</i>는 그대로다. 유전체 판 표면의 속박 전하가 전기장 일부를 상쇄하여 <i>E</i> = <i>E</i><sub>0</sub>/κ가 되므로</p><div class="eq">Δ<i>V</i> = <i>Ed</i> = Δ<i>V</i><sub>0</sub>/κ = ${V0}/${KA} = ${p(P6.V, 1)} V</div><p>같은 말로, <i>C</i>가 κ배 커지고 Δ<i>V</i> = <i>Q</i>/<i>C</i>는 κ배 줄어든다. ${V0} V가 유지되는 것은 전지가 연결되어 있는 동안뿐이다.</p>` },
    { q: `서술형. 본문의 판(<i>A</i> = ${p(A, 2)} m², <i>d</i> = ${p(d * 100, 0)} cm)을 유전 상수가 틈을 가로질러 선형으로 증가하는 유전체, 즉 한 판에서 1, 다른 판에서 3인 κ(<i>x</i>) = 1 + 2<i>x</i>/<i>d</i>로 채운다. 전기 용량을 유도하고 값을 구하라.`,
      solution: `<p>자유 전하 ±<i>Q</i>는 판 위에 있다. 유전체가 있을 때의 가우스 법칙에 따라 깊이 <i>x</i>에서의 전기장은 <i>E</i>(<i>x</i>) = σ/κ(<i>x</i>)ε<sub>0</sub>, σ = <i>Q</i>/<i>A</i>이다. 틈을 가로질러 적분한다.</p><div class="eq">Δ<i>V</i> = ∫<sub>0</sub><sup><i>d</i></sup> σ <i>dx</i> / ε<sub>0</sub>(1 + 2<i>x</i>/<i>d</i>) = (σ<i>d</i>/2ε<sub>0</sub>) ln 3</div><div class="eq"><i>C</i> = <i>Q</i>/Δ<i>V</i> = 2ε<sub>0</sub><i>A</i>/(<i>d</i> ln 3) = (2/ln 3)<i>C</i><sub>0</sub> = ${p(P6b.C / C0, 3)} × ${p(C0 * 1e12, 2)} pF = ${p(P6b.C * 1e12, 2)} pF</div><p>검산: <i>C</i><sub>0</sub>(κ = 1)와 3<i>C</i><sub>0</sub>(κ = 3) 사이에 있고, 단순 평균 2<i>C</i><sub>0</sub>보다 작다. 틈을 가로질러 쌓인 얇은 층들은 <b>직렬</b>로 더해지기 때문이다.</p>`, val: P6b.C },
  ],
  7: [
    { q: `본문의 판이 ${V0} V 전지에 연결된 채(<i>Q</i><sub>0</sub> = ${p(Q0 * 1e12, 0)} pC) κ = ${KA}인 유전체 판이 완전히 미끄러져 들어간다. 전지가 + 판으로 옮기는 전하는 얼마인가?`,
      choices: P7.nums.map(x => `${p(x, 0)} pC`), answer: 3, nums: P7.nums,
      why: `<p>연결되어 있으므로 Δ<i>V</i>는 ${V0} V로 유지되고 <i>C</i>는 κ<i>C</i><sub>0</sub>가 되어, 전하는 κ<i>Q</i><sub>0</sub> = ${p(P7.nums[0], 0)} pC가 된다. 흘러 들어온 것은 그 차이다.</p><div class="eq">Δ<i>Q</i> = (κ − 1)<i>Q</i><sub>0</sub> = ${KA - 1} × ${p(Q0 * 1e12, 0)} pC = ${p(P7.dQ * 1e12, 0)} pC</div><p>${p(P7.nums[0], 0)} pC는 더해진 양이 아니라 나중 전체 전하다.</p>` },
    { q: `본문의 판(한 변 ${p(P7b.side * 100, 0)} cm, 유전체 판이 없을 때 <i>U</i><sub>0</sub> = ${p(U0 * 1e9, 1)} nJ)을 충전한 뒤 전원을 분리한다. κ = ${KA}인 유전체 판이 절반 들어가 있을 때, 깊이 <i>s</i>에 대해 <i>C</i>(<i>s</i>) = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>s</i>/ℓ)이다. 유전체 판을 안으로 끌어당기는 힘은 얼마인가?`,
      choices: P7b.nums.map(x => `${p(x, 1)} nN`), answer: 1, nums: P7b.nums,
      why: `<p><i>Q</i>가 고정되어 있으면 <i>U</i> = <i>Q</i><sup>2</sup>/2<i>C</i>(<i>s</i>)이고, 힘은 에너지 기울기의 내리막 방향이다.</p><div class="eq"><i>F</i> = −<i>dU</i>/<i>ds</i> = (<i>Q</i><sup>2</sup>/2<i>C</i><sup>2</sup>) <i>dC</i>/<i>ds</i> = <i>U</i><sub>0</sub>(κ − 1) / ℓ(1 + (κ − 1)<i>s</i>/ℓ)<sup>2</sup> = ${p(U0 * 1e9, 1)} nJ × ${KA - 1} / (${P7b.side} m × ${p((1 + (KA - 1) * P7b.x) ** 2, 0)}) = ${p(P7b.F * 1e9, 1)} nN</div><p>양수다. 유전체 판이 들어갈수록 <i>U</i>가 줄어들므로 안으로 끌려 들어간다. ${p(P7b.nums[0], 1)} nN은 Δ<i>V</i>가 ${V0} V로 유지될 때의 답인데, 전원을 분리하면 그렇지 않다.</p>` },
  ],
  8: [
    { q: '속이 빈 중성 도체 구의 빈 공간 중심에 점전하 +<i>q</i>가 있다. 평형 상태에서 안쪽 표면과 바깥쪽 표면의 전하는 각각 얼마인가?',
      choices: ['안쪽 0, 바깥쪽 0', '안쪽 −<i>q</i>, 바깥쪽 0', '안쪽 −<i>q</i>, 바깥쪽 +<i>q</i>', '안쪽 +<i>q</i>, 바깥쪽 −<i>q</i>'], answer: 2,
      why: '<p>금속 안의 가우스 면 위에서는 <i>E</i> = 0이므로 그 안의 전하는 0이다. 따라서 안쪽 표면에 −<i>q</i>가 있어야 한다. 껍질은 중성이므로 바깥쪽 표면에 +<i>q</i>가 남는다. 바깥의 전기장은 중심에 있는 +<i>q</i>의 전기장과 같다.</p>' },
    { q: `본문의 중성 구(<i>R</i> = ${p(cR * 100, 0)} cm, <i>E</i><sub>0</sub> = ${cE} V/m)의 표면 전하 밀도는 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ이다. 전기장이 향하는 쪽을 바라보는 절반(0 ≤ θ ≤ 90°)의 전체 전하는 얼마인가?`,
      choices: P8.nums.map(x => `${p(x, 3)} nC`), answer: 3, nums: P8.nums,
      why: `<p>폭이 <i>R dθ</i>인 고리의 넓이는 2π<i>R</i><sup>2</sup> sin θ <i>dθ</i>이다.</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i><sup>2</sup> sin θ <i>dθ</i> = 3ε<sub>0</sub><i>E</i><sub>0</sub>π<i>R</i><sup>2</sup> = ${p(P8.q * 1e9, 3)} nC</div><p>반구 넓이에 대한 cos θ의 평균은 ½이므로, σ<sub>max</sub> × 2π<i>R</i><sup>2</sup>(${p(P8.nums[0], 3)} nC)는 두 배 많다. 구 <b>전체</b>로는 합이 0이다.</p>` },
  ],
};
