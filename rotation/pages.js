// Chapter 7, page by page (after the AP Physics 1 organizer, Unit 8, with the AP Physics C additions). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_LIGHT, F_HEAVY, F_SHAPES, RACE_V, F_PAX, F_WRENCH, F_SLIP, P_SCALE, LP_SCALE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => (r * 180 / Math.PI).toFixed(1);
const cm = s => `${(s * 100).toFixed(s * 100 < 1 ? 1 : 0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
const sx = (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false }) {
  const X = x => sx(x, x0, x1), Y = y => sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${X(s.tag[0]) + 4}" y="${Y(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${X(x)}" cy="${Y(y)}" r="3.5"/><text class="ax" x="${X(x) + dx}" y="${Y(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${Y(0)}" y2="${Y(0)}"/>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${Y(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${Y(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
export const CH = { sx, sy };
const curvePts = (fn, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// race: where the energy goes, a stacked bar per racer
function energyBars() {
  const bw = W - 150 - P.r, rowH = 30, top = 22, mgh = M.RACE.m * M.G * M.RACE.h;
  const rows = M.RACE.list.map((o, i) => {
    const kt = 1 / (1 + o.f), y = top + i * rowH;
    return `<text class="ax" x="${140}" y="${y + 14}" text-anchor="end">${o.name}</text>
      <rect class="bar" x="150" y="${y}" width="${(bw * kt).toFixed(1)}" height="18"/>
      <rect x="${(150 + bw * kt).toFixed(1)}" y="${y}" width="${(bw * (1 - kt)).toFixed(1)}" height="18" fill="#8a8a8f"/>
      <text class="ax" x="${155}" y="${y + 13}">${Math.round(kt * 100)}%</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${top + 4 * rowH + 22}" role="img" aria-label="경주자별 운동 에너지 중 병진과 회전이 차지하는 비율">
    <text class="lab" x="150" y="14">바닥에서 mgh = ${f(mgh)} J →</text>${rows}
    <rect class="bar" x="150" y="${top + 4 * rowH + 4}" width="12" height="10"/><text class="ax" x="168" y="${top + 4 * rowH + 13}">½mv² (병진)</text>
    <rect x="290" y="${top + 4 * rowH + 4}" width="12" height="10" fill="#8a8a8f"/><text class="ax" x="308" y="${top + 4 * rowH + 13}">½Iω² (회전)</text>
  </svg>`;
}

const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const R0 = M.ROD, PX = M.PAX.list, WR = M.WRENCH, B = M.BOWL, IM = M.IMP.list, HT = M.HIT;
const D = M.DOOR.cases, [ring, discS, sphere] = M.SHAPES.list, sk0 = M.skater(0.2), sk1 = M.skater(4);

export const PAGES = [
  {
    kicker: '7장', title: '회전', sub: '운동의 언어로 본 회전',
    body: `
      <p class="lede">돌아가는 바퀴 위의 모든 점은 같은 시간 동안 같은 <b>각</b> θ(라디안)만큼 돈다. 그래서 바퀴 전체를 각으로 기술한다: ω = Δθ/Δt (단위 rad/s), α = Δω/Δt (단위 rad/s²).</p>
      <p>시계 반대 방향을 양(+)으로 잡는다. 이 바퀴는 ${f(M.WHEEL.alpha, 1)} rad/s²로 빨라졌다가 같은 비율로 제동된다. 빨라질 때 ω와 α는 <b>부호가 같고</b>, 느려질 때는 <b>부호가 반대</b>다. 운동학 방정식은 x → θ, v → ω, a → α로 바꾸면 그대로 성립한다:</p>
      <table class="data eqs">
        <tr><td>ω = ω<sub>0</sub> + αt</td><td>Δθ 없음</td></tr>
        <tr><td>Δθ = ω<sub>0</sub>t + ½αt²</td><td>ω 없음</td></tr>
        <tr><td>ω² = ω<sub>0</sub>² + 2αΔθ</td><td>t 없음</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 4.8, y0: 0, y1: 4, xlabel: '시간 (s)', ylabel: 'ω (rad/s)', cursors: ['wheelW'], label: '시간에 따른 각속도: 증가했다가 감소',
        series: [{ pts: curvePts(t => M.wheel(t).w, 0, M.WHEEL.run, 48), tag: [0.5, 1.6, 'α > 0'] }, { cls: 'trend', pts: [], tag: [3.5, 2.4, 'α < 0'] }] })}</div>
      <p class="hintline">바퀴를 클릭하면 돌아간 각을 볼 수 있다.</p>`,
    cam: { target: [STATIONS.wheel, 1.15, 0], az: -14, el: 6, dist: 7.2 }, lit: 'wheel', scene: 'wheel', look: {},
    fig: '빨라졌다가 제동되는 바퀴',
  },
  {
    kicker: '7.1', title: '두 탑승자', sub: 'v = rω',
    body: `
      <p class="lede">회전목마 위의 두 탑승자는 같은 ω를 공유한다. 가장자리에 탄 사람은 같은 시간에 더 큰 원을 돌므로 더 빠르다: 반지름이 두 배면 속력도 두 배다.</p>
      <table class="data">
        <tr><th></th><th>선운동</th><th>회전 운동</th><th>관계</th></tr>
        <tr><td>변위</td><td>Δx</td><td>Δθ</td><td>s = rΔθ</td></tr>
        <tr><td>속도</td><td>v</td><td>ω</td><td>v = rω</td></tr>
        <tr><td>가속도</td><td>a<sub>t</sub></td><td>α</td><td>a<sub>t</sub> = rα</td></tr>
      </table>
      <p>각 탑승자에게는 방향 변화에서 생기는, 중심을 향하는 구심 가속도 a<sub>c</sub> = rω²도 있다.</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 2.5, xlabel: '시간 (s)', ylabel: '속력 v (m/s)', cursors: ['disc1', 'disc2'], label: '시간에 따른 두 탑승자의 속력',
        series: [{ pts: curvePts(t => M.DISC.r2 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.3, 1.75, `r = ${M.DISC.r2} m`] }, { pts: curvePts(t => M.DISC.r1 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.75, 0.12, `r = ${M.DISC.r1} m`] }] })}</div>
      <p class="hintline">클릭하면 각 탑승자의 가속도를 분해한다. v: m/s당 ${cm(V_SCALE)}; a: m/s²당 ${cm(A_SCALE)}.</p>`,
    cam: { target: [STATIONS.disc, 0.7, 0], az: -10, el: 42, dist: 10.5 }, lit: 'disc', scene: 'disc', look: {},
    fig: '두 탑승자, 하나의 ω',
  },
  {
    kicker: '7.2', title: '돌림힘', sub: '물체를 돌게 하는 것',
    body: `
      <p class="lede">문을 미는 힘은 경첩에서 떨어진 곳에, 경첩을 곧장 향하지 않게 작용할 때만 문을 돌린다. 이 회전 효과가 <b>돌림힘</b>이며 단위는 N·m이다:</p>
      <div class="eq">τ = rF sin φ = F × 지레 팔</div>
      <p>r은 경첩에서 힘이 작용하는 점까지 이어지고, φ는 r과 F 사이의 각이다. 문에 수직인 부분 F sin φ만 문을 돌린다.</p>
      <table class="data">
        <tr><th>같은 ${f(M.DOOR.F, 0)} N의 힘</th><th>τ (N·m)</th></tr>
        ${D.map(c => `<tr><td>${c.name}</td><td>${f(c.tau)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: 0, y1: 10, xlabel: 'r과 F 사이의 각 φ (°)', ylabel: 'τ (N·m)', label: '두 거리에서 미는 각에 따른 돌림힘',
        series: [{ pts: curvePts(p => M.torque(0.85, M.DOOR.F, p), 0, 180), tag: [122, 7.6, 'r = 0.85 m'] }, { pts: curvePts(p => M.torque(0.425, M.DOOR.F, p), 0, 180), tag: [118, 1.4, 'r = 0.425 m'] }],
        marks: [[90, D[0].tau, '', 0, 0], [90, D[1].tau, '', 0, 0], [30, D[2].tau, '30°', -26, -6]] })}</div>
      <p class="hintline">문을 클릭하면 각각의 지레 팔이 그려진다. 화살표: 뉴턴당 ${cm(F_LIGHT)}.</p>`,
    cam: { target: [STATIONS.doors + 0.05, 0.6, -0.4], az: -14, el: 48, dist: 14.5 }, lit: 'doors', scene: 'doors', look: {},
    fig: '같은 힘, 세 가지 돌림힘',
  },
  {
    kicker: '7.3', title: '평형', sub: '밀리지도, 돌지도 않는다',
    body: `
      <p class="lede">널빤지 다리 위로 ${M.PLANK.m} kg 상자를 천천히 밀어 옮긴다. 제자리에 머물려면 Σ<i>F</i> = 0 <i>이고</i> Στ = 0이어야 한다.</p>
      <p>미지수가 가장 많은 점, 곧 <i>F</i><sub>A</sub>의 지레 팔이 0인 받침점 A에 대해 돌림힘을 구한다. 시계 반대 방향 +, 시계 방향 −:</p>
      <div class="eq">L·F<sub>B</sub> − (L/2)·Mg − x·mg = 0</div>
      <p>그러면 Σ<i>F</i> = 0에서 <i>F</i><sub>A</sub> = (M + m)g − <i>F</i><sub>B</sub>이다. 상자가 어느 받침점에 가까울수록 그 받침점이 더 많이 떠받친다.</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 400, xlabel: 'A로부터 상자 위치 x (m)', ylabel: '받침 힘 (N)', cursors: ['plankA', 'plankB'], label: '상자 위치에 따른 받침 힘',
        series: [{ pts: curvePts(x => M.plank(x).FA, 0, 4, 4), tag: [3.55, M.plank(3.55).FA + 4, 'F<tspan baseline-shift="sub" font-size="8">A</tspan>'] }, { pts: curvePts(x => M.plank(x).FB, 0, 4, 4), tag: [3.55, M.plank(3.55).FB - 60, 'F<tspan baseline-shift="sub" font-size="8">B</tspan>'] }] })}</div>
      <p class="hintline">널빤지를 클릭하면 A에 대한 돌림힘을 볼 수 있다. 화살표: 뉴턴당 ${cm(F_HEAVY)}.</p>`,
    cam: { target: [STATIONS.plank, 1.3, 0], az: -14, el: 10, dist: 13 }, lit: 'plank', scene: 'plank', look: {},
    fig: `${M.PLANK.M} kg 널빤지와 ${M.PLANK.m} kg 상자`,
  },
  {
    kicker: '7.4', title: '사다리', sub: '얼마나 낮게 기댈 수 있을까?',
    body: `
      <p class="lede">거친 바닥 위에서 매끄러운 벽에 기대 놓은 ${M.LADDER.m} kg 사다리. 매끄러운 벽은 수직으로 바깥쪽으로만 밀 수 있다.</p>
      <p>힘: <i>F</i><sub>N</sub> = mg, <i>f</i><sub>s</sub> = <i>F</i><sub>w</sub>. 두 힘이 빠지는 사다리 발 O에 대한 돌림힘:</p>
      <div class="eq">(L sin θ)·F<sub>w</sub> = (½L cos θ)·mg</div>
      <p>사다리가 낮을수록 발에 필요한 마찰력이 커진다. 마찰력은 최대 μ<sub>s</sub>mg까지만 낼 수 있으므로, tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>)보다 낮아지면 미끄러진다: μ<sub>s</sub> = ${f(M.LADDER.muS)}이면 ${dg(M.LADDER.thMin)}°이며, 질량이나 길이와는 무관하다.</p>
      <div class="charts">${chart({ x0: 40, x1: 85, y0: 0, y1: 120, xlabel: '사다리 각 θ (°)', ylabel: '필요한 마찰력 (N)', cursors: ['ladder'], label: '사다리 각에 따른 필요한 마찰력',
        series: [{ pts: curvePts(d => Math.min(M.ladder(d * Math.PI / 180).f, 120), 41.2, 85) }, { cls: 'trend', pts: [[40, M.LADDER.muS * M.LADDER.W], [85, M.LADDER.muS * M.LADDER.W]], tag: [64, M.LADDER.muS * M.LADDER.W + 4, '마찰력의 최댓값'] }],
        marks: [[dg(M.LADDER.thMin), M.LADDER.muS * M.LADDER.W, `θ<tspan baseline-shift="sub" font-size="8">min</tspan> = ${dg(M.LADDER.thMin)}°`, -62, 22]] })}</div>
      <p class="hintline">사다리를 클릭하면 O에 대한 지레 팔을 볼 수 있다. 화살표: 뉴턴당 ${cm(F_HEAVY)}.</p>`,
    cam: { target: [STATIONS.ladder + 0.15, 1.45, 0], az: -18, el: 8, dist: 11.5 }, lit: 'ladder', scene: 'ladder', look: {},
    fig: '거친 바닥 위의 사다리',
  },
  {
    kicker: '7.5', title: '관성 모멘트', sub: 'Στ = Iα',
    body: `
      <p class="lede">회전에 대한 뉴턴 제2법칙은 Στ = Iα이다. <b>관성 모멘트</b> I = Σmr²가 질량의 역할을 하며, 축에서 멀리 있는 질량일수록 크게 기여한다.</p>
      <p>각 도형은 질량 ${f(M.SHAPES.M, 1)} kg, 반지름 ${f(M.SHAPES.R, 1)} m이고, 가장자리에 감긴 줄을 똑같이 ${f(M.SHAPES.F, 1)} N으로 당긴다: τ = ${f(M.SHAPES.tau)} N·m.</p>
      <table class="data">
        <tr><th></th><th>I = fMR²</th><th>α = τ/I</th></tr>
        ${M.SHAPES.list.map(s => `<tr><td>${s.key}</td><td>${s.frac === '1' ? '' : s.frac}MR²</td><td>${f(s.alpha)} rad/s²</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 8, xlabel: '시간 (s)', ylabel: 'ω (rad/s)', cursors: ['sh0', 'sh1', 'sh2'], label: '고리, 원판, 구의 각속도',
        series: M.SHAPES.list.map(s => ({ pts: [[0, 0], [2.4, s.alpha * 2.4]], tag: [1.75, s.alpha * 1.75 + (s.key === 'sphere' ? 0.5 : s.key === 'disc' ? -0.3 : 0), s.key] })) })}</div>
      <p class="hintline">도형을 클릭하면 원판을 고리들로 나눈다. 화살표: 뉴턴당 ${cm(F_SHAPES)}.</p>`,
    cam: { target: [STATIONS.inertia, 1.15, 0], az: -10, el: 22, dist: 10.2 }, lit: 'inertia', scene: 'inertia', look: {},
    fig: '같은 돌림힘, 세 가지 도형',
  },
  {
    kicker: '7.6 · AP 물리 C', title: 'I 더하기', sub: 'I = ∫ r² dm',
    body: `
      <p class="lede">물체를 작은 조각 dm으로 나누고 모든 조각의 r² dm을 더한다: I = ∫ r² dm. 그 값은 축이 어디에 있는지에 따라 달라진다.</p>
      <p>균일한 막대(${f(R0.M, 1)} kg, ${f(R0.L, 1)} m)는 λ = M/L이므로 조각 dx의 질량은 dm = λ dx이다. 원판은 얇은 고리들로 이루어지며, 각 고리는 dm = σ·2πr dr (σ = M/πR²)이다:</p>
      <table class="data">
        <tr><td>막대, 중심을 지나는 축</td><td>∫<sub>−L/2</sub><sup>L/2</sup> λx² dx</td><td><sup>1</sup>⁄<sub>12</sub>ML²</td></tr>
        <tr><td>막대, 끝을 지나는 축</td><td>∫<sub>0</sub><sup>L</sup> λx² dx</td><td>⅓ML²</td></tr>
        <tr><td>원판, 중심을 지나는 축</td><td>∫<sub>0</sub><sup>R</sup> r²·σ2πr dr</td><td>½MR²</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 1.8, xlabel: '축으로부터의 거리 r (m)', ylabel: 'dI/dr = λr² (kg·m)', cursors: ['integE', 'integC'], label: '축으로부터의 거리에 따른 막대 1 m당 I 기여분',
        series: [{ cls: 'bar', pts: [[0, 0], ...curvePts(r => R0.lam * r * r, 0, 1.2, 40), [1.2, 0]] }, { pts: curvePts(r => R0.lam * r * r, 0, 1.2, 40), tag: [0.25, 1.0, `끝: 0→L 넓이 = ${f(R0.Iend, 2)}`] }, { cls: 'trend', pts: [[0.6, 0], [0.6, 1.8]], tag: [0.62, 0.15, `중심: 2 × (0→L/2) = ${f(R0.Icm, 2)}`] }] })}</div>
      <p class="hintline">클릭하면 조각과 고리가 떨어져 나오고, 그 합을 적분과 비교할 수 있다.</p>`,
    cam: { target: [STATIONS.integ - 0.3, 1.0, 0], az: -10, el: 22, dist: 14.5 }, lit: 'integ', scene: 'integ', look: {},
    fig: '조각과 고리',
  },
  {
    kicker: '7.7 · AP 물리 C', title: '평행축 정리', sub: 'I = I<sub>cm</sub> + Md²',
    body: `
      <p class="lede">축을 질량 중심에서 거리 d만큼 옮기면 I는 Md²만큼 커진다:</p>
      <div class="eq">I = I<sub>cm</sub> + Md²</div>
      <p>끝을 고정하면 d = L/2: <sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML² (경첩에 달린 문은 ⅓MW²). 그래서 같은 τ = ${f(M.PAX.tau)} N·m를 받아도 회전이 네 배 느리게 빨라진다.</p>
      <table class="data">
        <tr><th>고정 위치</th><th>I<sub>cm</sub></th><th>Md²</th><th>I</th><th>α = τ/I</th></tr>
        ${PX.map(p => `<tr><td>${p.key}</td><td>${f(R0.Icm)}</td><td>${f(R0.M * p.d * p.d)}</td><td>${f(p.I)}</td><td>${f(p.alpha)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 4.5, xlabel: '시간 (s)', ylabel: 'ω (rad/s)', cursors: ['pax0', 'pax1'], label: '시간에 따른 두 막대의 각속도',
        series: PX.map((p, i) => ({ pts: [[0, 0], [2.4, p.alpha * 2.4]], tag: i ? [1.25, p.alpha * 1.25 + 0.15, '끝을 고정'] : [0.75, 2.2, '중심을 고정'] })) })}</div>
      <p class="hintline">막대를 클릭하면 거리 d를 볼 수 있다. 화살표: 뉴턴당 ${cm(F_PAX)}.</p>`,
    cam: { target: [STATIONS.parallel - 0.45, 0.8, 0.15], az: -10, el: 55, dist: 11 }, lit: 'parallel', scene: 'parallel', look: {},
    fig: '같은 힘, 두 개의 축',
  },
  {
    kicker: '7.8', title: '일과 일률', sub: 'W = τΔθ, P = τω',
    body: `
      <p class="lede">길이 ${f(WR.r, 2)} m인 렌치를 ${f(WR.F, 0)} N으로 밀어 너트를 돌린다. 손은 호 s = rΔθ를 따라 움직이므로, 손이 한 일은</p>
      <div class="eq">W = F·s = F·rΔθ = τΔθ</div>
      <p>로, W = Fd의 회전 버전이다. 일을 하는 빠르기가 일률이며, P = Fv에 대응한다:</p>
      <div class="eq">P = τω</div>
      <p>여기서 τ = ${f(WR.tau, 0)} N·m, 일정한 각속도 ${f(WR.w, 1)} rad/s이므로 P = ${f(WR.P, 0)} W이고, 120°를 한 번 돌리는 데 ${f(M.wrench(9).W, 1)} J이 든다. 나사산의 마찰력이 ω를 일정하게 유지하므로 이 일은 회전이 아니라 열이 된다. 마찰이 없다면 ½Iω²로 들어갈 것이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 2.2, y0: 0, y1: 45, xlabel: '회전한 각 Δθ (rad)', ylabel: '일 W (J)', cursors: ['wrench'], label: '회전한 각에 따른 일: 기울기가 τ인 직선',
        series: [{ pts: [[0, 0], [WR.stroke, WR.tau * WR.stroke]], tag: [0.95, WR.tau * 0.95 + 2, `기울기 = τ = ${f(WR.tau, 0)} N·m`] }],
        marks: [[WR.stroke, WR.tau * WR.stroke, '120°', -36, 4]] })}</div>
      <p class="hintline">렌치를 클릭하면 반지름과 호를 볼 수 있다. 화살표: 뉴턴당 ${cm(F_WRENCH)}.</p>`,
    cam: { target: [STATIONS.wrench + 0.08, 0.15, 0.12], az: -14, el: 48, dist: 3.6 }, lit: 'wrench', scene: 'wrench', look: {},
    fig: '너트에 물린 렌치',
  },
  {
    kicker: '7.9', title: '굴림', sub: '경사면 경주',
    body: `
      <p class="lede">구, 원판, 고리가 ${dg(M.RACE.theta)}° 경사면을 정지 상태에서 굴러 내려가고, 그 옆에서 상자가 얼음 위를 미끄러져 내려간다. 구르는 물체는 에너지의 일부를 회전에 써야 한다:</p>
      <div class="eq">mgh = ½mv² + ½Iω²</div>
      <p>I = fmR², ω = v/R이면 v² = 2gh/(1 + f)이다. 질량과 반지름은 소거되고, 모양 인자 f가 작을수록 빠르다. 상자가 1등이고, 다음은 구, 원판, 고리 순이다. 언덕을 <i>올라</i> 굴러갈 때는 회전 에너지 덕분에 더 높이 올라간다.</p>
      <div class="charts">${energyBars()}</div>
      <p class="hintline">경주자를 클릭하면 구르는 원판이 어떻게 움직이는지 볼 수 있다. 화살표: m/s당 ${cm(RACE_V)}.</p>`,
    cam: { target: [STATIONS.race + 0.15, 0.6, 0], az: -14, el: 36, dist: 12.5 }, lit: 'race', scene: 'race', look: {},
    fig: '상자, 구, 원판, 고리',
  },
  {
    kicker: '7.10 · AP 물리 C', title: '미끄러지다가 구르기', sub: '볼링공',
    body: `
      <p class="lede">볼링공이 회전 없이 ${f(B.v0, 1)} m/s로 손을 떠난다. 공의 바닥이 미끄러지므로 운동 마찰력 μ<sub>k</sub>mg가 뒤쪽으로 작용한다: 마찰력은 공을 느리게 하고, 거리 R에서 작용하므로 회전을 빠르게 한다.</p>
      <table class="data cols">
        <tr><th>병진: ΣF = ma</th><th>회전: Στ = Iα, I = ⅖mR²</th></tr>
        <tr><td>v = v<sub>0</sub> − μ<sub>k</sub>g t</td><td>ω = (5μ<sub>k</sub>g / 2R) t</td></tr>
      </table>
      <p>v = Rω가 되면 구르기 시작한다:</p>
      <div class="eq">t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g,&nbsp; v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub></div>
      <p>μ<sub>k</sub> = ${f(B.muK, 1)}이면 t* = ${f(B.tStar)} s, 이동 거리 ${f(B.xStar)} m이고, 그 뒤 ${f(B.vf)} m/s로 구른다. ${f(0.5 * B.m * B.v0 ** 2 - M.bowl(9).K, 1)} J은 열로 바뀌었다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 2.6, xlabel: '시간 (s)', ylabel: '속력 (m/s)', cursors: ['slipV', 'slipW'], label: '시간에 따른 공의 속력 v와 가장자리 속력 Rω, t*에서 만난다',
        series: [{ pts: curvePts(t => M.bowl(t).v, 0, 1.1, 50), tag: [0.22, 2.0, 'v'] }, { pts: curvePts(t => B.R * M.bowl(t).w, 0, 1.1, 50), tag: [0.24, 0.15, 'Rω'] }],
        marks: [[B.tStar, B.vf, 't*', 4, 18]] })}</div>
      <p class="hintline">공을 클릭하면 바닥이 얼마나 빨리 미끄러지는지 볼 수 있다. v: m/s당 ${cm(RACE_V)}; f: 뉴턴당 ${cm(F_SLIP)}.</p>`,
    cam: { target: [STATIONS.slip, 0.15, 0], az: -8, el: 18, dist: 7.2 }, lit: 'slip', scene: 'slip', look: {},
    fig: '미끄러지며 출발',
  },
  {
    kicker: '7.11', title: '우물', sub: '힘과 돌림힘을 함께',
    body: `
      <p class="lede">${f(M.WELL.m, 1)} kg 양동이가 ${f(M.WELL.M, 1)} kg 드럼(속이 찬 원통)에 감긴 밧줄에 매달려 있다. 놓으면 양동이는 떨어지고 드럼은 점점 빨리 돈다.</p>
      <table class="data cols">
        <tr><th>양동이: ΣF = ma</th><th>드럼: Στ = Iα, a = rα</th></tr>
        <tr><td>mg − T = ma</td><td>rT = ½Mr²·(a/r), 따라서 T = ½Ma</td></tr>
      </table>
      <div class="eq">a = mg / (m + ½M) = ${f(M.WELL.a)} m/s²</div>
      <p>T = ${f(M.WELL.T)} N으로 무게보다 작다. 드럼이 무거울수록 더 느리게 떨어진다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 8, xlabel: '시간 (s)', ylabel: '양동이 속력 (m/s)', cursors: ['well'], label: '시간에 따른 양동이 속력, 자유 낙하와 비교',
        series: [{ pts: [[0, 0], [M.WELL.run, M.WELL.a * M.WELL.run]], tag: [0.78, M.WELL.a * 0.78 - 1.6, '드럼에 감긴 경우'] }, { cls: 'trend', pts: [[0, 0], [0.64, M.G * 0.64]], tag: [0.5, M.G * 0.5 + 0.6, '자유 낙하'] }] })}</div>
      <p class="hintline">우물을 클릭하면 자유 낙하와 비교할 수 있다. 화살표: 뉴턴당 ${cm(F_LIGHT)}.</p>`,
    cam: { target: [STATIONS.well + 0.25, 2.05, 0], az: 22, el: 8, dist: 14 }, lit: 'well', scene: 'well', look: {},
    fig: '양동이와 감기는 드럼',
  },
  {
    kicker: '7.12', title: '각충격량', sub: 'τΔt = ΔL',
    body: `
      <p class="lede">회전하는 물체는 <b>각운동량</b> L = Iω를 가진다. 힘이 p를 바꾸듯 돌림힘은 L을 바꾼다:</p>
      <div class="eq">Στ = ΔL/Δt, 따라서 τΔt = ΔL</div>
      <p>τΔt가 <b>각충격량</b>이며, τ–t 그래프 아래 넓이다. 똑같은 두 회전목마(I = ½MR² = ${f(M.IMP.I, 0)} kg·m²)의 가장자리를 두 가지 방식으로 민다: A는 세고 짧게, B는 약하고 길게. 넓이가 같으므로 둘은 같은 L, 같은 ω = ${f(IM[0].wf)} rad/s로 끝난다.</p>
      <div class="charts">${chart({ x0: 0, x1: 3, y0: 0, y1: 300, xlabel: '시간 (s)', ylabel: '돌림힘 τ (N·m)', cursors: ['impT0', 'impT1'], label: '두 번 민 힘의 시간에 따른 돌림힘: 넓이가 같다',
        series: [{ cls: 'bar', pts: [[0, 0], [0, IM[1].tau], [IM[1].dt, IM[1].tau], [IM[1].dt, 0]], tag: [1.55, IM[1].tau - 30, `B: ${IM[1].tau} × ${IM[1].dt} = ${IM[1].J}`] }, { pts: [[0, 0], [0, IM[0].tau], [IM[0].dt, IM[0].tau], [IM[0].dt, 0], [3, 0]], tag: [0.65, IM[0].tau - 50, `A: ${IM[0].tau} × ${IM[0].dt} = ${IM[0].J}`] }] })}</div>
      <p class="hintline">회전목마를 클릭하면 지레 팔을 볼 수 있다. 화살표: 뉴턴당 ${cm(F_HEAVY)}.</p>`,
    cam: { target: [STATIONS.impulse, 0.5, 0.2], az: -10, el: 36, dist: 16.5 }, lit: 'impulse', scene: 'impulse', look: {},
    fig: '세고 짧게, 약하고 길게',
  },
  {
    kicker: '7.13', title: '스핀', sub: '각운동량, L = Iω',
    body: `
      <p class="lede">외부 돌림힘이 없으면 <b>각운동량</b> L = Iω는 변할 수 없다: I<sub>0</sub>ω<sub>0</sub> = I<sub>f</sub>ω<sub>f</sub>.</p>
      <p>스케이터가 ${f(M.SKATE.m, 1)} kg 추를 양팔에 들고 벌린 채 돌다가, 추를 머리 위로 들어 올린다. 얼음은 돌림힘을 거의 주지 않는다. 질량을 안쪽으로 모으면 I가 줄어 ω가 커진다. L은 그대로지만 K<sub>r</sub>는 증가한다: 팔이 일을 하기 때문이다.</p>
      <table class="data">
        <tr><th></th><th>팔을 벌림</th><th>팔을 올림</th></tr>
        <tr><td>I (kg·m²)</td><td>${f(sk0.I)}</td><td>${f(sk1.I)}</td></tr>
        <tr><td>ω (rad/s)</td><td>${f(sk0.w)}</td><td>${f(sk1.w)}</td></tr>
        <tr><td>L = Iω</td><td>${f(sk0.L)}</td><td>${f(sk1.L)}</td></tr>
        <tr><td>K<sub>r</sub> = ½Iω² (J)</td><td>${f(sk0.K)}</td><td>${f(sk1.K)}</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: +M.SKATE.run.toFixed(1), y0: 0, y1: 5, xlabel: '시간 (s)', ylabel: 'ω (rad/s)', cursors: ['skater'], label: '시간에 따른 스케이터의 각속도',
        series: [{ pts: curvePts(t => M.skater(t).w, 0, M.SKATE.run, 120) }] })}</div>
      <p class="hintline">스케이터를 클릭하면 추가 처음 있던 위치를 볼 수 있다.</p>`,
    cam: { target: [STATIONS.skater, 1.3, 0], az: -16, el: 16, dist: 9.6 }, lit: 'skater', scene: 'skater', look: {},
    fig: '팔을 모으면 더 빨리 돈다',
  },
  {
    kicker: '7.14 · AP 물리 C', title: '입자의 L', sub: 'L = r × p',
    body: `
      <p class="lede">직선으로 미끄러지는 공도 점 O에 대해 각운동량을 가진다:</p>
      <div class="eq">L = r × p, |L| = mvr sin φ = mvr<sub>⊥</sub></div>
      <p>r<sub>⊥</sub> = d는 O에서 운동 경로(직선)까지의 거리다. 공이 미끄러지는 동안 r과 φ는 변하지만 r sin φ는 d로 일정하다: 직선을 따라 움직이면 <b>L은 일정하다</b>. 그러다 공은 O에 고정된 ${f(HT.M, 1)} kg 막대에 부딪친다. 고정핀은 O에 대해 돌림힘이 없으므로 O에 대한 L은 보존된다:</p>
      <div class="eq">mv<sub>0</sub>d = −mv<sub>f</sub>d + ⅓ML²ω</div>
      <p>탄성 충돌: ${f(HT.m, 1)} kg 공은 ${f(-HT.v1)} m/s로 튕겨 나오고, 막대는 ${f(HT.w)} rad/s로 돈다.</p>
      <div class="charts">${chart({ x0: 0, x1: 2.1, y0: -0.4, y1: 1.4, zero: true, xlabel: '시간 (s)', ylabel: 'O에 대한 L (kg·m²/s)', cursors: ['hitB', 'hitR', 'hitL'], label: '시간에 따른 공, 막대, 전체의 각운동량',
        series: [{ pts: [[0, M.hit(0).Lb], [HT.tHit, M.hit(0).Lb], [HT.tHit, M.hit(9).Lb], [2.1, M.hit(9).Lb]], tag: [1.5, M.hit(9).Lb + 0.01, '공'] }, { cls: 'trend', pts: [[0, 0], [HT.tHit, 0], [HT.tHit, HT.I * HT.w], [2.1, HT.I * HT.w]], tag: [1.3, HT.I * HT.w + 0.02, '막대'] }, { cls: 'curve total', pts: [[0, M.hit(0).L], [2.1, M.hit(0).L]], tag: [0.15, M.hit(0).L - 0.22, '전체'] }] })}</div>
      <p class="hintline">클릭하면 L을 벡터로 그린다. p: kg·m/s당 ${cm(P_SCALE)}.</p>`,
    cam: { target: [STATIONS.particle - 0.4, 0.15, 0.15], az: -14, el: 52, dist: 8.5 }, lit: 'particle', scene: 'particle', look: {},
    fig: '공, 고정핀, 막대',
  },
];

// ---------- click a scene: what it breaks into ----------
const turns = th => (th / (2 * Math.PI));
export const PLATES = {
  wheel: { text: `점선은 표시된 바큇살이 처음 있던 자리이고, 회색 호는 그 뒤로 돌아간 각 θ로, 라디안으로 읽는다. 밸브는 테를 따라 호 s = rθ만큼 이동했다. 바퀴 위의 모든 점은 같은 θ만큼 돌지만, 바깥쪽 점일수록 더 멀리 이동한다. 한 바퀴는 2π rad의 각변위다. 밸브가 출발점으로 돌아와 선변위가 0이 되어도 마찬가지다.`,
    facts: s => { const q = M.wheel(s.wheel.t); return [['θ', `${f(q.th)} rad = ${f(turns(q.th))} 바퀴`], ['호의 길이 s = rθ', `${f(M.WHEEL.R * q.th)} m`], ['ω', `${f(q.w)} rad/s`], ['α', `${f(q.a)} rad/s²`], ['테의 속력 v = rω', `${f(M.WHEEL.R * q.w)} m/s`]]; } },
  disc: { text: `각 탑승자의 가속도는 둘로 나뉜다. a<sub>t</sub>(경로 방향)는 속력을 바꾸며, 놀이기구가 빨라지는 동안에는 앞쪽, 느려질 때는 뒤쪽을 향한다. a<sub>c</sub>(중심 방향)는 탑승자가 원을 따라 돌게 하며 ω²에 비례해 커진다. 빨간 화살표는 그 합 a = r√(ω⁴ + α²)이다. 반지름이 두 배면 둘 다 두 배가 된다.`,
    facts: s => { const q = M.disc(s.disc.t), p1 = M.pointAt(M.DISC.r1, q), p2 = M.pointAt(M.DISC.r2, q); return [['ω, α (공통)', `${f(q.w)} rad/s, ${f(q.a)} rad/s²`], [`r = ${M.DISC.r1} m: v, a<sub>t</sub>, a<sub>c</sub>`, `${f(p1.v)}, ${f(p1.at)}, ${f(p1.ac)}`], [`r = ${M.DISC.r2} m: v, a<sub>t</sub>, a<sub>c</sub>`, `${f(p2.v)}, ${f(p2.at)}, ${f(p2.ac)}`]]; } },
  doors: { text: `각 힘을 <b>작용선</b>(점선)을 따라 연장한다. <b>지레 팔</b> r<sub>⊥</sub>은 경첩에서 그 선까지의 최단 거리로, 작용선과 직각으로 만난다. τ = F·r<sub>⊥</sub>. 오른쪽 문에서는 미는 힘이 문을 돌리는 F<sub>⊥</sub>와, 문을 따라 경첩 쪽으로 밀 뿐 회전에는 아무 기여도 하지 않는 F<sub>∥</sub>로 나뉜다. r을 절반으로 줄이거나 미는 방향을 30°로 기울이면(sin 30° = ½) 돌림힘은 절반이 된다.`,
    facts: () => D.map(c => [c.name, `r⊥ = ${f(c.arm, 3)} m → τ = ${f(c.tau)} N·m`]) },
  plank: { text: `A에 대한 돌림힘. 각 힘은 (A로부터의 거리) × (힘)만큼 널빤지를 돌린다. 널빤지의 무게는 가운데인 L/2에, 상자의 무게는 x에, F<sub>B</sub>는 L에 작용한다. F<sub>A</sub>는 회전축에 작용하므로 돌림힘이 없다. 무게들은 널빤지를 시계 방향(−)으로, F<sub>B</sub>는 시계 반대 방향(+)으로 돌리며, 둘은 상쇄된다.`,
    facts: s => { const x = M.crateX(s.clock * M.SLOW), q = M.plank(x); return [['F<sub>B</sub>의 τ (+)', `${f(M.PLANK.L)} × ${f(q.FB, 1)} = ${f(M.PLANK.L * q.FB, 0)} N·m`], ['널빤지 Mg의 τ (−)', `${f(M.PLANK.L / 2)} × ${f(M.PLANK.Wp, 1)} = ${f(M.PLANK.L / 2 * M.PLANK.Wp, 0)} N·m`], ['상자 mg의 τ (−)', `${f(x)} × ${f(M.PLANK.Wc, 1)} = ${f(x * M.PLANK.Wc, 0)} N·m`], ['A에 대한 Στ', '0 N·m'], ['F<sub>A</sub>, F<sub>B</sub>', `${f(q.FA, 1)} N, ${f(q.FB, 1)} N`]]; } },
  ladder: { text: `발 O에 대해서는 두 힘만 돌림힘을 가진다. 벽이 미는 힘은 수평이므로 옆으로 연장한다: 그 지레 팔은 꼭대기의 높이 L sin θ이다. 무게는 연직이므로 아래로 연장한다: 그 지레 팔은 가운데까지의 수평 거리 ½L cos θ이다. F<sub>N</sub>과 f<sub>s</sub>는 O 자체에 작용하므로 빠진다.`,
    facts: s => { const th = M.ladderAngle(s.clock * M.SLOW), q = M.ladder(th); return [['θ', `${dg(th)}°`], ['F<sub>w</sub> × L sin θ', `${f(q.Fw * M.LADDER.L * Math.sin(th), 1)} N·m`], ['mg × ½L cos θ', `${f(M.LADDER.W * M.LADDER.L / 2 * Math.cos(th), 1)} N·m`], ['필요한 마찰력', `${f(q.f, 1)} N`], ['낼 수 있는 최대 μ<sub>s</sub>F<sub>N</sub>', `${f(q.fMax, 1)} N`]]; } },
  inertia: { text: `원판이 폭이 같은 얇은 고리 네 개로 분리된다. 각 고리는 질량이 거의 한 반지름에 모여 있으므로 I는 약 mr²이다. 바깥 고리일수록 질량이 크고 <i>또</i> 더 멀리 있으므로 지배적이다. 모두 더하면 ½MR²로, 질량이 모두 테에 있는 고리의 절반이다. 속이 찬 구는 질량이 축 가까이에 더 많이 모여 있다: ⅖MR².`,
    facts: () => M.discAsRings(4).map((r, k) => [`고리 ${k + 1}: ${f(r.r0, 1)}–${f(r.r1, 1)} m, ${f(r.m, 3)} kg`, `I = ${f(r.I, 4)} kg·m²`]).concat([['합', `${f(M.discAsRings(4).reduce((a, r) => a + r.I, 0), 4)} = ½MR²`]]) },
  race: { text: `미끄러지지 않고 구를 때, 경사면에 닿은 점은 순간적으로 정지해 있다. 중심은 v로, 꼭대기는 2v로 움직인다: 원판 전체가 접촉점을 중심으로 돌고 있는 것이다. 그래서 ω = v/R이다. 얼음 위를 미끄러지는 상자는 회전에 쓸 에너지가 없으므로 가장 먼저 도착한다. 에너지 배분은 질량이나 크기와 무관하다: 구는 1/(1 + ⅖) = 71%를 ½mv²로 가진다.`,
    facts: s => M.RACE.list.map(o => { const q = M.race(o, s.race.t), e = M.energy(o, q.v); return [o.name, `½mv² ${f(e.Kt)} J + ½Iω² ${f(e.Kr)} J`]; }) },
  well: { text: `흐릿한 양동이는 자유 낙하하는 양동이다: 돌려야 할 것이 없으면 g로 떨어질 것이다. 밧줄은 드럼 가장자리, 곧 축에서 거리 r인 곳을 반지름에 수직으로 당기므로 그 돌림힘은 rT이다. 이 돌림힘이 드럼을 점점 빨리 돌려야 하므로 T는 mg보다 작게 유지되고, 양동이는 ${f(M.WELL.a)} m/s²로만 떨어진다. 무거운 도르래에 걸린 두 질량(애트우드 기계)도 같은 방식으로 움직인다: a = (m<sub>1</sub> − m<sub>2</sub>)g / (m<sub>1</sub> + m<sub>2</sub> + ½M).`,
    facts: s => { const q = M.well(s.well.t); return [['양동이 낙하', `${f(q.y)} m, ${f(q.v)} m/s`], ['자유 낙하라면', `${f(Math.min(0.5 * M.G * s.well.t ** 2, M.WELL.h))} m`], ['돌림힘 rT', `${f(M.WELL.R * M.WELL.T)} N·m`], ['드럼의 ω', `${f(q.w)} rad/s`]]; } },
  skater: { text: `흐릿한 구는 팔을 벌렸을 때 추가 있던 자리를 표시한다. 추를 r = ${f(M.SKATE.rOut)} m에서 안으로 옮기면 2mr²가 ${f(2 * M.SKATE.m * M.SKATE.rOut ** 2)}에서 ${f(2 * M.SKATE.m * M.SKATE.rIn ** 2, 3)} kg·m²로 줄어든다. L = Iω는 변하지 않으므로 ω는 I가 줄어든 비율만큼 커진다.`,
    facts: s => { const q = M.skater(s.skater.t); return [['r', `${f(q.r)} m`], ['I', `${f(q.I)} kg·m²`], ['ω', `${f(q.w)} rad/s`], ['L = Iω', `${f(q.L, 3)} kg·m²/s`], ['K<sub>r</sub>', `${f(q.K)} J`]]; } },
  integ: { text: `조각들이 미끄러져 벌어지고 고리들이 떠오른다. 각 조각의 질량은 dm = λΔx로 같지만 I에 대한 기여는 r²dm이므로, 먼 조각일수록 크게 기여한다: 끝을 고정한 막대에서 마지막 조각은 첫 조각보다 19배 멀리 있으므로 19² = 361배만큼 기여한다. 조각들을 더한 Σr²Δm은 조각이 얇아질수록 적분값에 가까워진다. 고리도 마찬가지지만, 각 고리의 질량도 r에 따라 커지므로(dm = σ2πr dr) I = ∫σ2πr³dr이다.`,
    facts: () => [[`조각 ${R0.N}개, 중심을 지나는 축`, `Σr²Δm = ${f(M.rodSum(R0.N, 0), 4)} kg·m²`], ['적분 ML²/12', `${f(R0.Icm, 4)} kg·m²`], [`조각 ${R0.N}개, 끝을 지나는 축`, `Σr²Δm = ${f(M.rodSum(R0.N, -R0.L / 2), 4)} kg·m²`], ['적분 ML²/3', `${f(R0.Iend, 4)} kg·m²`], ['조각 100개, 중심', `${f(M.rodSum(100, 0), 5)} kg·m²`]] },
  parallel: { text: `점선은 끝을 고정한 막대의 질량 중심을 지나며 고정핀과 평행한 두 번째 축이다. 이 축에 대해 막대의 관성 모멘트는 I<sub>cm</sub> = ML²/12로, 다른 막대와 같다. 고정핀에서 재면 모든 조각은 질량 중심으로부터의 위치에 d = L/2를 더한 곳에 있다. 제곱해서 더하면 교차항은 상쇄되고(질량 중심에 대해서는 조각들이 균형을 이룬다) I<sub>cm</sub> + Md²가 남는다. 이 정리는 질량 중심을 지나는 축에서 출발할 때만 성립한다: I는 그 축에서 가장 작다.`,
    facts: s => PX.map(p => [`${p.key} 고정: I<sub>cm</sub> + Md²`, `${f(R0.Icm)} + ${f(R0.M * p.d * p.d)} = ${f(p.I)} kg·m²`]).concat(PX.map(p => [`${p.key}: ω`, `${f(M.paxSpin(p, s.parallel.t).w)} rad/s`])) },
  wrench: { text: `회색 윤곽은 한 번 돌리기 시작한 위치다. 손의 경로는 회색 호 s = rΔθ이고, 미는 힘은 항상 그 호를 따라, 손잡이에 수직으로 작용한다. 따라서 W = Fs = F·rΔθ = τΔθ: 일은 돌림힘 곱하기 각(라디안)이다. 두 배 긴 렌치는 같은 τ를 내는 데 절반의 힘이면 되지만, 손이 두 배 멀리 움직인다: 일은 같다.`,
    facts: s => { const q = M.wrench(s.wrench.t); return [['Δθ', `${f(q.th)} rad = ${dg(q.th)}°`], ['호 s = rΔθ', `${f(q.s, 3)} m`], ['F·s', `${f(WR.F * q.s, 1)} J`], ['τΔθ', `${f(q.W, 1)} J`], ['P = τω', `${f(q.P, 0)} W`]]; } },
  slip: { text: `공의 바닥은 v − Rω(바닥의 회색 화살표)로 움직인다. 이 값이 0이 아닌 동안 공은 미끄러지고, 운동 마찰력은 그 반대 방향을 향한다. v는 줄고 Rω(위쪽 회색 화살표)는 늘어나 둘이 만나면, 바닥이 정지하고 마찰력이 사라지며 공은 구른다. 접촉선에 대해 마찰력은 돌림힘이 없으므로 mvR + Iω는 일정하다: mv<sub>0</sub>R = mvR + ⅖mR²(v/R)에서 다시 v = 5v<sub>0</sub>/7을 얻는다.`,
    facts: s => { const q = M.bowl(s.slip.t); return [['v', `${f(q.v)} m/s`], ['ω', `${f(q.w, 1)} rad/s`], ['바닥의 미끄럼 속력 v − Rω', `${f(q.vSlip)} m/s`], ['마찰력', q.slip ? `뒤쪽으로 ${f(B.f, 1)} N` : '없음: 구르는 중'], ['K', `${f(q.K, 1)} J / ${f(0.5 * B.m * B.v0 ** 2, 1)} J`]]; } },
  impulse: { text: `각 힘은 가장자리에서 반지름에 수직으로 작용하므로 지레 팔은 반지름 전체 R = ${f(M.IMP.R, 1)} m이고 τ = FR이다. 센 힘은 짧은 시간 동안 큰 τ를, 약한 힘은 더 긴 시간 동안 작은 τ를 준다. 최종 회전을 결정하는 것은 τΔt, 곧 넓이다. 민 뒤에는 돌림힘이 없으므로(베어링이 매끄럽다) L은 그대로 유지된다.`,
    facts: s => IM.map(p => { const q = M.imp(p, s.impulse.t); return [`${p.key}: τΔt = ${p.tau} × ${p.dt}`, `${p.J} kg·m²/s → 현재 L ${f(q.L, 0)}, ω ${f(q.w)} rad/s`]; }) },
  particle: { text: `O에 대한 L을 벡터로 그렸다. 위에서 보아 시계 반대 방향이면 위쪽을 향한다(오른손 법칙). 충돌 전에는 공만 L = mv<sub>0</sub>d를 가진다. 충돌 후 공의 L은 아래를 향하고(반대 방향으로 움직이므로) 막대의 L은 위를 향한다. 파란색 전체 L은 변하지 않는다: 고정핀은 O 자체에서 막대를 밀므로 O에 대한 돌림힘이 없다. 여기서 선운동량은 보존되지 <i>않는다</i>: 고정핀이 밀기 때문이다.`,
    facts: s => { const q = M.hit(s.particle.t); return [['r (O에서 공까지)', `${f(q.r)} m`], ['r sin φ = r<sub>⊥</sub>', `${f(HT.d)} m`], ['공의 L = mv r<sub>⊥</sub>', `${f(q.Lb, 3)} kg·m²/s`], ['막대의 L = Iω', `${f(q.Lr, 3)} kg·m²/s`], ['전체', `${f(q.L, 3)} kg·m²/s`]]; } },
};
