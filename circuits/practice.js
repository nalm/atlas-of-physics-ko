// circuits/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { CU, E_CH } = M;

// ---- page 0: drift speed in a round copper wire; charge from a changing current ----
const P0 = { I: 3.0, D: 2.0e-3 };
const vd = A => P0.I / (CU.n * E_CH * A);
P0.v = vd(Math.PI * (P0.D / 2) ** 2);
P0.nums = [P0.v, vd(Math.PI * P0.D ** 2), vd(P0.D ** 2), vd((P0.D / 2) ** 2)].map(x => x * 1e3);   // right · diameter as radius · A = D² · forgot π
const P0b = { a: 4.0, b: 1.0, T: 4.0 };                     // I = a t − b t² (A), 0 to T
P0b.q = P0b.a * P0b.T ** 2 / 2 - P0b.b * P0b.T ** 3 / 3;
P0b.Imax = P0b.a ** 2 / (4 * P0b.b);
P0b.nums = [P0b.Imax * P0b.T, P0b.Imax * P0b.T / 2, P0b.q, P0b.a * P0b.T ** 2 / 2];   // peak × time · triangle · right · dropped the t² term
// ---- page 1: the page's thin nichrome wire; a tapered one ----
const { rho } = M.RES, L1 = 2.0, rA = M.RES.dThin / 2, rB = M.RES.dThick / 2;
const P1 = { R: M.rThin(L1) };
P1.nums = [rho * L1 / (Math.PI * M.RES.dThin ** 2), rho * L1 / rA ** 2, P1.R, rho * L1 / M.RES.dThin ** 2];   // diameter as radius · forgot π · right · A = d²
const P1b = { R: rho * L1 / (Math.PI * rA * rB) };
P1b.nums = [rho * L1 / (Math.PI * ((rA + rB) / 2) ** 2), (M.rThin(L1) + M.rThick(L1)) / 2, M.rThin(L1), P1b.R];   // mean radius · mean of the ends · thin end only · right
// ---- page 2: a hollow carbon cylinder, current flowing radially ----
const P2 = { rho: 3.5e-5, a: 0.010, b: 0.020, L: 0.050 };
P2.R = P2.rho * Math.log(P2.b / P2.a) / (2 * Math.PI * P2.L);
P2.nums = [P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.a * P2.L), P2.R, P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.b * P2.L), P2.rho * P2.L / (Math.PI * (P2.b ** 2 - P2.a ** 2))].map(x => x * 1e5);
// inner area only · right · outer area only · current along the axis instead
// ---- page 3: two of the page's bulbs in series; a ramped voltage ----
const { E: VB, R: RB } = M.BULB;
const P3 = { P: VB ** 2 / (2 * RB) };
P3.nums = [2 * VB ** 2 / RB, VB ** 2 / RB, P3.P, VB ** 2 / (4 * RB)];   // parallel · one bulb · right · each bulb
const P3b = { T: 10 };
P3b.E = VB ** 2 / RB * P3b.T / 3;
P3b.nums = [VB ** 2 / RB * P3b.T / 2, P3b.E, VB ** 2 / RB * P3b.T, (VB / 2) ** 2 / RB * P3b.T];   // average P linear · right · full P · P at the average V
// ---- page 4: the page's cell on 4 Ω; what r is best ----
const { E: EC, r: rC } = M.CELL, RL4 = 4;
const P4 = { V: EC * RL4 / (RL4 + rC) };
P4.nums = [EC, EC * rC / (RL4 + rC), P4.V, EC / 2];                 // ideal · the Ir drop · right · half
// ---- page 5: strips side by side ----
const P5 = { R0: 12 };
P5.R = P5.R0 / 2;                                                    // σ averages 2σ₀ across the width
P5.nums = [P5.R0 * Math.log(3) / 2, P5.R0 / 3, P5.R, P5.R0];         // strips in series · edge at 3σ₀ · right · σ₀ throughout
// ---- page 6: the page's combination with R₃ broken; R₃ as a variable resistor ----
const CB = M.COMBO;
const P6 = { I: CB.E / (CB.R1 + CB.R245) };
P6.nums = [CB.E / CB.Req, P6.I, CB.E / CB.R1, CB.E / CB.R245];      // unchanged · right · R₁ only · the 8 Ω only
const P6b = { R: CB.R1 * CB.R245 / (CB.R1 + CB.R245) };
P6b.nums = [P6b.R, CB.R1, CB.R245, CB.R1 + CB.R245];                 // right · R₁ only · the branch only · in series
// ---- page 7: the page's network with the 6 V battery replaced by a wire ----
const K7 = M.KIRCH, R345 = 1 / (1 / K7.R5 + 1 / (K7.R3 + K7.R4));
const P7 = { I: K7.E1 / (K7.R1 + K7.R2 + R345) };
const I1now = M.edgeI(K7, M.solve(K7.edges, 'bl'), 'R1');
P7.nums = [I1now, P7.I, K7.E1 / (K7.R1 + K7.R2), K7.E1 / (K7.R1 + K7.R2 + K7.R3 + K7.R4)].map(x => x * 1e3);   // unchanged · right · R₅ a short · R₅ ignored
const P7b = { dI: 1 / 44, E2zero: -2.4 };                            // from the solution below; checked numerically
// ---- page 8: the page's RC circuit ----
const { E: ER, tau } = M.RC, V8 = 9.0;
const P8 = { t: -tau * Math.log(1 - V8 / ER) };
P8.nums = [tau * Math.log(ER / V8), P8.t, tau * V8 / ER, tau];   // ln upside down · right · linear · τ
const P8b = { f: 1 - Math.exp(-2) };
P8b.nums = [(1 - Math.exp(-1)) * 100, P8b.f * 100, Math.exp(-1) * 100, 50];   // used e^(−t/RC) for the energy · right · what's left of q · half

export const PRACTICE = {
  0: [
    { q: `<b>지름</b> ${p(P0.D * 1e3, 1)} mm인 구리 도선에 ${p(P0.I, 1)} A의 전류가 흐른다(<i>n</i> = 8.5 × 10<sup>28</sup> m<sup>−3</sup>). 전자의 유동 속력은 얼마인가?`,
      choices: P0.nums.map(x => `${p(x, 4)} mm/s`), answer: 0, nums: P0.nums,
      why: `<p>넓이는 <b>반지름</b>으로 구한다: <i>A</i> = π(${p(P0.D / 2 * 1e3, 1)} mm)<sup>2</sup> = ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)} mm². 그러면</p><div class="eq"><i>v</i><sub>d</sub> = <i>I</i>/<i>neA</i> = ${P0.I} / (8.5×10<sup>28</sup> × 1.60×10<sup>−19</sup> × ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)}×10<sup>−6</sup>) = ${p(P0.v * 1e3, 4)} mm/s</div><p>지름을 반지름으로 쓰면 ${p(P0.nums[1], 4)} mm/s가 나와 네 배나 느리게 된다.</p>` },
    { q: `도선의 전류가 <i>t</i> = 0부터 ${p(P0b.T, 1)} s까지 <i>I</i>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i> − ${p(P0b.b, 1)}<i>t</i><sup>2</sup> (A, <i>t</i>의 단위는 s)이다. 한 단면을 지나가는 전하량은 얼마인가?`,
      choices: P0b.nums.map(x => `${p(x, 1)} C`), answer: 2, nums: P0b.nums,
      why: `<div class="eq"><i>q</i> = ∫<i>I dt</i> = ∫<sub>0</sub><sup>${P0b.T}</sup> (${P0b.a}<i>t</i> − <i>t</i><sup>2</sup>) <i>dt</i> = ${p(P0b.a / 2, 0)}(${P0b.T})<sup>2</sup> − (${P0b.T})<sup>3</sup>/3 = ${p(P0b.a * P0b.T ** 2 / 2, 0)} − ${p(P0b.b * P0b.T ** 3 / 3, 2)} = ${p(P0b.q, 1)} C</div><p>꼭짓점이 ${p(P0b.Imax, 0)} A인 포물선 <i>I</i>(<i>t</i>) 그래프 아래 넓이다. 최댓값 × 시간(${p(P0b.nums[0], 1)} C)은 너무 크게, 삼각형(${p(P0b.nums[1], 1)} C)은 너무 작게 센다.</p>` },
  ],
  1: [
    { q: `이 페이지의 가는 니크롬선(ρ = 1.10 × 10<sup>−6</sup> Ω·m, <b>지름</b> ${p(M.RES.dThin * 1e3, 1)} mm)의 길이가 ${p(L1, 1)} m이다. 저항은 얼마인가?`,
      choices: P1.nums.map(x => `${p(x, 2)} Ω`), answer: 2, nums: P1.nums,
      why: `<div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = ρ<i>L</i>/π<i>r</i><sup>2</sup> = 1.10×10<sup>−6</sup> × ${L1} / (π × (${p(rA * 1e3, 2)}×10<sup>−3</sup>)<sup>2</sup>) = ${p(P1.R, 2)} Ω</div><p>반지름은 지름의 절반이다. 지름을 쓰면 정답의 4분의 1인 ${p(P1.nums[0], 2)} Ω이 나온다.</p>` },
    { q: `길이 ${p(L1, 1)} m의 니크롬 막대가 점점 굵어진다. 반지름이 한쪽 끝의 ${p(rA * 1e3, 2)} mm에서 반대쪽 끝의 ${p(rB * 1e3, 2)} mm까지 선형으로 커진다. 양 끝 사이의 저항은 얼마인가?`,
      choices: P1b.nums.map(x => `${p(x, 2)} Ω`), answer: 3, nums: P1b.nums,
      why: `<p>얇은 조각 <i>dx</i>들은 직렬이다. 각각 <i>dR</i> = ρ <i>dx</i>/π<i>r</i>(<i>x</i>)<sup>2</sup>이고, <i>r</i> = <i>a</i> + (<i>b</i> − <i>a</i>)<i>x</i>/<i>L</i>이므로 <i>dx</i> = <i>L dr</i>/(<i>b</i> − <i>a</i>)이다.</p><div class="eq"><i>R</i> = (ρ<i>L</i>/π(<i>b</i> − <i>a</i>)) ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = ρ<i>L</i>/π<i>ab</i> = ${p(P1b.R, 2)} Ω</div><p>평균 반지름(${p(P1b.nums[0], 2)} Ω)도, 양 끝 값의 평균(${p(P1b.nums[1], 2)} Ω)도 아니다. 가는 쪽이 지배적이지만 전부는 아니다.</p>` },
  ],
  2: [
    { q: '이 페이지의 회로(6 V 전지, 3 Ω 저항, 이상적인 도선)에서 전지의 + 단자와 저항을 잇는 도선의 양 끝 사이 전위차는 얼마인가?',
      choices: ['6 V', '3 V', '2 V', '0 V'], answer: 3,
      why: '<p>이상적인 도선은 <i>R</i> = 0이므로 전류가 얼마든 도선을 따라 Δ<i>V</i> = <i>IR</i> = 0이다. 그 도선의 모든 점은 전지의 + 전위에 있고, 6 V 강하는 모두 저항에서 일어난다.</p>' },
    { q: `탄소 관(ρ = ${p(P2.rho * 1e5, 1)} × 10<sup>−5</sup> Ω·m)의 안쪽 반지름은 ${p(P2.a * 100, 0)} cm, 바깥쪽 반지름은 ${p(P2.b * 100, 0)} cm, 길이는 ${p(P2.L * 100, 0)} cm이다. 전류가 안쪽 면에서 바깥쪽 면으로 <b>반지름 방향</b>으로 흐를 때 저항은 얼마인가?`,
      choices: P2.nums.map(x => `${p(x, 2)} × 10<sup>−5</sup> Ω`), answer: 1, nums: P2.nums,
      why: `<p>얇은 원통 껍질들은 직렬이다. 각 껍질은 전류 방향 길이가 <i>dr</i>, 넓이가 2π<i>rL</i>이다.</p><div class="eq"><i>R</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> ρ <i>dr</i>/2π<i>rL</i> = (ρ/2π<i>L</i>) ln(<i>b</i>/<i>a</i>) = ${p(P2.R * 1e5, 2)} × 10<sup>−5</sup> Ω</div><p>넓이가 <i>r</i>에 따라 커지므로 안쪽 넓이(${p(P2.nums[0], 2)})도 바깥쪽 넓이(${p(P2.nums[2], 2)})도 맞지 않다.</p>` },
  ],
  3: [
    { q: `이 페이지의 전구(각 ${RB} Ω) 두 개를 ${VB} V 전지에 <b>직렬</b>로 연결한다. 두 전구가 쓰는 전체 전력은 얼마인가?`,
      choices: P3.nums.map(x => `${p(x, 1)} W`), answer: 2, nums: P3.nums,
      why: `<p>직렬이므로 <i>R</i><sub>eq</sub> = ${2 * RB} Ω이고,</p><div class="eq"><i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i><sub>eq</sub> = ${VB}<sup>2</sup>/${2 * RB} = ${p(P3.P, 1)} W</div><p>전구 하나만 있을 때(${p(P3.nums[1], 1)} W)의 절반이다. 전류가 절반이 되어 각 전구는 4분의 1의 전력(${p(P3.nums[3], 1)} W)을 받는다. 병렬이라면 ${p(P3.nums[0], 1)} W를 쓴다.</p>` },
    { q: `${RB} Ω 저항에 걸린 전압이 ${P3b.T} s 동안 0에서 ${VB} V까지 일정하게 증가한다. 그동안 저항이 열로 바꾸는 에너지는 얼마인가?`,
      choices: P3b.nums.map(x => `${p(x, 1)} J`), answer: 1, nums: P3b.nums,
      why: `<p>Δ<i>V</i> = (${VB}/${P3b.T})<i>t</i>이므로 <i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i>은 <i>t</i><sup>2</sup>에 비례해 커진다.</p><div class="eq"><i>E</i> = ∫<i>P dt</i> = ∫<sub>0</sub><sup><i>T</i></sup> (${VB}<i>t</i>/${P3b.T})<sup>2</sup>/${RB} <i>dt</i> = (${VB}<sup>2</sup>/${RB})·<i>T</i>/3 = ${p(P3b.E, 1)} J</div><p><i>P</i>를 선형으로 평균하거나(${p(P3b.nums[0], 1)} J) 평균 전압을 쓰면(${p(P3b.nums[3], 1)} J) <i>P</i>가 Δ<i>V</i>의 제곱에 비례한다는 점을 놓친다.</p>` },
  ],
  4: [
    { q: `이 페이지의 전지(ℰ = ${EC} V, <i>r</i> = ${rC} Ω)가 ${RL4} Ω 전구에 전류를 보낸다. 전지 단자 사이의 전위차는 얼마인가?`,
      choices: P4.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P4.nums,
      why: `<div class="eq"><i>I</i> = ℰ/(<i>R</i> + <i>r</i>) = ${EC}/${RL4 + rC} = ${p(EC / (RL4 + rC), 1)} A, &nbsp; Δ<i>V</i> = ℰ − <i>Ir</i> = ${EC} − ${p(EC / (RL4 + rC) * rC, 1)} = ${p(P4.V, 1)} V</div><p>기전력이 단자 전압과 같은 것은 전류가 흐르지 않을 때뿐이다. ${p(P4.nums[1], 1)} V는 전지 <i>내부</i>의 전압 강하다.</p>` },
    { q: `이번에는 전구를 <i>R</i> = ${RL4} Ω으로 고정하고 전지의 내부 저항 <i>r</i>를 고를 수 있다(ℰ는 같음). 전구를 가장 밝게 하는 <i>r</i>는 무엇인가?`,
      choices: [`<i>r</i> = ${2 * RL4} Ω`, `<i>r</i> = ${RL4} Ω, 부하와 일치`, `<i>r</i> = ${RL4 / 2} Ω`, '<i>r</i> = 0'], answer: 3,
      why: `<p><i>P</i> = ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>2</sup>이고, 이제 변수는 <i>r</i>이다.</p><div class="eq"><i>dP</i>/<i>dr</i> = −2ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>3</sup> < 0</div><p>모든 <i>r</i>에서 이러하므로 <i>P</i>는 <i>r</i>가 가장 작을 때, 곧 0일 때 최대다. <i>R</i> = <i>r</i>가 전력을 최대로 하는 것은 전지를 고정하고 <b>부하</b>를 바꿀 때이지, 그 반대가 아니다.</p>` },
  ],
  5: [
    { q: '이상적인 9 V 전지에 연결된 이 페이지의 2, 4, 6 Ω 저항에 네 번째 저항을 병렬로 추가한다. (i) 2 Ω 가지의 전류와 (ii) 전지에서 나오는 전류는 어떻게 되는가?',
      choices: ['(i) 증가; (ii) 증가', '(i) 그대로; (ii) 증가', '(i) 감소; (ii) 증가', '(i) 감소; (ii) 그대로'], answer: 1,
      why: '<p>각 가지에는 여전히 9 V 전체가 걸리므로 2 Ω 가지의 전류는 9/2 = 4.5 A 그대로다. 새 가지가 제 몫의 전류를 더하고, 전지는 그 합을 공급한다. 경로가 많아지면 <i>R</i><sub>eq</sub>가 작아지고 전체 전류가 커진다. (내부 저항이 있다면 단자 전압이 처져 가지 전류가 조금 줄어든다.)</p>' },
    { q: `전기 전도도가 σ<sub>0</sub>로 균일한 막대라면 양 끝 사이 저항이 ${P5.R0} Ω이다. 그런데 이 막대의 전도도가 <b>폭 방향으로</b> 한쪽 가장자리의 σ<sub>0</sub>에서 반대쪽 가장자리의 3σ<sub>0</sub>까지 선형으로 커진다. 양 끝 사이 저항은 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 2)} Ω`), answer: 2, nums: P5.nums,
      why: `<p>폭이 <i>dy</i>인 길이 방향 띠들은 모두 같은 두 끝 사이에 걸쳐 있다. 즉 <b>병렬</b>이므로 컨덕턴스가 더해진다.</p><div class="eq">1/<i>R</i> = ∫<sub>0</sub><sup><i>w</i></sup> σ(<i>y</i>)<i>t dy</i>/<i>L</i> = (σ<sub>0</sub><i>wt</i>/<i>L</i>)·∫<sub>0</sub><sup>1</sup>(1 + 2<i>u</i>) <i>du</i> = 2/<i>R</i><sub>0</sub></div><p><i>R</i> = ${P5.R0}/2 = ${p(P5.R, 2)} Ω. 띠들을 직렬처럼 더하면 (ln 3/2)<i>R</i><sub>0</sub> = ${p(P5.nums[0], 2)} Ω이 나온다.</p>` },
  ],
  6: [
    { q: `이 페이지의 조합 회로(9 V; R<sub>1</sub> = 2 Ω, R<sub>3</sub> = 2 Ω, R<sub>2</sub> + R<sub>4</sub> + R<sub>5</sub> = ${CB.R245} Ω)에서 R<sub>3</sub>가 타서 끊어진다(개방). R<sub>1</sub>에 흐르는 전류는 얼마가 되는가?`,
      choices: P6.nums.map(x => `${p(x, 2)} A`), answer: 1, nums: P6.nums,
      why: `<p>R<sub>3</sub>가 없어지면 R<sub>1</sub>과 ${CB.R245} Ω 줄은 그냥 직렬이다.</p><div class="eq"><i>I</i> = 9 V / (2 + ${CB.R245}) Ω = ${p(P6.I, 2)} A</div><p>이전의 ${p(P6.nums[0], 2)} A보다 작다. 병렬 경로를 없애면 <i>R</i><sub>eq</sub>가 <i>커진다</i>.</p>` },
    { q: 'R<sub>3</sub>를 가변 저항 <i>x</i>로 바꾸고 나머지는 그대로 둔다. <i>x</i>에서 소비되는 전력이 최대가 되는 <i>x</i>는 얼마인가?',
      choices: P6b.nums.map(x => `${p(x, 1)} Ω`), answer: 0, nums: P6b.nums,
      why: `<p><i>x</i>에서 보면 나머지는 전지와 함께인 R<sub>1</sub>이 ${CB.R245} Ω 줄과 병렬로 연결된 것이다. <i>x</i>를 떼어 냈을 때의 전압은 ℰ<sub>th</sub> = 9 × ${CB.R245}/${CB.R1 + CB.R245} = ${p(9 * CB.R245 / (CB.R1 + CB.R245), 1)} V, 저항은 <i>R</i><sub>th</sub> = 2 × ${CB.R245}/(2 + ${CB.R245}) = ${p(P6b.R, 1)} Ω이다. 그러면</p><div class="eq"><i>P</i>(<i>x</i>) = ℰ<sub>th</sub><sup>2</sup><i>x</i>/(<i>R</i><sub>th</sub> + <i>x</i>)<sup>2</sup>, &nbsp; <i>dP</i>/<i>dx</i> = 0 → <i>x</i> = <i>R</i><sub>th</sub> = ${p(P6b.R, 1)} Ω</div><p>R<sub>1</sub>만(2 Ω) 보면 ${CB.R245} Ω 줄도 <i>x</i> 양단에 연결되어 있다는 점을 무시하게 된다.</p>` },
  ],
  7: [
    { q: `이 페이지의 회로망에서 ${K7.E2} V 전지를 그냥 도선으로 바꾼다. ${K7.E1} V 전지에 흐르는 전류(<i>I</i><sub>1</sub>)는 얼마가 되는가?`,
      choices: P7.nums.map(x => `${p(x, 0)} mA`), answer: 1, nums: P7.nums,
      why: `<p>전지가 하나만 남으면 회로망을 줄일 수 있다. R<sub>3</sub> + R<sub>4</sub> = ${K7.R3 + K7.R4} Ω과 R<sub>5</sub> = ${K7.R5} Ω의 병렬은 ${p(R345, 3)} Ω이고, 이것이 R<sub>1</sub> + R<sub>2</sub> = ${K7.R1 + K7.R2} Ω과 직렬이다.</p><div class="eq"><i>I</i><sub>1</sub> = ${K7.E1} V / ${p(K7.R1 + K7.R2 + R345, 3)} Ω = ${p(P7.I * 1e3, 0)} mA</div><p>${p(I1now * 1e3, 0)} mA에서 줄었다. 중첩 원리로 보면 6 V 전지(+ 극이 아래)가 <i>I</i><sub>1</sub>에 ${p((I1now - P7.I) * 1e3, 0)} mA를 더하고 있었던 것이다. R<sub>5</sub>를 단락으로 취급하면 ${p(P7.nums[2], 0)} mA, 빼 버리면 ${p(P7.nums[3], 0)} mA가 나온다.</p>` },
    { q: `서술형. 이 페이지의 회로망에서 두 번째 전지의 기전력 ℰ<sub>2</sub>(그림처럼 + 극이 아래)를 변수로 둔다. 페이지의 두 고리 방정식과 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>를 이용해 <i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub>와, <i>I</i><sub>3</sub> = 0이 되는 ℰ<sub>2</sub>를 구하라.`,
      solution: `<p>고리 1: 20<i>I</i><sub>1</sub> + 5<i>I</i><sub>2</sub> = 12. 고리 2: 40<i>I</i><sub>3</sub> − 5<i>I</i><sub>2</sub> = ℰ<sub>2</sub>. 고리 1에 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>를 대입하면</p><div class="eq">25<i>I</i><sub>2</sub> + 20<i>I</i><sub>3</sub> = 12 &nbsp;→&nbsp; <i>I</i><sub>2</sub> = (12 − 20<i>I</i><sub>3</sub>)/25</div><div class="eq">40<i>I</i><sub>3</sub> − (12 − 20<i>I</i><sub>3</sub>)/5 = ℰ<sub>2</sub> &nbsp;→&nbsp; <i>I</i><sub>3</sub> = (ℰ<sub>2</sub> + 2.4)/44</div><p>따라서 <i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub> = 1/44 A/V = 볼트당 ${p(P7b.dI * 1e3, 1)} mA이다. 회로가 선형이므로 이 값은 모든 ℰ<sub>2</sub>에서 성립한다. ℰ<sub>2</sub> = 6 V이면 <i>I</i><sub>3</sub> = 8.4/44 = ${p(8.4 / 44, 3)} A로 페이지의 값과 같다. <i>I</i><sub>3</sub> = 0은 ℰ<sub>2</sub> = ${p(P7b.E2zero, 1)} V일 때, 곧 + 극이 <b>위</b>에 있는 2.4 V 전지일 때다. 이 전지가 R<sub>5</sub>에 걸리는 12 V 전지의 밀어내기를 정확히 상쇄한다.</p>`, val: P7b },
  ],
  8: [
    { q: `이 페이지의 RC 회로(ℰ = ${ER} V, τ = <i>RC</i> = ${p(tau, 1)} s)에서 빈 축전기로 시작할 때, 축전기 전압이 ${p(V8, 1)} V에 이르기까지 얼마나 걸리는가?`,
      choices: P8.nums.map(x => `${p(x, 2)} s`), answer: 1, nums: P8.nums,
      why: `<div class="eq">Δ<i>V</i><sub>C</sub> = ℰ(1 − e<sup>−<i>t</i>/τ</sup>) &nbsp;→&nbsp; <i>t</i> = −τ ln(1 − Δ<i>V</i><sub>C</sub>/ℰ) = ${p(tau, 1)} s × ln ${p(ER / (ER - V8), 0)} = ${p(P8.t, 2)} s</div><p>선형이 아니다(${p(P8.nums[2], 2)} s). 축전기가 찰수록 충전이 느려진다. τ 한 번으로는 ${ER} V의 63 %까지만 간다.</p>` },
    { q: '이번에는 가득 찬 축전기가 <i>R</i>를 통해 방전한다. 시간 상수 한 번이 지난 뒤, 저장된 에너지의 몇 분의 몇이 <i>R</i>에서 열로 바뀌었는가?',
      choices: P8b.nums.map(x => `${p(x, 1)} %`), answer: 1, nums: P8b.nums,
      why: `<p>전류가 <i>I</i><sub>0</sub>e<sup>−<i>t</i>/τ</sup>이므로 전력 <i>I</i><sup>2</sup><i>R</i>는 두 배 빨리 줄어든다.</p><div class="eq"><i>E</i> = ∫<sub>0</sub><sup>τ</sup> <i>I</i><sub>0</sub><sup>2</sup><i>R</i> e<sup>−2<i>t</i>/τ</sup> <i>dt</i> = ½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ(1 − e<sup>−2</sup>) = <i>U</i><sub>0</sub>(1 − e<sup>−2</sup>)</div><p>(½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ = <i>Q</i><sup>2</sup>/2<i>C</i> = <i>U</i><sub>0</sub>.) 따라서 ${p(P8b.f * 100, 1)} %이다. 전하는 36.8 %로 줄었지만 에너지는 <i>q</i><sup>2</sup>에 비례하므로 e<sup>−2</sup> = ${p(Math.exp(-2) * 100, 1)} %만 남는다.</p>` },
  ],
};
