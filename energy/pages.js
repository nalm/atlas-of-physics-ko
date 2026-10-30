// Chapter 4, page by page (after the AP Physics 1 organizer, Unit 5). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, BAR_COLORS } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const ST = STATIONS;
const INK = '#2c2c30', BLUE = '#4f7cbd', AMBER = '#bf9030', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1, h = H) => P.t + (1 - (y - y0) / (y1 - y0)) * (h - P.t - P.b) };   // h: a chart may be shorter
function chart({ x0, x1, y0, y1, h: H = 170, series, xlabel, ylabel, marks = [], cursors = [], label, under = '', zero = false }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1, H);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// live energy bars on the left page (the pendulum): heights set in main.js
export const BARS = { x: 70, w: 64, gap: 46, base: 150, top: 20 };
const barChart = (key, items, Emax) => `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="실시간 에너지 막대그래프">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.top}" y2="${BARS.top}"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${f(Emax)} J</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  pull: { x0: 0, x1: 3.2, y0: 0, y1: 70 },
  toss: { x0: 0, x1: 1.25, y0: -10, y1: 10 },
  car: { x0: 0, x1: 8, y0: 0, y1: 25 },
  drop: { x0: 0, x1: 3, y0: 0, y1: 16 },
  spring: { x0: 0, x1: 0.5, y0: 0, y1: 25 },
  slide: { x0: 0, x1: 2.2, y0: 0, y1: 18 },
  lift: { x0: 0, x1: 4.2, y0: 0, y1: 250 },
  push: { x0: 0, x1: 4, y0: 0, y1: 20, h: 140 },
  beadU: { x0: 0, x1: 6, y0: 0, y1: 4, h: 125 },
  beadF: { x0: 0, x1: 6, y0: -2, y1: 2, h: 110 },
  bondU: { x0: 0.13, x1: 0.34, y0: -1.2, y1: 0.4, h: 135 },
};
const P0 = M.pull(M.PULL.run), XS = M.SPRING.xmax;

export const PAGES = [
  {
    kicker: '4장', title: '일', sub: '거리에 걸쳐 작용하는 힘',
    body: `
      <p class="lede"><b>일</b>은 힘에 의해 물체로 들어가거나 물체에서 나오는 에너지다. 힘이 작용하는 동안 물체가 움직여야만 힘이 일을 한다.</p>
      <div class="eq"><i>W</i> = |<i>F</i>| |Δ<i>x</i>| cos θ</div>
      <p>θ는 힘과 변위 사이의 각이다. 일의 단위는 줄이다. 1 J은 1 N의 힘이 1 m에 걸쳐 작용할 때의 일이다.</p>
      <p>밧줄이 이 ${f(M.PULL.m, 1)} kg 상자를 ${M.PULL.deg}° 방향으로 ${f(M.PULL.F, 0)} N의 힘으로 당겨 마찰 없는 바닥 위로 끈다. 운동 방향을 향하는 것은 <i>F</i> cos θ = ${f(M.PULL.Fx, 1)} N뿐이다. <i>F</i> sin θ = ${f(M.PULL.Fy, 1)} N은 운동에 수직으로 당기므로 일을 하지 않는다. ${f(P0.x)} m에 걸쳐 밧줄은 ${f(P0.W, 1)} J의 일을 하는데, 이는 수평으로 당길 때의 ${f(M.PULL.F * P0.x, 1)} J보다 적다.</p>
      <div class="charts">${chart({ ...R.pull, xlabel: '변위 Δx (m)', ylabel: '밧줄이 한 일 (J)', cursors: [['pull']], label: '변위에 따른 일',
        series: [{ cls: 'trend', pts: [[0, 0], [3.2, M.PULL.F * 3.2]], tag: [1.7, M.PULL.F * 1.7 + 3, 'θ = 0°'] }, { pts: [[0, 0], [3.2, M.PULL.Fx * 3.2]], tag: [2.45, M.PULL.Fx * 2.45 - 13, 'θ = 30°'] }] })}</div>
      <p class="hintline">상자를 클릭하면 당기는 힘을 성분으로 나눈다. 화살표: 1 N당 ${SC.pull.F * 100} cm.</p>`,
    cam: { target: [ST.pull + 0.75, 0.6, 0], az: -20, el: 12, dist: 17 }, lit: 'pull', scene: 'pull', look: {},
    fig: '30°로 당기기',
  },
  {
    kicker: '4.1', title: '양의 일과 음의 일', sub: '운동과 같은 방향, 또는 반대 방향',
    body: `
      <p class="lede">운동 방향으로 작용하는 힘(θ &lt; 90°)은 <b>양의</b> 일을 하며, 물체는 운동 에너지를 얻는다. 운동과 반대로 작용하는 힘(θ &gt; 90°)은 <b>음의</b> 일을 하며, 물체는 운동 에너지를 잃는다.</p>
      <p>${f(M.TOSS.m)} kg 공을 ${f(M.TOSS.v0, 1)} m/s로 위로 던진다. 올라가는 동안 중력은 운동과 반대 방향(θ = 180°)이며, 공이 멈추는 꼭대기까지 ${f(-M.TOSS.m * M.G * M.TOSS.h, 1)} J의 일을 한다. 떨어지는 동안(θ = 0°) 중력은 ${f(M.TOSS.m * M.G * M.TOSS.h, 1)} J을 되돌려 준다. 막대들의 합이 맞아떨어진다: <i>K</i><sub>0</sub> + <i>W</i><sub>g</sub> = <i>K</i>.</p>
      <div class="charts">${chart({ ...R.toss, zero: true, xlabel: '시간 (s)', ylabel: '에너지 (J)', cursors: [['tossK', BLUE], ['tossW']], label: '시간에 따른 운동 에너지와 중력이 한 일',
        series: [{ color: BLUE, pts: samples(40, 0, M.TOSS.run, t => M.toss(t).K), tag: [0.02, 7.2, 'K'] }, { pts: samples(40, 0, M.TOSS.run, t => M.toss(t).Wg), tag: [0.5, -9.6, '중력이 한 일'] }] })}</div>
      <p class="hintline">화살표: <b>v</b>는 1 m/s당 ${SC.toss.v * 100} cm, <i>F</i><sub>g</sub>는 ${SC.toss.F * 100} cm/N. 막대: ${SC.toss.E * 100} cm/J.</p>`,
    cam: { target: [ST.toss + 0.8, 1.25, 0], az: -16, el: 7, dist: 12 }, lit: 'toss', scene: 'toss', look: {},
    fig: '올라갈 때는 중력을 거슬러, 내려올 때는 중력을 따라',
  },
  {
    kicker: '4.2', title: '일을 하지 않는 힘', sub: '운동에 수직인 힘',
    body: `
      <p class="lede">변위에 90°로 작용하는 힘은 cos 90° = 0이므로 일을 하지 않는다. 이런 힘은 운동 방향을 바꿀 수는 있어도 속력은 결코 바꾸지 못한다.</p>
      <p>${f(M.WHIRL.r, 1)} m 줄에 매단 ${f(M.WHIRL.m)} kg 공이 매끄러운 탁자 위에서 ${f(M.WHIRL.v, 1)} m/s로 원운동한다. 줄은 <i>T</i> = ${f(M.WHIRL.T, 1)} N으로 공을 중심 쪽으로 당기는데, 이 힘은 언제나 속도에 수직이다. 공의 운동 에너지는 ${f(M.WHIRL.K)} J로 유지된다.</p>
      <p>원 궤도를 도는 위성도 마찬가지다. 중력은 행성을 향해 속도에 수직으로 작용하므로 위성에 일을 하지 않는다. 수평 바닥의 수직 항력도 그렇다.</p>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: -10, y1: 10, zero: true, xlabel: '각 θ (°)', ylabel: '10 N이 1 m에 걸쳐 한 일 (J)', label: '각에 따른 일',
        series: [{ pts: samples(60, 0, 180, d => M.work(10, 1, d)) }, { cls: 'trend', pts: [], tag: [20, 2.5, '양'] }, { cls: 'trend', pts: [], tag: [120, -8, '음'] }], marks: [[90, 0, '90°에서 0', 8, -8]] })}</div>
      <p class="hintline">공을 클릭하면 앞선 순간들이 보인다. <b>v</b>: 1 m/s당 ${SC.whirl.v * 100} cm, <i>T</i>: ${SC.whirl.F * 100} cm/N.</p>`,
    cam: { target: [ST.whirl, 0.1, 0], az: -14, el: 36, dist: 8.8 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: '속도에 수직인 장력',
  },
  {
    kicker: '4.3', title: '운동 에너지', sub: '일–에너지 정리',
    body: `
      <p class="lede"><b>운동 에너지</b>는 운동의 에너지로, <i>K</i> = ½<i>mv</i>²이다. 단위가 줄인 스칼라이며, 결코 음수가 되지 않는다.</p>
      <p><b>일–에너지 정리</b>: 알짜일은 운동 에너지의 변화량과 같다.</p>
      <div class="eq"><i>W</i><sub>net</sub> = Δ<i>K</i> = ½<i>mv</i><sub>f</sub>² − ½<i>mv</i><sub>0</sub>²</div>
      <p>도로가 이 ${M.CAR.m} kg 자동차를 ${f(M.CAR.F / 1000, 1)} kN으로 앞으로 민다(항력은 무시). ${f(M.car(M.CAR.run).x)} m를 간 뒤 도로는 ${f(M.car(M.CAR.run).Wnet / 1000)} kJ의 일을 했고, 자동차는 ${f(M.car(M.CAR.run).v, 1)} m/s로 움직인다: ½ × ${M.CAR.m} × ${f(M.car(M.CAR.run).v, 1)}² = ${f(M.car(M.CAR.run).K / 1000)} kJ. 두 막대는 함께 자란다.</p>
      <div class="charts">${chart({ ...R.car, xlabel: '거리 (m)', ylabel: 'K = W_net (kJ)', cursors: [['car', BLUE]], label: '거리에 따른 운동 에너지',
        series: [{ color: BLUE, pts: [[0, 0], [8, M.CAR.F * 8 / 1000]], tag: [3.2, M.CAR.F * 3.2 / 1000 + 3, '기울기 = F = 3.0 kN'] }] })}</div>
      <p class="hintline">자동차를 클릭해 보자. 무게와 수직 항력은 일을 하지 않는다. 화살표: 1 kN당 25 cm. 막대: 1 kJ당 7.5 cm.</p>`,
    cam: { target: [ST.car + 4.6, 1.0, 0], az: -16, el: 12, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: '알짜일이 들어가면 운동 에너지가 나온다',
  },
  {
    kicker: '4.4', title: '중력 퍼텐셜 에너지', sub: '높이의 에너지',
    body: `
      <p class="lede"><b>퍼텐셜 에너지</b>는 위치에 따라 달라지는, 저장된 에너지다. 지표면 근처에서는</p>
      <div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i></div>
      <p>이며, Δ<i>y</i>는 <i>U</i><sub>g</sub> = 0으로 정한 곳이면 어디서든 잰다. 이는 물체를 중력을 거슬러 그 높이까지 들어 올리는 데 필요한 최소한의 일과 같다.</p>
      <p>이 ${f(M.DROP.m)} kg 공을 ${f(M.DROP.h, 1)} m에서 떨어뜨린다: <i>U</i><sub>g</sub> = ${f(M.DROP.E, 1)} J, <i>K</i> = 0. 떨어지면서 <i>U</i><sub>g</sub>는 <i>K</i>로 바뀌고, 땅에 닿기 직전 <i>K</i> = ${f(M.DROP.E, 1)} J이므로 <i>v</i> = ${f(Math.sqrt(2 * M.G * M.DROP.h))} m/s다. 어떤 높이에서 떨어뜨리면 <i>U</i><sub>g0</sub> = <i>K</i><sub>f</sub>이다.</p>
      <div class="charts">${chart({ ...R.drop, xlabel: '지면으로부터의 높이 (m)', ylabel: '에너지 (J)', cursors: [['dropU', AMBER], ['dropK', BLUE]], label: '높이에 따른 퍼텐셜 에너지와 운동 에너지',
        series: [{ cls: 'trend', pts: [[0, M.DROP.E], [3, M.DROP.E]], tag: [1.25, M.DROP.E - 1, 'E'] }, { color: AMBER, pts: [[0, 0], [3, M.DROP.E]], tag: [2.2, 8.5, 'U<tspan dy="3" font-size="8">g</tspan>'] }, { color: BLUE, pts: [[0, M.DROP.E], [3, 0]], tag: [0.35, 10.0, 'K'] }] })}</div>
      <p class="hintline">공을 클릭하면 기준점을 옮긴다. 막대: 1 J당 ${SC.drop.E * 100} cm.</p>`,
    cam: { target: [ST.drop + 0.7, 1.5, 0], az: -14, el: 6, dist: 14 }, lit: 'drop', scene: 'drop', look: {},
    fig: '높이가 속력이 된다',
  },
  {
    kicker: '4.5', title: '탄성 퍼텐셜 에너지', sub: '훅 법칙',
    body: `
      <p class="lede">용수철은 원래 길이로 돌아가려고 되민다. 많이 압축되거나 늘어날수록 더 세게 민다.</p>
      <table class="data eqs"><tr><td><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></td><td>Δx와 반대 방향. <i>k</i>의 단위는 N/m</td></tr><tr><td><i>U</i><sub>s</sub> = ½<i>k</i>Δ<i>x</i>²</td><td>저장된 에너지</td></tr></table>
      <p><i>k</i> = ${M.SPRING.k} N/m일 때 ${f(M.SPRING.m, 1)} kg 블록(<i>K</i> = ${f(M.SPRING.E, 1)} J)은 Δ<i>x</i> = ${f(XS)} m에서 멈춘다. ${f(M.SPRING.E, 1)} J 전부가 저장되었다가 되돌려진다. 일은 <b>힘–변위 그래프 아래 넓이</b>다. <i>kx</i> 아래는 삼각형이므로 ½ · Δ<i>x</i> · <i>k</i>Δ<i>x</i>이다.</p>
      <div class="charts">${chart({ ...R.spring, xlabel: '압축 Δx (m)', ylabel: '탄성력 (N)', cursors: [['spring']], label: '압축에 따른 탄성력. 색칠한 넓이가 저장된 에너지와 같다',
        under: `<path data-area="spring" style="fill:${BAR_COLORS.U};opacity:.45" d=""/>`, series: [{ pts: [[0, 0], [0.5, M.SPRING.k * 0.5]] }] })}</div>
      <p class="live" id="springlive"></p>
      <p class="hintline">마찰 없음. 화살표: ${SC.spring.F * 100} cm/N. 막대: ${SC.spring.E * 100} cm/J.</p>`,
    cam: { target: [ST.spring - 0.05, 0.6, 0], az: -14, el: 20, dist: 14 }, lit: 'spring', scene: 'spring', look: {},
    fig: '용수철 압축하기',
  },
  {
    kicker: '4.6 · AP 물리 C', title: '변하는 힘이 하는 일', sub: 'F(x) 아래 넓이',
    body: `
      <p class="lede">이동하는 동안 힘이 변하면, 경로를 얇은 띠로 잘라 각 띠의 <i>F</i>Δ<i>x</i>를 더하고 띠를 점점 줄인다. 그 합은 <b>F(x) 그래프 아래 넓이</b>가 된다:</p>
      <div class="eq"><i>W</i> = lim Σ <i>F</i>(<i>x</i><sub>i</sub>)Δ<i>x</i> = ∫ <i>F</i>(<i>x</i>) d<i>x</i></div>
      <p>매끄러운 바닥 위의 ${f(M.PUSH.m, 1)} kg 상자가 <i>F</i> = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>)의 힘을 받는다. ${M.PUSH.F0} N에서 시작해 <i>L</i> = ${f(M.PUSH.L, 1)} m에서 0으로 줄어든다. 적분하면 <i>W</i> = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(M.PUSH.W, 1)} J이며, 모두 운동 에너지가 된다.</p>
      <div class="charts">${chart({ ...R.push, xlabel: '위치 x (m)', ylabel: '미는 힘 F(x) (N)', cursors: [['push']], label: '위치에 따른 미는 힘. 상자까지의 넓이를 색칠하고 띠 여섯 개를 윤곽으로 표시했다',
        under: `<path data-area="push" style="fill:#86868c;opacity:.35" d=""/>` + Array.from({ length: 6 }, (_, i) => { const dx = M.PUSH.L / 6, x = i * dx, F = M.pushF(x + dx / 2), X = v => CH.sx(v, R.push.x0, R.push.x1), Y = v => CH.sy(v, R.push.y0, R.push.y1, R.push.h); return `<rect class="trend" x="${X(x)}" y="${Y(F)}" width="${X(dx) - X(0)}" height="${Y(0) - Y(F)}"/>`; }).join(''),
        series: [{ pts: [...samples(60, 0, M.PUSH.L, M.pushF), [R.push.x1, 0]] }] })}</div>
      <p class="hintline">띠 6개(점선) ${f(M.pushStrips(6))} J, 띠 64개 ${f(M.pushStrips(64), 3)} J. ${SC.push.F * 100} cm/N.</p>`,
    cam: { target: [ST.push + 0.1, 0.8, 0], az: -12, el: 9, dist: 14.5 }, lit: 'push', scene: 'push', look: {},
    fig: '일은 F(x) 아래 넓이다',
  },
  {
    kicker: '4.7', title: '에너지 보존', sub: '역학적 에너지는 일정하다',
    body: `
      <p class="lede">마찰이나 항력이 없으면 역학적 에너지 <i>E</i> = <i>K</i> + <i>U</i><sub>g</sub> + <i>U</i><sub>s</sub>는 변하지 않는다.</p>
      <div class="eq"><i>U</i><sub>g0</sub> + <i>U</i><sub>s0</sub> + <i>K</i><sub>0</sub> = <i>U</i><sub>gf</sub> + <i>U</i><sub>sf</sub> + <i>K</i><sub>f</sub></div>
      <p>${f(M.PEND.L, 1)} m 줄에 매단 ${f(M.PEND.m, 1)} kg 추를 ${M.PEND.deg0}°에서 놓는다. 양 끝에서는 모두 <i>U</i><sub>g</sub>로 ${f(M.PEND.E)} J이다. 바닥에서는 모두 <i>K</i>이며 속력은 ${f(Math.sqrt(2 * M.PEND.E / M.PEND.m))} m/s다. 줄은 운동에 수직으로 당기므로 일을 하지 않는다. 요령: 0이 되는 항부터 찾자(양 끝에서 <i>v</i> = 0, 바닥에서 Δ<i>y</i> = 0).</p>
            <div class="charts">${barChart('pend', [['K', 'K', BAR_COLORS.K], ['U', 'U<tspan dy="3" font-size="8">g</tspan>', BAR_COLORS.U], ['E', 'E', BAR_COLORS.E]], M.PEND.E)}</div>
      <p class="hintline">추를 클릭하면 무게를 성분으로 나눈다. 화살표: ${SC.pendulum.F * 100} cm/N. 막대: ${SC.pendulum.E * 100} cm/J.</p>`,
    cam: { target: [ST.pendulum + 0.7, 1.8, 0], az: -10, el: 6, dist: 14 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: 'K와 U가 자리를 바꾼다',
  },
  {
    kicker: '4.8 · AP 물리 C', title: '퍼텐셜 에너지로부터 힘 구하기', sub: 'U의 기울기에 마이너스',
    body: `
      <p class="lede">d<i>W</i> = <i>F</i> d<i>x</i> = −d<i>U</i>이므로, 보존력은 <i>U</i>(<i>x</i>)의 <b>기울기에 마이너스를 붙인 것</b>이다. 보존력은 내리막 쪽을 향하며, <i>U</i>가 평평한 곳에서는 0이다.</p>
      <div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i></div>
      <p>매끄러운 철사에 꿰인 ${f(M.BEAD.m)} kg 구슬, <i>x</i>는 철사를 따라 잰다: <i>U</i> = <i>mgh</i>(<i>x</i>).</p>
      <div class="charts">${chart({ ...R.beadU, xlabel: '철사를 따라 잰 x (m)', ylabel: 'U (J)와 그 접선', cursors: [['beadU']], label: '철사를 따라 변하는 퍼텐셜 에너지와 구슬 위치에서의 접선',
        under: `<line data-tangent="bead" class="curve" style="stroke:#e5484d;stroke-width:1.3"/>`,
        series: [{ cls: 'trend', pts: [[0, M.BEAD.E], [R.beadU.x1, M.BEAD.E]], tag: [5.3, M.BEAD.E - 0.55, 'E'] }, { pts: samples(120, 0, M.BEAD.len, M.beadU) }] })}
        ${chart({ ...R.beadF, zero: true, xlabel: '철사를 따라 잰 x (m)', ylabel: 'F = −dU/dx (N)', cursors: [['beadF']], label: '철사 방향의 힘',
        series: [{ pts: samples(120, 0, M.BEAD.len, M.beadF) }], marks: [[M.BEAD.stable, 0, '안정', -16, 14], [M.BEAD.unstable, 0, '불안정', 6, -6]] })}</div>
      <p class="hintline">구슬을 클릭하면 접선이 보인다. ${SC.bead.F * 100} cm/N.</p>`,
    cam: { target: [ST.bead - 0.1, 0.85, 0], az: -10, el: 8, dist: 14.5 }, lit: 'bead', scene: 'bead', look: {},
    fig: 'U 그래프의 내리막 쪽으로',
  },
  {
    kicker: '4.9 · AP 물리 C', title: '에너지 도표', sub: '되돌이점과 평형',
    body: `
      <p class="lede">총에너지 <i>E</i>에 수평선을 긋는다. <i>U</i>(<i>x</i>) 위로 남는 간격이 <i>K</i>다. 입자는 <i>U</i> = <i>E</i>인 <b>되돌이점</b>에서 방향을 바꾼다.</p>
      <table class="data eqs"><tr><td>안정</td><td>U 최소, U″ &gt; 0: F가 되민다</td></tr><tr><td>불안정</td><td>U 최대, U″ &lt; 0: F가 밀어낸다 (언덕)</td></tr><tr><td>중립</td><td>U 평평: 힘 없음 (철사 오른쪽 끝)</td></tr></table>
      <p>무거운 원자에 묶인 가벼운 원자, <i>E</i> = ${f(M.BOND.E / M.EV, 1)} eV. 바닥 근처에서 우물은 용수철처럼 작용하며 <i>k</i> = <i>U</i>″이다:</p>
      <div class="eq">ω² = <i>U</i>″(<i>x</i><sub>0</sub>)/<i>m</i> → <i>T</i> = ${f(2 * Math.PI / M.BOND.w * 1e15, 1)} fs</div>
      <div class="charts">${chart({ ...R.bondU, xlabel: '원자 간 거리 r (nm)', ylabel: 'U (eV)', cursors: [['bondU']], zero: true, label: '결합 퍼텐셜 에너지와 총에너지 선, 되돌이점',
        series: [{ cls: 'trend', pts: [[R.bondU.x0, M.BOND.E / M.EV], [R.bondU.x1, M.BOND.E / M.EV]], tag: [0.315, M.BOND.E / M.EV + 0.06, 'E'] }, { pts: samples(120, 0.1355, R.bondU.x1, r => M.bondU(r * 1e-9) / M.EV) }],
        marks: [[M.BOND.r1 * 1e9, M.BOND.E / M.EV, '되돌이', -32, 4], [M.BOND.r2 * 1e9, M.BOND.E / M.EV, '되돌이', 6, 14]] })}</div>
      <p class="hintline">축척 0.1 nm = 1 m, <i>F</i>는 ${SC.bond.F * 100} cm/nN, ${(() => { const [a, e] = (1 / (M.SLOW * M.BOND.tscale)).toExponential(1).split('e+'); return `${a}×10<sup>${e}</sup>`; })()}배 느리게 표시.</p>`,
    cam: { target: [ST.bond - 0.45, 1.25, 0], az: -10, el: 6, dist: 12.5 }, lit: 'bond', scene: 'bond', look: {},
    fig: '우물 속의 입자',
  },
  {
    kicker: '4.10', title: '보존되지 않을 때', sub: '마찰은 에너지를 열로 바꾼다',
    body: `
      <p class="lede">마찰력과 항력은 <b>저항력</b>이다. 운동과 반대 방향을 향하므로 이 힘들이 하는 일은 언제나 음수다. 이 힘들이 빼앗은 역학적 에너지는 열에너지가 된다.</p>
      <div class="eq"><i>E</i><sub>mech,i</sub> = <i>E</i><sub>mech,f</sub> + |<i>W</i><sub>resistive</sub>|</div>
      <p>${f(M.SLIDE.m, 1)} kg 블록이 ${f(M.SLIDE.v0, 1)} m/s로 거친 바닥에 미끄러져 들어온다. μ<sub>k</sub> = ${f(M.SLIDE.mu)}이면 마찰력은 <i>f</i> = μ<sub>k</sub><i>mg</i> = ${f(M.SLIDE.f)} N이다. 블록은 ${f(M.SLIDE.d)} m 뒤에 멈춘다: |<i>W</i><sub>f</sub>| = <i>f</i>·<i>d</i> = ${f(M.SLIDE.E, 1)} J로, <i>K</i> 전부다. <i>E</i><sub>mech</sub>는 0으로 떨어지지만, 열까지 포함한 총에너지는 결코 변하지 않는다.</p>
      <div class="charts">${chart({ ...R.slide, xlabel: '미끄러진 거리 (m)', ylabel: '에너지 (J)', cursors: [['slideK', BLUE], ['slideT', GREY]], label: '거리에 따른 운동 에너지와 열에너지',
        series: [{ cls: 'trend', pts: [[0, M.SLIDE.E], [M.SLIDE.d, M.SLIDE.E]], tag: [0.85, M.SLIDE.E - 0.2, '총합'] }, { color: BLUE, pts: [[0, M.SLIDE.E], [M.SLIDE.d, 0]], tag: [0.2, 11.5, 'K'] }, { color: GREY, pts: [[0, 0], [M.SLIDE.d, M.SLIDE.E]], tag: [1.45, 8.0, '열에너지'] }] })}</div>
      <p class="hintline">블록을 클릭해 보자. 화살표: ${SC.slide.F * 100} cm/N. 막대: ${SC.slide.E * 100} cm/J.</p>`,
    cam: { target: [ST.slide + 0.3, 0.55, 0], az: -16, el: 12, dist: 14 }, lit: 'slide', scene: 'slide', look: {},
    fig: '운동 에너지가 열이 된다',
  },
  {
    kicker: '4.11', title: '일률', sub: '일을 얼마나 빨리 하는가',
    body: `
      <p class="lede"><b>일률</b>은 일을 하는 빠르기, 또는 에너지를 한 형태에서 다른 형태로 바꾸는 빠르기다. 단위는 와트이며, 1 W = 1 J/s, 1마력 = ${M.HP} W이다.</p>
      <div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>F</i>Δ<i>x</i>/<i>t</i> = <i>Fv</i></div>
      <p>${M.LIFT.m} kg 상자 두 개가 모두 일정한 속력으로 ${f(M.LIFT.h, 1)} m 올라가므로, 각 밧줄은 <i>T</i> = <i>mg</i> = ${f(M.LIFT.W, 0)} N으로 당기며 ${f(M.LIFT.work, 0)} J의 일을 한다. 빠른 쪽은 ${f(M.LIFT.tFast, 1)} s 걸리므로 ${f(M.LIFT.Pfast, 0)} W, 느린 쪽은 ${f(M.LIFT.tSlow, 1)} s 걸리므로 ${f(M.LIFT.Pslow, 0)} W다. 같은 일, 두 배의 일률. 속력과 시간이 주어지면 <i>P</i> = Δ<i>E</i>/<i>t</i>가 가장 빠른 경우가 많다.</p>
            <div class="charts">${chart({ ...R.lift, xlabel: '시간 (s)', ylabel: '한 일 (J)', cursors: [['liftF'], ['liftS']], label: '시간에 따른 일, 빠른 경우와 느린 경우',
        series: [{ pts: [[0, 0], [M.LIFT.tFast, M.LIFT.work], [4.2, M.LIFT.work]], tag: [0.25, 160, '빠름: 기울기 98 W'] }, { cls: 'trend', pts: [[0, 0], [M.LIFT.tSlow, M.LIFT.work]], tag: [2.45, 95, '느림: 49 W'] }] })}</div>
      <p class="hintline">짧은 출발과 정지 구간은 무시. 화살표: 1 N당 ${SC.lift.F * 100} cm.</p>`,
    cam: { target: [ST.lift, 1.7, 0], az: -12, el: 6, dist: 14 }, lit: 'lift', scene: 'lift', look: {},
    fig: '같은 일, 절반의 시간',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  pull: { text: `당기는 힘은 두 성분(회색)으로 나뉜다. <i>F</i> cos θ는 변위 방향에 놓여 모든 일을 한다. <i>F</i> sin θ는 운동에 90°인 곧장 위쪽을 향하므로 일을 하지 않는다. 바닥이 위로 미는 힘을 줄일 뿐이다. 다른 어떤 힘도 일을 하지 않으므로 밧줄이 한 일은 상자의 운동 에너지와 같다.`,
    facts: s => { const r = M.pull(s.pull.t); return [['F cos θ (Δx 방향)', `${f(M.PULL.Fx)} N`], ['F sin θ (수직 방향)', `${f(M.PULL.Fy)} N, 일 없음`], ['Δx', `${f(r.x)} m`], ['W = F Δx cos θ', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`]]; } },
  toss: { text: `무게와 속도 사이의 각을 살펴보자. 올라갈 때는 서로 반대(180°)여서 중력이 한 일은 음수이고 K 막대가 줄어든다. 내려올 때는 같은 방향(0°)이어서 일은 양수이고 K가 다시 자란다. 매 순간 K = K<sub>0</sub> + W<sub>g</sub>이다.`,
    facts: s => { const r = M.toss(s.toss.t); return [['높이', `${f(r.y)} m`], ['속도', `${f(r.v)} m/s`], ['지금까지 중력이 한 일 W', `${f(r.Wg)} J`], ['K = K₀ + W_g', `${f(M.toss(0).K)} + (${f(r.Wg)}) = ${f(r.K)} J`]]; } },
  whirl: { text: `4분의 1바퀴 간격의 앞선 순간들. 매 순간 장력(말뚝 쪽)과 속도(원을 따라)는 90°로 만난다. 아무리 작은 구간에서도 변위는 <b>v</b> 방향이므로 T·Δx·cos 90° = 0이다. 무게와 탁자가 미는 힘은 연직 방향이어서 역시 일을 하지 않는다.`,
    facts: () => [['장력 T', `${f(M.WHIRL.T)} N`], ['T와 v 사이의 각', '90°'], ['T가 한 일', '0 J'], ['속력', `${f(M.WHIRL.v)} m/s, 일정`], ['K', `${f(M.WHIRL.K)} J, 일정`]] },
  car: { text: `무게와 수직 항력은 연직 방향으로 운동에 90°이므로 일을 하지 않아 제쳐 둔다. Δx 방향의 힘은 도로가 미는 힘뿐이며, 이것이 곧 알짜힘(빨강)이다. 그 일 F·Δx가 운동 에너지 변화의 전부다.`,
    facts: s => { const r = M.car(s.car.t); return [['F (도로, 앞쪽)', `${f(M.CAR.F / 1000)} kN`], ['Δx', `${f(r.x)} m`], ['W_net = F Δx', `${f(r.Wnet / 1000)} kJ`], ['v', `${f(r.v)} m/s`], ['K = ½mv²', `${f(r.K / 1000)} kJ`]]; } },
  drop: { text: `기준점을 ${f(M.DROP.ref2, 1)} m로 올리면 U<sub>g</sub>의 모든 값이 mg × ${f(M.DROP.ref2, 1)} = ${f(M.DROP.m * M.G * M.DROP.ref2)} J만큼 낮아진다. 새 기준점 아래에서는 U<sub>g</sub>가 음수다. 그러나 낙하하는 동안 U<sub>g</sub>의 <i>변화량</i>은 같으므로 예측되는 속력도 같다. 계산이 가장 쉬워지는 기준점을 고르면 된다.`,
    facts: s => { const r = M.drop(s.drop.t), m = M.DROP.m * M.G; return [['높이', `${f(r.y)} m`], ['U_g, 지면 기준', `${f(r.U)} J`], [`U_g, ${f(M.DROP.ref2, 1)} m 기준`, `${f(m * (r.y - M.DROP.ref2))} J`], ['놓은 뒤의 ΔU_g', `${f(r.U - M.DROP.E)} J, 어느 쪽이든`], ['K', `${f(r.K)} J`]]; } },
  spring: { text: `회색 화살표는 용수철의 원래 길이에서 잰 압축 Δx다. 탄성력 F<sub>s</sub> = −kΔx는 반대 방향을 향한다. 블록이 느려지면서 K 막대가 U<sub>s</sub> 막대로 옮겨 가고, 최대로 압축되면 모두 U<sub>s</sub>가 된다. 총합은 결코 변하지 않는다.`,
    facts: s => { const r = M.spring(s.spring.t); return [['압축 Δx', `${f(r.x, 3)} m`], ['F_s = −kΔx', `${f(r.F)} N`], ['U_s = ½kΔx²', `${f(r.U)} J`], ['K = ½mv²', `${f(r.K)} J`], ['K + U_s', `${f(r.K + r.U)} J`]]; } },
  push: { text: `F(x) 아래 넓이를 ${6}개의 띠로 나눈다. 각 띠는 F(x<sub>i</sub>)·Δx, 곧 미는 힘이 거의 변하지 않는 짧은 구간 하나에서의 일이다. 그 합 ${f(M.pushStrips(6))} J는 이미 적분값 ${f(M.PUSH.W)} J에 가깝고, 띠를 더 얇게 하면 차이가 사라진다. 바닥은 수평이고 매끄러우므로 무게와 수직 항력은 일을 하지 않으며, 넓이는 모두 운동 에너지가 된다.`,
    facts: s => { const r = M.push(s.push.t); return [['x', `${f(r.x)} m`], ['F(x)', `${f(r.F)} N`], ['지금까지의 W = ∫F dx', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`], ['띠 6개의 합, 전체 구간', `${f(M.pushStrips(6))} J`], ['∫₀ᴸ F dx', `${f(M.PUSH.W)} J`]]; } },
  bead: { text: `점선은 철사의 접선이다. 중력은 철사 방향 성분 mg sin θ와, 철사가 미는 힘이 떠맡는 수직 성분으로 나뉜다. 철사를 따라 U = mgh이고 dh/dx = sin θ이므로, 철사 방향 성분은 정확히 −dU/dx이다. 골짜기 바닥과 언덕 꼭대기에서는 접선이 수평이다: 힘이 없고, 평형이다.`,
    facts: s => { const r = M.bead(s.bead.t); return [['철사를 따라 잰 x', `${f(r.x)} m`], ['U = mgh', `${f(r.U)} J`], ['dU/dx (기울기)', `${f(r.slope)} J/m`], ['F = −dU/dx', `${f(r.F)} N`], ['K + U', `${f(r.K + r.U, 3)} J`]]; } },
  bond: { text: `결합은 레너드-존스 모형 U = ε[(r<sub>0</sub>/r)¹² − 2(r<sub>0</sub>/r)⁶], r<sub>0</sub> = ${f(M.BOND.r0 * 1e9)} nm으로 나타내며, 무거운 원자는 거의 움직이지 않는다. 잔상은 U = E가 되어 원자가 멈추는 되돌이점을 표시한다. 파란 점선 포물선은 k = U″(r<sub>0</sub>) = ${f(M.BOND.k, 0)} N/m인 ½k(r − r<sub>0</sub>)²이다. 이것이 우물 바닥에 잘 맞기 때문에 작은 진동은 ω² = U″/m인 단순 조화 운동이 된다. 더 높은 곳에서 실제 우물은 안쪽은 가파르고 바깥쪽은 완만하게 비대칭이므로, 이 진동은 더 느리고 늘어난 상태에 더 오래 머문다.`,
    facts: s => { const r = M.bond(s.bond.t); return [['r', `${f(r.r * 1e9, 4)} nm`], ['U', `${f(r.U / M.EV, 3)} eV`], ['K = E − U', `${f(r.K / M.EV, 3)} eV`], ['F = −dU/dr', `${f(r.F * 1e9)} nN`], ['k = U″(r₀)', `${f(M.BOND.k, 0)} N/m`], ['작은 진동의 T / 이 진동', `${f(2 * Math.PI / M.BOND.w * 1e15)} / ${f(M.BOND.period * 1e15)} fs`]]; } },
  pendulum: { text: `무게는 경로 방향의 mg sin θ와 줄 방향의 mg cos θ로 나뉜다. 일을 하는 것은 mg sin θ뿐이다. 이 성분은 올라갈 때 추를 느리게 하고 내려갈 때 빠르게 한다. 장력과 mg cos θ는 운동에 수직이어서 일을 하지 않으며, 그래서 K + U<sub>g</sub>가 일정하게 유지된다.`,
    facts: s => { const r = M.pendulum(s.pendulum.t); return [['각 θ', `${f(r.th * 180 / Math.PI, 1)}°`], ['mg sin θ (경로 방향)', `${f(r.Ftan)} N`], ['장력 T', `${f(r.T)} N, 일 없음`], ['K', `${f(r.K)} J`], ['U_g', `${f(r.U)} J`], ['K + U_g', `${f(r.K + r.U)} J`]]; } },
  slide: { text: `무게와 수직 항력은 일을 하지 않으므로 제쳐 둔다. 운동 방향의 힘은 마찰력뿐이며, 뒤쪽을 향한다. θ = 180°이므로 그 일은 −f·Δx다. 이 음의 일은 잃어버린 운동 에너지와 정확히 같으며, 블록과 바닥의 열로 다시 나타난다.`,
    facts: s => { const r = M.slide(s.slide.t); return [['마찰력 f = μk mg', `${f(M.SLIDE.f)} N`], ['Δx', `${f(r.x)} m`], ['W_f = −f Δx', `${f(r.Wf)} J`], ['K', `${f(r.K)} J`], ['열에너지', `${f(r.Eth)} J`], ['K + 열에너지', `${f(r.K + r.Eth)} J`]]; } },
  lift: { text: `회색 화살표는 각 상자가 올라간 높이 Δy다. 일정한 속력에서 밧줄이 당기는 힘은 무게와 같으므로, 각 밧줄은 W = mgΔy의 일을 한다. 높이가 같으면 일도 같다. 빠른 상자는 절반의 시간에 도달하므로 그 밧줄은 두 배의 일률을 낸다.`,
    facts: s => { const a = M.lift(s.lift.t, M.LIFT.vFast), b = M.lift(s.lift.t, M.LIFT.vSlow); return [['T = mg', `${f(M.LIFT.W, 1)} N`], ['빠름: 지금까지 한 일', `${f(a.W, 0)} J, P ${f(a.P, 0)} W`], ['느림: 지금까지 한 일', `${f(b.W, 0)} J, P ${f(b.P, 0)} W`], ['P = Fv (빠름)', `${f(M.LIFT.W, 0)} × ${f(M.LIFT.vFast, 1)} = ${f(M.LIFT.Pfast, 0)} W`]]; } },
};
