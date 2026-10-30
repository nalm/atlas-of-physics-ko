// Chapter 15, page by page (after the AP Physics C E&M organizer, Unit 8). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const GREY = '#86868c';

// ---------- small SVG charts for the left page: two quantities, one axis each side ----------
const W = 420, HH = 160, P = { l: 44, r: 44, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (HH - P.t - P.b) };
function chart({ L, Rt, series, xlabel, ylabel, rlabel, marks = [], cursors = [], label, under = '' }) {
  const { x0, x1 } = L, sx = x => CH.sx(x, x0, x1), sy = (y, a = L) => CH.sy(y, a.y0, a.y1);
  const paths = series.map(s => { const a = s.r ? Rt : L, c = s.r ? GREY : null;
    return `<path class="curve"${c ? ` style="stroke:${c}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y, a).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1], a) - 6}"${c ? ` style="fill:${c}"` : ''}>${s.tag[2]}</text>` : ''); }).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = L.y0 < 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${HH}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${HH - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(L.y1) + 4}" text-anchor="end">${L.y1}</text><text class="ax" x="${P.l - 6}" y="${sy(L.y0) + 4}" text-anchor="end">${L.y0}</text>
    <text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y1, Rt) + 4}" style="fill:${GREY}">${Rt.y1}</text><text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y0, Rt) + 4}" style="fill:${GREY}">${Rt.y0}</text>
    <text class="ax" x="${P.l}" y="${HH - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${HH - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="lab" x="${W - P.r - 6}" y="${P.t + 13}" text-anchor="end" style="fill:${GREY}">${rlabel}</text>
    <text class="ax" x="${(P.l + W - P.r) / 2}" y="${HH - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, r]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${r ? ` style="fill:${GREY}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges (left and right axes), shared with the live cursors in main.js
export const R = {
  phi0: { x0: 0, x1: 6, y0: -40, y1: 40 }, emf0: { x0: 0, x1: 6, y0: -45, y1: 45 },
  i1: { x0: 0, x1: 6, y0: -2, y1: 2 }, emf2: { x0: 0, x1: 6, y0: -0.3, y1: 0.3 },
  phiW: { x0: 0, x1: 3, y0: 0, y1: 1.5 }, emfW: { x0: 0, x1: 3, y0: 0, y1: 2 },
  phiX: { x0: 0, x1: 2, y0: -40, y1: 40 }, emfX: { x0: 0, x1: 2, y0: -60, y1: 60 },
  v: { x0: 0, x1: 5, y0: 0, y1: 1 }, pw: { x0: 0, x1: 5, y0: 0, y1: 0.2 },
  iS: { x0: 0, x1: 4, y0: -2, y1: 2 }, eS: { x0: 0, x1: 4, y0: -6, y1: 6 },
  iRL: { x0: 0, x1: 8, y0: -3, y1: 3 }, vRL: { x0: 0, x1: 8, y0: -12, y1: 12 },
  qLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 }, iLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 },
};
// live energy bars (the LC circuit): heights set in main.js, full height = the total Q²/2C
export const BARS = { x: 90, w: 56, gap: 50, base: 112, top: 16 };
const barChart = (key, items, top) => `<svg class="chart" viewBox="0 0 ${W} ${BARS.base + 26}" role="img" aria-label="에너지 막대그래프, 실시간">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.top}" y2="${BARS.top}" style="stroke:#d4d4d0;stroke-dasharray:3 3"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${top}</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;
const sq = k => `격자 한 칸 = ${k}`;
const two = (l, r, o) => `<div class="charts">${chart({ L: R[l], Rt: R[r], cursors: [[l], [r, 1]], ...o })}</div>`;

// Lenz's four cases, from the model at mid-run
const lenzRows = M.CASES.map(c => {
  const r = M.lenzCase(c, M.LENZ.run * 0.6), Bdir = r.Bx < 0 ? '←' : '→', grows = c.move === 'in';
  return `<tr><td>${c.name}</td><td>${Bdir} ${grows ? '증가' : '감소'}</td><td>${f(r.emf * 1e6, 1)} µV</td><td>${r.emf > 0 ? '←' : '→'}</td></tr>`;
}).join('');
const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: '15장', title: '전자기 유도', sub: '선속이 변하면 기전력이 생긴다',
    body: `
      <p class="lede">전류는 자기장을 만든다. 패러데이는 그 반대를 발견했다. 고리를 지나는 자기 선속이 <b>변하면</b> 고리를 따라 전류가 흐른다.</p>
      <div class="eq">Φ<sub><i>B</i></sub> = ∫<i>B</i>·<i>dA</i> &nbsp;&nbsp; ε = −<i>d</i>Φ<sub><i>B</i></sub>/<i>dt</i></div>
      <p>선속은 고리에 걸친 곡면 위에서 자기장을 합한 것으로, 단위는 웨버(T·m²)다. 감은 수가 <i>N</i>이면 ε = −<i>N d</i>Φ/<i>dt</i>이다. 기전력은 시작도 끝도 없는 <b>유도 전기장</b>의 ∮<i>E</i>·<i>ds</i>이며, 이 전기장은 보존력장이 아니다. 여기서는 자석이 고리로 다가왔다가 멀어진다. ε는 Φ 그래프 기울기의 음수다.</p>
      ${two('phi0', 'emf0', { xlabel: 't (s)', ylabel: 'Φ (µWb)', rlabel: 'ε (µV)', label: '시간에 따른 고리의 선속과 기전력',
        series: [{ pts: samples(160, 0, 6, t => M.fluxScene(t).Phi * 1e6) }, { r: 1, pts: samples(160, 0, 6, t => M.fluxScene(t).emf * 1e6) }] })}
      <p class="hintline">고리를 클릭하면 면 조각마다 B·dA가 보인다. 1 m = 10칸; ${sq('5 mA')}.</p>`,
    cam: { target: [ST.flux + 1.0, 1.7, 0], az: 30, el: 12, dist: 13 }, lit: 'flux', scene: 'flux', look: {},
    fig: '고리를 드나드는 자석',
  },
  {
    kicker: '15.1', title: '렌츠 법칙', sub: '전류는 변화를 거스른다',
    body: `
      <p class="lede">음의 부호의 뜻: 유도 전류는 선속 자체가 아니라 선속의 <b>변화를 거스르는</b> 자기장 <i>B</i><sub>ind</sub>를 만든다.</p>
      <table class="data"><tr><th>경우</th><th>고리에서의 B</th><th>ε</th><th>B<sub>ind</sub></th></tr>${lenzRows}</table>
      <ul class="rules">
        <li>선속이 증가하면 <i>B</i><sub>ind</sub>는 <i>B</i>와 반대 방향;</li>
        <li>선속이 감소하면 <i>B</i><sub>ind</sub>는 <i>B</i>와 같은 방향;</li>
        <li>오른손 법칙으로 <i>B</i><sub>ind</sub>에서 <i>I</i>를 얻는다.</li>
      </ul>
      <p>이는 에너지 보존이다. 고리는 다가오는 극을 밀어내고 멀어지는 극을 끌어당기므로, 전류를 만들려면 일을 해야 한다. 덩어리 금속에서는 같은 제동이 <b>맴돌이 전류</b>를 만들어 금속을 데운다. 넓이 벡터는 왼쪽: <i>B</i>가 왼쪽을 향하면 Φ > 0.</p>
      <p class="hintline">고리를 클릭하면 고리 자신의 자기장이 점선으로 보인다. <i>I</i>와 점선 화살표는 방향만 나타낸다; ${sq('10 mT')}.</p>`,
    cam: { target: [ST.lenz - 0.35, 2.1, 0], az: 26, el: 8, dist: 21 }, lit: 'nIn', scene: 'lenz', look: {},
    fig: 'N극 또는 S극, 다가오거나 멀어지거나',
  },
  {
    kicker: '15.2', title: '상호 유도', sub: '한 전류가 다른 쪽의 기전력을',
    body: `
      <p class="lede">코일 1의 전류가 변하면 코일 2를 지나는 그 자기장이 변한다. 그 선속은 <i>I</i><sub>1</sub>에 비례하므로</p>
      <div class="eq">ε<sub>2</sub> = −<i>N</i><sub>2</sub><i>d</i>Φ<sub>2</sub>/<i>dt</i> = −<i>M dI</i><sub>1</sub>/<i>dt</i></div>
      <p><b>상호 인덕턴스</b> <i>M</i>은 기하학적 배치로 정해진다. 이 100회 코일들에서는 ${f(M.COILS.M * 1e6, 0)} µH이다. <b>철심</b>에 감으면 철이 두 감은 선 모두로 선속을 실어 나르며 μ<sub>r</sub> ≈ ${M.CORE.muR}배 강해진다: <i>M</i> = ${f(M.CORE.M * 1e3, 0)} mH. <i>I</i>(<i>t</i>)가 커지면 <i>B</i>(<i>t</i>)는 왼쪽으로 커지고 <i>B</i><sub>ind</sub>는 오른쪽을 향한다.</p>
      ${two('i1', 'emf2', { xlabel: 't (s)', ylabel: 'I₁ (A)', rlabel: 'ε₂ (mV)', label: '시간에 따른 코일 1의 전류와 코일 2의 기전력',
        series: [{ pts: samples(120, 0, 6, t => M.coilsScene(t).I1) }, { r: 1, pts: samples(120, 0, 6, t => M.coilsScene(t).emf * 1e3) }] })}
      <p class="hintline">어느 쪽이든 클릭하라. 코일 1은 ${sq('4 A')}, 코일 2는 0.5 mA, 철 속은 0.25 T.</p>`,
    cam: { target: [ST.mutual, 1.95, 0], az: 26, el: 10, dist: 13.5 }, lit: 'mutual', scene: 'mutual', look: {},
    fig: '코일 두 개; 철심',
  },
  {
    kicker: '15.3', title: '도선에서 멀어지기', sub: '더 약한 자기장 속으로',
    body: `
      <p class="lede">${M.WIRE.b * 100} × ${M.WIRE.a * 100} cm 고리가 ${M.WIRE.I} A가 흐르는 도선에서 ${M.WIRE.v * 100} cm/s로 멀어진다. <i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i>가 변하므로 띠로 나누어 더한다.</p>
      ${steps([
        ['Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i>', '띠'],
        ['&nbsp;&nbsp;&nbsp;= (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', ''],
        ['ε = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>)', '−<i>d</i>Φ/<i>dt</i>'],
      ])}
      <p>도선 아래에서 <i>B</i>는 종이 안쪽을 향하며 약해지므로, 전류는 시계 방향으로 흘러 종이 안쪽 방향 자기장을 보탠다.</p>
      ${two('phiW', 'emfW', { xlabel: 't (s)', ylabel: 'Φ (µWb)', rlabel: 'ε (µV)', label: '시간에 따른 선속과 기전력',
        series: [{ pts: samples(90, 0, 3, t => M.wireScene(t).Phi * 1e6) }, { r: 1, pts: samples(90, 0, 2.999, t => M.wireScene(t).emf * 1e6) }] })}
      <p class="hintline">고리를 클릭하면 띠들이 보인다. ⊗ 넓이 ∝ <i>B</i>. ${sq('0.4 mA')}.</p>`,
    cam: { target: [ST.wire - 0.3, 2.2, 0], az: 6, el: 6, dist: 17 }, lit: 'wire', scene: 'wire', look: {},
    fig: '긴 도선, 멀어지는 고리',
  },
  {
    kicker: '15.4', title: '운동 기전력', sub: '자기장 속을 움직이는 막대',
    body: `
      <p class="lede">금속 막대가 <i>B</i> 속을 <i>v</i>로 움직인다. 그 속의 전하도 함께 움직이므로 막대를 따라 <i>F</i> = <i>qv</i>×<i>B</i>를 받는다.</p>
      <p>자유 전하는 미끄러져 한쪽 끝에 +, 다른 쪽 끝에 −로 쌓인다. 이들의 전기장 <i>E</i>가 도로 밀어내며, 다음이 성립하면 전하가 멈춘다.</p>
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; ε = <i>EL</i> = <i>BLv</i></div>
      <table class="data">
        <tr><td><i>B</i>, <i>L</i>, <i>v</i></td><td>${M.BAR.B} T, ${M.BAR.L * 100} cm, ${M.BAR.v} m/s</td></tr>
        <tr><td><i>E</i> = <i>vB</i></td><td>${f(M.BAR.E, 2)} V/m</td></tr>
        <tr><td>ε = <i>BLv</i></td><td>${f(M.BAR.emf, 2)} V</td></tr>
      </table>
      <p>회로를 닫는 것이 없으므로, 전하가 한 번 갈라지고 나면 <b>전류는 흐르지 않는다</b>. 막대를 멈추면 전하가 다시 퍼진다.</p>
      <p class="hintline">막대를 클릭하면 전하 하나가 받는 두 힘이 보인다. 1 m = 4칸; ${sq('0.25 V/m')}.</p>`,
    cam: { target: [ST.bar, 1.75, 0], az: 8, el: 6, dist: 15 }, lit: 'bar', scene: 'bar', look: {},
    fig: '0.4 T 속을 0.5 m/s로 가는 막대',
  },
  {
    kicker: '15.5', title: '자기장 통과하기', sub: '가장자리만 중요하다',
    body: `
      <p class="lede">${M.CROSS.w * 100} × ${M.CROSS.h * 100} cm 고리가 ${M.CROSS.B} T인 ${M.CROSS.W * 100} cm 폭의 영역을 ${M.CROSS.v} m/s로 지나간다.</p>
      <table class="data">
        <tr><th>단계</th><th>Φ</th><th>ε</th></tr>
        <tr><td>들어갈 때</td><td>증가</td><td>−<i>Bhv</i> = −${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} mV</td></tr>
        <tr><td>모두 안에</td><td>일정 <i>Bhw</i></td><td>0</td></tr>
        <tr><td>나올 때</td><td>감소</td><td>+${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} mV</td></tr>
      </table>
      <p>균일한 자기장 속에서는 세로 두 변 모두 <i>BLv</i>를 같은 방향으로 밀어, 고리를 한 바퀴 돌면 상쇄된다. 전류는 한 변은 안에, 다른 변은 밖에 있을 때만 흐른다: ${M.CROSS.R} Ω을 통해 ${f(M.CROSS.B * M.CROSS.h * M.CROSS.v / M.CROSS.R * 1e3, 0)} mA.</p>
      ${two('phiX', 'emfX', { xlabel: 't (s)', ylabel: 'Φ (mWb)', rlabel: 'ε (mV)', label: '시간에 따른 선속과 기전력',
        series: [{ pts: samples(200, 0, 2, t => M.crossScene(t).Phi * 1e3) }, { r: 1, pts: samples(400, 0, 1.999, t => M.crossScene(t).emf * 1e3) }] })}
      <p class="hintline">고리를 클릭하면 각 변의 밀어내기가 보인다. ${sq('0.2 A')}.</p>`,
    cam: { target: [ST.crossing, 1.75, 0], az: 6, el: 6, dist: 15 }, lit: 'crossing', scene: 'crossing', look: {},
    fig: '들어가고, 지나고, 나온다',
  },
  {
    kicker: '15.6', title: '레일 위의 막대', sub: '회로가 있는 운동 기전력',
    body: `
      <p class="lede">저항으로 이은 레일이 회로를 닫는다. 막대에 ${M.RAIL.v0} m/s를 주고 놓는다.</p>
      ${steps([
        ['Φ = <i>BLx</i>, &nbsp;ε = <i>BLv</i>, &nbsp;<i>I</i> = <i>BLv</i>/<i>R</i>', '시계 반대 방향'],
        ['<i>F</i> = <i>ILB</i> = <i>B</i><sup>2</sup><i>L</i><sup>2</sup><i>v</i>/<i>R</i>', '뒤쪽'],
        ['<i>v</i> = <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>, &nbsp;τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup>', `${f(M.RAIL.tau, 1)} s`],
      ])}
      <p>제동력이 속력에 따라 커지므로 막대는 지수적으로 느려지며 ${f(M.RAIL.v0 * M.RAIL.tau * 100, 0)} cm를 미끄러진다. 막대가 잃는 일률 <i>Fv</i>는 정확히 <i>I</i><sup>2</sup><i>R</i>이다. 운동 에너지 ${f(0.5 * M.RAIL.m * M.RAIL.v0 ** 2 * 1e3, 0)} mJ 전부가 결국 열이 된다.</p>
      ${two('v', 'pw', { xlabel: 't (s)', ylabel: 'v (m/s)', rlabel: 'P = I²R (W)', label: '시간에 따른 막대의 속력과 소모 전력; 색칠한 넓이가 열',
        under: `<path data-area="pw" style="fill:#e4e4e8"/>`, series: [{ pts: samples(100, 0, 5, t => M.railScene(t).v) }, { r: 1, pts: samples(100, 0, 5, t => M.railScene(t).P) }], marks: [[M.RAIL.tau, M.RAIL.v0 / Math.E, 'τ에서 v₀/e']] })}
      <p class="live" id="raillive"></p>
      <p class="hintline">회로를 클릭하라. ${sq('2 A')}, 또는 0.25 N.</p>`,
    cam: { target: [ST.rails, 1.7, 0], az: 6, el: 7, dist: 15.5 }, lit: 'rails', scene: 'rails', look: {},
    fig: '자신의 전류로 제동된다',
  },
  {
    kicker: '15.7', title: '인덕턴스', sub: '코일은 자신의 변화와 싸운다',
    body: `
      <p class="lede">코일의 전류는 자기 자신의 감은 선을 지나는 선속을 만든다. 전류가 변하면 선속이 변하고, 그 변화를 거스르는 <b>역기전력</b>이 유도된다.</p>
      ${steps([
        ['<i>L</i> = <i>N</i>Φ/<i>I</i>, &nbsp;ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i>', '헨리, H'],
        ['<i>B</i> = μ<sub>0</sub><i>nI</i> → <i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup><i>A</i>/ℓ', `${f(M.SOL.L * 1e3, 2)} mH`],
        ['<i>U</i> = ½<i>LI</i><sup>2</sup>, &nbsp;<i>u</i> = <i>B</i><sup>2</sup>/2μ<sub>0</sub>', '저장'],
      ])}
      <p>${M.SOL.len * 100} cm에 ${M.SOL.N}회 감고 반지름 ${M.SOL.r * 100} cm(이렇게 짧은 코일에서는 μ<sub>0</sub><i>nI</i>가 ${f((1 - M.solCentreB(1) / (M.MU0 * M.SOL.n)) * 100, 0)} % 크게 나온다). ${M.SOL.ramp} s 동안 0 → ${M.SOL.Imax} A로 올리면 ε<sub><i>L</i></sub> = ${f(-M.SOL.L * M.SOL.Imax / M.SOL.ramp * 1e3, 2)} mV이고, 일정한 전류에서는 0이다. 인덕터는 갑작스러운 변화를 매끄럽게 만든다.</p>
      ${two('iS', 'eS', { xlabel: 't (s)', ylabel: 'I (A)', rlabel: 'ε_L (mV)', label: '시간에 따른 전류와 역기전력',
        series: [{ pts: samples(200, 0, 4, t => M.solCurrent(t).I) }, { r: 1, pts: samples(400, 0, 3.999, t => M.solScene(t).emfL * 1e3) }] })}
      <p class="hintline">400회 중 25회만 그렸다. 클릭하면 한 바퀴의 선속이 보인다. ${sq('5 mT')}.</p>`,
    cam: { target: [ST.solenoid, 1.85, 0], az: 22, el: 12, dist: 11.5 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: '전류를 서서히 올린 솔레노이드',
  },
  {
    kicker: '15.8', title: 'RL 회로', sub: '증가와 감쇠, τ = L/R',
    body: `
      <p class="lede">${M.RL.E} V, ${M.RL.R} Ω, ${M.RL.L} H. 고리를 한 바퀴 돌면 ε − <i>IR</i> − <i>L dI</i>/<i>dt</i> = 0이므로</p>
      <div class="eq"><i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), &nbsp;τ = <i>L</i>/<i>R</i></div>
      <p>처음에 인덕터는 <b>열린 스위치</b>다. <i>I</i> = 0이고 ${M.RL.E} V 전체가 인덕터에 걸린다. 나중에는 <b>그냥 도선</b>이 된다: <i>I</i> = ε/<i>R</i> = ${f(M.RL.Imax, 0)} A. 전지를 빼면 인덕터가 전류를 <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>로 계속 흐르게 하고, 그동안 ½<i>LI</i><sup>2</sup> = ${f(0.5 * M.RL.L * M.RL.Imax ** 2, 0)} J이 열이 된다. τ = ${f(M.RL.tau, 1)} s.</p>
      ${two('iRL', 'vRL', { xlabel: 't (s)', ylabel: 'I (A)', rlabel: 'ΔV (V)', label: '시간에 따른 전류와 인덕터 전압, 증가 후 감쇠',
        series: [{ pts: samples(320, 0, 7.999, t => M.rlScene(t).I) }, { r: 1, pts: samples(320, 0, 7.999, t => M.rlScene(t).VL), tag: [4.6, -8.5, 'L dI/dt'] }],
        marks: [[M.RL.tau, M.rlScene(M.RL.tau).I, '63 %'], [M.RL.phase + M.RL.tau, M.rlScene(M.RL.phase + M.RL.tau).I, '37 %']] })}
      <p class="hintline">검정: <i>I</i>, 오른쪽 눈금으로는 <i>IR</i>. 회로를 클릭하면 각 ΔV가 보인다. ${sq('4 A')}.</p>`,
    cam: { target: [ST.rl - 0.15, 1.75, 0], az: 8, el: 8, dist: 14 }, lit: 'rl', scene: 'rl', look: {},
    fig: '12 V, 4 Ω, 2 H',
  },
  {
    kicker: '15.9', title: 'LC 진동', sub: '코일을 오가며 출렁이는 전하',
    body: `
      <p class="lede">${f(M.LC.C * 1e6, 0)} µF 축전기를 ${f(M.LC.Q * 1e6, 0)} µC로 충전해 ${f(M.LC.L * 1e3, 0)} mH 코일에 연결한다. 전하가 코일을 통해 빠져나가고, 지나쳐서 극판을 반대로 충전한 뒤, 다시 돌아온다.</p>
      ${steps([
        ['<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i> = 0', '고리 법칙'],
        ['<i>L d</i><sup>2</sup><i>q</i>/<i>dt</i><sup>2</sup> + <i>q</i>/<i>C</i> = 0', '<i>I</i> = <i>dq</i>/<i>dt</i>'],
        ['<i>q</i> = <i>Q</i> cos ω<i>t</i>, &nbsp;<i>I</i> = −ω<i>Q</i> sin ω<i>t</i>', `ω = 1/√(<i>LC</i>) = ${f(M.LC.w, 0)} rad/s`],
      ])}
      <p>주기는 <i>T</i> = 2π√(<i>LC</i>) = ${f(M.LC.T * 1e3, 2)} ms(${f(M.LC.f, 0)} Hz)이고, 그림은 ${Math.round(M.LC.slow / 10) * 10}배 느리게 돌아간다. 전류는 <i>q</i>가 0을 지날 때 최대 ω<i>Q</i> = ${f(M.LC.Imax * 1e3, 0)} mA이고, 극판이 가득 찼을 때 0이다. 둘은 4분의 1 주기 차이다. 전류를 <i>q</i> = 0 너머로 계속 실어 나르는 것이 코일의 역기전력이다.</p>
      ${two('qLC', 'iLC', { xlabel: 't (ms)', ylabel: 'q (µC)', rlabel: 'I (mA)', label: '시간에 따른 위 극판의 전하와 전류',
        series: [{ pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).q * 1e6) }, { r: 1, pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).I * 1e3) }],
        marks: [[M.LC.T * 1e3, 100, 'T', 6, 14]] })}
      <div class="eq"><i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> = ${f(M.LC.U * 1e3, 2)} mJ</div>
      <div class="charts">${barChart('lc', [['UE', 'U_E = q²/2C', '#8fb0f0'], ['UB', 'U_B = ½LI²', '#c4c4c8'], ['U', '합계', '#f7f7f4']], `${f(M.LC.U * 1e3, 2)} mJ`)}</div>
      <table class="data"><tr><th>용수철에 매단 물체</th><th>LC 회로</th></tr>
        <tr><td><i>x</i>, &nbsp;<i>v</i></td><td><i>q</i>, &nbsp;<i>I</i></td></tr>
        <tr><td><i>m</i>, &nbsp;<i>k</i></td><td><i>L</i>, &nbsp;1/<i>C</i></td></tr>
        <tr><td>½<i>kx</i><sup>2</sup>, &nbsp;½<i>mv</i><sup>2</sup></td><td><i>q</i><sup>2</sup>/2<i>C</i>, &nbsp;½<i>LI</i><sup>2</sup></td></tr></table>
      <p class="hintline">극판이나 코일을 클릭하면 각각이 지닌 에너지가 보인다. ${sq('10 kV/m (E), 2 mT (B), 100 mA (I)')}.</p>`,
    cam: { target: [ST.lc + 0.3, 1.8, 0], az: 8, el: 8, dist: 12.5 }, lit: 'lcCap', scene: 'lc', look: {},
    fig: '25 µF, 40 mH, 100 µC',
  },
];

// ---------- click a scene: what it breaks into ----------
const lenzPlate = c => ({
  text: c.move === 'in'
    ? `${c.pole}극이 가까워지므로 그 자기장이 고리를 더 많이 지난다. 고리는 전류로 응답하는데, 그 전류 자신의 자기장(점선)은 고리를 반대 방향으로 지나고, 가까운 면은 역시 ${c.pole}극이 된다. 같은 극끼리이므로 자석이 밀려난다.`
    : `${c.pole}극이 멀어지므로 그 자기장이 고리를 덜 지난다. 이제 전류는 줄어든 만큼을 메우려고 고리를 같은 방향으로 지나는 자기장(점선)을 만든다. 가까운 면은 ${c.pole === 'N' ? 'S' : 'N'}극이 되어 자석을 끌어당긴다.`,
  facts: s => { const r = M.lenzCase(c, s.lenz.t); return [['거리', `${f(r.d * 100, 1)} cm`], ['중심의 B', `${f(Math.abs(r.Bx) * 1e3, 2)} mT ${r.Bx < 0 ? '←' : '→'}`], ['Φ (넓이 벡터 ←)', `${f(r.Phi * 1e6, 2)} µWb`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 2)} µV`], ['I = ε/R (R = 10 mΩ)', `${f(r.I * 1e3, 2)} mA`]]; },
});
export const PLATES = {
  flux: { text: `고리에 평평한 면을 펼치고 작은 조각 dA로 나눈다. 각 조각에서 B·dA는 면을 수직으로 뚫고 지나는 자기장에 조각 넓이를 곱한 것이다(회색 화살표: 고리 축 방향 성분). 모두 더하면 Φ가 된다. 자석 가까이에서는 화살표가 길고, 자석이 멀어지면 거의 없어질 만큼 줄어든다.`,
    facts: s => { const r = M.fluxScene(s.flux.t); return [['자석까지의 거리', `${f(r.d * 100, 1)} cm`], ['중심의 B', `${f(r.Bc * 1e3, 2)} mT`], ['Φ = ∫B·dA', `${f(r.Phi * 1e6, 2)} µWb`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 1)} µV`], ['I = ε/R (R = 10 mΩ)', `${f(r.I * 1e3, 2)} mA`]]; } },
  ...Object.fromEntries(M.CASES.map(c => [c.key, lenzPlate(c)])),
  mutual: { text: `코일 1의 자기력선(전류에 따라 흐려진다)이 코일 2를 지난다. 코일 2의 한 바퀴마다 지나는 선속은 MI₁/N₂이다. I₁이 커지는 동안 코일 2의 전류는 그에 반대하는 자기장(점선)을 만들고, I₁이 줄어드는 동안에는 같은 방향의 자기장을 만든다.`,
    facts: s => { const r = M.coilsScene(s.coil.t); return [['I₁', `${f(r.I1, 2)} A`], ['dI₁/dt', `${f(r.dI1, 2)} A/s`], ['M', `${f(M.COILS.M * 1e6, 0)} µH`], ['ε₂ = −M dI₁/dt', `${f(r.emf * 1e3, 3)} mV`], ['I₂ (R = 1 Ω)', `${f(r.I2 * 1e3, 3)} mA`]]; } },
  core: { text: `2차 코일을 들어 올린 모습: 철이 선속을 안내하므로 두 감은 선의 모든 바퀴에 같은 Φ = BA가 지난다. 2차 코일의 기전력은 한 바퀴의 N₂배이고, ε₂/ε₁ = N₂/N₁이다. 변압기는 이렇게 전압을 바꾼다.`,
    facts: s => { const r = M.coreScene(s.coil.t); return [['I₁', `${f(r.I1, 3)} A`], ['B = μᵣμ₀N₁I₁/ℓ', `${f(r.B, 3)} T`], ['철이 없을 때', `${f(r.Bair * 1e3, 3)} mT`], ['한 바퀴당 Φ', `${f(r.Phi * 1e6, 1)} µWb`], ['ε₂ = −N₂ dΦ/dt', `${f(r.emf2 * 1e3, 2)} mV`], ['ε₂/ε₁', `${f(r.emf2 / (r.emf1 || 1e-30), 2)}`]]; } },
  wire: { text: `B는 고리를 가로질러서는 변하지만 도선을 따라서는 변하지 않는다. 그러니 고리를 도선에 나란한 띠로 자른다. 각 띠는 폭 b, 높이 dr이다(자기장 세기에 따라 색칠). 각 띠의 선속은 B(r)·b dr이고, 적분하면 로그가 나온다. 같은 말로, 가까운 변은 B_near bv로, 먼 변은 B_far bv로 자기장을 가르며, 그 차가 ε이다.`,
    facts: s => { const r = M.wireScene(s.wire.t); return [['r (가까운 변)', `${f(r.r * 100, 1)} cm`], ['가까운 쪽 B', `${f(r.Bnear * 1e6, 0)} µT`], ['먼 쪽 B', `${f(r.Bfar * 1e6, 0)} µT`], ['Φ', `${f(r.Phi * 1e6, 3)} µWb`], ['ε = (B_near − B_far)bv', `${f(r.emf * 1e6, 3)} µV`], ['I (R = 10 mΩ)', `${f(r.I * 1e3, 3)} mA`]]; } },
  bar: { text: `막대 속의 + 전하 하나. 자기력 qv×B는 전하를 막대 위쪽으로 밀고, 이미 양 끝에 쌓인 전하들의 전기장 E는 qE로 아래로 민다. 두 힘이 평형을 이루면 전하는 막대와 함께만 움직인다. 막대를 따라 전하 하나에 하는 일은 vB·L = ε이다.`,
    facts: s => { const r = M.barScene(s.bar.t, s.bar.resting); return [['v', `${f(r.v, 2)} m/s`], ['qvB (양성자 하나의 전하)', `${(r.Fmag).toExponential(2)} N`], ['qE', `${(M.E_CHARGE * r.E).toExponential(2)} N`], ['E = vB', `${f(r.E, 2)} V/m`], ['ε = BLv', `${f(r.emf, 3)} V`], ['전류', '0']]; } },
  crossing: { text: `자기장 안에 있는 세로 변마다 v×B가 기전력 BLv로 전하를 변 위쪽으로 민다. 한 변만 안에 있으면 그 밀어내기가 전류를 고리 둘레로 흐르게 한다. 두 변이 모두 안에 있으면 두 밀어내기가 고리 둘레에서 정면으로 맞부딪혀 상쇄된다. 고리가 자기장 속을 움직이는데도 ε = 0이다.`,
    facts: s => { const r = M.crossScene(s.cross.t); return [['앞쪽 변', r.inLead ? '자기장 안' : '밖'], ['뒤쪽 변', r.inTrail ? '자기장 안' : '밖'], ['각 변의 BLv', `${f(r.sideEmf * 1e3, 0)} mV`], ['Φ', `${f(r.Phi * 1e3, 1)} mWb`], ['고리 둘레의 ε', `${f(r.emf * 1e3, 0)} mV`], ['I = ε/R', `${f(r.I * 1e3, 0)} mA`]]; } },
  rails: { text: `색칠한 넓이 Lx는 선속이 지나는 고리로, 막대가 움직이면서 커진다. 이로써 유도된 전류는 막대를 따라 위로 흐르고, 그 전류에 작용하는 ILB는 뒤쪽을 향한다(빨강: 유일한 수평 방향 힘, 곧 알짜힘). 이 제동 일률 Fv가 저항을 데운다.`,
    facts: s => { const r = M.railScene(s.rail.t); return [['v', `${f(r.v, 3)} m/s`], ['ε = BLv', `${f(r.emf, 3)} V`], ['I = ε/R', `${f(r.I, 3)} A`], ['F = ILB', `${f(r.F, 3)} N`], ['Fv', `${f(r.F * r.v, 4)} W`], ['I²R', `${f(r.P, 4)} W`], ['지금까지의 열', `${f(r.heat * 1e3, 1)} mJ`]]; } },
  solenoid: { text: `긴 코일 안에서 B = μ₀nI는 균일하므로 각 바퀴의 선속은 Φ = BA이다(색칠한 바퀴). N바퀴 전체의 선속은 NΦ이고, NΦ/I가 인덕턴스다. I가 변하면 NΦ가 변하고, 역기전력 −L dI/dt가 이를 거스르는 방향으로 생긴다. 전류가 커지는 동안에는 전류가 들어가는 쪽이 +이다.`,
    facts: s => { const r = M.solScene(s.sol.t); return [['I', `${f(r.I, 2)} A`], ['B = μ₀nI', `${f(r.B * 1e3, 2)} mT`], ['한 바퀴당 Φ = BA', `${f(r.Phi * 1e6, 2)} µWb`], ['NΦ = LI', `${f(r.NPhi * 1e3, 3)} mWb`], ['ε_L = −L dI/dt', `${f(r.emfL * 1e3, 2)} mV`], ['U = ½LI²', `${f(r.U * 1e3, 2)} mJ`]]; } },
  rl: { text: `전류를 따라 고리를 한 바퀴 돈다. 전지를 지나며 올라가고(+ε, 전지가 연결된 동안), 저항을 지나며 내려가고(−IR), 인덕터를 지나며 내려간다(−L dI/dt). 합은 언제나 0이다. 증가하는 동안에는 저항이 가져가지 않은 몫을 인덕터가 가져가고, 감쇠하는 동안에는 인덕터가 원천이 된다.`,
    facts: s => { const r = M.rlScene(s.rl.t); return [[r.growing ? '증가 중, t' : '감쇠 중, t', `${f(r.s, 2)} s`], ['I', `${f(r.I, 3)} A`], ['ε (전지)', `${f(r.emfBat, 1)} V`], ['IR', `${f(r.VR, 2)} V`], ['L dI/dt', `${f(r.VL, 2)} V`], ['U = ½LI²', `${f(r.U, 2)} J`], ['열 발생률 I²R', `${f(r.P, 2)} W`]]; } },
  lcCap: { text: `에너지는 극판 사이의 전기장에 있다(색칠: 에너지가 많을수록 진함). ΔV = q/C이고 U_E = q²/2C = ½CΔV²이다. 극판이 코일을 통해 비워지면 색이 옅어지고, 극판이 반대로 충전되어 E가 뒤집히면 다시 짙어진다.`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['t (실제)', `${f(s.lc.t * 1e3, 2)} ms`], ['q (위 극판)', `${f(r.q * 1e6, 1)} µC`], ['ΔV = q/C', `${f(r.V, 2)} V`], ['E = ΔV/d (d = 1 mm)', `${f(r.E / 1e3, 2)} kV/m`], ['U_E = q²/2C', `${f(r.UE * 1e3, 3)} mJ`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} mJ`]]; } },
  lcCoil: { text: `에너지는 코일의 자기장에 있다(색칠). U_B = ½LI²는 q가 0을 지날 때 가장 크다. 코일의 역기전력은 매 순간 축전기의 ΔV와 같아서 L dI/dt = −q/C이다. 극판이 차는 동안에는 전류를 늦추고, 비워지는 동안에는 전류를 계속 흐르게 한다.`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['I = dq/dt', `${f(r.I * 1e3, 1)} mA`], ['dI/dt = −q/LC', `${f(r.dI, 0)} A/s`], ['L dI/dt', `${f(M.LC.L * r.dI, 2)} V`], ['B = LI/NA (1600회)', `${f(r.B * 1e3, 3)} mT`], ['U_B = ½LI²', `${f(r.UB * 1e3, 3)} mJ`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} mJ`]]; } },
};
