// electrostatics/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${m.toFixed(n)} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const K = M.K, nC = M.nC, uC = M.uC;

// ---- page 0: two metal spheres touched; a rod with λ = cx ----
const P0 = { q1: 6, q2: -2 };                                   // nC
P0.each = (P0.q1 + P0.q2) / 2;
P0.nums = [(Math.abs(P0.q1) + Math.abs(P0.q2)) / 2, P0.each, NaN, 0];   // added sizes · right · no flow · cancelled
const P0b = { c: 40 * nC, L: 0.50 };                           // λ = c x (C/m², m)
P0b.Q = P0b.c * P0b.L ** 2 / 2;
P0b.nums = [P0b.c * P0b.L ** 3 / 3, P0b.c * P0b.L ** 2, P0b.Q, P0b.c * P0b.L].map(q => q / M.QE);   // ∫x² · forgot ½ · right · λ(L)·1 m
// ---- page 1: the grounding current ----
const P1 = { I0: 2.4e-3, tau: 1.5e-6 };
P1.n = P1.I0 * P1.tau / M.QE;
P1.nums = [P1.n * (1 - 1 / Math.E), P1.n / 2, P1.n / Math.E, P1.n];   // stopped at τ · triangle · I(τ)·τ · right
// ---- page 2: the page's pair at 20 cm; work as a like pair flies apart ----
const P2 = { r: 0.20 };
P2.F = M.coulomb(M.PAIR.q1, M.PAIR.q2, P2.r);
P2.nums = [K * M.PAIR.q1 * -M.PAIR.q2 / P2.r, M.coulomb(M.PAIR.q1, M.PAIR.q1, P2.r), P2.F, P2.F / 2];   // 1/r · q1² · right · "smaller charge, smaller force"
const P2b = { q1: M.PAIR.q1, q2: M.PAIR.like, r1: 0.20, r2: 0.40 };
P2b.W = K * P2b.q1 * P2b.q2 * (1 / P2b.r1 - 1 / P2b.r2);
{ const F = r => M.coulomb(P2b.q1, P2b.q2, r), dr = P2b.r2 - P2b.r1;
  P2b.nums = [F(P2b.r1) * dr, F(P2b.r2) * dr, (F(P2b.r1) + F(P2b.r2)) / 2 * dr, P2b.W]; }   // start force · end force · mean force · right
// ---- page 3: the page's balance point and its stiffness ----
const { qA, qB, D, q0 } = M.LINE;
const P3 = { x: M.LINE.xEq };
P3.nums = [D * Math.sqrt(qB) / (Math.sqrt(qA) + Math.sqrt(qB)), D * qA / (qA + qB), D / 2, P3.x].map(x => x * 100);   // nearer A · no root · midpoint · right
P3.k = 2 * K * q0 * (qA / P3.x ** 3 + qB / (D - P3.x) ** 3);
P3.nums2 = [P3.k, P3.k / 2, 2 * K * q0 * Math.abs(qA / P3.x ** 3 - qB / (D - P3.x) ** 3), K * q0 * (qA / P3.x ** 2 + qB / (D - P3.x) ** 2)];   // right · lost the 2 · subtracted · not differentiated
// ---- page 4: a −1 nC charge; a test charge moving out ----
const P4 = { Q: M.POINT.Q, r: 0.20 };
P4.E = M.pointMag(P4.Q, P4.r);
P4.nums = [P4.E, NaN, K * P4.Q / P4.r, K * P4.Q / (P4.r * 100) ** 2];
const P4b = { r: 0.20, v: 0.050 };
P4b.rate = 2 * K * M.POINT.Q * P4b.v / P4b.r ** 3;
P4b.nums = [P4b.rate / 2, P4b.rate, 2 * K * M.POINT.Q * P4b.v / P4b.r ** 2, 2 * K * M.POINT.Q * P4b.v / P4b.r ** 4];   // lost the 2 · right · one r short · one r too many
// ---- page 5: the page's dipole on its bisector ----
const P5 = { y: 0.10 }, dq = M.DIPOLE.q, da = M.DIPOLE.a;
P5.E = M.dipoleBisector(P5.y);
P5.nums = [2 * K * dq * da / P5.y ** 3, P5.E, 2 * K * dq / (da * da + P5.y * P5.y), P5.E / 2];   // far-field · right · no cos θ · one charge only
// ---- page 6: the page's rod, on its axis ----
const P6 = { a: 0.10 };
P6.E = M.rodAxis(P6.a);
P6.nums = [K * M.RODE.Q / P6.a ** 2, K * M.RODE.Q / (P6.a + M.RODE.L / 2) ** 2, P6.E, K * M.RODE.lambda / P6.a];   // all at the end · all at the middle · right · kλ/a
// ---- page 7: the page's ring at z = 15 cm; where it peaks ----
const P7 = { z: 0.15 }, RR = M.RING.R, RQ = M.RING.Q;
P7.E = M.ringAxis(P7.z);
P7.nums = [K * RQ / (P7.z ** 2 + RR ** 2), P7.E, K * RQ / P7.z ** 2, K * RQ * RR / (P7.z ** 2 + RR ** 2) ** 1.5];   // no cos φ · right · point charge · sin φ
P7.nums2 = [RR, RR / 2, RR * Math.SQRT2, RR / Math.SQRT2].map(x => x * 100);
// ---- page 8: the page's electron; a field that grows along the plates ----
const PL = M.PLATES;
const P8 = { nums: [2 * PL.yExit, 4 * PL.yExit, PL.yProton, PL.yExit].map(y => y * 1000) };     // forgot ½ · t = 2L/v₀ · proton · right
const P8b = { vy: PL.vyExit / 2 };
P8b.nums = [PL.vyExit, P8b.vy, PL.vyExit / 3, PL.vyExit / 4].map(v => v / 1e6);

const mm = x => x < 0.01 ? p(x, 5) : g(x);

export const PRACTICE = {
  0: [
    { q: `똑같은 두 금속 구가 각각 +${P0.q1} nC, −${-P0.q2} nC를 띠고 있다. 두 구를 접촉시켰다가 떼어 놓았다. 이제 각 구가 띠는 전하는 얼마인가?`,
      choices: [`+${p(P0.nums[0], 0)} nC`, `+${p(P0.each, 0)} nC`, `+${P0.q1 / 2} nC와 −${-P0.q2 / 2} nC`, '0'], answer: 1, nums: P0.nums,
      why: `<p>전하는 보존된다. 전체 전하 ${P0.q1} + (−${-P0.q2}) = +${P0.q1 + P0.q2} nC를 똑같은 두 구가 똑같이 나눠 가진다.</p><div class="eq"><i>q</i> = (${P0.q1} − ${-P0.q2})/2 = 각각 +${p(P0.each, 0)} nC</div><p>크기만 더하면(+${p(P0.nums[0], 0)} nC) 부호를 무시하게 된다. 음전하 구의 전자가 양전하 구의 전하 일부를 상쇄한다.</p>` },
    { q: `가는 플라스틱 막대가 <i>x</i>축을 따라 0부터 ${p(P0b.L, 2)} m까지 놓여 있고, 선전하 밀도는 λ = <i>cx</i>, <i>c</i> = +${p(P0b.c / nC, 0)} nC/m²이다. 막대가 잃은 전자는 몇 개인가?`,
      choices: P0b.nums.map(n => sci(n)), answer: 2, nums: P0b.nums,
      why: `<p>λ가 막대를 따라 변하므로 조각 d<i>q</i> = λ d<i>x</i>를 더한다.</p><div class="eq"><i>Q</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>cx</i> d<i>x</i> = <i>cL</i>²/2 = ${p(P0b.c / nC, 0)} × ${p(P0b.L, 2)}²/2 = ${p(P0b.Q / nC, 2)} nC</div><div class="eq"><i>n</i> = <i>Q</i>/<i>e</i> = ${p(P0b.Q / nC, 2)} × 10<sup>−9</sup>/${sci(M.QE)} = ${sci(P0b.nums[2])}</div><p>½을 빠뜨리면(먼 끝의 λ에 길이를 곱하면) 두 배로 많아진다.</p>` },
  ],
  1: [
    { q: '이 페이지의 중성 금속 구에 음전하 막대를 가까이 가져오고, 구를 접지한 뒤, 접지선을 끊고, 마지막으로 막대를 치운다. 구는 결국 어떤 상태가 되는가?',
      choices: ['중성', '음전하, 표면에 고르게 퍼짐', '양전하, 표면에 고르게 퍼짐', '양전하, 막대가 있던 쪽에 몰림'], answer: 2,
      why: `<p>막대가 구의 자유 전자를 먼 쪽으로 밀어내고, 접지하면 그 일부가 빠져나간다. 막대보다 접지를 먼저 끊으면 모자란 전자가 그대로 갇힌다. 구는 막대와 반대 부호인 양전하(여기서는 +${p(M.QG / nC, 2)} nC)를 띤다. 막대가 사라지면 전하를 한쪽에 붙잡아 둘 것이 없으므로 표면에 고르게 퍼진다.</p>` },
    { q: `다른 유도 장치에서, 구를 접지한 동안 접지선에 흐르는 전류가 <i>I</i>(<i>t</i>) = <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>이고 <i>I</i><sub>0</sub> = ${p(P1.I0 * 1e3, 1)} mA, τ = ${p(P1.tau * 1e6, 1)} μs이다. 빠져나가는 전자는 모두 몇 개인가?`,
      choices: P1.nums.map(n => sci(n)), answer: 3, nums: P1.nums,
      why: `<p>전하량은 전류의 적분이다.</p><div class="eq"><i>Q</i> = ∫<sub>0</sub><sup>∞</sup> <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup> d<i>t</i> = <i>I</i><sub>0</sub>τ = ${p(P1.I0 * P1.tau / nC, 2)} nC, &nbsp;<i>n</i> = <i>Q</i>/<i>e</i> = ${sci(P1.n)}</div><p><i>t</i> = τ에서 멈추면 63%만 세어 ${sci(P1.nums[0])}가 된다.</p>` },
  ],
  2: [
    { q: `이 페이지의 +${M.PAIR.q1 / uC} μC 전하와 −${-M.PAIR.q2 / uC} μC 전하가 ${p(P2.r * 100, 0)} cm 떨어져 있다. −${-M.PAIR.q2 / uC} μC 전하가 받는 힘의 크기는 얼마인가?`,
      choices: P2.nums.map(x => `${g(x)} N`), answer: 2, nums: P2.nums,
      why: `<div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>² = ${sci(K)} × (${M.PAIR.q1 / uC} × 10<sup>−6</sup>)(${-M.PAIR.q2 / uC} × 10<sup>−6</sup>)/(${p(P2.r, 2)})² = ${g(P2.F)} N</div><p>두 전하는 작용·반작용 쌍으로 같은 ${g(P2.F)} N을 받는다. 작은 전하라고 절반(${g(P2.nums[3])} N)을 받는 것이 아니다.</p>` },
    { q: `이 페이지의 같은 부호 쌍 +${P2b.q1 / uC} μC와 +${P2b.q2 / uC} μC가 ${p(P2b.r1 * 100, 0)} cm 떨어진 채 붙잡혀 있다. +${P2b.q2 / uC} μC 전하를 놓는다(다른 전하는 고정). 두 전하가 ${p(P2b.r2 * 100, 0)} cm 떨어질 때까지 전기력이 이 전하에 한 일은 얼마인가?`,
      choices: P2b.nums.map(x => `${g(x)} J`), answer: 3, nums: P2b.nums,
      why: `<p>움직이는 동안 힘이 변하므로 적분한다.</p><div class="eq"><i>W</i> = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub>) = ${g(K * P2b.q1 * P2b.q2)} × (${p(1 / P2b.r1, 1)} − ${p(1 / P2b.r2, 1)}) = ${g(P2b.W)} J</div><p>처음 힘에 거리를 곱하면(${g(P2b.nums[0])} J) 너무 크다. 미는 힘은 1/<i>r</i>²로 약해지기 때문이다. 양 끝 힘의 평균을 쓰는 것(${g(P2b.nums[2])} J)도 틀리다. <i>F</i>가 <i>r</i>에 대해 선형이 아니기 때문이다.</p>` },
  ],
  3: [
    { q: `이 페이지에서 A(+${qA / uC} μC)와 B(+${qB / uC} μC)는 ${p(D * 100, 0)} cm 떨어져 있다. 둘 사이에 놓인 시험 전하가 받는 알짜힘이 0인 곳은 A에서 얼마나 떨어져 있는가?`,
      choices: P3.nums.map(x => `${p(x, 1)} cm`), answer: 3, nums: P3.nums,
      why: `<div class="eq"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)² &nbsp;→&nbsp; (<i>d</i> − <i>x</i>)/<i>x</i> = √(<i>q</i><sub>B</sub>/<i>q</i><sub>A</sub>) = ${p(Math.sqrt(qB / qA), 2)} &nbsp;→&nbsp; <i>x</i> = ${p(P3.x * 100, 1)} cm</div><p>평형점은 <b>더 작은</b> 전하인 B 쪽에 가깝다. <i>d</i>를 전하량의 비로 나누면(${p(P3.nums[1], 1)} cm) 힘이 1/<i>r</i>²에 비례한다는 점을 잊은 것이다. 거리는 전하량의 제곱근 비를 따른다.</p>` },
    { q: `+${p(q0 / uC, 1)} μC 시험 전하를 그 평형점에서 직선을 따라 작은 거리 <i>s</i>만큼 살짝 옮긴다. 이때 알짜힘은 <i>F</i> ≈ −κ<i>s</i>이다. κ는 얼마인가?`,
      choices: P3.nums2.map(x => `${g(x)} N/m`), answer: 0, nums: P3.nums2,
      why: `<p><i>F</i>(<i>x</i>) = <i>kq</i><sub>0</sub><i>q</i><sub>A</sub>/<i>x</i>² − <i>kq</i><sub>0</sub><i>q</i><sub>B</sub>/(<i>d</i> − <i>x</i>)²일 때 κ = −d<i>F</i>/d<i>x</i> (<i>x</i><sub>eq</sub>에서):</p><div class="eq">κ = 2<i>kq</i><sub>0</sub>[<i>q</i><sub>A</sub>/<i>x</i>³ + <i>q</i><sub>B</sub>/(<i>d</i> − <i>x</i>)³] = ${g(P3.k)} N/m</div><p>두 항은 더해진다. B 쪽으로 움직이면 A가 미는 힘은 약해지고 <i>동시에</i> B가 미는 힘은 커져서, 둘 다 전하를 되돌려 보낸다. 두 항을 빼면 ${g(P3.nums2[2])} N/m이 된다.</p>` },
  ],
  4: [
    { q: `원점에 −${M.POINT.Q / nC}.0 nC 점전하가 있다. 이 전하에서 동쪽으로 ${p(P4.r * 100, 0)} cm 떨어진 곳의 전기장은 무엇인가?`,
      choices: [`${p(P4.E, 0)} N/C, 서쪽`, `${p(P4.E, 0)} N/C, 동쪽`, `${p(P4.nums[2], 1)} N/C, 서쪽`, `${p(P4.nums[3], 4)} N/C, 서쪽`], answer: 0, nums: P4.nums,
      why: `<div class="eq"><i>E</i> = <i>k</i>|<i>Q</i>|/<i>r</i>² = ${sci(K)} × 1.0 × 10<sup>−9</sup>/(${p(P4.r, 2)})² = ${p(P4.E, 0)} N/C</div><p>음전하의 전기장은 전하를 <b>향한다</b>. 동쪽에 놓인 양의 시험 전하는 서쪽으로 끌린다. <i>r</i>를 cm로 쓰면 ${p(P4.nums[3], 4)} N/C가 나온다. <i>kQ</i>/<i>r</i>는 전기장이 아니라 전위다.</p>` },
    { q: `시험 전하가 이 페이지의 +${M.POINT.Q / nC} nC 전하로부터 ${p(P4b.v * 100, 1)} cm/s로 곧장 멀어진다. ${p(P4b.r * 100, 0)} cm 떨어졌을 때, 시험 전하 위치의 전기장은 얼마나 빠르게 줄어드는가?`,
      choices: P4b.nums.map(x => `초당 ${g(x)} N/C`), answer: 1, nums: P4b.nums,
      why: `<p>연쇄 법칙: <i>E</i>(<i>r</i>) = <i>kQ</i>/<i>r</i>²이고, <i>r</i>는 <i>v</i>의 비율로 커진다.</p><div class="eq">d<i>E</i>/d<i>t</i> = (d<i>E</i>/d<i>r</i>)(d<i>r</i>/d<i>t</i>) = −(2<i>kQ</i>/<i>r</i>³)<i>v</i> = −2 × ${p(K * M.POINT.Q, 2)} × ${p(P4b.v, 3)}/${p(P4b.r, 2)}³ = 초당 −${g(P4b.rate)} N/C</div><p>거듭제곱 미분에서 나오는 2를 빠뜨리면 ${g(P4b.nums[0])}이 된다.</p>` },
  ],
  5: [
    { q: `이 페이지의 쌍극자(±${dq / nC} nC, ${p(2 * da * 100, 0)} cm 간격)에서, 수직 이등분선 위 중심으로부터 ${p(P5.y * 100, 0)} cm 떨어진 곳의 전기장 크기는 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>각 전하는 √(<i>a</i>² + <i>y</i>²) = ${p(Math.hypot(da, P5.y) * 100, 1)} cm 떨어져 있고 <i>kq</i>/(<i>a</i>² + <i>y</i>²) = ${p(K * dq / (da * da + P5.y * P5.y), 0)} N/C를 만든다. <i>y</i> 성분은 상쇄되고, 각각 cos θ = <i>a</i>/√(<i>a</i>² + <i>y</i>²)를 곱한 <i>x</i> 성분은 더해진다.</p><div class="eq"><i>E</i> = 2<i>kqa</i>/(<i>a</i>² + <i>y</i>²)<sup>3/2</sup> = ${p(P5.E, 0)} N/C, 축과 나란하게 +에서 − 쪽으로</div><p>원거리 근사 2<i>kqa</i>/<i>y</i>³(${p(P5.nums[0], 0)} N/C)은 <i>y</i> ≫ <i>a</i>일 때만 맞는다. 여기서는 <i>y</i> = <i>a</i>다.</p>` },
    { q: '쌍극자가 <i>x</i> = +<i>a</i>에 +<i>q</i>, <i>x</i> = −<i>a</i>에 −<i>q</i>를 가진다. <i>x</i> ≫ <i>a</i>인 축 위의 전기장을 구하고, 그것이 1/<i>x</i>³로 줄어듦을 보여라.',
      solution: `<p>두 전기장 모두 축을 따라 놓이고, 더 가까운 +<i>q</i>의 전기장이 이긴다.</p><div class="eq"><i>E</i> = <i>kq</i>/(<i>x</i> − <i>a</i>)² − <i>kq</i>/(<i>x</i> + <i>a</i>)² = <i>kq</i> · 4<i>ax</i>/(<i>x</i>² − <i>a</i>²)²</div><p><i>x</i> ≫ <i>a</i>이면 (<i>x</i>² − <i>a</i>²)² → <i>x</i>⁴이므로 <i>E</i> → 4<i>kqa</i>/<i>x</i>³ = 2<i>kp</i>/<i>x</i>³이다(<i>p</i> = 2<i>qa</i>). 방향은 +<i>x</i>. 다른 방법: <i>f</i>(<i>x</i>) = <i>kq</i>/<i>x</i>²는 두 전하 사이에서 약 <i>f</i>′(<i>x</i>) · (−2<i>a</i>)만큼 변하므로 <i>E</i> ≈ −2<i>a</i> · (−2<i>kq</i>/<i>x</i>³) = 4<i>kqa</i>/<i>x</i>³. 두 전기장이 거의 상쇄되어, 남은 차이는 각각보다 거듭제곱 하나만큼 더 빨리 줄어든다.</p>` },
  ],
  6: [
    { q: `이 페이지의 막대(${p(M.RODE.L * 100, 0)} cm에 +${M.RODE.Q / nC} nC). 축 위에서 한쪽 끝으로부터 ${p(P6.a * 100, 0)} cm 바깥에서의 전기장은 얼마인가?`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<div class="eq"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(K * M.RODE.Q, 2)}/(${p(P6.a, 2)} × ${p(P6.a + M.RODE.L, 2)}) = ${p(P6.E, 0)} N/C</div><p>모든 전하가 가까운 끝(${p(P6.nums[0], 0)} N/C)이나 가운데(${p(P6.nums[1], 0)} N/C)에 모여 있다고 보면 틀린다. 조각마다 거리가 다르고 1/<i>x</i>² 가중치는 선형이 아니기 때문이다.</p>` },
    { q: '막대(λ, 길이 <i>L</i>)가 <i>x</i>축 위 −<i>L</i>/2부터 <i>L</i>/2까지 놓여 있다. 가운데에서 거리 <i>a</i>만큼 위에 있는 점의 전기장을 주는 적분은 무엇인가?',
      choices: ['∫ <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)', '∫ <i>k</i>λ<i>x</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup>', '∫ <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>1/2</sup>', '∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup>'], answer: 3,
      why: '<p>각 조각은 d<i>E</i> = <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)를 만든다. 옆 방향 성분은 짝지어 상쇄되므로 <i>a</i> 방향 성분만 남긴다. cos θ = <i>a</i>/√(<i>x</i>² + <i>a</i>²)를 곱한다.</p><div class="eq"><i>E</i> = ∫<sub>−<i>L</i>/2</sub><sup><i>L</i>/2</sup> <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/(<i>a</i>√(<i>L</i>²/4 + <i>a</i>²))</div><p>첫째는 상쇄 없이 크기만 더한 것이다. <i>x</i> d<i>x</i> 적분은 옆 방향 성분으로 0이 된다. 1/2 거듭제곱은 전위다.</p>' },
  ],
  7: [
    { q: `이 페이지의 고리(+${p(RQ / nC, 0)} nC, <i>R</i> = ${p(RR * 100, 0)} cm). 축 위에서 중심으로부터 ${p(P7.z * 100, 0)} cm 떨어진 곳의 전기장은 얼마인가?`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P7.nums,
      why: `<p>모든 조각은 √(<i>z</i>² + <i>R</i>²) = ${p(Math.hypot(P7.z, RR) * 100, 0)} cm 떨어져 있다. 축 방향 성분, 곧 cos φ = <i>z</i>/√(<i>z</i>² + <i>R</i>²) = ${p(P7.z / Math.hypot(P7.z, RR), 2)}만큼만 남는다.</p><div class="eq"><i>E</i> = <i>kQz</i>/(<i>z</i>² + <i>R</i>²)<sup>3/2</sup> = ${p(P7.E, 0)} N/C</div><p>cos φ를 빼면 ${p(P7.nums[0], 0)} N/C가 된다. 이 거리에서 고리는 점전하가 아니다(${p(P7.nums[2], 0)} N/C).</p>` },
    { q: `그 고리의 축 위에서 전기장이 가장 센 곳은 중심에서 얼마나 떨어져 있는가?`,
      choices: P7.nums2.map(x => `${p(x, 1)} cm`), answer: 3, nums: P7.nums2,
      why: `<p><i>E</i> = <i>kQz</i>(<i>z</i>² + <i>R</i>²)<sup>−3/2</sup>에서 d<i>E</i>/d<i>z</i> = 0으로 놓는다.</p><div class="eq"><i>kQ</i>[(<i>z</i>² + <i>R</i>²) − 3<i>z</i>²]/(<i>z</i>² + <i>R</i>²)<sup>5/2</sup> = 0 &nbsp;→&nbsp; <i>z</i> = <i>R</i>/√2 = ${p(P7.nums2[3], 1)} cm</div><p><i>E</i>는 중심에서 0이고 멀리서는 1/<i>z</i>²로 줄어들므로, 최댓값은 그 사이에 있다.</p>` },
  ],
  8: [
    { q: `이 페이지의 전자가 ${p(PL.L * 100, 0)} cm 판과 나란하게 ${p(PL.v0 / 1e7, 1)} × 10<sup>7</sup> m/s로 ${M.PLATES.E} N/C 전기장에 들어온다. 판을 빠져나갈 때 옆으로 얼마나 벗어났는가?`,
      choices: P8.nums.map(x => `${mm(x)} mm`), answer: 3, nums: P8.nums,
      why: `<p>가로질러서는 일정한 힘, 판을 따라서는 힘이 없다. 포물선 운동이다.</p><div class="eq"><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub> = ${sci(PL.a)} m/s², &nbsp;<i>t</i> = <i>L</i>/<i>v</i><sub>0</sub> = ${p(PL.tCross * 1e9, 1)} ns, &nbsp;<i>y</i> = ½<i>at</i>² = ${mm(P8.nums[3])} mm</div><p>½을 잊으면 두 배가 된다. 양성자의 질량을 쓰면 ${p(M.MP / M.ME, 0)}분의 1인 ${mm(P8.nums[2])} mm가 된다.</p>` },
    { q: `이번에는 판 사이의 전기장이 판을 따라 커진다고 하자. <i>E</i> = <i>E</i><sub>0</sub><i>x</i>/<i>L</i> (먼 끝에서 <i>E</i><sub>0</sub> = ${M.PLATES.E} N/C). 전자가 빠져나갈 때 옆 방향 속력은 얼마인가?`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> m/s`), answer: 1, nums: P8b.nums,
      why: `<p><i>x</i> = <i>v</i><sub>0</sub><i>t</i>이므로 옆 방향 가속도가 시간에 따라 커진다. <i>a</i>(<i>t</i>) = (<i>eE</i><sub>0</sub>/<i>m</i>)(<i>v</i><sub>0</sub><i>t</i>/<i>L</i>):</p><div class="eq"><i>v<sub>y</sub></i> = ∫<sub>0</sub><sup><i>L</i>/<i>v</i><sub>0</sub></sup> (<i>eE</i><sub>0</sub><i>v</i><sub>0</sub>/<i>mL</i>) <i>t</i> d<i>t</i> = ½(<i>eE</i><sub>0</sub>/<i>m</i>)(<i>L</i>/<i>v</i><sub>0</sub>) = ${p(P8b.vy / 1e6, 2)} × 10<sup>6</sup> m/s</div><p>균일한 전기장일 때 값(${p(PL.vyExit / 1e6, 2)} × 10<sup>6</sup> m/s)의 절반이다. 평균적으로 전기장이 절반 세기이기 때문이다.</p>` },
  ],
};
