// gauss/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const K = M.K, E0 = M.EPS0, PI = Math.PI;

// ---- page 0: the page's square at 60°; a field that grows across a square ----
const P0 = { th: 60 };
P0.F = M.flux(P0.th);
P0.nums = [M.FLUX.E * M.FLUX.A * Math.sin(P0.th * PI / 180), P0.F, M.FLUX.max, M.FLUX.E * M.FLUX.side * Math.cos(P0.th * PI / 180)];   // sin · right · face on · side not area
const P0b = { b: 3.0e4, s: 0.20 };
P0b.F = P0b.b * P0b.s ** 3 / 2;
P0b.nums = [P0b.b * P0b.s ** 3, P0b.b * P0b.s ** 3 / 3, P0b.b * P0b.s ** 2 / 2, P0b.F];   // E at the far edge × A · ∫y² · lost an s · right
// ---- page 1: a cube around the page's charge; E = c r inside a sphere ----
const P1 = { q: M.POINT.q };
P1.nums = [P1.q / (6 * E0), P1.q / E0, K * P1.q, P1.q / (2 * E0)];
const P1b = { c: 5.0e4, R: 0.10 };
P1b.q = 4 * PI * E0 * P1b.c * P1b.R ** 3;
P1b.nums = [E0 * P1b.c * P1b.R ** 3, 4 * PI * E0 * P1b.c * P1b.R ** 2, 4 / 3 * PI * E0 * P1b.c * P1b.R ** 3, P1b.q].map(q => q * 1e9);   // no 4π · lost an R · volume, not area · right
// ---- page 2: the page's line, at 5 cm; potential difference out to 20 cm ----
const lam = M.LINE.lam;
const P2 = { r: 0.05 };
P2.nums = [K * lam / P2.r, M.lineE(P2.r), 2 * K * lam / P2.r ** 2, lam / (2 * E0 * P2.r)];   // lost 2 · right · 1/r² · lost π
const P2b = { r1: 0.05, r2: 0.20 };
P2b.dV = 2 * K * lam * Math.log(P2b.r2 / P2b.r1);
P2b.nums = [2 * K * lam * (1 / P2b.r1 - 1 / P2b.r2), M.lineE(P2b.r1) * (P2b.r2 - P2b.r1), P2b.dV, M.lineE(P2b.r2) * (P2b.r2 - P2b.r1)];
// ---- page 3: two sheets ±σ; a slab with ρ = ρ₀|x|/d ----
const sg = M.SHEET.sigma;
const P3 = { nums: [sg / E0, sg / (2 * E0), 0, 2 * sg / E0] };      // field between the sheets, per choice
const P3b = { rho0: 4.0e-7, d: 0.05, x: 0.02 };
P3b.E = P3b.rho0 * P3b.x ** 2 / (2 * E0 * P3b.d);
P3b.nums = [2 * P3b.E, P3b.E, P3b.rho0 * P3b.x / (2 * E0), P3b.E / 2];   // one cap · right · ρ₀ uniform · lost a 2
// ---- page 4: field energy outside the page's metal sphere ----
const { Q, R } = M.SPH;
const P4 = { U: K * Q * Q / (2 * R) };
P4.nums = [2 * P4.U, P4.U / 2, P4.U / 3, P4.U].map(u => u * 1e6);   // kQ²/R · only out to 2R · surface density × sphere's volume · right
// ---- page 5: the page's insulating sphere at R/2 ----
const P5 = { r: R / 2 };
P5.E = M.iSphere.E(P5.r);
P5.nums = [K * Q / P5.r ** 2, P5.E, 0, 3 * P5.E];
// ---- page 6: the page's insulating rod at R/2 ----
const P6 = { r: M.ROD.R / 2 };
P6.E = M.iRod.E(P6.r);
P6.nums = [0, 2 * K * M.ROD.lam / P6.r, P6.E, M.ROD.lam * P6.r / (2 * E0 * M.ROD.R ** 2)];   // metal · outside formula · right · lost π
// ---- page 7: the page's ρ = br sphere at R/2; ρ = br² ----
const P7 = { r: R / 2 };
P7.E = M.nSphere.E(P7.r);
P7.nums = [M.nSphere.rho(P7.r) * P7.r / (3 * E0), M.iSphere.E(P7.r), P7.E, 4 * P7.E];   // local ρ as if uniform · uniform sphere · right · lost the 4
const P7b = { nums: [1 / 8, 1 / 32, 1 / 16, 1 / 4] };
// ---- page 8: the induced charge on the cage's right half ----
const P8 = { q: 3 * E0 * M.CAGE.E0 * PI * M.CAGE.R ** 2 };
P8.nums = [0, P8.q, 2 * P8.q, P8.q / 3].map(q => q * 1e9);   // net zero · right · σ_max × area · lost the 3

const fr = x => ({ 0.125: '1/8', 0.03125: '1/32', 0.0625: '1/16', 0.25: '1/4' })[x];

export const PRACTICE = {
  0: [
    { q: `이 페이지의 한 변 ${p(M.FLUX.side * 100, 0)} cm인 정사각형이 ${p(M.FLUX.E / 1000, 1)} kN/C의 균일한 전기장 속에 있고, 면적 벡터가 <b>E</b>와 ${P0.th}°를 이룬다. 이 면을 지나는 선속은 얼마인가?`,
      choices: P0.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 1, nums: P0.nums,
      why: `<div class="eq">Φ = <i>EA</i> cos θ = ${M.FLUX.E} × ${p(M.FLUX.A, 3)} m² × cos ${P0.th}° = ${p(P0.F, 1)} N·m²/C</div><p>θ는 <b>면적 벡터</b>(법선)로부터 잰 각이므로 sin이 아니라 cos이다. sin이 맞는 것은 θ가 면 자체와 이루는 각일 때뿐이다.</p>` },
    { q: `전기장 <b>E</b> = <i>by</i> <b>x̂</b> (<i>b</i> = 미터당 ${p(P0b.b / 1e4, 1)} × 10<sup>4</sup> N/C)가 <i>yz</i> 평면 위 0 ≤ <i>y</i> ≤ ${p(P0b.s, 2)} m에 놓인 한 변 ${p(P0b.s * 100, 0)} cm인 정사각형을 지난다. 이 정사각형(법선 +<b>x̂</b>)을 지나는 선속은 얼마인가?`,
      choices: P0b.nums.map(x => `${g(x)} N·m²/C`), answer: 3, nums: P0b.nums,
      why: `<p><i>E</i>가 정사각형 위에서 변하므로 폭 d<i>y</i>, 길이 <i>s</i>인 띠로 자른다. 각 띠의 선속은 <i>E</i>(<i>y</i>) <i>s</i> d<i>y</i>다.</p><div class="eq">Φ = ∫<sub>0</sub><sup><i>s</i></sup> <i>by</i> · <i>s</i> d<i>y</i> = <i>bs</i>³/2 = ${g(P0b.F)} N·m²/C</div><p>먼 가장자리의 전기장을 정사각형 전체에 쓰면 그 두 배인 ${g(P0b.nums[0])}이 나온다.</p>` },
  ],
  1: [
    { q: `이 페이지의 ${p(P1.q * 1e9, 1)} nC 전하가 정육면체의 중심에 있다. 정육면체의 <b>한</b> 면을 지나는 선속은 얼마인가?`,
      choices: P1.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 0, nums: P1.nums,
      why: `<p>가우스 법칙: 정육면체 전체의 선속은 <i>q</i>/ε<sub>0</sub> = ${p(P1.nums[1], 0)} N·m²/C다. 대칭성 때문에 여섯 면이 똑같이 나눠 가진다.</p><div class="eq">Φ<sub>face</sub> = <i>q</i>/6ε<sub>0</sub> = ${p(P1.nums[0], 1)} N·m²/C</div><p><i>kq</i> = ${p(P1.nums[2], 2)}도 단위는 N·m²/C이지만, 이것은 <i>q</i>/4πε<sub>0</sub>일 뿐 어떤 면을 지나는 선속도 아니다.</p>` },
    { q: `어떤 영역에서 전기장이 지름 방향이고 <i>E</i> = <i>cr</i> (<i>c</i> = 미터당 ${p(P1b.c / 1e4, 1)} × 10<sup>4</sup> N/C)이다. 원점을 중심으로 하는 반지름 ${p(P1b.R * 100, 0)} cm인 구 안의 전하는 얼마인가?`,
      choices: P1b.nums.map(x => `${g(x)} nC`), answer: 3, nums: P1b.nums,
      why: `<p>구면 위 어디서나 <b>E</b> ∥ d<b>A</b>이고 <i>E</i> = <i>cR</i>이므로</p><div class="eq">∮<b>E</b> · d<b>A</b> = <i>cR</i> · 4π<i>R</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>q</i><sub>enc</sub> = 4πε<sub>0</sub><i>cR</i>³ = ${g(P1b.q * 1e9)} nC</div><p>표면적은 ⁴⁄₃π<i>R</i>³이 아니라 4π<i>R</i>²다. 선속은 면적분이다.</p>` },
  ],
  2: [
    { q: `이 페이지의 직선은 λ = ${p(lam * 1e9, 1)} nC/m를 띤다. 직선에서 ${p(P2.r * 100, 0)} cm 떨어진 곳의 전기장은 얼마인가?`,
      choices: P2.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P2.nums,
      why: `<p>동축 원통을 쓰면 밑면으로는 선속이 없고 <i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub>이므로</p><div class="eq"><i>E</i> = λ/2πε<sub>0</sub><i>r</i> = 2<i>k</i>λ/<i>r</i> = ${p(P2.nums[1], 0)} N/C</div><p>직선의 전기장은 1/<i>r</i>²(${p(P2.nums[2], 0)} N/C)이 아니라 1/<i>r</i>로 줄어든다.</p>` },
    { q: `그 직선에서 ${p(P2b.r1 * 100, 0)} cm 떨어진 곳의 전위는 ${p(P2b.r2 * 100, 0)} cm 떨어진 곳보다 얼마나 높은가?`,
      choices: P2b.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq"><i>V</i>(<i>r</i><sub>1</sub>) − <i>V</i>(<i>r</i><sub>2</sub>) = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (2<i>k</i>λ/<i>r</i>) d<i>r</i> = 2<i>k</i>λ ln(<i>r</i><sub>2</sub>/<i>r</i><sub>1</sub>) = ${p(2 * K * lam, 2)} × ln ${p(P2b.r2 / P2b.r1, 0)} = ${p(P2b.dV, 1)} V</div><p>1/<i>r</i>를 적분하면 로그가 된다. 점전하에서 하던 대로 1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub>를 쓰면 ${p(P2b.nums[0], 1)} V가 나온다. 가까운 곳의 전기장에 거리를 곱한 ${p(P2b.nums[1], 1)} V는 <i>E</i>가 줄어든다는 점을 무시한 것이다.</p>` },
  ],
  3: [
    { q: `나란한 커다란 부도체 면 두 장이 +σ와 −σ를 띤다(σ = ${p(sg * 1e9, 1)} nC/m²). 전기장은 어떠한가?`,
      choices: [`사이에서 ${p(P3.nums[0], 0)} N/C, 바깥에서 0`, `사이와 바깥 모두 ${p(P3.nums[1], 0)} N/C`, `사이에서 0, 바깥에서 ${p(P3.nums[0], 0)} N/C`, `사이에서 ${p(P3.nums[3], 0)} N/C, 바깥에서 0`], answer: 0, nums: P3.nums,
      why: `<p>면 하나는 양쪽에 σ/2ε<sub>0</sub> = ${p(P3.nums[1], 0)} N/C를 만들며, +에서 멀어지고 −를 향한다. 두 면 사이에서는 두 전기장이 같은 방향이라 더해지고, 바깥에서는 반대 방향이라 상쇄된다.</p><div class="eq">사이에서 <i>E</i> = σ/2ε<sub>0</sub> + σ/2ε<sub>0</sub> = σ/ε<sub>0</sub> = ${p(P3.nums[0], 0)} N/C</div>` },
    { q: `두꺼운 부도체 판이 −<i>d</i> ≤ <i>x</i> ≤ <i>d</i> (<i>d</i> = ${p(P3b.d * 100, 0)} cm)를 채우고 있고, ρ = ρ<sub>0</sub>|<i>x</i>|/<i>d</i>, ρ<sub>0</sub> = ${p(P3b.rho0 * 1e7, 1)} × 10<sup>−7</sup> C/m³이다. <i>x</i> = ${p(P3b.x * 100, 0)} cm에서 전기장은 얼마인가?`,
      choices: P3b.nums.map(x => `${g(x)} N/C`), answer: 1, nums: P3b.nums,
      why: `<p>−<i>x</i>부터 <i>x</i>까지, 밑면 넓이가 <i>A</i>인 납작한 원통을 쓴다. 대칭성 때문에 전기장은 <b>두</b> 밑면 모두로 나간다.</p><div class="eq">2<i>EA</i> = (1/ε<sub>0</sub>) · 2<i>A</i>∫<sub>0</sub><sup><i>x</i></sup> ρ<sub>0</sub><i>x</i>′/<i>d</i> d<i>x</i>′ = <i>A</i>ρ<sub>0</sub><i>x</i>²/ε<sub>0</sub><i>d</i> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>x</i>²/2ε<sub>0</sub><i>d</i> = ${g(P3b.E)} N/C</div><p>밑면 하나만 세면 두 배(${g(P3b.nums[0])} N/C)가 된다.</p>` },
  ],
  4: [
    { q: '전하 +<i>Q</i>를 띤 금속 구가, 알짜 전하가 −3<i>Q</i>인 두꺼운 동심 금속 껍질의 중심에 있다. 껍질 <b>바깥</b> 표면의 전하는 얼마인가?',
      choices: ['−3<i>Q</i>', '−<i>Q</i>', '+<i>Q</i>', '−2<i>Q</i>'], answer: 3,
      why: '<p>껍질의 금속 안에 그린 가우스 구면 위에서는 <i>E</i> = 0이므로 감싼 전하가 0이다. 따라서 안쪽 표면은 구의 +<i>Q</i>를 상쇄할 −<i>Q</i>를 가져야 한다. 껍질의 −3<i>Q</i> 중 나머지는 바깥 표면으로 간다. −3<i>Q</i> − (−<i>Q</i>) = −2<i>Q</i>.</p>' },
    { q: `이 페이지의 금속 구(<i>Q</i> = ${p(Q * 1e9, 1)} nC, <i>R</i> = ${p(R * 100, 0)} cm) 바깥의 전기장에 저장된 에너지는 얼마인가? (에너지 밀도는 ε<sub>0</sub><i>E</i>²/2.)`,
      choices: P4.nums.map(x => `${g(x)} μJ`), answer: 3, nums: P4.nums,
      why: `<p>금속 안에서는 <i>E</i> = 0이다. 바깥에서는 부피 4π<i>r</i>² d<i>r</i>인 껍질을 더한다.</p><div class="eq"><i>U</i> = ∫<sub><i>R</i></sub><sup>∞</sup> (ε<sub>0</sub>/2)(<i>kQ</i>/<i>r</i>²)² 4π<i>r</i>² d<i>r</i> = <i>kQ</i>²/2<i>R</i> = ${g(P4.U * 1e6)} μJ</div><p>2<i>R</i>에서 멈추면 절반(${g(P4.nums[1])} μJ)뿐이다. 멀리 있는 전기장에도 에너지가 있기 때문이다. 표면의 에너지 밀도에 구의 부피를 곱하면(${g(P4.nums[2])} μJ) 에너지를 엉뚱한 곳에 둔 것이다. 금속 안에는 에너지가 없다.</p>` },
  ],
  5: [
    { q: `이 페이지의 절연체 구(<i>Q</i> = ${p(Q * 1e9, 1)} nC가 고르게 퍼짐, <i>R</i> = ${p(R * 100, 0)} cm). 중심에서 ${p(P5.r * 100, 0)} cm 떨어진 곳의 전기장은 얼마인가?`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>반지름 <i>r</i>인 가우스 구면 안에는 <i>Q</i>(<i>r</i>/<i>R</i>)³ = <i>Q</i>/8이 있다.</p><div class="eq"><i>E</i> · 4π<i>r</i>² = <i>Q</i>(<i>r</i>/<i>R</i>)³/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kQr</i>/<i>R</i>³ = ${p(P5.E, 0)} N/C</div><p>0은 <i>금속</i> 구의 답이다. <i>kQ</i>/<i>r</i>²은 가우스 구면 바깥에 있는 전하까지 센 것이다.</p>` },
    { q: '절연체 구 껍질의 안쪽 반지름은 <i>a</i>, 바깥 반지름은 <i>b</i>이고 전하 밀도 ρ가 균일하다. 세 영역 모두에서 <i>E</i>(<i>r</i>)를 구하라.',
      solution: '<p>구 대칭: 반지름 <i>r</i>인 가우스 구면에서 <i>E</i> · 4π<i>r</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub>이고, <i>q</i><sub>enc</sub> = ∫ ρ 4π<i>r</i>′² d<i>r</i>′는 안쪽의 대전된 부분에 대해 적분한다.</p><div class="eq"><i>r</i> &lt; <i>a</i>: &nbsp;<i>q</i><sub>enc</sub> = 0, &nbsp;<i>E</i> = 0</div><div class="eq"><i>a</i> &lt; <i>r</i> &lt; <i>b</i>: &nbsp;<i>q</i><sub>enc</sub> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> ρ4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₃πρ(<i>r</i>³ − <i>a</i>³), &nbsp;<i>E</i> = ρ(<i>r</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>²</div><div class="eq"><i>r</i> &gt; <i>b</i>: &nbsp;<i>E</i> = ρ(<i>b</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>² = <i>kQ</i>/<i>r</i>²</div><p>확인: <i>r</i> = <i>a</i>에서 가운데 식은 0이고 <i>r</i> = <i>b</i>에서는 바깥 식과 만나므로 <i>E</i>는 연속이다. <i>a</i> = 0이면 속이 찬 구의 ρ<i>r</i>/3ε<sub>0</sub>이 된다.</p>' },
  ],
  6: [
    { q: `이 페이지의 절연체 막대(λ = ${p(M.ROD.lam * 1e9, 1)} nC/m가 고르게 퍼짐, <i>R</i> = ${p(M.ROD.R * 100, 0)} cm). 축에서 ${p(P6.r * 100, 1)} cm 떨어진 곳의 전기장은 얼마인가?`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<p>반지름 <i>r</i>, 길이 <i>L</i>인 동축 원통 안에는 λ<i>L</i>(<i>r</i>/<i>R</i>)²이 있다.</p><div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i><i>r</i>²/<i>R</i>²ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ<i>r</i>/<i>R</i>² = ${p(P6.E, 0)} N/C</div><p>2<i>k</i>λ/<i>r</i>(${p(P6.nums[1], 0)} N/C)는 λ 전체를 감싸는 바깥에서만 성립한다. 0은 금속 막대의 답이다.</p>` },
    { q: '반지름 <i>R</i>인 긴 절연체 원기둥의 전하 밀도가 ρ = ρ<sub>0</sub><i>r</i>/<i>R</i>이다. 내부(<i>r</i> &lt; <i>R</i>)의 전기장은 무엇인가?',
      choices: ['ρ<sub>0</sub><i>r</i>/2ε<sub>0</sub>', 'ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>³/3ε<sub>0</sub><i>R</i>²'], answer: 1,
      why: '<p>부피가 각각 2π<i>r</i>′<i>L</i> d<i>r</i>′인 얇은 원통 껍질을 더한다.</p><div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> (ρ<sub>0</sub><i>r</i>′/<i>R</i>) 2π<i>r</i>′<i>L</i> d<i>r</i>′ = 2πρ<sub>0</sub><i>Lr</i>³/3<i>R</i></div><div class="eq"><i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i></div><p>ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i>는 적분하지 않고 그 자리의 ρ(<i>r</i>)를 균일한 막대의 결과에 대입한 것이다.</p>' },
  ],
  7: [
    { q: `이 페이지의 구는 ρ = <i>br</i>이다(<i>Q</i> = ${p(Q * 1e9, 1)} nC, <i>R</i> = ${p(R * 100, 0)} cm, <i>b</i> = ${p(M.SPH.b * 1e6, 2)} μC/m⁴). 중심에서 ${p(P7.r * 100, 0)} cm 떨어진 곳의 전기장은 얼마인가?`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P7.nums,
      why: `<div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴, &nbsp;<i>E</i> = π<i>br</i>⁴/(4πε<sub>0</sub><i>r</i>²) = <i>br</i>²/4ε<sub>0</sub> = ${p(P7.E, 0)} N/C</div><p>전하가 바깥쪽에 몰려 있어서 <i>R</i>/2 안에는 <i>Q</i>/16뿐이다. 같은 <i>Q</i>의 균일한 구라면 ${p(P7.nums[1], 0)} N/C, ρ(<i>r</i>)를 ρ<i>r</i>/3ε<sub>0</sub>에 대입하면 ${p(P7.nums[0], 0)} N/C가 나온다.</p>` },
    { q: '반지름 <i>R</i>인 구의 전하 밀도가 ρ = <i>br</i>²이다. 전체 전하 중 몇 분의 몇이 <i>r</i> = <i>R</i>/2 안에 있는가?',
      choices: P7b.nums.map(fr), answer: 1, nums: P7b.nums,
      why: '<div class="eq"><i>q</i>(<i>r</i>) = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′² 4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₅π<i>br</i>⁵ &nbsp;→&nbsp; <i>q</i>(<i>R</i>/2)/<i>q</i>(<i>R</i>) = (½)⁵ = 1/32</div><p>1/8은 균일한 구의 (½)³, 1/16은 ρ = <i>br</i>인 구의 (½)⁴다.</p>' },
  ],
  8: [
    { q: '점전하 +<i>q</i>가 중성인 두꺼운 구형 금속 껍질의 빈 곳 안, 중심에서 벗어난 자리에 있다. 껍질 바깥의 전기장은 어떠한가?',
      choices: ['0', '<i>kq</i>/<i>r</i>², <i>r</i>는 전하로부터 잰 거리', '<i>kq</i>/<i>r</i>², <i>r</i>는 껍질 중심으로부터 잰 거리', '전하에 가까운 쪽이 더 세다'], answer: 2,
      why: '<p>−<i>q</i>가 안쪽 표면에 고르지 않게 모여 금속 안의 전기장을 0으로 만든다. 그래서 바깥은 전하가 어디 있는지 알 수 없도록 차폐된다. 바깥 표면에 남은 +<i>q</i>는 안쪽에서 오는 전기장을 느끼지 않으므로, 고립된 구의 전하처럼 고르게 퍼진다. 바깥에서 동심 구면에 가우스 법칙을 쓰면 <b>껍질</b> 중심으로부터 <i>kq</i>/<i>r</i>²을 얻는다.</p>' },
    { q: `${p(M.CAGE.E0 / 1000, 1)} kN/C 전기장 속에 놓인 이 페이지의 대전되지 않은 껍질(<i>R</i> = ${p(M.CAGE.R * 100, 0)} cm)에서 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ이다. 전기장 하류 쪽 절반(cos θ &gt; 0)의 전체 전하는 얼마인가?`,
      choices: P8.nums.map(x => `${x ? g(x) : '0'} nC`), answer: 1, nums: P8.nums,
      why: `<p>폭이 <i>R</i> dθ인 고리의 넓이는 2π<i>R</i>² sin θ dθ다.</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i>² sin θ dθ = 3πε<sub>0</sub><i>E</i><sub>0</sub><i>R</i>² = ${g(P8.q * 1e9)} nC</div><p>나머지 절반은 −${g(P8.q * 1e9)} nC를 가지므로 껍질은 중성을 유지한다. σ<sub>max</sub>에 반구 넓이를 곱한 값(${g(P8.nums[2])} nC)은 σ가 가장자리에서 0으로 줄어든다는 점을 무시한 것이다.</p>` },
  ],
};
