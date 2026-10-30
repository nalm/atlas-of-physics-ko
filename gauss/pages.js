// Chapter 10, page by page (after the AP Physics C E&M organizer, Unit 2). Text and an E(r) chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, Y0 } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const nC = q => f(q * 1e9, 2);
const arrowNote = s => `화살표: 1 kN/C당 ${f(s, 1)}칸. 격자 한 칸은 10 cm.`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const cs = [cursor, ...cursors].filter(Boolean).map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  flux: { x0: 0, x1: 180, y0: -80, y1: 80 },
  point: { x0: 0, x1: 26, y0: 0, y1: 2 },
  line: { x0: 0, x1: 22, y0: 0, y1: 0.8 },
  sheet: { x0: -15, x1: 15, y0: -0.5, y1: 0.5 },
  sphere: { x0: 0, x1: 26, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 17, y0: 0, y1: 0.8 },
  cage: { x0: -40, x1: 40, y0: 0, y1: 3.2 },
};
const kE = fn => r => fn(r / 100) / 1000;     // r in cm → E in kN/C
const sphereChart = (fn, cursor, extra = []) => chart({ ...R.sphere, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursor, label: '중심으로부터의 거리에 따른 전기장 세기',
  vlines: [[10, 'R']], series: [...extra, { pts: curve(kE(fn), 0.001, 26, 120) }] });

export const PAGES = [
  {
    kicker: '10장', title: '전기 선속', sub: '전기장이 얼마나 통과하는가',
    body: `
      <p class="lede">어떤 면을 지나는 장의 <b>선속</b> Φ는 그 면을 통과하는 장의 양을 나타낸다. 면을 꿰뚫는 전기력선의 수를 세면 된다.</p>
      <div class="eq">Φ = <b>E</b> · <b>A</b> = <i>EA</i> cos θ</div>
      <p>면적 벡터 <b>A</b>는 면에 수직이고 길이는 넓이와 같다. θ는 <b>E</b>와 <b>A</b> 사이의 각이다. 전기장이 셀수록, 넓이가 클수록, 면이 정면을 향할수록 선속이 커진다. 단위: N·m²/C.</p>
      <p>한 변이 ${f(M.FLUX.side * 100, 0)} cm인 정사각형이 ${f(M.FLUX.E / 1000, 1)} kN/C의 균일한 전기장 속에서 돈다. 정면이면 Φ = ${f(M.FLUX.max, 0)} N·m²/C, 옆면이면 0, 90°를 넘어가면 음수다. 균일한 전기장이 어떤 <i>닫힌</i> 면을 지나는 선속은 0이다.</p>
      <div class="charts">${chart({ ...R.flux, zero: true, xlabel: 'θ (°)', ylabel: 'Φ (N·m²/C)', cursor: 'flux', label: '각도에 따른 선속', series: [{ pts: curve(M.flux, 0, 180) }] })}</div>
      <p class="hintline">정사각형을 클릭하면 <b>E</b>가 나뉜다. ${arrowNote(SC.flux)}</p>`,
    cam: { target: [STATIONS.flux + 0.3, Y0 - 0.2, 0], az: -16, el: 26, dist: 17 }, lit: 'flux', scene: 'flux', look: {},
    fig: '균일한 전기장 속에서 도는 정사각형',
  },
  {
    kicker: '10.1', title: '가우스 법칙', sub: '나가는 선속 = 안의 전하',
    body: `
      <p class="lede">어떤 <b>닫힌</b> 면이든, 밖으로 나가는 전체 선속은 그 안에 든 전하를 ε<sub>0</sub>으로 나눈 값이다.</p>
      <div class="eq">∮ <b>E</b> · d<b>A</b> = <i>q</i><sub>enc</sub> / ε<sub>0</sub></div>
      <p>d<b>A</b>는 바깥쪽을 향한다. 구가 커졌다 작아졌다 해도 Φ는 ${f(M.POINT.flux, 0)} N·m²/C로 그대로다. <i>E</i>는 1/<i>r</i>²로 줄고 넓이 4π<i>r</i>²는 <i>r</i>²로 늘기 때문이다. 구면 위에서 <b>E</b> ∥ d<b>A</b>이고 <i>E</i>가 일정하므로</p>
      <div class="eq"><i>E</i> · 4π<i>r</i>² = <i>q</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kq</i>/<i>r</i>²</div>
      <p>이것이 쿨롱 법칙이다. 상자 안에는 전하가 없다. 들어온 전기력선은 모두 나가므로 선속은 0이다.</p>
      <div class="charts">${chart({ ...R.point, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursor: 'point', label: '거리에 따른 점전하의 전기장', series: [{ pts: curve(kE(M.pointE), 6.5, 26) }] })}</div>
      <p class="hintline">구를 클릭하면 d<b>A</b>, 상자를 클릭하면 각 면이 보인다. ${arrowNote(SC.point)}</p>`,
    cam: { target: [STATIONS.gauss + 1.2, Y0, 0], az: -10, el: 14, dist: 29 }, lit: 'gauss', scene: 'gauss', look: {},
    fig: `q = ${nC(M.POINT.q)} nC, 두 닫힌 면`,
  },
  {
    kicker: '10.2', title: '선전하', sub: '둘레를 감싸는 원통',
    body: `
      <p class="lede">미터당 전하 λ를 가진 무한한 직선. 대칭성 때문에 <b>E</b>는 직선에서 곧장 바깥쪽을 향하므로, 반지름 <i>r</i>, 길이 <i>L</i>인 동축 원통으로 감싼다.</p>
      <p>면을 두 밑면과 곡면인 옆면으로 나눈다. 밑면에서는 <b>E</b> ⊥ d<b>A</b>이므로 선속이 없다. 옆면에서는 <b>E</b> ∥ d<b>A</b>이고 <i>E</i>가 일정하다.</p>
      <div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ/<i>r</i></div>
      <p><i>L</i>이 약분되고, 전기장은 1/<i>r</i>로 점전하의 전기장보다 느리게 줄어든다. 여기서 λ = ${nC(M.LINE.lam)} nC/m이므로 10 cm에서 <i>E</i> = ${f(M.lineE(0.1), 0)} N/C이다.</p>
      <div class="charts">${chart({ ...R.line, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursor: 'line', label: '거리에 따른 선전하의 전기장', series: [{ pts: curve(kE(M.lineE), 4.5, 22) }] })}</div>
      <p class="hintline">원통을 클릭하면 밑면이 떨어진다. ${arrowNote(SC.line)}</p>`,
    cam: { target: [STATIONS.line, Y0, 0], az: -32, el: 18, dist: 23 }, lit: 'line', scene: 'line', look: {},
    fig: '밑면과 옆면',
  },
  {
    kicker: '10.3', title: '면전하와 도체판', sub: '면을 꿰뚫는 납작한 원통',
    body: `
      <p class="lede">납작한 원통이 각 면에 걸쳐 있다. 옆면은 <b>E</b>와 나란하므로 밑면으로만 선속이 지나고, 안에 든 전하는 σ<i>A</i>다.</p>
      <table class="data">
        <tr><th></th><th>부도체 면</th><th>금속판</th></tr>
        <tr><td>나가는 선속</td><td>두 밑면: 2<i>EA</i></td><td>한 밑면: <i>EA</i></td></tr>
        <tr><td>따라서 <i>E</i> =</td><td>σ/2ε<sub>0</sub> = ${f(M.SHEET.E, 0)} N/C</td><td>σ/ε<sub>0</sub> = ${f(M.PLATE.E, 0)} N/C</td></tr>
      </table>
      <p>금속 안에서는 <i>E</i> = 0이므로 판 안쪽 밑면으로는 아무것도 지나지 않는다. 여기서 σ = ${nC(M.SHEET.sigma)} nC/m²는 면전하, 그리고 판의 <i>각 면</i>의 단위 넓이당 전하다. 두 전기장 모두 거리에 무관한 균일한 전기장이다.</p>
      <div class="charts">${chart({ ...R.sheet, zero: true, xlabel: '가운데로부터의 높이 (cm)', ylabel: 'E (kN/C, 위쪽)', label: '면전하와 금속판에서 높이에 따른 전기장',
        series: [{ cls: 'trend', pts: [[-15, -M.SHEET.E / 1000], [0, -M.SHEET.E / 1000], [0, M.SHEET.E / 1000], [15, M.SHEET.E / 1000]], tag: [-14, -M.SHEET.E / 1000 + 0.1, '면'] },
          { pts: [[-15, -M.PLATE.E / 1000], [-3, -M.PLATE.E / 1000], [-3, 0], [3, 0], [3, M.PLATE.E / 1000], [15, M.PLATE.E / 1000]], tag: [5, M.PLATE.E / 1000 - 0.16, '판'] }] })}</div>
      <p class="hintline">어느 쪽이든 클릭하면 납작한 원통이 열린다. ${arrowNote(SC.sheet)}</p>`,
    cam: { target: [(STATIONS.sheet + STATIONS.plate) / 2, Y0, 0], az: -10, el: 24, dist: 30 }, lit: 'sheet', scene: 'sheet', look: {},
    fig: '면전하와 금속판',
  },
  {
    kicker: '10.4', title: '금속 구', sub: '안과 밖',
    body: `
      <p class="lede">도체에서 전하는 <b>표면</b>으로 퍼진다. 금속 안에 그린 가우스 구면은 전하를 전혀 감싸지 않는다.</p>
      <table class="data">
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>q</i><sub>enc</sub> = 0</td><td><i>E</i> = 0</td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>q</i><sub>enc</sub> = <i>Q</i></td><td><i>E</i> · 4π<i>r</i>² = <i>Q</i>/ε<sub>0</sub> → <i>E</i> = <i>kQ</i>/<i>r</i>²</td></tr>
      </table>
      <p>바깥에서 구는 중심에 놓인 점전하처럼 행동한다. 전기장은 표면에서 0에서 <i>kQ</i>/<i>R</i>² = ${f(M.cSphere.E(M.SPH.R), 0)} N/C로 껑충 뛴다. 여기서 <i>Q</i> = ${nC(M.SPH.Q)} nC, <i>R</i> = ${f(M.SPH.R * 100, 0)} cm. 안을 볼 수 있도록 쐐기 모양으로 잘라 냈다.</p>
      <div class="charts">${sphereChart(M.cSphere.E, 'csphere')}</div>
      <p class="hintline">구를 클릭하면 가우스 구면이 감싸는 것이 보인다. ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.csphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'csphere', scene: 'csphere', look: {},
    fig: '전하는 표면에만',
  },
  {
    kicker: '10.5', title: '절연체 구', sub: '속까지 고루 퍼진 전하',
    body: `
      <p class="lede">절연체에서 전하는 제자리에 머문다. 여기서는 부피 전체에 고르게 퍼져 있다. ρ = <i>Q</i>/(⁴⁄₃π<i>R</i>³) = ${f(M.SPH.rho * 1e6, 3)} μC/m³.</p>
      <p>안에서는 <i>q</i><sub>enc</sub> = ρ⁴⁄₃π<i>r</i>³이다. 안에서는 작은 <i>r</i>, 밖에서는 큰 <i>R</i>를 쓴다.</p>
      <table class="data eqs">
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>r</i>³/ε<sub>0</sub></td><td><i>E</i> = ρ<i>r</i>/3ε<sub>0</sub>, 안</td></tr>
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>R</i>³/ε<sub>0</sub></td><td><i>E</i> = <i>kQ</i>/<i>r</i>², 밖</td></tr>
      </table>
      <p><i>E</i>는 선형으로 커져 표면에서 최대가 되고, 그 뒤 1/<i>r</i>²로 줄어든다. 바깥에서는 금속 구(같은 <i>Q</i>, <i>R</i>)와 같다. 속이 비어 있다면 빈 곳에서 <i>E</i> = 0이다.</p>
      <div class="charts">${sphereChart(M.iSphere.E, 'isphere')}</div>
      <p class="hintline">구를 클릭하면 감싼 전하가 보인다. ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.isphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'isphere', scene: 'isphere', look: {},
    fig: '안에서는 E ∝ r, 밖에서는 1/r²',
  },
  {
    kicker: '10.6', title: '대전된 막대', sub: '금속과 절연체',
    body: `
      <p class="lede">반지름 <i>R</i> = ${f(M.ROD.R * 100, 0)} cm인 긴 막대 두 개가 각각 미터당 λ = ${nC(M.ROD.lam)} nC를 띤다. 각각을 동축 원통으로 감싸며, 원통의 밑면으로는 선속이 지나지 않는다.</p>
      <table class="data">
        <tr><th></th><th>금속 (표면에 σ)</th><th>절연체 (내부에 ρ)</th></tr>
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>E</i> = 0</td><td><i>E</i> = ρ<i>r</i>/2ε<sub>0</sub></td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>E</i> = σ<i>R</i>/ε<sub>0</sub><i>r</i></td><td><i>E</i> = ρ<i>R</i>²/2ε<sub>0</sub><i>r</i></td></tr>
      </table>
      <p>절연체 안에서는 <i>q</i><sub>enc</sub> = ρπ<i>r</i>²<i>L</i>이고 <i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub>이다. 바깥에서는 둘 다 그냥 2<i>k</i>λ/<i>r</i>, 다시 선전하의 전기장이다. 속이 빈 절연체 막대나 구는 빈 곳에서 <i>E</i> = 0이다.</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursors: ['crod', 'irod'], label: '거리에 따른 막대의 전기장', vlines: [[5, 'R']],
        series: [{ cls: 'trend', pts: curve(kE(M.cRod.E), 0.001, 17, 120), tag: [1.2, 0.07, '금속'] }, { pts: curve(kE(M.iRod.E), 0.001, 17, 120), tag: [1.6, 0.36, '절연체'] }] })}</div>
      <p class="hintline">막대를 클릭하면 원통이 감싸는 것이 보인다. ${arrowNote(SC.rod)}</p>`,
    cam: { target: [(STATIONS.crod + STATIONS.irod) / 2, Y0 + 0.3, 0], az: -12, el: 14, dist: 19 }, lit: 'irod', scene: 'rods', look: {},
    fig: '왼쪽은 금속, 오른쪽은 절연체',
  },
  {
    kicker: '10.7', title: '고르지 않은 전하', sub: 'ρ(r) = br',
    body: `
      <p class="lede">ρ가 <i>r</i>에 따라 변하면 얇은 껍질을 더한다. 각 껍질은 ρ(<i>r</i>) · 4π<i>r</i>² d<i>r</i>의 전하를 가진다.</p>
      <div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ · 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴</div>
      <p>안에서는 <i>E</i> · 4π<i>r</i>² = π<i>br</i>⁴/ε<sub>0</sub> → <i>E</i> = <i>br</i>²/4ε<sub>0</sub>. 밖에서는 <i>E</i> = <i>bR</i>⁴/4ε<sub>0</sub><i>r</i>². 여기서 <i>b</i> = ${f(M.SPH.b * 1e6, 2)} μC/m⁴로, 전체 전하는 같은 ${nC(M.SPH.Q)} nC다.</p>
      <table class="data"><tr><th>ρ(r)</th><td>C</td><td>br</td><td>br²</td><td>br³</td></tr><tr><th>안에서 E ∝</th><td>r</td><td>r²</td><td>r³</td><td>r⁴</td></tr></table>
      <div class="charts">${sphereChart(M.nSphere.E, 'nsphere', [{ cls: 'trend', pts: curve(kE(M.iSphere.E), 0.001, 10, 40), tag: [3.5, 0.95, '균일'] }])}</div>
      <p class="hintline">전하 점은 중심으로 갈수록 성기다. ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.nsphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'nsphere', scene: 'nsphere', look: {},
    fig: '표면으로 갈수록 빽빽하다',
  },
  {
    kicker: '10.8', title: '도체', sub: '평형 상태: 패러데이 상자',
    body: `
      <p class="lede">도체 속 전하가 움직임을 멈추면</p>
      <ol class="rules">
        <li>금속 내부 어디서나 <i>E</i> = 0이다.</li>
        <li>남는 전하는 모두 표면에 있다.</li>
        <li>표면 바로 바깥에서 <b>E</b>는 표면에 수직이고 <i>E</i> = σ/ε<sub>0</sub>이다.</li>
        <li>안에 전하가 없는 빈 공간에는 전기장이 없다. 이것이 <b>패러데이 상자</b>다.</li>
      </ol>
      <p>대전되지 않은 이 껍질은 ${f(M.CAGE.E0 / 1000, 1)} kN/C의 균일한 전기장 속에 있다. 전자가 왼쪽으로 몰리면서 오른쪽은 양전하를 띤다. 이 전하들의 전기장이 내부의 <b>E</b><sub>0</sub>을 상쇄하고, 전기력선을 휘어 표면과 수직으로 만나게 한다. (전류가 흐르면 도선 안의 <i>E</i>는 0이 아니다.)</p>
      <div class="charts">${chart({ ...R.cage, xlabel: 'x (cm)', ylabel: 'E (kN/C)', label: '껍질을 지나는 축을 따른 전기장', vlines: [[-14, '−R'], [14, 'R']],
        series: [{ pts: curve(x => M.len(M.cageField([x / 100, 0, 0])) / 1000, -40, 40, 400) }] })}</div>
      <p class="hintline">껍질을 클릭하면 금속 안의 가우스면이 보인다. ${arrowNote(SC.cage)}</p>`,
    cam: { target: [STATIONS.cage, Y0, 0], az: -18, el: 14, dist: 21 }, lit: 'cage', scene: 'cage', look: {},
    fig: '껍질 안에는 전기장이 없다',
  },
];

// ---------- click a scene: what it breaks into ----------
const rNow = (s, sc) => M.breathe(s.clock, sc.rMin, sc.rMax, sc.T);
const sphereFacts = model => s => { const r = rNow(s, M.SPH); return [['가우스면 반지름 r', `${f(r * 100, 1)} cm (R = ${f(M.SPH.R * 100, 0)} cm)`], ['q<sub>enc</sub>', `${nC(model.qenc(r))} nC`], ['선속 q<sub>enc</sub>/ε<sub>0</sub>', `${f(model.qenc(r) / M.EPS0, 1)} N·m²/C`], ['E = 선속 / 4πr²', `${f(model.E(r), 0)} N/C`]]; };
const rodFacts = model => s => { const r = rNow(s, M.ROD); return [['가우스면 반지름 r', `${f(r * 100, 1)} cm (R = ${f(M.ROD.R * 100, 0)} cm)`], ['원통 길이 L', `${f(M.ROD.L * 100, 0)} cm`], ['q<sub>enc</sub>', `${f(model.qenc(r) * 1e12, 0)} pC`], ['E = q<sub>enc</sub>/(ε<sub>0</sub> 2πrL)', `${f(model.E(r), 0)} N/C`]]; };
export const PLATES = {
  flux: { text: `<b>E</b>는 <b>A</b> 방향 성분 <i>E</i> cos θ와, 면 안에 놓여 통과하지 않고 스쳐 지나가는 성분 <i>E</i> sin θ로 나뉜다. 선속을 나르는 것은 앞의 성분뿐이다. 같은 말로, 전기장 방향으로 비친 정사각형의 그림자(점선)의 넓이가 <i>A</i> cos θ다.`,
    facts: s => { const d = M.fluxAngle(s.clock); return [['θ', `${f(d, 1)}°`], ['E cos θ', `${f(M.FLUX.E * Math.cos(d * Math.PI / 180), 0)} N/C`], ['A', `${f(M.FLUX.A, 3)} m²`], ['Φ = EA cos θ', `${f(M.flux(d), 1)} N·m²/C`]]; } },
  gauss: { text: `작은 면 조각 d<b>A</b>(검정)는 모두 <b>E</b>(파랑)를 따라 곧장 바깥쪽을 향한다. 따라서 모든 조각에서 <b>E</b> · d<b>A</b> = <i>E</i> d<i>A</i>이고, 구면 어디서나 <i>E</i>가 같으므로 ∮ <i>E</i> d<i>A</i> = <i>E</i> · 4π<i>r</i>²이다.`,
    facts: s => { const r = rNow(s, M.POINT); return [['r', `${f(r * 100, 1)} cm`], ['E = kq/r²', `${f(M.pointE(r), 0)} N/C`], ['4πr²', `${f(4 * Math.PI * r * r, 4)} m²`], ['Φ = E · 4πr²', `${f(M.pointE(r) * 4 * Math.PI * r * r, 1)} N·m²/C`], ['q/ε<sub>0</sub>', `${f(M.POINT.flux, 1)} N·m²/C`]]; } },
  box: { text: `여섯 면을 떼어 놓고, 각 면에 전하의 전기장으로부터 수치적으로 합산한 선속을 N·m²/C 단위로 적었다. 전하에 가장 가까운 면으로는 선속이 들어오고(−), 나머지 다섯 면으로는 나간다(+). 모두 더하면 0이다. 상자가 감싸는 전하가 없기 때문이다.`,
    facts: () => { const b = M.boxFaces(); return [['가까운 면 (들어옴)', `${f(b[1], 1)} N·m²/C`], ['먼 면', `${f(b[0], 1)} N·m²/C`], ['네 옆면', `${f(b[2] + b[3] + b[4] + b[5], 1)} N·m²/C`], ['합계', `${f(Math.abs(b.reduce((a, c) => a + c)) < 0.05 ? 0 : b.reduce((a, c) => a + c), 1)} N·m²/C`]]; } },
  line: { text: `밑면이 떨어져 나온다. 밑면에서는 전기장이 면 안에 납작하게 놓이므로(회색 화살표) <b>E</b> ⊥ d<b>A</b>이고 선속이 지나지 않는다. 모든 선속은 <b>E</b> ∥ d<b>A</b>인 곡면 옆면으로 나간다.`,
    facts: s => { const r = rNow(s, M.LINE); return [['r', `${f(r * 100, 1)} cm`], ['옆면 넓이 2πrL', `${f(2 * Math.PI * r * M.LINE.L, 4)} m²`], ['E = 2kλ/r', `${f(M.lineE(r), 0)} N/C`], ['옆면을 지나는 선속', `${f(M.lineE(r) * 2 * Math.PI * r * M.LINE.L, 2)} N·m²/C`], ['λL/ε<sub>0</sub>', `${f(M.LINE.lam * M.LINE.L / M.EPS0, 2)} N·m²/C`]]; } },
  sheet: { text: `밑면이 들어 올려진다. 각 밑면으로 <i>EA</i>가 바깥쪽으로 나가고, 옆면으로는 나가지 않는다. 2<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>이므로, 납작한 원통의 높이와 상관없이 <i>E</i> = σ/2ε<sub>0</sub>이다.`,
    facts: () => [['σ', `${nC(M.SHEET.sigma)} nC/m²`], ['밑면 넓이 A', `${f(M.SHEET.Abox * 1e4, 1)} cm²`], ['q<sub>enc</sub> = σA', `${f(M.SHEET.sigma * M.SHEET.Abox * 1e12, 1)} pC`], ['E = σ/2ε<sub>0</sub>', `${f(M.SHEET.E, 0)} N/C`]] },
  plate: { text: `안쪽 밑면은 <i>E</i> = 0인 금속 안에 있으므로 바깥 밑면으로만 선속이 지난다. <i>EA</i> = σ<i>A</i>/ε<sub>0</sub>. 면전하와 σ는 같지만 전기장은 두 배다.`,
    facts: () => [['각 면의 σ', `${nC(M.PLATE.sigma)} nC/m²`], ['금속 안의 E', '0'], ['바깥의 E = σ/ε<sub>0</sub>', `${f(M.PLATE.E, 0)} N/C`]] },
  csphere: { text: `금속이 흐려진다. 안에서 가우스 구면은 아무것도 감싸지 않으므로 선속도, 전기장도 없다. 금속보다 커지면 <i>Q</i> 전체(빨간 껍질)를 감싸고 <i>E</i> = <i>kQ</i>/<i>r</i>²이 된다.`, facts: sphereFacts(M.cSphere) },
  isphere: { text: `빨간 공은 가우스 구면이 감싸는 전하다. 안에서는 이 전하가 <i>r</i>³로, 넓이는 <i>r</i>²로 커지므로 <i>E</i>는 <i>r</i>에 비례해 커진다. 바깥에서는 <i>Q</i>에서 멈춘다.`, facts: sphereFacts(M.iSphere) },
  nsphere: { text: `빨간 공은 감싼 전하로, 이번에는 π<i>br</i>⁴이다. 바깥 껍질일수록 전하가 많아서 <i>r</i>⁴로 빠르게 커지고, <i>E</i> = <i>q</i><sub>enc</sub>/(4π<i>r</i>²ε<sub>0</sub>)는 <i>r</i>²로 커진다.`, facts: sphereFacts(M.nSphere) },
  crod: { text: `금속이 흐려진다. 금속 안의 가우스 원통은 전하를 감싸지 않는다. 바깥에서는 σ · 2π<i>RL</i>(빨강)을 감싸고, <i>E</i> · 2π<i>rL</i> = σ2π<i>RL</i>/ε<sub>0</sub>이다.`, facts: rodFacts(M.cRod) },
  irod: { text: `빨간 심은 가우스 원통 안의 전하로, <i>r</i> &lt; <i>R</i>인 동안 ρπ<i>r</i>²<i>L</i>이다. ε<sub>0</sub>과 옆면 넓이 2π<i>rL</i>로 나누면 <i>E</i> = ρ<i>r</i>/2ε<sub>0</sub>.`, facts: rodFacts(M.iRod) },
  cage: { text: `금속 안에 가우스 구면(점선)을 그렸다. 그 위에서 <i>E</i> = 0이므로 감싼 알짜 전하가 없다. 즉 안쪽 벽에는 전하가 없고, 빈 곳에는 전기장이 없다. 표면의 화살표는 표면에 수직이다. − 쪽에서는 들어가고, + 쪽에서는 나온다.`,
    facts: () => [['E<sub>0</sub>', `${f(M.CAGE.E0, 0)} N/C`], ['+ 극의 σ', `${f(M.cageSigma(1) * 1e9, 2)} nC/m²`], ['극에서의 E = σ/ε<sub>0</sub>', `${f(M.cageSigma(1) / M.EPS0, 0)} N/C`], ['빈 곳의 E', '0'], ['껍질의 알짜 전하', '0']] },
};
