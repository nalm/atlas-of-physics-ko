// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180), tan = d => Math.tan(d * Math.PI / 180);
const W = M.WHEEL, DS = M.DISC, DR = M.DOOR, PL = M.PLANK, LD = M.LADDER, SH = M.SHAPES, RD = M.ROD, WR = M.WRENCH, B = M.BOWL, WL = M.WELL, IM = M.IMP, SK = M.SKATE, HT = M.HIT;

// 0 · turns while speeding up
const Q0 = { th: 0.5 * W.alpha * W.tUp ** 2 };
Q0.rev = Q0.th / (2 * Math.PI);
// 1 · the edge rider at 1.6 s
const Q1 = { t: 1.6 };
Q1.p = M.pointAt(DS.r2, M.disc(Q1.t));
// 2 · the handle push at 30°, and α from the square push
const Q2 = { phi: 30 };
Q2.tau = M.torque(DR.cases[0].r, DR.F, Q2.phi);
Q2.alpha = DR.cases[0].tau / DR.I;
// 3 · crate 1.0 m from A
const Q3 = { x: 1.0 };
Q3.q = M.plank(Q3.x);
// 4 · ladder at 60°
const Q4 = { th: 60 };
Q4.f = M.ladder(Q4.th * Math.PI / 180).f;
// 5 · the disc after 2.0 s
const Q5 = { t: 2.0, disc: SH.list[1] };
Q5.w = Q5.disc.alpha * Q5.t;
// 6 · a rod whose density grows from one end, λ = Cx: I = ½ML²; an annulus R/2 → R: ⅝MR²
const Q6 = { I: 0.5 * RD.M * RD.L ** 2, Iann: 5 / 8 * SH.M * SH.R ** 2 };
// 7 · rod axis 0.30 m from one end; the end-pinned rod released from horizontal
const Q7 = { e: 0.30 };
Q7.d = RD.L / 2 - Q7.e;
Q7.I = RD.Icm + RD.M * Q7.d ** 2;
Q7.wBot = Math.sqrt(3 * G / RD.L);
// 8 · one 120° stroke
const Q8 = { W: WR.tau * WR.stroke };
// 9 · the disc at the bottom; h from the ramp
const Q9 = { h: M.RACE.h };
Q9.v = Math.sqrt(2 * G * Q9.h / 1.5);
// 10 · the bowling ball
const Q10 = { vf: 5 * B.v0 / 7, xStar: 12 * B.v0 ** 2 / (49 * B.muK * G) };
// 11 · bucket after the full 2.0 m
const Q11 = { v: Math.sqrt(2 * WL.a * WL.h) };
// 12 · a 100 N rim push for 0.90 s; a triangular torque pulse
const Q12 = { F: 100, dt: 0.9, peak: 200, T: 1.2 };
Q12.w = Q12.F * IM.R * Q12.dt / IM.I;
Q12.J = 0.5 * Q12.peak * Q12.T;
// 13 · the skater
const Q13 = { I0: M.inertia(SK.rOut), I1: M.inertia(SK.rIn) };
Q13.w = Q13.I0 * SK.w0 / Q13.I1;
Q13.wNoBody = (2 * SK.m * SK.rOut ** 2) * SK.w0 / (2 * SK.m * SK.rIn ** 2);
// 14 · the ball sticks to the rod; a ball dropped beside O
const Q14 = { w: HT.m * HT.v0 * HT.d / (HT.I + HT.m * HT.d ** 2), dLdt: HT.m * G * HT.d };

const eq = s => `<div class="eq">${s}</div>`;

export const PRACTICE = {
  0: [
    { q: `바퀴가 정지 상태에서 ${f(W.alpha, 1)} rad/s²로 ${f(W.tUp, 1)} s 동안 빨라진다. 그동안 바퀴는 몇 바퀴 도는가?`,
      choices: [`${p3(Q0.th / Math.PI)} 바퀴`, `${p3(Q0.th)} 바퀴`, `${p3(Q0.rev)} 바퀴`, `${p3(Q0.th * 2 * Math.PI)} 바퀴`], answer: 2,
      why: `<p>정지 상태에서 α가 일정하면 Δθ = ½αt²이며, 단위는 라디안이다. 이를 한 바퀴당 2π rad로 나눈다.</p>${eq(`Δθ = ½ × ${f(W.alpha, 1)} × ${f(W.tUp, 1)}² = ${f(Q0.th)} rad = ${f(Q0.th)} / 2π = ${p3(Q0.rev)} 바퀴`)}<p>${p3(Q0.th)} 바퀴는 ½αt²가 라디안으로 나온다는 것을 잊은 값이고, ${p3(Q0.th / Math.PI)} 바퀴는 ½을 빠뜨린 값이다.</p>` },
    { q: '시계 반대 방향을 양(+)으로 잡는다. 바퀴가 시계 반대 방향으로 돌면서 제동되고 있다. ω와 α의 부호는 어떠한가?',
      choices: ['ω > 0, α > 0', 'ω < 0, α < 0', 'ω < 0, α > 0', 'ω > 0, α < 0'], answer: 3,
      why: '<p>시계 반대 방향으로 돌므로 ω > 0이다. 느려지고 있으므로 α는 ω와 반대 방향이다: α < 0. ω의 부호는 회전 방향을 나타내고, α는 ω가 어느 쪽으로 변하는지만 알려 준다.</p>' },
  ],
  1: [
    { q: `회전목마가 일정한 ω로 돈다. ${DS.r2} m에 있는 탑승자의 구심 가속도는 ${DS.r1} m에 있는 탑승자의 몇 배인가?`,
      choices: ['1 (같은 ω, 같은 가속도)', '4', '2', '½'], answer: 2,
      why: '<p>둘은 같은 ω를 가지며, <i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω²이다. ω가 일정하면 <i>r</i>에 비례한다: 반지름이 두 배면 가속도도 두 배다.</p><p>4는 <i>v</i>²/<i>r</i>에서 <i>v</i>는 두 배로 했지만 분모의 <i>r</i>을 잊은 값이다.</p>' },
    { q: `놀이기구가 정지 상태에서 α = ${f(DS.alpha, 1)} rad/s²로 빨라진다. <i>t</i> = ${f(Q1.t, 1)} s일 때 ${DS.r2} m에 있는 탑승자의 전체 가속도의 크기는 얼마인가?`,
      choices: [`${p3(Q1.p.at)} m/s²`, `${p3(Q1.p.ac)} m/s²`, `${p3(Q1.p.a)} m/s²`, `${p3(Q1.p.at + Q1.p.ac)} m/s²`], answer: 2,
      why: `<p>ω = αt = ${f(DS.alpha * Q1.t)} rad/s. 서로 수직인 두 성분:</p>${eq(`<i>a</i><sub>t</sub> = rα = ${f(Q1.p.at)} m/s², <i>a</i><sub>c</sub> = rω² = ${f(Q1.p.ac)} m/s²`)}${eq(`<i>a</i> = √(${f(Q1.p.at)}² + ${f(Q1.p.ac)}²) = ${p3(Q1.p.a)} m/s²`)}<p>두 성분은 직각을 이루므로 수가 아니라 벡터로 더해야 한다(${p3(Q1.p.at + Q1.p.ac)}이 아니다).</p>` },
  ],
  2: [
    { q: `${f(DR.F, 0)} N의 힘이 경첩에서 ${f(DR.cases[0].r, 2)} m 떨어진 손잡이에, 문과 ${Q2.phi}°를 이루며 작용한다. 경첩에 대한 돌림힘은 얼마인가?`,
      choices: [`${p3(DR.F * DR.cases[0].r)} N·m`, `${p3(Q2.tau)} N·m`, `${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} N·m`, '0 N·m'], answer: 1,
      why: `<p>φ는 <b>r</b>(문을 따르는 방향)과 <b>F</b> 사이의 각으로, 여기서는 ${Q2.phi}°이다.</p>${eq(`τ = rF sin φ = ${f(DR.cases[0].r)} × ${f(DR.F, 0)} × sin ${Q2.phi}° = ${p3(Q2.tau)} N·m`)}<p>${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} N·m는 cos를 쓴 값이다: 그것은 문을 따라 경첩 쪽으로 미는 F의 성분이다.</p>` },
    { q: `문(${DR.M} kg, 폭 ${f(DR.W, 1)} m, I = ⅓MW²)의 손잡이를 수직으로 밀어 τ = ${f(DR.cases[0].tau, 1)} N·m를 가한다. 문의 각가속도는 얼마인가?`,
      choices: [`${p3(DR.cases[0].tau / (DR.M * DR.W ** 2))} rad/s²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 2))} rad/s²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 12))} rad/s²`, `${p3(Q2.alpha)} rad/s²`], answer: 3,
      why: `${eq(`I = ⅓MW² = ⅓ × ${DR.M} × ${f(DR.W, 1)}² = ${f(DR.I)} kg·m²`)}${eq(`α = τ/I = ${f(DR.cases[0].tau, 1)} / ${f(DR.I)} = ${p3(Q2.alpha)} rad/s²`)}<p>문은 가운데가 아니라 가장자리를 축으로 돌므로, (중심에 대한) <sup>1</sup>⁄<sub>12</sub>MW²를 쓰면 α가 지나치게 커진다.</p>` },
  ],
  3: [
    { q: `${PL.m} kg 상자가 길이 ${f(PL.L, 1)} m, 질량 ${PL.M} kg인 널빤지 위, 받침점 A에서 ${f(Q3.x, 1)} m 떨어진 곳에 놓여 있다. 받침점 B가 작용하는 힘은 얼마인가?`,
      choices: [`${p3(Q3.q.FA)} N`, `${p3((PL.Wp + PL.Wc) / 2)} N`, `${p3(Q3.x * PL.Wc / PL.L)} N`, `${p3(Q3.q.FB)} N`], answer: 3,
      why: `<p><i>F</i><sub>A</sub>의 지레 팔이 0인 A에 대한 돌림힘:</p>${eq(`${f(PL.L, 1)}·<i>F</i><sub>B</sub> = ${f(PL.L / 2, 1)} × ${f(PL.Wp, 0)} + ${f(Q3.x, 1)} × ${f(PL.Wc, 0)} → <i>F</i><sub>B</sub> = ${p3(Q3.q.FB)} N`)}<p>상자가 A에 더 가까우므로 A가 더 많이(${p3(Q3.q.FA)} N), B는 덜 떠받친다. ${p3(Q3.x * PL.Wc / PL.L)} N은 널빤지 자체의 무게를 잊은 값이다.</p>` },
    { q: '상자가 A에서 B 쪽으로 천천히 미끄러진다. 받침 힘들은 어떻게 변하는가?',
      choices: ['<i>F</i><sub>A</sub>는 줄고 <i>F</i><sub>B</sub>는 늘며, 그 합은 일정하다', '<i>F</i><sub>A</sub>는 늘고 <i>F</i><sub>B</sub>는 준다', '둘 다 일정하다: 전체 무게는 변하지 않는다', '<i>F</i><sub>A</sub>는 줄고 <i>F</i><sub>B</sub>는 늘며, 그 합은 커진다'], answer: 0,
      why: '<p>Σ<i>F</i> = 0이므로 합은 (M + m)g로 고정된다. A에 대한 Στ = 0에서 <i>F</i><sub>B</sub> = [(L/2)Mg + x·mg]/L이며, 이는 x에 따라 커진다. 따라서 <i>F</i><sub>B</sub>는 늘고 <i>F</i><sub>A</sub>는 같은 양만큼 준다.</p>' },
  ],
  4: [
    { q: `${LD.m} kg 사다리가 매끄러운 벽에 기대어 바닥과 ${Q4.th}°를 이룬다. 바닥이 제공해야 하는 마찰력은 얼마인가?`,
      choices: [`${p3(LD.W / tan(Q4.th))} N`, `${p3(Q4.f)} N`, `${p3(LD.muS * LD.W)} N`, `${p3(LD.W * tan(Q4.th) / 2)} N`], answer: 1,
      why: `<p>발에 대한 돌림힘: (L sin θ)<i>F</i><sub>w</sub> = (½L cos θ)mg, 따라서 <i>F</i><sub>w</sub> = mg / (2 tan θ). ΣF<sub>x</sub> = 0이므로 마찰력은 <i>F</i><sub>w</sub>와 같다:</p>${eq(`<i>f</i> = ${f(LD.W, 0)} / (2 tan ${Q4.th}°) = ${p3(Q4.f)} N`)}<p>${p3(LD.muS * LD.W)} N은 정지 마찰력이 낼 수 있는 <b>최댓값</b>이지, 실제로 내는 값이 아니다.</p>` },
    { q: '사다리를 길이는 같고 무게가 두 배인 것으로 바꾸어 같은 바닥에 세운다. 세워 둘 수 있는 최소 각은 어떻게 되는가?',
      choices: ['커진다', '작아진다', '같다', '더 길기도 할 때만 커진다'], answer: 2,
      why: '<p>필요한 마찰력 mg/(2 tan θ)와 낼 수 있는 마찰력 μ<sub>s</sub>mg는 둘 다 m에 비례한다. 둘을 같게 놓으면 tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>): m도 L도 없다.</p>' },
  ],
  5: [
    { q: '고리, 원판, 속이 찬 구가 질량과 반지름이 같고 같은 돌림힘을 받는다. 각가속도가 큰 것부터 순서대로 나열하면 어떻게 되는가?',
      choices: ['고리, 원판, 구', '구, 원판, 고리', '원판, 구, 고리', '모두 같다'], answer: 1,
      why: '<p>α = τ/I이고, I = MR²(고리), ½MR²(원판), ⅖MR²(구)이다. 구는 질량이 축에 가장 가까이 있어 I가 가장 작고 α가 가장 크다.</p>' },
    { q: `원판(${f(SH.M, 1)} kg, ${f(SH.R, 1)} m)이 정지 상태에서, 가장자리에 감긴 줄을 ${f(SH.F, 1)} N으로 당겨 돌기 시작한다. ${f(Q5.t, 1)} s 후의 ω는 얼마인가?`,
      choices: [`${p3(SH.F / Q5.disc.I * Q5.t)} rad/s`, `${p3(SH.tau / (SH.M * SH.R ** 2) * Q5.t)} rad/s`, `${p3(SH.tau / (0.4 * SH.M * SH.R ** 2) * Q5.t)} rad/s`, `${p3(Q5.w)} rad/s`], answer: 3,
      why: `${eq(`τ = FR = ${f(SH.tau)} N·m, I = ½MR² = ${f(Q5.disc.I)} kg·m²`)}${eq(`α = τ/I = ${f(Q5.disc.alpha)} rad/s², ω = αt = ${p3(Q5.w)} rad/s`)}<p>${p3(SH.F / Q5.disc.I * Q5.t)} rad/s는 힘을 돌림힘처럼 쓴 값이다.</p>` },
  ],
  6: [
    { q: `질량 ${f(RD.M, 1)} kg, 길이 ${f(RD.L, 1)} m인 막대가 한쪽 끝으로 갈수록 밀도가 커진다: 가벼운 끝 O로부터의 거리 x에 대해 λ = Cx이다. O를 지나고 막대에 수직인 축에 대한 I는 얼마인가?`,
      choices: [`${p3(RD.M * RD.L ** 2 / 3)} kg·m²`, `${p3(Q6.I)} kg·m²`, `${p3(RD.M * RD.L ** 2 / 4)} kg·m²`, `${p3(RD.M * RD.L ** 2)} kg·m²`], answer: 1,
      why: `<p>먼저 질량으로 C를 정한 뒤, dm = Cx dx로 r² dm을 적분한다:</p>${eq(`M = ∫<sub>0</sub><sup>L</sup> Cx dx = ½CL² → C = 2M/L²`)}${eq(`I = ∫<sub>0</sub><sup>L</sup> x²·Cx dx = ¼CL⁴ = ½ML² = ${p3(Q6.I)} kg·m²`)}<p>균일한 막대의 ⅓ML²(${p3(RD.M * RD.L ** 2 / 3)})보다 크다: 질량이 더 바깥에 있기 때문이다. ¼ML²는 C를 2M/L²로 바꾸는 것을 잊은 값이다.</p>` },
    { q: `질량 M인 납작한 와셔(고리 모양 판)의 안쪽 반지름은 R/2, 바깥 반지름은 R이다. I = ∫r² dm을 이용해 중심에 대해 I = ⅝MR²임을 보이고, M = ${f(SH.M, 1)} kg, R = ${f(SH.R, 1)} m일 때의 값을 구하라.`,
      solution: `<p>단위 넓이당 질량 σ = M / [π(R² − R²/4)] = 4M / (3πR²). 반지름 r, 폭 dr인 고리의 질량은 dm = σ·2πr dr이다.</p>${eq(`I = ∫<sub>R/2</sub><sup>R</sup> r²·σ2πr dr = 2πσ [r⁴/4]<sub>R/2</sub><sup>R</sup> = 2πσ · (15/64)R⁴`)}${eq(`I = 2π · 4M/(3πR²) · 15R⁴/64 = (120/192)MR² = ⅝MR²`)}${eq(`I = ⅝ × ${f(SH.M, 1)} × ${f(SH.R, 1)}² = ${p3(Q6.Iann)} kg·m²`)}<p>원판(½MR²)과 고리(MR²) 사이의 값으로, 마땅히 그래야 한다: 구멍 때문에 질량이 바깥으로 옮겨 갔다.</p>` },
  ],
  7: [
    { q: `${f(RD.M, 1)} kg, ${f(RD.L, 1)} m 막대(I<sub>cm</sub> = ${f(RD.Icm)} kg·m²)가 한쪽 끝에서 ${f(Q7.e, 2)} m 떨어진, 막대에 수직인 축을 중심으로 돈다. 관성 모멘트는 얼마인가?`,
      choices: [`${p3(RD.Icm + RD.M * Q7.d)} kg·m²`, `${p3(RD.M * Q7.d ** 2)} kg·m²`, `${p3(RD.Iend + RD.M * Q7.e ** 2)} kg·m²`, `${p3(Q7.I)} kg·m²`], answer: 3,
      why: `<p>이 정리는 질량 중심을 지나는 축에서 출발하므로 d는 중심에서 잰다: d = ${f(RD.L / 2, 2)} − ${f(Q7.e, 2)} = ${f(Q7.d, 2)} m.</p>${eq(`I = I<sub>cm</sub> + Md² = ${f(RD.Icm)} + ${f(RD.M, 1)} × ${f(Q7.d, 2)}² = ${p3(Q7.I)} kg·m²`)}<p>${p3(RD.Iend + RD.M * Q7.e ** 2)}는 끝에 대한 값에 Md²를 더한 것이지만, 끝은 질량 중심이 아니다.</p>` },
    { q: `막대의 한쪽 끝을 고정하고 수평인 상태에서 가만히 놓는다. 평행축 정리로 I를 구하고, 수평선 아래로 내려간 각 θ에 대한 미분 방정식으로 Στ = Iα를 쓴 다음, 이를 적분해 맨 아래를 지날 때의 ω를 구하라.`,
      solution: `<p>I = <sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML². 중력은 고정핀에서 L/2 떨어진 중심에 작용하며, 지레 팔은 (L/2)cos θ이다:</p>${eq(`⅓ML² · d²θ/dt² = Mg(L/2) cos θ`)}${eq(`d²θ/dt² = (3g / 2L) cos θ`)}<p>d²θ/dt² = ω dω/dθ로 쓰고 θ = 0, ω = 0부터 적분한다:</p>${eq(`∫<sub>0</sub><sup>ω</sup> ω dω = (3g/2L) ∫<sub>0</sub><sup>θ</sup> cos θ dθ → ω² = (3g/L) sin θ`)}${eq(`맨 아래, θ = 90°에서: ω = √(3g/L) = √(3 × ${f(G)} / ${f(RD.L, 1)}) = ${p3(Q7.wBot)} rad/s`)}<p>에너지로 확인: 중심이 L/2만큼 내려가므로 Mg(L/2) = ½(⅓ML²)ω²이며, 같은 결과다. α가 일정하지 않으므로 ω² = 2αΔθ는 적용할 수 없다.</p>` },
  ],
  8: [
    { q: `${f(WR.r, 2)} m 렌치에 수직으로 ${f(WR.F, 0)} N의 힘을 가해 너트를 120° 한 번 돌린다. 한 일은 얼마인가?`,
      choices: [`${p3(WR.tau)} J`, `${p3(WR.F * WR.stroke)} J`, `${p3(Q8.W)} J`, `${p3(WR.tau * 120)} J`], answer: 2,
      why: `${eq(`W = τΔθ = (${f(WR.r, 2)} × ${f(WR.F, 0)}) × 2π/3 = ${f(WR.tau, 0)} × ${f(WR.stroke, 3)} = ${p3(Q8.W)} J`)}<p>Δθ는 라디안이어야 한다. ${p3(WR.tau * 120)} J은 120(도)을 곱한 값이다.</p>` },
    { q: '같은 너트에는 같은 돌림힘이 필요하다. 길이가 두 배인 렌치를 쓰면, 필요한 힘과 120° 한 번 돌릴 때의 일은 어떻게 되는가?',
      choices: ['힘은 절반, 일도 절반', '힘은 절반, 일은 같다', '힘은 같고, 일은 두 배', '힘은 절반, 일은 두 배'], answer: 1,
      why: '<p>τ = rF: r이 두 배면 F는 절반이다. W = τΔθ: τ와 각이 같으므로 일도 같다. 손은 절반의 힘으로 두 배의 거리를 움직인다.</p>' },
  ],
  9: [
    { q: `원판(I = ½mR²)이 ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° 기울어진 ${f(M.RACE.len, 1)} m 경사면을 정지 상태에서 미끄러지지 않고 굴러 내려간다. 바닥에서의 속력은 얼마인가?`,
      choices: [`${p3(Math.sqrt(2 * G * Q9.h))} m/s`, `${p3(Math.sqrt(2 * G * Q9.h / 1.4))} m/s`, `${p3(Math.sqrt(G * Q9.h))} m/s`, `${p3(Q9.v)} m/s`], answer: 3,
      why: `<p>h = ${f(M.RACE.len, 1)} sin ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° = ${f(Q9.h, 3)} m. ω = v/R이면:</p>${eq(`mgh = ½mv² + ½(½mR²)(v/R)² = ¾mv² → v = √(4gh/3) = ${p3(Q9.v)} m/s`)}<p>${p3(Math.sqrt(2 * G * Q9.h))} m/s는 회전에 에너지를 전혀 쓰지 않는, 미끄러지는 상자의 값이다.</p>` },
    { q: '속이 찬 구(⅖MR²), 속이 빈 구(⅔MR²), 고리(MR²)가 같은 경사면을 정지 상태에서 굴러 내려간다. 어떤 순서로 도착하는가?',
      choices: ['고리, 속이 빈 구, 속이 찬 구', '모두 동시에', '속이 찬 구, 속이 빈 구, 고리', '속이 빈 구, 속이 찬 구, 고리'], answer: 2,
      why: '<p>I = fMR²이면 a = g sin θ / (1 + f)이다. f가 작을수록 회전에 쓰는 에너지가 적어 빠르다: 속이 찬 구(0.4), 속이 빈 구(0.67), 고리(1) 순이다. 질량과 반지름은 소거된다.</p>' },
  ],
  10: [
    { q: `볼링공이 회전 없이 ${f(B.v0, 1)} m/s로 손을 떠나, 구르기 시작할 때까지 미끄러진다. 구르기 시작할 때의 속력은 얼마인가?`,
      choices: [`${p3(B.v0)} m/s`, `${p3(Q10.vf)} m/s`, `${p3(B.v0 / Math.sqrt(1.4))} m/s`, `${p3(2 * B.v0 / 7)} m/s`], answer: 1,
      why: `<p>접촉선에 대해 마찰력은 돌림힘이 없으므로 mvR + Iω는 mv<sub>0</sub>R로 유지된다. 구를 때는 ω = v/R:</p>${eq(`mv<sub>0</sub>R = mvR + ⅖mR²(v/R) → v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub> = ${p3(Q10.vf)} m/s`)}<p>${p3(B.v0 / Math.sqrt(1.4))} m/s는 운동 에너지가 보존된다고 가정한 값이지만, 공이 미끄러지는 동안 운동 마찰력이 그 일부를 열로 바꾼다.</p>` },
    { q: `미끄러지는 동안(μ<sub>k</sub> = ${f(B.muK, 1)})의 v(t)와 ω(t)를 쓰고, v = Rω가 되는 시간 t*를 구한 다음, v(t)를 적분해 공이 미끄러진 거리를 구하라.`,
      solution: `<p>마찰력 μ<sub>k</sub>mg가 바닥에서 뒤쪽으로 작용한다:</p>${eq(`m dv/dt = −μ<sub>k</sub>mg → v = v<sub>0</sub> − μ<sub>k</sub>g t`)}${eq(`⅖mR² dω/dt = μ<sub>k</sub>mgR → ω = (5μ<sub>k</sub>g / 2R) t`)}${eq(`v<sub>0</sub> − μ<sub>k</sub>g t* = <sup>5</sup>⁄<sub>2</sub>μ<sub>k</sub>g t* → t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g = ${f(B.tStar, 3)} s`)}${eq(`x* = ∫<sub>0</sub><sup>t*</sup> (v<sub>0</sub> − μ<sub>k</sub>g t) dt = v<sub>0</sub>t* − ½μ<sub>k</sub>g t*²`)}${eq(`x* = 12v<sub>0</sub>² / 49μ<sub>k</sub>g = ${p3(Q10.xStar)} m`)}<p>둘 다 R이나 m에 의존하지 않는다.</p>` },
  ],
  11: [
    { q: `${f(WL.m, 1)} kg 양동이가 정지 상태에서 떨어지며 ${f(WL.M, 1)} kg 드럼(속이 찬 원통)에 감긴 줄을 푼다. ${f(WL.h, 1)} m 떨어진 뒤의 속력은 얼마인가?`,
      choices: [`${p3(Math.sqrt(2 * G * WL.h))} m/s`, `${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} m/s`, `${p3(Q11.v)} m/s`, `${p3(Math.sqrt(WL.a * WL.h))} m/s`], answer: 2,
      why: `${eq(`a = mg / (m + ½M) = ${f(WL.m * G, 1)} / ${f(WL.m + WL.M / 2, 1)} = ${f(WL.a)} m/s²`)}${eq(`v = √(2ah) = √(2 × ${f(WL.a)} × ${f(WL.h, 1)}) = ${p3(Q11.v)} m/s`)}<p>${p3(Math.sqrt(2 * G * WL.h))} m/s는 드럼이 가져가는 에너지를 무시한 자유 낙하 값이고, ${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} m/s는 드럼을 굴렁쇠(I = MR²)처럼 취급한 값이다.</p>` },
    { q: '양동이가 떨어지는 동안 밧줄의 장력은 어떠한가?',
      choices: ['양동이의 무게와 같다', '양동이의 무게보다 크다', '양동이의 무게보다 작지만 0보다 크다', '양동이가 떨어지고 있으므로 0이다'], answer: 2,
      why: `<p>양동이는 아래로 가속하므로 mg − T = ma > 0: T < mg. 그러나 밧줄은 드럼을 점점 빨리 돌리기 위해 드럼을 당겨야 하므로(rT = Iα) T > 0이다. 여기서 T = ${f(WL.T)} N이고, mg = ${f(WL.m * G, 1)} N이다.</p>` },
  ],
  12: [
    { q: `회전목마(I = ${f(IM.I, 0)} kg·m², R = ${f(IM.R, 1)} m)가 정지해 있다. 가장자리에 접선 방향으로 ${Q12.F} N의 힘을 ${f(Q12.dt, 2)} s 동안 가한다. 최종 ω는 얼마인가?`,
      choices: [`${p3(Q12.F * Q12.dt / IM.I)} rad/s`, `${p3(Q12.w)} rad/s`, `${p3(Q12.F * IM.R * Q12.dt / (IM.M * IM.R ** 2))} rad/s`, `${p3(Q12.F * IM.R / IM.I)} rad/s`], answer: 1,
      why: `${eq(`ΔL = τΔt = (${Q12.F} × ${f(IM.R, 1)}) × ${f(Q12.dt, 2)} = ${f(Q12.F * IM.R * Q12.dt, 0)} kg·m²/s`)}${eq(`ω = ΔL / I = ${f(Q12.F * IM.R * Q12.dt, 0)} / ${f(IM.I, 0)} = ${p3(Q12.w)} rad/s`)}<p>${p3(Q12.F * Q12.dt / IM.I)} rad/s는 τΔt 대신 FΔt(선충격량)를 쓴 값이고, ${p3(Q12.F * IM.R / IM.I)}는 τ/I, 곧 ω가 아니라 각가속도다.</p>` },
    { q: `바퀴에 작용하는 돌림힘이 ${f(Q12.T / 2, 1)} s 동안 0에서 ${Q12.peak} N·m까지 일정하게 증가한 뒤, ${f(Q12.T, 1)} s에 다시 0까지 일정하게 감소한다. 바퀴의 각운동량 변화는 얼마인가?`,
      choices: [`${p3(Q12.peak)} kg·m²/s`, `${p3(Q12.peak * Q12.T)} kg·m²/s`, `${p3(Q12.peak / Q12.T)} kg·m²/s`, `${p3(Q12.J)} kg·m²/s`], answer: 3,
      why: `<p>ΔL은 τ–t 그래프 아래 넓이이며, 여기서는 삼각형이다:</p>${eq(`ΔL = ½ × ${f(Q12.T, 1)} s × ${Q12.peak} N·m = ${p3(Q12.J)} kg·m²/s`)}<p>${p3(Q12.peak * Q12.T)}는 직사각형으로 계산한 값이고, ${p3(Q12.peak / Q12.T)}는 넓이가 아니라 기울기다.</p>` },
  ],
  13: [
    { q: `스케이터(I<sub>body</sub> = ${f(SK.Ib, 1)} kg·m²)가 ${f(SK.m, 1)} kg 추를 ${f(SK.rOut, 2)} m에 두고 ${f(SK.w0, 1)} rad/s로 돌다가, 추를 ${f(SK.rIn, 2)} m까지 당겨 들인다. 새로운 ω는 얼마인가?`,
      choices: [`${p3(SK.w0 * SK.rOut / SK.rIn)} rad/s`, `${p3(Q13.wNoBody)} rad/s`, `${p3(Q13.w)} rad/s`, `${p3(SK.w0)} rad/s`], answer: 2,
      why: `${eq(`I<sub>0</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rOut, 2)}² = ${f(Q13.I0)} kg·m², I<sub>f</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rIn, 2)}² = ${f(Q13.I1, 3)} kg·m²`)}${eq(`ω<sub>f</sub> = I<sub>0</sub>ω<sub>0</sub> / I<sub>f</sub> = ${p3(Q13.w)} rad/s`)}<p>${p3(Q13.wNoBody)} rad/s는 변하지 않는 몸의 관성 모멘트 ${f(SK.Ib, 1)} kg·m²를 빠뜨린 값이다.</p>` },
    { q: '추를 당겨 들이는 동안 스케이터의 회전 운동 에너지는 어떻게 되는가?',
      choices: ['L이 보존되므로 일정하다', 'I가 줄어들므로 감소한다', '얼음이 돌림힘을 가하므로 증가한다', '팔이 추에 일을 하므로 증가한다'], answer: 3,
      why: `<p>K = L²/2I. L은 일정하고 I는 줄어드므로 K는 증가한다: 여기서는 ${f(M.skater(0.5).K)} J에서 ${f(M.skater(3.5).K)} J로. 이 에너지는 바깥으로 날아가려는 추를 근육이 안쪽으로 당기는 데서 나온다. 얼음은 돌림힘을 (거의) 주지 않으므로 L이 유지된다.</p>` },
  ],
  14: [
    { q: `${f(HT.m, 1)} kg 공이 ${f(HT.v0, 1)} m/s로 날아와, 고정핀 O에서 ${f(HT.d, 1)} m 떨어진 곳에서 막대(I = ⅓ML² = ${f(HT.I, 2)} kg·m²)에 부딪쳐 <b>달라붙는다</b>. 직후 막대의 ω는 얼마인가?`,
      choices: [`${p3(HT.m * HT.v0 * HT.d / HT.I)} rad/s`, `${p3(Q14.w)} rad/s`, `${p3(HT.m * HT.v0 * HT.d / (HT.M * HT.L ** 2 / 12 + HT.m * HT.d ** 2))} rad/s`, `${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} rad/s`], answer: 1,
      why: `<p>고정핀이 밀기 때문에 선운동량은 보존되지 않는다. 그러나 고정핀은 O에 대한 돌림힘이 없으므로 O에 대한 L은 보존된다:</p>${eq(`mv<sub>0</sub>d = (I + md²)ω → ω = ${f(HT.m * HT.v0 * HT.d, 2)} / (${f(HT.I, 2)} + ${f(HT.m * HT.d ** 2, 2)}) = ${p3(Q14.w)} rad/s`)}<p>${p3(HT.m * HT.v0 * HT.d / HT.I)}는 공이 이제 막대와 함께 돈다는 것을 잊은 값이고, ${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)}는 고정핀 때문에 성립하지 않는 선운동량 보존을 쓴 값이다.</p>` },
    { q: `${f(HT.m, 1)} kg 공을 O에서 옆으로 ${f(HT.d, 1)} m 떨어진 점에서, 같은 연직면 안에서 가만히 놓는다. 공이 떨어지는 동안 O에 대한 각운동량은 어떤 비율로 변하는가?`,
      choices: [`${p3(Q14.dLdt / 2)} kg·m²/s²`, `${p3(2 * Q14.dLdt)} kg·m²/s²`, `${p3(Q14.dLdt)} kg·m²/s²`, '0: 직선으로 움직인다'], answer: 2,
      why: `<p>O를 원점에 두고 공이 (d, y)에 있으면 p = (0, −mgt)이다. 그러면</p>${eq(`L = xp<sub>y</sub> − yp<sub>x</sub> = −d·mgt → |dL/dt| = mgd = ${f(HT.m, 1)} × ${f(G)} × ${f(HT.d, 1)} = ${p3(Q14.dLdt)} kg·m²/s²`)}<p>이는 O에 대한 중력의 돌림힘 d·mg이다. 직선 운동에서 L이 일정한 것은 힘이 작용하지 않을 때뿐이다: 여기서는 속력이 커진다.</p>` },
  ],
};
