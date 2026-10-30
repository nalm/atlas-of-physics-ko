// Chapter 5, page by page (after the AP Physics 1 organizer, Unit 6). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, F_WALL, F_EGG, EGG_ZOOM, CRASH_SCALE, W_SCALE, W_PLATE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const k = (x, n = 0) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const cm = s => `${(s * 100).toFixed(0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 140, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const d = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  const paths = series.map(s => (s.fill ? `<path class="area" d="${d(s.pts)}L${sx(s.pts.at(-1)[0]).toFixed(1)},${sy(0).toFixed(1)}L${sx(s.pts[0][0]).toFixed(1)},${sy(0).toFixed(1)}Z"/>` : '') +
    `<path class="${s.cls || 'curve'}" d="${d(s.pts)}"/>` + (s.tag ? `<text class="lab${s.cls === 'total' ? ' blue' : ''}" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.tag[3] ? ' text-anchor="end"' : ''}>${s.tag[2]}</text>` : '')).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const samples = (a, b, n, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// collision pages: momentum of each cart and the total, against time
export const COLL_T = { y0: -3, y1: 7 };
const momChart = (c, key, tags) => chart({
  x0: 0, x1: c.run, ...COLL_T, xlabel: '시간 (s)', ylabel: '운동량 (kg·m/s)', cursors: [key], label: '시간에 따른 각 수레의 운동량과 전체 운동량',
  series: [
    { pts: [[0, c.m1 * c.u1], [c.tc, c.m1 * c.u1], [c.tc, c.m1 * c.v1], [c.run, c.m1 * c.v1]], tag: [tags[0][0], tags[0][1], 'p₁'] },
    { pts: [[0, c.m2 * c.u2], [c.tc, c.m2 * c.u2], [c.tc, c.m2 * c.v2], [c.run, c.m2 * c.v2]], tag: [tags[1][0], tags[1][1], 'p₂'] },
    { cls: 'total', pts: [[0, c.m1 * c.u1 + c.m2 * c.u2], [c.run, c.m1 * c.u1 + c.m2 * c.u2]], tag: [c.run - 0.03, c.m1 * c.u1 + c.m2 * c.u2, 'P, 전체', 1] },
  ] });
const collTable = c => { const K0 = M.ke(c.m1, c.u1) + M.ke(c.m2, c.u2), K1 = M.ke(c.m1, c.v1) + M.ke(c.m2, c.v2); return `
  <table class="data">
    <tr><th>kg·m/s, J</th><th><i>p</i>₁</th><th><i>p</i>₂</th><th><i>P</i> 전체</th><th><i>KE</i></th></tr>
    <tr><td>전</td><td>${f(c.m1 * c.u1, 1)}</td><td>${f(c.m2 * c.u2, 1)}</td><td>${f(c.m1 * c.u1 + c.m2 * c.u2, 1)}</td><td>${f(K0)}</td></tr>
    <tr><td>후</td><td>${f(c.m1 * c.v1, 1)}</td><td>${f(c.m2 * c.v2, 1)}</td><td>${f(c.m1 * c.v1 + c.m2 * c.v2, 1)}</td><td>${f(K1)}</td></tr>
  </table>`; };

const Wl = M.WALL, Eg = M.EGG, S = M.STICK, B = M.BOUNCE, X = M.BURST, Pd = M.PEND, C = M.CRASH, Sh = M.SHELL;
const deg = r => (r * 180 / Math.PI).toFixed(1);
// a real bullet: 10 g into 2.0 kg, swinging to the same angle
export const BULLET = ((0.01 + 2.0) / 0.01) * Math.sqrt(2 * M.G * Pd.L * (1 - Math.cos(Pd.theta)));

// tip-to-tail sketch of the crash momenta, to scale
const vecSketch = (() => {
  const s = 0.0016, ox = 190, oy = 128, ax = ox + C.px * s, ay = oy - C.py * s;
  const head = (x1, y1, x2, y2, cls) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 9; return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2 - 6 * Math.cos(a)}" y2="${y2 - 6 * Math.sin(a)}"/><path class="${cls}h" d="M${x2},${y2}L${x2 - L * Math.cos(a - 0.4)},${y2 - L * Math.sin(a - 0.4)}L${x2 - L * Math.cos(a + 0.4)},${y2 - L * Math.sin(a + 0.4)}Z"/>`; };
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="꼬리에 머리를 이어 더한 운동량 벡터">
    ${head(ox, oy, ax, oy, 'vk')}${head(ax, oy, ax, ay, 'vk')}${head(ox, oy, ax, ay, 'vb')}
    <text class="lab" x="${ox - 4}" y="${oy + 6}" text-anchor="end">p_car ${k(C.px)}</text>
    <text class="lab" x="${ax + 8}" y="${(oy + ay) / 2}">p_truck ${k(C.py)}</text>
    <text class="lab blue" x="${(ox + ax) / 2 - 8}" y="${(oy + ay) / 2 - 6}" text-anchor="end">P ${k(C.P)}</text>
    <text class="ax" x="${W - 14}" y="20" text-anchor="end">kg·m/s · 동 → 북 ↑</text>
  </svg>`;
})();

const shellChart = chart({
  x0: 0, x1: 14, y0: 0, y1: 5, xlabel: 'x (m)', ylabel: '높이 (m)', cursors: ['shell'], label: '포탄, 두 조각, 질량 중심의 경로',
  series: [
    { cls: 'trend', pts: samples(0, Sh.run, 40, t => 0).map(([t]) => M.shell(t).cm), tag: [Sh.R * 0.62, Sh.H * 0.55, '질량 중심'] },
    { pts: samples(0, Sh.ta, 20, t => 0).map(([t]) => M.shell(t).cm) },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).a), tag: [Sh.R / 2 - 0.15, 0.9, '뒤쪽 조각', 1] },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).b), tag: [10.3, 3.0, '앞쪽 조각'] },
  ],
  marks: [[Sh.R / 2, 0, 'R/2'], [Sh.R, 0, 'R'], [1.5 * Sh.R, 0, '3R/2']],
});


// continuous bodies: λ(x) with the moment x·λ(x) shaded; strip sums converging
const Rd = M.ROD, Tr = M.TRI, Se = M.SEMI, Ll = M.ELL, Ho = M.HOLE;
const rodChart = chart({
  x0: 0, x1: Rd.L, y0: 0, y1: 3, xlabel: '막대를 따라 잰 x (m)', ylabel: 'λ (kg/m)와 x·λ (kg)', cursors: ['rodL', 'rodM'], label: '막대를 따른 선밀도와 그 모멘트, 균형점 표시',
  series: [
    { fill: true, pts: samples(0, Rd.L, 40, x => x * M.lam('N', x)), tag: [0.95, 1.25, 'x·λ: 넓이 = ∫x dm', 1] },
    { pts: samples(0, Rd.L, 2, x => M.lam('N', x)), tag: [1.97, 1.02, 'λ: 넓이 = M', 1] },
    { cls: 'trend', pts: [[Rd.xN, 0], [Rd.xN, 3]] },
  ],
  marks: [[Rd.xN, 2.92, 'x_cm = 2L/3']] });
const NS = Array.from({ length: 12 }, (_, i) => i + 1);
const stripChart = chart({
  x0: 1, x1: 12, y0: 0.95, y1: 1.55, xlabel: '띠의 개수 n', ylabel: '띠 합 ÷ 정확한 값', label: 'n이 커질수록 적분값에 다가가는 질량 중심의 띠 합 추정값',
  series: [
    { pts: NS.map(n => [n, M.stripSum(M.triW, Tr.h, n) / Tr.ucm]), tag: [11.8, 1.44, '위: 삼각형', 1] },
    { pts: NS.map(n => [n, M.stripSum(M.semiW, Se.R, n) / Se.ucm]), tag: [11.8, 1.36, '아래: 반원', 1] },
    { cls: 'trend', pts: [[1, 1], [12, 1]], tag: [11.8, 1.0, '적분값', 1] },
  ],
  });
const xy = c => `(${f(c[0])}, ${f(c[1])})`;

export const PAGES = [
  {
    kicker: '5장', title: '운동량', sub: '멈추기가 얼마나 어려운가',
    body: `
      <p class="lede"><b>운동량</b>은 움직이는 물체를 멈추기가 얼마나 어려운지를 나타낸다. 질량과 속도의 곱이며, 단위가 kg·m/s인 벡터다.</p>
      <div class="eq"><i>p</i> = <i>mv</i></div>
      <p>가볍고 빠른 공과 무겁고 느린 수레가 같은 운동량을 가질 수 있다.</p>
      <table class="data">
        <tr><th></th><th>질량</th><th>속도</th><th>운동량</th><th>KE</th></tr>
        <tr><td>공</td><td>${f(M.BALL.m, 1)} kg</td><td>${f(M.BALL.v, 1)} m/s</td><td>${f(M.p(M.BALL.m, M.BALL.v), 1)} kg·m/s</td><td>${f(M.ke(M.BALL.m, M.BALL.v), 1)} J</td></tr>
        <tr><td>수레</td><td>${f(M.CART.m, 1)} kg</td><td>${f(M.CART.v, 1)} m/s</td><td>${f(M.p(M.CART.m, M.CART.v), 1)} kg·m/s</td><td>${f(M.ke(M.CART.m, M.CART.v), 1)} J</td></tr>
      </table>
      <p>하지만 운동 에너지는 같지 않다. <i>K</i> = <i>p</i>²/2<i>m</i>이므로 가벼운 쪽이 더 많이 가진다. 운동량의 변화는 Δ<i>p</i> = <i>m</i>Δ<i>v</i>이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 4, xlabel: '속도 (m/s)', ylabel: '운동량 (kg·m/s)', label: '0.5 kg과 2 kg 물체의 속도에 따른 운동량',
        series: [{ pts: [[0, 0], [2, 4]], tag: [1.75, 3.0, '2.0 kg', 1] }, { pts: [[0, 0], [5, 2.5]], tag: [4.1, 2.05, '0.5 kg'] }, { cls: 'trend', pts: [[0, 2], [5, 2]] }],
        marks: [[M.CART.v, 2, '수레'], [M.BALL.v, 2, '공']] })}</div>
      <p class="hintline">운동량 화살표: 1 kg·m/s당 ${cm(P_SCALE)}. 클릭하면 속도 화살표를 함께 보여 준다.</p>`,
    cam: { target: [STATIONS.mom + 0.3, 0.4, 0], az: -14, el: 16, dist: 16 }, lit: 'mom', scene: 'mom', look: {},
    fig: '같은 p, 다른 m과 v',
  },
  {
    kicker: '5.1', title: '충격량', sub: '시간에 걸쳐 작용하는 힘',
    body: `
      <p class="lede">물체를 한동안 밀면 운동량이 변한다. 미는 힘과 시간의 곱이 <b>충격량</b>이다.</p>
      <div class="eq"><i>J</i> = <i>F</i>Δ<i>t</i> = Δ<i>p</i></div>
      <p>${f(Wl.m, 1)} kg 공이 +${f(Wl.v, 1)} m/s로 날아와 −${f(Wl.v, 1)} m/s로 튕겨 나간다. Δ<i>p</i> = −${f(Wl.J, 1)} kg·m/s로 처음 운동량의 두 배인데, 공이 멈춘 <i>다음</i> 되돌아와야 하기 때문이다.</p>
      <p>벽이 미는 힘은 ${f(Wl.tau, 2)} s 동안 커졌다가 작아지며, 최대 ${f(Wl.Fpk, 0)} N에 이른다. <b>힘–시간 그래프 아래 넓이</b>가 충격량 ${f(Wl.J, 1)} N·s이다. 일정한 ${f(Wl.Favg, 0)} N의 힘이 ${f(Wl.tau, 2)} s 동안 작용한 것과 같다. 충격량은 힘과 같은 방향, 곧 벽에서 멀어지는 쪽을 향한다.</p>
      <div class="charts">${chart({ x0: 0.15, x1: 0.35, y0: 0, y1: 50, xlabel: '시간 (s)', ylabel: '벽이 미는 힘 (N)', cursors: ['wall'], label: '시간에 따라 공에 작용하는 힘, 색칠한 넓이가 충격량',
        series: [{ fill: true, pts: samples(0.15, 0.35, 80, t => -M.wall(t).F), tag: [0.287, 30, `넓이 = ${f(Wl.J, 1)} N·s`] }] })}</div>
      <p>AP 물리 C: 변하는 힘의 충격량은 적분 <i>J</i> = ∫<i>F</i> d<i>t</i>이다. 이 펄스에서는 다음과 같다.</p>
      <div class="eq">∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = 2<i>F</i><sub>pk</sub>τ/π = ${f(Wl.J, 1)} N·s</div>
      <p class="hintline">${M.SLOW_HIT}× 속도. 힘은 1 N당 ${cm(F_WALL)}. 클릭하면 Δp를 볼 수 있다.</p>`,
    cam: { target: [STATIONS.wall - 0.55, 0.6, 0], az: -14, el: 12, dist: 7.2 }, lit: 'wall', scene: 'wall', look: {},
    fig: '벽이 미는 힘이 공을 되돌려 보낸다',
  },
  {
    kicker: '5.2', title: '더 작은 힘', sub: '같은 Δp, 더 긴 시간',
    body: `
      <p class="lede">두 달걀이 ${f(Eg.h * 100, 0)} cm를 떨어져 ${f(Eg.v0, 1)} m/s로 닿는다. 둘 다 ${f(Eg.J, 2)} kg·m/s를 잃어야 하므로 필요한 충격량이 같다.</p>
      <p>베개는 눌려 들어가며 ${f(Eg.tauSoft, 2)} s가 걸리고, 바닥은 ${f(Eg.tauHard, 2)} s가 걸린다. <i>F</i>Δ<i>t</i>가 정해져 있으므로 시간이 6분의 1이면 힘은 6배가 된다.</p>
      <table class="data">
        <tr><th></th><th>멈추는 데 걸린 시간</th><th>평균 알짜힘</th><th>최댓값</th></tr>
        <tr><td>베개</td><td>${f(Eg.tauSoft, 2)} s</td><td>${f(Eg.J / Eg.tauSoft)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauSoft))} N</td></tr>
        <tr><td>바닥</td><td>${f(Eg.tauHard, 2)} s</td><td>${f(Eg.J / Eg.tauHard)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauHard))} N</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 0.2, y0: 0, y1: 8, xlabel: '착지 후 시간 (s)', ylabel: '알짜힘 (N)', cursors: ['eggS', 'eggH'], label: '넓이가 같은 두 힘 펄스',
        series: [{ fill: true, pts: samples(0, Eg.tauSoft, 60, t => M.pulse(t, Eg.J, Eg.tauSoft, Eg.m).F).concat([[0.2, 0]]), tag: [0.075, 1.4, '베개'] },
                 { fill: true, pts: samples(0, Eg.tauHard, 30, t => M.pulse(t, Eg.J, Eg.tauHard, Eg.m).F).concat([[0.2, 0]]), tag: [0.034, 5.2, '바닥: 같은 넓이'] }] })}</div>
      <p>에어백, 크럼플 존, 굽힌 무릎은 Δ<i>p</i>를 바꾸지 못한다. 대신 Δ<i>t</i>를 늘린다.</p>
      <p class="hintline">실물의 ${EGG_ZOOM}배 크기로, ${M.SLOW_HIT}× 속도로 그렸다. 빨강: 알짜힘, 1 N당 ${cm(F_EGG * EGG_ZOOM)}. 클릭하면 비교할 수 있다.</p>`,
    cam: { target: [STATIONS.eggs, 1.05, 0], az: -10, el: 10, dist: 10.5 }, lit: 'eggs', scene: 'eggs', look: {},
    fig: '같은 Δp를 더 긴 시간에 걸쳐',
  },
  {
    kicker: '5.3', title: '보존', sub: '달라붙는 수레',
    body: `
      <p class="lede">두 수레를 외부 알짜힘이 없는 하나의 <b>닫힌계</b>로 보자. 이 계의 전체 운동량은 변할 수 없다.</p>
      <p>두 수레는 서로 크기가 같고 방향이 반대인 충격량을 준다. 한쪽이 잃은 만큼 다른 쪽이 얻는다.</p>
      <div class="eq"><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = (<i>m</i>₁ + <i>m</i>₂)<i>v</i>′</div>
      <p>${f(S.u1, 1)} m/s로 움직이는 ${f(S.m1, 1)} kg 수레가 ${f(S.u2, 1)} m/s로 움직이는 ${f(S.m2, 1)} kg 수레와 만난다. 둘은 달라붙어 <i>v</i>′ = ${f(S.m1 * S.u1 + S.m2 * S.u2, 1)}/${f(S.m1 + S.m2, 1)} = ${f(S.v1, 1)} m/s로 움직인다. <b>완전 비탄성</b> 충돌이다. KE가 열, 소리, 찌그러짐으로 사라진다.</p>
      ${collTable(S)}
      <div class="charts">${momChart(S, 'stick', [[0.05, 6.1], [0.05, -1.5]])}</div>
      <p class="hintline">파랑: 전체 <i>P</i>. 원반: 질량 중심. 클릭하면 비교할 수 있다.</p>`,
    cam: { target: [STATIONS.stick - 0.4, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'stick', scene: 'stick', look: {},
    fig: 'Δp = 0, ΔKE < 0',
  },
  {
    kicker: '5.4', title: '탄성 충돌', sub: '튕겨 나가는 수레',
    body: `
      <p class="lede">수레가 서로 튕겨 나가고 에너지 손실이 없으면 그 충돌은 <b>탄성</b> 충돌이다. 운동량<i>과</i> 운동 에너지가 모두 보존된다.</p>
      <p>${f(B.u1, 1)} m/s로 움직이는 ${f(B.m1, 1)} kg 수레가 정지한 ${f(B.m2, 1)} kg 수레에 부딪친다. 미지수가 둘, 식도 둘이다.</p>
      <table class="data eqs">
        <tr><td><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</td><td>Δ<i>p</i> = 0</td></tr>
        <tr><td>½<i>m</i>₁<i>v</i>₁² + ½<i>m</i>₂<i>v</i>₂² = ½<i>m</i>₁<i>v</i>₁′² + ½<i>m</i>₂<i>v</i>₂′²</td><td>Δ<i>KE</i> = 0</td></tr>
      </table>
      <p>따라서 <i>v</i>₁′ = ${f(B.v1, 1)} m/s, <i>v</i>₂′ = ${f(B.v2, 1)} m/s이다. 두 수레가 크기가 같고 방향이 반대인 ${f(B.m2 * B.v2, 1)} N·s의 충격량을 주고받으므로, 질량이 작은 쪽의 Δ<i>v</i>가 더 크다.</p>
      ${collTable(B)}
      <div class="charts">${momChart(B, 'bounce', [[0.05, 4.1], [0.05, -1.0]])}</div>`,
    cam: { target: [STATIONS.bounce - 0.5, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'bounce', scene: 'bounce', look: {},
    fig: 'Δp = 0, ΔKE = 0',
  },
  {
    kicker: '5.5', title: '폭발', sub: '정지 상태에서 밀려 갈라짐',
    body: `
      <p class="lede">두 수레가 붙은 채 정지해 있다가 그 사이의 용수철이 풀린다. 전체 운동량이 0이었으므로 계속 0이다.</p>
      <div class="eq">(<i>m</i>₁ + <i>m</i>₂)<i>v</i> = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</div>
      <p><i>v</i> = 0이므로 두 운동량은 크기가 같고 방향이 반대다. 따라서 ${f(X.m1, 1)} kg 수레는 ${f(X.m2, 1)} kg 수레보다 세 배 빠르게 움직인다. 용수철의 ${f(X.Q, 1)} J이 운동 에너지가 되므로 KE가 <i>증가한다</i>.</p>
      ${collTable(X)}
      <table class="data">
        <tr><th>충돌</th><th>Δ<i>p</i></th><th>Δ<i>KE</i></th><th>단서</th></tr>
        <tr><td>비탄성</td><td>0</td><td>&lt; 0</td><td>KE 손실, 달라붙으면 손실 최대</td></tr>
        <tr><td>탄성</td><td>0</td><td>0</td><td>튕겨 나가며 손실 없음</td></tr>
        <tr><td>폭발</td><td>0</td><td>&gt; 0</td><td>붙어 있다가 갈라져 날아감</td></tr>
      </table>
      <p class="hintline">질량 중심은 제자리에 있다. 클릭하면 전과 후를 볼 수 있다.</p>`,
    cam: { target: [STATIONS.burst - 0.8, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'burst', scene: 'burst', look: {},
    fig: 'Δp = 0, ΔKE > 0',
  },
  {
    kicker: '5.6', title: '탄동 진자', sub: '운동량 다음에 에너지',
    body: `
      <p class="lede">${f(Pd.u, 0)} m/s로 날아온 ${f(Pd.m, 1)} kg 찰흙 덩어리가 ${f(Pd.L, 1)} m 줄에 매달린 ${f(Pd.M, 1)} kg 블록에 박히고, 블록이 흔들려 올라간다. 두 단계에 두 법칙이 쓰인다.</p>
      <table class="data">
        <tr><th>단계</th><th>법칙</th><th>이 경우</th></tr>
        <tr><td>충돌</td><td>Δ<i>p</i> = 0: <i>mv</i> = (<i>m</i>+<i>M</i>)<i>v</i>′</td><td><i>v</i>′ = ${f(Pd.v)} m/s</td></tr>
        <tr><td>흔들림</td><td>Δ<i>E</i> = 0: ½<i>v</i>′² = <i>g</i>Δ<i>y</i></td><td>Δ<i>y</i> = ${f(Pd.dy * 100, 1)} cm</td></tr>
      </table>
      <p>충돌하는 동안에는 에너지가 보존되지 않고(${f(M.ke(Pd.m, Pd.u), 1)} J → ${f(M.ke(Pd.m + Pd.M, Pd.v))} J), 흔들리는 동안에는 운동량이 보존되지 않는다(줄과 중력이 외력이다). Δ<i>y</i> = <i>L</i>(1 − cos θ), θ = ${deg(Pd.theta)}°를 쓰면 다음과 같다.</p>
      <div class="eq"><i>v</i> = ((<i>m</i> + <i>M</i>)/<i>m</i>) √(2<i>gL</i>(1 − cos θ))</div>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 2, xlabel: '충돌 후 시간 (s)', ylabel: '에너지 (J)', cursors: ['pendK', 'pendU'], label: '흔들리는 동안의 운동 에너지와 퍼텐셜 에너지',
        series: [{ pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).K), tag: [0.1, 1.15, 'KE'] }, { pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).U), tag: [Pd.T / 4 - 0.12, 1.15, 'Ug'] }, { cls: 'trend', pts: [[0, M.ke(Pd.m + Pd.M, Pd.v)], [2.4, M.ke(Pd.m + Pd.M, Pd.v)]], tag: [2.36, 1.72, '합계', 1] }] })}</div>
      <p class="hintline">클릭하면 Δy, L, θ와 함께 v′을 구하는 다른 방법을 보여 준다.</p>`,
    cam: { target: [STATIONS.pend + 0.2, 1.25, 0], az: -10, el: 8, dist: 7.4 }, lit: 'pend', scene: 'pend', look: {},
    fig: '충돌은 Δp = 0, 흔들림은 ΔE = 0',
  },
  {
    kicker: '5.7', title: '2차원', sub: '교차로 충돌',
    body: `
      <p class="lede">동쪽으로 ${f(C.v1, 0)} m/s로 달리는 ${k(C.m1)} kg 승용차와 북쪽으로 ${f(C.v2, 0)} m/s로 달리는 ${k(C.m2)} kg 트럭이 충돌해 한 덩어리가 된다. 운동량은 방향마다 따로 보존된다.</p>
      <table class="data">
        <tr><th>동 (<i>x</i>)</th><th>북 (<i>y</i>)</th></tr>
        <tr><td><i>m</i>₁<i>v</i>₁ = (<i>m</i>₁+<i>m</i>₂)<i>v</i>′<sub>x</sub></td><td><i>m</i>₂<i>v</i>₂ = (<i>m</i>₁+<i>m</i>₂)<i>v</i>′<sub>y</sub></td></tr>
        <tr><td>${k(C.px)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>x</sub></td><td>${k(C.py)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>y</sub></td></tr>
        <tr><td><i>v</i>′<sub>x</sub> = ${f(C.vx)} m/s</td><td><i>v</i>′<sub>y</sub> = ${f(C.vy)} m/s</td></tr>
      </table>
      <p>운동량을 꼬리에 머리를 이어 더한다. <i>P</i> = √(<i>p</i><sub>x</sub>² + <i>p</i><sub>y</sub>²) = ${k(C.P)} kg·m/s이므로 <i>v</i>′ = <i>P</i>/(<i>m</i>₁+<i>m</i>₂) = ${f(C.v)} m/s이고, 방향은 동쪽에서 북쪽으로 ${C.angle.toFixed(1)}°이다. 속력을 더해서는 절대 안 된다.</p>
      <div class="charts">${vecSketch}</div>
      <p class="hintline">이 장면의 화살표: 1000 kg·m/s당 ${cm(CRASH_SCALE)}. 클릭하면 꼬리에 머리를 이어 더한다.</p>`,
    cam: { target: [STATIONS.crash + 0.5, 0, -1.5], az: -10, el: 50, dist: 58 }, lit: 'crash', scene: 'crash', look: {},
    fig: 'p_car + p_truck = P',
  },
  {
    kicker: '5.8', title: '질량 중심', sub: '아무 일 없었다는 듯 날아간다',
    body: `
      <p class="lede"><b>질량 중심</b>은 계의 위치를 질량으로 가중 평균한 것이다. 내부에서 주고받는 힘은 질량 중심의 운동을 바꿀 수 없다. 수레 페이지에서도 질량 중심은 모든 충돌을 곧장 지나 미끄러져 갔다.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i>₁<i>x</i>₁ + <i>m</i>₂<i>x</i>₂) / (<i>m</i>₁ + <i>m</i>₂)</div>
      <p>${f(Sh.m, 1)} kg 포탄을 위쪽 ${Sh.deg}° 방향으로 ${f(Sh.v0, 0)} m/s로 쏘면, 최고점에서 질량이 같은 두 조각으로 터진다. 뒤쪽 조각은 멈춘 채 남아 <i>R</i>/2 지점으로 떨어진다. 앞쪽 조각은 운동량을 모두 가져가 <i>v</i>₂′ = ((<i>m</i>₁+<i>m</i>₂)/<i>m</i>₂)<i>v</i><sub>x</sub> = ${f(Sh.v2, 1)} m/s로 날아가 3<i>R</i>/2 지점에 떨어진다. 질량 중심은 포탄이 터지지 않은 것처럼 <i>R</i> = ${f(Sh.R)} m에 떨어진다.</p>
      <div class="charts">${shellChart}</div>
      <p>요령: 두 조각은 항상 크기가 같고 방향이 반대인 충격량을 받으므로, 가벼운 쪽의 Δ<i>v</i>가 더 크다.</p>`,
    cam: { target: [STATIONS.shell + 0.2, 2.4, 0], az: -6, el: 8, dist: 44 }, lit: 'shell', scene: 'shell', look: {},
    fig: '질량 중심은 R에 떨어진다',
  },
  {
    kicker: '5.9 · AP 물리 C', title: '연속 물체', sub: '적분으로 구하는 질량 중심',
    body: `
      <p class="lede">속이 찬 막대를 d<i>m</i> = λ d<i>x</i> 조각으로 잘게 나누고(λ: 1 m당 질량), 각 조각에 그 위치를 가중치로 곱해 적분한다.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>x</i> d<i>m</i></div>
      <table class="data">
        <tr><th>${f(Rd.L, 1)} m 막대</th><th><i>M</i> = ∫λ d<i>x</i></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>λ = ${f(Rd.lamU, 1)} kg/m</td><td>λ<i>L</i> = ${f(Rd.MU, 1)} kg</td><td><i>L</i>/2 = ${f(Rd.xU)} m</td></tr>
        <tr><td>λ = λ₀<i>x</i>/<i>L</i>, λ₀ = ${f(Rd.lam0, 1)}</td><td>λ₀<i>L</i>/2 = ${f(Rd.MN, 1)} kg</td><td>2<i>L</i>/3 = ${f(Rd.xN)} m</td></tr>
      </table>
      <div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div>
      <p><i>M</i> = λ₀<i>L</i>/2로 나누면 2<i>L</i>/3로, 가운데를 지난 곳이다. 각 막대는 <i>x</i><sub>cm</sub>에 놓인 칼날 위에서 균형을 이루며, 그 점에 대한 알짜 돌림힘은 ∫(<i>x</i> − <i>x</i><sub>cm</sub>)<i>g</i> d<i>m</i> = 0이다.</p>
      <div class="charts">${rodChart}</div>
      <p class="hintline">진할수록 밀도가 크다. 클릭하면 조각으로 나뉜다(1 N당 ${cm(W_SCALE)}).</p>`,
    cam: { target: [STATIONS.rods + 0.1, 0.4, 0], az: -14, el: 22, dist: 9.4 }, lit: 'rods', scene: 'rods', look: {},
    fig: 'x_cm에서 균형',
  },
  {
    kicker: '5.10 · AP 물리 C', title: '판', sub: '띠 하나하나씩',
    body: `
      <p class="lede">판(σ = ${f(M.SIGMA, 1)} kg/m²)을 한 변에 나란한 띠로 자른다. 변에서 <i>u</i>만큼 떨어진 폭 <i>w</i>(<i>u</i>)인 띠의 질량은 d<i>m</i> = σ<i>w</i> d<i>u</i>이다.</p>
      <div class="eq"><i>u</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>u</i> σ<i>w</i>(<i>u</i>) d<i>u</i></div>
      <table class="data">
        <tr><th>판</th><th><i>w</i>(<i>u</i>)</th><th><i>u</i><sub>cm</sub></th></tr>
        <tr><td>삼각형, <i>h</i> = ${f(Tr.h, 1)} m</td><td><i>b</i>(1 − <i>u</i>/<i>h</i>)</td><td><i>h</i>/3 = ${f(Tr.ucm)} m</td></tr>
        <tr><td>반원, <i>R</i> = ${f(Se.R, 1)} m</td><td>2√(<i>R</i>² − <i>u</i>²)</td><td>4<i>R</i>/3π = ${f(Se.ucm)} m</td></tr>
      </table>
      <div class="eq">∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> = 2<i>R</i>³/3</div>
      <p>넓이 π<i>R</i>²/2로 나누면 4<i>R</i>/3π이다. 삼각형은 앞 페이지의 막대를 옆으로 돌려 놓은 것과 같다. 꼭짓점에서부터 띠의 폭이 λ₀<i>x</i>/<i>L</i>처럼 넓어진다. 띠 합은 점점 정확한 값에 다가간다.</p>
      <div class="charts">${stripChart}</div>
      <p class="hintline">핀은 질량 중심에 있다. 클릭하면 띠가 갈라진다(1 N당 ${cm(W_PLATE)}).</p>`,
    cam: { target: [STATIONS.plates + 0.05, 0.3, 0], az: -10, el: 22, dist: 10.6 }, lit: 'plates', scene: 'plates', look: {},
    fig: 'u_cm = (1/M)∫u dm',
  },
  {
    kicker: '5.11 · AP 물리 C', title: '부분과 구멍', sub: '조각은 더하고, 빈 곳은 뺀다',
    body: `
      <p class="lede">단순한 조각들로 이루어진 물체는 각 조각의 질량을 그 조각의 질량 중심에 놓고 더한다. 구멍은 질량이 음수인 조각이다.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>)/(<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th>L자 판, 안쪽 모서리 기준</th><th>질량</th><th>(<i>x</i>, <i>y</i>), m</th></tr>
        <tr><td>팔 A, ${f(Ll.A.a1 - Ll.A.a0, 1)} × ${f(Ll.A.b1 - Ll.A.b0, 1)} m</td><td>${f(Ll.pA.m)} kg</td><td>${xy(Ll.pA.c)}</td></tr>
        <tr><td>팔 B, ${f(Ll.B.a1 - Ll.B.a0, 1)} × ${f(Ll.B.b1 - Ll.B.b0, 1)} m</td><td>${f(Ll.pB.m)} kg</td><td>${xy(Ll.pB.c)}</td></tr>
        <tr><td>L자 판</td><td>${f(Ll.M)} kg</td><td>${xy(Ll.cm)}</td></tr>
      </table>
      <p>이 점은 L자 판 위가 아니라 빈 곳에 있다. 고리나 부메랑처럼 핀 위에서는 균형을 잡을 수 없지만, 줄에 매달면 질량 중심이 매듭 바로 아래에 올 때까지 돌아간다.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>full</sub><i>x</i><sub>full</sub> − <i>m</i><sub>plug</sub><i>x</i><sub>plug</sub>)/<i>M</i></div>
      <p>${f(Ho.s, 1)} m 정사각형(${f(Ho.mFull)} kg)에서 ${xy(Ho.c)}에 있는 반지름 ${f(Ho.r, 1)} m의 마개(${f(Ho.mPlug)} kg)를 빼낸다. <i>x</i><sub>cm</sub> = <i>y</i><sub>cm</sub> = −${f(Ho.mPlug)}×${f(Ho.c[0])}/${f(Ho.M)} = ${f(Ho.cm[0], 3)} m로, 중심에서 구멍 반대쪽으로 ${f(Math.hypot(...Ho.cm) * 100, 1)} cm 떨어진 곳이다.</p>
      <p class="hintline">클릭하면 L자 판이 갈라지고 마개가 빠진다.</p>`,
    cam: { target: [STATIONS.parts + 0.05, 1.22, 0], az: -12, el: 14, dist: 10.2 }, lit: 'parts', scene: 'parts', look: {},
    fig: '물체 바깥에 있는 점',
  },
];

// ---------- click a scene: what it breaks into ----------
const collFacts = c => s => { const r = M.track(c, s[c === S ? 'stick' : c === B ? 'bounce' : 'burst'].t); return [
  ['p₁', `${f(r.p1)} kg·m/s`], ['p₂', `${f(r.p2)} kg·m/s`], ['전체 P', `${f(r.P)} kg·m/s`], ['운동 에너지', `${f(r.K)} J`], ['질량 중심 속도', `${f(r.P / (c.m1 + c.m2))} m/s`]]; };
export const PLATES = {
  mom: { text: `회색 화살표는 속도이며, 공의 화살표가 네 배 길다. 검은 운동량 화살표는 길이가 같은데, 수레의 질량이 네 배이기 때문이다. 운동량은 질량과 속도를 함께 담는다.`,
    facts: () => [['공: 0.5 kg × 4.0 m/s', `${f(M.p(M.BALL.m, M.BALL.v))} kg·m/s`], ['수레: 2.0 kg × 1.0 m/s', `${f(M.p(M.CART.m, M.CART.v))} kg·m/s`], ['공 KE = p²/2m', `${f(M.ke(M.BALL.m, M.BALL.v))} J`], ['수레 KE = p²/2m', `${f(M.ke(M.CART.m, M.CART.v))} J`]] },
  wall: { text: `충돌 전(오른쪽)과 후(왼쪽)의 운동량. 변화량 Δp = p<sub>after</sub> − p<sub>before</sub>는 어느 쪽보다도 두 배 길며, 벽이 미는 힘과 같은 방향인 벽에서 멀어지는 쪽을 향한다. 이 변화량이 충격량이다.`,
    facts: s => { const w = M.wall(s.wall.t); return [['충돌 전 p', `+${f(Wl.m * Wl.v)} kg·m/s`], ['충돌 후 p', `−${f(Wl.m * Wl.v)} kg·m/s`], ['Δp = J', `−${f(Wl.J)} N·s`], ['접촉 시간', `${f(Wl.tau)} s`], ['현재 힘', `${f(Math.abs(w.F), 1)} N`]]; } },
  eggs: { text: `회색 화살표는 두 충격량으로, 두 달걀이 잃는 운동량이 같으므로 똑같다. 다른 것은 그만큼 잃는 데 걸리는 시간이고, 따라서 얼마나 세게 밀어야 하는지다.`,
    facts: () => [['충격량(각각)', `${f(Eg.J, 3)} N·s`], ['베개: J / Δt', `${f(Eg.J / Eg.tauSoft)} N, ${f(Eg.tauSoft)} s 동안`], ['바닥: J / Δt', `${f(Eg.J / Eg.tauHard)} N, ${f(Eg.tauHard)} s 동안`], ['힘의 비', `${f(Eg.tauSoft / Eg.tauHard, 1)}×`]] },
  stick: { text: `위쪽에 충돌 전과 후의 운동량을 꼬리에 머리를 이어 놓았다. 두 줄 모두 합이 같은 파란 전체 운동량이 된다. 수레 2의 운동량은 부호까지 바뀌지만, 전체는 전혀 변하지 않는다.`, facts: collFacts(S) },
  bounce: { text: `충돌 전: 운동량은 모두 수레 1에 있다. 충돌 후: 수레 1의 운동량은 음수이고 수레 2의 운동량은 전체보다 크다. 꼬리에 머리를 이어 놓으면 두 줄 모두 여전히 같은 파란 화살표가 된다.`, facts: collFacts(B) },
  burst: { text: `전: 아무것도 없다. 후: 크기가 같고 방향이 반대인 두 화살표가 더해져 0이 된다. 전체 운동량이 내내 0이므로 질량 중심은 전혀 움직이지 않는다.`, facts: collFacts(X) },
  pend: { text: `점선은 흔들림의 가장 낮은 곳과 가장 높은 곳을 표시하며, 둘 사이 높이 차가 Δy다. 삼각형에서 cos θ = (L − Δy)/L이므로 Δy = L(1 − cos θ)이다. 충돌 직후의 v′을 구하는 다른 방법도 있다. 블록이 거친 바닥을 미끄러지다 멈추면 v′ = √(2μ<sub>k</sub>gΔx), 용수철을 압축하면 v′ = √(kΔx²/(m+M)), 탁자에서 날아가 떨어지면 v′ = Δx/√(2Δy/g)이다.`,
    facts: s => { const q = M.pend(s.pend.t); return [['충돌 직후 v′', `${f(Pd.v)} m/s`], ['Δy = v′²/2g', `${f(Pd.dy * 100, 1)} cm`], ['θ 최댓값', `${deg(Pd.theta)}°`], ['현재 각도', `${deg(q.th)}°`], ['현재 KE + Ug', `${f(q.K + q.U)} J`], ['10 g 총알이 2.0 kg에 박힐 때(같은 θ)', `${f(BULLET, 0)} m/s`]]; } },
  crash: { text: `승용차의 운동량은 동쪽, 트럭의 운동량은 북쪽을 향한다. 꼬리에 머리를 이어 놓으면 직각삼각형이 되고, 파란 빗변이 전체 운동량이다. 한 덩어리가 된 잔해는 이 운동량을 지니고 동쪽에서 북쪽으로 ${C.angle.toFixed(1)}° 방향으로 움직인다.`,
    facts: () => [['p 승용차 (동)', `${k(C.px)} kg·m/s`], ['p 트럭 (북)', `${k(C.py)} kg·m/s`], ['전체 P', `${k(C.P)} kg·m/s`], ['v′ = P/(m₁+m₂)', `${f(C.v)} m/s`], ['방향', `동쪽에서 북쪽으로 ${C.angle.toFixed(1)}°`], ['KE', `${k(C.K0 / 1000)} kJ → ${k(C.K1 / 1000)} kJ`]] },
  shell: { text: `외력인 중력이 모든 경로를 휘게 하므로 연직 방향 운동량은 계속 변한다. 폭발은 내부에서 일어난다. 그 순간 전체 운동량(파랑)은 폭발 전후가 같으며, 폭발 후에는 모두 앞쪽 조각에 있다.`,
    facts: s => { const q = M.shell(s.shell.t); return [['질량 중심의 x', `${f(q.cm[0])} m`], ['폭발 전: m·vx', `${f(Sh.m * Sh.vx)} kg·m/s`], ['폭발 후: (m/2)·v₂′', `${f(Sh.m / 2 * Sh.v2)} kg·m/s`], ['착지 지점', `${f(Sh.R / 2)} m, ${f(1.5 * Sh.R)} m`]]; } },

  rods: { text: `각 조각을 그 조각의 질량 중심에 무게 d<i>m</i>·<i>g</i>와 함께 그렸다(1 N당 ${cm(W_SCALE)}). 균일한 막대에서는 열 개의 무게가 모두 같다. 다른 막대에서는 무게가 <i>x</i>에 따라 커지므로, 오른쪽의 수가 적고 무거운 조각들이 왼쪽의 수가 많고 가벼운 조각들과 균형을 이룬다. 칼날에 대한 양쪽의 돌림힘이 같다.`,
    facts: () => { const sl = M.rodSlices('N'), g = M.G, L = sl.filter(q => q.x < Rd.xN).reduce((a, q) => a + (Rd.xN - q.x) * q.dm * g, 0), Rr = sl.filter(q => q.x >= Rd.xN).reduce((a, q) => a + (q.x - Rd.xN) * q.dm * g, 0);
      return [['균일: 조각 하나', `${f(M.rodSlices('U')[0].dm, 3)} kg`], ['λ₀x/L: 첫 조각과 마지막 조각', `${f(sl[0].dm, 3)} kg, ${f(sl.at(-1).dm, 3)} kg`], ['x_cm, 균일 / λ₀x/L', `${f(Rd.xU)} m / ${f(Rd.xN)} m`], ['왼쪽 조각들의 돌림힘', `${f(L, 3)} N·m`], ['오른쪽 조각들의 돌림힘', `${f(Rr, 3)} N·m`]]; } },
  plates: { text: `각 판을 여덟 개의 띠로 나누고, 띠마다 그 질량 중심에 무게와 함께 그렸다(1 N당 ${cm(W_PLATE)}). 밑변이나 지름 근처의 넓은 띠가 가장 무겁기 때문에, 균형점은 먼 끝보다 그 변에 더 가깝다.`,
    facts: () => { const t = M.plateStrips(Tr), c = M.plateStrips(Se); return [['삼각형: M = σbh/2', `${f(Tr.M)} kg`], ['삼각형: 가장 무거운 / 가벼운 띠', `${f(t[0].dm, 3)} / ${f(t.at(-1).dm, 3)} kg`], ['반원: M = σπR²/2', `${f(Se.M)} kg`], ['반원: 가장 무거운 / 가벼운 띠', `${f(c[0].dm, 3)} / ${f(c.at(-1).dm, 3)} kg`], ['직사각형 8개: 삼각형, 반원', `${f(M.stripSum(M.triW, Tr.h, 8), 3)}, ${f(M.stripSum(M.semiW, Se.R, 8), 3)} m`], ['적분값: h/3, 4R/3π', `${f(Tr.ucm, 3)}, ${f(Se.ucm, 3)} m`]]; } },
  parts: { text: `떼어 놓으면 각 팔은 그 중심(작은 원반)에 있는 점질량이 된다. L자 판의 질량 중심은 둘을 잇는 선 위, 더 무거운 팔에 가까운 쪽에 있으며, 팔이 갈라져도 제자리에 있다. 들어낸 마개는 음의 질량이다. 정사각형의 중심, 마개의 중심, 판의 질량 중심은 한 직선 위에 있고, 균형점은 구멍의 반대쪽에 있다.`,
    facts: () => [['팔 A', `${f(Ll.pA.m)} kg, 위치 ${xy(Ll.pA.c)} m`], ['팔 B', `${f(Ll.pB.m)} kg, 위치 ${xy(Ll.pB.c)} m`], ['L자 판', `${f(Ll.M)} kg, 위치 ${xy(Ll.cm)} m`], ['전체 정사각형 − 마개', `${f(Ho.mFull)} − ${f(Ho.mPlug)} = ${f(Ho.M)} kg`], ['구멍 뚫린 판 x_cm, y_cm', `${f(Ho.cm[0], 3)}, ${f(Ho.cm[1], 3)} m`]] },
};
