// magnetism/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { MU0, QE, MP } = M;
const k2 = MU0 / (2 * Math.PI);                                       // μ₀/2π = 2×10⁻⁷ T·m/A

// ---- page 0: flux through a dome in a uniform field ----
const P0 = { B: 0.40, R: 0.050 };
P0.phi = P0.B * Math.PI * P0.R ** 2;
P0.nums = [P0.B * 2 * Math.PI * P0.R ** 2, 0, P0.phi, P0.B * 4 * Math.PI * P0.R ** 2].map(x => x * 1e3);   // dome's area · closed-surface zero · right · whole sphere
// ---- page 1: the force averaged over the page's sweep of θ ----
const F1 = M.RHR.Fmax;
const P1 = { avg: 2 / Math.PI * F1 };
P1.nums = [F1 / 2, P1.avg, F1, F1 / Math.SQRT2].map(x => x / 1e-14);    // linear in θ · right · peak · rms
// ---- page 2: a deuteron through the page's 200 V ----
const rp = M.CYC.r[1];
const P2 = { m: 2 * MP, V: M.CYC.dV[1] };
P2.r = Math.sqrt(2 * P2.m * QE * P2.V) / (QE * M.CYC.B);
P2.nums = [2 * rp, rp, rp / Math.SQRT2, P2.r].map(x => x * 100);       // r ∝ m · unchanged · upside down · right
// ---- page 3: the page's selector ----
const { E: SE, B: SB, v0 } = M.SEL;
const P3 = { v: 1.25 * v0 };
P3.F = QE * (P3.v * SB - SE);
P3.nums = [QE * SE, P3.F, QE * P3.v * SB, QE * (P3.v * SB + SE)].map(x => x / 1e-17);   // qE only · right · qvB only · added
const S0 = M.SEL.paths[0], s0 = S0[S0.length - 1];
const P3b = { vi: M.SEL.k[0] * v0, dy: +Math.abs(s0.p[1] * 100).toFixed(3) / 100 };   // the drop as shown, from the model's path
P3b.v = Math.sqrt(P3b.vi ** 2 + 2 * QE * SE * P3b.dy / MP);
P3b.nums = [P3b.vi, Math.sqrt(P3b.vi ** 2 - 2 * QE * SE * P3b.dy / MP), P3b.v, v0].map(x => x / 1e4);   // unchanged · sign · right · E/B
// ---- page 4: turning the page's loop over; a semicircular wire ----
const { mu, B: LB } = M.LOOP;
const P4 = { W: 2 * mu * LB };
P4.nums = [mu * LB, Math.PI * mu * LB, 0, P4.W];                      // only to 90° · τ_max × π · start = end? · right
const P4b = { I: 2.0, R: 0.10, B: 0.50 };
P4b.F = 2 * P4b.I * P4b.R * P4b.B;
P4b.nums = [Math.PI * P4b.I * P4b.R * P4b.B, P4b.F, 0, P4b.I * P4b.R * P4b.B];   // arc length · right · cancels · radius
// ---- page 5: inside the page's thick wire; the page's rectangle ----
const { I: AI, a: Aa } = M.AMP, r5 = 0.005;
const P5 = { B: MU0 * AI * r5 / (2 * Math.PI * Aa ** 2) };
P5.nums = [k2 * AI / r5, k2 * AI / Aa, k2 * AI * r5 ** 2 / Aa ** 3, P5.B].map(x => x * 1e6);   // outside formula · surface value · ∝ r² · right
const { a: Fa, c: Fc, b: Fb } = M.FLUX, area5 = Fb * Fc;
P5.fnums = [k2 * AI / (Fa + Fc / 2) * area5, k2 * AI / Fa * area5, M.FLUX.phi, k2 * AI / (Fa + Fc) * area5].map(x => x * 1e6);   // B at the middle · near side · right · far side
// ---- page 6: the page's ring on its axis; a semicircle with radial leads ----
const { R: RR, I: RI, Bc } = M.RING;
const P6 = { B: M.ringAxis(RR) };
P6.nums = [P6.B, Bc / 2, Bc, Bc / 4].map(x => x * 1e6);              // right · halved · centre · 1/z²
const P6b = { B: Bc / 2 };
P6b.nums = [Bc, Bc / 2 + k2 * RI / RR, P6b.B, k2 * RI / RR].map(x => x * 1e6);   // whole loop · leads added · right · leads only
// ---- page 7: a rod perpendicular to a long wire ----
const P7 = { I1: M.WIRES.I, I2: M.WIRES.I, r1: 0.05, r2: 0.25 };
P7.F = k2 * P7.I1 * P7.I2 * Math.log(P7.r2 / P7.r1);
const L7 = P7.r2 - P7.r1;
P7.nums = [P7.F, k2 * P7.I1 / ((P7.r1 + P7.r2) / 2) * P7.I2 * L7, k2 * P7.I1 / P7.r1 * P7.I2 * L7, k2 * P7.I1 / P7.r2 * P7.I2 * L7].map(x => x * 1e3);   // right · B at the middle · near end · far end
// ---- page 8: the page's toroid at 12 cm; the end of the page's solenoid ----
const { N: TN, I: TI, R0 } = M.TOR, r8 = 0.12;
const P8 = { B: MU0 * TN * TI / (2 * Math.PI * r8) };
P8.nums = [MU0 * TN * TI / (2 * Math.PI * M.TOR.a), 0, MU0 * TN * TI / (2 * Math.PI * R0), P8.B].map(x => x * 1e6);   // used the tube radius · "outside" · mean radius · right
const { L: SL, R: SR } = M.SOL;
const P8b = { B: M.SOL.B / 2 * SL / Math.hypot(SL, SR) };
P8b.nums = [P8b.B, M.SOL.B, M.SOL.B / 4, 0].map(x => x * 1e6);       // right · the long-solenoid value · quarter · "outside"

export const PRACTICE = {
  0: [
    { q: '닫힌 상자가 이 페이지 막대자석의 N극 끝만 둘러싸고 있다. 상자에서 나가는 알짜 자기 선속은 어떠한가?',
      choices: ['0: 들어오는 선속과 나가는 선속이 같다', '양: 자기력선이 N극에서 나간다', '음: 자석 안쪽의 자기장이 상자 안으로 들어간다', '양이며, 상자가 클수록 크다'], answer: 0,
      why: '<p>자기 전하가 없으므로 어떤 닫힌 곡면에서도 ∮<b>B</b>·<i>d</i><b>A</b> = 0이다. 자기력선이 바깥 면들로 나가지만, 자석을 가로지르는 면으로 꼭 그만큼 들어온다. 그 면에서 자석 안쪽의 자기장은 S에서 N으로, 곧 N극 끝을 향해 흐른다. 극은 전하가 <b>E</b>의 원천인 것처럼 <b>B</b>의 원천이 아니다.</p>' },
    { q: `균일한 ${p(P0.B, 2)} T 자기장이 연직 위를 향한다. 반지름 ${p(P0.R * 100, 0)} cm인 열린 반구형 돔이 평평한 탁자 위에 볼록한 쪽을 위로 하여 놓여 있다. 곡면을 통해 나가는 자기 선속은 얼마인가?`,
      choices: P0.nums.map(x => `${p(x, 2)} mWb`), answer: 2, nums: P0.nums,
      why: `<p>돔과 그 아래 평평한 원판을 합치면 닫힌 곡면이므로 두 선속은 상쇄된다. 곧 돔에서 나가는 선속은 원판으로 들어오는 선속 <i>B</i>π<i>R</i><sup>2</sup>와 같다. 또는 연직에서 잰 θ로 적분하면</p><div class="eq">Φ = ∫ <i>B</i> cos θ · 2π<i>R</i><sup>2</sup> sin θ <i>d</i>θ (0부터 π/2까지) = <i>B</i>π<i>R</i><sup>2</sup> = ${p(P0.phi * 1e3, 2)} mWb</div><p><i>B</i> × 2π<i>R</i><sup>2</sup>(${p(P0.nums[0], 2)} mWb)은 돔 대부분에서 <b>B</b>가 면에 수직이 아니라는 점을 무시한 것이다.</p>` },
  ],
  1: [
    { q: '전자가 +<i>y</i> 방향을 향하는 균일한 자기장 속에서 +<i>x</i> 방향으로 움직인다. 전자가 받는 자기력의 방향은 어디인가?',
      choices: ['+<i>z</i> 방향', '−<i>y</i> 방향', '없음: 힘이 0이다', '−<i>z</i> 방향'], answer: 3,
      why: '<p><b>F</b> = <i>q</i><b>v</b> × <b>B</b>이고 <i>x̂</i> × <i>ŷ</i> = +<i>ẑ</i>이다. 전자의 전하는 음이므로 방향이 뒤집혀 −<i>z</i>가 된다. 힘은 결코 <b>B</b> 방향이 아니며, <b>v</b>와 <b>B</b> 모두에 수직이다.</p>' },
    { q: `이 페이지에서 양성자의 <b>v</b>와 <b>B</b> 사이 각 θ가 0에서 180°까지 일정한 빠르기로 바뀐다(<i>F</i><sub>max</sub> = <i>qvB</i> = ${p(F1 / 1e-14, 2)} × 10<sup>−14</sup> N). 이 동안 힘의 크기의 평균은 얼마인가?`,
      choices: P1.nums.map(x => `${p(x, 2)} × 10<sup>−14</sup> N`), answer: 1, nums: P1.nums,
      why: `<p>θ가 시간에 따라 균일하게 커지므로 시간 평균은 θ에 대한 평균과 같다.</p><div class="eq">⟨<i>F</i>⟩ = (1/π) ∫<sub>0</sub><sup>π</sup> <i>qvB</i> sin θ <i>d</i>θ = (2/π)<i>qvB</i> = ${p(P1.avg / 1e-14, 2)} × 10<sup>−14</sup> N</div><p>최댓값의 절반(${p(P1.nums[0], 2)})이 아니다. sin θ는 직선이 아니라서 꼭대기 근처에 더 오래 머문다.</p>` },
  ],
  2: [
    { q: `중양성자(전하 +<i>e</i>, 질량 2<i>m</i><sub>p</sub>)가 정지 상태에서 이 페이지의 ${P2.V} V로 가속되어 같은 ${p(M.CYC.B, 2)} T 자기장에 들어간다. 이 자기장에서 ${P2.V} V 양성자는 <i>r</i> = ${p(rp * 100, 2)} cm로 원운동한다. 중양성자의 반지름은 얼마인가?`,
      choices: P2.nums.map(x => `${p(x, 2)} cm`), answer: 3, nums: P2.nums,
      why: `<p>전하와 Δ<i>V</i>가 같으므로 운동 에너지 <i>e</i>Δ<i>V</i>도 같다. 그러면 <i>mv</i> = √(2<i>m</i> · <i>e</i>Δ<i>V</i>)이고</p><div class="eq"><i>r</i> = <i>mv</i>/<i>qB</i> = √(2<i>m</i>Δ<i>V</i>/<i>q</i>)/<i>B</i> ∝ √<i>m</i> &nbsp;→&nbsp; √2 × ${p(rp * 100, 2)} cm = ${p(P2.r * 100, 2)} cm</div><p>질량이 두 배라고 반지름이 두 배(${p(P2.nums[0], 2)} cm)인 것은 아니다. 중양성자는 √2배만큼 느리기도 하다.</p>` },
    { q: `서술형. 전하 <i>q</i>, 질량 <i>m</i>인 입자가 균일한 자기장 <b>B</b> = <i>B</i><i>ẑ</i>에 수직인 속도 <b>v</b>로 움직인다. 뉴턴 제2법칙에서 출발해 <i>v<sub>x</sub></i>와 <i>v<sub>y</sub></i>에 대한 미분 방정식을 세우고, 풀고, 주기를 구하라. 이 페이지의 양성자(<i>B</i> = ${p(M.CYC.B, 2)} T)에 대해 값을 계산하라.`,
      solution: `<p><b>v</b> × <i>ẑ</i> = (<i>v<sub>y</sub></i>, −<i>v<sub>x</sub></i>, 0)이므로 <b>F</b> = <i>q</i><b>v</b> × <b>B</b>에서</p><div class="eq"><i>m dv<sub>x</sub></i>/<i>dt</i> = <i>qBv<sub>y</sub></i>, &nbsp; <i>m dv<sub>y</sub></i>/<i>dt</i> = −<i>qBv<sub>x</sub></i></div><p>첫 식을 미분하고 둘째 식을 쓰면 <i>d</i><sup>2</sup><i>v<sub>x</sub></i>/<i>dt</i><sup>2</sup> = −ω<sup>2</sup><i>v<sub>x</sub></i>, ω = <i>qB</i>/<i>m</i>이다. 따라서</p><div class="eq"><i>v<sub>x</sub></i> = <i>v</i> cos ω<i>t</i>, &nbsp; <i>v<sub>y</sub></i> = −<i>v</i> sin ω<i>t</i></div><p>속력은 <i>v</i>로 유지된다. 한 번 더 적분하면 반지름 <i>v</i>/ω = <i>mv</i>/<i>qB</i>인 원이 나오고, <i>q</i> > 0이면 +<i>z</i>에서 볼 때 시계 방향으로 돈다. 주기는 <i>v</i>와 무관하다.</p><div class="eq"><i>T</i> = 2π/ω = 2π<i>m</i>/<i>qB</i> = 2π × 1.67×10<sup>−27</sup> / (1.60×10<sup>−19</sup> × ${p(M.CYC.B, 2)}) = ${p(M.CYC.T * 1e6, 3)} μs</div><p>그래서 이 페이지의 50 V 양성자와 200 V 양성자는 한 바퀴마다 출발점에서 다시 만난다.</p>`, val: M.CYC.T },
  ],
  3: [
    { q: `이 페이지의 속도 선택기(<i>E</i> = ${p(SE, 0)} V/m 아래 방향, <i>B</i> = ${p(SB, 3)} T 종이 안쪽 방향)에 양성자가 1.25<i>E</i>/<i>B</i> = ${p(P3.v / 1e5, 3)} × 10<sup>5</sup> m/s로 들어온다. 들어오는 순간 양성자가 받는 알짜힘의 크기는 얼마인가?`,
      choices: P3.nums.map(x => `${p(x, 1)} × 10<sup>−17</sup> N`), answer: 1, nums: P3.nums,
      why: `<p>두 힘은 방향이 반대다. <i>qE</i>는 아래로, <i>qvB</i>는 위로. <i>E</i>/<i>B</i>보다 빠르면 자기력이 이긴다.</p><div class="eq"><i>F</i> = <i>q</i>(<i>vB</i> − <i>E</i>) = 1.60×10<sup>−19</sup> × (${p(P3.v * SB, 0)} − ${p(SE, 0)}) = ${p(P3.F / 1e-17, 1)} × 10<sup>−17</sup> N, 위 방향</div><p>둘을 더하면(${p(P3.nums[3], 1)}) 방향이 반대라는 점을 놓친다. 그것이 바로 이 장치의 핵심이다.</p>` },
    { q: `이 페이지의 느린 양성자가 ${p(P3b.vi / 1e4, 1)} × 10<sup>4</sup> m/s로 들어와, 들어올 때보다 ${p(P3b.dy * 100, 3)} cm 낮은 곳(− 극판 쪽)에서 극판 사이를 빠져나간다. 나갈 때의 속력은 얼마인가?`,
      choices: P3b.nums.map(x => `${p(x, 2)} × 10<sup>4</sup> m/s`), answer: 2, nums: P3b.nums,
      why: `<p>일은 ∫<b>F</b>·<i>d</i><b>s</b>이다. 자기력은 늘 <i>d</i><b>s</b>에 ⊥이므로 일을 하지 않는다. 전기력은 양성자가 내려가는 동안 <i>qE</i>Δ<i>y</i>의 일을 한다.</p><div class="eq">½<i>mv</i><sup>2</sup> = ½<i>mv</i><sub>i</sub><sup>2</sup> + <i>qE</i>Δ<i>y</i> &nbsp;→&nbsp; <i>v</i> = √(<i>v</i><sub>i</sub><sup>2</sup> + 2<i>qE</i>Δ<i>y</i>/<i>m</i>) = ${p(P3b.v / 1e4, 2)} × 10<sup>4</sup> m/s</div><p>낮은 전위 쪽으로 떨어지며 빨라진다. 하지만 <i>E</i>/<i>B</i> = ${p(v0 / 1e4, 1)} × 10<sup>4</sup> m/s에 이르지는 않는다. 그 속력은 무언가를 그쪽으로 몰아가는 값이 아니다.</p>` },
  ],
  4: [
    { q: `이 페이지의 고리(μ = ${p(mu, 2)} A·m², <i>B</i> = ${p(LB, 2)} T)를 θ = 0(μ가 <b>B</b> 방향)에서 θ = 180°까지 천천히 돌린다. 고리를 돌리는 쪽이 한 일은 얼마인가?`,
      choices: P4.nums.map(x => `${p(x, 3)} J`), answer: 3, nums: P4.nums,
      why: `<p>복원 돌림힘 μ<i>B</i> sin θ를 거슬러 한 일이다.</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup>π</sup> μ<i>B</i> sin θ <i>d</i>θ = 2μ<i>B</i> = ${p(P4.W, 3)} J</div><p>Δ<i>U</i> = (−μ<i>B</i> cos 180°) − (−μ<i>B</i> cos 0) = 2μ<i>B</i>와 같다. 90°에서 멈추면 μ<i>B</i>뿐이다. τ<sub>max</sub> × π(${p(P4.nums[1], 3)} J)는 돌림힘을 일정하다고 본 것이다.</p>` },
    { q: `반지름 ${p(P4b.R * 100, 0)} cm인 반원으로 구부린 도선에 ${p(P4b.I, 1)} A가 흐르고, 도선이 놓인 평면에 수직인 균일한 ${p(P4b.B, 2)} T 자기장이 있다. 반원이 받는 알짜 자기력은 얼마인가?`,
      choices: P4b.nums.map(x => `${p(x, 3)} N`), answer: 1, nums: P4b.nums,
      why: `<p><i>d</i><b>F</b> = <i>I d</i><b>s</b> × <b>B</b>를 더한다. <b>B</b>가 균일하므로 적분 밖으로 나오고, ∫<i>d</i><b>s</b>는 한쪽 끝에서 다른 쪽 끝까지의 곧은 벡터, 길이 2<i>R</i>이다.</p><div class="eq"><i>F</i> = <i>I</i>(2<i>R</i>)<i>B</i> = ${P4b.I} × ${p(2 * P4b.R, 2)} × ${P4b.B} = ${p(P4b.F, 3)} N</div><p>조각들의 옆 방향 성분은 상쇄되므로, 호의 길이 π<i>R</i>(${p(P4b.nums[0], 3)} N)를 쓰면 너무 크게 센다.</p>` },
  ],
  5: [
    { q: `이 페이지의 도선(반지름 ${p(Aa * 100, 0)} cm, ${AI} A가 단면 전체에 고르게 퍼져 흐름). 축에서 ${p(r5 * 1000, 0)} mm 떨어진 도선 <b>안쪽</b>의 자기장은 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 0)} μT`), answer: 3, nums: P5.nums,
      why: `<p>반지름 <i>r</i> < <i>a</i>인 앙페르 원은 전류의 <i>r</i><sup>2</sup>/<i>a</i><sup>2</sup>만큼만 둘러싼다.</p><div class="eq"><i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>I</i><i>r</i><sup>2</sup>/<i>a</i><sup>2</sup> &nbsp;→&nbsp; <i>B</i> = μ<sub>0</sub><i>Ir</i>/2π<i>a</i><sup>2</sup> = ${p(P5.B * 1e6, 0)} μT</div><p>μ<sub>0</sub><i>I</i>/2π<i>r</i>(${p(P5.nums[0], 0)} μT)은 원 바깥의 전류까지 센 것이다.</p>` },
    { q: `이 페이지의 직사각형(${AI} A 도선에 나란한 변의 길이 ${p(Fb * 100, 0)} cm, 가까운 변이 ${p(Fa * 100, 0)} cm 떨어져 있고 폭 ${p(Fc * 100, 0)} cm). 이를 통과하는 자기 선속은 얼마인가?`,
      choices: P5.fnums.map(x => `${p(x, 2)} μWb`), answer: 2, nums: P5.fnums,
      why: `<p>직사각형에 걸쳐 <i>B</i>가 변하므로 띠 <i>b dr</i>를 더한다.</p><div class="eq">Φ = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>c</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>r</i>) <i>b dr</i> = (μ<sub>0</sub><i>Ib</i>/2π) ln(${p((Fa + Fc) / Fa, 0)}) = ${p(M.FLUX.phi * 1e6, 2)} μWb</div><p>가운데의 <i>B</i> × 넓이는 ${p(P5.fnums[0], 2)} μWb로 너무 작다. 1/<i>r</i>은 휘어 있고 가까운 띠가 더 많이 기여하기 때문이다.</p>` },
  ],
  6: [
    { q: `이 페이지의 고리(<i>R</i> = ${p(RR * 100, 0)} cm, 중심에서 <i>B</i> = ${p(Bc * 1e6, 1)} μT). 축 위에서 중심으로부터 <i>z</i> = <i>R</i>만큼 떨어진 곳의 자기장은 얼마인가?`,
      choices: P6.nums.map(x => `${p(x, 1)} μT`), answer: 0, nums: P6.nums,
      why: `<div class="eq"><i>B</i> = μ<sub>0</sub><i>IR</i><sup>2</sup>/2(<i>R</i><sup>2</sup> + <i>z</i><sup>2</sup>)<sup>3/2</sup> = (μ<sub>0</sub><i>I</i>/2<i>R</i>) · 1/2<sup>3/2</sup> = ${p(Bc * 1e6, 1)}/${p(2 ** 1.5, 3)} = ${p(P6.B * 1e6, 1)} μT</div><p>절반이 아니다. 각 조각이 √2배 멀어지고(1/<i>r</i><sup>2</sup> → ½), d<b>B</b> 중 cos 45°만 축 방향이다(다시 1/√2).</p>` },
    { q: `${RI} A가 흐르는 도선이 반지름 ${p(RR * 100, 0)} cm인 반원의 중심을 향하는 곧은 도선을 따라 들어와, 반원을 돌고, 중심에서 곧장 멀어지는 도선을 따라 나간다. 중심의 자기장은 얼마인가?`,
      choices: P6b.nums.map(x => `${p(x, 1)} μT`), answer: 2, nums: P6b.nums,
      why: `<p>곧은 도선에서는 <i>d</i><b>l</b>이 <b>r̂</b> 방향이므로 <i>d</i><b>l</b> × <b>r̂</b> = 0, 곧 아무것도 더하지 않는다. 호 위에서는 모든 조각이 거리 <i>R</i>에서 <b>r̂</b>에 ⊥이다.</p><div class="eq"><i>B</i> = (μ<sub>0</sub><i>I</i>/4π<i>R</i><sup>2</sup>) ∫<i>dl</i> = (μ<sub>0</sub><i>I</i>/4π<i>R</i><sup>2</sup>)(π<i>R</i>) = μ<sub>0</sub><i>I</i>/4<i>R</i> = ${p(P6b.B * 1e6, 1)} μT</div><p>완전한 고리의 절반이다. 곧은 도선을 옆에 놓인 반무한 도선처럼 세는 것(${p(P6b.nums[1], 1)} μT)이 함정이다.</p>` },
  ],
  7: [
    { q: '평행한 두 긴 도선에 20 A와 10 A가 <b>반대</b> 방향으로 흐른다. 20 A 도선이 받는 힘과 비교할 때 10 A 도선이 받는 힘은 어떠한가?',
      choices: ['두 배이고, 도선들이 끌어당긴다', '크기가 같고, 도선들이 끌어당긴다', '크기가 같고, 도선들이 밀어낸다', '절반이고, 도선들이 밀어낸다'], answer: 2,
      why: '<p><i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π<i>d</i>는 두 전류에 대해 대칭이다(뉴턴 제3법칙). 그러니 크기가 같다. 반대 방향 전류는 밀어낸다. 10 A 도선은 두 배 센 자기장 속에 있지만 전류가 절반이다.</p>' },
    { q: `곧은 막대가 긴 도선과 같은 평면에서 도선에 <b>수직</b>으로, ${p(P7.r1 * 100, 0)} cm에서 ${p(P7.r2 * 100, 0)} cm 거리까지 놓여 있다. 둘 다 이 페이지의 ${P7.I1} A가 흐른다. 막대가 받는 자기력은 얼마인가?`,
      choices: P7.nums.map(x => `${p(x, 3)} mN`), answer: 0, nums: P7.nums,
      why: `<p>도선의 자기장은 막대 어디서나 막대에 ⊥이지만 막대를 따라 약해지므로 <i>dF</i> = <i>I</i><sub>2</sub><i>B</i>(<i>r</i>) <i>dr</i>를 적분한다.</p><div class="eq"><i>F</i> = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (μ<sub>0</sub><i>I</i><sub>1</sub>/2π<i>r</i>) <i>I</i><sub>2</sub> <i>dr</i> = (μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π) ln(${p(P7.r2 / P7.r1, 0)}) = ${p(P7.F * 1e3, 3)} mN</div><p>막대 가운데의 <i>B</i>를 쓰면(${p(P7.nums[1], 3)} mN) 도선 가까이의 센 자기장을 너무 적게 센다.</p>` },
  ],
  8: [
    { q: `이 페이지의 토로이드(${TN}회, ${TI} A; 심은 중심에서 ${p((R0 - M.TOR.a) * 100, 0)} cm부터 ${p((R0 + M.TOR.a) * 100, 0)} cm까지). <i>r</i> = ${p(r8 * 100, 0)} cm인 심 안의 자기장은 얼마인가?`,
      choices: P8.nums.map(x => `${p(x, 1)} μT`), answer: 3, nums: P8.nums,
      why: `<p>심 안에서 반지름 <i>r</i>인 앙페르 원은 모든 감음과 한 번씩 엮인다.</p><div class="eq"><i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>NI</i> &nbsp;→&nbsp; <i>B</i> = μ<sub>0</sub><i>NI</i>/2π<i>r</i> = 2×10<sup>−7</sup> × ${TN} × ${TI} / ${r8} = ${p(P8.B * 1e6, 1)} μT</div><p><i>B</i>는 <i>r</i>에 따라 달라진다. 평균 반지름 ${p(R0 * 100, 0)} cm를 쓰면 ${p(P8.nums[2], 1)} μT가 나오는데, 이는 ${p(R0 * 100, 0)} cm에서만의 값이다.</p>` },
    { q: `이 페이지의 솔레노이드(<i>n</i> = ${p(M.SOL.n, 0)}회/m, <i>I</i> = ${M.SOL.I} A, <i>L</i> = ${p(SL * 100, 0)} cm, <i>R</i> = ${p(SR * 100, 0)} cm)를 따라 전류 고리들을 더하면 축 위에서 <i>B</i> = (μ<sub>0</sub><i>nI</i>/2)(cos θ<sub>1</sub> − cos θ<sub>2</sub>)가 된다. 한쪽 <b>끝</b>의 중심에서 자기장은 얼마인가?`,
      choices: P8b.nums.map(x => `${p(x, 1)} μT`), answer: 0, nums: P8b.nums,
      why: `<p>각 조각 <i>dx</i>는 <i>nI dx</i>가 흐르는 고리이고, 그 축 방향 자기장이 더해진다.</p><div class="eq"><i>B</i> = ∫<sub>0</sub><sup><i>L</i></sup> μ<sub>0</sub><i>nI R</i><sup>2</sup> <i>dx</i> / 2(<i>R</i><sup>2</sup> + <i>x</i><sup>2</sup>)<sup>3/2</sup> = (μ<sub>0</sub><i>nI</i>/2) · <i>L</i>/√(<i>L</i><sup>2</sup> + <i>R</i><sup>2</sup>) = ${p(P8b.B * 1e6, 1)} μT</div><p>μ<sub>0</sub><i>nI</i> = ${p(M.SOL.B * 1e6, 1)} μT의 거의 정확히 절반이다. 끝에서 보면 코일이 한쪽으로만 뻗어 있기 때문이다.</p>` },
  ],
};
